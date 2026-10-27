/**
 * ST90 — SUITE DE PRUEBAS DE SEGURIDAD: TERCERA CORRECCIÓN
 * Hallazgos: SEC-A02-01, SEC-A03-01, SEC-A03-02, SEC-A03-03, SEC-A02-02.
 * 
 * Entorno de ejecución: Node.js emulado (Mocks de Google Apps Script: CacheService, PropertiesService,
 * SpreadsheetApp, LockService, Utilities).
 * DISTINCIÓN OBLIGATORIA: Estas pruebas se ejecutan en entorno Node.js emulado local;
 * no representan una llamada en vivo a los servidores de producción de Google Apps Script.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

console.log("================================================================================");
console.log("ST90 — TERCERA CORRECCIÓN DE SEGURIDAD: PRUEBAS LOCALES OBLIGATORIAS");
console.log("Hallazgos: SEC-A02-01, SEC-A03-01, SEC-A03-02, SEC-A03-03, SEC-A02-02");
console.log("================================================================================\n");

// Verificación sintáctica
["Codigo.gs", "Asistencia.gs", "ClaseLogica.gs"].forEach(f => {
  const p = path.join(__dirname, "..", f);
  const code = String(p).includes("Codigo.gs") ? require("./_cargar_codigo.js")() : fs.readFileSync(p, "utf8");
  try {
    new vm.Script(code, { filename: f });
    console.log(`[SYNTAX CHECK PASS] ${f}`);
  } catch (err) {
    console.error(`[SYNTAX CHECK FAIL] ${f}:`, err);
    process.exit(1);
  }
});
console.log("");

function crearContextoPruebas(opts = {}) {
  const ID_PROD = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  const ID_TEST = "1TEST_BOOK_AUTHORIZED_999999999999999";
  const entorno = opts.entorno || "PRUEBAS";
  const hojaId = opts.hojaId || (entorno === "PRODUCCION" ? ID_PROD : ID_TEST);
  const realId = opts.realId !== undefined ? opts.realId : hojaId;

  const scriptProperties = {
    ENTORNO: entorno,
    HOJA_ID: hojaId,
    CLAVE_ADMIN_HASH: "099ebea48ea9666a7da21770e838242fa80a2b26", // sha1 mock
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
      ["MAT_002", "ALUMNO DOS", "1", "B", "alu2", "saltAlu2", "hashAlu2", "SI", "clavePlana456"],
      ["MAT_003", "ALUMNO TRES", "2", "A", "alu3", "saltAlu3", "hashAlu3", "SI", "clavePlana789"]
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
      ["LEC_1A", "1", "Español", "Lectura Uno", "Texto largo de prueba con suficientes palabras para calcular correctamente la velocidad lectora y compresion de forma estable.", 18, JSON.stringify([
        { p: "¿Pregunta 1?", opciones: ["A", "B", "C", "D"], respuesta: "A", nivel: "literal" },
        { p: "¿Pregunta 2?", opciones: ["A", "B", "C", "D"], respuesta: "B", nivel: "inferencial" }
      ]), "SI", "BANCO"],
      ["LEC_TRIM_1", "1", "Español", "Lectura Trimestral", "Texto trimestral de prueba.", 10, JSON.stringify([
        { p: "¿Pregunta Trim 1?", opciones: ["A", "B"], respuesta: "A", nivel: "critico" }
      ]), "SI", "TRIMESTRE_1"]
    ],
    Preguntas: [
      ["ID Lectura", "Orden", "Enunciado", "Opción 1", "Opción 2", "Opción 3", "Opción 4", "Opción 5", "Opción 6", "Respuesta correcta", "Nivel"],
      ["LEC_1A", 1, "¿Pregunta 1?", "A", "B", "C", "D", "", "", "A", "literal"],
      ["LEC_1A", 2, "¿Pregunta 2?", "A", "B", "C", "D", "", "", "B", "inferencial"],
      ["LEC_TRIM_1", 1, "¿Pregunta Trim 1?", "A", "B", "", "", "", "", "A", "critico"]
    ],
    Resultados: [
      ["Marca Temporal", "Escuela", "Matrícula", "Nombre Estudiante", "Grado", "Grupo", "Género", "Asignatura", "Tema", "ID Lectura", "Tiempo Lectura (s)", "Tiempo Reactivos (s)", "Tiempo Total (s)", "Segundos por pregunta", "Aciertos", "Calificación comprensión (%)", "PPM", "Nivel PPM", "Calificación global (%)", "Intento", "PME", "Relecturas", "Desglose niveles", "Modo", "Trimestre", "Recomendación"]
    ],
    Config: [
      ["Clave", "Valor"],
      ["INTENTOS_DEFAULT", "1"],
      ["LECTURAS_TRIMESTRALES", JSON.stringify({
        activo: "1",
        trimestres: {
          "1": { inicio: "2026-08-01", fin: "2026-11-30", intentos: 1 },
          "2": { inicio: "2026-12-01", fin: "2027-03-31", intentos: 1 },
          "3": { inicio: "2027-04-01", fin: "2027-07-31", intentos: 1 }
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
    getName: () => (realId === ID_PROD ? "Lectura PRODUCCION" : "Lectura TEST"),
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
      formatDate: () => "2026-10-16"
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
        releaseLock: () => {}
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
      fetch: () => ({ getResponseCode: () => 200, getContentText: () => JSON.stringify({ choices: [{ message: { content: "Recomendación pedagógica de prueba." } }] }) })
    },
    __sheets: sheetsMap,
    __cache: cacheStore,
    __libro: libroMock
  };

  const context = vm.createContext(sandbox);
  ["Codigo.gs", "Asistencia.gs", "ClaseLogica.gs"].forEach(f => {
    const p = path.join(__dirname, "..", f);
    const code = String(p).includes("Codigo.gs") ? require("./_cargar_codigo.js")() : fs.readFileSync(p, "utf8");
    vm.runInContext(code, context, { filename: f });
  });

  return context;
}

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(cond, desc) {
  totalTests++;
  if (cond) {
    passedTests++;
    console.log(`  [PASS] ${desc}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${desc}`);
  }
}

// ============================================================================
// SUITE 1: SEC-A02-01 — Prefecto, docente y apoyo no reciben contraseñas, hashes ni sales
// ============================================================================
console.log("--- SUITE 1: SEC-A02-01 — Credenciales no expuestas a personal escolar ---");
{
  const ctx = crearContextoPruebas();

  // Crear tokens de sesión para cada rol
  const tAdmin = "tok_admin_001";
  ctx.__cache["sesion_" + tAdmin] = JSON.stringify({ rol: "admin", nombre: "Admin General" });

  const tPref = "tok_pref_001";
  ctx.__cache["sesion_" + tPref] = JSON.stringify({ rol: "prefecto", prefectoId: "PREF_1", nombre: "Prefecta Uno" });

  const tDoc = "tok_doc_001";
  ctx.__cache["sesion_" + tDoc] = JSON.stringify({ rol: "docente", maestroId: "DOC_1", nombre: "Docente Uno" });

  const tApo = "tok_apo_001";
  ctx.__cache["sesion_" + tApo] = JSON.stringify({ rol: "apoyo", apoyoId: "APO_1", nombre: "Apoyo Uno" });

  // 1.1 El administrador recibe la cuenta, pero ya no la contraseña en claro:
  // la clave se muestra una sola vez al generarla y en la hoja solo queda el hash.
  const resAdmin = ctx.panelResumen(tAdmin);
  assert(resAdmin && resAdmin.ok && resAdmin.alumnos.length > 0, "panelResumen funciona para admin");
  const aluAdmin = resAdmin.alumnos.find(a => a.matricula === "MAT_001");
  assert(aluAdmin && aluAdmin.clave === "", "El panel no expone la contraseña en claro, tampoco para el administrador");
  assert(aluAdmin && typeof aluAdmin.usuario === "string", "El administrador sigue viendo el usuario de la cuenta");

  // Función de inspección profunda contra credenciales, hashes y sales
  function inspeccionarCredenciales(obj, path = "") {
    const filtraciones = [];
    if (!obj || typeof obj !== "object") return filtraciones;
    for (const [k, v] of Object.entries(obj)) {
      const kLow = k.toLowerCase();
      const currentPath = path ? `${path}.${k}` : k;
      if (kLow === "clave" || kLow === "usuario" || kLow === "hash" || kLow === "salt") {
        if (v !== "" && v !== null && v !== undefined) {
          filtraciones.push(`${currentPath} = "${v}"`);
        }
      }
      if (typeof v === "object" && v !== null) {
        filtraciones.push(...inspeccionarCredenciales(v, currentPath));
      }
    }
    return filtraciones;
  }

  // 1.2 Rol PREFECTO no recibe clave, usuario, hash ni salt
  const resPref = ctx.panelResumen(tPref);
  assert(resPref && resPref.ok && resPref.alumnos.length > 0, "panelResumen entrega alumnos asignados al prefecto");
  const filtracionesPref = inspeccionarCredenciales(resPref.alumnos);
  assert(filtracionesPref.length === 0, "Prefecto NO recibe contraseñas, usuarios, hashes ni sales en ningún alumno");
  const aluPref = resPref.alumnos[0];
  assert(aluPref.clave === "" && aluPref.usuario === "", "Campos clave y usuario están vacíos para prefecto");
  assert(aluPref.hash === undefined && aluPref.salt === undefined, "Hashes y sales eliminados de la respuesta para prefecto");

  // 1.3 Rol DOCENTE no recibe credenciales
  const resDoc = ctx.panelResumen(tDoc);
  assert(resDoc && resDoc.ok && resDoc.alumnos.length > 0, "panelResumen entrega alumnos asignados al docente");
  const filtracionesDoc = inspeccionarCredenciales(resDoc.alumnos);
  assert(filtracionesDoc.length === 0, "Docente NO recibe contraseñas, usuarios, hashes ni sales");

  // 1.4 Rol APOYO no recibe credenciales
  const resApo = ctx.panelResumen(tApo);
  assert(resApo && resApo.ok && resApo.alumnos.length > 0, "panelResumen entrega alumnos asignados al apoyo");
  const filtracionesApo = inspeccionarCredenciales(resApo.alumnos);
  assert(filtracionesApo.length === 0, "Personal de apoyo NO recibe contraseñas, usuarios, hashes ni sales");

  // 1.5 Ficha de alumno para prefecto no expone credenciales
  const fichaPref = ctx.fichaAlumnoAdmin(tPref, "MAT_001");
  assert(fichaPref && fichaPref.ok && !fichaPref.clave && !fichaPref.usuario, "fichaAlumnoAdmin para prefecto no expone credenciales");
}

// ============================================================================
// SUITE 2: SEC-A03-01 — Llamada anónima a iniciarEvaluacionAlumno() para matrícula ajena
// ============================================================================
console.log("\n--- SUITE 2: SEC-A03-01 — Bloqueo de llamadas anónimas a iniciarEvaluacionAlumno ---");
{
  const ctx = crearContextoPruebas();

  // 2.1 Llamada anónima sin tokenSesion
  let errSinToken = null;
  try {
    ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo");
  } catch (e) { errSinToken = e; }
  assert(errSinToken && errSinToken.message.includes("se requiere una sesión autenticada"),
    "iniciarEvaluacionAlumno rechaza llamada anónima sin token");

  // 2.2 Llamada con token vacío o en blanco
  let errTokenVacio = null;
  try {
    ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", "   ");
  } catch (e) { errTokenVacio = e; }
  assert(errTokenVacio && errTokenVacio.message.includes("se requiere una sesión autenticada"),
    "iniciarEvaluacionAlumno rechaza token de sesión vacío o espacios en blanco");

  // 2.3 Verificar que no se generó ningún token ni se alteró CacheService
  assert(Object.keys(ctx.__cache).filter(k => k.startsWith("examen_token_")).length === 0,
    "No se emitió ningún token de examen en llamadas anónimas");
}

// ============================================================================
// SUITE 3: SEC-A03-01 — Sesión válida intentando iniciar evaluación para otra matrícula
// ============================================================================
console.log("\n--- SUITE 3: SEC-A03-01 — Sesión válida atacando otra matrícula ---");
{
  const ctx = crearContextoPruebas();
  const tokAtacante = "tok_sesion_mat_002";
  ctx.__cache["sesion_" + tokAtacante] = JSON.stringify({
    rol: "alumno",
    matricula: "MAT_002",
    nombre: "Alumno Dos",
    grado: "1",
    grupo: "b"
  });

  // Atacante con sesión MAT_002 intenta iniciar examen a nombre de MAT_001
  let errMatAjena = null;
  try {
    ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokAtacante);
  } catch (e) { errMatAjena = e; }
  assert(errMatAjena && errMatAjena.message.includes("no estás autorizado para iniciar evaluaciones a nombre de otro alumno"),
    "Servidor bloquea a sesión válida que intenta iniciar examen a nombre de otra matrícula");

  // Sesión legítima de MAT_002 iniciando examen propio
  const inicioLegitimo = ctx.iniciarEvaluacionAlumno("MAT_002", "sorteo", tokAtacante);
  assert(inicioLegitimo && inicioLegitimo.ok && inicioLegitimo.tokenExamen,
    "Sesión legítima inicia examen propio con éxito");
}

// ============================================================================
// SUITE 4: SEC-A03-01 — Intento de quiosco sin autorización verificable
// ============================================================================
console.log("\n--- SUITE 4: SEC-A03-01 — Bloqueo de quiosco sin autorización verificable ---");
{
  const ctx = crearContextoPruebas();

  // Intento de simular quiosco con token inventado o indicador arbitrario
  let errQuiosco = null;
  try {
    ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", "token_inventado_quiosco_123");
  } catch (e) { errQuiosco = e; }
  assert(errQuiosco && errQuiosco.message.includes("token de sesión inválido o expirado"),
    "Intento de quiosco sin sesión verificable en servidor es rechazado tajantemente");

  // Rol no autorizado (ej. prefecto o apoyo no docente) intentando iniciar examen
  const tPref = "tok_pref_examen";
  ctx.__cache["sesion_" + tPref] = JSON.stringify({ rol: "prefecto", prefectoId: "PREF_1", nombre: "Prefecta" });
  let errRolNoAutorizado = null;
  try {
    ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tPref);
  } catch (e) { errRolNoAutorizado = e; }
  assert(errRolNoAutorizado && errRolNoAutorizado.message.includes("rol no autorizado para iniciar evaluaciones"),
    "Roles no pedagógicos (prefecto/apoyo) no pueden emitir tokens de examen para alumnos");
}

// ============================================================================
// SUITE 5: SEC-A03-02 — Modalidad y trimestre manipulables
// ============================================================================
console.log("\n--- SUITE 5: SEC-A03-02 — Validación estricta de modalidad y trimestre ---");
{
  const ctx = crearContextoPruebas();
  const tokSesMat1 = "tok_ses_mat1_suite5";
  ctx.__cache["sesion_" + tokSesMat1] = JSON.stringify({
    rol: "alumno",
    matricula: "MAT_001",
    nombre: "Alumno Uno",
    grado: "1",
    grupo: "a"
  });

  // 5.1 Iniciar examen en modalidad "sorteo" ordinario
  const inicioSorteo = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokSesMat1);
  assert(inicioSorteo && inicioSorteo.ok, "Examen ordinario de sorteo iniciado");
  const tokSorteo = inicioSorteo.tokenExamen;
  const lecSorteo = inicioSorteo.lectura.idLectura;

  // Intento de manipular payload: enviar como si fuera examen trimestral
  let errModoManipulado = null;
  try {
    ctx.guardarResultadosExamen({
      tokenExamen: tokSorteo,
      matricula: "MAT_001",
      idLectura: lecSorteo,
      modo: "trimestral", // Ataque: intentar convertir sorteo a trimestral
      trimestre: "1",
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["A", "B"]
    });
  } catch (e) { errModoManipulado = e; }
  assert(errModoManipulado && errModoManipulado.message.includes("Conflicto de modalidad"),
    "guardarResultadosExamen rechaza convertir examen de sorteo en trimestral");

  // Comprobar que el token NO fue consumido tras el fallo de validación
  assert(ctx.__cache["examen_token_" + tokSorteo] !== undefined,
    "El token de examen NO fue consumido tras error de validación de modalidad");

  // 5.2 Iniciar examen en modalidad trimestral legítima
  const inicioTrim = ctx.iniciarEvaluacionAlumno("MAT_001", "trimestral", tokSesMat1);
  assert(inicioTrim && inicioTrim.ok && inicioTrim.modo === "trimestral", "Examen trimestral iniciado");
  const tokTrim = inicioTrim.tokenExamen;
  const lecTrim = inicioTrim.lectura.idLectura;

  // Intento de manipular trimestre asignado (enviar trimestre "2" cuando el asignado es "1")
  let errTrimManipulado = null;
  try {
    ctx.guardarResultadosExamen({
      tokenExamen: tokTrim,
      matricula: "MAT_001",
      idLectura: lecTrim,
      modo: "trimestral",
      trimestre: "2", // Ataque: enviar trimestre distinto al asignado en el intento
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["A"]
    });
  } catch (e) { errTrimManipulado = e; }
  assert(errTrimManipulado && errTrimManipulado.message.includes("Conflicto de trimestre"),
    "guardarResultadosExamen rechaza manipulación de trimestre");

  // Intento de enviar trimestre inexistente en la configuración escolar
  const tokInvalCfg = "tok_inv_cfg";
  ctx.__cache["examen_token_" + tokInvalCfg] = JSON.stringify({
    token: tokInvalCfg,
    matricula: "MAT_001",
    idLectura: lecTrim,
    modo: "trimestral",
    trimestre: "99",
    intentoEsperado: 1
  });
  let errCfgTrim = null;
  try {
    ctx.guardarResultadosExamen({
      tokenExamen: tokInvalCfg,
      matricula: "MAT_001",
      idLectura: lecTrim,
      modo: "trimestral",
      trimestre: "99",
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["A"]
    });
  } catch (e) { errCfgTrim = e; }
  assert(errCfgTrim && errCfgTrim.message.includes("no es válido según la configuración escolar"),
    "guardarResultadosExamen rechaza trimestre fuera de configuración escolar");
}

// ============================================================================
// SUITE 6: SEC-A03-03 — Fallo simulado al escribir en Resultados y reintento
// ============================================================================
console.log("\n--- SUITE 6: SEC-A03-03 — Resiliencia ante fallos de persistencia y reintento ---");
{
  const ctx = crearContextoPruebas();
  const tokSesMat1 = "tok_ses_mat1_suite6";
  ctx.__cache["sesion_" + tokSesMat1] = JSON.stringify({
    rol: "alumno",
    matricula: "MAT_001",
    nombre: "Alumno Uno",
    grado: "1",
    grupo: "a"
  });

  const inicio = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokSesMat1);
  const tokExamen = inicio.tokenExamen;
  const lecId = inicio.lectura.idLectura;

  const hojaRes = ctx.__sheets["Resultados"];
  const filasIniciales = hojaRes._data.length;

  // Simular fallo catastrófico en Google Sheets durante appendRow
  hojaRes.simularFalloEscritura = true;

  let errFalloEscritura = null;
  try {
    ctx.guardarResultadosExamen({
      tokenExamen: tokExamen,
      matricula: "MAT_001",
      idLectura: lecId,
      modo: "sorteo",
      tiempoLectura: 50,
      tiempoReactivos: 20,
      respuestas: ["A", "B"]
    });
  } catch (e) { errFalloEscritura = e; }

  assert(errFalloEscritura && errFalloEscritura.message.includes("Fallo al registrar resultados en la base de datos"),
    "Fallo de Google Sheets es capturado y reportado claramente al usuario");
  assert(hojaRes._data.length === filasIniciales,
    "La hoja Resultados no contiene filas corruptas ni incompletas");
  assert(ctx.__cache["examen_token_" + tokExamen] !== undefined,
    "El token de examen permanece íntegro y NO fue consumido ni destruido por el fallo");

  // Restaurar el servicio de Google Sheets y reintentar con el MISMO token
  hojaRes.simularFalloEscritura = false;
  const resReintento = ctx.guardarResultadosExamen({
    tokenExamen: tokExamen,
    matricula: "MAT_001",
    idLectura: lecId,
    modo: "sorteo",
    tiempoLectura: 50,
    tiempoReactivos: 20,
    respuestas: ["A", "B"]
  });

  assert(resReintento && resReintento.ok && typeof resReintento.resultado.aciertos === "number" && resReintento.resultado.total > 0,
    "Reintento con el mismo token tras recuperar la conexión fue exitoso y calificado");
  assert(hojaRes._data.length === filasIniciales + 1,
    "La fila de resultados se persistió exactamente una vez en Google Sheets");
}

// ============================================================================
// SUITE 7: SEC-A03-03 — Reenvío del mismo token y solicitudes concurrentes
// ============================================================================
console.log("\n--- SUITE 7: SEC-A03-03 — Idempotencia y protección contra reenvío / concurrencia ---");
{
  const ctx = crearContextoPruebas();
  const tokSesMat1 = "tok_ses_mat1_suite7";
  ctx.__cache["sesion_" + tokSesMat1] = JSON.stringify({
    rol: "alumno",
    matricula: "MAT_001",
    nombre: "Alumno Uno",
    grado: "1",
    grupo: "a"
  });

  const inicio = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokSesMat1);
  const tokEx = inicio.tokenExamen;
  const lecId = inicio.lectura.idLectura;

  const hojaRes = ctx.__sheets["Resultados"];

  // 7.1 Envío primario exitoso
  const res1 = ctx.guardarResultadosExamen({
    tokenExamen: tokEx,
    matricula: "MAT_001",
    idLectura: lecId,
    modo: "sorteo",
    tiempoLectura: 45,
    tiempoReactivos: 25,
    respuestas: ["A", "B"]
  });
  assert(res1 && res1.ok, "Envío primario completado exitosamente");
  const filasPostRes1 = hojaRes._data.length;

  // 7.2 Reenvío duplicado (replay attack / reenvío sin flag)
  let errReplay = null;
  try {
    ctx.guardarResultadosExamen({
      tokenExamen: tokEx,
      matricula: "MAT_001",
      idLectura: lecId,
      modo: "sorteo",
      tiempoLectura: 45,
      tiempoReactivos: 25,
      respuestas: ["A", "B"]
    });
  } catch (e) { errReplay = e; }
  assert(errReplay && errReplay.message.includes("inválido, ha expirado o ya fue utilizado"),
    "Reenvío ordinario o ataque de repetición es rechazado atómicamente");
  assert(hojaRes._data.length === filasPostRes1,
    "El reenvío duplicado NO registró filas adicionales en Resultados (0 duplicados)");

  // 7.3 Reintento de cliente legítimo por desconexión (flag reintento = true)
  const resIdempotente = ctx.guardarResultadosExamen({
    tokenExamen: tokEx,
    matricula: "MAT_001",
    idLectura: lecId,
    modo: "sorteo",
    reintento: true,
    tiempoLectura: 45,
    tiempoReactivos: 25,
    respuestas: ["A", "B"]
  });
  assert(resIdempotente && resIdempotente.ok && resIdempotente.reintentoIdempotente === true,
    "Reintento legítimo retorna respuesta idempotente con resultado idéntico");
  assert(hojaRes._data.length === filasPostRes1,
    "La respuesta idempotente no creó filas redundantes en Google Sheets");
}

// ============================================================================
// SUITE 8: SEC-A02-02 — Cierre de sesión, cambio de alumno y revocación en servidor
// ============================================================================
console.log("\n--- SUITE 8: SEC-A02-02 — Revocación de sesión y cambio de alumno ---");
{
  const ctx = crearContextoPruebas();

  // Login de alumno mediante iniciarSesionUnificada
  const login = ctx.iniciarSesionUnificada("alu1", "clavePlana123", "alumno");
  assert(login && login.ok && login.token, "Alumno inicia sesión unificada exitosamente");
  const tokenActivo = login.token;

  // Verificar que el token funciona para consultar panel e iniciar evaluación
  const panelOk = ctx.panelAlumno("MAT_001", tokenActivo);
  assert(panelOk && panelOk.ok, "Token de alumno permite consultar panel legítimamente");
  const evalOk = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokenActivo);
  assert(evalOk && evalOk.ok, "Token de alumno permite iniciar evaluación");

  // Ejecutar cierre de sesión / cambio de alumno (revocación en servidor)
  const resRevocar = ctx.revocarTokenSesion(tokenActivo);
  assert(resRevocar && resRevocar.ok, "revocarTokenSesion ejecuta limpiamente en el servidor");

  // Comprobar que en CacheService ya no existe la sesión ni el mapeo
  assert(ctx.__cache["sesion_" + tokenActivo] === undefined,
    "sesion_<token> fue completamente eliminada del servidor");
  assert(ctx.__cache["alumno_" + tokenActivo] === undefined,
    "alumno_<token> fue eliminada del servidor");
  assert(ctx.__cache["sesion_alumno_MAT_001"] === undefined,
    "sesion_alumno_<mat> fue eliminada del servidor");

  // Intentar reutilizar el token revocado para consultar panel
  let errPanelReutilizado = null;
  try {
    ctx.panelAlumno("MAT_001", tokenActivo);
  } catch (e) { errPanelReutilizado = e; }
  assert(errPanelReutilizado && errPanelReutilizado.message.includes("inválido o expirado"),
    "panelAlumno deniega el acceso con token revocado");

  // Intentar reutilizar el token revocado para iniciar un nuevo examen
  let errEvalReutilizado = null;
  try {
    ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokenActivo);
  } catch (e) { errEvalReutilizado = e; }
  assert(errEvalReutilizado && errEvalReutilizado.message.includes("inválido o expirado"),
    "iniciarEvaluacionAlumno deniega el acceso con token revocado");
}

// ============================================================================
// SUITE 9: Regresión de correcciones A-02 / A-03 ya aplicadas
// ============================================================================
console.log("\n--- SUITE 9: Regresión de blindajes previos A-02 y A-03 ---");
{
  const ctx = crearContextoPruebas();

  // 9.1 consultarCupoAlumno nunca entrega token de sesión
  const cupo = ctx.consultarCupoAlumno("MAT_001");
  assert(cupo && cupo.ok && cupo.tokenAlumno === undefined,
    "Regresión A-02: consultarCupoAlumno NO emite tokenAlumno");

  // 9.2 panelAlumno bloquea acceso anónimo con matrícula
  let errAnonPanel = null;
  try {
    ctx.panelAlumno("MAT_001", "");
  } catch (e) { errAnonPanel = e; }
  assert(errAnonPanel && errAnonPanel.message.includes("se requiere una sesión autenticada"),
    "Regresión A-02: panelAlumno bloquea consulta con solo matrícula y token vacío");

  // 9.3 Servidor recalcula calificaciones ignorando payload del cliente
  const tokSes = "tok_ses_regr";
  ctx.__cache["sesion_" + tokSes] = JSON.stringify({ rol: "alumno", matricula: "MAT_001", grado: "1", grupo: "a" });
  const inLeg = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokSes);
  const resTampered = ctx.guardarResultadosExamen({
    tokenExamen: inLeg.tokenExamen,
    matricula: "MAT_001",
    idLectura: inLeg.lectura.idLectura,
    modo: "sorteo",
    respuestas: ["Z", "Z"], // incorrectas
    aciertos: 99,           // cliente intenta falsificar aciertos
    calificacionGlobal: 100 // cliente intenta falsificar nota
  });
  assert(resTampered.ok && resTampered.resultado.aciertos === 0 && resTampered.resultado.comprension === 0,
    "Regresión A-03: Servidor ignora aciertos falsificados y calcula comprensión = 0%");
}

console.log("\n================================================================================");
console.log(`RESUMEN TERCERA CORRECCIÓN: ${passedTests} EXITOSAS, ${failedTests} FALLIDAS (TOTAL: ${totalTests})`);
console.log("================================================================================");

if (failedTests > 0) process.exit(1);
