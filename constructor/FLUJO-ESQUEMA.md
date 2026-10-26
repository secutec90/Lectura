# Flujo de datos — Esquema de Preguntas

> **Qué es:** el recorrido completo del esquema de preguntas, desde la hoja `Formulario`
> hasta cada pantalla que lo consume y de vuelta al guardar.
> **Cuándo consultarlo:** antes de tocar `leerPreguntas`, `preguntasVisibles`, `guardarFormulario`
> o cualquier vista que dependa del esquema.
> **Última actualización:** 2026-10-23 · v48 (`E62122A8`). Los números de línea se fijaron en la v47:
> en la v48 el editor creció, así que los tramos de `abrirModal`, `guardarPregunta` y
> `pintarSelectorPregunta` pueden estar desplazados. Los nombres de función son la referencia estable.

---

## 0. En una línea

La hoja `Formulario` es la fuente de verdad; `leerPreguntas()` la convierte en objetos, el cliente
los recibe en `FORM.preguntas` / `RESPUESTAS.preguntas`, `preguntasVisibles()` decide qué se ve y
`guardarFormulario()` reescribe la hoja entera.

---

## 1. Mapa

```text
Hoja "Formulario"  (11 columnas · una fila por pregunta)
        │
        │  leerPreguntas()                      Código.js:293
        ▼
  pregunta { id, tipo, etiqueta, ayuda, placeholder, obligatoria,
             opciones[], orden, activa, columna, extra{} }
        │
        ├── obtenerFormulario()                 Código.js:386   → público (solo activas)
        └── obtenerRespuestasFormulario(creds)  Código.js:809   → admin (todas) + filas
        │
        ▼  google.script.run  (serializa a JSON)
  FORM  /  RESPUESTAS.preguntas                 Index.html:1122
        │
        │  preguntasVisibles()                  Index.html:2144  ← único filtro
        ▼
  ┌──────────────────────┬───────────────────────┬──────────────────────┐
  │ Encuesta pública     │ Panel                 │ Editor               │
  │ renderFormulario     │ dimensionesDisponibles│ pintarPreguntas      │
  │ crearCampo           │ pintarDimensiones     │ mover / editar       │
  │ aplicarDependencias  │ pintarSelectorPregunta│ eliminar (lógico)    │
  │ aplicarCondiciones   │ pintarFiltrosDinamicos│ guardarTodo          │
  │                      │ pintarTablaRespuestas │                      │
  └──────────────────────┴───────────────────────┴──────────────────────┘
                                                      │
                                                      ▼
                                          guardarFormulario()   Código.js:412
                                          validar · columnas · reescritura
```

---

## 2. Contrato de la hoja `Formulario`

`leerPreguntas` es el único lugar donde importa la posición de las columnas:

```js
// Código.js:293
function leerPreguntas(soloActivas, hoja) {
  const fuente = hoja || getHojaFormulario();
  const valores = fuente.getDataRange().getValues();
  const preguntas = [];
  for (let i = 1; i < valores.length; i++) {
    const f = valores[i];
    if (!f[0]) continue;
    let opciones = [];
    try { opciones = JSON.parse(f[6] || "[]") || []; } catch (e) { opciones = []; }
    let extra = {};
    try { extra = JSON.parse(f[10] || "{}") || {}; } catch (e) { extra = {}; }
    const pregunta = {
      id: String(f[0]),
      tipo: String(f[1] || "texto"),
      etiqueta: String(f[2] || ""),
      ayuda: String(f[3] || ""),
      placeholder: String(f[4] || ""),
      obligatoria: f[5] === true || String(f[5]).toUpperCase() === "TRUE",
      opciones: opciones,
      orden: Number(f[7] || i),
      activa: f[8] === true || String(f[8]).toUpperCase() === "TRUE",
      columna: Number(f[9] || 0),
      extra: extra
    };
    if (!soloActivas || pregunta.activa) preguntas.push(pregunta);
  }
  preguntas.sort((a, b) => a.orden - b.orden);
  return preguntas;
}
```

| # | Columna | Campo | Notas |
|---|---|---|---|
| 1 | `id` | clave estable | se usa en `Respuestas`, filtros y condiciones |
| 2 | `tipo` | `texto`, `parrafo`, `unica`, `multiple`, `sino`, `escala`, `fecha`, `numero` | |
| 3–5 | `etiqueta`, `ayuda`, `placeholder` | textos | |
| 6 | `obligatoria` | booleano | acepta `TRUE` en texto |
| 7 | `opciones` | **JSON en una celda** | `["A","B"]` |
| 8 | `orden` | presentación | se ordena al leer |
| 9 | `activa` | borrado lógico | nunca se borra la fila |
| 10 | `columna` | posición en la hoja `Respuestas` | 1-based; 1 y 2 son fecha y origen |
| 11 | `extra` | **JSON** | `esDimension`, `padre`, `opcionesPorPadre`, `condicion`, `categoria`, `maxLongitud`, `escalaMin/Max` |

---

## 3. Normalización (solo al escribir)

Al leer se confía en la hoja; al guardar se recompone el objeto y se descarta lo que no se entiende:

```js
// Código.js:323
function normalizarPregunta(p, indice) {
  const tipo = TIPOS_PREGUNTA.indexOf(p.tipo) !== -1 ? p.tipo : "texto";
  return {
    id: String(p.id || idDesdeTexto(p.etiqueta)),
    tipo: tipo,
    etiqueta: String(p.etiqueta || "").trim(),
    obligatoria: !!p.obligatoria,
    opciones: (p.opciones || []).map(o => String(o).trim()).filter(o => o !== ""),
    orden: indice + 1,              // el orden real es la posición en el arreglo
    activa: true,
    columna: Number(p.columna || 0),
    extra: normalizarExtra(p.extra)
  };
}

// Código.js:341 — solo sobreviven las claves conocidas
e.esDimension = e.esDimension === true;
if (e.padre) e.padre = String(e.padre).trim(); else delete e.padre;
// opcionesPorPadre: limpia valores vacíos y elimina el mapa si queda sin claves
```

---

## 4. Salida hacia el cliente

```js
// Código.js:386 — público, sin credenciales
function obtenerFormulario() {
  migrarDemoAMovilidad();                    // migración perezosa en cada lectura
  return { config: leerConfig(), preguntas: leerPreguntas(true) };
}

// Código.js:809 — admin: TODAS (incluidas inactivas) + filas ya mapeadas por id
function obtenerRespuestasFormulario(credenciales) {
  if (!verificarAdmin(credenciales).autenticado) return { autenticado: false };
  const preguntas = leerPreguntas(false);
  // ...
  preguntas.forEach(p => { if (p.columna) objeto.respuestas[p.id] = f[p.columna - 1]; });
  return { autenticado: true, hoja: getInfoLibro(), config: leerConfig(), preguntas, filas };
}
```

Recepción en el cliente:

```js
// Index.html:1122
google.script.run.withSuccessHandler(f => {
  FORM = f || { config: {}, preguntas: [] };
  renderFormulario();
}).obtenerFormulario();
```

---

## 5. El único filtro

```js
// Index.html:2144
function preguntasVisibles() {
  return ((RESPUESTAS && RESPUESTAS.preguntas) || FORM.preguntas || []).filter(p => p.activa !== false);
}
```

Prioridad: el panel usa `RESPUESTAS.preguntas` (trae **todas**) y filtra aquí; el formulario público
recibe del servidor **solo las activas**. Si algo «no aparece», casi siempre es este filtro.

---

## 6. Consumidores

| Vista | Función | Qué hace con el esquema |
|---|---|---|
| Encuesta pública | `renderFormulario` (1136) → `crearCampo` (1151) | dibuja un campo por pregunta, en el orden recibido |
| Encuesta pública | `aplicarDependenciasFormulario` (1252) | cascada `extra.padre` + `opcionesDependientes` |
| Encuesta pública | `aplicarCondiciones` (1280) | oculta según `extra.condicion` |
| Panel | `dimensionesDisponibles` (1503) | deriva dimensiones de `esDimension` y de los ids legado |
| Panel | `pintarDimensiones` (1564) | barra fija Turno · Grado · Grupo, con cascada |
| Panel | `pintarSelectorPregunta` (1645) | todas las preguntas, por `orden`, para graficar |
| Panel | `pintarFiltrosDinamicos` (1692) | preguntas de opción que no son dimensión |
| Panel | `pintarTablaRespuestas` (2031) | una columna por pregunta visible |
| Editor | `pintarPreguntas` (2448) | lista, ordena, edita y borra en memoria (`FORM`) |

---

## 7. Escritura

```js
// Index.html:2691 — el editor manda el arreglo completo
const preguntas = FORM.preguntas.map((p, i) => ({
  id: p.id || "", tipo: p.tipo, etiqueta: p.etiqueta, ayuda: p.ayuda || "",
  placeholder: p.placeholder || "", obligatoria: !!p.obligatoria,
  opciones: p.opciones || [], extra: p.extra || {}, orden: i + 1
}));
google.script.run.withSuccessHandler(res => { FORM = res.formulario; ... })
                 .guardarFormulario(creds, config, preguntas);
```

```js
// Código.js:412 — validar, asignar columna y reescribir
normal.columna = (previa && previa.columna) ? previa.columna : (++maxColumna);  // 431
validarPregunta(normal);                                                        // Código.js:358
// valida también que cada extra.condicion apunte a una pregunta existente y no a sí misma
existentes.forEach(p => { if (ids.indexOf(p.id) === -1) { p.activa = false; salida.push(p); } });  // 504
hoja.getRange(2, 1, ..., COLUMNAS_FORMULARIO).clearContent();
hoja.getRange(2, 1, filas.length, COLUMNAS_FORMULARIO).setValues(filas);
actualizarCabecerasRespuestas();                                               // Código.js:531
return { exito: true, formulario: obtenerFormulario() };                        // 522
```

- **`columna` es pegajosa**: si la pregunta ya existía conserva su columna, así que renombrarla no
  descoloca los datos.
- **Borrar es lógico**: lo que sale del arreglo se reescribe con `activa = false` y conserva su columna.
- **Efecto colateral conocido (P1):** ese mismo bloque reescribe `Configuracion` solo con las claves de
  `CONFIG_POR_DEFECTO`, donde no está `hojaId`: tras guardar se pierde el paso 2 de la cascada de
  resolución del libro.

---

## 8. Respuestas: el esquema es también su contrato

```js
// Código.js:602 — al guardar, cada campo va a la columna indicada por el esquema
preguntas.forEach(p => {
  fila[p.columna - 1] = condicionVisible(p, respuestas) ? valorRespuesta(p, respuestas[p.id]) : "";
});
hoja.appendRow(fila);

// Código.js:531 — la fila 1 de Respuestas se reescribe con las etiquetas
preguntas.forEach(p => { if (p.columna) fila[p.columna - 1] = p.etiqueta; });
```

El panel vuelve a leer **por `id`**, no por posición: de ahí que renombrar no rompa nada y que añadir
una pregunta al final no mueva lo anterior.

---

## 9. Invariantes

1. `id` es la clave de unión entre esquema, respuestas, filtros y condiciones. No se renombra a mano en la hoja.
2. `columna` se asigna una vez y no se reutiliza: es la que fija la posición física en `Respuestas`.
3. `orden` es la posición en el arreglo, no un campo libre: reordenar = mover en la lista.
4. `activa` es el borrado; nunca se elimina una fila de `Formulario`.
5. `extra` solo admite las claves que `normalizarExtra` conserva; lo demás se descarta al guardar.
6. Todo lo que se pinta pasa por `preguntasVisibles()`.

---

## 10. Dónde tocar cada cosa

| Quiero… | Archivo · función |
|---|---|
| añadir un tipo de pregunta | `Código.js`: `TIPOS_PREGUNTA` · `Index.html`: `crearCampo` |
| cambiar el orden de la encuesta | editor (`mover`) → `orden` → `guardarFormulario` |
| añadir una dimensión de filtro | `Index.html`: `dimensionesBarra()` / `esDimensionPregunta` |
| cambiar la pregunta que se grafica al abrir | `Index.html`: `pintarSelectorPregunta` (línea del valor por defecto) |
| tocar la validación | `Código.js`: `validarPregunta` · `validarRespuestas` |
| cambiar qué columnas se escriben | `Código.js`: `COLUMNAS_FORMULARIO` · `actualizarCabecerasRespuestas` |

---

## 11. Errores típicos

| Síntoma | Causa probable |
|---|---|
| Una pregunta nueva no sale en el panel | `activa` en falso, o el panel no se recargó |
| La gráfica abre con nombres de alumnos | el eje por defecto es la primera pregunta por `orden`, y hoy es el nombre |
| Se descolocan las columnas de `Respuestas` | alguien editó `columna` a mano en la hoja |
| El editor no guarda | `validarPregunta` o una `extra.condicion` que apunta a una pregunta inexistente |
| Tras guardar deja de encontrar la hoja vinculada | `guardarFormulario` reescribió `Configuracion` sin `hojaId` (P1) |

---

**Documentos hermanos:** `FLUJO-RESPUESTAS.md` (respuestas y panel) · `RADIOGRAFIA.md` (arquitectura y contratos) · `AVANCES.md` (bitácora y pendientes) · `SKILL.md` (estilos).