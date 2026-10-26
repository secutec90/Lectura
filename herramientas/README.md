# herramientas/

Utilidades de verificación del proyecto. No forman parte del despliegue de Apps Script.

## `manifiesto.js`

Arnés para **partir archivos monolíticos sin cambiar comportamiento**.

### Qué hace

1. Recorre los `.gs` y `.html` (excluye `.rsc`, `constructor`, `_backup` y tooling).
2. Extrae cada bloque `<script>` de los HTML, neutralizando los scriptlets `<?= ?>`.
3. Localiza los **símbolos de nivel superior** (`function`, `const`, `let`, `var`, `class`) y guarda el `sha256` de su texto exacto.
4. Localiza las **sentencias ejecutables de nivel superior** (las que se rompen si un `<script>` se parte en dos bloques y quedan antes de sus dependencias).
5. Señala los **nombres definidos en más de un documento**, donde gana el último cargado.

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

Salida `0` = **EQUIVALENTE**: ningún símbolo cambió de contenido, solo de archivo.
Salida `1` = hay símbolos cambiados, eliminados o nuevos (eso ya no es un movimiento).

### Lectura del resultado

| Apartado | Significado |
|---|---|
| conservados | Mismo hash, mismo documento. Nada se tocó. |
| movidos | Mismo hash, otro documento. **Es un corte correcto.** |
| cambiados | Mismo nombre, contenido distinto. **Es una edición**, no un movimiento. |
| eliminados / nuevos | Símbolos que desaparecieron o aparecieron. |
| sentencias superiores perdidas | Código ejecutable de nivel superior que se perdió: el corte rompió el orden de carga. |

### Regla de trabajo

Un commit mueve, otro commit edita. Si el manifiesto dice EQUIVALENTE, el corte es
demostrablemente inocuo y se puede desplegar sin pruebas adicionales. Si dice DIFERENTE,
ese cambio necesita revisión y prueba manual.

### Validación del propio arnés

Los conteos de funciones coinciden exactamente con los medidos por búsqueda directa:
`Codigo.gs` 246, `Asistencia.gs` 62, `ClaseLogica.gs` 58, `PlaneacionNEM.gs` 15,
`Encuestas.gs` 45, `HorarioOficial.gs` 1.
