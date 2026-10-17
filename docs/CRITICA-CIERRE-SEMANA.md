# Crítica · Cierre de semana (elección entre 3 alternativas)

Crítico independiente, con criterio de jurado Awwwards. No participé en la construcción.
Material revisado: `CLAUDE.md`, `docs/BRIEF.md`, `docs/DIRECCION.md` (§0, §8), `site/lab/cierre-semana/` (README, `cs-base.css`, `lab.js`, y el `index.html`, `alt.css` y `alt.js` de cada alternativa).

**Cómo lo probé:** Playwright (Chromium) a 1440×900 y 390×844 (táctil), siete posiciones de scroll por alternativa, cursor sobre el texto (alt-1), foco de teclado y Enter sobre el botón (alt-1), `reducedMotion: 'reduce'`, el caso `[PENDIENTE]`, scroll horizontal y una medición de cuadros durante el scroll. Las capturas están en `/tmp/claude-0/-home-user-bitacora-pdp/07949875-9793-50ed-8e92-c1a87c5b208e/scratchpad/cierre-eleccion/`.

**Hallazgos comunes:** ninguna tiene errores de consola ni scroll horizontal. Las tres van a ~60 fps en el lab (p95 de 16,7 ms por cuadro; es una medición sin carga, así que solo sirve como indicio). El caso `[PENDIENTE]` se ve bien en las tres: recuadro punteado, cursiva en `--niebla` y sin efecto. Con reduced-motion las tres muestran el estado final y el texto real está en el DOM.

---

## Notas (1–10)

| Criterio | 1 · La linterna | 2 · La combinación | 3 · El fragmento |
|---|:-:|:-:|:-:|
| Memorable / compartible | **9** | 7 | 7 |
| Conexión con el concepto (observador, trucos, fragmento) | **9** | 8 | 7 |
| Legibilidad de la lección | 6 | **7** | 5 |
| No parece plantilla ni «hecho con IA» | **8** | 6 | 5 |
| Repetida ~10 veces sin cansar y sin competir con el cierre final | **6** | 5 | 3 |
| Móvil y reduced-motion | **7** | **7** | 5 |
| Rendimiento y accesibilidad | **7** | 6 | **7** |
| **Total (sobre 70)** | **52** | **46** | **39** |

---

## Justificación

### 1 · La linterna: 52/70 (ganadora)
- **Lo mejor.** Es la única que convierte al visitante en el observador: no mira una animación, hace algo. El documento con las palabras tachadas, que se lee solo donde alumbra la luz, cuenta a la vez los «trucos bajo la manga» y la metacognición sin un solo cliché de hacker: no hay glifos verdes ni texto en mono cifrado, solo barras en `--pizarra` y Newsreader. En la captura del cursor (`alt-1-d-cursor2.png`) la frase asoma a medias dentro del halo, y eso se recuerda y se comparte. Además no usa el scroll, así que se diferencia del resto del sitio, que ya está guiado por scrub, y no le roba nada al encaje final.
- **El problema grave: en escritorio la lección queda bloqueada.** Si el profesor baja sin pasar el cursor, la lección se queda tachada para siempre. Con 10 semanas, lo más probable es que no la lea en varias. Es el riesgo número uno y hay que corregirlo (mejora 1).
- **Errores menores que vi:**
  - En móvil la capa tachada parte las líneas distinto que el texto real, por el `padding: 0 .06em` de cada barra. Sale una quinta línea de barras para un texto de cuatro (`alt-1-m-s-0_2.png`), y al revelarse el bloque se encoge (salto de layout).
  - Al revelarse, el botón se oculta con `disabled` + `display:none` y el foco de teclado cae a `body`.
  - La linterna no sigue al texto cuando se hace scroll con el cursor quieto: solo escucha `pointermove`.
  - El halo se queda quieto donde el cursor salió.
  - La cerradura girada 90° a 18 px se lee como una mancha (también pasa en la 2).
- **Repetición.** Encender 10 linternas a mano cansa. Con revelado automático por scroll y una pequeña progresión entre semanas, se vuelve un ritmo en lugar de una tarea.

### 2 · La combinación: 46/70
- **Lo bueno.** Es la más fiel al emblema: el dial con retenes que alternan dirección es un buen detalle de oficio, y en reduced-motion y en móvil queda limpia (`alt-2-d-rm-s0.png`).
- **Lo que la baja:**
  - **Los tambores muestran glifos mono tipo `5&*89>/ <AB0 #%67+<A`** (`alt-2-d-s0_3.png`). Es justo la estética de «texto hacker» que el brief quiere evitar, y en mezcla con la serif se ve sucia.
  - **Errores visibles:** el `inline-grid` con `vertical-align: top` hace saltar la línea base entre palabras descifradas y cifradas («en una» queda más alta). Además, el rótulo «Combinación completa» aparece antes de que el último grupo esté en claro (`alt-2-d-s1_3.png`).
  - **Diez pins de hasta 150 % de viewport** alargan la página unos 15 viewports solo en cierres. Es pesado.
  - **Duplica el dial** que ya cuentan el emblema y la tira de la combinación del encabezado.

### 3 · El fragmento: 39/70
- **Lo bueno.** Las palabras que convergen en la frase son un buen gesto conceptual.
- **Lo que la descarta:**
  - **Compite directamente con el cierre final:** encaje del arco rubí, anillo que pasa a hielo y pulso de rubí claro. Es el mismo clímax repetido 10 veces antes del clímax real.
  - **Legibilidad rota en escritorio:** el anillo grande se monta sobre la última línea de la lección («dos», «revela.») (`alt-3-d-s0_9.png`).
  - **Contradice su propio mensaje:** dice «Encajada» con el anillo todavía abierto abajo (`TODO_CERRADO` está definido pero no se usa).
  - **En móvil el efecto casi no se ve:** la convergencia termina antes de que el bloque llegue al centro y el anillo queda suelto encima de la ficha (`alt-3-m-s-0_2.png`).
  - **La dispersión de palabras es un recurso muy visto** de tipografía cinética.

---

## Decisión

**Gana la 1 · La linterna.** Es la idea más propia, la que mejor encarna «el observador que ve lo que otros no ven», y la única que no gasta el recurso del cierre final ni duplica el dial. Sus debilidades son de implementación, no de concepto, y se corrigen con las mejoras de abajo. La 2 queda como respaldo solo si se le quitan los glifos y el pin.

## Mejoras para implementarla en el sitio (máximo 5)

1. **Que la linterna sea un regalo, no una puerta.** En escritorio, si el visitante no alumbra, la luz se enciende sola cuando el bloque pasa de ~40 % de la pantalla hacia arriba: el mismo `ScrollTrigger` que hoy se usa en táctil, con `revelar()` al salir. También se enciende al recibir foco. Ninguna lección puede quedarse tachada al seguir bajando.
2. **Una progresión que haga que la repetición cuente algo.** El radio de la linterna y la velocidad del revelado crecen con el número de semana (semana 01 ≈ 90 px, semana 10 ≈ 180 px), porque el observador aprende a ver. Además, la luz final se abre siempre en `--hielo`, nunca en rubí. El destello y el pulso de rubí claro quedan reservados para `#cierre`.
3. **Corregir la capa tachada.** Que las barras repliquen el ajuste de líneas exacto del texto real: sin `padding` horizontal (o con el mismo en la capa real) y con `text-wrap` idéntico. Al revelar, conservar la altura para que no haya salto de layout. Volver a verificar a 360, 390 y 1440 px.
4. **Linterna estable y coordinada con el cursor del sitio.**
   - Recalcular la posición también en `scroll` (con la última posición conocida del puntero) y llevar el halo con `gsap.quickTo` al salir.
   - Ocultar el cursor de ojo del constructor 4 solo dentro de `.cs-linterna` no revelada.
   - Animar `--lx/--ly/--lr` solo mientras el bloque está visible: pausar fuera de pantalla con `ScrollTrigger` `onToggle`.
5. **Accesibilidad completa del botón y del estado.**
   - Tras revelar, no destruir el botón: cambiar su texto a «Luz encendida», usar `aria-disabled="true"` y dejar el foco donde estaba.
   - Marcar `.cs__estado` como `aria-live="polite"`.
   - Agrandar la cerradura (≥ 24 px) o mantenerla vertical y señalar el «abierto» con un cambio de trazo, para que el giro no se lea como una mancha.
   - Comprobar que la impresión muestra el texto completo sin máscara (ya está previsto en `@media print`).
