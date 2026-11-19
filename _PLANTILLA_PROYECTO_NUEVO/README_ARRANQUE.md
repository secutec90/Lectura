# GUÍA DE ARRANQUE RÁPIDO PARA PROYECTOS NUEVOS (SPACEX MULTI-AGENT FRAMEWORK)

Este kit contiene la estructura base para inicializar cualquier proyecto de software bajo una **organización de ingeniería autónoma multi-agente**: **Antigravity (Chief of Staff & Software/Release Lead) + DeepSeek API (Design & UX Lead) + Cursor (Local IDE / Review Lead)**.

> 📖 **Documentación Técnica Completa:** Consulta [GUIA_MOTOR_AUTONOMO_SPACEX.md](GUIA_MOTOR_AUTONOMO_SPACEX.md) para conocer en detalle la arquitectura headless, guardrails inmutables y el motor `despachador_spacex.js`.

---

## Cómo arrancar un proyecto nuevo en 3 pasos:

1. **Copia todo el contenido de esta carpeta (`_PLANTILLA_PROYECTO_NUEVO/`) a la raíz de tu proyecto nuevo.**
2. **Configura tu API Key de DeepSeek en `herramientas/.env.spacex`:**
   ```bash
   cp herramientas/.env.spacex.example herramientas/.env.spacex
   # Coloca tu DEEPSEEK_API_KEY
   ```
3. **Abre Antigravity en la carpeta nueva y dile:**
   > *"Hola Antigravity, inicialicemos este proyecto nuevo con la plantilla de orquestación SpaceX. El proyecto consiste en: [describe brevemente tu objetivo y tecnologías]."*
4. **Antigravity configurará la arquitectura, el Feature Map y la OLA 1 en `ESTADO_COORDINACION.md`:**
   * Definirá los contratos de DOM, clases CSS, esquema de datos y Guardrails.
   * Ejecutará el despachador autónomo (`herramientas/despachador_spacex.js`) para invocar a DeepSeek por API y desarrollará el backend en bucle cerrado (`php -l`), comiteará en Git y desplegará en la nube sin requerir intervención manual.

---

## Flujo Operativo Autónomo (SpaceX Framework):

```
                                  REQUERIMIENTO DEL PROYECTO
                                              │
                                              ▼
                                ┌───────────────────────────┐
                                │   ANTIGRAVITY (Chief)     │
                                │ • Redacta Feature Maps    │
                                │ • Fija Guardrails e IDs   │
                                │ • Asigna Olas en buzones  │
                                └─────────────┬─────────────┘
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    ▼                                                   ▼
     ┌─────────────────────────────┐                     ┌─────────────────────────────┐
     │      DEEPSEEK (UX Lead)     │                     │     CURSOR (Software Lead)  │
     │ • Maquetación Blade / HTML  │                     │ • Controladores y APIs      │
     │ • Estilos CSS & Tokens      │                     │ • Widgets y Formularios     │
     │ • Accesibilidad DUA / WCAG  │                     │ • Lógica reactiva del DOM   │
     └──────────────┬──────────────┘                     └──────────────┬──────────────┘
                    │ Escribe en                                        │ Escribe en
                    │ automático                                        │ automático
                    ▼                                                   ▼
     ┌─────────────────────────────┐                     ┌─────────────────────────────┐
     │     ENTREGA_DEEPSEEK.md     │                     │      ENTREGA_CURSOR.md      │
     └──────────────┬──────────────┘                     └──────────────┬──────────────┘
                    │                                                   │
                    └─────────────────────────┬─────────────────────────┘
                                              │
                                              ▼
                                ┌───────────────────────────┐
                                │   VIGILANTE DE ORQUESTA   │
                                │ • Alerta sonora en Windows│
                                │ • Notificación Toast      │
                                │ • Prompt en Portapapeles  │
                                └─────────────┬─────────────┘
                                              │
                                              ▼
                                ┌───────────────────────────┐
                                │ AGENT EVALS & SELF-HEALING│
                                │ • Pruebas php -l & Linters│
                                │ • Verificación cURL HTTP  │
                                └─────────────┬─────────────┘
                                              │
                                              ▼
                                ┌───────────────────────────┐
                                │ GIT COMMIT, PUSH & DEPLOY │
                                │ (Gobernanza Antigravity)  │
                                └───────────────────────────┘
```

---

## Contenido del Kit:

| Archivo / Carpeta | Propósito |
| :--- | :--- |
| `AGENTS.md` | Directiva global del repositorio con las reglas inmutables de los 3 agentes y los 3 pilares SpaceX (Feature Maps, Closed Feedback Loops y Guardrails). |
| `ESTADO_COORDINACION.md` | El contrato vivo previo. Contiene los Feature Maps, IDs acordados y las partituras activas para cada Ola. |
| `CONTROL_CAMBIOS.md` | La bitácora técnica acumulada de cambios cerrados con formato Conventional Commits. |
| `DEEPSEEK.md` | Regla para DeepSeek Harness que lo obliga a guardar directamente en `ENTREGA_DEEPSEEK.md` y ejecutar auto-reparación si hay errores. |
| `ENTREGA_DEEPSEEK.md` | Buzón donde DeepSeek deposita automáticamente sus propuestas de CSS y maquetación. |
| `ENTREGA_CURSOR.md` | Buzón donde Cursor deposita automáticamente sus controladores, widgets e informe técnico. |
| `.cursor/rules/buzon-entrega-cursor.mdc` | Regla automática de Cursor (`alwaysApply: true`) que lo obliga a consultar el Feature Map y guardar en `ENTREGA_CURSOR.md`. |
| `.cursor/rules/control-cambios.mdc` | Regla automática de Cursor (`alwaysApply: true`) para estampar el bloque Conventional Commits. |
| `iniciar_vigilante.cmd` | Lanzador con doble clic del Vigilante de Orquesta: supervisa buzones, emite sonido, Toast y auto-copia el prompt al portapapeles. |
| `.rsc/vigilante_orquesta.js` | Motor de supervisión continua de buzones con puente nativo a Windows (sonido, notificación y portapapeles). |
| `.rsc/centinela_buzon.js` | Vigilante de buzón en consola con alertas sonoras y de portapapeles. |
| `.rsc/_cargar_codigo.js` | Cargador local para pruebas y simulación sin desplegar a la nube. |
| `.rsc/test_regresion.js` | Suite de pruebas automatizadas locales (`node .rsc/test_regresion.js`). |
| `INSTRUCCIONES_ORQUESTACION.html` | Guía interactiva navegable con botones de un clic para copiar prompts y ver la metodología. |
| `.gitignore` | Ignora artefactos del sistema operativo, temporales y bloqueos de sincronización. |
