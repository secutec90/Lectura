# herramientas/

Utilidades de verificación del proyecto. No forman parte del despliegue de Apps Script.

## `manifiesto.js`

Arnés para **partir archivos monolíticos sin cambiar comportamiento**.

Usa **acorn** (parser real de JavaScript, vendorizado en `acorn.js`) para leer el AST de
nivel superior de cada `.gs` y de cada bloque `<script>`. No hay heurísticas: cada
declaración y cada sentencia sale del árbol de sintaxis, con su texto y su línea exactos.

### Qué recoge

1. Los `.gs` y `.html` del proyecto (excluye `.rsc`, `constructor`, `_backup` y tooling).
2. Cada bloque `<script>` de los HTML, neutralizando los scriptlets `<?= ?>` sin mover
   las posiciones del AST.
3. **Símbolos de nivel superior**: `function`, `const`, `let`, `var` y `class`, con el
   `sha256` de su texto normalizado.
4. **Sentencias ejecutables de nivel superior** (`ExpressionStatement`, `IfStatement`,
   `TryStatement`…): las que se rompen si un `<script>` se parte en dos bloques y quedan
   antes de sus dependencias.
5. **Nombres definidos en más de un documento**, donde gana el último cargado.

### Uso

```bash
# 1. Foto del estado actual (antes de tocar nada)
node herramientas/manifiesto.js --salida herramientas/manifiesto-antes.json

# 2. Hacer el corte: mover bloques completos, sin editar una línea

# 3. Foto del estado nuevo
node herramientas/manifiesto.js --salida herramientas/manifiesto-despues.json

# 4. Verificar
node herramientas/manifiesto.js --comparar herramientas/manifiesto-antes.json herramientas/manifiesto-despues.json
```

Opciones: `--raiz <dir>` analiza otra carpeta (útil para comparar commits extraídos con
`git archive`), `--constructor` incluye el subproyecto, `--salida <ruta>` escribe el JSON.

Salida `0` = **EQUIVALENTE**: ningún símbolo cambió de contenido, solo de archivo.
Salida `1` = hay símbolos cambiados, eliminados o nuevos (eso ya no es un movimiento).

### Lectura del resultado

| Apartado | Significado |
|---|---|
| conservados | Mismo hash, mismo documento. Nada se tocó. |
| movidos | Mismo hash, otro documento. **Es un corte correcto.** |
| cambiados | Mismo nombre, contenido distinto. **Es una edición**, no un movimiento. |
| eliminados / nuevos | Símbolos que desaparecieron o aparecieron. |
| sentencias superiores desaparecidas | Código ejecutable de nivel superior que ya no existe. |

### Regla de trabajo

Un commit mueve, otro commit edita. Si el manifiesto dice EQUIVALENTE, el corte es
demostrablemente inocuo. Si dice DIFERENTE, ese cambio necesita revisión y prueba manual.

Antes de cortar un `<script>`, conviene comprobar dos cosas (el manifiesto ya las expone):

- que ninguna constante se inicialice llamando a una función declarada **después**
  (al partir, esa llamada se ejecutaría antes de que exista la función);
- cuántas sentencias de nivel superior hay: todas deben ir al bloque de arranque final,
  para que se ejecuten cuando ya estén declaradas todas las funciones.

### Validación del propio arnés

- Conteos de funciones del backend comprobados contra búsqueda directa:
  `Codigo.gs` 246, `Asistencia.gs` 62, `ClaseLogica.gs` 58, `PlaneacionNEM.gs` 15,
  `Encuestas.gs` 45, `HorarioOficial.gs` 1.
- Los seis cortes del proyecto (backend, CSS, Clase, Admin, Planeación y Formulario)
  re-verificados con esta versión acorn comparando cada commit con su padre:
  **EQUIVALENTE en los seis**, con 0 símbolos cambiados.

### Historial del arnés

La primera versión usaba un tokenizador heurístico propio. Falló en
`FormularioEncuesta.html`: perdía el nivel de anidamiento y clasificaba fragmentos de
cuerpos de función como sentencias de nivel superior (51 en vez de 2), y luego daba un
falso positivo al comparar. Se sustituyó por acorn (v8.19.0, MIT, ~200 KB vendorizados)
el 26 de octubre de 2026.
