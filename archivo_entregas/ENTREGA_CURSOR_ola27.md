# BUZÓN DE ENTREGA: CURSOR -> ANTIGRAVITY

> **INSTRUCCIÓN PARA CURSOR (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md`, `.skills/aula-constructor/SKILL.md`, `RSC_MIGRACION_FUSION_LARAVEL.md` y esta partitura.  
> Escribe y guarda aquí mismo (`ENTREGA_CURSOR.md`) tu código backend Laravel y componentes Filament para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js cursor`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura.  
> Entrega anterior (Ola 26) archivada en `archivo_entregas/ENTREGA_CURSOR_ola26.md`.

---

## 🎯 PARTITURA ASIGNADA: OLA 27 (FASE 4) — FILAMENT ACTIONS: APERTURA CONSTRUCTOR, INICIAR AULA Y MONITOR DE ENTREGAS
- **Agente responsable:** **Cursor** (Desarrollador Fullstack & Filament v3)
- **Estado:** 🟢 **ENTREGADA — PENDIENTE AUDITORÍA ANTIGRAVITY**
- **Carpeta espejo:** `entregas-laravel-ola27/` (copiar a Academia bajo rutas indicadas)
- **DeepSeek en paralelo:** `modal-proyeccion-aula.blade.php` (estilos), `monitor-entregas.blade.php`, `proyeccion-aula.css` — IDs respetados en blade mínimo de Cursor.

### Resumen técnico
1. **`disenar_clase`:** Action en tabla `SesionClaseResource` → `route('aula.constructor', ['sesionId' => $record->id])` con `openUrlInNewTab()`.
2. **`iniciar_en_vivo`:** `AulaTokenService` genera token 6–8 caracteres alfanuméricos en mayúsculas (sin O/0/I/1), persiste `token_acceso` si faltaba, `estado_sesion = en_vivo`, modal con vista que expone `#codigoAccesoAula`, `#enlaceCompletoAula`, `#btnCopiarEnlaceAula`, `#contenedorQRAula` + QR SVG ligero (`QrSvgGenerator`).
3. **`monitor_entregas`:** `EntregasAlumnoRelationManager` con `poll('10s')` sobre relación `entregasAlumno`; acceso rápido desde tabla a `ViewSesionClase`; datos agregados en `ViewSesionClase::getViewData()`; endpoint JSON opcional `monitorEntregas` para widgets.

### Archivos entregados
| Ruta espejo | Destino Academia |
|-------------|------------------|
| `app/Services/AulaTokenService.php` | `app/Services/AulaTokenService.php` |
| `app/Support/QrSvgGenerator.php` | `app/Support/QrSvgGenerator.php` (opcional sustituir por BaconQrCode) |
| `app/Filament/Resources/SesionClaseResource.php` | Fusionar actions con Resource existente |
| `app/Filament/Resources/SesionClaseResource/Pages/*.php` | Solo si el Resource no tiene páginas |
| `app/Filament/Resources/.../EntregasAlumnoRelationManager.php` | Registrar en `getRelations()` |
| `resources/views/filament/resources/sesion-clase/modal-proyeccion-aula.blade.php` | Fusionar markup DeepSeek + IDs |
| `app/Models/SesionClase.php` + `SesionEntregaAlumno.php` | Solo relación `entregasAlumno()` si falta |
| `app/Http/Controllers/Aula/SesionAulaController-monitor-ola27.php` | Método `monitorEntregas` al controller |
| `routes/api-aula-ola27-snippet.php` | Incluir en `routes/api.php` con policy acordada |

### Integración Antigravity (checklist)
- [ ] Verificar nombre real de tabla/modelo (`sesiones_clase` vs convención Academia).
- [ ] Policies `gestionar-sesiones-aula` / visibilidad docente en actions (`visible()` hoy usa solo `auth()->check()` — reemplazar por permisos reales).
- [ ] Ruta `aula.portal.alumno` debe coincidir con Ola 26 (`/aula/sesion/{token}`).
- [ ] En `iniciar_en_vivo`, asegurar que el modal se muestra **después** de guardar `en_vivo` (ajustar orden Filament si el modal previo no persiste).
- [ ] DeepSeek: sustituir estilos del blade mínimo sin cambiar IDs del contrato.

### Conventional Commits (sugerido)
```
feat(filament): puente SesionClase — diseñar, proyección en vivo y monitor de entregas (ola 27)
```

---
## ENTREGA DE CURSOR (escribir debajo)

**Fecha entrega:** 2026-11-13 (America/Monterrey)

**Estado:** Código listo en `entregas-laravel-ola27/`. Sin `git commit` / `clasp push` desde Cursor.
