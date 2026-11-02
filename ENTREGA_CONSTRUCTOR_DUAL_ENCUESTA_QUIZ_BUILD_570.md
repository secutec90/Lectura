# 📦 ENTREGA TÉCNICA: EVOLUCIÓN DUAL DEL CONSTRUCTOR (ENCUESTAS & QUIZ EVALUABLE) — `build-570`

**Fecha:** 2026-11-01  
**Módulo:** Motor de Formularios ST90 (`Formulario`, `Configuracion`, `Respuestas`)  
**Destino:** Integración en Google Apps Script (`main` / Directorio de Encuestas)

---

## 1\. Alcance y Arquitectura de la Evolución Dual

El motor de formularios (`constructor-antes-vinculacion.js`), estructurado originalmente sobre las hojas `Formulario`, `Configuracion` y `Respuestas`, evoluciona a un **Constructor Dual (Encuesta / Quiz Calificable)**:

1. **Modo Encuesta (Diagnóstico / Opinión):**  
     
   - Recaba percepciones, datos estadísticos y diagnósticos socioeducativos (ej. Censo de Movilidad, Acceso Digital).  
   - No asigna ponderación ni respuestas correctas.  
   - Alimenta el resumen pedagógico con IA y gráficas de grupo.

   

2. **Modo Quiz / Examen Formativo:**  
     
   - Cada reactivo declara su **respuesta correcta**, **puntos/ponderación** y **retroalimentación explicativa**.  
   - Admite reactivos de opción única, opción múltiple, verdadero/falso, escala/numérico y respuesta corta.  
   - Calificación automática instantánea calculando aciertos, nota sobre 10 y envío directo al expediente/matrícula del alumno.

---

## 2\. Ajustes al Esquema de la Hoja `Formulario`

La hoja `Formulario` conserva sus 11 columnas originales para mantener 100% de retrocompatibilidad, aprovechando la columna 11 (`extra`) para almacenar la metadata del quiz:

```json
{
  "esQuiz": true,
  "puntos": 2,
  "respuestaCorrecta": "B",
  "retroalimentacion": "El ciclo del agua se ve alterado principalmente por el drenaje y la basura acumulada.",
  "aleatorizarOpciones": true
}
```

La hoja `Configuracion` agrega las claves de evaluación:

- `tipoFormulario`: `"encuesta"` \| `"quiz"`  
- `puntosTotales`: Valor numérico (ej. `10` o `100`).  
- `intentosPermitidos`: `1`, `2`, `3` o `0` (ilimitados).  
- `mostrarRetroalimentacion`: `"inmediata"` \| `"al_cerrar"` \| `"nunca"`

---

## 3\. Backend: Extensión del Motor en Google Apps Script

Agrega estos métodos a tu archivo de backend del constructor de encuestas/quizzes:

```js
/**
 * Evalúa las respuestas enviadas por el alumno y calcula su calificación automática.
 */
function calificarQuizAlumnoST90(payload) {
  try {
    const matricula = String(payload.matricula || '').trim();
    const idFormulario = String(payload.idFormulario || '').trim();
    const respuestasAlumno = payload.respuestas || {};

    if (!matricula || !idFormulario) {
      return { ok: false, error: 'Matrícula e Identificador de formulario son requeridos.' };
    }

    const preguntas = leerPreguntas(true);
    let puntosObtenidos = 0;
    let puntosPosibles = 0;
    const desglose = [];

    preguntas.forEach(function(p) {
      const extra = p.extra || {};
      const esPreguntaQuiz = extra.esQuiz || (extra.puntos > 0);
      
      if (!esPreguntaQuiz) return;

      const pts = Number(extra.puntos || 1);
      puntosPosibles += pts;

      const respDada = respuestasAlumno[p.id];
      const respCorrecta = extra.respuestaCorrecta;
      let esAcierto = false;

      if (p.tipo === 'unica' || p.tipo === 'sino') {
        esAcierto = String(respDada).trim().toLowerCase() === String(respCorrecta).trim().toLowerCase();
      } else if (p.tipo === 'multiple') {
        // Validación de arreglos
        const arrDada = Array.isArray(respDada) ? respDada.map(x => String(x).trim().toLowerCase()).sort() : [];
        const arrCorr = Array.isArray(respCorrecta) ? respCorrecta.map(x => String(x).trim().toLowerCase()).sort() : [];
        esAcierto = (JSON.stringify(arrDada) === JSON.stringify(arrCorr));
      } else if (p.tipo === 'numero' || p.tipo === 'texto') {
        esAcierto = String(respDada).trim().toLowerCase() === String(respCorrecta).trim().toLowerCase();
      }

      if (esAcierto) puntosObtenidos += pts;

      desglose.push({
        id: p.id,
        etiqueta: p.etiqueta,
        acierto: esAcierto,
        puntosGanados: esAcierto ? pts : 0,
        puntosPosibles: pts,
        retroalimentacion: extra.retroalimentacion || ''
      });
    });

    const notaEscala10 = puntosPosibles > 0 
      ? Math.round(((puntosObtenidos / puntosPosibles) * 10) * 10) / 10 
      : 10;

    // Registrar en la hoja de respuestas
    const ss = getLibro();
    let hojaResp = ss.getSheetByName(HOJA_RESPUESTAS);
    if (hojaResp) {
      const fila = [
        new Date(),
        "Quiz-" + matricula,
        matricula,
        notaEscala10,
        puntosObtenidos + "/" + puntosPosibles,
        JSON.stringify(desglose)
      ];
      hojaResp.appendRow(fila);
    }

    return {
      ok: true,
      calificacion: notaEscala10,
      puntosObtenidos: puntosObtenidos,
      puntosPosibles: puntosPosibles,
      desglose: desglose
    };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
```

---

## 4\. Frontend: Selector de Modo y Editor de Reactivos

En la interfaz del constructor de encuestas, se incorpora la barra de cambio de modalidad y los campos de reactivo calificable:

```html
<!-- Selector de Modo en Cabecera del Constructor -->
<div class="constructor-modo-switch" style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:14px;">
  <span style="font-weight:700;font-size:12.5px;color:#1e293b;">Modalidad del Formulario:</span>
  <label style="font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;">
    <input type="radio" name="tipoFormularioST90" value="encuesta" checked onchange="conmutarModoConstructor(this.value)">
    📊 Encuesta / Diagnóstico (Sin calificación)
  </label>
  <label style="font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;">
    <input type="radio" name="tipoFormularioST90" value="quiz" onchange="conmutarModoConstructor(this.value)">
    📝 Quiz Evaluativo (Con respuestas correctas y puntos)
  </label>
</div>

<!-- Bloque añadido a cada tarjeta de pregunta en el constructor -->
<div class="caja-ajustes-quiz oculto" style="margin-top:10px;padding:8px 12px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;">
  <div style="display:grid;grid-template-columns:100px 1fr;gap:10px;align-items:center;">
    <div>
      <label style="font-size:11px;font-weight:700;color:#1e40af;display:block;">Puntos:</label>
      <input type="number" class="quiz-puntos-input" value="1" min="1" max="10" style="width:100%;font-size:12px;padding:4px;">
    </div>
    <div>
      <label style="font-size:11px;font-weight:700;color:#1e40af;display:block;">Respuesta Correcta:</label>
      <input type="text" class="quiz-correcta-input" placeholder="Texto o clave exacta de la opción correcta" style="width:100%;font-size:12px;padding:4px;">
    </div>
  </div>
  <div style="margin-top:6px;">
    <label style="font-size:11px;font-weight:700;color:#1e40af;display:block;">Retroalimentación explicativa (para el alumno):</label>
    <input type="text" class="quiz-retro-input" placeholder="Explica por qué esta opción es la correcta..." style="width:100%;font-size:12px;padding:4px;">
  </div>
</div>
```

```js
/* Lógica de conmutación en el cliente */
function conmutarModoConstructor(modo) {
  const esQuiz = (modo === 'quiz');
  document.querySelectorAll('.caja-ajustes-quiz').forEach(function(caja) {
    caja.classList.toggle('oculto', !esQuiz);
  });
  const btnGuardar = document.getElementById('btnGuardarFormulario');
  if (btnGuardar) {
    btnGuardar.textContent = esQuiz ? '💾 Guardar Quiz Calificable' : '💾 Guardar Encuesta';
  }
}
```

