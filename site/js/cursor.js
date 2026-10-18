/* ==========================================================================
   cursor.js — constructor 4 (docs/DIRECCION.md §9)
   Cursor de OJO, dibujado como el emblema en pequeño: párpados hielo,
   iris niebla y la pupila-cerradura rubí.
   - Solo con (hover: hover) and (pointer: fine) y sin reduced-motion.
   - Vive en la «sala»: #portada, .semana__cierre y #cierre. En la lectura
     vuelve el cursor del sistema.
   - Sobre el emblema se CIERRA (lo mira de frente y se deja mirar);
     sobre enlaces y botones se ABRE y la cerradura gira 90° (como al tocar la pupila).
   - Se reevalúa con el scroll (sin mover el mouse): nunca queda pintado sobre el texto.
   - [data-cursor="ninguno"] (en el elemento o un ancestro): el ojo se oculta con suavidad.
   - Con teclado se aparta: al pulsar Tab se oculta hasta que el mouse se mueva.
   API: FX.cursor = { modo(), visible() }
   ========================================================================== */
(function () {
  'use strict';
  if (!window.FX) return;

  var SALA = '#portada, .semana__cierre, #cierre';
  var EMBLEMA = 'svg.emblema, .emblema, [data-cursor="cerrar"]';
  var ACCION = 'a[href], button, [role="button"], label, summary, [data-cursor="abrir"]';

  var DIBUJO =
    '<svg viewBox="-20 -20 40 40" aria-hidden="true" focusable="false">' +
      '<g class="cursor-ojo__ojo">' +
        '<path class="cursor-ojo__parpado" d="M-17 0 A21 21 0 0 1 17 0 A21 21 0 0 1 -17 0 Z"/>' +
        '<g class="cursor-ojo__iris">' +
          '<circle class="cursor-ojo__aro" r="6.6"/>' +
          '<g class="cursor-ojo__cerradura"><circle cx="0" cy="-1.1" r="2"/><polygon points="-1.05,0.2 1.05,0.2 1.85,4.1 -1.85,4.1"/></g>' +
        '</g>' +
      '</g>' +
    '</svg>';

  FX.registrar('cursor', function (FX) {
    var gsap = window.gsap;
    var mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!gsap || !mq.matches || FX.estado.reducido) return;

    var html = document.documentElement;
    var el = FX.crear('div', 'cursor-ojo', document.body);
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = DIBUJO;
    var ojo = el.querySelector('.cursor-ojo__ojo');
    var iris = el.querySelector('.cursor-ojo__iris');
    var cerr = el.querySelector('.cursor-ojo__cerradura');

    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    gsap.set([ojo, cerr], { transformOrigin: '50% 50%' });

    var xTo = gsap.quickTo(el, 'x', { duration: 0.22, ease: 'power3' });
    var yTo = gsap.quickTo(el, 'y', { duration: 0.22, ease: 'power3' });
    // el estiramiento va en el <svg> interior: así no compite con el `scale` de aparecer/clic sobre el contenedor
    var sxTo = gsap.quickTo(el.querySelector('svg'), 'scaleX', { duration: 0.35, ease: 'power3' });
    var ixTo = gsap.quickTo(iris, 'x', { duration: 0.35, ease: 'expo.out' });
    var iyTo = gsap.quickTo(iris, 'y', { duration: 0.35, ease: 'expo.out' });

    var px = -100, py = -100, ultimo = 0, visible = false, modo = '', teclado = false, conocido = false;

    function mostrar(si) {
      if (si === visible) return;
      visible = si;
      html.classList.toggle('cursor-ojo-activo', si);
      el.style.willChange = si ? 'transform' : 'auto';   // la capa solo existe mientras el ojo se mueve
      gsap.to(el, { autoAlpha: si ? 1 : 0, scale: si ? 1 : 0.6, duration: si ? 0.28 : 0.16, ease: 'power3.out', overwrite: 'auto' });
    }

    function fijarModo(m) {
      if (m === modo) return;
      modo = m;
      el.setAttribute('data-modo', m || 'sala');
      // cerrado: párpados casi juntos (como el parpadeo del emblema) · abierto: más alto y la cerradura gira
      gsap.to(ojo, { scaleY: m === 'cerrado' ? 0.08 : m === 'abierto' ? 1.18 : 1, duration: m === 'cerrado' ? 0.18 : 0.42, ease: m === 'cerrado' ? 'power2.in' : 'expo.out', overwrite: 'auto' });
      gsap.to(cerr, { rotation: m === 'abierto' ? 90 : 0, scale: m === 'abierto' ? 1.15 : 1, duration: 0.45, ease: 'expo.out', overwrite: 'auto' });
    }

    /* Decide zona y modo según lo que hay bajo el puntero (sirve para mover y para scroll) */
    function evaluar(t) {
      if (teclado || !conocido) { mostrar(false); return; }
      if (!t || !t.closest || FX.indice && FX.indice.abierto && FX.indice.abierto() || !t.closest(SALA)) { mostrar(false); return; }
      if (t.closest('[data-cursor="ninguno"]')) { mostrar(false); return; }   // otro módulo dibuja su propio cursor (linterna del cierre)
      if (t.closest(ACCION)) fijarModo('abierto');
      else if (t.closest(EMBLEMA)) fijarModo('cerrado');
      else fijarModo('');
      if (!visible) gsap.set(el, { x: px, y: py });
      mostrar(true);
    }

    function mover(e) {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      var ahora = performance.now(), dt = Math.max(16, ahora - ultimo);
      var dx = e.clientX - px, dy = e.clientY - py;
      var vel = conocido ? Math.hypot(dx, dy) / dt : 0;
      px = e.clientX; py = e.clientY; ultimo = ahora; conocido = true; teclado = false;
      xTo(px); yTo(py);
      sxTo(gsap.utils.clamp(1, 1.35, 1 + vel * 0.16));             // se estira con la velocidad
      var n = Math.hypot(dx, dy) || 1, k = gsap.utils.clamp(0, 1, vel * 0.8);
      ixTo(dx / n * 4.5 * k); iyTo(dy / n * 2.2 * k);               // el iris mira hacia donde va
      evaluar(e.target);
    }

    // reposo: el ojo vuelve a su forma y el iris al centro
    var reposo = setInterval(function () {
      if (performance.now() - ultimo > 140) { sxTo(1); ixTo(0); iyTo(0); }
    }, 140);

    // parpadeo ocasional mientras está en la sala (como el emblema)
    function parpadear() {
      if (visible && modo === '' && !document.hidden) {
        gsap.timeline().to(ojo, { scaleY: 0.08, duration: 0.07, ease: 'power2.in' }).to(ojo, { scaleY: 1, duration: 0.12, ease: 'power2.out' });
      }
      tParpadeo = setTimeout(parpadear, 3800 + Math.random() * 2600);
    }
    var tParpadeo = setTimeout(parpadear, 4200);

    // scroll sin mover el mouse: lo que hay debajo cambia → reevaluar en el siguiente cuadro
    var pedido = false;
    function alScroll() {
      if (pedido || !conocido) return;
      pedido = true;
      requestAnimationFrame(function () { pedido = false; evaluar(document.elementFromPoint(px, py)); });
    }

    window.addEventListener('pointermove', mover, { passive: true });
    window.addEventListener('scroll', alScroll, { passive: true });
    FX.on('progreso', alScroll);
    html.addEventListener('pointerleave', function () { mostrar(false); });
    window.addEventListener('blur', function () { mostrar(false); });
    window.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && visible) gsap.fromTo(el, { scale: 0.85 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    }, { passive: true });
    // teclado: el ojo se aparta para que nunca tape el anillo de foco
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' || e.key.indexOf('Arrow') === 0 || e.key === 'Enter' || e.key === ' ') { teclado = true; mostrar(false); }
    });

    html.classList.add('cursor-ojo-listo');
    FX.cursor = { modo: function () { return modo; }, visible: function () { return visible; } };
  }, 70);
})();
