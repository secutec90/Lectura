# BUZÓN DE ENTREGA: CURSOR -> ANTIGRAVITY

> **INSTRUCCIÓN PARA CURSOR (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_CURSOR.md`) todo tu código JavaScript/DOM propuesto para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js cursor`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: OLA 17 (`build-602+`) — LÓGICA Y CONTROLADORES JS DEL CONSTRUCTOR FUSIÓN (DIVI + ELEMENTOR + NOTION + eXeLearning)
- **Estado:** ✅ ENTREGADA (pendiente de auditoría e integración de Antigravity)
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

## ✅ ENTREGA — OLA 17 (`build-602+`) — CONTROLADORES JS DEL CONSTRUCTOR FUSIÓN

- **Estado para Antigravity:** 🟢 LISTA PARA INTEGRAR
- **Fecha:** 2026-11-05 (America/Monterrey)
- **Archivo que integra el bloque:** `AyudaJS.html`, pegado inmediatamente antes de `/* ENTREGA-AYUDAJS-FIN */` (mismo `<script>`, para reasignar las funciones ya declaradas).
- **Candado en:** `AdminPlanJS_06.html` y `ClaseJS_08.html` (inicio de `eliminarIDeviceCard_`).
- **Clases usadas (ya definidas por DeepSeek en `AdminPlaneacionCSS.html`):** `.btn-block-minus`, `.block-inserter-row`, `.btn-block-plus`, `.inserter-popup-dropdown`, `.inserter-popup-grid`, `.inserter-popup-grid--tres`, `.popup-inserter-item`, `.excel-split-table`, `.cols-50-50`, `.cols-33-33-33`, `.cols-70-30`, `.cols-25-75`, `.excel-layout-cell`, `.cell-bg-white`, `.cell-bg-soft-blue`, `.cell-bg-soft-teal`, `.cell-bg-soft-amber`, `.cell-bg-soft-gray`, `.celda-props-bar`, `.color-swatch`, `.tabla-scroll-touch`, `.word-shape-box`, `.shape-blue`, `.shape-teal`, `.shape-amber`, `.shape-purple`, `.shape-badge-meta`, `.geogebra-card-frame`, `.geogebra-card-header`, `.btn-fullscreen`, `.backdrop-mobile`, `.backdrop-visible`, `.btn-toggle-drawer`, `.sidebar-exe.drawer-abierto`, `.btn-tb`, `.campo-input`.
- **IDs de contrato que no se renombran:** `#contenedorIDevicesDinamicos`, `#vistaAutorExe`, `#lienzoExeActivo`, `#contadorIdevices`.
- **ID nuevo, solo de la pastilla efímera:** `#pastillaDeshacerBloque`.

### Informe técnico

1. No se tocan las 7 familias ni los bloques ya registrados en `META_TARJETA_EXE_`. Solo se agregan `word_shape`, `excel_split_table` y `geogebra_param`.
2. `insertarBloqueEnPosicion_` crea la tarjeta con `crearTarjetaCurricular_`, la coloca con `insertBefore` justo después de la fila `(+)` pulsada y crea la fila `(+)` siguiente. Después `repintarDivisoresExe_` reconstruye los separadores para no duplicarlos; el orden de las tarjetas ya quedó fijado por ese `insertBefore`.
3. `eliminarBloqueTarjeta_` guarda `window.ultimoBloqueEliminado_` con `id`, `html`, `siguienteHermano` y `padre`, más `anclaId` (la tarjeta siguiente) para que Deshacer funcione aunque el separador contiguo ya se haya quitado. La pastilla dura 5 segundos.
4. La celda Excel lleva `contenteditable="true"` en el `<td>`. La barra `.celda-props-bar` va con `contenteditable="false"` y el texto vive en `[data-excel-editor]`, así el HTML guardado no arrastra la barra. El pegado intercepta `paste` y deja solo `b`, `strong`, `i`, `em`, `u`, `br`, `p`, `ul`, `ol`, `li`, `a` (http/https), `span` y `div`, sin `style`, `class` ni etiquetas de Word.
5. GeoGebra guarda `ancho` y `alto` tal como los escribe el autor. La ruta oficial del iframe exige medidas numéricas: `100%` se conserva en `extra.ancho` y en el CSS del iframe, y en la URL se usa `800` para no romper `/width/`.
6. La IA sigue entrando por `generarClaseInteractivaCompletaIA()` → `volcarBloquesIAEnLienzo_()` → `irAPasoSesion_(3)`. El mapa nuevo es: teoría → `texto_dua`; ejemplo → `excel_split_table` o `video_interactivo` si hay URL de YouTube o Drive; ejercicio → `geogebra_param`, `sim_ofimatica` o `desafio`; autoevaluación → `quiz_evaluativo`; cotejo → `toggle_notion`; rúbrica → `tabla_notion`. El aviso de éxito queda: *Secuencia didáctica generada en el lienzo. Edita y personaliza cada bloque.*
7. `AdminPlanJS_06.html` y `ClaseJS_08.html` se cargan antes de `AyudaJS.html`. El envoltorio de `eliminarIDeviceCard_` vive en AyudaJS. El candado de dos archivos cubre el caso en que ese envoltorio no quede instalado.

### Candado para `AdminPlanJS_06.html` y `ClaseJS_08.html`

Insertar al inicio de `eliminarIDeviceCard_(btn)`, antes de cualquier `closest` / `remove`:

```javascript
if (typeof window.eliminarBloqueTarjeta_ === 'function') {
  var cardOla17 = btn && btn.closest ? btn.closest('.idevice-card') : null;
  if (cardOla17 && cardOla17.id) {
    window.eliminarBloqueTarjeta_(cardOla17.id);
    return;
  }
}
```

### Bloque a pegar en `AyudaJS.html` antes de `/* ENTREGA-AYUDAJS-FIN */`

```javascript
/* OLA17-CURSOR-INICIO — build-602+ constructor fusión. No renombra IDs ni bloques previos. */
(function engancharOla17_() {
  if (window._ola17Enganchada_) return;
  window._ola17Enganchada_ = true;

  if (typeof META_TARJETA_EXE_ === 'object' && META_TARJETA_EXE_) {
    if (!META_TARJETA_EXE_.word_shape) {
      META_TARJETA_EXE_.word_shape = { badge: 'badge-info', etiqueta: 'FORMA WORD', titulo: 'Cuadro de Texto / Forma DUA', cuerpo: 'Escribe el texto o consigna destacada...' };
    }
    if (!META_TARJETA_EXE_.excel_split_table) {
      META_TARJETA_EXE_.excel_split_table = { badge: 'badge-tecnologia', etiqueta: 'TABLA EXCEL', titulo: 'Tabla Dividida Multicelda', cuerpo: '', familia: 'tecnologia' };
    }
    if (!META_TARJETA_EXE_.geogebra_param) {
      META_TARJETA_EXE_.geogebra_param = { badge: 'badge-ciencias', etiqueta: 'GEOGEBRA', titulo: 'Simulador GeoGebra con Parámetros', cuerpo: '' };
    }
  }

  var CATALOGO_POPUP_OLA17_ = [
    ['texto_dua', '📖 Lectura DUA'],
    ['callout', '💡 Recuadro'],
    ['word_shape', '▢ Forma Word'],
    ['excel_split_table', '📊 Tabla Excel'],
    ['tabla_notion', '▦ Tabla'],
    ['video_interactivo', '🎥 Video'],
    ['geogebra_param', '📐 GeoGebra'],
    ['quiz_evaluativo', '📝 Quiz'],
    ['toggle_notion', '▾ Desplegable']
  ];

  var FONDOS_CELDA_EXCEL_ = {
    white: { hex: '#ffffff', clase: 'cell-bg-white' },
    blue: { hex: '#f0f9ff', clase: 'cell-bg-soft-blue' },
    teal: { hex: '#f0fdfa', clase: 'cell-bg-soft-teal' },
    amber: { hex: '#fffbeb', clase: 'cell-bg-soft-amber' },
    gray: { hex: '#f8fafc', clase: 'cell-bg-soft-gray' }
  };

  var ANCHOS_EXCEL_ = {
    '50-50': ['50%', '50%'],
    '33-33-33': ['33.33%', '33.33%', '33.34%'],
    '70-30': ['70%', '30%'],
    '25-75': ['25%', '75%']
  };

  var ESTILOS_FORMA_WORD_ = {
    'shape-blue': 'Forma Word: Azul primario',
    'shape-teal': 'Forma Word: Teal institucional (NEM)',
    'shape-amber': 'Forma Word: Ámbar alerta (DUA)',
    'shape-purple': 'Forma Word: Púrpura reflexión'
  };

  var ETIQUETAS_PEGADO_EXCEL_ = { b: 1, strong: 1, i: 1, em: 1, u: 1, br: 1, p: 1, ul: 1, ol: 1, li: 1, a: 1, span: 1, div: 1 };

  function attrOla17_(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function claseFondoPorHex_(hex) {
    var buscado = String(hex || '').toLowerCase();
    var clave;
    for (clave in FONDOS_CELDA_EXCEL_) {
      if (FONDOS_CELDA_EXCEL_[clave].hex === buscado) return FONDOS_CELDA_EXCEL_[clave].clase;
    }
    return 'cell-bg-white';
  }

  function pillHtmlOla17_(tipo, etiqueta) {
    return '<div class="idevice-pill-add" data-tipo="' + tipo + '" onclick="insertariDeviceSesion_(\'' + tipo + '\')"><span>' + etiqueta + '</span><span class="btn-mas">Añadir</span></div>';
  }

  function insertarPillTrasAncla_(html, tipoAncla, tipoNuevo, etiqueta) {
    if (!html || html.indexOf('data-tipo="' + tipoNuevo + '"') >= 0) return html;
    var token = "insertariDeviceSesion_('" + tipoAncla + "')";
    var i = html.indexOf(token);
    if (i < 0) return html;
    var fin = html.indexOf('</div>', i);
    if (fin < 0) return html;
    fin += 6;
    return html.slice(0, fin) + pillHtmlOla17_(tipoNuevo, etiqueta) + html.slice(fin);
  }

  function enriquecerCatalogoHtml_(html) {
    html = insertarPillTrasAncla_(html, 'fichero', 'word_shape', '▢ Cuadro de forma (Word)');
    html = insertarPillTrasAncla_(html, 'codigo', 'excel_split_table', '📊 Tabla dividida (Excel)');
    html = insertarPillTrasAncla_(html, 'formula', 'geogebra_param', '📐 GeoGebra con parámetros');
    return html;
  }

  function inyectarPillsCatalogoDom_() {
    function poner(ancla, tipo, etiqueta) {
      if (document.querySelector('.idevice-pill-add[data-tipo="' + tipo + '"]')) return;
      var nodo = document.querySelector('.idevice-pill-add[data-tipo="' + ancla + '"]');
      if (nodo) nodo.insertAdjacentHTML('afterend', pillHtmlOla17_(tipo, etiqueta));
    }
    poner('fichero', 'word_shape', '▢ Cuadro de forma (Word)');
    poner('codigo', 'excel_split_table', '📊 Tabla dividida (Excel)');
    poner('formula', 'geogebra_param', '📐 GeoGebra con parámetros');
  }

  if (typeof htmlCatalogoExe_ === 'function' && !htmlCatalogoExe_._st90Ola17) {
    var catalogoPrevio = htmlCatalogoExe_;
    htmlCatalogoExe_ = function () {
      return enriquecerCatalogoHtml_(catalogoPrevio());
    };
    htmlCatalogoExe_._st90Ola17 = true;
  }

  function htmlBarraCeldaExcel_() {
    return '<div class="celda-props-bar" contenteditable="false">' +
      '<button type="button" class="color-swatch" data-color="white" title="Blanco" aria-label="Fondo blanco" onmousedown="event.preventDefault()" onclick="aplicarColorCeldaExcel_(this)"></button>' +
      '<button type="button" class="color-swatch" data-color="blue" title="Azul suave" aria-label="Fondo azul suave" onmousedown="event.preventDefault()" onclick="aplicarColorCeldaExcel_(this)"></button>' +
      '<button type="button" class="color-swatch" data-color="teal" title="Teal suave" aria-label="Fondo teal suave" onmousedown="event.preventDefault()" onclick="aplicarColorCeldaExcel_(this)"></button>' +
      '<button type="button" class="color-swatch" data-color="amber" title="Ámbar suave" aria-label="Fondo ámbar suave" onmousedown="event.preventDefault()" onclick="aplicarColorCeldaExcel_(this)"></button>' +
      '<button type="button" class="color-swatch" data-color="gray" title="Gris suave" aria-label="Fondo gris suave" onmousedown="event.preventDefault()" onclick="aplicarColorCeldaExcel_(this)"></button>' +
      '<button type="button" class="btn-tb" onmousedown="event.preventDefault()" onclick="insertarMedioCeldaExcel_(this, \'imagen\')">📷 Imagen</button>' +
      '<button type="button" class="btn-tb" onmousedown="event.preventDefault()" onclick="insertarMedioCeldaExcel_(this, \'video\')">🎬 Video/Drive</button>' +
      '<button type="button" class="btn-tb" onmousedown="event.preventDefault()" onclick="limpiarFormatoCeldaExcel_(this)">Limpiar formato</button>' +
    '</div>';
  }

  function htmlCeldaExcel_(celda) {
    celda = celda || {};
    var hex = celda.bg || '#ffffff';
    var ancho = celda.ancho || '50%';
    return '<td class="excel-layout-cell ' + claseFondoPorHex_(hex) + '" contenteditable="true" data-ancho="' + attrOla17_(ancho) + '" data-bg="' + attrOla17_(hex) + '" style="background:' + attrOla17_(hex) + '">' +
      htmlBarraCeldaExcel_() +
      '<div data-excel-editor="1" contenteditable="true" style="min-height:72px">' + (celda.html || '') + '</div>' +
    '</td>';
  }

  function htmlExcelSplitOla17_(datos) {
    var extra = (datos && datos.extra) || {};
    var dist = ANCHOS_EXCEL_[extra.distribucion] ? extra.distribucion : '50-50';
    var anchos = ANCHOS_EXCEL_[dist];
    var previas = extra.celdas || [];
    var celdas = anchos.map(function (ancho, i) {
      var previa = previas[i] || {};
      return { ancho: ancho, bg: previa.bg || '#ffffff', html: previa.html || '' };
    });
    var cols = celdas.map(function () { return '<col>'; }).join('');
    var tds = celdas.map(htmlCeldaExcel_).join('');
    function opcion(valor, texto) {
      return '<option value="' + valor + '"' + (valor === dist ? ' selected' : '') + '>' + texto + '</option>';
    }
    return '<label class="campo-label">Distribución de columnas</label>' +
      '<select class="campo-input" data-accion="excel-distribucion" aria-label="Distribución de columnas" onchange="cambiarDistribucionExcel_(this)">' +
        opcion('50-50', '50% / 50%') +
        opcion('33-33-33', '33% / 33% / 33%') +
        opcion('70-30', '70% / 30%') +
        opcion('25-75', '25% / 75%') +
      '</select>' +
      '<div class="tabla-scroll-touch"><table class="excel-split-table cols-' + dist + '"><colgroup>' + cols + '</colgroup><tbody><tr>' + tds + '</tr></tbody></table></div>';
  }

  function htmlWordShapeOla17_(datos) {
    var extra = (datos && datos.extra) || {};
    var estilo = ESTILOS_FORMA_WORD_[extra.estiloForma] ? extra.estiloForma : 'shape-teal';
    var texto = extra.texto || ((datos && datos.cuerpo) || 'Escribe el texto o consigna destacada...');
    function opcion(valor, etiqueta) {
      return '<option value="' + valor + '"' + (valor === estilo ? ' selected' : '') + '>' + etiqueta + '</option>';
    }
    return '<label class="campo-label">Estilo de la forma</label>' +
      '<select class="campo-input" data-accion="estilo-forma" aria-label="Estilo de la forma" onchange="aplicarEstiloFormaWord_(this)">' +
        opcion('shape-blue', 'Azul Primario (Word)') +
        opcion('shape-teal', 'Teal Institucional (NEM)') +
        opcion('shape-amber', 'Ámbar Alerta (DUA)') +
        opcion('shape-purple', 'Púrpura Reflexión') +
      '</select>' +
      '<div class="word-shape-box ' + estilo + '" contenteditable="true" data-estilo-forma="' + estilo + '">' + texto + '</div>' +
      '<div class="shape-badge-meta" data-shape-badge="1">' + ESTILOS_FORMA_WORD_[estilo] + '</div>';
  }

  function htmlGeoGebraParamOla17_(datos) {
    var extra = (datos && datos.extra) || {};
    var id = extra.materialId || '';
    var ancho = extra.ancho || '100%';
    var alto = extra.alto || '420';
    return '<div class="geogebra-card-frame">' +
      '<div class="geogebra-card-header">' +
        '<input type="text" data-ggb="material" aria-label="ID o URL del material GeoGebra" placeholder="m9xqz8tw o URL" value="' + attrOla17_(id) + '">' +
        '<input type="text" data-ggb="ancho" aria-label="Ancho del simulador" placeholder="100% u 800" value="' + attrOla17_(ancho) + '">' +
        '<input type="text" data-ggb="alto" aria-label="Alto del simulador en píxeles" placeholder="420" value="' + attrOla17_(alto) + '">' +
        '<button type="button" class="btn-tb" data-accion="cargar-ggb" onclick="cargarSimuladorGeoGebra_(this)">Cargar Simulador</button>' +
        '<button type="button" class="btn-fullscreen" aria-label="Pantalla completa" onclick="pantallaCompletaGeoGebra_(this)">⛶</button>' +
      '</div>' +
      '<iframe data-ggb-marco="1" title="Simulador GeoGebra" allow="fullscreen" allowfullscreen></iframe>' +
    '</div>';
  }

  function htmlEspecialOla17_(tipo, datos) {
    if (tipo === 'excel_split_table') return htmlExcelSplitOla17_(datos);
    if (tipo === 'word_shape') return htmlWordShapeOla17_(datos);
    if (tipo === 'geogebra_param') return htmlGeoGebraParamOla17_(datos);
    return '';
  }

  if (typeof htmlEspecialExe_ === 'function' && !htmlEspecialExe_._st90Ola17) {
    var htmlEspecialPrevio = htmlEspecialExe_;
    htmlEspecialExe_ = function (tipo, datos) {
      var propio = htmlEspecialOla17_(tipo, datos);
      if (propio) return '<div data-ola17-host="' + tipo + '">' + propio + '</div>';
      return htmlEspecialPrevio(tipo, datos);
    };
    htmlEspecialExe_._st90Ola17 = true;
  }

  function hostOla17_(card) {
    return card ? card.querySelector('[data-ola17-host]') : null;
  }

  function editorCeldaExcel_(td) {
    if (!td) return null;
    return td.querySelector('[data-excel-editor]') || td;
  }

  function htmlGuardadoCelda_(td) {
    var editor = td.querySelector('[data-excel-editor]');
    return editor ? editor.innerHTML : '';
  }

  function leerExcelOla17_(card) {
    var sel = card.querySelector('[data-accion="excel-distribucion"]');
    var celdas = [];
    card.querySelectorAll('.excel-layout-cell').forEach(function (td) {
      celdas.push({
        ancho: td.getAttribute('data-ancho') || '',
        bg: td.getAttribute('data-bg') || '#ffffff',
        html: htmlGuardadoCelda_(td)
      });
    });
    return { distribucion: sel ? sel.value : '50-50', celdas: celdas };
  }

  function leerWordOla17_(card) {
    var caja = card.querySelector('.word-shape-box');
    return {
      estiloForma: caja ? (caja.getAttribute('data-estilo-forma') || 'shape-teal') : 'shape-teal',
      texto: caja ? caja.innerHTML : ''
    };
  }

  function leerGgbOla17_(card) {
    function val(clave) {
      var el = card.querySelector('[data-ggb="' + clave + '"]');
      return el ? el.value : '';
    }
    return { materialId: extraerIdGeoGebra_(val('material')) || val('material').trim(), ancho: val('ancho') || '100%', alto: val('alto') || '420' };
  }

  if (typeof leerTarjetaExe_ === 'function' && !leerTarjetaExe_._st90Ola17) {
    var leerPrevio = leerTarjetaExe_;
    leerTarjetaExe_ = function (card) {
      var base = leerPrevio(card);
      if (!card || !base) return base;
      if (base.tipo === 'excel_split_table') base.extra = leerExcelOla17_(card);
      else if (base.tipo === 'word_shape') base.extra = leerWordOla17_(card);
      else if (base.tipo === 'geogebra_param') base.extra = leerGgbOla17_(card);
      return base;
    };
    leerTarjetaExe_._st90Ola17 = true;
    window.leerTarjetaExe_ = leerTarjetaExe_;
  }

  if (typeof rellenarTarjetaExe_ === 'function' && !rellenarTarjetaExe_._st90Ola17) {
    var rellenarPrevio = rellenarTarjetaExe_;
    rellenarTarjetaExe_ = function (card, datos) {
      rellenarPrevio(card, datos);
      if (!card || !datos) return;
      var tipo = card.getAttribute('data-tipo');
      if (tipo !== 'excel_split_table' && tipo !== 'word_shape' && tipo !== 'geogebra_param') return;
      var host = hostOla17_(card);
      if (!host) return;
      host.innerHTML = htmlEspecialOla17_(tipo, datos);
      if (tipo === 'geogebra_param' && datos.extra && datos.extra.materialId) {
        var btn = host.querySelector('[data-accion="cargar-ggb"]');
        if (btn) cargarSimuladorGeoGebra_(btn);
      }
    };
    rellenarTarjetaExe_._st90Ola17 = true;
    window.rellenarTarjetaExe_ = rellenarTarjetaExe_;
  }

  function cerrarMenusInsercionExe_() {
    document.querySelectorAll('.inserter-popup-dropdown').forEach(function (m) {
      if (m.parentNode) m.parentNode.removeChild(m);
    });
    var viejo = document.getElementById('menuDivisorExe');
    if (viejo && viejo.parentNode) viejo.parentNode.removeChild(viejo);
  }

  function abrirMenuInsercionExe_(fila) {
    cerrarMenusInsercionExe_();
    var menu = document.createElement('div');
    menu.className = 'inserter-popup-dropdown';
    menu.setAttribute('role', 'menu');
    var grid = document.createElement('div');
    grid.className = 'inserter-popup-grid inserter-popup-grid--tres';
    CATALOGO_POPUP_OLA17_.forEach(function (it) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'popup-inserter-item';
      b.setAttribute('role', 'menuitem');
      b.textContent = it[1];
      b.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
      b.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        insertarBloqueEnPosicion_(it[0], fila);
      });
      grid.appendChild(b);
    });
    menu.appendChild(grid);
    fila.appendChild(menu);
  }

  function crearFilaInsercionExe_() {
    var fila = document.createElement('div');
    fila.className = 'block-inserter-row';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-block-plus';
    btn.textContent = '+';
    btn.setAttribute('aria-label', 'Insertar bloque aquí');
    btn.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
    btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (fila.querySelector('.inserter-popup-dropdown')) cerrarMenusInsercionExe_();
      else abrirMenuInsercionExe_(fila);
    });
    fila.appendChild(btn);
    return fila;
  }

  function asegurarBotonMenosExe_(card) {
    if (!card) return;
    var viejo = card.querySelector('.btn-block-minus');
    if (viejo) viejo.remove();
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-block-minus';
    btn.textContent = '−';
    btn.setAttribute('aria-label', 'Eliminar bloque');
    btn.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
    btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (card.id) eliminarBloqueTarjeta_(card.id);
    });
    card.appendChild(btn);
  }

  function repintarDivisoresExe_() {
    var cont = document.getElementById('contenedorIDevicesDinamicos');
    if (!cont) return;
    cont.querySelectorAll('.block-inserter-row, .divisor-insertar-bloque').forEach(function (d) { d.remove(); });
    var cards = [];
    cont.querySelectorAll('.idevice-card').forEach(function (c) {
      asegurarBotonMenosExe_(c);
      if (c.style.display !== 'none') cards.push(c);
    });
    if (!cards.length) {
      cont.appendChild(crearFilaInsercionExe_());
      return;
    }
    var primera = cards[0];
    if (primera.parentNode) primera.parentNode.insertBefore(crearFilaInsercionExe_(), primera);
    cards.forEach(function (card) {
      var fila = crearFilaInsercionExe_();
      if (card.nextSibling) card.parentNode.insertBefore(fila, card.nextSibling);
      else card.parentNode.appendChild(fila);
    });
  }
  window.repintarDivisoresExe_ = repintarDivisoresExe_;

  function insertarBloqueEnPosicion_(tipo, btnReferencia) {
    var filaRef = null;
    if (btnReferencia) {
      if (btnReferencia.classList && btnReferencia.classList.contains('block-inserter-row')) filaRef = btnReferencia;
      else if (btnReferencia.closest) filaRef = btnReferencia.closest('.block-inserter-row');
    }
    cerrarMenusInsercionExe_();
    var card = (typeof crearTarjetaCurricular_ === 'function') ? crearTarjetaCurricular_(tipo, null) : null;
    if (!card) return null;
    if (typeof idPaginaActivaExe_ === 'function') card.setAttribute('data-pagina-id', String(idPaginaActivaExe_()));
    var padre = (filaRef && filaRef.parentNode) || card.parentNode;
    if (filaRef && padre) {
      padre.insertBefore(card, filaRef.nextSibling);
      var nuevaFila = crearFilaInsercionExe_();
      padre.insertBefore(nuevaFila, card.nextSibling);
    }
    if (typeof marcarIDevicesTocados_ === 'function') marcarIDevicesTocados_();
    if (typeof aplicarFiltroPaginaExe_ === 'function') aplicarFiltroPaginaExe_();
    else repintarDivisoresExe_();
    if (typeof actualizarContadorIDevicesExe_ === 'function') actualizarContadorIDevicesExe_();
    if (typeof capturarEstadoExe_ === 'function') capturarEstadoExe_();
    if (card.scrollIntoView) card.scrollIntoView({ block: 'nearest' });
    return card;
  }

  function mostrarPastillaDeshacerBloque_() {
    var pill = document.getElementById('pastillaDeshacerBloque');
    if (!pill) {
      pill = document.createElement('div');
      pill.id = 'pastillaDeshacerBloque';
      pill.setAttribute('role', 'status');
      pill.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:1200;display:flex;gap:12px;align-items:center;background:#0f172a;color:#ffffff;padding:10px 14px;border-radius:999px;font:600 13px/1.3 sans-serif;box-shadow:0 8px 24px rgba(15,23,42,.25);';
      document.body.appendChild(pill);
    }
    pill.innerHTML = '<span>Bloque eliminado.</span>';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Deshacer';
    btn.style.cssText = 'border:0;border-radius:999px;background:#14b8a6;color:#042f2e;font:800 12px/1 sans-serif;padding:6px 10px;cursor:pointer;';
    btn.addEventListener('click', function () { deshacerEliminarBloque_(); });
    pill.appendChild(btn);
    clearTimeout(window._timerPastillaDeshacer_);
    window._timerPastillaDeshacer_ = setTimeout(function () {
      var nodo = document.getElementById('pastillaDeshacerBloque');
      if (nodo && nodo.parentNode) nodo.parentNode.removeChild(nodo);
    }, 5000);
  }

  function eliminarBloqueTarjeta_(idBloque) {
    var el = typeof idBloque === 'string' ? document.getElementById(idBloque) : idBloque;
    if (!el || !el.classList || !el.classList.contains('idevice-card')) return;
    var padre = el.parentNode;
    var siguiente = el.nextSibling;
    var ancla = el.nextElementSibling;
    while (ancla && !ancla.classList.contains('idevice-card')) ancla = ancla.nextElementSibling;
    window.ultimoBloqueEliminado_ = {
      id: el.id,
      html: el.outerHTML,
      siguienteHermano: siguiente,
      padre: padre,
      anclaId: ancla ? ancla.id : '',
      datos: (typeof leerTarjetaExe_ === 'function') ? leerTarjetaExe_(el) : null
    };
    var rich = el.querySelector('.campo-editor-rich');
    if (rich && rich.id && window.tinymce && window.tinymce.get(rich.id)) {
      try { window.tinymce.get(rich.id).remove(); } catch (e) {}
    }
    var sep = el.nextElementSibling;
    if (sep && (sep.classList.contains('block-inserter-row') || sep.classList.contains('divisor-insertar-bloque'))) sep.remove();
    if (el.parentNode) el.parentNode.removeChild(el);
    if (typeof marcarIDevicesTocados_ === 'function') marcarIDevicesTocados_();
    repintarDivisoresExe_();
    if (typeof actualizarContadorIDevicesExe_ === 'function') actualizarContadorIDevicesExe_();
    if (typeof renderArbolSesion_ === 'function') renderArbolSesion_();
    if (typeof capturarEstadoExe_ === 'function') capturarEstadoExe_();
    mostrarPastillaDeshacerBloque_();
  }

  function deshacerEliminarBloque_() {
    var buf = window.ultimoBloqueEliminado_;
    if (!buf || !buf.html) return;
    window.ultimoBloqueEliminado_ = null;
    var padre = (buf.padre && buf.padre.isConnected) ? buf.padre : document.getElementById('contenedorIDevicesDinamicos');
    if (!padre) return;
    var cont = document.createElement('div');
    cont.innerHTML = buf.html;
    var card = cont.firstElementChild;
    if (!card) return;
    var ancla = buf.anclaId ? document.getElementById(buf.anclaId) : null;
    if (ancla && ancla.parentNode === padre) padre.insertBefore(card, ancla);
    else if (buf.siguienteHermano && buf.siguienteHermano.parentNode === padre) padre.insertBefore(card, buf.siguienteHermano);
    else padre.appendChild(card);
    if (typeof aplicarFiltroPaginaExe_ === 'function') aplicarFiltroPaginaExe_();
    else repintarDivisoresExe_();
    if (typeof actualizarContadorIDevicesExe_ === 'function') actualizarContadorIDevicesExe_();
    if (typeof capturarEstadoExe_ === 'function') capturarEstadoExe_();
    var pill = document.getElementById('pastillaDeshacerBloque');
    if (pill && pill.parentNode) pill.parentNode.removeChild(pill);
    clearTimeout(window._timerPastillaDeshacer_);
  }

  function cambiarDistribucionExcel_(select) {
    var card = select && select.closest ? select.closest('.idevice-card') : null;
    if (!card) return;
    var extra = leerExcelOla17_(card);
    extra.distribucion = select.value;
    var host = hostOla17_(card);
    if (host) host.innerHTML = htmlExcelSplitOla17_({ extra: extra });
    if (typeof marcarIDevicesTocados_ === 'function') marcarIDevicesTocados_();
  }

  function aplicarColorCeldaExcel_(btn) {
    var td = btn && btn.closest ? btn.closest('.excel-layout-cell') : null;
    var info = FONDOS_CELDA_EXCEL_[btn.getAttribute('data-color')] || FONDOS_CELDA_EXCEL_.white;
    if (!td) return;
    td.setAttribute('data-bg', info.hex);
    td.style.background = info.hex;
    td.classList.remove('cell-bg-white', 'cell-bg-soft-blue', 'cell-bg-soft-teal', 'cell-bg-soft-amber', 'cell-bg-soft-gray');
    td.classList.add(info.clase);
    if (typeof marcarIDevicesTocados_ === 'function') marcarIDevicesTocados_();
  }

  function insertarMedioCeldaExcel_(btn, tipo) {
    var td = btn && btn.closest ? btn.closest('.excel-layout-cell') : null;
    var editor = editorCeldaExcel_(td);
    if (!editor) return;
    var url = window.prompt(tipo === 'imagen' ? 'Pega la URL de la imagen (https):' : 'Pega la URL del video o de Google Drive:', 'https://');
    if (!url) return;
    url = String(url).trim();
    if (!/^https:\/\//i.test(url)) {
      if (typeof avisar_ === 'function') avisar_('Solo se aceptan enlaces https.', 'error');
      return;
    }
    var nodo;
    if (tipo === 'imagen') {
      nodo = document.createElement('img');
      nodo.src = url;
      nodo.alt = 'Imagen de la celda';
      nodo.style.maxWidth = '100%';
      nodo.style.borderRadius = '8px';
    } else {
      var yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      var drive = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
      nodo = document.createElement('iframe');
      nodo.title = 'Video de la celda';
      nodo.setAttribute('allowfullscreen', '');
      nodo.style.width = '100%';
      nodo.style.height = '220px';
      nodo.style.border = '0';
      if (yt) nodo.src = 'https://www.youtube-nocookie.com/embed/' + yt[1];
      else if (drive) nodo.src = 'https://drive.google.com/file/d/' + drive[1] + '/preview';
      else {
        nodo = document.createElement('a');
        nodo.href = url;
        nodo.target = '_blank';
        nodo.rel = 'noopener';
        nodo.textContent = 'Abrir video o archivo';
      }
    }
    editor.appendChild(nodo);
    if (typeof marcarIDevicesTocados_ === 'function') marcarIDevicesTocados_();
  }

  function limpiarFormatoCeldaExcel_(btn) {
    var td = btn && btn.closest ? btn.closest('.excel-layout-cell') : null;
    var editor = td ? td.querySelector('[data-excel-editor]') : null;
    if (!editor) return;
    editor.textContent = editor.innerText || '';
    if (typeof marcarIDevicesTocados_ === 'function') marcarIDevicesTocados_();
  }

  function sanitizarPegadoExcel_(html) {
    var doc;
    try { doc = new DOMParser().parseFromString(String(html || ''), 'text/html'); }
    catch (e) { return ''; }
    function limpiar(nodo) {
      var hijos = Array.prototype.slice.call(nodo.childNodes || []);
      hijos.forEach(function (h) {
        if (h.nodeType === 3) return;
        if (h.nodeType !== 1) {
          if (h.parentNode) h.parentNode.removeChild(h);
          return;
        }
        var tag = h.tagName.toLowerCase();
        if (tag === 'script' || tag === 'style' || tag === 'meta' || tag === 'link' || tag === 'iframe' || tag === 'object' || tag === 'embed') {
          nodo.removeChild(h);
          return;
        }
        if (!ETIQUETAS_PEGADO_EXCEL_[tag]) {
          limpiar(h);
          while (h.firstChild) nodo.insertBefore(h.firstChild, h);
          nodo.removeChild(h);
          return;
        }
        var href = tag === 'a' ? (h.getAttribute('href') || '') : '';
        Array.prototype.slice.call(h.attributes).forEach(function (a) { h.removeAttribute(a.name); });
        if (tag === 'a' && /^https?:\/\//i.test(href)) {
          h.setAttribute('href', href);
          h.setAttribute('rel', 'noopener');
          h.setAttribute('target', '_blank');
        }
        limpiar(h);
      });
    }
    limpiar(doc.body);
    return doc.body.innerHTML;
  }

  function aplicarEstiloFormaWord_(select) {
    var host = select && select.closest ? select.closest('[data-ola17-host]') : null;
    if (!host) return;
    var caja = host.querySelector('.word-shape-box');
    var badge = host.querySelector('[data-shape-badge]');
    var estilo = ESTILOS_FORMA_WORD_[select.value] ? select.value : 'shape-teal';
    if (caja) {
      caja.classList.remove('shape-blue', 'shape-teal', 'shape-amber', 'shape-purple', 'shape-rose');
      caja.classList.add(estilo);
      caja.setAttribute('data-estilo-forma', estilo);
    }
    if (badge) badge.textContent = ESTILOS_FORMA_WORD_[estilo];
    if (typeof marcarIDevicesTocados_ === 'function') marcarIDevicesTocados_();
  }

  function extraerIdGeoGebra_(valor) {
    var s = String(valor || '').trim();
    if (!s) return '';
    var m = s.match(/material\/(?:iframe\/id\/)?([a-zA-Z0-9]+)/i);
    if (m && m[1] && m[1].toLowerCase() !== 'iframe') return m[1];
    m = s.match(/\/m\/([a-zA-Z0-9]+)/i);
    if (m && m[1]) return m[1];
    m = s.match(/[?&]id=([a-zA-Z0-9]+)/);
    if (m && m[1]) return m[1];
    if (/^[a-zA-Z0-9]+$/.test(s)) return s;
    return '';
  }

  function segmentoMedidaGgb_(valor, defecto) {
    var s = String(valor || '').trim();
    if (/^\d+(\.\d+)?%$/.test(s)) return String(defecto);
    var n = parseInt(s, 10);
    if (!isNaN(n) && n > 0) return String(n);
    return String(defecto);
  }

  function cargarSimuladorGeoGebra_(btn) {
    var marco = btn && btn.closest ? btn.closest('.geogebra-card-frame') : null;
    if (!marco) return;
    var id = extraerIdGeoGebra_((marco.querySelector('[data-ggb="material"]') || {}).value);
    var anchoIn = (marco.querySelector('[data-ggb="ancho"]') || {}).value || '100%';
    var altoIn = (marco.querySelector('[data-ggb="alto"]') || {}).value || '420';
    var iframe = marco.querySelector('[data-ggb-marco]');
    if (!id) {
      if (typeof avisar_ === 'function') avisar_('Escribe el ID o la URL del material de GeoGebra.', 'error');
      return;
    }
    var campoId = marco.querySelector('[data-ggb="material"]');
    if (campoId) campoId.value = id;
    if (!iframe) return;
    var w = segmentoMedidaGgb_(anchoIn, 800);
    var h = segmentoMedidaGgb_(altoIn, 420);
    iframe.src = 'https://www.geogebra.org/material/iframe/id/' + wEncode_(id) +
      '/width/' + w + '/height/' + h +
      '/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/true/asb/false/sri/false/rc/false/ld/false/sdz/false/ctl/false';
    var anchoCss = String(anchoIn || '100%').trim();
    if (/^\d+$/.test(anchoCss)) anchoCss += 'px';
    iframe.style.width = anchoCss || '100%';
    iframe.style.height = h + 'px';
    if (typeof marcarIDevicesTocados_ === 'function') marcarIDevicesTocados_();
  }

  function wEncode_(s) {
    return encodeURIComponent(String(s || ''));
  }

  function pantallaCompletaGeoGebra_(btn) {
    var marco = btn && btn.closest ? btn.closest('.geogebra-card-frame') : null;
    var iframe = marco ? marco.querySelector('[data-ggb-marco]') : null;
    if (iframe && iframe.requestFullscreen) {
      try { iframe.requestFullscreen(); } catch (e) {}
    }
  }

  function tipoTarjetaFusionIA_(b) {
    b = b || {};
    var tipo = String(b.tipo || '');
    var blob = [b.titulo, b.cuerpo, b.consigna, b.url].map(function (x) { return String(x || ''); }).join(' ').toLowerCase();
    if (tipo === 'contenido_teoria') return 'texto_dua';
    if (tipo === 'contenido_ejemplo') return /youtu\.be|youtube\.com|drive\.google\.com/.test(blob) ? 'video_interactivo' : 'excel_split_table';
    if (tipo === 'contenido_ejercicio') {
      if (/hoja de c[aá]lculo|ofim[aá]tica/.test(blob)) return 'sim_ofimatica';
      if (/escape|desaf[ií]o|candado/.test(blob)) return 'desafio';
      return 'geogebra_param';
    }
    if (tipo === 'contenido_autoevaluacion') return 'quiz_evaluativo';
    if (tipo === 'contenido_lista_cotejo') return 'toggle_notion';
    if (tipo === 'contenido_rubrica') return 'tabla_notion';
    if (tipo === 'contenido_evidencia') return 'fichero';
    var mom = parseInt(b.momento, 10) || 0;
    if (mom === 1) return 'callout';
    if (mom === 2) return /youtu\.be|youtube\.com|drive\.google\.com/.test(blob) ? 'video_interactivo' : 'excel_split_table';
    if (mom === 3) return 'geogebra_param';
    if (mom === 4) return 'quiz_evaluativo';
    if (typeof tipoTarjetaDesdeContenido_ === 'function') return tipoTarjetaDesdeContenido_(tipo);
    return 'texto_dua';
  }

  function datosTarjetaFusionIA_(b, tipoDestino) {
    var base = (typeof datosTarjetaDesdeContenido_ === 'function')
      ? datosTarjetaDesdeContenido_(b)
      : { titulo: (b && b.titulo) || '', cuerpo: (b && b.cuerpo) || '', extra: {} };
    var extra = base.extra || {};
    var texto = base.cuerpo || '';
    if (tipoDestino === 'excel_split_table') {
      extra.distribucion = '50-50';
      extra.celdas = [
        { ancho: '50%', bg: '#f0fdfa', html: (typeof escaparHtmlEditor_ === 'function' ? escaparHtmlEditor_(texto) : texto).replace(/\n/g, '<br>') },
        { ancho: '50%', bg: '#ffffff', html: (b && b.consigna && b.consigna !== texto) ? ((typeof escaparHtmlEditor_ === 'function' ? escaparHtmlEditor_(b.consigna) : b.consigna).replace(/\n/g, '<br>')) : '' }
      ];
    } else if (tipoDestino === 'word_shape') {
      extra.estiloForma = 'shape-teal';
      extra.texto = (typeof escaparHtmlEditor_ === 'function' ? escaparHtmlEditor_(texto) : texto).replace(/\n/g, '<br>');
    } else if (tipoDestino === 'geogebra_param') {
      extra.materialId = extraerIdGeoGebra_(b && b.url);
      extra.ancho = '100%';
      extra.alto = '420';
    }
    base.extra = extra;
    return base;
  }

  if (typeof volcarBloquesIAEnLienzo_ === 'function' && !volcarBloquesIAEnLienzo_._st90Ola17) {
    volcarBloquesIAEnLienzo_ = function (norm) {
      if (typeof montarEntornoExeLearning_ === 'function') montarEntornoExeLearning_();
      if (typeof asegurarPaginasExe_ === 'function') asegurarPaginasExe_();
      var cuenta = (typeof contarBloquesPaginaExe_ === 'function' && typeof idPaginaActivaExe_ === 'function') ? contarBloquesPaginaExe_(idPaginaActivaExe_()) : 0;
      if (cuenta > 0 && typeof confirm === 'function') {
        var deseaReemplazar = confirm(
          '⚠️ Esta página ya contiene ' + cuenta + ' bloque(s) de contenido.\n\n' +
          '¿Deseas REEMPLAZAR los bloques actuales con la nueva clase generada por IA?\n\n' +
          '• Aceptar: Reemplaza los bloques existentes de esta página.\n' +
          '• Cancelar: Mantiene los bloques actuales y agrega la clase al final.'
        );
        if (deseaReemplazar && typeof limpiarBloquesPaginaActivaExe_ === 'function') limpiarBloquesPaginaActivaExe_();
      }
      var bloques = (norm && norm.bloques) || [];
      var pid = (typeof idPaginaActivaExe_ === 'function') ? idPaginaActivaExe_() : 0;
      bloques.forEach(function (b) {
        var tipo = tipoTarjetaFusionIA_(b);
        var datos = datosTarjetaFusionIA_(b, tipo);
        var card = (typeof insertarBloqueExe_ === 'function') ? insertarBloqueExe_(tipo, datos, pid) : null;
        if (!card && typeof insertarBloqueExe_ === 'function') card = insertarBloqueExe_('texto_dua', datos, pid);
        if (card && tipo === 'video_interactivo') {
          var fuente = [b && b.cuerpo, b && b.consigna, b && b.url].filter(Boolean).join('\n');
          var murl = fuente.match(/https?:\/\/[^\s)]+/);
          var inp = card.querySelector('.inp-video-url');
          if (murl && inp) {
            inp.value = murl[0];
            if (typeof actualizarPreviewVideo_ === 'function') actualizarPreviewVideo_(inp);
          }
        }
      });
      if (typeof capturarEstadoExe_ === 'function') capturarEstadoExe_();
      repintarDivisoresExe_();
    };
    volcarBloquesIAEnLienzo_._st90Ola17 = true;
    window.volcarBloquesIAEnLienzo_ = volcarBloquesIAEnLienzo_;
  }

  if (typeof avisar_ === 'function' && !avisar_._st90Ola17) {
    var avisarPrevio = avisar_;
    avisar_ = function (mensaje, tipo) {
      if (mensaje === 'Clase interactiva lista en el constructor. Revisa las tarjetas del paso 3.') {
        mensaje = 'Secuencia didáctica generada en el lienzo. Edita y personaliza cada bloque.';
      }
      return avisarPrevio(mensaje, tipo);
    };
    avisar_._st90Ola17 = true;
    window.avisar_ = avisar_;
  }

  function asegurarChromeDrawerExe_() {
    var workspace = document.getElementById('vistaAutorExe') || document.querySelector('.app-workspace');
    if (!workspace) return;
    var backdrop = workspace.querySelector('.backdrop-mobile');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'backdrop-mobile';
      backdrop.setAttribute('aria-hidden', 'true');
      workspace.appendChild(backdrop);
    }
    if (!backdrop._ola17Click) {
      backdrop.addEventListener('click', cerrarDrawerCatalogo_);
      backdrop._ola17Click = true;
    }
    var btn = workspace.querySelector('.btn-toggle-drawer');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-toggle-drawer';
      btn.textContent = '☰';
      btn.setAttribute('aria-label', 'Abrir catálogo de contenidos');
      workspace.appendChild(btn);
    }
    if (!btn._ola17Click) {
      btn.addEventListener('click', abrirDrawerCatalogo_);
      btn._ola17Click = true;
    }
  }

  function sidebarExe_() {
    return document.querySelector('#vistaAutorExe .sidebar-exe') || document.querySelector('.app-workspace .sidebar-exe');
  }

  function abrirDrawerCatalogo_() {
    var side = sidebarExe_();
    if (side) side.classList.add('drawer-abierto');
    var workspace = document.getElementById('vistaAutorExe') || document.querySelector('.app-workspace');
    var backdrop = workspace ? workspace.querySelector('.backdrop-mobile') : null;
    if (backdrop) {
      backdrop.classList.add('backdrop-visible');
      backdrop.setAttribute('aria-hidden', 'false');
    }
  }

  function cerrarDrawerCatalogo_() {
    var side = sidebarExe_();
    if (side) side.classList.remove('drawer-abierto');
    var workspace = document.getElementById('vistaAutorExe') || document.querySelector('.app-workspace');
    var backdrop = workspace ? workspace.querySelector('.backdrop-mobile') : null;
    if (backdrop) {
      backdrop.classList.remove('backdrop-visible');
      backdrop.setAttribute('aria-hidden', 'true');
    }
  }

  if (typeof montarEntornoExeLearning_ === 'function' && !montarEntornoExeLearning_._st90Ola17) {
    var montarPrevio = montarEntornoExeLearning_;
    montarEntornoExeLearning_ = function () {
      var r = montarPrevio.apply(this, arguments);
      asegurarChromeDrawerExe_();
      inyectarPillsCatalogoDom_();
      repintarDivisoresExe_();
      return r;
    };
    montarEntornoExeLearning_._st90Ola17 = true;
    window.montarEntornoExeLearning_ = montarEntornoExeLearning_;
  }

  if (typeof window.eliminarIDeviceCard_ === 'function' && !window.eliminarIDeviceCard_._st90Ola17) {
    var quitarPrevio = window.eliminarIDeviceCard_;
    window.eliminarIDeviceCard_ = function (btn) {
      var card = btn && btn.closest ? btn.closest('.idevice-card') : null;
      if (card && card.id) {
        eliminarBloqueTarjeta_(card.id);
        return;
      }
      return quitarPrevio(btn);
    };
    window.eliminarIDeviceCard_._st90Ola17 = true;
  }

  if (!window._ola17Eventos_) {
    window._ola17Eventos_ = true;
    document.addEventListener('click', function (ev) {
      if (ev.target && ev.target.closest && ev.target.closest('.block-inserter-row')) return;
      cerrarMenusInsercionExe_();
    });
    document.addEventListener('paste', function (ev) {
      var editor = ev.target && ev.target.closest ? ev.target.closest('[data-excel-editor]') : null;
      if (!editor && ev.target && ev.target.closest) {
        var td = ev.target.closest('.excel-layout-cell');
        editor = td ? td.querySelector('[data-excel-editor]') : null;
      }
      if (!editor) return;
      ev.preventDefault();
      var cd = ev.clipboardData;
      var html = cd ? cd.getData('text/html') : '';
      var texto = cd ? cd.getData('text/plain') : '';
      var limpio = html ? sanitizarPegadoExcel_(html) : ((typeof escaparHtmlEditor_ === 'function' ? escaparHtmlEditor_(texto) : texto).replace(/\n/g, '<br>'));
      if (editor.focus) editor.focus();
      var ok = false;
      try { ok = document.execCommand('insertHTML', false, limpio); } catch (e) { ok = false; }
      if (!ok) editor.insertAdjacentHTML('beforeend', limpio);
      if (typeof marcarIDevicesTocados_ === 'function') marcarIDevicesTocados_();
    }, true);
    document.addEventListener('input', function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      if (t.closest('.excel-layout-cell, .word-shape-box, .geogebra-card-frame') && typeof marcarIDevicesTocados_ === 'function') {
        marcarIDevicesTocados_();
      }
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Escape') return;
      cerrarMenusInsercionExe_();
      cerrarDrawerCatalogo_();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) cerrarDrawerCatalogo_();
    });
  }

  window.insertarBloqueEnPosicion_ = insertarBloqueEnPosicion_;
  window.eliminarBloqueTarjeta_ = eliminarBloqueTarjeta_;
  window.deshacerEliminarBloque_ = deshacerEliminarBloque_;
  window.cambiarDistribucionExcel_ = cambiarDistribucionExcel_;
  window.aplicarColorCeldaExcel_ = aplicarColorCeldaExcel_;
  window.insertarMedioCeldaExcel_ = insertarMedioCeldaExcel_;
  window.limpiarFormatoCeldaExcel_ = limpiarFormatoCeldaExcel_;
  window.aplicarEstiloFormaWord_ = aplicarEstiloFormaWord_;
  window.cargarSimuladorGeoGebra_ = cargarSimuladorGeoGebra_;
  window.pantallaCompletaGeoGebra_ = pantallaCompletaGeoGebra_;
  window.abrirDrawerCatalogo_ = abrirDrawerCatalogo_;
  window.cerrarDrawerCatalogo_ = cerrarDrawerCatalogo_;
  window.extraerIdGeoGebra_ = extraerIdGeoGebra_;

  inyectarPillsCatalogoDom_();
  asegurarChromeDrawerExe_();
  if (document.getElementById('contenedorIDevicesDinamicos')) repintarDivisoresExe_();
})();
/* OLA17-CURSOR-FIN */
```

### 🛠️ [2026-11-05] - Constructor fusión Ola 17
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(constructor): controladores de insercion continua, tabla excel, forma word y geogebra`
- **Cambios Realizados:**
 - Propuesta de controladores JS de la Ola 17 en el buzón: inserción `(+)` en posición, eliminación `(-)` con deshacer, tabla Excel, forma Word, GeoGebra parametrizado, volcado de la IA al paso 3 y drawer móvil.
- **Archivos Afectados:** `ENTREGA_CURSOR.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Cursor no integra en los HTML; Antigravity pega el bloque `OLA17-CURSOR` en `AyudaJS.html` antes de `/* ENTREGA-AYUDAJS-FIN */` y el candado de `eliminarBloqueTarjeta_` al inicio de `eliminarIDeviceCard_` en `AdminPlanJS_06.html` y `ClaseJS_08.html`. No reabrir el mapa de la IA: teoría→texto DUA, ejemplo→tabla Excel o video, ejercicio→GeoGebra/ofimática/desafío, autoevaluación→quiz, cotejo→desplegable, rúbrica→tabla. El ancho `100%` de GeoGebra se guarda tal cual y en la URL del iframe se manda `800` porque la ruta oficial solo acepta píxeles. Las clases son las de DeepSeek; no inventar otras.

---
*Fin de la entrega Cursor. Centinela activo a la espera de la siguiente partitura.*
