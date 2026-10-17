/* ==========================================================================
   combinacion.js — la tira de la combinación (constructor 2)
   En #combinacion (encabezado): N casillas 01…N. Recorridas = hielo,
   actual = rubí (una aguja que salta de casilla en casilla con retén),
   futuras = acero punteado. Avanza con FX.on('semana'). Clic = FX.irA('#semana-0k').
   En < 600px se compacta: marcas finas + lectura «03 / 10».
   ========================================================================== */
(function () {
  'use strict';
  var FX = window.FX;
  if (!FX) return;

  FX.registrar('combinacion', function () {
    var raiz = document.getElementById('combinacion');
    if (!raiz) return;
    var semanas = (FX.datos && FX.datos.semanas) || [];
    var N = semanas.length;
    if (!N) return;
    var gsap = window.gsap;

    raiz.textContent = '';
    raiz.setAttribute('role', 'navigation');
    raiz.setAttribute('aria-label', 'Combinación: semanas recorridas');
    raiz.style.setProperty('--n', N);

    var tira = FX.crear('div', 'combinacion__tira', raiz);
    var aguja = FX.crear('span', 'combinacion__aguja', tira);
    aguja.setAttribute('aria-hidden', 'true');
    var ol = FX.crear('ol', 'combinacion__casillas', tira);

    var casillas = semanas.map(function (s, i) {
      var k = s.numero || i + 1, kk = FX.dos(k);
      var li = FX.crear('li', 'combinacion__item', ol);
      var a = FX.crear('a', 'casilla', li);
      a.href = '#semana-' + kk;
      a.setAttribute('data-k', k);
      var n = FX.crear('span', 'casilla__num', a);
      n.textContent = kk;
      n.setAttribute('aria-hidden', 'true');
      var sr = FX.crear('span', 'sr-only', a);
      var titulo = FX.esPendiente(s.titulo) ? '' : ': ' + s.titulo;
      sr.textContent = 'Semana ' + kk + titulo;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        FX.irA('#semana-' + kk);
        var dest = document.getElementById('semana-' + kk);
        if (dest) { dest.setAttribute('tabindex', '-1'); dest.focus({ preventScroll: true }); }
      });
      return a;
    });

    // En móvil las casillas son marcas finas: la tira entera es un solo botón (≥ 44 px) que abre el índice
    var abrir = FX.crear('button', 'combinacion__abrir', raiz);
    abrir.type = 'button';
    abrir.addEventListener('click', function () {
      if (FX.indice && typeof FX.indice.abrir === 'function') FX.indice.abrir(abrir);
      else { var sig = Math.min(N, Math.max(1, (actual | 0) + 1)); FX.irA('#semana-' + FX.dos(sig)); }
    });
    var mqCompacta = window.matchMedia('(max-width: 599px)');
    function modoCompacto() {
      var comp = mqCompacta.matches;
      abrir.hidden = !comp;
    }
    if (mqCompacta.addEventListener) mqCompacta.addEventListener('change', modoCompacto); else mqCompacta.addListener(modoCompacto);
    modoCompacto();

    var marcasEl = FX.crear('ol', 'combinacion__marcas', raiz);
    marcasEl.setAttribute('aria-hidden', 'true');
    var marcas = semanas.map(function () { return FX.crear('li', 'combinacion__marca', marcasEl); });

    var lectura = FX.crear('p', 'combinacion__lectura', raiz);
    lectura.setAttribute('aria-hidden', 'true');
    var lecK = FX.crear('span', 'combinacion__k', lectura);
    FX.crear('span', 'combinacion__de', lectura).textContent = ' / ' + FX.dos(N);

    var actual = -1;
    var xTo = null;

    function posicion(k) {
      var a = casillas[k - 1];
      return a ? a.parentNode.offsetLeft : 0;
    }

    function marcar(k, inmediato) {
      casillas.forEach(function (a, i) {
        var n = i + 1;
        var est = n < k ? 'recorrida' : n === k ? 'actual' : 'futura';
        a.setAttribute('data-estado', est);
        if (marcas[i]) marcas[i].setAttribute('data-estado', est);
        if (est === 'actual') a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
        var sr = a.querySelector('.sr-only');
        var base = sr.textContent.replace(/ \((recorrida|actual|por recorrer)\)$/, '');
        sr.textContent = base + (est === 'recorrida' ? ' (recorrida)' : est === 'actual' ? ' (actual)' : ' (por recorrer)');
      });
      lecK.textContent = k > 0 ? FX.dos(k) : '00';
      abrir.setAttribute('aria-label', (k > 0 ? 'Semana ' + FX.dos(k) + ' de ' + FX.dos(N) : 'Portada, ' + N + ' semanas') + '. Abrir el índice');
      raiz.setAttribute('data-k', k);

      var visible = k > 0;
      var x = visible ? posicion(k) : posicion(1);
      if (!gsap || FX.estado.reducido || inmediato) {
        if (gsap) gsap.set(aguja, { x: x, autoAlpha: visible ? 1 : 0, scaleX: 1 });
        else { aguja.style.transform = 'translateX(' + x + 'px)'; aguja.style.opacity = visible ? 1 : 0; }
        return;
      }
      if (!xTo) xTo = gsap.quickTo(aguja, 'x', { duration: 0.55, ease: 'expo.out' });
      gsap.to(aguja, { autoAlpha: visible ? 1 : 0, duration: 0.25, overwrite: 'auto' });
      // salto con retén: la aguja se estira un instante en la dirección del avance
      var dir = k > actual ? 1 : -1;
      gsap.fromTo(aguja, { scaleX: 1.6, transformOrigin: dir > 0 ? '100% 50%' : '0% 50%' }, { scaleX: 1, duration: 0.5, ease: 'expo.out', overwrite: false });
      xTo(x);
      // la casilla recién alcanzada hace «clic»
      var a = casillas[k - 1];
      if (a) gsap.fromTo(a, { y: dir * -3 }, { y: 0, duration: 0.45, ease: 'back.out(3)' });
    }

    FX.on('semana', function (e) {
      var k = Math.max(0, Math.min(N, e.k | 0));
      if (k === actual) return;
      marcar(k, actual < 0);
      actual = k;
    });
    FX.on('redimension', function () { if (actual >= 0) marcar(actual, true); });

    marcar(FX.estado.semana || 0, true);
    actual = FX.estado.semana || 0;
  }, 15);
})();
