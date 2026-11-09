# BUZÓN DE ENTREGA: CURSOR -> ANTIGRAVITY

> **INSTRUCCIÓN PARA CURSOR (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_CURSOR.md`) todo tu código JavaScript y controladores para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js cursor`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 📜 HISTORIAL RECIENTE: OLA 20 (`build-610`)
- **Estado:** Auditada e integrada en `build-610` y `build-612`.

---

## 🎯 PARTITURA ASIGNADA: OLA 21 (`build-613`) — RESOLUCIÓN DE LÓGICA FRONTEND JS: DESDUPLICACIÓN DE (+), CONTROL DE ANCHO DE PÁGINA, ACTIVACIÓN DEL ENGRANE ⚙️ Y CENTRADO DE MODALES
- **Agente responsable:** **Cursor** (Ingeniero Frontend JS & DOM)
- **Estado:** 🟢 **PROGRAMADA Y LISTA PARA EJECUCIÓN**
- **Archivos objetivo:** `AyudaJS.html`, `AdminPlanJS_05.html`, `ClaseJS_07.html`

### 📋 Requerimientos Técnicos para Cursor:

1. **Desduplicar botones (+) entre filas (Imagen 1):**
   - En `crearPlusVerde_` / `envolverRepintadoDivi_` en `AyudaJS.html`:
     - Actualmente genera `.divi-plus-row-actions` con tres botones (Regular, Fullwidth, Specialty), clonando los mismos 3 botones que ya están arriba a la derecha en la barra de lienzo.
     - **Corrección:** Simplificar el separador entre filas para que renderice un único botón divisor contextual limpio:
       ```javascript
       function crearPlusVerde_(filaRef) {
         var fila = document.createElement('div');
         fila.className = 'divi-plus-row-actions';
         fila.setAttribute('data-origen', 'divi-actions');

         var btnAddRow = document.createElement('button');
         btnAddRow.type = 'button';
         btnAddRow.className = 'btn-mini-sec btn-mini-sec-regular';
         btnAddRow.textContent = '+';
         btnAddRow.title = 'Añadir nueva fila / diseño de columnas';
         btnAddRow.setAttribute('aria-label', btnAddRow.title);
         btnAddRow.addEventListener('click', function (ev) {
           ev.preventDefault();
           ev.stopPropagation();
           window._filaPlusOrigenPopover_ = filaRef || fila;
           abrirModalLayoutDivi610_(filaRef || fila, btnAddRow);
         });

         fila.appendChild(btnAddRow);
         return fila;
       }
       ```
     - Mantener los 3 botones `.top-actions` (Azul, Morado, Naranja) exclusivamente en `.divi-canvas-topbar` para la creación de nuevas Secciones globales.

2. **Restaurar control explícito de Ancho de Página (Imagen 1 y 3):**
   - En la barra `.divi-canvas-topbar` de `montarTopbarLienzo_` (`AyudaJS.html`):
     - Restituir la etiqueta visible y clara `Página` en lugar del genérico `Ancho`:
       ```html
       <div class="control-grupo">
         <label>Página <span class="valor-ancho" id="val-ancho-lienzo">100%</span></label>
         <input type="range" id="slider-ancho-lienzo" min="40" max="100" value="100" oninput="ajustarAnchoLienzo(this.value)">
       </div>
       ```
     - Asegurar que `ajustarAnchoLienzo(valor)` actualice el contenedor del lienzo (`#contenedorIDevicesDinamicos` / `#lienzoExeActivo`) y preserve compatibilidad con `window.ajustarAnchoPagina` y `window.ajustarAnchoSeccion`.

3. **Activar el engrane ⚙️ (`.btn-ctrl-props` y `.toolbar-flotante`) (Imagen 4):**
   - En `htmlControlesDivi_()`, el botón de engrane se genera como:
     `<button type="button" class="btn-ctrl-props" title="Propiedades de diseño y color" aria-label="Propiedades">⚙️</button>`
   - En `instalarEventosDivi603_()` e `instalarEventos610_()`, **agregar el listener correspondiente**:
     ```javascript
     var btnProps = t.closest('.btn-ctrl-props, button[title*="Propiedades"], button[aria-label*="Propiedades"]');
     if (btnProps) {
       ev.preventDefault();
       ev.stopPropagation();
       abrirPropiedades(btnProps);
       return;
     }
     ```
   - En `abrirPropiedades(btn)`:
     - Identificar el elemento padre usando `nodoDeToolbar_(btn)` o `nodoControladoDivi_(btn)`, soportando `.divi-section`, `.divi-row` e `.idevice-card`.
     - Abrir el modal `#modal-propiedades` precargado con los estilos actuales del elemento (`data-bg-color`, `data-text-color`, `data-text-align`).
     - Al hacer clic en "Aplicar Cambios" (`guardarPropiedades()`):
       - Aplicar los colores y alineación en vivo sobre el elemento activo.
       - Disparar `guardarEstado()` y marcar cambios para guardado con `marcarIDevicesTocados_()`.
       - Cerrar `#modal-propiedades`.

4. **Garantizar centrado y no distorsión de modales:**
   - En `posicionarDialogEnVista610_(dialogEl)`:
     ```javascript
     function posicionarDialogEnVista610_(dialogEl) {
       if (!dialogEl) return;
       dialogEl.style.margin = 'auto';
       dialogEl.style.position = 'relative';
       dialogEl.style.top = '';
       dialogEl.style.left = '';
     }
     ```
   - Evitar calcular coordenadas `getBoundingClientRect()` absolutas que anclen el diálogo al botón pulsado; el selector de 20 retículas `#modal-overlay` y las propiedades `#modal-propiedades` deben centrarse siempre en el viewport.

---

## ✅ ENTREGA CURSOR — OLA 21 (build-613)

**Estado:** Implementado en `AyudaJS.html` (listo para auditoría Antigravity). `AdminPlanJS_05.html` y `ClaseJS_07.html` no requieren cambios en esta ola (CSS y colapso lateral los cubre DeepSeek).

### Resumen de cambios JS (`AyudaJS.html`)

| Punto | Función / selector | Cambio |
| :--- | :--- | :--- |
| 1 | `crearPlusVerde_(filaRef)` | Un solo `+` en `.divi-plus-row-actions`; abre `abrirModalLayoutDivi610_`. La terna azul/morada/naranja queda solo en `.divi-canvas-topbar .top-actions`. |
| 2 | `asegurarTopbar610_()` | Etiqueta **Página** en `#val-ancho-lienzo` / `#slider-ancho-lienzo` (`data-build="613"`). Aliases `window.ajustarAnchoPagina` y `window.ajustarAnchoSeccion` → `ajustarAnchoLienzo`. |
| 3 | `instalarEventosDivi603_`, `instalarEventos610_` | Delegación click en `.btn-ctrl-props` y botones con título/aria *Propiedades* → `abrirPropiedades`. |
| 3 | `htmlToolbar_`, `abrirPropiedades` | Clase `.btn-ctrl-props` en el engrane flotante; fallback `nodoControladoDivi_(btn)` si `nodoDeToolbar_` no resuelve. |
| 4 | `posicionarDialogEnVista610_` | Solo `margin: auto`, `position: relative`, sin anclaje `getBoundingClientRect` (llamadas sin segundo argumento). |

### Fragmentos normativos (referencia de integración)

```javascript
function crearPlusVerde_(filaRef) {
  var fila = document.createElement('div');
  fila.className = 'divi-plus-row-actions';
  fila.setAttribute('data-origen', 'divi-actions');
  var btnAddRow = document.createElement('button');
  btnAddRow.type = 'button';
  btnAddRow.className = 'btn-mini-sec btn-mini-sec-regular';
  btnAddRow.textContent = '+';
  btnAddRow.title = 'Añadir nueva fila / diseño de columnas';
  btnAddRow.setAttribute('aria-label', btnAddRow.title);
  btnAddRow.addEventListener('click', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();
    window._filaPlusOrigenPopover_ = filaRef || fila;
    abrirModalLayoutDivi610_(filaRef || fila, btnAddRow);
  });
  fila.appendChild(btnAddRow);
  return fila;
}

function posicionarDialogEnVista610_(dialogEl) {
  if (!dialogEl) return;
  dialogEl.style.margin = 'auto';
  dialogEl.style.position = 'relative';
  dialogEl.style.top = '';
  dialogEl.style.left = '';
}

// En delegación click (603 y 610):
var btnProps = t.closest('.btn-ctrl-props, button[title*="Propiedades"], button[aria-label*="Propiedades"]');
if (btnProps) {
  ev.preventDefault();
  ev.stopPropagation();
  abrirPropiedades(btnProps);
  return;
}
```

### Commit sugerido (Conventional Commits)

`fix(constructor): desduplica insertores, etiqueta pagina, engrane y modales centrados (build-613)`
