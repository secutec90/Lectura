---
name: aula-constructor
description: Especificación técnica y contrato arquitectónico del Constructor Visual de Clases (Mosaicos, DUA, Tarjetas Limpias y Responsividad al 100%) para su migración y ejecución en Laravel 12 + Blade + Tailwind.
---

# SKILL: Constructor Visual de Clases y Aula Hablada DUA (Laravel 12 Edition)

Este documento define la norma técnica inmutable para construir, estilizar o modificar el **Constructor Visual de Clases y el Reproductor de Aula DUA** en el ecosistema **Laravel 12 / Academia**. Todos los agentes (DeepSeek, Cursor y Antigravity) deben apegarse estrictamente a estas especificaciones.

---

## 1. Jerarquía Estructural de 4 Capas (Arquitectura DIVI)

El lienzo de clase se compone de 4 capas anidadas estrictas:

```
[SECCIÓN: .divi-section] (Borde azul #0284c7 en hover, controla márgenes y fullwidth)
  └── [FILA: .divi-row] (Borde verde #10b981 en hover, define la retícula de columnas)
        └── [COLUMNA: .divi-column] (Dropzone interactiva con foco activo .active-target)
              └── [MÓDULO: .idevice-card / .divi-module] (Tarjeta de contenido pedagógico)
```

### Contratos de la Jerarquía:
1. **Ningún módulo puede vivir suelto:** Todo módulo (`.idevice-card`) debe residir obligatoriamente dentro de una `.divi-column`.
2. **Selector de Columnas (`.divi-plus-row`):** Se inserta entre filas mediante un botón circular verde `(+)`. Despliega el catálogo de retículas.
3. **Botón interior de columna (`.btn-add-module-inside`):** Ubicado al fondo de cada columna para insertar un módulo en esa posición específica.

---

## 2. Retículas de Columnas y Mosaicos Dinámicos

Las clases de fila (`.divi-row`) aplican las siguientes reglas de CSS Grid:

| Clase de Fila | Columnas | Distribución de Anchos | Uso Pedagógico |
| :--- | :--- | :--- | :--- |
| `col-1` | 1 | `1fr` (100%) | Lectura principal, video amplio o texto introductorio. |
| `col-2` | 2 | `1fr 1fr` (50% / 50%) | Comparativas, bilingüe, texto + imagen. |
| `col-2-70-30` | 2 | `7fr 3fr` (70% / 30%) | Contenido central + barra lateral de notas/glosario. |
| `col-3` | 3 | `repeat(3, 1fr)` | Tríadas conceptuales, 3 pasos o galerías triples. |
| `col-4` | 4 | `repeat(4, 1fr)` | Cuadrícula de 4 imágenes/fichas breves. |
| `mosaico-3-izq` | 3 | `grid-template-columns: 2fr 1fr 1fr` | Mosaico con elemento protagónico a la izquierda. |
| `mosaico-3-der` | 3 | `grid-template-columns: 1fr 1fr 2fr` | Mosaico con elemento protagónico a la derecha. |
| `mosaico-3` | 6 subcolumnas | `2 sup + 1 inf izq / 1 alto centro / 2 der` | Mosaico asimétrico de alto impacto visual. |

---

## 3. Reglas de Tarjetas Limpias (Cero Cabeceras Obligatorias)

1. **Comportamiento por Defecto en Imágenes (`galeria` / `Imagen`):**
   - Una imagen recién insertada **NO debe mostrar cabecera** con textos genéricos (`"Galería de Imágenes"`, `"INFORMACIÓN"`, `"Galería DUA"`).
   - Debe renderizarse limpia al 100% de su contenedor (`.content-card.tarjeta-sin-cabecera`).
   - Solo si el docente escribe explícitamente un título o etiqueta en las propiedades, se dibujará la cabecera correspondiente.
2. **Acción Global de Ocultación:**
   - La clase o atributo `data-ocultar-cabecera="1"` oculta el encabezado de la tarjeta en la vista del alumno.
   - En el editor docente, la cabecera oculta se atenúa visualmente (`opacity: 0.65; border-dashed`) para no estorbar, pero permitiendo hacer clic para editarla.
3. **Descripción Oral Accesible DUA (`txt-alt-dua`):**
   - Si se escribe una descripción para invidentes, se renderiza debajo de la imagen con el ícono `🔊 Descripción accesible DUA: ...`. Si se deja vacía, no ocupa espacio.

---

## 4. Controles de Ancho y Alineación Global

1. **Slider de Página:** Rango de `40%` a `100%` del ancho total de la pantalla.
2. **Slider de Sección:** Rango de `40%` a `100%` relativo al marco de la página.
3. **Alineación:** `flex-start` (Izquierda ⬅️), `center` (Centrado ↔️), `flex-end` (Derecha ➡️).
4. **En Vista Alumno:** El marco exterior (`.browser-frame`) puede expandirse hasta el `100vw` en pantallas panorámicas.

---

## 5. Esquema JSON de Persistencia (`lienzo_json`)

Cada sesión se serializa como un objeto estructurado:

```json
{
  "version": "1.0",
  "config": {
    "anchoPagina": 100,
    "anchoSeccion": 100,
    "alineacion": "center",
    "ocultarCabecerasGlobal": false,
    "fuenteGlobal": "Inter, sans-serif"
  },
  "filas": [
    {
      "id": "row_1700000000_1",
      "layout": "mosaico-3",
      "columnas": [
        [
          {
            "id": "mod_1700000000_2",
            "tipo": "galeria",
            "titulo": "",
            "tituloPersonalizado": false,
            "etiqueta": "",
            "ocultarCabecera": true,
            "extra": {
              "imgUrl": "https://...",
              "ancho": "100%",
              "align": "center",
              "recorte": "16-9",
              "altDua": "Mariposa monarca posada sobre una flor."
            }
          }
        ]
      ]
    }
  ]
}
```

---

## 6. Prohibiciones Estrictas para Agentes
- **PROHIBIDO** forzar textos como `"Galería de Imágenes"` o `"INFORMACIÓN"` de forma estática en las vistas.
- **PROHIBIDO** romper los selectores clave: `#lienzoExeActivo`, `.divi-row`, `.divi-column`, `.idevice-card`.
- **PROHIBIDO** aplicar anchos fijos en píxeles que limiten la vista a menos del 100% de la pantalla del alumno.
