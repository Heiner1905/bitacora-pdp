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
      estado: "pendiente",
      fecha: "[PENDIENTE: fecha]",
      reflexion: "[PENDIENTE: reflexión de la semana]",
      bloques: [
        { titulo: "Qué esperaba y qué espero ahora", viz: "tachado",
          datos: { pares: [
            { antes: "[PENDIENTE: lo que esperaba al empezar]", despues: "[PENDIENTE: lo que espero ahora]" }
          ] } },
        { titulo: "Cómo me siento frente al futuro laboral", viz: "texto",
          datos: { texto: "[PENDIENTE]" } }
      ],
      leccion: "[PENDIENTE: la lección clave de la semana]"
    },
    {
      id: "semana-02", numero: 2,
      titulo: "Pruebas de personalidad (DISC)",
      estado: "pendiente",
      fecha: "[PENDIENTE: fecha]",
      reflexion: "[PENDIENTE: reflexión de la semana]",
      bloques: [
        { titulo: "Tips para responderlas", viz: "checklist",
          datos: { items: ["[PENDIENTE: tip 1]", "[PENDIENTE: tip 2]", "[PENDIENTE: tip 3]"] } },
        { titulo: "Evidencia de haber presentado el test", viz: "imagen",
          datos: { src: null, alt: "[PENDIENTE: captura de la evidencia del test DISC]" } }
      ],
      leccion: "[PENDIENTE: la lección clave de la semana]"
    },
    {
      id: "semana-03", numero: 3,
      titulo: "Preparación para pruebas de selección",
      estado: "pendiente",
      fecha: "[PENDIENTE: fecha]",
      reflexion: "[PENDIENTE: reflexión de la semana]",
      bloques: [
        { titulo: "Tipos de prueba", viz: "escalera",
          datos: { unidad: "[PENDIENTE: qué mide la altura de cada columna]", items: [
            { etiqueta: "[PENDIENTE: prueba 1]", valor: null, nota: "[PENDIENTE]" },
            { etiqueta: "[PENDIENTE: prueba 2]", valor: null, nota: "[PENDIENTE]" },
            { etiqueta: "[PENDIENTE: prueba 3]", valor: null, nota: "[PENDIENTE]" },
            { etiqueta: "[PENDIENTE: prueba 4]", valor: null, nota: "[PENDIENTE]" }
          ] } },
        { titulo: "Cómo me preparo", viz: "texto",
          datos: { texto: "[PENDIENTE]" } }
      ],
      leccion: "[PENDIENTE: la lección clave de la semana]"
    },
    {
      id: "semana-04", numero: 4,
      titulo: "Competencias",
      estado: "pendiente",
      fecha: "[PENDIENTE: fecha]",
      reflexion: "[PENDIENTE: reflexión de la semana]",
      bloques: [
        { titulo: "Cinco fortalezas", viz: "tarjetas",
          datos: { tono: "fortaleza", items: [
            { nombre: "[PENDIENTE: fortaleza 1]", texto: "[PENDIENTE]" },
            { nombre: "[PENDIENTE: fortaleza 2]", texto: "[PENDIENTE]" },
            { nombre: "[PENDIENTE: fortaleza 3]", texto: "[PENDIENTE]" },
            { nombre: "[PENDIENTE: fortaleza 4]", texto: "[PENDIENTE]" },
            { nombre: "[PENDIENTE: fortaleza 5]", texto: "[PENDIENTE]" }
          ] } },
        { titulo: "Tres aspectos por mejorar", viz: "tarjetas",
          datos: { tono: "mejora", items: [
            { nombre: "[PENDIENTE: aspecto 1]", texto: "[PENDIENTE]" },
            { nombre: "[PENDIENTE: aspecto 2]", texto: "[PENDIENTE]" },
            { nombre: "[PENDIENTE: aspecto 3]", texto: "[PENDIENTE]" }
          ] } }
      ],
      leccion: "[PENDIENTE: la lección clave de la semana]"
    },
    {
      id: "semana-05", numero: 5,
      titulo: "Innegociables y resultado DISC",
      estado: "pendiente",
      fecha: "[PENDIENTE: fecha]",
      reflexion: "[PENDIENTE: reflexión de la semana]",
      bloques: [
        { titulo: "Mis innegociables", viz: "checklist",
          datos: { items: ["[PENDIENTE: innegociable 1]", "[PENDIENTE: innegociable 2]", "[PENDIENTE: innegociable 3]"] } },
        { titulo: "Mi perfil DISC", viz: "anillos",
          datos: { maximo: 100, dimensiones: [
            { letra: "D", nombre: "Dominancia", valor: null },
            { letra: "I", nombre: "Influencia", valor: null },
            { letra: "S", nombre: "Estabilidad", valor: null },
            { letra: "C", nombre: "Cumplimiento", valor: null }
          ] } },
        { titulo: "Qué significa mi perfil", viz: "waffle",
          datos: { total: 100, valor: null, etiqueta: "[PENDIENTE: qué representa la proporción]", texto: "[PENDIENTE]" } }
      ],
      leccion: "[PENDIENTE: la lección clave de la semana]"
    },
    {
      id: "semana-06", numero: 6,
      titulo: "Hoja de vida",
      estado: "pendiente",
      fecha: "[PENDIENTE: fecha]",
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
      fecha: "[PENDIENTE: fecha]",
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
      fecha: "[PENDIENTE: fecha]",
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
      fecha: "[PENDIENTE: fecha]",
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
      fecha: "[PENDIENTE: fecha]",
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
