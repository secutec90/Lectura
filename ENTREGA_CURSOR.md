# BUZÓN DE ENTREGA: CURSOR -> ANTIGRAVITY

> **INSTRUCCIÓN PARA CURSOR (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_CURSOR.md`) todo tu código JavaScript y controladores para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js cursor`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: OLA 17 (`build-603+`) — CONTROLADORES DIVI REAL, BUBBLE TOOLBAR NOTION Y SIDEBAR COLAPSABLE
- **Estado:** ✅ ENTREGADA (PENDIENTE DE AUDITORÍA — NO REEJECUTAR)
- **Archivos objetivo:** `AyudaJS.html`, `ClaseJS_08.html`, `AdminPlanJS_06.html`
- **Misión de Cursor:** Implementar los controladores JavaScript del constructor: erradicación de la barra fija superior del lienzo, motor de la pastilla flotante contextual (*Bubble Toolbar*) mediante `selectionchange`, selector de columnas verdes `(+)`, dropzone de columna activa (`.active-target`), inyección modular desde el catálogo lateral de las 7 familias, alternancia del menú lateral colapsable (`alternarSidebarExe_`), y reordenamiento vertical (▲ / ▼).

La partitura ya quedó escrita en los archivos objetivo. Si este buzón vuelve a abrirse con este mismo estado, no hay que rehacer el bloque: contrastar los marcadores `BUILD-603-CURSOR` / `BUILD-603-CURSOR-FIN`.

---

## ✅ ENTREGA CURSOR — OLA 17 (`build-603+`)

- **Estado para Antigravity:** 🟢 LISTA PARA INTEGRAR
- **Marcador en runtime:** `/* BUILD-603-CURSOR */` … `/* BUILD-603-CURSOR-FIN */` dentro de `AyudaJS.html`
- **Contrato respetado:** IDs `#bubbleToolbar`, `#lienzoExeActivo`, `#vistaAutorExe`, `#pastillaDeshacerBloque`. Clases de DeepSeek: `.sidebar-colapsado`, `.btn-toggle-sidebar-exe`, `.divi-section`, `.divi-row`, `.divi-column`, `.active-target`, `.btn-plus-green`, `.divi-columns-picker`, `.btn-add-module-inside`, `.floating-bubble-toolbar`, `.bubble-btn`, `.btn-ctrl-up`, `.btn-ctrl-down`, `.btn-ctrl-del`, `.rich-editable-area`.
- **Decisión que no hay que reabrir:** el `(+)` verde vive en `.divi-plus-row` entre filas y no participa del intercambio ▲/▼. `moverElementoDOM_` salta esos separadores y aplica `insertBefore` contra el hermano estructural (fila, sección o módulo). Después de mover una fila o sección se vuelven a pintar los separadores.

### Qué hace cada controlador

1. `erradicarBarraFijaLienzo_()` retira `.editor-master-toolbar` y `.clean-wysiwyg-toolbar` del lienzo y observa inyecciones nuevas. El área editable de cada tarjeta lleva `.rich-editable-area`.
2. `#bubbleToolbar` se ancla a `#lienzoExeActivo`. `selectionchange` la muestra solo si la selección no está colapsada y cae en `.rich-editable-area` o `[contenteditable="true"]`. La pastilla queda centrada arriba del rango, descontando `scrollTop` del lienzo. Botones: negrita, cursiva, subrayado, H3, viñetas y enlace. Cada botón hace `preventDefault` en `mousedown` para no soltar la selección.
3. `alternarSidebarExe_(colapsado)` alterna `.sidebar-colapsado` en `#vistaAutorExe`. Sin argumento, conmuta. `false` abre el menú. `true` lo colapsa. Actualiza `.btn-toggle-sidebar-exe` (`◀` / `▶`) y dispara `resize`.
4. `.btn-plus-green` abre `.divi-columns-picker` y cierra cualquier otro. Las opciones `col-1`, `col-2`, `col-2-70-30` y `col-3` llaman a `insertarFilaDivi_(distribucion, filaRef)`.
5. `.btn-add-module-inside` llama a `activarColumnaObjetivo_`, guarda `window._columnaObjetivoActiva_` y, si el menú está colapsado, lo abre. `insertariDeviceSesion_` queda envuelta: el módulo entra en la columna activa; si no hay, en la última `.divi-column`; si no existe ninguna, crea una fila `col-1` y coloca ahí el bloque.
6. ▲ / ▼ usan `moverElementoDOM_`. ✕ en un módulo reutiliza `eliminarBloqueTarjeta_` y la pastilla de 5 segundos. ✕ en fila o sección guarda el nodo en `window.ultimoBloqueEliminado_` (`kind: 'divi603'`) y muestra `#pastillaDeshacerBloque`.

### Anclajes en los otros dos archivos

- `ClaseJS_08.html` y `AdminPlanJS_06.html`: después de `appendChild` del iDevice, si existe `colocarModuloEnColumnaActiva_`, el bloque se mueve a la columna destino. Así ningún clic de las familias base se queda fuera del dropzone.

### Bloque listo para `CONTROL_CAMBIOS.md`

```markdown
### 🛠️ [2026-11-05] - [Ola 17 build-603: controladores Divi, bubble toolbar y sidebar]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(constructor): pastilla flotante, filas divi y menu lateral colapsable en build-603`
- **Cambios Realizados:**
  - `AyudaJS.html`: motor `#bubbleToolbar` por `selectionchange`, erradicación de `.editor-master-toolbar` y `.clean-wysiwyg-toolbar`, filas Divi con `(+)` verde (`col-1`, `col-2`, `col-2-70-30`, `col-3`), columna `.active-target`, `alternarSidebarExe_`, reorden ▲/▼ y borrado con `#pastillaDeshacerBloque`.
  - `ClaseJS_08.html` y `AdminPlanJS_06.html`: al insertar un iDevice, `colocarModuloEnColumnaActiva_` lo deposita en la columna activa o crea una fila de una columna.
  - El área enriquecida publica la clase `.rich-editable-area` para la pastilla contextual.
- **Archivos Afectados:** `AyudaJS.html`, `ClaseJS_08.html`, `AdminPlanJS_06.html`, `ENTREGA_CURSOR.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** La barra fija del lienzo no se publica. El formato contextual es `#bubbleToolbar`, anclado a `#lienzoExeActivo`. El catálogo sigue entrando por `insertariDeviceSesion_`, ahora envuelta para caer en `window._columnaObjetivoActiva_`. Si no hay columna, se fabrica una fila `col-1`. Los separadores `.divi-plus-row` no se intercambian con ▲/▼: `moverElementoDOM_` los salta y aplica `insertBefore` al hermano estructural. No reabrir una barra horizontal sobre el lienzo ni mover el `(+)` verde al mismo eje que las tarjetas sueltas de la Ola 17 anterior.
```

### Código JavaScript integrado

El bloque siguiente es el mismo que ya está en `AyudaJS.html` entre `BUILD-603-CURSOR` y `BUILD-603-CURSOR-FIN`. Antigravity no debe pegarlo otra vez si ese marcador ya existe.

```javascript
/* BUILD-603-CURSOR — Divi real, bubble toolbar y sidebar colapsable */
(function () {
  var MAPA_COLUMNAS_ = {
    'col-1': { n: 1, grid: 'grid-col-1' },
    'col-2': { n: 2, grid: 'grid-col-2' },
    'col-2-70-30': { n: 2, grid: 'grid-col-70-30' },
    'col-3': { n: 3, grid: 'grid-col-3' }
  };

  function lienzoExe_() {
    return document.getElementById('lienzoExeActivo') || document.querySelector('.canvas-exe');
  }

  function workspaceExe_() {
    return document.getElementById('vistaAutorExe') || document.querySelector('.app-workspace');
  }

  function contenedorExe_() {
    return document.getElementById('contenedorIDevicesDinamicos') || lienzoExe_();
  }

  function erradicarBarraFijaLienzo_() {
    var raices = [document.getElementById('lienzoExeActivo'), document.querySelector('.canvas-exe'), workspaceExe_()];
    raices.forEach(function (raiz) {
      if (!raiz) return;
      raiz.querySelectorAll('.editor-master-toolbar, .clean-wysiwyg-toolbar').forEach(function (nodo) {
        if (nodo.id === 'bubbleToolbar') return;
        if (nodo.parentNode) nodo.parentNode.removeChild(nodo);
      });
    });
    if (typeof window.erradicarBarraModularExe_ === 'function') window.erradicarBarraModularExe_();
  }

  function vigilarBarraFijaLienzo_() {
    if (window._obsBarraFija603_) return;
    var raiz = lienzoExe_() || document.getElementById('editorSesionActiva');
    if (!raiz || typeof MutationObserver !== 'function') return;
    var obs = new MutationObserver(function () { erradicarBarraFijaLienzo_(); });
    obs.observe(raiz, { childList: true, subtree: true });
    window._obsBarraFija603_ = obs;
    erradicarBarraFijaLienzo_();
  }

  function htmlControlesDivi_() {
    return '<div class="divi-ctrl-bar">' +
      '<button type="button" class="btn-ctrl-up" aria-label="Subir">▲</button>' +
      '<button type="button" class="btn-ctrl-down" aria-label="Bajar">▼</button>' +
      '<button type="button" class="btn-ctrl-del" aria-label="Eliminar">✕</button>' +
    '</div>';
  }

  function nodoControladoDivi_(btn) {
    if (!btn || !btn.closest) return null;
    var barra = btn.closest('.divi-ctrl-bar');
    if (!barra) return null;
    if (barra.closest('.idevice-card')) return barra.closest('.idevice-card');
    if (barra.closest('.divi-row')) return barra.closest('.divi-row');
    if (barra.closest('.divi-section')) return barra.closest('.divi-section');
    return null;
  }

  function hermanoEstructural_(el, direccion) {
    var nodo = direccion < 0 ? el.previousElementSibling : el.nextElementSibling;
    while (nodo && nodo.classList && (
      nodo.classList.contains('divi-plus-row') ||
      nodo.classList.contains('divi-section-header') ||
      nodo.classList.contains('divi-row-header') ||
      nodo.classList.contains('btn-add-module-inside') ||
      nodo.classList.contains('block-inserter-row') ||
      nodo.classList.contains('divisor-insertar-bloque')
    )) {
      nodo = direccion < 0 ? nodo.previousElementSibling : nodo.nextElementSibling;
    }
    return nodo;
  }

  function moverElementoDOM_(el, direccion) {
    if (!el || !el.parentNode) return;
    if (direccion === -1) {
      var previo = hermanoEstructural_(el, -1);
      if (previo) el.parentNode.insertBefore(el, previo);
    } else if (direccion === 1) {
      var siguiente = hermanoEstructural_(el, 1);
      if (siguiente) el.parentNode.insertBefore(el, siguiente.nextElementSibling);
    }
    if (el.classList.contains('divi-row') || el.classList.contains('divi-section')) repintarPlusVerdesDivi_();
    if (typeof marcarIDevicesTocados_ === 'function') marcarIDevicesTocados_();
  }

  function pintarBotonSidebar_(ws) {
    if (!ws) return;
    var btn = ws.querySelector('.btn-toggle-sidebar-exe');
    if (!btn) return;
    var colapsado = ws.classList.contains('sidebar-colapsado');
    btn.textContent = colapsado ? '▶' : '◀';
    btn.title = colapsado ? 'Expandir menú de contenidos' : 'Colapsar menú lateral (Modo pantalla completa)';
    btn.setAttribute('aria-label', btn.title);
  }

  function alternarSidebarExe_(colapsado) {
    var ws = workspaceExe_();
    if (!ws) return;
    var quedaColapsado;
    if (colapsado === true) quedaColapsado = true;
    else if (colapsado === false) quedaColapsado = false;
    else quedaColapsado = !ws.classList.contains('sidebar-colapsado');
    ws.classList.toggle('sidebar-colapsado', quedaColapsado);
    pintarBotonSidebar_(ws);
    window.dispatchEvent(new Event('resize'));
  }

  function asegurarBotonSidebarExe_() {
    var ws = workspaceExe_();
    if (!ws || ws.querySelector('.btn-toggle-sidebar-exe')) {
      pintarBotonSidebar_(ws);
      return;
    }
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-toggle-sidebar-exe';
    btn.addEventListener('click', function () { alternarSidebarExe_(); });
    var ancla = ws.querySelector('.pagina-banner-acciones') || ws.querySelector('.canvas-exe') || ws;
    ancla.insertBefore(btn, ancla.firstChild);
    pintarBotonSidebar_(ws);
  }

  function marcarColumnaActiva_(col, abrirSidebar) {
    if (!col) return;
    document.querySelectorAll('.divi-column.active-target').forEach(function (otra) {
      if (otra !== col) otra.classList.remove('active-target');
    });
    col.classList.add('active-target');
    window._columnaObjetivoActiva_ = col;
    if (abrirSidebar) {
      var ws = workspaceExe_();
      if (ws && ws.classList.contains('sidebar-colapsado')) alternarSidebarExe_(false);
    }
  }

  function activarColumnaObjetivo_(columnaDiv) {
    marcarColumnaActiva_(columnaDiv, true);
  }

  function crearColumnaDivi_() {
    var col = document.createElement('div');
    col.className = 'divi-column';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-add-module-inside';
    btn.textContent = '+ Añadir Módulo';
    col.appendChild(btn);
    return col;
  }

  function crearPlusVerde_() {
    var fila = document.createElement('div');
    fila.className = 'divi-plus-row';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-plus-green';
    btn.textContent = '+';
    btn.setAttribute('aria-label', 'Elegir distribución de columnas');
    fila.appendChild(btn);
    return fila;
  }

  function cerrarSelectoresColumnas_() {
    document.querySelectorAll('.divi-columns-picker').forEach(function (menu) {
      if (menu.parentNode) menu.parentNode.removeChild(menu);
    });
  }

  function abrirSelectorColumnas_(filaPlus) {
    cerrarSelectoresColumnas_();
    if (typeof window.cerrarMenusInsercionExe_ === 'function') window.cerrarMenusInsercionExe_();
    var menu = document.createElement('div');
    menu.className = 'divi-columns-picker';
    menu.setAttribute('role', 'menu');
    [
      ['col-1', '1 Columna [100%]'],
      ['col-2', '2 Columnas [50 / 50]'],
      ['col-2-70-30', '2 Columnas [70 / 30]'],
      ['col-3', '3 Columnas [33 / 33 / 33]']
    ].forEach(function (op) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'divi-col-option';
      b.setAttribute('data-distribucion', op[0]);
      b.setAttribute('role', 'menuitem');
      b.textContent = op[1];
      menu.appendChild(b);
    });
    filaPlus.appendChild(menu);
  }

  function repintarPlusVerdesDivi_(seccionUnica) {
    var lista = [];
    if (seccionUnica) lista = [seccionUnica];
    else {
      var cont = contenedorExe_();
      if (cont) lista = Array.prototype.slice.call(cont.querySelectorAll('.divi-section'));
    }
    lista.forEach(function (seccion) {
      if (!seccion) return;
      Array.prototype.slice.call(seccion.children).forEach(function (hijo) {
        if (hijo.classList.contains('divi-plus-row')) hijo.remove();
      });
      var filas = [];
      Array.prototype.forEach.call(seccion.children, function (hijo) {
        if (hijo.classList.contains('divi-row')) filas.push(hijo);
      });
      filas.forEach(function (fila) {
        seccion.insertBefore(crearPlusVerde_(), fila);
      });
      seccion.appendChild(crearPlusVerde_());
    });
  }

  function asegurarSeccionDivi_() {
    var cont = contenedorExe_();
    if (!cont) return null;
    var sec = cont.querySelector('.divi-section');
    if (sec) return sec;
    sec = document.createElement('section');
    sec.className = 'divi-section';
    var header = document.createElement('div');
    header.className = 'divi-section-header';
    header.innerHTML = '<span class="divi-section-label">SECCIÓN PEDAGÓGICA</span>' + htmlControlesDivi_();
    sec.appendChild(header);
    cont.appendChild(sec);
    repintarPlusVerdesDivi_(sec);
    return sec;
  }

  function insertarFilaDivi_(distribucion, filaRef) {
    var mapa = MAPA_COLUMNAS_[distribucion] || MAPA_COLUMNAS_['col-1'];
    var seccion = (filaRef && filaRef.closest) ? filaRef.closest('.divi-section') : null;
    if (!seccion) seccion = asegurarSeccionDivi_();
    if (!seccion) return null;
    var fila = document.createElement('div');
    fila.className = 'divi-row';
    fila.setAttribute('data-distribucion', distribucion || 'col-1');
    var header = document.createElement('div');
    header.className = 'divi-row-header';
    header.innerHTML = '<span class="divi-row-label">FILA</span>' + htmlControlesDivi_();
    var grid = document.createElement('div');
    grid.className = 'divi-columns-grid ' + mapa.grid;
    var i;
    for (i = 0; i < mapa.n; i++) grid.appendChild(crearColumnaDivi_());
    fila.appendChild(header);
    fila.appendChild(grid);
    if (filaRef && filaRef.parentNode === seccion) seccion.insertBefore(fila, filaRef);
    else seccion.appendChild(fila);
    repintarPlusVerdesDivi_(seccion);
    return fila;
  }

  function resolverColumnaDestino_() {
    var col = window._columnaObjetivoActiva_;
    if (col && col.isConnected && col.classList && col.classList.contains('divi-column')) return col;
    var cont = contenedorExe_();
    var cols = cont ? cont.querySelectorAll('.divi-column') : [];
    if (cols.length) return cols[cols.length - 1];
    var fila = insertarFilaDivi_('col-1', null);
    var nueva = fila ? fila.querySelector('.divi-column') : null;
    if (nueva) marcarColumnaActiva_(nueva, false);
    return nueva;
  }

  function asegurarControlesModulo_(card) {
    if (!card || card.querySelector('.divi-ctrl-bar')) return;
    var header = card.querySelector('.idevice-header, .idevice-card-header') || card;
    var barra = document.createElement('div');
    barra.innerHTML = htmlControlesDivi_();
    var nodo = barra.firstElementChild;
    if (nodo) header.insertBefore(nodo, header.firstChild);
  }

  function marcarAreasEditablesDivi_(raiz) {
    var base = raiz || lienzoExe_() || document;
    if (!base || !base.querySelectorAll) return;
    base.querySelectorAll('[contenteditable="true"]').forEach(function (el) {
      el.classList.add('rich-editable-area');
    });
  }

  function colocarModuloEnColumnaActiva_(card) {
    if (!card || !card.classList) return card;
    var col = resolverColumnaDestino_();
    if (!col) return card;
    card.classList.add('divi-module');
    if (card.parentNode !== col) {
      var ancla = null;
      Array.prototype.forEach.call(col.children, function (hijo) {
        if (hijo.classList.contains('btn-add-module-inside')) ancla = hijo;
      });
      if (ancla) col.insertBefore(card, ancla);
      else col.appendChild(card);
    }
    asegurarControlesModulo_(card);
    marcarAreasEditablesDivi_(card);
    return card;
  }

  function insertarModuloEnColumnaActiva_(tipo, previa) {
    erradicarBarraFijaLienzo_();
    var card = (typeof previa === 'function') ? previa(tipo) : null;
    if (card) colocarModuloEnColumnaActiva_(card);
    if (typeof window.repintarDivisoresExe_ === 'function') window.repintarDivisoresExe_();
    erradicarBarraFijaLienzo_();
    if (card && card.scrollIntoView) card.scrollIntoView({ block: 'nearest' });
    return card;
  }

  function limpiarInsertoresDentroDeColumnas_() {
    document.querySelectorAll('.divi-column .block-inserter-row, .divi-column .divisor-insertar-bloque, .divi-section > .block-inserter-row').forEach(function (nodo) {
      if (nodo.parentNode) nodo.parentNode.removeChild(nodo);
    });
    var cont = document.getElementById('contenedorIDevicesDinamicos');
    if (!cont || !cont.querySelector('.divi-section')) return;
    var sueltas = 0;
    Array.prototype.forEach.call(cont.children, function (hijo) {
      if (hijo.classList && hijo.classList.contains('idevice-card')) sueltas += 1;
    });
    if (sueltas) return;
    Array.prototype.slice.call(cont.children).forEach(function (hijo) {
      if (!hijo.classList) return;
      if (hijo.classList.contains('block-inserter-row') || hijo.classList.contains('divisor-insertar-bloque')) hijo.remove();
    });
  }

  function envolverRepintadoDivi_() {
    if (!window.repintarDivisoresExe_ || window.repintarDivisoresExe_._st90Divi603) return;
    var previo = window.repintarDivisoresExe_;
    window.repintarDivisoresExe_ = function () {
      if (window._repintandoDivi603_) return;
      window._repintandoDivi603_ = true;
      var cont = document.getElementById('contenedorIDevicesDinamicos');
      var anidadas = [];
      try {
        if (cont) {
          cont.querySelectorAll('.divi-column > .idevice-card').forEach(function (card) {
            anidadas.push({ card: card, parent: card.parentNode, next: card.nextSibling });
            card.remove();
          });
        }
        previo();
        anidadas.forEach(function (item) {
          if (!item.parent || !item.parent.isConnected) return;
          if (item.next && item.next.parentNode === item.parent) item.parent.insertBefore(item.card, item.next);
          else {
            var ancla = null;
            Array.prototype.forEach.call(item.parent.children, function (hijo) {
              if (hijo.classList.contains('btn-add-module-inside')) ancla = hijo;
            });
            if (ancla) item.parent.insertBefore(item.card, ancla);
            else item.parent.appendChild(item.card);
          }
          item.card.classList.add('divi-module');
          asegurarControlesModulo_(item.card);
        });
        limpiarInsertoresDentroDeColumnas_();
        repintarPlusVerdesDivi_();
        marcarAreasEditablesDivi_();
        erradicarBarraFijaLienzo_();
      } finally {
        window._repintandoDivi603_ = false;
      }
    };
    window.repintarDivisoresExe_._st90Divi603 = true;
  }

  function mostrarPastillaDeshacer603_() {
    var pill = document.getElementById('pastillaDeshacerBloque');
    if (!pill) {
      pill = document.createElement('div');
      pill.id = 'pastillaDeshacerBloque';
      pill.setAttribute('role', 'status');
      document.body.appendChild(pill);
    }
    pill.innerHTML = '<span>Bloque eliminado.</span>';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Deshacer';
    btn.addEventListener('click', function () { deshacerEliminarBloque603_(); });
    pill.appendChild(btn);
    clearTimeout(window._timerPastillaDeshacer_);
    window._timerPastillaDeshacer_ = setTimeout(function () {
      var nodo = document.getElementById('pastillaDeshacerBloque');
      if (nodo && nodo.parentNode) nodo.parentNode.removeChild(nodo);
      window.ultimoBloqueEliminado_ = null;
    }, 5000);
  }

  function deshacerEliminarBloque603_() {
    var buf = window.ultimoBloqueEliminado_;
    if (buf && buf.kind === 'divi603') {
      window.ultimoBloqueEliminado_ = null;
      var padre = (buf.padre && buf.padre.isConnected) ? buf.padre : contenedorExe_();
      if (!padre || !buf.html) return;
      var cont = document.createElement('div');
      cont.innerHTML = buf.html;
      var nodo = cont.firstElementChild;
      if (!nodo) return;
      if (buf.siguiente && buf.siguiente.parentNode === padre) padre.insertBefore(nodo, buf.siguiente);
      else padre.appendChild(nodo);
      repintarPlusVerdesDivi_();
      if (typeof marcarIDevicesTocados_ === 'function') marcarIDevicesTocados_();
    } else if (typeof window._deshacerBloquePrevio603_ === 'function') {
      window._deshacerBloquePrevio603_();
    }
    var pill = document.getElementById('pastillaDeshacerBloque');
    if (pill && pill.parentNode) pill.parentNode.removeChild(pill);
    clearTimeout(window._timerPastillaDeshacer_);
  }

  function eliminarNodoDivi_(btn) {
    var el = nodoControladoDivi_(btn);
    if (!el) return;
    if (el.classList.contains('idevice-card')) {
      if (typeof window.eliminarBloqueTarjeta_ === 'function' && el.id) window.eliminarBloqueTarjeta_(el.id);
      else if (el.parentNode) el.parentNode.removeChild(el);
      limpiarInsertoresDentroDeColumnas_();
      if (typeof actualizarContadorIDevicesExe_ === 'function') actualizarContadorIDevicesExe_();
      return;
    }
    window.ultimoBloqueEliminado_ = {
      kind: 'divi603',
      html: el.outerHTML,
      padre: el.parentNode,
      siguiente: el.nextSibling
    };
    if (el.parentNode) el.parentNode.removeChild(el);
    if (window._columnaObjetivoActiva_ && !window._columnaObjetivoActiva_.isConnected) window._columnaObjetivoActiva_ = null;
    repintarPlusVerdesDivi_();
    mostrarPastillaDeshacer603_();
    if (typeof marcarIDevicesTocados_ === 'function') marcarIDevicesTocados_();
  }

  function asegurarBubbleToolbar_() {
    var tb = document.getElementById('bubbleToolbar');
    if (!tb) {
      tb = document.createElement('div');
      tb.id = 'bubbleToolbar';
      tb.className = 'floating-bubble-toolbar';
      tb.setAttribute('role', 'toolbar');
      tb.setAttribute('aria-label', 'Formato del texto seleccionado');
      [
        ['bold', 'B', 'Negrita'],
        ['italic', 'I', 'Cursiva'],
        ['underline', 'U', 'Subrayado'],
        ['h3', 'H3', 'Subtítulo'],
        ['insertUnorderedList', '•', 'Lista con viñetas'],
        ['createLink', '🔗', 'Enlace']
      ].forEach(function (def) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'bubble-btn';
        btn.setAttribute('data-cmd', def[0]);
        btn.title = def[2];
        btn.setAttribute('aria-label', def[2]);
        btn.textContent = def[1];
        btn.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
        tb.appendChild(btn);
      });
    }
    var canvas = lienzoExe_();
    if (canvas && tb.parentNode !== canvas) canvas.appendChild(tb);
    else if (!tb.parentNode) document.body.appendChild(tb);
    return tb;
  }

  function areaSeleccionEditable_(sel) {
    if (!sel || !sel.rangeCount || sel.isCollapsed) return null;
    var nodo = sel.anchorNode;
    if (!nodo) return null;
    var el = nodo.nodeType === 1 ? nodo : nodo.parentElement;
    if (!el || !el.closest) return null;
    return el.closest('.rich-editable-area, [contenteditable="true"]');
  }

  function posicionarBubble_() {
    var tb = document.getElementById('bubbleToolbar') || asegurarBubbleToolbar_();
    var sel = window.getSelection();
    var area = areaSeleccionEditable_(sel);
    var canvas = lienzoExe_();
    if (!area || (canvas && !canvas.contains(area)) || (area.closest && area.closest('#bubbleToolbar'))) {
      tb.classList.remove('visible');
      return;
    }
    var range = sel.getRangeAt(0);
    var rect = range.getBoundingClientRect();
    if (!rect || (rect.width === 0 && rect.height === 0)) {
      tb.classList.remove('visible');
      return;
    }
    try { window._rangoBurbuja_ = range.cloneRange(); } catch (e) { window._rangoBurbuja_ = null; }
    if (canvas && tb.parentNode !== canvas) canvas.appendChild(tb);
    var base = (canvas || document.body).getBoundingClientRect();
    var scroller = canvas || document.body;
    var top = rect.top - base.top + scroller.scrollTop - 42;
    var left = rect.left - base.left + scroller.scrollLeft + (rect.width / 2);
    tb.style.top = Math.max(4, top) + 'px';
    tb.style.left = left + 'px';
    tb.style.transform = 'translateX(-50%)';
    tb.classList.add('visible');
  }

  function aplicarComandoBurbuja_(cmd) {
    var sel = window.getSelection();
    if (window._rangoBurbuja_ && sel) {
      sel.removeAllRanges();
      sel.addRange(window._rangoBurbuja_);
    }
    var area = areaSeleccionEditable_(window.getSelection());
    if (area && area.focus) area.focus();
    if (cmd === 'h3') {
      try { document.execCommand('formatBlock', false, '<h3>'); } catch (e) {}
    } else if (cmd === 'createLink') {
      var url = window.prompt('Ingresa el enlace web (URL):', 'https://');
      if (!url || !String(url).trim() || String(url).trim() === 'https://') return;
      try { document.execCommand('createLink', false, String(url).trim()); } catch (e2) {}
    } else {
      try { document.execCommand(cmd, false, null); } catch (e3) {}
    }
    if (typeof marcarIDevicesTocados_ === 'function') marcarIDevicesTocados_();
    posicionarBubble_();
  }

  function escucharBubble_() {
    if (window._bubbleToolbarLista_) return;
    window._bubbleToolbarLista_ = true;
    var pendiente = false;
    document.addEventListener('selectionchange', function () {
      if (pendiente) return;
      pendiente = true;
      window.requestAnimationFrame(function () {
        pendiente = false;
        posicionarBubble_();
      });
    });
  }

  function prepararAnclaCanvas_() {
    var canvas = lienzoExe_();
    if (!canvas || !window.getComputedStyle) return;
    if (window.getComputedStyle(canvas).position === 'static') canvas.style.position = 'relative';
  }

  function prepararLienzoDivi603_() {
    erradicarBarraFijaLienzo_();
    vigilarBarraFijaLienzo_();
    prepararAnclaCanvas_();
    asegurarBubbleToolbar_();
    escucharBubble_();
    asegurarBotonSidebarExe_();
    if (contenedorExe_()) asegurarSeccionDivi_();
    marcarAreasEditablesDivi_();
  }

  function envolverInsercionDivi_() {
    if (typeof window.insertariDeviceSesion_ !== 'function' || window.insertariDeviceSesion_._st90Divi603) return;
    var previa = window.insertariDeviceSesion_;
    window.insertariDeviceSesion_ = function (tipo) {
      return insertarModuloEnColumnaActiva_(tipo, previa);
    };
    window.insertariDeviceSesion_._st90Divi603 = true;
    window.insertariDeviceSesion_._st90Exe = previa._st90Exe || window.insertariDeviceSesion_._st90Exe;
  }

  function envolverDeshacerDivi_() {
    if (typeof window.deshacerEliminarBloque_ === 'function' && !window._deshacerBloquePrevio603_) {
      window._deshacerBloquePrevio603_ = window.deshacerEliminarBloque_;
    }
    window.deshacerEliminarBloque_ = deshacerEliminarBloque603_;
  }

  function instalarEventosDivi603_() {
    if (window._eventosDivi603_) return;
    window._eventosDivi603_ = true;
    document.addEventListener('mousedown', function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      if (t.closest('#bubbleToolbar, .btn-plus-green, .divi-columns-picker, .btn-add-module-inside, .btn-ctrl-up, .btn-ctrl-down, .btn-ctrl-del, .btn-toggle-sidebar-exe')) {
        ev.preventDefault();
      }
    });
    document.addEventListener('click', function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      var burbuja = t.closest('#bubbleToolbar .bubble-btn');
      if (burbuja) {
        ev.preventDefault();
        aplicarComandoBurbuja_(burbuja.getAttribute('data-cmd'));
        return;
      }
      var arriba = t.closest('.btn-ctrl-up');
      if (arriba) {
        ev.preventDefault();
        moverElementoDOM_(nodoControladoDivi_(arriba), -1);
        return;
      }
      var abajo = t.closest('.btn-ctrl-down');
      if (abajo) {
        ev.preventDefault();
        moverElementoDOM_(nodoControladoDivi_(abajo), 1);
        return;
      }
      var quitar = t.closest('.btn-ctrl-del');
      if (quitar) {
        ev.preventDefault();
        eliminarNodoDivi_(quitar);
        return;
      }
      var anadir = t.closest('.btn-add-module-inside');
      if (anadir) {
        ev.preventDefault();
        var col = anadir.closest('.divi-column');
        if (col) activarColumnaObjetivo_(col);
        return;
      }
      var opcion = t.closest('.divi-columns-picker [data-distribucion]');
      if (opcion) {
        ev.preventDefault();
        var filaOpcion = opcion.closest('.divi-plus-row');
        insertarFilaDivi_(opcion.getAttribute('data-distribucion'), filaOpcion);
        cerrarSelectoresColumnas_();
        return;
      }
      var plus = t.closest('.btn-plus-green');
      if (plus) {
        ev.preventDefault();
        var fila = plus.closest('.divi-plus-row');
        var yaAbierto = fila && fila.querySelector('.divi-columns-picker');
        cerrarSelectoresColumnas_();
        if (!yaAbierto && fila) abrirSelectorColumnas_(fila);
        return;
      }
      if (!t.closest('.divi-columns-picker')) cerrarSelectoresColumnas_();
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') cerrarSelectoresColumnas_();
    });
  }

  function instalarConstructorDivi603_() {
    if (window._st90Divi603Instalado_) {
      prepararLienzoDivi603_();
      envolverInsercionDivi_();
      return;
    }
    window._st90Divi603Instalado_ = true;
    envolverRepintadoDivi_();
    envolverDeshacerDivi_();
    envolverInsercionDivi_();
    instalarEventosDivi603_();
    if (typeof window.montarEntornoExeLearning_ === 'function' && !window.montarEntornoExeLearning_._st90Divi603) {
      var montarPrevio = window.montarEntornoExeLearning_;
      window.montarEntornoExeLearning_ = function () {
        var r = montarPrevio.apply(this, arguments);
        prepararLienzoDivi603_();
        envolverInsercionDivi_();
        return r;
      };
      window.montarEntornoExeLearning_._st90Divi603 = true;
    }
    prepararLienzoDivi603_();
  }

  window.alternarSidebarExe_ = alternarSidebarExe_;
  window.activarColumnaObjetivo_ = activarColumnaObjetivo_;
  window.insertarFilaDivi_ = insertarFilaDivi_;
  window.insertarModuloEnColumnaActiva_ = function (tipo) {
    if (typeof window.insertariDeviceSesion_ === 'function' && window.insertariDeviceSesion_._st90Divi603) {
      return window.insertariDeviceSesion_(tipo);
    }
    return insertarModuloEnColumnaActiva_(tipo, window.insertariDeviceSesion_);
  };
  window.colocarModuloEnColumnaActiva_ = colocarModuloEnColumnaActiva_;
  window.moverElementoDOM_ = moverElementoDOM_;
  window.eliminarNodoDivi_ = eliminarNodoDivi_;
  window.erradicarBarraFijaLienzo_ = erradicarBarraFijaLienzo_;
  window.nodoControladoDivi_ = nodoControladoDivi_;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', instalarConstructorDivi603_);
  } else {
    instalarConstructorDivi603_();
  }
})();
```
