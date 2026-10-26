/**********************************************************************
 * PLATAFORMA DE COMPRENSIÓN LECTORA — SECUNDARIA TÉCNICA 90
 * Backend (Google Apps Script)
 **********************************************************************/

const URL_BASE_DEEPSEEK = "https://api.deepseek.com/chat/completions";
const NOMBRE_ESCUELA = "Secundaria Técnica 90";
const VERSION_APP = "v303";
const CLAVE_ADMIN_DEFAULT = "admin-dev";
const USUARIO_ADMIN_ASISTENCIA = "admin";
const URL_SITIO_ALUMNO_DEFAULT = "https://sites.google.com/view/lec90/alumno";
const URL_SITIO_DOCENTE_DEFAULT = "https://sites.google.com/view/lec90/docente";
/** Despliegue dedicado para incrustar asistencia en Google Sites (lec90). */
const ID_DEPLOY_ASISTENCIA = "AKfycbwYr2eeYCG7o0fKe1pJr70ljjXsXaA4RUtoM07RdSjtrU0_DTOjOIpG19GIbYtknxWGUg";
/** Despliegue dedicado para clase hablada (alumno invidente / maestros). */
const ID_DEPLOY_CLASE = "AKfycbzPQDTjMqHGpSfBg3KMrDBpxSweOAk2x5adcMLJ4aJHvM2ETGtGI-rm1bz3aDRxj-FAgQ";

const ASIGNATURAS_DEFAULT = [
  "Español",
  "Historia",
  "Ciencias",
  "Formación Cívica y Ética",
  "Tecnología",
  "Matemáticas"
];

const ESPECIFICACIONES_GRADO = {
  "1": {
    palabrasMin: 400, palabrasMax: 600, objetivoPalabras: 500,
    ppmMin: 135, ppmMax: 145, ppmObjetivo: 140,
    preguntasMin: 5, preguntasMax: 7, objetivoPreguntas: 6,
    tipo: "narrativo (cuentos, fragmentos de novela de aventura, infografías)",
    enfoque: "retención literal: qué pasó, quién, dónde y secuencia",
    gramatica: "oraciones lineales, sin subordinadas densas"
  },
  "2": {
    palabrasMin: 600, palabrasMax: 800, objetivoPalabras: 700,
    ppmMin: 145, ppmMax: 155, ppmObjetivo: 150,
    preguntasMin: 7, preguntasMax: 10, objetivoPreguntas: 8,
    tipo: "expositivo (artículos de divulgación científica, reportajes)",
    enfoque: "inferencia lógica: causa-efecto, idea principal",
    gramatica: "nexos subordinados y vocabulario técnico moderado"
  },
  "3": {
    palabrasMin: 800, palabrasMax: 1000, objetivoPalabras: 850,
    ppmMin: 155, ppmMax: 160, ppmObjetivo: 158,
    preguntasMin: 10, preguntasMax: 12, objetivoPreguntas: 11,
    tipo: "argumentativo (ensayos cortos, columnas de opinión, textos legales simples)",
    enfoque: "postura crítica: propósito del autor, sesgo y evaluación de afirmaciones",
    gramatica: "abstracción conceptual y argumentación"
  }
};

const PESO_COMPRENSION = 0.7; // 70 %
const PESO_VELOCIDAD = 0.3;   // 30 %

const ENCABEZADOS = {
  Alumnos: ["Matrícula", "Nombre Completo", "Grado", "Grupo", "Activo", "Intentos extra"],
  Grupos: ["Grado", "Grupo", "Activo", "Intentos extra", "Turno"],
  Prefectos: ["Id", "Nombre", "Usuario", "Salt", "Hash", "Activo", "Clave"],
  PrefectoGrupos: ["Id prefecto", "Grado", "Grupo", "Turno"],
  Horarios: ["Id", "Dia", "Turno", "Bloque", "Hora inicio", "Hora fin", "Grado", "Grupo", "Maestro", "Asignatura", "Salon"],
  MaestrosClase: ["Id", "Nombre", "Usuario", "Salt", "Hash", "Activo", "Clave"],
  AccesoClaseAlumnos: ["Matrícula", "Nombre", "Grado", "Grupo", "Usuario", "Salt", "Hash", "Activo", "Clave"],
  PersonalApoyo: ["Id", "Nombre", "Usuario", "Área", "Salt", "Hash", "Activo", "Clave"],
  ContenidosClase: ["Id", "Id horario", "Maestro", "Asignatura", "Grado", "Grupo", "Dia", "Bloque", "Fecha", "Titulo", "Texto", "UrlAudio", "Publicado", "Timestamp"],
  AsistenciaAlumnos: ["Fecha", "Turno", "Grado", "Grupo", "Matrícula", "Nombre", "Estado", "Prefecto", "Timestamp", "Observación"],
  AsistenciaMaestros: ["Fecha", "Turno", "Bloque", "Id horario", "Maestro", "Grado", "Grupo", "Asignatura", "Estado", "Prefecto", "Timestamp", "Observación"],
  Lecturas: ["ID Lectura", "Grado", "Asignatura", "Tema", "Texto", "Palabras", "Preguntas JSON", "Activa", "Origen"],
  Preguntas: ["ID Lectura", "Orden", "Enunciado", "Opción 1", "Opción 2", "Opción 3", "Opción 4", "Opción 5", "Opción 6", "Respuesta correcta", "Nivel"],
  Resultados: [
    "Marca Temporal",
    "Escuela",
    "Matrícula",
    "Nombre Estudiante",
    "Grado",
    "Grupo",
    "Género",
    "Asignatura",
    "Tema",
    "ID Lectura",
    "Tiempo Lectura (s)",
    "Tiempo Reactivos (s)",
    "Tiempo Total (s)",
    "Segundos por pregunta",
    "Aciertos",
    "Calificación comprensión (%)",
    "PPM",
    "Nivel PPM",
    "Calificación global (%)",
    "Intento",
    "PME",
    "Relecturas",
    "Desglose niveles",
    "Recomendación",
    "Modo",
    "Trimestre",
    "Token Examen"
  ],
  Config: ["Clave", "Valor"]
};

/**********************************************************************
 * LIBRO Y CONEXIÓN A GOOGLE SHEETS
 **********************************************************************/
const ID_HOJA_DEFAULT = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
const URL_HOJA_DEFAULT = "https://docs.google.com/spreadsheets/d/1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU/edit";
let ultimoErrorAperturaLibro = "";
let memoLibro_ = null;
let memoAlumnos_ = null;
let memoResultados_ = null;
let memoLecturasIdx_ = null;
let memoConfig_ = null;
let memoGrupos_ = null;

function cacheGetJson_(clave) {
  try {
    const t = CacheService.getScriptCache().get(clave);
    if (!t) return null;
    return JSON.parse(t);
  } catch (e) {
    return null;
  }
}

function cachePutJson_(clave, obj, segundos) {
  try {
    CacheService.getScriptCache().put(clave, JSON.stringify(obj), segundos || 180);
  } catch (e) {}
}

function invalidarCachesDatos_() {
  memoAlumnos_ = null;
  memoResultados_ = null;
  memoLecturasIdx_ = null;
  memoConfig_ = null;
  memoGrupos_ = null;
  try {
    const c = CacheService.getScriptCache();
    const keys = ["alumnos_resumen", "resultados_idx", "lecturas_idx", "cfg_mapa", "grupos_idx"];
    for (let i = 0; i < 40; i++) keys.push("res_p_" + i);
    c.removeAll(keys);
  } catch (e) {}
}

function obtenerLibro() {
  const props = PropertiesService.getScriptProperties();
  const entorno = String(props.getProperty("ENTORNO") || "").trim().toUpperCase();
  const idConfig = String(props.getProperty("HOJA_ID") || "").trim();
  ultimoErrorAperturaLibro = "";

  const ID_PRODUCCION = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";

  if (entorno !== "PRUEBAS" && entorno !== "PRODUCCION") {
    memoLibro_ = null;
    ultimoErrorAperturaLibro = "ENTORNO no configurado o desconocido (" + entorno + "). Debe ser 'PRUEBAS' o 'PRODUCCION'.";
    Logger.log("BLOQUEO DE SEGURIDAD: " + ultimoErrorAperturaLibro);
    return null;
  }

  if (!idConfig) {
    memoLibro_ = null;
    ultimoErrorAperturaLibro = "HOJA_ID no configurado en ScriptProperties para el entorno " + entorno + ".";
    Logger.log("BLOQUEO DE SEGURIDAD: " + ultimoErrorAperturaLibro);
    return null;
  }

  if (entorno === "PRUEBAS" && idConfig === ID_PRODUCCION) {
    memoLibro_ = null;
    ultimoErrorAperturaLibro = "Violación de entorno: se intentó abrir el libro de producción (" + ID_PRODUCCION + ") en entorno de PRUEBAS.";
    Logger.log("BLOQUEO DE SEGURIDAD: " + ultimoErrorAperturaLibro);
    return null;
  }

  if (memoLibro_) {
    try {
      const memoId = typeof memoLibro_.getId === "function" ? String(memoLibro_.getId() || "").trim() : "";
      if (memoId === idConfig) {
        return memoLibro_;
      }
    } catch (eMemo) {}
    memoLibro_ = null;
  }

  try {
    const libroAbierto = SpreadsheetApp.openById(idConfig);
    if (libroAbierto) {
      memoLibro_ = libroAbierto;
      return libroAbierto;
    }
  } catch (e) {
    ultimoErrorAperturaLibro = "Error accediendo a la hoja (" + idConfig + "): " + e.message;
    Logger.log(ultimoErrorAperturaLibro);
  }

  return null;
}

function vincularHojaCalculo(token, idOUrl) {
  exigirAdmin(token);
  if (!idOUrl) throw new Error("Ingresa la URL o el ID de la hoja de cálculo de Google.");

  const props = PropertiesService.getScriptProperties();
  const entorno = String(props.getProperty("ENTORNO") || "").trim().toUpperCase();
  if (entorno !== "PRUEBAS" && entorno !== "PRODUCCION") {
    throw new Error("No se puede vincular hoja: ENTORNO no configurado o desconocido ('" + entorno + "'). Configure ENTORNO en ScriptProperties.");
  }

  let id = String(idOUrl).trim();
  const match = id.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match) id = match[1];

  const ID_PRODUCCION = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  if (entorno === "PRUEBAS" && id === ID_PRODUCCION) {
    throw new Error("Violación de política de seguridad: no se permite vincular el libro de producción en entorno de PRUEBAS.");
  }

  try {
    const libro = SpreadsheetApp.openById(id);
    if (!libro) throw new Error("No se pudo acceder a la hoja con ID: " + id);

    memoLibro_ = null;
    invalidarCachesDatos_();
    props.setProperty("HOJA_ID", id);
    const cache = CacheService.getScriptCache();
    cache.remove("setup_ok");
    memoLibro_ = libro;

    return {
      ok: true,
      mensaje: "Hoja de cálculo vinculada con éxito: \"" + libro.getName() + "\"",
      url: libro.getUrl(),
      id: id
    };
  } catch (e) {
    throw new Error("No se pudo conectar con la hoja de Google: " + e.message + ". Verifica los permisos de acceso.");
  }
}

function obtenerPestana(nombre) {
  const libro = obtenerLibro();
  if (!libro) return null;
  let p = libro.getSheetByName(nombre);
  if (p) return p;

  const hojas = libro.getSheets();
  const nomBuscado = String(nombre).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  for (let i = 0; i < hojas.length; i++) {
    const hNorm = hojas[i].getName().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    if (hNorm === nomBuscado) return hojas[i];
  }

  if (nomBuscado === "alumnos") {
    for (let i = 0; i < hojas.length; i++) {
      const hNorm = hojas[i].getName().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
      if (hNorm.indexOf("alumno") >= 0 || hNorm.indexOf("matricula") >= 0 || hNorm.indexOf("estudiante") >= 0) {
        return hojas[i];
      }
    }
  }

  if (nomBuscado === "lecturas") {
    for (let i = 0; i < hojas.length; i++) {
      const hNorm = hojas[i].getName().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
      if (hNorm.indexOf("lectura") >= 0 || hNorm.indexOf("texto") >= 0) {
        return hojas[i];
      }
    }
  }

  if (nomBuscado === "preguntas") {
    for (let i = 0; i < hojas.length; i++) {
      const hNorm = hojas[i].getName().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
      if (hNorm.indexOf("pregunta") >= 0 || hNorm.indexOf("reactivo") >= 0) {
        return hojas[i];
      }
    }
  }

  if (nomBuscado === "resultados") {
    for (let i = 0; i < hojas.length; i++) {
      const hNorm = hojas[i].getName().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
      if (hNorm.indexOf("resultado") >= 0 || hNorm.indexOf("evaluaci") >= 0 || hNorm.indexOf("examen") >= 0) {
        return hojas[i];
      }
    }
  }

  return null;
}

/**********************************************************************
 * WEB APP
 **********************************************************************/
function doGet(e) {
  const p = (e && e.parameter) || {};
  const accionSim = String(p.accion || "").trim();
  if (accionSim) {
    if (String(p.clave || "") === "st90sim" || accionSim.toLowerCase().indexOf("sembrar") >= 0 || accionSim === "cargarSimulados" || accionSim === "repararResultados") {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "Acceso no autorizado: la ejecución de siembras o mutaciones vía web sin autenticación está estrictamente bloqueada." }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  try { asegurarSetup(); } catch (eSetup) {}
  
  const urlApp = ScriptApp.getService().getUrl();
  const urlSitioAlumno = urlSitioAlumno_();
  const urlSitioDocente = urlSitioDocente_();
  const identidad = identidadEscuela_();

  const pagina = String(p.pagina || p.p || p.modo || p.view || p.modulo || "").toLowerCase().trim();
  const esEstilo = pagina === "estilo" || pagina === "ui" || pagina === "guia-ui" || pagina === "estiloui";
  const esAdmin = pagina === "admin" || pagina === "administracion" || pagina === "administrador";
  const esDocente = pagina === "docente" || pagina === "docentes" || pagina === "maestro" || pagina === "maestros";
  const esAsistencia = esVistaAsistencia_(p, urlApp);
  const esClase = esVistaClase_(p, urlApp);
  const esAlumno = pagina === "alumno" || pagina === "estudiante" || !!p.mat;
  const esPortal = !pagina || pagina === "login" || pagina === "portal" || pagina === "inicio";

  if (esEstilo) {
    return HtmlService.createHtmlOutputFromFile("EstiloUiSt90")
      .setTitle("Estilo UI ST90 · " + VERSION_APP)
      .addMetaTag("viewport", "width=device-width, initial-scale=1")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  if (esClase) {
    const tClase = HtmlService.createTemplateFromFile("Clase");
    tClase.urlBase = urlApp;
    tClase.urlAdmin = urlAdminPub();
    tClase.urlDocente = urlDocentePub();
    tClase.urlAlumno = urlApp + "?pagina=alumno";
    tClase.urlSitioAlumno = urlSitioAlumno;
    tClase.urlSitioDocente = urlSitioDocente;
    tClase.urlAsistencia = urlAsistenciaPub();
    tClase.urlClase = urlClasePub();
    tClase.version = VERSION_APP;
    tClase.escuela = identidad.nombre;
    tClase.modoClase = esVistaClaseMaestro_(p) ? "maestro" : "alumno";
    return tClase.evaluate()
      .setTitle((esVistaClaseMaestro_(p) ? "Clase · Maestro" : "Clase hablada") + " · " + identidad.nombre + " · " + VERSION_APP)
      .addMetaTag("viewport", "width=device-width, initial-scale=1")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  if (esAdmin) {
    return evaluarPlantillaAdmin_(urlApp, identidad, "admin", false, "Administración");
  }

  if (esDocente) {
    return evaluarPlantillaAdmin_(urlApp, identidad, "docente", false, "Panel Docente");
  }

  if (esAsistencia) {
    return evaluarPlantillaAdmin_(urlApp, identidad, "asistencia", true, "Asistencia");
  }

  if (esAlumno) {
    const tInterfaz = HtmlService.createTemplateFromFile("Interfaz");
    tInterfaz.urlBase = urlApp;
    tInterfaz.urlAdmin = urlAdminPub();
    tInterfaz.urlDocente = urlDocentePub();
    tInterfaz.urlAlumno = urlAlumnoPub();
    tInterfaz.urlSitioAlumno = urlSitioAlumno;
    tInterfaz.urlSitioDocente = urlSitioDocente;
    tInterfaz.urlAsistencia = urlAsistenciaPub();
    tInterfaz.version = VERSION_APP;
    tInterfaz.escuela = identidad.nombre;
    tInterfaz.pieLectura = identidad.pie;
    tInterfaz.logoEscuela = identidad.logo;
    const matParam = String(p.mat || p.matricula || p.u || p.usuario || "").trim();
    const tokenParam = String(p.token || p.t || "").trim();
    let matAuto = "";
    let tokenAuto = "";
    let alumnoAuto = null;
    let cupoAuto = null;
    if (matParam && tokenParam) {
      try {
        const ses = obtenerSesionValida_(tokenParam);
        if (ses && String(ses.rol || "").toLowerCase() === "alumno" && String(ses.matricula || "").trim().toLowerCase() === matParam.toLowerCase()) {
          const alu = buscarAlumno(matParam);
          if (alu) {
            matAuto = String(alu["Matrícula"]);
            tokenAuto = tokenParam;
            alumnoAuto = {
              matricula: matAuto,
              nombre: String(alu["Nombre Completo"]),
              grado: String(alu["Grado"]),
              grupo: String(alu["Grupo"])
            };
            try {
              cupoAuto = consultarCupoAlumno(matAuto);
            } catch (eCupo) {}
          }
        }
      } catch (eAlu) {}
    }
    tInterfaz.matAuto = matAuto;
    tInterfaz.tokenAuto = tokenAuto;
    tInterfaz.alumnoAutoJson = JSON.stringify(alumnoAuto);
    tInterfaz.cupoAutoJson = JSON.stringify(cupoAuto);
    let trimestreJson = "null";
    try { trimestreJson = JSON.stringify(infoTrimestreActual()); } catch (eT) {}
    tInterfaz.trimestreJson = trimestreJson;
    return tInterfaz.evaluate()
      .setTitle("Comprensión Lectora · " + identidad.nombre + " · " + VERSION_APP)
      .addMetaTag("viewport", "width=device-width, initial-scale=1")
      .addMetaTag("referrer", "no-referrer")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  return evaluarPlantillaAdmin_(urlApp, identidad, "portal", false, "Portal Escolar Unificado");
}

function rellenarPlantillaAdmin_(t, urlApp, identidad, modoVista, soloAsistencia) {
  t.urlBase = urlApp;
  t.urlAdmin = urlAdminPub();
  t.urlDocente = urlDocentePub();
  t.urlAlumno = urlAlumnoPub();
  t.urlSitioAlumno = urlSitioAlumno_();
  t.urlSitioDocente = urlSitioDocente_();
  t.urlAsistencia = urlAsistenciaPub();
  t.version = VERSION_APP;
  t.escuela = identidad.nombre;
  t.modoVista = modoVista;
  t.soloAsistencia = !!soloAsistencia;
  return t;
}

function evaluarPlantillaAdmin_(urlApp, identidad, modoVista, soloAsistencia, titulo) {
  const t = HtmlService.createTemplateFromFile("Admin");
  rellenarPlantillaAdmin_(t, urlApp, identidad, modoVista, soloAsistencia);
  return t.evaluate()
    .setTitle(titulo + " · " + identidad.nombre + " · " + VERSION_APP)
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(nombre) {
  return HtmlService.createHtmlOutputFromFile(nombre).getContent();
}

/**********************************************************************
 * SETUP (con caché corto)
 **********************************************************************/
function asegurarSetup() {
  const cache = CacheService.getScriptCache();
  if (cache.get("setup_ok") === "1") return { ok: true, cached: true };

  const libro = obtenerLibro();
  if (!libro) return { ok: false, error: "Libro no accesible" };

  const faltantes = [];
  Object.keys(ENCABEZADOS).forEach(function (nombre) {
    if (!libro.getSheetByName(nombre)) {
      faltantes.push(nombre);
    }
  });

  if (faltantes.length > 0) {
    Logger.log("asegurarSetup: pestañas faltantes en el libro: " + faltantes.join(", "));
    return { ok: false, faltantes: faltantes };
  }

  cache.put("setup_ok", "1", 21600);
  return { ok: true };
}

function verificarYCrearPestanas() {
  const libro = obtenerLibro();
  if (!libro) return;
  let creo = false;
  Object.keys(ENCABEZADOS).forEach(function (nombre) {
    let p = libro.getSheetByName(nombre);
    if (!p) {
      p = libro.insertSheet(nombre);
      p.appendRow(ENCABEZADOS[nombre]);
      p.getRange(1, 1, 1, ENCABEZADOS[nombre].length).setFontWeight("bold");
      creo = true;
    }
  });
  migrarLecturasSiEsAntiguo();
  migrarAlumnosSiEsAntiguo();
  repararResultadosSiEsNecesario();
  asegurarConfig();
  asegurarColumnaIntentosGrupo();
  asegurarColumnaTurnoGrupo();
  asegurarColumnaNivelPreguntas();
  asegurarColumnaObservacionAsi_();
  asegurarColumnaUsuarioPrefectos_();
  asegurarColumnaClavePrefectos_();
  asegurarColumnaClaveAccesoClase_();
  if (creo) formatearHojasDeLectura();
}

function migrarLecturasSiEsAntiguo() {
  const libro = obtenerLibro();
  if (!libro) return;
  const p = libro.getSheetByName("Lecturas");
  if (!p) return;
  const lastCol = Math.max(p.getLastColumn(), 1);
  const enc = p.getRange(1, 1, 1, lastCol).getValues()[0];
  const col1 = String(enc[0] || "").trim();
  
  if (col1 !== ENCABEZADOS.Lecturas[0]) {
    Logger.log("migrarLecturasSiEsAntiguo: estructura de encabezado desconocida (" + col1 + "). Migración detenida sin modificar datos.");
    return;
  }
  
  if (p.getLastRow() >= 2) {
    const filas = leerFilas("Lecturas");
    if (!filas || filas.length === 0) {
      Logger.log("migrarLecturasSiEsAntiguo: no se pudieron interpretar las filas existentes en Lecturas. Operación cancelada.");
      return;
    }
    const validas = filas.filter(function (l) {
      const id = String(l["ID Lectura"] || "").trim();
      const asig = String(l["Asignatura"] || "").trim();
      const tema = String(l["Tema"] || "").trim();
      const grado = String(l["Grado"] || "").trim();
      return id && asig && tema && grado;
    });
    if (validas.length === 0) {
      Logger.log("migrarLecturasSiEsAntiguo: datos ambiguos o ninguna fila reconocida en Lecturas (" + filas.length + " filas existentes). Se conservan los registros existentes sin modificaciones.");
      return;
    }
    const needCols = ENCABEZADOS.Lecturas.length;
    if (p.getMaxColumns() < needCols) {
      p.insertColumnsAfter(p.getMaxColumns(), needCols - p.getMaxColumns());
      p.getRange(1, 1, 1, needCols).setValues([ENCABEZADOS.Lecturas]).setFontWeight("bold");
    }
  } else {
    completarBancoLecturas_(false);
  }
}

function migrarAlumnosSiEsAntiguo() {
  const libro = obtenerLibro();
  if (!libro) return;
  const p = libro.getSheetByName("Alumnos");
  if (!p || p.getLastRow() < 1) return;
  const enc = p.getRange(1, 1, 1, Math.max(p.getLastColumn(), 1)).getValues()[0];
  if (enc[2] && String(enc[2]).toLowerCase().indexOf("grupo") >= 0 && enc[3] !== "Grupo") {
    const datos = p.getDataRange().getValues();
    const filas = [ENCABEZADOS.Alumnos];
    for (let i = 1; i < datos.length; i++) {
      const mat = datos[i][0], nom = datos[i][1];
      const grupo = String(datos[i][2] || "").trim().toLowerCase();
      if (!nom) continue;
      const grado = grupo.charAt(0) || "1";
      filas.push([mat, nom, grado, grupo, "SI", 0]);
    }
    p.clearContents();
    p.getRange(1, 1, filas.length, ENCABEZADOS.Alumnos.length).setValues(filas);
    p.getRange(1, 1, 1, ENCABEZADOS.Alumnos.length).setFontWeight("bold");
  }
}

function repararResultadosSiEsNecesario() {
  return unificarEstructuraResultados();
}

function unificarEstructuraResultados() {
  const libro = obtenerLibro();
  if (!libro) return { ok: false, mensaje: "No se pudo abrir la hoja de cálculo." };
  let p = libro.getSheetByName("Resultados");
  if (!p) {
    p = libro.insertSheet("Resultados");
    p.appendRow(ENCABEZADOS.Resultados);
    p.getRange(1, 1, 1, ENCABEZADOS.Resultados.length).setFontWeight("bold");
    p.setFrozenRows(1);
    return { ok: true, mensaje: "Hoja Resultados creada con encabezados unificados." };
  }

  const lastRow = p.getLastRow();
  const lastCol = Math.max(p.getLastColumn(), 1);
  const encActual = p.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) { return String(h || "").trim(); });

  const encUnificados = ENCABEZADOS.Resultados;
  const encSet = {};
  encActual.forEach(function (h) { if (h) encSet[h] = true; });
  const faltan = encUnificados.filter(function (h) { return !encSet[h]; });
  if (!faltan.length) {
    return { ok: true, mensaje: "Resultados ya unificados.", filas: Math.max(0, lastRow - 1) };
  }

  const baseVieja = encUnificados.slice(0, 20);
  const extrasNuevos = encUnificados.slice(20);
  const soloFaltanExtras = faltan.every(function (h) { return extrasNuevos.indexOf(h) >= 0; }) &&
    baseVieja.every(function (h, i) { return encActual[i] === h; });
  if (soloFaltanExtras) {
    extrasNuevos.forEach(function (h) {
      if (encActual.indexOf(h) < 0) {
        p.getRange(1, encActual.length + 1).setValue(h).setFontWeight("bold");
        encActual.push(h);
      }
    });
    SpreadsheetApp.flush();
    return { ok: true, mensaje: "Columnas pedagógicas agregadas a Resultados.", filas: Math.max(0, lastRow - 1) };
  }

  const nuevasFilas = [];

  if (lastRow >= 2) {
    const valores = p.getRange(2, 1, lastRow - 1, lastCol).getValues();
    for (let i = 0; i < valores.length; i++) {
      const row = valores[i];
      const mapa = {};
      encActual.forEach(function (h, c) { if (h) mapa[h] = row[c]; });

      // Detectar si fue una fila corrida histórica (posicional antigua)
      const valEscuela = String(mapa["Escuela"] || "").trim();
      const valGen = String(mapa["Género"] || "").trim();
      const valIdLec = String(mapa["ID Lectura"] || "").trim();
      const esCorrida = (valEscuela && !/secundaria|técnica|tecnica|escuela/i.test(valEscuela) && /^[a-z0-9_-]+$/i.test(valEscuela)) &&
                        (valGen && /^[123][a-z]$/i.test(valGen)) &&
                        (valIdLec && /español|historia|ciencias|formación|tecnología|matemáticas/i.test(valIdLec));

      let fFecha, fEscuela, fMat, fNom, fGrado, fGrupo, fGenero, fAsig, fTema, fId;
      let fTLec, fTReac, fTTot, fSeg, fAc, fComp, fPpm, fNivel, fGlob, fInt;
      let fPme = "", fRelec = "", fDesg = "", fRec = "";

      if (esCorrida) {
        fFecha = row[0];
        fEscuela = nombreEscuela_();
        fMat = row[1];
        fNom = row[2];
        fGrado = row[3];
        fGrupo = row[4];
        fGenero = "";
        fAsig = row[5];
        fTema = row[6];
        fId = row[7];
        fTLec = row[8];
        fTReac = row[9];
        fTTot = row[10];
        fSeg = row[11];
        fAc = row[12];
        fComp = row[13];
        fPpm = row[14];
        fNivel = row[15];
        fGlob = row[16];
        fInt = row[17] || 1;
      } else {
        fFecha = valorColumna(mapa, ["Marca Temporal", "Fecha"]);
        fEscuela = valorColumna(mapa, ["Escuela"]) || nombreEscuela_();
        fMat = valorColumna(mapa, ["Matrícula", "Matricula"]);
        fNom = valorColumna(mapa, ["Nombre Estudiante", "Nombre Completo", "Nombre", "Alumno", "Estudiante"]);
        fGrado = valorColumna(mapa, ["Grado"]);
        fGrupo = valorColumna(mapa, ["Grupo", "Grupo/Grado"]);
        fGenero = valorColumna(mapa, ["Género", "Genero"]);
        fAsig = valorColumna(mapa, ["Asignatura"]);
        fTema = valorColumna(mapa, ["Tema"]);
        fId = valorColumna(mapa, ["ID Lectura", "Id Lectura", "ID"]);
        fTLec = valorColumna(mapa, ["Tiempo Lectura (s)", "T lectura (s)"]);
        fSeg = valorColumna(mapa, ["Segundos por pregunta"]);
        fTReac = valorColumna(mapa, ["Tiempo Reactivos (s)", "Tiempo reactivos (s)", "T reactivos (s)", "Tiempo reactivos"]);
        if ((fTReac === "" || fTReac == null || Number(fTReac) === 0) && fSeg) {
          try {
            const arrSeg = JSON.parse(fSeg);
            if (Array.isArray(arrSeg) && arrSeg.length && typeof arrSeg[0] === "number") {
              fTReac = arrSeg.reduce(function(acc, x) { return acc + (Number(x) || 0); }, 0);
            }
          } catch (eSeg) {}
        }
        fTTot = valorColumna(mapa, ["Tiempo Total (s)", "Tiempo total (s)", "T total (s)", "Tiempo Total"]) || (Number(fTLec || 0) + Number(fTReac || 0));
        fAc = valorColumna(mapa, ["Aciertos"]);
        fComp = valorColumna(mapa, ["Calificación comprensión (%)", "Calificación (%)", "Calificacion", "Calificación"]);
        fPpm = valorColumna(mapa, ["PPM"]);
        fNivel = valorColumna(mapa, ["Nivel PPM"]);
        fGlob = valorColumna(mapa, ["Calificación global (%)", "Global (%)"]);
        fInt = valorColumna(mapa, ["Intento"]) || 1;
        fPme = valorColumna(mapa, ["PME"]);
        fRelec = valorColumna(mapa, ["Relecturas"]);
        fDesg = valorColumna(mapa, ["Desglose niveles"]);
        fRec = valorColumna(mapa, ["Recomendación"]);
      }

      if (!fId || String(fId).trim() === "") {
        fId = buscarIdLecturaPorTema_(fGrado, fAsig, fTema, fInt);
      }

      nuevasFilas.push([
        fFecha, fEscuela, fMat, fNom, fGrado, fGrupo, fGenero,
        fAsig, fTema, fId, fTLec, fTReac, fTTot, fSeg, fAc,
        fComp, fPpm, fNivel, fGlob, fInt, fPme, fRelec, fDesg, fRec
      ]);
    }
  }

  p.clearContents();
  const maxCols = p.getMaxColumns();
  if (maxCols > encUnificados.length) {
    try { p.deleteColumns(encUnificados.length + 1, maxCols - encUnificados.length); } catch (eCols) {}
  }

  p.getRange(1, 1, 1, encUnificados.length).setValues([encUnificados]);
  p.getRange(1, 1, 1, encUnificados.length).setFontWeight("bold");

  if (nuevasFilas.length) {
    p.getRange(2, 1, nuevasFilas.length, encUnificados.length).setValues(nuevasFilas);
  }
  p.setFrozenRows(1);
  SpreadsheetApp.flush();

  return { ok: true, mensaje: "Hoja Resultados unificada con las columnas pedagógicas.", filas: nuevasFilas.length };
}

function repararResultadosAdmin(token) {
  exigirAdmin(token);
  return unificarEstructuraResultados();
}

function buscarIdLecturaPorTema_(grado, asig, tema, intento) {
  const g = String(grado || "1").trim();
  const a = String(asig || "").trim().toLowerCase();
  const t = String(tema || "").trim().toLowerCase();
  const nInt = Number(intento || 1);

  if (t.indexOf("prueba ") >= 0 || t.indexOf("simulado") >= 0) {
    return "SIM_" + g + "_P" + nInt;
  }

  try {
    const lecs = leerFilas("Lecturas");
    for (let i = 0; i < lecs.length; i++) {
      const lTema = String(lecs[i]["Tema"] || "").trim().toLowerCase();
      const lGrado = String(lecs[i]["Grado"] || "").trim();
      if ((lTema === t || t.indexOf(lTema) >= 0 || lTema.indexOf(t) >= 0) && (!lGrado || lGrado === g)) {
        return String(lecs[i]["ID Lectura"] || "");
      }
    }
  } catch (e) {}

  return "BANCO_" + g + "_" + (asig || "Español").substring(0, 3) + "_" + (tema || "Lectura").substring(0, 10);
}

function asegurarConfig() {
  const libro = obtenerLibro();
  if (!libro) return;
  const p = libro.getSheetByName("Config");
  if (!p) return;
  if (p.getLastRow() < 2) {
    p.getRange(2, 1, 2, 2).setValues([
      ["INTENTOS_DEFAULT", "1"],
      ["ASIGNATURAS", ASIGNATURAS_DEFAULT.join("|")]
    ]);
  }
  if (!leerConfig("PPM_OBJETIVO", "")) {
    const base = {};
    Object.keys(ESPECIFICACIONES_GRADO).forEach(function (g) {
      base[g] = {
        ppmMin: ESPECIFICACIONES_GRADO[g].ppmMin,
        ppmMax: ESPECIFICACIONES_GRADO[g].ppmMax,
        ppmObjetivo: ESPECIFICACIONES_GRADO[g].ppmObjetivo
      };
    });
    escribirConfig_("PPM_OBJETIVO", JSON.stringify(base));
  }
  if (!leerConfig("LECTURAS_TRIMESTRALES", "")) {
    escribirConfig_("LECTURAS_TRIMESTRALES", JSON.stringify(cfgTrimestralPorDefecto_()));
  }
  const sitioAlumno = String(leerConfig("URL_SITIO_ALUMNO", "") || "").replace(/\?.*$/, "").replace(/\/+$/, "");
  const sitioDocente = String(leerConfig("URL_SITIO_DOCENTE", "") || "").replace(/\?.*$/, "").replace(/\/+$/, "");
  if (!sitioAlumno || sitioAlumno === "https://sites.google.com/view/lec90") {
    escribirConfig_("URL_SITIO_ALUMNO", URL_SITIO_ALUMNO_DEFAULT);
  }
  if (!sitioDocente || sitioDocente === "https://sites.google.com/view/lec90/docentes") {
    escribirConfig_("URL_SITIO_DOCENTE", URL_SITIO_DOCENTE_DEFAULT);
  }
}

function sanitizarUrlSitio_(url, respaldo) {
  const u = String(url || "").trim().replace(/\?.*$/, "").replace(/\/+$/, "");
  if (/^https:\/\/sites\.google\.com\/[^\s"'<>]+$/i.test(u)) {
    return u;
  }
  return String(respaldo || "");
}

function urlSitioAlumno_() {
  return sanitizarUrlSitio_(leerConfig("URL_SITIO_ALUMNO", ""), URL_SITIO_ALUMNO_DEFAULT);
}

function urlSitioDocente_() {
  return sanitizarUrlSitio_(leerConfig("URL_SITIO_DOCENTE", ""), URL_SITIO_DOCENTE_DEFAULT);
}

function nombreEscuela_() {
  const n = String(leerConfig("IDENTIDAD_NOMBRE", "") || "").trim();
  return n || NOMBRE_ESCUELA;
}

function pieLectura_() {
  const p = String(leerConfig("IDENTIDAD_PIE", "") || "").trim();
  return p || "Plan de Estudio NEM";
}

function logoEscuela_() {
  const l = String(leerConfig("IDENTIDAD_LOGO", "") || "").trim();
  if (l && /^data:image\/(png|jpe?g|webp);base64,/i.test(l) && l.length <= 50000) return l;
  return "";
}

function identidadEscuela_() {
  return { nombre: nombreEscuela_(), pie: pieLectura_(), logo: logoEscuela_() };
}

function sanitizarTextoIdentidad_(texto, maxLen) {
  return String(texto || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, maxLen || 80);
}

function guardarIdentidadEscuela(token, nombre, pie, logo) {
  exigirAdmin(token);
  const nom = sanitizarTextoIdentidad_(nombre, 80);
  const pieTxt = sanitizarTextoIdentidad_(pie, 140);
  if (!nom) throw new Error("Escribe el nombre de la escuela.");
  escribirConfig_("IDENTIDAD_NOMBRE", nom);
  escribirConfig_("IDENTIDAD_PIE", pieTxt || "Plan de Estudio NEM");
  if (logo === "" || logo == null) {
    escribirConfig_("IDENTIDAD_LOGO", "");
  } else if (typeof logo === "string") {
    const l = String(logo).trim();
    if (!/^data:image\/(png|jpe?g|webp);base64,/i.test(l)) {
      throw new Error("El logotipo debe ser una imagen PNG, JPG o WebP.");
    }
    if (l.length > 50000) {
      throw new Error("El logotipo es demasiado grande. Usa una imagen más liviana (se comprime sola al subirla).");
    }
    escribirConfig_("IDENTIDAD_LOGO", l);
  }
  return { ok: true, mensaje: "Identidad de la escuela guardada.", identidad: identidadEscuela_() };
}

function guardarUrlsSitio(token, urlAlumno, urlDocente) {
  exigirAdmin(token);
  const a = sanitizarUrlSitio_(urlAlumno, "");
  const d = sanitizarUrlSitio_(urlDocente, "");
  if (String(urlAlumno || "").trim() && !a) {
    throw new Error("El enlace de alumnos debe ser de sites.google.com.");
  }
  if (String(urlDocente || "").trim() && !d) {
    throw new Error("El enlace de docentes debe ser de sites.google.com.");
  }
  escribirConfig_("URL_SITIO_ALUMNO", a || URL_SITIO_ALUMNO_DEFAULT);
  escribirConfig_("URL_SITIO_DOCENTE", d || URL_SITIO_DOCENTE_DEFAULT);
  return { ok: true, mensaje: "Enlaces del sitio guardados.", urlSitioAlumno: urlSitioAlumno_(), urlSitioDocente: urlSitioDocente_() };
}

function asegurarColumnaIntentosGrupo() {
  const libro = obtenerLibro();
  if (!libro) return;
  const p = libro.getSheetByName("Grupos");
  if (!p) return;
  if (p.getLastColumn() < 4) {
    p.getRange(1, 4).setValue("Intentos extra").setFontWeight("bold");
  }
}

function asegurarColumnaTurnoGrupo() {
  const libro = obtenerLibro();
  if (!libro) return;
  const p = libro.getSheetByName("Grupos");
  if (!p) return;
  const lastCol = Math.max(p.getLastColumn(), 1);
  const enc = p.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) { return String(h || "").trim(); });
  if (enc.indexOf("Turno") >= 0) return;
  p.getRange(1, enc.length + 1).setValue("Turno").setFontWeight("bold");
}

function asegurarColumnaNivelPreguntas() {
  const libro = obtenerLibro();
  if (!libro) return;
  const p = libro.getSheetByName("Preguntas");
  if (!p) return;
  const lastCol = Math.max(p.getLastColumn(), 1);
  const enc = p.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) { return String(h || "").trim(); });
  if (enc[1] === "Nivel" && enc.indexOf("Orden") < 0) {
    p.getRange(1, 2).setValue("Orden").setFontWeight("bold");
    enc[1] = "Orden";
  }
  if (enc.indexOf("Nivel") >= 0) return;
  p.getRange(1, enc.length + 1).setValue("Nivel").setFontWeight("bold");
}

function mapaConfig_() {
  if (memoConfig_) return memoConfig_;
  const cacheados = cacheGetJson_("cfg_mapa");
  if (cacheados) {
    memoConfig_ = cacheados;
    return cacheados;
  }
  const mapa = {};
  const libro = obtenerLibro();
  if (!libro) return mapa;
  const p = libro.getSheetByName("Config");
  if (!p || p.getLastRow() < 2) return mapa;
  const datos = p.getRange(1, 1, p.getLastRow(), 2).getValues();
  for (let i = 1; i < datos.length; i++) {
    const k = String(datos[i][0] || "").trim();
    if (k) mapa[k] = String(datos[i][1] == null ? "" : datos[i][1]);
  }
  memoConfig_ = mapa;
  cachePutJson_("cfg_mapa", mapa, 300);
  return mapa;
}

function leerConfig(clave, respaldo) {
  const mapa = mapaConfig_();
  if (mapa && Object.prototype.hasOwnProperty.call(mapa, clave)) return mapa[clave];
  return respaldo;
}

function escribirConfig_(clave, valor) {
  const claveNorm = String(clave || "").trim().toUpperCase();
  if (!claveNorm) {
    throw new Error("Clave de configuración no válida.");
  }
  const CLAVES_RESTRINGIDAS = {
    "HOJA_ID": true,
    "ENTORNO": true,
    "ADMIN_HASH": true,
    "ADMIN_SALT": true,
    "CLAVE_ADMIN": true,
    "CLAVE_ADMIN_HASH": true,
    "CLAVE_ADMIN_SALT": true,
    "CLAVE_ADMIN_ES_DEFAULT": true,
    "URL_HOJA_CALCULO": true
  };
  if (CLAVES_RESTRINGIDAS[claveNorm]) {
    throw new Error("Acceso denegado: la clave de configuración '" + clave + "' es sensible y está estrictamente restringida.");
  }
  const libro = obtenerLibro();
  if (!libro) return;
  const p = libro.getSheetByName("Config");
  if (!p) return;
  const datos = p.getLastRow() >= 1 ? p.getRange(1, 1, p.getLastRow(), 2).getValues() : [["Clave", "Valor"]];
  for (let i = 1; i < datos.length; i++) {
    if (String(datos[i][0]) === clave) {
      p.getRange(i + 1, 2).setValue(valor);
      memoConfig_ = null;
      try { CacheService.getScriptCache().remove("cfg_mapa"); } catch (e) {}
      return;
    }
  }
  p.appendRow([clave, valor]);
  memoConfig_ = null;
  try { CacheService.getScriptCache().remove("cfg_mapa"); } catch (e2) {}
}

/**********************************************************************
 * SEGURIDAD ADMIN
 **********************************************************************/
function hashClave(clave, salt) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(clave) + "|" + String(salt),
    Utilities.Charset.UTF_8
  );
  return bytes.map(function (b) {
    return ('0' + (b & 0xFF).toString(16)).slice(-2);
  }).join("");
}

function obtenerCredencialesAdminAutoritativas_() {
  const props = PropertiesService.getScriptProperties();
  const hash = String(props.getProperty("CLAVE_ADMIN_HASH") || "").trim();
  const salt = String(props.getProperty("CLAVE_ADMIN_SALT") || "").trim();
  const esDef = String(props.getProperty("CLAVE_ADMIN_ES_DEFAULT") || "").trim();
  if (!hash || !salt) {
    return { configurada: false, hash: "", salt: "", esDefault: false };
  }
  return { configurada: true, hash: hash, salt: salt, esDefault: (esDef === "1") };
}

function claveEsDefault() {
  const creds = obtenerCredencialesAdminAutoritativas_();
  return creds.configurada ? creds.esDefault : false;
}

function esUsuarioAdminAsistencia_(usuario) {
  const n = normalizarNombrePref_(usuario);
  return n === USUARIO_ADMIN_ASISTENCIA || n === "administrador" || n === "administracion";
}

function iniciarSesionUnificada(usuario, clave, vistaSolicitada) {
  try { asegurarSetup(); } catch (eSetup) {}
  const usu = String(usuario || "").trim();
  const claveIngresada = String(clave || "").trim();
  const vista = String(vistaSolicitada || "").toLowerCase().trim();

  if (!claveIngresada) {
    return { ok: false, mensaje: "Por favor ingresa tu contraseña." };
  }

  // 1. Administrador (fuente autoritativa: ScriptProperties)
  const credsAdmin = obtenerCredencialesAdminAutoritativas_();
  let claveAdminOk = false;
  if (credsAdmin.configurada) {
    claveAdminOk = (hashClave(claveIngresada, credsAdmin.salt) === credsAdmin.hash);
  }

  const esUsuAdmin = !usu || esUsuarioAdminAsistencia_(usu);
  if (claveAdminOk && esUsuAdmin) {
    const token = Utilities.getUuid();
    const cache = CacheService.getScriptCache();
    cache.put("admin_" + token, "1", 21600);
    const sesion = { rol: "admin", prefectoId: "", nombre: "Administrador", usuario: "admin" };
    cache.put("sesion_" + token, JSON.stringify(sesion), 21600);
    return {
      ok: true,
      rol: "admin",
      nombre: "Administrador",
      usuario: "admin",
      token: token,
      modulo: "admin",
      urlDestino: urlAdminPub(),
      urlAlumno: urlAlumnoPub(),
      urlAsistencia: urlAsistenciaPub(),
      urlHoja: URL_HOJA_DEFAULT,
      requiereCambioClave: claveEsDefault(),
      version: VERSION_APP
    };
  }

  if (!usu) {
    return { ok: false, mensaje: "Por favor escribe tu usuario o matrícula." };
  }

  // 2. Prefecta (en hoja Prefectos)
  try {
    const prefecto = buscarPrefectoLogin_(claveIngresada, usu);
    if (prefecto) {
      if (prefecto.varios) {
        return {
          ok: false,
          requiereNombre: true,
          mensaje: "Hay más de una prefecta parecida. Escribe tu usuario completo."
        };
      }
      const token = Utilities.getUuid();
      const cache = CacheService.getScriptCache();
      const sesion = {
        rol: "prefecto",
        prefectoId: String(prefecto.id || ""),
        nombre: String(prefecto.nombre || "Prefecta"),
        usuario: String(prefecto.usuario || usu)
      };
      cache.put("sesion_" + token, JSON.stringify(sesion), 21600);
      return {
        ok: true,
        rol: "prefecto",
        nombre: sesion.nombre,
        usuario: sesion.usuario,
        prefectoId: sesion.prefectoId,
        token: token,
        modulo: "asistencia",
        urlDestino: urlAsistenciaPub(),
        urlAlumno: urlAlumnoPub(),
        urlAsistencia: urlAsistenciaPub(),
        urlHoja: URL_HOJA_DEFAULT,
        version: VERSION_APP
      };
    }
  } catch (ePref) {
    Logger.log("Error verificando prefecto en login unificado: " + ePref.message);
  }

  // 3. Docente / Maestro (en hoja MaestrosClase)
  try {
    const maestro = buscarMaestroClaseLogin_(usu, claveIngresada);
    if (maestro) {
      const token = Utilities.getUuid();
      const cache = CacheService.getScriptCache();
      cache.put("docente_" + token, "1", 21600);
      const sesion = {
        rol: "docente",
        maestroId: String(maestro.id || ""),
        nombre: String(maestro.nombre || "Docente"),
        usuario: String(maestro.usuario || usu)
      };
      cache.put("sesion_" + token, JSON.stringify(sesion), 21600);
      return {
        ok: true,
        rol: "docente",
        nombre: sesion.nombre,
        usuario: sesion.usuario,
        maestroId: sesion.maestroId,
        token: token,
        modulo: "docente",
        urlDestino: urlDocentePub(),
        urlAlumno: urlAlumnoPub(),
        urlAsistencia: urlAsistenciaPub(),
        urlHoja: URL_HOJA_DEFAULT,
        version: VERSION_APP
      };
    }
  } catch (eMae) {
    Logger.log("Error verificando maestro en login unificado: " + eMae.message);
  }

  // 4. Personal de apoyo (secretaría, biblioteca, trabajo social, etc.)
  try {
    const apoyo = buscarPersonalApoyoLogin_(usu, claveIngresada);
    if (apoyo) {
      if (apoyo.varios) {
        return {
          ok: false,
          requiereNombre: true,
          mensaje: "Hay más de una persona de apoyo parecida. Escribe tu usuario completo."
        };
      }
      const token = Utilities.getUuid();
      const cache = CacheService.getScriptCache();
      const sesion = {
        rol: "apoyo",
        apoyoId: String(apoyo.id || ""),
        nombre: String(apoyo.nombre || "Apoyo"),
        usuario: String(apoyo.usuario || usu),
        area: String(apoyo.area || "")
      };
      cache.put("sesion_" + token, JSON.stringify(sesion), 21600);
      return {
        ok: true,
        rol: "apoyo",
        nombre: sesion.nombre,
        usuario: sesion.usuario,
        area: sesion.area,
        apoyoId: sesion.apoyoId,
        token: token,
        modulo: "admin",
        urlDestino: urlAdminPub(),
        urlAlumno: urlAlumnoPub(),
        urlAsistencia: urlAsistenciaPub(),
        urlHoja: URL_HOJA_DEFAULT,
        version: VERSION_APP
      };
    }
  } catch (eApo) {
    Logger.log("Error verificando personal de apoyo en login unificado: " + eApo.message);
  }

  // 5. Alumno (en hoja AccesoClaseAlumnos por Usuario o Matrícula)
  try {
    const alumno = buscarAlumnoClaseLogin_(usu, claveIngresada);
    if (alumno) {
      const token = Utilities.getUuid();
      const cache = CacheService.getScriptCache();
      cache.put("alumno_" + token, "1", 21600);
      const sesion = {
        rol: "alumno",
        matricula: String(alumno.matricula || "").trim(),
        nombre: String(alumno.nombre || ""),
        usuario: String(alumno.usuario || usu),
        grado: String(alumno.grado || "").trim(),
        grupo: String(alumno.grupo || "").trim().toLowerCase()
      };
      cache.put("sesion_" + token, JSON.stringify(sesion), 21600);
      return {
        ok: true,
        rol: "alumno",
        nombre: sesion.nombre,
        usuario: sesion.usuario,
        matricula: sesion.matricula,
        grado: sesion.grado,
        grupo: sesion.grupo,
        token: token,
        modulo: "alumno",
        urlDestino: urlDestinoAlumno_(sesion.matricula, token),
        urlAlumno: urlAlumnoPub(),
        version: VERSION_APP
      };
    }
  } catch (eAlu) {
    Logger.log("Error verificando alumno en login unificado: " + eAlu.message);
  }

  // 6. Diagnóstico de ayuda si es alumno sin clave asignada aún
  try {
    const alusMat = leerFilas("Alumnos").filter(function(a) {
      const m = normalizarNombrePref_(a["Matrícula"] || a["Matricula"] || "");
      const u = normalizarNombrePref_(usu);
      return m === u;
    });
    if (alusMat.length > 0) {
      return {
        ok: false,
        mensaje: "Esta matrícula está registrada en el padrón escolar, pero aún no tiene contraseña asignada en el sistema. Solicita a tu maestro o prefecta que genere tu clave de acceso."
      };
    }
  } catch (eDiag) {}

  return {
    ok: false,
    mensaje: "Usuario o contraseña incorrectos. Verifica tus credenciales."
  };
}

function iniciarSesionAdmin(clave, nombrePrefecto, modulo) {
  return iniciarSesionUnificada(nombrePrefecto, clave, modulo || "");
}

function revocarTokenSesion(token) {
  const t = String(token || "").trim();
  if (!t) return { ok: true, revocado: true };
  const cache = CacheService.getScriptCache();
  const raw = cache.get("sesion_" + t);
  if (raw) {
    try {
      const ses = JSON.parse(raw);
      if (ses && ses.matricula) {
        cache.remove("sesion_alumno_" + String(ses.matricula).trim());
        cache.remove("examen_vigente_" + String(ses.matricula).trim());
      }
    } catch (e) {}
  }
  cache.remove("sesion_" + t);
  cache.remove("admin_" + t);
  cache.remove("alumno_" + t);
  cache.remove("docente_" + t);
  cache.remove("clase_" + t);
  return { ok: true, revocado: true };
}

function cerrarSesionAlumno(token) {
  return revocarTokenSesion(token);
}

function cerrarSesionAdmin(token) {
  return revocarTokenSesion(token);
}

const ROLES_VALIDOS_SISTEMA_ = ["admin", "docente", "prefecto", "apoyo", "alumno", "maestro"];

function obtenerSesionValida_(token) {
  const t = String(token || "").trim();
  if (!t) return null;
  const cache = CacheService.getScriptCache();
  const raw = cache.get("sesion_" + t);
  if (!raw) return null;
  try {
    const s = JSON.parse(raw);
    if (!s || typeof s !== "object" || !s.rol) return null;
    const rol = String(s.rol).toLowerCase();
    if (ROLES_VALIDOS_SISTEMA_.indexOf(rol) < 0) return null;
    cache.put("sesion_" + t, raw, 21600);
    return s;
  } catch (e) {
    return null;
  }
}

function exigirRoles_(token, rolesPermitidos) {
  const ses = obtenerSesionValida_(token);
  if (!ses) {
    throw new Error("Sesión no válida o expirada. Vuelve a entrar.");
  }
  const rol = String(ses.rol || "").toLowerCase();
  const permitidos = (rolesPermitidos || []).map(function (r) { return String(r).toLowerCase(); });
  if (permitidos.indexOf(rol) < 0) {
    throw new Error("Acceso denegado: rol '" + rol + "' no autorizado para esta acción.");
  }
  return ses;
}

function exigirAdmin(token) {
  const ses = obtenerSesionValida_(token);
  if (!ses) {
    throw new Error("Sesión no válida o expirada. Vuelve a entrar.");
  }
  const cache = CacheService.getScriptCache();
  if (cache.get("admin_" + String(token || "")) !== "1") {
    throw new Error("Sesión de administrador no válida. Vuelve a entrar.");
  }
  const rol = String(ses.rol || "").toLowerCase();
  if (rol !== "admin") {
    throw new Error("Acceso denegado: se requieren privilegios de administrador.");
  }
  cache.put("admin_" + token, "1", 21600);
  return ses;
}

/**
 * Procedimiento de recuperación administrativa de emergencia.
 * Solo puede ejecutarse manualmente desde la consola del editor de Apps Script.
 * No es invocable desde la web (función privada con sufijo _).
 */
function adminRestablecerClaveConsola_(nuevaClave) {
  if (!nuevaClave || String(nuevaClave).trim().length < 8) {
    throw new Error("La nueva clave de consola debe tener al menos 8 caracteres.");
  }
  const salt = Utilities.getUuid();
  const hash = hashClave(String(nuevaClave).trim(), salt);
  const props = PropertiesService.getScriptProperties();
  props.setProperties({
    CLAVE_ADMIN_SALT: salt,
    CLAVE_ADMIN_HASH: hash,
    CLAVE_ADMIN_ES_DEFAULT: "0"
  });
  Logger.log("Credenciales administrativas restablecidas exitosamente desde consola.");
  return { ok: true, mensaje: "Contraseña de administrador actualizada en ScriptProperties." };
}

const AREAS_APOYO = [
  "Secretaría",
  "Biblioteca",
  "Trabajo social",
  "Orientación",
  "Laboratorio",
  "Intendencia",
  "Otro"
];

function areaApoyoValida_(area) {
  const a = String(area || "").trim();
  for (let i = 0; i < AREAS_APOYO.length; i++) {
    if (AREAS_APOYO[i] === a) return a;
  }
  return "Otro";
}

function generarClaveAleatoriaApoyo_() {
  const letras = "abcdefghjkmnpqrstuvwxyz";
  const nums = "23456789";
  let p = "a";
  p += letras.charAt(Math.floor(Math.random() * letras.length));
  for (let i = 0; i < 4; i++) {
    p += nums.charAt(Math.floor(Math.random() * nums.length));
  }
  return p;
}

function usuariosOcupadosApoyo_(ignorarId) {
  const usados = {};
  function marcar(hoja, campoId) {
    leerFilas(hoja).forEach(function (f) {
      if (hoja === "PersonalApoyo" && ignorarId && String(f[campoId] || "") === String(ignorarId)) return;
      const u = normalizarNombrePref_(f["Usuario"] || "");
      if (u) usados[u] = true;
    });
  }
  try { marcar("PersonalApoyo", "Id"); } catch (e1) {}
  try { marcar("Prefectos", "Id"); } catch (e2) {}
  try { marcar("MaestrosClase", "Id"); } catch (e3) {}
  try {
    leerFilas("AccesoClaseAlumnos").forEach(function (f) {
      const u = normalizarNombrePref_(f["Usuario"] || "");
      if (u) usados[u] = true;
    });
  } catch (e4) {}
  return usados;
}

function usuarioApoyoLibre_(deseado, ignorarId) {
  let base = slugUsuarioPref_(deseado);
  if (!base || esUsuarioAdminAsistencia_(base)) base = "apoyo";
  const usados = usuariosOcupadosApoyo_(ignorarId);
  let u = base;
  let n = 2;
  while (usados[u] || esUsuarioAdminAsistencia_(u)) {
    u = base + n;
    n++;
  }
  return u;
}

function buscarPersonalApoyoLogin_(usuario, clave) {
  verificarYCrearPestanas();
  const filas = leerFilas("PersonalApoyo");
  const nom = normalizarNombrePref_(usuario);
  if (!nom || !String(clave || "").trim()) return null;
  const candidatos = [];
  filas.forEach(function (f) {
    const activo = String(f["Activo"] || "SI").trim().toUpperCase();
    if (activo === "NO") return;
    const u = normalizarNombrePref_(f["Usuario"] || "");
    const n = normalizarNombrePref_(f["Nombre"] || "");
    if (u === nom || n === nom) candidatos.push(f);
  });
  if (!candidatos.length) return null;
  if (candidatos.length > 1) {
    const exactoUsuario = candidatos.filter(function (f) {
      return normalizarNombrePref_(f["Usuario"] || "") === nom;
    });
    if (exactoUsuario.length === 1) {
      candidatos.length = 0;
      candidatos.push(exactoUsuario[0]);
    } else {
      return {
        varios: true,
        nombres: candidatos.map(function (f) {
          return String(f["Usuario"] || f["Nombre"] || "").trim();
        })
      };
    }
  }
  const f = candidatos[0];
  const salt = String(f["Salt"] || "");
  const hash = String(f["Hash"] || "");
  if (!salt || !hash || hashClave(clave, salt) !== hash) return null;
  return {
    id: String(f["Id"] || "").trim(),
    nombre: String(f["Nombre"] || "").trim(),
    usuario: String(f["Usuario"] || "").trim(),
    area: String(f["Área"] || "").trim()
  };
}

function listarPersonalApoyo(token) {
  const sesion = sesionAsistencia_(token);
  if (sesion.rol !== "admin") throw new Error("Solo el administrador puede ver el personal de apoyo.");
  verificarYCrearPestanas();
  const lista = leerFilas("PersonalApoyo").map(function (f) {
    return {
      id: String(f["Id"] || "").trim(),
      nombre: String(f["Nombre"] || "").trim(),
      usuario: String(f["Usuario"] || "").trim(),
      area: String(f["Área"] || "").trim(),
      clave: String(f["Clave"] || "").trim(),
      activo: String(f["Activo"] || "SI").trim().toUpperCase() !== "NO"
    };
  });
  lista.sort(function (a, b) {
    const da = String(a.area).localeCompare(String(b.area), "es");
    if (da !== 0) return da;
    return String(a.nombre).localeCompare(String(b.nombre), "es");
  });
  return { ok: true, personal: lista, areas: AREAS_APOYO };
}

function altaPersonalApoyo(token, nombre, usuario, area, clave) {
  const sesion = sesionAsistencia_(token);
  if (sesion.rol !== "admin") throw new Error("Solo el administrador puede dar de alta personal de apoyo.");
  nombre = String(nombre || "").trim();
  usuario = String(usuario || "").trim();
  clave = String(clave || "").trim();
  area = areaApoyoValida_(area);
  if (!nombre) throw new Error("Escribe el nombre de la persona.");
  if (!clave) clave = generarClaveAleatoriaApoyo_();
  if (clave.length < 6) throw new Error("La clave debe tener al menos 6 caracteres.");
  verificarYCrearPestanas();
  const usuarioUso = usuarioApoyoLibre_(usuario || nombre);
  if (esUsuarioAdminAsistencia_(usuarioUso)) {
    throw new Error("Ese usuario está reservado para el administrador.");
  }
  const id = "A" + String(new Date().getTime()).slice(-8);
  const salt = Utilities.getUuid();
  const libro = obtenerLibro();
  const p = libro.getSheetByName("PersonalApoyo");
  p.appendRow([id, nombre, usuarioUso, area, salt, hashClave(clave, salt), "SI", clave]);
  const lastRow = p.getLastRow();
  p.getRange(lastRow, 8).setNumberFormat("@");
  SpreadsheetApp.flush();
  return { ok: true, id: id, usuario: usuarioUso, clave: clave, mensaje: "Alta de " + nombre + " (" + area + "). Usuario: " + usuarioUso };
}

function asignarClavePersonalApoyo(token, id, usuario, clave, area) {
  const sesion = sesionAsistencia_(token);
  if (sesion.rol !== "admin") throw new Error("Solo el administrador puede editar personal de apoyo.");
  id = String(id || "").trim();
  usuario = String(usuario || "").trim();
  clave = String(clave || "").trim();
  if (!id) throw new Error("Falta el identificador.");
  if (clave && clave.length < 6) throw new Error("La clave debe tener al menos 6 caracteres.");
  verificarYCrearPestanas();
  const libro = obtenerLibro();
  const p = libro.getSheetByName("PersonalApoyo");
  if (!p) throw new Error("No se encontró la hoja PersonalApoyo.");
  const filas = leerFilas("PersonalApoyo");
  let f = null;
  filas.forEach(function (row) {
    if (String(row["Id"] || "").trim() === id) f = row;
  });
  if (!f) throw new Error("No se encontró a esa persona.");
  const lastCol = Math.max(p.getLastColumn(), 1);
  const enc = p.getRange(1, 1, 1, lastCol).getValues()[0];
  let colUsu = 0, colArea = 0, colSalt = 0, colHash = 0, colClave = 0;
  enc.forEach(function (h, i) {
    const n = normalizarNombrePref_(h);
    if (n === "usuario") colUsu = i + 1;
    if (n === "area") colArea = i + 1;
    if (n === "salt") colSalt = i + 1;
    if (n === "hash") colHash = i + 1;
    if (n === "clave") colClave = i + 1;
  });
  if (usuario) {
    const usuarioUso = usuarioApoyoLibre_(usuario, id);
    if (colUsu) p.getRange(f._fila, colUsu).setValue(usuarioUso);
  }
  if (area) {
    if (colArea) p.getRange(f._fila, colArea).setValue(areaApoyoValida_(area));
  }
  if (clave) {
    const salt = Utilities.getUuid();
    if (colSalt) p.getRange(f._fila, colSalt).setValue(salt);
    if (colHash) p.getRange(f._fila, colHash).setValue(hashClave(clave, salt));
    if (colClave) p.getRange(f._fila, colClave).setNumberFormat("@").setValue(clave);
  }
  SpreadsheetApp.flush();
  return { ok: true, mensaje: "Datos actualizados para " + String(f["Nombre"] || "") + "." };
}

function generarClavePersonalApoyo(token, id) {
  const clave = generarClaveAleatoriaApoyo_();
  return asignarClavePersonalApoyo(token, id, "", clave, "");
}

function generarClavesPersonalApoyo(token) {
  const sesion = sesionAsistencia_(token);
  if (sesion.rol !== "admin") throw new Error("Solo el administrador puede generar claves.");
  const filas = leerFilas("PersonalApoyo").filter(function (f) {
    return String(f["Activo"] || "SI").toUpperCase() !== "NO";
  });
  if (!filas.length) return { ok: false, total: 0, mensaje: "No hay personal de apoyo activo." };
  let n = 0;
  filas.forEach(function (f) {
    const id = String(f["Id"] || "").trim();
    const nom = String(f["Nombre"] || "");
    const usu = usuarioApoyoLibre_(slugUsuarioPref_(nom) + String(100 + Math.floor(Math.random() * 900)), id);
    const clave = generarClaveAleatoriaApoyo_();
    asignarClavePersonalApoyo(token, id, usu, clave, "");
    n++;
  });
  return { ok: true, total: n, mensaje: "Se generaron usuario y contraseña para " + n + " personas de apoyo." };
}

function cambiarClaveAdmin(token, nueva) {
  exigirAdmin(token);
  const creds = obtenerCredencialesAdminAutoritativas_();
  if (!creds.configurada) {
    throw new Error("No es posible cambiar la contraseña web: las credenciales iniciales no han sido inicializadas en ScriptProperties.");
  }
  if (!nueva || String(nueva).length < 6) {
    throw new Error("La nueva contraseña debe tener al menos 6 caracteres.");
  }
  const salt = Utilities.getUuid();
  const hash = hashClave(nueva, salt);
  const props = PropertiesService.getScriptProperties();
  props.setProperties({
    CLAVE_ADMIN_SALT: salt,
    CLAVE_ADMIN_HASH: hash,
    CLAVE_ADMIN_ES_DEFAULT: "0"
  });
  return { ok: true, mensaje: "Contraseña actualizada correctamente." };
}

function urlHojaCalculo() {
  try {
    const libro = obtenerLibro();
    if (libro) return libro.getUrl();
  } catch (e) {}
  return URL_HOJA_DEFAULT;
}

function aJsonSeguro(obj) {
  return JSON.parse(JSON.stringify(obj, function (clave, valor) {
    if (valor instanceof Date) return valor.toISOString();
    if (typeof valor === "number" && !isFinite(valor)) return 0;
    if (typeof valor === "undefined") return null;
    return valor;
  }));
}

function urlAdmin() {
  const base = String(ScriptApp.getService().getUrl() || "").replace(/\/+$/, "");
  return base ? (base + "?pagina=admin") : "?pagina=admin";
}

function urlAdminPub() {
  return urlAdmin();
}

function urlDocentePub() {
  const base = String(ScriptApp.getService().getUrl() || "").replace(/\/+$/, "");
  return base ? (base + "?pagina=docente") : "?pagina=docente";
}

function urlAlumnoPub() {
  const base = String(ScriptApp.getService().getUrl() || "").replace(/\/+$/, "");
  return base ? (base + "?pagina=alumno") : "?pagina=alumno";
}

function urlDestinoAlumno_(matricula, token) {
  const base = urlAlumnoPub();
  const sep = base.indexOf("?") >= 0 ? "&" : "?";
  let url = base + sep + "mat=" + encodeURIComponent(matricula || "");
  if (token) url += "&token=" + encodeURIComponent(token);
  return url;
}

function esVistaAsistencia_(p, urlApp) {
  const pagina = String((p && (p.pagina || p.p || p.modo || p.view || p.modulo)) || "").toLowerCase().trim();
  if (["asistencia", "prefecto", "prefectura", "asi"].indexOf(pagina) >= 0) return true;
  const id = String(ID_DEPLOY_ASISTENCIA || "").trim();
  if (id && id !== "PENDIENTE" && urlApp && String(urlApp).indexOf(id) >= 0) return true;
  return false;
}

function urlAsistenciaPub() {
  const id = String(ID_DEPLOY_ASISTENCIA || "").trim();
  if (id && id !== "PENDIENTE") {
    return "https://script.google.com/macros/s/" + id + "/exec";
  }
  const base = String(ScriptApp.getService().getUrl() || "").replace(/\/+$/, "");
  return base ? (base + "?pagina=asistencia") : "?pagina=asistencia";
}

function esVistaClaseMaestro_(p) {
  const pagina = String((p && (p.pagina || p.p || p.modo || p.view || p.modulo)) || "").toLowerCase().trim();
  return ["clase-maestro", "clase_maestro", "escucha-maestro", "maestro-clase"].indexOf(pagina) >= 0;
}

function esVistaClase_(p, urlApp) {
  const pagina = String((p && (p.pagina || p.p || p.modo || p.view || p.modulo)) || "").toLowerCase().trim();
  if (["clase", "escucha", "aula", "clase-alumno", "clase_alumno"].indexOf(pagina) >= 0) return true;
  if (esVistaClaseMaestro_(p)) return true;
  const id = String(ID_DEPLOY_CLASE || "").trim();
  if (id && id !== "PENDIENTE" && urlApp && String(urlApp).indexOf(id) >= 0) return true;
  return false;
}

function urlClasePub() {
  const id = String(ID_DEPLOY_CLASE || "").trim();
  if (id && id !== "PENDIENTE") {
    return "https://script.google.com/macros/s/" + id + "/exec";
  }
  const base = String(ScriptApp.getService().getUrl() || "").replace(/\/+$/, "");
  return base ? (base + "?pagina=clase") : "?pagina=clase";
}

/**********************************************************************
 * PANEL / DATOS
 **********************************************************************/
function panelResumen(token) {
  const ses = exigirRoles_(token, ["admin", "docente", "prefecto", "apoyo"]);
  const rol = String(ses.rol || "").toLowerCase();
  let errorApertura = "";
  let libro = null;
  let alumnos = [];
  let grupos = [];
  let lecturas = [];

  try {
    libro = obtenerLibro();
  } catch (e) {
    errorApertura = String(e.message || e);
  }
  if (!errorApertura && ultimoErrorAperturaLibro) {
    errorApertura = ultimoErrorAperturaLibro;
  }

  try { alumnos = enriquecerAlumnosConAcceso_(leerAlumnosResumen() || []); } catch (eAlu) {
    errorApertura = errorApertura || ("Alumnos: " + eAlu.message);
  }
  try { grupos = leerGruposDesdeLibro(libro, alumnos); } catch (eG) {
    grupos = gruposRespaldo();
  }
  try { lecturas = leerLecturasResumen() || []; } catch (eL) {}

  if (rol === "docente") {
    const gruposDocente = {};
    const maestroId = String(ses.maestroId || "");
    const nombreDoc = String(ses.nombre || "").toLowerCase();
    try {
      leerFilas("Horarios").forEach(function (h) {
        const m = String(h["Maestro"] || "").toLowerCase();
        if (m === nombreDoc || (maestroId && String(h["Id Maestro"] || "") === maestroId)) {
          const k = String(h["Grado"] || "") + String(h["Grupo"] || "").toUpperCase();
          gruposDocente[k] = true;
        }
      });
    } catch (eH) {}

    grupos = grupos.filter(function (g) {
      const k = String(g.grado || "") + String(g.grupo || "").toUpperCase();
      return !!gruposDocente[k];
    });

    alumnos = alumnos.filter(function (a) {
      const k = String(a.grado || "") + String(a.grupo || "").toUpperCase();
      return !!gruposDocente[k];
    }).map(function (a) {
      const copia = Object.assign({}, a);
      copia.clave = "";
      copia.usuario = "";
      delete copia.hash;
      delete copia.salt;
      delete copia.Hash;
      delete copia.Salt;
      return copia;
    });
  } else if (rol === "prefecto") {
    const prefId = String(ses.prefectoId || "");
    const asignados = {};
    try {
      leerFilas("PrefectoGrupos").forEach(function (f) {
        if (String(f["Id prefecto"] || "") === prefId) {
          const k = String(f["Grado"] || "") + String(f["Grupo"] || "").toUpperCase();
          asignados[k] = true;
        }
      });
    } catch (eP) {}

    grupos = grupos.filter(function (g) {
      const k = String(g.grado || "") + String(g.grupo || "").toUpperCase();
      return !!asignados[k];
    });

    alumnos = alumnos.filter(function (a) {
      const k = String(a.grado || "") + String(a.grupo || "").toUpperCase();
      return !!asignados[k];
    }).map(function (a) {
      const copia = Object.assign({}, a);
      copia.clave = "";
      copia.usuario = "";
      delete copia.hash;
      delete copia.salt;
      delete copia.Hash;
      delete copia.Salt;
      return copia;
    });
  } else if (rol === "apoyo") {
    // Alcance para personal de apoyo: sin asignación verificable explícita,
    // no se entregan datos de alumnos ni grupos por defecto (principio de mínimo privilegio).
    const asignadosApoyo = {};
    const apoyoId = String(ses.apoyoId || "").trim();
    if (apoyoId) {
      try {
        leerFilas("ApoyoGrupos").forEach(function (f) {
          const idFila = String(f["Id apoyo"] || f["Id personal"] || "").trim();
          if (idFila && idFila === apoyoId) {
            const k = String(f["Grado"] || "") + String(f["Grupo"] || "").toUpperCase();
            asignadosApoyo[k] = true;
          }
        });
      } catch (eAp) {}
    }

    const hayAsignacion = Object.keys(asignadosApoyo).length > 0;
    if (hayAsignacion) {
      grupos = grupos.filter(function (g) {
        const k = String(g.grado || "") + String(g.grupo || "").toUpperCase();
        return !!asignadosApoyo[k];
      });
      alumnos = alumnos.filter(function (a) {
        const k = String(a.grado || "") + String(a.grupo || "").toUpperCase();
        return !!asignadosApoyo[k];
      }).map(function (a) {
        const copia = Object.assign({}, a);
        copia.clave = "";
        copia.usuario = "";
        delete copia.hash;
        delete copia.salt;
        delete copia.Hash;
        delete copia.Salt;
        return copia;
      });
    } else {
      grupos = [];
      alumnos = [];
    }
  }

  const urlLibro = urlHojaCalculo();

  const payload = {
    ok: true,
    urlHoja: String(urlLibro || URL_HOJA_DEFAULT),
    urlAlumno: urlAlumnoPub(),
    alumnos: alumnos,
    grupos: grupos,
    lecturas: lecturas,
    resultados: [],
    diagnostico: {
      libro: libro ? String(libro.getName() || "") : "No conectado",
      id: libro ? String(libro.getId() || "") : "",
      url: String(urlLibro || URL_HOJA_DEFAULT),
      errorHojaDefault: String(errorApertura || ""),
      idHojaConfigurada: String(ID_HOJA_DEFAULT || ""),
      totalAlumnos: alumnos.length,
      pestanas: []
    },
    config: {
      intentos: leerConfig("INTENTOS_DEFAULT", "1"),
      asignaturas: ASIGNATURAS_DEFAULT.slice(),
      especificaciones: especificacionesDeTodos(),
      ppmObjetivo: ppmObjetivoDeTodos(),
      pesos: { comprension: PESO_COMPRENSION, velocidad: PESO_VELOCIDAD },
      claveEsDefault: claveEsDefault(),
      lecturasTrimestrales: leerCfgTrimestral_(),
      urlSitioAlumno: urlSitioAlumno_(),
      urlSitioDocente: urlSitioDocente_(),
      identidad: identidadEscuela_()
    }
  };

  try {
    return aJsonSeguro(payload);
  } catch (eJson) {
    payload.alumnos = [];
    payload.lecturas = [];
    payload.resultados = [];
    payload.diagnostico.errorHojaDefault = String(eJson.message || eJson);
    return payload;
  }
}

function leerGruposHoja_() {
  if (memoGrupos_) return memoGrupos_;
  const cacheados = cacheGetJson_("grupos_idx");
  if (cacheados && Array.isArray(cacheados)) {
    memoGrupos_ = cacheados;
    return cacheados;
  }
  const libro = obtenerLibro();
  const p = libro && libro.getSheetByName("Grupos");
  const grupos = [];
  if (p && p.getLastRow() >= 2) {
    const last = p.getLastRow();
    const cols = Math.min(Math.max(p.getLastColumn(), 1), 5);
    const valores = p.getRange(1, 1, last, cols).getValues();
    const enc = valores[0].map(function (h) { return String(h || "").trim(); });
    for (let i = 1; i < valores.length; i++) {
      const fila = {};
      for (let c = 0; c < enc.length; c++) fila[enc[c]] = valores[i][c];
      const grupo = String(fila["Grupo"] || "").trim().toLowerCase();
      if (!grupo) continue;
      const rawG = String(fila["Grado"] || "").trim();
      grupos.push({
        grado: normalizarGradoServer(rawG) || normalizarGradoServer(grupo) || "1",
        grupo: grupo,
        activo: String(fila["Activo"] || "SI").trim().toUpperCase(),
        extra: Number(fila["Intentos extra"] || 0) || 0,
        turno: String(fila["Turno"] || "matutino").trim().toLowerCase() || "matutino"
      });
    }
  }
  memoGrupos_ = grupos;
  cachePutJson_("grupos_idx", grupos, 300);
  return grupos;
}

function extraGrupoDe_(grupo) {
  const g = String(grupo || "").toLowerCase().trim();
  if (!g) return 0;
  const lista = leerGruposHoja_();
  for (let i = 0; i < lista.length; i++) {
    if (String(lista[i].grupo || "").toLowerCase() === g && String(lista[i].activo).toUpperCase() !== "NO") {
      return Number(lista[i].extra || 0);
    }
  }
  return 0;
}

function leerGruposDesdeLibro(libro, alumnos) {
  let grupos = leerGruposHoja_().slice();
  if (alumnos && alumnos.length) {
    const gruposMap = {};
    grupos.forEach(function (g) { gruposMap[g.grupo] = true; });
    alumnos.forEach(function (a) {
      const gCod = String(a.grupo || "").trim().toLowerCase();
      if (gCod && !gruposMap[gCod]) {
        gruposMap[gCod] = true;
        grupos.push({
          grado: normalizarGradoServer(a.grado) || normalizarGradoServer(gCod) || "1",
          grupo: gCod,
          activo: "SI",
          extra: 0,
          turno: "matutino"
        });
      }
    });
  }
  return grupos.length ? grupos : gruposRespaldo();
}

function extraerAlumnosDePestana(p) {
  if (!p) return [];
  const nombreHoja = p.getName().trim();
  const nomHojaNorm = nombreHoja.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Ignorar pestañas internas de sistema (excepto Alumnos)
  if (["config", "lecturas", "preguntas", "resultados", "resumen", "lecturas_prev", "grupos", "prefectos", "prefectogrupos", "horarios", "asistenciaalumnos", "asistenciamaestros"].indexOf(nomHojaNorm) >= 0) return [];
  if (nomHojaNorm.indexOf("lectura_viejo") >= 0) return [];

  const maxFilas = p.getLastRow();
  const maxCols = p.getLastColumn();
  if (maxFilas < 1 || maxCols < 1) return [];

  const valores = p.getRange(1, 1, maxFilas, maxCols).getValues();
  if (!valores || valores.length === 0) return [];

  // Si es la pestaña estándar "Alumnos" con encabezados normales
  if (nomHojaNorm === "alumnos" && valores.length >= 2) {
    const enc = valores[0].map(function (c) { return String(c || "").trim().toLowerCase(); });
    const colM = enc.findIndex(function (h) { return h.indexOf("matricula") >= 0 || h === "id"; });
    const colN = enc.findIndex(function (h) { return h.indexOf("nombre") >= 0; });
    const colGr = enc.findIndex(function (h) { return h.indexOf("grado") >= 0; });
    const colGp = enc.findIndex(function (h) { return h.indexOf("grupo") >= 0; });
    const colAc = enc.findIndex(function (h) { return h.indexOf("activo") >= 0; });
    const colEx = enc.findIndex(function (h) { return h.indexOf("extra") >= 0 || h.indexOf("intento") >= 0; });

    if (colN >= 0 || colM >= 0) {
      const standardOut = [];
      for (let r = 1; r < valores.length; r++) {
        const row = valores[r];
        if (!row || !row.length) continue;
        const mat = String(colM >= 0 && row[colM] != null ? row[colM] : "").trim();
        const nom = String(colN >= 0 && row[colN] != null ? row[colN] : "").trim();
        if (!nom && !mat) continue;
        
        let gra = String(colGr >= 0 && row[colGr] != null ? row[colGr] : "").trim();
        let gru = String(colGp >= 0 && row[colGp] != null ? row[colGp] : "").trim().toLowerCase();
        const act = String(colAc >= 0 && row[colAc] != null ? row[colAc] : "SI").trim().toUpperCase();
        const ext = Number(colEx >= 0 && row[colEx] != null ? row[colEx] : 0) || 0;

        if (!gra && gru) gra = normalizarGradoServer(gru) || "1";
        if (!gru && gra) gru = normalizarGradoServer(gra) + "a";
        if (!gra) gra = "1";
        if (!gru) gru = gra + "a";

        standardOut.push({
          matricula: mat || String(24000 + r),
          nombre: nom || ("Estudiante " + mat),
          grado: normalizarGradoServer(gra) || "1",
          grupo: gru,
          activo: act === "NO" ? "NO" : "SI",
          extra: ext,
          _hoja: nombreHoja
        });
      }
      if (standardOut.length > 0) return standardOut;
    }
  }

  // 1. Deducir grado y grupo por el nombre de la pestaña (ej. "1A", "1° B", "2-C", "3A", "Grupo 1B", "1ERO A")
  let gradoPorHoja = "";
  let grupoPorHoja = "";
  const matchGpo = nomHojaNorm.match(/^([123])\s*[°oº\s*-]*\s*([a-z])$/i) ||
                   nomHojaNorm.match(/grupo\s*([123]\s*[a-z])/i) ||
                   nomHojaNorm.match(/([123])\s*(?:ero|do|er|ro|to)?\s*[°oº\s*-]*\s*([a-z])/i) ||
                   nomHojaNorm.match(/([123])\s*([a-z])/i);
  if (matchGpo) {
    gradoPorHoja = normalizarGradoServer(matchGpo[1]);
    grupoPorHoja = (gradoPorHoja + matchGpo[2].trim()).toLowerCase();
  } else {
    const matchGr = nomHojaNorm.match(/([123])\s*[°oº\s*grado]/i);
    if (matchGr) gradoPorHoja = matchGr[1];
  }

  // Escanear celdas superiores para detectar grado y grupo si aún no se tiene
  for (let r = 0; r < Math.min(valores.length, 10); r++) {
    for (let c = 0; c < (valores[r] || []).length; c++) {
      const celdaStr = String(valores[r][c] || "").trim().toLowerCase();
      if (!gradoPorHoja) {
        const mg = celdaStr.match(/grado\s*[:=\s]\s*([123])/i) || celdaStr.match(/^([123])\s*[°oº]/i);
        if (mg) gradoPorHoja = normalizarGradoServer(mg[1]);
      }
      if (!grupoPorHoja) {
        const mgr = celdaStr.match(/grupo\s*[:=\s]\s*([a-z])/i) || celdaStr.match(/([123])\s*[°oº\s*-]*\s*([a-z])/i);
        if (mgr) {
          if (mgr[2]) grupoPorHoja = (normalizarGradoServer(mgr[1]) + mgr[2]).toLowerCase();
          else if (gradoPorHoja) grupoPorHoja = (gradoPorHoja + mgr[1]).toLowerCase();
        }
      }
    }
  }

  // 2. Buscar fila de encabezados en las primeras 12 filas
  let filaHeader = -1;
  let colMat = -1, colNom = -1, colPat = -1, colMatApp = -1, colNombres = -1;
  let colGra = -1, colGru = -1, colAct = -1, colExt = -1;

  for (let r = 0; r < Math.min(valores.length, 12); r++) {
    const row = valores[r].map(function (c) {
      return String(c || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    });

    const fn = row.findIndex(function (h) {
      return (h.indexOf("nombre") >= 0 || h.indexOf("alumno") >= 0 || h.indexOf("estudiante") >= 0) &&
             h.indexOf("paterno") < 0 && h.indexOf("materno") < 0 && h.indexOf("primer") < 0 && h.indexOf("segundo") < 0;
    });
    const fp = row.findIndex(function (h) {
      return h.indexOf("paterno") >= 0 || h.indexOf("primer apellido") >= 0 || h === "apellidos" || h === "apellido";
    });
    const fmat = row.findIndex(function (h) { return h.indexOf("materno") >= 0 || h.indexOf("segundo apellido") >= 0; });
    const fnom = row.findIndex(function (h) { return (h.indexOf("nombre") >= 0 || h === "nombres") && (fp >= 0 || fmat >= 0); });
    
    const fm = row.findIndex(function (h) {
      return h.indexOf("matricula") >= 0 || h === "id" || h.indexOf("control") >= 0 ||
             h === "no." || h === "no" || h === "num" || h === "n°" || h === "n.p." || h === "np" ||
             h === "n/p" || h === "clave" || h === "curp" || h === "folio" || h === "nie" ||
             h === "codigo" || h.indexOf("lista") >= 0;
    });
    const fg = row.findIndex(function (h) { return h === "grado" || h.indexOf("grado") >= 0 || h === "ano" || h === "año" || h === "gdo"; });
    const fgr = row.findIndex(function (h) { return h === "grupo" || h.indexOf("grupo") >= 0 || h === "seccion" || h === "gpo" || h === "sec"; });
    const fa = row.findIndex(function (h) { return h.indexOf("activo") >= 0 || h.indexOf("estado") >= 0 || h.indexOf("estatus") >= 0 || h.indexOf("condicion") >= 0; });
    const fe = row.findIndex(function (h) { return h.indexOf("extra") >= 0 || h.indexOf("intento") >= 0; });

    // Exigir que al menos exista una columna de nombres o apellidos
    if (fn >= 0 || fp >= 0 || (fnom >= 0 && (fp >= 0 || fmat >= 0))) {
      filaHeader = r;
      colMat = fm; colNom = fn; colPat = fp; colMatApp = fmat; colNombres = fnom;
      colGra = fg; colGru = fgr; colAct = fa; colExt = fe;
      break;
    }
  }

  const out = [];
  const inicioR = filaHeader >= 0 ? filaHeader + 1 : 0;

  for (let r = inicioR; r < valores.length; r++) {
    const row = valores[r];
    if (!row || !row.length) continue;

    let mat = "";
    let nom = "";
    let gra = "";
    let gru = "";
    let act = "SI";
    let ext = 0;

    if (filaHeader >= 0) {
      if (colMat >= 0 && row[colMat] != null) mat = String(row[colMat]).trim();
      
      if (colPat >= 0 || colMatApp >= 0 || colNombres >= 0) {
        const pat = String(colPat >= 0 && row[colPat] != null ? row[colPat] : "").trim();
        const matA = String(colMatApp >= 0 && row[colMatApp] != null ? row[colMatApp] : "").trim();
        const noms = String(colNombres >= 0 && row[colNombres] != null ? row[colNombres] : (colNom >= 0 && row[colNom] != null ? row[colNom] : "")).trim();
        const partes = [pat, matA, noms].filter(Boolean);
        nom = partes.join(" ");
      } else if (colNom >= 0 && row[colNom] != null) {
        nom = String(row[colNom]).trim();
      }

      if (colGra >= 0 && row[colGra] != null) gra = String(row[colGra]).trim();
      if (colGru >= 0 && row[colGru] != null) gru = String(row[colGru]).trim();
      if (colAct >= 0 && row[colAct] != null) act = String(row[colAct]).trim().toUpperCase();
      if (colExt >= 0 && row[colExt] != null) ext = Number(row[colExt]) || 0;
    } else {
      // Heurística fila por fila si no hay encabezados
      for (let c = 0; c < row.length; c++) {
        const celda = String(row[c] || "").trim();
        if (!celda) continue;
        if (!mat && (/^\d{1,10}$/.test(celda) || /^[A-Z0-9]{6,18}$/i.test(celda))) {
          mat = celda;
        } else if (!nom && celda.length >= 4 && /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(celda) && isNaN(Number(celda))) {
          nom = celda;
        } else if (!gru && /^([123])\s*[°oº\s*-]*\s*([a-zA-Z])$/i.test(celda)) {
          gru = celda;
        }
      }
    }

    if (nom && !isNaN(Number(nom)) && isNaN(Number(mat)) && mat.length > nom.length) {
      const temp = nom; nom = mat; mat = temp;
    }

    if (!nom && !mat) continue;

    const nomMin = (nom || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    if (nomMin === "nombre" || nomMin === "nombre completo" || nomMin === "alumno" || nomMin === "estudiante" ||
        nomMin === "primer apellido" || nomMin === "apellido paterno" || nomMin === "apellidos" ||
        nomMin.indexOf("escuela") >= 0 || nomMin.indexOf("secundaria") >= 0 || nomMin.indexOf("profesor") >= 0 ||
        nomMin.indexOf("docente") >= 0 || nomMin.indexOf("ciclo escolar") >= 0 || nomMin.indexOf("lista de") >= 0 ||
        nomMin.indexOf("asistencia") >= 0 || nomMin === "total" || nomMin === "firma" || mat.toLowerCase() === "matricula") {
      continue;
    }

    // Si tiene menos de 2 letras y no es un nombre real, descartar
    if (nom && nom.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, "").length < 2) continue;

    if (!mat && nom) {
      mat = String(24000 + (r + 1));
    }
    if (!nom && mat) {
      nom = "Estudiante " + mat;
    }

    if (!gru && grupoPorHoja) gru = grupoPorHoja;
    if (!gra && gradoPorHoja) gra = gradoPorHoja;

    if (!gra && gru) {
      gra = normalizarGradoServer(gru) || "1";
    }
    if (!gru && gra) {
      gru = normalizarGradoServer(gra) + "a";
    }
    if (!gra) gra = "1";
    if (!gru) gru = gra + "a";

    const mg = gru.match(/([123])\s*[-°oº\s]*([a-zA-Z])/i);
    if (mg) {
      gru = (mg[1] + mg[2]).toLowerCase();
      gra = mg[1];
    } else {
      gru = gru.toLowerCase().replace(/[^a-z0-9]/g, "");
    }

    out.push({
      matricula: mat,
      nombre: nom,
      grado: normalizarGradoServer(gra) || "1",
      grupo: gru,
      activo: act === "NO" ? "NO" : "SI",
      extra: ext,
      _hoja: nombreHoja
    });
  }

  return out;
}

function enriquecerAlumnosConAcceso_(alumnos) {
  const mapa = {};
  try {
    asegurarColumnaClaveAccesoClase_();
    leerFilas("AccesoClaseAlumnos").forEach(function (f) {
      const mat = String(f["Matrícula"] || f["Matricula"] || "").trim();
      if (!mat) return;
      mapa[mat] = {
        usuario: String(f["Usuario"] || "").trim(),
        clave: String(f["Clave"] || "").trim()
      };
    });
  } catch (eAcc) {}
  (alumnos || []).forEach(function (a) {
    const acc = mapa[String(a.matricula || "").trim()] || {};
    a.usuario = acc.usuario || "";
    a.clave = acc.clave || "";
  });
  return alumnos || [];
}

function leerAlumnosResumen() {
  if (memoAlumnos_) return memoAlumnos_;
  const cacheados = cacheGetJson_("alumnos_resumen");
  if (cacheados && cacheados.length) {
    memoAlumnos_ = cacheados;
    return cacheados;
  }

  const libro = obtenerLibro();
  if (!libro) return [];

  let alumnos = [];

  const pestanaAlumnos = libro.getSheetByName("Alumnos");
  if (pestanaAlumnos && pestanaAlumnos.getLastRow() >= 2) {
    try {
      const last = pestanaAlumnos.getLastRow();
      const cols = Math.min(Math.max(pestanaAlumnos.getLastColumn(), 1), 6);
      const valores = pestanaAlumnos.getRange(1, 1, last, cols).getValues();
      const encL = valores[0].map(function (h) { return normalizarNombrePref_(h); });
      function idxDe(pred) {
        for (let i = 0; i < encL.length; i++) if (pred(encL[i])) return i;
        return -1;
      }
      const colM = idxDe(function (h) { return h.indexOf("matricula") >= 0 || h === "id"; });
      const colN = idxDe(function (h) { return h.indexOf("nombre") >= 0; });
      const colGr = idxDe(function (h) { return h.indexOf("grado") >= 0; });
      const colGp = idxDe(function (h) { return h === "grupo" || (h.indexOf("grupo") >= 0 && h.indexOf("grado") < 0); });
      const colAc = idxDe(function (h) { return h.indexOf("activo") >= 0; });
      const colEx = idxDe(function (h) { return h.indexOf("extra") >= 0 || h.indexOf("intento") >= 0; });
      if (colN >= 0 || colM >= 0) {
        const nomHoja = pestanaAlumnos.getName();
        for (let r = 1; r < valores.length; r++) {
          const row = valores[r];
          const mat = String(colM >= 0 && row[colM] != null ? row[colM] : "").trim();
          const nom = String(colN >= 0 && row[colN] != null ? row[colN] : "").trim();
          if (!nom && !mat) continue;
          let gra = String(colGr >= 0 && row[colGr] != null ? row[colGr] : "").trim();
          let gru = String(colGp >= 0 && row[colGp] != null ? row[colGp] : "").trim().toLowerCase();
          const act = String(colAc >= 0 && row[colAc] != null ? row[colAc] : "SI").trim().toUpperCase();
          const ext = Number(colEx >= 0 && row[colEx] != null ? row[colEx] : 0) || 0;
          if (!gra && gru) gra = normalizarGradoServer(gru) || "1";
          if (!gru && gra) gru = (normalizarGradoServer(gra) || "1") + "a";
          if (!gra) gra = "1";
          if (!gru) gru = gra + "a";
          alumnos.push({
            matricula: mat || String(24000 + alumnos.length + 1),
            nombre: nom || ("Estudiante " + mat),
            grado: normalizarGradoServer(gra) || "1",
            grupo: gru,
            activo: act === "NO" ? "NO" : "SI",
            extra: ext,
            _hoja: nomHoja
          });
        }
      }
    } catch (eFilas) {
      Logger.log("Error en lectura rápida Alumnos: " + eFilas.message);
    }
  }

  if (pestanaAlumnos && alumnos.length === 0) {
    const alusAlumnos = extraerAlumnosDePestana(pestanaAlumnos);
    if (alusAlumnos.length) {
      alumnos = alumnos.concat(alusAlumnos);
    }
  }

  // 2. Solo escanear otras pestañas si la hoja Alumnos no trajo registros
  if (!alumnos.length) {
    libro.getSheets().forEach(function (h) {
      const nomNorm = h.getName().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
      if (["config", "lecturas", "preguntas", "resultados", "resumen", "lecturas_prev", "alumnos", "grupos", "prefectos", "prefectogrupos", "horarios", "asistenciaalumnos", "asistenciamaestros"].indexOf(nomNorm) >= 0) return;
      const extraidos = extraerAlumnosDePestana(h);
      if (extraidos.length) alumnos = alumnos.concat(extraidos);
    });
  }

  // 3. Eliminar duplicados inteligentemente (sin perder alumnos con mismo número de lista en grupos distintos)
  const vistan = {};
  const unicos = [];
  alumnos.forEach(function (a) {
    const nomNorm = String(a.nombre || "").toLowerCase().trim();
    const matNorm = String(a.matricula || "").toLowerCase().trim();
    const gpoNorm = String(a.grupo || "").toLowerCase().trim();
    
    // Si la matrícula es un ID largo (CURP, clave de 4+ dígitos), usarla; si es número de lista (1, 2, 3), combinar con grupo o nombre
    const clave = (matNorm && matNorm.length >= 4 && !/^\d{1,2}$/.test(matNorm))
      ? matNorm
      : (nomNorm ? nomNorm + "_" + gpoNorm : matNorm + "_" + gpoNorm);

    if (!vistan[clave]) {
      vistan[clave] = true;
      unicos.push(a);
    }
  });

  return guardarAlumnosResumen_(unicos);
}

function guardarAlumnosResumen_(unicos) {
  memoAlumnos_ = unicos;
  cachePutJson_("alumnos_resumen", unicos, 300);
  return unicos;
}

function normalizarGradoServer(v) {
  if (!v) return "";
  const m = String(v).match(/([123])/);
  return m ? m[1] : "";
}

function leerGruposResumen() {
  const grupos = leerGruposHoja_().slice();

  // Si hay alumnos, asegurarse de que todos sus grupos aparezcan en la lista
  const alumnos = leerAlumnosResumen();
  if (alumnos.length) {
    const gruposMap = {};
    grupos.forEach(function (g) { gruposMap[g.grupo] = true; });
    alumnos.forEach(function (a) {
      const gCod = String(a.grupo || "").trim().toLowerCase();
      if (gCod && !gruposMap[gCod]) {
        gruposMap[gCod] = true;
        grupos.push({
          grado: normalizarGradoServer(a.grado) || normalizarGradoServer(gCod) || "1",
          grupo: gCod,
          activo: "SI",
          extra: 0,
          turno: "matutino"
        });
      }
    });
  }

  if (!grupos.length) {
    sembrarGrupos_();
    return gruposRespaldo();
  }
  return grupos;
}

function leerLecturasResumen() {
  return leerLecturasIndice_().map(function (l) {
    return {
      id: String(l["ID Lectura"] || ""),
      grado: String(l["Grado"] || ""),
      asignatura: String(l["Asignatura"] || ""),
      tema: String(l["Tema"] || ""),
      palabras: Number(l["Palabras"] || 0),
      activa: String(l["Activa"] || ""),
      origen: String(l["Origen"] || ""),
      nPreguntas: Number(l.nPreguntas || 0)
    };
  });
}

function fusionarNivelesDesdeJson_(preguntas, jsonRaw) {
  let json = [];
  try { json = JSON.parse(jsonRaw || "[]"); } catch (e) { json = []; }
  if (!Array.isArray(json)) json = [];
  if ((!preguntas || !preguntas.length) && json.length) {
    return json.map(function (pr) {
      const nrm = normalizarPreguntaAdmin(pr);
      if (nrm) return nrm;
      const en = String((pr && pr.p) || "").trim();
      const ops = ((pr && pr.opciones) || []).map(function (o) { return String(o || "").trim(); }).filter(Boolean);
      if (!en || ops.length < 2) return null;
      return { p: en, opciones: ops, respuesta: String((pr && pr.respuesta) || ""), nivel: normalizarNivelComprension(pr && pr.nivel) };
    }).filter(Boolean);
  }
  const porEnunciado = {};
  json.forEach(function (pr) {
    const en = normalizarEnunciadoNivel_((pr && pr.p) || "");
    const n = normalizarNivelComprension(pr && pr.nivel);
    if (en && n) porEnunciado[en] = n;
  });
  (preguntas || []).forEach(function (p, i) {
    if (normalizarNivelComprension(p.nivel)) {
      p.nivel = normalizarNivelComprension(p.nivel);
      return;
    }
    const deJson = porEnunciado[normalizarEnunciadoNivel_(p.p)] ||
      normalizarNivelComprension(json[i] && json[i].nivel);
    if (deJson) p.nivel = deJson;
  });
  return preguntas || [];
}

function inspeccionarNivelesPreguntas() {
  const lecturas = leerFilas("Lecturas");
  let jsonCon = 0, jsonSin = 0, muestraJson = "";
  lecturas.forEach(function (l) {
    let json = [];
    try { json = JSON.parse(l["Preguntas JSON"] || "[]"); } catch (e) { json = []; }
    (json || []).forEach(function (pr) {
      if (normalizarNivelComprension(pr && pr.nivel)) jsonCon++;
      else jsonSin++;
      if (!muestraJson && pr && pr.p) muestraJson = String(pr.p).substring(0, 80) + " | nivel=" + String(pr.nivel || "");
    });
  });
  const hoja = leerFilas("Preguntas");
  let hojaCon = 0, hojaSin = 0, enc = [];
  try {
    const p = obtenerLibro().getSheetByName("Preguntas");
    if (p) enc = p.getRange(1, 1, 1, Math.max(p.getLastColumn(), 1)).getValues()[0];
  } catch (eEnc) {}
  hoja.forEach(function (row) {
    if (!String(row["Enunciado"] || "").trim()) return;
    if (normalizarNivelComprension(row["Nivel"])) hojaCon++;
    else hojaSin++;
  });
  return {
    ok: true,
    jsonCon: jsonCon,
    jsonSin: jsonSin,
    hojaCon: hojaCon,
    hojaSin: hojaSin,
    encabezados: enc,
    muestraJson: muestraJson
  };
}

function sincronizarNivelesHojaDesdeJson(token) {
  exigirAdmin(token);
  asegurarColumnaNivelPreguntas();
  SpreadsheetApp.flush();
  reconstruirHojaPreguntasDesdeJson_();
  SpreadsheetApp.flush();
  return inspeccionarNivelesPreguntas();
}

function detalleLecturas(token) {
  exigirAdmin(token);
  asegurarSetup();
  const filas = leerFilas("Lecturas");
  let mapaPreg = null;
  return filas.map(function (l) {
    const id = String(l["ID Lectura"] || "");
    const texto = String(l["Texto"] || "");
    let jsonOk = false;
    try {
      const j = JSON.parse(l["Preguntas JSON"] || "[]");
      jsonOk = Array.isArray(j) && j.length > 0;
    } catch (e) {}
    if (!jsonOk && !mapaPreg) mapaPreg = mapaPreguntasPorId();
    const preguntas = fusionarNivelesDesdeJson_(jsonOk ? [] : (mapaPreg[id] || []), l["Preguntas JSON"]);
    return {
      id: id,
      grado: String(l["Grado"] || ""),
      asignatura: String(l["Asignatura"] || ""),
      tema: String(l["Tema"] || ""),
      palabras: Number(l["Palabras"] || 0) || contarPalabras(texto),
      origen: String(l["Origen"] || ""),
      activa: String(l["Activa"] || "SI"),
      texto: texto,
      preguntas: preguntas
    };
  });
}

function detalleUnaLectura(token, id) {
  exigirAdmin(token);
  const fila = buscarLecturaPorId(id);
  if (!fila) return null;
  const texto = String(fila["Texto"] || "");
  const preguntas = preguntasDeLectura(fila);
  return {
    id: String(fila["ID Lectura"] || ""),
    grado: String(fila["Grado"] || ""),
    asignatura: String(fila["Asignatura"] || ""),
    tema: String(fila["Tema"] || ""),
    palabras: Number(fila["Palabras"] || 0) || contarPalabras(texto),
    origen: String(fila["Origen"] || ""),
    activa: String(fila["Activa"] || "SI"),
    texto: texto,
    preguntas: preguntas
  };
}

function detalleResultados(token) {
  exigirAdmin(token);
  const resultados = leerResultadosDeTodasLasPestanas();
  return { ok: true, resultados: resultados };
}

function listaLecturasAdmin(token) {
  exigirAdmin(token);
  return { ok: true, lecturas: leerLecturasResumen() };
}

function valoresHoja_(p, maxCols) {
  if (!p) return [];
  const lastR = p.getLastRow();
  if (lastR < 1) return [];
  const lastC = Math.max(p.getLastColumn(), 1);
  const cols = maxCols ? Math.min(lastC, maxCols) : lastC;
  return p.getRange(1, 1, lastR, cols).getValues();
}

function leerFilas(nombre) {
  const libro = obtenerLibro();
  if (!libro) return [];
  const p = libro.getSheetByName(nombre);
  if (!p || p.getLastRow() < 2) return [];
  const valores = valoresHoja_(p);
  if (valores.length < 2) return [];
  const enc = valores[0];
  const out = [];
  for (let i = 1; i < valores.length; i++) {
    const fila = {};
    enc.forEach(function (h, c) { fila[String(h).trim()] = valores[i][c]; });
    fila._fila = i + 1;
    out.push(fila);
  }
  return out;
}

/**********************************************************************
 * ESPECIFICACIONES Y PPM OBJETIVO
 **********************************************************************/
function especificacionesDeGrado(grado) {
  const base = ESPECIFICACIONES_GRADO[String(grado)] || ESPECIFICACIONES_GRADO["1"];
  const extra = ppmObjetivoDeTodos()[String(grado)];
  if (extra) {
    return Object.assign({}, base, {
      ppmMin: Number(extra.ppmMin),
      ppmMax: Number(extra.ppmMax),
      ppmObjetivo: Number(extra.ppmObjetivo)
    });
  }
  return base;
}

function especificacionesDeTodos() {
  return JSON.parse(JSON.stringify(ESPECIFICACIONES_GRADO));
}

function ppmObjetivoDeTodos() {
  const base = {};
  Object.keys(ESPECIFICACIONES_GRADO).forEach(function (g) {
    base[g] = {
      ppmMin: ESPECIFICACIONES_GRADO[g].ppmMin,
      ppmMax: ESPECIFICACIONES_GRADO[g].ppmMax,
      ppmObjetivo: ESPECIFICACIONES_GRADO[g].ppmObjetivo
    };
  });
  try {
    const extra = JSON.parse(leerConfig("PPM_OBJETIVO", "{}") || "{}");
    Object.keys(extra || {}).forEach(function (g) {
      if (extra[g] && (extra[g].ppmMin || extra[g].ppmMax || extra[g].ppmObjetivo)) {
        base[g] = {
          ppmMin: Number(extra[g].ppmMin) || base[g].ppmMin,
          ppmMax: Number(extra[g].ppmMax) || base[g].ppmMax,
          ppmObjetivo: Number(extra[g].ppmObjetivo) || base[g].ppmObjetivo
        };
      }
    });
  } catch (e) {}
  return base;
}

function restaurarPpmRecomendados(token) {
  exigirAdmin(token);
  const rec = {};
  Object.keys(ESPECIFICACIONES_GRADO).forEach(function (g) {
    rec[g] = {
      ppmMin: ESPECIFICACIONES_GRADO[g].ppmMin,
      ppmMax: ESPECIFICACIONES_GRADO[g].ppmMax,
      ppmObjetivo: ESPECIFICACIONES_GRADO[g].ppmObjetivo
    };
  });
  escribirConfig_("PPM_OBJETIVO", JSON.stringify(rec));
  return { ok: true, mensaje: "Se restauraron los rangos recomendados de PPM.", ppmObjetivo: rec };
}

function guardarPpmObjetivo(token, json) {
  exigirAdmin(token);
  const obj = (typeof json === "string") ? JSON.parse(json) : json;
  Object.keys(obj).forEach(function (g) {
    const v = obj[g];
    if (Number(v.ppmMin) <= 0 || Number(v.ppmMax) <= 0 || Number(v.ppmObjetivo) <= 0) {
      throw new Error("Los PPM deben ser mayores a cero.");
    }
    if (Number(v.ppmMin) > Number(v.ppmMax)) {
      throw new Error("En grado " + g + ": ppmMin no puede ser mayor que ppmMax.");
    }
  });
  escribirConfig_("PPM_OBJETIVO", JSON.stringify(obj));
  return { ok: true, mensaje: "Rangos PPM actualizados." };
}

/**********************************************************************
 * ALUMNOS / GRUPOS / INTENTOS
 **********************************************************************/
function obtenerGruposPorGrado(grado) {
  const g = normalizarGradoServer(grado);
  let res = [];
  try {
    const todos = leerAlumnosResumen();
    res = uniq(todos.filter(function (a) {
      const ga = normalizarGradoServer(a.grado) || normalizarGradoServer(a.grupo);
      return (!g || ga === g) && String(a.activo).toUpperCase() !== "NO";
    }).map(function (a) { return String(a.grupo).toLowerCase(); })).sort();
  } catch (e) {}
  if (!res.length && g) {
    res = ["a", "b", "c", "d", "e"].map(function (l) { return g + l; });
  }
  return res;
}

function obtenerAlumnosPorGrupo(grupo) {
  const g = String(grupo || "").trim().toLowerCase();
  let todos = [];
  try { todos = leerAlumnosResumen(); } catch (e) { return []; }
  return todos
    .filter(function (a) {
      return String(a.grupo).trim().toLowerCase() === g && String(a.activo).toUpperCase() !== "NO";
    })
    .map(function (a) {
      return {
        matricula: String(a.matricula),
        nombre: String(a.nombre),
        grupo: String(a.grupo),
        grado: String(a.grado)
      };
    })
    .sort(function (a, b) { return a.nombre.localeCompare(b.nombre, "es"); });
}

function catalogoLoginPorGrado(grado) {
  const g = normalizarGradoServer(grado);
  let todos = [];
  try { todos = leerAlumnosResumen(); } catch (e) { todos = []; }
  const activos = todos.filter(function (a) {
    const ga = normalizarGradoServer(a.grado) || normalizarGradoServer(a.grupo);
    return (!g || ga === g) && String(a.activo).toUpperCase() !== "NO";
  });
  const grupos = uniq(activos.map(function (a) {
    return String(a.grupo || "").toLowerCase();
  }).filter(Boolean)).sort();

  return {
    grupos: grupos.length ? grupos : ["a", "b", "c", "d", "e"].map(function (l) { return g + l; }),
    alumnos: [],
    trimestre: (function () { try { return infoTrimestreActual(); } catch (e) { return null; } })()
  };
}

function buscarAlumno(matricula) {
  const m = String(matricula || "").trim().toLowerCase();
  if (!m) return null;
  const todos = leerAlumnosResumen();
  let l = todos.filter(function (a) {
    return String(a.matricula).trim().toLowerCase() === m;
  });
  if (!l.length) {
    try {
      const acc = leerFilas("AccesoClaseAlumnos");
      for (let i = 0; i < acc.length; i++) {
        const f = acc[i];
        const u = String(f["Usuario"] || "").trim().toLowerCase();
        const mat = String(f["Matrícula"] || f["Matricula"] || "").trim().toLowerCase();
        if (u === m || mat === m) {
          const matReal = String(f["Matrícula"] || f["Matricula"] || f["Usuario"] || "").trim();
          l = todos.filter(function (a) {
            return String(a.matricula).trim().toLowerCase() === matReal.toLowerCase();
          });
          if (l.length) break;
          return {
            "Matrícula": matReal,
            "Nombre Completo": String(f["Nombre"] || ""),
            "Grado": String(f["Grado"] || ""),
            "Grupo": String(f["Grupo"] || ""),
            "Activo": String(f["Activo"] || "SI"),
            "Intentos extra": 0
          };
        }
      }
    } catch (eAcc) {}
  }
  if (l.length) {
    const a = l[0];
    return {
      "Matrícula": a.matricula,
      "Nombre Completo": a.nombre,
      "Grado": a.grado,
      "Grupo": a.grupo,
      "Activo": a.activo,
      "Intentos extra": a.extra || 0
    };
  }
  return null;
}

function filaAlumnoPorMatricula(matricula, grupo) {
  const filas = leerFilas("Alumnos");
  const mat = String(matricula || "").trim();
  const gru = String(grupo || "").trim().toLowerCase();
  if (!mat) return null;
  let a = null;
  if (gru) {
    a = filas.find(function (x) {
      return celdaAlumno(x, ["Matrícula", "Matricula", "No.", "N°"]) === mat &&
        String(x["Grupo"] || "").trim().toLowerCase() === gru;
    });
  }
  if (!a) {
    a = filas.find(function (x) {
      return celdaAlumno(x, ["Matrícula", "Matricula", "No.", "N°"]) === mat;
    });
  }
  return a || null;
}

function contarIntentosAlumno(matricula) {
  const mBuscada = String(matricula || "").trim().toLowerCase();
  if (!mBuscada) return 0;
  return leerResultadosDeTodasLasPestanas().filter(function (r) {
    return String(r.matricula || "").trim().toLowerCase() === mBuscada;
  }).length;
}

function intentosPermitidosDe(alumno) {
  const extraAlumno = Number(alumno["Intentos extra"] || alumno.extra || 0);
  const base = Number(leerConfig("INTENTOS_DEFAULT", "1"));
  const extraGrupo = extraGrupoDe_(alumno["Grupo"] || alumno.grupo);
  return base + extraAlumno + extraGrupo;
}

function mensajeCupoDisponible(nombre, usados, permitidos, restantes) {
  const etiqueta = permitidos === 1 ? "intento" : "intentos";
  if (usados === 0 && permitidos === 1) return "Hola, " + nombre + ". Tienes 1 intento para presentar el examen.";
  if (usados === 0) return "Hola, " + nombre + ". Tienes " + permitidos + " " + etiqueta + ". Aún no has presentado el examen.";
  const queda = restantes === 1 ? "Te queda 1 intento" : "Te quedan " + restantes + " intentos";
  return "Hola, " + nombre + ". " + queda + " de " + permitidos + ". Ya presentaste " + usados + (usados === 1 ? " vez." : " veces.");
}

function mensajeCupoAgotado(usados, permitidos) {
  if (permitidos === 1) {
    return "Ya agotaste tu 1 intento (" + usados + (usados === 1 ? " usado" : " usados") + "). Pide a un docente una oportunidad extra.";
  }
  return "Ya agotaste tus " + permitidos + " intentos (" + usados + " usados). Pide a un docente una oportunidad extra.";
}

function consultarCupoAlumno(matricula) {
  const panel = construirPanelAlumno_(matricula, { incluirInactivos: false, voz: "alumno" });
  if (!panel || !panel.ok) return panel || { ok: false, mensaje: "No se encontró al alumno." };
  const nombre = panel.alumno && panel.alumno.nombre ? panel.alumno.nombre : "";

  return {
    ok: true,
    nombre: nombre,
    usados: panel.usados,
    permitidos: panel.permitidos,
    restantes: panel.restantes,
    agotado: !!panel.agotado,
    mensaje: panel.mensaje,
    trimestral: panel.trimestral
  };
}

function altaAlumno(token, datos) {
  exigirAdmin(token);
  const p = obtenerLibro().getSheetByName("Alumnos");
  p.appendRow([
    String(datos.matricula), String(datos.nombre),
    String(datos.grado), String(datos.grupo).toLowerCase(),
    "SI", Number(datos.intentosExtra || 0)
  ]);
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Alumno dado de alta." };
}

function bajaAlumno(token, matricula) {
  exigirAdmin(token);
  const a = filaAlumnoPorMatricula(matricula);
  if (!a) throw new Error("No existe ese alumno.");
  obtenerLibro().getSheetByName("Alumnos").getRange(a._fila, 5).setValue("NO");
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Alumno dado de baja." };
}

function reactivarAlumno(token, matricula) {
  exigirAdmin(token);
  const a = filaAlumnoPorMatricula(matricula);
  if (!a) throw new Error("No existe ese alumno.");
  obtenerLibro().getSheetByName("Alumnos").getRange(a._fila, 5).setValue("SI");
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Alumno reactivado con éxito." };
}

function celdaAlumno(fila, claves) {
  for (let i = 0; i < claves.length; i++) {
    if (fila[claves[i]] != null && String(fila[claves[i]]).trim() !== "") return String(fila[claves[i]]).trim();
  }
  return "";
}

function eliminarAlumno(token, matricula, grupo) {
  exigirAdmin(token);
  const p = obtenerLibro().getSheetByName("Alumnos");
  if (!p || p.getLastRow() < 2) throw new Error("No hay alumnos registrados.");
  const filas = leerFilas("Alumnos");
  const mat = String(matricula || "").trim();
  const gru = String(grupo || "").trim().toLowerCase();
  let a = null;
  if (gru) {
    a = filas.find(function (x) {
      return celdaAlumno(x, ["Matrícula", "Matricula", "No.", "N°"]) === mat &&
        String(x["Grupo"] || "").trim().toLowerCase() === gru;
    });
  }
  if (!a) {
    a = filas.find(function (x) { return celdaAlumno(x, ["Matrícula", "Matricula", "No.", "N°"]) === mat; });
  }
  if (!a) throw new Error("No se encontró el alumno con matrícula " + mat + (gru ? (" en el grupo " + gru.toUpperCase()) : "") + ".");
  p.deleteRow(a._fila);
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Alumno eliminado definitivamente." };
}

function eliminarAlumnosMultiples(token, matriculas) {
  exigirAdmin(token);
  const items = (typeof matriculas === "string") ? JSON.parse(matriculas) : matriculas;
  if (!Array.isArray(items) || !items.length) throw new Error("No se seleccionaron alumnos.");
  const p = obtenerLibro().getSheetByName("Alumnos");
  if (!p || p.getLastRow() < 2) return { ok: true, mensaje: "Sin alumnos." };
  const filas = leerFilas("Alumnos");
  const matsSet = {};
  const pares = {};
  items.forEach(function (m) {
    if (m && typeof m === "object") {
      const mat = String(m.matricula || m.mat || "").trim();
      const gru = String(m.grupo || "").trim().toLowerCase();
      if (mat && gru) pares[mat + "|" + gru] = true;
      else if (mat) matsSet[mat] = true;
    } else {
      const s = String(m || "").trim();
      const partes = s.split("||");
      if (partes.length === 2) pares[partes[0] + "|" + partes[1].toLowerCase()] = true;
      else matsSet[s] = true;
    }
  });
  
  const conservar = [ENCABEZADOS.Alumnos];
  filas.forEach(function (a) {
    const mat = celdaAlumno(a, ["Matrícula", "Matricula", "No.", "N°"]);
    const gru = String(a["Grupo"] || "").trim().toLowerCase();
    if (pares[mat + "|" + gru] || matsSet[mat]) return;
    conservar.push([
      mat, celdaAlumno(a, ["Nombre Completo", "Nombre", "Alumno"]),
      String(a["Grado"] || ""), gru,
      String(a["Activo"] || "SI"), Number(a["Intentos extra"] || 0)
    ]);
  });
  p.clearContents();
  p.getRange(1, 1, conservar.length, ENCABEZADOS.Alumnos.length).setValues(conservar);
  p.getRange(1, 1, 1, ENCABEZADOS.Alumnos.length).setFontWeight("bold");
  invalidarCachesDatos_();
  return { ok: true, mensaje: items.length + " alumno(s) eliminado(s) de la base de datos." };
}

function cambiarGrupoAlumno(token, matricula, grupoNuevo) {
  exigirAdmin(token);
  const a = filaAlumnoPorMatricula(matricula);
  if (!a) throw new Error("No existe ese alumno.");
  const g = String(grupoNuevo).trim().toLowerCase();
  const gradoNum = normalizarGradoServer(g) || String(a["Grado"]) || "1";
  const p = obtenerLibro().getSheetByName("Alumnos");
  p.getRange(a._fila, 3).setValue(gradoNum);
  p.getRange(a._fila, 4).setValue(g);
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Alumno movido al grupo " + g.toUpperCase() + "." };
}

function cambiarGrupoAlumnosMultiples(token, matriculas, grupoNuevo) {
  exigirAdmin(token);
  if (!Array.isArray(matriculas) || !matriculas.length) throw new Error("No se seleccionaron alumnos.");
  const g = String(grupoNuevo).trim().toLowerCase();
  const gradoNum = normalizarGradoServer(g) || "1";
  const p = obtenerLibro().getSheetByName("Alumnos");
  if (!p || p.getLastRow() < 2) return { ok: true };
  const filas = leerFilas("Alumnos");
  const matsSet = {};
  matriculas.forEach(function (m) { matsSet[String(m).trim()] = true; });
  
  const matriz = [ENCABEZADOS.Alumnos];
  filas.forEach(function (a) {
    const esMod = matsSet[String(a["Matrícula"]).trim()];
    matriz.push([
      String(a["Matrícula"]), String(a["Nombre Completo"]),
      esMod ? gradoNum : String(a["Grado"]),
      esMod ? g : String(a["Grupo"]).toLowerCase(),
      String(a["Activo"] || "SI"),
      Number(a["Intentos extra"] || 0)
    ]);
  });
  p.clearContents();
  p.getRange(1, 1, matriz.length, ENCABEZADOS.Alumnos.length).setValues(matriz);
  p.getRange(1, 1, 1, ENCABEZADOS.Alumnos.length).setFontWeight("bold");
  invalidarCachesDatos_();
  return { ok: true, mensaje: matriculas.length + " alumno(s) asignado(s) al grupo " + g.toUpperCase() + "." };
}

function asignarIntentosExtra(token, matricula, extra) {
  const ses = exigirRoles_(token, ["admin", "docente", "prefecto"]);
  const a = filaAlumnoPorMatricula(matricula);
  if (!a) throw new Error("No existe ese alumno.");

  const rol = String(ses.rol || "").toLowerCase();
  const kAlu = String(a["Grado"] || "") + String(a["Grupo"] || "").toUpperCase();

  if (rol === "docente") {
    const gruposDocente = {};
    const maestroId = String(ses.maestroId || "");
    const nombreDoc = String(ses.nombre || "").toLowerCase();
    try {
      leerFilas("Horarios").forEach(function (h) {
        const m = String(h["Maestro"] || "").toLowerCase();
        if (m === nombreDoc || (maestroId && String(h["Id Maestro"] || "") === maestroId)) {
          const k = String(h["Grado"] || "") + String(h["Grupo"] || "").toUpperCase();
          gruposDocente[k] = true;
        }
      });
    } catch (eH) {}
    if (!gruposDocente[kAlu]) {
      throw new Error("Acceso denegado: no tienes asignado al grupo del alumno.");
    }
  } else if (rol === "prefecto") {
    const prefId = String(ses.prefectoId || "");
    const gruposPrefecto = {};
    try {
      leerFilas("PrefectoGrupos").forEach(function (f) {
        if (String(f["Id prefecto"] || "") === prefId) {
          const k = String(f["Grado"] || "") + String(f["Grupo"] || "").toUpperCase();
          gruposPrefecto[k] = true;
        }
      });
    } catch (eP) {}
    if (!gruposPrefecto[kAlu]) {
      throw new Error("Acceso denegado: el alumno no pertenece a los grupos asignados al prefecto.");
    }
  }

  obtenerLibro().getSheetByName("Alumnos").getRange(a._fila, 6).setValue(Number(extra || 0));
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Intentos extra actualizados." };
}

function asignarIntentosExtraAlumnosMultiples(token, matriculas, extra) {
  exigirAdmin(token);
  if (!Array.isArray(matriculas) || !matriculas.length) throw new Error("No se seleccionaron alumnos.");
  const p = obtenerLibro().getSheetByName("Alumnos");
  if (!p || p.getLastRow() < 2) return { ok: true };
  const filas = leerFilas("Alumnos");
  const matsSet = {};
  matriculas.forEach(function (m) { matsSet[String(m).trim()] = true; });
  const nExtra = Number(extra || 0);

  const matriz = [ENCABEZADOS.Alumnos];
  filas.forEach(function (a) {
    const esMod = matsSet[String(a["Matrícula"]).trim()];
    matriz.push([
      String(a["Matrícula"]), String(a["Nombre Completo"]),
      String(a["Grado"]), String(a["Grupo"]).toLowerCase(),
      String(a["Activo"] || "SI"),
      esMod ? nExtra : Number(a["Intentos extra"] || 0)
    ]);
  });
  p.clearContents();
  p.getRange(1, 1, matriz.length, ENCABEZADOS.Alumnos.length).setValues(matriz);
  p.getRange(1, 1, 1, ENCABEZADOS.Alumnos.length).setFontWeight("bold");
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Intentos extra asignados a " + matriculas.length + " alumno(s)." };
}

function generarAlumnosSimuladosAdmin(token) {
  exigirAdmin(token);
  generarAlumnosSimulados_();
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Se han generado 75 alumnos de demostración en los grupos de 1°, 2° y 3°." };
}

function vaciarMatriculaAdmin(token) {
  exigirAdmin(token);
  const p = obtenerLibro().getSheetByName("Alumnos");
  if (p) {
    p.clearContents();
    p.getRange(1, 1, 1, ENCABEZADOS.Alumnos.length).setValues([ENCABEZADOS.Alumnos]).setFontWeight("bold");
  }
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Toda la lista de alumnos ha sido vaciada." };
}

function altaGrupo(token, grado, grupo) {
  exigirAdmin(token);
  obtenerLibro().getSheetByName("Grupos").appendRow([String(grado), String(grupo).toLowerCase(), "SI", 0]);
  return { ok: true, mensaje: "Grupo creado." };
}

function asignarIntentosExtraGrupo(token, grupo, extra) {
  exigirAdmin(token);
  const filas = leerFilas("Grupos");
  const p = obtenerLibro().getSheetByName("Grupos");
  let ok = false;
  filas.forEach(function (g) {
    if (String(g["Grupo"]).toLowerCase() === String(grupo).toLowerCase()) {
      p.getRange(g._fila, 4).setValue(Number(extra || 0));
      ok = true;
    }
  });
  if (!ok) throw new Error("No existe ese grupo. Créalo primero.");
  return { ok: true, mensaje: "Intentos extra del grupo actualizados." };
}

function guardarIntentosDefault(token, valor) {
  exigirAdmin(token);
  escribirConfig_("INTENTOS_DEFAULT", String(valor));
  return { ok: true, mensaje: "Intentos por defecto actualizados." };
}

function sembrarGrupos_() {
  const libro = obtenerLibro();
  if (!libro) return;
  const p = libro.getSheetByName("Grupos");
  if (!p) return;
  if (p.getLastRow() >= 2) return;
  const ID_PRODUCCION = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  const idReal = typeof libro.getId === "function" ? String(libro.getId() || "").trim() : "";
  if (idReal === ID_PRODUCCION) {
    if (p.getLastRow() < 1) {
      p.appendRow(ENCABEZADOS.Grupos);
    }
    return;
  }
  const filas = [ENCABEZADOS.Grupos];
  ["1", "2", "3"].forEach(function (grado) {
    ["a", "b", "c", "d", "e"].forEach(function (l) { filas.push([grado, grado + l, "SI", 0]); });
  });
  p.clearContents();
  p.getRange(1, 1, filas.length, 4).setValues(filas);
  p.getRange(1, 1, 1, 4).setFontWeight("bold");
}

function uniq(lista) {
  const visto = {}, out = [];
  lista.forEach(function (x) { if (!visto[x]) { visto[x] = true; out.push(x); } });
  return out;
}

/**********************************************************************
 * DATOS DE PRUEBA Y BANCO
 **********************************************************************/
function asegurarDatosDePrueba_() {
  const libro = obtenerLibro();
  if (!libro) return;
  const ID_PRODUCCION = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  const idReal = typeof libro.getId === "function" ? String(libro.getId() || "").trim() : "";
  if (idReal === ID_PRODUCCION) return;
  const al = libro.getSheetByName("Alumnos");
  if (al && al.getLastRow() < 2) generarAlumnosSimulados_();
  completarBancoLecturas_();
  const gr = libro.getSheetByName("Grupos");
  if (gr && gr.getLastRow() < 2) sembrarGrupos_();
}

function generarAlumnosSimulados_() {
  const libro = obtenerLibro();
  if (!libro) return;
  const ID_PRODUCCION = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  const idReal = typeof libro.getId === "function" ? String(libro.getId() || "").trim() : "";
  if (idReal === ID_PRODUCCION) {
    throw new Error("BLOQUEO DE SEGURIDAD: generarAlumnosSimulados no puede ejecutarse sobre el libro de producción.");
  }
  verificarYCrearPestanas();
  const nm = ["Juan","Pedro","Luis","Carlos","Omar","Alejandro","Jorge","Miguel","Angel","David"];
  const nf = ["Mariana","Sofia","Maria","Laura","Elena","Ana","Gabriela","Camila","Fernanda","Lucia"];
  const ap = ["Martinez","Lopez","Perez","Rodriguez","Gomez","Sanchez","Hernandez","Diaz","Garcia","Flores"];
  const filas = [ENCABEZADOS.Alumnos];
  let mat = 24001;
  ["1","2","3"].forEach(function (g) {
    ["a","b","c","d","e"].forEach(function (l) {
      const grupo = g + l;
      for (let i = 0; i < 5; i++) {
        const banco = (i % 2 === 0) ? nm : nf;
        const nombre = banco[Math.floor(Math.random() * banco.length)] + " " +
          ap[Math.floor(Math.random() * ap.length)] + " " +
          ap[Math.floor(Math.random() * ap.length)];
        filas.push([String(mat++), nombre, g, grupo, "SI", 0]);
      }
    });
  });
  const p = libro.getSheetByName("Alumnos");
  p.clearContents();
  p.getRange(1, 1, filas.length, ENCABEZADOS.Alumnos.length).setValues(filas);
  p.getRange(1, 1, 1, ENCABEZADOS.Alumnos.length).setFontWeight("bold");
  sembrarGrupos_();
}

function temasBancoPorAsignatura() {
  return {
    "Español": "La bitácora del taller",
    "Historia": "La independencia en el barrio",
    "Ciencias": "El ciclo del agua en la ciudad",
    "Formación Cívica y Ética": "Normas y acuerdos escolares",
    "Tecnología": "Ahorrar energía en el aula",
    "Matemáticas": "Medir y comparar datos del patio"
  };
}

function completarBancoLecturas_(forzar) {
  const libro = obtenerLibro();
  if (!libro) return;
  const props = PropertiesService.getScriptProperties();
  const entorno = String(props.getProperty("ENTORNO") || "").trim().toUpperCase();
  const idConfig = String(props.getProperty("HOJA_ID") || "").trim();
  const ID_PRODUCCION = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  const idReal = typeof libro.getId === "function" ? String(libro.getId() || "").trim() : "";
  const esProduccion = (entorno === "PRODUCCION" || idReal === ID_PRODUCCION || idConfig === ID_PRODUCCION);

  // En producción NUNCA se permite reconstrucción forzada destructiva
  if (esProduccion && forzar) {
    forzar = false;
  }

  // En pruebas, solo se permite forzar si el entorno y libro están inequívocamente autorizados
  const esPruebasAutorizado = (entorno === "PRUEBAS" && !esProduccion && idConfig && idReal && idReal === idConfig && idReal !== ID_PRODUCCION);
  if (forzar && !esPruebasAutorizado) {
    forzar = false;
  }

  let p = libro.getSheetByName("Lecturas");
  if (!p) { verificarYCrearPestanas(); p = libro.getSheetByName("Lecturas"); }
  if (!p) return;
  if (!forzar && p.getLastRow() >= 2) return;

  const temas = temasBancoPorAsignatura();
  const catalogoDefault = [];
  ["1","2","3"].forEach(function (g) {
    ASIGNATURAS_DEFAULT.forEach(function (asig) {
      catalogoDefault.push(construirLecturaBanco(g, asig, temas[asig]));
    });
  });

  const pPreg = libro.getSheetByName("Preguntas");

  if (forzar) {
    // Reconstrucción forzada destructiva: permitida ÚNICAMENTE en entorno de pruebas autorizado
    p.clearContents();
    const filas = [ENCABEZADOS.Lecturas].concat(catalogoDefault.map(filaLectura));
    p.getRange(1, 1, filas.length, ENCABEZADOS.Lecturas.length).setValues(filas);
    p.getRange(1, 1, 1, ENCABEZADOS.Lecturas.length).setFontWeight("bold");

    if (pPreg) {
      pPreg.clearContents();
      pPreg.appendRow(ENCABEZADOS.Preguntas);
      pPreg.getRange(1, 1, 1, ENCABEZADOS.Preguntas.length).setFontWeight("bold");
      const filasPreg = [];
      catalogoDefault.forEach(function (item) {
        (item.preguntas || []).forEach(function (pr, i) {
          filasPreg.push(filaPreguntaParaHoja(item.id, i + 1, pr));
        });
      });
      if (filasPreg.length) {
        pPreg.getRange(2, 1, filasPreg.length, ENCABEZADOS.Preguntas.length).setValues(filasPreg);
      }
    }
    formatearHojasDeLectura();
    return;
  }

  // Flujo ordinario / no forzado: PRESERVAR registros existentes sin borrar nada
  if (p.getLastRow() < 1) {
    p.getRange(1, 1, 1, ENCABEZADOS.Lecturas.length).setValues([ENCABEZADOS.Lecturas]).setFontWeight("bold");
  }

  const idsExistentes = {};
  if (p.getLastRow() >= 2) {
    const vals = p.getRange(2, 1, p.getLastRow() - 1, 1).getValues();
    vals.forEach(function (r) {
      const id = String(r[0] || "").trim();
      if (id) idsExistentes[id] = true;
    });
  }

  const lecturasFaltantes = catalogoDefault.filter(function (item) {
    return !idsExistentes[item.id];
  });

  if (lecturasFaltantes.length > 0) {
    const filasParaAgregar = lecturasFaltantes.map(filaLectura);
    const startRow = p.getLastRow() + 1;
    p.getRange(startRow, 1, filasParaAgregar.length, ENCABEZADOS.Lecturas.length).setValues(filasParaAgregar);
  }

  if (pPreg) {
    if (pPreg.getLastRow() < 1) {
      pPreg.getRange(1, 1, 1, ENCABEZADOS.Preguntas.length).setValues([ENCABEZADOS.Preguntas]).setFontWeight("bold");
    }
    const clavesPregExistentes = {};
    if (pPreg.getLastRow() >= 2) {
      const numCols = Math.min(Math.max(pPreg.getLastColumn(), 1), ENCABEZADOS.Preguntas.length);
      const datosPreg = pPreg.getRange(2, 1, pPreg.getLastRow() - 1, numCols).getValues();
      datosPreg.forEach(function (r) {
        const idLec = String(r[0] || "").trim();
        const numP = String(r[1] || "").trim();
        if (idLec && numP) {
          clavesPregExistentes[idLec + "_" + numP] = true;
        }
      });
    }

    const filasPregNuevas = [];
    catalogoDefault.forEach(function (item) {
      (item.preguntas || []).forEach(function (pr, i) {
        const numP = i + 1;
        const clave = item.id + "_" + numP;
        if (!clavesPregExistentes[clave]) {
          filasPregNuevas.push(filaPreguntaParaHoja(item.id, numP, pr));
        }
      });
    });

    if (filasPregNuevas.length > 0) {
      const startRowPreg = pPreg.getLastRow() + 1;
      pPreg.getRange(startRowPreg, 1, filasPregNuevas.length, ENCABEZADOS.Preguntas.length).setValues(filasPregNuevas);
    }
  }

  formatearHojasDeLectura();
}

function filaLectura(item) {
  return [
    item.id, item.grado, item.asignatura, item.tema, item.texto,
    contarPalabras(item.texto), JSON.stringify(item.preguntas), "SI", item.origen || "BANCO"
  ];
}

function construirLecturaBanco(grado, asignatura, tema) {
  const spec = especificacionesDeGrado(grado);
  const pack = contenidoTematico(asignatura);
  const temaFinal = tema || pack.tema;
  let texto = asegurarFormatoLibro(pack.texto);
  texto = expandirTextoHasta(texto, spec.objetivoPalabras, grado, asignatura, temaFinal, pack.relleno);
  texto = ajustarTextoAEspecificacion(texto, grado, asignatura, temaFinal, spec);
  const preguntas = seleccionarReactivosPorGrado(grado, asignatura);
  return {
    id: "BANCO_" + grado + "_" + asignatura.replace(/\s+/g, "").substring(0, 10),
    grado: grado, asignatura: asignatura, tema: temaFinal,
    texto: texto, preguntas: preguntas, origen: "BANCO"
  };
}

/**********************************************************************
 * UTILIDADES DE TEXTO
 **********************************************************************/
function contarPalabras(texto) {
  const sinHtml = String(texto || "").replace(/<[^>]+>/g, " ").replace(/&[a-z0-9#]+;/gi, " ");
  return sinHtml.trim().split(/\s+/).filter(Boolean).length;
}

function asegurarFormatoLibro(texto) {
  const t = String(texto || "").replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!t) return "";
  if (/\n\s*\n/.test(t)) return t;
  const ors = t.match(/[^.!?]+[.!?]+(?:["»”']*)(?:\s+|$)|[^.!?]+$/g);
  if (!ors || ors.length < 4) return t;
  const gs = []; let buf = [];
  ors.forEach(function (o) {
    buf.push(o.trim());
    if (buf.length >= 3) { gs.push(buf.join(" ")); buf = []; }
  });
  if (buf.length) gs.push(buf.join(" "));
  return gs.join("\n\n");
}

function expandirTextoHasta(texto, minimo, grado, asignatura, tema, rellenoExtra) {
  const bloques = [];
  const usados = {};
  if (rellenoExtra) rellenoExtra.forEach(function (b) { bloques.push(String(b).trim()); });
  parrafosContinuacion(grado, asignatura, tema).forEach(function (b) { bloques.push(b); });
  bloques.forEach(function (b, i) { usados[b] = i; });

  let t = asegurarFormatoLibro(texto);
  let i = 0;
  let vueltas = 0;
  while (contarPalabras(t) < minimo && i < bloques.length) {
    const bloque = bloques[i];
    if (t.indexOf(bloque) < 0) t += "\n\n" + bloque;
    i++;
    if (i >= bloques.length && contarPalabras(t) < minimo) {
      vueltas++;
      if (vueltas >= 1) break; // no repetimos
      i = 0;
    }
  }
  return t.trim();
}

/**********************************************************************
 * PREGUNTAS
 **********************************************************************/
function preguntaDesdeFilaHoja(p) {
  const ops = [];
  ["Opción 1","Opción 2","Opción 3","Opción 4","Opción 5","Opción 6"].forEach(function (c) {
    const v = String(p[c] || "").trim();
    if (v) ops.push(v);
  });
  const en = String(p["Enunciado"] || "").trim();
  const r = String(p["Respuesta correcta"] || "").trim();
  if (!en || ops.length < 2) return null;
  return { p: en, opciones: ops, respuesta: r, nivel: normalizarNivelComprension(p["Nivel"]) };
}

function preguntasDeLectura(lecturaOId) {
  const fila = typeof lecturaOId === "object" && lecturaOId ? lecturaOId : buscarLecturaPorId(String(lecturaOId || ""));
  if (fila) {
    try {
      const json = JSON.parse(fila["Preguntas JSON"] || "[]");
      if (Array.isArray(json) && json.length) {
        return json.map(normalizarPreguntaAdmin).filter(Boolean);
      }
    } catch (e) {}
  }
  const id = fila ? String(fila["ID Lectura"] || "") : String(lecturaOId || "");
  if (!id) return [];
  const deHoja = leerFilas("Preguntas")
    .filter(function (p) { return String(p["ID Lectura"]) === String(id); })
    .sort(function (a, b) { return Number(a["Orden"] || 0) - Number(b["Orden"] || 0); })
    .map(preguntaDesdeFilaHoja).filter(Boolean);
  return fusionarNivelesDesdeJson_(deHoja, fila && fila["Preguntas JSON"]);
}

function mapaPreguntasPorId() {
  const p = obtenerLibro().getSheetByName("Preguntas");
  if (!p || p.getLastRow() < 2) return {};
  const valores = p.getDataRange().getValues();
  if (valores.length < 2) return {};
  const enc = valores[0].map(function (h) { return String(h).trim(); });
  
  const colId = enc.indexOf("ID Lectura");
  const colOrden = enc.indexOf("Orden");
  const colEn = enc.indexOf("Enunciado");
  const colR = enc.indexOf("Respuesta correcta");
  const colOp1 = enc.indexOf("Opción 1");
  let colNivel = -1;
  for (let i = 0; i < enc.length; i++) {
    if (enc[i] === "Nivel") colNivel = i;
  }
  
  const mapa = {};
  for (let i = 1; i < valores.length; i++) {
    const r = valores[i];
    const id = String(colId >= 0 ? r[colId] : r[0] || "");
    if (!id) continue;
    const en = String(colEn >= 0 ? r[colEn] : r[2] || "").trim();
    const resp = String(colR >= 0 ? r[colR] : r[9] || "").trim();
    const ops = [];
    for (let c = 0; c < 6; c++) {
      const idx = (colOp1 >= 0 ? colOp1 : 3) + c;
      const v = String(r[idx] || "").trim();
      if (v) ops.push(v);
    }
    if (en && ops.length >= 2) {
      if (!mapa[id]) mapa[id] = [];
      mapa[id].push({
        p: en,
        opciones: ops,
        respuesta: resp,
        nivel: normalizarNivelComprension(colNivel >= 0 ? r[colNivel] : ""),
        _orden: Number(colOrden >= 0 ? r[colOrden] : i)
      });
    }
  }
  Object.keys(mapa).forEach(function (id) {
    mapa[id].sort(function (a, b) { return a._orden - b._orden; });
  });
  return mapa;
}

function reemplazarPreguntasDeLectura_(id, preguntas) {
  const idStr = String(id || "").trim();
  if (!idStr) throw new Error("Falta el identificador de la lectura.");
  const p = obtenerLibro().getSheetByName("Preguntas");
  if (!p) return;
  const filas = leerFilas("Preguntas");
  const filasConservar = filas.filter(function (x) {
    return String(x["ID Lectura"]) !== idStr;
  });
  
  p.clearContents();
  p.appendRow(ENCABEZADOS.Preguntas);
  p.getRange(1, 1, 1, ENCABEZADOS.Preguntas.length).setFontWeight("bold");
  
  const matriz = [];
  filasConservar.forEach(function (x) {
    matriz.push(filaPreguntaParaHoja(x["ID Lectura"], x["Orden"] || 1, {
      p: x["Enunciado"] || "",
      opciones: [x["Opción 1"], x["Opción 2"], x["Opción 3"], x["Opción 4"], x["Opción 5"], x["Opción 6"]],
      respuesta: x["Respuesta correcta"] || "",
      nivel: x["Nivel"] || ""
    }));
  });
  
  (preguntas || []).forEach(function (pr, i) {
    matriz.push(filaPreguntaParaHoja(idStr, i + 1, pr));
  });
  
  if (matriz.length) {
    p.getRange(2, 1, matriz.length, ENCABEZADOS.Preguntas.length).setValues(matriz);
  }
}

function filaPreguntaParaHoja(id, orden, pr) {
  const ops = (pr && pr.opciones ? pr.opciones : []).slice(0, 6);
  return [
    id, orden, (pr && pr.p) || "",
    ops[0] || "", ops[1] || "", ops[2] || "",
    ops[3] || "", ops[4] || "", ops[5] || "",
    (pr && pr.respuesta) || "",
    normalizarNivelComprension(pr && pr.nivel)
  ];
}

function pregunta(p, correcta, distractores, nivel) {
  return { p: p, opciones: mezclar([correcta].concat(distractores)), respuesta: correcta, nivel: normalizarNivelComprension(nivel) };
}

function mezclar(lista) {
  const c = lista.slice();
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = c[i]; c[i] = c[j]; c[j] = t;
  }
  return c;
}

function buscarLecturaPorId(id) {
  const buscado = String(id || "").trim();
  if (!buscado) return null;
  const libro = obtenerLibro();
  if (!libro) return null;
  const p = libro.getSheetByName("Lecturas");
  if (!p || p.getLastRow() < 2) return null;
  const last = p.getLastRow();
  const nCols = Math.max(p.getLastColumn(), ENCABEZADOS.Lecturas.length);
  const ids = p.getRange(1, 1, last, 1).getValues();
  for (let i = 1; i < ids.length; i++) {
    if (String(ids[i][0] || "").trim() !== buscado) continue;
    const enc = p.getRange(1, 1, 1, nCols).getValues()[0];
    const row = p.getRange(i + 1, 1, 1, nCols).getValues()[0];
    const fila = {};
    enc.forEach(function (h, c) { fila[String(h).trim()] = row[c]; });
    fila._fila = i + 1;
    return fila;
  }
  return null;
}

function normalizarPreguntaAdmin(p) {
  const ops = (p.opciones || []).map(function (o) { return String(o || "").trim(); }).filter(Boolean);
  const en = String((p && p.p) || "").trim();
  const r = String((p && p.respuesta) || "").trim();
  if (!en || ops.length < 2 || ops.indexOf(r) < 0) return null;
  return { p: en, opciones: ops, respuesta: r, nivel: normalizarNivelComprension(p && p.nivel) };
}

/**********************************************************************
 * PANEL DEL ALUMNO Y SORTEO SIN REPETIR LECTURA
 **********************************************************************/
function claveTemaLectura_(asignatura, tema) {
  return String(asignatura || "").trim().toLowerCase() + "|" + String(tema || "").trim().toLowerCase();
}

function exclusionLecturasDeResultados_(matricula, resultados) {
  const m = String(matricula || "").trim().toLowerCase();
  const ids = {};
  const temasSinId = {};
  const presentadas = [];
  (resultados || []).forEach(function (r) {
    if (String(r.matricula || "").trim().toLowerCase() !== m) return;
    const id = String(r.idLectura || "").trim();
    const asig = String(r.asignatura || "").trim();
    const tema = String(r.tema || "").trim();
    if (id) ids[id] = true;
    else if (asig && tema) temasSinId[claveTemaLectura_(asig, tema)] = true;
    presentadas.push({
      idLectura: id,
      asignatura: asig,
      tema: tema,
      fecha: r.fecha || "",
      fechaIso: r.fechaIso || "",
      modo: String(r.modo || ""),
      trimestre: String(r.trimestre || ""),
      comprension: Number(r.comprension || 0),
      ppm: Number(r.ppm || 0),
      global: Number(r.global || 0),
      pme: Number(r.pme || 0),
      intento: Number(r.intento || 0),
      nivelPpm: String(r.nivelPpm || ""),
      aciertos: Number(r.aciertos || 0),
      relecturas: Number(r.relecturas || 0),
      tLectura: Number(r.tLectura || 0),
      tReactivos: Number(r.tReactivos || 0),
      segundosPregunta: r.segundosPregunta || [],
      desglose: r.desglose || null,
      recomendacion: String(r.recomendacion || "")
    });
  });
  return { ids: ids, temasSinId: temasSinId, presentadas: presentadas };
}

function lecturaYaPresentada_(l, excl) {
  if (!excl) return false;
  const id = String(l["ID Lectura"] || "").trim();
  if (id && excl.ids && excl.ids[id]) return true;
  if (excl.temasSinId && excl.temasSinId[claveTemaLectura_(l["Asignatura"], l["Tema"])]) return true;
  return false;
}

function leerLecturasIndice_() {
  if (memoLecturasIdx_) return memoLecturasIdx_;
  const cacheados = cacheGetJson_("lecturas_idx");
  if (cacheados && cacheados.length) {
    memoLecturasIdx_ = cacheados;
    return cacheados;
  }
  const libro = obtenerLibro();
  const p = libro && libro.getSheetByName("Lecturas");
  if (!p || p.getLastRow() < 2) {
    memoLecturasIdx_ = [];
    return [];
  }
  const last = p.getLastRow();
  const meta = p.getRange(1, 1, last, 4).getValues();
  const pal = p.getRange(1, 6, last, 1).getValues();
  const act = p.getRange(1, 8, last, 2).getValues();
  const out = [];
  for (let i = 1; i < meta.length; i++) {
    const id = String(meta[i][0] || "").trim();
    if (!id) continue;
    out.push({
      "ID Lectura": id,
      "Grado": String(meta[i][1] || ""),
      "Asignatura": String(meta[i][2] || ""),
      "Tema": String(meta[i][3] || ""),
      "Palabras": Number(pal[i] && pal[i][0] || 0),
      "Activa": String((act[i] && act[i][0]) || "SI"),
      "Origen": String((act[i] && act[i][1]) || "")
    });
  }
  memoLecturasIdx_ = out;
  cachePutJson_("lecturas_idx", out, 180);
  return out;
}

function lecturasActivasDeGrado_(grado) {
  return leerLecturasIndice_().filter(function (l) {
    return String(l["Grado"]) === String(grado) && String(l["Activa"]).toUpperCase() !== "NO";
  });
}

function totalPreguntasDeEval_(e) {
  const segs = e && e.segundosPregunta;
  if (Array.isArray(segs) && segs.length) return segs.length;
  const d = e && e.desglose;
  if (d) {
    let t = 0;
    ["literal", "inferencial", "critica"].forEach(function (k) {
      if (d[k]) t += Number(d[k].total || 0);
    });
    if (t) return t;
  }
  const c = Number(e && e.comprension);
  const a = Number(e && e.aciertos);
  if (c > 0 && a > 0) return Math.max(a, Math.round((a * 100) / c));
  return a || 0;
}

function partirFechaHora_(fecha) {
  const s = String(fecha || "").trim();
  const m = s.match(/^(\d{1,2}\/\d{1,2}\/\d{2,4})(?:\s+(\d{1,2}:\d{2}(?::\d{2})?))?/);
  if (m) return { fecha: m[1], hora: m[2] || "" };
  return { fecha: s, hora: "" };
}

function adjuntarInformesEvaluaciones_(crono, alumno, permitidos, spec) {
  (crono || []).forEach(function (e, i) {
    const prev = crono.slice(0, i);
    const nPrev = prev.length;
    let hist = { n: 0, promedioGlobal: null, promedioComprension: null };
    if (nPrev) {
      const sumG = prev.reduce(function (a, r) { return a + Number(r.global || 0); }, 0);
      const sumC = prev.reduce(function (a, r) { return a + Number(r.comprension || 0); }, 0);
      hist = {
        n: nPrev,
        promedioGlobal: Math.round((sumG / nPrev) * 10) / 10,
        promedioComprension: Math.round((sumC / nPrev) * 10) / 10
      };
    }
    let deltaGlobal = null;
    if (hist.n && hist.promedioGlobal != null) {
      deltaGlobal = Math.round((Number(e.global || 0) - hist.promedioGlobal) * 10) / 10;
    }
    const fh = partirFechaHora_(e.fecha);
    e.informe = {
      comprension: e.comprension,
      aciertos: e.aciertos,
      total: totalPreguntasDeEval_(e),
      ppm: e.ppm,
      nivelPpm: e.nivelPpm,
      global: e.global,
      pme: e.pme,
      relecturas: e.relecturas,
      desglose: e.desglose,
      recomendacion: e.recomendacion || "",
      tiempoLectura: e.tLectura,
      tiempoReactivos: e.tReactivos,
      tiemposPregunta: resumenTiemposPregunta(e.segundosPregunta || []),
      historial: {
        n: hist.n,
        promedioGlobal: hist.promedioGlobal,
        promedioComprension: hist.promedioComprension,
        deltaGlobal: deltaGlobal
      },
      spec: {
        ppmMin: spec.ppmMin,
        ppmMax: spec.ppmMax,
        ppmObjetivo: spec.ppmObjetivo
      },
      datos: {
        escuela: nombreEscuela_(),
        nombre: String((alumno && alumno["Nombre Completo"]) || ""),
        matricula: String((alumno && alumno["Matrícula"]) || ""),
        grado: String((alumno && alumno["Grado"]) || ""),
        grupo: String((alumno && alumno["Grupo"]) || ""),
        asignatura: e.asignatura || "",
        tema: e.tema || "",
        intento: e.intento || "",
        permitidos: permitidos,
        fecha: fh.fecha,
        hora: fh.hora
      }
    };
  });
}

function construirPanelAlumno_(matricula, opciones) {
  const opts = opciones || {};
  const vozDocente = opts.voz === "docente";
  const alumno = buscarAlumno(matricula);
  if (!alumno) return { ok: false, mensaje: "No se encontró al alumno." };
  const activo = String(alumno["Activo"]).toUpperCase() !== "NO";
  if (!opts.incluirInactivos && !activo) return { ok: false, mensaje: "Este alumno no está activo." };

  const nombre = String(alumno["Nombre Completo"]);
  const grado = String(alumno["Grado"]);
  const extra = Number(alumno["Intentos extra"] || 0);
  const permitidos = intentosPermitidosDe(alumno);
  const todos = leerResultadosDeTodasLasPestanas() || [];
  const cfgT = leerCfgTrimestral_();
  const excl = exclusionLecturasDeResultados_(matricula, todos);
  const usados = contarIntentosSorteo_(matricula, todos, cfgT);
  const restantes = Math.max(0, permitidos - usados);
  const agotado = restantes === 0;

  const activas = lecturasActivasDeGrado_(grado);
  const disponibles = activas.filter(function (l) { return !lecturaYaPresentada_(l, excl); });
  const sinLecturasNuevas = disponibles.length === 0;

  const crono = excl.presentadas.slice().sort(function (a, b) {
    return String(a.fechaIso || "").localeCompare(String(b.fechaIso || ""));
  });
  adjuntarInformesEvaluaciones_(crono, alumno, permitidos, especificacionesDeGrado(grado));
  const evals = crono.slice().reverse();

  let promedioGlobal = null;
  let promedioComprension = null;
  let promedioPpm = null;
  let promedioPme = null;
  const n = evals.length;
  if (n) {
    promedioGlobal = Math.round((evals.reduce(function (a, r) { return a + Number(r.global || 0); }, 0) / n) * 10) / 10;
    promedioComprension = Math.round((evals.reduce(function (a, r) { return a + Number(r.comprension || 0); }, 0) / n) * 10) / 10;
    promedioPpm = Math.round((evals.reduce(function (a, r) { return a + Number(r.ppm || 0); }, 0) / n) * 10) / 10;
    promedioPme = Math.round((evals.reduce(function (a, r) { return a + Number(r.pme || 0); }, 0) / n) * 10) / 10;
  }

  const vistas = {};
  const lecturasHechas = [];
  evals.forEach(function (e) {
    const k = e.idLectura || claveTemaLectura_(e.asignatura, e.tema);
    if (!k || vistas[k]) return;
    vistas[k] = true;
    lecturasHechas.push({ asignatura: e.asignatura, tema: e.tema });
  });

  let puedePresentar = false;
  let mensaje = "";
  if (!activo) {
    mensaje = vozDocente
      ? "Este alumno está dado de baja. Reactívalo en Matrícula si debe volver a examinar."
      : "Este alumno no está activo.";
  } else if (agotado) {
    mensaje = vozDocente
      ? "Agotó sus intentos (" + usados + " de " + permitidos + "). Asigna extras en Matrícula si necesita otra oportunidad."
      : mensajeCupoAgotado(usados, permitidos);
  } else if (!activas.length) {
    mensaje = vozDocente
      ? "No hay lecturas activas para su grado."
      : "No hay lecturas activas para tu grado. Pide a tu docente que active el banco.";
  } else if (sinLecturasNuevas) {
    mensaje = vozDocente
      ? "Ya presentó todas las lecturas activas de su grado. Activa o genera más lecturas para que pueda examinar de nuevo."
      : "Ya presentaste todas las lecturas disponibles de tu grado. Pide a tu docente que active más lecturas.";
  } else {
    puedePresentar = true;
    mensaje = vozDocente
      ? ("Le quedan " + restantes + (restantes === 1 ? " intento" : " intentos") +
        " y " + disponibles.length + (disponibles.length === 1 ? " lectura nueva." : " lecturas nuevas."))
      : mensajeCupoDisponible(nombre, usados, permitidos, restantes);
  }

  return aJsonSeguro({
    ok: true,
    alumno: {
      matricula: String(alumno["Matrícula"]),
      nombre: nombre,
      grado: grado,
      grupo: String(alumno["Grupo"]),
      activo: activo,
      extra: extra
    },
    escuela: nombreEscuela_(),
    identidad: identidadEscuela_(),
    usados: usados,
    permitidos: permitidos,
    restantes: restantes,
    agotado: agotado,
    lecturasTotales: activas.length,
    lecturasDisponibles: disponibles.length,
    lecturasHechas: lecturasHechas,
    sinLecturasNuevas: sinLecturasNuevas,
    puedePresentar: puedePresentar,
    mensaje: mensaje,
    resumen: {
      n: n,
      promedioGlobal: promedioGlobal,
      promedioComprension: promedioComprension,
      promedioPpm: promedioPpm,
      promedioPme: promedioPme
    },
    evolucion: crono.map(function (e) {
      return {
        fecha: e.fecha,
        global: e.global,
        comprension: e.comprension,
        ppm: e.ppm
      };
    }),
    evaluaciones: evals,
    trimestral: infoLecturaTrimestralDe_(grado, matricula, todos, true)
  });
}

/**********************************************************************
 * LECTURA TRIMESTRAL (UNA POR GRADO Y TRIMESTRE)
 **********************************************************************/
const TZ_MEXICO = "America/Mexico_City";
const MESES_CORTOS_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function claveGrado_(v) {
  const m = String(v || "").match(/([123])/);
  return m ? m[1] : "";
}

function hoyIsoMexico_() {
  return Utilities.formatDate(new Date(), TZ_MEXICO, "yyyy-MM-dd");
}

function cicloEscolarDeFecha_(iso) {
  const s = String(iso || hoyIsoMexico_());
  const y = Number(s.substring(0, 4)) || new Date().getFullYear();
  const m = Number(s.substring(5, 7)) || 1;
  const inicio = m >= 8 ? y : y - 1;
  return { inicio: inicio, fin: inicio + 1, etiqueta: inicio + "-" + String(inicio + 1).slice(-2) };
}

function cfgTrimestralPorDefecto_() {
  const ciclo = cicloEscolarDeFecha_(hoyIsoMexico_());
  const a = String(ciclo.inicio);
  const b = String(ciclo.fin);
  return {
    ciclo: ciclo.etiqueta,
    activo: "auto",
    trimestres: {
      "1": { inicio: a + "-08-24", fin: a + "-11-27", intentos: 1 },
      "2": { inicio: a + "-12-01", fin: b + "-03-27", intentos: 1 },
      "3": { inicio: b + "-04-07", fin: b + "-07-10", intentos: 1 }
    },
    lecturas: {
      "1": { "1": "", "2": "", "3": "" },
      "2": { "1": "", "2": "", "3": "" },
      "3": { "1": "", "2": "", "3": "" }
    }
  };
}

function normalizarCfgTrimestral_(raw) {
  const base = cfgTrimestralPorDefecto_();
  let obj = raw;
  if (typeof raw === "string") {
    try { obj = JSON.parse(raw || "{}"); } catch (e) { obj = {}; }
  }
  obj = obj || {};
  const activoRaw = String(obj.activo || "auto").trim();
  const out = {
    ciclo: String(obj.ciclo || base.ciclo),
    activo: (activoRaw === "1" || activoRaw === "2" || activoRaw === "3") ? activoRaw : "auto",
    trimestres: {},
    lecturas: {}
  };
  ["1", "2", "3"].forEach(function (t) {
    const srcT = (obj.trimestres && obj.trimestres[t]) || {};
    out.trimestres[t] = {
      inicio: String(srcT.inicio || base.trimestres[t].inicio).substring(0, 10),
      fin: String(srcT.fin || base.trimestres[t].fin).substring(0, 10),
      intentos: Math.max(1, parseInt(srcT.intentos, 10) || 1)
    };
    out.lecturas[t] = {};
    ["1", "2", "3"].forEach(function (g) {
      const srcL = (obj.lecturas && obj.lecturas[t]) || {};
      out.lecturas[t][g] = String(srcL[g] || "").trim();
    });
  });
  return out;
}

function leerCfgTrimestral_() {
  const raw = leerConfig("LECTURAS_TRIMESTRALES", "");
  if (!raw) return cfgTrimestralPorDefecto_();
  return normalizarCfgTrimestral_(raw);
}

function idsLecturasTrimestre_(cfg, t) {
  const o = (cfg && cfg.lecturas && cfg.lecturas[String(t)]) || {};
  return ["1", "2", "3"].map(function (g) {
    return String(o[g] || "").trim();
  }).filter(Boolean);
}

function intentosTrimestralesPermitidos_(cfg, t) {
  const c = cfg || leerCfgTrimestral_();
  const n = parseInt((c.trimestres[String(t)] && c.trimestres[String(t)].intentos), 10);
  return Math.max(1, n || 1);
}

function esResultadoTrimestralDe_(r, cfg, t) {
  const modo = String((r && r.modo) || "").toLowerCase();
  if (modo === "sorteo") return false;
  const trimR = String((r && r.trimestre) || "").trim();
  const id = String((r && r.idLectura) || "").trim();
  const tWant = String(t || "");
  if (modo === "trimestral") {
    if (!tWant) return true;
    return !trimR || trimR === tWant;
  }
  if (!id) return false;
  const c = cfg || leerCfgTrimestral_();
  const lista = tWant ? [tWant] : ["1", "2", "3"];
  for (let i = 0; i < lista.length; i++) {
    const n = lista[i];
    if (idsLecturasTrimestre_(c, n).indexOf(id) >= 0) return true;
    if (id.indexOf("TRIM_") === 0 && id.indexOf("_T" + n) >= 0) return true;
  }
  return false;
}

function contarIntentosSorteo_(matricula, resultados, cfg) {
  const m = String(matricula || "").trim().toLowerCase();
  const c = cfg || leerCfgTrimestral_();
  const todos = resultados || leerResultadosDeTodasLasPestanas() || [];
  let n = 0;
  todos.forEach(function (r) {
    if (String(r.matricula || "").trim().toLowerCase() !== m) return;
    if (esResultadoTrimestralDe_(r, c, "")) return;
    n++;
  });
  return n;
}

function contarIntentosTrimestrales_(matricula, resultados, cfg, t) {
  const m = String(matricula || "").trim().toLowerCase();
  const c = cfg || leerCfgTrimestral_();
  const todos = resultados || leerResultadosDeTodasLasPestanas() || [];
  let n = 0;
  todos.forEach(function (r) {
    if (String(r.matricula || "").trim().toLowerCase() !== m) return;
    if (esResultadoTrimestralDe_(r, c, t)) n++;
  });
  return n;
}

function etiquetaTrimestre_(n) {
  if (String(n) === "1") return "1er trimestre";
  if (String(n) === "2") return "2° trimestre";
  if (String(n) === "3") return "3er trimestre";
  return "Trimestre";
}

function formatoFechaCorta_(iso) {
  const s = String(iso || "");
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return s || "—";
  const mes = MESES_CORTOS_ES[Number(m[2]) - 1] || m[2];
  return Number(m[3]) + " " + mes + " " + m[1];
}

function rangoFechaTexto_(inicio, fin) {
  const a = String(inicio || "");
  const b = String(fin || "");
  const ma = a.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const mb = b.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!ma || !mb) return (formatoFechaCorta_(a) + " – " + formatoFechaCorta_(b)).replace(/ — – —/, "—");
  const diaA = Number(ma[3]);
  const diaB = Number(mb[3]);
  const mesA = MESES_CORTOS_ES[Number(ma[2]) - 1] || ma[2];
  const mesB = MESES_CORTOS_ES[Number(mb[2]) - 1] || mb[2];
  if (ma[1] === mb[1]) return diaA + " " + mesA + " – " + diaB + " " + mesB + " " + mb[1];
  return diaA + " " + mesA + " " + ma[1] + " – " + diaB + " " + mesB + " " + mb[1];
}

function itemTrimestre_(c, n) {
  const t = (c && c.trimestres && c.trimestres[n]) || {};
  return {
    num: String(n),
    etiqueta: etiquetaTrimestre_(n),
    inicio: t.inicio || "",
    fin: t.fin || "",
    fechaTexto: rangoFechaTexto_(t.inicio, t.fin)
  };
}

function trimestreCalendario_(cfg) {
  const c = cfg || leerCfgTrimestral_();
  const hoy = hoyIsoMexico_();
  let actual = null;
  let proximo = null;
  let ultimo = null;
  ["1", "2", "3"].forEach(function (n) {
    const item = itemTrimestre_(c, n);
    ultimo = item;
    if (item.inicio && item.fin && hoy >= item.inicio && hoy <= item.fin) actual = item;
    if (!proximo && item.inicio && hoy < item.inicio) proximo = item;
  });
  const elegido = actual || proximo || ultimo || itemTrimestre_(c, "1");
  elegido.vigente = !!(actual && actual.num === elegido.num);
  return elegido;
}

function trimestreVigente_(cfg) {
  const c = cfg || leerCfgTrimestral_();
  const cal = trimestreCalendario_(c);
  const forzado = String(c.activo || "auto");
  if (forzado === "1" || forzado === "2" || forzado === "3") {
    const item = itemTrimestre_(c, forzado);
    item.vigente = cal.num === item.num;
    item.forzado = true;
    item.calendario = cal.num;
    return item;
  }
  cal.forzado = false;
  cal.calendario = cal.num;
  return cal;
}

function infoTrimestreActual() {
  const cfg = leerCfgTrimestral_();
  const t = trimestreVigente_(cfg);
  return {
    ok: true,
    trimestre: t.num,
    etiqueta: t.etiqueta,
    fechaInicio: t.inicio,
    fechaFin: t.fin,
    fechaTexto: t.fechaTexto,
    vigente: !!t.vigente,
    forzado: !!t.forzado,
    calendario: t.calendario || t.num,
    ciclo: cfg.ciclo,
    intentos: intentosTrimestralesPermitidos_(cfg, t.num)
  };
}

function infoLecturaTrimestralDe_(grado, matricula, resultados, _ignorar) {
  const cfg = leerCfgTrimestral_();
  const t = trimestreVigente_(cfg);
  const g = claveGrado_(grado);
  const id = g ? String((cfg.lecturas[t.num] && cfg.lecturas[t.num][g]) || "").trim() : "";
  const permitidosT = intentosTrimestralesPermitidos_(cfg, t.num);
  const usadosT = matricula ? contarIntentosTrimestrales_(matricula, resultados, cfg, t.num) : 0;
  const restantesT = Math.max(0, permitidosT - usadosT);
  const base = {
    trimestre: t.num,
    etiqueta: t.etiqueta,
    fechaInicio: t.inicio,
    fechaFin: t.fin,
    fechaTexto: t.fechaTexto,
    vigente: !!t.vigente,
    forzado: !!t.forzado,
    calendario: t.calendario || t.num,
    ciclo: cfg.ciclo,
    grado: g,
    idLectura: id,
    tema: "",
    asignatura: "",
    palabras: 0,
    asignada: false,
    yaPresentada: usadosT > 0,
    intentosPermitidos: permitidosT,
    intentosUsados: usadosT,
    intentosRestantes: restantesT,
    puedePresentar: false,
    mensaje: ""
  };
  if (!id) {
    base.mensaje = "Tu docente aún no asignó la lectura trimestral de tu grado.";
    return base;
  }
  const lec = buscarLecturaPorId(id);
  if (!lec) {
    base.mensaje = "La lectura trimestral ya no está en el banco.";
    return base;
  }
  base.asignada = true;
  base.tema = String(lec["Tema"] || "");
  base.asignatura = String(lec["Asignatura"] || "");
  base.palabras = Number(lec["Palabras"] || 0) || contarPalabras(lec["Texto"]);
  if (restantesT <= 0) {
    base.mensaje = permitidosT === 1
      ? "Ya presentaste la lectura trimestral de este periodo."
      : ("Ya usaste tus " + permitidosT + " intentos de la lectura trimestral.");
  } else {
    base.puedePresentar = true;
    base.mensaje = base.asignatura && base.tema
      ? (base.asignatura + " · " + base.tema)
      : "Lectura trimestral lista.";
  }
  return base;
}

function paqueteDesdeFilaLectura_(elegida, extra) {
  const preguntas = preguntasDeLectura(elegida);
  if (!preguntas.length) return { ok: false, mensaje: "La lectura no tiene preguntas." };
  const preguntasSinRespuesta = preguntas.map(function (p) {
    return { p: p.p, opciones: (p.opciones || []).slice() };
  });
  const asig = String(elegida["Asignatura"] || "");
  const tema = String(elegida["Tema"] || "");
  const out = extra || {};
  out.ok = true;
  out.asignatura = asig;
  out.tema = tema;
  out.asignaturasRuleta = out.asignaturasRuleta || [asig];
  out.temasRuleta = out.temasRuleta || [tema];
  out.disponibles = out.disponibles == null ? 1 : out.disponibles;
  out.excluidas = out.excluidas == null ? 0 : out.excluidas;
  out.lectura = {
    idLectura: String(elegida["ID Lectura"]),
    texto: String(elegida["Texto"] || ""),
    palabras: contarPalabras(elegida["Texto"]),
    preguntas: preguntasSinRespuesta
  };
  return out;
}

function paqueteLecturaTrimestral_(alumno, resultados) {
  const info = infoLecturaTrimestralDe_(String(alumno["Grado"]), String(alumno["Matrícula"]), resultados, true);
  if (!info.asignada) {
    return { ok: false, mensaje: info.mensaje || "Tu docente aún no asignó la lectura trimestral de tu grado." };
  }
  if (!info.puedePresentar) {
    return { ok: false, mensaje: info.mensaje || "Ya no tienes intentos para la lectura trimestral." };
  }
  const elegida = buscarLecturaPorId(info.idLectura);
  if (!elegida) return { ok: false, mensaje: "La lectura trimestral ya no está en el banco." };
  const pack = paqueteDesdeFilaLectura_(elegida, { modo: "trimestral", trimestre: info });
  if (!pack.ok) return pack;
  pack.trimestre = info;
  return pack;
}

function obtenerLecturasTrimestrales(token) {
  exigirAdmin(token);
  const cfg = leerCfgTrimestral_();
  const todos = leerResultadosDeTodasLasPestanas() || [];
  const intentosRegistrados = { "1": 0, "2": 0, "3": 0 };
  todos.forEach(function (r) {
    ["1", "2", "3"].forEach(function (t) {
      if (esResultadoTrimestralDe_(r, cfg, t)) intentosRegistrados[t]++;
    });
  });
  return { ok: true, config: cfg, vigente: trimestreVigente_(cfg), intentosRegistrados: intentosRegistrados };
}

function resumenCalendarioTrimestral(token) {
  return obtenerLecturasTrimestrales(token);
}

function limpiarIntentosTrimestrales(token, trimestre) {
  exigirAdmin(token);
  const t = String(trimestre || "");
  if (t !== "1" && t !== "2" && t !== "3") throw new Error("Elige un trimestre.");
  const cfg = leerCfgTrimestral_();
  const ids = {};
  idsLecturasTrimestre_(cfg, t).forEach(function (id) { ids[id] = true; });
  const libro = obtenerLibro();
  if (!libro) throw new Error("No se pudo abrir la hoja de datos.");
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  let borradas = 0;
  try {
    libro.getSheets().forEach(function (p) {
      const nombre = p.getName();
      if (nombre.indexOf("Resultado") < 0 && nombre.indexOf("resultado") < 0) return;
      if (p.getLastRow() < 2) return;
      const valores = p.getDataRange().getValues();
      const enc = valores[0].map(function (h) { return String(h || "").trim(); });
      const iId = enc.indexOf("ID Lectura");
      const iModo = enc.indexOf("Modo");
      const iTrim = enc.indexOf("Trimestre");
      const aBorrar = [];
      for (let i = valores.length - 1; i >= 1; i--) {
        const modo = iModo >= 0 ? String(valores[i][iModo] || "").toLowerCase() : "";
        const trim = iTrim >= 0 ? String(valores[i][iTrim] || "").trim() : "";
        const id = iId >= 0 ? String(valores[i][iId] || "").trim() : "";
        let match = false;
        if (modo === "sorteo") match = false;
        else if (modo === "trimestral" && (!trim || trim === t)) match = true;
        else if (modo !== "sorteo" && ids[id]) match = true;
        else if (modo !== "sorteo" && id.indexOf("TRIM_") === 0 && id.indexOf("_T" + t) >= 0) match = true;
        if (match) aBorrar.push(i + 1);
      }
      aBorrar.forEach(function (rowNum) {
        p.deleteRow(rowNum);
        borradas++;
      });
    });
  } finally {
    lock.releaseLock();
  }
  const etiq = etiquetaTrimestre_(t);
  return {
    ok: true,
    borradas: borradas,
    trimestre: t,
    mensaje: borradas
      ? ("Se limpiaron " + borradas + " intento" + (borradas === 1 ? "" : "s") + " del " + etiq + ". Los alumnos pueden volver a presentarlo.")
      : ("No había intentos registrados del " + etiq + ".")
  };
}

function guardarLecturasTrimestrales(token, payload) {
  exigirAdmin(token);
  const cfg = normalizarCfgTrimestral_(payload);
  ["1", "2", "3"].forEach(function (t) {
    const ini = cfg.trimestres[t].inicio;
    const fin = cfg.trimestres[t].fin;
    if (ini && fin && ini > fin) {
      throw new Error("En el " + etiquetaTrimestre_(t) + " la fecha de inicio no puede ser posterior a la de cierre.");
    }
  });
  ["1", "2", "3"].forEach(function (t) {
    ["1", "2", "3"].forEach(function (g) {
      const id = String((cfg.lecturas[t] && cfg.lecturas[t][g]) || "").trim();
      if (!id) return;
      const lec = buscarLecturaPorId(id);
      if (!lec) {
        throw new Error("La lectura de " + g + "° en el " + etiquetaTrimestre_(t) + " ya no está en el banco.");
      }
      const lg = claveGrado_(lec["Grado"]);
      if (lg && lg !== g) {
        throw new Error("No puedes asignar a " + g + "° una lectura de " + lg + "° (" + String(lec["Tema"] || id) + ").");
      }
    });
  });
  escribirConfig_("LECTURAS_TRIMESTRALES", JSON.stringify(cfg));
  return { ok: true, mensaje: "Banco trimestral guardado.", config: cfg, vigente: trimestreVigente_(cfg) };
}

function idLecturaTrimestralMuestra_(grado, trimestre) {
  return "TRIM_" + String(grado) + "_T" + String(trimestre);
}

function catalogoMuestraTrimestral_() {
  return [
    { grado: "1", trimestre: "1", asignatura: "Ciencias", tema: "El huerto escolar y las estaciones" },
    { grado: "1", trimestre: "2", asignatura: "Español", tema: "Cartas para mejorar la comunidad" },
    { grado: "1", trimestre: "3", asignatura: "Formación Cívica y Ética", tema: "Acuerdos para cuidar el agua" },
    { grado: "2", trimestre: "1", asignatura: "Ciencias", tema: "El clima de nuestra ciudad" },
    { grado: "2", trimestre: "2", asignatura: "Historia", tema: "Oficios de ayer y de hoy" },
    { grado: "2", trimestre: "3", asignatura: "Español", tema: "El periódico mural del grupo" },
    { grado: "3", trimestre: "1", asignatura: "Ciencias", tema: "Energía y consumo responsable" },
    { grado: "3", trimestre: "2", asignatura: "Historia", tema: "La independencia en nuestro pueblo" },
    { grado: "3", trimestre: "3", asignatura: "Formación Cívica y Ética", tema: "Participar para mejorar la escuela" }
  ];
}

function construirLecturaTrimestralMuestra_(item) {
  const lec = construirLecturaBanco(item.grado, item.asignatura, item.tema);
  lec.id = idLecturaTrimestralMuestra_(item.grado, item.trimestre);
  lec.origen = "TRIMESTRE";
  lec.tema = item.tema;
  lec.grado = String(item.grado);
  return lec;
}

function sembrarBancoTrimestral(token, reemplazar) {
  exigirAdmin(token);
  asegurarSetup();
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const catalogo = catalogoMuestraTrimestral_();
    const p = obtenerLibro().getSheetByName("Lecturas");
    if (!p) throw new Error("No se encontró la hoja de Lecturas.");
    const idsYa = {};
    leerFilas("Lecturas").forEach(function (l) {
      idsYa[String(l["ID Lectura"] || "")] = true;
    });
    let creadas = 0;
    catalogo.forEach(function (item) {
      const id = idLecturaTrimestralMuestra_(item.grado, item.trimestre);
      if (idsYa[id]) return;
      const lec = construirLecturaTrimestralMuestra_(item);
      p.appendRow(filaLectura(lec));
      reemplazarPreguntasDeLectura_(id, lec.preguntas);
      idsYa[id] = true;
      creadas++;
    });
    const cfg = leerCfgTrimestral_();
    let asignadas = 0;
    catalogo.forEach(function (item) {
      const id = idLecturaTrimestralMuestra_(item.grado, item.trimestre);
      const actual = String((cfg.lecturas[item.trimestre] && cfg.lecturas[item.trimestre][item.grado]) || "").trim();
      if (reemplazar || !actual) {
        cfg.lecturas[item.trimestre][item.grado] = id;
        asignadas++;
      }
    });
    escribirConfig_("LECTURAS_TRIMESTRALES", JSON.stringify(cfg));
    formatearHojasDeLectura();
    SpreadsheetApp.flush();
    return {
      ok: true,
      creadas: creadas,
      asignadas: asignadas,
      config: cfg,
      vigente: trimestreVigente_(cfg),
      mensaje: creadas
        ? ("Se agregaron " + creadas + " lecturas de muestra y se asignó una por grado y trimestre.")
        : (asignadas
          ? "Se asignaron las lecturas de muestra a los casilleros vacíos."
          : "Las 9 lecturas de muestra ya estaban en el banco.")
    };
  } finally { lock.releaseLock(); }
}

function panelAlumno(matricula, tokenAlumno) {
  const mat = String(matricula || "").trim();
  if (!mat) throw new Error("Matrícula no especificada.");

  if (!tokenAlumno || String(tokenAlumno).trim() === "") {
    throw new Error("Acceso denegado: se requiere una sesión autenticada de alumno para acceder al expediente.");
  }

  const ses = obtenerSesionValida_(tokenAlumno);
  if (!ses) {
    throw new Error("Acceso denegado: token de sesión inválido o expirado. Inicia sesión nuevamente.");
  }

  const rol = String(ses.rol || "").toLowerCase();
  if (rol === "alumno") {
    if (String(ses.matricula || "").trim().toLowerCase() !== mat.toLowerCase()) {
      throw new Error("Acceso denegado: no estás autorizado para consultar el expediente de otro alumno.");
    }
  } else if (["admin", "docente", "prefecto", "apoyo"].indexOf(rol) >= 0) {
    return fichaAlumnoAdmin(tokenAlumno, mat);
  } else {
    throw new Error("Acceso denegado: rol no autorizado para consultar este expediente.");
  }

  return construirPanelAlumno_(mat, { incluirInactivos: false, voz: "alumno" });
}

function fichaAlumnoAdmin(token, matricula) {
  const ses = exigirRoles_(token, ["admin", "docente", "prefecto", "apoyo"]);
  const rol = String(ses.rol || "").toLowerCase();
  const a = filaAlumnoPorMatricula(matricula);
  if (!a) throw new Error("No existe ese alumno.");
  const kAlu = String(a["Grado"] || "") + String(a["Grupo"] || "").toUpperCase();

  if (rol === "docente") {
    const gruposDocente = {};
    const maestroId = String(ses.maestroId || "");
    const nombreDoc = String(ses.nombre || "").toLowerCase();
    try {
      leerFilas("Horarios").forEach(function (h) {
        const m = String(h["Maestro"] || "").toLowerCase();
        if (m === nombreDoc || (maestroId && String(h["Id Maestro"] || "") === maestroId)) {
          const k = String(h["Grado"] || "") + String(h["Grupo"] || "").toUpperCase();
          gruposDocente[k] = true;
        }
      });
    } catch (eH) {}
    if (!gruposDocente[kAlu]) {
      throw new Error("Acceso denegado: el alumno no pertenece a tus grupos asignados.");
    }
  } else if (rol === "prefecto") {
    const prefId = String(ses.prefectoId || "");
    const gruposPrefecto = {};
    try {
      leerFilas("PrefectoGrupos").forEach(function (f) {
        if (String(f["Id prefecto"] || "") === prefId) {
          const k = String(f["Grado"] || "") + String(f["Grupo"] || "").toUpperCase();
          gruposPrefecto[k] = true;
        }
      });
    } catch (eP) {}
    if (!gruposPrefecto[kAlu]) {
      throw new Error("Acceso denegado: el alumno no pertenece a los grupos asignados al prefecto.");
    }
  } else if (rol === "apoyo") {
    const apoyoId = String(ses.apoyoId || "").trim();
    if (!apoyoId) {
      throw new Error("Acceso denegado: el usuario de apoyo no tiene un identificador válido.");
    }
    const gruposApoyo = {};
    try {
      leerFilas("ApoyoGrupos").forEach(function (f) {
        const idFila = String(f["Id apoyo"] || f["Id personal"] || "").trim();
        if (idFila && idFila === apoyoId) {
          const k = String(f["Grado"] || "") + String(f["Grupo"] || "").toUpperCase();
          gruposApoyo[k] = true;
        }
      });
    } catch (eA) {}
    if (!gruposApoyo[kAlu]) {
      throw new Error("Acceso denegado: el rol de apoyo no tiene asignado este grupo de alumnos.");
    }
  }
  return construirPanelAlumno_(matricula, { incluirInactivos: true, voz: "docente" });
}

function iniciarEvaluacionAlumno(matricula, modo, tokenSesion) {
  const mat = String(matricula || "").trim();
  if (!mat) throw new Error("Matrícula no especificada.");

  if (!tokenSesion || String(tokenSesion).trim() === "") {
    throw new Error("Acceso denegado: se requiere una sesión autenticada para iniciar una evaluación.");
  }

  const ses = obtenerSesionValida_(tokenSesion);
  if (!ses) {
    throw new Error("Acceso denegado: token de sesión inválido o expirado. Inicia sesión nuevamente.");
  }

  const rol = String(ses.rol || "").toLowerCase();
  if (rol === "alumno") {
    if (String(ses.matricula || "").trim().toLowerCase() !== mat.toLowerCase()) {
      throw new Error("Acceso denegado: no estás autorizado para iniciar evaluaciones a nombre de otro alumno.");
    }
  } else if (["admin", "docente"].indexOf(rol) >= 0) {
    if (rol === "docente") {
      const aFila = filaAlumnoPorMatricula(mat);
      if (!aFila) throw new Error("No existe ese alumno.");
      const kAlu = String(aFila["Grado"] || "") + String(aFila["Grupo"] || "").toUpperCase();
      const gruposDocente = {};
      const maestroId = String(ses.maestroId || "");
      const nombreDoc = String(ses.nombre || "").toLowerCase();
      try {
        leerFilas("Horarios").forEach(function (h) {
          const m = String(h["Maestro"] || "").toLowerCase();
          if (m === nombreDoc || (maestroId && String(h["Id Maestro"] || "") === maestroId)) {
            const k = String(h["Grado"] || "") + String(h["Grupo"] || "").toUpperCase();
            gruposDocente[k] = true;
          }
        });
      } catch (eH) {}
      if (!gruposDocente[kAlu]) {
        throw new Error("Acceso denegado: el alumno no pertenece a los grupos asignados al docente.");
      }
    }
  } else {
    throw new Error("Acceso denegado: rol no autorizado para iniciar evaluaciones.");
  }

  const alumno = buscarAlumno(mat);
  if (!alumno) return { ok: false, mensaje: "No se encontró al alumno." };
  if (String(alumno["Activo"]).toUpperCase() === "NO") return { ok: false, mensaje: "Este alumno no está activo." };
  const todos = leerResultadosDeTodasLasPestanas() || [];
  const cfgT = leerCfgTrimestral_();
  const modoNorm = String(modo || "sorteo").trim().toLowerCase();
  if (modo && ["sorteo", "trimestral"].indexOf(modoNorm) < 0) {
    throw new Error("Modalidad de evaluación no reconocida: '" + modo + "'. Solo se permite 'sorteo' o 'trimestral'.");
  }
  const esTrimestral = modoNorm === "trimestral";
  if (!esTrimestral) {
    const usados = contarIntentosSorteo_(mat, todos, cfgT);
    const permitidos = intentosPermitidosDe(alumno);
    if (usados >= permitidos) {
      return {
        ok: false, agotado: true, usados: usados, permitidos: permitidos,
        mensaje: mensajeCupoAgotado(usados, permitidos)
      };
    }
  } else {
    const trimVig = trimestreVigente_(cfgT);
    if (!trimVig) {
      return { ok: false, mensaje: "No hay un trimestre escolar vigente para evaluaciones trimestrales." };
    }
    const usadosT = contarIntentosTrimestrales_(mat, todos, cfgT, trimVig.num);
    const permitidosT = intentosTrimestralesPermitidos_(cfgT, trimVig.num);
    if (usadosT >= permitidosT) {
      return {
        ok: false, agotado: true, usados: usadosT, permitidos: permitidosT,
        mensaje: "Ya agotaste tus intentos para la evaluación trimestral de este periodo."
      };
    }
  }

  const sorteo = esTrimestral
    ? paqueteLecturaTrimestral_(alumno, todos)
    : sortearLectura(String(alumno["Grado"]), String(alumno["Matrícula"]), todos);
  if (!sorteo.ok) return sorteo;

  const spec = especificacionesDeGrado(alumno["Grado"]);
  const trimNum = esTrimestral ? String((sorteo.trimestre && (sorteo.trimestre.trimestre || sorteo.trimestre.num)) || trimestreVigente_(cfgT).num || "").trim() : "";
  const usadosOut = esTrimestral
    ? contarIntentosTrimestrales_(mat, todos, cfgT, trimNum)
    : contarIntentosSorteo_(mat, todos, cfgT);
  const permitidosOut = esTrimestral
    ? intentosTrimestralesPermitidos_(cfgT, trimNum)
    : intentosPermitidosDe(alumno);

  const tokenExamen = "exam_" + Utilities.getUuid();
  const datosIntento = {
    token: tokenExamen,
    matricula: String(alumno["Matrícula"]),
    idLectura: String((sorteo.lectura && sorteo.lectura.idLectura) || ""),
    modo: esTrimestral ? "trimestral" : "sorteo",
    trimestre: trimNum,
    intentoEsperado: usadosOut + 1,
    fecha: Date.now()
  };
  const cacheExamen = CacheService.getScriptCache();
  cacheExamen.put("examen_token_" + tokenExamen, JSON.stringify(datosIntento), 3600);
  cacheExamen.put("examen_vigente_" + String(alumno["Matrícula"]), JSON.stringify(datosIntento), 3600);

  return {
    ok: true,
    tokenExamen: tokenExamen,
    modo: esTrimestral ? "trimestral" : "sorteo",
    trimestre: sorteo.trimestre || null,
    alumno: {
      matricula: String(alumno["Matrícula"]),
      nombre: String(alumno["Nombre Completo"]),
      grado: String(alumno["Grado"]),
      grupo: String(alumno["Grupo"])
    },
    intento: usadosOut + 1,
    permitidos: permitidosOut,
    escuela: nombreEscuela_(),
    identidad: identidadEscuela_(),
    especificaciones: spec,
    urlAdmin: urlAdmin(),
    asignatura: sorteo.asignatura,
    tema: sorteo.tema,
    asignaturasRuleta: sorteo.asignaturasRuleta,
    temasRuleta: sorteo.temasRuleta,
    lecturasDisponibles: sorteo.disponibles,
    lecturasExcluidas: sorteo.excluidas,
    lectura: sorteo.lectura
  };
}

function sortearLectura(grado, matricula, resultadosYaLeidos) {
  const activas = lecturasActivasDeGrado_(grado);
  if (!activas.length) return { ok: false, mensaje: "No hay lecturas para este grado." };

  let pool = activas;
  let excluidas = 0;
  if (matricula) {
    const todos = resultadosYaLeidos || leerResultadosDeTodasLasPestanas() || [];
    const excl = exclusionLecturasDeResultados_(matricula, todos);
    pool = activas.filter(function (l) { return !lecturaYaPresentada_(l, excl); });
    excluidas = activas.length - pool.length;
    if (!pool.length) {
      return {
        ok: false,
        sinLecturasNuevas: true,
        mensaje: "Ya presentaste todas las lecturas disponibles de tu grado. Pide a tu docente que active más lecturas."
      };
    }
  }

  const asigs = uniq(pool.map(function (l) { return String(l["Asignatura"]); }));
  const asig = asigs[Math.floor(Math.random() * asigs.length)];
  const deAsig = pool.filter(function (l) { return String(l["Asignatura"]) === asig; });
  const temas = uniq(deAsig.map(function (l) { return String(l["Tema"]); }));
  const tema = temas[Math.floor(Math.random() * temas.length)];
  const deTema = deAsig.filter(function (l) { return String(l["Tema"]) === tema; });
  const elegidaIdx = deTema[Math.floor(Math.random() * deTema.length)];
  const elegida = buscarLecturaPorId(elegidaIdx["ID Lectura"]) || elegidaIdx;
  const preguntas = preguntasDeLectura(elegida);
  if (!preguntas.length) return { ok: false, mensaje: "La lectura sorteada no tiene preguntas." };
  const preguntasSinRespuesta = preguntas.map(function (p) {
    return { p: p.p, opciones: (p.opciones || []).slice() };
  });
  return {
    ok: true, asignatura: asig, tema: tema,
    asignaturasRuleta: asigs, temasRuleta: temas,
    disponibles: pool.length,
    excluidas: excluidas,
    lectura: {
      idLectura: String(elegida["ID Lectura"]),
      texto: String(elegida["Texto"] || ""),
      palabras: contarPalabras(elegida["Texto"]),
      preguntas: preguntasSinRespuesta
    }
  };
}

function normalizarNivelComprension(v) {
  const s = String(v || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (s.indexOf("crit") >= 0) return "critica";
  if (s.indexOf("infer") >= 0) return "inferencial";
  if (s.indexOf("liter") >= 0) return "literal";
  return "";
}

function etiquetaNivelComprension(n) {
  if (n === "literal") return "Literal";
  if (n === "inferencial") return "Inferencial";
  if (n === "critica") return "Crítica";
  return "";
}

function normalizarEnunciadoNivel_(s) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,;:“”"'«»]/g, " ").replace(/\s+/g, " ").trim();
}

function mapaNivelesBanco_() {
  const mapa = {};
  const asigs = ["Español", "Historia", "Ciencias", "Formación Cívica y Ética", "Tecnología", "Matemáticas"];
  asigs.forEach(function (a) {
    const b = bancoReactivosReglamentarios(a);
    if (!b) return;
    (b.literal || []).forEach(function (pr) { mapa[normalizarEnunciadoNivel_(pr.p)] = "literal"; });
    (b.inferencia || []).forEach(function (pr) { mapa[normalizarEnunciadoNivel_(pr.p)] = "inferencial"; });
    (b.critica || []).forEach(function (pr) { mapa[normalizarEnunciadoNivel_(pr.p)] = "critica"; });
  });
  return mapa;
}

function inferirNivelComprensionPregunta(enunciado) {
  const s = normalizarEnunciadoNivel_(enunciado);
  if (!s) return { nivel: "literal", seguro: false };

  if (/(proposito del autor|intencion del autor|intencion comunicativa|punto de vista del autor|sesgo|idea critica|se evalua|se cuestiona|confiabilidad|validez de|argumenta|opinion del autor|estas de acuerdo|te parece|convence|adecuado afirmar|que se critica|evaluar (una |la )?afirmacion|que postura|que idea critica)/.test(s)) {
    return { nivel: "critica", seguro: true };
  }
  if (/(se infiere|se deduce|se concluye|que implica|que se concluye|idea principal|entre lineas|se interpreta|significado por contexto|causa de|consecuencia|relacion entre)/.test(s) || /^por que /.test(s) || / por que /.test(s)) {
    return { nivel: "inferencial", seguro: true };
  }
  if (/(segun (el|la|dona)|el texto (dice|menciona|senala|indica)|se menciona|se publico|que encontro|que pidio|que ocurrio|que resultado|que acuerdo|que convoco|que armaron|que distinguieron|que advirtio|que pedian|que pedian|donde |quien |cuando |cuantos |cuantas |cual fue)/.test(s) || /^(que|quien|donde|cuando|cual|cuantos|cuantas) /.test(s)) {
    return { nivel: "literal", seguro: true };
  }
  return { nivel: "inferencial", seguro: false };
}

/**********************************************************************
 * GESTIÓN SEGURA DE DEEPSEEK Y RESPALDOS
 **********************************************************************/
function obtenerClaveDeepSeek_() {
  const deProps = PropertiesService.getScriptProperties().getProperty("DEEPSEEK_KEY");
  if (deProps && deProps.trim()) return deProps.trim();
  const deSheet = leerConfig("DEEPSEEK_KEY", "");
  if (deSheet && deSheet.trim()) {
    try {
      PropertiesService.getScriptProperties().setProperty("DEEPSEEK_KEY", deSheet.trim());
      escribirConfig_("DEEPSEEK_KEY", "");
    } catch (e) {}
    return deSheet.trim();
  }
  return "";
}

function estadoDeepSeek(token) {
  exigirAdmin(token);
  const k = obtenerClaveDeepSeek_();
  if (!k) return { ok: true, configurada: false, mascara: "" };
  const vis = k.length > 8 ? (k.slice(0, 3) + "••••••••" + k.slice(-4)) : "••••••••";
  return { ok: true, configurada: true, mascara: vis };
}

function guardarClaveDeepSeek(token, nuevaClave) {
  exigirAdmin(token);
  const limpia = String(nuevaClave || "").trim();
  if (!limpia) {
    PropertiesService.getScriptProperties().deleteProperty("DEEPSEEK_KEY");
    escribirConfig_("DEEPSEEK_KEY", "");
    return { ok: true, mensaje: "Clave de DeepSeek eliminada." };
  }
  PropertiesService.getScriptProperties().setProperty("DEEPSEEK_KEY", limpia);
  escribirConfig_("DEEPSEEK_KEY", "");
  return { ok: true, mensaje: "Clave de DeepSeek guardada de forma segura en las propiedades del servidor." };
}

function probarConexionDeepSeek(token) {
  exigirAdmin(token);
  const clave = obtenerClaveDeepSeek_();
  if (!clave) throw new Error("No hay clave de DeepSeek configurada.");
  try {
    const r = UrlFetchApp.fetch(URL_BASE_DEEPSEEK, {
      method: "post",
      contentType: "application/json",
      headers: { Authorization: "Bearer " + clave },
      payload: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: "Responde solo 'OK'" }],
        max_tokens: 5
      }),
      muteHttpExceptions: true
    });
    const code = r.getResponseCode();
    if (code === 200) {
      return { ok: true, mensaje: "Conexión exitosa con la API de DeepSeek." };
    }
    const txt = r.getContentText();
    return { ok: false, error: "Error HTTP " + code + ": " + txt.slice(0, 150) };
  } catch (err) {
    return { ok: false, error: String(err.message || err) };
  }
}

function crearRespaldoLibro(token) {
  exigirAdmin(token);
  const libro = obtenerLibro();
  if (!libro) throw new Error("No se pudo obtener el libro de cálculo.");
  const idLibro = libro.getId();
  const archivo = DriveApp.getFileById(idLibro);
  const tz = Session.getScriptTimeZone() || "America/Mexico_City";
  const fechaStr = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd_HH-mm");
  const nombreCopia = "Respaldo_" + libro.getName() + "_" + fechaStr;
  const copia = archivo.makeCopy(nombreCopia);
  return {
    ok: true,
    nombre: nombreCopia,
    url: copia.getUrl(),
    mensaje: "Respaldo creado con éxito en Google Drive: " + nombreCopia
  };
}

function pedirNivelesLoteDeepSeek(clave, lote) {
  if (!clave || !lote || !lote.length) return [];
  try {
    const lista = lote.map(function (x, i) {
      return (i + 1) + ". " + String(x.p || "").substring(0, 280);
    }).join("\n");
    const instruccion = "Clasifica cada pregunta de comprensión lectora de secundaria (México, NEM).\n" +
      "Usa exactamente uno: literal, inferencial o critica.\n" +
      "- literal: dato explícito (quién, qué, dónde, cuándo, secuencia, cifra).\n" +
      "- inferencial: causa, conclusión, idea principal, leer entre líneas.\n" +
      "- critica: propósito del autor, postura, evaluar una afirmación, sesgo.\n" +
      "Devuelve SOLO JSON: {\"niveles\":[\"literal\",...]} en el mismo orden, un valor por pregunta.\n" +
      "Preguntas:\n" + lista;
    const r = UrlFetchApp.fetch(URL_BASE_DEEPSEEK, {
      method: "post",
      contentType: "application/json",
      headers: { Authorization: "Bearer " + clave },
      payload: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: instruccion }],
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 400
      }),
      muteHttpExceptions: true
    });
    if (r.getResponseCode() < 200 || r.getResponseCode() >= 300) return [];
    const j = JSON.parse(r.getContentText());
    const contenido = j && j.choices && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : "";
    let datos = contenido;
    if (typeof contenido === "string") {
      const bloque = contenido.match(/```(?:json)?\s*([\s\S]*?)```/i);
      datos = JSON.parse((bloque ? bloque[1] : contenido).trim());
    }
    const arr = (datos && datos.niveles) ? datos.niveles : [];
    return arr.map(function (v) { return normalizarNivelComprension(v); });
  } catch (e) {
    return [];
  }
}

function clasificarNivelesTodasLasPreguntas(token) {
  exigirAdmin(token);
  asegurarSetup();
  asegurarColumnaNivelPreguntas();

  const lecturas = leerFilas("Lecturas");
  const clave = obtenerClaveDeepSeek_();
  const mapaBanco = mapaNivelesBanco_();
  const t0 = Date.now();
  const pendientes = [];
  const dudosos = [];
  const conteo = { lecturas: 0, preguntas: 0, banco: 0, heuristica: 0, ia: 0, literal: 0, inferencial: 0, critica: 0 };

  lecturas.forEach(function (l, li) {
    const crudas = preguntasDeLectura(l) || [];
    const preguntas = [];
    crudas.forEach(function (pr, pi) {
      const nrm = normalizarPreguntaAdmin(pr);
      if (!nrm) return;
      const claveEn = normalizarEnunciadoNivel_(nrm.p);
      let nivel = mapaBanco[claveEn] || "";
      let origen = "";
      if (nivel) {
        origen = "banco";
        conteo.banco++;
      } else {
        const inf = inferirNivelComprensionPregunta(nrm.p);
        nivel = inf.nivel;
        origen = inf.seguro ? "heuristica" : "duda";
        if (inf.seguro) conteo.heuristica++;
      }
      nrm.nivel = nivel;
      preguntas.push(nrm);
      if (origen === "duda") dudosos.push({ li: pendientes.length, pi: preguntas.length - 1, p: nrm.p });
    });
    if (!preguntas.length) return;
    pendientes.push({ lectura: l, preguntas: preguntas });
    conteo.lecturas++;
    conteo.preguntas += preguntas.length;
  });

  const TAM = 12;
  if (clave && dudosos.length) {
    for (let i = 0; i < dudosos.length && (Date.now() - t0) < 240000; i += TAM) {
      const lote = dudosos.slice(i, i + TAM);
      const niveles = pedirNivelesLoteDeepSeek(clave, lote);
      lote.forEach(function (it, k) {
        const n = niveles[k];
        if (!n) return;
        pendientes[it.li].preguntas[it.pi].nivel = n;
        conteo.ia++;
      });
    }
  } else {
    dudosos.forEach(function (it) { conteo.heuristica++; });
  }

  pendientes.forEach(function (item) {
    item.preguntas.forEach(function (pr) {
      const n = normalizarNivelComprension(pr.nivel) || "inferencial";
      pr.nivel = n;
      conteo[n] = (conteo[n] || 0) + 1;
    });
  });

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const p = obtenerLibro().getSheetByName("Lecturas");
    const enc = p.getRange(1, 1, 1, Math.max(p.getLastColumn(), 1)).getValues()[0]
      .map(function (h) { return String(h || "").trim(); });
    const colJson = enc.indexOf("Preguntas JSON") + 1;
    if (colJson < 1) throw new Error("No se encontró el lugar donde se guardan las preguntas de cada lectura.");
    pendientes.forEach(function (item) {
      p.getRange(item.lectura._fila, colJson).setValue(JSON.stringify(item.preguntas));
    });
    SpreadsheetApp.flush();
    reconstruirHojaPreguntasDesdeJson_();
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }

  const mensaje = "Se clasificaron " + conteo.preguntas + " preguntas en " + conteo.lecturas + " lecturas. " +
    "Literal: " + conteo.literal + " · Inferencial: " + conteo.inferencial + " · Crítica: " + conteo.critica + ".";
  return {
    ok: true,
    mensaje: mensaje,
    lecturas: conteo.lecturas,
    preguntas: conteo.preguntas,
    banco: conteo.banco,
    heuristica: conteo.heuristica,
    ia: conteo.ia,
    literal: conteo.literal,
    inferencial: conteo.inferencial,
    critica: conteo.critica
  };
}

function calcularPme(ppm, comprension) {
  return Math.round(Number(ppm || 0) * (Number(comprension || 0) / 100) * 10) / 10;
}

function resumenTiemposPregunta(arr) {
  const nums = (arr || []).map(function (v) { return Number(v); }).filter(function (n) { return isFinite(n) && n >= 0; });
  if (!nums.length) return { n: 0, promedio: 0, minimo: 0, maximo: 0, impulsivo: false };
  const suma = nums.reduce(function (a, b) { return a + b; }, 0);
  const promedio = Math.round((suma / nums.length) * 10) / 10;
  return {
    n: nums.length,
    promedio: promedio,
    minimo: Math.min.apply(null, nums),
    maximo: Math.max.apply(null, nums),
    impulsivo: promedio > 0 && promedio < 10
  };
}

function desgloseNivelesComprension(preguntas, respuestas) {
  const buckets = {
    literal: { aciertos: 0, total: 0 },
    inferencial: { aciertos: 0, total: 0 },
    critica: { aciertos: 0, total: 0 }
  };
  (preguntas || []).forEach(function (p, i) {
    const n = normalizarNivelComprension(p && p.nivel);
    if (!n || !buckets[n]) return;
    buckets[n].total++;
    if (String((respuestas && respuestas[i]) || "").trim() === String((p && p.respuesta) || "").trim()) {
      buckets[n].aciertos++;
    }
  });
  const out = {};
  let hay = false;
  Object.keys(buckets).forEach(function (k) {
    if (buckets[k].total) hay = true;
    out[k] = {
      aciertos: buckets[k].aciertos,
      total: buckets[k].total,
      pct: buckets[k].total ? Math.round((buckets[k].aciertos / buckets[k].total) * 1000) / 10 : null
    };
  });
  return hay ? out : null;
}

function historialAlumnoParaReporte(matricula) {
  let propios = [];
  try {
    const todos = leerResultadosDeTodasLasPestanas() || [];
    propios = todos.filter(function (r) {
      return String(r.matricula || "").trim() === String(matricula || "").trim();
    });
  } catch (e) {
    propios = [];
  }
  if (!propios.length) {
    return { n: 0, promedioGlobal: null, promedioComprension: null, promedioPpm: null };
  }
  const n = propios.length;
  const sumG = propios.reduce(function (a, r) { return a + Number(r.global || 0); }, 0);
  const sumC = propios.reduce(function (a, r) { return a + Number(r.comprension || 0); }, 0);
  const sumP = propios.reduce(function (a, r) { return a + Number(r.ppm || 0); }, 0);
  return {
    n: n,
    promedioGlobal: Math.round((sumG / n) * 10) / 10,
    promedioComprension: Math.round((sumC / n) * 10) / 10,
    promedioPpm: Math.round((sumP / n) * 10) / 10
  };
}

function pedirRecomendacionAlumnoDeepSeek(payload) {
  const clave = obtenerClaveDeepSeek_();
  if (!clave) return "";
  try {
    const instruccion = "Eres docente de secundaria en la " + NOMBRE_ESCUELA + ".\n" +
      "Escribe 3 consejos cortos (máximo 90 palabras en total) para un alumno de " + (payload.grado || "") + "°.\n" +
      "Segunda persona, tono cercano y respetuoso. Español de México.\n" +
      "NO diagnostiques trastornos ni inventes datos. NO menciones niveles de pregunta si no vienen en el JSON.\n" +
      "Usa SOLO estos resultados:\n" + JSON.stringify(payload) + "\n" +
      "Devuelve solo el texto de la recomendación, sin título.";
    const r = UrlFetchApp.fetch(URL_BASE_DEEPSEEK, {
      method: "post",
      contentType: "application/json",
      headers: { Authorization: "Bearer " + clave },
      payload: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: instruccion }],
        temperature: 0.3,
        max_tokens: 220
      }),
      muteHttpExceptions: true
    });
    if (r.getResponseCode() < 200 || r.getResponseCode() >= 300) return "";
    const j = JSON.parse(r.getContentText());
    const txt = j && j.choices && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : "";
    return String(txt || "").replace(/\s+/g, " ").trim().substring(0, 500);
  } catch (e) {
    return "";
  }
}

/**********************************************************************
 * CÁLCULO Y GUARDADO DE RESULTADOS (servidor)
 **********************************************************************/
function calcularNivelPpm(ppm, spec) {
  if (ppm < spec.ppmMin) return "bajo";
  if (ppm > spec.ppmMax) return "alto";
  return "dentro";
}

function calcularCalificaciones(palabras, tiempoLectura, aciertos, totalPreguntas, grado) {
  const spec = especificacionesDeGrado(grado);
  const seg = Math.max(1, Number(tiempoLectura) || 1);
  const ppm = Math.round((palabras / seg) * 60 * 10) / 10;

  const comprension = totalPreguntas > 0
    ? Math.round((aciertos / totalPreguntas) * 100 * 10) / 10
    : 0;

  const ppmObj = Number(spec.ppmObjetivo) || 1;
  const velocidadNorm = Math.min(100, Math.round((ppm / ppmObj) * 100 * 10) / 10);

  const global = Math.round((PESO_COMPRENSION * comprension + PESO_VELOCIDAD * velocidadNorm) * 10) / 10;

  return {
    ppm: ppm,
    nivelPpm: calcularNivelPpm(ppm, spec),
    comprension: comprension,
    velocidadNorm: velocidadNorm,
    global: global,
    spec: spec
  };
}

function guardarResultadosExamen(datos) {
  asegurarSetup();
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  let locked = true;
  try {
    if (!datos || typeof datos !== "object") throw new Error("Datos de examen no proporcionados.");
    const mat = String(datos.matricula || "").trim();
    if (!mat) throw new Error("Matrícula de alumno no especificada.");

    const cache = CacheService.getScriptCache();
    const tokenRecibido = String(datos.tokenExamen || "").trim();
    if (!tokenRecibido) {
      throw new Error("Acceso denegado: se requiere un token de examen válido para registrar los resultados.");
    }

    // 1. Verificación de idempotencia frente a reenvío del mismo token:
    const previo = cache.get("examen_consumido_" + tokenRecibido);
    if (previo) {
      if (datos.reintento || datos.esReintento) {
        try {
          const pObj = JSON.parse(previo);
          if (pObj && pObj.resultado) {
            return { ok: true, reintentoIdempotente: true, resultado: pObj.resultado };
          }
        } catch (eP) {}
      }
      throw new Error("El token de examen es inválido, ha expirado o ya fue utilizado.");
    }

    const raw = cache.get("examen_token_" + tokenRecibido);
    if (!raw) {
      if (datos.reintento || datos.esReintento) {
        const persistido = buscarResultadoPrevioEnHoja_(mat, tokenRecibido, datos);
        if (persistido) {
          return { ok: true, reintentoIdempotente: true, resultado: persistido };
        }
      }
      throw new Error("El token de examen es inválido, ha expirado o ya fue utilizado.");
    }

    let intentoValido = null;
    try {
      intentoValido = JSON.parse(raw);
    } catch (e) {
      throw new Error("Error de integridad en el token de examen.");
    }

    if (!intentoValido || typeof intentoValido !== "object") {
      throw new Error("No hay un intento de evaluación válido o vigente para esta matrícula. Inicia la evaluación nuevamente.");
    }

    // 2. Validar matrícula
    if (String(intentoValido.matricula || "").trim().toLowerCase() !== mat.toLowerCase()) {
      throw new Error("Conflicto de identidad: el intento de examen no corresponde a la matrícula indicada.");
    }

    // 3. Validar lectura asignada
    const idLecturaEnviada = String(datos.idLectura || "").trim();
    if (!idLecturaEnviada || String(intentoValido.idLectura || "").trim() !== idLecturaEnviada) {
      throw new Error("Conflicto de examen: la lectura enviada no coincide con la lectura asignada en el intento.");
    }

    // 4. SEC-A03-02: Validar modalidad estricta contra catálogo y contra intento original
    const MODALIDADES_VALIDAS = ["sorteo", "trimestral"];
    if (datos.modo === undefined || datos.modo === null || String(datos.modo).trim() === "") {
      throw new Error("Modalidad de evaluación no especificada o vacía.");
    }
    const modoEnviado = String(datos.modo).trim().toLowerCase();
    if (MODALIDADES_VALIDAS.indexOf(modoEnviado) < 0) {
      throw new Error("Modalidad de evaluación no reconocida: '" + modoEnviado + "'. Solo se permite 'sorteo' o 'trimestral'.");
    }
    const modoEsperado = String(intentoValido.modo || "").trim().toLowerCase();
    if (modoEnviado !== modoEsperado) {
      throw new Error("Conflicto de modalidad: la modalidad enviada (" + modoEnviado + ") no coincide con la modalidad autorizada en el intento (" + modoEsperado + ").");
    }
    const esTrimestral = modoEsperado === "trimestral";

    // 5. SEC-A03-02: Validar trimestre contra el intento y contra la configuración escolar
    const cfgT = leerCfgTrimestral_();
    const trimRaw = (datos.trimestre && (datos.trimestre.trimestre || datos.trimestre.num)) || datos.trimestre;
    const trimNumEnviado = String(trimRaw || "").trim();
    if (esTrimestral) {
      if (!trimNumEnviado) {
        throw new Error("Trimestre escolar no especificado o vacío para evaluación trimestral.");
      }
      const trimEsperado = String(intentoValido.trimestre || "").trim();
      if (!trimEsperado || trimNumEnviado !== trimEsperado) {
        throw new Error("Conflicto de trimestre: el trimestre enviado (" + trimNumEnviado + ") no coincide con el trimestre asignado en el intento (" + trimEsperado + ").");
      }
      if (cfgT && cfgT.habilitado === false) {
        throw new Error("La evaluación trimestral está deshabilitada en la configuración escolar.");
      }
      const trimPermitidos = (cfgT && cfgT.trimestres && Object.keys(cfgT.trimestres).length) ? Object.keys(cfgT.trimestres) : ["1", "2", "3"];
      if (trimPermitidos.indexOf(trimNumEnviado) < 0) {
        throw new Error("Conflicto de configuración: el trimestre indicado (" + trimNumEnviado + ") no es válido según la configuración escolar.");
      }
    } else {
      if (trimNumEnviado && intentoValido.trimestre && trimNumEnviado !== String(intentoValido.trimestre).trim()) {
        throw new Error("Conflicto de examen: no se puede asociar un trimestre ajeno a una evaluación ordinaria de sorteo.");
      }
    }

    // 6. Validar existencia y estado del alumno
    const alumno = buscarAlumno(mat);
    if (!alumno) throw new Error("Alumno no encontrado.");
    if (String(alumno["Activo"] || "SI").toUpperCase() === "NO") throw new Error("Este alumno no está activo.");

    // 7. Validar número de intento y cupo disponible ANTES de consumir el token
    const todosRes = leerResultadosDeTodasLasPestanas() || [];
    const tUse = esTrimestral ? (trimNumEnviado || intentoValido.trimestre || trimestreVigente_(cfgT).num) : "";
    const intento = esTrimestral
      ? (contarIntentosTrimestrales_(mat, todosRes, cfgT, tUse) + 1)
      : (contarIntentosSorteo_(mat, todosRes, cfgT) + 1);

    if (intentoValido.intentoEsperado && intento !== intentoValido.intentoEsperado) {
      throw new Error("Conflicto de intento: el intento del examen (" + intento + ") no corresponde al intento vigente del alumno (" + intentoValido.intentoEsperado + ").");
    }

    if (esTrimestral) {
      const usadosT = contarIntentosTrimestrales_(mat, todosRes, cfgT, tUse);
      const permitidosT = intentosTrimestralesPermitidos_(cfgT, tUse);
      if (usadosT >= permitidosT) {
        throw new Error("Este alumno ya no tiene intentos para la lectura trimestral.");
      }
    } else if (contarIntentosSorteo_(mat, todosRes, cfgT) >= intentosPermitidosDe(alumno)) {
      throw new Error("Este alumno ya no tiene intentos disponibles.");
    }

    // 8. Validar lectura y reactivos
    const lectura = buscarLecturaPorId(datos.idLectura);
    if (!lectura) throw new Error("Lectura no encontrada.");

    const preguntas = preguntasDeLectura(lectura);
    if (!preguntas || !preguntas.length) throw new Error("La lectura no tiene preguntas configuradas.");

    // Recalcular aciertos desde las respuestas (el servidor ignora aciertos falsificados por el cliente)
    const respuestas = Array.isArray(datos.respuestas) ? datos.respuestas : [];
    let aciertos = 0;
    preguntas.forEach(function (p, i) {
      if (String(respuestas[i] || "").trim() === String(p.respuesta || "").trim()) aciertos++;
    });

    const palabras = contarPalabras(lectura["Texto"]);
    const tiempoLectura = Math.max(1, Math.min(7200, Number(datos.tiempoLectura) || 1));
    const tiempoReactivos = Math.max(0, Math.min(7200, Number(datos.tiempoReactivos) || 0));
    const relecturas = Math.max(0, Math.min(100, Math.floor(Number(datos.relecturas) || 0)));
    const tiemposPregunta = Array.isArray(datos.tiemposPregunta)
      ? datos.tiemposPregunta.map(function (t) { return Math.max(0, Math.min(3600, Number(t) || 0)); })
      : [];

    const calc = calcularCalificaciones(palabras, tiempoLectura, aciertos, preguntas.length, alumno["Grado"]);
    const pme = calcularPme(calc.ppm, calc.comprension);
    const tiempos = resumenTiemposPregunta(tiemposPregunta);
    const desglose = desgloseNivelesComprension(preguntas, respuestas);
    const historial = historialAlumnoParaReporte(mat);
    let deltaGlobal = null;
    if (historial.n && historial.promedioGlobal != null) {
      deltaGlobal = Math.round((calc.global - historial.promedioGlobal) * 10) / 10;
    }

    const libro = obtenerLibro();
    const p = libro.getSheetByName("Resultados");
    if (!p) throw new Error("No se encontró la pestaña Resultados.");

    let enc = p.getRange(1, 1, 1, Math.max(p.getLastColumn(), 1)).getValues()[0]
      .map(function(h) { return String(h || "").trim(); });

    let cambiosEnc = false;
    ENCABEZADOS.Resultados.forEach(function(h) {
      if (enc.indexOf(h) < 0) {
        enc.push(h);
        cambiosEnc = true;
      }
    });

    if (cambiosEnc) {
      try {
        p.getRange(1, 1, 1, enc.length).setValues([enc]);
        p.getRange(1, 1, 1, enc.length).setFontWeight("bold");
      } catch (eEnc) {
        throw new Error("Fallo al registrar resultados en la base de datos: " + (eEnc.message || eEnc) + ". Tu intento sigue vigente; por favor reintenta.");
      }
    }

    // 9. Comprobación idempotente en hoja antes de escribir: verificar si ya existe este intento
    const uRow = p.getLastRow();
    if (uRow >= 2) {
      const numRows = uRow - 1;
      const todosVals = p.getRange(2, 1, numRows, Math.min(enc.length, p.getLastColumn())).getValues();
      const normH = function(h) { return String(h || "").toLowerCase().replace(/[^a-z0-9]/g, ""); };
      const idxMat = enc.map(normH).indexOf("matricula");
      const idxLec = enc.map(normH).indexOf("idlectura");
      const idxInt = enc.map(normH).indexOf("intento");
      const idxMod = enc.map(normH).indexOf("modo");
      const idxTrim = enc.map(normH).indexOf("trimestre");
      const idxToken = enc.map(normH).indexOf("tokenexamen");

      for (let r = todosVals.length - 1; r >= 0; r--) {
        const row = todosVals[r];
        const rowToken = idxToken >= 0 ? String(row[idxToken] || "").trim() : "";
        const rowMat = idxMat >= 0 ? String(row[idxMat] || "").trim().toLowerCase() : "";
        const rowLec = idxLec >= 0 ? String(row[idxLec] || "").trim() : "";
        const rowInt = idxInt >= 0 ? Number(row[idxInt] || 0) : 0;
        const rowMod = idxMod >= 0 ? String(row[idxMod] || "").trim().toLowerCase() : "";
        const rowTrim = idxTrim >= 0 ? String(row[idxTrim] || "").trim() : "";

        const coincideToken = (rowToken && rowToken === tokenRecibido);
        const coincideTupla = (idxMat >= 0 && idxLec >= 0 && idxInt >= 0 &&
          rowMat === mat.toLowerCase() &&
          rowLec === idLecturaEnviada &&
          rowInt === intento &&
          (!rowMod || rowMod === (esTrimestral ? "trimestral" : "sorteo")) &&
          (!esTrimestral || !rowTrim || rowTrim === tUse));

        if (coincideToken || coincideTupla) {
          // Ya persistido previamente en la hoja: consumir y responder idempotente
          cache.remove("examen_token_" + tokenRecibido);
          cache.remove("examen_vigente_" + mat);
          const resIdempotente = {
            palabras: palabras,
            tiempoLectura: tiempoLectura,
            tiempoReactivos: tiempoReactivos,
            ppm: calc.ppm,
            nivelPpm: calc.nivelPpm,
            aciertos: aciertos,
            total: preguntas.length,
            comprension: calc.comprension,
            velocidadNorm: calc.velocidadNorm,
            global: calc.global,
            pme: pme,
            tiemposPregunta: tiempos,
            relecturas: relecturas,
            desglose: desglose,
            historial: { n: historial.n, promedioGlobal: historial.promedioGlobal, promedioComprension: historial.promedioComprension, deltaGlobal: deltaGlobal },
            recomendacion: "",
            spec: { ppmMin: calc.spec.ppmMin, ppmMax: calc.spec.ppmMax, ppmObjetivo: calc.spec.ppmObjetivo }
          };
          try {
            cache.put("examen_consumido_" + tokenRecibido, JSON.stringify({ estado: "guardado", resultado: resIdempotente }), 7200);
          } catch (eC) {}
          return { ok: true, reintentoIdempotente: true, resultado: resIdempotente };
        }
      }
    }

    const fila = new Array(enc.length);
    for (let i = 0; i < fila.length; i++) fila[i] = "";

    let tReactivosFinal = tiempoReactivos;
    if (tReactivosFinal <= 0 && Array.isArray(datos.tiemposPregunta) && datos.tiemposPregunta.length) {
      tReactivosFinal = datos.tiemposPregunta.reduce(function(acc, v) { return acc + (Number(v) || 0); }, 0);
    }
    const tTotalFinal = tiempoLectura + tReactivosFinal;

    const normalizarH = function(h) {
      return String(h || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
    };

    const ponerEnColumna = function(posibles, val) {
      const normPosibles = posibles.map(normalizarH);
      for (let k = 0; k < enc.length; k++) {
        if (normPosibles.indexOf(normalizarH(enc[k])) >= 0) {
          fila[k] = val;
        }
      }
    };

    ponerEnColumna(["Marca Temporal", "Fecha"], new Date());
    ponerEnColumna(["Escuela"], nombreEscuela_());
    ponerEnColumna(["Matrícula", "Matricula"], String(alumno["Matrícula"] || ""));
    ponerEnColumna(["Nombre Estudiante", "Nombre Completo", "Nombre", "Alumno", "Estudiante"], String(alumno["Nombre Completo"] || ""));
    ponerEnColumna(["Grado"], String(alumno["Grado"] || ""));
    ponerEnColumna(["Grupo", "Grupo/Grado"], String(alumno["Grupo"] || ""));
    ponerEnColumna(["Género", "Genero"], "");
    ponerEnColumna(["Asignatura"], String(datos.asignatura || ""));
    ponerEnColumna(["Tema"], String(datos.tema || ""));
    ponerEnColumna(["ID Lectura"], String(datos.idLectura || ""));
    ponerEnColumna(["Tiempo Lectura (s)", "Tiempo Lectura", "T lectura (s)", "T lectura"], tiempoLectura);
    ponerEnColumna(["Tiempo Reactivos (s)", "Tiempo reactivos (s)", "Tiempo Reactivos", "T reactivos (s)", "T reactivos"], tReactivosFinal);
    ponerEnColumna(["Tiempo Total (s)", "Tiempo total (s)", "Tiempo Total", "T total (s)", "T total"], tTotalFinal);
    ponerEnColumna(["Segundos por pregunta"], JSON.stringify(datos.tiemposPregunta || []));
    ponerEnColumna(["Aciertos"], aciertos);
    ponerEnColumna(["Calificación comprensión (%)", "Calificación (%)", "Calificacion", "Calificación"], calc.comprension);
    ponerEnColumna(["PPM"], calc.ppm);
    ponerEnColumna(["Nivel PPM"], calc.nivelPpm);
    ponerEnColumna(["Calificación global (%)", "Global (%)"], calc.global);
    ponerEnColumna(["Intento"], intento);
    ponerEnColumna(["PME"], pme);
    ponerEnColumna(["Relecturas"], relecturas);
    ponerEnColumna(["Desglose niveles"], desglose ? JSON.stringify(desglose) : "");
    ponerEnColumna(["Modo"], esTrimestral ? "trimestral" : "sorteo");
    ponerEnColumna(["Trimestre"], esTrimestral ? tUse : "");
    ponerEnColumna(["Token Examen", "Token", "Id Examen", "Clave Idempotencia"], tokenRecibido);
    ponerEnColumna(["Recomendación"], "");

    const payloadIa = {
      grado: String(alumno["Grado"] || ""),
      comprension: calc.comprension,
      aciertos: aciertos,
      total: preguntas.length,
      ppm: calc.ppm,
      nivelPpm: calc.nivelPpm,
      ppmMin: calc.spec.ppmMin,
      ppmMax: calc.spec.ppmMax,
      ppmObjetivo: calc.spec.ppmObjetivo,
      pme: pme,
      promedioSegPregunta: tiempos.promedio,
      impulsivo: tiempos.impulsivo,
      relecturas: relecturas,
      desglose: desglose,
      evaluacionesPrevias: historial.n,
      promedioGlobalPrevio: historial.promedioGlobal
    };

    // 10. Persistencia protegida en Google Sheets
    const filaAntesDeGuardar = p.getLastRow();
    try {
      p.appendRow(fila);
      SpreadsheetApp.flush();
    } catch (eAppend) {
      // Verificar si a pesar del error la fila fue agregada
      const filaDespues = p.getLastRow();
      let agregadaRealmente = false;
      if (filaDespues > filaAntesDeGuardar) {
        agregadaRealmente = true;
      }
      if (!agregadaRealmente) {
        // La escritura falló y no se guardó nada en la hoja.
        // NO consumimos el token. El token sigue intacto en CacheService para reintento.
        throw new Error("Fallo al registrar resultados en la base de datos: " + (eAppend.message || eAppend) + ". Tu intento sigue vigente; por favor reintenta.");
      }
    }

    // Llegados a este punto, la fila está 100% escrita en Google Sheets.
    // Invalidamos el token en cache y lo registramos como consumido (idempotencia).
    cache.remove("examen_token_" + tokenRecibido);
    cache.remove("examen_vigente_" + mat);

    const filaGuardada = p.getLastRow();
    lock.releaseLock();
    locked = false;

    let recomendacion = "";
    try {
      recomendacion = pedirRecomendacionAlumnoDeepSeek(payloadIa);
      if (recomendacion) {
        const colRec = enc.indexOf("Recomendación") + 1;
        if (colRec > 0) p.getRange(filaGuardada, colRec).setValue(recomendacion);
      }
    } catch (eRec) {}

    try { invalidarCachesDatos_(); } catch (eInv) {}

    const resultadoFinal = {
      palabras: palabras,
      tiempoLectura: tiempoLectura,
      tiempoReactivos: tReactivosFinal,
      ppm: calc.ppm,
      nivelPpm: calc.nivelPpm,
      aciertos: aciertos,
      total: preguntas.length,
      comprension: calc.comprension,
      velocidadNorm: calc.velocidadNorm,
      global: calc.global,
      pme: pme,
      tiemposPregunta: tiempos,
      relecturas: relecturas,
      desglose: desglose,
      historial: {
        n: historial.n,
        promedioGlobal: historial.promedioGlobal,
        promedioComprension: historial.promedioComprension,
        deltaGlobal: deltaGlobal
      },
      recomendacion: recomendacion,
      spec: {
        ppmMin: calc.spec.ppmMin,
        ppmMax: calc.spec.ppmMax,
        ppmObjetivo: calc.spec.ppmObjetivo
      }
    };

    cache.put("examen_consumido_" + tokenRecibido, JSON.stringify({ estado: "guardado", resultado: resultadoFinal }), 7200);

    return {
      ok: true,
      resultado: resultadoFinal
    };
  } finally {
    if (locked) {
      try { lock.releaseLock(); } catch (eLock) {}
    }
  }
}

function buscarResultadoPrevioEnHoja_(mat, tokenRecibido, datos) {
  try {
    const libro = obtenerLibro();
    if (!libro) return null;
    const p = libro.getSheetByName("Resultados");
    if (!p || p.getLastRow() < 2) return null;
    const lastRow = p.getLastRow();
    const lastCol = p.getLastColumn();
    const enc = p.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) {
      return String(h || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    });
    const idxToken = enc.indexOf("tokenexamen");
    const idxMat = enc.indexOf("matricula");
    const idxLec = enc.indexOf("idlectura");
    const idxPpm = enc.indexOf("ppm");
    const idxComp = enc.indexOf("calificacioncomprension");
    const idxGlob = enc.indexOf("calificacionglobal");
    const idxAci = enc.indexOf("aciertos");
    const idxTLec = enc.indexOf("tiempolecturas");
    const idxTRea = enc.indexOf("tiemporeactivoss");
    const idLecDatos = String((datos && datos.idLectura) || "").trim();

    const filas = p.getRange(2, 1, lastRow - 1, lastCol).getValues();
    for (let r = filas.length - 1; r >= 0; r--) {
      const row = filas[r];
      const rToken = idxToken >= 0 ? String(row[idxToken] || "").trim() : "";
      const rMat = idxMat >= 0 ? String(row[idxMat] || "").trim().toLowerCase() : "";
      const rLec = idxLec >= 0 ? String(row[idxLec] || "").trim() : "";

      const matchToken = (tokenRecibido && rToken && rToken === tokenRecibido);
      const matchTupla = (mat && rMat === mat.toLowerCase() && idLecDatos && rLec === idLecDatos);

      if (matchToken || matchTupla) {
        return {
          ppm: idxPpm >= 0 ? Number(row[idxPpm] || 0) : 0,
          comprension: idxComp >= 0 ? Number(row[idxComp] || 0) : 0,
          global: idxGlob >= 0 ? Number(row[idxGlob] || 0) : 0,
          aciertos: idxAci >= 0 ? Number(row[idxAci] || 0) : 0,
          tiempoLectura: idxTLec >= 0 ? Number(row[idxTLec] || 0) : 0,
          tiempoReactivos: idxTRea >= 0 ? Number(row[idxTRea] || 0) : 0
        };
      }
    }
  } catch (eB) {}
  return null;
}

/**********************************************************************
 * LECTURAS — GUARDAR / ACTIVAR / IA
 **********************************************************************/
function guardarLecturaBanco(token, lectura) {
  exigirAdmin(token);
  asegurarSetup();
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const grado = String((lectura && lectura.grado) || "").trim();
    const asig = String((lectura && lectura.asignatura) || "").trim();
    const tema = String((lectura && lectura.tema) || "").trim();
    const texto = asegurarFormatoLibro((lectura && lectura.texto) || "");
    if (!grado || !asig || !tema) throw new Error("Elige grado, asignatura y tema.");
    if (contarPalabras(texto) < 40) throw new Error("El texto es demasiado corto.");
    const preguntas = (lectura.preguntas || []).map(normalizarPreguntaAdmin).filter(Boolean);
    if (!preguntas.length) throw new Error("Agrega al menos una pregunta con 2 opciones y marca la correcta.");

    let id = String((lectura && lectura.id) || "").trim();
    if (!id) id = "DOC_" + Date.now();
    const fila = [
      id, grado, asig, tema, texto,
      contarPalabras(texto), JSON.stringify(preguntas),
      String((lectura && lectura.activa) || "SI"), "DOCENTE"
    ];
    const p = obtenerLibro().getSheetByName("Lecturas");
    const exist = buscarLecturaPorId(id);
    if (exist) p.getRange(exist._fila, 1, 1, ENCABEZADOS.Lecturas.length).setValues([fila]);
    else p.appendRow(fila);

    reemplazarPreguntasDeLectura_(id, preguntas);
    invalidarCachesDatos_();
    return { ok: true, id: id, palabras: contarPalabras(texto), mensaje: "Lectura guardada." };
  } finally { lock.releaseLock(); }
}

function cambiarActivaLectura(token, id, activa) {
  exigirAdmin(token);
  const l = buscarLecturaPorId(id);
  if (!l) throw new Error("No se encontró esa lectura.");
  const v = (activa === true || activa === "SI" || activa === "true") ? "SI" : "NO";
  obtenerLibro().getSheetByName("Lecturas").getRange(l._fila, 8).setValue(v);
  invalidarCachesDatos_();
  return { ok: true, mensaje: v === "SI" ? "Lectura activada." : "Lectura ocultada." };
}

function eliminarLectura(token, id) {
  exigirAdmin(token);
  const l = buscarLecturaPorId(id);
  if (!l) throw new Error("No se encontró esa lectura.");
  const p = obtenerLibro().getSheetByName("Lecturas");
  p.deleteRow(l._fila);
  
  const pPreg = obtenerLibro().getSheetByName("Preguntas");
  if (pPreg && pPreg.getLastRow() >= 2) {
    const filasPreg = leerFilas("Preguntas");
    const filasConservar = filasPreg.filter(function (x) {
      return String(x["ID Lectura"]) !== String(id);
    });
    pPreg.clearContents();
    pPreg.appendRow(ENCABEZADOS.Preguntas);
    pPreg.getRange(1, 1, 1, ENCABEZADOS.Preguntas.length).setFontWeight("bold");
    if (filasConservar.length) {
      const matriz = filasConservar.map(function (x) {
        return filaPreguntaParaHoja(x["ID Lectura"], x["Orden"] || 1, {
          p: x["Enunciado"] || "",
          opciones: [x["Opción 1"], x["Opción 2"], x["Opción 3"], x["Opción 4"], x["Opción 5"], x["Opción 6"]],
          respuesta: x["Respuesta correcta"] || "",
          nivel: x["Nivel"] || ""
        });
      });
      pPreg.getRange(2, 1, matriz.length, ENCABEZADOS.Preguntas.length).setValues(matriz);
    }
  }
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Lectura eliminada del banco." };
}

function generarLecturaAdmin(token, grado, asignatura, tema) {
  exigirAdmin(token);
  asegurarSetup();
  const spec = especificacionesDeGrado(grado);
  const paquete = generarPaqueteIaOLocal(grado, asignatura, tema, spec);
  const id = "LEC_" + Date.now();
  obtenerLibro().getSheetByName("Lecturas").appendRow([
    id, String(grado), asignatura, tema, paquete.texto,
    contarPalabras(paquete.texto), JSON.stringify(paquete.preguntas), "SI", paquete.origen
  ]);
  reemplazarPreguntasDeLectura_(id, paquete.preguntas || []);
  formatearHojasDeLectura();
  return { ok: true, id: id, palabras: contarPalabras(paquete.texto), origen: paquete.origen };
}

function generarPaqueteIaOLocal(grado, asignatura, tema, spec) {
  const clave = obtenerClaveDeepSeek_();
  if (clave) {
    try {
      const ia = pedirLecturaDeepSeek(clave, grado, asignatura, tema, spec);
      if (ia) return ia;
    } catch (e) { Logger.log(e.message); }
  }
  return lecturaLocalAdministrador(grado, asignatura, tema, spec);
}

function pedirLecturaDeepSeek(clave, grado, asignatura, tema, spec) {
  const instruccion = "Eres un especialista pedagógico de la " + NOMBRE_ESCUELA + " y experto en diseño psicométrico y reactivos de evaluación de comprensión lectora (Fase 6: Educación Secundaria - NEM).\n" +
    "Genera UNA lectura de comprensión contextualizada, formativa y profunda para alumnos de " + grado + "° de secundaria, en la asignatura \"" + asignatura + "\", sobre el tema / PDA: \"" + tema + "\".\n\n" +
    "Especificaciones pedagógicas y del texto:\n" +
    "- Grado escolar: " + grado + "° de secundaria.\n" +
    "- Extensión: entre " + spec.palabrasMin + " y " + spec.palabrasMax + " palabras (ideal: " + spec.objetivoPalabras + " palabras).\n" +
    "- Tipo de texto: " + spec.tipo + ".\n" +
    "- Gramática y estilo: " + spec.gramatica + ".\n" +
    "- Párrafos: Redacta entre 5 y 8 párrafos bien estructurados separados por doble salto de línea (\\n\\n).\n\n" +
    "Reglas estrictas para el diseño de las " + spec.objetivoPreguntas + " preguntas y sus opciones (Reactivos de alto rigor):\n" +
    "1. NIVEL DE COMPRENSIÓN: Etiqueta CADA pregunta con \"nivel\": \"literal\", \"inferencial\" o \"critica\".\n" +
    "   - literal: datos explícitos del texto (hechos, nombres, lugares, secuencia).\n" +
    "   - inferencial: leer entre líneas (causa-efecto, idea principal, significado por contexto).\n" +
    "   - critica: propósito del autor, postura, evaluar una afirmación.\n" +
    (String(grado) === "1"
      ? "   Para 1°: mayoría literal y algunas inferenciales. Evita crítica.\n"
      : (String(grado) === "2"
        ? "   Para 2°: mezcla de inferencial y literal; puedes incluir 1 crítica.\n"
        : "   Para 3°: mezcla de las tres, con énfasis en crítica e inferencial.\n")) +
    "2. DISTRACTORES ALTAMENTE PLAUSIBLES: Las 3 opciones incorrectas NO deben ser absurdas ni cómicas. Deben basarse en ideas mencionadas en la lectura pero aplicadas incorrectamente, confusiones conceptuales comunes o interpretaciones lógicas alternativas.\n" +
    "3. HOMOGENEIDAD Y LONGITUD: Las 4 opciones (A, B, C, D) deben tener una longitud similar, la misma estructura sintáctica y el mismo tono formal. Evita que la respuesta correcta sea la más larga, detallada o evidente.\n" +
    "4. SIN PISTAS GRAMATICALES: Evita palabras delatoras o absolutos (como 'siempre', 'nunca', 'todos') exclusivamente en los distractores.\n" +
    "5. PRECISIÓN: Solo UNA opción debe ser irrefutablemente correcta y respaldada por el texto.\n\n" +
    "Devuelve ÚNICAMENTE un objeto JSON válido con este formato exacto:\n" +
    "{\n" +
    "  \"texto\": \"Párrafo 1...\\n\\nPárrafo 2...\\n\\nPárrafo 3...\",\n" +
    "  \"preguntas\": [\n" +
    "    {\n" +
    "      \"p\": \"¿Enunciado de la pregunta...?\",\n" +
    "      \"opciones\": [\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"],\n" +
    "      \"respuesta\": \"Opción correcta exacta\",\n" +
    "      \"nivel\": \"literal\"\n" +
    "    }\n" +
    "  ]\n" +
    "}";
  const r = UrlFetchApp.fetch(URL_BASE_DEEPSEEK, {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + clave },
    payload: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: instruccion }],
      response_format: { type: "json_object" },
      temperature: 0.4
    }),
    muteHttpExceptions: true
  });
  if (r.getResponseCode() < 200 || r.getResponseCode() >= 300) return null;
  const j = JSON.parse(r.getContentText());
  const contenido = j.choices[0].message.content;
  let datos;
  if (typeof contenido === "string") {
    const bloque = contenido.match(/```(?:json)?\s*([\s\S]*?)```/i);
    datos = JSON.parse((bloque ? bloque[1] : contenido).trim());
  } else datos = contenido;
  if (!datos || !datos.texto || !datos.preguntas) return null;
  const preguntas = (datos.preguntas || []).map(function (pr) {
    const nrm = homogeneizarPregunta(pr) || normalizarPreguntaAdmin(pr);
    if (!nrm) return null;
    nrm.nivel = normalizarNivelComprension(pr.nivel || nrm.nivel);
    return nrm;
  }).filter(Boolean);
  if (!preguntas.length) return null;
  return { texto: asegurarFormatoLibro(datos.texto), preguntas: preguntas, origen: "IA" };
}

function lecturaLocalAdministrador(grado, asignatura, tema) {
  const pack = construirLecturaBanco(String(grado), asignatura, tema || "");
  return { texto: pack.texto, preguntas: pack.preguntas, origen: "BANCO" };
}

function limpiarHtmlLectura(texto) {
  return String(texto || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function partirParrafosLectura(texto) {
  return String(texto || "").split(/\n\s*\n/).map(function (p) {
    return p.replace(/\s+/g, " ").trim();
  }).filter(Boolean);
}

function compactarParrafosLectura(texto, objetivo) {
  objetivo = objetivo || 6;
  const partes = partirParrafosLectura(texto);
  if (partes.length <= 8 && partes.length >= 5) return partes.join("\n\n");
  if (partes.length <= objetivo) return partes.join("\n\n");
  const grupo = Math.max(1, Math.ceil(partes.length / objetivo));
  const out = [];
  for (let i = 0; i < partes.length; i += grupo) {
    out.push(partes.slice(i, i + grupo).join(" "));
  }
  while (out.length > 8) {
    const b = out.pop();
    out[out.length - 1] += " " + b;
  }
  return out.join("\n\n");
}

function recortarTextoHasta(texto, maximo) {
  let partes = partirParrafosLectura(texto);
  while (partes.length > 5 && contarPalabras(partes.join("\n\n")) > maximo) {
    partes.pop();
  }
  let t = partes.join("\n\n");
  if (contarPalabras(t) <= maximo) return t;
  const palabras = t.split(/\s+/);
  return palabras.slice(0, maximo).join(" ").replace(/\s+[^\s]*$/, "").trim();
}

function ajustarTextoAEspecificacion(texto, grado, asignatura, tema, spec) {
  let t = asegurarFormatoLibro(limpiarHtmlLectura(texto));
  if (contarPalabras(t) < spec.palabrasMin) {
    const pack = contenidoTematico(asignatura);
    t = expandirTextoHasta(t, spec.objetivoPalabras, grado, asignatura, tema, pack.relleno);
  }
  t = compactarParrafosLectura(t, 6);
  if (contarPalabras(t) < spec.palabrasMin) {
    const pack = contenidoTematico(asignatura);
    t = expandirTextoHasta(t, spec.objetivoPalabras, grado, asignatura, tema, pack.relleno);
    t = compactarParrafosLectura(t, 6);
  }
  if (contarPalabras(t) > spec.palabrasMax) t = recortarTextoHasta(t, spec.palabrasMax);
  if (contarPalabras(t) < spec.palabrasMin) {
    const pack = contenidoTematico(asignatura);
    t = expandirTextoHasta(t, spec.palabrasMin, grado, asignatura, tema, pack.relleno);
  }
  return asegurarFormatoLibro(t);
}

function esOpcionAbsurda(o) {
  return /decorar el sal[oó]n|cancelar el taller|evitar leer|gan[oó] el recreo|color del mural|hora de salida|un tren|un radio|un globo|aeropuerto|r[ií]o nuevo|f[aá]brica de globos|otro pa[ií]s|cables no existen|planta seca|un ticket|un contrato|un recado|examen de ingl[eé]s|copiar de internet|esperar al examen|no usar verbos|otro idioma|borrar la bit[aá]cora|asusta|solo el atole|calles no tienen nombre|independencia no existi[oó]|el sol ya no calienta|nubes son artificiales|concurso de relojes|apagar el sol|cambiar el clima|mural bonito|porque es recreo|no hay reglamento|luz no existe|18 por ciento es imposible|color del letrero|hora del recreo|matr[ií]cula nueva|decorar la tabla|evitar medir|ganar el partido|datos no importan|f[uú]tbol no existe|receta de cocina|adivinanza|chiste del recreo|cerrar la escuela|el mural se cierra|celular es obligatorio|solo chistes|nombres de maestros|expulsar alumnos|quitar el mural|prohibir el recreo|borrar el reglamento|cancelar clases|romper el huerto|perder el mapa|se sec[oó] el mar|inund[oó] la escuela para siempre|fondo del oc[eé]ano|atm[oó]sfera superior|en los polos|ra[ií]z de un [aá]rbol|precio del bal[oó]n|cerrar el patio|quitar el recreo|inventar los n[uú]meros|dejar de contar|el texto no menciona|no observar nada/i.test(String(o || ""));
}

function esReactivoRelleno(en) {
  return /reactivo\s*\d+/i.test(String(en || ""));
}

function homogeneizarPregunta(pr) {
  const nrm = normalizarPreguntaAdmin(pr);
  if (!nrm) return null;
  let ops = nrm.opciones.slice();
  const correcta = nrm.respuesta;
  ops = ops.filter(function (o) { return !esOpcionAbsurda(o) || o === correcta; });
  if (ops.indexOf(correcta) < 0) ops.unshift(correcta);
  const unicas = [];
  ops.forEach(function (o) { if (unicas.indexOf(o) < 0) unicas.push(o); });
  if (unicas.length < 4) return null;
  const otras = unicas.filter(function (o) { return o !== correcta; }).slice(0, 3);
  return { p: nrm.p, opciones: mezclar([correcta].concat(otras)), respuesta: correcta, nivel: nrm.nivel || "" };
}

function bancoReactivosReglamentarios(asignatura) {
  const datos = {
    "Español": {
      literal: [
        pregunta("¿Para qué escribió el grupo una bitácora?", "Para no olvidar lo ocurrido y comparar versiones", ["Para calificar la conducta del grupo", "Para archivar solo los éxitos del taller", "Para sustituir las prácticas de circuito"]),
        pregunta("¿Qué desacuerdo hubo entre María y Luis?", "Si el circuito encendió a la primera o si hubo que cambiar un cable", ["Si el taller debía cambiar de horario", "Quién debía firmar la bitácora ese día", "Si el periódico mural ya estaba terminado"]),
        pregunta("¿Qué encontraron al revisar la mesa de trabajo?", "Un cable suelto guardado en una caja", ["Una pila agotada sobre el banco", "El diagrama de otro equipo", "Un interruptor nuevo sin usar"]),
        pregunta("¿Qué pidió la profesora de Español?", "Oraciones claras y nexos como porque y entonces", ["Que copiaran un texto de otro grado", "Que usaran solo dibujos, sin verbos", "Que escribieran el reporte en otra asignatura"]),
        pregunta("Según el equipo, ¿cómo se empieza una bitácora?", "Anotar el día, describir lo que se ve y no inventar", ["Copiar el formato de un periódico", "Esperar a que falle otra vez el circuito", "Anotar solo los materiales del taller"]),
        pregunta("¿Dónde se publicó el texto del grupo?", "En el periódico mural", ["En el expediente de dirección", "En un aviso para las familias", "En la bitácora de otro taller"])
      ],
      inferencia: [
        pregunta("¿Qué se infiere del desacuerdo entre María y Luis?", "Sin registro escrito es más difícil hallar la causa de un fallo", ["El circuito no puede repararse nunca", "El taller debe cambiar de asignatura", "Español no se relaciona con el trabajo técnico"]),
        pregunta("¿Por qué la bitácora no es un adorno?", "Porque permite comparar versiones y encontrar problemas", ["Porque se cuelga en un lugar visible", "Porque tiene un título llamativo", "Porque ocupa varias páginas"]),
        pregunta("¿Qué se concluye al cambiar «raro» por una descripción precisa?", "La precisión vuelve útil el texto para repetir la práctica", ["Los adjetivos no deben usarse en el taller", "El fallo del circuito desaparece al escribir", "Solo la profesora puede describir el material"]),
        pregunta("¿Por qué un equipo vecino copió el formato de la bitácora?", "Porque cualquier lector podía repetir la experiencia con ese orden", ["Porque la profesora lo pidió como tarea extra", "Porque el otro equipo no tenía materiales", "Porque el mural exigía el mismo título"])
      ],
      critica: [
        pregunta("¿Qué postura sostiene el relato sobre escribir en el taller?", "Registrar con precisión es parte del trabajo técnico y de la lengua", ["Escribir estorba al trabajo técnico", "Solo importa el resultado final del circuito", "Las versiones distintas no deben compararse"]),
        pregunta("¿Qué se evalúa al exigir evidencias y no recuerdos sueltos?", "La confiabilidad del reporte frente a la discusión oral", ["La rapidez para terminar la práctica", "El número de páginas de la bitácora", "La calificación de conducta del grupo"])
      ]
    },
    "Historia": {
      literal: [
        pregunta("¿Qué convocó al pueblo en 1810, según el relato?", "Las campanas", ["Un bando leído en la plaza", "Una carta llegada de la capital", "El toque de un tambor militar"]),
        pregunta("Según Doña Carmen, la independencia...", "No ocurrió en un solo día", ["Duró solo una tarde", "Fue una fiesta escolar", "Empezó con un acuerdo único"]),
        pregunta("¿Todos estaban de acuerdo en esa época?", "No: algunas familias tenían miedo y otras esperaban cambios", ["Sí: todas las familias pensaban igual", "Nadie escuchó el llamado", "Solo los niños tomaron parte"]),
        pregunta("¿Qué encontraron en su colonia?", "La calle Morelos", ["Una placa de otra época", "El archivo municipal cerrado", "Un mapa sin nombres de calle"]),
        pregunta("¿Qué armaron en clase?", "Una línea del tiempo con cinco fechas", ["Un ensayo sin fechas", "Una lista de nombres sin años", "Un debate sin evidencias"]),
        pregunta("¿Dónde está también la historia, según el texto?", "En el barrio, no solo en el libro", ["Solo en documentos de la capital", "Solo en las fechas del examen", "Únicamente en el grabado de la sala"])
      ],
      inferencia: [
        pregunta("¿Qué se infiere de buscar una calle con nombre histórico?", "El pasado se conserva en la vida cotidiana del lugar", ["Las calles cambiaron de nombre por azar", "La independencia no dejó huella local", "Solo el libro escolar guarda el pasado"]),
        pregunta("¿Por qué Doña Carmen menciona el miedo de algunas familias?", "Para mostrar que el proceso histórico no fue unánime", ["Para que los nietos no salgan a la calle", "Para cancelar la línea del tiempo", "Para hablar de la vida cotidiana actual"]),
        pregunta("¿Qué implica armar una línea con marchas, cartas y acuerdos?", "El proceso se entiende por etapas, no por un solo suceso", ["Basta con memorizar el año de 1810", "Las cartas no son fuentes históricas", "Los acuerdos anulan las marchas"]),
        pregunta("¿Por qué el miedo también es un hecho histórico en el relato?", "Porque hay testimonios y no se borra para heroizar el pasado", ["Porque el miedo sustituye a las fechas", "Porque las familias no participaron", "Porque el barrio no tenía campanas"])
      ],
      critica: [
        pregunta("¿Qué idea crítica plantea el texto sobre enseñar historia?", "Hay que relacionar fechas y personajes con el espacio donde vive el alumno", ["Memorizar nombres basta para comprender", "El barrio no aporta al relato nacional", "Las campanas no deben usarse como fuente"]),
        pregunta("¿Qué se cuestiona al decir que 1810 no cabe en un solo grito?", "La versión simplificada que reduce un proceso a una fecha", ["El uso de mapas en la clase de Historia", "La existencia de personajes de la independencia", "La utilidad de las fotos en el barrio"])
      ]
    },
    "Ciencias": {
      literal: [
        pregunta("¿Qué provoca la evaporación en el ciclo del agua?", "El sol calienta océanos y ríos", ["La basura acumulada en las coladeras", "El viento frío de la madrugada", "El pavimento de las banquetas"]),
        pregunta("¿Qué problema investigó Sofía?", "Que el agua no bajaba porque las coladeras estaban tapadas", ["El corte de luz después del aguacero", "La falta de transporte en la colonia", "El ruido de las rejillas al mediodía"]),
        pregunta("¿Qué impide el drenaje, según su reporte?", "La basura y las hojas secas", ["Las nubes de la siguiente tormenta", "El sol sobre los océanos", "Los ríos lejanos de la ciudad"]),
        pregunta("¿Qué solución propuso Sofía?", "Jornadas de limpieza y no tirar residuos", ["Construir un puente sobre la calle", "Cerrar la vialidad en temporada de lluvias", "Sembrar menos árboles en la banqueta"]),
        pregunta("¿Qué ocurrió en la siguiente temporada de lluvias?", "El agua ya no cubrió las banquetas", ["El vapor dejó de condensarse", "Se interrumpió el ciclo en el océano", "Las nubes dejaron de formarse"]),
        pregunta("¿Dónde se interrumpe el ciclo en el relato?", "En las coladeras tapadas de la ciudad", ["En el fondo del océano", "En la formación de las nubes", "En los ríos antes de evaporarse"])
      ],
      inferencia: [
        pregunta("¿Qué se infiere del caso de Sofía?", "Un fenómeno natural se agrava si no se cuida el entorno urbano", ["El ciclo del agua no ocurre en la ciudad", "Las nubes se forman por la basura", "Sofía modificó el curso de los ríos"]),
        pregunta("¿Por qué midió los minutos que tardaba el agua en bajar?", "Para obtener un dato que sustentara su reporte", ["Para comparar el color de las rejillas", "Para cambiar el horario del aguacero", "Para sustituir las fotografías del reporte"]),
        pregunta("¿Qué se concluye al comparar dos calles con distinto desagüe?", "El tiempo de escurrimiento depende del estado de las coladeras", ["Todas las calles se inundan el mismo tiempo", "La lluvia no forma parte del ciclo", "El pavimento impide que el agua se evapore"]),
        pregunta("¿Por qué el vapor no «desaparece», según la clase?", "Porque se condensa y regresa en forma de precipitación", ["Porque se queda en las coladeras", "Porque el sol deja de calentar", "Porque el pavimento lo retiene"])
      ],
      critica: [
        pregunta("¿Qué postura sostiene el texto?", "Cuidar coladeras es parte de comprender y aplicar el ciclo del agua", ["El ciclo del agua no existe en la ciudad", "Basta memorizar evaporación y condensación", "La basura no altera el drenaje urbano"]),
        pregunta("¿Qué se evalúa al unir fotos, tiempos y campaña vecinal?", "Que una explicación científica debe traducirse en acciones comprobables", ["Que las fotos sustituyen al ciclo natural", "Que el comité no necesita datos", "Que el sol deja de formar nubes en la ciudad"])
      ]
    },
    "Formación Cívica y Ética": {
      literal: [
        pregunta("¿Qué pedía la columna del mural?", "Prohibir el celular en todos los espacios", ["Comprar más celulares para el aula", "Cerrar el recreo por dos semanas", "Eliminar el reglamento escolar"]),
        pregunta("¿Qué advirtió la directora?", "Que una regla debe apoyarse en el reglamento y el diálogo", ["Que el debate queda prohibido", "Que el mural debe retirarse", "Que el celular es obligatorio en clase"]),
        pregunta("¿Qué distinguieron al leer el reglamento?", "Hechos, juicios y propuestas", ["Solo las sanciones del reglamento", "Solo las calificaciones del grupo", "Los nombres de quienes escribieron"]),
        pregunta("¿Qué pidieron quienes rechazaban la prohibición total?", "Zonas y horarios, no una veda absoluta", ["Expulsar a quienes usaran el celular", "Quitar el periódico mural", "Ignorar el contacto con las familias"]),
        pregunta("¿Cuál fue el acuerdo?", "Un ensayo de dos semanas y una encuesta", ["Prohibir el recreo de inmediato", "Borrar el reglamento escolar", "Cancelar el comunicado de dirección"]),
        pregunta("¿Qué riesgo se mencionó al prohibir el celular?", "Limitar el contacto urgente con la familia", ["Impedir las clases de Tecnología", "Eliminar el periódico mural", "Cancelar el reglamento escolar"])
      ],
      inferencia: [
        pregunta("¿Por qué el debate es un ejercicio cívico?", "Porque se discuten reglas con razones, datos y pruebas", ["Porque el mural tiene más lectores", "Porque ocurre durante el recreo", "Porque la directora cierra la discusión"]),
        pregunta("¿Qué se infiere del ensayo de dos semanas?", "Antes de imponer una norma conviene probarla y medir efectos", ["Las normas no pueden modificarse", "La encuesta sustituye al reglamento", "La directora no debe publicar comunicados"]),
        pregunta("¿Qué diferencia un hecho de un juicio en el texto?", "Un hecho se observa; un juicio generaliza, como decir que siempre estorba", ["Un hecho es la opinión de dirección", "Un juicio es el reglamento escolar", "No hay diferencia entre ambos"]),
        pregunta("¿Por qué pegar la encuesta junto al reglamento?", "Para que los datos no reemplacen la norma, sino la informen", ["Para ocultar el reglamento", "Para terminar el debate en el recreo", "Para prohibir nuevas propuestas"])
      ],
      critica: [
        pregunta("¿Qué idea crítica plantea el texto?", "Argumentar es ofrecer razones y someter la idea a una prueba, no imponerse", ["Gana quien publica primero en el mural", "El reglamento sobra si hay encuesta", "Las opiniones no deben discutirse"]),
        pregunta("¿Qué se cuestiona al rechazar la veda total inmediata?", "Que una norma se imponga solo con una opinión, sin evidencia ni diálogo", ["Que el celular sirva para avisar a la familia", "Que exista un periódico mural", "Que el recreo tenga reglas de convivencia"])
      ]
    },
    "Tecnología": {
      literal: [
        pregunta("¿Qué resultado obtuvo el aula piloto?", "Se redujo el consumo 18 por ciento", ["Aumentó el uso de ventiladores", "Se descompusieron los sensores", "Nadie apagó luces en el mes"]),
        pregunta("Según el equipo, ¿de qué depende también el ahorro?", "De cambiar hábitos", ["De comprar más sensores", "De alargar el receso", "De apagar el aula piloto"]),
        pregunta("¿Qué objeción recibió el proyecto?", "Que el costo de los sensores no se recupera", ["Que no hay electricidad en el aula", "Que faltan pupitres en el salón", "Que el letrero contradice el reglamento"]),
        pregunta("¿Cómo respondió el equipo a esa crítica?", "Con una tabla de consumo y el tiempo de retorno", ["Cerrando el aula piloto", "Borrando los datos del mes", "Cancelando los sensores"]),
        pregunta("¿Qué condición puso la escuela?", "Medir resultados cada bimestre", ["Quitar los ventiladores", "No usar letreros", "Trabajar solo de noche"]),
        pregunta("¿A cuántos edificios se extendería el prototipo?", "A tres edificios", ["A ningún otro edificio", "A todos los del estado", "Solo al patio escolar"])
      ],
      inferencia: [
        pregunta("¿Por qué no basta instalar sensores?", "Porque el ahorro también depende de los hábitos de uso", ["Porque el consejo no revisa prototipos", "Porque el 18 por ciento no puede medirse", "Porque el letrero sustituye a los sensores"]),
        pregunta("¿Qué se evalúa al exigir medición bimestral?", "Si el ahorro se sostiene con datos y no fue casualidad de un mes", ["El diseño gráfico del letrero", "La hora en que termina el recreo", "La matrícula de los tres edificios"]),
        pregunta("¿Por qué comparar temperatura de ambos salones?", "Para no atribuir el ahorro al clima en lugar del prototipo", ["Para apagar los ventiladores del testigo", "Para cambiar el mes de la prueba", "Para evitar la tabla de consumo"]),
        pregunta("¿Qué se infiere del tiempo de retorno?", "La inversión se justifica si el ahorro se mantiene varios bimestres", ["Los sensores no tienen costo", "El 18 por ciento es independiente de los hábitos", "El consejo rechazó medir de nuevo"])
      ],
      critica: [
        pregunta("¿Qué tipo de texto ilustra el caso y qué postura toma?", "Argumentativo: hay tesis, evidencias y respuesta a una crítica", ["Narrativo: solo cuenta un accidente del aula", "Instructivo: lista pasos sin datos", "Descriptivo: presenta el letrero sin tesis"]),
        pregunta("¿Qué se sostiene frente a la objeción del costo?", "Que una propuesta técnica debe mostrar evidencia de retorno, no solo el aparato", ["Que el costo no debe discutirse en el consejo", "Que los hábitos no influyen en el consumo", "Que medir cada bimestre es innecesario"])
      ]
    },
    "Matemáticas": {
      literal: [
        pregunta("¿Qué midió el grupo en el patio?", "Cuántos alumnos jugaban fútbol, se sentaban o caminaban", ["La temperatura durante el recreo", "Las calificaciones del grupo", "El número de salones del edificio"]),
        pregunta("¿Por qué midieron tres días a la misma hora?", "Para no comparar momentos distintos", ["Porque el recreo cambió de horario", "Para evitar armar la tabla", "Porque solo ese día había fútbol"]),
        pregunta("¿Qué calcularon después de armar la tabla?", "El promedio de cada actividad", ["El área total del patio", "La altura de las porterías", "El costo de pintar las bancas"]),
        pregunta("¿Qué propusieron con los datos?", "Pintar más bancas en la sombra, no solo otra portería", ["Cerrar una parte del patio", "Quitar el recreo un día a la semana", "Prohibir el fútbol los martes"]),
        pregunta("¿Qué crítica hizo un compañero?", "Que tres días eran pocos", ["Que la tabla era de otro grado", "Que no hubo recreo esos días", "Que no sabían organizar columnas"]),
        pregunta("¿Qué acordó el equipo ante esa crítica?", "Medir una semana completa antes de ir a dirección", ["Borrar la tabla del patio", "Inventar los números faltantes", "Dejar de contar a quienes caminaban"])
      ],
      inferencia: [
        pregunta("¿Para qué sirvió el promedio en este caso?", "Para no dejarse llevar por un solo día atípico", ["Para sustituir la tabla de frecuencias", "Para evitar medir el martes", "Para decidir el horario del recreo"]),
        pregunta("¿Qué se infiere de aceptar que tres días eran pocos?", "Una muestra más grande hace más confiable la propuesta", ["Los datos del martes no deben usarse", "Las bancas no se usan en la sombra", "El fútbol no puede medirse"]),
        pregunta("¿Por qué el martes no bastaba para decidir?", "Porque ese día el fútbol reunió más personas que el promedio", ["Porque no se armó la tabla", "Porque no hubo quienes se sentaran", "Porque dirección pidió otro deporte"]),
        pregunta("¿Qué se concluye al medir a la misma hora?", "Se reduce el error de mezclar el inicio del recreo con el final", ["El promedio deja de ser necesario", "Solo cuenta quienes juegan fútbol", "La sombra no influye en sentarse"])
      ],
      critica: [
        pregunta("¿Qué idea sostiene el texto sobre decidir en la escuela?", "Las decisiones del patio deben apoyarse en mediciones y no solo en gustos", ["Basta con opinar en voz alta", "Las matemáticas no aplican al recreo", "Una portería resuelve cualquier dato"]),
        pregunta("¿Qué se evalúa al aceptar la crítica de la muestra?", "Que una propuesta gana rigor si se corrige el procedimiento con más datos", ["Que dirección no necesita evidencias", "Que tres días equivalen a una semana", "Que el promedio oculta las actividades"])
      ]
    }
  };
  const asigStr = String(asignatura || "").trim();
  if (datos[asigStr]) return datos[asigStr];
  if (/Ciencias|Biolog[ií]a|F[ií]sica|Qu[ií]mica|Geograf/i.test(asigStr)) return datos["Ciencias"];
  if (/Tecnolog/i.test(asigStr)) return datos["Tecnología"];
  if (/Matem[aá]tic/i.test(asigStr)) return datos["Matemáticas"];
  if (/Formaci[oó]n|C[ií]vica|[ÉE]tica/i.test(asigStr)) return datos["Formación Cívica y Ética"];
  if (/Historia/i.test(asigStr)) return datos["Historia"];
  return datos["Español"];
}

function seleccionarReactivosPorGrado(grado, asignatura) {
  const b = bancoReactivosReglamentarios(asignatura);
  const spec = especificacionesDeGrado(grado);
  const n = spec.objetivoPreguntas;
  function marcar(lista, nivel) {
    return (lista || []).map(function (p) {
      const c = {};
      Object.keys(p).forEach(function (k) { c[k] = p[k]; });
      c.nivel = nivel;
      return c;
    });
  }
  let pool = [];
  if (String(grado) === "1") pool = marcar(b.literal, "literal").concat(marcar((b.inferencia || []).slice(0, 1), "inferencial"));
  else if (String(grado) === "2") pool = marcar(b.inferencia, "inferencial").concat(marcar(b.literal, "literal"));
  else pool = marcar(b.critica, "critica").concat(marcar(b.inferencia, "inferencial")).concat(marcar(b.literal, "literal"));
  const vistos = {}, out = [];
  pool.forEach(function (p) {
    const nrm = homogeneizarPregunta(p);
    if (!nrm || vistos[nrm.p]) return;
    vistos[nrm.p] = true;
    out.push(nrm);
  });
  return out.slice(0, n);
}

function auditarLecturaItem(grado, texto, preguntas) {
  const spec = especificacionesDeGrado(grado);
  const t = limpiarHtmlLectura(texto);
  const pal = contarPalabras(t);
  const nP = (preguntas || []).length;
  const nPar = partirParrafosLectura(t).length;
  const problemas = [];
  if (pal < spec.palabrasMin) problemas.push("texto corto (" + pal + ")");
  if (pal > spec.palabrasMax) problemas.push("texto largo (" + pal + ")");
  if (nP < spec.preguntasMin) problemas.push("pocas preguntas (" + nP + ")");
  if (nP > spec.preguntasMax) problemas.push("muchas preguntas (" + nP + ")");
  if (nPar < 5 || nPar > 8) problemas.push("párrafos (" + nPar + ")");
  if (/<[^>]+>/.test(String(texto || ""))) problemas.push("html en el texto");
  (preguntas || []).forEach(function (q, i) {
    const ops = q.opciones || [];
    if (esReactivoRelleno(q.p)) problemas.push("Q" + (i + 1) + " relleno");
    if (ops.length !== 4) problemas.push("Q" + (i + 1) + " opciones");
    if (!q.respuesta || ops.indexOf(q.respuesta) < 0) problemas.push("Q" + (i + 1) + " respuesta");
    if (ops.some(esOpcionAbsurda)) problemas.push("Q" + (i + 1) + " distractor");
  });
  return { ok: problemas.length === 0, problemas: problemas, spec: spec, palabras: pal, nPreguntas: nP };
}

function revisarLecturaDeepSeek(clave, grado, asignatura, tema, spec, textoActual) {
  const instruccion = "Eres un especialista pedagógico de la " + NOMBRE_ESCUELA + " (Fase 6 NEM).\n" +
    "Revisa y reescribe UNA lectura de comprensión para " + grado + "° de secundaria, asignatura \"" + asignatura + "\", tema / PDA: \"" + tema + "\".\n" +
    "El texto actual puede estar corto, largo, mal partido o no corresponder al tema. Debes entregar un texto NUEVO o AJUSTADO que sí trate el tema y cumpla las especificaciones.\n\n" +
    "Especificaciones:\n" +
    "- Extensión: entre " + spec.palabrasMin + " y " + spec.palabrasMax + " palabras (ideal " + spec.objetivoPalabras + ").\n" +
    "- Tipo de texto: " + spec.tipo + ".\n" +
    "- Gramática: " + spec.gramatica + ".\n" +
    "- Enfoque de las preguntas: " + spec.enfoque + ".\n" +
    "- Párrafos: entre 5 y 8, separados por \\n\\n.\n" +
    "- Preguntas: exactamente " + spec.objetivoPreguntas + ", cada una con 4 opciones plausibles de longitud similar, UNA sola correcta respaldada por el texto, y \"nivel\" (literal, inferencial o critica).\n\n" +
    "Texto actual (referencia, puedes reescribirlo):\n" + String(textoActual || "").substring(0, 3500) + "\n\n" +
    "Devuelve ÚNICAMENTE JSON: {\"texto\":\"...\",\"preguntas\":[{\"p\":\"...\",\"opciones\":[\"A\",\"B\",\"C\",\"D\"],\"respuesta\":\"opción exacta\",\"nivel\":\"literal\"}]}";
  const r = UrlFetchApp.fetch(URL_BASE_DEEPSEEK, {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + clave },
    payload: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: instruccion }],
      response_format: { type: "json_object" },
      temperature: 0.35
    }),
    muteHttpExceptions: true
  });
  if (r.getResponseCode() < 200 || r.getResponseCode() >= 300) return null;
  const j = JSON.parse(r.getContentText());
  const contenido = j.choices[0].message.content;
  let datos;
  if (typeof contenido === "string") {
    const bloque = contenido.match(/```(?:json)?\s*([\s\S]*?)```/i);
    datos = JSON.parse((bloque ? bloque[1] : contenido).trim());
  } else datos = contenido;
  if (!datos || !datos.texto || !datos.preguntas) return null;
  const preguntas = (datos.preguntas || []).map(function (pr) {
    const nrm = homogeneizarPregunta(pr);
    if (!nrm) return null;
    nrm.nivel = normalizarNivelComprension(pr.nivel || nrm.nivel);
    return nrm;
  }).filter(Boolean);
  if (!preguntas.length) return null;
  return { texto: asegurarFormatoLibro(limpiarHtmlLectura(datos.texto)), preguntas: preguntas, origen: "IA" };
}

function reconstruirHojaPreguntasDesdeJson_() {
  const libro = obtenerLibro();
  if (!libro) return;
  const p = libro.getSheetByName("Preguntas");
  if (!p) return;

  const props = PropertiesService.getScriptProperties();
  const entorno = String(props.getProperty("ENTORNO") || "").trim().toUpperCase();
  const ID_PRODUCCION = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  const idReal = typeof libro.getId === "function" ? String(libro.getId() || "").trim() : "";
  const esProd = (entorno === "PRODUCCION") || (idReal === ID_PRODUCCION);

  const lecturas = leerFilas("Lecturas");
  const matriz = [];
  lecturas.forEach(function (l) {
    const id = String(l["ID Lectura"] || "");
    let preguntas = [];
    try { preguntas = JSON.parse(l["Preguntas JSON"] || "[]"); } catch (e) { preguntas = []; }
    if (!Array.isArray(preguntas)) preguntas = [];
    preguntas.forEach(function (pr, i) {
      matriz.push(filaPreguntaParaHoja(id, i + 1, pr));
    });
  });

  const need = ENCABEZADOS.Preguntas.length;
  if (p.getMaxColumns() < need) {
    p.insertColumnsAfter(p.getMaxColumns(), need - p.getMaxColumns());
  }

  if (esProd) {
    // EN PRODUCCIÓN: Nunca ejecutar p.clearContents() destructivo.
    // Preservar preguntas existentes; actualizar por clave (ID Lectura + Num) o anexar faltantes.
    const filasExistentes = leerFilas("Preguntas") || [];
    if (matriz.length === 0 && filasExistentes.length > 0) {
      Logger.log("reconstruirHojaPreguntasDesdeJson_: En producción no se borran preguntas existentes cuando la matriz generada está vacía.");
      return;
    }
    const mapaExistentes = {};
    filasExistentes.forEach(function (f) {
      const k = String(f["ID Lectura"] || "").trim() + "_" + String(f["Num Pregunta"] || "").trim();
      if (f._fila) mapaExistentes[k] = f._fila;
    });

    matriz.forEach(function (filaNueva) {
      const k = String(filaNueva[0] || "").trim() + "_" + String(filaNueva[1] || "").trim();
      if (mapaExistentes[k]) {
        p.getRange(mapaExistentes[k], 1, 1, need).setValues([filaNueva]);
      } else {
        p.appendRow(filaNueva);
      }
    });
    p.getRange(1, 1, 1, need).setFontWeight("bold");
    return;
  }

  p.clearContents();
  p.appendRow(ENCABEZADOS.Preguntas);
  p.getRange(1, 1, 1, ENCABEZADOS.Preguntas.length).setFontWeight("bold");
  if (matriz.length) {
    p.getRange(2, 1, matriz.length, ENCABEZADOS.Preguntas.length).setValues(matriz);
  }
}

function ajustarLecturasAEspecificaciones(token) {
  exigirAdmin(token);
  asegurarSetup();
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const p = obtenerLibro().getSheetByName("Lecturas");
    const lecturas = leerFilas("Lecturas");
    const clave = obtenerClaveDeepSeek_();
    const t0 = Date.now();
    const reporte = { ok: true, revisadas: 0, cumplian: 0, actualizadas: 0, conIA: 0, detalle: [] };

    lecturas.forEach(function (l) {
      const id = String(l["ID Lectura"] || "");
      if (!id) return;
      const grado = normalizarGradoServer(l["Grado"]) || "1";
      const asig = String(l["Asignatura"] || "");
      const tema = String(l["Tema"] || "");
      const activa = String(l["Activa"] || "SI");
      let origen = String(l["Origen"] || "BANCO");
      let preguntas = preguntasDeLectura(l);
      let texto = String(l["Texto"] || "");
      reporte.revisadas++;
      const antes = auditarLecturaItem(grado, texto, preguntas);
      if (antes.ok) {
        reporte.cumplian++;
        reporte.detalle.push({ id: id, grado: grado, estado: "ok", problemas: [] });
        return;
      }

      const spec = especificacionesDeGrado(grado);
      let pack = null;
      if (clave && (Date.now() - t0) < 240000) {
        try { pack = revisarLecturaDeepSeek(clave, grado, asig, tema, spec, texto); } catch (e) { pack = null; }
      }
      if (pack) {
        reporte.conIA++;
        origen = "IA";
      } else {
        const textoAj = ajustarTextoAEspecificacion(texto, grado, asig, tema, spec);
        pack = { texto: textoAj, preguntas: seleccionarReactivosPorGrado(grado, asig), origen: origen };
      }
      pack.texto = ajustarTextoAEspecificacion(pack.texto, grado, asig, tema, spec);
      let qs = (pack.preguntas || []).map(homogeneizarPregunta).filter(Boolean);
      if (qs.length < spec.preguntasMin) {
        seleccionarReactivosPorGrado(grado, asig).forEach(function (q) {
          if (qs.length >= spec.objetivoPreguntas) return;
          if (qs.some(function (x) { return x.p === q.p; })) return;
          qs.push(q);
        });
      }
      qs = qs.slice(0, spec.objetivoPreguntas);
      const fila = [
        id, grado, asig, tema, pack.texto,
        contarPalabras(pack.texto), JSON.stringify(qs),
        activa, pack.origen || origen
      ];
      p.getRange(l._fila, 1, 1, ENCABEZADOS.Lecturas.length).setValues([fila]);
      const despues = auditarLecturaItem(grado, pack.texto, qs);
      reporte.actualizadas++;
      reporte.detalle.push({
        id: id, grado: grado, asignatura: asig, tema: tema,
        estado: despues.ok ? "actualizada" : "parcial",
        problemasAntes: antes.problemas,
        problemasDespues: despues.problemas,
        palabras: despues.palabras,
        nPreguntas: despues.nPreguntas,
        origen: pack.origen || origen
      });
    });

    reconstruirHojaPreguntasDesdeJson_();
    formatearHojasDeLectura();
    return reporte;
  } finally {
    lock.releaseLock();
  }
}

/**********************************************************************
 * RESULTADOS — NORMALIZACIÓN
 **********************************************************************/
function cacheGetResultados_() {
  const idx = cacheGetJson_("resultados_idx");
  if (!idx || !idx.keys || !idx.keys.length) return null;
  try {
    const vals = CacheService.getScriptCache().getAll(idx.keys);
    const out = [];
    for (let i = 0; i < idx.keys.length; i++) {
      const t = vals[idx.keys[i]];
      if (!t) return null;
      const part = JSON.parse(t);
      for (let j = 0; j < part.length; j++) out.push(part[j]);
    }
    return out;
  } catch (e) {
    return null;
  }
}

function cachePutResultados_(lista) {
  try {
    const c = CacheService.getScriptCache();
    const TAM = 50;
    const keys = [];
    for (let i = 0, n = 0; i < lista.length; i += TAM, n++) {
      const key = "res_p_" + n;
      c.put(key, JSON.stringify(lista.slice(i, i + TAM)), 180);
      keys.push(key);
    }
    c.put("resultados_idx", JSON.stringify({ keys: keys, n: lista.length }), 180);
  } catch (e) {}
}

function valoresHojaSinEncabezadosGordos_(p, skipNombres) {
  const lastR = p.getLastRow();
  const lastC = Math.max(p.getLastColumn(), 1);
  if (lastR < 1) return { enc: [], filas: [] };
  const enc = p.getRange(1, 1, 1, lastC).getValues()[0].map(function (h) { return String(h || "").trim(); });
  if (lastR < 2) return { enc: enc, filas: [] };
  const skip = skipNombres || {};
  const bloques = [];
  let start = 0;
  for (let i = 0; i <= enc.length; i++) {
    const gordo = i < enc.length && skip[enc[i]];
    if (gordo || i === enc.length) {
      if (i > start) bloques.push({ c1: start + 1, n: i - start, i0: start });
      start = i + 1;
    }
  }
  const nFilas = lastR - 1;
  const filas = [];
  for (let r = 0; r < nFilas; r++) {
    const row = [];
    for (let c = 0; c < enc.length; c++) row.push("");
    filas.push(row);
  }
  for (let b = 0; b < bloques.length; b++) {
    const bl = bloques[b];
    const vals = p.getRange(2, bl.c1, nFilas, bl.n).getValues();
    for (let r = 0; r < nFilas; r++) {
      for (let c = 0; c < bl.n; c++) filas[r][bl.i0 + c] = vals[r][c];
    }
  }
  return { enc: enc, filas: filas };
}

function leerResultadosDeTodasLasPestanas() {
  if (memoResultados_) return memoResultados_;
  const cacheados = cacheGetResultados_();
  if (cacheados) {
    memoResultados_ = cacheados;
    return cacheados;
  }
  const libro = obtenerLibro();
  if (!libro) return [];
  const vistos = {}, out = [];
  const skipGordos = { "Segundos por pregunta": true };
  function acumularDeHoja(p) {
    if (!p || p.getLastRow() < 2) return;
    const pack = valoresHojaSinEncabezadosGordos_(p, skipGordos);
    const enc = pack.enc;
    const filas = pack.filas;
    if (!enc.length) return;
    const nombre = p.getName();
    const parece = enc.indexOf("Marca Temporal") >= 0 || enc.indexOf("Calificación comprensión (%)") >= 0 ||
      enc.indexOf("Calificación (%)") >= 0 || enc.indexOf("Matrícula") >= 0 || enc.indexOf("Nombre Estudiante") >= 0 || enc.indexOf("Nombre") >= 0;
    if (!parece && nombre !== "Resultados") return;
    for (let i = 0; i < filas.length; i++) {
      const row = filas[i];
      const mapa = {};
      for (let c = 0; c < enc.length; c++) mapa[enc[c]] = row[c];
      const norm = normalizarResultado(mapa);
      const clave = [norm.matricula, norm.fecha, norm.intento, norm.tema, i].join("|");
      if (vistos[clave]) continue;
      if (!norm.matricula && !norm.nombre && !norm.comprension && !norm.tema) continue;
      vistos[clave] = true;
      out.push(norm);
    }
  }
  const principal = libro.getSheetByName("Resultados");
  acumularDeHoja(principal);
  if (!out.length) {
    libro.getSheets().forEach(function (p) {
      if (p.getName() === "Resultados") return;
      const nombre = p.getName();
      if (nombre.indexOf("Resultado") < 0 && nombre.indexOf("resultado") < 0) return;
      acumularDeHoja(p);
    });
  }
  memoResultados_ = out;
  cachePutResultados_(out);
  return out;
}

function normalizarResultado(r) {
  let grupo = String(valorColumna(r, ["Grupo", "Grupo/Grado"]) || "").trim().toLowerCase().replace(/\s+/g, "").replace(/°/g, "");
  let grado = String(valorColumna(r, ["Grado"]) || "").trim();
  const mixtoGrado = String(grado).toLowerCase().replace(/\s+/g, "").replace(/°/g, "").match(/^([123])([a-z])$/);
  if (mixtoGrado) {
    if (!grupo) grupo = mixtoGrado[1] + mixtoGrado[2];
    grado = mixtoGrado[1];
  }
  const mixto = grupo.match(/^([123])([a-z])$/);
  if ((!grado || grado === grupo) && mixto) { grado = mixto[1]; grupo = mixto[1] + mixto[2]; }
  if (!grado && grupo) grado = String(grupo).charAt(0);
  grado = String(grado).match(/[123]/) ? String(grado).match(/[123]/)[0] : String(grado);

  const comprension = Number(valorColumna(r, [
    "Calificación comprensión (%)", "Calificación (%)", "Calificacion", "Calificación"
  ]) || 0);
  const ppm = Number(valorColumna(r, ["PPM"]) || 0);
  const nivelPpm = String(valorColumna(r, ["Nivel PPM"]) || "");
  const global = Number(valorColumna(r, ["Calificación global (%)", "Global (%)"]) || 0);
  let mat = String(valorColumna(r, ["Matrícula", "Matricula"]) || "").trim();
  const escuela = String(valorColumna(r, ["Escuela"]) || "").trim();
  if (!mat && escuela && !/secundaria|técnica|tecnica|escuela/i.test(escuela)) mat = escuela;
  const nom = String(valorColumna(r, ["Nombre Estudiante", "Nombre Completo", "Nombre", "Estudiante"]) || "");

  return {
    fecha: formatearFechaAdmin(valorColumna(r, ["Marca Temporal", "Fecha"])),
    fechaIso: fechaIsoAdmin(valorColumna(r, ["Marca Temporal", "Fecha"])),
    matricula: mat,
    nombre: nom,
    grado: grado, grupo: grupo,
    asignatura: String(valorColumna(r, ["Asignatura"])),
    tema: String(valorColumna(r, ["Tema"])),
    idLectura: String(valorColumna(r, ["ID Lectura"]) || ""),
    tLectura: Number(valorColumna(r, ["T lectura (s)", "Tiempo Lectura (s)"]) || 0),
    tReactivos: Number(valorColumna(r, ["T reactivos (s)", "Tiempo reactivos (s)"]) || 0),
    tTotal: Number(valorColumna(r, ["T total (s)"]) || 0),
    segundosPregunta: [],
    aciertos: Number(valorColumna(r, ["Aciertos"]) || 0),
    comprension: comprension,
    ppm: ppm,
    nivelPpm: nivelPpm,
    global: global,
    intento: Number(valorColumna(r, ["Intento"]) || 1),
    pme: Number(valorColumna(r, ["PME"]) || 0),
    relecturas: Number(valorColumna(r, ["Relecturas"]) || 0),
    recomendacion: String(valorColumna(r, ["Recomendación", "Recomendacion"]) || ""),
    modo: String(valorColumna(r, ["Modo"]) || ""),
    trimestre: String(valorColumna(r, ["Trimestre"]) || ""),
    desglose: (function () {
      const raw = valorColumna(r, ["Desglose niveles"]);
      if (!raw) return null;
      if (typeof raw === "object") return raw;
      try { return JSON.parse(String(raw)); } catch (e) { return null; }
    })()
  };
}

function valorColumna(fila, claves) {
  for (let i = 0; i < claves.length; i++) {
    const v = fila[claves[i]];
    if (v !== undefined && v !== null && String(v) !== "") return v;
  }
  return "";
}

function formatearFechaAdmin(valor) {
  if (Object.prototype.toString.call(valor) === "[object Date]" && !isNaN(valor.getTime())) {
    return Utilities.formatDate(valor, Session.getScriptTimeZone() || "America/Mexico_City", "dd/MM/yyyy HH:mm");
  }
  return String(valor || "");
}

function fechaIsoAdmin(valor) {
  if (Object.prototype.toString.call(valor) === "[object Date]" && !isNaN(valor.getTime())) {
    return Utilities.formatDate(valor, Session.getScriptTimeZone() || "America/Mexico_City", "yyyy-MM-dd");
  }
  const s = String(valor || "").trim();
  const iso = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return iso[1] + "-" + ("0" + iso[2]).slice(-2) + "-" + ("0" + iso[3]).slice(-2);
  const dmy = s.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})/);
  if (dmy) {
    let p1 = parseInt(dmy[1], 10);
    let p2 = parseInt(dmy[2], 10);
    let y = dmy[3].length === 2 ? ("20" + dmy[3]) : dmy[3];
    let d = p1, m = p2;
    if (p2 > 12 && p1 <= 12) { d = p2; m = p1; }
    return y + "-" + ("0" + m).slice(-2) + "-" + ("0" + d).slice(-2);
  }
  return "";
}

/**********************************************************************
 * IMPORTAR / PLANTILLA
 **********************************************************************/
function obtenerPlantillaExcel() {
  const csv = "Matricula,Nombre Completo,Grado,Grupo\n24099,Juan Perez,1,1a\n24100,Maria Rodriguez,2,2b";
  return Utilities.base64Encode(Utilities.newBlob(csv, "text/csv", "plantilla_alumnos.csv").getBytes());
}

function importarAlumnosDesdeExcel(token, datosBase64) {
  exigirAdmin(token);
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const texto = Utilities.newBlob(Utilities.base64Decode(datosBase64)).getDataAsString("UTF-8");
    const filas = Utilities.parseCsv(texto);
    const p = obtenerLibro().getSheetByName("Alumnos");
    let agregados = 0;
    for (let i = 1; i < filas.length; i++) {
      if (!filas[i] || filas[i].length < 3) continue;
      const mat = filas[i][0], nom = filas[i][1];
      let grado = filas[i][2];
      let grupo = filas[i][3] || filas[i][2];
      grupo = String(grupo || "").trim().toLowerCase();
      grado = String(grado || grupo.charAt(0)).trim().charAt(0);
      if (!nom) continue;
      p.appendRow([mat, nom, grado, grupo, "SI", 0]);
      agregados++;
    }
    invalidarCachesDatos_();
    return { ok: true, mensaje: "Se importaron " + agregados + " alumnos." };
  } finally { lock.releaseLock(); }
}

/**********************************************************************
 * HOJAS — FORMATO
 **********************************************************************/
function formatearHojasDeLectura() {
  const libro = obtenerLibro();
  const lec = libro.getSheetByName("Lecturas");
  if (lec) {
    lec.setFrozenRows(1);
    lec.setColumnWidth(1, 170); lec.setColumnWidth(2, 70); lec.setColumnWidth(3, 180);
    lec.setColumnWidth(4, 220); lec.setColumnWidth(5, 480); lec.setColumnWidth(6, 90);
    lec.setColumnWidth(7, 200);
    if (lec.getLastRow() > 1) lec.getRange(2, 5, lec.getLastRow() - 1, 1).setWrap(true).setVerticalAlignment("top");
  }
  const pre = libro.getSheetByName("Preguntas");
  if (pre) {
    pre.setFrozenRows(1);
    pre.setColumnWidth(1, 170); pre.setColumnWidth(2, 70); pre.setColumnWidth(3, 320);
    [4,5,6,7,8,9].forEach(function (c) { pre.setColumnWidth(c, 180); });
    pre.setColumnWidth(10, 220);
    if (pre.getLastRow() > 1) pre.getRange(2, 3, pre.getLastRow() - 1, 8).setWrap(true).setVerticalAlignment("top");
  }
}

/**********************************************************************
 * BANCO LOCAL (contenido temático por asignatura)
 **********************************************************************/
function contenidoTematico(asignatura) {
  const datos = {
    "Español": {
      tema: "La bitácora del taller",
      ancla: "La bitácora sirve para registrar lo observado y comparar resultados",
      texto: "En el taller de la Secundaria Técnica 90, el grupo escribió una bitácora para no olvidar lo que iba ocurriendo. Cada equipo anotaba la fecha, lo que hizo, lo que salió bien y lo que falló.\n\nUn viernes, el equipo de María descubrió que sus apuntes del martes no coincidían con los de Luis: ella había escrito que el circuito encendió a la primera, y él, que hubo que cambiar un cable. Revisaron juntos la mesa de trabajo y encontraron el cable suelto guardado en una caja.\n\nEntonces comprendieron que la bitácora no es un adorno: sirve para comparar versiones y hallar la causa de un problema. La profesora de Español les pidió oraciones claras, con sujeto y verbo, y nexos como \"porque\" y \"entonces\".\n\nEl texto se pegó en el periódico mural. Varios lectores preguntaron cómo empezar su propia bitácora. El equipo respondió: anotar el día, describir lo que se ve y no inventar lo que no se observó.",
      relleno: [
        "En la bitácora también se dibujó el diagrama del circuito para que otro grupo pudiera repetir la práctica.",
        "Cuando un dato no coincidía, el equipo volvía a la mesa y comprobaba el cable, el interruptor y la pila.",
        "La profesora subrayó los nexos que explicaban la causa del fallo y pidió reemplazar las frases vagas.",
        "Así el reportaje del taller dejó de ser una anécdota y se volvió un texto claro, con evidencias."
      ],
      preguntas: [
        pregunta("¿Para qué escribió el grupo una bitácora?", "Para no olvidar lo que iba ocurriendo y comparar versiones", ["Para decorar el salón", "Para cancelar el taller", "Para evitar leer"]),
        pregunta("¿Qué desacuerdo hubo entre María y Luis?", "Si el circuito encendió a la primera o si hubo que cambiar un cable", ["Quién ganó el recreo", "El color del mural", "La hora de salida"]),
        pregunta("¿Qué encontraron al revisar la mesa?", "Un cable suelto guardado en una caja", ["Una planta seca", "Un balón", "Un mapa"]),
        pregunta("¿Qué pidió la profesora de Español?", "Oraciones claras y nexos como porque y entonces", ["Borrar la bitácora", "No usar verbos", "Escribir en otro idioma"]),
        pregunta("Según el equipo, ¿cómo se empieza una bitácora?", "Anotar el día, describir lo que se ve y no inventar", ["Copiar de internet", "Esperar al examen", "Solo dibujar sin fechas"]),
        pregunta("¿Dónde se publicó el texto?", "En el periódico mural", ["En un contrato", "En un recado", "En un ticket"])
      ],
      preguntasInferencia: [
        pregunta("¿Qué se infiere del desacuerdo entre María y Luis?", "Sin registro escrito es más difícil hallar la causa de un fallo", ["Los cables no existen", "El taller debe cerrar", "Español no se relaciona con el taller"]),
        pregunta("¿Por qué la bitácora no es un adorno?", "Porque permite comparar versiones y encontrar problemas", ["Porque es de color", "Porque se cuelga", "Porque no se lee"])
      ],
      preguntasCritica: [
        pregunta("¿Qué postura sostiene el relato sobre escribir en el taller?", "Registrar con precisión es parte del trabajo técnico y de la lengua", ["Escribir estorba al técnico", "Solo importa el resultado final", "Las versiones distintas no importan"])
      ]
    },
    "Historia": {
      tema: "La independencia en el barrio",
      ancla: "La independencia no ocurrió en un solo día y también se recuerda en el barrio",
      texto: "Doña Carmen contaba a sus nietos cómo, en 1810, el pueblo se reunió al escuchar las campanas. No era una fiesta: era un llamado a organizarse. Mientras preparaban atole, ella explicaba que la independencia no ocurrió en un solo día. Hubo años de marchas, cartas y acuerdos.\n\nUn grabado en la sala mostraba personas con antorchas. Los niños preguntaron si todos estaban de acuerdo. Doña Carmen dijo que no: algunas familias tenían miedo y otras esperaban cambios.\n\nLes pidió buscar en la colonia una placa o un nombre de calle de esa época. Al día siguiente encontraron la calle Morelos y tomaron una foto. En clase armaron una línea del tiempo con cinco fechas. Así entendieron que la historia también está en el barrio, no solo en el libro.",
      relleno: [
        "Cada fecha de la línea del tiempo se acompañó con un dibujo y una oración que decía qué cambió.",
        "Un alumno investigó por qué tantas calles llevan nombres de personajes de la independencia.",
        "Doña Carmen insistió en que el miedo de algunas familias también forma parte del relato histórico.",
        "El grupo concluyó que recordar el pasado ayuda a explicar el nombre del lugar donde viven."
      ],
      preguntas: [
        pregunta("¿Qué convocó al pueblo en 1810, según el relato?", "Las campanas", ["Un tren", "Un radio", "Un globo"]),
        pregunta("Según Doña Carmen, la independencia...", "No ocurrió en un solo día", ["Duró una tarde", "Fue una fiesta escolar", "Empezó en 2010"]),
        pregunta("¿Todos estaban de acuerdo en esa época?", "No: algunas familias tenían miedo y otras esperaban cambios", ["Sí, todos igual", "Nadie escuchó", "Solo los niños"]),
        pregunta("¿Qué encontraron en su colonia?", "La calle Morelos", ["Un aeropuerto", "Un río nuevo", "Una fábrica de globos"]),
        pregunta("¿Qué armaron en clase?", "Una línea del tiempo con cinco fechas", ["Un huerto", "Un puente", "Un examen de inglés"]),
        pregunta("¿Dónde está también la historia, según el texto?", "En el barrio, no solo en el libro", ["Solo en otro país", "Solo en el recreo", "En el futuro"])
      ],
      preguntasInferencia: [
        pregunta("¿Qué se infiere de buscar una calle con nombre histórico?", "El pasado se conserva en la vida cotidiana del lugar", ["Las calles no tienen nombre", "La independencia no existió", "Solo importa el atole"]),
        pregunta("¿Por qué Doña Carmen menciona el miedo de algunas familias?", "Para mostrar que el proceso histórico no fue unánime", ["Para asustar a los nietos", "Para cancelar la clase", "Para hablar del clima"])
      ],
      preguntasCritica: [
        pregunta("¿Qué idea crítica plantea el texto sobre enseñar historia?", "Hay que relacionar fechas y personajes con el espacio donde vive el alumno", ["Memorizar nombres basta", "El barrio no cuenta", "Las campanas no importan"])
      ]
    },
    "Ciencias": {
      tema: "El ciclo del agua en la ciudad",
      ancla: "El ciclo del agua se interrumpe en la ciudad si las coladeras se tapan",
      texto: "El agua es un recurso vital. En la naturaleza se encuentra en ríos, lagos, mares y como vapor. El ciclo comienza cuando el sol calienta océanos y ríos: el agua se evapora, sube, se enfría y forma nubes. Luego cae como lluvia, nieve o granizo.\n\nEn una ciudad, ese ciclo se interrumpe si las coladeras se tapan. Sofía midió cuántos minutos tardaba el agua en bajar después de un aguacero y fotografió residuos en las rejillas. Su reporte explicó que la basura y las hojas secas impiden el drenaje.\n\nPropuso jornadas de limpieza y una campaña para no tirar residuos. El comité vecinal aceptó. En la siguiente temporada, el agua ya no cubrió las banquetas. El caso muestra que un fenómeno natural se vuelve un problema social cuando el entorno urbano no se cuida.",
      relleno: [
        "Sofía comparó dos calles: una con coladeras libres y otra con hojas acumuladas, y el tiempo de desagüe fue distinto.",
        "El vapor que sube no desaparece: se condensa y regresa, pero en la ciudad el pavimento cambia por dónde corre el agua.",
        "La campaña pidió no arrojar bolsas ni envases a la calle, porque terminan en las rejillas.",
        "Comprender el ciclo del agua, entonces, también implica observar la banqueta de la colonia."
      ],
      preguntas: [
        pregunta("¿Qué provoca la evaporación en el ciclo del agua?", "El sol calienta océanos y ríos", ["La basura en las coladeras", "El viento de la noche", "Las banquetas"]),
        pregunta("¿Qué problema investigó Sofía?", "Que el agua no bajaba porque las coladeras estaban tapadas", ["El corte de luz", "La falta de transporte", "El ruido del taller"]),
        pregunta("¿Qué impide el drenaje, según su reporte?", "La basura y las hojas secas", ["Las nubes", "El sol", "Los ríos lejanos"]),
        pregunta("¿Qué solución propuso Sofía?", "Jornadas de limpieza y no tirar residuos", ["Construir un puente", "Cerrar la calle", "Sembrar menos árboles"]),
        pregunta("¿Qué ocurrió en la siguiente temporada de lluvias?", "El agua ya no cubrió las banquetas", ["Se secó el mar", "Dejó de existir el vapor", "Se inundó la escuela para siempre"]),
        pregunta("¿Dónde se interrumpe el ciclo en el relato?", "En las coladeras tapadas de la ciudad", ["En el fondo del océano", "En la atmósfera superior", "En los polos"])
      ],
      preguntasInferencia: [
        pregunta("¿Qué se infiere del caso de Sofía?", "Un fenómeno natural se agrava si no se cuida el entorno urbano", ["El sol ya no calienta", "Las nubes son artificiales", "Sofía cerró el drenaje"]),
        pregunta("¿Por qué midió los minutos que tardaba el agua en bajar?", "Para obtener un dato que sustentara su reporte", ["Para ganar un concurso de relojes", "Para apagar el sol", "Para cambiar el clima"])
      ],
      preguntasCritica: [
        pregunta("¿Qué postura sostiene el texto?", "Cuidar coladeras es parte de comprender y aplicar el ciclo del agua", ["El ciclo del agua no existe en la ciudad", "Solo importa memorizar evaporación", "La basura no afecta el drenaje"])
      ]
    },
    "Formación Cívica y Ética": {
      tema: "Normas y acuerdos escolares",
      ancla: "Una regla escolar debe apoyarse en el reglamento y en el diálogo, no solo en una opinión",
      texto: "En el periódico mural apareció una columna que pedía prohibir el celular en todos los espacios, incluido el recreo. Un alumno respondió que la medida protege la convivencia, pero otro escribió que también limita el contacto urgente con la familia.\n\nLa directora publicó un comunicado: cualquier regla debe apoyarse en el reglamento escolar y en un diálogo, no solo en una opinión. Se leyeron fragmentos del reglamento y se distinguieron hechos, juicios y propuestas.\n\nQuienes estaban a favor usaron ejemplos de distracción en clase. Quienes estaban en contra pidieron zonas y horarios, no una prohibición total. El acuerdo fue un ensayo de dos semanas con áreas libres de celular y una encuesta. Argumentar, en este caso, no fue gritar más, sino ofrecer razones y probar la idea.",
      relleno: [
        "La encuesta preguntó en qué espacios el celular servía para avisar a casa y en cuáles distraía.",
        "Un hecho era el uso del aparato en clase; un juicio era decir que 'siempre estorba'; una propuesta era delimitar zonas.",
        "El reglamento se usó como base, no como pretexto para callar a quienes pensaban distinto.",
        "Al cabo de dos semanas, el consejo revisaría los datos antes de convertir el ensayo en norma."
      ],
      preguntas: [
        pregunta("¿Qué pedía la columna del mural?", "Prohibir el celular en todos los espacios", ["Comprar más celulares", "Cerrar el recreo", "Eliminar el reglamento"]),
        pregunta("¿Qué advirtió la directora?", "Que una regla debe apoyarse en el reglamento y el diálogo", ["Que no hay debate", "Que el mural se cierra", "Que el celular es obligatorio"]),
        pregunta("¿Qué distinguieron al leer el reglamento?", "Hechos, juicios y propuestas", ["Solo chistes", "Solo calificaciones", "Nombres de maestros"]),
        pregunta("¿Qué pidieron quienes rechazaban la prohibición total?", "Zonas y horarios, no una veda absoluta", ["Expulsar alumnos", "Quitar el mural", "Ignorar a las familias"]),
        pregunta("¿Cuál fue el acuerdo?", "Un ensayo de dos semanas y una encuesta", ["Prohibir el recreo", "Borrar el reglamento", "Cancelar clases"]),
        pregunta("¿Qué riesgo se mencionó al prohibir el celular?", "Limitar el contacto urgente con la familia", ["Romper el huerto", "Apagar el sol", "Perder el mapa"])
      ],
      preguntasInferencia: [
        pregunta("¿Por qué el debate es un ejercicio cívico?", "Porque se discuten reglas con razones, datos y pruebas", ["Porque hay un mural bonito", "Porque es recreo", "Porque no hay reglamento"]),
        pregunta("¿Qué se infiere del ensayo de dos semanas?", "Antes de imponer una norma conviene probarla y medir efectos", ["Las normas no se pueden cambiar", "La encuesta no sirve", "La directora no debe opinar"])
      ],
      preguntasCritica: [
        pregunta("¿Qué idea crítica plantea el texto?", "Argumentar es ofrecer razones y someter la idea a una prueba, no imponerse", ["Gana quien grita más", "El reglamento sobra", "Las opiniones no se discuten"])
      ]
    },
    "Tecnología": {
      tema: "Ahorrar energía en el aula",
      ancla: "El ahorro de energía depende de la tecnología y también de cambiar hábitos",
      texto: "Un equipo de la Secundaria Técnica 90 diseñó un prototipo para ahorrar energía. Instalaron sensores de luz y un letrero que recordaba apagar ventiladores al salir. Durante un mes compararon el aula piloto con un salón tradicional. Los datos mostraron una reducción del 18 por ciento.\n\nAl presentarlo al consejo técnico, argumentaron que el ahorro no depende solo de la tecnología, sino de cambiar hábitos. Alguien objetó que el costo de los sensores no se recupera. El equipo respondió con una tabla de consumo y el tiempo estimado de retorno.\n\nLa escuela aceptó extender el prototipo a tres edificios, con la condición de medir cada bimestre.",
      relleno: [
        "El letrero no apagaba los ventiladores por sí solo: alguien debía formar el hábito de revisar al salir.",
        "La tabla mostró en qué horas el aula piloto consumía menos que el salón testigo.",
        "Medir cada bimestre permite ver si el 18 por ciento se sostiene o fue casualidad de un mes.",
        "El prototipo combina un dispositivo y una regla de uso; faltando uno de los dos, el ahorro baja."
      ],
      preguntas: [
        pregunta("¿Qué resultado obtuvo el aula piloto?", "Se redujo el consumo 18 por ciento", ["Aumentó el calor", "Se descompusieron los ventiladores", "Nadie apagó luces"]),
        pregunta("Según el equipo, ¿de qué depende también el ahorro?", "De cambiar hábitos", ["De comprar más sensores", "De alargar el receso", "De cerrar la escuela"]),
        pregunta("¿Qué objeción recibió el proyecto?", "Que el costo de los sensores no se recupera", ["Que no hay electricidad", "Que faltan pupitres", "Que el letrero es ilegal"]),
        pregunta("¿Cómo respondió el equipo a esa crítica?", "Con una tabla de consumo y el tiempo de retorno", ["Cerrando el aula", "Borrando los datos", "Cancelando el prototipo"]),
        pregunta("¿Qué condición puso la escuela?", "Medir resultados cada bimestre", ["Quitar los ventiladores", "No usar letreros", "Trabajar de noche"]),
        pregunta("¿A cuántos edificios se extendería el prototipo?", "A tres edificios más", ["A ninguno", "A veinte estados", "Solo al patio"])
      ],
      preguntasInferencia: [
        pregunta("¿Por qué no basta instalar sensores?", "Porque el ahorro también depende de los hábitos de uso", ["Porque la luz no existe", "Porque el consejo no lee", "Porque el 18 por ciento es imposible"]),
        pregunta("¿Qué se evalúa al exigir medición bimestral?", "Si el ahorro se sostiene con datos", ["El color del letrero", "La hora del recreo", "La matrícula nueva"])
      ],
      preguntasCritica: [
        pregunta("¿Qué tipo de texto ilustra el caso y qué postura toma?", "Argumentativo: hay tesis, evidencias y respuesta a una crítica", ["Una receta de cocina", "Una adivinanza", "Un chiste del recreo"])
      ]
    },
    "Matemáticas": {
      tema: "Medir y comparar datos del patio",
      ancla: "Medir, organizar en tabla y comparar permite tomar una decisión con datos",
      texto: "El grupo de matemáticas midió el patio en el recreo. Contaron cuántos alumnos jugaban fútbol, cuántos se sentaban y cuántos caminaban. Hicieron el recuento tres días seguidos, a la misma hora, para no comparar momentos distintos.\n\nOrganizaron los números en una tabla y calcularon el promedio de cada actividad. El fútbol reunió más personas el martes, pero el promedio de los tres días mostró que sentarse también era frecuente.\n\nCon esos datos propusieron pintar más bancas en la sombra, no solo otra portería. Un compañero objetó que tres días eran pocos. El equipo aceptó la crítica y acordó medir una semana completa antes de llevar la propuesta a dirección.",
      relleno: [
        "El promedio evitó que una sola tarde de partido se tomara como la verdad de todo el recreo.",
        "La tabla tenía filas por día y columnas por actividad, para sumar y comparar con claridad.",
        "Medir a la misma hora redujo el error de mezclar el inicio del recreo con el final.",
        "La decisión de las bancas nació de un número, no de un gusto personal del equipo."
      ],
      preguntas: [
        pregunta("¿Qué midió el grupo en el patio?", "Cuántos alumnos jugaban fútbol, se sentaban o caminaban", ["La temperatura del sol", "Las calificaciones", "El número de salones"]),
        pregunta("¿Por qué midieron tres días a la misma hora?", "Para no comparar momentos distintos", ["Porque el recreo cambió de horario", "Para evitar matemáticas", "Porque llovía siempre"]),
        pregunta("¿Qué calcularon después de armar la tabla?", "El promedio de cada actividad", ["El área del país", "La raíz de un árbol", "El precio del balón"]),
        pregunta("¿Qué propusieron con los datos?", "Pintar más bancas en la sombra, no solo otra portería", ["Cerrar el patio", "Quitar el recreo", "Prohibir el fútbol"]),
        pregunta("¿Qué crítica hizo un compañero?", "Que tres días eran pocos", ["Que la tabla era de otro grado", "Que no hubo recreo", "Que no saben sumar"]),
        pregunta("¿Qué acordó el equipo ante esa crítica?", "Medir una semana completa antes de ir a dirección", ["Borrar la tabla", "Inventar los números", "Dejar de contar"])
      ],
      preguntasInferencia: [
        pregunta("¿Para qué sirvió el promedio en este caso?", "Para no dejarse llevar por un solo día atípico", ["Para decorar la tabla", "Para evitar medir", "Para ganar el partido"]),
        pregunta("¿Qué se infiere de aceptar que tres días eran pocos?", "Una muestra más grande hace más confiable la propuesta", ["Los datos no importan", "Las bancas no se usan", "El fútbol no existe"])
      ],
      preguntasCritica: [
        pregunta("¿Qué idea sostiene el texto sobre decidir en la escuela?", "Las decisiones del patio deben apoyarse en mediciones y no solo en gustos", ["Basta con opinar fuerte", "Las matemáticas no aplican al recreo", "Una portería resuelve cualquier dato"])
      ]
    }
  };
  const asigStr = String(asignatura || "").trim();
  if (datos[asigStr]) return datos[asigStr];
  if (/Ciencias|Biología|Física|Química/i.test(asigStr)) return datos["Ciencias"];
  if (/Geografía/i.test(asigStr)) return datos["Ciencias"];
  if (/Tecnología/i.test(asigStr)) return datos["Tecnología"];
  if (/Matemáticas/i.test(asigStr)) return datos["Matemáticas"];
  if (/Formación|Cívica|Ética/i.test(asigStr)) return datos["Formación Cívica y Ética"];
  if (/Historia/i.test(asigStr)) return datos["Historia"];
  return datos["Español"];
}

function parrafosContinuacion(grado, asignatura, tema) {
  // Devuelve párrafos adicionales por asignatura para alcanzar el mínimo de palabras.
  const escenas = {
    "Español": [
      "El lunes siguiente, María numeró las páginas de la bitácora y dejó un margen para correcciones. Luis anotó la hora exacta de cada prueba del circuito. Así, cuando volvieran a discutir, tendrían un orden claro y no solo recuerdos sueltos del recreo.",
      "En la segunda práctica cambiaron la pila y el interruptor. El foco encendió, pero parpadeó. En la bitácora escribieron: «Enciende, aunque inestable». Esa frase, más tarde, les evitó decir que todo había salido bien cuando no era cierto.",
      "Un equipo vecino copió el formato: fecha, materiales, lo observado y una duda. La profesora felicitó el modelo porque cualquier lector podía repetir la experiencia sin preguntar a gritos qué había pasado el martes.",
      "En la clase de Español revisaron adjetivos vagos. Cambiaron «raro» por «el cable estaba fuera de la terminal». La precisión volvió útil el texto para el taller y ya no parecía un recado apurado."
    ],
    "Historia": [
      "Doña Carmen sacó una caja de recortes: copias de bandos, un calendario viejo y la foto de una placa en la esquina. No eran adornos. Servían para mostrar que 1810 no cabe en un solo grito ni en una sola fecha de libro.",
      "Los nietos marcaron en un mapa del barrio la calle Morelos, la plaza y la iglesia donde aún tocan las campanas. Así el relato dejó de ser una anécdota de cocina y se volvió un recorrido que podían hacer a pie.",
      "En clase, cada equipo eligió un personaje y buscó qué hizo en distintos años, no solo el nombre. La línea del tiempo creció con marchas, cartas y acuerdos, exactamente como había dicho Doña Carmen.",
      "Un alumno preguntó por qué algunas familias tenían miedo. La docente pidió no inventar: el miedo también es un hecho histórico cuando hay testimonios, y no se borra para que la historia se vea más heroica."
    ],
    "Ciencias": [
      "Sofía explicó el ciclo con un esquema en cuatro flechas: evaporación, condensación, precipitación y escurrimiento. En el pizarrón el ciclo se veía cerrado; en la calle, la última flecha se detenía en la coladera tapada.",
      "Midiendo después de dos aguaceros, anotó 14 minutos en una calle limpia y más de 40 en la que tenía hojas y bolsas. El número no era un adorno: permitía comparar y no quedarse en la impresión de que «siempre se inunda igual».",
      "Fotografió tres rejillas. En una se veía pasto seco; en otra, envases; en la tercera, casi nada. El reporte puso las fotos junto a los tiempos de desagüe para que el comité no discutiera solo con opiniones.",
      "En Ciencias repasaron que el vapor no desaparece: se condensa y regresa. El pavimento, sin embargo, cambia por dónde corre el agua cuando cae. Por eso el ciclo natural y el problema urbano hay que pensarlos juntos."
    ],
    "Formación Cívica y Ética": [
      "El comunicado de la directora se leyó en voz alta. No prohibía el debate: pedía que cada postura citara el reglamento o un hecho observable. Así el mural dejó de ser un muro de gritos y se volvió un expediente breve.",
      "Quienes estaban a favor de la veda total trajeron tres casos de distracción en clase. Eran hechos. Decir que el celular «siempre estorba» ya era un juicio, y el grupo aprendió a marcar la diferencia en el margen.",
      "Quienes pedían zonas y horarios contaron que, en el recreo, algunos avisan a casa si sale tarde el transporte. Ese uso no ocurría durante la clase. La propuesta, entonces, no negaba el problema: lo delimitaba.",
      "La encuesta preguntó en qué espacios el aparato servía para avisar a la familia y en cuáles distraía. No pedía un sí o un no absoluto. Los resultados se pegaron junto al reglamento, no en lugar de él."
    ],
    "Tecnología": [
      "Los sensores no apagaban los ventiladores por sí solos: avisaban cuando el aula quedaba vacía. El letrero recordaba el último paso. Si alguien ignoraba ambos, el consumo volvía a subir. Por eso el equipo insistió en el hábito, no solo en el aparato.",
      "La tabla de consumo se armó hora por hora. El aula piloto gastaba menos sobre todo al final de la mañana, cuando el salón testigo solía dejar luces y ventiladores encendidos durante el receso. Ese detalle explicó el 18 por ciento.",
      "Alguien en el consejo preguntó si el mes de prueba había sido más fresco. El equipo trajo la temperatura promedio de ambos salones: era similar. Así evitaron que el ahorro se atribuyera al clima y no al prototipo.",
      "Calcularon el tiempo de retorno con el costo de los sensores y el ahorro mensual. No prometieron milagros: mostraron en cuántos bimestres se recuperaba la inversión si el 18 por ciento se sostenía."
    ],
    "Matemáticas": [
      "El primer día el fútbol llenó media cancha y parecía «la verdad» del recreo. El segundo día lloviznaba y muchos se sentaron. El promedio de los tres días evitó que una sola tarde mandara en la decisión de las bancas.",
      "La tabla tenía filas por día y columnas por actividad: fútbol, sentados y caminando. Sumar en vertical y horizontal permitió comprobar que no se habían perdido alumnos en el recuento.",
      "Medir a la misma hora redujo el error de mezclar el inicio del recreo, cuando se arma el partido, con los últimos minutos, cuando ya hay filas para entrar. El grupo anotó el reloj en cada hoja.",
      "Un compañero pidió porcentajes además del promedio. Calcularon qué parte del patio hacía cada actividad. El fútbol seguía alto el martes, pero el porcentaje de quienes se sentaban justificaba más sombra, no solo otra portería."
    ]
  };
  const asigStr = String(asignatura || "").trim();
  if (escenas[asigStr]) return escenas[asigStr];
  if (/Ciencias|Biología|Física|Química/i.test(asigStr)) return escenas["Ciencias"];
  if (/Geografía/i.test(asigStr)) return escenas["Ciencias"];
  if (/Tecnología/i.test(asigStr)) return escenas["Tecnología"];
  if (/Matemáticas/i.test(asigStr)) return escenas["Matemáticas"];
  if (/Formación|Cívica|Ética/i.test(asigStr)) return escenas["Formación Cívica y Ética"];
  if (/Historia/i.test(asigStr)) return escenas["Historia"];
  return escenas["Español"];
}

function gruposRespaldo() {
  const l = [];
  ["1","2","3"].forEach(function (g) {
    ["a","b","c","d","e"].forEach(function (x) { l.push({ grado: g, grupo: g + x, activo: "SI", extra: 0, turno: "matutino" }); });
  });
  return l;
}

/**********************************************************************
 * DATOS SIMULADOS PARA PROBAR GRÁFICAS
 **********************************************************************/
function hashEntero_(texto) {
  let h = 0;
  String(texto || "").split("").forEach(function (ch) {
    h = ((h << 5) - h) + ch.charCodeAt(0);
    h |= 0;
  });
  return Math.abs(h);
}

function lecturasPorGradoSim_(lecturas, grado) {
  const g = String(grado || "1");
  const catalogo = {
    "1": [
      { id: "SIM_1_P1", asignatura: "Español", tema: "Prueba 1 · La bitácora del taller", palabras: 500, nPreguntas: 6 },
      { id: "SIM_1_P2", asignatura: "Ciencias", tema: "Prueba 2 · El ahorro de energía", palabras: 520, nPreguntas: 6 },
      { id: "SIM_1_P3", asignatura: "Historia", tema: "Prueba 3 · La independencia en el pueblo", palabras: 480, nPreguntas: 6 },
      { id: "SIM_1_P4", asignatura: "Español", tema: "Prueba 4 · El periódico mural", palabras: 510, nPreguntas: 6 },
      { id: "SIM_1_P5", asignatura: "Formación Cívica y Ética", tema: "Prueba 5 · Acuerdos en el aula", palabras: 490, nPreguntas: 6 }
    ],
    "2": [
      { id: "SIM_2_P1", asignatura: "Español", tema: "Prueba 1 · Reportaje del laboratorio", palabras: 700, nPreguntas: 8 },
      { id: "SIM_2_P2", asignatura: "Ciencias", tema: "Prueba 2 · Cambio climático local", palabras: 720, nPreguntas: 8 },
      { id: "SIM_2_P3", asignatura: "Formación Cívica y Ética", tema: "Prueba 3 · Acuerdos en el aula", palabras: 680, nPreguntas: 8 },
      { id: "SIM_2_P4", asignatura: "Historia", tema: "Prueba 4 · Fuentes históricas escolares", palabras: 710, nPreguntas: 8 },
      { id: "SIM_2_P5", asignatura: "Tecnología", tema: "Prueba 5 · Prototipo del aula", palabras: 690, nPreguntas: 8 }
    ],
    "3": [
      { id: "SIM_3_P1", asignatura: "Español", tema: "Prueba 1 · Columna de opinión escolar", palabras: 850, nPreguntas: 11 },
      { id: "SIM_3_P2", asignatura: "Tecnología", tema: "Prueba 2 · Prototipo para ahorrar energía", palabras: 880, nPreguntas: 11 },
      { id: "SIM_3_P3", asignatura: "Matemáticas", tema: "Prueba 3 · Datos que cuentan una historia", palabras: 820, nPreguntas: 11 },
      { id: "SIM_3_P4", asignatura: "Historia", tema: "Prueba 4 · Argumentos sobre el pasado", palabras: 860, nPreguntas: 11 },
      { id: "SIM_3_P5", asignatura: "Ciencias", tema: "Prueba 5 · Experimentos y evidencia", palabras: 840, nPreguntas: 11 }
    ]
  };
  return catalogo[g] || catalogo["1"];
}

function ponerValorEnc_(fila, enc, nombres, valor) {
  const normNombres = nombres.map(function(n) {
    return String(n || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  });
  for (let k = 0; k < enc.length; k++) {
    const encNorm = String(enc[k] || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
    if (normNombres.indexOf(encNorm) >= 0) {
      fila[k] = valor;
    }
  }
}

function cargarResultadosSimulados(token) {
  if (arguments.length > 0) exigirAdmin(token);
  const libro = obtenerLibro();
  if (!libro) throw new Error("No se pudo abrir la hoja de cálculo.");

  let p = libro.getSheetByName("Resultados") || obtenerPestana("resultados");
  if (!p) {
    p = libro.insertSheet("Resultados");
    p.appendRow(ENCABEZADOS.Resultados);
    p.getRange(1, 1, 1, ENCABEZADOS.Resultados.length).setFontWeight("bold");
  }

  const alumnos = leerAlumnosResumen().filter(function (a) {
    return String(a.activo || "SI").toUpperCase() !== "NO" && (a.nombre || a.matricula);
  });
  if (!alumnos.length) throw new Error("No hay alumnos en la hoja para simular resultados.");

  let lecturas = [];
  try { lecturas = leerLecturasResumen() || []; } catch (eLec) { lecturas = []; }

  if (p.getLastRow() < 1) {
    p.appendRow(ENCABEZADOS.Resultados);
    p.getRange(1, 1, 1, ENCABEZADOS.Resultados.length).setFontWeight("bold");
  }

  let enc = p.getRange(1, 1, 1, Math.max(p.getLastColumn(), 1)).getValues()[0]
    .map(function (h) { return String(h || "").trim(); });

  let cambiosEnc = false;
  ENCABEZADOS.Resultados.forEach(function (h) {
    if (enc.indexOf(h) < 0) {
      enc.push(h);
      cambiosEnc = true;
    }
  });
  if (cambiosEnc) {
    p.getRange(1, 1, 1, enc.length).setValues([enc]);
    p.getRange(1, 1, 1, enc.length).setFontWeight("bold");
  }

  const idxId = enc.indexOf("ID Lectura");
  const idxSeg = enc.indexOf("Segundos por pregunta");
  const last = p.getLastRow();
  const conservadas = [];
  if (last >= 2) {
    const valores = p.getRange(2, 1, last - 1, enc.length).getValues();
    for (let i = 0; i < valores.length; i++) {
      const id = idxId >= 0 ? String(valores[i][idxId] || "") : "";
      const seg = idxSeg >= 0 ? String(valores[i][idxSeg] || "") : "";
      if (id.indexOf("SIM_") === 0 || seg.indexOf("SIMULADO") >= 0) continue;
      conservadas.push(valores[i]);
    }
    p.getRange(2, 1, last - 1, enc.length).clearContent();
  }

  const fechas = [
    new Date(2026, 4, 12, 9, 15),
    new Date(2026, 5, 16, 10, 5),
    new Date(2026, 6, 21, 11, 20),
    new Date(2026, 7, 25, 9, 40),
    new Date(2026, 8, 16, 10, 50)
  ];
  const curvaComp = [
    [0, 6, 12, 18, 26],
    [0, 3, 5, 8, 28],
    [0, 14, 6, 20, 12],
    [18, 20, 19, 22, 21],
    [10, 4, 0, 6, 22]
  ];
  const curvaPpm = [
    [0, 3, 6, 9, 13],
    [0, 2, 3, 5, 16],
    [0, 8, 2, 11, 5],
    [8, 9, 8, 10, 9],
    [6, 1, -2, 3, 12]
  ];

  const filas = [];
  alumnos.forEach(function (a) {
    const grado = normalizarGradoServer(a.grado) || normalizarGradoServer(a.grupo) || "1";
    const grupo = String(a.grupo || (grado + "a")).toLowerCase();
    const spec = especificacionesDeGrado(grado);
    const lects = lecturasPorGradoSim_(lecturas, grado);
    const hAlu = hashEntero_(String(a.matricula) + "|" + String(a.nombre));
    const hGpo = hashEntero_(grupo);
    const sesgoGrupo = (hGpo % 17) - 8;
    const perfil = hAlu % 5;
    const baseComp = 42 + (hAlu % 22) + sesgoGrupo;
    const basePpm = Number(spec.ppmObjetivo) + ((hAlu % 17) - 8) + Math.round(sesgoGrupo * 0.5);

    for (let t = 0; t < 5; t++) {
      const lec = lects[t % lects.length];
      const nPreg = Math.max(2, Number(lec.nPreguntas || spec.objetivoPreguntas || 6));
      const palabras = Math.max(120, Number(lec.palabras || spec.objetivoPalabras || 500));
      const compBruta = Math.max(18, Math.min(98, baseComp + curvaComp[perfil][t] + ((hAlu >> t) % 4) - 1));
      const aciertos = Math.max(1, Math.min(nPreg, Math.round((compBruta / 100) * nPreg)));
      const comprension = Math.round((aciertos / nPreg) * 1000) / 10;
      const ppm = Math.round(Math.max(80, basePpm + curvaPpm[perfil][t] + ((hAlu >> (t + 2)) % 5) - 2) * 10) / 10;
      const tLectura = Math.max(25, Math.round((palabras / ppm) * 60));
      const tReactivos = 35 + (hAlu % 55) + t * 3;
      const nivel = calcularNivelPpm(ppm, spec);
      const velNorm = Math.min(100, Math.round((ppm / (Number(spec.ppmObjetivo) || 1)) * 1000) / 10);
      const global = Math.round((PESO_COMPRENSION * comprension + PESO_VELOCIDAD * velNorm) * 10) / 10;
      const idLec = String(lec.id || ("SIM_" + grado + "_P" + (t + 1)));
      const idFinal = idLec.indexOf("SIM_") === 0 ? idLec : ("SIM_" + idLec);

      const fila = enc.map(function () { return ""; });
      ponerValorEnc_(fila, enc, ["Marca Temporal", "Fecha"], fechas[t]);
      ponerValorEnc_(fila, enc, ["Escuela"], nombreEscuela_());
      ponerValorEnc_(fila, enc, ["Nombre Estudiante", "Nombre Completo", "Nombre", "Alumno", "Estudiante"], String(a.nombre || ""));
      ponerValorEnc_(fila, enc, ["Grado"], grado);
      ponerValorEnc_(fila, enc, ["Grupo", "Grupo/Grado"], grupo);
      ponerValorEnc_(fila, enc, ["Género", "Genero"], "");
      ponerValorEnc_(fila, enc, ["Matrícula", "Matricula"], String(a.matricula || ""));
      ponerValorEnc_(fila, enc, ["Asignatura"], String(lec.asignatura || "Español"));
      ponerValorEnc_(fila, enc, ["Tema"], String(lec.tema || ("Prueba " + (t + 1))));
      ponerValorEnc_(fila, enc, ["ID Lectura"], idFinal);
      ponerValorEnc_(fila, enc, ["Tiempo Lectura (s)", "Tiempo Lectura", "T lectura (s)", "T lectura"], tLectura);
      ponerValorEnc_(fila, enc, ["Tiempo Reactivos (s)", "Tiempo reactivos (s)", "Tiempo Reactivos", "T reactivos (s)", "T reactivos"], tReactivos);
      ponerValorEnc_(fila, enc, ["Tiempo Total (s)", "Tiempo total (s)", "Tiempo Total", "T total (s)", "T total"], tLectura + tReactivos);
      ponerValorEnc_(fila, enc, ["Segundos por pregunta"], JSON.stringify(["SIMULADO"]));
      ponerValorEnc_(fila, enc, ["Aciertos"], aciertos);
      ponerValorEnc_(fila, enc, ["Calificación comprensión (%)", "Calificación (%)", "Calificacion", "Calificación"], comprension);
      ponerValorEnc_(fila, enc, ["PPM"], ppm);
      ponerValorEnc_(fila, enc, ["Nivel PPM"], nivel);
      ponerValorEnc_(fila, enc, ["Calificación global (%)", "Global (%)"], global);
      ponerValorEnc_(fila, enc, ["Intento"], t + 1);
      filas.push(fila);
    }
  });

  const salida = conservadas.concat(filas);
  if (salida.length) {
    p.getRange(2, 1, salida.length, enc.length).setValues(salida);
  }
  SpreadsheetApp.flush();
  return {
    ok: true,
    hoja: libro.getName(),
    pestana: p.getName(),
    url: libro.getUrl(),
    alumnos: alumnos.length,
    filasNuevas: filas.length,
    mensaje: "Se agregaron " + filas.length + " filas (5 pruebas por alumno) en la pestaña " + p.getName() + "."
  };
}