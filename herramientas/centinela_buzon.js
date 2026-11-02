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

let hashBuzonAnterior = leerHashYContenido(rutaBuzon).hash;
let hashCoordAnterior = leerHashYContenido(rutaCoord).hash;

console.log(`[CENTINELA ${nombreAgente}] Vigilando ${archivoBuzon} [${hashBuzonAnterior.slice(0, 8)}] y ${archivoCoord} [${hashCoordAnterior.slice(0, 8)}] cada ${intervaloSeg}s (máx ${maxCiclos} ciclos)...`);

let ciclos = 0;
const timer = setInterval(() => {
  ciclos++;
  const actualBuzon = leerHashYContenido(rutaBuzon);
  const actualCoord = leerHashYContenido(rutaCoord);

  const cambioBuzon = actualBuzon.hash && actualBuzon.hash !== hashBuzonAnterior;
  const cambioCoord = actualCoord.hash && actualCoord.hash !== hashCoordAnterior;

  // CASO 1: Cambio directo en el buzón personal del agente
  if (cambioBuzon) {
    const textoBuzon = actualBuzon.contenido;
    const tieneTareaBuzon =
      textoBuzon.includes('🟢') ||
      textoBuzon.includes('PROGRAMADA') ||
      textoBuzon.includes('NUEVA TAREA ASIGNADA') ||
      textoBuzon.includes('PARTITURA ASIGNADA');

    if (tieneTareaBuzon) {
      clearInterval(timer);
      console.log(`\n============================================================`);
      console.log(`🔔 [CENTINELA ${nombreAgente}] ¡NUEVA PARTITURA DETECTADA EN TU BUZÓN!`);
      console.log(`📄 Archivo disparador: ${archivoBuzon} (huella: ${actualBuzon.hash.slice(0, 8)})`);
      console.log(`============================================================\n`);
      console.log(extraerUltimaPartitura(textoBuzon));
      console.log(`\n============================================================`);
      console.log(`👉 ACCIÓN REQUERIDA: Lee ${archivoBuzon}, ejecuta la nueva tarea asignada y guarda tu entrega automáticamente.`);
      process.exit(0);
    } else {
      // Hubo cambio pero sin bandera activa, actualizamos huella y seguimos
      hashBuzonAnterior = actualBuzon.hash;
      console.log(`[CENTINELA ${nombreAgente}] [Ciclo ${ciclos}] Modificación en ${archivoBuzon} sin tareas activas marcadas. Guardia activa.`);
    }
  }

  // CASO 2: Cambio en el archivo global de coordinación (sin cambio en buzón)
  if (cambioCoord && !cambioBuzon) {
    const textoCoord = actualCoord.contenido;
    // Buscamos si la sección de tareas asigna algo explícito para este agente
    const regexAgente = new RegExp(`\\*\\*${nombreAgente}\\*\\*.*?(🟢\\s*\\*\\*(PROGRAMADA|ACTIVA)|PARTITURA ASIGNADA)`, 'is');
    const tieneTareaEspecifica = regexAgente.test(textoCoord);

    if (tieneTareaEspecifica) {
      clearInterval(timer);
      console.log(`\n============================================================`);
      console.log(`🔔 [CENTINELA ${nombreAgente}] ¡CONVOCATORIA DETECTADA EN COORDINACIÓN GLOBAL!`);
      console.log(`📄 Archivo disparador: ${archivoCoord} (huella: ${actualCoord.hash.slice(0, 8)})`);
      console.log(`============================================================\n`);
      console.log(extraerUltimaPartitura(textoCoord));
      console.log(`\n============================================================`);
      console.log(`👉 ACCIÓN REQUERIDA: Lee ${archivoCoord} y ${archivoBuzon}, ejecuta la partitura asignada.`);
      process.exit(0);
    } else {
      // Cambio en coordinación ajeno a este agente (ej. Antigravity actualizó bitácora o tareas de otro agente)
      hashCoordAnterior = actualCoord.hash;
      console.log(`[CENTINELA ${nombreAgente}] [Ciclo ${ciclos}] Actualización en ${archivoCoord} sin nueva partitura para ${nombreAgente}. Huella actualizada [${actualCoord.hash.slice(0, 8)}]. Guardia activa.`);
    }
  }

  if (ciclos >= maxCiclos) {
    clearInterval(timer);
    console.log(`[CENTINELA ${nombreAgente}] Tiempo de espera concluido (${maxCiclos} min) sin nuevas tareas en ${archivoBuzon}.`);
    process.exit(0);
  }
}, intervaloSeg * 1000);

