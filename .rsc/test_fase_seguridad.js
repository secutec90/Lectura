const fs = require("fs");
const path = require("path");
const vm = require("vm");

console.log("================================================================================");
console.log("ST90 — SUITE DE PRUEBAS DE SEGURIDAD LOCAL (C-01, C-02, A-01, A-02, A-03, M-02)");
console.log("================================================================================\n");

// 1. Verificación de sintaxis estricta de los tres archivos modificados
const files = ["Codigo.gs", "Asistencia.gs", "ClaseLogica.gs"];
files.forEach(f => {
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

// Emulador de entorno Google Apps Script
function crearContexto(opts = {}) {
  const ID_PROD = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  const ID_TEST = "1TEST_BOOK_AUTHORIZED_999999999999999";

  const entorno = opts.entorno || "PRUEBAS";
  const hojaId = opts.hojaId || (entorno === "PRODUCCION" ? ID_PROD : ID_TEST);
  const realId = opts.realId !== undefined ? opts.realId : hojaId;

  const scriptProperties = {
    ENTORNO: entorno,
    HOJA_ID: hojaId,
    CLAVE_ADMIN_HASH: "mock_hash_admin",
    CLAVE_ADMIN_SALT: "mock_salt_admin",
    CLAVE_ADMIN_ES_DEFAULT: "0",
    ...(opts.customProperties || {})
  };

  const cacheStore = { ...(opts.initialCache || {}) };
  const sheets = { ...(opts.initialSheets || {}) };

  function makeSheet(name, initialData = []) {
    let data = JSON.parse(JSON.stringify(initialData));
    let clearCount = 0;
    let nameVal = name;
    return {
      get name() { return nameVal; },
      setName: function(n) { nameVal = n; },
      getName: function() { return nameVal; },
      get _data() { return data; },
      get _clearCount() { return clearCount; },
      getLastRow: () => data.length,
      getLastColumn: () => (data[0] ? data[0].length : 0),
      getMaxColumns: () => 50,
      getMaxRows: () => 1000,
      insertColumnsAfter: function() {},
      clearContents: function() {
        clearCount++;
        data = [];
      },
      appendRow: function(row) {
        data.push([...row]);
      },
      getRange: function(row, col, numRows, numCols) {
        return {
          setFontWeight: function() { return this; },
          setValue: function(val) {
            while (data.length < row) data.push([]);
            const fila = data[row - 1];
            while (fila.length < col) fila.push("");
            fila[col - 1] = val;
            return this;
          },
          setValues: function(vals) {
            for (let r = 0; r < vals.length; r++) {
              const filaIdx = row - 1 + r;
              while (data.length <= filaIdx) data.push([]);
              const fila = data[filaIdx];
              for (let c = 0; c < vals[r].length; c++) {
                const colIdx = col - 1 + c;
                while (fila.length <= colIdx) fila.push("");
                fila[colIdx] = vals[r][c];
              }
            }
            return this;
          },
          getValues: function() {
            const res = [];
            for (let r = 0; r < (numRows || 1); r++) {
              const filaIdx = row - 1 + r;
              const fila = data[filaIdx] || [];
              const filaRes = [];
              for (let c = 0; c < (numCols || 1); c++) {
                const colIdx = col - 1 + c;
                filaRes.push(fila[colIdx] !== undefined ? fila[colIdx] : "");
              }
              res.push(filaRes);
            }
            return res;
          }
        };
      }
    };
  }

  // Pre-crear hojas pasadas
  Object.keys(sheets).forEach(k => {
    sheets[k] = makeSheet(k, sheets[k]);
  });

  const mockLibro = {
    getId: () => realId,
    getName: () => "Libro_" + entorno,
    getSheetByName: (nom) => sheets[nom] || null,
    getSheets: () => Object.values(sheets),
    insertSheet: (nom) => {
      const sh = makeSheet(nom, []);
      sheets[nom] = sh;
      return sh;
    }
  };

  const logs = [];
  const sandbox = {
    console: console,
    Logger: {
      log: function(...args) {
        logs.push(args.join(" "));
      }
    },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (k) => (scriptProperties[k] !== undefined ? scriptProperties[k] : null),
        getProperties: () => ({ ...scriptProperties }),
        setProperty: (k, v) => { scriptProperties[k] = String(v); },
        setProperties: (obj) => { Object.assign(scriptProperties, obj); },
        deleteProperty: (k) => { delete scriptProperties[k]; }
      })
    },
    CacheService: {
      getScriptCache: () => ({
        get: (k) => (cacheStore[k] !== undefined ? cacheStore[k] : null),
        put: (k, v, ttl) => { cacheStore[k] = String(v); },
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
      openById: (id) => mockLibro,
      flush: () => {}
    },
    Session: {
      getScriptTimeZone: () => "America/Mexico_City"
    },
    ScriptApp: {
      getService: () => ({
        getUrl: () => "https://script.google.com/macros/s/ST90_DEPLOYMENT/exec"
      })
    },
    UrlFetchApp: {
      fetch: () => ({
        getResponseCode: () => 500,
        getContentText: () => "{}"
      })
    },
    Utilities: {
      getUuid: () => "uuid_" + Math.random().toString(36).substring(2, 10),
      formatDate: (d, tz, fmt) => "2026-10-16 20:00:00",
      DigestAlgorithm: { SHA_256: "SHA_256" },
      Charset: { UTF_8: "UTF_8" },
      computeDigest: (algo, str) => {
        const hash = require("crypto").createHash("sha256").update(str, "utf8").digest();
        return Array.from(hash);
      }
    },
    // Retener referencias internas para inspección
    __sheets: sheets,
    __cache: cacheStore,
    __props: scriptProperties,
    __logs: logs,
    __makeSheet: makeSheet
  };

  const context = vm.createContext(sandbox);

  // Cargar el código real de los 3 archivos
  files.forEach(f => {
    const p = path.join(__dirname, "..", f);
    const code = String(p).includes("Codigo.gs") ? require("./_cargar_codigo.js")() : fs.readFileSync(p, "utf8");
    vm.runInContext(code, context, { filename: f });
  });

  return context;
}

let passed = 0;
let failed = 0;

function assert(cond, name, details = "") {
  if (cond) {
    console.log(`  [PASS] ${name}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${name} ${details ? "-> " + details : ""}`);
    failed++;
  }
}

// ==============================================================================
// PRUEBA 1: C-01 y C-02 — Operaciones masivas y destructivas
// ==============================================================================
console.log("--- TEST 1: C-01 / C-02 — Autorización administrativa estricta ---");

// 1.1 sincronizarNivelesHojaDesdeJson
{
  const ctx = crearContexto({ entorno: "PRUEBAS" });
  let errSinToken = null;
  try { ctx.sincronizarNivelesHojaDesdeJson(); } catch (e) { errSinToken = e; }
  assert(errSinToken && errSinToken.message.includes("Sesión no válida"),
    "sincronizarNivelesHojaDesdeJson rechaza llamadas sin token");

  let errTokenInvalido = null;
  try { ctx.sincronizarNivelesHojaDesdeJson("tok_falso"); } catch (e) { errTokenInvalido = e; }
  assert(errTokenInvalido && errTokenInvalido.message.includes("Sesión no válida"),
    "sincronizarNivelesHojaDesdeJson rechaza token inexistente");

  ctx.__cache["sesion_tok_doc"] = JSON.stringify({ rol: "docente", nombre: "Profe" });
  let errRolDoc = null;
  try { ctx.sincronizarNivelesHojaDesdeJson("tok_doc"); } catch (e) { errRolDoc = e; }
  assert(errRolDoc && errRolDoc.message.includes("administrador"),
    "sincronizarNivelesHojaDesdeJson rechaza rol no-admin (docente)");
}

// 1.2 clasificarNivelesTodasLasPreguntas
{
  const ctx = crearContexto({ entorno: "PRUEBAS" });
  let errSinToken = null;
  try { ctx.clasificarNivelesTodasLasPreguntas(); } catch (e) { errSinToken = e; }
  assert(errSinToken && errSinToken.message.includes("Sesión no válida"),
    "clasificarNivelesTodasLasPreguntas rechaza llamadas sin token");

  ctx.__cache["sesion_tok_pref"] = JSON.stringify({ rol: "prefecto", nombre: "Pref" });
  let errRolPref = null;
  try { ctx.clasificarNivelesTodasLasPreguntas("tok_pref"); } catch (e) { errRolPref = e; }
  assert(errRolPref && errRolPref.message.includes("administrador"),
    "clasificarNivelesTodasLasPreguntas rechaza rol no-admin (prefecto)");
}

// 1.3 ajustarLecturasAEspecificaciones
{
  const ctx = crearContexto({ entorno: "PRUEBAS" });
  let errSinToken = null;
  try { ctx.ajustarLecturasAEspecificaciones(); } catch (e) { errSinToken = e; }
  assert(errSinToken && errSinToken.message.includes("Sesión no válida"),
    "ajustarLecturasAEspecificaciones rechaza llamadas sin token");

  ctx.__cache["sesion_tok_apoyo"] = JSON.stringify({ rol: "apoyo", nombre: "Apoyo" });
  let errRolApoyo = null;
  try { ctx.ajustarLecturasAEspecificaciones("tok_apoyo"); } catch (e) { errRolApoyo = e; }
  assert(errRolApoyo && errRolApoyo.message.includes("administrador"),
    "ajustarLecturasAEspecificaciones rechaza rol no-admin (apoyo)");
}

// 1.4 Función interna privada reconstruirHojaPreguntasDesdeJson_
{
  const ctx = crearContexto({ entorno: "PRUEBAS" });
  assert(typeof ctx.reconstruirHojaPreguntasDesdeJson === "undefined",
    "reconstruirHojaPreguntasDesdeJson pública ya NO existe (no expuesta a google.script.run)");
  assert(typeof ctx.reconstruirHojaPreguntasDesdeJson_ === "function",
    "reconstruirHojaPreguntasDesdeJson_ existe como función privada interna");
}

// 1.5 Protección en Producción: NUNCA clearContents() en reconstruirHojaPreguntasDesdeJson_
{
  const ID_PROD = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  const ctx = crearContexto({
    entorno: "PRODUCCION",
    hojaId: ID_PROD,
    realId: ID_PROD,
    initialSheets: {
      Lecturas: [
        ["ID Lectura", "Grado", "Asignatura", "Tema", "Texto", "Palabras", "Preguntas JSON", "Activa", "Origen"],
        ["LEC_01", "1", "Español", "Tema 1", "Texto...", "50", "[]", "SI", "BANCO"] // JSON vacío / sin preguntas
      ],
      Preguntas: [
        ["ID Lectura", "Num Pregunta", "Pregunta", "Opcion A", "Opcion B", "Opcion C", "Opcion D", "Respuesta", "Nivel"],
        ["LEC_EXISTENTE", 1, "¿Pregunta importante?", "A", "B", "C", "D", "A", "literal"]
      ]
    }
  });

  const pSheet = ctx.__sheets["Preguntas"];
  ctx.reconstruirHojaPreguntasDesdeJson_();

  assert(pSheet._clearCount === 0,
    "En PRODUCCIÓN, reconstruirHojaPreguntasDesdeJson_ NUNCA llama a clearContents()");
  assert(pSheet._data.length >= 2,
    "En PRODUCCIÓN, las preguntas existentes se conservan íntegras ante matriz vacía o JSON corrupto");
}

// ==============================================================================
// PRUEBA 2: A-01 — Siembras de demostración aisladas
// ==============================================================================
console.log("\n--- TEST 2: A-01 — Aislamiento estricto de siembras demo ---");

// 2.1 sembrarAsistenciaDemo: Bloqueo en PRODUCCION con o sin token admin
{
  const ID_PROD = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  const ctx = crearContexto({
    entorno: "PRODUCCION",
    hojaId: ID_PROD,
    realId: ID_PROD,
    initialCache: {
      sesion_tok_admin: JSON.stringify({ rol: "admin", nombre: "Admin" }),
      admin_tok_admin: "1"
    }
  });

  let errSinToken = null;
  try { ctx.sembrarAsistenciaDemo(); } catch (e) { errSinToken = e; }
  assert(errSinToken && errSinToken.message.includes("PRUEBAS"),
    "sembrarAsistenciaDemo sin token en PRODUCCIÓN es bloqueada de inmediato");

  let errConAdmin = null;
  try { ctx.sembrarAsistenciaDemo("tok_admin"); } catch (e) { errConAdmin = e; }
  assert(errConAdmin && errConAdmin.message.includes("PRUEBAS"),
    "sembrarAsistenciaDemo CON TOKEN ADMIN en PRODUCCIÓN es bloqueada de inmediato");
}

// 2.2 sembrarAsistenciaDemo: Bloqueo si ID real != ID pruebas autorizado
{
  const ID_TEST = "1TEST_BOOK_AUTHORIZED_999999999999999";
  const ctx = crearContexto({
    entorno: "PRUEBAS",
    hojaId: ID_TEST,
    realId: "ID_DISTINTO_DISFRAZADO",
    initialCache: {
      sesion_tok_admin: JSON.stringify({ rol: "admin", nombre: "Admin" }),
      admin_tok_admin: "1"
    }
  });

  let errConAdmin = null;
  try { ctx.sembrarAsistenciaDemo("tok_admin"); } catch (e) { errConAdmin = e; }
  assert(errConAdmin && errConAdmin.message.includes("no coincide"),
    "sembrarAsistenciaDemo bloquea libro si ID real != ID configurado, incluso para admin");
}

// 2.3 sembrarContenidoPrueba1C: Bloqueo en PRODUCCION con y sin token
{
  const ID_PROD = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  const ctx = crearContexto({
    entorno: "PRODUCCION",
    hojaId: ID_PROD,
    realId: ID_PROD,
    initialCache: {
      sesion_tok_admin: JSON.stringify({ rol: "admin", nombre: "Admin" }),
      admin_tok_admin: "1"
    }
  });

  let errSinToken = null;
  try { ctx.sembrarContenidoPrueba1C(); } catch (e) { errSinToken = e; }
  assert(errSinToken && errSinToken.message.includes("PRUEBAS"),
    "sembrarContenidoPrueba1C sin token en PRODUCCIÓN es bloqueada");

  let errConAdmin = null;
  try { ctx.sembrarContenidoPrueba1C("tok_admin"); } catch (e) { errConAdmin = e; }
  assert(errConAdmin && errConAdmin.message.includes("PRUEBAS"),
    "sembrarContenidoPrueba1C CON TOKEN ADMIN en PRODUCCIÓN es bloqueada");
}

// 2.4 sembrarContenidoPrueba1C: Bloqueo si ID real != ID configurado
{
  const ID_TEST = "1TEST_BOOK_AUTHORIZED_999999999999999";
  const ctx = crearContexto({
    entorno: "PRUEBAS",
    hojaId: ID_TEST,
    realId: "OTRO_ID_NO_AUTORIZADO",
    initialCache: {
      sesion_tok_admin: JSON.stringify({ rol: "admin", nombre: "Admin" }),
      admin_tok_admin: "1"
    }
  });

  let err = null;
  try { ctx.sembrarContenidoPrueba1C("tok_admin"); } catch (e) { err = e; }
  assert(err && err.message.includes("no coincide"),
    "sembrarContenidoPrueba1C bloquea libro si ID real != ID configurado para admin");
}

// ==============================================================================
// PRUEBA 3: A-02 — Acceso seguro a expedientes de alumnos y catálogos
// ==============================================================================
console.log("\n--- TEST 3: A-02 — Protección de datos de alumnos y catálogos ---");

// 3.1 catalogoLoginPorGrado minimiza datos
{
  const ctx = crearContexto({
    entorno: "PRUEBAS",
    initialSheets: {
      Alumnos: [
        ["Matrícula", "Nombre Completo", "Grado", "Grupo", "Activo", "Intentos extra"],
        ["MAT_001", "Gómez Juan", "1", "1a", "SI", 0],
        ["MAT_002", "Pérez María", "1", "1b", "SI", 0],
        ["MAT_003", "López Carlos", "2", "2a", "SI", 0]
      ]
    }
  });

  const res = ctx.catalogoLoginPorGrado("1");
  assert(Array.isArray(res.grupos) && res.grupos.includes("1a") && res.grupos.includes("1b"),
    "catalogoLoginPorGrado entrega los grupos del grado seleccionado");
  assert(Array.isArray(res.alumnos) && res.alumnos.length === 0,
    "catalogoLoginPorGrado NO expone masivamente el padrón de alumnos (alumnos es [])");

  const listaGrupo = ctx.obtenerAlumnosPorGrupo("1a");
  assert(listaGrupo.length === 1 && listaGrupo[0].matricula === "MAT_001",
    "obtenerAlumnosPorGrupo entrega únicamente los alumnos del grupo consultado");
  assert(!listaGrupo[0].historial && !listaGrupo[0].evaluaciones,
    "obtenerAlumnosPorGrupo no expone historiales ni datos pedagógicos sensibles");
}

// 3.2 Intento de obtener una sesión mediante una llamada anónima a consultarCupoAlumno()
{
  const ctx = crearContexto({
    entorno: "PRUEBAS",
    initialSheets: {
      Alumnos: [
        ["Matrícula", "Nombre Completo", "Grado", "Grupo", "Activo", "Intentos extra"],
        ["MAT_001", "Gómez Juan", "1", "1a", "SI", 0]
      ],
      Config: [
        ["Clave", "Valor"],
        ["INTENTOS_MAXIMOS", "3"]
      ]
    }
  });

  const resCupo = ctx.consultarCupoAlumno("MAT_001");
  assert(resCupo.ok === true && resCupo.nombre === "Gómez Juan",
    "consultarCupoAlumno responde afirmativamente con datos de cupo");
  assert(typeof resCupo.tokenAlumno === "undefined",
    "consultarCupoAlumno NO emite tokenAlumno (omisión de autenticación corregida)");
  assert(typeof resCupo.panel === "undefined",
    "consultarCupoAlumno NO filtra el objeto panel con el expediente clínico/pedagógico");

  // Verificar que NO se sembró ninguna sesión en CacheService para el alumno
  const sesionesEnCache = Object.keys(ctx.__cache).filter(k => k.startsWith("sesion_"));
  assert(sesionesEnCache.length === 0,
    "consultarCupoAlumno NO crea ni almacena sesiones en CacheService ante llamadas anónimas");
}

// 3.3 Exigencia de credenciales reales para emitir sesión y vinculación estricta
{
  const ctx = crearContexto({
    entorno: "PRUEBAS",
    initialSheets: {
      Alumnos: [
        ["Matrícula", "Nombre Completo", "Grado", "Grupo", "Activo", "Intentos extra"],
        ["MAT_001", "Gómez Juan", "1", "1a", "SI", 0],
        ["MAT_002", "Pérez María", "1", "1a", "SI", 0]
      ],
      AccesoClaseAlumnos: [
        ["Matrícula", "Nombre", "Usuario", "Grado", "Grupo", "Clave", "Salt", "Hash", "Activo"],
        ["MAT_001", "Gómez Juan", "juan01", "1", "1a", "claveSegura123", "", "", "SI"],
        ["MAT_002", "Pérez María", "maria02", "1", "1a", "claveMaria456", "", "", "SI"]
      ]
    }
  });

  // 3.3.1 Login con credenciales inválidas es rechazado
  const loginFalso = ctx.iniciarSesionUnificada("MAT_001", "claveIncorrecta", "alumno");
  assert(!loginFalso || loginFalso.ok === false,
    "iniciarSesionUnificada rechaza credenciales falsas de alumno");

  // 3.3.2 Login legítimo emite sesión vinculada
  const loginReal = ctx.iniciarSesionUnificada("MAT_001", "claveSegura123", "alumno");
  assert(loginReal && loginReal.ok === true && loginReal.rol === "alumno" && typeof loginReal.token === "string",
    "iniciarSesionUnificada autentica con credenciales reales y emite token de alumno");
  assert(loginReal.urlDestino.includes("token=") && loginReal.urlDestino.includes("mat=MAT_001"),
    "urlDestinoAlumno incluye de forma segura el token y la matrícula autenticados");

  const tok1 = loginReal.token;

  // 3.3.3 Matrícula ajena sin credenciales: consulta anónima a panelAlumno denegada
  let errScrape = null;
  try { ctx.panelAlumno("MAT_001"); } catch (e) { errScrape = e; }
  assert(errScrape && errScrape.message.includes("se requiere una sesión autenticada"),
    "panelAlumno deniega el acceso a un atacante que solo conoce la matrícula sin token");

  let errTokenVacio = null;
  try { ctx.panelAlumno("MAT_001", ""); } catch (e) { errTokenVacio = e; }
  assert(errTokenVacio && errTokenVacio.message.includes("se requiere una sesión autenticada"),
    "panelAlumno deniega el acceso con token vacío");

  let errTokenInvalido = null;
  try { ctx.panelAlumno("MAT_001", "token_inventado_invalido"); } catch (e) { errTokenInvalido = e; }
  assert(errTokenInvalido && errTokenInvalido.message.includes("inválido o expirado"),
    "panelAlumno deniega el acceso con token inventado o inexistente");

  // 3.3.4 Consulta propia con sesión legítima permitida
  const panelPropio = ctx.panelAlumno("MAT_001", tok1);
  assert(panelPropio && panelPropio.ok && panelPropio.alumno.matricula === "MAT_001",
    "panelAlumno permite consultar el expediente propio del alumno con sesión verificada");

  // 3.3.5 Token de alumno válido usado con otra matrícula (denegación de expedientes ajenos)
  let errCruce = null;
  try { ctx.panelAlumno("MAT_002", tok1); } catch (e) { errCruce = e; }
  assert(errCruce && errCruce.message.includes("otro alumno"),
    "panelAlumno rechaza tajantemente que un token válido consulte el expediente de otra matrícula");
}

// ==============================================================================
// PRUEBA 4: A-03 — Registro seguro de resultados y tokens de examen
// ==============================================================================
console.log("\n--- TEST 4: A-03 — Protección y ciclo de vida estricto de exámenes ---");

{
  const ctx = crearContexto({
    entorno: "PRUEBAS",
    initialSheets: {
      Alumnos: [
        ["Matrícula", "Nombre Completo", "Grado", "Grupo", "Activo", "Intentos extra"],
        ["MAT_001", "Gómez Juan", "1", "1a", "SI", 3],
        ["MAT_002", "Pérez María", "1", "1a", "SI", 3]
      ],
      Config: [
        ["Clave", "Valor"],
        ["INTENTOS_MAXIMOS", "3"]
      ],
      Lecturas: [
        ["ID Lectura", "Grado", "Asignatura", "Tema", "Texto", "Palabras", "Preguntas JSON", "Activa", "Origen"],
        ["LEC_REAL", "1", "Español", "Tema 1", "El texto de prueba tiene suficientes palabras...", "100",
         JSON.stringify([
           { p: "¿Pregunta 1?", opciones: ["A", "B", "C", "D"], respuesta: "A", nivel: "literal" },
           { p: "¿Pregunta 2?", opciones: ["A", "B", "C", "D"], respuesta: "B", nivel: "inferencial" }
         ]), "SI", "BANCO"],
        ["LEC_OTRA", "1", "Español", "Tema 2", "Otro texto de prueba...", "120",
         JSON.stringify([
           { p: "¿Pregunta 1?", opciones: ["A", "B", "C", "D"], respuesta: "A", nivel: "literal" },
           { p: "¿Pregunta 2?", opciones: ["A", "B", "C", "D"], respuesta: "B", nivel: "inferencial" }
         ]), "SI", "BANCO"]
      ],
      Resultados: [
        ["Marca Temporal", "Escuela", "Matrícula", "Nombre Estudiante", "Grado", "Grupo", "Género", "Asignatura", "Tema", "ID Lectura", "Tiempo Lectura (s)", "Tiempo Reactivos (s)", "Tiempo Total (s)", "Segundos por pregunta", "Aciertos", "Calificación comprensión (%)", "PPM", "Nivel PPM", "Calificación global (%)", "Intento", "PME", "Relecturas", "Desglose niveles", "Modo", "Trimestre", "Recomendación"]
      ]
    }
  });

  // 4.1 Registro de resultados sin token de examen
  let errSinToken = null;
  try {
    ctx.guardarResultadosExamen({
      matricula: "MAT_001",
      idLectura: "LEC_REAL",
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["A", "B"]
    });
  } catch (e) { errSinToken = e; }
  assert(errSinToken && errSinToken.message.includes("se requiere un token de examen válido"),
    "guardarResultadosExamen rechaza envíos sin tokenExamen");

  let errTokenExamenVacio = null;
  try {
    ctx.guardarResultadosExamen({
      tokenExamen: "",
      matricula: "MAT_001",
      idLectura: "LEC_REAL",
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["A", "B"]
    });
  } catch (e) { errTokenExamenVacio = e; }
  assert(errTokenExamenVacio && errTokenExamenVacio.message.includes("se requiere un token de examen válido"),
    "guardarResultadosExamen rechaza envíos con tokenExamen vacío");

  // 4.2 Token caducado, inventado o no emitido
  let errTokenInventado = null;
  try {
    ctx.guardarResultadosExamen({
      tokenExamen: "exam_inventado_no_existente",
      matricula: "MAT_001",
      idLectura: "LEC_REAL",
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["A", "B"]
    });
  } catch (e) { errTokenInventado = e; }
  assert(errTokenInventado && errTokenInventado.message.includes("inválido, ha expirado o ya fue utilizado"),
    "guardarResultadosExamen rechaza token inventado o caducado");

  // 4.3 Iniciar examen legítimo para MAT_001 con sesión autenticada
  const tokSesMat001 = "ses_alumno_mat_001";
  ctx.__cache["sesion_" + tokSesMat001] = JSON.stringify({
    rol: "alumno",
    matricula: "MAT_001",
    nombre: "Alumno 1",
    grado: "1",
    grupo: "A"
  });
  const inicio = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokSesMat001);
  assert(inicio && inicio.ok && typeof inicio.tokenExamen === "string",
    "iniciarEvaluacionAlumno genera e incluye tokenExamen");
  const tokenExamen = inicio.tokenExamen;
  const idLecturaAsignada = inicio.lectura.idLectura;

  // 4.4 Token correspondiente a otra lectura
  let errLecturaFalsa = null;
  try {
    ctx.guardarResultadosExamen({
      tokenExamen: tokenExamen,
      matricula: "MAT_001",
      idLectura: idLecturaAsignada === "LEC_REAL" ? "LEC_OTRA" : "LEC_REAL",
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["A", "B"]
    });
  } catch (e) { errLecturaFalsa = e; }
  assert(errLecturaFalsa && errLecturaFalsa.message.includes("no coincide"),
    "guardarResultadosExamen rechaza token usado con otra lectura");

  // 4.5 Token de alumno usado con matrícula ajena
  let errMatriculaAjena = null;
  try {
    ctx.guardarResultadosExamen({
      tokenExamen: tokenExamen,
      matricula: "MAT_002",
      idLectura: idLecturaAsignada,
      tiempoLectura: 60,
      tiempoReactivos: 30,
      respuestas: ["A", "B"]
    });
  } catch (e) { errMatriculaAjena = e; }
  assert(errMatriculaAjena && errMatriculaAjena.message.includes("no corresponde a la matrícula"),
    "guardarResultadosExamen rechaza token usado con matrícula distinta");

  // 4.6 Respuestas y calificaciones manipuladas desde el cliente (validación en servidor)
  // El cliente envía respuestas erróneas ["Z", "Z"], pero inyecta aciertos: 2 y calificacionGlobal: 100
  const tokenManipulado = "exam_test_manipulacion_" + Math.random();
  ctx.__cache["examen_token_" + tokenManipulado] = JSON.stringify({
    token: tokenManipulado,
    matricula: "MAT_001",
    idLectura: "LEC_REAL",
    modo: "sorteo",
    intentoEsperado: 1
  });

  const resConRespuestasErroneas = ctx.guardarResultadosExamen({
    tokenExamen: tokenManipulado,
    matricula: "MAT_001",
    idLectura: "LEC_REAL",
    modo: "sorteo",
    tiempoLectura: 60,
    tiempoReactivos: 30,
    respuestas: ["Z", "Z"], // respuestas incorrectas
    aciertos: 2,           // cliente intenta falsificar aciertos
    calificacionGlobal: 100, // cliente intenta falsificar nota
    ppm: 500               // cliente intenta falsificar PPM
  });

  assert(resConRespuestasErroneas.ok && resConRespuestasErroneas.resultado.aciertos === 0,
    "El servidor ignora aciertos manipulados por el cliente y recalcula aciertos = 0");
  assert(resConRespuestasErroneas.resultado.comprension === 0,
    "El servidor ignora calificación manipulada y calcula comprensión = 0%");

  // 4.7 Envío legítimo exitoso con token válido
  // Iniciar nuevo examen para MAT_001 (intento 2, dado que el anterior escribió un intento)
  const inicio2 = ctx.iniciarEvaluacionAlumno("MAT_001", "sorteo", tokSesMat001);
  assert(inicio2 && inicio2.ok && typeof inicio2.tokenExamen === "string",
    "iniciarEvaluacionAlumno inicia con éxito nuevo intento legítimo con cupo disponible");
  const tokLegitimo = inicio2.tokenExamen;
  const lecLegitima = inicio2.lectura && inicio2.lectura.idLectura;

  const resGuardado = ctx.guardarResultadosExamen({
    tokenExamen: tokLegitimo,
    matricula: "MAT_001",
    idLectura: lecLegitima,
    modo: "sorteo",
    tiempoLectura: 45,
    tiempoReactivos: 25,
    tiemposPregunta: [15, 10],
    relecturas: 1,
    respuestas: ["A", "B"]
  });
  assert(resGuardado && resGuardado.ok && resGuardado.resultado.aciertos === 2,
    "guardarResultadosExamen procesa y califica con éxito el envío legítimo (2 aciertos)");

  const hojaRes = ctx.__sheets["Resultados"];
  const filasDespuesDeEnvio = hojaRes._data.length;

  // 4.8 Envíos repetidos / peticiones concurrentes (Replay Attack)
  let errDuplicado = null;
  try {
    ctx.guardarResultadosExamen({
      tokenExamen: tokLegitimo,
      matricula: "MAT_001",
      idLectura: lecLegitima,
      modo: "sorteo",
      tiempoLectura: 45,
      tiempoReactivos: 25,
      respuestas: ["A", "B"]
    });
  } catch (e) { errDuplicado = e; }
  assert(errDuplicado && errDuplicado.message.includes("inválido, ha expirado o ya fue utilizado"),
    "guardarResultadosExamen rechaza el envío duplicado porque el token fue consumido e invalidado atómicamente");
  assert(hojaRes._data.length === filasDespuesDeEnvio,
    "El envío duplicado NO registró resultados adicionales ni consumió intentos");
}

// ==============================================================================
// PRUEBA 5: M-02 — Migración segura y preservación de Lecturas
// ==============================================================================
console.log("\n--- TEST 5: M-02 — Migración segura y no destructiva de Lecturas ---");

// 5.1 No borrar lecturas ante filas incompletas o no reconocidas
{
  const ctx = crearContexto({
    entorno: "PRUEBAS",
    initialSheets: {
      Lecturas: [
        ["ID Lectura", "Grado", "Asignatura", "Tema", "Texto", "Palabras", "Preguntas JSON", "Activa", "Origen"],
        ["NUEVA_TEMP_01", "", "", "", "Texto borrador...", "20", "[]", "NO", "TEMP"],
        ["LEC_178940_CUSTOM", "", "Sin materia", "", "Texto...", "30", "[]", "SI", "USUARIO"]
      ]
    }
  });

  const pSheet = ctx.__sheets["Lecturas"];
  ctx.migrarLecturasSiEsAntiguo();

  assert(pSheet._clearCount === 0,
    "migrarLecturasSiEsAntiguo NUNCA borra la hoja con clearContents ante filas incompletas o temporales");
  assert(pSheet._data.length === 3,
    "migrarLecturasSiEsAntiguo conserva íntegras las 3 filas existentes en Lecturas");
  assert(ctx.__logs.some(l => l.includes("datos ambiguos o ninguna fila reconocida")),
    "migrarLecturasSiEsAntiguo registra un diagnóstico claro en Logger sin modificar datos");
}

// 5.2 Estructura de encabezado desconocida: no renombrar ni borrar
{
  const ctx = crearContexto({
    entorno: "PRUEBAS",
    initialSheets: {
      Lecturas: [
        ["ColumnaExtrana", "OtraColumna"],
        ["Dato 1", "Dato 2"]
      ]
    }
  });

  const pSheet = ctx.__sheets["Lecturas"];
  ctx.migrarLecturasSiEsAntiguo();

  assert(pSheet.name === "Lecturas",
    "No se renombra la hoja Lecturas ante encabezados desconocidos (se conserva el nombre)");
  assert(pSheet._clearCount === 0,
    "No se borran los contenidos de Lecturas ante encabezados desconocidos");
  assert(ctx.__logs.some(l => l.includes("estructura de encabezado desconocida")),
    "Se registra diagnóstico de encabezado desconocido y se detiene la migración de forma segura");
}

console.log("\n================================================================================");
console.log(`RESUMEN DE PRUEBAS LOCALES: ${passed} EXITOSAS, ${failed} FALLIDAS`);
console.log("================================================================================");

if (failed > 0) {
  process.exit(1);
}
