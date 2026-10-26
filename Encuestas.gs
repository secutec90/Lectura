// ========================================================
// MÓDULO INTEGRADO: CONSTRUCTOR DE ENCUESTAS & ANALÍTICA
// Código unificado en el proyecto principal Lectura
// ========================================================
// ========================================================
// Constructor de encuestas — backend
// Proyecto independiente: formulario configurable + panel
// ========================================================

const HOJA_FORMULARIO = "Formulario";
const HOJA_CONFIG = "Configuracion";
const HOJA_RESPUESTAS = "Respuestas";
const COLUMNAS_FORMULARIO = 11;
const TIPOS_PREGUNTA = ["texto", "parrafo", "unica", "multiple", "numero", "fecha", "sino", "escala"];

const GRUPOS_POR_TURNO_DEFECTO = {
  Matutino: ["1A", "1B", "1C", "1D", "1E", "2A", "2B", "2C", "2D", "2E", "3A", "3B", "3C", "3D", "3E"],
  Vespertino: ["1F", "1G", "2F", "2G", "2H", "3F", "3G"]
};

const CONFIG_POR_DEFECTO = {
  escuela: "Secundaria Técnica No. 90",
  subtitulo: "Don José Calderón Ayala",
  titulo: "Censo de Traslado y Movilidad Escolar",
  introduccion: "Toma menos de 2 minutos. Los datos se usan únicamente para organizar la entrada y salida de la escuela.",
  boton: "Enviar Encuesta",
  nota: "Todos los campos son obligatorios, excepto las observaciones.",
  exitoTitulo: "Registro guardado",
  exitoTexto: "La encuesta de {nombre} quedó registrada.",
  otroBoton: "Registrar otro estudiante",
  gruposPorTurno: JSON.stringify(GRUPOS_POR_TURNO_DEFECTO),
  categorias: "[]"
};

const OPCIONES_ADMIN = { usuario: "Admin", pass: "Admin-dev" };

const GRUPOS_SIMULACION = {
  Matutino: ["1A", "1B", "1C", "1D", "1E", "2A", "2B", "2C", "2D", "2E", "3A", "3B", "3C", "3D", "3E"],
  Vespertino: ["1F", "1G", "2F", "2G", "2H", "3F", "3G"]
};

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

const HOJA_ID_FIJA = "1bwqSni0iNPeFnoYK6M3gkeKgoC-_nv2-LNja72_lubk";

// --------------------------------------------------------
// Resolución del libro de datos (cascada)
//   1. Propiedad del script HOJA_ID
//   2. Configuracion.hojaId del libro contenedor
//   3. Libro contenedor (getActiveSpreadsheet)
//   4. HOJA_ID_FIJA (último recurso)
// --------------------------------------------------------
let _libroCache = null;
let _libroOrigen = "";

// Acepta una URL de Google Sheets o un ID puro; devuelve "" si no reconoce
function extraerIdHoja(urlOId) {
  const texto = String(urlOId || "").trim();
  if (!texto) return "";
  const porUrl = texto.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]{20,})/);
  if (porUrl) return porUrl[1];
  const soloId = texto.match(/^([a-zA-Z0-9_-]{20,})$/);
  if (soloId) return soloId[1];
  return "";
}

function abrirLibroPorId(id) {
  return SpreadsheetApp.openById(String(id || "").trim());
}

// Lee Configuracion.hojaId directamente del contenedor (sin pasar por getLibro)
function leerHojaIdDeConfiguracion(libro) {
  try {
    const hoja = libro.getSheetByName(HOJA_CONFIG);
    if (!hoja) return "";
    const valores = hoja.getDataRange().getValues();
    for (let i = 1; i < valores.length; i++) {
      if (String(valores[i][0]).trim() === "hojaId") return String(valores[i][1] || "").trim();
    }
  } catch (error) {
    console.error("leerHojaIdDeConfiguracion: " + error);
  }
  return "";
}

function getLibro() {
  if (_libroCache) return _libroCache;

  const props = PropertiesService.getScriptProperties();
  const idProp = String(props.getProperty("HOJA_ID") || "").trim();
  if (idProp) {
    _libroCache = abrirLibroPorId(idProp);
    _libroOrigen = "propiedad HOJA_ID";
    return _libroCache;
  }

  const contenedor = SpreadsheetApp.getActiveSpreadsheet();
  if (contenedor) {
    const idConfig = leerHojaIdDeConfiguracion(contenedor);
    if (idConfig && idConfig !== contenedor.getId()) {
      _libroCache = abrirLibroPorId(idConfig);
      _libroOrigen = "Configuracion.hojaId";
      return _libroCache;
    }
    _libroCache = contenedor;
    _libroOrigen = "libro contenedor";
    return _libroCache;
  }

  if (HOJA_ID_FIJA) {
    _libroCache = abrirLibroPorId(HOJA_ID_FIJA);
    _libroOrigen = "HOJA_ID_FIJA";
    return _libroCache;
  }

  throw new Error("No se encontró la hoja de datos. Vincula una desde el panel o define HOJA_ID.");
}

function getInfoLibro() {
  const libro = getLibro();
  return { id: libro.getId(), nombre: libro.getName(), origen: _libroOrigen };
}

function olvidarLibro() {
  _libroCache = null;
  _libroOrigen = "";
}

// Ejecutar una vez desde el editor para autorizar el acceso a la hoja.
function autorizar() {
  return "OK: " + getLibro().getName();
}

// --------------------------------------------------------
// Hojas
// --------------------------------------------------------
function getHojaFormulario(libro) {
  const ss = (libro && typeof libro.getSheetByName === "function") ? libro : getLibro();
  let hoja = ss.getSheetByName(HOJA_FORMULARIO);
  if (!hoja) {
    hoja = ss.insertSheet(HOJA_FORMULARIO);
    hoja.appendRow(["id", "tipo", "etiqueta", "ayuda", "placeholder", "obligatoria",
                    "opciones", "orden", "activa", "columna", "extra"]);
    hoja.getRange(1, 1, 1, COLUMNAS_FORMULARIO).setFontWeight("bold").setBackground("#f3f4f6");
    sembrarMovilidad(hoja);
  }
  return hoja;
}

const PREGUNTAS_MOVILIDAD = [
  {
    id: "nombre", tipo: "texto", etiqueta: "Nombre completo del estudiante",
    placeholder: "Nombre(s) y apellidos", obligatoria: true, opciones: [], columna: 3,
    extra: { maxLongitud: 120 }
  },
  {
    id: "turno", tipo: "unica", etiqueta: "Turno", obligatoria: true,
    opciones: ["Matutino", "Vespertino"], columna: 4, extra: { esDimension: true }
  },
  {
    id: "grupo", tipo: "unica", etiqueta: "Grupo", obligatoria: true,
    opciones: ["1A", "1B", "1C", "1D", "1E", "2A", "2B", "2C", "2D", "2E", "3A", "3B", "3C", "3D", "3E",
               "1F", "1G", "2F", "2G", "2H", "3F", "3G"],
    columna: 5,
    extra: { esDimension: true, padre: "turno", opcionesPorPadre: GRUPOS_POR_TURNO_DEFECTO }
  },
  {
    id: "movilidad", tipo: "unica", etiqueta: "¿Cuál es el medio principal de traslado a la escuela?",
    obligatoria: true,
    opciones: ["Caminando", "Transporte Escolar de la escuela", "Transporte Escolar contratado por familias",
               "Transporte Público", "Auto Compartido", "Aplicación Carpool",
               "Vehículos no motorizados", "Otros"],
    columna: 6, extra: {}
  },
  {
    id: "tiempoTraslado", tipo: "unica", etiqueta: "Tiempo aproximado de traslado de la casa a la escuela",
    obligatoria: true,
    opciones: ["Menos de 10 minutos", "10 a 20 minutos", "20 a 30 minutos", "30 a 45 minutos", "Más de 45 minutos"],
    columna: 7, extra: {}
  },
  {
    id: "tiempoDescenso", tipo: "unica", etiqueta: "¿Cuánto tarda en descender del vehículo?",
    obligatoria: false,
    opciones: ["Menos de 1 minuto (Inmediato)", "1 a 2 minutos", "2 a 3 minutos", "Más de 3 minutos", "No aplica (camina)"],
    columna: 8,
    extra: { condicion: { pregunta: "movilidad", operador: "distinto", valor: "Caminando" } }
  },
  {
    id: "tiempoPuerta", tipo: "unica", etiqueta: "¿Cuánto tarda en llegar a la puerta una vez que bajó?",
    obligatoria: false,
    opciones: ["Menos de 1 minuto (Frente a la puerta)", "1 a 2 minutos", "2 a 5 minutos", "Más de 5 minutos", "No aplica (camina)"],
    columna: 9,
    extra: { condicion: { pregunta: "movilidad", operador: "distinto", valor: "Caminando" } }
  },
  {
    id: "comentarios", tipo: "parrafo", etiqueta: "Observaciones sobre la logística (opcional)",
    placeholder: "Comentarios sobre el tráfico, puntos de ascenso o descenso...",
    obligatoria: false, opciones: [], columna: 10, extra: { maxLongitud: 500 }
  }
];

const IDS_DEMO = ["nombre", "area", "satisfaccion", "comentarios"];

function sembrarMovilidad(hoja) {
  const filas = PREGUNTAS_MOVILIDAD.map((p, i) => [
    p.id, p.tipo, p.etiqueta, p.ayuda || "", p.placeholder || "",
    !!p.obligatoria, JSON.stringify(p.opciones || []), i + 1, true, p.columna,
    JSON.stringify(p.extra || {})
  ]);
  hoja.getRange(2, 1, filas.length, COLUMNAS_FORMULARIO).setValues(filas);
}

// Reemplaza las preguntas demo de las primeras versiones por las de movilidad.
function migrarDemoAMovilidad() {
  const hoja = getHojaFormulario();
  const last = hoja.getLastRow();
  if (last < 2) return false;
  const ids = hoja.getRange(2, 1, last - 1, 1).getValues().map(r => String(r[0] || ""));
  const esDemo = ids.length === IDS_DEMO.length && ids.every((id, i) => id === IDS_DEMO[i]);
  if (!esDemo) return false;

  hoja.getRange(2, 1, last - 1, COLUMNAS_FORMULARIO).clearContent();
  sembrarMovilidad(hoja);

  const cfg = getHojaConfig();
  const filas = Object.keys(CONFIG_POR_DEFECTO).map(k => [k, CONFIG_POR_DEFECTO[k]]);
  const lastCfg = cfg.getLastRow();
  if (lastCfg > 1) cfg.getRange(2, 1, lastCfg - 1, 2).clearContent();
  cfg.getRange(2, 1, filas.length, 2).setValues(filas);

  try { actualizarCabecerasRespuestas(); } catch (e) { console.error("cabeceras: " + e); }

  return true;
}

function getHojaConfig(libro) {
  const ss = (libro && typeof libro.getSheetByName === "function") ? libro : getLibro();
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

function getHojaRespuestas(libro) {
  const ss = (libro && typeof libro.getSheetByName === "function") ? libro : getLibro();
  let hoja = ss.getSheetByName(HOJA_RESPUESTAS);
  if (!hoja) {
    hoja = ss.insertSheet(HOJA_RESPUESTAS);
    const preguntas = leerPreguntas(false, ss.getSheetByName(HOJA_FORMULARIO) || getHojaFormulario(ss));
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
function leerConfigEncuestas(libro) {
  const hoja = getHojaConfig(libro);
  const valores = hoja.getDataRange().getValues();
  const config = {};
  Object.keys(CONFIG_POR_DEFECTO).forEach(k => { config[k] = CONFIG_POR_DEFECTO[k]; });
  for (let i = 1; i < valores.length; i++) {
    const clave = String(valores[i][0] || "").trim();
    if (clave) config[clave] = String(valores[i][1] || "");
  }
  return config;
}

function leerPreguntas(soloActivas, hoja) {
  const fuente = hoja || getHojaFormulario();
  const valores = fuente.getDataRange().getValues();
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
    extra: normalizarExtra(p.extra, tipo)
  };
}

const ROLES_ANALITICOS = ["identidad", "dimension", "metrica"];

// Conserva las claves conocidas de extra y normaliza rol analítico, graficable y jerarquía
function normalizarExtra(extra, tipo) {
  const e = Object.assign({}, extra || {});
  const esTexto = tipo === "texto" || tipo === "parrafo";

  // Rol: se conserva si es válido; si no, se infiere del dato anterior (v45-v47)
  let rol = String(e.rol || "").trim();
  if (ROLES_ANALITICOS.indexOf(rol) === -1) {
    if (esTexto) rol = "identidad";
    else if (e.padre || e.esDimension === true) rol = "dimension";
    else rol = "metrica";
  }
  if (esTexto) rol = "identidad";            // el tipo manda sobre el rol
  e.rol = rol;
  e.esDimension = (rol === "dimension");     // una sola fuente de verdad

  // Graficable: booleano; identidad y texto abierto nunca se grafican
  if (esTexto) e.graficable = false;
  else e.graficable = (typeof e.graficable === "boolean") ? e.graficable : true;
  if (e.rol === "identidad") e.graficable = false;

  // Jerarquía: solo una dimensión conserva padre y mapeo de opciones
  if (e.esDimension) {
    if (e.padre) e.padre = String(e.padre).trim();
    if (!e.padre) delete e.padre;
    if (e.padre && e.opcionesPorPadre && typeof e.opcionesPorPadre === "object") {
      const mapa = {};
      Object.keys(e.opcionesPorPadre).forEach(k => {
        const valores = (e.opcionesPorPadre[k] || []).map(v => String(v).trim()).filter(Boolean);
        if (valores.length) mapa[String(k)] = valores;
      });
      if (Object.keys(mapa).length) e.opcionesPorPadre = mapa; else delete e.opcionesPorPadre;
    } else {
      delete e.opcionesPorPadre;
    }
  } else {
    delete e.padre;
    delete e.opcionesPorPadre;
  }
  return e;
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
  if (p.extra && p.extra.padre && p.extra.padre === p.id) {
    return "Una pregunta no puede depender de sí misma.";
  }
  if (p.extra && p.extra.opcionesPorPadre) {
    const claves = Object.keys(p.extra.opcionesPorPadre);
    for (const clave of claves) {
      const valores = p.extra.opcionesPorPadre[clave] || [];
      if (!valores.length) return "El mapeo de «" + p.etiqueta + "» tiene un valor sin opciones.";
      if (new Set(valores).size !== valores.length) return "Hay opciones repetidas en el mapeo de «" + p.etiqueta + "».";
    }
  }

  // Coherencia del modelo analítico (v48)
  const extra = p.extra || {};
  if (ROLES_ANALITICOS.indexOf(extra.rol) === -1) {
    return "El rol analítico de «" + p.etiqueta + "» no es válido.";
  }
  if (typeof extra.graficable !== "boolean") {
    return "«" + p.etiqueta + "» no tiene una marca válida de graficable.";
  }
  if ((p.tipo === "texto" || p.tipo === "parrafo") && (extra.rol !== "identidad" || extra.graficable)) {
    return "«" + p.etiqueta + "» es de texto: su rol debe ser identidad y no puede graficarse.";
  }
  if (extra.esDimension !== (extra.rol === "dimension")) {
    return "La jerarquía de «" + p.etiqueta + "» no concuerda con su rol analítico.";
  }
  if (extra.padre && extra.rol !== "dimension") {
    return "Solo una dimensión puede depender de otra pregunta.";
  }
  return null;
}

// --------------------------------------------------------
// API para las páginas
// --------------------------------------------------------
function obtenerFormulario() {
  try {
    migrarDemoAMovilidad();
  } catch (error) {
    console.error("migrarDemoAMovilidad: " + (error && error.stack ? error.stack : error));
  }
  return { config: leerConfigEncuestas(), preguntas: leerPreguntas(true) };
}

const MAX_INTENTOS_ADMIN = 8;
const VENTANA_INTENTOS_ADMIN = 600;

function verificarAdmin(credenciales) {
  // 1. Soporte para token de sesión de la aplicación principal (Lectura)
  if (credenciales && (credenciales.token || credenciales.tokenSesion)) {
    try {
      const t = String(credenciales.token || credenciales.tokenSesion || "").trim();
      const ses = (typeof obtenerSesionValida_ === 'function') ? obtenerSesionValida_(t) : null;
      if (ses && (ses.rol === "admin" || ses.rol === "docente")) {
        return { autenticado: true, bloqueado: false, mensaje: "" };
      }
    } catch (eToken) {
      console.warn("verificarAdmin token: " + eToken);
    }
  }

  // 2. Verificación tradicional de usuario y contraseña de administrador
  const cache = CacheService.getScriptCache();
  const clave = "admin_intentos";
  const intentos = Number(cache.get(clave) || 0);
  if (intentos >= MAX_INTENTOS_ADMIN) {
    return { autenticado: false, bloqueado: true, mensaje: "Demasiados intentos. Espera unos minutos." };
  }
  const admin = getCredencialesAdmin();
  const correcto = !!credenciales && (
    (credenciales.usuario === admin.usuario && (credenciales.pass === admin.pass || credenciales.clave === admin.pass))
  );
  if (correcto) cache.remove(clave);
  else cache.put(clave, String(intentos + 1), VENTANA_INTENTOS_ADMIN);
  return { autenticado: correcto, bloqueado: false, mensaje: correcto ? "" : "Usuario o contraseña incorrectos." };
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

    const mapaCondiciones = {};
    salida.forEach(p => { mapaCondiciones[p.id] = p; });
    const OPERADORES = ["igual", "distinto", "contiene", "vacio", "no_vacio"];
    for (const revision of salida) {
      const c = revision.extra && revision.extra.condicion;
      if (!c) continue;
      if (!c.pregunta || !mapaCondiciones[c.pregunta] || c.pregunta === revision.id) {
        return { exito: false, mensaje: "La condición de «" + revision.etiqueta + "» apunta a una pregunta no válida." };
      }
      if (OPERADORES.indexOf(c.operador) === -1) {
        return { exito: false, mensaje: "La condición de «" + revision.etiqueta + "» no es válida." };
      }
      if (c.operador !== "vacio" && c.operador !== "no_vacio" && !String(c.valor || "").trim()) {
        return { exito: false, mensaje: "La condición de «" + revision.etiqueta + "» necesita un valor." };
      }
    }
    const estadoCondicion = {};
    const revisarCondicion = (id) => {
      if (estadoCondicion[id] === 2) return null;
      if (estadoCondicion[id] === 1) return "Hay una dependencia circular entre preguntas.";
      estadoCondicion[id] = 1;
      const c = mapaCondiciones[id] && mapaCondiciones[id].extra && mapaCondiciones[id].extra.condicion;
      if (c && c.pregunta) {
        const error = revisarCondicion(c.pregunta);
        if (error) return error;
      }
      estadoCondicion[id] = 2;
      return null;
    };
    for (const revision of salida) {
      const error = revisarCondicion(revision.id);
      if (error) return { exito: false, mensaje: error };
    }

    // Jerarquía de dimensiones: el padre debe existir y no puede haber ciclos
    const estadoPadre = {};
    const revisarPadre = (id) => {
      if (estadoPadre[id] === 2) return null;
      if (estadoPadre[id] === 1) return "Hay una dependencia circular en la jerarquía de dimensiones.";
      estadoPadre[id] = 1;
      const pregunta = mapaCondiciones[id];
      const padre = pregunta && pregunta.extra ? pregunta.extra.padre : "";
      if (padre) {
        if (!mapaCondiciones[padre]) return "«" + pregunta.etiqueta + "» depende de una pregunta que no existe.";
        const error = revisarPadre(padre);
        if (error) return error;
      }
      estadoPadre[id] = 2;
      return null;
    };
    for (const revision of salida) {
      const error = revisarPadre(revision.id);
      if (error) return { exito: false, mensaje: error };
    }

    const idsUsados = {};
    const etiquetasUsadas = {};
    for (const revision of salida) {
      if (idsUsados[revision.id]) return { exito: false, mensaje: "Hay una pregunta repetida; cambia el texto de una de ellas." };
      idsUsados[revision.id] = true;
      const etiquetaClave = revision.etiqueta.toLowerCase();
      if (etiquetasUsadas[etiquetaClave]) return { exito: false, mensaje: "La pregunta «" + revision.etiqueta + "» está repetida." };
      etiquetasUsadas[etiquetaClave] = true;
    }

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

function actualizarCabecerasRespuestas(libro) {
  const hoja = getHojaRespuestas(libro);
  const preguntas = leerPreguntas(false, libro ? libro.getSheetByName(HOJA_FORMULARIO) : null);
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

function condicionVisible(p, respuestas) {
  const c = p.extra && p.extra.condicion;
  if (!c || !c.pregunta) return true;
  const valor = respuestas[c.pregunta];
  const vacio = valor == null || String(valor).trim() === "";
  if (c.operador === "vacio") return vacio;
  if (c.operador === "no_vacio") return !vacio;
  if (vacio) return false;
  if (c.operador === "distinto") return String(valor) !== String(c.valor);
  if (c.operador === "contiene") {
    return String(valor).split(";").map(s => s.trim()).indexOf(String(c.valor)) !== -1;
  }
  return String(valor) === String(c.valor);
}

function validarRespuestas(preguntas, respuestas) {
  for (let i = 0; i < preguntas.length; i++) {
    const p = preguntas[i];
    if (!condicionVisible(p, respuestas)) continue;
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
    if ((p.tipo === "texto" || p.tipo === "parrafo") && String(valor).charAt(0) === "=") {
      return "«" + p.etiqueta + "» no puede empezar con «=».";
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
    preguntas.forEach(p => {
      fila[p.columna - 1] = condicionVisible(p, respuestas) ? valorRespuesta(p, respuestas[p.id]) : "";
    });
    hoja.appendRow(fila);
    return { exito: true };
  } catch (error) {
    console.error("guardarRespuestaFormulario: " + (error && error.stack ? error.stack : error));
    return { exito: false, mensaje: "No se pudo guardar la respuesta." };
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

// --------------------------------------------------------
// Simulación de respuestas
// --------------------------------------------------------
function getClaveSimulacion() {
  return PropertiesService.getScriptProperties().getProperty("CLAVE_ESPECIAL") || "Memo#1";
}

function elegirPonderado(opciones, pesos) {
  if (!opciones.length) return "";
  if (!pesos || pesos.length !== opciones.length) {
    return opciones[Math.floor(Math.random() * opciones.length)];
  }
  const total = pesos.reduce((s, w) => s + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < opciones.length; i++) {
    r -= pesos[i];
    if (r <= 0) return opciones[i];
  }
  return opciones[opciones.length - 1];
}

function crearPesosSimulacion(preguntas) {
  const pesos = {};
  preguntas.forEach(p => {
    if (!p.opciones || !p.opciones.length) return;
    const base = p.opciones.map(() => 1 + Math.floor(Math.random() * 3));
    const dominantes = 1 + Math.floor(Math.random() * 2);
    for (let k = 0; k < dominantes; k++) {
      base[Math.floor(Math.random() * base.length)] += 4 + Math.floor(Math.random() * 6);
    }
    pesos[p.id] = base;
  });
  return pesos;
}

function valorSimulado(p, pesos) {
  const tipo = p.tipo;
  const opciones = p.opciones || [];
  if (tipo === "unica") {
    return elegirPonderado(opciones, pesos);
  }
  if (tipo === "sino") {
    return Math.random() < 0.55 + Math.random() * 0.25 ? "Sí" : "No";
  }
  if (tipo === "multiple") {
    if (!opciones.length) return "";
    const elegidas = [];
    const cuantas = 1 + Math.floor(Math.random() * Math.min(3, opciones.length));
    let guard = 0;
    while (elegidas.length < cuantas && guard < 20) {
      guard++;
      const op = elegirPonderado(opciones, pesos);
      if (elegidas.indexOf(op) === -1) elegidas.push(op);
    }
    return elegidas.join("; ");
  }
  if (tipo === "numero") {
    return String(Math.floor(Math.random() * 100) + 1);
  }
  if (tipo === "fecha") {
    const d = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
    return Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  if (tipo === "escala") {
    const min = Number(p.extra && p.extra.escalaMin ? p.extra.escalaMin : 1);
    const max = Number(p.extra && p.extra.escalaMax ? p.extra.escalaMax : 5);
    const centro = min + Math.floor(Math.random() * (max - min + 1));
    const valores = [];
    for (let n = min; n <= max; n++) valores.push(String(n));
    const pesosEscala = valores.map(v => 1 + Math.max(0, 5 - Math.abs(Number(v) - centro)));
    return elegirPonderado(valores, pesosEscala);
  }
  if (tipo === "parrafo") {
    const comentarios = ["Sin comentarios", "Llega puntual", "Tráfico fluido", "Mucho tráfico en la avenida", "Desciende frente al portón"];
    return elegirPonderado(comentarios, null);
  }
  const nombres = ["Ana", "Luis", "Sofía", "Mateo", "Valentina", "Diego", "Camila", "Sebastián", "Ximena", "Emiliano"];
  const apellidos = ["López", "García", "Hernández", "Martínez", "Pérez", "Sánchez", "Ramírez", "Torres"];
  return elegirPonderado(nombres, null) + " " + elegirPonderado(apellidos, null) + " " + elegirPonderado(apellidos, null);
}

function simularRespuestasFormulario(credenciales, cantidad, passEspecial, perfil) {
  if (!verificarAdmin(credenciales).autenticado) {
    return { exito: false, mensaje: "Sesión no válida." };
  }
  if (String(passEspecial) !== getClaveSimulacion()) {
    return { exito: false, mensaje: "Contraseña de simulación incorrecta." };
  }
  const n = Number(cantidad);
  if (!Number.isInteger(n) || n < 1 || n > 500) {
    return { exito: false, mensaje: "La cantidad debe ser un entero entre 1 y 500." };
  }
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) {
    return { exito: false, mensaje: "El sistema está ocupado. Intenta de nuevo." };
  }
  try {
    const preguntas = leerPreguntas(true);
    let mapaGrupos = null;
    try {
      mapaGrupos = JSON.parse(leerConfigEncuestas().gruposPorTurno || "null");
    } catch (error) {
      mapaGrupos = null;
    }
    if (!preguntas.length) {
      return { exito: false, mensaje: "No hay preguntas activas." };
    }
    const hoja = getHojaRespuestas();
    let maximo = 2;
    preguntas.forEach(p => { if (p.columna > maximo) maximo = p.columna; });
    const pesos = perfil === "uniforme" ? null : crearPesosSimulacion(preguntas);
    const filas = [];
    for (let i = 0; i < n; i++) {
      const fila = new Array(maximo).fill("");
      fila[0] = new Date(Date.now() - Math.floor(Math.random() * 4 * 24 * 60 * 60 * 1000));
      fila[1] = "Simulado";
      const valores = {};
      preguntas.forEach(p => { valores[p.id] = valorSimulado(p, pesos ? pesos[p.id] : null); });
      if (valores.grupo !== undefined) {
        let opcionesGrupo = [];
        if (mapaGrupos && valores.turno && mapaGrupos[valores.turno]) {
          opcionesGrupo = mapaGrupos[valores.turno];
        } else {
          const preguntaGrupo = preguntas.find(p => p.id === "grupo");
          opcionesGrupo = (preguntaGrupo && preguntaGrupo.opciones) || [];
        }
        if (opcionesGrupo.length) valores.grupo = elegirPonderado(opcionesGrupo, null);
      }
      if (valores.movilidad === "Caminando") {
        ["tiempoDescenso", "tiempoPuerta"].forEach(id => {
          if (valores[id] === undefined) return;
          const pregunta = preguntas.find(q => q.id === id);
          const opcion = pregunta && (pregunta.opciones || []).find(o => /^No aplica/i.test(o));
          if (opcion) valores[id] = opcion;
        });
      }
      preguntas.forEach(p => { fila[p.columna - 1] = valores[p.id] != null ? valores[p.id] : ""; });
      filas.push(fila);
    }
    hoja.getRange(hoja.getLastRow() + 1, 1, filas.length, maximo).setValues(filas);
    return { exito: true, total: filas.length };
  } catch (error) {
    console.error("simularRespuestasFormulario: " + (error && error.stack ? error.stack : error));
    return { exito: false, mensaje: "No se pudo generar la simulación." };
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function limpiarSimuladosFormulario(credenciales, passEspecial) {
  if (!verificarAdmin(credenciales).autenticado) {
    return { exito: false, mensaje: "Sesión no válida." };
  }
  if (String(passEspecial) !== getClaveSimulacion()) {
    return { exito: false, mensaje: "Contraseña incorrecta." };
  }
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) {
    return { exito: false, mensaje: "El sistema está ocupado. Intenta de nuevo." };
  }
  try {
    const hoja = getHojaRespuestas();
    const valores = hoja.getDataRange().getValues();
    let borradas = 0;
    for (let i = valores.length - 1; i >= 1; i--) {
      if (String(valores[i][1] || "") === "Simulado") {
        hoja.deleteRow(i + 1);
        borradas++;
      }
    }
    return { exito: true, total: borradas };
  } catch (error) {
    console.error("limpiarSimuladosFormulario: " + (error && error.stack ? error.stack : error));
    return { exito: false, mensaje: "No se pudo limpiar." };
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
    let fechaTexto = "";
    try {
      const d = new Date(f[0]);
      if (!isNaN(d.getTime())) {
        fechaTexto = Utilities.formatDate(d, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");
      }
    } catch (error) {
      fechaTexto = "";
    }
    const objeto = {
      fecha: fechaTexto,
      origen: f[1] || "Real",
      respuestas: {}
    };
    preguntas.forEach(p => { if (p.columna) objeto.respuestas[p.id] = f[p.columna - 1]; });
    filas.push(objeto);
  }
  return { autenticado: true, hoja: getInfoLibro(), config: leerConfigEncuestas(), preguntas: preguntas, filas: filas };
}

// Variante del panel: entrega el mismo contenido como cadena JSON.
// google.script.run devuelve null cuando el objeto es grande; una cadena viaja igual.
function obtenerRespuestasFormularioJSON(credenciales) {
  const datos = obtenerRespuestasFormulario(credenciales);
  try { return JSON.stringify(datos); } catch (error) { return JSON.stringify({ autenticado: false, mensaje: String(error) }); }
}

// --------------------------------------------------------
// Ejemplo de jerarquía para ver la cascada
// --------------------------------------------------------
const DEMO_JERARQUIA = [
  {
    id: "demo_sede", tipo: "unica", etiqueta: "Ejemplo · Sede", obligatoria: false,
    opciones: ["Norte", "Sur"],
    extra: { esDimension: true }
  },
  {
    id: "demo_area", tipo: "unica", etiqueta: "Ejemplo · Área", obligatoria: false,
    opciones: ["Operaciones", "Ventas", "Administración"],
    extra: {
      esDimension: true, padre: "demo_sede",
      opcionesPorPadre: { Norte: ["Operaciones", "Ventas"], Sur: ["Operaciones", "Administración"] }
    }
  },
  {
    id: "demo_puesto", tipo: "unica", etiqueta: "Ejemplo · Puesto", obligatoria: false,
    opciones: ["Operador", "Supervisor", "Asesor", "Analista"],
    extra: {
      esDimension: true, padre: "demo_area",
      opcionesPorPadre: {
        Operaciones: ["Operador", "Supervisor"],
        Ventas: ["Asesor", "Supervisor"],
        "Administración": ["Analista", "Supervisor"]
      }
    }
  }
];

// Marca Turno -> Grupo como jerarquía y añade el ejemplo de tres niveles
function instalarJerarquiaDemo(credenciales) {
  if (!verificarAdmin(credenciales).autenticado) return { exito: false, mensaje: "Sesión no válida." };
  const activas = leerPreguntas(true);

  activas.forEach(p => {
    p.extra = p.extra || {};
    if (p.id === "turno") p.extra.esDimension = true;
    if (p.id === "grupo") {
      p.extra.esDimension = true;
      p.extra.padre = "turno";
      p.extra.opcionesPorPadre = GRUPOS_POR_TURNO_DEFECTO;
    }
  });

  DEMO_JERARQUIA.forEach(d => {
    if (!activas.some(p => p.id === d.id)) {
      activas.push(JSON.parse(JSON.stringify(d)));
    }
  });

  return guardarFormulario(credenciales, leerConfigEncuestas(), activas);
}

// Desactiva las preguntas del ejemplo (no borra columnas ni datos)
function quitarJerarquiaDemo(credenciales) {
  if (!verificarAdmin(credenciales).autenticado) return { exito: false, mensaje: "Sesión no válida." };
  const ids = DEMO_JERARQUIA.map(d => d.id);
  const activas = leerPreguntas(true).filter(p => ids.indexOf(p.id) === -1);
  return guardarFormulario(credenciales, leerConfigEncuestas(), activas);
}
// --------------------------------------------------------
// Vinculación de una hoja desde el panel
// --------------------------------------------------------
function prepararHojasDeLibro(libro) {
  const creadas = [];
  const nombres = libro.getSheets().map(h => h.getName());

  if (nombres.indexOf(HOJA_FORMULARIO) === -1) {
    getHojaFormulario(libro);
    creadas.push(HOJA_FORMULARIO);
  }
  if (nombres.indexOf(HOJA_CONFIG) === -1) {
    getHojaConfig(libro);
    creadas.push(HOJA_CONFIG);
  }
  if (nombres.indexOf(HOJA_RESPUESTAS) === -1) {
    getHojaRespuestas(libro);
    creadas.push(HOJA_RESPUESTAS);
  } else {
    try {
      actualizarCabecerasRespuestas(libro);
    } catch (error) {
      console.error("cabeceras al vincular: " + error);
    }
  }
  return creadas;
}

function vincularYPrepararHoja(credenciales, urlOId) {
  if (!verificarAdmin(credenciales).autenticado) {
    return { exito: false, codigo: "NO_AUTORIZADO", mensaje: "Sesión no válida. Vuelve a iniciar sesión." };
  }

  const id = extraerIdHoja(urlOId);
  if (!id) {
    return { exito: false, codigo: "URL_INVALIDA", mensaje: "La URL o el ID no tienen el formato esperado. Pega el enlace completo de la hoja." };
  }

  let libro = null;
  try {
    libro = abrirLibroPorId(id);
  } catch (error) {
    const texto = String((error && error.message) || error);
    const sinPermiso = /permission|denied|autoriz|access|permiso/i.test(texto);
    return {
      exito: false,
      codigo: sinPermiso ? "PERMISSION_DENIED" : "NO_ENCONTRADA",
      mensaje: sinPermiso
        ? "No se pudo abrir la hoja: compártela como Editor con la cuenta que ejecuta el script."
        : "No existe una hoja de cálculo con ese ID (o el ID está mal escrito)."
    };
  }

  // Prueba real de escritura con una pestaña temporal que se borra
  let temporal = null;
  try {
    temporal = libro.insertSheet("_prueba_" + Date.now());
    temporal.getRange(1, 1).setValue("ok");
  } catch (error) {
    return { exito: false, codigo: "SIN_ESCRITURA", mensaje: "La hoja es de solo lectura. Compártela como Editor e inténtalo de nuevo." };
  } finally {
    if (temporal) {
      try { libro.deleteSheet(temporal); } catch (error) { console.error("deleteSheet: " + error); }
    }
  }

  try {
    const creadas = prepararHojasDeLibro(libro);
    PropertiesService.getScriptProperties().setProperty("HOJA_ENCUESTAS_ID", id);
    olvidarLibro();
    const activo = getLibro();
    return {
      exito: true,
      id: id,
      nombre: activo.getName(),
      hojasCreadas: creadas,
      hoja: getInfoLibro(),
      config: leerConfigEncuestas(),
      preguntas: leerPreguntas(true)
    };
  } catch (error) {
    console.error("vincularYPrepararHoja: " + (error && error.stack ? error.stack : error));
    return { exito: false, codigo: "APROVISIONAMIENTO", mensaje: "Se validó el acceso, pero no se pudieron preparar las pestañas de la hoja." };
  }
}
// --------------------------------------------------------
// Banco de encuestas (snapshots de encuestas ya aplicadas)
//   BancoEncuestas: id | guardado | encuesta | respuestas | preguntas | resumen | esquema
//   BancoRespuestas: id_encuesta | fecha | origen | respuestas_json
// --------------------------------------------------------
const HOJA_BANCO = "BancoEncuestas";
const HOJA_BANCO_RESPUESTAS = "BancoRespuestas";

function getHojaBanco(libro) {
  const ss = (libro && typeof libro.getSheetByName === "function") ? libro : getLibro();
  let hoja = ss.getSheetByName(HOJA_BANCO);
  if (!hoja) {
    hoja = ss.insertSheet(HOJA_BANCO);
    hoja.appendRow(["id", "guardado", "encuesta", "respuestas", "preguntas", "resumen", "esquema"]);
    hoja.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#f3f4f6");
  }
  return hoja;
}

function getHojaBancoRespuestas(libro) {
  const ss = (libro && typeof libro.getSheetByName === "function") ? libro : getLibro();
  let hoja = ss.getSheetByName(HOJA_BANCO_RESPUESTAS);
  if (!hoja) {
    hoja = ss.insertSheet(HOJA_BANCO_RESPUESTAS);
    hoja.appendRow(["id_encuesta", "fecha", "origen", "respuestas_json"]);
    hoja.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#f3f4f6");
  }
  return hoja;
}

// Resumen legible: hasta 6 preguntas de opción con sus 3 opciones más frecuentes
function resumenBanco_(preguntas, filas) {
  const lineas = [];
  preguntas
    .filter(p => p.activa && ["unica", "multiple", "sino", "escala"].indexOf(p.tipo) !== -1)
    .slice(0, 6)
    .forEach(p => {
      const cuenta = {};
      let base = 0;
      filas.forEach(f => {
        const v = f.respuestas ? f.respuestas[p.id] : null;
        if (v == null || String(v).trim() === "") return;
        const valores = p.tipo === "multiple" ? String(v).split(";").map(s => s.trim()).filter(Boolean) : [String(v)];
        valores.forEach(x => { cuenta[x] = (cuenta[x] || 0) + 1; base++; });
      });
      const tops = Object.keys(cuenta).sort((a, b) => cuenta[b] - cuenta[a]).slice(0, 3);
      if (!tops.length) return;
      lineas.push("• " + p.etiqueta + ": " + tops.map(k => k + " " + (Math.round((cuenta[k] / (base || 1)) * 1000) / 10) + "%").join(" · "));
    });
  return lineas.join("\n");
}

function guardarEnBanco(credenciales) {
  if (!verificarAdmin(credenciales).autenticado) return { exito: false, mensaje: "Sesión no válida." };
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return { exito: false, mensaje: "El sistema está ocupado. Intenta de nuevo." };
  try {
    const datos = obtenerRespuestasFormulario(credenciales);
    if (!datos.autenticado) return { exito: false, mensaje: "Sesión no válida." };
    const filas = datos.filas || [];
    const activas = (datos.preguntas || []).filter(p => p.activa);
    const id = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss");
    const resumen = resumenBanco_(datos.preguntas || [], filas);

    getHojaBanco().appendRow([
      id,
      new Date(),
      String((datos.config && datos.config.titulo) || "Encuesta"),
      filas.length,
      activas.length,
      resumen,
      JSON.stringify({ config: datos.config, preguntas: datos.preguntas })
    ]);

    const hojaResp = getHojaBancoRespuestas();
    const cuerpo = filas.map(f => [id, f.fecha || "", f.origen || "Real", JSON.stringify(f.respuestas || {})]);
    if (cuerpo.length) hojaResp.getRange(hojaResp.getLastRow() + 1, 1, cuerpo.length, 4).setValues(cuerpo);
    return { exito: true, id: id, total: filas.length, resumen: resumen };
  } catch (error) {
    console.error("guardarEnBanco: " + (error && error.stack ? error.stack : error));
    return { exito: false, mensaje: "No se pudo guardar en el banco." };
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

// Devuelve una cadena JSON (el panel la parsea) con la lista de encuestas guardadas
function listarBanco(credenciales) {
  try {
    if (!verificarAdmin(credenciales).autenticado) return JSON.stringify({ exito: false, mensaje: "Sesión no válida." });
    const hoja = getHojaBanco();
    const vals = hoja.getDataRange().getValues();
    const items = [];
    for (let i = 1; i < vals.length; i++) {
      const f = vals[i];
      if (!f[0]) continue;
      let fecha = "";
      try { fecha = Utilities.formatDate(new Date(f[1]), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm"); } catch (e) { fecha = String(f[1] || ""); }
      items.push({
        id: String(f[0]),
        guardado: fecha,
        encuesta: String(f[2] || "Encuesta"),
        respuestas: Number(f[3]) || 0,
        preguntas: Number(f[4]) || 0,
        resumen: String(f[5] || "")
      });
    }
    items.reverse();
    return JSON.stringify({ exito: true, items: items });
  } catch (error) {
    console.error("listarBanco: " + error);
    return JSON.stringify({ exito: false, mensaje: "No se pudo leer el banco de encuestas." });
  }
}

// Devuelve una cadena JSON con { config, preguntas, filas } de una encuesta guardada
function obtenerDelBanco(credenciales, id) {
  try {
    if (!verificarAdmin(credenciales).autenticado) return JSON.stringify({ exito: false, mensaje: "Sesión no válida." });
    const objetivo = String(id || "").trim();
    if (!objetivo) return JSON.stringify({ exito: false, mensaje: "Falta el identificador de la encuesta." });

    const vals = getHojaBanco().getDataRange().getValues();
    let esquema = null;
    for (let i = 1; i < vals.length; i++) {
      if (String(vals[i][0]) === objetivo) { esquema = String(vals[i][6] || ""); break; }
    }
    if (!esquema) return JSON.stringify({ exito: false, mensaje: "Esa encuesta ya no está en el banco." });

    const datos = JSON.parse(esquema) || {};
    const filas = [];
    const filasHoja = getHojaBancoRespuestas().getDataRange().getValues();
    for (let i = 1; i < filasHoja.length; i++) {
      if (String(filasHoja[i][0]) !== objetivo) continue;
      let respuestas = {};
      try { respuestas = JSON.parse(filasHoja[i][3] || "{}") || {}; } catch (e) { respuestas = {}; }
      filas.push({ fecha: String(filasHoja[i][1] || ""), origen: String(filasHoja[i][2] || "Real"), respuestas: respuestas });
    }
    return JSON.stringify({ exito: true, id: objetivo, config: datos.config || {}, preguntas: datos.preguntas || [], filas: filas });
  } catch (error) {
    console.error("obtenerDelBanco: " + error);
    return JSON.stringify({ exito: false, mensaje: "No se pudo abrir la encuesta del banco." });
  }
}

// --------------------------------------------------------
// Rutas
// --------------------------------------------------------