# BUZÓN DE ENTREGA: CURSOR -> ANTIGRAVITY

> **INSTRUCCIÓN PARA CURSOR (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_CURSOR.md`) todo tu código JavaScript y controladores para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js cursor`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: OLA 19 (`build-609`) — LÓGICA DOM Y BUSCADOR EN TIEMPO REAL DEL CATÁLOGO LATERAL (7 FAMILIAS)
- **Estado:** 🟢 PROGRAMADA (PARTITURA ASIGNADA — EJECUTAR AHORA)
- **Archivos objetivo:** `AyudaJS.html`, `ClaseJS_08.html`, `AdminPlanJS_06.html`

---

## ✅ ENTREGA CURSOR — OLA 19 (build-609)
- **Estado:** 🟢 LISTA PARA AUDITORÍA
- **Marcador:** `BUILD-609-CURSOR` en `AyudaJS.html` (`htmlCatalogoExe_`)
- **Alcance:**
  - Catálogo lateral en **mini-cards** (`.modulo-card-lateral`) con metadatos `[tipo, icono, titulo, subtitulo, tema]` para las 7 familias; incluye `word_shape`, `excel_split_table` y `geogebra_param`.
  - Barra de búsqueda `#inputBuscarModulosCatalogo`, filtrado en vivo sin acentos, auto-expansión de `.cat-group.abierto`, ocultación de cabeceras vacías, botón `#btnLimpiarBusquedaModulos` y mensaje `.sin-resultados-catalogo`.
  - Inserción vía `invocarInsertarDesdeCatalogo609_` → `insertarModuloEnColumnaActiva_` / dropzone `.divi-column.active-target`.
  - `montarEntornoExeLearning_` invoca `configurarBuscadorCatalogo_()` tras montar el acordeón.
  - Puente en `AdminPlanJS_06.html` y `ClaseJS_08.html`: delegación a `insertarModuloEnColumnaActiva_` cuando el motor Divi está activo.
- **Validación local:** `node --check` sobre script de `AyudaJS.html` OK · `node herramientas/manifiesto.js` → 79 documentos, 0 sin parsear.

### Bloque de controladores (referencia en `AyudaJS.html`)
- `escAttrCatalogo609_`, `normalizarTextoBusquedaCatalogo609_`
- `invocarInsertarDesdeCatalogo609_` (exportado en `window`)
- `htmlMiniCardCatalogo609_`, `htmlCatalogoExe_` (BUILD-609)
- `aplicarFiltroBuscadorCatalogo609_`, `limpiarBusquedaCatalogo_`, `configurarBuscadorCatalogo_`
- Guard Ola 17: `htmlCatalogoExe_._st90Build609` evita el wrap de pills legacy.

---

### Mensaje de Commit sugerido (Conventional Commits)
`feat(ola19): catalogo lateral mini-cards, buscador en tiempo real e insercion en columna activa build-609`
