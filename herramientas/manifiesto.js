#!/usr/bin/env node
'use strict';
/**
 * manifiesto.js — Arnés de verificación para partir archivos sin cambiar comportamiento.
 *
 * Usa un parser real (acorn, vendorizado en herramientas/acorn.js) sobre el AST de
 * nivel superior. No es una heurística: cada declaración y cada sentencia sale del
 * árbol de sintaxis, con sus posiciones exactas en el archivo.
 *
 * Uso:
 *   node herramientas/manifiesto.js --salida herramientas/manifiesto-antes.json
 *   node herramientas/manifiesto.js --salida herramientas/manifiesto-despues.json
 *   node herramientas/manifiesto.js --comparar antes.json despues.json
 *
 * Opciones:
 *   --raiz <dir>      raíz a analizar (por defecto, la carpeta padre de herramientas/)
 *   --salida <ruta>   escribe el manifiesto en JSON
 *   --comparar A B    compara dos manifiestos
 *   --constructor     incluye la carpeta constructor/ (por defecto se excluye)
 *
 * Salida 0 = EQUIVALENTE (ningún símbolo cambió de contenido, solo de archivo)
 * Salida 1 = DIFERENTE (hay símbolos cambiados, eliminados o nuevos)
 * Salida 2 = error de uso
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const acorn = require('./acorn.js');

const RAIZ_DEFECTO = path.resolve(__dirname, '..');
const DIRS_EXCLUIDOS = new Set([
  '.git', 'node_modules', '.rsc', '.claude', '.antigravity', '.agents',
  '01-TOOLS', '02-DOCS', '_backup'
]);
const TIPOS_DECLARACION = new Set(['FunctionDeclaration', 'VariableDeclaration', 'ClassDeclaration']);

const sha256 = (texto) => crypto.createHash('sha256').update(texto, 'utf8').digest('hex');
const normalizar = (texto) => texto
  .replace(/\r\n/g, '\n')
  .split('\n')
  .map((l) => l.replace(/[ \t]+$/, ''))
  .join('\n');
const contarSalto = (s, hasta) => {
  let n = 0;
  for (let i = 0; i < hasta && i < s.length; i++) if (s[i] === '\n') n++;
  return n;
};

/* Sustituye los scriptlets de Apps Script por una expresión válida de la MISMA
   longitud, para que las posiciones del AST coincidan con el texto original. */
function neutralizarScriptlets(cuerpo) {
  return cuerpo.replace(/<\?[!=]?[\s\S]*?\?>/g, (m) => "''" + ' '.repeat(Math.max(0, m.length - 2)));
}

function extraerBloques(html, rutaRelativa) {
  const docs = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  let indice = 0;
  while ((m = re.exec(html)) !== null) {
    if (/\bsrc\s*=/i.test(m[1])) continue;
    const desplazamiento = m.index + m[0].indexOf('>') + 1;
    docs.push({
      id: rutaRelativa + '#script' + indice,
      lineaBase: contarSalto(html, desplazamiento) + 1,
      cuerpo: m[2]
    });
    indice++;
  }
  return docs;
}

function analizarDocumento(doc) {
  const limpio = neutralizarScriptlets(doc.cuerpo);
  let ast;
  try {
    ast = acorn.parse(limpio, {
      ecmaVersion: 2022,
      sourceType: 'script',
      allowReturnOutsideFunction: true,
      allowAwaitOutsideFunction: true
    });
  } catch (e) {
    return { id: doc.id, error: e.message, simbolos: {}, sentencias: [] };
  }

  const simbolos = {};
  const sentencias = [];
  const vistos = new Set();

  const registrar = (nombre, tipo, nodo) => {
    let clave = nombre;
    if (vistos.has(nombre)) clave = nombre + '@' + (doc.lineaBase + contarSalto(limpio, nodo.start));
    vistos.add(nombre);
    simbolos[clave] = {
      tipo,
      linea: doc.lineaBase + contarSalto(limpio, nodo.start),
      hash: sha256(normalizar(doc.cuerpo.slice(nodo.start, nodo.end)))
    };
  };

  for (const nodo of ast.body) {
    if (nodo.type === 'FunctionDeclaration' && nodo.id) {
      registrar(nodo.id.name, 'function', nodo);
    } else if (nodo.type === 'ClassDeclaration' && nodo.id) {
      registrar(nodo.id.name, 'class', nodo);
    } else if (nodo.type === 'VariableDeclaration') {
      for (const d of nodo.declarations) {
        if (d.id && d.id.type === 'Identifier') registrar(d.id.name, nodo.kind, nodo);
      }
    } else {
      const texto = normalizar(doc.cuerpo.slice(nodo.start, nodo.end)).trim();
      if (texto) {
        sentencias.push({
          linea: doc.lineaBase + contarSalto(limpio, nodo.start),
          tipo: nodo.type,
          texto: texto.replace(/\s+/g, ' ').slice(0, 140),
          hash: sha256(texto)
        });
      }
    }
  }

  return { id: doc.id, simbolos, sentencias };
}

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

function construirManifiesto(raiz, incluirConstructor) {
  const archivos = {};
  const globales = {};
  let documentosConError = 0;

  for (const rutaAbs of recorrer(raiz, [], incluirConstructor)) {
    const rel = path.relative(raiz, rutaAbs).split(path.sep).join('/');
    const contenido = fs.readFileSync(rutaAbs, 'utf8');
    const documentos = /\.html$/i.test(rutaAbs)
      ? extraerBloques(contenido, rel).map(analizarDocumento)
      : [analizarDocumento({ id: rel, lineaBase: 1, cuerpo: contenido })];

    documentos.forEach((d) => { if (d.error) documentosConError++; });
    archivos[rel] = { sha256: sha256(contenido), documentos };

    for (const doc of documentos) {
      for (const [clave, info] of Object.entries(doc.simbolos)) {
        const base = clave.split('@')[0];
        if (!globales[base]) globales[base] = [];
        globales[base].push({ documento: doc.id, hash: info.hash, tipo: info.tipo });
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
    motor: 'acorn ' + (acorn.version || ''),
    raiz,
    resumen: {
      archivos: Object.keys(archivos).length,
      documentos: Object.values(archivos).reduce((a, f) => a + f.documentos.length, 0),
      simbolos: totalSimbolos,
      sentencias_superiores: totalSentencias,
      duplicados: Object.keys(duplicados).length,
      documentos_con_error: documentosConError
    },
    duplicados,
    archivos
  };
}

function paresDe(manifiesto) {
  const pares = [];
  for (const datos of Object.values(manifiesto.archivos)) {
    for (const doc of datos.documentos) {
      for (const [clave, info] of Object.entries(doc.simbolos)) {
        pares.push({ nombre: clave.split('@')[0], documento: doc.id, hash: info.hash, tipo: info.tipo });
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

  const agrupar = (pares) => {
    const m = new Map();
    for (const p of pares) {
      if (!m.has(p.nombre)) m.set(p.nombre, []);
      m.get(p.nombre).push(p);
    }
    return m;
  };
  const porNombreA = agrupar(A);
  const porNombreD = agrupar(D);

  const conservados = [], movidos = [], cambiados = [], eliminados = [], nuevos = [], detalleMovidos = [];

  for (const [nombre, listaA] of porNombreA) {
    const listaD = porNombreD.get(nombre);
    if (!listaD) { eliminados.push(nombre); continue; }
    const hashesA = new Set(listaA.map((p) => p.hash));
    const hashesD = new Set(listaD.map((p) => p.hash));
    const comunes = [...hashesA].filter((h) => hashesD.has(h));
    if (comunes.length === hashesA.size && comunes.length === hashesD.size) {
      const docsA = new Set(listaA.map((p) => p.documento));
      const docsD = new Set(listaD.map((p) => p.documento));
      if ([...docsA].every((d) => docsD.has(d))) conservados.push(nombre);
      else { movidos.push(nombre); detalleMovidos.push(nombre + ': ' + [...docsA].join(', ') + ' -> ' + [...docsD].join(', ')); }
    } else {
      cambiados.push(nombre);
    }
  }
  for (const nombre of porNombreD.keys()) if (!porNombreA.has(nombre)) nuevos.push(nombre);

  const sentA = new Map(), sentD = new Map();
  const contar = (manifiesto, mapa) => {
    for (const datos of Object.values(manifiesto.archivos)) {
      for (const doc of datos.documentos) {
        for (const s of doc.sentencias) mapa.set(s.hash, (mapa.get(s.hash) || 0) + 1);
      }
    }
  };
  contar(antes, sentA);
  contar(despues, sentD);
  let sentPerdidas = 0;
  for (const [clave, cuantos] of sentA) if ((sentD.get(clave) || 0) < cuantos) sentPerdidas++;

  const lineas = [];
  lineas.push('================================================================');
  lineas.push('COMPARACIÓN DE MANIFIESTOS (acorn)');
  lineas.push('================================================================');
  lineas.push('antes  : ' + rutaAntes + '  (' + antes.resumen.simbolos + ' símbolos)');
  lineas.push('después: ' + rutaDespues + '  (' + despues.resumen.simbolos + ' símbolos)');
  if (antes.resumen.documentos_con_error || despues.resumen.documentos_con_error) {
    lineas.push('AVISO  : documentos sin parsear -> antes ' + antes.resumen.documentos_con_error + ', después ' + despues.resumen.documentos_con_error);
  }
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
  if (detalleMovidos.length) {
    lineas.push('--- MOVIDOS (primeros 40) ---');
    detalleMovidos.slice(0, 40).forEach((n) => lineas.push('  ' + n));
    lineas.push('');
  }

  const ok = cambiados.length === 0 && eliminados.length === 0 && nuevos.length === 0 && sentPerdidas === 0;
  lineas.push('================================================================');
  lineas.push(ok ? 'RESULTADO: EQUIVALENTE — el corte no cambió comportamiento.'
    : 'RESULTADO: DIFERENTE — revisa los cambios antes de continuar.');
  lineas.push('================================================================');
  console.log(lineas.join('\n'));
  return ok ? 0 : 1;
}

function main() {
  const args = process.argv.slice(2);
  const valorDe = (nombre) => {
    const i = args.indexOf(nombre);
    return i >= 0 && args[i + 1] ? args[i + 1] : null;
  };

  if (args.includes('--comparar')) {
    const i = args.indexOf('--comparar');
    const a = args[i + 1], b = args[i + 2];
    if (!a || !b) { console.error('Uso: --comparar ANTES.json DESPUES.json'); process.exit(2); }
    process.exit(comparar(a, b));
  }

  const raiz = valorDe('--raiz') ? path.resolve(valorDe('--raiz')) : RAIZ_DEFECTO;
  const manifiesto = construirManifiesto(raiz, args.includes('--constructor'));
  const salida = valorDe('--salida');
  if (salida) {
    fs.mkdirSync(path.dirname(path.resolve(salida)), { recursive: true });
    fs.writeFileSync(path.resolve(salida), JSON.stringify(manifiesto, null, 2), 'utf8');
  }

  const r = manifiesto.resumen;
  console.log('================================================================');
  console.log('MANIFIESTO DE SÍMBOLOS — ' + manifiesto.motor);
  console.log('================================================================');
  console.log('  raíz                        : ' + manifiesto.raiz);
  console.log('  archivos                    : ' + r.archivos);
  console.log('  documentos (archivos+script): ' + r.documentos);
  console.log('  símbolos de nivel superior  : ' + r.simbolos);
  console.log('  sentencias ejecutables      : ' + r.sentencias_superiores);
  console.log('  nombres duplicados          : ' + r.duplicados);
  console.log('  documentos sin parsear      : ' + r.documentos_con_error);
  if (salida) console.log('  escrito en                  : ' + path.resolve(salida));
  console.log('');

  const duplicados = Object.entries(manifiesto.duplicados);
  if (duplicados.length) {
    console.log('--- NOMBRES DEFINIDOS EN MÁS DE UN DOCUMENTO (el último cargado gana) ---');
    for (const [nombre, docs] of duplicados.slice(0, 40)) {
      console.log('  ' + nombre.padEnd(38) + ' ' + docs.join(' | '));
    }
    if (duplicados.length > 40) console.log('  ... y ' + (duplicados.length - 40) + ' más (ver JSON)');
    console.log('');
  }

  const conSentencias = [];
  for (const datos of Object.values(manifiesto.archivos)) {
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
