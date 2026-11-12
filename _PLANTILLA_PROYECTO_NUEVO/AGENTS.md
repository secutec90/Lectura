# REGLAS GLOBALES DEL REPOSITORIO PARA AGENTES DE IA

Este proyecto opera bajo una orquesta estricta de 3 agentes (Antigravity + DeepSeek + Cursor).  
Todos los modelos deben acatar automáticamente estas reglas sin requerir que el usuario las repita:

---

## 1. Regla de Entrega Automática (Cero Copiado Manual)

- **DeepSeek:** Cada vez que elabores una propuesta visual, estilos CSS o maquetación, debes escribirla y guardarla **automáticamente en `ENTREGA_DEEPSEEK.md`**.
- **Cursor:** Cada vez que desarrolles lógica de cliente o manipulación del DOM, debes escribirla y guardarla **automáticamente en `ENTREGA_CURSOR.md`**.
- **Antigravity:** Es el único agente que lee los buzones, audita coherencia de selectores, integra el código final y ejecuta `git commit / push` y despliegues.

---

## 2. Contratos Inmutables

- Todos los agentes leen `ESTADO_COORDINACION.md` antes de actuar.
- Ningún agente puede renombrar IDs del DOM sin autorización de Antigravity.
- DeepSeek y Cursor tienen prohibido ejecutar `git commit`, `git push` o comandos de despliegue.

---

## 3. Protocolo de Enlace y Vigilancia Activa de la Orquesta

- **Arquitectura de Sincronización:**  
  Los agentes conversacionales (Cursor Composer y DeepSeek Harness) concluyen su turno tras guardar en su buzón para permitir la auditoría de Antigravity.
- **Vigilante Global de Orquesta (`iniciar_vigilante.cmd` / `node .rsc/vigilante_orquesta.js`):**
  - Corre de fondo supervisando los buzones y `ESTADO_COORDINACION.md`.
  - Cuando Antigravity deposita una nueva partitura (`🟢 PROGRAMADA` / `🎯 PARTITURA ASIGNADA`):
    1. Emite una señal acústica en Windows (`SystemSounds::Exclamation`).
    2. Dispara una notificación emergente en la bandeja del sistema (Toast / Balloon).
    3. Copia automáticamente al **Portapapeles de Windows** el mensaje de arranque (`Ctrl+V` + `Enter` en la ventana del agente correspondiente).
  - Al recibir dicho estímulo, el agente procede inmediatamente a leer su buzón y ejecutar la tarea de inicio a fin.
