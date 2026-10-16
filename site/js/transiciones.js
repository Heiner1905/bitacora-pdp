/* ==========================================================================
   transiciones.js — paso de una semana a la siguiente (constructor 3 · §8)
   En cada .transicion[data-desde][data-hacia] (los pinta semana.js):
   1. Las láminas del obturador se cierran sobre la semana que termina
      (franjas alternas: unas bajan, otras suben, como las hojas de un diafragma).
   2. Con la sala tapada, el número de la semana siguiente llega desde el fondo
      en 3D (z −900, giro en Y) y queda frente a la cámara con su ficha.
   3. Las láminas se recogen hacia el lado contrario y la cámara atraviesa el número
      (z +, se desvanece): debajo ya está la cabecera real de la semana.
   Todo va guiado por scrub en el recorrido de la .transicion (≈ 70 svh de alto).
   reduced-motion / sin GSAP: separador estático (marca del dial + «03 / 04»).
   ========================================================================== */
(function () {
  'use strict';
  var FX = window.FX;
  if (!FX) return;

  function construir(tr, semanas) {
    var desde = parseInt(tr.getAttribute('data-desde'), 10);
    var hacia = parseInt(tr.getAttribute('data-hacia'), 10);
    var s = semanas.filter(function (x, i) { return (x.numero || i + 1) === hacia; })[0] || {};
    tr.textContent = '';

    // Separador estático (es lo que se ve con reduced-motion, sin JS de movimiento o al imprimir)
    var sep = FX.crear('div', 'transicion__separador', tr);
    FX.crear('span', 'transicion__marcas', sep);
    var et = FX.crear('span', 'transicion__paso t-dato', sep);
    et.textContent = FX.dos(desde) + ' / ' + FX.dos(hacia);
    FX.crear('span', 'transicion__marcas', sep);

    // Escena fija (solo con movimiento): láminas + número que entra en 3D
    var esc = FX.crear('div', 'transicion__escena', tr);
    var laminas = FX.crear('div', 'transicion__laminas', esc);
    var n = FX.estado.movil ? 6 : 12;
    for (var i = 0; i < n; i++) FX.crear('i', 'transicion__lamina' + (i % 2 ? ' es-par' : ''), laminas);
    var plano = FX.crear('div', 'transicion__plano', esc);
    var num = FX.crear('p', 'transicion__numero', plano);
    num.textContent = FX.dos(hacia);
    var ficha = FX.crear('p', 'transicion__ficha t-dato', plano);
    FX.crear('span', null, ficha).textContent = 'Semana ' + FX.dos(hacia);
    var tit = FX.crear('span', 'transicion__titulo', ficha);
    FX.pintar(tit, s.titulo);
    var indice = FX.crear('span', 'transicion__indice', esc);   // la corona del dial con su índice escarcha, que gira
    FX.crear('span', 'transicion__corona', indice);
    FX.crear('span', 'transicion__punto', indice);
    return { tr: tr, esc: esc, laminas: FX.$$('.transicion__lamina', laminas), plano: plano, num: num, ficha: ficha, indice: indice };
  }

  function animar(T, c) {
    var gsap = window.gsap;
    var movil = !!c.movil;
    var L = T.laminas;
    var pares = L.filter(function (_, i) { return i % 2; });
    var impares = L.filter(function (_, i) { return !(i % 2); });

    gsap.set(T.esc, { autoAlpha: 0 });
    gsap.set(L, { scaleY: 0 });
    gsap.set(impares, { transformOrigin: '50% 0%' });
    gsap.set(pares, { transformOrigin: '50% 100%' });
    gsap.set(T.plano, { transformPerspective: 1600, z: movil ? -500 : -900, rotationY: movil ? -8 : -16, autoAlpha: 0 });
    gsap.set(T.ficha, { clipPath: 'inset(0% 100% 0% 0%)' });
    gsap.set(T.indice, { rotation: -90, autoAlpha: 0 });

    var tl = gsap.timeline({ defaults: { ease: 'none' } });
    // 0 → 0.38: las láminas se cierran (alternas, desde el centro hacia los bordes)
    tl.to(L, { scaleY: 1, duration: 0.38, ease: 'power3.in', stagger: { each: 0.012, from: 'center' } }, 0)
      .to(T.indice, { autoAlpha: 1, rotation: 0, duration: 0.3, ease: 'power2.out' }, 0.1)
      // 0.22 → 0.55: el número llega desde el fondo y gira de frente
      .to(T.plano, { z: 0, rotationY: 0, autoAlpha: 1, duration: 0.26, ease: 'power3.out' }, 0.34)
      .to(T.ficha, { clipPath: 'inset(-20% 0% -20% 0%)', duration: 0.18, ease: 'power2.out' }, 0.42)
      // 0.55 → 0.62: retén (la sala tapada, el número quieto)
      // 0.62 → 1: las láminas se recogen hacia el lado contrario y la cámara atraviesa el número
      .set(impares, { transformOrigin: '50% 100%' }, 0.6)
      .set(pares, { transformOrigin: '50% 0%' }, 0.6)
      .to(L, { scaleY: 0, duration: 0.34, ease: 'power3.inOut', stagger: { each: 0.012, from: 'edges' } }, 0.62)
      .to(T.plano, { z: movil ? 260 : 520, autoAlpha: 0, duration: 0.18, ease: 'power2.in' }, 0.6)
      .to(T.indice, { rotation: 90, autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 0.66);

    window.ScrollTrigger.create({
      trigger: T.tr,
      start: 'top bottom',
      end: 'bottom top',
      scrub: movil ? 0.3 : 0.5,
      animation: tl,
      onToggle: function (st) { gsap.set(T.esc, { autoAlpha: st.isActive ? 1 : 0 }); }
    });
  }

  FX.registrar('transiciones', function () {
    var semanas = (FX.datos && FX.datos.semanas) || [];
    var lista = FX.$$('.transicion[data-hacia]').map(function (tr) { return construir(tr, semanas); });
    if (!lista.length || !window.gsap || !window.ScrollTrigger || !FX.mm) return;
    FX.mm.add(FX.MQ, function (ctx) {
      var c = ctx.conditions;
      if (c.reducido) return;
      document.documentElement.classList.add('transiciones-vivas');
      lista.forEach(function (T) { animar(T, c); });
      return function () { document.documentElement.classList.remove('transiciones-vivas'); };
    });
  }, 50);
})();
