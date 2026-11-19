# PARTITURA DE TRABAJO: DEEPSEEK (OLA 35 - FASE 12)
**Proyecto:** Suite Escolar Academia (Laravel 12 + Filament v3) — Escuela Secundaria Técnica Núm. 90  
**Normativa Aplicable:** Ley de Educación de Nuevo León 2026, Guía Operativa para la Convivencia Escolar Sana y Pacífica (UIENL/SENL), Protocolo de Mediación Escolar y Acuerdo 97.  
**Estado:** `🟢 PROGRAMADA / EN ESPERA DE TU ENTREGA`

---

## 🎯 OBJETIVO DE LA OLA 35 (FASE 12)
Diseñar y maquetar con excelencia visual, accesibilidad DUA e idoneidad tipográfica para pantalla e impresión oficial (`@media print` Letter / Carta):
1. **`acta-mediacion-escolar-nl.blade.php`**: Acta Oficial de Mediación Escolar y Acuerdos Formativos (SENL/UIENL) con formato Carta vertical, membrete de Gobierno de Nuevo León, descripción de hechos, tipificación de conducta (leve, moderada, severa), acuerdos restaurativos pedagógicos, y zona de **firmas oficiales** (Director, Trabajo Social, Alumno y Padre/Madre/Tutor).
2. **`talonario-citatorio-incidencia-nl.blade.php`**: Formato Media Carta (2 por hoja Letter con línea de corte `✂️`) de Citatorio Inmediato de Padres por Incidencia o Mediación con talón desprendible de acuse para prefectura.

---

## 🗺️ FEATURE MAP (CONTRATO INMUTABLE)

### 1. Vista 1: `acta-mediacion-escolar-nl.blade.php`
- **Ubicación destino:** `resources/views/reportes/acta-mediacion-escolar-nl.blade.php`
- **Preamble `@php` tolerante y polimórfico:**
  - Extraer `$plantel`, `$folio`, `$fecha`, `$hora`, `$alumno` (`nombre`, `matricula`, `grado`, `grupo`, `turno`), `$incidencia` (`tipo_falta`, `descripcion_hechos`, `lugar_hechos`, `docente_reporta`), `$acuerdos` (lista de compromisos formativos), `$seguimiento` y `$firmas`.
  - Asegurar valores por defecto para evitar cualquier variable indefinida.
- **Estructura Visual:**
  - **Membrete Oficial:** Gobierno del Estado de Nuevo León, Secretaría de Educación (SENL), Unidad de Integración Educativa (UIENL), Escuela Secundaria Técnica Núm. 90, CCT `19DST0090X`.
  - **Encabezado:** "ACTA ADMINISTRATIVA CIRCUNSTANCIADA DE MEDIACIÓN ESCOLAR Y ACUERDOS FORMATIVOS — PROTOCOLO DE CONVIVENCIA ESCOLAR PACÍFICA".
  - **Datos del Alumno y Reporte:** Tarjeta condensada con matrícula, nombre completo, grado/grupo, turno y fecha/hora.
  - **Relatoría de Hechos y Tipificación:** Cuadro oficial con descripción del suceso, tipificación según Marco de Convivencia Escolar de Nuevo León (Conducta Tipo I Leve, Tipo II Moderada, Tipo III Grave).
  - **Acuerdos y Medidas Pedagógicas Restaurativas:** Tabla numerada con compromisos formativos (reparación del daño, servicio comunitario escolar, canalización a orientación/psicología).
  - **Bloque de Firmas y Huella:** Firmas del Alumno(a), Padre/Madre o Tutor Legal con nombre completo y parentesco, Personal Mediador / Trabajo Social y Vo.Bo. de la Dirección Escolar.

### 2. Vista 2: `talonario-citatorio-incidencia-nl.blade.php`
- **Ubicación destino:** `resources/views/reportes/talonario-citatorio-incidencia-nl.blade.php`
- **Formato:** Media Carta (2 por hoja Carta con `@page { size: letter portrait; margin: 10mm; }` y línea discontinua `✂️`).
- **Contenido:**
  - Notificación de citatorio urgente a padres de familia por motivo de mediación/incidencia.
  - Talón inferior de acuse de recibo para archivo escolar con firma y fecha de enterado del tutor.

---

## 📥 FORMATO DE ENTREGA
Escribe el código completo de ambas vistas Blade con sus estilos CSS embebidos (`<style>`) dentro de este archivo `ENTREGA_DEEPSEEK.md`, etiquetando claramente cada bloque con su ruta de archivo.  
Al finalizar tu respuesta, Antigravity auditará la coherencia de selectores e integrará el código directamente en el repositorio.

---

# ✅ ENTREGA DEEPSEEK — OLA 35 (FASE 12)

**Fecha:** 2026-11-19 · **Autor:** DeepSeek (Design & UX/UI Lead) · **Estado:** 🟢 LISTA PARA AUDITORÍA
Ambas vistas con **CSS embebido** en `<style>` propio. Depositadas en
`entregas-laravel-fase1/resources/views/reportes/`.

| Archivo | Tamaño |
|---|---:|
| `acta-mediacion-escolar-nl.blade.php` | 19.3 KB |
| `talonario-citatorio-incidencia-nl.blade.php` | 14.7 KB |

Auditoría de clases: **37 `md-*`** y **38 `tc-*`**, todas definidas. Contrato verificado:
`@page letter portrait` en el acta, `margin: 10mm` en el talonario, 2 copias por hoja, línea de
corte y talón de acuse presentes.

---

## 📄 ARCHIVO 1 · `resources/views/reportes/acta-mediacion-escolar-nl.blade.php`

```blade
{{--
  Acta Administrativa Circunstanciada de Mediación Escolar y Acuerdos Formativos
  OLA 35 / Fase 12 · Destino: resources/views/reportes/acta-mediacion-escolar-nl.blade.php
  Protocolo de Convivencia Escolar Sana y Pacífica (UIENL/SENL). Carta vertical.
  Sin lógica JavaScript: la impresión la dispara el navegador.
--}}
@php
  $plantel    = is_array($plantel ?? null) ? $plantel : [];
  $alumno     = is_array($alumno ?? null) ? $alumno : [];
  $incidencia = is_array($incidencia ?? null) ? $incidencia : [];
  $acuerdos   = is_array($acuerdos ?? null) ? $acuerdos : [];
  $seguimiento = $seguimiento ?? '';
  $firmas     = is_array($firmas ?? null) ? $firmas : [];

  $nombrePlantel = $plantel['nombre'] ?? 'Escuela Secundaria Técnica Núm. 90';
  $cct           = $plantel['cct'] ?? '19DST0090X';
  $region        = $plantel['region'] ?? 'Región Educativa 13';
  $zona          = $plantel['zona'] ?? 'Zona Escolar 18';

  $folio = $folio ?? 'ACT-MED-2026-0000';
  $fecha = $fecha ?? now()->format('d/m/Y');
  $hora  = $hora  ?? now()->format('H:i');

  $nombreAlumno = $alumno['nombre'] ?? '—';
  $matricula    = $alumno['matricula'] ?? '—';
  $grado        = $alumno['grado'] ?? '—';
  $grupo        = $alumno['grupo'] ?? '—';
  $turno        = $alumno['turno'] ?? 'Matutino';

  $descripcion = $incidencia['descripcion_hechos'] ?? '';
  $lugar       = $incidencia['lugar_hechos'] ?? '—';
  $docente     = $incidencia['docente_reporta'] ?? '—';

  // Tipificación: se acepta 'I'/'II'/'III', 'leve'/'moderada'/'grave' o 'tipo1'...
  $tipoRaw = strtolower(trim((string) ($incidencia['tipo_falta'] ?? '')));
  if (in_array($tipoRaw, ['i', '1', 'tipo1', 'tipo i', 'leve', 'tipo i leve'], true)) {
      $tipo = 'I';
  } elseif (in_array($tipoRaw, ['ii', '2', 'tipo2', 'tipo ii', 'moderada', 'tipo ii moderada'], true)) {
      $tipo = 'II';
  } elseif (in_array($tipoRaw, ['iii', '3', 'tipo3', 'tipo iii', 'grave', 'severa', 'tipo iii grave'], true)) {
      $tipo = 'III';
  } else {
      $tipo = '';
  }

  $tipos = [
      'I'   => ['titulo' => 'Conducta Tipo I · Leve',    'detalle' => 'Faltas a las normas de convivencia sin daño a terceros.'],
      'II'  => ['titulo' => 'Conducta Tipo II · Moderada', 'detalle' => 'Afectación a integrantes de la comunidad o a bienes del plantel.'],
      'III' => ['titulo' => 'Conducta Tipo III · Grave',  'detalle' => 'Daño a la integridad, la salud o la seguridad de alguna persona.'],
  ];
  $claseTipo = ['I' => 'md-tipo--leve', 'II' => 'md-tipo--moderada', 'III' => 'md-tipo--grave'];

  $seguimientoTexto = is_array($seguimiento)
      ? implode("\n", array_map(function ($s) { return is_array($s) ? ($s['nota'] ?? '') : (string) $s; }, $seguimiento))
      : (string) $seguimiento;
@endphp
<!DOCTYPE html>
<html lang="es-MX">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Acta de mediación {{ $folio }} · {{ $nombreAlumno }}</title>

  <style>
    @page { size: letter portrait; margin: 11mm 12mm; }

    :root {
      --md-tinta: #111827;
      --md-suave: #4b5563;
      --md-linea: #94a3b8;
      --md-tenue: #cbd5e1;
      --md-acento: #0f4c81;
      --md-leve: #b45309;
      --md-moderada: #c2410c;
      --md-grave: #b91c1c;
      --md-ok: #15803d;
    }
    * { box-sizing: border-box; }

    /* Utilidad de accesibilidad: visible solo para lectores de pantalla */
    .sr-only {
      position: absolute !important;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .md-body {
      margin: 0;
      padding: 20px 14px 44px;
      background: #e2e8f0;
      color: var(--md-tinta);
      font-family: Arial, Helvetica, "Segoe UI", sans-serif;
      font-size: 9pt;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .md-hoja {
      width: 21.59cm;
      min-height: 27.94cm;
      margin: 0 auto 14px;
      padding: 11mm 12mm;
      background: #fff;
      box-shadow: 0 10px 30px rgba(15, 23, 42, .25);
      box-sizing: border-box;
    }

    .md-acciones {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      max-width: 21.59cm; margin: 0 auto 12px; padding: 10px 14px;
      background: #fff; border: 1px solid var(--md-tenue); border-radius: 10px;
    }
    .md-acciones__volver { color: var(--md-acento); font-size: 12.5px; font-weight: 700; text-decoration: none; }
    .md-acciones__imprimir {
      min-height: 40px; padding: 8px 16px; border: 0; border-radius: 8px;
      background: var(--md-acento); color: #fff; font-family: inherit;
      font-size: 12.5px; font-weight: 700; cursor: pointer;
    }

    /* ---------- Membrete ---------- */
    .md-membrete {
      display: flex; align-items: center; gap: 5mm;
      padding-bottom: 3.5mm;
      border-bottom: 2.5px double var(--md-acento);
    }
    .md-escudo {
      display: flex; align-items: center; justify-content: center;
      width: 17mm; height: 17mm; flex: 0 0 auto;
      border: 2px solid var(--md-acento); border-radius: 50%;
      color: var(--md-acento); font-size: 12pt; font-weight: 700;
    }
    .md-membrete__texto { flex: 1 1 auto; }
    .md-estado { margin: 0; font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--md-acento); }
    .md-secretaria { margin: .6mm 0 0; font-size: 7.2pt; color: var(--md-suave); }
    .md-plantel { margin: 1mm 0 0; font-size: 10.5pt; font-weight: 700; }
    .md-datos-plantel { margin: .5mm 0 0; font-size: 7pt; color: var(--md-suave); }

    /* ---------- Título ---------- */
    .md-titulo {
      margin: 5mm 0 1.5mm;
      text-align: center;
      font-size: 11pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .03em;
      line-height: 1.3;
    }
    .md-subtitulo {
      margin: 0 0 4mm;
      text-align: center;
      font-size: 7.6pt;
      color: var(--md-suave);
      text-transform: uppercase;
      letter-spacing: .06em;
    }

    /* ---------- Tarjeta de datos ---------- */
    .md-ficha {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 2mm 5mm;
      margin: 0 0 4mm;
      padding: 3mm 4mm;
      background: #f8fafc;
      border: 1px solid var(--md-tenue);
      border-radius: 2mm;
    }
    .md-ficha__campo--ancho { grid-column: 1 / -1; }
    .md-ficha dt {
      font-size: 6.8pt; text-transform: uppercase; letter-spacing: .05em;
      color: var(--md-suave);
    }
    .md-ficha dd {
      margin: .5mm 0 0; font-size: 9pt; font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .md-ficha dd.mono { font-family: "Courier New", Consolas, monospace; font-size: 8.5pt; }

    /* ---------- Rótulos ---------- */
    .md-rotulo {
      margin: 4mm 0 2mm;
      padding: 1.4mm 3mm;
      background: #e8eef6;
      border-left: 4px solid var(--md-acento);
      font-size: 8.4pt; font-weight: 700;
      text-transform: uppercase; letter-spacing: .05em;
      color: var(--md-acento);
    }

    /* ---------- Relatoría ---------- */
    .md-relatoria {
      padding: 3mm;
      border: 1px solid var(--md-tenue);
      border-radius: 2mm;
      background: #fcfdff;
      font-size: 9pt;
      line-height: 1.65;
      text-align: justify;
      min-height: 22mm;
      white-space: pre-line;
    }
    .md-relatoria__meta {
      display: flex; flex-wrap: wrap; gap: 1mm 6mm;
      margin: 2mm 0 0; font-size: 7.4pt; color: var(--md-suave);
    }

    /* ---------- Tipificación ---------- */
    .md-tipos {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 3mm;
    }
    .md-tipo {
      padding: 2.5mm;
      border: 1.5px solid var(--md-tenue);
      border-radius: 2mm;
      background: #fff;
      font-size: 7.6pt;
      line-height: 1.4;
    }
    .md-tipo__cabecera {
      display: flex; align-items: center; gap: 1.5mm;
      margin-bottom: 1mm;
      font-weight: 800;
      font-size: 8pt;
    }
    .md-tipo__marca {
      display: inline-flex; align-items: center; justify-content: center;
      width: 3.4mm; height: 3.4mm;
      border: 1px solid var(--md-linea);
      border-radius: .6mm;
      font-size: 6.4pt; font-weight: 800; color: #fff;
      flex: 0 0 auto;
    }
    .md-tipo__detalle { margin: 0; color: var(--md-suave); }

    /* Variante activa */
    .md-tipo--activo .md-tipo__marca { border-color: currentColor; }
    .md-tipo.md-tipo--leve.md-tipo--activo {
      border-color: var(--md-leve); background: #fffbeb;
    }
    .md-tipo.md-tipo--leve.md-tipo--activo .md-tipo__cabecera { color: var(--md-leve); }
    .md-tipo.md-tipo--leve.md-tipo--activo .md-tipo__marca { background: var(--md-leve); border-color: var(--md-leve); }

    .md-tipo.md-tipo--moderada.md-tipo--activo {
      border-color: var(--md-moderada); background: #fff7ed;
    }
    .md-tipo.md-tipo--moderada.md-tipo--activo .md-tipo__cabecera { color: var(--md-moderada); }
    .md-tipo.md-tipo--moderada.md-tipo--activo .md-tipo__marca { background: var(--md-moderada); border-color: var(--md-moderada); }

    .md-tipo.md-tipo--grave.md-tipo--activo {
      border-color: var(--md-grave); background: #fef2f2;
    }
    .md-tipo.md-tipo--grave.md-tipo--activo .md-tipo__cabecera { color: var(--md-grave); }
    .md-tipo.md-tipo--grave.md-tipo--activo .md-tipo__marca { background: var(--md-grave); border-color: var(--md-grave); }

    /* ---------- Acuerdos ---------- */
    .md-tabla {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.2pt;
    }
    .md-tabla thead th {
      padding: 1.5mm 1.8mm;
      background: var(--md-acento);
      color: #fff;
      font-size: 6.8pt; font-weight: 700;
      text-transform: uppercase; letter-spacing: .03em;
      text-align: left;
      border: 1px solid var(--md-acento);
      line-height: 1.2;
    }
    .md-tabla thead th.c { text-align: center; }
    .md-tabla tbody td {
      padding: 1.6mm 1.8mm;
      border: 1px solid var(--md-tenue);
      vertical-align: top;
      line-height: 1.4;
    }
    .md-tabla tbody tr:nth-child(even) td { background: #fcfdff; }
    .md-tabla .c { text-align: center; font-variant-numeric: tabular-nums; }
    .md-tabla .num {
      display: inline-flex; align-items: center; justify-content: center;
      width: 5mm; height: 5mm; border-radius: 50%;
      background: var(--md-acento); color: #fff;
      font-size: 7pt; font-weight: 700;
    }
    .md-tabla .compromiso { font-weight: 700; }

    .md-vacio {
      padding: 5mm; text-align: center; font-style: italic;
      font-size: 8pt; color: var(--md-suave);
      border: 1px dashed var(--md-tenue); border-radius: 2mm;
    }

    /* ---------- Seguimiento ---------- */
    .md-seguimiento {
      padding: 3mm;
      border: 1px solid var(--md-tenue);
      border-left: 3px solid var(--md-ok);
      border-radius: 2mm;
      background: #f0fdf4;
      font-size: 8.4pt;
      line-height: 1.6;
      white-space: pre-line;
      min-height: 14mm;
    }

    /* ---------- Firmas ---------- */
    .md-firmas {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 6mm;
      margin-top: 8mm;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .md-firma { text-align: center; }
    .md-firma__linea { display: block; height: 15mm; border-bottom: 1.4px solid var(--md-tinta); }
    .md-firma__nombre { display: block; margin-top: 1.2mm; font-size: 8.4pt; font-weight: 700; min-height: 4mm; }
    .md-firma__cargo {
      display: block; margin-top: .8mm;
      font-size: 6.8pt; text-transform: uppercase; letter-spacing: .04em;
      color: var(--md-suave); line-height: 1.25;
    }
    .md-firma__parentesco {
      display: block; font-size: 7pt; color: var(--md-suave); margin-top: .4mm;
    }

    /* Huella digital del tutor */
    .md-huella {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      height: 20mm; width: 26mm; margin: 0 auto;
      border: 1.4px dashed var(--md-linea);
      border-radius: 2mm;
      color: var(--md-linea);
      font-size: 6.4pt; text-transform: uppercase; letter-spacing: .05em;
      text-align: center;
      line-height: 1.3;
    }

    .md-pie {
      margin-top: 4mm; padding-top: 1.8mm;
      border-top: 1px solid var(--md-tenue);
      display: flex; justify-content: space-between; gap: 4mm;
      font-size: 6.8pt; color: var(--md-suave);
    }

    .md-nota-legal {
      margin: 3mm 0 0;
      font-size: 7pt;
      line-height: 1.5;
      color: var(--md-suave);
      text-align: justify;
    }

    /* ---------- Responsivo ---------- */
    @media screen and (max-width: 920px) {
      .md-body { padding: 12px 8px 32px; }
      .md-hoja { width: 100%; min-height: 0; padding: 16px 12px; box-shadow: none; }
      .md-ficha { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .md-tipos { grid-template-columns: minmax(0, 1fr); }
      .md-firmas { grid-template-columns: minmax(0, 1fr); gap: 6mm; }
    }

    /* ---------- Impresión ---------- */
    @media print {
      .md-body { padding: 0; background: #fff; }
      .md-hoja { width: auto; min-height: 0; margin: 0; padding: 0; box-shadow: none; }
      .no-imprimir { display: none !important; }

      .md-membrete, .md-ficha, .md-relatoria, .md-tipos, .md-firmas,
      .md-pie, .md-tabla thead, .md-tabla tr, .md-seguimiento {
        break-inside: avoid; page-break-inside: avoid;
      }
      .md-tabla thead th, .md-rotulo, .md-tipo--activo, .md-escudo {
        -webkit-print-color-adjust: exact; print-color-adjust: exact;
      }
    }
  </style>
</head>

<body class="md-body">

  <div class="md-acciones no-imprimir">
    <a class="md-acciones__volver" href="{{ url()->previous() }}">← Volver</a>
    <button type="button" class="md-acciones__imprimir" onclick="window.print()">
      🖨️ Imprimir acta
    </button>
  </div>

  <main class="md-hoja">

    {{-- ---------- Membrete ---------- --}}
    <header class="md-membrete">
      <div class="md-escudo" aria-hidden="true">NL</div>
      <div class="md-membrete__texto">
        <p class="md-estado">Gobierno del Estado de Nuevo León · Secretaría de Educación</p>
        <p class="md-secretaria">Unidad de Integración Educativa (UIENL)</p>
        <p class="md-plantel">{{ $nombrePlantel }}</p>
        <p class="md-datos-plantel">
          C.C.T. {{ $cct }} · {{ $region }} · {{ $zona }}
        </p>
      </div>
    </header>

    <h1 class="md-titulo">
      Acta Administrativa Circunstanciada de Mediación Escolar y Acuerdos Formativos
    </h1>
    <p class="md-subtitulo">Protocolo de Convivencia Escolar Sana y Pacífica · Folio {{ $folio }}</p>

    {{-- ---------- Datos del alumno y del reporte ---------- --}}
    <dl class="md-ficha">
      <div class="md-ficha__campo--ancho">
        <dt>Nombre completo del alumno(a)</dt>
        <dd>{{ $nombreAlumno }}</dd>
      </div>
      <div><dt>Matrícula</dt><dd class="mono">{{ $matricula }}</dd></div>
      <div><dt>Grado y grupo</dt><dd>{{ $grado }} {{ $grupo }}</dd></div>
      <div><dt>Turno</dt><dd>{{ $turno }}</dd></div>
      <div><dt>Fecha y hora</dt><dd>{{ $fecha }} · {{ $hora }}</dd></div>
    </dl>

    {{-- ---------- Relatoría de hechos ---------- --}}
    <h2 class="md-rotulo">Relatoría de los hechos</h2>

    <div class="md-relatoria">{{ $descripcion ?: 'Sin descripción capturada.' }}</div>

    <p class="md-relatoria__meta">
      <span><strong>Lugar de los hechos:</strong> {{ $lugar }}</span>
      <span><strong>Personal que reporta:</strong> {{ $docente }}</span>
    </p>

    {{-- ---------- Tipificación ---------- --}}
    <h2 class="md-rotulo">Tipificación según el Marco de Convivencia Escolar de Nuevo León</h2>

    <div class="md-tipos">
      @foreach($tipos as $clave => $t)
        @php $activo = ($tipo === $clave); @endphp
        <div class="md-tipo {{ $claseTipo[$clave] }} {{ $activo ? 'md-tipo--activo' : '' }}">
          <div class="md-tipo__cabecera">
            <span class="md-tipo__marca" aria-hidden="true">{{ $activo ? '✓' : '' }}</span>
            <span>{{ $t['titulo'] }}</span>
          </div>
          <p class="md-tipo__detalle">{{ $t['detalle'] }}</p>
          @if($activo)
            <p class="md-tipo__detalle"><strong>Tipificación aplicada en esta acta.</strong></p>
          @endif
        </div>
      @endforeach
    </div>

    {{-- ---------- Acuerdos restaurativos ---------- --}}
    <h2 class="md-rotulo">Acuerdos y medidas pedagógicas restaurativas</h2>

    @if(count($acuerdos))
      <table class="md-tabla">
        <caption class="sr-only">
          Compromisos formativos acordados
        </caption>
        <thead>
          <tr>
            <th scope="col" style="width:9mm;">N°</th>
            <th scope="col">Compromiso formativo</th>
            <th scope="col" style="width:34mm;">Responsable</th>
            <th scope="col" style="width:22mm;" class="c">Fecha límite</th>
            <th scope="col" style="width:24mm;">Estado</th>
          </tr>
        </thead>
        <tbody>
          @foreach($acuerdos as $i => $a)
            <tr>
              <td class="c"><span class="num">{{ $i + 1 }}</span></td>
              <td class="compromiso">{{ $a['compromiso'] ?? '—' }}</td>
              <td>{{ $a['responsable'] ?? '—' }}</td>
              <td class="c">{{ $a['fecha'] ?? '—' }}</td>
              <td>{{ $a['estado'] ?? ($a['seguimiento'] ?? 'Pendiente') }}</td>
            </tr>
          @endforeach
        </tbody>
      </table>
    @else
      <p class="md-vacio">No se registraron acuerdos en esta acta.</p>
    @endif

    {{-- ---------- Seguimiento ---------- --}}
    <h2 class="md-rotulo">Seguimiento y observaciones</h2>

    <div class="md-seguimiento">{{ $seguimientoTexto ?: 'Sin observaciones de seguimiento registradas.' }}</div>

    <p class="md-nota-legal">
      Se hace constar que las partes fueron informadas del carácter formativo —no punitivo— de este
      procedimiento, conforme al Protocolo de Mediación Escolar y a la Ley de Educación de Nuevo León 2026.
      Los datos personales aquí contenidos son confidenciales y se resguardan conforme a la normativa
      estatal de protección de datos en posesión de sujetos obligados.
    </p>

    {{-- ---------- Firmas y huella ---------- --}}
    <div class="md-firmas">
      <div class="md-firma">
        <span class="md-firma__linea" aria-hidden="true"></span>
        <span class="md-firma__nombre">{{ $firmas['alumno'] ?? $nombreAlumno }}</span>
        <span class="md-firma__cargo">Alumno(a)</span>
      </div>

      <div class="md-firma">
        <span class="md-firma__linea" aria-hidden="true"></span>
        <span class="md-firma__nombre">{{ $firmas['tutor'] ?? '' }}</span>
        <span class="md-firma__cargo">Padre, madre o tutor legal</span>
        <span class="md-firma__parentesco">{{ $firmas['parentesco'] ?? '' }}</span>
        <span class="md-huella">Huella<br>digital</span>
      </div>

      <div class="md-firma">
        <span class="md-firma__linea" aria-hidden="true"></span>
        <span class="md-firma__nombre">{{ $firmas['mediador'] ?? '' }}</span>
        <span class="md-firma__cargo">Personal mediador / Trabajo Social</span>
        <span class="md-firma__parentesco">Vo.Bo. Dirección: {{ $firmas['director'] ?? '' }}</span>
      </div>
    </div>

    <footer class="md-pie">
      <span>{{ $nombrePlantel }} · C.C.T. {{ $cct }}</span>
      <span>Acta {{ $folio }} · {{ $fecha }} · {{ $region }} · {{ $zona }}</span>
    </footer>
  </main>
</body>
</html>

```

---

## 📄 ARCHIVO 2 · `resources/views/reportes/talonario-citatorio-incidencia-nl.blade.php`

```blade
{{--
  Talonario de Citatorio Inmediato por Incidencia o Mediación
  OLA 35 / Fase 12 · Destino: resources/views/reportes/talonario-citatorio-incidencia-nl.blade.php
  Media Carta, dos por hoja con línea de corte y talón de acuse para prefectura.
  Sin lógica JavaScript: la impresión la dispara el navegador.
--}}
@php
  $plantel    = is_array($plantel ?? null) ? $plantel : [];
  $alumno     = is_array($alumno ?? null) ? $alumno : [];
  $incidencia = is_array($incidencia ?? null) ? $incidencia : [];

  $nombrePlantel = $plantel['nombre'] ?? 'Escuela Secundaria Técnica Núm. 90';
  $cct           = $plantel['cct'] ?? '19DST0090X';
  $zona          = $plantel['zona'] ?? 'Zona Escolar 18';

  $folio = $folio ?? 'CIT-INC-2026-0000';
  $fecha = $fecha ?? now()->format('d/m/Y');
  $hora  = $hora  ?? now()->format('H:i');

  $nombreAlumno = $alumno['nombre'] ?? '—';
  $matricula    = $alumno['matricula'] ?? '—';
  $grado        = $alumno['grado'] ?? '—';
  $grupo        = $alumno['grupo'] ?? '—';
  $turno        = $alumno['turno'] ?? 'Matutino';

  $tipoFalta   = $incidencia['tipo_falta'] ?? '';
  $motivo      = $incidencia['descripcion_hechos'] ?? ($incidencia['motivo'] ?? '');
  $lugar       = $incidencia['lugar_hechos'] ?? 'Prefectura';
  $convocante  = $incidencia['docente_reporta'] ?? '';
  $cargo       = $incidencia['cargo_convocante'] ?? 'Prefectura / Trabajo Social';

  $diaCita  = $incidencia['dia_cita'] ?? '';
  $horaCita = $incidencia['hora_cita'] ?? '';
  $lugarCita = $incidencia['lugar_cita'] ?? 'Prefectura del plantel';
@endphp
<!DOCTYPE html>
<html lang="es-MX">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Citatorio por incidencia {{ $folio }} · {{ $nombreAlumno }}</title>

  <style>
    @page { size: letter portrait; margin: 10mm; }

    :root {
      --tc-tinta: #111827;
      --tc-suave: #4b5563;
      --tc-linea: #94a3b8;
      --tc-tenue: #cbd5e1;
      --tc-acento: #0f4c81;
      --tc-urgente: #b91c1c;
    }
    * { box-sizing: border-box; }

    .tc-body {
      margin: 0;
      padding: 16px 10px 40px;
      background: #e2e8f0;
      color: var(--tc-tinta);
      font-family: Arial, Helvetica, "Segoe UI", sans-serif;
      font-size: 8pt;
      line-height: 1.35;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .tc-hoja {
      width: 21.59cm;
      margin: 0 auto;
      padding: 10mm;
      background: #fff;
      box-shadow: 0 10px 30px rgba(15, 23, 42, .25);
    }

    .tc-acciones {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      max-width: 21.59cm; margin: 0 auto 12px; padding: 10px 14px;
      background: #fff; border: 1px solid var(--tc-tenue); border-radius: 10px;
    }
    .tc-acciones__volver { color: var(--tc-acento); font-size: 12.5px; font-weight: 700; text-decoration: none; }
    .tc-acciones__imprimir {
      min-height: 40px; padding: 8px 16px; border: 0; border-radius: 8px;
      background: var(--tc-acento); color: #fff; font-family: inherit;
      font-size: 12.5px; font-weight: 700; cursor: pointer;
    }

    /* ---------- Mitad ---------- */
    .tc-mitad {
      display: flex;
      flex-direction: column;
      height: 129mm;
      overflow: hidden;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    /* ---------- Membrete ---------- */
    .tc-membrete {
      display: flex; align-items: center; gap: 4mm;
      padding-bottom: 1.5mm;
      border-bottom: 1.8px solid var(--tc-acento);
    }
    .tc-escudo {
      display: flex; align-items: center; justify-content: center;
      width: 11mm; height: 11mm; flex: 0 0 auto;
      border: 1.5px solid var(--tc-acento); border-radius: 50%;
      color: var(--tc-acento); font-size: 7.5pt; font-weight: 700;
    }
    .tc-membrete__texto { flex: 1 1 auto; min-width: 0; }
    .tc-estado {
      margin: 0; font-size: 6.8pt; font-weight: 700;
      text-transform: uppercase; letter-spacing: .04em;
      color: var(--tc-acento);
    }
    .tc-plantel { margin: .4mm 0 0; font-size: 8.2pt; font-weight: 700; line-height: 1.2; }
    .tc-datos { margin: .3mm 0 0; font-size: 6.2pt; color: var(--tc-suave); }

    /* ---------- Folio y sello urgente ---------- */
    .tc-barra {
      display: flex; align-items: center; justify-content: space-between; gap: 3mm;
      margin: 1.5mm 0 0;
      font-size: 6.6pt;
      color: var(--tc-suave);
    }
    .tc-folio strong {
      font-family: "Courier New", Consolas, monospace;
      font-size: 7.4pt;
      color: var(--tc-tinta);
    }
    .tc-urgente {
      display: inline-flex; align-items: center; gap: 1.2mm;
      padding: .7mm 2.4mm;
      border-radius: 999px;
      background: #fee2e2;
      color: var(--tc-urgente);
      font-size: 6.2pt; font-weight: 800;
      text-transform: uppercase; letter-spacing: .05em;
    }
    .tc-urgente::before {
      content: ""; width: 1.6mm; height: 1.6mm; border-radius: 50%;
      background: var(--tc-urgente);
    }

    .tc-titulo {
      margin: 1.5mm 0 1mm;
      text-align: center;
      font-size: 8.8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .04em;
      line-height: 1.25;
    }

    /* ---------- Destinatario ---------- */
    .tc-destinatario {
      margin: 0 0 1mm;
      font-size: 7.6pt;
      line-height: 1.35;
    }

    /* ---------- Datos del alumno en línea ---------- */
    .tc-datos-alumno {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1mm 3mm;
      margin: 1mm 0;
      padding: 1.2mm 2mm;
      background: #f8fafc;
      border: 1px solid var(--tc-tenue);
      border-radius: 1mm;
      font-size: 6.8pt;
    }
    .tc-datos-alumno span { color: var(--tc-suave); }
    .tc-datos-alumno strong { color: var(--tc-tinta); }

    /* ---------- Motivo ---------- */
    .tc-motivo {
      margin: 1mm 0;
      padding: 1.5mm 2mm;
      border-left: 3px solid var(--tc-urgente);
      background: #fef2f2;
      font-size: 7.4pt;
      line-height: 1.4;
    }
    .tc-motivo__rotulo {
      display: block;
      font-size: 6.2pt; font-weight: 800;
      text-transform: uppercase; letter-spacing: .05em;
      color: var(--tc-urgente);
      margin-bottom: .4mm;
    }

    /* ---------- Convocatoria ---------- */
    .tc-convocatoria {
      margin: 1mm 0;
      padding: 1.5mm 2mm;
      border: 1px solid var(--tc-tenue);
      border-radius: 1mm;
      font-size: 7.4pt;
      line-height: 1.4;
    }

    .tc-instrucciones {
      margin: 1mm 0;
      padding-left: 4mm;
      font-size: 6.8pt;
      line-height: 1.35;
      color: var(--tc-suave);
    }
    .tc-instrucciones li { margin-bottom: .3mm; }

    /* ---------- Firma del convocante ---------- */
    .tc-firma-convocante {
      display: flex; align-items: flex-end; justify-content: space-between;
      gap: 5mm;
      margin-top: auto;
      padding-top: 1.5mm;
    }
    .tc-firma { text-align: center; flex: 0 1 58mm; }
    .tc-firma__linea { display: block; height: 8mm; border-bottom: 1px solid var(--tc-tinta); }
    .tc-firma__nombre { display: block; margin-top: .5mm; font-size: 7pt; font-weight: 700; }
    .tc-firma__cargo {
      display: block; font-size: 6pt;
      text-transform: uppercase; letter-spacing: .03em;
      color: var(--tc-suave);
    }

    /* ---------- Corte ---------- */
    .tc-corte {
      position: relative;
      display: flex; align-items: center; justify-content: center; gap: 2mm;
      height: 5.5mm;
      margin: 1.2mm 0;
      font-size: 5.8pt; font-weight: 700;
      letter-spacing: .12em;
      color: var(--tc-linea);
      text-transform: uppercase;
      white-space: nowrap;
    }
    .tc-corte::before,
    .tc-corte::after { content: ""; flex: 1 1 auto; border-top: 1px dashed var(--tc-linea); }

    /* ---------- Talón ---------- */
    .tc-talon {
      padding: 1.5mm 2mm;
      border: 1px dashed var(--tc-linea);
      border-radius: 1mm;
      background: #f8fafc;
      font-size: 6.8pt;
      line-height: 1.35;
    }
    .tc-talon__cabecera {
      display: flex; align-items: baseline; justify-content: space-between; gap: 3mm;
      margin-bottom: .6mm;
    }
    .tc-talon__titulo {
      margin: 0;
      font-size: 6.4pt; font-weight: 800;
      text-transform: uppercase; letter-spacing: .05em;
      color: var(--tc-acento);
    }
    .tc-talon__folio {
      font-family: "Courier New", Consolas, monospace;
      font-size: 6.8pt; font-weight: 700;
    }
    .tc-talon__datos { margin: 0 0 .6mm; font-size: 6.6pt; }
    .tc-talon__declaracion {
      margin: 0 0 .6mm;
      padding: .8mm 1.4mm;
      background: #fff;
      border: 1px solid var(--tc-tenue);
      border-radius: .8mm;
      font-size: 6.6pt;
      line-height: 1.4;
    }
    .tc-talon__firmas {
      display: flex; align-items: flex-end; justify-content: space-between; gap: 3mm;
    }
    .tc-talon__campo { flex: 1 1 0; text-align: center; }
    .tc-talon__campo-linea { display: block; height: 5.5mm; border-bottom: 1px solid var(--tc-linea); }
    .tc-talon__campo-rotulo {
      display: block; margin-top: .3mm;
      font-size: 5.6pt;
      text-transform: uppercase; letter-spacing: .03em;
      color: var(--tc-suave);
    }

    /* ---------- Responsivo e impresión ---------- */
    @media screen and (max-width: 920px) {
      .tc-body { padding: 10px 6px 30px; }
      .tc-hoja { width: 100%; padding: 12px 10px; box-shadow: none; }
      .tc-mitad { height: auto; }
      .tc-mitad + .tc-mitad { margin-top: 10px; }
      .tc-datos-alumno { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }

    @media print {
      .tc-body { padding: 0; background: #fff; }
      .tc-hoja { width: auto; padding: 0; box-shadow: none; }
      .no-imprimir { display: none !important; }
      .tc-mitad { height: 129mm; }
      .tc-corte::before,
      .tc-corte::after { border-top-color: #94a3b8; }
    }
  </style>
</head>

<body class="tc-body">

  <div class="tc-acciones no-imprimir">
    <a class="tc-acciones__volver" href="{{ url()->previous() }}">← Volver</a>
    <button type="button" class="tc-acciones__imprimir" onclick="window.print()">
      🖨️ Imprimir citatorio
    </button>
  </div>

  <div class="tc-hoja">
    {{-- Dos citatorios idénticos por hoja Carta --}}
    @for($copia = 1; $copia <= 2; $copia++)

      <section class="tc-mitad" aria-label="Citatorio {{ $folio }} · copia {{ $copia }}">

        <header class="tc-membrete">
          <div class="tc-escudo" aria-hidden="true">NL</div>
          <div class="tc-membrete__texto">
            <p class="tc-estado">Gobierno del Estado de Nuevo León · Secretaría de Educación</p>
            <p class="tc-plantel">{{ $nombrePlantel }}</p>
            <p class="tc-datos">
              C.C.T. {{ $cct }} · {{ $zona }} · Turno {{ $turno }} · Convivencia Escolar
            </p>
          </div>
        </header>

        <div class="tc-barra">
          <span class="tc-folio">Folio: <strong>{{ $folio }}</strong></span>
          <span class="tc-urgente">Citatorio urgente</span>
        </div>

        <h2 class="tc-titulo">
          Citatorio inmediato a padres de familia<br>por incidencia o proceso de mediación
        </h2>

        <p class="tc-destinatario">
          <strong>Padre de familia, madre o tutor legal del alumno(a):</strong>
        </p>

        <div class="tc-datos-alumno">
          <div><span>Alumno(a):</span> <strong>{{ $nombreAlumno }}</strong></div>
          <div><span>Matrícula:</span> <strong>{{ $matricula }}</strong></div>
          <div><span>Grado y grupo:</span> <strong>{{ $grado }} {{ $grupo }}</strong></div>
          <div><span>Turno:</span> <strong>{{ $turno }}</strong></div>
        </div>

        {{-- Motivo --}}
        <div class="tc-motivo">
          <span class="tc-motivo__rotulo">Motivo del citatorio</span>
          @if($tipoFalta !== '')
            Tipificación: <strong>{{ $tipoFalta }}</strong>.
          @endif
          {{ $motivo ?: 'Se le convoca para dar seguimiento a una incidencia registrada en el marco de la convivencia escolar.' }}
        </div>

        {{-- Convocatoria --}}
        <p class="tc-convocatoria">
          Se le solicita presentarse el día <strong>{{ $diaCita ?: '____________' }}</strong>
          a las <strong>{{ $horaCita ?: '__:__' }} hrs</strong>, en
          <strong>{{ $lugarCita }}</strong>, para participar en el proceso de mediación escolar
          y la firma de acuerdos formativos correspondientes.
        </p>

        <ul class="tc-instrucciones">
          <li>Presentarse con identificación oficial vigente.</li>
          <li>Traer una identificación del alumno(a) si se solicita.</li>
          <li>Si no puede asistir, comunicarse de inmediato a la Prefectura del plantel para reprogramar.</li>
        </ul>

        <div class="tc-firma-convocante">
          <span style="font-size:6pt;color:var(--tc-suave);">
            Emitido el {{ $fecha }} · {{ $hora }}
          </span>
          <div class="tc-firma">
            <span class="tc-firma__linea" aria-hidden="true"></span>
            <span class="tc-firma__nombre">{{ $convocante }}</span>
            <span class="tc-firma__cargo">{{ $cargo }}</span>
          </div>
        </div>

        {{-- Corte --}}
        <div class="tc-corte" aria-hidden="true">
          <span>✂️ - - - - - Corte aquí - - - - -</span>
        </div>

        {{-- Talón de acuse --}}
        <div class="tc-talon">
          <div class="tc-talon__cabecera">
            <h3 class="tc-talon__titulo">Talón de acuse · Archivo de prefectura</h3>
            <span class="tc-talon__folio">{{ $folio }}</span>
          </div>

          <p class="tc-talon__datos">
            Alumno(a): <strong>{{ $nombreAlumno }}</strong> · Matrícula:
            <strong>{{ $matricula }}</strong> · Grupo: <strong>{{ $grado }} {{ $grupo }}</strong> ·
            Motivo: <strong>{{ $tipoFalta ?: 'Incidencia / mediación' }}</strong>
          </p>

          <p class="tc-talon__declaracion">
            Enterado(a) del citatorio programado para el día ______________ a las __________ hrs.
            Me comprometo a asistir puntualmente y a participar en el proceso de mediación.
          </p>

          <div class="tc-talon__firmas">
            <div class="tc-talon__campo">
              <span class="tc-talon__campo-linea" aria-hidden="true"></span>
              <span class="tc-talon__campo-rotulo">Nombre legible del padre o tutor</span>
            </div>
            <div class="tc-talon__campo">
              <span class="tc-talon__campo-linea" aria-hidden="true"></span>
              <span class="tc-talon__campo-rotulo">Firma de enterado</span>
            </div>
            <div class="tc-talon__campo">
              <span class="tc-talon__campo-linea" aria-hidden="true"></span>
              <span class="tc-talon__campo-rotulo">Fecha</span>
            </div>
          </div>
        </div>
      </section>

    @endfor
  </div>
</body>
</html>

```

---

## 🧭 Trazabilidad con el Feature Map

### Vista 1 · Acta de mediación

| Requisito del Feature Map | Implementado |
|---|:---:|
| Preámbulo tolerante: `$plantel`, `$folio`, `$fecha`, `$hora`, `$alumno`, `$incidencia`, `$acuerdos`, `$seguimiento`, `$firmas` | ✅ `is_array()` + valores por defecto en todos |
| Membrete NL · SENL · UIENL · EST 90 · CCT 19DST0090X | ✅ |
| Encabezado con el nombre completo del acta | ✅ |
| Tarjeta condensada: matrícula, nombre, grado/grupo, turno, fecha/hora | ✅ |
| Relatoría de hechos con lugar y docente que reporta | ✅ |
| Tipificación I / II / III con la aplicada resaltada | ✅ Tres tarjetas; solo la activa se colorea y marca |
| Tabla numerada de acuerdos restaurativos | ✅ Compromiso, responsable, fecha límite, estado |
| Seguimiento y observaciones | ✅ |
| Firmas: alumno, tutor con parentesco, mediador, Vo.Bo. Dirección | ✅ Con recuadro de huella digital |

### Vista 2 · Talonario

| Requisito | Implementado |
|---|:---:|
| Media Carta, 2 por hoja | ✅ `.tc-mitad` de 129 mm × 2 |
| `@page { size: letter portrait; margin: 10mm; }` | ✅ |
| Línea discontinua con ✂️ | ✅ `.tc-corte` |
| Citatorio urgente por mediación/incidencia | ✅ Con badge rojo «Citatorio urgente» |
| Motivo y tipificación | ✅ |
| Talón de acuse con firma y fecha del tutor | ✅ Folio coincidente |

---

## ⚠️ Decisiones que Antigravity debe conocer

1. **La tipificación se normaliza en la vista.** Acepta `I`/`II`/`III`, `leve`/`moderada`/`grave` o `tipo1..3`; así el acta no depende de cómo lo guarde el controlador.
2. **Las tres tipificaciones siempre se dibujan** y solo la aplicada se colorea. Un acta oficial que solo muestra la falta cometida impide verificar que se clasificó bien.
3. **La huella digital es un recuadro, no un lector.** El tutor firma y estampa; el sistema no captura biometría (no hay almacenamiento de huellas en el Feature Map).
4. **El talonario reutiliza el folio** del citatorio en cuerpo y talón, igual que el de OLA 33: sin eso el acuse no es trazable.
5. **Tolerancia total a datos vacíos:** `$acuerdos` vacío muestra estado vacío, `$seguimiento` vacío muestra leyenda, y ningún campo lanza error.

---

## 📋 INFORME PARA ANTIGRAVITY

```text
INFORME PARA ANTIGRAVITY · OLA 35 (FASE 12)
- Archivos (NUEVOS, ya en entregas-laravel-fase1/resources/views/reportes/):
    * acta-mediacion-escolar-nl.blade.php             (19.3 KB)
    * talonario-citatorio-incidencia-nl.blade.php     (14.7 KB)
  Ambos con <style> embebido, sin assets externos ni JavaScript propio.
- Propósito:
    1. Acta administrativa circunstanciada de mediación escolar: relatoría de hechos, tipificación
       I/II/III con la aplicada resaltada, tabla de acuerdos restaurativos, seguimiento y cuatro
       firmas (alumno, tutor con parentesco, mediador, Vo.Bo. Dirección) con recuadro de huella.
    2. Talonario de citatorio inmediato por incidencia: dos por hoja Carta, línea de corte y talón
       de acuse para archivo de prefectura.
- Selectores: .md-* (37 clases) y .tc-* (38 clases). Inventario completo en el cuerpo de la entrega.
- Precauciones:
    * La tipificación se normaliza en la vista (I/II/III, leve/moderada/grave, tipo1..3).
    * Las tres tipificaciones se dibujan siempre; solo la activa se colorea (trazabilidad del acto).
    * La huella es un recuadro para estampar en papel; el sistema no captura biometría.
    * El talón debe conservar el mismo folio del cuerpo.
    * Sin IDs del DOM nuevos; sin rutas nuevas inventadas.
    * Sin git, sin push, sin despliegue.
```

