# Consolidado de Acuerdos Técnicos y Arquitectura: Suite Escolar ST90

**Fecha de consolidación:** 1 de noviembre de 2026  
**Entorno:** Google Apps Script / Google Sheets / HTML Service / Drive API  
**Sistema:** Plataforma Integral ST90 (Fase 6 NEM - Secundaria Técnica No. 90)

---

## 1. Módulo de Planeación Didáctica NEM (Fase 6)

### 1.1 Estructura del Wizard en 4 Etapas
1. **Etapa 1 (Metadatos y Ejes):**
   - Configuración en una sola fila compacta (`#nem-fila-una`).
   - Candado normativo en `#planCampoFormativo` que se bloquea y autoselecciona según la disciplina SEP.
2. **Etapa 2 (Contenidos y PDA):**
   - Selectores alineados de Contenido Sintético y Procesos de Desarrollo de Aprendizaje (PDA) con chips interactivos y contador dinámico de PDAs.
3. **Etapa 3 (Diagnóstico y Ajustes DUA):**
   - Problema escolar del CTE y catálogo base de encuestas.
   - **Chips Rápidos DUA** de 1 clic en `#secInclusionBAPyC` que insertan directamente en `#planAjustesRazonables`:
     - `+ Macrotipo y Alto Contraste`
     - `+ Audio DUA y Lectura Guiada`
     - `+ Tiempos Flexibles y Pausas Activas`
     - `+ Parejas Tutoras y Andamiaje Visual`
4. **Etapa 4 (Propósito, Evaluación Formativa y Exportación):**
   - Redacción de propósito del proyecto y sugerencias asistidas.
   - Generador y editor interactivo de **Lista de Cotejo** y **Rúbrica Analítica**.

---

## 2. Panel de Administración: Logotipos y Membrete Oficial

Se estableció la parametrización del membrete oficial sin necesidad de modificar código fuente:
- **Almacenamiento:** Persistencia en `PropertiesService.getScriptProperties()` con las claves:
  - `ST90_CFG_LOGO_IZQ`: URL o Base64 del logotipo izquierdo (Secretaría / Estado).
  - `ST90_CFG_LOGO_DER`: URL o Base64 del logotipo derecho (Escudo escolar).
  - `ST90_CFG_ENC_L1`: Línea 1 (Dependencia / Secretaría).
  - `ST90_CFG_ENC_L2`: Línea 2 (Nombre de la escuela).
  - `ST90_CFG_ENC_L3`: Línea 3 (C.C.T., Zona escolar, Ciclo escolar).
- **Backend:** Funciones `obtenerMembreteInstitucionalNEM()` y `guardarMembreteInstitucionalNEM(token, payload)`.
- **Interfaz:** Modal `#modalConfigMembreteST90` con campos de captura y vista previa.
- **Plano Didáctico Oficial (PDF / Impresión):** Función `_generarHtmlDocumentoPlanoDidacticoNL_` en `AyudaJS.html` adaptada para inyectar dinámicamente tanto los escudos como las 3 líneas de texto institucionales.

---

## 3. Generador de Instrumentos de Evaluación Formativa (Etapa 4)

- **Lista de Cotejo Dinámica:**
  - Botón interactivo `✨ Generar criterios desde PDA`.
  - Construcción automática de 3 a 5 criterios observables desglosados en:
    1. Criterio Cognitivo / Conceptual (derivado del primer PDA).
    2. Criterio Procedimental / Producción central (derivado del segundo PDA o Propósito).
    3. Criterio de Vinculación Comunitaria / Problemática CTE.
    4. Criterio Socioemocional y Colaborativo DUA.
  - Tabla editable con columnas de verificación (*Sí ✓*, *En proceso*, *No todavía*), edición de texto en línea, adición de criterios (`+ Agregar criterio`) y eliminación (`✕`).
- **Rúbrica Analítica:**
  - Derivación automática simultánea con cuatro niveles de logro: *Sobresaliente (10)*, *Satisfactorio (8-9)*, *Básico (6-7)* y *Requiere Apoyo (5)*.
- **Exportación:** Ambas herramientas quedan plasmadas en la hoja final tamaño Carta del Plano Didáctico Oficial de Nuevo León, antes de las firmas de validación directiva.

---

## 4. Constructor de Clases (UI tipo eXeLearning)

Al concluir la planeación, el docente accede al constructor de secuencias de clase:
- **Árbol de Contenidos (Panel Izquierdo):**
  - Jerarquía de nodos didácticos organizados por momentos de la sesión: Inicio, Desarrollo, Aplicación práctica, Cierre/Quiz.
- **Catálogo de iDevices (Componentes modulares):**
  - *iDevice Texto / Guion:* Editor enriquecido con síntesis de voz (Audio DUA).
  - *iDevice Actividad Entregable:* Tarea con recepción de evidencias (texto, imágenes o documentos en Drive) evaluable mediante rúbrica.
  - *iDevice Multimedia:* Incrustación de esquemas, audios y videos.
- **Autonomía y Ponderación Docente:**
  - El docente decide la cantidad de actividades y cuestionarios por clase o por trimestre.
  - Módulo de ponderación configurable (porcentajes de tareas, quizzes y examen trimestral).
  - Bandeja de revisión de evidencias con calificación directa vinculada a la matrícula del alumno.

---

## 5. Integración del Catálogo y Directorio de Encuestas

El constructor de clases se vincula con el **Directorio de Encuestas** (`15_DirectorioEncuentas.gs` y hojas base ST90) bajo dos modalidades:
1. **Modo Consulta de Datos Previos (Andamiaje Diagnóstico):**
   - El docente filtra por asignatura, grado y trimestre.
   - Extrae métricas, total de respuestas y el **Resumen Pedagógico IA** para presentarlo a los estudiantes como insumo de análisis o reflexión comunitaria.
2. **Modo Encuesta Activa como Tarea:**
   - La encuesta se asigna como actividad de la clase.
   - Cada entrega se vincula a la matrícula del alumno, notificando a la hoja `EntregasActividades` y asignando la ponderación configurada.

---

## 6. Evolución Dual del Constructor: Encuestas y Quizzes Calificables

El constructor de formularios evoluciona a un formato híbrido manteniendo plena retrocompatibilidad con las hojas de cálculo existentes (`Formulario`, `Configuracion`, `Respuestas`):
- **Compatibilidad de Esquema:**
  - Se preservan las 11 columnas estándar de la hoja `Formulario`.
  - Los parámetros evaluativos se serializan dentro de la columna 11 (`extra` en formato JSON): `esQuiz`, `puntos`, `respuestaCorrecta`, `retroalimentacion`, `aleatorizarOpciones`.
- **Selector de Modo en Cabecera:**
  - Conmutador entre `📊 Encuesta / Diagnóstico` (sin notas) y `📝 Quiz Evaluativo` (con reactivos ponderados).
- **Motor de Calificación Automática (`calificarQuizAlumnoST90`):**
  - Evalúa preguntas de opción única, opción múltiple, verdadero/falso, numérico y texto corto.
  - Convierte los puntos obtenidos a la escala oficial de 5 a 10.
  - Guarda el desglose detallado de reactivos y el resultado en la hoja `Respuestas`.

---

## 7. Comparativa con Google Forms y Hoja de Ruta de Implementación

### 7.1 Brecha Identificada frente a Google Forms
- **Funcionalidades pendientes:** Cuadrículas bidimensionales, inserción de imágenes/diagramas en preguntas, subida de archivos dentro del formulario, retroalimentación diferenciada (acierto vs. error), paginación por secciones con barra de progreso, aleatorización activa en cliente y temporizador con envío forzado.
- **Ventaja competitiva de ST90:** Integración escolar directa con el expediente académico, grupos, matrículas, marco DUA y programas sintéticos/analíticos NEM.

### 7.2 Fases del Plan de Implementación Acordado
- **Fase 1 (Sprint 1):** Enriquecimiento visual (imágenes en preguntas) y retroalimentación formativa diferenciada.
- **Fase 2 (Sprint 2):** Reactivo de carga de archivos (fotos de libreta/PDFs a Drive) y paginación en secciones con wizard.
- **Fase 3 (Sprint 3):** Temporizador con cuenta regresiva regresiva y envío forzado, junto con aleatorización de reactivos (Fisher-Yates).

---

## 8. Entregas Documentadas en Google Drive

1. **`ENTREGA_CURSOR_BUILD_568.md`:** Código fuente de membrete institucional, chips DUA, generador de lista de cotejo y rúbrica, y conexión con el formato PDF oficial.
2. **`ENTREGA_CONSTRUCTOR_ENCUESTAS_BUILD_569.md`:** Endpoints y componente iDevice para conectar encuestas previas o aplicarlas como actividades evaluables.
3. **`ENTREGA_CONSTRUCTOR_DUAL_ENCUESTA_QUIZ_BUILD_570.md`:** Adaptación del constructor a modalidad dual (Encuesta / Quiz) y motor de calificación automática sobre escala de 10.
4. **`Plan_Implementacion_Constructor_Avanzado_ST90.md`:** Hoja de ruta para el desarrollo de las características avanzadas comparadas con Google Forms.