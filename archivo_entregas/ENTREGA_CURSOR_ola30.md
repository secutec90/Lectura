# BUZÓN DE ENTREGA: CURSOR -> ANTIGRAVITY

> **INSTRUCCIÓN PARA CURSOR (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md`, `.skills/aula-constructor/SKILL.md`, `RSC_MIGRACION_FUSION_LARAVEL.md` y esta partitura.  
> Escribe y guarda aquí mismo (`ENTREGA_CURSOR.md`) tu código backend Laravel, componentes Filament y controladores para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js cursor`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura.  
> Entrega anterior (Ola 27) archivada en `archivo_entregas/ENTREGA_CURSOR_ola27.md`.

---

## 🎯 PARTITURA ASIGNADA: OLA 30 (FASE 7) — LÓGICA DE WIDGETS FILAMENT, MODAL DE DETALLE EN RELATIONMANAGER Y CONTROLADOR DE REPORTE TRIMESTRAL NL
- **Agente responsable:** **Cursor** (Desarrollador Backend Laravel 12 & Filament v3)
- **Estado:** 🟢 **PROGRAMADA Y LISTA PARA EJECUCIÓN**
- **Destino en Academia:**
  1. `app/Filament/Resources/SesionClaseResource/Pages/ViewSesionClase.php` (Registro de widgets de métricas en cabecera)
  2. `app/Filament/Resources/SesionClaseResource/RelationManagers/EntregasAlumnoRelationManager.php` (Acción modal de detalle individual por entrega)
  3. `app/Http/Controllers/Reportes/EvaluacionTrimestralController.php` (Cálculo de ponderaciones, 8 hrs de taller tecnológico y generación del reporte)
  4. `routes/web.php` (Ruta para descarga/vista de boleta trimestral oficial)

### Especificación Técnica de Implementación:

#### 1. Conexión de Widgets en `ViewSesionClase.php`:
- Exponer el método `getHeaderWidgets()` retornando:
  - `SesionClaseResource\Widgets\SesionClaseStatsWidget::class`
  - `SesionClaseResource\Widgets\SesionClasePpmChartWidget::class`
- Asegurar que `$this->record` se propague reactivamente con intervalo de sondeo de 10 segundos (`$pollingInterval = '10s'`).

#### 2. Modal de Detalle en `EntregasAlumnoRelationManager.php`:
- Agregar a la tabla de entregas:
  - Columna de estado PPM con colores DUA (Verde para $\ge 115$, Amarillo para $90-114$, Rojo para $< 90$).
  - Columna con el desglose de aciertos del quiz (ej. `3 / 3` aciertos con badge verde o amarillo).
  - Acción de fila `ver_detalle`:
    - Modal Filament con formulario/infolist de solo lectura.
    - Muestra: Alumno/UUID, PPM registrado, hora de entrega y tabla de preguntas contestadas indicando cuál eligió y si fue correcta o incorrecta.

#### 3. Controlador de Reporte Trimestral Oficial NL (`EvaluacionTrimestralController.php`):
- Crear `app/Http/Controllers/Reportes/EvaluacionTrimestralController.php`.
- Método `generarBoletaTrimestral(Request $request, int $alumnoId, int $trimestre = 1)`:
  - Obtener el modelo `Alumno` con sus relaciones: `grupo`, `subgruposTaller.tallerTecnologico` (8 hrs Acuerdo 97), `evaluacionesTrimestrales`.
  - Recopilar asistencias del periodo desde `AsistenciaAlumno`.
  - Calcular promedio de velocidad lectora (PPM) a partir de `SesionEntregaAlumno`.
  - Ponderar las calificaciones de los 4 campos formativos de la NEM y del Taller Tecnológico en escala oficial 5.0 a 10.0 (Acuerdo 10/09/23).
  - Retornar la vista de DeepSeek `view('reportes.evaluacion-trimestral-nl', $datos)`.
- Registrar la ruta en `routes/web.php`:
  `Route::get('/admin/reportes/evaluacion-trimestral/{alumno}/{trimestre?}', [EvaluacionTrimestralController::class, 'generarBoletaTrimestral'])->middleware(['auth'])->name('reportes.evaluacion-trimestral');`

---
## ENTREGA DE CURSOR (OLA 30 — CORRECCIÓN DEL BORRADOR)

El borrador previo conectaba los widgets con una clase relativa inexistente, el modal no decía si la respuesta era correcta y la boleta imprimía 9, 8 y 10 aunque no hubiera captura. El código ya está escrito en Academia. `php -l` pasó en los seis PHP y la vista de la boleta se renderizó con un alumno sin calificaciones: muestra raya, no un 9 inventado.

### 1. Widgets
`ViewSesionClase` registra `SesionClaseStatsWidget` y `SesionClasePpmChartWidget` con `use` real. El registro llega por `getWidgetData()` de Filament. El sondeo de 10 s queda en `$pollingInterval` de cada widget. La acción de boleta solo aparece si el grupo tiene una inscripción activa y abre el trimestre vigente (ago–nov = 1, dic–mar = 2, abr–jul = 3).

`SesionClaseStatsWidget` califica con los identificadores `p_1`, `p_2`… en el orden del portal. La escala de la tarjeta es 5 + 5 × (aciertos / reactivos).

### 2. Modal `ver_detalle`
- PPM: verde ≥ 115, amarillo 90–114, rojo < 90.
- Columna de aciertos `3 / 3`: verde si están todos, amarillo si hay alguno, rojo si ninguno.
- El modal es un infolist de solo lectura: UUID, PPM, hora, tiempo de lectura (palabras ÷ PPM) y calificación SEP.
- La tabla indica enunciado, opción elegida y resultado Correcta o Incorrecta.
- No hay botón de boleta por fila: `sesion_entregas_alumno` no guarda `alumno_id`, solo el UUID del intento.

### 3. Boleta
`generarBoletaTrimestral` responde 404 si el alumno no existe o el trimestre no es 1, 2 o 3. El grupo sale de la inscripción activa (`alumnos` no tiene `grupo_id`). La asistencia sale de `RegistroAsistencia` y, si no hay filas, de `Asistencia`. No existe el modelo `AsistenciaAlumno`.

El taller usa la relación real `subgruposTaller.taller` (el modelo no se llama `tallerTecnologico`). Las calificaciones de `evaluaciones_trimestrales` se agrupan en Lenguajes, Saberes, Ética, Humano y Taller, en escala 5 a 10.

Ponderación, solo con los componentes que sí tienen cifra: campos 40, taller 25, comprensión 15, PPM 10, asistencia 10. El peso faltante se reparte. PPM y comprensión de la boleta son el promedio del grupo en el trimestre, porque el intento no está ligado a la matrícula. La vista lo dice con «promedio del grupo».

Rutas con `auth`:
- `reportes.evaluacion-trimestral` → `/admin/reportes/evaluacion-trimestral/{alumno}/{trimestre?}`
- `reportes.evaluacion-trimestral.corta` → `/reportes/evaluacion-trimestral/{alumno}/{trimestre?}`

### 4. Archivos
- `Academia/app/Filament/Resources/SesionClaseResource/Pages/ViewSesionClase.php`
- `Academia/app/Filament/Resources/SesionClaseResource/Widgets/SesionClaseStatsWidget.php`
- `Academia/app/Filament/Resources/SesionClaseResource/RelationManagers/EntregasAlumnoRelationManager.php`
- `Academia/app/Http/Controllers/Reportes/EvaluacionTrimestralController.php`
- `Academia/app/Models/SesionClase.php`
- `Academia/routes/web.php`
- `Academia/resources/views/reportes/evaluacion-trimestral-nl.blade.php`

### 5. Control de cambios
### 🛠️ [2026-11-17] - Boleta trimestral NL y monitor de entregas
- **Mensaje de Commit sugerido (Conventional Commits):** `fix(aula): calcular la boleta trimestral y el detalle de respuestas con datos reales`
- **Cambios Realizados:**
 - Widgets de sesión con clase correcta, sondeo de 10 s y boleta solo si hay inscripción.
 - Modal `ver_detalle` con aciertos, opción elegida y escala SEP 5 a 10.
 - Controlador de boleta sin calificaciones ficticias; rutas de reporte con autenticación.
- **Archivos Afectados:** `app/Filament/Resources/SesionClaseResource/Pages/ViewSesionClase.php`, `app/Filament/Resources/SesionClaseResource/RelationManagers/EntregasAlumnoRelationManager.php`, `app/Http/Controllers/Reportes/EvaluacionTrimestralController.php`, `app/Models/SesionClase.php`, `routes/web.php`, `resources/views/reportes/evaluacion-trimestral-nl.blade.php`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** La entrega no tiene matrícula, así que el PPM de la boleta es el del grupo y la vista lo declara. No reabrir notas de relleno 8/9/10. El siguiente paso es guardar `alumno_id` en `sesion_entregas_alumno` para que la boleta deje de usar el promedio grupal.

### 6. Brújula
Ola 30 corregida en Academia, pendiente de auditoría de Antigravity. No hubo commit ni clasp push.
