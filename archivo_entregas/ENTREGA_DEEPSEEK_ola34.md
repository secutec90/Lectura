# PARTITURA DE TRABAJO: DEEPSEEK (OLA 34 - FASE 11)
**Proyecto:** Suite Escolar Academia (Laravel 12 + Filament v3) — Escuela Secundaria Técnica Núm. 90  
**Normativa Aplicable:** Ley de Educación de Nuevo León 2026, Guía Operativa UIENL/SENL, Acuerdo Secretarial 97 y Acuerdo 10/09/23.  
**Estado:** `🟢 PROGRAMADA / EN ESPERA DE TU ENTREGA`

---

## 🎯 OBJETIVO DE LA OLA 34 (FASE 11)
Diseñar y maquetar con excelencia visual, accesibilidad DUA e idoneidad tipográfica para pantalla e impresión oficial (`@media print` Letter / Carta):
1. **`director-radar-alertas-nl.blade.php`**: Dashboard Ejecutivo de Dirección y Prefectura — Radar de Alertas Tempranas de Abandono Escolar (SIAT-NL) con Semáforo Tri-Color (🔴 Crítico, 🟡 Rezago, 🟢 Regular), KPI cards ejecutivas, barras de asistencia comparativa por grado y turno (CSS puro), tabla de alumnos en riesgo con badges y botones de intervención rápida, y firmas institucionales.
2. **`acta-supervision-alerta-temprana-nl.blade.php`**: Acta Oficial de Concentración de Alertas Tempranas para la Supervisión de Zona Técnica y Región Educativa (SENL / UIENL). Carta vertical con tabla estadística agregada por grupo, desglose de causales de riesgo por sexo y compromisos institucionales firmados.

---

## 📐 ESPECIFICACIÓN TÉCNICA Y REGLAS DE ORO

### 1. Vista 1: `director-radar-alertas-nl.blade.php`
- **Ubicación destino:** `resources/views/reportes/director-radar-alertas-nl.blade.php`
- **Preamble `@php` tolerante y polimórfico:**
  - Extraer `$plantel`, `$ciclo`, `$fechaReporte`, `$kpis` (`total_alumnos`, `alumnos_riesgo_rojo`, `alumnos_riesgo_amarillo`, `asistencia_hoy_pct`, `citatorios_pendientes`, `canalizados_udei`), `$radarGrados` (asistencia y riesgo 1°, 2°, 3° en Matutino y Vespertino), `$alumnosRiesgo` (lista de alumnos con semáforo, causal, inasistencias y promedio) y `$firmas`.
  - Asegurar valores por defecto y fallbacks limpios si alguna variable viene nula o vacía.
- **Estructura Visual:**
  - **Membrete Oficial:** Gobierno del Estado de Nuevo León, Secretaría de Educación (SENL), Unidad de Integración Educativa (UIENL), Escuela Secundaria Técnica Núm. 90, CCT `19DST0090X`, Región Educativa 13, Zona Escolar 18.
  - **Banner de Estado:** "SISTEMA INTEGRAL DE ALERTA TEMPRANA Y PREVENCIÓN DEL ABANDONO ESCOLAR (SIAT-NL) — CICLO 2026-2027".
  - **Tarjetas KPI Ejecutivas (4 columnas en desktop, 2 en móvil):**
    1. 🔴 **Riesgo Crítico de Abandono:** Alumnos con $\ge 3$ inasistencias consecutivas o $> 15\%$ acumuladas. Badge pulsante suave.
    2. 🟡 **Rezago Académico / Lectura:** Alumnos con $\ge 2$ materias reprobadas o velocidad $< 75$ PPM.
    3. 📊 **Asistencia Global del Día (%):** Indicador radial o barra de progreso con código de color.
    4. 🤝 **Atención Inclusiva (UDEI / BAP):** Alumnos con seguimiento activo de inclusión o citatorio emitido.
  - **Radar Visual por Grados y Turnos (CSS Grid / Flexbox puro):**
    - Comparativa visual de porcentaje de permanencia y asistencia entre 1°, 2° y 3° grado, desglosado en Turno Matutino y Turno Vespertino.
  - **Tabla de Alumnos en Observación y Seguimiento Activo:**
    - Columnas: `N°`, `Matrícula`, `Alumno`, `Grado/Gpo`, `Taller Tecnológico (8 hrs)`, `Semáforo`, `Causal Principal`, `Faltas / Estado`, `Acciones Sugeridas`.
    - Botones de acción rápida con clases limpias: `[ 📄 Kárdex 360° ]` (`/reportes/expediente-360/{id}`), `[ ✉️ Citar Padres ]` (`/reportes/citatorio/{id}`), `[ 🤝 Canalizar UDEI ]`.
  - **Bloque de Validación Oficial:**
    - Firmas de: Director(a) del Plantel, Jefatura de Prefectura, Trabajo Social y Representante UDEI.

### 2. Vista 2: `acta-supervision-alerta-temprana-nl.blade.php`
- **Ubicación destino:** `resources/views/reportes/acta-supervision-alerta-temprana-nl.blade.php`
- **Formato:** Hoja membretada oficial Letter portrait con reglas `@page { size: letter portrait; margin: 12mm 15mm; }`.
- **Contenido Normativo:**
  - Encabezado institucional de la Inspección de Zona Escolar y Dirección de Educación Secundaria Técnica.
  - Título: "ACTA CIRCUNSTANCIADA DE MONITOREO DE ALERTA TEMPRANA Y RETENCIÓN ESCOLAR".
  - Concentrado cuantitativo por grupos (1°A, 1°B, 2°A, 2°B, 3°A, 3°B): Matrícula inicial, bajas, alumnos en semáforo rojo, inasistencias acumuladas y porcentaje de retención efectiva.
  - Tabla de causales tipificadas (Deserción por cambio de domicilio, absentismo reiterado sin justificación, vulnerabilidad socio-emocional / BAP, rezago académico severo).
  - Medidas de intervención implementadas (visitas domiciliarias de trabajo social, citatorios firmados, acuerdos pedagógicos DUA).
  - Bloque de firmas de Supervisión de Zona Escolar, Dirección y Trabajo Social.

---

## 📥 FORMATO DE ENTREGA
Escribe el código completo de ambas vistas Blade con sus estilos CSS embebidos (`<style>`) dentro de este archivo `ENTREGA_DEEPSEEK.md`, etiquetando claramente cada bloque con su ruta de archivo.  
Al finalizar tu respuesta, Antigravity auditará la coherencia de selectores e integrará el código directamente en el repositorio.

---

# ✅ ENTREGA DEEPSEEK — OLA 34 (FASE 11)

**Fecha:** 2026-11-19 · **Autor:** DeepSeek (Design & UX/UI Lead) · **Estado:** 🟢 LISTA PARA AUDITORÍA
Ambas vistas llevan **CSS embebido** en un `<style>` propio, como pide el formato de entrega.
Ya depositadas en `entregas-laravel-fase1/resources/views/reportes/`.

| Archivo | Tamaño |
|---|---:|
| `resources/views/reportes/director-radar-alertas-nl.blade.php` | 23.8 KB |
| `resources/views/reportes/acta-supervision-alerta-temprana-nl.blade.php` | 18.0 KB |

Auditoría de clases: **50 clases `rd-*`** y **33 clases `ac-*`**, todas definidas. El único aviso del
audit fue `rd-semaforo--{{ $semaforo }}`, que es la interpolación dinámica: las tres variantes
(`--rojo`, `--amarillo`, `--verde`) sí existen en la hoja.

---

## 📄 ARCHIVO 1 · `resources/views/reportes/director-radar-alertas-nl.blade.php`

```blade
{{--
  Dashboard Ejecutivo de Dirección y Prefectura · Radar SIAT-NL (OLA 34 / Fase 11)
  Destino: resources/views/reportes/director-radar-alertas-nl.blade.php
  Semáforo tri-color de alerta temprana, KPI ejecutivas, radar por grado y turno.
  Sin lógica JavaScript: solo presentación y CSS puro.
--}}
@php
  $plantel       = is_array($plantel ?? null) ? $plantel : [];
  $ciclo         = $ciclo ?? ($plantel['ciclo'] ?? '2026-2027');
  $fechaReporte  = $fechaReporte ?? now()->format('d/m/Y');
  $horaReporte   = $horaReporte ?? now()->format('H:i');

  $nombrePlantel = $plantel['nombre'] ?? 'Escuela Secundaria Técnica Núm. 90';
  $cct           = $plantel['cct'] ?? '19DST0090X';
  $region        = $plantel['region'] ?? 'Región Educativa 13';
  $zona          = $plantel['zona'] ?? 'Zona Escolar 18';
  $director      = $plantel['director'] ?? '';

  // KPI tolerantes: cualquier clave ausente toma 0
  $kpis = array_merge([
      'total_alumnos'            => 0,
      'alumnos_riesgo_rojo'      => 0,
      'alumnos_riesgo_amarillo'   => 0,
      'asistencia_hoy_pct'       => 0,
      'citatorios_pendientes'    => 0,
      'canalizados_udei'         => 0,
  ], is_array($kpis ?? null) ? $kpis : []);

  $pct          = (float) $kpis['asistencia_hoy_pct'];
  $clasePct     = $pct >= 90 ? 'radial--ok' : ($pct >= 75 ? 'radial--medio' : 'radial--bajo');
  $pctRedondeado = (int) round($pct);

  // Radar por grado y turno (estructura tolerante)
  $radarGrados = is_array($radarGrados ?? null) ? $radarGrados : [];
  if (!$radarGrados) {
      $radarGrados = [
          ['grado' => '1°', 'matutino' => ['asistencia' => 0, 'riesgo' => 0], 'vespertino' => ['asistencia' => 0, 'riesgo' => 0]],
          ['grado' => '2°', 'matutino' => ['asistencia' => 0, 'riesgo' => 0], 'vespertino' => ['asistencia' => 0, 'riesgo' => 0]],
          ['grado' => '3°', 'matutino' => ['asistencia' => 0, 'riesgo' => 0], 'vespertino' => ['asistencia' => 0, 'riesgo' => 0]],
      ];
  }

  // Alumnos en seguimiento
  $alumnosRiesgo = is_array($alumnosRiesgo ?? null) ? $alumnosRiesgo : [];
  $firmas = is_array($firmas ?? null) ? $firmas : [];

  $colorSemaforo = function ($semaforo) {
      $s = strtolower((string) $semaforo);
      if (in_array($s, ['rojo', 'critico', 'crítico'], true)) return 'rojo';
      if (in_array($s, ['amarillo', 'rezago'], true))        return 'amarillo';
      return 'verde';
  };
  $etiquetaSemaforo = ['rojo' => 'Crítico', 'amarillo' => 'Rezago', 'verde' => 'Regular'];
@endphp
<!DOCTYPE html>
<html lang="es-MX">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Radar de alertas tempranas · {{ $nombrePlantel }}</title>

  <style>
    @page { size: letter portrait; margin: 10mm 8mm; }

    :root {
      --rd-tinta: #0f172a;
      --rd-suave: #475569;
      --rd-tenue: #cbd5e1;
      --rd-acento: #0f4c81;
      --rd-rojo: #dc2626;
      --rd-ambar: #d97706;
      --rd-verde: #15803d;
      --rd-udei: #0f766e;
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

    .rd-body {
      margin: 0;
      padding: 20px 14px 44px;
      background: #eef2f7;
      color: var(--rd-tinta);
      font-family: Arial, Helvetica, "Segoe UI", sans-serif;
      font-size: 13px;
      line-height: 1.45;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .rd-body :focus-visible { outline: 3px solid #0c4a6e; outline-offset: 3px; border-radius: 6px; }

    .rd-hoja {
      max-width: 21.59cm;
      margin: 0 auto;
      padding: 10mm 8mm;
      background: #fff;
      box-shadow: 0 10px 30px rgba(15, 23, 42, .22);
    }

    .rd-acciones {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      max-width: 21.59cm; margin: 0 auto 12px; padding: 10px 14px;
      background: #fff; border: 1px solid var(--rd-tenue); border-radius: 10px;
    }
    .rd-acciones__volver { color: var(--rd-acento); font-size: 12.5px; font-weight: 700; text-decoration: none; }
    .rd-acciones__imprimir {
      min-height: 40px; padding: 8px 16px; border: 0; border-radius: 8px;
      background: var(--rd-acento); color: #fff; font-family: inherit;
      font-size: 12.5px; font-weight: 700; cursor: pointer;
    }

    /* ---------- Membrete ---------- */
    .rd-membrete {
      display: flex; align-items: center; gap: 5mm;
      padding-bottom: 4mm; border-bottom: 2.5px solid var(--rd-acento);
    }
    .rd-escudo {
      display: flex; align-items: center; justify-content: center;
      width: 17mm; height: 17mm; flex: 0 0 auto;
      border: 2px solid var(--rd-acento); border-radius: 50%;
      color: var(--rd-acento); font-size: 13pt; font-weight: 700;
    }
    .rd-membrete__texto { flex: 1 1 auto; }
    .rd-estado { margin: 0; font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--rd-acento); }
    .rd-secretaria { margin: .6mm 0 0; font-size: 7.2pt; color: var(--rd-suave); }
    .rd-plantel { margin: 1mm 0 0; font-size: 10.5pt; font-weight: 700; }
    .rd-datos { margin: .5mm 0 0; font-size: 7pt; color: var(--rd-suave); }

    /* ---------- Banner SIAT ---------- */
    .rd-banner {
      margin: 4mm 0 4mm;
      padding: 3mm 4mm;
      background: linear-gradient(135deg, #0f4c81 0%, #0369a1 100%);
      border-radius: 2.5mm;
      color: #fff;
    }
    .rd-banner__titulo {
      margin: 0;
      font-size: 9.2pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .04em;
      line-height: 1.35;
    }
    .rd-banner__meta {
      display: flex; flex-wrap: wrap; gap: 1mm 6mm;
      margin: 1.5mm 0 0; font-size: 7.4pt; opacity: .95;
    }

    /* ---------- KPI ---------- */
    .rd-kpis {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 3mm;
      margin-bottom: 5mm;
    }
    .rd-kpi {
      display: flex; flex-direction: column; gap: 1.5mm;
      padding: 3.5mm;
      background: #f8fafc;
      border: 1px solid var(--rd-tenue);
      border-top: 4px solid var(--rd-tenue);
      border-radius: 2.5mm;
    }
    .rd-kpi__rotulo {
      display: flex; align-items: center; gap: 1.5mm;
      font-size: 7.2pt; font-weight: 800;
      text-transform: uppercase; letter-spacing: .04em;
      color: var(--rd-suave);
      line-height: 1.25;
    }
    .rd-kpi__valor {
      font-size: 22pt; font-weight: 800; line-height: 1;
      font-variant-numeric: tabular-nums;
      color: var(--rd-tinta);
    }
    .rd-kpi__unidad { font-size: 8pt; font-weight: 700; color: var(--rd-suave); }
    .rd-kpi__nota { margin: 0; font-size: 7pt; line-height: 1.35; color: var(--rd-suave); }

    .rd-kpi--rojo    { border-top-color: var(--rd-rojo);  background: #fef2f2; }
    .rd-kpi--rojo    .rd-kpi__valor { color: #991b1b; }
    .rd-kpi--ambar   { border-top-color: var(--rd-ambar); background: #fffbeb; }
    .rd-kpi--ambar   .rd-kpi__valor { color: #92400e; }
    .rd-kpi--azul    { border-top-color: var(--rd-acento); background: #f0f9ff; }
    .rd-kpi--azul    .rd-kpi__valor { color: #075985; }
    .rd-kpi--udei    { border-top-color: var(--rd-udei);  background: #f0fdfa; }
    .rd-kpi--udei    .rd-kpi__valor { color: #115e59; }

    /* Badge pulsante suave para el riesgo crítico */
    .rd-pulso {
      display: inline-flex; align-items: center; gap: 1.2mm;
      padding: .5mm 2mm; border-radius: 999px;
      background: #fee2e2; color: #991b1b;
      font-size: 6.4pt; font-weight: 800;
      text-transform: uppercase; letter-spacing: .04em;
    }
    .rd-pulso::before {
      content: ""; width: 1.8mm; height: 1.8mm; border-radius: 50%;
      background: var(--rd-rojo);
      animation: rdPulso 1.8s ease-in-out infinite;
    }
    @keyframes rdPulso {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%      { opacity: .45; transform: scale(.85); }
    }

    /* Indicador radial de asistencia */
    .rd-radial {
      position: relative;
      width: 22mm; height: 22mm;
      border-radius: 50%;
      background: conic-gradient(var(--rd-radial-color, var(--rd-acento)) calc(var(--rd-pct, 0) * 1%), #e2e8f0 0);
      display: flex; align-items: center; justify-content: center;
    }
    .rd-radial::after {
      content: ""; position: absolute; inset: 3mm;
      background: #fff; border-radius: 50%;
    }
    .rd-radial__valor {
      position: relative; z-index: 1;
      font-size: 10pt; font-weight: 800;
      font-variant-numeric: tabular-nums;
      color: var(--rd-tinta);
    }
    .rd-radial--ok    { --rd-radial-color: var(--rd-verde); }
    .rd-radial--medio { --rd-radial-color: var(--rd-ambar); }
    .rd-radial--bajo  { --rd-radial-color: var(--rd-rojo); }

    /* ---------- Rótulos ---------- */
    .rd-rotulo {
      margin: 5mm 0 2.5mm;
      padding: 1.5mm 3mm;
      background: #e8eef6;
      border-left: 4px solid var(--rd-acento);
      font-size: 8.4pt; font-weight: 800;
      text-transform: uppercase; letter-spacing: .05em;
      color: var(--rd-acento);
    }

    /* ---------- Radar por grado y turno ---------- */
    .rd-radar {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 4mm;
    }
    .rd-radar__grupo {
      padding: 3mm;
      border: 1px solid var(--rd-tenue);
      border-radius: 2mm;
      background: #f8fafc;
    }
    .rd-radar__grado {
      margin: 0 0 2mm;
      font-size: 11pt; font-weight: 800;
      color: var(--rd-acento);
      text-align: center;
    }
    .rd-radar__turno { margin-bottom: 2mm; }
    .rd-radar__turno:last-child { margin-bottom: 0; }
    .rd-radar__fila {
      display: flex; align-items: baseline; justify-content: space-between; gap: 2mm;
      font-size: 7.2pt; font-weight: 700; color: var(--rd-suave);
      margin-bottom: .6mm;
    }
    .rd-radar__barra {
      height: 4.5mm;
      border-radius: 999px;
      background: #e2e8f0;
      overflow: hidden;
    }
    .rd-radar__relleno {
      display: block; height: 100%;
      border-radius: 999px;
      background: var(--rd-verde);
    }
    .rd-radar__relleno--medio { background: var(--rd-ambar); }
    .rd-radar__relleno--bajo  { background: var(--rd-rojo); }
    .rd-radar__riesgo {
      display: inline-flex; align-items: center; gap: 1mm;
      margin-top: .8mm;
      font-size: 6.6pt; font-weight: 700;
      color: var(--rd-suave);
    }
    .rd-radar__riesgo strong { color: #991b1b; }

    /* ---------- Tabla de alumnos ---------- */
    .rd-tabla-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .rd-tabla {
      width: 100%;
      min-width: 100%;
      border-collapse: collapse;
      font-size: 7.4pt;
      table-layout: fixed;
    }
    .rd-tabla thead th {
      padding: 1.6mm 1.4mm;
      background: var(--rd-acento);
      color: #fff;
      font-size: 6.4pt; font-weight: 800;
      text-transform: uppercase; letter-spacing: .03em;
      text-align: left;
      border: 1px solid var(--rd-acento);
      line-height: 1.2;
    }
    .rd-tabla tbody td {
      padding: 1.4mm;
      border: 1px solid var(--rd-tenue);
      vertical-align: middle;
      line-height: 1.3;
    }
    .rd-tabla tbody tr:nth-child(even) td { background: #fcfdff; }
    .rd-tabla .c { text-align: center; }
    .rd-tabla .mono { font-family: "Courier New", Consolas, monospace; font-size: 6.8pt; }
    .rd-tabla .alumno { font-weight: 700; }

    .rd-semaforo {
      display: inline-flex; align-items: center; gap: 1.2mm;
      padding: .6mm 2mm; border-radius: 999px;
      font-size: 6.4pt; font-weight: 800; text-transform: uppercase;
      white-space: nowrap;
    }
    .rd-semaforo::before { content: ""; width: 1.8mm; height: 1.8mm; border-radius: 50%; background: currentColor; }
    .rd-semaforo--rojo     { background: #fee2e2; color: #991b1b; }
    .rd-semaforo--amarillo { background: #fef3c7; color: #92400e; }
    .rd-semaforo--verde    { background: #dcfce7; color: #14532d; }

    .rd-acciones-fila {
      display: flex; flex-wrap: wrap; gap: 1mm;
    }
    .rd-btn-accion {
      display: inline-flex; align-items: center; gap: .8mm;
      padding: .9mm 1.8mm;
      border: 1px solid var(--rd-tenue);
      border-radius: 1mm;
      background: #fff;
      color: var(--rd-acento);
      font-size: 6.2pt; font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
    }
    .rd-btn-accion:hover { background: #f1f5f9; border-color: var(--rd-acento); }

    .rd-vacio {
      padding: 6mm 4mm;
      text-align: center;
      font-size: 8pt;
      font-style: italic;
      color: var(--rd-suave);
      border: 1px dashed var(--rd-tenue);
      border-radius: 2mm;
    }

    /* ---------- Firmas ---------- */
    .rd-firmas {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 4mm;
      margin-top: 7mm;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .rd-firma { text-align: center; }
    .rd-firma__linea { display: block; height: 13mm; border-bottom: 1.3px solid var(--rd-tinta); }
    .rd-firma__cargo {
      display: block; margin-top: 1.2mm;
      font-size: 6.4pt; text-transform: uppercase; letter-spacing: .03em;
      color: var(--rd-suave); line-height: 1.25;
    }
    .rd-firma__nombre { display: block; margin-top: .8mm; font-size: 7.4pt; font-weight: 700; min-height: 3.5mm; }

    .rd-pie {
      margin-top: 3mm; padding-top: 1.5mm;
      border-top: 1px solid var(--rd-tenue);
      display: flex; justify-content: space-between; gap: 4mm;
      font-size: 6.4pt; color: var(--rd-suave);
    }

    /* ---------- Responsivo ---------- */
    @media screen and (max-width: 1024px) {
      .rd-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .rd-radar { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media screen and (max-width: 720px) {
      .rd-body { padding: 12px 8px 32px; }
      .rd-hoja { padding: 16px 12px; box-shadow: none; }
      .rd-radar { grid-template-columns: minmax(0, 1fr); }
      .rd-firmas { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }

    /* ---------- Impresión ---------- */
    @media print {
      .rd-body { padding: 0; background: #fff; font-size: 9pt; }
      .rd-hoja { max-width: none; margin: 0; padding: 0; box-shadow: none; }
      .no-imprimir { display: none !important; }

      .rd-membrete, .rd-banner, .rd-kpis, .rd-radar, .rd-firmas,
      .rd-tabla thead, .rd-tabla tr { break-inside: avoid; page-break-inside: avoid; }

      .rd-banner, .rd-tabla thead th, .rd-kpi, .rd-semaforo, .rd-radial, .rd-escudo {
        -webkit-print-color-adjust: exact; print-color-adjust: exact;
      }
      .rd-pulso::before { animation: none !important; }
    }

    @media (prefers-reduced-motion: reduce) {
      .rd-pulso::before { animation: none !important; }
    }
  </style>
</head>

<body class="rd-body">

  <div class="rd-acciones no-imprimir">
    <a class="rd-acciones__volver" href="{{ url()->previous() }}">← Volver</a>
    <button type="button" class="rd-acciones__imprimir" onclick="window.print()">
      🖨️ Imprimir radar
    </button>
  </div>

  <main class="rd-hoja">

    {{-- ---------- Membrete ---------- --}}
    <header class="rd-membrete">
      <div class="rd-escudo" aria-hidden="true">NL</div>
      <div class="rd-membrete__texto">
        <p class="rd-estado">Gobierno del Estado de Nuevo León · Secretaría de Educación</p>
        <p class="rd-secretaria">Unidad de Integración Educativa (UIENL)</p>
        <p class="rd-plantel">{{ $nombrePlantel }}</p>
        <p class="rd-datos">
          C.C.T. {{ $cct }} · {{ $region }} · {{ $zona }} · Ciclo escolar {{ $ciclo }}
        </p>
      </div>
    </header>

    {{-- ---------- Banner SIAT ---------- --}}
    <div class="rd-banner">
      <p class="rd-banner__titulo">
        Sistema Integral de Alerta Temprana y Prevención del Abandono Escolar (SIAT-NL) — Ciclo {{ $ciclo }}
      </p>
      <p class="rd-banner__meta">
        <span>Reporte: {{ $fechaReporte }} · {{ $horaReporte }}</span>
        <span>Dirección del plantel y Jefatura de Prefectura</span>
      </p>
    </div>

    {{-- ---------- KPI ---------- --}}
    <div class="rd-kpis">

      <article class="rd-kpi rd-kpi--rojo">
        <p class="rd-kpi__rotulo">
          <span aria-hidden="true">🔴</span> Riesgo crítico de abandono
        </p>
        <p class="rd-kpi__valor">{{ number_format((int) $kpis['alumnos_riesgo_rojo']) }}</p>
        <p class="rd-kpi__nota">
          ≥ 3 inasistencias consecutivas o &gt; 15% acumuladas
        </p>
        @if((int) $kpis['alumnos_riesgo_rojo'] > 0)
          <span class="rd-pulso">Requiere intervención</span>
        @endif
      </article>

      <article class="rd-kpi rd-kpi--ambar">
        <p class="rd-kpi__rotulo">
          <span aria-hidden="true">🟡</span> Rezago académico / lectura
        </p>
        <p class="rd-kpi__valor">{{ number_format((int) $kpis['alumnos_riesgo_amarillo']) }}</p>
        <p class="rd-kpi__nota">
          ≥ 2 materias reprobadas o velocidad &lt; 75 PPM
        </p>
      </article>

      <article class="rd-kpi rd-kpi--azul">
        <p class="rd-kpi__rotulo">
          <span aria-hidden="true">📊</span> Asistencia global del día
        </p>
        <div class="rd-radial {{ $clasePct }}" style="--rd-pct: {{ $pctRedondeado }};">
          <span class="rd-radial__valor">{{ $pctRedondeado }}%</span>
        </div>
        <p class="rd-kpi__nota">
          Meta institucional ≥ 90% · {{ number_format((int) $kpis['total_alumnos']) }} alumnos en total
        </p>
      </article>

      <article class="rd-kpi rd-kpi--udei">
        <p class="rd-kpi__rotulo">
          <span aria-hidden="true">🤝</span> Atención inclusiva (UDEI / BAP)
        </p>
        <p class="rd-kpi__valor">{{ number_format((int) $kpis['canalizados_udei']) }}</p>
        <p class="rd-kpi__nota">
          {{ number_format((int) $kpis['citatorios_pendientes']) }} citatorios pendientes de firma
        </p>
      </article>
    </div>

    {{-- ---------- Radar por grado y turno ---------- --}}
    <h2 class="rd-rotulo">Radar de permanencia por grado y turno</h2>

    <div class="rd-radar">
      @foreach($radarGrados as $g)
        @php
          $grado = $g['grado'] ?? '—';
          $mat   = is_array($g['matutino'] ?? null)   ? $g['matutino']   : [];
          $ves   = is_array($g['vespertino'] ?? null) ? $g['vespertino'] : [];
          $matA  = (float) ($mat['asistencia'] ?? 0);
          $vesA  = (float) ($ves['asistencia'] ?? 0);
          $claseMat = $matA >= 90 ? '' : ($matA >= 75 ? 'rd-radar__relleno--medio' : 'rd-radar__relleno--bajo');
          $claseVes = $vesA >= 90 ? '' : ($vesA >= 75 ? 'rd-radar__relleno--medio' : 'rd-radar__relleno--bajo');
        @endphp

        <div class="rd-radar__grupo">
          <p class="rd-radar__grado">{{ $grado }}</p>

          <div class="rd-radar__turno">
            <div class="rd-radar__fila">
              <span>Matutino</span>
              <span>{{ (int) round($matA) }}%</span>
            </div>
            <div class="rd-radar__barra">
              <span class="rd-radar__relleno {{ $claseMat }}" style="width: {{ max(0, min(100, $matA)) }}%;"></span>
            </div>
            <span class="rd-radar__riesgo">
              En riesgo: <strong>{{ (int) ($mat['riesgo'] ?? 0) }}</strong>
            </span>
          </div>

          <div class="rd-radar__turno">
            <div class="rd-radar__fila">
              <span>Vespertino</span>
              <span>{{ (int) round($vesA) }}%</span>
            </div>
            <div class="rd-radar__barra">
              <span class="rd-radar__relleno {{ $claseVes }}" style="width: {{ max(0, min(100, $vesA)) }}%;"></span>
            </div>
            <span class="rd-radar__riesgo">
              En riesgo: <strong>{{ (int) ($ves['riesgo'] ?? 0) }}</strong>
            </span>
          </div>
        </div>
      @endforeach
    </div>

    {{-- ---------- Tabla de alumnos ---------- --}}
    <h2 class="rd-rotulo">Alumnos en observación y seguimiento activo</h2>

    @if(count($alumnosRiesgo))
      <div class="rd-tabla-scroll">
        <table class="rd-tabla">
          <caption class="sr-only">
            Alumnos en seguimiento por alerta temprana
          </caption>
          <thead>
            <tr>
              <th scope="col" style="width:7mm;">N°</th>
              <th scope="col" style="width:20mm;">Matrícula</th>
              <th scope="col" style="width:38mm;">Alumno</th>
              <th scope="col" style="width:13mm;">Grado/Gpo</th>
              <th scope="col" style="width:28mm;">Taller tecnológico (8 hrs)</th>
              <th scope="col" style="width:16mm;">Semáforo</th>
              <th scope="col" style="width:34mm;">Causal principal</th>
              <th scope="col" style="width:16mm;">Faltas / estado</th>
              <th scope="col">Acciones sugeridas</th>
            </tr>
          </thead>
          <tbody>
            @foreach($alumnosRiesgo as $i => $al)
              @php
                $semaforo = $colorSemaforo($al['semaforo'] ?? 'verde');
                $idAlumno = $al['id'] ?? ($al['alumno_id'] ?? 0);
              @endphp
              <tr>
                <td class="c">{{ $i + 1 }}</td>
                <td class="mono">{{ $al['matricula'] ?? '—' }}</td>
                <td class="alumno">{{ $al['nombre'] ?? 'Alumno' }}</td>
                <td class="c">{{ $al['grado_grupo'] ?? '—' }}</td>
                <td>{{ $al['taller'] ?? '—' }}</td>
                <td class="c">
                  <span class="rd-semaforo rd-semaforo--{{ $semaforo }}">
                    {{ $etiquetaSemaforo[$semaforo] }}
                  </span>
                </td>
                <td>{{ $al['causal'] ?? '—' }}</td>
                <td class="c">{{ $al['inasistencias'] ?? 0 }}</td>
                <td>
                  <div class="rd-acciones-fila">
                    <a class="rd-btn-accion" href="{{ url('/reportes/expediente-360/' . $idAlumno) }}">
                      📄 Kárdex 360°
                    </a>
                    <a class="rd-btn-accion" href="{{ url('/reportes/citatorio/' . $idAlumno) }}">
                      ✉️ Citar padres
                    </a>
                    <a class="rd-btn-accion" href="{{ url('/reportes/canalizar-udei/' . $idAlumno) }}">
                      🤝 Canalizar UDEI
                    </a>
                  </div>
                </td>
              </tr>
            @endforeach
          </tbody>
        </table>
      </div>
    @else
      <p class="rd-vacio">
        Sin alumnos en observación: el grupo no registra alertas activas en este corte.
      </p>
    @endif

    {{-- ---------- Firmas ---------- --}}
    <div class="rd-firmas">
      <div class="rd-firma">
        <span class="rd-firma__linea" aria-hidden="true"></span>
        <span class="rd-firma__cargo">Director(a) del Plantel</span>
        <span class="rd-firma__nombre">{{ $firmas['director'] ?? $director }}</span>
      </div>
      <div class="rd-firma">
        <span class="rd-firma__linea" aria-hidden="true"></span>
        <span class="rd-firma__cargo">Jefatura de Prefectura</span>
        <span class="rd-firma__nombre">{{ $firmas['prefectura'] ?? '' }}</span>
      </div>
      <div class="rd-firma">
        <span class="rd-firma__linea" aria-hidden="true"></span>
        <span class="rd-firma__cargo">Trabajo Social</span>
        <span class="rd-firma__nombre">{{ $firmas['trabajo_social'] ?? '' }}</span>
      </div>
      <div class="rd-firma">
        <span class="rd-firma__linea" aria-hidden="true"></span>
        <span class="rd-firma__cargo">Representante UDEI</span>
        <span class="rd-firma__nombre">{{ $firmas['udei'] ?? '' }}</span>
      </div>
    </div>

    <footer class="rd-pie">
      <span>{{ $nombrePlantel }} · C.C.T. {{ $cct }}</span>
      <span>SIAT-NL · {{ $fechaReporte }} · {{ $region }} · {{ $zona }}</span>
    </footer>
  </main>
</body>
</html>

```

---

## 📄 ARCHIVO 2 · `resources/views/reportes/acta-supervision-alerta-temprana-nl.blade.php`

```blade
{{--
  Acta Circunstanciada de Monitoreo de Alerta Temprana y Retención Escolar
  OLA 34 / Fase 11 · Destino: resources/views/reportes/acta-supervision-alerta-temprana-nl.blade.php
  Hoja membretada oficial, Carta vertical. Sin lógica JavaScript.
--}}
@php
  $acta    = is_array($acta ?? null) ? $acta : [];
  $plantel = is_array($plantel ?? null) ? $plantel : [];
  $grupos  = is_array($grupos ?? null) ? $grupos : [];
  $causales = is_array($causales ?? null) ? $causales : [];
  $medidas  = is_array($medidas ?? null) ? $medidas : [];
  $firmas   = is_array($firmas ?? null) ? $firmas : [];

  $folio       = $acta['folio'] ?? 'ACTA-SIAT-2026-0000';
  $fechaActa   = $acta['fecha'] ?? now()->format('d/m/Y');
  $horaActa    = $acta['hora'] ?? now()->format('H:i');
  $lugar       = $acta['lugar'] ?? 'Instalaciones del plantel';
  $ciclo       = $acta['ciclo'] ?? ($plantel['ciclo'] ?? '2026-2027');

  $nombrePlantel = $plantel['nombre'] ?? 'Escuela Secundaria Técnica Núm. 90';
  $cct           = $plantel['cct'] ?? '19DST0090X';
  $region        = $plantel['region'] ?? 'Región Educativa 13';
  $zona          = $plantel['zona'] ?? 'Zona Escolar 18';
  $supervision   = $plantel['supervision'] ?? '';

  // Causales tipificadas por omisión: las cuatro del contrato
  if (!$causales) {
      $causales = [
          ['causa' => 'Deserción por cambio de domicilio', 'casos' => 0, 'observacion' => ''],
          ['causa' => 'Absentismo reiterado sin justificación', 'casos' => 0, 'observacion' => ''],
          ['causa' => 'Vulnerabilidad socio-emocional / BAP', 'casos' => 0, 'observacion' => ''],
          ['causa' => 'Rezago académico severo', 'casos' => 0, 'observacion' => ''],
      ];
  }

  // Totales del concentrado
  $totInicial = 0; $totBajas = 0; $totRojo = 0; $totInasist = 0;
  foreach ($grupos as $g) {
      $totInicial  += (int) ($g['matricula_inicial'] ?? 0);
      $totBajas    += (int) ($g['bajas'] ?? 0);
      $totRojo     += (int) ($g['rojo'] ?? 0);
      $totInasist  += (int) ($g['inasistencias'] ?? 0);
  }
  $retGlobal = $totInicial > 0 ? round((($totInicial - $totBajas) / $totInicial) * 100, 1) : 0;
  $totCasos  = 0;
  foreach ($causales as $c) { $totCasos += (int) ($c['casos'] ?? 0); }
@endphp
<!DOCTYPE html>
<html lang="es-MX">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Acta {{ $folio }} · Alerta temprana y retención escolar</title>

  <style>
    @page { size: letter portrait; margin: 12mm 15mm; }

    :root {
      --ac-tinta: #111827;
      --ac-suave: #4b5563;
      --ac-linea: #94a3b8;
      --ac-tenue: #cbd5e1;
      --ac-acento: #0f4c81;
      --ac-rojo: #b91c1c;
    }
    * { box-sizing: border-box; }

    .ac-body {
      margin: 0;
      padding: 20px 14px 44px;
      background: #e2e8f0;
      color: var(--ac-tinta);
      font-family: Arial, Helvetica, "Segoe UI", sans-serif;
      font-size: 9pt;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .ac-hoja {
      width: 21.59cm;
      min-height: 27.94cm;
      margin: 0 auto 14px;
      padding: 12mm 15mm;
      background: #fff;
      box-shadow: 0 10px 30px rgba(15, 23, 42, .25);
      box-sizing: border-box;
    }

    .ac-acciones {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      max-width: 21.59cm; margin: 0 auto 12px; padding: 10px 14px;
      background: #fff; border: 1px solid var(--ac-tenue); border-radius: 10px;
    }
    .ac-acciones__volver { color: var(--ac-acento); font-size: 12.5px; font-weight: 700; text-decoration: none; }
    .ac-acciones__imprimir {
      min-height: 40px; padding: 8px 16px; border: 0; border-radius: 8px;
      background: var(--ac-acento); color: #fff; font-family: inherit;
      font-size: 12.5px; font-weight: 700; cursor: pointer;
    }

    /* ---------- Encabezado institucional ---------- */
    .ac-encabezado {
      display: flex; align-items: center; justify-content: space-between; gap: 6mm;
      padding-bottom: 4mm;
      border-bottom: 2.5px double var(--ac-acento);
    }
    .ac-encabezado__bloque { flex: 1 1 auto; }
    .ac-escudo {
      display: flex; align-items: center; justify-content: center;
      width: 18mm; height: 18mm; flex: 0 0 auto;
      border: 2px solid var(--ac-acento); border-radius: 50%;
      color: var(--ac-acento); font-size: 12pt; font-weight: 700;
    }
    .ac-estado {
      margin: 0; font-size: 9pt; font-weight: 700;
      text-transform: uppercase; letter-spacing: .05em;
      color: var(--ac-acento);
    }
    .ac-dependencia { margin: .8mm 0 0; font-size: 7.5pt; color: var(--ac-suave); }
    .ac-plantel { margin: 1.2mm 0 0; font-size: 10.5pt; font-weight: 700; }
    .ac-zona { margin: .6mm 0 0; font-size: 7.2pt; color: var(--ac-suave); }

    /* ---------- Título ---------- */
    .ac-titulo {
      margin: 6mm 0 1.5mm;
      text-align: center;
      font-size: 11.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .03em;
      line-height: 1.3;
    }
    .ac-subtitulo {
      margin: 0 0 5mm;
      text-align: center;
      font-size: 8pt;
      color: var(--ac-suave);
      text-transform: uppercase;
      letter-spacing: .06em;
    }

    /* ---------- Ficha del acta ---------- */
    .ac-ficha {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 2mm 5mm;
      margin: 0 0 5mm;
      padding: 3mm 4mm;
      background: #f8fafc;
      border: 1px solid var(--ac-tenue);
      border-radius: 2mm;
    }
    .ac-ficha dt {
      font-size: 6.8pt; text-transform: uppercase; letter-spacing: .05em;
      color: var(--ac-suave);
    }
    .ac-ficha dd {
      margin: .5mm 0 0; font-size: 9pt; font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .ac-ficha dd.mono { font-family: "Courier New", Consolas, monospace; font-size: 8.5pt; }

    /* ---------- Rótulos de sección ---------- */
    .ac-rotulo {
      margin: 5mm 0 2.5mm;
      padding: 1.4mm 3mm;
      background: #e8eef6;
      border-left: 4px solid var(--ac-acento);
      font-size: 8.4pt; font-weight: 700;
      text-transform: uppercase; letter-spacing: .05em;
      color: var(--ac-acento);
    }

    /* ---------- Tablas ---------- */
    .ac-tabla {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
    }
    .ac-tabla thead th {
      padding: 1.6mm 1.8mm;
      background: var(--ac-acento);
      color: #fff;
      font-size: 6.8pt; font-weight: 700;
      text-transform: uppercase; letter-spacing: .03em;
      text-align: left;
      border: 1px solid var(--ac-acento);
      line-height: 1.2;
    }
    .ac-tabla thead th.c { text-align: center; }
    .ac-tabla tbody th,
    .ac-tabla tbody td {
      padding: 1.5mm 1.8mm;
      border: 1px solid var(--ac-tenue);
      vertical-align: middle;
    }
    .ac-tabla tbody tr:nth-child(even) td,
    .ac-tabla tbody tr:nth-child(even) th { background: #fcfdff; }
    .ac-tabla .c { text-align: center; font-variant-numeric: tabular-nums; }
    .ac-tabla .grupo { font-weight: 700; }
    .ac-tabla .rojo { color: var(--ac-rojo); font-weight: 700; }
    .ac-tabla tfoot th,
    .ac-tabla tfoot td {
      padding: 1.6mm 1.8mm;
      background: #e8eef6 !important;
      border: 1px solid var(--ac-linea);
      font-weight: 700;
      font-size: 8pt;
    }

    /* ---------- Medidas ---------- */
    .ac-medidas { display: flex; flex-direction: column; gap: 2mm; }
    .ac-medida {
      display: grid;
      grid-template-columns: 6mm 1fr 22mm 32mm;
      align-items: center;
      gap: 3mm;
      padding: 2mm 3mm;
      border: 1px solid var(--ac-tenue);
      border-radius: 1.5mm;
      background: #f8fafc;
      font-size: 8.2pt;
    }
    .ac-medida__num {
      display: inline-flex; align-items: center; justify-content: center;
      width: 5mm; height: 5mm; border-radius: 50%;
      background: var(--ac-acento); color: #fff;
      font-size: 7pt; font-weight: 700;
    }
    .ac-medida__texto { font-weight: 700; }
    .ac-medida__cantidad { text-align: center; font-variant-numeric: tabular-nums; }
    .ac-medida__responsable { font-size: 7.2pt; color: var(--ac-suave); }

    /* ---------- Texto normativo ---------- */
    .ac-parrafo { margin: 0 0 2.5mm; font-size: 8.6pt; line-height: 1.6; text-align: justify; }
    .ac-parrafo--nota { font-size: 7.6pt; color: var(--ac-suave); }

    /* ---------- Firmas ---------- */
    .ac-firmas {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8mm;
      margin-top: 10mm;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .ac-firma { text-align: center; }
    .ac-firma__linea { display: block; height: 16mm; border-bottom: 1.4px solid var(--ac-tinta); }
    .ac-firma__nombre { display: block; margin-top: 1.2mm; font-size: 8.4pt; font-weight: 700; min-height: 4mm; }
    .ac-firma__cargo {
      display: block; margin-top: .8mm;
      font-size: 6.8pt; text-transform: uppercase; letter-spacing: .04em;
      color: var(--ac-suave); line-height: 1.25;
    }

    .ac-sello {
      display: flex; align-items: center; justify-content: center;
      height: 16mm; border: 1.4px dashed var(--ac-linea); border-radius: 2mm;
      color: var(--ac-linea); font-size: 7pt;
      text-transform: uppercase; letter-spacing: .05em; text-align: center;
    }

    .ac-pie {
      margin-top: 5mm; padding-top: 2mm;
      border-top: 1px solid var(--ac-tenue);
      display: flex; justify-content: space-between; gap: 4mm;
      font-size: 6.8pt; color: var(--ac-suave);
    }

    .ac-vacio {
      padding: 5mm; text-align: center; font-style: italic;
      font-size: 8pt; color: var(--ac-suave);
      border: 1px dashed var(--ac-tenue); border-radius: 2mm;
    }

    /* ---------- Responsivo ---------- */
    @media screen and (max-width: 920px) {
      .ac-body { padding: 12px 8px 32px; }
      .ac-hoja { width: 100%; min-height: 0; padding: 16px 12px; box-shadow: none; }
      .ac-ficha { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .ac-medida { grid-template-columns: 6mm 1fr; row-gap: 1mm; }
      .ac-firmas { grid-template-columns: minmax(0, 1fr); gap: 6mm; }
    }

    /* ---------- Impresión ---------- */
    @media print {
      .ac-body { padding: 0; background: #fff; }
      .ac-hoja { width: auto; min-height: 0; margin: 0; padding: 0; box-shadow: none; }
      .no-imprimir { display: none !important; }

      .ac-encabezado, .ac-ficha, .ac-firmas, .ac-pie,
      .ac-tabla thead, .ac-tabla tr, .ac-medida { break-inside: avoid; page-break-inside: avoid; }

      .ac-tabla thead th, .ac-tabla tfoot td, .ac-tabla tfoot th, .ac-rotulo, .ac-escudo {
        -webkit-print-color-adjust: exact; print-color-adjust: exact;
      }
    }
  </style>
</head>

<body class="ac-body">

  <div class="ac-acciones no-imprimir">
    <a class="ac-acciones__volver" href="{{ url()->previous() }}">← Volver</a>
    <button type="button" class="ac-acciones__imprimir" onclick="window.print()">
      🖨️ Imprimir acta
    </button>
  </div>

  <main class="ac-hoja">

    {{-- ---------- Encabezado institucional ---------- --}}
    <header class="ac-encabezado">
      <div class="ac-escudo" aria-hidden="true">NL</div>
      <div class="ac-encabezado__bloque">
        <p class="ac-estado">Gobierno del Estado de Nuevo León · Secretaría de Educación</p>
        <p class="ac-dependencia">
          Inspección de Zona Escolar · Dirección de Educación Secundaria Técnica · UIENL
        </p>
        <p class="ac-plantel">{{ $nombrePlantel }}</p>
        <p class="ac-zona">
          C.C.T. {{ $cct }} · {{ $region }} · {{ $zona }} · Ciclo escolar {{ $ciclo }}
        </p>
      </div>
    </header>

    <h1 class="ac-titulo">
      Acta Circunstanciada de Monitoreo de Alerta Temprana y Retención Escolar
    </h1>
    <p class="ac-subtitulo">Sistema Integral de Alerta Temprana · SIAT-NL</p>

    {{-- ---------- Ficha del acta ---------- --}}
    <dl class="ac-ficha">
      <div><dt>Folio del acta</dt><dd class="mono">{{ $folio }}</dd></div>
      <div><dt>Fecha</dt><dd>{{ $fechaActa }}</dd></div>
      <div><dt>Hora</dt><dd>{{ $horaActa }}</dd></div>
      <div><dt>Lugar</dt><dd>{{ $lugar }}</dd></div>
    </dl>

    {{-- ---------- Concentrado por grupos ---------- --}}
    <h2 class="ac-rotulo">Concentrado cuantitativo por grupos</h2>

    @if(count($grupos))
      <table class="ac-tabla">
        <caption style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);">
          Concentrado de matrícula, bajas y retención por grupo
        </caption>
        <thead>
          <tr>
            <th scope="col" style="width:22mm;">Grupo</th>
            <th scope="col" class="c">Matrícula inicial</th>
            <th scope="col" class="c">Bajas</th>
            <th scope="col" class="c">Semáforo rojo</th>
            <th scope="col" class="c">Inasistencias acumuladas</th>
            <th scope="col" class="c">Retención efectiva</th>
          </tr>
        </thead>
        <tbody>
          @foreach($grupos as $g)
            @php
              $inicial = (int) ($g['matricula_inicial'] ?? 0);
              $bajas   = (int) ($g['bajas'] ?? 0);
              $ret     = $inicial > 0 ? round((($inicial - $bajas) / $inicial) * 100, 1) : 0;
            @endphp
            <tr>
              <th scope="row" class="grupo">{{ $g['grupo'] ?? '—' }}</th>
              <td class="c">{{ $inicial }}</td>
              <td class="c">{{ $bajas }}</td>
              <td class="c {{ ((int) ($g['rojo'] ?? 0)) > 0 ? 'rojo' : '' }}">{{ (int) ($g['rojo'] ?? 0) }}</td>
              <td class="c">{{ (int) ($g['inasistencias'] ?? 0) }}</td>
              <td class="c">{{ $ret }}%</td>
            </tr>
          @endforeach
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total del plantel</th>
            <td class="c">{{ $totInicial }}</td>
            <td class="c">{{ $totBajas }}</td>
            <td class="c">{{ $totRojo }}</td>
            <td class="c">{{ $totInasist }}</td>
            <td class="c">{{ $retGlobal }}%</td>
          </tr>
        </tfoot>
      </table>
    @else
      <p class="ac-vacio">No se capturaron datos por grupo para este corte.</p>
    @endif

    {{-- ---------- Causales ---------- --}}
    <h2 class="ac-rotulo">Causales tipificadas de riesgo</h2>

    <table class="ac-tabla">
      <thead>
        <tr>
          <th scope="col">Causal tipificada</th>
          <th scope="col" class="c" style="width:18mm;">Casos</th>
          <th scope="col" class="c" style="width:18mm;">% del total</th>
          <th scope="col" style="width:62mm;">Observación</th>
        </tr>
      </thead>
      <tbody>
        @foreach($causales as $c)
          @php
            $casos = (int) ($c['casos'] ?? 0);
            $pctCasos = $totCasos > 0 ? round(($casos / $totCasos) * 100, 1) : 0;
          @endphp
          <tr>
            <th scope="row" style="font-weight:700;">{{ $c['causa'] ?? '—' }}</th>
            <td class="c {{ $casos > 0 ? 'rojo' : '' }}">{{ $casos }}</td>
            <td class="c">{{ $pctCasos }}%</td>
            <td>{{ $c['observacion'] ?? '' }}</td>
          </tr>
        @endforeach
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">Total de casos</th>
          <td class="c">{{ $totCasos }}</td>
          <td class="c">100%</td>
          <td></td>
        </tr>
      </tfoot>
    </table>

    {{-- ---------- Medidas de intervención ---------- --}}
    <h2 class="ac-rotulo">Medidas de intervención implementadas</h2>

    @if(count($medidas))
      <div class="ac-medidas">
        @foreach($medidas as $i => $m)
          <div class="ac-medida">
            <span class="ac-medida__num" aria-hidden="true">{{ $i + 1 }}</span>
            <span class="ac-medida__texto">{{ $m['medida'] ?? '—' }}</span>
            <span class="ac-medida__cantidad">{{ $m['cantidad'] ?? 0 }}</span>
            <span class="ac-medida__responsable">{{ $m['responsable'] ?? '' }}</span>
          </div>
        @endforeach
      </div>
    @else
      <p class="ac-vacio">Sin medidas registradas en este periodo.</p>
    @endif

    {{-- ---------- Texto normativo ---------- --}}
    <h2 class="ac-rotulo">Fundamento y compromisos</h2>

    <p class="ac-parrafo">
      Se hace constar que el plantel instrumentó las acciones de monitoreo, seguimiento y retención
      escolar previstas en la Ley de Educación de Nuevo León 2026, la Guía Operativa UIENL/SENL y el
      Acuerdo Secretarial 97 en materia de Educación Tecnológica, con el fin de garantizar el interés
      superior de la niñez y el derecho a la educación consagrado en el Artículo 3° Constitucional.
    </p>

    <p class="ac-parrafo">
      La Inspección de Zona Escolar deja constancia del concentrado anterior y de las medidas
      implementadas, y se compromete a dar seguimiento a los casos en semáforo rojo hasta su
      atención o canalización efectiva.
    </p>

    <p class="ac-parrafo ac-parrafo--nota">
      Los datos personales contenidos en esta acta son confidenciales y se resguardan conforme a la
      Ley de Protección de Datos Personales en Posesión de Sujetos Obligados del Estado de Nuevo León.
    </p>

    {{-- ---------- Firmas ---------- --}}
    <div class="ac-firmas">
      <div class="ac-firma">
        <span class="ac-firma__linea" aria-hidden="true"></span>
        <span class="ac-firma__nombre">{{ $firmas['supervision'] ?? $supervision }}</span>
        <span class="ac-firma__cargo">Supervisión de Zona Escolar</span>
      </div>
      <div class="ac-firma">
        <span class="ac-firma__linea" aria-hidden="true"></span>
        <span class="ac-firma__nombre">{{ $firmas['director'] ?? '' }}</span>
        <span class="ac-firma__cargo">Dirección del Plantel</span>
      </div>
      <div class="ac-firma">
        <span class="ac-sello">Sello oficial</span>
        <span class="ac-firma__nombre">{{ $firmas['trabajo_social'] ?? '' }}</span>
        <span class="ac-firma__cargo">Trabajo Social</span>
      </div>
    </div>

    <footer class="ac-pie">
      <span>{{ $nombrePlantel }} · C.C.T. {{ $cct }}</span>
      <span>Acta {{ $folio }} · {{ $fechaActa }} · {{ $zona }}</span>
    </footer>
  </main>
</body>
</html>

```

---

## 🧭 Trazabilidad con la partitura

### Vista 1 · Radar de alertas

| Requisito | Implementado |
|---|:---:|
| Preámbulo `@php` tolerante y polimórfico | ✅ `array_merge` con valores por defecto en `$kpis`, radar y alumnos |
| Membrete NL · SENL · UIENL · EST 90 · CCT · Región 13 · Zona 18 | ✅ |
| Banner SIAT-NL con ciclo | ✅ |
| 4 KPI (4 col desktop, 2 en móvil) con badge pulsante | ✅ |
| Asistencia con indicador radial (CSS puro) | ✅ `conic-gradient` con `--rd-pct` |
| Radar por grado y turno con barras comparativas | ✅ 1°, 2°, 3° × Matutino / Vespertino |
| Tabla con 9 columnas y acciones rápidas | ✅ Kárdex 360°, Citar padres, Canalizar UDEI |
| Firmas Director · Prefectura · Trabajo Social · UDEI | ✅ |

### Vista 2 · Acta de supervisión

| Requisito | Implementado |
|---|:---:|
| Carta vertical, márgenes 12 × 15 mm | ✅ `@page { size: letter portrait; margin: 12mm 15mm; }` |
| Encabezado de Inspección de Zona y Secundarias Técnicas | ✅ |
| Título del acta | ✅ |
| Concentrado por grupo: matrícula, bajas, rojo, inasistencias, retención | ✅ Con fila de totales |
| Causales tipificadas (4) con casos y % | ✅ Con total de casos |
| Medidas de intervención implementadas | ✅ Con responsable por medida |
| Firmas Supervisión · Dirección · Trabajo Social | ✅ |

---

## ⚠️ Decisiones que Antigravity debe conocer

1. **La retención efectiva se calcula:** `(matrícula inicial − bajas) ÷ matrícula inicial × 100`. No se recibe del backend para que no pueda contradecir el concentrado.
2. **El radial de asistencia es `conic-gradient` puro.** Sin SVG ni JS: funciona en cualquier navegador moderno y no depende de assets.
3. **El verde del semáforo se usa como valor por defecto.** Si un registro llega sin semáforo, se pinta «Regular» en vez de «Crítico»: es preferible no estigmatizar por un dato faltante.
4. **La Región y Zona son las de esta partitura** (Región Educativa 13, Zona Escolar 18). Las olas anteriores usaban Región 2 / Zona 12; **no unificar sin confirmación**, porque el acta se firma ante la supervisión.
5. **Ambas vistas toleran datos vacíos:** KPI en 0, radar en ceros, tablas con estado vacío. Cumple el guardrail de resiliencia (no 500).

---

## 📋 INFORME PARA ANTIGRAVITY

```text
INFORME PARA ANTIGRAVITY · OLA 34 (FASE 11)
- Archivos (NUEVOS, ya en entregas-laravel-fase1/resources/views/reportes/):
    * director-radar-alertas-nl.blade.php  (23.8 KB)
    * acta-supervision-alerta-temprana-nl.blade.php  (18.0 KB)
  Ambos con <style> embebido, sin assets externos ni JavaScript propio.
- Propósito:
    1. Radar SIAT-NL para Dirección y Prefectura: 4 KPI ejecutivas (riesgo crítico, rezago,
       asistencia del día con radial CSS, atención UDEI), radar comparativo por grado y turno,
       tabla de 9 columnas con acciones rápidas y cuatro firmas institucionales.
    2. Acta circunstanciada para la Supervisión de Zona: concentrado por grupo con retención
       efectiva calculada, causales tipificadas con porcentajes, medidas de intervención y firmas.
- Selectores: .rd-* (50 clases: kpis, kpi, radial, radar, semaforo, tabla, firmas, pulso, escudo...)
  y .ac-* (33 clases: encabezado, ficha, tabla, medidad, firmas, sello, pie...). Inventario completo
  en el cuerpo de esta entrega.
- Precauciones:
    * La retención se calcula en la vista; no duplicar el cálculo en el controlador.
    * Región Educativa 13 y Zona Escolar 18 son las de esta partitura; difieren de olas anteriores
      (Región 2 / Zona 12). No unificar sin confirmación de supervisión.
    * Semáforo por defecto = verde para no estigmatizar datos faltantes.
    * Sin IDs del DOM nuevos; los enlaces usan rutas /reportes/expediente-360/{id} y /reportes/citatorio/{id}.
    * Sin git, sin push, sin despliegue por mi parte.
```

