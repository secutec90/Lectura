# BUZÓN DE ENTREGA: CURSOR -> ANTIGRAVITY

> **INSTRUCCIÓN PARA CURSOR (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md`, `.skills/aula-constructor/SKILL.md`, `RSC_MIGRACION_FUSION_LARAVEL.md` y esta partitura.  
> Escribe y guarda aquí mismo (`ENTREGA_CURSOR.md`) tu código backend Laravel, componentes Filament y controladores para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js cursor`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura.  
> Entrega anterior (Ola 30) archivada en `archivo_entregas/ENTREGA_CURSOR_ola30.md`.

---

## 🎯 PARTITURA ASIGNADA: OLA 31 (FASE 8) — CONTROLADOR DE ASISTENCIA RÁPIDA, EMISIÓN MASIVA DE BOLETAS Y ACCIONES FILAMENT
- **Agente responsable:** **Cursor** (Desarrollador Backend Laravel 12 & Filament v3)
- **Estado:** 🟢 **PROGRAMADA Y LISTA PARA EJECUCIÓN**
- **Destino en Academia:**
  1. `app/Http/Controllers/Aula/AsistenciaRapidaController.php` (Lógica de vista y guardado en lote de asistencia)
  2. `app/Http/Controllers/Reportes/EvaluacionTrimestralController.php` (Método `generarBoletasGrupo`)
  3. `app/Filament/Resources/SesionClaseResource/Pages/ViewSesionClase.php` (Acción `pase_lista_rapido`)
  4. `app/Filament/Resources/GrupoResource.php` (Acción `imprimir_boletas_masivas`)
  5. `routes/web.php` (Rutas para pase de lista rápido y boletas grupales)

### Especificación Técnica de Implementación:

#### 1. Controlador `AsistenciaRapidaController.php`:
- Método `vistaAsistencia(Request $request, int $sesionId)`:
  - Carga la `SesionClase` con `grupo.alumnos`, `taller` (si aplica por Acuerdo 97) y `asistencias` previas de la fecha.
  - Genera una lista normalizada de alumnos con su estado actual (presente por defecto si no hay registro previo).
  - Retorna `view('aula.asistencia-rapida', compact('sesion', 'alumnos', 'stats'))`.
- Método `guardarAsistencia(Request $request, int $sesionId)`:
  - Recibe un payload JSON o form POST con `asistencias: [ { alumno_id: 1, estado: "presente"|"falta"|"retardo"|"justificado", observaciones?: "" } ]`.
  - Inicia transacción en BD (`DB::transaction`) y guarda/actualiza en `asistencias` y `registros_asistencia`.
  - Retorna `{ ok: true, actualizados: count, mensaje: "Asistencia guardada exitosamente" }`.

#### 2. Método `generarBoletasGrupo` en `EvaluacionTrimestralController.php`:
- `generarBoletasGrupo(Request $request, int $grupoId, int $trimestre = 1)`:
  - Carga el `Grupo` con todos sus alumnos ordenados alfabéticamente por apellido.
  - Para cada alumno, calcula su conjunto de calificaciones en los 4 campos formativos NEM, su taller tecnológico asignado (8 hrs) y su promedio de PPM.
  - Retorna `view('reportes.evaluacion-trimestral-grupo-nl', compact('grupo', 'alumnosDatos', 'plantel', 'trimestre', 'cicloEscolar'))`.

#### 3. Acciones en Filament:
- En `ViewSesionClase.php`:
  - Agregar acción en cabecera:
    `Action::make('pase_lista_rapido')->label('Pase de Lista Rápido')->icon('heroicon-o-check-badge')->color('success')->url(fn () => route('aula.asistencia-rapida', ['sesionId' => $this->record->id]))`
- En `routes/web.php`:
  - `Route::get('/aula/sesion/{sesionId}/asistencia-rapida', [AsistenciaRapidaController::class, 'vistaAsistencia'])->name('aula.asistencia-rapida');`
  - `Route::post('/aula/sesion/{sesionId}/asistencia-rapida', [AsistenciaRapidaController::class, 'guardarAsistencia'])->name('aula.asistencia-rapida.guardar');`
  - `Route::get('/reportes/evaluacion-trimestral/grupo/{grupo}/{trimestre?}', [EvaluacionTrimestralController::class, 'generarBoletasGrupo'])->name('reportes.evaluacion-trimestral-grupo');`

---
## ENTREGA DE CURSOR (OLA 31)

El pase de lista y las boletas del grupo quedaron en Academia. `php -l` pasó en los dos controladores.

### 1. Pase de lista
La pantalla usa `estado_id` 1 presente, 2 falta, 3 retardo y 4 justificado. Esos números no son los id de `estados_asistencia` (ahí Tarde puede ser el 2). El controlador traduce la pantalla a las abreviaturas P, A, T y J antes de guardar.

Si la materia es de taller, la lista sale del subgrupo (Acuerdo 97), primero el del docente de la sesión. Si ese subgrupo no tiene alumnos, usa las inscripciones activas del grupo. No rellena la lista con otros alumnos de la escuela. Quien no tiene registro queda en presente.

El guardado es una transacción sobre `registros_asistencia` y, si hay horario del grupo, también sobre `asistencias`. Responde `{ ok: true, actualizados, mensaje }`. Entra el prefecto, el administrador o el docente de esa sesión.

### 2. Boletas del grupo
`generarBoletasGrupo` responde 404 si el grupo no existe o el trimestre no es 1, 2 o 3. Solo entran inscripciones activas, por apellido. Las notas salen de `evaluaciones_trimestrales`. Si no hay captura, el dato queda vacío. El PPM es el del grupo en el trimestre.

### 3. Filament y rutas
- Sesión: `pase_lista_rapido` e `imprimir_boletas_masivas`.
- Grupos: acción de tabla `imprimir_boletas_masivas`.
- Rutas con sesión iniciada. La del grupo va antes que la boleta individual, para que `grupo` no se lea como id de alumno.

La materia de la sesión es texto. La vista ya no intenta leerla como relación.

### 4. Archivos
- `Academia/app/Http/Controllers/Aula/AsistenciaRapidaController.php`
- `Academia/app/Http/Controllers/Reportes/EvaluacionTrimestralController.php`
- `Academia/app/Filament/Resources/SesionClaseResource/Pages/ViewSesionClase.php`
- `Academia/app/Filament/Resources/GrupoResource.php`
- `Academia/routes/web.php`
- `Academia/resources/views/aula/asistencia-rapida.blade.php`

### 5. Control de cambios
### 🛠️ [2026-11-17] - Pase de lista rápido y boletas por grupo
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(aula): guardar el pase de lista y emitir las boletas del grupo`
- **Cambios Realizados:**
 - Lista rápida por grupo o subgrupo de taller, traduciendo el estado de la pantalla al catálogo real.
 - Boletas del grupo sin calificaciones inventadas ni alumnos ajenos.
 - Acciones de Filament y rutas con autenticación.
- **Archivos Afectados:** `app/Http/Controllers/Aula/AsistenciaRapidaController.php`, `app/Http/Controllers/Reportes/EvaluacionTrimestralController.php`, `app/Filament/Resources/SesionClaseResource/Pages/ViewSesionClase.php`, `app/Filament/Resources/GrupoResource.php`, `routes/web.php`, `resources/views/aula/asistencia-rapida.blade.php`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** El 2 de la pantalla es falta, no el id de Tarde en la base. No volver a guardar `estado_id` crudo. No reabrir el relleno de 35 alumnos ni las notas 8/9/10 de la boleta masiva. La boleta individual sigue con su cálculo anterior.

### 6. Brújula
Ola 31 lista para auditoría. No hubo commit ni clasp push.
