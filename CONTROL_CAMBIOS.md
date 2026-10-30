# Control de cambios — Lectura ST90

Pega aquí un bloque por cada cambio cerrado. La fecha es la de America/Monterrey (`AAAA-MM-DD`). La bitácora narrativa sigue en `avances.md`.

### 🛠️ [2026-10-29] - [Guía Interactiva HTML de Orquestación]
- **Mensaje de Commit sugerido (Conventional Commits):** `docs(orquestacion): crear guía interactiva HTML con prompts copiables en _PLANTILLA_PROYECTO_NUEVO`
- **Cambios Realizados:**
  - Se creó `_PLANTILLA_PROYECTO_NUEVO/INSTRUCCIONES_ORQUESTACION.html` con diseño web interactivo premium, modo oscuro elegante, tarjetas de roles y botones de un clic para copiar prompts al portapapeles.
  - Se documentó el ciclo de 4 tiempos y el flujo de portabilidad multi-PC de forma gráfica.
- **Archivos Afectados:** `_PLANTILLA_PROYECTO_NUEVO/INSTRUCCIONES_ORQUESTACION.html`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Ofrece al usuario una interfaz visual navegable en cualquier explorador para copiar prompts de arranque sin necesidad de editar markdown.

### 🛠️ [2026-10-29] - [Kit de Plantilla para Proyectos Nuevos]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(orquestacion): crear carpeta _PLANTILLA_PROYECTO_NUEVO con contratos, reglas y suite de pruebas rsc`
- **Cambios Realizados:**
  - Se estructuró y empaquetó la carpeta `_PLANTILLA_PROYECTO_NUEVO/` con contratos, reglas y arnés de pruebas.
  - Se ejecutó y validó la suite `node .rsc/test_regresion.js` en código de salida 0.
  - Se sincronizó el repositorio en GitHub con el commit `857d3df`.
- **Archivos Afectados:** `_PLANTILLA_PROYECTO_NUEVO/*`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Garantiza que cualquier nuevo proyecto herede la gobernanza tripartita, el control de cambios y la verificación automatizada en menos de 2 minutos.

### 🛠️ [2026-10-29] - [Plantilla Maestra de Orquestación]
- **Mensaje de Commit sugerido (Conventional Commits):** `docs(orquestacion): crear plantilla base reutilizable para proyectos nuevos con antigravity, deepseek y cursor`
- **Cambios Realizados:**
  - Se creó `PLANTILLA_ORQUESTACION_MULTIAGENTE.md` como estándar y guía completa para iniciar cualquier proyecto nuevo bajo la arquitectura multi-agente.
  - Incluye: roles inmutables, ciclo de 4 tiempos, portabilidad multi-PC, prompts de arranque listos para copiar/pegar y plantilla en blanco de `ESTADO_COORDINACION.md`.
- **Archivos Afectados:** `PLANTILLA_ORQUESTACION_MULTIAGENTE.md`, `CONTROL_CAMBIOS.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Se deja documentado el estándar corporativo para que cualquier nuevo repositorio pueda replicar este mismo flujo de trabajo sin fricción.

### 🛠️ [2026-10-29] - [Gobernanza y Sincronización Tripartita]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(orquestacion): formalizar gobernanza de despliegues y contrato vivo para deepseek y cursor`
- **Cambios Realizados:**
  - Se eliminó el archivo huérfano con nombre de URL en la raíz.
  - Se actualizó `ESTADO_COORDINACION.md` estableciendo el protocolo de orquestación a tres bandas (Antigravity, DeepSeek, Cursor) y reservando en exclusiva para Antigravity los permisos de `git commit/push` y `clasp push/deploy`.
  - Se integró la regla de Cursor `control-cambios.mdc` y la bitácora técnica `CONTROL_CAMBIOS.md`.
- **Archivos Afectados:** `.cursor/rules/control-cambios.mdc`, `CONTROL_CAMBIOS.md`, `ESTADO_COORDINACION.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Se centraliza la autoridad de release en Antigravity para evitar errores 403 de GitHub y 401 de Apps Script en entornos en la nube, garantizando que el código pase auditoría de coherencia y selectores antes de llegar a producción.
