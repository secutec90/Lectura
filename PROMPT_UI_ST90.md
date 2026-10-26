# Prompt obligatorio — estilo UI ST90 (v293)

Pega este bloque al iniciar cualquier tarea de interfaz en **Lectura / ST90**. Aplícalo sin que te lo pidan.

Fuente: https://drive.google.com/drive/folders/1FlRpDacXbujj5W2XiWe5C1oAs4UVfaLc?usp=drive_link  
Copia en Apps Script: `EstiloUiSt90.html` · `?pagina=estilo`

```
REGLA OBLIGATORIA DE UI ST90 v293 (Lectura). Léela y aplícala sin que te la pidan.

Antes de tocar HTML/CSS/JS abre:
https://drive.google.com/file/d/1CfBT8mAvgUUZqIYgp8Z3KxrRYn-m0Qt-/view?usp=drive_link
Copia en GAS: EstiloUiSt90.html (?pagina=estilo)

Principio de oro: la cinta tiene TRES niveles. Cada vez que un icono abre contenido distinto al de su fila, ese contenido va a un subribbon INFERIOR. Nunca mezcles pestañas de sección con filtros, listas o acciones en la misma fila. Omitir iconos redundantes.

N1 = módulos (Usuarios / Asistencia / Lecturas en Admin; Clases / Alumnos / Docentes en Clase.html) + Salir.
N2 = pestañas de la sección + Ayuda.
N3 = acciones y filtros centrados (Fecha, Grado, Grupo, Presentes, Guardar…). En vistas de lista/catálogo el último nivel va DENTRO de la tarjeta en UNA SOLA FILA Y CENTRADO, omitiendo textos de conteo y títulos redundantes.

REVELADO PROGRESIVO. Al entrar no hay icono con recuadro: solo N1, N2 y N3 ocultos, cuerpo vacío. No auto-abras Asistencia ni Lecturas.
Clic en N1: ese icono se encierra en rectángulo blanco de esquinas redondeadas (activa, borde #94a3b8) y muestra N2 SIN recuadro en N2. Cuerpo sigue vacío.
Clic en N2: marca ese icono, muestra N3 y el catálogo, y COLAPSA el subribbon N2. Quedan solo N1 y el contenido. Clases: body.subribbon-collapsed, .ribbon-main-nav.subribbon-collapsed, .subribbon-container.is-hidden.
Clic otra vez en el N1 activo: el subribbon N2 se vuelve a desplegar (el contenido no se borra). Clic en otro N1: abre el N2 de ese módulo.
Ayuda no colapsa el subribbon.
Clic N3 de acción (Alta, CSV, Grupo): marca el icono, oculta el catálogo y solo muestra el formulario. Segundo clic restaura la lista. Filtros y Actualizar no ocultan el catálogo.

Todo control de cinta es ribbon-btn: SVG + span.ribbon-label. El texto debajo ES el nombre. Prohibido data-tip, title o globo CSS en ribbon-btn, ribbon-tab y btn-ayuda.ribbon-btn. Sí aria-label. Tooltips solo en iconos compactos SIN label (.btn-icono-res, .asi-e).
Controles, filtros y barras siempre CENTRADOS. El icono de Ayuda va en la fila N2.
En Asistencia → Alumnos: Prefecta: Nombre a la izquierda de Fecha/Grupo/Presentes/Guardar; sin Grado ni Buscar; sin chips de grupos, sin Turno matutino, sin el texto largo de sesión.
En Asistencia → Reportes: el icono Reportes abre en el cuerpo Alumnos o Docentes. Los filtros Periodo/Grado/Grupos/Alumno o Docente/Generar van dentro de la tarjeta.

Filtros con lista desplegable directa o calendario: select overlay sobre el ribbon-btn o input date con showPicker(). Al elegir, la etiqueta del botón se actualiza (ej. 1A, CIENCIAS). Catálogo de alumnos en el CUERPO. Español MX. snake_case. No commit ni producción salvo que te lo pidan.
```
