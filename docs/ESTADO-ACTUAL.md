# Estado actual del proyecto (6 nov 2026)

Léelo justo después de `CLAUDE.md` al abrir un chat nuevo. Resume dónde quedó todo y qué sigue.

## Lo publicado
- Sitio en vivo: https://bitacora-pdp.pages.dev (Cloudflare Pages publica `site/` desde `main`).
- Último gran cambio: **rediseño «Niebla»** (Fase 2 de rediseño), fusionado en `main` desde la rama `fase-3/rediseno-niebla`. Incluye:
  - Nombre del sitio «Bitácora Heiner Rincón»; materia «Programa de Desarrollo Profesional I» (PDP I).
  - **Paleta pastel «Niebla»** (`site/css/tokens.css`). Los tokens viejos (`--noche`, `--hielo`, …) quedan como alias de los nuevos (`--fondo`, `--tinta`, …). El emblema se recolorea en tinta desde CSS, sin tocar su forma.
  - **Escena DISC** (`viz: "disc"`) en la semana 02: reemplaza la imagen del resultado. Valores y textos copiados exactos del formulario de la clase, sin nombrar la plataforma. Tiene scroll con pin en escritorio y DISC vinculado (hover o foco resalta una dimensión).
  - Anillos DISC de la semana 05 con los colores estándar: D `#D04A3C`, I `#9E7400`, S `#367F59` y C `#3B74BE`.
  - Autoanálisis (semana 04) dibujado como dial de caja fuerte; los valores no cambiaron.
  - Viñeta propia: la cerradura del emblema en miniatura.
  - Sin etiquetas visibles de estado («Completada», etc.); `data-estado` se conserva para la tira y el índice.
  - Lección clave como **tarjeta estática**, con halo al cursor (ya no es la «linterna»).
  - Portada sin pistas de interacción, con **constelación** en canvas (se pausa fuera de pantalla, en táctil y con reduced-motion) y **casillas magnéticas** (tira e Índice).
  - **14 semanas:** 1–5 con contenido; 6–14 en `[PENDIENTE]`.
- La dirección vigente está en `docs/DIRECCION.md` **§0-bis**, que prevalece sobre el resto del documento (lo demás describe la versión oscura anterior).

## Calidad verificada antes de fusionar
- 0 errores de consola y sin scroll horizontal a 360, 390 y 1440 px, con movimiento normal y reducido.
- Contraste ≥ 4,5:1 en todo el texto visible (medido con un script).
- Portada a ~60 fps con el mouse moviéndose.
- `impeccable detect site/`: 0 anti-patrones; quedan 2 avisos que ya existían (el emblema inline y las rayas punteadas).

## Pendientes del sitio
1. **Contenido de las semanas 6–14.** Heiner lo pasa después. **Nunca se inventa**: se reemplazan los `[PENDIENTE]` en `site/data/semanas.js` con lo que él entregue. Las semanas 11–14 tampoco tienen título todavía.
2. **Mensaje final** (`BITACORA.cierre.mensaje`) en `[PENDIENTE]`.
3. **«Desliza para entrar»** (portada): decidir si se queda (es el enlace para bajar a la semana 01).
4. **Auditoría de movimiento:** Heiner puede correr `/review-animations` (skill instalada; solo se invoca a mano).
5. **Documentos personales en el repo público:** `docs/recursos/` (PDF del DISC con la plataforma, HTML de WorkClue, `.docx` del curso) sigue versionado. Si Heiner decide sacarlo: `git rm -r --cached` de esos archivos + `.gitignore`, conservando `docs/recursos/TECNICAS.md`. Siguen en el historial; limpiarlo es un paso aparte.
6. `docs/BRIEF.md`, `docs/PLAN.md` y `docs/CONTENIDO.md` todavía hablan de FRAGMENTO.EXE y de «Hielo y rubí». Son historia; si se tocan, que digan que la dirección vigente es §0-bis.

## Cómo se trabajó la fase (para repetirlo)
- **Orquestador agy** (`/orquestador-agy`): Claude Code planea y escribe un prompt; agy (Argon 4, máximo 3 obreros) implementa; Claude Code revisa el diff real, corre los scripts de verificación y decide PASA/CORREGIR. Git queda en solo lectura para los agentes.
- Los planes, prompts, reportes, scripts `verificar.sh` y capturas están en `.orquestador/fase2/`. Esa carpeta está en `.gitignore`: es local, no está en el repo.
- Las verificaciones reutilizables usan Playwright con el Chromium en caché (`.orquestador/fase2/herramientas/lib.mjs`): contraste, consola, scroll horizontal, fps, pausa del canvas y datos DISC.

## Skills del proyecto que se agregaron en esta fase
`emil-design-eng`, `choreograph`, `review-animations` (Emil Kowalski, solo Markdown) y `find-skills`. Están en `.claude/skills/`.
