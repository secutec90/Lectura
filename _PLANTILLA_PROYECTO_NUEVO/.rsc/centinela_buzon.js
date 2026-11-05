#!/usr/bin/env node
/**
 * CENTINELA DE BUZÓN MULTI-AGENTE (CURSOR & DEEPSEEK) · v2
 * ========================================================
 * Política de negocio v2 (2026-11-01):
 *
 *  1. HUELLA POR PARTITURA, NO POR ARCHIVO.
 *     No basta con que el archivo cambie: se firma el bloque de partitura
 *     tomando sus DOS primeras líneas con contenido más el número de marcas
 *     de estado (🟢). Así, cuando el agente escribe su propia entrega debajo,
 *     o cuando se reformatea la tabla de reparto, el centinela no se despierta.
 *     Contrapartida del contrato: toda partitura nueva debe estrenar título
 *     propio o añadir una marca 🟢; de lo contrario se considera la misma.
 *
 *  2. AVISO CON ORIGEN.
 *     El mensaje dice siempre qué archivo disparó el aviso:
 *     `ENTREGA_DEEPSEEK.md`, `ESTADO_COORDINACION.md` o `AMBOS`.
 *
 *  3. FILTRO POR AGENTE.
 *     Si el bloque modificado no nombra al agente que vigila, no lo despierta.
 *     Un cambio en la fila de Cursor no interrumpe a DeepSeek ni al revés.
 *
 *  4. SILENCIO EXPLÍCITO.
 *     Cuando un archivo cambia pero su partitura es la misma, se informa una
 *     sola vez por consola y el ciclo continúa, en lugar de dar una falsa alarma.
 *
 * Uso:
 *   node .rsc/centinela_buzon.js cursor
 *   node .rsc/centinela_buzon.js deepseek
 *   node .rsc/centinela_buzon.js deepseek --intervalo=60 --max-ciclos=60
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const args = process.argv.slice(2);
const agenteRaw = (args.find(a => !a.startsWith('--')) || 'cursor').toLowerCase().trim();
const esDeepSeek = agenteRaw.includes('deepseek');
const nombreAgente = esDeepSeek ? 'DEEPSEEK' : 'CURSOR';
const patronAgente = esDeepSeek ? /deepseek/i : /cursor/i;
const archivoBuzon = esDeepSeek ? 'ENTREGA_DEEPSEEK.md' : 'ENTREGA_CURSOR.md';
const archivoCoord = 'ESTADO_COORDINACION.md';

const argIntervalo = args.find(a => a.startsWith('--intervalo='));
const intervaloSeg = argIntervalo ? Math.max(5, parseInt(argIntervalo.split('=')[1], 10) || 60) : 60;

const argMaxCiclos = args.find(a => a.startsWith('--max-ciclos='));
const maxCiclos = argMaxCiclos ? Math.max(1, parseInt(argMaxCiclos.split('=')[1], 10) || 60) : 60;

const raiz = process.cwd();
const rutaBuzon = path.join(raiz, archivoBuzon);
const rutaCoord = path.join(raiz, archivoCoord);

/* Marcadores que abren una partitura. Se mantienen por compatibilidad con
   los documentos históricos del proyecto. */
const MARCADORES = [
  '## 🎯 PARTITURA ASIGNADA',
  '## 🚀 [PROGRAMACIÓN',
  '🟢 **PARTITURA ASIGNADA',
  '🟢 **PROGRAMADA Y LISTA PARA EJECUCIÓN**',
  '🟢 **NUEVA TAREA ASIGNADA',
  '## 3. Tarea Activa',
  '## 5. Tarea Activa',
  '## 5. Tarea Programada'
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

/* Bloque de partitura: desde el último marcador hasta el siguiente H2.
   Delimitar el bloque es lo que evita que la entrega del propio agente
   (que se escribe debajo) cuente como partitura nueva. */
function extraerBloquePartitura(contenido) {
  if (!contenido) return '';
  let inicio = -1;
  for (const m of MARCADORES) {
    const idx = contenido.lastIndexOf(m);
    if (idx > inicio) inicio = idx;
  }
  if (inicio < 0) return '';
  const resto = contenido.slice(inicio);
  const fin = resto.indexOf('\n## ', 4);
  return (fin >= 0 ? resto.slice(0, fin) : resto).trim();
}

/* Firma de la partitura: no es el bloque completo, sino su encabezado
   normalizado más el número de marcas de estado. Así, reformatear la tabla
   de reparto o añadir párrafos al final del bloque no cambia la firma; un
   encabezado nuevo o un estado nuevo sí. */
function firma(bloque) {
  if (!bloque) return '';
  const lineas = bloque.split('\n').map(function (l) { return l.replace(/\s+/g, ' ').trim(); })
    .filter(function (l) { return l.length > 0; });
  const cabecera = lineas.slice(0, 2).join(' | ');
  const marcas = (bloque.match(/🟢/g) || []).length;
  return crypto.createHash('sha256').update(cabecera + '|' + marcas).digest('hex');
}

function estado(ruta) {
  const { hash, contenido } = leerArchivo(ruta);
  const bloque = extraerBloquePartitura(contenido);
  return {
    hashArchivo: hash,
    bloque,
    huellaBloque: bloque ? firma(bloque) : '',
    menciona: bloque ? patronAgente.test(bloque) : false
  };
}

const inicialBuzon = estado(rutaBuzon);
const inicialCoord = estado(rutaCoord);

console.log(`[CENTINELA ${nombreAgente}] Política v2 · huella por bloque de partitura`);
console.log(`[CENTINELA ${nombreAgente}] Vigilando ${archivoBuzon} y ${archivoCoord} cada ${intervaloSeg}s (máx ${maxCiclos} ciclos)...`);

const avisados = new Set();   // evita repetir el mismo "cambio sin partitura"
let ciclos = 0;

function nuevoCambio(actual, inicial) {
  return actual.hashArchivo && actual.hashArchivo !== inicial.hashArchivo;
}

function partituraNueva(actual, inicial) {
  if (!actual.huellaBloque) return false;
  if (!inicial.huellaBloque) return true;
  return actual.huellaBloque !== inicial.huellaBloque;
}

const timer = setInterval(() => {
  ciclos++;
  const buzon = estado(rutaBuzon);
  const coord = estado(rutaCoord);

  const cambioBuzon = nuevoCambio(buzon, inicialBuzon);
  const cambioCoord = nuevoCambio(coord, inicialCoord);

  const tareaBuzon = cambioBuzon && partituraNueva(buzon, inicialBuzon) && buzon.menciona;
  const tareaCoord = cambioCoord && partituraNueva(coord, inicialCoord) && coord.menciona;

  if (tareaBuzon || tareaCoord) {
    const origen = tareaBuzon && tareaCoord
      ? 'AMBOS'
      : (tareaBuzon ? archivoBuzon : archivoCoord);
    const bloque = tareaBuzon ? buzon.bloque : coord.bloque;

    clearInterval(timer);
    console.log('\n============================================================');
    console.log(`🔔 [CENTINELA ${nombreAgente}] NUEVA PARTITURA DETECTADA`);
    console.log(`   origen: ${origen}`);
    console.log('============================================================\n');
    console.log(bloque);
    console.log('\n============================================================');
    console.log(`👉 ACCIÓN REQUERIDA: Lee el bloque de arriba junto con ${archivoCoord}, ejecuta la tarea y guarda tu entrega en ${archivoBuzon}.`);
    process.exit(0);
  }

  /* Cambio real de archivo pero sin partitura nueva para este agente. */
  [['buzon', cambioBuzon, buzon], ['coord', cambioCoord, coord]].forEach(function (par) {
    const etiqueta = par[0] === 'buzon' ? archivoBuzon : archivoCoord;
    const cambio = par[1];
    const actual = par[2];
    if (!cambio) return;
    const clave = etiqueta + ':' + actual.hashArchivo;
    if (avisados.has(clave)) return;
    avisados.add(clave);
    const motivo = partituraNueva(actual, par[0] === 'buzon' ? inicialBuzon : inicialCoord)
      ? 'la partitura no menciona a ' + nombreAgente
      : 'sin partitura nueva (solo edición de texto)';
    console.log(`· ${etiqueta} cambió, pero ${motivo}. Sigo vigilando.`);
  });

  if (ciclos >= maxCiclos) {
    clearInterval(timer);
    console.log(`[CENTINELA ${nombreAgente}] Tiempo de espera concluido (${maxCiclos} min) sin partituras nuevas.`);
    process.exit(0);
  }
}, intervaloSeg * 1000);
