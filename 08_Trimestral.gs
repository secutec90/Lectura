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
  const raw = _leerConfig_("LECTURAS_TRIMESTRALES", "");
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
  const todos = resultados || _leerResultadosDeTodasLasPestanas_() || [];
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
  const todos = resultados || _leerResultadosDeTodasLasPestanas_() || [];
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

function _obtenerLecturasTrimestrales_(token) {
  exigirAdmin(token);
  const cfg = leerCfgTrimestral_();
  const todos = _leerResultadosDeTodasLasPestanas_() || [];
  const intentosRegistrados = { "1": 0, "2": 0, "3": 0 };
  todos.forEach(function (r) {
    ["1", "2", "3"].forEach(function (t) {
      if (esResultadoTrimestralDe_(r, cfg, t)) intentosRegistrados[t]++;
    });
  });
  return { ok: true, config: cfg, vigente: trimestreVigente_(cfg), intentosRegistrados: intentosRegistrados };
}

function resumenCalendarioTrimestral(token) {
  return _obtenerLecturasTrimestrales_(token);
}

function limpiarIntentosTrimestrales(token, trimestre) {
  exigirAdmin(token);
  const t = String(trimestre || "");
  if (t !== "1" && t !== "2" && t !== "3") throw new Error("Elige un trimestre.");
  const cfg = leerCfgTrimestral_();
  const ids = {};
  idsLecturasTrimestre_(cfg, t).forEach(function (id) { ids[id] = true; });
  const libro = _obtenerLibro_();
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
  _asegurarSetup_();
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const catalogo = catalogoMuestraTrimestral_();
    const p = _obtenerLibro_().getSheetByName("Lecturas");
    if (!p) throw new Error("No se encontró la hoja de Lecturas.");
    const idsYa = {};
    _leerFilas_("Lecturas").forEach(function (l) {
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
    _formatearHojasDeLectura_();
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
  const a = _filaAlumnoPorMatricula_(matricula);
  if (!a) throw new Error("No existe ese alumno.");
  const kAlu = String(a["Grado"] || "") + String(a["Grupo"] || "").toUpperCase();

  if (rol === "docente") {
    const gruposDocente = {};
    const maestroId = String(ses.maestroId || "");
    const nombreDoc = String(ses.nombre || "").toLowerCase();
    try {
      _leerFilas_("Horarios").forEach(function (h) {
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
      _leerFilas_("PrefectoGrupos").forEach(function (f) {
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
      _leerFilas_("ApoyoGrupos").forEach(function (f) {
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
      const aFila = _filaAlumnoPorMatricula_(mat);
      if (!aFila) throw new Error("No existe ese alumno.");
      const kAlu = String(aFila["Grado"] || "") + String(aFila["Grupo"] || "").toUpperCase();
      const gruposDocente = {};
      const maestroId = String(ses.maestroId || "");
      const nombreDoc = String(ses.nombre || "").toLowerCase();
      try {
        _leerFilas_("Horarios").forEach(function (h) {
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

  const alumno = _buscarAlumno_(mat);
  if (!alumno) return { ok: false, mensaje: "No se encontró al alumno." };
  if (String(alumno["Activo"]).toUpperCase() === "NO") return { ok: false, mensaje: "Este alumno no está activo." };
  const todos = _leerResultadosDeTodasLasPestanas_() || [];
  const cfgT = leerCfgTrimestral_();
  const MODALIDADES_VALIDAS = ["sorteo", "trimestral"];
  if (modo === undefined || modo === null || String(modo).trim() === "") {
    throw new Error("Modalidad de evaluación no especificada o vacía. Debe ser 'sorteo' o 'trimestral'.");
  }
  const modoNorm = String(modo).trim().toLowerCase();
  if (MODALIDADES_VALIDAS.indexOf(modoNorm) < 0) {
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
    : _sortearLectura_(String(alumno["Grado"]), String(alumno["Matrícula"]), todos);
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
    tokenSesion: String(tokenSesion || "").trim(),
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

function _sortearLectura_(grado, matricula, resultadosYaLeidos) {
  const activas = lecturasActivasDeGrado_(grado);
  if (!activas.length) return { ok: false, mensaje: "No hay lecturas para este grado." };

  let pool = activas;
  let excluidas = 0;
  if (matricula) {
    const todos = resultadosYaLeidos || _leerResultadosDeTodasLasPestanas_() || [];
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
