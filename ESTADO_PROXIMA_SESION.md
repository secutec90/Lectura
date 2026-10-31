# 📌 ESTADO DE RELEVO Y CONTINUACIÓN DE SESIÓN — ST90
**Fecha de corte:** 2026-10-31  
**Versión activa en producción:** `@556` (`v417 · build-556`)  
**Rama Git:** `main`

---

## 🧭 Para cualquier Agente (Antigravity, Cursor, DeepSeek) al abrir en la otra PC

> **DIRECTIVA OBLIGATORIA:**  
> No le pidas al usuario que repita contexto ni que copie/pegue código manualmente en el chat.  
> Lee este documento, `ESTADO_COORDINACION.md` y los buzones `ENTREGA_CURSOR.md` y `ENTREGA_DEEPSEEK.md`.  
> Continúa directamente en el punto exacto de la **Fase 7 y Módulo de Descarga/PDF Oficial**.

---

## 1. Dónde nos quedamos (Estado del Sistema)

1. **Persistencia y Visibilidad de Planeaciones NEM (100% Operativa):**
   - La base de datos de Google Sheets (`1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU`) contiene **14 de 14 planeaciones didácticas** activas e intactas.
   - El usuario confirmó visualmente en pantalla la carga exitosa de las 14 planeaciones (tanto borradores personales como proyectos colegiados).
   - Se erradicó el error global crítico provocado por un script local (`check_sites`) subido a Google Apps Script que tumbaba las ejecuciones de `google.script.run` con `ReferenceError: require is not defined`.
   - Se blindó `.claspignore` con `**/*.js` y `*.js`, y se normalizaron todas las fechas `Date` a strings ISO serializables en `PlaneacionNEM.gs`.
2. **Despliegues Google Apps Script (Sincronizados en `@555`):**
   - Google Sites (`https://sites.google.com/view/st90/inicio`): `AKfycbz1-xheu_68hU7LpM0_3sUSfqwsb1Hw775eWuHgwmPTJWtvGY7cCh0AR4zcq2Lg32DIBQ` @555.
   - Acceso Directo Web App / Admin: `AKfycbzPQDTjMqHGpSfBg3KMrDBpxSweOAk2x5adcMLJ4aJHvM2ETGtGI-rm1bz3aDRxj-FAgQ` @555.
   - Despliegue Asistencia: `AKfycbwYr2eeYCG7o0fKe1pJr70ljjXsXaA4RUtoM07RdSjtrU0_DTOjOIpG19GIbYtknxWGUg` @555.
   - Réplicas secundarias: @555.
3. **Cinta Ribbon e Iconografía (Fase 5 y 6 Concluidas):**
   - Menú contextual Ribbon estilo aSc Horarios 2027 e iDevices desacoplados en CSS.

---

## 2. Plan Activo: Expansión LMS Secundaria "Suite Escolar ST90"

El ecosistema evoluciona incorporando 4 grandes dimensiones pedagógicas y funcionales:

1. **UI/UX Pedagógica (Iconos ❓ y Asistente 🤖):**
   - Iconos de ayuda en el 80%+ de campos con fundamento NEM, modo de llenado y ejemplos situados.
   - Botón flotante y drawer de chat con DeepSeek sensible a la sección activa en tiempo real.
2. **Biblioteca de Recursos y Libros SEP:**
   - Hoja `BibliotecaRecursos` en Sheets para compartir materiales clasificados por Asignatura, Grado y Trimestre.
   - Visor de Libros de Texto SEP Fase 6.
3. **Adecuación Curricular para Tecnología (CECSE):**
   - Motor de IA configurado para 1° (Word), 2° (Excel), 3° (PowerPoint + IA) y carga horaria: 2h Teoría / 6h Práctica en Aula de Cómputo.
4. **Constructor de Clases y Facilitadores:**
   - Modal de vista previa simulada del alumno y soporte para bloque de incrustación HTML/Iframe (Genially, H5P, Canva).

### 🎯 Partitura de Asignación por Agente:

| Agente | Responsabilidad Inmediata | Buzón / Archivo |
| :--- | :--- | :--- |
| **Cursor** *(Lógica Frontend)* | Programar `AyudaJS.html`, función global `abrirAyuda(...)`, catálogo `DICCIONARIO_AYUDA_NEM`, controlador del drawer de chat IA con contexto activo, eventos de biblioteca y `abrirVistaPreviaAlumno_()`. | `ENTREGA_CURSOR.md`<br>`AyudaJS.html`<br>`AdminPlanJS_*.html` |
| **DeepSeek** *(Diseño UI/UX)* | Diseñar estilos CSS para `.btn-ayuda-nem`, `#modalAyudaNEM`, `#btnAsistenteFlotanteIA`, `#drawerAsistenteIA`, `#vistaBibliotecaDocente`, `#modalPreviewAlumno` y `.bloque-iframe-container`. | `ENTREGA_DEEPSEEK.md`<br>`AdminPlaneacionCSS.html`<br>`ComunCSS.html` |
| **Antigravity** *(Backend & Gobernanza)* | Crear hoja `BibliotecaRecursos` en `03_Setup.gs`, endpoints `subirRecursoBiblioteca` / `listarRecursosBiblioteca`, inyección curricular de Tecnología CECSE en prompts de `PlaneacionNEM.gs` (`asistirDisenoProyectoNEM`), endpoint de chat IA contextual, auditoría y despliegue a `@556`. | `03_Setup.gs`<br>`PlaneacionNEM.gs`<br>`09_IA.gs`<br>`CONTROL_CAMBIOS.md` |

---

## 3. Checklist de Ejecución y Próximo Cierre (@556)

1. **DeepSeek** elabora su propuesta visual y CSS en [ENTREGA_DEEPSEEK.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/ENTREGA_DEEPSEEK.md).
2. **Cursor** elabora la lógica de interacción y controladores en [ENTREGA_CURSOR.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/ENTREGA_CURSOR.md).
3. **Antigravity** programa el backend (`03_Setup.gs`, `PlaneacionNEM.gs`, `09_IA.gs`), audita buzones, compila el manifiesto (`node herramientas/manifiesto.js`) y ejecuta el despliegue oficial.

