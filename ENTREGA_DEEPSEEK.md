# ENTREGA_DEEPSEEK — FASES 5 y 6 · Ribbon aSc Horarios + Tarjetas iDevice

| Campo | Valor |
| :--- | :--- |
| **Agente** | DeepSeek — Diseñador UI/UX & Especialista CSS |
| **Fase** | 5 — cerrada · **6 — Desacoplamiento CSS y pulido de tarjetas iDevice (activa)** |
| **Fecha** | 2026-10-29 · 19:41 (Fase 5) y 20:05 (Fase 6) · America/Mexico_City |
| **Estado** | **ENTREGADO** · Fase 5 aprobada por Antigravity · Fase 6 pendiente de auditoría |
| **Archivos tocados** | `ComunCSS.html` (Fases 5 y 6) · `Admin.html` (Fase 5) |
| **Archivos prohibidos respetados** | `*.gs`, `AdminJS_*`, `AdminPlanJS_*`, `AdminEncJS_*`, `ComunJS`, `AdminCSS.html`, `AdminPlaneacionCSS.html`, `AdminEncuestasCSS.html`, `ESTADO_COORDINACION.md`, `CONTROL_CAMBIOS.md` |
| **Gobernanza** | Sin `git commit`, sin `git push`, sin `clasp push/deploy` |

---

## 1. Resumen ejecutivo

Se sustituyeron **31 iconos SVG monocromáticos** por ilustraciones vectoriales a color (viewBox `0 0 32 32`) con volumen, sombra y paleta propia por función escolar, y se reconstruyó la cinta como un **ribbon clásico**: degradado suave `#fbfcfe → #f1f5f9 → #e6ecf3`, botón en caja vertical (icono 30 px arriba, etiqueta 12 px abajo), hover con marco redondeado translúcido y elevación de 1 px, y divisores verticales sutiles entre agrupaciones.

**Cero cambios** en IDs, clases funcionales, atributos `onclick`, scriptlets de Apps Script o backend.

---

## 2. Archivos y ubicaciones exactas

| Archivo | Naturaleza del cambio | Líneas | Diff |
| :--- | :--- | :--- | :--- |
| `ComunCSS.html` | Bloque CSS nuevo **FASE 5**, puramente aditivo | 713–886 (174 líneas) | **−0 / +175** |
| `Admin.html` | SVG interior de 31 botones + 5 divisores + envoltura `.ribbon-icono` | 74–283 | **−137 / +36** (solo compresión de SVG) |

El bloque CSS se insertó **antes** del marcador `DESIGN SYSTEM MODULAR "LEGO"` (línea 889), de modo que sus reglas ganan por orden de aparición sin borrar nada existente.

---

## 3. CSS entregado (`ComunCSS.html`, líneas 713–886)

```css
  /* ============================================================
     FASE 5 · ESTILO aSc HORARIOS 2027 — RIBBON E ICONOS ILUSTRADOS
     DeepSeek · Solo apariencia: IDs, clases funcionales y onclick intactos.
     Alcance acotado al contrato del DOM: #menuTabsPanel (Nivel 1) y
     #menuUsuTabs / #menuAsiTabs / #menuLecTabs / #menuPlanTabs /
     #menuEncTabs (Nivel 2). Ninguna otra barra del sistema se altera.
     ============================================================ */
  :root {
    --ribbon-deg-top: #fbfcfe;
    --ribbon-deg-mid: #f1f5f9;
    --ribbon-deg-bot: #e6ecf3;
    --ribbon-borde-suave: #dbe3ec;
    --ribbon-sep: #cfd9e4;
    --ribbon-foco: rgba(37, 99, 235, 0.35);
  }

  /* Fondo de cinta con degradado suave tipo Office / aSc Horarios */
  .ribbon-main-nav {
    background: linear-gradient(180deg, var(--ribbon-deg-top) 0%, var(--ribbon-deg-mid) 62%, var(--ribbon-deg-bot) 100%) !important;
    border-bottom: 1px solid var(--ribbon-borde-suave) !important;
    box-shadow: 0 1px 0 rgba(15, 23, 42, 0.03) !important;
  }

  /* Divisor vertical sutil entre agrupaciones de herramientas */
  .ribbon-main-nav .separador-ribbon {
    display: inline-block;
    flex: 0 0 1px;
    width: 1px;
    height: 30px;
    align-self: center;
    margin: 0 4px !important;
    padding: 0 !important;
    border: 0;
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(207,217,228,0) 0%, var(--ribbon-sep) 22%, var(--ribbon-sep) 78%, rgba(207,217,228,0) 100%);
    pointer-events: none;
  }

  /* ---------------- Nivel 1: caja vertical del ribbon ---------------- */
  #menuTabsPanel > .ribbon-tab {
    min-width: 76px !important;
    min-height: 74px !important;
    padding: 7px 10px 6px !important;
    gap: 3px !important;
    border-radius: 12px !important;
    background: rgba(255, 255, 255, 0.38) !important;
    border: 1px solid rgba(255, 255, 255, 0.62) !important;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.035) !important;
    transition: background .16s ease, border-color .16s ease, box-shadow .16s ease, transform .12s ease;
  }
  #menuTabsPanel > .ribbon-tab:hover:not(.activa) {
    background: rgba(255, 255, 255, 0.88) !important;
    border-color: rgba(37, 99, 235, 0.18) !important;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08) !important;
    transform: translateY(-1px);
  }
  #menuTabsPanel > .ribbon-tab.activa,
  #menuTabsPanel > .ribbon-tab.activa:hover {
    background: #ffffff !important;
    border-color: #b9c6d4 !important;
    box-shadow: 0 3px 12px rgba(15, 23, 42, 0.09) !important;
    transform: none;
  }
  #menuTabsPanel > .ribbon-tab:focus-visible,
  #menuUsuTabs > .ribbon-btn:focus-visible,
  #menuAsiTabs > .ribbon-btn:focus-visible,
  #menuLecTabs > .ribbon-btn:focus-visible,
  #menuPlanTabs > .ribbon-btn:focus-visible,
  #menuEncTabs > .ribbon-btn:focus-visible {
    outline: 2px solid var(--ribbon-foco) !important;
    outline-offset: 2px !important;
  }

  /* ---------------- Nivel 2: sub-cintas del contrato ---------------- */
  #menuUsuTabs > .ribbon-btn,
  #menuAsiTabs > .ribbon-btn,
  #menuPlanTabs > .ribbon-btn,
  #menuEncTabs > .ribbon-btn,
  #menuLecTabs .ribbon-btn,
  .ribbon-main-nav .cinta-n2 > .btn-ayuda.ribbon-btn {
    min-width: 56px !important;
    min-height: 58px !important;
    padding: 5px 8px 4px !important;
    gap: 3px !important;
    border-radius: 10px !important;
    background: rgba(255, 255, 255, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.62) !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03) !important;
    transition: background .16s ease, border-color .16s ease, box-shadow .16s ease, transform .12s ease;
  }
  #menuUsuTabs > .ribbon-btn:hover:not(:disabled),
  #menuAsiTabs > .ribbon-btn:hover:not(:disabled),
  #menuPlanTabs > .ribbon-btn:hover:not(:disabled),
  #menuEncTabs > .ribbon-btn:hover:not(:disabled),
  #menuLecTabs .ribbon-btn:hover:not(:disabled),
  .ribbon-main-nav .cinta-n2 > .btn-ayuda.ribbon-btn:hover {
    background: rgba(255, 255, 255, 0.9) !important;
    border-color: rgba(37, 99, 235, 0.18) !important;
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.07) !important;
    transform: translateY(-1px);
  }
  #menuUsuTabs > .ribbon-btn.activo,
  #menuUsuTabs > .ribbon-btn.activa,
  #menuAsiTabs > .ribbon-btn.activo,
  #menuAsiTabs > .ribbon-btn.activa,
  #menuPlanTabs > .ribbon-btn.activo,
  #menuPlanTabs > .ribbon-btn.activa,
  #menuEncTabs > .ribbon-btn.activo,
  #menuEncTabs > .ribbon-btn.activa,
  #menuLecTabs .ribbon-btn.activo,
  #menuLecTabs .ribbon-btn.activa {
    background: #ffffff !important;
    border-color: #a9b8c8 !important;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.07) !important;
  }

  /* ---------------- Icono ilustrado y etiqueta ---------------- */
  .ribbon-icono {
    display: flex !important;
    align-items: center;
    justify-content: center;
    width: 30px !important;
    height: 30px !important;
    flex: 0 0 auto;
    pointer-events: none;
  }
  #menuTabsPanel .ribbon-icono svg { width: 30px !important; height: 30px !important; display: block; overflow: visible; }
  .cinta-n2 .ribbon-icono svg { width: 28px !important; height: 28px !important; display: block; overflow: visible; }

  /* Los iconos ilustrados no heredan el trazo monocromático de la cinta */
  .ribbon-icono svg { stroke: none !important; }
  .ribbon-icono svg * { vector-effect: non-scaling-stroke; }

  #menuTabsPanel .ribbon-label {
    font-size: 12px !important;
    font-weight: 700 !important;
    letter-spacing: .01em !important;
    color: #334155 !important;
  }
  .cinta-n2 .ribbon-label {
    font-size: 11.5px !important;
    font-weight: 600 !important;
    color: #3f4c5c !important;
  }
  #menuUsuTabs > .ribbon-btn.activo .ribbon-label,
  #menuUsuTabs > .ribbon-btn.activa .ribbon-label,
  #menuAsiTabs > .ribbon-btn.activo .ribbon-label,
  #menuAsiTabs > .ribbon-btn.activa .ribbon-label,
  #menuPlanTabs > .ribbon-btn.activo .ribbon-label,
  #menuPlanTabs > .ribbon-btn.activa .ribbon-label,
  #menuEncTabs > .ribbon-btn.activo .ribbon-label,
  #menuEncTabs > .ribbon-btn.activa .ribbon-label,
  #menuLecTabs .ribbon-btn.activo .ribbon-label,
  #menuLecTabs .ribbon-btn.activa .ribbon-label {
    color: #1e40af !important;
    font-weight: 700 !important;
  }

  /* ---------------- Adaptación a pantallas angostas ---------------- */
  @media (max-width: 820px) {
    #menuTabsPanel > .ribbon-tab {
      min-width: 62px !important; min-height: 66px !important; padding: 5px 6px 4px !important;
    }
    #menuTabsPanel .ribbon-icono, #menuTabsPanel .ribbon-icono svg { width: 26px !important; height: 26px !important; }
    #menuUsuTabs > .ribbon-btn,
    #menuAsiTabs > .ribbon-btn,
    #menuPlanTabs > .ribbon-btn,
    #menuEncTabs > .ribbon-btn,
    #menuLecTabs .ribbon-btn { min-width: 52px !important; min-height: 54px !important; padding: 4px 6px 3px !important; }
    .cinta-n2 .ribbon-icono, .cinta-n2 .ribbon-icono svg { width: 25px !important; height: 25px !important; }
    #menuTabsPanel .ribbon-label { font-size: 11px !important; }
    .cinta-n2 .ribbon-label { font-size: 10.5px !important; }
    .ribbon-main-nav .separador-ribbon { height: 22px; margin: 0 2px !important; }
  }
```

---

## 4. Código SVG entregado — Nivel 1 y sub-cinta de Usuarios

Patrón común de cada botón (**no cambia ningún ID ni `onclick`**):

```html
<button type="button" id="btnTabMat" class="ribbon-tab ribbon-ico-azul" onclick="tab('mat', this)" aria-label="Usuarios">
  <span class="ribbon-icono" aria-hidden="true"><svg viewBox="0 0 32 32" width="30" height="30" focusable="false" xmlns="http://www.w3.org/2000/svg" style="stroke:none !important">…</svg></span>
  <span class="ribbon-label">Usuarios</span>
</button>
```

### 4.1 `#btnTabMat` — Usuarios (dos estudiantes sonrientes, cálido) · Admin.html:74

```html
<span class="ribbon-icono" aria-hidden="true"><svg viewBox="0 0 32 32" width="30" height="30" focusable="false" xmlns="http://www.w3.org/2000/svg" style="stroke:none !important"><ellipse cx="16" cy="28.8" rx="9.8" ry="1.8" fill="#0f172a" opacity=".07"/><path d="M17.3 26.6v-5a5.2 5.2 0 0 1 10.4 0v5z" fill="#fbbf24"/><circle cx="22.5" cy="9.6" r="4" fill="#ffd8b4"/><path d="M18.5 9.4a4 4 0 0 1 8 0c0 .7-.5 1.2-1.2 1.2h-5.6c-.7 0-1.2-.5-1.2-1.2z" fill="#8a5a2b"/><circle cx="21.4" cy="9.9" r=".8" fill="#2b1a10"/><circle cx="23.6" cy="9.9" r=".8" fill="#2b1a10"/><path d="M4.6 27.4v-5a6.4 6.4 0 0 1 12.8 0v5z" fill="#e07a3a"/><path d="M11 22.4l1.6 2 1.6-2" fill="#c2541f"/><circle cx="11" cy="11.5" r="5" fill="#ffd8b4"/><path d="M6 11.2a5 5 0 0 1 10 0c0 .8-.6 1.4-1.4 1.4H7.4c-.8 0-1.4-.6-1.4-1.4z" fill="#3f2a17"/><circle cx="9.4" cy="12" r=".95" fill="#2b1a10"/><circle cx="12.6" cy="12" r=".95" fill="#2b1a10"/><path d="M9.2 14.6c1.1 1.3 2.9 1.3 4 0" stroke="#b45309" stroke-width="1.1" stroke-linecap="round" fill="none"/></svg></span>
```

### 4.2 `#btnTabAsi` — Asistencia (calendario con check verde) · Admin.html:78

```html
<span class="ribbon-icono" aria-hidden="true"><svg viewBox="0 0 32 32" width="30" height="30" focusable="false" xmlns="http://www.w3.org/2000/svg" style="stroke:none !important"><ellipse cx="16" cy="28.8" rx="9" ry="1.7" fill="#0f172a" opacity=".07"/><rect x="4.8" y="6.4" width="22.4" height="21.2" rx="3.4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2"/><path d="M4.8 9.8a3.4 3.4 0 0 1 3.4-3.4h15.6a3.4 3.4 0 0 1 3.4 3.4v2.2H4.8z" fill="#16a34a"/><rect x="9.6" y="3.6" width="2.8" height="6" rx="1.4" fill="#0f766e"/><rect x="19.6" y="3.6" width="2.8" height="6" rx="1.4" fill="#0f766e"/><rect x="8.4" y="15.4" width="7.4" height="2" rx="1" fill="#cbd5e1"/><rect x="8.4" y="19.8" width="5.4" height="2" rx="1" fill="#e2e8f0"/><circle cx="22.4" cy="21.6" r="6" fill="#22c55e"/><path d="M19.6 21.7l2 2 3.6-4" stroke="#ffffff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg></span>
```

### 4.3 `#btnTabLec` — Lecturas (libro con lomo dorado y bloque de hojas) · Admin.html:83

```html
<span class="ribbon-icono" aria-hidden="true"><svg viewBox="0 0 32 32" width="30" height="30" focusable="false" xmlns="http://www.w3.org/2000/svg" style="stroke:none !important"><ellipse cx="16" cy="28.7" rx="9.6" ry="1.7" fill="#0f172a" opacity=".07"/><rect x="4.6" y="5.4" width="18.2" height="21.6" rx="2.4" fill="#2563eb"/><rect x="20.8" y="7.2" width="6" height="18" rx="1.2" fill="#f8fafc"/><path d="M22.6 9.8h3M22.6 13.2h3M22.6 16.6h3M22.6 20h3M22.6 23.4h3" stroke="#cbd5e1" stroke-width="1" stroke-linecap="round"/><rect x="4.6" y="5.4" width="4.6" height="21.6" rx="2.3" fill="#f59e0b"/><rect x="5.9" y="9.6" width="1.2" height="4.4" rx=".6" fill="#ffffff" opacity=".55"/><rect x="11.4" y="9.4" width="8.4" height="2.6" rx="1.3" fill="#fbbf24"/><rect x="11.4" y="14.4" width="6.4" height="1.8" rx=".9" fill="#bfdbfe"/><rect x="11.4" y="18" width="7.6" height="1.8" rx=".9" fill="#bfdbfe" opacity=".75"/><path d="M17.8 5.4h2.8v7.2l-1.4-1.3-1.4 1.3z" fill="#ef4444"/></svg></span>
```

### 4.4 `#btnTabPlan` — Planeación (libreta didáctica con pluma) · Admin.html:88

```html
<span class="ribbon-icono" aria-hidden="true"><svg viewBox="0 0 32 32" width="30" height="30" focusable="false" xmlns="http://www.w3.org/2000/svg" style="stroke:none !important"><ellipse cx="16" cy="28.6" rx="9.2" ry="1.8" fill="#0f172a" opacity=".07"/><rect x="5.2" y="5.4" width="19.4" height="22" rx="2.6" fill="#ffffff" stroke="#c7d2fe" stroke-width="1.2"/><rect x="5.2" y="5.4" width="4.8" height="22" rx="2.4" fill="#4f46e5"/><rect x="11.6" y="9.2" width="10.2" height="1.9" rx=".95" fill="#c7d2fe"/><rect x="11.6" y="13.2" width="7.8" height="1.9" rx=".95" fill="#dbeafe"/><rect x="11.6" y="17.2" width="9.2" height="1.9" rx=".95" fill="#dbeafe"/><rect x="20.6" y="8.2" width="4" height="13.2" rx="1.2" fill="#f59e0b"/><path d="M20.6 21.4h4l-2 4.4z" fill="#fde68a"/><path d="M21.9 24.3h1.4l-.7 1.6z" fill="#334155"/><rect x="20.6" y="6.4" width="4" height="2.2" rx=".9" fill="#ef4444"/></svg></span>
```

### 4.5 `#btnTabEnc` — Encuestas (portapapeles con barras y check) · Admin.html:93

```html
<span class="ribbon-icono" aria-hidden="true"><svg viewBox="0 0 32 32" width="30" height="30" focusable="false" xmlns="http://www.w3.org/2000/svg" style="stroke:none !important"><ellipse cx="16" cy="28.8" rx="8.8" ry="1.7" fill="#0f172a" opacity=".07"/><rect x="5.6" y="5.2" width="20.8" height="22.4" rx="3.2" fill="#e0f2fe" stroke="#7dd3fc" stroke-width="1.2"/><rect x="11.6" y="3" width="8.8" height="4.8" rx="2" fill="#0284c7"/><circle cx="16" cy="5.4" r="1.1" fill="#e0f2fe"/><rect x="9.2" y="13.4" width="3.6" height="9.8" rx="1.1" fill="#38bdf8"/><rect x="14.2" y="10.4" width="3.6" height="12.8" rx="1.1" fill="#0284c7"/><rect x="19.2" y="15.6" width="3.6" height="7.6" rx="1.1" fill="#0ea5e9"/><path d="M18.6 24.6l2.2 2.2 4-4.4" stroke="#16a34a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg></span>
```

### 4.6 `#btnSubUsuAlu` — Alumnos (estudiante con mochila) · Admin.html:101

```html
<span class="ribbon-icono" aria-hidden="true"><svg viewBox="0 0 32 32" width="30" height="30" focusable="false" xmlns="http://www.w3.org/2000/svg" style="stroke:none !important"><ellipse cx="16" cy="28.6" rx="8" ry="1.7" fill="#0f172a" opacity=".07"/><rect x="21" y="17.2" width="5.4" height="8.6" rx="2" fill="#c2410c"/><path d="M8.8 26.8v-5.4a7.2 7.2 0 0 1 14.4 0v5.4z" fill="#f59e0b"/><path d="M15.2 21.6l.8 2 1.6-2" fill="#d97706"/><circle cx="16" cy="11.4" r="5.2" fill="#ffd8b4"/><path d="M10.8 11.1a5.2 5.2 0 0 1 10.4 0c0 .8-.6 1.4-1.4 1.4h-7.6c-.8 0-1.4-.6-1.4-1.4z" fill="#4a2f18"/><circle cx="14.1" cy="11.9" r="1" fill="#2b1a10"/><circle cx="17.9" cy="11.9" r="1" fill="#2b1a10"/><path d="M13.9 14.5c1.2 1.4 3 1.4 4.2 0" stroke="#b45309" stroke-width="1.1" stroke-linecap="round" fill="none"/></svg></span>
```

### 4.7 `#btnSubUsuDoc` — Docentes (birrete negro con borla naranja) · Admin.html:105

```html
<span class="ribbon-icono" aria-hidden="true"><svg viewBox="0 0 32 32" width="30" height="30" focusable="false" xmlns="http://www.w3.org/2000/svg" style="stroke:none !important"><ellipse cx="16" cy="25.8" rx="6.6" ry="1.3" fill="#0f172a" opacity=".08"/><path d="M16 4.4l12 5.2-12 5.2L4 9.6z" fill="#1f2937"/><path d="M16 4.4l12 5.2-12 5.2z" fill="#111827"/><path d="M10.4 13.2l5.6 2.4 5.6-2.4v5.2c0 2.2-2.5 4-5.6 4s-5.6-1.8-5.6-4z" fill="#374151"/><path d="M27.6 10.2v6.2" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round"/><circle cx="27.6" cy="17.4" r="2" fill="#f59e0b"/></svg></span>
```

### 4.8 `#btnSubUsuPref` — Prefectas (credencial con escudo) · Admin.html:109

```html
<span class="ribbon-icono" aria-hidden="true"><svg viewBox="0 0 32 32" width="30" height="30" focusable="false" xmlns="http://www.w3.org/2000/svg" style="stroke:none !important"><ellipse cx="16" cy="28.6" rx="7.8" ry="1.7" fill="#0f172a" opacity=".07"/><rect x="6.4" y="5" width="19.2" height="23" rx="3.2" fill="#fffbeb" stroke="#fcd34d" stroke-width="1.2"/><path d="M6.4 8.2a3.2 3.2 0 0 1 3.2-3.2h12.8a3.2 3.2 0 0 1 3.2 3.2v2.2H6.4z" fill="#ca8a04"/><circle cx="12.4" cy="15.4" r="3.1" fill="#fbbf24"/><path d="M8 22.8c0-2.4 2-4.4 4.4-4.4s4.4 2 4.4 4.4z" fill="#f59e0b"/><rect x="18.4" y="13.6" width="5" height="1.7" rx=".85" fill="#a16207"/><rect x="18.4" y="17.4" width="5" height="1.7" rx=".85" fill="#d97706"/><path d="M22.6 19.8l3.6 1.7v3.4c0 2.2-1.6 3.8-3.6 4.4-2-.6-3.6-2.2-3.6-4.4v-3.4z" fill="#16a34a"/><path d="M21 24.6l1.2 1.2 2.2-2.4" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg></span>
```

### 4.9 `#btnSubUsuAdm` — Apoyo (engranaje de servicio) · Admin.html:113

> **Nota de contrato:** la partitura cita `#btnSubUsuApo`, pero el DOM real tiene `#btnSubUsuAdm` con etiqueta "Apoyo". **No se renombró**: se ilustró el ID existente.

```html
<span class="ribbon-icono" aria-hidden="true"><svg viewBox="0 0 32 32" width="30" height="30" focusable="false" xmlns="http://www.w3.org/2000/svg" style="stroke:none !important"><ellipse cx="16" cy="26.6" rx="6.8" ry="1.4" fill="#0f172a" opacity=".08"/><g fill="#0f766e"><rect x="14.1" y="4.6" width="3.8" height="5.2" rx="1.5" transform="rotate(0 16 16)"/><rect x="14.1" y="4.6" width="3.8" height="5.2" rx="1.5" transform="rotate(45 16 16)"/><rect x="14.1" y="4.6" width="3.8" height="5.2" rx="1.5" transform="rotate(90 16 16)"/><rect x="14.1" y="4.6" width="3.8" height="5.2" rx="1.5" transform="rotate(135 16 16)"/><rect x="14.1" y="4.6" width="3.8" height="5.2" rx="1.5" transform="rotate(180 16 16)"/><rect x="14.1" y="4.6" width="3.8" height="5.2" rx="1.5" transform="rotate(225 16 16)"/><rect x="14.1" y="4.6" width="3.8" height="5.2" rx="1.5" transform="rotate(270 16 16)"/><rect x="14.1" y="4.6" width="3.8" height="5.2" rx="1.5" transform="rotate(315 16 16)"/></g><circle cx="16" cy="16" r="8.8" fill="#14b8a6"/><circle cx="16" cy="16" r="8.8" fill="none" stroke="#0f766e" stroke-width="1.2"/><circle cx="16" cy="16" r="3.7" fill="#ecfeff"/><circle cx="16" cy="16" r="3.7" fill="none" stroke="#0f766e" stroke-width="1.2"/></svg></span>
```

---

## 5. Inventario completo de los 31 iconos sustituidos

| Botón | Línea `Admin.html` | Ilustración | Paleta dominante |
| :--- | ---: | :--- | :--- |
| `#btnTabMat` | 74 | Dos estudiantes sonrientes | `#e07a3a` · `#fbbf24` |
| `#btnTabAsi` | 78 | Calendario + check | `#16a34a` · `#22c55e` |
| `#btnTabLec` | 83 | Libro con lomo dorado | `#2563eb` · `#f59e0b` |
| `#btnTabPlan` | 88 | Libreta + pluma | `#4f46e5` · `#f59e0b` |
| `#btnTabEnc` | 93 | Portapapeles + barras + check | `#0284c7` |
| `#btnSubUsuAlu` | 101 | Estudiante con mochila | `#f59e0b` · `#c2410c` |
| `#btnSubUsuDoc` | 105 | Birrete + borla | `#1f2937` · `#f59e0b` |
| `#btnSubUsuPref` | 109 | Credencial + escudo | `#ca8a04` · `#16a34a` |
| `#btnSubUsuAdm` | 113 | Engranaje | `#14b8a6` |
| `#btnAsiAlu` | 154 | Estudiante (reúso) | `#f59e0b` |
| `#btnAsiMae` | 158 | Birrete (reúso) | `#1f2937` |
| `#btnAsiRep` | 162 | Barras comparativas | `#f59e0b` `#16a34a` `#0284c7` |
| `#btnAsiPref` | 166 | Credencial (reúso) | `#ca8a04` |
| `#btnSubEncGraficas` | 182 | Tarjeta con barras | `#0284c7` |
| `#btnSubEncDatos` | 186 | Tabla / hoja de datos | `#0ea5e9` |
| `#btnSubEncEditor` | 190 | Hoja + lápiz | `#f59e0b` |
| `#btnSubEncEnlace` | 194 | Ojo de vista previa | `#22c55e` |
| `#btnSubLecBanco` | 210 | Pila de tres libros | `#1d4ed8` · `#60a5fa` |
| `#btnSubLecTrim` | 214 | Calendario con casillas | `#0284c7` |
| `#btnSubLecRes` | 218 | Barras verdes | `#10b981` |
| `#btnTabCfg` | 223 | Engranaje índigo | `#6366f1` |
| `#btnSubPlanHorario` | 253 | Cuadrícula semanal | `#0284c7` |
| `#btnSubPlanBancoPersonal` | 257 | Persona + ficha | `#8b5cf6` |
| `#btnSubPlanBancoGlobal` | 261 | Globo terráqueo | `#2563eb` |
| `#btnSubPlanNueva` | 265 | Documento + signo más | `#16a34a` |
| `#btnAyudaMat` | 119 | Burbuja de ayuda | `#f59e0b` |
| `#btnAyudaAsiCinta` | 172 | Burbuja de ayuda | `#f59e0b` |
| `#btnAyudaEnc` | 200 | Burbuja de ayuda | `#f59e0b` |
| `#btnAyudaLec` | 241 | Burbuja de ayuda | `#f59e0b` |
| `#btnAyudaPlan` | 271 | Burbuja de ayuda | `#f59e0b` |
| *Salir* (`cerrarSesion()`) | 283 | Puerta + flecha | `#dc2626` |

**Divisores verticales** (`<span class="separador-ribbon" aria-hidden="true"></span>`), líneas **118, 171, 199, 240, 270**.

---

## 6. Decisiones técnicas que requieren auditoría

1. **Discrepancia de contrato `#btnSubUsuApo` vs `#btnSubUsuAdm`.** Se ilustró el ID real (`Adm`, etiqueta "Apoyo"). Recomendación: corregir el texto de la partitura en `ESTADO_COORDINACION.md` §5.
2. **`style="stroke:none !important"` en la raíz de cada `<svg>`.** Las reglas heredadas de la cinta fuerzan el trazo monocromático con especificidad alta:
   - `.ribbon-main-nav .tabs > button.ribbon-tab.ribbon-ico-azul svg { stroke:#2563eb !important }` → (0,4,1)
   - `#menuLecTabs .ribbon-btn.activa svg { stroke: currentColor !important }` → (1,2,1)

   Sin esa anulación, cada figura recibía un contorno de 1 px del color de la pestaña (efecto visible: birrete "morado", estudiantes "azules"). El `!important` en línea **solo afecta la raíz**; los trazos internos (checks blancos, sonrisas) declaran su propio `stroke` y se conservan.
3. **Alcance acotado por ID, no por clase.** `.ribbon-btn` se usa en ~90 puntos dentro de los módulos (`AdminUsuarios`, `AdminAsistencia`, `AdminLecturas`, `AdminPlaneacion`) y `.ribbon-tab` en `Clase.html`, `AdminPlaneacion.html` (N1) y `AdminEncuestas.html` (barra contextual). Por eso **no** se reestilizó la clase global: todas las reglas nuevas van ancladas a `#menuTabsPanel`, `#menuUsuTabs`, `#menuAsiTabs`, `#menuLecTabs`, `#menuPlanTabs`, `#menuEncTabs`.
4. **Segundo bloque `:root`.** Válido en CSS; no sustituye ni borra el `:root` original (línea 2).
5. **Clase nueva `.ribbon-icono`.** Solo presentacional, sin ID, sin evento. Envuelve el `<svg>` para fijar caja de 30/28 px.
6. **Sin reglas eliminadas.** El diff de `ComunCSS.html` es −0 / +175.

---

## 7. Verificación ejecutada

| Comprobación | Antes | Después |
| :--- | ---: | ---: |
| Atributos `id=` en `Admin.html` | 104 | **104** |
| Atributos `onclick=` en `Admin.html` | 64 | **64** |
| Scriptlets `<?!=` / `<?=` | 56 | **56** |
| SVG `viewBox="0 0 24 24"` en cintas | 33 | **2** (ayudas dentro de modales, fuera de alcance) |
| SVG `viewBox="0 0 32 32"` nuevos | — | **31** |
| Divisores `.separador-ribbon` | — | **5** |
| Reglas CSS eliminadas | — | **0** |

Render validado en Chromium headless a **1140 px** y **430 px**: sin desbordes, sin solapamientos, etiqueta 12 px / 11.5 px, icono 30 px / 28 px (26/25 px en móvil).

---

## 8. Rollback

Copia intacta de ambos archivos previa a la Fase 5, guardada **fuera** del proyecto para que `clasp push` no duplique `Admin.html`:

```
C:\Users\40B\AppData\Local\Temp\st90_backup_fase5\Admin.html
C:\Users\40B\AppData\Local\Temp\st90_backup_fase5\ComunCSS.html
```

Restaurar = copiar ambos sobre `G:\Mi unidad\PROYECTOS\Lectura\` (revierte el 100 % de la Fase 5).

---

## 9. Evidencia visual

- `evidencia_fase5/fase5_ribbon.png` — cinta completa (Nivel 1 + sub-cintas) a 2×.
- `evidencia_fase5/fase5_iconos.png` — los 31 iconos a 84 px para control de calidad.

Ambos PNG están excluidos de `clasp push` por `.claspignore` (`**/*.png`), igual que este `.md` (`**/*.md`).

---

## 10. Propuesta para Fase 6 (no ejecutada)

Llevar el mismo lenguaje ilustrado a las tarjetas de módulo (`.bloque`, `.kpi-card`, `.sep-libro-card`) y a los estados vacíos, para que el ribbon no quede como una isla estética dentro del panel. Requiere partitura de Antigravity con los selectores exactos.

---

## 11. Control de revisión de este documento

Verificación automática contra los archivos reales (2026-10-29, 19:52 America/Mexico_City):

| Comprobación | Resultado |
| :--- | :--- |
| Bloque CSS del §3 vs `ComunCSS.html` 713–886 | **idéntico byte a byte** |
| 9 bloques SVG del §4.1–4.9 vs `Admin.html` | **idénticos** en los 9 |
| Números de línea del §5 | **corregidos** (estaban +1: apuntaban al `<span>`, no al `<button>`) |
| Conteo de SVG monocromáticos previos (§7) | **corregido**: 33, no 32 |
| `id=` / `onclick=` / scriptlets | 104 / 64 / 56 — sin cambio |

---

# PARTE II — FASE 6 · Tarjetas iDevice

## 12. Encargo y diagnóstico

La partitura §5 de `ESTADO_COORDINACION.md` asignó a DeepSeek cerrar el hueco detectado en la auditoría cruzada:

- `.idevice-card`, `.idevice-card-audio`, `.idevice-card-pregunta` y `.idevice-card-reto` eran **solo ganchos de script** (`btn.closest('.idevice-card')`) sin una sola regla CSS en el proyecto.
- `AdminPlanJS_06.html` inyectaba los campos con `style.cssText`, saltándose el sistema de diseño.
- Consecuencia real: en el **visor de clase** (`Clase.html`, que incluye solo `ComunCSS` y `ClaseCSS`) las tarjetas se dibujaban como un `div` desnudo, porque `.idevice-container` y `.idevice-btn` viven en `ComunCSS`/`AdminPlaneacionCSS` y `Clase.html` no carga el segundo.

## 13. CSS entregado (`ComunCSS.html`, líneas 1221–1346)

Insertado dentro de la sección **BLOQUES MODULARES iDEVICES**, justo después de `.idevice-container:hover` y antes de `.idevice-header`.

```css
  /* ============================================================
     FASE 6 · TARJETAS iDEVICE — DESACOPLAMIENTO CSS
     DeepSeek · Las clases .idevice-card* son ganchos de script
     (btn.closest('.idevice-card')) y, además, deben sostener la tarjeta
     por sí solas: el visor de clase (Clase.html) no carga
     AdminPlaneacionCSS, así que ahí no existe .idevice-btn.
     ============================================================ */

  /* --- 1 · Contenedor de bloque --- */
  .idevice-card {
    position: relative;
    display: block;
    margin: 12px 0;
    padding: 14px 16px;
    background: #ffffff;
    border: 1px solid var(--app-border);
    border-radius: var(--app-radius-lg);
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
    overflow: hidden;
    break-inside: avoid;
    transition: box-shadow 0.15s ease, border-color 0.15s ease;
  }
  .idevice-card:hover {
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
  }
  /* En Admin la tarjeta viaja con .idevice-container: ahí el relleno lo
     aportan .idevice-header y .idevice-body, no la tarjeta. */
  .idevice-card.idevice-container {
    margin: 16px 0;
    padding: 0;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.03);
  }

  /* --- 2 · Variantes temáticas --- */
  .idevice-card-audio {
    border-left: 5px solid var(--app-primary);
    background: linear-gradient(180deg, #f8fbff 0%, #ffffff 58%);
  }
  .idevice-card-pregunta {
    border-left: 5px solid #10b981;
    background: linear-gradient(180deg, #f7fdfa 0%, #ffffff 58%);
  }
  .idevice-card-reto {
    border-left: 5px solid #f59e0b;
    background: linear-gradient(180deg, #fffdf7 0%, #ffffff 58%);
  }

  .idevice-card.idevice-card-audio > .idevice-header    { background: #f0f7ff; color: var(--app-primary-dark); }
  .idevice-card.idevice-card-pregunta > .idevice-header { background: #ecfdf5; color: #065f46; }
  .idevice-card.idevice-card-reto > .idevice-header     { background: #fffbeb; color: #92400e; }

  .idevice-card.idevice-card-audio .idevice-tag    { background: #dbeafe; color: var(--app-primary-dark); }
  .idevice-card.idevice-card-pregunta .idevice-tag { background: #a7f3d0; color: #065f46; }
  .idevice-card.idevice-card-reto .idevice-tag     { background: #fde68a; color: #92400e; }

  /* La barra de audio estrena acento propio en la variante de voz */
  .idevice-card-audio .idevice-audio-bar {
    background: #f0f7ff;
    border-color: #bfdbfe;
  }

  /* --- 3 · Campos del formulario (contrato Fase 6) --- */
  .idevice-campo-titulo {
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 6px;
    font-weight: 600;
    padding: 6px 8px;
    border: 1px solid var(--app-border);
    border-radius: 4px;
  }
  .idevice-campo-cuerpo {
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
    padding: 8px;
    border: 1px solid var(--app-border);
    border-radius: 4px;
  }
  /* Refuerzo tipográfico y de foco (no altera el contrato anterior) */
  .idevice-campo-titulo,
  .idevice-campo-cuerpo {
    font-family: inherit;
    font-size: 13px;
    line-height: 1.45;
    color: var(--app-text);
    background: #ffffff;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .idevice-campo-titulo::placeholder,
  .idevice-campo-cuerpo::placeholder { color: #94a3b8; }
  .idevice-campo-titulo:focus,
  .idevice-campo-cuerpo:focus {
    outline: none;
    border-color: #93c5fd;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }

  /* AdminCSS aplica min-height:180px a todo textarea: el cuerpo del
     iDevice necesita dos renglones, no media pantalla. */
  .idevice-campo-cuerpo { min-height: 56px; }

  /* --- 4 · Botonera de respaldo para el visor de clase --- */
  .idevice-card:not(.idevice-container) .idevice-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    font-size: 11.5px;
    font-weight: 700;
    color: #334155;
    background: #ffffff;
    border: 1px solid var(--app-border);
    border-radius: 7px;
    cursor: pointer;
    transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease;
  }
  .idevice-card:not(.idevice-container) .idevice-btn:hover {
    background: #eff6ff;
    border-color: #93c5fd;
    color: var(--app-primary-dark);
  }
  .idevice-card:not(.idevice-container) .idevice-btn:focus-visible {
    outline: 2px solid #0284c7;
    outline-offset: 2px;
  }
```

## 14. Contrato con Cursor (Fase 6, punto 2 de la partitura)

En `AdminPlanJS_06.html`, dentro de `pintarTarjetaIDevice_`:

```javascript
// antes
titulo.style.cssText = 'width:100%;box-sizing:border-box;margin-bottom:6px;';
cuerpo.style.cssText = 'width:100%;box-sizing:border-box;resize:vertical;';

// después
titulo.className = 'idevice-campo-titulo';
cuerpo.className = 'idevice-campo-cuerpo';
```

Los valores del contrato están cubiertos uno a uno:

| Declaración exigida | `.idevice-campo-titulo` | `.idevice-campo-cuerpo` |
| :--- | :---: | :---: |
| `width: 100%` | ✅ | ✅ |
| `box-sizing: border-box` | ✅ | ✅ |
| `margin-bottom: 6px` | ✅ | — |
| `font-weight: 600` | ✅ | — |
| `padding` | `6px 8px` ✅ | `8px` ✅ |
| `border: 1px solid var(--app-border)` | ✅ | ✅ |
| `border-radius: 4px` | ✅ | ✅ |
| `resize: vertical` | — | ✅ |

## 15. Decisiones técnicas

1. **`.idevice-card` es autosuficiente, no un simple refuerzo.** Se le dieron fondo, borde, radio, sombra, `overflow: hidden` y `break-inside: avoid`, porque en `Clase.html` es la única clase de la tarjeta. En Admin convive con `.idevice-container` y el resultado es idéntico.
2. **Sin `:has()`.** Para evitar doble relleno en Admin se usa `.idevice-card.idevice-container { padding: 0; }`: ahí el relleno lo aportan `.idevice-header` y `.idevice-body`. En Clase, sin contenedor, la tarjeta aplica `padding: 14px 16px`.
3. **`min-height: 56px` en el cuerpo.** `AdminCSS.html` (línea 515) aplica `textarea { min-height: 180px }` a *todo* textarea; el cuerpo del iDevice se estiraba a media pantalla (detectado en el render de prueba). La regla lo acota a dos renglones sin tocar el global.
4. **Misma paleta que la Fase 4.** `.idevice-card-pregunta` usa el verde de `.idevice-pregunta` y `.idevice-card-reto` el ámbar de `.idevice-desafio`, con lo que Admin (clases antiguas) y Clase (clases nuevas) se ven igual.
5. **Botonera de respaldo acotada.** `.idevice-card:not(.idevice-container) .idevice-btn` da estilo al botón Quitar / Escuchar solo cuando no existe `AdminPlaneacionCSS`; en Admin no altera nada (mayor especificidad, pero excluido por `:not`).
6. **Cero `!important`, cero cambios de ID, cero JavaScript, cero archivos `.gs`.**

## 16. Verificación

| Comprobación | Resultado |
| :--- | :--- |
| Diff de `ComunCSS.html` vs copia previa | **−0 / +128 líneas** (puramente aditivo) |
| Llaves `{` / `}` en el archivo | **338 / 338** — balanceadas |
| Bloque Fase 5 (ribbon) | **intacto** (`FASE 5 · ESTILO aSc HORARIOS 2027` presente) |
| Render Admin (ComunCSS + AdminCSS + AdminPlaneacionCSS) | ✅ tarjeta con acento, encabezado teñido, campos de 2 renglones |
| Render Clase (solo ComunCSS) | ✅ tarjeta completa con botón Quitar y acento por tipo |
| IDs y `onclick` | sin cambio (esta fase no toca `Admin.html`) |

Evidencia: `evidencia_fase6/fase6_tarjetas_admin.png` y `evidencia_fase6/fase6_tarjetas_clase.png`.

## 17. Rollback

```
C:\Users\40B\AppData\Local\Temp\st90_backup_fase5\ComunCSS_pre_fase6.html   (estado justo antes de la Fase 6)
C:\Users\40B\AppData\Local\Temp\st90_backup_fase5\ComunCSS.html            (estado previo a la Fase 5)
```

Restaurar la primera sobre `ComunCSS.html` revierte solo la Fase 6 y conserva el ribbon.

## 18. Pendiente detectado (para una Fase 7, no ejecutado)

`ClaseJS_08.html` sigue construyendo las tarjetas con `innerHTML` lleno de `style="..."` en línea y sin `.idevice-header`, `.idevice-body` ni `.idevice-campo-*`. La tarjeta ya se ve correcta gracias a `.idevice-card`, pero su tipografía y sus campos no están unificados con Admin. Eso es territorio de Cursor: requiere sustituir el `innerHTML` por nodos con las clases del contrato. No lo toqué.
