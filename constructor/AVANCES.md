# Avances del proyecto — Constructor de Encuestas

> Bitácora operativa del constructor (encuesta pública + editor dinámico + panel de analítica).
> **Cómo se usa:** al empezar una sesión lee «Estado actual»; al terminarla, añade una fila en
> «Bitácora» y actualiza el estado. Los detalles de diseño están en `SKILL.md` y los de
> arquitectura en `AUDITORIA-Y-ROADMAP.md`.
> **Última actualización:** 2026-10-25 · 19:00

---

## 1. Estado actual

| Dato | Valor |
|---|---|
| Archivo de trabajo | `constructor/Index.html` — 154305 bytes, 3191 líneas, MD5 `41DDCF3D` |
| Backend | `constructor/Código.js` — 41693 bytes, 1056 líneas, 40 funciones, MD5 `9E840FA4` |
| Carpeta | `G:\Mi unidad\PROYECTOS\Lectura\constructor` (movida el 2026-10-25; la anterior ya no existe) |
| Publicado en | `@HEAD` = `41DDCF3D` · `@57` (alumnos) = `41DDCF3D`; la copia local coincide con HEAD (comprobado con `clasp pull` el 2026-10-25) |
| Enlace de revisión | https://script.google.com/macros/s/AKfycbwInuRa2faaIkV_O14-F0J_sHitzOYMgNrvamiqZBHg/exec |
| Enlace de alumnos | https://script.google.com/macros/s/AKfycbz8Wuh6pv6CD9HwEtDbnlfTIBRRSQetjx-pMSV8qtQeuuszDMWuZEHOSo-ynN62GZst2w/exec |
| Versión servida a alumnos | **57** (publicada el 2026-10-24 · 00:56) |
| Última versión de Apps Script | **57** (la 49, 51 y 52 fueron internas; la 40 estaba rota y su despliegue se retiró) |

### Verificación al día

| Comprobación | Resultado |
|---|---|
| `node --check` del `<script>` inline | 0 errores |
| Funciones definidas | 101 en el cliente · 40 en el servidor (0 duplicadas) |
| Handlers `on*` del HTML sin implementar | 0 |
| IDs referenciados inexistentes | 0 |
| Codificación | UTF-8 sin BOM, saltos LF |
| Sincronía local ↔ HEAD | Idéntica en los 5 archivos (`41DDCF3D` · `9E840FA4`), revalidada el 2026-10-25 |
| Conjunto de publicación | **5 archivos** (`clasp status`); `_backup/`, `_constructor/` y los `.md` quedan fuera |
| Respaldos | `_backup/` = 56 archivos (3.9 MB), incluida `historial-antes-2026-10/` |
| Producción | `@57` sirve la v57: guía de iconos en el editor y ayuda contextual dentro del modal de pregunta |
| Esquema vigente | 18 preguntas activas · 2 jerarquías (turno→grupo y sede→área) · 450 respuestas simuladas |

### Qué funciona hoy

Formulario público con 8 tipos de pregunta y condicionales · login con límite de intentos ·
editor de preguntas (alta, edición, reordenar, eliminar lógico) · categorías jerárquicas
(UI, sin efecto en filtros) · simulación y limpieza · gráficas de 8 tipos con valores ·
apiladas reales por «Segmentar por» · filtros en un solo menú de dos columnas ·
CSV con escape y neutralización de fórmulas · impresión/PDF · tabla con orden cronológico.

---

## 2. Cambios por sesión

### 2.1 Crítico: el `Index.html` no compilaba

- **Síntoma:** la app abría en blanco; nada de JS se ejecutaba.
- **Causa:** un `}` suelto en la línea 1317, resto de una función duplicada
  (`pintarMenusFiltro(); aplicarFiltrosYGraficar(); }` tras el cierre de `limpiarFiltros()`).
  Producía `SyntaxError: Unexpected token '}'` y abortaba el parseo de todo el `<script>`.
- **Alcance:** afectaba a la versión 40, que estaba desplegada en `@40` y `@HEAD`.
- **Solución:** eliminación de las 3 líneas huérfanas.
- **Comprobación:** `node --check` = 0; llaves balanceadas.

### 2.2 Crítico: una segunda variante había perdido 22 funciones

- **Síntoma:** la app cargaba, pero 13 botones visibles lanzaban `ReferenceError`
  (editor, simular, limpiar, ampliar gráfica).
- **Causa:** al llegar al disco otra versión del archivo (75 KB, sincronizada desde Drive)
  se habían perdido los cuerpos de 22 funciones, aunque el HTML, los modales, el CSS y las
  variables globales seguían intactos.
- **Solución:** restauración del bloque completo (zoom, simulación, editor y categorías)
  desde el respaldo de la versión 40, y reconexión del editor al abrir su pestaña.
- **Resultado:** 74 funciones, 0 handlers huérfanos.

### 2.3 Correcciones de datos y robustez

| Corrección | Motivo |
|---|---|
| `celdaCSV()` aplicada a cabecera y filas | Un `;`, una comilla o un salto de línea descuadraban el archivo; `=1+1` se evaluaba como fórmula en Excel |
| `valorFecha()` + orden numérico | Las fechas se ordenaban como texto (`01/11` antes que `05/02`) |
| `leerNumero()` para los tres tamaños | `localStorage` bloqueado mataba el panel al cargar |
| `{nombre}` desde la pregunta de nombre | Mostraba la primera respuesta («Matutino») en lugar del nombre |

### 2.4 Filtros: de 13 controles a 1

- **Antes:** 4 filtros base + 9 embudos idénticos (uno por pregunta de opción), todos con el
  mismo icono y sin texto.
- **Ahora:** un botón `🔽` con contador; el menú agrupa «Segmentación» (Turno, Grado, Grupo,
  Origen) y «Preguntas», en **dos columnas** (una en móvil).
- Se conservan la cascada turno → grupo, el contador de filtros activos y el valor elegido al
  repintar.

### 2.5 Sistema de estilos

- Se detectó que los menús usaban los valores por defecto de Bootstrap: `active` azul sólido y
  hover que rellenaba los botones de azul puro.
- Se añadieron **11 tokens CSS** y reglas para menús, ítems, cabeceras, botones y filas de filtro.
  Regla central: **el estado activo tiñe, nunca rellena**.
- Se documentó todo en `SKILL.md` (201 → 215 líneas).

### 2.6 Gráficas

- **Valores:** faltaba el plugin (`afterDatasetsDraw` había desaparecido). Restaurado como
  `pluginValores` y aplicado a las 4 configuraciones (panel y modal): barras, pastel, dona,
  líneas y segmentos apilados.
- **Apiladas:** siempre segmentaban por Turno, ignorando «Segmentar por». Con «Ver por: Turno»
  cada barra tenía un solo segmento al 100 % (gráfica correcta pero inútil).
  Ahora las series salen de «Segmentar por», que **nunca ofrece la dimensión del eje**
  (si coinciden, cae a `origen`/`turno`); el 100 % se calcula por categoría o por total.
- **«Ver por»:** salía «Turno» dos veces (pregunta + opción fija). Se deduplica por `id`.

---

### 2.7 Sesión 2026-10-23 — publicación de la v45 y puesta al día

- **Diagnóstico:** se comparó cada versión de Apps Script contra la carpeta con la API de
  contenido. Local ≡ `@HEAD` ≡ **v45** (`ED97574E` / `18A770BF`), pero el enlace de alumnos
  seguía en la **v43** (`702C87A2` / `F506248D`): 227 líneas y 13 funciones de diferencia,
  sin barra dinámica de dimensiones ni ejemplo de jerarquía.
- **Publicación:** el despliegue de alumnos pasó a la **v45**. Verificado: el despliegue
  responde `@45` y el HTML servido contiene `dimensionesDisponibles`, `filtrosDimensiones`,
  `instalarJerarquiaDemo` y la tarjeta de ejemplo; ya no aparece `btn-filtroTurno`.
- **Respaldos:** se recreó `_backup/` con la v43 (rollback inmediato) y la v45 (estado actual).
- **Documentación:** `AVANCES.md` y `RADIOGRAFIA.md` al día; las filas de la v44 y la v45 que
  habían quedado fuera de la tabla de `RADIOGRAFIA.md` se movieron a su sitio.

---

### 2.8 Sesión 2026-10-23 — rediseño del panel (v46, 13:40)

Petición: los filtros debían ser **Turno, Grado y Grupo** en ese orden; la gráfica debía
elegirse **desde su propio título**; los filtros por pregunta tenían que vivir **en la tarjeta**
y el bloque «Eje X / División» sobraba.

- **Barra:** quedan Turno · Grado · Grupo, en ese orden, generados desde el esquema
  (`dimensionesBarra()`), con la cascada Grupo ← Turno intacta.
- **Selector de pregunta:** el título de la tarjeta es un desplegable con todas las preguntas
  del esquema (primero las de opción, luego texto libre). Al elegir una se grafican sus opciones
  con los filtros aplicados. Desaparece el botón 📊 de cada fila de filtros.
- **Filtros por pregunta:** el botón 🔽 con contador pasó de la barra a la cabecera de la
  tarjeta de la gráfica.
- **Fuera «Eje X / División»:** se eliminaron los chips y `crearChipsLi()`. «División» solo
  aparece en Ajustes cuando el tipo es barras apiladas.
- **Fuera el ejemplo Sede → Área → Puesto:** se retiró la tarjeta del editor y sus funciones
  de cliente. En su lugar, 🛠 → «Quitar preguntas de ejemplo» desactiva las que sigan en la hoja.
- **Higiene del proyecto:** `clasp push` subió `_backup/**` al proyecto (5 archivos, dos con
  copias antiguas de `Código.js` que duplicaban funciones). Se eliminaron del proyecto y se
  añadió `.claspignore` con `_backup/**`, `_revision/**` y `*.md`.
- **Documentación:** `LEEME.md` reescrito como guía de la v46 (panel, publicación, historial);
  `DOCUMENTACION.md` marcado como histórico; `AVANCES.md` y `RADIOGRAFIA.md` al día.

---

### 2.9 Sesión 2026-10-23 — v47, el selector deja de abrir el modal (22:35)

- **Síntoma:** al elegir una pregunta en el selector del título se abría además el modal de la
  gráfica ampliada.
- **Causa:** el `onclick` del zoom vive en la tarjeta, que contiene el menú. Al elegir, el
  manejador repinta el menú (`innerHTML`) antes de que el clic termine de subir; el botón
  pulsado queda suelto del DOM y `e.target.closest(".dropdown")` devuelve `null`, así que la
  guarda de `ampliarGrafica` dejaba pasar el clic.
- **Solución:** la guarda descarta ahora los nodos desprendidos (`isConnected === false`) y
  cualquier control (`button`, `select`, `input`, `label`, `a`). No se usa
  `stopPropagation` porque Bootstrap cierra los menús con un manejador en `document`:
  detenerlo habría dejado el desplegable abierto tras elegir.
- **Alcance:** el mismo defecto existía en el menú **Ajustes** (tipo, valores, base porcentual).
- **Publicación:** v47 creada y `@47` apuntando a ella; verificado que la URL pública sirve la
  función corregida (Apps Script escapa el JS al servir, por eso se comprueba la función, no el
  texto literal).

---

### 2.10 Sesión 2026-10-23 — v48, rol analítico y jerarquía declarativa (23:35)

- **Modal:** el interruptor «Usar como dimensión» se sustituyó por **Rol analítico** (identidad,
  dimensión, métrica), la casilla **¿Permitir graficar en el panel?** y una sección de **jerarquía**
  (padre + opciones por valor del padre) visible solo con rol dimensión.
- **Regla reactiva:** texto y párrafo fuerzan identidad, apagan y deshabilitan el gráfico; los tipos
  con opciones encienden el gráfico y vuelven a métrica por defecto.
- **Backend:** `normalizarExtra(extra, tipo)` persiste `rol` y `graficable`, deriva
  `esDimension = (rol === "dimension")` y limpia `padre`/`opcionesPorPadre` fuera del rol dimensión.
  `validarPregunta` rechaza roles inválidos y combinaciones incoherentes.
- **Migración:** sin `rol` guardado, se infiere del tipo y de `esDimension`/`padre`, de modo que las
  cascadas de la v45-v47 siguen funcionando sin tocar la hoja.
- **Panel:** el selector agrupa por «Dimensiones (Eje X)» y «Métricas (Eje Y)» y excluye identidad y
  `graficable:false`; la orientación cartesiana quedó explícita en `ejeCartesiano`.
- **Efecto secundario:** la gráfica ya no abre con el nombre del estudiante.
- **Publicación:** v48 creada y `@48` apuntando a ella; versión y URL verificadas.

---

### 2.11 Sesión 2026-10-23 — encuesta nueva y datos simulados (23:52)

- **Limpieza:** las 50 respuestas existentes eran **todas simuladas** (0 reales); se borraron con
  «Limpiar simulados» antes de cambiar el esquema.
- **Encuesta nueva (18 preguntas):** ejercita todo el modelo de la v48 — tres roles (identidad,
  dimensión, métrica), dos jerarquías (`turno→grupo` y `sede→área`), condiciones con `distinto`,
  `contiene` e `igual`, los ocho tipos, escala 1–5, longitudes máximas y dos preguntas con
  `graficable:false` (`gastoMensual`, además de las de identidad).
- **Inactivas:** `comentarios` y las tres preguntas de ejemplo (`demo_sede`, `demo_area`,
  `demo_puesto`) quedaron desactivadas.
- **Datos:** 250 respuestas generadas con el simulador real (`simularRespuestasFormulario`, perfil
  variado), no con filas escritas a mano.
- **Método:** el sembrado se hizo con un puente temporal desplegado y retirado en la misma sesión.
  La **versión 49** del proyecto es ese puente: existe en el historial pero **no está desplegada**;
  producción sigue en la 48.
- **Respaldo del esquema anterior:** `_backup/esquema-v47-v48.json` (config y 11 preguntas).

---

### 2.12 Sesión 2026-10-24 — panel en blanco y modal al pulsar la tarjeta (00:05)

- **Síntoma:** el panel mostraba el armazón vacío («Resultados», «0 respuestas», encabezado
  Matutino/Vespertino) sin ejes ni filas, y al pulsar la zona de la gráfica se abría el modal.
- **Diagnóstico:** se reprodujo el HTML con jsdom usando el esquema real (22 filas de `Formulario`)
  y 450 respuestas: el cliente pinta correctamente (título, badge, tabla, 13 opciones en el selector,
  8 filtros). Lo que se veía era el **DOM inicial**: la respuesta del servidor no había llegado.
- **Causa raíz:** `cargarRespuestas()` no tenía `withFailureHandler` ni estado de carga. Ante
  cualquier error, sesión inválida o simple lentitud, el panel quedaba en blanco **sin ningún
  mensaje**, indistinguible de un fallo.
- **Correcciones:** mensaje «Cargando datos…» al iniciar; errores de sesión, de red y de pintado
  visibles en la línea de estado; `try/catch` alrededor del render para que un fallo parcial no
  deje la pantalla muda; aviso específico si Chart.js no carga; y estado vacío explícito con la
  pista de simular.
- **Zoom retirado:** la tarjeta ya no tiene `onclick` ni `cursor: zoom-in`; pulsar la gráfica no
  abre nada. El modal sigue en el HTML pero sin disparador.
- **Datos:** 450 respuestas simuladas (250 sembradas + 200 generadas desde el panel).
- **Verificación:** jsdom con 450 filas → «Turno» y «450 respuestas»; sesión inválida y error de
  red muestran su mensaje; `onclick` y `style` ausentes en la tarjeta.

---

### 2.13 Sesión 2026-10-24 — el panel seguía vacío: `google.script.run` devolvía null (00:20)

- **Síntoma:** tras la v50 el panel mostraba «El servidor no devolvió datos. Vuelve a recargar.».
- **Diagnóstico:** se automatizó un Chrome headless contra la URL publicada y se entró con el login
  real. Llamando por RPC: `obtenerFormulario()` (payload pequeño) devolvía las 18 preguntas, pero
  `obtenerRespuestasFormulario()` llegaba como **`[object Null]`**, sin error de consola.
- **Causa:** el objeto de retorno pesa ~276 KB con 450 filas y `google.script.run` lo entrega como
  `null` al serializarlo. La función del servidor sí devolvía el objeto completo (450 filas, 22
  preguntas, 282 684 bytes medidos en el servidor).
- **Solución:** nueva `obtenerRespuestasFormularioJSON()` que devuelve `JSON.stringify(datos)`; el
  cliente la llama y hace `JSON.parse`. Una cadena de 282 684 caracteres viaja sin problema.
- **Verificación en navegador real:** «Mostrando 450 de 450 registros», badge «450 respuestas»,
  canvas de 573×320 dibujado, Matutino 348 / Vespertino 102, tabla por segmento correcta.
- **Límite conocido:** si el volumen crece mucho, la cadena también tendrá techo; el siguiente paso
  sería paginar por tramos de filas.

---

### 2.14 Sesión 2026-10-24 — el menú de filtros se quedaba abierto (00:26)

- **Síntoma:** al elegir un filtro por pregunta el menú seguía abierto y tapaba la gráfica.
- **Causa:** el botón lleva `data-bs-auto-close="outside"`, pensado para fijar varios filtros de una
  vez; por diseño Bootstrap no lo cierra al interactuar dentro.
- **Solución:** `cerrarMenuFiltros()` oculta el desplegable tras cada `change`, usando la instancia
  de `bootstrap.Dropdown`.
- **Verificación en navegador real:** menú `show` antes, `false` después; badge «1»; la muestra pasa
  a 64 de 450 y la gráfica se redibuja.

---

### 2.15 Sesión 2026-10-24 — etiquetas del eje configurables (00:33)

- **Síntoma:** en barras verticales las etiquetas rotadas a 45° ocupaban casi todo el alto de la tarjeta.
- **Causa:** el panel no definía `scales`, así que Chart.js aplicaba su rotación automática al no caber
  el texto.
- **Solución:** nuevo ajuste **Etiquetas del eje** (`#etiquetasGrafica`) en Ajustes, con tres modos:
  `multilinea` (por defecto: `maxRotation: 0` y el texto partido en líneas de 16 caracteres sin cortar
  palabras), `auto` (comportamiento anterior, rotada si no cabe) y `recortadas` (18 caracteres + «…»;
  el tooltip sigue mostrando el texto completo). Se aplica a la tarjeta, al modal y a las apiladas.
- **Verificación:** jsdom comprueba las tres ramas del callback; en navegador real las barras
  verticales de «Movilidad» dibujan con etiquetas en 2–4 líneas (canvas 573×320).
- **Menú de filtros:** revalidado en `@55`; sigue cerrándose al elegir (la captura del reporte era
  anterior a la recarga de la v54).

---

### 2.16 Sesión 2026-10-24 — ayuda de la barra y del formulario (00:56)

- **Petición:** explicar qué hace y cómo se configura cada icono, y cómo se llenan las preguntas
  (sobre todo las condicionales), sin salir del editor.
- **Guía de la barra (v56):** botón `?` en la cabecera de «Esquema de Preguntas» que abre el modal
  **Guía del constructor**, con dos pestañas: *Iconos de la barra* (28 filas agrupadas en pestañas,
  filtros, tarjeta, hoja de datos y acciones) y *Cómo crear preguntas* (8 pasos y tabla de
  operadores de condición).
- **Ayuda contextual (v56):** botón `?` dentro de `#modalPregunta` que despliega un panel con los
  campos del formulario y las reglas de las preguntas condicionales. Se oculta al abrir otra
  pregunta y no abre un segundo modal encima.
- **Ajustes (v57):** el título y su botón quedan agrupados a la izquierda; el modal de pregunta usa
  `modal-dialog-scrollable` para que el cuerpo haga scroll interno cuando la ayuda está abierta.
- **Verificación:** navegador real (modal visible, pestañas correctas, 28 filas, 8 pasos, panel oculto
  y visible) y jsdom (alternar y ocultar al reabrir).

---

### 2.17 Sesión 2026-10-25 — traslado de carpeta, respaldos y auditoría

- **Traslado:** el proyecto vive ahora en `G:\Mi unidad\PROYECTOS\Lectura\constructor`. La
  carpeta anterior (`PROYECTOS\EncuestaMovilidad\constructor`) ya no existe; en
  `PROYECTOS\EncuestaMovilidad` queda **otro** proyecto de Apps Script (`1lHayrD1mc6…`, con
  despliegues `@49/@74/@82`), que no se toca desde aquí.
- **Barrido de la carpeta vieja:** se revisaron 6 013 archivos de `PROYECTOS` buscando las
  huellas del constructor (scriptId, `obtenerFormulario`, `guardarRespuestaFormulario`): no
  aparece ningún archivo suyo fuera de `constructor/`. Las únicas coincidencias son el proyecto
  viejo (`1lHay…`, en `_dev/`) y menciones de texto en la app de `Lectura`.
- **Duplicado de respaldos:** al mover la carpeta, Drive dejó un `-backup\` (con guion) con las
  22 instantáneas `constructor-antes-*`. Se comprobó que eran **idénticas** (MD5) a las del
  proyecto y se consolidaron en `_backup\historial-antes-2026-10\` (22 instantáneas +
  `diff-v45-v46.diff`); el `-backup\` vacío se eliminó.
- **Publicación:** `.claspignore` añade `_constructor/**` y `-backup/**`. `clasp status` pasa de
  31 archivos a los **5** reales (`Index.html`, `Código.js`, `Constructor.html`,
  `Formulario.html`, `appsscript.json`).
- **Verificación:** se trajo `@HEAD` a una carpeta temporal y los 5 archivos coinciden byte a
  byte con la copia local (`41DDCF3D` · `9E840FA4` · `A4502673` · `D9875DEE` · `77B5A41C`).
- **Auditoría de código:** revisión completa de `Index.html` y `Código.js`; los hallazgos quedan
  en `RADIOGRAFIA.md` §7 y §9 (R1–R14) y en los pendientes de §3. Los más graves: condiciones
  con `contiene`/multiple que pierden respuestas, guardado del esquema destructivo, credenciales
  por defecto con bloqueo global y `deleteRow` fila por fila en la limpieza.

---

## 3. Pendientes

### P0 — seguridad (único bloqueante)
- [ ] Rotar `ADMIN_PASS` y `CLAVE_ESPECIAL` en Propiedades del script: sin propiedad, el
  código sigue cayendo en `Admin-dev` / `Memo#1` (`Código.js` §1 y `getClaveSimulacion`).
- [x] Versión 41 creada y `@7` apuntado a ella.
- [x] Despliegue `@40` retirado; el enlace de alumnos sirve la **v47** desde el 2026-10-23.

### P1 — siguiente iteración
- [ ] **Preguntas de ejemplo todavía activas en la hoja:** desactivarlas con 🛠 → «Quitar
  preguntas de ejemplo». Mientras no se pulse, siguen apareciendo en la encuesta de alumnos.
- [ ] `validarRespuestas()` valida contra `p.opciones` y no contra `extra.opcionesPorPadre`
  (solo afecta si alguien define jerarquías desde la hoja).
- [ ] La simulación ignora `opcionesPorPadre` (misma condición).
- [ ] Condiciones: `contiene` no existe en el cliente y las de multiple/escala leen `.value` de
  un `div`; el servidor compara un array contra `"A; B"` (`Index.html:1453`, `Código.js:604`).
- [ ] `aplicarCondiciones()` vacía el valor del primer checkbox/radio y lo marca `required`
  (`Index.html:1461`); la cascada escribe `<option>` en hijos que no son `select` (`1429`).
- [ ] Editar una condicional puede impedir el guardado: el desplegable de valor se arma antes
  de fijar la pregunta (`Index.html:2814`, `3026`).
- [ ] Filtrar por una pregunta de opción múltiple solo acierta respuestas únicas (`Index.html:2056`).
- [ ] `limpiarSimulados()` borra con `deleteRow` fila por fila (`Código.js:840`).
- [ ] `LEEME.md` sigue anunciando la v46 en su cabecera y su historial termina en la 48.
- [ ] `guardarFormulario()` vacía `Configuracion` y la reescribe sin `hojaId`, así que el paso 2
  de la cascada de resolución del libro queda muerto.
- [ ] Categorías jerárquicas: se crean pero no generan filtros en cascada.
- [ ] Sin aviso si el CDN de Chart.js falla (el panel queda en blanco).
- [ ] `guardarFormulario()` reescribe el esquema sin respaldo previo.
- [ ] Accesibilidad: `th` sin teclado, `alert/confirm/prompt`, modales sin `aria-labelledby`.

### P2 — fase de escalabilidad (ver `AUDITORIA-Y-ROADMAP.md` §6)
- [ ] Conexión dinámica de hoja de cálculo desde la interfaz.
- [ ] Esquema universal de filtros y dependencias (roles semánticos en vez de `turno`/`grupo`).
- [ ] Exportación/importación de esquema en JSON y carga masiva desde XLSX.

---

## 4. Cómo publicar y revertir

```powershell
cd "G:\Mi unidad\PROYECTOS\Lectura\constructor"
$clasp = "C:\Users\Administrador\AppData\Local\nodejs-portable\node-v24.21.0-win-x64\node_modules\@google\clasp\build\src\index.js"

# 1) validar antes de subir
node --check "$env:TEMP\check.js"      # sobre el <script> extraído

# 2) subir a HEAD y probar en la URL de revisión
node $clasp push -f

# 3) crear versión y apuntar el enlace de alumnos
node $clasp version "v58 - descripcion del cambio"
node $clasp update-deployment AKfycbz8Wuh6pv6CD9HwEtDbnlfTIBRRSQetjx-pMSV8qtQeuuszDMWuZEHOSo-ynN62GZst2w -V 58

# 4) revertir (misma URL, segundos) — la v57 es la última anterior verificada
node $clasp update-deployment AKfycbz8Wuh6pv6CD9HwEtDbnlfTIBRRSQetjx-pMSV8qtQeuuszDMWuZEHOSo-ynN62GZst2w -V 57
```

> Antes de publicar, comprobar que el archivo local no cambió por la sincronización de Drive:
> `Index.html` **154 305** bytes / MD5 **`41DDCF3D`** y `Código.js` **41 693** bytes / **`9E840FA4`**
> (estos valores cambian con cada versión: los vigentes están en `RADIOGRAFIA.md` §8).
> Contrastar con `node $clasp deployments` y con la tabla de versiones de `RADIOGRAFIA.md`.

---

## 5. Respaldos

| Archivo | Qué contiene |
|---|---|
| `_backup/constructor-v40-Index.html` | v40 original, recuperada de Apps Script (no compila; solo archivo histórico) |
| `_backup/constructor-v43-Index.html` | Copia exacta de la v43 (lo que servía a alumnos hasta hoy) |
| `_backup/constructor-v43-Codigo.js` | Backend de la v43 (`F506248D`) |
| `_backup/constructor-v45-Index.html` | Copia exacta de la v45 ≡ HEAD ≡ local (`ED97574E`) |
| `_backup/constructor-v45-Codigo.js` | Backend de la v45 (`18A770BF`) |
| `_backup/constructor-v45-appsscript.json` | Manifiesto de la v45 (`A4502673`) |
| `_backup/constructor-v47-Index.html` | Copia exacta de la v47 (`0BBD5DD3`) |
| `_backup/constructor-v47-Codigo.js` | Backend de la v47 (`18A770BF`) |
| `_backup/constructor-v47-appsscript.json` | Manifiesto de la v47 (`A4502673`) |
| `_backup/constructor-v48-Index.html` | Copia exacta de la v48 (`E62122A8`) |
| `_backup/constructor-v48-Codigo.js` | Backend de la v48 (`2B7DFC06`) |
| `_backup/constructor-v48-appsscript.json` | Manifiesto de la v48 (`A4502673`) |
| `_backup/constructor-v53…v57-*` | Copias de las versiones 53 a 57 (`Index` y `Código`) |
| `_backup/esquema-v47-v48.json` | Config y 11 preguntas del esquema anterior |
| `_backup/historial-antes-2026-10/` | 22 instantáneas `constructor-antes-*` (22–23/10) y `diff-v45-v46.diff` |

> Comprobado el 2026-10-25: `constructor-v57-*` es idéntico a los archivos que sirve producción.
> El antiguo `-backup\` (duplicado creado por la sincronización al mover la carpeta) ya no existe.

---

## 6. Documentos del proyecto

| Documento | Estado | Para qué |
|---|---|---|
| `RADIOGRAFIA.md` | Vigente | Foto técnica del sistema: arquitectura, modelo de datos, contratos, interfaz y métricas |
| `AVANCES.md` | Vigente | Este archivo: estado y bitácora |
| `AUDITORIA-Y-ROADMAP.md` | Vigente | Auditoría funcional, deficiencias, hoja de ruta y criterios de aceptación |
| `SKILL.md` | Vigente | Reglas de estilos de menús, controles y gráficas |
| `DOCUMENTACION.md` | **Histórico (v7)** | Documentación de la versión 7; lleva aviso de vigencia y remite a `LEEME.md` |
| `LEEME.md` | Vigente | Guía de uso del panel (v57), publicación, historial de versiones y problemas típicos |
| `FLUJO-ESQUEMA.md` | Vigente | Recorrido del esquema de preguntas: hoja `Formulario` → servidor → cliente → escritura |
| `FLUJO-RESPUESTAS.md` | Vigente | Recorrido de una respuesta: formulario → hoja `Respuestas` → panel, gráficas y exportaciones |

---

## 7. Bitácora

| Fecha | Resumen | Hash |
|---|---|---|
| 2026-10-21 | Versión 40: filtros unificados y constructor (no compila) | `F368CC1D` |
| 2026-10-22 22:24 | Llega variante de 75 KB sin editor ni mantenimiento | `40191E25` |
| 2026-10-22 22:24 | Restauradas 22 funciones; CSV, orden, nombre y `localStorage` | `B079232A` |
| 2026-10-22 23:08 | Filtros: un solo botón con contador y menú | `3181B269` |
| 2026-10-22 23:29 | Sistema de estilos + `SKILL.md` | `5A8B2BFF` |
| 2026-10-22 23:48 | Valores en gráficas, apiladas reales, dos columnas, icono único | `8263D64D` |
| 2026-10-22 23:52 | Menús: cabeceras con icono y ayuda que explican su papel | `E13C6B29` |
| 2026-10-22 23:58 | Menús: filtros en dos paneles; Eje X y División junto a la gráfica | `C4BA2A06` |
| 2026-10-23 00:05 | Eje X y División pasan al menú de filtros (sección Gráfica) | `95444969` |
| 2026-10-23 00:12 | Botón «Vista y filtros» y `aria-label` en los 28 botones que no lo tenían (SKILL §3) | `C2491B45` |
| 2026-10-23 00:30 | Eje reducido a 4 dimensiones; botón «graficar» por pregunta | `AF707CD1` |
| 2026-10-23 00:40 | Eje y División como chips visibles (sin desplegable) | `433E232B` |
| 2026-10-23 00:45 | Eje: la pregunta activa se muestra como estado, no como chip | `346B22A4` |
| 2026-10-23 00:58 | Filtros base como iconos; preguntas en un desplegable; eje/división en Ajustes | `49BC1858` |
| 2026-10-23 01:05 | Etiquetas de pregunta limitadas a 2 líneas con tooltip | `D0193FB0` |
| 2026-10-23 01:20 | Opción múltiple: % sobre ocurrencias; fecha inválida ya no rompe el panel | `93ECAFF3` |
| 2026-10-23 01:30 | **Publicada la versión 41** en @7; retirado el despliegue @40 | `93ECAFF3` |
| 2026-10-23 01:45 | Tabla de totales con una columna por segmento (igual que la gráfica) | `711F9A24` |
| 2026-10-23 02:00 | **Publicada la versión 42** (tabla por segmento) | `711F9A24` |
| 2026-10-23 02:10 | Creado RADIOGRAFIA.md (foto técnica que se actualiza en cada cambio) | `711F9A24` |
| 2026-10-23 02:50 | Bloque 2: conexión dinámica de hoja (cascada, vinculación y auto-aprovisionamiento) | `702C87A2` |
| 2026-10-23 03:00 | **Publicada la versión 43** (conexión dinámica de hoja) | `702C87A2` |
| 2026-10-23 03:30 | Bloque 3: jerarquía universal de filtros (dimensiones, padre, opcionesPorPadre) | `AB450F5D` |
| 2026-10-23 03:40 | Ejemplo de jerarquía instalable desde el panel (Sede → Área → Puesto) | `ED97574E` |
| 2026-10-23 13:10 | **Publicada la versión 45** en `@45`: los alumnos pasan de la v43 a la v45 | `ED97574E` |
| 2026-10-23 13:15 | `_backup/` recreado con v43 y v45; `AVANCES.md` y `RADIOGRAFIA.md` al día | `ED97574E` |
| 2026-10-23 13:40 | **Publicada la v46**: selector de pregunta en la tarjeta, filtros fijos Turno/Grado/Grupo, fuera «Eje X» y el ejemplo | `3354DC87` |
| 2026-10-23 13:45 | `.claspignore` y limpieza de `_backup/**` del proyecto de Apps Script | `3354DC87` |
| 2026-10-23 14:00 | Documentación: `LEEME.md` reescrito (v46), `DOCUMENTACION.md` marcado histórico, respaldos de la v46 | `3354DC87` |
| 2026-10-23 22:35 | **Publicada la v47**: elegir pregunta ya no abre el modal de zoom; misma guarda en Ajustes | `0BBD5DD3` |
| 2026-10-23 23:35 | **Publicada la v48**: rol analítico, graficable y jerarquía Eje X/Y en el editor | `E62122A8` |
| 2026-10-23 23:52 | Encuesta nueva sembrada (18 preguntas, 2 jerarquías, 250 respuestas simuladas); el esquema anterior queda inactivo | `E62122A8` |
| 2026-10-24 00:05 | **Publicada la v50**: sin zoom por clic, carga con estado visible y errores explícitos en el panel | `BE9BBBF8` |
| 2026-10-24 00:20 | **Publicada la v53**: el panel recibe esquema y respuestas como JSON; gráfica y tabla ya se dibujan | `0A72C73B` |
| 2026-10-24 00:26 | **Publicada la v54**: el menú de filtros por pregunta se cierra al elegir un valor | `59CF8787` |
| 2026-10-24 00:33 | **Publicada la v55**: etiquetas del eje en varias líneas por defecto, con modo automático y recortado | `560DDAAC` |
| 2026-10-24 00:54 | **Publicada la v56**: guía de iconos y ayuda dentro del modal de pregunta | `6F750DB1` |
| 2026-10-24 00:56 | **Publicada la v57**: encabezado agrupado y scroll interno del modal de pregunta | `41DDCF3D` |
| 2026-10-25 19:00 | Traslado a `PROYECTOS\Lectura\constructor`, respaldos consolidados, `.claspignore` corregido (5 archivos) y auditoría de código en `RADIOGRAFIA.md` §9 | `41DDCF3D` |
