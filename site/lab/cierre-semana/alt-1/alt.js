/* Alternativa 1 · La linterna
   CierreAlt(contenedor, semana, FX): pinta el cierre de la semana en .semana__cierre. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var uid = 0;

  function cerraduraSVG() {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'cs__cerradura');
    svg.setAttribute('viewBox', '190 186 20 28');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<g><circle cx="200" cy="195" r="6.5"/><polygon points="196.6,199 203.4,199 206,211 194,211"/></g>';
    return svg;
  }

  function ficha(FX, padre, k, id) {
    var f = FX.crear('p', 'cs__ficha t-dato', padre);
    f.id = id;
    f.innerHTML = '<span>Lección clave</span><b>Semana ' + FX.dos(k) + '</b>';
    return f;
  }

  window.CierreAlt = function (cont, sem, FX) {
    var id = 'cs-' + (++uid);
    var raiz = FX.crear('aside', 'cs cs-linterna', cont);
    raiz.setAttribute('aria-labelledby', id);
    ficha(FX, raiz, sem.numero, id);
    var cuerpo = FX.crear('div', 'cs__cuerpo', raiz);
    var escena = FX.crear('div', 'cs__escena', cuerpo);
    var texto = FX.pintar(FX.crear('p', 'cs__texto', escena), sem.leccion);

    // [PENDIENTE] → tal cual, sin efecto
    if (FX.esPendiente(sem.leccion)) { raiz.classList.add('cs--pendiente'); return; }

    var pie = FX.crear('div', 'cs__pie', cuerpo);
    var cerr = cerraduraSVG(); pie.appendChild(cerr);
    var estado = FX.crear('p', 'cs__estado t-dato', pie);

    var gsap = window.gsap;
    if (FX.estado.reducido || !gsap) { estado.textContent = 'Revelada'; gsap && gsap.set(cerr.querySelector('g'), { rotation: 90, scale: 1.15, svgOrigin: '200 203' }); return; }

    // Capa tachada: cada palabra es una barra (decorativa)
    var tachado = FX.crear('p', 'cs__texto cs__tachado', escena);
    tachado.setAttribute('aria-hidden', 'true');
    sem.leccion.split(/(\s+)/).forEach(function (w) {
      if (/^\s+$/.test(w)) tachado.appendChild(document.createTextNode(w));
      else FX.crear('span', '', tachado).textContent = w;
    });
    var halo = FX.crear('div', 'cs__halo', raiz); halo.setAttribute('aria-hidden', 'true');
    var boton = FX.crear('button', 'cs__luz', pie);
    boton.type = 'button';
    boton.textContent = 'Encender la luz';
    estado.textContent = FX.estado.punteroFino ? 'Mueve la linterna sobre el texto' : 'La linterna avanza con el scroll';
    raiz.setAttribute('data-modo', 'linterna');

    var fino = FX.estado.punteroFino;
    var R = fino ? 120 : 92;
    var L = { x: 0, y: 0, r: 0 };
    function aplicar() {
      escena.style.setProperty('--lx', L.x.toFixed(1) + 'px');
      escena.style.setProperty('--ly', L.y.toFixed(1) + 'px');
      escena.style.setProperty('--lr', L.r.toFixed(1) + 'px');
      // el halo vive en el sistema de la raíz
      gsap.set(halo, { x: L.x + off.x, y: L.y + off.y });
    }
    var off = { x: 0, y: 0 };
    function medir() { var bt = texto.getBoundingClientRect(), br = raiz.getBoundingClientRect(); off.x = bt.left - br.left; off.y = bt.top - br.top; }
    window.addEventListener('resize', medir);
    var xTo = gsap.quickTo(L, 'x', { duration: 0.45, ease: 'power3', onUpdate: aplicar });
    var yTo = gsap.quickTo(L, 'y', { duration: 0.45, ease: 'power3', onUpdate: aplicar });

    // Cobertura: rejilla de celdas sobre el texto; al alumbrar el 55 % se enciende la luz
    var COLS = 12, FILAS = 5, vistas = {}, nVistas = 0, revelada = false;
    function marcar(x, y) {
      var w = texto.offsetWidth, h = texto.offsetHeight;
      for (var c = 0; c < COLS; c++) for (var f = 0; f < FILAS; f++) {
        var cx = (c + 0.5) * w / COLS, cy = (f + 0.5) * h / FILAS;
        if ((cx - x) * (cx - x) + (cy - y) * (cy - y) < R * R * 0.6 && !vistas[c + '-' + f]) { vistas[c + '-' + f] = 1; nVistas++; }
      }
      if (nVistas / (COLS * FILAS) > 0.55) revelar();
    }

    function revelar() {
      if (revelada) return;
      revelada = true;
      raiz.setAttribute('data-revelada', '');
      var b = texto.getBoundingClientRect();
      var tl = gsap.timeline();
      tl.to(L, { r: Math.hypot(b.width, b.height) * 2.2, duration: 1.3, ease: 'expo.inOut', onUpdate: aplicar })
        .to(tachado, { autoAlpha: 0, duration: 0.4 }, 0.5)
        .to(halo, { scale: 3, autoAlpha: 0, duration: 1.2, ease: 'power2.out' }, 0)
        .to(cerr.querySelector('g'), { rotation: 90, scale: 1.15, svgOrigin: '200 203', duration: 0.5, ease: 'back.out(2)' }, 0.7)
        .add(function () { estado.textContent = 'Revelada'; boton.disabled = true; texto.style.webkitMaskImage = 'none'; texto.style.maskImage = 'none'; }, 1.3);
    }
    boton.addEventListener('click', revelar);

    function local(e) { var b = texto.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; }

    if (fino) {
      raiz.addEventListener('pointerenter', function () { medir(); if (!revelada) gsap.to(L, { r: R, duration: 0.5, ease: 'expo.out', onUpdate: aplicar }); gsap.to(halo, { autoAlpha: 1, duration: 0.5 }); });
      raiz.addEventListener('pointerleave', function () { if (!revelada) gsap.to(L, { r: 0, duration: 0.6, ease: 'power2.inOut', onUpdate: aplicar }); gsap.to(halo, { autoAlpha: 0, duration: 0.6 }); });
      raiz.addEventListener('pointermove', function (e) { if (revelada) return; var p = local(e); xTo(p.x); yTo(p.y); marcar(p.x, p.y); });
      // Al entrar en pantalla la linterna se asoma sobre la primera palabra (pista de qué hacer)
      ScrollTrigger.create({ trigger: raiz, start: 'top 55%', once: true, onEnter: function () {
        if (revelada) return;
        medir(); L.x = 40; L.y = 30; aplicar();
        gsap.timeline().to(L, { r: R * 0.8, duration: 0.8, ease: 'expo.out', onUpdate: aplicar })
          .to(halo, { autoAlpha: 1, duration: 0.6 }, 0);
      } });
    } else {
      // Táctil: la linterna barre las líneas con el scroll y al final se enciende la luz
      gsap.set(halo, { autoAlpha: 1 });
      var lineas = function () { return Math.max(1, Math.round(texto.offsetHeight / parseFloat(getComputedStyle(texto).lineHeight))); };
      var barrido = { t: 0 };
      ScrollTrigger.create({
        trigger: raiz, start: 'top 75%', end: 'bottom 70%', scrub: 0.6,
        onUpdate: function (st) {
          if (revelada) return;
          medir();
          var n = lineas(), w = texto.offsetWidth, lh = texto.offsetHeight / n;
          var t = st.progress * n, i = Math.min(n - 1, Math.floor(t)), f = t - i;
          L.x = (i % 2 ? 1 - f : f) * w; L.y = (i + 0.5) * lh; L.r = R; aplicar();
          if (st.progress > 0.96) revelar();
        }
      });
      texto.addEventListener('pointerdown', function (e) { if (revelada) return; var p = local(e); xTo(p.x); yTo(p.y); });
    }
    medir(); aplicar();
  };
})();
