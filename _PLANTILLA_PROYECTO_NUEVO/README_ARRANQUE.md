# GUÍA DE ARRANQUE RÁPIDO PARA PROYECTOS NUEVOS

Este kit contiene la estructura base para inicializar cualquier proyecto bajo la **orquesta multi-agente: Antigravity + DeepSeek + Cursor**.

---

## Cómo usar este kit en 3 pasos:

1. **Copia todo el contenido de esta carpeta (`_PLANTILLA_PROYECTO_NUEVO/`) a la raíz de tu proyecto nuevo.**
2. **Abre Antigravity en la carpeta nueva y dile:**
   > *"Hola Antigravity, inicialicemos este proyecto nuevo con la plantilla de orquestación. El proyecto consiste en: [describe brevemente tu objetivo]."*
3. **Antigravity configurará la FASE 1 en `ESTADO_COORDINACION.md`:**
   * Definirá los IDs del DOM, clases CSS y backend.
   * Te entregará los prompts listos para copiar a DeepSeek Harness y a Cursor.

---

## Contenido del Kit:

| Archivo / Carpeta | Propósito |
| :--- | :--- |
| `ESTADO_COORDINACION.md` | El contrato vivo previo. Contiene los IDs acordados y las partituras activas para DeepSeek, Cursor y Antigravity. |
| `CONTROL_CAMBIOS.md` | La bitácora técnica de cambios cerrados y confirmados con formato Conventional Commits. |
| `.cursor/rules/control-cambios.mdc` | Regla automática de Cursor (`alwaysApply: true`) que entrega el bloque de cierre al terminar cada tarea. |
| `.rsc/_cargar_codigo.js` | Cargador local de Node.js para simular el backend y ejecutar pruebas sin desplegar a la nube. |
| `.rsc/test_regresion.js` | Suite de pruebas automatizadas locales para validar sintaxis y verificar que no se rompa nada antes de hacer push. |
| `.rsc.json` | Configuración base del catálogo de arneses y herramientas. |
| `.gitignore` | Ignora artefactos del sistema operativo (como `desktop.ini`), temporales y bloqueos de sincronización. |
