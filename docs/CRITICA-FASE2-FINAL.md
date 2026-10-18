# Crítica independiente · Fase 2 · Evaluación final · FRAGMENTO.EXE

Revisión en modo jurado, solo de lectura: no toqué `site/` ni hice commits. Fecha: 2026-10-18.

**Nota de transparencia.** Debía calificar antes de leer las rondas anteriores. Al empezar abrí por error las primeras 60 líneas de `CRITICA-FASE2-R2.md` (método y tabla de notas). Para compensar, cada nota de abajo se apoya en capturas y mediciones propias de esta ronda. Leí `CRITICA-FASE2.md` completo y el resto de R2 solo después de fijar las notas.

## Método

**1. Script del proyecto.** Corrí `revisar.mjs` en modo normal y en `reduced` (prefijos `p` y `p-rm` en `scratchpad/critica-f2fin/`).
- Cero errores de consola.
- Sin scroll horizontal ni a 1440 ni a 390.
- 61 fps en reposo.

**2. Recorrido propio con Playwright** (`scratchpad/fin/rec.mjs`):
- Sitio servido por http, con `?demo-viz`.
- Una lección de muestra inyectada por `page.route` (sin editar `semanas.js`) para poder juzgar la linterna.
- 101 capturas a 1440 y 96 a 390:
  - la carga a 0,5, 1,5 y 3 s;
  - el cursor sobre el emblema y el clic en la pupila;
  - la entrada por la pupila en 12 cuadros;
  - un barrido cada 4 %;
  - 9 cuadros por cada una de las tres variantes de transición: dial (→02), párpado (→05) y cerradura (→08), más la llegada;
  - la linterna;
  - el cierre en 15 cuadros más el estado final;
  - scroll rápido abajo, arriba y un salto al 45 %.

**3. Pruebas complementarias** (`scratchpad/fin/extra.mjs`, `chk*.mjs`):
- fps por tramo con CPU 1x y 4x a 1440, y 4x en 390 móvil emulado (CDP `Emulation.setCPUThrottlingRate`);
- 360 px;
- teclado: Tab, índice con Enter, flechas, foco atrapado y Esc;
- tamaño de los objetivos táctiles;
- PDF carta con `page.pdf`.

**4. Referencia.** Comparé con `SimboloVivo.dc.html` (servido en el puerto 8095).

**5. impeccable.** Usé `critique` y `audit`, y corrí el detector sobre `site/` y sobre la página servida (1280 y 390).

### Capturas guardadas en `docs/critica/`

| Archivo | Qué muestra |
|---|---|
| `f2fin-01-portada-3s-1440.png` | Portada en reposo: nombre en Zodiak 200, emblema entero con el fragmento separado, ficha de afiche. |
| `f2fin-02-entrada-cerradura-1440.png` | La entrada: el contorno rubí de la cerradura es la ventana y por ella ya se ve «01 · SEMANA 01». |
| `f2fin-03-leccion-tapada-por-dial-390.png` | Móvil: la lección clave de la semana 01 queda cortada por las cuñas del dial de la transición siguiente. |
| `f2fin-04-cerradura-08-sobre-titulo-1440.png` | Variante cerradura (→08): el «08» aterriza encima de la ficha y del título, con el contorno de la cerradura girado sobre el contenido. |
| `f2fin-05-cierre-iris-ovalado-1440.png` | Estado final: el iris queda ovalado (217×253 px), con la firma, «Volver al inicio» y el pie. |
| `f2fin-06-cierre-pie-sobre-volver-390.png` | Móvil, durante el cierre: el pie («AUTOR…») se monta sobre «VOLVER AL INICIO». |

---

## Notas

| Criterio | Nota | Justificación |
|---|---|---|
| **a) No parece plantilla ni hecho con IA** | **7,0** | **Lo que es de autor.** La portada es asimétrica y tiene autor: el nombre en dos líneas escalonadas, el emblema que sangra y la ficha mono tipo créditos (`f2fin-01`). También lo tienen la entrada por la cerradura (`f2fin-02`), el índice-dial y el cierre. Las transiciones ya salen del emblema (dial, párpado, cerradura) y no de un catálogo de efectos.<br>**Lo que sigue siendo plantilla.** El cuerpo de cada semana es la receta editorial oscura de siempre: número gigante → h2 → recuadro → bandas de bloques con h3 a la izquierda y contenido a la derecha (`d1440/d-016`, `d-048`, `d-060`). Las tres retículas rotan, pero se leen como la misma.<br>**Tropos.** Las cuñas grises del dial son un *sunburst* de stock cuando no se lee el dial (`d1440/d-012`, `d-024`). Las barras de «texto clasificado» de la linterna son un cliché de hacker, aunque esté bien ejecutado. |
| **b) Momento compartible** | **8,0** | **La entrada por la pupila-cerradura** (`entrada-04…12`, `f2fin-02`). El ojo crece, las fibras del iris se abren como un diafragma, la cerradura rubí pasa a ser contorno y ventana, y por ella el «01» ya está en su sitio. El «01» termina sin salto en la cabecera real, y la tira marca 01 en ese mismo cuadro. Funciona igual en móvil (`d390/entrada-07…12`).<br>**El cierre es un buen segundo momento:** el emblema se forma con partículas, el dial gira, el fragmento encaja, sale el pulso rubí claro y aparece la firma (`cierre-05…final`). Le resta que durante ~50 % de su recorrido la mitad derecha queda vacía, con solo una hairline (`d1440/cierre-07…13`). |
| **c) Concepto** | **8,0** | Sube respecto a las rondas previas: cada recurso cuenta algo.<br>• **Hilo continuo.** La marca del encabezado termina **encajada en `translate(0,0)`**; antes se quedaba en `p=0,985`.<br>• **Tira y contador.** Concuerdan con la semana visible en todas las muestras.<br>• **Transiciones.** El dial gira (la combinación), el párpado se cierra y se abre (el observador) y la cerradura deja pasar a la semana (ver lo que otros no ven).<br>• **Lo que aún es decoración.** Las cuñas grises del dial, el anillo de puntos bajo el número y el «número fantasma» en contorno sobre la reflexión (`d1440/d-076`, «08» de trazo fino sobre el recuadro). |
| **d) Tipografía, ritmo, espaciado y detalle** | **6,5** | La escala del nombre y de los números sigue siendo excelente, y el trío Zodiak / Newsreader / Martian Mono funciona. Bajan la nota defectos de ejecución visibles:<br>**(1) La transición siguiente se come la lección clave**, el clímax de cada semana. Pasa en móvil (`f2fin-03`, `d390/tr2-dial-1`, `-2`) y en escritorio (`d1440/d-032`, `tr2-dial-0`): las cuñas tapan la mitad del texto cuando todavía se está leyendo.<br>**(2) Variante cerradura.** El «08» aterriza sobre la ficha y el título («Secto[r] rol y»), con el contorno rubí de la cerradura girado y cruzado sobre la escena (`f2fin-04`; en móvil, `d390/tr8-cerradura-7`).<br>**(3) Números dobles en móvil.** El «07» y el «05» llevan una copia gris desplazada detrás (`d390/d-064`, `tr5-parpado-7`).<br>**(4) Cierre en móvil.** El pie se monta sobre «Volver al inicio» mientras se suelta el pin (`f2fin-06`).<br>**(5) Vacíos sin intención.** Media pantalla vacía en el cierre y largos tramos negros entre bloques (`d1440/d-056`, `d-072`).<br>**(6) Fuga en la entrada.** El h2 de la semana 01 asoma fuera de la ventana de la cerradura («s de la materia / laboral», `f2fin-02`).<br>**(7) Mono pequeña.** Las fichas mono en escritorio siguen pequeñas y con mucho tracking. |
| **e) Rendimiento y accesibilidad** | **8,0** | **Rendimiento con CPU 1x a 1440:** 59–60 fps en todos los tramos (entrada, dial, párpado, cerradura y cierre; p95 16,7 ms).<br>**Con CPU 4x a 1440:** entrada 51, dial 59, párpado 56, cerradura 60 y cierre 52 (p95 33 ms, máximo 83 ms).<br>**Con CPU 4x en 390 móvil:** 55–60 fps, con un pico de 267 ms en el cierre (la formación de partículas). Las mediciones se hicieron con otras dos sesiones de Chromium corriendo en paralelo, así que son una cota pesimista.<br>**Accesibilidad:**<br>• **Errores y layout.** Cero errores de consola y sin scroll horizontal a 360, 390 y 1440.<br>• **Teclado.** El enlace «Saltar a la semana 01» aparece primero en el orden de foco. El foco se ve en rubí claro, 2 px; en las casillas, por `::after`.<br>• **Índice.** Es un diálogo: el foco va al arco activo, las flechas funcionan, el foco queda atrapado, Esc lo cierra en ~1 s (cuando termina la animación) y el foco vuelve a «Índice».<br>• **Clic en la pupila.** Deja `aria-pressed=true`.<br>• **Reduced-motion.** Es estático y completo (`p-rm-*`).<br>• **Objetivos táctiles en móvil (resuelto).** La tira se vuelve un solo botón de 274×44 y el botón «Índice» mide 44×44.<br>**Fallas:** la consola sigue emitiendo el warning de GSAP «scaleX not eligible for reset», 87 veces en 120 pasos de rueda y 1 676 en el recorrido completo. Lo dispara el puntero; el origen probable es `gsap.quickTo(el,'scaleX')` en `js/cursor.js:52`. |
| **f) Fidelidad al emblema y la paleta** | **8,0** | **Fiel al prototipo.** El vector es idéntico a `SimboloVivo`: dial de dos coronas, órbita, anillo con HR, horizonte, pliegue, fibras, cerradura y fragmento a (23,−7) entero en pantalla. El iris sigue al cursor dentro del contrato (medí −25,9 / −8,6). El clic gira la cerradura y dilata la pupila (`pupila-clic`). El rubí queda en la cerradura, el fragmento, la casilla actual y la cerradura de la transición; el texto sobre rubí va en noche.<br>**Defecto nuevo: el iris del cierre se deforma.** `js/cierre.js:186` escala `#cierre-simbolo-ojo` en 1,08×1,26 para «abrir del todo», y ese grupo **contiene el iris**. El círculo queda ovalado (217×253 px medido) y casi toca el párpado (`f2fin-05`, `p-1440-100`). La forma del emblema no debería deformarse justo en el plano final. Además, en el pico del pulso el anillo se ve como un disco rosado relleno (`rapido-abajo`, `p-1440-100`). |
| **Nota global** | **7,6** | La apertura está a nivel de premio y el concepto ya amarra todas las piezas. La accesibilidad y el rendimiento son sólidos. Lo que separa al sitio de un 8,5 es la ejecución en tres puntos: la lección tapada por la transición siguiente, el aterrizaje de la variante cerradura y el iris deformado en el cierre. Detrás pesa el cuerpo de las semanas, que sigue siendo genérico. |

---

## Hallazgos de impeccable

⚠️ DEGRADED: single-context (esta sesión no expone una herramienta de subagentes). Hice la revisión de diseño (A) sobre mis capturas antes de interpretar el detector (B). El detector sobre `site/` corrió antes de cerrar A, pero sus dos avisos no cambiaron ninguna nota.

### Critique

- **Especificidad.**
  - Solo pueden ser de este sitio: la portada, la entrada, el índice-dial, las transiciones con piezas del emblema y el cierre.
  - Es intercambiable con cualquier caso de estudio oscuro: el interior de cada semana (bandas de bloque con h3 a la izquierda).
- **Recorrido emocional.**
  - El pico está en la entrada y el final ya es un clímax.
  - El valle está en las semanas 03 a 09: misma cadencia, transiciones que se repiten de 3 en 3 y vacíos.
  - La regla pico-final se cumple, pero el final pierde fuerza por la mitad derecha vacía.
- **Heurísticas** (7 y 10 = n/a, superficie de experiencia):

| # | Heurística | Nota | Comentario |
|---|---|---|---|
| 1 | Estado del sistema | 4 | Tira, contador «07 / 10», marca e índice siempre sincronizados. |
| 2 | Correspondencia con el mundo real | 3 | La metáfora caja fuerte / ojo / cerradura es clara. «Desliza para entrar» y la pista de la pupila orientan. |
| 3 | Control y libertad | 3 | Hay índice, enlace de salto, casillas que llevan a cada semana y «Volver al inicio». Los pines largos no se pueden saltar con un control propio. |
| 4 | Consistencia | 3 | Las tres variantes de transición son coherentes entre sí. El aterrizaje de la variante cerradura rompe el patrón. |
| 5 | Prevención de errores | 3 | No hay formularios. El scroll rápido no deja estados rotos (`rapido-*`). |
| 6 | Reconocer en vez de recordar | 3 | El índice muestra número, título y estado. |
| 7 | Flexibilidad | n/a | Superficie de experiencia. |
| 8 | Estética y minimalismo | 3 | Hay mucha contención. Restan las cuñas decorativas y los números fantasma. |
| 9 | Recuperación de errores | 3 | Hay recuadros `[PENDIENTE]` y aviso sin JS. |
| 10 | Ayuda | n/a | Superficie de experiencia. |
| **Total** | | **25/32** | Bueno. |

- **Persona «profesor que evalúa» (5 segundos):** propósito, nombre e intención se ven de inmediato. En móvil, durante 1,5 s solo hay un nombre a medio revelar (`d390/carga-500`, `carga-1500`).
- **Persona «reclutador en móvil»:** llega a la lección y una transición se la tapa (`f2fin-03`). Es el texto más valioso de cada semana.
- **Persona «teclado»:** el recorrido funciona. Al tabular desde la portada, el encabezado aparece encima de la portada (aceptable).

### Audit (técnico)

| # | Dimensión | Nota | Hallazgo clave |
|---|---|---|---|
| 1 | Accesibilidad | 3 | AA cumplida. La lección queda tapada a la vista, no en el DOM. Warnings de GSAP en consola. |
| 2 | Rendimiento | 3 | 60 fps con CPU 1x. Con 4x hay picos de 33–83 ms y de 267 ms en el cierre móvil. |
| 3 | Tematización | 4 | Todo el color sale de tokens. Los hex en `portada.css` solo mapean atributos del SVG a variables; `#000` va en máscaras y `#bbb` solo en impresión. |
| 4 | Responsive | 3 | Sin scroll horizontal a 360. Los objetivos táctiles miden 44 px. En móvil hay solapes durante el scrub (cierre, «08»). |
| 5 | Integridad de implementación | 3 | El sistema es coherente. Hay un fallo puntual en la composición de transformaciones del cierre (`cierre.js:186`). |
| **Total** | | **16/20** | Bueno. |

### Detector

**Sobre `site/` (solo regex): 0 antipatrones y 2 avisos.**
- `shape-assembled-illustration` en el emblema. Es un falso positivo: es el logotipo definitivo.
- `repeating-stripes-gradient` en `transiciones.css:21` e `indice.css:145`: el patrón de pendiente punteado. Es una decisión válida.

**Sobre la página servida (1280, `?demo-viz`): 14 hallazgos.**
- `cramped-padding` ×11 en `p.bloque__muestra`. Son las etiquetas «MUESTRA», que solo existen con `?demo-viz`.
- `oversized-h1` en `#portada-titulo`. Es un falso positivo: cuenta el sufijo `sr-only`; lo visible son dos palabras.
- **`line-length` ~93 caracteres en `p.viz-texto` (semanas 03 y 08). Es real:** el bloque `texto` no se acota a `--medida-lectura` en esa retícula.

**A 390:** 3 hallazgos, todos del mismo tipo.

### PDF

14 páginas carta. Todas las semanas conservan su número (corregido desde R2) y el cierre lleva el emblema encajado. Con datos de muestra, las semanas 02 y 05 se desbordan a una segunda página. El marco de imagen de muestra se imprime como bloque negro sólido, cosa que conviene evitar cuando sea un marco pendiente.

---

## Problemas que quedan (priorizados para la fase de pulido)

1. **[P1] La transición siguiente tapa la lección clave.** Pasa en todas las semanas, más grave en móvil (`f2fin-03`, `d1440/d-032`). La lección debe quedar libre hasta salir de pantalla: retrasar el `start` de la transición hasta que el `.semana__cierre` haya pasado el borde superior, o reservar un respiro de ~40 svh entre el cierre de semana y la `.transicion`.
2. **[P1] Variante cerradura (→08, 09, 10).** El número aterriza encima de la ficha y del título, y el contorno de la cerradura queda girado y cruzado sobre el contenido al final del scrub (`f2fin-04`, `d390/tr8-cerradura-7`). La cerradura debería salir del todo antes de que entre la cabecera real, y el número debería aterrizar en su caja.
3. **[P1] Iris ovalado en el cierre.** `js/cierre.js:186` escala el grupo `ojo`, que contiene el iris, en 1,08×1,26 (`f2fin-05`). Hay que escalar solo los párpados y el clip, o compensar el iris con `scaleY` inverso. El emblema no se deforma.
4. **[P2] Número doble en móvil** (el «07» y el «05» con una copia gris desplazada; `d390/d-064`, `tr5-parpado-7`), y «número fantasma» en contorno sobre la reflexión a 1440 (`d1440/d-076`). Debería haber un solo número.
5. **[P2] Ritmo del cierre.** La mitad derecha queda vacía durante ~50 % del pin (`d1440/cierre-07…13`). Conviene adelantar «Combinación completa» y el mensaje, o acortar el pin. En móvil, el pie se monta sobre «Volver al inicio» al soltarse el pin (`f2fin-06`).
6. **[P2] Cuerpo de semana genérico y con vacíos.** Hay tramos con el 70 % de la pantalla negra (`d1440/d-056`, `d-072`). Cuando llegue el contenido real, revisar las retículas para que cada semana tenga un plano propio (`/impeccable layout`).
7. **[P3] Warnings de GSAP** «scaleX not eligible for reset» (1 676 en un recorrido; probable origen `js/cursor.js:52`). También hay que acotar `p.viz-texto` a `--medida-lectura` (93 caracteres por línea).
8. **[P3] Primer segundo y medio en móvil casi vacío** (`d390/carga-1500`) y el h2 de la semana 01 que asoma fuera de la ventana de la cerradura (`f2fin-02`).

---

## Veredicto

**Todavía no para `main`.** Nada está roto: cero errores, accesibilidad AA, 60 fps y reduced-motion completo. Pero los problemas 1 a 3 se ven en un recorrido normal y tocan justo lo que el profesor tiene que ver: la lección de cada semana, una de las tres transiciones y el plano final del emblema. Son correcciones acotadas (medio día de trabajo). Con ellas resueltas y verificadas en la vista previa, el sitio está listo para publicarse. Los puntos 4 a 8 pueden ir en el pulido posterior, cuando llegue el contenido real.

---

## Evolución

| Criterio | Ronda 1 | Ronda 2 | Final |
|---|---|---|---|
| a) No parece plantilla / IA | 6,5 | 7,0 | 7,0 |
| b) Momento compartible | 7,5 | 8,0 | 8,0 |
| c) Concepto | 7,0 | 7,5 | 8,0 |
| d) Tipografía, ritmo, detalle | 6,5 | 6,5 | 6,5 |
| e) Rendimiento y accesibilidad | 7,5 | 7,5 | 8,0 |
| f) Emblema y paleta | 7,0 | 8,5 | 8,0 |
| **Global** | **7,0** | **7,4** | **7,6** |

**Resuelto desde R2:**
- Las láminas del obturador sobre el texto y las partículas varadas desaparecieron.
- Las transiciones ahora usan piezas del emblema.
- La marca del encabezado encaja en (0,0).
- Las casillas de la tira cumplen 44 px en móvil.
- Todas las semanas imprimen su número.
- El pulso del cierre y el ojo abierto se notan.

**Sin resolver:**
- Los números dobles persisten en móvil.
- Los warnings de GSAP siguen.
- El cuerpo de las semanas sigue siendo genérico.

**Regresiones:**
- En «emblema y paleta» (8,5 → 8,0), por el iris deformado del cierre.
- La transición nueva tapa la lección. Las láminas de R2 hacían algo parecido sobre la reflexión; ahora le pasa al clímax de la semana.

La curva sube despacio: el diseño mejoró en concepto y en robustez, pero «detalle» (d) lleva tres rondas en 6,5. Ese es el cuello de botella para llegar a 8+.
