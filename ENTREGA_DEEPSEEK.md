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
