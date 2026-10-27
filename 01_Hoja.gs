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

function _obtenerLibro_() {
  const props = PropertiesService.getScriptProperties();
  let entorno = String(props.getProperty("ENTORNO") || "").trim().toUpperCase();
  let idConfig = String(props.getProperty("HOJA_ID") || "").trim();
  ultimoErrorAperturaLibro = "";

  const ID_PRODUCCION = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";

  // AUTO-INICIALIZACIÓN DE CONTINGENCIA SI NO SE CONFIGURARON SCRIPT PROPERTIES
  if (!entorno && !idConfig) {
    try {
      props.setProperty("ENTORNO", "PRODUCCION");
      props.setProperty("HOJA_ID", ID_PRODUCCION);
      entorno = "PRODUCCION";
      idConfig = ID_PRODUCCION;
    } catch (eProp) {
      entorno = "PRODUCCION";
      idConfig = ID_PRODUCCION;
    }
  } else if (!entorno && idConfig) {
    entorno = (idConfig === ID_PRODUCCION) ? "PRODUCCION" : "PRUEBAS";
    try { props.setProperty("ENTORNO", entorno); } catch (e) {}
  } else if (entorno === "PRODUCCION" && !idConfig) {
    idConfig = ID_PRODUCCION;
    try { props.setProperty("HOJA_ID", idConfig); } catch (e) {}
  }

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

function _obtenerPestana_(nombre) {
  const libro = _obtenerLibro_();
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
