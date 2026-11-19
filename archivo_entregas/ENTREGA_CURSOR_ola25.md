# BUZÓN DE ENTREGA: CURSOR -> ANTIGRAVITY

> **INSTRUCCIÓN PARA CURSOR (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md`, `.skills/aula-constructor/SKILL.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_CURSOR.md`) todo tu código JavaScript cliente y controladores Laravel para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js cursor`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: FASE 2 — MOTOR DRAG & DROP + SELECTOR DINÁMICO DE 20 MOSAICOS + TOOLBARS FLOTANTES
- **Agente responsable:** **Cursor** (Desarrollador Fullstack & JS/DOM)
- **Estado:** 🟢 **PROGRAMADA Y LISTA PARA EJECUCIÓN**
- **Documento Rector y Skill:** Consulta [.skills/aula-constructor/SKILL.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/.skills/aula-constructor/SKILL.md) y [RSC_MIGRACION_FUSION_LARAVEL.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/RSC_MIGRACION_FUSION_LARAVEL.md).

### Especificación Técnica de la Entrega (Fase 2):
1. **Motor Drag & Drop (`dragstart`, `dragover`, `dragleave`, `drop`):**
   - Conectar las tarjetas del catálogo lateral (`.modulo-card-lateral`) con las columnas dropzone (`.divi-column`).
   - Gestión de estado: clase `.drag-over` en la columna bajo el puntero.
   - Al soltar en `.divi-column`: instanciar el bloque correspondiente (`insertarModuloEnColumna(tipo, columnaEl)`).
   - Soporte para clic directo: si una columna tiene foco activo (`.active-target`), hacer clic en cualquier tarjeta del catálogo la inserta de inmediato.
   - Reordenamiento interno: permitir arrastrar módulos entre columnas y cambiar su orden dentro de la misma columna mediante el handle `✥` de la toolbar flotante.
2. **Lógica del Selector de 20 Mosaicos (`.btn-plus-green` / `.columns-popover`):**
   - Click en el botón circular verde `(+)` entre filas: abre el popover/modal centrado `#modal-overlay`.
   - Click en una de las 20 opciones (4 iguales, 4 asimétricas, 12 mosaicos): genera dinámicamente `<div class="divi-row {reticula}">` con sus columnas `<div class="divi-column active-target">` y su botón interior `[+ Añadir Módulo]`.
3. **Delegación de Eventos en Toolbars Flotantes (`.toolbar-flotante`):**
   - Botón subir (▲) y bajar (▼): reordenar filas o módulos en el DOM.
   - Botón duplicar (📄): clonar profundamente el elemento generando nuevos IDs únicos.
   - Botón eliminar (✕): eliminar con toast de deshacer (buffer temporal).
   - Botón engrane (⚙️): abrir modal `#modal-propiedades` para editar campos del módulo (título, colores, alineación, URL, etc.).
4. **Sincronización Reactiva con la API:**
   - Cada mutación del lienzo (crear, reordenar, borrar) invoca el debounce de autoguardado a `/api/aula/sesion/{sesion}/guardar` mediante `ST90ConstructorApi.marcarModificado()`.

---

### 📝 ZONA DE ENTREGA DE CURSOR (Escribe tu código JS y adaptadores aquí abajo):

*(Cursor: deposita aquí tu implementación de Phase 2 para `public/js/aula/constructor-cliente.js`)*

---

---

## ✅ ENTREGA CURSOR — FASE 1 (API Lienzo Laravel + Cliente JS)

**Estado:** Lista para auditoría Antigravity. Archivos espejo en `entregas-laravel-fase1/` para copiar al repo **Academia** (Laravel 12).

### Rutas API (pegar en `routes/api.php`)

Ver `entregas-laravel-fase1/routes/api-aula-snippet.php`:
- `GET /api/aula/sesion/{sesion}/lienzo` → `obtenerLienzo`
- `POST /api/aula/sesion/{sesion}/guardar` → `guardarLienzo`
- Middleware sugerido: `auth:sanctum`

### Controlador

Destino en Academia: `app/Http/Controllers/Aula/SesionAulaController.php`  
Copia íntegra: `entregas-laravel-fase1/app/Http/Controllers/Aula/SesionAulaController.php`

**Comportamiento:**
- `obtenerLienzo`: lee `sesiones_clase.lienzo_json` y `config_visual_json`, normaliza JSON, responde `meta.tiempo_respuesta_ms`.
- `guardarLienzo`: valida `lienzo` (array con `filas` o puente legacy `paginas`), persiste en transacción, devuelve tiempo en ms.
- Modelo esperado: `App\Models\SesionClase` con casts `lienzo_json` / `config_visual_json` como `array` o `json`.

### Cliente JS

Destino en Academia: `public/js/aula/constructor-cliente.js`  
Copia íntegra: `entregas-laravel-fase1/public/js/aula/constructor-cliente.js`

**Comportamiento:**
- `ST90ConstructorApi.guardarLienzo(sesionId)` → `fetch POST .../guardar` con payload `{ lienzo, config_visual }`.
- `ST90ConstructorApi.obtenerLienzo(sesionId)` → `fetch GET .../lienzo`.
- `mapearEstadoExeALienzo_()` adapta `capturarEstadoExe_()` / `exportarSecciones610_()` al schema del SKILL (`version`, `config`, `filas`).
- Cola offline en `localStorage` (`st90_lienzo_offline_{id}`) + resincronización en evento `online` (RSC ARCHITEX).
- `inicializarConstructorCliente_({ sesionId, cargarAlInicio: true })` hidrata vía `deserializarIDevicesSesion_`.
- Envoltorio opcional de `serializarIDevicesSesion_` para disparar guardado API sin romper flujo GAS mientras coexisten.

### Integración Blade (nota para Antigravity)

En `constructor.blade.php`:
```blade
<meta name="csrf-token" content="{{ csrf_token() }}">
<script>
  window.ST90_SESION_AULA_ID = {{ $sesion->id }};
</script>
<script src="{{ asset('js/aula/constructor-cliente.js') }}" defer></script>
<script>
  document.addEventListener('DOMContentLoaded', function () {
  if (window.inicializarConstructorCliente_) {
    inicializarConstructorCliente_({ sesionId: window.ST90_SESION_AULA_ID, cargarAlInicio: true });
  }
});
</script>
```

### Commit sugerido (Conventional Commits)

`feat(aula): api rest de lienzo sesion y cliente fetch para constructor fase 1`
