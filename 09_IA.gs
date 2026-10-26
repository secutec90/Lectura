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

function historialAlumnoParaReporte(matricula, tokenExcluir) {
  let propios = [];
  try {
    const todos = leerResultadosDeTodasLasPestanas() || [];
    propios = todos.filter(function (r) {
      if (String(r.matricula || "").trim().toLowerCase() !== String(matricula || "").trim().toLowerCase()) {
        return false;
      }
      if (tokenExcluir && String(r.tokenExamen || r["Token Examen"] || "").trim() === String(tokenExcluir).trim()) {
        return false;
      }
      return true;
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
