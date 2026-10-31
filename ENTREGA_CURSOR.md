# BUZÓN DE TRABAJO Y ENTREGA: CURSOR (FRONTEND JS & DOM)
# SUITE ESCOLAR ST90 — PLAN DE ACREDITACIÓN Y MEJORA CONTINUA (FASE LMS NEM)

| Parámetro | Detalle |
| :--- | :--- |
| **Agente asignado** | Cursor (Ingeniero Frontend JS & Manipulación del DOM) |
| **Rol en el proyecto** | Interacción del cliente, eventos, lógica UI, llamadas asíncronas a `google.script.run`. |
| **Archivos autorizados de trabajo** | `AdminPlanJS_*.html`, `ClaseJS_*.html`, `AdminJS_*.html`, `AyudaJS.html`, `ComunJS.html` |
| **Archivos prohibidos** | Backend `*.gs`, archivos CSS exclusivos de DeepSeek, `git`, `clasp`. |
| **Fecha de emisión de partitura** | 2026-10-31 |
| **Estado actual** | 🟡 **PROPUESTA JS ENTREGADA (2026-10-31) — PENDIENTE DE AUDITORÍA DE ANTIGRAVITY** |

---

## 🎯 OBJETIVOS DE LÓGICA FRONTEND ASIGNADOS A CURSOR

Debes programar la lógica JavaScript, eventos y controladores del DOM para los siguientes 4 módulos del **Plan de Acreditación Suite Escolar ST90**:

---

### MÓDULO 1: Sistema de Ayuda Contextual y Asistente IA (Chat Drawer)

1. **Función Global `abrirAyudaPedagogica(titulo, proposito, comoLlenar, ejemplo)` (o polimorfismo en `abrirAyuda`):**
   - *Nota crítica de arquitectura:* `abrirAyuda(clave)` ya existe en `ComunJS.html` para la cinta Ribbon de la Suite. Si implementas `abrirAyuda`, debe ser polimórfica:
     ```javascript
     function abrirAyudaPedagogica(titulo, proposito, comoLlenar, ejemplo) {
       // Inyecta en #modalAyudaNEM
     }
     // O polimórfico:
     if (typeof window.abrirAyudaPedagogica !== 'function') {
       window.abrirAyudaPedagogica = function(titulo, proposito, comoLlenar, ejemplo) { ... };
     }
     ```
   - Inserta de forma reactiva los textos recibidos en `#modalAyudaNEM` (`#modalAyudaTitulo`, `#modalAyudaProposito`, `#modalAyudaComoLlenar`, `#modalAyudaEjemplo`) y abre el diálogo con foco accesible.
2. **Diccionario de Ayuda Pedagógica NEM (80%+ de Inputs):**
   - Construye un catálogo JS `DICCIONARIO_AYUDA_NEM` indexado por clave de campo:
     - `problemaComunitario`: ¿Por qué está aquí? Conexión con la realidad social (Inclusión y Pensamiento Crítico). ¿Cómo se llena? Describir situación real escolar/comunitaria. Ejemplo: "El grupo de 2° A presenta altos niveles de estrés y ansiedad durante los exámenes...".
     - `contenidoSintetico`: ¿Por qué está aquí? Aprendizajes oficiales Fase 6. ¿Cómo se llena? Seleccionar de catálogo curricular. Ejemplo: "Uso de herramientas de IA para la creación de presentaciones efectivas".
     - `pda`: Procesos de Desarrollo de Aprendizaje graduales.
     - `proposito`: Meta formativa del proyecto y producto final tangible.
     - `ajustesRazonables`: Estrategias DUA y atención a barreras de aprendizaje UDEI.
     - `metodologia`: Elección sociocrítica (ABPC, STEAM, ABP, AS).
   - Delegación global de evento `click` sobre `.btn-ayuda-nem`:
     ```javascript
     document.addEventListener('click', function(e) {
       const btn = e.target.closest('.btn-ayuda-nem');
       if (!btn) return;
       const campo = btn.getAttribute('data-ayuda-campo');
       const datos = DICCIONARIO_AYUDA_NEM[campo];
       if (datos) abrirAyuda(datos.titulo, datos.proposito, datos.comoLlenar, datos.ejemplo);
     });
     ```
3. **Controlador del Drawer del Asistente IA (`#drawerAsistenteIA`):**
   - Botón flotante `#btnAsistenteFlotanteIA`: Conmuta apertura/cierre del drawer.
   - **Contexto automático en tiempo real:** Detecta el campo o paso en el que el docente está situado (`contextoSeccionActiva`), actualizando el chip visual `#chipContextoAsistente` (ej. "📍 Problemática Comunitaria" o "📍 Tecnología 3°").
   - **Interacción y Streaming/Fetch:** Al enviar una pregunta, invoca `gsRun('consultarAsistenteIAPaso', token, contextoSeccionActiva, preguntaDocente)` y renderiza la respuesta de DeepSeek en burbujas con feedback de carga (`⏳ Asistente pensando...`).
   - Sugerencias rápidas clicables: "💡 Dame 3 ideas para mi grado", "🎯 Ajustar a contexto CECSE", "✨ Redactar ejemplo viable".

---

### MÓDULO 2: Biblioteca de Recursos y Libros de Texto SEP (Frontend)

1. **Carga y Renderizado:**
   - Función `cargarBibliotecaRecursos_(filtros)` que invoque `gsRun('listarRecursosBiblioteca', filtros)` y dibuje las tarjetas en `#contenedorRecursosBiblioteca`.
2. **Filtros Reactivos:**
   - Búsqueda en vivo por texto en `#buscarRecursoBiblioteca`.
   - Filtros desplegables `#filtroAsignaturaRecurso`, `#filtroGradoRecurso`, `#filtroTrimestreRecurso`.
3. **Libros Oficiales SEP (Fase 6):**
   - Renderiza la cuadrícula de libros oficiales SEP (Lenguajes, Saberes y Pensamiento Científico, Ética, De lo Humano y lo Comunitario) con enlaces directos a sus visores autorizados.
4. **Formulario de Subida:**
   - Modal `#modalSubirRecurso`: Validación de campos (Título, Tipo, Asignatura, Grado, Trimestre, URL de Drive/Enlace) e invocación a `gsRun('subirRecursoBiblioteca', datos)`.

---

### MÓDULO 3: Adecuación Reactiva para Tecnología (CECSE)

1. **Reacción del Formulario de Planeación:**
   - Cuando el usuario elija la asignatura **Tecnología**:
     - Mostrar automáticamente la insignia `#badgeCECSE` indicando "Distribución CECSE: 2h Teoría / 6h Práctica".
     - Según el grado seleccionado (1°, 2° o 3°), precargar o sugerir el enfoque pedagógico establecido:
       - 1°: Procesadores de texto (Word) y ofimática básica.
       - 2°: Hojas de cálculo (Excel) y análisis de datos.
       - 3°: Presentaciones (PowerPoint) e Inteligencia Artificial aplicada.

---

### MÓDULO 4: Constructor de Clases (Vista Previa & Bloque Iframe)

1. **Vista Previa del Alumno (`abrirVistaPreviaAlumno_`):**
   - Abre `#modalPreviewAlumno` y simula el renderizado de los bloques didácticos (Lectura guiada, Pregunta formativa, Reto práctico, Video, Quiz) exactamente como los visualiza el alumno en `Clase.html`.
2. **Nuevo Bloque de Contenido Externo (HTML / Iframe):**
   - Función `insertarBloqueIframe_(urlIframe, titulo)` con validación de protocolo seguro (`https://`) para plataformas educativas (Genially, H5P, Canva, Google Slides).

---

## 📋 REGLAS DE ENTREGA PARA CURSOR

1. Escribe tu código modularizado y funciones de control directamente en este archivo (`ENTREGA_CURSOR.md`) debajo de esta partitura.
2. Respeta estrictamente los IDs del DOM acordados con DeepSeek y Antigravity.
3. No modifiques funciones de backend `.gs` ni ejecutes comandos `git` o `clasp`.
4. Comprueba tu sintaxis y garantiza que no haya llamadas a variables no definidas.
5. Una vez guardado tu código aquí, notifica a Antigravity para que proceda a la auditoría técnica e integración.

---

## Decisión cerrada (no reabrir)

`abrirAyuda(clave)` en `ComunJS.html` abre la ayuda de la cinta (`AYUDAS_ST90`) con un solo argumento. Esta entrega **no la sustituye ni la hace polimórfica**: cuatro argumentos la romperían. La ayuda de campos usa `abrirAyudaPedagogica`. El clic de `.btn-ayuda-nem` llama a esa función.

El estado visible/oculto usa la clase ya existente `.oculto`. Las burbujas usan `.msg-docente` y `.msg-ia`. Las tarjetas de biblioteca usan `.card-recurso`. La insignia usa `.badge-cecse`. El embebido usa `.bloque-iframe-container`. La vista previa del alumno usa las variantes de `Clase.html`: `.idevice-card-audio`, `.idevice-card-pregunta`, `.idevice-card-reto`.

`const CATALOGO_LIBROS_SEP_FASE6_` vive en otro `<script>` y no se ve desde aquí. Antigravity agrega, debajo de ese catálogo en `AdminPlanJS_06.html`, esta línea y nada más:

```javascript
window.CATALOGO_LIBROS_SEP_FASE6_ = CATALOGO_LIBROS_SEP_FASE6_;
```

Hasta esa línea, la cuadrícula muestra los cuatro campos con el visor oficial `https://libros.conaliteg.gob.mx/`, sin fichas inventadas.

### Inclusión (la aplica Antigravity, no Cursor)

En `Admin.html`, después de `AdminPlanJS_Arranque`:

```html
<?!= include('AyudaJS') ?>
```

El archivo `AyudaJS.html` es el bloque `<script>` de abajo, copiado tal cual. No va dentro de otro script.

### Firmas que el backend debe cumplir

- `consultarAsistenteIAPaso(token, contextoSeccionActiva, pregunta)` → texto, o `{ ok, texto|respuesta|mensaje }`.
- `listarRecursosBiblioteca(token, filtros)` → arreglo, o `{ recursos|filas|items }`. `filtros` = `{ texto, asignatura, grado, trimestre }`.
- `subirRecursoBiblioteca(token, datos)` → `{ ok, mensaje }`. `datos` = `{ titulo, tipo, asignatura, grado, trimestre, url }`.

El token sale de `getTokenPlan_()`, igual que el resto de planeación.

### API pública para botones que aún no existen

- `abrirVistaBibliotecaDocente_()`
- `abrirModalSubirRecurso_()` — también responde a `[data-accion="abrir-subir-recurso"]`
- `abrirVistaPreviaAlumno_()` — también el clic de `#btnPreviewAlumno`
- `insertarBloqueIframe_(url, titulo)` — si `url` viene vacía, pide título y enlace
- `aplicarAdecuacionCECSE_()`

Verificación de esta entrega: el runtime no se modificó. No hay pantalla que recorrer hasta que Antigravity integre `AyudaJS.html`. La sintaxis de este script se comprobó con `node --check`.

---

## Código propuesto — `AyudaJS.html`

```html
<script>
/* AyudaJS — LMS AechitexOS.
   Ayuda pedagógica, drawer del asistente, biblioteca, CECSE, vista previa e iframe.
   Cargar después de AdminPlanJS_Arranque. No reemplaza abrirAyuda(clave). */
/* ENTREGA-AYUDAJS-INICIO */

var contextoSeccionActiva = 'Metadatos y ejes';
var enviandoAsistente_ = false;
var seqBiblioteca_ = 0;
var temporizadorBiblioteca_ = 0;
var ultimoDisparadorAyuda_ = null;
var lmsAechitexosListo_ = false;
var PORTAL_LIBROS_SEP_ = 'https://libros.conaliteg.gob.mx/';
var MARCA_IFRAME_PREFIJO_ = '#### Contenido externo: ';
var MARCA_IDEVICES_INI_AYUDA_ = '--- iDevices de la sesión ---';
var MARCA_IDEVICES_FIN_AYUDA_ = '--- fin iDevices ---';

var ENFOQUE_CECSE_ = {
  '1': '1°: Procesadores de texto (Word) y ofimática básica.',
  '2': '2°: Hojas de cálculo (Excel) y análisis de datos.',
  '3': '3°: Presentaciones (PowerPoint) e Inteligencia Artificial aplicada.'
};

var CONTEXTO_POR_PASO_ = {
  1: 'Metadatos y ejes',
  2: 'Contenidos y PDA',
  3: 'Problemática comunitaria',
  4: 'Propósito y producto'
};

var CONTEXTO_POR_CAMPO_ = {
  planTitulo: 'Título del proyecto',
  planCampoFormativo: 'Campo formativo',
  planMetodologia: 'Metodología',
  planNumSesiones: 'Sesiones de 40 minutos',
  planGrado: 'Grado',
  planGrupo: 'Grupo',
  planAsignatura: 'Asignatura',
  planFechaInicio: 'Fecha de inicio',
  planPeriodo: 'Periodo',
  planContenidoSintetico: 'Contenido sintético',
  planPDA: 'PDA',
  planProblema: 'Problemática comunitaria',
  planAjustesRazonables: 'Ajustes razonables',
  planProposito: 'Propósito y producto',
  sesApertura: 'Apertura de la sesión',
  sesDesarrollo: 'Desarrollo de la sesión',
  sesActividad: 'Actividad de la sesión',
  sesCierre: 'Cierre de la sesión'
};

var CAMPOS_SEP_ = [
  'Lenguajes',
  'Saberes y Pensamiento Científico',
  'Ética, Naturaleza y Sociedades',
  'De lo Humano y lo Comunitario'
];

var SUGERENCIAS_ASISTENTE_ = [
  '💡 Dame 3 ideas para mi grado',
  '🎯 Ajustar a contexto CECSE',
  '✨ Redactar ejemplo viable'
];

var DICCIONARIO_AYUDA_NEM = {
  problemaComunitario: {
    titulo: 'Problemática comunitaria',
    proposito: 'Conecta el proyecto con la realidad social del grupo: inclusión y pensamiento crítico.',
    comoLlenar: 'Describe una situación real de la escuela o de la comunidad, observable y abordable en el trimestre.',
    ejemplo: 'El grupo de 2° A presenta altos niveles de estrés y ansiedad durante los exámenes de periodo.'
  },
  contenidoSintetico: {
    titulo: 'Contenido sintético',
    proposito: 'Ancla el proyecto en los aprendizajes oficiales de la Fase 6.',
    comoLlenar: 'Elige un contenido del catálogo curricular o redacta el contenido sintético de la SEP.',
    ejemplo: 'Uso de herramientas de IA para la creación de presentaciones efectivas.'
  },
  pda: {
    titulo: 'Procesos de desarrollo de aprendizaje',
    proposito: 'Precisa los PDA que el proyecto hace avanzar de forma gradual.',
    comoLlenar: 'Marca los PDA del catálogo o adapta su redacción al grupo, sin copiar el programa completo.',
    ejemplo: 'Compara fuentes y argumenta una postura sobre un problema de la comunidad, con evidencias.'
  },
  proposito: {
    titulo: 'Propósito y producto',
    proposito: 'Declara la meta formativa del proyecto y el producto final tangible.',
    comoLlenar: 'Redacta qué aprenderán, para qué lo aprenderán y cuál será la evidencia integradora.',
    ejemplo: 'El grupo producirá un periódico mural con propuestas de bienestar para el recreo.'
  },
  ajustesRazonables: {
    titulo: 'Ajustes razonables',
    proposito: 'Anticipa barreras de aprendizaje y las estrategias DUA y de atención UDEI.',
    comoLlenar: 'Describe apoyos de acceso, tiempo, material y participación, sin etiquetar a un alumno.',
    ejemplo: 'Lectura en voz alta, macrotipo, tiempo extra y opción de respuesta oral o visual.'
  },
  metodologia: {
    titulo: 'Metodología sociocrítica',
    proposito: 'Elige la metodología que organiza la experiencia de aprendizaje.',
    comoLlenar: 'Selecciona ABPC, indagación STEAM, ABP o Aprendizaje Servicio según el campo y el problema.',
    ejemplo: 'Aprendizaje Basado en Problemas (ABP), con indagación en el aula y una acción en la comunidad.'
  },
  titulo: {
    titulo: 'Título del proyecto',
    proposito: 'Nombra la experiencia para que el grupo reconozca de qué trata y para quién es.',
    comoLlenar: 'Usa una frase concreta, ligada al producto o a la comunidad. Evita títulos genéricos de unidad.',
    ejemplo: 'Voces y raíces de nuestra tierra: narrativas comunitarias.'
  },
  campoFormativo: {
    titulo: 'Campo formativo',
    proposito: 'Sitúa el proyecto en uno de los campos de la Fase 6.',
    comoLlenar: 'Elige el campo que sostiene la mayor parte de los PDA, aunque el proyecto dialogue con otros.',
    ejemplo: 'Lenguajes, cuando el producto central es un texto, un podcast o una puesta en escena.'
  },
  sesiones: {
    titulo: 'Número de sesiones',
    proposito: 'Reparte el proyecto en sesiones de 40 minutos, con inicio, desarrollo y cierre.',
    comoLlenar: 'Indica cuántas sesiones de 40 minutos necesita el producto, entre 1 y 25.',
    ejemplo: '3 sesiones: diagnóstico, producción y socialización del producto.'
  },
  grado: {
    titulo: 'Grado',
    proposito: 'Ajusta lenguaje, PDA y, en Tecnología, el enfoque CECSE del grado.',
    comoLlenar: 'Selecciona 1, 2 o 3. En Tecnología cambia el software sugerido.',
    ejemplo: '2° cuando el aula CECSE trabaja hojas de cálculo.'
  },
  grupo: {
    titulo: 'Grupo',
    proposito: 'Amarra la planeación al grupo real y a sus barreras observadas.',
    comoLlenar: 'Elige la letra del grupo. Si el proyecto es de academia, conserva el grupo de referencia.',
    ejemplo: 'A'
  },
  asignatura: {
    titulo: 'Asignatura',
    proposito: 'Identifica la disciplina o el taller. En Tecnología activa la distribución CECSE.',
    comoLlenar: 'Escribe el nombre tal como aparece en el horario. Si es Tecnología, la insignia CECSE se muestra sola.',
    ejemplo: 'Tecnología'
  },
  fechaInicio: {
    titulo: 'Fecha de inicio',
    proposito: 'Fija el arranque del proyecto dentro del trimestre.',
    comoLlenar: 'Elige el día de la primera sesión. El periodo puede calcularse a partir de esta fecha.',
    ejemplo: '2026-11-03'
  },
  periodo: {
    titulo: 'Periodo',
    proposito: 'Ubica el proyecto en el tramo del ciclo en que se desarrollará.',
    comoLlenar: 'Anota el trimestre o el rango de semanas que cubre la secuencia.',
    ejemplo: 'Trimestre 1 · semanas 6 a 8'
  },
  apertura: {
    titulo: 'Apertura de la sesión',
    proposito: 'Activa saberes previos y presenta la meta de los 40 minutos.',
    comoLlenar: 'Escribe la pregunta, el reto breve o el acuerdo con el que inicia la sesión.',
    ejemplo: '¿Qué pasaría en el recreo si nadie registrara lo que nos incomoda?'
  },
  desarrollo: {
    titulo: 'Desarrollo de la sesión',
    proposito: 'Organiza la tarea central, los iDevices y la participación de todo el grupo.',
    comoLlenar: 'Describe la actividad, los materiales y cómo se distribuye el tiempo.',
    ejemplo: 'En equipos, leen dos testimonios y arman una viñeta para el periódico mural.'
  },
  actividad: {
    titulo: 'Actividad de la sesión',
    proposito: 'Precisa la evidencia que el alumno produce durante la sesión.',
    comoLlenar: 'Indica el producto parcial y el criterio con el que se revisa en el momento.',
    ejemplo: 'Cada equipo entrega una viñeta con problema, causa y propuesta.'
  },
  cierre: {
    titulo: 'Cierre de la sesión',
    proposito: 'Recoge lo aprendido y deja el puente hacia la siguiente sesión.',
    comoLlenar: 'Escribe la pregunta de salida o la evidencia breve de cierre.',
    ejemplo: 'En una frase, ¿qué propuesta sí podemos probar esta semana?'
  }
};

DICCIONARIO_AYUDA_NEM.planProblema = DICCIONARIO_AYUDA_NEM.problemaComunitario;
DICCIONARIO_AYUDA_NEM.planContenidoSintetico = DICCIONARIO_AYUDA_NEM.contenidoSintetico;
DICCIONARIO_AYUDA_NEM.contenido = DICCIONARIO_AYUDA_NEM.contenidoSintetico;
DICCIONARIO_AYUDA_NEM.planPDA = DICCIONARIO_AYUDA_NEM.pda;
DICCIONARIO_AYUDA_NEM.planProposito = DICCIONARIO_AYUDA_NEM.proposito;
DICCIONARIO_AYUDA_NEM.planAjustesRazonables = DICCIONARIO_AYUDA_NEM.ajustesRazonables;
DICCIONARIO_AYUDA_NEM.ajustes = DICCIONARIO_AYUDA_NEM.ajustesRazonables;
DICCIONARIO_AYUDA_NEM.planMetodologia = DICCIONARIO_AYUDA_NEM.metodologia;
DICCIONARIO_AYUDA_NEM.planTitulo = DICCIONARIO_AYUDA_NEM.titulo;
DICCIONARIO_AYUDA_NEM.planCampoFormativo = DICCIONARIO_AYUDA_NEM.campoFormativo;
DICCIONARIO_AYUDA_NEM.planNumSesiones = DICCIONARIO_AYUDA_NEM.sesiones;
DICCIONARIO_AYUDA_NEM.planGrado = DICCIONARIO_AYUDA_NEM.grado;
DICCIONARIO_AYUDA_NEM.planGrupo = DICCIONARIO_AYUDA_NEM.grupo;
DICCIONARIO_AYUDA_NEM.planAsignatura = DICCIONARIO_AYUDA_NEM.asignatura;
DICCIONARIO_AYUDA_NEM.planFechaInicio = DICCIONARIO_AYUDA_NEM.fechaInicio;
DICCIONARIO_AYUDA_NEM.planPeriodo = DICCIONARIO_AYUDA_NEM.periodo;
DICCIONARIO_AYUDA_NEM.sesApertura = DICCIONARIO_AYUDA_NEM.apertura;
DICCIONARIO_AYUDA_NEM.planApertura = DICCIONARIO_AYUDA_NEM.apertura;
DICCIONARIO_AYUDA_NEM.sesDesarrollo = DICCIONARIO_AYUDA_NEM.desarrollo;
DICCIONARIO_AYUDA_NEM.planDesarrollo = DICCIONARIO_AYUDA_NEM.desarrollo;
DICCIONARIO_AYUDA_NEM.sesActividad = DICCIONARIO_AYUDA_NEM.actividad;
DICCIONARIO_AYUDA_NEM.planActividad = DICCIONARIO_AYUDA_NEM.actividad;
DICCIONARIO_AYUDA_NEM.sesCierre = DICCIONARIO_AYUDA_NEM.cierre;
DICCIONARIO_AYUDA_NEM.planCierre = DICCIONARIO_AYUDA_NEM.cierre;

function nodo_(id) {
  return document.getElementById(id);
}

function avisar_(mensaje, tipo) {
  if (typeof toast === 'function') toast(mensaje, tipo || 'info');
}

function vaciarNodo_(el) {
  if (!el) return;
  while (el.firstChild) el.removeChild(el.firstChild);
}

function crearSiFalta_(id, tag, padre, oculto) {
  var el = document.getElementById(id);
  if (el) return el;
  el = document.createElement(tag || 'div');
  el.id = id;
  if (oculto) el.className = 'oculto';
  (padre || document.body).appendChild(el);
  return el;
}

function ocultarOverlay_(id) {
  var el = nodo_(id);
  if (!el) return;
  el.classList.add('oculto');
  el.setAttribute('aria-hidden', 'true');
}

function mostrarOverlay_(id) {
  var el = nodo_(id);
  if (!el) return null;
  el.classList.remove('oculto');
  el.setAttribute('aria-hidden', 'false');
  return el;
}

function tokenLms_() {
  var tk = '';
  if (typeof getTokenPlan_ === 'function') {
    try { tk = getTokenPlan_() || ''; } catch (e) { tk = ''; }
  }
  if (!tk && typeof tokenClase !== 'undefined') tk = tokenClase || '';
  if (!tk && typeof token !== 'undefined') tk = token || '';
  return tk || '';
}

function pasoPlanVisible_() {
  if (typeof etapaPlanActual_ === 'number' && etapaPlanActual_ >= 1 && etapaPlanActual_ <= 4) {
    return etapaPlanActual_;
  }
  var i;
  for (i = 1; i <= 4; i++) {
    var pane = nodo_('etapaPlanNEM_' + i);
    if (pane && !pane.classList.contains('oculto')) return i;
  }
  return 1;
}

function esTecnologia_() {
  var el = nodo_('planAsignatura');
  return /tecnolog/i.test(el ? String(el.value || '') : '');
}

function gradoPlan_() {
  var el = nodo_('planGrado');
  var g = String((el && el.value) || '1');
  if (g !== '1' && g !== '2' && g !== '3') g = '1';
  return g;
}

function etiquetaTecnologia_() {
  return 'Tecnología ' + gradoPlan_() + '°';
}

function urlHttps_(raw) {
  var t = String(raw || '').trim();
  if (!/^https:\/\//i.test(t)) return '';
  if (/[\s<>"']/.test(t)) return '';
  if (t.length > 2000) return '';
  try {
    var u = new URL(t);
    if (u.protocol !== 'https:') return '';
    if (u.username || u.password) return '';
    return u.href;
  } catch (e) {
    return '';
  }
}

function hostEs_(host, raiz) {
  host = String(host || '').toLowerCase();
  raiz = String(raiz || '').toLowerCase();
  return host === raiz || host.endsWith('.' + raiz);
}

function urlIframePermitida_(raw) {
  var href = urlHttps_(raw);
  if (!href) return '';
  var u = new URL(href);
  var h = u.hostname.toLowerCase();
  var genial = hostEs_(h, 'genial.ly') || hostEs_(h, 'genially.com');
  var h5p = hostEs_(h, 'h5p.com') || hostEs_(h, 'h5p.org');
  var canva = hostEs_(h, 'canva.com');
  var slides = h === 'docs.google.com' && u.pathname.indexOf('/presentation/') >= 0;
  if (!(genial || h5p || canva || slides)) return '';
  return u.href;
}

function textoRespuestaIA_(r) {
  if (r == null) return '';
  if (typeof r === 'string') return r.trim();
  return String(r.texto || r.respuesta || r.mensaje || '').trim();
}

function filasRecursos_(r) {
  if (Array.isArray(r)) return r;
  if (!r || typeof r !== 'object') return [];
  if (Array.isArray(r.recursos)) return r.recursos;
  if (Array.isArray(r.filas)) return r.filas;
  if (Array.isArray(r.items)) return r.items;
  return [];
}

function entradaAyuda_(clave) {
  var k = String(clave || '').trim();
  if (!k || !DICCIONARIO_AYUDA_NEM[k]) return null;
  return DICCIONARIO_AYUDA_NEM[k];
}

function asegurarModalAyuda_() {
  var modal = crearSiFalta_('modalAyudaNEM', 'div', document.body, true);
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'modalAyudaTitulo');
  crearSiFalta_('modalAyudaTitulo', 'h2', modal, false);
  crearSiFalta_('modalAyudaProposito', 'div', modal, false);
  crearSiFalta_('modalAyudaComoLlenar', 'div', modal, false);
  crearSiFalta_('modalAyudaEjemplo', 'div', modal, false);
  if (!modal.querySelector('[data-cerrar-ayuda-nem]')) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-cerrar-ayuda-nem', '1');
    btn.textContent = 'Entendido';
    modal.appendChild(btn);
  }
  return modal;
}

function abrirAyudaPedagogica(titulo, proposito, comoLlenar, ejemplo) {
  if (titulo && typeof titulo === 'object') {
    ejemplo = titulo.ejemplo;
    comoLlenar = titulo.comoLlenar;
    proposito = titulo.proposito;
    titulo = titulo.titulo;
  }
  var modal = asegurarModalAyuda_();
  var h = nodo_('modalAyudaTitulo');
  var p = nodo_('modalAyudaProposito');
  var c = nodo_('modalAyudaComoLlenar');
  var e = nodo_('modalAyudaEjemplo');
  if (h) h.textContent = String(titulo || 'Ayuda');
  if (p) p.textContent = String(proposito || '');
  if (c) c.textContent = String(comoLlenar || '');
  if (e) e.textContent = String(ejemplo || '');
  mostrarOverlay_('modalAyudaNEM');
  if (h) {
    h.setAttribute('tabindex', '-1');
    try { h.focus(); } catch (err) {}
  }
  return modal;
}

function cerrarAyudaPedagogica_() {
  ocultarOverlay_('modalAyudaNEM');
  if (ultimoDisparadorAyuda_ && ultimoDisparadorAyuda_.focus) {
    try { ultimoDisparadorAyuda_.focus(); } catch (err) {}
  }
  ultimoDisparadorAyuda_ = null;
}

function pintarChipContexto_() {
  var chip = nodo_('chipContextoAsistente');
  if (!chip) return;
  chip.textContent = '📍 ' + (contextoSeccionActiva || 'Planeación NEM');
}

function actualizarContextoAsistenteIA_() {
  if (esTecnologia_() && pasoPlanVisible_() === 1) contextoSeccionActiva = etiquetaTecnologia_();
  else contextoSeccionActiva = CONTEXTO_POR_PASO_[pasoPlanVisible_()] || 'Planeación NEM';
  pintarChipContexto_();
}

function sincronizarContextoDesdeFoco_(id) {
  if (!id || !CONTEXTO_POR_CAMPO_[id]) return;
  if ((id === 'planAsignatura' || id === 'planGrado') && esTecnologia_()) {
    contextoSeccionActiva = etiquetaTecnologia_();
  } else {
    contextoSeccionActiva = CONTEXTO_POR_CAMPO_[id];
  }
  pintarChipContexto_();
}

function pintarBurbuja_(clase, texto) {
  var caja = nodo_('chatAsistenteCuerpo');
  if (!caja) return null;
  var p = document.createElement('p');
  p.className = clase;
  p.textContent = texto;
  caja.appendChild(p);
  caja.scrollTop = caja.scrollHeight;
  return p;
}

function asegurarDrawerAsistente_() {
  var btn = crearSiFalta_('btnAsistenteFlotanteIA', 'button', document.body, false);
  btn.type = 'button';
  btn.setAttribute('aria-controls', 'drawerAsistenteIA');
  if (!btn.getAttribute('aria-label')) btn.setAttribute('aria-label', 'Abrir asistente de planeación');
  if (!btn.textContent) btn.textContent = '🤖';
  if (!btn.getAttribute('aria-expanded')) btn.setAttribute('aria-expanded', 'false');

  var drawer = crearSiFalta_('drawerAsistenteIA', 'aside', document.body, true);
  drawer.setAttribute('aria-label', 'Asistente de planeación');
  crearSiFalta_('chipContextoAsistente', 'p', drawer, false);
  var cuerpo = crearSiFalta_('chatAsistenteCuerpo', 'div', drawer, false);
  var campo = crearSiFalta_('txtMensajeAsistente', 'textarea', drawer, false);
  var enviar = crearSiFalta_('btnEnviarAsistenteIA', 'button', drawer, false);
  cuerpo.setAttribute('aria-live', 'polite');
  if (!campo.getAttribute('aria-label')) campo.setAttribute('aria-label', 'Mensaje para el asistente');
  enviar.type = 'button';
  if (!enviar.textContent) enviar.textContent = 'Enviar';
  if (!drawer.querySelector('[data-sugerencia-ia]')) {
    var i;
    for (i = 0; i < SUGERENCIAS_ASISTENTE_.length; i++) {
      var s = document.createElement('button');
      s.type = 'button';
      s.setAttribute('data-sugerencia-ia', SUGERENCIAS_ASISTENTE_[i]);
      s.textContent = SUGERENCIAS_ASISTENTE_[i];
      if (campo.parentNode) campo.parentNode.insertBefore(s, campo);
      else drawer.appendChild(s);
    }
  }
  return drawer;
}

function conmutarDrawerAsistente_(abrir) {
  var drawer = asegurarDrawerAsistente_();
  var btn = nodo_('btnAsistenteFlotanteIA');
  var mostrar = (abrir === true) || (abrir !== false && drawer.classList.contains('oculto'));
  if (mostrar) mostrarOverlay_('drawerAsistenteIA');
  else ocultarOverlay_('drawerAsistenteIA');
  if (btn) btn.setAttribute('aria-expanded', mostrar ? 'true' : 'false');
  if (mostrar) {
    pintarChipContexto_();
    var campo = nodo_('txtMensajeAsistente');
    if (campo && campo.focus) {
      try { campo.focus(); } catch (err) {}
    }
  }
}

function enviarMensajeAsistente_(textoForzado) {
  var campo = nodo_('txtMensajeAsistente');
  var texto = String(textoForzado != null ? textoForzado : ((campo && campo.value) || '')).trim();
  if (!texto || enviandoAsistente_) return;
  var tk = tokenLms_();
  if (!tk) {
    avisar_('Inicia sesión para consultar al asistente.', 'error');
    return;
  }
  if (typeof gsRun !== 'function') {
    avisar_('google.script.run no está disponible.', 'error');
    return;
  }
  asegurarDrawerAsistente_();
  pintarBurbuja_('msg-docente', texto);
  if (campo) campo.value = '';
  enviandoAsistente_ = true;
  var btn = nodo_('btnEnviarAsistenteIA');
  if (btn) btn.disabled = true;
  var espera = pintarBurbuja_('msg-ia', '⏳ Asistente pensando...');
  gsRun('consultarAsistenteIAPaso', tk, contextoSeccionActiva, texto).then(function (r) {
    if (espera && espera.parentNode) espera.parentNode.removeChild(espera);
    if (r && r.ok === false) {
      pintarBurbuja_('msg-ia', String(r.mensaje || r.error || 'El asistente no pudo responder.'));
      return;
    }
    var resp = textoRespuestaIA_(r);
    pintarBurbuja_('msg-ia', resp || 'El asistente no devolvió texto.');
  }, function () {
    if (espera && espera.parentNode) espera.parentNode.removeChild(espera);
    pintarBurbuja_('msg-ia', 'No pude consultar al asistente. Revisa la conexión e inténtalo de nuevo.');
  }).then(function () {
    enviandoAsistente_ = false;
    if (btn) btn.disabled = false;
  });
}

function catalogoLibrosSep_() {
  if (typeof window !== 'undefined' && window.CATALOGO_LIBROS_SEP_FASE6_) {
    return window.CATALOGO_LIBROS_SEP_FASE6_;
  }
  return null;
}

function tarjetaLibroSep_(titulo, campo, grado, paginas) {
  var art = document.createElement('article');
  art.className = 'card-recurso';
  var h = document.createElement('h3');
  h.textContent = titulo || 'Libro SEP';
  var meta = document.createElement('p');
  var gtxt = grado ? (grado + '°') : '';
  meta.textContent = [campo || 'SEP Fase 6', gtxt, paginas || ''].filter(Boolean).join(' · ');
  var a = document.createElement('a');
  a.href = PORTAL_LIBROS_SEP_;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.textContent = 'Abrir visor SEP';
  art.appendChild(h);
  art.appendChild(meta);
  art.appendChild(a);
  return art;
}

function pintarGridLibrosSEP_() {
  var grid = nodo_('gridLibrosOficialesSEP');
  if (!grid) return;
  vaciarNodo_(grid);
  var grado = parseInt(gradoPlan_(), 10);
  var catalogo = catalogoLibrosSep_() || [];
  var vistos = {};
  catalogo.forEach(function (lib) {
    if (!lib) return;
    if (lib.grado && lib.grado !== grado && lib.campo !== 'Interdisciplinar') return;
    if (lib.campo) vistos[lib.campo] = true;
    grid.appendChild(tarjetaLibroSep_(lib.titulo, lib.campo, lib.grado, lib.paginasRelevantes));
  });
  CAMPOS_SEP_.forEach(function (campo) {
    if (vistos[campo]) return;
    grid.appendChild(tarjetaLibroSep_('Visor oficial SEP · ' + campo, campo, grado, ''));
  });
}

function llenarSelectSiVacio_(sel, opciones) {
  if (!sel || (sel.options && sel.options.length)) return;
  opciones.forEach(function (op) {
    var o = document.createElement('option');
    o.value = op.valor;
    o.textContent = op.texto;
    sel.appendChild(o);
  });
}

function asegurarBiblioteca_() {
  var vista = crearSiFalta_('vistaBibliotecaDocente', 'section', document.body, true);
  var bus = crearSiFalta_('buscarRecursoBiblioteca', 'input', vista, false);
  bus.type = 'search';
  if (!bus.getAttribute('aria-label')) bus.setAttribute('aria-label', 'Buscar recurso');
  var asig = crearSiFalta_('filtroAsignaturaRecurso', 'select', vista, false);
  var grado = crearSiFalta_('filtroGradoRecurso', 'select', vista, false);
  var tri = crearSiFalta_('filtroTrimestreRecurso', 'select', vista, false);
  if (!asig.getAttribute('aria-label')) asig.setAttribute('aria-label', 'Asignatura');
  if (!grado.getAttribute('aria-label')) grado.setAttribute('aria-label', 'Grado');
  if (!tri.getAttribute('aria-label')) tri.setAttribute('aria-label', 'Trimestre');
  llenarSelectSiVacio_(asig, [
    { valor: '', texto: 'Todas las asignaturas' },
    { valor: 'Lenguajes', texto: 'Lenguajes' },
    { valor: 'Saberes y Pensamiento Científico', texto: 'Saberes y Pensamiento Científico' },
    { valor: 'Ética, Naturaleza y Sociedades', texto: 'Ética, Naturaleza y Sociedades' },
    { valor: 'De lo Humano y lo Comunitario', texto: 'De lo Humano y lo Comunitario' },
    { valor: 'Tecnología', texto: 'Tecnología' }
  ]);
  llenarSelectSiVacio_(grado, [
    { valor: '', texto: 'Todos los grados' },
    { valor: '1', texto: '1°' },
    { valor: '2', texto: '2°' },
    { valor: '3', texto: '3°' }
  ]);
  llenarSelectSiVacio_(tri, [
    { valor: '', texto: 'Todos los trimestres' },
    { valor: '1', texto: '1' },
    { valor: '2', texto: '2' },
    { valor: '3', texto: '3' }
  ]);
  if (!vista.querySelector('[data-accion="abrir-subir-recurso"]')) {
    var subir = document.createElement('button');
    subir.type = 'button';
    subir.setAttribute('data-accion', 'abrir-subir-recurso');
    subir.textContent = 'Compartir recurso';
    vista.appendChild(subir);
  }
  crearSiFalta_('gridLibrosOficialesSEP', 'div', vista, false);
  crearSiFalta_('contenedorRecursosBiblioteca', 'div', vista, false);
  return vista;
}

function leerFiltrosBiblioteca_() {
  return {
    texto: String((nodo_('buscarRecursoBiblioteca') && nodo_('buscarRecursoBiblioteca').value) || '').trim(),
    asignatura: String((nodo_('filtroAsignaturaRecurso') && nodo_('filtroAsignaturaRecurso').value) || '').trim(),
    grado: String((nodo_('filtroGradoRecurso') && nodo_('filtroGradoRecurso').value) || '').trim(),
    trimestre: String((nodo_('filtroTrimestreRecurso') && nodo_('filtroTrimestreRecurso').value) || '').trim()
  };
}

function tarjetaRecurso_(item) {
  item = item || {};
  var art = document.createElement('article');
  art.className = 'card-recurso';
  var h = document.createElement('h3');
  h.textContent = item.Titulo || item.titulo || 'Recurso';
  var meta = document.createElement('p');
  meta.textContent = [
    item.Tipo || item.tipo || '',
    item.Asignatura || item.asignatura || '',
    (item.Grado || item.grado) ? ((item.Grado || item.grado) + '°') : '',
    (item.Trimestre || item.trimestre) ? ('Trimestre ' + (item.Trimestre || item.trimestre)) : '',
    item.Autor || item.autor || '',
    item.Fecha || item.fecha || ''
  ].filter(Boolean).join(' · ');
  art.appendChild(h);
  art.appendChild(meta);
  var href = urlHttps_(item.URL_Drive || item.url || item.URL || '');
  if (href) {
    var a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = 'Abrir';
    art.appendChild(a);
  }
  return art;
}

function pintarRecursosBiblioteca_(filas) {
  var caja = nodo_('contenedorRecursosBiblioteca');
  if (!caja) return;
  vaciarNodo_(caja);
  if (!filas.length) {
    var vacio = document.createElement('p');
    vacio.textContent = 'No hay recursos con esos filtros.';
    caja.appendChild(vacio);
    return;
  }
  filas.forEach(function (fila) {
    caja.appendChild(tarjetaRecurso_(fila));
  });
}

function cargarBibliotecaRecursos_(filtros) {
  asegurarBiblioteca_();
  var caja = nodo_('contenedorRecursosBiblioteca');
  var seq = ++seqBiblioteca_;
  var tk = tokenLms_();
  if (!tk) {
    if (caja) {
      vaciarNodo_(caja);
      var p = document.createElement('p');
      p.textContent = 'Inicia sesión para ver la biblioteca.';
      caja.appendChild(p);
    }
    return Promise.resolve([]);
  }
  if (typeof gsRun !== 'function') {
    avisar_('google.script.run no está disponible.', 'error');
    return Promise.resolve([]);
  }
  if (caja) {
    vaciarNodo_(caja);
    var carga = document.createElement('p');
    carga.textContent = 'Cargando recursos…';
    caja.appendChild(carga);
  }
  return gsRun('listarRecursosBiblioteca', tk, filtros || leerFiltrosBiblioteca_()).then(function (r) {
    if (seq !== seqBiblioteca_) return [];
    if (r && r.ok === false) {
      if (caja) {
        vaciarNodo_(caja);
        var err = document.createElement('p');
        err.textContent = String(r.mensaje || 'No pude cargar la biblioteca.');
        caja.appendChild(err);
      }
      return [];
    }
    var filas = filasRecursos_(r);
    pintarRecursosBiblioteca_(filas);
    return filas;
  }, function () {
    if (seq !== seqBiblioteca_) return [];
    if (caja) {
      vaciarNodo_(caja);
      var fallo = document.createElement('p');
      fallo.textContent = 'No pude cargar la biblioteca.';
      caja.appendChild(fallo);
    }
    return [];
  });
}

function programarCargaBiblioteca_() {
  clearTimeout(temporizadorBiblioteca_);
  temporizadorBiblioteca_ = setTimeout(function () {
    cargarBibliotecaRecursos_(leerFiltrosBiblioteca_());
  }, 250);
}

function abrirVistaBibliotecaDocente_() {
  asegurarBiblioteca_();
  mostrarOverlay_('vistaBibliotecaDocente');
  pintarGridLibrosSEP_();
  cargarBibliotecaRecursos_(leerFiltrosBiblioteca_());
  var bus = nodo_('buscarRecursoBiblioteca');
  if (bus && bus.focus) {
    try { bus.focus(); } catch (err) {}
  }
}

function valorFormRecurso_(form, nombre) {
  var el = form ? form.querySelector('[name="' + nombre + '"]') : null;
  return el ? String(el.value || '').trim() : '';
}

function asegurarModalSubir_() {
  var modal = crearSiFalta_('modalSubirRecurso', 'div', document.body, true);
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Compartir recurso');
  var form = crearSiFalta_('formSubirRecursoBiblioteca', 'form', modal, false);
  var campos = [
    ['titulo', 'Título', 'text'],
    ['tipo', 'Tipo', 'select'],
    ['asignatura', 'Asignatura', 'text'],
    ['grado', 'Grado', 'select'],
    ['trimestre', 'Trimestre', 'select'],
    ['url', 'URL de Drive o enlace', 'url']
  ];
  campos.forEach(function (def) {
    if (form.querySelector('[name="' + def[0] + '"]')) return;
    var label = document.createElement('label');
    label.textContent = def[1];
    var campo;
    if (def[2] === 'select') {
      campo = document.createElement('select');
    } else {
      campo = document.createElement('input');
      campo.type = def[2];
    }
    campo.name = def[0];
    campo.required = true;
    label.appendChild(campo);
    form.appendChild(label);
  });
  var tipo = form.querySelector('[name="tipo"]');
  llenarSelectSiVacio_(tipo, [
    { valor: 'PDF', texto: 'PDF' },
    { valor: 'Presentación', texto: 'Presentación' },
    { valor: 'Enlace', texto: 'Enlace' },
    { valor: 'Video', texto: 'Video' }
  ]);
  var grado = form.querySelector('[name="grado"]');
  llenarSelectSiVacio_(grado, [
    { valor: '1', texto: '1°' },
    { valor: '2', texto: '2°' },
    { valor: '3', texto: '3°' }
  ]);
  var tri = form.querySelector('[name="trimestre"]');
  llenarSelectSiVacio_(tri, [
    { valor: '1', texto: '1' },
    { valor: '2', texto: '2' },
    { valor: '3', texto: '3' }
  ]);
  if (!form.querySelector('[data-enviar-recurso]')) {
    var ok = document.createElement('button');
    ok.type = 'submit';
    ok.setAttribute('data-enviar-recurso', '1');
    ok.textContent = 'Guardar recurso';
    form.appendChild(ok);
  }
  if (!modal.querySelector('[data-cerrar-subir]')) {
    var cerrar = document.createElement('button');
    cerrar.type = 'button';
    cerrar.setAttribute('data-cerrar-subir', '1');
    cerrar.textContent = 'Cerrar';
    modal.appendChild(cerrar);
  }
  if (!form._st90Sub) {
    form._st90Sub = true;
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      enviarRecursoBiblioteca_();
    });
  }
  return modal;
}

function abrirModalSubirRecurso_() {
  asegurarModalSubir_();
  mostrarOverlay_('modalSubirRecurso');
  var form = nodo_('formSubirRecursoBiblioteca');
  var primero = form ? form.querySelector('[name="titulo"]') : null;
  if (primero && primero.focus) {
    try { primero.focus(); } catch (err) {}
  }
}

function cerrarModalSubirRecurso_() {
  ocultarOverlay_('modalSubirRecurso');
}

function enviarRecursoBiblioteca_() {
  var form = nodo_('formSubirRecursoBiblioteca');
  if (!form) return;
  var datos = {
    titulo: valorFormRecurso_(form, 'titulo'),
    tipo: valorFormRecurso_(form, 'tipo'),
    asignatura: valorFormRecurso_(form, 'asignatura'),
    grado: valorFormRecurso_(form, 'grado'),
    trimestre: valorFormRecurso_(form, 'trimestre'),
    url: valorFormRecurso_(form, 'url')
  };
  if (!datos.titulo || !datos.tipo || !datos.asignatura || !datos.grado || !datos.trimestre) {
    avisar_('Completa título, tipo, asignatura, grado y trimestre.', 'error');
    return;
  }
  if (datos.grado !== '1' && datos.grado !== '2' && datos.grado !== '3') {
    avisar_('El grado debe ser 1, 2 o 3.', 'error');
    return;
  }
  if (datos.trimestre !== '1' && datos.trimestre !== '2' && datos.trimestre !== '3') {
    avisar_('El trimestre debe ser 1, 2 o 3.', 'error');
    return;
  }
  var href = urlHttps_(datos.url);
  if (!href) {
    avisar_('La URL del recurso debe empezar con https://.', 'error');
    return;
  }
  datos.url = href;
  var tk = tokenLms_();
  if (!tk) {
    avisar_('Inicia sesión para compartir un recurso.', 'error');
    return;
  }
  if (typeof gsRun !== 'function') {
    avisar_('google.script.run no está disponible.', 'error');
    return;
  }
  gsRun('subirRecursoBiblioteca', tk, datos).then(function (r) {
    if (r && r.ok === false) {
      avisar_(String(r.mensaje || 'No se pudo guardar el recurso.'), 'error');
      return;
    }
    avisar_((r && r.mensaje) || 'Recurso compartido.', 'ok');
    form.reset();
    cerrarModalSubirRecurso_();
    cargarBibliotecaRecursos_(leerFiltrosBiblioteca_());
  }, function () {
    avisar_('No se pudo guardar el recurso.', 'error');
  });
}

function asegurarBadgeCecse_() {
  var badge = nodo_('badgeCECSE');
  if (badge) return badge;
  badge = document.createElement('p');
  badge.id = 'badgeCECSE';
  badge.className = 'badge-cecse oculto';
  var asig = nodo_('planAsignatura');
  var padre = (asig && asig.parentNode) || document.body;
  if (asig && asig.nextSibling) padre.insertBefore(badge, asig.nextSibling);
  else padre.appendChild(badge);
  return badge;
}

function aplicarAdecuacionCECSE_() {
  var badge = asegurarBadgeCecse_();
  var esTec = esTecnologia_();
  var enfoque = ENFOQUE_CECSE_[gradoPlan_()] || ENFOQUE_CECSE_['1'];
  if (badge) {
    badge.classList.toggle('oculto', !esTec);
    badge.textContent = esTec
      ? ('Distribución CECSE: 2h Teoría / 6h Práctica. ' + enfoque)
      : '';
  }
  var campo = nodo_('planContenidoSintetico');
  if (!campo || !esTec) return;
  var previo = campo.getAttribute('data-cecse-precarga') || '';
  var vacio = !String(campo.value || '').trim();
  if (vacio || campo.value === previo) {
    var sugerencia = enfoque + ' Carga horaria: 2 h de teoría y 6 h de práctica en el aula CECSE.';
    campo.value = sugerencia;
    campo.setAttribute('data-cecse-precarga', sugerencia);
  }
}

function varianteAlumno_(tipo) {
  if (tipo === 'lectura') return 'idevice-card idevice-card-audio';
  if (tipo === 'pregunta') return 'idevice-card idevice-card-pregunta';
  if (tipo === 'reto') return 'idevice-card idevice-card-reto';
  return 'idevice-card';
}

function etiquetaAlumno_(tipo) {
  if (tipo === 'lectura') return 'Lectura guiada';
  if (tipo === 'pregunta') return 'Pregunta formativa';
  if (tipo === 'reto') return 'Reto práctico';
  if (tipo === 'video') return 'Video';
  if (tipo === 'quiz') return 'Quiz';
  if (tipo === 'iframe') return 'Contenido externo';
  return 'Bloque';
}

function bloqueSoloLectura_(tipo, titulo, cuerpo, url) {
  var art = document.createElement('article');
  art.className = varianteAlumno_(tipo);
  var h = document.createElement('h3');
  h.textContent = etiquetaAlumno_(tipo);
  var t = document.createElement('p');
  t.textContent = titulo || '';
  var c = document.createElement('p');
  c.textContent = cuerpo || '';
  art.appendChild(h);
  if (titulo) art.appendChild(t);
  if (cuerpo) art.appendChild(c);
  var href = tipo === 'iframe' ? urlIframePermitida_(url) : '';
  if (href) {
    var marco = document.createElement('div');
    marco.className = 'bloque-iframe-container';
    var frame = document.createElement('iframe');
    frame.src = href;
    frame.title = titulo || 'Contenido externo';
    frame.loading = 'lazy';
    frame.setAttribute('referrerpolicy', 'no-referrer');
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms');
    marco.appendChild(frame);
    art.appendChild(marco);
  }
  return art;
}

function asegurarPreviewAlumno_() {
  var modal = crearSiFalta_('modalPreviewAlumno', 'div', document.body, true);
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Vista previa del alumno');
  if (!modal.querySelector('[data-vista-alumno]')) {
    var cuerpo = document.createElement('div');
    cuerpo.setAttribute('data-vista-alumno', '1');
    modal.appendChild(cuerpo);
  }
  if (!modal.querySelector('[data-cerrar-preview]')) {
    var cerrar = document.createElement('button');
    cerrar.type = 'button';
    cerrar.setAttribute('data-cerrar-preview', '1');
    cerrar.textContent = 'Cerrar';
    modal.appendChild(cerrar);
  }
  return modal;
}

function textoMomento_(id, alias) {
  var el = nodo_(id) || nodo_(alias);
  return el ? String(el.value || '').trim() : '';
}

function abrirVistaPreviaAlumno_() {
  var modal = asegurarPreviewAlumno_();
  var cuerpo = modal.querySelector('[data-vista-alumno]');
  vaciarNodo_(cuerpo);
  var momentos = [
    ['sesApertura', 'planApertura', 'Inicio'],
    ['sesDesarrollo', 'planDesarrollo', 'Desarrollo'],
    ['sesActividad', 'planActividad', 'Actividad'],
    ['sesCierre', 'planCierre', 'Cierre']
  ];
  momentos.forEach(function (def) {
    var sec = document.createElement('section');
    var h = document.createElement('h3');
    h.textContent = def[2];
    var p = document.createElement('p');
    p.textContent = textoMomento_(def[0], def[1]) || 'Sin texto en este momento.';
    sec.appendChild(h);
    sec.appendChild(p);
    cuerpo.appendChild(sec);
  });
  var cont = nodo_('contenedorIDevicesDinamicos');
  if (cont) {
    cont.querySelectorAll('.idevice-card').forEach(function (card) {
      var tipo = card.getAttribute('data-tipo') || '';
      var tit = card.querySelector('[data-campo="titulo"]');
      var cue = card.querySelector('[data-campo="cuerpo"]');
      cuerpo.appendChild(bloqueSoloLectura_(
        tipo,
        tit ? tit.value : '',
        cue ? cue.value : '',
        card.getAttribute('data-url') || ''
      ));
    });
  }
  mostrarOverlay_('modalPreviewAlumno');
  var cierre = modal.querySelector('[data-cerrar-preview]');
  if (cierre && cierre.focus) {
    try { cierre.focus(); } catch (err) {}
  }
}

function cerrarVistaPreviaAlumno_() {
  ocultarOverlay_('modalPreviewAlumno');
}

function guionSinMarcaIDevices_(texto) {
  var base = String(texto || '');
  var ini = base.indexOf(MARCA_IDEVICES_INI_AYUDA_);
  var fin = base.indexOf(MARCA_IDEVICES_FIN_AYUDA_);
  if (ini >= 0 && fin > ini) {
    base = base.slice(0, ini) + base.slice(fin + MARCA_IDEVICES_FIN_AYUDA_.length);
  }
  return base;
}

function leerIframesDelGuion_() {
  var campo = nodo_('sesGuionEstudiante');
  var base = guionSinMarcaIDevices_(campo ? campo.value : '');
  var lineas = base.split('\n');
  var out = [];
  var i;
  for (i = 0; i < lineas.length; i++) {
    if (lineas[i].indexOf(MARCA_IFRAME_PREFIJO_) !== 0) continue;
    var titulo = lineas[i].slice(MARCA_IFRAME_PREFIJO_.length).trim();
    var j = i + 1;
    while (j < lineas.length && !String(lineas[j]).trim()) j++;
    var url = (j < lineas.length) ? urlIframePermitida_(lineas[j]) : '';
    if (url) out.push({ titulo: titulo || 'Contenido externo', url: url });
  }
  return out;
}

function pintarTarjetaIframe_(bloque) {
  var cont = nodo_('contenedorIDevicesDinamicos');
  if (!cont || !bloque) return null;
  var div = document.createElement('div');
  div.className = 'idevice-card idevice-container';
  div.setAttribute('data-tipo', 'iframe');
  div.setAttribute('data-url', bloque.url);
  var header = document.createElement('div');
  header.className = 'idevice-header';
  var tag = document.createElement('span');
  tag.className = 'idevice-tag';
  tag.textContent = 'Contenido externo';
  var quitar = document.createElement('button');
  quitar.type = 'button';
  quitar.className = 'idevice-btn';
  quitar.textContent = 'Quitar';
  quitar.setAttribute('aria-label', 'Quitar contenido externo');
  quitar.addEventListener('click', function () { quitarBloqueIframe_(bloque.url); });
  header.appendChild(tag);
  header.appendChild(quitar);
  var body = document.createElement('div');
  body.className = 'idevice-body';
  var titulo = document.createElement('input');
  titulo.type = 'text';
  titulo.className = 'idevice-campo-titulo';
  titulo.setAttribute('data-campo', 'titulo');
  titulo.value = bloque.titulo || '';
  titulo.setAttribute('aria-label', 'Título del bloque externo');
  titulo.readOnly = true;
  var marco = document.createElement('div');
  marco.className = 'bloque-iframe-container';
  var frame = document.createElement('iframe');
  frame.src = bloque.url;
  frame.title = bloque.titulo || 'Contenido externo';
  frame.loading = 'lazy';
  frame.setAttribute('referrerpolicy', 'no-referrer');
  frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms');
  marco.appendChild(frame);
  body.appendChild(titulo);
  body.appendChild(marco);
  div.appendChild(header);
  div.appendChild(body);
  cont.appendChild(div);
  return div;
}

function rehidratarBloquesIframeDesdeGuion_() {
  var cont = nodo_('contenedorIDevicesDinamicos');
  if (!cont) return;
  cont.querySelectorAll('[data-tipo="iframe"]').forEach(function (n) { n.remove(); });
  leerIframesDelGuion_().forEach(function (bloque) {
    pintarTarjetaIframe_(bloque);
  });
}

function anexarIframeAlGuion_(titulo, url) {
  var campo = nodo_('sesGuionEstudiante');
  if (!campo) return false;
  var limpio = String(titulo || 'Contenido externo').replace(/\s+/g, ' ').trim() || 'Contenido externo';
  var pieza = '\n\n' + MARCA_IFRAME_PREFIJO_ + limpio + '\n' + url;
  campo.value = String(campo.value || '').replace(/\s+$/, '') + pieza;
  if (typeof marcarIDevicesTocados_ === 'function') marcarIDevicesTocados_();
  return true;
}

function quitarBloqueIframe_(url) {
  var campo = nodo_('sesGuionEstudiante');
  if (!campo) return;
  var lineas = String(campo.value || '').split('\n');
  var out = [];
  var i;
  for (i = 0; i < lineas.length; i++) {
    if (lineas[i].indexOf(MARCA_IFRAME_PREFIJO_) === 0) {
      var j = i + 1;
      while (j < lineas.length && !String(lineas[j]).trim()) j++;
      if (j < lineas.length && String(lineas[j]).trim() === url) {
        i = j;
        continue;
      }
    }
    out.push(lineas[i]);
  }
  campo.value = out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  if (typeof marcarIDevicesTocados_ === 'function') marcarIDevicesTocados_();
  rehidratarBloquesIframeDesdeGuion_();
}

function insertarBloqueIframe_(urlIframe, titulo) {
  if (!urlIframe) {
    pedirUrlIframe_().then(function (datos) {
      if (!datos || !datos.url) return;
      insertarBloqueIframe_(datos.url, datos.titulo);
    });
    return;
  }
  var limpia = urlIframePermitida_(urlIframe);
  if (!limpia) {
    avisar_('Solo se aceptan enlaces https de Genially, H5P, Canva o Google Slides.', 'error');
    return;
  }
  var ya = leerIframesDelGuion_().some(function (b) { return b.url === limpia; });
  if (ya) {
    avisar_('Ese enlace ya está en la sesión.', 'info');
    return;
  }
  if (!nodo_('contenedorIDevicesDinamicos') || !nodo_('sesGuionEstudiante')) {
    avisar_('Abre una sesión del proyecto para insertar el bloque.', 'error');
    return;
  }
  anexarIframeAlGuion_(titulo, limpia);
  rehidratarBloquesIframeDesdeGuion_();
  avisar_('Bloque externo insertado en la sesión.', 'ok');
}

function pedirUrlIframe_() {
  if (typeof modal !== 'function') {
    avisar_('No pude abrir el formulario del enlace.', 'error');
    return Promise.resolve(null);
  }
  return modal({
    titulo: 'Bloque externo',
    html: '<p>Pega un enlace https de Genially, H5P, Canva o Google Slides.</p>' +
      '<label>Título<input id="st90-iframe-titulo" type="text"></label>' +
      '<label>URL<input id="st90-iframe-url" type="url"></label>',
    botones: [
      { texto: 'Cancelar', valor: null, clase: 'btn-secundario' },
      { texto: 'Insertar', valor: 'ok' }
    ],
    capturar: function (fondo, val) {
      if (val === null) return null;
      var t = fondo.querySelector('#st90-iframe-titulo');
      var u = fondo.querySelector('#st90-iframe-url');
      return {
        titulo: t ? t.value : '',
        url: u ? u.value : ''
      };
    }
  });
}

function engancharPasoPlanNEM_() {
  if (typeof irAPasoPlanNEM !== 'function' || irAPasoPlanNEM._st90Ctx) return;
  var orig = irAPasoPlanNEM;
  function irAPasoPlanNEMConContexto(paso) {
    var r = orig.apply(this, arguments);
    try {
      actualizarContextoAsistenteIA_();
      aplicarAdecuacionCECSE_();
    } catch (e) {}
    return r;
  }
  irAPasoPlanNEMConContexto._st90Ctx = true;
  window.irAPasoPlanNEM = irAPasoPlanNEMConContexto;
}

function engancharRehidratacionIframe_() {
  if (typeof rehidratarIDevicesDesdeGuion_ !== 'function' || rehidratarIDevicesDesdeGuion_._st90Iframe) return;
  var orig = rehidratarIDevicesDesdeGuion_;
  function rehidratarIDevicesConIframe() {
    var r = orig.apply(this, arguments);
    try { rehidratarBloquesIframeDesdeGuion_(); } catch (e) {}
    return r;
  }
  rehidratarIDevicesConIframe._st90Iframe = true;
  window.rehidratarIDevicesDesdeGuion_ = rehidratarIDevicesConIframe;
}

function engancharEnterAsistente_() {
  var campo = nodo_('txtMensajeAsistente');
  if (!campo || campo._st90Enter) return;
  campo._st90Enter = true;
  campo.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Enter' || ev.shiftKey) return;
    ev.preventDefault();
    enviarMensajeAsistente_();
  });
}

function engancharCecse_() {
  var asig = nodo_('planAsignatura');
  var grado = nodo_('planGrado');
  var campo = nodo_('planContenidoSintetico');
  if (asig && !asig._st90Cecse) {
    asig._st90Cecse = true;
    asig.addEventListener('input', aplicarAdecuacionCECSE_);
    asig.addEventListener('change', aplicarAdecuacionCECSE_);
  }
  if (grado && !grado._st90Cecse) {
    grado._st90Cecse = true;
    grado.addEventListener('change', aplicarAdecuacionCECSE_);
  }
  if (campo && !campo._st90Cecse) {
    campo._st90Cecse = true;
    campo.addEventListener('input', function () {
      var previo = campo.getAttribute('data-cecse-precarga') || '';
      if (campo.value !== previo) campo.removeAttribute('data-cecse-precarga');
    });
  }
}

function engancharFiltrosBiblioteca_() {
  var bus = nodo_('buscarRecursoBiblioteca');
  var asig = nodo_('filtroAsignaturaRecurso');
  var grado = nodo_('filtroGradoRecurso');
  var tri = nodo_('filtroTrimestreRecurso');
  if (bus && !bus._st90Bib) {
    bus._st90Bib = true;
    bus.addEventListener('input', programarCargaBiblioteca_);
  }
  [asig, grado, tri].forEach(function (sel) {
    if (!sel || sel._st90Bib) return;
    sel._st90Bib = true;
    sel.addEventListener('change', programarCargaBiblioteca_);
  });
}

function clicLmsAechitexos_(e) {
  var ayuda = e.target && e.target.closest ? e.target.closest('.btn-ayuda-nem') : null;
  if (ayuda) {
    e.preventDefault();
    ultimoDisparadorAyuda_ = ayuda;
    var clave = ayuda.getAttribute('data-ayuda-campo');
    var datos = entradaAyuda_(clave);
    if (!datos) {
      avisar_('No hay ayuda para este campo.', 'info');
      return;
    }
    abrirAyudaPedagogica(datos);
    return;
  }
  if (e.target && e.target.closest && e.target.closest('[data-cerrar-ayuda-nem]')) {
    e.preventDefault();
    cerrarAyudaPedagogica_();
    return;
  }
  if (e.target && e.target.id === 'btnAsistenteFlotanteIA') {
    e.preventDefault();
    conmutarDrawerAsistente_();
    return;
  }
  if (e.target && e.target.id === 'btnEnviarAsistenteIA') {
    e.preventDefault();
    enviarMensajeAsistente_();
    return;
  }
  var sug = e.target && e.target.closest ? e.target.closest('[data-sugerencia-ia]') : null;
  if (sug) {
    e.preventDefault();
    enviarMensajeAsistente_(sug.getAttribute('data-sugerencia-ia'));
    return;
  }
  var subir = e.target && e.target.closest ? e.target.closest('[data-accion="abrir-subir-recurso"]') : null;
  if (subir) {
    e.preventDefault();
    abrirModalSubirRecurso_();
    return;
  }
  if (e.target && e.target.closest && e.target.closest('[data-cerrar-subir]')) {
    e.preventDefault();
    cerrarModalSubirRecurso_();
    return;
  }
  if (e.target && e.target.id === 'btnPreviewAlumno') {
    e.preventDefault();
    abrirVistaPreviaAlumno_();
    return;
  }
  if (e.target && e.target.closest && e.target.closest('[data-cerrar-preview]')) {
    e.preventDefault();
    cerrarVistaPreviaAlumno_();
  }
}

function teclaLmsAechitexos_(ev) {
  if (ev.key !== 'Escape') return;
  var ayuda = nodo_('modalAyudaNEM');
  if (ayuda && !ayuda.classList.contains('oculto')) {
    cerrarAyudaPedagogica_();
    return;
  }
  var subir = nodo_('modalSubirRecurso');
  if (subir && !subir.classList.contains('oculto')) {
    cerrarModalSubirRecurso_();
    return;
  }
  var previa = nodo_('modalPreviewAlumno');
  if (previa && !previa.classList.contains('oculto')) {
    cerrarVistaPreviaAlumno_();
    return;
  }
  var drawer = nodo_('drawerAsistenteIA');
  if (drawer && !drawer.classList.contains('oculto')) conmutarDrawerAsistente_(false);
}

function iniciarLmsAechitexos_() {
  if (lmsAechitexosListo_) return;
  lmsAechitexosListo_ = true;
  asegurarModalAyuda_();
  asegurarDrawerAsistente_();
  asegurarBiblioteca_();
  asegurarModalSubir_();
  asegurarPreviewAlumno_();
  asegurarBadgeCecse_();
  ocultarOverlay_('modalAyudaNEM');
  ocultarOverlay_('drawerAsistenteIA');
  ocultarOverlay_('vistaBibliotecaDocente');
  ocultarOverlay_('modalSubirRecurso');
  ocultarOverlay_('modalPreviewAlumno');
  engancharPasoPlanNEM_();
  engancharRehidratacionIframe_();
  engancharEnterAsistente_();
  engancharCecse_();
  engancharFiltrosBiblioteca_();
  aplicarAdecuacionCECSE_();
  actualizarContextoAsistenteIA_();
  pintarGridLibrosSEP_();
  document.addEventListener('click', clicLmsAechitexos_);
  document.addEventListener('keydown', teclaLmsAechitexos_);
  document.addEventListener('focusin', function (ev) {
    var id = ev.target && ev.target.id;
    sincronizarContextoDesdeFoco_(id);
    if (id && id.indexOf('plan') === 0 && id !== 'planContenidoSintetico') aplicarAdecuacionCECSE_();
  });
  window.abrirAyudaPedagogica = abrirAyudaPedagogica;
  window.DICCIONARIO_AYUDA_NEM = DICCIONARIO_AYUDA_NEM;
  window.cargarBibliotecaRecursos_ = cargarBibliotecaRecursos_;
  window.abrirVistaBibliotecaDocente_ = abrirVistaBibliotecaDocente_;
  window.abrirModalSubirRecurso_ = abrirModalSubirRecurso_;
  window.aplicarAdecuacionCECSE_ = aplicarAdecuacionCECSE_;
  window.abrirVistaPreviaAlumno_ = abrirVistaPreviaAlumno_;
  window.insertarBloqueIframe_ = insertarBloqueIframe_;
  window.actualizarContextoAsistenteIA_ = actualizarContextoAsistenteIA_;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarLmsAechitexos_);
} else {
  iniciarLmsAechitexos_();
}

/* ENTREGA-AYUDAJS-FIN */
</script>
```

---

### 🛠️ [2026-10-31] - [Controladores LMS AechitexOS en el buzón de Cursor]
- **Mensaje de Commit sugerido (Conventional Commits):** `feat(planeacion): controladores js del lms aechitexos en el buzon de cursor`
- **Cambios Realizados:**
  - Propuesta de `AyudaJS.html` con ayuda pedagógica, drawer del asistente, biblioteca, adecuación CECSE, vista previa del alumno e iframe https. Quedó en el buzón. El runtime, el backend y los IDs existentes no se tocaron.
- **Archivos Afectados:** `ENTREGA_CURSOR.md`
- **Contexto y Decisiones Técnicas (Resumen para Contexto AI):** `abrirAyuda(clave)` de `ComunJS.html` se conserva. La ayuda de campos es `abrirAyudaPedagogica`. Antigravity integra el `<script>` como `AyudaJS.html` después de `AdminPlanJS_Arranque`, publica `window.CATALOGO_LIBROS_SEP_FASE6_` y no reabre el polimorfismo de `abrirAyuda`. Los overlays usan `.oculto`.

