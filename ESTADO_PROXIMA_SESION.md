# 📌 ESTADO DE RELEVO Y CONTINUACIÓN DE SESIÓN — SUITE ESCOLAR ST90
**Fecha de corte:** 2026-11-01  
**Versión activa en producción:** `@567` (`v418 · build-567`)  
**Rama Git:** `main` (Sincronizada con GitHub — commit `20e7e03`)  
**Base de datos:** Google Sheets ID `1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU` (Planeaciones y sesiones íntegras)

---

## 🧭 Directiva para los 3 Agentes (Antigravity, Cursor, DeepSeek) al Iniciar Mañana

> **DIRECTIVA OBLIGATORIA (CERO PREGUNTAS REDUNDANTES AL USUARIO):**  
> No le pidas al usuario que repita contexto ni que copie/pegue código manualmente en el chat.  
> Lee este documento, `ESTADO_COORDINACION.md` y tus buzones `ENTREGA_CURSOR.md` o `ENTREGA_DEEPSEEK.md`.  
> Continúa directamente en el punto exacto de las **Etapas 3 y 4: Diagnóstico CTE/DUA, Propósito, Lista de Cotejo / Rúbrica Editable e Integración con el Formato PDF Oficial de Nuevo León**.

---

## 1. Dónde nos quedamos (Hitos Concluidos de `@562` a `@567`)

1. **Desaturación Visual UI/UX y Reparación Íntegra del Avatar (`build-563` / `build-564`):**
   - Retrato circular 3D completo de **Lucy · Asesora Pedagógica NEM** (`AVATAR_ASESOR_NEM_B64_` en `AyudaJS.html`, `6,864` chars base64 íntegros).
   - Eliminación de los 8 iconos `❓ ✨` internos en las pestañas `#tabPasoPlan1..4` y de las bocinas duplicadas en los `<label>`.
   - Banner `#bannerClaseNEM` limpio en formato cinta editorial sin cajas recargadas.
   - Barra de progreso en el Stepper (`25% · 50% · 75% · 100%`) con estado `.completado` (`✓`) y autoguardado de borrador en `localStorage` (`st90_borrador_plan_nem`).
2. **Alineación Geométrica en Etapa 1 y Etapa 2 (`build-565`):**
   - Los 4 campos de la Etapa 1 (`Título del Proyecto *`, `Campo Formativo * 🔒`, `Metodología *`, `Sesiones (40m) *`) quedaron organizados en **una sola fila horizontal** (`.nem-fila-una`).
   - En la Etapa 2 (`Catálogo Dinámico de Contenidos y PDA Oficiales`), las dos listas desplegables (`#selContenidoSinteticoNEM` y `#selPDANEM`) quedaron alineadas a la misma altura (`38px`) y con idéntico formato visual sin contenedores anidados.
3. **Regla Normativa SEP Fase 6, Asesora "Lucy" y Voz Femenina (`build-566`):**
   - Selector `#planCampoFormativo` bloqueado por norma (`disabled = true` con candado `🔒`) para seleccionarse automáticamente según cada asignatura de secundaria sin permitir cambios erróneos.
   - Asesora pedagógica nombrada oficialmente **Lucy** (`Lucy · Asesora Pedagógica NEM`) con selector ponderado de voz femenina en español (`elegirVozFemeninaEspanol_` en `AyudaJS.html`).
4. **Directorio de Encuestas, Tooltip Único, Serialización de Sesiones y PDF Oficial Nuevo León (`build-567`):**
   - **Directorio de encuestas (`15_DirectorioEncuentas.gs` y `AdminPlanJS_02.html`):** Catálogo institucional base (`_catalogoEncuestasBaseST90_`) con diagnósticos y resúmenes IA para todas las asignaturas (`Tecnología 1° T1`, `Español`, `Matemáticas`, `Ciencias`, `Geografía`, `Historia`, `FCyE`), preselección automática en `#dirSelect` y vista inmediata del resumen con botón `📋 Insertar en la planeación`.
   - **Tooltip único en siglas DUA / UDEI / BAPyC:** Eliminado el atributo nativo `title` en los elementos con `data-tip`, evitando el doble tooltip.
   - **Fix `"No se encontró la planeación"` (`PlaneacionNEM.gs`, `AdminPlanJS_05.html`, `ClaseJS_07.html`):** Conversión de objetos `Date` a cadena ISO y `JSON.parse(JSON.stringify(...))` en `obtenerPlaneacionCompletaNEM` más respaldo en memoria desde `listaPlanNEM`.
   - **📄 Plano Didáctico en Formato PDF Oficial de Nuevo León (`AyudaJS.html`):** Vista previa e impresión/descarga PDF con los 2 escudos oficiales de Nuevo León (`NL Educación` y `Gobierno del Nuevo Nuevo León`), tabla de datos generales a 2 columnas, cronograma de sesiones (4 momentos DUA de 40 min), lista de cotejo formativa y firmas institucionales (`Docente Titular` y `Visto Bueno Dirección / Subdirección`).
5. **Protocolo Centinela (Polling cada 60s):**
   - Creado `herramientas/centinela_buzon.js` y documentado en `AGENTS.md` y `_PLANTILLA_PROYECTO_NUEVO` para revisión continua de buzones.

---

## 2. Plan de Trabajo para Mañana: ETAPAS 3 Y 4 + LISTA DE COTEJO / RÚBRICA EDITABLE Y MEJORAS AL PDF OFICIAL

Para cerrar el ciclo completo del asistente paso a paso (Wizard NEM) y enriquecer el documento PDF oficial de Nuevo León:

### Contrato Técnico Inmutable de Selectores (Etapas 3 y 4):
- **Etapa 3 (`#etapaPlanNEM_3`):**
  - Selector de problemática CTE: `select#selProblemaEscolar`
  - Situación-problema comunitaria: `textarea#planProblema`
  - Caja de inclusión DUA / UDEI / BAPyC: `div#secInclusionBAPyC` y `textarea#planAjustesRazonables`
  - Botón de directorio de encuestas: `abrirBancoEncuestas_()`
- **Etapa 4 (`#etapaPlanNEM_4`):**
  - Propósito formativo y producto final: `textarea#planProposito`
  - Botón de sugerencia integral IA: `button#btnSugerirProyectoIA`
  - **Nuevo bloque de Criterios de Evaluación / Lista de Cotejo Editable:** `div#cajaRubricaCotejoNEM` (con hasta 5 criterios editables que alimentan directamente la tabla `LISTA DE COTEJO` del PDF Oficial de Nuevo León).
  - Vista previa y descarga PDF Oficial: `abrirVistaPreviaPDFPlaneacionNEM()`

---

### 🎯 Tareas Asignadas por Agente para la Sesión de Mañana:

| Agente | Responsabilidad Inmediata | Archivo / Buzón |
| :--- | :--- | :--- |
| **Cursor** *(Lógica Frontend DOM)* | 1. **Asistente IA en Etapa 3 (Diagnóstico & DUA):** Conectar sugerencias rápidas de ajustes razonables DUA según el grupo y las BAPyC detectadas para insertarlas con 1 clic en `#planAjustesRazonables`.<br>2. **Editor Interactivo de Lista de Cotejo / Rúbrica en Etapa 4 (`#cajaRubricaCotejoNEM`):** Permitir al docente personalizar de 3 a 5 criterios de evaluación formativa (con botón `+ Agregar criterio` y `×` para quitar) o autogenerarlos desde los PDA seleccionados.<br>3. **Conexión con el PDF Oficial NL:** Pasar los criterios personalizados de `#cajaRubricaCotejoNEM` al generador `_generarHtmlDocumentoPlanoDidacticoNL_` en `AyudaJS.html`.<br>4. **Modo Centinela (60s):** Al terminar, ejecutar `node herramientas/centinela_buzon.js cursor`. | [ENTREGA_CURSOR.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/ENTREGA_CURSOR.md)<br>[AdminPlanJS_04.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/AdminPlanJS_04.html)<br>[AyudaJS.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/AyudaJS.html) |
| **DeepSeek** *(Diseño UI/UX)* | 1. **Tabla / Tarjetas Editables de Lista de Cotejo (`#cajaRubricaCotejoNEM`):** Diseñar en `AdminPlaneacionCSS.html` un componente compacto, limpio y moderno para editar los criterios de evaluación formativa (`Sí ✓ | En proceso | No todavía`) en la Etapa 4 sin saturar la pantalla.<br>2. **Refinamiento Visual de Vista Previa PDF (`#modalVistaPreviaPDFOficialNL`):** Estilos de hoja tipo papel tamaño Carta con sombra editorial en pantalla y reglas `@media print` limpias.<br>3. **Modo Centinela (60s):** Al terminar, ejecutar `node herramientas/centinela_buzon.js deepseek`. | [ENTREGA_DEEPSEEK.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/ENTREGA_DEEPSEEK.md)<br>[AdminPlaneacionCSS.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/AdminPlaneacionCSS.html)<br>[ComunCSS.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/ComunCSS.html) |
| **Antigravity** *(Backend & QA)* | 1. **Persistencia de Criterios de Evaluación y Producto Final:** Asegurar en `PlaneacionNEM.gs` que los criterios personalizados y ajustes DUA se guarden y recuperen íntegramente en Google Sheets.<br>2. **Exportación y Desglose de Sesiones IA con Fechas Reales del Horario:** Vincular las fechas programadas del horario del docente a la columna `FECHA / SESIÓN` del Plano Didáctico PDF.<br>3. **Auditoría & Despliegue:** Validar con `node herramientas/manifiesto.js`, compilar `build-568`, desplegar `@568` en los 5 endpoints de `clasp` y sincronizar con GitHub. | [PlaneacionNEM.gs](file:///g:/Mi%20unidad/PROYECTOS/Lectura/PlaneacionNEM.gs)<br>[CONTROL_CAMBIOS.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/CONTROL_CAMBIOS.md)<br>[avances.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/avances.md) |

---

## 3. Checklist de Arranque Mañana

1. **Cursor** lee [ENTREGA_CURSOR.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/ENTREGA_CURSOR.md) y desarrolla la lógica interactiva de Etapa 3/4 y Lista de Cotejo editable.
2. **DeepSeek** lee [ENTREGA_DEEPSEEK.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/ENTREGA_DEEPSEEK.md) y entrega los estilos CSS del editor de criterios y hoja PDF.
3. **Antigravity** audita ambos buzones, integra con `PlaneacionNEM.gs`, valida con `node herramientas/manifiesto.js` y despliega `@568`.
