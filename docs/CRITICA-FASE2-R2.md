# Crítica independiente · Fase 2 · Ronda 2 · FRAGMENTO.EXE

Revisión en modo jurado. Fue solo de lectura: no toqué `site/`. Fecha: 2026-10-17. Califiqué primero por mi cuenta y solo después leí `docs/CRITICA-FASE2.md`.

**Método.**
- Corrí `revisar.mjs` en modo normal y en `reduced`. Resultado: cero errores de consola y sin scroll horizontal a 1440 y a 390. Hice el mismo chequeo a 360 con mi propio script.
- Escribí un recorrido propio con Playwright, con `?demo-viz` y una lección de muestra inyectada (intercepté `semanas.js` sin editarlo, para poder juzgar la linterna). Son 88 capturas a 1440 y 88 a 390:
  - una captura cada 4 %;
  - la carga a 0,5, 1,5 y 3 s;
  - la entrada por la pupila en 14 cuadros;
  - las transiciones 01→02 y 02→03 en 9 cuadros cada una, más la 05 (plano 3D) y la 08 (mirilla);
  - la llegada de las semanas 1 a 3, la linterna con el cursor y el cierre en 13 cuadros.
- Registré el estado en cada captura: `FX.estado.semana`, la casilla activa de la tira, el contador, la semana visible y el `transform` del fragmento de la marca.
- Repetí las transiciones 2, 5 y 7 con scroll lento (25 px por cuadro).
- Probé el cursor sobre el emblema y la pupila (incluido el clic), el teclado, el índice (Enter, flechas, foco atrapado, Esc) y 360 px.
- Medí fps con rAF durante el scroll a 1440 (CPU 1x y 4x) y a 390 con CPU 4x.
- Generé un PDF carta con la página emulada en `print`.
- Comparé con `SimboloVivo.dc.html` (servido en local).
- Usé `impeccable` (critique y audit) y el detector.

Capturas en `docs/critica/`:

| Archivo | Qué muestra |
|---|---|
| `f2r2-01-portada-3s-1440.png` | Portada en reposo. El fragmento ya cabe entero; la pista mono queda cruzada por las marcas del dial. |
| `f2r2-02-entrada-cerradura-1440.png` | La cerradura se abre y por el hueco se ve el «01». Es el mejor cuadro del sitio. |
| `f2r2-03-doble-02-obturador-1440.png` | Dos «02» a la vez: el de la transición y otro más grande que asoma entre las láminas. |
| `f2r2-04-particulas-07-varadas-1440.png` | Un «07» de partículas queda varado en el canvas mientras el «07» real ya subió. |
| `f2r2-05-franjas-sobre-texto-390.png` | Móvil: las láminas del obturador quedan sobre el texto de la semana 03 ya llegada. |
| `f2r2-06-cierre-final-1440.png` | Estado final: emblema encajado, nombre, «Volver al inicio» y pie. |

---

## Notas

| Criterio | Nota | Justificación |
|---|---|---|
| **a) No parece plantilla ni hecho con IA** | **7,0** | La portada asimétrica (Zodiak 200 enorme, emblema que sangra por el dial, ficha de afiche, `f2r2-01`) y la entrada por la cerradura (`f2r2-02`) tienen autor. El índice como dial de arcos también. El cuerpo de cada semana sigue siendo la receta editorial oscura genérica: número gigante, h2 y, debajo, columna izquierda con h3 y fichas mono, columna derecha con el contenido. Deja vacíos enormes: en `d1440/039`, `045` y `056` hay pantallas con el 70–80 % negro y un bloque de 3 líneas. Las barras de «documento clasificado» de la linterna son un tropo conocido de «hacker». Los anillos concéntricos de la mirilla (`repeating-radial-gradient`) se leen como fondo de túnel de stock. |
| **b) Momento compartible** | **8,0** | **La entrada por la pupila-cerradura.** En 14 cuadros, la cámara entra al ojo y por el hueco ya se ve el «01» con su ficha. La cerradura rubí se vuelve contorno y crece hasta ser el marco de la escena. Después el «01» queda donde está la cabecera real, sin salto (`f2r2-02`, `d1440/014–021`). La tira pasa a 01 justo en ese cuadro. El segundo momento es el **cierre**: el dial gira, el fragmento encaja, sale el pulso de rubí claro y el ojo se abre (`d1440/079–088`). |
| **c) Concepto** | **7,5** | El hilo está bien amarrado y es continuo. En 75 muestras, el fragmento de la marca pasa sin saltos de `translate(23,-7)` a `(0.35,-0.11)`. La tira y el contador marcan la semana correcta en todas las capturas; en las transiciones cambian a mitad de la transición, cuando el número tapa la pantalla. El número sale de la marca. **Lo decorativo:** (1) las láminas grafito del obturador; (2) el plano 3D gris que barre en diagonal (`lento-1440-tr5`); (3) los anillos de la mirilla; (4) el pequeño dial punteado abajo a la derecha durante las transiciones; (5) el halo rojizo dentro del ojo en el cierre. **Una falla contra el concepto:** el número debería «formarse una sola vez» y a veces aparece dos veces (ver d). |
| **d) Tipografía, ritmo, espaciado, detalle** | **6,5** | La escala del nombre y de los números como plano sigue siendo excelente, y el trío tipográfico funciona. Fallas de detalle visibles: **(1) números duplicados.** El «02» del obturador convive con otro «02» más grande entre las láminas (`f2r2-03`, también `lento-1440-tr2-medio`). En las semanas 05 y 07 el número de partículas queda desplazado detrás del número real (`d1440/058`, `063` = `f2r2-04`). En móvil, la «04» de partículas queda encima de «Competencias». **(2) Restos de transición sobre el contenido ya llegado.** En móvil, las láminas tapan «[PENDIENTE: reflexión…]» y «Tipos de prueba» (`f2r2-05`). El plano 3D corta la lección de la semana 04 por la derecha («mita», «SEMANA»). **(3)** En móvil, la ficha de la transición se corta por la izquierda («EMANA 02», «ruebas…», «egociables»). **(4)** La pista «Te está mirando…» queda cruzada por las marcas del dial (`f2r2-01`) y, en el telón de móvil, por la «HR». **(5)** Toda la mono va a 12 px con tracking amplio: tira, fichas, estados y pie. En escritorio se lee pequeña y monótona. **(6)** Impresión: solo la semana 01 conserva su número; las semanas 02 a 10 lo pierden (el número queda oculto por `data-tr-oculta` o por el estado de la transición). |
| **e) Rendimiento y accesibilidad** | **7,5** | **Escritorio 1x:** 60 fps en la entrada, en las transiciones y en el cierre (p95 16,7 ms). **Con CPU 4x a 1440:** entrada 59, obturador 49, mirilla **35** (p95 50 ms) y cierre 40, con cuadros de hasta 250 ms. **Móvil 390 con 4x:** 43–54 fps. Headless no acelera la GPU, así que es una cota pesimista, pero la mirilla y el cierre son los puntos caros. **Accesibilidad:** el reduced-motion está bien. Es estático y completo: portada, semanas sin pin, separadores «03 / 04», linterna revelada y cierre encajado con el nombre (`p-rm-*`). El índice es un diálogo con foco atrapado, flechas y Esc que devuelve el foco al botón. El foco es visible (rubí claro, 2 px). No encontré contraste < 4,5:1 en texto visible. Fallas: las casillas de la tira siguen en **9×20 px en móvil**; la consola emite **≈600 warnings de GSAP** «scaleX not eligible for reset» en un recorrido (probable origen: `gsap.getProperty(T.num,'scaleX')` por cuadro en `transiciones.js:132`). |
| **f) Fidelidad al emblema y la paleta** | **8,5** | El vector es idéntico al prototipo: dial de dos coronas, órbita, anillo abierto con HR, horizonte, pliegue, fibras, cerradura y fragmento a `(23,−7)`. El iris sigue al cursor dentro de los límites del contrato (medí ±25,9 / ±8,6) y vuelve al centro cuando no hay cursor. El clic en la pupila gira la cerradura 90° con escala 1,15, la pupila pasa a r=27 y el botón queda con `aria-pressed=true`. Ahora el fragmento cabe entero a 1440. El rubí ocupa 0,11 % en promedio a 1440 (máximo 0,4 %) y 0,19 % en móvil, con un pico de 4,8 % en el pulso del cierre, que es un instante permitido. Va solo en la cerradura, el fragmento, la casilla actual y el CTA. El texto sobre rubí va en noche. Detalles: el pulso se ve como un disco rosado relleno más que como una onda que recorre el anillo; la marca del encabezado termina en `p=0,985` y nunca encaja del todo; el ojo «abierto del todo» apenas se distingue del normal. |
| **Nota global** | **7,4** | La apertura está a nivel de premio, el hilo es continuo y la tira ya va sincronizada. Lo que baja la nota son defectos de ejecución en las transiciones: números dobles, partículas varadas y láminas que se quedan sobre el texto. También pesa el cuerpo de las semanas, todavía genérico y con vacíos. Con las correcciones 1 a 5, el sitio pasa de 8. |

---

## Hallazgos de impeccable

### Critique

⚠️ DEGRADED: single-context (no hay herramienta de subagentes en esta sesión). Hice A (revisión de diseño) antes de leer el detector, y B (detector) después.

- **Especificidad:** la portada, la entrada, el índice-dial y el cierre solo pueden ser de este sitio. El interior de las semanas es intercambiable con cualquier caso de estudio oscuro.
- **Recorrido emocional:** el pico es la entrada, y el final ya tiene clímax (encaje, pulso y firma). El valle está en el centro: semanas 03 a 09 con la misma cadencia y largas pantallas vacías (con datos reales puede mejorar, pero la composición no ayuda).
- **Heurísticas** (7 y 10 = n/a, superficie de experiencia):

| # | Heurística | Nota | Comentario |
|---|---|---|---|
| 1 | Estado | 3 | Tira, contador y marca sincronizados. |
| 2 | Mundo real | 3 | |
| 3 | Control | 3 | Anclas, índice, «Encender la luz». |
| 4 | Consistencia | 2 | Tres variantes de transición con defectos distintos; número doble. |
| 5 | Prevención | 3 | |
| 6 | Reconocimiento | 3 | |
| 8 | Estética | 2 | Restos de transición y vacíos. |
| 9 | Recuperación | 3 | |
| | **Total** | **22/32** | **Bueno con fallas.** |

- **Personas:**
  - *Casey (móvil distraído):* ve láminas sobre el texto y fichas cortadas.
  - *Sam (lector de pantalla):* bien servido (texto real en el DOM, lista textual en el índice).
  - *Alex (impaciente):* 10 transiciones de 630 px cada una son mucho recorrido; el índice lo compensa.

### Audit (técnico)

| Dimensión | Nota |
|---|---|
| Accesibilidad | 3 |
| Rendimiento | 3 |
| Tokens | 4 (hex solo en print y en el mapeo del SVG a variables) |
| Responsive | 2 (restos de transición y fichas cortadas en móvil; táctiles de 9×20) |
| Integridad de implementación | 2 (número doble, partículas varadas, número perdido al imprimir) |
| **Total** | **14/20** |

Hallazgos por prioridad:
- **P1:** número doble o varado (`transiciones.js`, `semana.js`, `particulas.js`).
- **P1:** láminas y plano 3D que quedan sobre la sección en móvil (`transiciones.js`/`.css`).
- **P2:** casillas táctiles de 9×20 (`combinacion.css`).
- **P2:** ≈600 warnings de GSAP (`transiciones.js:132`).
- **P2:** el número se pierde al imprimir las semanas 02 a 10 (`semana.css` print / `transiciones.js`).
- **P3:** la mirilla cuesta 35 fps con CPU 4x (`transiciones.css`: máscaras radiales y `repeating-*` animados).

### Detector

`impeccable detect site/` y `site/index.html`: **0 antipatrones**. Hay dos avisos:
- `shape-assembled-illustration`: es el emblema definitivo; falso positivo.
- `repeating-stripes-gradient`: `transiciones.css:21/70/114` e `indice.css:145`. Es real en el sentido de que confirma que las rayas y los anillos de las transiciones son decoración.

---

## Correcciones priorizadas (máx. 10)

1. **Un solo número por semana, siempre.**
   - Defecto: el «02» del obturador convive con otro «02» (`f2r2-03`). En las semanas 05 y 07, y en la 04 en móvil, el número de partículas queda desplazado o varado sobre el real (`f2r2-04`).
   - Corrección: si la transición maneja la semana k, `semana.js` no debe formar nada ni dejar ver su `.semana__numero` hasta la entrega. `particulas.js` debe soltar (`dispersar`) toda formación en cuanto su ScrollTrigger sale de rango o la velocidad de scroll supera un umbral.
   - Archivos: `js/transiciones.js` (3), `js/semana.js` (2), `js/particulas.js` (1). → **polish**.
2. **Limpiar la escena al terminar cada transición.**
   - Defecto: en móvil, las láminas del obturador y el plano 3D quedan encima del contenido ya llegado (`f2r2-05`, la lección de la semana 04 cortada).
   - Corrección: con `onLeave`, las capas deben quedar en `autoAlpha:0` y `pointer-events:none`, con `z-index` por debajo de la sección.
   - Archivos: `js/transiciones.js`, `css/transiciones.css` (3). → **polish**.
3. **Interior de las semanas con composición propia.**
   - Defecto: pantallas con 70–80 % de negro y un bloque de 3 líneas (`d1440/039`, `045`, `056`).
   - Corrección: dos o tres variantes de retícula (bloque a sangre, viz en columna ancha, reflexión centrada en el plano), menos aire entre bloques y un ritmo vertical que cambie por semana. Las visualizaciones deben ocupar más ancho.
   - Archivos: `css/semana.css`, `css/viz.css`, `js/semana.js` (2). → **bolder**.
4. **Transiciones que cuenten el concepto, no decoración.**
   - Defecto: las láminas grafito, el plano gris en diagonal y los anillos de túnel no dicen nada del emblema.
   - Corrección: que cubran con piezas del emblema (sectores del dial que giran con retén, el párpado que se cierra, la cerradura). Quitar el mini-dial punteado de abajo a la derecha si no es la combinación. Bajar el costo de la mirilla (35 fps con 4x).
   - Archivos: `css/transiciones.css`, `js/transiciones.js` (3). → **bolder**.
5. **Fichas de transición en móvil.**
   - Defecto: «EMANA 02», «ruebas…» quedan cortadas por la izquierda.
   - Corrección: margen de 16 px y salto de línea.
   - Archivo: `css/transiciones.css` (3). → **polish**.
6. **Imprimir el número de cada semana.**
   - Defecto: solo la semana 01 lo conserva.
   - Corrección: en `@media print`, `.semana__numero` visible (anular `data-tr-oculta` y los estilos en línea de GSAP) y del mismo tamaño en todas.
   - Archivos: `css/semana.css` (2), `css/print.css` (director). → **polish**.
7. **Pista de la portada legible.**
   - Defecto: «Te está mirando…» queda cruzada por las marcas del dial (`f2r2-01`) y por la «HR» en el telón de móvil.
   - Corrección: moverla fuera del radio del dial o darle un fondo noche de 4 px.
   - Archivo: `css/portada.css` (1). → **polish**.
8. **Cierre más fiel a la referencia.**
   - El pulso debe ser una onda de trazo que recorre el anillo (2 ondas de 1,4 s), no un disco rosado relleno.
   - El «ojo abierto del todo» debe notarse (párpados más separados, iris más grande).
   - Hay que quitar el halo rojizo dentro del ojo y llevar la marca del encabezado a `p=1` exacto al final.
   - Hay que evitar que las marcas del dial crucen el borde del pie.
   - Archivos: `js/cierre.js`, `css/cierre.css` (3), `js/encabezado.js` (4) / `js/core.js` (director). → **polish**.
9. **Tipografía de datos menos monótona.**
   - Defecto: toda la mono va a 12 px con tracking amplio.
   - Corrección: subir la ficha de semana y las etiquetas de bloque a 13–14 px en escritorio; dejar 12 px solo para la tira y el pie; separar jerarquías con peso (300/500) y no solo con tamaño.
   - Archivos: `css/tokens.css`/`base.css` (director), `css/semana.css` (2). → **polish**.
10. **Higiene técnica.**
    - Quitar los ≈600 warnings de GSAP (`transiciones.js:132`: leer la escala sin `getProperty` sobre una propiedad que GSAP no controla).
    - Dar un área táctil ≥ 44 px a las casillas de la tira (`::before` invisible).
    - Archivos: `js/transiciones.js` (3), `css/combinacion.css` (2). → **polish**.

---

## Qué cambió frente a la ronda 1

Lo leí después de calificar. Mi global es 7,4, frente a 7,0 en la ronda 1.

**Corregido:**
- **Tira y contador sincronizados con la transición** (corrección 2 de R1). Hoy cambian en el cuadro en que el número cubre la pantalla, y ya no se ve un «02» con la tira en 01.
- **El fragmento cabe entero** en la portada a 1440 (R1 #3).
- **El emblema sigue siendo vector con el cursor encima.** El iris mira y el clic gira la cerradura (R1 #1). Las partículas ya no tapan el comportamiento estrella.
- **El número sale de la marca y aterriza en la cabecera** (R1 #5 y #6, en parte). Hay tres variantes de transición en lugar de diez persianas iguales.
- **Ya no hay glifos binarios** (ahora son hex, cuadrado, triángulo y píxel) **ni *scramble*.**
- **Encabezado opaco** y contador compacto en móvil (R1 #7).
- **Cierre con clímax:** la firma, «Volver al inicio» y el pie aparecen después del encaje y el pulso (R1 #8, en parte).
- **`site/lab/` ya no se publica.** La impresión pasó de 14 a 12 páginas, sin lecciones huérfanas (R1 #11 y #12).

**Sigue igual o empeoró:**
- Las casillas táctiles siguen en 9×20 px.
- Los warnings de GSAP pasaron de 4 a ≈600.
- El interior de las semanas sigue con la misma receta y los mismos vacíos (R1 #9 no se hizo).
- La ficha de la transición en móvil sigue cortándose.

**Nuevo en esta ronda (introducido por las transiciones nuevas):**
- Números dobles o varados.
- Láminas y plano 3D que quedan sobre el contenido en móvil.
- Pérdida del número de las semanas 02 a 10 al imprimir.
- La mirilla es el punto más caro en fps.

**En suma:** la ronda 1 pedía arreglar el concepto, y eso está resuelto. Lo que queda es oficio de ejecución (polish) en las transiciones y una pasada de composición (bolder) en el interior de las semanas.
