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

- **Última versión desplegada:** `@562` / código `v417 · build-562` (Asesora Pedagógica NEM ilustrada en reemplazo del robot `🤖`, Asistente de Voz DUA con Web Speech API `🔊`/`🎙️`, botón interactivo `✨ Sugerir con IA` y chips `[➕ Usar este título]` con inserción reactiva en 1 clic en `#planTitulo`). Integridad confirmada de las 14 planeaciones en Google Sheets y HTTP 200 verificado en vivo en los 5 despliegues de producción.
- **Fila 1 (Etapa 1 - NEM Fase 6):** Desbloqueada la autonomía docente en Metodología y Campo Formativo. Reglas normativas SEP documentadas.
- **Horario contextual:** 100% saneado, una sola fila, transparente, iconos 18px.
- **Asistente en los 4 Pasos (FASE 2):** ✅ **100% CONCLUIDA y homogeneizada.** Los 4 pasos usan el sistema de casillas y selección directa sin ensayos largos.
- **Formulario Esbozo NEM (FASE 3):** ✅ **100% CONCLUIDA.** Catálogo a 2 columnas con scroll delimitado (220px), módulo de inclusión DUA/UDEI con insignias en vista Admin y botones inferiores planos ST90.
- **Editor de Sesiones Didácticas e iDevices (FASE 4):** ✅ **100% CONCLUIDA.**

---

## 5. Tarea Activa para la Siguiente Sesión: ETAPA 2 (CONTENIDOS SINTÉTICOS Y PDA) + PROBLEMÁTICA COMUNITARIA

La orquesta se concentra en la experiencia pedagógica de la **Etapa 2 (Contenidos & PDA)** y su articulación comunitaria:

### Partitura y Contrato Técnico Inmutable:
- **Campos del formulario (Etapa 2):**
  - Contenido Sintético: `textarea#planContenidoSintetico`
  - Procesos de Desarrollo de Aprendizaje: `textarea#planPDA`
  - Insignia de conteo: `#badgeContadorPDA`
  - Selector de Trimestre curricular: `#selTrimestrePDA` (T1, T2, T3)
- **Asignaciones para la siguiente sesión (Mañana):**
  | Agente | Responsabilidad Inmediata | Buzón / Archivo |
  | :--- | :--- | :--- |
  | **DeepSeek** *(Diseño UI/UX)* | Maquetar el catálogo interactivo de Contenidos Sintéticos en acordeón/tarjetas, tags de colores por Campo Formativo (Lenguajes: Azul, Saberes: Morado, Ética: Naranja, De lo Humano: Verde) y microinteracciones de selección de PDA. | `ENTREGA_DEEPSEEK.md`<br>`AdminPlaneacionCSS.html`<br>`ComunCSS.html` |
  | **Cursor** *(Lógica Frontend DOM)* | Programar la sincronización reactiva de Contenidos Sintéticos y PDA según la Asignatura y Grado de Etapa 1, filtrado por trimestre (T1/T2/T3), checkboxes interactivos para anexar PDA a `#planPDA` con 1 clic, y conexión del botón "✨ Sugerir con IA" para PDA DUA. | `ENTREGA_CURSOR.md`<br>`AdminPlanJS_03.html`<br>`AyudaJS.html` |
  | **Antigravity** *(Backend, QA & Despliegue)* | Asegurar los catálogos curriculares oficiales SEP Fase 6 en `PlaneacionNEM.gs`, endpoint de guardado integral de PDA seleccionados en Google Sheets, auditoría multiagente, compilación a `build-563` y despliegue a producción. | `PlaneacionNEM.gs`<br>`CONTROL_CAMBIOS.md`<br>`avances.md` |


