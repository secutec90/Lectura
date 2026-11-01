# 📬 BUZÓN DE ENTREGA AUTOMÁTICA — CURSOR (INGENIERO FRONTEND DOM/JS)

> **REGLA DE ORO:** Cursor escribe y guarda aquí directamente su código JS y reporte técnico sin pedirle al usuario que copie y pegue en el chat. Antigravity lee este archivo para auditar e integrar.

---

## 🎯 PARTITURA ASIGNADA PARA LA SESIÓN DE MAÑANA: ETAPAS 3 Y 4 — CHIPS DUA DE 1 CLIC Y LISTA DE COTEJO EDITABLE CONECTADA AL PDF OFICIAL NL (`build-568`)

**Estado:** 🟢 PROGRAMADA — LISTA PARA EJECUCIÓN DE CURSOR  
**Versión Base:** `v418 · build-567` (`@567`)  
**Archivos objetivo de referencia:** `AdminPlanJS_04.html`, `ClaseJS_06.html`, `AyudaJS.html`

---

### 📋 Especificaciones Técnicas para Cursor

1. **Chips Rápidos de Ajustes Razonables DUA en Etapa 3 (`#secInclusionBAPyC`):**
   - Debajo del encabezado de inclusión DUA/UDEI/BAPyC, renderizar o conectar 4 chips de inserción rápida en 1 clic (`.nem-chip-dua-rapido`):
     - `+ Macrotipo y Alto Contraste`
     - `+ Audio DUA y Lectura Guiada`
     - `+ Tiempos Flexibles y Pausas Activas`
     - `+ Parejas Tutoras y Andamiaje Visual`
   - Al hacer clic en cualquiera de ellos, agregar la viñeta correspondiente en `textarea#planAjustesRazonables` sin borrar lo que el docente ya haya escrito y disparar el autoguardado en `localStorage`.

2. **Editor Interactivo de Lista de Cotejo / Rúbrica en Etapa 4 (`#cajaRubricaCotejoNEM`):**
   - En la Etapa 4 (`#etapaPlanNEM_4`), permitir al docente visualizar y editar entre **3 y 5 criterios de evaluación formativa** (`Criterio de Evaluación Técnica, Formativa y Socioemocional`).
   - Incluir:
     - Botón `+ Agregar criterio` (máximo 5 criterios).
     - Botón `✨ Generar criterios desde PDA` (que construye automáticamente los criterios a partir de los PDA seleccionados en `#planPDA` y el propósito en `#planProposito`).
     - Botón `×` por fila para quitar un criterio (manteniendo mínimo 1 criterio obligatorio).
   - Guardar el arreglo de criterios en `window.criteriosCotejoPlanNEM_` y en el borrador de `localStorage`.

3. **Conexión Directa con el Plano Didáctico PDF Oficial de Nuevo León (`AyudaJS.html`):**
   - Actualizar `_generarHtmlDocumentoPlanoDidacticoNL_(p, sesiones)` para que la tabla `INSTRUMENTO DE EVALUACIÓN FORMATIVA — LISTA DE COTEJO` renderice dinámicamente los criterios personalizados de `window.criteriosCotejoPlanNEM_` (o los 5 criterios institucionales por defecto si no se han editado).

4. **Protocolo Centinela (Polling Automático cada 60s):**
   - Al terminar de guardar tu entrega en este archivo (`ENTREGA_CURSOR.md`), ejecuta inmediatamente en tu terminal:
     ```bash
     node herramientas/centinela_buzon.js cursor
     ```
