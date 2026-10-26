const fs = require("fs");
const path = require("path");
const vm = require("vm");

console.log("=== INICIANDO VALIDACIÓN DE PUNTOS A, B Y C (ST90) ===");

// 1. Verificación de Sintaxis
const files = ["Codigo.gs", "Asistencia.gs", "ClaseLogica.gs"];
files.forEach(f => {
  const p = path.join(__dirname, "..", f);
  const code = fs.readFileSync(p, "utf8");
  try {
    new vm.Script(code, { filename: f });
    console.log(`[SYNTAX OK] ${f}`);
  } catch (err) {
    console.error(`[SYNTAX ERROR] ${f}:`, err);
    process.exit(1);
  }
});

// Emulador para pruebas
function crearEmulador(opts = {}) {
  const ID_PROD = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  const ID_TEST = "1TEST_BOOK_AUTHORIZED_999999999999999";
  
  const entorno = opts.entorno || "PRUEBAS";
  const hojaId = opts.hojaId || (entorno === "PRODUCCION" ? ID_PROD : ID_TEST);
  const realId = opts.realId || hojaId;

  const scriptProperties = {
    ENTORNO: entorno,
    HOJA_ID: hojaId,
    CLAVE_ADMIN_HASH: "mock_hash_admin",
    CLAVE_ADMIN_SALT: "mock_salt_admin",
    CLAVE_ADMIN_ES_DEFAULT: "0"
  };

  const cacheStore = { ...opts.initialCache };
  const sheets = opts.initialSheets || {};

  function makeSheet(name, initialData = []) {
    let data = JSON.parse(JSON.stringify(initialData));
    let clearContentsCount = 0;
    return {
      name,
      get _data() { return data; },
      get _clearCount() { return clearContentsCount; },
      getLastRow: () => data.length,
      getLastColumn: () => (data[0] ? data[0].length : 0),
      clearContents: function() {
        clearContentsCount++;
        data = [];
      },
      appendRow: function(row) {
        data.push([...row]);
      },
      setName: function(newName) {
        name = newName;
      },
      setFrozenRows: function() { return this; },
      setFrozenColumns: function() { return this; },
      autoResizeColumns: function() { return this; },
      setColumnWidth: function() { return this; },
      setRowHeight: function() { return this; },
      getMaxRows: function() { return 1000; },
      getMaxColumns: function() { return 50; },
      deleteRows: function() { return this; },
      deleteColumns: function() { return this; },
      deleteRow: function(idx) { if (idx > 0 && idx <= data.length) data.splice(idx - 1, 1); },
      getRange: function(row, col, numRows, numCols) {
        return {
          getValues: function() {
            const res = [];
            for (let r = 0; r < (numRows || 1); r++) {
              const filaIdx = row - 1 + r;
              const fila = data[filaIdx] || [];
              const filaRes = [];
              for (let c = 0; c < (numCols || 1); c++) {
                const colIdx = col - 1 + c;
                filaRes.push(fila[colIdx] !== undefined ? fila[colIdx] : "");
              }
              res.push(filaRes);
            }
            return res;
          },
          setValue: function(val) {
            while (data.length < row) data.push([]);
            const fila = data[row - 1];
            while (fila.length < col) fila.push("");
            fila[col - 1] = val;
            return this;
          },
          setValues: function(vals) {
            for (let r = 0; r < vals.length; r++) {
              const filaIdx = row - 1 + r;
              while (data.length <= filaIdx) data.push([]);
              const fila = data[filaIdx];
              for (let c = 0; c < vals[r].length; c++) {
                const colIdx = col - 1 + c;
                while (fila.length <= colIdx) fila.push("");
                fila[colIdx] = vals[r][c];
              }
            }
            return this;
          },
          setFontWeight: function() { return this; },
          setBackground: function() { return this; },
          setFontColor: function() { return this; },
          setHorizontalAlignment: function() { return this; },
          setVerticalAlignment: function() { return this; },
          setWrap: function() { return this; },
          setBorder: function() { return this; }
        };
      }
    };
  }

  // Pre-crear hojas
  const bookSheets = {};
  for (const [sName, sData] of Object.entries(sheets)) {
    bookSheets[sName] = makeSheet(sName, sData);
  }

  const mockLibro = {
    getId: () => realId,
    getSheetByName: (n) => bookSheets[n] || null,
    insertSheet: (n) => {
      if (!bookSheets[n]) bookSheets[n] = makeSheet(n, []);
      return bookSheets[n];
    }
  };

  const sandbox = {
    console,
    Math,
    Date,
    JSON,
    String,
    Number,
    Boolean,
    RegExp,
    Array,
    Object,
    Error,
    TypeError,
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (k) => scriptProperties[k] || null,
        setProperty: (k, v) => { scriptProperties[k] = String(v); },
        setProperties: (obj) => { Object.assign(scriptProperties, obj); },
        deleteProperty: (k) => { delete scriptProperties[k]; }
      })
    },
    SpreadsheetApp: {
      openById: (id) => mockLibro,
      getActiveSpreadsheet: () => mockLibro,
      flush: () => {}
    },
    CacheService: {
      getScriptCache: () => ({
        get: (k) => cacheStore[k] || null,
        put: (k, v) => { cacheStore[k] = String(v); },
        remove: (k) => { delete cacheStore[k]; }
      })
    },
    LockService: {
      getScriptLock: () => ({
        waitLock: () => true,
        releaseLock: () => true
      })
    },
    Utilities: {
      getUuid: () => "uuid-" + Math.random().toString(36).substring(2, 10),
      computeDigest: () => [1, 2, 3],
      formatDate: () => "2026-10-16",
      Charset: { UTF_8: "utf-8" },
      DigestAlgorithm: { SHA_256: "sha-256" }
    },
    Session: {
      getScriptTimeZone: () => "America/Mexico_City"
    },
    Logger: {
      log: () => {}
    }
  };

  const ctx = vm.createContext(sandbox);

  // Cargar archivos en contexto
  const codigoSrc = fs.readFileSync(path.join(__dirname, "..", "Codigo.gs"), "utf8");
  const asistenciaSrc = fs.readFileSync(path.join(__dirname, "..", "Asistencia.gs"), "utf8");
  const claseLogicaSrc = fs.readFileSync(path.join(__dirname, "..", "ClaseLogica.gs"), "utf8");
  
  vm.runInContext(codigoSrc, ctx);
  vm.runInContext(asistenciaSrc, ctx);
  vm.runInContext(claseLogicaSrc, ctx);

  return { ctx, eval: (code) => vm.runInContext(code, ctx), mockLibro, bookSheets, scriptProperties, cacheStore };
}

// ==========================================
// PRUEBAS PUNTO A: sembrarPrefectasDemo_(token)
// ==========================================
console.log("\n--- PRUEBAS PUNTO A: sembrarPrefectasDemo_ ---");

// Test A1: Ejecución con token admin en PRODUCCION -> DEBE RECHAZARSE
{
  const { eval: run, cacheStore } = crearEmulador({ entorno: "PRODUCCION", hojaId: "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU" });
  cacheStore["sesion_admin_token_123"] = JSON.stringify({ rol: "admin", nombre: "Admin", usuario: "admin" });
  
  try {
    run('sembrarPrefectasDemo_("admin_token_123")');
    console.error("FAIL A1: Debería haber lanzado error al ejecutar con token admin en PRODUCCION");
    process.exit(1);
  } catch (e) {
    if (e.message.includes("estrictamente restringida a ENTORNO=PRUEBAS") || e.message.includes("no puede ejecutarse sobre el libro de producción")) {
      console.log("PASS A1: Token admin rechazado en PRODUCCION -> " + e.message);
    } else {
      console.error("FAIL A1: Error inesperado:", e.message);
      process.exit(1);
    }
  }
}

// Test A2: Ejecución con token admin pero ID real es de PRODUCCION -> DEBE RECHAZARSE
{
  const { eval: run, cacheStore } = crearEmulador({
    entorno: "PRUEBAS",
    hojaId: "1TEST_BOOK_AUTHORIZED_999999999999999",
    realId: "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU"
  });
  cacheStore["sesion_admin_token_123"] = JSON.stringify({ rol: "admin", nombre: "Admin", usuario: "admin" });
  
  try {
    run('sembrarPrefectasDemo_("admin_token_123")');
    console.error("FAIL A2: Debería haber lanzado error al coincidir ID real con PRODUCCION");
    process.exit(1);
  } catch (e) {
    if (e.message.includes("no puede ejecutarse sobre el libro de producción")) {
      console.log("PASS A2: Token admin rechazado cuando libro real es PRODUCCION -> " + e.message);
    } else {
      console.error("FAIL A2: Error inesperado:", e.message);
      process.exit(1);
    }
  }
}

// Test A3: Ejecución con token admin pero ID real no coincide con HOJA_ID -> DEBE RECHAZARSE
{
  const { eval: run, cacheStore } = crearEmulador({
    entorno: "PRUEBAS",
    hojaId: "1TEST_BOOK_AUTHORIZED_999999999999999",
    realId: "1TEST_BOOK_OTHER_DIFFERENT"
  });
  cacheStore["sesion_admin_token_123"] = JSON.stringify({ rol: "admin", nombre: "Admin", usuario: "admin" });
  
  try {
    run('sembrarPrefectasDemo_("admin_token_123")');
    console.error("FAIL A3: Debería haber lanzado error cuando ID real no coincide con HOJA_ID");
    process.exit(1);
  } catch (e) {
    if (e.message.includes("no coincide con el libro de pruebas configurado")) {
      console.log("PASS A3: Token admin rechazado cuando libro real != HOJA_ID -> " + e.message);
    } else {
      console.error("FAIL A3: Error inesperado:", e.message);
      process.exit(1);
    }
  }
}

// Test A4: Ejecución sin token en PRODUCCION -> DEBE RECHAZARSE
{
  const { eval: run } = crearEmulador({ entorno: "PRODUCCION", hojaId: "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU" });
  try {
    run('sembrarPrefectasDemo_()');
    console.error("FAIL A4: Debería haber lanzado error sin token en PRODUCCION");
    process.exit(1);
  } catch (e) {
    console.log("PASS A4: Ejecución sin token rechazada en PRODUCCION -> " + e.message);
  }
}

// Test A5: Ejecución autorizada en PRUEBAS (con token admin y sin token) -> DEBE FUNCIONAR
{
  const { eval: run, bookSheets, cacheStore } = crearEmulador({
    entorno: "PRUEBAS",
    hojaId: "1TEST_BOOK_AUTHORIZED_999999999999999",
    realId: "1TEST_BOOK_AUTHORIZED_999999999999999",
    initialSheets: {
      Prefectos: [["Id", "Nombre", "Usuario", "Salt", "Hash", "Activo"]],
      PrefectoGrupos: [["IdPrefecto", "Grupo", "Turno"]]
    }
  });
  cacheStore["sesion_admin_token_123"] = JSON.stringify({ rol: "admin", nombre: "Admin", usuario: "admin" });

  const resConToken = run('sembrarPrefectasDemo_("admin_token_123")');
  console.log(`PASS A5a: Ejecución con token admin en PRUEBAS exitosa (creadas: ${resConToken.creadas})`);

  const resSinToken = run('sembrarPrefectasDemo_()');
  console.log(`PASS A5b: Ejecución sin token en PRUEBAS autorizada exitosa (creadas: ${resSinToken.creadas})`);
}

// ==========================================
// PRUEBAS PUNTO B: completarBancoLecturas_(forzar)
// ==========================================
console.log("\n--- PRUEBAS PUNTO B: completarBancoLecturas_ ---");

// Test B1: En PRODUCCION con forzar=true -> NO debe borrar Preguntas ni Lecturas
{
  const encLec = ["ID Lectura", "Grado", "Asignatura", "Tema", "Texto", "Palabras", "Preguntas JSON", "Activa", "Origen"];
  const encPreg = ["ID Lectura", "Orden", "Enunciado", "Opción 1", "Opción 2", "Opción 3", "Opción 4", "Opción 5", "Opción 6", "Respuesta correcta", "Nivel"];
  
  const datosLecProd = [
    encLec,
    ["LEC_PROD_01", "1", "Español", "Tema Prod", "Texto largo...", 20, "[]", "SI", "DOCENTE"]
  ];
  const datosPregProd = [
    encPreg,
    ["LEC_PROD_01", 1, "¿Pregunta prod 1?", "A", "B", "C", "D", "", "", "A", "Literal"]
  ];

  const { eval: run, bookSheets } = crearEmulador({
    entorno: "PRODUCCION",
    hojaId: "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU",
    realId: "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU",
    initialSheets: {
      Lecturas: datosLecProd,
      Preguntas: datosPregProd
    }
  });

  // Ejecutar con forzar = true en producción
  run('completarBancoLecturas_(true)');

  const pLec = bookSheets["Lecturas"];
  const pPreg = bookSheets["Preguntas"];

  if (pLec._clearCount > 0 || pPreg._clearCount > 0) {
    console.error("FAIL B1: clearContents fue llamado en PRODUCCION!");
    process.exit(1);
  }

  // Verificar que la lectura original de producción se conservó
  const filasLec = pLec._data;
  const originalLec = filasLec.find(f => f[0] === "LEC_PROD_01");
  if (!originalLec) {
    console.error("FAIL B1: La lectura original de producción fue eliminada!");
    process.exit(1);
  }

  // Verificar que la pregunta original de producción se conservó
  const filasPreg = pPreg._data;
  const originalPreg = filasPreg.find(f => f[0] === "LEC_PROD_01" && f[1] == 1);
  if (!originalPreg) {
    console.error("FAIL B1: La pregunta original de producción fue eliminada!");
    process.exit(1);
  }

  console.log("PASS B1: En PRODUCCION con forzar=true NO se borró Lecturas ni Preguntas (clearCount = 0) y los registros existentes se preservaron");
}

// Test B2: Flujo ordinario (forzar = false) inicializa banco cuando está vacío sin clearContents y preserva Preguntas
{
  const encLec = ["ID Lectura", "Grado", "Asignatura", "Tema", "Texto", "Palabras", "Preguntas JSON", "Activa", "Origen"];
  const encPreg = ["ID Lectura", "Orden", "Enunciado", "Opción 1", "Opción 2", "Opción 3", "Opción 4", "Opción 5", "Opción 6", "Respuesta correcta", "Nivel"];
  
  const datosLec = [encLec]; // Solo encabezado
  const datosPreg = [
    encPreg,
    ["PREGUNTA_PREVIA_CONSERVADA", 1, "¿Enunciado previo?", "A", "B", "C", "D", "", "", "A", "Literal"]
  ];

  const { eval: run, bookSheets } = crearEmulador({
    entorno: "PRUEBAS",
    hojaId: "1TEST_BOOK_AUTHORIZED_999999999999999",
    initialSheets: {
      Lecturas: datosLec,
      Preguntas: datosPreg
    }
  });

  run('completarBancoLecturas_(false)');

  const pLec = bookSheets["Lecturas"];
  const pPreg = bookSheets["Preguntas"];

  if (pLec._clearCount > 0 || pPreg._clearCount > 0) {
    console.error("FAIL B2: clearContents fue llamado en flujo ordinario no forzado!");
    process.exit(1);
  }

  // Comprobar que la pregunta previa en Preguntas se conservó
  const pregPrevia = pPreg._data.find(f => f[0] === "PREGUNTA_PREVIA_CONSERVADA");
  if (!pregPrevia) {
    console.error("FAIL B2: La pregunta previa en Preguntas fue eliminada!");
    process.exit(1);
  }

  // Comprobar que se poblaron las 18 lecturas por defecto
  const totalLec = pLec._data.length - 1; // sin encabezado
  if (totalLec !== 18) { // 3 grados * 6 asignaturas = 18
    console.error(`FAIL B2: Total de lecturas esperado 18, obtenido ${totalLec}`);
    process.exit(1);
  }

  // Segunda llamada con lecturas existentes: debe retornar de inmediato sin modificar
  run('completarBancoLecturas_(false)');
  if (pLec._data.length - 1 !== 18) {
    console.error("FAIL B2: Segunda llamada modificó lecturas existentes!");
    process.exit(1);
  }

  console.log(`PASS B2: Flujo ordinario completó lecturas sin borrado (clearCount = 0), preservó Preguntas existentes y respetó lecturas existentes (Total: ${totalLec})`);
}

// Test B3: Reconstrucción forzada en entorno de pruebas autorizado sí funciona
{
  const encLec = ["ID Lectura", "Grado", "Asignatura", "Tema", "Texto", "Palabras", "Preguntas JSON", "Activa", "Origen"];
  const encPreg = ["ID Lectura", "Orden", "Enunciado", "Opción 1", "Opción 2", "Opción 3", "Opción 4", "Opción 5", "Opción 6", "Respuesta correcta", "Nivel"];
  
  const { eval: run, bookSheets } = crearEmulador({
    entorno: "PRUEBAS",
    hojaId: "1TEST_BOOK_AUTHORIZED_999999999999999",
    realId: "1TEST_BOOK_AUTHORIZED_999999999999999",
    initialSheets: {
      Lecturas: [encLec, ["BASURA_VIEJA", "1", "Esp", "x", "y", 1, "[]", "SI", "x"]],
      Preguntas: [encPreg]
    }
  });

  run('completarBancoLecturas_(true)');
  const pLec = bookSheets["Lecturas"];
  const basura = pLec._data.find(f => f[0] === "BASURA_VIEJA");
  if (basura) {
    console.error("FAIL B3: En pruebas autorizado con forzar=true debía reconstruir limpiamente!");
    process.exit(1);
  }
  console.log("PASS B3: Reconstrucción forzada autorizada en PRUEBAS ejecutada correctamente");
}

// Test B4: migrarLecturasSiEsAntiguo() llama completarBancoLecturas_(false) sin borrar Preguntas
{
  const encLecViejo = ["EncabezadoViejo", "Col2"];
  const encPreg = ["ID Lectura", "Orden", "Enunciado", "Opción 1", "Opción 2", "Opción 3", "Opción 4", "Opción 5", "Opción 6", "Respuesta correcta", "Nivel"];
  
  const { eval: run, bookSheets } = crearEmulador({
    entorno: "PRODUCCION",
    hojaId: "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU",
    realId: "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU",
    initialSheets: {
      Lecturas: [encLecViejo],
      Preguntas: [encPreg, ["LEC_EXISTENTE", 1, "Pregunta?", "A", "B", "C", "D", "", "", "A", "Literal"]]
    }
  });

  run('migrarLecturasSiEsAntiguo()');
  const pPreg = bookSheets["Preguntas"];
  if (pPreg._clearCount > 0) {
    console.error("FAIL B4: migrarLecturasSiEsAntiguo causó borrado de Preguntas en producción!");
    process.exit(1);
  }
  const pregGuardada = pPreg._data.find(f => f[0] === "LEC_EXISTENTE");
  if (!pregGuardada) {
    console.error("FAIL B4: Pregunta existente fue borrada durante migración!");
    process.exit(1);
  }
  console.log("PASS B4: migrarLecturasSiEsAntiguo() migra legítimamente preservando Preguntas existentes");
}

// ==========================================
// PRUEBAS PUNTO C: escribirConfig_(clave, valor)
// ==========================================
console.log("\n--- PRUEBAS PUNTO C: escribirConfig_ ---");

// Test C1: Rechazo explícito con error ante claves restringidas
{
  const { eval: run, bookSheets } = crearEmulador({
    initialSheets: {
      Config: [["Clave", "Valor"]]
    }
  });

  const clavesRestringidas = [
    "HOJA_ID",
    "ENTORNO",
    "ADMIN_HASH",
    "ADMIN_SALT",
    "CLAVE_ADMIN",
    "CLAVE_ADMIN_HASH",
    "CLAVE_ADMIN_SALT",
    "CLAVE_ADMIN_ES_DEFAULT",
    "URL_HOJA_CALCULO"
  ];

  for (const c of clavesRestringidas) {
    try {
      run(`escribirConfig_("${c}", "nuevo_valor_malicioso")`);
      console.error(`FAIL C1: escribirConfig_ no lanzó error al intentar escribir clave restringida '${c}'`);
      process.exit(1);
    } catch (e) {
      if (e.message.includes("estrictamente restringida")) {
        // OK
      } else {
        console.error(`FAIL C1: Error con mensaje inesperado para '${c}':`, e.message);
        process.exit(1);
      }
    }
  }

  // Verificar que la hoja Config no fue modificada
  const pCfg = bookSheets["Config"];
  if (pCfg._data.length > 1) {
    console.error("FAIL C1: La hoja Config fue modificada a pesar de los errores!");
    process.exit(1);
  }

  console.log(`PASS C1: Las ${clavesRestringidas.length} claves restringidas fueron rechazadas explícitamente con Error sin modificar Config`);
}

// Test C2: Clave vacía o inválida rechazada con error
{
  const { eval: run } = crearEmulador({ initialSheets: { Config: [["Clave", "Valor"]] } });
  try {
    run('escribirConfig_("", "val")');
    console.error("FAIL C2: Debería haber lanzado error con clave vacía");
    process.exit(1);
  } catch (e) {
    console.log("PASS C2: Clave vacía rechazada con error -> " + e.message);
  }
}

// Test C3: Claves permitidas funcionan correctamente (inserción y actualización)
{
  const { eval: run, bookSheets } = crearEmulador({
    initialSheets: {
      Config: [
        ["Clave", "Valor"],
        ["IDENTIDAD_NOMBRE", "Escuela Vieja"]
      ]
    }
  });

  // Actualizar existente
  run('escribirConfig_("IDENTIDAD_NOMBRE", "Escuela Secundaria Técnica 90")');
  const pCfg = bookSheets["Config"];
  const filaNom = pCfg._data.find(f => f[0] === "IDENTIDAD_NOMBRE");
  if (!filaNom || filaNom[1] !== "Escuela Secundaria Técnica 90") {
    console.error("FAIL C3: No se actualizó IDENTIDAD_NOMBRE correctamente:", filaNom);
    process.exit(1);
  }

  // Insertar nueva clave legítima
  run('escribirConfig_("URL_SITIO_ALUMNO", "https://sites.google.com/view/alumnos")');
  const filaUrl = pCfg._data.find(f => f[0] === "URL_SITIO_ALUMNO");
  if (!filaUrl || filaUrl[1] !== "https://sites.google.com/view/alumnos") {
    console.error("FAIL C3: No se insertó URL_SITIO_ALUMNO correctamente:", filaUrl);
    process.exit(1);
  }

  console.log("PASS C3: Claves permitidas (IDENTIDAD_NOMBRE, URL_SITIO_ALUMNO) se actualizan e insertan correctamente");
}

// Test C4: asegurarConfig() inicializa Config sin intentar escribir credenciales sensibles
{
  const { eval: run, bookSheets } = crearEmulador({
    initialSheets: {
      Config: [["Clave", "Valor"]]
    }
  });

  run('asegurarConfig()');
  const pCfg = bookSheets["Config"];
  
  const hasClaveAdmin = pCfg._data.some(f => f[0] === "CLAVE_ADMIN");
  const hasSalt = pCfg._data.some(f => f[0] === "CLAVE_ADMIN_SALT");
  const hasHash = pCfg._data.some(f => f[0] === "CLAVE_ADMIN_HASH");
  const hasEsDef = pCfg._data.some(f => f[0] === "CLAVE_ADMIN_ES_DEFAULT");

  if (hasClaveAdmin || hasSalt || hasHash || hasEsDef) {
    console.error("FAIL C4: asegurarConfig() escribió credenciales sensibles a la hoja Config!");
    process.exit(1);
  }

  const hasIntentos = pCfg._data.some(f => f[0] === "INTENTOS_DEFAULT");
  const hasAsig = pCfg._data.some(f => f[0] === "ASIGNATURAS");
  if (!hasIntentos || !hasAsig) {
    console.error("FAIL C4: asegurarConfig() no escribió parámetros legítimos!");
    process.exit(1);
  }

  console.log("PASS C4: asegurarConfig() ejecuta limpiamente sin escribir credenciales sensibles en Config");
}

console.log("\n=== TODAS LAS PRUEBAS DE LOS PUNTOS A, B Y C PASARON EXITOSAMENTE (100% OK) ===");
