/**
 * Pruebas estáticas y en memoria de la corrección ST90 Fase 3C.
 * No abre hojas, no llama a la red y no ejecuta Apps Script.
 * El vencimiento se simula como ausencia en la caché: así se presenta
 * una clave vencida de CacheService. No es una espera real de 6 horas.
 */
import fs from "node:fs";
import vm from "node:vm";
import crypto from "node:crypto";
import path from "node:path";

const root = "/workspace";
const respaldo = path.join(root, "_respaldo-fase3c-seguridad-20261013");
const resultados = [];
let fallos = 0;

function ok(nombre) {
  resultados.push({ nombre, ok: true });
  console.log("APROBADA  " + nombre);
}

function mal(nombre, detalle) {
  fallos++;
  resultados.push({ nombre, ok: false, detalle: String(detalle) });
  console.log("RECHAZADA " + nombre + " — " + detalle);
}

function sha(archivo) {
  const h = crypto.createHash("sha256");
  h.update(fs.readFileSync(archivo));
  return h.digest("hex");
}

function extraerFuncion(src, nombre) {
  const re = new RegExp("function\\s+" + nombre + "\\s*\\(");
  const m = re.exec(src);
  if (!m) throw new Error("No está la función " + nombre);
  let k = src.indexOf("{", m.index);
  let depth = 0;
  let state = "code";
  for (; k < src.length; k++) {
    const c = src[k];
    const n = src[k + 1];
    if (state === "code") {
      if (c === "/" && n === "/") { state = "line"; k++; continue; }
      if (c === "/" && n === "*") { state = "block"; k++; continue; }
      if (c === "'" || c === '"') { state = c; continue; }
      if (c === "`") { state = "tmpl"; continue; }
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) return src.slice(m.index, k + 1);
      }
    } else if (state === "line") {
      if (c === "\n") state = "code";
    } else if (state === "block") {
      if (c === "*" && n === "/") { state = "code"; k++; }
    } else if (state === "'" || state === '"') {
      if (c === "\\") { k++; continue; }
      if (c === state) state = "code";
    } else if (state === "tmpl") {
      if (c === "\\") { k++; continue; }
      if (c === "$" && n === "{") { state = "tmplExpr"; depth++; k++; continue; }
      if (c === "`") state = "code";
    } else if (state === "tmplExpr") {
      if (c === "'" || c === '"') { state = "tmplStr:" + c; continue; }
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) state = "tmpl";
      }
    } else if (state.indexOf("tmplStr:") === 0) {
      const q = state.slice(8);
      if (c === "\\") { k++; continue; }
      if (c === q) state = "tmplExpr";
    }
  }
  throw new Error("No se cerró la función " + nombre);
}

function assert(cond, nombre, detalle) {
  if (cond) ok(nombre);
  else mal(nombre, detalle || "condición falsa");
}

const codigo = fs.readFileSync(path.join(root, "Codigo.js"), "utf8");
const asistencia = fs.readFileSync(path.join(root, "Asistencia.js"), "utf8");
const admin = fs.readFileSync(path.join(root, "Admin.html"), "utf8");
const clase = fs.readFileSync(path.join(root, "ClaseLogica.js"), "utf8");
const codigoAntes = fs.readFileSync(path.join(respaldo, "Codigo.js.antes"), "utf8");
const asistenciaAntes = fs.readFileSync(path.join(respaldo, "Asistencia.js.antes"), "utf8");
const adminAntes = fs.readFileSync(path.join(respaldo, "Admin.html.antes"), "utf8");

assert(!codigo.includes("st90sim"), "Codigo.js ya no contiene la clave st90sim", "la clave sigue presente");
assert((codigoAntes.match(/st90sim/g) || []).length === 9, "El respaldo conserva las nueve rutas originales", "conteo distinto de 9");
assert(!/ContentService/.test(extraerFuncion(codigo, "doGet")), "doGet ya no responde JSON de demostración", "ContentService sigue en doGet");

const rutas = [
  ["sembrarPrefectas", "sembrarPrefectasDemo"],
  ["sembrarContenido1C", "sembrarContenidoPrueba1C"],
  ["sembrarAsistencia", "sembrarAsistenciaDemo"],
  ["inspeccionarNiveles", "inspeccionarNivelesPreguntas"],
  ["sincronizarNiveles", "sincronizarNivelesHojaDesdeJson"],
  ["clasificarNiveles", "clasificarNivelesTodasLasPreguntas"],
  ["ajustarLecturas", "ajustarLecturasAEspecificaciones"],
  ["cargarSimulados", "cargarResultadosSimulados"],
  ["repararResultados", "repararResultadosSiEsNecesario"]
];
const doGetSrc = extraerFuncion(codigo, "doGet");
for (const [accion, fn] of rutas) {
  assert(!doGetSrc.includes(accion) && !doGetSrc.includes(fn), "doGet no menciona " + accion, "sigue en doGet");
}

assert(admin.includes("gsRun('sembrarAsistenciaDemo', token)"), "Admin.html envía el token de sesión a la siembra de asistencia", "la llamada no envía token");
assert(!adminAntes.includes("gsRun('sembrarAsistenciaDemo', token)"), "El respaldo de Admin.html no tenía el token en esa llamada", "el respaldo ya estaba modificado");
assert(admin.split("gsRun('clasificarNivelesTodasLasPreguntas', token)").length === 2, "La clasificación sigue enviando el token", "llamada ausente o duplicada");
assert(admin.split("gsRun('cargarResultadosSimulados', token)").length === 2, "La carga simulada sigue enviando el token", "llamada ausente o duplicada");

const vigiladas = [
  "ClaseLogica.js", "Clase.html", "Interfaz.html", "ComunJS.html", "ComunCSS.html",
  "EstiloUiSt90.html", "AdminAsistencia.html", "AdminLecturas.html", "AdminUsuarios.html",
  "appsscript.json", ".clasp.json", ".claspignore"
];
const hashesAntes = fs.readFileSync(path.join(respaldo, "HASHES-ANTES.txt"), "utf8");
for (const nombre of vigiladas) {
  const digest = sha(path.join(root, nombre));
  assert(hashesAntes.includes(digest + "  " + nombre), nombre + " no cambió", digest);
}
assert(sha(path.join(root, "ClaseLogica.js")) === sha(path.join(respaldo, "HASHES-ANTES.txt")) || hashesAntes.includes(sha(path.join(root, "ClaseLogica.js")) + "  ClaseLogica.js"), "ClaseLogica.js permanece igual al respaldo", "hash distinto");

const horario = [
  "bloquesDesdeHorarios_", "mapaHorasHorario_", "horaDeFilaMae_", "turnoDesdeHoraAsi_",
  "importarHorarioAsc", "xmlAttr_", "xmlHijos_", "xmlMapaId_", "diasDeBitsAsi_",
  "partirIdsAsi_", "gradoGrupoDeClaseAsi_"
];
for (const nombre of horario) {
  const a = extraerFuncion(asistencia, nombre);
  const b = extraerFuncion(asistenciaAntes, nombre);
  assert(a === b, "Horario Fase 3B intacto: " + nombre, "el cuerpo cambió");
}
const sinTocarCodigo = [
  "exigirAdmin", "repararResultadosSiEsNecesario", "ajustarLecturasAEspecificaciones",
  "inspeccionarNivelesPreguntas", "sincronizarNivelesHojaDesdeJson",
  "guardarResultadosExamen", "panelAlumno", "obtenerAlumnosPorGrupo",
  "catalogoLoginPorGrado", "iniciarEvaluacionAlumno", "iniciarSesionUnificada"
];
for (const nombre of sinTocarCodigo) {
  assert(extraerFuncion(codigo, nombre) === extraerFuncion(codigoAntes, nombre), "Sin cambio de comportamiento: " + nombre, "el cuerpo cambió");
}
assert(extraerFuncion(clase, "sembrarContenidoPrueba1C") === extraerFuncion(fs.readFileSync(path.join(root, "ClaseLogica.js"), "utf8"), "sembrarContenidoPrueba1C"), "sembrarContenidoPrueba1C no se reescribió", "cambió");
assert(!clase.includes("exigirSesionAdminReal_"), "No se añadió autorización dentro del canal de clase", "ClaseLogica.js contiene el guardia nuevo");

function cuerpoSinGuardia(src, nombre) {
  return extraerFuncion(src, nombre)
    .replace(/\n\s*exigirSesionAdminReal_\(token\);/, "")
    .replace(/\n\s*if \(token\) exigirAdmin\(token\);/, "")
    .replace(/\n\s*if \(arguments\.length > 0\) exigirAdmin\(token\);/, "")
    .replace(nombre + "(token)", nombre + "()");
}
for (const nombre of ["clasificarNivelesTodasLasPreguntas", "cargarResultadosSimulados"]) {
  assert(cuerpoSinGuardia(codigo, nombre) === cuerpoSinGuardia(codigoAntes, nombre), "El resto de " + nombre + " quedó igual", "hay más cambios que la autorización");
}
for (const nombre of ["sembrarPrefectasDemo", "sembrarAsistenciaDemo"]) {
  assert(cuerpoSinGuardia(asistencia, nombre) === cuerpoSinGuardia(asistenciaAntes, nombre), "El resto de " + nombre + " quedó igual", "hay más cambios que la autorización");
}

const MENSAJE = "Sesión de administrador no válida. Vuelve a entrar.";
const escrituras = [];
const redes = [];
const aperturas = [];
let jsonRutas = 0;
const operaciones = [];

function cacheNuevo() {
  const store = new Map();
  return {
    store,
    get(k) { return store.has(k) ? store.get(k) : null; },
    put(k, v) { store.set(k, String(v)); },
    remove(k) { store.delete(k); },
    removeAll(keys) { (keys || []).forEach((k) => store.delete(k)); }
  };
}

function crearContexto() {
  const cache = cacheNuevo();
  escrituras.length = 0;
  redes.length = 0;
  aperturas.length = 0;
  jsonRutas = 0;
  operaciones.length = 0;
  const html = () => {
    const o = {
      tipo: "html",
      setTitle() { return o; },
      addMetaTag() { return o; },
      setXFrameOptionsMode() { return o; }
    };
    return o;
  };
  const sandbox = {
    console,
    CacheService: { getScriptCache: () => cache },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty() { return null; },
        setProperty() { escrituras.push("propiedades"); throw new Error("ESCRITURA_PROPIEDADES"); },
        deleteProperty() { escrituras.push("propiedades"); throw new Error("ESCRITURA_PROPIEDADES"); }
      })
    },
    SpreadsheetApp: {
      openById() { aperturas.push("openById"); throw new Error("SIN_SERVICIO_REAL"); },
      getActiveSpreadsheet() { aperturas.push("getActive"); throw new Error("SIN_SERVICIO_REAL"); },
      flush() { escrituras.push("flush"); throw new Error("ESCRITURA_HOJA"); },
      create() { escrituras.push("create"); throw new Error("ESCRITURA_HOJA"); }
    },
    LockService: {
      getScriptLock: () => ({ waitLock() {}, releaseLock() {} }),
      getDocumentLock: () => ({ waitLock() {}, releaseLock() {} })
    },
    UrlFetchApp: { fetch() { redes.push("url"); throw new Error("RED_REAL"); } },
    DriveApp: { getFileById() { redes.push("drive"); throw new Error("RED_REAL"); } },
    ScriptApp: { getService: () => ({ getUrl: () => "https://ejemplo.local/macros/s/prueba/exec" }) },
    HtmlService: {
      createHtmlOutputFromFile: () => html(),
      createTemplateFromFile: () => ({ evaluate: () => html() }),
      XFrameOptionsMode: { ALLOWALL: "ALLOWALL" }
    },
    ContentService: {
      createTextOutput() {
        jsonRutas++;
        return { setMimeType() { return { tipo: "json" }; } };
      },
      MimeType: { JSON: "JSON" }
    },
    Session: { getScriptTimeZone: () => "America/Mexico_City" },
    Utilities: {
      getUuid: () => "uuid-memoria",
      formatDate: () => "2026-10-13 00:00:00",
      computeDigest: () => [0],
      DigestAlgorithm: { SHA_256: "SHA_256" },
      Charset: { UTF_8: "UTF_8" }
    },
    Logger: { log() {} },
    __cache: cache
  };
  sandbox.globalThis = sandbox;
  const ctx = vm.createContext(sandbox);
  const exportadas = [
    "doGet", "exigirSesionAdminReal_", "clasificarNivelesTodasLasPreguntas",
    "cargarResultadosSimulados", "sembrarPrefectasDemo", "sembrarAsistenciaDemo",
    "sembrarContenidoPrueba1C", "inspeccionarNivelesPreguntas", "sincronizarNivelesHojaDesdeJson",
    "ajustarLecturasAEspecificaciones", "repararResultadosSiEsNecesario"
  ];
  const puente = "\nglobalThis.__api = {\n" + exportadas.map((n) => n + ": (typeof " + n + " !== 'undefined' ? " + n + " : null)").join(",\n") + "\n};\n";
  vm.runInContext(codigo + "\n" + asistencia + "\n" + puente, ctx, { filename: "st90-en-memoria.js" });
  return sandbox;
}

let ctx;
try {
  ctx = crearContexto();
  ok("Los scripts cargan en memoria sin servicios reales");
} catch (e) {
  mal("Los scripts cargan en memoria sin servicios reales", e.stack || e.message);
}

if (ctx) {
  const api = ctx.__api;
  for (const [accion] of rutas) {
    jsonRutas = 0;
    operaciones.length = 0;
    aperturas.length = 0;
    escrituras.length = 0;
    redes.length = 0;
    ctx.__cache.store.clear();
    ctx.__cache.put("setup_ok", "1");
    let salida = null;
    let error = null;
    try {
      salida = api.doGet({ parameter: { accion, clave: "st90sim" } });
    } catch (e) {
      error = e;
    }
    const bien = !error && salida && salida.tipo === "html" && jsonRutas === 0 && escrituras.length === 0 && redes.length === 0;
    assert(bien, "Ruta pública " + accion + " con clave st90sim no ejecuta la operación", error ? error.message : JSON.stringify({ tipo: salida && salida.tipo, jsonRutas, escrituras, redes }));
  }

  function poner(token, rol, conMarca) {
    ctx.__cache.store.clear();
    if (rol) ctx.__cache.put("sesion_" + token, JSON.stringify({ rol, nombre: "Prueba", usuario: "prueba" }));
    if (conMarca) ctx.__cache.put("admin_" + token, "1");
  }

  function esperarRechazo(nombre, fn) {
    aperturas.length = 0;
    escrituras.length = 0;
    redes.length = 0;
    let error = null;
    try { fn(); } catch (e) { error = e; }
    const bien = error && error.message === MENSAJE && aperturas.length === 0 && escrituras.length === 0 && redes.length === 0;
    assert(bien, nombre, error ? (error.message + " aperturas=" + aperturas.length + " escrituras=" + escrituras.length) : "no lanzó error");
  }

  const funciones = [
    ["sembrarPrefectasDemo", api.sembrarPrefectasDemo],
    ["sembrarAsistenciaDemo", api.sembrarAsistenciaDemo],
    ["clasificarNivelesTodasLasPreguntas", api.clasificarNivelesTodasLasPreguntas],
    ["cargarResultadosSimulados", api.cargarResultadosSimulados]
  ];

  for (const [nombre, fn] of funciones) {
    esperarRechazo(nombre + " rechaza llamada directa sin argumentos", () => fn());
    esperarRechazo(nombre + " rechaza token vacío", () => fn(""));
    esperarRechazo(nombre + " rechaza token en blanco", () => fn("   "));
    esperarRechazo(nombre + " rechaza token inexistente", () => fn("token-que-no-existe"));
    poner("token-vencido", "admin", true);
    ctx.__cache.remove("sesion_token-vencido");
    ctx.__cache.remove("admin_token-vencido");
    esperarRechazo(nombre + " rechaza token vencido (ausente en caché)", () => fn("token-vencido"));
    poner("token-solo-marca", null, true);
    esperarRechazo(nombre + " rechaza admin_=1 sin sesión", () => fn("token-solo-marca"));
    poner("token-prefecto", "prefecto", true);
    esperarRechazo(nombre + " rechaza rol prefecto aunque tenga admin_=1", () => fn("token-prefecto"));
    poner("token-docente", "docente", true);
    esperarRechazo(nombre + " rechaza rol docente aunque tenga admin_=1", () => fn("token-docente"));
    poner("token-apoyo", "apoyo", true);
    esperarRechazo(nombre + " rechaza rol apoyo aunque tenga admin_=1", () => fn("token-apoyo"));
    poner("token-alumno", "alumno", false);
    esperarRechazo(nombre + " rechaza rol alumno", () => fn("token-alumno"));
    poner("token-admin-sin-marca", "admin", false);
    esperarRechazo(nombre + " rechaza sesión admin sin marca de servidor", () => fn("token-admin-sin-marca"));
    esperarRechazo(nombre + " rechaza el literal admin_=1", () => fn("admin_=1"));
    esperarRechazo(nombre + " rechaza un número 1", () => fn(1));

    aperturas.length = 0;
    escrituras.length = 0;
    redes.length = 0;
    poner("token-admin", "admin", true);
    let error = null;
    try { fn("token-admin"); } catch (e) { error = e; }
    const siguio = error && error.message !== MENSAJE && aperturas.length > 0 && escrituras.length === 0 && redes.length === 0;
    assert(siguio, nombre + " con sesión admin real pasa la autorización y se detiene antes de escribir (" + (error && error.message) + ")", error ? (error.message + " aperturas=" + aperturas.length + " escrituras=" + escrituras.join(",")) : "no se detuvo");
  }

  assert(redes.length === 0 && escrituras.length === 0, "Ninguna prueba abrió red ni escribió propiedades u hojas", "redes=" + redes.length + " escrituras=" + escrituras.join(","));
}

const resumen = {
  aprobadas: resultados.filter((r) => r.ok).length,
  rechazadas: fallos,
  nota: "Pruebas estáticas y en memoria. No hubo navegador, Apps Script, hoja ni red.",
  fallos: resultados.filter((r) => !r.ok)
};
fs.writeFileSync("/tmp/st90-pruebas-resultado.json", JSON.stringify(resumen, null, 2));
console.log("RESUMEN aprobadas=" + resumen.aprobadas + " rechazadas=" + resumen.rechazadas);
if (fallos) process.exit(1);
