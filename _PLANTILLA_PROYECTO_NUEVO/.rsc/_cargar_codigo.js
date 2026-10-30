// Cargador de compatibilidad y simulación de backend para pruebas locales en Node.js.
// Lee y concatena en memoria los módulos de código de la raíz para evaluarlos sin desplegar a producción.
const fs = require('fs');
const path = require('path');

module.exports = function cargarCodigo(patronRegex = /^\d\d_.+\.(gs|js)$/) {
  const raiz = path.join(__dirname, '..');
  const archivos = fs.readdirSync(raiz)
    .filter((f) => patronRegex.test(f))
    .sort();

  if (!archivos.length) {
    // Si no hay archivos numerados, busca un archivo principal o index
    const candidato = ['Codigo.gs', 'backend.js', 'app.js', 'server.js']
      .map((n) => path.join(raiz, n))
      .find((p) => fs.existsSync(p));
    if (candidato) return fs.readFileSync(candidato, 'utf8');
    return '// Sin módulos de backend detectados aún';
  }

  return archivos.map((f) => fs.readFileSync(path.join(raiz, f), 'utf8')).join('\n');
};
