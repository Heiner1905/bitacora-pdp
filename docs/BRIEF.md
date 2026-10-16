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
- **Colores que le gustan:** verde, azul, naranja y neutros (abierto a cualquier paleta que se vea pro). La paleta elegida al final es «Hielo y rubí» (§4).
- **Tono deseado:** oscuro pero **no** tétrico ni "full terminal"; chévere, profesional, serio e innovador.

## 2. Concepto: FRAGMENTO.EXE

La bitácora es el registro de un sistema que **se observa a sí mismo** (metacognición) mientras evoluciona semana a semana.

**Hilo narrativo:** el símbolo HR. En la portada el círculo está **incompleto** y su fragmento flota lejos. A medida que se avanza por las semanas, el fragmento se acerca. En el cierre **encaja** y el círculo queda completo. Es su filosofía (el fragmento vuelve al todo) y a la vez su avance en la materia.

**Toque plot twist:** cada semana cierra con su **lección clave**, revelada de una forma propia (ver `docs/DIRECCION.md` §8). El antiguo "GIRO" (corte a negro con frase descifrada) se eliminó.

**Capas del concepto que se pueden explotar visualmente:**
- *Observador*: el ojo del símbolo, la idea de mirar hacia adentro, capas que se revelan.
- *Trucos bajo la manga / ciberseguridad*: lo oculto que aparece (texto "cifrado" que se descifra, capas que se destapan, la cerradura que se abre).
- *Fragmentos que vuelven al todo*: partículas, piezas, ensamblaje progresivo.
- *Ritmo*: pulso, movimiento, energía (su música, el deporte, la carretera).
- *Crecimiento*: el progreso visible a lo largo del scroll.

## 3. El emblema (definitivo — no rediseñar sin permiso de Heiner)

Referencia exacta de forma y comportamiento: `docs/diseno/simbolo-vivo/` (maqueta interactiva; no se publica). Archivos del sitio: `site/assets/emblema.svg` (completo, va **inline** para animar), `site/assets/marca.svg` (tamaños medianos) y `site/assets/favicon.svg`. El símbolo anterior (anillo + ojo + cerradura + texto HR en `simbolo-hr.svg`) quedó obsoleto.

Contrato de ids (viewBox 400×400, centro 200,200):

| ID | Qué es | Significado |
|---|---|---|
| `#simbolo-dial` | Dial de caja fuerte que rodea todo | La combinación: el avance semana a semana |
| `#simbolo-orbita` | Órbita punteada | El recorrido |
| `#simbolo-todo` (+ `#simbolo-hr`) | Anillo abierto con las iniciales HR | El todo / Heiner Rincón |
| `#simbolo-ojo` (`#simbolo-horizonte`, `#simbolo-pliegue`, `#simbolo-parpados`; iris recortado por `#simbolo-clip-ojo`) | El ojo que parpadea | El observador (metacognición) |
| `#simbolo-iris` (incluye `#simbolo-pupila` = cerradura) | Iris que sigue al visitante; pupila-cerradura | Mirar; ciberseguridad: ver lo que otros no ven |
| `#simbolo-fragmento` (+ `#simbolo-bits`) | Arco faltante en rubí. Separado `translate(23,-7)`; encajado `translate(0,0)` | Él, el fragmento que vuelve al todo |

Comportamiento: el iris sigue el cursor (x ±28, y ±11) y mira solo si no hay cursor; el ojo parpadea (scaleY 0,06 · 150 ms · ~4 s); el dial gira con el scroll y el progreso acerca el fragmento; tocar la pupila gira la cerradura 90° y dilata la pupila; con reduced-motion todo queda estático. Detalle en `docs/DIRECCION.md` §4.

El emblema puede reinterpretarse en otros medios (partículas, trazo animado) **siempre que conserve su forma y significado**.

## 4. Paleta «Hielo y rubí» (definitiva)

Referencia: `docs/diseno/paleta/`. Tokens en `site/css/tokens.css`. Ya no existen verde, azul, naranja, latón ni marfil.

| Token | Valor | Uso |
|---|---|---|
| `--noche` | `#0A0B0E` | Fondo |
| `--grafito` | `#12141A` | Superficies |
| `--pizarra` | `#1B1E25` | Elevado / hover |
| `--escarcha` | `#F4F6F8` | Títulos y números grandes |
| `--hielo` | `#DCE1E6` | Texto principal, anillo, párpados |
| `--niebla` | `#8F96A0` | Texto secundario, fibras del iris |
| `--acero` | `#5D6672` | Líneas, dial, pendientes (nunca texto) |
| `--rubi` | `#E23E57` | Cerradura, fragmento, CTA |
| `--rubi-hondo` | `#9E2338` | Pressed, halos |
| `--rubi-claro` | `#FF7A8E` | Foco, destello final |

Reglas: el rubí es ~2 % de la pantalla y solo para lo esencial; el texto sobre fondo rubí va en `--noche`, nunca en blanco; estados de semana: completada = hielo lleno, en curso = rubí, pendiente = acero punteado; contraste ≥ 4,5:1 en todo texto.

Tipografía: Zodiak (display) + Newsreader (lectura) + Martian Mono (datos). Ver `docs/DIRECCION.md` §3.

## 5. Ambición: momentos "wow" a explorar

Ideas candidatas (se eligen 3–4 en la fase de dirección creativa, según las referencias):

- **Portada:** el símbolo se ensambla desde partículas/fragmentos dispersos (canvas o WebGL) que reaccionan al cursor; el fragmento queda flotando fuera.
- **Hilo de scroll:** el fragmento viaja y se acerca al anillo con el progreso de la página (ScrollTrigger con scrub); encaje final con pulso de luz.
- **Índice como anillo:** el mapa de semanas es el mismo círculo dividido en N arcos; al pasar el mouse se ilumina la semana.
- **Transiciones entre semanas:** secciones que se pinan, capas que se revelan, scroll horizontal en algún tramo.
- **Cursor personalizado** que cambia según el contexto (ojo sobre el emblema y los momentos clave).
- **Scroll suave** (Lenis) sincronizado con GSAP.
- **Cierre:** el círculo completo, el ojo se abre del todo, mensaje final.

Criterio: cada efecto debe **contar algo del concepto**, no ser decoración. Mejor 3 momentos inolvidables que 15 efectos genéricos.
