# Investigación 1 · Narrativa cinematográfica con scroll

**Ángulo:** escenas fijas (pinned), tipografía editorial gigante, cortes, revelaciones y transiciones tipo montaje.
**Fecha de la investigación:** 16 de octubre de 2026.
**Método:** listado oficial de Sites of the Month de Awwwards (leído con WebFetch) + fichas individuales de Awwwards de cada sitio + filtro de `design-taste-frontend/library/sites.json` (moods `cinematic`, `dark`, `editorial`, archetype `giant-wordmark` / `fullbleed-media-overlay`). Cada sitio se visitó en vivo con Playwright (captura 1440, recorrido con rueda del mouse en 8 pasos y captura 390) y se revisaron sus bundles JS con `grep`.

**Capturas en esta carpeta:** `1-<slug>.png` (1440, primer viewport), `1-<slug>-scroll.png` (mejor fotograma del recorrido con scroll), `1-<slug>-scroll2.png` cuando hay un segundo momento clave, `1-<slug>-390.png` (móvil) y `1-<slug>.libs.txt` (librerías, fuentes, scripts detectados).

**Aviso sobre las capturas:** varios de estos sitios dependen de WebGL o de vídeo H.264. El Chromium headless de este entorno no reproduce H.264 y renderiza WebGL por software, así que algunas capturas salen negras o se quedan en el loader. Lo indico en cada sitio. Las descripciones de lo que no se ve en la captura vienen del código fuente y de la ficha de Awwwards, no de suposiciones.

**Descartados (capturas borradas):** Tracing Art (Resn/Getty, SOTM jul. 2025: blanco y se queda en el loader en headless, además es claro e institucional), Montfort (Immersive Garden, SOTM jun. 2025: nubes claras y corporativo, poco relacionado con el concepto), Igloo Inc (SOTY 2024: ya lo cubren las investigaciones 2 y 3).

---

## 1. Prødux Design — los fragmentos que se ensamblan

- **URL:** https://www.produx.design
- **Premio:** Awwwards **Site of the Day, 9 ago. 2026** (7,19) + **Developer Award** (7,24). *Verificado en la ficha de Awwwards.* También está en la librería curada (`aww-produx-design`).
- **Capturas:** `1-produx.png`, `1-produx-scroll.png` (fragmentos a medio ensamblar), `1-produx-scroll2.png` (imagen ya completa), `1-produx-390.png`.

**Qué lo hace memorable:** abre con el nombre gigante sobre negro; al hacer scroll, una imagen (una roca cubierta de musgo) **llega en cuadrados dispersos que vuelan desde la profundidad y encajan hasta formar el todo**, y el wordmark queda impreso encima. Es, literalmente, la metáfora de FRAGMENTO.EXE.

**Técnicas concretas:**
- *Layout:* fondo casi negro `#0E0E0E` con márgenes laterales de 80px. El wordmark ocupa el ~89 % del ancho, con altura de mayúscula cercana al 20 % del viewport. En la mitad inferior hay una frase de 2 líneas a ~5vw, alineada a la izquierda, y en el lado opuesto un párrafo mono pequeño. No hay barra de navegación en el primer viewport: los enlaces van entre corchetes (`[WORK] [STUDIO] [LAB] [CONTACT]`).
- *Tipografía:* **At Aero** (sans ancha, de light a medium, con la O cruzada Ø) para el wordmark y los titulares, y **DM Mono** a ~11px para etiquetas y blurbs. Solo tres tamaños; el contraste de escala hace todo el trabajo.
- *Color:* monocromo `#0E0E0E` / `#E4E4E4`. El color llega solo con la imagen (musgo, salvia: `#545E54`, `#303930`).
- *Motion:* escena fija (pinned) con scrub: cada fragmento tiene su propio `z`, su desenfoque y su retraso, así que los más lejanos llegan borrosos y los cercanos nítidos (profundidad de campo falsa). Cuando todo encaja, la imagen se expande hasta sangrar y el wordmark se monta encima. La navegación aparece con un `filter: blur()` → 0 vía ScrollTrigger (`scrub: 1.2`, ease personalizado `premiumGlide`).
- *Interacción:* cursor normal; los guiños (por ejemplo, el aviso de cookies "A long time ago, in a browser far far away…") están en el microcopy.

**Stack detectado:** Next.js (Turbopack), GSAP + ScrollTrigger (27 referencias, `scrub`, `clipPath`, `Flip`), Lenis, Three.js (shaders con `uniform`), `matchMedia` para el responsive. No encontré `prefers-reduced-motion` en el bundle.

**Qué adaptar a FRAGMENTO.EXE:**
- **Hilo del símbolo HR (de la portada al cierre):** los `#bits` del fragmento naranja (hexágono, píxel, triángulo) dispersos en profundidad, con desenfoque por distancia, que **convergen con scrub** semana a semana. En el cierre encajan exactos en el arco que falta del `#anillo`. Se puede hacer con SVG/DOM y `transform` + `filter: blur` por capas (sin WebGL) para cumplir 60 fps.
- **Portada:** el patrón "wordmark gigante + frase grande a la izquierda + párrafo mono a la derecha" encaja tal cual para `FRAGMENTO.EXE` + el propósito de la bitácora + la ficha técnica en mono (`A00402510 · ING. SISTEMAS · 8.º SEM`).
- Navegación entre corchetes en mono: sobria, técnica y nada "terminal verde".

**Qué NO copiar:** la imagen 3D de musgo (no tiene que ver con Heiner); el blur animado en muchos elementos a la vez (caro en móvil: limitarlo a 6–10 piezas); el chiste de Star Wars del aviso de cookies (frase de obra con derechos).

---

## 2. Revelatio Studio — la imagen cifrada que se revela

- **URL:** https://revelatio.studio/
- **Premio:** Awwwards **Site of the Day, 12 ago. 2026** (7,37) + **Developer Award** (7,07). *Verificado en la ficha.* También está en la librería (`aww-revelatio-studio`). Awwwards destaca sus elementos "Pre-loading and Hero", "Big Numbers (Scroll)" y "Cities (Mouse Interaction)".
- **Capturas:** `1-revelatio.png` (hero negro), `1-revelatio-scroll.png` (lista de ciudades iluminada palabra a palabra), `1-revelatio-390.png`. *El canvas del hero salió casi vacío en headless (solo un punto) y los vídeos de proyectos muestran "Player error": es una limitación de la captura, no del sitio.*

**Qué lo hace memorable:** el hero es un **retrato del equipo reconstruido con glifos tipográficos diminutos, deformado como un tubo CRT**, que con el scroll **se resuelve en la foto real a pantalla completa**. El nombre lo dice: *revelatio*, la revelación. Casi el 80 % de la pantalla es negro.

**Técnicas concretas:**
- *Layout:* negro puro, titular modesto (2 líneas a ~2,5vw) pegado a la esquina inferior izquierda, navegación partida en dos píldoras gris oscuro arriba. La jerarquía sale de la posición y del valor de gris, no del tamaño.
- *Tipografía:* **Neue Haas Grotesk Text Pro 55 Roman**, una sola fuente y un solo peso. Titulares de 36px con tracking −0,03em; la lista de ciudades del cierre salta a ~5vw.
- *Color:* `#000` / `#FFF` / grises `#2B2B2B`, `#8A8A8A`. Sin acento: el color está solo dentro de los glifos y en las miniaturas. Script `color-inversion.js`: secciones que **invierten negro↔blanco** al entrar (corte de montaje).
- *Motion:* **ScrambleTextPlugin** de GSAP (texto que se "descifra"), SplitText, ScrollTrigger y Observer. La lista de ~25 ciudades está toda en gris al 15 % y **una sola palabra se enciende en blanco** según el scroll o el mouse (ver captura). Usa `page-transition.js` propio y un `drag-marquee`.
- *Interacción:* las ciudades responden al mouse; números grandes que cuentan con el scroll.

**Stack detectado:** Webflow + jQuery, GSAP 3 con ScrollTrigger, SplitText, **ScrambleText**, Observer; **Lenis** (versión `lenis-offbrand-v2`), WebGL para el mosaico de glifos. El bundle sí consulta `prefers-reduced-motion`.

**Qué adaptar a FRAGMENTO.EXE:**
- **Portada / "observador":** el símbolo HR (o una frase de Heiner) mostrado primero como **mosaico de caracteres mono** (`0 1 # / ▢ △ ⬡` y los mismos bits del fragmento) que se resuelve en el símbolo nítido al bajar. Es el "ver lo que otros no ven" sin caer en Matrix: caracteres variados, en marfil y azul sobre azul carbón, no verde sobre negro.
- **El GIRO de cada semana:** la frase se descifra con **ScrambleText** (es gratis en GSAP 3.13+) y se dispara una sola vez al entrar.
- **Índice de semanas:** la lista grande en gris tenue donde solo **la semana activa se enciende** (en naranja `--accent`) mientras se hace scroll. Es una tabla de contenidos cinematográfica y legible.
- **Cortes de montaje:** inversión de fondo (azul carbón → marfil) en un momento puntual, por ejemplo al entrar a la semana de entrevistas o al cierre.

**Qué NO copiar:** la curvatura CRT (se lee "retro/terminal", justo lo que el brief evita); el texto gris al 15 % como contenido real (no pasa 4.5:1: úsalo solo como decorado `aria-hidden`, con el texto real accesible aparte); el sello rojo "Site of the Day" de Awwwards.

---

## 3. Siena Film Foundation — la bitácora como cartelera de cine

- **URL:** https://siena.film
- **Premio:** Awwwards **Site of the Day, 18 mar. 2025** (7,9) + **Developer Award** (7,51; Animaciones 8,6) + **Site of the Month, marzo de 2025**. *SOTD y Dev verificados en la ficha; SOTM verificado en el listado oficial de Sites of the Month.*
- **Capturas:** `1-siena-film.png`, `-scroll.png` y `-390.png` **salen negras con solo el botón "ENTER"**: el contenido es metraje en vídeo H.264 pintado en WebGL, que el Chromium headless no reproduce. La descripción de abajo sale del HTML, del bundle `app.js` (429 KB) y de la ficha.

**Qué lo hace memorable:** una productora presentada como **una sala de cine**: un carrete infinito de películas en el que cada una es una "escena" con ficha de créditos (`HEADLINE / DIRECTOR / PRODUCERS / YEAR / CATEGORY / MIN.`), reseñas de festivales entre comillas, un boleto **"ADMIT ONE · 004"** y un shader de proyector sobre todo el metraje.

**Técnicas concretas:**
- *Layout:* negro `#000` y marfil `#FAF7EF`. Una película por pantalla en scroll infinito, con la ficha técnica como créditos de cine en tipografía pequeña. Botones con esquinas recortadas tipo **ticket** (ver el botón ENTER de la captura, con el borde punteado entre el texto y la flecha).
- *Tipografía:* **NB International** (grotesk), **Neue Brucke** (display) y **P22 Parrish Roman** (serif para las citas de la crítica). Mezcla de mono/grotesk técnico con una serif clásica para la voz humana.
- *Color:* blanco y negro; todo el color viene del metraje.
- *Motion:* shader GLSL propio sobre el vídeo con `u_BULGE_RADIUS`, `u_BULGE_STRENGTH` (lente abombada), `u_NOISE_AMOUNT` y `u_FILM_POWER` (grano de película) y un desenfoque direccional `u_a_blur_direction` (motion blur). Transiciones de página con **Taxi.js** (`data-taxi-view`). Texto con SplitText y reordenamientos con Flip. Contadores `data-counter`, tutorial inicial `data-tuto` y **sonido al hover** (`data-sound-hover`).
- *Interacción:* cursor contextual (`data-cursor`), parallax en los botones (`data-parallax`) y un aviso "Rotate your device" en móvil horizontal.

**Stack detectado:** Webflow (maquetación) + bundle propio en Vercel: GSAP (ScrollTrigger, SplitText, Flip), **Lenis**, Taxi.js y WebGL crudo (sin Three.js).

**Qué adaptar a FRAGMENTO.EXE:**
- **Cabecera de cada semana como ficha de película:** `SEMANA_04 · TEMA: Pruebas de selección · FECHA · DURACIÓN DE LECTURA: 3 MIN.` en mono, como los créditos de inicio. Encaja con el mood de cine *plot twist* de Heiner sin usar nada de esas películas.
- **El GIRO como "escena final"** con un ligero **grano + viñeta** (un overlay CSS con ruido SVG es suficiente; no hace falta shader).
- **El ticket "ADMIT ONE"** reinterpretado como **"ACCESO CONCEDIDO · 01/N"** al entrar a cada semana: un guiño de ciberseguridad (credencial) con forma de boleto.
- Botones con esquinas recortadas tipo ticket o credencial.

**Qué NO copiar:** la pantalla de entrada "ENTER" obligatoria (el profesor debe ver el propósito en 5 segundos, sin clics); depender de vídeo para el contenido; el sonido al hover (sin consentimiento es molesto y no aporta a una bitácora académica); la accesibilidad (6,6 en la ficha de Awwwards).

---

## 4. Why Zero — contador, escena 3D y tipografía erosionada

- **URL:** https://why.zero.university/
- **Premio:** Awwwards **Site of the Day, 7 sep. 2026** (7,73; Creatividad 8,16) + **Developer Award** (7,26) + **Site of the Month, septiembre de 2026**. *SOTD y Dev verificados en la ficha; SOTM en el listado oficial.*
- **Capturas:** `1-why-zero.png` (pantalla de carga: degradado verde con contador "99"), `1-why-zero-scroll2.png` (el hielo que se resquebraja y entra en cuadro), `1-why-zero-scroll.png` (escena final: palabra "zero" erosionada + mano 3D), `1-why-zero-390.png`. WebGL sí renderizó (por software).

**Qué lo hace memorable:** es una escuela que promete "infraestructura humana para conseguir trabajo" (el mismo tema de PDP I: empleabilidad). La historia se cuenta como **una sola toma continua**: un **contador que baja (99 → 57 → 12 → 03)** mientras una capa de hielo se agrieta y llena la pantalla, y aterriza en la palabra **"zero"** con letras erosionadas y un objeto 3D. Tiene sonido.

**Técnicas concretas:**
- *Layout:* pantalla completa, sin grilla visible; el contador gigante va anclado abajo a la izquierda como un timecode.
- *Tipografía:* **PP Supply Mono / Supply Sans** (mono geométrica) para el contador y las etiquetas, y **Google Sans Flex** para el texto. El wordmark tiene una textura erosionada aplicada en shader.
- *Color:* verdes `#01C654` y degradados verde azulado con blanco; el hielo funciona como textura.
- *Motion:* Three.js (215 referencias) con shaders (1.037 `uniform`), GSAP ScrollTrigger con `pin` y `scrub` (45). El contador está atado al progreso: **la carga y el scroll son el mismo reloj**. Audio con Howler (`Howl`) y AudioContext.
- *Interacción:* "DRAG & ZERO" (arrastrar el objeto 3D) y un cursor-punto.

**Stack detectado:** Vite (`main-*.js`), Three.js, GSAP + ScrollTrigger, Howler.js; modelos de Blender (ficha de Awwwards). El bundle sí menciona `prefers-reduced-motion`.

**Qué adaptar a FRAGMENTO.EXE:**
- **Contador como hilo narrativo:** un **timecode / porcentaje de integración** fijo en una esquina (`INTEGRACIÓN 12 % → 100 %` o `FRAGMENTO A 340 PX DEL TODO`) que avanza con el scroll y llega a 100 % en el cierre, cuando el fragmento encaja. Es barato (solo texto) y cuenta el progreso.
- **Precarga honesta:** si hay carga, que sea un conteo corto (menos de 1,5 s) que ya muestre el símbolo, nunca una pantalla vacía.
- **Transición por "materia que invade el cuadro"** (el hielo): en la bitácora sería la **grieta del anillo** que se cierra, una sola vez, entre la portada y la semana 1.

**Qué NO copiar:** la paleta verde saturada (choca con el azul carbón; Heiner tiene verde solo para "completado"); la mano con el pulgar arriba y el objeto 3D pesado; el audio; la tipografía erosionada para texto largo (ilegible); la puntuación de accesibilidad (6,6).

---

## 5. David Whyte Experience — transiciones de tinta entre escenas

- **URL:** https://davidwhyte.com/experience/
- **Premio:** Awwwards **Site of the Day, 31 dic. 2024** (7,63) + **Developer Award** (7,29) + **Site of the Month, diciembre de 2024** (listado oficial). El propio sitio dice que también fue SOTD en CSS Design Awards y FWA *(eso no lo verifiqué de forma independiente)*.
- **Capturas:** `1-david-whyte.png` (loader circular marfil), `1-david-whyte-scroll.png` (mancha de tinta negra que se come el paisaje del viaducto mientras entra el título serif), `1-david-whyte-390.png` (loader).

**Qué lo hace memorable:** la obra de un poeta contada como un viaje por los lugares que lo formaron. Cada lugar es una **escena en acuarela** y el paso de una a otra es un **montaje con tinta**: la mancha se expande con bordes orgánicos, cubre una escena y revela la siguiente. El loader ya es un **círculo que se completa**.

**Técnicas concretas:**
- *Layout:* fondo marfil grisáceo `#E1E1E1` con negro; títulos serif grandes a la derecha y microtexto a la izquierda; "Restart the experience" abajo como en los créditos.
- *Tipografía:* **Canela Text** (y Canela Text Italic) para la voz poética, **Roobert** para la interfaz.
- *Color:* dos tonos (marfil y negro); el color sale de las acuarelas.
- *Motion:* máscaras de tinta en WebGL (Three.js/OGL, 1.775 `uniform`), GSAP ScrollTrigger con **`pin`** (11) y `scrub`, Flip y SplitText, **Lenis**. Las escenas quedan fijas mientras la tinta avanza con el scroll. Usa `prefers-reduced-motion`.
- *Interacción:* gestos y arrastre; incluye un mapa (mapbox-gl) de los lugares.

**Stack detectado:** WordPress + WooCommerce, jQuery, Three.js + GSAP (ScrollTrigger, SplitText, Flip) + Lenis, mapbox-gl.

**Qué adaptar a FRAGMENTO.EXE:**
- **Transición entre semanas (montaje):** una **máscara orgánica** (SVG `clip-path` o `mask-image` animado con `scrub`) que cubre la semana N y revela la N+1. Versión barata: un trazo SVG con `feTurbulence` o un `mask` con un PNG de tinta escalado con `transform`; no hace falta WebGL.
- **Loader = anillo que se completa:** idéntico al hilo del símbolo HR. Si hay loader, que sea el `#anillo` dibujándose (stroke-dashoffset) hasta quedar abierto en el arco del fragmento.
- **Serif para la reflexión y sans para la interfaz:** la reflexión semanal en una serif de texto (tipo Canela o una libre equivalente, como Newsreader o Fraunces) se lee como diario personal. Encaja con la regla de 60–75 caracteres por línea.

**Qué NO copiar:** la estética de acuarela y paisaje (es la voz del poeta, no la de Heiner); el fondo claro como base (el brief pide oscuro); la carga lenta (en headless no pasó del loader tras 20 s).

---

## Suplentes

### S1. Terminal Industries — secuencia de fotogramas con scrub
- **URL:** https://terminal-industries.com
- **Premio:** Awwwards **SOTD, 3 sep. 2025** (7,68) + **Developer Award** (7,89; Animaciones 8,8) + **Site of the Month, septiembre de 2025** (listado oficial). Por REJOUICE y PROPAGANDE.
- **Capturas:** `1-terminal-industries.png` (carga), `-scroll.png` (camión a contraluz con titular superpuesto), `-390.png`.
- **Memorable:** el hero es un **camión al atardecer que avanza fotograma a fotograma con el scroll** (componente `get-frames`, `drawImage` en canvas) mientras el titular se monta encima. Después vienen paneles con **muescas** (`NotchSection`) y una calculadora de costos.
- **Tipografía:** **Suisse Intl** + **Geist Mono**. Acento lima en los CTA.
- **Stack:** Nuxt (Vue), GSAP (ScrollTrigger, SplitText, `pin`, `scrub`), Lenis, OGL.
- **Adaptar:** la **secuencia de fotogramas con scrub** para un único momento "carretera" (Heiner ama la carretera a buena velocidad), por ejemplo entre la semana de búsqueda de práctica y el cierre. Los **paneles con muesca** pueden ser las tarjetas de cada semana (forma de cerradura o de credencial).
- **No copiar:** todo el tramo corporativo claro (logos de clientes, calculadora), el peso de cientos de fotogramas (si se usa, máximo ~60 frames WebP a 1280px).

### S2. Lando Norris — collage editorial y escenas recortadas
- **URL:** https://landonorris.com/
- **Premio:** Awwwards **SOTD, 17 nov. 2025** (8,18) + **Developer Award** (7,58). En el listado oficial lleva la insignia **Site of the Year 2025** *(una fuente secundaria atribuye el SOTY 2025 a otro sitio, así que lo marco como "probable, verificado solo en el listado")*. Por OFF+BRAND.
- **Capturas:** `1-lando-norris.png` (hero claro con curvas de nivel), `-scroll.png` (pantalla dividida "ON TRACK / OFF TRACK" con casco y retrato), `-scroll2.png` (sección "HELMETS" a sangre), `-390.png`. *El hero WebGL (casco 3D) hizo que la captura se demorara en headless.*
- **Memorable:** las fotos flotan como **collage a distintas profundidades** sobre curvas topográficas; las escenas cambian con **recortes `clip-path`** y una palabra manuscrita ("on") que se superpone a la grotesk.
- **Tipografía:** **Mona Sans Variable** + **Brier** (display del wordmark). Acento lima `#D2FF00` sobre `#111112`.
- **Stack:** Webflow, GSAP (ScrollTrigger, SplitText, Flip), Lenis, Three.js/OGL.
- **Adaptar:** el **díptico "ON / OFF"** para una semana de autoconocimiento ("cómo me veo / cómo me ven"), y las **curvas de nivel** como textura sutil de fondo en azul carbón, que recuerdan la carretera y el terreno.
- **No copiar:** el lima neón, la cantidad de fotos (Heiner no tiene ese archivo) y el tono de marca deportiva.

---

## Ranking para FRAGMENTO.EXE

1. **Prødux Design:** su momento clave (fragmentos dispersos que convergen con scroll hasta formar el todo) **es** el hilo narrativo del símbolo HR; se puede hacer en DOM/SVG a 60 fps.
2. **Revelatio Studio:** la imagen cifrada que se revela, ScrambleText para el GIRO y la lista donde solo se enciende la semana activa: ciberseguridad y metacognición sin caer en el cliché Matrix.
3. **Siena Film Foundation:** da el lenguaje de cine (créditos, ficha técnica, boleto de acceso, grano) para que cada semana se lea como una escena con giro final.
4. **Why Zero:** el contador atado al scroll como hilo de progreso ("integración 0 → 100 %") y una toma continua; además comparte el tema de empleabilidad de PDP I.
5. **David Whyte Experience:** la mejor referencia de **transición de montaje** entre escenas (máscara de tinta) y de un loader que es un círculo que se completa, junto con la pareja serif para la reflexión y sans para la interfaz.

**Patrón común a llevar a la dirección creativa:** escena fija (pin) + una sola idea visual por escena + tipografía enorme con microtexto mono, más un contador o hilo persistente que da continuidad. Ninguno de los cinco usa más de dos familias tipográficas ni más de un acento de color.
