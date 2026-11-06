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
