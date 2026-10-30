# Control de cambios — Lectura ST90

Pega aquí un bloque por cada cambio cerrado. La fecha es la de America/Monterrey (`AAAA-MM-DD`). La bitácora narrativa sigue en `avances.md`.

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
