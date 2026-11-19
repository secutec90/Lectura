# PARTITURA DE TRABAJO: CURSOR (OLA 34 - FASE 11)
**Proyecto:** Suite Escolar Academia (Laravel 12 + Filament v3) — Escuela Secundaria Técnica Núm. 90  
**Normativa Aplicable:** Ley de Educación de Nuevo León 2026, Guía Operativa UIENL/SENL, Acuerdo Secretarial 97 y Acuerdo 10/09/23.  
**Estado:** `🟢 ENTREGADA PARA AUDITORÍA`

---

## 🎯 OBJETIVO DE LA OLA 34 (FASE 11)
Desarrollar la lógica de negocio, consultas Eloquent optimizadas, widgets de Filament v3 y controladores para el **Sistema de Alertas Tempranas de Abandono Escolar (SIAT-NL)** y el **Radar de Dirección y Prefectura**:
1. **`AlertaTempranaController.php`**: Controlador con métodos `index`, `generarActaSupervision` y `canalizarUdei`, con cálculo automatizado de semáforo de riesgo (🔴 $\ge 3$ inasistencias consecutivas o $> 15\%$ faltas; 🟡 $\ge 2$ materias reprobadas o $< 75$ PPM; 🟢 regular) y método tolerante `asegurarDatosDemo()`.
2. **`RadarAlertaAbandonoWidget.php`**: Widget para el panel de Filament con tarjetas estadísticas de alumnos en riesgo crítico, asistencia promedio del día y tabla rápida de intervención con acciones directas para ver Kárdex 360° y generar Citatorio oficial.
3. **`routes/web.php`**: Registro de rutas públicas de demostración y rutas administrativas autenticadas.

---

## 📐 ESPECIFICACIÓN TÉCNICA Y REGLAS DE ORO

### 1. Controlador `app/Http/Controllers/Reportes/AlertaTempranaController.php`
- **Métodos obligatorios:**
  - `public function index(Request $request)`:
    - Recupera plantel activo (o demo ST90).
    - Carga alumnos activos con sus relaciones (`grupo`, `subgruposTaller.tallerTecnologico`, `registrosAsistencia`, `evaluacionesTrimestrales`, `entregasAula`).
    - Algoritmo de clasificación de riesgo:
      - **Semáforo Rojo (Crítico):** $\ge 3$ inasistencias continuas recientes o inasistencias acumuladas $> 15\%$ en el ciclo/periodo.
      - **Semáforo Amarillo (Rezago):** Promedio general $< 6.0$, o 2 o más disciplinas reprobadas ($< 6$), o velocidad de lectura $< 75$ PPM en entregas de aula.
      - **Semáforo Verde (Regular):** Asistencia $\ge 85\%$ y promedio aprobatorio.
    - Genera array `$kpis`: `total_alumnos`, `alumnos_riesgo_rojo`, `alumnos_riesgo_amarillo`, `asistencia_hoy_pct`, `citatorios_pendientes`, `canalizados_udei`.
    - Genera array `$radarGrados`: asistencia promedio y conteo de alumnos en riesgo agrupados por grado (1°, 2°, 3°) y turno (Matutino / Vespertino).
    - Genera array `$alumnosRiesgo`: lista ordenada de alumnos con mayor nivel de riesgo primero.
    - Retorna `view('reportes.director-radar-alertas-nl', [...])`.
  - `public function generarActaSupervision(Request $request, $periodo = 1)`:
    - Agrupa las estadísticas normativas requeridas por la supervisión de zona escolar (matrícula inicial, bajas, alumnos en riesgo, causas tipificadas por sexo).
    - Retorna `view('reportes.acta-supervision-alerta-temprana-nl', [...])`.
  - `public function canalizarUdei(Request $request, $alumnoId)`:
    - Registra o actualiza el estado de canalización inclusiva del alumno a UDEI / Trabajo Social.
  - `private function asegurarDatosDemo()`:
    - Genera datos mock realistas si la base de datos no cuenta con suficientes alumnos o registros de asistencia para visualizar las vistas.

### 2. Widget Filament `app/Filament/Widgets/RadarAlertaAbandonoWidget.php`
- Widget de tipo `Filament\Widgets\Widget` o `Filament\Widgets\TableWidget` para Filament v3.
- Muestra tarjetas de estadísticas rápidas:
  - Alumnos en Riesgo Crítico (🔴)
  - Asistencia Promedio Hoy (%)
  - Citatorios Pendientes de Acuse
  - Alumnos en Seguimiento UDEI
- Tabla rápida de los 10 alumnos con mayor urgencia de atención con acciones:
  - Acción `Kárdex 360°`: abre `/reportes/expediente-360/{id}` en nueva pestaña.
  - Acción `Citar Padres`: abre `/reportes/citatorio/{id}` o modal de citatorio.

### 3. Rutas en `routes/web.php`
- Rutas públicas (sin middleware de login para demostración y evaluación externa):
  - `Route::get('/reportes/radar-direccion', [AlertaTempranaController::class, 'index'])->name('reportes.radar-direccion');`
  - `Route::get('/reportes/acta-supervision/{periodo?}', [AlertaTempranaController::class, 'generarActaSupervision'])->name('reportes.acta-supervision');`
- Rutas autenticadas dentro de `auth`:
  - `Route::prefix('admin/reportes')->middleware(['auth'])->group(...)` para las mismas acciones y la acción de canalización UDEI.

---

## 📥 FORMATO DE ENTREGA
Escribe el código PHP completo de:
1. `AlertaTempranaController.php`
2. `RadarAlertaAbandonoWidget.php`
3. Fragmento para `routes/web.php`
dentro de este archivo `ENTREGA_CURSOR.md`, etiquetando cada bloque con su ruta respectiva.  
Al terminar, Antigravity validará la sintaxis con `php -l` e integrará la solución.

---

## ENTREGA DE CURSOR (OLA 34)

El PHP ya está en Academia. `php -l` pasó en el controlador, el widget y `routes/web.php`. Las vistas `reportes.director-radar-alertas-nl` y `reportes.acta-supervision-alerta-temprana-nl` siguen a cargo de DeepSeek.

### Archivos

- `app/Http/Controllers/Reportes/AlertaTempranaController.php`
- `app/Filament/Widgets/RadarAlertaAbandonoWidget.php`
- `resources/views/filament/widgets/radar-alerta-abandono-widget.blade.php`
- `routes/web.php`

### Rutas

- `GET /reportes/radar-direccion` → `reportes.radar-direccion`
- `GET /reportes/acta-supervision/{periodo?}` → `reportes.acta-supervision`
- Espejo autenticado: `admin.reportes.radar-direccion` y `admin.reportes.acta-supervision`
- `POST /admin/reportes/canalizar-udei/{alumno}` → `admin.reportes.canalizar-udei` (solo con sesión)

### Contrato del radar

`plantel`, `kpis` (`total_alumnos`, `alumnos_riesgo_rojo`, `alumnos_riesgo_amarillo`, `alumnos_regulares`, `asistencia_hoy_pct`, `citatorios_pendientes`, `canalizados_udei`), `radarGrados` (grado 1-3 × Matutino/Vespertino, con `alumnos`, `riesgo`, `asistencia_promedio`), `alumnosRiesgo`, `demostracion`, `fecha`.

Cada alumno de la lista trae `id`, `matricula`, `nombre`, `sexo` (`H`, `M` o `sin_dato`), `grado`, `grupo`, `turno`, `semaforo` (`rojo`, `amarillo`, `verde`, `sin_datos`), `causas` (`inasistencia`, `rezago`, `lectura`), `motivo`, `faltas_consecutivas`, `porcentaje_faltas`, `porcentaje_asistencia`, `promedio`, `reprobadas`, `ppm`, `es_demo`.

Rojo: 3 o más faltas consecutivas recientes, o faltas acumuladas mayores a 15%. La justificada no cuenta como falta. Amarillo: promedio menor a 6, o dos materias por debajo de 6, o PPM menor a 75. Verde: asistencia de 85% o más y promedio aprobatorio. Sin marcas ni calificaciones el alumno no entra al riesgo. El PPM solo se usa si `sesion_entregas_alumno` tiene `alumno_id`; el promedio del grupo no pinta de amarillo a una persona.

`asistencia_hoy_pct` es null si hoy no hay pase. `citatorios_pendientes` cuenta bitácoras de atención a familias sin acuerdo. `canalizados_udei` cuenta bitácoras con la marca `CANALIZACION_UDEI`.

### Contrato del acta

`plantel`, `periodo`, `periodoNombre`, `matriculaInicial`, `bajas`, `alumnosRiesgo`, `alumnosRiesgoRojo`, `alumnosRiesgoAmarillo`, `causas` (por `H`, `M` y `sin_dato`), `radarGrados`, `demostracion` (siempre false), `fecha`.

### Demostración y canalización

`asegurarDatosDemo()` no inserta alumnos. Si no hay inscripción activa, el radar muestra seis renglones `DEMO-SIAT` con `es_demo` y `demostracion = true`. El acta de supervisión no los incluye: sin matrícula, sus cifras quedan en cero. La canalización crea una bitácora `registro_casos` (valor que el enum de MySQL ya acepta) y no duplica al mismo alumno.

### Widget

El widget del panel muestra las cuatro tarjetas y los diez alumnos con más urgencia. Kárdex y citatorio se abren en otra pestaña solo cuando hay `id`. En la demostración el enlace no aparece.

### Verificación

`php -l` limpio. En esta máquina `php artisan` se quedó esperando al arrancar, así que el tablero no se ejecutó contra una fila. La base local, la última vez que respondió, no tenía alumnos.
