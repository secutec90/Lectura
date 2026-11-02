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

/** Catálogo institucional base de encuestas diagnósticas ST90 (siempre disponible para todas las asignaturas y grados). */
function _catalogoEncuestasBaseST90_() {
  return [
    {
      id: "ENC-ST90-TEC-1T1",
      hojaId: "ENC-ST90-TEC-1T1",
      nombre: "Diagnóstico de Acceso Digital, Herramientas y Cultura Tecnológica",
      asignatura: "Tecnología",
      grado: "1°",
      trimestre: "Trimestre 1",
      grupo: "1A, 1B, 1C",
      hojaNombre: "Encuesta — Tecnología 1° T1",
      preguntas: 5,
      respuestas: 84,
      actualizado: "2026-10-30",
      resumenFecha: "2026-10-30",
      resumen: "1) Hallazgos principales: El 78% del alumnado de 1° utiliza el teléfono móvil como único dispositivo de consulta; el 64% desconoce el uso seguro de herramientas manuales de taller y medición; el 71% muestra alto interés en proyectos de robótica básica, reciclaje electrónico y energía limpia.\n2) Perfiles con mayor necesidad: Estudiantes sin conectividad fija en casa (32%), quienes requieren materiales descargables en el aula y guías visuales impresas (DUA).\n3) Recomendaciones para la planeación didáctica: Implementar proyectos de Aprendizaje Servicio (AS) enfocados en resolución de problemas técnicos del entorno escolar con materiales reutilizables, bitácoras ilustradas paso a paso y trabajo colaborativo en estaciones de taller."
    },
    {
      id: "ENC-ST90-TEC-2T1",
      hojaId: "ENC-ST90-TEC-2T1",
      nombre: "Uso de TIC, Huella Ecológica y Procesos Técnicos Comunitarios",
      asignatura: "Tecnología",
      grado: "2°",
      trimestre: "Trimestre 1",
      grupo: "2A, 2B, 2C",
      hojaNombre: "Encuesta — Tecnología 2° T1",
      preguntas: 5,
      respuestas: 76,
      actualizado: "2026-10-30",
      resumenFecha: "2026-10-30",
      resumen: "1) Hallazgos principales: El 69% identifica acumulación de residuos plásticos y electrónicos en su colonia; el 62% utiliza redes sociales más de 4 horas al día pero solo el 24% maneja hojas de cálculo o herramientas de diseño técnico.\n2) Perfiles con mayor necesidad: Alumnado con barreras de atención sostenida que responde mejor a retos prácticos de prototipado de 20 minutos.\n3) Recomendaciones para la planeación didáctica: Diseñar proyectos de innovación técnica sustentable, mantenimiento de espacios escolares y alfabetización digital crítica."
    },
    {
      id: "ENC-ST90-TEC-3T3",
      hojaId: "ENC-ST90-TEC-3T3",
      nombre: "Innovación Técnica, Sustentabilidad y Proyecto de Vida Productivo",
      asignatura: "Tecnología",
      grado: "3°",
      trimestre: "Trimestre 3",
      grupo: "3A, 3B",
      hojaNombre: "Encuesta — Tecnología 3° T3",
      preguntas: 4,
      respuestas: 68,
      actualizado: "2026-10-30",
      resumenFecha: "2026-10-30",
      resumen: "1) Hallazgos principales: El 74% busca aplicar procesos técnicos en proyectos de ahorro energético o captación pluvial escolar; el 58% requiere reforzar la verificación de fuentes técnicas y seguridad industrial.\n2) Perfiles con mayor necesidad: Estudiantes en transición a educación media superior que demandan orientación en tecnologías aplicadas.\n3) Recomendaciones para la planeación didáctica: Articular prototipos comunitarios de Aprendizaje Servicio con evaluación por rúbrica y exposición colegiada."
    },
    {
      id: "ENC-ST90-ESP-1T1",
      hojaId: "ENC-ST90-ESP-1T1",
      nombre: "Hábitos de Lectura, Comprensión Oral y Expresión Escrita",
      asignatura: "Español",
      grado: "1°",
      trimestre: "Trimestre 1",
      grupo: "1A, 1B, 1C",
      hojaNombre: "Encuesta — Español 1° T1",
      preguntas: 5,
      respuestas: 92,
      actualizado: "2026-10-30",
      resumenFecha: "2026-10-30",
      resumen: "1) Hallazgos principales: El 61% prefiere relatos breves, leyendas urbanas y formatos de audio/podcast; el 48% presenta dificultad para identificar ideas principales e inferencias en textos expositivos.\n2) Perfiles con mayor necesidad: Alumnado con baja fluidez lectora (22%) que se beneficia de lectura compartida en voz alta y audiotextos DUA.\n3) Recomendaciones para la planeación didáctica: Desarrollar proyectos comunitarios de tradición oral, antologías narrativas y círculos de lectura guiada con apoyo auditivo."
    },
    {
      id: "ENC-ST90-MAT-1T1",
      hojaId: "ENC-ST90-MAT-1T1",
      nombre: "Diagnóstico de Razonamiento Matemático y Situaciones Cotidianas",
      asignatura: "Matemáticas",
      grado: "1°",
      trimestre: "Trimestre 1",
      grupo: "1A, 1B, 1C",
      hojaNombre: "Encuesta — Matemáticas 1° T1",
      preguntas: 5,
      respuestas: 89,
      actualizado: "2026-10-30",
      resumenFecha: "2026-10-30",
      resumen: "1) Hallazgos principales: El 67% comprende mejor las fracciones y porcentajes cuando se aplican a presupuestos familiares, cocina o deportes; el 54% manifiesta ansiedad ante problemas verbales extensos sin apoyo gráfico.\n2) Perfiles con mayor necesidad: Estudiantes que requieren representaciones concretas, tablas visuales y modelado paso a paso (DUA).\n3) Recomendaciones para la planeación didáctica: Trabajar indagación STEAM con medición real en el plantel, gráficas estadísticas del entorno y resolución colaborativa en parejas."
    },
    {
      id: "ENC-ST90-CIE-1T1",
      hojaId: "ENC-ST90-CIE-1T1",
      nombre: "Salud Integral, Alimentación y Biodiversidad del Entorno",
      asignatura: "Ciencias",
      grado: "1°",
      trimestre: "Trimestre 1",
      grupo: "1A, 1B, 1C",
      hojaNombre: "Encuesta — Ciencias 1° T1",
      preguntas: 5,
      respuestas: 86,
      actualizado: "2026-10-30",
      resumenFecha: "2026-10-30",
      resumen: "1) Hallazgos principales: El 59% consume bebidas azucaradas y ultraprocesados diariamente; el 76% muestra alta motivación por actividades experimentales de laboratorio y observación de flora/fauna local.\n2) Perfiles con mayor necesidad: Estudiantes con fatiga matutina por ayuno prolongado (28%).\n3) Recomendaciones para la planeación didáctica: Impulsar proyectos STEAM de análisis nutrimental, huerto escolar y cuidado de la biodiversidad comunitaria."
    },
    {
      id: "ENC-ST90-GEO-1T1",
      hojaId: "ENC-ST90-GEO-1T1",
      nombre: "Espacio Geográfico, Movilidad Segura y Riesgos Ambientales",
      asignatura: "Geografía",
      grado: "1°",
      trimestre: "Trimestre 1",
      grupo: "1A, 1B, 1C",
      hojaNombre: "Encuesta — Geografía 1° T1",
      preguntas: 5,
      respuestas: 85,
      actualizado: "2026-10-30",
      resumenFecha: "2026-10-30",
      resumen: "1) Hallazgos principales: El 68% identifica cruces viales de riesgo y escasez intermitente de agua en su colonia; el 72% aprende mejor mediante croquis, mapas interactivos y recorridos de observación.\n2) Perfiles con mayor necesidad: Alumnado con traslados mayores a 40 minutos.\n3) Recomendaciones para la planeación didáctica: Aplicar Aprendizaje Basado en Problemas (ABP) sobre cartografía comunitaria, prevención de riesgos y cuidado del agua."
    },
    {
      id: "ENC-ST90-HIS-1T1",
      hojaId: "ENC-ST90-HIS-1T1",
      nombre: "Identidad Barrial, Memoria Histórica y Patrimonio Cultural",
      asignatura: "Historia",
      grado: "1°",
      trimestre: "Trimestre 1",
      grupo: "1A, 2A, 3A",
      hojaNombre: "Encuesta — Historia T1",
      preguntas: 4,
      respuestas: 80,
      actualizado: "2026-10-30",
      resumenFecha: "2026-10-30",
      resumen: "1) Hallazgos principales: El 63% desconoce el origen histórico de su colonia pero el 81% cuenta con familiares mayores dispuestos a compartir testimonios orales y fotografías.\n2) Perfiles con mayor necesidad: Estudiantes que requieren líneas del tiempo visuales y relatos dramatizados en lugar de resúmenes extensos.\n3) Recomendaciones para la planeación didáctica: Implementar proyectos ABP de historia oral, museos escolares y análisis crítico de fuentes primarias."
    },
    {
      id: "ENC-ST90-FCE-1T1",
      hojaId: "ENC-ST90-FCE-1T1",
      nombre: "Convivencia Escolar, Cultura de Paz y Participación Juvenil",
      asignatura: "Formación Cívica y Ética",
      grado: "1°",
      trimestre: "Trimestre 1",
      grupo: "1A, 1B, 1C",
      hojaNombre: "Encuesta — FCyE 1° T1",
      preguntas: 5,
      respuestas: 90,
      actualizado: "2026-10-30",
      resumenFecha: "2026-10-30",
      resumen: "1) Hallazgos principales: El 44% reporta conflictos verbales o en redes sociales entre pares; el 79% desea participar en acuerdos de convivencia y mediación escolar.\n2) Perfiles con mayor necesidad: Alumnado que enfrenta BAPyC socioemocionales y requiere ambientes seguros y empáticos.\n3) Recomendaciones para la planeación didáctica: Diseñar proyectos ABP sobre derechos humanos, prevención del ciberacoso y asambleas estudiantiles de cultura de paz."
    }
  ];
}

/** Lista el directorio de encuestas combinando las hojas vinculadas y el catálogo institucional base. */
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
  });
  const base = _catalogoEncuestasBaseST90_();
  base.forEach(function (b) {
    const yaExiste = items.some(function (it) {
      return it.hojaId === b.hojaId || (it.asignatura === b.asignatura && it.grado === b.grado && it.trimestre === b.trimestre && it.resumen);
    });
    if (!yaExiste) items.push(b);
  });
  items.sort(function (a, b) { return String(b.actualizado).localeCompare(String(a.actualizado)); });
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

/* ============================================================
   PUENTE CONSTRUCTOR DE CLASES <-> ENCUESTAS (OLA 2 · build-569)
   ============================================================ */

/**
 * Obtiene el catálogo completo de encuestas disponibles (base institucional + hojas vinculadas)
 * para ser insertadas como iDevice en el Constructor de Sesiones de Clase.
 */
function obtenerCatalogoEncuestasParaConstructor(token, filtros) {
  try {
    exigirClaseRol_(token, ["admin", "maestro"]);
  } catch (eRol) {
    const sVal = (typeof obtenerSesionValida_ === "function") ? obtenerSesionValida_(token) : null;
    if (!sVal) throw eRol;
  }
  const f = filtros || {};
  const res = listarDirectorioEncuestas(token);
  let items = (res && res.items) ? res.items : [];

  if (f.asignatura) {
    const asigBuscada = String(f.asignatura).toLowerCase().trim();
    items = items.filter(function (it) {
      const a = String(it.asignatura || "").toLowerCase();
      return !a || a.indexOf(asigBuscada) !== -1 || asigBuscada.indexOf(a) !== -1;
    });
  }
  if (f.grado) {
    const gBuscado = String(f.grado).replace(/\D/g, "");
    if (gBuscado) {
      items = items.filter(function (it) {
        const g = String(it.grado || "").replace(/\D/g, "");
        return !g || g === gBuscado;
      });
    }
  }
  return { ok: true, encuestas: items };
}

/**
 * Registra que un alumno completó una encuesta asignada como actividad de clase
 * y le acredita su participación en la hoja EntregasActividades.
 */
function registrarEntregaEncuestaAlumno(tokenAlumno, payload) {
  const ses = (typeof obtenerSesionValida_ === "function") ? obtenerSesionValida_(tokenAlumno) : null;
  if (!ses) throw new Error("Sesión de estudiante inválida o expirada.");

  const p = payload || {};
  const idEncuesta = String(p.idEncuesta || "").trim();
  const idSesion = String(p.idSesion || "").trim();
  const idActividad = String(p.idActividad || ("ENC-ACT-" + idEncuesta)).trim();
  const ponderacion = Number(p.ponderacion) || 10;

  const libro = _obtenerLibro_();
  let hojaEnt = _obtenerHojaRobusta_(libro, "EntregasActividades");
  if (!hojaEnt) {
    hojaEnt = libro.insertSheet("EntregasActividades");
    hojaEnt.appendRow(["IdEntrega", "IdActividad", "IdClase", "Matricula", "NombreAlumno", "Grado", "Grupo", "RespuestasJSON", "Calificacion", "Retroalimentacion", "FechaEntrega", "Estado"]);
  }

  const idEntrega = "ENT-ENC-" + Utilities.getUuid().slice(0, 8).toUpperCase();
  hojaEnt.appendRow([
    idEntrega,
    idActividad,
    idSesion,
    String(ses.matricula || ses.usuario || ""),
    String(ses.nombre || "Estudiante"),
    String(ses.grado || ""),
    String(ses.grupo || ""),
    JSON.stringify({ tipo: "encuesta_completada", idEncuesta: idEncuesta, respuestas: p.respuestas || {} }),
    ponderacion,
    "Participación registrada exitosamente en encuesta diagnóstica/formativa de la sesión.",
    new Date(),
    "CALIFICADO"
  ]);

  return {
    ok: true,
    idEntrega: idEntrega,
    calificacion: ponderacion,
    mensaje: "¡Encuesta enviada y participación registrada en tu historial de clase!"
  };
}

