/**********************************************************************
 * BIBLIOTECA DE RECURSOS Y LIBROS DE TEXTO OFICIALES SEP — ST90
 * Backend (Google Apps Script)
 **********************************************************************/

/**
 * Catálogo curricular de Libros de Texto Gratuitos Oficiales SEP (Fase 6 - Secundaria).
 * Proporciona acceso directo a los libros por grado y campo formativo.
 */
function catalogoLibrosSEPOficiales_() {
  return [
    // 1er Grado
    {
      id: "SEP-1-LEN",
      titulo: "Lenguajes 1° de Secundaria",
      grado: "1",
      asignatura: "Español",
      campoFormativo: "Lenguajes",
      tipo: "Libro SEP",
      editorial: "CONALITEG / SEP",
      urlOficial: "https://libros.conaliteg.gob.mx/secundaria.html",
      descripcion: "Libro de texto oficial para primer grado: proyectos de comunicación oral, escrita y manifestaciones artísticas."
    },
    {
      id: "SEP-1-SAB",
      titulo: "Saberes y Pensamiento Científico 1°",
      grado: "1",
      asignatura: "Ciencias",
      campoFormativo: "Saberes y Pensamiento Científico",
      tipo: "Libro SEP",
      editorial: "CONALITEG / SEP",
      urlOficial: "https://libros.conaliteg.gob.mx/secundaria.html",
      descripcion: "Biología y Matemáticas articuladas en proyectos de indagación y pensamiento crítico."
    },
    {
      id: "SEP-1-ETI",
      titulo: "Ética, Naturaleza y Sociedades 1°",
      grado: "1",
      asignatura: "Geografía",
      campoFormativo: "Ética, Naturaleza y Sociedades",
      tipo: "Libro SEP",
      editorial: "CONALITEG / SEP",
      urlOficial: "https://libros.conaliteg.gob.mx/secundaria.html",
      descripcion: "Geografía, Historia y Formación Cívica y Ética orientadas a la ciudadanía crítica."
    },
    {
      id: "SEP-1-HUM",
      titulo: "De lo Humano y lo Comunitario 1°",
      grado: "1",
      asignatura: "Tecnología",
      campoFormativo: "De lo Humano y lo Comunitario",
      tipo: "Libro SEP",
      editorial: "CONALITEG / SEP",
      urlOficial: "https://libros.conaliteg.gob.mx/secundaria.html",
      descripcion: "Tecnología, Tutoría / Educación Socioemocional y Educación Física en el CECSE y la comunidad."
    },
    // 2do Grado
    {
      id: "SEP-2-LEN",
      titulo: "Lenguajes 2° de Secundaria",
      grado: "2",
      asignatura: "Español",
      campoFormativo: "Lenguajes",
      tipo: "Libro SEP",
      editorial: "CONALITEG / SEP",
      urlOficial: "https://libros.conaliteg.gob.mx/secundaria.html",
      descripcion: "Profundización en la lectura dialógica, diversidad lingüística e investigación documental."
    },
    {
      id: "SEP-2-SAB",
      titulo: "Saberes y Pensamiento Científico 2° (Física y Matemáticas)",
      grado: "2",
      asignatura: "Ciencias",
      campoFormativo: "Saberes y Pensamiento Científico",
      tipo: "Libro SEP",
      editorial: "CONALITEG / SEP",
      urlOficial: "https://libros.conaliteg.gob.mx/secundaria.html",
      descripcion: "Física y Matemáticas con enfoque experimental y modelación comunitaria."
    },
    {
      id: "SEP-2-ETI",
      titulo: "Ética, Naturaleza y Sociedades 2° (Historia y FCyE)",
      grado: "2",
      asignatura: "Historia",
      campoFormativo: "Ética, Naturaleza y Sociedades",
      tipo: "Libro SEP",
      editorial: "CONALITEG / SEP",
      urlOficial: "https://libros.conaliteg.gob.mx/secundaria.html",
      descripcion: "Procesos históricos de México y construcción de identidades colectivas."
    },
    {
      id: "SEP-2-HUM",
      titulo: "De lo Humano y lo Comunitario 2° (Tecnología y Datos)",
      grado: "2",
      asignatura: "Tecnología",
      campoFormativo: "De lo Humano y lo Comunitario",
      tipo: "Libro SEP",
      editorial: "CONALITEG / SEP",
      urlOficial: "https://libros.conaliteg.gob.mx/secundaria.html",
      descripcion: "Ofimática intermedia: hojas de cálculo (Excel), procesamiento de datos y proyectos CECSE."
    },
    // 3er Grado
    {
      id: "SEP-3-LEN",
      titulo: "Lenguajes 3° de Secundaria",
      grado: "3",
      asignatura: "Español",
      campoFormativo: "Lenguajes",
      tipo: "Libro SEP",
      editorial: "CONALITEG / SEP",
      urlOficial: "https://libros.conaliteg.gob.mx/secundaria.html",
      descripcion: "Argumentación crítica, debate, ensayos y difusión de saberes comunitarios."
    },
    {
      id: "SEP-3-SAB",
      titulo: "Saberes y Pensamiento Científico 3° (Química y Matemáticas)",
      grado: "3",
      asignatura: "Ciencias",
      campoFormativo: "Saberes y Pensamiento Científico",
      tipo: "Libro SEP",
      editorial: "CONALITEG / SEP",
      urlOficial: "https://libros.conaliteg.gob.mx/secundaria.html",
      descripcion: "Química, sustentabilidad y modelos matemáticos avanzados."
    },
    {
      id: "SEP-3-ETI",
      titulo: "Ética, Naturaleza y Sociedades 3° (Historia Contemporánea y Ciudadanía)",
      grado: "3",
      asignatura: "Historia",
      campoFormativo: "Ética, Naturaleza y Sociedades",
      tipo: "Libro SEP",
      editorial: "CONALITEG / SEP",
      urlOficial: "https://libros.conaliteg.gob.mx/secundaria.html",
      descripcion: "Democracia, derechos humanos y el rol de los adolescentes en el porvenir nacional."
    },
    {
      id: "SEP-3-HUM",
      titulo: "De lo Humano y lo Comunitario 3° (Tecnología, IA y Proyecto de Vida)",
      grado: "3",
      asignatura: "Tecnología",
      campoFormativo: "De lo Humano y lo Comunitario",
      tipo: "Libro SEP",
      editorial: "CONALITEG / SEP",
      urlOficial: "https://libros.conaliteg.gob.mx/secundaria.html",
      descripcion: "Presentaciones (PowerPoint), herramientas de Inteligencia Artificial (IA) y prácticas en el CECSE."
    }
  ];
}

/**
 * Sube o registra un recurso pedagógico en la Biblioteca Escolar.
 * Requiere rol de docente o administrador.
 * Columnas: [Id, Titulo, Tipo, Asignatura, Grado, Trimestre, URL_Drive, Autor, Fecha]
 */
function subirRecursoBiblioteca(token, datos) {
  const ses = exigirClaseRol_(token, ["admin", "maestro"]);
  if (!datos || typeof datos !== "object") {
    throw new Error("Datos de recurso inválidos.");
  }

  const titulo = String(datos.titulo || datos.Titulo || "").trim();
  if (!titulo) {
    throw new Error("El título del recurso es obligatorio.");
  }

  const tipo = String(datos.tipo || datos.Tipo || "Documento").trim();
  const asignatura = String(datos.asignatura || datos.Asignatura || "General").trim();
  const grado = String(datos.grado || datos.Grado || "Todos").trim();
  const trimestre = String(datos.trimestre || datos.Trimestre || "Todos").trim();
  const urlDrive = String(datos.urlDrive || datos.URL_Drive || datos.url || "").trim();
  
  if (!urlDrive) {
    throw new Error("Debes proporcionar un enlace o URL de Drive válido para el recurso.");
  }

  const autor = normalizarNombrePref_((ses && (ses.maestroNombre || ses.nombre)) || "Docente");
  const id = "REC-" + Utilities.getUuid().slice(0, 8).toUpperCase();
  const fechaStr = new Date().toISOString().slice(0, 19).replace("T", " ");

  const lock = LockService.getScriptLock();
  lock.waitLock(12000);
  try {
    const libro = _obtenerLibro_();
    if (!libro) throw new Error("No se pudo acceder al libro de base de datos.");
    
    let hoja = libro.getSheetByName("BibliotecaRecursos");
    if (!hoja) {
      _asegurarSetup_();
      hoja = libro.getSheetByName("BibliotecaRecursos");
      if (!hoja) throw new Error("No se pudo inicializar la pestaña BibliotecaRecursos.");
    }

    const fila = [id, titulo, tipo, asignatura, grado, trimestre, urlDrive, autor, fechaStr];
    hoja.appendRow(fila);

    return {
      ok: true,
      mensaje: "Recurso compartido exitosamente en la Biblioteca Colectiva.",
      id: id,
      recurso: {
        id: id,
        titulo: titulo,
        tipo: tipo,
        asignatura: asignatura,
        grado: grado,
        trimestre: trimestre,
        urlDrive: urlDrive,
        autor: autor,
        fecha: fechaStr
      }
    };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Consulta y filtra los recursos disponibles en la Biblioteca Escolar.
 * Permite acceso tanto a docentes como a estudiantes del aula.
 */
function listarRecursosBiblioteca(arg1, arg2) {
  let f = {};
  if (arg2 && typeof arg2 === "object") {
    f = arg2;
  } else if (arg1 && typeof arg1 === "object") {
    f = arg1;
  }
  const fAsig = String(f.asignatura || f.Asignatura || "").trim().toLowerCase();
  const fGrado = String(f.grado || f.Grado || "").trim();
  const fTrim = String(f.trimestre || f.Trimestre || "").trim();
  const fTipo = String(f.tipo || f.Tipo || "").trim().toLowerCase();
  const q = String(f.q || f.buscar || f.texto || "").trim().toLowerCase();

  const filas = _leerFilas_("BibliotecaRecursos") || [];
  const normalizados = filas.map(function (row) {
    return {
      id: String(row["Id"] || row["ID"] || "").trim(),
      titulo: String(row["Titulo"] || row["Título"] || "").trim(),
      tipo: String(row["Tipo"] || "Documento").trim(),
      asignatura: String(row["Asignatura"] || "General").trim(),
      grado: String(row["Grado"] || "Todos").trim(),
      trimestre: String(row["Trimestre"] || "Todos").trim(),
      urlDrive: String(row["URL_Drive"] || row["UrlDrive"] || row["URL"] || "").trim(),
      autor: String(row["Autor"] || "").trim(),
      fecha: String(row["Fecha"] || "").trim()
    };
  }).filter(function (r) {
    return r.id && r.titulo;
  });

  // Filtrado reactivo
  const filtrados = normalizados.filter(function (r) {
    if (fAsig && fAsig !== "todos" && fAsig !== "general" && r.asignatura.toLowerCase() !== fAsig && r.asignatura.toLowerCase() !== "general") {
      return false;
    }
    if (fGrado && fGrado !== "todos" && r.grado !== "Todos" && r.grado !== fGrado) {
      return false;
    }
    if (fTrim && fTrim !== "todos" && r.trimestre !== "Todos" && r.trimestre !== fTrim) {
      return false;
    }
    if (fTipo && fTipo !== "todos" && r.tipo.toLowerCase() !== fTipo) {
      return false;
    }
    if (q) {
      const match = r.titulo.toLowerCase().indexOf(q) !== -1 ||
                    r.autor.toLowerCase().indexOf(q) !== -1 ||
                    r.asignatura.toLowerCase().indexOf(q) !== -1;
      if (!match) return false;
    }
    return true;
  });

  // Obtener catálogo de libros SEP oficiales
  const librosSep = catalogoLibrosSEPOficiales_().filter(function (l) {
    if (fGrado && fGrado !== "todos" && l.grado !== fGrado) return false;
    if (fAsig && fAsig !== "todos" && l.asignatura.toLowerCase() !== fAsig) return false;
    if (q) {
      const match = l.titulo.toLowerCase().indexOf(q) !== -1 ||
                    l.campoFormativo.toLowerCase().indexOf(q) !== -1 ||
                    l.asignatura.toLowerCase().indexOf(q) !== -1;
      if (!match) return false;
    }
    return true;
  });

  return {
    ok: true,
    totalRecursos: filtrados.length,
    recursos: filtrados,
    librosSEP: librosSep
  };
}

/**
 * Elimina un recurso de la Biblioteca (solo el autor o administrador).
 */
function eliminarRecursoBiblioteca(token, idRecurso) {
  const ses = exigirClaseRol_(token, ["admin", "maestro"]);
  const idLimpio = String(idRecurso || "").trim();
  if (!idLimpio) throw new Error("ID de recurso no especificado.");

  const lock = LockService.getScriptLock();
  lock.waitLock(12000);
  try {
    const libro = _obtenerLibro_();
    if (!libro) throw new Error("No se pudo acceder a la base de datos.");
    const hoja = libro.getSheetByName("BibliotecaRecursos");
    if (!hoja || hoja.getLastRow() < 2) throw new Error("No hay recursos registrados.");

    const datos = hoja.getDataRange().getValues();
    const enc = datos[0];
    const idxId = enc.indexOf("Id");
    const idxAutor = enc.indexOf("Autor");
    if (idxId === -1) throw new Error("Columna Id no encontrada en BibliotecaRecursos.");

    const yo = normalizarNombrePref_((ses && (ses.maestroNombre || ses.nombre)) || "");
    const esAdmin = String(ses.rol || "").toLowerCase() === "admin";

    let filaBorrar = -1;
    for (let i = 1; i < datos.length; i++) {
      if (String(datos[i][idxId]).trim() === idLimpio) {
        const autorFila = normalizarNombrePref_(String(datos[i][idxAutor] || ""));
        if (!esAdmin && autorFila !== yo) {
          throw new Error("No tienes autorización para eliminar el recurso de otro docente.");
        }
        filaBorrar = i + 1;
        break;
      }
    }

    if (filaBorrar === -1) {
      throw new Error("Recurso no encontrado para eliminar.");
    }

    hoja.deleteRow(filaBorrar);
    return { ok: true, mensaje: "Recurso eliminado correctamente de la biblioteca." };
  } finally {
    lock.releaseLock();
  }
}
