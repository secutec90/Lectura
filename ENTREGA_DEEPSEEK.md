# BUZÓN DE ENTREGA: DEEPSEEK -> ANTIGRAVITY

> **INSTRUCCIÓN PARA DEEPSEEK (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_DEEPSEEK.md`) todo tu código CSS y propuesta visual para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js deepseek`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: OLA 17 (`build-603+`) — ARQUITECTURA VISUAL DIVI REAL + TOOLBAR CONTEXTUAL NOTION + MENÚ LATERAL COLAPSABLE
- **Estado:** 🟢 PROGRAMADA (PARTITURA ASIGNADA — EJECUTAR AHORA)
- **Archivos objetivo:** `AdminPlaneacionCSS.html`, `ClaseCSS.html`, `ComunCSS.html`
- **Misión de DeepSeek:** Diseñar la maquetación CSS completa para la arquitectura pura por capas DIVI (Sección azul ➔ Fila verde con columnas ➔ Dropzone columna con resalte activo ➔ Módulo), la pastilla flotante contextual de formato (*Bubble Toolbar* tipo Notion/Medium), el botón y transición para colapsar/expandir el menú lateral izquierdo, y los controles de reordenamiento vertical (▲ / ▼).

---

### 📋 Especificaciones Técnicas y Visuales para DeepSeek:

#### 1. Menú Lateral Colapsable / Expandible (Sidebar Toggle)
- **Modo Colapsado (`.app-workspace.sidebar-colapsado .sidebar-exe` o `.sidebar-exe.colapsado`):**
  - Transición suave: `transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s, opacity 0.2s;`.
  - Ancho en reposo cuando colapsado: `width: 0 !important; min-width: 0 !important; overflow: hidden; opacity: 0; pointer-events: none; border-right: none;`.
  - Expansión del lienzo de autor: `.app-workspace.sidebar-colapsado .canvas-exe` debe tomar el `100%` del ancho con `max-width: 100% !important; flex: 1 1 100% !important;` para ofrecer modo de concentración y pantalla completa.
- **Botón Gatillo de Alternancia (`.btn-toggle-sidebar-exe`):**
  - Botón ergonómico en la cabecera o esquina flotante (28x28px, bordes redondeados 6px, fondo `#f0fdfa`, borde `1px solid #99f6e4`, color `#0f766e`, `:hover` fondo `#ccfbf1`).
  - Icono dinámico: `◀` cuando el menú está abierto, `▶` o icono panel cuando está colapsado.
  - Sombra sutil y accesibilidad con tooltip descriptivo.

#### 2. Paleta Estructural de Capas DIVI Puras
- **Nivel 1: Sección (`.divi-section`):**
  - Borde exterior azul: `2px solid #0284c7` (o variable `--divi-blue: #0284c7`).
  - Fondo blanco `#ffffff`, `border-radius: 10px`, `padding: 16px`, `margin-bottom: 24px`, sombra sutil `0 2px 8px rgba(2,132,199,0.08)`.
  - Cabecera de sección con etiqueta azul (`SECCIÓN PEDAGÓGICA`) y barra de controles (▲, ▼, ✕).
- **Nivel 2: Fila de Columnas (`.divi-row`):**
  - Borde verde: `1.5px solid #10b981` (o variable `--divi-green: #10b981`).
  - Fondo verde menta muy suave `#f0fdf4`, `border-radius: 8px`, `padding: 12px`, `margin-bottom: 12px`.
  - Contenedor interno `.divi-columns-grid` en CSS Grid / Flexbox con soporte para:
    - `.grid-col-1`: `grid-template-columns: 1fr;`
    - `.grid-col-2`: `grid-template-columns: 1fr 1fr; gap: 12px;` (50% / 50%)
    - `.grid-col-70-30`: `grid-template-columns: 7fr 3fr; gap: 12px;`
    - `.grid-col-3`: `grid-template-columns: 1fr 1fr 1fr; gap: 10px;` (33% / 33% / 33%)
- **Nivel 3: Columna Dropzone (`.divi-column`):**
  - Borde punteado: `1.5px dashed #10b981`, fondo `#ffffff`, `border-radius: 6px`, `padding: 10px`, `min-height: 110px`.
  - **Estado Objetivo Activo (`.divi-column.active-target`):**
    - Anillo de enfoque teal brillante: `box-shadow: 0 0 0 3px #0d9488, 0 0 14px rgba(13,148,136,0.35); border-color: #0d9488;`.
    - Distintivo visual superior `🎯 Columna activa para insertar`.
  - Botón interno de adición: `.btn-add-module-inside` con estilo punteado, centrado en columna vacía.
- **Nivel 4: Módulo Curricular (`.divi-module` / `.idevice-card`):**
  - Borde gris suave `#e2e8f0`, fondo `#f8fafc`, `border-radius: 6px`, `padding: 10px`.

#### 3. Fila Divisora Verde `(+)` y Selector de Columnas
- **Botón `(+)` Verde (`.btn-plus-green`):**
  - Botón circular de 28px, fondo verde `#10b981`, icono blanco `+`, sombra glow verde `0 2px 8px rgba(16,185,129,0.3)`.
  - `:hover`: fondo `#059669`, `transform: scale(1.15)`.
- **Selector de Columnas Flotante (`.divi-columns-picker`):**
  - Popover flotante centrado con fondo blanco, bordes redondeados 10px, sombra pronunciada `0 10px 25px rgba(0,0,0,0.15)`.
  - Tarjetas de previsualización gráfica de las 4 opciones (`1 Columna`, `50 / 50`, `70 / 30`, `33 / 33 / 33`) con miniaturas visuales en bloques grises y verdes.

#### 4. Barra Flotante Contextual (*Bubble Toolbar* Notion/Medium)
- **Contenedor `#bubbleToolbar` (`.floating-bubble-toolbar`):**
  - Posicionamiento: `position: absolute; z-index: 1200; pointer-events: auto;`.
  - Estilo visual tipo Notion/Medium: Fondo `#0f172a`, borde `1px solid rgba(255,255,255,0.12)`, `border-radius: 8px`, `padding: 4px 6px`, sombra `0 8px 24px rgba(0,0,0,0.45)`, `display: none; align-items: center; gap: 3px;`.
  - Cuando activo (`.visible`): `display: flex !important; animation: popIn 0.15s ease-out;`.
  - Botones de acción (`.bubble-btn`): 26x26px, fondo transparente, color `#f8fafc`, borde 0, `border-radius: 4px`, `:hover` fondo `rgba(255,255,255,0.15)`. Botón de enlace con campo de entrada rápido o prompt.

#### 5. Controles por Bloque (▲ / ▼ y ✕)
- Cabecera compacta en Sección, Fila y Módulo:
  - Botón `.btn-ctrl-up` (▲): color `#64748b`, `:hover` color `#0f766e`, fondo suave.
  - Botón `.btn-ctrl-down` (▼): color `#64748b`, `:hover` color `#0f766e`, fondo suave.
  - Botón `.btn-ctrl-del` (✕): color `#e11d48`, `:hover` fondo `#ffe4e6`.

---

### 📦 ENTREGA DE DEEPSEEK (ESCRIBE TU CÓDIGO CSS AQUÍ ABAJO):
*(DeepSeek escribirá aquí su bloque CSS con la maquetación de capas Divi, la pastilla flotante, el sidebar colapsable y los controles de movimiento)*

---

## ✍️ ENTREGA DEEPSEEK — OLA 17 (`build-603+`) · DIVI real, bubble toolbar y sidebar colapsable

**Fecha:** 2026-11-05 · **Archivo:** `AdminPlaneacionCSS.html`, líneas 6762–7177
Nuevamente todo en `AdminPlaneacionCSS.html`: el constructor solo se carga en el panel administrativo.

### 1. Correspondencia con la partitura

| Bloque | Clases | Estado |
| :--- | :--- | :--- |
| 1 · Sidebar colapsable | `.app-workspace.sidebar-colapsado .sidebar-exe`, `.sidebar-exe.colapsado`, `.canvas-exe`, `.btn-toggle-sidebar-exe` | ✅ |
| 2 · Capas DIVI | `.divi-section`, `.divi-row`, `.divi-columns-grid`, `.grid-col-1/2/70-30/3`, `.divi-column`, `.active-target`, `.btn-add-module-inside`, `.divi-module` | ✅ |
| 3 · Fila verde y selector | `.btn-plus-green`, `.inserter-row-divi`, `.divi-columns-picker`, `.divi-col-option` con 4 miniaturas | ✅ |
| 4 · Bubble toolbar | `#bubbleToolbar`, `.floating-bubble-toolbar`, `.bubble-btn`, `.bubble-divider`, `.bubble-link-input`, `@keyframes popIn` | ✅ |
| 5 · Controles | `.block-ctrl-group`, `.btn-ctrl-up`, `.btn-ctrl-down`, `.btn-ctrl-del` | ✅ |

### 2. CSS entregado

```css
  /* ============================================================
     OLA 17 · build-603+ — ARQUITECTURA DIVI REAL
     Capas Sección ▸ Fila ▸ Columna ▸ Módulo · pastilla contextual
     tipo Notion · sidebar colapsable · controles ▲ ▼ ✕
     ============================================================ */
  :root {
    --divi-blue: #0284c7;
    --divi-green: #10b981;
    --divi-teal: #0d9488;
  }

  /* ---------- 1 · Sidebar colapsable ---------- */
  .sidebar-exe,
  .app-workspace .sidebar-exe {
    transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.2s ease;
  }
  .app-workspace.sidebar-colapsado .sidebar-exe,
  .sidebar-exe.colapsado {
    width: 0 !important;
    min-width: 0 !important;
    max-width: 0 !important;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
    border-right: none;
  }
  .app-workspace.sidebar-colapsado .canvas-exe {
    max-width: 100% !important;
    flex: 1 1 100% !important;
  }

  .btn-toggle-sidebar-exe {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 1px solid #99f6e4;
    border-radius: 6px;
    background: #f0fdfa;
    color: #0f766e;
    font-size: 13px;
    font-weight: 800;
    line-height: 1;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
    transition: background 150ms ease, border-color 150ms ease, transform 150ms ease;
  }
  .btn-toggle-sidebar-exe:hover {
    background: #ccfbf1;
    border-color: #5eead4;
  }
  .btn-toggle-sidebar-exe:active { transform: scale(0.96); }
  .btn-toggle-sidebar-exe:focus-visible {
    outline: 2px solid #0d9488;
    outline-offset: 2px;
  }

  /* ---------- 2 · Capas DIVI ---------- */
  .divi-section {
    margin: 0 0 24px;
    padding: 16px;
    background: #ffffff;
    border: 2px solid var(--divi-blue);
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(2, 132, 199, 0.08);
  }
  .divi-section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 12px;
    padding: 0 0 8px;
    border-bottom: 1px solid #e0f2fe;
  }
  .divi-section-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2px 10px;
    border-radius: 999px;
    background: #e0f2fe;
    color: #0369a1;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: .06em;
    text-transform: uppercase;
  }

  .divi-row {
    margin: 0 0 12px;
    padding: 12px;
    background: #f0fdf4;
    border: 1.5px solid var(--divi-green);
    border-radius: 8px;
  }
  .divi-row:last-child { margin-bottom: 0; }

  .divi-columns-grid {
    display: grid;
    gap: 12px;
    align-items: stretch;
  }
  .grid-col-1 { grid-template-columns: 1fr; }
  .grid-col-2 { grid-template-columns: 1fr 1fr; gap: 12px; }
  .grid-col-70-30 { grid-template-columns: 7fr 3fr; gap: 12px; }
  .grid-col-3 { grid-template-columns: 1fr 1fr 1fr; gap: 10px; }

  .divi-column {
    position: relative;
    min-height: 110px;
    padding: 10px;
    background: #ffffff;
    border: 1.5px dashed var(--divi-green);
    border-radius: 6px;
    transition: box-shadow 150ms ease, border-color 150ms ease, background 150ms ease;
  }
  .divi-column.active-target {
    border-color: var(--divi-teal);
    box-shadow: 0 0 0 3px var(--divi-teal), 0 0 14px rgba(13, 148, 136, 0.35);
  }
  .divi-column.active-target::before {
    content: '🎯 Columna activa para insertar';
    position: absolute;
    top: -11px;
    left: 10px;
    padding: 2px 9px;
    border-radius: 999px;
    background: var(--divi-teal);
    color: #ffffff;
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: .04em;
    white-space: nowrap;
  }

  .btn-add-module-inside {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    min-height: 70px;
    padding: 10px;
    border: 1.5px dashed #cbd5e1;
    border-radius: 6px;
    background: #f8fafc;
    color: #64748b;
    font-family: inherit;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
  }
  .btn-add-module-inside:hover {
    background: #f0fdfa;
    border-color: var(--divi-teal);
    color: #0f766e;
  }
  .btn-add-module-inside:focus-visible {
    outline: 2px solid var(--divi-teal);
    outline-offset: 2px;
  }

  .divi-module,
  .divi-column .idevice-card {
    padding: 10px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
  }
  .divi-module + .divi-module { margin-top: 8px; }

  /* ---------- 3 · Fila divisora verde y selector de columnas ---------- */
  .btn-plus-green {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: var(--divi-green);
    color: #ffffff;
    font-size: 15px;
    font-weight: 800;
    line-height: 1;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    transition: background 150ms ease, transform 150ms ease, box-shadow 150ms ease;
  }
  .btn-plus-green:hover {
    background: #059669;
    transform: scale(1.15);
    box-shadow: 0 3px 12px rgba(16, 185, 129, 0.42);
  }
  .btn-plus-green:focus-visible {
    outline: 2px solid #047857;
    outline-offset: 3px;
  }

  .inserter-row-divi {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 26px;
    margin: 2px 0 8px;
  }
  .inserter-row-divi::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1.5px;
    background: #d1fae5;
  }

  .divi-columns-picker {
    position: absolute;
    top: 32px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1060;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    min-width: 288px;
    padding: 12px;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
  .divi-columns-picker[hidden] { display: none; }
  .divi-col-option {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 9px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #ffffff;
    cursor: pointer;
    transition: border-color 150ms ease, background 150ms ease, transform 150ms ease;
  }
  .divi-col-option:hover {
    border-color: var(--divi-green);
    background: #f0fdf4;
    transform: translateY(-1px);
  }
  .divi-col-option:focus-visible {
    outline: 2px solid var(--divi-teal);
    outline-offset: 2px;
  }
  .divi-col-option .preview-mini {
    display: grid;
    gap: 3px;
    height: 26px;
  }
  .divi-col-option .preview-mini span {
    background: #e2e8f0;
    border: 1px solid #cbd5e1;
    border-radius: 3px;
  }
  .divi-col-option:hover .preview-mini span {
    background: #bbf7d0;
    border-color: #86efac;
  }
  .preview-1 { grid-template-columns: 1fr; }
  .preview-2 { grid-template-columns: 1fr 1fr; }
  .preview-70-30 { grid-template-columns: 7fr 3fr; }
  .preview-3 { grid-template-columns: 1fr 1fr 1fr; }
  .divi-col-option .option-label {
    font-size: 11px;
    font-weight: 700;
    color: #475569;
    text-align: center;
  }

  /* ---------- 4 · Pastilla flotante contextual (Notion/Medium) ---------- */
  #bubbleToolbar,
  .floating-bubble-toolbar {
    position: absolute;
    z-index: 1200;
    pointer-events: auto;
    display: none;
    align-items: center;
    gap: 3px;
    padding: 4px 6px;
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  }
  #bubbleToolbar.visible,
  .floating-bubble-toolbar.visible {
    display: flex !important;
    animation: popIn 0.15s ease-out;
  }
  @keyframes popIn {
    from { opacity: 0; transform: translateY(4px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .bubble-btn {
    width: 26px;
    height: 26px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: #f8fafc;
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease;
  }
  .bubble-btn:hover { background: rgba(255, 255, 255, 0.15); }
  .bubble-btn:focus-visible {
    outline: 2px solid #38bdf8;
    outline-offset: 1px;
  }
  .bubble-btn.bubble-btn--activo {
    background: rgba(56, 189, 248, 0.25);
    color: #e0f2fe;
  }
  .bubble-divider {
    width: 1px;
    height: 16px;
    background: rgba(255, 255, 255, 0.18);
    flex: 0 0 auto;
  }
  .bubble-link-input {
    width: 132px;
    height: 24px;
    padding: 0 7px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.08);
    color: #f8fafc;
    font-family: inherit;
    font-size: 11.5px;
  }
  .bubble-link-input::placeholder { color: rgba(248, 250, 252, 0.55); }
  .bubble-link-input:focus {
    outline: none;
    border-color: #38bdf8;
    background: rgba(255, 255, 255, 0.12);
  }

  /* ---------- 5 · Controles de bloque ▲ ▼ ✕ ---------- */
  .block-ctrl-group {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    margin-left: auto;
  }
  .btn-ctrl-up,
  .btn-ctrl-down,
  .btn-ctrl-del {
    width: 24px;
    height: 24px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    border-radius: 5px;
    background: transparent;
    font-size: 11px;
    line-height: 1;
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
  }
  .btn-ctrl-up,
  .btn-ctrl-down { color: #64748b; }
  .btn-ctrl-up:hover,
  .btn-ctrl-down:hover {
    color: #0f766e;
    background: #f0fdfa;
    border-color: #ccfbf1;
  }
  .btn-ctrl-del { color: #e11d48; }
  .btn-ctrl-del:hover { background: #ffe4e6; border-color: #fecdd3; }
  .btn-ctrl-up:focus-visible,
  .btn-ctrl-down:focus-visible,
  .btn-ctrl-del:focus-visible {
    outline: 2px solid #0d9488;
    outline-offset: 1px;
  }

  @media (max-width: 860px) {
    .grid-col-2,
    .grid-col-70-30,
    .grid-col-3 { grid-template-columns: 1fr; }
    .divi-columns-picker { min-width: 240px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .sidebar-exe,
    .btn-plus-green,
    .bubble-btn,
    .divi-col-option,
    #bubbleToolbar.visible { animation: none; transition: none; }
  }
```

### 3. Contrato de marcado

```html
<button type="button" class="btn-toggle-sidebar-exe" aria-label="Colapsar menú">◀</button>

<section class="divi-section">
  <div class="divi-section-header">
    <span class="divi-section-label">Sección pedagógica</span>
    <div class="block-ctrl-group">
      <button type="button" class="btn-ctrl-up" aria-label="Subir">▲</button>
      <button type="button" class="btn-ctrl-down" aria-label="Bajar">▼</button>
      <button type="button" class="btn-ctrl-del" aria-label="Eliminar">✕</button>
    </div>
  </div>

  <div class="divi-row">
    <div class="divi-columns-grid grid-col-70-30">
      <div class="divi-column active-target">
        <div class="divi-module">Módulo curricular</div>
      </div>
      <div class="divi-column">
        <button type="button" class="btn-add-module-inside">+ Añadir módulo</button>
      </div>
    </div>
  </div>

  <div class="inserter-row-divi">
    <button type="button" class="btn-plus-green" aria-label="Añadir fila">+</button>
    <div class="divi-columns-picker" hidden>
      <button type="button" class="divi-col-option">
        <span class="preview-mini preview-2"><span></span><span></span></span>
        <span class="option-label">50 / 50</span>
      </button>
    </div>
  </div>
</section>

<div id="bubbleToolbar" class="floating-bubble-toolbar visible">
  <button type="button" class="bubble-btn">B</button>
  <button type="button" class="bubble-btn">I</button>
  <span class="bubble-divider"></span>
  <input class="bubble-link-input" placeholder="Pega un enlace…">
</div>
```

### 4. Decisiones

1. **El colapso usa `!important` solo donde el contrato lo exige** (`width`, `min-width`) y donde hay que vencer el `width: 330px` de la OLA 5. El resto de la transición va sin forzar.
2. **El distintivo 🎯 se dibuja con `::before`**: Cursor no tiene que añadir texto al HTML, solo la clase `.active-target`.
3. **Las miniaturas del selector son `grid` puro**: `preview-1/2/70-30/3` comparten el mismo marcado y cambian solo la plantilla de columnas.
4. **La pastilla flotante obedece al contrato al pie de la letra**: `display: none` por defecto y `display: flex !important` con `.visible`, más la animación `popIn` de 150 ms.
5. **En móvil (≤ 860 px) todas las rejillas DIVI caen a una columna**, para que el constructor siga siendo usable con el drawer abierto.
6. **`prefers-reduced-motion`** desactiva transiciones y animaciones.

### 5. Verificación

| Comprobación | Resultado |
| :--- | :--- |
| Llaves CSS balanceadas | `AdminPlaneacionCSS.html` 1095/1095 |
| Render a 880 px | ✅ sección azul, fila verde, columna activa con anillo teal y 🎯, selector con 4 miniaturas, pastilla oscura |
| Controles ▲ ▼ ✕ | ✅ visibles en la cabecera de sección |
| IDs / `.gs` / JS | sin cambios |

Evidencia: `evidencia_ola17b/divi_capas.png`.

### 6. Rollback

Borrar las líneas 6762–7177 o restaurar:
`C:\Users\40B\AppData\Local\Temp\st90_backup_fase5\AdminPlaneacionCSS_pre_ola17b.html`
