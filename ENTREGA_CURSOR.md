# 🎯 PARTITURA ASIGNADA — CURSOR (FASE F3: IMPLEMENTACIÓN DE ENTREGAS A Y B)
**Proyecto:** Suite Escolar Academia (Laravel 12 + Filament v3) — EST 90  
**Gobernanza:** Metodología SpaceX Multi-Agente (Lauren Tan)  
**Estado:** 🟢 **PARTITURA ASIGNADA Y LISTA PARA EJECUCIÓN**  
**Responsable:** Cursor (Software & DOM Lead)  
**Director & Release Lead:** Antigravity | **Design & UX Lead:** DeepSeek  

---

## 1. Archivos Asignados para Edición (Exclusivos de Cursor)
- `public/js/aula/constructor-cliente.js`
- `public/js/aula/aula-alumno.js`

*(Prohibido modificar archivos de backend PHP, blade views o estilos CSS base sin coordinar).*

---

## 2. Partitura Técnica Quirúrgica por Entrega

### 📦 Tarea 1: Verificación y Consolidación de Entrega A (Texto, Video, Menú Popover (+))
1. **Contrato de Inserción del Popover `(+)` (`abrirMenuModuloEnColumna`):**
   - Asegurar que al pulsar el botón `(+)` interior de una columna, se despliegue el menú contextual con las 4 familias unificadas:
     - `Contenido`: `texto`, `tabla`, `timeline`.
     - `Multimedia`: `imagen`, `video`, `audio`.
     - `Actividad`: `actividad`.
     - `Formulario`: `formulario_encuesta`, `formulario_quiz`, `formulario_banco`.
2. **Engranes de Configuración Contextual (`abrirModalPropiedades`):**
   - **Texto:** Edición de HTML enriquecido, selección de tipografía DUA y selector de badge.
   - **Video:** Selector de origen (YouTube, Vimeo, MP4 local), segundo de inicio y consigna didáctica.
3. **Navegación del Portal Alumno (`aula-alumno.js`):**
   - Manejo del evento click en `.moment-tab` para conmutar entre `.pagina-alumno-panel` sin recargar la página.

### 📦 Tarea 2: Implementación de Entrega B (Tabla, Línea de Tiempo, Imagen/Galería, Audio, Actividad)
1. **Módulo Tabla (`tabla`):**
   - En `crearModuloHTML('tabla', datos)`: renderizar tabla con controles dinámicos de filas y columnas.
   - Al abrir `abrirModalPropiedades`: desplegar modal de dimensiones de tabla, alineación y botón para agregar/eliminar filas.
2. **Módulo Línea de Tiempo (`timeline`):**
   - En `crearModuloHTML('timeline', datos)`: renderizar hito cronológico con fecha/etapa, título, descripción y punto conector vertical.
   - Modal de propiedades: formulario estructurado para agregar/editar hitos del proceso histórico o procedimental.
3. **Módulo Imagen / Galería (`imagen`):**
   - En `crearModuloHTML('imagen', datos)`: contenedor responsive con soporte de recorte (16:9, 4:3, 1:1, Círculo) y descripción accesible DUA (`alt`).
   - Modal de propiedades: selector de URL, selector de recorte de aspect-ratio y campo de texto alternativo para invidentes.
4. **Módulo Audio / Podcast (`audio`):**
   - En `crearModuloHTML('audio', datos)`: reproductor `<audio controls>` estilizado con selector de velocidad de reproducción (0.75x, 1x, 1.25x, 1.5x) y transcripción colapsable.
5. **Módulo Actividad Práctica (`actividad`):**
   - En `crearModuloHTML('actividad', datos)`: tarjeta pedagógica con 5 secciones:
     - Consigna de la actividad.
     - Producto esperado.
     - Criterio de evaluación (Rúbrica/Lista de cotejo rápida).
     - Material adjunto de consulta.
     - Botón de entrega simulada (texto o archivo).

---

## 3. Prueba de Aceptación Compartida (Criterios de Éxito)
1. Al pulsar `(+)` en una columna, se despliega el menú de 4 categorías y permite insertar cada uno de los 5 nuevos tipos de Entrega B.
2. Cada bloque insertado renderiza su maqueta estructurada propia (ninguno debe verse idéntico a otro).
3. El engrane `⚙️` de cada tarjeta abre los campos correspondientes a su formato sin colisiones de datos.
4. En el paso 4 ("Vista Previa Alumno"), todos los módulos se visualizan limpios, interactivos y con accesibilidad DUA.

---

## 4. Instrucción de Entrega
- Guarda tu código directamente en los archivos JS asignados.
- Registra el `git diff` y tu informe en la sección inferior `## 📦 ENTREGA DE CURSOR`.
