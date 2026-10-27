const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

console.log('=== INICIANDO SUITE DE PRUEBAS LOCALES H-01 A H-08 ===\n');

// Read source files
const codigoSrc = require("./_cargar_codigo.js")();
const asistenciaSrc = fs.readFileSync('Asistencia.gs', 'utf8');
const claseLogicaSrc = fs.readFileSync('ClaseLogica.gs', 'utf8');

// Mock GAS environment
function createMockContext(opts = {}) {
  const storeProps = Object.assign({
    ENTORNO: opts.entorno || 'PRUEBAS',
    HOJA_ID: opts.hojaId || 'hoja-pruebas-123',
    ADMIN_HASH: 'hash_admin',
    ADMIN_SALT: 'salt_admin'
  }, opts.props || {});

  const sheetsData = opts.sheets || {};
  const cacheData = opts.cache || {};

  const mockSheet = (name) => {
    const data = sheetsData[name] || [];
    return {
      getName: () => name,
      getLastRow: () => data.length,
      getLastColumn: () => (data[0] ? data[0].length : 1),
      getMaxColumns: () => 20,
      insertColumnsAfter: () => {},
      setFrozenRows: () => {},
      setColumnWidth: () => {},
      clearContents: () => {
        data.length = 0;
      },
      appendRow: (row) => {
        data.push(row);
      },
      getRange: (r, c, nr = 1, nc = 1) => ({
        getValues: () => {
          const res = [];
          for (let i = r - 1; i < r - 1 + nr; i++) {
            const row = data[i] || [];
            const sub = [];
            for (let j = c - 1; j < c - 1 + nc; j++) {
              sub.push(row[j] !== undefined ? row[j] : '');
            }
            res.push(sub);
          }
          return res;
        },
        setValues: (vals) => {
          for (let i = 0; i < vals.length; i++) {
            const targetRow = r - 1 + i;
            if (!data[targetRow]) data[targetRow] = [];
            for (let j = 0; j < vals[i].length; j++) {
              data[targetRow][c - 1 + j] = vals[i][j];
            }
          }
        },
        setValue: (val) => {
          const targetRow = r - 1;
          if (!data[targetRow]) data[targetRow] = [];
          data[targetRow][c - 1] = val;
        },
        setFontWeight: () => {},
        setNumberFormat: () => ({ setValue: (v) => {} }),
        setWrap: () => ({ setVerticalAlignment: () => {} })
      })
    };
  };

  const mockLibro = {
    getId: () => opts.idReal || opts.hojaId || 'hoja-pruebas-123',
    getName: () => 'Libro Pruebas ST90',
    getSheetByName: (nom) => (sheetsData[nom] !== undefined ? mockSheet(nom) : null),
    insertSheet: (nom) => {
      sheetsData[nom] = [];
      return mockSheet(nom);
    }
  };

  const context = {
    console,
    Logger: { log: () => {} },
    Utilities: {
      getUuid: () => 'uuid-' + Math.random().toString(36).slice(2, 8),
      formatDate: (d, tz, fmt) => '2026-09-21',
      DigestAlgorithm: { SHA_256: 'SHA_256' },
      Charset: { UTF_8: 'UTF-8' },
      computeDigest: (alg, texto) => Array.from(
        require('crypto').createHash('sha256').update(String(texto), 'utf8').digest()
      ).map(b => (b > 127 ? b - 256 : b))
    },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (k) => storeProps[k] || null,
        setProperty: (k, v) => { storeProps[k] = v; },
        deleteProperty: (k) => { delete storeProps[k]; },
        getProperties: () => storeProps
      })
    },
    CacheService: {
      getScriptCache: () => ({
        get: (k) => cacheData[k] || null,
        put: (k, v) => { cacheData[k] = v; },
        remove: (k) => { delete cacheData[k]; }
      })
    },
    SpreadsheetApp: {
      openById: (id) => mockLibro,
      flush: () => {}
    },
    Session: {
      getScriptTimeZone: () => 'America/Mexico_City'
    },
    ScriptApp: {
      getService: () => ({ getUrl: () => 'https://script.google.com/macros/s/test/exec' })
    },
    LockService: {
      getScriptLock: () => ({
        waitLock: () => {},
        releaseLock: () => {}
      })
    }
  };

  vm.createContext(context);
  vm.runInContext(codigoSrc, context);
  vm.runInContext(asistenciaSrc, context);
  vm.runInContext(claseLogicaSrc, context);
  return { context, storeProps, sheetsData, cacheData };
}

// -------------------------------------------------------------
// TEST 1: H-01 asistenciaContexto padron leakage
// -------------------------------------------------------------
console.log('--- Test H-01: Filtrado seguro en asistenciaContexto() ---');
{
  const sheets = {
    Config: [["Clave", "Valor"]],
    Grupos: [
      ["Grado", "Grupo", "Activo", "Intentos extra", "Turno"],
      ["1", "1a", "SI", 0, "matutino"],
      ["1", "1b", "SI", 0, "matutino"],
      ["2", "2a", "SI", 0, "matutino"]
    ],
    Alumnos: [
      ["Matrícula", "Nombre Completo", "Grado", "Grupo", "Activo", "Intentos extra"],
      ["101", "Alumno 1A", "1", "1a", "SI", 0],
      ["102", "Alumno 1B", "1", "1b", "SI", 0],
      ["201", "Alumno 2A", "2", "2a", "SI", 0]
    ],
    PrefectoGrupos: [
      ["Id prefecto", "Grado", "Grupo", "Turno"],
      ["P_1A", "1", "1a", "matutino"]
    ],
    ApoyoGrupos: [
      ["Id apoyo", "Grado", "Grupo", "Turno"],
      ["AP_1B", "1", "1b", "matutino"]
    ],
    Horarios: [
      ["Id", "Dia", "Turno", "Bloque", "Hora inicio", "Hora fin", "Grado", "Grupo", "Maestro", "Asignatura", "Salon"],
      ["H1", "lunes", "matutino", "1", "07:00", "07:50", "1", "1a", "Maestro 1", "Español", "A1"]
    ]
  };

  const cache = {
    "sesion_token_pref": JSON.stringify({ rol: "prefecto", prefectoId: "P_1A", nombre: "Prefecta A", usuario: "prefa" }),
    "sesion_token_apoyo": JSON.stringify({ rol: "apoyo", apoyoId: "AP_1B", nombre: "Apoyo B", usuario: "apoyob" }),
    "sesion_token_apoyo_vacio": JSON.stringify({ rol: "apoyo", apoyoId: "", nombre: "Apoyo Vacio", usuario: "vacio" }),
    "sesion_token_admin": JSON.stringify({ rol: "admin", nombre: "Admin", usuario: "admin" }),
    "admin_token_admin": "1"
  };

  const { context } = createMockContext({ sheets, cache });

  // 1. Prefecto solo debe ver Alumno 1A
  const resPref = context.asistenciaContexto("token_pref", "2026-09-21");
  assert.strictEqual(resPref.ok, true);
  assert.strictEqual(resPref.grupos.length, 1);
  assert.strictEqual(resPref.grupos[0].grupo, "1a");
  assert.strictEqual(resPref.alumnos.length, 1);
  assert.strictEqual(resPref.alumnos[0].matricula, "101");
  console.log('  ✔ Prefecto asignado a 1A solo recibe alumno de 1A (alumnos recibidos: 1/3)');

  // 2. Apoyo asignado a 1B solo debe ver Alumno 1B
  const resApoyo = context.asistenciaContexto("token_apoyo", "2026-09-21");
  assert.strictEqual(resApoyo.ok, true);
  assert.strictEqual(resApoyo.grupos.length, 1);
  assert.strictEqual(resApoyo.grupos[0].grupo, "1b");
  assert.strictEqual(resApoyo.alumnos.length, 1);
  assert.strictEqual(resApoyo.alumnos[0].matricula, "102");
  console.log('  ✔ Personal de apoyo asignado a 1B solo recibe alumno de 1B (alumnos recibidos: 1/3)');

  // 3. Apoyo sin asignación recibe 0 alumnos y 0 grupos
  const resVacio = context.asistenciaContexto("token_apoyo_vacio", "2026-09-21");
  assert.strictEqual(resVacio.ok, true);
  assert.strictEqual(resVacio.grupos.length, 0);
  assert.strictEqual(resVacio.alumnos.length, 0);
  console.log('  ✔ Personal de apoyo sin asignación recibe 0 grupos y 0 alumnos (fail-closed)');

  // 4. Admin ve todos los grupos y alumnos
  const resAdmin = context.asistenciaContexto("token_admin", "2026-09-21");
  assert.strictEqual(resAdmin.ok, true);
  assert.strictEqual(resAdmin.grupos.length, 3);
  assert.strictEqual(resAdmin.alumnos.length, 3);
  console.log('  ✔ Admin recibe todos los grupos y alumnos asignados al colegio');
}

// -------------------------------------------------------------
// TEST 2: H-02 sembrarPrefectasDemo_
// -------------------------------------------------------------
console.log('\n--- Test H-02: Blindaje de sembrarPrefectasDemo_ ---');
{
  const ID_PROD = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  const sheets = {
    Prefectos: [["Id", "Nombre", "Usuario", "Salt", "Hash", "Activo", "Clave"], ["P1", "Real", "real", "s", "h", "SI", "c"]],
    PrefectoGrupos: [["Id prefecto", "Grado", "Grupo", "Turno"], ["P1", "1", "1a", "matutino"]]
  };

  // 1. Verificar que sembrarPrefectasDemo pública NO existe
  const { context: ctxProd } = createMockContext({
    entorno: 'PRODUCCION',
    idReal: ID_PROD,
    hojaId: ID_PROD,
    sheets
  });

  assert.strictEqual(typeof ctxProd.sembrarPrefectasDemo, 'undefined', 'sembrarPrefectasDemo publica debe ser undefined');
  assert.strictEqual(typeof ctxProd.sembrarPrefectasDemo_, 'function', 'sembrarPrefectasDemo_ privada debe existir');
  console.log('  ✔ sembrarPrefectasDemo ya no es publica en ámbito global (no accesible por google.script.run)');

  // 2. Ejecución sobre producción debe lanzar bloqueo
  let blocked = false;
  try {
    ctxProd.sembrarPrefectasDemo_();
  } catch (e) {
    blocked = true;
    assert(e.message.includes('BLOQUEO DE SEGURIDAD') || e.message.includes('Acceso denegado'));
  }
  assert.strictEqual(blocked, true);
  assert.strictEqual(sheets.Prefectos.length, 2, 'No se deben haber borrado prefectos reales');
  console.log('  ✔ Ejecución sin token sobre libro de producción es bloqueada; nómina intacta');
}

// -------------------------------------------------------------
// TEST 3: H-03 generarAlumnosSimulados_
// -------------------------------------------------------------
console.log('\n--- Test H-03: Blindaje de generarAlumnosSimulados_ ---');
{
  const ID_PROD = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  const sheets = {
    Alumnos: [["Matrícula", "Nombre Completo", "Grado", "Grupo", "Activo", "Intentos extra"], ["999", "Real", "1", "1a", "SI", 0]],
    Grupos: [["Grado", "Grupo", "Activo", "Intentos extra", "Turno"], ["1", "1a", "SI", 0, "matutino"]]
  };

  const { context } = createMockContext({
    entorno: 'PRODUCCION',
    idReal: ID_PROD,
    hojaId: ID_PROD,
    sheets
  });

  assert.strictEqual(typeof context.generarAlumnosSimulados, 'undefined');
  assert.strictEqual(typeof context.generarAlumnosSimulados_, 'function');
  console.log('  ✔ generarAlumnosSimulados ya no es publica en ámbito global');

  let blocked = false;
  try {
    context.generarAlumnosSimulados_();
  } catch (e) {
    blocked = true;
    assert(e.message.includes('BLOQUEO DE SEGURIDAD'));
  }
  assert.strictEqual(blocked, true);
  assert.strictEqual(sheets.Alumnos.length, 2);
  console.log('  ✔ generarAlumnosSimulados_ bloqueado en producción; padrón real intacto');
}

// -------------------------------------------------------------
// TEST 4: H-04 sembrarGrupos_
// -------------------------------------------------------------
console.log('\n--- Test H-04: Blindaje de sembrarGrupos_ ---');
{
  const sheets = {
    Grupos: [
      ["Grado", "Grupo", "Activo", "Intentos extra", "Turno"],
      ["1", "1a", "SI", 0, "matutino"],
      ["2", "2b", "SI", 0, "vespertino"]
    ]
  };

  const { context } = createMockContext({ sheets });
  assert.strictEqual(typeof context.sembrarGrupos, 'undefined');
  assert.strictEqual(typeof context.sembrarGrupos_, 'function');
  console.log('  ✔ sembrarGrupos ya no es publica en ámbito global');

  // Si ya tiene filas >= 2, no debe borrar
  context.sembrarGrupos_();
  assert.strictEqual(sheets.Grupos.length, 3);
  assert.strictEqual(sheets.Grupos[2][1], "2b");
  console.log('  ✔ sembrarGrupos_ respeta grupos existentes y no ejecuta clearContents');
}

// -------------------------------------------------------------
// TEST 5: H-05 completarBancoLecturas_
// -------------------------------------------------------------
console.log('\n--- Test H-05: Blindaje de completarBancoLecturas_ ---');
{
  const ID_PROD = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  const sheets = {
    Lecturas: [
      ["ID Lectura", "Grado", "Asignatura", "Tema", "Texto", "Palabras", "Preguntas JSON", "Activa", "Origen"],
      ["LEC_REAL", "1", "Español", "Lectura Real", "Texto real", 100, "[]", "SI", "REAL"]
    ],
    Preguntas: [["ID Lectura", "Orden", "Enunciado"]]
  };

  const { context } = createMockContext({
    entorno: 'PRODUCCION',
    idReal: ID_PROD,
    hojaId: ID_PROD,
    sheets
  });

  assert.strictEqual(typeof context.completarBancoLecturas, 'undefined');
  assert.strictEqual(typeof context.completarBancoLecturas_, 'function');
  console.log('  ✔ completarBancoLecturas ya no es publica en ámbito global');

  // Intentar forzar en producción no debe borrar la lectura real
  context.completarBancoLecturas_(true);
  assert.strictEqual(sheets.Lecturas.length, 2);
  assert.strictEqual(sheets.Lecturas[1][0], "LEC_REAL");
  console.log('  ✔ completarBancoLecturas_(true) suprime el forzado en producción; lecturas reales intactas');
}

// -------------------------------------------------------------
// TEST 6: H-06 escribirConfig_
// -------------------------------------------------------------
console.log('\n--- Test H-06: Blindaje de escribirConfig_ ---');
{
  const sheets = {
    Config: [["Clave", "Valor"], ["PPM_OBJETIVO", "{}"]]
  };

  const { context } = createMockContext({ sheets });
  assert.strictEqual(typeof context.escribirConfig, 'undefined');
  assert.strictEqual(typeof context.escribirConfig_, 'function');
  console.log('  ✔ escribirConfig ya no es publica en ámbito global');

  // Intentar escribir claves restringidas debe lanzar error explícito
  assert.throws(() => context.escribirConfig_("ADMIN_HASH", "hacked_hash"), /estrictamente restringida/);
  assert.throws(() => context.escribirConfig_("HOJA_ID", "hacked_sheet"), /estrictamente restringida/);
  const clavesConfig = sheets.Config.map(r => r[0]);
  assert(!clavesConfig.includes("ADMIN_HASH"), 'ADMIN_HASH no debe escribirse');
  assert(!clavesConfig.includes("HOJA_ID"), 'HOJA_ID no debe escribirse');
  console.log('  ✔ escribirConfig_ rechaza con error explícito claves sensibles (ADMIN_HASH, HOJA_ID)');

  // Clave permitida debe escribirse
  context.escribirConfig_("INTENTOS_DEFAULT", "3");
  const intentosRow = sheets.Config.find(r => r[0] === "INTENTOS_DEFAULT");
  assert(intentosRow && intentosRow[1] === "3");
  console.log('  ✔ escribirConfig_ permite actualizar claves legítimas (INTENTOS_DEFAULT)');
}

// -------------------------------------------------------------
// TEST 7: H-07 reemplazarPreguntasDeLectura_
// -------------------------------------------------------------
console.log('\n--- Test H-07: Blindaje de reemplazarPreguntasDeLectura_ ---');
{
  const sheets = {
    Preguntas: [
      ["ID Lectura", "Orden", "Enunciado", "Opción 1", "Opción 2", "Opción 3", "Opción 4", "Opción 5", "Opción 6", "Respuesta correcta", "Nivel"],
      ["L1", 1, "P1", "A", "B", "C", "D", "", "", "A", "literal"]
    ]
  };

  const { context } = createMockContext({ sheets });
  assert.strictEqual(typeof context.reemplazarPreguntasDeLectura, 'undefined');
  assert.strictEqual(typeof context.reemplazarPreguntasDeLectura_, 'function');
  console.log('  ✔ reemplazarPreguntasDeLectura ya no es publica en ámbito global');

  let throwsEmpty = false;
  try {
    context.reemplazarPreguntasDeLectura_("");
  } catch (e) {
    throwsEmpty = true;
  }
  assert.strictEqual(throwsEmpty, true);
  console.log('  ✔ reemplazarPreguntasDeLectura_ valida obligatoriedad de id');
}

// -------------------------------------------------------------
// TEST 8: H-08 Identificadores vacíos en ApoyoGrupos
// -------------------------------------------------------------
console.log('\n--- Test H-08: Manejo seguro de identificadores vacíos en ApoyoGrupos ---');
{
  const sheets = {
    Config: [["Clave", "Valor"]],
    Grupos: [["Grado", "Grupo", "Activo", "Intentos extra", "Turno"], ["1", "1a", "SI", 0, "matutino"]],
    Alumnos: [["Matrícula", "Nombre Completo", "Grado", "Grupo", "Activo", "Intentos extra"], ["501", "Alu Secreto", "1", "1a", "SI", 0]],
    ApoyoGrupos: [
      ["Id apoyo", "Grado", "Grupo", "Turno"],
      ["", "1", "1a", "matutino"], // Fila vacía / corrupta sin ID
      ["   ", "1", "1a", "matutino"],
      ["AP_VALIDO", "1", "1a", "matutino"]
    ]
  };

  const cache = {
    "sesion_apoyo_vacio": JSON.stringify({ rol: "apoyo", apoyoId: "", nombre: "Sin ID", usuario: "sinid" }),
    "sesion_apoyo_espacios": JSON.stringify({ rol: "apoyo", apoyoId: "   ", nombre: "Espacios", usuario: "esp" }),
    "sesion_apoyo_valido": JSON.stringify({ rol: "apoyo", apoyoId: "AP_VALIDO", nombre: "Valido", usuario: "val" })
  };

  const { context } = createMockContext({ sheets, cache });

  // 1. panelResumen con apoyoId vacío no debe adquirir el grupo de la fila vacía
  const resVacio = context.panelResumen("apoyo_vacio");
  assert.strictEqual(resVacio.alumnos.length, 0, 'No debe entregar alumnos con apoyoId vacio');
  assert.strictEqual(resVacio.grupos.length, 0, 'No debe entregar grupos con apoyoId vacio');
  console.log('  ✔ panelResumen con apoyoId="" rechaza acceso; filas en blanco no conceden permisos');

  // 2. fichaAlumnoAdmin con apoyoId vacío debe lanzar excepción inmediata
  let fichaRechazada = false;
  try {
    context.fichaAlumnoAdmin("apoyo_vacio", "501");
  } catch (e) {
    fichaRechazada = true;
    assert(e.message.includes('identificador válido'));
  }
  assert.strictEqual(fichaRechazada, true);
  console.log('  ✔ fichaAlumnoAdmin con apoyoId="" lanza error explícito y no entrega datos');

  // 3. Usuario con apoyoId válido sí puede acceder a su grupo asignado
  const resValido = context.panelResumen("apoyo_valido");
  assert.strictEqual(resValido.alumnos.length, 1);
  assert.strictEqual(resValido.alumnos[0].matricula, "501");
  console.log('  ✔ Usuario con apoyoId válido accede legítimamente a sus alumnos');
}

console.log('\n=============================================================');
console.log('✔ TODAS LAS PRUEBAS H-01 A H-08 PASARON EXITOSAMENTE (100%)');
console.log('=============================================================');
