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
> *"Actúas como Diseñador UI/UX y CSS del proyecto Suite Escolar ST90. Tu partitura está definida en `ESTADO_COORDINACION.md`. Solo tocas archivos CSS y estructura visual. Tienes estrictamente prohibido cambiar IDs del DOM o crear lógica de backend. Tu tarea asignada es la de la FASE activa. Escribe y guarda tu entrega completa y código propuesto en el archivo `ENTREGA_DEEPSEEK.md` para que Antigravity la audite, e inmediatamente después ejecuta `node herramientas/centinela_buzon.js deepseek` para revisar cada 60 segundos si Antigravity cargó una nueva tarea."*

### Para Cursor:
> *"Actúas como Desarrollador Frontend JS del proyecto Suite Escolar ST90. Tu partitura está definida en `ESTADO_COORDINACION.md`. Solo tocas fragmentos JS del DOM y llamadas a `google.script.run`. Respeta estrictamente los IDs definidos por Antigravity y las clases de DeepSeek. Tienes prohibido hacer commit/push o alterar el backend. Escribe y guarda tu entrega completa y controladores en el archivo `ENTREGA_CURSOR.md` para que Antigravity la audite, e inmediatamente después ejecuta `node herramientas/centinela_buzon.js cursor` para revisar cada 60 segundos si Antigravity cargó una nueva tarea."*

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

- **Última versión desplegada:** `@562` / código `v417 · build-562` (Asesora Pedagógica NEM ilustrada en reemplazo del robot `🤖`, Asistente de Voz DUA con Web Speech API `🔊`/`🎙️`, botón interactivo `✨ Sugerir con IA` y chips `[➕ Usar este título]` con inserción reactiva en 1 clic en `#planTitulo`). Integridad confirmada de las 14 planeaciones en Google Sheets y HTTP 200 verificado en vivo en los 5 despliegues de producción.
- **Fila 1 (Etapa 1 - NEM Fase 6):** Desbloqueada la autonomía docente en Metodología y Campo Formativo. Reglas normativas SEP documentadas.
- **Horario contextual:** 100% saneado, una sola fila, transparente, iconos 18px.
- **Asistente en los 4 Pasos (FASE 2):** ✅ **100% CONCLUIDA y homogeneizada.** Los 4 pasos usan el sistema de casillas y selección directa sin ensayos largos.
- **Formulario Esbozo NEM (FASE 3):** ✅ **100% CONCLUIDA.** Catálogo a 2 columnas con scroll delimitado (220px), módulo de inclusión DUA/UDEI con insignias en vista Admin y botones inferiores planos ST90.
- **Editor de Sesiones Didácticas e iDevices (FASE 4):** ✅ **100% CONCLUIDA.**

---

## 5. Tarea Activa: DESATURACIÓN VISUAL UI/UX (ETAPA 1 & 2) + CORRECCIÓN DE AVATAR + CONTENIDOS & PDA

### Diagnóstico de Saturación Visual y Correcciones Inmediatas:
1. **Avatar truncado en mitad inferior (`AVATAR_ASESOR_NEM_B64_`):** La cadena base64 JPEG sufrió corrupción de bytes en su mitad inferior. **Antigravity** regenerará e inyectará vía buffer binario directo un avatar PNG/JPEG 100% íntegro con encuadre centrado superior (`object-fit: cover; object-position: center 20%`).
2. **Eliminación de contaminación de micro-iconos (`❓`, `🔊`, `✨` repetidos):**
   - **Quitar los iconos `❓` y `✨` de adentro de las 4 pestañas del Stepper** (`#tabPasoPlan1..4`), dejando solo el número y título del paso (más el check `✓` cuando esté completo).
   - **Quitar los botones sueltos de bocina `🔊` (`.btn-voz-nem`) de todas las etiquetas `<label>`** del formulario. La lectura en voz alta `🔊` se mantiene únicamente **adentro** del modal `#modalAyudaNEM` y en las respuestas del drawer de la Asesora IA.
   - Reemplazar el signo de interrogación rojo estridente `❓` por un icono `(?)` monocromático sutil (`#94a3b8`, hover `#2563eb`) y reubicar `✨ Sugerir con IA` como acción limpia alineada a la derecha del label o integrada en el input.
3. **Simplificación del Banner `#bannerClaseNEM` (Cero "cajitas" saturadas):**
   - Quitar las 5 píldoras blancas con borde alrededor de la fecha, hora, trimestre y docente; mostrarlas como metadatos en texto limpio separado por puntos (`•`).
4. **Reorganización Respirable de la Etapa 1 (`#etapaPlanNEM_1`):**
   - En lugar de apretar 4 campos en una sola fila (que rompe el label de `Sesiones (40m)` en dos líneas), distribuir en una **rejilla limpia de 2 filas**:
     - **Fila A:** `Título del Proyecto` (75% ancho) + `Sesiones (40m)` (25% ancho).
     - **Fila B:** `Campo Formativo` (50% ancho) + `Metodología` (50% ancho).

### Partitura y Reparto de Tareas por Agente:
| Agente | Responsabilidad Inmediata | Buzón / Archivo |
| :--- | :--- | :--- |
| **DeepSeek** *(Diseño UI/UX & Desaturación CSS)* | 1. **Desaturar `#bannerClaseNEM`:** Eliminar bordes/fondos de caja en cada metadato; dejar una barra limpia y plana.<br>2. **Rejilla Respirable en `.nem-fila-una`:** Pasar de 4 columnas apretadas a layout 2×2 (`3fr 1fr` arriba para Título y Sesiones; `1fr 1fr` abajo para Campo y Metodología).<br>3. **Limpieza de `.btn-ayuda-nem` y Stepper:** Icono `(?)` neutro sin color rojo estridente, ocultar `.btn-voz-nem` fuera del modal, y estilizar el Stepper `#tabPasoPlan1..4` limpio con estado `.completado` (`✓`) y barra de progreso.<br>4. **Tarjetas de Etapa 2:** Grid `.card-contenido-nem` y badges por Campo Formativo.<br>5. Al finalizar, ejecutar `node herramientas/centinela_buzon.js deepseek`. | `ENTREGA_DEEPSEEK.md`<br>`AdminPlaneacionCSS.html`<br>`ComunCSS.html` |
| **Cursor** *(Lógica Frontend DOM)* | 1. **Dejar de inyectar `🔊` (`.btn-voz-nem`) en los `<label>` del formulario:** Modificar `AyudaJS.html` para que el botón de voz solo se renderice dentro de `#modalAyudaNEM` y en las burbujas del drawer `#drawerAsistenteIA`, nunca al lado de cada `<label>`.<br>2. **Limpiar pestañas del Stepper:** Asegurar que `#tabPasoPlan1..4` no tengan iconos `❓ ✨` incrustados y muestren solo número, nombre de etapa y check `✓` al completarse.<br>3. **Etapa 2 (Contenidos & PDA) + Autoguardado `localStorage`:** Sincronización de Contenidos Sintéticos SEP, filtrado de PDA por trimestre, contador `#badgeContadorPDA` y respaldo automático en `localStorage`.<br>4. Al finalizar, ejecutar `node herramientas/centinela_buzon.js cursor`. | `ENTREGA_CURSOR.md`<br>`AyudaJS.html`<br>`AdminPlanJS_03.html` |
| **Antigravity** *(Backend, Avatar & QA)* | 1. **Reparar `AVATAR_ASESOR_NEM_B64_`:** Generar e inyectar imagen base64 100% íntegra (sin corrupción en la mitad inferior) en `AyudaJS.html`.<br>2. **Limpiar HTML base en `AdminPlaneacion.html`:** Retirar los `<span>` de `❓` y `✨` incrustados dentro de `#tabPasoPlan1..4`.<br>3. **Catálogo SEP Fase 6 & Despliegue:** Asegurar endpoints en `PlaneacionNEM.gs`, auditar entregas de DeepSeek y Cursor, y desplegar `build-563`. | `AyudaJS.html`<br>`AdminPlaneacion.html`<br>`PlaneacionNEM.gs` |


