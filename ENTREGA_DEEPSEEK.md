# BUZÓN DE ENTREGA: DEEPSEEK -> ANTIGRAVITY

> **INSTRUCCIÓN PARA DEEPSEEK (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_DEEPSEEK.md`) todo tu código CSS y propuesta visual para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js deepseek`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: OLA 19 (`build-609`) — CUADRÍCULA DE BLOQUES ESTILO GRAPESJS (2 COLUMNAS) EN EL CATÁLOGO LATERAL DE LAS 7 FAMILIAS
- **Estado:** 🟢 AUDITADA E INTEGRADA EN BUILD-609
- **Archivos objetivo:** `AdminPlaneacionCSS.html`, `ClaseCSS.html`
- **Objetivo:** Convertir el contenido desplegable de los acordeones (`.cat-group-body` / `.cat-items`) bajo "Contenidos de Aprendizaje" en una cuadrícula compacta de bloques interactivos de 2 columnas estilo **GrapesJS Block Manager**, 100% nativa y ligera.

---

### 📋 Especificaciones Técnicas para DeepSeek:

1. **Contenedor de Categoría (`.cat-group-body`, `.cat-items`):**
   - En estado cerrado: `display: none;`.
   - En estado expandido (`.cat-group.abierto > .cat-group-body`, `.cat-group.abierto > .cat-items`):
     `display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 8px; padding: 10px; background: #f8fafc; border-top: 1px solid #e2e8f0; box-sizing: border-box;`.
2. **Tarjetas de Bloque (`.modulo-card-lateral`):**
   - Estructura vertical compacta:
     `display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 10px 6px; min-height: 76px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; box-sizing: border-box; user-select: none; position: relative; margin: 0;`.
   - Efecto hover interactivo:
     `border-color: #0d9488; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08); transform: translateY(-2px);`.
   - Estado de arrastre (`.modulo-card-lateral.dragging`): `opacity: 0.55; transform: scale(0.96);`.
   - Icono temático (`.card-lateral-icon-badge`): tamaño `22px`, ancho/alto `34px`, centrado, con `margin: 0 auto 4px; border-radius: 8px;`.
   - Tipografía (`.card-lateral-titulo`): tamaño `11px`, `font-weight: 600`, color `#1e293b`, `line-height: 1.2`, centrado, máximo 2 líneas sin desbordar.
   - Botón `(+)` (`.btn-card-add`): estilizado como badge sutil flotante en la esquina superior derecha (`pointer-events: none;`) para que toda la tarjeta sea el área activa de clic y arrastre.
3. **Coherencia Temática (7 Familias Curriculares):**
   - Borde superior temático (`border-top: 2.5px solid ...`) e icono coloreado para `.tema-notion` (`#0284c7`), `.tema-eval` (`#059669`), `.tema-h5p` (`#7c3aed`), `.tema-ingles` (`#d97706`), `.tema-juegos` (`#db2777`), `.tema-tecno` (`#0891b2`) y `.tema-ciencias` (`#0d9488`).
4. **Feedback Visual de Dropzone en Lienzo (`.divi-column.drag-over-target`):**
   - Resaltado de recepción al arrastrar un bloque sobre una columna Divi.

---

## ✍️ ENTREGA DEEPSEEK — BLOQUE CSS GRAPESJS BLOCK MANAGER (`build-609`)

```css
  /* ============================================================
     OLA 19 · build-609 — CATÁLOGO LATERAL ESTILO GRAPESJS (GRID 2 COLUMNAS)
     Aislamiento estricto bajo `.sidebar-exe .box-idevice-menu`.
     ============================================================ */
  .sidebar-exe .box-idevice-menu .cat-group-body,
  .sidebar-exe .box-idevice-menu .cat-items {
    display: none;
    box-sizing: border-box;
  }
  .sidebar-exe .box-idevice-menu .cat-group.abierto > .cat-group-body,
  .sidebar-exe .box-idevice-menu .cat-group.abierto > .cat-items {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 8px;
    padding: 10px;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    box-sizing: border-box;
  }

  .sidebar-exe .box-idevice-menu .modulo-card-lateral {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 10px 6px;
    min-height: 76px;
    margin: 0;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    cursor: grab;
    transition: all 0.2s ease;
    box-sizing: border-box;
    user-select: none;
  }
  .sidebar-exe .box-idevice-menu .modulo-card-lateral:hover {
    border-color: #0d9488;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
  .sidebar-exe .box-idevice-menu .modulo-card-lateral:active,
  .sidebar-exe .box-idevice-menu .modulo-card-lateral.dragging {
    cursor: grabbing;
    opacity: 0.65;
    transform: scale(0.97);
  }

  .sidebar-exe .box-idevice-menu .card-lateral-cuerpo {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 4px;
    pointer-events: none;
  }
  .sidebar-exe .box-idevice-menu .card-lateral-icon-badge {
    width: 34px;
    height: 34px;
    min-width: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 4px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    font-size: 22px;
    line-height: 1;
  }
  .sidebar-exe .box-idevice-menu .card-lateral-titulo {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 11px;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.2;
    text-align: center;
    white-space: normal;
    word-break: break-word;
  }
  .sidebar-exe .box-idevice-menu .card-lateral-sub {
    display: none;
  }
  .sidebar-exe .box-idevice-menu .btn-card-add {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 16px;
    height: 16px;
    padding: 0;
    border-radius: 50%;
    font-size: 10px;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #f0fdfa;
    color: #0d9488;
    border: 1px solid #99f6e4;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
  }
  .sidebar-exe .box-idevice-menu .modulo-card-lateral:hover .btn-card-add {
    opacity: 1;
  }

  /* Coherencia temática por familia curricular */
  .sidebar-exe .box-idevice-menu .modulo-card-lateral.tema-notion { border-top: 2.5px solid #0284c7; }
  .sidebar-exe .box-idevice-menu .modulo-card-lateral.tema-eval { border-top: 2.5px solid #059669; }
  .sidebar-exe .box-idevice-menu .modulo-card-lateral.tema-h5p { border-top: 2.5px solid #7c3aed; }
  .sidebar-exe .box-idevice-menu .modulo-card-lateral.tema-ingles { border-top: 2.5px solid #d97706; }
  .sidebar-exe .box-idevice-menu .modulo-card-lateral.tema-juegos { border-top: 2.5px solid #db2777; }
  .sidebar-exe .box-idevice-menu .modulo-card-lateral.tema-tecno { border-top: 2.5px solid #0891b2; }
  .sidebar-exe .box-idevice-menu .modulo-card-lateral.tema-ciencias { border-top: 2.5px solid #0d9488; }

  .divi-column.drag-over-target {
    border-color: #0d9488 !important;
    background: #f0fdfa !important;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.2) !important;
  }
```
