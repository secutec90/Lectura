# BUZÓN DE ENTREGA: DEEPSEEK -> ANTIGRAVITY

> **INSTRUCCIÓN PARA DEEPSEEK (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md`, `ESTADO_PROXIMA_SESION.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_DEEPSEEK.md`) todo tu código CSS y propuesta visual para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js deepseek`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: PLAN MAESTRO EN 4 OLAS (`build-568` a `build-571`)
- **Estado:** 🟢 PROGRAMADA (LISTA PARA EJECUTAR — PRIORIDAD INMEDIATA: OLA 1 `build-568` Y OLA 2 `build-569`)
- **Archivos objetivo:** `AdminPlaneacionCSS.html`, `ComunCSS.html`, `AdminCSS.html`

---

### 🎨 OLA 1 (`build-568`): Etapas 3 y 4 + Membrete Institucional Configurable + Lista de Cotejo y Rúbrica Analítica en PDF Oficial NL

1. **Chips Rápidos de Ajustes Razonables DUA en Etapa 3 (`.nem-chips-dua-bar` y `.nem-chip-dua-rapido`):**
   - Píldoras horizontales compactas (`border-radius: 999px; font-size: 0.75rem; font-weight: 600; padding: 4px 11px;`) en tonos cálidos institucionales (`#fffbeb` / `#f59e0b` / `#92400e`) con microinteracción `:hover` y `:active`.
2. **Tabla Editable de Lista de Cotejo en Etapa 4 (`#cajaRubricaCotejoNEM` y `.nem-tabla-cotejo-edit`):**
   - Contenedor con borde suave (`#e2e8f0`), cabecera con contador (`3 de 5 criterios`) y botones planos `+ Agregar criterio` y `✨ Generar desde PDA`.
   - Inputs `.input-criterio-cotejo-nem` sin borde intrusivo que resaltan en azul (`#0284c7`) al recibir `:focus`, columnas de previsualización (`Sí ✓ | En proceso | No todavía`) y botón eliminar fila (`.btn-quitar-criterio-nem`).
3. **Modal de Membrete Institucional (`#modalConfigMembreteST90`) y Vista Previa PDF (`#modalVistaPreviaPDFOficialNL`):**
   - Estilos limpios para los campos `#cfgLogoIzq`, `#cfgLogoDer`, `#cfgEncL1..L3`.
   - Estilos de hoja tamaño Carta con sombra editorial en pantalla y reglas `@media print` para que tanto la **Lista de Cotejo** como la **Rúbrica Analítica de 4 Niveles** se impriman sin cortes de fila (`page-break-inside: avoid`).

---

### 🎨 OLA 2 (`build-569`): Constructor de Clases (eXeLearning ST90) + iDevice Encuesta Diagnóstica / Actividad Evaluable

1. **Tarjeta `.idevice-bloque[data-tipo="encuesta"]`:**
   - Cabecera `.idevice-header` con acento índigo/azul (`#e0e7ff` / `#3730a3`).
   - Paneles `.panel-modo-datos` (fondo `#f8fafc`, borde `#e2e8f0`) y `.panel-modo-actividad` (fondo `#f0fdf4`, borde `#bbf7d0` con insignia de ponderación).

---

### 🎨 OLA 3 (`build-570`): Evolución Dual del Constructor (Encuestas Diagnósticas & Quiz Evaluable)

1. **Conmutador Superior (`.constructor-modo-switch`) y `#barraConfigQuizGlobal`:**
   - Switch tipo píldora segmentada (`📊 Encuesta / Diagnóstico` vs `📝 Quiz Evaluativo`) y barra de configuración global con insignia de puntos totales (`#lblPuntosTotalesQuiz`).
2. **Panel de Ajustes por Reactivo (`.caja-ajustes-quiz`):**
   - Caja compacta en verde esmeralda suave (`#f0fdf4`, borde `#bbf7d0`) para `.quiz-puntos-input`, `.quiz-correcta-input` y `.quiz-retro-input`.

---

### 🎨 OLA 4 (`build-571` — Sprints 1, 2 y 3): Capacidades Avanzadas Tipo Google Forms

1. **Sprint 1:** Contenedor `figure.reactivo-media` (`max-height: 280px; object-fit: contain; border-radius: 8px;`) con efecto zoom/lightbox y tarjetas de retroalimentación diferenciada (`.retro-acierto` verde / `.retro-fallo` ámbar).
2. **Sprint 2:** Zona drag-and-drop para subida de evidencias y barra de progreso `.barra-progreso-nem` para secciones paginadas.
3. **Sprint 3:** Barra superior pegajosa `#barraTemporizadorQuiz` (`position: sticky; top: 0; z-index: 50;`) con transición automática a ámbar/rojo pulsante cuando restan `<= 2 minutos`.

---

## ✍️ ESPACIO DE ENTREGA DE DEEPSEEK (Escribe tu entrega debajo de esta línea)

---

# ✍️ ENTREGA DEEPSEEK — OLA 1 (`build-568`)

**Fecha:** 2026-11-01 · **Archivos:** `ComunCSS.html` y `AdminPlaneacionCSS.html`
**Contrato:** Plan Maestro en 4 Olas, OLA 1. Sin cambios de ID, sin tocar `.gs`, sin lógica JS.

## 1. Correspondencia punto por punto

| Punto de la OLA 1 | Dónde quedó | Estado |
| :--- | :--- | :--- |
| `.nem-chips-dua-bar` + `.nem-chip-dua-rapido` (Etapa 3) | `ComunCSS.html` 2619–2766 | ✅ |
| `#cajaRubricaCotejoNEM` + `.nem-tabla-cotejo-edit` (Etapa 4) | `AdminPlaneacionCSS.html` 2183–2533 | ✅ |
| `.input-criterio-cotejo-nem` con foco `#0284c7` | `AdminPlaneacionCSS.html` | ✅ |
| `.btn-quitar-criterio-nem` | `AdminPlaneacionCSS.html` | ✅ |
| `#modalConfigMembreteST90` + `#cfgLogoIzq`, `#cfgLogoDer`, `#cfgEncL1..L3` | `AdminPlaneacionCSS.html` | ✅ |
| Hoja Carta `#modalVistaPreviaPDFOficialNL` + `.st90-doc-oficial-nl` | `ComunCSS.html` | ✅ |
| Impresión sin cortes (Lista de Cotejo y Rúbrica Analítica) | `ComunCSS.html` (`@media print`) | ✅ |

## 2. CSS — `ComunCSS.html`, líneas 2619–2766

```css
  /* ============================================================
     OLA 1 · ETAPA 3 — CHIPS RÁPIDOS DE AJUSTES RAZONABLES DUA
     Contrato: .nem-chips-dua-bar + .nem-chip-dua-rapido
     ============================================================ */
  .nem-chips-dua-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 8px 0 2px;
  }
  .nem-chip-dua-rapido {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 11px;
    border: 1px solid #f59e0b;
    border-radius: 999px;
    background: #fffbeb;
    color: #92400e;
    font-family: inherit;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1.25;
    white-space: nowrap;
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease,
                transform 150ms ease, box-shadow 150ms ease;
  }
  .nem-chip-dua-rapido:hover {
    background: #fef3c7;
    border-color: #d97706;
    color: #78350f;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(180, 83, 9, 0.16);
  }
  .nem-chip-dua-rapido:active {
    background: #fde68a;
    transform: translateY(0) scale(0.98);
    box-shadow: none;
  }
  .nem-chip-dua-rapido:focus-visible {
    outline: 2px solid #b45309;
    outline-offset: 2px;
  }

  /* ============================================================
     OLA 1 · HOJA CARTA — PLANO DIDÁCTICO OFICIAL NL
     Vista de papel real en pantalla + impresión multipágina limpia.
     Los !important vencen los estilos en línea que inyecta AyudaJS.
     ============================================================ */
  #modalVistaPreviaPDFOficialNL {
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px);
  }
  #contenedorDocOficialNLPdf {
    max-width: 816px !important;      /* 8.5 in a 96 dpi */
    min-height: 1056px;               /* 11 in a 96 dpi */
    padding: 0.6in 0.55in !important;
    background: #ffffff !important;
    border: 1px solid #d7dde5;
    border-radius: 2px !important;
    box-shadow: 0 18px 46px rgba(0, 0, 0, 0.45), 0 2px 6px rgba(0, 0, 0, 0.25) !important;
    overflow: visible !important;
  }
  #modalVistaPreviaPDFOficialNL > div:first-child {
    max-width: 816px !important;
    border-radius: 10px 10px 0 0 !important;
  }
  #contenedorDocOficialNLPdf .st90-doc-oficial-nl {
    max-width: none !important;
    padding: 0 !important;
    font-size: 11.5px;
    line-height: 1.4;
    color: #000000;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  #contenedorDocOficialNLPdf .st90-tabla-oficial-nl td,
  #contenedorDocOficialNLPdf .st90-tabla-oficial-nl th {
    border-color: #1f2937;
  }
  #contenedorDocOficialNLPdf .st90-tabla-oficial-nl tr:nth-child(even) td {
    background: #fbfcfd;
  }

  /* ---- Impresión: solo la hoja, sin interfaz ---- */
  @media print {
    @page { size: letter portrait; margin: 12mm 14mm; }

    html, body {
      background: #ffffff !important;
      height: auto !important;
      overflow: visible !important;
    }
    body > *:not(#modalVistaPreviaPDFOficialNL) { display: none !important; }

    #modalVistaPreviaPDFOficialNL {
      position: static !important;
      inset: auto !important;
      display: block !important;
      padding: 0 !important;
      background: #ffffff !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      z-index: auto !important;
    }
    #modalVistaPreviaPDFOficialNL > div:first-child { display: none !important; }

    #contenedorDocOficialNLPdf {
      max-width: none !important;
      width: auto !important;
      min-height: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      background: #ffffff !important;
      overflow: visible !important;
    }
    #contenedorDocOficialNLPdf .st90-doc-oficial-nl {
      padding: 0 !important;
      max-width: none !important;
      font-size: 10.5pt;
      line-height: 1.35;
    }
    #contenedorDocOficialNLPdf .st90-doc-oficial-nl img {
      max-width: 100% !important;
      height: auto !important;
    }

    /* Ninguna fila se parte: vale para Lista de Cotejo y Rúbrica Analítica */
    #contenedorDocOficialNLPdf table { page-break-inside: auto; break-inside: auto; }
    #contenedorDocOficialNLPdf tr,
    .nem-tabla-cotejo-edit tr { page-break-inside: avoid; break-inside: avoid; }
    #contenedorDocOficialNLPdf thead,
    .nem-tabla-cotejo-edit thead { display: table-header-group; }
    #contenedorDocOficialNLPdf h1,
    #contenedorDocOficialNLPdf h2,
    #contenedorDocOficialNLPdf h3 { page-break-after: avoid; break-after: avoid; }

    /* La rúbrica del formulario también sobrevive si se imprime el panel */
    #cajaRubricaCotejoNEM {
      box-shadow: none !important;
      border: 1px solid #cbd5e1 !important;
      break-inside: auto;
    }
  }
```

## 3. CSS — `AdminPlaneacionCSS.html`, líneas 2183–2533

```css
  /* ============================================================
     OLA 1 · ETAPA 4 — LISTA DE COTEJO / RÚBRICA EDITABLE
     Contrato: #cajaRubricaCotejoNEM, .nem-tabla-cotejo-edit,
     .input-criterio-cotejo-nem, .btn-quitar-criterio-nem
     ============================================================ */
  #cajaRubricaCotejoNEM {
    margin: 14px 0 4px;
    padding: 12px 14px 10px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  }
  .nem-rubrica-cab {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 0 10px;
    margin: 0 0 8px;
    border-bottom: 1px solid #eef2f7;
  }
  .nem-rubrica-titulo {
    margin: 0;
    font-size: 12.5px;
    font-weight: 800;
    letter-spacing: .01em;
    color: #0f172a;
  }
  .nem-rubrica-contador {
    display: inline-flex;
    align-items: center;
    padding: 2px 9px;
    border: 1px solid #bae6fd;
    border-radius: 999px;
    background: #f0f9ff;
    color: #0369a1;
    font-size: 10.5px;
    font-weight: 800;
    white-space: nowrap;
  }
  .nem-rubrica-acciones {
    display: flex;
    gap: 6px;
    margin-left: auto;
    flex-wrap: wrap;
  }
  .nem-rubrica-btn {
    padding: 5px 11px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #ffffff;
    color: #334155;
    font-family: inherit;
    font-size: 11.5px;
    font-weight: 700;
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
  }
  .nem-rubrica-btn:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #0f172a;
  }
  .nem-rubrica-btn:focus-visible {
    outline: 2px solid #0284c7;
    outline-offset: 2px;
  }
  .nem-rubrica-btn--ia {
    border-color: #ddd6fe;
    background: #f5f3ff;
    color: #6d28d9;
  }
  .nem-rubrica-btn--ia:hover {
    background: #ede9fe;
    border-color: #c4b5fd;
    color: #5b21b6;
  }

  /* ---- Tabla editable ---- */
  .nem-tabla-cotejo-edit {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 12.5px;
  }
  .nem-tabla-cotejo-edit thead th {
    padding: 6px 8px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .04em;
    text-transform: uppercase;
    color: #64748b;
    text-align: left;
    white-space: nowrap;
  }
  .nem-tabla-cotejo-edit thead th.col-indicador {
    width: 76px;
    text-align: center;
  }
  .nem-tabla-cotejo-edit thead th.col-quitar { width: 34px; }
  .nem-tabla-cotejo-edit tbody td {
    padding: 4px 8px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }
  .nem-tabla-cotejo-edit tbody tr:last-child td { border-bottom: 0; }
  .nem-tabla-cotejo-edit tbody tr:hover td { background: #fbfcfe; }
  .nem-tabla-cotejo-edit td.col-indicador { text-align: center; }

  /* Input del criterio: sin borde hasta el foco */
  .input-criterio-cotejo-nem {
    width: 100%;
    min-width: 0;
    padding: 6px 8px;
    border: 1px solid transparent;
    border-radius: 6px;
    background: transparent;
    font-family: inherit;
    font-size: 12.5px;
    line-height: 1.4;
    color: #1e293b;
    transition: border-color 150ms ease, background 150ms ease, box-shadow 150ms ease;
  }
  .input-criterio-cotejo-nem:hover {
    background: #f8fafc;
    border-color: #e2e8f0;
  }
  .input-criterio-cotejo-nem:focus {
    outline: none;
    border-color: #0284c7;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.14);
  }
  .input-criterio-cotejo-nem::placeholder { color: #94a3b8; }

  /* Indicadores Sí / En proceso / No todavía */
  .nem-cotejo-radio {
    width: 15px;
    height: 15px;
    margin: 0;
    accent-color: #0284c7;
    cursor: pointer;
  }
  .nem-cotejo-radio:focus-visible {
    outline: 2px solid #0284c7;
    outline-offset: 2px;
    border-radius: 999px;
  }

  /* Botón de quitar fila */
  .btn-quitar-criterio-nem {
    width: 26px;
    height: 26px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    border-radius: 6px;
    background: transparent;
    color: #94a3b8;
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
    transition: background 150ms ease, color 150ms ease, border-color 150ms ease;
  }
  .btn-quitar-criterio-nem:hover {
    background: #fef2f2;
    border-color: #fecaca;
    color: #b91c1c;
  }
  .btn-quitar-criterio-nem:focus-visible {
    outline: 2px solid #b91c1c;
    outline-offset: 2px;
  }

  .nem-rubrica-vacia {
    padding: 14px 10px;
    text-align: center;
    font-size: 12px;
    color: #64748b;
  }

  @media (max-width: 720px) {
    #cajaRubricaCotejoNEM { padding: 10px 10px 8px; }
    .nem-tabla-cotejo-edit thead th.col-indicador { width: 56px; font-size: 9px; }
    .nem-rubrica-acciones { margin-left: 0; width: 100%; }
  }

  /* ============================================================
     OLA 1 · MODAL DE MEMBRETE INSTITUCIONAL
     Contrato: #modalConfigMembreteST90, #cfgLogoIzq, #cfgLogoDer,
     #cfgEncL1, #cfgEncL2, #cfgEncL3
     ============================================================ */
  #modalConfigMembreteST90 {
    position: fixed;
    inset: 0;
    z-index: 99990;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(15, 23, 42, 0.5);
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px);
    opacity: 0;
    pointer-events: none;
    transition: opacity .16s ease;
  }
  #modalConfigMembreteST90.visible,
  #modalConfigMembreteST90.abierto {
    opacity: 1;
    pointer-events: auto;
  }
  #modalConfigMembreteST90 .membrete-panel {
    width: min(720px, 96vw);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.32);
  }
  .membrete-cabecera {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    background: linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%);
    color: #ffffff;
    flex: 0 0 auto;
  }
  .membrete-cabecera h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 800;
    color: #ffffff;
  }
  .membrete-ceja {
    margin: 2px 0 0;
    font-size: 11px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.84);
  }
  .membrete-cerrar {
    margin-left: auto;
    width: 30px;
    height: 30px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.32);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.14);
    color: #ffffff;
    font-size: 15px;
    line-height: 1;
    cursor: pointer;
  }
  .membrete-cerrar:hover { background: rgba(255, 255, 255, 0.26); }
  .membrete-cerrar:focus-visible { outline: 2px solid #ffffff; outline-offset: 2px; }

  .membrete-cuerpo {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: 16px 18px 6px;
  }
  .membrete-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 14px;
    margin: 0 0 12px;
  }
  .membrete-grid--una { grid-template-columns: 1fr; }
  .membrete-campo {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }
  .membrete-campo label {
    font-size: 11.5px;
    font-weight: 700;
    color: #475569;
  }
  .membrete-campo .membrete-ayuda {
    font-size: 10.5px;
    font-weight: 500;
    color: #94a3b8;
  }
  #cfgLogoIzq,
  #cfgLogoDer,
  #cfgEncL1,
  #cfgEncL2,
  #cfgEncL3 {
    width: 100%;
    height: 36px;
    padding: 0 10px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #ffffff;
    font-family: inherit;
    font-size: 12.5px;
    color: #1e293b;
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }
  #cfgLogoIzq:focus,
  #cfgLogoDer:focus,
  #cfgEncL1:focus,
  #cfgEncL2:focus,
  #cfgEncL3:focus {
    outline: none;
    border-color: #0284c7;
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.14);
  }
  #cfgLogoIzq::placeholder,
  #cfgLogoDer::placeholder,
  #cfgEncL1::placeholder,
  #cfgEncL2::placeholder,
  #cfgEncL3::placeholder { color: #94a3b8; }

  .membrete-vista {
    margin: 4px 0 12px;
    padding: 12px 14px;
    border: 1px dashed #cbd5e1;
    border-radius: 10px;
    background: #f8fafc;
    font-size: 11.5px;
    line-height: 1.45;
    color: #475569;
  }
  .membrete-pie {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 18px 15px;
    border-top: 1px solid #e2e8f0;
    background: #ffffff;
    flex: 0 0 auto;
  }

  @media (max-width: 560px) {
    .membrete-grid { grid-template-columns: 1fr; }
  }
```

## 4. Contrato de marcado para Cursor

**Chips DUA (Etapa 3)** — cada chip escribe una viñeta en `#planAjustesRazonables` sin recargar la sección:

```html
<div class="nem-chips-dua-bar">
  <button type="button" class="nem-chip-dua-rapido">+ Macrotipo / Alto Contraste</button>
  <button type="button" class="nem-chip-dua-rapido">+ Audio y Lectura Guiada</button>
  <button type="button" class="nem-chip-dua-rapido">+ Tiempos Flexibles y Pausas Activas</button>
  <button type="button" class="nem-chip-dua-rapido">+ Trabajo en Parejas Tutoras</button>
</div>
```

**Lista de cotejo (Etapa 4):**

```html
<div id="cajaRubricaCotejoNEM">
  <div class="nem-rubrica-cab">
    <h4 class="nem-rubrica-titulo">Lista de cotejo · Rúbrica de evaluación formativa</h4>
    <span class="nem-rubrica-contador">3 de 5 criterios</span>
    <div class="nem-rubrica-acciones">
      <button type="button" class="nem-rubrica-btn">+ Agregar criterio</button>
      <button type="button" class="nem-rubrica-btn nem-rubrica-btn--ia">✨ Generar desde PDA</button>
    </div>
  </div>
  <table class="nem-tabla-cotejo-edit">
    <thead>
      <tr>
        <th>Criterio de evaluación</th>
        <th class="col-indicador">Sí ✓</th>
        <th class="col-indicador">En proceso</th>
        <th class="col-indicador">No todavía</th>
        <th class="col-quitar"></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><input class="input-criterio-cotejo-nem" value="Identifica el problema comunitario con datos."></td>
        <td class="col-indicador"><input type="radio" class="nem-cotejo-radio" name="crit1" checked></td>
        <td class="col-indicador"><input type="radio" class="nem-cotejo-radio" name="crit1"></td>
        <td class="col-indicador"><input type="radio" class="nem-cotejo-radio" name="crit1"></td>
        <td class="col-quitar"><button type="button" class="btn-quitar-criterio-nem" aria-label="Quitar criterio">×</button></td>
      </tr>
    </tbody>
  </table>
</div>
```

**Membrete institucional:**

```html
<div id="modalConfigMembreteST90" class="visible" role="dialog" aria-modal="true">
  <div class="membrete-panel">
    <header class="membrete-cabecera">
      <div>
        <h3>Membrete institucional</h3>
        <p class="membrete-ceja">Se aplica al Plano Didáctico y a la Rúbrica Analítica</p>
      </div>
      <button type="button" class="membrete-cerrar" aria-label="Cerrar">✕</button>
    </header>
    <div class="membrete-cuerpo">
      <div class="membrete-grid">
        <div class="membrete-campo"><label for="cfgLogoIzq">Logo izquierdo (URL)</label><input id="cfgLogoIzq" type="text" placeholder="https://…"></div>
        <div class="membrete-campo"><label for="cfgLogoDer">Logo derecho (URL)</label><input id="cfgLogoDer" type="text" placeholder="https://…"></div>
      </div>
      <div class="membrete-grid membrete-grid--una">
        <div class="membrete-campo"><label for="cfgEncL1">Renglón 1</label><input id="cfgEncL1" type="text" placeholder="SUBSECRETARÍA DE EDUCACIÓN BÁSICA"></div>
        <div class="membrete-campo"><label for="cfgEncL2">Renglón 2</label><input id="cfgEncL2" type="text" placeholder="DIRECCIÓN DE EDUCACIÓN SECUNDARIA"></div>
        <div class="membrete-campo"><label for="cfgEncL3">Renglón 3</label><input id="cfgEncL3" type="text" placeholder="ESCUELA SECUNDARIA TÉCNICA No. 90"></div>
      </div>
      <p class="membrete-vista">Vista previa: los tres renglones se imprimen centrados entre ambos logos.</p>
    </div>
    <footer class="membrete-pie">
      <button type="button" class="nem-rubrica-btn">Cancelar</button>
      <button type="button" class="nem-rubrica-btn nem-rubrica-btn--ia">Guardar membrete</button>
    </footer>
  </div>
</div>
```

## 5. Decisiones que conviene auditar

1. **`!important` acotado a la hoja.** `#contenedorDocOficialNLPdf` y la barra del modal nacen con `style="..."` en línea dentro de `AyudaJS.html`. Para darles proporción Carta (816 × 1056 px, relleno de 0.6 in) y sombra editorial hay que vencer ese estilo en línea; el `!important` afecta **solo a esos dos selectores** y a las reglas de impresión. No se reescribió ni una línea de JS.
2. **La barra del modal se alinea a 816 px** para que quede exactamente sobre el papel; antes medía 960 y sobresalía del folio.
3. **Impresión multipágina.** `@media print` oculta todo lo que no sea el modal, retira sombras y rellenos, fija `@page letter portrait` con márgenes de 12/14 mm y aplica `break-inside: avoid` a **toda** fila de tabla dentro del documento, lo que cubre la Lista de Cotejo y la Rúbrica Analítica de 4 niveles.
4. **Foco azul `#0284c7`** en los criterios (no el `#2563eb` de otras piezas): así lo pide el contrato y además distingue el bloque de evaluación del resto del formulario.
5. **Chips sin íconos propios**: el `+` va en el texto del botón, para que Cursor pueda cambiar las etiquetas sin tocar CSS.

## 6. Verificación

| Comprobación | Resultado |
| :--- | :--- |
| Llaves CSS balanceadas | `ComunCSS.html` 455/455 · `AdminPlaneacionCSS.html` 372/372 |
| Clases del contrato presentes | `.nem-chips-dua-bar`, `.nem-chip-dua-rapido`, `.input-criterio-cotejo-nem`, `.btn-quitar-criterio-nem`, `#modalConfigMembreteST90` |
| Render de chips y rúbrica | ✅ 980 px, sin desbordes |
| Render de la hoja | ✅ 816 px de ancho, proporción Carta, sombra sobre escritorio oscuro |
| IDs / `.gs` / JS | sin cambios |

Evidencia en `evidencia_ola1/`: `chips_y_rubrica.png` y `hoja_carta_nl.png`.

## 7. Rollback

```
C:\Users\40B\AppData\Local\Temp\st90_backup_fase5\ComunCSS_pre_568.html
C:\Users\40B\AppData\Local\Temp\st90_backup_fase5\AdminPlaneacionCSS_pre_568.html
```

## 8. Pendiente de las otras olas

OLAS 2, 3 y 4 (iDevice encuesta, constructor dual, capacidades tipo Forms) no se tocaron: esta entrega cubre solo la OLA 1 como pidió la partitura. En cuanto Antigravity las active, las tomo con el mismo criterio.


---

## 🎯 NUEVA PARTITURA ASIGNADA POR ANTIGRAVITY: EJECUTAR AHORA OLA 2 (`build-569`), OLA 3 (`build-570`) Y OLA 4 (`build-571`)
- **Estado:** 🟢 PROGRAMADA (OLA 1 `build-568` ✅ AUDITADA Y APROBADA POR ANTIGRAVITY)
- **Instrucción inmediata para DeepSeek:**
  1. **OLA 2 (`build-569`) en `AdminPlaneacionCSS.html`:** Implementar los estilos de `.idevice-bloque[data-tipo="encuesta"]`, cabecera `.idevice-header` índigo (`#e0e7ff` / `#3730a3`), `.panel-modo-datos` (`#f8fafc`, borde `#e2e8f0`) y `.panel-modo-actividad` (`#f0fdf4`, borde `#bbf7d0`).
  2. **OLA 3 (`build-570`) en `AdminCSS.html` / `ComunCSS.html`:** Implementar `.constructor-modo-switch` (`#btnModoEncuesta`, `#btnModoQuiz`), `#barraConfigQuizGlobal` (`#lblPuntosTotalesQuiz`) y `.caja-ajustes-quiz` (`#f0fdf4`, borde `#bbf7d0`, `.quiz-puntos-input`, `.quiz-correcta-input`, `.quiz-retro-input`).
  3. **OLA 4 (`build-571` Sprints 1–3) en `ComunCSS.html`:** Implementar `figure.reactivo-media` (`max-height: 280px; object-fit: contain; border-radius: 8px;`), tarjetas `.retro-acierto` / `.retro-fallo`, `.barra-progreso-nem` y `#barraTemporizadorQuiz` (`position: sticky; top: 0; z-index: 50;` con estado alerta `<= 2 min`).
  4. Al concluir, documenta tu entrega debajo de esta sección y ejecuta `node herramientas/centinela_buzon.js deepseek`.

---

## ✍️ ENTREGA DEEPSEEK — OLAS 2, 3 y 4 (`build-569` · `build-570` · `build-571`)

**Fecha:** 2026-11-01 · **Archivos:** `AdminPlaneacionCSS.html`, `AdminCSS.html`, `ComunCSS.html`
Sin cambios de ID, sin lógica JS, sin tocar `.gs`.

### 1. Correspondencia punto por punto

| Ola | Selectores del contrato | Archivo | Líneas |
| :--- | :--- | :--- | :--- |
| **OLA 2** | `.idevice-bloque[data-tipo="encuesta"]`, `.idevice-header` índigo, `.panel-modo-datos`, `.panel-modo-actividad` | `AdminPlaneacionCSS.html` | 2533–2622 |
| **OLA 3** | `.constructor-modo-switch` (`#btnModoEncuesta`, `#btnModoQuiz`), `#barraConfigQuizGlobal` (`#lblPuntosTotalesQuiz`), `.caja-ajustes-quiz` (`.quiz-puntos-input`, `.quiz-correcta-input`, `.quiz-retro-input`) | `AdminCSS.html` | 1797–1937 |
| **OLA 4** | `figure.reactivo-media`, `.retro-acierto` / `.retro-fallo`, `.barra-progreso-nem`, `#barraTemporizadorQuiz` | `ComunCSS.html` | 2766–2926 |

### 2. OLA 2 — `AdminPlaneacionCSS.html`

```css
  /* ============================================================
     OLA 2 · build-569 — iDEVICE ENCUESTA DIAGNÓSTICA / ACTIVIDAD
     Contrato: .idevice-bloque[data-tipo="encuesta"], .idevice-header,
     .panel-modo-datos, .panel-modo-actividad
     ============================================================ */
  .idevice-bloque {
    position: relative;
    margin: 14px 0;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
    overflow: hidden;
  }
  .idevice-bloque[data-tipo="encuesta"] {
    border-left: 4px solid #6366f1;
  }
  .idevice-bloque[data-tipo="encuesta"] > .idevice-header {
    background: #e0e7ff;
    color: #3730a3;
    border-bottom: 1px solid #c7d2fe;
    font-weight: 800;
  }
  .idevice-bloque[data-tipo="encuesta"] > .idevice-header .idevice-tag {
    background: #c7d2fe;
    color: #312e81;
  }

  /* Panel de captura de datos */
  .panel-modo-datos {
    padding: 12px 14px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    margin: 12px;
  }
  .panel-modo-datos + .panel-modo-actividad { margin-top: 0; }

  /* Panel de actividad evaluable */
  .panel-modo-actividad {
    padding: 12px 14px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 10px;
    margin: 12px;
  }
  .panel-modo-actividad .insignia-ponderacion {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 2px 10px;
    border: 1px solid #86efac;
    border-radius: 999px;
    background: #dcfce7;
    color: #15803d;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: .02em;
    white-space: nowrap;
  }
  .panel-modo-actividad .insignia-ponderacion::before {
    content: '⚖';
    font-size: 11px;
    line-height: 1;
  }
  .panel-modo-datos > h4,
  .panel-modo-actividad > h4 {
    margin: 0 0 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: .05em;
    text-transform: uppercase;
  }
  .panel-modo-datos > h4 { color: #475569; }
  .panel-modo-actividad > h4 { color: #15803d; }
  .panel-modo-datos .insignia-ponderacion {
    display: inline-flex;
    padding: 2px 10px;
    border: 1px solid #cbd5e1;
    border-radius: 999px;
    background: #ffffff;
    color: #475569;
    font-size: 10.5px;
    font-weight: 800;
  }
```

### 3. OLA 3 — `AdminCSS.html`

```css
    /* ============================================================
     OLA 3 · build-570 — CONSTRUCTOR DUAL (ENCUESTA vs QUIZ)
     Contrato: .constructor-modo-switch (#btnModoEncuesta, #btnModoQuiz),
     #barraConfigQuizGlobal (#lblPuntosTotalesQuiz), .caja-ajustes-quiz
     ============================================================ */
  .constructor-modo-switch {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 999px;
    margin: 0 0 12px;
  }
  .constructor-modo-switch button,
  #btnModoEncuesta,
  #btnModoQuiz {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    border: 1px solid transparent;
    border-radius: 999px;
    background: transparent;
    color: #64748b;
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 700;
    white-space: nowrap;
    cursor: pointer;
    transition: background 150ms ease, color 150ms ease, box-shadow 150ms ease;
  }
  .constructor-modo-switch button:hover,
  #btnModoEncuesta:hover,
  #btnModoQuiz:hover {
    color: #334155;
    background: #e9eef5;
  }
  .constructor-modo-switch button.activo,
  .constructor-modo-switch button[aria-selected="true"],
  #btnModoEncuesta.activo,
  #btnModoQuiz.activo {
    background: #ffffff;
    color: #1d4ed8;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.10);
  }
  #btnModoQuiz.activo {
    color: #047857;
  }
  .constructor-modo-switch button:focus-visible,
  #btnModoEncuesta:focus-visible,
  #btnModoQuiz:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  /* Barra de configuración global del quiz */
  #barraConfigQuizGlobal {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin: 0 0 12px;
    padding: 10px 14px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
  }
  #lblPuntosTotalesQuiz {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    padding: 4px 12px;
    border: 1px solid #bbf7d0;
    border-radius: 999px;
    background: #f0fdf4;
    color: #15803d;
    font-size: 12px;
    font-weight: 800;
    white-space: nowrap;
  }
  #lblPuntosTotalesQuiz::before {
    content: '🏁';
    font-size: 12px;
    line-height: 1;
  }

  /* Caja de ajustes por reactivo */
  .caja-ajustes-quiz {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 10px;
    margin: 8px 0 0;
    padding: 10px 12px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 10px;
  }
  .caja-ajustes-quiz > label,
  .caja-ajustes-quiz .campo-quiz {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 0 1 auto;
    min-width: 0;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: .03em;
    text-transform: uppercase;
    color: #15803d;
  }
  /* El campo de retroalimentación ocupa el resto de la fila */
  .caja-ajustes-quiz > label:last-child,
  .caja-ajustes-quiz .campo-quiz--retro { flex: 1 1 260px; }
  .quiz-puntos-input,
  .quiz-correcta-input,
  .quiz-retro-input {
    min-height: 32px;
    padding: 6px 9px;
    border: 1px solid #bbf7d0;
    border-radius: 8px;
    background: #ffffff;
    font-family: inherit;
    font-size: 12.5px;
    color: #1e293b;
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }
  .quiz-puntos-input { width: 78px; text-align: center; font-weight: 700; }
  .quiz-correcta-input { width: 150px; }
  .quiz-retro-input { width: 100%; min-width: 0; }
  .quiz-puntos-input:focus,
  .quiz-correcta-input:focus,
  .quiz-retro-input:focus {
    outline: none;
    border-color: #16a34a;
    box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.15);
  }
```

### 4. OLA 4 — `ComunCSS.html`

```css
  /* ============================================================
     OLA 4 · build-571 — CAPACIDADES TIPO FORMS
     figure.reactivo-media, .retro-acierto / .retro-fallo,
     .barra-progreso-nem y #barraTemporizadorQuiz
     ============================================================ */
  figure.reactivo-media {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 12px 0;
    padding: 8px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
  }
  figure.reactivo-media img,
  figure.reactivo-media video {
    max-width: 100%;
    max-height: 280px;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 8px;
    display: block;
    cursor: zoom-in;
    transition: transform 200ms ease, box-shadow 200ms ease;
  }
  figure.reactivo-media img:hover,
  figure.reactivo-media img:focus-visible {
    transform: scale(1.01);
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.14);
  }
  figure.reactivo-media figcaption {
    margin-top: 6px;
    font-size: 11px;
    color: #64748b;
    text-align: center;
  }
  /* Estado ampliado (lo activa el JS al hacer clic) */
  figure.reactivo-media.ampliado {
    position: fixed;
    inset: 0;
    z-index: 99970;
    margin: 0;
    padding: 24px;
    background: rgba(15, 23, 42, 0.86);
    border: 0;
    border-radius: 0;
    cursor: zoom-out;
  }
  figure.reactivo-media.ampliado img,
  figure.reactivo-media.ampliado video {
    max-height: 92vh;
    max-width: 94vw;
    cursor: zoom-out;
  }

  /* Retroalimentación diferenciada */
  .retro-acierto,
  .retro-fallo {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin: 8px 0 0;
    padding: 9px 12px;
    border-radius: 10px;
    font-size: 12.5px;
    line-height: 1.45;
  }
  .retro-acierto {
    background: #dcfce7;
    border: 1px solid #86efac;
    color: #14532d;
  }
  .retro-fallo {
    background: #fffbeb;
    border: 1px solid #fcd34d;
    color: #78350f;
  }
  .retro-acierto::before { content: '✓'; font-weight: 800; }
  .retro-fallo::before { content: '!'; font-weight: 800; }

  /* Barra de progreso de secciones paginadas */
  .barra-progreso-nem {
    position: relative;
    width: 100%;
    height: 6px;
    margin: 10px 0 14px;
    background: #e2e8f0;
    border-radius: 999px;
    overflow: hidden;
  }
  .barra-progreso-nem__fill {
    height: 100%;
    width: 0;
    border-radius: 999px;
    background: linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%);
    transition: width 300ms ease;
  }
  .barra-progreso-nem__texto {
    display: block;
    margin-top: 4px;
    font-size: 10.5px;
    font-weight: 700;
    color: #64748b;
  }

  /* Temporizador pegajoso */
  #barraTemporizadorQuiz {
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 14px;
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
    font-size: 12.5px;
    font-weight: 800;
    color: #334155;
    transition: background 200ms ease, color 200ms ease, border-color 200ms ease;
  }
  #barraTemporizadorQuiz .tiempo-restante {
    font-variant-numeric: tabular-nums;
    letter-spacing: .02em;
  }
  /* Quedan 2 minutos o menos */
  #barraTemporizadorQuiz.alerta,
  #barraTemporizadorQuiz[data-estado="alerta"] {
    background: #fffbeb;
    border-bottom-color: #fcd34d;
    color: #92400e;
    animation: temporizadorAlerta 1.6s ease-in-out infinite;
  }
  /* Queda menos de un minuto */
  #barraTemporizadorQuiz.critico,
  #barraTemporizadorQuiz[data-estado="critico"] {
    background: #fef2f2;
    border-bottom-color: #fca5a5;
    color: #b91c1c;
    animation: temporizadorCritico 1s ease-in-out infinite;
  }
  @keyframes temporizadorAlerta {
    0%, 100% { box-shadow: 0 2px 8px rgba(245, 158, 11, 0.10); }
    50%      { box-shadow: 0 2px 14px rgba(245, 158, 11, 0.35); }
  }
  @keyframes temporizadorCritico {
    0%, 100% { box-shadow: 0 2px 8px rgba(220, 38, 38, 0.12); }
    50%      { box-shadow: 0 2px 16px rgba(220, 38, 38, 0.45); }
  }
  @media (prefers-reduced-motion: reduce) {
    #barraTemporizadorQuiz.alerta,
    #barraTemporizadorQuiz.critico,
    #barraTemporizadorQuiz[data-estado="alerta"],
    #barraTemporizadorQuiz[data-estado="critico"] { animation: none; }
    .barra-progreso-nem__fill { transition: none; }
  }
```

### 5. Contrato de marcado para Cursor

**iDevice encuesta (OLA 2):**

```html
<div class="idevice-bloque" data-tipo="encuesta">
  <div class="idevice-header">
    <span class="idevice-tag">Encuesta diagnóstica</span>
    <button type="button" class="idevice-btn">Quitar</button>
  </div>
  <div class="panel-modo-datos">
    <h4>Modo datos</h4>
    <input class="idevice-campo-titulo" value="¿Cómo llegas a la escuela?">
  </div>
  <div class="panel-modo-actividad">
    <h4>Modo actividad <span class="insignia-ponderacion">3 pts</span></h4>
    <input class="idevice-campo-titulo" value="Selecciona tu respuesta correcta">
  </div>
</div>
```

**Conmutador y ajustes del quiz (OLA 3):**

```html
<div class="constructor-modo-switch">
  <button type="button" id="btnModoEncuesta" class="activo">📊 Encuesta / Diagnóstico</button>
  <button type="button" id="btnModoQuiz">📝 Quiz evaluativo</button>
</div>

<div id="barraConfigQuizGlobal">
  <span>Configuración global del quiz</span>
  <span id="lblPuntosTotalesQuiz">12 pts totales</span>
</div>

<div class="caja-ajustes-quiz">
  <label>Puntos <input class="quiz-puntos-input" type="number" value="3"></label>
  <label>Respuesta correcta <input class="quiz-correcta-input" value="Opción B"></label>
  <label>Retroalimentación <input class="quiz-retro-input" value="Recuerda sumar antes de dividir."></label>
</div>
```

> La última etiqueta de `.caja-ajustes-quiz` se expande sola (`flex: 1 1 260px`), así que la retroalimentación siempre ocupa el espacio libre.

**Media, retroalimentación, progreso y temporizador (OLA 4):**

```html
<div id="barraTemporizadorQuiz" class="alerta">
  <span>⏱ Tiempo restante</span><span class="tiempo-restante">01:48</span>
</div>

<div class="barra-progreso-nem"><div class="barra-progreso-nem__fill" style="width:60%"></div></div>
<span class="barra-progreso-nem__texto">Sección 3 de 5</span>

<figure class="reactivo-media">
  <img src="…" alt="Mapa de riesgos">
  <figcaption>Opcional</figcaption>
</figure>

<div class="retro-acierto">Identificaste el cruce de mayor riesgo con dos fuentes.</div>
<div class="retro-fallo">Falta contrastar la fuente oficial.</div>
```

Estados del temporizador: `.alerta` o `[data-estado="alerta"]` a los 2 minutos; `.critico` o `[data-estado="critico"]` en el último minuto. La media se amplía añadiendo `.ampliado` a la `figure`.

### 6. Decisiones que conviene auditar

1. **Un solo `.idevice-bloque` sirve para ambos modos.** El acento índigo y la cabecera `#e0e7ff`/`#3730a3` solo se aplican con `[data-tipo="encuesta"]`, así que el mismo componente puede alojar después el quiz sin duplicar CSS.
2. **La insignia de ponderación se dibuja sola.** `.insignia-ponderacion::before` inserta el símbolo ⚖, de modo que Cursor solo tiene que poner el texto «3 pts».
3. **La caja de ajustes usa `align-items: flex-start`.** Con `flex-end` el campo de retroalimentación estiraba su etiqueta a 300 px de alto (lo detecté en el primer render); ahora la última etiqueta crece a lo ancho, no a lo alto.
4. **El temporizador no depende de JS para el color.** Basta con que Cursor ponga la clase `.alerta` o `.critico` (o el `data-estado`) cuando el contador cruce el umbral; las animaciones ya están definidas y respetan `prefers-reduced-motion`.
5. **`figure.reactivo-media` respeta el ratio de la imagen** con `object-fit: contain` y `max-height: 280px`; el modo `.ampliado` es un overlay fijo al 86 % de opacidad, listo para que Cursor lo active con un clic.

### 7. Verificación

| Comprobación | Resultado |
| :--- | :--- |
| Llaves CSS balanceadas | `AdminPlaneacionCSS` 385/385 · `AdminCSS` 685/685 · `ComunCSS` 483/483 |
| Render de las tres olas | ✅ 980 px, sin desbordes |
| Caja de ajustes del quiz | ✅ una sola fila: puntos, respuesta y retroalimentación |
| IDs / `.gs` / JS | sin cambios |

Evidencia en `evidencia_ola234/`: `olas2_3_4.png` (vista limpia) y `olas2_3_4_completo.png` (con media y retroalimentación).

### 8. Rollback

Los tres bloques están al final de cada `<style>` y son autocontenidos:

```
AdminPlaneacionCSS.html  → borrar líneas 2533–2622
AdminCSS.html            → borrar líneas 1797–1937
ComunCSS.html            → borrar líneas 2766–2926
```

Los dos primeros archivos conservan respaldo previo de la OLA 1 en `C:\Users\40B\AppData\Local\Temp\st90_backup_fase5\`; `AdminCSS.html` no tenía respaldo previo porque esta es su primera intervención, por eso el rollback se define por rango de líneas.

---

## ✍️ ENTREGA DEEPSEEK — OLA 3 · Sección eXeLearning y alta de Encuesta / Quiz

**Fecha:** 2026-11-01 · **Archivo:** `AdminPlaneacionCSS.html`, líneas 2622–2737

> **Nota de trazabilidad.** Al abrir el buzón, esta partitura **no estaba escrita**: `ENTREGA_DEEPSEEK.md` seguía en 1218 líneas (última escritura 18:36) y `ESTADO_COORDINACION.md`, aunque se tocó a las 20:56, no menciona `.nem-seccion-exelearning` ni el botón de alta. Ejecuté la instrucción directa y dejo aquí el contrato que propongo, para que Antigravity lo confirme o lo corrija antes de integrar.

### 1. Qué resuelve

El editor de la sesión mezclaba tres cosas en el mismo plano visual: los datos de la clase, la barra de iDevices y los bloques ya creados. La sección `.nem-seccion-exelearning` los agrupa y los separa con una franja índigo superior, de modo que el docente distingue de un vistazo **qué es constructor** y **qué es la sesión**.

### 2. CSS entregado

```css
  /* ============================================================
     OLA 3 · SECCIÓN eXeLEARNING — CONSTRUCTOR vs SESIÓN
     Separa visualmente el constructor de bloques del editor de la
     sesión, y aloja la acción plana «+ Crear nueva Encuesta / Quiz».
     Contrato: .nem-seccion-exelearning (+ __cab, __titulo, __hint)
               .nem-btn-crear-encuesta
     ============================================================ */
  .nem-seccion-exelearning {
    margin: 16px 0 18px;
    padding: 12px 14px 14px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-top: 3px solid #6366f1;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
  }
  .nem-seccion-exelearning__cab {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin: 0 0 10px;
  }
  .nem-seccion-exelearning__titulo {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: #4338ca;
  }
  .nem-seccion-exelearning__titulo::before {
    content: '';
    width: 3px;
    height: 14px;
    border-radius: 999px;
    background: #6366f1;
  }
  .nem-seccion-exelearning__hint {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
  }

  /* La barra de iDevices deja de parecer una caja suelta dentro de la sección */
  .nem-seccion-exelearning .idevice-bar {
    margin: 0 0 10px;
    background: #ffffff;
    border-style: solid;
    border-color: #e2e8f0;
  }
  /* Los bloques creados respiran dentro de la sección */
  .nem-seccion-exelearning #contenedorIDevicesDinamicos > *:last-child {
    margin-bottom: 0;
  }

  /* Botón plano ST90 de alta rápida */
  .nem-btn-crear-encuesta {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border: 0;
    border-radius: 8px;
    background: #6366f1;
    color: #ffffff;
    font-family: inherit;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.15;
    white-space: nowrap;
    cursor: pointer;
    transition: background 150ms ease, transform 100ms ease, box-shadow 150ms ease;
  }
  .nem-btn-crear-encuesta:hover {
    background: #4f46e5;
  }
  .nem-btn-crear-encuesta:active {
    background: #4338ca;
    transform: translateY(1px);
  }
  .nem-btn-crear-encuesta:focus-visible {
    outline: 2px solid #4338ca;
    outline-offset: 2px;
  }
  .nem-btn-crear-encuesta:disabled {
    background: #c7d2fe;
    color: #ffffff;
    cursor: not-allowed;
    transform: none;
  }

  /* Variante neutra, por si la acción convive con «Guardar Sesión» */
  .nem-btn-crear-encuesta--neutro {
    background: #ffffff;
    color: #4338ca;
    border: 1px solid #c7d2fe;
  }
  .nem-btn-crear-encuesta--neutro:hover {
    background: #eef2ff;
    border-color: #a5b4fc;
  }
  .nem-btn-crear-encuesta--neutro:active {
    background: #e0e7ff;
    transform: translateY(1px);
  }

  @media (max-width: 620px) {
    .nem-seccion-exelearning { padding: 10px 10px 12px; }
    .nem-btn-crear-encuesta { margin-left: 0; width: 100%; justify-content: center; }
  }
```

### 3. Contrato de marcado

```html
<section class="nem-seccion-exelearning">
  <div class="nem-seccion-exelearning__cab">
    <h4 class="nem-seccion-exelearning__titulo">Constructor eXeLearning</h4>
    <span class="nem-seccion-exelearning__hint">Bloques modulares opcionales</span>
    <button type="button" class="nem-btn-crear-encuesta"
            onclick="insertariDeviceSesion_('encuesta')">+ Crear nueva Encuesta / Quiz</button>
  </div>

  <div class="idevice-bar"><!-- botones de iDevice existentes --></div>
  <div id="contenedorIDevicesDinamicos" aria-live="polite"></div>
</section>
```

**Clases nuevas, todas presentacionales:**

| Clase | Función |
| :--- | :--- |
| `.nem-seccion-exelearning` | Contenedor: fondo `#f8fafc`, borde `#e2e8f0`, franja superior índigo de 3 px, radio 12 |
| `.nem-seccion-exelearning__cab` | Fila de cabecera con título, pista y acción |
| `.nem-seccion-exelearning__titulo` | Rótulo en versalitas con barra índigo (`::before`) |
| `.nem-seccion-exelearning__hint` | Texto de apoyo gris |
| `.nem-btn-crear-encuesta` | Botón plano índigo `#6366f1`, radio 8, sin sombra |
| `.nem-btn-crear-encuesta--neutro` | Variante blanca con borde, por si convive con «Guardar Sesión» |

### 4. Decisiones

1. **El botón es plano de verdad:** sin `box-shadow`, sin degradado, un solo color y `translateY(1px)` al pulsar. Es el lenguaje de los botones ST90.
2. **La barra de iDevices se integra, no se duplica:** dentro de la sección, `.idevice-bar` pierde el borde punteado y pasa a blanco sólido, para que no parezca una caja suelta sobre otra caja.
3. **`margin-left: auto` en el botón** lo pega a la derecha de la cabecera; en móvil (≤620 px) se vuelve de ancho completo y centrado.
4. **Sin `!important` y sin tocar IDs.** El `onclick` del ejemplo es el que ya existe en `AdminPlaneacion.html` (`insertariDeviceSesion_('encuesta')`), así que Cursor solo tiene que envolver el bloque actual con la sección.

### 5. Verificación

| Comprobación | Resultado |
| :--- | :--- |
| Llaves CSS balanceadas | `AdminPlaneacionCSS.html` 403/403 |
| Render a 940 px | ✅ sección separada, botón a la derecha, bloques contenidos |
| Foco visible del botón | ✅ `:focus-visible` con anillo índigo |
| IDs / `.gs` / JS | sin cambios |

Evidencia: `evidencia_ola3/seccion_exelearning.png`.

### 6. Rollback

Borrar las líneas 2622–2737 de `AdminPlaneacionCSS.html`, o restaurar:
`C:\Users\40B\AppData\Local\Temp\st90_backup_fase5\AdminPlaneacionCSS_pre_ola3exe.html`
