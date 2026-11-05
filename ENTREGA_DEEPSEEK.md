# BUZÓN DE ENTREGA: DEEPSEEK -> ANTIGRAVITY

> **INSTRUCCIÓN PARA DEEPSEEK (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_DEEPSEEK.md`) todo tu código CSS y propuesta visual para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js deepseek`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: OLA 17 (`build-602+`) — CONSTRUCTOR TECNO-PEDAGÓGICO FUSIÓN: DIVI + ELEMENTOR + NOTION + eXeLearning
- **Estado:** 🟢 PROGRAMADA (PARTITURA ASIGNADA — EJECUTAR AHORA)
- **Archivos objetivo:** `AdminPlaneacionCSS.html`, `ClaseCSS.html`, `ComunCSS.html`
- **Misión de DeepSeek:** Maquetar y entregar los estilos CSS visuales y de microinteracción para la fusión de paradigmas: flujo continuo `(+)` / `(-)` (Divi/Elementor), tablas divididas multicelda (Excel), cuadros de forma (Word), simuladores (GeoGebra real) y responsividad móvil con drawer $\le 860\text{px}$.

---

### 📋 Especificaciones Técnicas y Visuales para DeepSeek:

#### 1. Control de Flujo: Inserción Continua `(+)` y Eliminación Directa `(-)`
- **Botón `(-)` de Eliminación (`.btn-block-minus`):**
  - Botón circular de 26px colocado en la esquina superior derecha de cada tarjeta (`.idevice-card`).
  - Fondo blanco o semitransparente con icono menos en rojo carmesí (`#e11d48`), borde sutil `#fecdd3`.
  - `:hover`: fondo `#ffe4e6`, escala sutil `transform: scale(1.1)`.
- **Separador Continuo `(+)` (`.block-inserter-row` y `.btn-block-plus`):**
  - Fila horizontal entre tarjetas con altura de 24px, línea divisoria muy suave `#e2e8f0` que se resalta a `#99f6e4` en hover.
  - Botón circular central `(+)` de 28px con fondo teal `#0d9488`, icono blanco, sombra suave `0 2px 6px rgba(13,148,136,0.25)`.
  - `:hover`: fondo `#0f766e`, `transform: scale(1.18)`.
- **Menú Emergente Posicionado (`.inserter-popup-dropdown`):**
  - Tarjeta flotante con `position: absolute; z-index: 1050; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; box-shadow: 0 10px 25px rgba(15,23,42,0.15); padding: 12px; min-width: 280px;`.
  - Cuadrícula de 2 o 3 columnas con píldoras de acceso rápido (`.popup-inserter-item`) con icono temático, tipografía de 12px y hover en `#f0fdfa` con borde `#14b8a6`.

#### 2. Tablas Divididas Multicelda Estilo Excel (`.excel-split-table`)
- **Estructura y Colgroups:**
  - Tabla con ancho 100%, `border-collapse: separate; border-spacing: 6px;` para sensación de bloques modulares.
  - Clases para proporciones de columna:
    - `.cols-50-50 col:nth-child(1), .cols-50-50 col:nth-child(2) { width: 50%; }`
    - `.cols-33-33-33 col { width: 33.33%; }`
    - `.cols-70-30 col:nth-child(1) { width: 70%; } .cols-70-30 col:nth-child(2) { width: 30%; }`
    - `.cols-25-75 col:nth-child(1) { width: 25%; } .cols-25-75 col:nth-child(2) { width: 75%; }`
- **Celdas Autónomas (`.excel-layout-cell`):**
  - `min-height: 100px; padding: 14px; border: 1.5px dashed #cbd5e1; border-radius: 8px; background: #ffffff; transition: border-color .15s, box-shadow .15s;`
  - `:focus, .celda-activa`: borde sólido `#0d9488`, sombra `0 0 0 3px rgba(13,148,136,0.15)`.
  - Clases auxiliares de color de celda: `.cell-bg-white`, `.cell-bg-soft-blue` (`#f0f9ff`), `.cell-bg-soft-teal` (`#f0fdfa`), `.cell-bg-soft-amber` (`#fffbeb`), `.cell-bg-soft-gray` (`#f8fafc`).
  - Barra de herramientas flotante de celda (`.celda-props-bar`) con paleta de colores y selector de ancho.
  - Soporte táctil horizontal: contenedor con `-webkit-overflow-scrolling: touch; overflow-x: auto;`.

#### 3. Cuadros de Forma y Texto Estilo Word (`.word-shape-box`)
- **Bloque `.word-shape-box`:**
  - Contenedor con borde grueso redondeado de 2.5px, esquinas redondeadas de 12px, relleno interno de 18px.
  - Variantes temáticas:
    - `.shape-blue`: Borde `#0284c7`, fondo `#f0f9ff`, texto `#0c4a6e`.
    - `.shape-teal`: Borde `#0d9488`, fondo `#f0fdfa`, texto `#134e4a`.
    - `.shape-amber`: Borde `#f59e0b`, fondo `#fffbeb`, texto `#78350f`.
    - `.shape-purple`: Borde `#8b5cf6`, fondo `#f5f3ff`, texto `#4c1d95`.
    - `.shape-rose`: Borde `#f43f5e`, fondo `#fff1f2`, texto `#881337`.
  - Etiqueta de metadatos pedagógicos inferior (`.shape-badge-meta`): cápsula con letra de 11px, mayúsculas, icono y color coordinado (ej. *Forma Word: Rectángulo Redondeado DUA*).

#### 4. Marco de Simulador GeoGebra Real (`.geogebra-card-frame`)
- Contenedor responsivo con `border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);`.
- Cabecera con selector de ID de material, dimensiones (`ancho` y `alto`) y botón de pantalla completa.
- Iframe responsivo con `width: 100%; border: 0; display: block;`.

#### 5. Barra Superior WYSIWYG Unificada Tipo Word/Notion (`.top-wysiwyg-ribbon`)
- Cápsula blanca centrada (`background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); padding: 6px 14px; display: inline-flex; align-items: center; gap: 8px;`).
- Agrupación visual con separadores verticales (`.ribbon-divider`):
  - Formato texto: `B`, `I`, `U`, `H3`, viñetas `•`, numeración `1.`.
  - Estructura: Botón Tabla Excel, Botón Cuadro Word.
  - Accesibilidad: Píldora DUA de audio y selector de color de texto.

#### 6. Responsividad Móvil ($\le 860\text{px}$)
- Menú lateral `.sidebar-exe`:
  - `position: fixed; top: 0; left: 0; bottom: 0; width: 310px; z-index: 1100; transform: translateX(-100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 4px 0 20px rgba(0,0,0,0.15);`
  - Cuando se activa la clase `.drawer-abierto`, `transform: translateX(0);`.
- Telón de fondo móvil (`.backdrop-mobile`):
  - `position: fixed; inset: 0; background: rgba(15,23,42,0.5); z-index: 1090; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;`
  - Activo con `.backdrop-visible`: `opacity: 1; pointer-events: auto;`.
- Botón flotante móvil para abrir menú (`.btn-toggle-drawer`):
  - Botón circular teal de 44px en la esquina inferior izquierda.

---

### 📦 ENTREGA DE DEEPSEEK (ESCRIBE TU CÓDIGO CSS AQUÍ ABAJO):
*(DeepSeek escribirá aquí su propuesta de código CSS y la guardará automáticamente)*

---

## ✍️ ENTREGA DEEPSEEK — OLA 17 (`build-602+`) · Constructor Tecno-Pedagógico (fusión)

**Fecha:** 2026-11-05 · **Archivo:** `AdminPlaneacionCSS.html`, líneas 6327–6762

> Todo el CSS quedó en `AdminPlaneacionCSS.html` porque el constructor solo se carga en el panel administrativo. `ComunCSS.html` y `ClaseCSS.html` no reciben reglas nuevas: meter ahí estilos del constructor sería CSS muerto en la vista del alumno. Si Cursor necesita el ribbon WYSIWYG también en `Clase.html`, lo muevo a `ComunCSS.html` en cuanto lo confirme.

### 1. Correspondencia con la partitura

| Bloque | Clases | Estado |
| :--- | :--- | :--- |
| 1 · Flujo continuo | `.btn-block-minus`, `.block-inserter-row`, `.btn-block-plus`, `.inserter-popup-dropdown`, `.popup-inserter-item`, `.inserter-popup-grid` | ✅ |
| 2 · Tabla Excel | `.excel-split-table`, `.cols-50-50`, `.cols-33-33-33`, `.cols-70-30`, `.cols-25-75`, `.excel-layout-cell`, `.cell-bg-*`, `.celda-props-bar`, `.tabla-scroll-touch` | ✅ |
| 3 · Formas Word | `.word-shape-box`, `.shape-blue/teal/amber/purple/rose`, `.shape-badge-meta` | ✅ |
| 4 · GeoGebra | `.geogebra-card-frame`, `.geogebra-card-header`, `.btn-fullscreen` | ✅ |
| 5 · Ribbon WYSIWYG | `.top-wysiwyg-ribbon`, `.wysiwyg-btn`, `.ribbon-divider`, `.wysiwyg-pill` | ✅ |
| 6 · Responsividad | `.sidebar-exe` drawer, `.drawer-abierto`, `.backdrop-mobile`, `.backdrop-visible`, `.btn-toggle-drawer` | ✅ a ≤ 860 px |

### 2. CSS entregado

```css
  /* ============================================================
     OLA 17 · build-602+ — CONSTRUCTOR TECNO-PEDAGÓGICO (FUSIÓN)
     Flujo continuo (+)/(−) · tablas Excel · formas Word · GeoGebra ·
     ribbon WYSIWYG · drawer móvil ≤ 860 px
     ============================================================ */

  /* ---------- 1 · Flujo continuo de bloques ---------- */
  .idevice-card { position: relative; }

  .btn-block-minus {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 3;
    width: 26px;
    height: 26px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #fecdd3;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.92);
    color: #e11d48;
    font-size: 15px;
    font-weight: 800;
    line-height: 1;
    cursor: pointer;
    transition: background 150ms ease, transform 150ms ease, border-color 150ms ease;
  }
  .btn-block-minus:hover {
    background: #ffe4e6;
    border-color: #fda4af;
    transform: scale(1.1);
  }
  .btn-block-minus:focus-visible {
    outline: 2px solid #e11d48;
    outline-offset: 2px;
  }

  .block-inserter-row {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    margin: 2px 0;
    border-radius: 999px;
    transition: background 150ms ease;
  }
  .block-inserter-row::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: #e2e8f0;
    transition: background 150ms ease;
  }
  .block-inserter-row:hover::before { background: #99f6e4; }

  .btn-block-plus {
    position: relative;
    z-index: 1;
    width: 28px;
    height: 28px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 999px;
    background: #0d9488;
    color: #ffffff;
    font-size: 15px;
    font-weight: 800;
    line-height: 1;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(13, 148, 136, 0.25);
    transition: background 150ms ease, transform 150ms ease, box-shadow 150ms ease;
  }
  .btn-block-plus:hover {
    background: #0f766e;
    transform: scale(1.18);
    box-shadow: 0 3px 10px rgba(13, 148, 136, 0.35);
  }
  .btn-block-plus:focus-visible {
    outline: 2px solid #0f766e;
    outline-offset: 3px;
  }

  /* Menú emergente de inserción */
  .inserter-popup-dropdown {
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1050;
    min-width: 280px;
    padding: 12px;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);
  }
  .inserter-popup-dropdown[hidden] { display: none; }
  .inserter-popup-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }
  .inserter-popup-grid--tres { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .popup-inserter-item {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 9px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #ffffff;
    color: #334155;
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
  }
  .popup-inserter-item:hover {
    background: #f0fdfa;
    border-color: #14b8a6;
    color: #0f766e;
  }
  .popup-inserter-item:focus-visible {
    outline: 2px solid #0d9488;
    outline-offset: 2px;
  }

  /* ---------- 2 · Tabla dividida multicelda (Excel) ---------- */
  .excel-split-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 6px;
    table-layout: fixed;
  }
  .excel-split-table col { width: auto; }
  .cols-50-50 col:nth-child(1),
  .cols-50-50 col:nth-child(2) { width: 50%; }
  .cols-33-33-33 col { width: 33.33%; }
  .cols-70-30 col:nth-child(1) { width: 70%; }
  .cols-70-30 col:nth-child(2) { width: 30%; }
  .cols-25-75 col:nth-child(1) { width: 25%; }
  .cols-25-75 col:nth-child(2) { width: 75%; }

  .excel-layout-cell {
    min-height: 100px;
    padding: 14px;
    border: 1.5px dashed #cbd5e1;
    border-radius: 8px;
    background: #ffffff;
    vertical-align: top;
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }
  .excel-layout-cell:focus,
  .excel-layout-cell.celda-activa {
    outline: none;
    border-style: solid;
    border-color: #0d9488;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
  }
  .cell-bg-white { background: #ffffff; }
  .cell-bg-soft-blue { background: #f0f9ff; }
  .cell-bg-soft-teal { background: #f0fdfa; }
  .cell-bg-soft-amber { background: #fffbeb; }
  .cell-bg-soft-gray { background: #f8fafc; }

  .celda-props-bar {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 5px 9px;
    border: 1px solid #e2e8f0;
    border-radius: 999px;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
  }
  .celda-props-bar .color-swatch {
    width: 16px;
    height: 16px;
    padding: 0;
    border: 1px solid #cbd5e1;
    border-radius: 999px;
    cursor: pointer;
  }
  .celda-props-bar .color-swatch[data-color="white"] { background: #ffffff; }
  .celda-props-bar .color-swatch[data-color="blue"] { background: #f0f9ff; }
  .celda-props-bar .color-swatch[data-color="teal"] { background: #f0fdfa; }
  .celda-props-bar .color-swatch[data-color="amber"] { background: #fffbeb; }
  .celda-props-bar .color-swatch[data-color="gray"] { background: #f8fafc; }
  .celda-props-bar select {
    height: 26px;
    padding: 0 6px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: #ffffff;
    font-family: inherit;
    font-size: 11.5px;
    color: #475569;
  }

  .tabla-scroll-touch {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  /* ---------- 3 · Cuadros de forma y texto (Word) ---------- */
  .word-shape-box {
    padding: 18px;
    border: 2.5px solid #cbd5e1;
    border-radius: 12px;
    background: #ffffff;
    color: #1e293b;
  }
  .word-shape-box.shape-blue { border-color: #0284c7; background: #f0f9ff; color: #0c4a6e; }
  .word-shape-box.shape-teal { border-color: #0d9488; background: #f0fdfa; color: #134e4a; }
  .word-shape-box.shape-amber { border-color: #f59e0b; background: #fffbeb; color: #78350f; }
  .word-shape-box.shape-purple { border-color: #8b5cf6; background: #f5f3ff; color: #4c1d95; }
  .word-shape-box.shape-rose { border-color: #f43f5e; background: #fff1f2; color: #881337; }

  .shape-badge-meta {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-top: 12px;
    padding: 3px 10px;
    border: 1px solid currentColor;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.7);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: .04em;
    text-transform: uppercase;
    opacity: .85;
  }

  /* ---------- 4 · Marco de simulador GeoGebra ---------- */
  .geogebra-card-frame {
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  .geogebra-card-header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px 12px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }
  .geogebra-card-header input,
  .geogebra-card-header select {
    height: 28px;
    padding: 0 8px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    background: #ffffff;
    font-family: inherit;
    font-size: 11.5px;
    color: #334155;
  }
  .geogebra-card-header input:focus,
  .geogebra-card-header select:focus {
    outline: none;
    border-color: #0d9488;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
  }
  .geogebra-card-header .btn-fullscreen {
    margin-left: auto;
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    background: #ffffff;
    color: #475569;
    cursor: pointer;
  }
  .geogebra-card-header .btn-fullscreen:hover { background: #f1f5f9; color: #0f172a; }
  .geogebra-card-frame iframe {
    width: 100%;
    border: 0;
    display: block;
  }

  /* ---------- 5 · Ribbon WYSIWYG unificado ---------- */
  .top-wysiwyg-ribbon {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  }
  .top-wysiwyg-ribbon .wysiwyg-btn {
    min-width: 28px;
    height: 28px;
    padding: 0 7px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    border-radius: 6px;
    background: transparent;
    color: #334155;
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
    transition: background 150ms ease, color 150ms ease, border-color 150ms ease;
  }
  .top-wysiwyg-ribbon .wysiwyg-btn:hover {
    background: #f1f5f9;
    border-color: #e2e8f0;
    color: #0f172a;
  }
  .top-wysiwyg-ribbon .wysiwyg-btn.activo {
    background: #f0fdfa;
    border-color: #99f6e4;
    color: #0f766e;
  }
  .top-wysiwyg-ribbon .wysiwyg-btn:focus-visible {
    outline: 2px solid #0d9488;
    outline-offset: 2px;
  }
  .ribbon-divider {
    width: 1px;
    height: 20px;
    background: #e2e8f0;
    flex: 0 0 auto;
  }
  .wysiwyg-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border: 1px solid #bfdbfe;
    border-radius: 999px;
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 11px;
    font-weight: 800;
    cursor: pointer;
  }
  .wysiwyg-pill:hover { background: #dbeafe; }

  /* ---------- 6 · Drawer móvil (≤ 860 px) ---------- */
  .backdrop-mobile {
    position: fixed;
    inset: 0;
    z-index: 1090;
    background: rgba(15, 23, 42, 0.5);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .backdrop-mobile.backdrop-visible {
    opacity: 1;
    pointer-events: auto;
  }
  .btn-toggle-drawer {
    display: none;
  }

  @media (max-width: 860px) {
    .sidebar-exe {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 310px;
      min-width: 310px;
      max-width: 310px;
      z-index: 1100;
      transform: translateX(-100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
      border-right: 0;
    }
    .sidebar-exe.drawer-abierto { transform: translateX(0); }

    .btn-toggle-drawer {
      position: fixed;
      left: 16px;
      bottom: 16px;
      z-index: 1080;
      width: 44px;
      height: 44px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 999px;
      background: #0d9488;
      color: #ffffff;
      font-size: 19px;
      line-height: 1;
      cursor: pointer;
      box-shadow: 0 6px 16px rgba(13, 148, 136, 0.35);
    }
    .btn-toggle-drawer:focus-visible { outline: 2px solid #0f766e; outline-offset: 3px; }

    .top-wysiwyg-ribbon {
      width: 100%;
      flex-wrap: wrap;
      justify-content: center;
      border-radius: 8px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sidebar-exe,
    .backdrop-mobile,
    .btn-block-plus,
    .btn-block-minus { transition: none; }
  }
```

### 3. Contrato de marcado

```html
<!-- Flujo continuo -->
<div class="idevice-card">
  <button type="button" class="btn-block-minus" aria-label="Eliminar bloque">−</button>
  <div class="idevice-card-header"><div class="idevice-card-title">Lectura guiada</div></div>
  <div class="idevice-card-body">…</div>
</div>

<div class="block-inserter-row">
  <button type="button" class="btn-block-plus" aria-label="Insertar bloque">+</button>
  <div class="inserter-popup-dropdown" hidden>
    <div class="inserter-popup-grid">
      <button type="button" class="popup-inserter-item">📝 Texto</button>
      <button type="button" class="popup-inserter-item">▦ Tabla Excel</button>
    </div>
  </div>
</div>

<!-- Tabla dividida -->
<div class="tabla-scroll-touch">
  <table class="excel-split-table cols-70-30">
    <colgroup><col><col></colgroup>
    <tbody><tr>
      <td class="excel-layout-cell cell-bg-soft-teal celda-activa">Criterio</td>
      <td class="excel-layout-cell cell-bg-soft-amber">Ponderación</td>
    </tr></tbody>
  </table>
</div>

<!-- Forma Word, GeoGebra y ribbon -->
<div class="word-shape-box shape-teal">…<span class="shape-badge-meta">Forma Word: …</span></div>
<div class="geogebra-card-frame">…<iframe src="…" height="480" title="GeoGebra"></iframe></div>
<div class="top-wysiwyg-ribbon">…<span class="ribbon-divider"></span>…</div>

<!-- Móvil -->
<div class="backdrop-mobile" id="backdropExe"></div>
<button type="button" class="btn-toggle-drawer" aria-label="Abrir menú">☰</button>
```

### 4. Decisiones

1. **`.idevice-card` gana `position: relative`** para que el `(−)` se ancle a la esquina sin `!important` ni cambios de HTML.
2. **El popup se cierra con `hidden`**, no con `display:none` en línea: `.inserter-popup-dropdown[hidden] { display: none }` deja que Cursor lo alterne sin tocar estilos.
3. **El `+` vive en la línea divisoria**, no flotando: `.block-inserter-row::before` dibuja el filete y el botón lo tapa con `z-index: 1`, de modo que el trazo se interrumpe justo donde está el botón.
4. **Celdas con `border-spacing: 6px`**: da la sensación de bloques independientes sin meter `div` dentro de la tabla.
5. **El drawer móvil gana por orden de aparición.** `.sidebar-exe` ya existía desde la OLA 5; la media query reescribe ancho, posición y transform, y por estar después en el mismo archivo vence sin `!important`.
6. **`prefers-reduced-motion`** desactiva drawer, backdrop y escalas de los botones.

### 5. Verificación

| Comprobación | Resultado |
| :--- | :--- |
| Llaves CSS balanceadas | `AdminPlaneacionCSS.html` 1026/1026 |
| Render escritorio (900 px) | ✅ ribbon, `(−)`, `(+)` con popup, tabla, forma y GeoGebra |
| Render móvil (760 px) | ✅ botón ☰ visible abajo a la izquierda, ribbon centrado |
| IDs / `.gs` / JS | sin cambios |

Evidencia en `evidencia_ola17/`: `constructor_fusion.png` y `constructor_movil.png`.

### 6. Rollback

Borrar las líneas 6327–6762 o restaurar:
`C:\Users\40B\AppData\Local\Temp\st90_backup_fase5\AdminPlaneacionCSS_pre_ola17.html`

### 7. Nota sobre el centinela (sin cambios de mi parte)

Al ir a ajustar `--max-ciclos=0` encontré que `herramientas/centinela_buzon.js` ya evolucionó a **política v3** (249 líneas, tres agentes: antigravity · cursor · deepseek). Conserva la firma por bloque que portamos (`extraerBloque` + `firma`) y ya interpreta `0` como *sin tope de ciclos*, así que **no toqué el script**: habría sido una regresión. Esta entrega es solo CSS.
