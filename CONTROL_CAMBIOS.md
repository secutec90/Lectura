# Control de cambios — Lectura ST90

Pega aquí un bloque por cada cambio cerrado. La fecha es la de America/Monterrey (`AAAA-MM-DD`). La bitácora narrativa sigue en `avances.md`.

### 🛠️ [2026-11-08] - [Ola 19: Consolidación de Arquitectura Maestra Integral V609, Catálogo Lateral en Cuadrícula 2 Columnas Estilo GrapesJS (Drag & Drop), Puente Divi al Portal del Alumno, Motor Evaluativo SEP (5-10) y Sincronización Google Calendar en build-609]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(ola19): catalogo lateral en cuadricula 2 columnas estilo GrapesJS con drag and drop, puente divi en portal alumno y motor evaluativo SEP en build-609`
- **Cambios Realizados:**
  - **Catálogo Lateral en Cuadrícula de 2 Columnas Estilo GrapesJS Block Manager (`AdminPlaneacionCSS.html`, `ClaseCSS.html`, `AyudaJS.html`):**
    - Transformado el cuerpo de los acordeones (`.cat-group-body` / `.cat-items`) en una cuadrícula compacta de 2 columnas (`grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; padding: 10px; background: #f8fafc;`).
    - Rediseñadas las tarjetas de módulo (`.modulo-card-lateral`) en formato vertical compacto (`min-height: 76px`, icono de `22px` centrado, título a 2 líneas de `11px` y borde superior temático por familia curricular `.tema-notion`, `.tema-eval`, `.tema-h5p`, `.tema-ingles`, `.tema-juegos`, `.tema-tecno`, `.tema-ciencias`).
    - Habilitada toda la superficie de la tarjeta para inserción directa en `.divi-column.active-target` con validación accesible (toast si no hay columna seleccionada) y soporte completo **Drag & Drop** (`draggable="true"`, `dragstart`, `dragover`, `drop` con resaltado `.drag-over-target`).
  - **Auditoría y Cierre de Deuda Técnica Documental (`ARQUITECTURA_MAESTRA_INTEGRAL_ST90_V609.md`, `ESTADO_COORDINACION.md`):**
    - Incorporación formal de los acuerdos de `Plan_Implementacion_Constructor_Avanzado_ST90.md` (Fases 1, 2 y 3), `ENTREGA_CONSTRUCTOR_ENCUESTAS_BUILD_569.md` (Modo Dual de Encuestas) y `ENTREGA_CONSTRUCTOR_DUAL_ENCUESTA_QUIZ_BUILD_570.md` (Motor Evaluativo Híbrido).
  - **Motor Evaluativo SEP (5.0 a 10.0) y Asiento en Base de Datos (`PlaneacionNEM.gs`, `Encuestas.gs`, `AyudaJS.html`):**
    - Programado el endpoint `calificarQuizAlumnoST90(tokenOrDatos, optPayload)` en `PlaneacionNEM.gs` apoyado en `_calificarQuizFormularioBaseST90_` (`Encuestas.gs`), normalizando la calificación a la **escala oficial SEP (5.0 a 10.0)**, generando retroalimentación diferenciada (acierto vs. error) y registrando la calificación tanto en `Respuestas` como en `EntregasActividades` vinculada a la matrícula del alumno.
    - Conectada `calificarQuiziDeviceVivo_` (`AyudaJS.html`) para invocar asíncronamente a `calificarQuizAlumnoST90()`.
  - **Sincronización Real con Google Calendar (`PlaneacionNEM.gs`):**
    - Actualizada `calendarizarSesionNEM(token, idSesion, idHorario, fecha)` para invocar `CalendarApp.getDefaultCalendar().createEvent(...)` con nomenclatura oficial `[${gradoGrupo}] ${asignatura}: ${nombreProyecto} / Sesión ${numSesion} (${duracionMin} min)`, detección de bloques dobles contiguos (80 min), descripción con desglose de los 4 momentos pedagógicos, enlace directo al portal del alumno (`?p=alumno&sec=${idH}&s=${numSesion}`) y persistencia del `eventId` en `SesionesNEM`.
  - **Puente de Retículas Divi hacia el Portal Real del Alumno (`ClaseLogica.gs`, `ClaseJS_07.html`, `AdminPlanJS_05.html`, `ClaseCSS.html`, `AdminPlaneacionCSS.html`):**
    - Enriquecida `mapaContenidosClase_()` en `ClaseLogica.gs` para adjuntar `guionDocenteJSON` desde `SesionesNEM` a las clases publicadas.
    - Actualizada `renderizarTextoClaseDUA(cont)` en `ClaseJS_07.html` y `AdminPlanJS_05.html` para parsear `GuionDocenteJSON` y renderizar las filas `.divi-row` y columnas `.divi-column` en el portal del estudiante, conservando `GuionEstudianteAccesible` para lectura en voz alta DUA.
  - **Desacoplamiento del Popover de Columnas (`AyudaJS.html`, `AdminPlaneacionCSS.html`, `ClaseCSS.html`):**
    - Montaje directo de `.divi-columns-picker.columns-popover` en `document.body` con `position: fixed; z-index: 99999;` y coordenadas dinámicas calculadas vía `getBoundingClientRect()`.
  - **Conexión del Modo Dual en iDevice Encuesta (`AyudaJS.html`):**
    - `completarIDeviceEncuesta_` dispara automáticamente `cargarCatalogoEnSelectiDevice_` al insertar la tarjeta y proyecta `ResumenIA` en Modo Datos Previos o configura ponderación SEP (5–10) en Modo Actividad Evaluable.
  - **Validación Estricta del Manifiesto:**
    - Verificación con `node herramientas/manifiesto.js` confirmando **79 documentos exactos** y `0` documentos sin parsear.
- **Archivos Afectados:** `ARQUITECTURA_MAESTRA_INTEGRAL_ST90_V609.md`, `PlaneacionNEM.gs`, `Encuestas.gs`, `ClaseLogica.gs`, `AyudaJS.html`, `ClaseJS_07.html`, `AdminPlanJS_05.html`, `AdminPlaneacionCSS.html`, `ClaseCSS.html`, `ESTADO_COORDINACION.md`, `ENTREGA_CURSOR.md`, `ENTREGA_DEEPSEEK.md`, `CONTROL_CAMBIOS.md`.

### 🛠️ [2026-11-07] - [Ola 19: Corrección de Desbordamiento en Grillas Divi, Persistencia Estructurada y Renderizado Fiel en Vista Alumno en build-609]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(ola19): correccion desbordamiento columnas col-3, persistencia estructurada filas/columnas y renderizado fiel en vista previa alumno en build-609`
- **Cambios Realizados:**
  - **Corrección de Desbordamiento en Constructor y Reglas CSS Grid (`AdminPlaneacionCSS.html`, `ClaseCSS.html`):**
    - Ajustadas las retículas Divi (`.divi-row.col-3`, `.grid-col-3`) utilizando `repeat(3, minmax(0, 1fr))` y configurado `minmax(0, 1fr)` en todas las variantes de columna para impedir que tablas o módulos ensanchen la celda.
    - Agregado `min-width: 0; box-sizing: border-box;` a `.divi-column` y `overflow-x: auto; max-width: 100%;` a `.divi-module`, `.divi-column .idevice-card` y contenedores de tablas (`.notion-table-wrap`, `.tabla-notion`, `.excel-layout-table`).
    - Añadidos estilos específicos para el frame de Vista Previa de Alumno (`.browser-frame .divi-row`, `.divi-columns-grid`, `.divi-column`) sin marcos verdes de edición pero preservando las columnas CSS Grid y la responsividad a 1 columna en pantallas ≤ 860px.
  - **Persistencia Estructurada de Filas y Columnas (`AyudaJS.html`):**
    - Serialización en `capturarEstadoExe_`: ahora guarda fielmente la jerarquía `{ tipo: 'fila', layout: 'col-3', columnas: [[bloque1], [bloque2], [bloque3]] }` en el JSON de la planeación, preservando compatibilidad con tarjetas sueltas.
    - Deserialización en `deserializarIDevicesSesion_`: recrea las filas Divi mediante `insertarFilaDivi_` inyectando cada bloque en su respectiva columna con `colocarModuloEnColumnaActiva_`.
    - Asignación de `data-pagina-id` a cada fila Divi y filtrado estricto por página activa en `aplicarFiltroPaginaExe_`.
  - **Renderizado Fiel en Vista Previa del Alumno (`AyudaJS.html`):**
    - Adaptado `armarMaquetaAlumno_` y `anexarLienzoVivoPreview_` para renderizar contenedores de fila (`.divi-row {layout}`) con sus cuadrículas (`.divi-columns-grid`) y columnas (`.divi-column`), erradicando el apilamiento plano 100% y reflejando las columnas activas.
    - Añadido renderizado enriquecido de tablas y cuadros Word dentro de `tarjetaPreviewBloque_` con clonación protegida y contenedor scroll horizontal.
  - **Validación del Manifiesto:**
    - Verificación con `node herramientas/manifiesto.js` confirmando 79 documentos y 0 errores sintácticos.
- **Archivos Afectados:** `AdminPlaneacionCSS.html`, `ClaseCSS.html`, `AyudaJS.html`, `00_Constantes.gs`, `ESTADO_COORDINACION.md`, `CONTROL_CAMBIOS.md`.

### 🛠️ [2026-11-07] - [Ola 18: Consolidación de Retícula DIVI, Selector Gráfico de Columnas y Dropzone Activa en build-608]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(ola18): consolidacion reticula divi, selector de columnas y dropzone activa en build-608`
- **Cambios Realizados:**
  - **Saneamiento Sintáctico y Unificación CSS (`AdminPlaneacionCSS.html`):**
    - Reubicadas las reglas CSS de retículas (`.divi-row.col-1`, `.col-2`, `.col-2-70-30`, `.col-3`), popovers (`.columns-popover`) y tarjetas de opciones (`.col-card-option`) dentro del bloque `<style>`, eliminando el código huérfano fuera de etiquetas.
    - Compatibilizadas las clases de grilla (`grid-col-*` y `col-*`) para visualización responsive en escritorio y móviles.
  - **Limpieza de Scripts y Conexión de Columnas (`AyudaJS.html`):**
    - Erradicado el código huérfano fuera de `</script>` y unificado el documento en un único bloque de script normativo (`#script0`).
    - Conectado el botón circular verde `(+)` (`.btn-plus-green`) para desplegar el selector de columnas con vista previa gráfica (`preview-mini`).
    - Generación efectiva de las columnas solicitadas (`MAPA_COLUMNAS_`) al elegir distribución, marcando automáticamente la primera columna como `.active-target`.
    - Enlace de inserción modular hacia `.divi-column.active-target` (`window.insertarEnColumnaActiva`), depositando los módulos seleccionados de las 7 familias antes del botón de añadir interior.
  - **Restauración y Actualización de Contratos (`ESTADO_COORDINACION.md`):**
    - Restaurado el contrato de gobernanza multi-agente, la tabla de responsabilidades y la bitácora de olas, integrando formalmente la Ola 18 (`build-608`).
  - **Validación y Versión:**
    - Verificada la integridad estructural con `node herramientas/manifiesto.js` regresando estrictamente a 79 documentos.
    - Incrementada la versión en `00_Constantes.gs` a `v440 · build-608`.
- **Archivos Afectados:** `AdminPlaneacionCSS.html`, `AyudaJS.html`, `ESTADO_COORDINACION.md`, `00_Constantes.gs`, `CONTROL_CAMBIOS.md`.

### 🛠️ [2026-11-06] - [Ola 17: Unificación de Cabecera en Una Sola Fila, Erradicación de 'eXeLearning', Corrección de Persistencia de Borrado y Sincronización de los 4 Momentos en build-607]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(ola17): unificacion de cabecera en una fila, sincronizacion de los 4 momentos pedagógicos y correccion de persistencia de borrado en build-607`
- **Cambios Realizados:**
  - **Cabecera Unificada y Selector de Sesiones en Una Fila (`AdminPlaneacion.html`, `AdminPlaneacionCSS.html`, `AdminPlanJS_05.html`):**
    - Unificadas las 4 filas verticales previas en una sola cabecera compacta `.nem-header-planeacion-unificada`.
    - Selector de sesiones rediseñado a pastillas iconográficas compactas `S1`, `S2`, `S3` (`.nem-btn-icon-sesion`) con tooltip de duración y estado.
    - Barra de herramientas única (`.nem-toolbar-iconos-fila`) integrando acciones de sesión activa (`📚` SEP, `📅` Calendarizar, `💾` Guardar) y de planeación (`📄` PDF, `✨` IA, `✓` Aprobar, `←` Volver) separadas por divisores verticales `.toolbar-vsep`.
  - **Erradicación de "eXeLearning" y Numeración de Etapas (`AdminPlaneacion.html`, `Clase.html`):**
    - Eliminado el término "eXeLearning" de los nombres visibles al usuario, estableciendo "Constructor de Clase".
    - Corregida la etiqueta del constructor que decía "Paso 2" a "Paso 3: Clase Interactiva (Lo que experimentará el alumno)" alineada con la pestaña 3 del stepper.
  - **Corrección de Persistencia de Bloques al Eliminar (`AyudaJS.html`, `AdminPlanJS_06.html`):**
    - Erradicada la regeneración automática incondicional en `irAPasoSesion_(3)` que recreaba bloques con IA cada vez que la cuenta de tarjetas llegaba a 0.
    - Exportadas `window.volcarIDevicesEnGuion_`, `window.marcarIDevicesTocados_` y `window.rehidratarIDevicesDesdeGuion_` al objeto global.
    - Enlazada `eliminarBloqueTarjeta_` para ejecutar el volcado en `sesGuionEstudiante` inmediatamente, erradicando la reaparición accidental de bloques borrados.
  - **Sincronización Total de los 4 Momentos entre Árbol y Vista Previa (`AyudaJS.html`):**
    - Árbol lateral de autor configurado con las 4 páginas pedagógicas por defecto (`⏱️ 1. Apertura`, `📖 2. Desarrollo`, `✍️ 3. Actividad`, `🎯 4. Cierre`), reflejando la misma estructura de la Vista Previa del Alumno.
    - `insertarPasoSecuenciaIA_` asocia cada paso pedagógico al ID de su momento correspondiente.
    - `armarMaquetaAlumno_` en Vista Previa distribuye los bloques directamente a sus paneles `p1, p2, p3, p4` evaluando `data-pagina-id`, sin omitir bloques por estado de visibilidad del editor.
  - **Versión:**
    - Actualizado `00_Constantes.gs` a `v440 · build-607`.
- **Archivos Afectados:** `AdminPlaneacion.html`, `AdminPlaneacionCSS.html`, `AdminPlanJS_05.html`, `AdminPlanJS_06.html`, `AyudaJS.html`, `Clase.html`, `00_Constantes.gs`, `CONTROL_CAMBIOS.md`, `ESTADO_COORDINACION.md`.

### 🛠️ [2026-11-05] - [Ola 17: Iconificación de Cabeceras, Erradicación de Controles de Lienzo y Auto-Adopción Divi de Bloques en build-606]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(ola17): iconificacion de cabeceras en una sola fila, erradicacion de controles en banner de lienzo y auto-adopcion divi de bloques en build-606`
- **Cambios Realizados:**
  - **Erradicación de Controles Residuales en Banner de Lienzo (`AyudaJS.html`):**
    - Erradicado el bloque de controles `.pagina-banner-acciones` (`[ 🎨 Fondo ]`, `❓ Ayuda`, `🔊 Escuchar guía`) de la cabecera de la página activa en el lienzo de autor, dejando una barra limpia de solo título.
  - **Iconificación de Acciones de Cabecera en Una Sola Fila (`AdminPlaneacion.html`, `AdminPlaneacionCSS.html`, `AdminPlanJS_04.html`):**
    - Convertidos los botones de acción del gestor de planeación y editor de sesión a botones compactos de solo iconos con tooltips nativos (`title="..."`) y accesibilidad (`aria-label="..."`):
      - `📄` Descargar Formato Oficial PDF
      - `✨` Desglosar con IA (40 min DUA) — con estado de carga `⏳` y restauración automática
      - `✓` Aprobar Planeación
      - `←` Volver a lista de planeaciones
      - `📚` Vincular Libro SEP Fase 6
      - `📅` Calendarizar en Horario
      - `💾` Guardar Sesión
    - Maquetada la clase `.nem-btn-icon-action` (36x36px, esquinas redondeadas, elevación sutil y variantes primary/success/soft-blue).
  - **Auto-Adopción Divi y Sincronización Guion ➔ Constructor (`AyudaJS.html`, `AdminPlanJS_06.html`):**
    - Función `adoptarTarjetasEnDivi_()`: Adopta automáticamente cualquier bloque `.idevice-card` no anidado o deserializado como hijo directo de `#contenedorIDevicesDinamicos`, garantizando su inserción en columnas Divi con marco azul/verde y controles de reordenamiento y borrado.
    - Llamada automática en `irAPasoSesion_(3)`: al entrar al constructor, si la página no tiene bloques pero el guion ya tiene momentos redactados (Apertura/Desarrollo), traslada automáticamente la secuencia completa a bloques Divi (`construirSecuenciaCompletaIA_()`), resolviendo la discrepancia entre el constructor y la vista previa del alumno.
    - Integración de `colocarModuloEnColumnaActiva_` en `insertarBloqueExe_` y `rehidratarIDevicesDesdeGuion_`.
  - **Versión:**
    - Actualizado `00_Constantes.gs` a `v440 · build-606`.
- **Archivos Afectados:** `AyudaJS.html`, `AdminPlaneacion.html`, `AdminPlaneacionCSS.html`, `AdminPlanJS_04.html`, `AdminPlanJS_06.html`, `00_Constantes.gs`, `ESTADO_COORDINACION.md`, `CONTROL_CAMBIOS.md`.

### 🛠️ [2026-11-05] - [Ola 17: Arquitectura Visual DIVI Real, Bubble Toolbar Contextual Notion y Menú Lateral Colapsable en build-603]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(ola17): arquitectura visual divi real, bubble toolbar contextual notion, menu lateral colapsable y controles en build-603`
- **Cambios Realizados:**
  - **Erradicación de Barras Fijas Superiores y Lienzo Despejado:**
    - Erradicadas las barras fijas horizontales `.editor-master-toolbar` y `.clean-wysiwyg-toolbar` sobre el lienzo `#lienzoExeActivo`.
  - **Pastilla Flotante Contextual (*Bubble Toolbar* Notion/Medium):**
    - Inyectado contenedor `#bubbleToolbar` (`.floating-bubble-toolbar`) con micro-botones (`B`, `I`, `U`, `H3`, `•`, `🔗`).
    - Listener `selectionchange` sobre áreas `.rich-editable-area` y `[contenteditable="true"]` con cálculo de offset relativo a `#lienzoExeActivo` y `scrollTop`.
  - **Arquitectura de 4 Capas DIVI Puras:**
    - Sección azul (`.divi-section`, `#0284c7`), Fila verde (`.divi-row`, `#10b981`), Columna dropzone (`.divi-column`) con borde punteado y foco activo (`.active-target` con anillo teal).
    - Fila separadora con botón verde `(+)` (`.btn-plus-green`) que despliega el selector flotante `.divi-columns-picker` (`col-1`, `col-2`, `col-2-70-30`, `col-3`).
    - Botón `[+ Añadir Módulo]` dentro de cada columna conectado con el Catálogo Lateral de las 7 familias curriculares con fallback inteligente a la última columna.
  - **Menú Lateral Colapsable (`alternarSidebarExe_`):**
    - Botón conmutador `.btn-toggle-sidebar-exe` con iconos `◀` / `▶`.
    - Modo colapsado (`.sidebar-colapsado`) que oculta el sidebar con transición fluida (`0.25s`) y expande el lienzo de autor al 100% del ancho para modo concentración.
    - Soporte integrado en `AyudaJS.html`, `AdminPlaneacionCSS.html` y `simulador_exelearning.html`.
  - **Reordenamiento Vertical DOM (▲ / ▼) y Eliminación:**
    - Función `moverElementoDOM_(el, direccion)` con `insertBefore` para Secciones, Filas y Módulos.
    - Eliminación con buffer de deshacer y pastilla `#pastillaDeshacerBloque`.
  - **Versión:**
    - Actualizado `00_Constantes.gs` a `v440 · build-603`.
- **Archivos Afectados:** `AyudaJS.html`, `AdminPlaneacionCSS.html`, `AdminPlanJS_06.html`, `ClaseJS_08.html`, `simulador_exelearning.html`, `00_Constantes.gs`, `ESTADO_COORDINACION.md`, `CONTROL_CAMBIOS.md`.


### 🛠️ [2026-11-05] - [Ola 17: Constructor Tecno-Pedagógico Fusión (Divi + Elementor + Notion + eXeLearning) en build-602]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(ola17): constructor tecno-pedagogico fusion con insercion continua, tablas divididas excel, formas word, geogebra real, lapiz de renombrado y despliegue a drive en build-602`
- **Cambios Realizados:**
  - **Integración de Diseños UI/UX de DeepSeek (`AdminPlaneacionCSS.html`):**
    - Filas de inserción continua entre bloques `.block-inserter-row` con botón circular `(+)` (`.btn-block-plus`) y menú emergente responsivo de 9 opciones (`.inserter-popup-dropdown`, `.popup-inserter-item`).
    - Botón flotante `(-)` (`.btn-block-minus`) en la esquina superior derecha de cada tarjeta para eliminación intuitiva con buffer de deshacer.
    - Tablas divididas multicelda (`.excel-split-table`) con distribuciones porcentuales (`50-50`, `33-33-33`, `70-30`, `25-75`), scroll touch en dispositivos móviles y paleta cromática por celda.
    - Cuadros de texto y formas Word con 4 variantes pedagógicas DUA (`shape-blue`, `shape-teal`, `shape-amber`, `shape-purple`) y distintivo curricular.
    - Marco responsive para GeoGebra (`.geogebra-card-frame`, `.btn-fullscreen`) y drawer móvil $\le 860$px con botón `☰` y backdrop con blur.
  - **Controladores Frontend de Cursor (`AyudaJS.html`, `AdminPlanJS_06.html`, `ClaseJS_08.html`):**
    - Inserción continua `(+)` en posición exacta con `insertarBloqueEnPosicion_` y repintado de separadores con `repintarDivisoresExe_`.
    - Eliminación con buffer de 5 segundos `window.ultimoBloqueEliminado_` y pastilla flotante `#pastillaDeshacerBloque` con botón "Deshacer".
    - Candado de delegación segura en `AdminPlanJS_06.html` y `ClaseJS_08.html` al inicio de `eliminarIDeviceCard_`.
    - Controlador de tablas divididas con barra contextual por celda, sanitización en pegado (`paste`) que elimina estilos Word/mso, e inserción de imagen y video/Drive en cada celda.
    - Simulador GeoGebra parametrizado (`geogebra_param`) con extracción tolerante de IDs y dimensiones enteras seguras para URLs de iframes.
    - Reconexión completa de la IA (`volcarBloquesIAEnLienzo_`) enviando la secuencia generada directo al lienzo interactivo.
  - **Lápiz de Renombrado ✏️ y Maquetación Frontal en Árbol de Páginas (`simulador_exelearning.html`, `AyudaJS.html`):**
    - Botón visible `✏️` colocado directamente junto al nombre de cada página tanto en HTML estático como en rendering dinámico para renombramiento inmediato.
    - Renombrado del encabezado a "Contenidos de Aprendizaje" y colocación en fila horizontal (`display: flex; flex-direction: row;`) para que las tarjetas siempre se publiquen enfrente del menú lateral, nunca abajo.
    - Herramientas enriquecidas (editor con formato, opciones de video, imagen con DUA alt-text, tabla excel y simulador) en todas las tarjetas añadidas.
  - **Backend en Google Apps Script (`PlaneacionNEM.gs`):**
    - Implementado endpoint `guardarMedioClaseEnDrive(token, payload)` que crea/gestiona la carpeta `ST90_MEDIOS_CLASES`, decodifica base64 y configura permisos compartidos públicos/dominio.
  - **Validación y Versión:**
    - AST validado con `node herramientas/manifiesto.js`: 0 documentos sin parsear.
    - Bumping de versión en `00_Constantes.gs`: `v440 · build-602`.
- **Archivos Afectados:** `AyudaJS.html`, `AdminPlanJS_06.html`, `ClaseJS_08.html`, `AdminPlaneacionCSS.html`, `simulador_exelearning.html`, `PlaneacionNEM.gs`, `00_Constantes.gs`, `ESTADO_COORDINACION.md`, `CONTROL_CAMBIOS.md`.

### 🛠️ [2026-11-05] - [Ola 16: Suite Editorial Nativa Completa WYSIWYG Profesional ST90, Menubar y Partituras a Cursor y DeepSeek (build-598)]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(editor): suite editorial nativa wysiwyg profesional estilo tinymce con menubar, fuentes, tablas y activacion centinela ola 16 en build-598`
- **Cambios Realizados:**
  - **Suite Editorial Nativa Completa WYSIWYG Profesional:**
    - `AyudaJS.html`: Implementada barra menubar superior (`Archivo`, `Editar`, `Insertar`, `Formato`, `Tabla`, `Herramientas`) y organización de herramientas en dos filas (`.toolbar-fila-1` y `.toolbar-fila-2`).
    - Selectores de tipografía: Selector de bloque (Párrafo, H1, H2, H3, Cita), selector de fuente (`sans-serif`, `Arial`, `Georgia`, `monospace`) y selector de tamaño (`12px`, `14px`, `16px`, `18px`, `22px`).
    - Acciones de historial: `Deshacer` y `Rehacer` (`undo`/`redo`).
    - Limpieza de formato `Tx` (`removeFormat`).
    - Herramientas completas de tabla: inserción, filas arriba/abajo, columnas izq/der, colorear fondo de celdas (`colorearCeldaEditor`), bordes y quitar elemento.
    - Cuadros didácticos DUA (Callout DUA, Nota, Reto, Pregunta, Cuadro comparativo, Rúbrica formativa) y botón inteligente `🗑️ Quitar elemento`.
    - `temp.firstElementChild` en `montarEditorEnriquecido_` para erradicar cualquier error de nodo de texto.
  - **Estilos Institucionales en ComunCSS.html:**
    - Maquetación `.editor-enriquecido-wrap`, `.menubar-editor-st90`, `.menu-item-st90`, `.sel-tb-bloque`, `.sel-tb-fuente`, `.sel-tb-tamano`, `.sel-tb-cajas` y `.btn-tb-danger`.
    - Garantizado `display: block !important` y `min-height: 220px` para `.campo-editor-rich`.
  - **Orquesta Multi-Agente y Reparto de Tareas:**
    - Partitura activa **Ola 16 (`build-598`)** asignada a Cursor en `ENTREGA_CURSOR.md` y a DeepSeek en `ENTREGA_DEEPSEEK.md`.
    - Actualizado `ESTADO_COORDINACION.md`.
    - Despliegue en los 6 endpoints oficiales `@593`.
  - `00_Constantes.gs`: Incrementado a `v439 · build-598`.
- **Archivos Afectados:** `AyudaJS.html`, `ComunCSS.html`, `00_Constantes.gs`, `ESTADO_COORDINACION.md`, `ENTREGA_CURSOR.md`, `ENTREGA_DEEPSEEK.md`, `CONTROL_CAMBIOS.md`.

### 🛠️ [2026-11-05] - [Ola 14: Suite Editorial TinyMCE 6 en Bloques del Constructor y Color de Fondo de Página (build-596)]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(constructor): suite editorial tinymce 6 con tablas avanzadas, tiradores de imagen, cajas didacticas y color de fondo en build-596`
- **Cambios Realizados:**
  - **Integración de TinyMCE 6 (WYSIWYG Industrial):**
    - `Admin.html` y `Clase.html`: Inyección del CDN TinyMCE 6 Community Edition con configuración segura de `window.tinymce.baseURL` anti-sandbox de Google Apps Script.
    - `AyudaJS.html`: Inicializador `inicializarTinyMCEParaBloque_()` con plugins `table`, `image`, `media`, `lists`, `link`, `code`, `fullscreen`, `wordcount`.
    - Soporte completo de tablas con menubar y barra contextual: insertar/eliminar filas y columnas, combinar y dividir celdas, propiedades de celda y de tabla con selectores de color de fondo y de borde.
    - Tiradores gráficos nativos en imágenes: 8 puntos de control para arrastrar y redimensionar el tamaño de la imagen visualmente.
    - Eliminación directa y ergonómica de cualquier elemento (tablas, imágenes, recuadros) usando `Delete`, `Backspace` o el botón de papelera del menú flotante.
    - Menú desplegable personalizado `📦 Cuadro didáctico`: inserción con un clic de Callout DUA verde (`.notion-callout`), Recordatorio pedagógico ámbar (`.caja-nota-st90`), Reto de aprendizaje teal (`.caja-reto-st90`) y Pregunta detonadora azul (`.caja-pregunta-st90`).
    - Ciclo de vida y limpieza de memoria en `eliminarIDeviceCard_()` destruyendo instancias con `tinymce.get(id).remove()`.
    - Sincronización transparente en `leerCampoBloque_()`, `escribirCampoBloque_()` y `textoPlanoCampoBloque_()`.
  - **Selector de Color de Fondo de Página / Lienzo:**
    - `AyudaJS.html`: Agregado selector `🎨 Fondo:` en la barra superior del lienzo de autor (`#selColorFondoLienzo`) con 7 tonos pasteles DUA (Blanco, Gris suave, Menta DUA, Cielo, Crema, Lavanda, Sepia) y selector personalizado `<input type="color">`.
    - Función reactiva `cambiarColorFondoLienzo_()` que colorea el lienzo de trabajo, actualiza la Vista Previa del Alumno, persiste el valor en `extra.exelearning.colorFondo` y lo restaura al cargar sesiones guardadas.
  - **Estilos Institucionales ST90 en ComunCSS.html:**
    - `ComunCSS.html`: Estilos refinados para `.tox-tinymce`, barras de herramientas en `#f8fafc`, menubar en `#f1f5f9`, acentos en teal `#0f766e`, y maquetas para las cajas didácticas.
  - `00_Constantes.gs`: Incrementado a `v437 · build-596`.
- **Archivos Afectados:** `Admin.html`, `Clase.html`, `AyudaJS.html`, `ClaseJS_08.html`, `AdminPlanJS_06.html`, `ComunCSS.html`, `00_Constantes.gs`, `ESTADO_COORDINACION.md`, `CONTROL_CAMBIOS.md`.

### 🛠️ [2026-11-05] - [Ola 12: Constructor Maestro Unificado ST90 (eXeLearning, Notion, Elementor, H5P) y Centinela Antigravity (build-592)]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(constructor): constructor maestro unificado con editor wysiwyg, bloques notion, h5p anti-csp, reconexion ia al lienzo de autor y centinela antigravity v3 en build-592`
- **Cambios Realizados:**
  - **Reconexión del Pipeline IA al Lienzo de Autor (Paso 3):**
    - `AyudaJS.html`: Al resolver `generarClaseInteractivaCompletaIA()`, se invoca `volcarBloquesIAEnLienzo_()` para desempaquetar cada `contenido_*` generado por la IA en tarjetas interactivas (`idevice-card`) en el contenedor de autor (`#contenedorIDevicesDinamicos` / `#lienzoExeActivo`) y se navega automáticamente a `irAPasoSesion_(3)`.
  - **Editor WYSIWYG Enriquecido:**
    - `AyudaJS.html`: Implementado `htmlEditorEnriquecido_()` y `montarEditorEnriquecido_()` con barra de herramientas flotante (`B`, `I`, `U`, `H3`, `Lista`, `Cita`) con protección anti-desenfoque (`onmousedown="event.preventDefault()"`).
    - Persistencia con `leerCampoBloque_()` leyendo `.innerHTML` de `.campo-editor-rich` y extracción en texto plano `textoPlanoCampoBloque_()` para el sintetizador de voz DUA y guiones.
  - **Catálogo Unificado en 7 Familias (20+ Bloques):**
    - Notion: `callout` (caja de alerta con emoji), `timeline` (fases didácticas secuenciales), `flashcards` (tarjetas 3D con aceleración GPU), `tabla_notion` (tabla dinámica con celdas editables y `+ Añadir fila`), `toggle_notion` (acordeón colapsable con flecha animada).
    - Multimedia & Elementor: `video_local` (reproductor MP4/WebM nativo vía `URL.createObjectURL` offline), `h5p_interactivo` (iframe sandbox seguro con botón de respaldo a pantalla completa anti-CSP).
    - Divisores contextuales `[+]`: Inserción en cualquier posición del lienzo mediante `splice(idx + 1, 0, nuevoBloque)`.
  - **Estilizado Completo y Responsive Móvil (ComunCSS.html):**
    - `ComunCSS.html`: Integrado el bloque CSS de DeepSeek (11.9 KB) con focus ring teal `#0d9488`, diseño de bloques Notion, aceleración por hardware en flashcards (`-webkit-backface-visibility: hidden; transform: translateZ(0);`), y Drawer móvil retráctil con cortina (`<= 860px`).
  - **Centinela Antigravity (v3):**
    - `herramientas/centinela_buzon.js`: Soporte nativo para `node herramientas/centinela_buzon.js antigravity`, vigilando en tiempo real entregas de Cursor y DeepSeek para despertar al Director automáticamente.
    - Creado script de acceso rápido `herramientas/centinela_antigravity.cmd`.
  - **Sustitución de Alumno por Docente en Horario (build-591):**
    - `Clase.html`, `AdminPlaneacion.html`, `ClaseJS_02.html`, `ClaseJS_03.html`, `AdminPlanJS_01.html` y `ClaseLogica.gs`: Selector `👨‍🏫 Docente` (`#btnClaseDocente`) con catálogo dinámico y filtrado en tiempo real en la cuadrícula del horario.
  - `00_Constantes.gs`: Incrementado a `v433 · build-592` y desplegado a producción en versión `@587`.
- **Archivos Afectados:** `00_Constantes.gs`, `ComunCSS.html`, `AyudaJS.html`, `Clase.html`, `AdminPlaneacion.html`, `ClaseJS_02.html`, `ClaseJS_03.html`, `AdminPlanJS_01.html`, `ClaseLogica.gs`, `herramientas/centinela_buzon.js`, `herramientas/centinela_antigravity.cmd`, `ESTADO_COORDINACION.md`, `ENTREGA_CURSOR.md`, `ENTREGA_DEEPSEEK.md`, `CONTROL_CAMBIOS.md`.

### 🛠️ [2026-11-04] - [Ola 11.1: Homologación por Grado, Nombres Completos de Docentes, Cierre Resiliente de Modal y Turnos Duales en Ribbon (build-589)]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(horario): homologacion de asignaturas por grado, nombres formales completos de docentes, conmutador de turnos select-wrap y cierre resiliente de modales en build-589`
- **Cambios Realizados:**
  - **Homologación de Asignaturas por Grado:**
    - `Asistencia.gs`: `obtenerCatalogoHomologacionHorario()` ahora agrupa asignaturas discriminando por grado (`Grado + Asignatura`), permitiendo diferenciar automáticamente asignaturas homónimas (ej. Ciencias 1° = Biología, Ciencias 2° = Física, Ciencias 3° = Química) con sugerencias inteligentes SEP/NEM.
    - `Asistencia.gs`: `guardarHomologacionDocenteAsignatura()` actualiza la hoja `Horarios` por `Grado + Asignatura` y `Turno`.
  - **Nombres Formales Completos de Docentes:**
    - `AdminJS_05.html`: La pestaña de docentes permite capturar el nombre formal completo del docente (ej. "Prof. Miguel Ángel Pérez López"), mostrando además las asignaturas y grados que imparte.
    - `Asistencia.gs`: Actualización masiva de `Maestro` en la hoja `Horarios` y sincronización con `MaestrosClase`.
  - **Cierre Resiliente y Accesible de Modales:**
    - `ComunJS.html`: `modal()` protegido con `try...finally { fondo.remove(); resolve(val); }` para evitar que ningún error de captura deje el modal atascado. Soporte nativo para botón de cierre `✕` (`.st90-modal-cerrar-x`), cierre al hacer clic en el fondo (`cerrarFondo: true`) y tecla `Escape`.
    - `ComunCSS.html`: `.st90-modal` configurado con `max-height: 90vh; display: flex; flex-direction: column;` y cuerpo con scroll vertical (`.st90-modal-cuerpo`).
  - **Selector de Turno en Cinta Ribbon (`AdminPlaneacion.html` y `Clase.html`):**
    - `#btnClaseTurno` estandarizado como `.ribbon-btn.ribbon-btn-select-wrap` con `<select id="selTurnoClase">` overlay, garantizando 100% de visibilidad, cero desbordamientos y paridad visual con los botones de Grupo, Asignatura y Alumno.
    - `AdminPlanJS_01.html` y `ClaseJS_03.html`: `alCambiarTurnoClase()` conmuta dinámicamente el turno, actualiza el icono (☀️ sol / 🌙 luna), sincroniza `localStorage` y recarga inmediatamente el horario con `cargarHorarioMae()`.
  - **Corrección de Pérdida de Horario Vespertino en Backend:**
    - `ClaseLogica.gs` y `PlaneacionNEM.gs`: Eliminada la condición `esOficialCompleto` que descartaba erróneamente los horarios importados menores a 500 filas y sobreescribía con el fallback matutino. Ahora se respetan fielmente las filas reales de la hoja `Horarios`.
  - `00_Constantes.gs`: Incrementado a `v430 · build-589`.
- **Archivos Afectados:** `00_Constantes.gs`, `ClaseLogica.gs`, `PlaneacionNEM.gs`, `Asistencia.gs`, `ComunJS.html`, `ComunCSS.html`, `AdminPlaneacionCSS.html`, `ClaseCSS.html`, `AdminPlaneacion.html`, `Clase.html`, `AdminPlanJS_01.html`, `ClaseJS_03.html`, `AdminJS_05.html`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Se resuelven de raíz las tres incidencias reportadas por el usuario: (1) El turno vespertino ya es visible en la cinta y sus datos no son descartados en backend; (2) El modal de homologación cierra limpiamente con botón `✕`, clic en fondo, botón "Cerrar", o guardado; (3) Las asignaturas pueden homologarse por grado específico y los docentes pueden registrar su nombre formal completo para los formatos oficiales de planeación. Verificado con `manifiesto.js` (0 errores AST, 0 documentos sin parsear).

### 🛠️ [2026-11-04] - [Olas 10 y 11: Contenidos de Aprendizaje NEM, Turnos Duales y Homologación de Horarios XML (build-588)]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(suite): motor de clases interactivas nem con 7 contenidos de aprendizaje, gestion dual de turnos y homologacion de horarios xml en build-588`
- **Cambios Realizados:**
  - **Ola 10 (Motor Tecno-Pedagógico NEM):**
    - `PlaneacionNEM.gs`: Implementado el endpoint `generarClaseInteractivaCompletaNEM()` y su fallback algorítmico DUA `generarClaseInteractivaDUAFallback_()` que devuelve los 7 contenidos de aprendizaje (`contenido_teoria`, `contenido_ejemplo`, `contenido_ejercicio`, `contenido_lista_cotejo`, `contenido_autoevaluacion`, `contenido_rubrica`, `contenido_evidencia`).
    - `AyudaJS.html`: Creado el disparador `generarClaseInteractivaCompletaIA()`, la normalización de la estructura de la clase y los controladores interactivos del alumno (`marcarCotejoPreview_` con barra de avance animada y `seleccionarNivelRubricaPreview_` con marcado por fila).
    - `AdminPlaneacionCSS.html` y `ClaseCSS.html`: Estilos completos para tarjetas de modelado paso a paso, ejercicios guiados, checklist interactivo y matriz de rúbrica SEP oficial de 4 niveles.
  - **Ola 11 (Turnos Duales y Homologación XML):**
    - `AdminPlaneacion.html` y `Clase.html`: Incorporado `#btnClaseTurno` en la cinta ribbon con soporte para conmutación reactiva entre `☀️ Turno Matutino` y `🌙 Turno Vespertino`.
    - `AdminPlanJS_01.html` y `ClaseJS_03.html`: Gestionada la variable `turnoHorarioActivo`, persistencia en `localStorage` y paso como 6º argumento a `horarioMaestroClase`.
    - `ClaseLogica.gs`: `horarioMaestroClase()`, `gruposDeSesionClase_()` y `horarioSemanaDeGrupoClase_()` actualizados para filtrar estrictamente por turno.
    - `Asistencia.gs`: Nuevos endpoints `obtenerCatalogoHomologacionHorario()` y `guardarHomologacionDocenteAsignatura()` con actualización masiva de nombres en la hoja `Horarios`.
    - `AdminJS_05.html`: Modal de importación enriquecido con selección explícita de turno y nuevo modal `.modal-homologacion` con pestañas para edición rápida de docentes y asignaturas.
    - `ComunCSS.html`, `AdminPlaneacionCSS.html` y `ClaseCSS.html`: Estilos del botón de turno `.ribbon-btn-turno`, dropdown `.dropdown-turno-menu` y tabla cebra sticky `.tabla-homologacion`.
  - `00_Constantes.gs`: Incrementado a `v429 · build-588`.
- **Archivos Afectados:** `00_Constantes.gs`, `PlaneacionNEM.gs`, `ClaseLogica.gs`, `Asistencia.gs`, `AdminPlaneacion.html`, `Clase.html`, `AdminPlanJS_01.html`, `ClaseJS_03.html`, `AdminJS_05.html`, `AyudaJS.html`, `ComunCSS.html`, `AdminPlaneacionCSS.html`, `ClaseCSS.html`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Cobertura total de dos hitos fundamentales. Las clases interactivas ahora integran autoevaluación procesual y rúbrica analítica directa en el aula virtual del estudiante. La barra de horarios soporta de manera nativa los turnos matutino y vespertino con edición/homologación de nombres sin riesgo de colisiones ni pérdida de datos. Verificado con `manifiesto.js` (0 errores AST).

### 🛠️ [2026-11-04] - [Ola 9.1: desglose DUA resiliente con fallback y depuración de toolbar (build-586)]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(sesion): reparar desglose IA con fallback pedagogico DUA y eliminar boton modal redundante de vista previa en build-586`
- **Cambios Realizados:**
  - `PlaneacionNEM.gs`: Incorporada la función pedagógica `generarDesgloseSesionesDUAFallback_()` para que `asistirDesgloseSesionesNEM` responda de manera inmediata y sin fallos aunque no exista clave de DeepSeek configurada o haya timeout.
  - `AdminPlanJS_04.html`: Modificado `solicitarDesgloseSesionesIA()` para leer el título, PDA y campo formativo directamente de los inputs si la planeación aún no tiene ID guardado en base de datos.
  - `AdminPlaneacion.html` y `Clase.html`: Eliminado el botón redundante `👁️ Vista Previa Alumno` de la barra superior de acciones, centralizando toda la vista previa en la Pestaña 4 del stepper (`👁️ 4. Vista Previa Alumno`).
  - `00_Constantes.gs`: Incrementado a `v427 · build-586`.
  - Despliegue en producción Google Apps Script: Creada Versión `@582` y actualizados los 5 deployments oficiales.
- **Archivos Afectados:** `PlaneacionNEM.gs`, `AdminPlanJS_04.html`, `AdminPlaneacion.html`, `Clase.html`, `00_Constantes.gs`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** La eliminación del botón en la toolbar superior despeja la cabecera de la sesión dejando solo Vinculación SEP, Calendarizar y Guardar Sesión. El botón Desglosar con IA ya no arroja alertas de bloqueo y llena automáticamente los 4 momentos en las sesiones del proyecto. Verificado con `manifiesto.js` (0 errores AST).

### 🛠️ [2026-11-04] - [Ola 9: vista previa del alumno con la maqueta aprobada y estilos Apple/Classroom (build-585)]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(sesion): integrar diseno elegante de vista previa del alumno con marco browser-frame y desplegar version 581 en build-585`
- **Cambios Realizados:**
  - `AdminPlaneacionCSS.html` y `ClaseCSS.html`: Integrado el paquete CSS completo de `.browser-frame` (barra institucional oscura `#0f172a`, dots de ventana, badge ST90, hero con gradiente y pulso live, menú espacioso de 4 momentos con microinteracción `:hover` y franja de 3px, tarjetas de lectura DUA con reproductor animado de ondas, reto con buzón drag & drop punteado, quiz con tarjetas de opción A/B/C/D y feedback en tiempo real).
  - `AyudaJS.html`: Modernizado `armarMaquetaAlumno_()` y `tarjetaPreviewBloque_()` para alimentar la estructura visual elegante con los datos vivos de la planeación (`#sesTitulo`, campo formativo, PDA, momentos 1 a 4) e integrar cualquier iDevice dinámico añadido al editor.
  - `00_Constantes.gs`: Incrementado a `v426 · build-585`.
  - Despliegue en producción Google Apps Script: Creada Versión `@581` y actualizados los 5 deployments oficiales.
- **Archivos Afectados:** `AyudaJS.html`, `AdminPlaneacionCSS.html`, `ClaseCSS.html`, `00_Constantes.gs`, `ESTADO_COORDINACION.md`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** La vista previa tanto en la pestaña 4 del stepper como en el modal flotante utiliza el diseño visual aprobado de `muestra_vista_previa_alumno.html`. En el modal se oculta la doble barra superior mediante `#modalPreviewAlumno .preview-mockup-browser { display: none !important; }` permitiendo un diseño uniforme y sin transparencias. Verificado con `manifiesto.js` (0 errores AST).

### 🛠️ [2026-11-04] - [Ola 8: cuatro pestañas de la sesión y maqueta web del alumno (build-584)]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(sesion): separar el editor en cuatro pestanas y rearmar la vista previa del alumno en build-584`
- **Cambios Realizados:**
  - `irAPasoSesion_(n)` muestra un solo panel entre Guion, Lucy, Constructor y Vista previa, y marca `.activo` en la pestaña.
  - Cada panel tiene Continuar y Volver. El botón Vista Previa abre la pestaña 4 y el modal con `.preview-panel` blanco, marco `.preview-mockup-browser` y cuerpo `.aula-alumno-preview`.
  - La maqueta trae el título, el campo formativo y el PDA, pestañas de los cuatro momentos, lectura en voz alta, buzón de evidencia y quiz con autocalificación.
- **Archivos Afectados:** `AdminPlaneacion.html`, `Clase.html`, `AyudaJS.html`, `ENTREGA_CURSOR.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Los cuatro pasos ya no se ven juntos. El panel inactivo lleva `.oculto` y `hidden`. La maqueta se arma dos veces con la misma función: dentro de `#vistaPreviaIntegrada` y dentro del modal. No volver a pintar la vista previa como una lista plana de secciones. El archivo del buzón solo muestra el nombre elegido; no sube nada.

### 🛠️ [2026-11-04] - [Ola 7: guion, Lucy y constructor en ese orden, con voz, ayuda y vista previa (build-583)]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(sesion): ordenar guion lucy y constructor y enlazar voz ayuda y vista previa del alumno en build-583`
- **Cambios Realizados:**
  - `#editorSesionActiva` queda en tres tramos: Paso 1 (título y cuatro momentos), conector Lucy (`#panelAsistenteSecuenciaIA`) y Paso 2 (constructor eXeLearning).
  - Cada momento tiene `?` (`abrirAyudaMomento_`) y `🔊` (`reproducirVozMomento_`). El botón `👁️ Vista Previa Alumno` abre `abrirVistaPreviaAlumno_()`.
  - `calcularPuntosTotalesSesion_()` aplica (puntos de quiz × ponderación) + (puntos de actividad × ponderación) y lo muestra en `#lblPuntosTotalesSesion`.
- **Archivos Afectados:** `AdminPlaneacion.html`, `Clase.html`, `AyudaJS.html`, `AdminPlanJS_06.html`, `ENTREGA_CURSOR.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** El constructor ya no va arriba del guion. Lucy vive en el conector entre ambos y ya no se duplica dentro del lienzo. La ponderación ausente vale 1, así el total no se infla. Las tarjetas de otra página, ocultas, no entran al cálculo ni a la vista previa. No volver a meter `#panelAsistenteSecuenciaIA` en la plantilla del lienzo.

### 🛠️ [2026-11-04] - [Ocultación de barra flotante de acceso rápido quick-ribbon (build-582)]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(exelearning): ocultar contenedor flotante quick-ribbon de iconos rapidos y desplegar a produccion en build-582`
- **Causa Raíz / Requerimiento:**
  - El usuario solicitó ocultar el contenedor flotante superior de iconos rápidos (`.quick-ribbon`: `T`, `✿`, `✓`, `↓`, `▣`) del lienzo interactivo.
- **Cambios Realizados:**
  - `AyudaJS.html`: Eliminado el marcado HTML de `.quick-ribbon` del montaje del workspace en `montarEntornoExeLearning_()`.
  - `AdminPlaneacionCSS.html` y `ClaseCSS.html`: Añadida regla `display: none !important;` en `.quick-ribbon`.
  - `simulador_exelearning.html`: Ocultado `.quick-ribbon` con `display: none !important;`.
  - `00_Constantes.gs`: Actualizado a `v423 · build-582`.
  - Despliegue en producción Google Apps Script: Creada versión `@578` y actualizados los 5 deployments oficiales.
- **Archivos Afectados:** `AyudaJS.html`, `AdminPlaneacionCSS.html`, `ClaseCSS.html`, `simulador_exelearning.html`, `00_Constantes.gs`, `CONTROL_CAMBIOS.md`


### 🛠️ [2026-11-04] - [Ola 6.1 Cursor: encuesta en Evaluación y seguimiento y candado contra la barra modular (build-581)]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(exelearning): conectar encuesta diagnostico en evaluacion y seguimiento y erradicar la inyeccion de idevice-bar en build-581`
- **Cambios Realizados:**
  - `htmlCatalogoExe_()` deja `📊 Encuesta / Diagnóstico` en la familia Evaluación y seguimiento, con `data-tipo="encuesta"` y `onclick="insertariDeviceSesion_('encuesta')"`.
  - `insertarBloqueExe_('encuesta')` marca la tarjeta como `.idevice-bloque` y completa el panel interactivo con `completarIDeviceEncuesta_()`.
  - `erradicarBarraModularExe_()` y un `MutationObserver` retiran cualquier `.idevice-bar` que aparezca en el editor o en el lienzo. El montaje ya no mueve esa barra al canvas.
  - `ClaseJS_08.html` llama a `erradicarBarraModularExe_()` después de insertar un bloque.
- **Archivos Afectados:** `AyudaJS.html`, `ClaseJS_08.html`, `ENTREGA_CURSOR.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** La píldora de encuesta ya estaba en el catálogo, pero el lienzo todavía podía recibir `.idevice-bar` si algo la inyectaba después del primer montaje o si `montarEntornoExeLearning_()` salía antes de limpiar. La decisión cerrada es no publicar esa barra: se elimina al montar, al insertar y ante cualquier nodo nuevo dentro de `#editorSesionActiva`. El clic de Evaluación y seguimiento sigue siendo `insertariDeviceSesion_('encuesta')`, que arma la tarjeta con modo, catálogo y ponderación. No reabrir la idea de mover la barra al lienzo. El asistente Lucy permanece en el banner de la página activa.

### 🛠️ [2026-11-04] - [Encuesta/Diagnóstico en Menú de Contenidos de Aprendizaje y Erradicación Total de Barra Modular (build-581)]
- **Mensaje de Commit sugerido (Conventional Commits):** `refactor(exelearning): integrar Encuesta/Diagnostico en catalogo lateral de Contenidos y erradicar barra modular idevice-bar en build-581`
- **Causa Raíz / Requerimiento:**
  1. Erradicar por completo la barra redundante `.idevice-bar` ("iDevices Modulares Opcional") del lienzo central (eliminada de `AdminPlaneacion.html` y `Clase.html`).
  2. Integrar el bloque `📊 Encuesta / Diagnóstico` como elemento del menú acordeón lateral de "Contenidos de Aprendizaje" (en la categoría *Evaluación y seguimiento*).
  3. Al pulsar `📊 Encuesta / Diagnóstico` en el menú lateral, se dispara la inserción interactiva del bloque correspondiente.
  4. Delegar responsabilidades en los buzones de Cursor (`ENTREGA_CURSOR.md`) y DeepSeek (`ENTREGA_DEEPSEEK.md`) bajo el protocolo centinela de orquestación.
- **Cambios Realizados:**
  - `AdminPlaneacion.html` y `Clase.html`: Eliminado el nodo `.idevice-bar` del marcado HTML.
  - `AyudaJS.html`: Erradicada la inyección de `.idevice-bar` y configurado el elemento `['encuesta', '📊 Encuesta / Diagnóstico']` dentro de `htmlCatalogoExe_()`.
  - `simulador_exelearning.html`: Actualizado con el icono y elemento `📊 Encuesta / Diagnóstico` en el acordeón de *Evaluación y seguimiento*, manteniendo el lienzo limpio (0 bloques) de inicio.
  - `ENTREGA_CURSOR.md` y `ENTREGA_DEEPSEEK.md`: Asignadas partituras para lógica y diseño visual de la Ola 6.1.
  - `ESTADO_COORDINACION.md`: Registrada Ola 6.1 (`build-581`).
  - `00_Constantes.gs`: Incrementada versión a `v422 · build-581`.
- **Archivos Afectados:** `00_Constantes.gs`, `AdminPlaneacion.html`, `Clase.html`, `AyudaJS.html`, `simulador_exelearning.html`, `ENTREGA_CURSOR.md`, `ENTREGA_DEEPSEEK.md`, `ESTADO_COORDINACION.md`, `CONTROL_CAMBIOS.md`

### 🛠️ [2026-11-03] - [Panel de Inicio Limpio en Entorno de Autor y Asistente IA de Secuencia y Arquitectura Pedagógica (build-580)]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(exelearning): inicio limpio sin barra redundante e integracion de Asistente Pedagico IA para sugerir secuencia didactica ordenada en 4 momentos segun planeacion previa en build-580`
- **Causa Raíz / Requerimiento:**
  1. Ocultar la barra redundante `.idevice-bar` ("iDevices Modulares Opcional") en el lienzo central de trabajo para que el panel inicie completamente limpio y despejado.
  2. Guiar al docente para que agregue los elementos en orden pedagógico secuencial.
  3. Integrar un Asistente IA (Lucy, Asesora Pedagógica NEM ST90) que analice la planeación previa (`planTitulo`, `planCampoFormativo`, `planAsignatura`, `planPDA`, `planProposito` y los 4 momentos sintéticos `sesApertura`, `sesDesarrollo`, `sesActividad`, `sesCierre`) y recomiende la secuencia pedagógica en 4 momentos:
     - 1. Apertura / Saberes Previos (5 min): Lectura DUA o video guiado.
     - 2. Desarrollo / Explicación (10 min): Objetivos, conceptualización o listening/ofimática.
     - 3. Actividad Práctica Situada (20 min): Ficha descargable o reto situado.
     - 4. Cierre / Evaluación Formativa (5 min): Quiz interactivo con feedback formativo.
  4. Botón de 1 clic `✨ Construir Secuencia Completa con IA` y botones paso a paso para inserción guiada.
- **Cambios Realizados:**
  - `AdminPlaneacion.html` y `Clase.html`: Ocultada la barra `.idevice-bar` con `display: none !important`.
  - `AdminPlaneacionCSS.html` y `ClaseCSS.html`: Diseñadas las reglas visuales para `.idevice-bar`, `.panel-asistente-secuencia-ia`, `.asistente-ia-card`, `.asistente-ia-pasos-grid`, `.btn-construir-secuencia-completa`, `.btn-asistente-ia-sesion`, etc.
  - `AyudaJS.html`: Erradicada la inserción de `.idevice-bar` en el lienzo, implementadas las funciones `obtenerContextoPlaneacionPrevia_()`, `renderAsistenteSecuenciaIA_()`, `toggleAsistenteSecuenciaIA_()`, `insertarPasoSecuenciaIA_()` y `construirSecuenciaCompletaIA_()`, e integradas en el ciclo reactivo de `actualizarContadorIDevicesExe_()`.
  - `00_Constantes.gs`: Versión actualizada a `v421 · build-580`.
- **Archivos Afectados:** `00_Constantes.gs`, `AdminPlaneacion.html`, `Clase.html`, `AdminPlaneacionCSS.html`, `ClaseCSS.html`, `AyudaJS.html`, `CONTROL_CAMBIOS.md`

### 🛠️ [2026-11-01] - [Entorno de Contenidos eXeLearning: Layout Flex Lateral Derecho, Renombrado a Contenidos, Lápiz en Cada Página y Herramientas Enriquecidas por Formato (build-579)]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(exelearning): lienzo al lado derecho del menu, renombrado de iDevices a Contenidos, lapiz de edicion por pagina y herramientas enriquecidas multimedia en build-579`
- **Causa Raíz / Requerimiento:**
  1. Los bloques de contenido se publicaban abajo en lugar de aparecer en el espacio derecho enfrente del menú (`.app-workspace` requería `display: flex; flex-direction: row; align-items: stretch;`).
  2. Renombrar el término técnico `iDevices` por `Contenidos` para claridad de los profesores.
  3. Cada página del árbol en la lista lateral debía contar con su propio botón de lápiz ✏️ (`renombrarNodoEspecificoSesion_`) para cambiar su nombre directamente.
  4. Sustituir los dos campos genéricos de texto por herramientas enriquecidas reales según el formato:
     - Texto DUA: barra de formato (B, I, U, H3, viñetas, citas) y botón de prueba de síntesis de voz DUA.
     - Video interactivo: selector de origen (YouTube, Google Drive, Archivo Local MP4), preview de video y control de pausa con pregunta de verificación.
     - Galería / Imagen: selector de imagen (Subir local, Enlace web, Drive), miniatura y campo de descripción oral accesible DUA para invidentes.
     - Fichero adjunto: selector de documento (PDF, Word) con tarjeta de descarga para el alumno.
     - Quiz / Preguntas: editor de opciones dinámicas con botón de radio para marcar la respuesta correcta, puntos y retroalimentación explicativa.
- **Cambios Realizados:**
  - `AdminPlaneacionCSS.html`: Añadidas las reglas de layout `.app-workspace`, `.canvas-exe`, `.canvas-container`, `.nodo-titulo-wrap`, `.btn-renombrar-nodo`, `.toolbar-enriquecida`, `.tabs-origen-media`, `.caja-preview-media` y `.fila-opcion-quiz`.
  - `AyudaJS.html`: Renombrado a `Contenidos de Aprendizaje`, integrado el lápiz de edición directa por página en `renderArbolSesion_()`, e implementado `htmlEspecialExe_()` con controles completos de formato, previsualización de video, carga de imagen/documento y gestión de opciones de quiz.
  - `simulador_exelearning.html`: Actualizado con las mismas capacidades interactivas y abierto en el navegador para validación inmediata del usuario.
- **Archivos Afectados:** `00_Constantes.gs`, `AdminPlaneacionCSS.html`, `AyudaJS.html`, `simulador_exelearning.html`, `CONTROL_CAMBIOS.md`

### 🛠️ [2026-11-01] - [Entorno de Autor eXeLearning 3.0: Árbol de Páginas con Indentación, Catálogo Accordion en 7 Familias, Barra Rápida Flotante e iDevices para Inglés y Ofimática (build-578)]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(exelearning): entorno completo de autor eXeLearning 3.0 (arbol de jerarquia, acordeon de 7 familias, barra rapida flotante, componentes curriculares para ingles y tecnologia ofimatica) en build-578`
- **Causa Raíz / Requerimiento:**
  1. El docente requería que el constructor de clases interactivo reprodujera fielmente el entorno de autor de eXeLearning, con un árbol jerárquico de páginas (`Documento sin título ✏️`, flechas `[↑][↓][←][→]`, acciones `[🗑️][📋][📤][➕]`, recuadro teal para la página activa).
  2. Integrar el catálogo accordion de iDevices organizado por propósitos pedagógicos (Información y presentación, Evaluación y seguimiento, Juegos, Actividades interactivas, Ciencias) más dos familias especializadas solicitadas: Lengua Extranjera (Inglés) y Tecnología Ofimática.
  3. Proporcionar una barra rápida flotante con iconos multicolor y tarjetas *Lego* modulares con persistencia en `extra.exelearning` sin alterar los 4 momentos sintéticos oficiales de la planeación didáctica.
- **Cambios Realizados:**
  - **DeepSeek (Diseño UI/UX & CSS en `AdminPlaneacionCSS.html`):** Diseñadas las reglas para `.sidebar-exe`, `.box-arbol`, `.arbol-toolbar`, `.nodo-item.seleccionado` (borde `#14b8a6`, fondo `#f0fdfa`), `.cat-accordion`, `.cat-header`, `.cat-items`, `.idevice-pill-add`, `.quick-ribbon`, `.quick-btn`, `.idevice-card`, `.badge-ingles`, `.badge-tecnologia`, `.player-listening` con control de velocidad, `.flip-card-bilingue` con volteo 3D, mini grid de hoja de cálculo `.sim-hoja-calculo` y caja de algoritmo con bloques de diagrama.
  - **Cursor (Frontend & DOM en `AyudaJS.html`, `AdminPlanJS_05.html`, `ClaseJS_07.html`, `ClaseJS_08.html`):** Implementada la estructura `META_TARJETA_EXE_` con 19 tipos de iDevices; gestor del árbol de páginas (`agregarNodoSesion_`, `eliminarNodoSesion_`, `moverNodoSesion_`, `cambiarNivelNodoSesion_`, `seleccionarNodoSesion_`, `renombrarNodoSesion_`); controladores interactivos de listening, pronunciación (`webkitSpeechRecognition`), flashcards bilingües y fórmulas de hoja de cálculo (`=SUMA`, `=PROMEDIO`); y sincronización bidireccional `extra.exelearning` en `guionDocenteConEncuestas_()` y `deserializarIDevicesSesion_()`.
  - **Antigravity (Backend, Auditoría & Despliegue):** Auditoría de selectores e IDs, verificación sintáctica con `node herramientas/manifiesto.js`, incremento de versión a `build-578` (`v419`) y sincronización con GitHub y los 5 endpoints de Google Apps Script.
- **Archivos Afectados:** `00_Constantes.gs`, `AdminPlaneacionCSS.html`, `AyudaJS.html`, `AdminPlanJS_05.html`, `ClaseJS_07.html`, `ClaseJS_08.html`, `ENTREGA_DEEPSEEK.md`, `ENTREGA_CURSOR.md`, `ESTADO_COORDINACION.md`, `CONTROL_CAMBIOS.md`

### 🛠️ [2026-11-01] - [Plan Maestro en 4 Olas: Membrete Configurable, Chips DUA, Lista de Cotejo + Rúbrica Analítica en PDF NL, iDevice Encuesta en Constructor de Clases y Constructor Dual Encuesta/Quiz Tipo Google Forms (build-568 a build-571)]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(st90): integrar olas 1 a 4 (membrete oficial, chips DUA, lista de cotejo y rubrica PDF NL, iDevice encuesta y constructor dual quiz/forms) en build-571`
- **Causa Raíz / Requerimiento:**
  1. **Ola 1 (`build-568`):** Cerrar las Etapas 3 y 4 del Wizard de Planeación NEM con chips DUA de 1 clic (`.nem-chip-dua-rapido`), Lista de Cotejo editable (`#cajaRubricaCotejoNEM`, `3–5` criterios), generador automático de Rúbrica Analítica SEP de 4 niveles (`Sobresaliente 10`, `Satisfactorio 8-9`, `Básico 6-7`, `Requiere Apoyo 5`) y modal de Membrete Institucional Configurable (`#modalConfigMembreteST90` con respaldo en los escudos oficiales de Nuevo León) conectados al Plano Didáctico PDF.
  2. **Ola 2 (`build-569`):** Incorporar en el Constructor de Clases (`eXeLearning ST90`) el nuevo bloque iDevice `📊 Encuesta / Diagnóstico` (`.idevice-bloque[data-tipo="encuesta"]`) con modalidad de datos previos (resumen ejecutivo IA + gráfica) y modalidad de actividad evaluable vinculada a la matrícula del alumno (`registrarEntregaEncuestaAlumno`).
  3. **Ola 3 (`build-570`):** Evolucionar el Constructor de Encuestas a un Constructor Dual (`📊 Encuesta / Diagnóstico` vs `📝 Quiz Evaluativo`) conservando intactas las 11 columnas de la hoja `Formulario` (metadatos en JSON de columna 11 `extra`) y calificando automáticamente con `calificarQuizAlumnoST90`.
  4. **Ola 4 (`build-571` — Sprints 1–3):** Añadir soporte multimedia por reactivo (`figure.reactivo-media` con zoom/lightbox), retroalimentación diferenciada (`.retro-acierto` / `.retro-fallo`), carga de archivos de evidencia a Google Drive (`subirEvidenciaFormulario`), secciones paginadas (`.barra-progreso-nem`), temporizador de examen (`#barraTemporizadorQuiz` en `sessionStorage`) y barajado Fisher-Yates.
- **Cambios Realizados:**
  - **Antigravity (Backend `.gs`):** Implementados `obtenerMembreteInstitucionalNEM()` y `guardarMembreteInstitucionalNEM()` en `PlaneacionNEM.gs`; `obtenerCatalogoEncuestasParaConstructor()` y `registrarEntregaEncuestaAlumno()` en `15_DirectorioEncuentas.gs`; y `calificarQuizAlumnoST90()` + `subirEvidenciaFormulario()` en `Encuestas.gs`.
  - **DeepSeek (UI/UX & CSS):** Implementados en `ComunCSS.html`, `AdminPlaneacionCSS.html` y `AdminCSS.html` los estilos de `.nem-chips-dua-bar`, `.nem-chip-dua-rapido`, `#cajaRubricaCotejoNEM`, `.nem-tabla-cotejo-edit`, `#modalConfigMembreteST90`, hoja Carta `@media print`, `.idevice-bloque[data-tipo="encuesta"]`, `.constructor-modo-switch`, `.caja-ajustes-quiz`, `figure.reactivo-media`, `.barra-progreso-nem` y `#barraTemporizadorQuiz`.
  - **Cursor (Frontend & DOM):** Implementados en `AyudaJS.html`, `AdminPlaneacion.html`, `Clase.html`, `AdminPlanJS_04.html`, `AdminPlanJS_06.html`, `ClaseJS_06.html`, `ClaseJS_08.html`, `AdminEncuestas.html`, `AdminEncJS_01.html`, `AdminEncJS_04.html` y `FormEncJS_01.html` todos los controladores interactivos de las Olas 1 a 4.
- **Archivos Afectados:** `00_Constantes.gs`, `PlaneacionNEM.gs`, `15_DirectorioEncuentas.gs`, `Encuestas.gs`, `AyudaJS.html`, `AdminPlaneacion.html`, `Clase.html`, `AdminPlanJS_04.html`, `AdminPlanJS_06.html`, `ClaseJS_06.html`, `ClaseJS_08.html`, `AdminEncuestas.html`, `AdminEncJS_01.html`, `AdminEncJS_04.html`, `FormEncJS_01.html`, `AdminPlaneacionCSS.html`, `AdminCSS.html`, `ComunCSS.html`, `CONTROL_CAMBIOS.md`

### 🛠️ [2026-10-31] - [Directorio de Encuestas Completo, Eliminación de Doble Tooltip, Corrección de Serialización de Planeaciones y Formato PDF Oficial Nuevo León (build-567)]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(nem): directorio de encuestas institucional, tooltip unico en siglas DUA/UDEI/BAPyC, fix serializacion Date en obtenerPlaneacionCompletaNEM y Plano Didactico PDF Oficial Nuevo Leon en build-567`
- **Causa Raíz / Requerimiento:**
  1. En `📊 Directorio de encuestas`, al filtrar por combinaciones como `Tecnología · 1° · Trimestre 1`, el selector `#dirSelect` quedaba en blanco sin mostrar encuestas ni resumen diagnóstico.
  2. Al pasar el cursor sobre las siglas de inclusión (`UDEI`, `Inclusión (DUA):`, `?`, `BAPyC`), aparecían dos tooltips simultáneamente (el flotante CSS `data-tip` arriba y el nativo `title` del navegador abajo).
  3. Al pulsar `Sesiones (3)` en una planeación, aparecía el error `"No se encontró la planeación"` porque `obtenerPlaneacionCompletaNEM` en `PlaneacionNEM.gs` devolvía objetos `Date` crudos de Google Sheets (`FechaCreacion`, `FechaInicio`), lo que en `google.script.run` serializa toda la respuesta como `null`.
  4. El usuario solicitó visualizar y descargar la planeación en formato PDF con el diseño oficial de Nuevo León (`PLANO DIDÁCTICO — Subsecretaría de Educación Básica · Dirección de Educación Secundaria · Coordinación Académica · Escuela Secundaria Técnica No. 90`).
- **Cambios Realizados:**
  - **Catálogo Institucional y Selección Reactiva en `📊 Directorio de encuestas` (`15_DirectorioEncuentas.gs` y `AdminPlanJS_02.html`):** Se incorporó `_catalogoEncuestasBaseST90_()` con encuestas diagnósticas y resúmenes IA listos para todas las asignaturas (`Tecnología 1° T1`, `Español`, `Matemáticas`, `Ciencias`, `Geografía`, `Historia`, `FCyE`), preselección automática de la primera encuesta en `#dirSelect` (`selectedIndex = 0`) y despliegue inmediato de su resumen y botón `📋 Insertar en la planeación`.
  - **Tooltip Único en Siglas de Inclusión (`AdminPlaneacion.html`, `Clase.html`, `AdminPlanJS_03.html`, `ClaseJS_05.html`, `AyudaJS.html`):** Se retiró el atributo nativo `title` de los elementos que usan `data-tip` (conservando `aria-label` para accesibilidad), eliminando por completo el segundo tooltip nativo del navegador.
  - **Corrección de `obtenerPlaneacionCompletaNEM` y Respaldo en Memoria (`PlaneacionNEM.gs`, `AdminPlanJS_05.html`, `ClaseJS_07.html`):** Se convirtieron todos los campos `Date` a cadena ISO y se envolvió el retorno en `JSON.parse(JSON.stringify(...))` en `PlaneacionNEM.gs`, además de añadir auto-generación de sesiones y respaldo automático desde `listaPlanNEM` en el cliente.
  - **Vista Previa y Descarga en PDF — Formato Oficial Nuevo León (`AyudaJS.html`, `AdminPlanJS_02.html`, `ClaseJS_04.html`, `AdminPlaneacion.html`, `Clase.html`):** Se implementó `abrirVistaPreviaPDFPlaneacionNEM()` e `imprimirDescargarPDFPlaneacionNEM_()` con los escudos oficiales de `NL Educación` y `Gobierno del Nuevo Nuevo León`, tabla institucional de datos generales, cronograma de sesiones (4 momentos DUA de 40 min), lista de cotejo formativa y bloque de firmas (`Docente Titular` y `Visto Bueno Dirección / Subdirección`).
- **Archivos Afectados:** `15_DirectorioEncuentas.gs`, `PlaneacionNEM.gs`, `AyudaJS.html`, `AdminPlanJS_02.html`, `AdminPlanJS_03.html`, `AdminPlanJS_05.html`, `ClaseJS_04.html`, `ClaseJS_05.html`, `ClaseJS_07.html`, `AdminPlaneacion.html`, `Clase.html`, `00_Constantes.gs`, `CONTROL_CAMBIOS.md`

### 🛠️ [2026-10-31] - [Bloqueo Normativo de Campo Formativo por Asignatura, Asesora Pedagógica "Lucy" y Voz Femenina en Asistente de Voz (build-566)]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(nem): bloqueo normativo de Campo Formativo por asignatura, asesora pedagogica Lucy y seleccion de voz femenina en build-566`
- **Causa Raíz / Requerimiento:**
  1. El selector `Campo Formativo *` (`#planCampoFormativo`) permitía edición manual aun cuando cada asignatura de secundaria (Fase 6 SEP) pertenece por norma inmutable a un único Campo Formativo.
  2. La asesora pedagógica lleva por nombre **Lucy** y su síntesis de voz (Web Speech API) debía seleccionar prioritariamente una voz femenina en español.
- **Cambios Realizados:**
  - **Bloqueo Normativo de `#planCampoFormativo`:** Se configuró `disabled = true` con candado visual `🔒` y asignación automática inmutable según la disciplina en `AdminPlaneacion.html`, `Clase.html`, `AdminPlanJS_03.html`, `AdminPlanJS_04.html` y `ClaseJS_05.html`, evitando también que borradores de `localStorage` sobrescriban el campo formativo de otra materia.
  - **Identidad de la Asesora Pedagógica "Lucy":** Actualizados encabezados, tooltips, saludo inicial y prompt del sistema (`AyudaJS.html` y `PlaneacionNEM.gs`) como **Lucy · Asesora Pedagógica NEM**.
  - **Voz de Mujer en Web Speech API (`elegirVozFemeninaEspanol_`):** Se implementó un selector ponderado de voces en español (`es-MX` / `es-*`) que prioriza voces femeninas (`Sabina`, `Dalia`, `Paulina`, `Helena`, `Laura`, `Mónica`, `Paloma`, `Elvira`, `Google español`) y descarta voces masculinas (`Raúl`, `Jorge`, `Álvaro`, `Pablo`, `Diego`), con `pitch = 1.08`.
- **Archivos Afectados:** `AdminPlaneacion.html`, `Clase.html`, `AdminPlanJS_01.html`, `AdminPlanJS_03.html`, `AdminPlanJS_04.html`, `AdminPlanJS_06.html`, `ClaseJS_05.html`, `AyudaJS.html`, `PlaneacionNEM.gs`, `00_Constantes.gs`, `CONTROL_CAMBIOS.md`

### 🛠️ [2026-10-31] - [Fila 1 en Una Sola Línea, Alineación de Listas Desplegables en Etapa 2 y Tooltips en Siglas UDEI / DUA / BAPyC (build-565)]
- **Mensaje de Commit sugerido (Conventional Commits):** `style(nem): fila 1 en una sola linea, listas desplegables Etapa 2 alineadas e identicas y tooltips en siglas UDEI/DUA/BAPyC en build-565`
- **Causa Raíz / Requerimiento:**
  1. En Etapa 1 (`.nem-fila-una`), el docente solicitó organizar los 4 campos (`Título del Proyecto *`, `Campo Formativo *`, `Metodología *`, `Sesiones (40m) *`) en una sola fila horizontal.
  2. En Etapa 2 (`.nem-catalogo-dos-col`), la lista desplegable derecha (`#selPDANEM` dentro de `#listaPDAsCheckboxNEM`) parecía estar encerrada dentro de un contenedor adicional con borde y padding (`#listaPDAsCheckboxNEM`), quedando desalineada respecto a `#selContenidoSinteticoNEM` de la izquierda.
  3. Añadir tooltips explicativos con el significado de cada sigla en la sección de inclusión (`UDEI`, `Inclusión (DUA):`, `?`, `BAPyC Grupo con barreras para el aprendizaje, la participación y la convivencia`, y `⚠️ BAPyC detectadas en grupo`).
- **Cambios Realizados:**
  - **Etapa 1 en una sola fila (`.nem-fila-una`):** Reordenados los 4 campos y configurado `grid-template-columns: minmax(220px, 2.2fr) minmax(160px, 1.35fr) minmax(160px, 1.35fr) 128px` con `grid-column: span 1` en `AdminPlaneacion.html`, `Clase.html`, `AdminPlaneacionCSS.html` y `ClaseCSS.html`.
  - **Listas desplegables alineadas e idénticas en Etapa 2 (`#selContenidoSinteticoNEM` y `#selPDANEM`):** Se eliminó el borde, fondo y relleno contenedor de `#listaPDAsCheckboxNEM` (`border: none; padding: 0; background: transparent;`) y se unificaron alturas (`38px`), bordes (`1.5px solid #86efac`), tipografía (`13px`, `#14532d`) y encabezados (`height: 24px; margin: 0 0 4px;`).
  - **Tooltips en siglas de inclusión (`#secInclusionBAPyC`):** Se agregaron atributos `title` y tooltips flotantes `data-tip` en `.nem-badge-udei` (*UDEI: Unidad de Educación Especial y Educación Inclusiva*), `.nem-dua-label` (*DUA: Diseño Universal para el Aprendizaje*), `.nem-ayuda-paso` (*? Glosario de UDEI, DUA y BAPyC*), `.nem-chip-bapyc` (*BAPyC: Barreras para el Aprendizaje, la Participación y la Convivencia*) y `#badgeAlertaBAPyC` (*⚠️ BAPyC detectadas en grupo*).
- **Archivos Afectados:** `AdminPlaneacion.html`, `Clase.html`, `AdminPlaneacionCSS.html`, `ClaseCSS.html`, `ComunCSS.html`, `AdminPlanJS_03.html`, `AdminPlanJS_04.html`, `ClaseJS_05.html`, `ClaseJS_06.html`, `00_Constantes.gs`, `CONTROL_CAMBIOS.md`

### 🛠️ [2026-10-31] - [Desaturación Visual UI/UX de Planeación, Reparación Íntegra de Avatar y Etapa 2 con Autoguardado (build-563)]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(ui): desaturacion visual de Etapa 1 y 2, reparacion integra de avatar base64 y autoguardado localStorage en build-563`
- **Causa Raíz / Requerimiento:**
  1. El avatar de la Asesora Pedagógica (`AVATAR_ASESOR_NEM_B64_`) presentaba corrupción de bytes en su mitad inferior (longitud base64 no múltiplo de 4), mostrando un recuadro negro/gris debajo de los ojos.
  2. La interfaz de Planeación NEM (Etapa 1) tenía saturación visual: 8 micro-iconos (`❓ ✨`) incrustados dentro de las pestañas del Stepper, doble botón (`❓` rojo + `🔊` bocina) en cada `<label>` que rompía la etiqueta de *Sesiones (40m)* en dos renglones, banner superior lleno de cajas con borde y 4 campos apretados en una sola fila.
  3. Aún no se había ejecutado `clasp push / deploy` a Google Apps Script para reflejar los cambios en el navegador en vivo.
- **Cambios Realizados:**
  - **Reparación Íntegra del Avatar (`AyudaJS.html`):** Se generó un retrato circular 3D completo de la Asesora Pedagógica NEM y se codificó directamente por buffer binario (`6,864` caracteres base64, múltiplo exacto de 4, marcador JPEG EOI `FFD9` verificado), eliminando cualquier recorte o corrupción.
  - **Desaturación Visual en `AdminPlaneacion.html`, `Clase.html`, `AdminPlaneacionCSS.html`, `ClaseCSS.html` y `ComunCSS.html`:**
    - Se retiraron los 8 iconos `❓ ✨` del interior de las pestañas `#tabPasoPlan1..4`.
    - Se desactivó la inyección de botones `🔊` (`.btn-voz-nem`) en los `<label>` del formulario (manteniendo la lectura por voz dentro de `#modalAyudaNEM` y en `#drawerAsistenteIA`).
    - Se sustituyó el emoji rojo `❓` por un botón circular discreto `?` de 18px en gris neutro (`#64748b`).
    - Se rediseñó `.nem-fila-una` en una rejilla respirable de 2 filas: Fila 1 con *Título del Proyecto* (`3fr`) + *Sesiones (40m)* (`1fr`), y Fila 2 con *Campo Formativo* (`2fr`) + *Metodología* (`2fr`).
    - Se aplanó `#bannerClaseNEM` eliminando los bordes de caja en cada metadato para dejar una cinta editorial limpia con separadores `•`.
  - **Etapa 2 (Contenidos & PDA), Barra de Progreso y Autoguardado `localStorage`:**
    - Tarjetas interactivas `.card-contenido-nem` con badges semánticos por Campo Formativo, barra de progreso en el Stepper (`25% · 50% · 75% · 100%`) con estado `.completado` (`✓`), y respaldo automático en `localStorage` (`st90_borrador_plan_nem`).
- **Archivos Afectados:** `AyudaJS.html`, `AdminPlaneacion.html`, `Clase.html`, `AdminPlaneacionCSS.html`, `ClaseCSS.html`, `ComunCSS.html`, `00_Constantes.gs`, `ESTADO_COORDINACION.md`, `CONTROL_CAMBIOS.md`

### 🛠️ [2026-10-31] - [Asesora Pedagógica Ilustrada, Inserción Reactiva de Título con IA y Clarificación Normativa NEM (build-562)]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(ux): avatar ilustrado de asesora pedagogica, sugerir e insertar titulo con 1 clic y alineacion normativa NEM Fase 6 en build-562`
- **Causa Raíz / Requerimiento:**
  1. El docente requería comprender qué campos de la Fila 1 (Etapa 1: *Título del Proyecto*, *Campo Formativo*, *Metodología*, *Sesiones*) son obligatorios e inmutables por la estructura curricular de la Nueva Escuela Mexicana (NEM) y cuáles pertenecen a la autonomía profesional docente.
  2. Sustituir el avatar genérico del robot (`🤖`) por una imagen cálida, profesional y empática de una Asesora Pedagógica de secundaria técnica.
  3. Integrar un botón `✨ Sugerir con IA` y la capacidad de insertar títulos sugeridos directamente al formulario con un solo clic.
- **Cambios Realizados:**
  - **Clarificación Pedagógica y Normativa NEM (Fase 6):**
    - *Campo Formativo:* Obligatorio por asignación curricular oficial de la SEP según la disciplina (ej. Tecnología pertenece obligatoriamente a *De lo Humano y lo Comunitario*; Geografía a *Ética, Naturaleza y Sociedades*).
    - *Metodología:* Flexible / Autonomía docente. Aunque la SEP sugiere una de referencia por campo (Aprendizaje Servicio para De lo Humano, STEAM para Saberes, ABP para Ética, Proyectos Comunitarios para Lenguajes), el docente puede cambiarla libremente para abordar su proyecto.
    - *Sesiones (40 min):* Flexible (3 a 25 sesiones). En Tecnología ST90 se organiza con la estructura CECSE (2h teoría / 6h cómputo).
    - *Título del Proyecto:* Debe cambiarse obligatoriamente para reflejar el problema comunitario, el producto y la identidad del proyecto grupal, superando las etiquetas técnicas provisionales.
  - **Avatar Ilustrado de la Asesora Pedagógica:**
    - Se generó y optimizó la imagen de la Asesora Pedagógica en miniatura de 128x128 píxeles en formato base64 embebido (`AVATAR_ASESOR_NEM_B64_` en `AyudaJS.html`).
    - Se reemplazó el emoji de robot `🤖` en el botón flotante (`#btnAsistenteFlotanteIA`), en la cabecera del drawer lateral (`.ia-avatar`), y se sustituyeron los iconos de etapas por el distintivo de asesoría `✨`.
  - **Sugerencia e Inserción de Título con 1 Clic:**
    - Se integró el botón `#btnSugerirTituloIA` (`✨ Sugerir con IA`) en el encabezado del campo `#planTitulo` en `AdminPlaneacion.html` y `Clase.html`.
    - Al pulsar el botón, la Asesora IA genera 3 propuestas de títulos contextualizados, atractivos y motivadores entre comillas `"..."`.
    - La función `pintarBurbuja_` analiza las respuestas de IA y crea automáticamente botones chip interactivos `[➕ Usar este título]`.
    - La función `aplicarTituloAlPlan(nuevoTitulo)` inyecta el título elegido al `<input id="planTitulo">`, dispara los eventos de actualización y añade una micro-animación visual destacada.
  - **Despliegue a Producción (@562):** Versión `@562` desplegada en los 5 endpoints oficiales de Google Apps Script y validada con diagnóstico HTTP 200 en vivo (`build: "build-562"`, `totalAdmin: 14`).
- **Archivos Afectados:** `AyudaJS.html`, `AdminPlaneacion.html`, `Clase.html`, `ComunCSS.html`, `00_Constantes.gs`, `ESTADO_COORDINACION.md`, `CONTROL_CAMBIOS.md`

### 🛠️ [2026-10-31] - [Asistente de Voz DUA: Narración en Iconos de Ayuda y Respuestas IA, y Dictado por Voz (build-561)]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(voz): asistente de voz accesible DUA con narracion en iconos de ayuda, lectura de respuestas IA y dictado por voz en build-561`
- **Causa Raíz / Requerimiento:** El usuario solicitó la integración del asistente de voz tanto en la Asistencia de IA como en cada icono de ayuda pedagógica para apoyar la accesibilidad y el Diseño Universal para el Aprendizaje (DUA), permitiendo escuchar orientaciones sin necesidad de lectura visual y dictar consultas con micrófono.
- **Cambios Realizados:**
  - **Asistente de Voz en Iconos de Ayuda (`.btn-voz-nem`):**
    - Se creó la función `asegurarBotonesVozCampos_()` que inyecta automáticamente un botón de voz `🔊` accesible al lado de cada botón de ayuda `❓` en todos los formularios de planeación.
    - Al hacer clic en `🔊`, sintetiza en voz alta (Web Speech API `es-MX`) la orientación curricular del campo: título, propósito formativo, cómo llenarlo en el aula y ejemplo viable.
    - El botón muestra un pulso animado visual (`.reproduciendo`) y conmuta a `⏹️` para permitir pausar o detener la narración en cualquier instante.
  - **Narración en el Modal de Ayuda Pedagógica (`#modalAyudaNEM`):**
    - Se integró el botón `#btnNarrarModalAyuda` (*🔊 Escuchar orientación*) en el pie del modal, permitiendo reproducir o pausar la lectura completa de la ayuda abierta.
    - Se detiene automáticamente cualquier voz en reproducción al cerrar el modal o pulsar la tecla Escape.
  - **Asistente de Voz en el Drawer de IA (`#drawerAsistenteIA`):**
    - **Lectura de Respuestas IA:** En cada burbuja de respuesta del asistente (`.msg-ia`), se anexó el botón `🔊 Escuchar` (`.btn-voz-ia-msg`) para narrar la respuesta didáctica de la IA de forma clara.
    - **Dictado por Voz con Micrófono (`#btnMicrofonoIA`):** En el compositor del chat se integró el botón `🎙️` con reconocimiento de voz en tiempo real (`webkitSpeechRecognition`), permitiendo a los docentes dictar sus consultas pedagógicas directamente al campo de texto.
  - **Estilos Visuales en `ComunCSS.html`:** Estilos para `.btn-voz-nem`, `.btn-voz-modal-nem`, `.btn-microfono-ia` (con pulso rojo mientras escucha) y `.btn-voz-ia-msg`.
  - **Despliegue a Producción (@561):** Versión `@561` desplegada en los 5 endpoints oficiales de Google Apps Script y validada con diagnóstico en vivo (`build: "build-561"`, `totalAdmin: 14`).
- **Archivos Afectados:** `ComunCSS.html`, `AyudaJS.html`, `00_Constantes.gs`, `CONTROL_CAMBIOS.md`

### 🛠️ [2026-10-31] - [Autonomía Profesional Docente: Desbloqueo de Metodología y Campo Formativo en Planeación NEM (build-560)]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(planeacion): desbloqueo de selectores de metodologia sociocritica y campo formativo respetando autonomia docente NEM en build-560`
- **Causa Raíz Diagnosticada:** Al seleccionar una clase o asignatura en el formulario de planeación (ej. *Geografía* o *Español*), la función `actualizarCatalogoPDAParaClase_` en `AdminPlanJS_04.html` y `ClaseJS_05.html` ejecutaba `selMet.disabled = true;` y `selCampo.disabled = true;`. Esto bloqueaba físicamente el `<select id="planMetodologia">`, mostrándolo atenuado/grisáceo y privando al docente de hacer clic para elegir otra opción. Dicha restricción contradecía el principio de **Autonomía Profesional del Magisterio** de la SEP (Fase 6), el cual establece que las 4 metodologías sociocríticas (*Proyectos Comunitarios*, *STEAM*, *ABP*, *Aprendizaje Servicio*) son sugerencias de referencia, pero el docente tiene plena libertad de elegir la metodología que mejor se adapte al problema comunitario o propósito del proyecto.
- **Cambios Realizados:**
  - **Eliminación del Bloqueo Forzado:** En `AdminPlanJS_04.html` y `ClaseJS_05.html`, se reemplazó el bloqueo por una autoselección recomendada abierta (`selMet.disabled = false;`, `selCampo.disabled = false;`).
  - **Flexibilidad Curricular:** El sistema selecciona automáticamente la metodología sugerida oficial por disciplina al elegir la clase, pero permite al docente cambiarla libremente a cualquiera de las 4 opciones de la NEM según su criterio pedagógico.
  - **Despliegue a Producción (@560):** Versión `@560` desplegada en los 5 endpoints oficiales de Google Apps Script y validada con diagnóstico HTTP 200 en vivo (`ok: true`, `build: "build-560"`, `totalAdmin: 14`).
- **Archivos Afectados:** `AdminPlanJS_04.html`, `ClaseJS_05.html`, `00_Constantes.gs`, `CONTROL_CAMBIOS.md`

### 🛠️ [2026-10-31] - [Alineación Estricta a Planes y Programas SEP (Fase 6) y Sincronización de Trimestre según Calendario (build-559)]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(ia): sincronizacion reactiva del trimestre segun fecha del calendario y alineacion estricta a planes SEP Fase 6 en build-559`
- **Causa Raíz / Requerimiento:** Se requería que el Asistente Pedagógico IA detectara y respetara dinámicamente el trimestre escolar seleccionado por el docente en el calendario escolar (`#planFechaInicio` / `#planPeriodo`) y que todas las propuestas, contenidos, PDA y orientaciones pedagógicas estuvieran rigurosamente ajustadas a los Planes y Programas de Estudio oficiales de la SEP (Fase 6 - Educación Secundaria) para dicho trimestre.
- **Cambios Realizados:**
  - **Sincronización Reactiva de Calendario en `AyudaJS.html`:**
    - Se implementó `calcularTrimestreSEP_Local(fecha)` respetando el calendario oficial de la SEP para secundaria: Trimestre 1 (Ago - Nov), Trimestre 2 (Dic - Mar) y Trimestre 3 (Abr - Jul).
    - Se agregaron listeners a eventos `change` y `input` en el selector de fecha del calendario (`#planFechaInicio`) y periodo (`#planPeriodo`), actualizando al instante el chip de contexto superior del drawer (`📍 Geografía 1° · Trimestre 1 · Metadatos y ejes`) y los chips de sugerencia rápida (`💡 3 ideas SEP · Geografía 1° (Trimestre 1)`).
    - Se envía un payload enriquecido a `consultarAsistenteIAPaso` con `trimestre`, `periodo`, `fecha`, `contenidoSintetico`, `pda` y `problema`.
  - **Alineación Curricular Obligatoria en `PlaneacionNEM.gs` (`consultarAsistenteIAPaso`):**
    - Se incorporó la `directivaSEP`: exige estricto cumplimiento del programa sintético/analítico oficial de la SEP Fase 6 para la asignatura, grado y trimestre específicos seleccionados en el calendario escolar.
    - Se prohíbe sugerir PDA o contenidos de otros trimestres o grados distintos al activo.
    - Se articula la respuesta con los 7 Ejes Articuladores de la NEM y el Diseño Universal para el Aprendizaje (DUA).
  - **Despliegue a Producción (@559):** Versión `@559` desplegada en los 5 endpoints oficiales de Google Apps Script y validada con diagnóstico en vivo (`ok: true`, `build: "build-559"`, `totalAdmin: 14`).
- **Archivos Afectados:** `AyudaJS.html`, `PlaneacionNEM.gs`, `00_Constantes.gs`, `CONTROL_CAMBIOS.md`

### 🛠️ [2026-10-31] - [Contextualización Disciplinar Estricta del Asistente IA por Asignatura (build-558)]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(ia): contextualizacion disciplinar estricta por asignatura activa y segregacion de reglas CECSE a Tecnologia en build-558`
- **Causa Raíz Diagnosticada:** Al pulsar el chip de sugerencia rápida `💡 Dame 3 ideas para mi grado` estando en la clase de Geografía 1°A, el asistente IA respondía con proyectos de ofimática (Word para 1°, Excel para 2°, PowerPoint/IA para 3° y 6h en CECSE). Esto ocurría porque:
  1. El cliente `AyudaJS.html` enviaba como contexto únicamente la cadena genérica `"Metadatos y ejes"`, sin transmitir la asignatura (`Geografía`), el grado (`1°`), ni el campo formativo (`Ética, Naturaleza y Sociedades`).
  2. En el backend `PlaneacionNEM.gs`, la directiva de Tecnología CECSE (Word, Excel, PowerPoint) estaba insertada en el prompt de sistema como una regla global incondicional, provocando que la IA asumiera erróneamente el perfil de Tecnología ante cualquier consulta donde la asignatura no viniera explícita.
- **Cambios Realizados:**
  - **Extracción de Metadatos Activos en `AyudaJS.html` (`obtenerMetadatosClaseActiva_`):** Detecta dinámicamente la asignatura, grado, grupo, campo formativo, metodología y título de la clase seleccionada (leyendo `#planAsignatura`, `#txtEncabezadoMateriaGrupo`, `#planGrado` o el banner superior).
  - **Sincronización del Chip y Sugerencias Contextuales:** El chip superior del drawer ahora muestra `📍 Geografía 1° · Metadatos y ejes`, y el chip interactivo se adapta a `💡 3 ideas para Geografía 1°` (reservando `🎯 Ajustar a contexto CECSE` exclusivamente para cuando la materia es Tecnología).
  - **Segregación Disciplinar Estricta en `PlaneacionNEM.gs` (`consultarAsistenteIAPaso`):** Si la materia es Tecnología, se aplican las reglas CECSE (Word, Excel, PowerPoint y horas de cómputo); si la materia es cualquier otra (Geografía, Historia, Español, Matemáticas, etc.), se prohíbe explícitamente sugerir Word/Excel/PowerPoint/CECSE y se exige apego 100% al programa de la disciplina de la NEM.
  - **Despliegue a Producción (@558):** Versión `@558` activa en los 5 despliegues de Google Apps Script y verificada con diagnóstico HTTP 200 en vivo.
- **Archivos Afectados:** `AyudaJS.html`, `PlaneacionNEM.gs`, `00_Constantes.gs`, `CONTROL_CAMBIOS.md`

### 🛠️ [2026-10-31] - [Corrección de Apertura e Interacción: Iconos de Ayuda Pedagógica NEM ❓ y Asistente IA 🤖 (build-557)]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(ui): correccion de clases visible/abierto en modal ayuda NEM, estructura semantica de drawer asistente IA y enlace de eventos en build-557`
- **Causa Raíz Diagnosticada:** Los iconos de ayuda `❓` y asistente `🤖` eran visibles en la interfaz pero parecían no funcionar al hacer clic ("si los veo pero no funcionan") debido a 3 causas encadenadas:
  1. **Discrepancia de Estados CSS (`.visible` / `.abierto` vs `.oculto`):** El CSS de DeepSeek en `AdminPlaneacionCSS.html` y `ComunCSS.html` condiciona la opacidad (`opacity: 1; pointer-events: auto;`) y la visibilidad del drawer (`visibility: visible; transform: none;`) a las clases `.visible` o `.abierto`. Sin embargo, `mostrarOverlay_` en `AyudaJS.html` únicamente removía `.oculto`, dejando el modal en `opacity: 0; pointer-events: none;` y el drawer fuera de pantalla.
  2. **Estructura Interna Desalineada del DOM:** `asegurarModalAyuda_()` y `asegurarDrawerAsistente_()` creaban contenedores planos sin las clases de diseño (`.ayuda-nem-panel`, `.ayuda-nem-cabecera`, `.ayuda-nem-cuerpo`, `.ayuda-nem-bloque--*`, `.ia-drawer-velo`), impidiendo el renderizado visual adecuado.
  3. **Ausencia de `AyudaJS.html` y Botones en `Clase.html`:** El script solo estaba incluido en `Admin.html`, y los botones `.btn-ayuda-nem` solo se encontraban en `AdminPlaneacion.html`.
- **Cambios Realizados:**
  - **Sincronización de Clases de Overlay en `AyudaJS.html`:** `mostrarOverlay_` y `ocultarOverlay_` ahora añaden y retiran de forma reactiva las clases `.visible` y `.abierto`, además de alternar el velo de fondo `#iaDrawerVelo`.
  - **Estructura Semántica Completa en `asegurarModalAyuda_()` y `asegurarDrawerAsistente_()`:** Construcción del árbol DOM con las clases exactas diseñadas por DeepSeek: tarjeta cabecera con avatar e insignias, bloques pedagógicos (`#modalAyudaProposito`, `#modalAyudaComoLlenar`, `#modalAyudaEjemplo`), botón `.ayuda-nem-entendido`, chips de sugerencia rápida y compositor de chat con `#txtMensajeAsistente`.
  - **Mapeo Robusto de Claves de Ayuda (`normalizarClaveAyuda_`):** Soporte bidireccional entre los IDs del DOM (`planTitulo`, `planCampoFormativo`, `planMetodologia`, `planNumSesiones`, `planContenidoSintetico`, `planPDA`, `planProblema`, `planAjustesRazonables`, `planProposito`) y las entradas pedagógicas del `DICCIONARIO_AYUDA_NEM`.
  - **Conexión de Botones del Stepper:** `abrirAyudaPasoPlan_(paso)` y `abrirAsistentePasoNEM_(paso)` conectadas a la apertura del modal pedagógico y del drawer IA con contexto del paso activo.
  - **Integración y Paridad en `Clase.html`:** Incluido `<?!= include('AyudaJS') ?>` e integrados los botones `.btn-ayuda-nem` en todos los labels del formulario de planeación del docente.
  - **Despliegue a Producción (@557):** Desplegado en los 5 endpoints oficiales de Google Apps Script con verificación HTTP 200 en vivo.
- **Archivos Afectados:** `AyudaJS.html`, `Clase.html`, `00_Constantes.gs`, `CONTROL_CAMBIOS.md`

### 🛠️ [2026-10-31] - [Backend Suite Escolar ST90: Biblioteca de Recursos, Asistente Contextual IA y Adecuación Tecnología CECSE (build-556)]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(backend): modulo BibliotecaRecursos, endpoint de chat IA contextual y directivas curriculares CECSE en build-556`
- **Causa / Requerimiento:** Expansión del ecosistema "Suite Escolar ST90" a plataforma LMS integral para secundaria, incorporando soporte backend para el Repositorio Colectivo y catálogo SEP Oficial (Fase 6), endpoint de asistencia reactiva con DeepSeek para el drawer flotante, y adecuación curricular estricta de la asignatura de Tecnología vinculada al CECSE.
- **Cambios Realizados:**
  - **Estructura de Base de Datos en `00_Constantes.gs` y `03_Setup.gs`:** Se añadió `ENCABEZADOS.BibliotecaRecursos` con las columnas `[Id, Titulo, Tipo, Asignatura, Grado, Trimestre, URL_Drive, Autor, Fecha]`, y se integró auto-creación y sincronización de columnas en `_asegurarSetup_()` para la pestaña `BibliotecaRecursos`.
  - **Módulo `Biblioteca.gs`:** Se implementaron las funciones `catalogoLibrosSEPOficiales_()` (catálogo de libros SEP oficiales Fase 6 para 1°, 2° y 3°), `subirRecursoBiblioteca(token, datos)` (con `LockService` y normalización de metadatos), `listarRecursosBiblioteca(filtros)` (con soporte de búsqueda y filtrado reactivo por asignatura, grado, trimestre y texto) y `eliminarRecursoBiblioteca(token, idRecurso)` con control de acceso por propietario o admin.
  - **Adecuación Curricular para Tecnología (CECSE) en `PlaneacionNEM.gs`:** En `asistirDisenoProyectoNEM`, se inyectaron directivas obligatorias para la asignatura Tecnología:
    - 1° Grado: Uso de procesadores de texto (Word) y ofimática básica.
    - 2° Grado: Hojas de cálculo (Excel) y análisis de datos.
    - 3° Grado: Presentaciones (PowerPoint) e IA aplicada, exigiendo mención explícita de "PowerPoint", "IA" y el "CECSE".
    - Carga horaria: 2 horas de Teoría y 6 horas de Práctica en el CECSE (Aula de Cómputo).
  - **Endpoint de Asistente IA en Tiempo Real (`consultarAsistenteIAPaso`):** En `PlaneacionNEM.gs`, se programó el endpoint que atiende al drawer flotante con contexto dinámico de la pantalla activa del docente y respuesta de DeepSeek en tiempo real.
  - **Verificación de Sintaxis y Símbolos:** Validación exitosa con `node herramientas/manifiesto.js` (76 documentos evaluados, 0 documentos sin parsear).
- **Archivos Afectados:** `00_Constantes.gs`, `03_Setup.gs`, `Biblioteca.gs`, `PlaneacionNEM.gs`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas:** Proporciona la infraestructura backend completa y segura para que el frontend de Cursor y los estilos de DeepSeek se conecten sin fricción y con plena compatibilidad de concurrencia.

### 🛠️ [2026-10-30] - [Erradicación de check_sites, Serialización Primitiva de Fechas y Blindaje Cuadrícula (build-555)]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(backend): erradicacion de check_sites en Apps Script, saneamiento de fechas Date a primitivos ISO y blindaje de cuadricula en build-555`
- **Causa Raíz Diagnosticada:** Un script de prueba local (`check_sites.js`) fue inadvertidamente empaquetado y subido a Google Apps Script por `clasp push`, provocando una excepción fatal global `ReferenceError: require is not defined (línea 1, archivo "check_sites")` que tumbaba el 100% de las invocaciones a `google.script.run` y devolvía páginas de error HTML silenciosas al cliente. Además, las celdas de fecha de Google Sheets (`FechaCreacion`, `FechaInicio`) retornaban instancias de `Date` nativas que fallaban al serializarse en el sandbox de iframe de Google Sites.
- **Cambios Realizados:**
  - **Erradicación y Blindaje en `.claspignore`:** Se añadieron las reglas `**/*.js` y `*.js` a `.claspignore` para impedir permanentemente que scripts de Node.js o pruebas locales se suban como código servidor de Apps Script. Con `clasp push --force`, el archivo remoto corruptor `check_sites` fue completamente eliminado del runtime de Google Apps Script.
  - **Saneamiento de Fechas y Serialización Primitiva en `PlaneacionNEM.gs`:** Se implementó `_fmtFechaIsoGas_` para formatear cualquier objeto `Date` a strings ISO/locales limpios antes de responder, y se envolvió la respuesta de `listarPlaneacionesNEM` en `JSON.parse(JSON.stringify(...))` asegurando primitivos 100% serializables sin tipos no clonables.
  - **Resiliencia de Frontend en `AdminPlanJS_02.html` y `ClaseJS_04.html`:** Tolerancia dual en `gsRun('listarPlaneacionesNEM')` para aceptar respuestas de tipo array u objeto estructurado con `totalEnBase`, y visualización interactiva de errores con botón de reintento en caso de interrupciones de red.
  - **Despliegue Global Unificado (@555):** Generada la versión oficial `555` (`v417 · build-555`) y desplegada en los 5 endpoints activos:
    1. Google Sites (`AKfycbz1-xheu_68hU7LpM0_3sUSfqwsb1Hw775eWuHgwmPTJWtvGY7cCh0AR4zcq2Lg32DIBQ`)
    2. Web App Direct / Admin (`AKfycbzPQDTjMqHGpSfBg3KMrDBpxSweOAk2x5adcMLJ4aJHvM2ETGtGI-rm1bz3aDRxj-FAgQ`)
    3. Asistencia (`AKfycbwYr2eeYCG7o0fKe1pJr70ljjXsXaA4RUtoM07RdSjtrU0_DTOjOIpG19GIbYtknxWGUg`)
    4. Réplica 4 (`AKfycbxDw5ITzPHqaX68RdZ8F2Xpywp_dZX8ORz3k00ZVrpmarmDGgCYxgjkRfYrfJKRUDJ1Ug`)
    5. Réplica 5 (`AKfycbzkoAhW2vraK6fpgKH3AZ6mpMRctfmPHWjF4lMFYE2Ku1aptJTz68Ga2jI3g8ZcPikOHw`)
  - **Verificación en Vivo:** Comprobado mediante `curl.exe` y diagnóstico `st90diag2026`: retorno HTTP 200 con `{ ok: true, build: "build-555", totalFilas: 14, totalAdmin: 14 }`.
- **Archivos Afectados:** `.claspignore`, `00_Constantes.gs`, `PlaneacionNEM.gs`, `AdminPlanJS_02.html`, `ClaseJS_04.html`, `ESTADO_COORDINACION.md`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas:** Resuelve definitivamente el congelamiento y la pantalla vacía de "0 planeaciones" reportada por el usuario, dejando el banco personal y el repositorio global 100% operativos.

### 🛠️ [2026-10-30] - [Paridad Completa de Clase.html: Función Demo, Forzado de Filtros y Blindaje Sheets (build-553)]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(clase): paridad de sembrarDemoPlaneaciones en ClaseJS, reseteo forzado de filtros y conexion robusta sheets en build-553`
- **Cambios Realizados:**
  - **Inclusión de `sembrarDemoPlaneaciones_()` en `ClaseJS_04.html`:** Se implementó la función completa que faltaba en el visor de clase (`Clase.html`), resolviendo el error silencioso de JavaScript que ocurría al pulsar `🌱 Cargar Proyectos Demo` en la vista incrustada.
  - **Forzado de Reseteo en `cargarListaPlaneacionesNEM(forzar)`:** Tanto en `ClaseJS_04.html` como en `AdminPlanJS_02.html`, el parámetro `forzar === true` (invocado por el botón `🔄 Ver Todos los Proyectos`) ahora restablece explícitamente en el DOM y en las variables en memoria todos los campos de filtrado (`grado = ''`, `grupo = ''`, `asignatura = ''`, `trimestre = ''`, `docente = ''`), garantizando que se consulten y muestren los 14 proyectos didácticos guardados en Google Sheets.
  - **Blindaje de Conexión a Google Sheets en `PlaneacionNEM.gs`:** Se añadió validación estricta tras `_obtenerLibro_()`, arrojando una excepción descriptiva si el libro no puede abrirse en lugar de retornar un array vacío silencioso que hacía creer erróneamente al frontend que la base de datos tenía 0 planeaciones.
  - **Verificación en Vivo Multi-Endpoint:** Confirmadas las 14 planeaciones didácticas guardadas (incluyendo `PLN-2553AC8D-D` "Voces que transforman") mediante curl directo y autenticado en los 5 despliegues de producción (`@553`).
- **Archivos Afectados:** `00_Constantes.gs`, `PlaneacionNEM.gs`, `ClaseJS_04.html`, `AdminPlanJS_02.html`, `02_Rutas.gs`, `ESTADO_COORDINACION.md`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Garantiza que tanto en la vista Admin como en la vista Clase Hablada de Google Sites, el usuario pueda ver inmediatamente sus planeaciones guardadas, limpiar cualquier filtro accidental con un clic, y ejecutar la generación de proyectos demo sin fallos.

### 🛠️ [2026-10-30] - [Corrección de Filtros Fantasma y Despliegue de Proyectos en Mi Banco Personal (build-542)]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(planeacion): desvincular filtro docente en banco personal, boton reactivo ver todos y despliegue build-542`
- **Cambios Realizados:**
  - **Aislamiento de Filtro Docente:** En `PlaneacionNEM.gs:listarPlaneacionesNEM()`, se condicionó el filtrado por docente estrictamente a `banco === 'global'`. En "Mi Banco Personal" el campo docente autofiltrado o residual del navegador nunca suprime las planeaciones del usuario.
  - **Normalización de Grupo:** En `PlaneacionNEM.gs`, se corrigió la regex de extracción de grupo a `.replace(/[^A-Z0-9]/g, "").replace(/^\d+/, "")` para evitar discrepancias con valores como "1°A" vs "A".
  - **Limpieza y Botón Reactivo "Ver Todos":** En `AdminPlanJS_02.html` y `ClaseJS_04.html`, se implementó `limpiarFiltrosPlaneacion_()` y se añadió un botón reactivo primario `[🔄 Ver Todos los Proyectos (X)]` en el estado vacío cuando la base de datos contiene proyectos pero ningún resultado coincide con los selectores activos.
  - **Transmisión Segura del Cliente:** En `cargarListaPlaneacionesNEM`, se evita enviar `docente` en modo personal (`docente: (bancoPlanActual === 'global') ? doc : ''`).
  - **Despliegue Global Multi-Endpoint:** Compilado a `v417 · build-542` (versión 542) y desplegado con éxito en los 5 endpoints de producción de Google Apps Script:
    1. Google Sites (`AKfycbz1-xheu_68hU7LpM0_3sUSfqwsb1Hw775eWuHgwmPTJWtvGY7cCh0AR4zcq2Lg32DIBQ`)
    2. Web App Direct / Admin (`AKfycbzPQDTjMqHGpSfBg3KMrDBpxSweOAk2x5adcMLJ4aJHvM2ETGtGI-rm1bz3aDRxj-FAgQ`)
    3. Asistencia (`AKfycbwYr2eeYCG7o0fKe1pJr70ljjXsXaA4RUtoM07RdSjtrU0_DTOjOIpG19GIbYtknxWGUg`)
    4. Réplica 4 (`AKfycbxDw5ITzPHqaX68RdZ8F2Xpywp_dZX8ORz3k00ZVrpmarmDGgCYxgjkRfYrfJKRUDJ1Ug`)
    5. Réplica 5 (`AKfycbzkoAhW2vraK6fpgKH3AZ6mpMRctfmPHWjF4lMFYE2Ku1aptJTz68Ga2jI3g8ZcPikOHw`)
- **Archivos Afectados:** `00_Constantes.gs`, `PlaneacionNEM.gs`, `AdminPlanJS_02.html`, `ClaseJS_04.html`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Resuelve el caso donde un docente o administrador veía "0 planeaciones" en su banco personal debido a que filtros residuales (docente o grado/grupo) filtraban las 14 planeaciones existentes en base de datos.

### 🛠️ [2026-10-30] - [Visualización y Consulta de Proyectos Guardados en Mi Banco Personal (build-539)]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(planeacion): resolucion de gsRun apply context, sincronizacion de encabezados sheets y despliegue build-539`
- **Cambios Realizados:**
  - Corregido el despachador `gsRun` en `ComunJS.html`: sustituido `runner[fn].apply(null, args)` por `runner[fn].apply(runner, args)`, resolviendo el fallo silencioso en el dispatcher del cliente de Google Apps Script dentro del iframe.
  - Añadida sincronización automática de columnas y encabezados en `03_Setup.gs:_asegurarSetup_()` para `PlaneacionesNEM` y `SesionesNEM`, garantizando que columnas nuevas (`DocentePropietario`, `EsCopiaDe`) no queden como celdas sin título que corrompan el mapeo de `_leerFilas_()`.
  - Verificada la persistencia íntegra en la base de datos de Google Sheets (ID: `1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU`), confirmando 14 planeaciones guardadas activas (incluyendo el proyecto de Español 1°A "Voces que transforman: indagación y acción comunitaria" ID `PLN-2553AC8D-D`).
  - Limpiada la ruta de diagnóstico temporal en `02_Rutas.gs`.
  - Compilado y desplegado a producción en los 5 endpoints de Google Apps Script con versión `@539` / `build-539`.
- **Archivos Afectados:** `00_Constantes.gs`, `02_Rutas.gs`, `03_Setup.gs`, `ComunJS.html`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Permite a los docentes y administradores ver inmediatamente sus proyectos didácticos guardados en la cuadrícula de "Mi Banco Personal" con sus datos completos y acceder a las sesiones didácticas paso a paso.


### 🛠️ [2026-10-30] - [Persistencia Robusta de Planeaciones Didácticas NEM y Feedback Reactivo en Siembra Demo]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(planeacion): resolucion de persistencia en sheets, feedback visual y recuperacion tolerante de sesion`
- **Cambios Realizados:**
  - Creada función `_obtenerHojaRobusta_` en `PlaneacionNEM.gs` con normalización flexible de nombres de pestañas (`PlaneacionesNEM`, `SesionesNEM`), eliminando fallas por diferencias sutiles de mayúsculas, espacios o guiones.
  - Añadido chequeo dinámico y expansión preventiva de filas (`maxRows`) en `PlaneacionNEM.gs` (`desglosarSesionesInicialesNEM_` y `sembrarPlaneacionesDemoNEM`) antes de operaciones `.setValues()`, evitando excepciones de límites de rango en Google Sheets.
  - Implementado fallback tolerante de autenticación en `ClaseLogica.gs:exigirClaseRol_`: si la bandera `clase_` caduca o se desincroniza en `CacheService`, valida automáticamente contra la sesión unificada activa (`sesion_`), garantizando que un administrador o docente autenticado nunca sea bloqueado falsamente.
  - Reubicado el toast flotante de notificación `#st90-toast` en `ComunCSS.html` al extremo superior derecho (`top: 18px; right: 20px; z-index: 999999`) con soporte para variantes semánticas `.ok`, `.exito`, `.err`, `.error` e `.info`, asegurando visibilidad total e inmediata cuando la Suite Escolar está incrustada dentro de Google Sites (evitando que el toast se pierda 2000px abajo fuera de la pantalla visible).
  - Dotado de retroalimentación inmediata el botón `🌱 Cargar Proyectos Demo` en `AdminPlanJS_02.html`: el botón se deshabilita con texto `⏳ Sembrando proyectos demo…` y la cuadrícula muestra una tarjeta verde animada durante el proceso de guardado en Sheets. En caso de error, se despliega un diálogo modal reactivo y una tarjeta con botón de reintento.
  - Reforzado el flujo de guardado en `AdminPlanJS_05.html:guardarPlaneacionForm`: cambio a estado de carga en el botón, validación con feedback modal y cierre reactivo hacia el gestor de sesiones.
  - Verificada la integridad del árbol de scripts con `node herramientas/manifiesto.js` (0 errores en 75 documentos evaluados).
  - Código desplegado a Google Apps Script con versión `@529` / build `v417 · build-526` en el endpoint de Google Sites y réplicas.
- **Archivos Afectados:** `00_Constantes.gs`, `PlaneacionNEM.gs`, `ClaseLogica.gs`, `ComunCSS.html`, `AdminPlanJS_02.html`, `AdminPlanJS_05.html`, `ESTADO_COORDINACION.md`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Corrige el problema de "no carga nada" al pulsar el botón de proyectos demo y asegura que el guardado de planeaciones persista de forma segura en Google Sheets, con retroalimentación visual inmediata dentro del iframe de Google Sites.

### 🛠️ [2026-10-30] - [Fase 7: Paridad Visual de Tarjetas iDevice en Visor de Clase (Clase.html)]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(ui): paridad visual de tarjetas idevice en visor de clase y normalizacion st90`
- **Cambios Realizados:**
  - Auditada la entrega de DeepSeek en `ENTREGA_DEEPSEEK.md` (§19).
  - Incorporadas en `ComunCSS.html` las reglas de paridad para `.idevice-card:not(.idevice-container)`: cabeceras con franja tintada sangrada por variante (`#f0f7ff`, `#ecfdf5`, `#fffbeb`), normalización de `.tipo-badge` a paleta ST90 accesible, refuerzo métrico de campos de entrada (13px, padding uniforme, anillo de foco azul) y botón Quitar estilizado con hover.
  - Verificada la integridad del árbol de scripts con `node herramientas/manifiesto.js` (0 documentos sin parsear en 75 documentos evaluados).
  - Ejecutado `clasp push` y desplegado en los 5 IDs de producción en Google Apps Script (@515-@519).
- **Archivos Afectados:** `ComunCSS.html`, `CONTROL_CAMBIOS.md`, `ESTADO_COORDINACION.md`, `ESTADO_PROXIMA_SESION.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Asegura paridad visual exacta entre las tarjetas iDevice en el panel Docente/Admin y en el visor del aula (`Clase.html`), sin afectar las clases nativas y quedando preparado para cuando la lógica de `ClaseJS_08.html` sea migrada por Cursor.

### 🛠️ [2026-10-29] - [Planeación Didáctica: Horario Oficial por Defecto y Auto-Siembra de Proyectos Demo]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(planeacion): restaurar vista inicial de horario oficial y auto-sembrar proyectos demo en banco personal`
- **Cambios Realizados:**
  - Restaurada la vista inicial de Planeación Didáctica a **Horario Oficial** (`conmutarVistaPlaneacion_('horario')`) en `AdminPlanJS_06.html:inicializarModuloPlaneacion_()` para que al ingresar al módulo se despliegue directamente el calendario semanal de clases aSc con sus bloques y asignaturas clicables.
  - Incorporada la auto-siembra preventiva en `PlaneacionNEM.gs:listarPlaneacionesNEM()`: si la base de datos de planeaciones está vacía, se invoca automáticamente `sembrarPlaneacionesDemoNEM()` para que el docente o administrador disponga de proyectos de muestra inmediatamente al acceder a su Banco Personal o Global sin ver pantallas vacías en 0.
  - Verificada la integridad del manifiesto (0 errores en 75 documentos) y desplegado en Google Apps Script a la versión `@514`.
- **Archivos Afectados:** `AdminPlanJS_06.html`, `PlaneacionNEM.gs`, `ESTADO_COORDINACION.md`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Restablece el flujo de trabajo natural del docente (acceder a Planeación ➔ ver su Horario/Calendario ➔ seleccionar clase/asignatura o abrir Banco de proyectos).

### 🛠️ [2026-10-29] - [Sincronización de Despliegues: Google Sites inicio a build-510]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(deploy): sincronizar despliegue embebido en google sites a version @512 build-510`
- **Cambios Realizados:**
  - Identificada la causa por la cual `https://sites.google.com/view/st90/inicio` seguía mostrando `v417 · build-469`: el iframe de Google Sites tenía incrustado el ID de despliegue `AKfycbz1-xheu_68hU7LpM0_3sUSfqwsb1Hw775eWuHgwmPTJWtvGY7cCh0AR4zcq2Lg32DIBQ` (anclado a la versión histórica `@507`).
  - Redesplegadas las 4 instancias activas (`AKfycbz1-xheu...`, `AKfycbxDw5...`, `AKfycbzkoA...`, `AKfycbzPQD...`) apuntando a la versión `@512` con `build-510`.
  - Verificada la entrega HTTP directa de `build-510` en el endpoint embebido de Google Sites.
  - Actualizados `ENLACES_UI.md` y `ESTADO_COORDINACION.md`.
- **Archivos Afectados:** `ENLACES_UI.md`, `ESTADO_COORDINACION.md`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Garantiza que cualquier usuario que ingrese desde el portal de Google Sites o mediante URL directa de Apps Script reciba la misma versión @512 con todas las correcciones de guardado de planeación y diseño Ribbon.

### 🛠️ [2026-10-29] - [Fix Integral: Guardado y Visibilidad de Planeaciones NEM + Fase 6 iDevices CSS]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(planeacion): corregir guardado de proyectos, desbloqueo novalidate y filtros de visualizacion`
- **Cambios Realizados:**
  - Corregido `sembrarDemoPlaneaciones_` en `AdminPlanJS_02.html` para invocar la función real `cargarListaPlaneacionesNEM(true)` (eliminando el `ReferenceError: cargarBancoPlaneaciones_ is not defined`).
  - Agregado atributo `novalidate` a `<form id="formPlanData">` en `AdminPlaneacion.html` para evitar que la validación HTML5 interna del navegador aborte el guardado por campos requeridos en paneles del stepper con `display: none`.
  - Robustecido `guardarPlaneacionForm` en `AdminPlanJS_05.html`: validación asistida de título con navegación a Etapa 1, token de sesión seguro y valores por defecto para grado/grupo/asignatura.
  - Corregido el filtrado de planeaciones en `PlaneacionNEM.gs`: normalización flexible de grupo (extrae solo letra para evitar descarte por formato `1A`), matching numérico para trimestres y visibilidad de proyectos demo/propios en Banco Personal.
  - Inicialización directa de `conmutarVistaPlaneacion_('personal')` en `AdminPlanJS_06.html` para que el panel de planeación nunca inicie con pantalla vacía.
  - Integrada Fase 6: desacoplamiento de estilos inline de tarjetas iDevice en `AdminPlanJS_06.html` e incorporación de clases `.idevice-card*`, `.idevice-campo-titulo` y `.idevice-campo-cuerpo` en `ComunCSS.html`.
- **Archivos Afectados:** `AdminPlanJS_02.html`, `AdminPlanJS_05.html`, `AdminPlanJS_06.html`, `AdminPlaneacion.html`, `ComunCSS.html`, `PlaneacionNEM.gs`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Resuelve de raíz por qué no se mostraban las planeaciones ni se guardaban en el Banco Personal.

### 🛠️ [2026-10-29] - [Fase 5: Cinta Ribbon estilo aSc Horarios 2027 e Iconos Ilustrados]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(ui): rediseño visual estilo aSc Horarios 2027 con ribbon y 31 iconos ilustrados`
- **Cambios Realizados:**
  - Sustitución de 31 iconos SVG monocromáticos por ilustraciones detalladas y coloridas tipo aSc Horarios / Office en `#menuTabsPanel` y sub-cintas.
  - Implementación de estilos Ribbon en `ComunCSS.html` (degradados suaves, divisores verticales `.separador-ribbon`, tarjetas con icono superior y texto inferior, elevación hover y foco accesible).
  - Preservación del 100% de IDs del DOM (104/104) y manejadores `onclick` (64/64) auditada por DeepSeek y Antigravity.
- **Archivos Afectados:** `ComunCSS.html`, `Admin.html`, `CONTROL_CAMBIOS.md`, `ENTREGA_DEEPSEEK.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Modernización estética aSc Horarios solicitada por el usuario manteniendo intacta toda la lógica JS subyacente.

### 🛠️ [2026-10-29] - [Planeación Didáctica: iDevices Dinámicos y Validación de Momentos]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(planeacion): serializar idevices en guion y bloquear guardado si faltan momentos`
- **Cambios Realizados:**
  - Renderizado dinámico de bloques de lectura, pregunta y reto en `#contenedorIDevicesDinamicos` con id único y botón de eliminación.
  - Serialización y rehidratación bidireccional de iDevices dentro del guion accesible (`#sesGuionEstudiante`) con delimitadores estructurados.
  - Validación preventiva de los cuatro momentos (Apertura, Desarrollo, Actividad, Cierre) antes del guardado de la sesión activa con feedback toast ST90.
- **Archivos Afectados:** `AdminPlanJS_06.html`, `AdminPlaneacion.html`, `CONTROL_CAMBIOS.md`, `ENTREGA_CURSOR.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Mantiene la compatibilidad con los IDs `sesApertura`, `sesDesarrollo`, `sesActividad` y `sesCierre` usando `data-alias` para satisfacer el contrato sin quebrar `AdminPlanJS_05.html`.

### 🛠️ [2026-10-29] - [Actualización de _PLANTILLA_PROYECTO_NUEVO con Buzones y Reglas Automáticas]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(plantilla): sincronizar starter kit con buzones automáticos ENTREGA_DEEPSEEK y ENTREGA_CURSOR y reglas globales`
- **Cambios Realizados:**
  - Se agregaron los archivos de buzón `ENTREGA_DEEPSEEK.md` y `ENTREGA_CURSOR.md` dentro de `_PLANTILLA_PROYECTO_NUEVO/`.
  - Se incorporaron las reglas automáticas `.cursor/rules/buzon-entrega-cursor.mdc`, `AGENTS.md` y `DEEPSEEK.md`.
  - Se actualizó `_PLANTILLA_PROYECTO_NUEVO/README_ARRANQUE.md` con el diagrama de flujo de cero copiado manual y la tabla completa de 13 componentes del kit.
  - Se verificó la suite `node .rsc/test_regresion.js` en código 0.
- **Archivos Afectados:** `_PLANTILLA_PROYECTO_NUEVO/*`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Asegura que cualquier nuevo proyecto herede la arquitectura de buzones automáticos sin fricción de copiado manual.

### 🛠️ [2026-10-29] - [Automatización de Buzones de Entrega para Agentes]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(orquestacion): automatizar guardado directo en buzones ENTREGA_DEEPSEEK y ENTREGA_CURSOR con reglas obligatorias`
- **Cambios Realizados:**
  - Se crearon las reglas automáticas `.cursor/rules/buzon-entrega-cursor.mdc` (con `alwaysApply: true`), `DEEPSEEK.md` y `AGENTS.md`.
  - Se configuró la directiva imperativa para que Cursor y DeepSeek guarden sus entregas directamente en `ENTREGA_CURSOR.md` y `ENTREGA_DEEPSEEK.md` sin requerir que el usuario copie y pegue código manualmente en el chat.
  - Se replicaron las reglas en `_PLANTILLA_PROYECTO_NUEVO/` para que los nuevos proyectos hereden la automatización.
- **Archivos Afectados:** `.cursor/rules/buzon-entrega-cursor.mdc`, `DEEPSEEK.md`, `AGENTS.md`, `ENTREGA_DEEPSEEK.md`, `ENTREGA_CURSOR.md`, `_PLANTILLA_PROYECTO_NUEVO/*`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Elimina el copiado manual entre ventanas. Los agentes vuelcan directamente su trabajo en el disco local y Antigravity los audita con un solo aviso del usuario.
