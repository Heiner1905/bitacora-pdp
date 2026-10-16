# Dirección creativa — FRAGMENTO.EXE (Fase 1)

> Fase 1 · dirección creativa. Dos direcciones listas para prototipar en paralelo (portada + transición a la SEMANA_01). Redactado el 16-oct-2026 a partir de BRIEF.md, CONTENIDO.md, REFERENCIAS.md y los tres informes de investigación.

## 0 · Reglas compartidas por las dos direcciones

**Para qué es este documento.** Dos constructores distintos van a levantar, en paralelo, un prototipo por dirección: **solo la portada y la transición hacia la SEMANA_01**. Heiner compara los dos en vivo y escoge (o mezcla) antes de construir el sitio completo. Todo lo que un constructor necesita decidir está aquí; si algo no está, se resuelve con el criterio de la sección y se anota en su entrega.

### 0.1 · No negociables (resumen de CLAUDE.md)

1. **Nada inventado.** Solo se usan los hechos de `docs/BRIEF.md` y `docs/CONTENIDO.md`. Lo que falte se escribe `[PENDIENTE: qué falta]` y se ve en pantalla dentro de un recuadro punteado sutil (ver 0.4).
2. **Contenido fuera del HTML.** En los prototipos, los textos viven en `js/datos.js` como `window.BITACORA = {...}` con la misma forma que `site/data/semanas.js` (ver 0.3). El HTML solo tiene la estructura y los contenedores.
3. **Sin build.** HTML + CSS + JS vanilla. Librerías por CDN con versión fija (lista verificada en el Anexo). Funciona abriendo `index.html` con `file://` y en Cloudflare Pages. Nada de `type="module"` con imports relativos (fallan en `file://` en Chrome); scripts clásicos con `defer`.
4. **Legible siempre.** Texto ≥ 4,5:1 (calculado en cada paleta); reflexión semanal a 60–75 caracteres por línea (`max-width` en `ch`).
5. **60 fps.** Solo se anima `transform`, `opacity` y, con medida, `clip-path`/`filter` en pocas piezas. Canvas 2D solo donde cuenta algo y siempre con el SVG/HTML real debajo.
6. **Accesible.** HTML semántico (`header`, `main`, `section`, `h1`/`h2`), foco visible, todo navegable con teclado, `aria-label` en el símbolo, texto real siempre en el DOM (el canvas y los `span` de animación van `aria-hidden`). `prefers-reduced-motion: reduce` → se muestra el **estado final** sin desplazamientos ni pines largos.
7. **Responsive real.** Desde 360 px sin scroll horizontal (`overflow-x: clip` en `html`, nunca `hidden` en `body` porque rompe `position: sticky`).
8. **Imprimible.** `@media print`: tamaño carta, fondo blanco, tinta negra, canvas y grano ocultos, el símbolo en su estado final, una semana por página (`break-before: page`).
9. **Español colombiano** impecable, primera persona en los textos de Heiner (los rótulos de interfaz pueden ser impersonales).
10. **Prohibido:** emojis, efecto Matrix, terminal verde sobre negro, degradados morados/azules, glassmorphism, íconos de librería decorativos, sombras suaves por todos lados, secciones que solo aparecen con fade-up, cualquier personaje, logo, frase o imagen de las obras del mood.

### 0.2 · Estructura de archivos de cada prototipo

```
site/lab/
  direccion-a/
    index.html          ← estructura; símbolo HR inline (copiado de site/assets/simbolo-hr.svg)
    css/estilos.css     ← tokens en :root + layout + @media print + reduced-motion
    js/datos.js         ← window.BITACORA mínimo (ver 0.3)
    js/principal.js     ← render desde datos + Lenis + GSAP
    js/<efecto>.js      ← un archivo por momento wow (p. ej. particulas.js, descifrado.js)
  direccion-b/
    (misma estructura, archivos propios; ninguno comparte CSS/JS con la otra dirección)
```

- Cada constructor toca **solo su carpeta**. Nadie edita `site/index.html`, `site/assets/` ni la carpeta de la otra dirección.
- El símbolo se pega **inline** desde `site/assets/simbolo-hr.svg` sin alterar su geometría (mismos `d`, `points`, `viewBox 0 0 400 400`, ids `#anillo`, `#ojo-sup`, `#ojo-inf`, `#iris`, `#pupila`, `#hr`, `#fragmento`, `#bits`). Se permite: cambiar `font-family` de `#hr` a la tipografía de la dirección (conservando texto, posición y tamaño), mover colores a variables CSS (`stroke: var(--...)`) y añadir clases. El `#fragmento` encaja exacto con `transform: translate(0,0)`; su reposo en portada es `translate(30,-30)`.
- Orden de scripts al final del `body`: `datos.js` → GSAP core → plugins → Lenis → efectos → `principal.js`, todos con `defer`.
- Los prototipos llevan `<meta name="robots" content="noindex">` (igual que el sitio actual).

### 0.3 · Datos mínimos (`js/datos.js`)

```js
window.BITACORA = {
  proyecto: "FRAGMENTO.EXE",
  proposito: "Registro semanal, en primera persona, de lo que trabajo en Proyecto de Desarrollo Personal I y de lo que reflexiono sobre ello.",
  autor: {
    nombre: "Heiner Danit Rincón Carrillo",
    nombreCorto: "Heiner Rincón",
    codigo: "A00402510",
    programa: "Ingeniería de Sistemas",
    semestre: "8.º semestre",
    materia: "Proyecto de Desarrollo Personal I",
    materiaCorta: "PDP I",
    periodo: "2026-2",
    rolObjetivo: "Analista de Seguridad Junior / práctica en ciberseguridad"
  },
  semanas: [
    {
      id: "semana-01", numero: 1,
      titulo: "Expectativas de la materia y de mi futuro laboral",
      estado: "pendiente",
      fecha: "[PENDIENTE: fecha]",
      reflexion: "[PENDIENTE: reflexión de la semana]",
      bloques: [
        { tipo: "lista", titulo: "Qué espero de la materia", items: ["[PENDIENTE]"] },
        { tipo: "texto", titulo: "Cómo me siento frente al futuro laboral", texto: "[PENDIENTE]" }
      ],
      giro: "[PENDIENTE: la frase clave de la semana]"
    }
    // Para probar el anillo y el contador, añadir las semanas 02–10 de CONTENIDO.md
    // solo con número, título y estado "pendiente" (todo lo demás [PENDIENTE]).
  ]
};
```

- **El propósito** es la única frase "de autor" de la portada y sale literal de CONTENIDO.md ("registro semanal, en primera persona, de lo trabajado en clase y de lo que Heiner reflexiona sobre ello"), pasada a primera persona. Si Heiner quiere otra, la cambia en el dato. Ninguna dirección escribe lemas, citas ni reflexiones por él. El lema "si lo quiero hacer, lo hago" **no** se pone en la portada sin su aprobación (es suyo, pero no pidió usarlo).
- Todo número de semanas, contador y avance del fragmento se calcula con `BITACORA.semanas.length`; nunca un 10 fijo en el código.

### 0.4 · El marcador `[PENDIENTE]` (común a las dos direcciones)

- Función `pintarTexto(el, valor)`: si `valor` empieza por `[PENDIENTE`, el elemento recibe la clase `.pendiente` y `data-pendiente="true"`.
- Estilo: `outline: 1px dashed var(--pendiente-borde); outline-offset: 6px; border-radius: 2px;` texto en el color secundario de la paleta, en la fuente de cuerpo, **sin** animación de descifrado ni efectos (un pendiente nunca se "revela": se ve tal cual es). `--pendiente-borde` tiene ≥ 3:1 contra el fondo (calculado en cada paleta).
- En impresión, el recuadro sigue visible (gris medio) para que Heiner los encuentre en el PDF.

### 0.5 · Convenciones técnicas comunes

- **Lenis + ScrollTrigger:** `lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);`. En `prefers-reduced-motion` no se instancia Lenis (scroll nativo).
- **Responsive y movimiento** con `gsap.matchMedia()` y tres condiciones: `(min-width: 900px) and (prefers-reduced-motion: no-preference)`, `(max-width: 899px) and (prefers-reduced-motion: no-preference)`, `(prefers-reduced-motion: reduce)`. Todo pin/scrub se crea dentro y se revierte solo.
- **Puntero:** efectos de cursor solo con `(hover: hover) and (pointer: fine)`. En táctil, nada depende del hover.
- **Fuentes:** `<link rel="preconnect">` + hoja CSS con `display=swap`; el JS que mide texto (SplitText) espera `document.fonts.ready`.
- **Canvas:** DPR acotado (`min(devicePixelRatio, 2)` escritorio, `1.5` móvil), pausa con `IntersectionObserver` y `visibilitychange`, `display: none` en impresión.
- **Sobre la librería anti-IA (design-taste-frontend):** sus reglas de casa prohíben mono, hairlines y numeración. Aquí el brief manda y las pide (`SEMANA_04`, retícula con nodos), así que se usan, pero **solo como información verdadera**: la mono solo lleva datos (código, periodo, número de semana, lecturas reales); las líneas solo marcan una retícula que de verdad ordena el contenido; la numeración existe porque las semanas son una secuencia real. Ninguna etiqueta decorativa encima de un título "porque sí".

## Dirección A · "Sala de observación"

### A1 · La apuesta y los primeros 5 segundos

**La apuesta.** La bitácora es una película que se proyecta para un solo espectador: el profesor entra a la sala, se apagan las luces, el símbolo se arma frente a él con miles de fragmentos y, al bajar, la cámara **entra por la cerradura del ojo** hacia la primera semana.

**Lo que el profesor debe sentir en 5 segundos.**
- 0–0,4 s: la pantalla está en penumbra con grano de película; aparece la ficha superior (FRAGMENTO.EXE, escena 00 de N).
- 0,4–2,4 s: miles de partículas-glifo vuelan desde la profundidad y se asientan formando el símbolo HR; el arco naranja se queda **fuera**, flotando. El nombre se revela en tipografía gigante.
- 2,4–5 s: el cursor se vuelve un ojo; el iris del símbolo lo sigue. Ya leyó quién es, qué materia, qué periodo y para qué es la página.

Sensación buscada: *"esto lo dirigió alguien; no es una plantilla"*. Intención (se ve el oficio), propósito (el propósito está escrito en grande, no escondido) y ganas (el sitio reacciona a él desde el primer segundo).

**Palabras de dirección:** penumbra, proyección, revelación, montaje, foco. **Lo que no es:** terror, neón, ciencia ficción, terminal.

### A2 · Paleta

Se oscurece la base del brief (`#141B23` → `#0D0F12`) para que la portada se lea como **sala de cine con las luces apagadas** y para que el corte a negro del GIRO tenga a dónde bajar. El marfil se calienta un poco hacia "luz de proyector". El azul pasa a ser solo del iris; el verde desaparece de la interfaz (queda únicamente dentro de `#bits`, porque el símbolo no se toca).

| Token | Hex | Uso | Contraste sobre `--sala` |
|---|---|---|---|
| `--sala` | `#0D0F12` | Fondo general (penumbra neutra fría, no negro puro) | — |
| `--butaca` | `#16191E` | Superficies elevadas: recuadro de la reflexión, menú | — |
| `--corte` | `#050506` | Solo el corte a negro del GIRO y el instante de la cerradura | — |
| `--proyeccion` | `#ECE5D3` | Texto principal, anillo, párpados, `#hr` | **15,28:1** (14,02 sobre butaca; 16,22 sobre corte) |
| `--plata` | `#B4AE9F` | Texto secundario: propósito largo, créditos, cuerpo de bloques | **8,68:1** (7,97 sobre butaca) |
| `--niebla` | `#8E8A80` | Metadatos menores (rol de crédito, contador) — nunca párrafos | **5,57:1** (5,12 sobre butaca) |
| `--fragmento` | `#F28C38` | El fragmento, la pupila, el estado activo, el foco de teclado | **7,84:1** |
| `--iris` | `#6A9EF8` | Iris (en el SVG se mantiene `#4F8EF7`); en interfaz solo para el cursor-ojo | **7,18:1** |
| `--hairline` | `rgba(236,229,211,.14)` ≈ `#2C2D2D` | Líneas de la ficha de créditos y del contador | (no es texto) |
| `--pendiente-borde` | `rgba(236,229,211,.40)` ≈ `#66655F` | Recuadro punteado de `[PENDIENTE]` | **3,28:1** (≥ 3:1 para elementos no textuales) |
| `--grano` | `#ECE5D3` a 5–7 % | Capa de grano | — |

**Corte invertido** (un solo uso, en el GIRO de cada semana tras el corte a negro, opcional): `--sala` sobre `--proyeccion` = 15,28:1. El naranja **nunca** va como texto sobre marfil (1,95:1).

**Proporciones:** 88 % sala, 10 % marfil, ≤ 2 % naranja. El naranja aparece solo en lo que es "Heiner como fragmento": el arco, la pupila, la semana activa, el foco. Si en una pantalla hay tres cosas naranjas, sobran dos.

**Prohibido en esta dirección:** degradados (la única excepción es la viñeta de bordes del proyector, un `radial-gradient` neutro de `transparent` a `rgba(5,5,6,.55)`, sin color), brillos/glows de color, tintes azules sobre el fondo.

### A3 · Tipografía

Tres voces, como en un afiche de cine: **título de película** (serif display hairline, gigante), **voz del autor** (serif de lectura) y **créditos técnicos** (mono condensada, diminuta, solo datos).

| Rol | Familia | Por qué |
|---|---|---|
| Display: nombre, número de escena, título de semana, GIRO | **Zodiak** (Indian Type Foundry, Fontshare, variable `wght` 100–900) | A 200–260 px y peso 100–200 se ve como título de cine de autor: trazos finos, contraste alto, nada de "sans tech". Tiene todas las tildes (verificado: Ó, Á, Ñ, ¿, ¡, º, ·, —). |
| Texto: propósito, reflexión, bloques | **Newsreader** (Production Type, Google Fonts, `opsz` 6–72, `wght` 300–600, con itálica) | Serif de lectura larga con tamaño óptico: se lee cómoda a 19–21 px y aguanta como "statement" a 30 px con `opsz` alto. Distinta de Zodiak en textura (más robusta). |
| Créditos y datos: `SEMANA_01`, código, contador, ficha | **Martian Mono** (Evil Martians, Google Fonts, variable `wdth` 75–112,5 y `wght` 100–800) | Con `wdth 75` parece la letra de los créditos de una claqueta; al ser variable, el descifrado puede **ensanchar** la etiqueta al resolverse. Solo para datos, nunca para frases. |

**Carga (verificado 200 el 16-oct-2026):**

```html
<link rel="preconnect" href="https://api.fontshare.com">
<link rel="preconnect" href="https://cdn.fontshare.com" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=zodiak@1&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..500&family=Martian+Mono:wdth,wght@75..112.5,300..500&display=swap">
```

- `zodiak@1` entrega la fuente **variable** (`font-weight: 100 900`). La hoja de Fontshare usa URLs `//cdn.fontshare.com/...` relativas al protocolo: funcionan porque se resuelven contra la URL `https://` de la hoja; el `href` del `<link>` **debe** escribirse con `https://` explícito (si no, falla en `file://`).
- Pilas de respaldo: `"Zodiak", "Times New Roman", serif` · `"Newsreader", Georgia, serif` · `"Martian Mono", ui-monospace, Menlo, monospace`.

**Escala (rem = 16 px):**

| Elemento | Fuente y ajustes | Tamaño | Tracking | Interlineado |
|---|---|---|---|---|
| Nombre "Heiner" / "Rincón" | Zodiak `wght 180` | escritorio `clamp(6rem, 1rem + 15.5vw, 16.5rem)` (≈ 239 px a 1440); móvil ≤ 599 px `24vw` (≈ 94 px a 390) | −0,045em | 0,82 |
| Número de escena ("01") | Zodiak `wght 100` | `clamp(11rem, 36vw, 32rem)` | −0,06em | 0,75 |
| Título de semana | Zodiak `wght 300` | `clamp(2.25rem, 1rem + 3.4vw, 4.25rem)` | −0,03em | 0,98 |
| GIRO | Zodiak `wght 300` | `clamp(2rem, 0.75rem + 4vw, 4.5rem)`; `max-width: 20ch` | −0,025em | 1,02 |
| Propósito (statement) | Newsreader `wght 300`, `opsz 36` | `clamp(1.375rem, 1rem + 0.9vw, 1.875rem)`; `max-width: 30ch` | −0,01em | 1,24 |
| Reflexión (cuerpo) | Newsreader `wght 400`, `font-optical-sizing: auto` | `clamp(1.125rem, 1rem + 0.3vw, 1.3125rem)`; `max-width: 64ch` (≈ 66 caracteres reales) | 0 | 1,62 |
| Valor de crédito (nombre completo, programa…) | Newsreader `wght 400` | `1.0625rem` | 0 | 1,35 |
| Rol de crédito, `SEMANA_01`, contador | Martian Mono `wdth 75`, `wght 420`, `text-transform: uppercase` | `0.75rem` (12 px; nunca menos de 11 px) | 0,06em | 1,3 |

**Microtipografía obligatoria:**
- `font-kerning: normal; text-rendering: optimizeLegibility;` en display; `text-wrap: balance` en títulos y GIRO, `text-wrap: pretty` en la reflexión; `hanging-punctuation: first` (Safari) en la reflexión.
- Comillas latinas o tipográficas «…» / “…”, nunca rectas. Raya — con espacios finos, nunca guion. "8.º" con el ordinal correcto (º, U+00BA) y punto.
- En la ficha de créditos, las cifras van en Martian Mono (monoespaciada, no bailan). En Newsreader, las cifras dentro de texto usan `font-variant-numeric: oldstyle-nums proportional-nums` (más cinematográficas).
- La línea de lectura de 64ch se mide con la fuente cargada; si queda en más de 75 caracteres reales, bajar a 60ch.

### A4 · Layout de la portada (1440 / 390)

**Concepto de composición:** un afiche de cine leído en pantalla ancha. El nombre es el título de la película, partido en dos líneas escalonadas; el símbolo es la "imagen" de la película y vive arriba a la derecha con su fragmento escapándose hacia el borde; abajo, un **bloque de créditos** (el *billing block* de los afiches) con los datos académicos. Todo alineado a la izquierda, asimétrico, sin nada centrado.

**Retícula escritorio:** 12 columnas, margen lateral 40 px, medianil 24 px (a 1440: columna ≈ 91,3 px). Portada `min-height: 100svh`, en una sola pantalla a 1440×900.

```
1440 × 900
x:40                                                                         x:1400
┌──────────────────────────────────────────────────────────────────────────────┐
│ FRAGMENTO.EXE            Bitácora · PDP I · 2026-2              ESCENA 00/10  │ y 28  (Martian 12px)
│                                                       ┌────────────────────┐ │
│                                                       │        ╭──╮  ◜frag │ │ símbolo: col 9–12
│ Heiner                                                │      ╭─────╮       │ │ caja 437×437, top 88
│ (Zodiak 180, 239px, col 1)                            │      │ (◉) │       │ │
│                                                       │      ╰─────╯ HR    │ │
│        Rincón                                         └────────────────────┘ │
│        (col 2 → termina ≈ x 872, nunca bajo el símbolo)                       │ baseline ≈ y 560
│                                                                              │
│ Registro semanal, en primera     ─────────────────────────────────────────── │ hairline col 5–12, y 748
│ persona, de lo que trabajo en    AUTOR          CÓDIGO     PROGRAMA     MATERIA│ Martian 12px niebla
│ Proyecto de Desarrollo Personal  Heiner Danit   A00402510  Ingeniería   Proyecto de│ Newsreader 17px
│ I y de lo que reflexiono…        Rincón Carrillo           de Sistemas  Desarrollo │
│ (col 1–4, Newsreader 26px)                                 8.º semestre Personal I │
│                                                                         2026-2     │
│ Desliza para entrar ▁▁▁▁▁▁▁                                                   │ y 860
└──────────────────────────────────────────────────────────────────────────────┘
```

Medidas exactas (1440 × 900):

| Zona | Columnas / posición | Contenido | Notas |
|---|---|---|---|
| Ficha superior | fila a 28 px del borde; izq. col 1, centro col 5, der. col 12 alineado a la derecha | `FRAGMENTO.EXE` · `Bitácora · PDP I · 2026-2` · `Escena 00 / N` | Martian 12 px. "Escena 00" = la portada; N = `semanas.length`. Se vuelve la claqueta fija, el hilo persistente (ver A5). |
| "Heiner" | col 1, línea base ≈ y 330 | Zodiak 180, ≈ 239 px | Ancho ≈ 745 px: termina antes de la col 8. |
| "Rincón" | col 2 (x ≈ 155), línea base ≈ y 560 | ídem | Escalonado hacia la derecha: el ojo lee "Heiner → Rincón" como un travelling. Debe terminar antes de x 940. |
| Símbolo HR | col 9–12 (x 963–1400), `top: 88px`, 437 × 437 | SVG inline + canvas de partículas encima | El `#fragmento` en `translate(30,-30)` asoma hacia la esquina superior derecha; las partículas pueden salirse de la caja (canvas a pantalla completa, ver A7). |
| Propósito | col 1–4, top ≈ y 640 | `BITACORA.proposito` en Newsreader 300, 26 px | 3–4 líneas, `max-width: 30ch`. Color `--plata`. |
| Bloque de créditos | col 5–12, de y 748 a y 860; 4 celdas de 2 columnas | Autor / Código / Programa / Materia (+ periodo dentro de "Materia" y semestre dentro de "Programa") | Una sola hairline encima (`--hairline`). Rol: Martian 12 px `--niebla`; valor: Newsreader 17 px `--proyeccion`. Celdas alineadas a la izquierda; las alturas de las líneas base de los valores coinciden. |
| Indicación de scroll | col 1, y 860 | "Desliza para entrar" + barra de 120 × 1 px que se llena con el progreso del pin | Martian 12 px. Con reduced-motion: "Bajar a la semana 01" como enlace ancla (`#semana-01`). |

**Semántica:** `<header class="portada">` con `<h1>` = las dos líneas del nombre + `<span class="sr-only">, bitácora de Proyecto de Desarrollo Personal I</span>`; el bloque de créditos es una `<dl>`; el símbolo, `role="img"` con su `aria-label`.

**Móvil (390 × 844):** retícula de 4 columnas, margen 16 px, medianil 12 px. Es otra composición, no la de escritorio encogida: el símbolo **encabeza** como imagen del afiche y el nombre va debajo, enorme.

```
390 × 844
┌────────────────────────────────────┐
│ FRAGMENTO.EXE        ESCENA 00/10  │ y 16 (Martian 11px)
│                ┌─────────────────┐ │
│                │   ╭──╮   ◜frag   │ │ símbolo 74vw (≈289px), alineado a la derecha
│                │  ╭────╮         │ │ (margen der. 24px para que asome el fragmento)
│                │  │(◉)│         │ │ top 56
│                │  ╰────╯ HR      │ │
│                └─────────────────┘ │
│ Heiner                             │ Zodiak 24vw ≈ 94px, línea base ≈ y 420
│     Rincón                         │ sangría 12vw, línea base ≈ y 500
│                                    │
│ Registro semanal, en primera       │ Newsreader 300, 20px, col 1–4
│ persona, de lo que trabajo en…     │
│ ─────────────────────────────────  │
│ AUTOR              CÓDIGO          │ <dl> en 2 × 2
│ Heiner Danit       A00402510       │ rol 11px, valor 16px
│ Rincón Carrillo                    │
│ PROGRAMA           MATERIA         │
│ Ingeniería de      Proyecto de     │
│ Sistemas · 8.º s.  Desarrollo P. I │
│                    2026-2          │
└────────────────────────────────────┘
```

- En 390 la primera pantalla muestra símbolo, nombre y el inicio del propósito; los créditos empiezan dentro del primer viewport (≈ y 640) y terminan justo debajo. Se permite que la portada mida más de 100svh en móvil.
- Entre 600 y 899 px (tableta): el esquema de escritorio con 8 columnas; símbolo en col 5–8, créditos en 2 × 2 debajo del propósito.
- Comprobar con Playwright que "Rincón" nunca desborda (360 px incluido): si desborda, bajar el `vw` del nombre, nunca el tracking.

### A5 · Transición portada → SEMANA_01

**La idea:** se abre el telón (las dos líneas del nombre se separan como cortinas), el ojo se despierta, y la cámara **entra por la cerradura de la pupila**. A través de la cerradura ya se alcanza a ver la semana 01: literalmente, *ver lo que otros no ven*. Corte. Escena 01.

**Elemento persistente (no se anima con la portada):** la ficha superior se vuelve una barra fija `<nav class="claqueta">` (posición `fixed`, `z-index` alto, fondo transparente): `FRAGMENTO.EXE` a la izquierda y, a la derecha, un **mini-símbolo** de 28 px (solo `#anillo` + `#fragmento`, sin ojo) seguido de `Escena 00 / N`. Al llegar a la semana k, el contador pasa a `0k` (ScrambleText solo en los dígitos, 0,5 s) y el fragmento del mini-símbolo avanza a `translate(30·(1−k/N), −30·(1−k/N))` con `power3.out` 0,9 s. En la portada solo se desvanece el texto central "Bitácora · PDP I · 2026-2".

**Estructura DOM y truco del escenario (sin reordenar la semántica):**

```html
<nav class="claqueta">…</nav>
<main>
  <header class="portada" id="portada">…símbolo, nombre, propósito, créditos…
    <svg class="cerradura" aria-hidden="true"><!-- máscara a pantalla completa --></svg>
  </header>
  <section class="semana" id="semana-01" aria-labelledby="s01-titulo">
    <div class="semana__cabecera">…</div>   <!-- 100svh -->
    <div class="semana__cuerpo">…</div>
  </section>
</main>
```

- `#portada` se pinea con `pinSpacing: false`, `start: "top top"`, `end: "+=150%"` (móvil `+=110%`).
- `#semana-01` lleva `margin-top: 50svh` (móvil `10svh`) para que su `top` llegue exactamente a 0 cuando termina el pin.
- Mientras dura el pin, `.semana__cabecera` recibe una **contra-traslación** `y: "-150vh" → 0` (móvil `-110vh → 0`) con `ease: "none"` y `scrub: true`: así queda **quieta detrás** de la portada y se ve a través de la cerradura. Todo el pin usa `scrub: true` (1:1; la suavidad la da Lenis) para que la contra-traslación nunca se desincronice.
- La portada tiene fondo `--sala` opaco **solo hasta la fase 3**; desde ahí el fondo lo pone la máscara de la cerradura.

**Máscara de la cerradura (`svg.cerradura`, `position: absolute; inset: 0`):**

```html
<svg class="cerradura" viewBox="0 0 W H" preserveAspectRatio="none">
  <defs><mask id="m-llave">
    <rect width="100%" height="100%" fill="#fff"/>
    <g id="llave"><!-- misma forma que #pupila: circle r=8 + polygon --></g>   <!-- fill #000 -->
  </mask></defs>
  <rect width="100%" height="100%" fill="var(--sala)" mask="url(#m-llave)"/>
  <g id="llave-borde"><!-- la misma forma, fill none, stroke var(--fragmento), vector-effect: non-scaling-stroke, stroke-width 2 --></g>
</svg>
```

Al iniciar la fase 3, JS mide `#pupila.getBoundingClientRect()` y coloca `#llave` y `#llave-borde` exactamente sobre la pupila real (mismo centro y escala). Desde ahí se escalan con el mismo factor que el símbolo. El borde naranja de 2 px que no escala es la "luz que se cuela por la cerradura".

**Línea de tiempo del pin (escritorio; unidades de la timeline = 10, `scrub: true`):**

| Pos. | Duración | Qué pasa | Ease |
|---|---|---|---|
| 0 | 2 | **Telón.** "Heiner" `x: "-18vw", autoAlpha: 0`; "Rincón" `x: "18vw", autoAlpha: 0`. Propósito, créditos, texto central de la claqueta e indicación de scroll: `y: 16, autoAlpha: 0`, `stagger: 0.15`. El grano sube de 0,05 a 0,08 de opacidad. | `power2.in` |
| 1,5 | 2,5 | **El ojo despierta.** El contenedor del símbolo viaja al centro del viewport y `scale: 1 → 1.35`. `#ojo-sup` y `#ojo-inf` `scaleY: 1 → 1.18` (`transform-origin: 200px 196px`, `transform-box: view-box`): los párpados se abren. `#fragmento` `x: 30 → 90, y: -30 → -90, autoAlpha: 0` (sale de cuadro: todavía no es su momento; reaparece en la claqueta). | `power3.inOut` |
| 4 | 4,5 | **Entrar por la cerradura.** Símbolo `scale: 1.35 → 38` con `transform-origin` en el centro de `#pupila` (≈ 200, 201 del viewBox). `#llave`/`#llave-borde`, el mismo factor. En la pos. 4,3 el relleno naranja de `#pupila` pasa a `opacity: 0` en 0,3 (el agujero ya muestra la semana 01). `.semana__cabecera` `scale: 1.12 → 1` (profundidad: la cámara avanza y el fondo "llega"). | `power3.in` para el símbolo (la cámara acelera); `power2.out` para la cabecera |
| 8,5 | 0,2 | **Corte.** Un `div.corte` a pantalla completa (`--corte`) `autoAlpha: 0 → 1`. | `none` |
| 8,7 | 0,3 | `div.corte` `autoAlpha: 1 → 0`; `svg.cerradura` `autoAlpha: 0` (ya cubre más que el viewport). | `none` |
| 9 | 1 | Reposo: la cabecera queda quieta a pantalla completa. Margen para que el usuario sienta la llegada. | — |

**Al terminar el pin (`onLeave`, una sola vez por carga, no scrub):**
1. `SEMANA_01` (Martian, `--fragmento`): ScrambleText `{ text: "SEMANA_01", chars: "01<>/#_", speed: 0.6, revealDelay: 0.15 }`, 0,8 s.
2. Título: SplitText `type: "lines", mask: "lines"`; `yPercent: 105 → 0`, `duration: 1.1`, `stagger: 0.09`, `ease: "expo.out"`, empieza 0,15 s después.
3. Número "01": `clip-path: inset(0 100% 0 0) → inset(0 0% 0 0)`, 1,2 s, `expo.inOut` (se "proyecta" de izquierda a derecha).
4. Fila de datos y reflexión: **sin animación de entrada** (ya están visibles desde que se ven por la cerradura; nada de fade-up).
5. Claqueta: contador `00 → 01` y avance del mini-fragmento.

En `onEnterBack` (volver a la portada) no se repite el descifrado; los estados quedan resueltos.

**Cómo se ve la cabecera de la semana 01 al llegar (1440 × 900):**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ FRAGMENTO.EXE                                              ◜○ ESCENA 01/10   │ claqueta fija
│                                                                              │
│                                    SEMANA_01                                 │ col 7, y 180, Martian 12px naranja
│                                    Expectativas de la materia                │ Zodiak 300, ≈ 60px, col 7–12
│                                    y de mi futuro laboral                    │ (2 líneas, balance)
│                                                                              │
│                                    FECHA  ┆[PENDIENTE: fecha]┆  ESTADO Pendiente│ <dl> en línea, Martian + Newsreader
│                                                                              │
│                                    ┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐        │ reflexión: col 7–12, max 64ch
│  ██████    ███                     ┆ [PENDIENTE: reflexión de la semana] ┆        │ recuadro punteado --pendiente-borde
│ ██    ██  ████                     └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘        │ Newsreader 20px --plata
│ ██    ██    ██                                                               │
│  ██████   ██████   ← "01" Zodiak 100, ≈ 36vw, col 1–6, sangra 0,06em por la izquierda,
└──────────────────────── línea base a 40px del borde inferior ────────────────┘
```

- El número "01" es el "plano" de la escena: gigante, finísimo, en `--proyeccion`, recortado por el borde izquierdo. Es `aria-hidden` (el número ya está en `SEMANA_01` y en el `<h2>`).
- `<h2 id="s01-titulo">` = el título completo. `SEMANA_01` es un `<p class="semana__clave">` encima, porque el número de semana es un dato real de secuencia.
- La reflexión `[PENDIENTE: reflexión de la semana]` se pinta con `.pendiente` (0.4): recuadro `1px dashed` a 6 px, texto `--plata`, sin animación.
- Debajo de la cabecera arranca `.semana__cuerpo` con los bloques (lista "Qué espero de la materia" y texto "Cómo me siento frente al futuro laboral", ambos `[PENDIENTE]`) y luego el GIRO (A7, momento 3). Eso queda fuera del alcance del prototipo, salvo el GIRO si sobra tiempo.

**Móvil (390):** misma secuencia, `end: "+=110%"`, telón en vertical ("Heiner" sube `y: "-12vh"`, "Rincón" baja `y: "12vh"`), zoom `scale → 26`, sin contra-escala de la cabecera. Cabecera: "01" a 58vw arriba a la izquierda (recortado), debajo `SEMANA_01`, título a 36 px en 3 líneas, datos en dos filas y la reflexión a ancho completo (16 px de margen).

**Reduced motion:** no hay pin, ni telón, ni máscara. La portada se ve completa y quieta; se baja con scroll nativo a la semana 01, cuya cabecera está en su estado final (texto resuelto, "01" visible). La claqueta muestra el contador real según la sección visible (IntersectionObserver), con cambio instantáneo.

### A6 · Sistema de motion

**Librerías (todas verificadas con 200, ver Anexo):**

```html
<script defer src="js/datos.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrambleTextPlugin.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/CustomEase.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js"></script>
<script defer src="js/particulas.js"></script>
<script defer src="js/descifrado.js"></script>
<script defer src="js/cursor-ojo.js"></script>
<script defer src="js/principal.js"></script>
```
Más `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.css">`. Registro: `gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase)`. Sin Three.js: el canvas 2D basta.

**Lenis:** `new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true })` (pesado, "dolly" de cámara). En táctil Lenis no suaviza (`syncTouch: false`): el pulgar manda.

**Eases de la dirección (nombres a registrar):**
- `CustomEase.create("proyector", "M0,0 C0.62,0 0.12,1 1,1")`: entradas lentas que frenan como un foco que se ajusta. Para revelados con tiempo (no scrub).
- `"expo.out"`: líneas de texto y número de escena.
- `"power3.in"`: empujes de cámara (zoom).
- `"none"`: todo lo que va con scrub 1:1.
- Cortes: sin ease (cambios de 0,2 unidades de timeline o `gsap.set`).

**Duraciones:** micro (cursor, foco) 0,25 s · revelado de etiqueta 0,8 s · revelado de título 1,1 s · ensamblaje del símbolo 2,0 s · descifrado del GIRO 1,2–1,4 s. Nada con tiempo dura más de 2,2 s.

**Qué se anima (y qué no):**
- Sí: `transform` y `opacity` de símbolo, nombre, cabeceras; `clip-path: inset()` del número de escena; el canvas de partículas; clases CSS del descifrado (sin reflow, el glifo no cambia de ancho); `scaleY` de los párpados; la máscara SVG de la cerradura (una sola forma).
- No: el cuerpo de la reflexión (nunca se mueve ni se descifra), colores de fondo animados, `filter: blur` en más de 8 elementos, `box-shadow`, `width/height/top/left`.
- **Grano:** una baldosa de ruido de 200 × 200 px generada **una vez** al cargar en un canvas (valores aleatorios en gris, alfa 0–40) y convertida con `toDataURL()`; se aplica en `body::after` (`position: fixed; inset: -50%; pointer-events: none; opacity: .05; background-repeat`) y se desplaza con `@keyframes` en `steps(8)` a 10 fps (`transform: translate(...)`). Sin `mix-blend-mode` (caro a pantalla completa). Oculto en impresión y en reduced-motion queda estático.
- **Viñeta:** `body::before` con el `radial-gradient` neutro de A2, fija, estática.

**Reduced motion (`prefers-reduced-motion: reduce`), estado final:**
- Sin Lenis, sin pin, sin canvas de partículas, sin cursor personalizado, grano estático.
- El símbolo SVG aparece completo, con `#fragmento` en `translate(30,-30)` (reposo de portada), con un `opacity` 0 → 1 de 200 ms como máximo.
- `SEMANA_01`, títulos y GIRO se pintan resueltos; el número de escena sin recorte.
- Todo el contenido es alcanzable y legible sin JS (el HTML trae un `<noscript>` que muestra el bloque de créditos si los datos no se pintaran; recomendado: pintar portada y cabecera también como HTML de respaldo dentro de `<noscript>`).

**Móvil y táctil (sin hover):**
- Partículas: paso de muestreo 6 px (≈ 1 000 puntos), DPR 1,5, sin repulsión por cursor; en su lugar, **un toque sobre el símbolo** dispersa las partículas cercanas al dedo (radio 60 px) y vuelven en 0,9 s.
- Sin cursor-ojo; el iris del símbolo hace un barrido lento una vez al terminar el ensamblaje (mira a izquierda y derecha, 1,6 s) para que se entienda que "observa".
- Pin más corto (`+=110%`), zoom a 26×, telón vertical (A5).
- Objetivos táctiles ≥ 44 × 44 px (enlace "Bajar a la semana 01", controles).

### A7 · Momentos wow

Cuatro momentos; cada uno cuenta una capa del concepto. **El que alguien querría mostrarle a otra persona es el 2: entrar por la cerradura.**

**1 · El símbolo se arma desde la profundidad (carga de la portada).**
- *Qué ve el usuario:* en penumbra, ≈ 2 500 partículas vienen desde el fondo de la sala. Las lejanas llegan pequeñas y tenues; las cercanas, nítidas (profundidad de campo falsa, como Prødux). En vuelo cada partícula es un **glifo diminuto** (`0 1 / < > # ·` y los tres `#bits`: hexágono, cuadrado, triángulo); al asentarse se vuelve un punto de 2 px. La onda de asentamiento **sale de la pupila-cerradura** hacia afuera. Las partículas del arco naranja se ensamblan **lejos**, en `translate(30,-30)`, y se quedan flotando (oscilación de ±1,5 px, 4 s). Con el cursor cerca, las partículas se apartan (radio 80 px) y vuelven.
- *Cómo:* canvas 2D sobre el SVG, receta completa de `investigacion-3-particulas.md` (muestreo por parte a 4 px, `Float32Array`, resorte `0.08/0.82`, atlas de glifos pre-renderizado, pintura por lotes de color, tope 3 000). Cada partícula tiene `z ∈ [0,1]`: tamaño `1 + z·1.5`, alfa `0.35 + z·0.65`; en lugar de `filter: blur`, las de `z < 0.3` se pintan con un sprite difuso pre-renderizado. Al 98 % asentado: crossfade de 400 ms al SVG nítido y se detiene el `requestAnimationFrame`; se reactiva solo si el cursor entra a la caja del símbolo.
- *Coste:* medio. Una pasada de muestreo (≈ 30 ms al cargar) y 2,2 s de animación; luego cero.
- *Qué cuenta:* **los fragmentos que vuelven al todo** y **ensamblar = descifrar** (los glifos se resuelven en forma). Que el arco naranja se quede afuera es el planteamiento de toda la película: falta una pieza, y es él.

**2 · Entrar por la cerradura (transición a la semana 01). EL MOMENTO.**
- *Qué ve el usuario:* el nombre se abre como un telón, el ojo del símbolo se despierta (párpados que se abren), la cámara empuja hacia la pupila y, por el hueco con forma de cerradura, ya se ve la semana 01 esperando; el borde de la cerradura brilla con una línea naranja. Corte a negro de un instante. Escena 01.
- *Cómo:* pin con scrub (A5): `transform: scale` del SVG con origen en `#pupila`, una máscara SVG con la misma forma escalada al mismo ritmo y una contra-traslación de la cabecera. Sin canvas.
- *Coste:* bajo-medio (una máscara SVG repintada durante ≈ 1 viewport de scroll; probar a 60 fps en el portátil de referencia; si cae, reemplazar la máscara por `clip-path: circle()` en la cabecera durante la última mitad).
- *Qué cuenta:* **el observador** (metacognición: mirar hacia adentro, literalmente entrar en el ojo) y **los trucos bajo la manga** (la cerradura es la pupila: la seguridad es el modo de ver). Es la frase "ver lo que otros no ven" hecha movimiento. Es lo que el profesor recordará y lo que Heiner querrá mostrar en LinkedIn.

**3 · El GIRO: corte a negro y frase que se descifra (cierre de cada semana).**
- *Qué ve el usuario:* al llegar al final de la semana, la pantalla **corta a `--corte`** (sin fundido, un corte de montaje); en el centro-izquierda aparece la palabra `GIRO` en Martian y, debajo, la frase de la semana en Zodiak grande. Cada letra ya es la correcta pero pasa por estados (invertida marfil/negro, acento naranja, borde azul, contorno) en un frente que barre de izquierda a derecha, 1,2 s, y queda limpia. Mientras la frase está en pantalla, el cursor-ojo se vuelve una cerradura.
- *Cómo:* patrón de 2xA (`investigacion-3-particulas.md` §3): `.char` con 6 clases CSS, `setInterval` a 24 fps, solo `className`. Disparo único con ScrollTrigger (`start: "top 60%"`, `once: true`). La sección del GIRO es `min-height: 100svh`, pineada 60 % de viewport para que el corte se sienta. `aria-label` con el texto final; spans `aria-hidden`.
- *Coste:* muy bajo.
- *Qué cuenta:* **el plot twist** (cine de revelación: cada semana termina con su giro) y **lo oculto que aparece** (cifrado → claro, sin Matrix: el glifo correcto siempre está). En el prototipo, el GIRO de la semana 01 es `[PENDIENTE]`: se muestra como pendiente **sin** descifrar; para probar el efecto se usa la etiqueta `GIRO` y, en una página de prueba aparte (`?demo-giro`), una frase de muestra marcada claramente como muestra, nunca publicada.

**4 · El cursor es un ojo, y el símbolo lo mira de vuelta.**
- *Qué ve el usuario:* el cursor es un pequeño ojo de 28 px (dos arcos marfil y un punto naranja) que se estira en la dirección del movimiento; sobre el símbolo, el ojo-cursor se cierra a un punto y **el iris y la pupila del símbolo siguen al cursor** (máx. 10 px de desplazamiento dentro del ojo). Sobre enlaces se abre del todo. Sobre el GIRO, se vuelve cerradura.
- *Cómo:* un `div` con SVG inline, `gsap.quickTo` para `x/y` (0,25 s, `power3`), `scaleX` según la velocidad (`clamp(1, 1.4)`); `#iris` y `#pupila` con `quickTo` hacia el vector cursor-centro normalizado. Solo `(hover: hover) and (pointer: fine)`; el cursor nativo se oculta con `cursor: none` solo cuando el script cargó; los controles mantienen foco visible para teclado.
- *Coste:* mínimo.
- *Qué cuenta:* **metacognición**: el que observa también es observado; el profesor siente que la página "lo ve", que hay alguien detrás.

**Descartados por no contar nada:** parallax de fondo genérico, marquesinas, contadores animados sin dato real, hover en tarjetas, grano exagerado o "VHS".

### A8 · Uso del símbolo HR

- **Forma intocable:** se pega inline el contenido de `site/assets/simbolo-hr.svg`. Solo cambian: colores a variables (`#anillo`, `#ojo-*`, `#hr` → `var(--proyeccion)`; `#pupila` y el arco → `var(--fragmento)`; `#iris` conserva `#4F8EF7`; `#bits` conserva sus colores) y `font-family` de `#hr` → `"Zodiak", serif` con `font-weight: 500` (mismo texto, `x`, `y`, tamaño y `letter-spacing`). Verificar en captura que "HR" no se desplace respecto del original; si Zodiak cambia mucho el ancho, ajustar solo `letter-spacing` (nunca `x`/`y`).
- **En portada:** el SVG es la "fuente de verdad" (accesible, imprimible) y el canvas de partículas lo dibuja encima mientras se arma. `#fragmento` en `translate(30,-30)` con una flotación de ±1,5 px (`yoyo`, 4 s, `sine.inOut`).
- **Partes con papel propio:**
  - `#pupila`: origen de la onda de ensamblaje, centro del zoom y forma de la máscara de la cerradura.
  - `#ojo-sup`/`#ojo-inf`: se abren (`scaleY 1.18`) cuando "despierta" en la transición.
  - `#iris` + `#pupila`: siguen al cursor (máx. 10 px), y en móvil hacen un barrido único.
  - `#fragmento` + `#bits`: salen de cuadro en la transición y continúan como mini-símbolo en la claqueta; su distancia al encaje es el progreso real (`1 − k/N`). En el cierre del sitio (fuera del prototipo) encajan en `translate(0,0)` con un destello marfil de 300 ms.
  - `#hr`: no se anima por separado (es la firma; se queda quieta).
- **Mini-símbolo de la claqueta:** un segundo SVG de 28 px que reutiliza solo `#anillo` y el arco de `#fragmento` (ids con prefijo `mini-` para no duplicar ids). Sin ojo: a ese tamaño no se lee.
- **Impresión:** el símbolo en marfil se cambia a tinta negra (`--proyeccion` → `#111` en `@media print`) con la pupila y el arco en naranja; el fragmento en `translate(30,-30)`.

### A9 · Riesgos de "plantilla" y detalles de oficio

| Riesgo | Por qué se lee "plantilla/IA" | Cómo se evita aquí |
|---|---|---|
| "Fondo casi negro + un acento brillante" | Es el look oscuro por defecto de los generadores. | El negro tiene razón narrativa (sala apagada, corte a negro) y el acento no es decoración: el naranja **es** el fragmento. Máx. 2 % de la pantalla; si aparece en botones o subrayados genéricos, se quita. |
| Serif display gigante "editorial" | Muy usada en portafolios recientes. | Peso 180 (casi hairline) a 240 px y el escalonado "Heiner → Rincón" como travelling; el nombre además **actúa** (se abre como telón). No se pone ninguna palabra en itálica ni en otro color. |
| Etiquetas mono en mayúsculas por todas partes | Señal de "estética tech" prefabricada. | Mono solo en datos verdaderos (código, periodo, número de escena, rol de crédito) y siempre como **créditos de cine** (condensada `wdth 75`, 12 px). Ninguna etiqueta encima de un título excepto `SEMANA_0X`, que es dato de secuencia. Prohibido "→" pegado a enlaces. |
| Partículas genéricas "de fondo" | Fondo de partículas = plantilla de 2015. | Las partículas **son** el símbolo y desaparecen cuando se arma. No hay partículas en ningún otro lugar. |
| Grano que ensucia | Ruido decorativo, efecto "VHS". | 5 % de opacidad, 10 fps, desaparece en impresión; nunca sobre la reflexión con más de 6 %. |
| Todo aparece con fade-up | La animación por defecto. | Cada escena tiene una sola idea pineada; los textos largos **no** tienen entrada; los títulos usan máscara de línea y la etiqueta usa descifrado. |
| Cursor personalizado como truco | Cursores que solo "se ven cool". | El cursor es el ojo del símbolo y el símbolo lo mira de vuelta: tiene significado y se apaga en táctil. |

**Detalles de oficio (checklist del constructor):**
- Hairlines de 1 px reales: `border-top: 1px solid var(--hairline)`; en pantallas de DPR 2, `0.5px` solo si se ve más fino en la captura.
- Martian Mono con `font-variation-settings: "wdth" 75` y `font-feature-settings: "zero" 0` (el cero sin barra se lee más cine que código); el código `A00402510` en Martian con `letter-spacing: .04em`.
- Alinear las líneas base del bloque de créditos (todas las celdas con la misma altura de rol: `min-height: 1lh`).
- Ópticamente, el nombre sangra a la izquierda: `margin-left: -0.04em` en "Heiner" para que el asta de la H se alinee con el margen de 40 px (compensa el *side bearing*).
- `text-wrap: balance` en títulos; ningún título deja una palabra huérfana.
- `::selection` en `--fragmento` con texto `--sala` (7,84:1).
- Foco de teclado: `outline: 2px solid var(--fragmento); outline-offset: 4px` (sin `outline: none` en ningún lado).
- El contador de la claqueta en dos dígitos con cero (`String(k).padStart(2,"0")`) y N real.
- Ningún borde redondeado salvo el recuadro de pendiente (2 px). Ninguna sombra.
- `<title>`: "FRAGMENTO.EXE · Heiner Rincón" (sin "explainer"); favicon: el símbolo.

### A10 · Referencias usadas

| Referencia | Qué se toma | Qué no |
|---|---|---|
| **Prødux Design** (`1-produx-scroll*.png`) | Fragmentos que llegan desde la profundidad con tamaño/nitidez por distancia; composición "palabra gigante + frase + ficha". | La imagen de musgo, el blur en decenas de elementos, el chiste de cookies con frase de obra con derechos. |
| **2xA Studio** (`3-2xa.png`) | Descifrado por **estados tipográficos** sobre el glifo correcto (el GIRO); el grano sutil. | Su mono condensada gris diminuta (no da contraste); aplicarlo a párrafos. |
| **Revelatio Studio** (`1-revelatio-scroll.png`) | La idea de revelación como estructura, el negro dominante, el corte de montaje (aquí: corte a `--corte` en vez de inversión total); para el índice futuro, la lista donde solo se enciende la semana activa (en naranja). | La curvatura CRT, texto real al 15 %. |
| **Igloo Inc.** (`2-igloo*.png`) | Partículas que son glifos y se resuelven en onda desde un centro (aquí, desde la pupila). | WebGL, peso, gris frío. |
| **Siena Film** (suplente) | La ficha de créditos de cine y el grano de película. | La pantalla "ENTER" obligatoria, el sonido. |
| **Quai Network** (suplente) | Ensamblaje escalonado desde un origen y repulsión suave al cursor. | — |


## Dirección B · "Sistema vivo"

### B1 · La apuesta y los primeros 5 segundos

**La apuesta.** La bitácora es un **instrumento de medición calibrado**: la retícula nunca se mueve, el símbolo HR es un **dial** que el scroll hace girar, y cada semana es una **lectura** que entra en el hueco del anillo. El fragmento se acerca una distancia exacta por cada semana, y la página lo mide en vivo.

**Lo que el profesor debe sentir en 5 segundos.**
- 0–0,5 s: aparece la retícula (hairlines con nodos cuadrados), dibujada de izquierda a derecha en un compás.
- 0,5–2,5 s: el nombre se revela **celda por celda** al ritmo de un pulso (124 BPM, cuantizado a medio tiempo); el anillo se traza como un plóter y los ticks del bisel se encienden en barrido.
- 2,5–5 s: las lecturas ya están vivas y son verdaderas: la hora de Bogotá con segundos, `LECTURA 00/10`, `DISTANCIA 42,4` (lo que le falta al fragmento para encajar). Un pequeño paso de luz naranja recorre la fila de nodos al compás.

Sensación buscada: *"esto está hecho al milímetro y está vivo"*. La intención se ve en la precisión (todo cae en la retícula, todos los números tienen unidad y ancho fijo); las ganas, en el pulso.

**Palabras de dirección:** calibración, lectura, retícula, pulso, encaje. **Lo que no es:** terminal, HUD de videojuego, ciencia ficción, panel de control lleno de gráficos falsos.

### B2 · Paleta

Se lleva el azul carbón del brief hacia un **azul petróleo profundo** (`#0C1F2C`): sigue siendo oscuro y "suyo" (le gustan el azul y el verde), pero con un tinte que lo separa del negro neutro de la Dirección A y que hace del naranja su **complementario exacto**, así la luz naranja "enciende" de verdad. Superficies por escalones de tono, nunca con sombras.

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `--campo` | `#0C1F2C` | Fondo general | — |
| `--panel` | `#12293A` | Celdas activas, recuadro de reflexión | — |
| `--panel-2` | `#183447` | Celda bajo el cursor / foco, bisel del dial | — |
| `--tinta` | `#E6EAE4` | Texto principal, anillo, nombre | **13,83:1** sobre campo · 12,29 panel · 10,64 panel-2 |
| `--lectura` | `#9FB3BF` | Rótulos de lecturas, texto secundario | **7,75:1** campo · 6,89 panel · 5,97 panel-2 |
| `--luz` | `#F28C38` | El fragmento, el índice del dial, el "clic" de encaje, el paso del secuenciador, el foco | **6,88:1** campo · 6,11 panel · 5,30 panel-2 |
| `--senal` | `#3DBE8B` | Solo estado "completada" (cuadro de 8 px + texto) | **7,16:1** campo |
| `--iris` | `#4F8EF7` (SVG) / `#7FB0FF` (texto) | Iris; si alguna lectura usa azul, la versión clara | `#7FB0FF`: **7,66:1** campo (el `#4F8EF7` da 5,24 en campo pero 4,04 en panel-2: no usar como texto sobre panel-2) |
| `--reticula` | `rgba(230,234,228,.16)` ≈ `#2F3F49` | Hairlines de la retícula y del bisel | (no es texto) |
| `--nodo` | `#E6EAE4` a 55 % | Cuadrados de 6 px en los cruces | (no es texto) |
| `--pendiente-borde` | `#647884` | Recuadro punteado de `[PENDIENTE]` | **3,66:1** (≥ 3:1) |

**Inundación de luz** (solo en el GIRO, opcional en el encaje): texto `--campo` sobre celda `--luz` = **6,88:1**. Es el único lugar donde el naranja ocupa una superficie.

**Proporciones:** 85 % campo, 8 % paneles, 6 % tinta, ≤ 1 % luz en reposo; en los momentos clave (encaje, GIRO) la luz sube a un destello o a una celda entera y vuelve.

**Diferencia con A, a simple vista:** A es negro neutro, serif hairline, grano y viñeta (cine). B es azul petróleo plano, grotesca compacta, retícula nítida y cero textura (instrumento). Si se ponen lado a lado en miniatura, no se confunden.

**Prohibido aquí:** grano, viñetas, glows (`box-shadow` o `filter: drop-shadow` de color), degradados de cualquier tipo. La "luz" es color plano que aparece y se va con el pulso.

### B3 · Tipografía

Una sola familia variable hace casi todo, como en el diseño suizo, y el **eje de ancho** es la herramienta expresiva: comprimida para el golpe, normal para leer, expandida y finísima para las cifras de cada lectura. Una mono solo para las lecturas.

| Rol | Familia | Por qué |
|---|---|---|
| Display, títulos y cuerpo | **Archivo** (Omnibus-Type, Google Fonts, variable `wdth` 62–125 y `wght` 100–900, con itálica) | Grotesca de raíz técnica con un eje de ancho enorme: el nombre a `wdth 62` es un bloque de afiche; la reflexión a `wdth 100` se lee limpia; el número de semana a `wdth 125 / wght 150` parece la escala grabada de un instrumento. Tiene `tnum` (verificado) y todas las tildes. |
| Lecturas e instrumentación | **Fragment Mono** (Wei Huang, Google Fonts, 400) | Mono con esqueleto de grotesca neohelvética: se integra con la retícula suiza sin oler a terminal. Y se llama, literalmente, *Fragment*: el instrumento de FRAGMENTO.EXE habla en "Fragment". |

**Carga (verificado 200 el 16-oct-2026):**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,300..500&family=Fragment+Mono&display=swap">
```

- Pilas de respaldo: `"Archivo", "Helvetica Neue", Arial, sans-serif` · `"Fragment Mono", ui-monospace, Menlo, monospace`.
- **Ojo:** ninguna de las dos trae `Δ` ni `θ` en el subconjunto latino (verificado). Las lecturas se escriben con palabras: `DISTANCIA`, `ÁNGULO`, `RADIO`, nunca con letras griegas.

**Escala (rem = 16 px):**

| Elemento | Ajustes | Tamaño | Tracking | Interlineado |
|---|---|---|---|---|
| Nombre "HEINER" / "RINCÓN" | Archivo `wdth 62`, `wght 800`, mayúsculas | escritorio `clamp(6rem, 16.5vw, 15.5rem)` (≈ 238 px a 1440); móvil ≤ 599 px `30vw` (≈ 117 px a 390) | −0,015em | 0,86 (verificar que la tilde de la Ó no toque "HEINER") |
| Número de lectura ("01") | Archivo `wdth 125`, `wght 150`, `font-variant-numeric: tabular-nums` | `clamp(10rem, 30vw, 27rem)` | −0,04em | 0,78 |
| Título de semana (`h2`) | Archivo `wdth 88`, `wght 620` | `clamp(2.125rem, 1rem + 3vw, 3.75rem)` | −0,025em | 1,0 |
| GIRO | Archivo `wght 700`, `wdth` animado 62 → 100 (B7) | `clamp(2rem, 1rem + 4vw, 4.5rem)`; `max-width: 18ch` | −0,02em | 1,0 |
| Propósito (statement) | Archivo `wdth 100`, `wght 400` | `clamp(1.25rem, 1rem + 0.7vw, 1.625rem)`; `max-width: 34ch` | −0,01em | 1,3 |
| Reflexión (cuerpo) | Archivo `wdth 100`, `wght 400` | `clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)`; `max-width: 66ch` | 0 | 1,6 |
| Valor de ficha | Archivo `wdth 100`, `wght 500` | `1.0625rem` | 0 | 1,3 |
| Lecturas y rótulos | Fragment Mono 400, mayúsculas | `0.75rem` (12 px; nunca menos) | 0,04em | 1,3 |

**Microtipografía obligatoria:**
- **Todas** las cifras de lecturas con ancho fijo y ceros a la izquierda: `LECTURA 01/10`, `DISTANCIA 038,2`, `21:04:07`. En Archivo, `font-variant-numeric: tabular-nums` donde haya cifras que cambian. Decimales con **coma** (es-CO) y unidad cuando la haya.
- Mayúsculas de lecturas con `letter-spacing: .04em`; minúsculas nunca con tracking positivo.
- El nombre a `wdth 62` se escribe en mayúsculas porque es un bloque gráfico; títulos y cuerpo, en frase normal (*sentence case*).
- `text-wrap: balance` en `h2` y GIRO; `pretty` en la reflexión.
- "8.º" con ordinal correcto; comillas tipográficas; raya — con espacios finos.

### B4 · Layout de la portada (1440 / 390)

**Concepto de composición:** una lámina técnica suiza. La retícula es visible, fija a la ventana y **nunca se mueve** en todo el sitio; los contenidos entran y salen de sus celdas. A la izquierda, el nombre como bloque de afiche; a la derecha, el dial, con su centro exactamente sobre una línea de la retícula; abajo, la ficha académica en celdas. Nada centrado en la página: el único elemento con centro es el dial, y su centro está en la línea de 3/4.

**Retícula escritorio (1440 × 900):** 12 columnas, margen 32 px, medianil 20 px (columna ≈ 96,3 px). Se agrupan en **4 columnas mayores** de 3 columnas. Hairlines verticales (`--reticula`, 1 px) en x = **32, 371, 720, 1069, 1408** (bordes y centros de los medianiles entre mayores) y horizontales en y = **56, 640 y 900** (bajo la barra de lecturas, sobre la ficha y en el borde inferior). Nodos cuadrados de 6 × 6 px (`--nodo`) en cada cruce. La retícula es un único `<svg class="reticula" aria-hidden="true">` `position: fixed; inset: 0`, redibujado en `resize`.

```
1440 × 900      x:32        x:371        x:720        x:1069        x:1408
y:0  ┌────────────┬────────────┬────────────┬────────────┐
     │FRAGMENTO.EXE│LECTURA 00/10│DISTANCIA   │BOGOTÁ 21:04:07│  Fragment Mono 12px
     │            │            │ 042,4 PX   │ MOVIMIENTO [SÍ]│
y:56 ■────────────■────────────■────────────■────────────■   ■ = nodo 6px
     │ ███ █ ████ ███ ███ ███  │       ·  ╱ticks╲  ·       │
     │ HEINER  (Archivo wdth62,│     ·  ╭───────╮   ·  01  │  dial: caja 560×560
     │  800, ≈238px, revelado  │    ·  ╱  ╭──╮   ╲ ◜frag   │  centro (1069, 348)
     │  celda por celda)       │    · │  (◉)    │ ·   ▼índice  ← sobre la línea x:1069
     │ RINCÓN                  │     · ╲  HR    ╱  ·       │
     │                         │       · ╰─────╯ ·  10     │
y:640■──·──·──■──·──·──■──·──·─■──·──·──■──·──·──■   16 pasos del secuenciador (■ mayor, · menor)
     │ Registro semanal, en primera     │AUTOR       │CÓDIGO      │
     │ persona, de lo que trabajo en    │Heiner Danit│A00402510   │
     │ Proyecto de Desarrollo Personal I│Rincón C.   │            │
     │ y de lo que reflexiono sobre ello├────────────┼────────────┤ y:770 (hairline solo en mayores 3–4)
     │ (Archivo 400, ≈24px, 34ch)       │PROGRAMA    │MATERIA     │
     │                                  │Ingeniería de Sist.│Proyecto de D. P. I│
     │                                  │8.º semestre│2026-2      │
y:900└────────────┴────────────┴────────────┴────────────┘
```

| Zona | Posición | Contenido | Notas |
|---|---|---|---|
| Barra de lecturas | fila y 0–56; 4 celdas, una por columna mayor; texto a 20 px del borde superior, 10 px a la derecha de cada hairline | 1: `FRAGMENTO.EXE` · 2: `LECTURA 00/10` · 3: `DISTANCIA` + `042,4 PX` · 4: `BOGOTÁ 21:04:07` + botón `MOVIMIENTO [SÍ]` | Es una `<nav>` fija. Todo verdadero: la lectura 00 es la portada; N = `semanas.length`; la distancia es la del fragmento a su encaje en unidades del viewBox (√(30²+30²) = 42,4 en portada); la hora es `Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', hour12: false, ... })`, actualizada cada segundo. `MOVIMIENTO [SÍ]/[NO]` es un `<button aria-pressed>` real: apaga Lenis, el secuenciador y los scrubs (preferencia guardada en `localStorage` con `try/catch`). |
| Nombre | mayores 1–2 (x 42–710); "HEINER" línea base ≈ y 300; "RINCÓN" línea base ≈ y 505 | Archivo `wdth 62 / wght 800`, ≈ 238 px | Las letras que cruzan la hairline x 371 se recortan en dos celdas para el revelado (B7, momento 2). `margin-left: -0.03em` para alinear ópticamente la H con el margen. |
| Dial | mayores 3–4; caja 560 × 560 con **centro en (1069, 348)**, es decir, la pupila cae exactamente sobre la hairline x 1069 y a media altura de la fila 56–640 | SVG del símbolo a escala 1 (400 px) + SVG del bisel (ver B8) | Las hairlines de la retícula se interrumpen dentro de un círculo de r 214 alrededor del centro (máscara), para que el dial quede "empotrado" en la lámina. |
| Secuenciador | hairline y 640: 16 pasos repartidos de x 32 a x 1408 (≈ 91,7 px); los 5 cruces son nodos de 6 px, los 11 intermedios marcas de 3 × 3 px | Una luz naranja de 6 px avanza un paso por corchea a 124 BPM (0,242 s), 16 pasos = 3,87 s | Ver B6. Decorado con significado (ritmo); `aria-hidden`. |
| Propósito | mayores 1–2, y 664–880 | `BITACORA.proposito`, Archivo 400, ≈ 24 px, `max-width: 34ch` | Color `--tinta` (es la frase que el profesor tiene que leer). |
| Ficha | mayores 3–4, 2 × 2 celdas (hairline extra en y 770 con nodos) | Autor · Código / Programa (+ 8.º semestre) · Materia (+ 2026-2) | Rótulo Fragment Mono 12 px `--lectura`; valor Archivo 500, 17 px `--tinta`. Es una `<dl>`. |

**Móvil (390 × 844):** 4 columnas, margen 16 px, medianil 12 px; **2 columnas mayores** con hairlines en x = 16, 195, 374. Hairlines horizontales bajo la barra (y 48), bajo el dial y sobre la ficha.

```
390 × 844
x:16              x:195              x:374
■──────────────────■──────────────────■ y:0
│FRAGMENTO.EXE     │     LECTURA 00/10│ y 16 (Fragment Mono 12px)
■──────────────────■──────────────────■ y:48
│        ·  ╭─────────╮  ·  ◜frag     │ dial: caja 358×358 (escala 0,64)
│      ·   ╱  ╭──╮     ╲   ▼índice    │ centro sobre la línea x:195
│      ·  │   (◉)       │  ·          │
│        · ╲   HR      ╱ ·            │
■──────────────────■──────────────────■ y ≈ 420
│ HEINER                              │ Archivo wdth62/800, 30vw ≈ 117px
│ RINCÓN                              │
│ Registro semanal, en primera        │ Archivo 400, 20px
│ persona, de lo que trabajo en…      │
■──·──·──·──·──·──·─■──·──·──·──·──·──■ secuenciador de 8 pasos
│AUTOR             │CÓDIGO            │ ficha 2 × 2
│Heiner Danit      │A00402510         │
│Rincón Carrillo   │                  │
■──────────────────■──────────────────■
│PROGRAMA          │MATERIA           │
│Ingeniería de     │Proyecto de       │
│Sistemas, 8.º sem.│Desarrollo P. I   │
│                  │2026-2            │
■──────────────────■──────────────────■
│BOGOTÁ 21:04:07   │DISTANCIA 042,4 PX│ lecturas que no caben arriba
│MOVIMIENTO [SÍ]   │                  │ (botón ≥ 44px de alto)
└──────────────────┴──────────────────┘
```

- La portada en móvil mide más de 100svh: el primer viewport muestra barra, dial, nombre y el comienzo del propósito.
- Tableta (600–899 px): 8 columnas, 2 mayores; dial a la derecha (mayor 2) y nombre a la izquierda con 20vw.
- A 360 px: verificar con Playwright que "RINCÓN" no desborda; si lo hace, bajar a 28vw.

### B5 · Transición portada → SEMANA_01

**La idea:** el instrumento no se mueve; cambia la lectura. La retícula y el dial se quedan exactamente donde están. Las celdas de la portada se **cierran** en barrido, el bisel del dial **gira** con el scroll hasta que el segmento 01 cae en el hueco del anillo (el lugar del fragmento), suena el **clic de encaje** con luz naranja y las celdas se **abren** con la lectura de la semana 01. Es un cambio de canal, no un cambio de página.

**Geometría del dial (para que el giro sea exacto):**
- El hueco del `#anillo` (donde encaja el fragmento) va, en sentido horario desde las 12, de **20° a 65°**; su centro está a **42,5°**. Ahí se fija el **índice**: un triángulo naranja de 10 px justo por fuera del bisel (r 232), apuntando al centro. *La semana que se está leyendo es la que llena el hueco.*
- El bisel tiene N segmentos de `360/N` grados (N = `semanas.length`). El segmento k está centrado en `−(k−1)·360/N` dentro del bisel. Rotación para mostrar la semana k bajo el índice: **`R(k) = 42,5° + (k−1)·360/N`**. En la portada (lectura 00) el segmento 01 está un paso antes: **`R(0) = 42,5° − 360/N`** (con N = 10: 6,5°). Avanzar = girar en sentido horario.
- Las etiquetas `01…N` del bisel se contra-rotan (`rotation: −R`) para leerse siempre derechas.
- Distancia del fragmento: en la semana k, `#fragmento` en `translate(30·(1−k/N), −30·(1−k/N))`; la lectura `DISTANCIA` muestra `42,43·(1−k/N)` con una cifra decimal y tres enteros (`042,4` → `038,2`).

**Estructura DOM:**

```html
<nav class="lecturas">…4 celdas…</nav>
<svg class="reticula" aria-hidden="true">…</svg>          <!-- fixed, nunca se mueve -->
<figure class="dial" role="img" aria-label="Símbolo HR: …">  <!-- fixed en su celda; fuera de main para que el pin no lo afecte -->
  <svg class="bisel">…</svg><svg class="simbolo">…</svg>
</figure>
<main>
  <header class="portada" id="portada">…nombre, propósito, ficha (en celdas con clip)…</header>
  <section class="semana" id="semana-01" aria-labelledby="s01-titulo">
    <div class="semana__cabecera">…celdas de la lectura 01…</div>
    <div class="semana__cuerpo">…</div>
  </section>
</main>
```

- Mismo truco de escenario que la Dirección A: `#portada` pineada con `pinSpacing: false`, `end: "+=160%"` (móvil `+=120%`); `#semana-01` con `margin-top: 60svh` (móvil `20svh`); `.semana__cabecera` con contra-traslación `y: "-160vh" → 0` (`ease: "none"`, `scrub: true`) para quedarse quieta debajo. Todas las celdas de la cabecera empiezan cerradas (`clip-path: inset(100% 0 0 0)`).
- Cada "celda" es un `div.celda` con `overflow: clip` alineado a la retícula; su contenido se revela o se oculta animando `clip-path: inset()` (no la opacidad).

**Línea de tiempo del pin (escritorio; 10 unidades; `scrub: true`):**

| Pos. | Duración | Qué pasa | Ease |
|---|---|---|---|
| 0 | 3 | **Cierre de celdas de la portada.** Orden de barrido izquierda→derecha, arriba→abajo: celdas del nombre (4: "HEINER" y "RINCÓN" partidas por la hairline x 371), celda del propósito, 4 celdas de la ficha. Cada una `clip-path: inset(0 0 0 0) → inset(0 0 100% 0)` (se recoge hacia arriba), 0,6 de duración, separadas 0,3 (cuantizado: cada celda arranca en un "paso"). | `power2.inOut` |
| 2 | 4 | **Giro del dial.** `.bisel` `rotation: R(0) → R(1)` (6,5° → 42,5°). `#fragmento` `(30,−30) → (27,−27)`. La lectura `DISTANCIA` interpola `042,4 → 038,2` (en `onUpdate`, con `toFixed(1)`, coma decimal y `padStart`). | `none` (el scrub es la mano) |
| 6 | — | **Clic de encaje** (ver abajo). Se dispara al cruzar el progreso 0,6 hacia adelante; se revierte al cruzarlo hacia atrás. | — |
| 6,5 | 3 | **Apertura de celdas de la lectura 01**, mismo barrido: "01" (2 celdas), fila de datos, título (`h2`), celda de la reflexión. Cada una `clip-path: inset(100% 0 0 0) → inset(0 0 0 0)` (sube desde abajo), 0,6 de duración, separadas 0,3. | `power2.inOut` |
| 9,5 | 0,5 | Reposo. | — |

**El clic de encaje (timeline con tiempo, no scrub; dura 2 pulsos = 0,484 s):**
- Un contenedor intermedio `.dial__retén` (envuelve al bisel) hace `rotation: +0.8 → 0` con `back.out(4)`, 0,3 s: el detent mecánico, sin pelear con la rotación del scrub.
- El arco del segmento 01 del bisel: `stroke` `--reticula → --luz` (instantáneo) y su etiqueta `01` a `--luz`.
- El índice: `scale: 1 → 1.45 → 1` en un pulso (0,242 s, `power2.out`).
- `#pupila`: `opacity: 1 → .45 → 1 → .45 → 1` en dos pulsos (la luz "late" dos veces).
- `LECTURA 00/10 → 01/10`: ScrambleText solo en los dos dígitos (`chars: "0123456789"`, 0,3 s).
- El secuenciador se re-sincroniza: el paso actual salta al paso 1 (el encaje cae en el *downbeat*).
- Hacia atrás: segmento y etiqueta vuelven a `--reticula`/`--lectura`, `LECTURA` vuelve a `00`, sin pulso.

**Después del pin:** el dial se **acopla** a la barra de lecturas cuando empieza el cuerpo de la semana: ScrollTrigger en `.semana__cuerpo`, `start: "top bottom"`, `end: "top 35%"`, `scrub: true`; el `figure.dial` interpola `x`, `y` y `scale` hasta un hueco de 36 × 36 px en la celda 2 de la barra (a la izquierda de `LECTURA 01/10`). Desde ahí, en las siguientes semanas, sigue girando y su fragmento sigue acercándose. Al volver arriba, se desacopla.

**Cómo se ve la cabecera de la semana 01 al llegar (1440 × 900):**

```
     x:32        x:371        x:720        x:1069        x:1408
y:0  │FRAGMENTO.EXE│LECTURA 01/10│DISTANCIA   │BOGOTÁ 21:04:52│
     │            │            │ 038,2 PX   │ MOVIMIENTO [SÍ]│
y:56 ■────────────■────────────■────────────■────────────■
     │                         │        ╭───────╮   ▼01 ← segmento y etiqueta en --luz
     │   ██   █                │      ╱  ╭──╮   ╲◜frag (27,−27)
     │  █  █ ██   "01"         │     │   (◉)    │         dial: mismo lugar que en la portada
     │  █  █  █   Archivo      │      ╲  HR    ╱
     │   ██  ███  wdth125/150  │        ╰─────╯   02
y:640■──·──·──■──·──·──■──·──·─■──·──·──■──·──·──■
     │SEMANA_01   (Fragment, --luz)│┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐│
     │ESTADO ■ PENDIENTE  FECHA ┆[PENDIENTE: fecha]┆│┆[PENDIENTE: reflexión de  ┆│
     │Expectativas de la materia    │┆ la semana]               ┆│ reflexión: mayores 3–4
     │y de mi futuro laboral        │└╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘│ max 66ch, Archivo 18px
     │(h2 Archivo 620/wdth88, ≈52px)│                            │
y:900└────────────┴────────────┴────────────┴────────────┘
```

- "01" ocupa las mayores 1–2 de la fila superior (donde estaba el nombre), `aria-hidden`; línea base ≈ y 590.
- Fila inferior, mayores 1–2: `SEMANA_01` (dato de secuencia, en `--luz` porque es la lectura activa), la línea de estado (cuadro de 8 px en `--lectura` = pendiente; `--luz` = en curso; `--senal` = completada) con la fecha `[PENDIENTE: fecha]` en su recuadro punteado, y el `h2`.
- Fila inferior, mayores 3–4: la celda de la reflexión con `[PENDIENTE: reflexión de la semana]` en recuadro punteado `--pendiente-borde` (estilo común 0.4). La hairline interna y 770 de la ficha desaparece (la celda ahora es una sola).
- Debajo (`.semana__cuerpo`) siguen los bloques `[PENDIENTE]` y el GIRO, fuera del alcance del prototipo salvo que sobre tiempo.

**Móvil (390):** pin `+=120%`; las celdas se cierran por fila completa (no por letra); el dial gira igual en su caja superior. Cabecera: el dial arriba (mismo lugar), debajo una fila con "01" a 40vw en la mayor 1 y en la mayor 2 `SEMANA_01` + estado + fecha; luego el `h2` a 34 px (3 líneas) y la celda de la reflexión a ancho completo. El acople del dial va a la celda derecha de la barra.

**Reduced motion o `MOVIMIENTO [NO]`:** sin pin ni scrub ni secuenciador; la portada se ve completa con el dial en `R(0)`; la semana 01 aparece en flujo normal con sus celdas abiertas y un dial estático propio en `R(1)` con el segmento 01 en `--luz` (sin pulso). Las lecturas de la barra cambian al instante con IntersectionObserver. El reloj sigue (es información, no movimiento decorativo), pero sin animación de dígitos.

### B6 · Sistema de motion

**Librerías (verificadas con 200, ver Anexo):**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.css">
<script defer src="js/datos.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrambleTextPlugin.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/CustomEase.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js"></script>
<script defer src="js/reticula.js"></script>      <!-- dibuja retícula, nodos y secuenciador -->
<script defer src="js/dial.js"></script>          <!-- bisel, giro, encaje, acople -->
<script defer src="js/lecturas.js"></script>      <!-- reloj, distancia, contador, mira -->
<script defer src="js/principal.js"></script>
```
Sin SplitText (los revelados son por celda, no por letra) salvo en el GIRO, donde se hace a mano en `span`. Sin canvas: todo es SVG + DOM.

**El pulso (columna vertebral del motion):** `const PULSO = 60 / 124; // 0,4839 s` y `const PASO = PULSO / 2; // 0,242 s`. **Toda** duración con tiempo es múltiplo de `PASO`: 0,242 · 0,484 · 0,726 · 0,968 s. Los escalonados (`stagger`) también son `PASO`. Así todo el sitio "va a tempo" sin que nadie lo explique.

**Lenis:** `new Lenis({ lerp: 0.12, wheelMultiplier: 1 })` (más seco que A: un instrumento responde rápido, sin inercia de cámara).

**Eases (nombres a registrar):**
- `CustomEase.create("reten", "M0,0 C0.3,0 0.25,1.12 0.62,1.02 0.8,0.99 1,1")`: llegada con un sobrepaso mínimo, como una aguja que se asienta. Para el acople y las lecturas.
- `"power2.inOut"`: celdas que abren y cierran.
- `"back.out(4)"`: el retén del clic (0,3 s).
- `"steps(n)"`: trazado del bisel (los ticks se encienden de a uno), contador.
- `"none"`: todo lo que va con scrub.

**Carga de la portada (con tiempo, ≈ 2,9 s; se puede saltar con cualquier scroll o tecla):**
1. 0 → 0,484 s: la retícula se traza: cada hairline `scaleX/scaleY: 0 → 1` desde su origen (izquierda/arriba), `stagger: PASO/2`; los nodos aparecen con `scale: 0 → 1` en `steps(2)` al llegar la línea.
2. 0,484 → 1,936 s: el nombre se revela **celda por celda** al compás (B7, momento 2).
3. 0,726 → 1,936 s: el `#anillo` se traza como plóter (`stroke-dasharray` + `stroke-dashoffset` de la longitud a 0, `ease: "steps(36)"` en 1,21 s: avanza a saltos de 10°, como un motor paso a paso); los ticks del bisel se encienden en barrido horario (`stagger: 0.006`).
4. 1,452 → 2,178 s: ojo, iris, pupila, `HR`: aparecen en este orden, un `PASO` cada uno (opacidad en `steps(2)`, sin desplazamiento).
5. 1,936 s: la ficha y el propósito se abren por celdas (`clip-path`, `stagger: PASO`).
6. 2,42 s: arrancan las lecturas vivas (reloj) y el secuenciador.

**El secuenciador:** un solo `rect` naranja de 6 px que salta de paso en paso sobre la hairline y 640 cada `PASO` (16 pasos, 3,87 s por vuelta) con `gsap.ticker` o `setInterval`, solo `transform`. En el paso 1 de cada vuelta, el nodo mayor de x 32 parpadea a `--luz` un `PASO`. Se pausa con la pestaña oculta, fuera de vista, con `MOVIMIENTO [NO]` y con reduced-motion. No hay sonido.

**Qué se anima (y qué no):**
- Sí: `rotation` del bisel y del retén, `transform` del dial (acople), `clip-path: inset()` de celdas (≤ 12 a la vez), `stroke-dashoffset` del anillo (una vez), colores de **un** segmento y del índice (cambio instantáneo, no transición de color), `font-variation-settings` del GIRO (una línea, una vez).
- No: la retícula después de dibujada (nunca se mueve), la reflexión, fondos, sombras, blur.

**Reduced motion / `MOVIMIENTO [NO]` (estado final):** retícula dibujada, nombre completo, anillo completo, bisel en `R(0)`, lecturas con valor real sin animación, secuenciador apagado (todos los pasos en `--nodo`), sin pin, sin Lenis. `MOVIMIENTO [NO]` llama a `ScrollTrigger.getAll().forEach(t => t.kill())`, destruye Lenis y aplica la clase `.sin-movimiento` que deja todo en estado final; `[SÍ]` recarga el estado animado (se permite `location.reload()` en el prototipo).

**Móvil y táctil:**
- Sin mira de cursor; un toque sobre el dial muestra la lectura polar del punto tocado durante 2 s (B7, momento 3).
- Pin `+=120%`; las celdas se cierran y abren por filas.
- El secuenciador usa 8 pasos (una corchea cada uno: 1,94 s por vuelta).
- El bisel con N etiquetas: si N > 12, en móvil solo se rotulan las semanas impares y la activa.

### B7 · Momentos wow

Cuatro momentos. **El que alguien querría mostrarle a otra persona es el 1: el dial que gira con el scroll y encaja con luz naranja.**

**1 · El dial gira y la semana encaja en el hueco del anillo. EL MOMENTO.**
- *Qué ve el usuario:* al hacer scroll, el bisel graduado alrededor del símbolo gira bajo sus dedos, con los números de las semanas desfilando; el fragmento naranja se acerca un poco y la lectura `DISTANCIA` baja en vivo (`042,4 → 038,2`). Cuando el segmento 01 entra exacto en el hueco del anillo: retén mecánico, el índice y el segmento se encienden en naranja, la pupila late dos veces a tempo y `LECTURA` pasa a `01/10`. Si devuelve el scroll, todo se desenciende; si vuelve a bajar, vuelve a encajar. Dan ganas de jugar con él.
- *Cómo:* SVG del bisel con N segmentos generados desde `semanas.length`; `rotation` con scrub; el clic es una timeline aparte disparada al cruzar un umbral (B5). Coste: muy bajo (un `transform` por frame y un cambio de color puntual).
- *Qué cuenta:* **el crecimiento visible** (cada semana acerca el fragmento una distancia exacta y medible), **el fragmento que vuelve al todo** (la semana leída ocupa el hueco que el fragmento llenará en el cierre) y **la precisión del analista** (todo está medido, nada es decorativo). En el cierre del sitio, la última vuelta deja la distancia en `000,0` y el fragmento encaja.

**2 · El nombre se revela celda por celda, a tempo (carga de la portada).**
- *Qué ve el usuario:* "HEINER" y "RINCÓN" no aparecen: se **descubren** por pedazos, como si cada celda de la retícula fuera una ventana que se abre en un golpe de bombo. Las letras que cruzan una hairline aparecen en dos tiempos (una mitad, luego la otra). En la transición, las mismas celdas se cierran en el mismo orden y se abren con la lectura de la semana: la retícula queda quieta, cambia el contenido.
- *Cómo:* cada palabra se duplica en N `div.celda` alineadas a la retícula (una por tramo de columna mayor que cruza), cada una con `clip-path: inset()` y la palabra posicionada igual dentro (el texto real va una sola vez en el `h1`; las copias son `aria-hidden`). Revelado `inset(100% 0 0 0) → inset(0)`, `duration: PASO`, `ease: "power2.out"`, en el orden de un patrón de 8 pasos (bombo en 1, 3, 5, 7; las celdas pequeñas en los contratiempos). Coste: bajo.
- *Qué cuenta:* **los fragmentos que se ensamblan** (el nombre es literalmente piezas que se juntan) y **el ritmo** (techno/house: cuantizado a 124 BPM). Es la manera de decir "ganas y energía" sin un solo efecto llamativo.

**3 · La mira de inspección: ver lo que otros no ven.**
- *Qué ve el usuario:* el cursor se vuelve una mira de precisión: dos hairlines (`--reticula` al doble de opacidad) que cruzan toda la pantalla y se mueven **pegadas a la retícula** (se imantan a los nodos cercanos a < 12 px), con una pequeña lectura junto al cruce: fuera del dial, coordenadas de cursor en la lámina (`X 0732 · Y 0418`); **sobre el dial**, coordenadas polares respecto de la pupila (`ÁNGULO 214,0° · RADIO 0,62`) y el iris del símbolo se orienta hacia la mira; **sobre el fragmento**, la lectura cambia a `FRAGMENTO · DISTANCIA 042,4 PX`. En táctil, un toque sobre el dial deja la lectura 2 s en el punto tocado.
- *Cómo:* dos `div` de 1 px `position: fixed`, `gsap.quickTo` (0,15 s, `power3`), una etiqueta Fragment Mono con `tabular-nums`; cálculos con `Math.atan2` y el `getBoundingClientRect` del dial (cacheado en `resize`/scroll). Solo `(hover: hover) and (pointer: fine)`; el cursor nativo se mantiene en enlaces y botones (la mira se reduce a un punto ahí). Coste: mínimo.
- *Qué cuenta:* **el observador** y **los trucos bajo la manga**: el sitio le enseña al visitante una capa de información que normalmente no se ve (dónde está, a qué distancia está el fragmento). Es la mirada de un analista de seguridad hecha interfaz, sin un solo cliché de hacker.

**4 · El GIRO como calibración (cierre de cada semana; si sobra tiempo en el prototipo).**
- *Qué ve el usuario:* la celda del GIRO se **inunda de luz naranja** (de abajo arriba, un `PASO`), y la frase aparece en Archivo comprimida (`wdth 62`) y se **expande** letra a letra hasta su ancho normal (`wdth 100`) en una onda de izquierda a derecha, como una señal que se enfoca, 0,968 s (4 pulsos). Texto `--campo` sobre `--luz` (6,88:1).
- *Cómo:* `span` por carácter con `font-variation-settings: "wdth" var(--w)`; GSAP anima `--w` de 62 a 100 con `stagger: { each: PASO/8, from: "start" }`, `ease: "reten"`. Recalcula una sola línea durante < 1 s (aceptable); la caja tiene `min-height` fija para que nada salte debajo. Disparo único (`once: true`). `aria-label` con la frase; spans `aria-hidden`. En el prototipo el GIRO de la semana 01 es `[PENDIENTE]`: se muestra como pendiente, sin calibración; la demo va en `?demo-giro` con una frase de muestra señalada como tal.
- *Qué cuenta:* **el plot twist** (la revelación llega como una señal que por fin se lee clara) y **la luz naranja en el momento clave**.

**Descartados por no contar nada:** gráficas o barras de "habilidades", radar animado, osciloscopios decorativos, números que cuentan sin dato real, sonido.

### B8 · Uso del símbolo HR

- **Forma intocable:** el SVG de `site/assets/simbolo-hr.svg` se pega inline tal cual. Cambios permitidos: colores a variables (`#anillo`, `#ojo-*`, `#hr` → `var(--tinta)`; `#pupila` y el arco → `var(--luz)`; `#iris` y `#bits` conservan sus colores) y `font-family` de `#hr` → `"Archivo"` con `font-variation-settings: "wdth" 100` y `font-weight: 600` (mismo texto, posición, tamaño y `letter-spacing`; ajustar solo el `letter-spacing` si el ancho cambia visiblemente).
- **El bisel es una pieza nueva alrededor del símbolo, no una modificación del símbolo.** Va en un SVG aparte (`viewBox="0 0 560 560"`, centro 280,280), debajo del símbolo (que se centra con escala 1 en la misma caja):
  - Arco base: círculo r 196, `stroke: var(--reticula)`, 1 px.
  - Ticks cada 3° (120): de r 200 a r 206, 1 px, `--reticula`. En los límites de segmento: de r 200 a r 214, 1,5 px, `--nodo`.
  - Arco de cada segmento (para encenderlo): `path` de r 190, del inicio al fin del segmento con 1° de separación a cada lado, `stroke: var(--reticula)`, 2 px; el activo pasa a `--luz`.
  - Etiquetas `01…N` en Fragment Mono 11 px, `--lectura` (activa `--luz`), en r 250 al centro de cada segmento, contra-rotadas.
  - Índice fijo (fuera del grupo que gira): triángulo con la punta en r 220 y la base en r 232, a **42,5°** horario desde las 12, en `--luz`.
  - Todo generado por JS desde `semanas.length` (nada de 10 fijo).
- **Partes con papel propio:**
  - `#anillo`: se traza como plóter en la carga (`stroke-dashoffset`, `steps(36)`).
  - `#fragmento` + `#bits`: distancia al encaje = progreso real (`translate(30·(1−k/N), −30·(1−k/N))`); su lectura está en la barra. En el cierre (fuera del prototipo) llega a `translate(0,0)` y el bisel completo se enciende en `--luz` un pulso.
  - `#pupila`: late a tempo en el clic de encaje (dos pulsos).
  - `#iris` + `#pupila`: se orientan hacia la mira de inspección (máx. 8 px), con `quickTo`.
  - `#ojo-sup`/`#ojo-inf`, `#hr`: quietos (el instrumento no "actúa"; mide).
- **Dial acoplado (36 px en la barra):** es el mismo `figure.dial` escalado, no una copia; a ese tamaño se ocultan las etiquetas del bisel y el ojo (`opacity: 0` interpolada durante el acople) y quedan anillo, segmento activo, índice y fragmento.
- **Impresión:** retícula oculta, dial en estado final de la semana impresa, tinta negra y naranja; sin bisel de etiquetas si no cabe.

### B9 · Riesgos de "plantilla" y detalles de oficio

| Riesgo | Por qué se lee "plantilla/IA" | Cómo se evita aquí |
|---|---|---|
| Retícula con hairlines y nodos "de moda" | Andamio visible copiado de los sitios premiados; hoy se lee como disfraz. | La retícula **trabaja**: el centro del dial cae sobre una línea, las celdas son las unidades de revelado y nunca se mueve (es el instrumento). Nada de cruces "+" decorativos sin función; ninguna línea que no delimite contenido. |
| HUD con datos inventados | Paneles de "sistema" con cifras falsas. | Solo cuatro lecturas y todas verdaderas: lectura actual/N, distancia del fragmento (calculada), hora de Bogotá, estado del movimiento (un control real). Ninguna barra de progreso de "habilidades", ningún porcentaje inventado. |
| Mono en mayúsculas en todas partes | Etiqueta tech prefabricada. | La mono es la voz del instrumento y solo dice lecturas; títulos, propósito y reflexión en Archivo, en frase normal. |
| Azul oscuro + naranja | Combinación complementaria muy vista. | Petróleo plano (no azul marino corporativo), naranja como **luz que se enciende** solo en el encaje, el índice y el secuenciador. En reposo, la pantalla es casi monocroma. |
| Retícula = "periódico" | Hairlines + columnas densas = el look editorial genérico. | Contraste de escala extremo (nombre a 238 px contra lecturas a 12 px, ×20), mucho campo vacío dentro de las celdas y un objeto circular grande que rompe la ortogonalidad. |
| Revelado por celdas convertido en "fade-up con máscara" | Si todo entra igual, aburre. | Solo el nombre y la transición usan celdas; la ficha entra por filas; la reflexión no entra (está). El orden sigue un patrón rítmico, no un `stagger` lineal. |

**Detalles de oficio (checklist del constructor):**
- Hairlines a 1 px exacto alineadas a píxel: coordenadas `x + 0.5` en el SVG de la retícula, `shape-rendering: crispEdges` en líneas y nodos.
- Nodos de 6 × 6 px centrados exactamente en el cruce (`x − 3, y − 3`).
- Todas las lecturas con `font-variant-numeric: tabular-nums`, ancho fijo con `padStart`, coma decimal, unidad en mayúsculas separada por espacio fino (`042,4 PX`). El reloj no "baila" al cambiar de segundo.
- Márgenes internos de celda constantes: 10 px desde la hairline izquierda, 20 px desde la superior, en todas las celdas.
- Las líneas base de los valores de la ficha coinciden en cada fila; rótulos con `min-height: 1lh`.
- El botón `MOVIMIENTO [SÍ]` es un `<button aria-pressed="true">` con foco visible; los corchetes son texto, no bordes.
- Foco de teclado: `outline: 2px solid var(--luz); outline-offset: 3px`, con esquinas rectas.
- `::selection`: fondo `--luz`, texto `--campo`.
- Cero bordes redondeados (salvo los 2 px del recuadro pendiente), cero sombras, cero degradados.
- El nombre en `wdth 62` con `font-kerning: normal`; revisar la pareja "IN" y la tilde de la Ó a tamaño real.
- `<title>`: "FRAGMENTO.EXE · Heiner Rincón"; favicon: el símbolo.

### B10 · Referencias usadas

| Referencia | Qué se toma | Qué no |
|---|---|---|
| **Longbow** (`2-longbow-scroll.png`) | Retícula protagonista con nodos cuadrados en los cruces; letras gigantes condensadas reveladas **por celda**; el stack liviano GSAP + Lenis. | Su glassmorphism, el cuerpo en mono mayúscula, el gris medio de fondo, la tercera voz serif itálica (aquí sobra). |
| **HAOQI.DESIGN** (`2-haoqi-scroll.png`) | Lecturas reales con ancho fijo y ceros a la izquierda (`padStart` + `tabular-nums`), reloj local, estado entre corchetes (`MOVIMIENTO [SÍ]`), coordenadas del cursor. | El *warp* neón, la palabra 3D, el acento lima, depender de WebGL. |
| **Igloo Inc.** (`2-igloo*.png`) | La idea de plano técnico que se completa: el bisel graduado como "cota" del símbolo y el sistema que compila en vivo. | El 3D, el peso, el gris frío claro. |
| **Revelatio Studio** | Para el índice futuro: lista donde solo la semana activa se enciende (aquí, la etiqueta del bisel). | La curvatura CRT. |
| **Prødux Design** | El fragmento que converge con el scroll, aquí con distancia medida en vez de profundidad. | La imagen, el blur masivo. |
| **Aspen Search / Alethia** (suplentes) | Un solo acento que inunda una celda entera (el GIRO); lecturas con signo y unidad. | El lima de Alethia (se acerca a "terminal verde"). |


## Anexo · Verificaciones (contraste y URLs)

**A vs. B de un vistazo (para que Heiner compare):**

| | A · Sala de observación | B · Sistema vivo |
|---|---|---|
| Metáfora | Película proyectada para un espectador | Instrumento de medición calibrado |
| Fondo | `#0D0F12` penumbra neutra + grano + viñeta | `#0C1F2C` petróleo plano, sin textura |
| Tipografía | Zodiak (serif hairline) + Newsreader + Martian Mono | Archivo variable (eje de ancho) + Fragment Mono |
| Símbolo | Se arma desde partículas-glifo; el ojo mira al cursor | Es un dial con bisel graduado que gira con el scroll |
| Transición a la semana 01 | Telón + zoom dentro de la cerradura + corte | Celdas que se cierran, giro del dial, clic naranja, celdas que se abren |
| GIRO | Corte a negro + descifrado por estados | Celda inundada de naranja + expansión de ancho |
| Momento para mostrar | Entrar por la cerradura | El dial que encaja la semana |
| Coste técnico | Medio (canvas 2D de partículas, máscara SVG) | Bajo (solo SVG + DOM) |

**URLs verificadas con `curl` (HTTP 200, 16-oct-2026):**

| Recurso | URL |
|---|---|
| Zodiak (variable) | `https://api.fontshare.com/v2/css?f[]=zodiak@1&display=swap` (también responde `zodiak@100,300,400,500`) |
| Newsreader + Martian Mono | `https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..500&family=Martian+Mono:wdth,wght@75..112.5,300..500&display=swap` |
| Archivo + Fragment Mono | `https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,300..500&family=Fragment+Mono&display=swap` |
| GSAP core | `https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js` |
| ScrollTrigger | `https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js` |
| SplitText | `https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js` |
| ScrambleTextPlugin | `https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrambleTextPlugin.min.js` |
| CustomEase | `https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/CustomEase.min.js` |
| Observer (si se necesita) | `https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/Observer.min.js` |
| Lenis JS | `https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js` |
| Lenis CSS | `https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.css` |

**Cobertura de glifos verificada con fontTools** (archivos woff2 reales del subconjunto latino): Zodiak, Newsreader, Martian Mono, Archivo y Fragment Mono tienen `Ó Á É Í Ú Ñ ó á é í ú ñ ¿ ¡ º ° · —`. **Ninguna** tiene `Δ` ni `θ` → no usar letras griegas en lecturas. Archivo y Newsreader tienen `tnum`; Zodiak no (no se usa para cifras que cambian).

**Contraste (WCAG 2.x, calculado con Python):**

| Dirección | Par | Ratio |
|---|---|---|
| A | `--proyeccion #ECE5D3` / `--sala #0D0F12` | 15,28 |
| A | `--plata #B4AE9F` / `--sala` | 8,68 |
| A | `--niebla #8E8A80` / `--sala` · / `--butaca #16191E` | 5,57 · 5,12 |
| A | `--fragmento #F28C38` / `--sala` | 7,84 |
| A | `--iris #6A9EF8` / `--sala` | 7,18 |
| A | `--sala` sobre `--proyeccion` (corte invertido) | 15,28 |
| A | `--pendiente-borde #66655F` / `--sala` (no textual, ≥ 3) | 3,28 |
| A | ✗ `--fragmento` sobre `--proyeccion` (prohibido como texto) | 1,95 |
| B | `--tinta #E6EAE4` / `--campo #0C1F2C` · / `--panel-2 #183447` | 13,83 · 10,64 |
| B | `--lectura #9FB3BF` / `--campo` · / `--panel-2` | 7,75 · 5,97 |
| B | `--luz #F28C38` / `--campo` · / `--panel-2` | 6,88 · 5,30 |
| B | `--senal #3DBE8B` / `--campo` | 7,16 |
| B | `#7FB0FF` / `--campo` (azul para texto) | 7,66 |
| B | ✗ `#4F8EF7` / `--panel-2` (no usar como texto) | 4,04 |
| B | `--campo` sobre `--luz` (GIRO inundado) | 6,88 |
| B | `--pendiente-borde #647884` / `--campo` (no textual, ≥ 3) | 3,66 |

**Geometría del símbolo verificada:** el hueco del `#anillo` va de 20° a 65° en sentido horario desde las 12 (puntos 247,9,68,4 y 326,9,140,8 respecto del centro 200,200); distancia del fragmento en reposo = √(30² + 30²) = 42,43 unidades del viewBox.

**Entrega esperada de cada constructor:** la carpeta `site/lab/direccion-x/` completa; capturas Playwright a 1440 × 900 y 390 × 844 de (1) portada al terminar la carga, (2) el momento wow de la transición a mitad del pin, (3) la cabecera de la semana 01; una captura con `prefers-reduced-motion: reduce`; una nota de qué quedó fuera o se desvió de este documento y por qué. Sin commits a `main`.

