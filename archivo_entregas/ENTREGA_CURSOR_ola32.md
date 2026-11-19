# BUZÓN DE ENTREGA: CURSOR -> ANTIGRAVITY

> **INSTRUCCIÓN PARA CURSOR (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md`, `.skills/aula-constructor/SKILL.md`, `RSC_MIGRACION_FUSION_LARAVEL.md` y esta partitura.  
> Escribe y guarda aquí mismo (`ENTREGA_CURSOR.md`) tu implementación de controladores, JS cliente y comandos para que Antigravity la audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js cursor`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura.  
> Entregas anteriores archivadas en `archivo_entregas/` (`ENTREGA_CURSOR_ola30.md`, `ENTREGA_CURSOR_ola31.md`).

---

## 🎯 PARTITURA ASIGNADA: OLA 32 (FASE 9) — CONTROLADOR SÁBANA MENSUAL, COLA OFFLINE Y COMANDO DE RESPALDO SQLITE
- **Agente responsable:** **Cursor** (Frontend JS, Filament, Controladores Laravel, Artisan)
- **Estado:** 🟢 **PROGRAMADA Y LISTA PARA EJECUCIÓN**
- **Destino en Academia:**
  1. `app/Http/Controllers/Reportes/AsistenciaMensualController.php` (Cálculo de matriz de asistencia 1-31 y totales mensuales)
  2. Lógica JavaScript de Cola Offline (`localStorage`) para `resources/views/aula/asistencia-rapida.blade.php`
  3. `app/Console/Commands/RespaldarBaseDatos.php` (Comando `academia:respaldo-bd` con compresión `.sqlite.gz` y retención de 7 días)
  4. Rutas en `routes/web.php` y `routes/console.php` + Acciones Filament

### Especificación Técnica de Implementación:

#### 1. Controlador de Sábana Mensual (`AsistenciaMensualController.php`):
- **Método principal:** `public function generarSabana(Request $request, int $grupoId, ?int $mes = null, ?int $anio = null)`
  - Si `$mes` o `$anio` no se proporcionan, tomar el mes y año actual (`now()->month`, `now()->year`).
  - Obtener el grupo con grado y ciclo escolar: `Grupo::with(['grado', 'cicloEscolar'])->findOrFail($grupoId)`.
  - Plantel: datos oficiales de ST90 (CCT 19DST0090X, Región 2, Zona 12, etc.).
  - Días del mes: calcular `daysInMonth`, determinar qué días son sábado/domingo (`$carbon->isWeekend()`) y días hábiles.
  - Alumnos: inscripciones activas ordenadas alfabéticamente por apellido paterno, materno, nombre.
  - Asistencias: consultar sesiones de clase del grupo en ese mes y sus `registros_asistencia`.
  - Construir matriz indexada por alumno:
    - `$asistenciasPorAlumno[$alumnoId][$dia] = ['estado' => 'P'|'F'|'R'|'J', 'color' => ...]`
    - Acumulados mensuales por alumno: `totales['presentes']`, `totales['faltas']`, `totales['retardos']`, `totales['justificados']`, `porcentaje_asistencia`.
  - Retornar vista `reportes.sabana-asistencia-mensual-nl` con variables: `$grupo`, `$plantel`, `$mes`, `$anio`, `$diasDelMes`, `$alumnos`, `$matrizAsistencia`, `$totalesGenerales`.

#### 2. Motor de Cola Offline para `asistencia-rapida.blade.php`:
- Implementar en la vista `asistencia-rapida.blade.php`:
  - Clave en storage: `'cola_asistencias_st90'`.
  - Al dar clic en `btnGuardar`:
    - Intentar `fetch('/api/aula/sesion/' + sesionId + '/asistencia', { method: 'POST', ... })`.
    - Si falla la conexión (`!navigator.onLine` o `catch (err)`):
      - Guardar el payload en `localStorage` con timestamp y sesionId.
      - Actualizar badge `#badgeEstadoRed` a `🟠 Sin conexión (X pendientes en cola)`.
      - Mostrar toast: `"Asistencia guardada sin conexión en el dispositivo. Se enviará automáticamente al reconectarse."`
  - Escuchar eventos de red:
    - `window.addEventListener('online', sincronizarColaOffline);`
    - Intervalo de reintento cada 30 segundos si hay elementos en cola.
  - Función `sincronizarColaOffline()`:
    - Recorre la cola y envía cada lote con POST. Al confirmar `ok: true`, lo remueve de la cola y actualiza el badge a `🟢 En línea`.

#### 3. Comando Artisan de Respaldo SQLite (`RespaldarBaseDatos.php`):
- **Comando:** `php artisan academia:respaldo-bd`
- **Lógica:**
  - Detectar la ruta activa de SQLite (`config('database.connections.sqlite.database')` o `/data/database.sqlite` / `database/database.sqlite`).
  - Crear directorio de destino: `storage/app/respaldos/`.
  - Copiar y comprimir con `gzencode(file_get_contents($dbPath), 9)` a `academia_backup_{Y-m-d_His}.sqlite.gz`.
  - Purgar respaldos más antiguos que `--dias=7`.
  - Registrar en `routes/console.php`: `Schedule::command('academia:respaldo-bd')->dailyAt('02:00');`.

#### 4. Rutas y Enlaces:
- En `routes/web.php`:
  - `GET /reportes/asistencia-mensual/{grupo}/{mes?}/{anio?}` -> `[AsistenciaMensualController::class, 'generarSabana']` -> `name('reportes.asistencia-mensual')`.
- En `ViewSesionClase.php`:
  - Agregar botón de acción en cabecera: `Action::make('sabana_mensual')->label('Sábana Mensual')->icon('heroicon-o-table-cells')->url(...)`.

---
## ENTREGA DE CURSOR (OLA 32)

La sábana mensual, la cola sin conexión y el comando de respaldo quedaron en Academia. `php -l` pasó y `php artisan academia:respaldo-bd --help` muestra el comando.

### 1. Sábana mensual
`generarSabana` usa el mes y el año actuales si no vienen en la ruta. Arma 31 columnas: las que no existen en el mes quedan marcadas con `existe: false`. Sábado y domingo van con `fin_de_semana`. Los alumnos son las inscripciones activas, por apellido.

La celda guarda `P`, `F`, `R` o `J`. En la base, falta puede ser `A` o `F` y retardo `T` o `R`; la sábana los unifica. Si un alumno tiene dos registros el mismo día, se queda el último. El porcentaje cuenta presente y retardo sobre las marcas del mes.

La vista recibe `grupo`, `plantel`, `mes`, `anio`, `diasDelMes`, `alumnos`, `matrizAsistencia` y `totalesGenerales`.

### 2. Cola offline
En el pase de lista, Guardar llama a `POST /api/aula/sesion/{id}/asistencia`. Esa ruta ya existía y ahora exige sesión y cookie, porque el navegador manda el token CSRF. Si no hay red o el envío falla, el lote se guarda en `localStorage` con la clave `cola_asistencias_st90`, el badge `#badgeEstadoRed` pasa a naranja y el toast avisa que se enviará al reconectar. Al volver la red, y cada 30 segundos, `sincronizarColaOffline` reintenta y quita de la cola lo que respondió `ok: true`.

### 3. Respaldo
`php artisan academia:respaldo-bd` busca la SQLite de la conexión, luego `/data/database.sqlite` y `database/database.sqlite`. Escribe `storage/app/respaldos/academia_backup_{fecha}.sqlite.gz` y borra los que pasen de `--dias=7`. Quedó programado a las 02:00 en `routes/console.php`.

### 4. Enlace
En la sesión, la acción `sabana_mensual` abre el mes en curso del grupo. La ruta es `reportes.asistencia-mensual`, con sesión iniciada.

### 5. Archivos
- `Academia/app/Http/Controllers/Reportes/AsistenciaMensualController.php`
- `Academia/app/Console/Commands/RespaldarBaseDatos.php`
- `Academia/resources/views/aula/asistencia-rapida.blade.php`
- `Academia/routes/web.php`
- `Academia/routes/api.php`
- `Academia/routes/console.php`
- `Academia/app/Filament/Resources/SesionClaseResource/Pages/ViewSesionClase.php`
- `Academia/app/Http/Controllers/Aula/AsistenciaRapidaController.php`

### 6. Control de cambios
### 🛠️ [2026-11-17] - Sábana mensual, cola offline y respaldo SQLite
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(aula): agregar la sábana mensual, la cola offline y el respaldo sqlite`
- **Cambios Realizados:**
 - Matriz de asistencia del mes, con días 1 a 31 y letras P, F, R y J.
 - Cola `localStorage` del pase de lista, con reintento al volver la red.
 - Comando `academia:respaldo-bd` diario, comprimido y con retención de 7 días.
- **Archivos Afectados:** `app/Http/Controllers/Reportes/AsistenciaMensualController.php`, `app/Console/Commands/RespaldarBaseDatos.php`, `resources/views/aula/asistencia-rapida.blade.php`, `routes/web.php`, `routes/api.php`, `routes/console.php`, `app/Filament/Resources/SesionClaseResource/Pages/ViewSesionClase.php`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** La pantalla usa 1 presente, 2 falta, 3 retardo y 4 justificado. La sábana no lee esos números: lee la abreviatura y acepta tanto A/T como F/R. El POST de la cola va por `/api/aula/sesion/{id}/asistencia` con middleware web y auth para que la cookie de Filament sirva. No mover ese envío a una ruta sin sesión.

### 7. Brújula
Ola 32 lista para auditoría. No hubo commit ni clasp push.
