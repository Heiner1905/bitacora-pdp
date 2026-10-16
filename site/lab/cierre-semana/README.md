# Cierre de semana: tres alternativas (laboratorio)

Cada semana cierra con su **lección clave** (`BITACORA.semanas[k].leccion`). Estos son tres prototipos funcionales para elegir uno. Todos usan la misma composición base (`cs-base.css`): la ficha `Lección clave / Semana 0k` en las columnas 1–3 y la lección en Newsreader 300 grande en las columnas 4–11; en móvil, una sola columna.

Cada página muestra dos casos: una **lección de muestra** (rotulada: no es contenido de Heiner) y el caso **[PENDIENTE]**, que se ve tal cual en el recuadro punteado y sin efecto. Con `prefers-reduced-motion` las tres muestran el estado final, sin movimiento. El texto real siempre está en el DOM (en la 2 y la 3, como copia `sr-only`, con la versión animada en `aria-hidden`).

| | Idea | Qué parte del concepto cuenta | Interacción |
|---|---|---|---|
| **1 · La linterna** (`alt-1/`) | La lección está cubierta como un documento clasificado (cada palabra es una barra). El cursor es una linterna: donde alumbra se lee. Al alumbrar el 55 % del texto, o con el botón «Encender la luz», la luz se abre del todo y la cerradura gira 90°. | **El observador** y **los trucos bajo la manga**: ver lo que otros no ven. | Escritorio: cursor. Táctil: la linterna barre las líneas con el scroll y se enciende al final. Teclado: el botón. |
| **2 · La combinación** (`alt-2/`) | La lección aparece cifrada en tambores, como los de un candado. Un dial (el del emblema) marca la combinación con retenes, alternando derecha e izquierda; cada retén gira los tambores de un grupo de palabras y lo deja en claro. Al final la cerradura gira y la ficha dice «Combinación completa». | **La combinación** (el hilo del sitio, semana a semana, en pequeño) y la ciberseguridad. | Scroll con scrub (pin de hasta 150 % en escritorio; sin pin en móvil). |
| **3 · El fragmento** (`alt-3/`) | Las palabras llegan dispersas, giradas y tenues, y convergen en la frase; a la vez, el arco rubí del emblema vuelve a su sitio en un anillo grande. Al completarse, el anillo pasa a hielo y un pulso de rubí claro lo recorre. | **El fragmento que vuelve al todo**. | Scroll con scrub (pin de 110 % en escritorio; sin pin en móvil). |

## Recomendación del constructor 3

**La 1 · La linterna.** Es la única de las tres que pide algo al visitante (mirar) en lugar de reproducirse sola con el scroll, y eso es exactamente el observador. Es la más memorable a los cinco segundos y la que mejor se diferencia del resto del sitio, que ya usa el scroll para casi todo. Además no repite al cierre final: la 3 anticipa el encaje del fragmento y le resta fuerza al final; la 2 duplica el dial que ya cuenta la combinación en el emblema y en la tira del encabezado.

Riesgos de la 1 y cómo se cubren: en táctil se resuelve con el barrido por scroll; para teclado y lectores de pantalla el texto real está en el DOM y el botón enciende la luz. Hay que coordinar con el cursor de ojo (constructor 4): sobre la linterna el cursor del sistema se oculta y la linterna hace de cursor.

Si se quiere más «combinación», la 2 es la segunda opción: es la más propia del emblema, pero con 10 semanas el pin repetido puede cansar.
