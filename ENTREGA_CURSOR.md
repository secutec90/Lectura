# BUZÓN DE ENTREGA: CURSOR -> ANTIGRAVITY

> **INSTRUCCIÓN PARA CURSOR (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md`, `ESTADO_PROXIMA_SESION.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_CURSOR.md`) todo tu código JavaScript/DOM propuesto para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js cursor`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: PLAN MAESTRO EN 4 OLAS (`build-568` a `build-571`)
- **Estado:** 🟢 PROGRAMADA (LISTA PARA EJECUTAR — PRIORIDAD INMEDIATA: OLA 1 `build-568` Y OLA 2 `build-569`)
- **Archivos objetivo:** `AdminPlanJS_04.html`, `AdminPlanJS_05.html`, `ClaseJS_06.html`, `ClaseJS_07.html`, `AyudaJS.html`, `AdminEncJS_*.html`, `FormEncJS_*.html`

---

### 📦 OLA 1 (`build-568`): Etapas 3 y 4 + Membrete Institucional Configurable + Lista de Cotejo y Rúbrica Analítica en PDF Oficial NL

#### 1. Modal de Membrete Institucional Configurable (`#modalConfigMembreteST90`)
- En `AdminPlanJS_04.html` / `ClaseJS_06.html` y `AyudaJS.html`:
  - `window.configMembreteNEM_` inicializado con:
    - `logoIzq`: si viene vacío, usar `LOGO_NL_EDUCACION_B64_`
    - `logoDer`: si viene vacío, usar `LOGO_NL_GOBIERNO_B64_`
    - `linea1`: `'SECRETARÍA DE EDUCACIÓN DEL ESTADO DE NUEVO LEÓN'`
    - `linea2`: `'SUBSECRETARÍA DE EDUCACIÓN BÁSICA · DIRECCIÓN DE EDUCACIÓN SECUNDARIA'`
    - `linea3`: `'ESCUELA SECUNDARIA TÉCNICA N° 90 "MIGUEL ÁNGEL GRANADOS CHAPA"'`
  - Funciones:
    - `cargarConfigMembreteInicial_()` -> invoca `google.script.run.obtenerMembreteInstitucionalNEM()`
    - `abrirConfigMembreteNEM()` -> rellena `#cfgLogoIzq`, `#cfgLogoDer`, `#cfgEncL1`, `#cfgEncL2`, `#cfgEncL3` y muestra `#modalConfigMembreteST90`
    - `cerrarConfigMembreteNEM()` -> oculta `#modalConfigMembreteST90`
    - `guardarConfigMembreteNEM()` -> invoca `google.script.run.guardarMembreteInstitucionalNEM(token, payload)`

#### 2. Chips Rápidos de Ajustes Razonables DUA en Etapa 3 (`#secInclusionBAPyC`)
- En `AdminPlaneacion.html` y `Clase.html` dentro de `#secInclusionBAPyC` (arriba de `#planAjustesRazonables`), contenedor `.nem-chips-dua-bar` con 4 botones `.nem-chip-dua-rapido`:
  1. `+ Macrotipo y Alto Contraste` -> `insertarAjusteDUARapido('• Material visual con macrotipo, alto contraste y apoyos gráficos paso a paso (DUA Representación).')`
  2. `+ Audio DUA y Lectura Guiada` -> `insertarAjusteDUARapido('• Instrucciones breves apoyadas con lectura guiada y audio descriptivo (DUA Representación).')`
  3. `+ Tiempos Flexibles` -> `insertarAjusteDUARapido('• Tiempos flexibles de entrega, pausas activas focalizadas y evaluación diversificada (DUA Acción y Expresión).')`
  4. `+ Parejas Tutoras` -> `insertarAjusteDUARapido('• Trabajo colaborativo en parejas tutoras con monitoreo cercano y refuerzo positivo (DUA Motivación).')`
- Función `window.insertarAjusteDUARapido = function(textoChip)` que inserta la viñeta sin duplicar y dispara `input`/`change` para actualizar el borrador `localStorage`.

#### 3. Editor Interactivo de Lista de Cotejo + Generador de Rúbrica Analítica en Etapa 4 (`#cajaRubricaCotejoNEM`)
- Estado global: `window.criteriosCotejoPlanNEM_` (3 a 5 criterios) y `window.rubricaPlanNEM_` (4 niveles por criterio).
- Funciones requeridas:
  - `pintarTablaCriteriosCotejoDOM_()` -> renderiza `.nem-tabla-cotejo-edit` dentro de `#cajaRubricaCotejoNEM` con inputs `.input-criterio-cotejo-nem`, columnas `Sí ✓ | En proceso | No todavía` y botón `✕` (`quitarCriterioCotejo(idx)`).
  - `sincronizarCriterioCotejo(idx, valor)` -> actualiza `window.criteriosCotejoPlanNEM_[idx]` y regenera `generarRubricaDesdeCriterios_()`.
  - `agregarCriterioVacioCotejo()` -> agrega hasta un máximo de 5 criterios.
  - `generarCriteriosDesdePDANIA()` -> lee `#planPDA`, `#planContenidoSintetico` y `#planProposito` y construye de 3 a 5 criterios observables + su rúbrica analítica (`Sobresaliente (10)`, `Satisfactorio (8-9)`, `Básico (6-7)`, `Requiere Apoyo (5)`).
  - En `_generarHtmlDocumentoPlanoDidacticoNL_(p, sesiones)` (`AyudaJS.html`): conectar `window.configMembreteNEM_`, `window.criteriosCotejoPlanNEM_` (tabla `LISTA DE COTEJO`) y `window.rubricaPlanNEM_` (tabla `RÚBRICA ANALÍTICA DE EVALUACIÓN POR NIVELES DE DESEMPEÑO`).

---

### 📦 OLA 2 (`build-569`): Constructor de Clases (eXeLearning ST90) + iDevice Encuesta Diagnóstica / Actividad Evaluable

1. En la barra `.idevice-bar` (`AdminPlaneacion.html` y `Clase.html`), agregar botón:
   - `<button type="button" class="btn-idevice" onclick="insertariDeviceSesion_('encuesta')">📊 Encuesta / Diagnóstico</button>`
2. En `AdminPlanJS_05.html` y `ClaseJS_07.html`:
   - Soportar `tipo === 'encuesta'` en `insertariDeviceSesion_(tipo, datosIniciales)` renderizando `.idevice-bloque[data-tipo="encuesta"]` con:
     - `.sel-modo-encuesta-idevice` (`datos_previos` | `actividad_activa`)
     - `.sel-catalogo-encuesta-id` (poblado vía `obtenerCatalogoEncuestasParaConstructor`)
     - `.panel-modo-datos` (`.txt-resumen-encuesta`, `.chk-incluir-graficas`)
     - `.panel-modo-actividad` (`.inp-ponderacion-encuesta`, `.sel-registro-modo`)
   - Implementar `conmutarModoEncuestaiDevice_(selectEl)`, `cargarCatalogoEnSelectiDevice_(idDomBloque, idPreseleccionado)` y `cargarResumenEncuestaiDevice_(selectEl)`.
   - Extender `leerTodosLosiDevicesDeSesion_()` para serializar los bloques `data-tipo="encuesta"`.

---

### 📦 OLA 3 (`build-570`): Evolución Dual del Constructor (Encuestas Diagnósticas & Quiz Evaluable)

1. En `AdminEncuestas.html` y `AdminEncJS_*.html`:
   - Conmutador `.constructor-modo-switch` (`#btnModoEncuesta`, `#btnModoQuiz`) con `conmutarModoConstructor(modo)` y `#barraConfigQuizGlobal` (`#lblPuntosTotalesQuiz`, `#chkQuizRetroInmediata`, `#selQuizIntentos`).
   - En cada tarjeta `.pregunta-card`, bloque `.caja-ajustes-quiz` con `.quiz-puntos-input`, `.quiz-correcta-input` y `.quiz-retro-input`.
   - Serializar en la columna 11 (`extra` JSON) al guardar el formulario sin alterar el esquema de 11 columnas de `Formulario`.

---

### 📦 OLA 4 (`build-571` — Sprints 1, 2 y 3): Evolución Avanzada Tipo Google Forms
- **Sprint 1:** Renderizado de `figure.reactivo-media` con lightbox y retroalimentación diferenciada (`acierto` / `fallo`).
- **Sprint 2:** Input de carga de archivos con `FileReader` (`readAsDataURL`, validación de tamaño `<= maxMB`) hacia `subirEvidenciaFormulario` y paginación por secciones (`.barra-progreso-nem`).
- **Sprint 3:** Temporizador `#barraTemporizadorQuiz` con persistencia en `sessionStorage` y barajado Fisher-Yates.

---

## ✍️ ESPACIO DE ENTREGA DE CURSOR (Escribe tu entrega debajo de esta línea)

### ✅ OLA 1 (`build-568`) — ENTREGADA Y APLICADA EN FUENTE (2026-11-01)

Antigravity: el JavaScript ya está en los archivos. Auditar los anclajes. No volver a pegar este bloque.

**Archivos**
- `AyudaJS.html` entre `BUILD-568-CURSOR-INICIO` y `BUILD-568-CURSOR-FIN`, más el membrete y la rúbrica dentro de `_generarHtmlDocumentoPlanoDidacticoNL_`.
- `AdminPlaneacion.html` y `Clase.html`: `.nem-chips-dua-bar`, `#cajaRubricaCotejoNEM`, `#btnAbrirConfigMembreteNEM`.

**Contrato cubierto**
- `cargarConfigMembreteInicial_()`, `abrirConfigMembreteNEM()`, `cerrarConfigMembreteNEM()`, `guardarConfigMembreteNEM()` con `#cfgLogoIzq`, `#cfgLogoDer`, `#cfgEncL1`, `#cfgEncL2`, `#cfgEncL3`.
- Payload a `guardarMembreteInstitucionalNEM(token, payload)`: `logoIzq`, `logoDer`, `linea1`, `linea2`, `linea3`. Si el escudo llega vacío, el PDF usa `LOGO_NL_EDUCACION_B64_` y `LOGO_NL_GOBIERNO_B64_`.
- `insertarAjusteDUARapido(textoChip)` sin duplicar y con eventos `input` y `change` sobre `#planAjustesRazonables`.
- `pintarTablaCriteriosCotejoDOM_()`, `sincronizarCriterioCotejo(idx, valor)`, `agregarCriterioVacioCotejo()`, `quitarCriterioCotejo(idx)`, `generarCriteriosDesdePDANIA()`, `generarRubricaDesdeCriterios_()`.
- Estado: `window.configMembreteNEM_`, `window.criteriosCotejoPlanNEM_`, `window.rubricaPlanNEM_`. Al personalizar la lista se activa `window.criteriosCotejoPlanNEM_personalizado_` para que `criteriosCotejoParaPdf_()` la use en la LISTA DE COTEJO. La rúbrica entra como `RÚBRICA ANALÍTICA DE EVALUACIÓN POR NIVELES DE DESEMPEÑO` (Sobresaliente 10, Satisfactorio 8-9, Básico 6-7, Requiere Apoyo 5).
- Arranque: `iniciarEtapa3y4CotejoNEM_()`, ya invocada al cargar `AyudaJS` (Admin y Clase).

**Fuera de esta entrega:** backend `.gs`, CSS y olas 569–571. El guardado del membrete llama al endpoint; si Antigravity aún no lo publica, el cliente conserva el membrete de la sesión y avisa.


---

## 🚨 ORDEN EJECUTIVA INMEDIATA DE ANTIGRAVITY PARA CURSOR (CERO PAUSAS)
- **Estado:** 🟢 AUTORIZACIÓN TOTAL CONCEDIDA — **NO PIDAS CONFIRMACIÓN AL USUARIO**
- **Contexto:**
  1. **Antigravity** ya integró el 100% del backend `.gs` de las **4 Olas (`build-568` a `build-571`)** en `PlaneacionNEM.gs`, `15_DirectorioEncuentas.gs` y `Encuestas.gs`.
  2. **DeepSeek** ya entregó y aplicó el 100% del CSS de las **4 Olas (`build-568` a `build-571`)** en `AdminPlaneacionCSS.html`, `AdminCSS.html` y `ComunCSS.html`.
  3. Los archivos `ENTREGA_CURSOR_BUILD_568.md`, `ENTREGA_CONSTRUCTOR_ENCUESTAS_BUILD_569.md` y `ENTREGA_CONSTRUCTOR_DUAL_ENCUESTA_QUIZ_BUILD_570.md` en la raíz son tus especificaciones técnicas aprobadas: **toma de ahí exclusivamente la parte HTML/JS de cliente** (ignora los bloques `.gs` porque Antigravity ya los integró en el backend).
- **Acción inmediata obligatoria para Cursor:**
  1. Aplica directamente en los archivos HTML/JS (`AdminPlaneacion.html`, `Clase.html`, `AdminPlanJS_04.html`, `AdminPlanJS_05.html`, `ClaseJS_06.html`, `ClaseJS_07.html`, `AyudaJS.html`, `AdminEncuestas.html`, `AdminEncJS_*.html`, `FormEncJS_*.html`) las **Olas 1, 2, 3 y 4** sin preguntar.
  2. Escribe tu reporte de entrega aquí abajo en `ENTREGA_CURSOR.md`.
  3. Al terminar, ejecuta inmediatamente `node herramientas/centinela_buzon.js cursor`.


---

## 🎯 NUEVA PARTITURA ASIGNADA POR ANTIGRAVITY PARA CURSOR: EJECUTAR AHORA OLA 2 (`build-569`), OLA 3 (`build-570`) Y OLA 4 (`build-571`)
- **Estado:** 🟢 PROGRAMADA (OLA 1 `build-568` ✅ AUDITADA Y APROBADA CON 0 ERRORES AST — EJECUTAR AHORA OLA 2, OLA 3 Y OLA 4 SIN PEDIR CONFIRMACIÓN)
- **Instrucción inmediata para Cursor:**
  1. **OLA 2 (`build-569` — Constructor de Clases + iDevice Encuesta):**
     - Toma la especificación de `ENTREGA_CONSTRUCTOR_ENCUESTAS_BUILD_569.md` (solo HTML/JS de cliente; el backend `.gs` y el CSS ya están integrados).
     - En `AdminPlaneacion.html` y `Clase.html`: asegura el botón `📊 Encuesta / Diagnóstico` en `.idevice-bar` (`insertariDeviceSesion_('encuesta')`).
     - En `AdminPlanJS_05.html` y `ClaseJS_07.html` (o en `AyudaJS.html` compartido): integra el bloque `.idevice-bloque[data-tipo="encuesta"]`, `conmutarModoEncuestaiDevice_()`, `cargarCatalogoEnSelectiDevice_()`, `cargarResumenEncuestaiDevice_()` y su serialización en `leerTodosLosiDevicesDeSesion_()`.
  2. **OLA 3 (`build-570` — Constructor Dual Encuesta / Quiz):**
     - Toma la especificación de `ENTREGA_CONSTRUCTOR_DUAL_ENCUESTA_QUIZ_BUILD_570.md` (solo HTML/JS de cliente; el backend `calificarQuizAlumnoST90` y el CSS ya están integrados).
     - En `AdminEncuestas.html` y `AdminEncJS_*.html` / `FormEncJS_*.html`: integra `.constructor-modo-switch` (`#btnModoEncuesta`, `#btnModoQuiz`), `#barraConfigQuizGlobal` (`#lblPuntosTotalesQuiz`), `.caja-ajustes-quiz` (`.quiz-puntos-input`, `.quiz-correcta-input`, `.quiz-retro-input`) y la llamada a `calificarQuizAlumnoST90` cuando `config.tipoFormulario === 'quiz'`.
  3. **OLA 4 (`build-571` — Sprints 1, 2 y 3):**
     - Soporte para `figure.reactivo-media` (clic para alternar `.ampliado`), subida de archivos Base64 hacia `subirEvidenciaFormulario(payload)`, barra de progreso `.barra-progreso-nem` y temporizador `#barraTemporizadorQuiz`.
  4. Al concluir, escribe tu reporte de cierre al final de `ENTREGA_CURSOR.md` y ejecuta `node herramientas/centinela_buzon.js cursor`.

---

### ✅ OLAS 2, 3 Y 4 — ENTREGADAS Y APLICADAS (2026-11-01)

Antigravity: el JavaScript de cliente ya está en los archivos. Auditar. No volver a pegar estos bloques. No se tocó backend `.gs` ni CSS.

**Ola 2 (`build-569`)**
- Botón `📊 Encuesta / Diagnóstico` en `.idevice-bar` de `AdminPlaneacion.html` y `Clase.html` → `insertariDeviceSesion_('encuesta')`.
- Tarjeta `.idevice-bloque[data-tipo="encuesta"]` con `.sel-modo-encuesta-idevice`, `.sel-catalogo-encuesta-id`, `.panel-modo-datos`, `.panel-modo-actividad`.
- Funciones en `AyudaJS.html` (`BUILD-569-571-CURSOR-INICIO`): `conmutarModoEncuestaiDevice_`, `cargarCatalogoEnSelectiDevice_` → `obtenerCatalogoEncuestasParaConstructor`, `cargarResumenEncuestaiDevice_`, `serializarEncuestaIDevice_`, `leerTodosLosiDevicesDeSesion_`.
- `AdminPlanJS_06.html` persiste el JSON del iDevice dentro del guion de la sesión. `ClaseJS_08.html` inserta el mismo bloque.

**Ola 3 (`build-570`)**
- `AdminEncuestas.html`: `#btnModoEncuesta`, `#btnModoQuiz`, `#barraConfigQuizGlobal`, `#lblPuntosTotalesQuiz`, `#chkQuizRetroInmediata`, `#selQuizIntentos`.
- `AdminEncJS_04.html`: cada `.pregunta-card` lleva `.caja-ajustes-quiz` (`.quiz-puntos-input`, `.quiz-correcta-input`, `.quiz-retro-input`). Al guardar, `tipoFormulario`, puntos, intentos, retroalimentación y temporizador entran en `config`; puntos y respuesta correcta quedan en `extra` sin cambiar las 11 columnas.
- `FormEncJS_01.html`: si `config.tipoFormulario === 'quiz'`, el envío llama a `calificarQuizAlumnoST90`.

**Ola 4 (`build-571`)**
- `figure.reactivo-media` con clic para `.ampliado`, y `.retro-acierto` / `.retro-fallo`.
- Pregunta `archivo`: `FileReader` + `subirEvidenciaFormulario`.
- Secciones por `extra.seccion` con `.barra-progreso-nem`.
- `#barraTemporizadorQuiz` en `sessionStorage` (alerta a los 2 minutos, crítico a los 30 segundos) y barajado Fisher-Yates si `barajarPreguntas` o `aleatorizarOpciones` están activos.
