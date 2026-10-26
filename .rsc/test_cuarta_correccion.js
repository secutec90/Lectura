/**
 * ST90 — CUARTA REVISIÓN ACOTADA: SUITE DE PRUEBAS LOCALES
 * 
 * Hallazgos evaluados:
 * 1. SEC-A02-02 — Revocación de sesión (restricción a actor autorizado, tokens de alumno y personal escolar, resiliencia ante fallos de red en cambiarAlumno).
 * 2. SEC-A03-03 — Idempotencia y recuperación (detección de duplicados más allá de las últimas 10 filas, clave Token Examen, desacoplamiento CacheService/Sheets).
 * 3. SEC-A03-02 — Modalidad y trimestre (rechazo de vacíos, no reconocidos y conflictos contra intento original).
 * 4. REGRESIÓN — Credenciales, suplantación, examen seguro y quiosco.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

console.log("================================================================================");
console.log("ST90 — CUARTA REVISIÓN ACOTADA: PRUEBAS LOCALES DE SEGURIDAD");
console.log("================================================================================");

const CODIGO_GS = fs.readFileSync(path.join(__dirname, "..", "Codigo.gs"), "utf8");
const ASISTENCIA_GS = fs.readFileSync(path.join(__dirname, "..", "Asistencia.gs"), "utf8");
const CLASE_LOGICA_GS = fs.readFileSync(path.join(__dirname, "..", "ClaseLogica.gs"), "utf8");

function verificarSintaxis(codigo, nombre) {
  try {
    new vm.Script(codigo, { filename: nombre });
    console.log(`[SYNTAX CHECK PASS] ${nombre}`);
  } catch (e) {
    console.error(`[SYNTAX CHECK FAIL] ${nombre}:`, e.message);
    process.exit(1);
  }
}

verificarSintaxis(CODIGO_GS, "Codigo.gs");
verificarSintaxis(ASISTENCIA_GS, "Asistencia.gs");
verificarSintaxis(CLASE_LOGICA_GS, "ClaseLogica.gs");

function crearContextoPruebas(opts = {}) {
  const entorno = opts.entorno || "PRODUCCION";
  const realId = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";

  const scriptProperties = {
    ENTORNO: entorno,
    HOJA_ID: realId,
    CLAVE_ADMIN_HASH: "099ebea48ea9666a7da21770e838242fa80a2b26", // sha1 de 'admin-dev' con 'salt123'
    CLAVE_ADMIN_SALT: "salt123",
    CLAVE_ADMIN_ES_DEFAULT: "0",
    ...(opts.customProperties || {})
  };

  const cacheStore = { ...(opts.initialCache || {}) };

  class HojaMock {
    constructor(nombre, datos) {
      this._nombre = nombre;
      this._data = datos ? JSON.parse(JSON.stringify(datos)) : [];
      this.clearCount = 0;
      this.simularFalloEscritura = false;
    }
    getName() { return this._nombre; }
    getLastRow() { return this._data.length; }
    getLastColumn() {
      if (!this._data.length) return 0;
      return this._data.reduce((max, row) => Math.max(max, row.length), 0);
    }
    appendRow(fila) {
      if (this.simularFalloEscritura) {
        throw new Error("Simulated Google Sheets Service Exception: Error al persistir fila.");
      }
      this._data.push(JSON.parse(JSON.stringify(fila)));
    }
    clearContents() {
      this.clearCount++;
      const headers = this._data.length > 0 ? this._data[0] : [];
      this._data = headers.length > 0 ? [headers] : [];
    }
    getRange(row, col, numRows = 1, numCols = 1) {
      const sheet = this;
      return {
        getValues: () => {
          const res = [];
          for (let r = 0; r < numRows; r++) {
            const rowIndex = row - 1 + r;
            const fila = sheet._data[rowIndex] || [];
            const filaRes = [];
            for (let c = 0; c < numCols; c++) {
              const colIndex = col - 1 + c;
              filaRes.push(fila[colIndex] !== undefined ? fila[colIndex] : "");
            }
            res.push(filaRes);
          }
          return res;
        },
        setValues: (matriz) => {
          if (sheet.simularFalloEscritura) {
            throw new Error("Simulated Google Sheets Service Exception: Error al actualizar valores.");
          }
          for (let r = 0; r < matriz.length; r++) {
            const rowIndex = row - 1 + r;
            while (sheet._data.length <= rowIndex) sheet._data.push([]);
            for (let c = 0; c < matriz[r].length; c++) {
              const colIndex = col - 1 + c;
              sheet._data[rowIndex][colIndex] = matriz[r][c];
            }
          }
        },
        setValue: (val) => {
          if (sheet.simularFalloEscritura) {
            throw new Error("Simulated Google Sheets Service Exception: Error al actualizar celda.");
          }
          const rowIndex = row - 1;
          const colIndex = col - 1;
          while (sheet._data.length <= rowIndex) sheet._data.push([]);
          sheet._data[rowIndex][colIndex] = val;
        },
        setFontWeight: () => {}
      };
    }
  }

  const sheetsMap = {};
  const defaultSheets = {
    Alumnos: [
      ["Matrícula", "Nombre Completo", "Grado", "Grupo", "Activo", "Intentos extra"],
      ["MAT_001", "ALUMNO UNO", "1", "a", "SI", 0],
      ["MAT_002", "ALUMNO DOS", "1", "b", "SI", 0],
      ["MAT_003", "ALUMNO TRES", "2", "a", "SI", 0]
    ],
    AccesoClaseAlumnos: [
      ["Matrícula", "Nombre", "Grado", "Grupo", "Usuario", "Salt", "Hash", "Activo", "Clave"],
      ["MAT_001", "ALUMNO UNO", "1", "A", "alu1", "saltAlu1", "hashAlu1", "SI", "clavePlana123"],
      ["MAT_002", "ALUMNO DOS", "1", "B", "alu2", "saltAlu2", "hashAlu2", "SI", "clavePlana456"]
    ],
    Prefectos: [
      ["Id", "Nombre", "Usuario", "Turno", "Salt", "Hash", "Activo", "Clave"],
      ["PREF_1", "Prefecta Uno", "pref1", "matutino", "saltP1", "hashP1", "SI", "clavePref123"]
    ],
    PrefectoGrupos: [
      ["Id prefecto", "Grado", "Grupo", "Turno"],
      ["PREF_1", "1", "A", "matutino"]
    ],
    MaestrosClase: [
      ["Id", "Nombre", "Usuario", "Turno", "Salt", "Hash", "Activo", "Clave"],
      ["DOC_1", "Docente Uno", "doc1", "matutino", "saltD1", "hashD1", "SI", "claveDoc123"]
    ],
    Horarios: [
      ["Id Maestro", "Maestro", "Asignatura", "Grado", "Grupo", "Dia", "Bloque", "Hora Inicio", "Hora Fin"],
      ["DOC_1", "Docente Uno", "Español", "1", "A", "Lunes", "1", "07:00", "07:50"]
    ],
    PersonalApoyo: [
      ["Id", "Nombre", "Usuario", "Área", "Salt", "Hash", "Activo", "Clave"],
      ["APO_1", "Apoyo Uno", "apo1", "Orientación", "saltA1", "hashA1", "SI", "claveApo123"]
    ],
    ApoyoGrupos: [
      ["Id apoyo", "Grado", "Grupo", "Turno"],
      ["APO_1", "1", "A", "matutino"]
    ],
    Grupos: [
      ["Grado", "Grupo", "Activo", "Intentos extra", "Turno"],
      ["1", "a", "SI", 0, "matutino"],
      ["1", "b", "SI", 0, "matutino"],
      ["2", "a", "SI", 0, "matutino"]
    ],
    Lecturas: [
      ["ID Lectura", "Grado", "Asignatura", "Tema", "Texto", "Palabras", "Preguntas JSON", "Activa", "Origen"],
      ["LEC_1", "1", "Español", "Mitología", "Texto de prueba con más de cuarenta palabras suficientes para el examen de comprensión y velocidad lectora.", 60, "[]", "SI", "banco"],
      ["LEC_REAL", "1", "Español", "Ciencia", "Texto científico largo de prueba con más de cuarenta palabras para validar la velocidad lectora y la comprensión.", 70, "[]", "SI", "banco"],
      ["LEC_TRIM_1", "1", "Español", "Lectura Trimestral", "Texto trimestral de prueba con más de cuarenta palabras para la evaluación unificada.", 50, "[]", "SI", "TRIMESTRE_1"]
    ],
    Preguntas: [
      ["ID Lectura", "Orden", "Enunciado", "Opción 1", "Opción 2", "Opción 3", "Opción 4", "Opción 5", "Opción 6", "Respuesta correcta", "Nivel"],
      ["LEC_1", 1, "¿De qué trata?", "Mitología", "Ciencia", "", "", "", "", "Mitología", "Literal"],
      ["LEC_REAL", 1, "¿Pregunta 1?", "A", "B", "", "", "", "", "A", "Literal"],
      ["LEC_REAL", 2, "¿Pregunta 2?", "A", "B", "", "", "", "", "B", "Inferencial"],
      ["LEC_TRIM_1", 1, "¿Pregunta Trim 1?", "A", "B", "", "", "", "", "A", "Crítico"]
    ],
    Resultados: [
      [
        "Marca Temporal", "Escuela", "Matrícula", "Nombre Estudiante", "Grado", "Grupo", "Género",
        "Asignatura", "Tema", "ID Lectura", "Tiempo Lectura (s)", "Tiempo Reactivos (s)", "Tiempo Total (s)",
        "Segundos por pregunta", "Aciertos", "Calificación comprensión (%)", "PPM", "Nivel PPM",
        "Calificación global (%)", "Intento", "PME", "Relecturas", "Desglose niveles", "Recomendación",
        "Modo", "Trimestre", "Token Examen"
      ]
    ],
    Config: [
      ["Clave", "Valor"],
      ["INTENTOS_DEFAULT", "3"],
      ["LECTURAS_TRIMESTRALES", JSON.stringify({
        activo: "1",
        trimestres: {
          "1": { inicio: "2026-08-01", fin: "2026-11-30", intentos: 2 },
          "2": { inicio: "2026-12-01", fin: "2027-03-31", intentos: 2 },
          "3": { inicio: "2027-04-01", fin: "2027-07-31", intentos: 2 }
        },
        lecturas: {
          "1": { "1": "LEC_TRIM_1", "2": "", "3": "" },
          "2": { "1": "", "2": "", "3": "" },
          "3": { "1": "", "2": "", "3": "" }
        }
      })]
    ],
    ...(opts.initialSheets || {})
  };

  for (const [k, v] of Object.entries(defaultSheets)) {
    sheetsMap[k] = new HojaMock(k, v);
  }

  const libroMock = {
    getId: () => realId,
    getName: () => "Lectura PRODUCCION",
    getSheetByName: (nombre) => sheetsMap[nombre] || null,
    getSheets: () => Object.values(sheetsMap),
    insertSheet: (nombre) => {
      const h = new HojaMock(nombre, []);
      sheetsMap[nombre] = h;
      return h;
    }
  };

  const sandbox = {
    console: console,
    Logger: { log: () => {} },
    Utilities: {
      getUuid: () => "uuid_" + Math.random().toString(36).substring(2, 10),
      computeDigest: (algo, str) => {
        let h = 0;
        for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
        return [h & 0xff, (h >> 8) & 0xff, (h >> 16) & 0xff, (h >> 24) & 0xff];
      },
      DigestAlgorithm: { SHA_256: "SHA_256" },
      Charset: { UTF_8: "UTF_8" },
      formatDate: () => "2026-10-18"
    },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (k) => scriptProperties[k] || null,
        getProperties: () => ({ ...scriptProperties }),
        setProperty: (k, v) => { scriptProperties[k] = String(v); },
        setProperties: (obj) => { Object.assign(scriptProperties, obj); }
      })
    },
    CacheService: {
      getScriptCache: () => ({
        get: (k) => cacheStore[k] || null,
        put: (k, v) => { cacheStore[k] = String(v); },
        remove: (k) => { delete cacheStore[k]; }
      })
    },
    LockService: {
      getScriptLock: () => ({
        waitLock: () => true,
        releaseLock: () => true
      })
    },
    SpreadsheetApp: {
      openById: (id) => (id === realId ? libroMock : null),
      getActiveSpreadsheet: () => libroMock,
      flush: () => {}
    },
    ScriptApp: {
      getService: () => ({ getUrl: () => "https://script.google.com/macros/s/TEST/exec" })
    },
    HtmlService: {
      createHtmlOutputFromFile: () => ({ setTitle: function(){ return this; }, addMetaTag: function(){ return this; }, setXFrameOptionsMode: function(){ return this; } }),
      createTemplateFromFile: () => ({ evaluate: function(){ return { setTitle: function(){ return this; }, addMetaTag: function(){ return this; }, setXFrameOptionsMode: function(){ return this; } }; } }),
      XFrameOptionsMode: { ALLOWALL: "ALLOWALL" }
    },
    UrlFetchApp: {
      fetch: () => ({
        getResponseCode: () => 200,
        getContentText: () => JSON.stringify({ choices: [{ message: { content: "Buen trabajo." } }] })
      })
    },
    __sheets: sheetsMap,
    __cache: cacheStore,
    __props: scriptProperties
  };

  vm.createContext(sandbox);
  vm.runInContext(CODIGO_GS, sandbox);
  vm.runInContext(ASISTENCIA_GS, sandbox);
  vm.runInContext(CLASE_LOGICA_GS, sandbox);

  return sandbox;
}

let totalTests = 0;
let passedTests = 0;

function it(desc, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  [PASS] ${desc}`);
  } catch (err) {
    console.error(`  [FAIL] ${desc}: ${err.message}`);
  }
}

// ============================================================================
// SUITE 1: SEC-A02-02 — Revocación de sesión
// ============================================================================
console.log("\n--- SUITE 1: SEC-A02-02 — Revocación de sesión y control estricto ---");

it("Usuario anónimo o sin token no revoca sesiones ajenas ni lanza error", () => {
  const ctx = crearContextoPruebas();
  const resVacio = ctx.revocarTokenSesion("");
  assert.strictEqual(resVacio.ok, true);
  const resNull = ctx.revocarTokenSesion(null);
  assert.strictEqual(resNull.ok, true);
});

it("Revocación con token arbitrario / adivinado no afecta sesiones legítimas existentes", () => {
  const ctx = crearContextoPruebas();
  const tokenLegitimo = "tok_alumno_real_123";
  ctx.__cache["sesion_" + tokenLegitimo] = JSON.stringify({
    rol: "alumno",
    matricula: "MAT_001",
    nombre: "Alumno Uno"
  });

  // Atacante intenta revocar con token arbitrario
  const resAtaque = ctx.revocarTokenSesion("tok_adivinado_999");
  assert.strictEqual(resAtaque.ok, true);
  // La sesión legítima permanece 100% intacta
  assert(ctx.__cache["sesion_" + tokenLegitimo] !== undefined, "La sesión legítima no debió afectarse");
});

it("Alumno revoca SU token: elimina sesion_, alumno_, sesion_alumno_ y examen_vigente_", () => {
  const ctx = crearContextoPruebas();
  const tokenAlu = "tok_alu_revocar_test";
  ctx.__cache["sesion_" + tokenAlu] = JSON.stringify({
    rol: "alumno",
    matricula: "MAT_001",
    nombre: "Alumno Uno"
  });
  ctx.__cache["alumno_" + tokenAlu] = "1";
  ctx.__cache["sesion_alumno_MAT_001"] = tokenAlu;
  ctx.__cache["examen_vigente_MAT_001"] = JSON.stringify({ token: "exam_1" });

  const res = ctx.revocarTokenSesion(tokenAlu);
  assert.strictEqual(res.ok, true);
  assert.strictEqual(ctx.__cache["sesion_" + tokenAlu], undefined);
  assert.strictEqual(ctx.__cache["alumno_" + tokenAlu], undefined);
  assert.strictEqual(ctx.__cache["sesion_alumno_MAT_001"], undefined);
  assert.strictEqual(ctx.__cache["examen_vigente_MAT_001"], undefined);
});

it("Personal escolar (admin, docente, clase) revoca token: elimina todas las claves asociadas", () => {
  const ctx = crearContextoPruebas();
  const tokenDoc = "tok_doc_revocar_test";
  ctx.__cache["sesion_" + tokenDoc] = JSON.stringify({
    rol: "docente",
    maestroId: "DOC_1",
    nombre: "Docente Uno"
  });
  ctx.__cache["docente_" + tokenDoc] = "1";
  ctx.__cache["clase_" + tokenDoc] = JSON.stringify({ id: "DOC_1" });

  const res = ctx.revocarTokenSesion(tokenDoc);
  assert.strictEqual(res.ok, true);
  assert.strictEqual(ctx.__cache["sesion_" + tokenDoc], undefined);
  assert.strictEqual(ctx.__cache["docente_" + tokenDoc], undefined);
  assert.strictEqual(ctx.__cache["clase_" + tokenDoc], undefined);
});

it("cerrarSesionClase revoca tanto clase_ como sesion_ del script cache", () => {
  const ctx = crearContextoPruebas();
  const tokClase = "tok_clase_123";
  ctx.__cache["clase_" + tokClase] = "datos_docente";
  ctx.__cache["sesion_" + tokClase] = "sesion_docente";

  const res = ctx.cerrarSesionClase(tokClase);
  assert.strictEqual(res.ok, true);
  assert.strictEqual(ctx.__cache["clase_" + tokClase], undefined);
  assert.strictEqual(ctx.__cache["sesion_" + tokClase], undefined);
});

it("Token revocado es rechazado inmediatamente en panelAlumno e iniciarEvaluacionAlumno", () => {
  const ctx = crearContextoPruebas();
  const tokenRev = "tok_ya_revocado";
  ctx.revocarTokenSesion(tokenRev);

  let errPanel = null;
  try {
    ctx.panelAlumno("MAT_001", tokenRev);
  } catch (e) { errPanel = e; }
  assert(errPanel && errPanel.message.includes("Acceso denegado"), "panelAlumno deniega token revocado");

  let errExamen = null;
  try {
    ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokenRev);
  } catch (e) { errExamen = e; }
  assert(errExamen && errExamen.message.includes("Acceso denegado"), "iniciarEvaluacionAlumno deniega token revocado");
});

// ============================================================================
// SUITE 2: SEC-A03-03 — Idempotencia, escala (>10 filas) y desacoplamiento Cache/Sheets
// ============================================================================
console.log("\n--- SUITE 2: SEC-A03-03 — Idempotencia en escala y recuperación tras fallos ---");

it("Idempotencia en hoja detecta duplicado aun con más de 10 filas intermedias de otros alumnos", () => {
  const ctx = crearContextoPruebas();
  const tokSes = "tok_ses_mat_scale";
  ctx.__cache["sesion_" + tokSes] = JSON.stringify({
    rol: "alumno",
    matricula: "MAT_001",
    nombre: "Alumno Uno",
    grado: "1",
    grupo: "a"
  });

  const inicio = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokSes);
  const tokExamen = inicio.tokenExamen;
  const idLec = inicio.lectura.idLectura;

  // 1. Guardar el examen exitosamente por primera vez
  const res1 = ctx.guardarResultadosExamen({
    tokenExamen: tokExamen,
    matricula: "MAT_001",
    idLectura: idLec,
    modo: "sorteo",
    tiempoLectura: 60,
    tiempoReactivos: 30,
    respuestas: ["Mitología"]
  });
  assert.strictEqual(res1.ok, true);

  const hojaRes = ctx.__sheets["Resultados"];
  const filasDespuesDeRes1 = hojaRes._data.length;

  // 2. Simular actividad masiva: entran 15 alumnos de otros grupos a guardar sus exámenes
  for (let i = 1; i <= 15; i++) {
    const filaOtro = new Array(hojaRes._data[0].length).fill("");
    filaOtro[2] = "MAT_OTRO_" + i; // Columna Matrícula
    filaOtro[9] = "LEC_OTRA_" + i; // Columna ID Lectura
    filaOtro[19] = 1;              // Columna Intento
    filaOtro[24] = "sorteo";       // Columna Modo
    filaOtro[26] = "exam_otro_" + i; // Token Examen
    hojaRes._data.push(filaOtro);
  }
  assert(hojaRes._data.length > filasDespuesDeRes1 + 10, "Hay más de 10 filas intermedias");

  // 3. El primer alumno reintenta o reenvía su solicitud con el mismo token
  const resReintento = ctx.guardarResultadosExamen({
    tokenExamen: tokExamen,
    matricula: "MAT_001",
    idLectura: idLec,
    modo: "sorteo",
    tiempoLectura: 60,
    tiempoReactivos: 30,
    respuestas: ["Mitología"],
    reintento: true
  });

  assert.strictEqual(resReintento.ok, true);
  assert.strictEqual(resReintento.reintentoIdempotente, true);
  // Verificar que NO se escribió ninguna fila duplicada
  assert.strictEqual(hojaRes._data.length, filasDespuesDeRes1 + 15, "No se agregaron filas duplicadas");
});

it("Clave Token Examen persistida permite recuperación idempotente cuando CacheService pierde el estado", () => {
  const ctx = crearContextoPruebas();
  const tokSes = "tok_ses_cache_crash";
  ctx.__cache["sesion_" + tokSes] = JSON.stringify({
    rol: "alumno",
    matricula: "MAT_001",
    nombre: "Alumno Uno",
    grado: "1",
    grupo: "a"
  });

  const inicio = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokSes);
  const tokExamen = inicio.tokenExamen;
  const idLec = inicio.lectura.idLectura;

  // Guardar primario
  const res1 = ctx.guardarResultadosExamen({
    tokenExamen: tokExamen,
    matricula: "MAT_001",
    idLectura: idLec,
    modo: "sorteo",
    tiempoLectura: 60,
    tiempoReactivos: 30,
    respuestas: ["Mitología"]
  });
  assert.strictEqual(res1.ok, true);

  const hojaRes = ctx.__sheets["Resultados"];
  const totalFilas = hojaRes._data.length;

  // SIMULACIÓN DE CACHE PURGE / DESACOPLAMIENTO:
  // Se borra examen_consumido_ y examen_token_ de CacheService (como si el cluster de caché reiniciara)
  delete ctx.__cache["examen_consumido_" + tokExamen];
  delete ctx.__cache["examen_token_" + tokExamen];

  // Reintento del cliente con reintento: true
  const resRecuperado = ctx.guardarResultadosExamen({
    tokenExamen: tokExamen,
    matricula: "MAT_001",
    idLectura: idLec,
    modo: "sorteo",
    tiempoLectura: 60,
    tiempoReactivos: 30,
    respuestas: ["Mitología"],
    reintento: true
  });

  assert.strictEqual(resRecuperado.ok, true);
  assert.strictEqual(resRecuperado.reintentoIdempotente, true);
  assert.strictEqual(hojaRes._data.length, totalFilas, "No se insertó fila duplicada tras purga de caché");
});

it("Fallo en appendRow deja el token intacto para reintento y no inserta filas corruptas", () => {
  const ctx = crearContextoPruebas();
  const tokSes = "tok_ses_append_fail";
  ctx.__cache["sesion_" + tokSes] = JSON.stringify({
    rol: "alumno",
    matricula: "MAT_001",
    nombre: "Alumno Uno",
    grado: "1",
    grupo: "a"
  });

  const inicio = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokSes);
  const tokExamen = inicio.tokenExamen;
  const idLec = inicio.lectura.idLectura;

  const hojaRes = ctx.__sheets["Resultados"];
  const filasAntes = hojaRes._data.length;
  hojaRes.simularFalloEscritura = true;

  let err = null;
  try {
    ctx.guardarResultadosExamen({
      tokenExamen: tokExamen,
      matricula: "MAT_001",
      idLectura: idLec,
      modo: "sorteo",
      tiempoLectura: 50,
      tiempoReactivos: 20,
      respuestas: ["Mitología"]
    });
  } catch (e) { err = e; }

  assert(err && err.message.includes("Fallo al registrar resultados"), "Error reportado al usuario");
  assert.strictEqual(hojaRes._data.length, filasAntes, "Hoja Resultados intacta");
  assert(ctx.__cache["examen_token_" + tokExamen] !== undefined, "Token permanece intacto para reintento");

  // Al restablecer servicio, el reintento guarda exitosamente
  hojaRes.simularFalloEscritura = false;
  const resOk = ctx.guardarResultadosExamen({
    tokenExamen: tokExamen,
    matricula: "MAT_001",
    idLectura: idLec,
    modo: "sorteo",
    tiempoLectura: 50,
    tiempoReactivos: 20,
    respuestas: ["Mitología"]
  });
  assert.strictEqual(resOk.ok, true);
  assert.strictEqual(hojaRes._data.length, filasAntes + 1);
});

// ============================================================================
// SUITE 3: SEC-A03-02 — Modalidad y trimestre
// ============================================================================
console.log("\n--- SUITE 3: SEC-A03-02 — Modalidad y trimestre estrictos ---");

it("guardarResultadosExamen rechaza modalidad vacía o indefinida", () => {
  const ctx = crearContextoPruebas();
  const tokSes = "tok_ses_modo_vacio";
  ctx.__cache["sesion_" + tokSes] = JSON.stringify({
    rol: "alumno", matricula: "MAT_001", nombre: "Alumno Uno", grado: "1", grupo: "a"
  });
  const inicio = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokSes);

  let errVacio = null;
  try {
    ctx.guardarResultadosExamen({
      tokenExamen: inicio.tokenExamen,
      matricula: "MAT_001",
      idLectura: inicio.lectura.idLectura,
      modo: "", // Vacío
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["Mitología"]
    });
  } catch (e) { errVacio = e; }
  assert(errVacio && errVacio.message.includes("Modalidad de evaluación no especificada o vacía"),
    "Rechaza modalidad vacía");

  let errIndef = null;
  try {
    ctx.guardarResultadosExamen({
      tokenExamen: inicio.tokenExamen,
      matricula: "MAT_001",
      idLectura: inicio.lectura.idLectura,
      // modo omitido
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["Mitología"]
    });
  } catch (e) { errIndef = e; }
  assert(errIndef && errIndef.message.includes("Modalidad de evaluación no especificada o vacía"),
    "Rechaza modalidad omitida/indefinida");
});

it("guardarResultadosExamen rechaza modalidad no reconocida", () => {
  const ctx = crearContextoPruebas();
  const tokSes = "tok_ses_modo_desc";
  ctx.__cache["sesion_" + tokSes] = JSON.stringify({
    rol: "alumno", matricula: "MAT_001", nombre: "Alumno Uno", grado: "1", grupo: "a"
  });
  const inicio = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokSes);

  let errDesc = null;
  try {
    ctx.guardarResultadosExamen({
      tokenExamen: inicio.tokenExamen,
      matricula: "MAT_001",
      idLectura: inicio.lectura.idLectura,
      modo: "evaluacion_especial",
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["Mitología"]
    });
  } catch (e) { errDesc = e; }
  assert(errDesc && errDesc.message.includes("Modalidad de evaluación no reconocida"),
    "Rechaza modalidad no reconocida");
});

it("iniciarEvaluacionAlumno rechaza modalidad no reconocida", () => {
  const ctx = crearContextoPruebas();
  const tokSes = "tok_ses_ini_desc";
  ctx.__cache["sesion_" + tokSes] = JSON.stringify({
    rol: "alumno", matricula: "MAT_001", nombre: "Alumno Uno", grado: "1", grupo: "a"
  });

  let errIni = null;
  try {
    ctx.iniciarEvaluacionAlumno("MAT_001", "hack_modo", tokSes);
  } catch (e) { errIni = e; }
  assert(errIni && errIni.message.includes("Modalidad de evaluación no reconocida"),
    "iniciarEvaluacionAlumno rechaza modalidad no reconocida");
});

it("guardarResultadosExamen rechaza conflicto de modalidad contra el intento original", () => {
  const ctx = crearContextoPruebas();
  const tokSes = "tok_ses_conf_modo";
  ctx.__cache["sesion_" + tokSes] = JSON.stringify({
    rol: "alumno", matricula: "MAT_001", nombre: "Alumno Uno", grado: "1", grupo: "a"
  });
  // Se inició como sorteo
  const inicio = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokSes);

  let errConf = null;
  try {
    ctx.guardarResultadosExamen({
      tokenExamen: inicio.tokenExamen,
      matricula: "MAT_001",
      idLectura: inicio.lectura.idLectura,
      modo: "trimestral", // Atacante intenta pasarlo a trimestral
      trimestre: "1",
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["Mitología"]
    });
  } catch (e) { errConf = e; }
  assert(errConf && errConf.message.includes("Conflicto de modalidad"),
    "Rechaza cambiar sorteo a trimestral");
});

it("guardarResultadosExamen en modalidad trimestral rechaza trimestre vacío", () => {
  const ctx = crearContextoPruebas();
  const tokSes = "tok_ses_trim_vacio";
  ctx.__cache["sesion_" + tokSes] = JSON.stringify({
    rol: "alumno", matricula: "MAT_001", nombre: "Alumno Uno", grado: "1", grupo: "a"
  });
  const inicioTrim = ctx.iniciarEvaluacionAlumno("MAT_001", "trimestral", tokSes);

  let errTrimVacio = null;
  try {
    ctx.guardarResultadosExamen({
      tokenExamen: inicioTrim.tokenExamen,
      matricula: "MAT_001",
      idLectura: inicioTrim.lectura.idLectura,
      modo: "trimestral",
      trimestre: "", // Vacío
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["Mitología"]
    });
  } catch (e) { errTrimVacio = e; }
  assert(errTrimVacio && errTrimVacio.message.includes("Trimestre escolar no especificado o vacío"),
    "Rechaza trimestre vacío");
});

it("guardarResultadosExamen rechaza trimestre fuera del catálogo escolar", () => {
  const ctx = crearContextoPruebas();
  const tokSes = "tok_ses_trim_fuera";
  ctx.__cache["sesion_" + tokSes] = JSON.stringify({
    rol: "alumno", matricula: "MAT_001", nombre: "Alumno Uno", grado: "1", grupo: "a"
  });
  const tokFalso = "exam_falso_trim_99";
  ctx.__cache["examen_token_" + tokFalso] = JSON.stringify({
    token: tokFalso,
    matricula: "MAT_001",
    idLectura: "LEC_1",
    modo: "trimestral",
    trimestre: "4", // No existe trimestre 4 en secundaria
    intentoEsperado: 1
  });

  let errTrimInval = null;
  try {
    ctx.guardarResultadosExamen({
      tokenExamen: tokFalso,
      matricula: "MAT_001",
      idLectura: "LEC_1",
      modo: "trimestral",
      trimestre: "4",
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["Mitología"]
    });
  } catch (e) { errTrimInval = e; }
  assert(errTrimInval && errTrimInval.message.includes("no es válido según la configuración escolar"),
    "Rechaza trimestre no escolar");
});

// ============================================================================
// SUITE 4: REGRESIÓN DE SEGURIDAD GENERAL
// ============================================================================
console.log("\n--- SUITE 4: REGRESIÓN DE PROTECCIONES PREVIAS ---");

it("Regresión SEC-A02-01: panelResumen para prefecto y apoyo no expone credenciales ni hashes", () => {
  const ctx = crearContextoPruebas();
  const tokPref = "tok_pref_reg";
  ctx.__cache["sesion_" + tokPref] = JSON.stringify({
    rol: "prefecto", prefectoId: "PREF_1", nombre: "Prefecta Uno", usuario: "pref1"
  });

  const resPref = ctx.panelResumen(tokPref);
  assert.strictEqual(resPref.ok, true);
  for (const alu of resPref.alumnos) {
    assert.strictEqual(alu.clave, "");
    assert.strictEqual(alu.usuario, "");
    assert.strictEqual(alu.hash, undefined);
    assert.strictEqual(alu.salt, undefined);
  }
});

it("Regresión SEC-A03-01: iniciarEvaluacionAlumno no permite suplantar matrícula con sesión ajena", () => {
  const ctx = crearContextoPruebas();
  const tokMat2 = "tok_ses_mat2_suplanta";
  ctx.__cache["sesion_" + tokMat2] = JSON.stringify({
    rol: "alumno", matricula: "MAT_002", nombre: "Alumno Dos", grado: "1", grupo: "b"
  });

  let err = null;
  try {
    ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokMat2);
  } catch (e) { err = e; }
  assert(err && err.message.includes("no estás autorizado para iniciar evaluaciones a nombre de otro alumno"),
    "Suplantación de matrícula bloqueada tajantemente");
});

it("Regresión SEC-A02-02: panelAlumno exige sesión válida y deniega llamada con matrícula sola", () => {
  const ctx = crearContextoPruebas();
  let err = null;
  try {
    ctx.panelAlumno("MAT_001", "");
  } catch (e) { err = e; }
  assert(err && err.message.includes("Acceso denegado"), "panelAlumno exige token autenticado");
});

it("Regresión SEC-A03-01: Quiosco no es anónimo sin autorización comprobable", () => {
  const ctx = crearContextoPruebas();
  let err = null;
  try {
    ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", "");
  } catch (e) { err = e; }
  assert(err && err.message.includes("se requiere una sesión autenticada"), "Quiosco anónimo bloqueado");
});

console.log("\n================================================================================");
console.log(`RESUMEN CUARTA REVISIÓN: ${passedTests} EXITOSAS, ${totalTests - passedTests} FALLIDAS (TOTAL: ${totalTests})`);
console.log("================================================================================");

if (passedTests !== totalTests) {
  process.exit(1);
}
