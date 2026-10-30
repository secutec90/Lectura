/**********************************************************************
 * SEGURIDAD ADMIN
 **********************************************************************/
function hashClave(clave, salt) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(clave) + "|" + String(salt),
    Utilities.Charset.UTF_8
  );
  return bytes.map(function (b) {
    return ('0' + (b & 0xFF).toString(16)).slice(-2);
  }).join("");
}

function obtenerCredencialesAdminAutoritativas_() {
  const props = PropertiesService.getScriptProperties();
  let hash = String(props.getProperty("CLAVE_ADMIN_HASH") || "").trim();
  let salt = String(props.getProperty("CLAVE_ADMIN_SALT") || "").trim();
  let esDef = String(props.getProperty("CLAVE_ADMIN_ES_DEFAULT") || "").trim();
  if (!hash || !salt) {
    return { configurada: false, hash: "", salt: "", esDefault: false };
  }
  return { configurada: true, hash: hash, salt: salt, esDefault: (esDef === "1") };
}

/**
 * Fija la contraseña del panel. Se ejecuta MANUALMENTE desde el editor de Apps Script:
 * el guion bajo final la hace privada, así que no es invocable desde la web.
 *   fijarClaveAdminInicial_("una-clave-larga")
 */
function fijarClaveAdminInicial_(nuevaClave) {
  const clave = String(nuevaClave || "").trim();
  if (clave.length < 10) throw new Error("La contraseña debe tener al menos 10 caracteres.");
  const salt = Utilities.getUuid();
  PropertiesService.getScriptProperties().setProperties({
    CLAVE_ADMIN_SALT: salt,
    CLAVE_ADMIN_HASH: hashClave(clave, salt),
    CLAVE_ADMIN_ES_DEFAULT: "0"
  });
  return "Contraseña del panel actualizada.";
}

/**
 * Entrega las credenciales del Constructor de Encuestas solo a quien demuestre
 * la contraseña del panel. Las credenciales viven en Propiedades del script:
 * ENCUESTAS_USUARIO / ENCUESTAS_CLAVE (si no existen, Admin / Admin-dev).
 */
function credencialesEncuestasPanel(tokenSesion) {
  try {
    const t = String(tokenSesion || "").trim();
    if (!t) return { ok: false };
    const sesion = obtenerSesionValida_(t);
    if (!sesion || String(sesion.rol || "").toLowerCase() !== "admin") return { ok: false };
    const props = PropertiesService.getScriptProperties();
    const usuario = String(props.getProperty("ENCUESTAS_USUARIO") || "").trim();
    const clave = String(props.getProperty("ENCUESTAS_CLAVE") || "").trim();
    if (!usuario || !clave) return { ok: false };
    return { ok: true, usuario: usuario, clave: clave };
  } catch (e) {
    return { ok: false };
  }
}

function claveEsDefault() {
  const creds = obtenerCredencialesAdminAutoritativas_();
  return creds.configurada ? creds.esDefault : false;
}

function esUsuarioAdminAsistencia_(usuario) {
  const n = normalizarNombrePref_(usuario);
  return n === USUARIO_ADMIN_ASISTENCIA || n === "administrador" || n === "administracion";
}

function iniciarSesionUnificada(usuario, clave, vistaSolicitada) {
  try { _asegurarSetup_(); } catch (eSetup) {}
  const usu = String(usuario || "").trim();
  const claveIngresada = String(clave || "").trim();
  const vista = String(vistaSolicitada || "").toLowerCase().trim();

  if (!claveIngresada) {
    return { ok: false, mensaje: "Por favor ingresa tu contraseña." };
  }

  // 1. Administrador (fuente autoritativa: ScriptProperties)
  const credsAdmin = obtenerCredencialesAdminAutoritativas_();
  const esUsuAdmin = !usu || esUsuarioAdminAsistencia_(usu);
  let claveAdminOk = false;
  if (credsAdmin.configurada) {
    claveAdminOk = (hashClave(claveIngresada, credsAdmin.salt) === credsAdmin.hash);
  } else if (esUsuAdmin) {
    return {
      ok: false,
      requiereConfiguracion: true,
      mensaje: "La contraseña del panel no está configurada. Ejecuta fijarClaveAdminInicial_('tu-clave') desde el editor de Apps Script."
    };
  }
  if (claveAdminOk && esUsuAdmin) {
    const token = Utilities.getUuid();
    const cache = CacheService.getScriptCache();
    cache.put("admin_" + token, "1", 21600);
    const sesion = { rol: "admin", prefectoId: "", nombre: "Administrador", usuario: "admin" };
    cache.put("sesion_" + token, JSON.stringify(sesion), 21600);
    return {
      ok: true,
      rol: "admin",
      nombre: "Administrador",
      usuario: "admin",
      token: token,
      modulo: "admin",
      urlDestino: urlAdminPub(),
      urlAlumno: urlAlumnoPub(),
      urlAsistencia: urlAsistenciaPub(),
      urlHoja: URL_HOJA_DEFAULT,
      requiereCambioClave: claveEsDefault(),
      version: VERSION_APP,
      build: typeof BUILD_APP !== 'undefined' ? BUILD_APP : 'build-510'
    };
  }

  if (!usu) {
    return { ok: false, mensaje: "Por favor escribe tu usuario o matrícula." };
  }

  // 2. Prefecta (en hoja Prefectos)
  try {
    const prefecto = buscarPrefectoLogin_(claveIngresada, usu);
    if (prefecto) {
      if (prefecto.varios) {
        return {
          ok: false,
          requiereNombre: true,
          mensaje: "Hay más de una prefecta parecida. Escribe tu usuario completo."
        };
      }
      const token = Utilities.getUuid();
      const cache = CacheService.getScriptCache();
      const sesion = {
        rol: "prefecto",
        prefectoId: String(prefecto.id || ""),
        nombre: String(prefecto.nombre || "Prefecta"),
        usuario: String(prefecto.usuario || usu)
      };
      cache.put("sesion_" + token, JSON.stringify(sesion), 21600);
      return {
        ok: true,
        rol: "prefecto",
        nombre: sesion.nombre,
        usuario: sesion.usuario,
        prefectoId: sesion.prefectoId,
        token: token,
        modulo: "asistencia",
        urlDestino: urlAsistenciaPub(),
        urlAlumno: urlAlumnoPub(),
        urlAsistencia: urlAsistenciaPub(),
        urlHoja: URL_HOJA_DEFAULT,
        version: VERSION_APP,
        build: typeof BUILD_APP !== 'undefined' ? BUILD_APP : 'build-510'
      };
    }
  } catch (ePref) {
    Logger.log("Error verificando prefecto en login unificado: " + ePref.message);
  }

  // 3. Docente / Maestro (en hoja MaestrosClase)
  try {
    const maestro = buscarMaestroClaseLogin_(usu, claveIngresada);
    if (maestro) {
      const token = Utilities.getUuid();
      const cache = CacheService.getScriptCache();
      cache.put("docente_" + token, "1", 21600);
      const sesion = {
        rol: "docente",
        maestroId: String(maestro.id || ""),
        nombre: String(maestro.nombre || "Docente"),
        usuario: String(maestro.usuario || usu)
      };
      cache.put("sesion_" + token, JSON.stringify(sesion), 21600);
      return {
        ok: true,
        rol: "docente",
        nombre: sesion.nombre,
        usuario: sesion.usuario,
        maestroId: sesion.maestroId,
        token: token,
        modulo: "docente",
        urlDestino: urlDocentePub(),
        urlAlumno: urlAlumnoPub(),
        urlAsistencia: urlAsistenciaPub(),
        urlHoja: URL_HOJA_DEFAULT,
        version: VERSION_APP,
        build: typeof BUILD_APP !== 'undefined' ? BUILD_APP : 'build-510'
      };
    }
  } catch (eMae) {
    Logger.log("Error verificando maestro en login unificado: " + eMae.message);
  }

  // 4. Personal de apoyo (secretaría, biblioteca, trabajo social, etc.)
  try {
    const apoyo = buscarPersonalApoyoLogin_(usu, claveIngresada);
    if (apoyo) {
      if (apoyo.varios) {
        return {
          ok: false,
          requiereNombre: true,
          mensaje: "Hay más de una persona de apoyo parecida. Escribe tu usuario completo."
        };
      }
      const token = Utilities.getUuid();
      const cache = CacheService.getScriptCache();
      const sesion = {
        rol: "apoyo",
        apoyoId: String(apoyo.id || ""),
        nombre: String(apoyo.nombre || "Apoyo"),
        usuario: String(apoyo.usuario || usu),
        area: String(apoyo.area || "")
      };
      cache.put("sesion_" + token, JSON.stringify(sesion), 21600);
      return {
        ok: true,
        rol: "apoyo",
        nombre: sesion.nombre,
        usuario: sesion.usuario,
        area: sesion.area,
        apoyoId: sesion.apoyoId,
        token: token,
        modulo: "admin",
        urlDestino: urlAdminPub(),
        urlAlumno: urlAlumnoPub(),
        urlAsistencia: urlAsistenciaPub(),
        urlHoja: URL_HOJA_DEFAULT,
        version: VERSION_APP
      };
    }
  } catch (eApo) {
    Logger.log("Error verificando personal de apoyo en login unificado: " + eApo.message);
  }

  // 5. Alumno (en hoja AccesoClaseAlumnos por Usuario o Matrícula)
  try {
    const alumno = buscarAlumnoClaseLogin_(usu, claveIngresada);
    if (alumno) {
      const token = Utilities.getUuid();
      const cache = CacheService.getScriptCache();
      cache.put("alumno_" + token, "1", 21600);
      const sesion = {
        rol: "alumno",
        matricula: String(alumno.matricula || "").trim(),
        nombre: String(alumno.nombre || ""),
        usuario: String(alumno.usuario || usu),
        grado: String(alumno.grado || "").trim(),
        grupo: String(alumno.grupo || "").trim().toLowerCase()
      };
      cache.put("sesion_" + token, JSON.stringify(sesion), 21600);
      cache.put("sesion_mat_" + token, sesion.matricula, 21600);
      cache.put("sesion_alumno_" + sesion.matricula, token, 21600);
      return {
        ok: true,
        rol: "alumno",
        nombre: sesion.nombre,
        usuario: sesion.usuario,
        matricula: sesion.matricula,
        grado: sesion.grado,
        grupo: sesion.grupo,
        token: token,
        modulo: "alumno",
        urlDestino: urlDestinoAlumno_(sesion.matricula, token),
        urlAlumno: urlAlumnoPub(),
        version: VERSION_APP
      };
    }
  } catch (eAlu) {
    Logger.log("Error verificando alumno en login unificado: " + eAlu.message);
  }

  // 6. Diagnóstico de ayuda si es alumno sin clave asignada aún
  try {
    const alusMat = _leerFilas_("Alumnos").filter(function(a) {
      const m = normalizarNombrePref_(a["Matrícula"] || a["Matricula"] || "");
      const u = normalizarNombrePref_(usu);
      return m === u;
    });
    if (alusMat.length > 0) {
      return {
        ok: false,
        mensaje: "Esta matrícula está registrada en el padrón escolar, pero aún no tiene contraseña asignada en el sistema. Solicita a tu maestro o prefecta que genere tu clave de acceso."
      };
    }
  } catch (eDiag) {}

  return {
    ok: false,
    mensaje: "Usuario o contraseña incorrectos. Verifica tus credenciales."
  };
}

function iniciarSesionAdmin(clave, nombrePrefecto, modulo) {
  return iniciarSesionUnificada(nombrePrefecto, clave, modulo || "");
}

function revocarTokenSesion(token) {
  const t = String(token || "").trim();
  if (!t) return { ok: true, revocado: true };
  const cache = CacheService.getScriptCache();

  let matriculaVinculada = "";
  const raw = cache.get("sesion_" + t);
  if (raw) {
    try {
      const ses = JSON.parse(raw);
      if (ses && ses.matricula) {
        matriculaVinculada = String(ses.matricula).trim();
      }
    } catch (eParse) {}
  }
  if (!matriculaVinculada) {
    const matPlana = cache.get("sesion_mat_" + t);
    if (matPlana) {
      matriculaVinculada = String(matPlana).trim();
    }
  }

  if (matriculaVinculada) {
    const rawExamen = cache.get("examen_vigente_" + matriculaVinculada);
    if (rawExamen) {
      try {
        const ev = JSON.parse(rawExamen);
        if (!ev.tokenSesion || ev.tokenSesion === t) {
          cache.remove("examen_vigente_" + matriculaVinculada);
        }
      } catch (eEv) {
        cache.remove("examen_vigente_" + matriculaVinculada);
      }
    }

    const tokenActivoMat = cache.get("sesion_alumno_" + matriculaVinculada);
    if (!tokenActivoMat || tokenActivoMat === t) {
      cache.remove("sesion_alumno_" + matriculaVinculada);
    }
  }

  cache.remove("sesion_" + t);
  cache.remove("sesion_mat_" + t);
  cache.remove("admin_" + t);
  cache.remove("alumno_" + t);
  cache.remove("docente_" + t);
  cache.remove("clase_" + t);
  return { ok: true, revocado: true };
}

function cerrarSesionAlumno(token) {
  return revocarTokenSesion(token);
}

function cerrarSesionAdmin(token) {
  return revocarTokenSesion(token);
}

const ROLES_VALIDOS_SISTEMA_ = ["admin", "docente", "prefecto", "apoyo", "alumno", "maestro"];

function obtenerSesionValida_(token) {
  const t = String(token || "").trim();
  if (!t) return null;
  const cache = CacheService.getScriptCache();
  const raw = cache.get("sesion_" + t);
  if (!raw) return null;
  try {
    const s = JSON.parse(raw);
    if (!s || typeof s !== "object" || !s.rol) return null;
    const rol = String(s.rol).toLowerCase();
    if (ROLES_VALIDOS_SISTEMA_.indexOf(rol) < 0) return null;
    cache.put("sesion_" + t, raw, 21600);
    return s;
  } catch (e) {
    return null;
  }
}

function exigirRoles_(token, rolesPermitidos) {
  const ses = obtenerSesionValida_(token);
  if (!ses) {
    throw new Error("Sesión no válida o expirada. Vuelve a entrar.");
  }
  const rol = String(ses.rol || "").toLowerCase();
  const permitidos = (rolesPermitidos || []).map(function (r) { return String(r).toLowerCase(); });
  if (permitidos.indexOf(rol) < 0) {
    throw new Error("Acceso denegado: rol '" + rol + "' no autorizado para esta acción.");
  }
  return ses;
}

function exigirAdmin(token) {
  const ses = obtenerSesionValida_(token);
  if (!ses) {
    throw new Error("Sesión no válida o expirada. Vuelve a entrar.");
  }
  const cache = CacheService.getScriptCache();
  if (cache.get("admin_" + String(token || "")) !== "1") {
    throw new Error("Sesión de administrador no válida. Vuelve a entrar.");
  }
  const rol = String(ses.rol || "").toLowerCase();
  if (rol !== "admin") {
    throw new Error("Acceso denegado: se requieren privilegios de administrador.");
  }
  cache.put("admin_" + token, "1", 21600);
  return ses;
}

/**
 * Procedimiento de recuperación administrativa de emergencia.
 * Solo puede ejecutarse manualmente desde la consola del editor de Apps Script.
 * No es invocable desde la web (función privada con sufijo _).
 */
function adminRestablecerClaveConsola_(nuevaClave) {
  if (!nuevaClave || String(nuevaClave).trim().length < 8) {
    throw new Error("La nueva clave de consola debe tener al menos 8 caracteres.");
  }
  const salt = Utilities.getUuid();
  const hash = hashClave(String(nuevaClave).trim(), salt);
  const props = PropertiesService.getScriptProperties();
  props.setProperties({
    CLAVE_ADMIN_SALT: salt,
    CLAVE_ADMIN_HASH: hash,
    CLAVE_ADMIN_ES_DEFAULT: "0"
  });
  Logger.log("Credenciales administrativas restablecidas exitosamente desde consola.");
  return { ok: true, mensaje: "Contraseña de administrador actualizada en ScriptProperties." };
}

const AREAS_APOYO = [
  "Secretaría",
  "Biblioteca",
  "Trabajo social",
  "Orientación",
  "Laboratorio",
  "Intendencia",
  "Otro"
];

function areaApoyoValida_(area) {
  const a = String(area || "").trim();
  for (let i = 0; i < AREAS_APOYO.length; i++) {
    if (AREAS_APOYO[i] === a) return a;
  }
  return "Otro";
}

function generarClaveAleatoriaApoyo_() {
  const letras = "abcdefghjkmnpqrstuvwxyz";
  const nums = "23456789";
  let p = "a";
  p += letras.charAt(Math.floor(Math.random() * letras.length));
  for (let i = 0; i < 4; i++) {
    p += nums.charAt(Math.floor(Math.random() * nums.length));
  }
  return p;
}

function usuariosOcupadosApoyo_(ignorarId) {
  const usados = {};
  function marcar(hoja, campoId) {
    _leerFilas_(hoja).forEach(function (f) {
      if (hoja === "PersonalApoyo" && ignorarId && String(f[campoId] || "") === String(ignorarId)) return;
      const u = normalizarNombrePref_(f["Usuario"] || "");
      if (u) usados[u] = true;
    });
  }
  try { marcar("PersonalApoyo", "Id"); } catch (e1) {}
  try { marcar("Prefectos", "Id"); } catch (e2) {}
  try { marcar("MaestrosClase", "Id"); } catch (e3) {}
  try {
    _leerFilas_("AccesoClaseAlumnos").forEach(function (f) {
      const u = normalizarNombrePref_(f["Usuario"] || "");
      if (u) usados[u] = true;
    });
  } catch (e4) {}
  return usados;
}

function usuarioApoyoLibre_(deseado, ignorarId) {
  let base = slugUsuarioPref_(deseado);
  if (!base || esUsuarioAdminAsistencia_(base)) base = "apoyo";
  const usados = usuariosOcupadosApoyo_(ignorarId);
  let u = base;
  let n = 2;
  while (usados[u] || esUsuarioAdminAsistencia_(u)) {
    u = base + n;
    n++;
  }
  return u;
}

function buscarPersonalApoyoLogin_(usuario, clave) {
  _verificarYCrearPestanas_();
  const filas = _leerFilas_("PersonalApoyo");
  const nom = normalizarNombrePref_(usuario);
  if (!nom || !String(clave || "").trim()) return null;
  const candidatos = [];
  filas.forEach(function (f) {
    const activo = String(f["Activo"] || "SI").trim().toUpperCase();
    if (activo === "NO") return;
    const u = normalizarNombrePref_(f["Usuario"] || "");
    const n = normalizarNombrePref_(f["Nombre"] || "");
    if (u === nom || n === nom) candidatos.push(f);
  });
  if (!candidatos.length) return null;
  if (candidatos.length > 1) {
    const exactoUsuario = candidatos.filter(function (f) {
      return normalizarNombrePref_(f["Usuario"] || "") === nom;
    });
    if (exactoUsuario.length === 1) {
      candidatos.length = 0;
      candidatos.push(exactoUsuario[0]);
    } else {
      return {
        varios: true,
        nombres: candidatos.map(function (f) {
          return String(f["Usuario"] || f["Nombre"] || "").trim();
        })
      };
    }
  }
  const f = candidatos[0];
  const salt = String(f["Salt"] || "");
  const hash = String(f["Hash"] || "");
  if (!salt || !hash || hashClave(clave, salt) !== hash) return null;
  return {
    id: String(f["Id"] || "").trim(),
    nombre: String(f["Nombre"] || "").trim(),
    usuario: String(f["Usuario"] || "").trim(),
    area: String(f["Área"] || "").trim()
  };
}

function listarPersonalApoyo(token) {
  const sesion = sesionAsistencia_(token);
  if (sesion.rol !== "admin") throw new Error("Solo el administrador puede ver el personal de apoyo.");
  _verificarYCrearPestanas_();
  const lista = _leerFilas_("PersonalApoyo").map(function (f) {
    return {
      id: String(f["Id"] || "").trim(),
      nombre: String(f["Nombre"] || "").trim(),
      usuario: String(f["Usuario"] || "").trim(),
      area: String(f["Área"] || "").trim(),
      clave: "",
      activo: String(f["Activo"] || "SI").trim().toUpperCase() !== "NO"
    };
  });
  lista.sort(function (a, b) {
    const da = String(a.area).localeCompare(String(b.area), "es");
    if (da !== 0) return da;
    return String(a.nombre).localeCompare(String(b.nombre), "es");
  });
  return { ok: true, personal: lista, areas: AREAS_APOYO };
}

function altaPersonalApoyo(token, nombre, usuario, area, clave) {
  const sesion = sesionAsistencia_(token);
  if (sesion.rol !== "admin") throw new Error("Solo el administrador puede dar de alta personal de apoyo.");
  nombre = String(nombre || "").trim();
  usuario = String(usuario || "").trim();
  clave = String(clave || "").trim();
  area = areaApoyoValida_(area);
  if (!nombre) throw new Error("Escribe el nombre de la persona.");
  if (!clave) clave = generarClaveAleatoriaApoyo_();
  if (clave.length < 6) throw new Error("La clave debe tener al menos 6 caracteres.");
  _verificarYCrearPestanas_();
  const usuarioUso = usuarioApoyoLibre_(usuario || nombre);
  if (esUsuarioAdminAsistencia_(usuarioUso)) {
    throw new Error("Ese usuario está reservado para el administrador.");
  }
  const id = "A" + String(new Date().getTime()).slice(-8);
  const salt = Utilities.getUuid();
  const libro = _obtenerLibro_();
  const p = libro.getSheetByName("PersonalApoyo");
  p.appendRow([id, celdaSegura_(nombre), celdaSegura_(usuarioUso), celdaSegura_(area), salt, hashClave(clave, salt), "SI", ""]);
  const lastRow = p.getLastRow();
  p.getRange(lastRow, 8).setNumberFormat("@");
  SpreadsheetApp.flush();
  return { ok: true, id: id, usuario: usuarioUso, clave: clave, mensaje: "Alta de " + nombre + " (" + area + "). Usuario: " + usuarioUso };
}

function asignarClavePersonalApoyo(token, id, usuario, clave, area) {
  const sesion = sesionAsistencia_(token);
  if (sesion.rol !== "admin") throw new Error("Solo el administrador puede editar personal de apoyo.");
  id = String(id || "").trim();
  usuario = String(usuario || "").trim();
  clave = String(clave || "").trim();
  if (!id) throw new Error("Falta el identificador.");
  if (clave && clave.length < 6) throw new Error("La clave debe tener al menos 6 caracteres.");
  _verificarYCrearPestanas_();
  const libro = _obtenerLibro_();
  const p = libro.getSheetByName("PersonalApoyo");
  if (!p) throw new Error("No se encontró la hoja PersonalApoyo.");
  const filas = _leerFilas_("PersonalApoyo");
  let f = null;
  filas.forEach(function (row) {
    if (String(row["Id"] || "").trim() === id) f = row;
  });
  if (!f) throw new Error("No se encontró a esa persona.");
  const lastCol = Math.max(p.getLastColumn(), 1);
  const enc = p.getRange(1, 1, 1, lastCol).getValues()[0];
  let colUsu = 0, colArea = 0, colSalt = 0, colHash = 0, colClave = 0;
  enc.forEach(function (h, i) {
    const n = normalizarNombrePref_(h);
    if (n === "usuario") colUsu = i + 1;
    if (n === "area") colArea = i + 1;
    if (n === "salt") colSalt = i + 1;
    if (n === "hash") colHash = i + 1;
    if (n === "clave") colClave = i + 1;
  });
  if (usuario) {
    const usuarioUso = usuarioApoyoLibre_(usuario, id);
    if (colUsu) p.getRange(f._fila, colUsu).setValue(usuarioUso);
  }
  if (area) {
    if (colArea) p.getRange(f._fila, colArea).setValue(areaApoyoValida_(area));
  }
  if (clave) {
    const salt = Utilities.getUuid();
    if (colSalt) p.getRange(f._fila, colSalt).setValue(salt);
    if (colHash) p.getRange(f._fila, colHash).setValue(hashClave(clave, salt));
    if (colClave) p.getRange(f._fila, colClave).setNumberFormat("@").setValue("");
  }
  SpreadsheetApp.flush();
  return { ok: true, mensaje: "Datos actualizados para " + String(f["Nombre"] || "") + "." };
}

function generarClavePersonalApoyo(token, id) {
  const clave = generarClaveAleatoriaApoyo_();
  return asignarClavePersonalApoyo(token, id, "", clave, "");
}

function generarClavesPersonalApoyo(token) {
  const sesion = sesionAsistencia_(token);
  if (sesion.rol !== "admin") throw new Error("Solo el administrador puede generar claves.");
  const filas = _leerFilas_("PersonalApoyo").filter(function (f) {
    return String(f["Activo"] || "SI").toUpperCase() !== "NO";
  });
  if (!filas.length) return { ok: false, total: 0, mensaje: "No hay personal de apoyo activo." };
  let n = 0;
  filas.forEach(function (f) {
    const id = String(f["Id"] || "").trim();
    const nom = String(f["Nombre"] || "");
    const usu = usuarioApoyoLibre_(slugUsuarioPref_(nom) + String(100 + Math.floor(Math.random() * 900)), id);
    const clave = generarClaveAleatoriaApoyo_();
    asignarClavePersonalApoyo(token, id, usu, clave, "");
    n++;
  });
  return { ok: true, total: n, mensaje: "Se generaron usuario y contraseña para " + n + " personas de apoyo." };
}

function cambiarClaveAdmin(token, nueva) {
  exigirAdmin(token);
  const creds = obtenerCredencialesAdminAutoritativas_();
  if (!creds.configurada) {
    throw new Error("No es posible cambiar la contraseña web: las credenciales iniciales no han sido inicializadas en ScriptProperties.");
  }
  if (!nueva || String(nueva).length < 6) {
    throw new Error("La nueva contraseña debe tener al menos 6 caracteres.");
  }
  const salt = Utilities.getUuid();
  const hash = hashClave(nueva, salt);
  const props = PropertiesService.getScriptProperties();
  props.setProperties({
    CLAVE_ADMIN_SALT: salt,
    CLAVE_ADMIN_HASH: hash,
    CLAVE_ADMIN_ES_DEFAULT: "0"
  });
  return { ok: true, mensaje: "Contraseña actualizada correctamente." };
}

function _urlHojaCalculo_() {
  try {
    const libro = _obtenerLibro_();
    if (libro) return libro.getUrl();
  } catch (e) {}
  return URL_HOJA_DEFAULT;
}

function aJsonSeguro(obj) {
  return JSON.parse(JSON.stringify(obj, function (clave, valor) {
    if (valor instanceof Date) return valor.toISOString();
    if (typeof valor === "number" && !isFinite(valor)) return 0;
    if (typeof valor === "undefined") return null;
    return valor;
  }));
}

function urlAdmin() {
  const base = String(ScriptApp.getService().getUrl() || "").replace(/\/+$/, "");
  return base ? (base + "?pagina=admin") : "?pagina=admin";
}

function urlAdminPub() {
  return urlAdmin();
}

function urlDocentePub() {
  const base = String(ScriptApp.getService().getUrl() || "").replace(/\/+$/, "");
  return base ? (base + "?pagina=docente") : "?pagina=docente";
}

function urlAlumnoPub() {
  const base = String(ScriptApp.getService().getUrl() || "").replace(/\/+$/, "");
  return base ? (base + "?pagina=alumno") : "?pagina=alumno";
}

function urlDestinoAlumno_(matricula, token) {
  const base = urlAlumnoPub();
  const sep = base.indexOf("?") >= 0 ? "&" : "?";
  let url = base + sep + "mat=" + encodeURIComponent(matricula || "");
  if (token) url += "&token=" + encodeURIComponent(token);
  return url;
}

function esVistaAsistencia_(p, urlApp) {
  const pagina = String((p && (p.pagina || p.p || p.modo || p.view || p.modulo)) || "").toLowerCase().trim();
  if (["asistencia", "prefecto", "prefectura", "asi"].indexOf(pagina) >= 0) return true;
  const id = String(ID_DEPLOY_ASISTENCIA || "").trim();
  if (id && id !== "PENDIENTE" && urlApp && String(urlApp).indexOf(id) >= 0) return true;
  return false;
}

function urlAsistenciaPub() {
  const id = String(ID_DEPLOY_ASISTENCIA || "").trim();
  if (id && id !== "PENDIENTE") {
    return "https://script.google.com/macros/s/" + id + "/exec";
  }
  const base = String(ScriptApp.getService().getUrl() || "").replace(/\/+$/, "");
  return base ? (base + "?pagina=asistencia") : "?pagina=asistencia";
}

function esVistaClaseMaestro_(p) {
  const pagina = String((p && (p.pagina || p.p || p.modo || p.view || p.modulo)) || "").toLowerCase().trim();
  return ["clase-maestro", "clase_maestro", "escucha-maestro", "maestro-clase"].indexOf(pagina) >= 0;
}

function esVistaClase_(p, urlApp) {
  const pagina = String((p && (p.pagina || p.p || p.modo || p.view || p.modulo)) || "").toLowerCase().trim();
  if (pagina && ["clase", "escucha", "aula", "clase-alumno", "clase_alumno", "clase-maestro", "clase_maestro", "escucha-maestro", "maestro-clase"].indexOf(pagina) < 0) {
    return false;
  }
  if (["clase", "escucha", "aula", "clase-alumno", "clase_alumno"].indexOf(pagina) >= 0) return true;
  if (esVistaClaseMaestro_(p)) return true;
  const id = String(ID_DEPLOY_CLASE || "").trim();
  if (id && id !== "PENDIENTE" && urlApp && String(urlApp).indexOf(id) >= 0) return true;
  return false;
}

function urlClasePub() {
  const id = String(ID_DEPLOY_CLASE || "").trim();
  if (id && id !== "PENDIENTE") {
    return "https://script.google.com/macros/s/" + id + "/exec";
  }
  const base = String(ScriptApp.getService().getUrl() || "").replace(/\/+$/, "");
  return base ? (base + "?pagina=clase") : "?pagina=clase";
}
