# BITÁCORA Y CONTRATO DE TRABAJO VIVO: ORQUESTA MULTI-AGENTE (SPACEX FRAMEWORK)

**Proyecto:** [Nombre del Proyecto]  
**Repositorio:** [URL de GitHub]  
**Chief of Staff & Release Lead:** Antigravity  
**Design & UX/UI Lead:** DeepSeek  
**Software & DOM Lead:** Cursor  

---

## 1. Protocolo de Gobernanza y Roles Inmutables

| Rol | Agente | Partitura y Responsabilidad Exclusiva | Qué tiene estrictamente PROHIBIDO |
| :--- | :--- | :--- | :--- |
| **Chief of Staff & Release Lead** | **Antigravity** | • **Gobernanza exclusiva:** Único autorizado para `git commit`, `git push` y despliegues a servidores/cloud.<br>• Diseña la arquitectura, redacta los *Feature Maps* e IDs del DOM en este documento.<br>• Desarrolla la lógica backend, APIs, modelos relacionales y seguridad.<br>• Ejecuta las pruebas automatizadas (*Agent Evals*) y bucles de auto-reparación.<br>• Audita y estampa el cierre de Olas en `CONTROL_CAMBIOS.md`. | Aprobar cambios que no respeten los Feature Maps, que rompan contratos de datos o que carezcan de pruebas de integración. |
| **Design & UX/UI Lead** | **DeepSeek** *(Harness)* | • Experiencia de usuario (UX/UI), microinteracciones y accesibilidad DUA / WCAG 2.1 AA.<br>• Archivos CSS exclusivos, maquetación (Blade, HTML, Tailwind/CSS puro) y tipografía.<br>• Plantillas oficiales de pantalla e impresión (`@media print` Letter / Oficio). | Modificar funciones backend, renombrar IDs del DOM sin autorización, o ejecutar comandos de git/despliegue. |
| **Software & DOM Lead** | **Cursor** | • Interacción del cliente, eventos (`click`, `change`, `submit`) y manipulación del DOM.<br>• Controladores de servidor, widgets administrativos (Filament/React), servicios y consultas optimizadas.<br>• Conexión estricta a contratos y endpoints respetando los IDs del Feature Map y el diseño de DeepSeek. | Inventar clases CSS arbitrarias, modificar la arquitectura visual sin acuerdo o ejecutar push a GitHub. |

---

## 2. Prompts de Arranque Rápido para Agentes

### Para DeepSeek (Harness / Web):
> *"Actúas como Design & UX/UI Lead de este proyecto bajo la metodología SpaceX. Tu partitura oficial y Feature Map están en `ESTADO_COORDINACION.md` y `ENTREGA_DEEPSEEK.md`. Solo modificas archivos CSS, maquetación visual y tokens de diseño asignados. Respeta estrictamente los IDs del DOM acordados. Tienes estrictamente prohibido ejecutar git commit/push o comandos de despliegue. Guarda tu entrega completa en `ENTREGA_DEEPSEEK.md` y al terminar ejecuta `node .rsc/centinela_buzon.js deepseek --intervalo=60 --max-ciclos=0` para esperar la siguiente tarea."*

### Para Cursor:
> *"Actúas como Software & DOM Lead de este proyecto bajo la metodología SpaceX. Tu partitura oficial y Feature Map están en `ESTADO_COORDINACION.md` y `ENTREGA_CURSOR.md`. Solo modificas controladores, widgets, lógica de cliente y conexión backend asignados. Respeta estrictamente los IDs del DOM y las clases visuales de DeepSeek. Tienes prohibido hacer commit/push o alterar el despliegue. Guarda tu entrega completa en `ENTREGA_CURSOR.md` y al terminar ejecuta `node .rsc/centinela_buzon.js cursor --intervalo=60 --max-ciclos=0` para esperar la siguiente tarea."*

---

## 3. Tarea Activa: OLA 1 — [Definición de la Primera Funcionalidad]

### 🎯 Objetivo del Usuario:
[Descripción concisa, clara y medible del resultado esperado]

### 🗺️ Feature Map de la Fase (Contrato Inmutable):
- **Archivos Asignados:**
  - Vistas / CSS (DeepSeek): `resources/views/...` o `public/css/...`
  - Lógica / Controladores (Cursor): `app/Http/Controllers/...` o `app/Filament/Widgets/...`
  - Backend / Migraciones (Antigravity): `database/migrations/...`, `routes/web.php`
- **Contrato de IDs del DOM acordados:**
  - `#idElemento1`: [Descripción y comportamiento esperado]
  - `#idElemento2`: [Descripción y comportamiento esperado]
- **Clases CSS semánticas acordadas:** `.modulo-card`, `.modulo-card--activo`, `.btn-accion`
- **Esquema de Datos y Variables (Firma de Backend):**
  - `$datosVista`: Array o Modelo con campos `['id', 'nombre', 'estado']`
- **Guardrails Específicos:**
  - Resiliencia obligatoria: Implementar `asegurarDatosDemo()` para fallback en caso de tabla vacía.
  - Cero dependencias externas no declaradas.

### 📋 Asignación de Partituras por Agente:
| Agente | Estado | Archivos Destino | Tarea Específica |
| :--- | :---: | :--- | :--- |
| **DeepSeek** *(UX/UI)* | 🟡 **PARTITURA ASIGNADA** | `[Rutas de vistas/CSS]` | Maquetación visual, diseño responsivo, estados interactivos y estilos. Guardar en `ENTREGA_DEEPSEEK.md`. |
| **Cursor** *(Lógica/DOM)* | 🟡 **PARTITURA ASIGNADA** | `[Rutas de controladores/JS]` | Controladores, consultas, validaciones de formulario y widgets. Guardar en `ENTREGA_CURSOR.md`. |
| **Antigravity** *(Chief of Staff)* | 🟢 **SUPERVISIÓN & EVALS** | `[Migraciones/Rutas/Despliegue]` | Auditoría técnica cruzada, pruebas sintácticas (`php -l`), pruebas de endpoint cURL, commit y push. |

---

## 4. Historial de Olas Concluidas

- **OLA 0 (Configuración Inicial):** ✅ Repositorio inicializado, kit de gobernanza multi-agente SpaceX instalado, herramientas `.rsc` y vigilante de orquesta listos.
