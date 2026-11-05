# BUZÓN DE ENTREGA: CURSOR -> ANTIGRAVITY

> **INSTRUCCIÓN PARA CURSOR (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_CURSOR.md`) todo tu código JavaScript/DOM propuesto para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js cursor`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: OLA 17 (`build-602+`) — LÓGICA Y CONTROLADORES JS DEL CONSTRUCTOR FUSIÓN (DIVI + ELEMENTOR + NOTION + eXeLearning)
- **Estado:** 🟢 PROGRAMADA (PARTITURA ASIGNADA — EJECUTAR AHORA)
- **Archivos objetivo:** `AyudaJS.html`, `ClaseJS_08.html`, `AdminPlanJS_06.html`
- **Misión de Cursor:** Implementar los controladores de inserción en posición continua `(+)`, eliminación `(-)` con buffer de deshacer, tablas multicelda estilo Excel con colgroup y celdas autónomas, cuadros forma estilo Word, renderizado de GeoGebra con parámetros reales, y reconexión del pipeline IA al lienzo del autor.

---

### 📋 Especificaciones Lógicas y DOM para Cursor:

#### 1. Inserción Continua `(+)` y Eliminación `(-)` con Deshacer
- **Registro en `META_TARJETA_EXE_` (CERO REGRESIONES):**
  - Mantener intactas las 7 familias y más de 20 bloques existentes.
  - Registrar los 3 nuevos bloques estructurales:
    - `word_shape`: `{ badge: 'badge-info', etiqueta: 'FORMA WORD', titulo: 'Cuadro de Texto / Forma DUA', cuerpo: 'Escribe el texto o consigna destacada...' }`
    - `excel_split_table`: `{ badge: 'badge-tecnologia', etiqueta: 'TABLA EXCEL', titulo: 'Tabla Dividida Multicelda', cuerpo: '' }`
    - `geogebra_param`: `{ badge: 'badge-ciencias', etiqueta: 'GEOGEBRA', titulo: 'Simulador GeoGebra con Parámetros', cuerpo: '' }`
- **Función `insertarBloqueEnPosicion_(tipo, btnReferencia)`:**
  - Si se invoca desde un botón `(+)` de una fila `.block-inserter-row`:
    - Genera la tarjeta con `crearTarjetaCurricular_(tipo, null)` o función equivalente.
    - Crea una nueva fila `.block-inserter-row` correspondiente.
    - Utiliza `parentNode.insertBefore(nuevaTarjeta, filaRef.nextSibling)` y `parentNode.insertBefore(nuevaFilaPlus, nuevaTarjeta.nextSibling)` para garantizar que el nuevo contenido quede insertado exactamente en esa posición relativa.
    - Cierra cualquier menú emergente activo (`.inserter-popup-dropdown`).
    - Actualiza el contador dinámico y memoriza el estado en `window._extraExelearning_`.
- **Función `eliminarBloqueTarjeta_(idBloque)`:**
  - Guarda el elemento y su posición anterior en `window.ultimoBloqueEliminado_ = { id: idBloque, html: el.outerHTML, siguienteHermano: el.nextSibling, padre: el.parentNode }`.
  - Remueve la tarjeta y su separador `(+)` contiguo.
  - Muestra un toast/pastilla no intrusiva de 5 segundos con botón `[Deshacer]` que invoque `deshacerEliminarBloque_()`.

#### 2. Tabla Dividida Multicelda (Estilo Excel)
- **Generador del Bloque `excel_split_table` en `htmlEspecialExe_`:**
  - Selector de distribución de columnas: `50% / 50%`, `33% / 33% / 33%`, `70% / 30%`, `25% / 75%`.
  - Tabla con `<colgroup>` y celdas `<td class="excel-layout-cell" contenteditable="true">`.
  - Barra de herramientas contextual por celda:
    - Paleta de color de fondo: Blanco (`#ffffff`), Azul suave (`#f0f9ff`), Teal suave (`#f0fdfa`), Ámbar suave (`#fffbeb`), Gris suave (`#f8fafc`).
    - Botones de acción dentro de la celda: `[📷 Imagen]`, `[🎬 Video/Drive]`, `[Limpiar formato]`.
- **Sanitización de Pegado (`paste`):**
  - Agregar listener `paste` a `.excel-layout-cell` para interceptar datos del portapapeles y pegar texto plano o texto con etiquetas limpias, evitando ensuciar con estilos Microsoft Word en `pt` o fuentes fijas.
- **Serialización Jerárquica:**
  - Al serializar la tarjeta en `leerTarjetaExe_()`, guardar:
    ```javascript
    extra: {
      distribucion: '50-50',
      celdas: [
        { ancho: '50%', bg: '#f0fdfa', html: celda1.innerHTML },
        { ancho: '50%', bg: '#ffffff', html: celda2.innerHTML }
      ]
    }
    ```
  - En `rellenarTarjetaExe_()`, restaurar fielmente la estructura y los contenidos de cada celda.

#### 3. Cuadro Forma y Texto (Estilo Word)
- **Generador del Bloque `word_shape`:**
  - Selector de estilo de forma: `Azul Primario (Word)`, `Teal Institucional (NEM)`, `Ámbar Alerta (DUA)`, `Púrpura Reflexión`.
  - Contenedor editable `<div class="word-shape-box shape-teal" contenteditable="true">` con etiqueta inferior `.shape-badge-meta`.
  - Serialización en `extra`: `{ estiloForma: 'shape-teal', texto: div.innerHTML }`.

#### 4. GeoGebra con Parámetros Reales (`geogebra_param`)
- **Generador y Controlador de GeoGebra:**
  - Entradas en cabecera:
    - Input `material_id`: ej. `m9xqz8tw` o URL de GeoGebra (extraer ID mediante regex `/material\/([a-zA-Z0-9]+)/` o valor directo).
    - Input `ancho`: ej. `100%` u `800`.
    - Input `alto`: ej. `420` (píxeles).
  - Botón `[Cargar Simulador]`: genera o actualiza el iframe oficial:
    `https://www.geogebra.org/material/iframe/id/${id}/width/${w}/height/${h}/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/true/asb/false/sri/false/rc/false/ld/false/sdz/false/ctl/false`
  - Serialización en `extra`: `{ materialId: id, ancho: w, alto: h }`.

#### 5. Reconexión del Pipeline IA al Lienzo del Autor
- **En `generarClaseInteractivaCompletaIA()`:**
  - En lugar de saltar a la previsualización del estudiante, iterar sobre los bloques pedagógicos generados por la IA:
    - Apertura/Encuadre ➔ Tarjeta `callout` o `texto_dua`.
    - Desarrollo ➔ Tarjeta `excel_split_table` o `video_interactivo`.
    - Reto/Actividad ➔ Tarjeta `geogebra_param`, `sim_ofimatica` o `desafio`.
    - Cierre/Evaluación ➔ Tarjeta `quiz` o `cotejo`.
  - Inyectar las tarjetas en `#contenedorIDevicesDinamicos` con sus separadores `(+)` intermedios.
  - Ejecutar `irAPasoSesion_(3)` (Paso del Constructor) y mostrar toast de éxito: *"Secuencia didáctica generada en el lienzo. Edita y personaliza cada bloque."*

#### 6. Menú Lateral Drawer para Móvil ($\le 860\text{px}$)
- Controladores `abrirDrawerCatalogo_()` y `cerrarDrawerCatalogo_()`.
- Listener sobre `.backdrop-mobile` para cerrar al tocar fuera.

---

### 📦 ENTREGA DE CURSOR (ESCRIBE TU CÓDIGO JAVASCRIPT AQUÍ ABAJO):
*(Cursor escribirá aquí su propuesta de código JS y la guardará automáticamente)*
