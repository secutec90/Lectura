# Auditoría técnica y hoja de ruta — Constructor de encuestas

> **Documento base para la siguiente fase de desarrollo.**
> Proyecto: Constructor de Encuestas (encuesta pública + constructor dinámico + panel de analítica)
> Carpeta: `G:\Mi unidad\PROYECTOS\EncuestaMovilidad\constructor`
> Script ID: `1qC6tPtXlMJqkU1L2nZS1KXMOslESO17JyGOjJLykRUTy0c2oIofm2HkD`
> Hoja de cálculo: `1bwqSni0iNPeFnoYK6M3gkeKgoC-_nv2-LNja72_lubk`
> Archivo analizado: `Index.html` de 101 029 bytes y 2 144 líneas (reparado, con la barra de filtros unificada)
> Fecha del informe: **22/10/2026**
> **Vigencia:** este informe describe el estado del 22/10/2026 (v40 y v7). El estado actual
> —versión 45 publicada en `@45`— está en `RADIOGRAFIA.md` §1 y en `AVANCES.md` §1.

---

## 0. Resumen ejecutivo

En esta sesión aparecieron **dos defectos críticos distintos**, ambos resueltos:

1. **El `Index.html` de 101 KB (versión 40, en `@40` y `@HEAD`) no compilaba.** Tenía un `}`
   suelto en la línea 1317 (rabo duplicado de `limpiarFiltros()`), lo que abortaba el parseo
   de todo el `<script>`: ni formulario, ni login, ni panel. Ese archivo quedó respaldado y
   **no es la base actual**.
2. **El `Index.html` de 75 KB que llegó al disco a las 22:20** (otra variante, probablemente
   sincronizada desde Drive) **sí compilaba, pero había perdido el cuerpo de 22 funciones**
   —editor de preguntas, simulación/limpieza y zoom de gráfica— mientras el HTML seguía
   mostrando sus botones. Resultado: **13 controles visibles lanzaban `ReferenceError`**.

**Estado final del archivo de trabajo** (verificado, no estimado):

| Comprobación | Resultado |
|---|---|
| Sintaxis (`node --check` sobre el `<script>` inline) | **0 errores** |
| Funciones definidas | **68** (0 duplicadas) |
| Handlers `onclick/onsubmit/...` en el HTML | **35, todos con función** |
| IDs referenciados y no definidos | **0** |
| Carga del script con DOM simulado | Sin excepciones |
| Codificación | UTF-8 sin BOM, saltos LF preservados |

**Veredicto:** el archivo es coherente y está listo para **pruebas de ejecución real**. No debe
promoverse al enlace de alumnos sin pasar el checklist de la sección 5.

---

## 1. Linaje de los archivos (importante para no publicar el equivocado)

| Variante | Tamaño | MD5 (8) | Dónde está | Estado |
|---|---:|---|---|---|
| **v7** | 73.9 KB | `896C66E6` | Despliegue `@7`, URL pública | Funcional, sin funciones nuevas |
| **v40** | 101.2 KB | `F368CC1D` | `@40`, `@HEAD` y `_backup/constructor-v40-Index.html` | **No compila** |
| **Variante 75 KB** | 73.8 KB | `40191E25` | Sin copia: se perdió en la sincronización de Drive | Compila, sin editor ni mantenimiento |
| **Actual reparada** | 98.8 KB | — | `constructor/Index.html` | Compila, completa |

La variante de 75 KB y la v40 **no son la misma línea de trabajo**: la de 75 KB reemplazó el
modal de filtros por desplegables inyectados en la barra (`pintarFiltrosDinamicos`) y eliminó
las categorías jerárquicas, pero conservó su *markup* y sus modales.

---

## 2. Intervenciones aplicadas en esta sesión

| # | Intervención | Motivo | Ubicación |
|---|---|---|---|
| 1 | Restauradas **22 funciones** desde la v40 | 13 handlers sin implementación | Bloque «Zoom / Simulación / Editor / Categorías» |
| 2 | Cableado del editor al abrir su pestaña | La lista de preguntas y la cabecera se veían vacías | `shown.bs.tab` |
| 3 | Añadido `celdaCSV()` y aplicado a cabecera y filas | Un `;` o una comilla rompía el CSV; `=` se evaluaba como fórmula | `descargarCSVRespuestas()` |
| 4 | Añadido `valorFecha()` y orden numérico | Las fechas se ordenaban como texto (`01/11` antes que `05/02`) | `pintarTablaRespuestas()` |
| 5 | Añadido `leerNumero()` para los tres tamaños | `localStorage` bloqueado mataba el panel al cargar | Estado global |
| 6 | `{nombre}` resuelto por la pregunta de nombre | Mostraba la primera respuesta («Matutino») en lugar del nombre | `enviar()` |
| 7 | Filtros unificados en un solo botón con menú y contador | 9 embudos idénticos + 4 iconos base saturaban la barra (13 controles) | `pintarFiltrosDinamicos()` y la barra |

Respaldos disponibles hoy: `_backup/constructor-v40-Index.html` (v40 original, recuperado
de la versión 40 de Apps Script el 2026-10-23), más las copias de la v43 y la v45. La variante de
75 KB (`40191E25`) no se conserva: se perdió con la sincronización de Drive.

---

## 3. Estado del despliegue (verificado con `clasp`)

| Despliegue | ID | Versión | Estado |
|---|---|---:|---|
| `@7` — enlace público documentado | `AKfycbz8Wuh6pv6CD9HwEtDbnlfTIBRRSQetjx-pMSV8qtQeuuszDMWuZEHOSo-ynN62GZst2w` | **7** | Funcional. Es la app que ven los usuarios |
| `@40` | `AKfycbyNAoK3MvszqMqOt1KitqTPzCWSvlgOTiJECohv69gFs_hLIGEoRlv0iAa0FvdDbfCqyQ` | **40** | Roto (no compila) |
| `@HEAD` | `AKfycbwInuRa2faaIkV_O14-F0J_sHitzOYMgNrvamiqZBHg` | 40 (= HEAD) | Roto; además exige sesión |

Mientras no se cree una versión **41** con el archivo reparado, el enlace público sirve la v7
(sin editor ni funciones nuevas) y `@40`/`@HEAD` sirven código que no arranca.

---

## 4. Auditoría funcional del archivo actual

Leyenda: **OK** = opera · **PARCIAL** = funciona con limitación · **NO** = no funciona o es decorativo.

### 4.1 UI/UX

| Funcionalidad | Estado | Observación |
|---|---|---|
| Zoom de texto de gráficas (−/+) | OK | Límites 8–18, persistido |
| Zoom de texto de la lista (−/+) | OK | Aplica a `#tablaTotales` |
| Altura dinámica | OK | ±30 px, 220–580, redimensiona Chart y ECharts |
| Modos de vista (gráfica/lista/ambos) | OK | Recalcula columnas y visibilidad |
| Ocultar/mostrar cabecera | OK | Persistido |
| Modal de gráfica ampliada | OK (**restaurado**) | `ampliarGrafica()` + `renderGraficaModal()` |
| Paleta estable por categoría | OK | Siembra sobre el conjunto completo, no sobre el filtrado |
| Valores sobre barras/rebanadas | **NO** | Sin plugin (`afterDatasetsDraw` = 0) |
| Orden por columna | OK (**corregido**) | Fechas cronológicas y números numéricos |
| Accesibilidad | PARCIAL | `th` sin teclado, `alert/confirm/prompt`, modales sin `aria-labelledby` |

### 4.2 Analítica

| Funcionalidad | Estado | Observación |
|---|---|---|
| Barras H/V, pastel, dona, líneas | OK | Leyenda solo en pastel/dona |
| Barras apiladas (H/V) | OK | Matutino/Vespertino por categoría |
| Apilado al 100 % | OK | Alternativa «Total general» |
| **Segmentar por** | **NO** | Se pinta en Ajustes, pero **ningún render lee su valor** |
| **Tercer nivel (sunburst)** | **NO** | Solo se rellena; no se muestra ni se lee |
| Rayos solares | PARCIAL | Dos niveles fijos; con «Origen» la segunda rama queda vacía |
| Totales (Mat/Vesp/Total/%/Acum.) | PARCIAL | Con opción múltiple los porcentajes superan 100 % (denominador = filas) |
| Filtros → gráfica, totales, tabla y CSV | OK | Todos consumen `filasFiltradas()` |
| Filtros (4 base + una fila por pregunta) | OK | Un solo botón «Filtros» con contador; el menú lista Turno, Grado, Grupo, Origen y cada pregunta de opción |
| Orden por cantidad / categoría | OK | `desc`, `asc`, `none` |
| Manejo de CDN caído | **NO** | `new Chart(...)` sin `try/catch`: si jsDelivr falla, el panel no avisa |

### 4.3 Datos, editor y mantenimiento

| Funcionalidad | Estado | Observación |
|---|---|---|
| Formulario generado del esquema | OK | 8 tipos de pregunta |
| Cascada turno → grupo | PARCIAL | 22 grupos **hardcodeados**; ignora `Configuracion.gruposPorTurno` |
| Condicionales | PARCIAL | Solo si la referencia es `unica`/`sino` (lee `.value`) |
| Editor de preguntas | OK (**restaurado**) | Alta, edición, reordenar, eliminar (lógico) |
| Categorías jerárquicas | PARCIAL (**restaurado**) | Se crean y listan, pero no generan filtros en cascada |
| Simulación 1–500 | OK (**restaurado**) | Reconecta con `simularRespuestasFormulario` |
| Limpiar simulados | OK (**restaurado**) | Reconecta con `limpiarSimuladosFormulario` |
| CSV | OK (**corregido**) | BOM, `;`, entrecomillado y neutralización de fórmulas |
| PDF | PARCIAL | `window.print()` sin encabezado de reporte completo |
| Login con límite de intentos | OK | 8/10 min con `CacheService` (la doc dice lo contrario) |
| Archivos legado | — | `Constructor.html` y `Formulario.html` se suben aunque no se sirven |

---
## 5. Deficiencias y puntos de quiebre

Severidad: **B** = bloqueante para la fase 2 · **I** = importante · **M** = mejora.

| ID | Acoplamiento | Dónde | Por qué impide «cualquier encuesta» | Sev. | Estado |
|---|---|---|---|---|---|
| `D-01` | IDs mágicos `turno` / `grupo` | `preguntaCategoria()`, `aplicarDependenciasFormulario()`, `filasFiltradas()`, `pintarResumenPanel()` (`turnoFila`), `simularRespuestasFormulario()` | Sin esas preguntas —o renombradas— la cascada, el desglose por turno y el sesgo de simulación fallan en silencio | **B** | Pendiente |
| `D-02` | Catálogo de grupos en el código | `gruposDelTurno()` / `gruposParaFormulario()` | Solo sirve para los 22 grupos de la Secundaria 90; el mapa editable de la hoja se ignora | **B** | Pendiente |
| `D-03` | Dos motores de filtrado | Filtros base (`filtroTurno/Grado/Grupo/Origen`) + `FILTROS_DINAMICOS` | El «Grado» se deriva del primer carácter del grupo; no hay un registro único de filtros. La barra ya se unificó en un botón, pero la lógica sigue duplicada | **B** | Pendiente |
| `D-04` | Modelo de columnas rígido | `columna` fija; `appendRow` con ancho de preguntas activas | Sin versión de esquema ni migraciones; filas nuevas más cortas que el encabezado | **B** | Pendiente |
| `D-05` | Una hoja por script | `getLibro()` con `HOJA_ID` como propiedad **del script** | No se pueden servir dos encuestas; el libro no se cambia desde la UI | **B** | Pendiente |
| `D-06` | `HOJA_ID_FIJA` hardcodeada | `Código.js:55` | Al copiar el proyecto, escribe en la hoja del autor | **B** | Pendiente |
| `D-07` | `extra` como bolsa libre | `condicion`, `categoria`, `escalaMin/Max`, `maxLongitud` | Sin contrato ni validación de esquema | **I** | Pendiente |
| `D-08` | Motor de condiciones limitado | `aplicarCondiciones()` / `condicionVisible()` | Solo 5 operadores sobre un control; sin reglas compuestas ni rangos | **I** | Pendiente |
| `D-09` | Sin previsualización | Editor | Se guarda a ciegas | **I** | Pendiente |
| `D-10` | Sin export/import de esquema | — | No se puede clonar, versionar ni comparar una encuesta | **B** | Pendiente |
| `D-11` | Errores no tipados | `{exito:false, mensaje}` | No se distingue validación de permisos o cuota | **M** | Pendiente |
| `D-12` | Sin paginación ni filtrado en servidor | `obtenerRespuestasFormulario()` | Degradación con 5 000+ respuestas | **I** | Pendiente |
| `D-13` | Sin manejo de CDN caído | `pintarResumenPanel()` | Panel en blanco sin aviso | **I** | Pendiente |
| `D-14` | Simulación ignora condicionales | `simularRespuestasFormulario()` | Genera valores de preguntas ocultas | **M** | Pendiente |
| `D-15` | Esquema sin respaldo al guardar | `guardarFormulario()` | Un fallo a mitad deja la encuesta sin preguntas | **B** | Pendiente |
| `D-16` | Fecha inválida tumba el panel | `Código.js` (`new Date(f[0])`) | Una fila corrupta rompe la carga completa | **I** | Pendiente |
| `D-17` | Cuerpos de 22 funciones ausentes | `Index.html` | 13 botones con `ReferenceError` | **B** | **Corregido** |
| `D-18` | CSV sin escape | `descargarCSVRespuestas()` | Columnas descuadradas e inyección de fórmulas | **I** | **Corregido** |
| `D-19` | Orden de fechas como texto | `pintarTablaRespuestas()` | Orden incorrecto en la vista principal | **I** | **Corregido** |

---

## 6. Hoja de ruta técnica — siguiente fase

### 6.1 Conexión dinámica de hoja de cálculo desde la interfaz

**Modelo de resolución** (de más específico a más general):

1. `Configuracion.hojaId` de la encuesta en curso.
2. Propiedad del script `HOJA_ID` (compatibilidad).
3. Libro contenedor (`getActiveSpreadsheet()`).
4. Si nada resuelve → error explícito; **nunca** caída silenciosa a `HOJA_ID_FIJA`.

| Endpoint | Entrada | Salida | Notas |
|---|---|---|---|
| `probarConexion(idOLink)` | URL o ID | `{ok, nombre, pestañas[], faltantes[], permisos}` | Solo lectura |
| `vincularHoja(idOLink, crearFaltantes)` | URL/ID, booleano | `{ok, pestañasCreadas[]}` | Exige credenciales; persiste `Configuracion.hojaId` |
| `desvincularHoja(confirmacion)` | `DESVINCULAR` | `{ok}` | No borra datos |

**Interfaz:** tarjeta «Origen de datos» en el editor, con campo que acepte URL o ID
(normalizar con `/\/d\/([a-zA-Z0-9_-]{20,})/`), botón **Probar**, botón **Crear pestañas
faltantes** y estado «Conectado a *<nombre>*».

**Errores a mapear:** sin permiso → «comparte el libro como Editor»; ID malformado → formato
esperado; pestañas ausentes → ofrecer crearlas.

**Riesgos:** cambiar de hoja deja datos atrás (exigir exportación JSON y confirmación);
IDs no verificados (solo permitir los que pasaron `probarConexion` en la sesión); cuota
(cachear metadatos 5 min).

### 6.2 Esquema universal de filtros (Eje X) y dependencias

**Paso 1 — rol semántico en lugar de ID mágico:**

```json
{ "id": "grado_escolar", "rol": "grado", "tipo": "unica", "opciones": ["1","2","3"] }
```

Roles: `turno`, `grupo`, `grado`, `nombre`, `fecha`, `origen` (opcionales, uno por rol).

**Paso 2 — catálogo de dimensiones derivado del tipo:**

| Tipo | ¿Dimensión? | Orden |
|---|---|---|
| `unica`, `sino` | Sí, una categoría por opción | Canónico si `extra.ordenCanonico` |
| `multiple` | Sí, conteo por opción | Igual |
| `escala`, `numero` | Sí, con `extra.rango` y bins | Numérico |
| `fecha` | Sí, por día/semana/mes | Cronológico |
| `texto`, `parrafo` | No (solo filtro de texto) | — |
| Derivadas `origen`, `total` | Sí | Fijo |

**Paso 3 — un solo motor de filtros**, con dependencias declarativas que reutilizan el motor
de condiciones actual:

```json
{ "id": "grupo", "filtrable": true,
  "dependsOn": [ { "pregunta": "turno", "operador": "igual", "valor": "$filtro.turno" } ] }
```

**Paso 4 — `obtenerMetadatos()`** en el backend devuelve `{version, preguntas[], dimensiones[], filtros[]}`
para que el frontend no adivine nada.

**Paso 5 — migración v1→v2 sin pérdida:** inferir `rol` por ID, `filtrable: true` en las de
opción, `esquemaVersion = 2`, sin tocar columnas de `Respuestas`.

**Aceptación:** una encuesta **sin** preguntas llamadas «turno» ni «grupo» debe poder
filtrarse, graficarse, tabularse y exportarse sin errores.

### 6.3 Exportación/importación JSON y carga masiva XLSX

**Formato `schema.json` v1:** `{version, generado, hash, meta{}, hoja{}, categorias[], preguntas[]}`,
donde cada pregunta incluye `id, rol, tipo, etiqueta, ayuda, placeholder, obligatoria, opciones[],
orden, activa, columna, extra{}`.

**Importación en tres fases:** validar → previsualizar diff (nuevas/modificadas/eliminadas y
efecto en columnas) → aplicar con respaldo en `Bck Formulario <ts>` y `Bck Configuracion <ts>`.

Reglas: `id` existente conserva su columna; pregunta ausente se desactiva; `columna` del
archivo se ignora si el `id` existe; `version` no soportada se rechaza.

**XLSX — dos caminos:**

| Camino | Cómo | Ventaja | Inconveniente |
|---|---|---|---|
| A. Cliente (SheetJS) | Parseo en el navegador | Sin llamadas extra | Dependencia CDN más |
| B. Servidor (Drive) | Subir → `Drive.Files.insert({mimeType: MIME.XLSX})` → leer → borrar temporal | Sin dependencias, funciona en móvil, una sola ruta de validación | Cuota de Drive |

**Recomendación:** B como principal; A solo para uso sin conexión.

**Plantilla `preguntas.xlsx`:** hoja `Preguntas` con `id, tipo, etiqueta, ayuda, placeholder,
obligatoria, opciones (separadas por \|), orden, activa, rol, condicion_pregunta,
condicion_operador, condicion_valor, escala_min, escala_max, max_longitud`; hojas
`Configuracion` y `Categorias`.

**Reporte de carga:** fila/columna con causa; todo o nada salvo que se elija «aplicar solo
las válidas». Límites: 1 000 preguntas, 50 opciones, archivo ≤ 5 MB.

---

## 7. Criterios de aceptación

### A. Compilación y coherencia (obligatorio)
- [ ] `node --check` sobre el `<script>` inline devuelve **0**.
- [ ] Todos los handlers `on*` del HTML tienen función definida.
- [ ] Cero IDs referenciados inexistentes.
- [ ] `clasp status` muestra solo los 5 archivos del proyecto.
- [ ] Existe una versión ≥ 41 creada **después** de las correcciones.

### B. Formulario público (obligatorio)
- [ ] Abre sin login en ventana de incógnito.
- [ ] Renderiza las preguntas activas en el orden guardado.
- [ ] Turno habilita y filtra Grupo.
- [ ] «Caminando» oculta las preguntas condicionadas y las desmarca como obligatorias.
- [ ] Envío válido → **una** fila en `Respuestas` con `Origen = Real`.
- [ ] Envío incompleto → error visible, sin escribir.
- [ ] El mensaje de éxito muestra el **nombre** del estudiante.

### C. Autenticación (obligatorio)
- [ ] Credenciales correctas abren el panel; incorrectas avisan sin navegar.
- [ ] 9 intentos fallidos bloquean temporalmente.
- [ ] «Salir» limpia el estado.

### D. Editor y mantenimiento
- [ ] La pestaña Editor muestra configuración y lista de preguntas (no vacías).
- [ ] Alta/edición de los 8 tipos, reordenar y guardar.
- [ ] Eliminar una pregunta la desactiva y conserva su columna.
- [ ] Simular 20 respuestas las marca `Simulado`; limpiar borra solo esas.
- [ ] Condición configurada se cumple en la pestaña pública; condición circular se rechaza.

### E. Gráficas
- [ ] Los 8 tipos se dibujan sin excepción en consola.
- [ ] «Ver por» actualiza título, gráfica y totales a la vez.
- [ ] Porcentaje recalcula y el eje muestra `%`; apilado suma 100 %.
- [ ] Zoom de texto y altura persisten tras recargar.
- [ ] Clic en la tarjeta abre el modal y al cerrarlo no queda instancia viva.
- [ ] Si jsDelivr falla, la app **avisa** en lugar de quedarse en blanco (hoy no lo hace).

### F. Datos y exportación
- [ ] Buscar, ordenar por columna, dirección y Top combinados.
- [ ] Los filtros afectan gráfica, totales, tabla y CSV.
- [ ] El CSV abre en Excel con acentos correctos y columnas alineadas.
- [ ] Un comentario con `;`, `"` y salto de línea **no** rompe el CSV.
- [ ] Un valor `=1+1` **no** se convierte en fórmula.
- [ ] Ordenar por Fecha produce orden cronológico correcto.

### G. Seguridad (obligatorio)
- [ ] `ADMIN_PASS` y `CLAVE_ESPECIAL` ya no son los valores por defecto.
- [ ] Sin credenciales, `obtenerRespuestasFormulario` devuelve `autenticado:false`.
- [ ] Sin clave, simular/limpiar fallan sin escribir.
- [ ] La hoja no está compartida como «cualquiera con el enlace».
- [ ] El libro destino es el correcto.

### H. Documentación
- [ ] `DOCUMENTACION.md` y `LEEME.md` describen la versión desplegada.
- [ ] Sin promesas falsas (dos gráficas, `?vista=constructor`, valores en barras).

**Regla de aprobación:** A, B, C y G son obligatorios; D–F pueden quedar con incidencias
documentadas, pero nada que impida capturar o consultar respuestas.

---

## 8. Anexos

### A. Inventario

| Archivo | Líneas | Rol | ¿Se despliega? |
|---|---:|---|---|
| `Index.html` | 2 069 | App única | Sí (única servida) |
| `Código.js` | 729 | Backend | Sí |
| `appsscript.json` | — | Manifiesto | Sí |
| `Constructor.html` | 669 | Legado | Sí (sin uso) |
| `Formulario.html` | 266 | Legado | Sí (sin uso) |
| `DOCUMENTACION.md` | 651 | Documentación | No |
| `LEEME.md` | 75 | Guía rápida | No |

### B. Defectos conocidos

| ID | Defecto | Severidad | Estado |
|---|---|---|---|
| `BUG-01` | Llave suelta: el script no compilaba (v40) | Crítica | Corregido en la base actual |
| `BUG-02` | 22 funciones ausentes → 13 botones rotos | Crítica | **Corregido** |
| `BUG-03` | Editor no se pintaba al abrir su pestaña | Alta | **Corregido** |
| `BUG-04` | CSV sin escape ni neutralización | Alta | **Corregido** |
| `BUG-05` | Orden por fecha/número como texto | Media | **Corregido** |
| `BUG-06` | `{nombre}` tomado de la primera respuesta | Media | **Corregido** |
| `BUG-07` | `localStorage` sin guarda al arrancar | Media | **Corregido** |
| `BUG-08` | «Segmentar por» sin efecto | Alta | Pendiente |
| `BUG-09` | «Tercer nivel» inerte y oculto | Media | Pendiente |
| `BUG-10` | Grupos hardcodeados | Alta | Pendiente |
| `BUG-11` | Categorías jerárquicas decorativas | Media | Pendiente |
| `BUG-12` | Sin etiquetas de valor en barras/pastel | Alta | Pendiente |
| `BUG-13` | Sin aviso si el CDN falla | Media | Pendiente |
| `BUG-14` | Porcentajes > 100 % en opción múltiple | Media | Pendiente |
| `BUG-15` | Fecha inválida tumba el panel (backend) | Media | Pendiente |
| `BUG-16` | Esquema sin respaldo al guardar (backend) | Alta | Pendiente |
| `BUG-17` | `HOJA_ID_FIJA` escribe en hoja ajena | Alta | Pendiente |
| `BUG-18` | Sunburst sin soporte para «Origen» | Baja | Pendiente |

### C. Verificación reproducible

```powershell
# 1) sintaxis
$raw = [IO.File]::ReadAllText("constructor\Index.html", [Text.Encoding]::UTF8)
$js  = [regex]::Match($raw,'(?s)<script>(.*?)</script>').Groups[1].Value
[IO.File]::WriteAllText("$env:TEMP\check.js", $js, (New-Object Text.UTF8Encoding($false)))
node --check "$env:TEMP\check.js"          # debe salir 0

# 2) handlers sin función
$defs = [regex]::Matches($js,'function\s+([A-Za-z_]\w*)') | % { $_.Groups[1].Value }
$on   = [regex]::Matches($raw,'on\w+="([A-Za-z_]\w*)\(') | % { $_.Groups[1].Value } | Sort-Object -Unique
$on | Where-Object { $defs -notcontains $_ }   # debe imprimir nada
```

---

**Fin del documento.**