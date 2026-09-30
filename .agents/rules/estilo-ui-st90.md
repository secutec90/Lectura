# Regla Obligatoria de Arquitectura UI ST90 (v360)

Aplica este estándar en **todas** las interfaces del proyecto (`Admin.html`, `AdminUsuarios.html`, `AdminAsistencia.html`, `AdminLecturas.html`, `Interfaz.html`, `Clase.html`) de forma automática sin que el usuario tenga que repetirlo. La referencia canónica está en `EstiloUiSt90.html`.

## 1. Regla Universal de los 3 Niveles (N1 / N2 / N3)
- **Nivel 1 (Barra superior principal `.tabs`)**:
  - Contiene únicamente los módulos principales (ej. `Usuarios`, `Asistencia`, `Lecturas`; o `Clases`, `Alumnos`, `Docentes`) y el botón `Salir` a la derecha (`.barra-sup-acciones`).
  - **Al entrar**: Solo se muestra el Nivel 1 sin ningún icono preseleccionado, el Nivel 2 oculto y el cuerpo vacío. Prohibido auto-abrir módulos al iniciar.
  - **Primer clic en un icono del Nivel 1**: Marca ese icono con recuadro blanco redondeado (`.activa`, borde `#94a3b8`) y muestra **todos** los iconos de su Nivel 2 (`ribbonSetNivel2(true)`).
  - **Segundo clic en el mismo icono del Nivel 1**: Alterna el Nivel 2 completo: si el Nivel 2 está visible, oculta **todo** el Nivel 2 (`ribbonSetNivel2(false)`); si está oculto, vuelve a mostrar **todo** el Nivel 2 (`ribbonSetNivel2(true)`), sin borrar la hoja inferior abierta.
- **Nivel 2 (Submenú desplegable `.cinta-n2`)**:
  - Contiene las subsecciones del módulo activo + el botón `Ayuda`.
  - **Al seleccionar cualquier icono del Nivel 2**: Se oculta inmediatamente **todo el Nivel 2** (`ribbonColapsarTrasN2()` -> `ribbonSetNivel2(false)`, aplicando `display: none !important` a `.cinta-n2`) y se abre abajo la hoja correspondiente.
- **Nivel 3 (Acciones, vistas y filtros)**:
  - **Nunca** se muestra como tercera fila en la cinta superior.
  - **Siempre** se muestra integrado **dentro de la hoja inferior** (hoja de reporte, gráfica, lista, catálogo o tarjeta de detalle), en una sola fila horizontal centrada (`justify-content: center`).

## 2. Regla de Filtros Directos (100% Sin Modales)
- Prohibido usar ventanas modales emergentes para seleccionar filtros (`Grado`, `Grupo`, `Alumno`, `Docente`, `Asignatura`, `Estado`, `Tipo de gráfica`, `Comparación`, `Indicador` o `Vista`).
- Todos los iconos de filtro usan un `<select class="filtro-select-overlay">` transparente superpuesto sobre un contenedor `.ribbon-btn-select-wrap` (o calendario nativo `showPicker()` / panel compacto en línea para fechas y periodos).
- Al elegir una opción en el desplegable nativo, la etiqueta visible del icono (`.ribbon-label`) se actualiza inmediatamente con el valor elegido y filtra el reporte, gráfica o lista en vivo.

## 3. Regla de Limpieza Visual en Hojas Inferiores
- Todos los iconos de Nivel 3 usan estructura `.ribbon-btn` (`SVG` + `<span class="ribbon-label">`). Prohibido usar `title`, `data-tip` o globos de tooltip en botones con etiqueta visible.
- Omitir contadores redundantes y subtítulos repetitivos (ej. *"392 de 392 lecturas"*, *"Mostrando X de X alumnos"*, *"Contraseñas y accesos de docentes"*).
- **Banco de Lecturas**: En la vista de lista en 3 columnas (`#cajaListaYFiltrosLecturas`), los iconos de Nivel 3 (`#accionesLecBanco`: `Lista`, `Nueva`, `IA`, `NEM`, `Niveles`, `Actualizar`) van en la barra superior de la hoja (`#barraSuperiorBancoLec`). Al seleccionar una lectura (`#vistaDetalleLec`), esos mismos iconos se integran en la misma fila del título de la lectura (`#slotAccionesDetalleLec` en `.cabecera-detalle-lec`), entre el título y los iconos de edición/vista de la lectura.
- **Resultados de Lecturas**: Los iconos de vista/acción (`Gráficas`, `Lista`, `Notas`, `Imprimir`) y los filtros directos van juntos en la barra superior de la hoja de reporte (`#accionesLecRes` dentro de `#panelResultadosLec`).
- **Interfaz del Alumno (Examen)**: Si el alumno entra autenticado con usuario y contraseña, jamás se le muestran los selectores de Grado/Grupo/Nombre; se le muestra directo su tarjeta de bienvenida y los 2 botones: `[ Iniciar la prueba ]` y `[ Lectura trimestral ]`.
