/* ==========================================================================
   transiciones.js — paso de una semana a la siguiente (constructor 3 · §8)
   En cada .transicion[data-desde][data-hacia] (los pinta semana.js), guiado por scrub:
   1. CUBRIR: la sala se tapa. Tres maneras que se turnan cada tres semanas:
        · obturador  (semanas 02–04): láminas alternas, como las hojas de un diafragma;
        · plano 3D   (semanas 05–07): un plano gira desde el borde y cierra la escena;
        · mirilla    (semanas 08–10): un círculo (la pupila) se dilata hasta taparlo todo.
   2. El número de la semana siguiente llega desde el fondo en 3D y queda al centro.
      En ese cuadro la tira y el contador pasan a la semana k (FX.fijarSemana(k)).
   3. DESCUBRIR: la sala se abre y el MISMO número viaja y aterriza píxel a píxel
      sobre .semana__numero de la cabecera real (se mide cada cuadro), donde se
      entrega: no hay dos «0k» distintos.
   reduced-motion / sin GSAP: separador estático (marcas del dial + «03 / 04»).

   Contrato con semana.js: FX.transiciones.maneja(k) → true si la transición entrega
   el número de la semana k (semana.js no debería formarlo con partículas). Mientras la
   transición está activa, el número real de la cabecera se oculta (data-tr-oculta).
   ========================================================================== */
(function () {
  'use strict';
  var FX = window.FX;
  if (!FX) return;

  var VARIANTES = ['obturador', 'plano', 'mirilla'];
  function variante(k) { return VARIANTES[Math.floor((k - 2) / 3) % VARIANTES.length]; }
  var manejadas = {};
  FX.transiciones = { maneja: function (k) { return !!manejadas[k]; }, variante: variante };

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

    // Escena fija (solo con movimiento)
    var esc = FX.crear('div', 'transicion__escena', tr);
    var cubierta = FX.crear('div', 'transicion__cubierta transicion__cubierta--' + v, esc);
    var laminas = [];
    if (v === 'obturador') {
      var n = FX.estado.movil ? 6 : 12;
      for (var i = 0; i < n; i++) laminas.push(FX.crear('i', 'transicion__lamina' + (i % 2 ? ' es-par' : ''), cubierta));
    } else if (v === 'plano') {
      FX.crear('i', 'transicion__hoja', cubierta);
    } else {
      FX.crear('i', 'transicion__disco', cubierta);
    }
    var num = FX.crear('p', 'transicion__numero', esc);
    num.textContent = FX.dos(hacia);
    var ficha = FX.crear('p', 'transicion__ficha t-dato', esc);
    FX.crear('span', 'transicion__semana', ficha).textContent = 'Semana ' + FX.dos(hacia);
    FX.pintar(FX.crear('span', 'transicion__titulo', ficha), s.titulo);
    var indice = FX.crear('span', 'transicion__indice', esc);
    FX.crear('span', 'transicion__corona', indice);
    FX.crear('span', 'transicion__punto', indice);
    return { tr: tr, k: hacia, v: v, esc: esc, cubierta: cubierta, laminas: laminas,
      hoja: FX.$('.transicion__hoja', cubierta), disco: FX.$('.transicion__disco', cubierta),
      num: num, ficha: ficha, indice: indice };
  }

  function animar(T, c) {
    var gsap = window.gsap;
    var movil = !!c.movil;
    var sec = document.getElementById('semana-' + FX.dos(T.k));
    var real = sec ? FX.$('.semana__numero', sec) : null;
    manejadas[T.k] = !!real;

    // El número de la transición copia la tipografía exacta del número real
    function copiarFuente() {
      if (!real) return;
      var cs = getComputedStyle(real);
      ['fontSize', 'fontWeight', 'letterSpacing', 'lineHeight', 'paddingTop', 'paddingBottom', 'fontVariationSettings'].forEach(function (p) { T.num.style[p] = cs[p]; });
    }
    copiarFuente();

    var E = { z: movil ? -500 : -900, ry: movil ? -8 : -16, a: 0, t: 0 };
    var entregado = false;
    function pose() {
      var vw = window.innerWidth, vh = window.innerHeight;
      var w = T.num.offsetWidth, h = T.num.offsetHeight;
      // al centro cabe entero (los números que sangran en la cabecera se ven completos aquí)
      var s0 = Math.min(1, (vw * 0.78) / w, (vh * 0.62) / h);
      var cx = (vw - w * s0) / 2, cy = (vh - h * s0) / 2 - vh * 0.05;
      var dx = cx, dy = cy;
      if (real) { var r = real.getBoundingClientRect(); dx = r.left; dy = r.top; }
      var t = E.t, sc = s0 + (1 - s0) * t, x = cx + (dx - cx) * t, y = cy + (dy - cy) * t;
      gsap.set(T.num, { x: x, y: y, scale: sc, transformOrigin: '0% 0%', z: E.z, rotationY: E.ry, opacity: E.a * (1 - Math.min(1, Math.max(0, (t - 0.75) / 0.25))), transformPerspective: 1600 });
      return { x: (x + w * sc / 2) / vw * 100, y: (y + h * sc / 2) / vh * 100 };
    }
    var cierreMirilla = gsap.parseEase('power3.inOut');
    function entregar(si) {
      if (si === entregado) return;
      entregado = si;
      if (sec) { if (si) sec.removeAttribute('data-tr-oculta'); else sec.setAttribute('data-tr-oculta', ''); }
      if (si) FX.emitir('transicion:entrega', { k: T.k });
    }

    // Estados iniciales por variante
    gsap.set(T.esc, { autoAlpha: 0 });
    gsap.set(T.ficha, { clipPath: 'inset(0% 100% 0% 0%)' });
    gsap.set(T.indice, { rotation: -90, autoAlpha: 0 });
    var L = T.laminas, pares = L.filter(function (_, i) { return i % 2; }), impares = L.filter(function (_, i) { return !(i % 2); });
    if (T.v === 'obturador') {
      gsap.set(L, { scaleY: 0 });
      gsap.set(impares, { transformOrigin: '50% 0%' });
      gsap.set(pares, { transformOrigin: '50% 100%' });
    } else if (T.v === 'plano') {
      gsap.set(T.hoja, { transformPerspective: 1400, transformOrigin: '100% 50%', rotationY: -88 });
    } else {
      gsap.set(T.disco, { clipPath: 'circle(0% at 50% 46%)' });
    }

    var marca = { k: false }, st = null;
    var tl = gsap.timeline({ defaults: { ease: 'none' }, onUpdate: function () {
      var p = tl.progress();
      // La tira cambia en el cuadro en que el «0k» cubre la pantalla
      var activo = st && st.isActive;
      var ahora = p >= 0.45;
      if (activo && ahora !== marca.k) { marca.k = ahora; FX.fijarSemana(ahora ? T.k : T.k - 1); }
      // la entrega: en el último cuarto del aterrizaje el número real aparece debajo y el de la transición se funde
      entregar(E.t >= 0.75);
      var centro = pose();
      // Mirilla: la pupila se cierra SOBRE el número mientras aterriza
      if (T.v === 'mirilla' && p >= 0.36) {
        var q = p < 0.6 ? 0 : cierreMirilla(Math.min(1, (p - 0.6) / 0.32));
        T.disco.style.clipPath = 'circle(' + (130 * (1 - q)).toFixed(2) + '% at ' + centro.x.toFixed(2) + '% ' + centro.y.toFixed(2) + '%)';
      }
    } });

    // 1 · CUBRIR (0 → 0.36)
    if (T.v === 'obturador') {
      tl.to(L, { scaleY: 1, duration: 0.36, ease: 'power3.in', stagger: { each: 0.012, from: 'center' } }, 0);
    } else if (T.v === 'plano') {
      tl.to(T.hoja, { rotationY: 0, duration: 0.36, ease: 'power2.in' }, 0);
    } else {
      tl.to(T.disco, { clipPath: 'circle(130% at 50% 46%)', duration: 0.36, ease: 'power3.in' }, 0);
    }
    tl.to(T.indice, { autoAlpha: 1, rotation: 0, duration: 0.3, ease: 'power2.out' }, 0.08)
      // 2 · el número llega desde el fondo (0.24 → 0.5)
      .to(E, { z: 0, ry: 0, a: 1, duration: 0.26, ease: 'power3.out' }, 0.24)
      .to(T.ficha, { clipPath: 'inset(-20% 0% -20% 0%)', duration: 0.14, ease: 'power2.out' }, 0.4)
      // retén (0.5 → 0.6): la sala tapada, el número quieto
      // 3 · DESCUBRIR (0.6 → 0.94) y el número aterriza en la cabecera
      .to(T.ficha, { clipPath: 'inset(-20% 0% -20% 100%)', duration: 0.1, ease: 'power2.in' }, 0.6)
      .to(E, { t: 1, duration: 0.32, ease: 'power3.inOut' }, 0.6)
      .to(T.indice, { rotation: 90, autoAlpha: 0, duration: 0.24, ease: 'power2.in' }, 0.62);
    if (T.v === 'obturador') {
      tl.set(impares, { transformOrigin: '50% 100%' }, 0.59)
        .set(pares, { transformOrigin: '50% 0%' }, 0.59)
        .to(L, { scaleY: 0, duration: 0.32, ease: 'power3.inOut', stagger: { each: 0.012, from: 'edges' } }, 0.6);
    } else if (T.v === 'plano') {
      tl.set(T.hoja, { transformOrigin: '0% 50%' }, 0.59)
        .to(T.hoja, { rotationY: 88, duration: 0.32, ease: 'power2.inOut' }, 0.6);
    }
    tl.to({}, { duration: 0.06 }, 0.94);

    if (sec) sec.setAttribute('data-tr-oculta', '');
    st = window.ScrollTrigger.create({
      trigger: T.tr,
      start: 'top bottom',
      end: 'bottom top',
      scrub: movil ? 0.3 : 0.5,
      animation: tl,
      invalidateOnRefresh: true,
      onRefresh: function () { copiarFuente(); },
      onToggle: function (st) { gsap.set(T.esc, { autoAlpha: st.isActive ? 1 : 0 }); },
      onLeave: function () { entregar(true); FX.fijarSemana(null); marca.k = true; },
      onLeaveBack: function () { entregar(false); FX.fijarSemana(null); marca.k = false; }
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
