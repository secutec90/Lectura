# BUZÓN DE ENTREGA: CURSOR (FRONTEND JS / DOM)

> **Instrucciones para Cursor:**
> Escribe aquí tu informe técnico, el código JavaScript y los controladores del DOM de tu tarea asignada según `ESTADO_COORDINACION.md`.
> Genera tu bloque de cierre conforme a `.cursor/rules/control-cambios.mdc`.
> Una vez que guardes este archivo, el usuario notificará a Antigravity para que proceda a auditarlo e integrarlo en el código del proyecto.

**Estado del buzón:** entregado el 2026-10-29 (America/Monterrey).
**Agente:** Cursor, ingeniero frontend.
**Sprint:** Planeación didáctica — iDevices dinámicos y validación de los cuatro momentos.
**Archivos de trabajo:** `AdminPlanJS_06.html`, `AdminPlaneacion.html`.

**Nota para Antigravity:** este código ya está aplicado en esos dos archivos. La copia de abajo es la referencia de auditoría. No vuelvas a pegar el bloque si `insertariDeviceSesion_`, `rehidratarIDevicesDesdeGuion_` y el cierre `engancharGuardadoSesionIDevice_` ya existen. No hubo `git commit`, `git push` ni `clasp push`.

---

## 1. Informe

El guardado de la sesión activa ya no sale con los cuatro momentos vacíos, y los iDevices viajan dentro del guion que escucha el alumno.

Al insertar Lectura, Pregunta o Reto, la tarjeta entra en `#contenedorIDevicesDinamicos` con id `idevice_` más la marca de tiempo, botón Quitar y los campos de título y texto. Al guardar, o al regenerar el guion, ese contenido se escribe en `#sesGuionEstudiante`, entre las marcas `--- iDevices de la sesión ---` y `--- fin iDevices ---`. Al volver a abrir la sesión, las tarjetas se reconstruyen desde ese bloque, así que editar un texto no lo pierde.

Si falta Apertura, Desarrollo, Actividad o Cierre, el campo se marca, recibe el foco y aparece el toast azul de la esquina (`#st90-toast`, sin clase `.error`). El guardado se detiene, y con él la opción Publicar ahora, porque ambas salen de `guardarSesionActiva()`.

Los identificadores que lee el editor siguen siendo `#sesApertura`, `#sesDesarrollo`, `#sesActividad` y `#sesCierre`. El nombre del contrato quedó como `data-alias` (`planApertura`, `planDesarrollo`, `planActividad`, `planCierre`) para no romper el guardado de `AdminPlanJS_05.html`, que lee los id `ses*`.

La sintaxis del script quedó revisada con `node --check`. El panel en vivo no se ejerció: corre en el despliegue de Apps Script.

### Contrato del DOM

| Pieza | Selector | Quién lo usa |
| --- | --- | --- |
| Contenedor de tarjetas | `#contenedorIDevicesDinamicos` | `insertariDeviceSesion_`, `serializarIDevicesSesion_`, `rehidratarIDevicesDesdeGuion_` |
| Guion accesible | `#sesGuionEstudiante` | `volcarIDevicesEnGuion_`. El backend lo persiste como `guionEstudianteAccesible` |
| Momentos | `#sesApertura`, `#sesDesarrollo`, `#sesActividad`, `#sesCierre` | Validación. Alias: `data-alias="planApertura"` y equivalentes |
| Alta de bloques | `.idevice-btn--lectura`, `.idevice-btn--pregunta`, `.idevice-btn--reto` | `onclick="insertariDeviceSesion_('lectura'|'pregunta'|'reto')"` ya presente en `AdminPlaneacion.html` |
| Guardar | botón que llama `guardarSesionActiva()` | El cierre envuelve esa función |

Clases usadas, todas ya existentes: `.idevice-card`, `.idevice-card-audio`, `.idevice-btn`, `.idevice-container`, `.idevice-header`, `.idevice-tag`, `.idevice-body`, `.idevice-audio-bar`, `.idevice-lectura`, `.idevice-pregunta`, `.idevice-desafio`. No se inventaron clases nuevas ni se tocaron archivos `.gs`.

### Formato serializado

```text
--- iDevices de la sesión ---
#### Lectura guiada: Título
Párrafo que se lee en voz alta.

#### Pregunta formativa: Título
Retroalimentación.

#### Desafío práctico: Título
Instrucciones.
--- fin iDevices ---
```

Una tarjeta sin título y sin cuerpo no entra al guion. El lector acepta la etiqueta nueva (`Lectura guiada`) y el nombre anterior (`lectura guiada`), para no perder bloques ya guardados.

### Qué hace cada controlador

- `pintarTarjetaIDevice_(tipo, datos)` arma la tarjeta, el id único y el botón Quitar.
- `insertariDeviceSesion_(tipo)` la agrega al contenedor, enfoca el título y avisa con toast.
- `eliminarIDeviceCard_(btn)` quita la tarjeta `.idevice-card` y devuelve el foco a la barra.
- `serializarIDevicesSesion_()` y `volcarIDevicesEnGuion_()` escriben o reemplazan el bloque marcado dentro de `#sesGuionEstudiante`.
- `rehidratarIDevicesDesdeGuion_()` reconstruye las tarjetas al elegir sesión y deja la bandera de cambios en falso.
- `validarMomentosSesionAntesDeGuardar_()` exige los cuatro momentos, marca el vacío y muestra el toast ST90.
- `engancharGuardadoSesionIDevice_()` envuelve `guardarSesionActiva`, `generarGuionDesdeMomentos` y `seleccionarSesionNEM` sin reescribir `AdminPlanJS_05.html`.

### Ajustes de marcado en `AdminPlaneacion.html`

```html
<div id="contenedorIDevicesDinamicos" aria-live="polite" aria-label="Bloques iDevice de la sesión"></div>

<textarea id="sesApertura" data-alias="planApertura" aria-required="true"></textarea>
<textarea id="sesDesarrollo" data-alias="planDesarrollo" aria-required="true"></textarea>
<textarea id="sesActividad" data-alias="planActividad" aria-required="true"></textarea>
<textarea id="sesCierre" data-alias="planCierre" aria-required="true"></textarea>
```

Los `placeholder` y el resto del marcado de cada momento no cambiaron.

---

## 2. Controladores JS

Ubicación en el fuente: `AdminPlanJS_06.html`, dentro del `<script>` ya incluido por `Admin.html` después de `AdminPlanJS_05`. El cierre se ejecuta al cargar, cuando `guardarSesionActiva` y `seleccionarSesionNEM` ya existen.

```javascript
var seqIDevice_ = 0;
var idevicesTocados_ = false;
var MARCA_IDEVICES_INI_ = '--- iDevices de la sesión ---';
var MARCA_IDEVICES_FIN_ = '--- fin iDevices ---';
var META_IDEVICE_ = {
  lectura: {
    nombre: 'lectura guiada',
    etiqueta: 'Lectura guiada',
    variante: 'idevice-lectura',
    phTitulo: 'Título de la lectura breve...',
    phCuerpo: 'Escribe el párrafo que los alumnos leerán y escucharán...'
  },
  pregunta: {
    nombre: 'pregunta formativa',
    etiqueta: 'Pregunta formativa',
    variante: 'idevice-pregunta',
    phTitulo: '¿Qué pregunta detonadora plantearás a los estudiantes?',
    phCuerpo: 'Retroalimentación formativa y criterios esperados de respuesta...'
  },
  reto: {
    nombre: 'desafío práctico',
    etiqueta: 'Desafío práctico',
    variante: 'idevice-desafio',
    phTitulo: 'Nombre del reto o producto esperado de la sesión...',
    phCuerpo: 'Instrucciones paso a paso del reto y cómo impacta en el aula o la comunidad...'
  }
};

function nuevoIdIDevice_() {
  seqIDevice_ += 1;
  var id = 'idevice_' + Date.now();
  if (document.getElementById(id)) id += '_' + seqIDevice_;
  return id;
}

function marcarIDevicesTocados_() {
  idevicesTocados_ = true;
}

function eliminarIDeviceCard_(btn) {
  if (!btn || !btn.closest) return;
  const c = btn.closest('.idevice-card');
  if (!c) return;
  marcarIDevicesTocados_();
  c.remove();
  const barra = document.querySelector('#editorSesionActiva .idevice-bar .idevice-btn');
  if (barra && barra.focus) barra.focus();
}

function pintarTarjetaIDevice_(tipo, datos) {
  const tipoNorm = String(tipo || '').toLowerCase();
  const meta = META_IDEVICE_[tipoNorm];
  if (!meta) return null;
  datos = datos || {};

  const idUnico = (datos.id && !document.getElementById(datos.id)) ? datos.id : nuevoIdIDevice_();
  const div = document.createElement('div');
  div.id = idUnico;
  div.setAttribute('data-tipo', tipoNorm);
  div.className = 'idevice-card idevice-container ' + meta.variante + (tipoNorm === 'lectura' ? ' idevice-card-audio' : '');

  const header = document.createElement('div');
  header.className = 'idevice-header';
  const tag = document.createElement('span');
  tag.className = 'idevice-tag';
  tag.textContent = meta.etiqueta;
  const btnQuitar = document.createElement('button');
  btnQuitar.type = 'button';
  btnQuitar.className = 'idevice-btn';
  btnQuitar.textContent = 'Quitar';
  btnQuitar.setAttribute('aria-label', 'Quitar ' + meta.etiqueta);
  btnQuitar.addEventListener('click', function () { eliminarIDeviceCard_(btnQuitar); });
  header.appendChild(tag);
  header.appendChild(btnQuitar);

  const body = document.createElement('div');
  body.className = 'idevice-body';
  const titulo = document.createElement('input');
  titulo.type = 'text';
  titulo.setAttribute('data-campo', 'titulo');
  titulo.setAttribute('aria-label', 'Título del bloque');
  titulo.placeholder = meta.phTitulo;
  titulo.value = datos.titulo || '';
  titulo.style.cssText = 'width:100%;box-sizing:border-box;margin-bottom:6px;';
  const cuerpo = document.createElement('textarea');
  cuerpo.setAttribute('data-campo', 'cuerpo');
  cuerpo.id = 'txt_' + idUnico;
  cuerpo.rows = 2;
  cuerpo.setAttribute('aria-label', 'Contenido del bloque');
  cuerpo.placeholder = meta.phCuerpo;
  cuerpo.value = datos.cuerpo || '';
  cuerpo.style.cssText = 'width:100%;box-sizing:border-box;resize:vertical;';
  titulo.addEventListener('input', marcarIDevicesTocados_);
  cuerpo.addEventListener('input', marcarIDevicesTocados_);
  body.appendChild(titulo);
  body.appendChild(cuerpo);

  if (tipoNorm === 'lectura') {
    const bar = document.createElement('div');
    bar.className = 'idevice-audio-bar';
    const btnAudio = document.createElement('button');
    btnAudio.type = 'button';
    btnAudio.className = 'idevice-btn';
    btnAudio.textContent = 'Escuchar con Web Speech';
    btnAudio.addEventListener('click', function () { probarAudioIDevice_(btnAudio); });
    bar.appendChild(btnAudio);
    body.appendChild(bar);
  }

  div.appendChild(header);
  div.appendChild(body);
  return div;
}

function insertariDeviceSesion_(tipo) {
  const contenedor = document.getElementById('contenedorIDevicesDinamicos');
  if (!contenedor) {
    toast('No encontré el contenedor de iDevices de la sesión.', 'error');
    return;
  }

  const tipoNorm = String(tipo || '').toLowerCase();
  const meta = META_IDEVICE_[tipoNorm];
  if (!meta) return;

  const div = pintarTarjetaIDevice_(tipoNorm, null);
  if (!div) return;
  contenedor.appendChild(div);
  marcarIDevicesTocados_();
  const titulo = div.querySelector('[data-campo="titulo"]');
  if (titulo) titulo.focus();
  if (div.scrollIntoView) div.scrollIntoView({ block: 'nearest' });
  toast('Bloque de ' + meta.nombre + ' insertado en la sesión.', 'info');
}

function textoCampoIDevice_(card, campo) {
  const el = card.querySelector('[data-campo="' + campo + '"]');
  return String((el && el.value) || '').trim();
}

function serializarIDevicesSesion_() {
  const contenedor = document.getElementById('contenedorIDevicesDinamicos');
  if (!contenedor) return '';
  const bloques = [];
  contenedor.querySelectorAll('.idevice-card').forEach(function (card) {
    const tipo = card.getAttribute('data-tipo') || '';
    const meta = META_IDEVICE_[tipo];
    if (!meta) return;
    const titulo = textoCampoIDevice_(card, 'titulo');
    const cuerpo = textoCampoIDevice_(card, 'cuerpo');
    if (!titulo && !cuerpo) return;
    let linea = '#### ' + meta.etiqueta;
    if (titulo) linea += ': ' + titulo;
    linea += '\n' + (cuerpo || '(sin texto)');
    bloques.push(linea);
  });
  if (!bloques.length) return '';
  return '\n\n' + MARCA_IDEVICES_INI_ + '\n' + bloques.join('\n\n') + '\n' + MARCA_IDEVICES_FIN_;
}

function quitarMarcaIDevices_(texto) {
  let base = String(texto || '');
  const ini = base.indexOf(MARCA_IDEVICES_INI_);
  const fin = base.indexOf(MARCA_IDEVICES_FIN_);
  if (ini >= 0 && fin > ini) {
    base = base.slice(0, ini) + base.slice(fin + MARCA_IDEVICES_FIN_.length);
  }
  return base.replace(/\n{3,}/g, '\n\n').trim();
}

function volcarIDevicesEnGuion_() {
  const campo = document.getElementById('sesGuionEstudiante');
  const contenedor = document.getElementById('contenedorIDevicesDinamicos');
  if (!campo) return '';
  const hayTarjetas = !!(contenedor && contenedor.querySelector('.idevice-card'));
  if (!hayTarjetas && !idevicesTocados_) return campo.value;
  const base = quitarMarcaIDevices_(campo.value);
  const extra = serializarIDevicesSesion_();
  campo.value = extra ? (base ? base.replace(/\s+$/, '') + extra : extra.trim()) : base;
  return campo.value;
}

function leerTipoIDeviceDesdeCabeza_(cabeza) {
  const texto = String(cabeza || '').replace(/^####\s+/, '').trim();
  const claves = Object.keys(META_IDEVICE_);
  for (let i = 0; i < claves.length; i++) {
    const meta = META_IDEVICE_[claves[i]];
    const prefs = [meta.etiqueta, meta.nombre];
    for (let j = 0; j < prefs.length; j++) {
      const pref = prefs[j];
      const bajo = texto.toLowerCase();
      const prefBajo = pref.toLowerCase();
      if (bajo === prefBajo) return { tipo: claves[i], titulo: '' };
      if (bajo.indexOf(prefBajo + ':') === 0) {
        return { tipo: claves[i], titulo: texto.slice(pref.length + 1).trim() };
      }
    }
  }
  return null;
}

function parsearBloqueIDevices_(texto) {
  const base = String(texto || '');
  const ini = base.indexOf(MARCA_IDEVICES_INI_);
  const fin = base.indexOf(MARCA_IDEVICES_FIN_);
  if (ini < 0 || fin <= ini) return [];
  const cuerpo = base.slice(ini + MARCA_IDEVICES_INI_.length, fin).trim();
  if (!cuerpo) return [];
  const out = [];
  cuerpo.split(/\n(?=#### )/).forEach(function (parte) {
    const lineas = parte.trim().split('\n');
    const leido = leerTipoIDeviceDesdeCabeza_(lineas.shift() || '');
    if (!leido) return;
    let cuerpoTxt = lineas.join('\n').trim();
    if (cuerpoTxt === '(sin texto)') cuerpoTxt = '';
    out.push({ tipo: leido.tipo, titulo: leido.titulo, cuerpo: cuerpoTxt });
  });
  return out;
}

function rehidratarIDevicesDesdeGuion_() {
  const contenedor = document.getElementById('contenedorIDevicesDinamicos');
  if (!contenedor) return;
  contenedor.textContent = '';
  const campo = document.getElementById('sesGuionEstudiante');
  parsearBloqueIDevices_(campo ? campo.value : '').forEach(function (bloque) {
    const card = pintarTarjetaIDevice_(bloque.tipo, bloque);
    if (card) contenedor.appendChild(card);
  });
  idevicesTocados_ = false;
}

function camposMomentosSesion_() {
  return [
    { id: 'sesApertura', alias: 'planApertura', nombre: 'Apertura' },
    { id: 'sesDesarrollo', alias: 'planDesarrollo', nombre: 'Desarrollo' },
    { id: 'sesActividad', alias: 'planActividad', nombre: 'Actividad' },
    { id: 'sesCierre', alias: 'planCierre', nombre: 'Cierre' }
  ].map(function (def) {
    return {
      nombre: def.nombre,
      el: document.getElementById(def.id) || document.getElementById(def.alias) || document.querySelector('[data-alias="' + def.alias + '"]')
    };
  });
}

function resaltarMomentoFaltante_(el, falta) {
  if (!el) return;
  if (falta) {
    el.style.outline = '2px solid #b45309';
    el.style.outlineOffset = '2px';
    el.setAttribute('aria-invalid', 'true');
  } else {
    el.style.outline = '';
    el.style.outlineOffset = '';
    el.removeAttribute('aria-invalid');
  }
}

function vigilarMomentosSesion_() {
  camposMomentosSesion_().forEach(function (c) {
    if (!c.el || c.el._st90Mom) return;
    c.el._st90Mom = true;
    c.el.addEventListener('input', function () {
      if (String(c.el.value || '').trim()) resaltarMomentoFaltante_(c.el, false);
    });
  });
}

function validarMomentosSesionAntesDeGuardar_() {
  vigilarMomentosSesion_();
  const faltantes = [];
  let primero = null;
  camposMomentosSesion_().forEach(function (c) {
    const vacio = !c.el || !String(c.el.value || '').trim();
    resaltarMomentoFaltante_(c.el, vacio);
    if (!vacio) return;
    faltantes.push(c.nombre);
    if (!primero && c.el) primero = c.el;
  });
  if (!faltantes.length) return true;
  if (primero) {
    if (primero.scrollIntoView) primero.scrollIntoView({ block: 'center' });
    if (primero.focus) primero.focus();
  }
  toast('Completa los cuatro momentos antes de guardar: falta ' + faltantes.join(', ') + '.');
  return false;
}

function probarAudioIDevice_(origen) {
  let card = null;
  if (typeof origen === 'string') card = document.getElementById(origen);
  else if (origen && origen.closest) card = origen.closest('.idevice-card');
  const txtEl = card ? card.querySelector('[data-campo="cuerpo"], textarea') : null;
  let texto = txtEl ? String(txtEl.value || '').trim() : '';
  if (!texto) texto = 'Por favor escribe un texto en el bloque de lectura para escucharlo.';
  if (!window.speechSynthesis) {
    toast('Este navegador no tiene narración de voz.', 'error');
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = 'es-MX';
  u.rate = 1.0;
  window.speechSynthesis.speak(u);
}

(function engancharGuardadoSesionIDevice_() {
  if (typeof guardarSesionActiva === 'function' && !guardarSesionActiva._st90IDev) {
    const originalGuardar = guardarSesionActiva;
    function guardarSesionActivaConIDevices() {
      if (!validarMomentosSesionAntesDeGuardar_()) return;
      const campo = document.getElementById('sesGuionEstudiante');
      if (campo && !String(campo.value || '').trim() && typeof generarGuionDesdeMomentos === 'function') {
        generarGuionDesdeMomentos();
      }
      volcarIDevicesEnGuion_();
      return originalGuardar.apply(this, arguments);
    }
    guardarSesionActivaConIDevices._st90IDev = true;
    guardarSesionActiva = guardarSesionActivaConIDevices;
  }

  if (typeof generarGuionDesdeMomentos === 'function' && !generarGuionDesdeMomentos._st90IDev) {
    const originalGuion = generarGuionDesdeMomentos;
    function generarGuionDesdeMomentosConIDevices() {
      const r = originalGuion.apply(this, arguments);
      volcarIDevicesEnGuion_();
      return r;
    }
    generarGuionDesdeMomentosConIDevices._st90IDev = true;
    generarGuionDesdeMomentos = generarGuionDesdeMomentosConIDevices;
  }

  if (typeof seleccionarSesionNEM === 'function' && !seleccionarSesionNEM._st90IDev) {
    const originalSel = seleccionarSesionNEM;
    function seleccionarSesionNEMConIDevices(idx) {
      const r = originalSel.apply(this, arguments);
      rehidratarIDevicesDesdeGuion_();
      vigilarMomentosSesion_();
      return r;
    }
    seleccionarSesionNEMConIDevices._st90IDev = true;
    seleccionarSesionNEM = seleccionarSesionNEMConIDevices;
  }
})();
```

`eliminarLegoCard_` sigue en `AdminPlanJS_06.html` y no forma parte de este sprint.

---

## 3. Bloque de cierre

```markdown
### 🛠️ 2026-10-29 - Planeación didáctica: iDevices y momentos
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(planeacion): serializa los idevices y bloquea el guardado si falta un momento`
- **Cambios Realizados:**
  - Las tarjetas de lectura, pregunta y reto se pintan en `#contenedorIDevicesDinamicos` con id `idevice_` más marca de tiempo y botón Quitar.
  - El texto de las tarjetas se vuelca en `#sesGuionEstudiante` al guardar o al regenerar el guion, y se vuelve a armar al elegir la sesión.
  - Guardar la sesión exige los cuatro momentos. El campo vacío se resalta y el aviso usa el toast ST90.
- **Archivos Afectados:** `AdminPlanJS_06.html`, `AdminPlaneacion.html`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Los id canónicos de los momentos son `sesApertura`, `sesDesarrollo`, `sesActividad` y `sesCierre` porque `AdminPlanJS_05.html` los lee al guardar. El alias del contrato vive en `data-alias` (`planApertura`, `planDesarrollo`, `planActividad`, `planCierre`); no renombrar los id `ses*`. La serialización usa las marcas `--- iDevices de la sesión ---` y `--- fin iDevices ---` dentro de `sesGuionEstudiante`. `seleccionarSesionNEM` rehidrata las tarjetas y `guardarSesionActiva` valida antes de llamar al guardado original. Clases usadas: las ya existentes (`.idevice-card`, `.idevice-card-audio`, `.idevice-btn` y las de `ComunCSS.html`). No hay commit ni clasp: lo audita y sube Antigravity. La copia de auditoría está en `ENTREGA_CURSOR.md`.
```

**Brújula:** la entrega de Cursor está en este archivo y el código ya vive en `AdminPlanJS_06.html` y `AdminPlaneacion.html`. El siguiente paso es la auditoría de Antigravity. La fase 5 del contrato (cinta estilo aSc) no forma parte de este sprint.
