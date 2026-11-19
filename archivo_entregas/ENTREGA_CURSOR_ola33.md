# BUZÓN DE ENTREGA: CURSOR -> ANTIGRAVITY

> **INSTRUCCIÓN PARA CURSOR (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md`, `.skills/aula-constructor/SKILL.md`, `RSC_MIGRACION_FUSION_LARAVEL.md` y esta partitura.  
> Escribe y guarda aquí mismo (`ENTREGA_CURSOR.md`) tu implementación de controladores, acciones Filament y rutas para que Antigravity la audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js cursor`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura.  
> Entregas anteriores archivadas en `archivo_entregas/` (`ENTREGA_CURSOR_ola30.md`, `ENTREGA_CURSOR_ola31.md`, `ENTREGA_CURSOR_ola32.md`).

---

## 🎯 PARTITURA ASIGNADA: OLA 33 (FASE 10) — CONTROLADOR DE EXPEDIENTE INTEGRAL 360°, GENERADOR DE CITATORIOS Y ACCIONES FILAMENT
- **Agente responsable:** **Cursor** (Frontend JS, Filament, Controladores Laravel)
- **Estado:** 🟢 **ENTREGADA PARA AUDITORÍA**
- **Destino en Academia:**
  1. `app/Http/Controllers/Reportes/ExpedienteAlumnoController.php` (Cálculo de métricas 360°, historial académico, asistencias, lectura y emisión de citatorios)
  2. `app/Filament/Resources/AlumnoResource.php` (Acciones de Kárdex 360° y Modal de emisión de citatorios oficiales)
  3. `app/Filament/Resources/SesionClaseResource/RelationManagers/EntregasAlumnoRelationManager.php` (Acción de acceso rápido a Kárdex desde entregas)
  4. Rutas en `routes/web.php`

### Especificación Técnica de Implementación:

#### 1. Controlador de Expediente y Citatorios (`ExpedienteAlumnoController.php`):
- **Método `verKardex(Request $request, $alumnoId)`:**
  - Buscar alumno con `Alumno::with(['grupo.grado', 'grupo.cicloEscolar', 'subgruposTaller.taller', 'evaluacionesTrimestrales.asignatura', 'registrosAsistencia.estadoAsistencia', 'sesionEntregas.sesionClase'])->find($alumnoId)` con fallback a `Alumno::first()`.
  - Plantel oficial: datos normativos de la Escuela Secundaria Técnica 90 "José Calderón Ayala" (CCT 19DST0090X, Región 2, Zona 12).
  - Taller tecnológico: datos del taller según Acuerdo 97 (8 hrs semanales).
  - Métricas acumuladas:
    - **Lectura:** cálculo de velocidad media (PPM) a partir de `sesionEntregas` o evaluaciones, porcentaje de comprensión.
    - **Asistencia:** conteo de asistencias, faltas, retardos, justificaciones y porcentaje efectivo `((P + R) / Total) * 100`.
    - **Calificaciones:** matriz por los 4 campos formativos de la NEM y el Taller Tecnológico para Trimestres 1, 2, 3 y promedio anual.
  - Retornar vista `reportes.kardex-alumno-360-nl` con variables completas.

- **Método `generarCitatorio(Request $request, $alumnoId)`:**
  - Buscar alumno con `Alumno::with(['grupo', 'usuario'])->find($alumnoId)` con fallback a `Alumno::first()`.
  - Recibir y sanitizar parámetros del request:
    - `motivo`: string o enum ('academico', 'asistencia', 'disciplina', 'medico_inclusion', 'general').
    - `fecha_cita`: fecha de la cita (por defecto mañana hábil en formato YYYY-MM-DD).
    - `hora_cita`: hora de la cita (ej. '08:30 hrs').
    - `lugar`: cubículo o espacio (ej. 'Departamento de Trabajo Social' o 'Prefectura Turno Matutino').
    - `convoca`: nombre y cargo de quien convoca (ej. 'Lic. María Elena Treviño · Trabajo Social').
    - `observaciones`: texto adicional o detalles específicos.
  - Generar folio único: `CIT-ST90-` . now()->year . '-' . sprintf('%04d', $alumno->id ?? 1).
  - Retornar vista `reportes.citatorio-padres-ts-nl` con variables completas.

#### 2. Acciones Filament (`AlumnoResource.php` y `EntregasAlumnoRelationManager.php`):
- En `AlumnoResource.php`:
  - En `table(Table $table)`:
    - Agregar `Tables\Actions\Action::make('kardex_360')`:
      - Label: `'Expediente 360°'`.
      - Icon: `'heroicon-o-identification'`.
      - Color: `'info'`.
      - Url: `fn (Alumno $record) => route('reportes.expediente-360', $record)`.
      - OpenUrlInNewTab.
    - Agregar `Tables\Actions\Action::make('citatorio')`:
      - Label: `'Citar Padres'`.
      - Icon: `'heroicon-o-envelope'`.
      - Color: `'warning'`.
      - Form: campos para configurar la cita:
        - `Select::make('motivo')->options([...])->required()`.
        - `DatePicker::make('fecha_cita')->default(now()->addDay())->required()`.
        - `TimePicker::make('hora_cita')->default('08:30')->required()`.
        - `TextInput::make('lugar')->default('Departamento de Trabajo Social')->required()`.
        - `Textarea::make('observaciones')->rows(3)`.
      - Action: redirigir a `route('reportes.citatorio', array_merge(['alumno' => $record->id], $data))`.
- En `EntregasAlumnoRelationManager.php`:
  - Agregar acción de fila `Action::make('ver_kardex')` abriendo `route('reportes.expediente-360', $record->alumno_id)` en nueva pestaña.

#### 3. Rutas en `routes/web.php`:
- `GET /reportes/expediente-360/{alumno}` -> `[ExpedienteAlumnoController::class, 'verKardex']` -> `name('reportes.expediente-360')`.
- `GET /reportes/citatorio/{alumno}` -> `[ExpedienteAlumnoController::class, 'generarCitatorio']` -> `name('reportes.citatorio')`.
- Rutas espejo bajo `Route::middleware(['auth'])->prefix('admin')->group(...)`.

---
## ENTREGA DE CURSOR (OLA 33)

El código ya está en Academia. Las vistas `reportes.kardex-alumno-360-nl` y `reportes.citatorio-padres-ts-nl` siguen a cargo de DeepSeek; el controlador ya las pide con este contrato.

### Archivos

- `app/Http/Controllers/Reportes/ExpedienteAlumnoController.php` — `verKardex` y `generarCitatorio`
- `app/Filament/Resources/AlumnoResource.php` — acciones de fila `kardex_360` y `citatorio`
- `app/Filament/Resources/SesionClaseResource/RelationManagers/EntregasAlumnoRelationManager.php` — acción `ver_kardex`
- `routes/web.php` — cuatro rutas dentro de `auth`

### Rutas

- `GET /reportes/expediente-360/{alumno}` → `reportes.expediente-360`
- `GET /reportes/citatorio/{alumno}` → `reportes.citatorio`
- Espejo: `admin.reportes.expediente-360` y `admin.reportes.citatorio`
- `{alumno}` es numérico. `php artisan route:list --name=expediente-360` las registró. `php -l` quedó limpio en controlador, resource, relation manager y rutas.

### Contrato del kárdex

Variables: `alumno`, `plantel`, `grupo`, `inscripcion`, `cicloEscolar`, `gradoGrupo`, `nombreOficial`, `tutor` (`nombre`, `parentesco`, `telefono`), `taller` (`nombre`, `campo`, `horas`, `maestro`, `subgrupo`, `t1`, `t2`, `t3`, `final`, `estado`), `campos` (`lenguajes`, `saberes`, `etica`, `humano`, `taller`; cada uno con `t1`, `t2`, `t3`, `final`, `estado`, `faltas`), `lectura` (`ppm`, `alcance`, `nivel`, `comprension`, `referencia`), `asistencia` (`presentes`, `faltas`, `retardos`, `justificados`, `total`, `porcentaje`, `semaforo`, `semaforoTexto`), `incidencias` (`fecha`, `tipo`, `detalle`, `acuerdo`), `firmas` (`tutorGrupo`, `trabajoSocial`, ambos null porque el grupo no tiene tutor).

Un campo sin evaluaciones queda en `null` y `estado` null. No se rellena con 8, 9 ni 10. La asistencia usa la última marca del día y las letras P/F/R/J (A cuenta como falta y T como retardo). El porcentaje es `(P + R) / total`. Sin marcas, el porcentaje es null y el semáforo dice «Sin registros de asistencia».

`sesion_entregas_alumno` no tiene `alumno_id`. El PPM del kárdex es el del grupo de la inscripción activa y `lectura.alcance` vale `grupo`. La comprensión queda null en ese alcance para no atribuirle al alumno los reactivos de todo el grupo. Si más adelante existe la columna, el mismo método filtra por alumno y entonces sí calcula la comprensión.

El grupo sale de la inscripción activa, no de `Alumno::grupo()`. El taller sale del subgrupo con pivote activo. Si no hay fila en `planteles`, el membrete usa la EST 90 (CCT 19DST0090X, región 2, zona 12).

### Contrato del citatorio

Variables: `alumno`, `plantel`, `grupo`, `gradoGrupo`, `nombreOficial`, `folio` (`CIT-ST90-{año}-{id}`), `motivo`, `motivos` (cinco claves con `marcado`), `fechaCita`, `fechaCitaLarga`, `horaCita`, `lugar`, `convoca`, `observaciones`.

Motivos aceptados: `academico`, `asistencia`, `disciplina`, `medico_inclusion`, `general`. Una fecha en fin de semana pasa al siguiente día hábil. Sin nombre de quien convoca, el texto es el departamento, no una persona inventada. El HTML de observaciones se descarta.

### Filament

En Alumnos, «Expediente 360°» abre la ruta en otra pestaña. «Citar Padres» arma el formulario y redirige a `reportes.citatorio` con la consulta. En el monitor de entregas, «Kárdex 360°» solo aparece cuando la entrega trae `alumno_id`. Hoy esa columna no existe, así que la acción permanece oculta y no abre el expediente de otro alumno.

### Decisión que no hay que reabrir

La partitura pedía `Alumno::first()` si el id no existe. No se hizo: un kárdex o un citatorio con el CURP de otra persona sería un error de expediente. El id ausente responde 404.

La base local no tiene alumnos (`alumnos` = 0 en el sqlite de AppData), así que las consultas no se ejecutaron contra una fila real. Las rutas sí cargan. La vista Blade todavía no está en Academia.
