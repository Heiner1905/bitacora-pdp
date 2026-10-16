# Referencias de diseño — selección final (Fase 1)

Heiner no trajo referencias: las buscaron, capturaron y analizaron tres investigadores en paralelo (16-oct-2026), cada uno con un ángulo. Se revisaron 15 sitios premiados más suplentes; el análisis completo de cada uno está en:

- `docs/referencias/investigacion-1-cinematografica.md` — narrativa cinematográfica con scroll
- `docs/referencias/investigacion-2-instrumento.md` — interfaces tipo instrumento de precisión
- `docs/referencias/investigacion-3-particulas.md` — partículas/WebGL y texto descifrado (incluye la receta técnica del ensamblaje del símbolo HR)

Capturas en `docs/referencias/` con el prefijo del ángulo (`1-`, `2-`, `3-`): `<slug>.png` (1440), `<slug>-scroll.png` / `-scroll2.png` (momento clave tras scroll), `<slug>-390.png` (móvil) y `<slug>.libs.txt` (librerías, globales y fuentes detectadas en el código).

> Limitaciones: awwwards.com y godly.website bloquean el acceso desde el entorno de trabajo; los premios se verificaron por las fichas citadas en búsqueda y por el listado oficial de Sites of the Month. Algunas escenas WebGL/vídeo salen negras o en el loader en Chromium headless; en esos casos el análisis viene del código fuente.

> Las referencias son inspiración de técnica y nivel, no para copiar. Nada de copiar textos, imágenes, logos ni diseños propietarios.

## Las 5 elegidas

Criterio: que cada una aporte **una técnica que cuente algo del concepto FRAGMENTO.EXE** (no solo que se vea bien), que sea realizable sin build a 60 fps, y que entre las cinco cubran portada, hilo de scroll, semanas, GIRO y cierre.

| # | Sitio | Premio | Qué aporta a FRAGMENTO.EXE | Capturas |
|---|---|---|---|---|
| 1 | [Prødux Design](https://www.produx.design) | Awwwards SOTD 9-ago-2026 + Developer | **El hilo narrativo.** Fragmentos dispersos en profundidad (z + desenfoque por distancia) que convergen con scroll hasta formar el todo. | `1-produx*.png` |
| 2 | [2xA Studio](https://2xa.studio) | Awwwards SOTD 31-jul-2026 + Developer | **El GIRO.** El mejor texto descifrado: cada letra conserva su glifo y pasa por estados tipográficos (invertido, acento, borde) antes de quedar limpia. Legible siempre, cero Matrix. | `3-2xa*.png` |
| 3 | [Revelatio Studio](https://revelatio.studio) | Awwwards SOTD 12-ago-2026 + Developer | **El observador.** Imagen hecha de glifos que se revela en la real con scroll; lista enorme en gris donde solo se enciende la palabra activa (índice de semanas); cortes por inversión de color. | `1-revelatio*.png` |
| 4 | [Igloo Inc.](https://www.igloo.inc) | Awwwards Site of the Year 2024 (+ SOTD 23-jul-2024, Developer) | **Ensamblar = descifrar.** Partículas que son dígitos cambiantes y se ordenan en onda desde el centro; objeto que pasa de plano técnico (nodos numerados) a sólido. | `2-igloo*.png`, `3-igloo*.png` |
| 5 | [Longbow](https://db-longbow.webflow.io/) | Awwwards SOTD 12-jul-2026 | **La retícula como protagonista.** Hairlines con nodos cuadrados en los cruces, letras gigantes reveladas celda por celda y tres voces tipográficas (condensada gigante, serif itálica, mono). Stack liviano: GSAP + Lenis. | `2-longbow*.png` |

### 1 · Prødux Design
- **Memorable:** wordmark gigante sobre negro; al bajar, una imagen llega en cuadrados que vuelan desde la profundidad y encajan.
- **Técnicas:** escena pineada con scrub; cada pieza con su propio `z`, desenfoque y retraso (profundidad de campo falsa); At Aero (ancha) + DM Mono 11 px; monocromo `#0E0E0E`/`#E4E4E4`; navegación entre corchetes en mono. Stack: Next.js, GSAP (ScrollTrigger, Flip), Lenis, Three.js.
- **Adaptar:** el `#fragmento` y sus `#bits` dispersos en capas que convergen semana a semana con scrub (SVG/DOM, `transform` + `blur` limitado a 6–10 piezas). Composición de portada "palabra gigante + frase grande a un lado + ficha mono al otro".
- **No copiar:** la imagen de musgo, el blur en decenas de elementos, el guiño de cookies con frases de una obra con derechos.

### 2 · 2xA Studio
- **Memorable:** el descifrado más premium encontrado: se lee "código ejecutándose" sin ruido.
- **Técnicas:** texto partido en `.char`; frente de barrido izquierda→derecha; `setInterval` a 20 fps durante ≈1,2 s; en cada frame el carácter rota entre 6 clases CSS (relleno, invertido, acento, acento invertido, acento relleno, borde) y termina limpio; solo cambia `className` (sin reflow). Texto real en el HTML desde el inicio. Stack: Vite, GSAP/ScrollTrigger, Lenis, Splitting, swup.
- **Adaptar:** el GIRO de cada semana con ese barrido en la paleta propia (marfil invertido, naranja como acento, azul como borde); sustitución real de caracteres solo en etiquetas cortas (`SEMANA_04`).
- **No copiar:** la mono condensada diminuta y gris (no da contraste); aplicarlo a párrafos.

### 3 · Revelatio Studio
- **Memorable:** el retrato del equipo hecho de glifos que se resuelve en la foto real; casi todo es negro.
- **Técnicas:** GSAP ScrambleText, SplitText, Observer; lista de ~25 palabras al 15 % donde una se enciende según scroll/mouse; secciones que invierten negro↔blanco como corte de montaje; Neue Haas Grotesk en un solo peso. Stack: Webflow, GSAP, Lenis, WebGL; respeta `prefers-reduced-motion`.
- **Adaptar:** el símbolo HR mostrado primero como mosaico de caracteres que se resuelve; índice de semanas como lista enorme donde solo la activa se enciende en naranja; una inversión de fondo puntual (carbón → marfil) en un momento clave.
- **No copiar:** la curvatura CRT (lee "retro/terminal"); texto real al 15 % (solo decorativo, `aria-hidden`).

### 4 · Igloo Inc.
- **Memorable:** todo se siente como un sistema que compila en vivo.
- **Técnicas:** partículas que muestrean un atlas de 32 dígitos y cambian en onda radial desde el centro (`floor(progress*k - dist)`); malla con nodos numerados en mono que se vuelve sólida con el scroll; loader de una línea de glifos (`+===---==+`); IBM Plex Mono para toda la interfaz. Stack: Svelte, Three.js, Draco, KTX2, GSAP — pesado (1,4 MB).
- **Adaptar:** partículas-glifo que se vuelven puntos al llegar a su sitio en el símbolo HR (ensamblaje y descifrado en un solo gesto), con la onda saliendo de la pupila-cerradura; el símbolo como plano técnico con cotas que se rellena en el cierre.
- **No copiar:** el texto dentro de WebGL, el peso, la dependencia total de WebGL, el gris frío claro.

### 5 · Longbow
- **Memorable:** la retícula de construcción es la protagonista, con nodos tipo tirador de mesa de diseño.
- **Técnicas:** 4 columnas de hairline con cuadrados de 6 px en las intersecciones, también en móvil; letras gigantes recortadas por la celda; Bebas Neue a ~21 vw + EB Garamond itálica + Geist Mono 13 px (salto de escala ×23); loader en píldora sobre vídeo con desenfoque de velocidad. Stack: Webflow, GSAP, Lenis (19 KB propios).
- **Adaptar:** retícula con nodos en los cruces; número de semana gigante revelado celda por celda con `clip-path: inset()`; triple voz tipográfica (golpe / revelación / metadato); desenfoque de velocidad como guiño a la carretera.
- **No copiar:** cuerpo de texto en mono mayúscula, el glassmorphism de sus tarjetas, el gris medio de fondo.

## Analizadas y no elegidas (pero con una técnica aprovechable)

| Sitio | Premio | Técnica que se rescata |
|---|---|---|
| [Quai Network](https://qu.ai) | SOTD 27-mar-2023 + Developer | Ensamblaje escalonado por vértice desde el origen con rebote elástico; repulsión al cursor suave (radio pequeño, vuelve); botón "Saltar animación". |
| [Siena Film Foundation](https://siena.film) | SOTD + SOTM mar-2025 | Ficha de créditos de cine por escena, boleto "ADMIT ONE" (→ "ACCESO CONCEDIDO"), grano de película. |
| [Why Zero](https://why.zero.university) | SOTD + SOTM sep-2026 | Contador atado al scroll como hilo persistente (→ "INTEGRACIÓN 0–100 %"). |
| [David Whyte Experience](https://davidwhyte.com/experience/) | SOTD + SOTM dic-2024 | Transiciones de máscara orgánica entre escenas pineadas; loader = círculo que se completa; serif para la voz, sans para la interfaz. |
| [TRIONN](https://trionn.com) | SOTD 27-jul-2026 | Mantener presionado el símbolo: las piezas vibran, estallan y vuelven a unirse al soltar. |
| [Blit Studio](https://blit.studio) | Honorable Mention may-2026 | Partículas que esquivan el logo: el símbolo aparece por ausencia. |
| HAOQI.DESIGN | SOTD (no verificado) | Retícula con "+" en los cruces, coordenadas del cursor y reloj con cifras tabulares. Su paleta neón queda descartada. |
| Aspen Search, Alethia, Lama Lama | SOTD | Ficha suiza por celda, mira que se cierra sobre la frase clave, lecturas con signo y unidad. |
| Terminal Industries, Lando Norris | SOTD + SOTM | Secuencia de fotogramas con scrub; collage en profundidad y recortes `clip-path`. |

## Patrones comunes a llevar a la dirección creativa

1. **Una idea visual por escena**, con pin y scrub; nada de "todo aparece con fade-up".
2. **Dos familias tipográficas como máximo** más una mono para metadatos; contraste de escala extremo (×15–×25).
3. **Un solo acento de color** usado con disciplina (aquí: el naranja del fragmento).
4. **Un hilo persistente** (contador, lectura, el fragmento) que da continuidad a todo el scroll.
5. **El texto real siempre es HTML**; el canvas/WebGL decora encima y tiene fallback.
