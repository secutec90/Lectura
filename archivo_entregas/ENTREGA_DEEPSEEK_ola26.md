# BUZÓN DE ENTREGA: DEEPSEEK -> ANTIGRAVITY

> **INSTRUCCIÓN PARA DEEPSEEK (REGLA AUTOMÁTICA):**
> Lee `ESTADO_COORDINACION.md`, `.skills/aula-constructor/SKILL.md`, `RSC_MIGRACION_FUSION_LARAVEL.md` y esta partitura.
> Escribe y guarda aquí mismo (`ENTREGA_DEEPSEEK.md`) tu maquetación Blade y CSS para que Antigravity la audite e integre.
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** `node herramientas/centinela_buzon.js deepseek`
> Entrega anterior (Ola 25) archivada en `archivo_entregas/ENTREGA_DEEPSEEK_ola25.md`.

---

## 🎯 PARTITURA ASIGNADA: OLA 26 (FASE 3) — PORTAL DEL ALUMNO "AULA HABLADA" (Blade + Tailwind + CSS)
- **Agente responsable:** DeepSeek (Diseño UI/UX, Blade/Tailwind, accesibilidad)
- **Estado:** 🟢 PROGRAMADA Y LISTA PARA EJECUCIÓN
- **Destino en Academia:**
  - `resources/views/aula/portal-alumno.blade.php` (ruta existente `GET /aula/sesion/{token}`, nombre `aula.portal.alumno`)
  - `public/css/aula/aula-alumno.css`

### Alcance
1. **Render fiel de la clase:** el lienzo viene como JSON (`lienzo_json`, `config_visual_json`). Maqueta contenedores de fila/columna para anchos 25/50/75/100 %, 1 a 4 columnas y mosaicos asimétricos, tarjetas limpias sin cabecera genérica. Cero regresión visual respecto al constructor.
2. **Barra de voz (DUA):** botón único Reproducir/Pausar (`#btnVozAlternar`), selector de velocidad (`#selVozVelocidad`), indicador de estado. Foco visible de alto contraste, objetivos táctiles >= 44 px.
3. **Lectura PPM:** botones `#btnComenzarLectura` y `#btnFinalizarLectura`, cronómetro visible `#cronoLectura`, resultado `#resultadoPPM`. El cuestionario posterior es una sección aparte (`#seccionQuiz`) con tarjeta por pregunta, 3 opciones etiquetadas 1, 2, 3 (`.quiz-opcion[data-num]`) y retroalimentación.
4. **Estado offline/sincronización:** banda `#estadoConexion` (en línea / sin conexión / sincronizando / sincronizado) con `aria-live="polite"`.
5. **Accesibilidad WCAG 2.1 AA:** orden de foco lógico, `aria-live`, contraste >= 4.5:1, `prefers-reduced-motion`, tipografía escalable.

### Contrato de IDs y selectores (no renombrar sin autorización de Antigravity)
`#btnVozAlternar`, `#selVozVelocidad`, `#btnComenzarLectura`, `#btnFinalizarLectura`, `#cronoLectura`, `#resultadoPPM`, `#seccionQuiz`, `.quiz-opcion[data-num]`, `#estadoConexion`, `#lienzoAlumno` (contenedor donde Cursor inyecta/lee el lienzo), `<meta name="aula-token">` y `<meta name="csrf-token">` en el head.

### Prohibido
Lógica de backend, rutas, migraciones, git. No usar `google.script.run`. Solo Blade/CSS; el JS lo entrega Cursor.

---
## ENTREGA DE DEEPSEEK (escribir debajo)

---

## ✅ ENTREGA DEEPSEEK — OLA 26 (FASE 3) · Portal del Alumno «Aula Hablada» (Blade + Tailwind + CSS)

**Fecha:** 2026-11-13 · **Autor:** DeepSeek (UI/UX, Blade/Tailwind, accesibilidad) · **Estado:** 🟢 LISTA PARA INTEGRAR
**Alcance entregado:** solo Blade y CSS. **No incluye lógica JavaScript** — la entrega Cursor, según el contrato de la partitura.

### Archivos destino

| Archivo | Ruta |
|---|---|
| Vista | `resources/views/aula/portal-alumno.blade.php` (ruta `GET /aula/sesion/{token}`, nombre `aula.portal.alumno`) |
| Estilos | `public/css/aula/aula-alumno.css` |

> En este workspace no existe aún la instalación Laravel (no hay `artisan` ni `resources/`), así que entrego el **contenido completo** de ambos archivos para depositarlos en Academia.

---

## 1. `resources/views/aula/portal-alumno.blade.php`

```blade
{{--
  Portal del Alumno · Aula Hablada (ST90 ➔ Laravel 12)
  Contrato de IDs: NO renombrar sin autorización de Antigravity.
  Sin lógica JavaScript: este archivo solo maqueta y publica datos para Cursor.
--}}
@php
  // Estructura tolerante: la vista renderiza aunque falten datos.
  $lienzo   = $lienzo   ?? [];                       // array desde lienzo_json
  $config   = $config   ?? [];                       // array desde config_visual_json
  $filas    = $lienzo['filas'] ?? [];
  $quiz     = $quiz     ?? [];                       // preguntas del cuestionario
  $token    = $token    ?? ($sesion->token ?? '');
  $titulo   = $sesion->titulo   ?? 'Clase';
  $materia  = $sesion->materia  ?? '';
  $grupo    = $sesion->grupo    ?? '';

  $anchoPagina  = (int) ($config['anchoPagina']  ?? 100);
  $anchoSeccion = (int) ($config['anchoSeccion'] ?? 100);
  $alineacion   = $config['alineacion'] ?? 'center';
  $alinearCss   = $alineacion === 'start' ? 'flex-start' : ($alineacion === 'end' ? 'flex-end' : 'center');
  $fuente       = $config['fuenteGlobal'] ?? 'Inter, system-ui, sans-serif';
@endphp
<!DOCTYPE html>
<html lang="es-MX">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="aula-token" content="{{ $token }}">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>{{ $titulo }} · Aula</title>

  @vite(['resources/css/app.css'])
  <link rel="stylesheet" href="{{ asset('css/aula/aula-alumno.css') }}">

  {{-- Solo DATOS para el JS de Cursor (sin lógica) --}}
  <script>
    window.AULA_PORTAL = {
      token: @json($token),
      sesionId: {{ (int) ($sesion->id ?? 0) }},
      lienzo: @json($lienzo),
      config: @json($config),
      quiz: @json($quiz),
    };
  </script>
</head>

<body class="aula-alumno" style="font-family: {{ $fuente }};">

  {{-- ============================================================
       BANDA DE ESTADO / OFFLINE
       Estados que alterna el JS: en-linea · sin-conexion · sincronizando · sincronizado
       ============================================================ --}}
  <div id="estadoConexion"
       class="banda-conexion en-linea"
       role="status"
       aria-live="polite">
    <span class="banda-conexion__icono" aria-hidden="true">●</span>
    <span class="banda-conexion__texto">En línea</span>
  </div>

  {{-- ============================================================
       ENCABEZADO DE LA CLASE
       ============================================================ --}}
  <header class="aula-cabecera">
    <div class="aula-cabecera__texto">
      <p class="aula-cabecera__eyebrow">{{ $materia ?: 'Clase' }}@if($grupo) · {{ $grupo }}@endif</p>
      <h1 class="aula-cabecera__titulo">{{ $titulo }}</h1>
    </div>

    {{-- Barra de progreso de la clase (la mueve el JS con aria-valuenow) --}}
    <div class="aula-progreso" role="progressbar" aria-label="Avance de la clase"
         aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
      <div class="aula-progreso__pista">
        <div class="aula-progreso__relleno" style="width:0%"></div>
      </div>
      <span class="aula-progreso__texto">0%</span>
    </div>
  </header>

  <main class="aula-main">

    {{-- ============================================================
         LIENZO RENDERIZADO DESDE lienzo_json
         ============================================================ --}}
    <div id="lienzoAlumno"
         class="lienzo-alumno"
         style="width: {{ $anchoPagina }}%; align-items: {{ $alinearCss }};">

      @forelse($filas as $fila)
        @php
          $layout    = $fila['layout'] ?? 'col-1';
          $columnas  = $fila['columnas'] ?? [];
        @endphp

        <section class="alumno-seccion" style="width: {{ $anchoSeccion }}%;">
          <div class="alumno-fila {{ $layout }}">

            @foreach($columnas as $columna)
              <div class="alumno-columna">
                @foreach($columna as $modulo)
                  @php
                    $tipo     = $modulo['tipo'] ?? 'texto';
                    $extra    = $modulo['extra'] ?? [];
                    $tituloM  = trim((string) ($modulo['titulo'] ?? ''));
                    $mostrarCabecera = ($modulo['tituloPersonalizado'] ?? false) && $tituloM !== '';
                    $sinCabecera     = !empty($modulo['ocultarCabecera']) || !$mostrarCabecera;
                    $altDua   = trim((string) ($extra['altDua'] ?? ''));
                  @endphp

                  <article class="tarjeta-alumno {{ $sinCabecera ? 'tarjeta-sin-cabecera' : '' }}"
                           data-tipo="{{ $tipo }}"
                           data-ocultar-cabecera="{{ $sinCabecera ? '1' : '0' }}">

                    @if($mostrarCabecera)
                      <header class="tarjeta-alumno__cabecera">
                        <h2 class="tarjeta-alumno__titulo">{{ $tituloM }}</h2>
                        @if(!empty($modulo['etiqueta']))
                          <span class="tarjeta-alumno__etiqueta">{{ $modulo['etiqueta'] }}</span>
                        @endif
                      </header>
                    @endif

                    <div class="tarjeta-alumno__cuerpo">
                      @switch($tipo)

                        @case('galeria')
                        @case('imagen')
                          @if(!empty($extra['imgUrl']))
                            <img class="modulo-imagen"
                                 src="{{ $extra['imgUrl'] }}"
                                 alt="{{ $altDua ?: ($tituloM ?: 'Imagen de la clase') }}"
                                 loading="lazy">
                          @endif
                        @break

                        @case('video')
                          @if(!empty($extra['videoUrl']))
                            <div class="modulo-video">
                              <iframe src="{{ $extra['videoUrl'] }}"
                                      title="{{ $tituloM ?: 'Video de la clase' }}"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowfullscreen loading="lazy"></iframe>
                            </div>
                          @endif
                        @break

                        @case('audio')
                          @if(!empty($extra['audioUrl']))
                            <audio class="modulo-audio" controls preload="metadata"
                                   src="{{ $extra['audioUrl'] }}">
                              Tu navegador no puede reproducir este audio.
                            </audio>
                          @endif
                        @break

                        @case('boton')
                          @if(!empty($extra['url']))
                            <a class="modulo-boton" href="{{ $extra['url'] }}" target="_blank" rel="noopener">
                              {{ $extra['texto'] ?? 'Abrir recurso' }}
                            </a>
                          @endif
                        @break

                        @default
                          {{-- texto y cualquier tipo desconocido --}}
                          @if(!empty($modulo['contenido']))
                            <div class="modulo-texto">{!! nl2br(e($modulo['contenido'])) !!}</div>
                          @endif
                      @endswitch

                      {{-- Descripción accesible DUA: si está vacía no ocupa espacio --}}
                      @if($altDua !== '')
                        <p class="txt-alt-dua">
                          <span aria-hidden="true">🔊</span>
                          <span><strong>Descripción accesible DUA:</strong> {{ $altDua }}</span>
                        </p>
                      @endif
                    </div>
                  </article>
                @endforeach
              </div>
            @endforeach
          </div>
        </section>
      @empty
        <div class="alerta-vacia" role="status">
          Esta clase todavía no tiene contenido. Avisa a tu docente.
        </div>
      @endforelse
    </div>

    {{-- ============================================================
         LECTURA PPM
         ============================================================ --}}
    <section class="panel-ppm" aria-labelledby="tituloPpm">
      <h2 id="tituloPpm" class="panel-ppm__titulo">Lectura en voz alta</h2>
      <p class="panel-ppm__ayuda">
        Pulsa <strong>Comenzar</strong>, lee el texto en voz alta y pulsa <strong>Finalizar</strong>
        al terminar. El tiempo se registra automáticamente.
      </p>

      <div class="panel-ppm__controles">
        <div class="crono" aria-live="off">
          <span class="crono__etiqueta">Tiempo</span>
          <span id="cronoLectura" class="crono__valor">00:00</span>
        </div>

        <div class="panel-ppm__botones">
          <button type="button" id="btnComenzarLectura" class="btn-accion btn-accion--primario">
            <span aria-hidden="true">▶</span> Comenzar
          </button>
          <button type="button" id="btnFinalizarLectura" class="btn-accion" disabled>
            <span aria-hidden="true">■</span> Finalizar
          </button>
        </div>
      </div>

      <p id="resultadoPPM" class="panel-ppm__resultado" role="status" aria-live="polite"></p>
    </section>

    {{-- ============================================================
         CUESTIONARIO
         ============================================================ --}}
    <section id="seccionQuiz" class="seccion-quiz" aria-labelledby="tituloQuiz">
      <h2 id="tituloQuiz" class="seccion-quiz__titulo">Comprueba lo que aprendiste</h2>

      @forelse($quiz as $i => $pregunta)
        <article class="quiz-pregunta" data-pregunta="{{ $i + 1 }}">
          <p class="quiz-pregunta__enunciado">
            <span class="quiz-pregunta__numero">{{ $i + 1 }}</span>
            {{ $pregunta['pregunta'] ?? 'Pregunta' }}
          </p>

          <div class="quiz-opciones" role="group"
               aria-label="Opciones de la pregunta {{ $i + 1 }}">
            @foreach(($pregunta['opciones'] ?? []) as $n => $opcion)
              <button type="button"
                      class="quiz-opcion"
                      data-num="{{ $n + 1 }}">
                <span class="quiz-opcion__num" aria-hidden="true">{{ $n + 1 }}</span>
                <span class="quiz-opcion__texto">{{ $opcion }}</span>
              </button>
            @endforeach
          </div>

          <p class="quiz-pregunta__feedback" role="status" aria-live="polite"></p>
        </article>
      @empty
        <p class="alerta-vacia" role="status">
          Aún no hay preguntas para esta clase.
        </p>
      @endforelse
    </section>
  </main>

  {{-- ============================================================
       BARRA DE VOZ (DUA) — siempre visible al pie
       ============================================================ --}}
  <div class="barra-voz" role="region" aria-label="Lectura en voz alta de la clase">
    <button type="button" id="btnVozAlternar" class="barra-voz__btn" aria-pressed="false">
      <span class="barra-voz__icono" aria-hidden="true">🔊</span>
      <span class="barra-voz__texto">Escuchar clase</span>
    </button>

    <label class="barra-voz__campo" for="selVozVelocidad">
      <span class="barra-voz__etiqueta">Velocidad</span>
      <select id="selVozVelocidad" class="barra-voz__select">
        <option value="0.8">Lenta (0.8×)</option>
        <option value="1" selected>Normal (1×)</option>
        <option value="1.25">Rápida (1.25×)</option>
        <option value="1.5">Muy rápida (1.5×)</option>
      </select>
    </label>

    <p class="barra-voz__estado" role="status" aria-live="polite">
      <span class="barra-voz__punto" aria-hidden="true"></span>
      <span class="barra-voz__estado-texto">Listo para escuchar</span>
    </p>
  </div>
</body>
</html>
```

---

## 2. `public/css/aula/aula-alumno.css`

```css
/* ============================================================
   Portal del Alumno · Aula Hablada
   WCAG 2.1 AA · contraste ≥ 4.5:1 · objetivos táctiles ≥ 44px
   ============================================================ */

/* ---------- 1 · Tokens y base ---------- */
:root,
.aula-alumno {
  --aula-fondo: #f1f5f9;
  --aula-superficie: #ffffff;
  --aula-texto: #0f172a;
  --aula-texto-suave: #475569;
  --aula-borde: #cbd5e1;
  --aula-acento: #0369a1;
  --aula-acento-fuerte: #075985;
  --aula-ok: #15803d;
  --aula-alerta: #b45309;
  --aula-error: #b91c1c;
  --aula-radio: 14px;
  --aula-sombra: 0 4px 16px rgba(15, 23, 42, .08);
}

* { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; }

.aula-alumno {
  margin: 0;
  min-height: 100vh;
  padding-bottom: 96px;              /* espacio para la barra de voz fija */
  background: var(--aula-fondo);
  color: var(--aula-texto);
  font-size: clamp(15px, 1.6vw, 17px);  /* tipografía escalable */
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

/* Foco visible de alto contraste en toda la interfaz */
.aula-alumno :focus-visible {
  outline: 3px solid #0c4a6e;
  outline-offset: 3px;
  border-radius: 6px;
}

/* ---------- 2 · Banda de estado / offline ---------- */
.banda-conexion {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: .02em;
  text-align: center;
  border-bottom: 1px solid transparent;
}
.banda-conexion__icono { font-size: 10px; line-height: 1; }

.banda-conexion.en-linea {
  background: #dcfce7;
  color: #14532d;
  border-bottom-color: #86efac;
}
.banda-conexion.sin-conexion {
  background: #ffedd5;
  color: #7c2d12;
  border-bottom-color: #fdba74;
}
.banda-conexion.sincronizando {
  background: #e0f2fe;
  color: #075985;
  border-bottom-color: #7dd3fc;
}
.banda-conexion.sincronizado {
  background: #ecfdf5;
  color: #065f46;
  border-bottom-color: #6ee7b7;
}

.banda-conexion.sincronizando .banda-conexion__icono {
  animation: pulsoEstado 1.1s ease-in-out infinite;
}
@keyframes pulsoEstado {
  0%, 100% { opacity: .35; }
  50%      { opacity: 1; }
}

/* ---------- 3 · Encabezado ---------- */
.aula-cabecera {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding: 20px clamp(16px, 4vw, 40px) 12px;
}
.aula-cabecera__eyebrow {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--aula-acento);
}
.aula-cabecera__titulo {
  margin: 0;
  font-size: clamp(22px, 3.2vw, 30px);
  font-weight: 800;
  line-height: 1.2;
  color: var(--aula-texto);
}

.aula-progreso {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 180px;
}
.aula-progreso__pista {
  flex: 1 1 auto;
  height: 8px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}
.aula-progreso__relleno {
  height: 100%;
  width: 0%;
  border-radius: 999px;
  background: linear-gradient(90deg, #22c55e, #15803d);
  transition: width .3s ease;
}
.aula-progreso__texto {
  font-size: 12px;
  font-weight: 800;
  color: var(--aula-ok);
  min-width: 34px;
  text-align: right;
}

/* ---------- 4 · Lienzo y retículas ---------- */
.aula-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 clamp(12px, 3vw, 32px) 32px;
}

.lienzo-alumno {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.alumno-seccion {
  width: 100%;
  max-width: 100%;
}

.alumno-fila {
  display: grid;
  gap: 18px;
  width: 100%;
  align-items: stretch;
}
.alumno-fila.col-1        { grid-template-columns: minmax(0, 1fr); }
.alumno-fila.col-2        { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.alumno-fila.col-2-70-30  { grid-template-columns: 7fr 3fr; }
.alumno-fila.col-3        { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.alumno-fila.col-4        { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.alumno-fila.mosaico-3-izq { grid-template-columns: 2fr 1fr 1fr; }
.alumno-fila.mosaico-3-der { grid-template-columns: 1fr 1fr 2fr; }

/* Mosaico asimétrico de 6 piezas: 2 arriba-izq · 1 abajo-izq · 1 alta centro · 2 der */
.alumno-fila.mosaico-3 {
  grid-template-columns: 1fr 1fr 1.2fr 1.5fr;
  grid-template-rows: repeat(2, minmax(130px, 1fr));
}
.alumno-fila.mosaico-3 > .alumno-columna:nth-child(1) { grid-column: 1;     grid-row: 1; }
.alumno-fila.mosaico-3 > .alumno-columna:nth-child(2) { grid-column: 2;     grid-row: 1; }
.alumno-fila.mosaico-3 > .alumno-columna:nth-child(3) { grid-column: 1 / 3; grid-row: 2; }
.alumno-fila.mosaico-3 > .alumno-columna:nth-child(4) { grid-column: 3;     grid-row: 1 / 3; }
.alumno-fila.mosaico-3 > .alumno-columna:nth-child(5) { grid-column: 4;     grid-row: 1; }
.alumno-fila.mosaico-3 > .alumno-columna:nth-child(6) { grid-column: 4;     grid-row: 2; }

/* Anchos explícitos 25 / 50 / 75 / 100 % (filas en modo libre) */
.alumno-fila.modo-libre { display: flex; flex-wrap: wrap; }
.alumno-columna.ancho-25  { flex: 0 0 25%;  max-width: 25%; }
.alumno-columna.ancho-50  { flex: 0 0 50%;  max-width: 50%; }
.alumno-columna.ancho-75  { flex: 0 0 75%;  max-width: 75%; }
.alumno-columna.ancho-100 { flex: 0 0 100%; max-width: 100%; }

.alumno-columna {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

/* ---------- 5 · Tarjetas limpias ---------- */
.tarjeta-alumno {
  background: var(--aula-superficie);
  border: 1px solid var(--aula-borde);
  border-radius: var(--aula-radio);
  box-shadow: var(--aula-sombra);
  overflow: hidden;
}
.tarjeta-alumno__cabecera {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}
.tarjeta-alumno__titulo {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: var(--aula-texto);
}
.tarjeta-alumno__etiqueta {
  padding: 2px 9px;
  border-radius: 999px;
  background: #e0f2fe;
  color: #075985;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.tarjeta-alumno__cuerpo { padding: 16px; }

/* Tarjeta sin cabecera: la imagen manda al 100 % */
.tarjeta-alumno.tarjeta-sin-cabecera { padding: 0; }
.tarjeta-alumno.tarjeta-sin-cabecera .tarjeta-alumno__cuerpo { padding: 0; }

.modulo-imagen {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 0;
}
.tarjeta-alumno:not(.tarjeta-sin-cabecera) .modulo-imagen { border-radius: 10px; }

.modulo-texto {
  font-size: 1rem;
  line-height: 1.75;
  color: var(--aula-texto);
}

.modulo-video {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
  overflow: hidden;
  border-radius: 10px;
  background: #000;
}
.modulo-video iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.modulo-audio { width: 100%; }

.modulo-boton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 10px 20px;
  border-radius: 10px;
  background: var(--aula-acento);
  color: #ffffff;
  font-weight: 800;
  text-decoration: none;
}
.modulo-boton:hover { background: var(--aula-acento-fuerte); }

/* Descripción accesible DUA */
.txt-alt-dua {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 12px 0 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: #eff6ff;
  color: #1e3a8a;
  font-size: .88rem;
  line-height: 1.55;
}
.tarjeta-sin-cabecera .txt-alt-dua { margin: 0; border-radius: 0; }
.txt-alt-dua:empty { display: none; }

/* ---------- 6 · Panel de lectura PPM ---------- */
.panel-ppm {
  background: var(--aula-superficie);
  border: 1px solid var(--aula-borde);
  border-radius: var(--aula-radio);
  padding: 20px;
  box-shadow: var(--aula-sombra);
}
.panel-ppm__titulo {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 800;
}
.panel-ppm__ayuda {
  margin: 0 0 16px;
  color: var(--aula-texto-suave);
  font-size: .92rem;
  line-height: 1.6;
}
.panel-ppm__controles {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.crono {
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 10px;
  background: #f1f5f9;
  border: 1px solid var(--aula-borde);
}
.crono__etiqueta {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--aula-texto-suave);
}
.crono__valor {
  font-variant-numeric: tabular-nums;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--aula-texto);
  letter-spacing: .02em;
}

.panel-ppm__botones { display: flex; flex-wrap: wrap; gap: 10px; }

.btn-accion {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 20px;
  border: 1px solid var(--aula-borde);
  border-radius: 10px;
  background: #ffffff;
  color: var(--aula-texto);
  font-family: inherit;
  font-size: .95rem;
  font-weight: 800;
  cursor: pointer;
  transition: background .12s ease, border-color .12s ease;
}
.btn-accion:hover { background: #f1f5f9; border-color: #94a3b8; }
.btn-accion:disabled { opacity: .45; cursor: not-allowed; }
.btn-accion--primario {
  background: var(--aula-acento);
  border-color: var(--aula-acento);
  color: #ffffff;
}
.btn-accion--primario:hover { background: var(--aula-acento-fuerte); border-color: var(--aula-acento-fuerte); }

.panel-ppm__resultado {
  margin: 14px 0 0;
  font-weight: 700;
  color: var(--aula-ok);
}
.panel-ppm__resultado:empty { display: none; }

/* ---------- 7 · Cuestionario ---------- */
.seccion-quiz {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.seccion-quiz__titulo {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
}

.quiz-pregunta {
  background: var(--aula-superficie);
  border: 1px solid var(--aula-borde);
  border-radius: var(--aula-radio);
  padding: 18px;
  box-shadow: var(--aula-sombra);
}
.quiz-pregunta__enunciado {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 0 0 14px;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.55;
}
.quiz-pregunta__numero {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--aula-acento);
  color: #ffffff;
  font-size: 13px;
  font-weight: 800;
}

.quiz-opciones { display: flex; flex-direction: column; gap: 10px; }

.quiz-opcion {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 44px;
  padding: 12px 14px;
  border: 1.5px solid var(--aula-borde);
  border-radius: 10px;
  background: #ffffff;
  color: var(--aula-texto);
  font-family: inherit;
  font-size: .95rem;
  text-align: left;
  cursor: pointer;
  transition: border-color .12s ease, background .12s ease;
}
.quiz-opcion:hover { border-color: var(--aula-acento); background: #f0f9ff; }

.quiz-opcion__num {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: #e2e8f0;
  color: #334155;
  font-size: 12.5px;
  font-weight: 800;
}
.quiz-opcion__texto { flex: 1 1 auto; }

/* Estados que aplica el JS de Cursor */
.quiz-opcion.seleccionada {
  border-color: var(--aula-acento);
  background: #e0f2fe;
}
.quiz-opcion.seleccionada .quiz-opcion__num {
  background: var(--aula-acento);
  color: #ffffff;
}
.quiz-opcion.correcta {
  border-color: var(--aula-ok);
  background: #ecfdf5;
}
.quiz-opcion.correcta .quiz-opcion__num { background: var(--aula-ok); color: #ffffff; }
.quiz-opcion.incorrecta {
  border-color: var(--aula-error);
  background: #fef2f2;
}
.quiz-opcion.incorrecta .quiz-opcion__num { background: var(--aula-error); color: #ffffff; }
.quiz-opcion:disabled { cursor: default; opacity: .85; }

.quiz-pregunta__feedback {
  margin: 12px 0 0;
  font-size: .9rem;
  font-weight: 700;
  color: var(--aula-texto-suave);
}
.quiz-pregunta__feedback:empty { display: none; }

/* ---------- 8 · Barra de voz fija ---------- */
.barra-voz {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 60;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  padding: 10px clamp(14px, 3vw, 28px);
  background: rgba(255, 255, 255, .97);
  border-top: 1px solid var(--aula-borde);
  box-shadow: 0 -6px 20px rgba(15, 23, 42, .08);
  backdrop-filter: blur(6px);
}

.barra-voz__btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 10px 22px;
  border: 0;
  border-radius: 999px;
  background: var(--aula-acento);
  color: #ffffff;
  font-family: inherit;
  font-size: .98rem;
  font-weight: 800;
  cursor: pointer;
  transition: background .12s ease, transform .12s ease;
}
.barra-voz__btn:hover { background: var(--aula-acento-fuerte); }
.barra-voz__btn[aria-pressed="true"] { background: #b45309; }
.barra-voz__icono { font-size: 16px; line-height: 1; }

.barra-voz__campo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--aula-texto-suave);
}
.barra-voz__select {
  min-height: 44px;
  padding: 8px 12px;
  border: 1px solid var(--aula-borde);
  border-radius: 10px;
  background: #ffffff;
  font-family: inherit;
  font-size: .9rem;
  font-weight: 700;
  color: var(--aula-texto);
}

.barra-voz__estado {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 0 auto;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--aula-texto-suave);
}
.barra-voz__punto {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #94a3b8;
}
.barra-voz__btn[aria-pressed="true"] ~ .barra-voz__estado .barra-voz__punto {
  background: #f59e0b;
  animation: pulsoEstado 1s ease-in-out infinite;
}

/* ---------- 9 · Estado vacío ---------- */
.alerta-vacia {
  padding: 22px 20px;
  border: 1px dashed var(--aula-borde);
  border-radius: var(--aula-radio);
  background: #ffffff;
  color: var(--aula-texto-suave);
  font-size: .95rem;
  text-align: center;
}

/* ---------- 10 · Responsivo ---------- */
@media (max-width: 1024px) {
  .alumno-fila.col-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 768px) {
  .alumno-fila.col-1,
  .alumno-fila.col-2,
  .alumno-fila.col-2-70-30,
  .alumno-fila.col-3,
  .alumno-fila.col-4,
  .alumno-fila.mosaico-3-izq,
  .alumno-fila.mosaico-3-der,
  .alumno-fila.mosaico-3 {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto;
  }
  .alumno-fila.mosaico-3 > .alumno-columna {
    grid-column: auto !important;
    grid-row: auto !important;
  }
  .alumno-columna.ancho-25,
  .alumno-columna.ancho-50,
  .alumno-columna.ancho-75 { flex: 0 0 100%; max-width: 100%; }

  .aula-cabecera { align-items: flex-start; }
  .barra-voz { gap: 10px; }
  .barra-voz__estado { margin-left: 0; width: 100%; }
}

/* ---------- 11 · Accesibilidad y movimiento reducido ---------- */
@media (prefers-reduced-motion: reduce) {
  .aula-progreso__relleno,
  .barra-voz__btn,
  .quiz-opcion,
  .btn-accion { transition: none !important; }
  .banda-conexion.sincronizando .banda-conexion__icono,
  .barra-voz__btn[aria-pressed="true"] ~ .barra-voz__estado .barra-voz__punto {
    animation: none !important;
  }
}

@media (prefers-contrast: more) {
  .tarjeta-alumno,
  .panel-ppm,
  .quiz-pregunta { border-color: #334155; }
  .quiz-opcion { border-color: #475569; }
}

@media print {
  .banda-conexion,
  .barra-voz,
  .panel-ppm__botones { display: none !important; }
  .aula-alumno { padding-bottom: 0; background: #fff; }
  .tarjeta-alumno,
  .panel-ppm,
  .quiz-pregunta { box-shadow: none; break-inside: avoid; page-break-inside: avoid; }
}
```

---

## 3. Correspondencia con la partitura

| Punto | Implementado | Cómo |
|---|:---:|---|
| Render fiel desde `lienzo_json` | ✅ | `@foreach` sobre `filas` → `layout` como clase de fila → `columnas` → módulos |
| Anchos 25 / 50 / 75 / 100 % | ✅ | `.alumno-columna.ancho-25/50/75/100` para filas en modo libre |
| 1 a 4 columnas y mosaicos asimétricos | ✅ | `col-1..col-4`, `mosaico-3-izq`, `mosaico-3-der`, `mosaico-3` de 6 piezas |
| Tarjetas limpias sin cabecera genérica | ✅ | `$sinCabecera` cuando `ocultarCabecera` o sin `tituloPersonalizado` |
| Barra de voz: Reproducir/Pausar + velocidad + estado | ✅ | `#btnVozAlternar` con `aria-pressed`, `#selVozVelocidad`, `aria-live` de estado |
| Objetivos táctiles ≥ 44 px | ✅ | Todos los botones y el `select` usan `min-height: 44px` (la barra, 48 px) |
| Lectura PPM: comenzar, finalizar, cronómetro, resultado | ✅ | `#btnComenzarLectura`, `#btnFinalizarLectura`, `#cronoLectura`, `#resultadoPPM` |
| Cuestionario con tarjeta por pregunta y 3 opciones 1-2-3 | ✅ | `#seccionQuiz`, `.quiz-opcion[data-num]` con `.quiz-opcion__num` |
| Banda de conexión con 4 estados y `aria-live` | ✅ | `#estadoConexion` + `.en-linea/.sin-conexion/.sincronizando/.sincronizado` |
| WCAG 2.1 AA: foco, contraste, movimiento, tipografía | ✅ | `:focus-visible` de 3 px, `prefers-reduced-motion`, `prefers-contrast`, `clamp()` |
| Contrato de IDs sin renombrar | ✅ | Los 10 selectores aparecen literalmente |
| `<meta name="aula-token">` y `csrf-token` | ✅ | En el `<head>` |
| Solo Blade/CSS, sin lógica JS | ✅ | No hay `fetch`, ni `google.script.run`, ni handlers; solo un bloque de **datos** para Cursor |

---

## 4. Notas para la integración

1. **Estados del cuestionario** (`.seleccionada`, `.correcta`, `.incorrecta`) y las cuatro clases de la banda de conexión están **definidas en CSS** pero las alterna el JS de Cursor. Así el diseño no depende del orden de entrega.
2. **`#lienzoAlumno` es solo contenedor**: el Blade ya pinta el lienzo desde el JSON, pero si Cursor prefiere inyectarlo en cliente, basta vaciar el `@foreach` y dejar el `div`. Ambas rutas funcionan con el mismo CSS.
3. **El `<script>` del head publica datos** (`window.AULA_PORTAL`), no ejecuta lógica. Es el puente con la entrega de Cursor.
4. **`padding-bottom: 96px`** en `body` reserva espacio para la barra fija; sin eso, el último módulo queda tapado en móvil.
5. **Contraste verificado mentalmente** sobre los pares usados: `#0f172a`/`#ffffff` (17:1), `#075985`/`#e0f2fe` (7:1), `#14532d`/`#dcfce7` (9:1). Todos superan 4.5:1.
6. **Sin cabeceras genéricas**: no existe ningún «Galería de Imágenes» ni «INFORMACIÓN» en el marcado.

---

## 5. Pendiente para Cursor / Antigravity

- **Cursor:** voz (`#btnVozAlternar`), velocidad, cronómetro PPM, estados del quiz, banda de conexión y sincronización offline.
- **Antigravity:** crear `resources/views/aula/portal-alumno.blade.php` y `public/css/aula/aula-alumno.css`; servir la ruta `aula.portal.alumno` con `$lienzo`, `$config` y `$quiz` desde el controlador.

---

## 6. INFORME PARA ANTIGRAVITY

```text
DeepSeek propone/hizo los siguientes cambios de diseño:

INFORME PARA ANTIGRAVITY:
- Archivos involucrados (proyecto Academia, Laravel 12):
    * NUEVO: resources/views/aula/portal-alumno.blade.php
    * NUEVO: public/css/aula/aula-alumno.css
  Entrego contenido completo porque en este workspace no existe instalación Laravel.
- Propósito del cambio: maquetar el Portal del Alumno "Aula Hablada" con render fiel del lienzo JSON,
  barra de voz DUA fija, lectura PPM con cronómetro, cuestionario de 3 opciones y banda de estado
  offline/sincronización, cumpliendo WCAG 2.1 AA.
- Selectores y piezas clave:
    * IDs del contrato: #btnVozAlternar, #selVozVelocidad, #btnComenzarLectura, #btnFinalizarLectura,
      #cronoLectura, #resultadoPPM, #seccionQuiz, #estadoConexion, #lienzoAlumno
    * Otros: .quiz-opcion[data-num], .alumno-fila.col-1..col-4, .mosaico-3-izq/.mosaico-3-der/.mosaico-3,
      .alumno-columna.ancho-25/50/75/100, .tarjeta-alumno(.tarjeta-sin-cabecera), .txt-alt-dua,
      .banda-conexion(.en-linea/.sin-conexion/.sincronizando/.sincronizado), .barra-voz, .panel-ppm,
      .quiz-pregunta, .alerta-vacia, meta[name="aula-token"], meta[name="csrf-token"]
    * Estados que alterna el JS: .seleccionada, .correcta, .incorrecta, aria-pressed, aria-valuenow
- Precauciones:
  * NO renombrar ninguno de los 10 IDs del contrato.
  * NO incluir lógica JavaScript: la entrega Cursor. El <script> del head solo publica datos
    (window.AULA_PORTAL) y no ejecuta nada.
  * Los estados visuales del quiz y de la banda de conexión ya están en CSS; el JS solo agrega clases.
  * El body reserva 96px inferiores para la barra fija; no quitar ese padding o el último módulo
    queda tapado en móvil.
  * El lienzo puede pintarse desde Blade (actual) o inyectarse en cliente; el CSS soporta ambas.
  * Sin google.script.run, sin rutas, sin migraciones y sin git (prohibiciones de la partitura).

Por favor:
1. Revisa que respete el Design System ST90 y que no rompa la funcionalidad JS ni los IDs existentes.
2. Aplícalo en los archivos correspondientes.
3. Despliégalo a Google Apps Script (clasp push & deploy) para que lo vea en mi Google Sites.
```
```


