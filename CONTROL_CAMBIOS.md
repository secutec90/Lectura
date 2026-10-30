# Control de cambios — Lectura ST90

Pega aquí un bloque por cada cambio cerrado. La fecha es la de America/Monterrey (`AAAA-MM-DD`). La bitácora narrativa sigue en `avances.md`.

### 🛠️ [2026-10-29] - [Planeación Didáctica: Horario Oficial por Defecto y Auto-Siembra de Proyectos Demo]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(planeacion): restaurar vista inicial de horario oficial y auto-sembrar proyectos demo en banco personal`
- **Cambios Realizados:**
  - Restaurada la vista inicial de Planeación Didáctica a **Horario Oficial** (`conmutarVistaPlaneacion_('horario')`) en `AdminPlanJS_06.html:inicializarModuloPlaneacion_()` para que al ingresar al módulo se despliegue directamente el calendario semanal de clases aSc con sus bloques y asignaturas clicables.
  - Incorporada la auto-siembra preventiva en `PlaneacionNEM.gs:listarPlaneacionesNEM()`: si la base de datos de planeaciones está vacía, se invoca automáticamente `sembrarPlaneacionesDemoNEM()` para que el docente o administrador disponga de proyectos de muestra inmediatamente al acceder a su Banco Personal o Global sin ver pantallas vacías en 0.
  - Verificada la integridad del manifiesto (0 errores en 75 documentos) y desplegado en Google Apps Script a la versión `@514`.
- **Archivos Afectados:** `AdminPlanJS_06.html`, `PlaneacionNEM.gs`, `ESTADO_COORDINACION.md`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Restablece el flujo de trabajo natural del docente (acceder a Planeación ➔ ver su Horario/Calendario ➔ seleccionar clase/asignatura o abrir Banco de proyectos).

### 🛠️ [2026-10-29] - [Sincronización de Despliegues: Google Sites inicio a build-510]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(deploy): sincronizar despliegue embebido en google sites a version @512 build-510`
- **Cambios Realizados:**
  - Identificada la causa por la cual `https://sites.google.com/view/st90/inicio` seguía mostrando `v417 · build-469`: el iframe de Google Sites tenía incrustado el ID de despliegue `AKfycbz1-xheu_68hU7LpM0_3sUSfqwsb1Hw775eWuHgwmPTJWtvGY7cCh0AR4zcq2Lg32DIBQ` (anclado a la versión histórica `@507`).
  - Redesplegadas las 4 instancias activas (`AKfycbz1-xheu...`, `AKfycbxDw5...`, `AKfycbzkoA...`, `AKfycbzPQD...`) apuntando a la versión `@512` con `build-510`.
  - Verificada la entrega HTTP directa de `build-510` en el endpoint embebido de Google Sites.
  - Actualizados `ENLACES_UI.md` y `ESTADO_COORDINACION.md`.
- **Archivos Afectados:** `ENLACES_UI.md`, `ESTADO_COORDINACION.md`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Garantiza que cualquier usuario que ingrese desde el portal de Google Sites o mediante URL directa de Apps Script reciba la misma versión @512 con todas las correcciones de guardado de planeación y diseño Ribbon.

### 🛠️ [2026-10-29] - [Fix Integral: Guardado y Visibilidad de Planeaciones NEM + Fase 6 iDevices CSS]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(planeacion): corregir guardado de proyectos, desbloqueo novalidate y filtros de visualizacion`
- **Cambios Realizados:**
  - Corregido `sembrarDemoPlaneaciones_` en `AdminPlanJS_02.html` para invocar la función real `cargarListaPlaneacionesNEM(true)` (eliminando el `ReferenceError: cargarBancoPlaneaciones_ is not defined`).
  - Agregado atributo `novalidate` a `<form id="formPlanData">` en `AdminPlaneacion.html` para evitar que la validación HTML5 interna del navegador aborte el guardado por campos requeridos en paneles del stepper con `display: none`.
  - Robustecido `guardarPlaneacionForm` en `AdminPlanJS_05.html`: validación asistida de título con navegación a Etapa 1, token de sesión seguro y valores por defecto para grado/grupo/asignatura.
  - Corregido el filtrado de planeaciones en `PlaneacionNEM.gs`: normalización flexible de grupo (extrae solo letra para evitar descarte por formato `1A`), matching numérico para trimestres y visibilidad de proyectos demo/propios en Banco Personal.
  - Inicialización directa de `conmutarVistaPlaneacion_('personal')` en `AdminPlanJS_06.html` para que el panel de planeación nunca inicie con pantalla vacía.
  - Integrada Fase 6: desacoplamiento de estilos inline de tarjetas iDevice en `AdminPlanJS_06.html` e incorporación de clases `.idevice-card*`, `.idevice-campo-titulo` y `.idevice-campo-cuerpo` en `ComunCSS.html`.
- **Archivos Afectados:** `AdminPlanJS_02.html`, `AdminPlanJS_05.html`, `AdminPlanJS_06.html`, `AdminPlaneacion.html`, `ComunCSS.html`, `PlaneacionNEM.gs`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Resuelve de raíz por qué no se mostraban las planeaciones ni se guardaban en el Banco Personal.

### 🛠️ [2026-10-29] - [Fase 5: Cinta Ribbon estilo aSc Horarios 2027 e Iconos Ilustrados]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(ui): rediseño visual estilo aSc Horarios 2027 con ribbon y 31 iconos ilustrados`
- **Cambios Realizados:**
  - Sustitución de 31 iconos SVG monocromáticos por ilustraciones detalladas y coloridas tipo aSc Horarios / Office en `#menuTabsPanel` y sub-cintas.
  - Implementación de estilos Ribbon en `ComunCSS.html` (degradados suaves, divisores verticales `.separador-ribbon`, tarjetas con icono superior y texto inferior, elevación hover y foco accesible).
  - Preservación del 100% de IDs del DOM (104/104) y manejadores `onclick` (64/64) auditada por DeepSeek y Antigravity.
- **Archivos Afectados:** `ComunCSS.html`, `Admin.html`, `CONTROL_CAMBIOS.md`, `ENTREGA_DEEPSEEK.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Modernización estética aSc Horarios solicitada por el usuario manteniendo intacta toda la lógica JS subyacente.

### 🛠️ [2026-10-29] - [Planeación Didáctica: iDevices Dinámicos y Validación de Momentos]
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(planeacion): serializar idevices en guion y bloquear guardado si faltan momentos`
- **Cambios Realizados:**
  - Renderizado dinámico de bloques de lectura, pregunta y reto en `#contenedorIDevicesDinamicos` con id único y botón de eliminación.
  - Serialización y rehidratación bidireccional de iDevices dentro del guion accesible (`#sesGuionEstudiante`) con delimitadores estructurados.
  - Validación preventiva de los cuatro momentos (Apertura, Desarrollo, Actividad, Cierre) antes del guardado de la sesión activa con feedback toast ST90.
- **Archivos Afectados:** `AdminPlanJS_06.html`, `AdminPlaneacion.html`, `CONTROL_CAMBIOS.md`, `ENTREGA_CURSOR.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Mantiene la compatibilidad con los IDs `sesApertura`, `sesDesarrollo`, `sesActividad` y `sesCierre` usando `data-alias` para satisfacer el contrato sin quebrar `AdminPlanJS_05.html`.

### 🛠️ [2026-10-29] - [Actualización de _PLANTILLA_PROYECTO_NUEVO con Buzones y Reglas Automáticas]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(plantilla): sincronizar starter kit con buzones automáticos ENTREGA_DEEPSEEK y ENTREGA_CURSOR y reglas globales`
- **Cambios Realizados:**
  - Se agregaron los archivos de buzón `ENTREGA_DEEPSEEK.md` y `ENTREGA_CURSOR.md` dentro de `_PLANTILLA_PROYECTO_NUEVO/`.
  - Se incorporaron las reglas automáticas `.cursor/rules/buzon-entrega-cursor.mdc`, `AGENTS.md` y `DEEPSEEK.md`.
  - Se actualizó `_PLANTILLA_PROYECTO_NUEVO/README_ARRANQUE.md` con el diagrama de flujo de cero copiado manual y la tabla completa de 13 componentes del kit.
  - Se verificó la suite `node .rsc/test_regresion.js` en código 0.
- **Archivos Afectados:** `_PLANTILLA_PROYECTO_NUEVO/*`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Asegura que cualquier nuevo proyecto herede la arquitectura de buzones automáticos sin fricción de copiado manual.

### 🛠️ [2026-10-29] - [Automatización de Buzones de Entrega para Agentes]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(orquestacion): automatizar guardado directo en buzones ENTREGA_DEEPSEEK y ENTREGA_CURSOR con reglas obligatorias`
- **Cambios Realizados:**
  - Se crearon las reglas automáticas `.cursor/rules/buzon-entrega-cursor.mdc` (con `alwaysApply: true`), `DEEPSEEK.md` y `AGENTS.md`.
  - Se configuró la directiva imperativa para que Cursor y DeepSeek guarden sus entregas directamente en `ENTREGA_CURSOR.md` y `ENTREGA_DEEPSEEK.md` sin requerir que el usuario copie y pegue código manualmente en el chat.
  - Se replicaron las reglas en `_PLANTILLA_PROYECTO_NUEVO/` para que los nuevos proyectos hereden la automatización.
- **Archivos Afectados:** `.cursor/rules/buzon-entrega-cursor.mdc`, `DEEPSEEK.md`, `AGENTS.md`, `ENTREGA_DEEPSEEK.md`, `ENTREGA_CURSOR.md`, `_PLANTILLA_PROYECTO_NUEVO/*`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Elimina el copiado manual entre ventanas. Los agentes vuelcan directamente su trabajo en el disco local y Antigravity los audita con un solo aviso del usuario.
