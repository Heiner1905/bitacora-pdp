# Contenido real de la bitácora · semanas 6 a 13 y cierre

Redactado con Heiner (nov 2026) y pasado por `/humanizador-academico`. Continúa `docs/CONTENIDO-SEMANAS.md` (semanas 1 a 5). Cada semana ya viene con la forma de su objeto en `site/data/semanas.js`: `titulo`, `reflexion`, `bloques` (`titulo`, `viz`, `datos`) y `leccion`.

---

## Instrucciones para Claude Code

**Lee primero** `CLAUDE.md`, `docs/ESTADO-ACTUAL.md` y `docs/DIRECCION.md` §0-bis y §7 (esquema de `datos` por viz).

**Qué hacer**
1. Reemplaza los objetos `semana-06` a `semana-13` de `site/data/semanas.js` con el contenido de este archivo. Hoy tienen `[PENDIENTE]` y bloques de ejemplo que se descartan.
2. **La bitácora queda con 13 semanas.** Heiner confirmó que la semana 14 (conversatorios) no entra: elimina el objeto `semana-14`. La tira, el índice y el avance se calculan con la longitud del array; revisa que se ajusten solos a 13 y que no quede ninguna referencia fija a 14 en el código, el CSS ni los textos.
3. En las ocho semanas: `estado: "completada"` (la tira y el índice lo usan; no hay etiqueta visible) y `fecha: ""`.
4. Rellena `BITACORA.cierre.mensaje` con el texto de la sección «Cierre de la bitácora».
5. **Enlaces (componente nuevo):** las semanas 10 y 11 traen un bloque `viz: "enlace"`, que todavía no existe. Créalo en `js/viz.js` y documenta su esquema en `docs/DIRECCION.md` §7. Detalle en la sección «Bloque nuevo `enlace`».
6. Copia este archivo como apéndice de `docs/CONTENIDO-SEMANAS.md` (o enlázalo desde allí).
7. **El despliegue ya está resuelto.** Heiner verificó que el sitio publica bien en `https://bitacora-pdp.heinerdanitrincon.workers.dev/`. No lo investigues de nuevo: solo corrige la documentación. En `docs/ESTADO-ACTUAL.md`, quita «sin confirmar» y el pendiente de Cloudflare. En `CLAUDE.md`, cambia `bitacora-pdp.pages.dev` por esa URL.
8. Actualiza `docs/ESTADO-ACTUAL.md`: 13 semanas con contenido, cierre listo, sin pendientes de contenido.

**Bloque nuevo `enlace`**
- Esquema: `{ texto, url, etiqueta, tipo }`. `tipo` es `"linkedin"` o `"video"`.
- Es un enlace real (`<a href target="_blank" rel="noopener noreferrer">`), accesible por teclado y con foco visible. No es un botón falso.
- Estilo dentro de la paleta «Niebla»: tarjeta en superficie con el filo rubí de la lección o el CTA de §0-bis (rubí hondo con texto superficie, 5,9:1). Sin logos de marca: LinkedIn y YouTube se nombran en texto.
- `tipo: "video"`: muestra una fachada liviana (miniatura y botón de reproducir) y carga el iframe de `https://www.youtube-nocookie.com/embed/yVKADc-iFLk` solo al hacer clic. Así no pesa al cargar la página. Si prefieres no incrustarlo, basta con el enlace.
- En `@media print` se imprime la URL completa en texto.

**Reglas de contenido**
- No cambies, resumas ni agregues texto. Si algo no cabe, el que se adapta es el diseño.
- Las cifras del DISC (79 y 96) son reales.
- **Confidencialidad:** el proyecto de inspección de contenedores es de un cliente. No se nombra al cliente y no se agregan detalles, métricas ni nombres de modelos.
- **WorkClue:** la mención en la semana 5 se queda. Fue una herramienta externa y Heiner quiere nombrarla. La regla de no nombrar la plataforma aplica solo al DISC de la semana 2.
- La frase del cierre se atribuye a Tesla («se atribuye»), porque no tiene una fuente primaria verificada. No la cambies a «dijo».
- Sin emojis. Español colombiano.

**Visualizaciones** (todas existen en `js/viz.js`; respeta el esquema de §7)
- `maquina` (semanas 6, 9 y 10): frase corta escrita a máquina. Revisa que el texto real quede accesible y que con reduced-motion aparezca completo.
- `flujo` (semana 7): primera vez que se usa con contenido real. Revisa que los cuatro textos se lean bien a 360 px.
- `tarjetas`: llevan `tono` (`fortaleza` o `mejora`) e `items: [{ nombre, texto }]`. Hay grupos de 2, 3, 4 y 5 tarjetas.
- `checklist`: grupos de 3 a 7 ítems.

**Skills**
- `impeccable`: al terminar, `/impeccable audit` y `/impeccable harden` sobre las semanas 6 a 13. Después, `/impeccable polish` en lo que encuentres.
- `frontend-design` / `design-taste-frontend`: solo si una viz no aguanta el contenido. Respeta la paleta «Niebla» y §0-bis.
- `gsap-performance` y `gsap-scrolltrigger`: solo si tocas animaciones. 60 fps y estado final estático con reduced-motion.
- `emil-design-eng`: si ajustas el movimiento de `maquina` o `flujo`.
- Puedes repartir el trabajo entre subagentes, pero `site/data/semanas.js` lo edita uno solo.

**Verificación (obligatoria)**: reutiliza `.orquestador/fase2/herramientas/lib.mjs`.
- Capturas con Playwright a 360, 390 y 1440 px de las semanas 6 a 13 y del cierre.
- 0 errores de consola, sin scroll horizontal, con movimiento normal y reducido.
- Contraste ≥ 4,5:1 en el texto nuevo.
- Ningún `[PENDIENTE` visible en todo el sitio.
- La tira y el índice muestran 13 casillas.
- Los dos enlaces abren la URL correcta y el video carga solo al hacer clic.
- Vista de impresión (`@media print`): una semana por página.
- `impeccable detect site/` sin anti-patrones nuevos.

---

## Semana 06 · Hoja de vida

Guía: ¿Cuál es el propósito de mi hoja de vida? ¿Qué debo evitar? ¿Qué no puede faltar?

- **titulo:** «Hoja de vida»

### reflexion

> Esta semana construí mi hoja de vida en español sobre la plantilla de la universidad. Entendí que un reclutador la revisa en pocos segundos y que en ese tiempo tiene que ver quién soy: un estudiante de octavo semestre de Ingeniería de Sistemas que ya ha trabajado en proyectos reales y que se está orientando hacia la ciberseguridad defensiva.
>
> También entendí que la hoja de vida y el perfil de LinkedIn tienen que contar la misma historia. Si un reclutador encuentra datos distintos en cada uno, pierde la confianza antes de hablar conmigo.

### Bloque 1 · «Propósito de mi hoja de vida» · viz `maquina`

- texto: «Que alguien quiera conocerme en una entrevista.»

### Bloque 2 · «Qué debo evitar» · viz `tarjetas` · tono `mejora`

1. **Información vieja.** Los logros del colegio o de hace más de cinco años ocupan espacio y no dicen quién soy hoy.
2. **Habilidades sin respaldo.** Cada herramienta que pongo la tengo que poder explicar en una entrevista.
3. **Funciones sin resultados.** «Encargado de…» describe un cargo. Lo que interesa es lo que logré en él.
4. **Exagerar.** Todavía no tengo certificaciones en ciberseguridad, y prefiero mostrar cómo me estoy preparando.
5. **Revelar información confidencial.** Uno de mis proyectos es para un cliente; lo describo sin nombrarlo ni dar detalles internos.

### Bloque 3 · «Lo que no puede faltar» · viz `checklist`

1. Datos de contacto claros y los enlaces a mi LinkedIn y mi GitHub.
2. Un perfil corto que diga a qué rol apunto.
3. La experiencia contada con resultados: el desarrollo full stack en Vamo y los modelos de inteligencia artificial que detectan daños y leen etiquetas para automatizar la inspección de contenedores.
4. Mi formación, las certificaciones que sí tengo y mi nivel de inglés.
5. Las palabras clave de cada oferta, porque muchas empresas filtran las hojas de vida con sistemas automáticos antes de que las lea una persona.

### leccion

> Mi hoja de vida no cuenta todo lo que he hecho. Cuenta lo que hace que quieran conocerme.

---

## Semana 07 · Entrevista de selección

Guía: ¿Me siento preparado para enfrentar una entrevista de selección? ¿Cuáles son mis puntos fuertes? ¿Cuáles son mis puntos débiles?

- **titulo:** «Entrevista de selección y otros métodos de evaluación»

### reflexion

> Todavía no me siento preparado. En mi vida he presentado una sola entrevista de selección y sé que me falta práctica. Esta semana entendí que eso se puede corregir, porque las preguntas se repiten y se agrupan por tipos. Las que rompen el hielo, como «háblame de ti», abren la conversación. Las incómodas buscan señales de alerta en la trayectoria y las difíciles miden cómo manejo la presión o un error. Las capciosas, como «¿cuál es tu mayor debilidad?», evalúan qué tan honesto soy y cuánto me conozco, y las retadoras piden ejemplos concretos de conflictos, liderazgo o riesgos. También hay preguntas prohibidas, sobre religión, orientación sexual, salud o planes de tener hijos, que nadie debería hacerme en un proceso de selección.
>
> Para las retadoras sirve el método STAR. Ahí tengo material, porque ya he trabajado en proyectos reales; lo que me falta es ordenarlo y ensayarlo en voz alta. Aprendí además que la entrevista no es el único filtro: una empresa también puede evaluarme con pruebas técnicas, casos prácticos o actividades en grupo.

### Bloque 1 · «Antes y ahora» · viz `tachado`

- antes: «Una entrevista se improvisa.»
- despues: «Una entrevista se prepara: las preguntas se repiten y las respuestas se pueden ensayar.»

### Bloque 2 · «Mis puntos fuertes» · viz `tarjetas` · tono `fortaleza`

1. **Comunicación.** Me gusta conversar con personas nuevas, mi perfil DISC tiene una influencia alta (79 de 100) y tengo una formación en comunicación de alto impacto.
2. **Ejemplos reales.** Puedo contar con el método STAR lo que hice en Vamo y en el proyecto de inspección de contenedores.
3. **Inglés.** Viví un año en Londres y puedo presentar una entrevista en inglés.
4. **Una presentación ya armada.** Mi pitch me da la base para responder «háblame de ti».

### Bloque 3 · «Mis puntos débiles» · viz `tarjetas` · tono `mejora`

1. **Poca práctica.** Solo he presentado una entrevista y no sé cómo respondo bajo la presión de una real.
2. **Preguntas técnicas de ciberseguridad.** No tengo experiencia laboral ni certificaciones en el área; lo que sé lo aprendí en la carrera y por mi cuenta.
3. **Errores y fracasos.** No tengo preparados ejemplos de errores que haya cometido y de lo que aprendí de ellos.
4. **Pretensiones económicas.** Todavía no sé cuánto se le paga a un practicante en mi área.

### Bloque 4 · «Un ejemplo con el método STAR» · viz `flujo`

- S · Situación: «En un proyecto para un cliente, la inspección de contenedores se hacía a ojo, revisando uno por uno.»
- T · Tarea: «Me encargué de automatizar dos partes de esa revisión: detectar daños y leer las etiquetas.»
- A · Acción: «Desarrollé y entrené dos modelos de inteligencia artificial, uno para cada tarea.»
- R · Resultado: «Los dos modelos quedaron terminados y entregados al cliente.»

### Bloque 5 · «Mi plan de preparación» · viz `checklist`

1. Escribir cinco historias con el método STAR: un reto técnico, un error, un conflicto en equipo, un logro y una situación de presión.
2. Ensayar en voz alta y grabarme respondiendo las preguntas más comunes, para corregir lo que solo se nota cuando uno se escucha.
3. Antes de cada entrevista, investigar la empresa: qué hace, sus servicios, sus noticias recientes y cómo trabaja su equipo de seguridad.
4. Averiguar cuánto se ofrece a los practicantes en mi área, para responder con un rango y no con una cifra al azar.
5. Llevar al menos dos preguntas para el entrevistador. Decir que no tengo preguntas transmite falta de interés.

### leccion

> La seguridad en una entrevista se construye ensayando antes de que llegue.

---

## Semana 08 · Mercado laboral

Guía: ¿En qué sector o sectores me veo trabajando? ¿En qué área me veo trabajando? ¿Qué empresas me llaman la atención?

- **titulo:** «Mercado laboral»

### reflexion

> Me veo trabajando en ciberseguridad defensiva, en la detección de amenazas, combinada con la inteligencia artificial. Ya construí modelos de detección: en un proyecto para un cliente desarrollé modelos que identifican daños y leen etiquetas en contenedores. Me interesa aplicar esa misma lógica a la seguridad, buscando en grandes volúmenes de datos las señales que delatan un ataque.
>
> Al investigar el mercado para mi perfil de LinkedIn encontré que la mayoría de las plazas de práctica en ciberseguridad en Colombia están del lado defensivo: centros de operaciones de seguridad (SOC), gestión de vulnerabilidades, respuesta a incidentes y seguridad en la nube. Eso coincide con lo que quiero hacer y con lo que descubrí en la semana 5: rindo mejor en roles con procesos definidos.

### Bloque 1 · «Sectores» · viz `tarjetas` · tono `fortaleza`

1. **Empresas de ciberseguridad.** Su producto es la protección misma, así que ahí aprendería cómo se construyen y se operan las herramientas de detección.
2. **Consultoría y servicios de tecnología.** Se trabaja con varios clientes y tecnologías a la vez; para un practicante, eso significa aprender rápido.

### Bloque 2 · «Área» · viz `checklist`

1. Monitoreo y detección de amenazas en un SOC (blue team), mi primera opción.
2. Gestión de vulnerabilidades.
3. Seguridad en la nube y DevSecOps, donde aprovecho lo que ya sé de Docker, Kubernetes, Terraform y Jenkins.

### Bloque 3 · «Empresas que me llaman la atención» · viz `tarjetas` · tono `fortaleza`

1. **Fortinet, mi primera opción.** Es una empresa dedicada por completo a la ciberseguridad, y su laboratorio de investigación de amenazas usa inteligencia artificial para detectarlas. Es justo la combinación que quiero aprender.
2. **Perficient.** Es una consultora de tecnología con presencia en Colombia, donde trabajaría con clientes y tecnologías distintas.
3. **Globant.** Es una empresa de tecnología con sedes en Colombia y proyectos para clientes de todo el mundo.

### leccion

> Ya construí modelos que detectan. Ahora quiero que detecten amenazas.

---

## Semana 09 · Marca personal

Guía: ¿Qué imagen quiero proyectar en el mundo laboral?

- **titulo:** «Marca personal»

### reflexion

> La imagen que quiero proyectar se resume en una idea: ver lo que otros no ven. Es lo que me atrajo de la ciberseguridad y lo que quiero que la gente asocie con mi nombre. Quiero que me vean como un analista atento a los detalles, que encuentra la señal entre el ruido y explica con claridad lo que encontró.
>
> Busco que esa imagen sea seria y profesional, y que se sostenga con hechos. Mi perfil de LinkedIn, mi GitHub, mi hoja de vida, mi pitch y esta bitácora tienen que contar la misma historia con el mismo tono. Si una de esas piezas dice algo distinto, la imagen se cae.

### Bloque 1 · «La imagen que quiero proyectar» · viz `maquina`

- texto: «Ver lo que otros no ven.»

### Bloque 2 · «Antes y ahora» · viz `tachado`

- antes: «La marca personal es cosa de influenciadores.»
- despues: «Mi marca personal es la impresión que dejo, en persona y en internet, la cuide o no.»

### Bloque 3 · «Cómo quiero que me describan» · viz `tarjetas` · tono `fortaleza`

1. **Atento al detalle.** Reviso lo que otros pasan por alto, que es la base del trabajo en seguridad.
2. **Constante.** La estabilidad es mi dimensión DISC más alta (96 de 100), y la demuestro estudiando, trabajando y entrenando al mismo tiempo.
3. **Cercano.** Me gusta trabajar con personas y sé explicar un hallazgo técnico a alguien que no es técnico.

### Bloque 4 · «Dónde se ve mi marca» · viz `checklist`

1. LinkedIn, con un perfil principal en inglés.
2. GitHub, con mis proyectos públicos.
3. La hoja de vida.
4. El pitch en video.

### leccion

> Si no defino la imagen que proyecto, otros la definen por mí.

---

## Semana 10 · Gestión de oportunidades laborales

Guía: ¿Tengo claridad del tipo de práctica que deseo? ¿Tengo la lista de contactos que me pueden ayudar a llegar a ella? ¿Qué medios uso para buscar ofertas de práctica?

- **titulo:** «Gestión de oportunidades laborales»

### reflexion

> Tengo claro el tipo de práctica que busco y para cuándo: el segundo semestre de 2027. Estoy abierto a cualquier ciudad y modalidad, presencial, híbrida o remota. Todavía no estoy aplicando; estoy preparando el terreno para que mi perfil esté listo cuando llegue el momento.
>
> Mi medio principal es LinkedIn. Esta semana lo optimicé desde cero, con un titular, un «Acerca de» y una experiencia orientados a prácticas en ciberseguridad. Mi otra fuente son las personas: los profesores con los que he construido una buena relación y mis compañeros de carrera.

### Bloque 1 · «La práctica que busco» · viz `maquina`

- texto: «Ciberseguridad defensiva, en detección de amenazas.»

### Bloque 2 · «Mis contactos» · viz `tarjetas` · tono `fortaleza`

1. **Profesores de la universidad.** Conocen mi trabajo de cerca y pueden orientarme, recomendarme o contarme de convocatorias.
2. **Compañeros de carrera.** Los que empiezan su práctica antes que yo me pueden contar cómo fueron sus procesos y avisarme de vacantes.
3. **Profesionales y reclutadores de seguridad en LinkedIn.** Es la red que voy a construir de aquí a la práctica, empezando por las empresas que me interesan.

### Bloque 3 · «Cómo uso LinkedIn para buscar» · viz `checklist`

1. Alertas de empleo con términos como «practicante de ciberseguridad» y «security intern».
2. Seguir a Fortinet, Perficient y Globant, y a sus reclutadores, para conocer cómo seleccionan practicantes.
3. Conectar con profesionales del área con una nota personalizada, nunca con invitaciones masivas.
4. Mantener el perfil al día cada vez que termine un proyecto o un curso.

### Bloque 4 · «Mi perfil de LinkedIn» · viz `enlace`

- tipo: `linkedin`
- etiqueta: «Ver mi perfil en LinkedIn»
- texto: «Este es el perfil que optimicé esta semana.»
- url: `https://www.linkedin.com/in/heiner-rincon-sw-engineering/`

### leccion

> Las oportunidades llegan primero a quien ya conoce a las personas correctas.

---

## Semana 11 · Pitch laboral

Guía: ¿Qué propósito tiene mi pitch profesional?

- **titulo:** «Pitch laboral»

### reflexion

> Mi pitch tiene el propósito de presentarme en poco más de un minuto y dejar una idea clara: soy un estudiante de Ingeniería de Sistemas que construyó modelos de detección con inteligencia artificial y quiere aplicar esa experiencia a la ciberseguridad defensiva. Lo grabé en video pensando en un reclutador o en un líder técnico de seguridad. Al terminar de verlo, quiero que esa persona revise mi LinkedIn o me escriba.
>
> Entendí que un pitch es una historia corta con una sola idea central, en la que cada parte cumple una función. Por eso no intenté meter toda mi hoja de vida.

### Bloque 1 · «Antes y ahora» · viz `tachado`

- antes: «Un pitch es recitar la hoja de vida rápido.»
- despues: «Un pitch es una historia corta con una idea que el otro recuerde.»

### Bloque 2 · «Cómo está armado mi pitch» · viz `checklist`

1. Gancho: un dato sobre cuánto tarda una empresa en detectar que la atacaron.
2. Quién soy.
3. El problema: las amenazas pasan desapercibidas durante meses.
4. Mi propuesta: detección apoyada en inteligencia artificial.
5. El beneficio para la empresa.
6. Por qué yo: ya construí modelos de detección en un proyecto real.
7. Cierre con mis datos de contacto.

### Bloque 3 · «Lo que aprendí al grabarlo» · viz `texto`

> Hice tres versiones antes de quedar conforme. Escribir el guion me obligó a escoger una idea y descartar el resto. Al grabarlo noté que hablo rápido, así que ajusté el texto a mi ritmo. Lo voy a seguir mejorando, y ya me sirve como base para responder «háblame de ti» en una entrevista.

### Bloque 4 · «Mi pitch» · viz `enlace`

- tipo: `video`
- etiqueta: «Ver mi pitch en YouTube»
- texto: «Mi presentación profesional en video.»
- url: `https://youtu.be/yVKADc-iFLk`

### leccion

> Si no puedo explicar en un minuto quién soy, el otro tampoco lo va a recordar.

---

## Semana 12 · Gestión de mis finanzas

Guía: ¿Tengo claridad de cómo manejar mis finanzas personales? ¿Qué debo tener en cuenta?

- **titulo:** «Gestión de mis finanzas»

### reflexion

> Tengo una claridad parcial. Como trabajo mientras estudio, manejo mi propio dinero, y la charla me hizo ver que lo hago más por costumbre que con un sistema. La idea que más me quedó es que muchas decisiones de gasto son emocionales: la publicidad está diseñada para despertar emociones, y es fácil terminar comprando cosas que no necesito.
>
> Quiero llegar a la práctica con orden, para que el primer apoyo económico que reciba ya tenga un destino.

### Bloque 1 · «Antes y ahora» · viz `tachado`

- antes: «Si me alcanza a fin de mes, voy bien.»
- despues: «Voy bien si sé a dónde se fue mi dinero y ahorré antes de gastar.»

### Bloque 2 · «Qué debo tener en cuenta» · viz `checklist`

1. Registrar los gastos del mes para saber a dónde se va el dinero.
2. Separar el ahorro apenas recibo un ingreso, no al final con lo que sobre.
3. Revisar mis suscripciones. Pago herramientas de inteligencia artificial para estudiar y trabajar, y conviene confirmar cada cierto tiempo que todas se usan.
4. Darle prioridad al gasto en formación, como los cursos de ciberseguridad que ya compré, porque aumenta mi valor profesional.
5. Esperar un día antes de una compra impulsiva.
6. Decidir, antes de empezar la práctica, qué parte del apoyo económico voy a ahorrar.

### leccion

> El dinero que no planeo lo terminan gastando mis emociones.

---

## Semana 13 · Gestión emocional y el mundo laboral

Guía: ¿Qué emociones están presentes en mí en este momento de preparación para la práctica? ¿Qué necesito hacer para usarlas de forma inteligente?

- **titulo:** «Gestión emocional y el mundo laboral»

### reflexion

> La emoción que más tengo presente es la motivación. Este semestre avancé en varios frentes: optimicé mi perfil de LinkedIn, construí mi hoja de vida, grabé mi pitch y armé esta bitácora. Ver ese avance me da seguridad.
>
> También hay presión. Estudio, trabajo y entreno al mismo tiempo, y a veces quiero avanzar más rápido de lo que el tiempo permite. Frente a las entrevistas tengo una inseguridad concreta, porque solo he presentado una.

### Bloque 1 · «Cómo uso cada emoción» · viz `tarjetas` · tono `fortaleza`

1. **Motivación.** La convierto en un plan con fechas, como las historias STAR y los simulacros, para que mi avance no dependa del ánimo de cada día.
2. **Presión.** Defino pocas prioridades por semana y respeto el descanso y el entrenamiento, que son parte de mis innegociables.
3. **Inseguridad frente a las entrevistas.** La trato como información: me dice qué practicar. Cada simulacro la reduce un poco.

### Bloque 2 · «Observar sin reaccionar» · viz `texto`

> Temas de interés propio como el estoicismo, me han enseñado a observar mis pensamientos y emociones sin identificarme con ellos. En una entrevista eso me permite sentir nervios sin que los nervios decidan lo que respondo.

### leccion

> Mis emociones me informan; las decisiones las tomo yo.

---

## Cierre de la bitácora · `BITACORA.cierre.mensaje`

Heiner ajustó la frase el 6 nov 2026: «entender cómo funciona el universo» en lugar de «encontrar los secretos del universo». Es la versión publicada.

> Hay una frase que se le atribuye a Nikola Tesla: «Si quieres entender cómo funciona el universo, piensa en términos de energía, frecuencia y vibración». Este semestre la entendí a mi manera. Vibro con lo que deseo para materializar lo que quiero, y mi energía la dedico a lo que me gusta. Y me gusta todo lo que hago.
