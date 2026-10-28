/**********************************************************************
 * ENCUESTAS DE DEMOSTRACIÓN
 *
 * Crea encuestas completas (hoja propia, formulario y respuestas) y las
 * registra en el directorio, para poder probar el flujo de principio a fin
 * sin depender de datos reales. Se pueden borrar después.
 **********************************************************************/

const PREFIJO_DEMO_ENCUESTAS = "ST90 Demo Encuesta";

const DEMO_ENCUESTAS = [
  {
    nombre: "Clima escolar y convivencia",
    asignatura: "Formación Cívica y Ética",
    grado: "1°",
    trimestre: "Trimestre 1",
    grupo: "A",
    preguntas: [
      { etiqueta: "¿Cómo te sientes en la escuela la mayor parte del tiempo?", opciones: ["Bien", "Regular", "Mal"] },
      { etiqueta: "¿Has visto burlas o agresiones entre compañeros este trimestre?", opciones: ["Nunca", "A veces", "Seguido"] },
      { etiqueta: "¿Sabes a quién acudir si tienes un problema con un compañero?", opciones: ["Sí", "No"] }
    ],
    pesos: [[0.55, 0.33, 0.12], [0.42, 0.40, 0.18], [0.62, 0.38]]
  },
  {
    nombre: "Hábitos y gusto por la lectura",
    asignatura: "Lengua Materna (Español)",
    grado: "2°",
    trimestre: "Trimestre 2",
    grupo: "B",
    preguntas: [
      { etiqueta: "¿Cuántos libros leíste por gusto este trimestre?", opciones: ["Ninguno", "Uno o dos", "Tres o más"] },
      { etiqueta: "¿Qué te impide leer más?", opciones: ["Falta de tiempo", "No me gusta", "No tengo libros"] },
      { etiqueta: "¿Te gustaría una biblioteca de aula con préstamo?", opciones: ["Sí", "No"] }
    ],
    pesos: [[0.48, 0.36, 0.16], [0.50, 0.30, 0.20], [0.74, 0.26]]
  },
  {
    nombre: "Uso de la tecnología en casa",
    asignatura: "Tecnología",
    grado: "3°",
    trimestre: "Trimestre 3",
    grupo: "C",
    preguntas: [
      { etiqueta: "¿Cuántas horas al día usas pantallas fuera de clase?", opciones: ["Menos de 1", "Entre 1 y 3", "Más de 3"] },
      { etiqueta: "¿Usas el celular para tareas escolares?", opciones: ["Sí, seguido", "A veces", "No"] },
      { etiqueta: "¿Tienes internet estable en casa?", opciones: ["Sí", "A veces", "No"] }
    ],
    pesos: [[0.20, 0.45, 0.35], [0.38, 0.42, 0.20], [0.55, 0.25, 0.20]]
  }
];

function _elegirDemo_(pares) {
  const r = Math.random();
  let acumulado = 0;
  for (let i = 0; i < pares.length; i++) {
    acumulado += pares[i];
    if (r <= acumulado) return i;
  }
  return pares.length - 1;
}

/** Crea una encuesta demo con su propia hoja y la registra en el directorio. */
function _crearEncuestaDemo_(def) {
  const libro = SpreadsheetApp.create(PREFIJO_DEMO_ENCUESTAS + " — " + def.nombre);
  const hojaInicial = libro.getSheets()[0];
  hojaInicial.setName("Configuracion");

  const config = [
    ["clave", "valor"],
    ["titulo", def.nombre],
    ["asignatura", def.asignatura],
    ["grado", def.grado],
    ["trimestre", def.trimestre],
    ["grupo", def.grupo],
    ["escuela", "Secundaria Técnica 90"],
    ["activa", "TRUE"]
  ];
  hojaInicial.getRange(1, 1, config.length, 2).setValues(config);

  // Formulario: id | tipo | etiqueta | requerido | ayuda | placeholder | dim | extra | activa | columna
  const hojaForm = libro.insertSheet("Formulario");
  const filasForm = [["id", "tipo", "etiqueta", "requerido", "ayuda", "placeholder", "dimension", "extra", "activa", "columna", "orden"]];
  def.preguntas.forEach(function (p, i) {
    filasForm.push([
      "p" + (i + 1),
      "opcion_unica",
      p.etiqueta,
      "TRUE",
      "",
      "",
      "",
      JSON.stringify({ opciones: p.opciones }),
      "TRUE",
      i + 3,
      i + 1
    ]);
  });
  hojaForm.getRange(1, 1, filasForm.length, filasForm[0].length).setValues(filasForm);

  // Respuestas: una fila por alumno
  const hojaResp = libro.insertSheet("Respuestas");
  const encabezado = ["fecha", "origen"].concat(def.preguntas.map(function (p, i) { return "p" + (i + 1); }));
  const filas = [encabezado];
  const total = 24;
  for (let a = 0; a < total; a++) {
    const fila = [new Date(), "demo"];
    def.preguntas.forEach(function (p, i) {
      fila.push(p.opciones[_elegirDemo_(def.pesos[i])]);
    });
    filas.push(fila);
  }
  hojaResp.getRange(1, 1, filas.length, encabezado.length).setValues(filas);
  hojaResp.setFrozenRows(1);

  _registrarDirectorioEncuesta_({
    hojaId: libro.getId(),
    hojaNombre: libro.getName(),
    nombre: def.nombre,
    asignatura: def.asignatura,
    grado: def.grado,
    trimestre: def.trimestre,
    grupo: def.grupo,
    preguntas: def.preguntas.length,
    respuestas: total
  });

  return { nombre: def.nombre, hojaId: libro.getId(), respuestas: total };
}

/**
 * Crea las encuestas de demostración que aún no existan en el directorio.
 * Es idempotente: si ya hay una con el mismo nombre, no la duplica.
 */
function sembrarEncuestasDemo(token) {
  exigirClaseRol_(token, ["admin"]);
  const existentes = _leerDirectorioEncuestas_();
  const nombres = {};
  existentes.forEach(function (r) { nombres[String(r["Nombre"] || "").trim().toLowerCase()] = true; });

  const creadas = [];
  DEMO_ENCUESTAS.forEach(function (def) {
    if (nombres[def.nombre.toLowerCase()]) return;
    try {
      creadas.push(_crearEncuestaDemo_(def));
    } catch (e) {
      console.error("sembrarEncuestasDemo(" + def.nombre + "): " + (e && e.message ? e.message : e));
    }
  });

  return {
    ok: true,
    creadas: creadas,
    mensaje: creadas.length
      ? "Se crearon " + creadas.length + " encuestas de prueba."
      : "Las encuestas de prueba ya existían."
  };
}

/** Borra las encuestas de prueba: manda sus hojas a la papelera y limpia el directorio. */
function borrarEncuestasDemo(token) {
  exigirClaseRol_(token, ["admin"]);
  const hoja = _hojaDirectorioEncuestas_();
  if (!hoja) return { ok: false, mensaje: "No se pudo abrir el directorio." };

  const filas = _leerDirectorioEncuestas_();
  const aBorrar = filas.filter(function (r) {
    return String(r["HojaNombre"] || "").indexOf(PREFIJO_DEMO_ENCUESTAS) === 0;
  });
  if (!aBorrar.length) return { ok: true, borradas: 0, mensaje: "No hay encuestas de prueba en el directorio." };

  aBorrar.forEach(function (r) {
    try {
      const id = String(r["HojaId"] || "").trim();
      if (id) DriveApp.getFileById(id).setTrashed(true);
    } catch (e) { console.error("papelera: " + e); }
  });

  // borrar filas de abajo hacia arriba para no desplazar índices
  aBorrar.sort(function (a, b) { return b._fila - a._fila; }).forEach(function (r) {
    hoja.deleteRow(r._fila);
  });

  return { ok: true, borradas: aBorrar.length, mensaje: "Se borraron " + aBorrar.length + " encuestas de prueba." };
}
