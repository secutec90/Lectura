# BUZÓN DE ENTREGA: CURSOR -> ANTIGRAVITY

> **INSTRUCCIÓN PARA CURSOR (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_CURSOR.md`) todo tu código JavaScript y controladores para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js cursor`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: OLA 17 (`build-603+`) — CONTROLADORES DIVI REAL, BUBBLE TOOLBAR NOTION Y SIDEBAR COLAPSABLE
- **Estado:** 🟢 PROGRAMADA (PARTITURA ASIGNADA — EJECUTAR AHORA)
- **Archivos objetivo:** `AyudaJS.html`, `ClaseJS_08.html`, `AdminPlanJS_06.html`
- **Misión de Cursor:** Implementar los controladores JavaScript del constructor: erradicación de la barra fija superior del lienzo, motor de la pastilla flotante contextual (*Bubble Toolbar*) mediante `selectionchange`, selector de columnas verdes `(+)`, dropzone de columna activa (`.active-target`), inyección modular desde el catálogo lateral de las 7 familias, alternancia del menú lateral colapsable (`alternarSidebarExe_`), y reordenamiento vertical (▲ / ▼).

---

### 📋 Especificaciones Técnicas y Funcionales para Cursor:

#### 1. Erradicación de la Barra Superior Fija y Creación de la Bubble Toolbar
- **Lienzo 100% Despejado:**
  - Asegurar que no se inyecte ninguna barra fija horizontal `.editor-master-toolbar` o `.clean-wysiwyg-toolbar` sobre el lienzo `#lienzoExeActivo`.
- **Motor de Pastilla Flotante Contextual (`#bubbleToolbar`):**
  - Inyectar el contenedor `#bubbleToolbar` en el DOM si no existe, con botones: Bold, Italic, Underline, H3, Lista con viñetas y Enlace.
  - Cada botón debe llevar `onmousedown="event.preventDefault();"` para no perder la selección del texto.
  - Listener global `document.addEventListener('selectionchange', ...)`:
    - Si no hay selección o está colapsada (`sel.isCollapsed`), retirar la clase `.visible`.
    - Si la selección reside dentro de un área con clase `.rich-editable-area` o `[contenteditable="true"]`:
      - Extraer coordenadas con `range.getBoundingClientRect()`.
      - Relacionar contra el contenedor canvas (`#lienzoExeActivo` o `.canvas-exe`) y su `scrollTop`.
      - Posicionar la pastilla centrada justo encima del texto resaltado y añadir la clase `.visible`.

#### 2. Colapso y Expansión del Menú Lateral (`alternarSidebarExe_`)
- **Controlador `alternarSidebarExe_()`:**
  - Alterna la clase `.sidebar-colapsado` en `#vistaAutorExe` (o `.app-workspace`).
  - Actualiza el botón de conmutación `.btn-toggle-sidebar-exe`:
    - Abierto: Icono `◀` y título "Colapsar menú lateral (Modo pantalla completa)".
    - Colapsado: Icono `▶` y título "Expandir menú de contenidos".
  - Disparar `window.dispatchEvent(new Event('resize'))` para refrescar cualquier iframe o canvas.
  - Si el usuario hace clic en `[+ Añadir Módulo]` en una columna mientras el menú está colapsado, el sidebar debe expandirse automáticamente para permitir elegir el contenido.

#### 3. Fila Divi Verde `(+)` y Selector de Columnas
- **Fila Divisora Verde (`.btn-plus-green`):**
  - Entre filas DIVI se inserta una fila divisoria con el botón verde circular `(+)`.
  - Al hacer clic en `.btn-plus-green`, abre el menú flotante `.divi-columns-picker` (cerrando cualquier otro menú abierto).
  - Opciones de columnas:
    - `1 Columna [100%]` (`col-1`)
    - `2 Columnas [50 / 50]` (`col-2`)
    - `2 Columnas [70 / 30]` (`col-2-70-30`)
    - `3 Columnas [33 / 33 / 33]` (`col-3`)
  - Al seleccionar una distribución, se invoca `insertarFilaDivi_(distribucion, filaRef)` generando la estructura de columnas con sus respectivos dropzones `.divi-column`.

#### 4. Dropzone de Columna Activa (`.active-target`) y Conexión con el Catálogo Lateral
- **Columna Activa (`activarColumnaObjetivo_(columnaDiv)`):**
  - Cada columna `.divi-column` contiene un botón `[+ Añadir Módulo]` (`.btn-add-module-inside`).
  - Al pulsarlo, retira `.active-target` de cualquier otra columna y se lo asigna a la columna seleccionada.
  - Almacena la columna en `window._columnaObjetivoActiva_`.
  - Si el sidebar está colapsado, ejecuta `alternarSidebarExe_(false)` para abrirlo.
- **Inyección Modular desde el Catálogo Lateral:**
  - Modificar el handler de adición del catálogo (`insertariDeviceSesion_` / items del catálogo de las 7 familias):
    - Si existe `window._columnaObjetivoActiva_` y está en el DOM, inyecta la tarjeta del módulo dentro de esa columna.
    - **Fallback Inteligente:** Si no hay columna activa, busca la última columna `.divi-column` del lienzo; si no hay ninguna fila o columna, genera automáticamente una fila de 1 columna e inserta el bloque ahí. ¡Ningún clic docente debe perderse!

#### 5. Reordenamiento Vertical (▲ / ▼) y Eliminación con Buffer Deshacer
- **Movimiento de Elementos (`moverElementoDOM_(el, direccion)`):**
  - Botón `▲` (`direccion === -1`): si existe `el.previousElementSibling`, ejecuta `el.parentNode.insertBefore(el, el.previousElementSibling)`.
  - Botón `▼` (`direccion === 1`): si existe `el.nextElementSibling`, ejecuta `el.parentNode.insertBefore(el, el.nextElementSibling.nextElementSibling)`.
  - Funciona tanto para Secciones, Filas y Módulos.
- **Eliminación y Deshacer:**
  - Botón `✕`: guarda el elemento en `window.ultimoBloqueEliminado_` y muestra la pastilla `#pastillaDeshacerBloque` con temporizador de 5 segundos.

---

### 📦 ENTREGA DE CURSOR (ESCRIBE TU CÓDIGO JAVASCRIPT AQUÍ ABAJO):
*(Cursor escribirá aquí su bloque JavaScript completo con los controladores del flujo Divi, la pastilla flotante, el sidebar colapsable y los controles de movimiento)*
