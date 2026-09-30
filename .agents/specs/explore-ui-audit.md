# SDD Exploration Report — Auditoría de Consistencia UI ST90 (v363)

## 1. Estado Actual Validado (Cumple 100%)
- **Cinta N1 / N2 / N3 (`ComunJS.html`, `ComunCSS.html`, `Admin.html`)**:
  - Clic en **N1** muestra todo el **N2** (`ribbonSetNivel2(true)`); segundo clic en el mismo **N1** oculta todo el **N2** (`ribbonSetNivel2(false)`).
  - Clic en cualquier icono de **N2** oculta inmediatamente todo el **N2** (`ribbonColapsarTrasN2()`).
  - **N3** siempre vive dentro de la hoja inferior (nunca como 3ª fila en la cinta superior).
- **Lecturas (`AdminLecturas.html`)**:
  - `Banco` y `Trimestre`: `#subLec`, `#lblTotalLecturas` y `#btnToggleListaLecturas` (`Lista`) ocultos; iconos de acción centrados (`justify-content: center`); al abrir una lectura, los iconos pasan a la fila de cabecera (`.cabecera-detalle-lec`).
  - `Resultados`: iconos (`Gráficas`, `Lista`, `Notas`, `Imprimir`) y filtros directos (`.filtro-select-overlay` y `#panelPeriodoRes`) integrados en la hoja inferior sin modales.
- **Asistencia (`AdminAsistencia.html`)**:
  - `Alumnos`, `Docente` y `Reportes` con Nivel 3 centrado en la hoja inferior y filtros directos sin modales; subtítulo `#txtAsiRol` oculto.
- **Examen Alumno (`Interfaz.html`) y Horario (`Clase.html`)**:
  - Alumno autenticado entra directo a su tarjeta con los 2 botones de examen sin selectores.
  - `Clase.html` tiene todos sus filtros N3 centrados y directos sin modales.

## 2. Hallazgos Detectados para Homologación Total
1. **`Usuarios → Alumnos` (`AdminUsuarios.html` líneas 195–233)**:
   - Los botones `Buscar` (`#btnMatBuscar`), `Grado` (`#btnMatGrado`), `Grupo` (`#btnMatGrupo`) y `Estado` (`#btnMatEstado`) todavía invocan `abrirModalFiltroMat(...)` (ventanas modales) en lugar de usar `<select class="filtro-select-overlay">` directo y panel desplegable en línea para `Buscar` (como en `Clase.html`).
2. **`Lecturas → Trimestre` (`AdminLecturas.html` líneas 223–232)**:
   - El bloque `.barra-trim-activo` muestra todavía el párrafo explicativo *"Cada columna es un grado y hacia abajo van los tres trimestres..."*, que puede ocultarse para mantener la misma limpieza visual que el resto de las hojas.
