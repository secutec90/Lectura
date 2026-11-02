# 📦 ENTREGA AUTOMÁTICA DE CÓDIGO: ETAPAS 3 Y 4 \+ CONFIGURACIÓN DE MEMBRETE, LISTA DE COTEJO Y RÚBRICA (`build-568`)

**Fecha:** 2026-11-01  
**Origen:** Agente de Desarrollo / Cursor  
**Destino:** Auditoría e integración para Antigravity (`main` / Google Apps Script)

---

## 1\. Resumen de Implementación

Se completaron las especificaciones de la sesión para las Etapas 3 y 4 de Planeación NEM:

1. **Configuración de Membrete y Logotipos en Panel de Administración:**  
   - Persistencia en `PropertiesService` mediante `obtenerMembreteInstitucionalNEM` y `guardarMembreteInstitucionalNEM`.  
   - Soporte para logotipos izquierdo y derecho (URL o Base64) y 3 líneas institucionales editables.  
2. **Chips Rápidos DUA (Etapa 3 \- `#secInclusionBAPyC`):**  
   - 4 chips interactivos de 1 clic (`+ Macrotipo y Alto Contraste`, `+ Audio DUA y Lectura Guiada`, `+ Tiempos Flexibles y Pausas Activas`, `+ Parejas Tutoras y Andamiaje Visual`) con inserción en `textarea#planAjustesRazonables` y autoguardado.  
3. **Editor Interactivo de Evaluación Formativa (Etapa 4 \- `#cajaRubricaCotejoNEM`):**  
   - Tabla de Lista de Cotejo editable (3 a 5 criterios observables).  
   - Generador automático `✨ Generar desde PDA` que analiza los PDA y el Propósito para formular criterios cognitivos, procedimentales, comunitarios y socioemocionales/DUA.  
   - Construcción paralela de la Rúbrica analítica por niveles de logro (Sobresaliente, Satisfactorio, Básico, Requiere Apoyo).  
4. **Conexión con el Plano Didáctico Oficial NL (`AyudaJS.html`):**  
   - Inyección dinámica del membrete configurado en la cabecera.  
   - Renderizado automático de la Lista de Cotejo y de la Rúbrica analítica en la vista previa y formato PDF/impresión.

---

## 2\. Bloque de Backend (`PlaneacionNEM.gs`)

```js
/**
 * Obtiene la configuración de membrete y logotipos institucionales.
 */
function obtenerMembreteInstitucionalNEM() {
  try {
    const props = PropertiesService.getScriptProperties();
    return {
      ok: true,
      config: {
        logoIzquierdo: props.getProperty('ST90_CFG_LOGO_IZQ') || '',
        logoDerecho: props.getProperty('ST90_CFG_LOGO_DER') || '',
        linea1: props.getProperty('ST90_CFG_ENC_L1') || 'GOBIERNO DEL ESTADO DE NUEVO LEÓN · SECRETARÍA DE EDUCACIÓN',
        linea2: props.getProperty('ST90_CFG_ENC_L2') || 'ESCUELA SECUNDARIA TÉCNICA NO. 90 "DON JOSÉ CALDERÓN AYALA"',
        linea3: props.getProperty('ST90_CFG_ENC_L3') || 'C.C.T. 19DST0090X · ZONA ESCOLAR 11 · CICLO ESCOLAR 2026-2027'
      }
    };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Guarda la configuración de logotipos y membrete institucional.
 */
function guardarMembreteInstitucionalNEM(token, payload) {
  try {
    if (typeof validarTokenAdmin_ === 'function' && !validarTokenAdmin_(token)) {
      return { ok: false, error: 'Sesión no autorizada.' };
    }
    const props = PropertiesService.getScriptProperties();
    if (payload.logoIzquierdo !== undefined) props.setProperty('ST90_CFG_LOGO_IZQ', String(payload.logoIzquierdo).trim());
    if (payload.logoDerecho !== undefined) props.setProperty('ST90_CFG_LOGO_DER', String(payload.logoDerecho).trim());
    if (payload.linea1 !== undefined) props.setProperty('ST90_CFG_ENC_L1', String(payload.linea1).trim());
    if (payload.linea2 !== undefined) props.setProperty('ST90_CFG_ENC_L2', String(payload.linea2).trim());
    if (payload.linea3 !== undefined) props.setProperty('ST90_CFG_ENC_L3', String(payload.linea3).trim());

    return { ok: true, mensaje: 'Membrete institucional actualizado correctamente.' };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
```

---

## 3\. Bloque de Estructura DOM (`AdminPlaneacion.html`)

```html
<!-- Modal: Configuración de Membrete y Logotipos Oficiales ST90 -->
<div id="modalConfigMembreteST90" class="st90-modal-fondo">
  <div class="tarjeta" style="max-width:580px;width:95%;padding:18px 22px;border-radius:12px;background:#fff;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid #e2e8f0;padding-bottom:8px;">
      <h3 style="margin:0;font-size:16px;color:#0f172a;">⚙️ Configuración de Membrete y Logotipos Oficiales</h3>
      <button type="button" class="btn-secundario" onclick="cerrarModalMembrete()" style="padding:2px 8px;">✕</button>
    </div>
    
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
      <div>
        <label style="font-size:12px;display:block;margin-bottom:4px;font-weight:700;">Logotipo Izquierdo (URL / Base64):</label>
        <input type="text" id="cfgLogoIzq" placeholder="https://... o data:image/png..." style="width:100%;box-sizing:border-box;font-size:12px;">
      </div>
      <div>
        <label style="font-size:12px;display:block;margin-bottom:4px;font-weight:700;">Logotipo Derecho (URL / Base64):</label>
        <input type="text" id="cfgLogoDer" placeholder="https://... o data:image/png..." style="width:100%;box-sizing:border-box;font-size:12px;">
      </div>
    </div>

    <div style="margin-bottom:10px;">
      <label style="font-size:12px;display:block;margin-bottom:4px;font-weight:700;">Línea Superior (Dependencia / Secretaría):</label>
      <input type="text" id="cfgEncL1" style="width:100%;box-sizing:border-box;font-size:12.5px;">
    </div>
    <div style="margin-bottom:10px;">
      <label style="font-size:12px;display:block;margin-bottom:4px;font-weight:700;">Nombre del Plantel Educativo:</label>
      <input type="text" id="cfgEncL2" style="width:100%;box-sizing:border-box;font-size:12.5px;font-weight:700;">
    </div>
    <div style="margin-bottom:16px;">
      <label style="font-size:12px;display:block;margin-bottom:4px;font-weight:700;">Datos Institucionales (CCT, Zona, Ciclo):</label>
      <input type="text" id="cfgEncL3" style="width:100%;box-sizing:border-box;font-size:12.5px;">
    </div>

    <div style="display:flex;justify-content:flex-end;gap:8px;">
      <button type="button" class="btn-secundario" onclick="cerrarModalMembrete()">Cancelar</button>
      <button type="button" onclick="guardarConfiguracionMembrete()" style="background:#1f6f9f;color:#fff;">💾 Guardar Membrete</button>
    </div>
  </div>
</div>
```

---

## 4\. Bloque Frontend (`AdminPlanJS_04.html`)

```js
/* ============================================================
   CHIPS RÁPIDOS DUA (ETAPA 3) + LISTA DE COTEJO Y RÚBRICA (ETAPA 4)
   ============================================================ */

window.criteriosCotejoPlanNEM_ = window.criteriosCotejoPlanNEM_ || [];
window.rubricaPlanNEM_ = window.rubricaPlanNEM_ || [];
window.configMembreteNEM_ = window.configMembreteNEM_ || null;

// Sincronización de Membrete
function cargarMembreteInstitucional_() {
  const tk = (typeof getTokenPlan_ === 'function') ? getTokenPlan_() : '';
  if (typeof gsRun === 'function') {
    gsRun('obtenerMembreteInstitucionalNEM', tk).then(function(res) {
      if (res && res.ok && res.config) {
        window.configMembreteNEM_ = res.config;
      }
    });
  }
}
setTimeout(cargarMembreteInstitucional_, 400);

function abrirModalMembrete() {
  const cfg = window.configMembreteNEM_ || {};
  document.getElementById('cfgLogoIzq').value = cfg.logoIzquierdo || '';
  document.getElementById('cfgLogoDer').value = cfg.logoDerecho || '';
  document.getElementById('cfgEncL1').value = cfg.linea1 || 'GOBIERNO DEL ESTADO DE NUEVO LEÓN · SECRETARÍA DE EDUCACIÓN';
  document.getElementById('cfgEncL2').value = cfg.linea2 || 'ESCUELA SECUNDARIA TÉCNICA NO. 90 "DON JOSÉ CALDERÓN AYALA"';
  document.getElementById('cfgEncL3').value = cfg.linea3 || 'C.C.T. 19DST0090X · ZONA ESCOLAR 11 · CICLO ESCOLAR 2026-2027';
  const m = document.getElementById('modalConfigMembreteST90');
  if (m) m.classList.add('visible');
}

function cerrarModalMembrete() {
  const m = document.getElementById('modalConfigMembreteST90');
  if (m) m.classList.remove('visible');
}

function guardarConfiguracionMembrete() {
  const payload = {
    logoIzquierdo: document.getElementById('cfgLogoIzq').value,
    logoDerecho: document.getElementById('cfgLogoDer').value,
    linea1: document.getElementById('cfgEncL1').value,
    linea2: document.getElementById('cfgEncL2').value,
    linea3: document.getElementById('cfgEncL3').value
  };
  const tk = (typeof getTokenPlan_ === 'function') ? getTokenPlan_() : '';
  toast('Guardando membrete...', 'info');
  gsRun('guardarMembreteInstitucionalNEM', tk, payload).then(function(res) {
    if (res && res.ok) {
      window.configMembreteNEM_ = payload;
      toast('Membrete guardado correctamente.', 'ok');
      cerrarModalMembrete();
    } else {
      toast((res && res.error) || 'Error al guardar.', 'error');
    }
  });
}

// Inserción de Chips DUA en Etapa 3
function insertarAjusteDUARapido(texto) {
  const area = document.getElementById('planAjustesRazonables');
  if (!area) return;
  const actual = area.value.trim();
  const linea = '• ' + texto;
  if (actual.indexOf(linea) >= 0) {
    toast('El ajuste razonable ya está incluido.', 'warning');
    return;
  }
  area.value = actual ? (actual + '\n' + linea) : linea;
  area.dispatchEvent(new Event('input', { bubbles: true }));
  toast('Ajuste DUA agregado.', 'ok');
}

// Generación de Instrumentos en Etapa 4
function generarCriteriosDesdePDANIA() {
  const pdaTxt = (document.getElementById('planPDA') || {}).value || '';
  const propositoTxt = (document.getElementById('planProposito') || {}).value || '';

  if (!pdaTxt.trim() && !propositoTxt.trim()) {
    toast('Selecciona primero PDA o redacta el propósito del proyecto.', 'error');
    return;
  }

  const lineasPDA = pdaTxt.split('\n')
    .map(function(l) { return l.replace(/^[•\-\*]\s*(\[\d+° Grado\])?\s*/i, '').trim(); })
    .filter(Boolean);

  const criterios = [];
  if (lineasPDA.length > 0) {
    criterios.push('Identifica y aplica comprensivamente: ' + lineasPDA[0].slice(0, 110));
  } else {
    criterios.push('Demuestra dominio de los conceptos esenciales del campo formativo.');
  }

  if (lineasPDA.length > 1) {
    criterios.push('Desarrolla procesos prácticos relacionados con: ' + lineasPDA[1].slice(0, 110));
  } else if (propositoTxt.trim()) {
    criterios.push('Participa en la elaboración del producto central: ' + propositoTxt.slice(0, 100));
  } else {
    criterios.push('Ejecuta las actividades y producciones de clase con rigor metodológico.');
  }

  criterios.push('Vincula los aprendizajes con situaciones de su entorno y problemáticas del CTE.');
  criterios.push('Colabora de manera inclusiva, respetuosa y reflexiva (enfoque DUA).');

  window.criteriosCotejoPlanNEM_ = criterios.slice(0, 5);
  generarRubricaDesdeCriterios_(window.criteriosCotejoPlanNEM_);
  pintarTablaCriteriosCotejoDOM_();
  toast('Lista de Cotejo y Rúbrica generadas con éxito.', 'ok');
}

function generarRubricaDesdeCriterios_(criterios) {
  window.rubricaPlanNEM_ = criterios.map(function(crit) {
    return {
      criterio: crit,
      sobresaliente: 'Cumple con excelencia y profundidad: ' + crit,
      satisfactorio: 'Cumple satisfactoriamente con la mayor parte del indicador.',
      basico: 'Presenta dificultades menores, requiriendo retroalimentación puntual.',
      requiereApoyo: 'Muestra rezago evidente o no demuestra la evidencia esperada.'
    };
  });
}

function pintarTablaCriteriosCotejoDOM_() {
  const contenedor = document.getElementById('cajaRubricaCotejoNEM');
  if (!contenedor) return;
  const lista = window.criteriosCotejoPlanNEM_ || [];

  let html = `
    <div class="nem-rubrica-cab">
      <h4 class="nem-rubrica-titulo">📋 Lista de Cotejo y Evaluación Formativa</h4>
      <span class="nem-rubrica-contador">${lista.length} de 5 criterios</span>
      <div class="nem-rubrica-acciones">
        <button type="button" class="nem-rubrica-btn nem-rubrica-btn--ia" onclick="generarCriteriosDesdePDANIA()">✨ Generar desde PDA</button>
        <button type="button" class="nem-rubrica-btn" onclick="agregarCriterioVacioCotejo()" ${lista.length >= 5 ? 'disabled' : ''}>+ Agregar criterio</button>
      </div>
    </div>
    <table class="nem-tabla-cotejo-edit">
      <thead>
        <tr>
          <th>Criterio de Evaluación Formativa / PDA</th>
          <th class="col-indicador">Sí ✓</th>
          <th class="col-indicador">En proceso</th>
          <th class="col-indicador">No todavía</th>
          <th class="col-quitar"></th>
        </tr>
      </thead>
      <tbody>
  `;

  if (!lista.length) {
    html += `<tr><td colspan="5" class="nem-rubrica-vacia">Sin criterios asignados. Pulsa <strong>✨ Generar desde PDA</strong> para construirlos automáticamente.</td></tr>`;
  } else {
    html += lista.map(function(crit, idx) {
      return `
        <tr>
          <td>
            <input type="text" class="nem-cotejo-input" value="${escaparHtml(crit)}" 
                   placeholder="Redacta el criterio observable..." 
                   onchange="actualizarCriterioCotejoTexto(${idx}, this.value)">
          </td>
          <td class="col-indicador"><input type="radio" disabled class="nem-cotejo-radio" checked></td>
          <td class="col-indicador"><input type="radio" disabled class="nem-cotejo-radio"></td>
          <td class="col-indicador"><input type="radio" disabled class="nem-cotejo-radio"></td>
          <td class="col-quitar">
            <button type="button" class="nem-cotejo-quitar" onclick="quitarCriterioCotejo(${idx})" title="Eliminar fila">✕</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  html += `</tbody></table>`;
  contenedor.innerHTML = html;

  try {
    localStorage.setItem('st90_criterios_cotejo', JSON.stringify(window.criteriosCotejoPlanNEM_));
  } catch(e) {}
}

function agregarCriterioVacioCotejo() {
  if (!window.criteriosCotejoPlanNEM_) window.criteriosCotejoPlanNEM_ = [];
  if (window.criteriosCotejoPlanNEM_.length >= 5) {
    toast('El instrumento admite un máximo de 5 criterios.', 'warning');
    return;
  }
  window.criteriosCotejoPlanNEM_.push('Nuevo criterio observable...');
  generarRubricaDesdeCriterios_(window.criteriosCotejoPlanNEM_);
  pintarTablaCriteriosCotejoDOM_();
}

function quitarCriterioCotejo(idx) {
  if (!window.criteriosCotejoPlanNEM_ || window.criteriosCotejoPlanNEM_.length <= 1) {
    toast('Se requiere al menos un criterio de evaluación.', 'warning');
    return;
  }
  window.criteriosCotejoPlanNEM_.splice(idx, 1);
  generarRubricaDesdeCriterios_(window.criteriosCotejoPlanNEM_);
  pintarTablaCriteriosCotejoDOM_();
}

function actualizarCriterioCotejoTexto(idx, val) {
  if (window.criteriosCotejoPlanNEM_ && window.criteriosCotejoPlanNEM_[idx] !== undefined) {
    window.criteriosCotejoPlanNEM_[idx] = val.trim();
    generarRubricaDesdeCriterios_(window.criteriosCotejoPlanNEM_);
  }
}

function reiniciarCriteriosCotejoNEM_() {
  window.criteriosCotejoPlanNEM_ = [];
  window.rubricaPlanNEM_ = [];
  pintarTablaCriteriosCotejoDOM_();
}
```

---

## 5\. Bloque Oficial de Integración PDF (`AyudaJS.html`)

```js
function _generarHtmlDocumentoPlanoDidacticoNL_(p, sesiones) {
  p = p || {};
  sesiones = sesiones || [];
  
  const cfg = window.configMembreteNEM_ || {
    logoIzquierdo: '',
    logoDerecho: '',
    linea1: 'GOBIERNO DEL ESTADO DE NUEVO LEÓN · SECRETARÍA DE EDUCACIÓN',
    linea2: 'ESCUELA SECUNDARIA TÉCNICA NO. 90 "DON JOSÉ CALDERÓN AYALA"',
    linea3: 'C.C.T. 19DST0090X · ZONA ESCOLAR 11 · CICLO ESCOLAR 2026-2027'
  };

  const imgIzqHtml = cfg.logoIzquierdo 
    ? `<img src="${cfg.logoIzquierdo}" alt="Escudo Izquierdo" style="max-height:48px;max-width:130px;object-fit:contain;">`
    : `<div style="font-size:11px;font-weight:700;color:#1e40af;">SECRETARÍA DE EDUCACIÓN<br>NUEVO LEÓN</div>`;

  const imgDerHtml = cfg.logoDerecho 
    ? `<img src="${cfg.logoDerecho}" alt="Escudo Derecho" style="max-height:48px;max-width:130px;object-fit:contain;">`
    : `<div style="font-size:11px;font-weight:700;color:#0f766e;text-align:right;">EST 90<br>DON JOSÉ CALDERÓN</div>`;

  const criterios = (window.criteriosCotejoPlanNEM_ && window.criteriosCotejoPlanNEM_.length) 
    ? window.criteriosCotejoPlanNEM_ 
    : [
        'Comprende los conceptos y contenidos curriculares desarrollados en el proyecto.',
        'Aplica procedimientos técnicos y metodológicos según los momentos planteados.',
        'Resuelve situaciones problemáticas vinculadas a su contexto comunitario.',
        'Participa colaborativamente bajo el enfoque de inclusión y equidad (DUA).'
      ];

  const filasCotejoHtml = criterios.map(function(c, i) {
    return `
      <tr>
        <td style="border:1px solid #000;padding:4px 6px;font-size:10px;text-align:center;">${i + 1}</td>
        <td style="border:1px solid #000;padding:4px 6px;font-size:10px;">${escaparHtml(c)}</td>
        <td style="border:1px solid #000;padding:4px 6px;text-align:center;width:40px;"></td>
        <td style="border:1px solid #000;padding:4px 6px;text-align:center;width:40px;"></td>
        <td style="border:1px solid #000;padding:4px 6px;text-align:center;width:40px;"></td>
      </tr>
    `;
  }).join('');

  const rubrica = (window.rubricaPlanNEM_ && window.rubricaPlanNEM_.length) ? window.rubricaPlanNEM_ : [];
  let seccionRubricaHtml = '';
  if (rubrica.length) {
    const filasRubrica = rubrica.map(function(r) {
      return `
        <tr>
          <td style="border:1px solid #000;padding:4px;font-size:9.5px;font-weight:700;">${escaparHtml(r.criterio)}</td>
          <td style="border:1px solid #000;padding:4px;font-size:9px;">${escaparHtml(r.sobresaliente)}</td>
          <td style="border:1px solid #000;padding:4px;font-size:9px;">${escaparHtml(r.satisfactorio)}</td>
          <td style="border:1px solid #000;padding:4px;font-size:9px;">${escaparHtml(r.basico)}</td>
          <td style="border:1px solid #000;padding:4px;font-size:9px;">${escaparHtml(r.requiereApoyo)}</td>
        </tr>
      `;
    }).join('');

    seccionRubricaHtml = `
      <div style="margin-top:14px;page-break-inside:avoid;">
        <div style="background:#f1f5f9;font-weight:700;font-size:10px;padding:3px 6px;border:1px solid #000;border-bottom:none;">
          RÚBRICA ANALÍTICA DE DESEMPEÑO POR NIVELES
        </div>
        <table style="width:100%;border-collapse:collapse;border:1px solid #000;">
          <thead>
            <tr style="background:#e2e8f0;font-size:9px;">
              <th style="border:1px solid #000;padding:4px;width:25%;">Criterio</th>
              <th style="border:1px solid #000;padding:4px;">Sobresaliente (10)</th>
              <th style="border:1px solid #000;padding:4px;">Satisfactorio (8-9)</th>
              <th style="border:1px solid #000;padding:4px;">Básico (6-7)</th>
              <th style="border:1px solid #000;padding:4px;">Requiere Apoyo (5)</th>
            </tr>
          </thead>
          <tbody>${filasRubrica}</tbody>
        </table>
      </div>
    `;
  }

  return `
    <div class="st90-doc-oficial-nl" style="font-family:'Segoe UI',Arial,sans-serif;color:#000;background:#fff;padding:20px;max-width:800px;margin:auto;">
      <table style="width:100%;border-collapse:collapse;margin-bottom:12px;">
        <tr>
          <td style="width:20%;vertical-align:middle;text-align:left;">${imgIzqHtml}</td>
          <td style="width:60%;vertical-align:middle;text-align:center;">
            <div style="font-size:10px;font-weight:700;letter-spacing:0.3px;">${escaparHtml(cfg.linea1)}</div>
            <div style="font-size:12px;font-weight:800;margin:2px 0;">${escaparHtml(cfg.linea2)}</div>
            <div style="font-size:9.5px;color:#333;">${escaparHtml(cfg.linea3)}</div>
            <div style="font-size:11px;font-weight:800;margin-top:4px;text-decoration:underline;">PLANO DIDÁCTICO OFICIAL — NUEVA ESCUELA MEXICANA</div>
          </td>
          <td style="width:20%;vertical-align:middle;text-align:right;">${imgDerHtml}</td>
        </tr>
      </table>

      <table style="width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:10px;font-size:10px;">
        <tr>
          <td style="border:1px solid #000;padding:3px 6px;background:#f1f5f9;width:18%;"><strong>Proyecto:</strong></td>
          <td style="border:1px solid #000;padding:3px 6px;width:42%;">${escaparHtml(p.titulo || p.Titulo || 'Sin título')}</td>
          <td style="border:1px solid #000;padding:3px 6px;background:#f1f5f9;width:18%;"><strong>Grado y Grupo:</strong></td>
          <td style="border:1px solid #000;padding:3px 6px;width:22%;">${escaparHtml(p.grado || p.Grado || '1')}° "${escaparHtml(p.grupo || p.Grupo || 'A')}"</td>
        </tr>
        <tr>
          <td style="border:1px solid #000;padding:3px 6px;background:#f1f5f9;"><strong>Campo Formativo:</strong></td>
          <td style="border:1px solid #000;padding:3px 6px;">${escaparHtml(p.campoFormativo || p.CampoFormativo || '')}</td>
          <td style="border:1px solid #000;padding:3px 6px;background:#f1f5f9;"><strong>Metodología:</strong></td>
          <td style="border:1px solid #000;padding:3px 6px;">${escaparHtml(p.metodologia || p.Metodologia || '')}</td>
        </tr>
        <tr>
          <td style="border:1px solid #000;padding:3px 6px;background:#f1f5f9;"><strong>Contenido Sintético:</strong></td>
          <td colspan="3" style="border:1px solid #000;padding:3px 6px;">${escaparHtml(p.contenidoSintetico || p.ContenidoSintetico || '')}</td>
        </tr>
        <tr>
          <td style="border:1px solid #000;padding:3px 6px;background:#f1f5f9;"><strong>PDA:</strong></td>
          <td colspan="3" style="border:1px solid #000;padding:3px 6px;">${escaparHtml(p.pda || p.PDA || '')}</td>
        </tr>
      </table>

      ${typeof _generarTablaSesionesNL_ === 'function' ? _generarTablaSesionesNL_(sesiones) : ''}

      <div style="margin-top:12px;page-break-inside:avoid;">
        <div style="background:#f1f5f9;font-weight:700;font-size:10px;padding:3px 6px;border:1px solid #000;border-bottom:none;">
          INSTRUMENTO DE EVALUACIÓN FORMATIVA — LISTA DE COTEJO
        </div>
        <table style="width:100%;border-collapse:collapse;border:1px solid #000;">
          <thead>
            <tr style="background:#e2e8f0;font-size:9.5px;">
              <th style="border:1px solid #000;padding:3px;width:24px;">#</th>
              <th style="border:1px solid #000;padding:3px;text-align:left;">Criterio Observable (PDA / Formativo)</th>
              <th style="border:1px solid #000;padding:3px;width:50px;">Sí ✓</th>
              <th style="border:1px solid #000;padding:3px;width:75px;">En proceso</th>
              <th style="border:1px solid #000;padding:3px;width:65px;">No todavía</th>
            </tr>
          </thead>
          <tbody>${filasCotejoHtml}</tbody>
        </table>
      </div>

      ${seccionRubricaHtml}

      <table style="width:100%;margin-top:35px;border-collapse:collapse;page-break-inside:avoid;">
        <tr>
          <td style="width:45%;text-align:center;border-top:1px solid #000;padding-top:4px;font-size:10px;">
            <strong>${escaparHtml(p.maestro || 'Docente Titular')}</strong><br>
            Firma del Docente
          </td>
          <td style="width:10%;"></td>
          <td style="width:45%;text-align:center;border-top:1px solid #000;padding-top:4px;font-size:10px;">
            <strong>Vo. Bo. Dirección / Subdirección</strong><br>
            Sello y Firma Escolar
          </td>
        </tr>
      </table>
    </div>
  `;
}
```

