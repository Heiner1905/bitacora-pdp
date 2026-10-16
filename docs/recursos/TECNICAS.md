# Técnicas extraídas de `presentacion-equidad-llms.html`

Fuente: presentación de 15 diapositivas (1920×1080 escalado), un solo archivo con CSS y JS vanilla, sin librerías. Se analizó todo el código y se vio funcionando en Playwright a 1440×900 (capturas en el scratchpad de la sesión).

**Qué se toma de aquí:** las técnicas, los algoritmos y los parámetros. **Qué no se toma:** el look (degradados arcoíris, glassmorphism/`backdrop-filter`, orbes difuminados, Segoe UI, texto con degradado animado). Cada técnica se reescribe con GSAP 3.13 + ScrollTrigger para un sitio de scroll continuo.

---

## 0. Arquitectura de la presentación (para entender las piezas)

| Pieza | Cómo funciona | Qué se reutiliza |
|---|---|---|
| Escenario fijo | `#stage` de 1920×1080, `transform: scale(min(innerWidth/1920, innerHeight/1080))`. Las coordenadas del ratón se dividen por `scale`. | Nada (en un sitio con scroll el layout es fluido). Sí la idea de **convertir coordenadas del ratón al espacio del canvas**. |
| Revelado por pasos | Cada elemento con `data-f="n"` pertenece al paso *n*. Al llegar se quita `.hold`. Los `.rv` reciben `--dl` automático: `0.55 + i*0.14 s` (paso 0) o `0.1 + i*0.15 s` (pasos ≥ 1). | **Clave para el scroll:** cada `data-f` se convierte en una etiqueta de un timeline con scrub en una sección fijada (*pin*). Ver §A. |
| Transiciones de CSS | Casi todo se anima con `transition` y se dispara con la clase `.active`. Easing dominante: `cubic-bezier(.16,1,.3,1)` (≈ `expo.out`). | En GSAP: `ease: "expo.out"`. `cubic-bezier(.34,1.56,.64,1)` ≈ `back.out(1.7)`. `cubic-bezier(.7,0,.3,1)` ≈ `power3.inOut`. `cubic-bezier(.65,0,.35,1)` ≈ `power2.inOut`. |
| Bucle global | Un solo `requestAnimationFrame` que dibuja dos canvas a pantalla completa **siempre**, aunque no se vean. | Pausar cuando el canvas sale de la vista (lo más importante para rendimiento). |

### A. Patrón general para pasar de "clic" a "scroll"

```js
gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
const mm = gsap.matchMedia();

mm.add({
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 768px)"
}, (ctx) => {
  const { motion, desktop } = ctx.conditions;
  if (!motion) return;              // reduce: el CSS ya muestra el estado final, no se crea nada

  document.querySelectorAll("[data-escena]").forEach((sec) => {
    const tl = gsap.timeline({
      defaults: { ease: "expo.out", duration: 1 },
      scrollTrigger: desktop
        ? { trigger: sec, start: "top top", end: "+=" + (sec.dataset.pasos || 2) * 100 + "%", pin: true, scrub: 0.6 }
        : { trigger: sec, start: "top 75%", toggleActions: "play none none reverse" } // móvil: sin pin, disparo único
    });
    // cada "paso" (antiguo data-f) es una etiqueta del timeline
    sec.querySelectorAll("[data-paso]").forEach((el) => {
      tl.addLabel("p" + el.dataset.paso)
        .from(el.querySelectorAll(".rv"), { autoAlpha: 0, y: 50, scale: 0.95, stagger: 0.15 }, "p" + el.dataset.paso);
    });
  });
});
```

Reglas de la conversión:
- **Scrub** cuando la animación "cuenta algo" que el usuario puede querer recorrer hacia atrás (escalera, anillos, gráfica que se dibuja, tachado). **onEnter / toggleActions** cuando es un evento (máquina de escribir, contadores, partículas que se arman, persianas).
- Los retrasos (`transition-delay`) del original se convierten en **posiciones del timeline** (`"<0.15"`, etiquetas), nunca en `delay` dentro de un scrub.
- Estado final por defecto en CSS; JS solo anima *desde* el estado oculto (`gsap.from`). Así, sin JS o con `reduce`, todo se ve.
- `pin` solo en escritorio. En móvil, secciones cortas con disparo único y menos elementos.

---

## 1. Partículas que se transforman en texto/forma y reaccionan al cursor

**Dónde:** diapositivas 1 ("LLM"), 2 ("?") y 15 ("GRACIAS"). Atributos `data-pt` (texto), `data-ptx/pty` (centro), `data-pts` (tamaño de fuente). Al salir hacia una diapositiva sin forma, las partículas **explotan** y se desvanecen.

**Implementación (canvas 2D `#pt`, 1920×1080):**
- **Bolsa fija de NT = 4600 partículas**, creadas una vez: `{x, y, vx, vy, tx, ty, a, ta, c, s: 2.4–3.9, ph}`.
- **Muestreo de texto a puntos** en un canvas fuera de pantalla: se pinta el texto en `900` de peso, se lee `getImageData` y se toma un píxel cada `gap` px si su alfa > 140. `gap` empieza en 4 y sube hasta que hay ≤ NT puntos. Luego **se barajan** (Fisher–Yates) para que la asignación partícula→punto sea aleatoria (el armado se ve orgánico, no como un barrido) y cada punto recibe un color según su x normalizada. Resultado en caché por clave.
- **Física por frame** (independiente de los fps con `fr = dt*60`):
  - Amortiguación de velocidad: `dec = 0.9^fr`.
  - Atracción al objetivo por *lerp* (no por fuerza): `ez = 1 - 0.925^fr`; `x += (tx - x) * ez`.
  - **Repulsión del cursor:** radio 130 px (`d² < 16900`), fuerza `(1 - d/130) * 5` en la dirección opuesta, sumada a la velocidad. Como el lerp sigue tirando, la letra "se abre" alrededor del cursor y se cierra sola.
  - "Respiración": desplazamiento `sin(t*1.6+ph)*0.9`, `cos(t*1.3+ph)*0.9`.
  - Opacidad: `a += (ta - a) * 0.05*fr`; si `a < 0.02` no se dibuja.
  - Dibujo con `fillRect` (cuadrados, más baratos que `arc`).
- **Explosión:** al quitar la forma, cada partícula activa recibe velocidad aleatoria de 4–14 px/frame y `ta = 0`.

```js
function muestrear(texto, cx, cy, size, W, H, max) {
  const oc = document.createElement("canvas"); oc.width = W; oc.height = H;
  const o = oc.getContext("2d");
  o.fillStyle = "#fff"; o.textAlign = "center"; o.textBaseline = "middle";
  o.font = `900 ${size}px ${FUENTE}`;          // usar la fuente del sitio, tras document.fonts.ready
  o.fillText(texto, cx, cy);
  const d = o.getImageData(0, 0, W, H).data;
  let gap = 4, pts;
  do { pts = [];
    for (let y = 0; y < H; y += gap) for (let x = 0; x < W; x += gap)
      if (d[(y * W + x) * 4 + 3] > 140) pts.push(x, y);
    gap++;
  } while (pts.length / 2 > max && gap < 30);
  // barajar por pares (Fisher–Yates) ...
  return new Float32Array(pts);
}

// por frame
const fr = dt * 60, dec = 0.9 ** fr, ez = 1 - 0.925 ** fr;
for (let i = 0; i < n; i++) {
  vx[i] *= dec; vy[i] *= dec;
  if (activo[i]) { x[i] += (tx[i] - x[i]) * ez; y[i] += (ty[i] - y[i]) * ez; }
  const mx = x[i] - mouse.x, my = y[i] - mouse.y, md = mx * mx + my * my;
  if (md < 16900) { const m = Math.sqrt(md) + .01, f = (1 - m / 130) * 5; vx[i] += mx / m * f; vy[i] += my / m * f; }
  x[i] += vx[i] * fr; y[i] += vy[i] * fr;
}
```

**Versión con scroll:**
- *Disparo (recomendado):* `ScrollTrigger.create({ trigger, start: "top 60%", onEnter: () => formar("HR"), onLeaveBack: dispersar })`. La física sigue en rAF; el scroll solo cambia los objetivos.
- *Scrub (morfología entre formas):* guardar dos conjuntos de objetivos A y B (p. ej. símbolo HR → palabra) y en `onUpdate: self => mezcla = self.progress` usar `tx = lerp(A, B, easeInOut(mezcla))`. También se puede usar `progress` para la "explosión": `radio = progress * 600` empuja las partículas hacia fuera desde el centro.
- Varias formas en secuencia a lo largo de una sección fijada: un objetivo por etiqueta del timeline.

**Reduced-motion:** no crear el bucle; dibujar una sola vez las partículas en sus objetivos (imagen estática de puntos) o, mejor, mostrar el texto real. **El texto del canvas no es accesible:** acompañarlo de un `<h1>`/`<p>` real (visible o `sr-only`) y poner `aria-hidden="true"` al canvas.

**Móvil:** NT ≈ 1200–1800, muestreo con `gap` mínimo 3 sobre el tamaño real del canvas; sin repulsión por cursor (opcional: repulsión en `pointermove` con el dedo, o una onda al tocar).

**Rendimiento:** 4600 partículas con `fillRect` caben en 60 fps, pero el original tiene tres derroches: (1) cambia `fillStyle` y `globalAlpha` en cada partícula; (2) dibuja siempre, aunque no se vea; (3) canvas de 1920×1080 sin tener en cuenta DPR. Correcciones:
- Arreglos tipados (`Float32Array`) en lugar de objetos.
- **Agrupar por color:** cuantizar a ~8–16 colores (el original ya precalcula 21 en `DC`) y dibujar todas las de un color seguidas; la opacidad en cubetas de 0,1.
- `canvas.width = clientWidth * min(devicePixelRatio, 2)`.
- Pausar con `ScrollTrigger.create({ trigger: canvas, onToggle: s => s.isActive ? start() : stop() })` y con `document.visibilitychange`.
- Usar `gsap.ticker.add(draw)` en lugar de un rAF propio, para compartir reloj con GSAP (y `gsap.ticker.lagSmoothing`).
- Muestrear **después** de `document.fonts.ready`, o el texto saldrá con la fuente de respaldo.

---

## 2. Red de partículas de fondo (constelación) con cursor

**Dónde:** fondo de todas las diapositivas (canvas `#bg`).

**Implementación:** 90 partículas con velocidad ±0,25 px/frame, radio 1,5–4. Se unen con una línea si `d² < 24000` (≈155 px), con opacidad `0.22 * (1 - d²/24000)`. Alrededor del cursor: **repulsión** suave (radio 230, `+0.08` por frame) y **líneas hacia el cursor** si `d < 260`. Rozamiento `0.985`; si casi se detienen se les da un empujón aleatorio. Bordes envolventes (*wrap*). `burst(s)` da un impulso radial aleatorio a todas: 2,4 al cambiar de diapositiva y 0,8 en cada paso. El color de la red se interpola hacia el acento de la diapositiva (`colNow += (colTo - colNow) * .04`).

```js
for (let j = i + 1; j < P.length; j++) {          // O(n²): 4005 pares con n = 90
  const ax = p.x - q.x, ay = p.y - q.y, d = ax*ax + ay*ay;
  if (d < 24000) { ctx.strokeStyle = `rgba(${c},${0.22 * (1 - d / 24000)})`; /* línea */ }
}
```

**Scroll:** usar la velocidad del scroll como `burst`: `ScrollTrigger.create({ onUpdate: s => impulso(s.getVelocity() / 4000) })` (limitado con `gsap.utils.clamp`). El color/acento cambia con `onEnter` de cada sección (`gsap.to(colorObj, { r, g, b, duration: 1.2 })`).

**Reduced-motion:** un solo frame estático o nada. **Móvil:** 35–45 partículas, umbral 12000, sin líneas al cursor.

**Rendimiento:** el coste está en los `stroke()` individuales. Mejor: agrupar todas las líneas de una misma opacidad cuantizada en un solo `beginPath()`/`stroke()`; usar una rejilla espacial si n > 150.

---

## 3. Foco de luz y parallax que siguen al cursor; cursor que se oculta

**Dónde:** global. `#spot` (círculo radial de 900 px con `mix-blend-mode: screen`) sigue al ratón; los orbes de fondo se desplazan con `translate: calc(var(--mx)*60px) ...` donde `--mx`, `--my` ∈ [-1, 1]. Tras 2,5 s sin mover el ratón: `cursor: none`, el foco se apaga y las partículas dejan de reaccionar (útil al proyectar).

**Con GSAP:** `gsap.quickTo(spot, "x", { duration: 0.6, ease: "power3" })` y lo mismo para `y`; actualizar variables con `gsap.quickSetter(root, "--mx")`. Mover el foco con `transform`, **no** con `left/top` como en el original (provoca layout). Parallax con scroll: `gsap.to(capa, { yPercent: -20, ease: "none", scrollTrigger: { scrub: true } })`.

**Reduced-motion / móvil:** desactivar (no hay cursor). El ocultado del cursor no tiene sentido en un sitio; descartarlo.

**Rendimiento:** `mix-blend-mode` + `filter: blur(120px)` en capas grandes es caro en GPU modestas; preferir degradados radiales ya suaves (sin `blur`) y `will-change: transform` solo en el foco.

---

## 4. Persianas (transición de *shutter*)

**Dónde:** entre todas las diapositivas (visto en la captura de transición).

**Implementación:** 12 franjas verticales (`flex: 1`) a pantalla completa con un filo luminoso de 4 px abajo. Un solo `@keyframes` de 0,95 s, `cubic-bezier(.7,0,.3,1)`, escalonado 32 ms por franja. El truco: **cambio de `transform-origin` a mitad de la animación** — bajan desde arriba (0→45 %: `scaleY 0→1`, origen *top*) y se recogen hacia abajo (55→100 %: `scaleY 1→0`, origen *bottom*). El contenido se cambia a los 430 ms, cuando la pantalla está tapada.

```css
@keyframes sh{0%{transform:scaleY(0);transform-origin:top}45%{transform:scaleY(1);transform-origin:top}
55%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
#shut.go i{animation:sh .95s cubic-bezier(.7,0,.3,1) both;animation-delay:calc(var(--k)*32ms)}
```

**Con scroll (como separador de capítulo entre semanas):**
```js
gsap.timeline({ scrollTrigger: { trigger: sep, start: "top bottom", end: "bottom top", scrub: true } })
  .fromTo(barras, { scaleY: 0, transformOrigin: "top" }, { scaleY: 1, stagger: 0.03, ease: "power3.in" })
  .set(barras, { transformOrigin: "bottom" })
  .to(barras, { scaleY: 0, stagger: 0.03, ease: "power3.out" });
```
Variante de revelado de sección: las franjas cubren la sección y se recogen con `onEnter`. **Móvil:** 6 franjas. **Reduced-motion:** no renderizar las franjas (o un fundido de opacidad de 0,2 s).

**Rendimiento:** muy barato (solo `transform: scaleY`).

---

## 5. Entrada 3D de escena (profundidad + giro)

**Dónde:** todas las diapositivas. `#stage` con `perspective: 1800px`. La diapositiva saliente se va a `translateZ(500px) rotateY(12deg)` (o `-700px`/`-12deg` hacia atrás) y la entrante llega desde el lado opuesto a `transform: none` en 1,1 s `cubic-bezier(.16,1,.3,1)`. **Depende de la dirección** (adelante/atrás). Para fijar el estado inicial sin transición: clase `.prep` con `transition: none`, se fuerza reflow (`void el.offsetWidth`) y se quita.

**Con scroll:**
```js
gsap.from(sec.querySelector(".escena"), {
  z: -700, rotationY: -12, autoAlpha: 0, transformPerspective: 1800,
  scrollTrigger: { trigger: sec, start: "top 85%", end: "top 30%", scrub: 0.8 }
});
```
La dirección sale gratis: con `scrub`, al subir se invierte. Para la salida, otro tramo con `end: "bottom top"` hacia `z: 500, rotationY: 12`.

**Reduced-motion:** sin transform; a lo sumo opacidad. **Móvil:** reducir a `rotationY: -6`, `z: -300` (en pantallas estrechas el giro deforma mucho el texto).

**Rendimiento:** bien si se anima un solo contenedor; evitar `backdrop-filter` dentro de un elemento transformado en 3D (fuerza re-rasterizar).

---

## 6. Títulos que suben palabra por palabra con máscara (+ desenfoque)

**Dónde:** todos los `h1/h2.split`.

**Implementación:** `proc()` recorre los nodos de texto y envuelve cada palabra en `<span class="w"><i>palabra</i></span>`. El `span` tiene `overflow: hidden` (máscara) con un pequeño relleno/margen negativo para no recortar descendentes; el `i` parte de `translate: 0 115%; rotate: 8deg; filter: blur(6px)` con `transform-origin: left bottom` y llega a 0 en 1 s `expo.out`, retraso `0.35 + n*0.08 s`. Las palabras dentro de `<em>` reciben otra clase (énfasis).

**Con GSAP 3.13 (SplitText trae máscara):**
```js
const split = SplitText.create(h2, { type: "words,lines", mask: "words", autoSplit: true,
  onSplit: (self) => gsap.from(self.words, {
    yPercent: 115, rotate: 8, filter: "blur(6px)", duration: 1, ease: "expo.out", stagger: 0.08,
    scrollTrigger: { trigger: h2, start: "top 80%" }
  })
});
```
`autoSplit` rehace la división al cambiar el ancho (importante en responsive). SplitText añade `aria-label` al contenedor para lectores de pantalla.

**Reduced-motion:** no dividir. **Móvil:** quitar el `blur` (caro) y el `rotate`; solo `yPercent`.

**Rendimiento:** `filter: blur()` animado en muchas palabras es lo más caro de toda la presentación; limitarlo a titulares cortos o sustituirlo por opacidad.

---

## 7. Glitch de separación de canales (una sola vez)

**Dónde:** titulares, 0,55 s después de entrar. `@keyframes glitch` de 0,8 s con `steps(1)` que alterna `text-shadow` de dos colores desplazados ±3–6 px y `translateX` de ±2–3 px; termina limpio.

**Con scroll:** `onEnter` → añadir la clase o un timeline de `gsap.set` en 4–5 posiciones. Encaja con el tema de ciberseguridad **si se usa una sola vez y con los colores propios del sitio** (no los tres de neón). **Reduced-motion:** omitir.

---

## 8. Texto que se "descifra" (scramble)

**Dónde:** las etiquetas superiores `.tag.scr` de cada diapositiva.

**Algoritmo** (900 ms, inicia a los 250 ms): para cada carácter en la posición relativa `r = i/n` y progreso `p`: si `p > r + 0.15` → carácter final; si `p > r - 0.25` → glifo aleatorio de `A–Z0–9#%&*+=<>/`; si no → espacio. Es una **ola de descifrado de izquierda a derecha** con un frente de ~40 % del ancho. Espacios y `·` se conservan.

```js
for (let i = 0; i < n; i++) {
  const r = i / n;
  out += (t[i] === " " || p > r + 0.15) ? t[i] : (p > r - 0.25 ? GL[(Math.random() * GL.length) | 0] : " ");
}
```

**Con GSAP:** `ScrambleTextPlugin` (gratuito desde 3.13): `gsap.to(el, { scrambleText: { text: el.dataset.txt, chars: "ABCDEF0123456789#%&", revealDelay: 0.2, speed: 0.6 }, duration: 0.9, scrollTrigger: { trigger: el, start: "top 85%" } })`. Para scrub, el algoritmo manual es mejor (el progreso `p` sale directo de `self.progress`).

**Accesibilidad:** poner el texto final en `aria-label` y `aria-hidden` al nodo que se anima, o el lector leerá basura. Usar fuente monoespaciada para que no "salte" el ancho. **Reduced-motion:** texto final directo.

---

## 9. Variantes de aparición (`.rv`)

Una sola clase con variantes por modificador; todas `expo.out`, 0,8–1,1 s:

| Clase | Desde |
|---|---|
| `.rv` | `opacity 0, y +50, scale .95` |
| `.rv.l` / `.rv.r` | `x -90` / `x +90` |
| `.rv.z` | `scale .5, blur(12px)` |
| `.rv.f` | `rotateX -75deg` con `transform-origin: 50% 0` (cae como una tapa) |

Al ocultar (retroceder un paso) la transición se acorta a 0,3 s: **salidas más rápidas que entradas**. En GSAP: `ScrollTrigger.batch(".rv", { onEnter: b => gsap.from(b, {...stagger: .15}) })` para listas largas (mucho más barato que un ScrollTrigger por elemento). Con `scrub`, la salida al subir se resuelve sola.

---

## 10. Contadores

**Dónde:** diapositivas 5, 6, 10 y 12 (`.cnt` con `data-to`, `data-dec`, `data-suf`).

**Implementación:** 2000 ms con *ease-out exponencial* `v = to * (1 - 2^(-10p))`, esperando el mismo retraso que la aparición del elemento que lo contiene. **Formato es-CO:** miles con espacio y decimales con coma (`1 140 328`, `93,7 %`). `font-variant-numeric: tabular-nums` evita que el número "baile".

```js
function fmt(v, d) {
  const [i, f] = Math.abs(v).toFixed(d).split(".");
  return i.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + (d ? "," + f : "");
}
const o = { v: 0 };
gsap.to(o, { v: +el.dataset.to, duration: 2, ease: "expo.out",
  onUpdate: () => el.textContent = fmt(o.v, +el.dataset.dec || 0) + (el.dataset.suf || ""),
  scrollTrigger: { trigger: el, start: "top 85%", once: true } });
```
Usar el espacio fino no separable (` `) para que no se parta la cifra. **Accesibilidad:** el valor final en el HTML (y `aria-label`), el JS lo pone a 0 solo si hay movimiento. **Scrub:** posible (el número sigue al scroll) pero leerlo cuesta; preferir `once`.

---

## 11. Tarjetas con inclinación 3D, brillo y borde giratorio

**Dónde:** `.card.tilt` (diapositivas 5, 6, 8, 9, 12, 13).

**Implementación:**
- *Inclinación:* en `mousemove`, `x,y ∈ [0,1]` relativos a la tarjeta → `perspective(1000px) rotateX((0.5 - y)*16deg) rotateY((x - 0.5)*16deg) translateZ(20px)` (máximo ±8°). Al salir, vuelve con `transition: transform .25s`.
- *Brillo que sigue al cursor:* `::after` con `radial-gradient(420px circle at var(--gx) var(--gy), rgba(255,255,255,.16), transparent 55%)`, visible solo en `:hover`.
- *Borde giratorio:* `::before` con `conic-gradient(from var(--ang), …)` enmascarado para dejar solo un borde de 2 px (`mask-composite: exclude`) y `--ang` registrado con `@property` para poder animarlo (`5s linear infinite`).

```js
const rx = gsap.quickTo(card, "rotationX", { duration: 0.4, ease: "power3" });
const ry = gsap.quickTo(card, "rotationY", { duration: 0.4, ease: "power3" });
gsap.set(card, { transformPerspective: 1000 });
card.addEventListener("pointermove", (e) => {
  const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  rx((0.5 - y) * 16); ry((x - 0.5) * 16);
  card.style.setProperty("--gx", x * 100 + "%"); card.style.setProperty("--gy", y * 100 + "%");
});
card.addEventListener("pointerleave", () => { rx(0); ry(0); });
```
Leer `getBoundingClientRect` una vez en `pointerenter` y reutilizarlo (evita layout en cada movimiento).

**Scroll:** la inclinación sigue siendo de cursor; con scroll se puede dar una inclinación inicial que se endereza (`from rotationX: 25, scrub`). **Móvil y teclado:** sin inclinación; en `:focus-visible` mostrar el brillo/borde. **Reduced-motion:** sin inclinación ni borde giratorio (estático). **Ojo con el look:** el brillo y el borde cónico deben ir en los colores del sitio, sin vidrio esmerilado.

---

## 12. Destello que barre (*glint*)

**Dónde:** barras de progreso, columnas de la escalera y recuadros "IDEA CLAVE". Pseudo-elemento con `linear-gradient(100deg, transparent 35%, rgba(255,255,255,.18) 50%, transparent 65%)` que va de `translate -100%` a `100%` (`@keyframes glint{60%,100%{translate:100% 0}}`: barre en el 60 % del ciclo y descansa el resto).

**Scroll:** un solo barrido con `onEnter`, o el destello atado al scroll (`xPercent: -100 → 100`, scrub) para que "recorra" la tarjeta mientras se lee. Barato (`transform`). **Reduced-motion:** omitir.

---

## 13. Barras horizontales

**Dónde:** diapositiva 7. `.fill` de `width: 0` a `var(--w)` en 1,8 s `expo.out` con retraso 0,4 s, más el destello.

**Mejora:** animar `scaleX` con `transform-origin: left` en lugar de `width` (evita layout). `gsap.from(fill, { scaleX: 0, transformOrigin: "left", ease: "expo.out", scrollTrigger: { trigger, start: "top 80%", end: "top 40%", scrub: 0.5 } })`. Si la barra tiene esquinas redondeadas, `scaleX` las deforma: usar `clip-path: inset(0 100% 0 0 round 26px)` → `inset(0 0 0 0 round 26px)`.

---

## 14. Escalera de columnas

**Dónde:** diapositiva 3 (tres niveles de alturas 250/350/450 px, alineadas abajo con `align-items: flex-end`). Cada columna aparece con **`clip-path: inset(100% 0 0 0)` → `inset(0)`** en 1,2 s `expo.out` (crece desde abajo sin deformar el texto, a diferencia de `scaleY`), una por paso. Llevan un número gigante de marca de agua (`font-size: 220px`, opacidad 14 %, saliendo por abajo) y el destello.

```js
const tl = gsap.timeline({ scrollTrigger: { trigger: ".escalera", start: "top 70%", end: "+=120%", scrub: 0.6, pin: esEscritorio } });
cols.forEach((c, i) => tl.fromTo(c, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "expo.out" }, i * 0.4)
                          .from(c.querySelector(".big"), { yPercent: 60 }, "<"));
```
Uso posible en la bitácora: **progresión por semanas o etapas del proceso de práctica**. **Móvil:** columnas apiladas en vertical, cada una revelándose de izquierda a derecha (`inset(0 100% 0 0)`). **Reduced-motion:** visibles. **Rendimiento:** `clip-path` rectangular se compone bien en Chrome; evitar `clip-path` con `path()` animado.

---

## 15. Máquina de escribir + fichas que saltan

**Dónde:** diapositiva 4. Escribe `> Los LLMs pueden reducir brechas` a 45 ms por carácter (`setInterval`), con un cursor de bloque que parpadea (`@keyframes blink{50%{opacity:0}}` con `steps(1)`, 1 s). Al terminar, aparecen 5 fichas (una por token) con `back.out` (`cubic-bezier(.34,1.56,.64,1)`, desde `scale .6, y 30`) escalonadas 140 ms.

```js
gsap.timeline({ scrollTrigger: { trigger: caja, start: "top 75%" } })
  .to(texto, { duration: frase.length * 0.045, text: { value: frase }, ease: "none" })   // TextPlugin
  .from(fichas, { autoAlpha: 0, y: 30, scale: 0.6, stagger: 0.14, ease: "back.out(1.7)" });
```
Con **scrub** también funciona bien (escribir mientras se baja): mismo timeline con `scrub: true`. **Accesibilidad:** texto completo en el DOM con `aria-label`/`sr-only`; lo animado con `aria-hidden`. El cursor debe detenerse con reduced-motion (`animation: none`). **Rendimiento:** trivial.

---

## 16. Arcos de atención (SVG que conecta palabras)

**Dónde:** diapositiva 4. Sobre las fichas, un SVG dibuja curvas Bézier cúbicas desde la palabra "consulta" (resaltada) hacia las demás; el **grosor** (`3 + w*30`) y la **opacidad** (`.35 + w*1.6`) codifican el peso, con un porcentaje en el vértice. La altura del arco depende de la distancia: `h = 180 - min(150, d*0.4)`. Cada 2,2 s cambia la palabra consulta (ciclo). El dibujado usa el truco `pathLength="1"` + `stroke-dasharray:1; stroke-dashoffset:1 → 0`.

```js
p.setAttribute("d", `M${x1} 176 C ${x1} ${h},${x2} ${h},${x2} 176`);
p.setAttribute("pathLength", "1");          // normaliza la longitud: dasharray/offset en 0–1
```

**Con scroll:** el índice de la palabra consulta sale del progreso (`Math.floor(self.progress * n)` en una sección fijada) y los arcos se dibujan con `DrawSVGPlugin` (`drawSVG: "0%" → "100%"`). Sirve para **mostrar relaciones** (p. ej. habilidades ↔ experiencias ↔ rol objetivo). Calcular las x con `offsetLeft` **después** del layout y recalcular en `ScrollTrigger.addEventListener("refreshInit")`. **Móvil:** si no caben en fila, fichas en columna y arcos laterales, o lista estática. **Reduced-motion:** arcos dibujados, sin ciclo.

---

## 17. Campo de 11 403 puntos (escala de datos)

**Dónde:** diapositiva 6 ("cada punto ≈ 100 textos"). Canvas 1640×230, rejilla de paso 6 px. Cada punto tiene un umbral `t = (x/W)*0.75 + random*0.25` (barrido de izquierda a derecha con borde irregular). Progreso global `p` en 2,6 s tras 1,4 s; por punto `k = clamp((p - t)*6, 0, 1)` y tamaño `3*k*(1.6 - 0.6k)` mientras `k < 1` (**sobrepaso**: nace más grande y se asienta). Tras terminar, parpadeo suave `0.7 + 0.3*sin(t*2.2 + fase)`. Color por x con una paleta precalculada de 21 pasos.

```js
const k = Math.min(1, (p - d.t) * 6); if (k <= 0) continue;
const sz = 3 * k * (k < 1 ? 1.6 - 0.6 * k : 1);
ctx.fillStyle = PALETA[(d.c * 20) | 0];
ctx.fillRect(Math.round(d.x - sz / 2), Math.round(d.y - sz / 2), sz, sz);
```

**Con scroll:** ideal para scrub: `p = self.progress * 1.2` y se redibuja solo en `onUpdate` (no hace falta rAF continuo salvo para el parpadeo). Muy útil para **dar escala a un número** (horas, semanas, intentos). **Móvil:** paso 8–10 px y menos filas. **Reduced-motion:** dibujar el estado final una vez.

**Rendimiento:** 11 k `fillRect` por frame es aceptable, pero el original **nunca detiene ese bucle** (sigue tras salir de la diapositiva hasta el siguiente cambio). Detenerlo al terminar y cuando no es visible; agrupar por color (los puntos ya vienen ordenados por x, así que basta con dibujar por franjas).

---

## 18. Gráfica de líneas que se dibuja (con área, cotas y viajeros)

**Dónde:** diapositivas 8 y 12.
- Trazos con `pathLength="1"` y `stroke-dashoffset 1→0` en 2,2 s `cubic-bezier(.4,0,.2,1)`.
- Área entre curvas revelada con `clip-path: inset(0 100% 0 0) → inset(0)` en 2,6 s (avanza a la par de las líneas).
- Cotas verticales discontinuas (`stroke-dasharray: 8 8`) y rótulos que aparecen en secuencia (0,9 s, 2 s, 3 s) **sincronizados con el avance del trazo**.
- "Viajeros": círculos que recorren la curva en bucle con SMIL `<animateMotion><mpath href="#pA"/></animateMotion>` (3,2 s), visibles después del dibujado.
- Puntos finales que aparecen al terminar.

**Con scroll:** caso perfecto de scrub. `DrawSVGPlugin` para la línea, `clipPath` para el área y las cotas colocadas en el timeline en la fracción del trazo donde caen (`tl.from(cota, { autoAlpha: 0 }, 0.5)` si la cota está a mitad del eje). El viajero se ata al scroll con `MotionPathPlugin` (`motionPath: { path: "#pA", align: "#pA", alignOrigin: [0.5, 0.5] }`, `ease: "none"`) en lugar de SMIL. **Reduced-motion:** gráfica completa estática. **Rendimiento:** quitar `filter: drop-shadow` en trazos animados (repinta cada frame) o usar un trazo duplicado más grueso y translúcido como "brillo".

---

## 19. Balanza con caída y rebote

**Dónde:** diapositiva 9. Dos esferas caen desde `-600px` con un `@keyframes` de rebote amortiguado (0 → 55 % suelo → -50 → 0 → -12 → 0, 1,3 s) escalonadas 0,4 s; después la viga gira 7° alrededor del fulcro (`transform-origin: 350px 270px`) con un sobrepaso elástico (`cubic-bezier(.3,1.7,.5,1)`, 2,2 s).

**GSAP:** `ease: "bounce.out"` para la caída y `"elastic.out(1, 0.5)"` o `"back.out(3)"` para la viga; `svgOrigin: "350 270"` para girar en coordenadas del SVG. Con scroll: `onEnter` (un rebote con scrub se ve raro). Metáfora reutilizable: **comparar dos fuerzas** (expectativa vs. realidad). **Reduced-motion:** viga ya inclinada.

---

## 20. Anillos radiales de porcentaje

**Dónde:** diapositiva 10. SVG 200×200, círculo de pista `r = 80` + círculo de valor con `stroke-width: 16`, `stroke-linecap: round`, girado -90° para empezar arriba. Circunferencia `2π·80 = 502.65`; el valor se pinta con `stroke-dashoffset: calc(502.65px * (1 - var(--p)))` en 2,4 s `expo.out`, escalonados 0,2 s. El porcentaje del centro es un contador (§10) sincronizado con el mismo retraso.

```js
gsap.fromTo(arco, { drawSVG: "0%" }, { drawSVG: (i, el) => "0% " + el.dataset.p * 100 + "%", ease: "expo.out", duration: 2.4 });
// o sin plugin: con pathLength="1" → strokeDasharray: 1, strokeDashoffset: 1 → 1 - p
```
**Scroll:** scrub en grupo (anillo y número avanzan juntos con el mismo `onUpdate`). **Móvil:** 3 anillos en fila de 100 px o en columna. **Reduced-motion:** valores finales. Quitar el `drop-shadow` animado.

---

## 21. Waffle (10×10)

**Dónde:** diapositiva 10 ("18 de cada 100"). `grid-template-columns: repeat(10, 26px)`, 100 `span`; los `n` primeros tienen `.on` y un retraso `0.4 + i*0.08 s`; se encienden cambiando `background`, añadiendo un resplandor y `scale: 1.08`.

```js
gsap.fromTo(waf.querySelectorAll(".on"), { backgroundColor: "var(--celda)" },
  { backgroundColor: "var(--acento)", scale: 1.08, stagger: { each: 0.08, from: "start" },
    scrollTrigger: { trigger: waf, start: "top 75%", end: "top 35%", scrub: true } });
```
Variantes: `stagger: { grid: [10,10], from: "center" }` o `"random"`. Mejor animar `opacity` de una capa de color superpuesta que `background-color` (pintura), y el resplandor con un pseudo-elemento con opacidad en vez de `box-shadow`. **Accesibilidad:** `role="img"` + `aria-label="18 de cada 100"` en el contenedor. **Móvil:** celdas de 18–20 px.

---

## 22. Flujo de nodos con pulsos

**Dónde:** diapositiva 11 (A → B → C). Cada conector es una línea de 4 px con **3 pulsos** (círculos blancos con doble resplandor) que la recorren en 1,8 s lineales, desfasados 0,6 s, con fundido al entrar y salir (15 %/85 %). Los nodos "laten" con un halo (`box-shadow`) cada 4,5 s, desfasados 1,2 s, para que el latido parezca viajar por la cadena.

```css
@keyframes pk{0%{left:0;opacity:0}15%{opacity:1}85%{opacity:1}100%{left:100%;opacity:0}}
```
**Mejoras:** `left` provoca layout por frame; usar `transform: translateX()` con el ancho medido (`x: () => conn.offsetWidth`, `invalidateOnRefresh: true`). El halo con un pseudo-elemento que anima `opacity`/`scale` en lugar de `box-shadow`.

**Con scroll:** el pulso puede ir atado al scroll (avanza mientras se baja, `scrub`) y cada nodo se enciende cuando el pulso llega (`tl.to(nodoB, { "--on": 1 }, ">")`). Es la técnica más útil para contar **un proceso** (autoconocimiento → hoja de vida → entrevista → práctica). **Móvil:** flujo vertical (conectores verticales, `y` en lugar de `x`). **Reduced-motion:** conectores estáticos, nodos encendidos, sin bucle. Detener los bucles infinitos fuera de pantalla (`ScrollTrigger` con `toggleActions: "play pause resume pause"`).

---

## 23. Texto tachado que se reemplaza

**Dónde:** diapositiva 13. "La pregunta no es ~~si ChatGPT mejora el desempeño~~, sino **para quién**." Secuencia: a 1,4 s una barra de 8 px se dibuja sobre la frase (`::after` con `scaleX 0→1`, `transform-origin: left`, 0,9 s `power2.inOut`); a 2 s el texto tachado se apaga al 35 %; a 2,5 s la respuesta entra desde `scale 2.2, blur(30px), opacity 0` a su tamaño (1,3 s `expo.out`) — un "golpe" tipográfico.

**Fallo observado en la captura:** como el `span` tachado ocupa dos líneas, el `::after` absoluto de un elemento *inline* partido no cubre ambas líneas; en pantalla la barra casi no se ve. **Solución:** tachar con fondo, que sí respeta los saltos de línea:

```css
.tachar{ background: linear-gradient(currentColor, currentColor) 0 55% / 0% .12em no-repeat;
         -webkit-box-decoration-break: clone; box-decoration-break: clone; }
```
```js
gsap.timeline({ scrollTrigger: { trigger: frase, start: "top 70%", end: "top 30%", scrub: 0.5 } })
  .to(".tachar", { backgroundSize: "100% .12em", ease: "power2.inOut" })
  .to(".tachar", { color: "var(--texto-apagado)" }, "<0.3")
  .from(".respuesta", { scale: 2.2, autoAlpha: 0, filter: "blur(30px)", ease: "expo.out" }, "<0.3");
```
(Alternativa: `SplitText` en líneas y una barra por línea.) Excelente para una semana del tipo "creía que… / ahora sé que…". **Reduced-motion:** frase ya tachada y respuesta visible. **Contraste:** el texto tachado apagado sigue necesitando 4.5:1 si se debe leer; si no, `aria-hidden` y que la versión accesible diga la idea completa. Quitar el `blur(30px)` en móvil.

---

## 24. Chulos (✓) que se dibujan

**Dónde:** diapositiva 14. SVG 44×44: círculo `r = 19` y trazo `M13 23 L20 30 L32 15`, ambos con `pathLength="1"`. Primero el círculo (0,9 s, retraso 0,2 s), luego el chulo (0,6 s, retraso 0,7 s): **contorno → marca**. `stroke-linecap/linejoin: round`.

```js
gsap.timeline({ scrollTrigger: { trigger: li, start: "top 80%" } })
  .from(li.querySelector("circle"), { drawSVG: 0, duration: 0.9, ease: "power2.inOut" })
  .from(li.querySelector("path"), { drawSVG: 0, duration: 0.6, ease: "power3.out" }, "-=0.2")
  .from(li.querySelector(".texto"), { autoAlpha: 0, x: -20 }, "<");
```
Para listas: `ScrollTrigger.batch`. Los SVG son decorativos: `aria-hidden="true"`. **Reduced-motion:** dibujados. Coste nulo.

---

## 25. Otras técnicas útiles

- **Barra de progreso global** (`#prog`, 5 px arriba, `width` con 0,8 s): en scroll, `gsap.to(barra, { scaleX: 1, transformOrigin: "left", ease: "none", scrollTrigger: { trigger: "main", start: "top top", end: "bottom bottom", scrub: 0.3 } })`. Se puede **segmentar por semana** (una marca por sección).
- **Acento por sección:** cada diapositiva declara `data-accent` y `data-hue`; el canvas interpola su color (`* .04` por frame) y el fondo aplica `hue-rotate` en 1,6 s. En el sitio: `onEnter`/`onEnterBack` de cada sección → `gsap.to(":root", { "--acento": color })`. Evitar `filter: hue-rotate` en capas grandes (caro); cambiar variables.
- **Suelo de rejilla en perspectiva infinito:** dos `linear-gradient` de 2 px como rejilla de 90 px, `transform: perspective(520px) rotateX(74deg)`, máscara que lo desvanece hacia arriba y `background-position` animado 0 → 90 px en 2,6 s lineales (movimiento infinito sin costuras). Con scroll: `backgroundPosition` atado al progreso (avanzar = acercarse). Tono muy bajo (opacidad .14). Animar `background-position` repinta; para 60 fps, mover con `translateY` un elemento el doble de alto y envolver con `gsap.utils.wrap`.
- **Estado completo al retroceder:** al volver a una diapositiva se muestra completa (`go(n, true)`) en lugar de rehacer la animación. En scroll: `toggleActions: "play none none none"` + `once: true` para lo narrativo, y scrub solo para lo que tiene sentido revertir.
- **Limpieza centralizada:** todos los `setInterval`, `setTimeout` y rAF se guardan en arreglos y se cancelan al cambiar de escena. En GSAP: `gsap.context()` / `mm.add()` y `ctx.revert()`; los bucles propios se registran en `gsap.ticker` y se quitan en el `return` del `matchMedia`.
- **Navegación por hash** (`#5`) y teclas (flechas, Inicio/Fin, F pantalla completa, deslizar en táctil). En un sitio: anclas por semana (`#semana-3`) con `ScrollToPlugin`.

---

## 26. Rendimiento: resumen de riesgos del original y cómo evitarlos

| Problema en el original | Solución para el sitio |
|---|---|
| Dos canvas de pantalla completa animándose siempre (4690 partículas + 4005 comprobaciones de pares por frame) | Un solo canvas por escena, pausado fuera de la vista; `gsap.ticker`; DPR ≤ 2; menos partículas en móvil |
| `fillStyle`/`globalAlpha` por partícula | Agrupar por color y opacidad cuantizados |
| `filter: blur()` animado en palabras y textos grandes | Limitar a 1–2 titulares; en móvil solo `y`/`opacity` |
| `filter: blur(120px)` + `mix-blend-mode` + `backdrop-filter` en capas grandes | Degradados ya suaves sin `blur`; sin glassmorphism (además, no es nuestro look) |
| Animación de `width`, `left`, `box-shadow`, `background-color`, `background-position` | `scaleX`, `x`, `opacity` de pseudo-elementos, `clip-path` rectangular |
| `drop-shadow` en trazos SVG que se dibujan | Trazo duplicado translúcido o sin sombra |
| Bucles infinitos (pulsos, latidos, destellos, parpadeo) que nunca paran | `toggleActions: "play pause resume pause"` o `animation-play-state` según visibilidad |
| Muestreo de texto antes de cargar la fuente | `await document.fonts.ready` y volver a muestrear en `ScrollTrigger.refresh` si cambia el tamaño |

## 27. Lista de verificación al portar una técnica

1. Estado final en CSS/HTML (sin JS y con `prefers-reduced-motion: reduce` se ve y se lee todo).
2. Animación dentro de `gsap.matchMedia()` con condiciones `motion` y `desktop`; nada de `pin` en móvil.
3. ¿Scrub o disparo? Scrub si tiene sentido "recorrerla"; disparo si es un evento.
4. Solo `transform`/`opacity`/`clip-path` rectangular; canvas pausado fuera de la vista.
5. Texto real en el DOM para todo lo que esté en canvas o se anime carácter a carácter (`aria-hidden` en lo decorativo).
6. Colores, tipografía y acentos del sitio (no los del original); contraste ≥ 4.5:1 en el estado final.
7. Probar a 1440 px y 390 px con Playwright y revisar 60 fps en el panel de rendimiento.
