# Brief creativo — FRAGMENTO.EXE

## 1. Quién es Heiner (de aquí salen las decisiones de diseño)

- **Cómo se describe:** animado, motivado, inteligente.
- **Cómo lo describen sus amigos:** chévere, arriesgado, capaz.
- **Lo que lo diferencia:** le gusta socializar, resuelve cualquier situación, es muy dedicado cuando se lo propone y está muy motivado.
- **Lo que le mueve:** gym, correr, leer, cine, aprender, cocinar, fútbol, la carretera.
- **Dónde se siente él mismo:** su setup, su cuarto, su casa, el gym, la carretera a buena velocidad, la cancha.
- **Ciberseguridad:** le atrae porque es "tener trucos bajo la manga" — saber y ver lo que otros no ven. Le da curiosidad y le motiva aprender más.
- **Filosofía:** estoicismo, taoísmo y metacognición: observar sus pensamientos y emociones sin identificarse con ellos para actuar mejor. Idea central: **cada persona es un fragmento de la conciencia del todo, que experimenta y luego vuelve al todo.** Lema práctico: **"si lo quiero hacer, lo hago".**
- **Mood (solo inspiración; nunca personajes, logos, frases ni imágenes de esas obras):**
  - Cine de plot twist: Memento, El truco, La isla siniestra, Seven → revelación, lo oculto, el giro final.
  - Naruto, Attack on Titan → crecimiento, perseverancia, transformación.
  - Rap colombiano, techno house, afro house, groove, reguetón → ritmo, energía, pulso.
- **Colores que le gustan:** verde, azul, naranja y neutros (abierto a cualquier paleta que se vea pro).
- **Tono deseado:** oscuro pero **no** tétrico ni "full terminal"; chévere, profesional, serio e innovador.

## 2. Concepto: FRAGMENTO.EXE

La bitácora es el registro de un sistema que **se observa a sí mismo** (metacognición) mientras evoluciona semana a semana.

**Hilo narrativo:** el símbolo HR. En la portada el círculo está **incompleto** y su fragmento flota lejos. A medida que se avanza por las semanas, el fragmento se acerca. En el cierre **encaja** y el círculo queda completo. Es su filosofía (el fragmento vuelve al todo) y a la vez su avance en la materia.

**Toque plot twist:** cada semana cierra con un **GIRO**: la lección clave presentada como revelación.

**Capas del concepto que se pueden explotar visualmente:**
- *Observador*: el ojo del símbolo, la idea de mirar hacia adentro, capas que se revelan.
- *Trucos bajo la manga / ciberseguridad*: lo oculto que aparece (texto "cifrado" que se descifra, capas que se destapan, la cerradura que se abre).
- *Fragmentos que vuelven al todo*: partículas, piezas, ensamblaje progresivo.
- *Ritmo*: pulso, movimiento, energía (su música, el deporte, la carretera).
- *Crecimiento*: el progreso visible a lo largo del scroll.

## 3. El símbolo HR (decidido — no rediseñar sin permiso de Heiner)

Archivo: `assets/simbolo-hr.svg` (viewBox `0 0 400 400`). Insértalo **inline** para animar sus partes. IDs:

| ID | Qué es | Significado |
|---|---|---|
| `#anillo` | Círculo r=140 abierto (falta el arco superior derecho), marfil, trazo 10 | El todo |
| `#ojo-sup`, `#ojo-inf` | Párpados del ojo | El observador (metacognición) |
| `#iris` | Círculo azul | Mirar |
| `#pupila` | Cerradura naranja | Ciberseguridad: ver lo que otros no ven |
| `#hr` | Iniciales "HR" | Heiner Rincón |
| `#fragmento` | Arco faltante naranja. Estático en `translate(30,-30)`; en `translate(0,0)` encaja exacto | Él, el fragmento |
| `#bits` | Piezas pequeñas variadas (hexágono, píxel, triángulo) dentro de `#fragmento` | Lo que se desprende y se integra |

El símbolo puede reinterpretarse en otros medios (partículas, WebGL, 3D, trazo animado) **siempre que conserve su forma y significado**.

## 4. Dirección visual de partida (punto de partida, no camisa de fuerza)

Esto es lo que se definió en la exploración inicial. En la fase de dirección creativa, con las referencias de Heiner, **se puede y se debe elevar**: tipografías más expresivas, layouts más audaces, efectos más ricos.

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#141B23` | fondo azul carbón (oscuro, no negro) |
| `--bg-elev` | `#1B2430` | superficies elevadas |
| `--line` | `rgba(233,228,216,.12)` | líneas finas |
| `--text` | `#E9E4D8` | marfil |
| `--muted` | `#8B97A3` | texto secundario |
| `--accent` | `#F28C38` | naranja: el fragmento, momentos clave |
| `--blue` | `#4F8EF7` | iris, datos |
| `--green` | `#3DBE8B` | completado, detalles |

- Tipografía de partida: Space Grotesk (títulos) + IBM Plex Mono (etiquetas técnicas). Se puede cambiar por algo más distintivo si las referencias lo piden.
- Lo "tech" en los detalles: etiquetas mono tipo `SEMANA_04`, líneas finas, microinteracciones.

## 5. Ambición: momentos "wow" a explorar

Ideas candidatas (se eligen 3–4 en la fase de dirección creativa, según las referencias):

- **Portada:** el símbolo se ensambla desde partículas/fragmentos dispersos (canvas o WebGL) que reaccionan al cursor; el fragmento queda flotando fuera.
- **Hilo de scroll:** el fragmento viaja y se acerca al anillo con el progreso de la página (ScrollTrigger con scrub); encaje final con pulso de luz.
- **Texto que se descifra:** títulos y la frase GIRO aparecen con efecto "decrypt" (caracteres aleatorios que se resuelven), en guiño a ciberseguridad.
- **Índice como anillo:** el mapa de semanas es el mismo círculo dividido en N arcos; al pasar el mouse se ilumina la semana.
- **Transiciones entre semanas:** secciones que se pinan, capas que se revelan, scroll horizontal en algún tramo.
- **Cursor personalizado** que cambia según el contexto (lupa/ojo sobre el símbolo, cerradura sobre los GIROS).
- **Scroll suave** (Lenis) sincronizado con GSAP.
- **Cierre:** el círculo completo, el ojo se abre del todo, mensaje final.

Criterio: cada efecto debe **contar algo del concepto**, no ser decoración. Mejor 3 momentos inolvidables que 15 efectos genéricos.
