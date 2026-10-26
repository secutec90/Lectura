#!/usr/bin/env node
'use strict';
/**
 * manifiesto.js — Arnés de verificación para partir archivos sin cambiar comportamiento.
 *
 * Uso:
 *   node herramientas/manifiesto.js --salida herramientas/manifiesto-antes.json
 *   node herramientas/manifiesto.js --salida herramientas/manifiesto-despues.json
 *   node herramientas/manifiesto.js --comparar herramientas/manifiesto-antes.json herramientas/manifiesto-despues.json
 *
 * Qué hace:
 *   1. Recorre los .gs y .html del proyecto.
 *   2. Extrae cada bloque <script> de los HTML (los scriptlets <?= ?> se neutralizan).
 *   3. Localiza los símbolos de nivel superior (function, const, let, var, class) y
 *      guarda el sha256 de su texto exacto.
 *   4. Localiza las sentencias ejecutables de nivel superior (las que rompen al partir
 *      un <script> en dos bloques y quedan antes de sus dependencias).
 *   5. Detecta nombres definidos en más de un documento (duplicados: el último cargado gana).
 *
 * Comparación: si un corte es puramente mecánico, cada símbolo conserva su hash y solo
 * cambia de documento. Cualquier diferencia de hash es una edición, no un movimiento.
 *
 * Salida: 0 si antes y después son equivalentes; 1 si hay cambios, altas o bajas.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const RAIZ = path.resolve(__dirname, '..');
const DIRS_EXCLUIDOS = new Set([
  '.git', 'node_modules', '.rsc', '.claude', '.antigravity', '.agents',
  '01-TOOLS', '02-DOCS', '_backup'
]);

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

function sha256(texto) {
  return crypto.createHash('sha256').update(texto, 'utf8').digest('hex');
}

function normalizar(texto) {
  return texto
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/, ''))
    .join('\n');
}

function lineaDe(src, indice) {
  let linea = 1;
  for (let i = 0; i < indice && i < src.length; i++) if (src[i] === '\n') linea++;
  return linea;
}

/* ------------------------------------------------------------------ */
/* Enmascarado: deja el mismo número de caracteres, pero los          */
/* comentarios, cadenas, plantillas y regex pasan a espacios. Así el   */
/* escaneo estructural no se confunde con llaves o punto y coma.       */
/* ------------------------------------------------------------------ */

function iniciaRegex(ultimo) {
  if (!ultimo) return true;
  return '(,=:[!&|?{};+-*%~^<>'.indexOf(ultimo) >= 0 || ultimo === '}';
}

function enmascarar(src) {
  const n = src.length;
  const salida = src.split('');
  let i = 0;
  let ultimo = '';

  const borrar = (desde, hasta) => {
    for (let k = desde; k < hasta && k < n; k++) if (salida[k] !== '\n') salida[k] = ' ';
  };

  while (i < n) {
    const c = src[i];
    const dos = src.substr(i, 2);

    if (c === '/' && dos === '//') {
      let j = src.indexOf('\n', i);
      if (j < 0) j = n;
      borrar(i, j);
      i = j;
      continue;
    }
    if (c === '/' && dos === '/*') {
      let j = src.indexOf('*/', i + 2);
      j = j < 0 ? n : j + 2;
      borrar(i, j);
      i = j;
      continue;
    }
    if (c === '/' && iniciaRegex(ultimo)) {
      let j = i + 1;
      let enClase = false;
      while (j < n) {
        const d = src[j];
        if (d === '\\') { j += 2; continue; }
        if (d === '\n') break;
        if (d === '[') enClase = true;
        else if (d === ']') enClase = false;
        else if (d === '/' && !enClase) { j++; break; }
        j++;
      }
      borrar(i, j);
      i = j;
      continue;
    }
    if (c === "'" || c === '"') {
      let j = i + 1;
      while (j < n) {
        const d = src[j];
        if (d === '\\') { j += 2; continue; }
        if (d === c) { j++; break; }
        if (d === '\n') break;
        j++;
      }
      borrar(i + 1, j - 1);
      i = j;
      continue;
    }
    if (c === '`') {
      // Plantilla completa: se enmascara entera, incluidas las interpolaciones.
      let j = i + 1;
      while (j < n) {
        const d = src[j];
        if (d === '\\') { j += 2; continue; }
        if (d === '`') { j++; break; }
        j++;
      }
      borrar(i + 1, j - 1);
      i = j;
      continue;
    }
    if (!/\s/.test(c)) ultimo = c;
    i++;
  }
  return salida.join('');
}

/* ------------------------------------------------------------------ */
/* Escaneo de un documento (un .gs completo o un <script> de un HTML)  */
/* ------------------------------------------------------------------ */

const RE_FUNCION = /^(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/;
const RE_CLASE = /^class\s+([A-Za-z_$][\w$]*)/;
const RE_VAR = /^(const|let|var)\s+([A-Za-z_$][\w$]*)/;

function escanearDocumento(src, idDocumento, lineaBase) {
  const mascara = enmascarar(src);
  const n = src.length;
  const limites = [0];
  let prof = 0;

  for (let i = 0; i < n; i++) {
    const c = mascara[i];
    if (c === '{' || c === '(' || c === '[') { prof++; continue; }
    if (c === '}' || c === ')' || c === ']') {
      prof--;
      if (prof === 0 && c === '}') limites.push(i + 1);
      continue;
    }
    if (c === ';' && prof === 0) limites.push(i + 1);
  }
  limites.push(n);

  const simbolos = {};
  const sentencias = [];
  const vistos = new Set();

  for (let k = 0; k < limites.length - 1; k++) {
    const desde = limites[k];
    const hasta = limites[k + 1];
    if (hasta <= desde) continue;

    // Recortar espacios y comentarios de los extremos usando la máscara.
    let ini = desde;
    while (ini < hasta && /\s/.test(mascara[ini])) ini++;
    let fin = hasta;
    while (fin > ini && /\s/.test(mascara[fin - 1])) fin--;
    if (fin <= ini) continue;

    const texto = src.slice(ini, fin);
    const cabeza = mascara.slice(ini, Math.min(ini + 200, fin)).trim();

    let m;
    let tipo = null;
    let nombre = null;
    if ((m = RE_FUNCION.exec(cabeza))) { tipo = 'function'; nombre = m[1]; }
    else if ((m = RE_CLASE.exec(cabeza))) { tipo = 'class'; nombre = m[1]; }
    else if ((m = RE_VAR.exec(cabeza))) { tipo = m[1]; nombre = m[2]; }

    if (nombre) {
      let clave = nombre;
      if (Object.prototype.hasOwnProperty.call(simbolos, clave) && !vistos.has(clave)) {
        clave = nombre + '@' + lineaDe(src, ini);
      }
      vistos.add(nombre);
      simbolos[clave] = {
        tipo,
        linea: lineaBase + lineaDe(src, ini) - 1,
        hash: sha256(normalizar(texto))
      };
    } else {
      const limpio = normalizar(texto).trim();
      if (limpio.length > 1) {
        sentencias.push({
          linea: lineaBase + lineaDe(src, ini) - 1,
          texto: limpio.replace(/\s+/g, ' ').slice(0, 140),
          hash: sha256(limpio)
        });
      }
    }
  }

  return { id: idDocumento, simbolos, sentencias };
}

/* ------------------------------------------------------------------ */
/* Extracción de bloques <script> de un HTML                           */
/* ------------------------------------------------------------------ */

function escanearHtml(html, rutaRelativa) {
  const documentos = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  let indice = 0;

  while ((m = re.exec(html)) !== null) {
    const atributos = m[1] || '';
    if (/\bsrc\s*=/i.test(atributos)) continue;

    const cuerpoOriginal = m[2];
    const desplazamiento = m.index + m[0].indexOf('>') + 1;
    // Scriptlets de Apps Script -> cadena vacía (misma semántica que el test existente).
    const cuerpo = cuerpoOriginal.replace(/<\?[!=]?[\s\S]*?\?>/g, "''");
    documentos.push(escanearDocumento(cuerpo, rutaRelativa + '#script' + indice, lineaDe(html, desplazamiento)));
    indice++;
  }
  return documentos;
}

/* ------------------------------------------------------------------ */
/* Recorrido                                                           */
/* ------------------------------------------------------------------ */

function recorrer(dir, acc, incluirConstructor) {
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const completo = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      if (DIRS_EXCLUIDOS.has(entrada.name)) continue;
      if (!incluirConstructor && entrada.name === 'constructor') continue;
      recorrer(completo, acc, incluirConstructor);
      continue;
    }
    if (!/\.(gs|html)$/i.test(entrada.name)) continue;
    acc.push(completo);
  }
  return acc;
}

function construirManifiesto(incluirConstructor) {
  const archivos = {};
  const globales = {};

  for (const rutaAbs of recorrer(RAIZ, [], incluirConstructor)) {
    const rel = path.relative(RAIZ, rutaAbs).split(path.sep).join('/');
    const contenido = fs.readFileSync(rutaAbs, 'utf8');
    const documentos = /\.html$/i.test(rutaAbs)
      ? escanearHtml(contenido, rel)
      : [escanearDocumento(contenido, rel, 1)];

    archivos[rel] = { sha256: sha256(contenido), documentos };

    for (const doc of documentos) {
      for (const nombre of Object.keys(doc.simbolos)) {
        const base = nombre.split('@')[0];
        if (!globales[base]) globales[base] = [];
        globales[base].push({
          documento: doc.id,
          hash: doc.simbolos[nombre].hash,
          tipo: doc.simbolos[nombre].tipo
        });
      }
    }
  }

  const duplicados = {};
  for (const [nombre, apariciones] of Object.entries(globales)) {
    if (apariciones.length > 1) duplicados[nombre] = apariciones.map((a) => a.documento);
  }

  let totalSimbolos = 0;
  let totalSentencias = 0;
  for (const archivo of Object.values(archivos)) {
    for (const doc of archivo.documentos) {
      totalSimbolos += Object.keys(doc.simbolos).length;
      totalSentencias += doc.sentencias.length;
    }
  }

  return {
    generado: new Date().toISOString(),
    raiz: RAIZ,
    resumen: {
      archivos: Object.keys(archivos).length,
      documentos: Object.values(archivos).reduce((a, f) => a + f.documentos.length, 0),
      simbolos: totalSimbolos,
      sentencias_superiores: totalSentencias,
      duplicados: Object.keys(duplicados).length
    },
    duplicados,
    archivos
  };
}

/* ------------------------------------------------------------------ */
/* Comparación                                                         */
/* ------------------------------------------------------------------ */

function paresDe(manifiesto) {
  const pares = [];
  for (const [archivo, datos] of Object.entries(manifiesto.archivos)) {
    for (const doc of datos.documentos) {
      for (const [nombre, info] of Object.entries(doc.simbolos)) {
        pares.push({ nombre: nombre.split('@')[0], documento: doc.id, archivo, hash: info.hash, tipo: info.tipo });
      }
    }
  }
  return pares;
}

function comparar(rutaAntes, rutaDespues) {
  const antes = JSON.parse(fs.readFileSync(rutaAntes, 'utf8'));
  const despues = JSON.parse(fs.readFileSync(rutaDespues, 'utf8'));

  const A = paresDe(antes);
  const D = paresDe(despues);

  const porNombreA = new Map();
  for (const p of A) {
    if (!porNombreA.has(p.nombre)) porNombreA.set(p.nombre, []);
    porNombreA.get(p.nombre).push(p);
  }
  const porNombreD = new Map();
  for (const p of D) {
    if (!porNombreD.has(p.nombre)) porNombreD.set(p.nombre, []);
    porNombreD.get(p.nombre).push(p);
  }

  const conservados = [];
  const movidos = [];
  const cambiados = [];
  const eliminados = [];
  const nuevos = [];
  const movidosDocs = [];

  for (const [nombre, listaA] of porNombreA) {
    const listaD = porNombreD.get(nombre);
    if (!listaD) { eliminados.push(nombre); continue; }

    const hashesA = new Set(listaA.map((p) => p.hash));
    const hashesD = new Set(listaD.map((p) => p.hash));

    const iguales = [...hashesA].filter((h) => hashesD.has(h));
    if (iguales.length === hashesA.size && iguales.length === hashesD.size) {
      const docsA = new Set(listaA.map((p) => p.documento));
      const docsD = new Set(listaD.map((p) => p.documento));
      const mismoSitio = [...docsA].every((d) => docsD.has(d));
      if (mismoSitio) conservados.push(nombre);
      else { movidos.push(nombre); movidosDocs.push(nombre + ': ' + [...docsA].join(', ') + ' -> ' + [...docsD].join(', ')); }
    } else {
      cambiados.push(nombre);
    }
  }
  for (const nombre of porNombreD.keys()) if (!porNombreA.has(nombre)) nuevos.push(nombre);

  const sentA = new Map();
  const sentD = new Map();
  const contar = (manifiesto, mapa) => {
    for (const datos of Object.values(manifiesto.archivos)) {
      for (const doc of datos.documentos) {
        for (const s of doc.sentencias) {
          const clave = s.hash;
          mapa.set(clave, (mapa.get(clave) || 0) + 1);
        }
      }
    }
  };
  contar(antes, sentA);
  contar(despues, sentD);
  let sentPerdidas = 0;
  for (const [clave, cuantos] of sentA) {
    if ((sentD.get(clave) || 0) < cuantos) sentPerdidas++;
  }

  const lineas = [];
  lineas.push('================================================================');
  lineas.push('COMPARACIÓN DE MANIFIESTOS');
  lineas.push('================================================================');
  lineas.push('antes : ' + rutaAntes + '  (' + antes.resumen.simbolos + ' símbolos)');
  lineas.push('después: ' + rutaDespues + '  (' + despues.resumen.simbolos + ' símbolos)');
  lineas.push('');
  lineas.push('  conservados (mismo hash, mismo documento) : ' + conservados.length);
  lineas.push('  movidos     (mismo hash, otro documento)  : ' + movidos.length);
  lineas.push('  cambiados   (mismo nombre, otro hash)     : ' + cambiados.length);
  lineas.push('  eliminados                                : ' + eliminados.length);
  lineas.push('  nuevos                                    : ' + nuevos.length);
  lineas.push('  sentencias superiores desaparecidas       : ' + sentPerdidas);
  lineas.push('');

  if (cambiados.length) {
    lineas.push('--- CAMBIADOS (esto NO es un movimiento: es una edición) ---');
    cambiados.slice(0, 200).forEach((n) => lineas.push('  ' + n));
    if (cambiados.length > 200) lineas.push('  ... y ' + (cambiados.length - 200) + ' más');
    lineas.push('');
  }
  if (eliminados.length) {
    lineas.push('--- ELIMINADOS ---');
    eliminados.slice(0, 200).forEach((n) => lineas.push('  ' + n));
    lineas.push('');
  }
  if (nuevos.length) {
    lineas.push('--- NUEVOS ---');
    nuevos.slice(0, 200).forEach((n) => lineas.push('  ' + n));
    lineas.push('');
  }
  if (movidosDocs.length) {
    lineas.push('--- MOVIDOS (primeros 40) ---');
    movidosDocs.slice(0, 40).forEach((n) => lineas.push('  ' + n));
    lineas.push('');
  }

  const ok = cambiados.length === 0 && eliminados.length === 0 && nuevos.length === 0 && sentPerdidas === 0;
  lineas.push('================================================================');
  lineas.push(ok
    ? 'RESULTADO: EQUIVALENTE — el corte no cambió comportamiento.'
    : 'RESULTADO: DIFERENTE — revisa los cambios antes de continuar.');
  lineas.push('================================================================');

  console.log(lineas.join('\n'));
  return ok ? 0 : 1;
}

/* ------------------------------------------------------------------ */
/* CLI                                                                 */
/* ------------------------------------------------------------------ */

function main() {
  const args = process.argv.slice(2);
  const valorDe = (nombre) => {
    const i = args.indexOf(nombre);
    return i >= 0 && args[i + 1] ? args[i + 1] : null;
  };

  if (args.includes('--comparar')) {
    const a = valorDe('--comparar');
    const b = args[args.indexOf('--comparar') + 2];
    if (!a || !b) {
      console.error('Uso: node herramientas/manifiesto.js --comparar ANTES.json DESPUES.json');
      process.exit(2);
    }
    process.exit(comparar(a, b));
  }

  const incluirConstructor = args.includes('--constructor');
  const manifiesto = construirManifiesto(incluirConstructor);
  const salida = valorDe('--salida');

  if (salida) {
    fs.mkdirSync(path.dirname(path.resolve(salida)), { recursive: true });
    fs.writeFileSync(path.resolve(salida), JSON.stringify(manifiesto, null, 2), 'utf8');
  }

  const r = manifiesto.resumen;
  console.log('================================================================');
  console.log('MANIFIESTO DE SÍMBOLOS');
  console.log('================================================================');
  console.log('  archivos                    : ' + r.archivos);
  console.log('  documentos (archivos+script): ' + r.documentos);
  console.log('  símbolos de nivel superior  : ' + r.simbolos);
  console.log('  sentencias ejecutables      : ' + r.sentencias_superiores);
  console.log('  nombres duplicados          : ' + r.duplicados);
  if (salida) console.log('  escrito en                  : ' + path.resolve(salida));
  console.log('');

  const duplicados = Object.entries(manifiesto.duplicados);
  if (duplicados.length) {
    console.log('--- NOMBRES DEFINIDOS EN MÁS DE UN DOCUMENTO (el último cargado gana) ---');
    for (const [nombre, docs] of duplicados.slice(0, 60)) {
      console.log('  ' + nombre.padEnd(38) + ' ' + docs.join(' | '));
    }
    if (duplicados.length > 60) console.log('  ... y ' + (duplicados.length - 60) + ' más (ver JSON)');
    console.log('');
  }

  const conSentencias = [];
  for (const [archivo, datos] of Object.entries(manifiesto.archivos)) {
    for (const doc of datos.documentos) {
      if (doc.sentencias.length) conSentencias.push([doc.id, doc.sentencias.length]);
    }
  }
  if (conSentencias.length) {
    console.log('--- DOCUMENTOS CON CÓDIGO EJECUTABLE DE NIVEL SUPERIOR (riesgo al partir) ---');
    for (const [id, cuantos] of conSentencias) console.log('  ' + String(cuantos).padStart(4) + '  ' + id);
    console.log('');
  }
}

main();
