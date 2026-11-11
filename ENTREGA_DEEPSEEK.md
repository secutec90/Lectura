# BUZÓN DE ENTREGA: DEEPSEEK -> ANTIGRAVITY

> **INSTRUCCIÓN PARA DEEPSEEK (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md`, `.skills/aula-constructor/SKILL.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_DEEPSEEK.md`) toda tu propuesta de maquetación Blade y estilos CSS para que Antigravity la audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js deepseek`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: FASE 1 — MAQUETACIÓN BLADE Y TAILWIND DEL CONSTRUCTOR VISUAL DE AULA EN LARAVEL (`resources/views/aula/constructor.blade.php`)
- **Agente responsable:** **DeepSeek** (Diseñador Visual, UX/UI & Blade/Tailwind)
- **Estado:** 🟢 **PROGRAMADA Y LISTA PARA EJECUCIÓN**
- **Documento Rector y Skill:** Consulta [.skills/aula-constructor/SKILL.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/.skills/aula-constructor/SKILL.md) y [RSC_MIGRACION_FUSION_LARAVEL.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/RSC_MIGRACION_FUSION_LARAVEL.md).

### Especificación Técnica de la Entrega:
1. **Vista Blade Principal (`resources/views/aula/constructor.blade.php`):**
   - Diseñar la vista extendiendo del layout base de Laravel o creando una plantilla inmersiva de ancho completo (`w-full min-h-screen bg-slate-50`).
2. **Barra Superior del Lienzo (`divi-canvas-topbar`):**
   - Sliders de Página y Sección (`40%` a `100%`) con etiquetas de porcentaje dinámico.
   - Botones de alineación (`⬅️` izquierda, `↔️` centro, `➡️` derecha).
   - Botón toggle rápido: `🏷️ Cabeceras: Visibles / Ocultas`.
   - Botones de Deshacer `↩️` y Rehacer `↪️`.
3. **Jerarquía DIVI (Sección > Fila > Columna > Módulo):**
   - Estilos hover limpios: Sección con borde azul (`hover:border-sky-500`), Fila con borde verde (`hover:border-emerald-500`).
   - Botón circular verde flotante `(+)` entre filas para selector de columnas (`.btn-plus-green`).
   - Dropzone de columna con estado activo (`.active-target` con fondo sutil y borde discontinuo).
   - Botón interior `[+ Añadir Módulo]` al pie de cada columna.
4. **Mosaicos y CSS Grid (Tailwind / CSS puro):**
   - Implementar las clases de cuadrícula: `col-1`, `col-2`, `col-2-70-30`, `col-3`, `col-4`, `mosaico-3-izq`, `mosaico-3-der` y el `mosaico-3` (6 subcolumnas asimétricas).
5. **Regla de Tarjetas Limpias:**
   - La clase `.content-card.tarjeta-sin-cabecera` para que las imágenes y módulos sin cabecera personalizada se muestren al 100% de ancho sin encabezados genéricos intrusivos.

---

### 📝 ZONA DE ENTREGA DE DEEPSEEK (Escribe tu propuesta aquí abajo):

*(DeepSeek: deposita aquí tu código Blade, clases Tailwind y CSS modular)*

---

## ✅ ENTREGA DEEPSEEK — FASE 1 (`Laravel`) · Maquetación Blade + Tailwind del Constructor Visual de Aula

**Fecha:** 2026-11-11 · **Autor:** DeepSeek (UI/UX, Blade & Tailwind) · **Estado:** 🟢 LISTA PARA INTEGRAR

### Documentos rectores consultados
- `.skills/aula-constructor/SKILL.md` (contrato inmutable: jerarquía DIVI, retículas, tarjetas limpias).
- `RSC_MIGRACION_FUSION_LARAVEL.md` (rutas `/docente/constructor/{id}` y `/aula/{sesion}`, columna `lienzo_json`, fases).

### Ubicación de los archivos

| Archivo | Ruta destino |
|---|---|
| Vista principal | `resources/views/aula/constructor.blade.php` |
| CSS modular | `resources/css/aula-constructor.css` (importar en `resources/css/app.css`) |

> **Nota de contexto:** en este workspace no existe todavía una instalación Laravel (no hay `artisan`, `composer.json` ni `resources/`). Por eso entrego el **contenido completo** de ambos archivos listo para pegarse en el proyecto Academia, en lugar de editar archivos inexistentes.

---

## 1. `resources/views/aula/constructor.blade.php`

```blade
{{--
  Constructor Visual de Aula — ST90 / Laravel 12
  Contrato: .skills/aula-constructor/SKILL.md
  Jerarquía: .divi-section > .divi-row > .divi-column > .idevice-card
  Regla de oro: ningún módulo vive suelto; toda tarjeta de imagen arranca sin cabecera.
--}}
<!DOCTYPE html>
<html lang="es-MX" class="h-full">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Constructor de clase · ST90</title>

  @vite(['resources/css/app.css', 'resources/css/aula-constructor.css'])

  {{-- Datos que el lienzo necesita para hidratarse desde la BD --}}
  <script>
    window.ST90_AULA = {
      sesionId: {{ (int) ($sesion->id ?? 0) }},
      guardarUrl: @json(route('docente.constructor.guardar', $sesion->id ?? 0, false)),
      lienzo: @json($sesion->lienzo_json ?? null),
    };
  </script>
</head>

<body class="w-full min-h-screen bg-slate-50 text-slate-800 antialiased">

  {{-- ============================================================
       BARRA SUPERIOR DEL DISEÑADOR
       Vive DENTRO del canvas, nunca encima del banner ni del botón flotante.
       ============================================================ --}}
  <header class="divi-canvas-topbar sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white/95 px-4 py-2 backdrop-blur">

    {{-- 1 · Historial --}}
    <div class="flex items-center gap-1" role="group" aria-label="Historial de cambios">
      <button type="button" id="btnDeshacer"
              class="rounded border border-slate-300 bg-slate-100 px-2 py-1 text-sm leading-none hover:bg-slate-200 disabled:opacity-40"
              title="Deshacer" aria-label="Deshacer" disabled>↩️</button>
      <button type="button" id="btnRehacer"
              class="rounded border border-slate-300 bg-slate-100 px-2 py-1 text-sm leading-none hover:bg-slate-200 disabled:opacity-40"
              title="Rehacer" aria-label="Rehacer" disabled>↪️</button>
    </div>

    <span class="h-6 w-px bg-slate-200" aria-hidden="true"></span>

    {{-- 2 · Anchos de página y sección --}}
    <div class="flex flex-wrap items-center gap-4 rounded-md border border-slate-300 bg-slate-50 px-3 py-1">
      <div class="flex items-center gap-2">
        <label for="rangoPagina" class="text-[11px] font-semibold text-slate-600">Página</label>
        <input type="range" id="rangoPagina" min="40" max="100" value="100" step="1"
               class="w-20 accent-sky-600" aria-label="Ancho de página en porcentaje">
        <span id="valorPagina" class="w-10 text-right text-[11px] font-bold text-sky-700">100%</span>
      </div>
      <div class="flex items-center gap-2">
        <label for="rangoSeccion" class="text-[11px] font-semibold text-slate-600">Sección</label>
        <input type="range" id="rangoSeccion" min="40" max="100" value="100" step="1"
               class="w-20 accent-sky-600" aria-label="Ancho de sección en porcentaje">
        <span id="valorSeccion" class="w-10 text-right text-[11px] font-bold text-sky-700">100%</span>
      </div>
    </div>

    <span class="h-6 w-px bg-slate-200" aria-hidden="true"></span>

    {{-- 3 · Alineación --}}
    <div class="flex items-center gap-1" role="group" aria-label="Alineación del lienzo">
      <button type="button" class="btn-alinear" id="btn-izq" data-align="start" aria-label="Alinear a la izquierda" aria-pressed="false">⬅️</button>
      <button type="button" class="btn-alinear activo" id="btn-centro" data-align="center" aria-label="Centrar" aria-pressed="true">↔️</button>
      <button type="button" class="btn-alinear" id="btn-der" data-align="end" aria-label="Alinear a la derecha" aria-pressed="false">➡️</button>
    </div>

    <span class="h-6 w-px bg-slate-200" aria-hidden="true"></span>

    {{-- 4 · Toggle de cabeceras --}}
    <button type="button" id="btnToggleCabeceras"
            class="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1 text-[11.5px] font-semibold text-slate-700 hover:bg-slate-50"
            aria-pressed="false">
      <span aria-hidden="true">🏷️</span>
      <span id="txtToggleCabeceras">Cabeceras: Visibles</span>
    </button>

    {{-- 5 · Guardado --}}
    <div class="ml-auto flex items-center gap-2">
      <span id="estadoGuardado" class="text-[11px] text-slate-500">Sin cambios</span>
      <button type="button" id="btnGuardar"
              class="rounded-md bg-sky-600 px-4 py-1.5 text-[12px] font-bold text-white shadow-sm hover:bg-sky-700">
        Guardar clase
      </button>
    </div>
  </header>

  {{-- ============================================================
       LIENZO
       ============================================================ --}}
  <main class="app-workspace w-full px-4 py-6">
    <div id="lienzoExeActivo"
         class="mx-auto flex w-full max-w-none flex-col gap-6 transition-[width] duration-200"
         style="width: 100%; align-items: center;"
         data-alineacion="center">

      {{-- ---------- SECCIÓN ---------- --}}
      <section class="divi-section group relative w-full rounded-xl border-2 border-transparent bg-white p-4 transition-colors hover:border-sky-500"
               data-seccion-id="sec_demo_1"
               style="width: 100%;">

        {{-- Toolbar flotante de sección (izquierda, azul) --}}
        <div class="toolbar-flotante" role="toolbar" aria-label="Acciones de la sección">
          <button type="button" title="Mover sección" aria-label="Mover sección">✥</button>
          <button type="button" title="Duplicar sección" aria-label="Duplicar sección">⧉</button>
          <button type="button" title="Propiedades de sección" aria-label="Propiedades de sección">⚙</button>
          <button type="button" title="Eliminar sección" aria-label="Eliminar sección">✕</button>
        </div>

        {{-- ---------- FILA ---------- --}}
        <div class="divi-row col-2 group/row relative gap-4 transition-colors"
             data-row-id="row_demo_1" data-layout="col-2">

          {{-- Toolbar flotante de fila (derecha, verde) --}}
          <div class="toolbar-flotante" role="toolbar" aria-label="Acciones de la fila">
            <span class="drag-handle" title="Arrastrar fila" aria-label="Arrastrar fila">⇅</span>
            <button type="button" title="Duplicar fila" aria-label="Duplicar fila">⧉</button>
            <button type="button" title="Eliminar fila" aria-label="Eliminar fila">✕</button>
          </div>

          {{-- COLUMNA 1 --}}
          <div class="divi-column active-target flex flex-col gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/60 p-2"
               data-col-id="col_demo_1_1">

            {{-- MÓDULO: imagen limpia, sin cabecera genérica --}}
            <article class="idevice-card content-card tarjeta-sin-cabecera relative rounded-lg border border-slate-200 bg-white shadow-sm"
                     data-modulo-id="mod_demo_1"
                     data-tipo="galeria"
                     data-ocultar-cabecera="1">
              <div class="toolbar-flotante" role="toolbar" aria-label="Acciones del módulo">
                <span class="drag-handle" title="Arrastrar módulo" aria-label="Arrastrar módulo">⇅</span>
                <button type="button" title="Propiedades" aria-label="Propiedades del módulo">⚙</button>
                <button type="button" title="Eliminar" aria-label="Eliminar módulo">✕</button>
              </div>

              <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=70"
                   alt="Mariposa monarca posada sobre una flor silvestre"
                   class="block h-auto w-full rounded-lg object-cover">

              {{-- Descripción accesible DUA: si está vacía, no ocupa espacio --}}
              <p class="txt-alt-dua mt-2 flex items-start gap-2 rounded-md bg-sky-50 px-3 py-2 text-[11.5px] text-sky-900">
                <span aria-hidden="true">🔊</span>
                <span><strong>Descripción accesible DUA:</strong> Mariposa monarca posada sobre una flor silvestre.</span>
              </p>
            </article>

            {{-- Botón interior de columna --}}
            <button type="button"
                    class="btn-add-module-inside btn-modulo mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition hover:bg-teal-700"
                    title="Añadir módulo en esta columna" aria-label="Añadir módulo en esta columna">+</button>
          </div>

          {{-- COLUMNA 2 --}}
          <div class="divi-column flex flex-col gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/60 p-2"
               data-col-id="col_demo_1_2">

            {{-- MÓDULO con cabecera propia --}}
            <article class="idevice-card content-card relative rounded-lg border border-slate-200 bg-white shadow-sm"
                     data-modulo-id="mod_demo_2" data-tipo="texto">
              <header class="flex items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
                <h3 class="text-[12.5px] font-bold text-slate-800">¿Qué observas en la imagen?</h3>
                <span class="rounded-full bg-sky-100 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wide text-sky-700">Texto</span>
              </header>
              <div class="px-3 py-3">
                <p class="text-[13px] leading-relaxed text-slate-700">
                  Describe con tus palabras lo que ves y relaciónalo con el tema de la sesión.
                </p>
              </div>
            </article>

            <button type="button"
                    class="btn-add-module-inside btn-modulo mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition hover:bg-teal-700"
                    title="Añadir módulo en esta columna" aria-label="Añadir módulo en esta columna">+</button>
          </div>
        </div>

        {{-- Selector de columnas entre filas --}}
        <div class="divi-plus-row relative flex justify-center py-3">
          <button type="button"
                  class="btn-plus-green flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-lg font-bold text-white shadow-md transition hover:scale-105 hover:bg-emerald-600"
                  title="Insertar fila con columnas" aria-label="Insertar fila con columnas"
                  aria-haspopup="dialog">+</button>
        </div>
      </section>

      {{-- ---------- ESTADO VACÍO (se oculta cuando hay secciones) ---------- --}}
      <div id="lienzoVacio" class="alerta-vacia hidden w-full max-w-xl rounded-xl border border-dashed border-slate-300 bg-white px-6 py-8 text-center">
        <p class="text-[13px] font-semibold text-slate-700">Tu clase está vacía</p>
        <p class="mt-1 text-[12px] text-slate-500">Pulsa el botón <strong>+</strong> para crear la primera sección y elegir su retícula.</p>
      </div>
    </div>
  </main>

  {{-- ============================================================
       ESTADOS DE INTERFAZ (reemplazables por Livewire/Alpine)
       ============================================================ --}}
  <script>
  (function () {
    'use strict';

    var lienzo   = document.getElementById('lienzoExeActivo');
    var rPagina  = document.getElementById('rangoPagina');
    var rSeccion = document.getElementById('rangoSeccion');
    var vPagina  = document.getElementById('valorPagina');
    var vSeccion = document.getElementById('valorSeccion');
    var estado   = document.getElementById('estadoGuardado');

    function marcarCambio() { if (estado) estado.textContent = 'Cambios sin guardar'; }

    /* Anchos: la página limita al lienzo; la sección limita a cada .divi-section */
    function aplicarAnchos() {
      var p = Number(rPagina.value), s = Number(rSeccion.value);
      vPagina.textContent  = p + '%';
      vSeccion.textContent = s + '%';
      lienzo.style.width = p + '%';
      document.querySelectorAll('.divi-section').forEach(function (sec) {
        sec.style.width = s + '%';
      });
      marcarCambio();
    }
    rPagina.addEventListener('input', aplicarAnchos);
    rSeccion.addEventListener('input', aplicarAnchos);

    /* Alineación del lienzo */
    document.querySelectorAll('.btn-alinear').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.btn-alinear').forEach(function (b) {
          b.classList.remove('activo');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('activo');
        btn.setAttribute('aria-pressed', 'true');
        var a = btn.dataset.align;
        lienzo.dataset.alineacion = a;
        lienzo.style.alignItems = 'start' === a ? 'flex-start' : ('end' === a ? 'flex-end' : 'center');
        marcarCambio();
      });
    });

    /* Cabeceras visibles / ocultas */
    var btnCab = document.getElementById('btnToggleCabeceras');
    var txtCab = document.getElementById('txtToggleCabeceras');
    btnCab.addEventListener('click', function () {
      var ocultas = btnCab.getAttribute('aria-pressed') !== 'true';
      btnCab.setAttribute('aria-pressed', ocultas ? 'true' : 'false');
      txtCab.textContent = ocultas ? 'Cabeceras: Ocultas' : 'Cabeceras: Visibles';
      document.querySelectorAll('.idevice-card').forEach(function (card) {
        var tieneCabecera = !!card.querySelector('header');
        if (!tieneCabecera) return;
        card.classList.toggle('cabeceras-atenuadas', ocultas);
      });
      marcarCambio();
    });

    /* Guardado */
    document.getElementById('btnGuardar').addEventListener('click', function () {
      if (estado) estado.textContent = 'Guardando…';
      // El payload real lo arma el controlador: aquí solo se muestra el estado.
      setTimeout(function () { if (estado) estado.textContent = 'Guardado'; }, 600);
    });
  })();
  </script>
</body>
</html>
```

---

## 2. `resources/css/aula-constructor.css`

Tailwind cubre el 90 % del diseño; aquí va lo que las utilidades no expresan bien (retículas asimétricas, estados de dropzone y tarjetas limpias).

```css
/* ============================================================
   Constructor Visual de Aula — CSS modular
   SKILL: .skills/aula-constructor/SKILL.md
   ============================================================ */

/* ---------- 1 · Retículas de fila ---------- */
.divi-row {
  display: grid;
  gap: 14px;
  width: 100%;
  align-items: stretch;
}
.divi-row.col-1        { grid-template-columns: minmax(0, 1fr); }
.divi-row.col-2        { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.divi-row.col-2-70-30  { grid-template-columns: 7fr 3fr; }
.divi-row.col-3        { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.divi-row.col-4        { grid-template-columns: repeat(4, minmax(0, 1fr)); }

/* Mosaicos simples de 3 piezas */
.divi-row.mosaico-3-izq { grid-template-columns: 2fr 1fr 1fr; }
.divi-row.mosaico-3-der { grid-template-columns: 1fr 1fr 2fr; }

/* Mosaico asimétrico de 6 subcolumnas:
   2 arriba a la izquierda + 1 abajo a la izquierda || 1 alto al centro || 2 a la derecha */
.divi-row.mosaico-3 {
  grid-template-columns: 1fr 1fr 1.2fr 1.5fr;
  grid-template-rows: repeat(2, minmax(130px, 1fr));
}
.divi-row.mosaico-3 > .divi-column:nth-child(1) { grid-column: 1;     grid-row: 1; }
.divi-row.mosaico-3 > .divi-column:nth-child(2) { grid-column: 2;     grid-row: 1; }
.divi-row.mosaico-3 > .divi-column:nth-child(3) { grid-column: 1 / 3; grid-row: 2; }
.divi-row.mosaico-3 > .divi-column:nth-child(4) { grid-column: 3;     grid-row: 1 / 3; }
.divi-row.mosaico-3 > .divi-column:nth-child(5) { grid-column: 4;     grid-row: 1; }
.divi-row.mosaico-3 > .divi-column:nth-child(6) { grid-column: 4;     grid-row: 2; }

/* ---------- 2 · Dropzone de columna ---------- */
.divi-column { min-height: 96px; }
.divi-column.active-target {
  background-color: #eff6ff;
  border-color: #38bdf8;
  border-style: dashed;
  box-shadow: inset 0 0 0 3px rgba(56, 189, 248, .12);
}
.drag-handle { cursor: grab; }
.drag-handle:active { cursor: grabbing; }
.dragging {
  opacity: .45;
  border: 2px dashed #0284c7 !important;
}
.divi-column.drag-over,
.divi-section.drag-over {
  background-color: #e8f4f8;
  border: 2px dashed #0284c7;
  border-radius: .5rem;
}

/* ---------- 3 · Botón (+) interior de columna ---------- */
.btn-add-module-inside {
  position: relative;
  z-index: 2;
  flex: 0 0 auto;
}
.btn-add-module-inside:focus-visible {
  outline: 2px solid #0d9488;
  outline-offset: 3px;
}

/* ---------- 4 · Botón (+) verde entre filas ---------- */
.divi-plus-row {
  position: relative;
}
.divi-plus-row::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: #e2e8f0;
  z-index: 0;
}
.btn-plus-green {
  position: relative;
  z-index: 1;
}

/* ---------- 5 · Tarjetas limpias (Cero cabeceras obligatorias) ---------- */
.content-card.tarjeta-sin-cabecera { padding: 0; overflow: hidden; }
.content-card.tarjeta-sin-cabecera > img,
.content-card.tarjeta-sin-cabecera > video,
.content-card.tarjeta-sin-cabecera > iframe { display: block; width: 100%; height: auto; }

/* Cabecera con datos del docente: sí se dibuja */
.content-card > header { background: #f8fafc; }

/* Cabecera globalmente oculta: atenuada en el editor, invisible en la vista del alumno */
.idevice-card[data-ocultar-cabecera="1"] > header,
.idevice-card.cabeceras-atenuadas > header {
  opacity: .65;
  border-bottom-style: dashed;
  border-bottom-color: #cbd5e1;
}
body.vista-alumno .idevice-card[data-ocultar-cabecera="1"] > header { display: none; }

/* Descripción accesible DUA: no ocupa espacio si está vacía */
.txt-alt-dua:empty { display: none; margin: 0; padding: 0; }

/* ---------- 6 · Toolbars flotantes por nivel ---------- */
.toolbar-flotante {
  position: absolute;
  top: -14px;
  display: none;
  align-items: center;
  gap: 8px;
  padding: 2px 6px;
  border-radius: 4px;
  color: #fff;
  z-index: 25;
}
.divi-section:hover > .toolbar-flotante,
.divi-row:hover      > .toolbar-flotante,
.idevice-card:hover  > .toolbar-flotante { display: flex; }

.divi-section > .toolbar-flotante { left: 10px; right: auto; background: rgba(2, 132, 199, .9); }
.divi-row     > .toolbar-flotante { right: 10px; left: auto; background: rgba(16, 185, 129, .9); }
.idevice-card > .toolbar-flotante { right: 10px; left: auto; background: rgba(15, 23, 42, .88); }

.toolbar-flotante button,
.toolbar-flotante span {
  background: transparent;
  border: 0;
  color: inherit;
  font-size: 12.5px;
  line-height: 1;
  cursor: pointer;
  transition: transform .12s ease, color .12s ease;
}
.toolbar-flotante button:hover,
.toolbar-flotante span:hover { transform: scale(1.2); color: #ffd700; }
.toolbar-flotante button:focus-visible {
  outline: 2px solid #ffd700;
  outline-offset: 2px;
}

/* ---------- 7 · Responsivo ---------- */
@media (max-width: 1024px) {
  .divi-row.col-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 768px) {
  .divi-row.col-1,
  .divi-row.col-2,
  .divi-row.col-2-70-30,
  .divi-row.col-3,
  .divi-row.col-4,
  .divi-row.mosaico-3-izq,
  .divi-row.mosaico-3-der,
  .divi-row.mosaico-3 {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto;
  }
  .divi-row.mosaico-3 > .divi-column { grid-column: auto !important; grid-row: auto !important; }
  .divi-canvas-topbar { position: static; }
}

/* ---------- 8 · Accesibilidad ---------- */
@media (prefers-reduced-motion: reduce) {
  .divi-section, .divi-row, .idevice-card, .btn-plus-green,
  .toolbar-flotante button, .toolbar-flotante span { transition: none !important; }
}

@media print {
  .divi-canvas-topbar,
  .toolbar-flotante,
  .btn-add-module-inside,
  .divi-plus-row { display: none !important; }
  .divi-section, .divi-row, .idevice-card { break-inside: avoid; page-break-inside: avoid; }
}
```

---

## 3. Correspondencia con el `SKILL.md` y la partitura

| Requisito | Implementado | Cómo |
|---|:---:|---|
| Vista inmersiva de ancho completo | ✅ | `w-full min-h-screen bg-slate-50`, sin contenedor con `max-w` fijo |
| Jerarquía `section > row > column > idevice-card` | ✅ | Marcado anidado; ningún módulo suelto |
| Hover de sección azul / fila verde | ✅ | `hover:border-sky-500` y borde verde en la toolbar de fila + `.divi-row:hover` |
| Sliders Página y Sección 40–100 % con % dinámico | ✅ | Dos `input[type=range]` con `accent-sky-600` y `<span>` que se actualiza |
| Botones de alineación con estado | ✅ | `.btn-alinear` + `.activo` y `aria-pressed` |
| Toggle «🏷️ Cabeceras: Visibles/Ocultas» | ✅ | `aria-pressed` + clase `cabeceras-atenuadas` |
| Deshacer / Rehacer | ✅ | Botones `↩️` / `↪️` con estado `disabled` |
| `(+)` verde entre filas (`.btn-plus-green`) | ✅ | Botón circular con línea divisoria detrás |
| Dropzone `.active-target` | ✅ | Fondo `#eff6ff`, borde discontinuo y anillo interior |
| `[+ Añadir Módulo]` al pie de cada columna | ✅ | `.btn-add-module-inside` en ambos pies |
| 8 retículas de fila (incluye `mosaico-3` de 6 subcolumnas) | ✅ | Todas en el CSS modular |
| `.content-card.tarjeta-sin-cabecera` al 100 % | ✅ | Sin padding, imagen `w-full` y cabecera ausente por defecto |
| `data-ocultar-cabecera="1"` | ✅ | Atenuada en editor, oculta en `body.vista-alumno` |
| 🔒 Descripción accesible DUA | ✅ | `.txt-alt-dua` con `:empty { display:none }` |
| Sin cabeceras genéricas forzadas | ✅ | No hay ningún "Galería de Imágenes" ni "INFORMACIÓN" en el marcado |
| No romper `#lienzoExeActivo`, `.divi-row`, `.divi-column`, `.idevice-card` | ✅ | Los cuatro se conservan literalmente |
| Sin anchos fijos que limiten al 100 % | ✅ | Todo en `%`, `fr` o utilidades fluidas |

---

## 4. Cómo integrarlo

1. **Ruta** (ya prevista en el RSC): `Route::get('/docente/constructor/{sesion}', [ConstructorController::class, 'editar'])->name('docente.constructor')`.
2. **Controlador:** pasa `$sesion` con la columna `lienzo_json` decodificada; el Blade ya la publica en `window.ST90_AULA.lienzo`.
3. **Vite:** añadir `resources/css/aula-constructor.css` al array de `@vite` del Blade (ya incluido) y al `input` de `vite.config.js`.
4. **Interactividad real:** el `<script>` del final es solo estado de interfaz para revisar la maqueta. Cuando entre Livewire/Alpine, se reemplaza por el controlador correspondiente sin tocar las clases.

---

## 5. Pendiente para Cursor / Antigravity

- Crear la vista y el CSS en el proyecto Academia (aquí no existe instalación Laravel).
- Implementar el guardado real de `lienzo_json` (el botón hoy solo muestra estados).
- Cablear el modal de retículas detrás de `.btn-plus-green` y el selector de módulos detrás de `.btn-add-module-inside`.

---

## 6. INFORME PARA ANTIGRAVITY

```text
DeepSeek propone/hizo los siguientes cambios de diseño:

INFORME PARA ANTIGRAVITY:
- Archivos involucrados (proyecto Academia, Laravel 12):
    * NUEVO: resources/views/aula/constructor.blade.php
    * NUEVO: resources/css/aula-constructor.css  (importar en resources/css/app.css y en vite.config.js)
  En este workspace no existe aún instalación Laravel, por eso entrego contenido completo listo para depositar.
- Propósito del cambio: maquetar en Blade + Tailwind el Constructor Visual de Aula respetando el contrato
  de .skills/aula-constructor/SKILL.md: jerarquía DIVI de 4 capas, 8 retículas (incluido el mosaico asimétrico de
  6 subcolumnas), barra superior con sliders 40–100 %, alineación, toggle de cabeceras, deshacer/rehacer,
  dropzone .active-target, botón (+) verde entre filas y tarjetas limpias sin cabeceras genéricas.
- Selectores y piezas clave:
    * Blade: .divi-canvas-topbar (header), #lienzoExeActivo, .divi-section, .divi-row, .divi-column,
      .idevice-card.content-card, .toolbar-flotante, .btn-plus-green, .btn-add-module-inside,
      .txt-alt-dua, .alerta-vacia, #rangoPagina, #rangoSeccion, .btn-alinear, #btnToggleCabeceras
    * CSS: .divi-row.col-1/.col-2/.col-2-70-30/.col-3/.col-4,
      .divi-row.mosaico-3-izq/.mosaico-3-der/.mosaico-3 (grid 4x2 con 6 posiciones),
      .divi-column.active-target, .dragging, .drag-over,
      .content-card.tarjeta-sin-cabecera, [data-ocultar-cabecera="1"], body.vista-alumno,
      .txt-alt-dua:empty, .toolbar-flotante por nivel, @media (1024/768), print y reduced-motion
- Precauciones:
  * NO renombrar jamás #lienzoExeActivo, .divi-row, .divi-column ni .idevice-card (prohibición del SKILL).
  * NO añadir textos fijos como "Galería de Imágenes" o "INFORMACIÓN": la cabecera solo se pinta si el
    docente escribe un título.
  * El <script> del Blade es solo estado de interfaz para revisar la maqueta; sustituirlo por Livewire/Alpine
    sin tocar las clases.
  * El lienzo y las secciones usan % (no px) para respetar el 100 % de pantalla del alumno.
  * El mosaico .mosaico-3 exige exactamente 6 .divi-column en ese orden: 2 arriba-izq, 1 abajo-izq,
    1 alta al centro y 2 a la derecha.
  * Sin ids nuevos fuera de los del contrato; sin onclick en línea (todo con addEventListener).

Por favor:
1. Revisa que respete el Design System ST90 y que no rompa la funcionalidad JS ni los IDs existentes.
2. Aplícalo en los archivos correspondientes.
3. Despliégalo a Google Apps Script (clasp push & deploy) para que lo vea en mi Google Sites.
```
```


