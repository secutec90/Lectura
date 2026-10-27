/**
 * ST90 — SEXTA CORRECCIÓN ACOTADA: SUITE DE PRUEBAS LOCALES DE SEGURIDAD
 * 
 * Alcance evaluado:
 * 1. CORRECCIÓN A (SEC-06-01): Respuesta completa en la recuperación desde la hoja.
 *    - Reconstrucción íntegra de todos los campos consumidos por Interfaz.html (total, nivelPpm, pme, relecturas, spec, etc.).
 *    - Ningún campo requerido como undefined.
 *    - Falla controlada si faltan datos históricos indispensables.
 * 2. CORRECCIÓN B (SEC-06-02): Validación de identidad al recuperar por token en buscarResultadoPrevioEnHoja_.
 *    - Coincidencia inequívoca de Token, Matrícula y Lectura.
 *    - Rechazo de matrícula o lectura manipulada/discrepante sin exponer PII ni caer silenciosamente a tupla histórica.
 *    - Rechazo de tokens duplicados en varias filas (anomalía técnica).
 * 3. CORRECCIÓN C (SEC-06-03): Comparación estricta de registros históricos.
 *    - Exigencia estricta de 5 campos (matrícula, lectura, intento, modo, trimestre).
 *    - Prohibición de interpretar modos o trimestres vacíos como comodines.
 *    - Rechazo de registros ambiguos o incompletos.
 *    - Idempotencia en Paso 9 de guardarResultadosExamen con reglas estrictas y sin filas duplicadas.
 * 
 * Declaración de entorno:
 * - Código real de Codigo.gs, Asistencia.gs y ClaseLogica.gs ejecutado en Node.js mediante VM.
 * - Dependencias de Google Apps Script (SpreadsheetApp, CacheService, LockService, PropertiesService, Utilities, ScriptApp) emuladas localmente.
 * - La integración real con Google Apps Script y servicios en la nube NO se considera probada por esta suite.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

console.log("================================================================================");
console.log("ST90 — SEXTA CORRECCIÓN ACOTADA: SUITE DE PRUEBAS DE SEGURIDAD");
console.log("================================================================================");
console.log("[ENTORNO] Ejecución en Node.js local con VM");
console.log("[EMULACIÓN] Dependencias Google Apps Script emuladas en memoria");
console.log("[AVISO] La integración real con Google Apps Script NO está probada aquí");
console.log("--------------------------------------------------------------------------------");

const CODIGO_GS = require("./_cargar_codigo.js")();
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

/**
 * Entorno de emulación para pruebas unitarias y de integración local
 */
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
        setFontWeight: () => {}
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
      ["TRIMESTRAL_T1_INTENTOS", "2"],
      ["INTENTOS_POR_DEFECTO", "3"],
      ["PESO_COMPRENSION", "0.7"],
      ["PESO_VELOCIDAD", "0.3"]
    ]),
    Alumnos: new HojaMock("Alumnos", [
      ["Matrícula", "Nombre Completo", "Grado", "Grupo", "Activo", "Turno"],
      ["2026-0001", "ALUMNO EJEMPLO UNO", "1", "A", "SI", "MATUTINO"],
      ["2026-0002", "ALUMNO EJEMPLO DOS", "2", "B", "SI", "MATUTINO"]
    ]),
    Lecturas: new HojaMock("Lecturas", [
      ["ID Lectura", "Título", "Grado", "Asignatura", "Tema", "Texto", "Activa", "Modo", "Trimestre", "Palabras", "Preguntas JSON"],
      ["LEC-01", "Lectura Uno", "1", "Español", "Ficción", "Había una vez un texto de prueba suficientemente largo con más de cincuenta palabras para que el conteo y cálculo de palabras por minuto sea completamente válido y matemáticamente consistente para este examen de primer grado de secundaria.", "SI", "sorteo", "", 45, "[]"],
      ["LEC-02", "Lectura Dos", "2", "Historia", "México", "Este es otro texto histórico con suficiente extensión para que los cálculos de velocidad y preguntas se ejecuten adecuadamente en la prueba de segundo grado escolar con todas las garantías de seguridad.", "SI", "trimestral", "1", 38, "[]"]
    ]),
    Preguntas: new HojaMock("Preguntas", [
      ["ID Lectura", "Orden", "Enunciado", "Opción 1", "Opción 2", "Opción 3", "Opción 4", "Opción 5", "Opción 6", "Respuesta correcta", "Nivel"],
      ["LEC-01", 1, "¿De qué trata?", "De prueba", "De nada", "De otro tema", "", "", "", "De prueba", "literal"],
      ["LEC-01", 2, "¿Qué infiere?", "Cálculo", "Ficción", "Ninguna", "", "", "", "Cálculo", "inferencial"],
      ["LEC-02", 1, "¿De qué habla?", "Historia", "Geografía", "Ciencia", "", "", "", "Historia", "literal"]
    ]),
    Grupos: new HojaMock("Grupos", [
      ["Grado", "Grupo", "Turno", "Ciclo"],
      ["1", "A", "MATUTINO", "2026-2027"],
      ["2", "B", "MATUTINO", "2026-2027"]
    ]),
    Resultados: new HojaMock("Resultados", [encabezadosDefecto, ...(opts.filasResultados || [])]),
    PersonalApoyo: new HojaMock("PersonalApoyo", [
      ["Id", "Nombre", "Rol", "Activo", "Usuario", "ClaveHash", "ClaveSalt"],
      ["AP-01", "Prefecta Demo", "prefecto", "SI", "prefecta1", "hash", "salt"]
    ]),
    Clases: new HojaMock("Clases", [
      ["Id", "Nombre", "Docente", "Grado", "Grupo", "Turno", "Activa", "CodigoAcceso"],
      ["CLS-01", "Español 1A", "Docente Demo", "1", "A", "MATUTINO", "SI", "ACC123"]
    ])
  };

  const libroMock = {
    getSheetByName: (nombre) => hojas[nombre] || null,
    getSheets: () => Object.values(hojas),
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
        setProperties: (obj) => {
          for (let k in obj) scriptProperties[k] = String(obj[k]);
        },
        deleteProperty: (k) => { delete scriptProperties[k]; }
      })
    },
    CacheService: {
      getScriptCache: () => ({
        get: (k) => cacheStore[k] || null,
        put: (k, v, ttl) => { cacheStore[k] = String(v); },
        remove: (k) => { delete cacheStore[k]; }
      })
    },
    LockService: {
      getScriptLock: () => ({
        waitLock: () => true,
        releaseLock: () => {}
      })
    },
    Utilities: {
      getUuid: () => "uuid-" + Math.random().toString(36).substring(2, 10),
      computeDigest: (algo, str) => {
        const crypto = require("crypto");
        const hash = crypto.createHash("sha256").update(str).digest("hex");
        return hash;
      },
      DigestAlgorithm: { SHA_256: "SHA_256" },
      formatDate: (d, tz, fmt) => "2026-10-18"
    },
    ScriptApp: {
      getService: () => ({
        getUrl: () => "https://script.google.com/macros/s/AKfycbz_test/exec"
      })
    },
    pedirRecomendacionAlumnoDeepSeek: () => "",
    cacheStore: cacheStore,
    hojas: hojas,
    libroMock: libroMock
  };

  const context = vm.createContext(sandbox);
  vm.runInContext(CODIGO_GS, context);
  vm.runInContext(ASISTENCIA_GS, context);
  vm.runInContext(CLASE_LOGICA_GS, context);

  return context;
}

let pruebasTotales = 0;
let pruebasPasadas = 0;
let pruebasFallidas = 0;

function test(nombre, fn) {
  pruebasTotales++;
  try {
    fn();
    pruebasPasadas++;
    console.log(`  [PASS] ${nombre}`);
  } catch (e) {
    pruebasFallidas++;
    console.error(`  [FAIL] ${nombre}`);
    console.error(`         ${e.message}`);
  }
}

// ============================================================================
// SUITE 1: CORRECCIÓN A — RESPUESTA COMPLETA EN LA RECUPERACIÓN (SEC-06-01)
// ============================================================================
console.log("\n--- SUITE 1: CORRECCIÓN A — RESPUESTA COMPLETA EN LA RECUPERACIÓN (SEC-06-01) ---");

test("A.1: Guardado exitoso seguido de pérdida de caché y reintento devuelve estructura completa compatible", () => {
  const ctx = crearContextoPruebas();
  const token = "tok-examen-completo-01";
  
  // Guardamos un intento en caché
  ctx.cacheStore["examen_token_" + token] = JSON.stringify({
    matricula: "2026-0001",
    idLectura: "LEC-01",
    modo: "sorteo",
    intentoEsperado: 1
  });
  ctx.cacheStore["examen_vigente_2026-0001"] = token;

  const payload = {
    matricula: "2026-0001",
    tokenExamen: token,
    idLectura: "LEC-01",
    modo: "sorteo",
    tiempoLectura: 60,
    tiempoReactivos: 30,
    relecturas: 2,
    respuestas: ["De prueba", "Cálculo"],
    tiemposPregunta: [15, 15]
  };

  // Guardado normal inicial
  const res1 = ctx.guardarResultadosExamen(payload);
  assert.strictEqual(res1.ok, true, "Guardado normal debe ser exitoso");
  assert.ok(res1.resultado, "Debe contener resultado");
  assert.strictEqual(res1.resultado.total, 2, "Total debe ser 2");
  assert.strictEqual(res1.resultado.aciertos, 2, "Aciertos debe ser 2");

  const numFilas1 = ctx.hojas.Resultados.getLastRow();
  assert.strictEqual(numFilas1, 2, "Debe haber exactamente 1 fila guardada (más encabezado)");

  // Simulamos pérdida total de caché
  delete ctx.cacheStore["examen_token_" + token];
  delete ctx.cacheStore["examen_consumido_" + token];
  delete ctx.cacheStore["examen_vigente_2026-0001"];

  // Reintento con pérdida de caché
  const payloadReintento = {
    ...payload,
    reintento: true
  };

  const res2 = ctx.guardarResultadosExamen(payloadReintento);
  assert.strictEqual(res2.ok, true, "Reintento debe ser exitoso");
  assert.strictEqual(res2.reintentoIdempotente, true, "Debe marcarse como reintentoIdempotente");

  const numFilas2 = ctx.hojas.Resultados.getLastRow();
  assert.strictEqual(numFilas2, 2, "NO se debe haber insertado una segunda fila");

  // Verificación de integridad exhaustiva de la respuesta reconstruida (Consumida por Interfaz.html)
  const r = res2.resultado;
  assert.ok(r, "El resultado reconstruido debe existir");
  assert.strictEqual(typeof r.ppm, "number", "r.ppm debe ser un número");
  assert.strictEqual(typeof r.comprension, "number", "r.comprension debe ser un número");
  assert.strictEqual(typeof r.global, "number", "r.global debe ser un número");
  assert.strictEqual(typeof r.aciertos, "number", "r.aciertos debe ser un número");
  assert.strictEqual(typeof r.total, "number", "r.total debe ser un número");
  assert.strictEqual(r.total, 2, "r.total debe reconstruirse como 2 de la lectura canónica");
  assert.strictEqual(typeof r.nivelPpm, "string", "r.nivelPpm debe ser un string");
  assert.ok(r.nivelPpm.length > 0, "r.nivelPpm no debe ser vacío");
  assert.strictEqual(typeof r.pme, "number", "r.pme debe ser un número");
  assert.strictEqual(r.relecturas, 2, "r.relecturas debe coincidir con el valor persistido");
  assert.strictEqual(typeof r.tiempoLectura, "number", "r.tiempoLectura debe ser número");
  assert.strictEqual(typeof r.tiempoReactivos, "number", "r.tiempoReactivos debe ser número");
  assert.ok(r.spec, "r.spec debe estar presente");
  assert.strictEqual(typeof r.spec.ppmMin, "number", "r.spec.ppmMin debe ser número");
  assert.strictEqual(typeof r.spec.ppmMax, "number", "r.spec.ppmMax debe ser número");
  assert.strictEqual(typeof r.spec.ppmObjetivo, "number", "r.spec.ppmObjetivo debe ser número");
  assert.ok(r.tiemposPregunta, "r.tiemposPregunta debe estar presente");
  assert.ok(r.historial, "r.historial debe estar presente");
  assert.strictEqual(r.desglose !== undefined, true, "r.desglose no debe ser undefined");
});

test("A.2: Ningún campo consumido por pintarResultadoFinal aparece accidentalmente como undefined", () => {
  const ctx = crearContextoPruebas();
  const token = "tok-examen-campos-02";

  // Insertamos directamente en Resultados una fila previa persistida
  const filaPersistida = [
    new Date(), "Secundaria Técnica 90", "2026-0001", "ALUMNO EJEMPLO UNO", "1", "A", "",
    "Español", "Ficción", "LEC-01", 60, 30, 90,
    JSON.stringify([15, 15]), 2, 100, 110, "dentro",
    100, 1, 110, 3, JSON.stringify({ literal: { total: 1, aciertos: 1, pct: 100 }, inferencial: { total: 1, aciertos: 1, pct: 100 } }),
    "Excelente lectura", "sorteo", "", token
  ];
  ctx.hojas.Resultados.appendRow(filaPersistida);

  const persistido = ctx.buscarResultadoPrevioEnHoja_("2026-0001", token, { idLectura: "LEC-01", modo: "sorteo" });
  assert.ok(persistido, "Debe encontrar y reconstruir el resultado");

  // Lista de campos requeridos por pintarResultadoFinal en Interfaz.html:
  const camposRequeridos = [
    "ppm", "comprension", "global", "aciertos", "total", "nivelPpm",
    "pme", "tiempoLectura", "tiempoReactivos", "relecturas", "desglose",
    "tiemposPregunta", "historial", "spec", "velocidadNorm", "palabras"
  ];

  for (const c of camposRequeridos) {
    assert.strictEqual(persistido[c] !== undefined, true, `Campo '${c}' no debe ser undefined`);
    assert.notStrictEqual(persistido[c], null, `Campo '${c}' no debe ser null (excepto recomendación opcional)`);
  }
  assert.strictEqual(persistido.total, 2, "Total debe ser 2");
  assert.strictEqual(persistido.relecturas, 3, "Relecturas debe ser 3");
  assert.strictEqual(persistido.nivelPpm, "dentro", "NivelPpm debe ser 'dentro'");
});

test("A.3: Faltan datos históricos indispensables: la recuperación falla de manera controlada", () => {
  const ctx = crearContextoPruebas();
  const token = "tok-examen-incompleto-03";

  // Insertamos una fila incompleta a la que le falta aciertos (vacío)
  const filaIncompleta = [
    new Date(), "Secundaria Técnica 90", "2026-0001", "ALUMNO EJEMPLO UNO", "1", "A", "",
    "Español", "Ficción", "LEC-01", 60, 30, 90,
    "", "", 100, 110, "dentro", // Aciertos está vacío en índice 14!
    100, 1, 110, 0, "", "", "sorteo", "", token
  ];
  ctx.hojas.Resultados.appendRow(filaIncompleta);

  let errorCapturado = null;
  try {
    ctx.buscarResultadoPrevioEnHoja_("2026-0001", token, { idLectura: "LEC-01", modo: "sorteo" });
  } catch (e) {
    errorCapturado = e;
  }

  assert.ok(errorCapturado, "Debe lanzar un error controlado al faltar datos indispensables");
  assert.ok(
    errorCapturado.message.indexOf("No fue posible recuperar íntegramente el resultado previo") >= 0,
    "El mensaje de error debe ser controlado y descriptivo: " + (errorCapturado && errorCapturado.message)
  );
});

// ============================================================================
// SUITE 2: CORRECCIÓN B — VALIDACIÓN DE IDENTIDAD POR TOKEN (SEC-06-02)
// ============================================================================
console.log("\n--- SUITE 2: CORRECCIÓN B — VALIDACIÓN DE IDENTIDAD POR TOKEN (SEC-06-02) ---");

test("B.1: Token, matrícula y lectura correctos: recuperación exitosa", () => {
  const ctx = crearContextoPruebas();
  const token = "tok-legitimo-b1";
  const fila = [
    new Date(), "Secundaria Técnica 90", "2026-0001", "ALUMNO EJEMPLO UNO", "1", "A", "",
    "Español", "Ficción", "LEC-01", 50, 25, 75,
    JSON.stringify([10, 15]), 2, 100, 120, "dentro",
    100, 1, 120, 0, "", "", "sorteo", "", token
  ];
  ctx.hojas.Resultados.appendRow(fila);

  const res = ctx.buscarResultadoPrevioEnHoja_("2026-0001", token, { idLectura: "LEC-01", modo: "sorteo" });
  assert.ok(res, "Debe devolver el resultado correctamente");
  assert.strictEqual(res.ppm, 120);
  assert.strictEqual(res.aciertos, 2);
});

test("B.2: Token correcto con matrícula distinta: rechazo inmediato sin exponer datos", () => {
  const ctx = crearContextoPruebas();
  const token = "tok-alumno-uno-b2";
  const fila = [
    new Date(), "Secundaria Técnica 90", "2026-0001", "ALUMNO EJEMPLO UNO", "1", "A", "",
    "Español", "Ficción", "LEC-01", 50, 25, 75,
    JSON.stringify([10, 15]), 2, 100, 120, "dentro",
    100, 1, 120, 0, "", "", "sorteo", "", token
  ];
  ctx.hojas.Resultados.appendRow(fila);

  // Alumno 2026-0002 intenta consultar con el token del Alumno 2026-0001
  const res = ctx.buscarResultadoPrevioEnHoja_("2026-0002", token, { idLectura: "LEC-01", modo: "sorteo" });
  assert.strictEqual(res, null, "Debe rechazar la recuperación y devolver null ante matrícula distinta");
});

test("B.3: Token correcto con lectura distinta: rechazo inmediato", () => {
  const ctx = crearContextoPruebas();
  const token = "tok-lectura-uno-b3";
  const fila = [
    new Date(), "Secundaria Técnica 90", "2026-0001", "ALUMNO EJEMPLO UNO", "1", "A", "",
    "Español", "Ficción", "LEC-01", 50, 25, 75,
    JSON.stringify([10, 15]), 2, 100, 120, "dentro",
    100, 1, 120, 0, "", "", "sorteo", "", token
  ];
  ctx.hojas.Resultados.appendRow(fila);

  // Solicitud enviando lectura LEC-02 cuando el token era para LEC-01
  const res = ctx.buscarResultadoPrevioEnHoja_("2026-0001", token, { idLectura: "LEC-02", modo: "sorteo" });
  assert.strictEqual(res, null, "Debe rechazar la recuperación y devolver null ante lectura distinta");
});

test("B.4: Token duplicado en varias filas: tratado como anomalía técnica sin elegir arbitrariamente", () => {
  const ctx = crearContextoPruebas();
  const tokenDuplicado = "tok-duplicado-anomalo-b4";
  
  const fila1 = [
    new Date(), "Secundaria Técnica 90", "2026-0001", "ALUMNO UNO", "1", "A", "",
    "Español", "Ficción", "LEC-01", 50, 25, 75,
    "[]", 2, 100, 120, "dentro", 100, 1, 120, 0, "", "", "sorteo", "", tokenDuplicado
  ];
  const fila2 = [
    new Date(), "Secundaria Técnica 90", "2026-0001", "ALUMNO UNO", "1", "A", "",
    "Español", "Ficción", "LEC-01", 55, 30, 85,
    "[]", 1, 50, 110, "dentro", 70, 1, 55, 0, "", "", "sorteo", "", tokenDuplicado
  ];
  ctx.hojas.Resultados.appendRow(fila1);
  ctx.hojas.Resultados.appendRow(fila2);

  const res = ctx.buscarResultadoPrevioEnHoja_("2026-0001", tokenDuplicado, { idLectura: "LEC-01", modo: "sorteo" });
  assert.strictEqual(res, null, "Debe rechazar la recuperación y devolver null ante duplicados del mismo token");
});

test("B.5: Token inexistente: devuelve null", () => {
  const ctx = crearContextoPruebas();
  const res = ctx.buscarResultadoPrevioEnHoja_("2026-0001", "tok-fantasma-no-existe", { idLectura: "LEC-01", modo: "sorteo" });
  assert.strictEqual(res, null, "Token inexistente debe devolver null");
});

test("B.6: Reintento legítimo después de pérdida de caché recupera íntegro", () => {
  const ctx = crearContextoPruebas();
  const token = "tok-reintento-legitimo-b6";
  const fila = [
    new Date(), "Secundaria Técnica 90", "2026-0001", "ALUMNO UNO", "1", "A", "",
    "Español", "Ficción", "LEC-01", 60, 20, 80,
    JSON.stringify([10, 10]), 2, 100, 115, "dentro",
    100, 1, 115, 1, "", "", "sorteo", "", token
  ];
  ctx.hojas.Resultados.appendRow(fila);

  const res = ctx.guardarResultadosExamen({
    matricula: "2026-0001",
    tokenExamen: token,
    idLectura: "LEC-01",
    modo: "sorteo",
    reintento: true
  });

  assert.strictEqual(res.ok, true);
  assert.strictEqual(res.reintentoIdempotente, true);
  assert.strictEqual(res.resultado.ppm, 115);
  assert.strictEqual(res.resultado.relecturas, 1);
});

test("B.7: Intento de recuperar resultado ajeno manipulando parámetros en guardarResultadosExamen", () => {
  const ctx = crearContextoPruebas();
  const tokenVictima = "tok-victima-b7";
  const filaVictima = [
    new Date(), "Secundaria Técnica 90", "2026-0001", "ALUMNO UNO", "1", "A", "",
    "Español", "Ficción", "LEC-01", 60, 20, 80,
    "[]", 2, 100, 115, "dentro", 100, 1, 115, 0, "", "", "sorteo", "", tokenVictima
  ];
  ctx.hojas.Resultados.appendRow(filaVictima);

  // Atacante intenta recuperar haciéndose pasar por 2026-0002 con el token de la víctima
  let errorCapturado = null;
  try {
    ctx.guardarResultadosExamen({
      matricula: "2026-0002",
      tokenExamen: tokenVictima,
      idLectura: "LEC-01",
      modo: "sorteo",
      reintento: true
    });
  } catch (e) {
    errorCapturado = e;
  }

  assert.ok(errorCapturado, "Debe rechazar la llamada y lanzar excepción");
  assert.ok(
    errorCapturado.message.indexOf("inválido") >= 0 || errorCapturado.message.indexOf("expirado") >= 0,
    "Debe denegar acceso por token inválido/expirado"
  );
});

// ============================================================================
// SUITE 3: CORRECCIÓN C — COMPARACIÓN ESTRICTA DE REGISTROS HISTÓRICOS (SEC-06-03)
// ============================================================================
console.log("\n--- SUITE 3: CORRECCIÓN C — COMPARACIÓN ESTRICTA DE REGISTROS HISTÓRICOS (SEC-06-03) ---");

test("C.1: Fila histórica sin modo (header Modo no existe o índice negativo): rechazo", () => {
  // Hoja Resultados sin la columna 'Modo'
  const encabezadosSinModo = [
    "Marca Temporal", "Escuela", "Matrícula", "Nombre Estudiante", "Grado", "Grupo", "Género",
    "Asignatura", "Tema", "ID Lectura", "Tiempo Lectura (s)", "Tiempo Reactivos (s)", "Tiempo Total (s)",
    "Segundos por pregunta", "Aciertos", "Calificación comprensión (%)", "PPM", "Nivel PPM",
    "Calificación global (%)", "Intento", "PME", "Relecturas", "Desglose niveles", "Recomendación",
    "Trimestre", "Token Examen"
  ];
  const filaSinColModo = [
    new Date(), "Secundaria Técnica 90", "2026-0001", "ALUMNO UNO", "1", "A", "",
    "Español", "Ficción", "LEC-01", 60, 20, 80,
    "[]", 2, 100, 115, "dentro", 100, 1, 115, 0, "", "", "", ""
  ];
  const ctx = crearContextoPruebas();
  ctx.hojas.Resultados = new ctx.hojas.Config.constructor("Resultados", [encabezadosSinModo, filaSinColModo]);

  const res = ctx.buscarResultadoPrevioEnHoja_("2026-0001", "", {
    idLectura: "LEC-01",
    modo: "sorteo",
    intento: 1
  });
  assert.strictEqual(res, null, "Sin columna Modo no debe haber coincidencia histórica");
});

test("C.2: Fila histórica con modo vacío: rechazo (nunca interpretar vacío como sorteo)", () => {
  const ctx = crearContextoPruebas();
  const filaModoVacio = [
    new Date(), "Secundaria Técnica 90", "2026-0001", "ALUMNO UNO", "1", "A", "",
    "Español", "Ficción", "LEC-01", 60, 20, 80,
    "[]", 2, 100, 115, "dentro", 100, 1, 115, 0, "", "", "", "", "" // Modo vacío en índice 24!
  ];
  ctx.hojas.Resultados.appendRow(filaModoVacio);

  const res = ctx.buscarResultadoPrevioEnHoja_("2026-0001", "", {
    idLectura: "LEC-01",
    modo: "sorteo",
    intento: 1
  });
  assert.strictEqual(res, null, "Modo vacío en la fila nunca debe coincidir con 'sorteo'");
});

test("C.3: Fila histórica con modo diferente ('trimestral' vs solicitado 'sorteo'): rechazo", () => {
  const ctx = crearContextoPruebas();
  const filaModoTrim = [
    new Date(), "Secundaria Técnica 90", "2026-0001", "ALUMNO UNO", "1", "A", "",
    "Español", "Ficción", "LEC-01", 60, 20, 80,
    "[]", 2, 100, 115, "dentro", 100, 1, 115, 0, "", "", "trimestral", "1", ""
  ];
  ctx.hojas.Resultados.appendRow(filaModoTrim);

  const res = ctx.buscarResultadoPrevioEnHoja_("2026-0001", "", {
    idLectura: "LEC-01",
    modo: "sorteo",
    intento: 1
  });
  assert.strictEqual(res, null, "Modo 'trimestral' no debe coincidir con 'sorteo'");
});

test("C.4: Fila histórica sin trimestre (header Trimestre ausente en solicitud trimestral): rechazo", () => {
  const encabezadosSinTrim = [
    "Marca Temporal", "Escuela", "Matrícula", "Nombre Estudiante", "Grado", "Grupo", "Género",
    "Asignatura", "Tema", "ID Lectura", "Tiempo Lectura (s)", "Tiempo Reactivos (s)", "Tiempo Total (s)",
    "Segundos por pregunta", "Aciertos", "Calificación comprensión (%)", "PPM", "Nivel PPM",
    "Calificación global (%)", "Intento", "PME", "Relecturas", "Desglose niveles", "Recomendación",
    "Modo", "Token Examen"
  ];
  const filaSinColTrim = [
    new Date(), "Secundaria Técnica 90", "2026-0002", "ALUMNO DOS", "2", "B", "",
    "Historia", "México", "LEC-02", 60, 20, 80,
    "[]", 1, 100, 115, "dentro", 100, 1, 115, 0, "", "", "trimestral", ""
  ];
  const ctx = crearContextoPruebas();
  ctx.hojas.Resultados = new ctx.hojas.Config.constructor("Resultados", [encabezadosSinTrim, filaSinColTrim]);

  const res = ctx.buscarResultadoPrevioEnHoja_("2026-0002", "", {
    idLectura: "LEC-02",
    modo: "trimestral",
    trimestre: "1",
    intento: 1
  });
  assert.strictEqual(res, null, "En modalidad trimestral sin columna Trimestre no debe haber coincidencia");
});

test("C.5: Fila histórica con trimestre vacío en solicitud trimestral: rechazo", () => {
  const ctx = crearContextoPruebas();
  const filaTrimVacio = [
    new Date(), "Secundaria Técnica 90", "2026-0002", "ALUMNO DOS", "2", "B", "",
    "Historia", "México", "LEC-02", 60, 20, 80,
    "[]", 1, 100, 115, "dentro", 100, 1, 115, 0, "", "", "trimestral", "", "" // Trimestre vacío!
  ];
  ctx.hojas.Resultados.appendRow(filaTrimVacio);

  const res = ctx.buscarResultadoPrevioEnHoja_("2026-0002", "", {
    idLectura: "LEC-02",
    modo: "trimestral",
    trimestre: "1",
    intento: 1
  });
  assert.strictEqual(res, null, "Trimestre vacío en la fila nunca debe coincidir con trimestre '1'");
});

test("C.6: Fila histórica con trimestre diferente ('2' vs solicitado '1'): rechazo", () => {
  const ctx = crearContextoPruebas();
  const filaTrim2 = [
    new Date(), "Secundaria Técnica 90", "2026-0002", "ALUMNO DOS", "2", "B", "",
    "Historia", "México", "LEC-02", 60, 20, 80,
    "[]", 1, 100, 115, "dentro", 100, 1, 115, 0, "", "", "trimestral", "2", ""
  ];
  ctx.hojas.Resultados.appendRow(filaTrim2);

  const res = ctx.buscarResultadoPrevioEnHoja_("2026-0002", "", {
    idLectura: "LEC-02",
    modo: "trimestral",
    trimestre: "1",
    intento: 1
  });
  assert.strictEqual(res, null, "Trimestre '2' no debe coincidir con trimestre '1'");
});

test("C.7: Dos filas históricas que coincidan parcialmente: rechazo", () => {
  const ctx = crearContextoPruebas();
  // Fila coincide en matrícula y lectura pero intento es 2
  const filaIntento2 = [
    new Date(), "Secundaria Técnica 90", "2026-0001", "ALUMNO UNO", "1", "A", "",
    "Español", "Ficción", "LEC-01", 60, 20, 80,
    "[]", 2, 100, 115, "dentro", 100, 2, 115, 0, "", "", "sorteo", "", ""
  ];
  ctx.hojas.Resultados.appendRow(filaIntento2);

  const res = ctx.buscarResultadoPrevioEnHoja_("2026-0001", "", {
    idLectura: "LEC-01",
    modo: "sorteo",
    intento: 1
  });
  assert.strictEqual(res, null, "Coincidencia parcial en intento no debe recuperarse");
});

test("C.8: Dos filas históricas que coincidan en todos los campos: rechazo por ambigüedad", () => {
  const ctx = crearContextoPruebas();
  const fila1 = [
    new Date(), "Secundaria Técnica 90", "2026-0001", "ALUMNO UNO", "1", "A", "",
    "Español", "Ficción", "LEC-01", 60, 20, 80,
    "[]", 2, 100, 115, "dentro", 100, 1, 115, 0, "", "", "sorteo", "", ""
  ];
  const fila2 = [
    new Date(), "Secundaria Técnica 90", "2026-0001", "ALUMNO UNO", "1", "A", "",
    "Español", "Ficción", "LEC-01", 65, 25, 90,
    "[]", 1, 50, 100, "dentro", 70, 1, 50, 0, "", "", "sorteo", "", ""
  ];
  ctx.hojas.Resultados.appendRow(fila1);
  ctx.hojas.Resultados.appendRow(fila2);

  const res = ctx.buscarResultadoPrevioEnHoja_("2026-0001", "", {
    idLectura: "LEC-01",
    modo: "sorteo",
    intento: 1
  });
  assert.strictEqual(res, null, "Dos coincidencias completas deben rechazarse por ambigüedad");
});

test("C.9: Registro histórico legítimo y completamente identificado: recuperación íntegra", () => {
  const ctx = crearContextoPruebas();
  const filaLegitima = [
    new Date(), "Secundaria Técnica 90", "2026-0001", "ALUMNO UNO", "1", "A", "",
    "Español", "Ficción", "LEC-01", 60, 20, 80,
    JSON.stringify([10, 10]), 2, 100, 115, "dentro",
    100, 1, 115, 0, "", "Buen trabajo", "sorteo", "", ""
  ];
  ctx.hojas.Resultados.appendRow(filaLegitima);

  const res = ctx.buscarResultadoPrevioEnHoja_("2026-0001", "", {
    idLectura: "LEC-01",
    modo: "sorteo",
    intento: 1
  });

  assert.ok(res, "Debe recuperar el registro histórico legítimo");
  assert.strictEqual(res.ppm, 115);
  assert.strictEqual(res.aciertos, 2);
  assert.strictEqual(res.total, 2);
  assert.strictEqual(res.nivelPpm, "dentro");
  assert.strictEqual(res.recomendacion, "Buen trabajo");
});

test("C.10: Paso 9 de guardarResultadosExamen: verificación estricta de token e identidad sin duplicar fila", () => {
  const ctx = crearContextoPruebas();
  const token = "tok-paso9-test-10";

  // Inicializar intento válido en cache
  ctx.cacheStore["examen_token_" + token] = JSON.stringify({
    matricula: "2026-0001",
    idLectura: "LEC-01",
    modo: "sorteo",
    intentoEsperado: 1
  });
  ctx.cacheStore["examen_vigente_2026-0001"] = token;

  const payload = {
    matricula: "2026-0001",
    tokenExamen: token,
    idLectura: "LEC-01",
    modo: "sorteo",
    tiempoLectura: 60,
    tiempoReactivos: 30,
    relecturas: 0,
    respuestas: ["De prueba", "Cálculo"],
    tiemposPregunta: [15, 15]
  };

  // Primera ejecución normal
  const res1 = ctx.guardarResultadosExamen(payload);
  assert.strictEqual(res1.ok, true);
  assert.strictEqual(ctx.hojas.Resultados.getLastRow(), 2, "Debe existir 1 fila guardada");

  // Re-ejecución inmediata (simulando condición donde el cache expiró pero la hoja ya tiene la fila y token)
  ctx.cacheStore["examen_token_" + token] = JSON.stringify({
    matricula: "2026-0001",
    idLectura: "LEC-01",
    modo: "sorteo",
    intentoEsperado: 1
  });
  delete ctx.cacheStore["examen_consumido_" + token];

  const res2 = ctx.guardarResultadosExamen(payload);
  assert.strictEqual(res2.ok, true);
  assert.strictEqual(res2.reintentoIdempotente, true, "Paso 9 debe detectar que ya está en la hoja");
  assert.strictEqual(ctx.hojas.Resultados.getLastRow(), 2, "Paso 9 NO debe insertar una segunda fila");
});

test("C.11: Paso 9 de guardarResultadosExamen: anomalía si token duplicado en hoja lanza conflicto", () => {
  const ctx = crearContextoPruebas();
  const token = "tok-duplicado-paso9-11";

  // Fila 1 y Fila 2 con el mismo token en Resultados
  const f1 = [
    new Date(), "Secundaria Técnica 90", "2026-0001", "ALUMNO UNO", "1", "A", "",
    "Español", "Ficción", "LEC-01", 60, 20, 80,
    "[]", 2, 100, 115, "dentro", 100, 1, 115, 0, "", "", "sorteo", "", token
  ];
  const f2 = [
    new Date(), "Secundaria Técnica 90", "2026-0001", "ALUMNO UNO", "1", "A", "",
    "Español", "Ficción", "LEC-01", 60, 20, 80,
    "[]", 2, 100, 115, "dentro", 100, 1, 115, 0, "", "", "sorteo", "", token
  ];
  ctx.hojas.Resultados.appendRow(f1);
  ctx.hojas.Resultados.appendRow(f2);

  ctx.cacheStore["examen_token_" + token] = JSON.stringify({
    matricula: "2026-0001",
    idLectura: "LEC-01",
    modo: "sorteo",
    intentoEsperado: 1
  });

  let errorCapturado = null;
  try {
    ctx.guardarResultadosExamen({
      matricula: "2026-0001",
      tokenExamen: token,
      idLectura: "LEC-01",
      modo: "sorteo",
      tiempoLectura: 60,
      tiempoReactivos: 20,
      respuestas: ["De prueba", "Cálculo"]
    });
  } catch (e) {
    errorCapturado = e;
  }

  assert.ok(errorCapturado, "Debe rechazar por conflicto de integridad");
  assert.ok(errorCapturado.message.indexOf("Conflicto de integridad") >= 0, "Mensaje debe indicar duplicados");
});

console.log("\n================================================================================");
console.log(`RESUMEN SEXTA CORRECCIÓN: ${pruebasPasadas} EXITOSAS, ${pruebasFallidas} FALLIDAS (TOTAL: ${pruebasTotales})`);
console.log("================================================================================");

if (pruebasFallidas > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
