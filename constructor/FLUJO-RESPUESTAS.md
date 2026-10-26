# Flujo de datos — Respuestas y Panel

> **Qué es:** el recorrido de una respuesta desde el formulario hasta la hoja, y de vuelta al panel
> (filtros, agregación, gráficas, tabla y exportaciones).
> **Cuándo consultarlo:** antes de tocar `guardarRespuestaFormulario`, `obtenerRespuestasFormulario`,
> `filasFiltradas` o cualquier vista del panel.
> **Última actualización:** 2026-10-23 · v48 (`E62122A8`). Los números de línea se fijaron en la v47:
> en la v48 el editor creció, así que los tramos de `abrirModal`, `guardarPregunta` y
> `pintarSelectorPregunta` pueden estar desplazados. Los nombres de función son la referencia estable.
> **Documento hermano:** `FLUJO-ESQUEMA.md` (el esquema de preguntas, que es el contrato de columnas).

---

## 0. En una línea

La respuesta viaja como `{ id: valor }`, se valida en el servidor, se escribe en la columna que dicta
el esquema y el panel la vuelve a leer **por `id`** para filtrar, agregar, graficar y exportar.

---

## 1. Mapa

```text
Encuesta pública  (FORM.preguntas)
        │  enviar()                                 Index.html:1302
        ▼
  { respuestas: { id: valor } }
        │  guardarRespuestaFormulario()             Código.js:602
        │    validarRespuestas()                    Código.js:566
        │    condicionVisible() + valorRespuesta()  Código.js:551 / 546
        ▼
Hoja "Respuestas"   [ fecha | origen | ...una columna por p.columna ]
        │  obtenerRespuestasFormulario(creds)       Código.js:809
        ▼
RESPUESTAS = { config, preguntas, filas[] }        Index.html:1400
        │  filasFiltradas()                        Index.html:1830
        ├── pintarResumenPanel()                   Index.html:1845  → tabla + gráfica + modal
        ├── pintarTablaRespuestas()                Index.html:2031  → búsqueda y orden
        └── descargarCSVRespuestas()               Index.html:2120  → CSV / PDF
```

---

## 2. Envío desde el formulario

```js
// Index.html:1302
function enviar(e) {
  e.preventDefault();
  const respuestas = {};
  const faltan = [];
  (FORM.preguntas || []).forEach(p => {
    const wrap = document.querySelector('[data-id="' + p.id + '"]');
    const oculto = wrap && wrap.classList.contains("d-none");   // condicional no aplicable
    let valor = "";
    if (p.tipo === "multiple") valor = Array.from(document.querySelectorAll("#campo_" + p.id + " input:checked")).map(i => i.value);
    else if (p.tipo === "escala") { const c = document.querySelector("#campo_" + p.id + " input:checked"); valor = c ? c.value : ""; }
    else { const el = document.getElementById("campo_" + p.id); valor = el ? el.value : ""; }
    respuestas[p.id] = valor;
    const vacio = p.tipo === "multiple" ? valor.length === 0 : String(valor).trim() === "";
    if (p.obligatoria && vacio && !oculto) faltan.push(p.etiqueta);
  });
  if (faltan.length) { /* error junto al formulario; no se envía */ return; }
  google.script.run.guardarRespuestaFormulario({ respuestas: respuestas });
}
```

Dos reglas del cliente que conviene no romper:

- **Múltiple llega como arreglo**, todo lo demás como cadena.
- Una pregunta **oculta por condición** no se exige aunque sea obligatoria (`oculto`).

---

## 3. Validación en el servidor (la que manda)

```js
// Código.js:566
function validarRespuestas(preguntas, respuestas) {
  for (const p of preguntas) {
    if (!condicionVisible(p, respuestas)) continue;      // pregunta condicional no aplicable
    const valor = respuestas[p.id];
    const vacio = p.tipo === "multiple" ? (!Array.isArray(valor) || valor.length === 0)
                                        : (valor == null || String(valor).trim() === "");
    if (p.obligatoria && vacio) return "Falta responder «" + p.etiqueta + "».";
    if (vacio) continue;
    if (p.tipo === "unica" || p.tipo === "sino") { /* la opción debe existir */ }
    if (p.tipo === "multiple") { /* cada valor debe existir */ }
    if (p.tipo === "numero" && isNaN(Number(valor))) return "...";
    if (p.tipo === "fecha") { /* fecha válida */ }
    if (p.tipo === "escala") { /* dentro de escalaMin..escalaMax */ }
    if ((p.tipo === "texto" || p.tipo === "parrafo") && String(valor).charAt(0) === "=")
      return "«" + p.etiqueta + "» no puede empezar con «=».";   // neutraliza fórmulas
    if (Number(p.extra.maxLongitud) > 0 && String(valor).length > Number(p.extra.maxLongitud))
      return "«" + p.etiqueta + "» es demasiado largo.";
  }
  return null;
}
```

El cliente valida comodidad; el servidor valida verdad. Cualquiera con la URL puede saltarse el primero.

---

## 4. Escritura en la hoja

```js
// Código.js:602
function guardarRespuestaFormulario(datos) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return { exito: false, mensaje: "El sistema está ocupado. Intenta de nuevo." };
  try {
    const preguntas = leerPreguntas(true);                 // solo activas
    const respuestas = (datos && datos.respuestas) || {};
    const problema = validarRespuestas(preguntas, respuestas);
    if (problema) return { exito: false, mensaje: problema };

    const hoja = getHojaRespuestas();
    let maximo = 2;
    preguntas.forEach(p => { if (p.columna > maximo) maximo = p.columna; });
    const fila = new Array(maximo).fill("");
    fila[0] = new Date();
    fila[1] = "Real";
    preguntas.forEach(p => {
      fila[p.columna - 1] = condicionVisible(p, respuestas) ? valorRespuesta(p, respuestas[p.id]) : "";
    });
    hoja.appendRow(fila);
    return { exito: true };
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}
```

| Columna | Contenido |
|---|---|
| 1 | `new Date()` — la marca temporal la pone el servidor, no el navegador |
| 2 | `Origen`: `Real` (o `Simulado` por la vía de simulación) |
| 3… | una por pregunta, en su `p.columna` |

Detalles que importan:

- **`condicionVisible` decide el contenido, no solo la visibilidad**: si la condición no aplica, se guarda `""`; no queda dato viejo.
- **`valorRespuesta`** une las opciones de una múltiple con `"; "`, que es el formato que luego parte el panel.
- **El lock** evita filas intercaladas cuando dos alumnos envían a la vez.
- **`maximo`** se calcula con las preguntas activas, pero las columnas de preguntas desactivadas siguen en la hoja: la fila puede quedar más corta que la cabecera y `appendRow` no rellena el resto. El panel lo tolera porque lee por `columna`.

---

## 5. Lectura hacia el panel

```js
// Código.js:809
function obtenerRespuestasFormulario(credenciales) {
  if (!verificarAdmin(credenciales).autenticado) return { autenticado: false };
  const hoja = getHojaRespuestas();
  const preguntas = leerPreguntas(false);                  // TODAS, incluidas inactivas
  const valores = hoja.getDataRange().getValues();
  const filas = [];
  for (let i = 1; i < valores.length; i++) {
    const f = valores[i];
    if (!f[0]) continue;                                   // fila vacía
    const objeto = { fecha: fechaTexto, origen: f[1] || "Real", respuestas: {} };
    preguntas.forEach(p => { if (p.columna) objeto.respuestas[p.id] = f[p.columna - 1]; });
    filas.push(objeto);
  }
  return { autenticado: true, hoja: getInfoLibro(), config: leerConfig(), preguntas, filas };
}
```

La fila deja de ser un arreglo posicional y pasa a ser **un objeto por `id`**. A partir de aquí nada
del panel vuelve a mirar índices de columna: esa traducción ocurre una sola vez, aquí.

---

## 6. Estado del panel

```js
// Index.html:1400
function cargarRespuestas() {
  google.script.run.withSuccessHandler(res => {
    if (!res || !res.autenticado) return;
    RESPUESTAS = res;
    sembrarColores(res.filas, res.preguntas);   // fija el color de cada categoría
    pintarMenusFiltro();                        // barra, selector, filtros
    pintarResumenPanel();                       // tarjeta, tabla de totales, gráfica
    pintarTablaRespuestas();                    // hoja de registros
    aplicarAltura();
  }).obtenerRespuestasFormulario(creds);
}
```

`RESPUESTAS` es el único depósito de datos del panel; todo lo demás se recalcula a partir de él.

---

## 7. Filtrado

```js
// Index.html:1830
function filasFiltradas() {
  const activas = dimensionesBarra().filter(d => FILTROS[d.id] && FILTROS[d.id] !== "TODOS");
  return ((RESPUESTAS && RESPUESTAS.filas) || []).filter(f => {
    for (const d of activas) {                              // Turno · Grado · Grupo
      if (String(valorDe(f, d.id) || "") !== FILTROS[d.id]) return false;
    }
    for (const fld of FILTROS_DINAMICOS) {                  // filtros por pregunta
      const s = document.getElementById("filtro_" + fld.id);
      if (s && s.value !== "TODOS" && String((f.respuestas || {})[fld.id] || "") !== s.value) return false;
    }
    return true;
  });
}
```

Es **el embudo único**: gráfica, tabla de totales, tabla de registros y CSV usan este resultado.
Si dos vistas no coinciden, casi siempre es porque una no pasó por aquí.

```js
// Index.html:1059 — cómo se lee una dimensión de una fila
function valorDe(fila, id) {
  const r = fila.respuestas || {};
  if (id === "origen") return fila.origen || "Real";       // virtual
  if (id === "turno") return r.turno || "";
  if (id === "grado") return String(r.grupo || "").charAt(0);  // derivada de grupo
  if (id === "grupo") return r.grupo || "";
  return r[id];
}
```

---

## 8. Agregación y gráficas

```js
// Index.html:1845 — dentro de pintarResumenPanel()
const filas = filasFiltradas();
const totalN = filas.length;

const esMultiple = !!(dim.tipo === "multiple");
filas.forEach(f => {
  const bruto = valorDe(f, dim.id);
  if (bruto == null || bruto === "") return;
  const valores = esMultiple ? String(bruto).split(";").map(s => s.trim()).filter(Boolean) : [String(bruto)];
  valores.forEach(v => {
    conteo[v] = (conteo[v] || 0) + 1;
    if (!matriz[v]) matriz[v] = {};
    const seg = String(valorDe(f, segId) || "Sin dato");
    matriz[v][seg] = (matriz[v][seg] || 0) + 1;
  });
});
const sumaConteos = Object.keys(conteo).reduce((a, k) => a + conteo[k], 0);
const basePct = (esMultiple && sumaConteos > 0) ? sumaConteos : totalN;   // % sobre ocurrencias
```

- **Una sola pasada** produce el conteo por categoría (`conteo`) y la matriz categoría × segmento.
- En **múltiple** un registro cuenta varias veces: el 100 % es la suma de ocurrencias, no `totalN`.
- `orden` (`desc`, `asc`, `none`) se aplica a `pares`; la tabla de totales y la gráfica salen del mismo arreglo.
- Las **apiladas** se construyen aparte con `construirApilada` (1070), que repite el conteo por segmento.
- El **modal** no vuelve a leer la hoja: recibe `{ tipo, dimId }` de `ampliarGrafica` y recalcula con `filasFiltradas()`.

---

## 9. Tabla de registros

```js
// Index.html:2031
const preguntas = preguntasVisibles();          // columnas = preguntas activas
let filas = filasFiltradas().filter(f => {      // búsqueda libre sobre fecha, origen y respuestas
  const texto = [f.fecha, f.origen].concat(preguntas.map(p => (f.respuestas || {})[p.id])).join(" ").toLowerCase();
  return texto.includes(busqueda);
});

if (campo === "fecha") filas.sort((a, b) => valorFecha(a.fecha) - valorFecha(b.fecha));  // numérico
else { /* número si ambos lo son; si no, localeCompare("es") */ }
```

Ordenar por fecha usa `valorFecha` (`dd/MM/yyyy HH:mm` → número) porque el texto ordena mal: `01/11`
quedaría antes que `05/02`.

---

## 10. Exportaciones

```js
// Index.html:2113
function celdaCSV(valor) {
  let s = String(valor == null ? "" : valor);
  if (/^[=+\-@]/.test(s)) s = "'" + s;              // neutraliza fórmulas al abrir en Excel
  if (/[";\r\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
  return s;
}

// Index.html:2120
const lineas = [cabecera.map(celdaCSV).join(";")];
filas.forEach(f => lineas.push([f.fecha, f.origen || "Real"].concat(preguntas.map(p => (f.respuestas || {})[p.id] || "")).map(celdaCSV).join(";")));
const blob = new Blob(["\uFEFF" + lineas.join("\r\n")], { type: "text/csv;charset=utf-8;" });
```

- Exporta **lo filtrado**, no la hoja entera.
- Separador `;` (Excel en español), BOM `\uFEFF` para que respete los acentos, CRLF entre líneas.
- El PDF es `window.print()` con una cabecera generada al vuelo (`imprimirRespuestas`, 2137).

---

## 11. Simulación y limpieza

```js
// Código.js:711 — escribe directo en la hoja, sin pasar por guardarRespuestaFormulario
fila[1] = "Simulado";
preguntas.forEach(p => { fila[p.columna - 1] = valores[p.id] != null ? valores[p.id] : ""; });
hoja.getRange(hoja.getLastRow() + 1, 1, filas.length, maximo).setValues(filas);

// Código.js:779 — borra solo lo simulado
```

La simulación respeta dos coherencias: el grupo se elige dentro del turno (`mapaGrupos`) y, si la
movilidad es «Caminando», los tiempos de descenso y puerta toman la opción «No aplica».

La limpieza filtra por `Origen = Simulado`; los registros reales no se tocan.

---

## 12. Invariantes

1. El servidor es la única fuente de verdad de la validación.
2. La fila se escribe **una vez** por `columna` y se lee **siempre** por `id`.
3. `Origen` distingue dato real de simulado; nunca se borra por otra cosa.
4. Todo lo que se muestra pasa por `filasFiltradas()`.
5. El porcentaje en múltiple se calcula sobre ocurrencias, no sobre personas.
6. CSV y PDF exportan el subconjunto filtrado.

---

## 13. Errores típicos

| Síntoma | Causa probable |
|---|---|
| Llegan respuestas a columnas cambiadas | alguien editó `columna` en la hoja `Formulario` |
| Una respuesta válida se rechaza | `validarRespuestas` contra `p.opciones` (no contra `opcionesPorPadre`) |
| La tabla y la gráfica no coinciden en cifras | una vista no usa `filasFiltradas()` o difieren en `segId` |
| El CSV abre con fórmulas | falta `celdaCSV` en alguna celda nueva |
| «No hay datos para exportar» con filas visibles | los filtros activos dejan la muestra vacía |

---

**Documentos hermanos:** `FLUJO-ESQUEMA.md` (esquema) · `RADIOGRAFIA.md` (arquitectura) · `AVANCES.md` (bitácora).