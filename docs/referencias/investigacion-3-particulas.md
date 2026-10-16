# Investigación 3: partículas, símbolos interactivos y texto descifrado

**Ángulo:** símbolos u objetos hechos de partículas o WebGL que reaccionan al cursor, y efectos de texto descifrado (scramble/decrypt) de buena factura.
**Fecha:** 16-oct-2026. Capturas en `docs/referencias/3-<slug>.png`, `-scroll.png`, `-390.png` y el stack detectado en `3-<slug>.libs.txt`.

Cómo se hizo: filtré `library/sites.json` buscando *particle, scramble, decode, glitch, webgl y shader*, busqué en la web los ganadores recientes, confirmé los premios en las fichas de Awwwards (WebFetch sí las abre) y **descargué y leí los bundles JS** de cada sitio para sacar las técnicas reales: shaders, conteos y parámetros.

> Nota sobre las capturas: en el navegador headless el WebGL a veces se queda en el loader. Lo indico en cada caso. Donde la captura no basta, la descripción sale del código.

---

## 1. Igloo Inc. — igloo.inc

- **Premio:** Awwwards **Site of the Year 2024** (verificado en una colección de Awwwards que lo lista como "SOTY 2024"). También **SOTD** el 23-jul-2024 (7,92) con **Developer Award** (7,66; Animaciones 9,6). Verificado en awwwards.com/sites/igloo-inc. Diseño: abeto y Bureaux.
- **Captura:** `3-igloo.png` muestra el héroe, un iglú en wireframe con líneas plexus y partículas-dígito flotando sobre un gris azulado. `3-igloo-scroll.png` y `3-igloo-390.png` se quedaron en el **loader de caracteres** (`===---==+=`), que es en sí mismo un scramble.
- **Qué lo hace memorable:** todo se siente como un sistema que **compila** en vivo. Las partículas no son puntos sino **dígitos que cambian**, el texto se arma y se desarma, y el hielo reacciona al cursor como escarcha.
- **Técnicas concretas (leídas en `App3D-*.js`, 1,4 MB):**
  - Three.js, render a pantalla completa, sin DOM visible (overflow hidden; el texto es **MSDF dentro de WebGL**).
  - **Partículas-glifo de intro:** nube cargada de `intro_particles.drc` (Draco). Cada punto (`gl_PointSize = resolution.y/100`) muestrea un **spritesheet de 32 dígitos** (`numbers.ktx2`). El dígito que muestra avanza con `floor(uProgress*4*12 - length(worldPos))/32`, así que **el descifrado viaja como una onda desde el centro** (con un *shockwave falloff*). Es un scramble hecho con partículas.
  - **Cubo de 150 000 partículas** movido por una **simulación de fluidos** (simRes 128, pasos de *curl* y *vorticity*, "mouse line splat") en la que el cursor inyecta fuerza.
  - "Mouse frost": la posición del mouse se interpola con `lerp(…, 0.03–0.05)` y se acumula la velocidad; eso enciende la emisión de los cristales cercanos.
  - Plexus: puntos cuadrados con `aastep` (antialias por derivadas) y rotación según el progreso.
- **Stack:** Svelte (entrada de 16 KB) + Three.js + Draco + KTX2 + tweakpane. Fuente IBM Plex Mono.
- **Rendimiento/fallback:** pesado (1,4 MB de JS más modelos y texturas), sin alternativa sin WebGL. En headless con SwiftShader ni siquiera logra hacer la captura. Accesibilidad 6,6 según el jurado.
- **Para FRAGMENTO.EXE:**
  - **Partículas-glifo:** que el símbolo HR se ensamble con partículas que son **caracteres diminutos** (`0`, `1`, `#`, `/`) y que se "resuelven" en puntos sólidos a medida que llegan a su sitio. Une el ensamblaje con el descifrado en un solo gesto.
  - Onda radial: el desorden se resuelve desde la pupila (cerradura) hacia afuera. El ojo "mira" y el sistema se ordena.
  - El loader de símbolos ASCII, minimalista y monocromo, sirve como microintro antes de la portada.
- **Qué NO copiar:** el texto dentro de WebGL (rompe accesibilidad, selección e impresión), el peso, la dependencia total de WebGL y el gris frío sin contraste. El texto de la bitácora debe seguir siendo HTML.

## 2. Quai Network — qu.ai (Unseen Studio)

- **Premio:** Awwwards **SOTD 27-mar-2023** (7,7) con Developer Award (8,25; Animaciones 9,0). Verificado en awwwards.com/sites/quai-network. Unseen también lista **FWA SOTD** y **CSSDA SOTD**, sin fecha (no verificado de forma independiente).
- **Captura:** `3-quai.png` y `3-quai-scroll.png` muestran un loader negro y rojo con el logo Q en el centro, anillos concéntricos con nodos que orbitan, un registro de arranque (`/ LAUNCHING_QUAI_NETWORK`, `/ VERIFYING_CONSENSUS`…), un fragmento de código tenue a la derecha y un contador `10%_LOADING` en tipografía display. `3-quai-390.png` es la versión móvil.
- **Qué lo hace memorable:** la "secuencia de inicio" convierte la carga en narrativa, y el logo se **ensambla desde el origen** con un rebote elástico, luego "respira" y se deforma al pasar el cursor.
- **Técnicas concretas (shader del logo en `c6.js`, controlador en `c9.js`):**
  - **Ensamblaje escalonado por vértice:** cada vértice guarda su retardo en `color.r`. `stag = uProgress*2 - color.r` y `pos = mix(vec3(0), position, uProgress*clamp(stag,0,1))`. Todo nace del centro con stagger, sin JS por partícula.
  - **Repulsión al cursor por rayo:** se proyecta el mouse a un rayo de cámara, se calcula la distancia perpendicular de cada vértice al rayo y, dentro de `uRadius = 1.5`, se empuja en la dirección `dir` con `uDistortion = 0.07`. El mouse se suaviza con `mouseLerp: 0.1`.
  - **Respiración:** `pulse = cos(uTime + color.r*2)` escala xy entre 1 y 1,07.
  - Entrada de 5 s y salida de 4 s; easing elástico (`amplitude .57, period .4`); blending aditivo; color de Perlin entre `#ac1b00` y `#fbdc77`.
  - Polvo ambiental: puntos con desplazamiento Perlin 3D, envueltos con `mod(pos - cameraPosition, uBounds)` (campo infinito sin respawn) y brillo `0.08/dist - 0.16` (glow barato sin textura).
- **Stack:** Next.js + Three.js + GSAP + Lenis. Fuentes Monorama, Bai Jamjuree y Yapari.
- **Rendimiento/fallback:** botón "SKIP ANIMATION" visible; en móvil carga la misma escena. Accesibilidad 7,6.
- **Para FRAGMENTO.EXE:**
  - La fórmula `mix(origen, destino, progreso escalonado)` aplicada a las partículas del HR, con el retardo según la **distancia a la pupila**.
  - La repulsión suave y "magnética" de radio pequeño, sin explosión: el símbolo se deforma unos píxeles y vuelve. Es elegante y no compite con la lectura.
  - El **registro de arranque** como guiño ("/ CARGANDO_SEMANA_04", "/ VERIFICANDO_GIRO"), pero breve, en marfil sobre azul carbón y con botón "Saltar".
  - El botón "Saltar animación" sirve como patrón de accesibilidad.
- **Qué NO copiar:** el rojo sobre negro puro (se acerca a lo tétrico y al "full terminal") y los bloques de código decorativos de relleno. Si hay código, que sea real o que no esté.

## 3. 2xA Studio — 2xa.studio

- **Premio:** Awwwards **SOTD 31-jul-2026** con **Developer Award** y Honorable Mention. Verificado en el perfil awwwards.com/2xA-Studio. También está en la librería curada (`sites.json`: "computation is the aesthetic").
- **Captura:** `3-2xa.png` es negro con grano. Una sola línea "Code-Driven Design Studio Between Amsterdam & Athens", con algunas letras en **bloque invertido o azul** a mitad de animación, una cabecera mono condensada con relojes ATH/AMS en vivo. `3-2xa-scroll.png` es la sección blanca "Selected Projects" con titulares grandes y texto mono. `3-2xa-390.png` es la versión móvil.
- **Qué lo hace memorable:** el **scramble más premium del grupo**, porque **no cambia las letras por basura aleatoria**. Cada carácter conserva su glifo y pasa por **estados tipográficos** (relleno, invertido, acento azul, borde) antes de asentarse. Se lee "código ejecutándose" sin Matrix ni ruido.
- **Técnicas concretas (módulo `typer-*.js`, 4,6 KB, leído entero):**
  - Divide el texto en `.word > .char` (spans).
  - Cada carácter tiene un **punto de corte** `cp` según su posición (con un mapRange 0→.75 y un snap de .05). El frente de descifrado barre de izquierda a derecha.
  - Corre en un `setInterval` a **20 fps** (a propósito, entrecortado como una terminal real, pero barato). `frames = fps*(1 + n*0.01)`: unos 20 a 25 frames, **≈1 a 1,3 s** por línea.
  - En cada frame: `e = clamp(snap(t - cp, .1), 0, 1)`. Si `0 < e < 1`, el carácter usa una de **6 clases CSS** (`charFill`, `charInverse`, `charAccent`, `charAccentInverse`, `charAccentFill`, `charBorder`) según `round(map(e,0,1,0,3 ciclos)) % 6`. El orden de las variaciones se baraja en cada disparo.
  - Modos `in`, `out` e `inout` por CustomEvent (`typer:in`…). Se usa en la intro y en las transiciones de página (swup) con una palabra aleatoria.
  - Solo cambia `className`, con guardia `if (cls !== current)`: cero layout thrash, porque el glifo no cambia de ancho.
  - Aparte, `in.js` usa Splitting + ScrollTrigger con `quickTo('--progress')` para revelar líneas según el scroll.
- **Stack:** Vite + GSAP/ScrollTrigger + Lenis + Splitting + swup + Three.js/OGL (hero y pixelado). Fuente propia `2XAMONOVF` (mono variable) + Helvetica.
- **Rendimiento/fallback:** el texto existe en el HTML desde el inicio (`originalContent`) y `destroy()` lo restaura. Es SEO-safe y funciona sin JS.
- **Para FRAGMENTO.EXE: es la receta ideal para el GIRO.**
  - Cada GIRO entra con este barrido de estados en la paleta del brief: invertido marfil sobre carbón, **naranja `--accent`** como "acento", **azul `--blue`** como borde, y termina en texto limpio.
  - Fuera de las variaciones se puede mezclar un 10–20 % de sustitución real de caracteres (`#/<>01`) solo en etiquetas cortas (`SEMANA_04`) para un guiño cripto más explícito.
  - Es legible en todo momento: el glifo correcto está siempre presente.
- **Qué NO copiar:** la mono condensada de cabecera es demasiado pequeña y gris para el contraste de 4,5:1, y el ritmo de 20 fps en textos largos cansa. Aplicarlo solo a titulares y GIROS, nunca a la reflexión.

## 4. TRIONN — trionn.com

- **Premio:** Awwwards **SOTD 27-jul-2026** (7,42), Developer 7,05. Verificado en awwwards.com/sites/trionn-2. Stack declarado: Next.js, GSAP y Three.js. Aparece en la librería curada ("logo como wireframe entre esquirlas que el visitante puede volar").
- **Captura:** `3-trionn.png` muestra fondo casi negro, titular "Designed to mean intention." y, detrás, el **símbolo de la marca en 3D** hecho de piezas de vidrio oscuro con aristas finas. Abajo, la invitación "HOLD TO BLAST · DARE TO TOUCH THE LINES". `3-trionn-scroll.png` es un muro tipográfico de servicios. `3-trionn-390.png` salió casi vacía (la escena no carga en el móvil headless).
- **Qué lo hace memorable:** **el símbolo se rompe en fragmentos y vuelve a unirse**, con sonido, y tú lo provocas. Es literalmente el concepto de FRAGMENTO.
- **Técnicas concretas (leídas en `c22.js`):**
  - Mantener pulsado (mousedown fuera de enlaces y botones, solo si `scrollProgress < .15`): `holding`, `vibrateAmt = 1`. Durante los primeros **0,7 s** las piezas vibran con `translate(sin(φ)*2.5px, cos(1.3φ)*1.5px)` y φ += 1.1 por frame.
  - Pasados 0,7 s, **estallido**: cada pieza n con fase `a = n·2π/N` gira en 3D (`perspective(600px) rotateX/Y/Z` hasta unos 25°) y se desplaza hasta 30 px según `clickBurst`.
  - Al soltar: transición CSS `0.6s cubic-bezier(.25,.46,.45,.94)` de vuelta a `translate(0) rotate(0)` y sonido "join" si el estallido llegó a ≥ 0,98.
  - Raycast con hover sobre cada pieza: flash y "beep". Pulsos de luz recorren tres líneas (`speed 1.3–1.4`, `len .03`).
  - DPR limitado: `min(devicePixelRatio, móvil ? 1 : 1.5)`. Lee `prefers-reduced-motion`. Un `IntersectionObserver` pausa la escena fuera de vista. Lenis.
- **Stack:** Next.js (Turbopack) + Three.js + GSAP + Lenis + WebAudio. Fuentes Familjen y Neue Haas.
- **Rendimiento/fallback:** DPR acotado y pausa fuera de vista. El móvil no muestra la interacción "hold" (`hidden md:block`).
- **Para FRAGMENTO.EXE:**
  - **Interacción secreta del símbolo HR** ("truco bajo la manga"): al mantener pulsado el símbolo, `#bits` y `#fragmento` vibran, se dispersan y, al soltar, **el fragmento vuelve al todo**. Sirve en la portada o en el cierre.
  - Los números (0,7 s de umbral, 0,6 s de regreso con ease-out suave, amplitudes de pocos píxeles) están bien calibrados para copiarlos tal cual.
  - El DPR acotado y la pausa con IntersectionObserver son obligatorios en nuestro caso.
- **Qué NO copiar:** emojis en la UI (el sitio usa uno de explosión y un rayo; nuestra regla los prohíbe), el sonido automático y la escena 3D de vidrio (es su marca). Nosotros lo hacemos en SVG o canvas 2D con las piezas reales del símbolo.

## 5. Blit Studio — blit.studio

- **Premio:** Awwwards **Honorable Mention 26-may-2026** (verificado en awwwards.com/sites/blit-studio; WordPress, WebGL, GSAP; por Dgrees). Tiene un *element* destacado en Awwwards: **"Logo particles animation"**.
- **Captura:** `3-blit.png` es la portada clara, editorial, con el gran logo "blit." y una rejilla de piezas. Uno de los recuadros muestra la **lluvia de partículas** (hilos blancos sobre negro que caen y se desvían formando un relieve). `3-blit-scroll.png` y `3-blit-390.png` muestran el resto y el móvil. El canvas WebGL de fondo no se ve en headless (canvas = 0 en la detección).
- **Qué lo hace memorable:** el logo **no se dibuja**. Aparece porque **cientos de miles de partículas que caen lo esquivan**, y el vacío revela la forma. Es sutil y de nivel galería.
- **Técnicas concretas (leídas en `app.min.js`):**
  - **GPGPU / FBO de 500×500 = 250 000 partículas.** La posición y la velocidad viven en texturas float (`uPosTexture`, `uVelTexture`) y se actualizan en un shader de simulación.
  - Fuerzas: gravedad `-(0.01 + rand*0.002)`, `maxVelocity 5`, mapas de velocidad y amortiguación (`uVelMap`, `uVelMap2`, `uDumpMap`), un **mapa de divergencia** (`uDivMap`, con la forma del logo) y un **mapa de mouse** (`uMouseMap`), es decir, el cursor se pinta en una textura que desvía la lluvia.
  - Render: puntos de 1,5 px, gris 0,5, alpha 0,6 (**0,2 en móvil**), blending aditivo en modo oscuro y normal en claro. Semilla fija (mulberry32, seed 1974) para que siempre se vea igual.
- **Stack:** WordPress + Three.js + GSAP + Lenis + Splitting. Fuente Archivo.
- **Rendimiento/fallback:** reduce la opacidad en móvil y escala la simulación al tamaño original del buffer en lugar de reconstruirla al redimensionar.
- **Para FRAGMENTO.EXE:**
  - Idea de **"revelar por ausencia"**: en el cierre, una lluvia fina de partículas marfil que esquiva el contorno del HR completo. El símbolo aparece por lo que **no** está, un plot twist visual.
  - El **mapa de mouse como textura** también funciona en canvas 2D a menor escala: dibujar un gradiente radial donde está el cursor y leerlo como campo de fuerza.
  - La semilla fija: cada visita ve la misma composición, lo que da consistencia de marca.
- **Qué NO copiar:** 250 000 partículas con FBO float es excesivo para una bitácora y exige WebGL2 o extensiones. La estética clara y editorial no es nuestro tono.

---

## Suplentes

- **HAOQI.DESIGN** (haoqi.design, en `sites.json` con scramble y coordenadas en vivo, cuadrícula de construcción). En headless da "Application error" en cliente, así que **descarté y borré sus capturas**. Vale la pena mirarlo en un navegador real como referencia de *scramble* en etiquetas técnicas y HUD. Premio: no verificado.
- **Particle Love, de Edan Kwan** (edankwan.com/experiments/particle-love). Awwwards Honorable Mention + Developer Award, 21-jun-2016 (verificado en una búsqueda de Awwwards). Es el clásico de partículas GPGPU que siguen al cursor; útil como referencia técnica de *curl noise* y atracción, pero es antiguo y no tiene símbolo.

Descartados y borrados: Lusion (se queda en el loader en headless y no es de partículas o logo), BlueYard (el sitio actual ya no tiene la nebulosa de 30 000 partículas que ganó; hoy es un cubo 3D).

---

## Receta técnica recomendada: ensamblaje del símbolo HR (vanilla JS, sin build)

**Decisión: canvas 2D, no WebGL.** Para ~2–3 mil partículas, canvas 2D va a 60 fps en un portátil normal, no necesita librería, se depura fácil y su fallo es predecible. WebGL (OGL o Three.js por CDN) solo se justifica a partir de unas 10 000 partículas o con fluidos como los de Igloo o Blit, que **no aportan más al concepto** que lo que cuestan.

1. **Fuente de verdad: el SVG inline** (`viewBox 0 0 400 400`), siempre en el DOM, con `role="img"` y `aria-label`. El canvas va **encima** con `aria-hidden="true"`. Al terminar el ensamblaje, el canvas se desvanece y queda el SVG nítido, animable con GSAP, imprimible y accesible.
2. **Muestreo (una sola vez, al cargar):**
   - Por cada parte (`#anillo`, `#ojo-sup`, `#ojo-inf`, `#iris`, `#pupila`, `#hr`, `#fragmento`), clonar el SVG mostrando solo esa parte, serializarlo (`XMLSerializer` → `Blob` → `Image`), dibujarlo en un `OffscreenCanvas`/canvas de 400×400 y leer `getImageData`.
   - Recorrer una rejilla de **paso 4 px** (desktop) o **6 px** (móvil). Si `alpha > 128`, el punto pasa a ser objetivo con el **color y la parte** de origen. Agregar un jitter de ±0,8 px para que no se note la rejilla.
   - Resultado esperado: **≈1 800–2 800 puntos en desktop y ≈900–1 300 en móvil**. Poner un tope duro (p. ej. 3 000) y submuestrear si se supera.
   - Escalar los objetivos al tamaño real en pantalla del SVG (`getBoundingClientRect`) y recalcular al redimensionar (con debounce).
3. **Movimiento (por frame, arrays tipados `Float32Array` para x, y, vx, vy, tx, ty):**
   - Origen: disperso por la pantalla o, mejor para el concepto, **saliendo de la pupila** (como en Quai) con un retardo según la distancia a la pupila (`delay = dist/maxDist * 0.6 s` + aleatorio de 0,15 s).
   - Resorte hacia el objetivo: `vx += (tx-x)*0.08; vx *= 0.82` (ajustar a mano con GSAP-like feel).
   - **Repulsión al cursor** (radio de 70–90 px CSS, fuerza `(1 - d/r)^2 * 6`), con el mouse suavizado (`lerp 0.1`, igual que Quai). Solo con `pointer: fine`; en táctil, nada o un toque que dispersa y vuelve.
   - **Partículas-glifo** (idea de Igloo): durante el vuelo, cada partícula se dibuja como un carácter mono diminuto (`0 1 / # < >`) desde un **atlas pre-renderizado** (un canvas de 16 glifos, `drawImage` por partícula, nunca `fillText` en el bucle). Al llegar (`dist < 1.5 px`) cambia a un punto cuadrado de 2 px. Así, **ensamblar = descifrar**.
   - Las partículas de `#fragmento` y `#bits` apuntan a su objetivo **desplazado `translate(30,-30)`**: el fragmento se ensambla lejos, como dice el brief, y luego ScrollTrigger lo acerca.
   - Color: marfil `#E9E4D8` para anillo, ojo y HR; azul `#4F8EF7` para el iris; naranja `#F28C38` para pupila y fragmento. Pintar por lotes agrupados por color (un `fillStyle` por grupo).
4. **Presupuesto y apagado:**
   - DPR acotado a `min(devicePixelRatio, 2)` en desktop y `1.5` en móvil (TRIONN usa 1,5/1).
   - Duración del ensamblaje: **1,6–2,2 s**. Cuando el 98 % de las partículas está en su sitio, crossfade de 400 ms al SVG y **se detiene el `requestAnimationFrame`**. El canvas solo se reactiva si el cursor entra en el área del símbolo y se vuelve a apagar tras 1,5 s quieto.
   - `IntersectionObserver` (pausa fuera de vista) y `visibilitychange` (pausa con la pestaña oculta).
   - Sin `getImageData` por frame y sin `shadowBlur`. Para el glow, un solo `drawImage` de un sprite radial pre-renderizado si hace falta.
5. **Fallbacks:**
   - **`prefers-reduced-motion: reduce`:** no se crea el canvas; el SVG aparece en su estado final (con el fragmento en `translate(30,-30)`), como mucho con un fade de opacidad de 200 ms.
   - **Sin JS o con error:** el SVG ya está en el HTML y se ve completo.
   - **Pantallas < 360 px o dispositivos débiles** (`navigator.hardwareConcurrency <= 4` y móvil): paso de rejilla de 7 px o solo el trazo del SVG animado con `stroke-dashoffset`.
   - **Impresión:** `@media print { canvas { display: none } }`.
6. **Interacción secreta** (de TRIONN, opcional, en portada o cierre): mantener pulsado el símbolo durante 0,7 s → `#bits` y `#fragmento` vibran (±2 px), estallan en piezas (GSAP, con rotaciones de hasta 25°) y al soltar regresan en 0,6 s con `power2.out`. En el cierre, el regreso **encaja** el fragmento con un pulso de luz.

**Descifrado de texto (GIRO y titulares):** usar el patrón de 2xA (cambio de clases CSS sobre el glifo correcto, frente que barre por posición, 3 ciclos, ≈1 s, 20–30 fps, disparado una vez por ScrollTrigger) en la paleta del brief. Para etiquetas cortas (`SEMANA_04`), **GSAP ScrambleTextPlugin** (gratuito, CDN de GSAP 3.13) con `chars: "01<>/#_"`, `duration: 0.8`, `revealDelay: 0.2`, `speed: 0.6`. Accesibilidad: el contenedor lleva `aria-label` con el texto final y los `span` llevan `aria-hidden="true"`. Con reduced-motion no se aplica nada. Nunca en el cuerpo de la reflexión.

---

## Ranking (aplicable a FRAGMENTO.EXE)

1. **2xA Studio**: el mejor scramble encontrado. Legible, barato y sin Matrix; es exactamente el GIRO.
2. **Quai Network**: fórmula de ensamblaje escalonado desde el centro más repulsión magnética suave y secuencia de arranque. Es la portada.
3. **Igloo Inc.**: partículas-glifo cuyo dígito se resuelve en onda radial. Une ensamblaje y descifrado (SOTY 2024).
4. **TRIONN**: el símbolo que se rompe en fragmentos y vuelve a unirse al mantener pulsado. Es el concepto literal, para una interacción secreta.
5. **Blit Studio**: revelar el símbolo por ausencia, con partículas que lo esquivan. Para el cierre, en versión ligera.
