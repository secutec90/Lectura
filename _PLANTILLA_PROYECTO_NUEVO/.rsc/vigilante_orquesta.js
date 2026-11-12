#!/usr/bin/env node
/**
 * VIGILANTE GLOBAL DE LA ORQUESTA (CURSOR + DEEPSEEK + ANTIGRAVITY)
 * ================================================================
 * Monitorea continuamente (cada 10s) los buzones y el estado de coordinacion.
 * Cuando se detecta un cambio:
 *   1. Emite alerta sonora en Windows ([System.Media.SystemSounds]::Exclamation).
 *   2. Muestra una notificacion flotante (Balloon Tip / Toast) en la barra de tareas.
 *   3. Copia automaticamente el mensaje de activacion al PORTAPAPELES de Windows.
 *      (¡El usuario solo tiene que ir a la ventana del agente y presionar Ctrl+V + Enter!)
 *
 * Uso:
 *   node .rsc/vigilante_orquesta.js
 *   (o doble clic en iniciar_vigilante.cmd)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');

const raiz = process.cwd();
const rutaCursor = path.join(raiz, 'ENTREGA_CURSOR.md');
const rutaDeepSeek = path.join(raiz, 'ENTREGA_DEEPSEEK.md');
const rutaCoord = path.join(raiz, 'ESTADO_COORDINACION.md');

const INTERVALO_MS = 10000; // Sondeo cada 10 segundos

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
    return {
      hash: crypto.createHash('sha256').update(contenido).digest('hex'),
      contenido
    };
  } catch (e) {
    return { hash: '', contenido: '' };
  }
}

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
    .map(l => l.replace(/\s+/g, ' ').trim())
    .filter(l => l.length > 0);
  const cabecera = lineas.slice(0, 3).join(' | ');
  const marcas = (bloque.match(/🟢|✅|📦/g) || []).length;
  return crypto.createHash('sha256').update(cabecera + '|' + marcas + '|' + bloque.length).digest('hex');
}

function notificarSistema(titulo, mensaje, promptPortapapeles) {
  try {
    const safeTitulo = (titulo || '').replace(/'/g, "''");
    const safeMensaje = (mensaje || '').replace(/'/g, "''");
    let scriptPs = `[System.Media.SystemSounds]::Exclamation.Play();`;
    if (promptPortapapeles) {
      const safeClip = promptPortapapeles.replace(/'/g, "''");
      scriptPs += ` Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Clipboard]::SetText('${safeClip}');`;
    }
    scriptPs += ` Add-Type -AssemblyName System.Windows.Forms; $notify = New-Object System.Windows.Forms.NotifyIcon; $notify.Icon = [System.Drawing.SystemIcons]::Information; $notify.BalloonTipTitle = '${safeTitulo}'; $notify.BalloonTipText = '${safeMensaje}'; $notify.Visible = $True; $notify.ShowBalloonTip(4000); Start-Sleep -Milliseconds 600; $notify.Dispose();`;

    exec(`powershell -NoProfile -NonInteractive -Command "${scriptPs}"`, () => {});
  } catch (e) {}
}

let cursorPrevio = leerArchivo(rutaCursor);
let deepseekPrevio = leerArchivo(rutaDeepSeek);
let coordPrevio = leerArchivo(rutaCoord);

let firmaPartituraCursor = firma(extraerBloque(cursorPrevio.contenido, false));
let firmaPartituraDeepSeek = firma(extraerBloque(deepseekPrevio.contenido, false));
let firmaEntregaCursor = firma(extraerBloque(cursorPrevio.contenido, true));
let firmaEntregaDeepSeek = firma(extraerBloque(deepseekPrevio.contenido, true));

console.log('================================================================');
console.log('🛡️  VIGILANTE ACTIVO DE LA ORQUESTA (CURSOR + DEEPSEEK + ANTIGRAVITY)');
console.log('================================================================');
console.log(`📂 Directorio: ${raiz}`);
console.log(`⏱️  Frecuencia de sondeo: cada ${INTERVALO_MS / 1000}s`);
console.log('🔔 Alertas sonoras: ACTIVADAS');
console.log('📋 Auto-copiado al portapapeles: ACTIVADO');
console.log('----------------------------------------------------------------');
console.log('Esperando cambios en buzones y partituras...\n');

let ciclo = 0;

setInterval(() => {
  ciclo++;
  const cursorActual = leerArchivo(rutaCursor);
  const deepseekActual = leerArchivo(rutaDeepSeek);
  const coordActual = leerArchivo(rutaCoord);

  // 1. Deteccion de nueva partitura para CURSOR
  if (cursorActual.hash !== cursorPrevio.hash) {
    const fPart = firma(extraerBloque(cursorActual.contenido, false));
    if (fPart && fPart !== firmaPartituraCursor && /cursor/i.test(extraerBloque(cursorActual.contenido, false))) {
      firmaPartituraCursor = fPart;
      const hora = new Date().toLocaleTimeString();
      console.log(`[${hora}] 🎯 ¡NUEVA PARTITURA DETECTADA PARA CURSOR!`);
      const prompt = `Revisa tu buzón ENTREGA_CURSOR.md y ESTADO_COORDINACION.md. Se te ha asignado una nueva partitura. Ejecútala de inmediato y guarda tu entrega en ENTREGA_CURSOR.md.`;
      notificarSistema('Orquesta: Tarea para CURSOR', 'Nueva partitura asignada. Prompt copiado al portapapeles (Ctrl+V).', prompt);
    }

    // Deteccion de nueva entrega de CURSOR para ANTIGRAVITY
    const fEnt = firma(extraerBloque(cursorActual.contenido, true));
    if (fEnt && fEnt !== firmaEntregaCursor) {
      firmaEntregaCursor = fEnt;
      const hora = new Date().toLocaleTimeString();
      console.log(`[${hora}] 📦 ¡CURSOR HA REALIZADO UNA ENTREGA!`);
      const prompt = `Cursor completó su entrega en ENTREGA_CURSOR.md. Procede a auditar AST, integrar y desplegar.`;
      notificarSistema('Orquesta: Entrega de CURSOR', 'Cursor entregó código. Listo para auditoría de Antigravity.', prompt);
    }
    cursorPrevio = cursorActual;
  }

  // 2. Deteccion de nueva partitura para DEEPSEEK
  if (deepseekActual.hash !== deepseekPrevio.hash) {
    const fPart = firma(extraerBloque(deepseekActual.contenido, false));
    if (fPart && fPart !== firmaPartituraDeepSeek && /deepseek/i.test(extraerBloque(deepseekActual.contenido, false))) {
      firmaPartituraDeepSeek = fPart;
      const hora = new Date().toLocaleTimeString();
      console.log(`[${hora}] 🎯 ¡NUEVA PARTITURA DETECTADA PARA DEEPSEEK!`);
      const prompt = `Revisa tu buzón ENTREGA_DEEPSEEK.md y ESTADO_COORDINACION.md. Se te ha asignado una nueva partitura de diseño/CSS. Ejecútala de inmediato y guarda tu entrega en ENTREGA_DEEPSEEK.md.`;
      notificarSistema('Orquesta: Tarea para DEEPSEEK', 'Nueva partitura asignada. Prompt copiado al portapapeles (Ctrl+V).', prompt);
    }

    // Deteccion de nueva entrega de DEEPSEEK para ANTIGRAVITY
    const fEnt = firma(extraerBloque(deepseekActual.contenido, true));
    if (fEnt && fEnt !== firmaEntregaDeepSeek) {
      firmaEntregaDeepSeek = fEnt;
      const hora = new Date().toLocaleTimeString();
      console.log(`[${hora}] 📦 ¡DEEPSEEK HA REALIZADO UNA ENTREGA!`);
      const prompt = `DeepSeek completó su entrega en ENTREGA_DEEPSEEK.md. Procede a auditar AST, integrar y desplegar.`;
      notificarSistema('Orquesta: Entrega de DEEPSEEK', 'DeepSeek entregó diseño/CSS. Listo para auditoría de Antigravity.', prompt);
    }
    deepseekPrevio = deepseekActual;
  }

  if (ciclo % 30 === 0) {
    const hora = new Date().toLocaleTimeString();
    console.log(`[${hora}] [Ciclo ${ciclo}] Vigilante activo sin novedades.`);
  }
}, INTERVALO_MS);
