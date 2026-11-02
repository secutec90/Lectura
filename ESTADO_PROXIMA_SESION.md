# 📌 ESTADO DE RELEVO Y PLAN MAESTRO EN 4 OLAS — SUITE ESCOLAR ST90
**Fecha de corte:** 2026-11-01  
**Versión activa en producción:** `@567` (`v418 · build-567`)  
**Rama Git:** `main` (Sincronizada con GitHub — commit `49928bb`)  
**Base de datos:** Google Sheets ID `1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU` (Planeaciones y sesiones íntegras)

---

## 🧭 Directiva para los 3 Agentes (Antigravity, Cursor, DeepSeek)

> **DIRECTIVA OBLIGATORIA (CERO PREGUNTAS REDUNDANTES AL USUARIO):**  
> No le pidas al usuario que repita contexto ni que copie/pegue código manualmente en el chat.  
> Lee este documento, `ESTADO_COORDINACION.md` y tus buzones `ENTREGA_CURSOR.md` o `ENTREGA_DEEPSEEK.md`.  
> Ejecuta las **4 Olas de Implementación (`build-568` a `build-571`)** en orden secuencial, depositando tus entregas en tu buzón y activando el centinela (`node herramientas/centinela_buzon.js`).

---

## 1. Hitos Concluidos en Producción (`build-563` a `build-567` / `@567`)

1. **Avatar 3D Íntegro, Identidad de "Lucy" y Voz Femenina (`build-563` / `build-566`):**
   - Retrato circular 3D completo de **Lucy · Asesora Pedagógica NEM** (`AVATAR_ASESOR_NEM_B64_` en `AyudaJS.html`) y selector ponderado de voz femenina en español (`elegirVozFemeninaEspanol_`).
2. **Desaturación Visual y Regla Normativa SEP Fase 6 (`build-564` / `build-565` / `build-566`):**
   - Etapa 1 en una sola fila (`.nem-fila-una`) con `#planCampoFormativo` bloqueado por norma (`disabled = true` con candado `🔒`).
   - Etapa 2 con listas `#selContenidoSinteticoNEM` y `#selPDANEM` alineadas a `38px` sin contenedores anidados.
3. **Directorio de Encuestas, Tooltip Único y PDF Oficial Nuevo León (`build-567`):**
   - Catálogo base `_catalogoEncuestasBaseST90_()` en `15_DirectorioEncuentas.gs`.
   - Eliminación del atributo nativo `title` en elementos `[data-tip]` para evitar doble tooltip.
   - Serialización segura de fechas en `obtenerPlaneacionCompletaNEM` (`PlaneacionNEM.gs`) y vista previa/descarga del **Plano Didáctico en Formato PDF Oficial de Nuevo León** (`abrirVistaPreviaPDFPlaneacionNEM` en `AyudaJS.html`).

---

## 2. Plan Maestro de Implementación Consolidado (`build-568` a `build-571`)

### 🚀 Ola 1 (`build-568`): Etapas 3 y 4 + Membrete Institucional Configurable + Lista de Cotejo y Rúbrica Analítica en PDF Oficial NL
- **Backend (`PlaneacionNEM.gs`):** `obtenerMembreteInstitucionalNEM()` y `guardarMembreteInstitucionalNEM(token, payload)` en `PropertiesService` (`ST90_CFG_LOGO_IZQ`, `ST90_CFG_LOGO_DER`, `ST90_CFG_ENC_L1..L3`), manteniendo los escudos oficiales de Nuevo León (`LOGO_NL_EDUCACION_B64_` y `LOGO_NL_GOBIERNO_B64_`) como valores por defecto, más persistencia de `criteriosEvaluacion` y `rubricaAnalitica` y fechas reales del horario docente.
- **Frontend (`AdminPlanJS_04.html`, `ClaseJS_06.html`, `AyudaJS.html`):**
  - Modal `#modalConfigMembreteST90` (`⚙️ Membrete Oficial`).
  - 4 Chips rápidos DUA (`.nem-chip-dua-rapido`) en Etapa 3 (`#secInclusionBAPyC`) que insertan ajustes razonables con 1 clic en `#planAjustesRazonables`.
  - Editor interactivo `#cajaRubricaCotejoNEM` en Etapa 4 con `3 a 5` criterios (`✨ Generar desde PDA`, `+ Agregar criterio`, `✕`) y generador automático de **Rúbrica Analítica de 4 Niveles** (`Sobresaliente 10`, `Satisfactorio 8-9`, `Básico 6-7`, `Requiere Apoyo 5`), sincronizado en vivo con `_generarHtmlDocumentoPlanoDidacticoNL_()`.
- **Diseño CSS (`AdminPlaneacionCSS.html`, `ComunCSS.html`):** Estilos para `.nem-chip-dua-rapido`, `.nem-tabla-cotejo-edit`, `#modalConfigMembreteST90` y tablas de Lista de Cotejo + Rúbrica Analítica en `@media print`.

### 🚀 Ola 2 (`build-569`): Constructor de Clases (eXeLearning ST90) + iDevice Encuesta Diagnóstica / Actividad Evaluable
- **Backend (`15_DirectorioEncuentas.gs` / `PlaneacionNEM.gs`):** `obtenerCatalogoEncuestasParaConstructor(token, filtros)` y `registrarEntregaEncuestaAlumno(tokenAlumno, payload)` (vinculado a `EntregasActividades` por `Matricula`, `IdClase`, `IdActividad` y `Calificacion`).
- **Frontend (`AdminPlanJS_05.html`, `ClaseJS_07.html`):** Botón `📊 Encuesta / Diagnóstico` en `.idevice-bar` (`insertariDeviceSesion_('encuesta')`) con conmutador de 2 modos:
  - `datos_previos`: Inserta resumen ejecutivo IA de la encuesta diagnóstica y gráfica comparativa en la sesión.
  - `actividad_activa`: Asigna la encuesta como actividad ponderada (`inp-ponderacion-encuesta`) con registro vinculado a matrícula o anónimo.
- **Diseño CSS (`AdminPlaneacionCSS.html`):** Estilos para `.idevice-bloque[data-tipo="encuesta"]`, `.panel-modo-datos` y `.panel-modo-actividad`.

### 🚀 Ola 3 (`build-570`): Evolución Dual del Constructor (Encuestas Diagnósticas & Quiz Evaluable)
- **Compatibilidad de Base de Datos (`Encuestas.gs`):** Conserva intactas las 11 columnas de `Formulario`; almacena metadatos de evaluación en la columna 11 (`extra` JSON: `esQuiz`, `puntos`, `respuestaCorrecta`, `retroalimentacion`, `aleatorizarOpciones`) y en `Configuracion` (`tipoFormulario`, `puntosTotales`, `intentosPermitidos`, `mostrarRetroalimentacion`).
- **Motor de Auto-Calificación (`Encuestas.gs`):** `calificarQuizAlumnoST90(payload)` evalúa `unica`, `sino`, `multiple`, `numero` y `texto`, calcula la calificación en escala `5–10` / `0–10` y guarda en `Respuestas`.
- **Frontend & CSS (`AdminEncuestas.html`, `AdminEncJS_*.html`, `AdminCSS.html`):** Switch `.constructor-modo-switch` (`📊 Encuesta / Diagnóstico` vs `📝 Quiz Evaluativo`), barra `#barraConfigQuizGlobal` y panel por reactivo `.caja-ajustes-quiz`.

### 🚀 Ola 4 (`build-571` — Sprints 1, 2 y 3): Capacidades Avanzadas Tipo Google Forms
- **Sprint 1:** Soporte multimedia por reactivo (`media: { tipo, url, pie }` con `figure.reactivo-media` y lightbox) + retroalimentación diferenciada (`acierto` / `fallo`).
- **Sprint 2:** Pregunta de carga de evidencia a Drive (`subirEvidenciaFormulario` hacia `/ST90_EVIDENCIAS/{Grado}_{Grupo}/{IdFormulario}`) + secciones paginadas (`secciones[]`, `.barra-progreso-nem`).
- **Sprint 3:** Temporizador de examen (`temporizadorMinutos` con persistencia en `sessionStorage` y auto-envío) + barajado Fisher-Yates de preguntas y opciones.
