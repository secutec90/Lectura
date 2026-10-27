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
  const deHoja = _leerFilas_("Preguntas")
    .filter(function (p) { return String(p["ID Lectura"]) === String(id); })
    .sort(function (a, b) { return Number(a["Orden"] || 0) - Number(b["Orden"] || 0); })
    .map(preguntaDesdeFilaHoja).filter(Boolean);
  return fusionarNivelesDesdeJson_(deHoja, fila && fila["Preguntas JSON"]);
}

function mapaPreguntasPorId() {
  const p = _obtenerLibro_().getSheetByName("Preguntas");
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
  const p = _obtenerLibro_().getSheetByName("Preguntas");
  if (!p) return;
  const filas = _leerFilas_("Preguntas");
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
  const libro = _obtenerLibro_();
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
  const libro = _obtenerLibro_();
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
  const alumno = _buscarAlumno_(matricula);
  if (!alumno) return { ok: false, mensaje: "No se encontró al alumno." };
  const activo = String(alumno["Activo"]).toUpperCase() !== "NO";
  if (!opts.incluirInactivos && !activo) return { ok: false, mensaje: "Este alumno no está activo." };

  const nombre = String(alumno["Nombre Completo"]);
  const grado = String(alumno["Grado"]);
  const extra = Number(alumno["Intentos extra"] || 0);
  const permitidos = intentosPermitidosDe(alumno);
  const todos = _leerResultadosDeTodasLasPestanas_() || [];
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
