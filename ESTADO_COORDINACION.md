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

---

## 2. Prompts de Arranque Rápido para Agentes

### Para DeepSeek:
> *"Actúas como Diseñador UI/UX y CSS del proyecto Suite Escolar ST90. Tu partitura está definida en `ESTADO_COORDINACION.md`. Solo tocas archivos CSS y estructura visual. Tienes estrictamente prohibido cambiar IDs del DOM o crear lógica de backend. Tu tarea asignada es la de la FASE activa. Escribe y guarda tu entrega completa y código propuesto en el archivo `ENTREGA_DEEPSEEK.md` para que Antigravity la audite, e inmediatamente después ejecuta `node herramientas/centinela_buzon.js deepseek` para revisar cada 60 segundos si Antigravity cargó una nueva tarea."*

### Para Cursor:
> *"Actúas como Desarrollador Frontend JS del proyecto Suite Escolar ST90. Tu partitura está definida en `ESTADO_COORDINACION.md`. Solo tocas fragmentos JS del DOM y llamadas a `google.script.run`. Respeta estrictamente los IDs definidos por Antigravity y las clases de DeepSeek. Tienes prohibido hacer commit/push o alterar el backend. Escribe y guarda tu entrega completa y controladores en el archivo `ENTREGA_CURSOR.md` para que Antigravity la audite, e inmediatamente después ejecuta `node herramientas/centinela_buzon.js cursor` para revisar cada 60 segundos si Antigravity cargó una nueva tarea."*

---

## 3. Contrato Técnico entre Agentes (IDs y Selectores del DOM)

- **Campos del formulario que reciben los datos (Wizard NEM de 4 Etapas):**
  - **Etapa 1 (`#etapaPlanNEM_1`):** `input#planTitulo`, `select#planCampoFormativo` (bloqueado `🔒` por norma SEP según asignatura), `select#planMetodologia`, `input#planNumSesiones` (organizados en una sola fila `.nem-fila-una`).
  - **Etapa 2 (`#etapaPlanNEM_2`):** `select#selContenidoSinteticoNEM`, `select#selPDANEM`, `textarea#planContenidoSintetico`, `textarea#planPDA`, `#badgeConteoPDAs`.
  - **Etapa 3 (`#etapaPlanNEM_3`):** `select#selProblemaEscolar`, `textarea#planProblema`, `#secInclusionBAPyC`, `textarea#planAjustesRazonables`, modal `📊 Directorio de encuestas` (`#dirSelect`, `#dirDetalle`).
  - **Etapa 4 (`#etapaPlanNEM_4`):** `textarea#planProposito`, `#btnSugerirProyectoIA`, `#cajaRubricaCotejoNEM` (Lista de Cotejo / Rúbrica editable) y vista previa PDF Oficial NL (`#modalVistaPreviaPDFOficialNL`).

---

## 4. Estado de Fases y Despliegues Concluidos

- **Última versión desplegada:** `@567` / código `v418 · build-567` (sincronizada en los 5 endpoints de Google Apps Script y rama `main` de GitHub, commit `20e7e03`).
- **Etapa 1 y Etapa 2 (Desaturación UI/UX + Regla Normativa SEP + Lucy Asesora con Voz Femenina):** ✅ **100% CONCLUIDA.**
- **Directorio de Encuestas Institucional + Tooltip Único DUA/UDEI/BAPyC + Serialización de Sesiones:** ✅ **100% CONCLUIDA.**
- **Formato PDF Oficial de Nuevo León (`PLANO DIDÁCTICO`):** ✅ **100% OPERATIVO** desde las tarjetas del Banco de Planeaciones, desde el Paso 4 y desde el editor de Sesiones.

---

## 5. Tarea Programada para Mañana: ETAPAS 3 Y 4 — AJUSTES DUA CON 1 CLIC, LISTA DE COTEJO EDITABLE E INTEGRACIÓN AL PDF OFICIAL NL (`build-568`)

| Agente | Responsabilidad Inmediata | Buzón / Archivo |
| :--- | :--- | :--- |
| **Cursor** *(Lógica Frontend DOM)* | 1. **Chips Rápidos de Ajustes Razonables DUA en Etapa 3 (`#secInclusionBAPyC`):** Botones de 1 clic (`+ Macrotipo / Alto Contraste`, `+ Audio y Lectura Guiada`, `+ Tiempos Flexibles y Pausas Activas`, `+ Trabajo en Parejas Tutoras`) que agregan viñetas a `#planAjustesRazonables`.<br>2. **Lista de Cotejo Editable en Etapa 4 (`#cajaRubricaCotejoNEM`):** Tabla interactiva de 3 a 5 criterios de evaluación formativa con botón `+ Agregar criterio`, botón `✨ Sugerir criterios desde PDA` y eliminación por fila (`×`), conectada en vivo con `_generarHtmlDocumentoPlanoDidacticoNL_()` para el PDF Oficial de Nuevo León.<br>3. Al finalizar, ejecutar `node herramientas/centinela_buzon.js cursor`. | `ENTREGA_CURSOR.md`<br>`AdminPlanJS_04.html`<br>`AyudaJS.html` |
| **DeepSeek** *(Diseño UI/UX & CSS)* | 1. **Estilos para `#cajaRubricaCotejoNEM` y `.nem-tabla-cotejo-edit`:** Diseño limpio y compacto para la tabla editable de criterios de evaluación en Etapa 4 y los chips de ajustes DUA (`.nem-chip-dua-rapido`) en Etapa 3.<br>2. **Estilos de Hoja Carta en `#modalVistaPreviaPDFOficialNL`:** Sombra editorial en vista previa y reglas `@media print` para impresión multipágina impecable.<br>3. Al finalizar, ejecutar `node herramientas/centinela_buzon.js deepseek`. | `ENTREGA_DEEPSEEK.md`<br>`AdminPlaneacionCSS.html`<br>`ComunCSS.html` |
| **Antigravity** *(Backend, PDF & QA)* | 1. **Persistencia y Fechas Reales de Sesiones en PDF:** Vincular las fechas reales del horario docente al cronograma del Plano Didáctico PDF y persistir criterios personalizados en `PlaneacionNEM.gs`.<br>2. **Auditoría & Despliegue:** Integrar entregas de Cursor y DeepSeek, validar con `node herramientas/manifiesto.js` y desplegar `build-568` (`@568`). | `PlaneacionNEM.gs`<br>`AyudaJS.html`<br>`CONTROL_CAMBIOS.md` |
