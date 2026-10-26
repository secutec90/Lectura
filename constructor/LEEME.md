# Constructor de Encuestas — guía de uso

> Encuesta pública + panel de analítica sobre Google Apps Script y Google Sheets.
> Este archivo es la puerta de entrada: qué es, cómo se usa y cómo se publica.
> Estado técnico: [`RADIOGRAFIA.md`](RADIOGRAFIA.md) · Bitácora y pendientes: [`AVANCES.md`](AVANCES.md) ·
> Estilos: [`SKILL.md`](SKILL.md) · Auditoría funcional: [`AUDITORIA-Y-ROADMAP.md`](AUDITORIA-Y-ROADMAP.md).
> **Última actualización:** 2026-10-23 · versión publicada **46**

---

## 1. Dónde está

| Elemento | Valor |
|---|---|
| Carpeta | `G:\Mi unidad\PROYECTOS\EncuestaMovilidad\constructor` |
| Script ID | `1qC6tPtXlMJqkU1L2nZS1KXMOslESO17JyGOjJLykRUTy0c2oIofm2HkD` |
| Hoja de datos | `1bwqSni0iNPeFnoYK6M3gkeKgoC-_nv2-LNja72_lubk` |
| Editor | https://script.google.com/home/projects/1qC6tPtXlMJqkU1L2nZS1KXMOslESO17JyGOjJLykRUTy0c2oIofm2HkD/edit |
| Enlace de alumnos | https://script.google.com/macros/s/AKfycbz8Wuh6pv6CD9HwEtDbnlfTIBRRSQetjx-pMSV8qtQeuuszDMWuZEHOSo-ynN62GZst2w/exec |
| Enlace de revisión (`@HEAD`) | https://script.google.com/macros/s/AKfycbwInuRa2faaIkV_O14-F0J_sHitzOYMgNrvamiqZBHg/exec (pide sesión de Google) |
| Panel | el enlace de alumnos → pestaña **Panel Administrador** |

**Credenciales del panel:** `Admin` / `Admin-dev` mientras no existan las propiedades
`ADMIN_USUARIO` y `ADMIN_PASS`. **Es el único pendiente P0: cámbialas.**
La clave de simulación es `Memo#1` (propiedad `CLAVE_ESPECIAL`).

---

## 2. La encuesta (pública)

- Se genera desde las hojas `Formulario` y `Configuracion`: una fila por pregunta.
- 8 tipos: texto, párrafo, opción única, opción múltiple, número, fecha, sí/no y escala.
- Preguntas condicionales (`extra.condicion`), cascada turno → grupo y máximos de longitud.
- Validación en cliente y en servidor; cada envío escribe una fila en `Respuestas` con
  `Origen = Real` y marca temporal.
- Confirmación persistente con el nombre del alumno (`{nombre}` en el mensaje de éxito).

---

## 3. El panel

### Barra superior

```
Turno  Grado  Grupo        ⚙ Ajustes   ↓ Orden   ↻   ✕          CSV  PDF  🛠  ⎋
```

- **Turno · Grado · Grupo**: filtros fijos, en ese orden. Grupo se habilita al elegir Turno.
  Grado se deduce del grupo (`1A` → `1`).
- **⚙ Ajustes**: tipo de gráfica (barras H/V, pastel, dona, líneas, apiladas H/V, rayos
  solares), valores (cantidad o porcentaje) y base porcentual. **División** solo aparece
  cuando el tipo es barras apiladas.
- **↓ Orden**: mayor a menor, menor a mayor o por categoría.
- **↻** recarga datos · **✕** limpia los filtros.
- **CSV** y **PDF** exportan con los filtros activos · **🛠** mantenimiento · **⎋** cierra sesión.

### Tarjeta de la gráfica

```
[▾ pregunta que se grafica]      🔽 filtros por pregunta ②      N respuestas
```

- El **título es el selector**: al pulsarlo se despliega la lista de todas las preguntas
  (primero las de opción, luego las de texto libre) y al elegir una se grafican **sus opciones**
  con los filtros aplicados.
- **🔽 filtros por pregunta**: filtra la muestra por las respuestas de otras preguntas. El
  contador muestra cuántos hay activos.
- Clic en la tarjeta (fuera de los menús) → gráfica ampliada.
- La tabla de al lado muestra una columna por segmento (turno/grado/grupo), con total, % y
  acumulado.

### Hoja de registros

Búsqueda de texto, orden por campo y dirección, Top 5/10/25/50/100 y restablecer. Exporta a CSV
(con escape y neutralización de fórmulas) o a PDF por impresión.

### Editor

- **Configuración de cabecera**: escuela, subtítulo, título, introducción, botón, textos de
  éxito y nota al pie.
- **Preguntas**: alta, edición, reordenar y eliminación lógica; tipo, opciones, obligatoriedad,
  condición, categoría y longitud máxima.
- **Origen de datos**: pega la URL o el ID de otra hoja de cálculo y pulsa «Probar y vincular».
  La app comprueba el acceso, crea las pestañas que falten y pasa a escribir ahí.

### Mantenimiento (🛠)

- **Simular respuestas**: 1–500 filas con `Origen = Simulado` (pide la clave `Memo#1`).
- **Quitar preguntas de ejemplo**: desactiva las preguntas «Ejemplo · Sede / Área / Puesto»
  si alguna vez se instalaron.
- **Limpiar simulados**: borra solo las filas simuladas.

---

## 4. Publicar, versionar y revertir

```powershell
cd "G:\Mi unidad\PROYECTOS\EncuestaMovilidad\constructor"
$clasp = "C:\Users\Administrador\AppData\Local\nodejs-portable\node-v24.21.0-win-x64\node_modules\@google\clasp\build\src\index.js"

# 1) ver qué archivos se van a subir (deben ser 5, sin _backup)
node $clasp status

# 2) subir a HEAD (el .claspignore deja fuera _backup/ y los .md)
node $clasp push -f

# 3) crear versión y mover el enlace de alumnos
node $clasp version "v58 - descripción del cambio"
node $clasp update-deployment AKfycbz8Wuh6pv6CD9HwEtDbnlfTIBRRSQetjx-pMSV8qtQeuuszDMWuZEHOSo-ynN62GZst2w -V 58

# 4) revertir (misma URL, segundos)
node $clasp update-deployment AKfycbz8Wuh6pv6CD9HwEtDbnlfTIBRRSQetjx-pMSV8qtQeuuszDMWuZEHOSo-ynN62GZst2w -V 57
```

> `update-deployment` conserva la URL. No uses `clasp deploy` para actualizar: crearía otro
> despliegue con otra dirección.
> Antes de publicar, comprueba que Drive no pisó el archivo: `Index.html` debe ser el que
> describe `RADIOGRAFIA.md` §8 y §1.

---

## 5. Historial de versiones

| Versión | MD5 (Index) | Qué cambió | Estado |
|---|---|---|---|
| 40 | `F368CC1D` | Filtros unificados y constructor | Retirada (no compilaba) |
| 41 | `93ECAFF3` | Editor restaurado, gráficas con valores, apiladas reales | Reemplazada |
| 42 | `711F9A24` | Tabla de totales con una columna por segmento | Reemplazada |
| 43 | `702C87A2` | Conexión dinámica de la hoja desde el panel | Reemplazada |
| 44 | `AB450F5D` | Jerarquía universal de filtros (`esDimension`, `padre`) | Reemplazada |
| 45 | `ED97574E` | Ejemplo de jerarquía instalable (Sede → Área → Puesto) | Reemplazada |
| 46 | `3354DC87` | Panel: pregunta en la tarjeta, filtros Turno/Grado/Grupo, fuera «Eje X» y el ejemplo | Reemplazada |
| 47 | `0BBD5DD3` | Al elegir una pregunta ya no se abre el modal de zoom | Reemplazada |
| 48 | `E62122A8` | Rol analítico, graficable y jerarquía Eje X/Y en el editor | Reemplazada |
| 49 | — | Puente temporal de sembrado | Interna, no desplegada |
| 50 | `BE9BBBF8` | Panel: sin zoom por clic, carga con estado y errores visibles | Reemplazada |
| 51 · 52 | — | Despliegues temporales de diagnóstico | Internas, retiradas |
| 53 | `0A72C73B` | El panel recibe los datos como JSON (corrige el panel vacío) | Reemplazada |
| 54 | `59CF8787` | El menú de filtros por pregunta se cierra al elegir | Reemplazada |
| 55 | `560DDAAC` | Distribución de etiquetas del eje configurable | Reemplazada |
| 56 · 57 | `41DDCF3D` | **Ayuda del constructor y del modal de pregunta** | **Producción** |

### Qué cambió en la 46 (2026-10-23)

- La barra dejó de generar un botón por dimensión del esquema: ahora son **Turno, Grado y
  Grupo**, en ese orden, y desaparecieron las dimensiones de ejemplo.
- El **título de la gráfica es el selector de pregunta**; el botón 📊 que había en cada fila
  de filtros ya no existe.
- Los **filtros por pregunta** se movieron de la barra a la cabecera de la tarjeta.
- Se eliminó el bloque **«Eje X»** del menú Ajustes; «División» queda solo para apiladas.
- Se retiró la tarjeta **«Ejemplo de jerarquía»** del editor; en su lugar hay una acción de
  mantenimiento para desactivar esas preguntas.
- Se añadió `.claspignore` (antes `clasp push` subía `_backup/` al proyecto y duplicaba
  funciones del backend).

### Qué cambió en la 47 (2026-10-23)

- Al elegir una pregunta en el selector del título **ya no se abre el modal** de la gráfica
  ampliada: el clic llegaba a la tarjeta como si se hubiera pulsado el lienzo.
- El zoom sigue funcionando al pulsar la gráfica o cualquier zona libre de la tarjeta.
- El mismo defecto existía en el menú **Ajustes** (tipo, valores, base porcentual) y quedó
  corregido igual.

### Qué cambió en la 48 (2026-10-23)

- El interruptor «Usar como dimensión» se sustituyó por **Rol analítico** (identidad, dimensión o
  métrica), la casilla **¿Permitir graficar en el panel?** y la sección de **jerarquía** (padre y
  opciones por valor del padre), visible solo para dimensiones.
- El selector de la tarjeta ya no lista preguntas de identidad o desmarcadas: se agrupa en
  **Dimensiones (Eje X)** y **Métricas (Eje Y)**.
- Los datos anteriores se migran solos: sin rol definido, se infiere del tipo y de esDimension o padre.

---

## 6. Documentos

| Documento | Estado | Para qué |
|---|---|---|
| `LEEME.md` | Vigente | Este archivo: guía de uso y publicación |
| `RADIOGRAFIA.md` | Vigente | Arquitectura, modelo de datos, contratos, métricas |
| `AVANCES.md` | Vigente | Estado, cambios por sesión, pendientes y bitácora |
| `AUDITORIA-Y-ROADMAP.md` | Vigente (informe del 22/10) | Deficiencias y hoja de ruta |
| `SKILL.md` | Vigente | Reglas de estilos de la interfaz |
| `DOCUMENTACION.md` | **Histórico (v7)** | Documentación antigua; no corresponde al código actual |
| `FLUJO-ESQUEMA.md` | Vigente | Cómo viaja el esquema de preguntas y qué se toca en cada tramo |
| `FLUJO-RESPUESTAS.md` | Vigente | Cómo viaja una respuesta y cómo la filtra y agrega el panel |

---

## 7. Pendientes conocidos

1. **Rotar `ADMIN_PASS` y `CLAVE_ESPECIAL`** (siguen `Admin-dev` / `Memo#1`).
2. Desactivar las preguntas de ejemplo si siguen activas (🛠 → «Quitar preguntas de ejemplo»).
3. `guardarFormulario()` borra `Configuracion` y la reescribe sin `hojaId`.
4. `validarRespuestas()` y la simulación ignoran `opcionesPorPadre`.
5. Sin aviso si el CDN de Chart.js falla; el esquema se guarda sin respaldo previo.
6. Accesibilidad: `th` sin teclado, `alert/confirm/prompt`, modales sin `aria-labelledby`.

Detalle y prioridades en [`AVANCES.md`](AVANCES.md) §3.

---

## 8. Problemas típicos

| Síntoma | Causa y salida |
|---|---|
| La página abre en blanco | Error de JavaScript en `Index.html`. Revisar con `node --check` sobre el `<script>` y volver a la versión anterior con `update-deployment -V 45`. |
| «No autorizado» al guardar | La sesión del panel caducó: vuelve a entrar. |
| `openById` sin permiso | La cuenta que ejecuta el script no ve la hoja: compártela como Editor o define la propiedad `HOJA_ID`. |
| El panel no muestra datos | Sin respuestas todavía, o filtros activos: pulsa **✕**. |
| Drive pisó `Index.html` | Restaurar desde `_backup/constructor-v57-Index.html` (o la v55 si la 57 también está dañada) y volver a publicar. |
