# 🎯 PARTITURA ASIGNADA — CURSOR (REAPERTURA ENTREGA A: EDITOR VISUAL TEXTO ENRIQUECIDO)
**Proyecto:** Suite Escolar Academia (Laravel 12 + Filament v3) — EST 90  
**Gobernanza:** Metodología SpaceX Multi-Agente (Lauren Tan)  
**Estado:** 🟢 **PARTITURA ASIGNADA Y LISTA PARA EJECUCIÓN**  
**Responsable:** Cursor (Software & DOM Lead)  
**Director & Release Lead:** Antigravity | **Design & UX Lead:** DeepSeek  

---

## 1. Archivos Asignados para Edición
- `resources/views/aula/constructor.blade.php` (estructura del modal `#panelPropTextoDua`)
- `public/js/aula/constructor-cliente.js` (lógica del editor visual, paste de Word, abrir y guardar)

---

## 2. Requerimientos Quirúrgicos de Implementación

### Tarea 1: Rastreo del Engrane y Sustitución del Textarea por Editor Visual
1. En `resources/views/aula/constructor.blade.php` dentro de `#panelPropTextoDua`:
   - Retirar el `<textarea id="prop-modulo-texto-html">` con etiquetas HTML visibles.
   - En su lugar, implementar un **editor visual WYSIWYG nativo**:
     - Barra de herramientas superior (`.editor-visual-toolbar`):
       - Formato: desplegable con Párrafo, Título 1 (`H1`), Título 2 (`H2`), Título 3 (`H3`).
       - Formato de texto: Botones de Negrita (**B**), Cursiva (*I*), Subrayado (<u>U</u>).
       - Listas: Viñetas (`• Lista`), Numerada (`1. Lista`).
       - Enlace: Botón `🔗` para insertar enlace `<a>`.
       - Tabla: Botón `▦` para insertar una tabla simple (3x3).
     - Área editable visual: `<div id="prop-modulo-texto-editor" contenteditable="true" class="editor-visual-caja"></div>`.
     - Campo oculto `<input type="hidden" id="prop-modulo-texto-html">` para mantener compatibilidad con el serializador.
   - Funcionar **100% con recursos locales** (sin scripts ni CDNs externos, apto para red de aula sin internet).

### Tarea 2: Carga de Contenido Formateado
1. En `constructor-cliente.js` dentro de `abrirModalPropiedades`:
   - Detectar si el bloque es nuevo o existente (`texto`, `texto_dua`, `lectura`).
   - Si el bloque es existente: extraer el contenido HTML de `.contenido-modulo` y asignarlo a `editor.innerHTML`.
   - Si el bloque es nuevo o está vacío: dejar el editor limpio (`editor.innerHTML = ''`).
   - El docente debe ver **el texto ya formateado en vivo**, jamás etiquetas crudas `<p>`, `<b>`, `<div>`.

### Tarea 3: Filtro y Pegado Limpio desde Word / Documentos
1. Conectar listener `paste` al área editable `prop-modulo-texto-editor`:
   - Interceptar `e.clipboardData.getData('text/html')` o `getData('text/plain')`.
   - Limpiar etiquetas propietarias de Microsoft Word (`<!--[if gte mso...]`, `mso-`, tags `<o:p>`, estilos inline innecesarios).
   - Preservar el formato básico: encabezados (`<h1>`-`<h3>`), párrafos (`<p>`), negritas (`<b>`/`<strong>`), cursivas (`<i>`/`<em>`), listas (`<ul>`, `<ol>`, `<li>`), enlaces (`<a>`) y tablas simples (`<table>`, `<tr>`, `<td>`, `<th>`).

### Tarea 4: Conexión de «Aplicar cambios» y Guardado
1. En `guardarPropiedades`:
   - Extraer el `innerHTML` del editor visual, sanearlo y actualizar la tarjeta en `.contenido-modulo`.
   - Actualizar el input oculto `#prop-modulo-texto-html` y disparar la persistencia del bloque.
   - Garantizar que al reabrir el engrane, el contenido editado vuelva a mostrarse tal cual, sin perder formato.
   - Comprobar que en el paso 4 ("Vista Alumno"), el contenido se renderice perfectamente estructurado.

---

## 3. Prueba de Aceptación Compartida (Criterios de Éxito)
1. Abrir engrane en tarjeta de Texto: abre el editor visual con barra de herramientas, NO un textarea con código HTML.
2. Escribir una frase, aplicar negrita y un encabezado.
3. Pegar contenido desde Word conteniendo encabezado, lista y tabla simple: se inserta formateado limpiamente.
4. Pulsar «Aplicar cambios»: la tarjeta en el lienzo se actualiza con el texto visualmente formateado.
5. Volver a abrir el engrane: el editor visual contiene exactamente lo guardado.
6. Cambiar a "Vista Previa Alumno": se visualiza idéntico y sin etiquetas rotas.
7. Repetir la prueba sobre un bloque de una clase anterior (`texto_dua` o `lectura`).

---

## 4. Instrucción de Entrega
- Realiza los cambios en los archivos indicados.
- Registra tu diff y resultados de pruebas abajo en `## 📦 ENTREGA DE CURSOR`.
