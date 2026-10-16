# Bitácora PDP · Heiner Rincón — Manual del proyecto

Lee este archivo completo al iniciar cualquier sesión. Luego lee, según la tarea, los documentos de `docs/`.

## Qué estamos construyendo

La bitácora semanal de **Heiner Danit Rincón Carrillo** (código A00402510, Ingeniería de Sistemas, 8.º semestre) para la materia **Proyecto de Desarrollo Personal I (PDP I)**: una reflexión por semana sobre lo trabajado en clase (autoconocimiento, pruebas de selección, hoja de vida, entrevistas, marca personal, búsqueda de práctica).

No es un PDF de plantilla: es un **sitio web de una sola página**, publicado en **Cloudflare Pages**, que funciona también como pieza de marca personal (irá en su LinkedIn; su rol objetivo es Analista de Seguridad Junior / práctica en ciberseguridad).

**La meta, en palabras de Heiner:** que el profesor vea en los primeros 5 segundos el **propósito, la intención y las ganas** con que se hizo, y que se dé cuenta de **todo lo que se puede hacer con la tecnología cuando se sabe usar**. Tiene que verse **innovador, profesional y serio** — de nivel Awwwards, no de plantilla.

> Un primer intento quedó correcto pero **nada innovador** porque el brief pedía sobriedad. Este proyecto arranca de cero con otra ambición: **atrévete**. Lo que no se negocia es la legibilidad, el rendimiento y la accesibilidad (ver "Reglas no negociables").

## Documentos de contexto (léelos)

| Archivo | Qué contiene | Cuándo leerlo |
|---|---|---|
| `docs/BRIEF.md` | Quién es Heiner, el concepto FRAGMENTO.EXE, el símbolo HR, la dirección visual de partida | Siempre antes de diseñar |
| `docs/CONTENIDO.md` | Estructura de la bitácora, semanas, modelo de datos, reglas de contenido | Antes de tocar estructura o textos |
| `docs/PLAN.md` | Fases del proyecto, forma de trabajar, despliegue | Al iniciar cada fase |
| `docs/REFERENCIAS.md` | Páginas de referencia de diseño que eligió Heiner | En la fase de dirección creativa |

## Estructura del repo

```
CLAUDE.md                 ← este manual
docs/                     ← contexto del proyecto (no se publica)
site/                     ← LO ÚNICO QUE SE PUBLICA (Cloudflare Pages: build output = site)
  index.html
  css/  js/  data/  assets/
assets/simbolo-hr.svg     ← fuente original del símbolo (copiar a site/assets/)
.claude/skills/           ← skills de diseño instaladas
.claude/agents/           ← subagentes
```

Todo lo publicable va dentro de `site/`. Nunca pongas archivos del sitio fuera de esa carpeta.

## Skills disponibles y cuándo usarlas

- **frontend-design** — dirección estética e intención antes de escribir código.
- **design-taste-frontend** (taste-skill) — filtro anti "look de IA"; tiene librería de referencias (`library/`).
- **ui-ux-pro-max** — catálogo de estilos, paletas, tipografías y reglas UX; úsalo para explorar opciones, no para imponer un estilo genérico.
- **impeccable** — `/impeccable <comando>`: `critique`, `audit`, `polish`, `bolder`, `quieter`, `animate`, `typeset`, `layout`, `delight`, `overdrive`, `harden`, `optimize`, etc. Úsalo para revisar y elevar lo construido. Tiene subagentes propios en `.claude/agents/`.
- **gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-plugins, gsap-performance, gsap-utils** — toda animación se hace con GSAP siguiendo estas skills (ScrollTrigger, SplitText, Flip, etc. son gratuitos).

## Trabajo con subagentes

Heiner quiere que el trabajo se haga con **varios subagentes en paralelo** para que el resultado sea de alto nivel. Regla general:

- Tú eres el **director**: divides, asignas, integras y decides.
- Lanza subagentes en paralelo para tareas independientes (analizar referencias, construir secciones distintas, auditar). Dales a cada uno un encargo claro, los archivos que puede tocar y el formato de su entrega.
- Dos subagentes nunca editan el mismo archivo a la vez.
- Cada entrega de un subagente se integra y se revisa antes de seguir.
- La estrategia detallada de subagentes por fase está en `docs/PLAN.md`.

## Reglas no negociables

1. **No inventar contenido.** Nada de reflexiones, datos personales, resultados de pruebas o experiencias inventadas. Lo que falte queda como `[PENDIENTE: qué falta]`.
2. **Contenido separado del diseño:** todo el texto vive en `site/data/semanas.js` (`window.BITACORA = {...}`), no en el HTML.
3. **Sin build:** HTML + CSS + JS vanilla. Librerías por CDN con versión fija (GSAP, Lenis, Three.js u otras si se justifican). Debe funcionar abriendo `index.html` y desde Cloudflare Pages.
4. **Legible siempre:** texto con contraste ≥ 4.5:1; la reflexión de cada semana se lee cómoda (líneas de ~60–75 caracteres).
5. **Rendimiento:** 60 fps en un portátil normal; anima `transform`/`opacity`; WebGL/canvas solo si aporta y con fallback.
6. **Accesible:** HTML semántico, navegación por teclado, `alt`, y respeto total de `prefers-reduced-motion` (estado final sin movimiento).
7. **Responsive real:** impecable en móvil (desde 360px) y escritorio. Sin scroll horizontal.
8. **Imprimible:** hoja `@media print` (carta, una semana por página) para exportar a PDF desde Chrome.
9. **Español colombiano** impecable: tildes, concordancia, primera persona.
10. **Nada de** emojis, efecto Matrix, terminal verde sobre negro, ni personajes/logos/frases de obras con derechos (las referencias de Heiner son solo mood).

## Flujo de trabajo y despliegue

- Cloudflare Pages publica `site/` desde `main` → `https://bitacora-pdp.pages.dev`.
- Cada rama distinta de `main` genera un **link de vista previa** automático en Cloudflare. Para cambios grandes, trabaja en una rama, empuja y dale a Heiner el link de vista previa para que apruebe antes de fusionar.
- Revisa visualmente con Playwright (capturas a 1440px y 390px) antes de dar algo por terminado.
- Commits pequeños y descriptivos en español.
- Al terminar cada etapa: resumen corto de qué cambió, qué falta y el link para verlo.
