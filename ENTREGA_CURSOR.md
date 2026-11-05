# BUZÓN DE ENTREGA: CURSOR -> ANTIGRAVITY

> **INSTRUCCIÓN PARA CURSOR (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_CURSOR.md`) todo tu código JavaScript/DOM propuesto para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js cursor`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: OLA 5 (`build-578`) — LÓGICA Y CONTROLADORES JS DEL ENTORNO EXELEARNING 3.0
- **Estado:** 🟢 PROGRAMADA (PARTITURA ASIGNADA — EJECUTAR AHORA)
- **Archivos objetivo:** `AdminPlanJS_05.html`, `ClaseJS_07.html`, `AyudaJS.html`
- **Referencia lógica interactiva:** Ver [simulador_exelearning.html](file:///g:/Mi%20unidad/PROYECTOS/Lectura/simulador_exelearning.html) en la raíz del proyecto.

---

### 📋 Especificaciones Lógicas y DOM para Cursor:

1. **Gestor del Árbol de Páginas / Jerarquía:**
   - Mantener el array de páginas de la sesión:
     ```javascript
     window.paginasSesionActiva_ = [
       { id: 0, titulo: "1. Saberes Previos y DUA", nivel: 0, idevices: [] },
       ...
     ];
     ```
   - Controladores de eventos del árbol:
     - `agregarNodoSesion_()`: Añade una nueva página y la marca como activa.
     - `eliminarNodoSesion_()`: Elimina la página activa (validando que siempre exista al menos 1 página).
     - `moverNodoSesion_(delta)`: Permite subir (`-1`) o bajar (`+1`) el orden de la página.
     - `cambiarNivelNodoSesion_(delta)`: Permite indentar (`+1`) o desindentar (`-1`) simulando sub-páginas de eXeLearning.
     - `seleccionarNodoSesion_(idx)`: Actualiza la clase `.seleccionado` en el DOM y filtra las Lego Cards en el lienzo central correspondientes a esa página.

2. **Controlador del Menú Acordeón & Despachador de Inserción:**
   - `toggleCatIDevices_(catId)`: Alterna la clase `.abierto` en la categoría correspondiente.
   - `insertariDeviceSesion_(tipo)`:
     - Inserta dinámicamente la tarjeta en el DOM de la página activa.
     - Maneja la barra flotante rápida (`quick-ribbon`) enlazándola a los mismos métodos de inserción.
     - Actualiza el contador dinámico de iDevices.

3. **Soporte de iDevices Curriculares Especiales:**
   - **Inglés:**
     - `tipo === 'listening'`: Genera tarjeta con campo de URL de audio (o síntesis en inglés con acento `en-US`), campo de transcripción opcional y reactivo de comprensión.
     - `tipo === 'pronunciacion'`: Genera tarjeta con frase en inglés a pronunciar y botón para probar reconocimiento de voz (`webkitSpeechRecognition`).
     - `tipo === 'flashcards'`: Genera tarjeta con pares de palabra en inglés, traducción y botón de voz.
   - **Tecnología y Ofimática:**
     - `tipo === 'sim_ofimatica'`: Genera tarjeta con mini grid de hoja de cálculo interactiva (tabla editable con cálculo automático de sumas y fórmulas básicas).
     - `tipo === 'algoritmo'`: Genera tarjeta con secuencia de pasos lógicos (Inicio -> Proceso -> Condición -> Fin).

4. **Persistencia y Serialización:**
   - `serializarIDevicesSesion_()`: Serializa las páginas e iDevices dentro de la propiedad `extra.exelearning` de la sesión.
   - `deserializarIDevicesSesion_(data)`: Restaura las páginas y bloques sin alterar los 4 momentos sintéticos oficiales de la planeación didáctica (Apertura, Desarrollo, Actividad, Cierre).

5. **Protocolo Centinela:**
   - Al terminar de redactar y guardar el código en este buzón, ejecutar de inmediato:
     `node herramientas/centinela_buzon.js cursor`

---

### 📦 ENTREGA DE CURSOR (ESCRIBE TU CÓDIGO JAVASCRIPT AQUÍ ABAJO):

**Estado:** aplicado en fuente. No volver a pegar este bloque si AyudaJS.html ya contiene BUILD-578-CURSOR-INICIO.

- AdminPlanJS_05.html y ClaseJS_07.html guardan extra.exelearning al leer la sesión (window._exelearningPendiente_).
- guionDocenteConEncuestas_() persiste extra.idevicesEncuesta y extra.exelearning.
- serializarIDevicesSesion_() sigue devolviendo solo el guion de voz (sin encuestas ni bloques curriculares) y deja el árbol en window._extraExelearning_.
- deserializarIDevicesSesion_(data) restaura páginas y tarjetas sin modificar Apertura, Desarrollo, Actividad ni Cierre.
- El botón del iDevice encuesta conserva la clase nem-btn-crear-encuesta.

```javascript
/* BUILD-578-CURSOR-INICIO — árbol de páginas, acordeón e iDevices de inglés y ofimática */
var META_TARJETA_EXE_ = {
  objetivos: { badge: 'badge-info', etiqueta: 'INFORMACIÓN', titulo: 'Objetivos de Aprendizaje', cuerpo: 'Describe lo que lograrán los estudiantes al concluir la sesión.' },
  galeria: { badge: 'badge-info', etiqueta: 'INFORMACIÓN', titulo: 'Galería de Imágenes', cuerpo: 'Describe las imágenes y su texto alternativo.' },
  fichero: { badge: 'badge-info', etiqueta: 'INFORMACIÓN', titulo: 'Archivo o Fichero Adjunto', cuerpo: 'Pega el enlace del PDF o de la ficha de trabajo.' },
  vf: { badge: 'badge-eval', etiqueta: 'EVALUACIÓN', titulo: 'Verdadero / Falso', cuerpo: 'Escribe la afirmación y la respuesta esperada.' },
  huecos: { badge: 'badge-eval', etiqueta: 'EVALUACIÓN', titulo: 'Rellenar Huecos', cuerpo: 'Escribe el párrafo y marca los huecos con ____.' },
  rosco: { badge: 'badge-juego', etiqueta: 'JUEGOS', titulo: 'Rosco de Palabras', cuerpo: 'Lista letra y definición, una por línea.' },
  sopa: { badge: 'badge-juego', etiqueta: 'JUEGOS', titulo: 'Sopa de Letras', cuerpo: 'Escribe las palabras a encontrar, una por línea.' },
  adivina: { badge: 'badge-juego', etiqueta: 'JUEGOS', titulo: 'Adivina el Concepto', cuerpo: 'Escribe las pistas, de la más general a la más precisa.' },
  desafio: { badge: 'badge-juego', etiqueta: 'JUEGOS', titulo: 'Desafío / Escape Room', cuerpo: 'Describe las etapas y los candados de la misión.' },
  video_interactivo: { badge: 'badge-interact', etiqueta: 'INTERACTIVO', titulo: 'Vídeo Interactivo', cuerpo: 'Pega la URL del video y la pregunta de la pausa.' },
  embebido: { badge: 'badge-interact', etiqueta: 'INTERACTIVO', titulo: 'Recurso Embebido', cuerpo: 'Pega el enlace de Genially, Canva, H5P o Slides.' },
  geogebra: { badge: 'badge-interact', etiqueta: 'INTERACTIVO', titulo: 'GeoGebra / Simulador', cuerpo: 'Pega el enlace del applet.' },
  listening: { badge: 'badge-ingles', etiqueta: 'INGLÉS', titulo: 'Audio Listening y Comprensión', cuerpo: 'Instrucción para el alumno antes de escuchar.', familia: 'ingles' },
  pronunciacion: { badge: 'badge-ingles', etiqueta: 'INGLÉS', titulo: 'Práctica de Pronunciación', cuerpo: 'Pide al alumno leer la frase en voz alta.', familia: 'ingles' },
  flashcards: { badge: 'badge-ingles', etiqueta: 'INGLÉS', titulo: 'Flashcards Bilingües', cuerpo: 'Repasa cada par y escucha la palabra.', familia: 'ingles' },
  sim_ofimatica: { badge: 'badge-tecnologia', etiqueta: 'TECNOLOGÍA', titulo: 'Hoja de Cálculo', cuerpo: 'Escribe números o fórmulas =SUMA(A1:A3) y =PROMEDIO(A1:A3).', familia: 'tecnologia' },
  algoritmo: { badge: 'badge-tecnologia', etiqueta: 'TECNOLOGÍA', titulo: 'Diagrama de Flujo', cuerpo: 'Ordena el proceso: Inicio, Proceso, Condición y Fin.', familia: 'tecnologia' },
  codigo: { badge: 'badge-tecnologia', etiqueta: 'TECNOLOGÍA', titulo: 'Editor de Código', cuerpo: 'Escribe el pseudocódigo o las instrucciones.', familia: 'tecnologia' },
  formula: { badge: 'badge-ciencias', etiqueta: 'CIENCIAS', titulo: 'Fórmula', cuerpo: 'Escribe la expresión algebraica en texto.' }
};
var ALIAS_IDEVICE_EXE_ = { texto_dua: 'lectura', quiz_evaluativo: 'pregunta', reto_ciencias: 'reto' };
var BASE_IDEVICE_EXE_ = { lectura: 1, pregunta: 1, reto: 1, encuesta: 1 };

function asegurarPaginasExe_() {
  if (!window.paginasSesionActiva_ || !window.paginasSesionActiva_.length) {
    window.paginasSesionActiva_ = [{ id: 0, titulo: '1. Saberes Previos y DUA', nivel: 0, idevices: [] }];
    window._nodoSesionActivo_ = 0;
  }
  if (window._nodoSesionActivo_ == null) window._nodoSesionActivo_ = 0;
}

function idPaginaActivaExe_() {
  asegurarPaginasExe_();
  var p = window.paginasSesionActiva_[window._nodoSesionActivo_] || window.paginasSesionActiva_[0];
  return p ? p.id : 0;
}

function htmlCatalogoExe_() {
  var cats = [
    { id: 'cat-info', titulo: 'Información y presentación', abierto: true, items: [
      ['texto_dua', 'Lectura Guiada DUA'], ['objetivos', 'Objetivos de Clase'], ['galeria', 'Galería de Imágenes'], ['fichero', 'Archivo o Fichero Adjunto']
    ]},
    { id: 'cat-eval', titulo: 'Evaluación y seguimiento', abierto: true, items: [
      ['quiz_evaluativo', 'Quiz Evaluativo (Puntos)'], ['encuesta', 'Encuesta / Diagnóstico'], ['vf', 'Pregunta Verdadero / Falso'], ['huecos', 'Rellenar Huecos']
    ]},
    { id: 'cat-juegos', titulo: 'Juegos', abierto: false, items: [
      ['rosco', 'Rosco de Palabras'], ['sopa', 'Sopa de Letras'], ['adivina', 'Adivina el Concepto'], ['desafio', 'Desafío / Escape Room NEM']
    ]},
    { id: 'cat-interact', titulo: 'Actividades interactivas', abierto: false, items: [
      ['video_interactivo', 'Vídeo Interactivo con Pausas'], ['embebido', 'Embebido Genially / Canva / H5P'], ['geogebra', 'Geogebra / Simulador']
    ]},
    { id: 'cat-ingles', titulo: 'Lengua Extranjera (Inglés)', abierto: false, items: [
      ['listening', 'Audio Listening y Comprensión'], ['pronunciacion', 'Práctica de Pronunciación (Voz)'], ['flashcards', 'Flashcards Bilingües']
    ]},
    { id: 'cat-tecnologia', titulo: 'Tecnología y Ofimática', abierto: false, items: [
      ['sim_ofimatica', 'Práctica de Hoja de Cálculo'], ['algoritmo', 'Diagrama de Flujo / Algoritmo'], ['codigo', 'Editor de Código / Sintaxis']
    ]},
    { id: 'cat-ciencias', titulo: 'Ciencias', abierto: false, items: [
      ['reto_ciencias', 'Problema Matemático Situado'], ['formula', 'Fórmulas']
    ]}
  ];
  return cats.map(function (cat) {
    var items = cat.items.map(function (it) {
      return '<div class="idevice-pill-add" onclick="insertariDeviceSesion_(\'' + it[0] + '\')"><span>' + it[1] + '</span><span class="btn-mas">Añadir</span></div>';
    }).join('');
    return '<div class="cat-group' + (cat.abierto ? ' abierto' : '') + '" id="' + cat.id + '">' +
      '<div class="cat-header" onclick="toggleCatIDevices_(\'' + cat.id + '\')"><div class="cat-header-left"><span>' + cat.titulo + '</span></div><i class="cat-chevron"></i></div>' +
      '<div class="cat-items">' + items + '</div></div>';
  }).join('');
}

function montarEntornoExeLearning_() {
  var seccion = document.querySelector('#editorSesionActiva .nem-seccion-exelearning') || document.querySelector('.nem-seccion-exelearning');
  if (!seccion || document.getElementById('listaNodos')) {
    asegurarPaginasExe_();
    return;
  }
  var workspace = document.createElement('div');
  workspace.className = 'app-workspace';
  workspace.id = 'vistaAutorExe';
  workspace.innerHTML =
    '<aside class="sidebar-exe">' +
      '<div class="box-arbol">' +
        '<div class="arbol-titulo-fila"><div class="doc-titulo"><span id="labelDocTitulo">Sesión</span></div></div>' +
        '<div class="arbol-toolbar">' +
          '<div class="nav-flechas">' +
            '<button type="button" class="nav-btn" title="Subir página" onclick="moverNodoSesion_(-1)">↑</button>' +
            '<button type="button" class="nav-btn" title="Bajar página" onclick="moverNodoSesion_(1)">↓</button>' +
            '<button type="button" class="nav-btn" title="Desindentar" onclick="cambiarNivelNodoSesion_(-1)">←</button>' +
            '<button type="button" class="nav-btn" title="Indentar" onclick="cambiarNivelNodoSesion_(1)">→</button>' +
          '</div>' +
          '<div class="nav-acciones">' +
            '<button type="button" class="btn-action-teal" title="Eliminar página activa" onclick="eliminarNodoSesion_()">✕</button>' +
            '<button type="button" class="btn-action-teal add-node" title="Añadir nueva página" onclick="agregarNodoSesion_()">+</button>' +
          '</div>' +
        '</div>' +
        '<div class="nodos-lista" id="listaNodos"></div>' +
      '</div>' +
      '<div class="box-idevice-menu"><div class="idevice-menu-titulo"><span>iDevices de Aprendizaje</span></div><div class="cat-accordion">' + htmlCatalogoExe_() + '</div></div>' +
    '</aside>' +
    '<main class="canvas-exe"><div class="canvas-container" id="lienzoExeActivo">' +
      '<div class="quick-ribbon" title="Inserción rápida de bloques en la página activa">' +
        '<div class="quick-icons-group">' +
          '<button type="button" class="quick-btn text-icon" title="Lectura DUA" onclick="insertariDeviceSesion_(\'texto_dua\')">T</button>' +
          '<button type="button" class="quick-btn flower-icon" title="Objetivos" onclick="insertariDeviceSesion_(\'objetivos\')">✿</button>' +
          '<button type="button" class="quick-btn checklist-icon" title="Quiz" onclick="insertariDeviceSesion_(\'quiz_evaluativo\')">✓</button>' +
          '<button type="button" class="quick-btn file-icon" title="Archivo" onclick="insertariDeviceSesion_(\'fichero\')">↓</button>' +
          '<button type="button" class="quick-btn gallery-icon" title="Galería" onclick="insertariDeviceSesion_(\'galeria\')">▣</button>' +
        '</div>' +
      '</div>' +
      '<div class="pagina-banner"><div class="pagina-banner-title"><span id="bannerTituloPagina">Página activa</span></div>' +
        '<button type="button" class="btn-edit-title" onclick="renombrarNodoSesion_()">Renombrar</button></div>' +
      '<div id="contadorIdevices">0 bloques</div>' +
    '</div></main>';
  seccion.appendChild(workspace);
  var lienzo = document.getElementById('lienzoExeActivo');
  var barra = seccion.querySelector('.idevice-bar');
  var cont = document.getElementById('contenedorIDevicesDinamicos');
  if (barra && lienzo) lienzo.appendChild(barra);
  if (cont && lienzo) lienzo.appendChild(cont);
  var tit = document.getElementById('sesTitulo');
  var label = document.getElementById('labelDocTitulo');
  if (label && tit && tit.value) label.textContent = tit.value;
  asegurarPaginasExe_();
  renderArbolSesion_();
}

function renderArbolSesion_() {
  asegurarPaginasExe_();
  var cont = document.getElementById('listaNodos');
  if (!cont) return;
  var activo = window._nodoSesionActivo_ || 0;
  cont.innerHTML = '';
  window.paginasSesionActiva_.forEach(function (n, i) {
    var div = document.createElement('div');
    div.className = 'nodo-item' + (i === activo ? ' seleccionado' : '');
    div.style.marginLeft = ((n.nivel || 0) * 16) + 'px';
    div.onclick = function () { seleccionarNodoSesion_(i); };
    var cuenta = contarBloquesPaginaExe_(n.id);
    div.innerHTML = '<span>' + (n.titulo || ('Página ' + (i + 1))) + '</span><span class="nodo-tag">' + (i === activo ? 'Activa' : (cuenta + ' iDev')) + '</span>';
    cont.appendChild(div);
  });
  var banner = document.getElementById('bannerTituloPagina');
  var pag = window.paginasSesionActiva_[activo];
  if (banner && pag) banner.textContent = pag.titulo + ' (Página activa)';
  actualizarContadorIDevicesExe_();
}

function contarBloquesPaginaExe_(paginaId) {
  var cont = document.getElementById('contenedorIDevicesDinamicos');
  if (!cont) return 0;
  var n = 0;
  cont.querySelectorAll('.idevice-card').forEach(function (card) {
    var pid = card.getAttribute('data-pagina-id');
    if (pid == null || pid === '' || String(pid) === String(paginaId)) n += 1;
  });
  return n;
}

function aplicarFiltroPaginaExe_() {
  var cont = document.getElementById('contenedorIDevicesDinamicos');
  if (!cont) return;
  var activa = String(idPaginaActivaExe_());
  cont.querySelectorAll('.idevice-card').forEach(function (card) {
    var pid = card.getAttribute('data-pagina-id');
    if (!pid) card.setAttribute('data-pagina-id', activa);
    card.style.display = String(card.getAttribute('data-pagina-id')) === activa ? '' : 'none';
  });
}

function actualizarContadorIDevicesExe_() {
  var el = document.getElementById('contadorIdevices');
  if (!el) return;
  var cont = document.getElementById('contenedorIDevicesDinamicos');
  var n = 0;
  if (cont) {
    cont.querySelectorAll('.idevice-card').forEach(function (card) {
      if (card.style.display !== 'none') n += 1;
    });
  }
  el.textContent = n + (n === 1 ? ' bloque' : ' bloques');
}

function agregarNodoSesion_() {
  asegurarPaginasExe_();
  var lista = window.paginasSesionActiva_;
  var id = lista.reduce(function (m, p) { return Math.max(m, Number(p.id) || 0); }, 0) + 1;
  lista.push({ id: id, titulo: (lista.length + 1) + '. Nueva Página', nivel: 0, idevices: [] });
  window._nodoSesionActivo_ = lista.length - 1;
  renderArbolSesion_();
  aplicarFiltroPaginaExe_();
}

function eliminarNodoSesion_() {
  asegurarPaginasExe_();
  var lista = window.paginasSesionActiva_;
  if (lista.length <= 1) {
    if (typeof toast === 'function') toast('Debe existir al menos una página en la sesión.', 'error');
    return;
  }
  var idx = window._nodoSesionActivo_ || 0;
  var id = String(lista[idx].id);
  var cont = document.getElementById('contenedorIDevicesDinamicos');
  if (cont) {
    cont.querySelectorAll('.idevice-card').forEach(function (card) {
      if (String(card.getAttribute('data-pagina-id')) === id) card.remove();
    });
  }
  lista.splice(idx, 1);
  window._nodoSesionActivo_ = Math.max(0, idx - 1);
  renderArbolSesion_();
  aplicarFiltroPaginaExe_();
}

function moverNodoSesion_(delta) {
  asegurarPaginasExe_();
  var lista = window.paginasSesionActiva_;
  var idx = window._nodoSesionActivo_ || 0;
  var destino = idx + delta;
  if (destino < 0 || destino >= lista.length) return;
  var tmp = lista[idx];
  lista[idx] = lista[destino];
  lista[destino] = tmp;
  window._nodoSesionActivo_ = destino;
  renderArbolSesion_();
}

function cambiarNivelNodoSesion_(delta) {
  asegurarPaginasExe_();
  var pag = window.paginasSesionActiva_[window._nodoSesionActivo_ || 0];
  if (!pag) return;
  pag.nivel = Math.max(0, Math.min(2, (pag.nivel || 0) + delta));
  renderArbolSesion_();
}

function seleccionarNodoSesion_(idx) {
  asegurarPaginasExe_();
  if (idx < 0 || idx >= window.paginasSesionActiva_.length) return;
  window._nodoSesionActivo_ = idx;
  renderArbolSesion_();
  aplicarFiltroPaginaExe_();
  actualizarContadorIDevicesExe_();
}

function renombrarNodoSesion_() {
  asegurarPaginasExe_();
  var pag = window.paginasSesionActiva_[window._nodoSesionActivo_ || 0];
  if (!pag || typeof prompt !== 'function') return;
  var nuevo = prompt('Título de la página', pag.titulo || '');
  if (nuevo && String(nuevo).trim()) {
    pag.titulo = String(nuevo).trim();
    renderArbolSesion_();
  }
}

function toggleCatIDevices_(catId) {
  var el = document.getElementById(catId);
  if (el) el.classList.toggle('abierto');
}

function campoTarjetaExe_(card, nombre) {
  return card.querySelector('[data-campo="' + nombre + '"]') || card.querySelector('.idevice-campo-' + nombre);
}

function hablarInglesExe_(texto) {
  if (!texto || !window.speechSynthesis) return;
  var u = new SpeechSynthesisUtterance(String(texto));
  u.lang = 'en-US';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

function reproducirListeningExe_(btn) {
  var card = btn && btn.closest ? btn.closest('.idevice-card') : null;
  if (!card) return;
  var url = ((card.querySelector('.inp-audio-url') || {}).value || '').trim();
  if (url) {
    try { new Audio(url).play(); return; } catch (e) {}
  }
  var texto = ((card.querySelector('.txt-transcripcion') || {}).value || '').trim();
  if (!texto) texto = ((campoTarjetaExe_(card, 'titulo') || {}).value || '').trim();
  hablarInglesExe_(texto);
}

function probarPronunciacionExe_(btn) {
  var card = btn && btn.closest ? btn.closest('.idevice-card') : null;
  if (!card) return;
  var SR = window.webkitSpeechRecognition || window.SpeechRecognition;
  if (!SR) {
    if (typeof toast === 'function') toast('Este navegador no tiene reconocimiento de voz.', 'error');
    return;
  }
  var rec = new SR();
  rec.lang = 'en-US';
  rec.onresult = function (ev) {
    var dicho = ev.results && ev.results[0] && ev.results[0][0] ? ev.results[0][0].transcript : '';
    var out = card.querySelector('.txt-reconocido');
    if (out) out.value = dicho;
  };
  rec.start();
}

function agregarParFlashcard_(origen, par) {
  var card = origen && origen.closest ? origen.closest('.idevice-card') : origen;
  var lista = card && card.querySelector ? card.querySelector('.lista-flashcards') : null;
  if (!lista) return;
  var fila = document.createElement('div');
  fila.className = 'fila-flashcard';
  fila.innerHTML = '<input type="text" class="campo-input inp-palabra" placeholder="Word in English">' +
    '<input type="text" class="campo-input inp-traduccion" placeholder="Traducción">' +
    '<button type="button" class="nem-btn-accion" onclick="hablarFlashcardExe_(this)">Escuchar</button>';
  if (par) {
    fila.querySelector('.inp-palabra').value = par.palabra || '';
    fila.querySelector('.inp-traduccion').value = par.traduccion || '';
  }
  lista.appendChild(fila);
}

function hablarFlashcardExe_(btn) {
  var fila = btn && btn.closest ? btn.closest('.fila-flashcard') : null;
  if (fila) {
    hablarInglesExe_((fila.querySelector('.inp-palabra') || {}).value || '');
    return;
  }
  var card = btn && btn.closest ? btn.closest('.idevice-card') : null;
  hablarInglesExe_(card ? ((card.querySelector('.txt-frase-ingles') || {}).value || '') : '');
}

function refsRangoExe_(desde, hasta) {
  var cols = ['A', 'B', 'C', 'D'];
  var a = /^([A-D])(\d+)$/.exec(String(desde || '').toUpperCase());
  var b = /^([A-D])(\d+)$/.exec(String(hasta || '').toUpperCase());
  if (!a || !b) return [];
  var c1 = cols.indexOf(a[1]);
  var c2 = cols.indexOf(b[1]);
  var r1 = parseInt(a[2], 10);
  var r2 = parseInt(b[2], 10);
  var refs = [];
  for (var c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) {
    for (var r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) refs.push(cols[c] + r);
  }
  return refs;
}

function numeroCeldaExe_(mapa, ref, pila) {
  if (pila[ref]) return 0;
  pila[ref] = true;
  var raw = mapa[ref];
  if (raw == null) return 0;
  var s = String(raw).trim().replace(',', '.');
  if (s.charAt(0) === '=') return evaluarFormulaExe_(s.slice(1), mapa, pila);
  var n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function evaluarFormulaExe_(expr, mapa, pila) {
  var texto = String(expr || '').replace(/\s+/g, '').toUpperCase();
  var rango = /^(SUMA|PROMEDIO)\(([A-D]\d+):([A-D]\d+)\)$/.exec(texto);
  if (rango) {
    var refs = refsRangoExe_(rango[2], rango[3]);
    var nums = refs.map(function (ref) { return numeroCeldaExe_(mapa, ref, pila); });
    var suma = nums.reduce(function (a, b) { return a + b; }, 0);
    return rango[1] === 'PROMEDIO' ? (nums.length ? suma / nums.length : 0) : suma;
  }
  if (!/^[A-D0-9+\-.]+$/.test(texto)) return 0;
  var partes = texto.split(/([+\-])/);
  var total = 0;
  var signo = 1;
  partes.forEach(function (parte) {
    if (parte === '+') signo = 1;
    else if (parte === '-') signo = -1;
    else if (parte) {
      var val = /^[A-D]\d+$/.test(parte) ? numeroCeldaExe_(mapa, parte, pila) : parseFloat(parte);
      if (!isNaN(val)) total += signo * val;
    }
  });
  return total;
}

function recalcularHojaExe_(input) {
  var tabla = input && input.closest ? input.closest('.hoja-ofimatica') : null;
  if (!tabla) return;
  var mapa = {};
  tabla.querySelectorAll('.celda-hoja').forEach(function (celda) {
    mapa[celda.getAttribute('data-ref')] = celda.value || '';
  });
  tabla.querySelectorAll('.celda-hoja').forEach(function (celda) {
    var salida = celda.parentNode ? celda.parentNode.querySelector('.celda-resultado') : null;
    var valor = String(celda.value || '').trim();
    if (!salida) return;
    if (valor.charAt(0) === '=') {
      var n = evaluarFormulaExe_(valor.slice(1), mapa, {});
      salida.textContent = Math.round(n * 100) / 100;
    } else salida.textContent = '';
  });
}

function htmlEspecialExe_(tipo) {
  if (tipo === 'listening') {
    return '<label>URL del audio</label><input type="url" class="campo-input inp-audio-url" placeholder="https://...mp3">' +
      '<label>Transcripción (opcional)</label><textarea class="campo-textarea txt-transcripcion" rows="2"></textarea>' +
      '<button type="button" class="nem-btn-accion" onclick="reproducirListeningExe_(this)">Escuchar en inglés</button>' +
      '<label>Reactivo de comprensión</label><textarea class="campo-textarea txt-reactivo" rows="2"></textarea>';
  }
  if (tipo === 'pronunciacion') {
    return '<label>Frase en inglés</label><input type="text" class="campo-input txt-frase-ingles" placeholder="The carpenter measures one half meter.">' +
      '<button type="button" class="nem-btn-accion" onclick="hablarFlashcardExe_(this)">Escuchar modelo</button>' +
      '<button type="button" class="nem-btn-accion" onclick="probarPronunciacionExe_(this)">Probar con el micrófono</button>' +
      '<label>Lo que se reconoció</label><textarea class="campo-textarea txt-reconocido" rows="2" readonly></textarea>';
  }
  if (tipo === 'flashcards') {
    return '<div class="lista-flashcards"></div><button type="button" class="nem-btn-accion" onclick="agregarParFlashcard_(this)">Añadir par</button>';
  }
  if (tipo === 'sim_ofimatica') {
    var cols = ['A', 'B', 'C', 'D'];
    var html = '<table class="hoja-ofimatica"><thead><tr><th></th>';
    cols.forEach(function (c) { html += '<th>' + c + '</th>'; });
    html += '</tr></thead><tbody>';
    for (var r = 1; r <= 4; r++) {
      html += '<tr><th>' + r + '</th>';
      cols.forEach(function (c) {
        html += '<td><input class="campo-input celda-hoja" data-ref="' + c + r + '" oninput="recalcularHojaExe_(this)"><span class="celda-resultado"></span></td>';
      });
      html += '</tr>';
    }
    return html + '</tbody></table>';
  }
  if (tipo === 'algoritmo') {
    return '<label>Inicio</label><input type="text" class="campo-input paso-algoritmo" data-paso="inicio">' +
      '<label>Proceso</label><input type="text" class="campo-input paso-algoritmo" data-paso="proceso">' +
      '<label>Condición</label><input type="text" class="campo-input paso-algoritmo" data-paso="condicion">' +
      '<label>Fin</label><input type="text" class="campo-input paso-algoritmo" data-paso="fin">';
  }
  return '';
}

function crearTarjetaCurricular_(tipo, datos) {
  var meta = META_TARJETA_EXE_[tipo];
  if (!meta) return null;
  var cont = document.getElementById('contenedorIDevicesDinamicos');
  if (!cont) return null;
  datos = datos || {};
  window._seqIDeviceExe_ = (window._seqIDeviceExe_ || 0) + 1;
  var id = (datos.id && !document.getElementById(datos.id)) ? datos.id : ('idevice_' + Date.now() + '_' + window._seqIDeviceExe_);
  var div = document.createElement('div');
  div.id = id;
  div.setAttribute('data-tipo', tipo);
  div.className = 'idevice-card idevice-bloque idevice-container' + (meta.familia === 'ingles' ? ' idevice-ingles' : '') + (meta.familia === 'tecnologia' ? ' idevice-tecnologia' : '');
  var badge = meta.badge + (meta.familia === 'ingles' ? ' badge-ingles' : '') + (meta.familia === 'tecnologia' ? ' badge-tecnologia' : '');
  div.innerHTML =
    '<div class="idevice-header idevice-card-header"><div class="idevice-card-title"><span class="badge ' + badge + '">' + meta.etiqueta + '</span><span class="idevice-tag">' + meta.titulo + '</span></div>' +
    '<button type="button" class="idevice-btn" onclick="eliminarIDeviceCard_(this)">Quitar</button></div>' +
    '<div class="idevice-body idevice-card-body">' +
      '<input type="text" class="campo-input idevice-campo-titulo" data-campo="titulo" value="">' +
      '<textarea class="campo-textarea idevice-campo-cuerpo" data-campo="cuerpo" rows="2"></textarea>' +
      htmlEspecialExe_(tipo) +
    '</div>';
  var titulo = campoTarjetaExe_(div, 'titulo');
  var cuerpo = campoTarjetaExe_(div, 'cuerpo');
  if (titulo) titulo.value = datos.titulo || meta.titulo;
  if (cuerpo) cuerpo.value = datos.cuerpo || meta.cuerpo;
  cont.appendChild(div);
  if (tipo === 'flashcards') agregarParFlashcard_(div, null);
  return div;
}

function ultimaTarjetaExe_() {
  var cont = document.getElementById('contenedorIDevicesDinamicos');
  if (!cont) return null;
  var cards = cont.querySelectorAll('.idevice-card');
  return cards.length ? cards[cards.length - 1] : null;
}

function leerTarjetaExe_(card) {
  var tipo = card.getAttribute('data-tipo') || '';
  var tituloEl = campoTarjetaExe_(card, 'titulo');
  var cuerpoEl = campoTarjetaExe_(card, 'cuerpo');
  var extra = {};
  if (tipo === 'listening') {
    extra = {
      audioUrl: ((card.querySelector('.inp-audio-url') || {}).value || ''),
      transcripcion: ((card.querySelector('.txt-transcripcion') || {}).value || ''),
      reactivo: ((card.querySelector('.txt-reactivo') || {}).value || '')
    };
  } else if (tipo === 'pronunciacion') {
    extra = {
      frase: ((card.querySelector('.txt-frase-ingles') || {}).value || ''),
      reconocido: ((card.querySelector('.txt-reconocido') || {}).value || '')
    };
  } else if (tipo === 'flashcards') {
    extra = { pares: [] };
    card.querySelectorAll('.fila-flashcard').forEach(function (fila) {
      extra.pares.push({
        palabra: ((fila.querySelector('.inp-palabra') || {}).value || ''),
        traduccion: ((fila.querySelector('.inp-traduccion') || {}).value || '')
      });
    });
  } else if (tipo === 'sim_ofimatica') {
    extra = { celdas: {} };
    card.querySelectorAll('.celda-hoja').forEach(function (celda) {
      extra.celdas[celda.getAttribute('data-ref')] = celda.value || '';
    });
  } else if (tipo === 'algoritmo') {
    extra = {};
    card.querySelectorAll('.paso-algoritmo').forEach(function (inp) {
      extra[inp.getAttribute('data-paso')] = inp.value || '';
    });
  } else if (tipo === 'encuesta' && typeof serializarEncuestaIDevice_ === 'function') {
    try { extra = JSON.parse(serializarEncuestaIDevice_(card)); } catch (e) { extra = {}; }
  }
  return {
    id: card.id,
    tipo: tipo,
    paginaId: card.getAttribute('data-pagina-id') || String(idPaginaActivaExe_()),
    titulo: tituloEl ? tituloEl.value : '',
    cuerpo: cuerpoEl ? cuerpoEl.value : '',
    extra: extra
  };
}

function rellenarTarjetaExe_(card, datos) {
  if (!card || !datos) return;
  var titulo = campoTarjetaExe_(card, 'titulo');
  var cuerpo = campoTarjetaExe_(card, 'cuerpo');
  if (titulo && datos.titulo) titulo.value = datos.titulo;
  if (cuerpo && datos.cuerpo) cuerpo.value = datos.cuerpo;
  var extra = datos.extra || {};
  var tipo = card.getAttribute('data-tipo');
  if (tipo === 'listening') {
    var url = card.querySelector('.inp-audio-url');
    var tx = card.querySelector('.txt-transcripcion');
    var rx = card.querySelector('.txt-reactivo');
    if (url) url.value = extra.audioUrl || '';
    if (tx) tx.value = extra.transcripcion || '';
    if (rx) rx.value = extra.reactivo || '';
  } else if (tipo === 'pronunciacion') {
    var frase = card.querySelector('.txt-frase-ingles');
    var rec = card.querySelector('.txt-reconocido');
    if (frase) frase.value = extra.frase || '';
    if (rec) rec.value = extra.reconocido || '';
  } else if (tipo === 'flashcards') {
    var lista = card.querySelector('.lista-flashcards');
    if (lista) lista.innerHTML = '';
    (extra.pares || []).forEach(function (par) { agregarParFlashcard_(card, par); });
    if (!extra.pares || !extra.pares.length) agregarParFlashcard_(card, null);
  } else if (tipo === 'sim_ofimatica') {
    card.querySelectorAll('.celda-hoja').forEach(function (celda) {
      var ref = celda.getAttribute('data-ref');
      if (extra.celdas && extra.celdas[ref] != null) celda.value = extra.celdas[ref];
    });
    var primera = card.querySelector('.celda-hoja');
    if (primera) recalcularHojaExe_(primera);
  } else if (tipo === 'algoritmo') {
    card.querySelectorAll('.paso-algoritmo').forEach(function (inp) {
      var paso = inp.getAttribute('data-paso');
      if (extra[paso] != null) inp.value = extra[paso];
    });
  } else if (tipo === 'encuesta') {
    var modoSel = card.querySelector('.sel-modo-encuesta-idevice');
    if (modoSel && extra.modo) {
      modoSel.value = extra.modo;
      if (typeof conmutarModoEncuestaiDevice_ === 'function') conmutarModoEncuestaiDevice_(modoSel);
    }
    var resumen = card.querySelector('.txt-resumen-encuesta');
    if (resumen) resumen.value = extra.resumen || '';
    var graf = card.querySelector('.chk-incluir-graficas');
    if (graf) graf.checked = extra.incluirGraficas !== false;
    var pond = card.querySelector('.inp-ponderacion-encuesta');
    if (pond && extra.ponderacion) pond.value = extra.ponderacion;
    var reg = card.querySelector('.sel-registro-modo');
    if (reg && extra.registro) reg.value = extra.registro;
    if (typeof cargarCatalogoEnSelectiDevice_ === 'function') cargarCatalogoEnSelectiDevice_(card.id, extra.idEncuesta || '');
  }
}

function insertarBloqueExe_(tipo, datos, paginaId) {
  var t = String(tipo || '').toLowerCase();
  var base = ALIAS_IDEVICE_EXE_[t] || t;
  var antes = document.querySelectorAll('#contenedorIDevicesDinamicos .idevice-card').length;
  if (BASE_IDEVICE_EXE_[base] && typeof window._insertariDeviceOriginal_ === 'function') {
    window._insertariDeviceOriginal_(base);
  }
  var card = null;
  if (document.querySelectorAll('#contenedorIDevicesDinamicos .idevice-card').length > antes) {
    card = ultimaTarjetaExe_();
  } else if (META_TARJETA_EXE_[t]) {
    card = crearTarjetaCurricular_(t, datos);
  }
  if (!card) return null;
  card.setAttribute('data-pagina-id', String(paginaId != null ? paginaId : idPaginaActivaExe_()));
  if (datos) rellenarTarjetaExe_(card, datos);
  return card;
}

function capturarEstadoExe_() {
  asegurarPaginasExe_();
  var paginas = window.paginasSesionActiva_.map(function (p) {
    return { id: p.id, titulo: p.titulo, nivel: p.nivel || 0, idevices: [] };
  });
  var porId = {};
  paginas.forEach(function (p) { porId[String(p.id)] = p; });
  var cont = document.getElementById('contenedorIDevicesDinamicos');
  if (cont) {
    cont.querySelectorAll('.idevice-card').forEach(function (card) {
      var bloque = leerTarjetaExe_(card);
      var dest = porId[String(bloque.paginaId)] || paginas[0];
      if (dest) dest.idevices.push(bloque);
    });
  }
  var estado = { paginas: paginas, nodoActivo: window._nodoSesionActivo_ || 0 };
  window._extraExelearning_ = estado;
  return estado;
}

function deserializarIDevicesSesion_(data) {
  if (!data || !data.paginas || !data.paginas.length) return;
  var momentos = ['sesApertura', 'sesDesarrollo', 'sesActividad', 'sesCierre'].map(function (id) {
    var el = document.getElementById(id);
    return { el: el, valor: el ? el.value : null };
  });
  window.paginasSesionActiva_ = data.paginas.map(function (p, i) {
    return {
      id: p.id != null ? p.id : i,
      titulo: p.titulo || ('Página ' + (i + 1)),
      nivel: Math.max(0, Math.min(2, Number(p.nivel) || 0)),
      idevices: []
    };
  });
  window._nodoSesionActivo_ = Math.max(0, Math.min(window.paginasSesionActiva_.length - 1, Number(data.nodoActivo) || 0));
  var trabajos = [];
  data.paginas.forEach(function (p, i) {
    var paginaId = window.paginasSesionActiva_[i] ? window.paginasSesionActiva_[i].id : i;
    (p.idevices || []).forEach(function (bloque) { trabajos.push({ paginaId: paginaId, bloque: bloque }); });
  });
  var cont = document.getElementById('contenedorIDevicesDinamicos');
  if (cont) cont.querySelectorAll('.idevice-card').forEach(function (n) { n.remove(); });
  window._st90RestaurandoExe_ = true;
  window._st90RestaurandoEnc_ = true;
  trabajos.forEach(function (job) {
    insertarBloqueExe_(job.bloque.tipo, job.bloque, job.paginaId);
  });
  window._st90RestaurandoEnc_ = false;
  window._st90RestaurandoExe_ = false;
  renderArbolSesion_();
  aplicarFiltroPaginaExe_();
  momentos.forEach(function (m) {
    if (m.el && m.valor != null && m.el.value !== m.valor) m.el.value = m.valor;
  });
}

function engancharOla578_() {
  montarEntornoExeLearning_();
  if (typeof window.insertariDeviceSesion_ === 'function' && !window.insertariDeviceSesion_._st90Exe) {
    window._insertariDeviceOriginal_ = window.insertariDeviceSesion_;
    window.insertariDeviceSesion_ = function (tipo) {
      var card = insertarBloqueExe_(tipo, null, idPaginaActivaExe_());
      aplicarFiltroPaginaExe_();
      actualizarContadorIDevicesExe_();
      if (card && card.scrollIntoView) card.scrollIntoView({ block: 'nearest' });
      return card;
    };
    window.insertariDeviceSesion_._st90Exe = true;
  }
  if (typeof window.serializarIDevicesSesion_ === 'function' && !window.serializarIDevicesSesion_._st90Exe) {
    var previaSer = window.serializarIDevicesSesion_;
    window.serializarIDevicesSesion_ = function () {
      var texto = previaSer.apply(this, arguments);
      capturarEstadoExe_();
      return texto;
    };
    window.serializarIDevicesSesion_._st90Exe = true;
  }
  if (typeof window.eliminarIDeviceCard_ === 'function' && !window.eliminarIDeviceCard_._st90Exe) {
    var previaDel = window.eliminarIDeviceCard_;
    window.eliminarIDeviceCard_ = function (btn) {
      previaDel(btn);
      actualizarContadorIDevicesExe_();
      renderArbolSesion_();
    };
    window.eliminarIDeviceCard_._st90Exe = true;
  }
  if (typeof seleccionarSesionNEM === 'function' && !seleccionarSesionNEM._st90Exe) {
    var previaSel = seleccionarSesionNEM;
    seleccionarSesionNEM = function (idx) {
      var r = previaSel.apply(this, arguments);
      if (window._exelearningPendiente_) {
        deserializarIDevicesSesion_(window._exelearningPendiente_);
        window._exelearningPendiente_ = null;
      }
      return r;
    };
    seleccionarSesionNEM._st90Exe = true;
    window.seleccionarSesionNEM = seleccionarSesionNEM;
  }
}

window.agregarNodoSesion_ = agregarNodoSesion_;
window.eliminarNodoSesion_ = eliminarNodoSesion_;
window.moverNodoSesion_ = moverNodoSesion_;
window.cambiarNivelNodoSesion_ = cambiarNivelNodoSesion_;
window.seleccionarNodoSesion_ = seleccionarNodoSesion_;
window.renombrarNodoSesion_ = renombrarNodoSesion_;
window.toggleCatIDevices_ = toggleCatIDevices_;
window.reproducirListeningExe_ = reproducirListeningExe_;
window.probarPronunciacionExe_ = probarPronunciacionExe_;
window.agregarParFlashcard_ = agregarParFlashcard_;
window.hablarFlashcardExe_ = hablarFlashcardExe_;
window.recalcularHojaExe_ = recalcularHojaExe_;
window.capturarEstadoExe_ = capturarEstadoExe_;
window.deserializarIDevicesSesion_ = deserializarIDevicesSesion_;
window.montarEntornoExeLearning_ = montarEntornoExeLearning_;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', engancharOla578_);
} else {
  engancharOla578_();
}
/* BUILD-578-CURSOR-FIN */
```


---

## 🎯 PARTITURA ASIGNADA: OLA 12.1 — CENTINELA CONTINUO
- Estado: 🟢 PROGRAMADA (PARTITURA ASIGNADA — EJECUTAR AHORA)

Tarea única para Cursor:
1. Leer esta partitura y ESTADO_COORDINACION.md.
2. Ejecutar node herramientas/centinela_buzon.js cursor --intervalo=60 --max-ciclos=0 desde la raíz del proyecto.
3. No modificar el constructor ni los .gs. No hacer clasp push.
4. Guardar en ENTREGA_CURSOR.md una sección ## ✅ ENTREGA CURSOR — Ola 12.1 confirmando que la guardia continua quedó arrancada.
