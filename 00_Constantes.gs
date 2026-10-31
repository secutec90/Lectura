/**********************************************************************
 * PLATAFORMA DE COMPRENSIÓN LECTORA — SECUNDARIA TÉCNICA 90
 * Backend (Google Apps Script)
 **********************************************************************/

const URL_BASE_DEEPSEEK = "https://api.deepseek.com/chat/completions";
const NOMBRE_ESCUELA = "Secundaria Técnica 90";
const VERSION_APP = "v417";
const BUILD_APP = "build-561";
const USUARIO_ADMIN_ASISTENCIA = "admin";
const URL_SITIO_ALUMNO_DEFAULT = "https://sites.google.com/view/lec90/alumno";
const URL_SITIO_DOCENTE_DEFAULT = "https://sites.google.com/view/lec90/docente";
/** Despliegue dedicado para incrustar asistencia en Google Sites (lec90). */
const ID_DEPLOY_ASISTENCIA = "AKfycbwYr2eeYCG7o0fKe1pJr70ljjXsXaA4RUtoM07RdSjtrU0_DTOjOIpG19GIbYtknxWGUg";
/** Despliegue dedicado para clase hablada (alumno invidente / maestros). */
const ID_DEPLOY_CLASE = "AKfycbzPQDTjMqHGpSfBg3KMrDBpxSweOAk2x5adcMLJ4aJHvM2ETGtGI-rm1bz3aDRxj-FAgQ";

const ASIGNATURAS_DEFAULT = [
  "Español",
  "Historia",
  "Ciencias",
  "Formación Cívica y Ética",
  "Tecnología",
  "Matemáticas"
];

const ESPECIFICACIONES_GRADO = {
  "1": {
    palabrasMin: 400, palabrasMax: 600, objetivoPalabras: 500,
    ppmMin: 135, ppmMax: 145, ppmObjetivo: 140,
    preguntasMin: 5, preguntasMax: 7, objetivoPreguntas: 6,
    tipo: "narrativo (cuentos, fragmentos de novela de aventura, infografías)",
    enfoque: "retención literal: qué pasó, quién, dónde y secuencia",
    gramatica: "oraciones lineales, sin subordinadas densas"
  },
  "2": {
    palabrasMin: 600, palabrasMax: 800, objetivoPalabras: 700,
    ppmMin: 145, ppmMax: 155, ppmObjetivo: 150,
    preguntasMin: 7, preguntasMax: 10, objetivoPreguntas: 8,
    tipo: "expositivo (artículos de divulgación científica, reportajes)",
    enfoque: "inferencia lógica: causa-efecto, idea principal",
    gramatica: "nexos subordinados y vocabulario técnico moderado"
  },
  "3": {
    palabrasMin: 800, palabrasMax: 1000, objetivoPalabras: 850,
    ppmMin: 155, ppmMax: 160, ppmObjetivo: 158,
    preguntasMin: 10, preguntasMax: 12, objetivoPreguntas: 11,
    tipo: "argumentativo (ensayos cortos, columnas de opinión, textos legales simples)",
    enfoque: "postura crítica: propósito del autor, sesgo y evaluación de afirmaciones",
    gramatica: "abstracción conceptual y argumentación"
  }
};

const PESO_COMPRENSION = 0.7; // 70 %
const PESO_VELOCIDAD = 0.3;   // 30 %

const ENCABEZADOS = {
  Alumnos: ["Matrícula", "Nombre Completo", "Grado", "Grupo", "Activo", "Intentos extra"],
  Grupos: ["Grado", "Grupo", "Activo", "Intentos extra", "Turno"],
  Prefectos: ["Id", "Nombre", "Usuario", "Salt", "Hash", "Activo", "Clave"],
  PrefectoGrupos: ["Id prefecto", "Grado", "Grupo", "Turno"],
  Horarios: ["Id", "Dia", "Turno", "Bloque", "Hora inicio", "Hora fin", "Grado", "Grupo", "Maestro", "Asignatura", "Salon"],
  MaestrosClase: ["Id", "Nombre", "Usuario", "Salt", "Hash", "Activo", "Clave"],
  AccesoClaseAlumnos: ["Matrícula", "Nombre", "Grado", "Grupo", "Usuario", "Salt", "Hash", "Activo", "Clave"],
  PersonalApoyo: ["Id", "Nombre", "Usuario", "Área", "Salt", "Hash", "Activo", "Clave"],
  ContenidosClase: ["Id", "Id horario", "Maestro", "Asignatura", "Grado", "Grupo", "Dia", "Bloque", "Fecha", "Titulo", "Texto", "UrlAudio", "Publicado", "Timestamp"],
  AsistenciaAlumnos: ["Fecha", "Turno", "Grado", "Grupo", "Matrícula", "Nombre", "Estado", "Prefecto", "Timestamp", "Observación"],
  AsistenciaMaestros: ["Fecha", "Turno", "Bloque", "Id horario", "Maestro", "Grado", "Grupo", "Asignatura", "Estado", "Prefecto", "Timestamp", "Observación"],
  Lecturas: ["ID Lectura", "Grado", "Asignatura", "Tema", "Texto", "Palabras", "Preguntas JSON", "Activa", "Origen"],
  Preguntas: ["ID Lectura", "Orden", "Enunciado", "Opción 1", "Opción 2", "Opción 3", "Opción 4", "Opción 5", "Opción 6", "Respuesta correcta", "Nivel"],
  Resultados: [
    "Marca Temporal",
    "Escuela",
    "Matrícula",
    "Nombre Estudiante",
    "Grado",
    "Grupo",
    "Género",
    "Asignatura",
    "Tema",
    "ID Lectura",
    "Tiempo Lectura (s)",
    "Tiempo Reactivos (s)",
    "Tiempo Total (s)",
    "Segundos por pregunta",
    "Aciertos",
    "Calificación comprensión (%)",
    "PPM",
    "Nivel PPM",
    "Calificación global (%)",
    "Intento",
    "PME",
    "Relecturas",
    "Desglose niveles",
    "Recomendación",
    "Modo",
    "Trimestre",
    "Token Examen"
  ],
  Config: ["Clave", "Valor"],
  PlaneacionesNEM: [
    "Id", "Titulo", "Grado", "Grupo", "Asignatura", "CampoFormativo", "Metodologia",
    "ContenidoSintetico", "PDA", "EjesArticuladores", "Proposito", "ProblemaComunidad",
    "ProductoFinal", "NumSesiones", "Docente", "Estado", "Version", "FechaCreacion", "FechaAprobacion",
    "Periodo", "FechaInicio", "IdHorario", "DocentePropietario", "EsCopiaDe"
  ],
  SesionesNEM: [
    "Id", "IdPlaneacion", "NumeroSesion", "Titulo", "DuracionMin",
    "AperturaTexto", "AperturaMin", "DesarrolloTexto", "DesarrolloMin", "RecursosVisualesJSON",
    "ActividadTexto", "ActividadMin", "CierreTexto", "CierreMin",
    "GuionDocenteJSON", "GuionEstudianteAccesible", "Estado", "IdHorario", "FechaProgramada", "Timestamp"
  ],
  BibliotecaRecursos: [
    "Id", "Titulo", "Tipo", "Asignatura", "Grado", "Trimestre", "URL_Drive", "Autor", "Fecha"
  ]
};
