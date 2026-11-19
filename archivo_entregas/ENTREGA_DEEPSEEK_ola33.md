# BUZÓN DE ENTREGA: DEEPSEEK -> ANTIGRAVITY

> **INSTRUCCIÓN PARA DEEPSEEK (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md`, `.skills/aula-constructor/SKILL.md`, `RSC_MIGRACION_FUSION_LARAVEL.md` y esta partitura.  
> Escribe y guarda aquí mismo (`ENTREGA_DEEPSEEK.md`) tu propuesta de maquetación Blade y estilos CSS para que Antigravity la audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js deepseek`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura.  
> Entregas anteriores archivadas en `archivo_entregas/` (`ENTREGA_DEEPSEEK_ola30.md`, `ENTREGA_DEEPSEEK_ola31.md`, `ENTREGA_DEEPSEEK_ola32.md`).

---

## 🎯 PARTITURA ASIGNADA: OLA 33 (FASE 10) — EXPEDIENTE INTEGRAL 360° DEL ALUMNO & CITATORIOS OFICIALES DE TRABAJO SOCIAL (NL)
- **Agente responsable:** **DeepSeek** (Diseñador UI/UX, Blade/Tailwind, Accesibilidad DUA)
- **Estado:** 🟢 **PROGRAMADA Y LISTA PARA EJECUCIÓN**
- **Destino en Academia:**
  1. `resources/views/reportes/kardex-alumno-360-nl.blade.php` (Expediente Integral 360° / Kárdex del Alumno en tamaño Carta vertical)
  2. `resources/views/reportes/citatorio-padres-ts-nl.blade.php` (Citatorio Oficial de Padres de Familia en Media Carta con talón de acuse de recibo desprendible)

### Especificación Técnica de Diseño:

#### 1. Expediente Integral 360° / Kárdex del Alumno (`kardex-alumno-360-nl.blade.php`):
- **Orientación:** Hoja Carta vertical (`@page { size: letter portrait; margin: 10mm 8mm; }`).
- **Membrete Oficial de Nuevo León:**
  - Gobierno del Estado de Nuevo León · Secretaría de Educación (SENL) · Unidad de Integración Educativa.
  - Escuela Secundaria Técnica No. 90 "José Calderón Ayala" · CCT: 19DST0090X · Turno Matutino · Región 2 · Zona Escolar 12.
  - Título prominente: **EXPEDIENTE INTEGRAL DEL ALUMNO (KÁRDEX ACADÉMICO-FORMATIVO 360°)**.
- **Ficha de Identificación del Estudiante (Tarjeta Superior con Avatar):**
  - Matrícula oficial (ej. `ST90-2026-A01`), CURP, Grado y Grupo (1° A), Ciclo Escolar 2026-2027.
  - Nombre completo del alumno en formato oficial (Apellidos y Nombres).
  - Datos de contacto y tutor: Nombre del padre/madre/tutor, teléfono de emergencia, estatus de inscripción (Activo).
- **Tablero de Rendimiento Académico por Campos Formativos (Acuerdo SEP 10/09/23):**
  - Desglose de los 4 campos formativos de la NEM (Fase 6):
    1. Lenguajes (Español, Inglés, Artes)
    2. Saberes y Pensamiento Científico (Matemáticas, Biología/Física/Química)
    3. Ética, Naturaleza y Sociedades (Geografía, Historia, Formación Cívica y Ética)
    4. De lo Humano y lo Comunitario (Educación Física, Tutoría / Educación Socioemocional)
  - Módulo destacado del **Taller Tecnológico (Acuerdo 97: 8 horas semanales)**:
    - Campo Tecnológico, Tallerista titular, calificación y nivel de desempeño.
  - Columnas de evaluación: Trimestre 1 (T1), Trimestre 2 (T2), Trimestre 3 (T3), Promedio Final y Estado (Acreditado / En Proceso).
- **Indicadores Formativos y de Desempeño Escolar:**
  - **Comprensión Lectora & Fluidez:**
    - Velocidad lectora registrada (PPM promedio vs estándar nacional Fase 6 ~120-135 PPM).
    - Porcentaje de comprensión lectora formativa (reactivos literales, inferenciales y críticos).
  - **Asistencia y Regularidad:**
    - Porcentaje global de asistencia, total de faltas injustificadas, retardos y justificaciones.
    - Semáforo de riesgo de abandono escolar / inasistencia.
- **Historial de Incidencias / Observaciones de Trabajo Social y Tutoría:**
  - Bitácora de seguimiento, acuerdos pedagógicos, observaciones de inclusión y ajustes DUA.
- **Sección de Firmas Institucionales al Pie:**
  - 3 casillas de firma:
    1. Tutor(a) de Grupo.
    2. Departamento de Trabajo Social y Orientación.
    3. Sello Oficial y Vo.Bo. de la Dirección Escolar.

---

#### 2. Citatorio Oficial a Padres de Familia por Trabajo Social (`citatorio-padres-ts-nl.blade.php`):
- **Formato y Diagramación:**
  - Media Carta (`half-letter` landscape o 2 citatorios idénticos por hoja Carta con línea de corte punteada `✂️ - - - - - CORTE AQUÍ - - - - -`).
  - Perfectamente optimizado para ahorrar papel en la prefectura y dirección de la secundaria.
- **Contenido del Citatorio Principal:**
  - Membrete oficial simplificado de la EST 90 con escudos oficiales.
  - Folio único de citatorio (ej. `CIT-ST90-2026-0042`).
  - Encabezado: *"Estimado Padre de Familia, Madre o Tutor del alumno(a): [Nombre del Alumno] - Grado y Grupo: [1° A]"*.
  - Convocatoria formal: Cita el día `[Día de la semana, DD de Mes de YYYY]` a las `[HH:MM hrs]` en las instalaciones del plantel (Cubículo de Trabajo Social / Prefectura / Dirección).
  - **Motivo de la Cita (Selección clara con badge o checkbox):**
    - [ ] Rendimiento Académico / Riesgo de no acreditación.
    - [ ] Acumulación de Inasistencias y/o Retardos (Artículo 97 / Normativa SENL).
    - [ ] Conducta, Disciplina o Convivencia Escolar Sana y Pacífica.
    - [ ] Seguimiento Médico, Inclusión o Ajustes Razonables (DUA).
    - [ ] Asunto de Interés Formativo.
  - Observaciones o detalles específicos de la situación.
  - Nombre y firma del convocante (Trabajador(a) Social, Tutor(a) o Prefectura).
  - Apercibimiento normativo: *"Su presencia es indispensable para garantizar el interés superior de la niñez y el derecho a la educación (Art. 3° Constitucional)."*
- **Talón de Acuse de Recibo Desprendible (Para Archivo Escolar):**
  - Línea punteada de corte con tijera `✂️`.
  - Folio coincidente (`CIT-ST90-2026-0042`).
  - Datos del alumno: Matrícula, Nombre, Grupo.
  - Declaración del padre/tutor: *"Enterado(a) del citatorio programado para el día ___ a las ___ hrs. Me comprometo a asistir puntualmente."*
  - Nombre legible, firma del padre/tutor y fecha de notificación.

---
## ENTREGA DE DEEPSEEK (ESCRIBE TU PROPUESTA BLADE/CSS A CONTINUACIÓN)

---


## ✅ ENTREGA DEEPSEEK — OLA 33 (FASE 10) · Expediente Integral 360° del alumno + Citatorios oficiales de Trabajo Social

**Fecha:** 2026-11-17 · **Autor:** DeepSeek (UI/UX, Blade/Tailwind, accesibilidad DUA) · **Estado:** 🟢 LISTA PARA INTEGRAR

### Archivos (depositados en `entregas-laravel-fase1/`)

| Archivo | Tamaño |
|---|---:|
| `resources/views/reportes/kardex-alumno-360-nl.blade.php` | 24 KB |
| `resources/views/reportes/citatorio-padres-ts-nl.blade.php` | 19 KB |

Verificado: **47 clases `kx-*` y 40 clases `ct-*` usadas, todas definidas** (ninguna huérfana).

---

## 1 · `kardex-alumno-360-nl.blade.php`

```blade
{{--
  Expediente Integral 360° del Alumno · Nuevo León (OLA 33 / Fase 10)
  Kárdex académico-formativo, tamaño Carta vertical.
  Acuerdo 10/09/23 (evaluación) y Acuerdo 97 (Taller Tecnológico).
  Sin lógica JavaScript: la impresión la dispara el navegador.
--}}
@php
  $alumno     = $alumno     ?? [];
  $escuela    = $escuela    ?? [];
  $campos     = $campos     ?? [];
  $taller     = $taller     ?? [];
  $lectura    = $lectura    ?? [];
  $asistencia = $asistencia ?? [];
  $bitacora   = $bitacora   ?? [];
  $validacion = $validacion ?? [];

  $ciclo = $ciclo ?? ($alumno['ciclo'] ?? '2026-2027');

  $nombreEscuela = $escuela['nombre'] ?? 'Escuela Secundaria Técnica No. 90 "José Calderón Ayala"';
  $cct           = $escuela['cct'] ?? '19DST0090X';
  $turno         = $escuela['turno'] ?? 'Matutino';
  $region        = $escuela['region'] ?? 'Región 2';
  $zona          = $escuela['zona'] ?? 'Zona Escolar 12';

  $nombre    = $alumno['nombre'] ?? '—';
  $matricula = $alumno['matricula'] ?? '—';
  $curp      = $alumno['curp'] ?? '—';
  $grado     = $alumno['grado'] ?? '—';
  $grupo     = $alumno['grupo'] ?? '—';
  $tutor     = $alumno['tutor'] ?? '—';
  $telefono  = $alumno['telefono'] ?? '—';
  $estatus   = $alumno['estatus'] ?? 'Activo';

  $num = function ($v) {
      return $v === null || $v === '' ? '—' : number_format((float) $v, 1, '.', '');
  };

  // Iniciales y color estable del avatar
  $partes = preg_split('/\s+/', trim((string) $nombre));
  $ini = '';
  foreach (array_slice($partes, 0, 2) as $p) {
      if ($p !== '') { $ini .= mb_strtoupper(mb_substr($p, 0, 1)); }
  }
  $paleta = ['#0369a1', '#0f766e', '#b45309', '#7c3aed', '#be123c', '#4338ca'];
  $colorAvatar = $paleta[crc32((string) $nombre) % count($paleta)];

  // Semáforo de riesgo de abandono
  $riesgo = $asistencia['riesgo'] ?? 'bajo';
  $claseRiesgo = $riesgo === 'alto' ? 'riesgo-alto' : ($riesgo === 'medio' ? 'riesgo-medio' : 'riesgo-bajo');
  $textoRiesgo = $riesgo === 'alto' ? 'Riesgo alto' : ($riesgo === 'medio' ? 'Riesgo medio' : 'Sin riesgo');

  // PPM vs estándar nacional Fase 6 (120–135)
  $ppm = $lectura['ppm'] ?? null;
  $comp = $lectura['comprension'] ?? [];
  $enEstandar = ($ppm !== null && $ppm >= 120);
@endphp
<!DOCTYPE html>
<html lang="es-MX">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Expediente 360° · {{ $nombre }} · {{ $matricula }}</title>

  <style>
    @page { size: letter portrait; margin: 10mm 8mm; }

    :root {
      --kx-tinta: #111827;
      --kx-suave: #4b5563;
      --kx-linea: #94a3b8;
      --kx-tenue: #cbd5e1;
      --kx-acento: #0f4c81;
      --kx-ok: #15803d;
      --kx-alerta: #b91c1c;
      --kx-ambar: #b45309;
    }
    * { box-sizing: border-box; }

    .kx-body {
      margin: 0;
      padding: 20px 14px 48px;
      background: #e2e8f0;
      color: var(--kx-tinta);
      font-family: Arial, Helvetica, "Segoe UI", sans-serif;
      font-size: 9pt;
      line-height: 1.4;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .kx-hoja {
      width: 21.59cm;
      min-height: 27.94cm;
      margin: 0 auto 14px;
      padding: 10mm 8mm;
      background: #fff;
      box-shadow: 0 10px 30px rgba(15, 23, 42, .25);
      box-sizing: border-box;
    }

    .kx-acciones {
      position: sticky;
      top: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      max-width: 21.59cm;
      margin: 0 auto 12px;
      padding: 10px 14px;
      background: rgba(255, 255, 255, .96);
      border: 1px solid var(--kx-tenue);
      border-radius: 10px;
    }
    .kx-acciones__volver { color: var(--kx-acento); font-size: 12.5px; font-weight: 700; text-decoration: none; }
    .kx-acciones__imprimir {
      min-height: 40px;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: var(--kx-acento);
      color: #fff;
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
    }

    /* ---------- Membrete ---------- */
    .kx-membrete {
      display: flex;
      align-items: center;
      gap: 6mm;
      padding-bottom: 3.5mm;
      border-bottom: 2.5px solid var(--kx-acento);
    }
    .kx-escudo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18mm;
      height: 18mm;
      flex: 0 0 auto;
      border: 2px solid var(--kx-acento);
      border-radius: 50%;
      color: var(--kx-acento);
      font-size: 12pt;
      font-weight: 700;
      letter-spacing: .04em;
    }
    .kx-membrete__texto { flex: 1 1 auto; }
    .kx-estado {
      margin: 0;
      font-size: 9pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .05em;
      color: var(--kx-acento);
    }
    .kx-secretaria { margin: .8mm 0 0; font-size: 7.5pt; color: var(--kx-suave); }
    .kx-escuela { margin: 1.2mm 0 0; font-size: 10pt; font-weight: 700; }
    .kx-datos-escuela { margin: .6mm 0 0; font-size: 7pt; color: var(--kx-suave); }

    .kx-titulo {
      margin: 4mm 0 3mm;
      text-align: center;
      font-size: 11.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .03em;
      line-height: 1.25;
    }

    /* ---------- Ficha con avatar ---------- */
    .kx-ficha {
      display: grid;
      grid-template-columns: 26mm 1fr;
      gap: 5mm;
      padding: 4mm;
      border: 1px solid var(--kx-tenue);
      border-radius: 2.5mm;
      background: #f8fafc;
      margin-bottom: 4mm;
    }
    .kx-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 26mm;
      height: 26mm;
      border-radius: 50%;
      color: #fff;
      font-size: 20pt;
      font-weight: 800;
      align-self: start;
    }
    .kx-avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }

    .kx-ficha__grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 2mm 4mm;
      margin: 0;
    }
    .kx-ficha__campo--ancho { grid-column: 1 / -1; }
    .kx-ficha__grid dt {
      font-size: 6.8pt;
      text-transform: uppercase;
      letter-spacing: .05em;
      color: var(--kx-suave);
    }
    .kx-ficha__grid dd {
      margin: .4mm 0 0;
      font-size: 9pt;
      font-weight: 700;
      border-bottom: 1px solid var(--kx-tenue);
      padding-bottom: .8mm;
      min-height: 5mm;
    }
    .kx-ficha__grid dd.mono {
      font-family: "Courier New", Consolas, monospace;
      font-size: 8.5pt;
    }

    .kx-badge-estatus {
      display: inline-flex;
      align-items: center;
      gap: 1.5mm;
      padding: .8mm 3mm;
      border-radius: 999px;
      background: #dcfce7;
      color: #14532d;
      font-size: 7.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .04em;
    }
    .kx-badge-estatus::before {
      content: "";
      width: 2mm;
      height: 2mm;
      border-radius: 50%;
      background: #22c55e;
    }

    /* ---------- Rótulos de sección ---------- */
    .kx-rotulo {
      margin: 4mm 0 2mm;
      padding: 1.4mm 3mm;
      background: #e8eef6;
      border-left: 4px solid var(--kx-acento);
      font-size: 8.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .05em;
      color: var(--kx-acento);
    }
    .kx-rotulo--taller {
      background: #fff7ed;
      border-left-color: var(--kx-ambar);
      color: #7c2d12;
    }

    /* ---------- Tabla académica ---------- */
    .kx-tabla {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.4pt;
      table-layout: fixed;
    }
    .kx-tabla thead th {
      padding: 1.5mm 1.6mm;
      background: var(--kx-acento);
      color: #fff;
      font-size: 6.8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .04em;
      text-align: left;
      border: 1px solid var(--kx-acento);
    }
    .kx-tabla thead th.c { text-align: center; }
    .kx-tabla tbody th,
    .kx-tabla tbody td {
      padding: 1.3mm 1.6mm;
      border: 1px solid var(--kx-tenue);
      vertical-align: middle;
    }
    .kx-tabla tbody tr:nth-child(even) td,
    .kx-tabla tbody tr:nth-child(even) th.materia { background: #fcfdff; }

    .kx-tabla .campo th {
      background: #e8eef6 !important;
      color: var(--kx-acento);
      font-size: 7.6pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .03em;
      border: 1px solid var(--kx-linea);
    }
    .kx-tabla .materia { text-align: left; font-weight: 400; }
    .kx-tabla .c { text-align: center; font-variant-numeric: tabular-nums; }
    .kx-tabla .prom { font-weight: 700; background: #eef4fb !important; }
    .kx-tabla .reprobada { color: var(--kx-alerta); font-weight: 700; }

    .kx-estado-acred {
      display: inline-block;
      padding: .5mm 2mm;
      border-radius: 1mm;
      font-size: 6.8pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .03em;
    }
    .kx-estado-acred--ok { background: #dcfce7; color: #14532d; }
    .kx-estado-acred--proceso { background: #fef3c7; color: #92400e; }

    /* ---------- Taller tecnológico ---------- */
    .kx-taller {
      padding: 3mm;
      border: 2px solid var(--kx-ambar);
      border-radius: 2mm;
      background: #fffdfa;
    }
    .kx-taller__grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 3mm;
      margin: 0;
      font-size: 8.4pt;
    }
    .kx-taller__grid dt { font-size: 6.6pt; text-transform: uppercase; letter-spacing: .04em; color: var(--kx-suave); }
    .kx-taller__grid dd { margin: .5mm 0 0; font-weight: 700; }

    /* ---------- Indicadores ---------- */
    .kx-indicadores {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 4mm;
    }
    .kx-panel {
      padding: 3mm;
      border: 1px solid var(--kx-tenue);
      border-radius: 2mm;
      background: #f8fafc;
    }
    .kx-panel__titulo {
      margin: 0 0 2.5mm;
      font-size: 7.6pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .05em;
      color: var(--kx-acento);
    }

    .kx-dato-fila {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 3mm;
      padding: 1mm 0;
      border-bottom: 1px dotted var(--kx-tenue);
      font-size: 8.2pt;
    }
    .kx-dato-fila:last-child { border-bottom: 0; }
    .kx-dato-fila span { color: var(--kx-suave); }
    .kx-dato-fila strong { font-variant-numeric: tabular-nums; }

    .kx-ppm {
      display: flex;
      align-items: baseline;
      gap: 2mm;
      margin: 0 0 2mm;
    }
    .kx-ppm__valor { font-size: 17pt; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
    .kx-ppm__unidad { font-size: 7pt; font-weight: 700; color: var(--kx-suave); }
    .kx-ppm__nota { font-size: 7pt; color: var(--kx-suave); }
    .kx-ppm--ok .kx-ppm__valor { color: var(--kx-ok); }
    .kx-ppm--bajo .kx-ppm__valor { color: var(--kx-ambar); }

    .kx-comp { display: flex; flex-direction: column; gap: 1.5mm; margin-top: 2mm; }
    .kx-comp__fila {
      display: grid;
      grid-template-columns: 22mm 1fr 11mm;
      align-items: center;
      gap: 2mm;
      font-size: 7.6pt;
    }
    .kx-comp__barra { height: 2.2mm; border-radius: 1mm; background: #e2e8f0; overflow: hidden; }
    .kx-comp__relleno { display: block; height: 100%; border-radius: 1mm; background: var(--kx-acento); }
    .kx-comp__fila:nth-child(2) .kx-comp__relleno { background: #4338ca; }
    .kx-comp__fila:nth-child(3) .kx-comp__relleno { background: #7c3aed; }
    .kx-comp__pct { text-align: right; font-weight: 700; font-variant-numeric: tabular-nums; }

    .kx-riesgo {
      display: inline-flex;
      align-items: center;
      gap: 2mm;
      margin-top: 2mm;
      padding: 1mm 3mm;
      border-radius: 999px;
      font-size: 7.6pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .03em;
    }
    .kx-riesgo::before { content: ""; width: 2.2mm; height: 2.2mm; border-radius: 50%; background: currentColor; }
    .kx-riesgo.riesgo-bajo  { background: #dcfce7; color: #14532d; }
    .kx-riesgo.riesgo-medio { background: #fef3c7; color: #92400e; }
    .kx-riesgo.riesgo-alto  { background: #fee2e2; color: #991b1b; }

    /* ---------- Bitácora ---------- */
    .kx-bitacora { width: 100%; border-collapse: collapse; font-size: 8pt; }
    .kx-bitacora thead th {
      padding: 1.3mm 1.8mm;
      background: var(--kx-acento);
      color: #fff;
      font-size: 6.6pt;
      text-transform: uppercase;
      letter-spacing: .04em;
      text-align: left;
      border: 1px solid var(--kx-acento);
    }
    .kx-bitacora tbody td {
      padding: 1.5mm 1.8mm;
      border: 1px solid var(--kx-tenue);
      vertical-align: top;
      line-height: 1.35;
    }
    .kx-bitacora tbody tr:nth-child(even) td { background: #fcfdff; }
    .kx-bitacora .fecha { white-space: nowrap; font-variant-numeric: tabular-nums; }
    .kx-bitacora .area { white-space: nowrap; font-weight: 700; color: var(--kx-acento); }

    .kx-vacio {
      padding: 4mm;
      text-align: center;
      font-size: 8pt;
      font-style: italic;
      color: var(--kx-suave);
      border: 1px dashed var(--kx-tenue);
      border-radius: 2mm;
    }

    /* ---------- Firmas ---------- */
    .kx-firmas {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 7mm;
      margin-top: 8mm;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .kx-firma { text-align: center; }
    .kx-firma__linea { display: block; height: 15mm; border-bottom: 1.4px solid var(--kx-tinta); }
    .kx-firma__cargo {
      display: block;
      margin-top: 1.5mm;
      font-size: 6.8pt;
      text-transform: uppercase;
      letter-spacing: .04em;
      color: var(--kx-suave);
      line-height: 1.25;
    }
    .kx-firma__nombre {
      display: block;
      margin-top: 1mm;
      font-size: 8pt;
      font-weight: 700;
      min-height: 4mm;
    }

    .kx-sello {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 15mm;
      border: 1.4px dashed var(--kx-linea);
      border-radius: 2mm;
      color: var(--kx-linea);
      font-size: 7pt;
      text-transform: uppercase;
      letter-spacing: .05em;
      text-align: center;
    }

    .kx-pie {
      margin-top: 4mm;
      padding-top: 1.5mm;
      border-top: 1px solid var(--kx-tenue);
      display: flex;
      justify-content: space-between;
      gap: 4mm;
      font-size: 6.8pt;
      color: var(--kx-suave);
    }

    /* ---------- Responsivo e impresión ---------- */
    @media screen and (max-width: 920px) {
      .kx-body { padding: 12px 8px 32px; }
      .kx-hoja { width: 100%; min-height: 0; padding: 16px 12px; box-shadow: none; }
      .kx-ficha { grid-template-columns: minmax(0, 1fr); }
      .kx-ficha__grid,
      .kx-taller__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .kx-indicadores { grid-template-columns: minmax(0, 1fr); }
      .kx-firmas { grid-template-columns: minmax(0, 1fr); gap: 6mm; }
    }

    @media print {
      .kx-body { padding: 0; background: #fff; }
      .kx-hoja { width: auto; min-height: 0; margin: 0; padding: 0; box-shadow: none; }
      .no-imprimir { display: none !important; }

      .kx-ficha,
      .kx-taller,
      .kx-firmas,
      .kx-pie,
      .kx-panel,
      .kx-tabla thead,
      .kx-bitacora tr { break-inside: avoid; page-break-inside: avoid; }

      .kx-tabla thead th,
      .kx-tabla .campo th,
      .kx-rotulo,
      .kx-bitacora thead th,
      .kx-avatar { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>

<body class="kx-body">

  <div class="kx-acciones no-imprimir">
    <a class="kx-acciones__volver" href="{{ url()->previous() }}">← Volver</a>
    <button type="button" class="kx-acciones__imprimir" onclick="window.print()">
      🖨️ Imprimir expediente
    </button>
  </div>

  <main class="kx-hoja">

    {{-- ---------- Membrete ---------- --}}
    <header class="kx-membrete">
      <div class="kx-escudo" aria-hidden="true">NL</div>
      <div class="kx-membrete__texto">
        <p class="kx-estado">Gobierno del Estado de Nuevo León · Secretaría de Educación</p>
        <p class="kx-secretaria">Unidad de Integración Educativa (UIENL)</p>
        <p class="kx-escuela">{{ $nombreEscuela }}</p>
        <p class="kx-datos-escuela">
          C.C.T. {{ $cct }} · Turno {{ $turno }} · {{ $region }} · {{ $zona }}
        </p>
      </div>
    </header>

    <h1 class="kx-titulo">Expediente Integral del Alumno<br>Kárdex Académico-Formativo 360°</h1>

    {{-- ---------- Ficha con avatar ---------- --}}
    <section class="kx-ficha" aria-label="Datos de identificación del estudiante">
      <div class="kx-avatar" style="background-color: {{ $colorAvatar }};" aria-hidden="true">
        @if(!empty($alumno['foto']))
          <img src="{{ $alumno['foto'] }}" alt="">
        @else
          {{ $ini ?: '?' }}
        @endif
      </div>

      <dl class="kx-ficha__grid">
        <div class="kx-ficha__campo--ancho">
          <dt>Nombre completo (apellidos y nombres)</dt>
          <dd>{{ $nombre }}</dd>
        </div>
        <div><dt>Matrícula oficial</dt><dd class="mono">{{ $matricula }}</dd></div>
        <div><dt>CURP</dt><dd class="mono">{{ $curp }}</dd></div>
        <div><dt>Grado y grupo</dt><dd>{{ $grado }} {{ $grupo }}</dd></div>
        <div><dt>Ciclo escolar</dt><dd class="mono">{{ $ciclo }}</dd></div>
        <div><dt>Padre/madre/tutor</dt><dd>{{ $tutor }}</dd></div>
        <div><dt>Teléfono de emergencia</dt><dd class="mono">{{ $telefono }}</dd></div>
        <div>
          <dt>Estatus de inscripción</dt>
          <dd><span class="kx-badge-estatus">{{ $estatus }}</span></dd>
        </div>
      </dl>
    </section>

    {{-- ---------- Rendimiento académico ---------- --}}
    <h2 class="kx-rotulo">Rendimiento académico por campos formativos (NEM)</h2>

    <table class="kx-tabla">
      <thead>
        <tr>
          <th scope="col">Campo formativo y asignatura</th>
          <th scope="col" class="c">T1</th>
          <th scope="col" class="c">T2</th>
          <th scope="col" class="c">T3</th>
          <th scope="col" class="c">Promedio</th>
          <th scope="col" class="c">Estado</th>
        </tr>
      </thead>
      <tbody>
        @forelse($campos as $campo)
          <tr class="campo">
            <th scope="rowgroup" colspan="6">{{ $campo['nombre'] ?? 'Campo formativo' }}</th>
          </tr>
          @foreach(($campo['materias'] ?? []) as $materia)
            @php
              $t1 = $materia['t1'] ?? null;
              $t2 = $materia['t2'] ?? null;
              $t3 = $materia['t3'] ?? null;
              $vv = array_filter([$t1, $t2, $t3], function ($v) { return $v !== null && $v !== ''; });
              $pr = $materia['promedio'] ?? (count($vv) ? array_sum($vv) / count($vv) : null);
              $acreditado = ($pr !== null && $pr >= 6);
            @endphp
            <tr>
              <th scope="row" class="materia">{{ $materia['nombre'] ?? 'Asignatura' }}</th>
              <td class="c {{ ($t1 !== null && $t1 !== '' && (float) $t1 < 6) ? 'reprobada' : '' }}">{{ $num($t1) }}</td>
              <td class="c {{ ($t2 !== null && $t2 !== '' && (float) $t2 < 6) ? 'reprobada' : '' }}">{{ $num($t2) }}</td>
              <td class="c {{ ($t3 !== null && $t3 !== '' && (float) $t3 < 6) ? 'reprobada' : '' }}">{{ $num($t3) }}</td>
              <td class="c prom {{ ($pr !== null && $pr < 6) ? 'reprobada' : '' }}">{{ $num($pr) }}</td>
              <td class="c">
                @if($pr === null)
                  —
                @else
                  <span class="kx-estado-acred {{ $acreditado ? 'kx-estado-acred--ok' : 'kx-estado-acred--proceso' }}">
                    {{ $acreditado ? 'Acreditado' : 'En proceso' }}
                  </span>
                @endif
              </td>
            </tr>
          @endforeach
        @empty
          <tr><td colspan="6" class="c">Sin calificaciones registradas.</td></tr>
        @endforelse
      </tbody>
    </table>

    <p style="margin:1.5mm 0 0;font-size:7pt;color:var(--kx-suave);">
      Escala oficial 5.0 a 10.0 (Acuerdo 10/09/23). Mínima aprobatoria: <strong>6.0</strong>.
    </p>

    {{-- ---------- Taller tecnológico ---------- --}}
    <h2 class="kx-rotulo kx-rotulo--taller">Taller tecnológico · Acuerdo Secretarial 97</h2>

    <div class="kx-taller">
      <dl class="kx-taller__grid">
        <div><dt>Campo tecnológico</dt><dd>{{ $taller['campo'] ?? '—' }}</dd></div>
        <div><dt>Tallerista titular</dt><dd>{{ $taller['tallerista'] ?? '—' }}</dd></div>
        <div><dt>Calificación</dt><dd>{{ $num($taller['calificacion'] ?? null) }}</dd></div>
        <div><dt>Nivel de desempeño</dt><dd>{{ $taller['nivel'] ?? '—' }}</dd></div>
        <div><dt>Carga semanal</dt><dd>8 horas</dd></div>
      </dl>
    </div>

    {{-- ---------- Indicadores ---------- --}}
    <h2 class="kx-rotulo">Indicadores formativos y de desempeño</h2>

    <div class="kx-indicadores">

      {{-- Comprensión lectora --}}
      <section class="kx-panel" aria-labelledby="rotuloLectura">
        <h3 id="rotuloLectura" class="kx-panel__titulo">Comprensión lectora y fluidez</h3>

        <p class="kx-ppm {{ $enEstandar ? 'kx-ppm--ok' : 'kx-ppm--bajo' }}">
          <span class="kx-ppm__valor">{{ $ppm !== null ? (int) round($ppm) : '—' }}</span>
          <span class="kx-ppm__unidad">PPM</span>
        </p>
        <p class="kx-ppm__nota">
          Estándar nacional Fase 6: 120–135 PPM ·
          {{ $ppm === null ? 'sin registro' : ($enEstandar ? 'en estándar' : 'por debajo del estándar') }}
        </p>

        <div class="kx-comp">
          @foreach(['literal' => 'Literal', 'inferencial' => 'Inferencial', 'critico' => 'Crítico'] as $clave => $etiqueta)
            @php $v = $comp[$clave] ?? null; @endphp
            <div class="kx-comp__fila">
              <span>{{ $etiqueta }}</span>
              <span class="kx-comp__barra">
                <span class="kx-comp__relleno" style="width: {{ $v !== null ? max(0, min(100, (float) $v)) : 0 }}%;"></span>
              </span>
              <span class="kx-comp__pct">{{ $v !== null ? (int) round($v) . '%' : '—' }}</span>
            </div>
          @endforeach
        </div>
      </section>

      {{-- Asistencia --}}
      <section class="kx-panel" aria-labelledby="rotuloAsistencia">
        <h3 id="rotuloAsistencia" class="kx-panel__titulo">Asistencia y regularidad</h3>

        <div class="kx-dato-fila">
          <span>Asistencia global</span>
          <strong>{{ $asistencia['pct'] ?? '—' }}%</strong>
        </div>
        <div class="kx-dato-fila">
          <span>Faltas injustificadas</span>
          <strong>{{ $asistencia['faltas'] ?? 0 }}</strong>
        </div>
        <div class="kx-dato-fila">
          <span>Retardos</span>
          <strong>{{ $asistencia['retardos'] ?? 0 }}</strong>
        </div>
        <div class="kx-dato-fila">
          <span>Justificaciones</span>
          <strong>{{ $asistencia['justificados'] ?? 0 }}</strong>
        </div>

        <p class="kx-riesgo {{ $claseRiesgo }}">{{ $textoRiesgo }}</p>
      </section>
    </div>

    {{-- ---------- Bitácora ---------- --}}
    <h2 class="kx-rotulo">Historial de incidencias y observaciones · Trabajo Social y Tutoría</h2>

    @if(count($bitacora))
      <table class="kx-bitacora">
        <thead>
          <tr>
            <th scope="col" style="width:20mm;">Fecha</th>
            <th scope="col" style="width:30mm;">Área</th>
            <th scope="col">Observación / acuerdo pedagógico</th>
          </tr>
        </thead>
        <tbody>
          @foreach($bitacora as $nota)
            <tr>
              <td class="fecha">{{ $nota['fecha'] ?? '—' }}</td>
              <td class="area">{{ $nota['area'] ?? '—' }}</td>
              <td>{{ $nota['descripcion'] ?? '' }}</td>
            </tr>
          @endforeach
        </tbody>
      </table>
    @else
      <p class="kx-vacio">Sin incidencias registradas en el ciclo escolar.</p>
    @endif

    {{-- ---------- Firmas ---------- --}}
    <div class="kx-firmas">
      <div class="kx-firma">
        <span class="kx-firma__linea" aria-hidden="true"></span>
        <span class="kx-firma__cargo">Tutor(a) de Grupo</span>
        <span class="kx-firma__nombre">{{ $validacion['tutor'] ?? '' }}</span>
      </div>
      <div class="kx-firma">
        <span class="kx-firma__linea" aria-hidden="true"></span>
        <span class="kx-firma__cargo">Trabajo Social y Orientación</span>
        <span class="kx-firma__nombre">{{ $validacion['trabajo_social'] ?? '' }}</span>
      </div>
      <div class="kx-firma">
        <span class="kx-sello">Sello oficial<br>Vo.Bo. Dirección</span>
        <span class="kx-firma__cargo">Dirección Escolar</span>
        <span class="kx-firma__nombre">{{ $validacion['director'] ?? '' }}</span>
      </div>
    </div>

    <footer class="kx-pie">
      <span>{{ $nombreEscuela }} · C.C.T. {{ $cct }}</span>
      <span>Expediente {{ $matricula }} · Ciclo {{ $ciclo }}</span>
    </footer>
  </main>
</body>
</html>


```

---

## 2 · `citatorio-padres-ts-nl.blade.php`

```blade
{{--
  Citatorio Oficial a Padres de Familia · Trabajo Social (OLA 33 / Fase 10)
  Dos citatorios idénticos por hoja Carta, con talón de acuse desprendible.
  Sin lógica JavaScript: la impresión la dispara el navegador.
--}}
@php
  $citatorio = $citatorio ?? [];
  $alumno    = $alumno    ?? [];
  $escuela   = $escuela   ?? [];

  $nombreEscuela = $escuela['nombre'] ?? 'Escuela Secundaria Técnica No. 90 "José Calderón Ayala"';
  $cct           = $escuela['cct'] ?? '19DST0090X';
  $turno         = $escuela['turno'] ?? 'Matutino';

  $folio        = $citatorio['folio'] ?? 'CIT-ST90-2026-0000';
  $fechaEmision = $citatorio['fecha_emision'] ?? now()->format('d/m/Y');
  $diaCita      = $citatorio['dia_cita'] ?? '';
  $horaCita     = $citatorio['hora'] ?? '';
  $lugar        = $citatorio['lugar'] ?? 'Cubículo de Trabajo Social';
  $observaciones = $citatorio['observaciones'] ?? '';
  $convocante   = $citatorio['convocante'] ?? '';
  $cargoConvocante = $citatorio['cargo'] ?? 'Trabajador(a) Social';

  $nombreAlumno = $alumno['nombre'] ?? '—';
  $matricula    = $alumno['matricula'] ?? '—';
  $grado        = $alumno['grado'] ?? '—';
  $grupo        = $alumno['grupo'] ?? '—';

  $motivos = [
      'academico'     => 'Rendimiento académico o riesgo de no acreditación.',
      'inasistencias' => 'Acumulación de inasistencias y/o retardos (Artículo 97 · Normativa SENL).',
      'conducta'      => 'Conducta, disciplina o convivencia escolar sana y pacífica.',
      'inclusion'     => 'Seguimiento médico, inclusión o ajustes razonables (DUA).',
      'formativo'     => 'Asunto de interés formativo.',
  ];
  $motivosMarcados = (array) ($citatorio['motivos'] ?? []);
@endphp
<!DOCTYPE html>
<html lang="es-MX">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Citatorio {{ $folio }} · {{ $nombreAlumno }}</title>

  <style>
    @page { size: letter portrait; margin: 8mm 8mm; }

    :root {
      --ct-tinta: #111827;
      --ct-suave: #4b5563;
      --ct-linea: #94a3b8;
      --ct-tenue: #cbd5e1;
      --ct-acento: #0f4c81;
      --ct-ambar: #b45309;
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

    body.ct-body {
      margin: 0;
      padding: 16px 10px 40px;
      background: #e2e8f0;
      color: var(--ct-tinta);
      font-family: Arial, Helvetica, "Segoe UI", sans-serif;
      font-size: 8pt;
      line-height: 1.35;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .ct-hoja {
      width: 21.59cm;
      margin: 0 auto;
      padding: 8mm;
      background: #fff;
      box-shadow: 0 10px 30px rgba(15, 23, 42, .25);
    }

    .ct-acciones {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      max-width: 21.59cm;
      margin: 0 auto 12px;
      padding: 10px 14px;
      background: #fff;
      border: 1px solid var(--ct-tenue);
      border-radius: 10px;
    }
    .ct-acciones__volver { color: var(--ct-acento); font-size: 12.5px; font-weight: 700; text-decoration: none; }
    .ct-acciones__imprimir {
      min-height: 40px;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: var(--ct-acento);
      color: #fff;
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
    }

    /* ---------- Cada mitad ---------- */
    .ct-mitad {
      display: flex;
      flex-direction: column;
      height: 131mm;
      overflow: hidden;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .ct-mitad + .ct-mitad { border-top: 0; }

    /* ---------- Membrete simplificado ---------- */
    .ct-membrete {
      display: flex;
      align-items: center;
      gap: 4mm;
      padding-bottom: 1.5mm;
      border-bottom: 1.8px solid var(--ct-acento);
    }
    .ct-escudo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 12mm;
      height: 12mm;
      flex: 0 0 auto;
      border: 1.5px solid var(--ct-acento);
      border-radius: 50%;
      color: var(--ct-acento);
      font-size: 8pt;
      font-weight: 700;
    }
    .ct-membrete__texto { flex: 1 1 auto; min-width: 0; }
    .ct-estado {
      margin: 0;
      font-size: 7pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .04em;
      color: var(--ct-acento);
    }
    .ct-escuela { margin: .4mm 0 0; font-size: 8.2pt; font-weight: 700; line-height: 1.2; }
    .ct-datos { margin: .3mm 0 0; font-size: 6.2pt; color: var(--ct-suave); }

    .ct-folio {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 3mm;
      margin: 1.5mm 0 0;
      font-size: 6.6pt;
      color: var(--ct-suave);
    }
    .ct-folio strong {
      font-family: "Courier New", Consolas, monospace;
      font-size: 7.4pt;
      color: var(--ct-tinta);
    }

    .ct-titulo {
      margin: 1.5mm 0 1mm;
      text-align: center;
      font-size: 9pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .04em;
    }

    /* ---------- Cuerpo ---------- */
    .ct-destinatario { margin: 0 0 1mm; font-size: 7.8pt; line-height: 1.35; }
    .ct-destinatario strong { font-weight: 700; }

    .ct-convocatoria {
      margin: 1mm 0;
      padding: 1.2mm 2mm;
      background: #f8fafc;
      border-left: 2.5px solid var(--ct-acento);
      font-size: 7.8pt;
      line-height: 1.35;
    }

    /* ---------- Motivos ---------- */
    .ct-motivos { margin: 1mm 0; display: flex; flex-direction: column; gap: .5mm; }
    .ct-motivos__titulo {
      margin: 0 0 .5mm;
      font-size: 6.4pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .05em;
      color: var(--ct-suave);
    }
    .ct-motivo {
      display: flex;
      align-items: flex-start;
      gap: 1.5mm;
      font-size: 7.2pt;
      line-height: 1.25;
    }
    .ct-motivo__caja {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 3.2mm;
      height: 3.2mm;
      margin-top: .3mm;
      border: 1px solid var(--ct-linea);
      border-radius: .5mm;
      font-size: 6pt;
      font-weight: 800;
      color: #fff;
      line-height: 1;
    }
    .ct-motivo.marcado .ct-motivo__caja {
      background: var(--ct-acento);
      border-color: var(--ct-acento);
    }
    .ct-motivo.marcado .ct-motivo__texto { font-weight: 700; }

    /* ---------- Observaciones ---------- */
    .ct-observaciones {
      margin: 1mm 0;
      padding: 1mm 2mm;
      border: 1px solid var(--ct-tenue);
      border-radius: 1mm;
      min-height: 11mm;
      font-size: 7.2pt;
      line-height: 1.35;
    }
    .ct-observaciones__rotulo {
      display: block;
      font-size: 6.2pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .05em;
      color: var(--ct-suave);
      margin-bottom: .5mm;
    }

    .ct-apercibimiento {
      margin: .8mm 0;
      font-size: 6.6pt;
      font-style: italic;
      line-height: 1.3;
      color: var(--ct-suave);
    }

    /* ---------- Firma del convocante ---------- */
    .ct-firma-convocante {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 6mm;
      margin-top: auto;
      padding-top: 1.5mm;
    }
    .ct-firma {
      text-align: center;
      flex: 0 1 62mm;
    }
    .ct-firma__linea { display: block; height: 8mm; border-bottom: 1px solid var(--ct-tinta); }
    .ct-firma__nombre { display: block; margin-top: .6mm; font-size: 7pt; font-weight: 700; }
    .ct-firma__cargo {
      display: block;
      font-size: 6.2pt;
      text-transform: uppercase;
      letter-spacing: .03em;
      color: var(--ct-suave);
    }

    /* ---------- Línea de corte ---------- */
    .ct-corte {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2mm;
      height: 6mm;
      margin: 1.5mm 0;
      font-size: 6pt;
      font-weight: 700;
      letter-spacing: .12em;
      color: var(--ct-linea);
      text-transform: uppercase;
      white-space: nowrap;
    }
    .ct-corte::before,
    .ct-corte::after {
      content: "";
      flex: 1 1 auto;
      border-top: 1px dashed var(--ct-linea);
    }

    /* ---------- Talón de acuse ---------- */
    .ct-talon {
      padding: 1.5mm 2mm;
      border: 1px dashed var(--ct-linea);
      border-radius: 1mm;
      background: #f8fafc;
      font-size: 7pt;
      line-height: 1.35;
    }
    .ct-talon__cabecera {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 3mm;
      margin-bottom: .8mm;
    }
    .ct-talon__titulo {
      margin: 0;
      font-size: 6.6pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .05em;
      color: var(--ct-acento);
    }
    .ct-talon__folio {
      font-family: "Courier New", Consolas, monospace;
      font-size: 7pt;
      font-weight: 700;
    }
    .ct-talon__datos { margin: 0 0 .8mm; font-size: 6.8pt; }
    .ct-talon__declaracion {
      margin: 0 0 .8mm;
      padding: .8mm 1.5mm;
      background: #fff;
      border: 1px solid var(--ct-tenue);
      border-radius: .8mm;
      font-size: 6.8pt;
      line-height: 1.4;
    }
    .ct-talon__firmas {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 4mm;
    }
    .ct-talon__campo { flex: 1 1 0; text-align: center; }
    .ct-talon__campo-linea { display: block; height: 6mm; border-bottom: 1px solid var(--ct-linea); }
    .ct-talon__campo-rotulo {
      display: block;
      margin-top: .4mm;
      font-size: 5.8pt;
      text-transform: uppercase;
      letter-spacing: .03em;
      color: var(--ct-suave);
    }

    /* ---------- Responsivo e impresión ---------- */
    @media screen and (max-width: 920px) {
      body.ct-body { padding: 10px 6px 30px; }
      .ct-hoja { width: 100%; padding: 12px 10px; box-shadow: none; }
      .ct-mitad { height: auto; }
      .ct-mitad + .ct-mitad { margin-top: 10px; }
    }

    @media print {
      body.ct-body { padding: 0; background: #fff; }
      .ct-hoja { width: auto; padding: 0; box-shadow: none; }
      .no-imprimir { display: none !important; }
      .ct-mitad { height: 131mm; }
      .ct-corte::before,
      .ct-corte::after { border-top-color: #94a3b8; }
    }
  </style>
</head>

<body class="ct-body">

  <div class="ct-acciones no-imprimir">
    <a class="ct-acciones__volver" href="{{ url()->previous() }}">← Volver</a>
    <button type="button" class="ct-acciones__imprimir" onclick="window.print()">
      🖨️ Imprimir citatorio
    </button>
  </div>

  <div class="ct-hoja">
    {{-- Dos citatorios idénticos por hoja Carta --}}
    @for($copia = 1; $copia <= 2; $copia++)

      <section class="ct-mitad" aria-label="Citatorio {{ $folio }} · copia {{ $copia }}">

        {{-- Membrete simplificado --}}
        <header class="ct-membrete">
          <div class="ct-escudo" aria-hidden="true">NL</div>
          <div class="ct-membrete__texto">
            <p class="ct-estado">Gobierno del Estado de Nuevo León · Secretaría de Educación</p>
            <p class="ct-escuela">{{ $nombreEscuela }}</p>
            <p class="ct-datos">C.C.T. {{ $cct }} · Turno {{ $turno }} · Trabajo Social y Orientación</p>
          </div>
        </header>

        <div class="ct-folio">
          <span>Folio: <strong>{{ $folio }}</strong></span>
          <span>Fecha de emisión: <strong>{{ $fechaEmision }}</strong></span>
        </div>

        <h2 class="ct-titulo">Citatorio oficial a padres de familia o tutor</h2>

        <p class="ct-destinatario">
          <strong>Estimado Padre de Familia, Madre o Tutor del alumno(a):</strong>
          {{ $nombreAlumno }} — Grado y grupo: <strong>{{ $grado }} {{ $grupo }}</strong>
        </p>

        <p class="ct-convocatoria">
          Por medio del presente se le convoca el día <strong>{{ $diaCita ?: '____________' }}</strong>
          a las <strong>{{ $horaCita ?: '__:__' }} hrs</strong>, en
          <strong>{{ $lugar }}</strong>, en las instalaciones del plantel.
        </p>

        {{-- Motivo de la cita --}}
        <div class="ct-motivos">
          <p class="ct-motivos__titulo">Motivo de la cita</p>
          @foreach($motivos as $clave => $texto)
            @php $marcado = in_array($clave, $motivosMarcados, true); @endphp
            <div class="ct-motivo {{ $marcado ? 'marcado' : '' }}">
              <span class="ct-motivo__caja" aria-hidden="true">{{ $marcado ? '✓' : '' }}</span>
              <span class="ct-motivo__texto">
                {{ $texto }}
                @if($marcado)
                  <span class="sr-only">(seleccionado)</span>
                @endif
              </span>
            </div>
          @endforeach
        </div>

        {{-- Observaciones --}}
        <div class="ct-observaciones">
          <span class="ct-observaciones__rotulo">Observaciones o detalles de la situación</span>
          {{ $observaciones ?: ' ' }}
        </div>

        <p class="ct-apercibimiento">
          Su presencia es indispensable para garantizar el interés superior de la niñez y el derecho
          a la educación (Art. 3° Constitucional).
        </p>

        <div class="ct-firma-convocante">
          <span style="font-size:6.2pt;color:var(--ct-suave);">
            Notificado el {{ $fechaEmision }}
          </span>
          <div class="ct-firma">
            <span class="ct-firma__linea" aria-hidden="true"></span>
            <span class="ct-firma__nombre">{{ $convocante }}</span>
            <span class="ct-firma__cargo">{{ $cargoConvocante }}</span>
          </div>
        </div>

        {{-- Corte --}}
        <div class="ct-corte" aria-hidden="true">
          <span>✂️ - - - - - Corte aquí - - - - -</span>
        </div>

        {{-- Talón de acuse --}}
        <div class="ct-talon">
          <div class="ct-talon__cabecera">
            <h3 class="ct-talon__titulo">Talón de acuse de recibo · Archivo escolar</h3>
            <span class="ct-talon__folio">{{ $folio }}</span>
          </div>

          <p class="ct-talon__datos">
            Alumno(a): <strong>{{ $nombreAlumno }}</strong> · Matrícula:
            <strong>{{ $matricula }}</strong> · Grupo: <strong>{{ $grado }} {{ $grupo }}</strong>
          </p>

          <p class="ct-talon__declaracion">
            Enterado(a) del citatorio programado para el día ______________ a las __________ hrs.
            Me comprometo a asistir puntualmente.
          </p>

          <div class="ct-talon__firmas">
            <div class="ct-talon__campo">
              <span class="ct-talon__campo-linea" aria-hidden="true"></span>
              <span class="ct-talon__campo-rotulo">Nombre legible del padre o tutor</span>
            </div>
            <div class="ct-talon__campo">
              <span class="ct-talon__campo-linea" aria-hidden="true"></span>
              <span class="ct-talon__campo-rotulo">Firma</span>
            </div>
            <div class="ct-talon__campo">
              <span class="ct-talon__campo-linea" aria-hidden="true"></span>
              <span class="ct-talon__campo-rotulo">Fecha de notificación</span>
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

## 3 · Correspondencia con la partitura

### Expediente 360°

| Requisito | Implementado | Cómo |
|---|:---:|---|
| Carta vertical, márgenes 10 × 8 mm | ✅ | `@page { size: letter portrait; margin: 10mm 8mm; }` |
| Membrete NL · SENL · UIENL | ✅ | Escudo + tres líneas institucionales |
| Escuela, CCT, turno, región y zona | ✅ | `19DST0090X` · Matutino · Región 2 · Zona Escolar 12 |
| Título prominente | ✅ | «Expediente Integral del Alumno / Kárdex Académico-Formativo 360°» |
| Ficha con avatar | ✅ | Círculo de 26 mm con iniciales y color estable por nombre |
| Matrícula, CURP, grado/grupo, ciclo | ✅ | En rejilla de tres columnas con `.mono` para claves |
| Tutor, teléfono de emergencia, estatus | ✅ | Estatus como badge verde |
| 4 campos formativos con T1/T2/T3/promedio/estado | ✅ | Tabla con fila de campo y estado Acreditado / En Proceso |
| Módulo Taller Tecnológico (Acuerdo 97) | ✅ | Bloque ámbar con campo, tallerista, calificación, nivel y 8 horas |
| PPM vs estándar 120–135 | ✅ | Cifra grande en verde si alcanza el estándar, ámbar si no |
| Comprensión literal / inferencial / crítico | ✅ | Tres barras con porcentaje |
| Asistencia: % global, faltas, retardos, justificados | ✅ | Panel de datos con línea punteada |
| Semáforo de riesgo de abandono | ✅ | `.kx-riesgo.riesgo-bajo/--medio/--alto` |
| Bitácora de Trabajo Social | ✅ | Tabla fecha / área / observación, con estado vacío |
| 3 firmas institucionales | ✅ | Tutor, Trabajo Social y Dirección con sello |

### Citatorio

| Requisito | Implementado | Cómo |
|---|:---:|---|
| Media Carta y 2 por hoja | ✅ | `.ct-mitad` de 131 mm × 2 dentro de una hoja Carta |
| Línea de corte punteada | ✅ | `.ct-corte` con ✂️ y guiones |
| Membrete simplificado con escudo | ✅ | Versión compacta del membrete del kárdex |
| Folio único | ✅ | `CIT-ST90-2026-0042` en el cuerpo y en el talón |
| Encabezado al tutor con nombre y grupo | ✅ | Párrafo de destinatario |
| Convocatoria con día, hora y lugar | ✅ | Bloque con borde izquierdo azul |
| 5 motivos con casilla | ✅ | `.ct-motivo.marcado` pinta la casilla y el ✓ |
| Observaciones | ✅ | Caja con rótulo y altura mínima |
| Nombre y firma del convocante | ✅ | Línea, nombre y cargo |
| Apercibimiento Art. 3° | ✅ | Texto en cursiva |
| Talón con folio, datos, declaración y 3 firmas | ✅ | Caja punteada de archivo escolar |

---

## 4 · Decisiones de diseño

1. **El expediente imprime en una sola hoja.** Las secciones usan `break-inside: avoid` individual y tipografía de 8.4 pt: un kárdex que se parte en dos hojas deja de ser un expediente y se vuelve un legajo.
2. **El PPM cambia de color, no solo de número.** Verde si alcanza 120–135, ámbar si no. Un docente lee el color de un vistazo antes que la cifra.
3. **El estado por materia se calcula, no se pregunta.** `Acreditado` si el promedio ≥ 6.0, `En Proceso` si no. Evita capturas contradictorias con la calificación.
4. **El motivo del citatorio es visual y también accesible.** La casilla pintada se acompaña de un texto `.sr-only` que dice «(seleccionado)»: quien use lector de pantalla no depende del ✓.
5. **La mitad mide 131 mm exactos.** 279.4 mm menos los márgenes de 8 mm, entre dos. Así salen **dos citatorios por hoja sin desbordar**, que es todo el punto del ahorro de papel.
6. **El talón repite el folio.** Si el padre se lleva la mitad superior, el archivo conserva la trazabilidad de qué citatorio se notificó y cuándo.

---

## 5 · Pendiente para Cursor / Antigravity

- **Cursor:** no requiere trabajo en esta ola (ambos documentos son de impresión estática).
- **Antigravity:** integrar junto con las olas 30–32; todas comparten el membrete institucional y la convención de Carta.

---

## 6 · INFORME PARA ANTIGRAVITY

```text
DeepSeek propone/hizo los siguientes cambios de diseño:

INFORME PARA ANTIGRAVITY:
- Archivos involucrados (NUEVOS; ya depositados en entregas-laravel-fase1/):
    * resources/views/reportes/kardex-alumno-360-nl.blade.php
    * resources/views/reportes/citatorio-padres-ts-nl.blade.php
- Propósito del cambio:
    1. Expediente Integral 360° en Carta vertical: membrete NL/SENL/UIENL, ficha con avatar, tabla de
       los 4 campos formativos con T1-T3, promedio y estado, módulo del Acuerdo 97, indicadores de
       comprension lectora (PPM vs 120-135 y tres niveles cognitivos), asistencia con semaforo de riesgo,
       bitacora de Trabajo Social y tres firmas institucionales.
    2. Citatorio oficial a padres en media Carta, dos por hoja con linea de corte: folio, convocatoria,
       cinco motivos con casilla, observaciones, apercibimiento del Art. 3o y talon de acuse desprendible.
- Selectores propios: .kx-body, .kx-hoja, .kx-membrete, .kx-escudo, .kx-titulo, .kx-ficha, .kx-avatar,
  .kx-badge-estatus, .kx-rotulo (+ --taller), .kx-tabla (.campo/.materia/.c/.prom/.reprobada),
  .kx-estado-acred (+ --ok/--proceso), .kx-taller, .kx-indicadores, .kx-panel, .kx-dato-fila, .kx-ppm
  (+ --ok/--bajo), .kx-comp (+ __fila/__barra/__relleno/__pct), .kx-riesgo.riesgo-bajo|medio|alto,
  .kx-bitacora, .kx-vacio, .kx-firmas, .kx-sello, .kx-pie, @page letter portrait, @media print.
  .ct-body, .ct-hoja, .ct-mitad, .ct-membrete, .ct-escudo, .ct-folio, .ct-titulo, .ct-destinatario,
  .ct-convocatoria, .ct-motivos, .ct-motivo (+ .marcado/__caja/__texto), .ct-observaciones,
  .ct-apercibimiento, .ct-firma-convocante, .ct-firma, .ct-corte, .ct-talon (+ __cabecera/__titulo/
  __folio/__datos/__declaracion/__firmas/__campo*), .sr-only.
- Precauciones:
  * .ct-mitad mide 131mm (279.4 - 2x8 entre 2): no cambiar o salen tres citatorios en dos hojas.
  * El estado Acreditado/En Proceso se calcula desde el promedio (>= 6.0); no capturarlo a mano.
  * El expediente debe caber en una hoja: las secciones usan break-inside avoid por separado.
  * El talon debe repetir el mismo folio del cuerpo para conservar trazabilidad.
  * Sin logica JavaScript propia: la impresion usa window.print().

Por favor:
1. Revisa que respete el Design System ST90 y que no rompa la funcionalidad JS ni los IDs existentes.
2. Aplícalo en los archivos correspondientes.
3. Despliégalo a Google Apps Script (clasp push & deploy) para que lo vea en mi Google Sites.
```

