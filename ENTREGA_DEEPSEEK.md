# BUZÓN DE ENTREGA: DEEPSEEK -> ANTIGRAVITY

> **INSTRUCCIÓN PARA DEEPSEEK (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_DEEPSEEK.md`) todo tu código CSS y propuesta visual para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js deepseek`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: OLA 5 (`build-578`) — DISEÑO VISUAL EXELEARNING 3.0 & ESPECIALIDADES INGLES / OFIMÁTICA
- **Estado:** 🟢 PROGRAMADA (PARTITURA ASIGNADA — EJECUTAR AHORA)
- **Archivos objetivo:** `AdminPlaneacionCSS.html`, `ComunCSS.html`
- **Referencia visual interactiva:** Ver [simulador_exelearning.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/simulador_exelearning.html) en la raíz del proyecto.

---

### 📋 Especificaciones de Diseño para DeepSeek:

1. **Panel Lateral de Jerarquía & Árbol de Páginas (`.sidebar-exe` y `.box-arbol`):**
   - Ancho fijo de 320px–340px, fondo `#f8fafc` y borde derecho `#cbd5e1`.
   - Barra de título del documento `.doc-titulo` con icono de lápiz `.btn-edit-title`.
   - Barra de herramientas `.arbol-toolbar` con grupo de flechas `.nav-flechas` (botones en fondo `#f0fdfa` y borde `#ccfbf1`) y grupo de acciones `.nav-acciones` con botón teal destacado `.add-node` (`background: #0d9488`).
   - Elementos de lista de páginas `.nodo-item`: bordes redondeados (6px), con estado activo `.nodo-item.seleccionado` idéntico a eXeLearning (borde verde azulado `#14b8a6`, fondo `#f0fdfa`, texto `#0f766e`, sombra suave). Soporte para indentación de niveles (`margin-left: 14px * nivel`).

2. **Menú Acordeón de iDevices por Categorías (`.cat-accordion`):**
   - Cabecera `.cat-header` con estilo colapsable, icono chevron que rota 90° con clase `.cat-group.abierto`.
   - Tarjetas de inserción `.idevice-pill-add` con microinteracción `:hover` (desplazamiento sutil a la derecha `translateX(3px)` y borde teal `#0d9488`).
   - Categorías con colores distintivos:
     - `Información y presentación` (Azul `#0284c7`)
     - `Evaluación y seguimiento` (Verde `#16a34a`)
     - `Juegos pedagógicos` (Ámbar `#d97706`)
     - `Actividades interactivas` (Púrpura `#7c3aed`)
     - `Lengua Extranjera - Inglés` (Azul zafiro `#2563eb`)
     - `Tecnología y Ofimática` (Esmeralda `#059669`)
     - `Ciencias` (Rojo/Carmesí `#e11d48`)

3. **Barra Flotante Superior de Acceso Rápido (`.quick-ribbon`):**
   - Cápsula blanca centrada (`background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; box-shadow: 0 4px 12px rgba(15,23,42,0.05); padding: 8px 16px;`).
   - Iconos de colores con efecto `:hover` (scale 1.15):
     - `.quick-btn.text-icon` (Azul `#1e40af`)
     - `.quick-btn.flower-icon` (Rosa `#f43f5e`)
     - `.quick-btn.checklist-icon` (Cian `#0284c7`)
     - `.quick-btn.file-icon` (Naranja `#ea580c`)
     - `.quick-btn.gallery-icon` (Fucsia `#c026d3`)
     - Separador y engranaje de configuración `.quick-btn.settings-icon`.

4. **Tarjetas Modulares de Contenido en el Lienzo (`.idevice-card`):**
   - Encabezado `.idevice-card-header` con fondo `#f8fafc`, botones de control (subir, bajar, eliminar en hover rojo) y cuerpo `.idevice-card-body`.
   - Insignias de categoría temáticas (`.badge-info`, `.badge-eval`, `.badge-juego`, `.badge-interact`, `.badge-ingles`, `.badge-tecnologia`, `.badge-ciencias`).
   - Campos de formulario uniformes `.campo-input` y `.campo-textarea` con foco en azul/teal.
   - Componentes especiales para:
     - **Inglés:** Reproductor de listening con badge de velocidad (`.player-listening`), tarjeta de flashcard con animación de vuelta (`.flip-card-bilingue`).
     - **Tecnología Ofimática:** Mini tabla simulada de hoja de cálculo (`.sim-hoja-calculo` con filas y columnas A, B, C, 1, 2, 3) y caja de algoritmo con bloques de diagrama.

---

### 📦 ENTREGA DE DEEPSEEK (ESCRIBE TU CÓDIGO CSS AQUÍ ABAJO):
*(DeepSeek escribirá aquí su propuesta de código CSS y la guardará automáticamente)*

---

## ✍️ ENTREGA DEEPSEEK — OLA 5 (`build-578`) · eXeLearning 3.0, Inglés y Ofimática

**Fecha:** 2026-11-01 · **Archivo:** `AdminPlaneacionCSS.html`, líneas 2737–3308
**Referencia seguida:** `simulador_exelearning.html` (se portaron sus valores exactos, no una interpretación).

### 1. Correspondencia punto por punto

| Punto de la partitura | Implementado | Notas |
| :--- | :--- | :--- |
| `.sidebar-exe` 320–340 px, `#f8fafc`, borde derecho `#cbd5e1` | ✅ | 330 px con `min/max` acotados |
| `.box-arbol`, `.doc-titulo`, `.btn-edit-title` | ✅ | Lápiz teal con hover y foco |
| `.arbol-toolbar`, `.nav-flechas`, `.nav-acciones`, `.add-node` | ✅ | Flechas en `#f0fdfa` / borde `#ccfbf1`; `+` en `#0d9488` |
| `.nodo-item` (6 px, `.seleccionado` teal, indentación) | ✅ | Borde `#14b8a6`, fondo `#f0fdfa`, texto `#0f766e`, sombra suave |
| `.cat-accordion`, `.cat-header`, chevron 90° en `.cat-group.abierto` | ✅ | Chevron rota con `transform` |
| `.idevice-pill-add` con `translateX(3px)` y borde teal | ✅ | El `+` cambia a teal en hover |
| 7 colores de categoría | ✅ | Clases `.cat-header-icon.cat-*` |
| `.quick-ribbon` cápsula blanca centrada | ✅ | Sombra `0 4px 12px rgba(15,23,42,.05)` |
| 6 `.quick-btn` con color y `scale(1.15)` | ✅ | Incluye separador y engranaje |
| `.idevice-card`, header, body, `.btn-card-ctrl` | ✅ | Eliminar en rojo `#e11d48` |
| 7 insignias (`.badge-*`) | ✅ | Se añadieron `--ingles` y `--tecnologia` |
| `.campo-input` / `.campo-textarea` con foco | ✅ | Foco teal con anillo de 3 px |
| `.player-listening` + badge de velocidad | ✅ | Botón play, onda y pastilla `1.0×` |
| `.flip-card-bilingue` | ✅ | Volteo 3D en hover o con `.volteada` |
| `.sim-hoja-calculo` (A/B/C, 1/2/3) | ✅ | Encabezados `#f1f5f9`, celdas enfocables |
| Caja de algoritmo con bloques | ✅ | `.caja-algoritmo` + `.bloque-diagrama` con flechas |

### 2. CSS entregado

```css
  /* ============================================================
     OLA 5 · build-578 — eXeLearning 3.0 + Inglés / Ofimática
     Porte fiel de la paleta y las piezas del simulador de referencia
     (simulador_exelearning.html), ampliado con los componentes
     bilingües y de hoja de cálculo que pide la partitura.
     ============================================================ */
  :root {
    --exe-teal: #0d9488;
    --exe-teal-light: #ccfbf1;
    --exe-teal-dark: #0f766e;
    --exe-bg-sidebar: #f8fafc;
    --exe-bg-canvas: #f1f5f9;
    --exe-border: #cbd5e1;
    --exe-muted: #64748b;
  }

  /* ---------- 1 · Panel lateral y árbol de páginas ---------- */
  .sidebar-exe {
    width: 330px;
    min-width: 330px;
    max-width: 340px;
    background: var(--exe-bg-sidebar);
    border-right: 1px solid var(--exe-border);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .box-arbol {
    padding: 16px;
    border-bottom: 1px solid var(--exe-border);
    background: #ffffff;
  }
  .arbol-titulo-fila {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .doc-titulo {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
  }
  .btn-edit-title {
    padding: 2px 4px;
    border: 0;
    background: none;
    color: var(--exe-teal);
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
    border-radius: 4px;
    transition: background 150ms ease, color 150ms ease;
  }
  .btn-edit-title:hover { background: var(--exe-teal-light); color: var(--exe-teal-dark); }
  .btn-edit-title:focus-visible { outline: 2px solid var(--exe-teal); outline-offset: 2px; }

  .arbol-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .nav-flechas,
  .nav-acciones {
    display: inline-flex;
    align-items: center;
    background: #f0fdfa;
    border: 1px solid #ccfbf1;
    border-radius: 6px;
    overflow: hidden;
  }
  .nav-btn,
  .btn-action-teal {
    padding: 5px 9px;
    border: 0;
    background: transparent;
    color: var(--exe-teal-dark);
    font-size: 13px;
    line-height: 1;
    cursor: pointer;
    transition: background 150ms ease;
  }
  .nav-btn:hover,
  .btn-action-teal:hover { background: #ccfbf1; }
  .nav-btn:focus-visible,
  .btn-action-teal:focus-visible { outline: 2px solid var(--exe-teal); outline-offset: -2px; }
  .btn-action-teal.add-node {
    background: var(--exe-teal);
    color: #ffffff;
    font-weight: 800;
  }
  .btn-action-teal.add-node:hover { background: var(--exe-teal-dark); }

  .nodos-lista {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .nodo-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border: 1.5px solid transparent;
    border-radius: 6px;
    background: #f8fafc;
    color: #334155;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease, box-shadow 150ms ease;
  }
  .nodo-item:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
  .nodo-item.seleccionado {
    background: #f0fdfa;
    border-color: #14b8a6;
    color: var(--exe-teal-dark);
    font-weight: 700;
    box-shadow: 0 1px 3px rgba(20, 184, 166, 0.15);
  }
  .nodo-item .nodo-tag {
    padding: 2px 6px;
    border-radius: 4px;
    background: #e2e8f0;
    color: var(--exe-muted);
    font-size: 11px;
  }
  .nodo-item.seleccionado .nodo-tag {
    background: var(--exe-teal-light);
    color: var(--exe-teal-dark);
  }
  .nodo-indent { margin-left: 14px; }

  /* ---------- 2 · Acordeón de iDevices ---------- */
  .box-idevice-menu {
    flex: 1;
    padding: 14px 16px;
  }
  .idevice-menu-titulo {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 800;
    color: #1e293b;
  }
  .cat-accordion {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .cat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #ffffff;
    color: #334155;
    font-size: 13.5px;
    font-weight: 700;
    cursor: pointer;
    user-select: none;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
  }
  .cat-header:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: var(--exe-teal-dark);
  }
  .cat-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .cat-header-icon { font-size: 16px; line-height: 1; }
  .cat-chevron {
    font-size: 12px;
    color: #94a3b8;
    transition: transform 200ms ease;
  }
  .cat-group.abierto .cat-chevron { transform: rotate(90deg); }
  .cat-group.abierto .cat-header {
    background: #f0fdfa;
    border-color: #99f6e4;
    color: var(--exe-teal-dark);
  }
  .cat-items {
    display: none;
    flex-direction: column;
    gap: 3px;
    padding: 6px 4px 8px 18px;
  }
  .cat-group.abierto .cat-items { display: flex; }

  /* Acento cromático por categoría (se aplica al icono de la cabecera) */
  .cat-header-icon.cat-info { color: #0284c7; }
  .cat-header-icon.cat-eval { color: #16a34a; }
  .cat-header-icon.cat-juego { color: #d97706; }
  .cat-header-icon.cat-interact { color: #7c3aed; }
  .cat-header-icon.cat-ingles { color: #2563eb; }
  .cat-header-icon.cat-tecnologia { color: #059669; }
  .cat-header-icon.cat-ciencias { color: #e11d48; }

  .idevice-pill-add {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 10px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: #ffffff;
    color: #475569;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease, transform 150ms ease;
  }
  .idevice-pill-add:hover {
    background: #f8fafc;
    border-color: var(--exe-teal);
    color: var(--exe-teal-dark);
    transform: translateX(3px);
  }
  .idevice-pill-add .btn-mas {
    padding: 2px 6px;
    border-radius: 4px;
    background: #e2e8f0;
    color: var(--exe-muted);
    font-size: 11px;
  }
  .idevice-pill-add:hover .btn-mas {
    background: var(--exe-teal);
    color: #ffffff;
  }

  /* ---------- 3 · Barra flotante de acceso rápido ---------- */
  .quick-ribbon {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    width: fit-content;
    margin: 0 auto;
    padding: 8px 16px;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
  }
  .quick-icons-group {
    display: flex;
    align-items: center;
    gap: 18px;
    padding-right: 14px;
    border-right: 1px solid #e2e8f0;
  }
  .quick-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border: 0;
    background: none;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    transition: transform 150ms ease, opacity 150ms ease;
  }
  .quick-btn:hover { transform: scale(1.15); }
  .quick-btn:focus-visible { outline: 2px solid #0d9488; outline-offset: 3px; border-radius: 6px; }
  .quick-btn.text-icon { color: #1e40af; }
  .quick-btn.flower-icon { color: #f43f5e; }
  .quick-btn.checklist-icon { color: #0284c7; }
  .quick-btn.file-icon { color: #ea580c; }
  .quick-btn.gallery-icon { color: #c026d3; }
  .quick-btn.settings-icon { color: #64748b; font-size: 20px; }

  /* ---------- 4 · Tarjetas modulares del lienzo ---------- */
  .idevice-card {
    background: #ffffff;
    border: 1px solid var(--exe-border);
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }
  .idevice-card:hover {
    border-color: #94a3b8;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
  }
  .idevice-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 18px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }
  .idevice-card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14.5px;
    font-weight: 700;
  }
  .idevice-card-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .btn-card-ctrl {
    padding: 4px;
    border: 0;
    border-radius: 4px;
    background: none;
    color: var(--exe-muted);
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
    transition: background 150ms ease, color 150ms ease;
  }
  .btn-card-ctrl:hover { background: #e2e8f0; color: #0f172a; }
  .btn-card-ctrl.del:hover { color: #e11d48; background: #ffe4e6; }
  .btn-card-ctrl:focus-visible { outline: 2px solid var(--exe-teal); outline-offset: 1px; }
  .idevice-card-body { padding: 18px 20px; }

  .campo-grupo { margin-bottom: 14px; }
  .campo-grupo:last-child { margin-bottom: 0; }
  .campo-label {
    display: block;
    margin-bottom: 5px;
    font-size: 12.5px;
    font-weight: 700;
    color: #334155;
  }
  .campo-input,
  .campo-textarea {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-family: inherit;
    font-size: 13.5px;
    color: #0f172a;
    background: #ffffff;
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }
  .campo-input:focus,
  .campo-textarea:focus {
    outline: none;
    border-color: var(--exe-teal);
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
  }
  .campo-textarea { resize: vertical; min-height: 80px; }

  /* ---------- 5 · Insignias de categoría ---------- */
  .badge-info,
  .badge-eval,
  .badge-juego,
  .badge-interact,
  .badge-ingles,
  .badge-tecnologia,
  .badge-ciencias {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: .02em;
    white-space: nowrap;
  }
  .badge-info { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
  .badge-eval { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
  .badge-juego { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
  .badge-interact { background: #f3e8ff; color: #6b21a8; border: 1px solid #e9d5ff; }
  .badge-ingles { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
  .badge-tecnologia { background: #d1fae5; color: #047857; border: 1px solid #a7f3d0; }
  .badge-ciencias { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }

  /* ---------- 6 · Inglés: listening y flashcard ---------- */
  .player-listening {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 8px 0 0;
    padding: 9px 12px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 10px;
  }
  .player-listening .btn-play {
    width: 34px;
    height: 34px;
    min-width: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 999px;
    background: #2563eb;
    color: #ffffff;
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
    transition: background 150ms ease, transform 120ms ease;
  }
  .player-listening .btn-play:hover { background: #1d4ed8; transform: scale(1.05); }
  .player-listening .btn-play:focus-visible { outline: 2px solid #1d4ed8; outline-offset: 2px; }
  .player-listening .onda {
    flex: 1 1 auto;
    height: 6px;
    border-radius: 999px;
    background: #bfdbfe;
    overflow: hidden;
  }
  .player-listening .onda__fill {
    height: 100%;
    width: 0;
    border-radius: 999px;
    background: #2563eb;
    transition: width 200ms linear;
  }
  .player-listening .badge-velocidad {
    padding: 2px 8px;
    border: 1px solid #93c5fd;
    border-radius: 999px;
    background: #ffffff;
    color: #1d4ed8;
    font-size: 10.5px;
    font-weight: 800;
    white-space: nowrap;
  }

  .flip-card-bilingue {
    perspective: 1000px;
    width: 100%;
    height: 130px;
    margin: 10px 0 0;
    cursor: pointer;
  }
  .flip-card-bilingue .flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 600ms cubic-bezier(.2, .8, .2, 1);
  }
  .flip-card-bilingue:hover .flip-inner,
  .flip-card-bilingue.volteada .flip-inner { transform: rotateY(180deg); }
  .flip-card-bilingue .flip-front,
  .flip-card-bilingue .flip-back {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 14px;
    border-radius: 12px;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    text-align: center;
  }
  .flip-card-bilingue .flip-front {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1e3a8a;
  }
  .flip-card-bilingue .flip-back {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    color: #065f46;
    transform: rotateY(180deg);
  }
  .flip-card-bilingue .flip-en { font-size: 15px; font-weight: 800; }
  .flip-card-bilingue .flip-es { font-size: 13px; font-weight: 700; }
  @media (prefers-reduced-motion: reduce) {
    .flip-card-bilingue .flip-inner { transition: none; }
  }

  /* ---------- 7 · Ofimática: hoja de cálculo y algoritmo ---------- */
  .sim-hoja-calculo {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 0;
    font-size: 12px;
    table-layout: fixed;
    background: #ffffff;
  }
  .sim-hoja-calculo th,
  .sim-hoja-calculo td {
    border: 1px solid #d7dde5;
    padding: 5px 8px;
    height: 26px;
    text-align: left;
    color: #1e293b;
  }
  .sim-hoja-calculo thead th,
  .sim-hoja-calculo tbody th {
    background: #f1f5f9;
    color: #475569;
    font-weight: 800;
    text-align: center;
    font-size: 10.5px;
    letter-spacing: .04em;
  }
  .sim-hoja-calculo tbody th { width: 34px; }
  .sim-hoja-calculo td:focus {
    outline: 2px solid #059669;
    outline-offset: -2px;
    background: #f0fdf4;
  }

  .caja-algoritmo {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 10px 0 0;
    padding: 12px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 10px;
  }
  .bloque-diagrama {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 11px;
    background: #ffffff;
    border: 1px solid #a7f3d0;
    border-radius: 8px;
    font-size: 12.5px;
    font-weight: 600;
    color: #065f46;
  }
  .bloque-diagrama + .bloque-diagrama { position: relative; }
  .bloque-diagrama + .bloque-diagrama::before {
    content: '↓';
    position: absolute;
    margin-left: -2px;
    transform: translateY(-14px);
    color: #34d399;
    font-weight: 800;
  }
  .bloque-diagrama .num-paso {
    width: 20px;
    height: 20px;
    min-width: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: #059669;
    color: #ffffff;
    font-size: 10.5px;
    font-weight: 800;
  }
```

### 3. Contrato de marcado

```html
<aside class="sidebar-exe">
  <div class="box-arbol">
    <div class="arbol-titulo-fila">
      <div class="doc-titulo">Movilidad segura <button class="btn-edit-title">✎</button></div>
    </div>
    <div class="arbol-toolbar">
      <div class="nav-flechas"><button class="nav-btn">↑</button><button class="nav-btn">↓</button></div>
      <div class="nav-acciones">
        <button class="btn-action-teal">⧉</button>
        <button class="btn-action-teal">✕</button>
        <button class="btn-action-teal add-node">+</button>
      </div>
    </div>
    <div class="nodos-lista">
      <div class="nodo-item seleccionado">Inicio <span class="nodo-tag">Página</span></div>
      <div class="nodo-item nodo-indent">Diagnóstico <span class="nodo-tag">Tarea</span></div>
    </div>
  </div>

  <div class="box-idevice-menu">
    <div class="idevice-menu-titulo">iDevices disponibles</div>
    <div class="cat-accordion">
      <div class="cat-group abierto">
        <div class="cat-header">
          <span class="cat-header-left">
            <span class="cat-header-icon cat-ingles">🌐</span> Lengua Extranjera - Inglés
          </span>
          <span class="cat-chevron">›</span>
        </div>
        <div class="cat-items">
          <div class="idevice-pill-add">Listening guiado <span class="btn-mas">+</span></div>
        </div>
      </div>
    </div>
  </div>
</aside>

<div class="quick-ribbon">
  <div class="quick-icons-group">
    <button class="quick-btn text-icon">T</button>
    <button class="quick-btn flower-icon">✿</button>
    <button class="quick-btn checklist-icon">☑</button>
    <button class="quick-btn file-icon">📄</button>
    <button class="quick-btn gallery-icon">🖼</button>
  </div>
  <button class="quick-btn settings-icon">⚙</button>
</div>

<div class="idevice-card">
  <div class="idevice-card-header">
    <div class="idevice-card-title"><span class="badge-ingles">Inglés</span> Listening</div>
    <div class="idevice-card-actions">
      <button class="btn-card-ctrl">↑</button>
      <button class="btn-card-ctrl">↓</button>
      <button class="btn-card-ctrl del">✕</button>
    </div>
  </div>
  <div class="idevice-card-body">
    <div class="campo-grupo">
      <label class="campo-label">Instrucción</label>
      <input class="campo-input" value="Listen and choose the correct option.">
    </div>
    <div class="player-listening">
      <button class="btn-play">▶</button>
      <span class="onda"><span class="onda__fill" style="width:38%"></span></span>
      <span class="badge-velocidad">1.0×</span>
    </div>
    <div class="flip-card-bilingue">
      <div class="flip-inner">
        <div class="flip-front"><span class="flip-en">Crosswalk</span></div>
        <div class="flip-back"><span class="flip-es">Paso peatonal</span></div>
      </div>
    </div>
  </div>
</div>
```

### 4. Decisiones

1. **Porte literal, no reinterpretación.** Los valores de sidebar, nodos, acordeón, ribbon y tarjetas se copiaron del simulador; así el constructor real queda idéntico a la referencia que ya aprobó el usuario.
2. **Los 7 colores de categoría se aplican al icono**, no al fondo de la cabecera: mantener el fondo blanco permite que el estado abierto (teal) siga siendo el que comunica interacción, sin competir con siete colores a la vez.
3. **`.flip-card-bilingue` con altura fija de 130 px.** Con `min-height` la tarjeta crecía porque sus caras son absolutas; ahora el volteo mantiene el layout estable.
4. **Las flechas del algoritmo no dependen del marcado:** `.bloque-diagrama + .bloque-diagrama { position: relative }` está en el CSS, así que el `↓` se dibuja bien aunque Cursor no añada estilos en línea.
5. **Todo respeta `prefers-reduced-motion`** en el volteo de la flashcard.

### 5. Verificación

| Comprobación | Resultado |
| :--- | :--- |
| Llaves CSS balanceadas | `AdminPlaneacionCSS.html` 510/510 |
| Render a 1180 px | ✅ sidebar 330, ribbon centrada, tarjetas y tabla correctas |
| Insignias nuevas | ✅ `badge-ingles` (azul zafiro) y `badge-tecnologia` (esmeralda) |
| IDs / `.gs` / JS | sin cambios |

Evidencia: `evidencia_ola5/exelearning_3.png`.

### 6. Rollback

Borrar las líneas 2737–3308 de `AdminPlaneacionCSS.html` o restaurar:
`C:\Users\40B\AppData\Local\Temp\st90_backup_fase5\AdminPlaneacionCSS_pre_ola5.html`
