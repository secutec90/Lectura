/**********************************************************************
 * SETUP (con caché corto)
 **********************************************************************/
function _asegurarSetup_() {
  const cache = CacheService.getScriptCache();
  if (cache.get("setup_ok") === "1") return { ok: true, cached: true };

  const libro = _obtenerLibro_();
  if (!libro) return { ok: false, error: "Libro no accesible" };

  const faltantes = [];
  Object.keys(ENCABEZADOS).forEach(function (nombre) {
    if (!libro.getSheetByName(nombre)) {
      faltantes.push(nombre);
    }
  });

  if (faltantes.length > 0) {
    Logger.log("_asegurarSetup_: pestañas faltantes en el libro: " + faltantes.join(", "));
    return { ok: false, faltantes: faltantes };
  }

  cache.put("setup_ok", "1", 21600);
  return { ok: true };
}

function _verificarYCrearPestanas_() {
  const libro = _obtenerLibro_();
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
  _migrarAlumnosSiEsAntiguo_();
  _repararResultadosSiEsNecesario_();
  asegurarConfig();
  asegurarColumnaIntentosGrupo();
  asegurarColumnaTurnoGrupo();
  asegurarColumnaNivelPreguntas();
  asegurarColumnaObservacionAsi_();
  asegurarColumnaUsuarioPrefectos_();
  asegurarColumnaClavePrefectos_();
  asegurarColumnaClaveAccesoClase_();
  if (creo) _formatearHojasDeLectura_();
}

function migrarLecturasSiEsAntiguo() {
  const libro = _obtenerLibro_();
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
    const filas = _leerFilas_("Lecturas");
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

function _migrarAlumnosSiEsAntiguo_() {
  const libro = _obtenerLibro_();
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

function _repararResultadosSiEsNecesario_() {
  return _unificarEstructuraResultados_();
}

function _unificarEstructuraResultados_() {
  const libro = _obtenerLibro_();
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
  return _unificarEstructuraResultados_();
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
    const lecs = _leerFilas_("Lecturas");
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
  const libro = _obtenerLibro_();
  if (!libro) return;
  const p = libro.getSheetByName("Config");
  if (!p) return;
  if (p.getLastRow() < 2) {
    p.getRange(2, 1, 2, 2).setValues([
      ["INTENTOS_DEFAULT", "1"],
      ["ASIGNATURAS", ASIGNATURAS_DEFAULT.join("|")]
    ]);
  }
  if (!_leerConfig_("PPM_OBJETIVO", "")) {
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
  if (!_leerConfig_("LECTURAS_TRIMESTRALES", "")) {
    escribirConfig_("LECTURAS_TRIMESTRALES", JSON.stringify(cfgTrimestralPorDefecto_()));
  }
  const sitioAlumno = String(_leerConfig_("URL_SITIO_ALUMNO", "") || "").replace(/\?.*$/, "").replace(/\/+$/, "");
  const sitioDocente = String(_leerConfig_("URL_SITIO_DOCENTE", "") || "").replace(/\?.*$/, "").replace(/\/+$/, "");
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
  return sanitizarUrlSitio_(_leerConfig_("URL_SITIO_ALUMNO", ""), URL_SITIO_ALUMNO_DEFAULT);
}

function urlSitioDocente_() {
  return sanitizarUrlSitio_(_leerConfig_("URL_SITIO_DOCENTE", ""), URL_SITIO_DOCENTE_DEFAULT);
}

function nombreEscuela_() {
  const n = String(_leerConfig_("IDENTIDAD_NOMBRE", "") || "").trim();
  return n || NOMBRE_ESCUELA;
}

function pieLectura_() {
  const p = String(_leerConfig_("IDENTIDAD_PIE", "") || "").trim();
  return p || "Plan de Estudio NEM";
}

function logoEscuela_() {
  const l = String(_leerConfig_("IDENTIDAD_LOGO", "") || "").trim();
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
  const libro = _obtenerLibro_();
  if (!libro) return;
  const p = libro.getSheetByName("Grupos");
  if (!p) return;
  if (p.getLastColumn() < 4) {
    p.getRange(1, 4).setValue("Intentos extra").setFontWeight("bold");
  }
}

function asegurarColumnaTurnoGrupo() {
  const libro = _obtenerLibro_();
  if (!libro) return;
  const p = libro.getSheetByName("Grupos");
  if (!p) return;
  const lastCol = Math.max(p.getLastColumn(), 1);
  const enc = p.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) { return String(h || "").trim(); });
  if (enc.indexOf("Turno") >= 0) return;
  p.getRange(1, enc.length + 1).setValue("Turno").setFontWeight("bold");
}

function asegurarColumnaNivelPreguntas() {
  const libro = _obtenerLibro_();
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
  const libro = _obtenerLibro_();
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

function _leerConfig_(clave, respaldo) {
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
  const libro = _obtenerLibro_();
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
