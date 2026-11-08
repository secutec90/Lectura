# BUZÓN DE ENTREGA: CURSOR -> ANTIGRAVITY

> **INSTRUCCIÓN PARA CURSOR (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_CURSOR.md`) todo tu código JavaScript y controladores para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js cursor`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: OLA 19 (`build-609`) — ARQUITECTURA MAESTRA INTEGRAL: PUENTE DIVI AL PORTAL DEL ALUMNO, POPOVER EN BODY, QUIZ SEP Y MODO DUAL DE ENCUESTAS
- **Estado:** 🟢 AUDITADA E INTEGRADA EN BUILD-609
- **Archivos objetivo:** `AyudaJS.html`, `ClaseJS_07.html`, `AdminPlanJS_05.html`, `AdminPlanJS_06.html`

---

## ✅ ENTREGA CURSOR — OLA 19 (build-609)
- **Estado:** 🟢 LISTA Y CONSOLIDADA
- **Marcador:** `BUILD-609-CURSOR` en `AyudaJS.html` (`htmlCatalogoExe_`)
- **Alcance:**
  1. **Renderizado Jerárquico en Portal del Alumno (`ClaseJS_07.html` y `AdminPlanJS_05.html`):** `renderizarTextoClaseDUA(cont)` parsea `cont.guionDocenteJSON` (`extra.exelearning.paginas`) y pinta las retículas `.divi-row`, `.divi-columns-grid` y `.divi-column` con sus tarjetas `.content-card.dua-bloque-idevice`, sincronizando los textos con la síntesis de voz DUA (`parrafosVozAlu_`).
  2. **Popover de Columnas Desacoplado (`AyudaJS.html`):** `abrirSelectorColumnas_(filaPlus, btnPlus)` monta `.divi-columns-picker.columns-popover.visible` directamente en `document.body` con `position: fixed; z-index: 99999;` y cálculo dinámico vía `boton.getBoundingClientRect()`.
  3. **Conexión Asíncrona de Quiz Evaluable (`AyudaJS.html`):** `calificarQuiziDeviceVivo_(btn)` invoca `gsRun('calificarQuizAlumnoST90', token, payloadQuiz)` y muestra la calificación en **escala oficial SEP (5.0 a 10.0)** junto con la retroalimentación diferenciada.
  4. **Selector de Modo Dual en iDevice Encuesta (`AyudaJS.html`):** `completarIDeviceEncuesta_` asigna ID único, invoca automáticamente `cargarCatalogoEnSelectiDevice_` al insertar el bloque y conecta `conmutarModoEncuestaiDevice_` (*Datos Previos* con proyección de `ResumenIA` vs. *Actividad Evaluable* vinculada a matrícula).
  5. **Catálogo Lateral en Mini-Cards (`.modulo-card-lateral`):** 7 familias curriculares con buscador `#inputBuscarModulosCatalogo` en tiempo real e inserción en `.divi-column.active-target`.
- **Validación local:** `node herramientas/manifiesto.js` → 79 documentos, 0 sin parsear.

### Bloque de controladores (referencia en `AyudaJS.html`)
- `escAttrCatalogo609_`, `normalizarTextoBusquedaCatalogo609_`
- `invocarInsertarDesdeCatalogo609_` (exportado en `window`)
- `htmlMiniCardCatalogo609_`, `htmlCatalogoExe_` (BUILD-609)
- `aplicarFiltroBuscadorCatalogo609_`, `limpiarBusquedaCatalogo_`, `configurarBuscadorCatalogo_`
- Guard Ola 17: `htmlCatalogoExe_._st90Build609` evita el wrap de pills legacy.

---

### Mensaje de Commit sugerido (Conventional Commits)
`feat(ola19): catalogo lateral mini-cards, buscador en tiempo real e insercion en columna activa build-609`
