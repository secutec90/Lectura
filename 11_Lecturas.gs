/**********************************************************************
 * LECTURAS — GUARDAR / ACTIVAR / IA
 **********************************************************************/
function guardarLecturaBanco(token, lectura) {
  exigirAdmin(token);
  _asegurarSetup_();
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const grado = String((lectura && lectura.grado) || "").trim();
    const asig = String((lectura && lectura.asignatura) || "").trim();
    const tema = String((lectura && lectura.tema) || "").trim();
    const texto = asegurarFormatoLibro((lectura && lectura.texto) || "");
    if (!grado || !asig || !tema) throw new Error("Elige grado, asignatura y tema.");
    if (contarPalabras(texto) < 40) throw new Error("El texto es demasiado corto.");
    const preguntas = (lectura.preguntas || []).map(normalizarPreguntaAdmin).filter(Boolean);
    if (!preguntas.length) throw new Error("Agrega al menos una pregunta con 2 opciones y marca la correcta.");

    let id = String((lectura && lectura.id) || "").trim();
    if (!id) id = "DOC_" + Date.now();
    const fila = [
      id, grado, asig, tema, texto,
      contarPalabras(texto), JSON.stringify(preguntas),
      String((lectura && lectura.activa) || "SI"), "DOCENTE"
    ];
    const p = _obtenerLibro_().getSheetByName("Lecturas");
    const exist = buscarLecturaPorId(id);
    if (exist) p.getRange(exist._fila, 1, 1, ENCABEZADOS.Lecturas.length).setValues([fila]);
    else p.appendRow(fila);

    reemplazarPreguntasDeLectura_(id, preguntas);
    invalidarCachesDatos_();
    return { ok: true, id: id, palabras: contarPalabras(texto), mensaje: "Lectura guardada." };
  } finally { lock.releaseLock(); }
}

function cambiarActivaLectura(token, id, activa) {
  exigirAdmin(token);
  const l = buscarLecturaPorId(id);
  if (!l) throw new Error("No se encontró esa lectura.");
  const v = (activa === true || activa === "SI" || activa === "true") ? "SI" : "NO";
  _obtenerLibro_().getSheetByName("Lecturas").getRange(l._fila, 8).setValue(v);
  invalidarCachesDatos_();
  return { ok: true, mensaje: v === "SI" ? "Lectura activada." : "Lectura ocultada." };
}

function eliminarLectura(token, id) {
  exigirAdmin(token);
  const l = buscarLecturaPorId(id);
  if (!l) throw new Error("No se encontró esa lectura.");
  const p = _obtenerLibro_().getSheetByName("Lecturas");
  p.deleteRow(l._fila);
  
  const pPreg = _obtenerLibro_().getSheetByName("Preguntas");
  if (pPreg && pPreg.getLastRow() >= 2) {
    const filasPreg = _leerFilas_("Preguntas");
    const filasConservar = filasPreg.filter(function (x) {
      return String(x["ID Lectura"]) !== String(id);
    });
    pPreg.clearContents();
    pPreg.appendRow(ENCABEZADOS.Preguntas);
    pPreg.getRange(1, 1, 1, ENCABEZADOS.Preguntas.length).setFontWeight("bold");
    if (filasConservar.length) {
      const matriz = filasConservar.map(function (x) {
        return filaPreguntaParaHoja(x["ID Lectura"], x["Orden"] || 1, {
          p: x["Enunciado"] || "",
          opciones: [x["Opción 1"], x["Opción 2"], x["Opción 3"], x["Opción 4"], x["Opción 5"], x["Opción 6"]],
          respuesta: x["Respuesta correcta"] || "",
          nivel: x["Nivel"] || ""
        });
      });
      pPreg.getRange(2, 1, matriz.length, ENCABEZADOS.Preguntas.length).setValues(matriz);
    }
  }
  invalidarCachesDatos_();
  return { ok: true, mensaje: "Lectura eliminada del banco." };
}

function generarLecturaAdmin(token, grado, asignatura, tema) {
  exigirAdmin(token);
  _asegurarSetup_();
  const spec = especificacionesDeGrado(grado);
  const paquete = _generarPaqueteIaOLocal_(grado, asignatura, tema, spec);
  const id = "LEC_" + Date.now();
  _obtenerLibro_().getSheetByName("Lecturas").appendRow([
    id, String(grado), asignatura, tema, paquete.texto,
    contarPalabras(paquete.texto), JSON.stringify(paquete.preguntas), "SI", paquete.origen
  ]);
  reemplazarPreguntasDeLectura_(id, paquete.preguntas || []);
  _formatearHojasDeLectura_();
  return { ok: true, id: id, palabras: contarPalabras(paquete.texto), origen: paquete.origen };
}

function _generarPaqueteIaOLocal_(grado, asignatura, tema, spec) {
  const clave = obtenerClaveDeepSeek_();
  if (clave) {
    try {
      const ia = _pedirLecturaDeepSeek_(clave, grado, asignatura, tema, spec);
      if (ia) return ia;
    } catch (e) { Logger.log(e.message); }
  }
  return lecturaLocalAdministrador(grado, asignatura, tema, spec);
}

function _pedirLecturaDeepSeek_(clave, grado, asignatura, tema, spec) {
  const instruccion = "Eres un especialista pedagógico de la " + NOMBRE_ESCUELA + " y experto en diseño psicométrico y reactivos de evaluación de comprensión lectora (Fase 6: Educación Secundaria - NEM).\n" +
    "Genera UNA lectura de comprensión contextualizada, formativa y profunda para alumnos de " + grado + "° de secundaria, en la asignatura \"" + asignatura + "\", sobre el tema / PDA: \"" + tema + "\".\n\n" +
    "Especificaciones pedagógicas y del texto:\n" +
    "- Grado escolar: " + grado + "° de secundaria.\n" +
    "- Extensión: entre " + spec.palabrasMin + " y " + spec.palabrasMax + " palabras (ideal: " + spec.objetivoPalabras + " palabras).\n" +
    "- Tipo de texto: " + spec.tipo + ".\n" +
    "- Gramática y estilo: " + spec.gramatica + ".\n" +
    "- Párrafos: Redacta entre 5 y 8 párrafos bien estructurados separados por doble salto de línea (\\n\\n).\n\n" +
    "Reglas estrictas para el diseño de las " + spec.objetivoPreguntas + " preguntas y sus opciones (Reactivos de alto rigor):\n" +
    "1. NIVEL DE COMPRENSIÓN: Etiqueta CADA pregunta con \"nivel\": \"literal\", \"inferencial\" o \"critica\".\n" +
    "   - literal: datos explícitos del texto (hechos, nombres, lugares, secuencia).\n" +
    "   - inferencial: leer entre líneas (causa-efecto, idea principal, significado por contexto).\n" +
    "   - critica: propósito del autor, postura, evaluar una afirmación.\n" +
    (String(grado) === "1"
      ? "   Para 1°: mayoría literal y algunas inferenciales. Evita crítica.\n"
      : (String(grado) === "2"
        ? "   Para 2°: mezcla de inferencial y literal; puedes incluir 1 crítica.\n"
        : "   Para 3°: mezcla de las tres, con énfasis en crítica e inferencial.\n")) +
    "2. DISTRACTORES ALTAMENTE PLAUSIBLES: Las 3 opciones incorrectas NO deben ser absurdas ni cómicas. Deben basarse en ideas mencionadas en la lectura pero aplicadas incorrectamente, confusiones conceptuales comunes o interpretaciones lógicas alternativas.\n" +
    "3. HOMOGENEIDAD Y LONGITUD: Las 4 opciones (A, B, C, D) deben tener una longitud similar, la misma estructura sintáctica y el mismo tono formal. Evita que la respuesta correcta sea la más larga, detallada o evidente.\n" +
    "4. SIN PISTAS GRAMATICALES: Evita palabras delatoras o absolutos (como 'siempre', 'nunca', 'todos') exclusivamente en los distractores.\n" +
    "5. PRECISIÓN: Solo UNA opción debe ser irrefutablemente correcta y respaldada por el texto.\n\n" +
    "Devuelve ÚNICAMENTE un objeto JSON válido con este formato exacto:\n" +
    "{\n" +
    "  \"texto\": \"Párrafo 1...\\n\\nPárrafo 2...\\n\\nPárrafo 3...\",\n" +
    "  \"preguntas\": [\n" +
    "    {\n" +
    "      \"p\": \"¿Enunciado de la pregunta...?\",\n" +
    "      \"opciones\": [\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"],\n" +
    "      \"respuesta\": \"Opción correcta exacta\",\n" +
    "      \"nivel\": \"literal\"\n" +
    "    }\n" +
    "  ]\n" +
    "}";
  const r = UrlFetchApp.fetch(URL_BASE_DEEPSEEK, {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + clave },
    payload: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: instruccion }],
      response_format: { type: "json_object" },
      temperature: 0.4
    }),
    muteHttpExceptions: true
  });
  if (r.getResponseCode() < 200 || r.getResponseCode() >= 300) return null;
  const j = JSON.parse(r.getContentText());
  const contenido = j.choices[0].message.content;
  let datos;
  if (typeof contenido === "string") {
    const bloque = contenido.match(/```(?:json)?\s*([\s\S]*?)```/i);
    datos = JSON.parse((bloque ? bloque[1] : contenido).trim());
  } else datos = contenido;
  if (!datos || !datos.texto || !datos.preguntas) return null;
  const preguntas = (datos.preguntas || []).map(function (pr) {
    const nrm = homogeneizarPregunta(pr) || normalizarPreguntaAdmin(pr);
    if (!nrm) return null;
    nrm.nivel = normalizarNivelComprension(pr.nivel || nrm.nivel);
    return nrm;
  }).filter(Boolean);
  if (!preguntas.length) return null;
  return { texto: asegurarFormatoLibro(datos.texto), preguntas: preguntas, origen: "IA" };
}

function lecturaLocalAdministrador(grado, asignatura, tema) {
  const pack = construirLecturaBanco(String(grado), asignatura, tema || "");
  return { texto: pack.texto, preguntas: pack.preguntas, origen: "BANCO" };
}

function limpiarHtmlLectura(texto) {
  return String(texto || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function partirParrafosLectura(texto) {
  return String(texto || "").split(/\n\s*\n/).map(function (p) {
    return p.replace(/\s+/g, " ").trim();
  }).filter(Boolean);
}

function compactarParrafosLectura(texto, objetivo) {
  objetivo = objetivo || 6;
  const partes = partirParrafosLectura(texto);
  if (partes.length <= 8 && partes.length >= 5) return partes.join("\n\n");
  if (partes.length <= objetivo) return partes.join("\n\n");
  const grupo = Math.max(1, Math.ceil(partes.length / objetivo));
  const out = [];
  for (let i = 0; i < partes.length; i += grupo) {
    out.push(partes.slice(i, i + grupo).join(" "));
  }
  while (out.length > 8) {
    const b = out.pop();
    out[out.length - 1] += " " + b;
  }
  return out.join("\n\n");
}

function recortarTextoHasta(texto, maximo) {
  let partes = partirParrafosLectura(texto);
  while (partes.length > 5 && contarPalabras(partes.join("\n\n")) > maximo) {
    partes.pop();
  }
  let t = partes.join("\n\n");
  if (contarPalabras(t) <= maximo) return t;
  const palabras = t.split(/\s+/);
  return palabras.slice(0, maximo).join(" ").replace(/\s+[^\s]*$/, "").trim();
}

function ajustarTextoAEspecificacion(texto, grado, asignatura, tema, spec) {
  let t = asegurarFormatoLibro(limpiarHtmlLectura(texto));
  if (contarPalabras(t) < spec.palabrasMin) {
    const pack = contenidoTematico(asignatura);
    t = expandirTextoHasta(t, spec.objetivoPalabras, grado, asignatura, tema, pack.relleno);
  }
  t = compactarParrafosLectura(t, 6);
  if (contarPalabras(t) < spec.palabrasMin) {
    const pack = contenidoTematico(asignatura);
    t = expandirTextoHasta(t, spec.objetivoPalabras, grado, asignatura, tema, pack.relleno);
    t = compactarParrafosLectura(t, 6);
  }
  if (contarPalabras(t) > spec.palabrasMax) t = recortarTextoHasta(t, spec.palabrasMax);
  if (contarPalabras(t) < spec.palabrasMin) {
    const pack = contenidoTematico(asignatura);
    t = expandirTextoHasta(t, spec.palabrasMin, grado, asignatura, tema, pack.relleno);
  }
  return asegurarFormatoLibro(t);
}

function esOpcionAbsurda(o) {
  return /decorar el sal[oó]n|cancelar el taller|evitar leer|gan[oó] el recreo|color del mural|hora de salida|un tren|un radio|un globo|aeropuerto|r[ií]o nuevo|f[aá]brica de globos|otro pa[ií]s|cables no existen|planta seca|un ticket|un contrato|un recado|examen de ingl[eé]s|copiar de internet|esperar al examen|no usar verbos|otro idioma|borrar la bit[aá]cora|asusta|solo el atole|calles no tienen nombre|independencia no existi[oó]|el sol ya no calienta|nubes son artificiales|concurso de relojes|apagar el sol|cambiar el clima|mural bonito|porque es recreo|no hay reglamento|luz no existe|18 por ciento es imposible|color del letrero|hora del recreo|matr[ií]cula nueva|decorar la tabla|evitar medir|ganar el partido|datos no importan|f[uú]tbol no existe|receta de cocina|adivinanza|chiste del recreo|cerrar la escuela|el mural se cierra|celular es obligatorio|solo chistes|nombres de maestros|expulsar alumnos|quitar el mural|prohibir el recreo|borrar el reglamento|cancelar clases|romper el huerto|perder el mapa|se sec[oó] el mar|inund[oó] la escuela para siempre|fondo del oc[eé]ano|atm[oó]sfera superior|en los polos|ra[ií]z de un [aá]rbol|precio del bal[oó]n|cerrar el patio|quitar el recreo|inventar los n[uú]meros|dejar de contar|el texto no menciona|no observar nada/i.test(String(o || ""));
}

function esReactivoRelleno(en) {
  return /reactivo\s*\d+/i.test(String(en || ""));
}

function homogeneizarPregunta(pr) {
  const nrm = normalizarPreguntaAdmin(pr);
  if (!nrm) return null;
  let ops = nrm.opciones.slice();
  const correcta = nrm.respuesta;
  ops = ops.filter(function (o) { return !esOpcionAbsurda(o) || o === correcta; });
  if (ops.indexOf(correcta) < 0) ops.unshift(correcta);
  const unicas = [];
  ops.forEach(function (o) { if (unicas.indexOf(o) < 0) unicas.push(o); });
  if (unicas.length < 4) return null;
  const otras = unicas.filter(function (o) { return o !== correcta; }).slice(0, 3);
  return { p: nrm.p, opciones: mezclar([correcta].concat(otras)), respuesta: correcta, nivel: nrm.nivel || "" };
}

function bancoReactivosReglamentarios(asignatura) {
  const datos = {
    "Español": {
      literal: [
        pregunta("¿Para qué escribió el grupo una bitácora?", "Para no olvidar lo ocurrido y comparar versiones", ["Para calificar la conducta del grupo", "Para archivar solo los éxitos del taller", "Para sustituir las prácticas de circuito"]),
        pregunta("¿Qué desacuerdo hubo entre María y Luis?", "Si el circuito encendió a la primera o si hubo que cambiar un cable", ["Si el taller debía cambiar de horario", "Quién debía firmar la bitácora ese día", "Si el periódico mural ya estaba terminado"]),
        pregunta("¿Qué encontraron al revisar la mesa de trabajo?", "Un cable suelto guardado en una caja", ["Una pila agotada sobre el banco", "El diagrama de otro equipo", "Un interruptor nuevo sin usar"]),
        pregunta("¿Qué pidió la profesora de Español?", "Oraciones claras y nexos como porque y entonces", ["Que copiaran un texto de otro grado", "Que usaran solo dibujos, sin verbos", "Que escribieran el reporte en otra asignatura"]),
        pregunta("Según el equipo, ¿cómo se empieza una bitácora?", "Anotar el día, describir lo que se ve y no inventar", ["Copiar el formato de un periódico", "Esperar a que falle otra vez el circuito", "Anotar solo los materiales del taller"]),
        pregunta("¿Dónde se publicó el texto del grupo?", "En el periódico mural", ["En el expediente de dirección", "En un aviso para las familias", "En la bitácora de otro taller"])
      ],
      inferencia: [
        pregunta("¿Qué se infiere del desacuerdo entre María y Luis?", "Sin registro escrito es más difícil hallar la causa de un fallo", ["El circuito no puede repararse nunca", "El taller debe cambiar de asignatura", "Español no se relaciona con el trabajo técnico"]),
        pregunta("¿Por qué la bitácora no es un adorno?", "Porque permite comparar versiones y encontrar problemas", ["Porque se cuelga en un lugar visible", "Porque tiene un título llamativo", "Porque ocupa varias páginas"]),
        pregunta("¿Qué se concluye al cambiar «raro» por una descripción precisa?", "La precisión vuelve útil el texto para repetir la práctica", ["Los adjetivos no deben usarse en el taller", "El fallo del circuito desaparece al escribir", "Solo la profesora puede describir el material"]),
        pregunta("¿Por qué un equipo vecino copió el formato de la bitácora?", "Porque cualquier lector podía repetir la experiencia con ese orden", ["Porque la profesora lo pidió como tarea extra", "Porque el otro equipo no tenía materiales", "Porque el mural exigía el mismo título"])
      ],
      critica: [
        pregunta("¿Qué postura sostiene el relato sobre escribir en el taller?", "Registrar con precisión es parte del trabajo técnico y de la lengua", ["Escribir estorba al trabajo técnico", "Solo importa el resultado final del circuito", "Las versiones distintas no deben compararse"]),
        pregunta("¿Qué se evalúa al exigir evidencias y no recuerdos sueltos?", "La confiabilidad del reporte frente a la discusión oral", ["La rapidez para terminar la práctica", "El número de páginas de la bitácora", "La calificación de conducta del grupo"])
      ]
    },
    "Historia": {
      literal: [
        pregunta("¿Qué convocó al pueblo en 1810, según el relato?", "Las campanas", ["Un bando leído en la plaza", "Una carta llegada de la capital", "El toque de un tambor militar"]),
        pregunta("Según Doña Carmen, la independencia...", "No ocurrió en un solo día", ["Duró solo una tarde", "Fue una fiesta escolar", "Empezó con un acuerdo único"]),
        pregunta("¿Todos estaban de acuerdo en esa época?", "No: algunas familias tenían miedo y otras esperaban cambios", ["Sí: todas las familias pensaban igual", "Nadie escuchó el llamado", "Solo los niños tomaron parte"]),
        pregunta("¿Qué encontraron en su colonia?", "La calle Morelos", ["Una placa de otra época", "El archivo municipal cerrado", "Un mapa sin nombres de calle"]),
        pregunta("¿Qué armaron en clase?", "Una línea del tiempo con cinco fechas", ["Un ensayo sin fechas", "Una lista de nombres sin años", "Un debate sin evidencias"]),
        pregunta("¿Dónde está también la historia, según el texto?", "En el barrio, no solo en el libro", ["Solo en documentos de la capital", "Solo en las fechas del examen", "Únicamente en el grabado de la sala"])
      ],
      inferencia: [
        pregunta("¿Qué se infiere de buscar una calle con nombre histórico?", "El pasado se conserva en la vida cotidiana del lugar", ["Las calles cambiaron de nombre por azar", "La independencia no dejó huella local", "Solo el libro escolar guarda el pasado"]),
        pregunta("¿Por qué Doña Carmen menciona el miedo de algunas familias?", "Para mostrar que el proceso histórico no fue unánime", ["Para que los nietos no salgan a la calle", "Para cancelar la línea del tiempo", "Para hablar de la vida cotidiana actual"]),
        pregunta("¿Qué implica armar una línea con marchas, cartas y acuerdos?", "El proceso se entiende por etapas, no por un solo suceso", ["Basta con memorizar el año de 1810", "Las cartas no son fuentes históricas", "Los acuerdos anulan las marchas"]),
        pregunta("¿Por qué el miedo también es un hecho histórico en el relato?", "Porque hay testimonios y no se borra para heroizar el pasado", ["Porque el miedo sustituye a las fechas", "Porque las familias no participaron", "Porque el barrio no tenía campanas"])
      ],
      critica: [
        pregunta("¿Qué idea crítica plantea el texto sobre enseñar historia?", "Hay que relacionar fechas y personajes con el espacio donde vive el alumno", ["Memorizar nombres basta para comprender", "El barrio no aporta al relato nacional", "Las campanas no deben usarse como fuente"]),
        pregunta("¿Qué se cuestiona al decir que 1810 no cabe en un solo grito?", "La versión simplificada que reduce un proceso a una fecha", ["El uso de mapas en la clase de Historia", "La existencia de personajes de la independencia", "La utilidad de las fotos en el barrio"])
      ]
    },
    "Ciencias": {
      literal: [
        pregunta("¿Qué provoca la evaporación en el ciclo del agua?", "El sol calienta océanos y ríos", ["La basura acumulada en las coladeras", "El viento frío de la madrugada", "El pavimento de las banquetas"]),
        pregunta("¿Qué problema investigó Sofía?", "Que el agua no bajaba porque las coladeras estaban tapadas", ["El corte de luz después del aguacero", "La falta de transporte en la colonia", "El ruido de las rejillas al mediodía"]),
        pregunta("¿Qué impide el drenaje, según su reporte?", "La basura y las hojas secas", ["Las nubes de la siguiente tormenta", "El sol sobre los océanos", "Los ríos lejanos de la ciudad"]),
        pregunta("¿Qué solución propuso Sofía?", "Jornadas de limpieza y no tirar residuos", ["Construir un puente sobre la calle", "Cerrar la vialidad en temporada de lluvias", "Sembrar menos árboles en la banqueta"]),
        pregunta("¿Qué ocurrió en la siguiente temporada de lluvias?", "El agua ya no cubrió las banquetas", ["El vapor dejó de condensarse", "Se interrumpió el ciclo en el océano", "Las nubes dejaron de formarse"]),
        pregunta("¿Dónde se interrumpe el ciclo en el relato?", "En las coladeras tapadas de la ciudad", ["En el fondo del océano", "En la formación de las nubes", "En los ríos antes de evaporarse"])
      ],
      inferencia: [
        pregunta("¿Qué se infiere del caso de Sofía?", "Un fenómeno natural se agrava si no se cuida el entorno urbano", ["El ciclo del agua no ocurre en la ciudad", "Las nubes se forman por la basura", "Sofía modificó el curso de los ríos"]),
        pregunta("¿Por qué midió los minutos que tardaba el agua en bajar?", "Para obtener un dato que sustentara su reporte", ["Para comparar el color de las rejillas", "Para cambiar el horario del aguacero", "Para sustituir las fotografías del reporte"]),
        pregunta("¿Qué se concluye al comparar dos calles con distinto desagüe?", "El tiempo de escurrimiento depende del estado de las coladeras", ["Todas las calles se inundan el mismo tiempo", "La lluvia no forma parte del ciclo", "El pavimento impide que el agua se evapore"]),
        pregunta("¿Por qué el vapor no «desaparece», según la clase?", "Porque se condensa y regresa en forma de precipitación", ["Porque se queda en las coladeras", "Porque el sol deja de calentar", "Porque el pavimento lo retiene"])
      ],
      critica: [
        pregunta("¿Qué postura sostiene el texto?", "Cuidar coladeras es parte de comprender y aplicar el ciclo del agua", ["El ciclo del agua no existe en la ciudad", "Basta memorizar evaporación y condensación", "La basura no altera el drenaje urbano"]),
        pregunta("¿Qué se evalúa al unir fotos, tiempos y campaña vecinal?", "Que una explicación científica debe traducirse en acciones comprobables", ["Que las fotos sustituyen al ciclo natural", "Que el comité no necesita datos", "Que el sol deja de formar nubes en la ciudad"])
      ]
    },
    "Formación Cívica y Ética": {
      literal: [
        pregunta("¿Qué pedía la columna del mural?", "Prohibir el celular en todos los espacios", ["Comprar más celulares para el aula", "Cerrar el recreo por dos semanas", "Eliminar el reglamento escolar"]),
        pregunta("¿Qué advirtió la directora?", "Que una regla debe apoyarse en el reglamento y el diálogo", ["Que el debate queda prohibido", "Que el mural debe retirarse", "Que el celular es obligatorio en clase"]),
        pregunta("¿Qué distinguieron al leer el reglamento?", "Hechos, juicios y propuestas", ["Solo las sanciones del reglamento", "Solo las calificaciones del grupo", "Los nombres de quienes escribieron"]),
        pregunta("¿Qué pidieron quienes rechazaban la prohibición total?", "Zonas y horarios, no una veda absoluta", ["Expulsar a quienes usaran el celular", "Quitar el periódico mural", "Ignorar el contacto con las familias"]),
        pregunta("¿Cuál fue el acuerdo?", "Un ensayo de dos semanas y una encuesta", ["Prohibir el recreo de inmediato", "Borrar el reglamento escolar", "Cancelar el comunicado de dirección"]),
        pregunta("¿Qué riesgo se mencionó al prohibir el celular?", "Limitar el contacto urgente con la familia", ["Impedir las clases de Tecnología", "Eliminar el periódico mural", "Cancelar el reglamento escolar"])
      ],
      inferencia: [
        pregunta("¿Por qué el debate es un ejercicio cívico?", "Porque se discuten reglas con razones, datos y pruebas", ["Porque el mural tiene más lectores", "Porque ocurre durante el recreo", "Porque la directora cierra la discusión"]),
        pregunta("¿Qué se infiere del ensayo de dos semanas?", "Antes de imponer una norma conviene probarla y medir efectos", ["Las normas no pueden modificarse", "La encuesta sustituye al reglamento", "La directora no debe publicar comunicados"]),
        pregunta("¿Qué diferencia un hecho de un juicio en el texto?", "Un hecho se observa; un juicio generaliza, como decir que siempre estorba", ["Un hecho es la opinión de dirección", "Un juicio es el reglamento escolar", "No hay diferencia entre ambos"]),
        pregunta("¿Por qué pegar la encuesta junto al reglamento?", "Para que los datos no reemplacen la norma, sino la informen", ["Para ocultar el reglamento", "Para terminar el debate en el recreo", "Para prohibir nuevas propuestas"])
      ],
      critica: [
        pregunta("¿Qué idea crítica plantea el texto?", "Argumentar es ofrecer razones y someter la idea a una prueba, no imponerse", ["Gana quien publica primero en el mural", "El reglamento sobra si hay encuesta", "Las opiniones no deben discutirse"]),
        pregunta("¿Qué se cuestiona al rechazar la veda total inmediata?", "Que una norma se imponga solo con una opinión, sin evidencia ni diálogo", ["Que el celular sirva para avisar a la familia", "Que exista un periódico mural", "Que el recreo tenga reglas de convivencia"])
      ]
    },
    "Tecnología": {
      literal: [
        pregunta("¿Qué resultado obtuvo el aula piloto?", "Se redujo el consumo 18 por ciento", ["Aumentó el uso de ventiladores", "Se descompusieron los sensores", "Nadie apagó luces en el mes"]),
        pregunta("Según el equipo, ¿de qué depende también el ahorro?", "De cambiar hábitos", ["De comprar más sensores", "De alargar el receso", "De apagar el aula piloto"]),
        pregunta("¿Qué objeción recibió el proyecto?", "Que el costo de los sensores no se recupera", ["Que no hay electricidad en el aula", "Que faltan pupitres en el salón", "Que el letrero contradice el reglamento"]),
        pregunta("¿Cómo respondió el equipo a esa crítica?", "Con una tabla de consumo y el tiempo de retorno", ["Cerrando el aula piloto", "Borrando los datos del mes", "Cancelando los sensores"]),
        pregunta("¿Qué condición puso la escuela?", "Medir resultados cada bimestre", ["Quitar los ventiladores", "No usar letreros", "Trabajar solo de noche"]),
        pregunta("¿A cuántos edificios se extendería el prototipo?", "A tres edificios", ["A ningún otro edificio", "A todos los del estado", "Solo al patio escolar"])
      ],
      inferencia: [
        pregunta("¿Por qué no basta instalar sensores?", "Porque el ahorro también depende de los hábitos de uso", ["Porque el consejo no revisa prototipos", "Porque el 18 por ciento no puede medirse", "Porque el letrero sustituye a los sensores"]),
        pregunta("¿Qué se evalúa al exigir medición bimestral?", "Si el ahorro se sostiene con datos y no fue casualidad de un mes", ["El diseño gráfico del letrero", "La hora en que termina el recreo", "La matrícula de los tres edificios"]),
        pregunta("¿Por qué comparar temperatura de ambos salones?", "Para no atribuir el ahorro al clima en lugar del prototipo", ["Para apagar los ventiladores del testigo", "Para cambiar el mes de la prueba", "Para evitar la tabla de consumo"]),
        pregunta("¿Qué se infiere del tiempo de retorno?", "La inversión se justifica si el ahorro se mantiene varios bimestres", ["Los sensores no tienen costo", "El 18 por ciento es independiente de los hábitos", "El consejo rechazó medir de nuevo"])
      ],
      critica: [
        pregunta("¿Qué tipo de texto ilustra el caso y qué postura toma?", "Argumentativo: hay tesis, evidencias y respuesta a una crítica", ["Narrativo: solo cuenta un accidente del aula", "Instructivo: lista pasos sin datos", "Descriptivo: presenta el letrero sin tesis"]),
        pregunta("¿Qué se sostiene frente a la objeción del costo?", "Que una propuesta técnica debe mostrar evidencia de retorno, no solo el aparato", ["Que el costo no debe discutirse en el consejo", "Que los hábitos no influyen en el consumo", "Que medir cada bimestre es innecesario"])
      ]
    },
    "Matemáticas": {
      literal: [
        pregunta("¿Qué midió el grupo en el patio?", "Cuántos alumnos jugaban fútbol, se sentaban o caminaban", ["La temperatura durante el recreo", "Las calificaciones del grupo", "El número de salones del edificio"]),
        pregunta("¿Por qué midieron tres días a la misma hora?", "Para no comparar momentos distintos", ["Porque el recreo cambió de horario", "Para evitar armar la tabla", "Porque solo ese día había fútbol"]),
        pregunta("¿Qué calcularon después de armar la tabla?", "El promedio de cada actividad", ["El área total del patio", "La altura de las porterías", "El costo de pintar las bancas"]),
        pregunta("¿Qué propusieron con los datos?", "Pintar más bancas en la sombra, no solo otra portería", ["Cerrar una parte del patio", "Quitar el recreo un día a la semana", "Prohibir el fútbol los martes"]),
        pregunta("¿Qué crítica hizo un compañero?", "Que tres días eran pocos", ["Que la tabla era de otro grado", "Que no hubo recreo esos días", "Que no sabían organizar columnas"]),
        pregunta("¿Qué acordó el equipo ante esa crítica?", "Medir una semana completa antes de ir a dirección", ["Borrar la tabla del patio", "Inventar los números faltantes", "Dejar de contar a quienes caminaban"])
      ],
      inferencia: [
        pregunta("¿Para qué sirvió el promedio en este caso?", "Para no dejarse llevar por un solo día atípico", ["Para sustituir la tabla de frecuencias", "Para evitar medir el martes", "Para decidir el horario del recreo"]),
        pregunta("¿Qué se infiere de aceptar que tres días eran pocos?", "Una muestra más grande hace más confiable la propuesta", ["Los datos del martes no deben usarse", "Las bancas no se usan en la sombra", "El fútbol no puede medirse"]),
        pregunta("¿Por qué el martes no bastaba para decidir?", "Porque ese día el fútbol reunió más personas que el promedio", ["Porque no se armó la tabla", "Porque no hubo quienes se sentaran", "Porque dirección pidió otro deporte"]),
        pregunta("¿Qué se concluye al medir a la misma hora?", "Se reduce el error de mezclar el inicio del recreo con el final", ["El promedio deja de ser necesario", "Solo cuenta quienes juegan fútbol", "La sombra no influye en sentarse"])
      ],
      critica: [
        pregunta("¿Qué idea sostiene el texto sobre decidir en la escuela?", "Las decisiones del patio deben apoyarse en mediciones y no solo en gustos", ["Basta con opinar en voz alta", "Las matemáticas no aplican al recreo", "Una portería resuelve cualquier dato"]),
        pregunta("¿Qué se evalúa al aceptar la crítica de la muestra?", "Que una propuesta gana rigor si se corrige el procedimiento con más datos", ["Que dirección no necesita evidencias", "Que tres días equivalen a una semana", "Que el promedio oculta las actividades"])
      ]
    }
  };
  const asigStr = String(asignatura || "").trim();
  if (datos[asigStr]) return datos[asigStr];
  if (/Ciencias|Biolog[ií]a|F[ií]sica|Qu[ií]mica|Geograf/i.test(asigStr)) return datos["Ciencias"];
  if (/Tecnolog/i.test(asigStr)) return datos["Tecnología"];
  if (/Matem[aá]tic/i.test(asigStr)) return datos["Matemáticas"];
  if (/Formaci[oó]n|C[ií]vica|[ÉE]tica/i.test(asigStr)) return datos["Formación Cívica y Ética"];
  if (/Historia/i.test(asigStr)) return datos["Historia"];
  return datos["Español"];
}

function seleccionarReactivosPorGrado(grado, asignatura) {
  const b = bancoReactivosReglamentarios(asignatura);
  const spec = especificacionesDeGrado(grado);
  const n = spec.objetivoPreguntas;
  function marcar(lista, nivel) {
    return (lista || []).map(function (p) {
      const c = {};
      Object.keys(p).forEach(function (k) { c[k] = p[k]; });
      c.nivel = nivel;
      return c;
    });
  }
  let pool = [];
  if (String(grado) === "1") pool = marcar(b.literal, "literal").concat(marcar((b.inferencia || []).slice(0, 1), "inferencial"));
  else if (String(grado) === "2") pool = marcar(b.inferencia, "inferencial").concat(marcar(b.literal, "literal"));
  else pool = marcar(b.critica, "critica").concat(marcar(b.inferencia, "inferencial")).concat(marcar(b.literal, "literal"));
  const vistos = {}, out = [];
  pool.forEach(function (p) {
    const nrm = homogeneizarPregunta(p);
    if (!nrm || vistos[nrm.p]) return;
    vistos[nrm.p] = true;
    out.push(nrm);
  });
  return out.slice(0, n);
}

function auditarLecturaItem(grado, texto, preguntas) {
  const spec = especificacionesDeGrado(grado);
  const t = limpiarHtmlLectura(texto);
  const pal = contarPalabras(t);
  const nP = (preguntas || []).length;
  const nPar = partirParrafosLectura(t).length;
  const problemas = [];
  if (pal < spec.palabrasMin) problemas.push("texto corto (" + pal + ")");
  if (pal > spec.palabrasMax) problemas.push("texto largo (" + pal + ")");
  if (nP < spec.preguntasMin) problemas.push("pocas preguntas (" + nP + ")");
  if (nP > spec.preguntasMax) problemas.push("muchas preguntas (" + nP + ")");
  if (nPar < 5 || nPar > 8) problemas.push("párrafos (" + nPar + ")");
  if (/<[^>]+>/.test(String(texto || ""))) problemas.push("html en el texto");
  (preguntas || []).forEach(function (q, i) {
    const ops = q.opciones || [];
    if (esReactivoRelleno(q.p)) problemas.push("Q" + (i + 1) + " relleno");
    if (ops.length !== 4) problemas.push("Q" + (i + 1) + " opciones");
    if (!q.respuesta || ops.indexOf(q.respuesta) < 0) problemas.push("Q" + (i + 1) + " respuesta");
    if (ops.some(esOpcionAbsurda)) problemas.push("Q" + (i + 1) + " distractor");
  });
  return { ok: problemas.length === 0, problemas: problemas, spec: spec, palabras: pal, nPreguntas: nP };
}

function _revisarLecturaDeepSeek_(clave, grado, asignatura, tema, spec, textoActual) {
  const instruccion = "Eres un especialista pedagógico de la " + NOMBRE_ESCUELA + " (Fase 6 NEM).\n" +
    "Revisa y reescribe UNA lectura de comprensión para " + grado + "° de secundaria, asignatura \"" + asignatura + "\", tema / PDA: \"" + tema + "\".\n" +
    "El texto actual puede estar corto, largo, mal partido o no corresponder al tema. Debes entregar un texto NUEVO o AJUSTADO que sí trate el tema y cumpla las especificaciones.\n\n" +
    "Especificaciones:\n" +
    "- Extensión: entre " + spec.palabrasMin + " y " + spec.palabrasMax + " palabras (ideal " + spec.objetivoPalabras + ").\n" +
    "- Tipo de texto: " + spec.tipo + ".\n" +
    "- Gramática: " + spec.gramatica + ".\n" +
    "- Enfoque de las preguntas: " + spec.enfoque + ".\n" +
    "- Párrafos: entre 5 y 8, separados por \\n\\n.\n" +
    "- Preguntas: exactamente " + spec.objetivoPreguntas + ", cada una con 4 opciones plausibles de longitud similar, UNA sola correcta respaldada por el texto, y \"nivel\" (literal, inferencial o critica).\n\n" +
    "Texto actual (referencia, puedes reescribirlo):\n" + String(textoActual || "").substring(0, 3500) + "\n\n" +
    "Devuelve ÚNICAMENTE JSON: {\"texto\":\"...\",\"preguntas\":[{\"p\":\"...\",\"opciones\":[\"A\",\"B\",\"C\",\"D\"],\"respuesta\":\"opción exacta\",\"nivel\":\"literal\"}]}";
  const r = UrlFetchApp.fetch(URL_BASE_DEEPSEEK, {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + clave },
    payload: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: instruccion }],
      response_format: { type: "json_object" },
      temperature: 0.35
    }),
    muteHttpExceptions: true
  });
  if (r.getResponseCode() < 200 || r.getResponseCode() >= 300) return null;
  const j = JSON.parse(r.getContentText());
  const contenido = j.choices[0].message.content;
  let datos;
  if (typeof contenido === "string") {
    const bloque = contenido.match(/```(?:json)?\s*([\s\S]*?)```/i);
    datos = JSON.parse((bloque ? bloque[1] : contenido).trim());
  } else datos = contenido;
  if (!datos || !datos.texto || !datos.preguntas) return null;
  const preguntas = (datos.preguntas || []).map(function (pr) {
    const nrm = homogeneizarPregunta(pr);
    if (!nrm) return null;
    nrm.nivel = normalizarNivelComprension(pr.nivel || nrm.nivel);
    return nrm;
  }).filter(Boolean);
  if (!preguntas.length) return null;
  return { texto: asegurarFormatoLibro(limpiarHtmlLectura(datos.texto)), preguntas: preguntas, origen: "IA" };
}

function reconstruirHojaPreguntasDesdeJson_() {
  const libro = _obtenerLibro_();
  if (!libro) return;
  const p = libro.getSheetByName("Preguntas");
  if (!p) return;

  const props = PropertiesService.getScriptProperties();
  const entorno = String(props.getProperty("ENTORNO") || "").trim().toUpperCase();
  const ID_PRODUCCION = "1ZxCuV_6O3JcX9E-7y165Q6ofAZRERk9-xj5rYeUhaYU";
  const idReal = typeof libro.getId === "function" ? String(libro.getId() || "").trim() : "";
  const esProd = (entorno === "PRODUCCION") || (idReal === ID_PRODUCCION);

  const lecturas = _leerFilas_("Lecturas");
  const matriz = [];
  lecturas.forEach(function (l) {
    const id = String(l["ID Lectura"] || "");
    let preguntas = [];
    try { preguntas = JSON.parse(l["Preguntas JSON"] || "[]"); } catch (e) { preguntas = []; }
    if (!Array.isArray(preguntas)) preguntas = [];
    preguntas.forEach(function (pr, i) {
      matriz.push(filaPreguntaParaHoja(id, i + 1, pr));
    });
  });

  const need = ENCABEZADOS.Preguntas.length;
  if (p.getMaxColumns() < need) {
    p.insertColumnsAfter(p.getMaxColumns(), need - p.getMaxColumns());
  }

  if (esProd) {
    // EN PRODUCCIÓN: Nunca ejecutar p.clearContents() destructivo.
    // Preservar preguntas existentes; actualizar por clave (ID Lectura + Num) o anexar faltantes.
    const filasExistentes = _leerFilas_("Preguntas") || [];
    if (matriz.length === 0 && filasExistentes.length > 0) {
      Logger.log("reconstruirHojaPreguntasDesdeJson_: En producción no se borran preguntas existentes cuando la matriz generada está vacía.");
      return;
    }
    const mapaExistentes = {};
    filasExistentes.forEach(function (f) {
      const k = String(f["ID Lectura"] || "").trim() + "_" + String(f["Num Pregunta"] || "").trim();
      if (f._fila) mapaExistentes[k] = f._fila;
    });

    matriz.forEach(function (filaNueva) {
      const k = String(filaNueva[0] || "").trim() + "_" + String(filaNueva[1] || "").trim();
      if (mapaExistentes[k]) {
        p.getRange(mapaExistentes[k], 1, 1, need).setValues([filaNueva]);
      } else {
        p.appendRow(filaNueva);
      }
    });
    p.getRange(1, 1, 1, need).setFontWeight("bold");
    return;
  }

  p.clearContents();
  p.appendRow(ENCABEZADOS.Preguntas);
  p.getRange(1, 1, 1, ENCABEZADOS.Preguntas.length).setFontWeight("bold");
  if (matriz.length) {
    p.getRange(2, 1, matriz.length, ENCABEZADOS.Preguntas.length).setValues(matriz);
  }
}

function ajustarLecturasAEspecificaciones(token) {
  exigirAdmin(token);
  _asegurarSetup_();
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const p = _obtenerLibro_().getSheetByName("Lecturas");
    const lecturas = _leerFilas_("Lecturas");
    const clave = obtenerClaveDeepSeek_();
    const t0 = Date.now();
    const reporte = { ok: true, revisadas: 0, cumplian: 0, actualizadas: 0, conIA: 0, detalle: [] };

    lecturas.forEach(function (l) {
      const id = String(l["ID Lectura"] || "");
      if (!id) return;
      const grado = normalizarGradoServer(l["Grado"]) || "1";
      const asig = String(l["Asignatura"] || "");
      const tema = String(l["Tema"] || "");
      const activa = String(l["Activa"] || "SI");
      let origen = String(l["Origen"] || "BANCO");
      let preguntas = preguntasDeLectura(l);
      let texto = String(l["Texto"] || "");
      reporte.revisadas++;
      const antes = auditarLecturaItem(grado, texto, preguntas);
      if (antes.ok) {
        reporte.cumplian++;
        reporte.detalle.push({ id: id, grado: grado, estado: "ok", problemas: [] });
        return;
      }

      const spec = especificacionesDeGrado(grado);
      let pack = null;
      if (clave && (Date.now() - t0) < 240000) {
        try { pack = _revisarLecturaDeepSeek_(clave, grado, asig, tema, spec, texto); } catch (e) { pack = null; }
      }
      if (pack) {
        reporte.conIA++;
        origen = "IA";
      } else {
        const textoAj = ajustarTextoAEspecificacion(texto, grado, asig, tema, spec);
        pack = { texto: textoAj, preguntas: seleccionarReactivosPorGrado(grado, asig), origen: origen };
      }
      pack.texto = ajustarTextoAEspecificacion(pack.texto, grado, asig, tema, spec);
      let qs = (pack.preguntas || []).map(homogeneizarPregunta).filter(Boolean);
      if (qs.length < spec.preguntasMin) {
        seleccionarReactivosPorGrado(grado, asig).forEach(function (q) {
          if (qs.length >= spec.objetivoPreguntas) return;
          if (qs.some(function (x) { return x.p === q.p; })) return;
          qs.push(q);
        });
      }
      qs = qs.slice(0, spec.objetivoPreguntas);
      const fila = [
        id, grado, asig, tema, pack.texto,
        contarPalabras(pack.texto), JSON.stringify(qs),
        activa, pack.origen || origen
      ];
      p.getRange(l._fila, 1, 1, ENCABEZADOS.Lecturas.length).setValues([fila]);
      const despues = auditarLecturaItem(grado, pack.texto, qs);
      reporte.actualizadas++;
      reporte.detalle.push({
        id: id, grado: grado, asignatura: asig, tema: tema,
        estado: despues.ok ? "actualizada" : "parcial",
        problemasAntes: antes.problemas,
        problemasDespues: despues.problemas,
        palabras: despues.palabras,
        nPreguntas: despues.nPreguntas,
        origen: pack.origen || origen
      });
    });

    reconstruirHojaPreguntasDesdeJson_();
    _formatearHojasDeLectura_();
    return reporte;
  } finally {
    lock.releaseLock();
  }
}
