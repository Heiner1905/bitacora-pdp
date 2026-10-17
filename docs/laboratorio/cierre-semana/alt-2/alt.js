/* Alternativa 2 · La combinación
   La lección aparece cifrada en tambores; un dial (el del emblema) marca la combinación
   con retenes al bajar y cada retén pone en claro un grupo de palabras. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var GLIFOS = '0123456789ABCDEF#%&*+<>/';
  var uid = 0;

  function cifrar(palabra, semilla) {
    var s = '', h = semilla;
    for (var i = 0; i < palabra.length; i++) { h = (h * 9301 + 49297) % 233280; s += GLIFOS[h % GLIFOS.length]; }
    return s;
  }

  function dialSVG() {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'cs__dial');
    svg.setAttribute('viewBox', '0 0 400 400');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML =
      '<g class="rueda">' +
        '<circle class="marcas" cx="200" cy="200" r="182" stroke-width="10" stroke-dasharray="0.9 14.98" opacity=".8"/>' +
        '<circle class="marcas" cx="200" cy="200" r="181" stroke-width="22" stroke-dasharray="2.4 93.49"/>' +
        '<circle class="indice" cx="200" cy="30" r="9"/>' +
      '</g>' +
      '<circle class="orbita" cx="200" cy="200" r="140" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>' +
      '<polygon class="fijo" points="200,4 190,-12 210,-12"/>' +
      '<g class="cerradura"><circle cx="200" cy="180" r="26"/><polygon points="186,196 214,196 224,246 176,246"/></g>';
    return svg;
  }

  window.CierreAlt = function (cont, sem, FX) {
    var id = 'cs-' + (++uid);
    var raiz = FX.crear('aside', 'cs cs-combinacion', cont);
    raiz.setAttribute('aria-labelledby', id);
    var f = FX.crear('p', 'cs__ficha t-dato', raiz); f.id = id;
    f.innerHTML = '<span>Lección clave</span><b>Semana ' + FX.dos(sem.numero) + '</b>';
    var cuerpo = FX.crear('div', 'cs__cuerpo', raiz);

    if (FX.esPendiente(sem.leccion)) {
      raiz.classList.add('cs--pendiente');
      FX.pintar(FX.crear('p', 'cs__texto', cuerpo), sem.leccion);
      return;
    }

    var dial = dialSVG(); cuerpo.appendChild(dial);
    // Texto real para lectores de pantalla; la versión visual (tambores) es decorativa
    var real = FX.crear('p', 'sr-only', cuerpo); real.textContent = sem.leccion;
    var vis = FX.crear('p', 'cs__texto', cuerpo); vis.setAttribute('aria-hidden', 'true');
    var ruedas = [];
    sem.leccion.split(/\s+/).forEach(function (w, i, arr) {
      var t = FX.crear('span', 'tambor', vis);
      var r = FX.crear('span', 'tambor__rueda', t);
      FX.crear('span', 'tambor__cifra', r).textContent = cifrar(w, i * 7 + w.length + 3);
      FX.crear('span', 'tambor__claro', r).textContent = w;
      ruedas.push(r);
      if (i < arr.length - 1) vis.appendChild(document.createTextNode(' '));
    });
    var pie = FX.crear('p', 'cs__pie t-dato', cuerpo); pie.setAttribute('aria-hidden', 'true');
    var marcador = FX.crear('b', '', pie);
    var estado = FX.crear('span', '', pie);

    var gsap = window.gsap;
    var PASOS = Math.min(6, ruedas.length);
    function pintarMarcador(n) {
      marcador.textContent = 'Retén ' + n + ' de ' + PASOS;
      estado.textContent = n >= PASOS ? 'Combinación completa' : '';
    }
    if (FX.estado.reducido || !gsap) { pintarMarcador(PASOS); gsap && gsap.set(dial.querySelector('.cerradura'), { rotation: 90, svgOrigin: '200 205' }); return; }

    raiz.setAttribute('data-modo', 'tambores');
    pintarMarcador(0);
    var reten = window.CustomEase ? CustomEase.create('reten', 'M0,0 C0.2,0 0.3,0.9 0.55,1.04 0.7,1.1 0.8,0.98 1,1') : 'back.inOut(2)';

    // Reparte las palabras en PASOS grupos (un retén por grupo)
    var grupos = [];
    for (var g = 0; g < PASOS; g++) grupos.push(ruedas.slice(Math.round(g * ruedas.length / PASOS), Math.round((g + 1) * ruedas.length / PASOS)));

    var tl = gsap.timeline({ defaults: { ease: 'none' } });
    var angulo = 0, rueda = dial.querySelector('.rueda');
    grupos.forEach(function (grupo, i) {
      var giro = (i % 2 ? -1 : 1) * (70 + ((i * 53 + sem.numero * 29) % 110));
      angulo += giro;
      tl.to(rueda, { rotation: angulo, svgOrigin: '200 200', duration: 1, ease: reten })
        .to(grupo, { yPercent: -50, duration: 0.5, ease: 'back.out(2.2)', stagger: 0.06 }, '-=0.25')
        .call(pintarMarcador, [i + 1], '<')
        .call(pintarMarcador, [i], '<-0.001');
    });
    tl.to(dial.querySelector('.cerradura'), { rotation: 90, scale: 1.12, svgOrigin: '200 205', duration: 0.6, ease: 'back.out(2)' })
      .to(dial.querySelector('.indice'), { scale: 1.6, svgOrigin: '200 30', duration: 0.3, yoyo: true, repeat: 1 }, '<');

    var mm = gsap.matchMedia();
    mm.add({ escritorio: '(min-width: 900px)', movil: '(max-width: 899px)' }, function (ctx) {
      if (ctx.conditions.escritorio) {
        ScrollTrigger.create({ animation: tl, trigger: raiz, start: 'top top', end: '+=' + (60 + PASOS * 15) + '%', pin: true, scrub: 0.6 });
      } else {
        ScrollTrigger.create({ animation: tl, trigger: vis, start: 'top 80%', end: 'bottom 35%', scrub: 0.6 });
      }
    });
  };
})();
