# BUZÓN DE ENTREGA: CURSOR -> ANTIGRAVITY

> **INSTRUCCIÓN PARA CURSOR (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_CURSOR.md`) todo tu código JavaScript y controladores para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js cursor`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: OLA 19 (`build-609`) — CUADRÍCULA INTERACTIVA DE 2 COLUMNAS (GRAPESJS BLOCK MANAGER), INSERCIÓN EN COLUMNA ACTIVA Y DRAG & DROP EN AYUDAJS.HTML
- **Estado:** 🟢 AUDITADA E INTEGRADA EN BUILD-609
- **Archivo objetivo:** `AyudaJS.html`
- **Objetivo:** Conectar el renderizado de la cuadrícula de 2 columnas (`.cat-group-body`) estilo GrapesJS, asegurar la inserción directa en la columna activa (`.divi-column.active-target`) al hacer clic en cualquier parte de la tarjeta, habilitar soporte Drag & Drop (`draggable="true"` / `dragstart` -> `.divi-columns-grid` / `.divi-column`) y mantener el buscador en tiempo real.

---

### 📋 Requerimientos Técnicos para Cursor:

1. **Generación de tarjetas en `htmlMiniCardCatalogo609_(mod)`:**
   - Renderizar cada módulo como un bloque interactivo (`.modulo-card-lateral`) con su icono, título descriptivo, `data-tipo="${mod.tipo}"` y `draggable="true"`.
   - Envolver los ítems de cada categoría dentro de `<div class="cat-items cat-group-body">`.
2. **Interacción de inserción directa (`invocarInsertarDesdeCatalogo609_`):**
   - Al hacer clic en cualquier punto de la tarjeta (`.modulo-card-lateral`), capturar `mod.tipo` e invocar `insertarBloqueExe_(mod.tipo)`.
   - Verificar que el bloque se dirija directamente a la columna activa (`.divi-column.active-target`) del lienzo central. Si existen columnas en el lienzo pero ninguna está seleccionada como `.active-target`, mostrar un toast/alerta accesible indicando que debe seleccionar una columna en el lienzo primero.
3. **Soporte para Arrastre (Drag & Drop):**
   - Añadir `draggable="true"` a cada `.modulo-card-lateral` y cablear `dragstart` / `dragend` para permitir soltarlo en las dropzones de las filas Divi (`.divi-columns-grid` / `.divi-column`).
   - Al soltar (`drop`) sobre una columna Divi, marcarla como `.active-target` e invocar `insertarBloqueExe_(tipo)`.
4. **Buscador en tiempo real (`aplicarFiltroBuscadorCatalogo609_`):**
   - Mantener activo el filtro sobre `#inputBuscarModulosCatalogo` para que al teclear expanda automáticamente los acordeones con coincidencias y filtre las tarjetas visibles.

---

## ✅ ENTREGA CURSOR — BLOQUE DE FUNCIONES (`AyudaJS.html` · `build-609`)

```javascript
function invocarInsertarDesdeCatalogo609_(tipo) {
  if (!tipo) return;
  var cont = document.getElementById('contenedorIDevicesDinamicos');
  if (cont) {
    var colActiva = cont.querySelector('.divi-column.active-target') ||
      (window._columnaObjetivoActiva_ && window._columnaObjetivoActiva_.isConnected ? window._columnaObjetivoActiva_ : null);
    var todasCols = cont.querySelectorAll('.divi-column');
    if (todasCols.length > 0 && !colActiva) {
      if (typeof toast === 'function') {
        toast('Selecciona primero una columna en el lienzo (+ Añadir Módulo) para insertar este bloque.', 'info');
      }
      return;
    }
    if (colActiva) {
      window._columnaObjetivoActiva_ = colActiva;
    }
  }
  if (typeof insertarBloqueExe_ === 'function') {
    var card = insertarBloqueExe_(tipo, null, typeof idPaginaActivaExe_ === 'function' ? idPaginaActivaExe_() : 0);
    if (typeof aplicarFiltroPaginaExe_ === 'function') aplicarFiltroPaginaExe_();
    if (typeof actualizarContadorIDevicesExe_ === 'function') actualizarContadorIDevicesExe_();
    if (card && card.scrollIntoView) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }
  if (typeof window.insertarModuloEnColumnaActiva_ === 'function') {
    window.insertarModuloEnColumnaActiva_(tipo);
    return;
  }
  if (typeof window.insertariDeviceSesion_ === 'function') window.insertariDeviceSesion_(tipo);
}

function htmlMiniCardCatalogo609_(mod) {
  mod = mod || {};
  var tipo = escAttrCatalogo609_(mod.tipo);
  var titulo = escAttrCatalogo609_(mod.titulo);
  var sub = escAttrCatalogo609_(mod.sub);
  var tema = escAttrCatalogo609_(mod.tema || 'tema-notion');
  var icono = mod.icono || '📦';
  return '<div class="modulo-card-lateral ' + tema + '" draggable="true" data-tipo="' + tipo + '" data-nombre="' + titulo + '" data-sub="' + sub + '" role="button" tabindex="0" title="' + titulo + (sub ? ' — ' + sub : '') + '" onclick="invocarInsertarDesdeCatalogo609_(\'' + tipo + '\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();invocarInsertarDesdeCatalogo609_(\'' + tipo + '\');}" ondragstart="iniciarArrastreModuloCatalogo609_(event, \'' + tipo + '\')" ondragend="finalizarArrastreModuloCatalogo609_(event)">' +
    '<div class="card-lateral-cuerpo">' +
      '<span class="card-lateral-icon-badge" aria-hidden="true">' + icono + '</span>' +
      '<div class="card-lateral-textos">' +
        '<span class="card-lateral-titulo">' + titulo + '</span>' +
        '<span class="card-lateral-sub">' + sub + '</span>' +
      '</div>' +
    '</div>' +
    '<span class="btn-card-add" aria-hidden="true">+</span>' +
  '</div>';
}

function iniciarArrastreModuloCatalogo609_(ev, tipo) {
  window._moduloArrastradoCatalogo_ = String(tipo || '');
  if (ev && ev.currentTarget && ev.currentTarget.classList) {
    ev.currentTarget.classList.add('dragging');
  }
  if (ev && ev.dataTransfer) {
    try {
      ev.dataTransfer.effectAllowed = 'copy';
      ev.dataTransfer.setData('text/plain', String(tipo || ''));
    } catch (e) {}
  }
}

function finalizarArrastreModuloCatalogo609_(ev) {
  if (ev && ev.currentTarget && ev.currentTarget.classList) {
    ev.currentTarget.classList.remove('dragging');
  }
  document.querySelectorAll('.divi-column.drag-over-target').forEach(function (col) {
    col.classList.remove('drag-over-target');
  });
}
```
