# 🎯 PARTITURA ASIGNADA — DEEPSEEK (FASE F3: REVISIÓN DE CONTRATO Y MAQUETACIÓN UX/UI)
**Proyecto:** Suite Escolar Academia (Laravel 12 + Filament v3) — EST 90  
**Gobernanza:** Metodología SpaceX Multi-Agente (Lauren Tan)  
**Estado:** 🟢 **PARTITURA ASIGNADA Y LISTA PARA EJECUCIÓN**  
**Responsable:** DeepSeek (Design & UX Lead)  
**Director & Release Lead:** Antigravity | **Software & DOM Lead:** Cursor  

---

## 1. Archivos Asignados para Revisión y Maquetación (Exclusivos de DeepSeek)
- `resources/views/aula/constructor.blade.php`
- `resources/views/aula/portal-alumno.blade.php`
- `public/css/aula/aula-constructor.css`
- `public/css/aula/aula-alumno.css`

*(Prohibido modificar controladores PHP, migraciones de base de datos o lógica JS de eventos sin coordinar).*

---

## 2. Partitura Técnica Quirúrgica por Entrega

### 🎨 Tarea 1: Auditoría Visual y de Accesibilidad DUA sobre Entrega A
1. **Catálogo Lateral Unificado en `constructor.blade.php`:**
   - Verificar la maquetación de las 4 familias (`cat-contenido`, `cat-multimedia`, `cat-actividad`, `cat-formulario`).
   - Confirmar que las tarjetas de demo o experimentales (`objetivos`, `word_shape`, `callout`, `rosco`, `sopa`, etc.) queden retiradas de las opciones de nueva inserción.
2. **Navegador Superior Multi-Página en `portal-alumno.blade.php`:**
   - Revisar `.moments-nav-wrapper` y botones `.moment-tab`:
     - Contraste visual accesible en modo activo / inactivo.
     - Responsividad en dispositivos móviles (scroll horizontal suave o flex-wrap).
   - Validar que todas las barras de herramientas docentes (`.divi-ctrl-bar`, `.toolbar-flotante`, `.btn-add-module-inside`) queden estrictamente ocultas en la vista del alumno.

### 🎨 Tarea 2: Maquetación y Tokens de Diseño para Entrega B (Tabla, Timeline, Galería, Audio, Actividad)
1. **Estilos para Tabla Dinámica (`.modulo-tabla-didactica`):**
   - Encabezado estilizado con bordes redondeados y tipografía accesible.
   - Alternancia de color en filas (`zebra-striping` suave) y estados hover en celdas.
2. **Estilos para Línea de Tiempo (`.modulo-timeline-didactica`):**
   - Eje vertical conector, nodos circulares numerados o con icono de hito, tarjetas flotantes con sombra sutil y fecha destacada.
3. **Estilos para Imagen / Galería (`.modulo-imagen-didactica`):**
   - Clases de recorte de aspecto: `.aspect-16-9`, `.aspect-4-3`, `.aspect-square`, `.aspect-circle`.
   - Pie de figura con estilo DUA (fuente legible, contraste oscuro sobre fondo claro).
4. **Estilos para Audio / Podcast (`.modulo-audio-didactica`):**
   - Contenedor con icono de onda sonora, barra de reproducción nativa y botón accesible para desplegar la transcripción textual.
5. **Estilos para Actividad Práctica (`.modulo-actividad-didactica`):**
   - Tarjeta con borde destacado color esmeralda/ámbar, badge de producto esperado, listado visual de criterios de evaluación y área de entrega.

---

## 3. Prueba de Aceptación Compartida (Criterios de Éxito)
1. El catálogo lateral y el menú popover `(+)` presentan coherencia tipográfica y espacial idéntica.
2. La vista previa del alumno cumple con la normativa de accesibilidad WCAG 2.1 AA (contraste mínimo 4.5:1, etiquetas ARIA, tamaño mínimo de botones táctiles 44x44px).
3. Los estilos de impresión (`@media print`) en el portal del alumno permiten generar copias limpias de la clase sin recortes ni desbordamientos.

---

## 4. Instrucción de Entrega
- Guarda tus ajustes CSS y maquetación Blade en los archivos asignados.
- Registra tu dictamen de diseño, hallazgos reproducibles y reporte en la sección inferior `## 📦 ENTREGA Y REVISIÓN DE DEEPSEEK`.
