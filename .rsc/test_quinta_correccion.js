/**
 * ST90 — QUINTA CORRECCIÓN ACOTADA: SUITE DE PRUEBAS LOCALES DE SEGURIDAD
 * 
 * Correcciones evaluadas:
 * 1. CORRECCIÓN A — Recuperación idempotente de resultados (Token Examen como identificador principal, tupla estricta de 5 campos solo si !rowToken, detección de anomalías >1, sin duplicados ni confusión de intentos/modalidades).
 * 2. CORRECCIÓN B — Rechazar modalidades vacías o desconocidas (Lista blanca estricta 'sorteo' y 'trimestral', validación previa a valores predeterminados, rechazo de undefined, null, '', espacios y desconocidos en inicio y guardado, validación de trimestre coincidente y autorizado).
 * 3. CORRECCIÓN C — Revocación completa y limpieza de sesión (Tolerancia a fallos en sesion_ vía sesion_mat_, limpieza selectiva de examen_vigente_, validación de clase_ en cerrarSesionClase, purga inmediata de memoria y DOM en Interfaz.html y resiliencia ante caídas de red).
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

console.log("================================================================================");
console.log("ST90 — QUINTA CORRECCIÓN ACOTADA: PRUEBAS LOCALES DE SEGURIDAD");
console.log("================================================================================");

const CODIGO_GS = fs.readFileSync(path.join(__dirname, "..", "Codigo.gs"), "utf8");
const ASISTENCIA_GS = fs.readFileSync(path.join(__dirname, "..", "Asistencia.gs"), "utf8");
const CLASE_LOGICA_GS = fs.readFileSync(path.join(__dirname, "..", "ClaseLogica.gs"), "utf8");
const INTERFAZ_HTML = fs.readFileSync(path.join(__dirname, "..", "Interfaz.html"), "utf8");

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
      ["LEC_TRIM_1", "1", "Español", "Lectura Trimestral", "Texto trimestral de prueba con más de cuarenta palabras para la evaluación unificada.", 50, "[]", "SI", "TRIMESTRE_1"]
    ],
    Preguntas: [
      ["ID Lectura", "Orden", "Enunciado", "Opción 1", "Opción 2", "Opción 3", "Opción 4", "Opción 5", "Opción 6", "Respuesta correcta", "Nivel"],
      ["LEC_1", 1, "¿De qué trata?", "Mitología", "Ciencia", "", "", "", "", "Mitología", "Literal"],
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

  const lockMock = {
    hasLock: false,
    waitLock: (timeout) => {
      lockMock.hasLock = true;
      return true;
    },
    releaseLock: () => {
      lockMock.hasLock = false;
    }
  };

  const sandbox = {
    console,
    Math,
    Date,
    JSON,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    String,
    Number,
    Boolean,
    Array,
    Object,
    RegExp,
    Error,
    TypeError,
    RangeError,
    Logger: { log: () => {} },
    Utilities: {
      getUuid: () => "uuid_" + Math.random().toString(36).substring(2, 10),
      computeDigest: (algo, str) => {
        const crypto = require("crypto");
        const hash = crypto.createHash(algo === "SHA_256" ? "sha256" : "sha1").update(str, "utf8").digest();
        return Array.from(hash).map(b => b < 128 ? b : b - 256);
      },
      DigestAlgorithm: { SHA_256: "SHA_256", SHA_1: "SHA_1" },
      Charset: { UTF_8: "UTF_8" },
      base64Encode: (bytes) => Buffer.from(bytes).toString("base64"),
      formatDate: () => "2026-10-18"
    },
    ScriptApp: {
      getService: () => ({ getUrl: () => "https://script.google.com/macros/s/TEST/exec" })
    },
    HtmlService: {
      createHtmlOutputFromFile: () => ({ setTitle: function(){ return this; }, addMetaTag: function(){ return this; }, setXFrameOptionsMode: function(){ return this; } }),
      createTemplateFromFile: () => ({ evaluate: function(){ return { setTitle: function(){ return this; }, addMetaTag: function(){ return this; }, setXFrameOptionsMode: function(){ return this; } }; } }),
      XFrameOptionsMode: { ALLOWALL: "ALLOWALL" }
    },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (k) => scriptProperties[k] !== undefined ? scriptProperties[k] : null,
        getProperties: () => ({ ...scriptProperties }),
        setProperty: (k, v) => { scriptProperties[k] = String(v); },
        setProperties: (obj) => { Object.assign(scriptProperties, obj); },
        deleteProperty: (k) => { delete scriptProperties[k]; }
      })
    },
    CacheService: {
      getScriptCache: () => ({
        get: (k) => cacheStore[k] !== undefined ? cacheStore[k] : null,
        put: (k, v) => { cacheStore[k] = String(v); },
        remove: (k) => { delete cacheStore[k]; }
      })
    },
    LockService: {
      getScriptLock: () => lockMock
    },
    SpreadsheetApp: {
      openById: (id) => (id === realId ? libroMock : null),
      getActiveSpreadsheet: () => libroMock,
      flush: () => {}
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

function simularSesionAlumno(ctx, mat, nombre = "Alumno Uno", grado = "1", grupo = "a") {
  const token = "tok_" + mat + "_" + Math.random().toString(36).substring(2, 8);
  ctx.__cache["sesion_" + token] = JSON.stringify({
    rol: "alumno",
    matricula: mat,
    nombre: nombre,
    grado: grado,
    grupo: grupo
  });
  ctx.__cache["alumno_" + token] = "1";
  ctx.__cache["sesion_mat_" + token] = mat;
  ctx.__cache["sesion_alumno_" + mat] = token;
  return token;
}

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assertTest(desc, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  [PASS] ${desc}`);
  } catch (err) {
    failedTests++;
    console.error(`  [FAIL] ${desc}`);
    console.error(`         ${err.message}`);
  }
}

// =============================================================================
// CORRECCIÓN A — RECUPERACIÓN IDEMPOTENTE DE RESULTADOS
// =============================================================================
console.log("\n--- CORRECCIÓN A: Recuperación idempotente de resultados ---");

assertTest("A.1: El mismo token se reintenta después de perderse la caché y devuelve el resultado persistido", () => {
  const ctx = crearContextoPruebas();
  const tokenSes = simularSesionAlumno(ctx, "MAT_001");

  const evalInicio = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokenSes);
  const tokenExamen = evalInicio.tokenExamen;
  const idLec = evalInicio.lectura.idLectura;
  assert.ok(tokenExamen);

  const preg1 = ctx.preguntasDeLectura(ctx.buscarLecturaPorId(idLec));
  const respCorrectas1 = preg1.map(p => p.respuesta);

  const payload = {
    tokenExamen: tokenExamen,
    matricula: "MAT_001",
    idLectura: idLec,
    tiempoLectura: 60,
    tiempoReactivos: 30,
    respuestas: respCorrectas1,
    modo: "sorteo"
  };

  const res1 = ctx.guardarResultadosExamen(payload);
  assert.ok(res1.ok);
  assert.strictEqual(res1.resultado.aciertos, respCorrectas1.length);

  // Simular purga de caché
  delete ctx.__cache["examen_consumido_" + tokenExamen];
  delete ctx.__cache["examen_token_" + tokenExamen];

  // Reintento del cliente
  const resReintento = ctx.guardarResultadosExamen({
    ...payload,
    reintento: true
  });
  assert.ok(resReintento.ok);
  assert.strictEqual(resReintento.reintentoIdempotente, true);
  assert.strictEqual(resReintento.resultado.aciertos, respCorrectas1.length);
});

assertTest("A.2: Existen más de 10 filas posteriores de otros alumnos: se recupera el resultado correcto exacto", () => {
  const ctx = crearContextoPruebas();
  const tokenSes = simularSesionAlumno(ctx, "MAT_001");
  const evalInicio = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokenSes);
  const tokenTarget = evalInicio.tokenExamen;
  const idLec = evalInicio.lectura.idLectura;
  const preg2 = ctx.preguntasDeLectura(ctx.buscarLecturaPorId(idLec));
  const respCorrectas2 = preg2.map(p => p.respuesta);

  ctx.guardarResultadosExamen({
    tokenExamen: tokenTarget,
    matricula: "MAT_001",
    idLectura: idLec,
    tiempoLectura: 60,
    tiempoReactivos: 30,
    respuestas: respCorrectas2,
    modo: "sorteo"
  });

  // Agregar 15 filas posteriores de otros alumnos
  const hojaRes = ctx.__sheets["Resultados"];
  for (let i = 1; i <= 15; i++) {
    hojaRes.appendRow([
      "2026-10-18", "Escuela", "MAT_999" + i, "OTRO ALUMNO " + i, "1", "A", "",
      "Español", "Tema", "LEC_1", 70, 30, 100, "[]", 1, 100, 60, "Normal", 100, 1, 60, 0, "{}", "",
      "sorteo", "", "tok_otro_" + i
    ]);
  }

  // Purgar caché
  delete ctx.__cache["examen_consumido_" + tokenTarget];
  delete ctx.__cache["examen_token_" + tokenTarget];

  // Reintento buscando en hoja
  const res = ctx.guardarResultadosExamen({
    tokenExamen: tokenTarget,
    matricula: "MAT_001",
    idLectura: idLec,
    tiempoLectura: 60,
    tiempoReactivos: 30,
    respuestas: respCorrectas2,
    modo: "sorteo",
    reintento: true
  });

  assert.ok(res.ok);
  assert.strictEqual(res.reintentoIdempotente, true);
  assert.strictEqual(res.resultado.aciertos, respCorrectas2.length);
});

assertTest("A.3: El mismo alumno tiene dos intentos de la misma lectura: nunca se devuelve el resultado de otro intento", () => {
  const ctx = crearContextoPruebas();
  const tokenSes = simularSesionAlumno(ctx, "MAT_001");

  // Intento 1 en lectura trimestral (respuesta incorrecta: 0 aciertos)
  const eval1 = ctx.iniciarEvaluacionAlumno("MAT_001", "trimestral", tokenSes);
  const token1 = eval1.tokenExamen;
  const idLec1 = eval1.lectura.idLectura;
  ctx.guardarResultadosExamen({
    tokenExamen: token1,
    matricula: "MAT_001",
    idLectura: idLec1,
    tiempoLectura: 80,
    tiempoReactivos: 40,
    respuestas: ["B"], // Incorrecta
    modo: "trimestral",
    trimestre: "1"
  });

  // Intento 2 sobre la MISMA lectura (respuesta correcta: 1 acierto)
  const eval2 = ctx.iniciarEvaluacionAlumno("MAT_001", "trimestral", tokenSes);
  const token2 = eval2.tokenExamen;
  const idLec2 = eval2.lectura.idLectura;
  assert.strictEqual(idLec1, idLec2, "Debe ser la misma lectura en ambos intentos");
  ctx.guardarResultadosExamen({
    tokenExamen: token2,
    matricula: "MAT_001",
    idLectura: idLec2,
    tiempoLectura: 50,
    tiempoReactivos: 25,
    respuestas: ["A"], // Correcta
    modo: "trimestral",
    trimestre: "1"
  });

  // Purgar caché
  delete ctx.__cache["examen_consumido_" + token1];
  delete ctx.__cache["examen_token_" + token1];
  delete ctx.__cache["examen_consumido_" + token2];
  delete ctx.__cache["examen_token_" + token2];

  // Reintento de Intento 1: debe devolver 0 aciertos
  const rec1 = ctx.guardarResultadosExamen({
    tokenExamen: token1,
    matricula: "MAT_001",
    idLectura: idLec1,
    tiempoLectura: 80,
    tiempoReactivos: 40,
    respuestas: ["B"],
    modo: "trimestral",
    trimestre: "1",
    reintento: true
  });
  assert.strictEqual(rec1.resultado.aciertos, 0);

  // Reintento de Intento 2: debe devolver 1 acierto
  const rec2 = ctx.guardarResultadosExamen({
    tokenExamen: token2,
    matricula: "MAT_001",
    idLectura: idLec2,
    tiempoLectura: 50,
    tiempoReactivos: 25,
    respuestas: ["A"],
    modo: "trimestral",
    trimestre: "1",
    reintento: true
  });
  assert.strictEqual(rec2.resultado.aciertos, 1);
});

assertTest("A.4: El mismo alumno tiene resultados de modalidades o trimestres diferentes: no se confunden", () => {
  const ctx = crearContextoPruebas();
  const tokenSes = simularSesionAlumno(ctx, "MAT_001");

  // Intento en modo trimestral T1
  const evalTrim = ctx.iniciarEvaluacionAlumno("MAT_001", "trimestral", tokenSes);
  const tokenTrim = evalTrim.tokenExamen;
  const idLecTrim = evalTrim.lectura.idLectura;
  ctx.guardarResultadosExamen({
    tokenExamen: tokenTrim,
    matricula: "MAT_001",
    idLectura: idLecTrim,
    tiempoLectura: 60,
    tiempoReactivos: 30,
    respuestas: ["A"],
    modo: "trimestral",
    trimestre: "1"
  });

  // Intento en modo sorteo
  const evalSorteo = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokenSes);
  const tokenSorteo = evalSorteo.tokenExamen;
  const idLecSorteo = evalSorteo.lectura.idLectura;
  ctx.guardarResultadosExamen({
    tokenExamen: tokenSorteo,
    matricula: "MAT_001",
    idLectura: idLecSorteo,
    tiempoLectura: 60,
    tiempoReactivos: 30,
    respuestas: ["Mitología"],
    modo: "sorteo"
  });

  delete ctx.__cache["examen_consumido_" + tokenTrim];
  delete ctx.__cache["examen_consumido_" + tokenSorteo];

  const recTrim = ctx.buscarResultadoPrevioEnHoja_("MAT_001", tokenTrim, { idLectura: idLecTrim, modo: "trimestral", trimestre: "1" });
  assert.ok(recTrim);
  assert.strictEqual(recTrim.aciertos, 1);

  const recSorteo = ctx.buscarResultadoPrevioEnHoja_("MAT_001", tokenSorteo, { idLectura: idLecSorteo, modo: "sorteo" });
  assert.ok(recSorteo);
  assert.strictEqual(recSorteo.aciertos, 1);
});

assertTest("A.5: No existe coincidencia inequívoca o existen múltiples coincidencias anómalas: falla seguro sin devolver resultado arbitrario", () => {
  const ctx = crearContextoPruebas();
  const hojaRes = ctx.__sheets["Resultados"];

  // Insertar 2 filas anómalas con el mismo token
  hojaRes.appendRow([
    "2026-10-18", "Escuela", "MAT_001", "ALUMNO", "1", "A", "",
    "Español", "Tema", "LEC_1", 60, 30, 90, "[]", 1, 100, 60, "Normal", 100, 1, 60, 0, "{}", "",
    "sorteo", "", "tok_anomalo_duplicado"
  ]);
  hojaRes.appendRow([
    "2026-10-18", "Escuela", "MAT_001", "ALUMNO", "1", "A", "",
    "Español", "Tema", "LEC_1", 60, 30, 90, "[]", 1, 100, 60, "Normal", 100, 1, 60, 0, "{}", "",
    "sorteo", "", "tok_anomalo_duplicado"
  ]);

  const res = ctx.buscarResultadoPrevioEnHoja_("MAT_001", "tok_anomalo_duplicado", { idLectura: "LEC_1", modo: "sorteo" });
  assert.strictEqual(res, null, "Ante múltiples filas para el mismo token debe retornar null de forma segura");
});

assertTest("A.6: Dos solicitudes concurrentes del mismo token no duplican resultados", () => {
  const ctx = crearContextoPruebas();
  const tokenSes = simularSesionAlumno(ctx, "MAT_001");
  const evalInicio = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokenSes);
  const token = evalInicio.tokenExamen;
  const idLec = evalInicio.lectura.idLectura;

  const payload = {
    tokenExamen: token,
    matricula: "MAT_001",
    idLectura: idLec,
    tiempoLectura: 60,
    tiempoReactivos: 30,
    respuestas: ["Mitología"],
    modo: "sorteo"
  };

  const res1 = ctx.guardarResultadosExamen(payload);
  const res2 = ctx.guardarResultadosExamen({ ...payload, reintento: true });

  assert.ok(res1.ok);
  assert.ok(res2.ok);

  const hojaRes = ctx.__sheets["Resultados"];
  const filasTarget = hojaRes._data.filter(r => r[r.length - 1] === token);
  assert.strictEqual(filasTarget.length, 1, "Debe existir exactamente una sola fila persistida para el token");
});

assertTest("A.7: La hoja no tiene la columna Token Examen: aplica tupla inequívoca de 5 campos sin corrupción", () => {
  // Encabezados estándar sin Token Examen (26 columnas)
  const headers26 = [
    "Marca Temporal", "Escuela", "Matrícula", "Nombre Estudiante", "Grado", "Grupo", "Género",
    "Asignatura", "Tema", "ID Lectura", "Tiempo Lectura (s)", "Tiempo Reactivos (s)", "Tiempo Total (s)",
    "Segundos por pregunta", "Aciertos", "Calificación comprensión (%)", "PPM", "Nivel PPM",
    "Calificación global (%)", "Intento", "PME", "Relecturas", "Desglose niveles", "Recomendación",
    "Modo", "Trimestre"
  ];
  const filaHistorica = [
    "2026-10-18", "Escuela", "MAT_001", "ALUMNO UNO", "1", "A", "",
    "Español", "Mitología", "LEC_1", 60, 30, 90,
    "[]", 1, 100, 60, "Normal",
    100, 1, 60, 0, "{}", "",
    "sorteo", ""
  ];

  const ctx = crearContextoPruebas({
    initialSheets: {
      Resultados: [headers26, filaHistorica]
    }
  });

  // Búsqueda con tupla estricta de 5 campos: matricula=MAT_001, idLectura=LEC_1, intento=1, modo=sorteo, trimestre=""
  const match = ctx.buscarResultadoPrevioEnHoja_("MAT_001", "tok_nuevo_sin_columna", {
    idLectura: "LEC_1",
    intento: 1,
    modo: "sorteo",
    trimestre: ""
  });

  assert.ok(match, "Debe identificar el registro histórico inequívoco");
  assert.strictEqual(match.aciertos, 1);

  // Si no coincide la modalidad, debe fallar seguro
  const mismatchModo = ctx.buscarResultadoPrevioEnHoja_("MAT_001", "tok_nuevo_sin_columna", {
    idLectura: "LEC_1",
    intento: 1,
    modo: "trimestral",
    trimestre: "1"
  });
  assert.strictEqual(mismatchModo, null, "Modalidad distinta no debe coincidir");
});

// =============================================================================
// CORRECCIÓN B — RECHAZAR MODALIDADES VACÍAS O DESCONOCIDAS
// =============================================================================
console.log("\n--- CORRECCIÓN B: Rechazar modalidades vacías o desconocidas ---");

assertTest("B.1: Iniciar evaluación con modalidad ausente (undefined) es rechazado", () => {
  const ctx = crearContextoPruebas();
  const tokenSes = simularSesionAlumno(ctx, "MAT_001");
  assert.throws(() => {
    ctx.iniciarEvaluacionAlumno("MAT_001", undefined, tokenSes);
  }, /Modalidad de evaluación no especificada/i);
});

assertTest("B.2: Iniciar evaluación con null, '' o espacios es rechazado", () => {
  const ctx = crearContextoPruebas();
  const tokenSes = simularSesionAlumno(ctx, "MAT_001");
  
  assert.throws(() => {
    ctx.iniciarEvaluacionAlumno("MAT_001", null, tokenSes);
  }, /Modalidad de evaluación no especificada/i);

  assert.throws(() => {
    ctx.iniciarEvaluacionAlumno("MAT_001", "", tokenSes);
  }, /Modalidad de evaluación no especificada/i);

  assert.throws(() => {
    ctx.iniciarEvaluacionAlumno("MAT_001", "   ", tokenSes);
  }, /Modalidad de evaluación no especificada/i);
});

assertTest("B.3: Iniciar evaluación con modalidad desconocida ('aleatorio', 'libre') es rechazado", () => {
  const ctx = crearContextoPruebas();
  const tokenSes = simularSesionAlumno(ctx, "MAT_001");

  assert.throws(() => {
    ctx.iniciarEvaluacionAlumno("MAT_001", "aleatorio", tokenSes);
  }, /Modalidad de evaluación no reconocida/i);

  assert.throws(() => {
    ctx.iniciarEvaluacionAlumno("MAT_001", "libre", tokenSes);
  }, /Modalidad de evaluación no reconocida/i);
});

assertTest("B.4: Guardar resultados con modalidad ausente o desconocida es rechazado", () => {
  const ctx = crearContextoPruebas();
  const tokenSes = simularSesionAlumno(ctx, "MAT_001");
  const evalInicio = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokenSes);
  const idLec = evalInicio.lectura.idLectura;

  assert.throws(() => {
    ctx.guardarResultadosExamen({
      tokenExamen: evalInicio.tokenExamen,
      matricula: "MAT_001",
      idLectura: idLec,
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["Mitología"]
      // modo ausente
    });
  }, /Modalidad de evaluación no especificada/i);

  assert.throws(() => {
    ctx.guardarResultadosExamen({
      tokenExamen: evalInicio.tokenExamen,
      matricula: "MAT_001",
      idLectura: idLec,
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["Mitología"],
      modo: "invalido"
    });
  }, /Modalidad de evaluación no reconocida/i);
});

assertTest("B.5: Modalidad enviada al guardar distinta de la vinculada al token es rechazada", () => {
  const ctx = crearContextoPruebas();
  const tokenSes = simularSesionAlumno(ctx, "MAT_001");
  const evalInicio = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokenSes);
  const idLec = evalInicio.lectura.idLectura;

  assert.throws(() => {
    ctx.guardarResultadosExamen({
      tokenExamen: evalInicio.tokenExamen,
      matricula: "MAT_001",
      idLectura: idLec,
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["Mitología"],
      modo: "trimestral",
      trimestre: "1"
    });
  }, /Conflicto de modalidad/i);
});

assertTest("B.6: Trimestre ausente, inválido o diferente del autorizado es rechazado", () => {
  const ctx = crearContextoPruebas();
  const tokenSes = simularSesionAlumno(ctx, "MAT_001");

  // Iniciar examen trimestral legítimo (asigna trimestre 1 por configuración escolar)
  const evalTrim = ctx.iniciarEvaluacionAlumno("MAT_001", "trimestral", tokenSes);
  const tokExamen = evalTrim.tokenExamen;
  const idLec = evalTrim.lectura.idLectura;

  // Trimestre ausente en guardado trimestral
  assert.throws(() => {
    ctx.guardarResultadosExamen({
      tokenExamen: tokExamen,
      matricula: "MAT_001",
      idLectura: idLec,
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["A"],
      modo: "trimestral",
      trimestre: ""
    });
  }, /Trimestre escolar no especificado/i);

  // Trimestre en conflicto con el asignado (enviar 2 cuando el intento fue en 1)
  assert.throws(() => {
    ctx.guardarResultadosExamen({
      tokenExamen: tokExamen,
      matricula: "MAT_001",
      idLectura: idLec,
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["A"],
      modo: "trimestral",
      trimestre: "2"
    });
  }, /Conflicto de trimestre/i);

  // Modo sorteo rechaza trimestre incompatible
  const evalSorteo = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokenSes);
  assert.throws(() => {
    ctx.guardarResultadosExamen({
      tokenExamen: evalSorteo.tokenExamen,
      matricula: "MAT_001",
      idLectura: evalSorteo.lectura.idLectura,
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["Mitología"],
      modo: "sorteo",
      trimestre: "99"
    });
  }, /Conflicto de examen: no se puede asociar un trimestre/i);
});

assertTest("B.7: Ambas modalidades válidas (sorteo y trimestral) funcionan legítimamente", () => {
  const ctx = crearContextoPruebas();
  const tokenSes = simularSesionAlumno(ctx, "MAT_001");

  // Sorteo legítimo
  const evSorteo = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokenSes);
  assert.ok(evSorteo.ok);
  assert.strictEqual(evSorteo.modo, "sorteo");
  const resSorteo = ctx.guardarResultadosExamen({
    tokenExamen: evSorteo.tokenExamen,
    matricula: "MAT_001",
    idLectura: evSorteo.lectura.idLectura,
    tiempoLectura: 50,
    tiempoReactivos: 20,
    respuestas: ["Mitología"],
    modo: "sorteo"
  });
  assert.ok(resSorteo.ok);

  // Trimestral legítimo
  const evTrim = ctx.iniciarEvaluacionAlumno("MAT_001", "trimestral", tokenSes);
  assert.ok(evTrim.ok);
  assert.strictEqual(evTrim.modo, "trimestral");
  const resTrim = ctx.guardarResultadosExamen({
    tokenExamen: evTrim.tokenExamen,
    matricula: "MAT_001",
    idLectura: evTrim.lectura.idLectura,
    tiempoLectura: 50,
    tiempoReactivos: 20,
    respuestas: ["A"],
    modo: "trimestral",
    trimestre: "1"
  });
  assert.ok(resTrim.ok);
});

assertTest("B.8: Interfaz.html envía explícitamente modalidades válidas y valida en cliente", () => {
  assert.ok(!INTERFAZ_HTML.includes("iniciarEvaluacionAlumno', mat, '',"),
    "No deben existir llamadas cliente con modo vacío");
  assert.ok(INTERFAZ_HTML.includes("arrancarEvaluacionDesdePanel(mat, 'sorteo', btn);"),
    "Llamadas a sorteo deben pasar 'sorteo' explícitamente");
  assert.ok(INTERFAZ_HTML.includes("arrancarEvaluacionDesdePanel(mat, 'trimestral', btn);"),
    "Llamadas a trimestral deben pasar 'trimestral' explícitamente");
  assert.ok(INTERFAZ_HTML.includes("modoLimpio !== 'sorteo' && modoLimpio !== 'trimestral'"),
    "Cliente debe validar lista blanca de modalidades antes de invocar servidor");
});

// =============================================================================
// CORRECCIÓN C — REVOCACIÓN COMPLETA Y LIMPIEZA DE SESIÓN
// =============================================================================
console.log("\n--- CORRECCIÓN C: Revocación completa y limpieza de sesión ---");

assertTest("C.1: Revocación con todas las claves presentes limpia todas las claves vinculadas", () => {
  const ctx = crearContextoPruebas();
  const token = simularSesionAlumno(ctx, "MAT_001");

  // Registrar un examen vigente
  ctx.__cache["examen_vigente_MAT_001"] = JSON.stringify({ tokenSesion: token, idLectura: "LEC_1" });

  assert.ok(ctx.__cache["sesion_" + token]);
  assert.ok(ctx.__cache["sesion_mat_" + token]);
  assert.ok(ctx.__cache["sesion_alumno_MAT_001"]);
  assert.ok(ctx.__cache["alumno_" + token]);
  assert.ok(ctx.__cache["examen_vigente_MAT_001"]);

  const res = ctx.revocarTokenSesion(token);
  assert.ok(res.ok);

  assert.strictEqual(ctx.__cache["sesion_" + token], undefined);
  assert.strictEqual(ctx.__cache["sesion_mat_" + token], undefined);
  assert.strictEqual(ctx.__cache["sesion_alumno_MAT_001"], undefined);
  assert.strictEqual(ctx.__cache["alumno_" + token], undefined);
  assert.strictEqual(ctx.__cache["examen_vigente_MAT_001"], undefined);
});

assertTest("C.2: Revocación con sesión global ausente: sesion_mat_ permite recuperar matrícula y limpiar examen_vigente", () => {
  const ctx = crearContextoPruebas();
  const token = "token-sesion-huerfana";
  ctx.__cache["sesion_mat_" + token] = "MAT_001";
  ctx.__cache["examen_vigente_MAT_001"] = JSON.stringify({ tokenSesion: token, idLectura: "LEC_1" });
  ctx.__cache["sesion_alumno_MAT_001"] = token;

  assert.strictEqual(ctx.__cache["sesion_" + token], undefined);

  const res = ctx.revocarTokenSesion(token);
  assert.ok(res.ok);
  assert.strictEqual(ctx.__cache["examen_vigente_MAT_001"], undefined);
  assert.strictEqual(ctx.__cache["sesion_alumno_MAT_001"], undefined);
  assert.strictEqual(ctx.__cache["sesion_mat_" + token], undefined);
});

assertTest("C.3: Sesión global corrupta (JSON inválido) no provoca error no controlado y limpia claves", () => {
  const ctx = crearContextoPruebas();
  const token = "token-corrupto";
  ctx.__cache["sesion_" + token] = "{ JSON CORRUPTO NO PARSEABLE !!!";
  ctx.__cache["sesion_mat_" + token] = "MAT_001";
  ctx.__cache["examen_vigente_MAT_001"] = JSON.stringify({ tokenSesion: token, idLectura: "LEC_1" });

  const res = ctx.revocarTokenSesion(token);
  assert.ok(res.ok);
  assert.strictEqual(ctx.__cache["sesion_" + token], undefined);
  assert.strictEqual(ctx.__cache["sesion_mat_" + token], undefined);
  assert.strictEqual(ctx.__cache["examen_vigente_MAT_001"], undefined);
});

assertTest("C.4: Token inexistente, vacío o arbitrario: maneja con seguridad sin borrar claves ajenas", () => {
  const ctx = crearContextoPruebas();
  
  ctx.__cache["sesion_legitima"] = JSON.stringify({ matricula: "MAT_001", rol: "alumno" });
  ctx.__cache["examen_vigente_MAT_001"] = JSON.stringify({ tokenSesion: "sesion_legitima" });

  const resArbitrario = ctx.revocarTokenSesion("tok_adivinado_999");
  assert.strictEqual(resArbitrario.ok, true);
  assert.strictEqual(resArbitrario.revocado, true);

  const resVacio = ctx.revocarTokenSesion("");
  assert.strictEqual(resVacio.ok, true);
  assert.strictEqual(resVacio.revocado, true);

  assert.ok(ctx.__cache["sesion_legitima"], "Sesión legítima debe permanecer intacta");
  assert.ok(ctx.__cache["examen_vigente_MAT_001"], "Examen de otro usuario debe permanecer intacto");
});

assertTest("C.5: Cierre de sesión de clase con relación válida e inválida", () => {
  const ctx = crearContextoPruebas();

  // Caso 1: Token legítimo de clase con rol admin
  const tokenClase = "token-clase-valido";
  ctx.__cache["clase_" + tokenClase] = JSON.stringify({ grupo: "1A", admin: true, rol: "admin" });
  ctx.__cache["admin_" + tokenClase] = "1";
  ctx.__cache["sesion_" + tokenClase] = JSON.stringify({ rol: "docente" });

  const resValido = ctx.cerrarSesionClase(tokenClase);
  assert.ok(resValido.ok);
  assert.strictEqual(ctx.__cache["clase_" + tokenClase], undefined);
  assert.strictEqual(ctx.__cache["admin_" + tokenClase], undefined);
  assert.strictEqual(ctx.__cache["sesion_" + tokenClase], undefined);

  // Caso 2: Intento de revocar sesion_ ajena mediante token inventado en cerrarSesionClase
  const tokenSesionAjena = "token-admin-activo";
  ctx.__cache["sesion_" + tokenSesionAjena] = JSON.stringify({ rol: "admin" });

  ctx.cerrarSesionClase(tokenSesionAjena);
  assert.ok(ctx.__cache["sesion_" + tokenSesionAjena], "sesion_ ajena NO debe ser revocada por cerrarSesionClase arbitrario");
});

assertTest("C.6: Interfaz.html limpia exhaustivamente memoria y DOM antes de la llamada de red", () => {
  // Verificar variables de estado reseteadas
  const varsEstado = [
    "tokenSesionActual = ''", "matriculaActual = ''", "panelDatos = null",
    "paquete = {}", "indicePregunta = 0", "respuestas = []", "tiemposPregunta = []",
    "ppmCalculado = 0", "relecturas = 0"
  ];
  for (const v of varsEstado) {
    assert.ok(INTERFAZ_HTML.includes(v), `Debe contener reseteo de variable '${v}'`);
  }

  // Verificar limpieza de elementos DOM sensibles
  const elementosLimpiados = ["cajaTexto", "cajaPreguntas", "cajaLectura", "bloquePregunta", "ppmNumero", "ppmDetalle", "ppmMensaje", "fichaLectura", "datoPalabras"];
  for (const el of elementosLimpiados) {
    assert.ok(INTERFAZ_HTML.includes(`'${el}'`), `Debe referenciar y limpiar el elemento DOM '${el}'`);
  }
});

assertTest("C.7: Fallo de red durante la revocación no restaura datos ni engaña al usuario", () => {
  assert.ok(INTERFAZ_HTML.includes("gsRun('revocarTokenSesion', tokenViejo).catch(function (eRev) {"),
    "Debe capturar fallo de red en revocarTokenSesion");
  assert.ok(INTERFAZ_HTML.includes("console.warn('Fallo de red al revocar sesión en servidor"),
    "Debe registrar advertencia técnica sin alert engañoso");
  assert.ok(!INTERFAZ_HTML.includes("alert('Sesión cerrada con éxito')"),
    "No debe emitir mensaje engañoso de éxito si la red falló");
});

assertTest("C.8: No se revocan sesiones independientes ni se borran exámenes de otros alumnos", () => {
  const ctx = crearContextoPruebas();

  // Alumno A
  const tokenA = simularSesionAlumno(ctx, "MAT_001");
  const evalA = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokenA);

  // Alumno B
  const tokenB = simularSesionAlumno(ctx, "MAT_002");
  const evalB = ctx.iniciarEvaluacionAlumno("MAT_002", "sorteo", tokenB);

  // Revocar Alumno A
  ctx.revocarTokenSesion(tokenA);

  // Verificar que Alumno B sigue intacto
  assert.ok(ctx.__cache["sesion_" + tokenB], "Sesión de B debe seguir viva");
  assert.ok(ctx.__cache["sesion_alumno_MAT_002"], "Mapeo alumno B debe seguir vivo");
  assert.ok(ctx.__cache["examen_vigente_MAT_002"], "Examen vigente de B debe seguir intacto");

  // Alumno B puede guardar su examen sin problemas
  const resB = ctx.guardarResultadosExamen({
    tokenExamen: evalB.tokenExamen,
    matricula: "MAT_002",
    idLectura: evalB.lectura.idLectura,
    tiempoLectura: 45,
    tiempoReactivos: 20,
    respuestas: ["Mitología"],
    modo: "sorteo"
  });
  assert.ok(resB.ok, "Alumno B guarda su examen exitosamente");
});

// =============================================================================
// RESUMEN
// =============================================================================
console.log("\n================================================================================");
console.log(`RESUMEN QUINTA CORRECCIÓN: ${passedTests} EXITOSAS, ${failedTests} FALLIDAS (TOTAL: ${totalTests})`);
console.log("================================================================================");

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
