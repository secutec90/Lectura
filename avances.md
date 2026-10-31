# Documento de Avances del Proyecto — Secundaria Técnica 90

**Plataforma:** Sistema Integral de Comprensión Lectora, Planeación Didáctica NEM y Aula Hablada  
**Fecha de corte:** Octubre 2026  
**Última versión desplegada:** `@555`  
**URL de producción activa:** [https://script.google.com/macros/s/AKfycbzPQDTjMqHGpSfBg3KMrDBpxSweOAk2x5adcMLJ4aJHvM2ETGtGI-rm1bz3aDRxj-FAgQ/exec?pagina=admin](https://script.google.com/macros/s/AKfycbzPQDTjMqHGpSfBg3KMrDBpxSweOAk2x5adcMLJ4aJHvM2ETGtGI-rm1bz3aDRxj-FAgQ/exec?pagina=admin)

---

## Resumen Ejecutivo de Avances

En las iteraciones recientes del proyecto, la plataforma evolucionó de un sistema enfocado exclusivamente en el examen de comprensión lectora hacia un **ecosistema integral de gestión académica y pedagógica** adaptado al marco curricular de la **Nueva Escuela Mexicana (NEM Fase 6)** y al **Diseño Universal para el Aprendizaje (DUA)**.

---

## Hitos y Desarrollos Recientes

### 27. Erradicación de Fallo Global en Apps Script y Despliegue Robusto de Planeaciones NEM (@555)
- **Diagnóstico y Eliminación de Causa Raíz (`check_sites`):**
  - Se identificó y resolvió el error fatal `ReferenceError: require is not defined (línea 1, archivo "check_sites")` generado por la subida involuntaria de un script local de Node a Google Apps Script que bloqueaba el 100% de las invocaciones a `google.script.run`.
  - Se blindó `.claspignore` con `**/*.js` y `*.js`, y se depuró el proyecto remoto con `clasp push --force`.
- **Saneamiento Primitivo de Fechas en `PlaneacionNEM.gs`:**
  - Conversión estricta de objetos `Date` de Google Sheets a cadenas ISO/locales mediante `_fmtFechaIsoGas_` y envoltura con `JSON.parse(JSON.stringify(...))`, evitando excepciones de serialización entre iframes en Google Sites.
- **Cuadrícula Resiliente y Confirmación de 14 Planeaciones:**
  - `AdminPlanJS_02.html` y `ClaseJS_04.html` ahora toleran respuestas tipo array u objeto estructurado con `totalEnBase`.
  - Verificado en producción con el usuario: visualización exitosa de las **14 de 14 planeaciones** guardadas en "Mi Banco Personal" y "Repositorio Global".
- **Despliegue Multi-Endpoint (@555):** Sincronizados los 5 despliegues de Apps Script (`AKfycbz1-xheu...`, `AKfycbzPQ...`, `AKfycbwYr...`, etc.) en versión oficial `@555`.

### 26. Organización del Constructor en 3 Pestañas Horizontales Integradas en una Sola Fila Superior (@416–@417)
- **Integración en la Barra Contextual Superior (`#barraFormulario` dentro de `#filaHerramientasEnc` en `AdminEncuestas.html`):**
  - Se ocultó el título redundante `"Constructor Dinámico de Preguntas"` y se integraron las **3 pestañas horizontales** (`#constructorTabsNav`) junto con el botón **`Guardar cambios`** (`#btnGuardar`) directamente en la fila única del sub-ribbon contextual (`#filaHerramientasEnc`), entre las pestañas `Gráficas / Datos / Editor` a la izquierda y las herramientas `Vista previa / CSV / PDF / Opciones / Ayuda` a la derecha:
    1. **`1. Origen de datos`** (`#btnTabConsOrigen` -> `#subPaneConsOrigen`)
    2. **`2. Configuración de Cabecera`** (`#btnTabConsCabecera` -> `#subPaneConsCabecera`)
    3. **`3. Esquema de Preguntas`** (`#btnTabConsPreguntas` -> `#subPaneConsPreguntas`, con insignia dinámica `#badgeTotalPreguntasCons` que muestra el total de preguntas activas).
  - La función `conmutarSubTabBarra_()` alterna automáticamente `#barraGraficas`, `#barraDatos` y `#barraFormulario` según el módulo activo.

### 25. Rediseño Ejecutivo del Modal de Vista Previa y Corrección de Jerarquía DOM `#tab-enc` (@415)
- **Corrección de Cierres `</div>` Huérfanos en `AdminEncuestas.html`:**
  - Se eliminaron 3 cierres `</div>` sobrantes previos a `<!-- MODALES DEL SISTEMA -->` que cerraban prematuramente `#tab-enc` y dejaban fuera del alcance CSS (`#tab-enc .*`) a todos los modales del módulo de encuestas.
- **Rediseño Ejecutivo del Modal `#modalVistaPreviaEncuesta` (`AdminEncuestas.html`):**
  - **Tarjeta superior de enlace compartible (`.vp-share-card`):** Cabecera alineada con insignia verde con indicador luminoso (`Encuesta activa`), y fila única horizontal (`.vp-share-row`) con campo de URL estilizado y botones compactos sin subrayado (`Copiar enlace` y `Abrir en pestaña`).
  - **Separador visual (`.vp-divider-label`) y Lienzo Centrado (`.vp-preview-canvas`):** Presenta el banner institucional (`.vp-banner`) con tipografía centrada, aire interior generoso y pastilla translúcida para el título del formulario, seguido de tarjetas individuales por pregunta dentro de `.vp-form-card`.

### 24. Barra de Progreso Discreta al Iniciar Sesión y Reposicionamiento de Toasts (@414)
- **Sustitución de Avisos Emergentes por Barra de Progreso (`#st90BarraCarga` en `Admin.html`, `ComunCSS.html` y `ComunJS.html`):**
  - Se eliminaron los avisos flotantes `"🔄 Consultando Google Sheets..."` y `"✅ 75 alumnos sincronizados desde..."` en `recargar()` que cubrían las pestañas del menú superior al iniciar sesión o actualizar datos.
  - En su lugar, se integró una **barra de progreso delgada (`3px`, `#st90BarraCarga`)** justo debajo de la barra superior (`barra-sup`) gestionada por `barraProgresoSt90('cargando' | 'exito' | 'error')`, que anima suavemente durante la sincronización, se tiñe de verde esmeralda al concluir y se desvanece automáticamente sin tapar ningún botón del menú.
- **Reposicionamiento de `#st90-toast` a la Esquina Inferior Derecha (`ComunCSS.html`):**
  - Cualquier otro aviso puntual del sistema (`toast`) ahora aparece discretamente en la esquina inferior derecha (`bottom: 20px; right: 20px`) para no obstruir nunca la cinta de navegación superior.

### 23. Corrección de URL Pública en Vista Previa y Enlace Directo en Pestaña Nueva (@413)
- **Saneamiento de Comillas en Scriptlets (`limpiarComillasScriptlet_` en `Admin.html` y `urlBaseWebApp` en `ComunJS.html`):**
  - El auto-escape contextual de `HtmlService` (`<?= JSON.stringify(...) ?>`) envolvía `URL_BASE_APP` con comillas dobles literales (`'"https://.../exec"'`), provocando que `window.open` interpretara la dirección como una ruta relativa dentro del sandbox `googleusercontent.com` y mostrara el error de Google Drive.
  - Se incorporó `limpiarComillasScriptlet_()` en `Admin.html`, saneamiento en `urlBaseWebApp()` (`ComunJS.html`) y normalización canónica en `obtenerUrlPublicaCenso_()` (`AdminEncuestas.html`).
- **Enlace Nativo `<a target="_blank" rel="noopener">` y Vista Pública Limpia (`FormularioEncuesta.html`):**
  - Se convirtió el botón **`Abrir en pestaña`** (`#btnAbrirEncuestaPestana`) en un enlace nativo con `target="_blank" rel="noopener"` apuntando directamente a `https://script.google.com/macros/s/AKfycbzPQDTjMqHGpSfBg3KMrDBpxSweOAk2x5adcMLJ4aJHvM2ETGtGI-rm1bz3aDRxj-FAgQ/exec?pagina=censo`.
  - Se ocultó la barra de pestañas internas (`#mainTab`) en `FormularioEncuesta.html` para que los alumnos vean únicamente la encuesta publicada.

### 22. Modal Interactivo de Vista Previa + Enlace Compartible, Jerarquía de Tamaño en Sub-Ribbons y Paleta Semántica de Colores (@412)
- **Botón `Vista previa` (`#btnEnlaceAlumnosBarra`) y Modal `#modalVistaPreviaEncuesta`:**
  - Se reemplazó el botón `Enlace` por **`Vista previa`** (`bi-eye-fill`), que abre `#modalVistaPreviaEncuesta`.
  - Incluye en la parte superior la **barra para compartir el enlace público** (`?pagina=censo`) con campo de solo lectura (`#inputUrlPublicaCenso`), botón **`Copiar enlace`** con confirmación visual (`¡Copiado!`) y botón **`Abrir en pestaña`**.
  - Renderiza debajo la **encuesta publicada en vivo** (`#tituloEscuela`, `#subtituloEscuela`, `#tituloFormulario`, `#formDinamico`, `#campos`) con soporte interactivo completo de preguntas dependientes (`Turno -> Grupo`), reglas condicionales y simulación de envío (`enviarVistaPrevia_`) sin alterar los registros reales.
- **Jerarquía Visual de Tamaño entre Nivel 1 y Sub-Ribbons (Nivel 2):**
  - El Ribbon de primer nivel (`#menuTabsPanel`) conserva iconos de `22px` y etiquetas de `12px`.
  - Los sub-ribbons (`.cinta-n2 .ribbon-btn` en `ComunCSS.html` y `#barraContextual` en `AdminEncuestas.html`) reducen proporcionalmente sus iconos (`17px–18px`) y etiquetas (`10px–10.5px`) para diferenciarse visualmente como controles de segundo nivel.
- **Paleta Semántica de Colores en Todos los Iconos:**
  - Se dotó de identidad cromática a las pestañas del Ribbon principal (`Usuarios` azul, `Asistencia` verde, `Lecturas` morado, `Planeación` celeste, `Encuestas` teal) y a todos los iconos de `#barraContextual` (`Gráficas`, `Datos`, `Editor`, `Turno`, `Grado`, `Grupo`, `Ajustes`, `Orden`, `Recargar`, `Limpiar`, `Gráfica`, `Lista`, `Ambos`, zoom `Gráf. -/+`, `Lista -/+`, `Alto -/+`, `Buscar`, `Campo`, `Dirección`, `Top`, `Vista previa`, `CSV`, `PDF`, `Opciones` y `Ayuda`).

### 21. Fusión de la Sub-barra de Vista de Gráficas en la Fila Principal y Unificación de Ayuda (@411)
- **Subida de Controles de Vista a la Fila Principal (`#barraGraficas`):**
  - Los controles de disposición y proporciones (`#controlVistaGraficas`: `Gráfica`, `Lista`, `Ambos`, `Gráf. -`, `Gráf. +`, `Lista -`, `Lista +`, `Alto -`, `Alto +`) se integraron dentro de `#barraGraficas` en la misma fila de `#barraContextual`.
  - Al vivir dentro de `#barraGraficas`, **únicamente se muestran cuando está seleccionado el icono `Gráficas`** y desaparecen automáticamente al pasar a `Datos` o `Editor`.
- **Homologación Exacta al Estilo `.ribbon-tab`:**
  - Todos los botones subidos adoptan el diseño vertical `.ribbon-tab` (icono arriba + etiqueta `.ribbon-label` abajo), flotando limpios en reposo y adquiriendo el marco blanco con borde `#94a3b8` y texto azul ST90 al estar activos (`cambiarVista()`).
- **Unificación de los Modales e Iconos de Ayuda:**
  - Se eliminó el segundo icono `?` duplicado que abría `#modalAyudaCalculos`.
  - Se integró todo el contenido de *Metodología de Cálculo en Gráficas y Resumen* (Frecuencia Absoluta, Porcentaje General, Barras Apiladas 100% y Rayos Solares Sunburst) como una tercera pestaña (**`Metodología y cálculos`**) dentro del modal único `#modalAyuda`, gobernado por el botón ámbar **`Ayuda`** (`#btnAyudaEncBarra`).

### 20. Conmutación Reactiva de Submenús (Gráficas vs. Hoja de Datos vs. Editor) y Limpieza de Botones en Reposo (@410)
- **Diagnóstico de Causa Raíz en el Submenú Central:**
  - En `AdminEncuestas.html`, dentro del bloque `DOMContentLoaded`, la línea `document.getElementById("formDinamico").addEventListener("change", aplicarCondiciones)` lanzaba un `TypeError` fatal porque `#formDinamico` fue separado a `FormularioEncuesta.html`. Esto abortaba `DOMContentLoaded` antes de registrar el listener `shown.bs.tab`, impidiendo que al cambiar entre **Gráficas**, **Datos** y **Editor** se alternaran los bloques `#barraGraficas` y `#barraDatos`.
  - Además, los 3 menús desplegables de la barra de Hoja de Datos (`#menuTablaCampo`, `#menuTablaDireccion`, `#menuTablaTop`) no se poblaban en `pintarMenusFiltro()`, y la regla `#tab-enc .form-control { display: block !important; }` sobreescribía `.d-none` en `#buscadorTexto`.
- **Solución Integral Implementada:**
  - Se blindó `DOMContentLoaded` y `cargarFormulario()` con validaciones de existencia (`if (elFormDin)`) y se creó `conmutarSubTabBarra_(destino)` vinculada tanto a `onclick` de las 3 subpestañas como a `shown.bs.tab`:
    - **Al elegir `Gráficas`:** Muestra `#barraGraficas` (`Turno`, `Grado`, `Grupo`, `Ajustes`, `Orden`, `Recargar`, `Limpiar`) y oculta `#barraDatos`.
    - **Al elegir `Datos`:** Oculta `#barraGraficas` y muestra `#barraDatos` (`Buscar`, `Campo`, `Dirección`, `Top`, `Limpiar`).
    - **Al elegir `Editor`:** Oculta ambas barras centrales (`#barraGraficas` y `#barraDatos`) y renderiza el constructor de preguntas.
  - Se implementó `poblarMenusTablaDatos_()` para poblar dinámicamente `#menuTablaCampo` (con Fecha/Hora, Origen y cada pregunta activa), `#menuTablaDireccion` y `#menuTablaTop`, aplicando además el recorte real de filas `Top N` en `pintarTablaRespuestas()`.
  - Se retiró la caja azul fija de `Recargar` y `Orden` en estado predeterminado para que todos los iconos floten limpios en reposo.

### 19. Pre-renderizado y Apertura Inmediata del Menú de Ajustes de Gráfica (@409)
- **Corrección de Contenido Vacío en Ajustes:**
  - El menú `#menuAjustesGrafica` dependía únicamente del evento diferido `show.bs.dropdown` en `DOMContentLoaded` sin haber poblado inicialmente las opciones, lo que provocaba que al dar clic se desplegara un contenedor vacío.
  - Se pre-renderizó la estructura HTML completa de las opciones (Tipo de gráfica, Valores, Base porcentual y Etiquetas del eje) directamente en la plantilla de [AdminEncuestas.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/AdminEncuestas.html), garantizando disponibilidad instantánea.
  - Se añadió la llamada a `renderMenuAjustes()` tanto en `onclick` del botón `#btn-ajustesGrafica` como en `pintarMenusFiltro()` e `inicializarModuloEncuestas_()`.

### 18. Homologación de Iconos al Ribbon de Primer Nivel y Solución Definitiva de Dropdowns en Encuestas (@408)
- **Eliminación del Scroll Reducido y Despliegue Completo de Menús:**
  - Se eliminó la propiedad `overflow-x-auto` del contenedor de la barra de herramientas `#barraContextual` (`#filaHerramientasEnc`), la cual forzaba `overflow-y: auto` en el navegador y atrapaba los menús desplegables en una caja de 36px generando una barra de desplazamiento miniatura con flechas arriba/abajo.
  - Se estableció `overflow: visible !important;` en `#barraContextual`, sus contenedores hijos (`#barraGraficas`, `#barraDatos`, `#filtrosDimensiones`), y se asignó `z-index: 99999 !important;` con posicionamiento absoluto flotante a todos los `.dropdown-menu`.
- **Adopción Exacta del Estilo `.ribbon-tab` de la Hoja de Estilos [ComunCSS.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/ComunCSS.html):**
  - Todas las herramientas y pestañas contextuales de Encuestas (`#adminSubTabs`, botones de segmentación de dimensiones, ajustes de gráfica, ordenamiento, recarga, limpieza, búsqueda y exportación) ahora adoptan exactamente el estilo de los botones del Ribbon de primer nivel:
    - Disposición vertical (`flex-direction: column`, `align-items: center`, `gap: 2px`).
    - Iconos SVG y Bootstrap Icons de 22px / 20px centrados.
    - Etiqueta de texto debajo del icono (`<span class="ribbon-label">`) con tipografía `11px/12px font-weight: 700`.
    - Fondo transparente en reposo, `border: 1px solid transparent`, `border-radius: 10px`.
    - Efecto hover suave con fondo blanco (`#ffffff`), borde `#e2e8f0` y color institucional `var(--st90-azul)`.
    - Estado activo con fondo blanco, borde de realce `1px solid #94a3b8` y `font-weight: 800`.
    - Acentos cromáticos intactos para Enlace Alumnos (verde) y Ayuda (ámbar).

### 15. Unificación Total del Constructor de Encuestas & Diagnóstico al Proyecto Principal Lectura (@395)
- **Eliminación Definitiva del Iframe y Despliegue Dividido:**
  - Se unificó el código del proyecto satélite `constructor` dentro del proyecto principal `Lectura`, permitiendo gestionar todo bajo un único Script ID y despliegue de Google Apps Script.
- **Backend Integrado ([Encuestas.gs](file:///g:/Mi%20unidad/PROYECTOS/Lectura/Encuestas.gs)):**
  - Incorporación íntegra de la lógica de gestión de encuestas, esquema de preguntas, banco de reactivos, simulación y hoja de respuestas en `Encuestas.gs`.
  - Eliminación del `doGet(e)` redundante y ruteo unificado en [Codigo.gs](file:///g:/Mi%20unidad/PROYECTOS/Lectura/Codigo.gs) (`?pagina=censo` / `?pagina=encuesta` para alumnos con [FormularioEncuesta.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/FormularioEncuesta.html)).
  - **Single Sign-On (SSO) Nativo:** Autenticación fluida que valida directamente el `token` de sesión del panel administrativo de `Lectura` (`verificarAdmin`), eliminando contraseñas duplicadas.
- **Frontend Modularizado ([AdminEncuestas.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/AdminEncuestas.html)):**
  - Panel nativo `#tab-enc` con analítica de gráficas (Chart.js / ECharts), desglose por turno, grado y grupo, hoja de datos tabulares con búsqueda/paginación/exportación a CSV/PDF y editor drag-and-drop de reactivos.
  - Estilos de Bootstrap y componentes encapsulados con alcance estricto `#tab-enc` para evitar interferencias con el resto del panel.
- **Navegación Ribbon N1 y Sub-cinta N2 Homologada en [Admin.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/Admin.html):**
  - El botón `#btnTabEnc` opera como una pestaña nativa N1 con clase `.activa` y conmutación reactiva en `aplicarTab('enc')`.
  - Nueva sub-cinta N2 `#cintaEnc` con acceso directo a: `[Gráficas]`, `[Hoja de Datos]`, `[Editor]`, `[Enlace Alumnos]` y `[Ayuda]`.

### 14. Rediseño Visual de Alta Gama en Planeación NEM, Resolución de Botones y Aislamiento de Filtros N3 (@394)
- **Aislamiento Arquitectónico de la Barra de Filtros N3 (`#n3Planeacion`):**
  - Se reubicó `#n3Planeacion` dentro del contenedor del catálogo (`#cajaListaPlanNEM`), garantizando que al abrir el formulario de Nueva Planeación (`#cajaFormPlanNEM`) o el constructor de sesiones (`#cajaSesionesPlanNEM`), los filtros de grado, grupo y banco no invadan ni desordenen la parte superior de la pantalla.
- **Implementación del Sistema de Diseño `.nem-*` (Design System ST90):**
  - Se incorporó la hoja de estilos completa para la suite NEM con:
    - **Banner de Clase Seleccionada (`.nem-banner`):** Tarjeta con degradado suave, chips de datos claros (Fecha, Hora, Trimestre, Docente) y botón flotante de retorno rápido al horario.
    - **Stepper UX Interactivo en 4 Pasos (`.nem-stepper-header`, `.nem-step-tab`):** Pestañas de píldora estilizadas con números circulares, indicadores visuales de completado (`.completado`) y paso activo (`.activo`) con relieve y sombra suave.
    - **Formulario Responsivo (`.nem-fila-una`, `.nem-campo-inline`):** Grid balanceado en 4 columnas con altura uniforme (42px) para Título, Campo Formativo, Metodología y Sesiones, con focus ring azul profesional.
    - **Chips Interactivos de Ejes Articuladores (`.nem-eje-chip`):** Pills redondeadas con detección de estado `:checked` (`.seleccionado`) que sustituyen a los checkboxes planos y amontonados.
    - **Footer de Navegación de Pasos (`.nem-step-nav-footer`):** Barra inferior balanceada con botones limpios y botón primario azul destacado.
- **Resolución Completa de la Interactividad y Navegación:**
  - Se activó y blindó la función `irAPasoPlanNEM(paso)`, permitiendo avanzar con los botones de pasos o footer y recargando automáticamente el catálogo dinámico SEP de Contenidos y PDA del Paso 2 y el contexto UDEI/DUA del Paso 3.
  - Se agregó trazabilidad de origen (`origenFormPlan`), permitiendo que el botón `[← Volver a lista]` y `[Ver Horario]` regresen con exactitud al Horario Oficial o al Banco Personal según de dónde provino el docente.

### 13. Eliminación de Diagnóstico y Alineación Estricta del Ribbon de Planeación ST90 (@393)
- **Eliminación Total del Módulo/Pestaña N1 "Diagnóstico":**
  - Se removió por completo el icono de tres barras verticales `#btnTabEnc` ("Diagnóstico") de la barra de navegación de Nivel 1 en [Admin.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/Admin.html).
  - Se eliminó la sub-cinta N2 asociada `#cintaEnc` y su inclusión de servidor `AdminEncuestas.html`.
  - Se limpiaron las rutinas de conmutación de pestañas para operar de forma depurada únicamente sobre los módulos activos: **Usuarios**, **Asistencia**, **Lecturas** y **Planeación Didáctica**.
- **Comportamiento Estricto del Sub-Ribbon N2 en Planeación:**
  - **Entrada Limpia sin Preselección:** Al hacer clic en la pestaña de Nivel 1 "Planeación Didáctica", ya no se autoselecciona ningún sub-icono (`#btnSubPlanBancoPersonal` ya no inicia con clase `activo` forzada) ni se abre contenido prematuramente. La sub-cinta N2 (`cintaPlan`) se muestra expandida para que el usuario elija conscientemente la opción deseada (`[Horario Oficial]`, `[Mi Banco Personal]`, `[Repositorio Global]`, `[+ Nueva Planeación]`, o `[Ayuda]`).
  - **Colapso Automático de N2 y Despliegue de Vista:** Al seleccionar cualquier sub-opción del Nivel 2, se activa dicho botón, se colapsa/oculta inmediatamente la sub-cinta N2 llamando a `ribbonColapsarTrasN2()`, y se despliega el contenido en toda la pantalla inferior.
  - **Alternancia Universal (Regla de Oro ST90):** Si el usuario desea volver a ver o cambiar de sub-icono del Nivel 2, un clic adicional en la pestaña activa de N1 ("Planeación") despliega o repliega la cinta N2 de forma ágil e idéntica a todos los demás módulos del sistema.

### 12. Rediseño Limpio del Toolbar del Horario, Botones Uniformes e Importación XML Directa (@392)
- **Reorganización Estética del Toolbar de Horarios (`#navCalClase`):**
  - Se eliminó el aspecto desordenado y caótico donde el campo nativo de fecha (`input[type="date"]`) se mostraba visible empujando los controles fuera de alineación.
  - Se estructuró una **barra de herramientas moderna en dos filas bien balanceadas**:
    - **Fila 1 (Filtros de Contexto y Acciones Principales):**
      - Chips estilizados para `[Fecha]`, `[Grupo]`, `[Asignatura]` y `[Alumno]`.
      - Botón destacado de acción rápida: **`[📥 Importar Horario XML]`** para subir o actualizar el archivo XML de horarios oficial sin tener que navegar a otras secciones.
      - Botón **`[Ayuda]`** contextual con color ámbar suave.
    - **Fila 2 (Navegación y Vistas):**
      - Controles de navegación temporal: botones `◀` y `▶`, badge de rango semanal estilizado (`02/nov/26 → 06/nov/26`) y botón `[Hoy]`.
      - Switch segmentado de Modo: `[Día | Semana | Mes]`.
      - Switch segmentado de Orientación: `[⊞ Horizontal | ⊟ Vertical]`.
- **Estandarización de Tamaño en Todas las Celdas/Botones de Clase (`.cal-celda`):**
  - Se configuró la cuadrícula (`.cal-tabla`) con `table-layout: fixed !important`, ancho de columna de hora fijo a `68px` y distribución simétrica de columnas para los días.
  - Todos los botones de clase ahora poseen **dimensiones idénticas y uniformes** (`height: 58px`, `width: 100%`), display flex centrado vertical/horizontal y truncamiento elegante con puntos suspensivos (`text-overflow: ellipsis`) para materias o docentes largos, evitando cualquier deformación en la cuadrícula.
- **Ubicación del Archivo Horario XML:**
  - El modal de carga `abrirModalHorarioAsi()` existía exclusivamente en la pestaña *Usuarios ➔ Subpestaña Prefectas*, la cual no estaba disponible en la vista docente (`?pagina=docente`).
  - Ahora se integró el disparador directo **`[📥 Importar Horario XML]`** dentro de la barra superior del Horario Oficial en [AdminPlaneacion.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/AdminPlaneacion.html) y [Admin.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/Admin.html).

---

### 11. Activación Integral y Reactiva de los Iconos de Planeación Didáctica (@391)
- **Diagnóstico del problema reportado en `?pagina=docente`:**
  - Al presionar los accesos directos de la cinta N2 de Planeación (`[Horario Oficial]`, `[Mi Banco Personal]`, `[Repositorio Global]`, `[+ Nueva Planeación]` y `[Ayuda]`), los botones no reaccionaban debido a que:
    1. **Contenedor padre oculto (`#vistaMae`):** El contenedor principal `#vistaMae` tenía la clase `.oculto`, impidiendo la visualización tanto de `#tabClases` (horario) como de `#tabPlaneacion` (banco y formulario).
    2. **Funciones no resueltas (ReferenceErrors):** Las llamadas a `fechaLocalClase()`, `pintarEtqFiltroClase_()`, `textoOpcionClase_()`, `fmtFechaCortaClase_()`, `recortarEtq_()` y `tabN1Clase()` no estaban definidas en el scope de [AdminPlaneacion.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/AdminPlaneacion.html), abortando la ejecución de `cargarHorarioMae()` y `abrirFormNuevaPlaneacion()`.
    3. **Desincronización de credenciales (`tokenClase` vs `token`):** La variable `tokenClase` no se actualizaba dinámicamente con el token autenticado de sesión de [Admin.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/Admin.html), provocando rechazos de autorización en las llamadas remotas `gsRun`.
    4. **Incompatibilidad de nombres en sesiones:** Se corrigieron los llamados a `renderizarTabsSesiones()` y `cargarSesionActivaEnEditor()` vinculándolos con `pintarTabsSesiones()` y `seleccionarSesionNEM()`.
- **Solución implementada:**
  - Se incorporaron todas las funciones utilitarias y de formateo de fecha/filtro dentro de [AdminPlaneacion.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/AdminPlaneacion.html).
  - Se implementó `getTokenPlan_()` para resolver transparentemente el token de sesión activo.
  - Se reescribió `conmutarVistaPlaneacion_()` y `abrirFormNuevaPlaneacionNEM()` con alternancia fluida de clases CSS (`.activo`), apertura garantizada del contenedor `#vistaMae`, remoción de `.oculto` en los módulos correspondientes y recarga inmediata de la cuadrícula o catálogo.
  - Se sincronizó el ciclo de limpieza de cintas en `iniciarCintaSinSeleccion_()` de [Admin.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/Admin.html) para incluir `'plan'` y `'enc'`.
  - Código desplegado y activado en producción en versión **`@391`**.

---

### 10. Integración de la Cinta Ribbon Superior Unificada (5 Pestañas Maestras), Corrección de Dropdowns y Blindaje Institucional (@388)
- **Integración de la Cinta Ribbon Superior:**
  - En la fila superior de tabs (`#menuTabsPanel` / `.tabs`), se añadieron las dos pestañas maestras centrales:
    - 📝 **Planeación Didáctica (`plan`):** Conduce a la suite completa (`#tab-plan` / `#moduloViewPlaneacion`), que alberga la Malla Horaria, el Stepper de 4 etapas NEM, el Constructor de Clases tipo eXeLearning y el Banco Personal vs. Global. En su sub-barra N2 (`#cintaPlan`) se presentan los accesos directos: `[Horario Oficial]`, `[Mi Banco Personal]`, `[Repositorio Global]`, `[+ Nueva Planeación]`, y `[Ayuda]`.
    - 📊 **Diagnóstico & Encuestas (`enc`):** Conduce al censo escolar y diagnóstico situacional (`#tab-enc` / `#moduloViewEncuestas`), con el tablero de métricas analíticas de riesgo vial, movilidad y convivencia comunitaria, constructor de preguntas y puente al CTE. En su sub-barra N2 (`#cintaEnc`) expone: `[Métricas de Censo]`, `[Editor de Preguntas]`, `[Vincular a Planeación CTE]`, `[Enlace Público Alumnos]` y `[Ayuda]`.
- **Control de Estado Activo Unificado:**
  - Extensión de la función maestra `aplicarTab(id, boton)` para alternar limpiamente las 5 pestañas maestras (`'mat'`, `'asi'`, `'lec'`, `'plan'`, `'enc'`), aplicando la clase `.activa` únicamente al tab seleccionado, mostrando su sub-barra N2 y conmutando los bloques sin recargar la página.
  - Preservación completa del flujo docente: selector de clases, Stepper en 4 etapas, banco personal vs global y clonación directa de planeaciones institucionales.
- **Corrección de Menús Desplegables Cortados (Dropdowns Overflow Fix):**
  - Se eliminó el recorte inferior en el submenú de Ajustes (`#menuCfgTabs` / `.submenu-cfg`) y en el panel de selección de grupos de Asistencia (`#panelGruposRepAsi` / `.asi-dd-panel`).
  - Se blindaron los contenedores padres (`.barra-sup`, `.ribbon-main-nav`, `.cinta-n2`, `.cinta-n3`, `#tarjetaRepAsi`, `.asi-tarjeta-lista`, `.caja-tabla-mat`) con `overflow: visible !important` y se elevó el `z-index` de los paneles flotantes a `99999 !important` con sombras elevadas y scroll interno `max-height: 80vh`.
- **Blindaje Preventivo de Siembra Demo (`sembrarAsistenciaDemo`):**
  - Se corrigió la excepción de acceso denegado en entornos de producción (`ENTORNO=PRUEBAS`). Al abrir el modal de prueba en producción, se advierte de forma institucional y se previene el toast de error rojo del servidor.

---

### 1. Navegación Directa 1-Clic: Horario Escolar ➔ Planeación NEM
- **Antes:** Al seleccionar una clase en la cuadrícula semanal del horario, se abría una tarjeta intermedia de publicación de audio (`cajaFormMae`) que requería clics adicionales para comenzar a planear.
- **Avance implementado:** Al hacer clic en cualquier celda de clase, el sistema navega **directamente y en 1 solo clic** al formulario de diseño de la Planeación Didáctica NEM, cargando en memoria todos los metadatos de la clase seleccionada (asignatura, grupo, fecha, hora y docente).

---

### 2. Eliminación de Campos Redundantes: Banner de Encabezado de Clase
- **Antes:** Al abrir el formulario de planeación, el docente debía volver a seleccionar el grado, grupo, asignatura, fecha y periodo escolar, generando fricción e inconsistencias.
- **Avance implementado:**
  - Los campos de selección repetitivos fueron retirados de la vista editable y encapsulados en un contenedor técnico oculto para garantizar el envío íntegro de datos al backend.
  - En la parte superior del formulario se incorporó un **Banner de Encabezado de Alto Impacto** (`#bannerClaseNEM`), que presenta:
    - **Materia y Grupo:** ej. `MATEMÁTICAS · 2°A`
    - **Fecha de impartición:** ej. `19/10/2026`
    - **Hora y Módulo:** ej. `Hora 2 (07:40–08:20)`
    - **Periodo Escolar SEP:** Calculado automáticamente según la fecha (ej. `1° Trimestre SEP (Ago - Nov)`).
    - **Docente Titular Asignado:** ej. `Docente: DAVID`.

---

### 3. Asistente Curricular Dinámico: Matriz Canónica SEP Fase 6 (Contenidos y PDA)
- **Base Curricular:** Integración de la estructura del *Programa Sintético de la Fase 6 de la SEP para Educación Secundaria*:
  - **4 Campos Formativos:** *Lenguajes*, *Saberes y Pensamiento Científico*, *Ética, Naturaleza y Sociedades*, *De lo Humano y lo Comunitario*.
  - **Disciplinas cubiertas:** Español, Inglés, Artes, Matemáticas, Ciencias (Biología 1°, Física 2°, Química 3°), Geografía 1°, Historia, Formación Cívica y Ética, Tecnología, Educación Física y Tutoría / Socioemocional.
- **Avance interactivo:**
  1. **Selector Dinámico de Contenidos Centrales:** Al detectar la asignatura de la clase seleccionada, lista los contenidos oficiales de la disciplina.
  2. **Selector Dinámico de PDA por Grado:** Al elegir un contenido, presenta la progresión de aprendizaje esperada para el grado escolar de la clase (**1.°, 2.° o 3.°**), con acceso a las progresiones de los otros grados.
  3. **Copia Textual Automática:** Al pulsar sobre el PDA, se transfiere textualmente la redacción oficial de la SEP al campo de trabajo del proyecto, permitiendo adecuaciones curriculares si el docente lo requiere.

---

### 4. Fusión de Audio, Escucha y Publicación en el Diseño de Sesiones Didácticas
- **Reubicación Estratégica:** Las herramientas de redacción y publicación de audio fueron trasladadas de la vista de horarios al **Diseño de Sesiones Didácticas de 40 Minutos** (`editorSesionActiva`), donde pedagógicamente pertenecen:
  - **Título / Tema de la clase:** Campo para el enfoque específico de la sesión.
  - **Texto que escuchará el alumno:** Campo principal con indicación clara: *"Escribe o pega aquí lo que se va a leer en voz alta"*.
  - **☑ Publicar ahora:** Casilla de verificación para disponibilizar de inmediato el texto sonoro en el Aula Hablada.
  - **Botón «Escuchar»:** Integra síntesis de voz en tiempo real con Web Speech API para preescuchar cómo sonará la narración para los estudiantes videntes e invidentes (con controles de pausa/reanudación).
  - **Botón «Guardar»:** Almacena la estructura pedagógica de la sesión y, si está activo el selector, sincroniza y publica directamente en el Horario Escolar.

---

### 5. Integración del Horario Oficial aSc Timetables (600 Clases Reales)
- **Extracción e Ingestión:** Procesamiento íntegro de las 600 tarjetas de clase del archivo maestro `Horario.xml`.
- **Cobertura Completa:** 15 grupos escolares (`1A`–`1E`, `2A`–`2E`, `3A`–`3E`) con nombres de docentes reales, materias oficiales, aulas y módulos horarios exactos (de 07:00 a 14:00 horas).
- **Mapeo Real:** Asignaciones fidedignas (ej. Abigail/David en Matemáticas, Gabriela/Miguel en Español, Dileri/Valeria en Ciencias, Erika/Fragoso en Tecnología, Kristel en Inglés, etc.).

---

### 6. Robustez, Concurrencia y Seguridad (Suite 16/16)
- **Suite de Pruebas Automatizadas:** Mantenimiento de la suite de regresión y verificación sintáctica en Node.js VM (`.rsc/test_cierre_definitivo.js`), con **16 de 16 pruebas aprobadas (100%)**:
  - *Suite 1 (A.1 – A.5):* Consistencia del historial e inmutabilidad de calificaciones al recuperar intentos.
  - *Suite 2 (B.1 – B.6):* Revocación legítima de sesiones, protección de tokens cruzados y sesiones concurrentes.
  - *Suite 3 (C.1 – C.5):* Integridad curricular NEM Fase 6, inicialización de sesiones DUA, calendarización y renderizado multimodal.
- **Sincronización:** Uso de `LockService` y `CacheService` para prevenir colisiones en escrituras concurrentes de Google Sheets.

---

### 7. Asistente Curricular NEM Optimizado: Selección Múltiple de PDA e Integración IA
- **Filtro Estricto por Grado:** Al abrir una clase (ej. Geografía o Inglés de 1.°), el selector de PDA filtra estrictamente los registros correspondientes al grado asignado, eliminando la aparición indebida de opciones de 2.° y 3.° grado en el flujo de selección activa.
- **Depuración Curricular SEP Fase 6:** Se corrigió el catálogo eliminando progresiones apócrifas en Geografía (asignatura exclusiva de 1.° de secundaria en el marco oficial SEP) y enriqueciendo Inglés y otras disciplinas con múltiples PDA oficiales por grado.
- **Selección Múltiple Interactiva:** Se sustituyó el selector desplegable rígido de 1 sola opción por una lista de tarjetas de verificación (`checkbox`) con buscador en tiempo real (`#buscarPDANEM`), botones de acción rápida (*Marcar todos* / *Limpiar*) y contador dinámico de PDA seleccionados.
- **Consulta de Articulación Vertical:** Se integró un panel colapsable de solo lectura para consultar la progresión del contenido en otros grados sin contaminar la planeación de 1.°.
- **Asistente Pedagógico IA (DeepSeek):**
  - Botón *✨ Sugerir Proyecto con IA*: genera de forma situada y justificada el *Problema de la Comunidad*, *Propósito Formativo*, *Producto Final* y *Ejes Articuladores* a partir de los PDA seleccionados.
  - Botón *✨ Desglosar Sesiones con IA (40 min DUA)*: asiste la redacción pedagógica de los 4 momentos de cada sesión (Apertura 5m, Explicación 10m, Actividad 20m, Cierre 5m) y sugiere la descripción auditiva obligatoria para recursos visuales.
- **Suite de Pruebas Ampliada:** Se agregaron las pruebas `C.6`, `C.7` y `C.8`, alcanzando **19 de 19 pruebas exitosas (100%)**.

---

### 8. Refactorización Full-Stack: Arquitectura Relacional en Cascada, CSS Semántico y Modernización ES6+ (23 de Octubre de 2026)
- **Refactorización de Código Heredado (CSS Semántico & a11y):**
  - Eliminación integral de estilos en línea en el banner de clase seleccionada (`#bannerClaseNEM`), badges de estado y contenedores del catálogo, trasladándolos a clases CSS semánticas (`.nem-banner`, `.nem-banner-header`, `.nem-banner-title`, `.nem-catalogo-box`, `.nem-badge-official`, `.nem-badge-count`, `.nem-lista-pda`, `.nem-ai-banner`).
  - Accesibilidad reforzada (a11y) agregando el atributo `aria-live="polite"` al contador de PDAs (`#badgeConteoPDAs`) para anunciar cambios dinámicos a lectores de pantalla.
- **Implementación de Lógica en Cascada Reactiva NEM (Asignatura ➔ Campo ➔ Metodología ➔ Contenidos ➔ PDA):**
  - Al detectar la clase (ej. *Geografía · 1°A*), los campos de *Campo Formativo* y *Metodología Sociocrítica* se autoseleccionan automáticamente y quedan bloqueados (`disabled = true`) para salvaguardar la coherencia epistémica del proyecto formativo (ej. Geografía queda vinculada a *Ética, Naturaleza y Sociedades* bajo *ABP*).
  - El selector `#selContenidoSinteticoNEM` se puebla exclusivamente con los contenidos de la disciplina detectada.
  - La lista de PDA renderiza estrictamente las progresiones correspondientes al grado de la clase (1.° de secundaria).
- **Modernización ES6+ y Prevención de Errores (Guard Clauses):**
  - Migración de inyección de HTML por concatenación tradicional hacia **Template Literals** (`` ` ``) y adopción sistemática de **Arrow Functions** (`=>`) en métodos de orden superior (`.map()`, `.find()`, `.filter()`, `.forEach()`).
  - Incorporación de cláusulas de guarda (`guard clauses`) para validar tempranamente la existencia de colecciones, arrays y propiedades antes de ejecutar manipulaciones en el DOM.

---

### 9. Integración Institucional: Contexto Socioeducativo (Programa Analítico CTE) y Educación Inclusiva (UDEI / DUA) (23 de Octubre de 2026)
- **Cumplimiento Normativo del Programa Analítico (CTE & PMC):**
  - Se transformó el campo libre de problemática comunitaria en un **componente híbrido inteligente** (`#selProblemaEscolar` + `#planProblema`).
  - El selector se alimenta del catálogo oficial del Consejo Técnico Escolar (`CATALOGO_PROGRAMA_ANALITICO_CTE_`), alineado al Programa de Mejora Continua (PMC) de la Técnica 90 con problemáticas situadas: escasez hídrica, convivencia escolar y cultura de paz, hábitos alimenticios y nutrición, residuos sólidos y medio ambiente, e identidad comunitaria.
  - Al seleccionar una problemática comunitaria, el área de texto se autocompleta con una descripción contextualizada que el docente puede afinar y delimitar libremente para su proyecto formativo específico.
- **Obligatoriedad de la Educación Inclusiva y Detección de Diversidad (Padrón UDEI & DUA):**
  - En congruencia con los Artículos 61 a 68 de la Ley General de Educación y los principios rectores de la NEM, se implementó el motor de detección de diversidad áulica mediante el padrón institucional `PADRON_INCLUSION_UDEI_`.
  - Si el grupo seleccionado registra estudiantes que enfrentan Barreras para el Aprendizaje, la Participación y la Convivencia (BAPyC) o condiciones específicas (TDAH, baja visión, dislexia, hipoacusia, TEA, aptitudes sobresalientes), el sistema activa condicionalmente la sección `#secInclusionBAPyC` con transiciones visuales CSS fluidas.
  - La sección presenta un **Badge de alerta amigable UDEI**, chips descriptivos de las necesidades identificadas y un área de texto obligatoria (`#planAjustesRazonables`) para planificar adaptaciones de acceso, formato y evaluación formativa.
- **Asistente Pedagógico IA con Perspectiva DUA Mandatoria:**
  - El prompt enviado al servicio de Inteligencia Artificial (`asistirDisenoProyectoNEM`) ahora detecta si `grupoTieneBAPyC === true`. De ser así, instruye obligatoriamente a la IA a generar recomendaciones específicas basadas en los tres principios del Diseño Universal para el Aprendizaje (DUA): múltiples formas de representación, múltiples formas de acción/expresión y múltiples formas de implicación, vinculadas al contenido y PDA de la SEP.

---

### 10. Rediseño Ergonómico Compacto: Distribución Exacta en 4 Bloques (23 de Octubre de 2026)
- **Bloque 1 (Imagen 1 en 1 sola fila):**
  - *Título del Proyecto o Planeación* (ancho principal ~38%), *Campo Formativo* (~23%), *Metodología Sociocrítica* (~26%) y *Número de Sesiones de 40 min* (~13%) se condensaron en **una sola fila horizontal** (`.nem-fila-una`), eliminando por completo los saltos de línea innecesarios y el espacio vacío residual.
- **Bloque 2 (Imagen 2 en 2 columnas):**
  - La tarjeta verde del Catálogo Dinámico SEP (`.nem-catalogo-box`) se estructuró internamente en **2 columnas balanceadas** (`.nem-catalogo-dos-col`):
    - *Columna Izquierda:* Selector de Contenido Central Oficial del Programa Sintético SEP.
    - *Columna Derecha:* Buscador en tiempo real, contador badge de PDA, acciones rápidas (Todos/Limpiar), lista interactiva con scroll interno (`max-height: 165px`) y enlace de articulación vertical.
- **Bloque 3 (Imagen 3 en 2 columnas):**
  - Las áreas de texto oficiales de *Contenido Curricular Sintético* y *PDA Oficiales* se desplegaron en **2 columnas side-by-side (50% / 50%)**, aprovechando todo el ancho de pantalla y reduciendo a la mitad su altura vertical previa.
- **Bloque 4 (Imagen 4 a un solo botón):**
  - Se eliminó la caja azul sobredimensionada y el subtítulo del Asistente Pedagógico IA, dejando exclusivamente **un solo botón directo y elegante**: `✨ Sugerir Proyecto con IA` (`.nem-btn-ai-solo`), ubicado de forma ágil inmediatamente antes de los campos de *Problema Comunitario* y *Propósito*.

---

## Historial de Versiones Recientes

| Versión | Hito Principal |
|---|---|
| `@387` | **Conmutación Reactiva Instantánea de Módulos Shell en `Clase.html`:** Definición estricta de `MAPA_MODULOS_` vinculando directamente cada clave con su contenedor DOM (`moduloViewPlaneacion`, `moduloViewEncuestas`, `moduloViewLectura`, `moduloViewAsistencia`, `moduloViewTrabajoSocial`, `moduloViewBiblioteca`, `moduloViewAdmin`). Al conmutar, se ocultan todos los contenedores con `.oculto`, `.d-none` y `display: none !important`, se desactiva la clase `.activo` en el sidebar, y se activa con `display: block !important` únicamente el contenedor destino y su botón correspondiente. Desenganche total de la cuadrícula de horarios (`#vistaMae` dentro de `#moduloViewPlaneacion`) al cambiar a otros módulos. Enlace directo y fluido en `#moduloViewAdmin` hacia `?pagina=admin` para acceso irrestricto al Panel Maestro. |
| `@386` | **Reestructuración Integral por Roles y Vistas Reales (Suite Escolar ST90):** Restauración del gobierno estricto de accesos por roles en `iniciarSesionUnificada` (Prefectas con grupos exclusivos de `PrefectoGrupos`, Alumnos con panel personal `Interfaz.html` e historial/PPM/niveles cognitivos, Docentes con horario de 600 clases y Banco Personal/Global, Administrador con acceso total a `Admin.html`). Restauración de las vistas reales maestras: Banco de Comprensión Lectora (`AdminLecturas.html` / `#tab-lec`), Gestión Integral de Usuarios (`AdminUsuarios.html` / `#tab-mat`), y Asistencia Dual Alumnos/Docentes (`AdminAsistencia.html` / `#tab-asi`). Arquitectura del Banco de Planeaciones (`PlaneacionesNEM`) con 24 columnas (`DocentePropietario`, `Estado`, `EsCopiaDe`), distinción entre Banco Personal (Borradores/Publicadas del autor) y Repositorio Global Escolar (espacio colegiado de proyectos terminados con filtros por Asignatura, Grado, Trimestre y Docente, función `clonarPlaneacionAGlobal` para "Copiar a mi Banco", permisos estrictos contra edición ajena y validación de calidad antes de publicar con `publicarPlaneacionEnRepositorio`). Inyección directa del Censo Escolar al Diagnóstico CTE (`#planProblema`). Editor de bloques interactivos iDevices tipo eXeLearning (Lectura Guiada Web Speech, Pregunta Formativa, Desafío Práctico). Suite de regresión superada al 100% (19/19) y 40/40 controles de interfaz presentes. |
| `@385` | **Corrección de Routing `doGet` y Acciones del Hub de Administración:** Desacoplamiento de la captura agresiva de `esVistaClase_` en `Codigo.gs` para permitir que consultas como `?pagina=admin`, `?pagina=docente`, etc. evalúen su plantilla correspondiente (`Admin.html`) en lugar de recargar `Clase.html`. En `Clase.html`, reemplazo de la ruta relativa fallida (`Admin.html` que provocaba el error de Google Drive "No se puede abrir el archivo") por un resolutor canónico dinámico (`obtenerUrlAdminReal_()`). Las 4 tarjetas de Administración ahora ejecutan acciones directas: `gestionarAlumnosAdmin_()` y `gestionarCredencialesAdmin_()` abren e integran la consola embebida; `verMallaHorariaPlaneacion_()` conmutada y enfoca la cuadrícula de los 600 bloques de horario; y `verReportesDesempeno_()` despliega un modal unificado con acceso directo a todos los reportes de la suite. |
| `@384` | **Conmutación Reactiva de Módulos Shell & Carga Completa:** Corrección estructural del DOM (`<main class="app-shell-main">`) y normalización del despachador `conmutarModuloShell(nombreModulo)` con soporte para nombres de clave o IDs (`moduloViewEncuestas`, etc.). Visibilidad reactiva con `.oculto`, `.d-none` y `display: none !important`. Traslado de clase activa (`.activo` con `--app-primary-soft` y checkmark `✓`). Preservación del estado en memoria (`planActualNEM`, `sesionesActualesNEM`). Integración completa de analítica Chart.js y constructor de reactivos en Diagnóstico Escolar, tablero y cronómetro en vivo PPM en Comprensión Lectora, tabla interactiva de asistencia rápida (P/F/R/J) conectada a `Asistencia.gs`, consolas de Trabajo Social y Biblioteca con conectores LEGO listos, y consola administrativa con vista previa embebida. |
| `@381`–`@383` | Arquitectura Modular tipo "LEGO" y Design System Unificado: App Shell con Sidebar colapsable persistente (7 módulos reactivos), homologación de tokens visuales de `SKILL.md` (`--app-primary`, tinte suave, etc.), rediseño UX en Stepper de 4 etapas para Planeación NEM, bloques iDevices modulares (eXeLearning / Web Speech DUA), catálogo oficial de Libros de Texto Gratuitos SEP Fase 6 (`CATALOGO_LIBROS_SEP_FASE6_`) y puente de datos entre Encuestas y Diagnóstico CTE. |
| `@380` | Alineación Horizontal de Controles y Modal CTE: Selector CTE + Problema Comunitario + Propósito en 1 sola fila de 3 columnas (`.nem-fila-tres-col`), botón IA integrado en cabecera sin renglón vacío, y los 3 botones del modal de gestión CTE (`➕ Agregar`, `Cancelar`, `💾 Guardar`) alineados en una sola fila. |
| `@379` | Corrección de inyección IA con fondo modal y autofill en planeación didáctica. |
| `@378` | Rediseño Ergonómico Compacto: Fila única de 4 metadatos (Img 1), Catálogo SEP en 2 columnas (Img 2), Textareas curriculares en 2 columnas (Img 3) y Asistente IA simplificado a un solo botón (Img 4). |
| `@377` | Integración Institucional: Contexto Socioeducativo (Programa Analítico / CTE), Módulo de Inclusión Escolar UDEI (BAPyC), directrices DUA obligatorias en IA y componente híbrido de problemáticas comunitarias. |
| `@376` | Refactorización Full-Stack: Arquitectura relacional en cascada NEM (Asignatura ➔ Campo ➔ Metodología ➔ Contenidos ➔ PDA), CSS semántico limpio, Template Literals ES6+, a11y con `aria-live="polite"` y guard clauses. |
| `@375` | Asistente Curricular NEM optimizado: selección múltiple de PDA por grado exacto, depuración curricular SEP Fase 6, panel de articulación vertical y Asistente Pedagógico IA (DeepSeek). |
| `@374` | Integración del Asistente Curricular Dinámico SEP Fase 6 (Contenidos y PDA), clic directo desde Horario a Planeación NEM, Banner de Encabezado limpio y controles de audio/escucha en el diseño de sesión. |
| `@373` | Ingesta de las 600 clases oficiales de aSc Timetables en `HorarioOficial.gs` y actualización de docentes y grupos reales. |
| `@371`–`@372` | Despliegue del motor de Planeación Didáctica NEM y sesiones de 40 minutos con enfoque DUA. |
| `@365` | Homologación visual de arquitectura tipo cinta Ribbon ST90 y filtros directos de grupo/grado. |

---

## Estado Actual y Próximos Pasos

- **Estado de Producción:** Desplegado, probado y funcional en versión `@409`.
- **Siguientes Pasos Sugeridos:**
  1. Recolección de retroalimentación de los docentes al diseñar sus primeros proyectos comunitarios con los PDA oficiales.
  2. Pruebas de campo con alumnos invidentes utilizando los atajos de teclado del Aula Hablada (`Espacio`, `j`, `l`, `r`).
  3. Exportación automatizada de la planeación didáctica completa a formato PDF o documento imprimible oficial.


### Despliegue v389 (Fix de recorte en menú desplegable de grupos de asistencia)
- **Causa Raíz:** #tarjetaRepAsi y #tab-asi se colapsaban a ~62px al estar vacío #cuerpoRepAsi, recortando el menú desplegable #panelGruposRepAsi en el límite inferior.
- **Blindaje:** Altura mínima de 360px en #tarjetaRepAsi, overflow: visible !important en toda la cadena jerárquica y z-index: 999999 en #panelGruposRepAsi con scroll vertical interno (overflow-y: auto).
- **Versión:** Despliegue @389 en AKfycbzPQDTjMqHGpSfBg3KMrDBpxSweOAk2x5adcMLJ4aJHvM2ETGtGI-rm1bz3aDRxj-FAgQ.


### Despliegue v390 (Activación completa de opciones de menú de Planeación Didáctica)
- **Causa Raíz:** El contenedor #vistaMae en AdminPlaneacion.html tenía la clase oculto, impidiendo la visualización de #tabClases y #tabPlaneacion. Además, faltaban las funciones de carga de la cuadrícula del Horario Oficial y las entradas correspondientes en AYUDAS_ST90.
- **Correcciones Realizadas:**
  * Retirada la clase oculto de #vistaMae para asegurar visibilidad permanente del lienzo de trabajo.
  * Integrada la lógica completa de Horario Maestro (cargarHorarioMae, pintarCalendarioMae_, etc.).
  * Ajustadas las funciones conmutarVistaPlaneacion_ y brirFormNuevaPlaneacionNEM para gobernar Horario Oficial, Mi Banco Personal, Repositorio Global y Nueva Planeación.
  * Añadida la ayuda pedagógica oficial de planeacionNEM y encuestas a AYUDAS_ST90 en ComunJS.html.
- **Despliegue:** Versión @390 en AKfycbzPQDTjMqHGpSfBg3KMrDBpxSweOAk2x5adcMLJ4aJHvM2ETGtGI-rm1bz3aDRxj-FAgQ.

### Despliegue v404–v405 (Integración unificada de Diagnóstico y Encuestas sin cinta redundante)
- **Causa Raíz previa:** Colisión de variable `let modal` en AdminEncuestas con la función global `modal()` de ComunJS que impedía definir `gsRun` y congelaba el login.
- **Rediseño de Cinta Ribbon ST90:**
  * Ocultada la sub-cinta duplicada N2 de Encuestas (`#cintaEnc`) en la cabecera general para evitar doble hilera de navegación redundante.
  * Añadidos los botones de acción rápida **Enlace Alumnos** (`btnEnlaceAlumnosBarra`, copia del enlace para estudiantes) y **Ayuda** (`btnAyudaEncBarra`, modal explicativo de analítica) directamente en la barra de herramientas del constructor (`#barraContextual`).
  * Estilizado `#barraContextual` y las pestañas de vista (`#adminSubTabs`) con el estándar visual ST90 (fondos limpios `#ffffff`, bordes `#cbd5e1`, resaltado activo en azul `#2563eb` con borde `#94a3b8`, e iconos SVG nítidos de Lectura).
  * Todos los controles de segmentación, gráficas, hoja de datos y herramientas ahora conviven en una **única fila horizontal**.
- **Despliegue:** Versión `@405` en `AKfycbzPQDTjMqHGpSfBg3KMrDBpxSweOAk2x5adcMLJ4aJHvM2ETGtGI-rm1bz3aDRxj-FAgQ`.

### Despliegue v406 (Restauración exacta de estilos de modales y menús desplegables del constructor)
- **Diagnóstico y Causas Raíz Identificadas:**
  * **Sangrado de estilos globales (`ComunCSS.html`):** Las reglas globales de etiqueta `button { padding: 10px 16px; border: none; background: var(--st90-azul); color: #fff; }`, `input, select, textarea { padding: 8px; border: 1px solid #bdc3c7; }` y `label` sobreescribían de manera agresiva a todos los componentes hijos de Bootstrap 5 en `#tab-enc`.
  * **Botón de Cierre (`.btn-close`):** Se renderizaba como un bloque rectangular azul opaco de ~40px perdiendo el icono SVG 'X'.
  * **Menús Desplegables (`.dropdown-menu`, `.dropdown-item`):** Cada botón de opción del menú (`<button class="dropdown-item">`) se transformaba en un botón sólido azul de 14px en lugar de una opción limpia de menú con fondo transparente, padding ergonómico (`.4rem .6rem`), esquinas redondeadas (`8px`) y efecto activo suave (`#eff6ff` / `#1d4ed8`).
  * **Modales (`.modal-content`, `.modal-header`, `.modal-footer`):** Perdían su estructura visual original (botones de cancelar y guardar se volvían indistinguibles en azul, el telón de fondo `.modal-backdrop` inyectado en `document.body` no recibía estilos adecuados, y los campos de formulario e inputs quedaban deformados).
  * **Sintaxis CSS inválida:** Se corrigió `#tab-enc @charset "UTF-8";` al inicio del bloque de estilos de Encuestas.
- **Acciones y Solución Aplicada:**
  * Se implementó un bloque de aislamiento y restauración CSS con alta especificidad y `!important` para:
    1. `.modal-backdrop` y `.modal-backdrop.show` en `document.body` con opacidad exacta del 50% y fondo `#000000`.
    2. `.modal`, `.modal-dialog`, `.modal-dialog-centered` y `.modal-dialog-scrollable`.
    3. `.modal-content` con `border-radius: 12px`, borde `#e2e8f0` y sombra profunda `0 20px 40px rgba(15, 23, 42, 0.18)`.
    4. `.modal-header` y `.modal-title` en gris oscuro `#0f172a` (y azul `#2563eb` con texto blanco para el modal de simulación).
    5. `.btn-close` y `.btn-close-white` con icono SVG vectorial 'X', fondo transparente, padding `.25em` y respuesta hover.
    6. Botones de pie de modal con distinción visual: `.btn-secondary` en gris pizarra (`#64748b`), `.btn-primary` en azul (`#2563eb`), `.btn-outline-secondary` en blanco/borde suave.
    7. Controles de formulario (`.form-control`, `.form-select`, `.form-check-input`, `.form-label`) restaurando proporciones y chevrones SVG.
    8. `.dropdown-menu` con borde redondeado `12px`, padding `.4rem`, sombra `0 10px 25px rgba(15,23,42,0.12)` y `.dropdown-item` con tipografía `0.85rem`, hover gris tenue `#f1f5f9` y activo en tinte azul `#eff6ff`.
- **Despliegue:** Versión `@406` en `AKfycbzPQDTjMqHGpSfBg3KMrDBpxSweOAk2x5adcMLJ4aJHvM2ETGtGI-rm1bz3aDRxj-FAgQ`.

### Despliegue v407 (Iconos flotantes sin contenedor en barra contextual de Encuestas)
- **Solicitud del Usuario:**
  * Eliminar el contenedor recuadro tipo tarjeta de los iconos de la barra de herramientas de Encuestas (`#barraContextual`).
  * Mostrar únicamente los iconos flotando en el fondo con el estilo nativo de los iconos del ribbon principal de Lectura ST90.
- **Ajustes Realizados:**
  * **Eliminación del Contenedor:** Se retiraron las clases `.card`, `.shadow-sm` y `p-2` de `#barraContextual`, y se anularon sus bordes, fondos y sombras (`background: transparent !important; border: none !important; box-shadow: none !important;`).
  * **Pestañas de Vista Flotantes (`#adminSubTabs`):** Se eliminó el fondo gris pill (`#f1f5f9`), permitiendo que los 3 iconos (Gráficas, Hoja de datos, Constructor) floten limpiamente sobre el lienzo. Al estar activos, adquieren el relieve sutil de tarjeta blanca con borde `#94a3b8` idéntico al ribbon principal.
  * **Iconos de Filtro y Acción Flotantes:**
    1. Estado de reposo: Fondo transparente sin borde de caja (`border: 1px solid transparent; background: transparent;`).
    2. Estado hover: Iluminación con fondo tenue `#f1f5f9`, escala sutil `1.06` y color azul institucional ST90 (`var(--st90-azul)`).
    3. Estado activo: Tarjeta blanca con borde `#94a3b8` y sombra suave (o tinte azul `#eff6ff` en filtros aplicados).
    4. Acentos de color integrados: Enlace Alumnos en verde `#16a34a` con hover `#f0fdf4`, y Ayuda en ámbar `#ca8a04` con hover `#fefce8`.
  * **Integración Completa del Set de Herramientas:** Quedaron alineados armónicamente en una sola fila flotante los 3 subtabs a la izquierda, los filtros de dimensión en el centro, y los 5 botones de acción a la derecha (Enlace Alumnos, CSV, PDF, Mantenimiento, Ayuda).
- **Despliegue:** Versión `@407` en `AKfycbzPQDTjMqHGpSfBg3KMrDBpxSweOAk2x5adcMLJ4aJHvM2ETGtGI-rm1bz3aDRxj-FAgQ`.



