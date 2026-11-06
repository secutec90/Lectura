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
> *"Actúas como Desarrollador Frontend JS del proyecto Suite Escolar ST90. Tu partitura está definida en `ESTADO_COORDINACION.md` y `ENTREGA_CURSOR.md`. Solo tocas fragmentos JS del DOM y llamadas a `google.script.run`. Respeta estrictamente los IDs definidos por Antigravity y las clases de DeepSeek. Tienes prohibido hacer commit/push o alterar el backend. Escribe y guarda tu entrega completa y controladores en el archivo `ENTREGA_CURSOR.md` para que Antigravity la audite, e inmediatamente después ejecuta `node herramientas/centinela_buzon.js cursor` para revisar cada 60 segundos si Antigravity cargó una nueva tarea."*

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
| **Ola 17 (`build-602`)** | **Constructor Tecno-Pedagógico Fusión: Divi + Elementor + Notion + eXeLearning:**<br>• Control de flujo: botón `(-)` de eliminación con buffer de deshacer y separador continuo `(+)` entre tarjetas.<br>• Tablas divididas multicelda tipo Excel con `<colgroup>` porcentual y formato autónomo por celda.<br>• Cuadros de forma y texto estilo Word (`word_shape`) con metadatos pedagógicos DUA.<br>• Bloque GeoGebra funcional con parámetros reales (`material_id`, ancho, alto e iframe oficial).<br>• Backend Google Drive para almacenamiento de medios locales (`guardarMedioClaseEnDrive`).<br>• Lápiz de renombrado `✏️` por página y maquetación frontal a la derecha. | 🟢 **COMPLETADA** |
| **Ola 17 (`build-603+`)** | **Arquitectura Visual DIVI Real + Bubble Toolbar Contextual Notion + Menú Lateral Colapsable:**<br>• Erradicación definitiva de la barra fija horizontal sobre el lienzo.<br>• Pastilla flotante contextual (*Bubble Toolbar* Notion/Medium) activada por `selectionchange` sobre áreas editables.<br>• Separación pura de 4 capas: Sección (azul `#0284c7`), Fila (verde `#10b981`), Columna Dropzone con foco activo (`.active-target`) y Módulo curricular.<br>• Botón circular verde `(+)` entre filas para selector de columnas (`col-1`, `col-2`, `col-2-70-30`, `col-3`).<br>• Botón `[+ Añadir Módulo]` dentro de cada columna conectado al Catálogo Lateral de las 7 familias curriculares con fallback inteligente.<br>• Menú lateral colapsable / expandible (`alternarSidebarExe_`) para modo concentración / lienzo 100% de ancho.<br>• Controles de reordenamiento vertical (▲ / ▼) y ✕ eliminar con buffer de deshacer. | 🟢 **COMPLETADA (INTEGRADA EN BUILD-603)** |
| **Ola 17 (`build-604`)** | **Erradicación del Popup Residual de Divisores y Garantía de Selector de Columnas:**<br>• Eliminación de la llamada a `previo()` en `envolverRepintadoDivi_()` y purga de `.block-inserter-row`.<br>• Forzado de selector exclusivo de columnas (`.divi-columns-picker`) en el divisor verde entre filas. | 🟢 **COMPLETADA (DESPLEGADA @596)** |
| **Ola 17 (`build-605`)** | **Editor de Texto Compacto de Solo Iconos + Reubicación de Controles + iDevices con Formato Real:**<br>• Reubicación del botón `[ ◀ ]` en la cabecera del menú lateral (`.arbol-titulo-fila`) y botón flotante `[ ▶ Contenidos ]` en el lienzo al colapsar.<br>• Purgado de `[ ◀ ]` fuera de las acciones del banner (`.pagina-banner-acciones`).<br>• Rediseño de `htmlEditorEnriquecido_` a una barra compacta de una sola fila de **solo iconos con tooltips** (`title="..."`), erradicando los menús textuales y botones con texto largo.<br>• Activación de interfaces interactivas especializadas por iDevice (`vf` Verdadero/Falso con opciones V/F interactivas y retroalimentación DUA, `tabla_notion` con cuadrícula estructurada y botones `+ Fila` / `+ Col`, `word_shape` con paleta de colores, `geogebra` con cargador dinámico).<br>• Asignación del editor de texto enriquecido exclusivamente a módulos de texto extenso (`texto_dua`, `lectura`, `objetivos`). | 🟢 **COMPLETADA (DESPLEGADA @597)** |

---

## 5. Reparto de Tareas por Agente (Ejecución Inmediata - Ola 17 build-603+)

| Agente | Partitura Asignada | Buzón / Archivos |
| :--- | :--- | :--- |
| **Cursor** *(Frontend & DOM)* | 1. **Ola 17 (`build-603+`):** Erradicar la barra horizontal fija superior del lienzo. Implementar el motor de pastilla flotante contextual (`#bubbleToolbar`) activada por `selectionchange` sobre `.rich-editable-area` con posicionamiento relativo a `#lienzoExeActivo`. Implementar el botón verde `(+)` entre filas que despliega `.divi-columns-picker` (`col-1`, `col-2`, `col-2-70-30`, `col-3`). Conectar cada columna dropzone (`.active-target`) con los clics de las 7 familias del catálogo lateral (`insertarModuloEnColumnaActiva_`). Desarrollar la función `alternarSidebarExe_()` para colapsar/expandir el panel lateral y los controles de reordenamiento vertical (▲ / ▼) con `insertBefore`.<br>2. Mantener centinela activo: `node herramientas/centinela_buzon.js cursor`. | `ENTREGA_CURSOR.md`<br>`AyudaJS.html`<br>`ClaseJS_08.html`<br>`AdminPlanJS_06.html` |
| **DeepSeek** *(Diseño UI/UX & CSS)* | 1. **Ola 17 (`build-603+`):** Maquetar el colapso del menú lateral (`.app-workspace.sidebar-colapsado .sidebar-exe` a `width: 0`, y expansión del canvas al `100%`) con botón de alternancia `.btn-toggle-sidebar-exe`. Diseñar las 4 capas DIVI: Sección azul (`.divi-section`, `#0284c7`), Fila verde (`.divi-row`, `#10b981`), Columna dropzone (`.divi-column`, borde punteado y resalte activo `.active-target` con anillo teal), y Módulo. Diseñar el botón verde `(+)` (`.btn-plus-green`) con popover selector de columnas `.divi-columns-picker`. Diseñar la pastilla flotante oscura `#bubbleToolbar` (`.floating-bubble-toolbar`) con botones compactos y controles por bloque (▲ / ▼ / ✕).<br>2. Mantener centinela activo: `node herramientas/centinela_buzon.js deepseek`. | `ENTREGA_DEEPSEEK.md`<br>`AdminPlaneacionCSS.html`<br>`ClaseCSS.html`<br>`ComunCSS.html` |
| **Antigravity** *(Backend, Auditoría & Despliegue)* | 1. **Ola 17 (`build-603+`):** Supervisar y auditar las entregas de DeepSeek y Cursor en sus buzones. Validar consistencia con `node herramientas/manifiesto.js` (0 errores). Sincronizar e integrar el código en la suite y el simulador, actualizar constantes a `v440 · build-603`, registrar en `CONTROL_CAMBIOS.md` y desplegar a GitHub y los 6 endpoints de Google Apps Script. | `00_Constantes.gs`<br>`CONTROL_CAMBIOS.md`<br>`simulador_exelearning.html` |
