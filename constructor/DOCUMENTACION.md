# Documentación — Constructor de Encuestas (Censo de Movilidad)

> **Documento histórico (versión 7 · 19/10/2026).** Describe la app con dos gráficas y
> `?vista=constructor`; ya no corresponde al código actual. Para el estado real consulta
> `LEEME.md` (uso y publicación), `RADIOGRAFIA.md` (arquitectura) y `AVANCES.md` (bitácora).

> Documento único de referencia del proyecto **constructor**.  
> Ruta local: `G:\Mi unidad\PROYECTOS\EncuestaMovilidad\constructor`  
> Última actualización: **19/10/2026**  
> Versión publicada: **7**

---

## 1. Ficha rápida

| Dato | Valor |
|---|---|
| Nombre | Constructor de Encuestas / Censo de Traslado y Movilidad Escolar |
| Tipo | Google Apps Script independiente + Google Sheets |
| Hoja de cálculo | `1bwqSni0iNPeFnoYK6M3gkeKgoC-_nv2-LNja72_lubk` |
| Script ID | `1qC6tPtXlMJqkU1L2nZS1KXMOslESO17JyGOjJLykRUTy0c2oIofm2HkD` |
| Despliegue web | `AKfycbz8Wuh6pv6CD9HwEtDbnlfTIBRRSQetjx-pMSV8qtQeuuszDMWuZEHOSo-ynN62GZst2w` (versión 7) |
| URL de la app | `https://script.google.com/macros/s/AKfycbz8Wuh6pv6CD9HwEtDbnlfTIBRRSQetjx-pMSV8qtQeuuszDMWuZEHOSo-ynN62GZst2w/exec` |
| URL del panel | la anterior + `?vista=constructor` |
| Entrada HTML | `Index.html` |
| Zona horaria | `America/Mexico_City` |
| Runtime | V8 |
| Credenciales del panel | `Admin` / `Admin-dev` (por defecto) |
| Clave de simulación | `Memo#1` (por defecto) |
| Estado | Autorizado, versión 7, URL 200 |

> **Importante:** cambia `Admin/Admin-dev` y `Memo#1` antes de usar la encuesta en producción. Se configuran en **Propiedades de la secuencia de comandos** del proyecto de Apps Script.

---

## 2. Qué es y qué no es

**Es** un proyecto independiente para levantar el censo de traslado y movilidad escolar desde una hoja nueva, con:

- Formulario público generado desde la hoja.
- Panel administrador con login, filtros, gráficas, totales, tabla, CSV/PDF, simulación y limpieza.
- Editor de encabezados y preguntas.

**No es** la app del censo de movilidad original. La app original (`_publicado/`, producción v40) y el constructor viven en libros y scripts distintos. No se deben mezclar archivos, hojas ni despliegues.

El proyecto anterior `_constructor/` (hoja `1wR0…`) quedó obsoleto y no se tocó.

---

## 3. Relación con la encuesta de movilidad

| Elemento | App de movilidad | Constructor |
|---|---|---|
| Carpeta | `_publicado/` (producción) y `_dev/` (desarrollo) | `constructor/` |
| Hoja | Libro del censo | Libro nuevo `1bwq…` |
| Script | Proyecto del censo | Proyecto nuevo `1qC6…` |
| Versión actual | Producción v40 (@7) / DEV v49 | v7 |
| Preguntas | Fijas en el código | Editables en la hoja |
| Panel | Tablero fijo de movilidad | Tablero adaptado + editor |

La app de movilidad se conserva como referencia visual y funcional. El constructor replica su barra, filtros, gráficas y totales, pero con preguntas dinámicas.

---

## 4. Arquitectura

```text
Navegador
  └─ Index.html (HtmlService)
       ├─ Pestaña Encuesta
       │    ├─ obtenerFormulario()
       │    └─ guardarRespuestaFormulario({respuestas})
       └─ Pestaña Panel Administrador
            ├─ verificarAdmin(credenciales)
            ├─ obtenerRespuestasFormulario(credenciales)
            ├─ guardarFormulario(credenciales, config, preguntas)
            ├─ simularRespuestasFormulario(credenciales, cantidad, clave)
            └─ limpiarSimuladosFormulario(credenciales, clave)
                       │
                       ▼
                 Código.js (V8)
                       │  SpreadsheetApp.openById(HOJA_ID_FIJA)
                       ▼
     ┌─────────────────────────────────────────────┐
     │ Hoja 1bwq…                                  │
     │  ├─ Formulario      (schema de preguntas)   │
     │  ├─ Configuracion   (textos de cabecera)    │
     │  └─ Respuestas      (datos capturados)      │
     └─────────────────────────────────────────────┘
```

### Flujo de una respuesta real

1. El estudiante abre la pestaña **Encuesta**.
2. `obtenerFormulario()` lee `Formulario` + `Configuracion`.
3. El formulario se genera dinámicamente.
4. Al enviar, `guardarRespuestaFormulario()` valida y escribe una fila en `Respuestas` con `Origen = Real`.
5. El panel la muestra al recargar.

### Flujo de una simulación

1. El administrador entra al panel y abre **Mantenimiento → Simular respuestas**.
2. Indica cantidad (1–500) y clave.
3. `simularRespuestasFormulario()` genera respuestas aleatorias válidas y las escribe con `Origen = Simulado`.
4. El panel refresca tabla, gráficas y totales.

---

## 5. Archivos del proyecto

| Archivo | Tamaño aprox. | Función |
|---|---:|---|
| `Código.js` | 22.8 KB | Backend: hojas, schema, validación, respuestas, simulación, rutas |
| `Index.html` | 75.8 KB | App única: encuesta + panel + editor + modales |
| `Constructor.html` | 30.8 KB | Versión anterior del panel (legado, no se sirve) |
| `Formulario.html` | 10.7 KB | Versión anterior del formulario (legado, no se sirve) |
| `appsscript.json` | 211 B | Manifiesto: V8, zona, web app |
| `.clasp.json` | 253 B | Script ID y configuración de clasp |
| `LEEME.md` | 5.1 KB | Guía rápida de operación |
| `DOCUMENTACION.md` | este archivo | Documentación completa |

`doGet()` sirve siempre `Index.html`. Los parámetros `?vista=formulario` y `?vista=constructor` se resuelven en el cliente; el segundo abre directamente la pestaña del panel.

---

## 6. Identificadores y enlaces

| Recurso | Enlace / ID |
|---|---|
| Hoja | https://docs.google.com/spreadsheets/d/1bwqSni0iNPeFnoYK6M3gkeKgoC-_nv2-LNja72_lubk/edit |
| Editor de Apps Script | https://script.google.com/u/0/home/projects/1qC6tPtXlMJqkU1L2nZS1KXMOslESO17JyGOjJLykRUTy0c2oIofm2HkD/edit |
| App | https://script.google.com/macros/s/AKfycbz8Wuh6pv6CD9HwEtDbnlfTIBRRSQetjx-pMSV8qtQeuuszDMWuZEHOSo-ynN62GZst2w/exec |
| Panel directo | la URL anterior + `?vista=constructor` |
| Carpeta local | `G:\Mi unidad\PROYECTOS\EncuestaMovilidad\constructor` |

---

## 7. Modelo de datos

### 7.1 Hoja `Formulario`

Una fila por pregunta. La fila 1 es el encabezado.

| Col | Campo | Descripción |
|---:|---|---|
| 1 | `id` | Identificador único (slug). Ej. `movilidad` |
| 2 | `tipo` | `texto`, `parrafo`, `unica`, `multiple`, `numero`, `fecha`, `sino`, `escala` |
| 3 | `etiqueta` | Texto visible de la pregunta |
| 4 | `ayuda` | Texto de apoyo debajo del título |
| 5 | `placeholder` | Texto de ejemplo (texto/parrafo) |
| 6 | `obligatoria` | `TRUE` / `FALSE` |
| 7 | `opciones` | JSON array. Ej. `["Matutino","Vespertino"]` |
| 8 | `orden` | Orden de aparición (1, 2, 3…) |
| 9 | `activa` | `TRUE` / `FALSE`. Al eliminar se marca `FALSE` para conservar datos |
| 10 | `columna` | Columna de `Respuestas` donde se guarda (1-based). La primera pregunta usa 3 |
| 11 | `extra` | JSON. `{ "maxLongitud": 120 }`, `{ "escalaMin": 1, "escalaMax": 5 }` |

Reglas:

- Las preguntas nuevas reciben la siguiente columna libre.
- Las preguntas existentes conservan su columna al editarlas.
- Al eliminar una pregunta, se marca `activa = FALSE`; sus datos históricos permanecen.
- `guardarFormulario()` reescribe el schema y actualiza los encabezados de `Respuestas`.

### 7.2 Hoja `Configuracion`

| Col A | Col B |
|---|---|
| clave | valor |

Claves:

| Clave | Valor por defecto |
|---|---|
| `escuela` | `Secundaria Técnica No. 90` |
| `subtitulo` | `Don José Calderón Ayala` |
| `titulo` | `Censo de Traslado y Movilidad Escolar` |
| `introduccion` | `Toma menos de 2 minutos. Los datos se usan únicamente para organizar la entrada y salida de la escuela.` |
| `boton` | `Enviar Encuesta` |
| `nota` | `Todos los campos son obligatorios, excepto las observaciones.` |
| `exitoTitulo` | `Registro guardado` |
| `exitoTexto` | `La encuesta de {nombre} quedó registrada.` |
| `otroBoton` | `Registrar otro estudiante` |

`{nombre}` se sustituye por la primera respuesta de texto no vacía.

### 7.3 Hoja `Respuestas`

| Col | Contenido |
|---:|---|
| A | `Marca temporal` (fecha/hora) |
| B | `Origen`: `Real` o `Simulado` |
| C… | Una columna por pregunta, según `Formulario.columna` |

Las columnas actuales son C–J (3–10):

| Columna | Pregunta |
|---:|---|
| C | Nombre completo |
| D | Turno |
| E | Grupo |
| F | Movilidad |
| G | Tiempo de traslado |
| H | Tiempo de descenso |
| I | Llegada a la puerta |
| J | Observaciones |

### 7.4 Preguntas iniciales (movilidad)

| # | `id` | Tipo | Etiqueta | Columna | Obligatoria | Opciones |
|---:|---|---|---|---:|---|---|
| 1 | `nombre` | `texto` | Nombre completo del estudiante | 3 | Sí | — (máx. 120) |
| 2 | `turno` | `unica` | Turno | 4 | Sí | Matutino, Vespertino |
| 3 | `grupo` | `unica` | Grupo | 5 | Sí | 22 grupos (ver abajo) |
| 4 | `movilidad` | `unica` | ¿Cuál es el medio principal de traslado a la escuela? | 6 | Sí | 8 opciones (ver abajo) |
| 5 | `tiempoTraslado` | `unica` | Tiempo aproximado de traslado de la casa a la escuela | 7 | Sí | 5 rangos |
| 6 | `tiempoDescenso` | `unica` | ¿Cuánto tarda en descender del vehículo? | 8 | No | 4 rangos + No aplica (camina) |
| 7 | `tiempoPuerta` | `unica` | ¿Cuánto tarda en llegar a la puerta una vez que bajó? | 9 | No | 4 rangos + No aplica (camina) |
| 8 | `comentarios` | `parrafo` | Observaciones sobre la logística (opcional) | 10 | No | — (máx. 500) |

**Grupos Matutino:** 1A, 1B, 1C, 1D, 1E, 2A, 2B, 2C, 2D, 2E, 3A, 3B, 3C, 3D, 3E.  
**Grupos Vespertino:** 1F, 1G, 2F, 2G, 2H, 3F, 3G.

**Movilidad:** Caminando · Transporte Escolar de la escuela · Transporte Escolar contratado por familias · Transporte Público · Auto Compartido · Aplicación Carpool · Vehículos no motorizados · Otros.

**Tiempo de traslado:** Menos de 10 minutos · 10 a 20 minutos · 20 a 30 minutos · 30 a 45 minutos · Más de 45 minutos.

**Descenso / Puerta:** Menos de 1 minuto (Inmediato / Frente a la puerta) · 1 a 2 minutos · 2 a 3 / 2 a 5 minutos · Más de 3 / 5 minutos · No aplica (camina).

### 7.5 Migración de preguntas demo

Las primeras versiones sembraban cuatro preguntas de ejemplo (`nombre`, `area`, `satisfaccion`, `comentarios`). La función `migrarDemoAMovilidad()` detecta exactamente esos IDs y reemplaza el schema y la configuración por los de movilidad. Se ejecuta al abrir la app y en `doGet()`.

Si la hoja se editó manualmente y ya no tiene esos IDs, la migración no se aplica; en ese caso se usan las preguntas actuales.

---

## 8. Formulario público (pestaña Encuesta)

### 8.1 Composición

- Cabecera con escuela, subtítulo y título (desde `Configuracion`).
- Introducción.
- Campos dinámicos desde `Formulario` (solo `activa = TRUE`).
- Nota inferior.
- Botón de envío.
- Panel de éxito con `exitoTitulo`, `exitoTexto` y botón `otroBoton`.

### 8.2 Tipos soportados

| Tipo | Control |
|---|---|
| `texto` | input text; `maxLongitud` opcional |
| `parrafo` | textarea; `maxLongitud` opcional |
| `unica` | select con placeholder y opciones |
| `multiple` | checkboxes; devuelve array |
| `numero` | input number |
| `fecha` | input date |
| `sino` | select Sí/No |
| `escala` | radios de `escalaMin` a `escalaMax` |

### 8.3 Validación

- Obligatorias: no vacías.
- Opciones: deben pertenecer a `opciones`.
- Número/fecha válidos.
- Escala dentro de rango.
- Longitud máxima.

Los errores se muestran en un cuadro rojo dentro del formulario.

### 8.4 Dependencias implementadas

1. **Turno → Grupo**
   - Al elegir `Matutino`, el grupo se limita a 1A–3E.
   - Al elegir `Vespertino`, a 1F, 1G, 2F, 2G, 2H, 3F, 3G.
   - Sin turno, el grupo está deshabilitado y muestra «Elige primero el turno».
   - Al cambiar de turno, el grupo se reinicia si no pertenece al nuevo turno.

2. **Movilidad → Tiempos de vehículo**
   - Si se elige `Caminando`, se ocultan y limpian `tiempoDescenso` y `tiempoPuerta`.
   - Si se elige otro medio, se muestran.

> Las listas de grupos están fijas en `Index.html` (`GRUPOS_MATUTINO` / `GRUPOS_VESPERTINO`). Si el administrador cambia las opciones de la pregunta `grupo`, la cascada sigue usando esas listas. Es una limitación conocida.

### 8.5 Envío

```js
google.script.run
  .withSuccessHandler(...)
  .withFailureHandler(...)
  .guardarRespuestaFormulario({ respuestas: { idPregunta: valor, ... } });
```

`multiple` se envía como array; el backend lo une con `; ` al escribir.

---

## 9. Panel administrador

### 9.1 Acceso

- Pestaña **Panel Administrador**.
- Usuario y contraseña (`Admin` / `Admin-dev` por defecto).
- Tras entrar, el panel abre en **Gráficas**.

### 9.2 Barra superior

| Zona | Control | Función |
|---|---|---|
| Izquierda | Gráficas / Datos | Cambia de subpestaña |
| Filtros | Turno (personas) | Filtra por turno |
| Filtros | Grado (123) | Filtra por primer dígito del grupo (1, 2, 3) |
| Filtros | Grupo (cuadrícula) | Filtra por grupo exacto |
| Filtros | Origen (base de datos) | Todos / Reales / Simulados |
| Ajustes | Sliders | Tipo de gráfica, Valores, Ver por |
| Orden | Flecha | Mayor a menor, menor a mayor, por categoría |
| Recargar | Flecha circular | Vuelve a leer respuestas |
| Datos | Lupa | Muestra/oculta el buscador |
| Datos | Embudo | Campo de ordenamiento |
| Datos | Flecha | Dirección del orden |
| Datos | Lista | Top 5/10/15/25/50/100 |
| Datos | Flecha atrás | Restablece filtros de tabla |
| Acciones | CSV | Descarga CSV con filtros activos |
| Acciones | PDF | Imprime / guarda PDF |
| Acciones | Herramientas | Simular respuestas / Limpiar simulados |
| Acciones | Lápiz | Abre el editor |
| Acciones | Diskette | Guarda cambios del editor |
| Acciones | Puerta | Cierra sesión |

### 9.3 Ajustes de gráfica

**Tipo de gráfica:** Barras horizontales, Barras verticales, Pastel, Dona, Líneas.  
**Valores:** Cantidad, Porcentaje.  
**Ver por:** Movilidad, Turno, Grado, Grupo, Traslado, Descenso, Llegada, Origen.

`Ver por` cambia la **gráfica 1**. La **gráfica 2** es fija: tiempo de traslado casa–escuela.

### 9.4 Gráficas y totales

- Fila 1: dos tarjetas (`col-lg-6`):
  - Gráfica 1: dimensión elegida.
  - Gráfica 2: tiempo de traslado.
- Fila 2: tabla de totales de la gráfica 1:
  - Categoría.
  - Cantidad.
  - Porcentaje.
- Pastel y Dona muestran en cada rebanada `cantidad (porcentaje%)`.
- Barras muestran el valor al final de cada barra.
- Los filtros afectan ambas gráficas, los totales, la tabla y la exportación.

### 9.5 Subpestaña Datos

- Tabla dinámica con Fecha, Origen y todas las preguntas.
- Búsqueda de texto.
- Orden por campo (Fecha, Origen o cualquier pregunta).
- Dirección ascendente/descendente.
- Top 5/10/15/25/50/100.
- Restablecer filtros.
- CSV/PDF desde la barra.

### 9.6 Editor de encabezados y preguntas

Se abre con el lápiz. Permite:

- Editar escuela, subtítulo, título, introducción, botón, nota, textos de éxito y texto de «otra respuesta».
- Agregar pregunta.
- Editar pregunta: tipo, etiqueta, ayuda, placeholder, obligatoria, opciones, escala mín/máx, longitud máxima.
- Reordenar (subir/bajar).
- Eliminar (marca `activa = FALSE`; conserva datos).
- Guardar con el diskette.

Al guardar:

1. Se valida el schema.
2. Se reescriben `Formulario` y `Configuracion`.
3. Se actualizan los encabezados de `Respuestas`.
4. La encuesta pública se regenera.

### 9.7 Simulación

- **Mantenimiento → Simular respuestas.**
- Cantidad: entero 1–500.
- Clave: `Memo#1` o la propiedad `CLAVE_ESPECIAL`.
- Genera nombres, comentarios, opciones, fechas, números y escalas aleatorias.
- Escribe `Origen = Simulado`.
- Al terminar, refresca la tabla y las gráficas.

> Limitación: la simulación elige turno y grupo de forma independiente; puede producir combinaciones turno/grupo que no existen en la escuela. Para datos de prueba es aceptable; si se necesita consistencia, se debe ajustar `valorSimulado()`.

### 9.8 Limpiar simulados

- **Mantenimiento → Limpiar simulados.**
- Pide la misma clave.
- Borra únicamente las filas con `Origen = Simulado`.
- No toca las respuestas reales.

### 9.9 Exportación

- **CSV:** BOM UTF-8, separador `;`, columnas Fecha/Origen + preguntas. Respeta filtros.
- **PDF:** usa `window.print()`; el CSS de impresión oculta barra, login, cabecera y editor, y muestra la tabla.

---

## 10. Funciones del backend (`Código.js`)

| Función | Descripción |
|---|---|
| `getCredencialesAdmin()` | Lee `ADMIN_USUARIO`/`ADMIN_PASS`; usa Admin/Admin-dev si no existen |
| `idDesdeTexto(texto)` | Genera slug para IDs de preguntas |
| `getLibro()` | Abre la hoja por `HOJA_ID` o `HOJA_ID_FIJA` |
| `autorizar()` | Abre la hoja y devuelve su nombre; se ejecuta una vez para permisos |
| `getHojaFormulario()` | Crea/lee `Formulario`; si se crea, siembra movilidad |
| `sembrarMovilidad(hoja)` | Escribe las 8 preguntas iniciales |
| `migrarDemoAMovilidad()` | Reemplaza las 4 preguntas demo por las de movilidad |
| `getHojaConfig()` | Crea/lee `Configuracion` |
| `getHojaRespuestas()` | Crea/lee `Respuestas` |
| `leerConfig()` | Devuelve la configuración como objeto |
| `leerPreguntas(soloActivas)` | Lee y normaliza las preguntas |
| `normalizarPregunta(p, indice)` | Normaliza tipos, opciones, orden y extra |
| `validarPregunta(p)` | Valida el schema antes de guardar |
| `obtenerFormulario()` | Devuelve `{config, preguntas}`; ejecuta la migración |
| `verificarAdmin(credenciales)` | Compara usuario/contraseña |
| `guardarFormulario(credenciales, config, preguntas)` | Guarda schema/config; desactiva preguntas eliminadas; actualiza cabeceras |
| `actualizarCabecerasRespuestas()` | Escribe los encabezados de `Respuestas` |
| `valorRespuesta(pregunta, valor)` | Normaliza el valor (une múltiples) |
| `validarRespuestas(preguntas, respuestas)` | Valida obligatorias, opciones, números, fechas, escalas y longitudes |
| `guardarRespuestaFormulario(datos)` | Inserta una respuesta real |
| `getClaveSimulacion()` | Lee `CLAVE_ESPECIAL` o usa `Memo#1` |
| `valorSimulado(p)` | Genera un valor aleatorio según el tipo |
| `simularRespuestasFormulario(credenciales, cantidad, clave)` | Inserta respuestas simuladas |
| `limpiarSimuladosFormulario(credenciales, clave)` | Borra filas `Origen = Simulado` |
| `obtenerRespuestasFormulario(credenciales)` | Devuelve configuración, preguntas y filas para el panel |
| `doGet(e)` | Sirve `Index.html` y ejecuta la migración |

---

## 11. Seguridad y permisos

### 11.1 Manifiesto

```json
{
  "timeZone": "America/Mexico_City",
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "webapp": {
    "executeAs": "USER_DEPLOYING",
    "access": "ANYONE_ANONYMOUS"
  }
}
```

- La app se ejecuta como el usuario que despliega.
- Cualquier persona con la URL puede abrir la encuesta.
- El panel exige credenciales; las acciones sensibles exigen credenciales y, simulación/limpieza, también la clave.

### 11.2 Propiedades del script

| Propiedad | Uso | Valor por defecto |
|---|---|---|
| `ADMIN_USUARIO` | Usuario del panel | `Admin` |
| `ADMIN_PASS` | Contraseña del panel | `Admin-dev` |
| `CLAVE_ESPECIAL` | Clave de simulación/limpieza | `Memo#1` |
| `HOJA_ID` | Libro alternativo | `HOJA_ID_FIJA` |

### 11.3 Funciones públicas y protegidas

| Pública | Protegida |
|---|---|
| `obtenerFormulario()` | `guardarFormulario()` |
| `guardarRespuestaFormulario()` | `obtenerRespuestasFormulario()` |
| `doGet()` | `simularRespuestasFormulario()` |
| | `limpiarSimuladosFormulario()` |

### 11.4 Consideraciones

- `verificarAdmin()` **no** tiene límite de intentos ni bloqueo temporal. Si se expone masivamente, agregar rate limiting con `CacheService` y un contador.
- No se registran intentos fallidos.
- Las credenciales y la clave se guardan en texto plano en las propiedades del script; es el mecanismo estándar de Apps Script, pero conviene cambiarlas.
- La hoja debe ser accesible por la cuenta que despliega. Si `openById` falla, compártela o cambia `HOJA_ID_FIJA`.

---

## 12. Despliegue y actualización

### 12.1 Requisitos

- `clasp` 3.4.1.
- Node.js (el entorno usa el Node incluido en DSH).
- Sesión de `clasp` con la cuenta dueña del script.

### 12.2 Comandos

Desde `G:\Mi unidad\PROYECTOS\EncuestaMovilidad\constructor`:

```powershell
clasp push -f
clasp version "descripción del cambio"
clasp update-deployment AKfycbz8Wuh6pv6CD9HwEtDbnlfTIBRRSQetjx-pMSV8qtQeuuszDMWuZEHOSo-ynN62GZst2w -V <número>
```

- `update-deployment` conserva la URL.
- No uses `clasp deploy` para actualizar si quieres mantener el enlace actual: crea otro despliegue con otra URL.
- Tras actualizar, Google puede servir una copia en caché durante unos minutos. Si ves la versión anterior, espera y usa **Ctrl+F5**.

### 12.3 Autorización inicial (una vez)

1. Abre el editor del script.
2. Ejecuta la función `autorizar`.
3. Acepta permisos de Sheets/Drive.
4. En **Implementar → Administrar implementaciones**, confirma:
   - Ejecutar como: **yo**.
   - Quién tiene acceso: **cualquier persona**.
5. Abre la URL de la app.

### 12.4 Verificar despliegues

```powershell
clasp list-deployments --json
```

Debe aparecer el despliegue web con `versionNumber: 7`.

---

## 13. Operación

### 13.1 Primer uso

- Abre la URL: se crean `Formulario`, `Configuracion` y `Respuestas` si no existen.
- La pestaña **Encuesta** funciona sin login.
- El panel pide `Admin` / `Admin-dev`.

### 13.2 Cambiar credenciales

1. Editor de Apps Script → **Configuración del proyecto** → **Propiedades de la secuencia de comandos**.
2. Edita `ADMIN_USUARIO` y `ADMIN_PASS`.
3. Guarda y recarga la app.

### 13.3 Cambiar clave de simulación

- Edita `CLAVE_ESPECIAL`.
- Si no existe, la clave es `Memo#1`.

### 13.4 Cambiar de hoja

- Edita `HOJA_ID` o `HOJA_ID_FIJA` en `Código.js`.
- La cuenta que ejecuta debe tener acceso.

### 13.5 Agregar o editar preguntas

1. Panel → lápiz.
2. Agrega/edita la pregunta.
3. Guarda con el diskette.
4. Revisa la pestaña **Encuesta**; el formulario se regenera.
5. Las preguntas eliminadas se desactivan y conservan sus datos.

### 13.6 Simular y limpiar

- Simular: herramientas → Simular respuestas; cantidad y clave.
- Limpiar: herramientas → Limpiar simulados; clave.
- Solo se borran las filas `Origen = Simulado`.

### 13.7 Exportar

- CSV: icono de hoja de cálculo; respeta filtros.
- PDF: icono PDF; usa el diálogo de impresión.

---

## 14. Historial de versiones

| Versión | Cambios |
|---|---|
| 1 | Proyecto independiente; `openById`; `Formulario`/`Constructor` separados; despliegue inicial |
| 2 | Página única `Index.html` con pestañas Encuesta / Panel; editor integrado |
| 3 | Preguntas y cabecera de movilidad; migración automática de las preguntas demo |
| 4 | Simulación de respuestas; barra de iconos de acciones |
| 5 | El panel abre en Resumen; iconos de acciones |
| 6 | Barra estilo movilidad: subpestañas Gráficas/Datos, filtros, Ajustes, Orden, Datos, Mantenimiento |
| 7 | Dos gráficas en una fila + totales; etiquetas valor/porcentaje en pastel/dona; nombres cortos de dimensiones; turno→grupo y Caminando→ocultar tiempos |

---

## 15. Limitaciones y pendientes

1. **Simulación turno/grupo:** se eligen de forma independiente; puede generar combinaciones inconsistentes.
2. **Grupos fijos:** la cascada del formulario usa `GRUPOS_MATUTINO`/`GRUPOS_VESPERTINO`; no lee las opciones editadas de la pregunta `grupo`.
3. **Descenso/puerta opcionales:** el schema los marca como no obligatorios; la app original los exigía cuando no se camina.
4. **Segunda gráfica fija:** siempre es `tiempoTraslado`; no se puede cambiar desde Ajustes.
5. **Totales solo de la gráfica 1:** no hay tabla de totales para la gráfica 2.
6. **Filtros fijos:** Turno, Grado, Grupo y Origen; no se generan filtros para preguntas nuevas.
7. **Grado derivado:** se calcula con el primer carácter del grupo; no hay columna `grado`.
8. **Sin rate limiting:** `verificarAdmin` no bloquea intentos.
9. **Preguntas eliminadas:** se desactivan; no se borran sus columnas.
10. **CSV con `;`:** pensado para Excel en español; otros programas pueden requerir coma.
11. **PDF:** depende del diálogo de impresión del navegador.
12. **Archivos legado:** `Constructor.html` y `Formulario.html` ya no se sirven.
13. **Caché:** tras desplegar, la URL puede tardar unos minutos en reflejar la versión nueva.
14. **Sin edición/borrado individual de respuestas:** solo se pueden limpiar las simuladas.
15. **Sin paginación:** la tabla usa scroll y Top.

---

## 16. Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| 403 al abrir | Script sin autorizar o implementación restringida | Ejecutar `autorizar`; revisar «Ejecutar como / Acceso» |
| Se ve la versión anterior | Caché de Google | Esperar unos minutos; Ctrl+F5 |
| «Contraseña de simulación incorrecta» | `CLAVE_ESPECIAL` distinta | Usar la clave configurada o `Memo#1` |
| «No se encontró la hoja» | `HOJA_ID` inválido | Revisar `HOJA_ID`/`HOJA_ID_FIJA` |
| `openById` sin permiso | La cuenta no accede al libro | Compartir la hoja o cambiar de cuenta |
| No aparecen preguntas | `Formulario` vacío o inactivas | Panel → lápiz; o ejecutar `obtenerFormulario` |
| El grupo no se filtra | IDs `turno`/`grupo` cambiados | Mantener esos IDs o ajustar la cascada |
| Gráficas vacías | Sin respuestas o filtros excluyentes | Simular respuestas; restablecer filtros |
| CSV se ve raro en Excel | Separador/BOM | Importar como UTF-8 con `;` |
| PDF sin tabla | Pestaña incorrecta | Abrir Datos antes de imprimir |
| `clasp push` no cambia nada | Script ID incorrecto | Revisar `.clasp.json` |

---

## 17. Pruebas recomendadas

- [ ] La URL abre la encuesta sin login.
- [ ] La cabecera muestra escuela, subtítulo y título.
- [ ] Al elegir Turno, el Grupo se filtra y se habilita.
- [ ] Al elegir Caminando, desaparecen Descenso y Llegada.
- [ ] Al enviar una respuesta real, aparece en `Respuestas` con `Origen = Real`.
- [ ] El panel abre con las credenciales correctas.
- [ ] Los filtros Turno/Grado/Grupo/Origen afectan gráficas, totales y tabla.
- [ ] Las dos gráficas se muestran en una fila y los totales en la segunda.
- [ ] Pastel/Dona muestran valor y porcentaje.
- [ ] Cambiar Tipo/Valores/Ver por/Orden actualiza las gráficas.
- [ ] La búsqueda, el orden y el Top funcionan en Datos.
- [ ] CSV y PDF respetan los filtros.
- [ ] Simular 20 respuestas las marca como `Simulado`.
- [ ] Limpiar simulados borra solo esas filas.
- [ ] Editar una pregunta y guardar actualiza la encuesta.
- [ ] Eliminar una pregunta la desactiva y conserva datos.

---

## 18. Referencias

- Guía rápida: [`LEEME.md`](LEEME.md)
- Documentación de la app de movilidad: `../HISTORIAL.md`, `../ESPECIFICACIONES-UI.md`, `../GUIA-PREGUNTAS.md`
- Carpeta de producción del censo: `../_publicado/`
- Carpeta de desarrollo del censo: `../_dev/`
- Proyecto anterior obsoleto: `../_constructor/`

---

**Fin del documento.**
