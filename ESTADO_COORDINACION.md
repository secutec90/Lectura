# BITÁCORA Y CONTRATO DE TRABAJO VIVO: ORQUESTA MULTI-AGENTE (ANTIGRAVITY + DEEPSEEK + CURSOR)

**Objetivo:** Eliminar la ambigüedad, evitar sobreescritura de código y garantizar una entrega armónica sin conflictos ni errores de sincronización.
Todos los agentes leen este documento ANTES de proponer o tocar código.

---

## 1. Protocolo de Orquestación y Gobernanza (Roles Inmutables)

| Rol | Agente | Partitura y Responsabilidad Exclusiva | Qué tiene estrictamente PROHIBIDO |
| :--- | :--- | :--- | :--- |
| **Director & Auditor Técnico** | **Antigravity** | • **Gobernanza exclusiva:** Único autorizado para `git commit`, `git push` a GitHub y `clasp push / deploy` a Google Apps Script.<br>• Redactar la fase activa e IDs del DOM en este documento.<br>• Programar backend `.gs` (`LockService`, `CacheService`, endpoints `google.script.run`).<br>• Auditar el código de DeepSeek y Cursor antes de darlo por cerrado.<br>• Registrar el bloque de cierre en `CONTROL_CAMBIOS.md`. | Aprobar cambios que no respeten los selectores acordados o que carezcan de candados de concurrencia. |
| **Diseñador Visual & DUA** | **DeepSeek** | • Experiencia de usuario (UX/UI), microinteracciones y accesibilidad DUA.<br>• Archivos CSS exclusivos (`AdminPlaneacionCSS.html`, `ComunCSS.html`, `AdminCSS.html`, etc.).<br>• Tarjetas, estados visuales (`.activa`, `.aprobada`) y botones planos ST90. | Modificar funciones backend `.gs`, ejecutar comandos git/clasp o alterar IDs del DOM sin aprobación previa. |
| **Ingeniero Frontend** | **Cursor** | • Interacción del cliente, eventos click/change y manipulación del DOM.<br>• Fragmentos JS (`AdminPlanJS_*.html`, `AdminEncJS_*.html`, `AdminJS_*.html`, etc.).<br>• Conexión con `google.script.run` respetando estrictamente los IDs del contrato. | Inventar nuevas clases CSS arbitrarias, modificar archivos `.gs` de backend o ejecutar push a GitHub/Apps Script. |

### Ciclo de Entrega en 4 Tiempos:
1. **Partitura (Antigravity):** Define la fase activa en este documento con los selectores exactos del DOM y asignaciones.
2. **Ejecución en Paralelo:** DeepSeek trabaja en CSS/UI; Cursor en interacción DOM/JS; Antigravity en backend `.gs`.
3. **Auditoría de Ensamble (Antigravity):** Verifica coherencia de selectores, concurrencia, sintaxis y ausencia de colisiones.
4. **Cierre Oficial (Antigravity):** Si pasa la auditoría, Antigravity consolida el código, ejecuta el commit/push a GitHub, despliega con Clasp si corresponde, y sella el bloque en `CONTROL_CAMBIOS.md`.

---

## 2. Prompts de Arranque Rápido para Agentes

### Para DeepSeek:
> *"Actúas como Diseñador UI/UX y CSS del proyecto Suite Escolar ST90. Tu partitura está definida en `ESTADO_COORDINACION.md`. Solo tocas archivos CSS y estructura visual. Tienes estrictamente prohibido cambiar IDs del DOM o crear lógica de backend. Tu tarea asignada es la de la FASE activa. Escribe y guarda tu entrega completa y código propuesto en el archivo `ENTREGA_DEEPSEEK.md` para que Antigravity la audite."*

### Para Cursor:
> *"Actúas como Desarrollador Frontend JS del proyecto Suite Escolar ST90. Tu partitura está definida en `ESTADO_COORDINACION.md`. Solo tocas fragmentos JS del DOM y llamadas a `google.script.run`. Respeta estrictamente los IDs definidos por Antigravity y las clases de DeepSeek. Tienes prohibido hacer commit/push o alterar el backend. Escribe y guarda tu entrega completa y controladores en el archivo `ENTREGA_CURSOR.md` para que Antigravity la audite."*

---

## 3. Contrato Técnico entre Agentes (IDs y Selectores del DOM)

Para que DeepSeek y Cursor diseñen e interactúen con certeza:
- **Campos del formulario que reciben los datos (Esbozo NEM):**
  - Paso 1: `input#planTitulo` (Título)
  - Paso 2: `textarea#planPDA` (PDA oficiales/adaptados) y `textarea#planContenidoSintetico` (Contenido)
  - Paso 3: `textarea#planProblema` (Problema comunitario) y `textarea#planAjustesRazonables` (Ajustes DUA)
  - Paso 4: `textarea#planProposito` (Propósito y producto)
- **Contenedor del modal de IA donde se inyecta la vista:** `#iaPasoBox`
- **Archivos asignados:**
  - **DeepSeek:** Estilos del modal y tarjetas en `ComunCSS.html` o `AdminPlaneacionCSS.html`.
  - **Cursor:** Renderizado interactivo y controladores en `AdminPlanJS_*.html` o `ComunJS.html`.
  - **Antigravity:** Prompts y endpoints backend en `PlaneacionNEM.gs` y `09_IA.gs`.

---

## 4. Estado de Fases y Despliegues Concluidos

- **Última versión desplegada:** `@507` / código `v417`.
- **Horario contextual:** 100% saneado, una sola fila, transparente, iconos 18px.
- **Asistente en los 4 Pasos (FASE 2):** ✅ **100% CONCLUIDA y homogeneizada.** Los 4 pasos usan el sistema de casillas y selección directa sin ensayos largos.
  - *Paso 1 (Metadatos & Ejes):* Radio buttons limpios + botón `✓ Usar este Título` (`#planTitulo`).
  - *Paso 2 (Contenidos & PDA):* Casillas `.ia-check` + botón `✓ Insertar seleccionados en PDA` (`#planPDA`).
  - *Paso 3 (Diagnóstico CTE & DUA):* Dos bloques independientes `.ia-bloque` con casilla (`#planProblema` y `#planAjustesRazonables`).
  - *Paso 4 (Propósito & Producto):* Dos bloques independientes `.ia-bloque--proposito` y `.ia-bloque--producto` + botón `✓ Insertar en Propósito y Producto` (`#planProposito`).
- **Formulario Esbozo NEM (FASE 3):** ✅ **100% CONCLUIDA.** Catálogo a 2 columnas con scroll delimitado (220px), módulo de inclusión DUA/UDEI con insignias en vista Admin y botones inferiores planos ST90.
- **Editor de Sesiones Didácticas e iDevices (FASE 4):** ✅ **100% CONCLUIDA.**
  - `AdminPlaneacionCSS.html`: reglas `.nem-sesiones-tabs`, `.nem-tab-sesion` (.activa, .aprobada, .borrador), `.idevice-bar`, `.idevice-btn` (.idevice-btn--lectura, .idevice-btn--pregunta, .idevice-btn--reto) y `.nem-btn-accion--azul`.
  - `AdminPlaneacion.html`: limpiados tooltips redundantes `title`, botón `#btnCalSesion` migrado a `.nem-btn-accion--azul` (sin estilos en línea), clases semánticas aplicadas a `.idevice-btn`.
  - `AdminPlanJS_05.html` y `ClaseJS_07.html`: función `pintarTabsSesiones()` inyecta clases semánticas `.aprobada` y `.borrador`.
- **Cinta Ribbon estilo aSc Horarios 2027 e Iconos Ilustrados (FASE 5):** ✅ **100% CONCLUIDA.**
  - 31 iconos SVG monocromáticos sustituidos por ilustraciones detalladas estilo aSc Horarios 2027 en `#menuTabsPanel` y sub-cintas.
  - Estilos Ribbon en `ComunCSS.html` (degradados suaves, divisores verticales `.separador-ribbon`, tarjetas con elevación hover).
  - iDevices dinámicos serializados en `#sesGuionEstudiante` y validación de los 4 momentos antes de guardar en `AdminPlanJS_06.html`.
  - Preservación del 100% de IDs y eventos `onclick`.

---

## 5. Tarea Activa: FASE 6 (Desacoplamiento CSS y Pulido de Tarjetas iDevice)

### Objetivo y Diagnóstico Cruzado:
DeepSeek detectó en la auditoría cruzada que `.idevice-card`, `.idevice-card-audio`, `.idevice-card-pregunta` y `.idevice-card-reto` se emplean como selectores de script pero carecen de reglas en `ComunCSS.html` (solo operan con `.idevice-container`). Asimismo, `AdminPlanJS_06.html` inyecta estilos en línea (`style.cssText`) para los inputs de título y cuerpo.

### Contrato Técnico y Partitura por Agente:
1. **DeepSeek (UI & CSS):**
   - En `ComunCSS.html` (sección `BLOQUES MODULARES iDEVICES`, líneas ~1208-1270), añadir:
     - `.idevice-card`: refuerzo estructural, contenedor de bloque.
     - `.idevice-card-audio`: variante para bloques que incorporan síntesis de voz.
     - `.idevice-card-pregunta` y `.idevice-card-reto`: variantes temáticas para el visor de clase.
     - `.idevice-campo-titulo`: clase limpia con `width: 100%; box-sizing: border-box; margin-bottom: 6px; font-weight: 600; padding: 6px 8px; border: 1px solid var(--app-border); border-radius: 4px;`.
     - `.idevice-campo-cuerpo`: clase limpia con `width: 100%; box-sizing: border-box; resize: vertical; padding: 8px; border: 1px solid var(--app-border); border-radius: 4px;`.
   - Entregar el bloque exacto en `ENTREGA_DEEPSEEK.md`.

2. **Cursor (Frontend JS):**
   - En `AdminPlanJS_06.html` (dentro de `pintarTarjetaIDevice_`):
     - Sustituir `titulo.style.cssText = '...'` por `titulo.className = 'idevice-campo-titulo';`.
     - Sustituir `cuerpo.style.cssText = '...'` por `cuerpo.className = 'idevice-campo-cuerpo';`.
   - Entregar el fragmento en `ENTREGA_CURSOR.md` conservando todas las funciones adyacentes (`eliminarLegoCard_`, `conmutarVistaPlaneacion_`, etc.).

3. **Antigravity (Director & Auditor):**
   - Auditar consistencia, ejecutar `clasp push / deploy` y `git commit / push`.

