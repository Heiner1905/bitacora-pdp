/* ==========================================================================
   FRAGMENTO.EXE · Contenido de la bitácora
   TODO el texto del sitio vive aquí. El diseño lo lee y lo pinta.

   Reglas:
   - Nunca inventar: lo que falte va como "[PENDIENTE: qué falta]".
     Los valores numéricos desconocidos van en null (la visualización
     dibuja su estructura vacía en acero punteado, sin números falsos).
   - estado: "pendiente" | "en-curso" | "completada"
   - Agregar una semana = agregar un objeto al array. Todo (anillo del índice,
     tira de la combinación, avance del fragmento) se calcula con su longitud.

   Bloques: { titulo, viz, datos }
     viz = "tachado" | "escalera" | "tarjetas" | "anillos" | "waffle" | "flujo"
         | "maquina" | "checklist" | "contador" | "texto" | "imagen"
     El esquema de `datos` para cada viz está en docs/DIRECCION.md §6.
   ========================================================================== */
window.BITACORA = {
  proyecto: "FRAGMENTO.EXE",
  proposito: "Registro semanal, en primera persona, de lo que trabajo en Proyecto de Desarrollo Personal I y de lo que reflexiono sobre ello.",
  autor: {
    nombre: "Heiner Danit Rincón Carrillo",
    nombreCorto: "Heiner Rincón",
    codigo: "A00402510",
    programa: "Ingeniería de Sistemas",
    semestre: "8.º semestre",
    materia: "Proyecto de Desarrollo Personal I",
    materiaCorta: "PDP I",
    periodo: "2026-2",
    rolObjetivo: "Analista de Seguridad Junior / práctica en ciberseguridad"
  },
  cierre: {
    mensaje: "[PENDIENTE: mensaje final de la bitácora]"
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
        { titulo: "Evidencia de haber presentado el test", viz: "imagen",
          datos: { src: "assets/img/semana-02-disc.png", alt: "Resultado de mi test DISC: Dominancia 7, Influencia 79, Estabilidad 96 y Cumplimiento 36. Perfil constante, leal y cooperador." } }
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
      estado: "pendiente",
      fecha: "",
      reflexion: "[PENDIENTE: reflexión de la semana]",
      bloques: [
        { titulo: "Propósito de mi hoja de vida", viz: "maquina",
          datos: { texto: "[PENDIENTE: propósito de mi CV]" } },
        { titulo: "Lecciones aprendidas", viz: "checklist",
          datos: { items: ["[PENDIENTE: lección 1]", "[PENDIENTE: lección 2]", "[PENDIENTE: lección 3]"] } }
      ],
      leccion: "[PENDIENTE: la lección clave de la semana]"
    },
    {
      id: "semana-07", numero: 7,
      titulo: "Entrevistas",
      estado: "pendiente",
      fecha: "",
      reflexion: "[PENDIENTE: reflexión de la semana]",
      bloques: [
        { titulo: "Puntos fuertes y débiles", viz: "tachado",
          datos: { pares: [
            { antes: "[PENDIENTE: punto débil]", despues: "[PENDIENTE: cómo lo convierto]" }
          ] } },
        { titulo: "Un ejemplo con el método STAR", viz: "flujo",
          datos: { pasos: [
            { letra: "S", nombre: "Situación", texto: "[PENDIENTE]" },
            { letra: "T", nombre: "Tarea", texto: "[PENDIENTE]" },
            { letra: "A", nombre: "Acción", texto: "[PENDIENTE]" },
            { letra: "R", nombre: "Resultado", texto: "[PENDIENTE]" }
          ] } }
      ],
      leccion: "[PENDIENTE: la lección clave de la semana]"
    },
    {
      id: "semana-08", numero: 8,
      titulo: "Sector, rol y empresas objetivo",
      estado: "pendiente",
      fecha: "",
      reflexion: "[PENDIENTE: reflexión de la semana]",
      bloques: [
        { titulo: "Mi objetivo en cifras", viz: "contador",
          datos: { items: [
            { valor: null, etiqueta: "Empresas objetivo" },
            { valor: null, etiqueta: "[PENDIENTE: otra cifra]" }
          ] } },
        { titulo: "Sector, rol y empresas", viz: "texto",
          datos: { texto: "[PENDIENTE: sector, rol (Analista de Seguridad Junior) y empresas objetivo]" } }
      ],
      leccion: "[PENDIENTE: la lección clave de la semana]"
    },
    {
      id: "semana-09", numero: 9,
      titulo: "Marca personal",
      estado: "pendiente",
      fecha: "",
      reflexion: "[PENDIENTE: reflexión de la semana]",
      bloques: [
        { titulo: "La imagen profesional que quiero proyectar", viz: "maquina",
          datos: { texto: "[PENDIENTE]" } }
      ],
      leccion: "[PENDIENTE: la lección clave de la semana]"
    },
    {
      id: "semana-10", numero: 10,
      titulo: "Búsqueda de práctica",
      estado: "pendiente",
      fecha: "",
      reflexion: "[PENDIENTE: reflexión de la semana]",
      bloques: [
        { titulo: "Tipo de práctica que busco", viz: "maquina",
          datos: { texto: "[PENDIENTE]" } },
        { titulo: "Contactos y canales de búsqueda", viz: "checklist",
          datos: { items: ["[PENDIENTE: canal 1]", "[PENDIENTE: canal 2]", "[PENDIENTE: contacto]"] } }
      ],
      leccion: "[PENDIENTE: la lección clave de la semana]"
    }
  ]
};
