#!/usr/bin/env node
/**
 * CENTINELA DE BUZÓN MULTI-AGENTE (CURSOR & DEEPSEEK) · v2
 * ========================================================
 * Vigila el buzón del agente y `ESTADO_COORDINACION.md` cada 60 segundos.
 *
 * Política v2 (2026-11-01):
 *
 *  1. HUELLA POR PARTITURA, NO POR ARCHIVO.
 *     Se firma el bloque de partitura con sus DOS primeras líneas con
 *     contenido más el número de marcas de estado (🟢). Escribir la entrega
 *     debajo de la partitura, reformatear la tabla de reparto o añadir
 *     párrafos al final del bloque ya no despierta al agente.
 *
 *  2. TODO AVISO DECLARA EL ORIGEN.
 *     `ENTREGA_*.md`, `ESTADO_COORDINACION.md` o `AMBOS`, y se imprime el
 *     bloque del archivo que realmente cambió.
 *
 *  3. FILTRO POR AGENTE.
 *     Si el bloque no menciona al agente vigilado, no lo despierta.
 *
 *  4. SILENCIO EXPLÍCITO.
 *     Un cambio sin partitura nueva se informa una sola vez y el ciclo sigue.
 *
 * Contrapartida del contrato: toda partitura nueva debe estrenar título propio
 * (por ejemplo `## 🎯 PARTITURA ASIGNADA: OLA 6 …`) o añadir una marca 🟢.
 *
 * Uso:
 *   node herramientas/centinela_buzon.js cursor
 *   node herramientas/centinela_buzon.js deepseek
 *   node herramientas/centinela_buzon.js cursor --intervalo=60 --max-ciclos=60
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

/* Marcadores que abren una partitura (compatibles con los históricos). */
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

/* Bloque de partitura: desde el último marcador hasta el siguiente H2. */
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

/* Firma: dos primeras líneas con contenido + número de marcas 🟢. */
function firma(bloque) {
  if (!bloque) return '';
  const lineas = bloque.split('\n')
    .map(function (l) { return l.replace(/\s+/g, ' ').trim(); })
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
    firma: firma(bloque),
    menciona: bloque ? patronAgente.test(bloque) : false
  };
}

let buzonAnterior = estado(rutaBuzon);
let coordAnterior = estado(rutaCoord);

console.log(`[CENTINELA ${nombreAgente}] Política v2 · huella por partitura`);
console.log(`[CENTINELA ${nombreAgente}] Vigilando ${archivoBuzon} [${buzonAnterior.hashArchivo.slice(0, 8)}] y ${archivoCoord} [${coordAnterior.hashArchivo.slice(0, 8)}] cada ${intervaloSeg}s (máx ${maxCiclos} ciclos)...`);

const avisados = new Set();
let ciclos = 0;

const timer = setInterval(() => {
  ciclos++;
  const buzon = estado(rutaBuzon);
  const coord = estado(rutaCoord);

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

  /* Cambio real de archivo pero sin partitura nueva para este agente. */
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

  /* Las huellas se actualizan para no repetir el aviso en cada ciclo. */
  if (cambioBuzon) buzonAnterior = buzon;
  if (cambioCoord) coordAnterior = coord;

  if (ciclos >= maxCiclos) {
    clearInterval(timer);
    console.log(`[CENTINELA ${nombreAgente}] Tiempo de espera concluido (${maxCiclos} min) sin partituras nuevas.`);
    process.exit(0);
  }
}, intervaloSeg * 1000);
