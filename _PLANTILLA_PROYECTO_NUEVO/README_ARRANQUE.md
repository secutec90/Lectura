# GUÍA DE ARRANQUE RÁPIDO PARA PROYECTOS NUEVOS

Este kit contiene la estructura base para inicializar cualquier proyecto bajo la **orquesta multi-agente: Antigravity + DeepSeek + Cursor**.

---

## Cómo arrancar un proyecto nuevo en 3 pasos:

1. **Copia todo el contenido de esta carpeta (`_PLANTILLA_PROYECTO_NUEVO/`) a la raíz de tu proyecto nuevo.**
2. **Abre Antigravity en la carpeta nueva y dile:**
   > *"Hola Antigravity, inicialicemos este proyecto nuevo con la plantilla de orquestación. El proyecto consiste en: [describe brevemente tu objetivo]."*
3. **Antigravity configurará la arquitectura y la FASE 1 en `ESTADO_COORDINACION.md`:**
   * Definirá los contratos de DOM, clases CSS y backend.
   * DeepSeek y Cursor trabajarán y **guardarán automáticamente sus entregas en sus buzones**, sin que tengas que copiar y pegar código a mano.

---

## Flujo Automatizado de Buzones (Cero Copiado Manual):

```
┌─────────────────────────┐          ┌─────────────────────────┐
│     DEEPSEEK HARNESS    │          │         CURSOR          │
│   (Diseño UI / CSS)     │          │    (Frontend JS / DOM)  │
└───────────┬─────────────┘          └────────────┬────────────┘
            │ Escribe en                          │ Escribe en
            ▼ automático                          ▼ automático
 ┌──────────────────────┐               ┌──────────────────────┐
 │ ENTREGA_DEEPSEEK.md  │               │  ENTREGA_CURSOR.md   │
 └──────────┬───────────┘               └──────────┬───────────┘
            │                                      │
            └──────────────► ┌───────────────────┐ ◄┘
                             │    ANTIGRAVITY    │
                             │ (Audita, integra, │
                             │  commitea y sube) │
                             └───────────────────┘
```

---

## Contenido del Kit:

| Archivo / Carpeta | Propósito |
| :--- | :--- |
| `ESTADO_COORDINACION.md` | El contrato vivo previo. Contiene los IDs acordados y las partituras activas para cada fase. |
| `CONTROL_CAMBIOS.md` | La bitácora técnica acumulada de cambios cerrados con formato Conventional Commits. |
| `AGENTS.md` | Directiva global del repositorio que fija las reglas inmutables de los 3 agentes. |
| `DEEPSEEK.md` | Regla para DeepSeek Harness que lo obliga a guardar directamente en `ENTREGA_DEEPSEEK.md`. |
| `ENTREGA_DEEPSEEK.md` | Buzón donde DeepSeek deposita automáticamente sus propuestas de CSS y maquetación. |
| `ENTREGA_CURSOR.md` | Buzón donde Cursor deposita automáticamente sus controladores JS e informe técnico. |
| `.cursor/rules/buzon-entrega-cursor.mdc` | Regla automática de Cursor (`alwaysApply: true`) que lo obliga a guardar en `ENTREGA_CURSOR.md`. |
| `.cursor/rules/control-cambios.mdc` | Regla automática de Cursor (`alwaysApply: true`) para estampar el bloque Conventional Commits. |
| `INSTRUCCIONES_ORQUESTACION.html` | Guía interactiva navegable con botones de un clic para copiar prompts y ver la metodología. |
| `.rsc/_cargar_codigo.js` | Cargador local de Node.js para simular el backend y ejecutar pruebas sin desplegar a la nube. |
| `.rsc/test_regresion.js` | Suite de pruebas automatizadas locales (`node .rsc/test_regresion.js`). |
| `.rsc.json` | Configuración base del catálogo de arneses y herramientas. |
| `.gitignore` | Ignora artefactos del sistema operativo (como `desktop.ini`), temporales y bloqueos de sincronización. |
