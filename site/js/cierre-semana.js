/* ==========================================================================
   cierre-semana.js — la lección clave al final de cada semana (constructor 3 · §8)
   Tarjeta editorial estática:
   - Ficha «Lección clave · Semana 0k» en mono (--tinta-2).
   - Texto real (.cs__texto) en Newsreader grande (--tinta), max-width 30ch,
     siempre visible desde el primer instante (opacity: 1, transform: none).
   - Sello decorativo de la cerradura del emblema en --rubi (aria-hidden="true").
   - Filo rubí de 2 px y superficie limpia (--superficie).
   - [PENDIENTE] se pinta tal cual con FX.pintar en su recuadro punteado.
   - En puntero fino con movimiento permitido, un halo suave de tinta (.cs__halo)
     sigue al cursor dentro de la tarjeta con gsap.quickTo.
   ========================================================================== */
(function () {
  'use strict';
  var FX = window.FX;
  if (!FX) return;
  var NS = 'http://www.w3.org/2000/svg';

  function cerraduraSVG() {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'cs__cerradura');
    svg.setAttribute('viewBox', '186 184 28 30');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<g><circle cx="200" cy="195" r="6.5"/><polygon points="196.6,199 203.4,199 206,211 194,211"/></g>';
    return svg;
  }

  function pintar(cont, s, k) {
    cont.textContent = '';
    var kk = FX.dos(k);
    var id = 'semana-' + kk + '-leccion';
    var raiz = FX.crear('aside', 'cs', cont);
    raiz.setAttribute('aria-labelledby', id);
    if (s.leccion == null || FX.esPendiente(s.leccion)) {
      raiz.classList.add('cs--pendiente');
    }

    var halo = FX.crear('div', 'cs__halo', raiz);
    halo.setAttribute('aria-hidden', 'true');

    var ficha = FX.crear('p', 'cs__ficha t-dato', raiz);
    ficha.id = id;
    FX.crear('span', 'cs__ficha-etq', ficha).textContent = 'Lección clave';
    var sep = FX.crear('span', 'cs__ficha-sep', ficha);
    sep.setAttribute('aria-hidden', 'true');
    sep.textContent = ' · ';
    FX.crear('b', 'cs__ficha-sem', ficha).textContent = 'Semana ' + kk;

    var cuerpo = FX.crear('div', 'cs__cuerpo', raiz);
    var texto = FX.pintar(FX.crear('p', 'cs__texto', cuerpo), s.leccion);

    var sello = FX.crear('div', 'cs__sello', raiz);
    sello.setAttribute('aria-hidden', 'true');
    sello.appendChild(cerraduraSVG());

    return { raiz: raiz, halo: halo, texto: texto, k: k };
  }

  function sincronizarScrollProgramatico() {
    if (!FX.lenis || window.__lenisScrollToSync) return;
    window.__lenisScrollToSync = true;
    var origScrollTo = window.scrollTo;
    var enLenis = false;
    window.scrollTo = function (a, b) {
      origScrollTo.apply(window, arguments);
      if (enLenis || !FX.lenis) return;
      if (arguments.length >= 2 && typeof b === 'number' && isFinite(b)) {
        enLenis = true;
        try { FX.lenis.scrollTo(b, { immediate: true, force: true }); } catch (err) {}
        enLenis = false;
      }
    };
  }

  function activarHalo(lista) {
    var gsap = window.gsap;
    if (!gsap || !FX.estado.punteroFino || FX.estado.movil || FX.estado.reducido) return;

    var items = lista.map(function (C) {
      return {
        raiz: C.raiz,
        halo: C.halo,
        dentro: false,
        xTo: gsap.quickTo(C.halo, 'x', { duration: 0.18, ease: 'power3.out' }),
        yTo: gsap.quickTo(C.halo, 'y', { duration: 0.18, ease: 'power3.out' })
      };
    });

    function alMover(e) {
      if (!FX.estado.punteroFino || FX.estado.movil || FX.estado.reducido) return;
      var cx = e.clientX;
      var cy = e.clientY;
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        var r = it.raiz.getBoundingClientRect();
        if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) {
          it.dentro = true;
          it.xTo(cx - r.left);
          it.yTo(cy - r.top);
          gsap.to(it.halo, { opacity: 1, duration: 0.18, ease: 'power2.out', overwrite: 'auto' });
        } else if (it.dentro) {
          it.dentro = false;
          gsap.to(it.halo, { opacity: 0, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
        }
      }
    }

    window.addEventListener('mousemove', alMover, { passive: true });
    window.addEventListener('pointermove', alMover, { passive: true });
    document.addEventListener('mouseleave', function () {
      for (var i = 0; i < items.length; i++) {
        if (items[i].dentro) {
          items[i].dentro = false;
          gsap.to(items[i].halo, { opacity: 0, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
        }
      }
    });
  }

  FX.registrar('cierre-semana', function () {
    sincronizarScrollProgramatico();
    var semanas = (FX.datos && FX.datos.semanas) || [];
    var lista = [];
    FX.$$('.semana__cierre').forEach(function (cont) {
      var k = parseInt(cont.getAttribute('data-semana'), 10);
      var s = semanas.filter(function (x, i) { return (x.numero || i + 1) === k; })[0];
      if (!s) return;
      lista.push(pintar(cont, s, k));
    });
    if (lista.length) activarHalo(lista);
  }, 50);
})();
