# ST90 — Corrección final de seguridad local

La corrección autorizada quedó aplicada en esta copia del repositorio. No hubo conexión con Apps Script, no se ejecutó ninguna función contra la hoja escolar y no hubo despliegue.

El trabajo se hizo en el árbol de este repositorio. La ruta de Windows `G:\Mi unidad\PROYECTOS\ST90-copia-fase3` no está montada en este entorno.

## Archivos modificados y hashes

SHA-256. Solo cambiaron tres archivos de la aplicación.

| Archivo | Antes | Después |
| --- | --- | --- |
| `Codigo.js` | `3b6bf96e124a9e9b6166d268db0cca51c9a4ca42071ae400b53bbc35d74325b8` | `f19b75b909a0f40a58a15799cf908e05f00968f3217ca1dbcb877ff25060147d` |
| `Asistencia.js` | `73527c00c1aac043da3cdf2f713b12482a8d886947f73000bfe690866527a204` | `785c690130e559027edeb6e65bdf5ecd7893370248b5b9b4443b48c971402601` |
| `Admin.html` | `601f781bab1be157813409497eec3e20f7c1718d64a63957e1870b7d711f50f4` | `98c93f370a1fbd1e9bab5192f6111bc7591d5f5d63f6b1910098d157a1bca11a` |

Permanecen con el mismo hash: `ClaseLogica.js`, `Clase.html`, `Interfaz.html`, `ComunJS.html`, `ComunCSS.html`, `EstiloUiSt90.html`, `AdminAsistencia.html`, `AdminLecturas.html`, `AdminUsuarios.html`, `appsscript.json`, `.clasp.json` y `.claspignore`.

`ClaseLogica.js` sigue en `07cb2ab8f1a4de994996c57d99820d73ea29d785ca7462423929f432f3ea4d12`.

## Respaldo

Directorio nuevo, separado de `.rsc/backups/`:

`_respaldo-fase3c-seguridad-20261013/`

Contiene `Codigo.js.antes`, `Asistencia.js.antes` y `Admin.html.antes`. Esos tres archivos coinciden con los hashes de antes. No se sobrescribió ningún respaldo previo. `.claspignore` ya excluye todo lo que no es la aplicación, así que esta carpeta no entra en un `clasp push`. No se ejecutó ese comando.

## Correcciones realizadas

1. **Rutas `doGet` con `st90sim`.** Se eliminaron las nueve rutas de `doGet` en `Codigo.js`: `sembrarPrefectas`, `sembrarContenido1C`, `sembrarAsistencia`, `inspeccionarNiveles`, `sincronizarNiveles`, `clasificarNiveles`, `ajustarLecturas`, `cargarSimulados` y `repararResultados`. Una URL con `clave=st90sim` ya no ejecuta esas operaciones. No se puso otra clave fija ni otro acceso público.

2. **Siembras que sí se pudieron proteger.** `sembrarPrefectasDemo` y `sembrarAsistenciaDemo` en `Asistencia.js` llaman a `exigirSesionAdminReal_` antes de `verificarYCrearPestanas()`. `Admin.html` ahora envía el token de la sesión en `gsRun('sembrarAsistenciaDemo', token)`. `sembrarPrefectasDemo` no tenía llamada en la interfaz.

3. **Autorización obligatoria.** `clasificarNivelesTodasLasPreguntas` y `cargarResultadosSimulados` ya no omiten la revisión cuando el token falta o cuando la función se llama sin argumentos. La revisión nueva exige las dos cosas que el servidor guarda al iniciar la sesión de administrador: la marca `admin_<token>` y una sesión cuyo rol es `admin`. Un token vacío, inexistente, vencido, de otro rol, o con la marca sola, se rechaza antes de abrir la hoja. Las llamadas de `Admin.html` de estas dos funciones ya enviaban el token y se dejaron así.

`exigirAdmin` no se modificó. Prefectura, docencia y apoyo siguen entrando a sus módulos con esa marca. Las cuatro operaciones de esta corrección usan la revisión más estricta.

## Bloqueo: `sembrarContenidoPrueba1C`

La función está en `ClaseLogica.js`, línea 1539, y escribe en `ContenidosClase`. Protegerla obliga a editar ese archivo. No se modificó. La ruta pública que la llamaba sí se eliminó. Queda invocable por `google.script.run` sin sesión de administrador.

## Pruebas aprobadas

124 comprobaciones estáticas y en memoria, 0 rechazadas. El registro está en `PRUEBAS.json` y se puede repetir con `pruebas-en-memoria.mjs`. No usan navegador, Apps Script, hoja ni red.

Aprobado:

- Las nueve rutas `st90sim` responden la página normal y no devuelven el JSON de demostración.
- Llamada directa sin argumentos, token vacío, en blanco, inexistente o retirado de la caché: rechazo, sin abrir la hoja.
- Marca `admin_=1` sin sesión, y la misma marca con rol prefecto, docente, apoyo o alumno: rechazo, sin abrir la hoja.
- El literal `admin_=1` y el número `1` no sirven como sesión.
- Con sesión real de rol `admin` y marca de servidor, la función pasa la autorización. El sustituto de la hoja se niega a abrirla y la ejecución se detiene sin `setValue`, `clearContents`, `flush` ni red. Los mensajes observados fueron: «No se pudo abrir la hoja.», «No se pudo abrir la hoja de cálculo.» y, en la clasificación, el acceso a una hoja nula antes de escribir.
- El cuerpo de esas cuatro funciones, fuera de la línea de autorización, es el mismo que el respaldo.
- Las funciones de horario de la Fase 3B en `Asistencia.js` (`importarHorarioAsc` y las de lectura del XML) no cambiaron.
- `ClaseLogica.js` no cambió.
- `.clasp.json` no cambió y no se usó.

## Pruebas no ejecutadas

- Ninguna prueba en el navegador.
- Ninguna ejecución en el tiempo de ejecución de Apps Script.
- Ninguna apertura de la hoja escolar. El vencimiento se simuló borrando la caché en memoria, que es como `CacheService` presenta una clave vencida. No se esperó el plazo real de seis horas.
- Con sesión de administrador válida no se completó la siembra ni la clasificación: el sustituto cortó la función al negar la hoja. La conservación del resto del cuerpo se comprobó comparando el texto con el respaldo.

## Riesgos que permanecen fuera de esta corrección

Confirmados al leer el código. No se ejecutaron y no se modificaron.

**Canal de clase.** `sembrarContenidoPrueba1C` sigue sin autorización propia. Hace falta autorización expresa para editar `ClaseLogica.js`.

**Endpoints de alumno, sin rediseñar el acceso.** Siguen públicos para quien pueda llamar al script:

- `guardarResultadosExamen` (`Codigo.js`, línea 4362) escribe un resultado con la matrícula que envía el cliente y no revisa sesión.
- `obtenerAlumnosPorGrupo` (línea 2320) y `catalogoLoginPorGrado` (línea 2339) devuelven matrícula y nombre de otros alumnos.
- `panelAlumno` (línea 3846) e `iniciarEvaluacionAlumno` (línea 3855) arman el panel o la evaluación de la matrícula recibida, sin sesión.

**Funciones que las rutas eliminadas llamaban y que no estaban en la lista de autorización obligatoria.** Ya no salen por URL. Siguen expuestas a `google.script.run`:

- `inspeccionarNivelesPreguntas` (línea 2099), lectura.
- `sincronizarNivelesHojaDesdeJson` (línea 2133), escritura.
- `ajustarLecturasAEspecificaciones` (línea 5075), escritura.
- `repararResultadosSiEsNecesario` (línea 519), escritura. También la llama `verificarYCrearPestanas` durante el arranque. Ponerle autorización de administrador cortaría ese arranque.

**`exigirAdmin`.** Sigue aceptando la marca `admin_=1` como prueba única. Por eso prefectura, docencia y apoyo pasan esa revisión. Cambiarla afectaría módulos que esta corrección no debía tocar.

## Producción

No se creó `.clasp.json`: el archivo ya existía y no se modificó. No se ejecutó `clasp push`, ni un despliegue, ni una publicación. No se invocó ninguna función contra hojas o servicios reales. El identificador de la hoja que ya estaba en el código no se usó: el sustituto de `SpreadsheetApp.openById` lanza un error local y no abre nada.
