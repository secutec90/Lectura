# Radiografía del sistema — Constructor de Encuestas

> **Qué es este documento:** la foto técnica del sistema *en este momento* (arquitectura,
> modelo de datos, contratos, interfaz, métricas, riesgos y publicación). No es una bitácora:
> eso está en `AVANCES.md`. Aquí se mira «dónde estamos» de un vistazo.
> **Se actualiza en cada cambio** (ver §11).
> **Última actualización:** 2026-10-25 · 19:00 · producción **57** · HEAD ≡ v57 (`41DDCF3D`),
> comprobado contra el proyecto remoto el 2026-10-25.

---

## 1. Ficha técnica

| Dato | Valor |
|---|---|
| Producto | Constructor de Encuestas (encuesta pública + editor dinámico + panel) |
| Plataforma | Google Apps Script (V8) + Google Sheets |
| Script ID | `1qC6tPtXlMJqkU1L2nZS1KXMOslESO17JyGOjJLykRUTy0c2oIofm2HkD` |
| Hoja de cálculo | `1bwqSni0iNPeFnoYK6M3gkeKgoC-_nv2-LNja72_lubk` |
| Carpeta de trabajo | `G:\Mi unidad\PROYECTOS\Lectura\constructor` — **movida el 2026-10-25**; la anterior (`PROYECTOS\EncuestaMovilidad\constructor`) ya no existe |
| Enlace público (alumnos) | `AKfycbz8Wuh6pv6CD9HwEtDbnlfTIBRRSQetjx-pMSV8qtQeuuszDMWuZEHOSo-ynN62GZst2w` → **@57** |
| Enlace de revisión | `AKfycbwInuRa2faaIkV_O14-F0J_sHitzOYMgNrvamiqZBHg` → **@HEAD** |
| Despliegues activos | 2 (`@57` público · `@HEAD` privado) |
| Acceso | `ANYONE_ANONYMOUS` · ejecuta como `USER_DEPLOYING` |
| Zona | `America/Mexico_City` |
| Archivos desplegados | `Index.html`, `Código.js`, `Constructor.html`, `Formulario.html`, `appsscript.json` |
| Estado del código | `Index.html` `41DDCF3D` · 154 305 B · 3 191 líneas · 101 funciones |
| | `Código.js` `9E840FA4` · 41 693 B · 1 056 líneas · 40 funciones |
| Conjunto de publicación | **5 archivos** (`clasp status`, 2026-10-25) |

> `Constructor.html` y `Formulario.html` siguen subidos pero **no se sirven**: `doGet()` solo
> entrega `Index.html`. Son legado y solo engordan el proyecto.

---

## 2. Arquitectura

```
Navegador
 └─ Index.html  (una sola página, 2 pestañas internas + panel con 3 vistas)
      ├─ Encuesta (pública)
      │    ├─ obtenerFormulario()            ← lee el esquema
      │    └─ guardarRespuestaFormulario()   → escribe una fila
      └─ Panel (tras login)
           ├─ verificarAdmin()               ← 8 intentos / 10 min
           ├─ obtenerRespuestasFormularioJSON()  → todas las filas + esquema (cadena JSON)
           ├─ guardarFormulario()            ← reescribe el esquema
           ├─ simularRespuestasFormulario()  ← credenciales + clave
           ├─ limpiarSimuladosFormulario()   ← credenciales + clave
           ├─ quitarJerarquiaDemo()          ← «Quitar preguntas de ejemplo»
           └─ vincularYPrepararHoja()        ← URL/ID de otra hoja
                     │
                     ▼  google.script.run
              Código.js (1 056 líneas, 40 funciones)
                     │  SpreadsheetApp.openById(HOJA_ID || HOJA_ID_FIJA)
                     ▼
              Libro 1bwq…
                ├─ Formulario    (esquema: 11 columnas)
                ├─ Configuracion (clave · valor)
                └─ Respuestas    (A fecha · B origen · C… preguntas)
```

No hay servidor propio ni base de datos: todo el estado vive en la hoja y el esquema se
materializa en filas.

**Resolución del libro (cascada):** `HOJA_ID` (propiedad del script) → `Configuracion.hojaId`
del libro contenedor → libro contenedor → `HOJA_ID_FIJA` (último recurso). Una sola vez por
ejecución (`_libroCache`).

> **Corrección 2026-10-25:** el paso 2 es inalcanzable en la práctica: **nada escribe
> `Configuracion.hojaId`** (`vincularYPrepararHoja` guarda `HOJA_ID` como propiedad del script)
> y `guardarFormulario` reescribe `Configuracion` solo con las claves de `CONFIG_POR_DEFECTO`,
> así que la borraría si existiera. Ver §9 R7.

---

## 3. Modelo de datos

**Hoja `Formulario`** — una fila por pregunta, 11 columnas:

| Col | Campo | Notas |
|---|---|---|
| A | `id` | Slug estable; es la clave de la columna en `Respuestas` |
| B | `tipo` | `texto · parrafo · unica · multiple · numero · fecha · sino · escala` |
| C | `etiqueta` | Texto visible |
| D | `ayuda` | Texto de apoyo |
| E | `placeholder` | Solo texto/párrafo/número |
| F | `obligatoria` | Booleano |
| G | `opciones` | JSON de array |
| H | `orden` | Entero |
| I | `activa` | Borrado lógico (no se borran columnas) |
| J | `columna` | Columna fija en `Respuestas` (2 = B es Origen) |
| K | `extra` | JSON: `rol`, `graficable`, `condicion`, `categoria`, `escalaMin/Max`, `maxLongitud`, `padre`, `opcionesPorPadre` |

**Hoja `Configuracion`** — clave/valor. Claves: `escuela`, `subtitulo`, `titulo`,
`introduccion`, `boton`, `nota`, `exitoTitulo`, `exitoTexto`, `otroBoton`,
`gruposPorTurno`, `categorias`.

**Hoja `Respuestas`** — `A` marca temporal · `B` Origen (`Real`/`Simulado`) ·
`C…` una columna por pregunta, en el orden definido por `pregunta.columna`.

**Esquema sembrado** (8 preguntas, `sembrarMovilidad`): `nombre` (texto), `turno`, `grupo`,
`movilidad`, `tiempoTraslado`, `tiempoDescenso`, `tiempoPuerta` (única), `comentarios` (párrafo).
El resto se edita desde la interfaz.

---

## 4. Contrato con el backend

| Endpoint | Entrada | Salida | Protección | Uso |
|---|---|---|---|---|
| `obtenerFormulario` | — | `{config, preguntas[]}` | Público | cliente |
| `guardarRespuestaFormulario` | `{respuestas:{}}` | `{exito, mensaje?}` | Público | cliente |
| `verificarAdmin` | `{usuario, pass}` | `{autenticado, bloqueado?, mensaje?}` | 8 intentos/10 min | cliente |
| `obtenerRespuestasFormularioJSON` | credenciales | cadena JSON `{autenticado, config, preguntas, filas[]}` | Credenciales | cliente |
| `obtenerRespuestasFormulario` | credenciales | el mismo objeto, sin serializar | Credenciales | interno |
| `guardarFormulario` | credenciales, config, preguntas | `{exito, formulario?}` | Credenciales | cliente |
| `simularRespuestasFormulario` | credenciales, cantidad, clave, perfil | `{exito, total?}` | Credenciales **+ clave** | cliente |
| `limpiarSimuladosFormulario` | credenciales, clave | `{exito, total?}` | Credenciales **+ clave** | cliente |
| `quitarJerarquiaDemo` | credenciales | `{exito, formulario?}` | Credenciales | cliente (🛠) |
| `vincularYPrepararHoja` | credenciales, urlOId | `{exito, id, nombre, hojasCreadas[], hoja, config, preguntas}` | Credenciales | cliente |
| `autorizar` | — | nombre del libro | Manual (editor) | editor |
| `doGet` | — | `Index.html` | Público | ruta |
| `instalarJerarquiaDemo` | credenciales | `{exito, formulario?}` | Credenciales | **muerto** (la UI que lo llamaba se retiró en la v46) |

Reglas: la cantidad simulada es 1–500; `limpiar` solo borra `Origen = Simulado`; los errores
al cliente son genéricos y el detalle va a `console.error`.

**13 endpoints · 9 los usa el cliente · 1 muerto.** El panel ya no recibe el objeto grande
(`google.script.run` lo entregaba `null`); recibe una cadena y hace `JSON.parse`.

---

## 5. Mapa de la interfaz

```
Pestañas:  [ Encuesta Estudiantes ]  [ Panel Administrador ]
                                        └─ login → Gráficas · Datos · Formulario

Barra del panel (iconos, title + aria-label):
  Turno  Grado  Grupo   ⚙ Ajustes   ↓ Orden   ↻   ✕     (filtros fijos, en ese orden)
  ────────────────────────────────────────────────────────────────  CSV  PDF  🛠  ⎋

Tarjeta de la gráfica:
  [▾ pregunta que se grafica]   🔽 filtros por pregunta ②   ·   N respuestas
  el título es el selector: al elegir una pregunta se grafican sus opciones

Menús:
  · Turno / Grado / Grupo → lista corta del propio filtro (Grupo se abre al elegir Turno)
  · Filtros por pregunta → rejilla dentro de la tarjeta de la gráfica
  · Ajustes  → tipo · valores · base porcentual · etiquetas · «División» solo en apiladas
  · Orden    → mayor/menor/categoría
  · Mantenimiento → Simular · Quitar preguntas de ejemplo · Limpiar

Editor → tarjeta «Origen de datos» (URL/ID)

Modales: Pregunta · Categorías · Simulación · Gráfica ampliada · Ayuda de cálculos · Guía
```

Gráficas soportadas: barras H/V, pastel, dona, líneas, apiladas H/V, rayos solares.
Toda gráfica dibuja sus valores (`pluginValores`).

> Los filtros fijos de la barra son **siempre** Turno · Grado · Grupo (`ORDEN_BARRA`), aunque
> el esquema use otras dimensiones (`sede`/`área` solo aparecen en el selector de eje y en los
> filtros por pregunta). El contador 🔽 cuenta únicamente los filtros por pregunta.

---

## 6. Flujos

1. **Registro (público):** `obtenerFormulario` → se pinta el formulario → validación en
   cliente → `guardarRespuestaFormulario` → `LockService` → validación en servidor →
   `appendRow` con `Origen = Real` → confirmación persistente.
2. **Login:** `verificarAdmin` → credenciales en memoria del cliente → `obtenerRespuestasFormularioJSON`.
3. **Edición del esquema:** editor → `guardarFormulario` → valida IDs/etiquetas/condiciones,
   ciclos de condición y de jerarquía → **borra y reescribe** `Formulario` y `Configuracion` →
   actualiza cabeceras de `Respuestas` → devuelve el esquema nuevo.
4. **Simulación:** credenciales + clave → genera 1–500 filas con `Origen = Simulado`.
5. **Limpieza:** credenciales + clave → borra solo las filas simuladas (fila por fila).
6. **Exportación:** CSV en cliente (BOM, `;`, escape y neutralización de fórmulas) · PDF por impresión.

> La condición de una pregunta se evalúa **dos veces con criterios distintos**: en el cliente
> (`aplicarCondiciones`, sin `contiene` y leyendo `.value` de controles que no son `select`) y
> en el servidor (`condicionVisible`, que sí conoce `contiene`). Ver §9 R4–R6.

---

## 7. Estado por funcionalidad

| Funcionalidad | Estado |
|---|---|
| Formulario público (8 tipos, obligatorios, longitudes) | OK |
| Condicionales `igual` · `distinto` · `vacio` · `no_vacio` sobre única/sí-no/texto | OK |
| Condicional `contiene` y condiciones sobre preguntas de opción múltiple o escala | **NO** — el cliente no implementa `contiene` y lee `.value` de un contenedor (§9 R4) |
| Cascada padre→hijo entre dos `select` | OK |
| Cascada de 3 niveles o con hijo multiple/escala | PARCIAL — no propaga y reescribe controles que no son `select` (§9 R5) |
| Editor de preguntas (alta, edición, orden, borrado lógico) | OK, con salvedad: editar una condicional puede impedir el guardado (§9 R6) |
| Recuperar una pregunta desactivada | **NO** — el editor solo ve activas y `guardarFormulario` fuerza `activa: true` (§9 R8) |
| Categorías jerárquicas | PARCIAL — se crean, no generan filtros |
| Login con límite de intentos | OK, con salvedad: el bloqueo es global y el cliente no lo muestra (§9 R2) |
| Gráficas (8 tipos) con valores | OK |
| Apiladas por «División» | OK |
| Selector de pregunta en la tarjeta | OK |
| Tabla de totales por segmento | OK |
| Filtros fijos Turno · Grado · Grupo + filtros por pregunta | PARCIAL — filtrar por una pregunta de opción múltiple solo acierta respuestas únicas (§9 R9) |
| Conexión dinámica de hoja (URL/ID, auto-aprovisionamiento) | OK |
| Jerarquía `padre`/`opcionesPorPadre` en el editor | OK |
| Rol analítico (identidad/dimensión/métrica) y marca graficable | OK |
| Respaldo del esquema antes de guardar | **NO** |
| Simulación y limpieza | OK — la limpieza borra fila por fila (§9 R10) |
| Sunburst de 3 niveles | NO — dos niveles fijos y siempre arranca en `turno` |
| Aviso si el CDN falla | PARCIAL — hay aviso si `Chart` no existe, pero no hay SRI ni versión fija (§9 R3) |
| Edición/borrado de una respuesta individual | NO |

---

## 8. Métricas

| Métrica | Valor |
|---|---|
| `Index.html` | 154 305 bytes · 3 191 líneas · **101 funciones** |
| Handlers inline | 58, todos con función (0 huérfanos) |
| IDs en el HTML | 162, sin duplicados; 0 referenciados desde JS que falten |
| Botones en el HTML | 58 (36 con `aria-label`; el resto lo asigna el panel desde JS) |
| Modales | 6, ninguno con `aria-labelledby` |
| `Código.js` | 41 693 bytes · 1 056 líneas · **40 funciones** |
| Hojas | 3 (`Formulario`, `Configuracion`, `Respuestas`) |
| Endpoints | 13 · 9 usados por el cliente · 1 muerto |
| Dependencias CDN | Bootstrap 5.3.0 · Icons 1.11.0 · **Chart.js sin versión** · ECharts 5.4.3 · sin SRI |
| Pruebas automatizadas | No hay suite; se valida con `node --check` + pruebas de DOM simulado |
| Verificación 2026-10-25 | `node --check` 0 errores · local ≡ `@HEAD` (5 archivos, MD5 idénticos) |

---

## 9. Riesgos vivos

| # | Riesgo | Impacto | Dónde |
|---|---|---|---|
| R1 | Credenciales por defecto (`Admin` / `Admin-dev`, `Memo#1`) con la app pública | Cualquiera con la URL entra al panel y ve los datos de los alumnos | `Código.js` §1, `getClaveSimulacion` |
| R2 | El contador de intentos es **global** (no por usuario) y el cliente ignora `bloqueado` | 8 fallos de cualquiera bloquean al admin 10 min; el admin cree que su contraseña está mal | `Código.js:442`, `Index.html:1548` |
| R3 | CDNs sin versión fija en Chart.js y sin SRI en ninguno; la contraseña vive en memoria (`creds`) | Un CDN comprometido lee la contraseña del panel; si cae, el panel queda en blanco | `Index.html:7-12` |
| R4 | Condiciones del cliente: falta `contiene`, y sobre multiple/escala lee `.value` de un `div`; el servidor compara un array contra `"A; B"` | Preguntas que se muestran cuando no toca, o respuestas que se guardan en blanco sin aviso | `Index.html:1453-1459`, `Código.js:604` |
| R5 | `aplicarCondiciones` hace `control.value = ""` sobre el **primer** checkbox/radio del grupo | La primera opción de una multiple/escala queda con valor vacío y el backend rechaza el envío | `Index.html:1461-1464` |
| R6 | Al abrir el modal se construye el desplegable de «valor» **antes** de fijar la pregunta de la condición y no se recalcula | Editar una condicional puede impedir guardar («necesita un valor») o escribir un valor de otra pregunta | `Index.html:2814`, `3026` |
| R7 | `guardarFormulario` borra y reescribe `Formulario` y `Configuracion` sin respaldo ni transacción; solo conserva las claves por defecto | Un fallo a mitad deja la encuesta sin preguntas; se pierden claves ajenas y `hojaId` | `Código.js:556-563` |
| R8 | `normalizarPregunta` fuerza `activa: true` y el editor solo lista activas | El borrado lógico es irreversible desde la interfaz | `Código.js:334` |
| R9 | Filtro por pregunta compara el texto completo (`"A; B" !== "A"`) mientras el conteo separa por `;` | Filtrar una multiple solo devuelve quien marcó **solo** esa opción | `Index.html:2056` |
| R10 | `limpiarSimulados` borra con `deleteRow` una fila por llamada | ~30–60 s con 450 filas; con miles se acerca al corte de 6 min | `Código.js:840` |
| R11 | Todo el dataset viaja en una sola cadena JSON (~630 B/fila) sin paginación | A ~2 000 filas son ~1,2 MB en una llamada; techo de escalabilidad | `Código.js:884` |
| R12 | `migrarDemoAMovilidad` corre en cada `doGet`/`obtenerFormulario` y, si las 4 primeras preguntas son las demo, borra `Formulario` y `Configuracion` y resiembra | Probabilidad baja; consecuencia total | `Código.js:225-245` |
| R13 | `_constructor/` (otro proyecto, script `1ptLag…`) vive dentro de la carpeta | Ya está ignorado por `clasp`, pero confunde y engorda el árbol | `.claspignore` |
| R14 | `LEEME.md` abre con «versión publicada 46» y su historial termina en la 48 | Quien lo lea publica con datos viejos | `LEEME.md` §1, §5 |

---

## 10. Publicación y respaldos

**Conjunto de publicación (verificado el 2026-10-25): 5 archivos.**

```powershell
cd "G:\Mi unidad\PROYECTOS\Lectura\constructor"
clasp status            # deben aparecer exactamente 5 archivos
clasp push -f           # a HEAD; probar en la URL de revisión
clasp version "v58 - descripción"
clasp update-deployment AKfycbz8Wuh6pv6CD9HwEtDbnlfTIBRRSQetjx-pMSV8qtQeuuszDMWuZEHOSo-ynN62GZst2w -V 58
# revertir: el mismo comando con -V 57 conserva la URL
```

`.claspignore` deja fuera:

```
_backup/**        respaldos de versiones e historial
_revision/**      copias de revisión
_constructor/**   copia de otro proyecto (scriptId 1ptLag…)
-backup/**        duplicado que apareció con la sincronización el 2026-10-25
*.md              documentación
```

**Respaldo de versiones:** `_backup/` — 56 archivos, 3.9 MB.

| Bloque | Contenido |
|---|---|
| `_backup/constructor-v40…v57-*` | Copias exactas de las versiones publicadas (Index y Código), más `appsscript.json` |
| `_backup/esquema-v47-v48.json` | Config y 11 preguntas del esquema anterior |
| `_backup/historial-antes-2026-10/` | 22 instantáneas `constructor-antes-*` (22–23/10) y `diff-v45-v46.diff`, recuperadas de la carpeta vieja |

> **Carpeta vieja:** `PROYECTOS\EncuestaMovilidad` ya **no** contiene el constructor. Lo que
> queda allí es otro proyecto de Apps Script (`1lHayrD1mc6…`, despliegues `@49/@74/@82`):
> `_publicado/`, `_censo-dev/`, `_dev/` (con 58 capturas), `Index.html` y `Codigo.gs` idénticos a
> `_publicado/`, y `_backup/v18/`. **No publicar desde ahí**: esa copia local está atrasada
> respecto a su propio proyecto, que va por la v82.

---

## 11. Cómo se actualiza este documento

En **cada cambio** que se haga al sistema:

1. Actualizar **§1** si cambian versiones, hashes, despliegues o carpeta.
2. Actualizar **§7** (estado de la funcionalidad que se tocó).
3. Actualizar **§8** si cambian líneas, funciones o dependencias.
4. Revisar **§9** si el cambio cierra o abre un riesgo.
5. Añadir una fila a la tabla de abajo.

| Fecha | Versión | Cambio | Hash |
|---|---|---|---|
| 2026-10-23 02:10 | 42 | Radiografía inicial del sistema | `711F9A24` |
| 2026-10-23 02:50 | 43 | Bloque 2: conexión dinámica de hoja + auto-aprovisionamiento | `702C87A2` |
| 2026-10-23 03:00 | 43 | Bloque 2 publicado en producción | `702C87A2` |
| 2026-10-23 03:30 | 44 | Bloque 3: jerarquía universal de filtros y adiós a los IDs mágicos | `AB450F5D` |
| 2026-10-23 03:40 | 45 | Ejemplo de jerarquía instalable (Sede → Área → Puesto) | `ED97574E` |
| 2026-10-23 13:10 | 45 | **v45 publicada en `@45`**: el enlace de alumnos deja de servir la v43 | `ED97574E` |
| 2026-10-23 13:15 | 45 | Radiografía puesta al día; filas de la v44/v45 recolocadas | `ED97574E` |
| 2026-10-23 13:40 | 46 | Panel: pregunta en la tarjeta, filtros Turno/Grado/Grupo, fuera Eje X y el ejemplo | `3354DC87` |
| 2026-10-23 22:35 | 47 | Elegir pregunta en el selector ya no abre el modal de zoom | `0BBD5DD3` |
| 2026-10-23 23:35 | 48 | Rol analítico, graficable y jerarquía Eje X/Y en el modal | `E62122A8` |
| 2026-10-24 00:05 | 49 | Puente temporal de sembrado: existe en el historial, **nunca desplegado** | — |
| 2026-10-24 00:05 | 50 | Panel: sin zoom por clic, carga con estado visible y errores explícitos | `BE9BBBF8` |
| 2026-10-24 00:20 | 53 | El panel recibe esquema y respuestas como cadena JSON | `0A72C73B` |
| 2026-10-24 00:26 | 54 | El menú de filtros por pregunta se cierra al elegir un valor | `59CF8787` |
| 2026-10-24 00:33 | 55 | Distribución de etiquetas del eje configurable | `560DDAAC` |
| 2026-10-24 00:54 | 56 | Guía del constructor y ayuda dentro del modal de pregunta | `6F750DB1` |
| 2026-10-24 00:56 | 57 | Encabezado del modal de pregunta y cuerpo con scroll interno | `41DDCF3D` |
| 2026-10-25 19:00 | 57 | Traslado a `PROYECTOS\Lectura\constructor`, consolidación de respaldos, `.claspignore` con `_constructor/**` y `-backup/**`, auditoría de código incorporada a §7–§9 | `41DDCF3D` |

---

**Documentos hermanos:** `AVANCES.md` (bitácora y pendientes) · `AUDITORIA-Y-ROADMAP.md`
(informe del 22/10, histórico) · `SKILL.md` (reglas de estilos) · `FLUJO-ESQUEMA.md` (esquema de
preguntas) · `FLUJO-RESPUESTAS.md` (respuestas y panel) · `LEEME.md` (uso y publicación).
