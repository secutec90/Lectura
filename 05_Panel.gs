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
    libro = _obtenerLibro_();
  } catch (e) {
    errorApertura = String(e.message || e);
  }
  if (!errorApertura && ultimoErrorAperturaLibro) {
    errorApertura = ultimoErrorAperturaLibro;
  }

  try { alumnos = enriquecerAlumnosConAcceso_(_leerAlumnosResumen_() || []); } catch (eAlu) {
    errorApertura = errorApertura || ("Alumnos: " + eAlu.message);
  }
  try { grupos = _leerGruposDesdeLibro_(libro, alumnos); } catch (eG) {
    grupos = gruposRespaldo();
  }
  try { lecturas = _leerLecturasResumen_() || []; } catch (eL) {}

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
      _leerFilas_("PrefectoGrupos").forEach(function (f) {
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
        _leerFilas_("ApoyoGrupos").forEach(function (f) {
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

  const urlLibro = _urlHojaCalculo_();

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
      intentos: _leerConfig_("INTENTOS_DEFAULT", "1"),
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
  const libro = _obtenerLibro_();
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

function _leerGruposDesdeLibro_(libro, alumnos) {
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

function _extraerAlumnosDePestana_(p) {
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
    _leerFilas_("AccesoClaseAlumnos").forEach(function (f) {
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

function _leerAlumnosResumen_() {
  if (memoAlumnos_) return memoAlumnos_;
  const cacheados = cacheGetJson_("alumnos_resumen");
  if (cacheados && cacheados.length) {
    memoAlumnos_ = cacheados;
    return cacheados;
  }

  const libro = _obtenerLibro_();
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
    const alusAlumnos = _extraerAlumnosDePestana_(pestanaAlumnos);
    if (alusAlumnos.length) {
      alumnos = alumnos.concat(alusAlumnos);
    }
  }

  // 2. Solo escanear otras pestañas si la hoja Alumnos no trajo registros
  if (!alumnos.length) {
    libro.getSheets().forEach(function (h) {
      const nomNorm = h.getName().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
      if (["config", "lecturas", "preguntas", "resultados", "resumen", "lecturas_prev", "alumnos", "grupos", "prefectos", "prefectogrupos", "horarios", "asistenciaalumnos", "asistenciamaestros"].indexOf(nomNorm) >= 0) return;
      const extraidos = _extraerAlumnosDePestana_(h);
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

function _leerGruposResumen_() {
  const grupos = leerGruposHoja_().slice();

  // Si hay alumnos, asegurarse de que todos sus grupos aparezcan en la lista
  const alumnos = _leerAlumnosResumen_();
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

function _leerLecturasResumen_() {
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

function _inspeccionarNivelesPreguntas_() {
  const lecturas = _leerFilas_("Lecturas");
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
  const hoja = _leerFilas_("Preguntas");
  let hojaCon = 0, hojaSin = 0, enc = [];
  try {
    const p = _obtenerLibro_().getSheetByName("Preguntas");
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
  return _inspeccionarNivelesPreguntas_();
}

function _detalleLecturas_(token) {
  exigirAdmin(token);
  _asegurarSetup_();
  const filas = _leerFilas_("Lecturas");
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
  const resultados = _leerResultadosDeTodasLasPestanas_();
  return { ok: true, resultados: resultados };
}

function listaLecturasAdmin(token) {
  exigirAdmin(token);
  return { ok: true, lecturas: _leerLecturasResumen_() };
}

function valoresHoja_(p, maxCols) {
  if (!p) return [];
  const lastR = p.getLastRow();
  if (lastR < 1) return [];
  const lastC = Math.max(p.getLastColumn(), 1);
  const cols = maxCols ? Math.min(lastC, maxCols) : lastC;
  return p.getRange(1, 1, lastR, cols).getValues();
}

function _leerFilas_(nombre) {
  const libro = _obtenerLibro_();
  if (!libro) return [];
  let p = libro.getSheetByName(nombre);
  if (!p) {
    const sheets = libro.getSheets();
    const nomNorm = String(nombre || "").toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    for (let s = 0; s < sheets.length; s++) {
      const shName = sheets[s].getName().toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (shName === nomNorm ||
          (nomNorm === "horarios" && (shName === "horario" || shName === "horarios")) ||
          (nomNorm === "horario" && (shName === "horario" || shName === "horarios")) ||
          (nomNorm === "grupos" && (shName === "grupo" || shName === "grupos")) ||
          (nomNorm === "alumnos" && (shName === "alumno" || shName === "alumnos"))) {
        p = sheets[s];
        break;
      }
    }
  }
  if (!p || p.getLastRow() < 2) return [];
  const valores = valoresHoja_(p);
  if (valores.length < 2) return [];
  const enc = valores[0];
  const out = [];
  for (let i = 1; i < valores.length; i++) {
    const fila = {};
    enc.forEach(function (h, c) {
      const col = String(h || "").trim();
      fila[col] = valores[i][c];
      const kSimple = col.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (typeof fila[kSimple] === "undefined") fila[kSimple] = valores[i][c];
    });
    fila._fila = i + 1;
    out.push(fila);
  }
  return out;
}
