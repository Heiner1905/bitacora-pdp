# Estado actual del proyecto (6 nov 2026)

Léelo justo después de `CLAUDE.md` al abrir un chat nuevo. Resume dónde quedó todo y qué sigue.

## Lo publicado
- Sitio en vivo: **https://bitacora-pdp.heinerdanitrincon.workers.dev/** (Cloudflare, publica `main`; Heiner verificó que funciona). Cada rama distinta de `main` genera su vista previa.
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
  - En ese momento: 14 semanas, 1–5 con contenido y 6–14 en `[PENDIENTE]` (ya resuelto, ver abajo).
- **Contenido completo** (rama `contenido/semanas-06-13`, fusionada en `main` el 6 nov 2026):
  - **13 semanas, todas con contenido.** La semana 14 (conversatorios) no entra. La tira y el índice salen de la longitud del array.
  - Textos de las semanas 6 a 13 copiados exactos de `docs/CONTENIDO-SEMANAS-06-14.md`.
  - **Mensaje de cierre** listo (frase atribuida a Tesla, con el ajuste de Heiner: «entender cómo funciona el universo»). Se bajó su cuerpo de letra para que quepa con el emblema.
  - **Bloque nuevo `enlace`** (`js/viz.js`, esquema en `docs/DIRECCION.md` §7): LinkedIn en la semana 10 y el pitch en video en la semana 11 (fachada que carga `youtube-nocookie` solo al hacer clic).
  - El cierre ya no muestra el rótulo «Combinación completa · 13 semanas recorridas» (queda un h2 solo para lectores de pantalla). Heiner ajustó a mano textos de las semanas 9 y 13.
  - Tarjetas: los grupos de 4 van de a dos por fila y los de 5 centran la segunda fila.
- La dirección vigente está en `docs/DIRECCION.md` **§0-bis**, que prevalece sobre el resto del documento (lo demás describe la versión oscura anterior).

## Calidad verificada antes de fusionar
- **Rama `contenido/semanas-06-13`** (script `.orquestador/fase2/herramientas/contenido.mjs`, 86 chequeos): a 360, 390 y 1440 px, con movimiento normal y reducido: 0 errores de consola, sin scroll horizontal, ningún `[PENDIENTE` visible, 13 casillas en la tira y en el índice, ningún «14» en el texto, contraste ≥ 4,5:1 en semanas y cierre, las 3 máquinas completas con reduced-motion, enlaces correctos (pestaña nueva, `noopener noreferrer`) y el video carga solo al hacer clic (también con teclado). Impresión carta: una semana por página, URL completa en texto, 36 páginas. `impeccable detect site/`: 0 anti-patrones.
- Rediseño «Niebla»:
- 0 errores de consola y sin scroll horizontal a 360, 390 y 1440 px, con movimiento normal y reducido.
- Contraste ≥ 4,5:1 en todo el texto visible (medido con un script).
- Portada a ~60 fps con el mouse moviéndose.
- `impeccable detect site/`: 0 anti-patrones; quedan 2 avisos que ya existían (el emblema inline y las rayas punteadas).

## Pendientes del sitio
1. **«Desliza para entrar»** (portada): decidir si se queda (es el enlace para bajar a la semana 01).
2. **Auditoría de movimiento:** Heiner puede correr `/review-animations` (skill instalada; solo se invoca a mano).
3. **Documentos personales en el repo público:** `docs/recursos/` (PDF del DISC con la plataforma, HTML de WorkClue, `.docx` del curso) sigue versionado. Si Heiner decide sacarlo: `git rm -r --cached` de esos archivos + `.gitignore`, conservando `docs/recursos/TECNICAS.md`. Siguen en el historial; limpiarlo es un paso aparte.
4. `docs/BRIEF.md`, `docs/PLAN.md` y `docs/CONTENIDO.md` todavía hablan de FRAGMENTO.EXE y de «Hielo y rubí». Son historia; si se tocan, que digan que la dirección vigente es §0-bis.

## Cómo se trabajó la fase (para repetirlo)
- **Orquestador agy** (`/orquestador-agy`): Claude Code planea y escribe un prompt; agy (Argon 4, máximo 3 obreros) implementa; Claude Code revisa el diff real, corre los scripts de verificación y decide PASA/CORREGIR. Git queda en solo lectura para los agentes.
- Los planes, prompts, reportes, scripts `verificar.sh` y capturas están en `.orquestador/fase2/`. Esa carpeta está en `.gitignore`: es local, no está en el repo.
- Las verificaciones reutilizables usan Playwright con el Chromium en caché (`.orquestador/fase2/herramientas/lib.mjs`): contraste, consola, scroll horizontal, fps, pausa del canvas y datos DISC.

## Skills del proyecto que se agregaron en esta fase
`emil-design-eng`, `choreograph`, `review-animations` (Emil Kowalski, solo Markdown) y `find-skills`. Están en `.claude/skills/`.
