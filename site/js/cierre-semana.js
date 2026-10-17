/* ==========================================================================
   cierre-semana.js — la lección clave al final de cada semana (constructor 3 · §8)
   Alternativa elegida: 1 · LA LINTERNA (docs/CRITICA-CIERRE-SEMANA.md).

   La lección está en la página desde el principio, cubierta como un documento
   clasificado (cada palabra, una barra). Donde alumbra la linterna (el cursor) se lee.
   La linterna es un regalo, no una puerta:
   - la luz se enciende sola cuando el texto cruza el 40 % superior de la pantalla,
     al recibir foco o con el botón «Encender la luz»;
   - en táctil la linterna barre las líneas con el scroll y se enciende al final;
   - progresión: el radio crece de ~90 px (semana 01) a ~180 px (semana N) y la luz
     se abre más rápido: el observador aprende a ver. La luz final es hielo.
   Estructura: ficha «Lección clave · Semana 0k» + texto real (siempre en el DOM)
   + capa tachada calcada del mismo texto en la misma caja (aria-hidden).
   [PENDIENTE] se ve tal cual (FX.pintar), sin efecto. reduced-motion: revelada.
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
    var id = 'semana-' + FX.dos(k) + '-leccion';
    var raiz = FX.crear('aside', 'cs', cont);
    raiz.setAttribute('aria-labelledby', id);
    var ficha = FX.crear('p', 'cs__ficha t-dato', raiz);
    ficha.id = id;
    FX.crear('span', null, ficha).textContent = 'Lección clave';
    FX.crear('b', null, ficha).textContent = 'Semana ' + FX.dos(k);
    var cuerpo = FX.crear('div', 'cs__cuerpo', raiz);
    var escena = FX.crear('div', 'cs__escena', cuerpo);
    var texto = FX.pintar(FX.crear('p', 'cs__texto', escena), s.leccion);
    var C = { raiz: raiz, ficha: ficha, cuerpo: cuerpo, escena: escena, texto: texto, k: k };
    if (s.leccion == null || FX.esPendiente(s.leccion)) { raiz.classList.add('cs--pendiente'); C.pendiente = true; return C; }

    raiz.classList.add('cs-linterna');
    var pie = FX.crear('div', 'cs__pie', cuerpo);
    C.cerr = cerraduraSVG(); pie.appendChild(C.cerr);
    C.estado = FX.crear('p', 'cs__estado t-dato', pie);
    C.estado.setAttribute('aria-live', 'polite');
    C.estado.textContent = 'Lección a la vista';
    return C;
  }

  /* ---------- La linterna ---------- */
  function linterna(C, c) {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    var N = Math.max(2, FX.estado.total || 2);
    var t = (C.k - 1) / (N - 1);                      // 0 (semana 01) → 1 (semana N)
    var R = Math.round((c.movil ? 80 : 90) + t * (c.movil ? 60 : 90));
    var DUR = 1.4 - 0.6 * t;                           // la luz se abre más rápido con las semanas
    var fino = FX.estado.punteroFino && !c.movil;

    // Capa tachada: el mismo texto, en la misma caja (mismas reglas de ajuste de línea)
    var tachado = FX.crear('p', 'cs__texto cs__tachado', C.escena);
    tachado.setAttribute('aria-hidden', 'true');
    C.texto.textContent.split(/(\s+)/).forEach(function (w) {
      if (!w) return;
      if (/^\s+$/.test(w)) tachado.appendChild(document.createTextNode(w));
      else FX.crear('span', null, tachado).textContent = w;
    });
    var halo = FX.crear('div', 'cs__halo', C.raiz); halo.setAttribute('aria-hidden', 'true');
    var boton = FX.crear('button', 'cs__luz', C.cerr.parentNode);
    boton.type = 'button';
    boton.textContent = 'Encender la luz';
    C.raiz.setAttribute('data-modo', 'linterna');
    C.escena.setAttribute('data-cursor', 'ninguno');
    C.estado.textContent = fino ? 'Alumbra el texto con el cursor' : 'La linterna avanza con el scroll';

    var L = { x: 0, y: 0, r: 0 }, off = { x: 0, y: 0 }, activo = false, revelada = false;
    var puntero = { x: -1, y: -1, dentro: false };
    function medir() {
      var bt = C.escena.getBoundingClientRect(), br = C.raiz.getBoundingClientRect();
      off.x = bt.left - br.left; off.y = bt.top - br.top;
      return bt;
    }
    function aplicar() {
      if (!activo && !revelada) return;
      C.escena.style.setProperty('--lx', L.x.toFixed(1) + 'px');
      C.escena.style.setProperty('--ly', L.y.toFixed(1) + 'px');
      C.escena.style.setProperty('--lr', L.r.toFixed(1) + 'px');
    }
    var xTo = gsap.quickTo(L, 'x', { duration: 0.45, ease: 'power3', onUpdate: aplicar });
    var yTo = gsap.quickTo(L, 'y', { duration: 0.45, ease: 'power3', onUpdate: aplicar });
    var hx = gsap.quickTo(halo, 'x', { duration: 0.6, ease: 'power3' });
    var hy = gsap.quickTo(halo, 'y', { duration: 0.6, ease: 'power3' });
    function llevar(x, y) { xTo(x); yTo(y); hx(x + off.x); hy(y + off.y); }

    function revelar() {
      if (revelada) return;
      revelada = true;
      C.raiz.setAttribute('data-revelada', '');
      var b = C.escena.getBoundingClientRect();
      if (L.r < 1) { L.x = b.width * 0.2; L.y = b.height * 0.5; }
      gsap.timeline()
        .to(L, { r: Math.hypot(b.width, b.height) * 2.2, duration: DUR, ease: 'expo.inOut', onUpdate: aplicar }, 0)
        .to(tachado, { autoAlpha: 0, duration: 0.4 }, DUR * 0.35)
        .to(halo, { scale: 2.6, autoAlpha: 0, duration: DUR, ease: 'power2.out' }, 0)
        .to(C.cerr.querySelector('g'), { rotation: 90, scale: 1.1, svgOrigin: '200 203', duration: 0.5, ease: 'back.out(2)' }, DUR * 0.5)
        .add(function () { C.raiz.setAttribute('data-luz', ''); }, DUR);
      boton.textContent = 'Luz encendida';
      boton.setAttribute('aria-disabled', 'true');
      C.estado.textContent = 'Lección revelada';
    }
    boton.addEventListener('click', revelar);
    C.raiz.addEventListener('focusin', revelar);

    function local(cx, cy) { var b = C.escena.getBoundingClientRect(); return { x: cx - b.left, y: cy - b.top }; }

    // Solo trabaja mientras el bloque está en pantalla
    ST.create({ trigger: C.raiz, start: 'top bottom', end: 'bottom top', onToggle: function (st) { activo = st.isActive; if (activo) { medir(); aplicar(); } } });

    // Regalo, no puerta: al cruzar el 40 % superior la luz se enciende sola
    ST.create({ trigger: C.escena, start: 'top 40%', onEnter: revelar });

    if (fino) {
      // La linterna se asoma sobre la primera palabra al entrar en pantalla
      ST.create({ trigger: C.raiz, start: 'top 75%', once: true, onEnter: function () {
        if (revelada || puntero.dentro) return;
        medir(); L.x = Math.min(60, C.escena.offsetWidth * 0.1); L.y = 30; aplicar();
        gsap.set(halo, { x: L.x + off.x, y: L.y + off.y });
        gsap.to(L, { r: R * 0.75, duration: 0.8, ease: 'expo.out', onUpdate: aplicar });
        gsap.to(halo, { autoAlpha: 1, duration: 0.6 });
      } });
      C.raiz.addEventListener('pointerenter', function () {
        puntero.dentro = true; medir();
        if (revelada) return;
        gsap.to(L, { r: R, duration: 0.5, ease: 'expo.out', onUpdate: aplicar });
        gsap.to(halo, { autoAlpha: 1, duration: 0.5 });
      });
      C.raiz.addEventListener('pointerleave', function () {
        puntero.dentro = false;
        if (revelada) return;
        gsap.to(L, { r: R * 0.35, duration: 0.6, ease: 'power2.inOut', onUpdate: aplicar });
        gsap.to(halo, { autoAlpha: 0.35, duration: 0.6 });
      });
      C.raiz.addEventListener('pointermove', function (e) {
        puntero.x = e.clientX; puntero.y = e.clientY;
        if (revelada) return;
        var p = local(e.clientX, e.clientY); llevar(p.x, p.y);
      });
      // Con el cursor quieto y la página moviéndose, la linterna sigue sobre el texto
      FX.on('progreso', function () {
        if (!activo || revelada || !puntero.dentro) return;
        medir();
        var p = local(puntero.x, puntero.y); llevar(p.x, p.y);
      });
    } else {
      // Táctil: la linterna barre las líneas con el scroll y la luz se enciende al final
      gsap.set(halo, { autoAlpha: 1 });
      ST.create({
        trigger: C.escena, start: 'top 88%', end: 'top 42%', scrub: 0.5,
        onUpdate: function (st) {
          if (revelada || !activo) return;
          medir();
          var lh = parseFloat(getComputedStyle(C.texto).lineHeight) || 40;
          var n = Math.max(1, Math.round(C.texto.offsetHeight / lh));
          var w = C.texto.offsetWidth, tt = st.progress * n, i = Math.min(n - 1, Math.floor(tt)), f = tt - i;
          L.x = (i % 2 ? 1 - f : f) * w; L.y = (i + 0.5) * lh; L.r = R; aplicar();
          gsap.set(halo, { x: L.x + off.x, y: L.y + off.y });
          if (st.progress > 0.97) revelar();
        }
      });
      C.escena.addEventListener('pointerdown', function (e) { if (revelada) return; var p = local(e.clientX, e.clientY); medir(); llevar(p.x, p.y); });
    }
    FX.on('redimension', medir);
  }

  function revelada(C) {
    if (!C.cerr) return;
    C.raiz.setAttribute('data-revelada', ''); C.raiz.setAttribute('data-luz', '');
    C.estado.textContent = 'Lección revelada';
    if (window.gsap) window.gsap.set(C.cerr.querySelector('g'), { rotation: 90, scale: 1.1, svgOrigin: '200 203' });
  }

  FX.registrar('cierre-semana', function () {
    var semanas = (FX.datos && FX.datos.semanas) || [];
    var lista = [];
    FX.$$('.semana__cierre').forEach(function (cont) {
      var k = parseInt(cont.getAttribute('data-semana'), 10);
      var s = semanas.filter(function (x, i) { return (x.numero || i + 1) === k; })[0];
      if (!s) return;
      var C = pintar(cont, s, k);
      if (!C.pendiente) lista.push(C);
    });
    if (!lista.length) return;
    if (!window.gsap || !window.ScrollTrigger || !FX.mm || FX.estado.reducido) { lista.forEach(revelada); return; }
    // Se monta una sola vez (la linterna no se rehace al cambiar de tamaño)
    var c = { movil: FX.estado.movil };
    lista.forEach(function (C) { linterna(C, c); });
  }, 50);
})();
