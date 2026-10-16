/* Alternativa 3 · El fragmento
   Las palabras de la lección llegan dispersas y convergen en la frase; el arco rubí
   del emblema vuelve a su lugar en un anillo grande; al completarse, pulso de rubí claro. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var uid = 0;
  // Mismos arcos que el emblema (viewBox 400, r=140): el anillo abierto y el fragmento
  var TODO = 'M340.00 200.00 A140 140 0 0 1 229.11 336.94 M170.89 336.94 A140 140 0 1 1 314.68 119.70';
  var TODO_CERRADO = 'M229.11 336.94 L170.89 336.94';
  var ARCO = 'M314.68 119.70 A140 140 0 0 1 340.00 200.00';

  function anilloSVG() {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'cs__anillo');
    svg.setAttribute('viewBox', '0 0 400 400');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML =
      '<path class="todo" d="' + TODO + '" stroke-width="2"/>' +
      '<path class="todo-claro" d="' + TODO + '" stroke-width="2"/>' +
      '<g class="frag"><path class="arco" d="' + ARCO + '" stroke-width="4"/></g>' +
      '<circle class="pulso" cx="200" cy="200" r="140" stroke-width="3"/>';
    return svg;
  }

  // pseudoaleatorio estable (la dispersión es la misma en cada visita)
  function azar(i, k) { var x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); }

  window.CierreAlt = function (cont, sem, FX) {
    var id = 'cs-' + (++uid);
    var raiz = FX.crear('aside', 'cs cs-fragmento', cont);
    raiz.setAttribute('aria-labelledby', id);
    var f = FX.crear('p', 'cs__ficha t-dato', raiz); f.id = id;
    f.innerHTML = '<span>Lección clave</span><b>Semana ' + FX.dos(sem.numero) + '</b>';
    var cuerpo = FX.crear('div', 'cs__cuerpo', raiz);

    if (FX.esPendiente(sem.leccion)) {
      raiz.classList.add('cs--pendiente');
      FX.pintar(FX.crear('p', 'cs__texto', cuerpo), sem.leccion);
      return;
    }
    var anillo = anilloSVG(); raiz.insertBefore(anillo, raiz.firstChild);
    var real = FX.crear('p', 'sr-only', cuerpo); real.textContent = sem.leccion;
    var vis = FX.crear('p', 'cs__texto', cuerpo); vis.setAttribute('aria-hidden', 'true');
    var piezas = [];
    sem.leccion.split(/\s+/).forEach(function (w, i, arr) {
      var s = FX.crear('span', 'pieza', vis); s.textContent = w; piezas.push(s);
      if (i < arr.length - 1) vis.appendChild(document.createTextNode(' '));
    });
    var pie = FX.crear('p', 'cs__pie t-dato', cuerpo); pie.setAttribute('aria-hidden', 'true');

    var gsap = window.gsap;
    var frag = anillo.querySelector('.frag');
    if (FX.estado.reducido || !gsap) { pie.textContent = 'Encajada'; gsap && gsap.set(anillo.querySelector('.todo-claro'), { opacity: 1 }); return; }

    pie.textContent = '\u00a0';
    var movil = matchMedia('(max-width: 899px)').matches;
    var A = movil ? 0.6 : 1;
    var tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    tl.from(piezas, {
      x: function (i) { return (azar(i, 1) - 0.5) * 900 * A; },
      y: function (i) { return (azar(i, 2) - 0.5) * 520 * A; },
      rotation: function (i) { return (azar(i, 3) - 0.5) * 50; },
      opacity: 0.12,
      duration: 1,
      stagger: { each: 0.5 / piezas.length, from: 'random' }
    }, 0)
      .from(frag, { x: 140, y: -120, rotation: 38, svgOrigin: '330 160', duration: 1.4, ease: 'power3.inOut' }, 0)
      .call(function () { pie.textContent = '\u00a0'; }, null, 1.39)
      .call(function () { pie.textContent = 'Encajada'; }, null, 1.42)
      .to(anillo.querySelector('.todo-claro'), { opacity: 1, duration: 0.25, ease: 'none' }, 1.4)
      .fromTo(anillo.querySelector('.pulso'), { opacity: 0.95, scale: 1, svgOrigin: '200 200', immediateRender: false }, { opacity: 0, scale: 1.12, svgOrigin: '200 200', duration: 0.5, ease: 'expo.out', immediateRender: false }, 1.42);

    var mm = gsap.matchMedia();
    mm.add({ escritorio: '(min-width: 900px)', movil: '(max-width: 899px)' }, function (ctx) {
      if (ctx.conditions.escritorio) ScrollTrigger.create({ animation: tl, trigger: raiz, start: 'top top', end: '+=110%', pin: true, scrub: 0.7 });
      else ScrollTrigger.create({ animation: tl, trigger: raiz, start: 'top 85%', end: 'center 45%', scrub: 0.7 });
    });
  };
})();
