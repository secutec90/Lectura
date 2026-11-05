# REGLAS GLOBALES DEL REPOSITORIO PARA AGENTES DE IA

Este proyecto opera bajo una orquesta estricta de 3 agentes (Antigravity + DeepSeek + Cursor).  
Todos los modelos deben acatar automáticamente estas reglas sin requerir que el usuario las repita:

---

## 1. Regla de Entrega Automática (Cero Copiado Manual)

- **DeepSeek:** Cada vez que elabores una propuesta visual, estilos CSS o maquetación, debes escribirla y guardarla **automáticamente en `ENTREGA_DEEPSEEK.md`**.
- **Cursor:** Cada vez que desarrolles lógica de cliente o manipulación del DOM, debes escribirla y guardarla **automáticamente en `ENTREGA_CURSOR.md`**.
- **Antigravity:** Es el único agente que lee los buzones, audita coherencia de selectores, integra el código final y ejecuta `git commit / push` y `clasp push`.

---

## 2. Contratos Inmutables

- Todos los agentes leen `ESTADO_COORDINACION.md` antes de actuar.
- Ningún agente puede renombrar IDs del DOM sin autorización de Antigravity.
- DeepSeek y Cursor tienen prohibido ejecutar `git commit`, `git push` o comandos de despliegue.

---

## 3. Protocolo Centinela de Escucha Continua (Polling Automático cada 60 segundos)

- **Después de terminar cualquier tarea y guardar su entrega en el buzón**, tanto **Cursor** como **DeepSeek** NO deben cerrar su sesión en estado inactivo: deben activar inmediatamente el vigilante de buzón para revisar cada 60 segundos si Antigravity ya depositó la siguiente partitura:
  - **Cursor:** Ejecutar `node .rsc/centinela_buzon.js cursor --intervalo=60 --max-ciclos=0`
  - **DeepSeek:** Ejecutar `node .rsc/centinela_buzon.js deepseek --intervalo=60 --max-ciclos=0`
- En cuanto el centinela detecte una nueva partitura, el agente volverá a leer su buzón (`ENTREGA_CURSOR.md` o `ENTREGA_DEEPSEEK.md`) y `ESTADO_COORDINACION.md` y ejecutará la nueva tarea de forma autónoma.

### 3.1 Política del centinela v2 (vigente desde 2026-11-01)

- **Huella por partitura, no por archivo.** El centinela firma el bloque de partitura con sus **dos primeras líneas con contenido** más el número de marcas `🟢`. Escribir la entrega debajo de la partitura, reformatear la tabla de reparto o añadir párrafos al final del bloque no lo despierta.
- **Contrapartida obligatoria:** toda partitura nueva debe estrenar **título propio** (por ejemplo `## 🎯 PARTITURA ASIGNADA: OLA 6 …`) o añadir una marca `🟢` de estado. Si Antigravity reemplaza el contenido manteniendo idéntico el encabezado y sin marcas nuevas, el centinela la considerará la misma partitura y no avisará.
- **Todo aviso declara el origen:** `ENTREGA_DEEPSEEK.md`, `ENTREGA_CURSOR.md`, `ESTADO_COORDINACION.md` o `AMBOS`. Nunca se vuelve a imprimir el buzón como si fuera la partitura cuando el que cambió fue el otro archivo.
- **Filtro por agente.** Si el bloque modificado no nombra al agente vigilado, no lo despierta: un cambio en la fila de Cursor no interrumpe a DeepSeek.
- **Silencio explícito.** Si un archivo cambia pero su partitura es la misma, el centinela lo informa una sola vez (`· X cambió, pero sin partitura nueva`) y sigue vigilando, en lugar de dar una falsa alarma.
- **Reescrituras de la tabla de reparto no cuentan como partitura.** Actualizar `ESTADO_COORDINACION.md` para formalizar una asignación ya entregada no dispara avisos si el bloque de tarea no cambia.
