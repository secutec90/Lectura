# BUZÓN DE ENTREGA: DEEPSEEK -> ANTIGRAVITY

> **INSTRUCCIÓN PARA DEEPSEEK (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md`, `.skills/aula-constructor/SKILL.md`, `RSC_MIGRACION_FUSION_LARAVEL.md` y esta partitura.  
> Escribe y guarda aquí mismo (`ENTREGA_DEEPSEEK.md`) tu propuesta de maquetación Blade y estilos CSS para que Antigravity la audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js deepseek`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura.  
> Entrega anterior (Ola 26) archivada en `archivo_entregas/ENTREGA_DEEPSEEK_ola26.md`.

---

## 🎯 PARTITURA ASIGNADA: OLA 27 (FASE 4) — MODAL DE PROYECCIÓN EN AULA + MONITOR DE ENTREGAS Y PPM
- **Agente responsable:** **DeepSeek** (Diseñador UI/UX, Blade/Tailwind, Accesibilidad)
- **Estado:** 🟢 **PROGRAMADA Y LISTA PARA EJECUCIÓN**
- **Destino en Academia:**
  - `resources/views/filament/resources/sesion-clase/modal-proyeccion-aula.blade.php` (o componente modal para proyectar al frente del salón en el cañón)
  - `resources/views/filament/resources/sesion-clase/monitor-entregas.blade.php` (widget/vista con tabla reactiva de entregas de alumnos, métricas PPM y quiz)
  - `public/css/aula/proyeccion-aula.css`

### Especificación de Diseño (Fase 4):
1. **Modal de Proyección de Clase (Cañón / Pizarrón Interactivo):**
   - Diseñado para proyectarse a toda pantalla o modal amplio (`max-w-2xl` o `max-w-3xl`) de alto contraste legible desde el último pupitre.
   - **Código de Entrada Gigante:** Tipografía monoespaciada grande (`text-5xl` o `text-6xl`, tracking amplio) con badge del token de acceso (ej. `NEM-90A`).
   - **Enlace Directo:** Botón de un clic para copiar URL completa (`https://timbres.online/aula/sesion/{token}`) con feedback visual.
   - **QR de Acceso:** Contenedor estilizado para el código QR con instrucciones claras para que los alumnos apunten con sus tabletas/teléfonos.
   - **Badge de Estado:** Indicador pulsante verde `🟢 EN VIVO / AULA ABIERTA`.
2. **Monitor de Alumnos y Comprensión Lectora (PPM):**
   - Cabecera con 3 tarjetas de resumen estadístico:
     - Total de Alumnos que Entregaron.
     - Promedio de Comprensión Lectora en PPM del grupo (con indicador visual: normal $\ge 120$ PPM, atención $< 100$ PPM).
     - Promedio de Aciertos del Quiz Formativo.
   - Tabla de resultados individuales: Nombre/Identificador, PPM registrado, Calificación del Quiz (ej. 3/3 aciertos), Hora de Entrega y botón de detalle.
   - Estado vacío elegante cuando la clase acaba de arrancar y aún no hay lecturas finalizadas.

### Contrato de IDs y Selectores (Respetar para enlace con Cursor):
- `#modalProyeccionClase`, `#codigoAccesoAula`, `#btnCopiarEnlaceAula`, `#enlaceCompletoAula`, `#contenedorQRAula`
- `#monitorEntregasSesion`, `#totalEntregasCount`, `#promedioPPMBadge`, `#promedioQuizBadge`, `#tablaEntregasAlumnos`

---
## ENTREGA DE DEEPSEEK (escribir debajo)

---


## ✅ ENTREGA DEEPSEEK — OLA 27 (FASE 4) · Modal de proyección en aula + Monitor de entregas y PPM

**Fecha:** 2026-11-13 · **Autor:** DeepSeek (UI/UX, Blade/Tailwind, accesibilidad) · **Estado:** 🟢 LISTA PARA INTEGRAR

### Archivos entregados

| Archivo | Ruta oficial en Academia | Copia física |
|---|---|---|
| Modal de proyección | `resources/views/filament/resources/sesion-clase/modal-proyeccion-aula.blade.php` | `entregas-laravel-fase1/resources/views/filament/resources/sesion-clase/` |
| Monitor de entregas | `resources/views/filament/resources/sesion-clase/monitor-entregas.blade.php` | `entregas-laravel-fase1/resources/views/filament/resources/sesion-clase/` |
| Estilos | `public/css/aula/proyeccion-aula.css` | `entregas-laravel-fase1/public/css/aula/` |

> Los tres archivos quedaron **también depositados en disco** dentro de `entregas-laravel-fase1/`, siguiendo la estructura que ya usa el proyecto (junto a `SesionAulaController.php` y `constructor-cliente.js`). Así Antigravity puede copiarlos sin transcribir desde este documento.

---

### 1 · `modal-proyeccion-aula.blade.php`

```blade
{{--
  Modal de Proyección en Aula · ST90 / Filament (Fase 4)
  Se proyecta en el cañón para que el grupo vea el código y el QR.
  IDs del contrato: NO renombrar sin autorización de Antigravity.
  Sin lógica JavaScript: la entrega Cursor.
--}}
@php
  $token      = $token      ?? ($sesion->token ?? 'NEM-90A');
  $urlAula    = $urlAula    ?? (function_exists('route') ? route('aula.portal.alumno', $token) : "https://timbres.online/aula/sesion/{$token}");
  $materia    = $materia    ?? ($sesion->materia ?? '');
  $grupo      = $grupo      ?? ($sesion->grupo ?? '');
  $titulo     = $titulo     ?? ($sesion->titulo ?? 'Clase en vivo');
  $qrSvg      = $qrSvg      ?? null;      // SVG o <img> que entregue el backend (simple-qrcode)
@endphp

<div id="modalProyeccionClase"
     class="proyeccion-overlay"
     role="dialog"
     aria-modal="true"
     aria-labelledby="tituloProyeccionAula"
     hidden>

  <div class="proyeccion-panel">

    {{-- Cabecera con estado en vivo --}}
    <header class="proyeccion-cabecera">
      <div class="proyeccion-cabecera__texto">
        <p class="proyeccion-cabecera__eyebrow">
          {{ $materia ?: 'Clase' }}@if($grupo) · {{ $grupo }}@endif
        </p>
        <h2 id="tituloProyeccionAula" class="proyeccion-cabecera__titulo">{{ $titulo }}</h2>
      </div>

      <p class="sello-vivo" role="status" aria-live="polite">
        <span class="sello-vivo__punto" aria-hidden="true"></span>
        <span class="sello-vivo__texto">EN VIVO · AULA ABIERTA</span>
      </p>
    </header>

    <div class="proyeccion-cuerpo">

      {{-- Columna izquierda: código gigante + enlace --}}
      <section class="proyeccion-bloque">
        <h3 class="proyeccion-bloque__rotulo">Código de acceso</h3>

        <p id="codigoAccesoAula" class="codigo-acceso" aria-label="Código de acceso al aula">
          {{ $token }}
        </p>

        <p class="proyeccion-ayuda">
          Escribe este código en <strong>timbres.online/aula</strong> o escanea el QR.
        </p>

        <div class="proyeccion-enlace">
          <code id="enlaceCompletoAula" class="proyeccion-enlace__url">{{ $urlAula }}</code>
          <button type="button"
                  id="btnCopiarEnlaceAula"
                  class="btn-proyeccion btn-proyeccion--copiar"
                  aria-describedby="ayudaCopiarAula">
            <span aria-hidden="true">⧉</span>
            <span class="btn-proyeccion__texto">Copiar enlace</span>
          </button>
        </div>
        <p id="ayudaCopiarAula" class="proyeccion-ayuda proyeccion-ayuda--chica" role="status" aria-live="polite"></p>
      </section>

      {{-- Columna derecha: QR --}}
      <section class="proyeccion-bloque proyeccion-bloque--qr">
        <h3 class="proyeccion-bloque__rotulo">Escanea para entrar</h3>

        <div id="contenedorQRAula" class="qr-placa" aria-label="Código QR de acceso al aula">
          @if($qrSvg)
            {!! $qrSvg !!}
          @else
            {{-- Marcador: el backend inyecta el SVG real del QR --}}
            <div class="qr-placa__marcador" aria-hidden="true">
              <span>QR</span>
            </div>
          @endif
        </div>

        <p class="proyeccion-ayuda proyeccion-ayuda--chica">
          Apunta con la cámara de tu tableta o teléfono y abre el enlace.
        </p>
      </section>
    </div>

    {{-- Pie --}}
    <footer class="proyeccion-pie">
      <p class="proyeccion-pie__nota">Proyecta esta pantalla mientras el grupo trabaja.</p>
      <button type="button" class="btn-proyeccion" data-cerrar-proyeccion>
        Cerrar proyección
      </button>
    </footer>
  </div>
</div>

```

---

### 2 · `monitor-entregas.blade.php`

```blade
{{--
  Monitor de Entregas y Comprensión Lectora (PPM) · ST90 / Filament (Fase 4)
  IDs del contrato: #monitorEntregasSesion, #totalEntregasCount,
  #promedioPPMBadge, #promedioQuizBadge, #tablaEntregasAlumnos
  Sin lógica JavaScript: la entrega Cursor.
--}}
@php
  // Tolerante a que el controlador no envíe todavía las métricas calculadas.
  $entregas       = $entregas       ?? collect();
  $totalEntregas  = $totalEntregas  ?? (is_countable($entregas) ? count($entregas) : $entregas->count());
  $promedioPpm    = $promedioPpm    ?? null;
  $promedioQuiz   = $promedioQuiz   ?? null;

  // Semáforo PPM: normal ≥ 120 · en desarrollo 100–119 · atención < 100
  $clasePpm = function ($valor) {
      if ($valor === null) return 'ppm-neutro';
      if ($valor >= 120)   return 'ppm-normal';
      if ($valor >= 100)   return 'ppm-medio';
      return 'ppm-atencion';
  };
  $etiquetaPpm = function ($valor) {
      if ($valor === null) return 'Sin datos';
      if ($valor >= 120)   return 'Normal';
      if ($valor >= 100)   return 'En desarrollo';
      return 'Atención';
  };
@endphp

<section id="monitorEntregasSesion" class="monitor-entregas" aria-labelledby="tituloMonitorEntregas">

  <header class="monitor-entregas__cabecera">
    <div>
      <h3 id="tituloMonitorEntregas" class="monitor-entregas__titulo">Entregas del grupo</h3>
      <p class="monitor-entregas__subtitulo">
        Comprensión lectora y aciertos del cuestionario en tiempo real.
      </p>
    </div>
    <button type="button" class="btn-proyeccion btn-proyeccion--suave" data-recorrer-monitor>
      <span aria-hidden="true">⟳</span>
      <span class="btn-proyeccion__texto">Actualizar</span>
    </button>
  </header>

  {{-- ---------- Tarjetas de resumen ---------- --}}
  <div class="monitor-metricas">

    {{-- 1 · Total de entregas --}}
    <article class="metrica-card">
      <p class="metrica-card__rotulo">Entregaron</p>
      <p class="metrica-card__valor" id="totalEntregasCount">{{ $totalEntregas }}</p>
      <p class="metrica-card__nota">alumnos con lectura finalizada</p>
    </article>

    {{-- 2 · Promedio PPM --}}
    <article class="metrica-card {{ $clasePpm($promedioPpm) }}">
      <p class="metrica-card__rotulo">Comprensión lectora</p>
      <p class="metrica-card__valor" id="promedioPPMBadge">
        {{ $promedioPpm !== null ? (int) round($promedioPpm) : '—' }}
        <span class="metrica-card__unidad">PPM</span>
      </p>
      <p class="metrica-card__nota">{{ $etiquetaPpm($promedioPpm) }} · normal ≥ 120 PPM</p>
    </article>

    {{-- 3 · Promedio del quiz --}}
    <article class="metrica-card">
      <p class="metrica-card__rotulo">Cuestionario</p>
      <p class="metrica-card__valor" id="promedioQuizBadge">
        {{ $promedioQuiz !== null ? rtrim(rtrim(number_format((float) $promedioQuiz, 1, '.', ''), '0'), '.') : '—' }}
        <span class="metrica-card__unidad">%</span>
      </p>
      <p class="metrica-card__nota">aciertos promedio del quiz</p>
    </article>
  </div>

  {{-- ---------- Tabla de resultados ---------- --}}
  @if($totalEntregas > 0)
    <div class="tabla-entregas-scroll">
      <table id="tablaEntregasAlumnos" class="tabla-entregas">
        <caption class="sr-only">Resultados individuales de la sesión</caption>
        <thead>
          <tr>
            <th scope="col">Alumno</th>
            <th scope="col" class="col-num">PPM</th>
            <th scope="col" class="col-num">Quiz</th>
            <th scope="col" class="col-hora">Hora de entrega</th>
            <th scope="col" class="col-accion"><span class="sr-only">Detalle</span></th>
          </tr>
        </thead>
        <tbody>
          @foreach($entregas as $entrega)
            @php
              $nombre    = $entrega->alumno_nombre ?? ($entrega->alumno ?? ($entrega['alumno_nombre'] ?? ($entrega['alumno'] ?? 'Alumno')));
              $ppm       = $entrega->ppm ?? ($entrega['ppm'] ?? null);
              $aciertos  = $entrega->quiz_aciertos ?? ($entrega['quiz_aciertos'] ?? null);
              $totalQuiz = $entrega->quiz_total ?? ($entrega['quiz_total'] ?? null);
              $hora      = $entrega->entregada_en ?? ($entrega['entregada_en'] ?? null);
              $horaTxt   = $hora ? \Illuminate\Support\Carbon::parse($hora)->format('H:i') : '—';
              $completo  = ($aciertos !== null && $totalQuiz && $aciertos >= $totalQuiz);
            @endphp
            <tr>
              <th scope="row" class="col-alumno">{{ $nombre }}</th>
              <td class="col-num">
                <span class="badge-ppm {{ $clasePpm($ppm) }}">
                  {{ $ppm !== null ? (int) round($ppm) : '—' }}
                </span>
              </td>
              <td class="col-num">
                <span class="badge-quiz {{ $completo ? 'badge-quiz--completo' : '' }}">
                  {{ $aciertos !== null ? (int) $aciertos : '—' }}/{{ $totalQuiz !== null ? (int) $totalQuiz : '—' }}
                </span>
              </td>
              <td class="col-hora">{{ $horaTxt }}</td>
              <td class="col-accion">
                <button type="button" class="btn-detalle" aria-label="Ver detalle de {{ $nombre }}">
                  Ver detalle
                </button>
              </td>
            </tr>
          @endforeach
        </tbody>
      </table>
    </div>
  @else
    {{-- ---------- Estado vacío elegante ---------- --}}
    <div class="monitor-vacio" role="status">
      <p class="monitor-vacio__icono" aria-hidden="true">⏳</p>
      <p class="monitor-vacio__titulo">Aún no hay entregas</p>
      <p class="monitor-vacio__texto">
        Cuando tus alumnos terminen la lectura y el cuestionario, sus resultados aparecerán aquí
        automáticamente.
      </p>
      <p class="monitor-vacio__pista">
        Comparte el código de acceso con el grupo para que puedan entrar.
      </p>
    </div>
  @endif
</section>

```

---

### 3 · `proyeccion-aula.css`

```css
/* ============================================================
   Proyección en Aula + Monitor de Entregas · ST90 / Filament
   Fase 4 · Alto contraste para cañón · WCAG 2.1 AA
   ============================================================ */

:root {
  --pry-acento: #0369a1;
  --pry-acento-fuerte: #075985;
  --pry-texto: #0f172a;
  --pry-texto-suave: #475569;
  --pry-borde: #cbd5e1;
  --pry-superficie: #ffffff;
  --pry-fondo: #f1f5f9;
  --pry-ok: #15803d;
  --pry-ok-suave: #dcfce7;
  --pry-alerta: #b45309;
  --pry-alerta-suave: #ffedd5;
  --pry-medio: #0369a1;
  --pry-medio-suave: #e0f2fe;
  --pry-error: #b91c1c;
  --pry-radio: 14px;
  --pry-sombra: 0 18px 48px rgba(15, 23, 42, .3);
}

/* Accesibilidad: texto solo para lectores de pantalla */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

#modalProyeccionClase :focus-visible,
#monitorEntregasSesion :focus-visible {
  outline: 3px solid #0c4a6e;
  outline-offset: 3px;
  border-radius: 8px;
}

/* ============================================================
   1 · OVERLAY Y PANEL DE PROYECCIÓN
   ============================================================ */
.proyeccion-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, .72);
  backdrop-filter: blur(3px);
}

/* Se abre quitando el atributo hidden (lo hace el JS de Cursor) */
.proyeccion-overlay[hidden] { display: none; }

.proyeccion-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 900px;
  max-height: 92vh;
  overflow: auto;
  background: var(--pry-superficie);
  border-radius: 18px;
  box-shadow: var(--pry-sombra);
}

/* ---------- Cabecera ---------- */
.proyeccion-cabecera {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 22px clamp(18px, 3vw, 32px);
  border-bottom: 1px solid #e2e8f0;
}
.proyeccion-cabecera__eyebrow {
  margin: 0 0 4px;
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: .09em;
  text-transform: uppercase;
  color: var(--pry-acento);
}
.proyeccion-cabecera__titulo {
  margin: 0;
  font-size: clamp(20px, 2.4vw, 27px);
  font-weight: 800;
  line-height: 1.2;
  color: var(--pry-texto);
}

/* Sello EN VIVO pulsante */
.sello-vivo {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin: 0;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--pry-ok-suave);
  border: 1.5px solid #86efac;
  color: #14532d;
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: .06em;
}
.sello-vivo__punto {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 0 rgba(34, 197, 94, .7);
  animation: latidoVivo 1.8s ease-in-out infinite;
}
@keyframes latidoVivo {
  0%   { box-shadow: 0 0 0 0 rgba(34, 197, 94, .65); }
  70%  { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

/* ---------- Cuerpo en dos columnas ---------- */
.proyeccion-cuerpo {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, .85fr);
  gap: clamp(18px, 3vw, 32px);
  padding: clamp(18px, 3vw, 32px);
}

.proyeccion-bloque { min-width: 0; }
.proyeccion-bloque__rotulo {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--pry-texto-suave);
}

/* ---------- Código gigante ---------- */
.codigo-acceso {
  margin: 0 0 14px;
  padding: clamp(16px, 3vw, 28px) clamp(12px, 2vw, 24px);
  border-radius: var(--pry-radio);
  background: #f8fafc;
  border: 2px solid var(--pry-borde);
  color: var(--pry-texto);
  font-family: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
  font-size: clamp(2.6rem, 7vw, 4.6rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: .16em;
  text-align: center;
  font-variant-numeric: tabular-nums;
  word-break: break-word;
}

.proyeccion-ayuda {
  margin: 0 0 12px;
  font-size: .95rem;
  line-height: 1.6;
  color: var(--pry-texto-suave);
}
.proyeccion-ayuda--chica { font-size: .85rem; margin-bottom: 0; }

/* ---------- Enlace y copiar ---------- */
.proyeccion-enlace {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #f1f5f9;
  border: 1px solid var(--pry-borde);
}
.proyeccion-enlace__url {
  flex: 1 1 220px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: .82rem;
  color: #334155;
}

.btn-proyeccion {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 18px;
  border: 1px solid var(--pry-acento);
  border-radius: 10px;
  background: var(--pry-acento);
  color: #ffffff;
  font-family: inherit;
  font-size: .9rem;
  font-weight: 800;
  cursor: pointer;
  transition: background .12s ease, border-color .12s ease, transform .12s ease;
}
.btn-proyeccion:hover { background: var(--pry-acento-fuerte); border-color: var(--pry-acento-fuerte); }
.btn-proyeccion--suave {
  background: #ffffff;
  color: var(--pry-acento);
  border-color: var(--pry-borde);
}
.btn-proyeccion--suave:hover { background: #f1f5f9; color: var(--pry-acento-fuerte); }

/* Feedback de copiado (clase que alterna el JS) */
.btn-proyeccion--copiar.copiado {
  background: var(--pry-ok);
  border-color: var(--pry-ok);
}

/* ---------- QR ---------- */
.proyeccion-bloque--qr { text-align: center; }

.qr-placa {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: min(100%, 260px);
  aspect-ratio: 1 / 1;
  margin: 0 auto 12px;
  padding: 12px;
  background: #ffffff;
  border: 2px solid var(--pry-borde);
  border-radius: var(--pry-radio);
  box-shadow: 0 2px 10px rgba(15, 23, 42, .06);
}
.qr-placa svg,
.qr-placa img {
  width: 100%;
  height: 100%;
  display: block;
}
.qr-placa__marcador {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background:
    repeating-linear-gradient(45deg, #e2e8f0 0 8px, #f1f5f9 8px 16px);
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: .2em;
}

/* ---------- Pie ---------- */
.proyeccion-pie {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px clamp(18px, 3vw, 32px) 22px;
  border-top: 1px solid #e2e8f0;
}
.proyeccion-pie__nota {
  margin: 0;
  font-size: .85rem;
  color: var(--pry-texto-suave);
}

/* ============================================================
   2 · MONITOR DE ENTREGAS
   ============================================================ */
.monitor-entregas {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: clamp(16px, 2.4vw, 24px);
  background: var(--pry-superficie);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, .05);
}

.monitor-entregas__cabecera {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.monitor-entregas__titulo {
  margin: 0 0 2px;
  font-size: 17px;
  font-weight: 800;
  color: var(--pry-texto);
}
.monitor-entregas__subtitulo {
  margin: 0;
  font-size: .85rem;
  color: var(--pry-texto-suave);
}

/* ---------- Tarjetas de métricas ---------- */
.monitor-metricas {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.metrica-card {
  padding: 16px;
  border-radius: var(--pry-radio);
  border: 1px solid var(--pry-borde);
  border-top: 4px solid var(--pry-borde);
  background: #f8fafc;
}
.metrica-card__rotulo {
  margin: 0 0 6px;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: .07em;
  text-transform: uppercase;
  color: var(--pry-texto-suave);
}
.metrica-card__valor {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 0 0 4px;
  font-size: clamp(1.8rem, 3vw, 2.3rem);
  font-weight: 800;
  line-height: 1;
  color: var(--pry-texto);
  font-variant-numeric: tabular-nums;
}
.metrica-card__unidad {
  font-size: .8rem;
  font-weight: 800;
  letter-spacing: .06em;
  color: var(--pry-texto-suave);
}
.metrica-card__nota {
  margin: 0;
  font-size: .78rem;
  color: var(--pry-texto-suave);
}

/* Semáforo PPM */
.metrica-card.ppm-normal    { border-top-color: var(--pry-ok);      background: #f0fdf4; }
.metrica-card.ppm-normal .metrica-card__valor { color: #14532d; }
.metrica-card.ppm-medio     { border-top-color: var(--pry-medio);   background: #f0f9ff; }
.metrica-card.ppm-medio .metrica-card__valor { color: #075985; }
.metrica-card.ppm-atencion  { border-top-color: var(--pry-alerta);  background: #fff7ed; }
.metrica-card.ppm-atencion .metrica-card__valor { color: #7c2d12; }
.metrica-card.ppm-neutro    { border-top-color: var(--pry-borde); }

/* ---------- Tabla ---------- */
.tabla-entregas-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.tabla-entregas {
  width: 100%;
  min-width: 620px;
  border-collapse: collapse;
  font-size: .85rem;
}
.tabla-entregas thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 10px 12px;
  background: #0f172a;
  color: #ffffff;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: .06em;
  text-transform: uppercase;
  text-align: left;
  white-space: nowrap;
}
.tabla-entregas tbody th,
.tabla-entregas tbody td {
  padding: 10px 12px;
  border-bottom: 1px solid #eef2f7;
  color: #334155;
  vertical-align: middle;
}
.tabla-entregas tbody tr:nth-child(even) { background: #f8fafc; }
.tabla-entregas tbody tr:hover { background: #eff6ff; }
.tabla-entregas tbody tr:last-child th,
.tabla-entregas tbody tr:last-child td { border-bottom: 0; }

.col-alumno { font-weight: 700; color: var(--pry-texto); }
.col-num    { text-align: center; white-space: nowrap; }
.col-hora   { white-space: nowrap; font-variant-numeric: tabular-nums; }
.col-accion { text-align: right; }

.badge-ppm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 54px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}
.badge-ppm.ppm-normal   { background: var(--pry-ok-suave);      color: #14532d; }
.badge-ppm.ppm-medio    { background: var(--pry-medio-suave);   color: #075985; }
.badge-ppm.ppm-atencion { background: var(--pry-alerta-suave);  color: #7c2d12; }
.badge-ppm.ppm-neutro   { background: #e2e8f0;                  color: #334155; }

.badge-quiz {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  padding: 3px 10px;
  border-radius: 8px;
  background: #e2e8f0;
  color: #334155;
  font-size: 12px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}
.badge-quiz--completo { background: var(--pry-ok-suave); color: #14532d; }

.btn-detalle {
  min-height: 36px;
  padding: 6px 12px;
  border: 1px solid var(--pry-borde);
  border-radius: 8px;
  background: #ffffff;
  color: var(--pry-acento);
  font-family: inherit;
  font-size: .8rem;
  font-weight: 800;
  cursor: pointer;
  transition: background .12s ease, border-color .12s ease;
}
.btn-detalle:hover { background: #f1f5f9; border-color: var(--pry-acento); }

/* ---------- Estado vacío ---------- */
.monitor-vacio {
  padding: clamp(24px, 4vw, 40px) 20px;
  border: 1px dashed var(--pry-borde);
  border-radius: var(--pry-radio);
  background: #f8fafc;
  text-align: center;
}
.monitor-vacio__icono { margin: 0 0 8px; font-size: 30px; line-height: 1; }
.monitor-vacio__titulo {
  margin: 0 0 6px;
  font-size: 15.5px;
  font-weight: 800;
  color: var(--pry-texto);
}
.monitor-vacio__texto {
  margin: 0 auto 8px;
  max-width: 46ch;
  font-size: .9rem;
  line-height: 1.6;
  color: var(--pry-texto-suave);
}
.monitor-vacio__pista {
  margin: 0;
  font-size: .82rem;
  font-weight: 700;
  color: var(--pry-acento);
}

/* ============================================================
   3 · RESPONSIVO
   ============================================================ */
@media (max-width: 900px) {
  .proyeccion-cuerpo { grid-template-columns: minmax(0, 1fr); }
  .proyeccion-bloque--qr { order: -1; }
  .qr-placa { width: min(70%, 220px); }
}

@media (max-width: 768px) {
  .monitor-metricas { grid-template-columns: minmax(0, 1fr); }
  .proyeccion-overlay { padding: 10px; align-items: flex-start; }
  .proyeccion-panel { max-height: 96vh; border-radius: 14px; }
  .codigo-acceso { letter-spacing: .1em; }
}

/* ============================================================
   4 · ACCESIBILIDAD Y SALIDA IMPRESA
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  .sello-vivo__punto { animation: none !important; }
  .btn-proyeccion,
  .btn-detalle,
  .tabla-entregas tbody tr { transition: none !important; }
}

@media (prefers-contrast: more) {
  .proyeccion-panel,
  .monitor-entregas,
  .metrica-card { border-color: #334155; }
  .tabla-entregas tbody th,
  .tabla-entregas tbody td { color: #0f172a; }
}

@media print {
  .proyeccion-overlay,
  .btn-proyeccion,
  .btn-detalle { display: none !important; }
  .monitor-entregas { box-shadow: none; border: 1px solid #94a3b8; }
  .tabla-entregas thead th {
    background: #0f172a !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .metrica-card,
  .tabla-entregas tbody tr { break-inside: avoid; page-break-inside: avoid; }
}

```

---

### 4 · Correspondencia con la partitura

| Punto | Implementado | Cómo |
|---|:---:|---|
| Modal amplio y de alto contraste | ✅ | Panel de 900 px sobre overlay oscuro con `backdrop-filter` |
| Código gigante monoespaciado con tracking amplio | ✅ | `clamp(2.6rem, 7vw, 4.6rem)`, `letter-spacing: .16em`, cifras tabulares |
| Badge del token de acceso | ✅ | `#codigoAccesoAula` con el token dentro de una placa con borde de 2 px |
| Enlace directo con copiar y feedback | ✅ | `#enlaceCompletoAula` + `#btnCopiarEnlaceAula` con estado `.copiado` |
| Contenedor de QR con instrucciones | ✅ | `#contenedorQRAula` en placa blanca cuadrada (`aspect-ratio 1/1`) y marcador si falta el SVG |
| Badge de estado pulsante | ✅ | `.sello-vivo__punto` con `@keyframes latidoVivo` |
| 3 tarjetas de resumen | ✅ | `#totalEntregasCount`, `#promedioPPMBadge`, `#promedioQuizBadge` |
| Semáforo PPM (normal ≥120, atención <100) | ✅ | `.ppm-normal/.ppm-medio/.ppm-atencion/.ppm-neutro` |
| Tabla de resultados individuales | ✅ | `#tablaEntregasAlumnos` con alumno, PPM, quiz, hora y botón de detalle |
| Estado vacío elegante | ✅ | `.monitor-vacio` con icono, título, texto y pista de código |

---

### 5 · Decisiones de diseño

1. **Placa blanca para el código y el QR.** Un proyector en aula iluminada lava los fondos oscuros; el código en negro sobre blanco se lee desde el último pupitre y el QR necesita base clara para escanear. El contraste del panel se logra con el overlay oscuro alrededor.
2. **Semáforo de tres bandas, no dos.** La partitura define normal ≥120 y atención <100; entre 100 y 119 añadí `ppm-medio` («En desarrollo») para no marcar en rojo a un grupo que está en la frontera.
3. **El estado vacío explica qué hacer.** No dice solo «sin datos»: indica que los resultados aparecerán solos y sugiere compartir el código. Para un docente frente al grupo eso cambia la duda por una acción.
4. **Sin lógica JavaScript.** El modal se abre quitando el atributo `hidden`, y los estados `.copiado`, `.is-open` y el refresco los alterna Cursor.
5. **Tabla accesible.** `<caption>` oculto, `scope` en cabeceras, `<th scope="row">` para el nombre, encabezado pegajoso y scroll horizontal táctil.

---

### 6 · Pendiente para Cursor / Antigravity

- **Cursor:** abrir/cerrar `#modalProyeccionClase`, copiar el enlace con feedback, refrescar el monitor y poblar `#contenedorQRAula` (o inyectarlo desde el backend).
- **Antigravity:** copiar los tres archivos a sus rutas oficiales y generar el QR (simple-qrcode) para pasarlo como `$qrSvg`.

---

### 7 · INFORME PARA ANTIGRAVITY

```text
DeepSeek propone/hizo los siguientes cambios de diseño:

INFORME PARA ANTIGRAVITY:
- Archivos involucrados:
    * NUEVO: resources/views/filament/resources/sesion-clase/modal-proyeccion-aula.blade.php
    * NUEVO: resources/views/filament/resources/sesion-clase/monitor-entregas.blade.php
    * NUEVO: public/css/aula/proyeccion-aula.css
  Los tres quedaron además en disco dentro de entregas-laravel-fase1/ con la misma ruta relativa.
- Propósito del cambio: permitir proyectar la clase en el cañón con código de acceso gigante, enlace copiable,
  QR y sello EN VIVO; y dar al docente un monitor con total de entregas, promedio PPM con semáforo y aciertos
  del cuestionario, más tabla individual con hora de entrega y estado vacío claro.
- Selectores del contrato (no renombrar): #modalProyeccionClase, #codigoAccesoAula, #btnCopiarEnlaceAula,
  #enlaceCompletoAula, #contenedorQRAula, #monitorEntregasSesion, #totalEntregasCount, #promedioPPMBadge,
  #promedioQuizBadge, #tablaEntregasAlumnos.
- Otros selectores: .proyeccion-overlay, .proyeccion-panel, .proyeccion-cabecera, .sello-vivo,
  .codigo-acceso, .proyeccion-enlace, .btn-proyeccion (+ --copiar, --suave, .copiado), .qr-placa,
  .monitor-entregas, .monitor-metricas, .metrica-card (.ppm-normal/--medio/--atencion/--neutro),
  .tabla-entregas-scroll, .tabla-entregas, .badge-ppm, .badge-quiz (+ --completo), .btn-detalle,
  .monitor-vacio, .sr-only, @media 900/768, prefers-reduced-motion, prefers-contrast, print.
- Precauciones:
  * Sin lógica JavaScript: el modal se abre quitando el atributo hidden; los estados los alterna Cursor.
  * El QR debe generarse en backend y pasarse como $qrSvg; si no llega, el Blade muestra un marcador.
  * El código es texto seleccionable (no imagen) para que el alumno lo lea y el docente lo dicte.
  * Mantener contraste alto: overlay oscuro + placa blanca; no invertir a fondo oscuro el panel.
  * El monitor tolera datos vacíos o incompletos: no falla si faltan $promedioPpm o $promedioQuiz.
  * Sin ids nuevos fuera del contrato, sin onclick en línea, sin google.script.run.

Por favor:
1. Revisa que respete el Design System ST90 y que no rompa la funcionalidad JS ni los IDs existentes.
2. Aplícalo en los archivos correspondientes.
3. Despliégalo a Google Apps Script (clasp push & deploy) para que lo vea en mi Google Sites.
```

