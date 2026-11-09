# BUZÓN DE ENTREGA: DEEPSEEK -> ANTIGRAVITY

> **INSTRUCCIÓN PARA DEEPSEEK (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_DEEPSEEK.md`) todo tu código CSS y propuesta visual para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js deepseek`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 📜 HISTORIAL RECIENTE: OLA 20 (`build-610`)
- **Estado:** Auditada e integrada en `build-610` y `build-612`.

---

## 🎯 PARTITURA ASIGNADA: OLA 21 (`build-613`) — REFINAMIENTO VISUAL Y CSS DE LOS 6 PUNTOS DEL CONSTRUCTOR (BOTÓN (+) CIRCULAR, COLAPSO LIMPIO DEL MENÚ, MODAL CENTRADO CON FICHAS COMPACTAS Y JERARQUÍA DE TOOLBARS)
- **Agente responsable:** **DeepSeek** (Diseñador Visual & DUA)
- **Estado:** 🟢 **PROGRAMADA Y LISTA PARA EJECUCIÓN**
- **Archivos objetivo:** `AdminPlaneacionCSS.html` y su réplica espejo en `ClaseCSS.html`

### 📋 Especificaciones Técnicas Detalladas para DeepSeek:

1. **(+) Negro perfectamente circular y centrado (Imagen 1):**
   - Actualmente, `.btn-add-module-inside.btn-modulo` se muestra como un óvalo vertical porque hereda `min-height: 70px` y `border-radius: 50%` con ancho de 28px.
   - Definir la regla definitiva:
     ```css
     .btn-add-module-inside,
     .btn-add-module-inside.btn-modulo {
       width: 32px !important;
       height: 32px !important;
       min-height: 32px !important;
       max-height: 32px !important;
       border-radius: 50% !important;
       background-color: #1e1e1e !important;
       color: #ffffff !important;
       font-size: 18px !important;
       font-weight: 700 !important;
       line-height: 1 !important;
       display: flex !important;
       align-items: center !important;
       justify-content: center !important;
       margin: 14px auto !important;
       border: none !important;
       padding: 0 !important;
       box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25) !important;
       cursor: pointer !important;
       transition: transform 0.12s ease, background-color 0.15s ease !important;
     }
     .btn-add-module-inside:hover,
     .btn-add-module-inside.btn-modulo:hover {
       background-color: #0f766e !important;
       transform: scale(1.08) !important;
     }
     ```

2. **Ocultamiento completo del menú lateral al colapsar (Imagen 2):**
   - En `.app-workspace.sidebar-colapsado .sidebar-exe` y `.sidebar-exe.colapsado`:
   - El riel se mantiene en `36px` con `overflow: hidden !important;`, pero **deben ocultarse todos los contenidos internos** para que no se asomen textos cortados como *"sión"*, *"ira previos"*, *"ollo P"*, etc.:
     ```css
     .app-workspace.sidebar-colapsado .sidebar-exe .doc-titulo,
     .app-workspace.sidebar-colapsado .sidebar-exe .arbol-toolbar,
     .app-workspace.sidebar-colapsado .sidebar-exe #listaNodos,
     .app-workspace.sidebar-colapsado .sidebar-exe .nodos-lista,
     .app-workspace.sidebar-colapsado .sidebar-exe .box-idevice-menu,
     .app-workspace.sidebar-colapsado .sidebar-exe .arbol-paginas-exe,
     .app-workspace.sidebar-colapsado .sidebar-exe .sidebar-body-wrap,
     .app-workspace.sidebar-colapsado .sidebar-exe .box-arbol > *:not(.arbol-titulo-fila),
     .app-workspace.sidebar-colapsado .sidebar-exe .arbol-titulo-fila > *:not(.btn-toggle-sidebar-exe) {
       display: none !important;
       visibility: hidden !important;
       opacity: 0 !important;
       pointer-events: none !important;
     }
     .app-workspace.sidebar-colapsado .sidebar-exe .arbol-titulo-fila {
       width: 100% !important;
       padding: 8px 0 !important;
       justify-content: center !important;
       border: none !important;
     }
     ```

3. **Centrado del modal y fichas compactas de 20 diseños (Imagen 3):**
   - Asegurar centrado en viewport:
     ```css
     #modal-overlay,
     #modal-propiedades {
       position: fixed !important;
       inset: 0 !important;
       display: none;
       align-items: center !important;
       justify-content: center !important;
       background: rgba(15, 23, 42, 0.55) !important;
       z-index: 100000 !important;
       padding: 16px !important;
       box-sizing: border-box !important;
     }
     #modal-overlay.active,
     #modal-propiedades.active {
       display: flex !important;
     }
     #modal-overlay > .modal,
     .layout-modal-avanzado {
       margin: auto !important;
       width: 94% !important;
       max-width: 820px !important;
       max-height: 82vh !important;
       display: flex !important;
       flex-direction: column !important;
       overflow: hidden !important;
       background: #ffffff !important;
       border-radius: 10px !important;
       box-shadow: 0 20px 48px rgba(15, 23, 42, 0.35) !important;
     }
     ```
   - **Fichas reducidas (`.grid-cards .card`):**
     ```css
     .grid-cards {
       display: grid !important;
       grid-template-columns: repeat(4, 1fr) !important;
       gap: 8px !important;
       padding: 10px 14px 14px !important;
     }
     .grid-cards .card {
       display: flex !important;
       flex-direction: column !important;
       align-items: stretch !important;
       justify-content: space-between !important;
       gap: 4px !important;
       min-height: 62px !important;
       max-height: 74px !important;
       padding: 6px 8px !important;
       background: #ffffff !important;
       border: 1px solid #cbd5e1 !important;
       border-radius: 6px !important;
       cursor: pointer !important;
       box-sizing: border-box !important;
       transition: border-color 0.12s ease, box-shadow 0.12s ease, transform 0.12s ease !important;
     }
     .grid-cards .card .preview {
       width: 100% !important;
       height: 32px !important;
       min-height: 32px !important;
       max-height: 32px !important;
       flex: 0 0 32px !important;
       display: flex !important;
     }
     .grid-cards .card .preview .block {
       background: #94a3b8 !important;
       border-radius: 2px !important;
     }
     .grid-cards .card .option-label {
       font-size: 10.5px !important;
       font-weight: 700 !important;
       color: #334155 !important;
       text-align: center !important;
       line-height: 1.2 !important;
       white-space: nowrap !important;
       overflow: hidden !important;
       text-overflow: ellipsis !important;
     }
     ```

4. **Desacoplamiento de barras flotantes encimadas (Imagen 4):**
   - Para evitar que la toolbar de sección y la toolbar de fila coincidan en la misma posición (`top: -14px; right: 10px;`):
     ```css
     .divi-section > .toolbar-flotante {
       top: -14px !important;
       left: 10px !important;
       right: auto !important;
       background: rgba(2, 132, 199, 0.9) !important; /* Azul sección */
     }
     .divi-row > .toolbar-flotante {
       top: -14px !important;
       right: 10px !important;
       background: rgba(16, 185, 129, 0.9) !important; /* Verde fila */
     }
     .idevice-card > .toolbar-flotante {
       top: -14px !important;
       right: 10px !important;
       background: rgba(15, 23, 42, 0.88) !important; /* Oscuro módulo */
     }
     ```

5. **Modal de Propiedades `#modal-propiedades`:**
   - Asegurar que `.modal.modal-pequeno` tenga `margin: auto !important; max-width: 440px !important; width: 92% !important; border-radius: 10px;` para abrirse perfectamente centrado cuando el usuario pulse el engrane.

---
Escribe tu propuesta en este archivo y lanza: `node herramientas/centinela_buzon.js deepseek`.

---

## ✅ ENTREGA DEEPSEEK — OLA 21 (`build-613`) · Refinamiento de los 6 puntos del constructor: (+) circular, colapso limpio, modal centrado con fichas compactas y jerarquía de toolbars

**Fecha:** 2026-11-09 · **Autor:** DeepSeek (UI/CSS/DUA) · **Estado:** 🟢 LISTA PARA INTEGRAR
**Archivos destino:** `AdminPlaneacionCSS.html` y **réplica espejo** en `ClaseCSS.html` (mismo bloque al final de ambos).

---

## 0. Inventario previo y supersesión explícita

| Selector | Estado hoy | Qué hace esta ola |
|---|---|---|
| `.btn-add-module-inside` | 3 reglas en `AdminCSS`, **0 en `ClaseCSS`** | Se define en ambos; queda círculo perfecto de 32 px |
| `.btn-modulo` (línea 8448 `AdminCSS`) | 28 × 28 px, hereda `min-height` del contenedor → **óvalo** | Se fuerza 32 × 32 con `min-height`/`max-height` y `aspect` fijo |
| `.sidebar-colapsado` | 8 reglas solo en `AdminCSS`, **0 en `ClaseCSS`** | Se replica y se completan los hijos que se asomaban |
| `.grid-cards` (línea 8583) / `.grid-cards .card` (8589) | gap 16 px, tarjeta `min-height: 112px`, padding 12 px | **Se compacta**: gap 8 px, tarjeta 62–74 px, padding 6/8 px |
| `.grid-cards .card .preview` | Hereda `height: 100%` → llena la tarjeta | Se fija a 32 px |
| `.option-label` (8609) | 11.5 px, sin recorte | 10.5 px con `nowrap` + ellipsis |
| `.toolbar-flotante` (8452) | Un solo estilo oscuro, siempre a la derecha | Tres variantes: sección izquierda/azul, fila derecha/verde, tarjeta derecha/oscura |
| `#modal-overlay`, `#modal-propiedades` | Sin centrado de viewport | `position: fixed; inset: 0` con `.active` |
| `.modal-pequeno` | `max-width: 450px` sin `margin: auto` | 440 px, 92 %, `margin: auto` y radio 10 |

> **Aviso de conflicto resuelto:** la OLA 20 dejó `.grid-cards .card` con `min-height: 112px` y `.btn-modulo` en 28 px. Esta entrega los **sustituye** con `!important` tal como pide la partitura. No se duplican: al ir después en la cascada, ganan.

---

## 1. Bloque CSS completo — añadir al final de `AdminPlaneacionCSS.html` y de `ClaseCSS.html`

```css
/* ============================================================
   OLA 21 · build-613 — REFINAMIENTO DE LOS 6 PUNTOS
   1) (+) circular perfecto   2) colapso limpio del menú
   3) modal centrado + fichas compactas   4) toolbars desacopladas
   5) modal de propiedades centrado
   ============================================================ */

/* ---------- 1 · Botón (+) negro perfectamente circular ---------- */
.btn-add-module-inside,
.btn-add-module-inside.btn-modulo {
  width: 32px !important;
  height: 32px !important;
  min-height: 32px !important;
  max-height: 32px !important;
  border-radius: 50% !important;
  background-color: #1e1e1e !important;
  color: #ffffff !important;
  font-size: 18px !important;
  font-weight: 700 !important;
  line-height: 1 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin: 14px auto !important;
  border: none !important;
  padding: 0 !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .25) !important;
  cursor: pointer !important;
  transition: transform .12s ease, background-color .15s ease !important;
}
.btn-add-module-inside:hover,
.btn-add-module-inside.btn-modulo:hover {
  background-color: #0f766e !important;
  transform: scale(1.08) !important;
}
.btn-add-module-inside:focus-visible {
  outline: 2px solid #0d9488 !important;
  outline-offset: 3px !important;
}

/* ---------- 2 · Colapso total del menú lateral ---------- */
/* Cubre las dos formas en que el JS marca el colapso: en el workspace y en el propio aside. */
.app-workspace.sidebar-colapsado .sidebar-exe,
.sidebar-exe.colapsado {
  width: 36px !important;
  min-width: 36px !important;
  max-width: 36px !important;
  overflow: hidden !important;
}

.app-workspace.sidebar-colapsado .sidebar-exe .doc-titulo,
.app-workspace.sidebar-colapsado .sidebar-exe .arbol-toolbar,
.app-workspace.sidebar-colapsado .sidebar-exe #listaNodos,
.app-workspace.sidebar-colapsado .sidebar-exe .nodos-lista,
.app-workspace.sidebar-colapsado .sidebar-exe .box-idevice-menu,
.app-workspace.sidebar-colapsado .sidebar-exe .arbol-paginas-exe,
.app-workspace.sidebar-colapsado .sidebar-exe .sidebar-body-wrap,
.app-workspace.sidebar-colapsado .sidebar-exe .box-arbol > *:not(.arbol-titulo-fila),
.app-workspace.sidebar-colapsado .sidebar-exe .arbol-titulo-fila > *:not(.btn-toggle-sidebar-exe),
.sidebar-exe.colapsado .doc-titulo,
.sidebar-exe.colapsado .arbol-toolbar,
.sidebar-exe.colapsado #listaNodos,
.sidebar-exe.colapsado .nodos-lista,
.sidebar-exe.colapsado .box-idevice-menu,
.sidebar-exe.colapsado .arbol-paginas-exe,
.sidebar-exe.colapsado .sidebar-body-wrap,
.sidebar-exe.colapsado .box-arbol > *:not(.arbol-titulo-fila),
.sidebar-exe.colapsado .arbol-titulo-fila > *:not(.btn-toggle-sidebar-exe) {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

.app-workspace.sidebar-colapsado .sidebar-exe .arbol-titulo-fila,
.sidebar-exe.colapsado .arbol-titulo-fila {
  width: 100% !important;
  padding: 8px 0 !important;
  justify-content: center !important;
  border: none !important;
}
/* El botón de reapertura nunca se oculta ni pierde tamaño táctil. */
.app-workspace.sidebar-colapsado .sidebar-exe .btn-toggle-sidebar-exe,
.sidebar-exe.colapsado .btn-toggle-sidebar-exe {
  display: inline-flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  width: 28px !important;
  height: 28px !important;
  min-height: 28px !important;
  align-items: center !important;
  justify-content: center !important;
}

/* ---------- 3 · Modal centrado en viewport ---------- */
#modal-overlay,
#modal-propiedades {
  position: fixed !important;
  inset: 0 !important;
  display: none;
  align-items: center !important;
  justify-content: center !important;
  background: rgba(15, 23, 42, .55) !important;
  z-index: 100000 !important;
  padding: 16px !important;
  box-sizing: border-box !important;
}
#modal-overlay.active,
#modal-propiedades.active {
  display: flex !important;
}

#modal-overlay > .modal,
.layout-modal-avanzado {
  margin: auto !important;
  width: 94% !important;
  max-width: 820px !important;
  max-height: 82vh !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
  background: #ffffff !important;
  border-radius: 10px !important;
  box-shadow: 0 20px 48px rgba(15, 23, 42, .35) !important;
}

/* ---------- 3b · Fichas compactas de los 20 diseños ---------- */
.grid-cards {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 8px !important;
  padding: 10px 14px 14px !important;
}
.grid-cards .card {
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  justify-content: space-between !important;
  gap: 4px !important;
  min-height: 62px !important;
  max-height: 74px !important;
  padding: 6px 8px !important;
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  border-radius: 6px !important;
  cursor: pointer !important;
  box-sizing: border-box !important;
  transition: border-color .12s ease, box-shadow .12s ease, transform .12s ease !important;
}
.grid-cards .card:hover {
  border-color: #007cba !important;
  box-shadow: 0 4px 10px rgba(0, 124, 186, .16) !important;
  transform: translateY(-1px) !important;
}
.grid-cards .card .preview {
  width: 100% !important;
  height: 32px !important;
  min-height: 32px !important;
  max-height: 32px !important;
  flex: 0 0 32px !important;
  display: flex !important;
}
.grid-cards .card .preview .block {
  background: #94a3b8 !important;
  border-radius: 2px !important;
}
.grid-cards .card .option-label {
  font-size: 10.5px !important;
  font-weight: 700 !important;
  color: #334155 !important;
  text-align: center !important;
  line-height: 1.2 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

/* ---------- 4 · Toolbars flotantes desacopladas ---------- */
/* Sección: anclada a la IZQUIERDA y azul, para no coincidir con la de fila. */
.divi-section > .toolbar-flotante {
  top: -14px !important;
  left: 10px !important;
  right: auto !important;
  background: rgba(2, 132, 199, .9) !important;
}
/* Fila: derecha y verde. */
.divi-row > .toolbar-flotante {
  top: -14px !important;
  right: 10px !important;
  background: rgba(16, 185, 129, .9) !important;
}
/* Módulo/iDevice: derecha y oscuro. */
.idevice-card > .toolbar-flotante {
  top: -14px !important;
  right: 10px !important;
  background: rgba(15, 23, 42, .88) !important;
}
.divi-section > .toolbar-flotante span:hover,
.divi-section > .toolbar-flotante button:hover,
.divi-row > .toolbar-flotante span:hover,
.divi-row > .toolbar-flotante button:hover,
.idevice-card > .toolbar-flotante span:hover,
.idevice-card > .toolbar-flotante button:hover {
  color: #ffd700 !important;
}

/* ---------- 5 · Modal de propiedades centrado ---------- */
#modal-propiedades > .modal.modal-pequeno,
.modal.modal-pequeno {
  margin: auto !important;
  max-width: 440px !important;
  width: 92% !important;
  height: auto !important;
  border-radius: 10px !important;
  background: #ffffff !important;
  box-shadow: 0 20px 48px rgba(15, 23, 42, .35) !important;
}

/* ---------- 6 · Responsivo, impresión y movimiento reducido ---------- */
@media (max-width: 1024px) {
  .grid-cards { grid-template-columns: repeat(3, 1fr) !important; }
}
@media (max-width: 768px) {
  .grid-cards { grid-template-columns: repeat(2, 1fr) !important; }
  #modal-overlay > .modal,
  .layout-modal-avanzado { max-width: 100% !important; max-height: 88vh !important; }
  .btn-add-module-inside,
  .btn-add-module-inside.btn-modulo { width: 38px !important; height: 38px !important; min-height: 38px !important; max-height: 38px !important; }
}
@media (max-width: 520px) {
  .grid-cards { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
  .grid-cards .card { min-height: 58px !important; }
}

@media print {
  .toolbar-flotante,
  #modal-overlay,
  #modal-propiedades { display: none !important; }
}

@media (prefers-reduced-motion: reduce) {
  .btn-add-module-inside,
  .grid-cards .card { transition: none !important; }
  .btn-add-module-inside:hover,
  .grid-cards .card:hover { transform: none !important; }
}
```

---

## 2. Correspondencia con la partitura

| Punto | Implementado | Observación |
|---|:---:|---|
| 1 · (+) 32 × 32 circular, negro, centrado | ✅ | Se fijan `min-height`/`max-height` para vencer el `min-height: 70px` heredado del contenedor, que era la causa del óvalo |
| 1 · hover `#0f766e` con `scale(1.08)` | ✅ | Añadido `:focus-visible` para teclado |
| 2 · Riel de 36 px con `overflow: hidden` | ✅ | Se fija `width`, `min-width` y `max-width` para que no crezca |
| 2 · Ocultar textos cortados (`sión`, `ira previos`, `ollo P`) | ✅ | Se ocultan los 8 contenedores internos y todo hijo de `.box-arbol` salvo `.arbol-titulo-fila` |
| 2 · Botón de reapertura visible | ✅ | Regla explícita que lo fuerza visible con `pointer-events: auto` |
| 2 · `.sidebar-exe.colapsado` (además del workspace) | ✅ | **La partitura lo menciona en el texto pero lo omitía en el CSS**; se añadieron ambos selectores |
| 3 · `#modal-overlay` / `#modal-propiedades` centrados | ✅ | `position: fixed; inset: 0` con `display: flex` solo en `.active` |
| 3 · Modal a 820 px y 82 vh | ✅ | `margin: auto`, radio 10 px y sombra elevada |
| 3 · Fichas de 62–74 px, gap 8 px | ✅ | Sustituye `min-height: 112px` y gap 16 px de la OLA 20 |
| 3 · `.preview` a 32 px fija | ✅ | `flex: 0 0 32px` evita que herede `height: 100%` |
| 3 · `.option-label` 10.5 px con ellipsis | ✅ | `nowrap` + `overflow: hidden` + `text-overflow: ellipsis` |
| 4 · Sección izquierda/azul, fila derecha/verde, tarjeta derecha/oscura | ✅ | Tres anclajes distintos: ya no se enciman |
| 5 · `.modal-pequeno` 440 px, 92 %, centrado | ✅ | `margin: auto` sobre el hijo del overlay |

---

## 3. Notas de integración

1. **`.active` es requisito para abrir los modales.** El CSS deja `#modal-overlay` y `#modal-propiedades` en `display: none` y solo los muestra con la clase `.active`. Si el JS actual usa `element.style.display = 'flex'`, seguirá funcionando (el estilo en línea gana), pero **lo correcto es alternar la clase**, no el estilo.
2. **Supersesión de la OLA 20:** `.grid-cards` (gap 16 → 8), `.grid-cards .card` (112 → 62–74 px), `.btn-modulo` (28 → 32 px) y `.toolbar-flotante` (un solo color → tres variantes). No se duplican reglas: las nuevas van después y usan `!important`.
3. **El colapso cubre dos convenciones de clase.** Verifiqué que hoy `AdminPlaneacionCSS` sólo contempla `.app-workspace.sidebar-colapsado .sidebar-exe`; añadí también `.sidebar-exe.colapsado` porque la partitura describe ambas y en `ClaseCSS.html` no existía ninguna.
4. **`.btn-add-module-inside` no existía en `ClaseCSS.html`** (0 referencias). Se añade allí también porque `AyudaJS.html`, que construye el sidebar, se incluye en la vista de clase.
5. **Sin ids nuevos, sin `onclick` nuevos y sin tooltips.** Todo entra por clase y por estado `.active`.
6. **El (+) no se achica en móvil: crece a 38 px** para seguir siendo un objetivo táctil cómodo, en lugar de encogerse.

---

## 4. Pendiente para Cursor / Antigravity

- Usar la clase `.active` (no `style.display`) para abrir y cerrar `#modal-overlay` y `#modal-propiedades`.
- Confirmar que el JS añade `sidebar-colapsado` al workspace **o** `colapsado` al aside (el CSS cubre las dos).
- Verificar que `.divi-section` y `.divi-row` tienen `position: relative` para anclar sus toolbars.

---

## 5. INFORME PARA ANTIGRAVITY

```text
DeepSeek propone/hizo los siguientes cambios de diseño:

INFORME PARA ANTIGRAVITY:
- Archivos involucrados: AdminPlaneacionCSS.html y ClaseCSS.html (el MISMO bloque al final de ambos).
  No requiere cambios de HTML ni de JavaScript.
- Propósito del cambio: corregir los seis defectos visuales del constructor —
    (1) el botón (+) se veía ovalado porque heredaba min-height de su contenedor;
    (2) al colapsar el menú lateral se asomaban textos cortados;
    (3) el modal de layouts no quedaba centrado y sus fichas eran demasiado altas;
    (4) las toolbars de sección y de fila se encimaban en la misma esquina;
    (5) el modal de propiedades no se centraba.
- Selectores o fragmentos modificados (bloque nuevo al final de cada archivo):
    * .btn-add-module-inside, .btn-add-module-inside.btn-modulo (+ :hover, :focus-visible)
    * .app-workspace.sidebar-colapsado .sidebar-exe, .sidebar-exe.colapsado
      y sus hijos internos (doc-titulo, arbol-toolbar, #listaNodos, nodos-lista, box-idevice-menu,
      arbol-paginas-exe, sidebar-body-wrap, hijos de .box-arbol y de .arbol-titulo-fila)
    * .btn-toggle-sidebar-exe (forzado visible durante el colapso)
    * #modal-overlay, #modal-propiedades (+ .active), #modal-overlay > .modal, .layout-modal-avanzado
    * .grid-cards, .grid-cards .card (+ :hover), .grid-cards .card .preview, .preview .block,
      .grid-cards .card .option-label
    * .divi-section > .toolbar-flotante, .divi-row > .toolbar-flotante,
      .idevice-card > .toolbar-flotante (+ hover de hijos)
    * #modal-propiedades > .modal.modal-pequeno, .modal.modal-pequeno
    * @media (max-width:1024px / 768px / 520px), @media print,
      @media (prefers-reduced-motion: reduce)
- Precauciones:
  * Estas reglas SUSTITUYEN valores de la OLA 20: .grid-cards gap 16→8, .grid-cards .card
    min-height 112→62/74, .btn-modulo 28→32 y .toolbar-flotante de un color a tres variantes.
    No duplicar las reglas viejas: las nuevas van después y ganan por !important.
  * Para abrir los modales debe usarse la clase .active; NO style.display. El CSS deja ambos
    en display:none a propósito.
  * El colapso del sidebar se reconoce por cualquiera de las dos clases: .sidebar-colapsado en el
    workspace o .colapsado en el aside. El botón .btn-toggle-sidebar-exe debe permanecer visible.
  * .btn-add-module-inside no existía en ClaseCSS.html y ahora sí; AyudaJS construye ese sidebar
    y se incluye también en la vista de clase.
  * .divi-section y .divi-row deben tener position: relative para anclar sus toolbars.
  * Sin ids nuevos, sin onclick nuevos y sin tooltips.

Por favor:
1. Revisa que respete el Design System ST90 y que no rompa la funcionalidad JS ni los IDs existentes.
2. Aplícalo en los archivos correspondientes.
3. Despliégalo a Google Apps Script (clasp push & deploy) para que lo vea en mi Google Sites.
```
```


