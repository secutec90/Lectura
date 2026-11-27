# 🎯 BUZÓN DE TRABAJO — CURSOR (SOFTWARE & DOM LEAD)
**Proyecto:** Suite Escolar Academia (Laravel 12 + Filament v3) — EST 90  
**Gobernanza:** Metodología SpaceX Multi-Agente (Lauren Tan)  
**Estado:** 🟢 **ENTREGA 1 COMPLETADA Y VERIFICADA EN PRODUCCIÓN | ENTREGAS 2, 3 Y 4 LISTAS**  
**Director & Release Lead:** Antigravity | **Design & UX Lead:** DeepSeek  

---

## 1. Resumen de Entrega 1 (Completada y Desplegada en `79bee003`)
- **Editor Visual en Tarjeta:**
  - Selector de tamaño de letra (10px a 24px con `card-tool-size`).
  - Botones de historial deshacer (`↩️`) y rehacer (`↪️`).
  - Operaciones de tabla avanzadas: adición de filas/columnas y eliminación de columnas individuales (`🗑️Col`).
  - Interceptor de Word local activo purgado de estilos propietarios.
- **Desacoplamiento Estricto Borrador / Publicado:**
  - Columna `lienzo_publicado_json` agregada con autorreparación automática.
  - Endpoint `POST /api/aula/sesion/{id}/publicar` habilitado.
  - Modificar y guardar borradores ya no altera la vista del alumno hasta pulsar «Publicar».
  - Gate 404 estricto para tokens o IDs inválidos.
- **Purga de Bloques Huérfanos:**
  - Erradicado cualquier bloque raíz huérfano (`.seccion-renderizada`) para impedir que el texto flote fuera de las tarjetas.
- **Prueba Funcional:** Acreditada con clase de dos páginas (P1: Texto y tabla DUA, P2: Video MP4 vertical 9:16).

---

## 2. Asignación Activa: ENTREGA 2 — Formatos Restantes en Tarjeta
**Objetivo:** Completar la edición contextual dentro de la tarjeta (`.card-editor-inline`) para los 5 formatos restantes:
1. **Tabla (`tabla`):** Selector de filas y columnas, alineación de texto y edición de celdas con guardado inmutable en `data-config`.
2. **Imagen / Galería (`imagen`, `galeria`):** URL de imagen, recorte responsivo (16:9, 4:3, 1:1, original), alineación y texto alternativo DUA para lector de pantalla.
3. **Audio (`audio`):** URL de archivo de sonido / podcast y transcripción textual accesible DUA.
4. **Línea de Tiempo (`timeline`):** Editor de hitos (minutos/etapas, títulos y descripciones de los momentos de la clase).
5. **Actividad (`actividad`):** Consigna pedagógica, producto esperado, criterios de éxito e interruptor de entrega obligatoria.

---

## 3. Asignación en Paralelo: ENTREGAS 3 Y 4 — Módulo de Formularios Independiente y Vinculación al Constructor
**Referencia Arquitectónica:** Suite de Google Apps Script (`AdminEncJS_*.html` / `FormEncJS_*.html`).
**Contrato del Dominio en Laravel:**
1. **Modelos:**
   - `Formulario` (título, descripción, tipo: `encuesta` o `quiz`).
   - `VersionPublicada` (instantánea inmutable de reactivos y clave de respuestas).
   - `AplicacionFormulario` (asignación a grupo o sesión de clase con fecha límite y temporizador).
   - `RespuestaFormulario` (intentos de alumnos calificados en servidor para quiz o sin nota para encuesta).
2. **Reglas Inmutables:**
   - Encuesta: sin ponderación, tabulación gráfica de respuestas.
   - Quiz: calibración obligatoria de reactivos, clave de respuestas y retroalimentación formativa por servidor.
   - Vista previa docente: protegida con flag de simulación para no registrar respuestas en las tablas de alumnos.
