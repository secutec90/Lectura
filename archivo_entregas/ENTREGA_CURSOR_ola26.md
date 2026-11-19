# BUZÓN DE ENTREGA: CURSOR -> ANTIGRAVITY

> **INSTRUCCIÓN PARA CURSOR (REGLA AUTOMÁTICA):**
> Lee `ESTADO_COORDINACION.md`, `.skills/aula-constructor/SKILL.md`, `RSC_MIGRACION_FUSION_LARAVEL.md` y esta partitura.
> Escribe y guarda aquí mismo (`ENTREGA_CURSOR.md`) tu JS cliente y controlador Laravel para que Antigravity lo audite e integre.
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** `node herramientas/centinela_buzon.js cursor`
> Entrega anterior (Ola 25) archivada en `archivo_entregas/ENTREGA_CURSOR_ola25.md`.

---

## 🎯 PARTITURA ASIGNADA: OLA 26 (FASE 3) — AULA HABLADA: VOZ, PPM, QUIZ Y SINCRONIZACIÓN OFFLINE
- **Agente responsable:** Cursor (Fullstack JS/DOM + API)
- **Estado:** 🟢 PROGRAMADA Y LISTA PARA EJECUCIÓN
- **Destino en Academia:**
  - `public/js/aula/aula-alumno.js`
  - Métodos nuevos en `app/Http/Controllers/Aula/SesionAulaController.php` (solo añadir, no alterar `obtenerLienzo` ni `guardarLienzo`)
  - Endpoints propuestos en `routes/api.php` dentro de `Route::prefix('aula/sesion')`

### Alcance
1. **Carga:** `GET /api/aula/sesion/{token}/lienzo` ya existe; renderiza el lienzo en `#lienzoAlumno` respetando `config_visual_json`.
2. **Voz (Web Speech API nativa):** `#btnVozAlternar` y la tecla **Espacio** alternan reproducir/pausar (ignorar Espacio cuando el foco está en input/textarea). `#selVozVelocidad` ajusta `rate`. Lee el texto de los módulos en orden. Sin dependencias externas.
3. **PPM aislado:** `PPM = palabras / (segundos/60)`. El cronómetro empieza solo con `#btnComenzarLectura` y se congela con `#btnFinalizarLectura`. Si el alumno interrumpe, la prueba se reinicia (sin pausa). El quiz usa otro reloj y NO afecta el PPM. Mostrar en `#resultadoPPM`.
4. **Quiz con teclado:** teclas `1`, `2`, `3` seleccionan `.quiz-opcion[data-num]`. Gestión de foco y `aria-live`.
5. **Offline-first:** el cronómetro local nunca se detiene por la red. Respuestas y PPM se guardan en `localStorage` (clave `aula:{token}:pendientes`). Al evento `window 'online'` (y al cargar) se envía la cola a `POST /api/aula/sesion/{token}/respuestas` con reintento y `X-CSRF-TOKEN`; actualizar `#estadoConexion`. Sincronización idempotente (UUID por intento, el backend ignora duplicados).
6. **Backend (solo si Antigravity no lo ha creado aún, coordinar en este archivo):** método `guardarRespuestas(Request, $token)` con validación (`uuid`, `ppm` numérico, `respuestas` array) que devuelve `{ok:true, recibidos:n}`. Antigravity crea la migración y el modelo; indica en tu entrega los nombres de columnas que necesitas.

### Contrato con DeepSeek
Usa exactamente los IDs: `#btnVozAlternar`, `#selVozVelocidad`, `#btnComenzarLectura`, `#btnFinalizarLectura`, `#cronoLectura`, `#resultadoPPM`, `#seccionQuiz`, `.quiz-opcion[data-num]`, `#estadoConexion`, `#lienzoAlumno`. No inventes clases CSS nuevas.

### Prohibido
git/push, migraciones, tocar el panel Filament, renombrar IDs.

---

## ✅ ENTREGA CURSOR — OLA 26 (Fase 3 · Aula Hablada)

**Estado:** Lista para auditoría Antigravity. Copiar a **Academia** desde `entregas-laravel-ola26/`.

### Archivos entregados

| Archivo en Academia | Origen en Lectura |
| :--- | :--- |
| `public/js/aula/aula-alumno.js` | `entregas-laravel-ola26/public/js/aula/aula-alumno.js` |
| Métodos nuevos en `SesionAulaController.php` | `entregas-laravel-ola26/app/Http/Controllers/Aula/SesionAulaController-metodos-ola26.php` |
| Rutas API | `entregas-laravel-ola26/routes/api-aula-ola26-snippet.php` |

### API (añadir en `routes/api.php`)

- `GET /api/aula/sesion/{token}/lienzo` → `obtenerLienzoPorToken`
- `POST /api/aula/sesion/{token}/respuestas` → `guardarRespuestas` (body: `uuid`, `ppm`, `respuestas[]`)

**No modificar** los métodos existentes `obtenerLienzo(int $sesionId)` ni `guardarLienzo`.

### Migración requerida (Antigravity)

Tabla `sesion_entregas_alumno`: `sesion_clase_id`, `uuid` (unique compuesto), `ppm`, `respuestas_json`, timestamps.

### Cliente `aula-alumno.js` (resumen)

- Carga lienzo con `fetch` por `meta[name="aula-token"]`, pinta en `#lienzoAlumno` respetando `config_visual_json` (ancho, alineación, fuente).
- **Voz:** `#btnVozAlternar`, Espacio (sin input foco), `#selVozVelocidad` → `speechSynthesis`, lectura secuencial de módulos.
- **PPM aislado:** `#btnComenzarLectura` / `#btnFinalizarLectura`, cronómetro `#cronoLectura`, resultado `#resultadoPPM`; reinicio si se vuelve a comenzar durante lectura; quiz con reloj aparte.
- **Quiz:** teclas `1`/`2`/`3` en `.quiz-opcion[data-num]` dentro de `#seccionQuiz`.
- **Offline:** cola `localStorage` clave `aula:{token}:pendientes`; sync en `online` y al cargar; `#estadoConexion`; UUID idempotente.

### Integración Blade (DeepSeek)

```blade
<meta name="aula-token" content="{{ $token }}">
<meta name="csrf-token" content="{{ csrf_token() }}">
<script src="{{ asset('js/aula/aula-alumno.js') }}" defer></script>
```

### Commit sugerido

`feat(aula-alumno): voz ppm quiz offline y api de respuestas por token (ola 26)`
