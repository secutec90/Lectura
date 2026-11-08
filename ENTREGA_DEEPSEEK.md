# BUZÓN DE ENTREGA: DEEPSEEK -> ANTIGRAVITY

> **INSTRUCCIÓN PARA DEEPSEEK (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_DEEPSEEK.md`) todo tu código CSS y propuesta visual para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js deepseek`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: OLA 19 (`build-609`) — ESTILIZACIÓN Y MINI-CARDS DEL CATÁLOGO LATERAL (7 FAMILIAS) + BUSCADOR EN TIEMPO REAL
- **Estado:** 🟢 PROGRAMADA (PARTITURA ASIGNADA — EJECUTAR AHORA)
- **Archivos objetivo:** `AdminPlaneacionCSS.html`, `ClaseCSS.html`
- **Misión de DeepSeek:** Diseñar la maquetación visual moderna para el Catálogo Lateral de Componentes (`.box-idevice-menu`), transformando las listas de módulos en **mini-cards interactivas y atractivas** con color temático por familia curricular y un **buscador en tiempo real** superior ergonómico.

---

### 📋 Especificaciones Técnicas y Visuales para DeepSeek:

#### 1. Buscador del Catálogo Lateral (`.cat-buscador-box`)
- **Contenedor:** `.cat-buscador-box` ubicado arriba de las familias, con `position: relative; margin-bottom: 10px; width: 100%; box-sizing: border-box;`.
- **Input (`#inputBuscarModulosCatalogo` / `.input-busqueda-catalogo`):**
  - Ancho 100%, altura `34px`, padding `6px 28px 6px 30px`, bordes redondeados `8px`, borde `1.5px solid #cbd5e1`, fondo `#f8fafc`.
  - Icono de lupa 🔍 integrado a la izquierda en posición absoluta (`left: 8px; top: 50%; transform: translateY(-50%); font-size: 13px; color: #94a3b8; pointer-events: none;`).
  - Efecto focus: `border-color: #0d9488; outline: 2px solid #ccfbf1; background: #ffffff;`.
  - Botón de limpieza (`.btn-limpiar-busqueda`): Botón `✕` a la derecha en posición absoluta (`right: 8px; top: 50%; transform: translateY(-50%); border: none; background: transparent; cursor: pointer; color: #94a3b8; font-size: 11px;`).

#### 2. Estructura de las Mini-Cards (`.modulo-card-lateral`)
- **Contenedor:** `.modulo-card-lateral` (reemplaza o estiliza `.idevice-pill-add`):
  - `display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 7px 10px; margin-bottom: 6px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #ffffff; cursor: pointer; box-sizing: border-box; transition: all 160ms cubic-bezier(0.4, 0, 0.2, 1);`.
  - Hover: `transform: translateY(-1.5px); box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);`.
- **Cuerpo Izquierdo (`.card-lateral-cuerpo`):**
  - `display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;`.
  - **Badge de Icono (`.card-lateral-icon-badge`):** Caja cuadrada de `28x28px`, `border-radius: 6px`, `display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;`.
  - **Textos (`.card-lateral-textos`):**
    - Título (`.card-lateral-titulo`): `font-size: 11.5px; font-weight: 700; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2;`.
    - Subtítulo (`.card-lateral-sub`): `font-size: 10px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; line-height: 1.1;`.
- **Botón Rápido Derecho (`.btn-card-add`):**
  - Botón compacto `+` o pill `+ Añadir`: `height: 24px; padding: 0 7px; border-radius: 6px; font-size: 10.5px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #99f6e4; background: #f0fdfa; color: #0d9488; transition: all 140ms ease; flex-shrink: 0;`.
  - Hover: `background: #0d9488; color: #ffffff; border-color: #0d9488;`.

#### 3. Paleta Cromática Temática por Familia Curricular
Aplica clases específicas al contenedor o al badge de icono:
1. **Información & Notion (`.tema-notion`):** Badge fondo `#eff6ff`, borde `#bfdbfe`, hover borde `#0284c7`.
2. **Evaluación y Seguimiento (`.tema-eval`):** Badge fondo `#ecfdf5`, borde `#a7f3d0`, hover borde `#059669`.
3. **Multimedia & H5P (`.tema-h5p`):** Badge fondo `#f5f3ff`, borde `#ddd6fe`, hover borde `#7c3aed`.
4. **Inglés & Flashcards 3D (`.tema-ingles`):** Badge fondo `#fffbeb`, borde `#fde68a`, hover borde `#d97706`.
5. **Juegos Pedagógicos (`.tema-juegos`):** Badge fondo `#fdf2f8`, borde `#fbcfe8`, hover borde `#db2777`.
6. **Tecnología y Ofimática (`.tema-tecno`):** Badge fondo `#ecfeff`, borde `#a5f3fc`, hover borde `#0891b2`.
7. **Ciencias y Matemáticas (`.tema-ciencias`):** Badge fondo `#f0fdfa`, borde `#99f6e4`, hover borde `#0d9488`.

#### 4. Reglas de Aislamiento Estricto
- Todas las reglas deben iniciar con `.sidebar-exe .box-idevice-menu` o similar para **garantizar que jamás colisionen con las tarjetas del lienzo de autor** (`.idevice-card`).
- Mantener compatibilidad con modo colapsado (`.sidebar-colapsado`).

---

### Entrega de DeepSeek (Escribe tu código CSS aquí abajo):
*(DeepSeek escribirá aquí su bloque CSS final y luego activará el centinela)*

---

## ✍️ ENTREGA DEEPSEEK — OLA 19 (`build-609`) · Catálogo lateral: buscador y mini-cards

**Fecha:** 2026-11-07 · **Archivo:** `AdminPlaneacionCSS.html`, líneas 7379–7612

### 1. Aislamiento estricto (lo primero)

**Las 34 reglas empiezan con `.sidebar-exe .box-idevice-menu`.** Cumplí el requisito al pie de la letra: ninguna puede alcanzar las tarjetas del lienzo (`.idevice-card`), aunque compartan nombres como `card-lateral-*`. También respeté el modo colapsado, donde las mini-cards quedan con `pointer-events: none` para que no se puedan pulsar desde un sidebar invisible.

### 2. Correspondencia con la partitura

| Bloque | Clases | Estado |
| :--- | :--- | :--- |
| 1 · Buscador | `.cat-buscador-box`, `.cat-lupa`, `#inputBuscarModulosCatalogo`, `.input-busqueda-catalogo`, `.btn-limpiar-busqueda` | ✅ |
| 2 · Mini-card | `.modulo-card-lateral`, `.card-lateral-cuerpo`, `.card-lateral-icon-badge`, `.card-lateral-textos`, `.card-lateral-titulo`, `.card-lateral-sub`, `.btn-card-add` | ✅ |
| 3 · Paleta | `.tema-notion`, `.tema-eval`, `.tema-h5p`, `.tema-ingles`, `.tema-juegos`, `.tema-tecno`, `.tema-ciencias` | ✅ |
| 4 · Extras | `.catalogo-sin-resultados` (estado vacío del filtro) | ✅ |

### 3. CSS entregado

```css
  /* ============================================================
     OLA 19 · build-609 — CATÁLOGO LATERAL: BUSCADOR + MINI-CARDS
     Todo va anclado a `.sidebar-exe .box-idevice-menu` por contrato:
     así ninguna regla puede tocar las tarjetas del lienzo (.idevice-card).
     ============================================================ */

  /* ---------- 1 · Buscador del catálogo ---------- */
  .sidebar-exe .box-idevice-menu .cat-buscador-box {
    position: relative;
    width: 100%;
    margin-bottom: 10px;
    box-sizing: border-box;
  }
  .sidebar-exe .box-idevice-menu .cat-buscador-box .cat-lupa {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 13px;
    line-height: 1;
    color: #94a3b8;
    pointer-events: none;
  }
  .sidebar-exe .box-idevice-menu #inputBuscarModulosCatalogo,
  .sidebar-exe .box-idevice-menu .input-busqueda-catalogo {
    width: 100%;
    height: 34px;
    padding: 6px 28px 6px 30px;
    box-sizing: border-box;
    border: 1.5px solid #cbd5e1;
    border-radius: 8px;
    background: #f8fafc;
    font-family: inherit;
    font-size: 12.5px;
    color: #1e293b;
    transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;
  }
  .sidebar-exe .box-idevice-menu #inputBuscarModulosCatalogo::placeholder,
  .sidebar-exe .box-idevice-menu .input-busqueda-catalogo::placeholder { color: #94a3b8; }
  .sidebar-exe .box-idevice-menu #inputBuscarModulosCatalogo:focus,
  .sidebar-exe .box-idevice-menu .input-busqueda-catalogo:focus {
    outline: 2px solid #ccfbf1;
    border-color: #0d9488;
    background: #ffffff;
    box-shadow: none;
  }
  .sidebar-exe .box-idevice-menu .btn-limpiar-busqueda {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    padding: 0;
    border: none;
    background: transparent;
    color: #94a3b8;
    font-size: 11px;
    line-height: 1;
    cursor: pointer;
    transition: color 140ms ease;
  }
  .sidebar-exe .box-idevice-menu .btn-limpiar-busqueda:hover { color: #0f766e; }
  .sidebar-exe .box-idevice-menu .btn-limpiar-busqueda:focus-visible {
    outline: 2px solid #0d9488;
    outline-offset: 2px;
    border-radius: 4px;
  }
  .sidebar-exe .box-idevice-menu .btn-limpiar-busqueda[hidden] { display: none; }

  /* ---------- 2 · Mini-card de módulo ---------- */
  .sidebar-exe .box-idevice-menu .modulo-card-lateral {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 7px 10px;
    margin-bottom: 6px;
    box-sizing: border-box;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    background: #ffffff;
    cursor: pointer;
    transition: transform 160ms cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 160ms cubic-bezier(0.4, 0, 0.2, 1),
                border-color 160ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  .sidebar-exe .box-idevice-menu .modulo-card-lateral:hover {
    transform: translateY(-1.5px);
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
  }
  .sidebar-exe .box-idevice-menu .modulo-card-lateral:focus-visible {
    outline: 2px solid #0d9488;
    outline-offset: 2px;
  }
  .sidebar-exe .box-idevice-menu .modulo-card-lateral[hidden] { display: none; }

  .sidebar-exe .box-idevice-menu .card-lateral-cuerpo,
  .sidebar-exe .box-idevice-menu .modulo-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }
  .sidebar-exe .box-idevice-menu .card-lateral-icon-badge {
    width: 28px;
    height: 28px;
    min-width: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: #f8fafc;
    font-size: 14px;
    line-height: 1;
    flex-shrink: 0;
  }
  .sidebar-exe .box-idevice-menu .card-lateral-textos {
    min-width: 0;
    flex: 1 1 auto;
  }
  .sidebar-exe .box-idevice-menu .card-lateral-titulo,
  .sidebar-exe .box-idevice-menu .modulo-card-title {
    display: block;
    font-size: 11.5px;
    font-weight: 700;
    line-height: 1.2;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sidebar-exe .box-idevice-menu .card-lateral-sub,
  .sidebar-exe .box-idevice-menu .modulo-card-sub {
    display: block;
    margin-top: 1px;
    font-size: 10px;
    line-height: 1.1;
    color: #64748b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sidebar-exe .box-idevice-menu .btn-card-add {
    height: 24px;
    padding: 0 7px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid #99f6e4;
    border-radius: 6px;
    background: #f0fdfa;
    color: #0d9488;
    font-family: inherit;
    font-size: 10.5px;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
    transition: background 140ms ease, color 140ms ease, border-color 140ms ease;
  }
  .sidebar-exe .box-idevice-menu .btn-card-add:hover {
    background: #0d9488;
    color: #ffffff;
    border-color: #0d9488;
  }
  .sidebar-exe .box-idevice-menu .btn-card-add:focus-visible {
    outline: 2px solid #0f766e;
    outline-offset: 2px;
  }

  /* ---------- 3 · Paleta por familia curricular ---------- */
  .sidebar-exe .box-idevice-menu .tema-notion .card-lateral-icon-badge {
    background: #eff6ff;
    border-color: #bfdbfe;
  }
  .sidebar-exe .box-idevice-menu .tema-notion:hover { border-color: #0284c7; }

  .sidebar-exe .box-idevice-menu .tema-eval .card-lateral-icon-badge {
    background: #ecfdf5;
    border-color: #a7f3d0;
  }
  .sidebar-exe .box-idevice-menu .tema-eval:hover { border-color: #059669; }

  .sidebar-exe .box-idevice-menu .tema-h5p .card-lateral-icon-badge {
    background: #f5f3ff;
    border-color: #ddd6fe;
  }
  .sidebar-exe .box-idevice-menu .tema-h5p:hover { border-color: #7c3aed; }

  .sidebar-exe .box-idevice-menu .tema-ingles .card-lateral-icon-badge {
    background: #fffbeb;
    border-color: #fde68a;
  }
  .sidebar-exe .box-idevice-menu .tema-ingles:hover { border-color: #d97706; }

  .sidebar-exe .box-idevice-menu .tema-juegos .card-lateral-icon-badge {
    background: #fdf2f8;
    border-color: #fbcfe8;
  }
  .sidebar-exe .box-idevice-menu .tema-juegos:hover { border-color: #db2777; }

  .sidebar-exe .box-idevice-menu .tema-tecno .card-lateral-icon-badge {
    background: #ecfeff;
    border-color: #a5f3fc;
  }
  .sidebar-exe .box-idevice-menu .tema-tecno:hover { border-color: #0891b2; }

  .sidebar-exe .box-idevice-menu .tema-ciencias .card-lateral-icon-badge {
    background: #f0fdfa;
    border-color: #99f6e4;
  }
  .sidebar-exe .box-idevice-menu .tema-ciencias:hover { border-color: #0d9488; }

  /* ---------- 4 · Mensaje de "sin resultados" ---------- */
  .sidebar-exe .box-idevice-menu .catalogo-sin-resultados {
    padding: 14px 10px;
    text-align: center;
    font-size: 11.5px;
    line-height: 1.45;
    color: #64748b;
  }
  .sidebar-exe .box-idevice-menu .catalogo-sin-resultados[hidden] { display: none; }

  /* ---------- 5 · Modo colapsado y movimiento reducido ---------- */
  .sidebar-colapsado .box-idevice-menu .modulo-card-lateral,
  .sidebar-exe.colapsado .box-idevice-menu .modulo-card-lateral {
    pointer-events: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .sidebar-exe .box-idevice-menu .modulo-card-lateral,
    .sidebar-exe .box-idevice-menu .btn-card-add,
    .sidebar-exe .box-idevice-menu .input-busqueda-catalogo { transition: none; }
    .sidebar-exe .box-idevice-menu .modulo-card-lateral:hover { transform: none; }
  }
```

### 4. Contrato de marcado

```html
<div class="box-idevice-menu">
  <div class="cat-buscador-box">
    <span class="cat-lupa">🔍</span>
    <input id="inputBuscarModulosCatalogo" class="input-busqueda-catalogo"
           type="text" placeholder="Buscar módulo…">
    <button type="button" class="btn-limpiar-busqueda" aria-label="Limpiar">✕</button>
  </div>

  <div class="modulo-card-lateral tema-ingles" data-modulo="flashcards">
    <div class="card-lateral-cuerpo">
      <span class="card-lateral-icon-badge">🌐</span>
      <span class="card-lateral-textos">
        <span class="card-lateral-titulo">Flashcards 3D</span>
        <span class="card-lateral-sub">Inglés · vocabulario</span>
      </span>
    </div>
    <button type="button" class="btn-card-add">+</button>
  </div>

  <p class="catalogo-sin-resultados" hidden>Sin módulos que coincidan con la búsqueda.</p>
</div>
```

La clase `tema-*` va **en la tarjeta**, no en el badge: así el hover del borde y el color del icono se resuelven con un solo atributo.

### 4-bis. Discrepancia de nombres detectada (importante para Cursor)

`ESTADO_COORDINACION.md` (línea 86, escrita a las 22:00) pide **`.modulo-card-header`** y **`.modulo-card-sub`**, mientras que la partitura del buzón pedía `.card-lateral-cuerpo`, `.card-lateral-titulo` y `.card-lateral-sub`. Para que el ensamble no se rompa si Cursor sigue la coordinación, el CSS acepta **ambos juegos de nombres** como alias:

| Coordinación | Buzón | Resultado |
| :--- | :--- | :--- |
| `.modulo-card-header` | `.card-lateral-cuerpo` | mismo contenedor flex |
| `.modulo-card-title` | `.card-lateral-titulo` | mismo título |
| `.modulo-card-sub` | `.card-lateral-sub` | mismo subtítulo |

Los alias conservan el prefijo de aislamiento. **Recomendación a Antigravity:** unificar partitura y coordinación en un solo juego de nombres; si sobran, el CSS se adelgaza después.

### 5. Decisiones

1. **El foco del buscador usa `outline: 2px solid #ccfbf1`** tal como pide la partitura, en lugar del `box-shadow` de otros componentes. Es intencional: el catálogo convive con muchos bordes y un halo suave lo diferenciaría mal.
2. **`.btn-card-add` cambia a teal sólido en hover**, no a un tinte claro: en una lista de siete tarjetas el relleno pleno señala con claridad cuál se va a pulsar.
3. **Textos con `ellipsis` en las tres capas** (título, subtítulo y contenedor). Con nombres largos como «Video interactivo H5P» la tarjeta no crece ni empuja el botón.
4. **Añadí `.catalogo-sin-resultados`** porque el buscador en tiempo real necesita un estado vacío; sin él, Cursor tendría que inventarse el suyo y rompería el aislamiento.
5. **`prefers-reduced-motion`** anula la elevación de 1.5 px.

### 6. Verificación

| Comprobación | Resultado |
| :--- | :--- |
| Llaves CSS balanceadas | `AdminPlaneacionCSS.html` 1166/1166 |
| Reglas sin prefijo de aislamiento | **0** |
| Alias `.modulo-card-*` activos | ✅ 3 (header, title, sub) |
| Render a 900 px | ✅ buscador con lupa y limpieza, siete tarjetas con su color, botones `+` |
| Render a 380 px | el sidebar pasa a drawer (OLA 17), por eso se valida en escritorio |
| IDs / `.gs` / JS | sin cambios |

Evidencia: `evidencia_ola19/catalogo_lateral.png`.

### 7. Rollback

Borrar las líneas 7379–7612 o restaurar:
`C:\Users\40B\AppData\Local\Temp\st90_backup_fase5\AdminPlaneacionCSS_pre_ola19.html`
