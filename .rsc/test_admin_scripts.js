const fs = require('fs');
const vm = require('vm');

let admin = fs.readFileSync('Admin.html', 'utf8');

function include(name) {
  const filename = name.endsWith('.html') ? name : name + '.html';
  if (fs.existsSync(filename)) return fs.readFileSync(filename, 'utf8');
  return '';
}

admin = admin.replace(/<\?!=\s*include\('([^']+)'\)\s*\?>/g, (m, p1) => include(p1));
admin = admin.replace(/<\?!=[\s\S]*?\?>/g, '""');
admin = admin.replace(/<\?=[\s\S]*?\?>/g, '""');
admin = admin.replace(/<\?[\s\S]*?\?>/g, '');

const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let m;
let idx = 0;
while ((m = scriptRegex.exec(admin)) !== null) {
  idx++;
  const code = m[1];
  try {
    vm.compileFunction(code);
    console.log(`Script ${idx} (len: ${code.length}): OK`);
  } catch(err) {
    console.error(`Script ${idx} (len: ${code.length}) ERROR:`, err.message);
    console.error(err.stack);
  }
}
