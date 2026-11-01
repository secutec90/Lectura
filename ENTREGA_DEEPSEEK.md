# 📬 BUZÓN DE ENTREGA AUTOMÁTICA — DEEPSEEK (DISEÑADOR VISUAL UI/UX & CSS)

> **REGLA DE ORO:** DeepSeek escribe y guarda aquí directamente su propuesta CSS/HTML sin pedirle al usuario que copie y pegue en el chat. Antigravity lee este archivo para auditar e integrar.

---

## 🎯 PARTITURA ASIGNADA PARA LA SESIÓN DE MAÑANA: ESTILOS DE CHIPS DUA, LISTA DE COTEJO EDITABLE Y HOJA CARTA PDF OFICIAL NL (`build-568`)

**Estado:** 🟢 PROGRAMADA — LISTA PARA EJECUCIÓN DE DEEPSEEK  
**Versión Base:** `v418 · build-567` (`@567`)  
**Archivos objetivo de referencia:** `AdminPlaneacionCSS.html`, `ClaseCSS.html`, `ComunCSS.html`

---

### 🎨 Especificaciones Visuales para DeepSeek

1. **Chips Rápidos de Ajustes Razonables DUA (`.nem-chip-dua-rapido`) en Etapa 3:**
   - Diseñar píldoras interactivas compactas (`font-size: 11px`, `padding: 4px 10px`, `border-radius: 999px`, fondo `#fffbeb`, borde `#fcd34d`, texto `#92400e`, hover `#fef3c7` con transición suave de `150ms`) para insertar ajustes razonables DUA con un clic sin recargar `#secInclusionBAPyC`.

2. **Tabla Editable de Lista de Cotejo / Rúbrica (`#cajaRubricaCotejoNEM` y `.nem-tabla-cotejo-edit`) en Etapa 4:**
   - Diseñar un contenedor limpio con encabezado compacto, contador de criterios (`3 de 5 criterios`) y filas editables con inputs sin bordes pesados que se iluminen al enfocar (`focus: border-color #2563eb`), columnas indicadoras (`Sí ✓ | En proceso | No todavía`) y botón sutil `×` para eliminar fila.

3. **Estilos de Hoja Papel Carta para `#modalVistaPreviaPDFOficialNL` y `.st90-doc-oficial-nl`:**
   - Refinar la presentación en pantalla del Plano Didáctico Oficial de Nuevo León para que luzca como una hoja tamaño Carta real sobre escritorio oscuro, asegurando contraste nítido y reglas `@media print` limpias.

4. **Protocolo Centinela (Polling Automático cada 60s):**
   - Al terminar de guardar tu entrega en este archivo (`ENTREGA_DEEPSEEK.md`), ejecuta inmediatamente en tu terminal:
     ```bash
     node herramientas/centinela_buzon.js deepseek
     ```
