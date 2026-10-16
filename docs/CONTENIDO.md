# Contenido de la bitácora

## Datos del autor

- Nombre completo: **Heiner Danit Rincón Carrillo** (forma corta en el diseño: "HEINER RINCÓN")
- Código: **A00402510**
- Programa: **Ingeniería de Sistemas**, 8.º semestre
- Materia: **Proyecto de Desarrollo Personal I (PDP I)**
- Periodo: 2026-2
- Rol objetivo: Analista de Seguridad Junior / práctica en ciberseguridad

## Qué es una bitácora en esta materia

Un registro semanal, en primera persona, de lo trabajado en clase y de lo que Heiner reflexiona sobre ello. Cada semana responde preguntas del curso (expectativas, fortalezas, innegociables, hoja de vida, entrevistas, sector objetivo, marca personal, búsqueda de práctica). Es más reflexivo que técnico.

## Estructura de la página

1. **Portada** — símbolo, nombre completo, código, programa, materia, periodo.
2. **Índice / mapa** — panel que se abre desde el encabezado: las semanas como arcos del anillo (N arcos = N semanas), con su estado. Además, la tira de la combinación muestra el avance.
3. **Semanas** — una sección por semana:
   - Número de semana como plano + `SEMANA 0X` + título del tema + estado + fecha.
   - Reflexión en primera persona.
   - Bloques específicos según el tema (ver tabla).
   - Cierre de semana: la **lección clave**, destacada (diseño en `docs/DIRECCION.md` §8).
4. **Cierre** — el fragmento encaja, el círculo se completa, mensaje final.

## Semanas previstas (provisionales — Heiner confirmará)

| # | Tema | Bloques sugeridos |
|---|---|---|
| 01 | Expectativas de la materia y de mi futuro laboral | Qué espero; cómo me siento frente al futuro laboral |
| 02 | Pruebas de personalidad (DISC) | Tips para responderlas; evidencia de haber presentado el test |
| 03 | Preparación para pruebas de selección | Tipos de prueba; cómo me preparo |
| 04 | Competencias | 5 fortalezas; 3 aspectos por mejorar |
| 05 | Innegociables y resultado DISC | Mis innegociables; mi perfil DISC y qué significa |
| 06 | Hoja de vida | Propósito de mi CV; lecciones aprendidas |
| 07 | Entrevistas | Puntos fuertes y débiles; ejemplos con método STAR |
| 08 | Sector, rol y empresas objetivo | Sector; rol; empresas objetivo |
| 09 | Marca personal | La imagen profesional que quiero proyectar |
| 10 | Búsqueda de práctica | Tipo de práctica; contactos; canales de búsqueda |

El número de semanas **no es fijo**: todo (anillo del índice, contador, avance del fragmento) se calcula con la longitud del array. Agregar una semana = agregar una entrada.

## Modelo de datos — `site/data/semanas.js`

```js
window.BITACORA = {
  autor: {
    nombre: "Heiner Danit Rincón Carrillo",
    nombreCorto: "Heiner Rincón",
    codigo: "A00402510",
    programa: "Ingeniería de Sistemas",
    materia: "Proyecto de Desarrollo Personal I",
    periodo: "2026-2"
  },
  semanas: [
    {
      id: "semana-01",
      numero: 1,
      titulo: "Expectativas de la materia y de mi futuro laboral",
      estado: "pendiente",        // "pendiente" | "en-curso" | "completada"
      fecha: "[PENDIENTE: fecha]",
      reflexion: "[PENDIENTE: reflexión de la semana]",
      bloques: [
        { titulo: "Qué esperaba y qué espero ahora", viz: "tachado",
          datos: { pares: [{ antes: "[PENDIENTE]", despues: "[PENDIENTE]" }] } }
        // viz: "tachado" | "escalera" | "tarjetas" | "anillos" | "waffle" | "flujo"
        //    | "maquina" | "checklist" | "contador" | "texto" | "imagen"
        // Esquema de `datos` por viz: docs/DIRECCION.md §7. Números desconocidos = null.
      ],
      leccion: "[PENDIENTE: la lección clave de la semana]"
    }
  ]
};
```

Se usa `.js` (no `.json`) para que funcione abriendo el HTML sin servidor.

## Reglas de contenido

- **Nunca inventar** reflexiones, datos personales, resultados de pruebas ni experiencias. Todo lo que falte va como `[PENDIENTE: qué falta]` y se ve marcado en la página (recuadro punteado sutil) para que Heiner lo identifique.
- Primera persona, español colombiano, tildes y concordancia impecables.
- Los textos los escribe Heiner (con ayuda de Claude en otra conversación) y se pegan en `semanas.js`. El diseño debe aguantar textos de longitud variable sin romperse.
- Las imágenes o capturas por semana van en `site/assets/img/`.
