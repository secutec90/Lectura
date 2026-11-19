# 🚀 GUÍA OPERATIVA DEL MOTOR AUTÓNOMO MULTI-AGENTE (METODOLOGÍA SPACEX)

Este documento describe la arquitectura técnica, protocolos de ejecución y arranque rápido del **Sistema Autónomo de Ingeniería Multi-Agente** basado en el modelo de alto rendimiento de SpaceX (Lauren Tan: 50+ agentes, 1,000+ PRs/mes).

---

## 1. Arquitectura de Roles y Separación de Responsabilidades

El sistema opera bajo una jerarquía estricta sin cuellos de botella humanos:

```
                                      CHIEF OF STAFF & RELEASE LEAD
                                              (Antigravity)
                                                    │
                      ┌─────────────────────────────┴─────────────────────────────┐
                      ▼                                                           ▼
            DESIGN & UX/UI LEAD                                         SOFTWARE & DOM LEAD
          (DeepSeek API - Headless)                                    (Antigravity / Cursor)
       • Maquetación Blade, HTML semántico                         • Controladores y Modelos backend
       • Tokens de diseño y CSS puro/embebido                      • Recursos y Widgets de Filament v3
       • Diseños oficiales @media print Letter/Oficio              • Migraciones y Esquemas de Base de Datos
       • Accesibilidad Universal (WCAG 2.1 AA / DUA)               • Rutas web y políticas de seguridad
                      │                                                           │
                      └─────────────────────────────┬─────────────────────────────┘
                                                    ▼
                                      CLOSED FEEDBACK LOOP (AST)
                                       • Auditoría con php -l
                                       • Self-Healing automático si hay error
                                                    ▼
                                            GIT COMMIT & PUSH
                                          (Gobernanza exclusiva)
                                                    ▼
                                           DESPLIEGUE CONTINUO
                                          (Coolify / Hetzner VPS)
                                                    ▼
                                        VERIFICACIÓN HTTP 200 EN VIVO
```

### Tabla de Responsabilidades

| Agente | Canal de Ejecución | Responsabilidad Exclusiva | Prohibiciones Estrictas |
| :--- | :--- | :--- | :--- |
| **Antigravity** | Agente Director (Chief of Staff) | • Gobernanza de Git (`commit`, `push`, ramas).<br>• Controladores backend, Filament v3, bases de datos y rutas.<br>• Auditoría sintáctica `php -l`, compilación y despliegue.<br>• Definición de *Feature Maps* y orquestación de Olas. | Aprobar código sin pasar pruebas sintácticas o que viole el Feature Map. |
| **DeepSeek** | Headless API (`api.deepseek.com`) | • Experiencia visual (UI/UX) y maquetación Blade.<br>• Estilos CSS embebidos, tokens de diseño y diseño responsivo.<br>• Plantillas oficiales de impresión `@media print` Letter / Oficio.<br>• Accesibilidad DUA y validación de contrastes. | Modificar lógica backend, renombrar IDs del DOM acordados o ejecutar comandos Git. |
| **Cursor** | IDE Local / Editor de Inspección | • Entorno de desarrollo local e inspección visual de código.<br>• Navegación, depuración interactiva y refactorización manual.<br>• (Opcional) Generación asistida de código con Cursor Composer. | Ejecutar `git push` directo a ramas protegidas o alterar contratos sin consenso. |

---

## 2. Los 3 Pilares del Motor Autónomo

### A. Feature Maps Quirúrgicos (Cero Alucinación)
Antes de generar código, Antigravity define en `ESTADO_COORDINACION.md`:
- Rutas absolutas y relativas exactas de los archivos.
- Contrato estricto de variables requeridas y valores por defecto (`asegurarDatosDemo()`).
- Selectores e IDs inmutables del DOM (ej. `#btnAccionPrincipal`, `.tc-corte`).

### B. Closed Feedback Loops & Auto-Reparación (*Self-Healing*)
1. El código se genera en memoria o en archivos temporales.
2. Antigravity somete el código a linters y analizadores sintácticos (`php -l`).
3. **Auto-reparación:** Si se detecta un error de sintaxis o tipo, el despachador le reenvía automáticamente el stack trace al modelo generador hasta que compile en verde con 0 errores antes de la integración.

### C. Guardrails Inmutables
- **Guardrail de Git/Deploy:** Solo Antigravity ejecuta `git commit`, `git push` y llamadas a webhooks de despliegue.
- **Guardrail de Resiliencia:** Ningún endpoint puede fallar con error 500 si la base de datos está vacía; toda vista debe incluir preámbulos `@php` tolerantes con datos mock por defecto.
- **Guardrail de Credenciales:** Claves de API resguardadas en `.env.spacex` e ignoradas en `.gitignore`.

---

## 3. El Despachador Autónomo (`herramientas/despachador_spacex.js`)

El motor incluye un despachador headless que automatiza la comunicación con la API de DeepSeek:

```bash
# Probar conexión con DeepSeek API
node herramientas/despachador_spacex.js --test-api

# Ver estado de credenciales y configuración
node herramientas/despachador_spacex.js --estado
```

### Configuración de Credenciales
Crea el archivo `herramientas/.env.spacex` (basado en `herramientas/.env.spacex.example`):
```env
DEEPSEEK_API_KEY=sk-tu-api-key-aqui
```

---

## 4. Arranque de un Proyecto Nuevo en 3 Pasos

Para inicializar un nuevo proyecto con esta metodología:

1. **Copiar la plantilla base:**
   ```bash
   cp -r _PLANTILLA_PROYECTO_NUEVO/* /ruta/a/tu/nuevo-proyecto/
   ```
2. **Configurar tu API Key:**
   ```bash
   cd /ruta/a/tu/nuevo-proyecto/
   cp herramientas/.env.spacex.example herramientas/.env.spacex
   # Edita herramientas/.env.spacex y coloca tu DEEPSEEK_API_KEY
   ```
3. **Arrancar la primera Ola con Antigravity:**
   - Abre el proyecto con Antigravity y di:  
     *«Antigravity, inicializa la Ola 1 del proyecto siguiendo el Feature Map de ESTADO_COORDINACION.md»*.
   - El sistema generará el frontend con DeepSeek API, el backend con Antigravity, compilará, comiteará y desplegará sin que tengas que intervenir.

---

## 5. Historial de Olas y Registro
- Cada Ola completada se archiva automáticamente en `archivo_entregas/ENTREGA_<AGENTE>_ola<N>.md`.
- El progreso global y los enlaces de producción se mantienen actualizados en [ESTADO_COORDINACION.md](ESTADO_COORDINACION.md).
