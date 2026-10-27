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

function _leerResultadosDeTodasLasPestanas_() {
  if (memoResultados_) return memoResultados_;
  const cacheados = cacheGetResultados_();
  if (cacheados) {
    memoResultados_ = cacheados;
    return cacheados;
  }
  const libro = _obtenerLibro_();
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
    tokenExamen: String(valorColumna(r, ["Token Examen", "Token", "Id Examen", "Clave Idempotencia"]) || ""),
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
    const p = _obtenerLibro_().getSheetByName("Alumnos");
    let agregados = 0;
    for (let i = 1; i < filas.length; i++) {
      if (!filas[i] || filas[i].length < 3) continue;
      const mat = filas[i][0], nom = filas[i][1];
      let grado = filas[i][2];
      let grupo = filas[i][3] || filas[i][2];
      grupo = String(grupo || "").trim().toLowerCase();
      grado = String(grado || grupo.charAt(0)).trim().charAt(0);
      if (!nom) continue;
      p.appendRow([celdaSegura_(mat), celdaSegura_(nom), celdaSegura_(grado), celdaSegura_(grupo), "SI", 0]);
      agregados++;
    }
    invalidarCachesDatos_();
    return { ok: true, mensaje: "Se importaron " + agregados + " alumnos." };
  } finally { lock.releaseLock(); }
}

/**********************************************************************
 * HOJAS — FORMATO
 **********************************************************************/
function _formatearHojasDeLectura_() {
  const libro = _obtenerLibro_();
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
