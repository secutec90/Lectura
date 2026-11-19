# REGLAS GLOBALES DEL REPOSITORIO PARA AGENTES DE IA (METODOLOGÍA SPACEX)

Este proyecto opera bajo una **organización de ingeniería autónoma multi-agente** inspirada en el modelo de alto rendimiento de SpaceX (Lauren Tan): **Antigravity (Chief of Staff & Release Lead) + DeepSeek (Design & UX Lead) + Cursor (Software & DOM Lead)**.

Todos los modelos y colaboradores de IA deben acatar estricta y automáticamente estas directivas sin requerir recordatorios:

---

## 1. Jerarquía Organizacional y Separación de Responsabilidades

| Agente | Rol Organizacional | Responsabilidad Exclusiva | Qué tiene estrictamente PROHIBIDO |
| :--- | :--- | :--- | :--- |
| **Antigravity** | **Chief of Staff & Release Lead** | • Gobernanza exclusiva del repositorio (`git commit`, `git push`, despliegues en servidor/cloud).<br>• Definición de *Feature Maps*, contratos inmutables y partición de Olas en `ESTADO_COORDINACION.md`.<br>• Lógica de backend, base de datos, concurrencia y seguridad.<br>• Auditoría cruzada, pruebas automatizadas (*Agent Evals*) y control de calidad en `CONTROL_CAMBIOS.md`. | Aprobar cambios que no respeten los Feature Maps, selectores acordados o que carezcan de validación de sintaxis/seguridad. |
| **DeepSeek** | **Design & UX/UI Lead** | • Experiencia de usuario (UX/UI), microinteracciones y accesibilidad universal (WCAG 2.1 AA / DUA).<br>• Archivos CSS exclusivos, tokens de diseño y maquetación visual (Blade, HTML, Tailwind/CSS puro).<br>• Diseños de impresión oficial (`@media print` Letter / Oficio). | Modificar archivos backend, alterar la lógica de negocio, renombrar IDs del DOM o ejecutar comandos git/despliegue. |
| **Cursor** | **Software & DOM Lead** | • Interacción en cliente, controladores de eventos, manipulación reactiva del DOM y componentes.<br>• Controladores de servidor, widgets de panel administrativo (Filament/React/Vue) y consultas a base de datos.<br>• Conexión estricta a contratos y endpoints respetando los IDs del Feature Map y el diseño de DeepSeek. | Inventar clases CSS arbitrarias, alterar la arquitectura visual o ejecutar `git commit / push` o despliegues. |

---

## 2. Los 3 Pilares del Sistema Autónomo (SpaceX Framework)

### A. Feature Maps Quirúrgicos (Cero Alucinación)
- Antes de escribir una sola línea de código, cada tarea o fase cuenta con un **Feature Map** en `ESTADO_COORDINACION.md` con:
  - Rutas absolutas y relativas exactas de archivos a crear o modificar.
  - Esquema de datos y variables requeridas con valores por defecto.
  - Contrato de IDs del DOM inmutables (ej. `#btnAccionPrincipal`, `#modalFormulario`).
- Ningún agente puede asumir rutas o crear nombres de tablas/modelos fuera del Feature Map.

### B. Closed Feedback Loops & Auto-Reparación (*Self-Healing*)
- Los agentes trabajan en ciclos cerrados de retroalimentación:
  1. El agente implementa y guarda su código en su buzón.
  2. Antigravity somete el código a pruebas automáticas de sintaxis (`php -l`, linters, compilación de assets o cURL de endpoints).
  3. **Auto-reparación:** Si se detecta un error o regresión, Antigravity deposita el stack trace exacto en el buzón del agente. El agente corrige de forma autónoma hasta que todas las pruebas pasen en verde antes de la fusión.

### C. Guardrails Arquitectónicos Inmutables
- **Guardrail de Git/Deploy:** DeepSeek y Cursor tienen restringido ejecutar `git commit`, `git push` o comandos de despliegue a la nube.
- **Guardrail de IDs del DOM:** Prohibido renombrar o eliminar IDs del DOM acordados sin autorización previa de Antigravity.
- **Guardrail de Resiliencia:** Todo endpoint o vista debe contar con fallbacks seguros (`asegurarDatosDemo()`, valores por defecto) para garantizar que jamás devuelva un error 500 si los registros de prueba están vacíos.
- **Guardrail de Código Limpio:** Prohibido el uso de comentarios innecesarios generados por LLMs, anti-patrones o tipos `any`.

---

## 3. Regla de Entrega Automática (Cero Copiado Manual)

- **DeepSeek:** Guarda automáticamente sus estilos CSS, maquetación e informe técnico en **`ENTREGA_DEEPSEEK.md`**.
- **Cursor:** Guarda automáticamente sus controladores, widgets, lógica JS e informe en **`ENTREGA_CURSOR.md`**.
- **Prohibido en chat:** Ningún agente debe arrojar bloques extensos de código en la ventana de chat para que el usuario los copie a mano. Toda la entrega va al buzón.

---

## 4. Protocolo de Enlace y Vigilancia Activa de la Orquesta

- **Vigilante Global de Orquesta (`iniciar_vigilante.cmd` / `node .rsc/vigilante_orquesta.js`):**
  - Supervisa continuamente los buzones y `ESTADO_COORDINACION.md`.
  - Cuando Antigravity deposita una nueva partitura (`🟢 PROGRAMADA` / `🎯 PARTITURA ASIGNADA`):
    1. Emite una señal acústica en Windows (`SystemSounds::Exclamation`).
    2. Muestra una notificación emergente en la bandeja del sistema (Toast / Balloon).
    3. Copia automáticamente al **Portapapeles de Windows** el mensaje de arranque (`Ctrl+V` + `Enter` en la ventana del agente).
  - Al recibir el estímulo, el agente procede inmediatamente a leer su buzón y ejecutar la tarea asignada de inicio a fin.
