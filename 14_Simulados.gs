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
  const libro = _obtenerLibro_();
  if (!libro) throw new Error("No se pudo abrir la hoja de cálculo.");

  let p = libro.getSheetByName("Resultados") || _obtenerPestana_("resultados");
  if (!p) {
    p = libro.insertSheet("Resultados");
    p.appendRow(ENCABEZADOS.Resultados);
    p.getRange(1, 1, 1, ENCABEZADOS.Resultados.length).setFontWeight("bold");
  }

  const alumnos = _leerAlumnosResumen_().filter(function (a) {
    return String(a.activo || "SI").toUpperCase() !== "NO" && (a.nombre || a.matricula);
  });
  if (!alumnos.length) throw new Error("No hay alumnos en la hoja para simular resultados.");

  let lecturas = [];
  try { lecturas = _leerLecturasResumen_() || []; } catch (eLec) { lecturas = []; }

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
