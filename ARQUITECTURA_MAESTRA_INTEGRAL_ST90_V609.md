# ARQUITECTURA_MAESTRA_INTEGRAL_ST90_V609.md
**Documento Maestro de Gobernanza, Auditoría de Deuda Técnica y Plan de Implementación**
*Proyecto:* Suite Escolar ST90 — Escuela Secundaria Técnica No. 90 "Don José Calderón Ayala"
*Entorno:* Google Apps Script (GAS) / HTML Service / Google Sheets DB / Drive API / clasp
*Destinatario:* Antigravity (Director & Auditor Técnico)

---

## 1. GOBERNANZA MULTI-AGENTE Y CONTROL DE INTEGRIDAD (ESTADO_COORDINACION.md)

### 1.1 Matriz Inmutable de Roles
* **Antigravity (Director & Auditor Técnico — PC):**
  * Gobernanza exclusiva del repositorio, `git commit`, `git push` y despliegue `clasp push -f` / `clasp deploy`.
  * Verificación rigurosa del manifiesto: el proyecto debe contener exactamente **79 archivos** (`node herramientas/manifiesto.js`).
  * Control de sintaxis: cero scripts o estilos fuera de etiquetas `<script>` o `<style>`.
  * Regularización obligatoria de `CONTROL_CAMBIOS.md` en cada cierre.
* **Cursor (Ingeniero Frontend DOM & Lógica JS — PC):**
  * Responsable exclusivo de `AyudaJS.html`, `ClaseJS_07.html` y fragmentos interactivos.
  * Listeners de eventos, posicionamiento dinámico de popovers con `getBoundingClientRect()`, serialización jerárquica y renderizado de la Vista del Alumno.
  * Entregas documentadas en `ENTREGA_CURSOR.md`.
* **DeepSeek (Diseñador UI/UX & CSS Modular — Termux/CLI):**
  * Responsable de `AdminPlaneacionCSS.html` y hojas modulares.
  * Rejillas responsivas sin desbordamiento (`minmax(0, 1fr)`), mini-cards (`.modulo-card-lateral`) y accesibilidad DUA.
  * Entregas documentadas en `ENTREGA_DEEPSEEK.md`.

---

## 2. AUDITORÍA DE ARCHIVOS .MD EN DRIVE OMITIDOS POR ANTIGRAVITY

Antigravity debe reconocer y subsanar formalmente los siguientes acuerdos documentados en Google Drive que fueron pasados por alto en sprints previos:

### 2.1 `Plan_Implementacion_Constructor_Avanzado_ST90.md` (Hoja de ruta vs. Google Forms)
* **Contenido Omitido:**
  * **Fase 1 (Sprint 1):** Enriquecimiento visual (imágenes y diagramas en reactivos) y **retroalimentación diferenciada** (explicación pedagógica distinta ante acierto vs. error).
  * **Fase 2 (Sprint 2):** Reactivo de **carga de archivos** (subida de evidencias de libreta y PDFs hacia Google Drive organizados por alumno) y navegación por secciones tipo wizard con barra de progreso.
  * **Fase 3 (Sprint 3):** **Temporizador con cuenta regresiva** y envío forzado al llegar a 00:00, junto con aleatorización de reactivos (algoritmo Fisher-Yates).
* **Causa Raíz:** Antigravity se concentró en la mecánica del grid CSS y el DOM de los iDevices de texto, congelando estas funciones interactivas.
* **Acción en build-609:** Apertura de la Fase 1 en el constructor y calendarización de las Fases 2 y 3.

### 2.2 `ENTREGA_CONSTRUCTOR_ENCUESTAS_BUILD_569.md` (Directorio de Encuestas y Modo Dual)
* **Contenido Omitido:** El iDevice de Encuestas opera en dos modalidades:
  1. *Modo Consulta de Datos Previos:* Conecta con `DirectorioEncuestas` en `15_DirectorioEncuentas.gs`, filtra por asignatura y grado, y proyecta métricas y el **Resumen Pedagógico IA** como andamiaje.
  2. *Modo Encuesta Activa como Tarea:* Asigna la encuesta como actividad, vincula la respuesta a la matrícula y asienta en `EntregasActividades`.
* **Causa Raíz:** Aunque los endpoints backend existen en `15_DirectorioEncuentas.gs`, la interfaz visual no conectó el selector de modo ni la carga dinámica del resumen IA.
* **Acción en build-609:** Conectar el selector de modo en el iDevice de encuestas en `AyudaJS.html`.

### 2.3 `ENTREGA_CONSTRUCTOR_DUAL_ENCUESTA_QUIZ_BUILD_570.md` (Motor Evaluativo Híbrido)
* **Contenido Omitido:**
  * Almacenamiento en la columna 11 (`extra` en formato JSON) de la hoja `Formulario`: `esQuiz`, `puntos`, `respuestaCorrecta`, `retroalimentacion`, `aleatorizarOpciones`.
  * Invocación de `calificarQuizAlumnoST90()` que transforma el puntaje a la **escala oficial SEP (5 a 10)** y asienta el desglose en la hoja `Respuestas`.
* **Causa Raíz:** Antigravity no implementó el endpoint backend en `PlaneacionNEM.gs` ni conectó el flujo en la vista del alumno, dejando el quiz plano y desconectado de la base de datos.
* **Acción en build-609:** Crear el endpoint backend y conectarlo con la vista del alumno.

### 2.4 `CONTROL_CAMBIOS.md` (Trazabilidad Rota)
* **Contenido Omitido:** `ESTADO_COORDINACION.md` estipula que Antigravity debe asentar cada versión desplegada en `CONTROL_CAMBIOS.md`.
* **Causa Raíz:** Durante las Olas 17, 18 y ajustes intermedios, se desplegó vía `clasp push` sin registrar el historial técnico de cambios.
* **Acción en build-609:** Regularizar el documento registrando la entrada formal de cierre para el build-609.

---

## 3. MÓDULO DE PLANEACIÓN DIDÁCTICA NEM (FASE 6 SECUNDARIA)

### 3.1 Wizard de Planeación en 4 Etapas
1. **Etapa 1 (Metadatos y Ejes):** Configuración en una sola fila compacta (`#nem-fila-una`). Candado normativo en `#planCampoFormativo` bloqueado y autoseleccionado según la disciplina.
2. **Etapa 2 (Contenidos y PDA):** Selectores alineados de Contenido Sintético y PDA con chips interactivos y contador dinámico.
3. **Etapa 3 (Diagnóstico y Ajustes DUA):** Problema escolar del CTE y catálogo base de encuestas. **Chips Rápidos DUA (1 clic)** en `#secInclusionBAPyC` que insertan directamente en `#planAjustesRazonables`:
   * `+ Macrotipo y Alto Contraste`
   * `+ Audio DUA y Lectura Guiada`
   * `+ Tiempos Flexibles y Pausas Activas`
   * `+ Parejas Tutoras y Andamiaje Visual`
4. **Etapa 4 (Propósito, Evaluación Formativa y Exportación):** Redacción asistida de propósito, Lista de Cotejo dinámica (3 a 5 criterios observables con columnas *Sí ✓*, *En proceso*, *No todavía*) y Rúbrica Analítica de 4 niveles (*Sobresaliente 10*, *Satisfactorio 8-9*, *Básico 6-7*, *Requiere Apoyo 5*).

### 3.2 Membrete Institucional Parametrizado (PropertiesService)
Persistencia de configuración institucional sin tocar código fuente:
* Claves: `ST90_CFG_LOGO_IZQ`, `ST90_CFG_LOGO_DER`, `ST90_CFG_ENC_L1`, `ST90_CFG_ENC_L2`, `ST90_CFG_ENC_L3`.
* Endpoints en `PlaneacionNEM.gs`: `obtenerMembreteInstitucionalNEM()` y `guardarMembreteInstitucionalNEM(token, payload)`.
* Inyección dinámica en `_generarHtmlDocumentoPlanoDidacticoNL_` (`AyudaJS.html`) para el formato oficial tamaño Carta con firmas de validación.

---

## 4. ESTRUCTURA DE SESIÓN (40 MINUTOS) Y SINCRONIZACIÓN

### 4.1 Los 4 Momentos Pedagógicos
* **Apertura (5 min):** Saberes previos, encuadre o pregunta detonadora (DUA).
* **Desarrollo (10 min):** Trabajo conceptual con Libro SEP (Colección Ximhai).
* **Actividad (20 min):** Reto situado en retículas Divi (trabajo central en equipos o individual).
* **Cierre (5 min):** Evaluación formativa rápida, quiz o ticket de salida.

### 4.2 Proyectos Multi-Sesión (S1, S2, S3...)
* Navegación reactiva en cabecera mediante pestañas `[S1]`, `[S2]`, `[S3]`.
* *Sesión 1:* Énfasis en apertura y diagnóstico comunitario (CTE).
* *Sesión 2:* Reto situado profundo (25-30 min) en retículas Divi reduciendo apertura.
* *Sesión 3:* Socialización, coevaluación con rúbricas analíticas y quiz final.

### 4.3 Sincronización Real con Google Calendar (CalendarApp)
* Modificar `calendarizarSesionNEM()` en `PlaneacionNEM.gs` para invocar `CalendarApp`:
  * Nomenclatura: `[${gradoGrupo}] ${asignatura}: ${nombreProyecto} / Sesión ${numSesion} (40 min)`.
  * Descripción: Desglose de los 4 momentos pedagógicos y enlace directo al portal del alumno (`?p=alumno&sec=${idClase}&s=${numSesion}`).
  * Bloques contiguos dobles: Agrupar en un único evento de 80 minutos.
  * Guardar el `eventId` en la hoja `Sesiones Didácticas`.

---

## 5. LIENZO DIVI, PERSISTENCIA Y PORTAL DEL ALUMNO

### 5.1 Rejillas Divi sin Desbordamiento (AdminPlaneacionCSS.html)
* `.divi-row` opera a 1 sola pista (`minmax(0, 1fr)`) y delega las columnas a `.divi-columns-grid`.
* `.divi-row.col-3 > .divi-columns-grid` aplica `grid-template-columns: repeat(3, minmax(0, 1fr)) !important; gap: 10px; width: 100% !important;`.
* `.divi-column` y componentes internos aplican `min-width: 0; max-width: 100%; box-sizing: border-box; overflow-x: auto;`.

### 5.2 Posicionamiento Seguro del Popover (+)
* En `abrirSelectorColumnas_` (`AyudaJS.html`), desacoplar el popover `.columns-popover` de `.divi-plus-row`.
* Montarlo directamente en `document.body` (o usar `position: fixed; z-index: 99999;`), calculando coordenadas absolutas con `getBoundingClientRect()` del botón presionado (`e.currentTarget`).

### 5.3 Persistencia Jerárquica y Puente al Portal Real del Alumno
* `capturarEstadoExe_()` guarda en `GuionDocenteJSON` la estructura:
  `{ tipo: "fila", layout: "col-3", columnas: [ [bloque1], [bloque2], [bloque3] ] }`.
* **Cierre de Brecha en `ClaseJS_07.html` / `Clase.html`:** `renderizarTextoClaseDUA` debe leer `GuionDocenteJSON`, parsear el árbol y renderizar los contenedores `.divi-row` y `.divi-column` correspondientes, manteniendo `GuionEstudianteAccesible` solo como respaldo de texto plano.

---

## 6. CATÁLOGO LATERAL DE COMPONENTES (OLA 19)
* **Organización:** 7 Familias Curriculares en acordeones colapsables limpios (`cat-info`, `cat-eval`, `cat-interact`, `cat-ingles`, `cat-juegos`, `cat-tecnologia`, `cat-ciencias`).
* **Buscador:** Barra superior conectada a `aplicarFiltroBuscadorCatalogo609_` vía `#inputBuscarModulosCatalogo`.
* **Mini-Cards (`.modulo-card-lateral`):** Icono representativo, título `.card-lateral-titulo`, subtítulo pedagógico `.card-lateral-sub` y botón `.btn-card-add` para inserción en la columna activa (`.divi-column.active-target`).

---

## 7. SISTEMA EVALUATIVO Y AUTONOMÍA DOCENTE

### 7.1 Ponderación Trimestral Configurable
* Los porcentajes de evaluación trimestral **NO son fijos ni estáticos**; respetan la autonomía pedagógica de cada docente según su campo formativo y acuerdos de academia.
* Parámetros configurables: `pesoProyectos`, `pesoActividades`, `pesoQuizzes`, `pesoExamen`.
$$\text{Promedio Final} = \frac{(\text{Nota Proy} \times P_{\text{proy}}) + (\text{Nota Act} \times P_{\text{act}}) + (\text{Nota Quiz} \times P_{\text{quiz}}) + (\text{Nota Examen} \times P_{\text{examen}})}{P_{\text{proy}} + P_{\text{act}} + P_{\text{quiz}} + P_{\text{examen}}}$$
* La sábana de calificaciones recalcula en tiempo real el promedio final y el estatus basándose en estos coeficientes.

### 7.2 Motor de Quizzes Calificables (`calificarQuizAlumnoST90`)
* Implementar formalmente en `PlaneacionNEM.gs` (o `15_DirectorioEncuentas.gs`):
  * Lee reactivos y claves de respuesta desde la columna 11 (`extra` en JSON de la hoja `Formulario`).
  * Normaliza el puntaje obtenido a la **escala oficial SEP (5.0 a 10.0)**.
  * Asienta en la hoja `Respuestas` o `EntregasActividades` vinculando a la matrícula del alumno e impactando la sábana trimestral.
* Conectar `calificarQuiziDeviceVivo_` en el cliente para invocar asíncronamente a `calificarQuizAlumnoST90()`.

### 7.3 Buzón de Evidencias Digitales
* Recepción de fotografías de libreta y PDFs organizados en Google Drive por alumno (`[Matricula]_[Sesion]_[Actividad]`).
* Calificación docente mediante Rúbrica Analítica de 4 niveles que impacta directamente en la hoja `EntregasActividades`.

---

## 8. PLAN DE ACCIÓN Y REPARTO DE TAREAS (BUILD-609)

### Tarea A: Cursor (Lógica Frontend DOM / JS)
1. En `ClaseJS_07.html`, habilitar el renderizado del árbol jerárquico de `GuionDocenteJSON` en el portal del alumno con sus rejillas `.divi-row` y `.divi-column`.
2. En `AyudaJS.html`, desacoplar `.columns-popover` a `document.body` con `getBoundingClientRect()` y `z-index: 99999`.
3. Conectar la llamada asíncrona de `calificarQuiziDeviceVivo_` hacia `calificarQuizAlumnoST90()`.
4. Conectar el selector de modo (*Datos Previos* vs. *Actividad*) en el iDevice de encuestas.
* *Entregable:* Documentar código probado en `ENTREGA_CURSOR.md`.

### Tarea B: DeepSeek (CSS Modular / UI)
1. En `AdminPlaneacionCSS.html` (y espejo en `ClaseCSS.html`), asegurar que los estilos de rejilla `.divi-row` y `.divi-column` se apliquen al portal del alumno.
2. Asegurar estilos limpios para `.columns-popover` (`position: fixed`, sombras y z-index alto).
3. Verificar consistencia visual en las mini-cards `.modulo-card-lateral`.
* *Entregable:* Documentar estilos en `ENTREGA_DEEPSEEK.md`.

### Tarea C: Antigravity (Auditoría, Backend y Despliegue)
1. En `PlaneacionNEM.gs`, programar el endpoint backend `calificarQuizAlumnoST90(token, payload)` con conversión a escala SEP 5-10.
2. En `PlaneacionNEM.gs` (`calendarizarSesionNEM`), programar la integración real con `CalendarApp` y guardar el `eventId`.
3. Regularizar `CONTROL_CAMBIOS.md` registrando el cierre del build-609 y los sprints de la deuda técnica.
4. Validar integridad estricta con `node herramientas/manifiesto.js` (**79 documentos exactos**).
5. Desplegar con `clasp push -f` y entregar la URL `/dev` verificada.
