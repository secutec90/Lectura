# SKILL — Sistema de estilos de interfaz

> **Qué es:** la referencia obligatoria de estilos para el Constructor de Encuestas.
> **Cuándo consultarlo:** antes de añadir o modificar cualquier control, menú, tabla o tarjeta.
> **Dónde se aplica:** `Index.html` (bloque `<style>` al inicio). No hay archivo CSS aparte.
> **Última actualización:** 2026-10-22

---

## 1. Principios

1. **El estado activo tiñe, nunca rellena.** Un control seleccionado se marca con fondo suave
   (`#eff6ff`), texto azul y, si aplica, un check. Nunca con azul sólido y texto blanco.
2. **Azul sólido solo para la acción principal.** `btn-primary` está reservado a «Guardar»,
   «Ingresar» y la vista activa. Todo lo demás es contorno o tinte.
3. **Un control = una función.** No se apilan botones idénticos; si hay muchas opciones del
   mismo tipo, van dentro de un menú.
4. **Densidad de herramienta, no de formulario.** En menús y barras: texto .82–.85 rem,
   alto de control 32 px. Un formulario completo va en una tarjeta, no en un desplegable.
5. **Consistencia antes que novedad.** Si un color, radio o sombra no está en los tokens,
   no se usa.

---

## 2. Tokens

Definidos como variables CSS en `:root`; se usan siempre por nombre, nunca en hexadecimal suelto.

| Token | Valor | Uso |
|---|---|---|
| `--app-primary` | `#2563eb` | Acento, foco, pestaña activa |
| `--app-primary-dark` | `#1d4ed8` | Texto de un control activo |
| `--app-primary-soft` | `#eff6ff` | Fondo de estado activo |
| `--app-primary-tint` | `#dbeafe` | Hover sobre un control ya activo |
| `--app-border` | `#e2e8f0` | Bordes de controles y menús |
| `--app-border-strong` | `#cbd5e1` | Hover de borde |
| `--app-text` | `#334155` | Texto de menús y controles |
| `--app-muted` | `#64748b` | Etiquetas y metadatos |
| `--app-hover` | `#f1f5f9` | Fondo de hover neutro |
| `--app-radius` | `8px` | Controles |
| `--app-radius-lg` | `12px` | Tarjetas y menús |

Sombra de tarjeta: `0 4px 15px rgba(0,0,0,.05)`. Sombra de menú: `0 10px 25px rgba(15,23,42,.08)`.
Tipografía: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`.
Paleta de gráficas: `#2563eb #10b981 #f59e0b #ef4444 #8b5cf6 #06b6d4 #ec4899 #64748b`.

---

## 3. Controles de barra

```html
<button class="btn btn-sm btn-outline-secondary" type="button" title="…" aria-label="…">
  <i class="bi bi-sliders"></i>
</button>
```

| Estado | Apariencia | Clase |
|---|---|---|
| Reposo | Fondo blanco, borde `--app-border`, icono `#475569` | `btn-outline-secondary` |
| Hover | Fondo `--app-hover`, **sin relleno de color** | (automático) |
| Activo | Fondo `--app-primary-soft`, borde `#bfdbfe`, icono azul | `btn-outline-primary` |
| Acción principal | Azul sólido | `btn-primary` |
| Destructivo | Texto rojo, hover `#fef2f2` | `btn-outline-danger` |

- Iconos de **línea** (`bi-*`). El icono relleno se reserva para la pestaña activa.
- Todo botón de icono lleva `title` **y** `aria-label` con el mismo texto; si el JS cambia el
  `title`, cambia también el `aria-label` (`setAttribute("aria-label", ...)`).
- El nombre del control vive en el tooltip, no en el texto visible. Si el control amplía su
  alcance, se renombra **el tooltip**, no se añade una etiqueta.
- El texto visible se permite solo si el botón es ancho (p. ej. «Filtros»); si no, icono solo.

---

## 4. Menús desplegables

### 4.1 Estructura

```html
<button class="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown" aria-expanded="false">
  <i class="bi bi-sliders"></i>
</button>
<ul class="dropdown-menu" style="min-width: 16rem; max-height: 72vh; overflow-y: auto;">
  <li><h6 class="dropdown-header">Sección</h6></li>
  <li><button type="button" class="dropdown-item active">Opción <i class="bi bi-check2 ms-2"></i></button></li>
</ul>
```

### 4.2 Reglas

| Elemento | Regla |
|---|---|
| Contenedor | `min-width` 16–18 rem, `max-height: 72vh` con scroll, padding `.4rem` |
| Cabecera | `.dropdown-header`: .7 rem, mayúsculas, `letter-spacing .05em`, `#94a3b8`; si el menú comparte datos con otro, añade una ayuda `.filtro-ayuda` que diga qué hace |
| Ítem | .85 rem, `--app-text`, padding `.4rem .6rem`, radio 8 px |
| Hover | Fondo `--app-hover`, sin cambio de color de texto |
| **Activo** | Fondo `--app-primary-soft` + texto `--app-primary-dark` + `fw-semibold` + check |
| Separador | `.dropdown-divider` con `--app-border` |
| Cierre | Los menús con varios controles usan `data-bs-auto-close="outside"` |

### 4.3 Filtros dentro de un menú

Un filtro **no** es un formulario: va en una fila compacta con etiqueta pequeña encima.

```html
<li class="filtro-fila">
  <label for="filtro_x">Nombre del filtro</label>
  <select class="form-select form-select-sm" id="filtro_x">
    <option value="TODOS">Todos (sin filtro)</option>
  </select>
</li>
```

- Etiqueta: .75 rem, `--app-muted`, `fw-semibold`.
- Select: .82 rem, alto 32 px, borde `--app-border`, foco con anillo `rgba(37,99,235,.15)`.
- Los **filtros base** (Turno, Grado, Grupo, Origen) van como **iconos individuales**, cada uno
  con su icono (personas, 123, rejilla, base de datos) y un menú corto de 2–25 opciones.
- Las **preguntas** van en un único desplegable con contador; nunca un icono por pregunta.
- Un menú que tape la gráfica es un menú mal ubicado: si necesita más de ~12 filas, se replantea.
- Si el menú es largo, **dos paneles con cabecera propia** (p. ej. «Segmentación» y «Preguntas»),
  cada uno con su scroll; no usar `column-count`, que corta las secciones.
- **Eje X** y **División** viven en el menú de filtros, sección «Gráfica», con etiqueta y ayuda.
  Solo ofrecen las **cuatro dimensiones** (Turno, Grado, Grupo, Origen): las preguntas no se
  listan ahí. Para graficar una pregunta se usa el **botón de barras** de su fila en «Preguntas»;
  esa pregunta se añade al inicio del eje mientras esté activa.
- Agrupar con cabeceras («Segmentación», «Preguntas»).
- Las etiquetas largas dentro de un menú se limitan a **dos líneas** (`.pregunta-etiqueta`) y el
  texto completo va en el `title`; nunca dejan crecer la fila sin control.
- Un valor que **no es una de las opciones** (p. ej. el eje es una pregunta suelta) se muestra
  como **línea de estado** debajo de los chips, con su botón para volver a una dimensión; nunca
  como un chip más, porque parece una opción.
- Con **4–6 opciones fijas** usar **chips visibles** (botones), no un `select`: el menú nativo
  tapa el panel y vuelve a listar lo que ya se ve. El chip activo usa el tinte (`btn-outline-primary`).

---

## 5. Formularios

- En tarjeta: `form-control` / `form-select` normales, `label.form-label`.
- En menú: siempre `form-select-sm` dentro de `.filtro-fila`.
- Foco: borde `--app-primary` + anillo de 3 px al 15 %.
- Error: texto rojo junto al campo; no `alert()` si el error es de un campo.

---

## 6. Tarjetas, tablas y badges

- Tarjeta: `border-radius: 12px`, sin borde, sombra suave, `padding: 1rem`.
- Tabla: `table-sm`, encabezado `table-light`, cifras `text-end`, cabecera ordenable con
  `th.sortable` y hover `#dbeafe`.
- Badge de conteo: `badge bg-primary`, solo para totales; para estados usar el tinte
  (`--app-primary-soft` + texto azul).
- Cifras y porcentajes siempre a la derecha y con un decimal en porcentajes.

---

## 7. Gráficas

- **Toda gráfica muestra sus valores.** Se dibujan con `pluginValores` (registrado por gráfica):
  al final de la barra, dentro de la rebanada o sobre el punto. Sin excepciones.
- En modo porcentaje el valor lleva `%` y el eje también; se escribe con un decimal.
- Paleta fija de 8 colores, estable por categoría (`colorDimension`). No se inventan colores.
- Leyenda abajo para barras, a la derecha para pastel/dona.
- **Apiladas:** una serie por cada valor de «Segmentar por». Nunca se segmenta con la misma
  dimensión del eje X (el código cae a `origen` o `turno`); «Segmentar por» no ofrece la
  dimensión activa. El 100 % se calcula por categoría o sobre el total, según «Base Porcentual».
- En apiladas el valor va **dentro** del segmento, en blanco; se omite si el segmento mide
  menos de 18 px (horizontal) o 14 px (vertical).
- Títulos en `h6` con icono, badge de totales a la derecha.
- Fondo de la tarjeta blanco; sin rejilla vertical en barras horizontales.
- Margen derecho de 40–46 px en barras horizontales para que la etiqueta no se corte.

---

## 8. Anti-patrones

| No hacer | Hacer |
|---|---|
| `bg-primary` o azul sólido para marcar el ítem activo | `--app-primary-soft` + texto azul + check |
| Dejar que Bootstrap rellene el botón al hacer hover | Tokens `--bs-btn-hover-*` con tinte suave |
| Un botón con el mismo icono por cada opción | Un menú con una fila por opción |
| `form-control` (alto) dentro de un desplegable | `.filtro-fila` + `form-select-sm` |
| `dropdown-header` con fondo o tamaño de título | .7 rem, mayúsculas, gris claro |
| Colores o radios fuera de los tokens | Usar la variable correspondiente |
| Sombras fuertes o bordes negros | Sombra suave y `--app-border` |
| Mezclar iconos rellenos y de línea | Línea siempre; relleno solo en pestaña activa |
| Gráfica sin los valores a la vista | `pluginValores` en todas las gráficas |
| Apilar una dimensión consigo misma | Segmentar por una dimensión distinta del eje X |
| Botón de barra con texto | Icono + `title`; el texto va en el tooltip |
| Desplegable para 4 opciones dentro de un menú | Chips visibles con el activo tintado |
| Dos menús con la misma lista sin explicar su papel | Cabecera con verbo («Eje X · cómo se agrupan») y ayuda corta |

---

## 9. Checklist antes de dar por buena una pantalla

- [ ] Ningún estado activo usa relleno azul sólido.
- [ ] El hover de un botón no cambia su fondo a un color saturado.
- [ ] Todos los menús tienen el mismo ancho, radio, sombra y padding.
- [ ] Las etiquetas de control son .75–.85 rem y de color `--app-muted`.
- [ ] Ningún menú supera 72 vh sin scroll.
- [ ] Todos los botones de icono tienen `title` y `aria-label`, y siguen sincronizados si el JS los cambia.
- [ ] Los colores usados existen en los tokens o en la paleta de gráficas.
- [ ] Toda gráfica muestra sus valores; las apiladas no se segmentan con su propia dimensión.
- [ ] Las barras de herramientas son solo icono + tooltip.
- [ ] En móvil (< 576 px) la barra se envuelve sin cortar controles.

---

## 10. Cómo añadir un menú nuevo

1. Copia la estructura de §4.1.
2. Rellénalo con `.dropdown-header` + `.dropdown-item`; marca el actual con `active`
   (el CSS ya le da el tinte correcto).
3. Si es un menú con varios controles, añade `data-bs-auto-close="outside"` al botón.
4. No escribas CSS nuevo: si falta un estilo, **añade un token o una clase aquí y en
   `Index.html`**, nunca un `style="..."` suelto.
5. Repasa el checklist de §9.

---

## 11. Glosario de clases

| Clase | Para qué |
|---|---|
| `.filtro-fila` | Fila etiqueta + selector dentro de un menú de filtros |
| `.dropdown-header` | Cabecera de sección de un menú (ya estilizada) |
| `.dropdown-item.active` | Opción seleccionada (tinte, no relleno) |
| `.tipo-badge` | Etiqueta pequeña del tipo de pregunta |
| `.pregunta` | Tarjeta de pregunta en el editor |
| `.seccion-condicional` | Bloque gris con barra azul a la izquierda |
| `.sortable` | Encabezado de tabla ordenable |

---

**Regla de oro:** si un control nuevo necesita un color, un tamaño o una sombra que no está
en la tabla de tokens, primero se añade el token aquí y después se usa. Nada de valores sueltos.