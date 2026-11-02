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

## 4. Plan Maestro de Implementación en 4 Olas (`build-568` a `build-571`)

| Ola / Build | Alcance Técnico Principal | Estado |
| :--- | :--- | :--- |
| **Ola 1 (`build-568`)** | **Etapas 3 y 4 + Membrete Configurable + Lista de Cotejo y Rúbrica Analítica en PDF Oficial NL:**<br>• Chips DUA de 1 clic en Etapa 3.<br>• Editor de Lista de Cotejo (`3–5` criterios) + generador de Rúbrica Analítica (4 niveles SEP) en Etapa 4.<br>• Modal `#modalConfigMembreteST90` (`PropertiesService`) con respaldo en escudos oficiales de Nuevo León.<br>• Fechas reales del horario docente en el PDF Oficial NL. | 🟢 **COMPLETADA** |
| **Ola 2 (`build-569`)** | **iDevice Encuesta Diagnóstica / Actividad Evaluable en Constructor de Clases:**<br>• Nuevo bloque `encuesta` en `.idevice-bar` (`AdminPlanJS_05.html` / `ClaseJS_07.html`).<br>• Modo A (`datos_previos` con resumen IA) y Modo B (`actividad_activa` vinculada a matrícula en `EntregasActividades`). | 🟢 **COMPLETADA** |
| **Ola 3 (`build-570`)** | **Constructor Dual Encuestas & Quizzes Integrado al iDevice:**<br>• Conmutador dual y modal de creación directa de encuesta/quiz desde la sesión.<br>• Puntos evaluativos, retroalimentación formativa y vinculación automática a la sesión. | 🟢 **ACTIVA (EN CURSO)** |
| **Ola 4 (`build-571`)** | **Multimedia, Paginación, Carga a Drive y Temporizador:**<br>• Imágenes/diagramas por reactivo, temporizador en vivo y subida de evidencias. | 🟢 **PROGRAMADA** |
| **Ola 3 (`build-570`)** | **Constructor Dual: Encuestas Diagnósticas & Quiz Evaluable Auto-Calificable:**<br>• Switch `.constructor-modo-switch` en `AdminEncuestas.html`.<br>• Metadatos en columna 11 (`extra` JSON) sin romper las 11 columnas de `Formulario`.<br>• Motor `calificarQuizAlumnoST90` con conversión automática a escala `5–10` / `0–10`. | 🟢 **PROGRAMADA** |
| **Ola 4 (`build-571`)** | **Capacidades Avanzadas Tipo Google Forms (Sprints 1–3):**<br>• **Sprint 1:** Imágenes/diagramas por reactivo (`figure.reactivo-media`) y feedback diferenciado.<br>• **Sprint 2:** Subida de archivos a Google Drive (`subirEvidenciaFormulario`) y secciones paginadas.<br>• **Sprint 3:** Temporizador con auto-envío (`sessionStorage`) y barajado Fisher-Yates. | 🟢 **PROGRAMADA** |

---

## 5. Reparto de Tareas por Agente (Ejecución Inmediata)

| Agente | Partitura Asignada | Buzón / Archivos |
| :--- | :--- | :--- |
| **Cursor** *(Frontend & DOM)* | 1. **Ola 1 (`build-568`):** Implementar `abrirConfigMembreteNEM()`, `guardarConfigMembreteNEM()`, `insertarAjusteDUARapido()`, `pintarTablaCriteriosCotejoDOM_()`, `generarCriteriosDesdePDANIA()`, `generarRubricaDesdeCriterios_()` y conexión con `_generarHtmlDocumentoPlanoDidacticoNL_()`.<br>2. **Ola 2 (`build-569`):** Implementar `insertariDeviceSesion_('encuesta')`, `conmutarModoEncuestaiDevice_()`, `cargarResumenEncuestaiDevice_()` y serialización en `leerTodosLosiDevicesDeSesion_()`.<br>3. **Ola 3 (`build-570`):** Implementar `conmutarModoConstructor(modo)`, `recalcularPuntosTotalesQuiz()` y serialización de `.caja-ajustes-quiz` en `extra`.<br>4. **Ola 4 (`build-571`):** Preparar controladores de multimedia por reactivo, paginación y temporizador.<br>5. Ejecutar `node herramientas/centinela_buzon.js cursor` al guardar en `ENTREGA_CURSOR.md`. | `ENTREGA_CURSOR.md`<br>`AdminPlanJS_04.html`<br>`AdminPlanJS_05.html`<br>`ClaseJS_06.html`<br>`ClaseJS_07.html`<br>`AyudaJS.html`<br>`AdminEncJS_*.html` |
| **DeepSeek** *(Diseño UI/UX & CSS)* | 1. **Ola 1 (`build-568`):** Diseñar CSS de `.nem-chip-dua-rapido`, `#cajaRubricaCotejoNEM`, `.nem-tabla-cotejo-edit`, `#modalConfigMembreteST90` y tabla de Rúbrica Analítica en `@media print`.<br>2. **Ola 2 (`build-569`):** Diseñar CSS de `.idevice-bloque[data-tipo="encuesta"]`, `.panel-modo-datos` y `.panel-modo-actividad`.<br>3. **Ola 3 (`build-570`):** Diseñar CSS de `.constructor-modo-switch`, `#barraConfigQuizGlobal` y `.caja-ajustes-quiz`.<br>4. **Ola 4 (`build-571`):** Diseñar CSS de `figure.reactivo-media` (con lightbox), `.barra-progreso-nem` y `#barraTemporizadorQuiz` (`<= 2 min` alerta ámbar/roja).<br>5. Ejecutar `node herramientas/centinela_buzon.js deepseek` al guardar en `ENTREGA_DEEPSEEK.md`. | `ENTREGA_DEEPSEEK.md`<br>`AdminPlaneacionCSS.html`<br>`ComunCSS.html`<br>`AdminCSS.html` |
| **Antigravity** *(Backend, Integración & Despliegue)* | 1. **Ola 1 (`build-568`):** Implementar `obtenerMembreteInstitucionalNEM()`, `guardarMembreteInstitucionalNEM()` y persistencia de `criteriosEvaluacion` / `rubricaAnalitica` + fechas reales del horario en `PlaneacionNEM.gs`.<br>2. **Ola 2 (`build-569`):** Implementar `obtenerCatalogoEncuestasParaConstructor()` y `registrarEntregaEncuestaAlumno()` en `15_DirectorioEncuentas.gs` / `PlaneacionNEM.gs`.<br>3. **Ola 3 (`build-570`):** Implementar `calificarQuizAlumnoST90()` en `Encuestas.gs`.<br>4. **Ola 4 (`build-571`):** Implementar `subirEvidenciaFormulario()` en `Encuestas.gs`.<br>5. Auditar buzones, validar AST con `node herramientas/manifiesto.js` y desplegar a los 5 endpoints de `clasp` y GitHub. | `PlaneacionNEM.gs`<br>`15_DirectorioEncuentas.gs`<br>`Encuestas.gs`<br>`CONTROL_CAMBIOS.md` |
