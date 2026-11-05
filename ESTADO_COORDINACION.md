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
| **Ola 15 (`build-597`)** | **Restauración de Suite Editorial Nativa ST90 (Sin iframes externos ni TinyMCE CDN):**<br>• Solución a bloqueo CSP en iframe Apps Script.<br>• Restauración de `.campo-editor-rich` con tablas, selector de cajas didácticas DUA, y redimensionamiento de imágenes directo. | 🟢 **COMPLETADA** |
| **Ola 16 (`build-598`)** | **Suite Editorial Nativa Completa WYSIWYG Profesional ST90 (Inspirada en TinyMCE 6 / Office / Imagen 2):**<br>• Menubar superior con menús desplegables (`Archivo`, `Editar`, `Insertar`, `Formato`, `Tabla`, `Herramientas`).<br>• Tipografías (selectores de familia y tamaño de fuente 12px a 24px) y botones Deshacer/Rehacer.<br>• Edición completa de tablas (insertar/eliminar filas y columnas, colorear fondo de celdas, bordes y eliminar tabla).<br>• Manejador de imágenes con redimensionamiento rápido (25%, 50%, 75%, 100%) y alineación.<br>• Cuadros didácticos DUA (Callout DUA, Nota, Reto, Pregunta, Comparativo, Rúbrica) y eliminación limpia de cualquier elemento (`🗑️ Quitar elemento`).<br>• Selector de color de fondo del lienzo y de la página con sincronización fiel a la Vista Previa del Alumno. | 🟡 **EN PROCESO** |

---

## 5. Reparto de Tareas por Agente

### A. Ola Activa: Ola 16 (`build-598`) — Suite Editorial Nativa Completa WYSIWYG Profesional ST90 (Estilo TinyMCE 6 / Office / Imagen 2)
| Agente | Partitura Asignada | Buzón / Archivos |
| :--- | :--- | :--- |
| **DeepSeek** *(Diseño UI/UX & CSS)* | 1. **Skin y Maquetación de la Suite Editorial (.editor-enriquecido-wrap):** Diseñar la apariencia inspirada en la Imagen 2 de TinyMCE: menubar superior (`Archivo`, `Editar`, `Insertar`, `Formato`, `Tabla`, `Herramientas`), toolbars organizadas en 2 filas con botones planos ST90, hover `#ccfbf1`, botón activo en teal `#0d9488`, dropdowns estilizados para fuentes y tamaños.<br>2. **Tablas Editoriales y Celdas:** Cabeceras con gradiente teal `#0f766e`, bordes limpios `#cbd5e1`, celdas con soporte visual de color de fondo y micro-botones de filas/columnas.<br>3. **Manejadores Visuales de Imágenes:** Borde activo al seleccionar imagen y barra flotante de opciones (25%, 50%, 75%, 100%).<br>4. **Cajas Didácticas DUA y Selector de Fondo:** Estilos para Callout DUA, Nota, Reto, Pregunta y el selector de fondo del lienzo.<br>5. Guardar en `ENTREGA_DEEPSEEK.md` y mantener centinela activo (`node herramientas/centinela_buzon.js deepseek`). | `ENTREGA_DEEPSEEK.md`<br>`ComunCSS.html`<br>`AdminPlaneacionCSS.html`<br>`ClaseCSS.html` |
| **Cursor** *(Frontend & DOM)* | 1. **Controladores de Formato y Tipografía:** Selectores de Familia tipográfica y Tamaño de fuente (12px–24px), botones Deshacer (`undo`), Rehacer (`redo`), Limpiar formato (`removeFormat`), Color de texto y Color de fondo.<br>2. **Edición Completa de Tablas:** Insertar tabla (filas x cols), agregar/eliminar filas y columnas, colorear fondo de celda seleccionada, bordes de celda/tabla, y eliminar tabla completa.<br>3. **Dimensionamiento y Alineación de Imágenes:** Opciones rápidas de tamaño (25%, 50%, 75%, 100%) y alineación.<br>4. **Inserción de Cajas Didácticas DUA:** Callout DUA, Nota, Reto, Pregunta, Cuadro comparativo y Rúbrica.<br>5. **Eliminación Segura de Cualquier Elemento (`🗑️ Quitar elemento`):** Detectar si el foco está en tabla, imagen, video o recuadro didáctico y removerlo limpiamente.<br>6. **Sincronización con Vista Previa:** Conectar `capturarEstadoExe_()`, `irAPasoSesion_(4)` y `#modalPreviewAlumno` preservando HTML y color de fondo en la sesión.<br>7. Guardar en `ENTREGA_CURSOR.md` y mantener centinela activo (`node herramientas/centinela_buzon.js cursor --intervalo=60 --max-ciclos=0`). | `ENTREGA_CURSOR.md`<br>`AyudaJS.html`<br>`ClaseJS_08.html`<br>`AdminPlanJS_06.html` |
| **Antigravity** *(Backend, Integración & Despliegue)* | 1. **Gobernanza y Auditoría:** Leer entregas de `ENTREGA_DEEPSEEK.md` y `ENTREGA_CURSOR.md`.<br>2. **Auditoría AST:** Ejecutar `node herramientas/manifiesto.js` garantizando 0 errores de sintaxis y coherencia de selectores.<br>3. **Despliegue Multi-Acceso:** Incrementar a `v439 / build-598`, `git commit / push` y `clasp push / deploy` a los 5 accesos oficiales. | `00_Constantes.gs`<br>`CONTROL_CAMBIOS.md` |

### B. Olas Previas Concluidas:
- **Ola 13 (`build-595`):** Suite de Edición Enriquecida, Modales ST90 y Paso 2 sin Lucy.
- **Ola 14 (`build-596`):** Suite Editorial TinyMCE 6 en Bloques del Constructor, Tablas Avanzadas, Tiradores de Imagen y Color de Fondo de Página.

### B. Ola Concluida: Ola 12 (`build-592`)

### B. En Cola Inmediata: Ola 11 (`build-588`)
| Agente | Partitura Asignada en Cola | Buzón / Archivos |
| :--- | :--- | :--- |
| **Cursor** *(Frontend & DOM)* | 1. **Ola 11 (`build-588`):** Inyectar botón de turno en barra ribbon de `AdminPlaneacion.html` y `Clase.html`. Conectar variable `turnoHorarioActivo` y recargar horario. Crear modal de homologación de docentes y asignaturas con inputs editables y guardado con `gsRun`. | `ENTREGA_CURSOR.md`<br>`AdminPlanJS_01.html`<br>`ClaseJS_03.html`<br>`AdminJS_05.html` |
| **DeepSeek** *(Diseño UI/UX & CSS)* | 1. **Ola 11 (`build-588`):** Diseñar botón ribbon de turno `.ribbon-btn-turno` (sol ambarino `#f59e0b` y luna índigo `#6366f1`). Diseñar tabla modal de homologación `.tabla-homologacion` con pestañas y badges de clases. | `ENTREGA_DEEPSEEK.md`<br>`AdminPlaneacionCSS.html`<br>`ClaseCSS.html`<br>`ComunCSS.html` |
| **Antigravity** *(Backend & Despliegue)* | 1. **Ola 11 (`build-588`):** Filtro de `Turno` en `horarioMaestroClase()` y `horarioSemanaDeGrupoClase_()`. Endpoints `obtenerCatalogoHomologacionHorario()` y `guardarHomologacionDocenteAsignatura()` con actualización masiva en hoja `Horarios`. | `ClaseLogica.gs`<br>`Asistencia.gs`<br>`00_Constantes.gs` |
