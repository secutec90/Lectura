# 📌 ESTADO DE RELEVO Y CONTINUACIÓN DE SESIÓN — SUITE ESCOLAR ST90
**Fecha de corte:** 2026-10-31  
**Versión activa en producción:** `@562` (`v417 · build-562`)  
**Rama Git:** `main` (Sincronizada con GitHub)  
**Base de datos:** Google Sheets ID `1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU` (14/14 planeaciones íntegras)

---

## 🧭 Directiva para los 3 Agentes (Antigravity, Cursor, DeepSeek) al Iniciar Mañana

> **DIRECTIVA OBLIGATORIA (CERO PREGUNTAS REDUNDANTES AL USUARIO):**  
> No le pidas al usuario que repita contexto ni que copie/pegue código manualmente en el chat.  
> Lee este documento, `ESTADO_COORDINACION.md` y tus buzones `ENTREGA_CURSOR.md` o `ENTREGA_DEEPSEEK.md`.  
> Continúa directamente en el punto exacto de la **Etapa 2: Contenidos Sintéticos & PDA (NEM Fase 6)**.

---

## 1. Dónde nos quedamos (Hitos Concluidos en `@562`)

1. **Clarificación Normativa de la Fila 1 (Etapa 1 - NEM Fase 6):**
   - **Campo Formativo:** Normativo obligatorio por disciplina (Tecnología pertenece por ley a *De lo Humano y lo Comunitario*; Geografía a *Ética, Naturaleza y Sociedades*).
   - **Metodología Sociocrítica:** Autonomía docente abierta (ABP, STEAM, Aprendizaje Servicio, Proyectos Comunitarios). Desbloqueada sin restricciones en `AdminPlanJS_04.html` y `ClaseJS_05.html`.
   - **Sesiones (40 min):** Flexible (3 a 25 sesiones). En Tecnología ST90 se organiza con la estructura CECSE (2h aula teoría + 6h cómputo).
   - **Título del Proyecto:** Personalizable y convocante, superando las etiquetas técnicas provisionales.
2. **Avatar Ilustrado de la Asesora Pedagógica NEM:**
   - Se reemplazó el robot genérico (`🤖`) por una ilustración 3D cálida, profesional y moderna de una mentora secundaria mexicana.
   - Optimizado en miniatura 128x128px y embebido en base64 (`AVATAR_ASESOR_NEM_B64_` en `AyudaJS.html`).
   - Aplicado al botón flotante (`#btnAsistenteFlotanteIA`), a la cabecera del drawer lateral (`.ia-avatar`) y a las cabeceras de sección con `✨`.
3. **Sugerencia e Inserción de Título con 1 Clic:**
   - Botón `#btnSugerirTituloIA` (`✨ Sugerir con IA`) en el campo `#planTitulo`.
   - Generación de 3 títulos contextualizados según Asignatura, Grado y Trimestre calendario oficial.
   - Chips interactivos en la burbuja de la IA `[➕ Usar este título]` conectados a `aplicarTituloAlPlan(nuevoTitulo)` con animación visual de resalte.
4. **Asistente de Voz DUA con Web Speech API:**
   - Narración oral `🔊` en cada icono `❓` (`.btn-voz-nem`) y en el modal de ayuda pedagógica.
   - Lectura de respuestas didácticas de la IA (`🔊 Escuchar`) y dictado de consultas por voz con micrófono `🎙️`.
5. **Producción Operativa:**
   - Desplegado a los 5 endpoints oficiales en Google Apps Script (`@562`), verificado con `curl.exe` (HTTP 200).
   - Las 14 planeaciones didácticas en Google Sheets se mantienen íntegras y verificadas.

---

## 2. Partitura y Tareas Programadas para Mañana: ETAPA 2 (CONTENIDOS SINTÉTICOS Y PDA)

La orquesta se concentra en la experiencia pedagógica de la **Etapa 2 (Contenidos & PDA)** y su articulación comunitaria:

### Contrato Técnico Inmutable de Selectores (Etapa 2):
- Pestaña de Etapa 2: `button#tabPasoPlan2`
- Contenedor de Etapa 2: `div#etapaPlanNEM_2`
- Contenido Sintético Oficial: `textarea#planContenidoSintetico`
- Procesos de Desarrollo de Aprendizaje: `textarea#planPDA`
- Contador reactivo de PDA: `#badgeContadorPDA`
- Selector de Trimestre curricular: `#selTrimestrePDA` (T1, T2, T3)

---

### 🎯 Tareas Asignadas por Agente para la Sesión de Mañana:

| Agente | Responsabilidad Inmediata | Archivo / Buzón |
| :--- | :--- | :--- |
| **Cursor** *(Lógica Frontend DOM)* | 1. **Sincronización Reactiva:** Poblar reactivamente el catálogo de Contenidos Sintéticos oficiales de la SEP según Asignatura y Grado de Etapa 1.<br>2. **Filtrado de PDA por Trimestre:** Mostrar los PDA correspondientes al trimestre activo con casillas interactivas `.ia-pda-checkbox`.<br>3. **Selección Dinámica:** Al marcar/desmarcar casillas, anexar viñetas a `#planPDA` y actualizar el contador `#badgeContadorPDA`.<br>4. **Asistente IA para PDA:** Conectar `✨ Sugerir con IA` para redactar PDA adaptados a barreras DUA e insertarlos con 1 clic. | [ENTREGA_CURSOR.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/ENTREGA_CURSOR.md)<br>[AdminPlanJS_03.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/AdminPlanJS_03.html)<br>[ClaseJS_05.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/ClaseJS_05.html) |
| **DeepSeek** *(Diseño UI/UX)* | 1. **Grid de Contenidos Sintéticos:** Maquetar tarjetas interactivas `.card-contenido-nem` con elevación y estado `.seleccionado`.<br>2. **Paleta Oficial de Campos:** Badges diferenciados por Campo Formativo (Lenguajes: Azul `#1e40af`, Saberes: Violeta `#6d28d9`, Ética: Ámbar `#c2410c`, De lo Humano: Verde `#047857`).<br>3. **Lista de PDA:** Diseño ergonómico de filas con checkboxes estilizados y micro-animación en `#badgeContadorPDA`. | [ENTREGA_DEEPSEEK.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/ENTREGA_DEEPSEEK.md)<br>[AdminPlaneacionCSS.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/AdminPlaneacionCSS.html)<br>[ComunCSS.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/ComunCSS.html) |
| **Antigravity** *(Backend & QA)* | 1. **Matriz Curricular Fase 6:** Asegurar en `PlaneacionNEM.gs` los catálogos curriculares oficiales de Contenidos y PDA de la SEP.<br>2. **Persistencia Backend:** Endpoint para guardar la matriz de PDA seleccionados en Google Sheets sin romper compatibilidad.<br>3. **Auditoría & Despliegue:** Validar que Cursor y DeepSeek respeten los contratos inmutables, compilar `build-563`, crear versión `@563` en clasp y hacer push a GitHub. | [PlaneacionNEM.gs](file:///g:/Mi%20unidad/PROYECTOS/Lectura/PlaneacionNEM.gs)<br>[CONTROL_CAMBIOS.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/CONTROL_CAMBIOS.md)<br>[avances.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/avances.md) |

---

## 3. Checklist de Arranque Mañana

1. **Cursor** abre [ENTREGA_CURSOR.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/ENTREGA_CURSOR.md) y ejecuta la lógica de selección de Contenidos y PDA.
2. **DeepSeek** abre [ENTREGA_DEEPSEEK.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/ENTREGA_DEEPSEEK.md) y aplica los estilos visuales para las tarjetas y badges de campo.
3. **Antigravity** audita la integración, valida con `node herramientas/manifiesto.js`, ejecuta `clasp push / deploy` a `@563` y sella la bitácora.
