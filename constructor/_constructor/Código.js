// ========================================================
// Constructor de encuestas — backend
// Proyecto independiente: formulario configurable + panel
// ========================================================

const HOJA_FORMULARIO = "Formulario";
const HOJA_CONFIG = "Configuracion";
const HOJA_RESPUESTAS = "Respuestas";
const COLUMNAS_FORMULARIO = 11;
const TIPOS_PREGUNTA = ["texto", "parrafo", "unica", "multiple", "numero", "fecha", "sino", "escala"];

const CONFIG_POR_DEFECTO = {
  escuela: "Mi escuela",
  subtitulo: "",
  titulo: "Encuesta",
  introduccion: "Responde con calma; no hay respuestas correctas.",
  boton: "Enviar",
  nota: "Los campos con * son obligatorios.",
  exitoTitulo: "¡Gracias!",
  exitoTexto: "Tu respuesta quedó registrada.",
  otroBoton: "Registrar otra respuesta"
};

const OPCIONES_ADMIN = { usuario: "Admin", pass: "Admin-dev" };

function getCredencialesAdmin() {
  const props = PropertiesService.getScriptProperties();
  return {
    usuario: props.getProperty("ADMIN_USUARIO") || OPCIONES_ADMIN.usuario,
    pass: props.getProperty("ADMIN_PASS") || OPCIONES_ADMIN.pass
  };
}

function idDesdeTexto(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40) || ("p" + new Date().getTime());
}

function getLibro() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

// --------------------------------------------------------
// Hojas
// --------------------------------------------------------
function getHojaFormulario() {
  const ss = getLibro();
  let hoja = ss.getSheetByName(HOJA_FORMULARIO);
  if (!hoja) {
    hoja = ss.insertSheet(HOJA_FORMULARIO);
    hoja.appendRow(["id", "tipo", "etiqueta", "ayuda", "placeholder", "obligatoria",
                    "opciones", "orden", "activa", "columna", "extra"]);
    hoja.getRange(1, 1, 1, COLUMNAS_FORMULARIO).setFontWeight("bold").setBackground("#f3f4f6");
    sembrarDemo(hoja);
  }
  return hoja;
}

function sembrarDemo(hoja) {
  const demo = [
    ["nombre", "texto", "Nombre completo", "", "Nombre y apellidos", true, [], "texto", 120],
    ["area", "unica", "Área de interés", "", "", true, ["Académica", "Deportiva", "Cultural"], "", ""],
    ["satisfaccion", "escala", "¿Qué tan satisfecho estás?", "", "", true, [], "escala", ""],
    ["comentarios", "parrafo", "Comentarios (opcional)", "", "Escribe aquí…", false, [], "texto", 500]
  ];
  const filas = demo.map((p, i) => [
    p[0], p[1], p[2], p[3], p[4], p[5],
    JSON.stringify(p[6] || []), i + 1, true, i + 3,
    JSON.stringify(p[1] === "escala" ? { escalaMin: 1, escalaMax: 5 } : { maxLongitud: p[8] || "" })
  ]);
  hoja.getRange(2, 1, filas.length, COLUMNAS_FORMULARIO).setValues(filas);
}

function getHojaConfig() {
  const ss = getLibro();
  let hoja = ss.getSheetByName(HOJA_CONFIG);
  if (!hoja) {
    hoja = ss.insertSheet(HOJA_CONFIG);
    hoja.appendRow(["clave", "valor"]);
    hoja.getRange(1, 1, 1, 2).setFontWeight("bold").setBackground("#f3f4f6");
    const filas = Object.keys(CONFIG_POR_DEFECTO).map(k => [k, CONFIG_POR_DEFECTO[k]]);
    hoja.getRange(2, 1, filas.length, 2).setValues(filas);
  }
  return hoja;
}

function getHojaRespuestas() {
  const ss = getLibro();
  let hoja = ss.getSheetByName(HOJA_RESPUESTAS);
  if (!hoja) {
    hoja = ss.insertSheet(HOJA_RESPUESTAS);
    const preguntas = leerPreguntas(false);
    let maximo = 2;
    preguntas.forEach(p => { if (p.columna > maximo) maximo = p.columna; });
    const fila = new Array(maximo).fill("");
    fila[0] = "Marca temporal";
    fila[1] = "Origen";
    preguntas.forEach(p => { fila[p.columna - 1] = p.etiqueta; });
    hoja.getRange(1, 1, 1, maximo).setValues([fila]);
    hoja.getRange(1, 1, 1, maximo).setFontWeight("bold").setBackground("#f3f4f6");
  }
  return hoja;
}

// --------------------------------------------------------
// Lectura del esquema
// --------------------------------------------------------
function leerConfig() {
  const hoja = getHojaConfig();
  const valores = hoja.getDataRange().getValues();
  const config = {};
  Object.keys(CONFIG_POR_DEFECTO).forEach(k => { config[k] = CONFIG_POR_DEFECTO[k]; });
  for (let i = 1; i < valores.length; i++) {
    const clave = String(valores[i][0] || "").trim();
    if (clave) config[clave] = String(valores[i][1] || "");
  }
  return config;
}

function leerPreguntas(soloActivas) {
  const hoja = getHojaFormulario();
  const valores = hoja.getDataRange().getValues();
  const preguntas = [];
  for (let i = 1; i < valores.length; i++) {
    const f = valores[i];
    if (!f[0]) continue;
    let opciones = [];
    try { opciones = JSON.parse(f[6] || "[]") || []; } catch (e) { opciones = []; }
    let extra = {};
    try { extra = JSON.parse(f[10] || "{}") || {}; } catch (e) { extra = {}; }
    const pregunta = {
      id: String(f[0]),
      tipo: String(f[1] || "texto"),
      etiqueta: String(f[2] || ""),
      ayuda: String(f[3] || ""),
      placeholder: String(f[4] || ""),
      obligatoria: f[5] === true || String(f[5]).toUpperCase() === "TRUE",
      opciones: opciones,
      orden: Number(f[7] || i),
      activa: f[8] === true || String(f[8]).toUpperCase() === "TRUE",
      columna: Number(f[9] || 0),
      extra: extra
    };
    if (!soloActivas || pregunta.activa) preguntas.push(pregunta);
  }
  preguntas.sort((a, b) => a.orden - b.orden);
  return preguntas;
}

function normalizarPregunta(p, indice) {
  const tipo = TIPOS_PREGUNTA.indexOf(p.tipo) !== -1 ? p.tipo : "texto";
  return {
    id: String(p.id || idDesdeTexto(p.etiqueta)),
    tipo: tipo,
    etiqueta: String(p.etiqueta || "").trim(),
    ayuda: String(p.ayuda || "").trim(),
    placeholder: String(p.placeholder || "").trim(),
    obligatoria: !!p.obligatoria,
    opciones: (p.opciones || []).map(o => String(o).trim()).filter(o => o !== ""),
    orden: indice + 1,
    activa: true,
    columna: Number(p.columna || 0),
    extra: p.extra || {}
  };
}

function validarPregunta(p) {
  if (!p.etiqueta) return "Toda pregunta necesita un texto.";
  if (p.tipo === "unica" || p.tipo === "multiple") {
    if (p.opciones.length < 2) return "La pregunta «" + p.etiqueta + "» necesita al menos dos opciones.";
    if (new Set(p.opciones).size !== p.opciones.length) return "Hay opciones repetidas en «" + p.etiqueta + "».";
  }
  if (p.tipo === "escala") {
    const min = Number(p.extra.escalaMin || 1);
    const max = Number(p.extra.escalaMax || 5);
    if (!(max > min)) return "La escala de «" + p.etiqueta + "» debe tener un máximo mayor que el mínimo.";
  }
  return null;
}

// --------------------------------------------------------
// API para las páginas
// --------------------------------------------------------
function obtenerFormulario() {
  return { config: leerConfig(), preguntas: leerPreguntas(true) };
}

function verificarAdmin(credenciales) {
  const admin = getCredencialesAdmin();
  return { autenticado: !!credenciales && credenciales.usuario === admin.usuario && credenciales.pass === admin.pass };
}

function guardarFormulario(credenciales, config, preguntas) {
  if (!verificarAdmin(credenciales).autenticado) return { exito: false, mensaje: "No autorizado." };
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return { exito: false, mensaje: "El sistema está ocupado." };
  try {
    const hoja = getHojaFormulario();
    const existentes = leerPreguntas(false);
    const porId = {};
    existentes.forEach(p => { porId[p.id] = p; });

    let maxColumna = 2;
    existentes.forEach(p => { if (p.columna > maxColumna) maxColumna = p.columna; });

    const salida = [];
    const errores = [];
    (preguntas || []).forEach((p, i) => {
      const id = p.id && porId[p.id] ? p.id : (p.id || idDesdeTexto(p.etiqueta));
      const previa = porId[id];
      const normal = normalizarPregunta(Object.assign({}, p, { id: id }), i);
      normal.columna = (previa && previa.columna) ? previa.columna : (++maxColumna);
      const error = validarPregunta(normal);
      if (error) { errores.push(error); return; }
      salida.push(normal);
    });
    if (errores.length) return { exito: false, mensaje: errores[0] };

    const ids = salida.map(p => p.id);
    existentes.forEach(p => {
      if (ids.indexOf(p.id) === -1) { p.activa = false; salida.push(p); }
    });

    const filas = salida.map(p => [
      p.id, p.tipo, p.etiqueta, p.ayuda, p.placeholder, p.obligatoria,
      JSON.stringify(p.opciones || []), p.orden, p.activa, p.columna, JSON.stringify(p.extra || {})
    ]);
    hoja.getRange(2, 1, Math.max(hoja.getLastRow(), 2), COLUMNAS_FORMULARIO).clearContent();
    if (filas.length) hoja.getRange(2, 1, filas.length, COLUMNAS_FORMULARIO).setValues(filas);

    const hojaConfig = getHojaConfig();
    const claves = Object.keys(CONFIG_POR_DEFECTO);
    const valores = claves.map(k => [k, String((config || {})[k] != null ? config[k] : (CONFIG_POR_DEFECTO[k] || ""))]);
    hojaConfig.getRange(2, 1, Math.max(hojaConfig.getLastRow(), 2), 2).clearContent();
    hojaConfig.getRange(2, 1, valores.length, 2).setValues(valores);

    actualizarCabecerasRespuestas();
    return { exito: true, formulario: obtenerFormulario() };
  } catch (error) {
    console.error("guardarFormulario: " + (error && error.stack ? error.stack : error));
    return { exito: false, mensaje: "No se pudo guardar el formulario." };
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function actualizarCabecerasRespuestas() {
  const hoja = getHojaRespuestas();
  const preguntas = leerPreguntas(false);
  let maximo = 2;
  preguntas.forEach(p => { if (p.columna > maximo) maximo = p.columna; });
  const fila = new Array(maximo).fill("");
  fila[0] = "Marca temporal";
  fila[1] = "Origen";
  preguntas.forEach(p => { if (p.columna) fila[p.columna - 1] = p.etiqueta; });
  hoja.getRange(1, 1, 1, maximo).setValues([fila]);
}

// --------------------------------------------------------
// Respuestas
// --------------------------------------------------------
function valorRespuesta(pregunta, valor) {
  if (pregunta.tipo === "multiple") return Array.isArray(valor) ? valor.join("; ") : String(valor || "");
  return valor == null ? "" : String(valor).trim();
}

function validarRespuestas(preguntas, respuestas) {
  for (let i = 0; i < preguntas.length; i++) {
    const p = preguntas[i];
    const valor = respuestas[p.id];
    const vacio = p.tipo === "multiple" ? (!Array.isArray(valor) || valor.length === 0) : (valor == null || String(valor).trim() === "");
    if (p.obligatoria && vacio) return "Falta responder «" + p.etiqueta + "».";
    if (vacio) continue;
    if (p.tipo === "unica" || p.tipo === "sino") {
      const opciones = p.tipo === "sino" ? ["Sí", "No"] : p.opciones;
      if (opciones.indexOf(String(valor)) === -1) return "Opción no válida en «" + p.etiqueta + "».";
    }
    if (p.tipo === "multiple") {
      if (!Array.isArray(valor)) return "Respuesta no válida en «" + p.etiqueta + "».";
      for (const v of valor) {
        if (p.opciones.indexOf(String(v)) === -1) return "Opción no válida en «" + p.etiqueta + "».";
      }
    }
    if (p.tipo === "numero" && isNaN(Number(valor))) return "«" + p.etiqueta + "» debe ser un número.";
    if (p.tipo === "fecha" && isNaN(new Date(valor).getTime())) return "«" + p.etiqueta + "» debe ser una fecha válida.";
    if (p.tipo === "escala") {
      const min = Number(p.extra.escalaMin || 1);
      const max = Number(p.extra.escalaMax || 5);
      const n = Number(valor);
      if (isNaN(n) || n < min || n > max) return "«" + p.etiqueta + "» está fuera de la escala.";
    }
    if ((p.tipo === "texto" || p.tipo === "parrafo") && Number(p.extra.maxLongitud) > 0) {
      if (String(valor).length > Number(p.extra.maxLongitud)) return "«" + p.etiqueta + "» es demasiado largo.";
    }
  }
  return null;
}

function guardarRespuestaFormulario(datos) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return { exito: false, mensaje: "El sistema está ocupado. Intenta de nuevo." };
  try {
    const preguntas = leerPreguntas(true);
    const respuestas = (datos && datos.respuestas) || {};
    const problema = validarRespuestas(preguntas, respuestas);
    if (problema) return { exito: false, mensaje: problema };

    const hoja = getHojaRespuestas();
    let maximo = 2;
    preguntas.forEach(p => { if (p.columna > maximo) maximo = p.columna; });
    const fila = new Array(maximo).fill("");
    fila[0] = new Date();
    fila[1] = "Real";
    preguntas.forEach(p => { fila[p.columna - 1] = valorRespuesta(p, respuestas[p.id]); });
    hoja.appendRow(fila);
    return { exito: true };
  } catch (error) {
    console.error("guardarRespuestaFormulario: " + (error && error.stack ? error.stack : error));
    return { exito: false, mensaje: "No se pudo guardar la respuesta." };
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function obtenerRespuestasFormulario(credenciales) {
  if (!verificarAdmin(credenciales).autenticado) return { autenticado: false };
  const hoja = getHojaRespuestas();
  const preguntas = leerPreguntas(false);
  const valores = hoja.getDataRange().getValues();
  const filas = [];
  for (let i = 1; i < valores.length; i++) {
    const f = valores[i];
    if (!f[0]) continue;
    const objeto = {
      fecha: Utilities.formatDate(new Date(f[0]), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm"),
      origen: f[1] || "Real",
      respuestas: {}
    };
    preguntas.forEach(p => { if (p.columna) objeto.respuestas[p.id] = f[p.columna - 1]; });
    filas.push(objeto);
  }
  return { autenticado: true, config: leerConfig(), preguntas: preguntas, filas: filas };
}

// --------------------------------------------------------
// Rutas
// --------------------------------------------------------
function doGet(e) {
  const vista = e && e.parameter ? e.parameter.vista : "";
  if (vista === "constructor") {
    return HtmlService.createTemplateFromFile("Constructor")
      .evaluate()
      .setTitle("Constructor de encuestas")
      .addMetaTag("viewport", "width=device-width, initial-scale=1.0")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  return HtmlService.createTemplateFromFile("Formulario")
    .evaluate()
    .setTitle("Encuesta")
    .addMetaTag("viewport", "width=device-width, initial-scale=1.0")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
