// Cargador de compatibilidad del backend para las suites de .rsc.
// Antes el proyecto tenía un único Codigo.gs; ahora son módulos 00_..14_.
// Si existe Codigo.gs se usa tal cual; si no, se concatenan los módulos en
// orden alfabético, que reproduce exactamente el archivo original.
const fs = require('fs');
const path = require('path');

module.exports = function cargarCodigo() {
  const raiz = path.join(__dirname, '..');
  const directo = path.join(raiz, 'Codigo.gs');
  if (fs.existsSync(directo)) return fs.readFileSync(directo, 'utf8');
  const modulos = fs.readdirSync(raiz)
    .filter((f) => /^\d\d_.+\.gs$/.test(f))
    .sort();
  if (!modulos.length) throw new Error('No se encontró Codigo.gs ni módulos numerados');
  return modulos.map((f) => fs.readFileSync(path.join(raiz, f), 'utf8')).join('\n');
};
