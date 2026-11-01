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
  - **Cursor:** Ejecutar `node .rsc/centinela_buzon.js cursor`
  - **DeepSeek:** Ejecutar `node .rsc/centinela_buzon.js deepseek`
- En cuanto el centinela detecte una nueva tarea (`🟢 PROGRAMADA` / `PARTITURA ASIGNADA`), el agente volverá a leer su buzón (`ENTREGA_CURSOR.md` o `ENTREGA_DEEPSEEK.md`) y `ESTADO_COORDINACION.md` y ejecutará la nueva tarea de forma autónoma.
