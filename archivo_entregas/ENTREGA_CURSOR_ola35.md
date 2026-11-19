# PARTITURA DE TRABAJO: CURSOR (OLA 35 - FASE 12)
**Proyecto:** Suite Escolar Academia (Laravel 12 + Filament v3) — Escuela Secundaria Técnica Núm. 90  
**Normativa Aplicable:** Ley de Educación de Nuevo León 2026, Guía Operativa para la Convivencia Escolar Sana y Pacífica (UIENL/SENL), Protocolo de Mediación Escolar y Acuerdo 97.  
**Estado:** `🟢 ENTREGADA PARA AUDITORÍA`

---

## 🎯 OBJETIVO DE LA OLA 35 (FASE 12)
Módulo de mediación escolar, protocolo de convivencia y bitácora de incidencias. El PHP ya está en Academia. `php -l` pasó en el controlador, `AlumnoResource.php`, `BitacoraEscolarResource.php` y `routes/web.php`. Las vistas `reportes.acta-mediacion-escolar-nl` y `reportes.talonario-citatorio-incidencia-nl` siguen a cargo de DeepSeek.

### Archivos

- `app/Http/Controllers/Reportes/MediacionEscolarController.php`
- `app/Filament/Resources/AlumnoResource.php`
- `app/Filament/Resources/BitacoraEscolarResource.php`
- `routes/web.php`

### Rutas

- `GET /reportes/acta-mediacion/{folio?}` → `reportes.acta-mediacion`
- `GET /reportes/citatorio-incidencia/{id?}` → `reportes.citatorio-incidencia`
- Espejo autenticado: `admin.reportes.acta-mediacion` y `admin.reportes.citatorio-incidencia`
- `POST /admin/reportes/mediacion/acuerdo` → `admin.reportes.mediacion-acuerdo` (solo con sesión)

El folio acepta `MED-2026-0012` o el id numérico de la bitácora. Sin folio, o con folio que no es una mediación, el acta muestra la demostración.

### Contrato del acta

`plantel`, `folio`, `fecha`, `hora`, `fecha_iso`, `demostracion`, `alumno` (`id`, `nombre`, `matricula`, `grado`, `grupo`, `turno`), `incidencia` (`tipo_falta` = `leve` | `moderada` | `grave`, `tipo_etiqueta`, `descripcion_hechos`, `lugar_hechos`, `docente_reporta`), `acuerdos` (lista de textos, un compromiso por elemento), `seguimiento`, `firmas` (`alumno`, `tutor`, `mediador`, `director`).

Tipo I leve, Tipo II moderada, Tipo III grave. En `registros_incidencias` el nivel queda Bajo, Medio o Alto.

### Contrato del citatorio

Las mismas llaves del acta, más `cita` (`fecha`, `fecha_larga`, `hora`, `lugar`, `motivo`). El `{id}` de la ruta es el alumno. Si ese alumno ya tiene mediación, el talón usa esa acta. Si no, conserva su nombre y grupo y marca `demostracion`. La fecha de cita se puede pasar por `fecha_cita`, `hora_cita` y `lugar`.

### Registro

`registrarAcuerdo` exige sesión de personal. No inserta alumnos de demostración. Crea una incidencia y una bitácora `registro_casos` en la misma transacción. La bitácora lleva la marca `[MEDIACION_ESCOLAR]`, el folio y el id de la incidencia. Los acuerdos van en `acuerdos_compromisos`, un renglón por compromiso. La tipificación queda en `cambios_conducta`.

### Filament

En Alumnos, la barra tiene «Iniciar mediación» (busca al alumno) y cada fila tiene «Mediación» y «Citar por incidencia». En Bitácoras, el acta y el citatorio solo aparecen si el registro trae la marca de mediación.

### Verificación

`php -l` limpio en los cuatro archivos. Las vistas Blade todavía no están en Academia, así que el tablero no se abrió en el navegador.
