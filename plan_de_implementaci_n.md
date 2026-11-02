# Plan de Implementación Técnica: Constructor de Formularios y Quizzes Avanzado ST90

**Versión:** 1.0 (build-571 roadmap)  
**Sistema:** Suite Escolar ST90 (Fase 6 NEM / Secundaria Técnica No. 90)  
**Objetivo:** Integrar en el constructor de formularios y quizzes nativo las funciones clave de Google Forms (multimedia en reactivos, subida de archivos, secciones, aleatorización, retroalimentación diferenciada y temporizador) preservando la retrocompatibilidad con las hojas de cálculo `Formulario`, `Configuracion` y `Respuestas`.

---

## 1. Arquitectura de Datos y Retrocompatibilidad

Para no alterar la estructura de 11 columnas de la hoja `Formulario` (`id`, `tipo`, `etiqueta`, `ayuda`, `placeholder`, `obligatoria`, `opciones`, `orden`, `activa`, `columna`, `extra`), todas las nuevas capacidades se encapsulan en el campo `extra` (JSON serializado) y en la hoja `Configuracion`.

### 1.1 Esquema extendido de la columna `extra`
```json
{
  "esQuiz": true,
  "puntos": 2,
  "respuestaCorrecta": "B",
  "retroalimentacion": {
    "acierto": "¡Excelente deducción! El circuito en serie divide el voltaje.",
    "fallo": "Recuerda que en un circuito en serie la corriente es constante, pero el voltaje se divide."
  },
  "media": {
    "tipo": "imagen",
    "url": "https://drive.google.com/uc?export=view&id=...",
    "pie": "Figura 1. Diagrama de conexiones"
  },
  "archivoConfig": {
    "tiposPermitidos": ["pdf", "jpg", "png"],
    "maxMb": 10,
    "maxArchivos": 2
  },
  "seccionId": "sec_1",
  "aleatorizarOpciones": true
}
```

### 1.2 Extensiones en la hoja `Configuracion`
* `secciones`: Matriz de secciones `[{ "id": "sec_1", "titulo": "Parte I: Diagnóstico", "descripcion": "..." }]`.
* `temporizadorMinutos`: Límite de tiempo por intento (`0` = sin límite).
* `barajarPreguntas`: Booleano para aleatorizar el orden de entrega al alumno.
* `modoPaginado`: Booleano para habilitar vista por pasos con barra de progreso.

---

## 2. Desglose de Fases de Desarrollo

### Fase 1: Enriquecimiento Visual y Multimedia (Imágenes en Enunciados)
* **Objetivo:** Permitir que los reactivos contengan imágenes, esquemas o diagramas técnicos indispensables para Ciencias, Matemáticas y Tecnología.
* **Componentes a modificar:**
  1. *Constructor (UI):* Botón `📷 Adjuntar recurso visual` en la cabecera de cada tarjeta de pregunta. Selector para pegar URL pública o subir archivo a Google Drive mediante Apps Script.
  2. *Renderizador de Estudiante:* Contenedor responsivo `figure.reactivo-media` con soporte de visualización ampliada (modal lightbox) para no perder legibilidad en dispositivos móviles.
* **Entregables:** Módulo de subida de imagen a la carpeta del proyecto en Drive y render dinámico en el formulario del alumno.

### Fase 2: Tipo de Reactivo "Carga de Archivo" (Evidencias de Trabajo)
* **Objetivo:** Permitir a los alumnos adjuntar fotos de sus libretas, esquemas manuales o reportes PDF dentro del mismo cuestionario.
* **Componentes a modificar:**
  1. *Backend (`03_API_Formularios.gs`):* Endpoint `subirEvidenciaFormulario(matricula, idPregunta, base64Data, nombreArchivo)` que crea una subcarpeta en Drive (`/ST90_EVIDENCIAS/{Grado}_{Grupo}/{IdFormulario}`) y devuelve el enlace público seguro.
  2. *Constructor (UI):* Tipo de dato `archivo` en el selector de tipo de pregunta, con filtros de extensión (`.pdf`, `.png/.jpg`, `.docx`) y tamaño máximo.
  3. *Hoja de Respuestas:* Almacena el enlace clickable de Drive en la celda correspondiente para consulta inmediata del docente.
* **Entregables:** Endpoint de recepción asíncrona en trozos (chunks/base64) y visor de enlaces en la bandeja de revisión.

### Fase 3: Paginación y Secciones Estructuradas
* **Objetivo:** Dividir cuestionarios extensos en momentos pedagógicos (ej. *Sección 1: Saberes previos*, *Sección 2: Aplicación práctica*) sin recargar la página.
* **Componentes a modificar:**
  1. *Constructor (UI):* Bloque divisor `+ Nueva Sección` que agrupa las preguntas subsiguientes bajo un nuevo encabezado.
  2. *Renderizador de Estudiante:* Mecanismo tipo wizard con botones `Anterior` y `Siguiente`, validación de campos obligatorios antes de avanzar y barra de progreso porcentual (`div.barra-progreso-nem`).
* **Entregables:** Controlador de paginación por estados locales sin pérdida de datos en caso de navegación hacia atrás.

### Fase 4: Retroalimentación Diferenciada y Aleatorización
* **Objetivo:** Reforzar el enfoque formativo de la NEM ofreciendo una explicación pedagógica distinta ante el acierto o el error, y mitigar el plagio entre pares mediante reactivos barajados.
* **Componentes a modificar:**
  1. *Constructor (UI):* En el panel de ajustes de quiz, desdoblar el campo de retroalimentación en dos pestañas: *Respuesta Correcta (Refuerzo)* y *Respuesta Incorrecta (Orientación / DUA)*.
  2. *Algoritmo de Aleatorización:* Algoritmo Fisher-Yates ejecutado en el renderizador del estudiante si `barajarPreguntas == true` o `aleatorizarOpciones == true`, preservando los identificadores `id` originales para la calificación en backend.
* **Entregables:** Motor de calificación con emisión de desglose discriminado por tipo de respuesta.

### Fase 5: Temporizador de Sesión / Examen
* **Objetivo:** Establecer límites temporales para exámenes trimestrales o pruebas de velocidad diagnóstica.
* **Componentes a modificar:**
  1. *Constructor (UI):* Selector numérico en configuración: `Límite de tiempo (minutos)`.
  2. *Renderizador de Estudiante:* Cabecera flotante fija con reloj regresivo interactivo. Alerta visual a los 5 minutos restantes.
  3. *Envío Forzado:* Disparo automático del evento de envío al expirar el cronómetro, bloqueando modificaciones posteriores y guardando las respuestas alcanzadas.
* **Entregables:** Timer con tolerancia a recarga accidental de página (almacenando la marca de tiempo de inicio en `sessionStorage`).

---

## 3. Matriz de Priorización y Cronograma Estimado

| Módulo / Función | Complejidad Técnica | Impacto Pedagógico | Orden de Despliegue |
| :--- | :---: | :---: | :---: |
| **Imágenes en Preguntas** | Media | Alto (Inclusión y Ciencias) | Sprint 1 |
| **Retroalimentación Diferenciada** | Baja | Alto (Evaluación Formativa) | Sprint 1 |
| **Carga de Archivos a Drive** | Media-Alta | Crítico (Evidencias de Clase) | Sprint 2 |
| **Secciones y Paginación** | Media | Medio-Alto (UX Estudiante) | Sprint 2 |
| **Temporizador y Envío Forzado** | Media | Alto (Exámenes Formales) | Sprint 3 |
| **Aleatorización de Reactivos** | Baja | Medio (Control de Evaluación) | Sprint 3 |

---

## 4. Criterios de Aceptación y Pruebas

1. **Persistencia Transparente:** La carga de nuevos parámetros en el campo `extra` no debe romper lecturas de encuestas históricas ya existentes.
2. **Resiliencia en Red Móvil:** Si un alumno pierde conexión momentánea mientras adjunta una imagen o responde una sección, las respuestas previas deben permanecer intactas en el cliente.
3. **Calificación Automatizada:** Los reactivos de opción múltiple, única y escala deben registrarse en la hoja `Respuestas` en menos de 2 segundos, calculando la nota de 5 a 10 de manera infalible.