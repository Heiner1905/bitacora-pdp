# Contenido real de la bitácora · para pegar en `site/data/semanas.js`

Este archivo reúne el contenido definitivo de cada semana, redactado con Heiner. Claude Code: pasa cada semana a su objeto en `site/data/semanas.js` respetando el modelo de datos de `docs/CONTENIDO.md`. Lo que diga `[PENDIENTE]` se deja tal cual. No agregues ni cambies texto.

Fuente oficial de las preguntas: `docs/Bitácora del Estudiante Mindset Formación 26-2.docx` (resumen en la sección «Guía del curso» al final).

## Contexto de Heiner para redactar (confirmado por él)

- Rol que le interesa: Analista de Seguridad Junior (ciberseguridad).
- **No está buscando práctica todavía.** Ahora quiere entender cómo funciona todo el proceso (pruebas, hoja de vida, entrevistas) para prepararse.
- Frente al futuro laboral se siente **seguro**, no inseguro: lo que le falta es información sobre los procesos formales de selección.
- Se describe como dedicado cuando se propone algo, motivado y capaz de resolver situaciones. Lema: «si lo quiero hacer, lo hago».
- Le atrae la ciberseguridad porque es ver lo que otros no ven.
- **Test DISC:** en el sitio no se menciona de dónde salió el test ni cómo se presentó; solo se muestran los resultados.
- **WorkClue:** en la semana 5 sí se puede nombrar la herramienta.
- **Fechas:** no se muestran. Cada semana se identifica solo como «Semana 1», «Semana 2», etc. (campo `fecha`: dejarlo vacío o quitarlo del diseño, no poner `[PENDIENTE]`).

---

## Semana 01 · Expectativas de la materia y de mi futuro laboral

Preguntas de la guía: ¿Qué entendí que va a pasar este semestre en esta materia? ¿Para qué me sirve Mindset Formación? ¿Qué emoción me genera pensar en salir al mundo laboral?

- **id:** `semana-01`
- **estado:** `completada`
- **fecha:** sin fecha (solo «Semana 1»)

### reflexion  (responde: ¿qué entendí que va a pasar este semestre?)

> Llego a esta materia en octavo semestre, con la ciberseguridad como el área en la que quiero construir mi carrera. Entendí que este semestre vamos a recorrer, paso a paso, el proceso de selección de una práctica: las pruebas psicotécnicas y técnicas, las competencias, la hoja de vida y la entrevista. Después viene la gestión del perfil profesional, con la marca personal, LinkedIn y el pitch.
>
> Todavía no estoy buscando práctica, y por eso me sirve ver el proceso completo antes de entrar en él.

### Bloque 1 · «Qué esperaba y qué espero ahora» (viz: `tachado`)

- antes: «Una materia más para cumplir créditos.»
- después: «Un entrenamiento para entender cómo funciona el proceso de selección antes de vivirlo.»

### Bloque 2 · «Para qué me sirve Mindset Formación» (viz: `texto`)  ← bloque nuevo

> Mindset Formación me sirve para prepararme con método. Me da herramientas concretas para cada etapa del proceso y me obliga a conocerme mejor: tener claro qué sé hacer, qué me diferencia y en qué me falta crecer. Sin ese autoconocimiento no puedo presentarme bien como profesional.

### Bloque 3 · «Qué emoción me genera salir al mundo laboral» (viz: `texto`)  ← reemplaza «Cómo me siento frente al futuro laboral»

> Pensar en salir al mundo laboral me genera seguridad y motivación. Soy dedicado cuando me propongo algo y suelo resolver las situaciones que se me presentan; además, la ciberseguridad me motiva porque consiste en ver lo que otros no ven. Lo que todavía no conozco son los procesos formales de selección, y eso no me genera ansiedad: es información que me falta, y esta materia es el lugar para conseguirla. Si lo quiero hacer, lo hago.

### leccion

> Antes de buscar una práctica, quiero entender cómo funciona el proceso. Conocerlo es lo que me da seguridad.

---

## Semana 02 · Pruebas de personalidad (DISC)

Pregunta de la guía: ¿Qué debo tener en cuenta para responder pruebas de personalidad en un proceso de selección?

- **id:** `semana-02`
- **estado:** `completada`
- **fecha:** sin fecha (solo «Semana 2»)

### reflexion

> Esta semana conocí las pruebas de personalidad que usan las empresas en sus procesos de selección y presenté el test DISC, que describe el comportamiento en cuatro dimensiones: dominancia, influencia, estabilidad y cumplimiento. Mi resultado fue un perfil constante, leal y cooperador, con la estabilidad (96) y la influencia (79) como mis dimensiones más altas.
>
> Lo que más me quedó es que estas pruebas no tienen respuestas correctas. Buscan entender cómo actúo en realidad, y por eso la mejor preparación es conocerme y responder con honestidad.

### Bloque 1 · «Tips para responderlas» (viz: `checklist`)

1. Responder con honestidad, pensando en cómo actúo normalmente y no en cómo creo que la empresa quiere que sea.
2. Ser coherente: varias preguntas miden lo mismo con otras palabras, y las contradicciones se notan.
3. Evitar refugiarme en las respuestas intermedias cuando tengo una preferencia clara.
4. Pensar en mi comportamiento habitual en el estudio o el trabajo, no en un día puntual.
5. Leer cada pregunta completa y responder sin darle demasiadas vueltas.

### Bloque 2 · «Evidencia de haber presentado el test» (viz: `imagen`)

- src: `assets/img/semana-02-disc.png` (ya está en `site/assets/img/`; es la página 1 del informe)
- alt: «Resultado de mi test DISC: Dominancia 7, Influencia 79, Estabilidad 96 y Cumplimiento 36. Perfil constante, leal y cooperador.»
- El PDF completo está en `docs/recursos/disc-heiner-resultados.pdf` (no se publica).

### leccion

> Una prueba de personalidad solo me sirve si respondo como soy, no como creo que me quieren ver.

---

## Semana 03 · Pruebas técnicas

Pregunta de la guía: ¿Cómo debo prepararme para responder las pruebas de un proceso de selección?
En clase se presentaron pruebas técnicas de **razonamiento cuantitativo** y **lectura crítica**.

- **id:** `semana-03`
- **estado:** `completada`
- **fecha:** sin fecha (solo «Semana 3»)

### reflexion

> Esta semana presentamos pruebas técnicas de razonamiento cuantitativo y lectura crítica, parecidas a las que muchas empresas aplican en la primera etapa de un proceso de selección. Me di cuenta de que, además de lo que sé, miden la precisión y la velocidad con las que razono bajo un límite de tiempo.
>
> Para el área que me interesa esto pesa. El trabajo de un analista de seguridad consiste en leer información con cuidado, encontrar lo que no encaja y decidir con base en datos.

### Bloque 1 · «Tipos de prueba»

Claude Code: en `semanas.js` este bloque usa `viz: "escalera"`, que necesita valores numéricos que no existen. Cámbialo a `viz: "tarjetas"` (nombre + texto) con estos dos elementos:

1. **Razonamiento cuantitativo:** evalúa cómo interpreto datos, porcentajes, proporciones y gráficas, y cómo resuelvo problemas numéricos en poco tiempo.
2. **Lectura crítica:** evalúa si entiendo un texto a fondo: la idea central, los supuestos del autor y las conclusiones que se pueden sacar, o no, de lo que dice.

### Bloque 2 · «Cómo me preparo» (cambiar `viz: "texto"` por `viz: "checklist"`)

1. Hacer simulacros con el mismo tiempo de la prueba real para medir mi ritmo y ver en qué tipo de pregunta me demoro.
2. En razonamiento cuantitativo, repasar porcentajes, proporciones, regla de tres y lectura de gráficas, y practicar el cálculo mental.
3. En lectura crítica, leer primero la pregunta, buscar la idea central de cada párrafo y descartar las opciones que el texto no respalda.
4. Repasar los fundamentos técnicos de mi área: redes, sistemas operativos, programación y conceptos básicos de seguridad.
5. Llegar descansado y administrar el tiempo: si una pregunta me bloquea, la marco y sigo.

### leccion

> En una prueba técnica la preparación se nota en el ritmo: lo que practico con tiempo, lo resuelvo con calma.

---

## Semana 04 · Competencias

Pregunta de la guía: ¿Cuáles son mis competencias más desarrolladas? ¿En cuáles competencias debo trabajar?
En clase se hizo el taller «Autoanálisis: identifica tus competencias» con el método STAR (`docs/recursos/taller-competencias.docx`). Escala: 1 casi nunca · 2 ocasionalmente · 3 regularmente · 4 casi siempre.
**Las calificaciones son las que dio Heiner; no cambiarlas.**

- **id:** `semana-04`
- **estado:** `completada`
- **fecha:** sin fecha (solo «Semana 4»)

### reflexion

> Esta semana hice un autoanálisis de diez competencias que buscan las empresas y me califiqué de 1 a 4 según qué tan seguido las aplico. También aprendí el método STAR (situación, tarea, acción, resultado), que sirve para demostrar una competencia en una entrevista con hechos concretos y en menos de tres minutos.
>
> Mis puntajes más altos están en lo técnico y en la forma de aprender: aprendizaje activo, pensamiento crítico, uso de la tecnología, programación y resiliencia. Me califiqué más bajo en proponer ideas nuevas, tomar la iniciativa con ellas y liderar de forma constante. Coincide con mi resultado DISC, donde la estabilidad salió alta y la dominancia baja: tiendo a lo seguro y a cooperar más que a dirigir.

### Bloque nuevo (va primero) · «Mi autoanálisis» (viz: `escalera`)

- unidad: «Nivel de 1 a 4»
- items (etiqueta · valor):
  1. Pensamiento analítico e innovador · 3
  2. Aprendizaje activo · 4
  3. Solución de problemas complejos · 3
  4. Pensamiento crítico · 4
  5. Creatividad, originalidad e iniciativa · 3
  6. Liderazgo e influencia social · 3
  7. Uso de la tecnología, monitoreo y control · 4
  8. Diseño y programación de tecnología · 4
  9. Resiliencia, tolerancia al estrés y flexibilidad · 4
  10. Razonamiento, solución de problemas e ideación · 3
- nota de cada item: dejar vacía. Si `escalera` no aguanta 10 columnas en móvil, ajustar el diseño sin cambiar los datos.

### Bloque «Cinco fortalezas» (viz: `tarjetas`, tono `fortaleza`) — las cinco calificadas con 4

1. **Aprendizaje activo:** aprendo por mi cuenta lo que necesito y disfruto adaptarme a herramientas nuevas. Esta misma bitácora la construí aprendiendo sobre la marcha.
2. **Pensamiento crítico:** cuestiono la información antes de aceptarla y reviso de dónde viene. Es una de las bases de la ciberseguridad.
3. **Uso de la tecnología:** uso y superviso herramientas tecnológicas con facilidad, incluidas las de inteligencia artificial, y las incorporo a mi forma de estudiar y trabajar.
4. **Diseño y programación:** diseño y programo soluciones para necesidades concretas, tanto en la universidad como en los proyectos en los que trabajo.
5. **Resiliencia:** manejo la presión con calma. Estudio, trabajo y entreno al mismo tiempo, y me adapto rápido cuando cambian los planes.

### Bloque «Tres aspectos por mejorar» (viz: `tarjetas`, tono `mejora`) — elegidos entre las calificadas con 3

1. **Pensamiento innovador:** evalúo diferentes enfoques, pero tiendo a quedarme con la solución segura. Quiero atreverme más a proponer soluciones nuevas.
2. **Creatividad e iniciativa:** propongo ideas, pero no siempre tomo la iniciativa para llevarlas a cabo.
3. **Liderazgo:** asumo el liderazgo cuando es necesario. Quiero hacerlo con más constancia y confianza.

### leccion

> Lo técnico ya lo tengo encaminado. Ahora me toca atreverme a proponer y a liderar.

---

## Semana 05 · Innegociables y resultado DISC

Preguntas de la guía: ¿Cuáles son mis innegociables? ¿Qué estilo de personalidad DISC soy? ¿Para qué me sirve esta información en mi proceso de ubicación de práctica?
Título temático de la guía: «La conciencia de sí mismo y la toma de decisiones laborales».

- **id:** `semana-05`
- **estado:** `completada`
- **fecha:** sin fecha (solo «Semana 5»)

### reflexion

> Esta semana trabajé la conciencia de mí mismo para tomar decisiones laborales. Junté dos resultados: mi perfil DISC y el resumen de alineación profesional que hice en WorkClue, un mapa de cinco factores (impulso, seguridad, autonomía, equilibrio y desafío). Los dos apuntan a lo mismo. En el DISC mi dimensión más alta es la estabilidad, con 96 de 100, y en el mapa el factor más marcado es el equilibrio, con 12 de 12, seguido de la seguridad.
>
> Mi estilo DISC es estable con alta influencia: constante, leal y cooperador. Sostengo el esfuerzo en tareas largas, apoyo al equipo y transmito entusiasmo. Saberlo me deja claro que rindo mejor con un ritmo estable y con límites definidos entre el trabajo y el resto de mi vida.

### Bloque 1 · «Mis innegociables» (viz: `checklist`)

1. Equilibrio entre el trabajo y mi vida personal: horarios reales que respeten mi tiempo para estudiar, entrenar y descansar.
2. Estabilidad y condiciones claras desde el inicio.
3. Prioridades definidas: saber qué se espera de mí y cuándo termina mi jornada.
4. Un ambiente de respeto y trabajo en equipo.

### Bloque 2 · «Mi perfil DISC» (viz: `anillos`, maximo 100) — datos reales, no cambiar

- D · Dominancia · 7
- I · Influencia · 79
- S · Estabilidad · 96
- C · Cumplimiento · 36

### Bloque 3 · «Qué significa mi perfil» (viz: `waffle`)

- total: 100 · valor: 96 · etiqueta: «Estabilidad, mi dimensión DISC más alta»
- texto:

> Esta información me sirve como filtro para buscar práctica. Antes de aplicar voy a revisar qué dice la oferta sobre horarios, turnos y cambios de prioridad, y en la entrevista voy a preguntar cómo es una semana típica del cargo. En ciberseguridad hay roles muy reactivos, como la atención de incidentes, y otros con procesos más definidos, como el análisis de vulnerabilidades o el cumplimiento normativo. Conocer mi perfil me ayuda a elegir con criterio, sin dejar de buscar espacios donde pueda seguir aprendiendo.

### leccion

> Conocer mis innegociables me permite elegir una práctica, no solo aceptarla.

### Datos de respaldo (no se publican; para referencia)

**Informe DISC** (`docs/recursos/disc-heiner-resultados.pdf`). Perfil «Constante · Leal · Cooperador». Personalidad central (escala 24 a 120): Neuroticismo 58 · Extraversión 88 · Apertura 93 · Amabilidad 88 · Responsabilidad 84. Motivadores (0 a 100): Seguridad y estabilidad 90 · Autonomía 80 · Bien común 80 · Apoyo a los cercanos 80 · Disfrute personal 70 · Novedad y reto 60 · Logro personal 60 · Tradición 60 · Respeto de normas 40 · Autoridad y estatus 30.

**Resumen de alineación profesional** (capturas en `docs/recursos/alineacion-profesional-*.png`). Cinco factores: Equilibrio 12/12 (muy marcada) · Seguridad 7/11 (marcada) · Impulso 6/13 (moderada) · Autonomía 4/12 (baja) · Desafío 1/12 (muy baja). Idea central: «Límites claros, ritmo estable».

---

## Guía del curso (Mindset Formación 26-2)

El curso tiene **14 semanas**; el sitio hoy tiene 10. Al final hay que agregar las semanas 11 a 14 en `semanas.js` (el diseño se adapta solo a la longitud del array).

| Semana | Tema | Preguntas a responder |
|---|---|---|
| 1 | Introducción al programa Mindset Formación | ¿Qué entendí que va a pasar este semestre en esta materia? ¿Para qué me sirve Mindset Formación? ¿Qué emoción me genera pensar en salir al mundo laboral? |
| — | *Módulo: Procesos de selección* | |
| 2 | Pruebas psicotécnicas: pruebas de personalidad | ¿Qué debo tener en cuenta para responder pruebas de personalidad en un proceso de selección? |
| 3 | Pruebas técnicas | ¿Cómo debo prepararme para responder las pruebas de un proceso de selección? |
| 4 | Competencias | ¿Cuáles son mis competencias más desarrolladas? ¿En cuáles competencias debo trabajar? |
| 5 | La conciencia de sí mismo y la toma de decisiones laborales | ¿Cuáles son mis innegociables? ¿Qué estilo de personalidad DISC soy? ¿Para qué me sirve esta información en mi proceso de ubicación de práctica? |
| 6 | Hoja de vida | ¿Cuál es el propósito de mi hoja de vida? ¿Qué debo evitar? ¿Qué no puede faltar? |
| 7 | Entrevista de selección y otros métodos de evaluación | ¿Me siento preparado para enfrentar una entrevista de selección? ¿Cuáles son mis puntos fuertes? ¿Cuáles son mis puntos débiles? |
| 8 | Mercado laboral (invitado) | ¿En qué sector o sectores me veo trabajando? ¿En qué área me veo trabajando? ¿Qué empresas me llaman la atención? |
| — | *Módulo: Autogestión de mi perfil profesional* | |
| 9 | Marca personal (invitado) | ¿Qué imagen quiero proyectar en el mundo laboral? |
| 10 | Gestión de oportunidades laborales (LinkedIn) | ¿Tengo claridad del tipo de práctica que deseo? ¿Tengo la lista de contactos que me pueden ayudar a llegar a ella? ¿Qué medios uso para buscar ofertas de práctica? |
| 11 | Pitch laboral | ¿Qué propósito tiene mi pitch profesional? |
| 12 | Gestión de mis finanzas (invitado) | ¿Tengo claridad de cómo manejar mis finanzas personales? ¿Qué debo tener en cuenta? |
| 13 | Gestión emocional y el mundo laboral | ¿Qué emociones están presentes en mí en este momento de preparación para la práctica? ¿Qué necesito hacer para usarlas de forma inteligente? |
| 14 | Conversatorios con expertos | (sin pregunta en la guía) |
