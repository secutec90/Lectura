/**********************************************************************
 * BANCO LOCAL (contenido temático por asignatura)
 **********************************************************************/
function contenidoTematico(asignatura) {
  const datos = {
    "Español": {
      tema: "La bitácora del taller",
      ancla: "La bitácora sirve para registrar lo observado y comparar resultados",
      texto: "En el taller de la Secundaria Técnica 90, el grupo escribió una bitácora para no olvidar lo que iba ocurriendo. Cada equipo anotaba la fecha, lo que hizo, lo que salió bien y lo que falló.\n\nUn viernes, el equipo de María descubrió que sus apuntes del martes no coincidían con los de Luis: ella había escrito que el circuito encendió a la primera, y él, que hubo que cambiar un cable. Revisaron juntos la mesa de trabajo y encontraron el cable suelto guardado en una caja.\n\nEntonces comprendieron que la bitácora no es un adorno: sirve para comparar versiones y hallar la causa de un problema. La profesora de Español les pidió oraciones claras, con sujeto y verbo, y nexos como \"porque\" y \"entonces\".\n\nEl texto se pegó en el periódico mural. Varios lectores preguntaron cómo empezar su propia bitácora. El equipo respondió: anotar el día, describir lo que se ve y no inventar lo que no se observó.",
      relleno: [
        "En la bitácora también se dibujó el diagrama del circuito para que otro grupo pudiera repetir la práctica.",
        "Cuando un dato no coincidía, el equipo volvía a la mesa y comprobaba el cable, el interruptor y la pila.",
        "La profesora subrayó los nexos que explicaban la causa del fallo y pidió reemplazar las frases vagas.",
        "Así el reportaje del taller dejó de ser una anécdota y se volvió un texto claro, con evidencias."
      ],
      preguntas: [
        pregunta("¿Para qué escribió el grupo una bitácora?", "Para no olvidar lo que iba ocurriendo y comparar versiones", ["Para decorar el salón", "Para cancelar el taller", "Para evitar leer"]),
        pregunta("¿Qué desacuerdo hubo entre María y Luis?", "Si el circuito encendió a la primera o si hubo que cambiar un cable", ["Quién ganó el recreo", "El color del mural", "La hora de salida"]),
        pregunta("¿Qué encontraron al revisar la mesa?", "Un cable suelto guardado en una caja", ["Una planta seca", "Un balón", "Un mapa"]),
        pregunta("¿Qué pidió la profesora de Español?", "Oraciones claras y nexos como porque y entonces", ["Borrar la bitácora", "No usar verbos", "Escribir en otro idioma"]),
        pregunta("Según el equipo, ¿cómo se empieza una bitácora?", "Anotar el día, describir lo que se ve y no inventar", ["Copiar de internet", "Esperar al examen", "Solo dibujar sin fechas"]),
        pregunta("¿Dónde se publicó el texto?", "En el periódico mural", ["En un contrato", "En un recado", "En un ticket"])
      ],
      preguntasInferencia: [
        pregunta("¿Qué se infiere del desacuerdo entre María y Luis?", "Sin registro escrito es más difícil hallar la causa de un fallo", ["Los cables no existen", "El taller debe cerrar", "Español no se relaciona con el taller"]),
        pregunta("¿Por qué la bitácora no es un adorno?", "Porque permite comparar versiones y encontrar problemas", ["Porque es de color", "Porque se cuelga", "Porque no se lee"])
      ],
      preguntasCritica: [
        pregunta("¿Qué postura sostiene el relato sobre escribir en el taller?", "Registrar con precisión es parte del trabajo técnico y de la lengua", ["Escribir estorba al técnico", "Solo importa el resultado final", "Las versiones distintas no importan"])
      ]
    },
    "Historia": {
      tema: "La independencia en el barrio",
      ancla: "La independencia no ocurrió en un solo día y también se recuerda en el barrio",
      texto: "Doña Carmen contaba a sus nietos cómo, en 1810, el pueblo se reunió al escuchar las campanas. No era una fiesta: era un llamado a organizarse. Mientras preparaban atole, ella explicaba que la independencia no ocurrió en un solo día. Hubo años de marchas, cartas y acuerdos.\n\nUn grabado en la sala mostraba personas con antorchas. Los niños preguntaron si todos estaban de acuerdo. Doña Carmen dijo que no: algunas familias tenían miedo y otras esperaban cambios.\n\nLes pidió buscar en la colonia una placa o un nombre de calle de esa época. Al día siguiente encontraron la calle Morelos y tomaron una foto. En clase armaron una línea del tiempo con cinco fechas. Así entendieron que la historia también está en el barrio, no solo en el libro.",
      relleno: [
        "Cada fecha de la línea del tiempo se acompañó con un dibujo y una oración que decía qué cambió.",
        "Un alumno investigó por qué tantas calles llevan nombres de personajes de la independencia.",
        "Doña Carmen insistió en que el miedo de algunas familias también forma parte del relato histórico.",
        "El grupo concluyó que recordar el pasado ayuda a explicar el nombre del lugar donde viven."
      ],
      preguntas: [
        pregunta("¿Qué convocó al pueblo en 1810, según el relato?", "Las campanas", ["Un tren", "Un radio", "Un globo"]),
        pregunta("Según Doña Carmen, la independencia...", "No ocurrió en un solo día", ["Duró una tarde", "Fue una fiesta escolar", "Empezó en 2010"]),
        pregunta("¿Todos estaban de acuerdo en esa época?", "No: algunas familias tenían miedo y otras esperaban cambios", ["Sí, todos igual", "Nadie escuchó", "Solo los niños"]),
        pregunta("¿Qué encontraron en su colonia?", "La calle Morelos", ["Un aeropuerto", "Un río nuevo", "Una fábrica de globos"]),
        pregunta("¿Qué armaron en clase?", "Una línea del tiempo con cinco fechas", ["Un huerto", "Un puente", "Un examen de inglés"]),
        pregunta("¿Dónde está también la historia, según el texto?", "En el barrio, no solo en el libro", ["Solo en otro país", "Solo en el recreo", "En el futuro"])
      ],
      preguntasInferencia: [
        pregunta("¿Qué se infiere de buscar una calle con nombre histórico?", "El pasado se conserva en la vida cotidiana del lugar", ["Las calles no tienen nombre", "La independencia no existió", "Solo importa el atole"]),
        pregunta("¿Por qué Doña Carmen menciona el miedo de algunas familias?", "Para mostrar que el proceso histórico no fue unánime", ["Para asustar a los nietos", "Para cancelar la clase", "Para hablar del clima"])
      ],
      preguntasCritica: [
        pregunta("¿Qué idea crítica plantea el texto sobre enseñar historia?", "Hay que relacionar fechas y personajes con el espacio donde vive el alumno", ["Memorizar nombres basta", "El barrio no cuenta", "Las campanas no importan"])
      ]
    },
    "Ciencias": {
      tema: "El ciclo del agua en la ciudad",
      ancla: "El ciclo del agua se interrumpe en la ciudad si las coladeras se tapan",
      texto: "El agua es un recurso vital. En la naturaleza se encuentra en ríos, lagos, mares y como vapor. El ciclo comienza cuando el sol calienta océanos y ríos: el agua se evapora, sube, se enfría y forma nubes. Luego cae como lluvia, nieve o granizo.\n\nEn una ciudad, ese ciclo se interrumpe si las coladeras se tapan. Sofía midió cuántos minutos tardaba el agua en bajar después de un aguacero y fotografió residuos en las rejillas. Su reporte explicó que la basura y las hojas secas impiden el drenaje.\n\nPropuso jornadas de limpieza y una campaña para no tirar residuos. El comité vecinal aceptó. En la siguiente temporada, el agua ya no cubrió las banquetas. El caso muestra que un fenómeno natural se vuelve un problema social cuando el entorno urbano no se cuida.",
      relleno: [
        "Sofía comparó dos calles: una con coladeras libres y otra con hojas acumuladas, y el tiempo de desagüe fue distinto.",
        "El vapor que sube no desaparece: se condensa y regresa, pero en la ciudad el pavimento cambia por dónde corre el agua.",
        "La campaña pidió no arrojar bolsas ni envases a la calle, porque terminan en las rejillas.",
        "Comprender el ciclo del agua, entonces, también implica observar la banqueta de la colonia."
      ],
      preguntas: [
        pregunta("¿Qué provoca la evaporación en el ciclo del agua?", "El sol calienta océanos y ríos", ["La basura en las coladeras", "El viento de la noche", "Las banquetas"]),
        pregunta("¿Qué problema investigó Sofía?", "Que el agua no bajaba porque las coladeras estaban tapadas", ["El corte de luz", "La falta de transporte", "El ruido del taller"]),
        pregunta("¿Qué impide el drenaje, según su reporte?", "La basura y las hojas secas", ["Las nubes", "El sol", "Los ríos lejanos"]),
        pregunta("¿Qué solución propuso Sofía?", "Jornadas de limpieza y no tirar residuos", ["Construir un puente", "Cerrar la calle", "Sembrar menos árboles"]),
        pregunta("¿Qué ocurrió en la siguiente temporada de lluvias?", "El agua ya no cubrió las banquetas", ["Se secó el mar", "Dejó de existir el vapor", "Se inundó la escuela para siempre"]),
        pregunta("¿Dónde se interrumpe el ciclo en el relato?", "En las coladeras tapadas de la ciudad", ["En el fondo del océano", "En la atmósfera superior", "En los polos"])
      ],
      preguntasInferencia: [
        pregunta("¿Qué se infiere del caso de Sofía?", "Un fenómeno natural se agrava si no se cuida el entorno urbano", ["El sol ya no calienta", "Las nubes son artificiales", "Sofía cerró el drenaje"]),
        pregunta("¿Por qué midió los minutos que tardaba el agua en bajar?", "Para obtener un dato que sustentara su reporte", ["Para ganar un concurso de relojes", "Para apagar el sol", "Para cambiar el clima"])
      ],
      preguntasCritica: [
        pregunta("¿Qué postura sostiene el texto?", "Cuidar coladeras es parte de comprender y aplicar el ciclo del agua", ["El ciclo del agua no existe en la ciudad", "Solo importa memorizar evaporación", "La basura no afecta el drenaje"])
      ]
    },
    "Formación Cívica y Ética": {
      tema: "Normas y acuerdos escolares",
      ancla: "Una regla escolar debe apoyarse en el reglamento y en el diálogo, no solo en una opinión",
      texto: "En el periódico mural apareció una columna que pedía prohibir el celular en todos los espacios, incluido el recreo. Un alumno respondió que la medida protege la convivencia, pero otro escribió que también limita el contacto urgente con la familia.\n\nLa directora publicó un comunicado: cualquier regla debe apoyarse en el reglamento escolar y en un diálogo, no solo en una opinión. Se leyeron fragmentos del reglamento y se distinguieron hechos, juicios y propuestas.\n\nQuienes estaban a favor usaron ejemplos de distracción en clase. Quienes estaban en contra pidieron zonas y horarios, no una prohibición total. El acuerdo fue un ensayo de dos semanas con áreas libres de celular y una encuesta. Argumentar, en este caso, no fue gritar más, sino ofrecer razones y probar la idea.",
      relleno: [
        "La encuesta preguntó en qué espacios el celular servía para avisar a casa y en cuáles distraía.",
        "Un hecho era el uso del aparato en clase; un juicio era decir que 'siempre estorba'; una propuesta era delimitar zonas.",
        "El reglamento se usó como base, no como pretexto para callar a quienes pensaban distinto.",
        "Al cabo de dos semanas, el consejo revisaría los datos antes de convertir el ensayo en norma."
      ],
      preguntas: [
        pregunta("¿Qué pedía la columna del mural?", "Prohibir el celular en todos los espacios", ["Comprar más celulares", "Cerrar el recreo", "Eliminar el reglamento"]),
        pregunta("¿Qué advirtió la directora?", "Que una regla debe apoyarse en el reglamento y el diálogo", ["Que no hay debate", "Que el mural se cierra", "Que el celular es obligatorio"]),
        pregunta("¿Qué distinguieron al leer el reglamento?", "Hechos, juicios y propuestas", ["Solo chistes", "Solo calificaciones", "Nombres de maestros"]),
        pregunta("¿Qué pidieron quienes rechazaban la prohibición total?", "Zonas y horarios, no una veda absoluta", ["Expulsar alumnos", "Quitar el mural", "Ignorar a las familias"]),
        pregunta("¿Cuál fue el acuerdo?", "Un ensayo de dos semanas y una encuesta", ["Prohibir el recreo", "Borrar el reglamento", "Cancelar clases"]),
        pregunta("¿Qué riesgo se mencionó al prohibir el celular?", "Limitar el contacto urgente con la familia", ["Romper el huerto", "Apagar el sol", "Perder el mapa"])
      ],
      preguntasInferencia: [
        pregunta("¿Por qué el debate es un ejercicio cívico?", "Porque se discuten reglas con razones, datos y pruebas", ["Porque hay un mural bonito", "Porque es recreo", "Porque no hay reglamento"]),
        pregunta("¿Qué se infiere del ensayo de dos semanas?", "Antes de imponer una norma conviene probarla y medir efectos", ["Las normas no se pueden cambiar", "La encuesta no sirve", "La directora no debe opinar"])
      ],
      preguntasCritica: [
        pregunta("¿Qué idea crítica plantea el texto?", "Argumentar es ofrecer razones y someter la idea a una prueba, no imponerse", ["Gana quien grita más", "El reglamento sobra", "Las opiniones no se discuten"])
      ]
    },
    "Tecnología": {
      tema: "Ahorrar energía en el aula",
      ancla: "El ahorro de energía depende de la tecnología y también de cambiar hábitos",
      texto: "Un equipo de la Secundaria Técnica 90 diseñó un prototipo para ahorrar energía. Instalaron sensores de luz y un letrero que recordaba apagar ventiladores al salir. Durante un mes compararon el aula piloto con un salón tradicional. Los datos mostraron una reducción del 18 por ciento.\n\nAl presentarlo al consejo técnico, argumentaron que el ahorro no depende solo de la tecnología, sino de cambiar hábitos. Alguien objetó que el costo de los sensores no se recupera. El equipo respondió con una tabla de consumo y el tiempo estimado de retorno.\n\nLa escuela aceptó extender el prototipo a tres edificios, con la condición de medir cada bimestre.",
      relleno: [
        "El letrero no apagaba los ventiladores por sí solo: alguien debía formar el hábito de revisar al salir.",
        "La tabla mostró en qué horas el aula piloto consumía menos que el salón testigo.",
        "Medir cada bimestre permite ver si el 18 por ciento se sostiene o fue casualidad de un mes.",
        "El prototipo combina un dispositivo y una regla de uso; faltando uno de los dos, el ahorro baja."
      ],
      preguntas: [
        pregunta("¿Qué resultado obtuvo el aula piloto?", "Se redujo el consumo 18 por ciento", ["Aumentó el calor", "Se descompusieron los ventiladores", "Nadie apagó luces"]),
        pregunta("Según el equipo, ¿de qué depende también el ahorro?", "De cambiar hábitos", ["De comprar más sensores", "De alargar el receso", "De cerrar la escuela"]),
        pregunta("¿Qué objeción recibió el proyecto?", "Que el costo de los sensores no se recupera", ["Que no hay electricidad", "Que faltan pupitres", "Que el letrero es ilegal"]),
        pregunta("¿Cómo respondió el equipo a esa crítica?", "Con una tabla de consumo y el tiempo de retorno", ["Cerrando el aula", "Borrando los datos", "Cancelando el prototipo"]),
        pregunta("¿Qué condición puso la escuela?", "Medir resultados cada bimestre", ["Quitar los ventiladores", "No usar letreros", "Trabajar de noche"]),
        pregunta("¿A cuántos edificios se extendería el prototipo?", "A tres edificios más", ["A ninguno", "A veinte estados", "Solo al patio"])
      ],
      preguntasInferencia: [
        pregunta("¿Por qué no basta instalar sensores?", "Porque el ahorro también depende de los hábitos de uso", ["Porque la luz no existe", "Porque el consejo no lee", "Porque el 18 por ciento es imposible"]),
        pregunta("¿Qué se evalúa al exigir medición bimestral?", "Si el ahorro se sostiene con datos", ["El color del letrero", "La hora del recreo", "La matrícula nueva"])
      ],
      preguntasCritica: [
        pregunta("¿Qué tipo de texto ilustra el caso y qué postura toma?", "Argumentativo: hay tesis, evidencias y respuesta a una crítica", ["Una receta de cocina", "Una adivinanza", "Un chiste del recreo"])
      ]
    },
    "Matemáticas": {
      tema: "Medir y comparar datos del patio",
      ancla: "Medir, organizar en tabla y comparar permite tomar una decisión con datos",
      texto: "El grupo de matemáticas midió el patio en el recreo. Contaron cuántos alumnos jugaban fútbol, cuántos se sentaban y cuántos caminaban. Hicieron el recuento tres días seguidos, a la misma hora, para no comparar momentos distintos.\n\nOrganizaron los números en una tabla y calcularon el promedio de cada actividad. El fútbol reunió más personas el martes, pero el promedio de los tres días mostró que sentarse también era frecuente.\n\nCon esos datos propusieron pintar más bancas en la sombra, no solo otra portería. Un compañero objetó que tres días eran pocos. El equipo aceptó la crítica y acordó medir una semana completa antes de llevar la propuesta a dirección.",
      relleno: [
        "El promedio evitó que una sola tarde de partido se tomara como la verdad de todo el recreo.",
        "La tabla tenía filas por día y columnas por actividad, para sumar y comparar con claridad.",
        "Medir a la misma hora redujo el error de mezclar el inicio del recreo con el final.",
        "La decisión de las bancas nació de un número, no de un gusto personal del equipo."
      ],
      preguntas: [
        pregunta("¿Qué midió el grupo en el patio?", "Cuántos alumnos jugaban fútbol, se sentaban o caminaban", ["La temperatura del sol", "Las calificaciones", "El número de salones"]),
        pregunta("¿Por qué midieron tres días a la misma hora?", "Para no comparar momentos distintos", ["Porque el recreo cambió de horario", "Para evitar matemáticas", "Porque llovía siempre"]),
        pregunta("¿Qué calcularon después de armar la tabla?", "El promedio de cada actividad", ["El área del país", "La raíz de un árbol", "El precio del balón"]),
        pregunta("¿Qué propusieron con los datos?", "Pintar más bancas en la sombra, no solo otra portería", ["Cerrar el patio", "Quitar el recreo", "Prohibir el fútbol"]),
        pregunta("¿Qué crítica hizo un compañero?", "Que tres días eran pocos", ["Que la tabla era de otro grado", "Que no hubo recreo", "Que no saben sumar"]),
        pregunta("¿Qué acordó el equipo ante esa crítica?", "Medir una semana completa antes de ir a dirección", ["Borrar la tabla", "Inventar los números", "Dejar de contar"])
      ],
      preguntasInferencia: [
        pregunta("¿Para qué sirvió el promedio en este caso?", "Para no dejarse llevar por un solo día atípico", ["Para decorar la tabla", "Para evitar medir", "Para ganar el partido"]),
        pregunta("¿Qué se infiere de aceptar que tres días eran pocos?", "Una muestra más grande hace más confiable la propuesta", ["Los datos no importan", "Las bancas no se usan", "El fútbol no existe"])
      ],
      preguntasCritica: [
        pregunta("¿Qué idea sostiene el texto sobre decidir en la escuela?", "Las decisiones del patio deben apoyarse en mediciones y no solo en gustos", ["Basta con opinar fuerte", "Las matemáticas no aplican al recreo", "Una portería resuelve cualquier dato"])
      ]
    }
  };
  const asigStr = String(asignatura || "").trim();
  if (datos[asigStr]) return datos[asigStr];
  if (/Ciencias|Biología|Física|Química/i.test(asigStr)) return datos["Ciencias"];
  if (/Geografía/i.test(asigStr)) return datos["Ciencias"];
  if (/Tecnología/i.test(asigStr)) return datos["Tecnología"];
  if (/Matemáticas/i.test(asigStr)) return datos["Matemáticas"];
  if (/Formación|Cívica|Ética/i.test(asigStr)) return datos["Formación Cívica y Ética"];
  if (/Historia/i.test(asigStr)) return datos["Historia"];
  return datos["Español"];
}

function parrafosContinuacion(grado, asignatura, tema) {
  // Devuelve párrafos adicionales por asignatura para alcanzar el mínimo de palabras.
  const escenas = {
    "Español": [
      "El lunes siguiente, María numeró las páginas de la bitácora y dejó un margen para correcciones. Luis anotó la hora exacta de cada prueba del circuito. Así, cuando volvieran a discutir, tendrían un orden claro y no solo recuerdos sueltos del recreo.",
      "En la segunda práctica cambiaron la pila y el interruptor. El foco encendió, pero parpadeó. En la bitácora escribieron: «Enciende, aunque inestable». Esa frase, más tarde, les evitó decir que todo había salido bien cuando no era cierto.",
      "Un equipo vecino copió el formato: fecha, materiales, lo observado y una duda. La profesora felicitó el modelo porque cualquier lector podía repetir la experiencia sin preguntar a gritos qué había pasado el martes.",
      "En la clase de Español revisaron adjetivos vagos. Cambiaron «raro» por «el cable estaba fuera de la terminal». La precisión volvió útil el texto para el taller y ya no parecía un recado apurado."
    ],
    "Historia": [
      "Doña Carmen sacó una caja de recortes: copias de bandos, un calendario viejo y la foto de una placa en la esquina. No eran adornos. Servían para mostrar que 1810 no cabe en un solo grito ni en una sola fecha de libro.",
      "Los nietos marcaron en un mapa del barrio la calle Morelos, la plaza y la iglesia donde aún tocan las campanas. Así el relato dejó de ser una anécdota de cocina y se volvió un recorrido que podían hacer a pie.",
      "En clase, cada equipo eligió un personaje y buscó qué hizo en distintos años, no solo el nombre. La línea del tiempo creció con marchas, cartas y acuerdos, exactamente como había dicho Doña Carmen.",
      "Un alumno preguntó por qué algunas familias tenían miedo. La docente pidió no inventar: el miedo también es un hecho histórico cuando hay testimonios, y no se borra para que la historia se vea más heroica."
    ],
    "Ciencias": [
      "Sofía explicó el ciclo con un esquema en cuatro flechas: evaporación, condensación, precipitación y escurrimiento. En el pizarrón el ciclo se veía cerrado; en la calle, la última flecha se detenía en la coladera tapada.",
      "Midiendo después de dos aguaceros, anotó 14 minutos en una calle limpia y más de 40 en la que tenía hojas y bolsas. El número no era un adorno: permitía comparar y no quedarse en la impresión de que «siempre se inunda igual».",
      "Fotografió tres rejillas. En una se veía pasto seco; en otra, envases; en la tercera, casi nada. El reporte puso las fotos junto a los tiempos de desagüe para que el comité no discutiera solo con opiniones.",
      "En Ciencias repasaron que el vapor no desaparece: se condensa y regresa. El pavimento, sin embargo, cambia por dónde corre el agua cuando cae. Por eso el ciclo natural y el problema urbano hay que pensarlos juntos."
    ],
    "Formación Cívica y Ética": [
      "El comunicado de la directora se leyó en voz alta. No prohibía el debate: pedía que cada postura citara el reglamento o un hecho observable. Así el mural dejó de ser un muro de gritos y se volvió un expediente breve.",
      "Quienes estaban a favor de la veda total trajeron tres casos de distracción en clase. Eran hechos. Decir que el celular «siempre estorba» ya era un juicio, y el grupo aprendió a marcar la diferencia en el margen.",
      "Quienes pedían zonas y horarios contaron que, en el recreo, algunos avisan a casa si sale tarde el transporte. Ese uso no ocurría durante la clase. La propuesta, entonces, no negaba el problema: lo delimitaba.",
      "La encuesta preguntó en qué espacios el aparato servía para avisar a la familia y en cuáles distraía. No pedía un sí o un no absoluto. Los resultados se pegaron junto al reglamento, no en lugar de él."
    ],
    "Tecnología": [
      "Los sensores no apagaban los ventiladores por sí solos: avisaban cuando el aula quedaba vacía. El letrero recordaba el último paso. Si alguien ignoraba ambos, el consumo volvía a subir. Por eso el equipo insistió en el hábito, no solo en el aparato.",
      "La tabla de consumo se armó hora por hora. El aula piloto gastaba menos sobre todo al final de la mañana, cuando el salón testigo solía dejar luces y ventiladores encendidos durante el receso. Ese detalle explicó el 18 por ciento.",
      "Alguien en el consejo preguntó si el mes de prueba había sido más fresco. El equipo trajo la temperatura promedio de ambos salones: era similar. Así evitaron que el ahorro se atribuyera al clima y no al prototipo.",
      "Calcularon el tiempo de retorno con el costo de los sensores y el ahorro mensual. No prometieron milagros: mostraron en cuántos bimestres se recuperaba la inversión si el 18 por ciento se sostenía."
    ],
    "Matemáticas": [
      "El primer día el fútbol llenó media cancha y parecía «la verdad» del recreo. El segundo día lloviznaba y muchos se sentaron. El promedio de los tres días evitó que una sola tarde mandara en la decisión de las bancas.",
      "La tabla tenía filas por día y columnas por actividad: fútbol, sentados y caminando. Sumar en vertical y horizontal permitió comprobar que no se habían perdido alumnos en el recuento.",
      "Medir a la misma hora redujo el error de mezclar el inicio del recreo, cuando se arma el partido, con los últimos minutos, cuando ya hay filas para entrar. El grupo anotó el reloj en cada hoja.",
      "Un compañero pidió porcentajes además del promedio. Calcularon qué parte del patio hacía cada actividad. El fútbol seguía alto el martes, pero el porcentaje de quienes se sentaban justificaba más sombra, no solo otra portería."
    ]
  };
  const asigStr = String(asignatura || "").trim();
  if (escenas[asigStr]) return escenas[asigStr];
  if (/Ciencias|Biología|Física|Química/i.test(asigStr)) return escenas["Ciencias"];
  if (/Geografía/i.test(asigStr)) return escenas["Ciencias"];
  if (/Tecnología/i.test(asigStr)) return escenas["Tecnología"];
  if (/Matemáticas/i.test(asigStr)) return escenas["Matemáticas"];
  if (/Formación|Cívica|Ética/i.test(asigStr)) return escenas["Formación Cívica y Ética"];
  if (/Historia/i.test(asigStr)) return escenas["Historia"];
  return escenas["Español"];
}

function gruposRespaldo() {
  const l = [];
  ["1","2","3"].forEach(function (g) {
    ["a","b","c","d","e"].forEach(function (x) { l.push({ grado: g, grupo: g + x, activo: "SI", extra: 0, turno: "matutino" }); });
  });
  return l;
}
