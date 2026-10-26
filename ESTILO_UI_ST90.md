# Estilo UI ST90 — cinta N1 / N2 / N3

Documento canónico del panel **ST90 (Lectura)**. Versión de referencia: **v303**.

Toda sección nueva o rediseñada sigue este patrón. No improvisar barras, selects nativos visibles, botones de texto ni globos sobre iconos que ya tienen texto debajo.

**Código vivo:** `Admin.html` (`#cintaMat`, `#cintaAsi`, `#cintaLec`), `Clase.html` (`#cintaClase`), `ComunCSS.html`, `ComunJS.html` (`modal()`, `iniciarCintaSinSeleccion_()`, `iniciarCintaClase_()`).

**Prompt:** `PROMPT_UI_ST90.md`  
**Copia en Apps Script:** `EstiloUiSt90.html` · `?pagina=estilo`

`REGLA_UI_CINTA.md` está obsoleto.

---

## 1. Principio de oro

**Si un icono abre contenido distinto al de los de su misma fila, ese contenido va a un subribbon inferior.** Nunca mezcles pestañas de sección con filtros, listas o acciones en la misma fila.

| Icono N2 | Qué abre | Dónde va |
|---|---|---|
| Usuarios → Alumnos | Alta, CSV, Grupo, Claves, Actualizar, Buscar, Grado, Grupo, Estado, Limpiar | N3 integrado dentro del catálogo en una sola fila centrada; texto «Mostrando X de X alumnos» oculto |
| Usuarios → Docentes | Sincronizar, Claves, Actualizar | N3 integrado dentro de la tarjeta; encabezado «Contraseñas y accesos de docentes» oculto |
| Usuarios → Prefectas / Apoyo | Alta, Horario XML, Demo… | N3 en cabecera (`#cintaMat`) |
| Asistencia → Alumnos | Fecha, Grupo, Presentes, Guardar | N3 dentro de la tarjeta `#asiFiltroAlu`. A la izquierda: `Prefecta: Nombre`. Sin Grado ni Buscar. Sin chips de grupos, sin «Turno matutino», sin el texto largo de sesión |
| Asistencia → Docente | Fecha, docente | N3 `#asiFiltroMae` |
| Asistencia → Reportes | Alumnos o Docentes (en el cuerpo), luego Periodo (Día/Semana/Mes/Trimestre con flechas), Grupos, Alumno o Docente, Generar | Sin Grado. Periodo abre panel (no calendario nativo). Lista incluye filtros de estado/notas. Fechas `dd/sep/26` |
| Lecturas → Banco / Trimestre / Resultados | Lista, Nueva, IA… o Gráficas, Notas, Imprimir | N3 de `#cintaLec` |
| Clase → Clases / Alumnos / Docentes | Fecha, Grupo, Alumno, Asignatura o Grado, Grupo, Buscar, Generar | N3 integrado en el cuerpo/tarjeta. Al elegir N2 (si hay) se colapsa el subribbon; un clic en N1 lo vuelve a abrir |
| Clase hablada → alumno | Día / Semana, anterior, Hoy, siguiente | Vista **Día** por defecto (lista de clases). **Semana** es secundaria (calendario). Reproductor con Detener. Sin autoplay. |

Si N3 no tiene nada, va con `.oculto`.

---

## 2. Los tres niveles

```
N1  Usuarios   Asistencia   Lecturas              Salir
N2  Alumnos    Docente      Reportes              Ayuda
N3  Fecha      Grado        Grupo    Presentes    Guardar
```

- **N1** (`.ribbon-tab`): módulos. Salir está en `.barra-sup-acciones`.
- **N2** (`.cinta-n2`): pestañas de la sección + **Ayuda**.
- **N3** (`.cinta-n3`): un solo bloque contextual, **centrado**. En listas/catálogo el último nivel va **dentro de la tarjeta**.

Cinta sticky `z-index: 200`; `th` sticky `z-index: 1`. En **Clase**, N2+N3 **no** son sticky: no tapan el horario.

---

## 3. Revelado progresivo y colapso del subribbon

Al entrar **ningún icono lleva recuadro**. Solo se ve N1. El nivel inferior aparece al pulsar un icono de la fila de arriba, y llega **sin** rectángulo blanco.

1. **Entrada:** Usuarios / Asistencia / Lecturas / Salir. Nada `activa`. N2 y N3 ocultos. Cuerpo vacío. No auto-abrir Asistencia ni Lecturas por rol.
2. **Clic N1:** ese icono se encierra en rectángulo blanco de esquinas redondeadas (`activa`, borde `#94a3b8`) y aparece N2. **Ningún** icono N2 lleva recuadro. N3 y el cuerpo siguen ocultos.
3. **Clic N2:** se marca ese icono, se abre N3 y el catálogo, y **el subribbon N2 se colapsa solo**. Quedan N1 (con recuadro) y el contenido. Clase CSS global: `body.subribbon-collapsed` / `.ribbon-main-nav.subribbon-collapsed` / `.subribbon-container.is-hidden`. Si N3 vive en la cabecera (Prefectas, Banco), N3 se queda; si N3 está en la tarjeta, la caja del subribbon desaparece y el contenido sube.
4. **Clic otra vez en el N1 activo** (con el subribbon colapsado): N2 se vuelve a desplegar para elegir otra pestaña. El contenido **no** se borra.
5. **Clic en otro N1:** se abre el N2 de ese módulo (cinta desplegada, sin preselección).
6. **Clic N1 activo con N2 ya visible y sin contenido:** se vuelve al estado de entrada.
7. **Clic N3 de acción** (Alta, CSV, Grupo): se marca ese icono, se oculta el catálogo y **solo** se ve el formulario. Segundo clic restaura la lista. Filtros y Actualizar no sustituyen la lista.
8. **Ayuda** no colapsa el subribbon.

Clases globales (`ComunCSS.html` + `ribbonSetNivel2()` / `ribbonColapsarTrasN2()` en `ComunJS.html`):

- `body.subribbon-collapsed` y `body.ribbon-n2-cerrado` (alias)
- `.ribbon-main-nav.subribbon-collapsed` / `.subribbon-hidden`
- `.subribbon-container.subribbon-container-hidden` / `.is-hidden` cuando no hay N3 de cabecera

Prohibido al abrir N1: `aplicarSubUsu('alu')`, `aplicarSubAsi('alu')`, `aplicarSubLec('banco')`.

---

## 4. Anatomía de un icono

```html
<button type="button" class="ribbon-btn ribbon-ico-azul" onclick="..." aria-label="Alumnos">
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"></svg>
  <span class="ribbon-label">Alumnos</span>
</button>
```

- Siempre **SVG + `span.ribbon-label`**. Una o dos palabras.
- **Prohibido tooltip** en cinta: no `data-tip`, no `title`, no globo CSS. El texto debajo es el nombre.
- Sí `aria-label`.
- Filtro aplicado: actualiza `.ribbon-label` y pon `activo`.
- Seleccionado: `activo` / `activa` (rectángulo blanco, borde `#94a3b8`, radio 10px).
- Colores: `ribbon-ico-azul` alumnos · `ribbon-ico-morado` docentes · `ribbon-ico-ambar` prefectas / Ayuda · `ribbon-ico-verde` apoyo / Alta / Guardar / Presentes · `ribbon-ico-celeste` reportes / trimestre · `ribbon-ico-rojo` Salir.

**Ayuda:** N2, `btn-ayuda ribbon-btn ribbon-ico-ambar`, label `Ayuda`, sin tooltip.

**Excepción:** iconos compactos **sin** label (fila de tabla, `.btn-icono-res`, `.asi-e`) sí pueden usar `data-tip`.

El kill-switch CSS (`.ribbon-btn[data-tip]::after { display:none }`) no se quita.

---

## 5. Filtros y catálogo

Los filtros de selección directa despliegan una lista nativa (**select overlay** transparente sobre el `ribbon-btn`) o el calendario nativo (`input date` + `showPicker()`). Al elegir, se actualiza la etiqueta (ej. `1A`, `CIENCIAS`). No uses modales con Aplicar/Cancelar para esos filtros de N3.

`modal()` sigue vivo para confirmaciones (generar claves, respaldos) y para algunos paneles de Resultados.

**Catálogo:** la lista va en el **cuerpo**. En Asistencia → Alumnos se muestra directo el formato para pasar lista (P/T/A/J, sin PE) del grupo elegido o del primero disponible.

En listas, el último nivel de controles va **dentro de la tarjeta, una sola fila, centrado**. Se ocultan textos de conteo y títulos redundantes («Mostrando X de X alumnos», «Contraseñas y accesos de docentes», «Alumnos encontrados»).

**Prohibido:** chips `1A 1B 1C …` en la cinta. **Prohibido:** encabezado duplicado Administrador—Administrador.

En el horario, la vista **Mes Horizontal** usa scroll horizontal visible (`.scroll-mes-h`, columna de horas sticky).

---

## 6. Plantilla de sección nueva

N2 sin `activo` de fábrica. N3 nace con `oculto`.

Al pulsar N1 se marca ese módulo (rectángulo blanco redondeado) y se enseña N2 sin preselección. Al pulsar N2 se marca ese botón, se enseña N3 y el cuerpo, y el subribbon N2 se colapsa. Un clic en N1 lo vuelve a abrir.

---

## 7. Superficie visual

Hacer: fondo de cinta transparente; activo = rectángulo blanco; tablas compactas; login sin cromo extra; **español de México**.

No hacer: H1/H2 sobre la cinta; chips KPI; mix N2+N3 en la misma fila; select/date nativo a la vista; icono de cinta sin label o con tooltip; grupos en la cinta; caja blanca agrupando iconos; `recargar()` pisando `innerHTML` de un `ribbon-btn`; auto-marcar Fecha/Lista/Gráficas/Alumnos.

---

## 8. Checklist

- [ ] Entrada: ningún N1 con recuadro. N2/N3 ocultos.
- [ ] Clic N1: recuadro redondeado **solo** en ese módulo. N2 visible sin preselección. Cuerpo vacío.
- [ ] Clic N2: N3 + cuerpo, y el subribbon N2 se colapsa (`subribbon-collapsed`). N3 sin `activo` de fábrica.
- [ ] Clic otra vez en N1 activo: se reabre N2; el contenido no se borra.
- [ ] Clic N3 Alta/CSV/Grupo: se oculta el catálogo; solo el formulario. Segundo clic restaura la lista.
- [ ] Filtros N3: overlay / `showPicker()`. Catálogo en el cuerpo.
- [ ] Asistencia → Alumnos: `Prefecta: Nombre` a la izquierda; Fecha, Grupo, Presentes, Guardar. Sin Grado ni Buscar.
- [ ] Asistencia → Reportes: tipo Alumnos/Docentes en el cuerpo; Periodo/Grado/Grupos/Alumno o Docente/Generar dentro de la tarjeta.
- [ ] Ayuda en N2, con label, sin globo.
- [ ] Español MX. `snake_case` en Apps Script.
- [ ] `VERSION_APP` sin `-dev`. Solo ST90-dev y ST90-escucha, salvo orden explícita.
- [ ] Clase: N1 Clases / Alumnos / Docentes + Salir. Tras elegir, solo N1 + contenido; un clic en N1 reabre el subribbon.
- [ ] Clase alumno: Día por defecto; Semana secundaria; fecha en texto; lista lineal accesible.

---

## 9. Fuera de alcance

ST90 / carpeta Lectura (GAS). Academia (Filament) usa `CLAUDE.md`. No cruzar cintas.
