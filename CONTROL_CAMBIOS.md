# Control de cambios — Lectura ST90

Pega aquí un bloque por cada cambio cerrado. La fecha es la de America/Monterrey (`AAAA-MM-DD`). La bitácora narrativa sigue en `avances.md`.

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
