# 📦 ENTREGA TÉCNICA: INTEGRACIÓN DE ENCUESTAS EN EL CONSTRUCTOR DE CLASES (build-569)

**Fecha:** 2026-11-01  
**Módulo:** Constructor de Clases (eXeLearning ST90) \+ Directorio de Encuestas  
**Destino:** Integración para Antigravity / Google Apps Script

---

## 1\. Alcance de la Integración

El Constructor de Clases dispone de un nuevo **iDevice: Encuesta / Diagnóstico Socioeducativo**, el cual opera en dos modalidades según la decisión del docente:

1. **Modo Consulta de Datos Previos (Andamiaje Diagnóstico):**  
     
   - Conecta con la hoja central del **Directorio de Encuestas** (`DirectorioEncuestas` en `15_DirectorioEncuentas.gs`) y el catálogo institucional base ST90.  
   - Permite al docente filtrar por Asignatura, Grado y Trimestre para importar métricas, porcentajes clave y el resumen pedagógico generado con IA.  
   - Estos datos se incrustan en la clase como lectura, infografía o detonador de reflexión comunitaria para los estudiantes.

   

2. **Modo Encuesta Activa como Tarea/Actividad:**  
     
   - Asigna una encuesta diagnóstica o de satisfacción como actividad interactiva de clase.  
   - Registra de forma individual la respuesta de cada alumno vinculada a su **Matrícula / ID**.  
   - Notifica al libro de calificaciones o bandeja de actividades que el alumno ha completado la encuesta (marcando la actividad como entregada o asignando puntaje formativo configurable).

---

## 2\. Backend: Endpoints en `15_DirectorioEncuentas.gs` / `PlaneacionNEM.gs`

```js
/**
 * Obtiene el catálogo de encuestas disponibles para el Constructor de Clases
 * filtradas por Asignatura, Grado y Trimestre (incluye base ST90 y personalizadas).
 */
function obtenerCatalogoEncuestasParaConstructor(token, filtros) {
  try {
    filtros = filtros || {};
    const asig = String(filtros.asignatura || '').trim().toLowerCase();
    const gr = String(filtros.grado || '').trim();
    const trim = String(filtros.trimestre || '').trim();

    // 1. Obtener encuestas registradas en el Directorio
    const directorio = _leerDirectorioEncuestas_() || [];
    
    // 2. Obtener base institucional ST90
    const baseST90 = (typeof _catalogoEncuestasBaseST90_ === 'function') 
      ? _catalogoEncuestasBaseST90_() 
      : [];

    const combinadas = [];
    const idsVistos = {};

    [...directorio, ...baseST90].forEach(function(item) {
      const id = String(item.id || item.Id || item.hojaId || '');
      if (!id || idsVistos[id]) return;
      idsVistos[id] = true;

      const itemAsig = String(item.asignatura || item.Asignatura || '').toLowerCase();
      const itemGr = String(item.grado || item.Grado || '');
      const itemTrim = String(item.trimestre || item.Trimestre || '');

      let coincide = true;
      if (asig && itemAsig && itemAsig.indexOf(asig) < 0 && asig.indexOf(itemAsig) < 0) coincide = false;
      if (gr && itemGr && itemGr.indexOf(gr) < 0) coincide = false;
      if (trim && itemTrim && itemTrim.indexOf(trim) < 0) coincide = false;

      combinadas.push({
        id: id,
        nombre: item.nombre || item.Nombre || 'Encuesta Institucional',
        asignatura: item.asignatura || item.Asignatura || '',
        grado: item.grado || item.Grado || '',
        trimestre: item.trimestre || item.Trimestre || '',
        hojaId: item.hojaId || item.HojaId || '',
        preguntas: Number(item.preguntas || item.Preguntas || 0),
        respuestas: Number(item.respuestas || item.Respuestas || 0),
        resumenIA: item.resumen || item.ResumenIA || '',
        resumenFecha: item.resumenFecha || item.ResumenFecha || ''
      });
    });

    return { ok: true, encuestas: combinadas };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Registra la entrega/respuesta de un alumno al contestar una encuesta asignada como actividad.
 */
function registrarEntregaEncuestaAlumno(tokenAlumno, payload) {
  try {
    const matricula = String(payload.matricula || '').trim();
    const idClase = String(payload.idClase || '').trim();
    const idActividad = String(payload.idActividad || '').trim();
    const idEncuesta = String(payload.idEncuesta || '').trim();
    const respuestas = payload.respuestas || {};

    if (!matricula || !idEncuesta) {
      return { ok: false, error: 'Matrícula e Id de encuesta son obligatorios.' };
    }

    // 1. Guardar respuesta en la hoja de respuestas de la encuesta
    // 2. Marcar en la lista de actividades del alumno como completada
    const libro = _obtenerLibro_();
    if (libro) {
      let hojaEntregas = libro.getSheetByName("EntregasActividades");
      if (!hojaEntregas) {
        hojaEntregas = libro.insertSheet("EntregasActividades");
        hojaEntregas.appendRow(["Fecha", "Matricula", "IdClase", "IdActividad", "Tipo", "IdReferencia", "Calificacion", "Estado"]);
      }
      hojaEntregas.appendRow([
        new Date(),
        matricula,
        idClase,
        idActividad,
        "Encuesta",
        idEncuesta,
        payload.ponderacion || 10,
        "Entregado"
      ]);
    }

    return { ok: true, mensaje: 'Encuesta completada y registrada en tus actividades.' };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
```

---

## 3\. Frontend: Componente iDevice de Encuestas (`ConstructorEncuestasJS.html`)

```html
<!-- Plantilla del iDevice: Encuesta Diagnóstica o Actividad -->
<template id="tpl-idevice-encuesta">
  <div class="idevice-bloque card-idevice" data-tipo="encuesta">
    <div class="idevice-cab">
      <div class="idevice-cab-izq">
        <span class="idevice-icono">📊</span>
        <strong class="idevice-titulo">iDevice: Encuesta Diagnóstica / Actividad</strong>
      </div>
      <div class="idevice-cab-der">
        <button type="button" class="btn-secundario" onclick="eliminarIDevice(this)">✕</button>
      </div>
    </div>
    
    <div class="idevice-cuerpo" style="padding:12px;">
      <div style="margin-bottom:10px;">
        <label style="font-weight:700;font-size:12px;display:block;margin-bottom:4px;">Propósito pedagógico en esta clase:</label>
        <div style="display:flex;gap:12px;">
          <label style="font-size:12px;cursor:pointer;">
            <input type="radio" name="modoEncuesta__{{ID}}" value="datos_previos" checked onchange="cambiarModoEncuesta(this, '{{ID}}')">
            📈 Presentar datos de encuestas pasadas (Lectura / Análisis)
          </label>
          <label style="font-size:12px;cursor:pointer;">
            <input type="radio" name="modoEncuesta__{{ID}}" value="actividad_activa" onchange="cambiarModoEncuesta(this, '{{ID}}')">
            ✍️ Aplicar encuesta a los alumnos como Actividad evaluable
          </label>
        </div>
      </div>

      <!-- Selector de Encuesta del Directorio -->
      <div style="margin-bottom:10px;">
        <label style="font-size:12px;display:block;margin-bottom:3px;font-weight:600;">Seleccionar Encuesta del Directorio Escolar:</label>
        <select class="sel-encuesta-origen" style="width:100%;font-size:12px;" onchange="alElegirEncuestaConstructor(this, '{{ID}}')">
          <option value="">-- Cargando encuestas disponibles... --</option>
        </select>
      </div>

      <!-- Panel Modo 1: Datos Previos y Resumen IA -->
      <div class="panel-datos-previos" id="panelDatosPrevios__{{ID}}" style="background:#f8fafc;padding:10px;border-radius:8px;border:1px solid #e2e8f0;">
        <div style="font-size:11.5px;color:#0369a1;margin-bottom:6px;font-weight:700;">
          💡 Resumen y Métricas detectadas (IA ST90):
        </div>
        <textarea class="txt-resumen-encuesta" style="width:100%;min-height:75px;font-size:12px;border:1px solid #cbd5e1;border-radius:6px;padding:6px;" placeholder="El resumen de los resultados aparecerá aquí..."></textarea>
        <label style="font-size:11px;display:block;margin-top:6px;color:#64748b;">
          <input type="checkbox" class="chk-incluir-graficas" checked> Mostrar a los alumnos la gráfica comparativa de respuestas del grupo.
        </label>
      </div>

      <!-- Panel Modo 2: Parámetros de Actividad / Tarea -->
      <div class="panel-actividad-encuesta oculto" id="panelActividadEncuesta__{{ID}}" style="background:#fffbeb;padding:10px;border-radius:8px;border:1px solid #fef3c7;">
        <div style="font-size:11.5px;color:#92400e;margin-bottom:6px;font-weight:700;">
          ⚙️ Parámetros de Entrega y Ponderación:
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div>
            <label style="font-size:11px;display:block;font-weight:600;">Ponderación en la Clase / Trimestre:</label>
            <input type="number" class="inp-ponderacion-encuesta" value="10" min="1" max="100" style="width:100%;font-size:12px;">
          </div>
          <div>
            <label style="font-size:11px;display:block;font-weight:600;">Registro individual del alumno:</label>
            <select class="sel-registro-modo" style="width:100%;font-size:12px;">
              <option value="vinculado">Vinculado a Matrícula (Requerido para Calificación)</option>
              <option value="anonimo">Anónimo con pase de lista automático</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

```js
/* Lógica del iDevice de Encuestas en el Constructor */
function cambiarModoEncuesta(radio, id) {
  const esDatos = (radio.value === 'datos_previos');
  const pDatos = document.getElementById('panelDatosPrevios__' + id);
  const pAct = document.getElementById('panelActividadEncuesta__' + id);
  if (pDatos && pAct) {
    pDatos.classList.toggle('oculto', !esDatos);
    pAct.classList.toggle('oculto', esDatos);
  }
}

function cargarEncuestasEnIDevice(selectEl) {
  const asig = (document.getElementById('planAsignatura') || {}).value || '';
  const gr = (document.getElementById('planGrado') || {}).value || '1';
  const tk = (typeof getTokenPlan_ === 'function') ? getTokenPlan_() : '';

  if (typeof gsRun === 'function') {
    gsRun('obtenerCatalogoEncuestasParaConstructor', tk, { asignatura: asig, grado: gr }).then(function(res) {
      if (res && res.ok && Array.isArray(res.encuestas)) {
        selectEl.innerHTML = '<option value="">-- Elige una encuesta institucional --</option>' + 
          res.encuestas.map(function(enc) {
            return '<option value="' + escaparHtml(JSON.stringify(enc)) + '">' +
              escaparHtml(enc.nombre + ' (' + enc.grado + ' · ' + enc.trimestre + ' — ' + enc.respuestas + ' respuestas)') +
              '</option>';
          }).join('');
      }
    });
  }
}

function alElegirEncuestaConstructor(sel, id) {
  if (!sel.value) return;
  try {
    const enc = JSON.parse(sel.value);
    const pnl = document.getElementById('panelDatosPrevios__' + id);
    if (pnl) {
      const txt = pnl.querySelector('.txt-resumen-encuesta');
      if (txt) txt.value = enc.resumenIA || 'Sin resumen disponible aún.';
    }
  } catch(e) {}
}
```

