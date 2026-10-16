# Investigación 2: interfaces tipo "instrumento de precisión"

**Ángulo:** retícula suiza, hairlines, marcas de registro, escalas, coordenadas, lecturas numéricas, HUD elegante, datos como estética.
**Fecha de la investigación:** 16-oct-2026.
**Método:** filtré `library/sites.json` (181 sitios Awwwards SOTD / One Page Love) por *mood* y *idea* (precise, technical, scientific, engineered, grid, coordinates, readout) y crucé con búsquedas web de premios. Visité cada sitio con Playwright (Chromium con WebGL por software) y revisé los bundles con `curl` + `grep`.

**Capturas:** `docs/referencias/2-<slug>.png` (1440, primer viewport), `-scroll.png` y `-scroll2.png` (tras desplazarse con la rueda), `-390.png` (móvil) y `.libs.txt` (stack detectado).
> Varios sitios WebGL tardan más de 30 s en renderizar por software y el proxy devuelve 502 de forma intermitente. Por eso algunas capturas `.png` o `-390.png` muestran solo el *preloader*. En esos casos la captura útil es `-scroll.png` o `-scroll2.png`, y lo indico en cada ficha.

**Sobre los premios:** awwwards.com bloquea el acceso directo desde este entorno. "Verificado" significa que un resultado de búsqueda que cita una página de Awwwards lo confirma, o que el sitio figura en `sites.json` con `source: "Awwwards Site of the Day"`. Las fechas que no pude confirmar están marcadas como **no verificadas**.

---

## 1. HAOQI.DESIGN

- **URL:** https://haoqi.design
- **Premio:** Awwwards Site of the Day (según `sites.json`, `source: Awwwards Site of the Day`). Fecha **no verificada**: una búsqueda lo muestra en listados de Awwwards con botón "Vote now". Título actual del sitio: "HAOQI©2026".
- **Capturas útiles:** `2-haoqi-scroll.png` (hero oscuro con HUD) y `2-haoqi-scroll2.png` (cierre claro). `2-haoqi.png` y `2-haoqi-390.png` solo muestran el loader.

**Qué lo hace memorable.** El portafolio entero es un **lienzo instrumentado**: una retícula de construcción visible con cruces "+" en las intersecciones, las coordenadas del cursor en vivo, la hora y el clima en mono. El HUD nunca compite con el titular, solo lo enmarca.

**Técnicas concretas**
- **Retícula:** 3 columnas × 3 filas de hairlines de 1 px casi invisibles (blanco a ~8 % de opacidad sobre negro). En cada cruce hay una marca "+" de unos 10 px, como las marcas de registro de imprenta. Las columnas no contienen nada: son *andamio a la vista*.
- **Esquinas como instrumento:** abajo a la izquierda `GMT+8 CN 01:56 23°C`, abajo al centro `0720 X 0450 Y` y abajo a la derecha un globo de línea. Arriba, la nav mono es `WORK  CONTACT  THEME[A]  SOUND[-]`: el estado va entre corchetes, como un parámetro.
- **Tipografía:** una sans ancha y pesada (familia `tiktok`) en mayúsculas para el titular centrado ("INNOVATE WITH PURPOSE", ~8 vw) y `tronica-mono` más una mono de sistema para todos los datos (12–16 px). Los datos usan `tabular-nums` (aparece 4 veces en los bundles), así los dígitos no "bailan".
- **Lecturas numéricas:** en el código, las coordenadas se calculan con `Math.round(x * ancho).toString().padStart(4,"0")` y la hora con `getHours().padStart(2,"0")`. Siempre llevan **ceros a la izquierda y ancho fijo**, y esa es la clave del look de instrumento.
- **Color:** negro puro con estelas WebGL cian, azul y violeta en el hero. Hay un único píxel/cursor **lima** (#c6f432) como acento, y el cierre pasa a azul cielo con tipografía negra.
- **Motion e interacción:** un campo de líneas radiales tipo *warp* reacciona al scroll; el cursor mueve las lecturas; en el cierre aparece una palabra inflada en 3D (vidrio iridiscente). El tema y el sonido se pueden alternar.
- **Stack:** Next.js (Turbopack), Three.js / React Three Fiber (`THREE` aparece 106 veces), Lenis. No usa GSAP.

**Qué adaptar a FRAGMENTO.EXE**
- **Marco fijo de toda la bitácora (portada y scroll):** retícula de 12 columnas con hairlines y marcas "+" en los cruces de una fila base. En las esquinas irían lecturas reales y honestas, nada inventado:
  - `SEMANA 03/16`
  - `PROGRESO 018.7%`, calculado del scroll
  - la hora local de Bogotá, `GMT-5 BOG 21:04`
  - la **distancia del fragmento al anillo**, por ejemplo `Δ 142.0 px → 000.0`, que baja a medida que se avanza.
- **Formato de los números:** `padStart` y `font-variant-numeric: tabular-nums` en todos.
- **Nav con estado entre corchetes:** `MOTION[ON]`, `IMPRIMIR[↓]`. El de movimiento sirve además como control de `prefers-reduced-motion`.

**Qué NO copiar**
- La palabra 3D inflada y el *warp* de colores saturados se alejan del tono serio, y el warp podría leerse como "hiperespacio sci-fi".
- La sans ultraancha en mayúsculas para textos largos.
- Depender de WebGL para que el sitio cargue: el sitio se queda en blanco con un loader de más de 15 s.

---

## 2. Igloo Inc.

- **URL:** https://www.igloo.inc
- **Premio:** **Awwwards Site of the Year 2024**, más Developer Award y Honors (Business & Services, julio de 2024). Lo confirma una colección de Awwwards citada en la búsqueda, y Awwwards publicó un "Igloo Inc: Case Study" el 30-oct-2024. El estudio es Abeto. Verificado de forma **indirecta**, porque no pude abrir awwwards.com.
- **Capturas útiles:** `2-igloo.png` (iglú en *wireframe* con etiquetas numéricas en los vértices), `2-igloo-scroll.png` (la malla se convierte en sólido), `2-igloo-scroll2.png` (iglú sólido sobre terreno nevado). `2-igloo-390.png` solo muestra el loader.

**Qué lo hace memorable.** El objeto se **construye frente a ti** a partir de un plano: primero líneas de alambre con números diminutos en cada vértice, luego bloques que se solidifican. Se siente como ver un escaneo técnico que se vuelve materia.

**Técnicas concretas**
- **Loader como lectura:** una sola línea de caracteres que se recombinan en el centro (`+===---==+`, `-=+=----==`, `==+++===--`), en blanco sobre gris azulado. Es una barra de progreso hecha con glifos y no un *spinner*.
- **Datos sobre el objeto:** en la fase de plano, cada nodo de la malla lleva una etiqueta mono de 2 dígitos (`06`, `11`, `14`) en blanco a baja opacidad. La malla se extiende fuera del objeto como una triangulación del espacio.
- **Tipografía:** IBM Plex Mono Regular y Medium (woff2 en el bundle) para toda la interfaz. No hay display serif ni sans: todo es mono pequeña.
- **Color:** monocromo frío (gris azulado #a1a6b3 aprox., blanco y nieve). El único "color" es la luz azulada que sale de las juntas del iglú.
- **Motion:** una cámara guiada por scroll transiciona de *wireframe* → sólido → paisaje. Lleva simulación de fluidos (shaders `FLUID_ADVECTION`, `FLUID_CURL`, `FLUID_PRESSURE`), partículas y postproceso (`EffectComposer`), y tiene audio (`AudioContext`).
- **Stack:** Svelte con un `App3D` cargado aparte (1,5 MB), Three.js (`WebGLRenderer`, `ShaderMaterial`), GSAP con ScrollTrigger, y modelos glTF comprimidos con Draco y texturas KTX2.

**Qué adaptar a FRAGMENTO.EXE**
- **El cierre de la bitácora, cuando el fragmento encaja:** el símbolo HR aparece primero como **plano técnico**, con trazos de 1 px, cotas y nodos numerados en mono (`01`…`12` sobre los vértices del anillo y del fragmento). Al llegar a la última semana, los trazos se "rellenan" y el símbolo queda sólido. En SVG esto se resuelve con `stroke-dasharray`/`stroke-dashoffset` y un cambio de `fill-opacity` animado con GSAP y ScrollTrigger (`scrub`). No hace falta WebGL.
- **Loader de glifos:** una línea `[+===---==+]` que se recombina mientras cargan las fuentes. Debe durar menos de 1 s y no aparecer con `prefers-reduced-motion`.

**Qué NO copiar**
- El peso: 1,5 MB de JS más modelos y texturas, y un loader de más de 30 s en hardware modesto. Eso choca con la regla de 60 fps y con "abrir index.html y funciona".
- Los paisajes 3D fotorrealistas y el audio automático.
- El gris azulado claro como fondo: el brief pide oscuro.

---

## 3. Longbow (Digital Butlers)

- **URL:** https://db-longbow.webflow.io/
- **Premio:** **Awwwards Site of the Day, 12-jul-2026**. Lo confirma un listado de Awwwards citado en la búsqueda ("Longbow, Digital Butlers, Site Of The Day, Jul 12, 2026") y también figura en `sites.json`. Commarts lo reseña en Webpicks. Verificado.
- **Capturas útiles:** `2-longbow.png` (loader con desenfoque de velocidad), `2-longbow-scroll.png` (retícula con nodos y tipografía gigante), `2-longbow-390.png` (móvil completo).

**Qué lo hace memorable.** La **retícula de construcción es protagonista**: cuatro columnas de hairline blanco con **pequeños cuadrados-nodo** en cada intersección, como los tiradores de una mesa de trabajo de diseño. Coches, tarjetas de vidrio y palabras enormes encajan en esas celdas.

**Técnicas concretas**
- **Retícula:** 4 columnas iguales, filas a ~50 % del viewport, todo en 1 px blanco a baja opacidad. En cada cruce hay un cuadrado sólido de unos 6 px (el *handle*). La retícula sigue visible sobre el negro y se mantiene en móvil, que tiene marco lateral y nodos en las esquinas del bloque.
- **Tipografía con 3 roles estrictos:**
  - Bebas Neue condensada gigante (hasta ~21 vw, tracking −0.06em) para palabras sueltas como "THE … OF / LIGHTNESS".
  - EB Garamond Variable ligera con segunda línea en *italic* para titulares ("Be moved — / At The Speed Of Lightness").
  - **Geist Mono** (v4) en mayúsculas a 13 px para todo el cuerpo y las etiquetas.

  El salto de escala es de unas 23 veces.
- **Revelado por celdas:** las letras gigantes aparecen *recortadas por la celda*. En la captura se ve "EED SP" cortado en el borde de la columna 2, como si cada celda fuera una ventana con su propia máscara.
- **Color:** gris medio de estudio (#888c8f), negro (#1b1b1c) y blanco, con verde inglés (#1f5c49) y óxido (#b5552e) como acentos de producto.
- **Motion:** el loader `.LOADING` es una píldora que se va llenando letra a letra sobre un video desenfocado de carretera (el desenfoque de movimiento cuenta la velocidad). Hay revelados por scroll (`data-reveal`) y una marquesina de la marca (`data-marquee-role`).
- **Stack:** Webflow con jQuery, más un script propio (`cdn.digitalbutlers.me/.../index.js`, 19 KB) que usa **GSAP** (eases `power2.out`, `back.out(1.5)`, `stagger`) y **Lenis**. Liviano.

**Qué adaptar a FRAGMENTO.EXE**
- **Portada y separadores entre semanas:** retícula de columnas con **nodos cuadrados en los cruces** y el número de semana gigante en condensada (`03`), revelado *celda por celda* con `clip-path: inset()` animado por GSAP. Cada celda descubre un pedazo, que es exactamente la idea de "fragmentos que se ensamblan".
- **Triple voz tipográfica:**
  - condensada gigante para números y palabras-golpe ("GIRO");
  - serif con itálica para la frase-revelación de cada semana;
  - mono pequeña en mayúsculas para metadatos: fecha, tema, `SEMANA 03 · HOJA DE VIDA`.
- **Desenfoque de velocidad de la carretera** (a Heiner le gusta la carretera) como pista de transición entre la portada y la semana 1, solo en `transform` y `opacity`.

**Qué NO copiar**
- El cuerpo de texto en mono mayúscula: la reflexión semanal tiene que leerse cómoda, así que va en sans o serif en minúscula a 60–75 caracteres por línea.
- El *glassmorphism* de las tarjetas de navegación.
- El gris medio como fondo general.

---

## 4. Aspen Search

- **URL:** https://www.aspensearch.com/
- **Premio:** Awwwards Site of the Day (según `sites.json`, `source: Awwwards Site of the Day`, puntaje interno 8.2). La fecha **no se pudo verificar**: la búsqueda no devolvió su ficha.
- **Capturas útiles:** `2-aspen.png` (hero completo), `2-aspen-scroll.png` (sección "Clients" con lista tabular) y `2-aspen-scroll2.png`. `2-aspen-390.png` está vacía.

**Qué lo hace memorable.** Es una **retícula suiza sin márgenes**: toda la pantalla está dividida por líneas negras de 1 px en celdas que alternan tipografía, un *canvas* con tramado (*dither*) en blanco y negro, un negro sólido y un verde menta. Se siente como una hoja técnica impresa.

**Técnicas concretas**
- **Retícula:** barra superior de 60 px dividida en celdas (logo en cuadro negro, **hora local con ciudad**: `06:59 PM LA` y luego `10:00 PM NYC`, porque la ciudad rota) y debajo un 2 × 2 de pantalla completa. Las secciones repiten la lógica: etiqueta, párrafo y lista en columnas de 1/4, 1/4 y 1/2.
- **Etiquetas de sección:** cuadrado negro de 6 px más mono en mayúsculas (`■ WHO WE WORK WITH`). La lista de clientes es una tabla: nombre grande a la izquierda y categoría en mono gris alineada en una columna fija (`QUANT FINANCE`).
- **Tipografía:** **Suisse Intl** peso 450 para todo (logo a ~12.5 vw, statements a 24 px y cuerpo a 16 px) y **Suisse Intl Mono** para acciones y etiquetas. Usa una sola familia, y la jerarquía sale del tamaño y del peso.
- **Color:** blanco, casi negro (#232323), grises (#d9d9d9) y **un solo acento** menta (#a1ffcb) que inunda celdas enteras en vez de usarse en detalles. Tiene un *toggle* claro/oscuro.
- **Motion:** el *dither* es un *canvas* generativo que se mueve lento, con formas de "cuchilla" gris claro que cruzan los bordes de las celdas. También hay una marquesina de logos y un tema conmutables.
- **Stack:** Next.js, Three.js / React Three Fiber, OGL, Theatre.js (para coreografiar la animación) y Lenis.

**Qué adaptar a FRAGMENTO.EXE**
- **Ficha de cada semana como hoja técnica:**
  - cabecera ruleteada en celdas: `SEMANA 05` | `TEMA: ENTREVISTAS` | `FECHA [PENDIENTE]` | `ESTADO: INTEGRADO`;
  - debajo, la reflexión en una columna de lectura;
  - al lado, una celda con la "lectura" de la semana: palabra clave, dato o prueba presentada, siempre con contenido real o `[PENDIENTE]`.
- **Reloj con ciudad** en la cabecera fija (`BOG 21:04`): detalle mínimo y verdadero.
- **Un solo acento que inunda una celda:** el GIRO de cada semana podría ser la única celda en naranja o en verde, invertida.
- **Dither de canvas** como textura de las celdas vacías. Es una alternativa elegante al "ruido digital" y evita por completo el cliché Matrix.

**Qué NO copiar**
- El fondo blanco por defecto: hay que invertirlo a oscuro y mantener las hairlines con contraste suficiente.
- Theatre.js y R3F: un `<canvas>` 2D con *ordered dithering* basta.
- El tamaño gigante de una sola palabra sin contexto, porque la bitácora necesita jerarquía de lectura.

---

## 5. Alethia

- **URL:** https://www.alethia.earth/
- **Premio:** **Awwwards Site of the Day**, con nota 7.34/10 según la ficha `awwwards.com/sites/alethia` citada en la búsqueda. Fecha **no verificada** (el sitio dice "© 2025").
- **Capturas útiles:** `2-alethia-scroll.png` (hero con rocas 3D) y `2-alethia-scroll2.png` (sección de instrumento meteorológico con tags). `2-alethia.png` y `2-alethia-390.png` solo muestran el loader hexagonal.

**Qué lo hace memorable.** Presenta **la naturaleza como dato medido**: rocas fotorrealistas con musgo flotan en un campo verde casi negro, y encima aparecen retículas de mira, etiquetas mono y lecturas como `-8.3 tCO₂e` o `Verified Removal -1.2 tCO₂`. Es ciencia seria con belleza.

**Técnicas concretas**
- **Lecturas:**
  - un valor principal grande con signo y unidad (`-8.3 tCO₂e`);
  - *tags* pequeños con valor y unidad (`-1.2`, `-2.01`, `0.57 tCO₂`) anclados a objetos con una retícula cuadrada de hairline;
  - un panel de telemetría con `CARBON DIOXIDE FLUX`, `Sensible heat flux` y `Data streaming`.
- **Etiquetas de estado:** píldoras lima con texto mono negro (`NO SPREADSHEETS`, `NO GUESSWORK`), etiquetas de tarjeta entre corchetes (`[Nature-Based Solutions]`) y secciones numeradas `01–05`.
- **Tipografía:** **Geist** (Medium para titulares de ~70 px a −0.05em, Regular para statements de 24–40 px) y **Geist Mono** en negrita mayúscula de 10–14 px para nav, botones, tags y lecturas.
- **Color:** verde bosque casi negro (#0f1f10), negro, blanco y un único acento **lima pálido** (#c6f19d) en flechas, tags y *hotspots*. Más abajo alterna con un gris cálido claro.
- **Motion:** objetos 3D flotando con parallax suave, contadores numéricos y revelados por scroll. El loader es un hexágono que pulsa.
- **Stack:** Framer (con Next) y OGL para el WebGL, más Lenis. Usa dos `<canvas>`.

**Qué adaptar a FRAGMENTO.EXE**
- **El "GIRO" de cada semana como lectura de instrumento:** una retícula de mira de hairline que **se cierra** sobre la frase clave (las esquinas del cuadrado se acercan con GSAP), con un *tag* mono anclado del tipo `GIRO · S03 · [PENDIENTE: lección clave]`. Así se mira hacia adentro con método, que es la metacognición del concepto.
- **Un valor grande con signo y unidad** para el progreso del hilo narrativo: `Δ ANILLO −142°` → `0°` (los grados de arco que le faltan al anillo de HR). Es un dato real del diseño, no un dato inventado sobre Heiner.
- **Paleta:** fondo casi negro con un matiz (verde o azul profundo) en vez de negro puro, más un acento ácido pálido usado con cuentagotas.

**Qué NO copiar**
- Las rocas 3D fotorrealistas: son el producto de ellos y en la bitácora serían decoración sin sentido.
- El lima saturado si se combina con fondo negro y mono, porque roza el "terminal verde" prohibido. Si se usa verde, que sea desaturado y en dosis mínimas, o que el acento sea naranja.
- El estilo de landing corporativo con CTA "Let's Talk".

---

## Suplentes

### S1. Lama Lama
- **URL:** https://lamalama.com/
- **Premio:** Awwwards Site of the Day (según `sites.json`, `source: Awwwards Site of the Day`). Fecha no verificada.
- **Capturas útiles:** `2-lamalama.png`, `2-lamalama-scroll.png`, `2-lamalama-scroll2.png` y `2-lamalama-390.png`.

**Qué lo hace memorable.** Una agencia vestida de **consola de sistema**, pero cálida: fondo casi negro verdoso (#1a1c1c) con una trama de puntos fina, texto crema (#f9f4eb) y ningún acento de color.

**Técnicas**
- Etiquetas mono entre corchetes: `[ WE ARE LAMA LAMA ]`.
- Reloj en vivo con punto rojo de "grabando": `[ ● 04 : 02 : 43 ]`.
- Barra inferior con hairline y datos en columnas (`20+ DIGITAL FREAKS · AMSTERDAM BASED · …`).
- Widgets flotantes apilados arriba a la derecha (`THIS IS US ( - )`).
- Tipografía: Suisse BP Intl (titular en negrita mayúscula, ~5 vw) y **Sometype Mono** (9–10 px).
- Video con *dither* de matriz de puntos.
- Stack: WordPress con GSAP, Lenis y OGL.

**Para FRAGMENTO.EXE:** el reloj entre corchetes con punto rojo y la barra de datos inferior. Es la prueba de que **crema sobre negro verdoso** se ve técnico sin parecer terminal.

**No copiar:** la trama de puntos detrás del texto largo (le resta contraste) y los widgets flotantes, que son ruido en una bitácora.

### S2. 21 Hours on the Moon
- **URL:** https://www.21hrs.space/
- **Premio:** Awwwards SOTD según `sites.json`.
- **Por qué es suplente:** marcas de esquina en bronce, kicker entre reglas finas, Akkurat Mono para anotaciones, y una línea de tiempo de la misión como mapa navegable. La idea de **línea de tiempo como instrumento** aplica al índice de semanas.
- **Por qué no está en el top:** el render WebGL nunca pasó del loader en este entorno, así que no pude verificar el detalle y borré sus capturas.

---

## Patrones transversales (lo que se repite en los 5)

1. **Andamio visible:** hairlines de 1 px a baja opacidad, con marcas en las intersecciones ("+" en HAOQI, cuadrados en Longbow, celdas cerradas en Aspen).
2. **Dos voces tipográficas:** una display (sans o condensada) y **una mono pequeña en mayúsculas** para todo lo que es dato o estado. A veces se suma una serif itálica como tercera voz emocional (Longbow).
3. **Números con ancho fijo:** ceros a la izquierda, `tabular-nums`, signo y unidad. Así parece medición y no decoración.
4. **Datos vivos pero verdaderos:** hora y ciudad, coordenadas del cursor, progreso. Nadie inventa métricas en el HUD.
5. **Un solo acento** (lima, menta, naranja) sobre un monocromo, usado en inundación (Aspen) o en puntos mínimos (HAOQI, Alethia).
6. **El objeto se construye:** plano → sólido (Igloo) o celdas que se revelan (Longbow). Encaja directamente con "el fragmento vuelve al todo".

## Ranking

1. **HAOQI.DESIGN:** es el HUD elegante más directamente trasladable: retícula con "+", coordenadas y reloj con `padStart`/`tabular-nums`. Se puede usar casi tal cual como marco fijo de la bitácora, sin WebGL.
2. **Igloo Inc.:** SOTY 2024. La transición plano → sólido con nodos numerados es la mejor metáfora visual del fragmento que vuelve al todo, para el cierre (versión SVG, no 3D).
3. **Longbow:** nodos cuadrados en los cruces, revelado celda por celda y la triple voz condensada/serif itálica/mono dan portada y separadores de semana con nivel Awwwards y un stack liviano (GSAP + Lenis).
4. **Aspen Search:** la retícula suiza sin márgenes y la ficha técnica en celdas son el mejor modelo para la estructura de cada semana y su legibilidad. Un solo acento que inunda la celda del GIRO.
5. **Alethia:** la retícula de mira que se cierra y las lecturas con signo y unidad le dan al GIRO un momento de "medición". Hay que vigilar que su lima no derive a terminal verde.
