# Plan de Trabajo y Coordinación UI / UX — Secundaria Técnica 90

**Objetivo:** Eliminar la ambigüedad, evitar el "teléfono descompuesto" y asegurar que cada pantalla quede impecable, rápida y fácil de usar para los docentes sin romper la lógica del sistema.

---

## 1. División Estricta de Responsabilidades (Quién hace qué)

```
┌────────────────────────────────────────┐       ┌────────────────────────────────────────┐
│         DEEPSEEK HARNESS               │       │             ANTIGRAVITY                │
│       (Diseñador UI / UX / CSS)        │  ──>  │      (Ingeniero e Integrador)          │
├────────────────────────────────────────┤       ├────────────────────────────────────────┤
│ • Diseña la apariencia visual según    │       │ • Verifica que no se rompan IDs ni JS. │
│   ESTILO_UI_ST90.md.                   │       │ • Integra el CSS/HTML en el código     │
│ • Define paletas, márgenes, padding,   │       │   real del proyecto.                   │
│   alineaciones y responsividad.        │       │ • Cablea la lógica de datos y backend. │
│ • Entrega el código CSS listo dentro   │       │ • Ejecuta clasp push y despliega a     │
│   del "INFORME PARA ANTIGRAVITY".      │       │   producción (Google Sites).           │
│ • NO toca JS, ni IDs, ni clasp.        │       │ • Confirma a usuario que ya está vivo. │
└────────────────────────────────────────┘       └────────────────────────────────────────┘
```

---

## 2. Mapa de Ruta por Fases (Una pantalla a la vez)

Para no mezclar temas, trabajaremos **en orden secuencial**. No se pasa a la siguiente fase hasta que la anterior esté terminada y aprobada:

| Fase | Pantalla / Módulo | Objetivo Específico | Responsable de arrancar |
| :--- | :--- | :--- | :--- |
| **FASE 1** *(Completada)* | **Barra del Horario Oficial** | Cinta transparente centrada, una sola fila, iconos 18px ST90. | ✅ Completada y Desplegada |
| **FASE 2** *(En curso)* | **Asistente de IA (Pasos 1 al 4)** | Secuencia "pasos de bebé": en cada paso la IA da opciones directas limpias de un clic, sin ensayos pedagógicos mezclados en campos de texto. | 🤖 DeepSeek afina UI modal / Antigravity programa respuestas |
| **FASE 3** | **Formulario Esbozo NEM (4 Pasos)** | Pulir visualmente el stepper: espaciados, catálogo SEP dinámico en 2 columnas, caja UDEI/DUA y botones de navegación inferior. | 🎨 DeepSeek propone CSS |
| **FASE 4** | **Editor de Sesiones Didácticas (40 min)** | Barra de iDevices modulares (Lectura, Preguntas, Reto), diseño de fichas de sesión y vinculación con Libros de Texto SEP. | 🎨 DeepSeek propone CSS |
| **FASE 5** | **Homologación de Otras Vistas** | Asegurar que Asistencia, Usuarios, Lecturas y Encuestas compartan exactamente la misma armonía visual. | 🎨 DeepSeek propone CSS |

---

## 3. Protocolo de Comunicación Estándar (Sin rodeos)

Para evitar explicaciones largas que confundan, el flujo será siempre este:

1. **Tú le dices a DeepSeek:**  
   *"Trabajemos en la [FASE X: Nombre de la pantalla]. Dame tu propuesta de CSS/UI según ESTILO_UI_ST90.md con el INFORME PARA ANTIGRAVITY."*
2. **DeepSeek te responde con el bloque:**  
   `DeepSeek propone/hizo los siguientes cambios de diseño: INFORME PARA ANTIGRAVITY...`
3. **Tú me pegas ese bloque tal cual aquí.**
4. **Antigravity lo aplica, lo valida, lo sube con `clasp push` y despliega.**
5. **Tú recargas y revisas.** Si hay algo que corregir, se ajusta de inmediato antes de pasar a la siguiente fase.

---

## 4. Estado Actual: Fase 2 (Asistente de IA en los 4 Pasos)

- [x] **Paso 1 (Metadatos):** IA devuelve 3 títulos limpios con radio button + botón directo `✓ Usar este Título`.
- [ ] **Paso 2 (Contenidos & PDA):** Ayuda al docente a redactar adaptaciones o elegir PDA oficiales con un clic.
- [ ] **Paso 3 (Diagnóstico CTE & DUA):** Redactar de forma situada la justificación del problema comunitario y ajustes DUA.
- [ ] **Paso 4 (Propósito & Producto):** Redacción directa del propósito formativo y el producto central tangible.
