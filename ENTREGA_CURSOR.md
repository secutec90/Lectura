# BUZÓN DE ENTREGA: CURSOR (FRONTEND JS / DOM)

> **Instrucciones para Cursor:**
> Escribe aquí tu informe técnico, el código JavaScript y los controladores del DOM de tu tarea asignada según `ESTADO_COORDINACION.md`.
> Genera tu bloque de cierre conforme a `.cursor/rules/control-cambios.mdc`.
> Una vez que guardes este archivo, el usuario notificará a Antigravity para que proceda a auditarlo e integrarlo en el código del proyecto.

**Estado del buzón:** entregado el 2026-10-29 (America/Monterrey).
**Agente:** Cursor, ingeniero frontend.
**Fase:** 6 — Desacoplamiento CSS y pulido de tarjetas iDevice.
**Archivo de trabajo:** `AdminPlanJS_06.html`.
**Función tocada:** `pintarTarjetaIDevice_`.

**Nota para Antigravity:** el cambio ya está en el fuente. Este buzón trae solo el fragmento de esa función. No reemplaza el archivo. No hubo `git commit`, `git push` ni `clasp push`. Los estilos de `.idevice-campo-titulo` y `.idevice-campo-cuerpo` los entrega DeepSeek en `ComunCSS.html`.

---

## 1. Informe

Dentro de `pintarTarjetaIDevice_` se quitaron los dos `style.cssText` de los campos de la tarjeta. El título usa `idevice-campo-titulo` y el cuerpo usa `idevice-campo-cuerpo`, como fija la partitura de la fase 6.

El resto de la función quedó igual: id `idevice_` más marca de tiempo, `data-tipo`, botón Quitar, escucha de Web Speech en lectura, y el aviso de cambios al escribir. Hasta que DeepSeek publique las reglas, el ancho y el borde de esos dos campos dependen de `ComunCSS.html`.

### Funciones adyacentes, sin cambios

Siguen en `AdminPlanJS_06.html` y no se reescribieron:

- `eliminarIDeviceCard_`
- `eliminarLegoCard_`
- `insertariDeviceSesion_`
- `serializarIDevicesSesion_`
- `volcarIDevicesEnGuion_`
- `rehidratarIDevicesDesdeGuion_`
- `validarMomentosSesionAntesDeGuardar_`
- `probarAudioIDevice_`
- `conmutarVistaPlaneacion_`
- `abrirFormNuevaPlaneacionNEM`
- `inicializarModuloPlaneacion_`
- el cierre `engancharGuardadoSesionIDevice_`

No se tocó `AdminPlaneacion.html`, ningún `.gs` ni el CSS.

### Líneas sustituidas

```javascript
titulo.className = 'idevice-campo-titulo';
cuerpo.className = 'idevice-campo-cuerpo';
```

Antes eran `titulo.style.cssText = 'width:100%;box-sizing:border-box;margin-bottom:6px;'` y `cuerpo.style.cssText = 'width:100%;box-sizing:border-box;resize:vertical;'`.

---

## 2. Fragmento

`pintarTarjetaIDevice_` completa, ya en el fuente. Es el único bloque de esta entrega.

```javascript
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
  titulo.className = 'idevice-campo-titulo';
  const cuerpo = document.createElement('textarea');
  cuerpo.setAttribute('data-campo', 'cuerpo');
  cuerpo.id = 'txt_' + idUnico;
  cuerpo.rows = 2;
  cuerpo.setAttribute('aria-label', 'Contenido del bloque');
  cuerpo.placeholder = meta.phCuerpo;
  cuerpo.value = datos.cuerpo || '';
  cuerpo.className = 'idevice-campo-cuerpo';
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
```

---

## 3. Bloque de cierre

```markdown
### 🛠️ 2026-10-29 - Tarjetas iDevice: campos sin estilo en línea
- **Mensaje de Commit sugerido (Conventional Commits):** `refactor(planeacion): quita el estilo en linea de los campos idevice`
- **Cambios Realizados:**
  - En `pintarTarjetaIDevice_` el título pasa a la clase `idevice-campo-titulo` y el cuerpo a `idevice-campo-cuerpo`.
  - Se eliminaron los dos `style.cssText` de esos campos. El resto de la función y las funciones vecinas no se modificaron.
- **Archivos Afectados:** `AdminPlanJS_06.html`, `ENTREGA_CURSOR.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** Fase 6 de `ESTADO_COORDINACION.md`. Cursor solo sustituye las dos asignaciones dentro de `pintarTarjetaIDevice_`. DeepSeek define `.idevice-campo-titulo` y `.idevice-campo-cuerpo` en `ComunCSS.html`. No reabrir el serializado del guion ni la validación de los cuatro momentos. No pegar este buzón sobre el archivo: `eliminarLegoCard_`, `conmutarVistaPlaneacion_`, `abrirFormNuevaPlaneacionNEM` e `inicializarModuloPlaneacion_` siguen intactas alrededor. No hay commit ni clasp.
```

**Brújula:** la fase 6 de cliente queda en esas dos clases. DeepSeek cierra el CSS. Antigravity audita y despliega. El sprint anterior de serialización y validación no se reabrió.
