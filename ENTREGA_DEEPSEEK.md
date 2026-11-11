# BUZÓN DE ENTREGA: DEEPSEEK -> ANTIGRAVITY

> **INSTRUCCIÓN PARA DEEPSEEK (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md`, `.skills/aula-constructor/SKILL.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_DEEPSEEK.md`) toda tu propuesta de maquetación Blade y estilos CSS para que Antigravity la audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js deepseek`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: FASE 1 — MAQUETACIÓN BLADE Y TAILWIND DEL CONSTRUCTOR VISUAL DE AULA EN LARAVEL (`resources/views/aula/constructor.blade.php`)
- **Agente responsable:** **DeepSeek** (Diseñador Visual, UX/UI & Blade/Tailwind)
- **Estado:** 🟢 **PROGRAMADA Y LISTA PARA EJECUCIÓN**
- **Documento Rector y Skill:** Consulta [.skills/aula-constructor/SKILL.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/.skills/aula-constructor/SKILL.md) y [RSC_MIGRACION_FUSION_LARAVEL.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/RSC_MIGRACION_FUSION_LARAVEL.md).

### Especificación Técnica de la Entrega:
1. **Vista Blade Principal (`resources/views/aula/constructor.blade.php`):**
   - Diseñar la vista extendiendo del layout base de Laravel o creando una plantilla inmersiva de ancho completo (`w-full min-h-screen bg-slate-50`).
2. **Barra Superior del Lienzo (`divi-canvas-topbar`):**
   - Sliders de Página y Sección (`40%` a `100%`) con etiquetas de porcentaje dinámico.
   - Botones de alineación (`⬅️` izquierda, `↔️` centro, `➡️` derecha).
   - Botón toggle rápido: `🏷️ Cabeceras: Visibles / Ocultas`.
   - Botones de Deshacer `↩️` y Rehacer `↪️`.
3. **Jerarquía DIVI (Sección > Fila > Columna > Módulo):**
   - Estilos hover limpios: Sección con borde azul (`hover:border-sky-500`), Fila con borde verde (`hover:border-emerald-500`).
   - Botón circular verde flotante `(+)` entre filas para selector de columnas (`.btn-plus-green`).
   - Dropzone de columna con estado activo (`.active-target` con fondo sutil y borde discontinuo).
   - Botón interior `[+ Añadir Módulo]` al pie de cada columna.
4. **Mosaicos y CSS Grid (Tailwind / CSS puro):**
   - Implementar las clases de cuadrícula: `col-1`, `col-2`, `col-2-70-30`, `col-3`, `col-4`, `mosaico-3-izq`, `mosaico-3-der` y el `mosaico-3` (6 subcolumnas asimétricas).
5. **Regla de Tarjetas Limpias:**
   - La clase `.content-card.tarjeta-sin-cabecera` para que las imágenes y módulos sin cabecera personalizada se muestren al 100% de ancho sin encabezados genéricos intrusivos.

---

### 📝 ZONA DE ENTREGA DE DEEPSEEK (Escribe tu propuesta aquí abajo):

*(DeepSeek: deposita aquí tu código Blade, clases Tailwind y CSS modular)*
