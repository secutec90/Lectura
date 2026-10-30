# Control de cambios — Lectura ST90

Pega aquí un bloque por cada cambio cerrado. La fecha es la de America/Monterrey (`AAAA-MM-DD`). La bitácora narrativa sigue en `avances.md`.

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
