#!/usr/bin/env node
/**
 * CENTINELA DE BUZÓN MULTI-AGENTE (CURSOR, DEEPSEEK & ANTIGRAVITY) · v3
 * ====================================================================
 * Vigila el buzón del agente y `ESTADO_COORDINACION.md` cada 60 segundos.
 *
 * Para Cursor & DeepSeek:
 *   Vigila su buzón respectivo en busca de nueva partitura (🎯 / 🟢).
 *
 * Para Antigravity:
 *   Vigila AMBOS buzones (`ENTREGA_CURSOR.md` y `ENTREGA_DEEPSEEK.md`)
 *   en busca de nuevas entregas (✅ / 📦) para despertar al Director
 *   e iniciar la auditoría AST, integración y despliegue.
 *
 * Uso:
 *   node herramientas/centinela_buzon.js cursor
 *   node herramientas/centinela_buzon.js deepseek
 *   node herramientas/centinela_buzon.js antigravity
 *   node herramientas/centinela_buzon.js antigravity --intervalo=15 --max-ciclos=120
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const args = process.argv.slice(2);
const agenteRaw = (args.find(a => !a.startsWith('--')) || 'cursor').toLowerCase().trim();
const esAntigravity = agenteRaw.includes('antigravity') || agenteRaw.includes('director');
const esDeepSeek = !esAntigravity && agenteRaw.includes('deepseek');
const nombreAgente = esAntigravity ? 'ANTIGRAVITY' : (esDeepSeek ? 'DEEPSEEK' : 'CURSOR');
const patronAgente = esDeepSeek ? /deepseek/i : (esAntigravity ? /(antigravity|director)/i : /cursor/i);

const archivoCoord = 'ESTADO_COORDINACION.md';
const argIntervalo = args.find(a => a.startsWith('--intervalo='));
const intervaloSeg = argIntervalo ? Math.max(5, parseInt(argIntervalo.split('=')[1], 10) || 60) : (esAntigravity ? 15 : 60);

const argMaxCiclos = args.find(a => a.startsWith('--max-ciclos='));
let maxCiclos = 0;
if (argMaxCiclos) {
  const val = parseInt(argMaxCiclos.split('=')[1], 10);
  maxCiclos = isNaN(val) || val <= 0 ? 0 : Math.max(1, val);
} else {
  maxCiclos = 0;
}

const raiz = process.cwd();
const rutaCoord = path.join(raiz, archivoCoord);

/* Marcadores de partitura para Cursor / DeepSeek */
const MARCADORES_PARTITURA = [
  '## 🎯 PARTITURA ASIGNADA',
  '## 🚀 [PROGRAMACIÓN',
  '🟢 **PARTITURA ASIGNADA',
  '🟢 **PROGRAMADA Y LISTA PARA EJECUCIÓN**',
  '🟢 **NUEVA TAREA ASIGNADA',
  '## 3. Tarea Activa',
  '## 5. Tarea Activa',
  '## 5. Tarea Programada'
];

/* Marcadores de entrega para Antigravity */
const MARCADORES_ENTREGA = [
  '## ✅ ENTREGA',
  '## 📦 ENTREGA',
  '### INFORME PARA ANTIGRAVITY',
  '🟢 LISTA PARA INTEGRAR',
  '🟢 **ENTREGADA'
];

function leerArchivo(ruta) {
  try {
    if (!fs.existsSync(ruta)) return { hash: '', contenido: '' };
    const contenido = fs.readFileSync(ruta, 'utf8');
    return { hash: crypto.createHash('sha256').update(contenido).digest('hex'), contenido };
  } catch (e) {
    return { hash: '', contenido: '' };
  }
}

/* Extrae bloque relevante: partitura o entrega */
function extraerBloque(contenido, esEntrega) {
  if (!contenido) return '';
  const marcadores = esEntrega ? MARCADORES_ENTREGA : MARCADORES_PARTITURA;
  let inicio = -1;
  for (const m of marcadores) {
    const idx = contenido.lastIndexOf(m);
    if (idx > inicio) inicio = idx;
  }
  if (inicio < 0) return '';
  const resto = contenido.slice(inicio);
  const fin = resto.indexOf('\n## ', 4);
  return (fin >= 0 ? resto.slice(0, fin) : resto).trim();
}

function firma(bloque) {
  if (!bloque) return '';
  const lineas = bloque.split('\n')
    .map(function (l) { return l.replace(/\s+/g, ' ').trim(); })
    .filter(function (l) { return l.length > 0; });
  const cabecera = lineas.slice(0, 3).join(' | ');
  const marcas = (bloque.match(/🟢|✅|📦/g) || []).length;
  return crypto.createHash('sha256').update(cabecera + '|' + marcas + '|' + bloque.length).digest('hex');
}

function estadoArchivo(ruta, esEntrega) {
  const { hash, contenido } = leerArchivo(ruta);
  const bloque = extraerBloque(contenido, esEntrega);
  return {
    ruta,
    nombre: path.basename(ruta),
    hashArchivo: hash,
    bloque,
    firma: firma(bloque),
    menciona: bloque ? (esEntrega ? true : patronAgente.test(bloque)) : false
  };
}

// -------------------------------------------------------------
// MODO ANTIGRAVITY: Vigila entregas de Cursor y DeepSeek
// -------------------------------------------------------------
if (esAntigravity) {
  const rutaCursor = path.join(raiz, 'ENTREGA_CURSOR.md');
  const rutaDeepSeek = path.join(raiz, 'ENTREGA_DEEPSEEK.md');

  let cursorPrevio = estadoArchivo(rutaCursor, true);
  let deepseekPrevio = estadoArchivo(rutaDeepSeek, true);

  const descCiclosAnti = maxCiclos === 0 ? 'sin tope de ciclos' : `máx ${maxCiclos} ciclos`;
  console.log(`[CENTINELA ANTIGRAVITY] Director en guardia activa.`);
  console.log(`[CENTINELA ANTIGRAVITY] Vigilando entregas en ENTREGA_CURSOR.md [${cursorPrevio.hashArchivo.slice(0, 8)}] y ENTREGA_DEEPSEEK.md [${deepseekPrevio.hashArchivo.slice(0, 8)}] cada ${intervaloSeg}s (${descCiclosAnti})...`);

  let ciclos = 0;
  const timer = setInterval(() => {
    ciclos++;
    const cursorActual = estadoArchivo(rutaCursor, true);
    const deepseekActual = estadoArchivo(rutaDeepSeek, true);

    const cambioCursor = cursorActual.hashArchivo && cursorActual.hashArchivo !== cursorPrevio.hashArchivo;
    const cambioDeepSeek = deepseekActual.hashArchivo && deepseekActual.hashArchivo !== deepseekPrevio.hashArchivo;

    const entregaCursor = cambioCursor && cursorActual.firma && cursorActual.firma !== cursorPrevio.firma;
    const entregaDeepSeek = cambioDeepSeek && deepseekActual.firma && deepseekActual.firma !== deepseekPrevio.firma;

    if (entregaCursor || entregaDeepSeek) {
      clearInterval(timer);
      const agenteDisparador = (entregaCursor && entregaDeepSeek) ? 'CURSOR y DEEPSEEK' : (entregaCursor ? 'CURSOR' : 'DEEPSEEK');
      const archivoDisparador = entregaCursor ? 'ENTREGA_CURSOR.md' : 'ENTREGA_DEEPSEEK.md';
      const bloque = entregaCursor ? cursorActual.bloque : deepseekActual.bloque;

      console.log('\n============================================================');
      console.log(`🔔 [CENTINELA ANTIGRAVITY] ¡NUEVA ENTREGA DETECTADA DE ${agenteDisparador}!`);
      console.log(`📄 Archivo disparador: ${archivoDisparador}`);
      console.log('============================================================\n');
      console.log(bloque.slice(0, 500) + (bloque.length > 500 ? '\n... [ver buzón completo]' : ''));
      console.log('\n============================================================');
      console.log('👉 ACCIÓN REQUERIDA (ANTIGRAVITY): Auditar AST (node herramientas/manifiesto.js), integrar código, incrementar versión y desplegar (clasp push).');
      process.exit(0);
    }

    if (ciclos % 4 === 0 || ciclos === 1) {
      const cicloStr = maxCiclos === 0 ? `Ciclo ${ciclos}` : `Ciclo ${ciclos}/${maxCiclos}`;
      console.log(`[CENTINELA ANTIGRAVITY] [${cicloStr}] Sin nuevas entregas pendientes. Guardia atenta.`);
    }

    if (cambioCursor) cursorPrevio = cursorActual;
    if (cambioDeepSeek) deepseekPrevio = deepseekActual;

    if (maxCiclos > 0 && ciclos >= maxCiclos) {
      clearInterval(timer);
      console.log(`[CENTINELA ANTIGRAVITY] Tiempo de guardia concluido (${maxCiclos} ciclos).`);
      process.exit(0);
    }
  }, intervaloSeg * 1000);

} else {
  // -------------------------------------------------------------
  // MODO CURSOR / DEEPSEEK: Vigila asignación de partituras
  // -------------------------------------------------------------
  const archivoBuzon = esDeepSeek ? 'ENTREGA_DEEPSEEK.md' : 'ENTREGA_CURSOR.md';
  const rutaBuzon = path.join(raiz, archivoBuzon);

  let buzonAnterior = estadoArchivo(rutaBuzon, false);
  let coordAnterior = estadoArchivo(rutaCoord, false);

  const descCiclos = maxCiclos === 0 ? 'sin tope de ciclos' : `máx ${maxCiclos} ciclos`;
  console.log(`[CENTINELA ${nombreAgente}] Política v3 · huella por partitura`);
  console.log(`[CENTINELA ${nombreAgente}] Vigilando ${archivoBuzon} [${buzonAnterior.hashArchivo.slice(0, 8)}] y ${archivoCoord} [${coordAnterior.hashArchivo.slice(0, 8)}] cada ${intervaloSeg}s (${descCiclos})...`);

  const avisados = new Set();
  let ciclos = 0;

  const timer = setInterval(() => {
    ciclos++;
    const buzon = estadoArchivo(rutaBuzon, false);
    const coord = estadoArchivo(rutaCoord, false);

    const cambioBuzon = buzon.hashArchivo && buzon.hashArchivo !== buzonAnterior.hashArchivo;
    const cambioCoord = coord.hashArchivo && coord.hashArchivo !== coordAnterior.hashArchivo;

    const tareaBuzon = cambioBuzon && buzon.firma && buzon.firma !== buzonAnterior.firma && buzon.menciona;
    const tareaCoord = cambioCoord && coord.firma && coord.firma !== coordAnterior.firma && coord.menciona;

    if (tareaBuzon || tareaCoord) {
      const origen = tareaBuzon && tareaCoord
        ? 'AMBOS'
        : (tareaBuzon ? archivoBuzon : archivoCoord);
      const bloque = tareaBuzon ? buzon.bloque : coord.bloque;
      const huella = tareaBuzon ? buzon.hashArchivo : coord.hashArchivo;

      clearInterval(timer);
      console.log('\n============================================================');
      if (tareaBuzon) {
        console.log(`🔔 [CENTINELA ${nombreAgente}] ¡NUEVA PARTITURA DETECTADA EN TU BUZÓN!`);
      } else {
        console.log(`🔔 [CENTINELA ${nombreAgente}] ¡CONVOCATORIA DETECTADA EN COORDINACIÓN GLOBAL!`);
      }
      console.log(`📄 Archivo disparador: ${origen} (huella: ${huella.slice(0, 8)})`);
      console.log('============================================================\n');
      console.log(bloque);
      console.log('\n============================================================');
      console.log(`👉 ACCIÓN REQUERIDA: Lee ${origen} y ${archivoCoord}, ejecuta la partitura asignada y guarda tu entrega en ${archivoBuzon}.`);
      process.exit(0);
    }

    [['buzon', cambioBuzon, buzon, buzonAnterior], ['coord', cambioCoord, coord, coordAnterior]].forEach(function (par) {
      const etiqueta = par[0] === 'buzon' ? archivoBuzon : archivoCoord;
      if (!par[1]) return;
      const actual = par[2];
      const previo = par[3];
      const clave = etiqueta + ':' + actual.hashArchivo;
      if (avisados.has(clave)) return;
      avisados.add(clave);
      const motivo = (actual.firma && actual.firma !== previo.firma)
        ? 'la partitura no menciona a ' + nombreAgente
        : 'sin partitura nueva (solo edición de texto)';
      console.log(`[CENTINELA ${nombreAgente}] [Ciclo ${ciclos}] ${etiqueta} cambió, pero ${motivo}. Guardia activa.`);
    });

    if (cambioBuzon) buzonAnterior = buzon;
    if (cambioCoord) coordAnterior = coord;

    if (maxCiclos > 0 && ciclos >= maxCiclos) {
      clearInterval(timer);
      const descTiempo = intervaloSeg === 60 ? `${maxCiclos} min` : `${maxCiclos} ciclos`;
      console.log(`[CENTINELA ${nombreAgente}] Tiempo de espera concluido (${descTiempo}) sin partituras nuevas.`);
      process.exit(0);
    }
  }, intervaloSeg * 1000);
}
