/**
 * Pruebas estáticas y en memoria. No abren la hoja ni la red.
 * El vencimiento se simula como ausencia en la caché.
 */
import fs from "node:fs";
import vm from "node:vm";
import crypto from "node:crypto";
import path from "node:path";

const root = "/workspace";
const respaldo = path.join(root, "_respaldo-fase3c-alumnos-20261013");
const resultados = [];
let fallos = 0;

function ok(nombre) { resultados.push({ nombre, ok: true }); console.log("APROBADA  " + nombre); }
function mal(nombre, detalle) {
  fallos++;
  resultados.push({ nombre, ok: false, detalle: String(detalle) });
  console.log("RECHAZADA " + nombre + " — " + detalle);
}
function assert(cond, nombre, detalle) { if (cond) ok(nombre); else mal(nombre, detalle || "condición falsa"); }
function sha(archivo) { return crypto.createHash("sha256").update(fs.readFileSync(archivo)).digest("hex"); }

function extraerFuncion(src, nombre) {
  const re = new RegExp("function\\s+" + nombre + "\\s*\\(");
  const m = re.exec(src);
  if (!m) throw new Error("No está " + nombre);
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
      else if (c === "}") { depth--; if (depth === 0) return src.slice(m.index, k + 1); }
    } else if (state === "line") { if (c === "\n") state = "code"; }
    else if (state === "block") { if (c === "*" && n === "/") { state = "code"; k++; } }
    else if (state === "'" || state === '"') { if (c === "\\") { k++; continue; } if (c === state) state = "code"; }
    else if (state === "tmpl") { if (c === "\\") { k++; continue; } if (c === "`") state = "code"; }
  }
  throw new Error("No se cerró " + nombre);
}

const codigo = fs.readFileSync(path.join(root, "Codigo.js"), "utf8");
const clase = fs.readFileSync(path.join(root, "ClaseLogica.js"), "utf8");
const interfaz = fs.readFileSync(path.join(root, "Interfaz.html"), "utf8");
const admin = fs.readFileSync(path.join(root, "Admin.html"), "utf8");
const claseAntes = fs.readFileSync(path.join(respaldo, "ClaseLogica.js.antes"), "utf8");
const hashesAntes = fs.readFileSync(path.join(respaldo, "HASHES-ANTES.txt"), "utf8");

const intactos = [
  "Asistencia.js", "Clase.html", "ComunJS.html", "ComunCSS.html", "EstiloUiSt90.html",
  "AdminAsistencia.html", "AdminLecturas.html", "AdminUsuarios.html",
  "appsscript.json", ".clasp.json", ".claspignore"
];
for (const nombre of intactos) {
  assert(hashesAntes.includes(sha(path.join(root, nombre)) + "  " + nombre), nombre + " no cambió", "hash distinto");
}

const canal = [
  "sesionClase_", "exigirClaseRol_", "iniciarSesionClase", "emitirSesionClase_",
  "horarioMaestroClase", "contextoClaseAlumno", "guardarContenidoClase",
  "horarioDeGrupoClase_", "horarioSemanaDeGrupoClase_"
];
for (const nombre of canal) {
  assert(extraerFuncion(clase, nombre) === extraerFuncion(claseAntes, nombre), "Canal de clase intacto: " + nombre, "cambió");
}
const siembra = extraerFuncion(clase, "sembrarContenidoPrueba1C");
const siembraAntes = extraerFuncion(claseAntes, "sembrarContenidoPrueba1C");
assert(siembra.includes("exigirSesionAdminReal_(token)"), "La siembra exige sesión admin antes de escribir", "falta el guardia");
assert(siembra.replace(/\n\s*exigirSesionAdminReal_\(token\);/, "").replace("(token)", "()") === siembraAntes, "El resto de sembrarContenidoPrueba1C quedó igual", "hay más cambios");

const horario = ["importarHorarioAsc", "bloquesDesdeHorarios_", "mapaHorasHorario_", "turnoDesdeHoraAsi_"];
const asistencia = fs.readFileSync(path.join(root, "Asistencia.js"), "utf8");
const asistenciaAntes = fs.readFileSync(path.join(root, "_respaldo-fase3c-seguridad-20261013/Asistencia.js.antes"), "utf8");
for (const nombre of horario) {
  assert(extraerFuncion(asistencia, nombre) === extraerFuncion(asistenciaAntes, nombre), "Horario Fase 3B intacto: " + nombre, "cambió");
}

const doGet = extraerFuncion(codigo, "doGet");
assert(!doGet.includes("consultarCupoAlumno") && !doGet.includes("buscarAlumno"), "doGet ya no incrusta datos de un alumno por la matrícula de la URL", "sigue leyendo al alumno");
assert(interfaz.includes("gsRun('guardarResultadosExamen', tokenAlumno, payload)"), "La interfaz envía el token al guardar", "falta el token");
assert(interfaz.includes("gsRun('iniciarSesionUnificada', usuario, clave, 'alumno')"), "La entrada del alumno usa el inicio de sesión que ya existía", "no usa el login existente");
assert(!interfaz.includes("gsRun('catalogoLoginPorGrado', grado)"), "El catálogo ya no se pide sin token", "sigue la llamada anónima");
assert(admin.includes("st90_sesion_alumno"), "El portal guarda la sesión del alumno para su página", "no hay traspaso");

const MENSAJE = "Sesión de alumno no válida. Vuelve a entrar.";
const AJENA = "No puedes consultar datos de otro alumno.";
const MAT = "Matrícula no válida.";
const ADMIN = "Sesión de administrador no válida. Vuelve a entrar.";
const escrituras = [];
const redes = [];
const aperturas = [];

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

const cache = cacheNuevo();
const sandbox = {
  console,
  CacheService: { getScriptCache: () => cache },
  PropertiesService: { getScriptProperties: () => ({
    getProperty() { return null; },
    setProperty() { escrituras.push("propiedades"); throw new Error("ESCRITURA_PROPIEDADES"); },
    deleteProperty() { escrituras.push("propiedades"); throw new Error("ESCRITURA_PROPIEDADES"); }
  }) },
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
  ScriptApp: { getService: () => ({ getUrl: () => "https://ejemplo.local/exec" }) },
  HtmlService: { createHtmlOutputFromFile() { return {}; }, createTemplateFromFile() { return { evaluate() { return {}; } }; }, XFrameOptionsMode: { ALLOWALL: "ALLOWALL" } },
  ContentService: { createTextOutput() { throw new Error("JSON_PUBLICO"); }, MimeType: { JSON: "JSON" } },
  Session: { getScriptTimeZone: () => "America/Mexico_City" },
  Utilities: { getUuid: () => "uuid-memoria", formatDate: () => "2026-10-13", computeDigest: () => [0], DigestAlgorithm: { SHA_256: "SHA_256" }, Charset: { UTF_8: "UTF_8" } },
  Logger: { log() {} }
};
sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox);
vm.runInContext(
  codigo + "\n" + clase + "\nglobalThis.__api = { panelAlumno, consultarCupoAlumno, iniciarEvaluacionAlumno, guardarResultadosExamen, obtenerAlumnosPorGrupo, catalogoLoginPorGrado, sembrarContenidoPrueba1C, exigirSesionAdminReal_, exigirAlumnoDeSesion_ };\n",
  ctx,
  { filename: "st90-alumnos.js" }
);
ok("Los scripts cargan en memoria sin servicios reales");
const api = ctx.__api;

function limpiar() {
  cache.store.clear();
  escrituras.length = 0;
  redes.length = 0;
  aperturas.length = 0;
}
function alumno(token, rolCache, extra) {
  const cuerpo = Object.assign({ rol: "alumno", matricula: "A1", nombre: "Ana", grado: "1", grupo: "1a" }, extra || {});
  cache.put(rolCache + token, JSON.stringify(cuerpo));
}
function ponerAdmin(token) {
  cache.put("admin_" + token, "1");
  cache.put("sesion_" + token, JSON.stringify({ rol: "admin", nombre: "Administrador", usuario: "admin" }));
}

function rechazo(nombre, fn, mensaje) {
  const antes = aperturas.length;
  const esc0 = escrituras.length;
  let error = null;
  let valor = null;
  try { valor = fn(); } catch (e) { error = e; }
  const bien = error && error.message === mensaje && aperturas.length === antes && escrituras.length === esc0 && redes.length === 0 && valor == null;
  assert(bien, nombre, error ? error.message : ("devolvió " + JSON.stringify(valor)));
}

limpiar();
rechazo("panelAlumno directo sin token", () => api.panelAlumno(), MENSAJE);
rechazo("panelAlumno con token vacío", () => api.panelAlumno("", "A1"), MENSAJE);
rechazo("panelAlumno con token inexistente", () => api.panelAlumno("no-existe", "A1"), MENSAJE);
alumno("ven", "sesion_");
cache.store.delete("sesion_ven");
rechazo("panelAlumno con token vencido", () => api.panelAlumno("ven", "A1"), MENSAJE);
cache.put("admin_solo", "1");
rechazo("panelAlumno rechaza admin_=1 sin sesión de alumno", () => api.panelAlumno("solo", "A1"), MENSAJE);
ponerAdmin("adm");
rechazo("panelAlumno rechaza la sesión admin", () => api.panelAlumno("adm", "A1"), MENSAJE);
alumno("mae", "clase_", { rol: "maestro", matricula: "", nombre: "Profe" });
rechazo("panelAlumno rechaza la sesión de maestro", () => api.panelAlumno("mae", "A1"), MENSAJE);
alumno("alu", "sesion_");
rechazo("panelAlumno rechaza matrícula vacía", () => api.panelAlumno("alu", ""), MAT);
rechazo("panelAlumno rechaza matrícula de otro alumno", () => api.panelAlumno("alu", "B2"), AJENA);
rechazo("cupo rechaza matrícula manipulada", () => api.consultarCupoAlumno("alu", "b2"), AJENA);
rechazo("evaluación rechaza matrícula inválida", () => api.iniciarEvaluacionAlumno("alu", "   ", ""), MAT);
rechazo("guardar rechaza resultado a nombre de otro", () => api.guardarResultadosExamen("alu", { matricula: "B2", idLectura: "X", respuestas: ["a"] }), AJENA);
rechazo("guardar directo sin token", () => api.guardarResultadosExamen({ matricula: "A1" }), MENSAJE);

limpiar();
alumno("alu", "sesion_");
aperturas.length = 0;
let catalogo = null;
let errorCat = null;
try { catalogo = api.catalogoLoginPorGrado("alu", "2"); } catch (e) { errorCat = e; }
assert(errorCat && errorCat.message === AJENA && aperturas.length === 0, "El catálogo de otro grado se rechaza sin abrir la hoja", errorCat ? errorCat.message : JSON.stringify(catalogo));
aperturas.length = 0;
let lista = null;
let errorLista = null;
try { lista = api.obtenerAlumnosPorGrupo("alu", "2b"); } catch (e) { errorLista = e; }
assert(errorLista && errorLista.message === AJENA && aperturas.length === 0, "La lista de otro grupo se rechaza sin abrir la hoja", errorLista ? errorLista.message : JSON.stringify(lista));
let propio = null;
try { propio = api.catalogoLoginPorGrado("alu", "1"); } catch (e) { propio = e; }
const soloPropio = propio && propio.alumnos && propio.alumnos.length === 1 && propio.alumnos[0].matricula === "A1" && escrituras.length === 0;
assert(soloPropio, "El catálogo del propio grado devuelve solo al alumno de la sesión", JSON.stringify(propio));
let grupoPropio = null;
try { grupoPropio = api.obtenerAlumnosPorGrupo("alu", "1a"); } catch (e) { grupoPropio = e; }
assert(Array.isArray(grupoPropio) && grupoPropio.length === 1 && grupoPropio[0].matricula === "A1", "El grupo propio devuelve solo al alumno de la sesión", JSON.stringify(grupoPropio));

function continua(nombre, fn) {
  aperturas.length = 0;
  escrituras.length = 0;
  redes.length = 0;
  let error = null;
  let valor = null;
  try { valor = fn(); } catch (e) { error = e; }
  const msg = error ? error.message : "";
  const bien = escrituras.length === 0 && redes.length === 0 && msg !== MENSAJE && msg !== AJENA && msg !== ADMIN;
  assert(bien, nombre + (msg ? " (" + msg + ")" : ""), msg || JSON.stringify(valor));
}
continua("El alumno lee su propio panel y se detiene sin escribir", () => api.panelAlumno("alu", "A1"));
continua("El alumno consulta su cupo y se detiene sin escribir", () => api.consultarCupoAlumno("alu", "a1"));
continua("El alumno inicia su evaluación y se detiene sin escribir", () => api.iniciarEvaluacionAlumno("alu", "A1", ""));
continua("El alumno guarda su propio resultado y se detiene sin escribir", () => api.guardarResultadosExamen("alu", { matricula: "A1", idLectura: "L1", respuestas: [] }));

limpiar();
alumno("clase", "clase_");
continua("La sesión de clase del alumno autoriza su propia matrícula", () => api.panelAlumno("clase", "A1"));
rechazo("La sesión de clase no autoriza otra matrícula", () => api.panelAlumno("clase", "B2"), AJENA);
rechazo("La sesión de clase del alumno no siembra contenido", () => api.sembrarContenidoPrueba1C("clase"), ADMIN);

limpiar();
rechazo("sembrarContenidoPrueba1C directo se rechaza antes de escribir", () => api.sembrarContenidoPrueba1C(), ADMIN);
alumno("alu", "sesion_");
rechazo("sembrarContenidoPrueba1C rechaza al alumno", () => api.sembrarContenidoPrueba1C("alu"), ADMIN);
cache.put("admin_marca", "1");
rechazo("sembrarContenidoPrueba1C rechaza admin_=1 sin sesión", () => api.sembrarContenidoPrueba1C("marca"), ADMIN);
ponerAdmin("adm");
continua("La sesión admin real pasa la siembra y se detiene sin escribir", () => api.sembrarContenidoPrueba1C("adm"));
rechazo("La sesión admin no lee el panel como si fuera alumno", () => api.panelAlumno("adm", "A1"), MENSAJE);

assert(redes.length === 0 && escrituras.length === 0, "Ninguna prueba abrió red ni escribió", "redes=" + redes.length + " escrituras=" + escrituras.join(","));

const resumen = {
  aprobadas: resultados.filter((r) => r.ok).length,
  rechazadas: fallos,
  nota: "Pruebas estáticas y en memoria. No hubo navegador, Apps Script, hoja ni red.",
  fallos: resultados.filter((r) => !r.ok)
};
fs.writeFileSync("/tmp/st90-pruebas-alumnos.json", JSON.stringify(resumen, null, 2));
console.log("RESUMEN aprobadas=" + resumen.aprobadas + " rechazadas=" + resumen.rechazadas);
if (fallos) process.exit(1);
