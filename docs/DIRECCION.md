# Dirección creativa final — FRAGMENTO.EXE (Fase 2)

> Fase 1 (historia en git y en `docs/CRITICA-FASE1*.md`): se exploraron dos direcciones. Heiner eligió la **Dirección A · "Sala de observación"**. De la **B · "Sistema vivo"** se traen solo dos piezas: **la tira de la combinación** (avance semana a semana) y **el destello del anillo** para el cierre. El símbolo y la paleta se reemplazaron por los definitivos (§2 y §4). **El GIRO se eliminó**: cada semana cierra con su **lección clave**, en un cierre diseñado aparte (§8).

Este documento es la especificación de construcción. Si algo no está aquí, se decide con el criterio de la sección y se anota en la entrega.

---

## 0 · La apuesta

La bitácora es **una película que se proyecta para un solo espectador** y que, al mismo tiempo, **lo mira**. El profesor entra a una sala casi negra. El emblema está vivo: el ojo lo sigue, parpadea y el dial de caja fuerte espera. Al bajar, la cámara **entra por la pupila-cerradura** y aterriza en la semana 01. Cada semana es una escena con su propio plano, sus datos dibujados y una lección que se revela. La combinación se marca número a número. Al final el dial completa la vuelta, **el fragmento vuelve al todo**, un pulso de rubí claro recorre el anillo y el ojo se abre del todo.

**Primeros 5 segundos.** Se ve que alguien lo dirigió (intención), el propósito está escrito en grande (propósito) y el sitio reacciona al visitante desde el primer segundo (ganas).

**Experiencia 100 % scroll.** No hay modo presentación ni diapositivas. Todo ocurre en una página continua guiada por ScrollTrigger (pin + scrub), con anclas para saltar.

---

## 1 · No negociables (resumen de CLAUDE.md)

1. **Nada inventado.** Lo que falte va como `[PENDIENTE: …]` y se ve en un recuadro punteado acero (`.pendiente`, `FX.pintar`). Los valores numéricos desconocidos son `null`: la visualización dibuja su **estructura vacía** (acero punteado), nunca números falsos.
2. **Contenido fuera del HTML:** todo texto vive en `site/data/semanas.js`.
3. **Sin build:** HTML + CSS + JS vanilla, scripts clásicos con `defer` (nada de módulos ES con imports relativos: fallan en `file://`). Funciona con `file://` y en Cloudflare Pages.
4. **Legible:** contraste ≥ 4,5:1 en todo texto; reflexión a 60–75 caracteres (`--medida-lectura: 66ch`).
5. **60 fps:** se anima `transform`/`opacity` (y `clip-path` en pocas piezas). Canvas con DPR acotado, pausado fuera de vista.
6. **Accesible:** HTML semántico, teclado completo, foco visible (anillo rubí claro), `aria-hidden` en todo lo decorativo, texto real siempre en el DOM. `prefers-reduced-motion` → **estado final estático**, sin pin largo, sin Lenis.
7. **Responsive real** desde 360 px, sin scroll horizontal (`overflow-x: clip` en `html`).
8. **Imprimible:** carta, fondo blanco, una semana por página (`css/print.css` + reglas por bloque).
9. **Español colombiano** impecable, primera persona en los textos de Heiner.
10. **Prohibido:** emojis, efecto Matrix, terminal verde, degradados (arcoíris, morado/azul), glassmorphism, sombras suaves por todos lados, íconos de librería decorativos, Inter/Roboto/Poppins/Segoe UI, hero centrado título+subtítulo+botón, tarjetas idénticas sin intención, secciones que solo aparecen con fade-up, personajes/logos/frases de obras con derechos.

---

## 2 · Paleta «Hielo y rubí»

Fuente: `docs/diseno/paleta/` (referencia, no se publica). Tokens en `site/css/tokens.css` (única fuente de color).

| Token | Hex | Uso | Contraste sobre noche |
|---|---|---|---|
| `--noche` | `#0A0B0E` | Fondo (≈64 %) | — |
| `--grafito` | `#12141A` | Superficies: bloques, visualizaciones (≈14 %) | — |
| `--pizarra` | `#1B1E25` | Elevado, separadores sólidos, hover | — |
| `--escarcha` | `#F4F6F8` | Títulos y números grandes | 18,2:1 |
| `--hielo` | `#DCE1E6` | Texto principal, anillo y párpados del símbolo | 15,0:1 |
| `--niebla` | `#8F96A0` | Texto secundario, etiquetas, fibras del iris | 6,6:1 (5,6 sobre pizarra) |
| `--acero` | `#5D6672` | Dial, líneas, pendientes. **Nunca texto** | 3,4:1 |
| `--rubi` | `#E23E57` | Cerradura, fragmento, CTA (≈2 %) | 4,7:1 (texto solo ≥ 18 px sobre noche) |
| `--rubi-hondo` | `#9E2338` | Pressed, halos | — |
| `--rubi-claro` | `#FF7A8E` | Foco, destello final | 7,9:1 |

Reglas: **el rubí late dos veces** (cerradura y fragmento) y en la acción principal; nunca como relleno grande salvo un instante. **Texto sobre rubí = `--noche`**, nunca blanco. Estados de semana: **completada = hielo lleno · en curso = rubí · pendiente = acero punteado**. Ya no existen verde, azul, naranja, latón ni marfil.

---

## 3 · Tipografía

| Rol | Familia | Carga | Uso |
|---|---|---|---|
| Display | **Zodiak** variable (100–900) | local: `site/assets/fonts/zodiak-variable.woff2` (preload en http(s)) | Nombre (peso 200), números de semana como plano, títulos de escena |
| Lectura | **Newsreader** (opsz, 300–600, itálica) | Google Fonts | Reflexión, propósito, textos de bloques, lección |
| Dato | **Martian Mono** `wdth 75` (300–500) | Google Fonts | Fichas de créditos, `SEMANA 04`, estados, cifras tabulares |

Tamaños en tokens (`--t-gigante`, `--t-nombre`, `--t-titulo`, `--t-lectura`, `--t-dato` ≥ 12 px). La mono solo lleva **datos verdaderos**; nada de etiquetas decorativas sobre títulos "porque sí".

---

## 4 · El emblema (definitivo)

Referencia exacta: `docs/diseno/simbolo-vivo/SimboloVivo.dc.html` (servir la carpeta con `python3 -m http.server` y abrir; es una maqueta React, **no se copia**). Archivos del sitio: `site/assets/emblema.svg` (completo, se pega **inline**), `marca.svg` (tamaños medianos, encabezado), `favicon.svg`.

### 4.1 Contrato de ids (viewBox 400×400, centro 200,200)

| id | Qué es | Color |
|---|---|---|
| `#simbolo-dial` | Dial de caja fuerte (dos coronas de marcas + `#simbolo-indice`) | acero (índice escarcha) |
| `#simbolo-orbita` | Órbita punteada r=160 | hielo 35 % |
| `#simbolo-todo` | Anillo abierto r=140 + `#simbolo-hr` (iniciales) + `#simbolo-pulso` (r=140, rubí claro, opacidad 0) | hielo |
| `#simbolo-ojo` | Grupo que parpadea: `#simbolo-horizonte`, `#simbolo-pliegue`, `#simbolo-parpados`; el iris va recortado por `#simbolo-clip-ojo` | hielo |
| `#simbolo-iris` | `#simbolo-fibras`, `#simbolo-iris-borde`, `#simbolo-pupila-fondo` (r 22→27) y **`#simbolo-pupila` = la cerradura** | niebla; cerradura rubí |
| `#simbolo-fragmento` | Arco faltante + `#simbolo-bits`. **Separado `translate(23,-7)` · encajado `translate(0,0)`** | rubí |

La forma no se rediseña. Se permite: mover colores a variables CSS, añadir clases, envolver grupos para animar.

### 4.2 Comportamiento (fiel al prototipo)

1. **Iris sigue el cursor:** `x = clamp(dx·0,14, ±28)`, `y = clamp(dy·0,07, ±11)` en unidades del viewBox, suavizado (`gsap.quickTo`, 0,35 s, `expo.out` ≈ la transición del prototipo). Sin movimiento del puntero por 2 s → mira a su alrededor solo (cada ~2,4 s, x ±20, y ±7). En táctil: el iris reacciona al scroll (velocidad/dirección).
2. **Parpadeo:** `#simbolo-ojo` → `scaleY(0.06)` por 150 ms (origen 200,200) cada ~4,2 s, con leve azar.
3. **Dial = combinación:** `#simbolo-dial` rota con el scroll (progreso global × 360° + offset por semana, con un pequeño retén al pasar cada semana). **El progreso de la página acerca el fragmento**: `translate(23(1−p), −7(1−p))`; los bits se desvanecen hacia `1 − 0,7p` y desaparecen al encajar.
4. **Clic/tap en la pupila** (r < 30 del centro): la cerradura rota 90° y escala 1,15 (origen 200,203), la pupila se dilata 22→27, las fibras pasan de opacidad 0,6 a 0,95. Otro clic la cierra. Es un `<button>` accesible (aria-pressed) superpuesto a la pupila.
5. **reduced-motion:** todo estático; el emblema en su estado según el progreso (sin parpadeo, sin seguimiento).

### 4.3 API (`js/simbolo.js`, constructor 1)

```js
// Controla cualquier copia del emblema. prefijo: '' para el de la portada ('simbolo-…'),
// u otro (p. ej. 'cierre-simbolo-') para una copia creada con FX.simbolo.montar.
var ctl = FX.simbolo.controlar(svgEl, { prefijo: 'simbolo-' });
ctl.mirar(x, y);            // iris a (x,y) en unidades del viewBox (se acota y suaviza)
ctl.vivo(true|false);       // activa/pausa seguimiento, mirada autónoma y parpadeo
ctl.parpadear();
ctl.setDial(grados);
ctl.setFragmento(p);        // 0 = separado (23,-7) · 1 = encajado (0,0); bits se desvanecen
ctl.cerradura(abierta);     // rota 90°/escala 1.15, pupila 27, fibras 0.95
ctl.abrirOjo(p);            // 0 normal → 1 "abierto del todo" (párpados se separan, iris crece) — para el cierre
ctl.pulso();                // destello rubí claro por #simbolo-pulso (2 ondas, 1,4 s, como .sv-pulse)
// Copias:
var svg = FX.simbolo.montar(contenedor, { prefijo: 'cierre-simbolo-' }); // inserta una copia inline con ids prefijados
FX.simbolo.portada;          // controlador del emblema de la portada (lo crea portada.js/simbolo.js)
```

El hilo global (§5) lo conecta `simbolo.js` así: `FX.on('progreso', e => FX.simbolo.portada.setDial(...); setFragmento(e.p))`.

---

## 5 · Estructura de la página y el hilo

Orden: **Portada → (entrada por la pupila) → Semana 01 … Semana N → Cierre final → pie.** El índice es un panel que se abre desde el encabezado.

**El hilo del fragmento avanza continuo por toda la página.** `core.js` publica `FX.on('progreso', {p})` (0–1 de toda la página) y `FX.on('semana', {k, total})`. Lo leen a la vez:
- el emblema de la portada (dial y fragmento) mientras está en pantalla;
- **la marca del encabezado** (`marca.svg` inline animable: su fragmento se acerca con `p`);
- **la tira de la combinación** (semanas marcadas 01…k de N);
- el índice (arco de la semana actual en rubí);
- el cierre final (arranca en el `p` real y completa el encaje).

**Contador sincronizado (corrige el defecto de A):** `FX.estado.semana` cambia cuando la cabecera de la semana cruza el 50 % del viewport. Para la semana 01, la portada llama `FX.fijarSemana(1)` **en el cuadro en que el hueco de la pupila cubre la pantalla** (y `FX.fijarSemana(0)` al volver; `FX.fijarSemana(null)` al terminar el pin para devolver el control).

---

## 6 · Portada y entrada por la pupila (constructor 1)

Base: el prototipo `docs/laboratorio/direccion-a/` (antes en site/lab) (léelo: `principal.js`, `particulas.js`, `estilos.css`). Se adapta al emblema y la paleta nuevos.

**Layout 1440.** Retícula de 12 columnas, margen 40. Nombre en Zodiak 200 gigante, en dos líneas escalonadas ("Heiner" / "Rincón") a la izquierda; el emblema vivo a la derecha (≈ 44–48 vw, sangrando hacia el borde); propósito en Newsreader (`--t-proposito`) bajo el nombre; ficha de créditos tipo afiche (Martian Mono: Autor, Código A00402510, Programa · 8.º semestre, Materia · 2026-2) abajo. **No centrado, no simétrico.** **Layout 390:** nombre arriba en dos líneas, emblema grande debajo, propósito y ficha en una columna; pista de interacción en una sola línea o nada en táctil.

**Entrada (al cargar, ≈ 2,4 s):** las partículas (§10) salen de la pupila y ensamblan el emblema; el canvas cede al SVG nítido; el fragmento queda **separado** (23,−7). El nombre se revela con máscara por líneas. **En reposo el emblema es el vector nítido y vivo** (iris, parpadeo); las partículas solo reaparecen cuando el cursor se acerca o se toca el emblema.

**Entrada por la pupila (pin + scrub, ≈ 150 svh escritorio / 110 svh móvil):**
1. El nombre se abre como telón; la sala se oscurece; el ojo se abre un poco.
2. La cámara hace zoom hacia **`#simbolo-pupila`** (la cerradura). El hueco de la cerradura se convierte en una ventana (máscara SVG del contorno de la cerradura) que crece hasta cubrir la pantalla.
3. **Qué se ve por la cerradura (corrige el defecto de A):** desde el primer instante del zoom, por el hueco se ve el **plano de la semana 01**: el «01» gigante en Zodiak escarcha y la etiqueta `SEMANA 01`, **centrados en el punto de la pupila** — no el borde de la reflexión. Se logra con una capa fija (`.portada__mirilla`) que contiene la composición de la cabecera de la semana 01 centrada en la pupila y que, al terminar el zoom, coincide píxel a píxel con la cabecera real (sin salto).
4. En el cuadro en que el hueco cubre la pantalla: `FX.fijarSemana(1)`, la tira marca 01, corte limpio a la sección real.

**reduced-motion:** portada estática completa y la semana 01 debajo, sin pin.

---

## 7 · Plantilla de semana y visualizaciones (constructor 2)

**DOM que pinta `js/semana.js`** dentro de `#semanas`, por cada semana k:

```html
<div class="transicion" data-desde="k-1" data-hacia="k" aria-hidden="true"></div>   <!-- solo k > 1; lo anima transiciones.js -->
<section class="semana" id="semana-0k" data-semana="k" data-estado="pendiente" aria-labelledby="semana-0k-titulo">
  <header class="semana__cabecera">          <!-- «0k» gigante como plano + SEMANA 0k · fecha · estado + h2 título -->
  <div class="semana__reflexion">            <!-- Newsreader, 66ch -->
  <div class="semana__bloques">              <!-- un .bloque por bloque, con data-viz="tipo" -->
  <div class="semana__cierre" data-semana="k"></div>   <!-- lo pinta cierre-semana.js con semana.leccion -->
</section>
```

Cabecera (de A, corregida): el número es un **plano de cine** (Zodiak 100–200, `--t-gigante`), que entra completo o sangra por el borde, **nunca cortado por una hairline**; ficha `SEMANA 0k · FECHA · ESTADO` en mono; título h2 en Zodiak. Al llegar a cada semana las **partículas forman su número** (§10) y ceden al número tipográfico.

**Librería `js/viz.js`** — `FX.viz.pintar(tipo, contenedor, datos)` devuelve `{ entrar(), estadoFinal() }`. Cada viz se anima **al entrar en pantalla** (ScrollTrigger `onEnter`/scrub corto), tiene estado final estático para reduced-motion e impresión, y con datos `null`/`[PENDIENTE]` dibuja su estructura vacía en acero punteado.

| viz | Semana | Qué hace | `datos` |
|---|---|---|---|
| `tachado` | 01, 07 | El "antes" se tacha con una línea que se dibuja y el "después" lo reemplaza | `{ pares: [{antes, despues}] }` |
| `checklist` | 02, 05, 06, 10 | Chulos SVG que se dibujan (DrawSVG) uno por uno | `{ items: [texto] }` |
| `imagen` | 02 | Evidencia (img real en `site/assets/img/`) o marco vacío pendiente | `{ src, alt }` |
| `escalera` | 03 | Columnas que suben en escalera con su etiqueta | `{ unidad, items: [{etiqueta, valor, nota}] }` |
| `tarjetas` | 04 | Tarjetas con inclinación 3D al cursor y brillo que sigue el puntero (no glass, no sombras difusas) | `{ tono: 'fortaleza'|'mejora', items: [{nombre, texto}] }` |
| `anillos` | 05 | Anillos radiales concéntricos D/I/S/C que se llenan | `{ maximo, dimensiones: [{letra, nombre, valor}] }` |
| `waffle` | 05 | Rejilla 10×10 que se llena en barrido | `{ total, valor, etiqueta, texto }` |
| `flujo` | 07 | Nodos S→T→A→R unidos por líneas con pulsos que viajan | `{ pasos: [{letra, nombre, texto}] }` |
| `maquina` | 06, 09, 10 | Escritura tipo máquina con cursor (texto real accesible aparte; pendiente no se escribe) | `{ texto }` |
| `contador` | 08 | Cifras que cuentan hasta su valor (tabulares) | `{ items: [{valor, etiqueta}] }` |
| `texto` | varias | Párrafo de lectura | `{ texto }` |

Las técnicas vienen de `docs/recursos/TECNICAS.md` (análisis de la presentación de referencia): se reutiliza el **cómo**, nunca el look.

**Tira de la combinación (`js/combinacion.js`, de B):** en el encabezado, N casillas `01…N`; las recorridas se marcan en hielo, la actual en rubí, las futuras en acero punteado; avanza con `FX.on('semana')`. Clic en una casilla = ancla a esa semana.

---

## 8 · Cierres y transiciones (constructor 3)

**Cierre de semana (la lección clave).** Reemplaza al GIRO. Tiene que destacar la lección de forma **memorable, propia y conectada con el concepto**. Se exploran **3 alternativas** con prototipo rápido en `docs/laboratorio/cierre-semana/` (antes en site/lab; ya no se publica) (alt-1, alt-2, alt-3, cada una con su `index.html`) y el **crítico** elige. Pista (no obligatoria): una **linterna** que sigue el cursor sobre un campo oscuro y revela un texto oculto (el observador, los trucos bajo la manga); en móvil y con reduced-motion se revela sola; el texto siempre es accesible (está en el DOM, no en canvas). `leccion` en `[PENDIENTE]` se muestra tal cual (recuadro punteado), sin efecto de revelado.

**Transiciones entre semanas** (`.transicion` entre secciones): **persianas** (franjas que se cierran/abren) y **entrada 3D** (la escena siguiente entra con perspectiva) **guiadas por scrub**, sin cambiar el modelo de página continua. Duración ≈ 60–80 svh. Con reduced-motion: un separador estático.

**Cierre final (`#cierre`):** el dial completa la combinación (vuelta final con retenes), **el fragmento encaja** (`setFragmento(1)`), los bits se desvanecen, **pulso de `--rubi-claro` por el anillo** (`pulso()`), **el ojo se abre del todo** (`abrirOjo(1)`) y las **partículas forman el emblema completo** (muestreando `emblema.svg`) antes de ceder al SVG nítido. Mensaje final desde `BITACORA.cierre.mensaje`. Pie con autor/código/materia/periodo.

---

## 9 · Encabezado, índice y cursor (constructor 4)

- **Encabezado** fijo y discreto: `marca.svg` inline a la izquierda (su fragmento avanza con `p`; enlace a `#portada`), la tira de la combinación al centro (constructor 2), botón **Índice** a la derecha. Aparece después de la portada (no compite con ella).
- **Índice = anillo de N arcos** (N = `semanas.length`): un SVG circular dividido en N arcos con hueco entre ellos; estado por arco (completada hielo lleno · en curso rubí · pendiente acero punteado); la semana actual con un índice tipo dial. Hover/foco ilumina el arco y muestra número y título. Es un diálogo accesible (abre con el botón, Esc cierra, foco atrapado, navegación por flechas) y cada arco es un enlace ancla (`FX.irA('#semana-0k')`). Lista textual equivalente para lectores de pantalla.
- **Cursor de ojo** (solo `pointer: fine`, sin reduced-motion): un ojo pequeño que reemplaza al cursor en la portada, en los cierres de semana y en el cierre final; se cierra sobre el emblema, se abre sobre enlaces; en la lectura vuelve el cursor del sistema. Nunca queda "pintado" al hacer scroll.

---

## 10 · Partículas (constructor 1; usadas por 2 y 3)

Un único canvas fijo (`#particulas`), `aria-hidden`, DPR ≤ 2 (≤ 1,5 móvil), pausado cuando no hay formación activa. Muestreo de destinos una sola vez y en caché. Presupuesto: **≤ 2 500 partículas escritorio, ≤ 900 móvil** (bajar si el fps cae). Partículas-glifo durante el vuelo (atlas pre-renderizado, nunca `fillText` por partícula), puntos al llegar. Repulsión suave al cursor (radio ~80 px).

```js
FX.particulas.formarTexto(texto, elDestino, opciones)  // forma «03» sobre la caja de elDestino (fuente Zodiak) y cede al texto real
FX.particulas.formarSVG(svgEl, opciones)               // forma el emblema (muestrea por partes con sus colores) y cede al SVG
FX.particulas.dispersar(opciones)                      // suelta y apaga
// opciones: { desde: 'pupila'|'disperso'|{x,y}, duracion, alTerminar: fn }
```

Con reduced-motion o si el canvas falla: no se usan; el destino se muestra directamente.

---

## 11 · Arquitectura y contratos

```
site/
  index.html            director (el bloque PORTADA:INICIO…FIN lo edita solo el constructor 1)
  data/semanas.js       director (contenido)
  css/tokens.css base.css print.css      director
  css/portada.css                        1
  css/semana.css combinacion.css viz.css 2
  css/cierre-semana.css transiciones.css cierre.css   3
  css/encabezado.css indice.css cursor.css            4
  js/core.js arranque.js                 director
  js/simbolo.js particulas.js portada.js 1
  js/semana.js combinacion.js viz.js     2
  js/cierre-semana.js transiciones.js cierre.js       3   (+ pie)
  js/encabezado.js indice.js cursor.js   4
  (los prototipos de laboratorio viven en docs/laboratorio/, no se publican)
  assets/emblema.svg marca.svg favicon.svg fonts/ img/
```

- **Nadie edita archivos de otro.** Si un constructor necesita algo de otro, lo pide en su entrega (el director integra).
- Cada módulo se registra con `FX.registrar(nombre, fn, orden)` (orden: 10 encabezado · 20 semana (DOM) · 30 símbolo/portada · 40 viz · 50 transiciones/cierres · 60 índice · 70 cursor · 80 partículas) y recibe `FX`. `arranque.js` llama `FX.iniciar()` tras DOM + fuentes.
- `FX` ofrece: `estado {reducido, punteroFino, movil, progreso, semana, total}`, `on/off/emitir`, `pintar(el, valor)`, `esPendiente`, `dos(n)`, `$/$$/crear`, `MQ` + `mm` (gsap.matchMedia), `irA(destino)`, `fijarSemana(k)`, `lenis`.
- Librerías (CDN, versión fija): GSAP 3.13.0 (gsap, ScrollTrigger, SplitText, CustomEase, DrawSVGPlugin, ScrambleTextPlugin, Flip) y Lenis 1.3.4. Ya están en `index.html`.
- Textos de interfaz (rótulos como "Índice", "Semana") pueden ir en el JS; **todo texto de Heiner, en `semanas.js`**.

---

## 12 · Sistema de movimiento

- Eases: `expo.out` / `power3.out` para entradas, `power2.inOut` para scrub, `CustomEase` "reten" para el dial. Duraciones: micro 0,15–0,35 s; entradas 0,8–1,2 s; pines 60–150 svh.
- **Nada aparece solo con fade-up.** Cada entrada cuenta algo: máscara, trazo que se dibuja, número que se forma, columna que sube.
- `FX.mm.add(FX.MQ, ctx => …)` para separar escritorio / móvil / reducido; los pines solo en escritorio y móvil con movimiento.
- Móvil: sin hover; lo que depende del cursor se reemplaza por scroll o toque; pines más cortos; partículas reducidas.
- Presupuesto: 60 fps en un portátil normal y en móvil medio; un solo canvas activo a la vez; `will-change` solo durante la animación.

---

## 13 · Verificación (todos)

- `node <scratchpad>/revisar.mjs /home/user/bitacora-pdp/site/index.html <salida>` (+ `reduced`): capturas a 1440 y 390 a lo largo del scroll, errores de consola, scroll horizontal, fps. Mirar todas las capturas.
- Detector: `.claude/skills/impeccable/scripts/bin/linux-x64/impeccable detect site/`.
- Cero errores de consola; sin scroll horizontal (también a 360); teclado; impresión.

---

## 14 · Referencias que siguen vivas

Prødux (fragmentos que convergen con scrub), 2xA Studio (descifrado por estados, si se usa en etiquetas), Revelatio (solo la palabra activa se enciende), Igloo (ensamblar = descifrar; plano técnico → sólido), Longbow (revelado por celdas), Quai (ensamblaje desde el origen, repulsión suave, "saltar animación"), David Whyte (máscaras entre escenas pineadas), y de la Fase 1 B: la combinación y el destello del anillo. Detalle en `docs/REFERENCIAS.md`. Técnicas de la presentación de referencia en `docs/recursos/TECNICAS.md`.
