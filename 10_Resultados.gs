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
  _asegurarSetup_();
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
          try {
            cache.put("examen_consumido_" + tokenRecibido, JSON.stringify({ estado: "guardado", resultado: persistido }), 7200);
          } catch (eC) {}
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
      const trimIntento = String(intentoValido.trimestre || "").trim();
      if (trimNumEnviado && trimNumEnviado !== trimIntento) {
        throw new Error("Conflicto de examen: no se puede asociar un trimestre ajeno a una evaluación ordinaria de sorteo.");
      }
    }

    // 6. Validar existencia y estado del alumno
    const alumno = _buscarAlumno_(mat);
    if (!alumno) throw new Error("Alumno no encontrado.");
    if (String(alumno["Activo"] || "SI").toUpperCase() === "NO") throw new Error("Este alumno no está activo.");

    // 7. Validar número de intento y cupo disponible ANTES de consumir el token
    const todosRes = (_leerResultadosDeTodasLasPestanas_() || []).filter(function (r) {
      const rTok = String(r.tokenExamen || r["Token Examen"] || "").trim();
      return !rTok || rTok !== tokenRecibido;
    });
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
    const historial = _historialAlumnoParaReporte_(mat, tokenRecibido);
    let deltaGlobal = null;
    if (historial.n && historial.promedioGlobal != null) {
      deltaGlobal = Math.round((calc.global - historial.promedioGlobal) * 10) / 10;
    }

    const libro = _obtenerLibro_();
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
      const normH = function(h) {
        return String(h || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
      };
      const idxMat = enc.map(normH).indexOf("matricula");
      const idxLec = enc.map(normH).indexOf("idlectura");
      const idxInt = enc.map(normH).indexOf("intento");
      const idxMod = enc.map(normH).indexOf("modo");
      const idxTrim = enc.map(normH).indexOf("trimestre");
      const idxToken = enc.map(normH).indexOf("tokenexamen");

      const coincidenciasPaso9 = [];
      for (let r = todosVals.length - 1; r >= 0; r--) {
        const row = todosVals[r];
        const rowToken = idxToken >= 0 ? String(row[idxToken] || "").trim() : "";
        const rowMat = idxMat >= 0 ? String(row[idxMat] || "").trim().toLowerCase() : "";
        const rowLec = idxLec >= 0 ? String(row[idxLec] || "").trim() : "";
        const rowInt = idxInt >= 0 ? Number(row[idxInt] || 0) : 0;
        const rowMod = idxMod >= 0 ? String(row[idxMod] || "").trim().toLowerCase() : "";
        const rowTrim = idxTrim >= 0 ? String(row[idxTrim] || "").trim() : "";

        const coincideToken = (
          rowToken &&
          rowToken === tokenRecibido &&
          rowMat === mat.toLowerCase() &&
          rowLec === idLecturaEnviada
        );
        const coincideTupla = (
          !rowToken &&
          idxMat >= 0 &&
          idxLec >= 0 &&
          idxInt >= 0 &&
          idxMod >= 0 &&
          rowMat === mat.toLowerCase() &&
          rowLec === idLecturaEnviada &&
          rowInt === intento &&
          rowMod === (esTrimestral ? "trimestral" : "sorteo") &&
          (esTrimestral ? (idxTrim >= 0 && rowTrim === tUse && tUse !== "") : (rowTrim === ""))
        );

        if (coincideToken || coincideTupla) {
          coincidenciasPaso9.push(row);
        }
      }

      if (coincidenciasPaso9.length === 1) {
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
      } else if (coincidenciasPaso9.length > 1) {
        Logger.log("Anomalía técnica en Paso 9: múltiples coincidencias para el intento o token. Rechazando por ambigüedad.");
        throw new Error("Conflicto de integridad: se detectaron registros duplicados en la base de datos.");
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
    const libro = _obtenerLibro_();
    if (!libro) return null;
    const p = libro.getSheetByName("Resultados");
    if (!p || p.getLastRow() < 2) return null;
    const lastRow = p.getLastRow();
    const lastCol = p.getLastColumn();
    const enc = p.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) {
      return String(h || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
    });
    const idxToken = enc.indexOf("tokenexamen");
    const idxMat = enc.indexOf("matricula");
    const idxLec = enc.indexOf("idlectura");
    const idxInt = enc.indexOf("intento");
    const idxMod = enc.indexOf("modo");
    const idxTrim = enc.indexOf("trimestre");

    const idLecDatos = String((datos && datos.idLectura) || "").trim();
    const modoDatos = String((datos && datos.modo) || "").trim().toLowerCase();
    const trimDatos = String((datos && (datos.trimestre && (datos.trimestre.trimestre || datos.trimestre.num) || datos.trimestre)) || "").trim();
    const intentoDatos = (datos && datos.intento != null && datos.intento !== "") ? Number(datos.intento) : null;
    const matEsperada = String(mat || "").trim().toLowerCase();

    const filas = p.getRange(2, 1, lastRow - 1, lastCol).getValues();

    // 1. Estrategia Principal: Coincidencia exacta por Token Examen
    if (tokenRecibido && idxToken >= 0) {
      const coincidenciasToken = [];
      for (let r = filas.length - 1; r >= 0; r--) {
        const row = filas[r];
        const rToken = String(row[idxToken] || "").trim();
        if (rToken && rToken === tokenRecibido) {
          coincidenciasToken.push({ row: row, index: r });
        }
      }
      if (coincidenciasToken.length > 1) {
        Logger.log("Anomalía técnica de integridad: token de examen duplicado en múltiples filas.");
        return null;
      }
      if (coincidenciasToken.length === 1) {
        const item = coincidenciasToken[0];
        const row = item.row;
        const rowMat = idxMat >= 0 ? String(row[idxMat] || "").trim().toLowerCase() : "";
        const rowLec = idxLec >= 0 ? String(row[idxLec] || "").trim() : "";

        if (!rowMat || !matEsperada || rowMat !== matEsperada || !rowLec || !idLecDatos || rowLec !== idLecDatos) {
          Logger.log("Rechazo de recuperación por token: discrepancia de identidad en matrícula o identificador de lectura.");
          return null;
        }

        // Fila verificada inequívocamente por token, matrícula y lectura
        const filasPrevias = filas.slice(0, item.index);
        return reconstruirResultadoDesdeFila_(row, enc, matEsperada, idLecDatos, datos, filasPrevias, tokenRecibido);
      }
      // Si el token fue proporcionado pero no se encontró en ninguna fila, no derivar a histórica
      if (coincidenciasToken.length === 0) {
        return null;
      }
    }

    // 2. Estrategia Secundaria: Registros históricos legítimos sin Token Examen
    // Requiere TODOS los campos canónicos: matrícula, lectura, intento, modo y trimestre.
    // NUNCA interpretar encabezados faltantes ni valores vacíos como comodines.
    const tieneCamposCompletos = (
      matEsperada &&
      idLecDatos &&
      modoDatos &&
      (modoDatos === "sorteo" || modoDatos === "trimestral") &&
      intentoDatos !== null &&
      !isNaN(intentoDatos) &&
      intentoDatos > 0 &&
      idxMat >= 0 &&
      idxLec >= 0 &&
      idxInt >= 0 &&
      idxMod >= 0 &&
      (modoDatos !== "trimestral" || (idxTrim >= 0 && trimDatos))
    );

    if (tieneCamposCompletos) {
      const coincidenciasTupla = [];
      for (let r = filas.length - 1; r >= 0; r--) {
        const row = filas[r];
        const rToken = idxToken >= 0 ? String(row[idxToken] || "").trim() : "";
        if (rToken) continue; // Si la fila tiene token, pertenece a Estrategia 1

        const rMat = String(row[idxMat] || "").trim().toLowerCase();
        const rLec = String(row[idxLec] || "").trim();
        const rInt = Number(row[idxInt] || 0);
        const rMod = String(row[idxMod] || "").trim().toLowerCase();
        const rTrim = idxTrim >= 0 ? String(row[idxTrim] || "").trim() : "";

        if (!rMat || rMat !== matEsperada) continue;
        if (!rLec || rLec !== idLecDatos) continue;
        if (!rInt || rInt !== intentoDatos) continue;
        if (!rMod || rMod !== modoDatos) continue;

        if (modoDatos === "trimestral") {
          if (!rTrim || !trimDatos || rTrim !== trimDatos) continue;
        } else if (modoDatos === "sorteo") {
          if (rTrim !== "") continue;
        } else {
          continue;
        }

        coincidenciasTupla.push({ row: row, index: r });
      }

      if (coincidenciasTupla.length === 1) {
        const item = coincidenciasTupla[0];
        const row = item.row;
        const filasPrevias = filas.slice(0, item.index);
        return reconstruirResultadoDesdeFila_(row, enc, matEsperada, idLecDatos, datos, filasPrevias, "");
      } else if (coincidenciasTupla.length > 1) {
        Logger.log("Anomalía técnica: múltiples filas coinciden con la tupla histórica. Rechazo por ambigüedad.");
        return null;
      }
    }
  } catch (eB) {
    Logger.log("Error en buscarResultadoPrevioEnHoja_: " + eB.message);
    if (eB && eB.message && eB.message.indexOf("No fue posible recuperar íntegramente") >= 0) {
      throw eB;
    }
  }
  return null;
}

function calcularHistorialDesdeFilasPrevias_(mat, filasPrevias, enc, globalActual, tokenExcluir) {
  let count = 0;
  let sumG = 0;
  let sumC = 0;
  let sumP = 0;

  const normH = function (h) {
    return String(h || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  };
  const normEnc = (enc || []).map(normH);
  const colIdx = function (posibles) {
    const normPos = posibles.map(normH);
    for (let k = 0; k < normEnc.length; k++) {
      if (normPos.indexOf(normEnc[k]) >= 0) return k;
    }
    return -1;
  };
  const idxMat = colIdx(["Matrícula", "Matricula"]);
  const idxGlob = colIdx(["Calificación global (%)", "Global (%)"]);
  const idxComp = colIdx(["Calificación comprensión (%)", "Calificación (%)", "Calificacion", "Calificación"]);
  const idxPpm = colIdx(["PPM"]);
  const idxToken = colIdx(["Token Examen", "Token", "Id Examen", "Clave Idempotencia"]);

  const matNorm = String(mat || "").trim().toLowerCase();
  const tokExclNorm = String(tokenExcluir || "").trim();

  // 1. Incluir primero resultados de pestañas históricas archivadas si existen
  try {
    const libro = _obtenerLibro_();
    if (libro && typeof libro.getSheets === "function") {
      const hojas = libro.getSheets();
      for (let s = 0; s < hojas.length; s++) {
        const hSheet = hojas[s];
        const nomHoja = hSheet.getName();
        if (nomHoja === "Resultados" || nomHoja === "Config" || nomHoja === "Alumnos" || nomHoja === "Lecturas" || nomHoja === "Preguntas" || nomHoja === "Grupos" || nomHoja === "PersonalApoyo" || nomHoja === "Clases" || nomHoja === "Horarios" || nomHoja === "Pases" || nomHoja === "Asistencia") {
          continue;
        }
        if (hSheet.getLastRow() >= 2) {
          const pack = valoresHojaSinEncabezadosGordos_(hSheet, { "Segundos por pregunta": true });
          const encArch = (pack.enc || []).map(normH);
          const idxMatArch = encArch.indexOf("matricula");
          const idxGlobArch = encArch.indexOf("calificacionglobal");
          const idxCompArch = encArch.indexOf("calificacioncomprension");
          const idxPpmArch = encArch.indexOf("ppm");
          if (idxMatArch >= 0) {
            for (let fa = 0; fa < pack.filas.length; fa++) {
              const filaArch = pack.filas[fa];
              const mArch = String(filaArch[idxMatArch] || "").trim().toLowerCase();
              if (mArch && mArch === matNorm) {
                count++;
                if (idxGlobArch >= 0 && filaArch[idxGlobArch] !== "" && !isNaN(Number(filaArch[idxGlobArch]))) sumG += Number(filaArch[idxGlobArch]);
                if (idxCompArch >= 0 && filaArch[idxCompArch] !== "" && !isNaN(Number(filaArch[idxCompArch]))) sumC += Number(filaArch[idxCompArch]);
                if (idxPpmArch >= 0 && filaArch[idxPpmArch] !== "" && !isNaN(Number(filaArch[idxPpmArch]))) sumP += Number(filaArch[idxPpmArch]);
              }
            }
          }
        }
      }
    }
  } catch (eArch) {}

  // 2. Incluir filas estrictamente anteriores en la pestaña Resultados
  if (Array.isArray(filasPrevias) && idxMat >= 0) {
    for (let i = 0; i < filasPrevias.length; i++) {
      const f = filasPrevias[i];
      const m = String(f[idxMat] || "").trim().toLowerCase();
      if (m && m === matNorm) {
        if (tokExclNorm && idxToken >= 0 && String(f[idxToken] || "").trim() === tokExclNorm) {
          continue;
        }
        count++;
        if (idxGlob >= 0 && f[idxGlob] !== "" && !isNaN(Number(f[idxGlob]))) sumG += Number(f[idxGlob]);
        if (idxComp >= 0 && f[idxComp] !== "" && !isNaN(Number(f[idxComp]))) sumC += Number(f[idxComp]);
        if (idxPpm >= 0 && f[idxPpm] !== "" && !isNaN(Number(f[idxPpm]))) sumP += Number(f[idxPpm]);
      }
    }
  }

  if (count === 0) {
    return {
      n: 0,
      promedioGlobal: null,
      promedioComprension: null,
      promedioPpm: null,
      deltaGlobal: null
    };
  }

  const promG = Math.round((sumG / count) * 10) / 10;
  const promC = Math.round((sumC / count) * 10) / 10;
  const promP = Math.round((sumP / count) * 10) / 10;
  const delta = (globalActual != null && !isNaN(globalActual))
    ? Math.round((Number(globalActual) - promG) * 10) / 10
    : null;

  return {
    n: count,
    promedioGlobal: promG,
    promedioComprension: promC,
    promedioPpm: promP,
    deltaGlobal: delta
  };
}

function reconstruirResultadoDesdeFila_(row, enc, mat, idLectura, datos, filasPrevias, tokenExcluir) {
  const normH = function (h) {
    return String(h || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  };
  const normEnc = enc.map(normH);
  const colIdx = function (posibles) {
    const normPos = posibles.map(normH);
    for (let k = 0; k < normEnc.length; k++) {
      if (normPos.indexOf(normEnc[k]) >= 0) return k;
    }
    return -1;
  };

  const idxMat = colIdx(["Matrícula", "Matricula"]);
  const idxLec = colIdx(["ID Lectura", "Id Lectura"]);
  const idxGrado = colIdx(["Grado"]);
  const idxTLec = colIdx(["Tiempo Lectura (s)", "Tiempo Lectura", "T lectura (s)", "T lectura"]);
  const idxTRea = colIdx(["Tiempo Reactivos (s)", "Tiempo reactivos (s)", "Tiempo Reactivos", "T reactivos (s)", "T reactivos"]);
  const idxSegPreg = colIdx(["Segundos por pregunta"]);
  const idxAci = colIdx(["Aciertos"]);
  const idxComp = colIdx(["Calificación comprensión (%)", "Calificación (%)", "Calificacion", "Calificación"]);
  const idxPpm = colIdx(["PPM"]);
  const idxNivelPpm = colIdx(["Nivel PPM"]);
  const idxGlob = colIdx(["Calificación global (%)", "Global (%)"]);
  const idxPme = colIdx(["PME"]);
  const idxRelec = colIdx(["Relecturas"]);
  const idxDesglose = colIdx(["Desglose niveles"]);
  const idxRec = colIdx(["Recomendación", "Recomendacion"]);
  const idxToken = colIdx(["Token Examen", "Token", "Id Examen", "Clave Idempotencia"]);

  // 1. Validar presencia de métricas indispensables en la fila persistida
  if (idxAci < 0 || row[idxAci] === "" || row[idxAci] === null || isNaN(Number(row[idxAci]))) {
    throw new Error("No fue posible recuperar íntegramente el resultado previo: métrica de aciertos no disponible.");
  }
  if (idxPpm < 0 || row[idxPpm] === "" || row[idxPpm] === null || isNaN(Number(row[idxPpm]))) {
    throw new Error("No fue posible recuperar íntegramente el resultado previo: métrica de PPM no disponible.");
  }
  if (idxComp < 0 || row[idxComp] === "" || row[idxComp] === null || isNaN(Number(row[idxComp]))) {
    throw new Error("No fue posible recuperar íntegramente el resultado previo: métrica de comprensión no disponible.");
  }
  if (idxGlob < 0 || row[idxGlob] === "" || row[idxGlob] === null || isNaN(Number(row[idxGlob]))) {
    throw new Error("No fue posible recuperar íntegramente el resultado previo: calificación global no disponible.");
  }
  if (idxTLec < 0 || row[idxTLec] === "" || row[idxTLec] === null || isNaN(Number(row[idxTLec]))) {
    throw new Error("No fue posible recuperar íntegramente el resultado previo: tiempo de lectura no disponible.");
  }
  if (idxRelec < 0 || row[idxRelec] === "" || row[idxRelec] === null || isNaN(Number(row[idxRelec]))) {
    throw new Error("No fue posible recuperar íntegramente el resultado previo: datos de relecturas no disponibles.");
  }

  const aciertos = Number(row[idxAci]);
  const ppm = Number(row[idxPpm]);
  const comprension = Number(row[idxComp]);
  const global = Number(row[idxGlob]);
  const tiempoLectura = Number(row[idxTLec]);
  const tiempoReactivos = (idxTRea >= 0 && row[idxTRea] !== "" && !isNaN(Number(row[idxTRea]))) ? Number(row[idxTRea]) : 0;
  const relecturas = Math.max(0, Math.floor(Number(row[idxRelec])));

  // 2. Resolver identidad canónica y fuentes autoritativas
  const rowMat = idxMat >= 0 && String(row[idxMat] || "").trim() ? String(row[idxMat] || "").trim() : mat;
  const rowLec = idxLec >= 0 && String(row[idxLec] || "").trim() ? String(row[idxLec] || "").trim() : idLectura;

  let alumno = null;
  try {
    alumno = _buscarAlumno_(rowMat);
  } catch (eAlu) {}

  let lectura = null;
  try {
    lectura = buscarLecturaPorId(rowLec);
  } catch (eLec) {}

  // 3. Determinar Grado canónico
  let grado = "";
  if (idxGrado >= 0 && String(row[idxGrado] || "").trim()) {
    grado = String(row[idxGrado]).trim();
  } else if (alumno && alumno["Grado"]) {
    grado = String(alumno["Grado"]).trim();
  } else if (lectura && lectura["Grado"]) {
    grado = String(lectura["Grado"]).trim();
  }

  if (!grado) {
    throw new Error("No fue posible recuperar íntegramente el resultado previo: grado escolar no identificable.");
  }

  const spec = especificacionesDeGrado(grado);

  // 4. Determinar Desglose
  let desglose = null;
  if (idxDesglose >= 0 && row[idxDesglose]) {
    try {
      desglose = JSON.parse(row[idxDesglose]);
    } catch (eDes) {
      desglose = null;
    }
  }

  // 5. Determinar Total de preguntas de forma canónica
  let total = 0;
  if (lectura) {
    const preguntas = preguntasDeLectura(lectura);
    if (preguntas && preguntas.length) {
      total = preguntas.length;
    }
  }
  if (!total && desglose) {
    const nLit = (desglose.literal && typeof desglose.literal.total === "number") ? desglose.literal.total : 0;
    const nInf = (desglose.inferencial && typeof desglose.inferencial.total === "number") ? desglose.inferencial.total : 0;
    const nCri = (desglose.critica && typeof desglose.critica.total === "number") ? desglose.critica.total : 0;
    const sumaDesglose = nLit + nInf + nCri;
    if (sumaDesglose > 0) total = sumaDesglose;
  }
  if (!total || total <= 0) {
    throw new Error("No fue posible recuperar íntegramente el resultado previo: total de preguntas no verificable.");
  }

  // 6. Palabras y Velocidad Normalizada
  let palabras = 0;
  if (lectura && lectura["Texto"]) {
    palabras = contarPalabras(lectura["Texto"]);
  } else if (tiempoLectura > 0) {
    palabras = Math.round((ppm * tiempoLectura) / 60);
  }

  const ppmObj = Number(spec.ppmObjetivo) || 1;
  const velocidadNorm = Math.min(100, Math.round((ppm / ppmObj) * 100 * 10) / 10);

  // 7. Nivel PPM
  let nivelPpm = "";
  if (idxNivelPpm >= 0 && String(row[idxNivelPpm] || "").trim()) {
    nivelPpm = String(row[idxNivelPpm]).trim();
  } else {
    nivelPpm = calcularNivelPpm(ppm, spec);
  }

  // 8. PME
  let pme = null;
  if (idxPme >= 0 && row[idxPme] !== "" && row[idxPme] !== null && !isNaN(Number(row[idxPme]))) {
    pme = Number(row[idxPme]);
  } else {
    pme = calcularPme(ppm, comprension);
  }

  // 9. Tiempos por pregunta
  let tiempos = { n: 0, promedio: 0, minimo: 0, maximo: 0, impulsivo: false };
  if (idxSegPreg >= 0 && row[idxSegPreg]) {
    try {
      const arr = JSON.parse(row[idxSegPreg]);
      if (Array.isArray(arr) && arr.length) {
        tiempos = resumenTiemposPregunta(arr);
      }
    } catch (eT) {}
  }

  // 10. Historial del alumno (estrictamente anterior a este intento)
  let histData = { n: 0, promedioGlobal: null, promedioComprension: null, deltaGlobal: null };
  try {
    if (Array.isArray(filasPrevias)) {
      histData = calcularHistorialDesdeFilasPrevias_(rowMat, filasPrevias, enc, global, tokenExcluir);
    } else {
      const tokEx = tokenExcluir || (datos && datos.tokenExamen) || (idxToken >= 0 ? String(row[idxToken] || "").trim() : "");
      const h = _historialAlumnoParaReporte_(rowMat, tokEx);
      if (h) {
        let delta = null;
        if (h.n && h.promedioGlobal != null) {
          delta = Math.round((global - h.promedioGlobal) * 10) / 10;
        }
        histData = {
          n: h.n || 0,
          promedioGlobal: h.promedioGlobal,
          promedioComprension: h.promedioComprension,
          deltaGlobal: delta
        };
      }
    }
  } catch (eH) {}

  // 11. Recomendación
  const recomendacion = idxRec >= 0 ? String(row[idxRec] || "").trim() : "";

  return {
    palabras: palabras,
    tiempoLectura: tiempoLectura,
    tiempoReactivos: tiempoReactivos,
    ppm: ppm,
    nivelPpm: nivelPpm,
    aciertos: aciertos,
    total: total,
    comprension: comprension,
    velocidadNorm: velocidadNorm,
    global: global,
    pme: pme,
    tiemposPregunta: tiempos,
    relecturas: relecturas,
    desglose: desglose,
    historial: histData,
    recomendacion: recomendacion,
    spec: {
      ppmMin: spec.ppmMin,
      ppmMax: spec.ppmMax,
      ppmObjetivo: spec.ppmObjetivo
    }
  };
}
