/**
 * Suite base de verificación y regresión para proyectos nuevos.
 * Se ejecuta localmente con: node .rsc/test_regresion.js
 * Retorna código 0 si todo está en orden; código 1 si hay errores de sintaxis o contratos rotos.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const raiz = path.join(__dirname, '..');
let errores = 0;
let pruebas = 0;

function assert(condicion, mensaje) {
  pruebas++;
  if (condicion) {
    console.log(`  ✅ [OK] ${mensaje}`);
  } else {
    errores++;
    console.error(`  ❌ [ERROR] ${mensaje}`);
  }
}

console.log('🔍 Iniciando verificación de salud del proyecto...\n');

// 1. Verificar existencia de contratos y bitácoras
console.log('📋 Comprobando contratos de gobernanza:');
assert(fs.existsSync(path.join(raiz, 'ESTADO_COORDINACION.md')), 'ESTADO_COORDINACION.md está presente en la raíz');
assert(fs.existsSync(path.join(raiz, 'CONTROL_CAMBIOS.md')), 'CONTROL_CAMBIOS.md está presente en la raíz');
assert(fs.existsSync(path.join(raiz, '.cursor/rules/control-cambios.mdc')), 'Regla de Cursor control-cambios.mdc existe');

// 2. Comprobar sintaxis de archivos JavaScript / Apps Script
console.log('\n⚙️ Comprobando sintaxis de scripts locales:');
const archivos = fs.readdirSync(raiz).filter((f) => /\.(js|gs)$/.test(f));

if (archivos.length === 0) {
  console.log('  ℹ️  No hay archivos de código .js/.gs en la raíz todavía.');
} else {
  archivos.forEach((archivo) => {
    const ruta = path.join(raiz, archivo);
    try {
      // Si es .gs, copiamos a temporal .js para node --check
      const tempPath = path.join(__dirname, `_temp_${archivo}.js`);
      fs.copyFileSync(ruta, tempPath);
      execSync(`node --check "${tempPath}"`, { stdio: 'pipe' });
      fs.unlinkSync(tempPath);
      assert(true, `Sintaxis correcta en ${archivo}`);
    } catch (e) {
      assert(false, `Error de sintaxis en ${archivo}: ${e.message.split('\n')[0]}`);
    }
  });
}

// 3. Resumen final
console.log('\n' + '─'.repeat(50));
if (errores === 0) {
  console.log(`🎉 Todas las pruebas pasaron con éxito (${pruebas}/${pruebas}). Código limpio y listo para commit.`);
  process.exit(0);
} else {
  console.error(`🚨 Se detectaron ${errores} fallas en la auditoría. Corrige los errores antes de hacer push.`);
  process.exit(1);
}
