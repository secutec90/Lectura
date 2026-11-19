# BUZÓN DE ENTREGA: DEEPSEEK -> ANTIGRAVITY

> **INSTRUCCIÓN PARA DEEPSEEK (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md`, `.skills/aula-constructor/SKILL.md`, `RSC_MIGRACION_FUSION_LARAVEL.md` y esta partitura.  
> Escribe y guarda aquí mismo (`ENTREGA_DEEPSEEK.md`) tu propuesta de maquetación Blade y estilos CSS para que Antigravity la audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js deepseek`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura.  
> Entregas anteriores archivadas en `archivo_entregas/` (`ENTREGA_DEEPSEEK_ola30.md`, `ENTREGA_DEEPSEEK_ola31.md`).

---

## 🎯 PARTITURA ASIGNADA: OLA 32 (FASE 9) — SÁBANA MENSUAL OFICIAL DE ASISTENCIA NL & INDICADORES DE COLA OFFLINE
- **Agente responsable:** **DeepSeek** (Diseñador UI/UX, Blade/Tailwind, Accesibilidad DUA)
- **Estado:** 🟢 **PROGRAMADA Y LISTA PARA EJECUCIÓN**
- **Destino en Academia:**
  1. `resources/views/reportes/sabana-asistencia-mensual-nl.blade.php` (Sábana mensual oficial condensada para impresión horizontal Carta/Oficio)
  2. Componentes UI de red y estado offline para `resources/views/aula/asistencia-rapida.blade.php` (Badge sticky de conexión, drawer de cola pendiente)

### Especificación Técnica de Diseño:

#### 1. Sábana Mensual Oficial de Asistencia de Nuevo León (`sabana-asistencia-mensual-nl.blade.php`):
- **Orientación:** `@page { size: landscape; margin: 8mm 6mm; }` y contenedor `.sabana-landscape`.
- **Membrete Institucional:**
  - Logotipos: Secretaría de Educación de Nuevo León + Escudo Técnico Nacional.
  - Escuela Secundaria Técnica No. 90 "José Calderón Ayala" · CCT: 19DST0090X · Turno Matutino · Región 2 · Zona Escolar 12.
  - Título: **REGISTRO Y CONTROL MENSUAL DE ASISTENCIA Y PUNTUALIDAD**.
  - Metadatos: Ciclo Escolar 2026-2027, Mes/Año (ej. Noviembre 2026), Grado y Grupo (1° A), Taller Tecnológico (Acuerdo 97: 8 hrs/sem) / Asignatura, Docente y Tutor.
- **Cuadrícula Condensada (Estilo Kárdex Oficial SENL):**
  - Encabezado con 31 días numéricos (1 al 31) y la inicial del día de la semana (L, M, M, J, V, S, D).
  - Sombrado diferenciado para fines de semana (sábado y domingo) con `bg-slate-100`.
  - Columnas fijas a la izquierda:
    - `#` (Número de lista).
    - `Matrícula` (ej. `ST90-2026-A01`).
    - `Nombre del Alumno` (formato: Apellido Paterno, Apellido Materno, Nombres).
  - Celdas diarias con código de 1 letra normativo:
    - `•` o vacía / `P` (Presente, texto verde suave).
    - `F` (Falta, rojo destacado `#dc2626`).
    - `R` (Retardo, ámbar `#d97706`).
    - `J` (Justificado, azul `#2563eb`).
  - Columnas de totales a la derecha:
    - `Asist. (P)`
    - `Faltas (F)`
    - `Ret. (R)`
    - `Just. (J)`
    - `% Asist.` (Fórmula: `(P + R) / Total Días Hábiles * 100`).
  - Fila de totales generales al pie de la tabla.
- **Pie de Firmas Oficiales:**
  - 4 casillas de firma:
    1. Profesor(a) Titular / Tallerista.
    2. Tutor(a) de Grupo.
    3. Departamento de Trabajo Social.
    4. Vo.Bo. Subdirección Técnica.

#### 2. Elementos UI de Conexión & Cola Offline para `asistencia-rapida.blade.php`:
- **Badge Sticky de Conectividad:**
  - `<div id="badgeEstadoRed">`:
    - `🟢 En línea` (verde) cuando `navigator.onLine === true` y cola vacía.
    - `🟠 Sin conexión (X pendientes)` (ámbar pulsante) cuando `navigator.onLine === false` o hay registros locales en `localStorage`.
    - `🔄 Sincronizando (X/Y)...` (azul girando) durante el despacho de la cola.
- **Botón y Drawer/Modal de Cola Local:**
  - Botón discreto `#btnVerColaOffline` junto al botón de guardar para ver registros pendientes y forzar envío manual.

---
## ENTREGA DE DEEPSEEK (ESCRIBE TU PROPUESTA BLADE/CSS A CONTINUACIÓN)

---


## ✅ ENTREGA DEEPSEEK — OLA 32 (FASE 9) · Sábana mensual oficial de asistencia NL + Indicadores de cola offline

**Fecha:** 2026-11-17 · **Autor:** DeepSeek (UI/UX, Blade/Tailwind, accesibilidad DUA) · **Estado:** 🟢 LISTA PARA INTEGRAR

> Esta vez el buzón trae un **placeholder correcto** («ESCRIBE TU PROPUESTA A CONTINUACIÓN»), no una entrega declarada sin archivos como en las olas 30 y 31. Buena señal.

### Archivos

| Archivo | Estado |
|---|---|
| `resources/views/reportes/sabana-asistencia-mensual-nl.blade.php` | 🆕 Nuevo, depositado en `entregas-laravel-fase1/` |
| `resources/views/aula/asistencia-rapida.blade.php` | 🔧 **Parcheado** en `entregas-laravel-fase1/` (15 530 → 20 530 caracteres) |

---

## 1 · `sabana-asistencia-mensual-nl.blade.php`

```blade
{{--
  Sábana Mensual Oficial de Asistencia · Nuevo León (OLA 32 / Fase 9)
  Registro y control mensual de asistencia y puntualidad.
  Estilo kárdex oficial SENL, impresión horizontal Carta/Oficio.
  Sin lógica JavaScript: la impresión la dispara el navegador.
--}}
@php
  $escuela    = $escuela    ?? [];
  $grupoInfo  = $grupoInfo  ?? [];
  $alumnos    = $alumnos    ?? [];
  $asistencia = $asistencia ?? [];   // [alumnoIdx][dia] => 'P'|'F'|'R'|'J'|''

  $ciclo     = $ciclo     ?? '2026-2027';
  $mes       = (int) ($mes ?? now()->month);
  $anio      = (int) ($anio ?? now()->year);
  $trimestre = $trimestre ?? 'Primer';

  $nombreEscuela = $escuela['nombre'] ?? 'Escuela Secundaria Técnica No. 90 "José Calderón Ayala"';
  $cct           = $escuela['cct'] ?? '19DST0090X';
  $turno         = $escuela['turno'] ?? 'Matutino';
  $region        = $escuela['region'] ?? 'Región 2';
  $zona          = $escuela['zona'] ?? 'Zona Escolar 12';

  $grado   = $grupoInfo['grado'] ?? '1°';
  $grupoTxt = $grupoInfo['grupo'] ?? 'A';
  $taller  = $grupoInfo['taller'] ?? ($grupoInfo['asignatura'] ?? 'Taller Tecnológico');
  $docente = $docente ?? ($grupoInfo['docente'] ?? '');
  $tutor   = $tutor   ?? ($grupoInfo['tutor'] ?? '');

  $meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  $nombreMes = $meses[$mes] ?? '—';

  $diasEnMes = (int) date('t', strtotime(sprintf('%04d-%02d-01', $anio, $mes)));

  // Inicial del día de la semana: 0=domingo … 6=sábado
  $inicialDia = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  // Días hábiles del mes (lunes a viernes)
  $diasHabiles = 0;
  for ($d = 1; $d <= $diasEnMes; $d++) {
      $w = (int) date('w', strtotime(sprintf('%04d-%02d-%02d', $anio, $mes, $d)));
      if ($w !== 0 && $w !== 6) { $diasHabiles++; }
  }

  $esFinDeSemana = function (int $dia) use ($anio, $mes) {
      $w = (int) date('w', strtotime(sprintf('%04d-%02d-%02d', $anio, $mes, $dia)));
      return $w === 0 || $w === 6;
  };

  $codigo = function ($valor) {
      $v = strtoupper(trim((string) $valor));
      return in_array($v, ['P', 'F', 'R', 'J'], true) ? $v : '';
  };

  // Totales por alumno
  $totalesAlumno = [];
  foreach ($alumnos as $i => $al) {
      $c = ['P' => 0, 'F' => 0, 'R' => 0, 'J' => 0];
      for ($d = 1; $d <= $diasEnMes; $d++) {
          $k = $codigo($asistencia[$i][$d] ?? '');
          if ($k !== '') { $c[$k]++; }
      }
      $base = $diasHabiles > 0 ? $diasHabiles : 1;
      $pct  = round((($c['P'] + $c['R']) / $base) * 100);
      $totalesAlumno[$i] = $c + ['pct' => min(100, $pct)];
  }

  // Totales por columna de día
  $totalesDia = [];
  for ($d = 1; $d <= $diasEnMes; $d++) {
      $c = ['P' => 0, 'F' => 0, 'R' => 0, 'J' => 0];
      foreach ($alumnos as $i => $al) {
          $k = $codigo($asistencia[$i][$d] ?? '');
          if ($k !== '') { $c[$k]++; }
      }
      $totalesDia[$d] = $c;
  }

  // Totales generales
  $granTotal = ['P' => 0, 'F' => 0, 'R' => 0, 'J' => 0];
  foreach ($totalesAlumno as $t) {
      foreach (['P', 'F', 'R', 'J'] as $k) { $granTotal[$k] += $t[$k]; }
  }
  $pctGlobal = $diasHabiles > 0 && count($alumnos) > 0
      ? round((($granTotal['P'] + $granTotal['R']) / ($diasHabiles * count($alumnos))) * 100)
      : 0;
@endphp
<!DOCTYPE html>
<html lang="es-MX">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sábana de asistencia · {{ $grado }}{{ $grupoTxt }} · {{ $nombreMes }} {{ $anio }}</title>

  <style>
    /* ---------- Página horizontal ---------- */
    @page { size: landscape; margin: 8mm 6mm; }

    :root {
      --sb-tinta: #111827;
      --sb-suave: #4b5563;
      --sb-linea: #94a3b8;
      --sb-linea-tenue: #cbd5e1;
      --sb-acento: #0f4c81;
      --sb-p: #15803d;
      --sb-f: #dc2626;
      --sb-r: #d97706;
      --sb-j: #2563eb;
      --sb-finde: #e2e8f0;
    }
    * { box-sizing: border-box; }

    .sabana-body {
      margin: 0;
      padding: 16px;
      background: #e2e8f0;
      color: var(--sb-tinta);
      font-family: Arial, Helvetica, "Segoe UI", sans-serif;
      font-size: 8pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .sabana-landscape {
      width: 27.94cm;              /* Carta horizontal */
      min-height: 21.59cm;
      margin: 0 auto 14px;
      padding: 8mm 6mm;
      background: #fff;
      box-shadow: 0 10px 30px rgba(15, 23, 42, .25);
      box-sizing: border-box;
    }

    /* Barra de acciones: solo pantalla */
    .sabana-acciones {
      position: sticky;
      top: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      max-width: 27.94cm;
      margin: 0 auto 12px;
      padding: 10px 14px;
      background: rgba(255, 255, 255, .96);
      border: 1px solid var(--sb-linea-tenue);
      border-radius: 10px;
    }
    .sabana-acciones__volver { color: var(--sb-acento); font-size: 12.5px; font-weight: 700; text-decoration: none; }
    .sabana-acciones__imprimir {
      min-height: 40px;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: var(--sb-acento);
      color: #fff;
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
    }

    /* ---------- Membrete ---------- */
    .sabana-membrete {
      display: flex;
      align-items: center;
      gap: 6mm;
      padding-bottom: 3mm;
      border-bottom: 2px solid var(--sb-acento);
    }
    .sabana-logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 22mm;
      height: 14mm;
      border: 1.2px solid var(--sb-acento);
      border-radius: 1.5mm;
      color: var(--sb-acento);
      font-size: 6.5pt;
      font-weight: 700;
      text-align: center;
      line-height: 1.15;
      letter-spacing: .02em;
    }
    .sabana-membrete__centro { flex: 1 1 auto; text-align: center; }
    .sabana-estado {
      margin: 0;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .05em;
      color: var(--sb-acento);
    }
    .sabana-escuela {
      margin: .8mm 0 0;
      font-size: 9pt;
      font-weight: 700;
    }
    .sabana-datos {
      margin: .5mm 0 0;
      font-size: 6.8pt;
      color: var(--sb-suave);
    }

    .sabana-titulo {
      margin: 3mm 0 2mm;
      text-align: center;
      font-size: 10.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .04em;
    }

    /* Metadatos en línea */
    .sabana-metadatos {
      display: flex;
      flex-wrap: wrap;
      gap: 1mm 5mm;
      margin: 0 0 2.5mm;
      padding: 1.5mm 2.5mm;
      background: #f8fafc;
      border: 1px solid var(--sb-linea-tenue);
      border-radius: 1.5mm;
      font-size: 7pt;
    }
    .sabana-metadatos span { color: var(--sb-suave); }
    .sabana-metadatos strong { color: var(--sb-tinta); }

    /* ---------- Tabla kárdex ---------- */
    .sabana-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }

    .sabana-tabla {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      font-size: 6.4pt;
    }
    .sabana-tabla th,
    .sabana-tabla td {
      border: 1px solid var(--sb-linea-tenue);
      padding: .6mm .4mm;
      text-align: center;
      line-height: 1.1;
    }

    .sabana-tabla thead th {
      background: var(--sb-acento);
      color: #fff;
      font-size: 5.8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .02em;
      padding: .8mm .3mm;
    }
    .sabana-tabla thead tr:nth-child(2) th {
      background: #e8eef6;
      color: var(--sb-acento);
      font-size: 5.4pt;
    }

    /* Columnas fijas de identificación */
    .col-num    { width: 6mm; }
    .col-mat    { width: 20mm; }
    .col-nombre { width: 52mm; text-align: left !important; padding-left: 1.2mm !important; }
    .col-dia    { width: 4.6mm; }
    .col-tot    { width: 8mm; }
    .col-pct    { width: 10mm; }

    .sabana-tabla tbody th.col-num,
    .sabana-tabla tbody th.col-mat,
    .sabana-tabla tbody td.col-nombre {
      text-align: left;
      font-weight: 600;
      font-size: 6.2pt;
      padding-left: 1mm;
    }
    .sabana-tabla tbody th.col-num { text-align: center; padding-left: .4mm; }
    .sabana-tabla tbody th.col-mat {
      text-align: center;
      font-family: "Courier New", Consolas, monospace;
      font-size: 5.8pt;
      padding-left: .4mm;
    }

    .sabana-tabla tbody tr:nth-child(even) td { background: #fcfdff; }

    /* Fin de semana sombreado */
    .sabana-tabla .finde,
    .sabana-tabla td.finde { background: var(--sb-finde) !important; }

    /* Códigos normativos */
    .cod-p { color: var(--sb-p); font-weight: 700; }
    .cod-f { color: var(--sb-f); font-weight: 700; }
    .cod-r { color: var(--sb-r); font-weight: 700; }
    .cod-j { color: var(--sb-j); font-weight: 700; }

    .tot-p, .tot-f, .tot-r, .tot-j { font-variant-numeric: tabular-nums; font-weight: 700; }
    .tot-p { color: var(--sb-p); }
    .tot-f { color: var(--sb-f); }
    .tot-r { color: var(--sb-r); }
    .tot-j { color: var(--sb-j); }

    .pct { font-variant-numeric: tabular-nums; font-weight: 700; }
    .pct--bajo { color: var(--sb-f); }
    .pct--medio { color: var(--sb-r); }
    .pct--ok { color: var(--sb-p); }

    /* Fila de totales */
    .sabana-tabla tfoot td,
    .sabana-tabla tfoot th {
      background: #e8eef6 !important;
      font-weight: 700;
      font-size: 6.2pt;
      border-top: 1.5px solid var(--sb-linea);
    }

    /* ---------- Firmas ---------- */
    .sabana-firmas {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 5mm;
      margin-top: 8mm;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .sabana-firma { text-align: center; }
    .sabana-firma__linea {
      display: block;
      height: 11mm;
      border-bottom: 1.2px solid var(--sb-tinta);
    }
    .sabana-firma__cargo {
      display: block;
      margin-top: 1.2mm;
      font-size: 6pt;
      text-transform: uppercase;
      letter-spacing: .03em;
      color: var(--sb-suave);
      line-height: 1.2;
    }
    .sabana-firma__nombre {
      display: block;
      margin-top: .8mm;
      font-size: 6.6pt;
      font-weight: 700;
      min-height: 3.5mm;
    }

    .sabana-pie {
      margin-top: 3mm;
      padding-top: 1.5mm;
      border-top: 1px solid var(--sb-linea-tenue);
      display: flex;
      justify-content: space-between;
      gap: 4mm;
      font-size: 5.8pt;
      color: var(--sb-suave);
    }

    .sabana-vacia {
      padding: 14mm 8mm;
      text-align: center;
      color: var(--sb-suave);
      font-size: 8pt;
      border: 1px dashed var(--sb-linea-tenue);
      border-radius: 2mm;
    }

    /* ---------- Responsivo en pantalla ---------- */
    @media screen and (max-width: 1100px) {
      .sabana-body { padding: 10px 6px; }
      .sabana-landscape { width: 100%; min-height: 0; padding: 12px 10px; box-shadow: none; }
    }

    /* ---------- Impresión ---------- */
    @media print {
      .sabana-body { padding: 0; background: #fff; }
      .sabana-landscape {
        width: auto;
        min-height: 0;
        margin: 0;
        padding: 0;
        box-shadow: none;
      }
      .no-imprimir { display: none !important; }

      .sabana-membrete,
      .sabana-metadatos,
      .sabana-firmas,
      .sabana-pie,
      .sabana-tabla thead { break-inside: avoid; page-break-inside: avoid; }
      .sabana-tabla tr { break-inside: avoid; page-break-inside: avoid; }

      .sabana-tabla thead th,
      .sabana-tabla tfoot td,
      .sabana-tabla .finde { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>

<body class="sabana-body">

  <div class="sabana-acciones no-imprimir">
    <a class="sabana-acciones__volver" href="{{ url()->previous() }}">← Volver</a>
    <button type="button" class="sabana-acciones__imprimir" onclick="window.print()">
      🖨️ Imprimir sábana
    </button>
  </div>

  <main class="sabana-landscape">

    {{-- ---------- Membrete institucional ---------- --}}
    <header class="sabana-membrete">
      <div class="sabana-logo" aria-hidden="true">Secretaría<br>de Educación<br>NL</div>

      <div class="sabana-membrete__centro">
        <p class="sabana-estado">Gobierno del Estado de Nuevo León · Secretaría de Educación</p>
        <p class="sabana-escuela">{{ $nombreEscuela }}</p>
        <p class="sabana-datos">
          C.C.T. {{ $cct }} · Turno {{ $turno }} · {{ $region }} · {{ $zona }}
        </p>
      </div>

      <div class="sabana-logo" aria-hidden="true">Escudo<br>Técnico<br>Nacional</div>
    </header>

    <h1 class="sabana-titulo">Registro y Control Mensual de Asistencia y Puntualidad</h1>

    {{-- ---------- Metadatos ---------- --}}
    <div class="sabana-metadatos">
      <span>Ciclo escolar: <strong>{{ $ciclo }}</strong></span>
      <span>Mes: <strong>{{ $nombreMes }} {{ $anio }}</strong></span>
      <span>Grado y grupo: <strong>{{ $grado }} {{ $grupoTxt }}</strong></span>
      <span>Taller / asignatura: <strong>{{ $taller }}</strong> <em>(Acuerdo 97: 8 hrs/sem)</em></span>
      <span>Docente: <strong>{{ $docente ?: '—' }}</strong></span>
      <span>Tutor: <strong>{{ $tutor ?: '—' }}</strong></span>
      <span>Días hábiles: <strong>{{ $diasHabiles }}</strong></span>
    </div>

    {{-- ---------- Cuadrícula kárdex ---------- --}}
    @if(count($alumnos))
      <div class="sabana-scroll">
        <table class="sabana-tabla">
          <caption class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);">
            Asistencia mensual del grupo {{ $grado }} {{ $grupoTxt }}, {{ $nombreMes }} {{ $anio }}
          </caption>

          <colgroup>
            <col class="col-num">
            <col class="col-mat">
            <col class="col-nombre">
            @for($d = 1; $d <= $diasEnMes; $d++)
              <col class="col-dia">
            @endfor
            <col class="col-tot"><col class="col-tot"><col class="col-tot"><col class="col-tot">
            <col class="col-pct">
          </colgroup>

          <thead>
            {{-- Fila 1: número de día --}}
            <tr>
              <th scope="col" rowspan="2">#</th>
              <th scope="col" rowspan="2">Matrícula</th>
              <th scope="col" rowspan="2" class="col-nombre">Nombre del alumno</th>
              @for($d = 1; $d <= $diasEnMes; $d++)
                <th scope="col" class="{{ $esFinDeSemana($d) ? 'finde' : '' }}">{{ $d }}</th>
              @endfor
              <th scope="col" rowspan="2">Asist.<br>(P)</th>
              <th scope="col" rowspan="2">Faltas<br>(F)</th>
              <th scope="col" rowspan="2">Ret.<br>(R)</th>
              <th scope="col" rowspan="2">Just.<br>(J)</th>
              <th scope="col" rowspan="2">%<br>Asist.</th>
            </tr>
            {{-- Fila 2: inicial del día de la semana --}}
            <tr>
              @for($d = 1; $d <= $diasEnMes; $d++)
                @php $w = (int) date('w', strtotime(sprintf('%04d-%02d-%02d', $anio, $mes, $d))); @endphp
                <th scope="col" class="{{ $esFinDeSemana($d) ? 'finde' : '' }}">{{ $inicialDia[$w] }}</th>
              @endfor
            </tr>
          </thead>

          <tbody>
            @foreach($alumnos as $i => $al)
              @php
                $t   = $totalesAlumno[$i] ?? ['P'=>0,'F'=>0,'R'=>0,'J'=>0,'pct'=>0];
                $pct = $t['pct'];
                $clasePct = $pct >= 90 ? 'pct--ok' : ($pct >= 75 ? 'pct--medio' : 'pct--bajo');
              @endphp
              <tr>
                <th scope="row" class="col-num">{{ $i + 1 }}</th>
                <th scope="row" class="col-mat">{{ $al['matricula'] ?? '—' }}</th>
                <td class="col-nombre">{{ $al['nombre'] ?? 'Alumno' }}</td>

                @for($d = 1; $d <= $diasEnMes; $d++)
                  @php
                    $k = $codigo($asistencia[$i][$d] ?? '');
                    $claseCod = $k !== '' ? 'cod-' . strtolower($k) : '';
                  @endphp
                  <td class="{{ $esFinDeSemana($d) ? 'finde' : '' }} {{ $claseCod }}">
                    {{ $k !== '' ? $k : '' }}
                  </td>
                @endfor

                <td class="tot-p">{{ $t['P'] }}</td>
                <td class="tot-f">{{ $t['F'] }}</td>
                <td class="tot-r">{{ $t['R'] }}</td>
                <td class="tot-j">{{ $t['J'] }}</td>
                <td class="pct {{ $clasePct }}">{{ $pct }}%</td>
              </tr>
            @endforeach
          </tbody>

          <tfoot>
            <tr>
              <th scope="row" colspan="3" style="text-align:right;">Totales del grupo</th>
              @for($d = 1; $d <= $diasEnMes; $d++)
                @php $td = $totalesDia[$d] ?? ['P'=>0,'F'=>0,'R'=>0,'J'=>0]; @endphp
                <td class="{{ $esFinDeSemana($d) ? 'finde' : '' }}">{{ $td['P'] > 0 ? $td['P'] : '' }}</td>
              @endfor
              <td class="tot-p">{{ $granTotal['P'] }}</td>
              <td class="tot-f">{{ $granTotal['F'] }}</td>
              <td class="tot-r">{{ $granTotal['R'] }}</td>
              <td class="tot-j">{{ $granTotal['J'] }}</td>
              <td class="pct {{ $pctGlobal >= 90 ? 'pct--ok' : ($pctGlobal >= 75 ? 'pct--medio' : 'pct--bajo') }}">
                {{ $pctGlobal }}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p style="margin:1.5mm 0 0;font-size:5.8pt;color:var(--sb-suave);">
        Claves: <strong>P</strong> presente · <strong>F</strong> falta · <strong>R</strong> retardo ·
        <strong>J</strong> justificado · <strong>•</strong> sin registro.
        Porcentaje de asistencia = (P + R) ÷ días hábiles × 100.
      </p>
    @else
      <p class="sabana-vacia">El grupo no tiene alumnos inscritos en este ciclo.</p>
    @endif

    {{-- ---------- Firmas oficiales ---------- --}}
    <div class="sabana-firmas">
      <div class="sabana-firma">
        <span class="sabana-firma__linea" aria-hidden="true"></span>
        <span class="sabana-firma__cargo">Profesor(a) Titular / Tallerista</span>
        <span class="sabana-firma__nombre">{{ $docente }}</span>
      </div>
      <div class="sabana-firma">
        <span class="sabana-firma__linea" aria-hidden="true"></span>
        <span class="sabana-firma__cargo">Tutor(a) de Grupo</span>
        <span class="sabana-firma__nombre">{{ $tutor }}</span>
      </div>
      <div class="sabana-firma">
        <span class="sabana-firma__linea" aria-hidden="true"></span>
        <span class="sabana-firma__cargo">Departamento de Trabajo Social</span>
        <span class="sabana-firma__nombre"></span>
      </div>
      <div class="sabana-firma">
        <span class="sabana-firma__linea" aria-hidden="true"></span>
        <span class="sabana-firma__cargo">Vo.Bo. Subdirección Técnica</span>
        <span class="sabana-firma__nombre"></span>
      </div>
    </div>

    <footer class="sabana-pie">
      <span>{{ $nombreEscuela }} · C.C.T. {{ $cct }}</span>
      <span>{{ $nombreMes }} {{ $anio }} · {{ $trimestre }} trimestre · Ciclo {{ $ciclo }}</span>
    </footer>
  </main>
</body>
</html>


```

---

## 2 · Parche a `asistencia-rapida.blade.php`

El archivo ya está parcheado en `entregas-laravel-fase1/`. Se añadieron **tres bloques**, sin tocar nada del código existente.

### 2.1 CSS (dentro del `<style>`, antes de `prefers-reduced-motion`)

```css
/* ---------- Badge sticky de conectividad ---------- */
.badge-red {
  position: fixed;
  right: 14px;
  bottom: 14px;
  z-index: 60;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 8px 14px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(15, 23, 42, .18);
}
.badge-red--online  { background: #dcfce7; border-color: #86efac; color: #14532d; }
.badge-red--offline { background: #ffedd5; border-color: #fdba74; color: #7c2d12; animation: pulsoRed 1.6s ease-in-out infinite; }
.badge-red--sync    { background: #e0f2fe; border-color: #7dd3fc; color: #075985; }
.badge-red__icono--girando { display: inline-block; animation: girarRed 1s linear infinite; }

@keyframes pulsoRed {
  0%, 100% { opacity: 1; }
  50%      { opacity: .55; }
}
@keyframes girarRed { to { transform: rotate(360deg); } }

/* ---------- Drawer de cola offline ---------- */
.drawer-cola {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  justify-content: flex-end;
  background: rgba(15, 23, 42, .45);
}
.drawer-cola[hidden] { display: none; }

.drawer-cola__panel {
  display: flex;
  flex-direction: column;
  width: min(420px, 92vw);
  height: 100%;
  background: #fff;
  box-shadow: -12px 0 32px rgba(15, 23, 42, .25);
}
.drawer-cola__cabecera {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--asi-linea);
}
.drawer-cola__titulo { margin: 0; font-size: 15px; font-weight: 800; }
.drawer-cola__cerrar {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 8px;
  background: #f1f5f9;
  font-size: 15px;
  cursor: pointer;
}

.drawer-cola__cuerpo { flex: 1 1 auto; overflow-y: auto; padding: 14px 16px; }
.drawer-cola__ayuda { margin: 0 0 12px; font-size: 12.5px; color: var(--asi-suave); line-height: 1.5; }

.drawer-cola__lista { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
.drawer-cola__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--asi-linea);
  border-radius: 10px;
  background: #f8fafc;
  font-size: 12.5px;
}
.drawer-cola__item-hora { font-variant-numeric: tabular-nums; font-weight: 700; color: var(--asi-suave); }

.drawer-cola__vacia {
  margin: 16px 0 0;
  padding: 20px 14px;
  text-align: center;
  border: 1px dashed var(--asi-linea);
  border-radius: 10px;
  color: var(--asi-suave);
  font-size: 12.5px;
}

.drawer-cola__pie { padding: 12px 16px 16px; border-top: 1px solid var(--asi-linea); }

@media (prefers-reduced-motion: reduce) {
  .badge-red--offline { animation: none !important; }
  .badge-red__icono--girando { animation: none !important; }
}
```

### 2.2 Botón de cola (dentro de `.asi-acciones`, justo después del botón de guardar)

```blade
<button type="button" id="btnVerColaOffline" class="btn-asi" aria-haspopup="dialog">
  🗂️ Cola <span class="asi-cola-contador" id="contadorColaOffline">0</span>
</button>
```

### 2.3 Badge y drawer (antes de `</body>`)

```blade
{{-- Badge sticky de conectividad: lo actualiza Cursor --}}
<button type="button" id="badgeEstadoRed"
        class="badge-red badge-red--online"
        role="status" aria-live="polite"
        aria-label="Estado de la conexión: en línea">
  <span class="badge-red__icono" id="iconoEstadoRed" aria-hidden="true">🟢</span>
  <span class="badge-red__texto" id="textoEstadoRed">En línea</span>
</button>

{{-- Drawer de registros pendientes en localStorage --}}
<div id="drawerColaOffline" class="drawer-cola" role="dialog" aria-modal="true"
     aria-labelledby="tituloColaOffline" hidden>
  <div class="drawer-cola__panel">
    <header class="drawer-cola__cabecera">
      <h2 id="tituloColaOffline" class="drawer-cola__titulo">Registros pendientes</h2>
      <button type="button" class="drawer-cola__cerrar" data-cerrar-cola aria-label="Cerrar cola">✕</button>
    </header>

    <div class="drawer-cola__cuerpo">
      <p class="drawer-cola__ayuda">
        Estos registros están guardados en este dispositivo y todavía no se enviaron al servidor.
        No cierres sesión hasta sincronizarlos.
      </p>
      <ul id="listaColaOffline" class="drawer-cola__lista"></ul>
      <p id="colaVacia" class="drawer-cola__vacia">No hay registros pendientes.</p>
    </div>

    <footer class="drawer-cola__pie">
      <button type="button" id="btnForzarSincronizacion" class="btn-asi btn-asi--primario" style="width:100%;">
        🔄 Sincronizar ahora
      </button>
    </footer>
  </div>
</div>
```

---

## 3 · Correspondencia con la partitura

### Sábana mensual

| Requisito | Implementado | Cómo |
|---|:---:|---|
| Horizontal Carta/Oficio | ✅ | `@page { size: landscape; margin: 8mm 6mm; }` y `.sabana-landscape` de 27.94 × 21.59 cm |
| Logos SENL + Escudo Técnico Nacional | ✅ | Dos placas `.sabana-logo` a los extremos del membrete |
| Escuela, CCT, turno, región y zona | ✅ | `19DST0090X` · Matutino · Región 2 · Zona Escolar 12 por defecto |
| Título oficial | ✅ | «Registro y Control Mensual de Asistencia y Puntualidad» |
| Metadatos (ciclo, mes, grado, taller, docente, tutor) | ✅ | Banda `.sabana-metadatos` en una línea |
| 31 días con inicial del día | ✅ | Dos filas de encabezado: número y letra (L, M, M, J, V, S, D) |
| Fin de semana sombreado | ✅ | Clase `.finde` calculada con `date('w')` |
| Columnas fijas # / Matrícula / Nombre | ✅ | Anchos fijos de 6, 20 y 52 mm |
| Códigos P/F/R/J con color normativo | ✅ | Verde `#15803d`, rojo `#dc2626`, ámbar `#d97706`, azul `#2563eb` |
| Totales P, F, R, J y % por alumno | ✅ | Columnas a la derecha; % = (P+R) ÷ días hábiles × 100 |
| Fila de totales generales | ✅ | `<tfoot>` con suma por día y gran total |
| 4 firmas oficiales | ✅ | Titular, tutor, Trabajo Social y Vo.Bo. Subdirección Técnica |

### Componentes offline

| Requisito | Implementado | Cómo |
|---|:---:|---|
| `#badgeEstadoRed` sticky | ✅ | Fijo abajo a la derecha, visible mientras se recorre la lista |
| 🟢 En línea | ✅ | `.badge-red--online` |
| 🟠 Sin conexión con pendientes, pulsante | ✅ | `.badge-red--offline` con `@keyframes pulsoRed` |
| 🔄 Sincronizando (X/Y) girando | ✅ | `.badge-red--sync` + `.badge-red__icono--girando` |
| `#btnVerColaOffline` junto a guardar | ✅ | Con contador `#contadorColaOffline` |
| Drawer de pendientes y envío manual | ✅ | `#drawerColaOffline`, `#listaColaOffline`, `#btnForzarSincronizacion` |

---

## 4 · Decisiones de diseño

1. **El % de asistencia usa la fórmula de la partitura, no la mía.** `(P + R) ÷ días hábiles × 100`: el retardo cuenta como asistencia, la falta y el justificado no. Está escrito en la leyenda de la sábana para que no haya dudas al firmarla.
2. **Días hábiles calculados, no supuestos.** Recorro el mes y cuento solo lunes a viernes; un mes con tres puentes no altera el denominador.
3. **Columnas de 4.6 mm.** Con 31 días más las columnas fijas y los totales, cada día dispone de poco más de 4 mm en Carta horizontal. Es el ancho de un kárdex real: cabe y sigue siendo legible a 6.4 pt.
4. **El badge va flotante, no dentro de la barra.** La barra ya lleva conteos y tres acciones; meter un cuarto indicador la desborda en tableta. Flotante abajo a la derecha siempre está visible sin competir.
5. **El drawer es un panel lateral, no un modal centrado.** Se abre desde el borde derecho sin tapar la lista de alumnos, así el docente puede seguir viendo a quién le falta marcar.
6. **`hidden` como estado cerrado.** El drawer se abre quitando el atributo, sin `display` en línea: Cursor no necesita manipular estilos.

---

## 5 · Pendiente para Cursor / Antigravity

- **Cursor:** alternar las tres clases del badge según `navigator.onLine` y el tamaño de la cola; abrir/cerrar el drawer; poblar `#listaColaOffline`; disparar `#btnForzarSincronizacion`.
- **Antigravity:** integrar **OLA 30, 31 y 32**; la 32 parchea un archivo que la 31 introdujo y la 31 depende del CSS de la 30.

---

## 6 · INFORME PARA ANTIGRAVITY

```text
DeepSeek propone/hizo los siguientes cambios de diseño:

INFORME PARA ANTIGRAVITY:
- Archivos involucrados:
    * NUEVO:  resources/views/reportes/sabana-asistencia-mensual-nl.blade.php
    * PARCHE: resources/views/aula/asistencia-rapida.blade.php (15,530 -> 20,530 caracteres)
  Ambos ya depositados en entregas-laravel-fase1/.
- Propósito del cambio:
    1. Sábana mensual oficial de asistencia en hoja horizontal: membrete SENL, metadatos, kárdex de 31
       días con iniciales, fines de semana sombreados, claves P/F/R/J, totales por alumno y por día,
       porcentaje de asistencia y cuatro firmas oficiales.
    2. Indicadores de red y cola offline en el pase de lista: badge sticky de tres estados y drawer de
       registros pendientes con envío manual.
- Selectores del contrato (no renombrar): #badgeEstadoRed, #btnVerColaOffline.
- Selectores propios añadidos: .badge-red (--online/--offline/--sync), #iconoEstadoRed, #textoEstadoRed,
  #contadorColaOffline, #drawerColaOffline, #listaColaOffline, #colaVacia, #btnForzarSincronizacion,
  .drawer-cola (+ __panel/__cabecera/__cerrar/__cuerpo/__ayuda/__lista/__item/__vacia/__pie).
- Sábana: .sabana-body, .sabana-landscape, .sabana-membrete, .sabana-logo, .sabana-metadatos,
  .sabana-tabla (.col-num/.col-mat/.col-nombre/.col-dia/.col-tot/.col-pct), .finde, .cod-p|f|r|j,
  .tot-p|f|r|j, .pct(--ok/--medio/--bajo), .sabana-firmas, .sabana-pie, @page landscape, @media print.
- Precauciones:
  * El porcentaje de asistencia es (P + R) / dias habiles * 100: el retardo suma, justificado y falta no.
  * Los dias habiles se calculan recorriendo el mes (lunes a viernes); no usar 30 fijo.
  * El drawer se abre quitando el atributo hidden; no manipular display en linea.
  * El badge y el drawer van fuera de .barra-asistencia-fija para no desbordar la barra en tableta.
  * Dependencia en cadena: OLA 30 (reporte-oficial-nl.css) -> OLA 31 (asistencia-rapida) -> OLA 32
    (parche de asistencia-rapida). Integrar en ese orden.
  * Sin logica JavaScript propia: la impresion usa window.print().

Por favor:
1. Revisa que respete el Design System ST90 y que no rompa la funcionalidad JS ni los IDs existentes.
2. Aplícalo en los archivos correspondientes.
3. Despliégalo a Google Apps Script (clasp push & deploy) para que lo vea en mi Google Sites.
```

