/* ==========================================================================
   Bitácora Heiner Rincón · Contenido de la bitácora
   Todo el texto del sitio vive aquí. El diseño lo lee y lo pinta.

   Reglas:
   - Nunca inventar: lo que falte va como "[PENDIENTE: qué falta]".
     Los valores numéricos desconocidos van en null (la visualización
     dibuja su estructura vacía en acero punteado, sin números falsos).
   - estado: "pendiente" | "en-curso" | "completada"
   - Agregar una semana = agregar un objeto al array. Todo (anillo del índice,
     tira de la combinación, avance del fragmento) se calcula con su longitud.

   Bloques: { titulo, viz, datos }
     viz = "tachado" | "escalera" | "tarjetas" | "anillos" | "waffle" | "flujo"
         | "maquina" | "checklist" | "contador" | "texto" | "imagen" | "disc" | "enlace"
     El esquema de `datos` para cada viz está en docs/DIRECCION.md §7.
   ========================================================================== */
window.BITACORA = {
  proyecto: "Bitácora Heiner Rincón",
  proposito: "Registro semanal, en primera persona, de lo que trabajo en Programa de Desarrollo Profesional I y de lo que reflexiono sobre ello.",
  autor: {
    nombre: "Heiner Danit Rincón Carrillo",
    nombreCorto: "Heiner Rincón",
    codigo: "A00402510",
    programa: "Ingeniería de Sistemas",
    semestre: "8.º semestre",
    materia: "Programa de Desarrollo Profesional I",
    materiaCorta: "PDP I",
    periodo: "2026-2",
    rolObjetivo: "Analista de Seguridad Junior / práctica en ciberseguridad"
  },
  cierre: {
    mensaje: "Hay una frase que se le atribuye a Nikola Tesla: «Si quieres entender cómo funciona el universo, piensa en términos de energía, frecuencia y vibración». Este semestre la entendí a mi manera. Vibro con lo que deseo para materializar lo que quiero, y mi energía la dedico a lo que me gusta. Y me gusta todo lo que hago."
  },
  semanas: [
    {
      id: "semana-01", numero: 1,
      titulo: "Expectativas de la materia y de mi futuro laboral",
      estado: "completada",
      fecha: "",
      reflexion: "Llego a esta materia en octavo semestre, con la ciberseguridad como el área en la que quiero construir mi carrera. Entendí que este semestre vamos a recorrer, paso a paso, el proceso de selección de una práctica: las pruebas psicotécnicas y técnicas, las competencias, la hoja de vida y la entrevista. Después viene la gestión del perfil profesional, con la marca personal, LinkedIn y el pitch.\n\nTodavía no estoy buscando práctica, y por eso me sirve ver el proceso completo antes de entrar en él.",
      bloques: [
        { titulo: "Qué esperaba y qué espero ahora", viz: "tachado",
          datos: { pares: [
            { antes: "Una materia más para cumplir créditos.", despues: "Un entrenamiento para entender cómo funciona el proceso de selección antes de vivirlo." }
          ] } },
        { titulo: "Para qué me sirve Mindset Formación", viz: "texto",
          datos: { texto: "Mindset Formación me sirve para prepararme con método. Me da herramientas concretas para cada etapa del proceso y me obliga a conocerme mejor: tener claro qué sé hacer, qué me diferencia y en qué me falta crecer. Sin ese autoconocimiento no puedo presentarme bien como profesional." } },
        { titulo: "Qué emoción me genera salir al mundo laboral", viz: "texto",
          datos: { texto: "Pensar en salir al mundo laboral me genera seguridad y motivación. Soy dedicado cuando me propongo algo y suelo resolver las situaciones que se me presentan; además, la ciberseguridad me motiva porque consiste en ver lo que otros no ven. Lo que todavía no conozco son los procesos formales de selección, y eso no me genera ansiedad: es información que me falta, y esta materia es el lugar para conseguirla. Si lo quiero hacer, lo hago." } }
      ],
      leccion: "Antes de buscar una práctica, quiero entender cómo funciona el proceso. Conocerlo es lo que me da seguridad."
    },
    {
      id: "semana-02", numero: 2,
      titulo: "Pruebas de personalidad (DISC)",
      estado: "completada",
      fecha: "",
      reflexion: "Esta semana conocí las pruebas de personalidad que usan las empresas en sus procesos de selección y presenté el test DISC, que describe el comportamiento en cuatro dimensiones: dominancia, influencia, estabilidad y cumplimiento. Mi resultado fue un perfil constante, leal y cooperador, con la estabilidad (96) y la influencia (79) como mis dimensiones más altas.\n\nLo que más me quedó es que estas pruebas no tienen respuestas correctas. Buscan entender cómo actúo en realidad, y por eso la mejor preparación es conocerme y responder con honestidad.",
      bloques: [
        { titulo: "Tips para responderlas", viz: "checklist",
          datos: { items: [
            "Responder con honestidad, pensando en cómo actúo normalmente y no en cómo creo que la empresa quiere que sea.",
            "Ser coherente: varias preguntas miden lo mismo con otras palabras, y las contradicciones se notan.",
            "Evitar refugiarme en las respuestas intermedias cuando tengo una preferencia clara.",
            "Pensar en mi comportamiento habitual en el estudio o el trabajo, no en un día puntual.",
            "Leer cada pregunta completa y responder sin darle demasiadas vueltas."
          ] } },
        { titulo: "Mi perfil DISC", viz: "disc", datos: {
          fuente: "Formulario de la clase",
          maximo: 100,
          dimensiones: [
            { letra: "D", nombre: "Dominancia",   valor: 7  },
            { letra: "I", nombre: "Influencia",   valor: 79 },
            { letra: "S", nombre: "Estabilidad",  valor: 96 },
            { letra: "C", nombre: "Cumplimiento", valor: 36 } ],
          estilo: ["Constante", "Leal", "Cooperador"],
          rasgos: [
            "Sostiene el esfuerzo en tareas prolongadas",
            "Facilita la colaboración y sostiene acuerdos",
            "Aporta orden y previsión a las tareas",
            "Ofrece apoyo a las personas del equipo",
            "Transmite entusiasmo y apertura a nuevas ideas" ],
          claves: [
            { titulo: "Qué distingue su perfil", texto: "la combinación de constancia y cordialidad se traduce en un esfuerzo sostenido y relaciones de confianza." },
            { titulo: "En qué se enfoca", texto: "en apoyar a las personas, coordinar esfuerzos y mantener acuerdos estables." },
            { titulo: "Qué conviene regular", texto: "la tendencia a sostener la continuidad, cuando el entorno cambia con rapidez, puede retrasar la incorporación de ajustes necesarios." } ] } }
      ],
      leccion: "Una prueba de personalidad solo me sirve si respondo como soy, no como creo que me quieren ver."
    },
    {
      id: "semana-03", numero: 3,
      titulo: "Pruebas técnicas",
      estado: "completada",
      fecha: "",
      reflexion: "Esta semana presentamos pruebas técnicas de razonamiento cuantitativo y lectura crítica, parecidas a las que muchas empresas aplican en la primera etapa de un proceso de selección. Me di cuenta de que, además de lo que sé, miden la precisión y la velocidad con las que razono bajo un límite de tiempo.\n\nPara el área que me interesa esto pesa. El trabajo de un analista de seguridad consiste en leer información con cuidado, encontrar lo que no encaja y decidir con base en datos.",
      bloques: [
        { titulo: "Tipos de prueba", viz: "tarjetas",
          datos: { tono: "fortaleza", items: [
            { nombre: "Razonamiento cuantitativo", texto: "Evalúa cómo interpreto datos, porcentajes, proporciones y gráficas, y cómo resuelvo problemas numéricos en poco tiempo." },
            { nombre: "Lectura crítica", texto: "Evalúa si entiendo un texto a fondo: la idea central, los supuestos del autor y las conclusiones que se pueden sacar, o no, de lo que dice." }
          ] } },
        { titulo: "Cómo me preparo", viz: "checklist",
          datos: { items: [
            "Hacer simulacros con el mismo tiempo de la prueba real para medir mi ritmo y ver en qué tipo de pregunta me demoro.",
            "En razonamiento cuantitativo, repasar porcentajes, proporciones, regla de tres y lectura de gráficas, y practicar el cálculo mental.",
            "En lectura crítica, leer primero la pregunta, buscar la idea central de cada párrafo y descartar las opciones que el texto no respalda.",
            "Repasar los fundamentos técnicos de mi área: redes, sistemas operativos, programación y conceptos básicos de seguridad.",
            "Llegar descansado y administrar el tiempo: si una pregunta me bloquea, la marco y sigo."
          ] } }
      ],
      leccion: "En una prueba técnica la preparación se nota en el ritmo: lo que practico con tiempo, lo resuelvo con calma."
    },
    {
      id: "semana-04", numero: 4,
      titulo: "Competencias",
      estado: "completada",
      fecha: "",
      reflexion: "Esta semana hice un autoanálisis de diez competencias que buscan las empresas y me califiqué de 1 a 4 según qué tan seguido las aplico. También aprendí el método STAR (situación, tarea, acción, resultado), que sirve para demostrar una competencia en una entrevista con hechos concretos y en menos de tres minutos.\n\nMis puntajes más altos están en lo técnico y en la forma de aprender: aprendizaje activo, pensamiento crítico, uso de la tecnología, programación y resiliencia. Me califiqué más bajo en proponer ideas nuevas, tomar la iniciativa con ellas y liderar de forma constante. Coincide con mi resultado DISC, donde la estabilidad salió alta y la dominancia baja: tiendo a lo seguro y a cooperar más que a dirigir.",
      bloques: [
        { titulo: "Mi autoanálisis", viz: "escalera",
          datos: { unidad: "Nivel de 1 a 4", maximo: 4, items: [
            { etiqueta: "Pensamiento analítico e innovador", valor: 3, nota: "" },
            { etiqueta: "Aprendizaje activo", valor: 4, nota: "" },
            { etiqueta: "Solución de problemas complejos", valor: 3, nota: "" },
            { etiqueta: "Pensamiento crítico", valor: 4, nota: "" },
            { etiqueta: "Creatividad, originalidad e iniciativa", valor: 3, nota: "" },
            { etiqueta: "Liderazgo e influencia social", valor: 3, nota: "" },
            { etiqueta: "Uso de la tecnología, monitoreo y control", valor: 4, nota: "" },
            { etiqueta: "Diseño y programación de tecnología", valor: 4, nota: "" },
            { etiqueta: "Resiliencia, tolerancia al estrés y flexibilidad", valor: 4, nota: "" },
            { etiqueta: "Razonamiento, solución de problemas e ideación", valor: 3, nota: "" }
          ] } },
        { titulo: "Cinco fortalezas", viz: "tarjetas",
          datos: { tono: "fortaleza", items: [
            { nombre: "Aprendizaje activo", texto: "Aprendo por mi cuenta lo que necesito y disfruto adaptarme a herramientas nuevas. Esta misma bitácora la construí aprendiendo sobre la marcha." },
            { nombre: "Pensamiento crítico", texto: "Cuestiono la información antes de aceptarla y reviso de dónde viene. Es una de las bases de la ciberseguridad." },
            { nombre: "Uso de la tecnología", texto: "Uso y superviso herramientas tecnológicas con facilidad, incluidas las de inteligencia artificial, y las incorporo a mi forma de estudiar y trabajar." },
            { nombre: "Diseño y programación", texto: "Diseño y programo soluciones para necesidades concretas, tanto en la universidad como en los proyectos en los que trabajo." },
            { nombre: "Resiliencia", texto: "Manejo la presión con calma. Estudio, trabajo y entreno al mismo tiempo, y me adapto rápido cuando cambian los planes." }
          ] } },
        { titulo: "Tres aspectos por mejorar", viz: "tarjetas",
          datos: { tono: "mejora", items: [
            { nombre: "Pensamiento innovador", texto: "Evalúo diferentes enfoques, pero tiendo a quedarme con la solución segura. Quiero atreverme más a proponer soluciones nuevas." },
            { nombre: "Creatividad e iniciativa", texto: "Propongo ideas, pero no siempre tomo la iniciativa para llevarlas a cabo." },
            { nombre: "Liderazgo", texto: "Asumo el liderazgo cuando es necesario. Quiero hacerlo con más constancia y confianza." }
          ] } }
      ],
      leccion: "Lo técnico ya lo tengo encaminado. Ahora me toca atreverme a proponer y a liderar."
    },
    {
      id: "semana-05", numero: 5,
      titulo: "Innegociables y resultado DISC",
      estado: "completada",
      fecha: "",
      reflexion: "Esta semana trabajé la conciencia de mí mismo para tomar decisiones laborales. Junté dos resultados: mi perfil DISC y el resumen de alineación profesional que hice en WorkClue, un mapa de cinco factores (impulso, seguridad, autonomía, equilibrio y desafío). Los dos apuntan a lo mismo. En el DISC mi dimensión más alta es la estabilidad, con 96 de 100, y en el mapa el factor más marcado es el equilibrio, con 12 de 12, seguido de la seguridad.\n\nMi estilo DISC es estable con alta influencia: constante, leal y cooperador. Sostengo el esfuerzo en tareas largas, apoyo al equipo y transmito entusiasmo. Saberlo me deja claro que rindo mejor con un ritmo estable y con límites definidos entre el trabajo y el resto de mi vida.",
      bloques: [
        { titulo: "Mis innegociables", viz: "checklist",
          datos: { items: [
            "Equilibrio entre el trabajo y mi vida personal: horarios reales que respeten mi tiempo para estudiar, entrenar y descansar.",
            "Estabilidad y condiciones claras desde el inicio.",
            "Prioridades definidas: saber qué se espera de mí y cuándo termina mi jornada.",
            "Un ambiente de respeto y trabajo en equipo."
          ] } },
        { titulo: "Mi perfil DISC", viz: "anillos",
          datos: { maximo: 100, dimensiones: [
            { letra: "D", nombre: "Dominancia", valor: 7 },
            { letra: "I", nombre: "Influencia", valor: 79 },
            { letra: "S", nombre: "Estabilidad", valor: 96 },
            { letra: "C", nombre: "Cumplimiento", valor: 36 }
          ] } },
        { titulo: "Qué significa mi perfil", viz: "waffle",
          datos: { total: 100, valor: 96, etiqueta: "Estabilidad, mi dimensión DISC más alta", texto: "Esta información me sirve como filtro para buscar práctica. Antes de aplicar voy a revisar qué dice la oferta sobre horarios, turnos y cambios de prioridad, y en la entrevista voy a preguntar cómo es una semana típica del cargo. En ciberseguridad hay roles muy reactivos, como la atención de incidentes, y otros con procesos más definidos, como el análisis de vulnerabilidades o el cumplimiento normativo. Conocer mi perfil me ayuda a elegir con criterio, sin dejar de buscar espacios donde pueda seguir aprendiendo." } }
      ],
      leccion: "Conocer mis innegociables me permite elegir una práctica, no solo aceptarla."
    },
    {
      id: "semana-06", numero: 6,
      titulo: "Hoja de vida",
      estado: "completada",
      fecha: "",
      reflexion: "Esta semana construí mi hoja de vida en español sobre la plantilla de la universidad. Entendí que un reclutador la revisa en pocos segundos y que en ese tiempo tiene que ver quién soy: un estudiante de octavo semestre de Ingeniería de Sistemas que ya ha trabajado en proyectos reales y que se está orientando hacia la ciberseguridad defensiva.\n\nTambién entendí que la hoja de vida y el perfil de LinkedIn tienen que contar la misma historia. Si un reclutador encuentra datos distintos en cada uno, pierde la confianza antes de hablar conmigo.",
      bloques: [
        { titulo: "Propósito de mi hoja de vida", viz: "maquina",
          datos: { texto: "Que alguien quiera conocerme en una entrevista." } },
        { titulo: "Qué debo evitar", viz: "tarjetas",
          datos: { tono: "mejora", items: [
            { nombre: "Información vieja", texto: "Los logros del colegio o de hace más de cinco años ocupan espacio y no dicen quién soy hoy." },
            { nombre: "Habilidades sin respaldo", texto: "Cada herramienta que pongo la tengo que poder explicar en una entrevista." },
            { nombre: "Funciones sin resultados", texto: "«Encargado de…» describe un cargo. Lo que interesa es lo que logré en él." },
            { nombre: "Exagerar", texto: "Todavía no tengo certificaciones en ciberseguridad, y prefiero mostrar cómo me estoy preparando." },
            { nombre: "Revelar información confidencial", texto: "Uno de mis proyectos es para un cliente; lo describo sin nombrarlo ni dar detalles internos." }
          ] } },
        { titulo: "Lo que no puede faltar", viz: "checklist",
          datos: { items: [
            "Datos de contacto claros y los enlaces a mi LinkedIn y mi GitHub.",
            "Un perfil corto que diga a qué rol apunto.",
            "La experiencia contada con resultados: el desarrollo full stack en Vamo y los modelos de inteligencia artificial que detectan daños y leen etiquetas para automatizar la inspección de contenedores.",
            "Mi formación, las certificaciones que sí tengo y mi nivel de inglés.",
            "Las palabras clave de cada oferta, porque muchas empresas filtran las hojas de vida con sistemas automáticos antes de que las lea una persona."
          ] } }
      ],
      leccion: "Mi hoja de vida no cuenta todo lo que he hecho. Cuenta lo que hace que quieran conocerme."
    },
    {
      id: "semana-07", numero: 7,
      titulo: "Entrevista de selección y otros métodos de evaluación",
      estado: "completada",
      fecha: "",
      reflexion: "Todavía no me siento preparado. En mi vida he presentado una sola entrevista de selección y sé que me falta práctica. Esta semana entendí que eso se puede corregir, porque las preguntas se repiten y se agrupan por tipos. Las que rompen el hielo, como «háblame de ti», abren la conversación. Las incómodas buscan señales de alerta en la trayectoria y las difíciles miden cómo manejo la presión o un error. Las capciosas, como «¿cuál es tu mayor debilidad?», evalúan qué tan honesto soy y cuánto me conozco, y las retadoras piden ejemplos concretos de conflictos, liderazgo o riesgos. También hay preguntas prohibidas, sobre religión, orientación sexual, salud o planes de tener hijos, que nadie debería hacerme en un proceso de selección.\n\nPara las retadoras sirve el método STAR. Ahí tengo material, porque ya he trabajado en proyectos reales; lo que me falta es ordenarlo y ensayarlo en voz alta. Aprendí además que la entrevista no es el único filtro: una empresa también puede evaluarme con pruebas técnicas, casos prácticos o actividades en grupo.",
      bloques: [
        { titulo: "Antes y ahora", viz: "tachado",
          datos: { pares: [
            { antes: "Una entrevista se improvisa.", despues: "Una entrevista se prepara: las preguntas se repiten y las respuestas se pueden ensayar." }
          ] } },
        { titulo: "Mis puntos fuertes", viz: "tarjetas",
          datos: { tono: "fortaleza", items: [
            { nombre: "Comunicación", texto: "Me gusta conversar con personas nuevas, mi perfil DISC tiene una influencia alta (79 de 100) y tengo una formación en comunicación de alto impacto." },
            { nombre: "Ejemplos reales", texto: "Puedo contar con el método STAR lo que hice en Vamo y en el proyecto de inspección de contenedores." },
            { nombre: "Inglés", texto: "Viví un año en Londres y puedo presentar una entrevista en inglés." },
            { nombre: "Una presentación ya armada", texto: "Mi pitch me da la base para responder «háblame de ti»." }
          ] } },
        { titulo: "Mis puntos débiles", viz: "tarjetas",
          datos: { tono: "mejora", items: [
            { nombre: "Poca práctica", texto: "Solo he presentado una entrevista y no sé cómo respondo bajo la presión de una real." },
            { nombre: "Preguntas técnicas de ciberseguridad", texto: "No tengo experiencia laboral ni certificaciones en el área; lo que sé lo aprendí en la carrera y por mi cuenta." },
            { nombre: "Errores y fracasos", texto: "No tengo preparados ejemplos de errores que haya cometido y de lo que aprendí de ellos." },
            { nombre: "Pretensiones económicas", texto: "Todavía no sé cuánto se le paga a un practicante en mi área." }
          ] } },
        { titulo: "Un ejemplo con el método STAR", viz: "flujo",
          datos: { pasos: [
            { letra: "S", nombre: "Situación", texto: "En un proyecto para un cliente, la inspección de contenedores se hacía a ojo, revisando uno por uno." },
            { letra: "T", nombre: "Tarea", texto: "Me encargué de automatizar dos partes de esa revisión: detectar daños y leer las etiquetas." },
            { letra: "A", nombre: "Acción", texto: "Desarrollé y entrené dos modelos de inteligencia artificial, uno para cada tarea." },
            { letra: "R", nombre: "Resultado", texto: "Los dos modelos quedaron terminados y entregados al cliente." }
          ] } },
        { titulo: "Mi plan de preparación", viz: "checklist",
          datos: { items: [
            "Escribir cinco historias con el método STAR: un reto técnico, un error, un conflicto en equipo, un logro y una situación de presión.",
            "Ensayar en voz alta y grabarme respondiendo las preguntas más comunes, para corregir lo que solo se nota cuando uno se escucha.",
            "Antes de cada entrevista, investigar la empresa: qué hace, sus servicios, sus noticias recientes y cómo trabaja su equipo de seguridad.",
            "Averiguar cuánto se ofrece a los practicantes en mi área, para responder con un rango y no con una cifra al azar.",
            "Llevar al menos dos preguntas para el entrevistador. Decir que no tengo preguntas transmite falta de interés."
          ] } }
      ],
      leccion: "La seguridad en una entrevista se construye ensayando antes de que llegue."
    },
    {
      id: "semana-08", numero: 8,
      titulo: "Mercado laboral",
      estado: "completada",
      fecha: "",
      reflexion: "Me veo trabajando en ciberseguridad defensiva, en la detección de amenazas, combinada con la inteligencia artificial. Ya construí modelos de detección: en un proyecto para un cliente desarrollé modelos que identifican daños y leen etiquetas en contenedores. Me interesa aplicar esa misma lógica a la seguridad, buscando en grandes volúmenes de datos las señales que delatan un ataque.\n\nAl investigar el mercado para mi perfil de LinkedIn encontré que la mayoría de las plazas de práctica en ciberseguridad en Colombia están del lado defensivo: centros de operaciones de seguridad (SOC), gestión de vulnerabilidades, respuesta a incidentes y seguridad en la nube. Eso coincide con lo que quiero hacer y con lo que descubrí en la semana 5: rindo mejor en roles con procesos definidos.",
      bloques: [
        { titulo: "Sectores", viz: "tarjetas",
          datos: { tono: "fortaleza", items: [
            { nombre: "Empresas de ciberseguridad", texto: "Su producto es la protección misma, así que ahí aprendería cómo se construyen y se operan las herramientas de detección." },
            { nombre: "Consultoría y servicios de tecnología", texto: "Se trabaja con varios clientes y tecnologías a la vez; para un practicante, eso significa aprender rápido." }
          ] } },
        { titulo: "Área", viz: "checklist",
          datos: { items: [
            "Monitoreo y detección de amenazas en un SOC (blue team), mi primera opción.",
            "Gestión de vulnerabilidades.",
            "Seguridad en la nube y DevSecOps, donde aprovecho lo que ya sé de Docker, Kubernetes, Terraform y Jenkins."
          ] } },
        { titulo: "Empresas que me llaman la atención", viz: "tarjetas",
          datos: { tono: "fortaleza", items: [
            { nombre: "Fortinet, mi primera opción", texto: "Es una empresa dedicada por completo a la ciberseguridad, y su laboratorio de investigación de amenazas usa inteligencia artificial para detectarlas. Es justo la combinación que quiero aprender." },
            { nombre: "Perficient", texto: "Es una consultora de tecnología con presencia en Colombia, donde trabajaría con clientes y tecnologías distintas." },
            { nombre: "Globant", texto: "Es una empresa de tecnología con sedes en Colombia y proyectos para clientes de todo el mundo." }
          ] } }
      ],
      leccion: "Ya construí modelos que detectan. Ahora quiero que detecten amenazas."
    },
    {
      id: "semana-09", numero: 9,
      titulo: "Marca personal",
      estado: "completada",
      fecha: "",
      reflexion: "La imagen que quiero proyectar se resume en una idea: ver lo que otros no ven. Es lo que me atrajo de la ciberseguridad y lo que quiero que la gente asocie con mi nombre. Quiero que me vean como un analista atento a los detalles, que encuentra la señal entre el ruido y explica con claridad lo que encontró.\n\nBusco que esa imagen sea seria y profesional, y que se sostenga con hechos. Mi perfil de LinkedIn, mi GitHub, mi hoja de vida, mi pitch y esta bitácora tienen que contar la misma historia con el mismo tono. Si una de esas piezas dice algo distinto, la imagen se cae.",
      bloques: [
        { titulo: "La imagen que quiero proyectar", viz: "maquina",
          datos: { texto: "Ver lo que otros no ven." } },
        { titulo: "Antes y ahora", viz: "tachado",
          datos: { pares: [
            { antes: "La marca personal es cosa de influenciadores.", despues: "Mi marca personal es la impresión que dejo, en persona y en internet, la cuide o no." }
          ] } },
        { titulo: "Cómo quiero que me describan", viz: "tarjetas",
          datos: { tono: "fortaleza", items: [
            { nombre: "Atento al detalle", texto: "Reviso lo que otros pasan por alto, que es la base del trabajo en seguridad." },
            { nombre: "Constante", texto: "La estabilidad es mi dimensión DISC más alta (96 de 100), y la demuestro estudiando, trabajando y entrenando al mismo tiempo." },
            { nombre: "Cercano", texto: "Me gusta trabajar con personas y sé explicar un hallazgo técnico a alguien que no es técnico." }
          ] } },
        { titulo: "Dónde se ve mi marca", viz: "checklist",
          datos: { items: [
            "LinkedIn, con un perfil principal en inglés, uno secundario en español y un titular bilingüe.",
            "GitHub, con mis proyectos públicos.",
            "La hoja de vida.",
            "El pitch en video.",
            "Esta bitácora, que muestra lo que puedo construir con la tecnología."
          ] } }
      ],
      leccion: "Si no defino la imagen que proyecto, otros la definen por mí."
    },
    {
      id: "semana-10", numero: 10,
      titulo: "Gestión de oportunidades laborales",
      estado: "completada",
      fecha: "",
      reflexion: "Tengo claro el tipo de práctica que busco y para cuándo: el segundo semestre de 2027. Estoy abierto a cualquier ciudad y modalidad, presencial, híbrida o remota. Todavía no estoy aplicando; estoy preparando el terreno para que mi perfil esté listo cuando llegue el momento.\n\nMi medio principal es LinkedIn. Esta semana lo optimicé desde cero, con un titular, un «Acerca de» y una experiencia orientados a prácticas en ciberseguridad. Mi otra fuente son las personas: los profesores con los que he construido una buena relación y mis compañeros de carrera.",
      bloques: [
        { titulo: "La práctica que busco", viz: "maquina",
          datos: { texto: "Ciberseguridad defensiva, en detección de amenazas." } },
        { titulo: "Mis contactos", viz: "tarjetas",
          datos: { tono: "fortaleza", items: [
            { nombre: "Profesores de la universidad", texto: "Conocen mi trabajo de cerca y pueden orientarme, recomendarme o contarme de convocatorias." },
            { nombre: "Compañeros de carrera", texto: "Los que empiezan su práctica antes que yo me pueden contar cómo fueron sus procesos y avisarme de vacantes." },
            { nombre: "Profesionales y reclutadores de seguridad en LinkedIn", texto: "Es la red que voy a construir de aquí a la práctica, empezando por las empresas que me interesan." }
          ] } },
        { titulo: "Cómo uso LinkedIn para buscar", viz: "checklist",
          datos: { items: [
            "Alertas de empleo con términos como «practicante de ciberseguridad» y «security intern».",
            "Seguir a Fortinet, Perficient y Globant, y a sus reclutadores, para conocer cómo seleccionan practicantes.",
            "Conectar con profesionales del área con una nota personalizada, nunca con invitaciones masivas.",
            "Mantener el perfil al día cada vez que termine un proyecto o un curso."
          ] } },
        { titulo: "Mi perfil de LinkedIn", viz: "enlace",
          datos: { tipo: "linkedin", etiqueta: "Ver mi perfil en LinkedIn", texto: "Este es el perfil que optimicé esta semana.",
            url: "https://www.linkedin.com/in/heiner-rincon-sw-engineering/" } }
      ],
      leccion: "Las oportunidades llegan primero a quien ya conoce a las personas correctas."
    },
    {
      id: "semana-11", numero: 11,
      titulo: "Pitch laboral",
      estado: "completada",
      fecha: "",
      reflexion: "Mi pitch tiene el propósito de presentarme en poco más de un minuto y dejar una idea clara: soy un estudiante de Ingeniería de Sistemas que construyó modelos de detección con inteligencia artificial y quiere aplicar esa experiencia a la ciberseguridad defensiva. Lo grabé en video pensando en un reclutador o en un líder técnico de seguridad. Al terminar de verlo, quiero que esa persona revise mi LinkedIn o me escriba.\n\nEntendí que un pitch es una historia corta con una sola idea central, en la que cada parte cumple una función. Por eso no intenté meter toda mi hoja de vida.",
      bloques: [
        { titulo: "Antes y ahora", viz: "tachado",
          datos: { pares: [
            { antes: "Un pitch es recitar la hoja de vida rápido.", despues: "Un pitch es una historia corta con una idea que el otro recuerde." }
          ] } },
        { titulo: "Cómo está armado mi pitch", viz: "checklist",
          datos: { items: [
            "Gancho: un dato sobre cuánto tarda una empresa en detectar que la atacaron.",
            "Quién soy.",
            "El problema: las amenazas pasan desapercibidas durante meses.",
            "Mi propuesta: detección apoyada en inteligencia artificial.",
            "El beneficio para la empresa.",
            "Por qué yo: ya construí modelos de detección en un proyecto real.",
            "Cierre con mis datos de contacto."
          ] } },
        { titulo: "Lo que aprendí al grabarlo", viz: "texto",
          datos: { texto: "Hice tres versiones antes de quedar conforme. Escribir el guion me obligó a escoger una idea y descartar el resto. Al grabarlo noté que hablo rápido, así que ajusté el texto a mi ritmo. Lo voy a seguir mejorando, y ya me sirve como base para responder «háblame de ti» en una entrevista." } },
        { titulo: "Mi pitch", viz: "enlace",
          datos: { tipo: "video", etiqueta: "Ver mi pitch en YouTube", texto: "Mi presentación profesional en video.",
            url: "https://youtu.be/yVKADc-iFLk" } }
      ],
      leccion: "Si no puedo explicar en un minuto quién soy, el otro tampoco lo va a recordar."
    },
    {
      id: "semana-12", numero: 12,
      titulo: "Gestión de mis finanzas",
      estado: "completada",
      fecha: "",
      reflexion: "Tengo una claridad parcial. Como trabajo mientras estudio, manejo mi propio dinero, y la charla me hizo ver que lo hago más por costumbre que con un sistema. La idea que más me quedó es que muchas decisiones de gasto son emocionales: la publicidad está diseñada para despertar emociones, y es fácil terminar comprando cosas que no necesito.\n\nQuiero llegar a la práctica con orden, para que el primer apoyo económico que reciba ya tenga un destino.",
      bloques: [
        { titulo: "Antes y ahora", viz: "tachado",
          datos: { pares: [
            { antes: "Si me alcanza a fin de mes, voy bien.", despues: "Voy bien si sé a dónde se fue mi dinero y ahorré antes de gastar." }
          ] } },
        { titulo: "Qué debo tener en cuenta", viz: "checklist",
          datos: { items: [
            "Registrar los gastos del mes para saber a dónde se va el dinero.",
            "Separar el ahorro apenas recibo un ingreso, no al final con lo que sobre.",
            "Revisar mis suscripciones. Pago herramientas de inteligencia artificial para estudiar y trabajar, y conviene confirmar cada cierto tiempo que todas se usan.",
            "Darle prioridad al gasto en formación, como los cursos de ciberseguridad que ya compré, porque aumenta mi valor profesional.",
            "Esperar un día antes de una compra impulsiva.",
            "Decidir, antes de empezar la práctica, qué parte del apoyo económico voy a ahorrar."
          ] } }
      ],
      leccion: "El dinero que no planeo lo terminan gastando mis emociones."
    },
    {
      id: "semana-13", numero: 13,
      titulo: "Gestión emocional y el mundo laboral",
      estado: "completada",
      fecha: "",
      reflexion: "La emoción que más tengo presente es la motivación. Este semestre avancé en varios frentes: optimicé mi perfil de LinkedIn, construí mi hoja de vida, grabé mi pitch y armé esta bitácora. Ver ese avance me da seguridad.\n\nTambién hay presión. Estudio, trabajo y entreno al mismo tiempo, y a veces quiero avanzar más rápido de lo que el tiempo permite. Frente a las entrevistas tengo una inseguridad concreta, porque solo he presentado una.",
      bloques: [
        { titulo: "Cómo uso cada emoción", viz: "tarjetas",
          datos: { tono: "fortaleza", items: [
            { nombre: "Motivación", texto: "La convierto en un plan con fechas, como las historias STAR y los simulacros, para que mi avance no dependa del ánimo de cada día." },
            { nombre: "Presión", texto: "Defino pocas prioridades por semana y respeto el descanso y el entrenamiento, que son parte de mis innegociables." },
            { nombre: "Inseguridad frente a las entrevistas", texto: "La trato como información: me dice qué practicar. Cada simulacro la reduce un poco." }
          ] } },
        { titulo: "Observar sin reaccionar", viz: "texto",
          datos: { texto: "En la materia de Estoicismo, y por interés propio, he practicado observar mis pensamientos y emociones sin identificarme con ellos. En una entrevista eso me permite sentir nervios sin que los nervios decidan lo que respondo." } }
      ],
      leccion: "Mis emociones me informan; las decisiones las tomo yo."
    }
  ]
};
