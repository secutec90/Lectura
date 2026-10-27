/**********************************************************************
 * DIRECTORIO DE ENCUESTAS
 *
 * Registra en qué hoja de cálculo vive la encuesta (con asignatura, grado y
 * trimestre) para poder listarlas después, leer sus resultados y generar un
 * resumen con IA que se inserta en la planeación didáctica.
 *
 * El directorio vive en el libro principal de Lectura; las respuestas viven
 * en la hoja que cada encuesta tenga vinculada.
 **********************************************************************/

const HOJA_DIRECTORIO_ENCUESTAS = "DirectorioEncuestas";
const ENCABEZADOS_DIRECTORIO_ENCUESTAS = [
  "Id", "Nombre", "Asignatura", "Grado", "Trimestre", "Grupo",
  "HojaId", "HojaNombre", "Preguntas", "Respuestas",
  "Creado", "Actualizado", "ResumenIA", "ResumenFecha"
];

function _hojaDirectorioEncuestas_() {
  const libro = _obtenerLibro_();
  if (!libro) return null;
  let hoja = libro.getSheetByName(HOJA_DIRECTORIO_ENCUESTAS);
  if (!hoja) {
    hoja = libro.insertSheet(HOJA_DIRECTORIO_ENCUESTAS);
    hoja.appendRow(ENCABEZADOS_DIRECTORIO_ENCUESTAS);
    hoja.getRange(1, 1, 1, ENCABEZADOS_DIRECTORIO_ENCUESTAS.length).setFontWeight("bold");
    hoja.setFrozenRows(1);
  }
  return hoja;
}

function _leerDirectorioEncuestas_() {
  const hoja = _hojaDirectorioEncuestas_();
  if (!hoja || hoja.getLastRow() < 2) return [];
  const vals = hoja.getRange(2, 1, hoja.getLastRow() - 1, ENCABEZADOS_DIRECTORIO_ENCUESTAS.length).getValues();
  return vals.map(function (f, i) {
    const o = { _fila: i + 2 };
    ENCABEZADOS_DIRECTORIO_ENCUESTAS.forEach(function (h, j) { o[h] = f[j]; });
    return o;
  });
}

/**
 * Alta o actualización de una encuesta en el directorio. Se identifica por
 * HojaId: si ya existe, se actualizan nombre, metadatos y conteos; si no, se
 * añade. Nunca sobrescribe el resumen de IA ya guardado.
 */
function _registrarDirectorioEncuesta_(info) {
  try {
    const hoja = _hojaDirectorioEncuestas_();
    if (!hoja) return { ok: false };
    const datos = info || {};
    const hojaId = String(datos.hojaId || "").trim();
    if (!hojaId) return { ok: false };

    const existentes = _leerDirectorioEncuestas_();
    const previo = existentes.filter(function (r) { return String(r["HojaId"] || "").trim() === hojaId; })[0];
    const ahora = new Date();
    const fila = [
      previo ? previo["Id"] : ("ENC-" + Utilities.getUuid().slice(0, 8).toUpperCase()),
      String(datos.nombre || (previo && previo["Nombre"]) || "Encuesta").trim(),
      String(datos.asignatura || (previo && previo["Asignatura"]) || "").trim(),
      String(datos.grado || (previo && previo["Grado"]) || "").trim(),
      String(datos.trimestre || (previo && previo["Trimestre"]) || "").trim(),
      String(datos.grupo || (previo && previo["Grupo"]) || "").trim(),
      hojaId,
      String(datos.hojaNombre || (previo && previo["HojaNombre"]) || "").trim(),
      Number(datos.preguntas || (previo && previo["Preguntas"]) || 0),
      Number(datos.respuestas || (previo && previo["Respuestas"]) || 0),
      previo ? previo["Creado"] : ahora,
      ahora,
      previo ? (previo["ResumenIA"] || "") : "",
      previo ? (previo["ResumenFecha"] || "") : ""
    ];

    if (previo) hoja.getRange(previo._fila, 1, 1, fila.length).setValues([fila]);
    else hoja.appendRow(fila);
    return { ok: true, id: fila[0] };
  } catch (e) {
    console.error("_registrarDirectorioEncuesta_: " + (e && e.message ? e.message : e));
    return { ok: false };
  }
}

/** Campos de metadatos que la encuesta puede declarar en su hoja Configuracion. */
function _metadatosDeEncuesta_(libro) {
  const salida = { asignatura: "", grado: "", trimestre: "", grupo: "", nombre: "" };
  try {
    const hoja = libro.getSheetByName("Configuracion");
    if (hoja && hoja.getLastRow() >= 2) {
      const vals = hoja.getRange(2, 1, hoja.getLastRow() - 1, 2).getValues();
      const mapa = {};
      vals.forEach(function (f) { mapa[String(f[0] || "").trim().toLowerCase()] = String(f[1] || "").trim(); });
      salida.asignatura = mapa["asignatura"] || "";
      salida.grado = mapa["grado"] || "";
      salida.trimestre = mapa["trimestre"] || "";
      salida.grupo = mapa["grupo"] || "";
      salida.nombre = mapa["titulo"] || "";
    }
    if (!salida.nombre && hoja && hoja.getLastRow() >= 2) {
      const vals = hoja.getRange(2, 1, hoja.getLastRow() - 1, 2).getValues();
      vals.forEach(function (f) { if (String(f[0] || "").trim().toLowerCase() === "titulo") salida.nombre = String(f[1] || "").trim(); });
    }
  } catch (e) {}
  return salida;
}

/** Cuenta preguntas activas y respuestas de una encuesta, leyendo su hoja. */
function _conteosDeEncuesta_(libro) {
  let preguntas = 0;
  let respuestas = 0;
  try {
    const f = libro.getSheetByName("Formulario");
    if (f && f.getLastRow() >= 2) {
      const vals = f.getRange(2, 1, f.getLastRow() - 1, 11).getValues();
      preguntas = vals.filter(function (r) {
        const activa = String(r[8] == null ? "TRUE" : r[8]).toUpperCase();
        return String(r[0] || "").trim() && activa !== "FALSE";
      }).length;
    }
  } catch (e) {}
  try {
    const r = libro.getSheetByName("Respuestas");
    if (r) respuestas = Math.max(0, r.getLastRow() - 1);
  } catch (e) {}
  return { preguntas: preguntas, respuestas: respuestas };
}

/** Lista el directorio. Solo administración. */
function listarDirectorioEncuestas(token) {
  exigirClaseRol_(token, ["admin", "maestro"]);
  const filas = _leerDirectorioEncuestas_();
  const items = filas.map(function (r) {
    return {
      id: String(r["Id"] || ""),
      nombre: String(r["Nombre"] || "Encuesta"),
      asignatura: String(r["Asignatura"] || ""),
      grado: String(r["Grado"] || ""),
      trimestre: String(r["Trimestre"] || ""),
      grupo: String(r["Grupo"] || ""),
      hojaId: String(r["HojaId"] || ""),
      hojaNombre: String(r["HojaNombre"] || ""),
      preguntas: Number(r["Preguntas"]) || 0,
      respuestas: Number(r["Respuestas"]) || 0,
      actualizado: r["Actualizado"] ? String(r["Actualizado"]) : "",
      resumen: String(r["ResumenIA"] || ""),
      resumenFecha: r["ResumenFecha"] ? String(r["ResumenFecha"]) : ""
    };
  }).sort(function (a, b) { return String(b.actualizado).localeCompare(String(a.actualizado)); });
  return { ok: true, items: items };
}

/**
 * Lee el formulario y las respuestas de la hoja vinculada y devuelve un
 * agregado: cuántas veces aparece cada opción en cada pregunta.
 */
function _agregadoDeEncuesta_(hojaId) {
  const libro = _abrirLibroPorId_(hojaId);
  if (!libro) throw new Error("No se pudo abrir la hoja de la encuesta.");
  const hojaForm = libro.getSheetByName("Formulario");
  const hojaResp = libro.getSheetByName("Respuestas");
  if (!hojaResp || hojaResp.getLastRow() < 2) {
    return { total: 0, preguntas: [], nombre: libro.getName() };
  }

  const preguntas = [];
  if (hojaForm && hojaForm.getLastRow() >= 2) {
    const vals = hojaForm.getRange(2, 1, hojaForm.getLastRow() - 1, 11).getValues();
    vals.forEach(function (r) {
      const id = String(r[0] || "").trim();
      if (!id) return;
      const activa = String(r[8] == null ? "TRUE" : r[8]).toUpperCase();
      if (activa === "FALSE") return;
      preguntas.push({
        id: id,
        etiqueta: String(r[2] || id),
        tipo: String(r[1] || ""),
        columna: Number(r[9]) || 0
      });
    });
  }

  const resp = hojaResp.getDataRange().getValues();
  const total = Math.max(0, resp.length - 1);
  const conteos = {};
  preguntas.forEach(function (p) { conteos[p.id] = {}; });
  for (let i = 1; i < resp.length; i++) {
    preguntas.forEach(function (p) {
      if (!p.columna) return;
      const v = String(resp[i][p.columna - 1] == null ? "" : resp[i][p.columna - 1]).trim();
      if (!v) return;
      conteos[p.id][v] = (conteos[p.id][v] || 0) + 1;
    });
  }

  const resumenPreguntas = preguntas.map(function (p) {
    const pares = Object.keys(conteos[p.id]).map(function (k) { return { valor: k, n: conteos[p.id][k] }; })
      .sort(function (a, b) { return b.n - a.n; })
      .slice(0, 12);
    return { id: p.id, etiqueta: p.etiqueta, tipo: p.tipo, total: pares.reduce(function (a, x) { return a + x.n; }, 0), opciones: pares };
  });

  return { total: total, preguntas: resumenPreguntas, nombre: libro.getName() };
}

/** Actualiza asignatura, grado, trimestre y grupo de una encuesta del directorio. */
function guardarMetadatosDirectorioEncuesta(token, hojaId, datos) {
  exigirClaseRol_(token, ["admin", "maestro"]);
  const id = String(hojaId || "").trim();
  const info = datos || {};
  const hoja = _hojaDirectorioEncuestas_();
  if (!hoja) return { ok: false, mensaje: "No se pudo abrir el directorio." };
  const fila = _leerDirectorioEncuestas_().filter(function (r) { return String(r["HojaId"] || "").trim() === id; })[0];
  if (!fila) return { ok: false, mensaje: "Esa encuesta no está en el directorio." };
  const cols = ["Asignatura", "Grado", "Trimestre", "Grupo"];
  const valores = ["asignatura", "grado", "trimestre", "grupo"];
  cols.forEach(function (col, i) {
    if (Object.prototype.hasOwnProperty.call(info, valores[i])) {
      const c = ENCABEZADOS_DIRECTORIO_ENCUESTAS.indexOf(col) + 1;
      hoja.getRange(fila._fila, c).setValue(String(info[valores[i]] || "").trim());
    }
  });
  const cAct = ENCABEZADOS_DIRECTORIO_ENCUESTAS.indexOf("Actualizado") + 1;
  hoja.getRange(fila._fila, cAct).setValue(new Date());
  return { ok: true };
}

/** Devuelve el resumen de IA ya guardado para una encuesta. */
function obtenerResumenEncuesta(token, hojaId) {
  exigirClaseRol_(token, ["admin", "maestro"]);
  const id = String(hojaId || "").trim();
  const fila = _leerDirectorioEncuestas_().filter(function (r) { return String(r["HojaId"] || "").trim() === id; })[0];
  if (!fila) return { ok: false, mensaje: "Esa encuesta no está en el directorio." };
  return {
    ok: true,
    resumen: String(fila["ResumenIA"] || ""),
    fecha: fila["ResumenFecha"] ? String(fila["ResumenFecha"]) : ""
  };
}

/**
 * Genera con IA un reporte de lo más significativo de una encuesta y lo guarda
 * en el directorio. Requiere la clave de DeepSeek configurada.
 */
function generarResumenEncuestaIA(token, hojaId) {
  exigirClaseRol_(token, ["admin", "maestro"]);
  const id = String(hojaId || "").trim();
  if (!id) return { ok: false, mensaje: "Falta la encuesta." };

  const clave = obtenerClaveDeepSeek_();
  if (!clave) return { ok: false, mensaje: "Configura la clave de DeepSeek en Configuración antes de generar el resumen." };

  let agregado;
  try {
    agregado = _agregadoDeEncuesta_(id);
  } catch (e) {
    return { ok: false, mensaje: "No se pudo abrir la hoja de esa encuesta: " + (e && e.message ? e.message : e) };
  }
  if (!agregado.total) return { ok: false, mensaje: "Esa encuesta todavía no tiene respuestas." };

  const fila = _leerDirectorioEncuestas_().filter(function (r) { return String(r["HojaId"] || "").trim() === id; })[0] || {};
  const lineas = agregado.preguntas.map(function (p) {
    const ops = p.opciones.map(function (o) { return o.valor + " (" + o.n + ")"; }).join("; ");
    return "- " + p.etiqueta + ": " + ops;
  }).join("\n");

  const instruccion =
    "Eres asesor pedagógico de una secundaria técnica en México (NEM, Fase 6).\n" +
    "Analiza los resultados agregados de una encuesta escolar y redacta un REPORTE BREVE en español de México.\n" +
    "Estructura exacta, sin markdown ni viñetas con asteriscos:\n" +
    "1) Hallazgos principales (máximo 4, con la cifra que los respalda).\n" +
    "2) Grupos o perfiles con mayor necesidad (si los datos lo permiten).\n" +
    "3) Tres recomendaciones concretas para el diagnóstico del Consejo Técnico y la planeación didáctica.\n" +
    "No inventes datos que no estén en el agregado. Máximo 220 palabras.\n\n" +
    "Encuesta: " + String(fila["Nombre"] || agregado.nombre || "Encuesta") + "\n" +
    "Asignatura: " + String(fila["Asignatura"] || "no especificada") + "\n" +
    "Grado: " + String(fila["Grado"] || "no especificado") + "\n" +
    "Trimestre: " + String(fila["Trimestre"] || "no especificado") + "\n" +
    "Respuestas totales: " + agregado.total + "\n\n" +
    "Agregado por pregunta:\n" + lineas;

  let texto = "";
  try {
    const r = UrlFetchApp.fetch(URL_BASE_DEEPSEEK, {
      method: "post",
      contentType: "application/json",
      headers: { Authorization: "Bearer " + clave },
      payload: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "Redactas reportes escolares breves y verificables. No inventas cifras." },
          { role: "user", content: instruccion }
        ],
        temperature: 0.3,
        max_tokens: 900
      }),
      muteHttpExceptions: true
    });
    if (r.getResponseCode() < 200 || r.getResponseCode() >= 300) {
      return { ok: false, mensaje: "La IA respondió con error HTTP " + r.getResponseCode() + "." };
    }
    const j = JSON.parse(r.getContentText());
    texto = String(((j.choices || [])[0] || {}).message ? j.choices[0].message.content : "").trim();
  } catch (e) {
    return { ok: false, mensaje: "No se pudo contactar a la IA: " + (e && e.message ? e.message : e) };
  }
  if (!texto) return { ok: false, mensaje: "La IA no devolvió texto." };

  // Guardar en el directorio
  try {
    const hoja = _hojaDirectorioEncuestas_();
    const filaDir = _leerDirectorioEncuestas_().filter(function (r) { return String(r["HojaId"] || "").trim() === id; })[0];
    if (hoja && filaDir) {
      const colResumen = ENCABEZADOS_DIRECTORIO_ENCUESTAS.indexOf("ResumenIA") + 1;
      const colFecha = ENCABEZADOS_DIRECTORIO_ENCUESTAS.indexOf("ResumenFecha") + 1;
      const colResp = ENCABEZADOS_DIRECTORIO_ENCUESTAS.indexOf("Respuestas") + 1;
      hoja.getRange(filaDir._fila, colResumen).setValue(texto);
      hoja.getRange(filaDir._fila, colFecha).setValue(new Date());
      hoja.getRange(filaDir._fila, colResp).setValue(agregado.total);
    }
  } catch (e) {
    console.error("guardar resumen IA: " + (e && e.message ? e.message : e));
  }

  return { ok: true, resumen: texto, total: agregado.total };
}
