# ST90 — Informe final de la autorización acotada

Quedaron cerrados los dos riesgos autorizados: un alumno ya no consulta ni escribe datos de otro cambiando la matrícula, y `sembrarContenidoPrueba1C` ya no escribe sin sesión de administrador. No hubo conexión con Apps Script, no se abrió la hoja escolar y no hubo despliegue.

El trabajo se hizo en el árbol de este repositorio. La ruta de Windows `G:\Mi unidad\PROYECTOS\ST90-copia-fase3` no está montada aquí.

## Cambios y hashes

SHA-256. Cambiaron cuatro archivos.

| Archivo | Antes | Después |
| --- | --- | --- |
| `Codigo.js` | `f19b75b909a0f40a58a15799cf908e05f00968f3217ca1dbcb877ff25060147d` | `e8e67ad007bf37014e4b66b96beeee8395ad37c766fc1ae24a0ca3aebbf0d8de` |
| `ClaseLogica.js` | `07cb2ab8f1a4de994996c57d99820d73ea29d785ca7462423929f432f3ea4d12` | `2dd1736f851c6b8080b83c084aebec2c37461afa23e4b803e266bd90e4086040` |
| `Interfaz.html` | `0f00a7ab384bf5bae5c45afb7c050e9c677ed65c5a3c8274f18ed43c63b63c86` | `c7c6f4ae94e264df933284de887b4313b1f2db387c1f79315ba77dd0269990ce` |
| `Admin.html` | `98c93f370a1fbd1e9bab5192f6111bc7591d5f5d63f6b1910098d157a1bca11a` | `cc3c3030bf9c70b53d09673bbb8d85f3a4369d1af94bf830ed5a23e2ec5cd65b` |

Sin cambio de hash: `Asistencia.js`, `Clase.html`, `ComunJS.html`, `ComunCSS.html`, `EstiloUiSt90.html`, `AdminAsistencia.html`, `AdminLecturas.html`, `AdminUsuarios.html`, `appsscript.json`, `.clasp.json` y `.claspignore`.

## Respaldo

Directorio nuevo: `_respaldo-fase3c-alumnos-20261013/`.

Contiene las copias `.antes` de los cuatro archivos, con el mismo hash de antes. No se tocó `_respaldo-fase3c-seguridad-20261013/` ni `.rsc/backups/`.

## Qué mecanismo se usó

No se creó otro sistema de acceso ni una contraseña fija. El servidor ya guardaba, al entrar con usuario y contraseña, una de estas dos sesiones:

- `sesion_<token>` con rol `alumno` y matrícula, creada por `iniciarSesionUnificada`.
- `clase_<token>` con rol `alumno` y matrícula, creada por `iniciarSesionClase`.

Las seis funciones exigen esa sesión. La matrícula que manda el navegador tiene que coincidir con la de la sesión. Si viene vacía, es distinta o no hay sesión, la función se detiene antes de leer o escribir datos de un alumno.

`obtenerAlumnosPorGrupo` y `catalogoLoginPorGrado` ya no devuelven el padrón. Con una sesión válida devuelven solo al alumno de esa sesión, y solo si el grupo o el grado pedido es el suyo.

`doGet` ya no arma la ficha ni el cupo a partir de `?mat=`. La página del examen pide usuario y contraseña con `iniciarSesionUnificada`. Si el alumno entró por el portal, el token queda en `sessionStorage` de ese navegador y la página lo reutiliza. El token no va en la URL.

En `ClaseLogica.js` el único cambio es la primera línea de `sembrarContenidoPrueba1C`: llama a `exigirSesionAdminReal_` antes de `verificarYCrearPestanas()`. No tenía otras llamadas. El resto del canal de clase no se modificó.

`Admin.html` solo guarda el token y la matrícula que el login ya devolvió, justo antes de abrir la página del alumno.

## Pruebas realizadas

62 comprobaciones estáticas y en memoria, 0 rechazadas. Registro: `PRUEBAS.json`. No usan navegador, Apps Script, hoja ni red.

Aprobado en memoria:

- Sin token, con token vacío, inexistente o retirado de la caché, el panel se rechaza y no abre la hoja.
- `admin_=1` sin sesión de alumno, la sesión de administrador y la sesión de maestro se rechazan en los endpoints del alumno.
- Matrícula vacía, en blanco o de otro alumno se rechaza en panel, cupo, evaluación y guardado, sin abrir la hoja.
- El catálogo de otro grado y la lista de otro grupo se rechazan sin abrir la hoja.
- Con la propia sesión, el catálogo y el grupo devuelven una sola ficha: la matrícula de esa sesión.
- Con la propia matrícula, panel, cupo, evaluación y guardado pasan la autorización y se detienen al negar la hoja. No hubo `setValue`, `flush` ni red. El guardado se detuvo con «Alumno no encontrado.».
- La sesión `clase_` del alumno autoriza su matrícula y rechaza otra. Esa misma sesión no puede sembrar contenido.
- `sembrarContenidoPrueba1C` sin argumentos, con token de alumno o con `admin_=1` sin sesión, se rechaza antes de abrir la hoja.
- La sesión admin real pasa esa siembra y se detiene al negar la hoja, sin escribir. Esa sesión admin no entra al panel del alumno.

Aprobado por comparación de texto:

- `sesionClase_`, `exigirClaseRol_`, `iniciarSesionClase`, `emitirSesionClase_`, `horarioMaestroClase`, `contextoClaseAlumno`, `guardarContenidoClase` y los horarios de clase quedaron iguales.
- El cuerpo de `sembrarContenidoPrueba1C`, fuera de la línea de autorización, quedó igual.
- `importarHorarioAsc` y la lectura del horario de la Fase 3B quedaron iguales. `Asistencia.js` no cambió.

## Pruebas reales no ejecutadas

- Ninguna en el navegador. No se comprobó el formulario ni `sessionStorage` dentro de Google Sites. Si ese traspaso no viaja, la página vuelve a pedir el usuario y la contraseña que ya existían.
- Ninguna en Apps Script y ninguna contra la hoja. El vencimiento se simuló borrando la caché.
- Con sesión válida no se completó un examen ni una siembra: el sustituto cortó la función al negar la hoja. La calificación que sigue a la autorización en `guardarResultadosExamen` no se reescribió; la matrícula usada es la de la sesión, ya comprobada.

## Limitaciones que quedan

- Quien conozca el usuario y la contraseña de otro alumno puede entrar como ese alumno. Esa es la credencial que ya existía. Lo que se cerró es cambiar la matrícula sin esa credencial.
- Un alumno sin contraseña en `AccesoClaseAlumnos` no entra al examen por el listado de nombres. El login ya respondía que debía pedir su clave. El listado público era el hueco.
- `doGet` sigue leyendo el calendario del trimestre para la página. Eso no incluye matrícula, nombre ni resultados.
- `exigirAdmin`, `fichaAlumnoAdmin` y `panelResumen` no entraban en esta autorización y siguen como estaban.
- `sincronizarNivelesHojaDesdeJson`, `ajustarLecturasAEspecificaciones`, `inspeccionarNivelesPreguntas` y `repararResultadosSiEsNecesario` siguen fuera de esta autorización. La URL `st90sim` ya no las llama.

## Producción

`.clasp.json` ya existía y no se modificó. No se ejecutó `clasp push`, ni un despliegue, ni una publicación. No se invocó ninguna función contra servicios reales. `SpreadsheetApp.openById` del sustituto lanza un error local y no abre la hoja.
