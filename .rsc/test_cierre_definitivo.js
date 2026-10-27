/**
 * ST90 / LECTURA — CIERRE DEFINITIVO DE SEGURIDAD
 * Suite de Pruebas de Regresión y Validación Final
 * 
 * Alcance evaluado:
 * 1. CORRECCIÓN A — Consistencia del historial al recuperar un resultado de evaluación ya guardado.
 *    - Conservación estricta de la calificación original sin recálculo con datos posteriores.
 *    - El historial representa exclusivamente las evaluaciones anteriores a ese intento (no incluye el propio intento ni posteriores).
 *    - Primera evaluación recuperada tiene n=0, promedioGlobal=null, deltaGlobal=null.
 *    - Compatibilidad íntegra de todos los campos esperados por pintarResultadoFinal en Interfaz.html.
 *    - Verificación de no duplicación de filas ni alteración de calificaciones en reintentos repetidos.
 * 
 * 2. CORRECCIÓN B — Revocación de sesiones y verificación de relación entre tokens.
 *    - Revocación legítima de la sesión propia.
 *    - Bloqueo tajante ante intento de revocar sesiones ajenas mediante tokens de clase.
 *    - Manejo seguro de tokens inexistentes, vencidos o corruptos sin confirmar revocaciones no verificadas.
 *    - Protección de sesiones simultáneas de la misma matrícula.
 *    - Protección de evaluaciones en curso ante cierres de sesión de otros dispositivos.
 *    - Reintento de revocación idempotente sin efectos colaterales.
 * 
 * Declaración de entorno:
 * - Pruebas ejecutadas localmente en Node.js mediante VM sobre los archivos reales del proyecto.
 * - Dependencias de Google Apps Script (SpreadsheetApp, CacheService, LockService, PropertiesService, Utilities) son servicios simulados en memoria.
 * - No constituyen pruebas reales ejecutadas sobre la nube de Google Apps Script ni en la hoja de producción.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

console.log("================================================================================");
console.log("ST90 — CIERRE DEFINITIVO DE SEGURIDAD: SUITE DE PRUEBAS LOCALES");
console.log("================================================================================");
console.log("[ENTORNO] Ejecución en Node.js local con VM");
console.log("[EMULACIÓN] Dependencias Google Apps Script simuladas en memoria");
console.log("[AVISO] La integración real con Google Apps Script NO está probada aquí");
console.log("--------------------------------------------------------------------------------");

const CODIGO_GS = require("./_cargar_codigo.js")();
const ASISTENCIA_GS = fs.readFileSync(path.join(__dirname, "..", "Asistencia.gs"), "utf8");
const CLASE_LOGICA_GS = fs.readFileSync(path.join(__dirname, "..", "ClaseLogica.gs"), "utf8");
const PLANEACION_NEM_GS = fs.readFileSync(path.join(__dirname, "..", "PlaneacionNEM.gs"), "utf8");
const HORARIO_OFICIAL_GS = fs.readFileSync(path.join(__dirname, "..", "HorarioOficial.gs"), "utf8");
const CLASE_HTML = [fs.readFileSync(path.join(__dirname, "..", "Clase.html"), "utf8")]
  .concat(fs.readdirSync(path.join(__dirname, "..")).filter(f => /^ClaseJS_.*\.html$/.test(f)).sort()
    .map(f => fs.readFileSync(path.join(__dirname, "..", f), "utf8"))).join("\n");

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
verificarSintaxis(PLANEACION_NEM_GS, "PlaneacionNEM.gs");
verificarSintaxis(HORARIO_OFICIAL_GS, "HorarioOficial.gs");

// Verificar sintaxis del script en Clase.html
const scriptsClase = CLASE_HTML.match(/<script[\s\S]*?<\/script>/gi) || [];
scriptsClase.forEach((tag, idx) => {
  let codigo = tag.replace(/^<script.*?>/i, "").replace(/<\/script>$/i, "");
  // Reemplazar scriptlets GAS (<?=...?> o <?!=...?>) por literales válidos para parsear
  codigo = codigo.replace(/<\?[!=]?[\s\S]*?\?>/g, "''");
  verificarSintaxis(codigo, `Clase.html [script #${idx + 1}]`);
});

function crearContextoPruebas(opts = {}) {
  const scriptProperties = {
    ENTORNO: "PRODUCCION",
    HOJA_ID: "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU",
    CLAVE_ADMIN_HASH: "099ebea48ea9666a7da21770e838242fa80a2b26",
    CLAVE_ADMIN_SALT: "salt123",
    CLAVE_ADMIN_ES_DEFAULT: "0",
    ...(opts.customProperties || {})
  };

  const cacheStore = { ...(opts.initialCache || {}) };

  class HojaMock {
    constructor(nombre, datos) {
      this._nombre = nombre;
      this._data = datos ? JSON.parse(JSON.stringify(datos)) : [];
    }
    getName() { return this._nombre; }
    getLastRow() { return this._data.length; }
    getLastColumn() {
      if (!this._data.length) return 0;
      return this._data.reduce((max, row) => Math.max(max, row.length), 0);
    }
    appendRow(fila) {
      this._data.push(JSON.parse(JSON.stringify(fila)));
    }
    clearContents() {
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
          const rowIndex = row - 1;
          const colIndex = col - 1;
          while (sheet._data.length <= rowIndex) sheet._data.push([]);
          sheet._data[rowIndex][colIndex] = val;
        },
        setFontWeight: function() { return this; },
        setNumberFormat: function() { return this; }
      };
    }
  }

  const encabezadosDefecto = [
    "Marca Temporal", "Escuela", "Matrícula", "Nombre Estudiante", "Grado", "Grupo", "Género",
    "Asignatura", "Tema", "ID Lectura", "Tiempo Lectura (s)", "Tiempo Reactivos (s)", "Tiempo Total (s)",
    "Segundos por pregunta", "Aciertos", "Calificación comprensión (%)", "PPM", "Nivel PPM",
    "Calificación global (%)", "Intento", "PME", "Relecturas", "Desglose niveles", "Recomendación",
    "Modo", "Trimestre", "Token Examen"
  ];

  const hojas = {
    Config: new HojaMock("Config", [
      ["Clave", "Valor"],
      ["IDENTIDAD_NOMBRE", "Secundaria Técnica 90"],
      ["MODO_EVALUACION", "mixto"],
      ["TRIMESTRAL_HABILITADO", "SI"],
      ["TRIMESTRAL_T1_NOMBRE", "Primer Trimestre"],
      ["TRIMESTRAL_T1_DESDE", "2026-09-01"],
      ["TRIMESTRAL_T1_HASTA", "2026-11-30"],
      ["TRIMESTRAL_T1_INTENTOS", "3"],
      ["INTENTOS_DEFAULT", "5"],
      ["INTENTOS_POR_DEFECTO", "5"],
      ["PESO_COMPRENSION", "0.7"],
      ["PESO_VELOCIDAD", "0.3"]
    ]),
    Alumnos: new HojaMock("Alumnos", [
      ["Matrícula", "Nombre Completo", "Grado", "Grupo", "Activo", "Turno"],
      ["2026-0001", "ALUMNO CIERRE UNO", "1", "A", "SI", "MATUTINO"],
      ["2026-0002", "ALUMNO CIERRE DOS", "1", "A", "SI", "MATUTINO"]
    ]),
    Lecturas: new HojaMock("Lecturas", [
      ["ID Lectura", "Título", "Grado", "Asignatura", "Tema", "Texto", "Activa", "Modo", "Trimestre", "Palabras", "Preguntas JSON"],
      ["LEC-01", "Lectura Uno", "1", "Español", "Ficción", "Texto con suficientes palabras para cálculo de velocidad en primer grado escolar de secundaria.", "SI", "sorteo", "", 40, "[]"],
      ["LEC-02", "Lectura Dos", "1", "Historia", "Historia", "Segundo texto narrativo escolar para evaluar comprensión y fluidez lectora.", "SI", "sorteo", "", 45, "[]"]
    ]),
    Preguntas: new HojaMock("Preguntas", [
      ["ID Lectura", "Orden", "Enunciado", "Opción 1", "Opción 2", "Opción 3", "Opción 4", "Opción 5", "Opción 6", "Respuesta correcta", "Nivel"],
      ["LEC-01", 1, "¿Pregunta 1?", "A", "B", "C", "", "", "", "A", "literal"],
      ["LEC-01", 2, "¿Pregunta 2?", "X", "Y", "Z", "", "", "", "X", "inferencial"],
      ["LEC-02", 1, "¿Pregunta A?", "1", "2", "3", "", "", "", "1", "literal"]
    ]),
    Grupos: new HojaMock("Grupos", [
      ["Grado", "Grupo", "Turno", "Ciclo"],
      ["1", "A", "MATUTINO", "2026-2027"]
    ]),
    Resultados: new HojaMock("Resultados", [encabezadosDefecto, ...(opts.filasResultados || [])]),
    PersonalApoyo: new HojaMock("PersonalApoyo", [
      ["Id", "Nombre", "Rol", "Activo", "Usuario", "ClaveHash", "ClaveSalt"],
      ["AP-01", "Prefecta Demo", "prefecto", "SI", "prefecta1", "hash", "salt"]
    ]),
    Clases: new HojaMock("Clases", [
      ["Id", "Nombre", "Docente", "Grado", "Grupo", "Turno", "Activa", "CodigoAcceso"],
      ["CLS-01", "Español 1A", "Docente Demo", "1", "A", "MATUTINO", "SI", "ACC123"]
    ]),
    ContenidosClase: new HojaMock("ContenidosClase", [
      ["Id", "Id horario", "Maestro", "Asignatura", "Grado", "Grupo", "Dia", "Bloque", "Fecha", "Titulo", "Texto", "UrlAudio", "Publicado", "Timestamp"]
    ]),
    Horarios: new HojaMock("Horarios", [
      ["Id", "Dia", "Turno", "Bloque", "Hora inicio", "Hora fin", "Grado", "Grupo", "Maestro", "Asignatura", "Salon"],
      ["HOR-101", "lunes", "MATUTINO", "1", "07:00", "07:40", "1", "A", "Docente Demo", "Español", "Aula 1"]
    ]),
    MaestrosClase: new HojaMock("MaestrosClase", [
      ["Id", "Nombre", "Usuario", "Salt", "Hash", "Activo", "Clave"],
      ["DOC-01", "Docente Demo", "profesor1", "salt", "hash", "SI", "clave123"]
    ]),
    PlaneacionesNEM: new HojaMock("PlaneacionesNEM", [
      ["Id", "Titulo", "Grado", "Grupo", "Asignatura", "CampoFormativo", "Metodologia", "ContenidoSintetico", "PDA", "EjesArticuladores", "Proposito", "ProblemaComunidad", "ProductoFinal", "NumSesiones", "Docente", "Estado", "Version", "FechaCreacion", "FechaAprobacion"]
    ]),
    SesionesNEM: new HojaMock("SesionesNEM", [
      ["Id", "IdPlaneacion", "NumeroSesion", "Titulo", "DuracionMin", "AperturaTexto", "AperturaMin", "DesarrolloTexto", "DesarrolloMin", "RecursosVisualesJSON", "ActividadTexto", "ActividadMin", "CierreTexto", "CierreMin", "GuionDocenteJSON", "GuionEstudianteAccesible", "Estado", "IdHorario", "FechaProgramada", "Timestamp"]
    ])
  };

  const libroMock = {
    getSheetByName: (nombre) => hojas[nombre] || null,
    getSheets: () => Object.values(hojas),
    insertSheet: (nombre) => {
      if (!hojas[nombre]) {
        hojas[nombre] = new HojaMock(nombre, []);
      }
      return hojas[nombre];
    },
    getUrl: () => "https://docs.google.com/spreadsheets/d/1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU/edit",
    getId: () => "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU"
  };

  const sandbox = {
    console: console,
    Logger: { log: () => {} },
    Session: {
      getScriptTimeZone: () => "America/Mexico_City",
      getActiveUser: () => ({ getEmail: () => "admin@escuela.edu.mx" })
    },
    SpreadsheetApp: {
      openById: (id) => libroMock,
      getActiveSpreadsheet: () => libroMock,
      flush: () => {}
    },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (k) => scriptProperties[k] || null,
        getProperties: () => ({ ...scriptProperties }),
        setProperty: (k, v) => { scriptProperties[k] = String(v); },
        setProperties: (props) => { Object.assign(scriptProperties, props); },
        deleteProperty: (k) => { delete scriptProperties[k]; }
      })
    },
    CacheService: {
      getScriptCache: () => ({
        get: (k) => cacheStore[k] || null,
        put: (k, v, exp) => { cacheStore[k] = String(v); },
        remove: (k) => { delete cacheStore[k]; },
        removeAll: (keys) => { keys.forEach(k => delete cacheStore[k]); }
      })
    },
    LockService: {
      getScriptLock: () => ({
        waitLock: () => true,
        releaseLock: () => {}
      })
    },
    Utilities: {
      computeDigest: (algo, str) => {
        const crypto = require("crypto");
        const hash = crypto.createHash("sha1").update(str, "utf8").digest();
        return Array.from(hash);
      },
      DigestAlgorithm: { SHA_1: "SHA_1" },
      getUuid: () => {
        const crypto = require("crypto");
        return crypto.randomUUID();
      },
      formatDate: (d, tz, f) => "2026-10-18 10:00:00"
    },
    ScriptApp: {
      getService: () => ({
        getUrl: () => "https://script.google.com/macros/s/AKfycbz_test/exec"
      })
    },
    UrlFetchApp: {
      fetch: () => ({
        getResponseCode: () => 200,
        getContentText: () => JSON.stringify({ choices: [{ message: { content: "Consejo pedagógico seguro." } }] })
      })
    }
  };

  const ctx = vm.createContext(sandbox);
  vm.runInContext(CODIGO_GS, ctx);
  vm.runInContext(ASISTENCIA_GS, ctx);
  vm.runInContext(HORARIO_OFICIAL_GS, ctx);
  vm.runInContext(CLASE_LOGICA_GS, ctx);
  vm.runInContext(PLANEACION_NEM_GS, ctx);

  ctx.cacheStore = cacheStore;
  ctx.hojas = hojas;
  return ctx;
}

let pruebasPasadas = 0;
let pruebasFalladas = 0;

function it(nombre, fn) {
  try {
    fn();
    pruebasPasadas++;
    console.log(`  [PASS] ${nombre}`);
  } catch (err) {
    pruebasFalladas++;
    console.error(`  [FAIL] ${nombre}:`, err.message);
  }
}

// ============================================================================
console.log("\n--- SUITE 1: CORRECCIÓN A — CONSISTENCIA DEL HISTORIAL AL RECUPERAR ---");
// ============================================================================

it("A.1: Primera evaluación recuperada tras pérdida de servidor tiene n=0, promedio=null, delta=null (no incluye el propio intento)", () => {
  const ctx = crearContextoPruebas();
  const token = "tok-cierre-eval-01";
  const mat = "2026-0001";

  ctx.cacheStore["examen_token_" + token] = JSON.stringify({
    matricula: mat,
    idLectura: "LEC-01",
    modo: "sorteo",
    intentoEsperado: 1
  });
  ctx.cacheStore["examen_vigente_" + mat] = token;

  const payload = {
    matricula: mat,
    tokenExamen: token,
    idLectura: "LEC-01",
    modo: "sorteo",
    tiempoLectura: 60,
    tiempoReactivos: 30,
    relecturas: 1,
    respuestas: ["A", "X"],
    tiemposPregunta: [15, 15]
  };

  // Guardado exitoso primario
  const resGuardado = ctx.guardarResultadosExamen(payload);
  assert.strictEqual(resGuardado.ok, true);
  const orig = resGuardado.resultado;
  assert.strictEqual(orig.historial.n, 0, "Primera evaluación original debe tener n=0");
  assert.strictEqual(orig.historial.promedioGlobal, null, "Primera evaluación original debe tener promedioGlobal=null");
  assert.strictEqual(orig.historial.deltaGlobal, null, "Primera evaluación original debe tener deltaGlobal=null");

  // Simulamos pérdida total de la respuesta / caché
  delete ctx.cacheStore["examen_token_" + token];
  delete ctx.cacheStore["examen_consumido_" + token];
  delete ctx.cacheStore["examen_vigente_" + mat];

  // Recuperación mediante reintento idempotente
  const resRecuperado = ctx.guardarResultadosExamen({ ...payload, reintento: true });
  assert.strictEqual(resRecuperado.ok, true);
  assert.strictEqual(resRecuperado.reintentoIdempotente, true);

  const rec = resRecuperado.resultado;
  assert.strictEqual(rec.global, orig.global, "La calificación global recuperada debe ser idéntica a la original");
  assert.strictEqual(rec.comprension, orig.comprension, "La comprensión recuperada debe ser idéntica a la original");
  assert.strictEqual(rec.ppm, orig.ppm, "PPM recuperado debe ser idéntico al original");

  // COMPROBACIÓN CRÍTICA: Historial estrictamente anterior a este intento
  assert.strictEqual(rec.historial.n, 0, "El historial recuperado NO debe contar el intento propio como evaluación anterior (debe ser n=0)");
  assert.strictEqual(rec.historial.promedioGlobal, null, "promedioGlobal recuperado debe ser null");
  assert.strictEqual(rec.historial.deltaGlobal, null, "deltaGlobal recuperado debe ser null");
});

it("A.2: Recuperación de una evaluación cuando ya existen intentos anteriores y posteriores", () => {
  const ctx = crearContextoPruebas();
  const mat = "2026-0001";

  // 1. Intento 1 guardado previamente con calificación 80%
  const token1 = "tok-cierre-intento-1";
  ctx.cacheStore["examen_token_" + token1] = JSON.stringify({ matricula: mat, idLectura: "LEC-01", modo: "sorteo", intentoEsperado: 1 });
  ctx.guardarResultadosExamen({
    matricula: mat, tokenExamen: token1, idLectura: "LEC-01", modo: "sorteo",
    tiempoLectura: 60, tiempoReactivos: 20, relecturas: 0, respuestas: ["A", "Y"], tiemposPregunta: [10, 10]
  });

  // 2. Intento 2 completado con calificación 100%
  const token2 = "tok-cierre-intento-2";
  ctx.cacheStore["examen_token_" + token2] = JSON.stringify({ matricula: mat, idLectura: "LEC-01", modo: "sorteo", intentoEsperado: 2 });
  const res2 = ctx.guardarResultadosExamen({
    matricula: mat, tokenExamen: token2, idLectura: "LEC-01", modo: "sorteo",
    tiempoLectura: 60, tiempoReactivos: 20, relecturas: 0, respuestas: ["A", "X"], tiemposPregunta: [10, 10]
  });
  const histOriginalIntento2 = res2.resultado.historial;
  assert.strictEqual(histOriginalIntento2.n, 1, "Intento 2 debió tener n=1 evaluación anterior");
  const promPrevioOrig = histOriginalIntento2.promedioGlobal;
  const deltaPrevioOrig = histOriginalIntento2.deltaGlobal;

  // 3. Intento 3 posterior completado por el mismo alumno
  const token3 = "tok-cierre-intento-3";
  ctx.cacheStore["examen_token_" + token3] = JSON.stringify({ matricula: mat, idLectura: "LEC-02", modo: "sorteo", intentoEsperado: 3 });
  ctx.guardarResultadosExamen({
    matricula: mat, tokenExamen: token3, idLectura: "LEC-02", modo: "sorteo",
    tiempoLectura: 50, tiempoReactivos: 20, relecturas: 0, respuestas: ["1"], tiemposPregunta: [20]
  });

  // 4. Simulamos recuperación del Intento 2 tras pérdida de caché
  delete ctx.cacheStore["examen_token_" + token2];
  delete ctx.cacheStore["examen_consumido_" + token2];

  const resRecup2 = ctx.guardarResultadosExamen({
    matricula: mat, tokenExamen: token2, idLectura: "LEC-01", modo: "sorteo",
    tiempoLectura: 60, tiempoReactivos: 20, relecturas: 0, respuestas: ["A", "X"], tiemposPregunta: [10, 10],
    reintento: true
  });

  assert.strictEqual(resRecup2.ok, true);
  assert.strictEqual(resRecup2.reintentoIdempotente, true);
  const histRecup2 = resRecup2.resultado.historial;

  // El Intento 2 recuperado DEBE reflejar exactamente el estado ANTERIOR a su fecha/fila:
  // - Debe contar exactamente 1 intento previo (Intento 1).
  // - NO debe incluirse a sí mismo (Intento 2).
  // - NO debe incluir el intento posterior (Intento 3).
  assert.strictEqual(histRecup2.n, 1, "Debe reportar exactamente 1 evaluación anterior");
  assert.strictEqual(histRecup2.promedioGlobal, promPrevioOrig, "El promedio anterior no debe alterarse por evaluaciones posteriores");
  assert.strictEqual(histRecup2.deltaGlobal, deltaPrevioOrig, "El deltaGlobal no debe alterarse por evaluaciones posteriores");
});

it("A.3: Reintento repetido de la misma evaluación mantiene respuesta exacta sin derivación ni alteraciones", () => {
  const ctx = crearContextoPruebas();
  const token = "tok-cierre-repetido-01";
  const mat = "2026-0001";

  ctx.cacheStore["examen_token_" + token] = JSON.stringify({
    matricula: mat, idLectura: "LEC-01", modo: "sorteo", intentoEsperado: 1
  });

  const payload = {
    matricula: mat, tokenExamen: token, idLectura: "LEC-01", modo: "sorteo",
    tiempoLectura: 60, tiempoReactivos: 30, relecturas: 0, respuestas: ["A", "X"], tiemposPregunta: [15, 15]
  };

  const res1 = ctx.guardarResultadosExamen(payload);
  delete ctx.cacheStore["examen_token_" + token];
  delete ctx.cacheStore["examen_consumido_" + token];

  // Tres reintentos consecutivos
  const reintento1 = ctx.guardarResultadosExamen({ ...payload, reintento: true });
  const reintento2 = ctx.guardarResultadosExamen({ ...payload, reintento: true });
  const reintento3 = ctx.guardarResultadosExamen({ ...payload, reintento: true });

  assert.strictEqual(reintento1.resultado.global, res1.resultado.global);
  assert.strictEqual(reintento2.resultado.global, res1.resultado.global);
  assert.strictEqual(reintento3.resultado.global, res1.resultado.global);

  assert.deepStrictEqual(reintento1.resultado.historial, reintento2.resultado.historial);
  assert.deepStrictEqual(reintento2.resultado.historial, reintento3.resultado.historial);
});

it("A.4: Verificación de que la recuperación no duplica filas ni altera la calificación guardada", () => {
  const ctx = crearContextoPruebas();
  const token = "tok-cierre-no-dup-01";
  const mat = "2026-0001";

  ctx.cacheStore["examen_token_" + token] = JSON.stringify({
    matricula: mat, idLectura: "LEC-01", modo: "sorteo", intentoEsperado: 1
  });

  const payload = {
    matricula: mat, tokenExamen: token, idLectura: "LEC-01", modo: "sorteo",
    tiempoLectura: 60, tiempoReactivos: 30, relecturas: 0, respuestas: ["A", "X"], tiemposPregunta: [15, 15]
  };

  ctx.guardarResultadosExamen(payload);
  const filasAntes = ctx.hojas.Resultados.getLastRow();
  assert.strictEqual(filasAntes, 2, "Debe haber exactamente 1 fila de datos (más encabezados)");

  delete ctx.cacheStore["examen_token_" + token];
  delete ctx.cacheStore["examen_consumido_" + token];

  // Ejecutar 5 reintentos
  for (let i = 0; i < 5; i++) {
    ctx.guardarResultadosExamen({ ...payload, reintento: true });
  }

  const filasDespues = ctx.hojas.Resultados.getLastRow();
  assert.strictEqual(filasDespues, 2, "NO se debió haber insertado ninguna fila adicional");
});

it("A.5: Compatibilidad exhaustiva de todos los campos con pintarResultadoFinal en Interfaz.html", () => {
  const ctx = crearContextoPruebas();
  const token = "tok-cierre-campos-01";
  const mat = "2026-0001";

  ctx.cacheStore["examen_token_" + token] = JSON.stringify({
    matricula: mat, idLectura: "LEC-01", modo: "sorteo", intentoEsperado: 1
  });

  const payload = {
    matricula: mat, tokenExamen: token, idLectura: "LEC-01", modo: "sorteo",
    tiempoLectura: 60, tiempoReactivos: 30, relecturas: 1, respuestas: ["A", "X"], tiemposPregunta: [15, 15]
  };

  ctx.guardarResultadosExamen(payload);
  delete ctx.cacheStore["examen_token_" + token];
  delete ctx.cacheStore["examen_consumido_" + token];

  const res = ctx.guardarResultadosExamen({ ...payload, reintento: true });
  const r = res.resultado;

  // Lista de campos consumidos por pintarResultadoFinal en Interfaz.html
  const camposEsperados = [
    "ppm", "comprension", "global", "aciertos", "total", "nivelPpm",
    "pme", "tiempoLectura", "tiempoReactivos", "relecturas", "desglose",
    "tiemposPregunta", "historial", "spec", "velocidadNorm", "palabras"
  ];

  for (const c of camposEsperados) {
    assert.strictEqual(r[c] !== undefined, true, `Campo requerido '${c}' no debe ser undefined`);
  }

  assert.strictEqual(typeof r.ppm, "number");
  assert.strictEqual(typeof r.comprension, "number");
  assert.strictEqual(typeof r.global, "number");
  assert.strictEqual(typeof r.aciertos, "number");
  assert.strictEqual(typeof r.total, "number");
  assert.strictEqual(typeof r.nivelPpm, "string");
  assert.strictEqual(typeof r.relecturas, "number");
  assert.strictEqual(typeof r.historial, "object");
  assert.strictEqual(typeof r.historial.n, "number");
  assert.strictEqual(typeof r.spec, "object");
  assert.strictEqual(typeof r.spec.ppmObjetivo, "number");
});

// ============================================================================
console.log("\n--- SUITE 2: CORRECCIÓN B — REVOCACIÓN DE SESIONES Y COMPROBACIÓN DE IDENTIDAD ---");
// ============================================================================

it("B.1: Revocación legítima de la sesión propia (alumno, docente y clase)", () => {
  const ctx = crearContextoPruebas();

  // Caso Alumno
  const tokAlu = "tok-propio-alu-123";
  ctx.cacheStore["sesion_" + tokAlu] = JSON.stringify({ rol: "alumno", matricula: "2026-0001", nombre: "Alumno Uno" });
  ctx.cacheStore["sesion_mat_" + tokAlu] = "2026-0001";
  ctx.cacheStore["alumno_" + tokAlu] = "1";
  ctx.cacheStore["sesion_alumno_2026-0001"] = tokAlu;

  const resAlu = ctx.revocarTokenSesion(tokAlu);
  assert.strictEqual(resAlu.ok, true);
  assert.strictEqual(resAlu.revocado, true);
  assert.strictEqual(ctx.cacheStore["sesion_" + tokAlu], undefined);
  assert.strictEqual(ctx.cacheStore["sesion_mat_" + tokAlu], undefined);
  assert.strictEqual(ctx.cacheStore["alumno_" + tokAlu], undefined);
  assert.strictEqual(ctx.cacheStore["sesion_alumno_2026-0001"], undefined);

  // Caso Clase legítimo
  const tokClase = "tok-propio-clase-456";
  ctx.cacheStore["clase_" + tokClase] = JSON.stringify({ rol: "maestro", usuario: "profesor1", nombre: "Docente Demo" });
  ctx.cacheStore["sesion_" + tokClase] = JSON.stringify({ rol: "docente", usuario: "profesor1", nombre: "Docente Demo" });

  const resClase = ctx.cerrarSesionClase(tokClase);
  assert.strictEqual(resClase.ok, true);
  assert.strictEqual(resClase.revocado, true);
  assert.strictEqual(ctx.cacheStore["clase_" + tokClase], undefined);
  assert.strictEqual(ctx.cacheStore["sesion_" + tokClase], undefined);
});

it("B.2: Intento de revocar una sesión ajena mediante token de clase es bloqueado", () => {
  const ctx = crearContextoPruebas();

  // Escenario 1: Un token de clase de rol alumno intenta revocar una sesión general de rol admin
  const tokAtaque1 = "tok-ataque-alumno-admin";
  ctx.cacheStore["clase_" + tokAtaque1] = JSON.stringify({ rol: "alumno", matricula: "2026-0001", usuario: "alumno1" });
  ctx.cacheStore["sesion_" + tokAtaque1] = JSON.stringify({ rol: "admin", usuario: "prefecta1", nombre: "Administrador" });
  ctx.cacheStore["admin_" + tokAtaque1] = "1";

  const resAtaque1 = ctx.cerrarSesionClase(tokAtaque1);
  assert.strictEqual(resAtaque1.revocado, false, "No debe revocar sesión ajena de distinto rol");
  assert.ok(ctx.cacheStore["sesion_" + tokAtaque1], "sesion_ de admin DEBE permanecer intacta");
  assert.strictEqual(ctx.cacheStore["admin_" + tokAtaque1], "1", "admin_ DEBE permanecer intacto");

  // Escenario 2: Un token de clase de alumno A intenta revocar una sesión general del alumno B
  const tokAtaque2 = "tok-ataque-entre-alumnos";
  ctx.cacheStore["clase_" + tokAtaque2] = JSON.stringify({ rol: "alumno", matricula: "2026-0001", usuario: "alumno1" });
  ctx.cacheStore["sesion_" + tokAtaque2] = JSON.stringify({ rol: "alumno", matricula: "2026-0002", usuario: "alumno2" });

  const resAtaque2 = ctx.cerrarSesionClase(tokAtaque2);
  assert.strictEqual(resAtaque2.revocado, false, "No debe revocar sesión ajena de otra matrícula");
  assert.ok(ctx.cacheStore["sesion_" + tokAtaque2], "sesion_ del alumno B DEBE permanecer intacta");
});

it("B.3: Token de clase inexistente, vencido o corrupto", () => {
  const ctx = crearContextoPruebas();

  // Token inexistente o vacío
  const resVacio = ctx.cerrarSesionClase("");
  assert.strictEqual(resVacio.revocado, false);
  const resInexistente = ctx.cerrarSesionClase("tok-que-no-existe-en-cache");
  assert.strictEqual(resInexistente.revocado, false);

  // Token corrupto (JSON inválido en clase_)
  const tokCorrupto = "tok-clase-corrupto-777";
  ctx.cacheStore["clase_" + tokCorrupto] = "{ json malformado: corrupto";
  ctx.cacheStore["sesion_" + tokCorrupto] = JSON.stringify({ rol: "admin", usuario: "admin_real" });

  const resCorrupto = ctx.cerrarSesionClase(tokCorrupto);
  assert.strictEqual(resCorrupto.ok, false);
  assert.strictEqual(resCorrupto.revocado, false);
  assert.strictEqual(ctx.cacheStore["clase_" + tokCorrupto], undefined, "La clave corrupta debe ser purgada");
  assert.ok(ctx.cacheStore["sesion_" + tokCorrupto], "La sesión general NO debe ser revocada ante clave de clase corrupta");
});

it("B.4: Dos sesiones simultáneas de la misma matrícula", () => {
  const ctx = crearContextoPruebas();
  const mat = "2026-0001";
  const tokDispositivo1 = "tok-alu-disp-1";
  const tokDispositivo2 = "tok-alu-disp-2";

  // Dispositivo 1 inicia sesión
  ctx.cacheStore["sesion_" + tokDispositivo1] = JSON.stringify({ rol: "alumno", matricula: mat });
  ctx.cacheStore["alumno_" + tokDispositivo1] = "1";

  // Dispositivo 2 inicia sesión después (puntero activo apunta a dispositivo 2)
  ctx.cacheStore["sesion_" + tokDispositivo2] = JSON.stringify({ rol: "alumno", matricula: mat });
  ctx.cacheStore["alumno_" + tokDispositivo2] = "1";
  ctx.cacheStore["sesion_alumno_" + mat] = tokDispositivo2;

  // Dispositivo 1 cierra sesión
  ctx.revocarTokenSesion(tokDispositivo1);

  // Dispositivo 1 fue revocado
  assert.strictEqual(ctx.cacheStore["sesion_" + tokDispositivo1], undefined);
  assert.strictEqual(ctx.cacheStore["alumno_" + tokDispositivo1], undefined);

  // Dispositivo 2 sigue 100% activo y su puntero en sesion_alumno_ no fue destruido
  assert.ok(ctx.cacheStore["sesion_" + tokDispositivo2], "Sesión de Dispositivo 2 debe seguir activa");
  assert.strictEqual(ctx.cacheStore["sesion_alumno_" + mat], tokDispositivo2, "Puntero de sesión activa debe seguir en Dispositivo 2");
});

it("B.5: Revocación con una evaluación en curso en otro dispositivo", () => {
  const ctx = crearContextoPruebas();
  const mat = "2026-0001";
  const tokDispositivo1 = "tok-disp-1";
  const tokDispositivo2 = "tok-disp-2";

  ctx.cacheStore["sesion_" + tokDispositivo1] = JSON.stringify({ rol: "alumno", matricula: mat });
  ctx.cacheStore["sesion_" + tokDispositivo2] = JSON.stringify({ rol: "alumno", matricula: mat });

  // Evaluación en curso vinculada a la sesión del Dispositivo 2
  ctx.cacheStore["examen_vigente_" + mat] = JSON.stringify({
    token: "tok-examen-en-curso",
    tokenSesion: tokDispositivo2,
    matricula: mat
  });

  // Dispositivo 1 cierra su sesión
  ctx.revocarTokenSesion(tokDispositivo1);

  // El examen en curso de Dispositivo 2 NO debe ser interrumpido ni borrado
  assert.ok(ctx.cacheStore["examen_vigente_" + mat], "El examen en curso en Dispositivo 2 no debe ser cancelado por el logout de Dispositivo 1");

  // Ahora Dispositivo 2 cierra su propia sesión
  ctx.revocarTokenSesion(tokDispositivo2);

  // Ahora sí se limpia examen_vigente porque coincide con su tokenSesion
  assert.strictEqual(ctx.cacheStore["examen_vigente_" + mat], undefined);
});

it("B.6: Reintento de revocación sin provocar efectos sobre otras sesiones", () => {
  const ctx = crearContextoPruebas();
  const tokRevocado = "tok-ya-revocado-111";
  const tokSesionAjena = "tok-sesion-activa-999";

  ctx.cacheStore["sesion_" + tokSesionAjena] = JSON.stringify({ rol: "admin", usuario: "prefecto" });

  // Primer intento de revocar token ya vacío
  const res1 = ctx.revocarTokenSesion(tokRevocado);
  assert.strictEqual(res1.ok, true);

  // Reintento repetido
  const res2 = ctx.revocarTokenSesion(tokRevocado);
  assert.strictEqual(res2.ok, true);

  // La sesión activa ajena nunca se vio afectada
  assert.ok(ctx.cacheStore["sesion_" + tokSesionAjena]);
  assert.strictEqual(JSON.parse(ctx.cacheStore["sesion_" + tokSesionAjena]).usuario, "prefecto");
});

// ============================================================================
console.log("\n--- SUITE 3: PLANEACIÓN DIDÁCTICA NEM, SESIONES DUA DE 40 MIN Y AULA HABLADA ---");
// ============================================================================

it("C.1: Catálogo curricular oficial NEM provee Fase 6, Campos Formativos y Metodologías", () => {
  const ctx = crearContextoPruebas();
  const cat = ctx.catalogoCurricularNEM_();
  assert.ok(cat.fase.includes("Fase 6"));
  assert.strictEqual(cat.camposFormativos.length, 4);
  assert.strictEqual(cat.metodologias.length, 4);
  assert.strictEqual(cat.duracionSesionEstandarMin, 40);
  assert.strictEqual(cat.momentosSesionEstandar.length, 4);
});

it("C.2: Crear borrador de planeación NEM inicializa N sesiones de 40 minutos en blanco", () => {
  const ctx = crearContextoPruebas();
  const tokDoc = "tok-docente-plan-1";
  ctx.cacheStore["sesion_" + tokDoc] = JSON.stringify({ rol: "maestro", usuario: "profesor1", nombre: "Docente Demo" });

  const payload = {
    titulo: "Voces y Raíces de Nuestra Tierra",
    grado: "1",
    grupo: "A",
    asignatura: "Español",
    campoFormativo: "Lenguajes",
    metodologia: "ABPC",
    contenidoSintetico: "La diversidad de lenguas y su uso en la comunicación familiar",
    pda: "Reconoce la riqueza lingüística de México y el mundo",
    ejesArticuladores: ["Inclusión", "Interculturalidad Crítica"],
    proposito: "Elaborar un glosario sonoro comunitario accesible",
    problemaComunidad: "Pérdida de vocabulario originario en las familias",
    productoFinal: "Glosario sonoro en Aula Hablada",
    numSesiones: 3
  };

  const res = ctx.crearOActualizarPlaneacionNEM(tokDoc, payload);
  assert.strictEqual(res.ok, true);
  assert.ok(res.id.startsWith("PLN-"));
  assert.strictEqual(res.estado, "BORRADOR");

  // Verificar que se crearon exactamente 3 sesiones de 40 minutos en SesionesNEM
  const detalle = ctx.obtenerPlaneacionCompletaNEM(tokDoc, res.id);
  assert.strictEqual(detalle.ok, true);
  assert.strictEqual(detalle.sesiones.length, 3);
  assert.strictEqual(detalle.sesiones[0].duracionMin, 40);
  assert.strictEqual(detalle.sesiones[1].duracionMin, 40);
  assert.strictEqual(detalle.sesiones[2].duracionMin, 40);
});

it("C.3: Guardar sesión con enfoque DUA (4 momentos, notas docentes y guion de estudiante para leer/escuchar)", () => {
  const ctx = crearContextoPruebas();
  const tokDoc = "tok-docente-plan-2";
  ctx.cacheStore["sesion_" + tokDoc] = JSON.stringify({ rol: "maestro", usuario: "profesor1", nombre: "Docente Demo" });

  const plan = ctx.crearOActualizarPlaneacionNEM(tokDoc, {
    titulo: "Proyecto Inclusivo",
    grado: "1",
    grupo: "A",
    asignatura: "Español",
    numSesiones: 2
  });

  const detalle = ctx.obtenerPlaneacionCompletaNEM(tokDoc, plan.id);
  const sesion1 = detalle.sesiones[0];

  const resSes = ctx.guardarSesionNEM(tokDoc, {
    id: sesion1.id,
    idPlaneacion: plan.id,
    titulo: "Sesión 1: Las palabras que nos nombran",
    aperturaTexto: "Reto sonoro inicial con palabras de origen indígena.",
    aperturaMin: 5,
    desarrolloTexto: "Explicación de las 68 lenguas originarias y préstamos léxicos.",
    desarrolloMin: 10,
    recursosVisuales: [{ titulo: "Tianguis tradicional", url: "https://ejemplo.com/tianguis.jpg", descripcionAccesible: "Plaza abierta con puestos de petate y semillas de cacao..." }],
    actividadTexto: "Identificación en parejas de 3 palabras de uso familiar.",
    actividadMin: 20,
    cierreTexto: "Cotejo formativo y tarea de indagación en casa.",
    cierreMin: 5,
    guionDocente: { orientacion: "Fomentar el orgullo lingüístico", rubrica: "Cualitativa y dialógica" },
    guionEstudianteAccesible: "¡Hola a todas y todos! Cierren un momento sus ojos o miren la pantalla y escuchen con atención: papalote, metate, xoloitzcuintle, tianguis..."
  });

  assert.strictEqual(resSes.ok, true);

  const detalleActualizado = ctx.obtenerPlaneacionCompletaNEM(tokDoc, plan.id);
  const sActualizada = detalleActualizado.sesiones[0];
  assert.ok(sActualizada.guionEstudianteAccesible.includes("papalote, metate"));
  assert.strictEqual(sActualizada.recursosVisuales.length, 1);
  assert.ok(sActualizada.recursosVisuales[0].descripcionAccesible.length > 0);
  assert.strictEqual(sActualizada.guionDocente.orientacion, "Fomentar el orgullo lingüístico");
});

it("C.4: Aprobar planeación y calendarizar sesión sincroniza automáticamente con ContenidosClase", () => {
  const ctx = crearContextoPruebas();
  const tokDoc = "tok-docente-plan-3";
  ctx.cacheStore["sesion_" + tokDoc] = JSON.stringify({ rol: "maestro", usuario: "profesor1", nombre: "Docente Demo" });

  // Sembrar bloque en Horarios
  ctx.hojas.Horarios.appendRow([
    "HOR-101", "lunes", "MATUTINO", "1", "07:00", "07:40", "1", "A", "Docente Demo", "Español", "Aula 1"
  ]);

  const plan = ctx.crearOActualizarPlaneacionNEM(tokDoc, {
    titulo: "Proyecto Lenguajes",
    grado: "1",
    grupo: "A",
    asignatura: "Español",
    contenidoSintetico: "Diversidad lingüística",
    pda: "Reconoce la riqueza lingüística de México",
    numSesiones: 1
  });

  const detalle = ctx.obtenerPlaneacionCompletaNEM(tokDoc, plan.id);
  const ses1 = detalle.sesiones[0];

  ctx.guardarSesionNEM(tokDoc, {
    id: ses1.id,
    idPlaneacion: plan.id,
    titulo: "Sesión 1: Las palabras que nos nombran",
    aperturaTexto: "Reto",
    desarrolloTexto: "Explicación",
    actividadTexto: "Actividad",
    cierreTexto: "Cierre",
    guionEstudianteAccesible: "Texto de la clase para todo el grupo: leer, ver y escuchar."
  });

  // Aprobar formalmente
  const resAprob = ctx.aprobarPlaneacionNEM(tokDoc, plan.id);
  assert.strictEqual(resAprob.ok, true);

  // Calendarizar para el lunes 26 de octubre de 2026 en bloque HOR-101
  const resCal = ctx.calendarizarSesionNEM(tokDoc, ses1.id, "HOR-101", "2026-10-26");
  assert.strictEqual(resCal.ok, true);

  // COMPROBACIÓN CRÍTICA: Se sincronizó automáticamente con ContenidosClase
  const contenidos = ctx.hojas.ContenidosClase.getRange(1, 1, ctx.hojas.ContenidosClase.getLastRow(), ctx.hojas.ContenidosClase.getLastColumn()).getValues();
  const filaSincronizada = contenidos.filter(function (f) {
    return String(f[1]) === "HOR-101" && String(f[8]) === "2026-10-26";
  })[0];

  assert.ok(filaSincronizada, "Debe existir la fila sincronizada en ContenidosClase para la fecha y bloque");
  assert.strictEqual(filaSincronizada[9], "Sesión 1: Las palabras que nos nombran");
  assert.strictEqual(filaSincronizada[10], "Texto de la clase para todo el grupo: leer, ver y escuchar.");
  assert.strictEqual(filaSincronizada[12], "SI", "Debe marcarse como Publicado SI");
});

it("C.5: Renderizado multimodal DUA para estudiantes: momentos, descripción auditiva obligatoria y accesibilidad de lectura/escucha", () => {
  // Simular entorno de DOM mínimo para renderizarTextoClaseDUA
  let innerHTMLGenerado = "";
  const domSimulado = {
    document: {
      getElementById: function (id) {
        if (id === "textoClaseVis") {
          return {
            set innerHTML(val) { innerHTMLGenerado = val; },
            get innerHTML() { return innerHTMLGenerado; }
          };
        }
        return null;
      }
    },
    escaparHtml: function (s) { return String(s || ""); }
  };

  // Extraer la función renderizarTextoClaseDUA del script de Clase.html
  const matchFn = CLASE_HTML.match(/function renderizarTextoClaseDUA\([\s\S]*?\n    \}/);
  assert.ok(matchFn, "Debe existir la función renderizarTextoClaseDUA en Clase.html");

  const vmContext = vm.createContext(domSimulado);
  vm.runInContext(matchFn[0], vmContext);

  const contenidoDUA = {
    titulo: "Sesión 1: Voces y Raíces",
    texto: "## Sesión 1: Voces y Raíces\n\n" +
      "### 1. Apertura (5 min)\n" +
      "Escucha con atención la siguiente pregunta detonadora: ¿qué palabras de tus abuelos recuerdas?\n\n" +
      "### 2. Desarrollo y Explicación (10 min)\n" +
      "En México conviven 68 lenguas originarias y casi 364 variantes lingüísticas.\n\n" +
      "### Recurso Visual Accesible (DUA)\n" +
      "![Mapa de lenguas originarias de México](https://ejemplo.edu/mapa_lenguas.png)\n" +
      "[Descripción auditiva: Mapa de la República Mexicana con regiones coloreadas: verde en Oaxaca para mixteco y zapoteco, azul en el centro para náhuatl y amarillo en el sureste para maya.]\n\n" +
      "### 3. Actividad de Aprendizaje (20 min)\n" +
      "Identifica 3 palabras cotidianas derivadas del náhuatl como aguacate o chocolate.\n\n" +
      "### 4. Cierre y Metacognición (5 min)\n" +
      "¿Por qué preservar las lenguas de nuestros pueblos nos da identidad?"
  };

  vmContext.renderizarTextoClaseDUA(contenidoDUA);

  // Verificaciones del renderizado accesible
  assert.ok(innerHTMLGenerado.includes("1. Apertura (5 min)"), "Debe renderizar la tarjeta de Apertura");
  assert.ok(innerHTMLGenerado.includes("2. Desarrollo y Explicación (10 min)"), "Debe renderizar la tarjeta de Desarrollo");
  assert.ok(innerHTMLGenerado.includes("3. Actividad de Aprendizaje (20 min)"), "Debe renderizar la tarjeta de Actividad");
  assert.ok(innerHTMLGenerado.includes("4. Cierre y Metacognición (5 min)"), "Debe renderizar la tarjeta de Cierre");

  // Verificación DUA: La imagen y la descripción auditiva coexisten en armonía
  assert.ok(innerHTMLGenerado.includes("https://ejemplo.edu/mapa_lenguas.png"), "Los alumnos que ven visualizan la imagen");
  assert.ok(innerHTMLGenerado.includes("🔊 Descripción auditiva"), "Los alumnos invidentes y auditivos cuentan con badge explícito");
  assert.ok(innerHTMLGenerado.includes("Mapa de la República Mexicana con regiones coloreadas"), "La descripción oral de la imagen se encuentra en el texto accesible");

  // Verificación de párrafos con índice de tracking para lectura y voz sincronizada
  assert.ok(innerHTMLGenerado.includes('data-pidx="0"'), "Los párrafos cuentan con índice para sincronización de voz y foco");
});

it("C.6: Catálogo curricular depurado: Geografía solo contiene 1.° grado (sin 2.° ni 3.°) e Inglés provee selección múltiple de PDA para 1.°", () => {
  // Extraer el catálogo CATALOGO_SEP_FASE6_ definido en el script de Clase.html
  const matchCat = CLASE_HTML.match(/const CATALOGO_SEP_FASE6_\s*=\s*(\[[\s\S]*?\]);/);
  assert.ok(matchCat, "Debe existir CATALOGO_SEP_FASE6_ en Clase.html");

  const catalogo = new Function("return " + matchCat[1])();
  const geo = catalogo.find(c => c.disciplina === "Geografía");
  assert.ok(geo, "Geografía debe existir en el catálogo");
  assert.ok(geo.contenidos.length > 0, "Geografía debe tener contenidos");

  // Verificar que NINGÚN contenido de Geografía tenga clave '2' ni '3'
  geo.contenidos.forEach(c => {
    assert.strictEqual(c.pda["2"], undefined, "Geografía en SEP Fase 6 no debe tener progresiones de 2° grado");
    assert.strictEqual(c.pda["3"], undefined, "Geografía en SEP Fase 6 no debe tener progresiones de 3° grado");
    assert.ok(c.pda["1"], "Geografía debe tener PDA de 1° grado");
  });

  // Verificar que Inglés tenga múltiples PDA para 1° de secundaria
  const ingles = catalogo.find(c => c.disciplina === "Inglés");
  assert.ok(ingles, "Inglés debe existir en el catálogo");
  const pdaIng1 = ingles.contenidos[0].pda["1"];
  assert.ok(Array.isArray(pdaIng1) && pdaIng1.length >= 2, "Inglés 1° debe proveer múltiples PDA oficiales");
});

it("C.7: Guardar planeación con selección múltiple de PDA preserva la fila y compatibilidad total", () => {
  const ctx = crearContextoPruebas();
  const tokDoc = "tok-docente-mult-pda";
  ctx.cacheStore["sesion_" + tokDoc] = JSON.stringify({ rol: "maestro", usuario: "profesor1", nombre: "Docente Demo" });

  const pdasSeleccionados = [
    "• [1° Grado] Hace uso del alfabeto, los números y las expresiones básicas en inglés...",
    "• [1° Grado] Recupera estrategias auditivas y de lectura..."
  ];

  const plan = ctx.crearOActualizarPlaneacionNEM(tokDoc, {
    titulo: "Proyecto de Comunicación en Inglés",
    grado: "1",
    grupo: "A",
    asignatura: "Inglés",
    campoFormativo: "Lenguajes",
    metodologia: "ABPC",
    contenidoSintetico: "La diversidad lingüística y sus formas de expresión en México y el mundo.",
    pda: pdasSeleccionados,
    numSesiones: 3
  });

  assert.ok(plan.ok, "Debe guardar la planeación");

  // Verificar lectura
  const res = ctx.obtenerPlaneacionCompletaNEM(tokDoc, plan.id);
  assert.ok(res.ok);
  assert.ok(res.planeacion.pda.includes("Hace uso del alfabeto"), "Debe contener el primer PDA");
  assert.ok(res.planeacion.pda.includes("Recupera estrategias auditivas"), "Debe contener el segundo PDA");
});

it("C.8: Asistente pedagógico IA valida roles de seguridad y provee respuesta estructurada", () => {
  const ctx = crearContextoPruebas();
  const tokDoc = "tok-docente-ia";
  ctx.cacheStore["sesion_" + tokDoc] = JSON.stringify({ rol: "maestro", usuario: "profesor1", nombre: "Docente Demo" });

  // Simular sin clave DeepSeek
  const sinClave = ctx.asistirDisenoProyectoNEM(tokDoc, {
    grado: "1",
    asignatura: "Geografía",
    contenidoSintetico: "El espacio geográfico como construcción social.",
    pda: "Comprende que el espacio geográfico..."
  });
  assert.strictEqual(sinClave.ok, false);
  assert.strictEqual(sinClave.sinClave, true);

  // Simular con clave configurada
  ctx.scriptProperties = ctx.scriptProperties || {};
  ctx.PropertiesService.getScriptProperties().setProperty("DEEPSEEK_KEY", "sk-test-key-12345");

  const conClave = ctx.asistirDisenoProyectoNEM(tokDoc, {
    grado: "1",
    asignatura: "Geografía",
    contenidoSintetico: "El espacio geográfico como construcción social.",
    pda: "Comprende que el espacio geográfico..."
  });
  assert.ok(conClave.ok, "Debe procesar la consulta con IA");
  assert.ok(conClave.propuesta, "Debe retornar una propuesta estructurada");
});

// ============================================================================
console.log("\n================================================================================");
console.log(`RESUMEN PRUEBAS: ${pruebasPasadas} EXITOSAS, ${pruebasFalladas} FALLIDAS (TOTAL: ${pruebasPasadas + pruebasFalladas})`);
console.log("================================================================================");

if (pruebasFalladas > 0) {
  process.exit(1);
}
