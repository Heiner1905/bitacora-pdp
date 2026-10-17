/* ==========================================================================
   simbolo.js — el emblema vivo (constructor 1 · docs/DIRECCION.md §4)
   Reproduce el prototipo docs/diseno/simbolo-vivo/SimboloVivo.dc.html:
   - el iris sigue al cursor (x ±28, y ±11 en unidades del viewBox, suavizado);
     sin puntero por 2 s mira a su alrededor solo (cada ~2,4 s, x ±20, y ±7);
     en táctil reacciona al scroll;
   - parpadeo: #…ojo → scaleY(0.06) ~150 ms cada ~4,2 s (con leve azar);
   - el dial gira con el progreso de la página (con retén por semana);
   - el fragmento va de translate(23,-7) a (0,0) y sus bits se desvanecen;
   - clic/tap en la pupila: la cerradura rota 90° y escala 1,15 (origen 200,203),
     la pupila se dilata 22→27 y las fibras pasan de 0,6 a 0,95;
   - pulso rubí claro por el anillo (2 ondas, 1,4 s);
   - reduced-motion: estático (sin parpadeo ni seguimiento).

   API (FX.simbolo):
     var ctl = FX.simbolo.controlar(svgEl, { prefijo: 'simbolo-', boton: elBoton? });
     ctl.mirar(x, y)       iris a (x,y) en unidades del viewBox (se acota y suaviza)
     ctl.vivo(bool)        seguimiento + mirada autónoma + parpadeo (se pausa solo fuera de vista)
     ctl.parpadear()
     ctl.setDial(grados)
     ctl.setFragmento(p)   0 = separado (23,-7) · 1 = encajado; bits 1 − 0,7p y 0 al encajar
     ctl.cerradura(bool)   abre/cierra la cerradura (devuelve el estado)
     ctl.abrirOjo(p)       0 normal → 1 ojo abierto del todo (párpados se separan, iris crece)
     ctl.pulso()           destello rubí claro por #…pulso
     ctl.svg, ctl.el(nombre), ctl.estado()
     var svg = FX.simbolo.montar(contenedor, { prefijo: 'cierre-simbolo-' })  copia inline con ids prefijados
     FX.simbolo.portada    controlador del emblema de la portada (#emblema)
     FX.simbolo.dialDe(p)  ángulo del dial para un progreso p (mismo retén que el hilo)

   Las transformaciones se escriben como atributo `transform` en unidades del
   viewBox (sin transform-box ni svgOrigin), así son exactas en cualquier copia
   y las partículas pueden leerlas con getCTM().
   ========================================================================== */
(function () {
  'use strict';
  var FX = window.FX;
  if (!FX) return;

  /* Plantilla limpia del emblema (antes de que nada lo anime) para FX.simbolo.montar */
  var plantilla = null;
  (function () {
    var s = document.getElementById('emblema');
    if (s) plantilla = s.cloneNode(true);
  })();

  var mqReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqFino = window.matchMedia('(hover: hover) and (pointer: fine)');
  function reducido() { return mqReducido.matches; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function n2(v) { return Math.round(v * 1000) / 1000; }

  /* Escritor de transformaciones SVG: x,y (traslación), r (rotación), sx/sy (escala) alrededor de (ox,oy) */
  function Transformador(el, o) {
    var t = { x: 0, y: 0, r: 0, sx: 1, sy: 1, ox: o ? o[0] : 200, oy: o ? o[1] : 200 };
    t.aplicar = function () {
      if (!el) return;
      var s = '';
      if (t.x || t.y) s += 'translate(' + n2(t.x) + ' ' + n2(t.y) + ') ';
      if (t.r || t.sx !== 1 || t.sy !== 1) {
        s += 'translate(' + t.ox + ' ' + t.oy + ') ';
        if (t.r) s += 'rotate(' + n2(t.r) + ') ';
        if (t.sx !== 1 || t.sy !== 1) s += 'scale(' + n2(t.sx) + ' ' + n2(t.sy) + ') ';
        s += 'translate(' + (-t.ox) + ' ' + (-t.oy) + ')';
      }
      s = s.trim();
      if (s) el.setAttribute('transform', s); else el.removeAttribute('transform');
    };
    return t;
  }

  /* Ángulo del dial para el progreso p: una vuelta en toda la página, con un retén
     (velocidad casi nula) cada vez que se pasa de una semana a la siguiente. */
  function dialDe(p) {
    var N = Math.max(1, FX.estado.total || (FX.datos.semanas || []).length || 1);
    var x = clamp(p, 0, 1) * N, f = Math.floor(x), r = x - f;
    var reten = r - Math.sin(2 * Math.PI * r) / (2 * Math.PI);
    return 360 * (f + 0.45 * r + 0.55 * reten) / N;
  }

  function controlar(svg, op) {
    op = op || {};
    var pre = op.prefijo || 'simbolo-';
    var gsap = window.gsap;
    function el(n) { return svg.querySelector('#' + pre + n); }

    var E = {
      dial: el('dial'), orbita: el('orbita'), todo: el('todo'), pulso: el('pulso'),
      ojo: el('ojo'), pliegue: el('pliegue'), parpados: el('parpados'),
      iris: el('iris'), fibras: el('fibras'), pupilaFondo: el('pupila-fondo'), pupila: el('pupila'),
      fragmento: el('fragmento'), bits: el('bits'),
      clip: svg.querySelector('#' + pre + 'clip-ojo > *')
    };

    var T = {
      dial: Transformador(E.dial),
      ojo: Transformador(E.ojo),
      iris: Transformador(E.iris),
      pupila: Transformador(E.pupila, [200, 203]),
      fragmento: Transformador(E.fragmento),
      parpados: Transformador(E.parpados),
      clip: Transformador(E.clip),
      pliegue: Transformador(E.pliegue)
    };
    T.fragmento.x = 23; T.fragmento.y = -7; T.fragmento.aplicar();

    var st = {
      deseado: false, visible: true, activo: false,
      abierta: false, encajado: false, abrir: 0, frag: 0,
      ultimoMov: 0, px: 0, py: 0, pendiente: false
    };
    var boton = op.boton || null;

    /* ---- La mirada: proxy suavizado (≈ la transición .35s del prototipo) ---- */
    var mirada = { x: 0, y: 0 };
    function aplicarIris() { T.iris.x = mirada.x; T.iris.y = mirada.y; T.iris.aplicar(); }
    var qx = gsap ? gsap.quickTo(mirada, 'x', { duration: 0.35, ease: 'expo.out', onUpdate: aplicarIris }) : null;
    var qy = gsap ? gsap.quickTo(mirada, 'y', { duration: 0.35, ease: 'expo.out', onUpdate: aplicarIris }) : null;

    function mirar(x, y, inmediato) {
      x = clamp(+x || 0, -28, 28); y = clamp(+y || 0, -11, 11);
      if (inmediato || reducido() || !qx) { mirada.x = x; mirada.y = y; if (qx) { qx(x, x); qy(y, y); } aplicarIris(); return; }
      qx(x); qy(y);
    }

    /* ---- Seguimiento del puntero (ratón) ---- */
    function alPuntero(e) {
      st.px = e.clientX; st.py = e.clientY; st.ultimoMov = performance.now();
      if (!st.pendiente) { st.pendiente = true; requestAnimationFrame(seguir); }
    }
    function seguir() {
      st.pendiente = false;
      if (!st.activo) return;
      var r = svg.getBoundingClientRect();
      if (!r.width) return;
      var dx = (st.px - (r.left + r.width / 2)) / r.width * 400;
      var dy = (st.py - (r.top + r.height / 2)) / r.height * 400;
      mirar(dx * 0.14, dy * 0.07);
    }

    /* ---- Táctil: el iris reacciona al scroll (dirección y velocidad) ---- */
    var yAnterior = window.scrollY, tScroll = 0;
    function alScroll() {
      if (!st.activo || mqFino.matches) return;
      var y = window.scrollY, v = FX.lenis ? FX.lenis.velocity : (y - yAnterior);
      yAnterior = y;
      st.ultimoMov = performance.now();
      mirar(Math.sin(y / 260) * 18, clamp(v * 0.9, -11, 11));
      clearTimeout(tScroll);
      tScroll = setTimeout(function () { if (st.activo) mirar(0, 0); }, 420);
    }

    /* ---- Mirada autónoma y parpadeo ---- */
    var relojMirada = 0, relojParpadeo = null;
    function mirarSolo() {
      if (!st.activo) return;
      if (performance.now() - st.ultimoMov > 2000) mirar((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 14);
    }
    function programarParpadeo() {
      if (!gsap) return;
      if (relojParpadeo) relojParpadeo.kill();
      relojParpadeo = gsap.delayedCall(4.2 + (Math.random() - 0.5) * 1.4, function () {
        if (!st.activo) return;
        parpadear();
        programarParpadeo();
      });
    }

    var proxyOjo = { s: 1 };
    function aplicarOjo() { T.ojo.sy = proxyOjo.s; T.ojo.aplicar(); }
    function parpadear() {
      if (!gsap || reducido()) return;
      gsap.killTweensOf(proxyOjo);
      gsap.timeline()
        .to(proxyOjo, { s: 0.06, duration: 0.12, ease: 'sine.inOut', onUpdate: aplicarOjo })
        .to(proxyOjo, { s: 1, duration: 0.12, ease: 'sine.inOut', onUpdate: aplicarOjo }, 0.15);
    }

    function actualizar() {
      var debe = st.deseado && st.visible && !reducido() && !document.hidden;
      if (debe === st.activo) return;
      st.activo = debe;
      if (debe) {
        window.addEventListener('pointermove', alPuntero, { passive: true });
        window.addEventListener('scroll', alScroll, { passive: true });
        relojMirada = setInterval(mirarSolo, 2400);
        programarParpadeo();
      } else {
        window.removeEventListener('pointermove', alPuntero);
        window.removeEventListener('scroll', alScroll);
        clearInterval(relojMirada);
        if (relojParpadeo) { relojParpadeo.kill(); relojParpadeo = null; }
      }
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { st.visible = en[en.length - 1].isIntersecting; actualizar(); }, { rootMargin: '80px' }).observe(svg);
    }
    document.addEventListener('visibilitychange', actualizar);

    /* ---- Cerradura ---- */
    var proxyLlave = { r: 0, s: 1 };
    function aplicarLlave() { T.pupila.r = proxyLlave.r; T.pupila.sx = T.pupila.sy = proxyLlave.s; T.pupila.aplicar(); }
    function fibras() {
      var o = (st.abierta || st.encajado || st.abrir > 0.5) ? 0.95 : 0.6;
      if (!E.fibras) return;
      if (gsap && !reducido()) gsap.to(E.fibras, { attr: { opacity: o }, duration: 0.4, ease: 'sine.out', overwrite: 'auto' });
      else E.fibras.setAttribute('opacity', o);
    }
    function cerradura(abierta) {
      st.abierta = abierta == null ? !st.abierta : !!abierta;
      var d = reducido() || !gsap ? 0 : 1;
      if (gsap) {
        gsap.to(proxyLlave, { r: st.abierta ? 90 : 0, s: st.abierta ? 1.15 : 1, duration: 0.9 * d, ease: 'expo.out', overwrite: true, onUpdate: aplicarLlave });
        if (E.pupilaFondo) gsap.to(E.pupilaFondo, { attr: { r: st.abierta ? 27 : 22 }, duration: 0.4 * d, ease: 'sine.out', overwrite: true });
      } else {
        proxyLlave.r = st.abierta ? 90 : 0; proxyLlave.s = st.abierta ? 1.15 : 1; aplicarLlave();
        if (E.pupilaFondo) E.pupilaFondo.setAttribute('r', st.abierta ? 27 : 22);
      }
      fibras();
      if (boton) {
        boton.setAttribute('aria-pressed', st.abierta ? 'true' : 'false');
        var et = boton.querySelector('[data-etiqueta]') || boton;
        if (et !== boton || !boton.children.length) et.textContent = st.abierta ? 'Cerrar la cerradura del emblema' : 'Abrir la cerradura del emblema';
      }
      return st.abierta;
    }
    if (boton) {
      boton.addEventListener('click', function (e) { e.preventDefault(); cerradura(); });
      boton.setAttribute('aria-pressed', 'false');
    }

    /* ---- Dial, fragmento, ojo abierto, pulso ---- */
    function setDial(g) { T.dial.r = +g || 0; T.dial.aplicar(); }
    function setFragmento(p) {
      p = clamp(+p || 0, 0, 1);
      st.frag = p;
      T.fragmento.x = 23 * (1 - p); T.fragmento.y = -7 * (1 - p); T.fragmento.aplicar();
      if (E.bits) E.bits.setAttribute('opacity', p >= 0.999 ? 0 : n2(1 - 0.7 * p));
      var enc = p >= 0.999;
      if (enc !== st.encajado) { st.encajado = enc; fibras(); }
    }
    function abrirOjo(p) {
      p = clamp(+p || 0, 0, 1);
      var antes = st.abrir > 0.5;
      st.abrir = p;
      var sy = 1 + 0.32 * p, sx = 1 + 0.04 * p;
      T.parpados.sx = T.clip.sx = sx; T.parpados.sy = T.clip.sy = sy;
      T.parpados.aplicar(); T.clip.aplicar();
      T.pliegue.y = -17 * p; T.pliegue.sx = sx; T.pliegue.aplicar();
      T.iris.sx = T.iris.sy = 1 + 0.12 * p; T.iris.aplicar();
      if ((p > 0.5) !== antes) fibras();
    }
    function pulso() {
      if (!E.pulso || !gsap || reducido()) return;
      gsap.killTweensOf(E.pulso);
      gsap.fromTo(E.pulso, { attr: { 'stroke-width': 14, opacity: 0.95 } },
        { attr: { 'stroke-width': 46, opacity: 0 }, duration: 1.4, ease: 'expo.out', repeat: 1 });
    }

    var api = {
      svg: svg,
      prefijo: pre,
      el: function (n) { return E[n] || el(n); },
      mirar: mirar,
      vivo: function (v) { st.deseado = !!v; if (!v) mirar(0, 0); actualizar(); return api; },
      parpadear: parpadear,
      setDial: setDial,
      setFragmento: setFragmento,
      cerradura: cerradura,
      abrirOjo: abrirOjo,
      pulso: pulso,
      estado: function () { return { vivo: st.activo, abierta: st.abierta, fragmento: st.frag, abrir: st.abrir, mirada: { x: mirada.x, y: mirada.y } }; }
    };
    return api;
  }

  /* Copia inline del emblema con ids prefijados (clipPath y aria incluidos) */
  function montar(contenedor, op) {
    op = op || {};
    var pre = op.prefijo || 'copia-simbolo-';
    if (!plantilla || !contenedor) return null;
    var svg = plantilla.cloneNode(true);
    svg.id = pre.replace(/-$/, '') || 'copia-emblema';
    svg.querySelectorAll('[id]').forEach(function (n) { n.id = n.id.replace(/^simbolo-/, pre); });
    svg.querySelectorAll('[clip-path]').forEach(function (n) {
      n.setAttribute('clip-path', n.getAttribute('clip-path').replace('#simbolo-', '#' + pre));
    });
    var lab = svg.getAttribute('aria-labelledby');
    if (lab) svg.setAttribute('aria-labelledby', lab.replace(/^simbolo-/, pre));
    if (op.decorativo) { svg.setAttribute('aria-hidden', 'true'); svg.removeAttribute('role'); }
    contenedor.appendChild(svg);
    return svg;
  }

  FX.simbolo = { controlar: controlar, montar: montar, portada: null, dialDe: dialDe };

  /* ---- El emblema de la portada y el hilo (§5) ---- */
  FX.registrar('simbolo', function (FX) {
    var svg = document.getElementById('emblema');
    if (!svg) return;
    var ctl = controlar(svg, { prefijo: 'simbolo-', boton: document.getElementById('emblema-cerradura') });
    FX.simbolo.portada = ctl;
    var visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[en.length - 1].isIntersecting; if (visible) hilo({ p: FX.estado.progreso }); }).observe(svg);
    }
    function hilo(e) {
      if (!visible) return;
      ctl.setDial(dialDe(e.p));
      ctl.setFragmento(e.p);
    }
    FX.on('progreso', hilo);
    hilo({ p: FX.estado.progreso || 0 });
  }, 29);
})();
