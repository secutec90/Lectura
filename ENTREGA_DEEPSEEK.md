# BUZÓN DE ENTREGA: DEEPSEEK -> ANTIGRAVITY

> **INSTRUCCIÓN PARA DEEPSEEK (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_DEEPSEEK.md`) todo tu código CSS y propuesta visual para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js deepseek`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: OLA 13 (build-595) — SUITE DE EDICIÓN ENRIQUECIDA PROFESIONAL, MODALES FLOTANTES ST90 Y PASO 2 SIN LUCY
- **Estado:** 🟢 PROGRAMADA (PARTITURA ASIGNADA — EJECUTAR AHORA)
- **Archivos objetivo:** `AdminPlaneacionCSS.html`, `ClaseCSS.html`, `ComunCSS.html`
- **Referencia del Plan Maestro:** Requerimiento docente de profesionalización visual de bloques (cero `prompt` nativo, alineación, tablas, imágenes, videos y estructuración clara sin Lucy).

### Especificaciones de Diseño Visual y CSS (DeepSeek):

1. **Cuatro Modales Flotantes Estilizados ST90 (Cero `prompt()` nativo):**
   - Diseña el layout CSS y clases para los 4 modales institucionales:
     - `#modalInsertarTablaST90`: Contenedor modal con encabezado teal, inputs numéricos estilizados para filas y columnas, select de estilo (simple, encabezado sombreado, celdas alternadas) y botones de acción (Confirmar / Cancelar).
     - `#modalInsertarImagenST90`: Campo de URL, contenedor de previsualización `#previewImgST90` con marco y spinner de carga, campo para pie/descripción y selector de alineación (Izquierda, Centrado, Ancho completo).
     - `#modalInsertarVideoST90`: Campo de URL (YouTube/MP4), contenedor responsivo `#previewVideoST90` (16:9) con marco negro y bordes redondeados `10px`.
     - `#modalConfirmarReemplazoBloquesST90`: Diálogo modal de alerta pedagógica. Fondo blanco, borde suave, icono de advertencia DUA, texto claro de confirmación y dos botones principales: `.btn-reemplazar-bloques` (fondo teal institucional `#0d9488`, texto blanco) y `.btn-apilar-bloques` (borde teal, fondo blanco, texto teal).
   - Estilo de backdrop `.st90-modal-overlay`: fondo `rgba(15, 23, 42, 0.45)`, desenfoque suave `backdrop-filter: blur(2px);`, animación de entrada `fadeIn` / `scaleIn`.

2. **Iconografía Vectorial SVG en la Barra de Formato (.toolbar-editor-formato):**
   - Diseña la apariencia de los botones `.btn-tb` y `.btn-tb-especial` con iconos SVG vectoriales nítidos (14x14px o 16x16px) en lugar de emojis:
     - Alineación: Izquierda (líneas alineadas a la izquierda), Centro (líneas centradas), Derecha, Justificado.
     - Elementos: Icono de Tabla (grilla 2x2), Imagen (paisaje/montaña), Video (pantalla con botón play), Callout (bombilla estilizada), Enlace (cadena), Resaltado (marcador).
   - Efecto `:hover` con fondo `#ccfbf1` y color `#0f766e`, y estado activo `.activo` con fondo `#0d9488` y color blanco.

3. **Tarjetas de Elección del Paso 2 (Estructuración de la Clase - Cero "Lucy"):**
   - Perfeccionar `.opciones-construccion-grid`, `.opcion-construccion-card` y `.opcion-ia-card`.
   - `.opcion-construccion-card`: borde `1.5px solid #e2e8f0`, radio `14px`, sombra sutil, cabecera con icono destacado en círculo suave, descripción legible y botón inferior con ancho completo `100%`.
   - `.opcion-ia-card`: gradiente suave `linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)`, borde `#5eead4`, botón con gradiente institucional `linear-gradient(135deg, #0d9488 0%, #0284c7 100%)`.

4. **Botones de Audio-Guía en Cabeceras con Onda Sonora Animada:**
   - Botón `.btn-audio-guia-st90` con icono de altavoz.
   - Estado `.reproduciendo-audio`: animación de pulso sutil o barras ecualizadoras simuladas (`@keyframes ondaAudio`).

5. **Salida y Centinela:**
   - Escribe y guarda todo tu bloque CSS y propuesta de estructura HTML en este archivo (`ENTREGA_DEEPSEEK.md`).
   - Al terminar, ejecuta inmediatamente: `node herramientas/centinela_buzon.js deepseek`.

---

---

## ✅ ENTREGA DEEPSEEK — OLA 13 (`build-595`) · Suite de edición profesional, modales ST90 y Paso 2 sin "Lucy"

**Fecha:** 2026-11-05 · **Autor:** DeepSeek (UI/CSS) · **Estado:** 🟢 LISTA PARA INTEGRAR
**Archivo destino:** `ComunCSS.html` (bloque único).

---

## ⚠️ 0. ALERTA BLOQUEANTE ANTES DE APLICAR

`ComunCSS.html` tiene **un solo `<style>`** que abre en la línea 1 y **cierra en la 3805**, pero el archivo llega a la **3911**.

| Hecho | Consecuencia |
|---|---|
| Líneas **3807–3911** son CSS **fuera** del bloque `<style>` | **No se aplican.** Son texto inerte |
| Ahí viven `.btn-tb-especial`, `.opciones-construccion-grid`, `.opcion-construccion-card`, `.opcion-ia-card`, `.opcion-cabecera`, `.opcion-icono`, `.opcion-desc`, `.editor-tabla-estilo`, `.video-embed-responsive`, `.pasos-manuales-separador` y `.btn-construir-secuencias-completa` | La partitura pide **«perfeccionar»** clases que hoy **no tienen ningún efecto** |
| La OLA 12 sí quedó bien: `.toolbar-editor-formato` (3295), `.campo-editor-rich` (3335), `.notion-callout` (3372), `.flashcard-cara` (3455), `.drawer-mobile-lateral` (3706) | Esas sí están dentro del `<style>` y funcionan |

**Acción obligatoria antes de pegar mi CSS:**
1. Cortar el tramo **3807–3911** y pegarlo **antes** de la línea 3805 (`</style>`).
2. Borrar la copia que queda después de `</style>`.
3. Verificar que el archivo termina en `</style>` (o justo después).

Mi bloque de la sección 2 **reemplaza** el tramo rescatado del Paso 2, así que si se aplica completo no hay que mover dos veces: basta con **insertar mi bloque antes de `</style>`** y **eliminar** el añadido exterior.

---

## 1. Contrato de marcado

**1.1 Estructura compartida de los cuatro modales**

```html
<div class="st90-modal-overlay" role="dialog" aria-modal="true">
  <div class="st90-modal-card" id="modalInsertarTablaST90">
    <div class="st90-modal-head">
      <strong>Insertar tabla</strong>
      <button type="button" class="btn-modal-cerrar" aria-label="Cerrar">✕</button>
    </div>
    <div class="st90-modal-body"> …campos… </div>
    <div class="st90-modal-foot">
      <button type="button" class="btn-modal">Cancelar</button>
      <button type="button" class="btn-modal btn-modal--primario">Confirmar</button>
    </div>
  </div>
</div>
```

Se usa la misma estructura para los cuatro, cambiando solo el contenido del cuerpo:
`#modalInsertarTablaST90`, `#modalInsertarImagenST90`, `#modalInsertarVideoST90` y `#modalConfirmarReemplazoBloquesST90`.

**1.2 Campos de los modales**

```html
<div class="campo-modal">
  <label for="tablaFilasST90">Filas</label>
  <input type="number" id="tablaFilasST90" min="1" value="3">
</div>

<div class="campo-modal-fila">
  <div class="campo-modal"><label>Filas</label><input type="number" value="3"></div>
  <div class="campo-modal"><label>Columnas</label><input type="number" value="3"></div>
</div>

<div class="campo-modal">
  <label for="tablaEstiloST90">Estilo</label>
  <select id="tablaEstiloST90">
    <option value="simple">Simple</option>
    <option value="encabezado">Encabezado sombreado</option>
    <option value="cebra">Celdas alternadas</option>
  </select>
</div>
```

**1.3 Modal de imagen**

```html
<div class="campo-modal">
  <label for="imgUrlST90">URL de la imagen</label>
  <input type="url" id="imgUrlST90" placeholder="https://…">
</div>
<div class="preview-media" id="previewImgST90">
  <div class="spinner-modal" aria-label="Cargando"></div>
</div>
<div class="campo-modal">
  <label for="imgPieST90">Pie o descripción</label>
  <input type="text" id="imgPieST90">
</div>
<div class="campo-modal">
  <label for="imgAlineacionST90">Alineación</label>
  <select id="imgAlineacionST90">
    <option value="izquierda">Izquierda</option>
    <option value="centrado" selected>Centrado</option>
    <option value="ancho">Ancho completo</option>
  </select>
</div>
```

**1.4 Modal de video**

```html
<div class="campo-modal">
  <label for="videoUrlST90">URL del video (YouTube o MP4)</label>
  <input type="url" id="videoUrlST90" placeholder="https://youtu.be/…">
</div>
<div id="previewVideoST90"></div>
```

**1.5 Modal de confirmación pedagógica**

```html
<div class="modal-alerta-dua">
  <span class="icono-alerta" aria-hidden="true">⚠️</span>
  <div>Ya tienes bloques en esta sesión. Si generas la secuencia completa se pueden duplicar los momentos.</div>
</div>
<div class="st90-modal-foot">
  <button type="button" class="btn-modal">Cancelar</button>
  <button type="button" class="btn-modal btn-apilar-bloques">Apilar bloques nuevos</button>
  <button type="button" class="btn-modal btn-reemplazar-bloques">Reemplazar contenido</button>
</div>
```

**1.6 Botones de la barra de formato con SVG**

```html
<button type="button" class="btn-tb" aria-label="Alinear a la izquierda">
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="15" y2="12"></line><line x1="3" y1="18" x2="18" y2="18"></line>
  </svg>
</button>
<button type="button" class="btn-tb btn-tb-especial" aria-label="Insertar tabla">
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="12" x2="21" y2="12"></line><line x1="12" y1="3" x2="12" y2="21"></line>
  </svg>
</button>
```

Los iconos van a **16 px**, sin emoji.

**1.7 Tarjetas del Paso 2**

```html
<div class="opciones-construccion-grid">
  <div class="opcion-construccion-card">
    <div class="opcion-cabecera">
      <span class="opcion-icono" aria-hidden="true">🧩</span>
      <strong>Construir paso a paso</strong>
    </div>
    <p class="opcion-desc">Armar la secuencia eligiendo cada momento.</p>
    <button type="button" class="btn-modal btn-modal--primario">Empezar</button>
  </div>
  <div class="opcion-construccion-card opcion-ia-card">
    <div class="opcion-cabecera">
      <span class="opcion-icono" aria-hidden="true">🤖</span>
      <strong>Secuencia completa con IA</strong>
    </div>
    <p class="opcion-desc">Genera los cuatro momentos y ajústalos después.</p>
    <button type="button" class="btn-modal btn-construir-secuencia-completa btn-ia-profunda">Generar completa</button>
  </div>
</div>
```

**1.8 Botón de audio-guía**

```html
<button type="button" class="btn-audio-guia-st90" aria-pressed="false">
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M11 5 6 9H3v6h3l5 4z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7"></path>
  </svg>
  <span>Escuchar guía</span>
  <span class="onda" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
</button>
```

El JS solo alterna la clase `reproduciendo-audio` y actualiza `aria-pressed`.

---

## 2. Bloque CSS completo — insertar **antes de la línea 3805** (`</style>`) de `ComunCSS.html`

```css
/* ============================================================
   OLA 13 · MODALES FLOTANTES ST90, ICONOGRAFÍA SVG,
   PASO 2 PROFESIONAL Y AUDIO-GUÍA CON ONDA
   ============================================================ */

/* ---------- A · Overlay y tarjeta modal compartida ---------- */
.st90-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, .45);
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  animation: st90FadeIn .18s ease-out;
}
.st90-modal-card {
  width: 100%;
  max-width: 520px;
  max-height: 88vh;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, .28);
  animation: st90ScaleIn .2s ease-out;
}
.st90-modal-card--ancho { max-width: 640px; }

@keyframes st90FadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes st90ScaleIn {
  from { opacity: 0; transform: translateY(8px) scale(.97); }
  to   { opacity: 1; transform: none; }
}

.st90-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px 18px;
  background: #0d9488;
  color: #ffffff;
  border-radius: 14px 14px 0 0;
}
.st90-modal-head strong { font-size: 13.5px; font-weight: 700; }
.btn-modal-cerrar {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 6px;
  background: rgba(255, 255, 255, .18);
  color: #ffffff;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
}
.btn-modal-cerrar:hover { background: rgba(255, 255, 255, .3); }

.st90-modal-body { padding: 16px 18px; }
.st90-modal-foot {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 18px 16px;
}

/* ---------- B · Campos de modal ---------- */
.campo-modal { margin: 0 0 12px; }
.campo-modal label {
  display: block;
  margin: 0 0 4px;
  font-size: 11.5px;
  font-weight: 700;
  color: #475569;
}
.campo-modal input[type="text"],
.campo-modal input[type="url"],
.campo-modal input[type="number"],
.campo-modal select,
.campo-modal textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  font-family: inherit;
  font-size: 12.5px;
  color: #1e293b;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  transition: border-color .12s ease, box-shadow .12s ease;
}
.campo-modal input:hover,
.campo-modal select:hover { border-color: #94a3b8; }
.campo-modal input:focus,
.campo-modal select:focus,
.campo-modal textarea:focus {
  outline: none;
  border-color: #0d9488;
  box-shadow: 0 0 0 2px rgba(13, 148, 136, .2);
}
.campo-modal-fila {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 0 0 12px;
}
.campo-modal-fila > .campo-modal { flex: 1 1 120px; margin-bottom: 0; }

/* ---------- C · Previsualizaciones ---------- */
.preview-media {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 140px;
  margin: 0 0 12px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  overflow: hidden;
}
.preview-media img {
  display: block;
  max-width: 100%;
  max-height: 220px;
  border-radius: 8px;
}
.spinner-modal {
  width: 26px;
  height: 26px;
  border: 3px solid #ccfbf1;
  border-top-color: #0d9488;
  border-radius: 50%;
  animation: st90Spin .8s linear infinite;
}
@keyframes st90Spin { to { transform: rotate(360deg); } }

#previewVideoST90 {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  margin: 0 0 12px;
  background: #000000;
  border-radius: 10px;
  overflow: hidden;
}
#previewVideoST90 iframe,
#previewVideoST90 video {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

/* ---------- D · Alerta pedagógica y botones de decisión ---------- */
.modal-alerta-dua {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 0 0 14px;
  padding: 12px 14px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  color: #78350f;
  font-size: 12.5px;
  line-height: 1.55;
}
.modal-alerta-dua .icono-alerta {
  flex: 0 0 auto;
  font-size: 20px;
  line-height: 1.1;
}

.btn-modal {
  padding: 8px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  color: #334155;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background .12s ease, border-color .12s ease, color .12s ease;
}
.btn-modal:hover { background: #f1f5f9; border-color: #94a3b8; }
.btn-modal:focus-visible { outline: 2px solid #0d9488; outline-offset: 2px; }

.btn-modal--primario {
  background: #0d9488;
  border-color: #0d9488;
  color: #ffffff;
}
.btn-modal--primario:hover { background: #0f766e; border-color: #0f766e; }

.btn-reemplazar-bloques {
  background: #0d9488;
  border-color: #0d9488;
  color: #ffffff;
}
.btn-reemplazar-bloques:hover { background: #0f766e; border-color: #0f766e; }

.btn-apilar-bloques {
  background: #ffffff;
  border-color: #0d9488;
  color: #0d9488;
}
.btn-apilar-bloques:hover { background: #f0fdfa; border-color: #0f766e; color: #0f766e; }

/* ---------- E · Iconografía SVG de la barra de formato ---------- */
.toolbar-editor-formato .btn-tb,
.btn-tb-especial {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 28px;
  height: 28px;
  padding: 0 7px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: #334155;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background .12s ease, color .12s ease, border-color .12s ease;
}
.toolbar-editor-formato .btn-tb svg,
.btn-tb-especial svg {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  display: block;
}
.toolbar-editor-formato .btn-tb:hover,
.btn-tb-especial:hover {
  background: #ccfbf1;
  color: #0f766e;
  border-color: #5eead4;
}
.toolbar-editor-formato .btn-tb.activo {
  background: #0d9488;
  border-color: #0d9488;
  color: #ffffff;
}
.btn-tb-especial {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

/* ---------- F · Tarjetas del Paso 2 ---------- */
.opciones-construccion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin: 16px 0;
}
.opcion-construccion-card {
  display: flex;
  flex-direction: column;
  padding: 18px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(15, 23, 42, .04);
  transition: transform .15s ease, border-color .15s ease, box-shadow .15s ease;
}
.opcion-construccion-card:hover {
  transform: translateY(-2px);
  border-color: #0d9488;
  box-shadow: 0 8px 20px rgba(13, 148, 136, .12);
}
.opcion-cabecera {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 8px;
}
.opcion-cabecera strong { font-size: 13px; color: #0f172a; }
.opcion-icono {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #f0fdfa;
  color: #0d9488;
  font-size: 19px;
  line-height: 1;
  flex: 0 0 auto;
}
.opcion-desc {
  flex: 1 1 auto;
  margin: 0 0 14px;
  font-size: 12.5px;
  line-height: 1.55;
  color: #475569;
}
.opcion-construccion-card > button { width: 100%; }

.opcion-ia-card {
  background: linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%);
  border-color: #5eead4;
}
.opcion-ia-card .opcion-icono { background: #ccfbf1; }

.btn-construir-secuencia-completa.btn-ia-profunda {
  background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%);
  border-color: transparent;
  color: #ffffff;
}
.btn-construir-secuencia-completa.btn-ia-profunda:hover { filter: brightness(1.06); }

.pasos-manuales-separador {
  margin: 14px 0 10px;
  padding-top: 10px;
  border-top: 1px dashed #cbd5e1;
  text-align: center;
  font-size: 11.5px;
  color: #64748b;
}

/* Tabla del editor y video embebido (rescatados del bloque inerte) */
.editor-tabla-estilo {
  width: 100%;
  margin: 12px 0;
  border: 1.5px solid #cbd5e1;
  border-radius: 6px;
  border-collapse: collapse;
  font-size: 13px;
  overflow: hidden;
}
.editor-tabla-estilo th {
  padding: 8px 12px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  text-align: left;
  font-weight: 700;
  color: #1e293b;
}
.editor-tabla-estilo td {
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  color: #334155;
}
.video-embed-responsive {
  position: relative;
  height: 0;
  padding-bottom: 56.25%;
  margin: 14px 0;
  background: #000000;
  border-radius: 10px;
  overflow: hidden;
}

/* ---------- G · Audio-guía con onda animada ---------- */
.btn-audio-guia-st90 {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 13px;
  border: 1px solid #5eead4;
  border-radius: 999px;
  background: #f0fdfa;
  color: #0f766e;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background .12s ease, color .12s ease, border-color .12s ease;
}
.btn-audio-guia-st90:hover { background: #ccfbf1; border-color: #2dd4bf; }
.btn-audio-guia-st90:focus-visible { outline: 2px solid #0d9488; outline-offset: 2px; }
.btn-audio-guia-st90 svg { width: 15px; height: 15px; flex: 0 0 auto; }

.btn-audio-guia-st90 .onda {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;
}
.btn-audio-guia-st90 .onda i {
  width: 2px;
  height: 4px;
  border-radius: 1px;
  background: currentColor;
  opacity: .55;
}
.btn-audio-guia-st90.reproduciendo-audio {
  background: #0d9488;
  border-color: #0d9488;
  color: #ffffff;
}
.btn-audio-guia-st90.reproduciendo-audio .onda i {
  opacity: 1;
  animation: ondaAudio .9s ease-in-out infinite;
}
.btn-audio-guia-st90.reproduciendo-audio .onda i:nth-child(2) { animation-delay: .15s; }
.btn-audio-guia-st90.reproduciendo-audio .onda i:nth-child(3) { animation-delay: .3s; }
.btn-audio-guia-st90.reproduciendo-audio .onda i:nth-child(4) { animation-delay: .45s; }

@keyframes ondaAudio {
  0%, 100% { height: 4px; }
  50%      { height: 12px; }
}

/* ---------- H · Móvil, impresión y movimiento reducido ---------- */
@media (max-width: 860px) {
  .st90-modal-overlay { padding: 12px; align-items: flex-end; }
  .st90-modal-card { max-width: 100%; max-height: 92vh; border-radius: 14px; }
  .st90-modal-foot { padding: 0 14px 14px; }
  .st90-modal-foot .btn-modal,
  .st90-modal-foot .btn-reemplazar-bloques,
  .st90-modal-foot .btn-apilar-bloques { flex: 1 1 100%; min-height: 44px; }
  .btn-audio-guia-st90 { min-height: 44px; }
  .toolbar-editor-formato .btn-tb { min-width: 44px; min-height: 44px; }
}

@media print {
  .st90-modal-overlay,
  .toolbar-editor-formato,
  .btn-audio-guia-st90 { display: none !important; }
}

@media (prefers-reduced-motion: reduce) {
  .st90-modal-overlay,
  .st90-modal-card,
  .btn-audio-guia-st90.reproduciendo-audio .onda i,
  .opcion-construccion-card { animation: none !important; transition: none !important; }
  .btn-audio-guia-st90.reproduciendo-audio .onda i { height: 8px; }
}
```

---

## 3. Correspondencia con la partitura

| Punto | Implementado | Cómo |
|---|:---:|---|
| 4 modales con encabezado teal | ✅ | `.st90-modal-card` + `.st90-modal-head` en `#0d9488`, estructura única reutilizada |
| `#modalInsertarTablaST90`: filas, columnas, select de estilo | ✅ | `.campo-modal`, `.campo-modal-fila` y select con foco teal |
| `#modalInsertarImagenST90`: URL, preview con spinner, pie, alineación | ✅ | `.preview-media`, `.spinner-modal` y los tres campos |
| `#modalInsertarVideoST90`: preview 16:9 negra | ✅ | `#previewVideoST90` con `aspect-ratio: 16/9`, fondo negro y radio 10px |
| `#modalConfirmarReemplazoBloquesST90` con alerta DUA y dos botones | ✅ | `.modal-alerta-dua`, `.btn-reemplazar-bloques` (teal lleno) y `.btn-apilar-bloques` (teal hueco) |
| `.st90-modal-overlay`: `rgba(15,23,42,.45)`, blur 2px, `fadeIn`/`scaleIn` | ✅ | `backdrop-filter: blur(2px)` y keyframes `st90FadeIn` / `st90ScaleIn` |
| `.btn-tb` y `.btn-tb-especial` con SVG de 16px, sin emojis | ✅ | `svg { width:16px; height:16px }` y botones `inline-flex` |
| Alineación, tabla, imagen, video, callout, enlace, resaltado | ✅ | Contrato de marcado de §1.6: cada botón lleva su `<svg>` de 16px |
| Hover `#ccfbf1` / `#0f766e` y activo `#0d9488` blanco | ✅ | Sustituye el hover gris de la OLA 12 |
| `.opcion-construccion-card` borde 1.5px, radio 14px, icono en círculo, botón 100% | ✅ | Radio 14px, `.opcion-icono` de 38px circular y `> button { width:100% }` |
| `.opcion-ia-card` con gradiente y botón institucional | ✅ | `linear-gradient(180deg,#f0fdfa,#fff)` + `.btn-ia-profunda` con `#0d9488 → #0284c7` |
| `.btn-audio-guia-st90` con altavoz y onda | ✅ | Botón píldora teal con cuatro barras `.onda i` |
| `.reproduciendo-audio` con `@keyframes ondaAudio` | ✅ | Barras que suben y bajan con retardos escalonados |

---

## 4. Notas de integración

1. **El tramo inerte se resuelve con esta misma entrega.** Mi bloque incluye las versiones corregidas de `.opcion-*`, `.btn-tb-especial`, `.editor-tabla-estilo`, `.video-embed-responsive` y `.pasos-manuales-separador`. Basta insertarlo **antes de `</style>`** y **borrar** el añadido exterior de las líneas 3807–3911.
2. **Sustitución consciente:** el hover de `.btn-tb` cambia de `#e2e8f0` (OLA 12) a `#ccfbf1 / #0f766e` (OLA 13). Es lo que pide la partitura; conviene saber que es un reemplazo, no una suma.
3. **Los cuatro modales comparten estructura.** Si mañana se agrega un quinto, hereda el estilo sin CSS nuevo.
4. **`.btn-apilar-bloques` es la acción segura** (no destruye), por eso va antes que `.btn-reemplazar-bloques` en el pie y en estilo hueco.
5. **La onda usa cuatro `<i>` vacíos**, no una imagen ni un SVG animado: pesa nada y se detiene con `prefers-reduced-motion`.
6. **Sin ids nuevos, sin `onclick` nuevos y sin tooltips.** Los ids de los modales son los que fija la partitura.

---

## 5. Pendiente para Cursor / Antigravity

- Mover el tramo 3807–3911 dentro del `<style>` o eliminarlo (lo sustituye este bloque).
- Generar los cuatro modales con la estructura de §1 y abrirlos desde los botones de la barra.
- Alternar `.reproduciendo-audio` y `aria-pressed` en el botón de audio-guía.

---

## 6. INFORME PARA ANTIGRAVITY

```text
DeepSeek propone/hizo los siguientes cambios de diseño:

INFORME PARA ANTIGRAVITY:
- Archivos involucrados: ComunCSS.html (único archivo). El bloque debe insertarse ANTES de la línea 3805
  (cierre de </style>) y eliminarse el añadido exterior de las líneas 3807–3911.
- Propósito del cambio:
    1. CORREGIR UN DEFECTO: 105 líneas de CSS viven hoy FUERA del bloque <style> (ComunCSS.html 3807–3911)
       y por tanto no se aplican. Afecta a .btn-tb-especial, .opciones-construccion-grid,
       .opcion-construccion-card, .opcion-ia-card, .opcion-cabecera, .opcion-icono, .opcion-desc,
       .editor-tabla-estilo, .video-embed-responsive y .pasos-manuales-separador.
    2. Entregar los cuatro modales institucionales con overlay, animaciones, encabezado teal y alerta DUA.
    3. Sustituir emojis de la barra de formato por SVG de 16px con hover #ccfbf1 / activo #0d9488.
    4. Profesionalizar las tarjetas del Paso 2 y añadir el botón de audio-guía con onda animada.
- Selectores o fragmentos modificados: insertar el bloque completo de la sección 2 antes de </style>.
    * .st90-modal-overlay, .st90-modal-card (+ --ancho), @keyframes st90FadeIn / st90ScaleIn,
      .st90-modal-head, .btn-modal-cerrar, .st90-modal-body, .st90-modal-foot
    * .campo-modal (+ label, inputs, select, textarea, :focus), .campo-modal-fila
    * .preview-media, .spinner-modal, @keyframes st90Spin, #previewVideoST90
    * .modal-alerta-dua (+ .icono-alerta), .btn-modal (+ --primario), .btn-reemplazar-bloques,
      .btn-apilar-bloques
    * .toolbar-editor-formato .btn-tb, .btn-tb-especial (svg 16px; hover #ccfbf1/#0f766e; .activo #0d9488)
    * .opciones-construccion-grid, .opcion-construccion-card, .opcion-cabecera, .opcion-icono,
      .opcion-desc, .opcion-ia-card, .btn-construir-secuencia-completa.btn-ia-profunda,
      .pasos-manuales-separador, .editor-tabla-estilo, .video-embed-responsive
    * .btn-audio-guia-st90 (+ .onda i, .reproduciendo-audio), @keyframes ondaAudio
    * @media (max-width: 860px), @media print, @media (prefers-reduced-motion: reduce)
- Precauciones:
  * CRÍTICO: el bloque debe quedar DENTRO de <style>. Si se vuelve a pegar después de </style>, no se aplica.
  * Sustituye el tramo 3807–3911: no duplicar esas reglas, o ganarán por orden las versiones muertas.
  * El hover de .btn-tb cambia de #e2e8f0 (OLA 12) a #ccfbf1/#0f766e: es un reemplazo intencional.
  * Los modales deben compartir la estructura de §1.1 (.st90-modal-overlay > .st90-modal-card >
    head/body/foot) para heredar el estilo; los ids de la partitura se conservan.
  * .btn-apilar-bloques es la acción no destructiva: debe quedar antes de .btn-reemplazar-bloques.
  * El botón de audio requiere cuatro <i> vacíos dentro de .onda; el JS solo alterna
    .reproduciendo-audio y aria-pressed.
  * Sin ids nuevos, sin onclick nuevos y sin tooltips.

Por favor:
1. Revisa que respete el Design System ST90 y que no rompa la funcionalidad JS ni los IDs existentes.
2. Aplícalo en los archivos correspondientes.
3. Despliégalo a Google Apps Script (clasp push & deploy) para que lo vea en mi Google Sites.
```
```

---

## 🎯 PARTITURA ASIGNADA: OLA 15 (`build-597`) — SKIN INSTITUCIONAL ST90 PARA TINYMCE, TABLAS Y RESPONSIVE
- **Estado:** 🟢 PROGRAMADA (PARTITURA ASIGNADA — EJECUTAR AHORA)
- **Archivos objetivo:** `ComunCSS.html`, `AdminPlaneacionCSS.html`, `ClaseCSS.html`

### 📋 Especificaciones de Diseño Visual y CSS (DeepSeek):

1. **Tema Institucional para TinyMCE (.tox-tinymce):**
   - Diseña reglas CSS para armonizar la interfaz del editor TinyMCE con la paleta de la Escuela Secundaria Técnica 90:
     - Barra de herramientas con borde `#cbd5e1`, fondo `#f8fafc`, radio `10px`.
     - Botones activos en teal `#0d9488` con texto blanco y hover suave `#ccfbf1`.
     - Menú contextual y menubar con tipografía legible `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto` de 13px.
2. **Estilo para Tablas Editoriales y Cajas Didácticas DUA:**
   - `.editor-tabla-estilo`: Cabeceras con gradiente sutil `#0f766e` a `#0d9488`, texto blanco, bordes finos `#cbd5e1`, celdas alternadas `#f8fafc`.
   - `.caja-nota-st90`, `.caja-reto-st90`, `.caja-pregunta-st90`, `.notion-callout`: Sombras suaves `0 2px 6px rgba(0,0,0,0.04)`, radios de `10px` y contrastes accesibles WCAG AAA.
3. **Selector de Color de Fondo (.canvas-color-picker-wrap):**
   - Pulido estético del contenedor de selección de color de fondo en la cabecera del lienzo, con microinteracciones hover y soporte responsivo en pantallas móviles `<= 768px`.
4. **Regla de Oro:**
   - Todo el CSS debe escribirse estrictamente DENTRO de la etiqueta `<style>` y ANTES de `</style>`.
5. **Protocolo Centinela:**
   - Escribe tu código propuesto y confirmación en este archivo (`ENTREGA_DEEPSEEK.md`) y ejecuta inmediatamente:
     `node herramientas/centinela_buzon.js deepseek`

---

## 🎯 PARTITURA ASIGNADA: OLA 16 (`build-598`) — SKIN INSTITUCIONAL ST90 PARA SUITE EDITORIAL WYSIWYG PROFESIONAL (ESTILO TINYMCE 6 / OFFICE / IMAGEN 2)
- **Estado:** 🟢 PROGRAMADA (PARTITURA ASIGNADA — EJECUTAR AHORA)
- **Archivos objetivo:** `ComunCSS.html`, `AdminPlaneacionCSS.html`, `ClaseCSS.html`

### 🎨 Especificaciones de Diseño Visual y CSS (DeepSeek):

1. **Maquetación y Jerarquía Visual de la Suite Editorial (.editor-enriquecido-wrap):**
   - Diseña el layout visual inspirado en la referencia de la Imagen 2 (estilo TinyMCE / suite ofimática institucional):
     - **Contenedor exterior:** Borde `#cbd5e1`, esquinas redondeadas `10px`, sombra sutil `0 2px 8px rgba(0,0,0,0.04)`.
     - **Barra de Menú Superior (Menubar):** Barra horizontal compacta (`Archivo`, `Editar`, `Insertar`, `Formato`, `Tabla`, `Herramientas`) con fondo `#f8fafc`, tipografía 12.5px, hover suave `#f1f5f9` y desplegables elegantes (`.menu-dropdown-st90`) con sombra y bordes finos.
     - **Barra de Herramientas Principal (Toolbars Multi-Nivel):**
       - Fila 1: Botones agrupados de Historial (Undo/Redo), Formato de bloque (Párrafo, H1, H2, H3), Selectores estilizados de Fuente y Tamaño (12px, 14px, 16px, 18px...), e Inserción (Enlace, Imagen, Video, Tabla).
       - Fila 2: Formato de carácter (B, I, U, S, Tx), Botones de Color (Texto 'A' con línea de color, Fondo/Resaltador con franja), Alineación (Izquierda, Centro, Derecha, Justificado), Listas y Sangría.
       - Fila 3 / Atajos DUA: Selector de cuadros didácticos DUA, Botón de Quitar elemento (`.btn-tb-danger`), y Selector de color de fondo del lienzo (`.canvas-color-picker-wrap`).
2. **Estilo para Tablas Editoriales y Celdas (.editor-tabla-estilo):**
   - Cabeceras con gradiente institucional ST90 (`#0f766e` a `#0d9488`), texto blanco y bordes limpios `#cbd5e1`.
   - Celdas con relleno ergonómico (`8px 12px`), bordes `#cbd5e1` y soporte visual para celdas con color de fondo personalizado (`td[style*="background"]`).
   - Botones rápidos de filas/columnas (`.btn-tb-tabla`) integrados armoniosamente.
3. **Manejadores Visuales de Imágenes y Elementos Multimedia:**
   - Estilo para imágenes dentro del editor con borde sutil al enfocar/seleccionar y barra flotante de opciones (`.barra-opciones-img`).
   - Contenedor de video responsivo (`.video-embed-responsive`) con esquinas de 10px.
4. **Cajas Didácticas DUA (.notion-callout, .caja-nota-st90, .caja-reto-st90, .caja-pregunta-st90):**
   - Acabado estético premium, contraste WCAG AAA, bordes distintivos y microinteracciones.
5. **Regla de Oro:**
   - Todo el CSS debe escribirse estrictamente DENTRO de la etiqueta `<style>` y ANTES de `</style>`.
6. **Protocolo Centinela:**
   - Escribe tu código propuesto y confirmación en este archivo (`ENTREGA_DEEPSEEK.md`) y ejecuta inmediatamente:
     `node herramientas/centinela_buzon.js deepseek`



