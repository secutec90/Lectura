/**********************************************************************
 * ESPECIFICACIONES Y PPM OBJETIVO
 **********************************************************************/
function especificacionesDeGrado(grado) {
  const base = ESPECIFICACIONES_GRADO[String(grado)] || ESPECIFICACIONES_GRADO["1"];
  const extra = ppmObjetivoDeTodos()[String(grado)];
  if (extra) {
    return Object.assign({}, base, {
      ppmMin: Number(extra.ppmMin),
      ppmMax: Number(extra.ppmMax),
      ppmObjetivo: Number(extra.ppmObjetivo)
    });
  }
  return base;
}

function especificacionesDeTodos() {
  return JSON.parse(JSON.stringify(ESPECIFICACIONES_GRADO));
}

function ppmObjetivoDeTodos() {
  const base = {};
  Object.keys(ESPECIFICACIONES_GRADO).forEach(function (g) {
    base[g] = {
      ppmMin: ESPECIFICACIONES_GRADO[g].ppmMin,
      ppmMax: ESPECIFICACIONES_GRADO[g].ppmMax,
      ppmObjetivo: ESPECIFICACIONES_GRADO[g].ppmObjetivo
    };
  });
  try {
    const extra = JSON.parse(leerConfig("PPM_OBJETIVO", "{}") || "{}");
    Object.keys(extra || {}).forEach(function (g) {
      if (extra[g] && (extra[g].ppmMin || extra[g].ppmMax || extra[g].ppmObjetivo)) {
        base[g] = {
          ppmMin: Number(extra[g].ppmMin) || base[g].ppmMin,
          ppmMax: Number(extra[g].ppmMax) || base[g].ppmMax,
          ppmObjetivo: Number(extra[g].ppmObjetivo) || base[g].ppmObjetivo
        };
      }
    });
  } catch (e) {}
  return base;
}

function restaurarPpmRecomendados(token) {
  exigirAdmin(token);
  const rec = {};
  Object.keys(ESPECIFICACIONES_GRADO).forEach(function (g) {
    rec[g] = {
      ppmMin: ESPECIFICACIONES_GRADO[g].ppmMin,
      ppmMax: ESPECIFICACIONES_GRADO[g].ppmMax,
      ppmObjetivo: ESPECIFICACIONES_GRADO[g].ppmObjetivo
    };
  });
  escribirConfig_("PPM_OBJETIVO", JSON.stringify(rec));
  return { ok: true, mensaje: "Se restauraron los rangos recomendados de PPM.", ppmObjetivo: rec };
}

function guardarPpmObjetivo(token, json) {
  exigirAdmin(token);
  const obj = (typeof json === "string") ? JSON.parse(json) : json;
  Object.keys(obj).forEach(function (g) {
    const v = obj[g];
    if (Number(v.ppmMin) <= 0 || Number(v.ppmMax) <= 0 || Number(v.ppmObjetivo) <= 0) {
      throw new Error("Los PPM deben ser mayores a cero.");
    }
    if (Number(v.ppmMin) > Number(v.ppmMax)) {
      throw new Error("En grado " + g + ": ppmMin no puede ser mayor que ppmMax.");
    }
  });
  escribirConfig_("PPM_OBJETIVO", JSON.stringify(obj));
  return { ok: true, mensaje: "Rangos PPM actualizados." };
}

/**********************************************************************
 * ALUMNOS / GRUPOS / INTENTOS
 **********************************************************************/
function obtenerGruposPorGrado(grado) {
  const g = normalizarGradoServer(grado);
  let res = [];
  try {
    const todos = leerAlumnosResumen();
    res = uniq(todos.filter(function (a) {
      const ga = normalizarGradoServer(a.grado) || normalizarGradoServer(a.grupo);
      return (!g || ga === g) && String(a.activo).toUpperCase() !== "NO";
    }).map(function (a) { return String(a.grupo).toLowerCase(); })).sort();
  } catch (e) {}
  if (!res.length && g) {
    res = ["a", "b", "c", "d", "e"].map(function (l) { return g + l; });
  }
  return res;
}

function obtenerAlumnosPorGrupo(grupo) {
  const g = String(grupo || "").trim().toLowerCase();
  let todos = [];
  try { todos = leerAlumnosResumen(); } catch (e) { return []; }
  return todos
    .filter(function (a) {
      return String(a.grupo).trim().toLowerCase() === g && String(a.activo).toUpperCase() !== "NO";
    })
    .map(function (a) {
      return {
        matricula: String(a.matricula),
        nombre: String(a.nombre),
        grupo: String(a.grupo),
        grado: String(a.grado)
      };
    })
    .sort(function (a, b) { return a.nombre.localeCompare(b.nombre, "es"); });
}

function catalogoLoginPorGrado(grado) {
  const g = normalizarGradoServer(grado);
  let todos = [];
  try { todos = leerAlumnosResumen(); } catch (e) { todos = []; }
  const activos = todos.filter(function (a) {
    const ga = normalizarGradoServer(a.grado) || normalizarGradoServer(a.grupo);
    return (!g || ga === g) && String(a.activo).toUpperCase() !== "NO";
  });
  const grupos = uniq(activos.map(function (a) {
    return String(a.grupo || "").toLowerCase();
  }).filter(Boolean)).sort();

  return {
    grupos: grupos.length ? grupos : ["a", "b", "c", "d", "e"].map(function (l) { return g + l; }),
    alumnos: [],
    trimestre: (function () { try { return infoTrimestreActual(); } catch (e) { return null; } })()
  };
}

function buscarAlumno(matricula) {
  const m = String(matricula || "").trim().toLowerCase();
  if (!m) return null;
  const todos = leerAlumnosResumen();
  let l = todos.filter(function (a) {
    return String(a.matricula).trim().toLowerCase() === m;
  });
  if (!l.length) {
    try {
      const acc = leerFilas("AccesoClaseAlumnos");
      for (let i = 0; i < acc.length; i++) {
        const f = acc[i];
        const u = String(f["Usuario"] || "").trim().toLowerCase();
        const mat = String(f["Matrícula"] || f["Matricula"] || "").trim().toLowerCase();
        if (u === m || mat === m) {
          const matReal = String(f["Matrícula"] || f["Matricula"] || f["Usuario"] || "").trim();
          l = todos.filter(function (a) {
            return String(a.matricula).trim().toLowerCase() === matReal.toLowerCase();
          });
          if (l.length) break;
          return {
            "Matrícula": matReal,
            "Nombre Completo": String(f["Nombre"] || ""),
            "Grado": String(f["Grado"] || ""),
            "Grupo": String(f["Grupo"] || ""),
            "Activo": String(f["Activo"] || "SI"),
            "Intentos extra": 0
          };
        }
      }
    } catch (eAcc) {}
  }
  if (l.length) {
    const a = l[0];
    return {
      "Matrícula": a.matricula,
      "Nombre Completo": a.nombre,
      "Grado": a.grado,
      "Grupo": a.grupo,
      "Activo": a.activo,
      "Intentos extra": a.extra || 0
    };
  }
  return null;
}

function filaAlumnoPorMatricula(matricula, grupo) {
  const filas = leerFilas("Alumnos");
  const mat = String(matricula || "").trim();
  const gru = String(grupo || "").trim().toLowerCase();
  if (!mat) return null;
  let a = null;
  if (gru) {
    a = filas.find(function (x) {
      return celdaAlumno(x, ["Matrícula", "Matricula", "No.", "N°"]) === mat &&
        String(x["Grupo"] || "").trim().toLowerCase() === gru;
    });
  }
  if (!a) {
    a = filas.find(function (x) {
      return celdaAlumno(x, ["Matrícula", "Matricula", "No.", "N°"]) === mat;
    });
  }
  return a || null;
}

function contarIntentosAlumno(matricula) {
  const mBuscada = String(matricula || "").trim().toLowerCase();
  if (!mBuscada) return 0;
  return leerResultadosDeTodasLasPestanas().filter(function (r) {
    return String(r.matricula || "").trim().toLowerCase() === mBuscada;
  }).length;
}

function intentosPermitidosDe(alumno) {
  const extraAlumno = Number(alumno["Intentos extra"] || alumno.extra || 0);
  const base = Number(leerConfig("INTENTOS_DEFAULT", "1"));
  const extraGrupo = extraGrupoDe_(alumno["Grupo"] || alumno.grupo);
  return base + extraAlumno + extraGrupo;
}

function mensajeCupoDisponible(nombre, usados, permitidos, restantes) {
  const etiqueta = permitidos === 1 ? "intento" : "intentos";
  if (usados === 0 && permitidos === 1) return "Hola, " + nombre + ". Tienes 1 intento para presentar el examen.";
  if (usados === 0) return "Hola, " + nombre + ". Tienes " + permitidos + " " + etiqueta + ". Aún no has presentado el examen.";
  const queda = restantes === 1 ? "Te queda 1 intento" : "Te quedan " + restantes + " intentos";
  return "Hola, " + nombre + ". " + queda + " de " + permitidos + ". Ya presentaste " + usados + (usados === 1 ? " vez." : " veces.");
}

function mensajeCupoAgotado(usados, permitidos) {
  if (permitidos === 1) {
    return "Ya agotaste tu 1 intento (" + usados + (usados === 1 ? " usado" : " usados") + "). Pide a un docente una oportunidad extra.";
  }
  return "Ya agotaste tus " + permitidos + " intentos (" + usados + " usados). Pide a un docente una oportunidad extra.";
}

function consultarCupoAlumno(matricula) {
  const panel = construirPanelAlumno_(matricula, { incluirInactivos: false, voz: "alumno" });
  if (!panel || !panel.ok) return panel || { ok: false, mensaje: "No se encontró al alumno." };
  const nombre = panel.alumno && panel.alumno.nombre ? panel.alumno.nombre : "";

  return {
    ok: true,
    nombre: nombre,
    usados: panel.usados,
    permitidos: panel.permitidos,
    restantes: panel.restantes,
    agotado: !!panel.agotado,
    mensaje: panel.mensaje,
    trimestral: panel.trimestral
  };
}

function altaAlumno(token, datos) {
  exigirAdmin(token);
  const p = obtenerLibro().getSheetByName("Alumnos");
  p.appendRow([
    String(datos.matricula), String(datos.nombre),
    String(datos.grado), String(datos.grupo).toLowerCase(),
    "SI", Number(datos.intentosExtra || 0)
  ]);
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Alumno dado de alta." };
}

function bajaAlumno(token, matricula) {
  exigirAdmin(token);
  const a = filaAlumnoPorMatricula(matricula);
  if (!a) throw new Error("No existe ese alumno.");
  obtenerLibro().getSheetByName("Alumnos").getRange(a._fila, 5).setValue("NO");
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Alumno dado de baja." };
}

function reactivarAlumno(token, matricula) {
  exigirAdmin(token);
  const a = filaAlumnoPorMatricula(matricula);
  if (!a) throw new Error("No existe ese alumno.");
  obtenerLibro().getSheetByName("Alumnos").getRange(a._fila, 5).setValue("SI");
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Alumno reactivado con éxito." };
}

function celdaAlumno(fila, claves) {
  for (let i = 0; i < claves.length; i++) {
    if (fila[claves[i]] != null && String(fila[claves[i]]).trim() !== "") return String(fila[claves[i]]).trim();
  }
  return "";
}

function eliminarAlumno(token, matricula, grupo) {
  exigirAdmin(token);
  const p = obtenerLibro().getSheetByName("Alumnos");
  if (!p || p.getLastRow() < 2) throw new Error("No hay alumnos registrados.");
  const filas = leerFilas("Alumnos");
  const mat = String(matricula || "").trim();
  const gru = String(grupo || "").trim().toLowerCase();
  let a = null;
  if (gru) {
    a = filas.find(function (x) {
      return celdaAlumno(x, ["Matrícula", "Matricula", "No.", "N°"]) === mat &&
        String(x["Grupo"] || "").trim().toLowerCase() === gru;
    });
  }
  if (!a) {
    a = filas.find(function (x) { return celdaAlumno(x, ["Matrícula", "Matricula", "No.", "N°"]) === mat; });
  }
  if (!a) throw new Error("No se encontró el alumno con matrícula " + mat + (gru ? (" en el grupo " + gru.toUpperCase()) : "") + ".");
  p.deleteRow(a._fila);
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Alumno eliminado definitivamente." };
}

function eliminarAlumnosMultiples(token, matriculas) {
  exigirAdmin(token);
  const items = (typeof matriculas === "string") ? JSON.parse(matriculas) : matriculas;
  if (!Array.isArray(items) || !items.length) throw new Error("No se seleccionaron alumnos.");
  const p = obtenerLibro().getSheetByName("Alumnos");
  if (!p || p.getLastRow() < 2) return { ok: true, mensaje: "Sin alumnos." };
  const filas = leerFilas("Alumnos");
  const matsSet = {};
  const pares = {};
  items.forEach(function (m) {
    if (m && typeof m === "object") {
      const mat = String(m.matricula || m.mat || "").trim();
      const gru = String(m.grupo || "").trim().toLowerCase();
      if (mat && gru) pares[mat + "|" + gru] = true;
      else if (mat) matsSet[mat] = true;
    } else {
      const s = String(m || "").trim();
      const partes = s.split("||");
      if (partes.length === 2) pares[partes[0] + "|" + partes[1].toLowerCase()] = true;
      else matsSet[s] = true;
    }
  });
  
  const conservar = [ENCABEZADOS.Alumnos];
  filas.forEach(function (a) {
    const mat = celdaAlumno(a, ["Matrícula", "Matricula", "No.", "N°"]);
    const gru = String(a["Grupo"] || "").trim().toLowerCase();
    if (pares[mat + "|" + gru] || matsSet[mat]) return;
    conservar.push([
      mat, celdaAlumno(a, ["Nombre Completo", "Nombre", "Alumno"]),
      String(a["Grado"] || ""), gru,
      String(a["Activo"] || "SI"), Number(a["Intentos extra"] || 0)
    ]);
  });
  p.clearContents();
  p.getRange(1, 1, conservar.length, ENCABEZADOS.Alumnos.length).setValues(conservar);
  p.getRange(1, 1, 1, ENCABEZADOS.Alumnos.length).setFontWeight("bold");
  invalidarCachesDatos_();
  return { ok: true, mensaje: items.length + " alumno(s) eliminado(s) de la base de datos." };
}

function cambiarGrupoAlumno(token, matricula, grupoNuevo) {
  exigirAdmin(token);
  const a = filaAlumnoPorMatricula(matricula);
  if (!a) throw new Error("No existe ese alumno.");
  const g = String(grupoNuevo).trim().toLowerCase();
  const gradoNum = normalizarGradoServer(g) || String(a["Grado"]) || "1";
  const p = obtenerLibro().getSheetByName("Alumnos");
  p.getRange(a._fila, 3).setValue(gradoNum);
  p.getRange(a._fila, 4).setValue(g);
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Alumno movido al grupo " + g.toUpperCase() + "." };
}

function cambiarGrupoAlumnosMultiples(token, matriculas, grupoNuevo) {
  exigirAdmin(token);
  if (!Array.isArray(matriculas) || !matriculas.length) throw new Error("No se seleccionaron alumnos.");
  const g = String(grupoNuevo).trim().toLowerCase();
  const gradoNum = normalizarGradoServer(g) || "1";
  const p = obtenerLibro().getSheetByName("Alumnos");
  if (!p || p.getLastRow() < 2) return { ok: true };
  const filas = leerFilas("Alumnos");
  const matsSet = {};
  matriculas.forEach(function (m) { matsSet[String(m).trim()] = true; });
  
  const matriz = [ENCABEZADOS.Alumnos];
  filas.forEach(function (a) {
    const esMod = matsSet[String(a["Matrícula"]).trim()];
    matriz.push([
      String(a["Matrícula"]), String(a["Nombre Completo"]),
      esMod ? gradoNum : String(a["Grado"]),
      esMod ? g : String(a["Grupo"]).toLowerCase(),
      String(a["Activo"] || "SI"),
      Number(a["Intentos extra"] || 0)
    ]);
  });
  p.clearContents();
  p.getRange(1, 1, matriz.length, ENCABEZADOS.Alumnos.length).setValues(matriz);
  p.getRange(1, 1, 1, ENCABEZADOS.Alumnos.length).setFontWeight("bold");
  invalidarCachesDatos_();
  return { ok: true, mensaje: matriculas.length + " alumno(s) asignado(s) al grupo " + g.toUpperCase() + "." };
}

function asignarIntentosExtra(token, matricula, extra) {
  const ses = exigirRoles_(token, ["admin", "docente", "prefecto"]);
  const a = filaAlumnoPorMatricula(matricula);
  if (!a) throw new Error("No existe ese alumno.");

  const rol = String(ses.rol || "").toLowerCase();
  const kAlu = String(a["Grado"] || "") + String(a["Grupo"] || "").toUpperCase();

  if (rol === "docente") {
    const gruposDocente = {};
    const maestroId = String(ses.maestroId || "");
    const nombreDoc = String(ses.nombre || "").toLowerCase();
    try {
      leerFilas("Horarios").forEach(function (h) {
        const m = String(h["Maestro"] || "").toLowerCase();
        if (m === nombreDoc || (maestroId && String(h["Id Maestro"] || "") === maestroId)) {
          const k = String(h["Grado"] || "") + String(h["Grupo"] || "").toUpperCase();
          gruposDocente[k] = true;
        }
      });
    } catch (eH) {}
    if (!gruposDocente[kAlu]) {
      throw new Error("Acceso denegado: no tienes asignado al grupo del alumno.");
    }
  } else if (rol === "prefecto") {
    const prefId = String(ses.prefectoId || "");
    const gruposPrefecto = {};
    try {
      leerFilas("PrefectoGrupos").forEach(function (f) {
        if (String(f["Id prefecto"] || "") === prefId) {
          const k = String(f["Grado"] || "") + String(f["Grupo"] || "").toUpperCase();
          gruposPrefecto[k] = true;
        }
      });
    } catch (eP) {}
    if (!gruposPrefecto[kAlu]) {
      throw new Error("Acceso denegado: el alumno no pertenece a los grupos asignados al prefecto.");
    }
  }

  obtenerLibro().getSheetByName("Alumnos").getRange(a._fila, 6).setValue(Number(extra || 0));
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Intentos extra actualizados." };
}

function asignarIntentosExtraAlumnosMultiples(token, matriculas, extra) {
  exigirAdmin(token);
  if (!Array.isArray(matriculas) || !matriculas.length) throw new Error("No se seleccionaron alumnos.");
  const p = obtenerLibro().getSheetByName("Alumnos");
  if (!p || p.getLastRow() < 2) return { ok: true };
  const filas = leerFilas("Alumnos");
  const matsSet = {};
  matriculas.forEach(function (m) { matsSet[String(m).trim()] = true; });
  const nExtra = Number(extra || 0);

  const matriz = [ENCABEZADOS.Alumnos];
  filas.forEach(function (a) {
    const esMod = matsSet[String(a["Matrícula"]).trim()];
    matriz.push([
      String(a["Matrícula"]), String(a["Nombre Completo"]),
      String(a["Grado"]), String(a["Grupo"]).toLowerCase(),
      String(a["Activo"] || "SI"),
      esMod ? nExtra : Number(a["Intentos extra"] || 0)
    ]);
  });
  p.clearContents();
  p.getRange(1, 1, matriz.length, ENCABEZADOS.Alumnos.length).setValues(matriz);
  p.getRange(1, 1, 1, ENCABEZADOS.Alumnos.length).setFontWeight("bold");
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Intentos extra asignados a " + matriculas.length + " alumno(s)." };
}

function generarAlumnosSimuladosAdmin(token) {
  exigirAdmin(token);
  generarAlumnosSimulados_();
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Se han generado 75 alumnos de demostración en los grupos de 1°, 2° y 3°." };
}

function vaciarMatriculaAdmin(token) {
  exigirAdmin(token);
  const p = obtenerLibro().getSheetByName("Alumnos");
  if (p) {
    p.clearContents();
    p.getRange(1, 1, 1, ENCABEZADOS.Alumnos.length).setValues([ENCABEZADOS.Alumnos]).setFontWeight("bold");
  }
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Toda la lista de alumnos ha sido vaciada." };
}

function altaGrupo(token, grado, grupo) {
  exigirAdmin(token);
  obtenerLibro().getSheetByName("Grupos").appendRow([String(grado), String(grupo).toLowerCase(), "SI", 0]);
  return { ok: true, mensaje: "Grupo creado." };
}

function asignarIntentosExtraGrupo(token, grupo, extra) {
  exigirAdmin(token);
  const filas = leerFilas("Grupos");
  const p = obtenerLibro().getSheetByName("Grupos");
  let ok = false;
  filas.forEach(function (g) {
    if (String(g["Grupo"]).toLowerCase() === String(grupo).toLowerCase()) {
      p.getRange(g._fila, 4).setValue(Number(extra || 0));
      ok = true;
    }
  });
  if (!ok) throw new Error("No existe ese grupo. Créalo primero.");
  return { ok: true, mensaje: "Intentos extra del grupo actualizados." };
}

function guardarIntentosDefault(token, valor) {
  exigirAdmin(token);
  escribirConfig_("INTENTOS_DEFAULT", String(valor));
  return { ok: true, mensaje: "Intentos por defecto actualizados." };
}

function sembrarGrupos_() {
  const libro = obtenerLibro();
  if (!libro) return;
  const p = libro.getSheetByName("Grupos");
  if (!p) return;
  if (p.getLastRow() >= 2) return;
  const ID_PRODUCCION = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  const idReal = typeof libro.getId === "function" ? String(libro.getId() || "").trim() : "";
  if (idReal === ID_PRODUCCION) {
    if (p.getLastRow() < 1) {
      p.appendRow(ENCABEZADOS.Grupos);
    }
    return;
  }
  const filas = [ENCABEZADOS.Grupos];
  ["1", "2", "3"].forEach(function (grado) {
    ["a", "b", "c", "d", "e"].forEach(function (l) { filas.push([grado, grado + l, "SI", 0]); });
  });
  p.clearContents();
  p.getRange(1, 1, filas.length, 4).setValues(filas);
  p.getRange(1, 1, 1, 4).setFontWeight("bold");
}

function uniq(lista) {
  const visto = {}, out = [];
  lista.forEach(function (x) { if (!visto[x]) { visto[x] = true; out.push(x); } });
  return out;
}

/**********************************************************************
 * DATOS DE PRUEBA Y BANCO
 **********************************************************************/
function asegurarDatosDePrueba_() {
  const libro = obtenerLibro();
  if (!libro) return;
  const ID_PRODUCCION = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  const idReal = typeof libro.getId === "function" ? String(libro.getId() || "").trim() : "";
  if (idReal === ID_PRODUCCION) return;
  const al = libro.getSheetByName("Alumnos");
  if (al && al.getLastRow() < 2) generarAlumnosSimulados_();
  completarBancoLecturas_();
  const gr = libro.getSheetByName("Grupos");
  if (gr && gr.getLastRow() < 2) sembrarGrupos_();
}

function generarAlumnosSimulados_() {
  const libro = obtenerLibro();
  if (!libro) return;
  const ID_PRODUCCION = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  const idReal = typeof libro.getId === "function" ? String(libro.getId() || "").trim() : "";
  if (idReal === ID_PRODUCCION) {
    throw new Error("BLOQUEO DE SEGURIDAD: generarAlumnosSimulados no puede ejecutarse sobre el libro de producción.");
  }
  verificarYCrearPestanas();
  const nm = ["Juan","Pedro","Luis","Carlos","Omar","Alejandro","Jorge","Miguel","Angel","David"];
  const nf = ["Mariana","Sofia","Maria","Laura","Elena","Ana","Gabriela","Camila","Fernanda","Lucia"];
  const ap = ["Martinez","Lopez","Perez","Rodriguez","Gomez","Sanchez","Hernandez","Diaz","Garcia","Flores"];
  const filas = [ENCABEZADOS.Alumnos];
  let mat = 24001;
  ["1","2","3"].forEach(function (g) {
    ["a","b","c","d","e"].forEach(function (l) {
      const grupo = g + l;
      for (let i = 0; i < 5; i++) {
        const banco = (i % 2 === 0) ? nm : nf;
        const nombre = banco[Math.floor(Math.random() * banco.length)] + " " +
          ap[Math.floor(Math.random() * ap.length)] + " " +
          ap[Math.floor(Math.random() * ap.length)];
        filas.push([String(mat++), nombre, g, grupo, "SI", 0]);
      }
    });
  });
  const p = libro.getSheetByName("Alumnos");
  p.clearContents();
  p.getRange(1, 1, filas.length, ENCABEZADOS.Alumnos.length).setValues(filas);
  p.getRange(1, 1, 1, ENCABEZADOS.Alumnos.length).setFontWeight("bold");
  sembrarGrupos_();
}

function temasBancoPorAsignatura() {
  return {
    "Español": "La bitácora del taller",
    "Historia": "La independencia en el barrio",
    "Ciencias": "El ciclo del agua en la ciudad",
    "Formación Cívica y Ética": "Normas y acuerdos escolares",
    "Tecnología": "Ahorrar energía en el aula",
    "Matemáticas": "Medir y comparar datos del patio"
  };
}

function completarBancoLecturas_(forzar) {
  const libro = obtenerLibro();
  if (!libro) return;
  const props = PropertiesService.getScriptProperties();
  const entorno = String(props.getProperty("ENTORNO") || "").trim().toUpperCase();
  const idConfig = String(props.getProperty("HOJA_ID") || "").trim();
  const ID_PRODUCCION = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  const idReal = typeof libro.getId === "function" ? String(libro.getId() || "").trim() : "";
  const esProduccion = (entorno === "PRODUCCION" || idReal === ID_PRODUCCION || idConfig === ID_PRODUCCION);

  // En producción NUNCA se permite reconstrucción forzada destructiva
  if (esProduccion && forzar) {
    forzar = false;
  }

  // En pruebas, solo se permite forzar si el entorno y libro están inequívocamente autorizados
  const esPruebasAutorizado = (entorno === "PRUEBAS" && !esProduccion && idConfig && idReal && idReal === idConfig && idReal !== ID_PRODUCCION);
  if (forzar && !esPruebasAutorizado) {
    forzar = false;
  }

  let p = libro.getSheetByName("Lecturas");
  if (!p) { verificarYCrearPestanas(); p = libro.getSheetByName("Lecturas"); }
  if (!p) return;
  if (!forzar && p.getLastRow() >= 2) return;

  const temas = temasBancoPorAsignatura();
  const catalogoDefault = [];
  ["1","2","3"].forEach(function (g) {
    ASIGNATURAS_DEFAULT.forEach(function (asig) {
      catalogoDefault.push(construirLecturaBanco(g, asig, temas[asig]));
    });
  });

  const pPreg = libro.getSheetByName("Preguntas");

  if (forzar) {
    // Reconstrucción forzada destructiva: permitida ÚNICAMENTE en entorno de pruebas autorizado
    p.clearContents();
    const filas = [ENCABEZADOS.Lecturas].concat(catalogoDefault.map(filaLectura));
    p.getRange(1, 1, filas.length, ENCABEZADOS.Lecturas.length).setValues(filas);
    p.getRange(1, 1, 1, ENCABEZADOS.Lecturas.length).setFontWeight("bold");

    if (pPreg) {
      pPreg.clearContents();
      pPreg.appendRow(ENCABEZADOS.Preguntas);
      pPreg.getRange(1, 1, 1, ENCABEZADOS.Preguntas.length).setFontWeight("bold");
      const filasPreg = [];
      catalogoDefault.forEach(function (item) {
        (item.preguntas || []).forEach(function (pr, i) {
          filasPreg.push(filaPreguntaParaHoja(item.id, i + 1, pr));
        });
      });
      if (filasPreg.length) {
        pPreg.getRange(2, 1, filasPreg.length, ENCABEZADOS.Preguntas.length).setValues(filasPreg);
      }
    }
    formatearHojasDeLectura();
    return;
  }

  // Flujo ordinario / no forzado: PRESERVAR registros existentes sin borrar nada
  if (p.getLastRow() < 1) {
    p.getRange(1, 1, 1, ENCABEZADOS.Lecturas.length).setValues([ENCABEZADOS.Lecturas]).setFontWeight("bold");
  }

  const idsExistentes = {};
  if (p.getLastRow() >= 2) {
    const vals = p.getRange(2, 1, p.getLastRow() - 1, 1).getValues();
    vals.forEach(function (r) {
      const id = String(r[0] || "").trim();
      if (id) idsExistentes[id] = true;
    });
  }

  const lecturasFaltantes = catalogoDefault.filter(function (item) {
    return !idsExistentes[item.id];
  });

  if (lecturasFaltantes.length > 0) {
    const filasParaAgregar = lecturasFaltantes.map(filaLectura);
    const startRow = p.getLastRow() + 1;
    p.getRange(startRow, 1, filasParaAgregar.length, ENCABEZADOS.Lecturas.length).setValues(filasParaAgregar);
  }

  if (pPreg) {
    if (pPreg.getLastRow() < 1) {
      pPreg.getRange(1, 1, 1, ENCABEZADOS.Preguntas.length).setValues([ENCABEZADOS.Preguntas]).setFontWeight("bold");
    }
    const clavesPregExistentes = {};
    if (pPreg.getLastRow() >= 2) {
      const numCols = Math.min(Math.max(pPreg.getLastColumn(), 1), ENCABEZADOS.Preguntas.length);
      const datosPreg = pPreg.getRange(2, 1, pPreg.getLastRow() - 1, numCols).getValues();
      datosPreg.forEach(function (r) {
        const idLec = String(r[0] || "").trim();
        const numP = String(r[1] || "").trim();
        if (idLec && numP) {
          clavesPregExistentes[idLec + "_" + numP] = true;
        }
      });
    }

    const filasPregNuevas = [];
    catalogoDefault.forEach(function (item) {
      (item.preguntas || []).forEach(function (pr, i) {
        const numP = i + 1;
        const clave = item.id + "_" + numP;
        if (!clavesPregExistentes[clave]) {
          filasPregNuevas.push(filaPreguntaParaHoja(item.id, numP, pr));
        }
      });
    });

    if (filasPregNuevas.length > 0) {
      const startRowPreg = pPreg.getLastRow() + 1;
      pPreg.getRange(startRowPreg, 1, filasPregNuevas.length, ENCABEZADOS.Preguntas.length).setValues(filasPregNuevas);
    }
  }

  formatearHojasDeLectura();
}

function filaLectura(item) {
  return [
    item.id, item.grado, item.asignatura, item.tema, item.texto,
    contarPalabras(item.texto), JSON.stringify(item.preguntas), "SI", item.origen || "BANCO"
  ];
}

function construirLecturaBanco(grado, asignatura, tema) {
  const spec = especificacionesDeGrado(grado);
  const pack = contenidoTematico(asignatura);
  const temaFinal = tema || pack.tema;
  let texto = asegurarFormatoLibro(pack.texto);
  texto = expandirTextoHasta(texto, spec.objetivoPalabras, grado, asignatura, temaFinal, pack.relleno);
  texto = ajustarTextoAEspecificacion(texto, grado, asignatura, temaFinal, spec);
  const preguntas = seleccionarReactivosPorGrado(grado, asignatura);
  return {
    id: "BANCO_" + grado + "_" + asignatura.replace(/\s+/g, "").substring(0, 10),
    grado: grado, asignatura: asignatura, tema: temaFinal,
    texto: texto, preguntas: preguntas, origen: "BANCO"
  };
}

/**********************************************************************
 * UTILIDADES DE TEXTO
 **********************************************************************/
function contarPalabras(texto) {
  const sinHtml = String(texto || "").replace(/<[^>]+>/g, " ").replace(/&[a-z0-9#]+;/gi, " ");
  return sinHtml.trim().split(/\s+/).filter(Boolean).length;
}

function asegurarFormatoLibro(texto) {
  const t = String(texto || "").replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!t) return "";
  if (/\n\s*\n/.test(t)) return t;
  const ors = t.match(/[^.!?]+[.!?]+(?:["»”']*)(?:\s+|$)|[^.!?]+$/g);
  if (!ors || ors.length < 4) return t;
  const gs = []; let buf = [];
  ors.forEach(function (o) {
    buf.push(o.trim());
    if (buf.length >= 3) { gs.push(buf.join(" ")); buf = []; }
  });
  if (buf.length) gs.push(buf.join(" "));
  return gs.join("\n\n");
}

function expandirTextoHasta(texto, minimo, grado, asignatura, tema, rellenoExtra) {
  const bloques = [];
  const usados = {};
  if (rellenoExtra) rellenoExtra.forEach(function (b) { bloques.push(String(b).trim()); });
  parrafosContinuacion(grado, asignatura, tema).forEach(function (b) { bloques.push(b); });
  bloques.forEach(function (b, i) { usados[b] = i; });

  let t = asegurarFormatoLibro(texto);
  let i = 0;
  let vueltas = 0;
  while (contarPalabras(t) < minimo && i < bloques.length) {
    const bloque = bloques[i];
    if (t.indexOf(bloque) < 0) t += "\n\n" + bloque;
    i++;
    if (i >= bloques.length && contarPalabras(t) < minimo) {
      vueltas++;
      if (vueltas >= 1) break; // no repetimos
      i = 0;
    }
  }
  return t.trim();
}
