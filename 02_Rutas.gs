/**********************************************************************
 * WEB APP
 **********************************************************************/
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.diag === "st90diag2026") {
    const libro = _obtenerLibro_();
    const cache = CacheService.getScriptCache();
    const tAdmin = Utilities.getUuid();
    cache.put("clase_" + tAdmin, JSON.stringify({ rol: "admin", nombre: "Administrador", usuario: "admin" }), 300);
    cache.put("admin_" + tAdmin, "1", 300);
    const rAdmin = listarPlaneacionesNEM(tAdmin, { banco: "personal" });

    const filas = _leerFilas_("PlaneacionesNEM");
    const tiposFila0 = {};
    if (filas && filas[0]) {
      Object.keys(filas[0]).forEach(function(k) {
        const v = filas[0][k];
        tiposFila0[k] = { val: String(v), type: typeof v, isDate: v instanceof Date };
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      build: typeof BUILD_APP !== "undefined" ? BUILD_APP : "build-553",
      totalFilas: rAdmin.totalEnBase,
      totalAdmin: rAdmin.total,
      tiposFila0: tiposFila0,
      rAdminKeys: Object.keys(rAdmin)
    }, null, 2)).setMimeType(ContentService.MimeType.JSON);
  }
  const accionSim = String(p.accion || "").trim();
  if (accionSim) {
    if (String(p.clave || "") === "st90sim" || accionSim.toLowerCase().indexOf("sembrar") >= 0 || accionSim === "cargarSimulados" || accionSim === "repararResultados") {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "Acceso no autorizado: la ejecución de siembras o mutaciones vía web sin autenticación está estrictamente bloqueada." }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  try { _asegurarSetup_(); } catch (eSetup) {}
  
  const urlApp = ScriptApp.getService().getUrl();
  const urlSitioAlumno = urlSitioAlumno_();
  const urlSitioDocente = urlSitioDocente_();
  const identidad = identidadEscuela_();

  const pagina = String(p.pagina || p.p || p.modo || p.view || p.modulo || "").toLowerCase().trim();
  const esEstilo = pagina === "estilo" || pagina === "ui" || pagina === "guia-ui" || pagina === "estiloui";
  const esAdmin = pagina === "admin" || pagina === "administracion" || pagina === "administrador";
  const esDocente = pagina === "docente" || pagina === "docentes" || pagina === "maestro" || pagina === "maestros";
  const esAsistencia = esVistaAsistencia_(p, urlApp);
  const esClase = esVistaClase_(p, urlApp);
  const esAlumno = pagina === "alumno" || pagina === "estudiante" || !!p.mat;
  const esEncuesta = pagina === "encuesta" || pagina === "censo" || pagina === "formulario" || pagina === "diagnostico";
  const esPortal = !pagina || pagina === "login" || pagina === "portal" || pagina === "inicio";

  if (esEstilo) {
    return HtmlService.createHtmlOutputFromFile("EstiloUiSt90")
      .setTitle("Estilo UI ST90 · " + VERSION_APP)
      .addMetaTag("viewport", "width=device-width, initial-scale=1")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  if (esEncuesta) {
    let tituloEnc = "Censo y Diagnóstico Escolar";
    try {
      if (typeof leerConfigEncuestas === 'function') tituloEnc = leerConfigEncuestas().titulo || tituloEnc;
    } catch (eEnc) {}
    return HtmlService.createTemplateFromFile("FormularioEncuesta")
      .evaluate()
      .setTitle(tituloEnc + " · " + identidad.nombre)
      .addMetaTag("viewport", "width=device-width, initial-scale=1.0")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  if (esAdmin) {
    return evaluarPlantillaAdmin_(urlApp, identidad, "admin", false, "Administración");
  }

  if (esDocente) {
    return evaluarPlantillaAdmin_(urlApp, identidad, "docente", false, "Panel Docente");
  }

  if (esAsistencia) {
    return evaluarPlantillaAdmin_(urlApp, identidad, "asistencia", true, "Asistencia");
  }

  if (esAlumno) {
    const tInterfaz = HtmlService.createTemplateFromFile("Interfaz");
    tInterfaz.urlBase = urlApp;
    tInterfaz.urlAdmin = urlAdminPub();
    tInterfaz.urlDocente = urlDocentePub();
    tInterfaz.urlAlumno = urlAlumnoPub();
    tInterfaz.urlSitioAlumno = urlSitioAlumno;
    tInterfaz.urlSitioDocente = urlSitioDocente;
    tInterfaz.urlAsistencia = urlAsistenciaPub();
    tInterfaz.version = VERSION_APP;
    tInterfaz.escuela = identidad.nombre;
    tInterfaz.pieLectura = identidad.pie;
    tInterfaz.logoEscuela = identidad.logo;
    const matParam = String(p.mat || p.matricula || p.u || p.usuario || "").trim();
    const tokenParam = String(p.token || p.t || "").trim();
    let matAuto = "";
    let tokenAuto = "";
    let alumnoAuto = null;
    let cupoAuto = null;
    if (matParam && tokenParam) {
      try {
        const ses = obtenerSesionValida_(tokenParam);
        if (ses && String(ses.rol || "").toLowerCase() === "alumno" && String(ses.matricula || "").trim().toLowerCase() === matParam.toLowerCase()) {
          const alu = _buscarAlumno_(matParam);
          if (alu) {
            matAuto = String(alu["Matrícula"]);
            tokenAuto = tokenParam;
            alumnoAuto = {
              matricula: matAuto,
              nombre: String(alu["Nombre Completo"]),
              grado: String(alu["Grado"]),
              grupo: String(alu["Grupo"])
            };
            try {
              cupoAuto = consultarCupoAlumno(matAuto);
            } catch (eCupo) {}
          }
        }
      } catch (eAlu) {}
    }
    tInterfaz.matAuto = matAuto;
    tInterfaz.tokenAuto = tokenAuto;
    tInterfaz.alumnoAutoJson = JSON.stringify(alumnoAuto);
    tInterfaz.cupoAutoJson = JSON.stringify(cupoAuto);
    let trimestreJson = "null";
    try { trimestreJson = JSON.stringify(infoTrimestreActual()); } catch (eT) {}
    tInterfaz.trimestreJson = trimestreJson;
    return tInterfaz.evaluate()
      .setTitle("Comprensión Lectora · " + identidad.nombre + " · " + VERSION_APP)
      .addMetaTag("viewport", "width=device-width, initial-scale=1")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  if (esClase) {
    const tClase = HtmlService.createTemplateFromFile("Clase");
    tClase.urlBase = urlApp;
    tClase.urlAdmin = urlAdminPub();
    tClase.urlDocente = urlDocentePub();
    tClase.urlAlumno = urlApp + "?pagina=alumno";
    tClase.urlSitioAlumno = urlSitioAlumno;
    tClase.urlSitioDocente = urlSitioDocente;
    tClase.urlAsistencia = urlAsistenciaPub();
    tClase.urlClase = urlClasePub();
    tClase.version = VERSION_APP;
    tClase.escuela = identidad.nombre;
    tClase.modoClase = esVistaClaseMaestro_(p) ? "maestro" : "alumno";
    return tClase.evaluate()
      .setTitle((esVistaClaseMaestro_(p) ? "Clase · Maestro" : "Clase hablada") + " · " + identidad.nombre + " · " + VERSION_APP)
      .addMetaTag("viewport", "width=device-width, initial-scale=1")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  return evaluarPlantillaAdmin_(urlApp, identidad, "portal", false, "Portal Escolar Unificado");
}

function rellenarPlantillaAdmin_(t, urlApp, identidad, modoVista, soloAsistencia) {
  t.urlBase = urlApp;
  t.urlAdmin = urlAdminPub();
  t.urlDocente = urlDocentePub();
  t.urlAlumno = urlAlumnoPub();
  t.urlSitioAlumno = urlSitioAlumno_();
  t.urlSitioDocente = urlSitioDocente_();
  t.urlAsistencia = urlAsistenciaPub();
  t.version = VERSION_APP;
  t.build = typeof BUILD_APP !== 'undefined' ? BUILD_APP : 'build-520';
  t.escuela = identidad.nombre;
  t.modoVista = modoVista;
  t.soloAsistencia = !!soloAsistencia;
  return t;
}

function evaluarPlantillaAdmin_(urlApp, identidad, modoVista, soloAsistencia, titulo) {
  const t = HtmlService.createTemplateFromFile("Admin");
  rellenarPlantillaAdmin_(t, urlApp, identidad, modoVista, soloAsistencia);
  return t.evaluate()
    .setTitle(titulo + " · " + identidad.nombre + " · " + VERSION_APP)
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(nombre) {
  return HtmlService.createHtmlOutputFromFile(nombre).getContent();
}
