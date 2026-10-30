# Control de cambios — Lectura ST90

Pega aquí un bloque por cada cambio cerrado. La fecha es la de America/Monterrey (`AAAA-MM-DD`). La bitácora narrativa sigue en `avances.md`.

### 🛠️ [2026-10-29] - [Automatización de Buzones de Entrega para Agentes]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(orquestacion): automatizar guardado directo en buzones ENTREGA_DEEPSEEK y ENTREGA_CURSOR con reglas obligatorias`
- **Cambios Realizados:**
  - Se crearon las reglas automáticas `.cursor/rules/buzon-entrega-cursor.mdc` (con `alwaysApply: true`), `DEEPSEEK.md` y `AGENTS.md`.
  - Se configuró la directiva imperativa para que Cursor y DeepSeek guarden sus entregas directamente en `ENTREGA_CURSOR.md` y `ENTREGA_DEEPSEEK.md` sin requerir que el usuario copie y pegue código manualmente en el chat.
  - Se replicaron las reglas en `_PLANTILLA_PROYECTO_NUEVO/` para que los nuevos proyectos hereden la automatización.
- **Archivos Afectados:** `.cursor/rules/buzon-entrega-cursor.mdc`, `DEEPSEEK.md`, `AGENTS.md`, `ENTREGA_DEEPSEEK.md`, `ENTREGA_CURSOR.md`, `_PLANTILLA_PROYECTO_NUEVO/*`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Elimina el copiado manual entre ventanas. Los agentes vuelcan directamente su trabajo en el disco local y Antigravity los audita con un solo aviso del usuario.

### 🛠️ [2026-10-29] - [Siembra de Planeaciones Demo para Pruebas]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(planeacion): agregar siembra de planeaciones demo y botón interactivo para pruebas de simulación`
- **Cambios Realizados:**
  - Se implementó `sembrarPlaneacionesDemoNEM(token)` en `PlaneacionNEM.gs` para generar 3 proyectos completos (1 Global y 2 Personales) con sesiones didácticas asociadas.
  - Se agregó el botón `🌱 Cargar Proyectos Demo` en `AdminPlanJS_02.html`.
  - Se ejecutó `clasp push -f` (85 archivos sincronizados) y `git push origin main` (`3790a1d`).
- **Archivos Afectados:** `PlaneacionNEM.gs`, `AdminPlanJS_02.html`, `.claspignore`, `_PLANTILLA_PROYECTO_NUEVO/.rsc/test_regresion.js`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Permite validar visualmente la cuadrícula de tarjetas, la alternancia entre Banco Personal y Global, y probar el guardado en vivo.

### 🛠️ [2026-10-29] - [Guía Interactiva HTML de Orquestación]
- **Mensaje de Commit sugerido (Conventional Commits):** `docs(orquestacion): crear guía interactiva HTML con prompts copiables en _PLANTILLA_PROYECTO_NUEVO`
- **Cambios Realizados:**
  - Se creó `_PLANTILLA_PROYECTO_NUEVO/INSTRUCCIONES_ORQUESTACION.html` con maquetación interactiva y botones para copiar los prompts de arranque al portapapeles con un clic.
  - Se integró la explicación de roles inmutables y el flujo multi-PC en un formato visual navegable.
  - Se subió el cambio a GitHub en el commit `dfec044`.
- **Archivos Afectados:** `_PLANTILLA_PROYECTO_NUEVO/INSTRUCCIONES_ORQUESTACION.html`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Ofrece al usuario una interfaz visual navegable en cualquier explorador para copiar prompts de arranque sin necesidad de editar markdown.
