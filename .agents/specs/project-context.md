# SDD Project Context — ST90 / Lectura (v363)

## 1. Stack Tecnológico y Entorno
- **Plataforma**: Google Apps Script (GAS) + HTML Service.
- **Frontend**: HTML5, Vanilla CSS (`ComunCSS.html`), Vanilla JavaScript (`ComunJS.html` + scripts modulares).
- **Backend**: Google Apps Script V8 (`Codigo.js`, `Asistencia.js`, `ClaseLogica.js`) con persistencia en Google Sheets y CacheService / PropertiesService.
- **Despliegue**: `@google/clasp` (`clasp push`, `clasp version`, `clasp deploy`).

## 2. Arquitectura Modular
- **Backend (GAS)**:
  - `Codigo.js`: Enrutador `doGet`, autenticación unificada (`loginUnificado`), evaluación lectora, banco de lecturas, generación IA (DeepSeek / NEM), resultados y configuración.
  - `Asistencia.js`: Pase de lista de alumnos y docentes por bloque horario, importación XML aSc, reportes y prefectura.
  - `ClaseLogica.js`: Horario escolar interactivo y lectura en voz alta (TTS) por sesión/bloque.
- **Frontend (Vistas HTML)**:
  - `Admin.html`: Contenedor principal administrativo y docente (`Usuarios`, `Asistencia`, `Lecturas`).
  - `AdminUsuarios.html`: Submódulo de `Alumnos`, `Docentes`, `Prefectas` y `Personal de Apoyo`.
  - `AdminAsistencia.html`: Submódulo de asistencia (`Alumnos`, `Docente`, `Reportes`).
  - `AdminLecturas.html`: Submódulo de lecturas (`Banco`, `Trimestre`, `Resultados`).
  - `Interfaz.html`: Interfaz de evaluación para el alumno (acceso directo autenticado o por selectores).
  - `Clase.html`: Interfaz de horario y seguimiento de clases para alumnos y docentes.
  - `ComunCSS.html` / `ComunJS.html`: Sistema de diseño compartido, cinta N1/N2/N3 (`ribbonSetNivel2`, `ribbonColapsarTrasN2`), modales y utilidades.
  - `EstiloUiSt90.html`: Especificación canónica de interfaz (`?pagina=estilo`).

## 3. Reglas de Especificación UI (Invariantes SDD)
1. **Navegación de 3 Niveles (N1 / N2 / N3)**:
   - **N1 (`.tabs`)**: Módulos principales. Un clic despliega todo el Nivel 2 (`ribbonSetNivel2(true)`); un segundo clic en el mismo icono oculta todo el Nivel 2 (`ribbonSetNivel2(false)`).
   - **N2 (`.cinta-n2`)**: Subsecciones del módulo. Al seleccionar cualquier icono de Nivel 2, se oculta inmediatamente todo el Nivel 2 (`ribbonColapsarTrasN2()`).
   - **N3**: **Siempre** integrado y centrado dentro de la hoja inferior (reporte, gráfica, lista o catálogo), nunca como tercera fila en la cabecera superior.
2. **Filtros Directos (Cero Modales)**:
   - Todos los filtros de Nivel 3 e informes utilizan `<select class="filtro-select-overlay">` sobre `.ribbon-btn-select-wrap` o selector nativo de fecha (`showPicker()`).
3. **Limpieza Visual**:
   - Controles centrados (`justify-content: center`), sin subtítulos ni contadores redundantes, y sin botones sin función (`#btnToggleListaLecturas` oculto).
