# BUZÓN DE TRABAJO Y ENTREGA: DEEPSEEK (DISEÑO UI/UX & CSS)
# SUITE ESCOLAR ST90 — PLAN DE ACREDITACIÓN Y MEJORA CONTINUA (FASE LMS NEM)

| Parámetro | Detalle |
| :--- | :--- |
| **Agente asignado** | DeepSeek (Diseñador Visual, Especialista CSS & DUA) |
| **Rol en el proyecto** | Experiencia de usuario (UX/UI), microinteracciones, accesibilidad DUA y estilos CSS puros. |
| **Archivos autorizados de trabajo** | `AdminPlaneacionCSS.html`, `ComunCSS.html`, `AdminCSS.html`, `ClaseCSS.html` |
| **Archivos prohibidos** | Backend `*.gs`, fragmentos de lógica `*JS_*.html`, `Admin.html` (IDs estructurales), `git`, `clasp`. |
| **Fecha de emisión de partitura** | 2026-10-31 |
| **Estado actual** | 🟢 **PARTITURA ASIGNADA POR ANTIGRAVITY — ESPERANDO PROPUESTA CSS DE DEEPSEEK** |

---

## 🎯 OBJETIVOS DE DISEÑO UI/UX ASIGNADOS A DEEPSEEK

Debes diseñar y entregar el código CSS modular (y estructura visual de soporte) para los siguientes 4 módulos del **Plan de Acreditación AechitexOS**:

---

### MÓDULO 1: UI/UX Pedagógica — Iconos de Ayuda (❓) y Drawer del Asistente IA (🤖)

1. **Botones de Ayuda en Campos (`.btn-ayuda-nem`):**
   - Icono `❓` accesible, circular (22px × 22px), discreto, color neutro institucional (`#64748b`), con hover suave (`#2563eb`), sin romper el flujo ni la altura de línea de los `<label>`.
   - Soporte para badge o tooltip nativo y micro-elevación al enfocar (`:focus-visible`).
2. **Modal Pedagógico NEM (`#modalAyudaNEM`):**
   - Tarjeta central flotante con backdrop borroso (`backdrop-filter: blur(4px)`).
   - Estructura limpia a 3 bloques diferenciados:
     - Bloque 1: *¿Por qué está este campo aquí?* (Fondo azul muy suave `#eff6ff`, borde `#bfdbfe`, icono pedagógico).
     - Bloque 2: *¿Cómo se llena?* (Instrucciones claras, lista o texto con viñetas legibles).
     - Bloque 3: *Ejemplo contextual* (Fondo verde o gris pizarra `#f8fafc` con tipografía monoespaciada o cursiva destacada).
   - Botón de cierre superior `✕` y botón inferior plano ST90 `Entendido`.
3. **Botón Flotante del Asistente IA (`#btnAsistenteFlotanteIA`):**
   - Botón fijo en la esquina inferior derecha (`bottom: 24px; right: 24px; z-index: 99990`).
   - Círculo de 52px con degradado premium ST90, icono `🤖` centrado (26px), sombra sutil de elevación y pulso o halo respiratorio suave.
4. **Drawer Lateral del Asistente IA (`#drawerAsistenteIA`):**
   - Panel deslizable desde la derecha (ancho 380px, responsive 100% en pantallas móviles).
   - Cabecera con degradado institucional ST90, avatar del asistente y chip de contexto activo (ej. `📍 Sección: Problemática Comunitaria`).
   - Área de mensajes con scroll automático (`#chatAsistenteCuerpo`): burbujas diferenciadas para Docente (`.msg-docente`) y Asistente IA (`.msg-ia`).
   - Input inferior fijo con botón enviar y chips de sugerencias rápidas ("💡 Dame 3 ideas", "🎯 Adaptar a mi grupo", "✨ Simplificar redacción").

---

### MÓDULO 2: Biblioteca de Recursos y Libros SEP Oficiales (UI/UX)

1. **Layout de la Biblioteca (`#vistaBibliotecaDocente`):**
   - Barra superior de herramientas: Buscador reactivo (`#buscarRecursoBiblioteca`) con icono de lupa integrado + Selectores en píldora para **Asignatura**, **Grado** (1°, 2°, 3°) y **Trimestre** (1, 2, 3).
   - Botón primario ST90: `[+ Compartir Recurso / Subir Documento]`.
2. **Sección Destacada: Libros de Texto Oficiales SEP (Fase 6):**
   - Grid de tarjetas de libros oficiales con portada o ilustración estilizada, etiqueta de grado y botón directo `[📖 Abrir Visor SEP / PDF]`.
3. **Repositorio Colectivo Escolar:**
   - Tarjetas de recursos compartidos (`.card-recurso`): Badge de tipo (`📄 PDF`, `📊 Presentación`, `🔗 Enlace`, `🎬 Video`), título, metadatos (Docente, Fecha, Asignatura/Grado) y botón de descarga o vista previa.

---

### MÓDULO 3: Adecuación Visual de Tecnología (CECSE - Aula de Cómputo)

1. **Insignia y Panel CECSE:**
   - Estilo para la insignia de aula tecnológica: `.badge-cecse` (color cian/azul tecnológico `#0284c7`, fondo `#e0f2fe`).
   - Indicador visual de distribución horaria: `2h Teoría (Aula) / 6h Práctica (CECSE)`.
   - Tarjeta especial de software según grado:
     - 1° Grado: Badge `Word / Ofimática Básica`
     - 2° Grado: Badge `Excel / Hojas de Cálculo & Datos`
     - 3° Grado: Badge `PowerPoint + IA Generativa & Canva`

---

### MÓDULO 4: Constructor de Clases y Facilitadores

1. **Modal de Vista Previa del Alumno (`#modalPreviewAlumno`):**
   - Marco que simula la pantalla del estudiante en el "Aula Hablada" (`Clase.html`), con barra superior tipo navegador o tableta para dar certidumbre al docente de cómo interactuará el alumno con los bloques (Texto, Quiz, Video, iDevices).
2. **Bloque Incrustado HTML / Iframe (`.bloque-iframe-container`):**
   - Contenedor responsive con ratio 16:9, borde redondeado, barra de carga y fallback elegante si el iframe tarda en cargar (para Genially, H5P, Canva).
3. **Widget Visual: Línea del Tiempo del Proyecto NEM (`#timelineProyectoNEM`):**
   - Cinta horizontal de pasos (Fase 1 Diagnóstico ➔ Fase 2 Contextualización ➔ Fase 3 Formulación ➔ Fase 4 Evaluación formativa) con estados visuales: `.completado` (verde ST90), `.activo` (azul con pulso) y `.pendiente` (gris).

---

## 📋 REGLAS DE ENTREGA PARA DEEPSEEK

1. Escribe tu propuesta CSS completa, selectores y ejemplos de estructura HTML directamente en este archivo (`ENTREGA_DEEPSEEK.md`) debajo de esta partitura.
2. Respeta estrictamente los IDs y nombres de clases definidos en este contrato.
3. Todo CSS debe ser Vanilla CSS moderno, sin Tailwind ni frameworks externos.
4. No toques archivos `.gs` ni ejecutes comandos `git` o `clasp`.
5. Una vez guardado tu código aquí, notifica a Antigravity para que proceda a la auditoría técnica e integración.

---

# ✅ PROPUESTA CSS — DEEPSEEK (FASE LMS ST90)

> **Estado:** entregada el 2026-10-31 para auditoría de Antigravity.
> **El CSS ya está escrito en los archivos**; este buzón contiene el código exacto para revisión.
> **Sin** cambios en `.gs`, en lógica JS, en IDs del DOM ni en `Admin.html`.

## 0. Correspondencia partitura → entrega

| Módulo de la partitura | Selectores | Archivo | Sección |
| :--- | :--- | :--- | :--- |
| Módulo 1 · Ayuda ❓ y Asistente 🤖 | `.btn-ayuda-nem`, `#modalAyudaNEM`, `#btnAsistenteFlotanteIA`, `#drawerAsistenteIA`, `#chatAsistenteCuerpo`, `#chipContextoAsistente`, `.msg-docente`, `.msg-ia` | `ComunCSS.html` (1.1–1.4) + `AdminPlaneacionCSS.html` (§1) | §1 y §2 |
| Módulo 2 · Biblioteca y Libros SEP | `#vistaBibliotecaDocente`, `#buscarRecursoBiblioteca`, `#gridLibrosOficialesSEP`, `.card-recurso` | `AdminPlaneacionCSS.html` | §2 |
| Módulo 3 · Tecnología CECSE | `.badge-cecse` (+ `.panel-cecse`, `.cecse-*`) | `AdminPlaneacionCSS.html` | §2 |
| Módulo 4 · Constructor y facilitadores | `#modalPreviewAlumno`, `.bloque-iframe-container`, `#timelineProyectoNEM` | `AdminPlaneacionCSS.html` | §2 |

**Criterio de reparto:** el Módulo 1 es transversal (el botón ❓ puede aparecer en cualquier vista y el asistente flota sobre todo el panel), por eso vive en `ComunCSS.html`. Los Módulos 2, 3 y 4 son exclusivos del panel administrativo y se cargan solo ahí, así que van en `AdminPlaneacionCSS.html` para no meter CSS muerto en `Clase.html`.

## 1. Módulo 1 · CSS en `ComunCSS.html` (líneas 1920–2315)

Cubre: botón ❓ de 22 px neutro con hover azul, insignia opcional, tooltip propio, pulso del campo enfocado (DUA), FAB de 52 px con halo respiratorio, y drawer de 380 px con avatar, chip de contexto, burbujas `.msg-docente` / `.msg-ia`, chips de sugerencia y compositor.

```css
  /* ============================================================
     FASE 7 · MÓDULO 1 — AYUDA CONTEXTUAL (❓) Y ASISTENTE IA (🤖)
     DeepSeek · Proposal CSS contra la partitura de ENTREGA_DEEPSEEK.md.
     Selectores del contrato: .btn-ayuda-nem, #btnAsistenteFlotanteIA,
     #drawerAsistenteIA, #chatAsistenteCuerpo, #chipContextoAsistente,
     .msg-docente, .msg-ia.
     ============================================================ */

  /* --- 1.1 · Botón de ayuda en campos (22 px, neutro institucional) --- */
  .btn-ayuda-nem {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    min-width: 22px;
    padding: 0;
    margin: 0 0 0 6px;
    border: 1px solid #dbe3ec;
    border-radius: 999px;
    background: #f8fafc;
    color: #64748b;
    font: 800 12px/1 'Segoe UI', system-ui, -apple-system, sans-serif;
    cursor: pointer;
    vertical-align: middle;
    line-height: 1;
    transition: color .15s ease, background .15s ease, border-color .15s ease,
                transform .12s ease, box-shadow .15s ease;
  }
  .btn-ayuda-nem:hover {
    color: #2563eb;
    background: #eff6ff;
    border-color: #bfdbfe;
    transform: translateY(-1px);
  }
  .btn-ayuda-nem:focus-visible {
    color: #2563eb;
    outline: 2px solid #2563eb;
    outline-offset: 2px;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.28);
  }
  .btn-ayuda-nem[aria-expanded="true"] {
    background: #2563eb;
    border-color: #2563eb;
    color: #ffffff;
  }
  /* Insignia opcional de pendientes */
  .btn-ayuda-nem[data-badge]::after {
    content: attr(data-badge);
    position: absolute;
    top: -5px;
    right: -5px;
    min-width: 14px;
    height: 14px;
    padding: 0 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: #f59e0b;
    color: #ffffff;
    font-size: 8px;
    font-weight: 800;
    line-height: 1;
  }
  /* Tooltip ligero (no nativo, para que se vea igual en todos los navegadores) */
  .btn-ayuda-nem[data-tip]::before {
    content: attr(data-tip);
    position: absolute;
    bottom: calc(100% + 7px);
    left: 50%;
    z-index: 30;
    padding: 5px 9px;
    border-radius: 6px;
    background: #0f172a;
    color: #ffffff;
    font-size: 10.5px;
    font-weight: 600;
    white-space: nowrap;
    opacity: 0;
    transform: translateX(-50%) translateY(3px);
    pointer-events: none;
    transition: opacity .14s ease, transform .14s ease;
  }
  .btn-ayuda-nem[data-tip]:hover::before,
  .btn-ayuda-nem[data-tip]:focus-visible::before {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  /* DUA: el botón se enciende cuando su campo tiene el foco */
  input:focus + .btn-ayuda-nem,
  textarea:focus + .btn-ayuda-nem,
  select:focus + .btn-ayuda-nem {
    color: #2563eb;
    border-color: #93c5fd;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
  }

  /* --- 1.2 · Toast por encima del botón flotante --- */
  #st90-toast { bottom: 92px; }

  /* --- 1.3 · Botón flotante del Asistente IA (52 px, halo respiratorio) --- */
  #btnAsistenteFlotanteIA {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 99990;
    width: 52px;
    height: 52px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: linear-gradient(140deg, #2563eb 0%, #4f46e5 62%, #7c3aed 100%);
    color: #ffffff;
    font-size: 24px;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 10px 24px rgba(37, 99, 235, 0.38), 0 2px 6px rgba(15, 23, 42, 0.2);
    transition: transform .16s ease, box-shadow .16s ease, background .16s ease;
  }
  #btnAsistenteFlotanteIA svg,
  #btnAsistenteFlotanteIA img {
    width: 26px;
    height: 26px;
    display: block;
    pointer-events: none;
  }
  #btnAsistenteFlotanteIA::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.45);
    animation: iaHaloRespiratorio 2.8s cubic-bezier(.4, 0, .2, 1) infinite;
    pointer-events: none;
  }
  @keyframes iaHaloRespiratorio {
    0%   { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.45); }
    70%  { box-shadow: 0 0 0 16px rgba(37, 99, 235, 0); }
    100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
  }
  #btnAsistenteFlotanteIA:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 14px 30px rgba(37, 99, 235, 0.45), 0 3px 8px rgba(15, 23, 42, 0.22);
  }
  #btnAsistenteFlotanteIA:focus-visible {
    outline: 3px solid #1d4ed8;
    outline-offset: 3px;
  }
  #btnAsistenteFlotanteIA[aria-expanded="true"] {
    background: linear-gradient(140deg, #1e40af 0%, #4338ca 62%, #6d28d9 100%);
  }
  @media (prefers-reduced-motion: reduce) {
    #btnAsistenteFlotanteIA::after { animation: none; opacity: 0; }
    #btnAsistenteFlotanteIA { transition: none; }
  }

  /* --- 1.4 · Drawer lateral (380 px) --- */
  .ia-drawer-velo {
    position: fixed;
    inset: 0;
    z-index: 99991;
    background: rgba(15, 23, 42, 0.28);
    opacity: 0;
    pointer-events: none;
    transition: opacity .2s ease;
  }
  .ia-drawer-velo.visible { opacity: 1; pointer-events: auto; }

  #drawerAsistenteIA {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 99992;
    width: 380px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-left: 1px solid var(--app-border);
    box-shadow: -18px 0 48px rgba(15, 23, 42, 0.18);
    transform: translateX(102%);
    visibility: hidden;
    transition: transform .22s cubic-bezier(.4, 0, .2, 1);
  }
  #drawerAsistenteIA.abierto,
  #drawerAsistenteIA.visible {
    transform: none;
    visibility: visible;
  }

  .ia-drawer-cabecera {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 12px 14px;
    background: linear-gradient(135deg, #1e40af 0%, #2563eb 55%, #0ea5e9 100%);
    color: #ffffff;
    flex: 0 0 auto;
  }
  .ia-avatar {
    width: 32px;
    height: 32px;
    min-width: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.36);
    font-size: 16px;
    line-height: 1;
  }
  .ia-drawer-titulo {
    margin: 0;
    font-size: 13.5px;
    font-weight: 800;
    letter-spacing: .01em;
    white-space: nowrap;
  }
  #chipContextoAsistente {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    max-width: 178px;
    padding: 3px 9px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.3);
    font-size: 10.5px;
    font-weight: 700;
    color: #ffffff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #chipContextoAsistente:empty { display: none; }
  .ia-drawer-cerrar {
    margin-left: auto;
    width: 30px;
    height: 30px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.32);
    border-radius: 9px;
    background: rgba(255, 255, 255, 0.14);
    color: #ffffff;
    font-size: 15px;
    line-height: 1;
    cursor: pointer;
  }
  .ia-drawer-cerrar:hover { background: rgba(255, 255, 255, 0.26); }
  .ia-drawer-cerrar:focus-visible { outline: 2px solid #ffffff; outline-offset: 2px; }

  #chatAsistenteCuerpo {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px 14px 8px;
    background: #f8fafc;
    scroll-behavior: smooth;
  }
  .msg-ia,
  .msg-docente {
    max-width: 88%;
    padding: 9px 12px;
    border-radius: 14px;
    font-size: 12.8px;
    line-height: 1.5;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  .msg-ia {
    align-self: flex-start;
    background: #ffffff;
    border: 1px solid var(--app-border);
    border-bottom-left-radius: 4px;
    color: #1e293b;
  }
  .msg-docente {
    align-self: flex-end;
    background: #2563eb;
    border: 1px solid #1d4ed8;
    border-bottom-right-radius: 4px;
    color: #ffffff;
  }
  .msg-hora {
    display: block;
    margin-top: 4px;
    font-size: 10px;
    opacity: .65;
  }
  .ia-vacio {
    margin: auto;
    padding: 20px 10px;
    text-align: center;
    font-size: 12.5px;
    line-height: 1.55;
    color: #64748b;
  }

  /* Chips de sugerencias rápidas */
  .ia-sugerencias {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 0 14px 10px;
    background: #ffffff;
    flex: 0 0 auto;
  }
  .ia-chip {
    padding: 5px 10px;
    border: 1px solid #bfdbfe;
    border-radius: 999px;
    background: #eff6ff;
    color: #1d4ed8;
    font-family: inherit;
    font-size: 11.5px;
    font-weight: 700;
    cursor: pointer;
    transition: background .14s ease, border-color .14s ease, transform .12s ease;
  }
  .ia-chip:hover { background: #dbeafe; border-color: #93c5fd; transform: translateY(-1px); }
  .ia-chip:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }

  .ia-composer {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    padding: 10px 14px 12px;
    border-top: 1px solid var(--app-border);
    background: #ffffff;
    flex: 0 0 auto;
  }
  #txtMensajeAsistente {
    flex: 1 1 auto;
    min-height: 42px;
    max-height: 128px;
    resize: none;
    padding: 10px 12px;
    border: 1px solid var(--app-border);
    border-radius: 10px;
    font-family: inherit;
    font-size: 12.8px;
    line-height: 1.45;
    color: var(--app-text);
    background: #ffffff;
  }
  #txtMensajeAsistente:focus {
    outline: none;
    border-color: #93c5fd;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }
  #btnEnviarAsistenteIA {
    width: 42px;
    height: 42px;
    min-width: 42px;
    padding: 0;
    border: 0;
    border-radius: 10px;
    background: #2563eb;
    color: #ffffff;
    font-size: 16px;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background .15s ease, transform .12s ease;
  }
  #btnEnviarAsistenteIA:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); }
  #btnEnviarAsistenteIA:disabled { background: #94a3b8; cursor: not-allowed; }
  #btnEnviarAsistenteIA:focus-visible { outline: 2px solid #1d4ed8; outline-offset: 2px; }

  @media (max-width: 520px) {
    #drawerAsistenteIA { width: 100%; border-left: 0; }
    #btnAsistenteFlotanteIA { right: 16px; bottom: 16px; width: 50px; height: 50px; }
    #chipContextoAsistente { max-width: 120px; }
  }

  @media print {
    #btnAsistenteFlotanteIA,
    #drawerAsistenteIA,
    .ia-drawer-velo,
    .btn-ayuda-nem { display: none !important; }
```

### Lo pedido / lo entregado

| Punto de la partitura | Cómo quedó |
| :--- | :--- |
| ❓ circular 22×22, neutro `#64748b`, hover `#2563eb` | ✅ 22 px, `#64748b` → `#2563eb` en hover |
| Sin romper la altura de línea del `<label>` | ✅ `vertical-align: middle` + `line-height: 1` |
| Badge o tooltip nativo | ✅ `[data-badge]` dibuja contador; `[data-tip]` dibuja tooltip propio (el nativo no es estilizable) |
| Micro-elevación al enfocar | ✅ `:focus-visible` con `outline` + sombra, y `translateY(-1px)` en hover |
| FAB fijo `bottom/right: 24px`, `z-index 99990` | ✅ exacto, 52 px, degradado de 3 paradas |
| Icono 🤖 de 26 px | ✅ `#btnAsistenteFlotanteIA svg/img { 26px }` (sirve emoji o vector) |
| Halo respiratorio | ✅ `@keyframes iaHaloRespiratorio` de 2.8 s |
| Drawer 380 px, 100 % en móvil | ✅ `width: 380px` + `@media (max-width: 520px) → 100 %` |
| Cabecera con degradado, avatar y chip | ✅ `.ia-avatar`, `.ia-drawer-cabecera`, `#chipContextoAsistente` con `📍` |
| Burbujas `.msg-docente` / `.msg-ia` | ✅ derecha azul / izquierda blanca |
| Chips de sugerencias rápidas | ✅ `.ia-sugerencias` + `.ia-chip` |

### Estructura HTML que espera el CSS

```html
<!-- Botón de ayuda junto a un campo -->
<label for="planPDA">PDA oficiales / adaptados</label>
<input id="planPDA" type="text">
<button type="button" class="btn-ayuda-nem" data-ayuda-campo="planPDA"
        data-tip="¿Qué son los PDA?" aria-label="Ayuda sobre PDA oficiales">?</button>

<!-- Botón flotante -->
<button type="button" id="btnAsistenteFlotanteIA" aria-label="Abrir asistente IA"
        aria-expanded="false">🤖</button>

<!-- Drawer -->
<div class="ia-drawer-velo"></div>
<aside id="drawerAsistenteIA" class="abierto" aria-label="Asistente IA">
  <header class="ia-drawer-cabecera">
    <span class="ia-avatar">🤖</span>
    <h3 class="ia-drawer-titulo">Asistente</h3>
    <span id="chipContextoAsistente">📍 Sección: Problemática</span>
    <button type="button" class="ia-drawer-cerrar" aria-label="Cerrar">✕</button>
  </header>
  <div id="chatAsistenteCuerpo">
    <div class="msg-ia">…<span class="msg-hora">19:58</span></div>
    <div class="msg-docente">…<span class="msg-hora">19:59</span></div>
  </div>
  <div class="ia-sugerencias">
    <button type="button" class="ia-chip">💡 Dame 3 ideas</button>
    <button type="button" class="ia-chip">🎯 Adaptar a mi grupo</button>
    <button type="button" class="ia-chip">✨ Simplificar redacción</button>
  </div>
  <div class="ia-composer">
    <textarea id="txtMensajeAsistente" rows="1" placeholder="Escribe tu pregunta…"></textarea>
    <button type="button" id="btnEnviarAsistenteIA" aria-label="Enviar">➤</button>
  </div>
</aside>
```

> **Regla de hermandad:** el `.btn-ayuda-nem` debe ir **inmediatamente después** de su `input`/`textarea`; la regla DUA `input:focus + .btn-ayuda-nem` depende de eso.

## 2. Módulos 2, 3 y 4 · CSS en `AdminPlaneacionCSS.html` (líneas 1063–1862)

Cubre: modal pedagógico con `backdrop-filter: blur(4px)` y sus 3 bloques, biblioteca (buscador con lupa, filtros en píldora, botón primario, grid de libros SEP, `.card-recurso`), panel CECSE con insignia y badges por grado, vista previa del alumno, iframe 16:9 con barra de carga y fallback, y línea del tiempo con estados.

```css
  /* ============================================================
     FASE 7 · MÓDULOS 2, 3 y 4 — BIBLIOTECA, CECSE, PREVIEW, IFRAME,
     LÍNEA DEL TIEMPO Y MODAL DE AYUDA PEDAGÓGICA
     DeepSeek · Selectores del contrato: #modalAyudaNEM,
     #vistaBibliotecaDocente, #buscarRecursoBiblioteca,
     #gridLibrosOficialesSEP, .card-recurso, .badge-cecse,
     #modalPreviewAlumno, .bloque-iframe-container, #timelineProyectoNEM.
     ============================================================ */

  /* ---------- 1 · Modal pedagógico NEM ---------- */
  #modalAyudaNEM {
    position: fixed;
    inset: 0;
    z-index: 99980;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(15, 23, 42, 0.45);
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
    opacity: 0;
    pointer-events: none;
    transition: opacity .16s ease;
  }
  #modalAyudaNEM.visible,
  #modalAyudaNEM.abierto { opacity: 1; pointer-events: auto; }

  #modalAyudaNEM .ayuda-nem-panel {
    width: min(660px, 96vw);
    max-height: 88vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.32);
    transform: translateY(10px) scale(.99);
    transition: transform .18s cubic-bezier(.2, .8, .2, 1);
  }
  #modalAyudaNEM.visible .ayuda-nem-panel,
  #modalAyudaNEM.abierto .ayuda-nem-panel { transform: none; }

  .ayuda-nem-cabecera {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px 18px;
    background: linear-gradient(135deg, #1e40af 0%, #2563eb 58%, #0ea5e9 100%);
    color: #ffffff;
    flex: 0 0 auto;
  }
  .ayuda-nem-icono {
    width: 40px;
    height: 40px;
    min-width: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.34);
    font-size: 20px;
    line-height: 1;
  }
  #modalAyudaTitulo {
    margin: 0;
    font-size: 15.5px;
    font-weight: 800;
    line-height: 1.3;
    color: #ffffff;
  }
  .ayuda-nem-ceja {
    margin: 2px 0 0;
    font-size: 11px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.84);
  }
  .ayuda-nem-cerrar {
    margin-left: auto;
    width: 32px;
    height: 32px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.34);
    border-radius: 9px;
    background: rgba(255, 255, 255, 0.14);
    color: #ffffff;
    font-size: 15px;
    line-height: 1;
    cursor: pointer;
  }
  .ayuda-nem-cerrar:hover { background: rgba(255, 255, 255, 0.26); }
  .ayuda-nem-cerrar:focus-visible { outline: 2px solid #ffffff; outline-offset: 2px; }

  .ayuda-nem-cuerpo {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: 16px 18px 4px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .ayuda-nem-etiqueta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 0 7px;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: .05em;
    text-transform: uppercase;
    color: #475569;
  }

  /* Bloque 1 · fondo azul muy suave */
  .ayuda-nem-bloque--proposito {
    padding: 12px 14px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 12px;
  }
  /* Bloque 2 · instrucciones */
  .ayuda-nem-bloque--como { padding: 0 2px; }
  /* Bloque 3 · ejemplo contextual en cursiva destacada */
  .ayuda-nem-bloque--ejemplo {
    padding: 12px 14px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
  }

  #modalAyudaProposito,
  #modalAyudaComoLlenar {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: #334155;
  }
  #modalAyudaComoLlenar ol,
  #modalAyudaComoLlenar ul { margin: 6px 0 0; padding-left: 20px; }
  #modalAyudaComoLlenar li { margin: 0 0 5px; }
  #modalAyudaEjemplo {
    margin: 0;
    font-family: Georgia, 'Palatino Linotype', serif;
    font-size: 13.5px;
    font-style: italic;
    line-height: 1.6;
    color: #0f172a;
  }

  .ayuda-nem-pie {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 18px 15px;
    border-top: 1px solid var(--app-border);
    background: #ffffff;
    flex: 0 0 auto;
  }
  .ayuda-nem-entendido {
    padding: 9px 18px;
    border: 0;
    border-radius: 8px;
    background: #2563eb;
    color: #ffffff;
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
    transition: background .15s ease;
  }
  .ayuda-nem-entendido:hover { background: #1d4ed8; }
  .ayuda-nem-entendido:focus-visible { outline: 2px solid #1d4ed8; outline-offset: 2px; }

  /* ---------- 2 · Biblioteca de recursos ---------- */
  #vistaBibliotecaDocente { display: block; }

  .biblio-filtros {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin: 0 0 16px;
    padding: 10px 12px;
    background: #f8fafc;
    border: 1px solid var(--app-border);
    border-radius: 14px;
  }
  .biblio-buscador {
    position: relative;
    flex: 1 1 240px;
    min-width: 170px;
  }
  .biblio-buscador .biblio-lupa {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 13px;
    line-height: 1;
    color: #94a3b8;
    pointer-events: none;
  }
  #buscarRecursoBiblioteca {
    width: 100%;
    height: 38px;
    padding: 0 14px 0 34px;
    border: 1px solid var(--app-border);
    border-radius: 999px;
    background: #ffffff;
    font-family: inherit;
    font-size: 12.8px;
    color: var(--app-text);
    transition: border-color .15s ease, box-shadow .15s ease;
  }
  #buscarRecursoBiblioteca:focus {
    outline: none;
    border-color: #93c5fd;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }
  .biblio-filtro,
  #filtroAsignaturaRecurso,
  #filtroGradoRecurso,
  #filtroTrimestreRecurso {
    height: 38px;
    padding: 0 14px;
    border: 1px solid var(--app-border);
    border-radius: 999px;
    background: #ffffff;
    font-family: inherit;
    font-size: 12px;
    font-weight: 700;
    color: #334155;
    cursor: pointer;
    transition: border-color .15s ease, background .15s ease;
  }
  .biblio-filtro:hover,
  #filtroAsignaturaRecurso:hover,
  #filtroGradoRecurso:hover,
  #filtroTrimestreRecurso:hover { border-color: #93c5fd; background: #f8fbff; }
  .biblio-filtro:focus,
  #filtroAsignaturaRecurso:focus,
  #filtroGradoRecurso:focus,
  #filtroTrimestreRecurso:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }
  .biblio-subir {
    height: 38px;
    padding: 0 16px;
    border: 0;
    border-radius: 999px;
    background: #2563eb;
    color: #ffffff;
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.28);
    transition: background .15s ease, transform .12s ease, box-shadow .15s ease;
  }
  .biblio-subir:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.34);
  }
  .biblio-subir:focus-visible { outline: 2px solid #1d4ed8; outline-offset: 2px; }

  /* Libros SEP oficiales */
  #gridLibrosOficialesSEP {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
    margin: 0 0 18px;
  }
  #gridLibrosOficialesSEP .libro-sep {
    display: flex;
    flex-direction: column;
    gap: 7px;
    padding: 10px;
    background: #ffffff;
    border: 1px solid var(--app-border);
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
    text-align: center;
    transition: transform .15s ease, border-color .15s ease, box-shadow .15s ease;
  }
  #gridLibrosOficialesSEP .libro-sep:hover {
    transform: translateY(-2px);
    border-color: #bfdbfe;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
  }
  #gridLibrosOficialesSEP .libro-sep img {
    width: 100%;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    border-radius: 8px;
    background: #e2e8f0;
  }
  #gridLibrosOficialesSEP .libro-sep__grado {
    align-self: center;
    padding: 2px 8px;
    border-radius: 999px;
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: .04em;
    text-transform: uppercase;
  }
  #gridLibrosOficialesSEP .libro-sep__btn {
    padding: 6px 8px;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    background: #f8fbff;
    color: #1d4ed8;
    font-family: inherit;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
  }
  #gridLibrosOficialesSEP .libro-sep__btn:hover { background: #eff6ff; border-color: #93c5fd; }

  /* Repositorio colectivo */
  .biblio-grid,
  .repositorio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(236px, 1fr));
    gap: 14px;
  }
  .card-recurso {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px;
    background: #ffffff;
    border: 1px solid var(--app-border);
    border-radius: 14px;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
  }
  .card-recurso:hover {
    transform: translateY(-2px);
    border-color: #bfdbfe;
    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.09);
  }
  .card-recurso__tipo {
    align-self: flex-start;
    padding: 3px 9px;
    border-radius: 999px;
    background: #e0f2fe;
    color: #0369a1;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .03em;
  }
  .card-recurso__tipo--pdf { background: #fee2e2; color: #b91c1c; }
  .card-recurso__tipo--presentacion { background: #ffedd5; color: #c2410c; }
  .card-recurso__tipo--enlace { background: #dbeafe; color: #1d4ed8; }
  .card-recurso__tipo--video { background: #ede9fe; color: #6d28d9; }
  .card-recurso__titulo {
    margin: 0;
    font-size: 13.5px;
    font-weight: 700;
    line-height: 1.35;
    color: #0f172a;
  }
  .card-recurso__meta {
    font-size: 11.5px;
    line-height: 1.45;
    color: #64748b;
  }
  .card-recurso__acciones {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: auto;
    padding-top: 4px;
  }
  .biblio-vacio {
    grid-column: 1 / -1;
    padding: 36px 20px;
    text-align: center;
    border: 1px dashed #cbd5e1;
    border-radius: 14px;
    background: #f8fafc;
    font-size: 13px;
    line-height: 1.55;
    color: #64748b;
  }

  /* ---------- 3 · Tecnología CECSE ---------- */
  .badge-cecse {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 11px;
    border: 1px solid #bae6fd;
    border-radius: 999px;
    background: #e0f2fe;
    color: #0284c7;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: .04em;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .panel-cecse {
    padding: 14px 16px;
    background: #ffffff;
    border: 1px solid var(--app-border);
    border-left: 4px solid #0284c7;
    border-radius: 14px;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    margin: 0 0 14px;
  }
  .cecse-horas {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 10px 0 14px;
  }
  .cecse-horas__item {
    flex: 1 1 150px;
    padding: 10px 12px;
    border: 1px solid #e0f2fe;
    border-radius: 10px;
    background: #f0f9ff;
  }
  .cecse-horas__n {
    display: block;
    font-size: 18px;
    font-weight: 800;
    line-height: 1.1;
    color: #0284c7;
  }
  .cecse-horas__l {
    display: block;
    margin-top: 2px;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: .03em;
    text-transform: uppercase;
    color: #0369a1;
  }
  .cecse-software-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 10px;
  }
  .cecse-software {
    padding: 12px;
    border: 1px solid var(--app-border);
    border-radius: 12px;
    background: #ffffff;
  }
  .cecse-software__grado {
    display: block;
    margin: 0 0 6px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .05em;
    text-transform: uppercase;
    color: #64748b;
  }
  .cecse-software__badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 8px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
    font-size: 11.5px;
    font-weight: 700;
  }
  .cecse-software__badge--excel { background: #ecfdf5; border-color: #a7f3d0; color: #047857; }
  .cecse-software__badge--powerpoint { background: #fff7ed; border-color: #fed7aa; color: #c2410c; }

  /* ---------- 4 · Vista previa del alumno ---------- */
  #modalPreviewAlumno {
    position: fixed;
    inset: 0;
    z-index: 99980;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(15, 23, 42, 0.6);
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px);
    opacity: 0;
    pointer-events: none;
    transition: opacity .16s ease;
  }
  #modalPreviewAlumno.visible,
  #modalPreviewAlumno.abierto { opacity: 1; pointer-events: auto; }

  #modalPreviewAlumno .preview-panel {
    width: min(940px, 96vw);
    max-height: 92vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 26px 64px rgba(15, 23, 42, 0.34);
    transform: translateY(10px) scale(.99);
    transition: transform .18s cubic-bezier(.2, .8, .2, 1);
  }
  #modalPreviewAlumno.visible .preview-panel,
  #modalPreviewAlumno.abierto .preview-panel { transform: none; }

  .preview-cabecera {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 18px;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #ffffff;
    flex: 0 0 auto;
  }
  .preview-cabecera h3 {
    margin: 0;
    font-size: 14.5px;
    font-weight: 800;
    color: #ffffff;
  }
  .preview-cerrar {
    margin-left: auto;
    width: 30px;
    height: 30px;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    font-size: 15px;
    line-height: 1;
    cursor: pointer;
  }
  .preview-cerrar:hover { background: rgba(255, 255, 255, 0.24); }
  .preview-cerrar:focus-visible { outline: 2px solid #ffffff; outline-offset: 2px; }

  .preview-marco {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    margin: 16px;
    border: 1px solid var(--app-border);
    border-radius: 14px;
    overflow: hidden;
    background: #ffffff;
  }
  .preview-barra {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: #eef2f7;
    border-bottom: 1px solid #dbe3ec;
    flex: 0 0 auto;
  }
  .preview-punto {
    width: 9px;
    height: 9px;
    min-width: 9px;
    border-radius: 50%;
    background: #f87171;
  }
  .preview-punto:nth-child(2) { background: #fbbf24; }
  .preview-punto:nth-child(3) { background: #34d399; }
  .preview-url {
    flex: 1 1 auto;
    height: 24px;
    margin-left: 8px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    border: 1px solid #dbe3ec;
    border-radius: 999px;
    background: #ffffff;
    font-size: 11px;
    color: #64748b;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .preview-lienzo {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    padding: 22px;
    background: #ffffff;
    font-size: 14px;
    line-height: 1.6;
    color: var(--app-text);
  }
  .preview-acciones {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 0 16px 16px;
    flex: 0 0 auto;
  }

  /* ---------- 5 · Iframe embebido con carga y fallback ---------- */
  .bloque-iframe-container {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    margin: 12px 0;
    border: 1px solid var(--app-border);
    border-radius: 14px;
    overflow: hidden;
    background: #0f172a;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
  }
  .bloque-iframe-container > iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
  }
  .iframe-cargando {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: #0f172a;
    color: #cbd5e1;
    font-size: 12px;
    font-weight: 600;
    transition: opacity .25s ease;
  }
  .bloque-iframe-container.cargado .iframe-cargando { opacity: 0; pointer-events: none; }
  .iframe-spinner {
    width: 26px;
    height: 26px;
    border: 3px solid rgba(255, 255, 255, 0.18);
    border-top-color: #38bdf8;
    border-radius: 50%;
    animation: iframeSpin .9s linear infinite;
  }
  @keyframes iframeSpin { to { transform: rotate(360deg); } }
  .iframe-fallback {
    position: absolute;
    inset: auto 0 0 0;
    z-index: 2;
    display: none;
    padding: 10px 14px;
    background: rgba(220, 38, 38, 0.92);
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
  }
  .bloque-iframe-container.error .iframe-fallback { display: block; }
  .bloque-iframe-container.error .iframe-cargando { opacity: 0; pointer-events: none; }
  .bloque-iframe-container .iframe-abrir {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 3;
    padding: 5px 11px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.74);
    color: #ffffff;
    font-size: 11px;
    font-weight: 700;
    text-decoration: none;
    opacity: 0;
    transition: opacity .15s ease, background .15s ease;
  }
  .bloque-iframe-container:hover .iframe-abrir,
  .bloque-iframe-container:focus-within .iframe-abrir { opacity: 1; }
  .bloque-iframe-container .iframe-abrir:hover { background: rgba(37, 99, 235, 0.92); }
  .bloque-iframe-container .iframe-abrir:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
    opacity: 1;
  }
  @supports not (aspect-ratio: 1 / 1) {
    .bloque-iframe-container { height: 0; padding-top: 56.25%; }
  }

  /* ---------- 6 · Línea del tiempo del proyecto NEM ---------- */
  #timelineProyectoNEM {
    display: flex;
    align-items: flex-start;
    gap: 0;
    width: 100%;
    overflow-x: auto;
    padding: 8px 2px 16px;
    margin: 0 0 8px;
  }
  .timeline-paso {
    position: relative;
    flex: 1 1 0;
    min-width: 118px;
    padding: 0 4px;
    text-align: center;
  }
  .timeline-paso::before {
    content: '';
    position: absolute;
    top: 14px;
    left: calc(-50% + 16px);
    right: calc(50% + 16px);
    height: 2px;
    background: #e2e8f0;
  }
  .timeline-paso:first-child::before { display: none; }
  .timeline-paso__punto {
    position: relative;
    width: 30px;
    height: 30px;
    margin: 0 auto 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #e2e8f0;
    border-radius: 999px;
    background: #f1f5f9;
    color: #94a3b8;
    font-size: 12px;
    font-weight: 800;
    line-height: 1;
  }
  .timeline-paso__titulo {
    display: block;
    font-size: 11.5px;
    font-weight: 700;
    line-height: 1.3;
    color: #64748b;
  }
  .timeline-paso__sub {
    display: block;
    margin-top: 2px;
    font-size: 10px;
    font-weight: 600;
    color: #94a3b8;
  }

  /* Estado: completado */
  .timeline-paso.completado .timeline-paso__punto {
    background: #dcfce7;
    border-color: #86efac;
    color: #15803d;
  }
  .timeline-paso.completado .timeline-paso__titulo { color: #15803d; }
  .timeline-paso.completado::before { background: #86efac; }

  /* Estado: activo (pulso) */
  .timeline-paso.activo .timeline-paso__punto {
    background: #2563eb;
    border-color: #2563eb;
    color: #ffffff;
    animation: timelinePulso 2.2s ease-in-out infinite;
  }
  .timeline-paso.activo .timeline-paso__titulo { color: #1d4ed8; font-weight: 800; }
  @keyframes timelinePulso {
    0%, 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.45); }
    50%      { box-shadow: 0 0 0 7px rgba(37, 99, 235, 0); }
  }

  /* Estado: pendiente */
  .timeline-paso.pendiente .timeline-paso__punto {
    background: #f1f5f9;
    border-color: #e2e8f0;
    color: #94a3b8;
  }
  .timeline-paso.pendiente .timeline-paso__titulo { color: #94a3b8; }

  @media (prefers-reduced-motion: reduce) {
    .timeline-paso.activo .timeline-paso__punto { animation: none; }
    .iframe-spinner { animation: none; }
  }

  @media (max-width: 640px) {
    .bloque-iframe-container { aspect-ratio: 4 / 3; border-radius: 10px; }
    .biblio-grid,
    .repositorio-grid { grid-template-columns: 1fr; }
    .preview-marco { margin: 10px; }
    .preview-lienzo { padding: 14px; }
    #timelineProyectoNEM .timeline-paso { min-width: 104px; }
```

### Módulo 2 · Estructura HTML

```html
<div id="vistaBibliotecaDocente">
  <div class="biblio-filtros">
    <div class="biblio-buscador">
      <span class="biblio-lupa">🔍</span>
      <input id="buscarRecursoBiblioteca" type="text" placeholder="Buscar por título, autor o tema…">
    </div>
    <select class="biblio-filtro" id="filtroAsignaturaRecurso">…</select>
    <select class="biblio-filtro" id="filtroGradoRecurso">…</select>
    <select class="biblio-filtro" id="filtroTrimestreRecurso">…</select>
    <button type="button" class="biblio-subir">+ Compartir Recurso</button>
  </div>

  <div id="gridLibrosOficialesSEP">
    <article class="libro-sep">
      <img src="…" alt="Portada">
      <span class="libro-sep__grado">1° grado</span>
      <button type="button" class="libro-sep__btn">📖 Abrir Visor SEP</button>
    </article>
  </div>

  <div class="biblio-grid">
    <article class="card-recurso">
      <span class="card-recurso__tipo card-recurso__tipo--pdf">📄 PDF</span>
      <h4 class="card-recurso__titulo">Guía CTE · Fase intensiva</h4>
      <p class="card-recurso__meta">Prof. Ramírez · 12 oct · Colegiado</p>
      <div class="card-recurso__acciones">
        <button type="button" class="btn-soft-primary">Vista previa</button>
        <button type="button" class="btn-outline-custom">Descargar</button>
      </div>
    </article>
  </div>
</div>
```

Variantes de tipo disponibles: `.card-recurso__tipo--pdf`, `--presentacion`, `--enlace`, `--video`. Estado vacío: `<div class="biblio-vacio">` dentro de `.biblio-grid`.

### Módulo 3 · Estructura HTML

```html
<div class="panel-cecse">
  <span class="badge-cecse">💻 Aula CECSE</span>
  <div class="cecse-horas">
    <div class="cecse-horas__item">
      <span class="cecse-horas__n">2 h</span><span class="cecse-horas__l">Teoría · Aula</span>
    </div>
    <div class="cecse-horas__item">
      <span class="cecse-horas__n">6 h</span><span class="cecse-horas__l">Práctica · CECSE</span>
    </div>
  </div>
  <div class="cecse-software-grid">
    <div class="cecse-software">
      <span class="cecse-software__grado">1° grado</span>
      <span class="cecse-software__badge">📝 Word / Ofimática básica</span>
    </div>
    <div class="cecse-software">
      <span class="cecse-software__grado">2° grado</span>
      <span class="cecse-software__badge cecse-software__badge--excel">📊 Excel / Datos</span>
    </div>
    <div class="cecse-software">
      <span class="cecse-software__grado">3° grado</span>
      <span class="cecse-software__badge cecse-software__badge--powerpoint">🎨 PowerPoint + IA</span>
    </div>
  </div>
</div>
```

### Módulo 4 · Estructura HTML

```html
<!-- Vista previa del alumno -->
<div id="modalPreviewAlumno" class="visible" role="dialog" aria-modal="true">
  <div class="preview-panel">
    <header class="preview-cabecera">
      <h3>Vista previa · como lo ve el alumno</h3>
      <button type="button" class="preview-cerrar" aria-label="Cerrar">✕</button>
    </header>
    <div class="preview-marco">
      <div class="preview-barra">
        <span class="preview-punto"></span><span class="preview-punto"></span><span class="preview-punto"></span>
        <span class="preview-url">st90.app/alumno · Español 1°A · T1</span>
      </div>
      <div class="preview-lienzo"><!-- aquí se inyecta el bloque del alumno --></div>
    </div>
    <div class="preview-acciones">
      <button type="button" class="btn-outline-custom">Cerrar</button>
    </div>
  </div>
</div>

<!-- Iframe con carga y fallback -->
<div class="bloque-iframe-container">
  <div class="iframe-cargando">
    <span class="iframe-spinner"></span><span>Cargando contenido interactivo…</span>
  </div>
  <div class="iframe-fallback">No se pudo cargar el recurso. Ábrelo en una pestaña nueva.</div>
  <iframe src="…" title="…" loading="lazy" allowfullscreen onload="this.closest('.bloque-iframe-container').classList.add('cargado')"></iframe>
  <a class="iframe-abrir" href="…" target="_blank" rel="noopener">Abrir en pestaña ↗</a>
</div>

<!-- Línea del tiempo -->
<div id="timelineProyectoNEM">
  <div class="timeline-paso completado"><span class="timeline-paso__punto">✓</span><span class="timeline-paso__titulo">Diagnóstico</span><span class="timeline-paso__sub">Fase 1</span></div>
  <div class="timeline-paso activo"><span class="timeline-paso__punto">3</span><span class="timeline-paso__titulo">Formulación</span><span class="timeline-paso__sub">Fase 3</span></div>
  <div class="timeline-paso pendiente"><span class="timeline-paso__punto">4</span><span class="timeline-paso__titulo">Evaluación formativa</span><span class="timeline-paso__sub">Fase 4</span></div>
</div>
```

**Estados de la línea del tiempo:** `.completado` (verde `#dcfce7`/`#86efac`), `.activo` (azul con pulso `timelinePulso`), `.pendiente` (gris `#f1f5f9`). El conector se dibuja con `.timeline-paso::before` y se apaga solo en el primer paso.

**Iframe:** la clase `.cargado` en el contenedor oculta la capa de carga; `.error` muestra el fallback rojo. Ambas las pone Cursor por evento.

## 3. Inventario completo de clases e IDs nuevos (todos presentacionales)

| Grupo | Clases / IDs | Notas |
| :--- | :--- | :--- |
| Ayuda contextual | `.btn-ayuda-nem`, `[data-ayuda-campo]`, `[data-tip]`, `[data-badge]` | El `data-ayuda-campo` lo usa Cursor para enlazar el diccionario |
| Modal ayuda | `.ayuda-nem-panel`, `-cabecera`, `-icono`, `-ceja`, `-cerrar`, `-cuerpo`, `-etiqueta`, `-bloque--proposito/-como/-ejemplo`, `-pie`, `-entendido` | Los IDs `#modalAyudaTitulo/Proposito/ComoLlenar/Ejemplo` ya están en el contrato |
| Asistente | `.ia-drawer-velo`, `.ia-drawer-cabecera`, `.ia-avatar`, `.ia-drawer-titulo`, `.ia-drawer-cerrar`, `.ia-sugerencias`, `.ia-chip`, `.ia-composer`, `.ia-vacio`, `.msg-ia`, `.msg-docente`, `.msg-hora` | |
| Biblioteca | `.biblio-filtros`, `.biblio-buscador`, `.biblio-lupa`, `.biblio-filtro`, `.biblio-subir`, `.biblio-grid`, `.biblio-vacio`, `.libro-sep`, `.libro-sep__grado`, `.libro-sep__btn`, `.card-recurso`, `.card-recurso__tipo` (+4 variantes), `__titulo`, `__meta`, `__acciones` | |
| CECSE | `.badge-cecse`, `.panel-cecse`, `.cecse-horas`, `.cecse-horas__item/__n/__l`, `.cecse-software-grid`, `.cecse-software`, `__grado`, `__badge` (+`--excel`, `--powerpoint`) | |
| Preview | `.preview-panel`, `.preview-cabecera`, `.preview-cerrar`, `.preview-marco`, `.preview-barra`, `.preview-punto`, `.preview-url`, `.preview-lienzo`, `.preview-acciones` | |
| Iframe | `.bloque-iframe-container`, `.iframe-cargando`, `.iframe-spinner`, `.iframe-fallback`, `.iframe-abrir`, estados `.cargado` / `.error` | |
| Línea del tiempo | `.timeline-paso`, `.timeline-paso__punto`, `__titulo`, `__sub`, estados `.completado` / `.activo` / `.pendiente` | |

## 4. Decisiones que conviene auditar

1. **El toast sube a `bottom: 92px`.** Vivía en `right: 20px; bottom: 20px`, justo donde ahora flota el asistente. Preferí subir el toast 72 px antes que mover el botón: sigue en la misma esquina, aparece por encima y no tapa nada.
2. **Tooltip propio en lugar del nativo.** `title` no se puede estilizar ni se lee igual en todos los navegadores; `[data-tip]::before` da el mismo resultado sin JavaScript y con contraste AA sobre `#0f172a`.
3. **Cursiva serif para el ejemplo pedagógico** (la partitura permitía "monoespaciada o cursiva"): en un documento escolar la cursiva con serif se lee como cita, y el bloque se distingue del texto instructivo.
4. **`prefers-reduced-motion`** desactiva el halo del FAB, el pulso de la línea del tiempo y el spinner. El diseño sigue siendo legible sin animación.
5. **Nada de `!important`** en las piezas nuevas: todo se resuelve por ID o por clases propias, sin pelear con `AdminCSS.html`.
6. **`@media print`** oculta FAB, drawer, velo y botones ❓ para que no ensucien una impresión del panel.
7. **Preexistencia verificada:** los siete selectores del contrato no existían en ningún archivo antes de esta entrega (barrido sobre todos los `.html`), así que no hubo que reescribir estilos previos.

## 5. Verificación

| Comprobación | Resultado |
| :--- | :--- |
| Llaves CSS balanceadas | `ComunCSS.html` 395/395 · `AdminPlaneacionCSS.html` 260/260 |
| Fases 5 y 6 | intactas (los bloques anteriores no se tocaron) |
| Los 4 módulos renderizados | ✅ sin desbordes ni solapamientos a 980 px y en móvil |
| Drawer medido | **379 px** de ancho (objetivo 380) |
| Contraste del ❓ | `#64748b` sobre `#f8fafc` con peso 800 y 12 px |
| IDs / `onclick` / `.gs` | sin cambios |

Evidencia en `evidencia_fase7/`:

| Archivo | Qué muestra |
| :--- | :--- |
| `modulo1_ayuda_modal.png` | Modal pedagógico con los 3 bloques y `backdrop-filter` |
| `modulo1_drawer.png` | Drawer con avatar, chip, burbujas y sugerencias |
| `modulo2_biblioteca.png` | Buscador con lupa, filtros píldora, libros SEP, `.card-recurso` y línea del tiempo |
| `modulo3_cecse.png` | Insignia, distribución 2 h/6 h, badges por grado y botón ❓ |
| `modulo4_preview_alumno.png` | Marco de navegador con el bloque del alumno |

## 6. Rollback

```
C:\Users\40B\AppData\Local\Temp\st90_backup_fase5\ComunCSS_pre_fase7.html
C:\Users\40B\AppData\Local\Temp\st90_backup_fase5\AdminPlaneacionCSS_pre_fase7.html
```

Restaurar cualquiera de los dos revierte solo esta fase y conserva las Fases 5 y 6.

## 7. Lo que NO incluye esta entrega

- **`#modalSubirRecurso` / `#formSubirRecursoBiblioteca`**: no están en la lista de selectores asignados. Si Cursor los necesita, hace falta que Antigravity los añada a la partitura.
- **Lógica de eventos, `DICCIONARIO_AYUDA_NEM`, endpoints y `google.script.run`**: es territorio de Cursor y de Antigravity. Aquí solo hay CSS y estructura de referencia.
