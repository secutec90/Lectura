# Radiografía Técnica de Auditoría e Integración — Suite Escolar ST90

**Institución:** Escuela Secundaria Técnica N.° 90  
**Versión de Plataforma:** `v409` (Octubre 2026)  
**ID de Despliegue Web App:** `AKfycbzPQDTjMqHGpSfBg3KMrDBpxSweOAk2x5adcMLJ4aJHvM2ETGtGI-rm1bz3aDRxj-FAgQ`  
**Proyecto Apps Script (Clasp):** `1ZEO8UIBu91bDGSV8WPM9J5M3JvvXLgJb7ICqGVulYjnDeJHarSLRvkik`  
**Stack de Arquitectura:** Google Apps Script (Motor V8) + Google Sheets + HTML5 / CSS3 / Vanilla JavaScript ES6 + Web Speech API  
**Auditoría y Cierre:** Conforme a Directrices y Reglas de Negocio Institucionales.

---

## 1. Mapeo de Rutas y Control de Acceso por Roles (Login Unificado)

La autenticación está centralizada y gobernada por `iniciarSesionUnificada` en [Codigo.gs](file:///g:/Mi%20unidad/PROYECTOS/Lectura/Codigo.gs#L1032-L1240), apoyada en `CacheService` con TTL de 21,600 segundos (6 horas) y validaciones de sesión criptográficas en `obtenerSesionValida_` y `exigirClaseRol_`.

| Rol Institucional | Parámetros de Ruta (`doGet`) | Plantilla / Vista Principal | Fuente Autoritativa de Credenciales | Claves en `CacheService` | Alcance y Permisos Gobernados |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 🧑‍🏫 **Prefecta** | `?pagina=asistencia` | [AdminAsistencia.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/AdminAsistencia.html) (dentro de [Admin.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/Admin.html)) | Hoja `Prefectos` (`buscarPrefectoLogin_`) | `sesion_<token>` (rol: `prefecto`, `prefectoId`) | Carga **exclusivamente los grupos asignados** por turno y grado en `PrefectoGrupos`. Acceso directo a pase de lista e incidencias (`#subAsiAlu`). No puede ver ni editar planeaciones ajenas ni configuraciones maestras. |
| 🎓 **Alumno** | `?pagina=alumno` o `?mat=XXXX` | [Interfaz.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/Interfaz.html) y [Clase.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/Clase.html#modo=alumno) | Hoja `AccesoClaseAlumnos` o padrón `Alumnos` | `alumno_<token>`, `sesion_<token>`, `sesion_alumno_<mat>` | Panel personal de lectura: historial de evaluaciones, cálculo de PPM, niveles cognitivos (literal, inferencial, crítico), descarga de boletas y Aula Hablada interactiva con soporte DUA. |
| 👨‍🏫 **Docente** | `?pagina=docente` o `?pagina=clase-maestro` | [Clase.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/Clase.html) | Hoja `MaestrosClase` (`buscarMaestroClaseLogin_`) | `docente_<token>`, `sesion_<token>`, `clase_<token>` | Malla horaria oficial aSc Timetables (600 clases), **Banco Personal de Planeaciones** (crear, editar, borrar y secuenciar), Constructor de Clases iDevices (eXeLearning), y asistencia de su módulo horario. |
| ⚙️ **Administrador** | `?pagina=admin` o `?pagina=portal` | [Admin.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/Admin.html) | `ScriptProperties` (`CLAVE_ADMIN_HASH` + `SALT` con SHA-256) | `admin_<token>`, `sesion_<token>` | **Acceso irrestricto** al Panel Maestro con todas las pestañas activas: Gestión de Usuarios (`#tab-mat`), Asistencia Dual (`#tab-asi`), Banco de Lecturas (`#tab-lec`), Reportes (`#tab-rep`) y Configuración (`#tab-cfg`). |

---

## 2. Auditoría de Vistas Restauradas en el Panel Administrador

Las herramientas reales preexistentes están completamente preservadas e integradas dentro de [Admin.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/Admin.html) en `<div id="panel" class="envoltorio oculto">`, ensambladas mediante scriptlets de inclusión oficial `include(...)`:

| Módulo / Herramienta Real | Archivo Fuente | Contenedor DOM Principal | Sub-contenedores Activos | Función de Navegación | Funciones de Carga Backend Enlazadas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 👥 **Gestión Integral de Usuarios** | [AdminUsuarios.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/AdminUsuarios.html) | `<div id="tab-mat" class="bloque oculto">` | `#secUsuAlu` (Alumnos), `#secUsuMae` (Docentes), `#secUsuPref` (Prefectas), `#secUsuAdm` (Admin y Apoyo) | `tab('mat', boton)` | `cargarAlumnosAdmin()`, `cargarMaestrosAdmin()`, `cargarPrefectosAdmin()`, `importarAlumnosCSV()` |
| 📋 **Asistencia Dual (Alumnos / Docentes)** | [AdminAsistencia.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/AdminAsistencia.html) | `<div id="tab-asi" class="bloque oculto">` | `#subAsiAlu` (Pase de lista alumnos por fecha, grado y grupo), `#subAsiMae` (Asistencia docentes horas 1 a 8), `#subAsiRep` (Reportes) | `tab('asi', boton)` | `cargarContextoAsistencia()`, `alCambiarFechaAsiAlu()`, `marcarTodosAsiAlu()`, `guardarListaAsiAlu()` |
| 📖 **Banco de Comprensión Lectora** | [AdminLecturas.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/AdminLecturas.html) | `<div id="tab-lec" class="bloque oculto">` | `#tablaLecturasMatriz`, `#cajaEditorLectura`, `#panelGeneradorIALectura` | `tab('lec', boton)` | `cargarLecturas()`, `guardarLectura()`, `reclasificarNivelesCognitivos()`, `generarLecturaAsistidaIA()` |
| 📝 **Planeación Didáctica NEM** | [AdminPlaneacion.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/AdminPlaneacion.html) | `<div id="tab-plan" class="bloque oculto">` | `#tabClases` (Horario oficial), `#cajaListaPlanNEM` (Banco personal vs global), `#cajaFormPlanNEM` (Stepper 4 etapas NEM), `#cajaSesionesPlanNEM` (eXeLearning DUA) | `tab('plan', boton)` | `cargarListaPlaneacionesNEM()`, `guardarPlaneacionNEM()`, `clonarPlaneacionAGlobal()`, `aprobarPlaneacionNEM()` |
| 📊 **Diagnóstico & Encuestas** | [AdminEncuestas.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/AdminEncuestas.html) | `<div id="tab-enc" class="bloque oculto">` | `#subPanelEncuestaAnalitica` (Tablero de analítica situacional), `#subPanelEncuestaEditor` (Constructor de preguntas), `#modalPreviaEncuesta` | `tab('enc', boton)` | `conmutarSubTabEncuestas()`, `vincularHallazgoActualCTE_()`, `copiarEnlacePublicoCenso()` |

---

## 3. Esquema de Base de Datos y Arquitectura de Planeaciones Didácticas (Personal vs. Global)

La hoja `PlaneacionesNEM` cuenta con 24 columnas canónicas definidas en `ENCABEZADOS.PlaneacionesNEM` en [Codigo.gs](file:///g:/Mi%20unidad/PROYECTOS/Lectura/Codigo.gs#L101-L106):

```javascript
PlaneacionesNEM: [
  "Id", "Titulo", "Grado", "Grupo", "Asignatura", "CampoFormativo", "Metodologia",
  "ContenidoSintetico", "PDA", "EjesArticuladores", "Proposito", "ProblemaComunidad",
  "ProductoFinal", "NumSesiones", "Docente", "Estado", "Version", "FechaCreacion", "FechaAprobacion",
  "Periodo", "FechaInicio", "IdHorario", "DocentePropietario", "EsCopiaDe"
]
```

### Reglas de Negocio Implementadas en [PlaneacionNEM.gs](file:///g:/Mi%20unidad/PROYECTOS/Lectura/PlaneacionNEM.gs):

1. **Indexación y Propiedad:**
   - Cada planeación registra a su creador original en `DocentePropietario` (o `Docente`), vinculada a su `Asignatura`, `Grado` y `Periodo` (Trimestre 1, 2 o 3 según calendario oficial SEP).
2. **Estados de Desarrollo:**
   - `BORRADOR`: Visible y editable **únicamente** en el Banco Personal del docente autor. Los borradores de un docente jamás son visibles para otros colegas en el Repositorio Global.
   - `PUBLICADA` / `APROBADO`: Cuando el docente ha completado todas sus sesiones didácticas y sus bloques iDevices, puede publicar su proyecto al Banco Global Escolar.
3. **Validación de Permisos de Edición y Borrado:**
   - En `crearOActualizarPlaneacionNEM`: Si el docente autenticado (`ses.maestroNombre || ses.nombre`) no coincide con el autor registrado en `DocentePropietario`, el servidor rechaza la mutación con: *"No tienes autorización para modificar la planeación de otro docente."*
   - En `eliminarPlaneacionNEM`: Bloquea estrictamente cualquier intento de eliminar planeaciones de colegas.
4. **Función de Clonación (`clonarPlaneacionAGlobal`):**
   - Implementada en [PlaneacionNEM.gs](file:///g:/Mi%20unidad/PROYECTOS/Lectura/PlaneacionNEM.gs#L445-L530).
   - Lee la planeación original y todas sus sesiones en `SesionesNEM`.
   - Genera un nuevo identificador UUID (`PLN-XXXXXXXX`), asigna como `Docente` y `DocentePropietario` al docente solicitante, establece `Estado = 'BORRADOR'`, `Version = 1`, `FechaCreacion = new Date()` y registra `EsCopiaDe = idPlaneacionOriginal`.
   - Duplica todas las sesiones asociadas con nuevos IDs de sesión (`SES-XXXXXXXX`), permitiendo que el docente adapte la planeación sin afectar al proyecto original.
5. **Función de Publicación (`publicarPlaneacionEnRepositorio`):**
   - Implementada en [PlaneacionNEM.gs](file:///g:/Mi%20unidad/PROYECTOS/Lectura/PlaneacionNEM.gs#L535-L585).
   - Valida autoría del solicitante y valida que todas las sesiones tengan completos sus momentos didácticos (Apertura, Desarrollo, Actividad, Cierre) y el guion accesible / iDevices para los estudiantes antes de cambiar el estado a `PUBLICADA`.

---

## 4. Constructor de Clases Interactivas tipo eXeLearning (iDevices) e Inyección de Censo CTE

En [Clase.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/Clase.html):

### A. Constructor de Bloques iDevices (eXeLearning)
- **Ubicación:** [Clase.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/Clase.html#L6711-L6785).
- **Bloques Disponibles:**
  1. 🎙️ **Lectura Guiada (DUA):** Narración accesible del párrafo de clase mediante la Web Speech API (`window.speechSynthesis`), con botón `probarAudioIDevice_` en español de México (`es-MX`).
  2. ❓ **Pregunta Formativa:** Reactivo detonador con planteamiento de pregunta y retroalimentación pedagógica esperada.
  3. 🎯 **Desafío Práctico:** Reto situado en el entorno comunitario o evidencia práctica esperada.
- **Validación de Calidad:** La función `publicarProyectoEnGlobal_` y `publicarPlaneacionEnRepositorio` verifican que cada sesión del proyecto cuente con sus bloques didácticos antes de autorizar su publicación al Banco Global.

### B. Inyección del Censo Escolar al Diagnóstico CTE (`#planProblema`)
- **Ubicación:** [Clase.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/Clase.html) en la Etapa 3 del Stepper de Planeación y función `abrirModalImportarCensoCTE_()`.
- **Funcionamiento:** En la etapa de diagnóstico, el docente dispone del botón `[ 📊 Importar Censo Escolar CTE ]`. Al pulsarlo, el sistema despliega los hallazgos críticos del censo de la escuela:
  1. *Movilidad y Trayecto Seguro (Riesgo Vial):* 68.4% de alumnos en cruces de alto aforo con traslados > 40 min.
  2. *Comprensión Lectora y Hábitos Digitales:* 18.2% de lectura por placer frente a 4.8 horas diarias en pantallas.
  3. *Convivencia Pacífica y Salud Emocional:* 42.1% con necesidad de mediación pacífica y autorregulación.
  4. *Alimentación Saludable y Sustentabilidad:* 56.7% de consumo de ultraprocesados en el trayecto.
- Al seleccionar cualquiera, la función `seleccionarHallazgoCensoModal_` inyecta automáticamente el hallazgo dentro del campo `<textarea id="planProblema">`, vinculando de inmediato el Diagnóstico CTE con la Situación-Problema del proyecto didáctico.

---

## 5. Resultado de Pruebas Automatizadas (Sintaxis y Regresión)

Ejecución de la suite oficial local mediante Node.js VM:
`node .rsc/test_cierre_definitivo.js`

```text
================================================================================
ST90 — CIERRE DEFINITIVO DE SEGURIDAD: SUITE DE PRUEBAS LOCALES
================================================================================
[SYNTAX CHECK PASS] Codigo.gs
[SYNTAX CHECK PASS] Asistencia.gs
[SYNTAX CHECK PASS] ClaseLogica.gs
[SYNTAX CHECK PASS] PlaneacionNEM.gs
[SYNTAX CHECK PASS] HorarioOficial.gs
[SYNTAX CHECK PASS] Clase.html [script #1]
[SYNTAX CHECK PASS] Clase.html [script #2]
[SYNTAX CHECK PASS] Clase.html [script #3]
[SYNTAX CHECK PASS] Clase.html [script #4]

--- SUITE 1: CORRECCIÓN A — CONSISTENCIA DEL HISTORIAL AL RECUPERAR ---
  [PASS] A.1: Primera evaluación recuperada tras pérdida de servidor tiene n=0, promedio=null, delta=null
  [PASS] A.2: Recuperación de una evaluación cuando ya existen intentos anteriores y posteriores
  [PASS] A.3: Reintento repetido de la misma evaluación mantiene respuesta exacta sin derivación ni alteraciones
  [PASS] A.4: Verificación de que la recuperación no duplica filas ni altera la calificación guardada
  [PASS] A.5: Compatibilidad exhaustiva de todos los campos con pintarResultadoFinal en Interfaz.html

--- SUITE 2: CORRECCIÓN B — REVOCACIÓN DE SESIONES Y COMPROBACIÓN DE IDENTIDAD ---
  [PASS] B.1: Revocación legítima de la sesión propia (alumno, docente y clase)
  [PASS] B.2: Intento de revocar una sesión ajena mediante token de clase es bloqueado
  [PASS] B.3: Token de clase inexistente, vencido o corrupto
  [PASS] B.4: Dos sesiones simultáneas de la misma matrícula
  [PASS] B.5: Revocación con una evaluación en curso en otro dispositivo
  [PASS] B.6: Reintento de revocación sin provocar efectos sobre otras sesiones

--- SUITE 3: PLANEACIÓN DIDÁCTICA NEM, SESIONES DUA DE 40 MIN Y AULA HABLADA ---
  [PASS] C.1: Catálogo curricular oficial NEM provee Fase 6, Campos Formativos y Metodologías
  [PASS] C.2: Crear borrador de planeación NEM inicializa N sesiones de 40 minutos en blanco
  [PASS] C.3: Guardar sesión con enfoque DUA (4 momentos, notas docentes y guion de estudiante para leer/escuchar)
  [PASS] C.4: Aprobar planeación y calendarizar sesión sincroniza automáticamente con ContenidosClase
  [PASS] C.5: Renderizado multimodal DUA para estudiantes: momentos, descripción auditiva obligatoria y accesibilidad de lectura/escucha
  [PASS] C.6: Catálogo curricular depurado: Geografía solo contiene 1.° grado (sin 2.° ni 3.°) e Inglés provee selección múltiple de PDA para 1.°
  [PASS] C.7: Guardar planeación con selección múltiple de PDA preserva la fila y compatibilidad total
  [PASS] C.8: Asistente pedagógico IA valida roles de seguridad y provee respuesta estructurada

================================================================================
RESUMEN PRUEBAS: 19 EXITOSAS, 0 FALLIDAS (TOTAL: 19)
================================================================================
```

### Verificación de Integridad de Controles de Interfaz (`check_ids.js`)
- **Total de IDs críticos verificados:** 40 / 40 presentes (100% de cumplimiento).
- **Controles comprobados:** `planId`, `planIdHorario`, `bannerClaseNEM`, `txtEncabezadoMateriaGrupo`, `txtEncabezadoFecha`, `txtEncabezadoHorario`, `txtEncabezadoPeriodo`, `txtEncabezadoDocente`, `wrapEncabezadoDocente`, `wrapCamposOcultosPlan`, `selPlanClaseHorario`, `badgePeriodoPlan`, `planGrado`, `planGrupo`, `planAsignatura`, `planFechaInicio`, `planPeriodo`, `planTitulo`, `planCampoFormativo`, `planMetodologia`, `planNumSesiones`, `wrapEjesPlan`, `txtEtiquetaMatrizNEM`, `selContenidoSinteticoNEM`, `badgeConteoPDAs`, `buscarPDANEM`, `listaPDAsCheckboxNEM`, `wrapArticulacionOtrosGradosNEM`, `cajaArticulacionOtrosGrados`, `planContenidoSintetico`, `planPDA`, `secInclusionBAPyC`, `badgeAlertaBAPyC`, `wrapChipsBAPyCGrupo`, `planAjustesRazonables`, `btnSugerirProyectoIA`, `selProblemaEscolar`, `planProblema`, `planProposito`, `btnGuardarPlan`.
