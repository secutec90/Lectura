# BITÁCORA Y CONTRATO DE TRABAJO VIVO: ORQUESTA MULTI-AGENTE (ANTIGRAVITY + DEEPSEEK + CURSOR)

**Proyecto:** [Nombre del Proyecto]  
**Repositorio:** [URL de GitHub]  
**Director & Release Manager:** Antigravity  
**Diseño Visual & CSS:** DeepSeek  
**Frontend JS & DOM:** Cursor  

---

## 1. Protocolo de Gobernanza y Roles Inmutables

| Rol | Agente | Partitura y Responsabilidad Exclusiva | Qué tiene estrictamente PROHIBIDO |
| :--- | :--- | :--- | :--- |
| **Director & Auditor Técnico** | **Antigravity** | • **Gobernanza exclusiva:** Único autorizado para `git commit`, `git push` y comandos de despliegue a producción.<br>• Diseña la arquitectura y redacta los IDs del DOM en este documento.<br>• Desarrolla la lógica backend, bases de datos y seguridad.<br>• Audita el código de DeepSeek y Cursor antes de darlo por cerrado.<br>• Registra el cierre en `CONTROL_CAMBIOS.md`. | Aprobar cambios que no respeten los selectores acordados o que carezcan de validaciones/seguridad. |
| **Diseñador Visual & DUA** | **DeepSeek** *(Harness)* | • Experiencia de usuario (UX/UI), microinteracciones y accesibilidad.<br>• Archivos CSS exclusivos y estructura visual.<br>• Tarjetas, estados interactivos y paleta semántica. | Modificar funciones backend, renombrar IDs del DOM sin autorización, o ejecutar comandos de git/despliegue. |
| **Ingeniero Frontend** | **Cursor** | • Interacción del cliente, eventos click/change/submit y manipulación del DOM.<br>• Fragmentos JS de cliente y conexión con APIs/backend.<br>• Respeta estrictamente los IDs definidos por Antigravity y las clases visuales de DeepSeek. | Inventar clases CSS arbitrarias, modificar la lógica de base de datos o ejecutar push a GitHub. |

---

## 2. Prompts de Arranque Rápido para Agentes

### Para DeepSeek (Harness / Web):
> *"Actúas como Diseñador UI/UX y Especialista CSS de este proyecto. Tu partitura oficial está en `ESTADO_COORDINACION.md`. Solo tocas archivos CSS y estructura visual designados. Respeta estrictamente los IDs del DOM acordados; no los cambies. Tienes estrictamente prohibido ejecutar git commit/push o comandos de despliegue. Lee `ESTADO_COORDINACION.md` y confirma tu comprensión de la tarea asignada."*

### Para Cursor:
> *"Actúas como Desarrollador Frontend JS de este proyecto. Tu partitura oficial está en `ESTADO_COORDINACION.md` y tu regla de registro en `.cursor/rules/control-cambios.mdc`. Solo modificas fragmentos JS del cliente y conexión con backend. Respeta estrictamente los IDs del DOM y las clases visuales acordadas. Tienes prohibido hacer commit/push o alterar la base de datos. Lee `ESTADO_COORDINACION.md` y confirma tu comprensión de la tarea asignada."*

---

## 3. Tarea Activa: FASE 1 — [Definición de la Primera Funcionalidad]

### Objetivo del usuario:
[Descripción simple y clara de lo que se busca lograr]

### Contrato Técnico (DOM y Backend):
- **IDs del DOM acordados:**
  - `#idElemento1` (Descripción)
  - `#idElemento2` (Descripción)
- **Clases CSS semánticas:** `.nombre-clase`, `.nombre-clase--activo`
- **Funciones Backend / Endpoints:** `nombreFuncionBackend(param1, param2)`

### Partituras Específicas por Agente:
| Agente | Archivos Asignados | Tarea Específica |
| :--- | :--- | :--- |
| **DeepSeek** | `estilos.css` | Maquetar y estilizar los elementos respetando los IDs anteriores. |
| **Cursor** | `app.js` | Capturar los eventos del DOM y conectar la llamada a la función backend. |
| **Antigravity** | `backend.ext` | Construir y blindar el endpoint backend con validaciones. |

---

## 4. Historial de Fases Concluidas

- **FASE 0 (Configuración Inicial):** ✅ Repositorio inicializado, kit de gobernanza multi-agente instalado y suite de pruebas `.rsc` lista.
