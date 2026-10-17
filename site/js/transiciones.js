/* ==========================================================================
   transiciones.js — paso de una semana a la siguiente (constructor 3 · §8)
   En cada .transicion[data-desde][data-hacia] (los pinta semana.js), guiado por scrub.
   La sala se tapa con PIEZAS DEL EMBLEMA, que se turnan cada tres semanas:
     · dial      (semanas 02–04): los sectores del dial de la caja fuerte entran uno a uno
                  con retén y la corona de marcas gira: la combinación avanza;
     · párpado   (semanas 05–07): el observador parpadea entre escenas; los párpados se
                  cierran sobre el horizonte y se vuelven a abrir;
     · cerradura (semanas 08–10): se entra por la cerradura (crece hasta tapar la sala)
                  y al salir gira 90° y se cierra sobre el número de la semana.
   Con la sala tapada, las partículas arman el «0k» desde el fragmento de la marca
   (FX.particulas.formarTexto, desde 'marca') y la tira pasa a k (FX.fijarSemana(k)).
   Al descubrir, ese MISMO número viaja y aterriza píxel a píxel sobre .semana__numero
   de la cabecera real y se le entrega: un solo número visible en cada cuadro.
   Fuera de su tramo la escena queda en autoAlpha 0, sin puntero y bajo la sección;
   si se sale a mitad de una formación de partículas, se dispersan.
   reduced-motion / sin GSAP: separador estático (marcas del dial + «03 / 04»).

   Contrato: FX.transiciones.maneja(k) → true si la transición entrega el número de la
   semana k; evento FX 'transicion:entrega' {k}. Mientras la transición no lo ha entregado,
   el número real queda oculto (atributo data-tr-oculta en la sección).
   ========================================================================== */
(function () {
  'use strict';
  var FX = window.FX;
  if (!FX) return;
  var NS = 'http://www.w3.org/2000/svg';

  var VARIANTES = ['dial', 'parpado', 'cerradura'];
  function variante(k) { return VARIANTES[Math.floor((k - 2) / 3) % VARIANTES.length]; }
  var manejadas = {};
  FX.transiciones = { maneja: function (k) { return !!manejadas[k]; }, variante: variante };

  var SECTORES = 12;

  function svgPantalla(clase, padre) {
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('class', clase);
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('preserveAspectRatio', 'none');
    padre.appendChild(s);
    return s;
  }
  function nodo(tag, attrs, padre) {
    var n = document.createElementNS(NS, tag);
    for (var a in attrs) n.setAttribute(a, attrs[a]);
    if (padre) padre.appendChild(n);
    return n;
  }

  function construir(tr, semanas) {
    var desde = parseInt(tr.getAttribute('data-desde'), 10);
    var hacia = parseInt(tr.getAttribute('data-hacia'), 10);
    var s = semanas.filter(function (x, i) { return (x.numero || i + 1) === hacia; })[0] || {};
    var v = variante(hacia);
    tr.textContent = '';
    tr.setAttribute('data-variante', v);

    // Separador estático (reduced-motion, sin JS de movimiento, impresión)
    var sep = FX.crear('div', 'transicion__separador', tr);
    FX.crear('span', 'transicion__marcas', sep);
    FX.crear('span', 'transicion__paso t-dato', sep).textContent = FX.dos(desde) + ' / ' + FX.dos(hacia);
    FX.crear('span', 'transicion__marcas', sep);

    var esc = FX.crear('div', 'transicion__escena', tr);
    var svg = svgPantalla('transicion__piezas transicion__piezas--' + v, esc);
    var num = FX.crear('p', 'transicion__numero', esc);
    num.textContent = FX.dos(hacia);
    var ficha = FX.crear('p', 'transicion__ficha t-dato', esc);
    FX.crear('span', 'transicion__semana', ficha).textContent = 'Semana ' + FX.dos(hacia);
    FX.pintar(FX.crear('span', 'transicion__titulo', ficha), s.titulo);
    return { tr: tr, k: hacia, v: v, esc: esc, svg: svg, num: num, ficha: ficha };
  }

  /* ---------- Las piezas del emblema (se dibujan al tamaño de la pantalla) ---------- */
  function dibujar(T) {
    var vw = window.innerWidth, vh = window.innerHeight, cx = vw / 2, cy = vh / 2;
    var svg = T.svg;
    svg.setAttribute('viewBox', '0 0 ' + vw + ' ' + vh);
    svg.textContent = '';
    T.geo = { vw: vw, vh: vh, cx: cx, cy: cy };
    if (T.v === 'dial') {
      var R = Math.hypot(vw, vh) / 2 + 4, paso = 360 / SECTORES;
      var g = nodo('g', { 'class': 'dial' }, svg);
      T.sectores = [];
      for (var i = 0; i < SECTORES; i++) {
        var a0 = (i * paso - 90) * Math.PI / 180, a1 = ((i + 1) * paso - 90) * Math.PI / 180;
        var d = 'M' + cx + ' ' + cy + 'L' + (cx + R * Math.cos(a0)).toFixed(1) + ' ' + (cy + R * Math.sin(a0)).toFixed(1) +
          'A' + R + ' ' + R + ' 0 0 1 ' + (cx + R * Math.cos(a1)).toFixed(1) + ' ' + (cy + R * Math.sin(a1)).toFixed(1) + 'Z';
        T.sectores.push(nodo('path', { d: d, 'class': 'sector' + (i % 2 ? ' es-par' : '') }, g));
      }
      // La corona de marcas del dial (dos coronas, como el emblema) y su índice escarcha
      var rc = Math.min(vw, vh) * 0.44;
      T.corona = nodo('g', { 'class': 'corona' }, svg);
      nodo('circle', { cx: cx, cy: cy, r: rc, 'class': 'marcas-finas', 'stroke-dasharray': (2 * Math.PI * rc / 120 * 0.06).toFixed(2) + ' ' + (2 * Math.PI * rc / 120 * 0.94).toFixed(2) }, T.corona);
      nodo('circle', { cx: cx, cy: cy, r: rc, 'class': 'marcas-gruesas', 'stroke-dasharray': (2 * Math.PI * rc / SECTORES * 0.02).toFixed(2) + ' ' + (2 * Math.PI * rc / SECTORES * 0.98).toFixed(2) }, T.corona);
      nodo('circle', { cx: cx, cy: cy - rc - 18, r: 4, 'class': 'indice' }, T.corona);
    } else if (T.v === 'parpado') {
      T.sup = nodo('path', { 'class': 'parpado' }, svg);
      T.inf = nodo('path', { 'class': 'parpado' }, svg);
      T.horizonte = nodo('line', { x1: 0, y1: cy, x2: vw, y2: cy, 'class': 'horizonte' }, svg);
    } else {
      // La cerradura del emblema (círculo + trapecio), en unidades: alto ≈ 1
      T.llave = nodo('g', { 'class': 'llave' }, svg);
      nodo('path', { d: 'M-0.151 -0.11 A0.289 0.289 0 1 1 0.151 -0.11 L0.267 0.356 L-0.267 0.356 Z', 'class': 'cerradura' }, T.llave);
    }
  }
  function parpados(T, a) {
    // a = 0 abierto (fuera de pantalla) → 1 cerrado sobre el horizonte
    var G = T.geo, vw = G.vw, vh = G.vh, cy = G.cy;
    var ys = -80 + (cy + 80) * a, yi = vh + 80 - (vh - cy + 80) * a;
    var c = (1 - a) * vh * 0.32;                       // la curvatura se aplana al cerrar
    T.sup.setAttribute('d', 'M-4 -4H' + (vw + 4) + 'V' + ys.toFixed(1) + 'Q' + (vw / 2) + ' ' + (ys - 2 * c).toFixed(1) + ' -4 ' + ys.toFixed(1) + 'Z');
    T.inf.setAttribute('d', 'M-4 ' + (vh + 4) + 'H' + (vw + 4) + 'V' + yi.toFixed(1) + 'Q' + (vw / 2) + ' ' + (yi + 2 * c).toFixed(1) + ' -4 ' + yi.toFixed(1) + 'Z');
  }
  function cerradura(T, s, rot, x, y) {
    T.llave.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + rot.toFixed(2) + ') scale(' + Math.max(0.0001, s).toFixed(2) + ')');
  }

  function animar(T, c) {
    var gsap = window.gsap;
    var movil = !!c.movil;
    var sec = document.getElementById('semana-' + FX.dos(T.k));
    var real = sec ? FX.$('.semana__numero', sec) : null;
    manejadas[T.k] = !!real;
    dibujar(T);

    function copiarFuente() {
      if (!real) return;
      var cs = getComputedStyle(real);
      ['fontSize', 'fontWeight', 'letterSpacing', 'lineHeight', 'paddingTop', 'paddingBottom', 'fontVariationSettings'].forEach(function (p) { T.num.style[p] = cs[p]; });
    }
    copiarFuente();

    var E = { z: movil ? -500 : -900, ry: movil ? -8 : -16, a: 0, t: 0, f: 1, cub: 0, des: 0 };
    var POSE = { x: 0, y: 0, s: 1, cx: 50, cy: 50 };   // última pose (sin leer de GSAP)
    var entregado = null;

    function pose() {
      var vw = window.innerWidth, vh = window.innerHeight;
      var w = T.num.offsetWidth, h = T.num.offsetHeight;
      var s0 = Math.min(1, (vw * 0.78) / w, (vh * 0.56) / h);
      var cx = (vw - w * s0) / 2, cy = (vh - h * s0) / 2 - vh * 0.04;
      var dx = cx, dy = cy;
      if (real) { var r = real.getBoundingClientRect(); dx = r.left; dy = r.top; }
      var t = E.t, sc = s0 + (1 - s0) * t, x = cx + (dx - cx) * t, y = cy + (dy - cy) * t;
      var op = E.f * E.a * (1 - Math.min(1, Math.max(0, (t - 0.75) / 0.25)));
      T.num.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) perspective(1600px) translateZ(' + E.z.toFixed(1) + 'px) rotateY(' + E.ry.toFixed(2) + 'deg) scale(' + sc.toFixed(4) + ')';
      T.num.style.opacity = op.toFixed(3);
      POSE.x = x; POSE.y = y; POSE.s = sc; POSE.cx = x + w * sc / 2; POSE.cy = y + h * sc / 2;
    }
    function entregar(si) {
      if (si === entregado) return;
      entregado = si;
      if (sec) { if (si) sec.removeAttribute('data-tr-oculta'); else sec.setAttribute('data-tr-oculta', ''); }
      if (si) FX.emitir('transicion:entrega', { k: T.k });
    }

    /* ---- Partículas: el «0k» se arma desde la marca (una vez por entrada en cada sentido) ---- */
    var formando = false;
    function hayParticulas() { var P = FX.particulas; return !!(P && typeof P.formarTexto === 'function' && P.soporta && P.soporta('marca')); }
    function formarNumero() {
      var P = FX.particulas;
      if (!hayParticulas()) { E.f = 1; return; }
      gsap.killTweensOf(E, 'f');
      E.f = 0; pose();
      // Molde invisible con la cifra al tamaño en que se ve (el número va escalado con transform)
      var m = T.molde || (T.molde = FX.crear('p', 'transicion__numero transicion__molde', T.esc));
      m.textContent = T.num.textContent;
      var cs = getComputedStyle(T.num);
      ['fontSize', 'letterSpacing', 'lineHeight', 'paddingTop', 'paddingBottom'].forEach(function (k) {
        var v = parseFloat(cs[k]); m.style[k] = isNaN(v) ? cs[k] : (v * POSE.s) + 'px';
      });
      m.style.fontWeight = cs.fontWeight;
      m.style.transform = 'translate3d(' + POSE.x.toFixed(1) + 'px,' + POSE.y.toFixed(1) + 'px,0)';
      formando = true;
      try {
        P.formarTexto(FX.dos(T.k), m, { desde: 'marca', duracion: 0.6, ocultarDestino: false,
          alTerminar: function () { formando = false; gsap.to(E, { f: 1, duration: 0.3, ease: 'power1.out', onUpdate: pose }); } });
      } catch (e) { formando = false; E.f = 1; }
      setTimeout(function () { if (E.f === 0) { formando = false; gsap.to(E, { f: 1, duration: 0.3, onUpdate: pose }); } }, 1600);
    }
    function soltar() {
      // al salir del tramo a mitad de la formación: nada queda varado
      if (formando && FX.particulas && FX.particulas.dispersar) { try { FX.particulas.dispersar({ duracion: 0.4 }); } catch (e) {} }
      formando = false;
      gsap.killTweensOf(E, 'f');
      E.f = 1;
    }

    /* ---- Las piezas: cubrir (E.cub 0→1) y descubrir (E.des 0→1) ---- */
    var reten = window.CustomEase ? window.CustomEase.create('reten-transicion', 'M0,0 C0.2,0 0.3,0.9 0.55,1.04 0.7,1.1 0.8,0.98 1,1') : gsap.parseEase('back.inOut(2)');
    var suave = gsap.parseEase('power3.inOut');
    function piezas() {
      var G = T.geo;
      if (T.v === 'dial') {
        // cubrir: los sectores entran uno a uno (barrido horario con retén por sector)
        // descubrir: salen en el mismo sentido; la corona gira un paso de la combinación por sector
        var n = SECTORES;
        for (var i = 0; i < n; i++) {
          var e = Math.min(1, Math.max(0, E.cub * n - i));
          var sOut = Math.min(1, Math.max(0, E.des * n - i));
          var sc = reten(e) * (1 - suave(sOut));
          T.sectores[i].setAttribute('transform', sc >= 0.999 ? '' : 'translate(' + G.cx + ' ' + G.cy + ') scale(' + Math.max(0.0001, sc).toFixed(3) + ') translate(' + (-G.cx) + ' ' + (-G.cy) + ')');
        }
        var pasos = (E.cub + E.des) * n, k = Math.floor(pasos), r = pasos - k;
        var ang = (k + reten(r)) * (360 / n) * 0.5;
        T.corona.setAttribute('transform', 'rotate(' + ang.toFixed(2) + ' ' + G.cx + ' ' + G.cy + ')');
        T.corona.style.opacity = Math.min(E.cub * 3, 1 - E.des).toFixed(3);
      } else if (T.v === 'parpado') {
        var a = suave(E.cub) * (1 - suave(E.des));
        parpados(T, a);
        T.horizonte.style.opacity = (a > 0.97 ? 1 : 0).toString();
      } else {
        // la cerradura crece desde el centro hasta tapar la sala; al salir gira 90° y se cierra sobre el número
        var cubre = Math.hypot(G.vw, G.vh) * 2.6;
        var sIn = 0.0001 + cubre * Math.pow(E.cub, 3);
        if (E.des <= 0) { cerradura(T, sIn, 0, G.cx, G.cy); return; }
        var q = suave(E.des);
        var s = cubre * Math.pow(1 - q, 3);
        cerradura(T, s, 90 * Math.min(1, E.des * 1.6), G.cx + (POSE.cx - G.cx) * q, G.cy + (POSE.cy - G.cy) * q);
      }
    }

    gsap.set(T.esc, { autoAlpha: 0 }); T.esc.style.zIndex = '-1';
    gsap.set(T.ficha, { clipPath: 'inset(-20% 0% 120% 0%)' });
    var marca = { k: false }, st = null, arma = { ida: false, vuelta: false };
    var tl = gsap.timeline({ defaults: { ease: 'none' }, onUpdate: function () {
      var p = tl.progress();
      var activo = st && st.isActive;
      // la tira cambia en el cuadro en que el «0k» cubre la pantalla
      var ahora = p >= 0.45;
      if (activo && ahora !== marca.k) { marca.k = ahora; FX.fijarSemana(ahora ? T.k : T.k - 1); }
      if (activo && arma.ida && p >= 0.3 && p < 0.6) { arma.ida = false; formarNumero(); }
      if (activo && arma.vuelta && p <= 0.56 && p > 0.3) { arma.vuelta = false; formarNumero(); }
      // la entrega: en el último cuarto del aterrizaje aparece el número real y el de la transición se funde
      entregar(E.t >= 0.75);
      pose();
      piezas();
    } });

    tl.to(E, { cub: 1, duration: 0.36 }, 0)
      .to(E, { z: 0, ry: 0, a: 1, duration: 0.26, ease: 'power3.out' }, 0.24)
      .to(T.ficha, { clipPath: 'inset(-20% 0% -20% 0%)', duration: 0.14, ease: 'power2.out' }, 0.4)
      // retén (0.5 → 0.6): la sala tapada, el número quieto
      .to(T.ficha, { clipPath: 'inset(-20% 0% 120% 0%)', duration: 0.08, ease: 'power2.in' }, 0.6)
      .to(E, { des: 1, duration: 0.3 }, 0.6)
      .to(E, { t: 1, duration: 0.3, ease: 'power3.inOut' }, 0.6)
      .to({}, { duration: 0.1 }, 0.9);

    function limpiar(fin) {
      // la escena queda invisible, sin puntero y bajo la sección; el scrub termina ya
      var tw = st && st.getTween && st.getTween();
      if (tw) tw.progress(1);
      tl.progress(fin ? 1 : 0);
      gsap.set(T.esc, { autoAlpha: 0 }); T.esc.style.zIndex = '-1';
    }

    if (sec) sec.setAttribute('data-tr-oculta', '');
    st = window.ScrollTrigger.create({
      trigger: T.tr,
      start: 'top bottom',
      end: 'bottom top',
      scrub: movil ? 0.25 : 0.4,
      animation: tl,
      invalidateOnRefresh: true,
      onRefresh: function () { copiarFuente(); dibujar(T); },
      onEnter: function () { arma.ida = true; arma.vuelta = false; if (hayParticulas()) E.f = 0; T.esc.style.zIndex = ''; gsap.set(T.esc, { autoAlpha: 1 }); },
      onEnterBack: function () { arma.vuelta = true; arma.ida = false; T.esc.style.zIndex = ''; gsap.set(T.esc, { autoAlpha: 1 }); },
      onLeave: function () { soltar(); limpiar(true); entregar(true); FX.fijarSemana(null); marca.k = true; },
      onLeaveBack: function () { soltar(); limpiar(false); entregar(false); FX.fijarSemana(null); marca.k = false; }
    });
    if (st.progress >= 1) entregar(true);
    return function () {
      manejadas[T.k] = false;
      if (sec) sec.removeAttribute('data-tr-oculta');
    };
  }

  FX.registrar('transiciones', function () {
    var semanas = (FX.datos && FX.datos.semanas) || [];
    var lista = FX.$$('.transicion[data-hacia]').map(function (tr) { return construir(tr, semanas); });
    if (!lista.length || !window.gsap || !window.ScrollTrigger || !FX.mm) return;
    FX.mm.add(FX.MQ, function (ctx) {
      var c = ctx.conditions;
      if (c.reducido) return;
      document.documentElement.classList.add('transiciones-vivas');
      var limpiezas = lista.map(function (T) { return animar(T, c); });
      return function () {
        limpiezas.forEach(function (f) { f(); });
        document.documentElement.classList.remove('transiciones-vivas');
      };
    });
  }, 50);
})();
