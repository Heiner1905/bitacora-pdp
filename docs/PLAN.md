# Plan del proyecto

## Fases

| Fase | Objetivo | Estado |
|---|---|---|
| 0 · Infraestructura | Repo, skills, Cloudflare Pages, sesión remota | En cierre |
| 1 · Dirección creativa | Analizar referencias, definir lenguaje visual y los 3–4 momentos "wow" | Siguiente |
| 2 · Construcción | Construir el sitio con subagentes en paralelo | — |
| 3 · Revisión y pulido | Impeccable (critique, audit, polish), rendimiento, accesibilidad, móvil | — |
| 4 · Contenido | Pegar los textos reales de cada semana | En paralelo, fuera de esta sesión |
| 5 · Cierre | Versión impresa/PDF, Open Graph, revisión final, publicación en `main` | — |

La estrategia detallada de subagentes de cada fase se definirá con Heiner antes de ejecutarla y se agregará aquí.

## Principios de trabajo

- **Planear antes de construir:** al inicio de cada fase, propón el plan en pocas líneas (qué subagentes, qué hace cada uno, qué entrega) y espera la aprobación de Heiner.
- **Paralelo cuando se pueda:** tareas independientes → subagentes simultáneos. Integra y revisa cada entrega.
- **Ver antes de dar por hecho:** capturas con Playwright a 1440px y 390px; nada se marca como terminado sin verlo.
- **Vistas previas:** trabajo grande en rama → push → link de vista previa de Cloudflare para Heiner.
- **Comunicación breve:** al cerrar cada paso, qué cambió, qué falta y dónde verlo. Heiner prefiere información directa y organizada.

## Despliegue

- Cloudflare Pages conectado a `Heiner1905/bitacora-pdp`.
- Rama de producción: `main`. Build command: ninguno. Build output directory: `site`.
- Producción: `https://bitacora-pdp.pages.dev`. Cada rama genera su propio link de vista previa.
