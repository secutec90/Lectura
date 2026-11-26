# 🎯 PARTITURA ASIGNADA — DEEPSEEK (REAPERTURA ENTREGA A: REVISIÓN DE EDITOR VISUAL TEXTO)
**Proyecto:** Suite Escolar Academia (Laravel 12 + Filament v3) — EST 90  
**Gobernanza:** Metodología SpaceX Multi-Agente (Lauren Tan)  
**Estado:** 🟢 **PARTITURA ASIGNADA Y LISTA PARA EJECUCIÓN**  
**Responsable:** DeepSeek (Design & UX Lead)  
**Director & Release Lead:** Antigravity | **Software & DOM Lead:** Cursor  

---

## 1. Archivos Asignados para Revisión y Estilos
- `resources/views/aula/constructor.blade.php`
- `public/css/aula/aula-constructor.css`
- `public/css/aula/aula-alumno.css`

---

## 2. Requerimientos de Revisión de DeepSeek

### Tarea 1: Auditoría del Editor Visual en el Modal de Configuración
1. Verificar que al abrir el engrane en los tres tipos de texto (`texto`, `texto_dua`, `lectura`):
   - Se abra el editor visual estilizado, accesible e intuitivo, sin campos textarea crudos que expongan código HTML.
   - La barra de herramientas del editor visual (`.editor-visual-toolbar`) tenga botones con tamaño táctil adecuado ($\ge 36\text{ px}$ en escritorio, $44\text{ px}$ en táctil), iconos claros y contraste WCAG 2.1 AA.
   - El área editable (`.editor-visual-caja`) tenga tipografía accesible, scroll interno suave si el texto es extenso, y foco visible (`focus:ring-2`).

### Tarea 2: Verificación de Persistencia y Re-apertura
1. Comprobar que al aplicar cambios, cerrar el modal y volver a abrir el engrane, el contenido se mantenga exactamente como se formateó.
2. Comprobar la visualización fiel en la tarjeta del lienzo y en la Vista Previa del Alumno (`portal-alumno`).

### Tarea 3: Estilos de la Barra de Herramientas y Tablas
1. Maquetar los estilos en `aula-constructor.css` para:
   - `.editor-visual-toolbar`: barra compacta con bordes redondeados y separación visual de grupos (formato, estilos, listas, inserciones).
   - `.editor-visual-caja`: caja con fondo blanco, padding cómodo, borde estilizado y altura mínima de 180px con desbordamiento auto.
   - Formato de tablas dentro del editor: bordes finos, padding en celdas y aspecto limpio.

---

## 3. Prueba de Aceptación Compartida (Criterios de Éxito)
1. Los tres tipos de bloque (`texto`, `texto_dua`, `lectura`) abren el editor visual formateado.
2. El contraste de los botones de la barra de herramientas del editor cumple WCAG AA.
3. Las tablas, listas y encabezados insertados se muestran con estética profesional tanto en el editor como en la vista del alumno.

---

## 4. Instrucción de Entrega
- Registra tus hallazgos, dictamen y ajustes CSS en la sección inferior `## 📦 ENTREGA Y REVISIÓN DE DEEPSEEK`.
