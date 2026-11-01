#!/usr/bin/env node
/**
 * CENTINELA DE BUZÓN MULTI-AGENTE (CURSOR & DEEPSEEK)
 * ===================================================
 * Vigila cada 60 segundos el buzón correspondiente (`ENTREGA_CURSOR.md` o
 * `ENTREGA_DEEPSEEK.md`) y `ESTADO_COORDINACION.md` después de que el agente
 * termina una entrega.
 *
 * En cuanto Antigravity deposita una nueva partitura o actualiza la tarea
 * activa, el centinela despierta al agente devolviendo las instrucciones
 * nuevas por consola (exit code 0) para que continúe automáticamente sin
 * intervención manual del usuario.
 *
 * Uso:
 *   node .rsc/centinela_buzon.js cursor
 *   node .rsc/centinela_buzon.js deepseek
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const args = process.argv.slice(2);
const agenteRaw = (args.find(a => !a.startsWith('--')) || 'cursor').toLowerCase().trim();
const esDeepSeek = agenteRaw.includes('deepseek');
const nombreAgente = esDeepSeek ? 'DEEPSEEK' : 'CURSOR';
const archivoBuzon = esDeepSeek ? 'ENTREGA_DEEPSEEK.md' : 'ENTREGA_CURSOR.md';
const archivoCoord = 'ESTADO_COORDINACION.md';

const argIntervalo = args.find(a => a.startsWith('--intervalo='));
const intervaloSeg = argIntervalo ? Math.max(5, parseInt(argIntervalo.split('=')[1], 10) || 60) : 60;

const argMaxCiclos = args.find(a => a.startsWith('--max-ciclos='));
const maxCiclos = argMaxCiclos ? Math.max(1, parseInt(argMaxCiclos.split('=')[1], 10) || 60) : 60;

const raiz = process.cwd();
const rutaBuzon = path.join(raiz, archivoBuzon);
const rutaCoord = path.join(raiz, archivoCoord);

function leerHashYContenido(ruta) {
  try {
    if (!fs.existsSync(ruta)) return { hash: '', contenido: '', mtime: 0 };
    const contenido = fs.readFileSync(ruta, 'utf8');
    const stat = fs.statSync(ruta);
    const hash = crypto.createHash('sha256').update(contenido).digest('hex');
    return { hash, contenido, mtime: stat.mtimeMs };
  } catch (e) {
    return { hash: '', contenido: '', mtime: 0 };
  }
}

function extraerUltimaPartitura(contenido) {
  if (!contenido) return '';
  const marcadores = [
    '🚀 [PROGRAMACIÓN',
    '🟢 **PARTITURA ASIGNADA',
    '🟢 **PROGRAMADA Y LISTA PARA EJECUCIÓN**',
    '🟢 **NUEVA TAREA ASIGNADA',
    '## 3. Tarea Activa',
    '## 5. Tarea Activa'
  ];
  let ultimoIndice = -1;
  for (const m of marcadores) {
    const idx = contenido.lastIndexOf(m);
    if (idx > ultimoIndice) ultimoIndice = idx;
  }
  if (ultimoIndice >= 0) {
    const inicioLinea = Math.max(0, contenido.lastIndexOf('\n', ultimoIndice - 10));
    return contenido.slice(inicioLinea).trim();
  }
  return contenido.slice(-1500).trim();
}

const estadoInicialBuzon = leerHashYContenido(rutaBuzon);
const estadoInicialCoord = leerHashYContenido(rutaCoord);

console.log(`[CENTINELA ${nombreAgente}] Vigilando ${archivoBuzon} y ${archivoCoord} cada ${intervaloSeg}s (máx ${maxCiclos} ciclos)...`);

let ciclos = 0;
const timer = setInterval(() => {
  ciclos++;
  const actualBuzon = leerHashYContenido(rutaBuzon);
  const actualCoord = leerHashYContenido(rutaCoord);

  const cambioBuzon = actualBuzon.hash && actualBuzon.hash !== estadoInicialBuzon.hash;
  const cambioCoord = actualCoord.hash && actualCoord.hash !== estadoInicialCoord.hash;

  if (cambioBuzon || cambioCoord) {
    const texto = cambioBuzon ? actualBuzon.contenido : actualCoord.contenido;
    const tieneTareaActiva =
      texto.includes('🟢') ||
      texto.includes('PROGRAMADA Y LISTA PARA EJECUCIÓN') ||
      texto.includes('NUEVA TAREA ASIGNADA') ||
      texto.includes('PARTITURA ASIGNADA POR ANTIGRAVITY');

    if (tieneTareaActiva) {
      clearInterval(timer);
      console.log(`\n============================================================`);
      console.log(`🔔 [CENTINELA ${nombreAgente}] ¡NUEVA TAREA DETECTADA EN EL BUZÓN!`);
      console.log(`============================================================\n`);
      console.log(extraerUltimaPartitura(actualBuzon.contenido || actualCoord.contenido));
      console.log(`\n============================================================`);
      console.log(`👉 ACCIÓN REQUERIDA: Lee ${archivoBuzon} y ${archivoCoord}, ejecuta la nueva tarea asignada y guarda tu entrega automáticamente.`);
      process.exit(0);
    }
  }

  if (ciclos >= maxCiclos) {
    clearInterval(timer);
    console.log(`[CENTINELA ${nombreAgente}] Tiempo de espera concluido (${maxCiclos} min) sin nuevas tareas en ${archivoBuzon}.`);
    process.exit(0);
  }
}, intervaloSeg * 1000);

