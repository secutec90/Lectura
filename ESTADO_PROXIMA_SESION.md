# 📌 ESTADO DE RELEVO Y PLAN MAESTRO CONSOLIDADO — SUITE ESCOLAR ST90

**Fecha de corte:** 2026-11-04  
**Versión activa en producción:** `@583` (`v429 · build-588`)  
**Rama Git:** `main` (Proyecto en Google Drive: `G:\Mi unidad\PROYECTOS\Lectura`)  
**Base de datos:** Google Sheets ID `1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU`  
**Script ID de Google Apps Script:** `1ZEO8UIBu91bDGSV8WPM9J5M3JvvXLgJb7ICqGVulYjnDeJHarSLRvkik`  
**Cuenta de Google Apps Script / Clasp:** `secutec90@gmail.com`

---

## 🧭 GUÍA DE ARRANQUE PARA LA NUEVA COMPUTADORA

Si vas a abrir este proyecto en una nueva computadora, sigue estos sencillos pasos para que todo funcione de inmediato:

### 1. Acceso a los Archivos
- El proyecto vive en tu Google Drive sincronizado en:
  `G:\Mi unidad\PROYECTOS\Lectura` (o la letra de unidad correspondiente en la nueva máquina).
- Al tener Google Drive para escritorio instalado, todos los archivos estarán exactamente sincronizados.

### 2. Entorno Node.js y Herramientas
- El proyecto utiliza **Node.js v20.18.0 (LTS)** para verificación sintáctica (`herramientas/manifiesto.js`) y centinelas (`herramientas/centinela_buzon.js`).
- **Instalación rápida en la nueva máquina:**
  - Instalar Node.js desde [nodejs.org](https://nodejs.org/) (o conservar la carpeta portable en `%LOCALAPPDATA%\nodejs-portable`).
  - Instalar Clasp globalmente para desplegar a Google Apps Script:
    ```powershell
    npm install -g @google/clasp
    ```

### 3. Autenticación de Clasp (Google Apps Script)
- Para que `clasp push` funcione sin volver a pedir permisos si copias tu usuario:
  - Copia el archivo de credenciales `~/.clasprc.json` (ubicado en `C:\Users\<tu-usuario>\.clasprc.json`) a la misma ruta en la nueva máquina.
  - O si prefieres volver a iniciar sesión desde la terminal:
    ```powershell
    clasp login
    ```
    (Inicia sesión con la cuenta oficial institucional: `secutec90@gmail.com`).

### 4. Verificación de Integridad Sintáctica (AST)
- Antes de desplegar cualquier cambio, ejecuta siempre el verificador sintáctico para garantizar 0 errores:
  ```powershell
  node herramientas/manifiesto.js
  ```
  *(Debe reportar: `documentos sin parsear: 0`).*

### 5. Comandos de Despliegue Oficial (Exclusivos de Antigravity)
- **Subir cambios:**
  ```powershell
  clasp push -f
  ```
- **Crear versión y desplegar en los 5 endpoints oficiales:**
  ```powershell
  clasp version "vXXX-build-YYY-descripcion"
  clasp deploy -i AKfycbxDw5ITzPHqaX68RdZ8F2Xpywp_dZX8ORz3k00ZVrpmarmDGgCYxgjkRfYrfJKRUDJ1Ug -V <num>
  clasp deploy -i AKfycbzkoAhW2vraK6fpgKH3AZ6mpMRctfmPHWjF4lMFYE2Ku1aptJTz68Ga2jI3g8ZcPikOHw -V <num>
  clasp deploy -i AKfycbz1-xheu_68hU7LpM0_3sUSfqwsb1Hw775eWuHgwmPTJWtvGY7cCh0AR4zcq2Lg32DIBQ -V <num>
  clasp deploy -i AKfycbzPQDTjMqHGpSfBg3KMrDBpxSweOAk2x5adcMLJ4aJHvM2ETGtGI-rm1bz3aDRxj-FAgQ -V <num>
  clasp deploy -i AKfycbwYr2eeYCG7o0fKe1pJr70ljjXsXaA4RUtoM07RdSjtrU0_DTOjOIpG19GIbYtknxWGUg -V <num>
  ```

---

## 🏛️ Directiva para los 3 Agentes (Antigravity, Cursor, DeepSeek)

> **REGLA DE ORO DE `AGENTS.md`:**
> 1. **Antigravity:** Gobernanza, backend `.gs`, auditoría sintáctica, integración central y despliegue exclusivo (`clasp push/deploy`).
> 2. **DeepSeek:** Estilos CSS (`AdminPlaneacionCSS.html`, `ClaseCSS.html`, `ComunCSS.html`). Entrega en `ENTREGA_DEEPSEEK.md`.
> 3. **Cursor:** Frontend e interacción JS (`AyudaJS.html`, `AdminPlanJS_*.html`). Entrega en `ENTREGA_CURSOR.md`.
> 4. **Centinelas:** Al terminar una tarea, cada agente mantiene activo `node herramientas/centinela_buzon.js <agente>`.

---

## 📦 Historial Consolidado de Olas Concluidas

| Ola / Build | Alcance Técnico Concluido | Estado |
| :--- | :--- | :--- |
| **Ola 1 a 4 (`build-568` a `build-571`)** | Membrete institucional oficial NL, lista de cotejo y rúbrica SEP 4 niveles, constructor dual encuestas/quizzes, multimedia y subida a Drive. | 🟢 COMPLETADA |
| **Ola 5 (`build-578`/`build-579`)** | Entorno eXeLearning 3.0 con árbol de páginas (con lápiz ✏️ de renombrado), catálogo de 7 familias "Contenidos de Aprendizaje" y lienzo frontal derecho. | 🟢 COMPLETADA |
| **Ola 6 & 6.1 (`build-580` a `build-582`)** | Erradicación total y candado contra `.idevice-bar` y `.quick-ribbon`. Asistente Pedagógico Lucy IA y encuesta diagnóstica en menú lateral. | 🟢 COMPLETADA |
| **Ola 7 (`build-583`)** | Flujo lógico secuencial (Paso 1: Guion de 4 momentos ➔ Conector Lucy IA ➔ Paso 2: Constructor interactivo eXeLearning). Iconos de ayuda `?` y audio DUA `🔊` por momento. Modelo de ponderación de calificaciones. | 🟢 COMPLETADA |
| **Ola 8 (`build-584`)** | Reorganización del editor de sesión en **4 tabs horizontales guiados** estilo stepper (`1. Guion` ➔ `2. Asistente Lucy` ➔ `3. Constructor eXeLearning` ➔ `4. Vista Previa Alumno`). | 🟢 COMPLETADA |
| **Ola 9 (`build-585`)** | **Maqueta de Navegador Elegante del Alumno (Estilo Apple Education / Google Classroom):** Marco `.browser-frame` institucional con topbar oscura, hero con gradiente y pulso live, menú espacioso de 4 momentos, reproductor DUA con ecualizador animado, buzón drag & drop punteado y quiz autocalificable. | 🟢 COMPLETADA |
| **Ola 9.1 (`build-586`)** | **Desglose IA Resiliente y Depuración de Toolbar:** Algoritmo pedagógico fallback DUA para `✨ Desglosar con IA` (garantiza funcionamiento sin errores ni bloqueos). Eliminación del botón modal redundante en la toolbar superior para dejar la cabecera limpia. | 🟢 COMPLETADA |
| **Ola 10 (`build-587`)** | **Motor de Clases Interactivas de Extremo a Extremo (7 Contenidos de Aprendizaje NEM):** Integración completa de teoría DUA, modelado paso a paso, práctica guiada, checklist con barra de avance de autoevaluación y matriz de rúbrica SEP de 4 niveles en el aula virtual del alumno. | 🟢 COMPLETADA |
| **Ola 11 (`build-588`)** | **Gestión Dual de Turnos y Homologación de Horarios XML:** Selector reactivo de turno `☀️ Matutino` / `🌙 Vespertino` en la cinta ribbon, asistente modal aSc con selector explícito y editor/homologador masivo de docentes y materias en la base de datos `Horarios`. | 🟢 COMPLETADA |

---

## 🔗 Enlaces Oficiales de Despliegue en Producción

- **Admin / Docente (Suite Completa):**  
  [Abrir Admin Planeación Didáctica](https://script.google.com/macros/s/AKfycbzPQDTjMqHGpSfBg3KMrDBpxSweOAk2x5adcMLJ4aJHvM2ETGtGI-rm1bz3aDRxj-FAgQ/exec?pagina=admin)
- **Portal Alumno / Aula Hablada:**  
  [Abrir Portal Alumno](https://script.google.com/macros/s/AKfycbzPQDTjMqHGpSfBg3KMrDBpxSweOAk2x5adcMLJ4aJHvM2ETGtGI-rm1bz3aDRxj-FAgQ/exec?pagina=clase)
- **Google Sites Institucional (Lec90):**  
  `https://sites.google.com/view/lec90`
