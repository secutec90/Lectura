# BUZÓN DE ENTREGA: CURSOR -> ANTIGRAVITY

> **INSTRUCCIÓN PARA CURSOR (REGLA AUTOMÁTICA):**  
> Lee `ESTADO_COORDINACION.md`, `.skills/aula-constructor/SKILL.md` y esta partitura asignada.  
> Escribe y guarda aquí mismo (`ENTREGA_CURSOR.md`) todo tu código JavaScript cliente y controladores Laravel para que Antigravity lo audite e integre.  
> **PROTOCOLO CENTINELA (OBLIGATORIO AL TERMINAR):** En cuanto guardes tu entrega en este archivo, ejecuta inmediatamente en tu terminal:  
> `node herramientas/centinela_buzon.js cursor`  
> para quedar a la escucha (revisión automática cada 60 segundos) de la siguiente partitura que deposite Antigravity.

---

## 🎯 PARTITURA ASIGNADA: FASE 1 — CONTROLADOR API LARAVEL Y ESQUELETO DE PERSISTENCIA DEL LIENZO
- **Agente responsable:** **Cursor** (Desarrollador Fullstack & JS/DOM)
- **Estado:** 🟢 **PROGRAMADA Y LISTA PARA EJECUCIÓN (EN PARALELO CON DEEPSEEK)**
- **Documento Rector y Skill:** Consulta [.skills/aula-constructor/SKILL.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/.skills/aula-constructor/SKILL.md) y [RSC_MIGRACION_FUSION_LARAVEL.md](file:///g:/Mi%20unidad/PROYECTOS/Lectura/RSC_MIGRACION_FUSION_LARAVEL.md).

### Tarea de Preparación:
1. Diseñar el controlador de Laravel: `app/Http/Controllers/Aula/SesionAulaController.php` con los métodos:
   - `guardarLienzo(Request $request, $sesionId)`: recibe el JSON del lienzo y lo persiste en `sesiones_clase.lienzo_json` y `config_visual_json`.
   - `obtenerLienzo($sesionId)`: retorna la estructura JSON con tiempos de respuesta en milisegundos.
2. Preparar el módulo de cliente JS `public/js/aula/constructor-cliente.js` para desacoplar las llamadas de `google.script.run` y reemplazarlas por `fetch('/api/aula/sesion/' + id + '/guardar')`.

---

### 📝 ZONA DE ENTREGA DE CURSOR (Escribe tu propuesta aquí abajo):

*(Cursor: deposita aquí tu código de controlador Laravel y funciones JS cliente)*
