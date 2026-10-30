# Control de cambios — Lectura ST90

Pega aquí un bloque por cada cambio cerrado. La fecha es la de America/Monterrey (`AAAA-MM-DD`). La bitácora narrativa sigue en `avances.md`.

### 🛠️ [2026-10-29] - [Gobernanza y Sincronización Tripartita]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(orquestacion): formalizar gobernanza de despliegues y contrato vivo para deepseek y cursor`
- **Cambios Realizados:**
  - Se eliminó el archivo huérfano con nombre de URL en la raíz.
  - Se actualizó `ESTADO_COORDINACION.md` estableciendo el protocolo de orquestación a tres bandas (Antigravity, DeepSeek, Cursor) y reservando en exclusiva para Antigravity los permisos de `git commit/push` y `clasp push/deploy`.
  - Se integró la regla de Cursor `control-cambios.mdc` y la bitácora técnica `CONTROL_CAMBIOS.md`.
- **Archivos Afectados:** `.cursor/rules/control-cambios.mdc`, `CONTROL_CAMBIOS.md`, `ESTADO_COORDINACION.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Se centraliza la autoridad de release en Antigravity para evitar errores 403 de GitHub y 401 de Apps Script en entornos en la nube, garantizando que el código pase auditoría de coherencia y selectores antes de llegar a producción.
