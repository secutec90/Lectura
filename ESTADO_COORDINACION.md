# BITÁCORA Y CONTRATO DE TRABAJO VIVO: ORQUESTA MULTI-AGENTE (ANTIGRAVITY + DEEPSEEK + CURSOR)

**Objetivo:** Eliminar la ambigüedad, evitar sobreescritura de código y garantizar una entrega armónica sin conflictos ni errores de sincronización.
Todos los agentes leen este documento ANTES de proponer o tocar código.

---

## 1. Protocolo de Orquestación y Gobernanza (Roles Inmutables)

| Rol | Agente | Partitura y Responsabilidad Exclusiva | Qué tiene estrictamente PROHIBIDO |
| :--- | :--- | :--- | :--- |
| **Director & Auditor Técnico** | **Antigravity** | • **Gobernanza exclusiva:** Único autorizado para `git commit`, `git push` a GitHub y `clasp push / deploy` a Google Apps Script.<br>• Redactar la fase activa e IDs del DOM en este documento.<br>• Programar backend `.gs` (`LockService`, `CacheService`, `PropertiesService`, endpoints `google.script.run`).<br>• Auditar el código de DeepSeek y Cursor antes de darlo por cerrado.<br>• Registrar el bloque de cierre en `CONTROL_CAMBIOS.md`. | Aprobar cambios que no respeten los selectores acordados o que carezcan de candados de concurrencia. |
| **Diseñador Visual & DUA** | **DeepSeek** | • Experiencia de usuario (UX/UI), microinteracciones y accesibilidad DUA.<br>• Archivos CSS exclusivos (`AdminPlaneacionCSS.html`, `ComunCSS.html`, `AdminCSS.html`, etc.).<br>• Tarjetas, estados visuales (`.activa`, `.aprobada`), modales y botones planos ST90. | Modificar funciones backend `.gs`, ejecutar comandos git/clasp o alterar IDs del DOM sin aprobación previa. |
| **Ingeniero Frontend** | **Cursor** | • Interacción del cliente, eventos click/change y manipulación del DOM.<br>• Fragmentos JS (`AdminPlanJS_*.html`, `ClaseJS_*.html`, `AdminEncJS_*.html`, `FormEncJS_*.html`, `AyudaJS.html`).<br>• Conexión con `google.script.run` respetando estrictamente los IDs del contrato. | Inventar nuevas clases CSS arbitrarias, modificar archivos `.gs` de backend o ejecutar push a GitHub/Apps Script. |

---

## 2. Prompts de Arranque Rápido para Agentes

### Para DeepSeek:
> *"Actúas como Diseñador UI/UX y CSS del proyecto Suite Escolar ST90. Tu partitura está definida en `ESTADO_COORDINACION.md` y `ENTREGA_DEEPSEEK.md`. Solo tocas archivos CSS y estructura visual. Tienes estrictamente prohibido cambiar IDs del DOM o crear lógica de backend. Escribe y guarda tu entrega completa y código CSS propuesto en el archivo `ENTREGA_DEEPSEEK.md` para que Antigravity la audite, e inmediatamente después ejecuta `node herramientas/centinela_buzon.js deepseek` para revisar cada 60 segundos si Antigravity cargó una nueva tarea."*

### Para Cursor:
> *"Actúas como Desarrollador Frontend JS del proyecto Suite Escolar ST90. Tu partitura está definida en `ESTADO_COORDINACION.md` y `ENTREGA_CURSOR.md`. Solo tocas fragmentos JS del DOM y llamadas a `google.script.run`. Respeta estrictamente los IDs definidos por Antigravity y las clases de DeepSeek. Tienes prohibido hacer commit/push o alterar el backend. Escribe y guarda tu entrega completa y controladores en el archivo `ENTREGA_CURSOR.md` para que Antigravity la audite, e inmediatamente después ejecuta `node herramientas/centinela_buzon.js cursor --intervalo=60 --max-ciclos=0` para quedar en guardia continua (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity."*

---

## 3. Contrato Técnico Inmutable entre Agentes (IDs y Selectores del DOM)

### A. Wizard de Planeación Didáctica NEM (`build-568`)
- **Etapa 1 (`#etapaPlanNEM_1`):** `input#planTitulo`, `select#planCampoFormativo` (bloqueado `🔒` por norma SEP Fase 6), `select#planMetodologia`, `input#planNumSesiones` (en fila única `.nem-fila-una`).
- **Etapa 2 (`#etapaPlanNEM_2`):** `select#selContenidoSinteticoNEM`, `select#selPDANEM`, `textarea#planContenidoSintetico`, `textarea#planPDA`, `#badgeConteoPDAs`.
- **Etapa 3 (`#etapaPlanNEM_3`):** `select#selProblemaEscolar`, `textarea#planProblema`, `#secInclusionBAPyC`, `.nem-chip-dua-rapido` (`insertarAjusteDUARapido`), `textarea#planAjustesRazonables`, modal `📊 Directorio de encuestas` (`#dirSelect`, `#dirDetalle`).
- **Etapa 4 (`#etapaPlanNEM_4`):** `textarea#planProposito`, `#btnSugerirProyectoIA`, `#cajaRubricaCotejoNEM`, `.nem-tabla-cotejo-edit`, `.input-criterio-cotejo-nem`, `#modalConfigMembreteST90` (`#cfgLogoIzq`, `#cfgLogoDer`, `#cfgEncL1`, `#cfgEncL2`, `#cfgEncL3`) y vista previa PDF Oficial NL (`#modalVistaPreviaPDFOficialNL`).

### B. Constructor de Clases eXeLearning ST90 — iDevice Encuesta (`build-569`)
- **Barra de herramientas (`.idevice-bar`):** Botón `📊 Encuesta / Diagnóstico` -> `insertariDeviceSesion_('encuesta')`.
- **Tarjeta iDevice (`.idevice-bloque[data-tipo="encuesta"]`):**
  - `.sel-modo-encuesta-idevice` (`datos_previos` | `actividad_activa`)
  - `.sel-catalogo-encuesta-id`
  - `.panel-modo-datos` (`.txt-resumen-encuesta`, `.chk-incluir-graficas`)
  - `.panel-modo-actividad` (`.inp-ponderacion-encuesta`, `.sel-registro-modo`)

### C. Constructor Dual: Encuestas & Quiz Evaluable (`build-570`)
- **Interruptor Superior (`.constructor-modo-switch`):** `#btnModoEncuesta`, `#btnModoQuiz`, `#barraConfigQuizGlobal`, `#lblPuntosTotalesQuiz`.
- **Ajustes por Reactivo (`.caja-ajustes-quiz`):** `.quiz-puntos-input`, `.quiz-correcta-input`, `.quiz-retro-input`.

### D. Evolución Avanzada Tipo Google Forms (`build-571` — Sprints 1, 2 y 3)
- **Sprint 1 (Multimedia y Retroalimentación Diferenciada):** `media: { tipo, url, pie }`, `figure.reactivo-media`, `retroalimentacion: { acierto, fallo }`.
- **Sprint 2 (Carga de Evidencias a Drive y Secciones Paginadas):** `archivoConfig: { formatos, maxMB }`, endpoint `subirEvidenciaFormulario(payload)`, `secciones[]`, `.barra-progreso-nem`.
- **Sprint 3 (Temporizador y Aleatorización):** `temporizadorMinutos`, `#barraTemporizadorQuiz`, Fisher-Yates en `barajarPreguntas` y `aleatorizarOpciones`.

---

## 4. Plan Maestro de Implementación en Olas (`build-568` a `build-579`)

| Ola / Build | Alcance Técnico Principal | Estado |
| :--- | :--- | :--- |
| **Ola 1 (`build-568`)** | **Etapas 3 y 4 + Membrete Configurable + Lista de Cotejo y Rúbrica Analítica en PDF Oficial NL:**<br>• Chips DUA de 1 clic en Etapa 3.<br>• Editor de Lista de Cotejo (`3–5` criterios) + generador de Rúbrica Analítica (4 niveles SEP) en Etapa 4.<br>• Modal `#modalConfigMembreteST90` (`PropertiesService`) con respaldo en escudos oficiales de Nuevo León.<br>• Fechas reales del horario docente en el PDF Oficial NL. | 🟢 **COMPLETADA** |
| **Ola 2 (`build-569`)** | **iDevice Encuesta Diagnóstica / Actividad Evaluable en Constructor de Clases:**<br>• Nuevo bloque `encuesta` en `.idevice-bar` (`AdminPlanJS_05.html` / `ClaseJS_07.html`).<br>• Modo A (`datos_previos` con resumen IA) y Modo B (`actividad_activa` vinculada a matrícula en `EntregasActividades`). | 🟢 **COMPLETADA** |
| **Ola 3 (`build-570`)** | **Constructor Dual Encuestas & Quizzes Integrado al iDevice:**<br>• Conmutador dual y modal de creación directa de encuesta/quiz desde la sesión.<br>• Puntos evaluativos, retroalimentación formativa y vinculación automática a la sesión. | 🟢 **COMPLETADA** |
| **Ola 4 (`build-571`)** | **Multimedia, Paginación, Carga a Drive y Temporizador:**<br>• Imágenes/diagramas por reactivo, temporizador en vivo y subida de evidencias. | 🟢 **COMPLETADA** |
| **Ola 5 (`build-578` & `build-579`)** | **Entorno Completo eXeLearning 3.0 & Contenidos Especializados:**<br>• Árbol de páginas con barra teal, indentación y lápiz ✏️ de renombrado por nodo.<br>• Catálogo accordion en 7 familias renombrado oficialmente a "Contenidos de Aprendizaje".<br>• Layout frontal derecho en flexbox (`.app-workspace`) publicando contenidos enfrente del menú.<br>• Herramientas reales de autor por formato (Texto DUA con síntesis de voz, Video con 3 orígenes y pausa, Galería/Drive con alt-text DUA, Fichas de descarga, Quiz con opciones dinámicas, Inglés Listening/Pronunciación y Ofimática interactiva). | 🟢 **COMPLETADA** |
| **Ola 6 (`build-580`)** | **Inicio Limpio en Autor, Asistente IA de Secuencia Didáctica y Verificación en `Clase.html`:**<br>• Ocultación de barra redundante `.idevice-bar` y despliegue del Asistente Pedagógico IA (Lucy ST90).<br>• Sugerencia guiada y construcción en 1 clic de la secuencia de 4 momentos en base a la planeación previa.<br>• Prueba de flujo completo alumno: lectura guiada DUA en voz alta, resolución de quiz con retroalimentación inmediata y ejercicios de inglés/ofimática.<br>• Descarga y validación del PDF Oficial del Plano Didáctico NL. | 🟢 **COMPLETADA** |
| **Ola 6.1 (`build-581` / `build-582`)** | **Encuesta/Diagnóstico en Menú lateral, Erradicación de Barra Modular y Ocultación de Quick-Ribbon:**<br>• Erradicar del lienzo central la barra `.idevice-bar` y `.quick-ribbon`.<br>• Integrar `📊 Encuesta / Diagnóstico` en el acordeón lateral de "Contenidos de Aprendizaje" (Evaluación y seguimiento). | 🟢 **COMPLETADA** |
| **Ola 7 (`build-583`)** | **Flujo Lógico Didáctico (Guion ➔ Constructor), Ayuda & Audio DUA por Sección, Vista Previa Alumno y Modelo de Calificaciones:**<br>• Invertir y estructurar la secuencia en `#editorSesionActiva`: Paso 1 (Guion de 4 Momentos con `?` y `🔊`) ➔ Conector Lucy IA ➔ Paso 2 (Constructor Interactivo eXeLearning).<br>• Botón destacado `👁️ Vista Previa Alumno`.<br>• Arquitectura de subida de evidencias y modelo de calificaciones (Quiz + Actividad). | 🟢 **COMPLETADA** |
| **Ola 8 (`build-584`)** | **Tabs Horizontales Guiados de Sesión y Vista Previa Moderna de Alumno (Cero Transparencia):**<br>• Reorganizar `#editorSesionActiva` en 4 tabs horizontales estilo stepper: 1. Guion ➔ 2. Asistente Lucy IA ➔ 3. Constructor eXeLearning ➔ 4. Vista Previa y Publicación.<br>• Corregir `#modalPreviewAlumno` eliminando transparencias con contenedor `.preview-panel` sólido y maqueta de navegador web institucional para el alumno. | 🟢 **COMPLETADA** |
| **Ola 9 (`build-585`)** | **Integración de Vista Previa Aprobada del Alumno (Estilo Elegante Apple/Google Classroom):**<br>• Estilos de navegador escolar, hero banner con gradiente, barra de progreso DUA, menú de 4 momentos espaciado y tarjetas de contenido.<br>• Renderizador dinámico con datos vivos de planeación, reproductor de audio con voz real, quiz interactivo y buzón de evidencias. | 🟢 **COMPLETADA** |
| **Ola 9.1 (`build-586`)** | **Desglose IA Resiliente (Fallback DUA) y Depuración de Toolbar:**<br>• Algoritmo pedagógico de respaldo DUA en `PlaneacionNEM.gs` y lectura de campos DOM en `AdminPlanJS_04.html`.<br>• Eliminación del botón modal redundante en cabecera superior de `AdminPlaneacion.html` y `Clase.html`. | 🟢 **COMPLETADA** |
| **Ola 10 (`build-587`)** | **Motor de Clases Interactivas de Extremo a Extremo (7 Contenidos de Aprendizaje NEM):**<br>• Nuevo catálogo formal de 7 contenidos de aprendizaje (`contenido_*`).<br>• Generación completa desde planeación: teoría DUA, modelado, ejercicios, autoevaluación con retroalimentación del error conceptual, lista de cotejo en 1ª persona y rúbrica analítica SEP de 4 niveles.<br>• Resiliencia backend DUA fallback y renderizado interactivo en `.browser-frame`. | 🟢 **COMPLETADA** |
| **Ola 11 (`build-588`)** | **Gestión Dual de Turnos (Matutino/Vespertino), Importación XML y Homologación de Docentes/Asignaturas:**<br>• Selector de turno reactivo en la barra ribbon (`☀️ Matutino` / `🌙 Vespertino`).<br>• Asistente modal de importación aSc con selector explícito de turno y preservación no destructiva.<br>• Editor/Homologador masivo de nombres de docentes y asignaturas sobre la hoja `Horarios`. | 🟢 **COMPLETADA** |
| **Ola 11.1 (`build-589`)** | **Homologación por Grado (Biología/Física/Química), Nombres Completos de Docentes, Turnos en Ribbon y Cierre Resiliente:**<br>• Conmutador de turno robusto con select-overlay idéntico a Grupo, Asignatura y Alumno.<br>• Cierre resiliente de modales con `✕`, fondo, `Escape` y `try...finally`.<br>• Homologación de asignaturas discriminando por grado (`Grado + Asignatura`) con sugerencias automáticas SEP.<br>• Captura de nombres formales completos de docentes y sincronización en `Horarios` y `MaestrosClase`.<br>• Reparación del filtro backend para visualizar fielmente el horario del Turno Vespertino importado. | 🟢 **COMPLETADA** |
| **Ola 11.2 (`build-591`)** | **Sustitución de Alumno por Docente en Horario y Asistente IA Inline:**<br>• Panel Lucy del Asistente IA integrado directamente en el lienzo del Paso 3 (eXeLearning) con toggle reactivo y botón iluminado.<br>• Sustitución del botón Alumno por el selector `👨‍🏫 Docente` en la cinta ribbon de Horarios con filtrado en tiempo real en la cuadrícula semanal.<br>• Soporte de filtro por docente en `horarioMaestroClase` en `ClaseLogica.gs`. | 🟢 **COMPLETADA** |
| **Ola 12 (`build-592`)** | **Constructor Maestro Unificado ST90 (Fusión eXeLearning + Elementor + Notion + H5P):**<br>• Reconexión del pipeline de la IA (`generarClaseInteractivaCompletaIA`) directo al lienzo de autor (Paso 3) con tarjetas editables.<br>• Editor enriquecido WYSIWYG (`contenteditable`, barra con `onmousedown=preventDefault` anti-desenfoque y guardado HTML).<br>• Catálogo unificado de 7 familias y 20+ bloques (Notion Callout, Timeline, Flashcards 3D con aceleración GPU, Tabla dinámica, Toggles).<br>• Incrustador H5P/Lumi responsivo con sandbox seguro y botón fallback a pestaña nueva anti-CSP.<br>• Video local sin consumo de nube (`URL.createObjectURL`), divisores contextuales `[+]` y Drawer móvil retráctil (<= 860px). | 🟢 **COMPLETADA** |
| **Ola 13 (`build-595`)** | **Suite de Edición Enriquecida Profesional (Modales ST90, Cero Prompt Nativo, Iconografía Vectorial SVG, Preservación de Selección/Range y Estructuración de Clase Sin Lucy):**<br>• Cero `prompt()` y `confirm()` nativos: Modales flotantes accesibles ST90 para insertar Tablas (filas/cols), Imágenes (URL/pie) y Videos (YouTube/MP4) con previsualización.<br>• Preservación estricta de posición de cursor con `Selection` y `Range` API al insertar elementos interactivos en `.campo-editor-rich`.<br>• Barra de herramientas WYSIWYG profesional con iconografía SVG vectorial en lugar de emojis planos.<br>• Modal de confirmación estilizado anti-duplicados al trasladar guion o generar clase con IA.<br>• Estructuración del Paso 2 libre del nombre de Lucy, con tarjetas de elección DUA e interactividad táctil fluida. | 🟢 **COMPLETADA** |
| **Ola 14 (`build-596`)** | **Suite Editorial TinyMCE 6 en Bloques del Constructor (Tablas Avanzadas, Tiradores de Imagen, Cuadros Didácticos DUA, Propiedades de Celdas y Color de Fondo de Página):**<br>• Integración de TinyMCE 6 Open Source vía CDN con carga segura (`baseURL`) en `Admin.html` y `Clase.html`.<br>• Manipulación completa de tablas (insertar/eliminar filas y columnas, combinar/dividir celdas, propiedades de celda con color de fondo y líneas).<br>• Tiradores gráficos de redimensionamiento de imágenes (8 puntos de arrastre para escalar ancho/alto visualmente).<br>• Eliminación fluida de cualquier elemento insertado (tablas, imágenes, cuadros) con `Delete`, `Backspace` o papelera en quickbar.<br>• Menú desplegable `📦 Cuadro didáctico` (Callout DUA verde, Recordatorio ámbar, Reto teal, Pregunta detonadora azul).<br>• Selector de color de fondo del lienzo y de la clase (`🎨 Fondo:`) con 7 tonos educativos DUA y selector `<input type="color">` personalizado, sincronizado con la Vista Previa del Alumno y guardado en la sesión. | 🟢 **COMPLETADA** |

---

## 5. Reparto de Tareas por Agente

### A. Ola Activa: Ola 13 (`build-595`) — Suite de Edición Enriquecida Profesional & Modales ST90
| Agente | Partitura Asignada | Buzón / Archivos |
| :--- | :--- | :--- |
| **DeepSeek** *(Diseño UI/UX & CSS)* | 1. **Modales Flotantes ST90:** Diseñar la maqueta visual y estilos de 4 modales (`#modalInsertarTablaST90`, `#modalInsertarImagenST90`, `#modalInsertarVideoST90`, `#modalConfirmarReemplazoBloquesST90`) con sombras suaves, esquinas redondeadas, overlay semi-transparente y botones con estados hover/focus institucionales.<br>2. **Iconografía Vectorial SVG en Toolbar:** Crear los iconos SVG de 14x14px para alineación (izquierda, centro, derecha, justificado), listas (viñetas, números), tabla, imagen, video, callout y resaltado.<br>3. **Tarjetas de Elección del Paso 2:** Estilizar `.opciones-construccion-grid`, `.opcion-construccion-card` y `.opcion-ia-card` con acentos en teal `#0d9488` y azul `#0284c7`, badge DUA y microinteracción táctil.<br>4. **Animación de Audio:** Estilo para el botón de guía con onda sonora animada `.reproduciendo-audio`.<br>5. Guardar en `ENTREGA_DEEPSEEK.md` y activar `node herramientas/centinela_buzon.js deepseek`. | `ENTREGA_DEEPSEEK.md`<br>`AdminPlaneacionCSS.html`<br>`ClaseCSS.html`<br>`ComunCSS.html` |
| **Cursor** *(Frontend & DOM)* | 1. **Preservación de Foco y Cursor (Range/Selection API):** Implementar `guardarRangoActivoEditor_()` y `restaurarRangoActivoEditor_()` para que al abrir cualquier modal de inserción no se pierda el punto exacto de inserción en el editor `.campo-editor-rich`.<br>2. **Controladores de Modales ST90:** Reemplazar las funciones `prompt()` e implementar la apertura, validación de inputs, previsualización en vivo (URL de imagen o YouTube embed) e inserción en el DOM mediante el rango restaurado.<br>3. **Modal Anti-Duplicados:** Sustituir `confirm()` por `#modalConfirmarReemplazoBloquesST90` al invocar `construirSecuenciaCompletaIA_()` o `volcarBloquesIAEnLienzo_()`.<br>4. **Controladores de Asistencia de Voz:** Conectar `window.speechSynthesis` a los botones `#btnAudioGuiaPaso2` y `#btnAudioGuiaConstructor` con control de reproducción y toggle de clase `.reproduciendo-audio`.<br>5. Guardar en `ENTREGA_CURSOR.md` y activar `node herramientas/centinela_buzon.js cursor`. | `ENTREGA_CURSOR.md`<br>`AyudaJS.html`<br>`ClaseJS_08.html`<br>`AdminPlanJS_06.html` |
| **Antigravity** *(Backend, Integración & Despliegue)* | 1. **Gobernanza y Auditoría:** Leer entregas de `ENTREGA_DEEPSEEK.md` y `ENTREGA_CURSOR.md`.<br>2. **Auditoría AST y Selectores:** Ejecutar `node herramientas/manifiesto.js` garantizando 0 errores y verificar correspondencia exacta de IDs.<br>3. **Despliegue Multi-Acceso:** Bump a `v436 / build-595` y despliegue oficial con `clasp` a los 5 accesos. | `00_Constantes.gs`<br>`CONTROL_CAMBIOS.md` |

### B. Olas Previas Concluidas:

### B. Ola Concluida: Ola 12 (`build-592`)

### B. En Cola Inmediata: Ola 11 (`build-588`)
| Agente | Partitura Asignada en Cola | Buzón / Archivos |
| :--- | :--- | :--- |
| **Cursor** *(Frontend & DOM)* | 1. **Ola 11 (`build-588`):** Inyectar botón de turno en barra ribbon de `AdminPlaneacion.html` y `Clase.html`. Conectar variable `turnoHorarioActivo` y recargar horario. Crear modal de homologación de docentes y asignaturas con inputs editables y guardado con `gsRun`. | `ENTREGA_CURSOR.md`<br>`AdminPlanJS_01.html`<br>`ClaseJS_03.html`<br>`AdminJS_05.html` |
| **DeepSeek** *(Diseño UI/UX & CSS)* | 1. **Ola 11 (`build-588`):** Diseñar botón ribbon de turno `.ribbon-btn-turno` (sol ambarino `#f59e0b` y luna índigo `#6366f1`). Diseñar tabla modal de homologación `.tabla-homologacion` con pestañas y badges de clases. | `ENTREGA_DEEPSEEK.md`<br>`AdminPlaneacionCSS.html`<br>`ClaseCSS.html`<br>`ComunCSS.html` |
| **Antigravity** *(Backend & Despliegue)* | 1. **Ola 11 (`build-588`):** Filtro de `Turno` en `horarioMaestroClase()` y `horarioSemanaDeGrupoClase_()`. Endpoints `obtenerCatalogoHomologacionHorario()` y `guardarHomologacionDocenteAsignatura()` con actualización masiva en hoja `Horarios`. | `ClaseLogica.gs`<br>`Asistencia.gs`<br>`00_Constantes.gs` |
