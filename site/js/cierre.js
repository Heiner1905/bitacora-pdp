/* ==========================================================================
   cierre.js — el cierre de la bitácora + el pie (constructor 3 · §8)
   Una copia del emblema (FX.simbolo.montar, prefijo 'cierre-simbolo-') completa
   la combinación guiada por scrub:
     1. el dial da la vuelta final con un retén por semana;
     2. el fragmento se acerca y ENCAJA (setFragmento(1)); los bits se desvanecen;
     3. pulso de rubí claro por el anillo (pulso());
     4. el ojo se abre del todo (abrirOjo(1)) y aparece el mensaje final;
     5. las partículas rehacen el emblema completo (FX.particulas.formarSVG)
        y ceden al SVG nítido; el ojo queda vivo, mirando al visitante.
   Si simbolo.js no existe: se inserta assets/emblema.svg con ids prefijados y se
   anima directamente con GSAP (mismo contrato). reduced-motion: estado final.
   Textos: BITACORA.cierre.mensaje y BITACORA.autor ([PENDIENTE] se ve tal cual).
   ========================================================================== */
(function () {
  'use strict';
  var FX = window.FX;
  if (!FX) return;

  var PRE = 'cierre-simbolo-';

  /* ---------- Emblema: copia + controlador (o fallback) ---------- */
  function montarEmblema(cont) {
    var svg = null;
    if (FX.simbolo && typeof FX.simbolo.montar === 'function') {
      try { svg = FX.simbolo.montar(cont, { prefijo: PRE }); } catch (e) { svg = null; }
    }
    if (!svg) {
      var base = document.getElementById('emblema');
      if (!base) return null;
      svg = base.cloneNode(true);
      svg.id = 'cierre-emblema';
      svg.querySelectorAll('[id]').forEach(function (n) { n.id = n.id.replace(/^simbolo-/, PRE); });
      svg.querySelectorAll('[clip-path]').forEach(function (n) { n.setAttribute('clip-path', n.getAttribute('clip-path').replace('#simbolo-', '#' + PRE)); });
      var lab = svg.getAttribute('aria-labelledby');
      if (lab) svg.setAttribute('aria-labelledby', lab.replace(/^simbolo-/, PRE));
      cont.appendChild(svg);
    }
    svg.classList.add('emblema', 'cierre__svg');
    svg.setAttribute('data-cursor', 'cerrar');
    var t = svg.querySelector('title');
    if (t) t.textContent = 'El emblema completo: el dial cerró la combinación, el fragmento volvió al anillo y el ojo está abierto';
    return svg;
  }

  /* Controlador mínimo con el mismo contrato (si simbolo.js aún no está) */
  function controladorPropio(svg) {
    var gsap = window.gsap;
    function el(n) { return svg.querySelector('#' + PRE + n); }
    var dial = el('dial'), frag = el('fragmento'), bits = el('bits'), pulsoEl = el('pulso');
    var parp = el('parpados'), clip = svg.querySelector('#' + PRE + 'clip-ojo > *'), iris = el('iris'), pliegue = el('pliegue');
    function tr(n, s) { if (n) n.setAttribute('transform', s); }
    return {
      svg: svg,
      vivo: function () {}, mirar: function () {}, parpadear: function () {},
      setDial: function (g) { tr(dial, 'rotate(' + g + ' 200 200)'); },
      setFragmento: function (p) {
        tr(frag, 'translate(' + 23 * (1 - p) + ' ' + -7 * (1 - p) + ')');
        if (bits) bits.setAttribute('opacity', p >= 0.999 ? 0 : 1 - 0.7 * p);
      },
      abrirOjo: function (p) {
        var s = 'translate(200 200) scale(' + (1 + 0.04 * p) + ' ' + (1 + 0.32 * p) + ') translate(-200 -200)';
        tr(parp, s); tr(clip, s);
        tr(pliegue, 'translate(0 ' + -17 * p + ')');
        tr(iris, 'translate(200 200) scale(' + (1 + 0.12 * p) + ') translate(-200 -200)');
      },
      pulso: function () {
        if (!gsap || !pulsoEl || FX.estado.reducido) return;
        gsap.fromTo(pulsoEl, { attr: { 'stroke-width': 14, opacity: 0.95 } }, { attr: { 'stroke-width': 46, opacity: 0 }, duration: 1.4, ease: 'expo.out', repeat: 1 });
      },
      cerradura: function () {}
    };
  }

  /* Ángulo del dial: misma ley del hilo (con retén por semana) */
  function dialDe(p) {
    if (FX.simbolo && FX.simbolo.dialDe) return FX.simbolo.dialDe(p);
    var N = Math.max(1, FX.estado.total || 1), x = Math.min(1, Math.max(0, p)) * N, f = Math.floor(x), r = x - f;
    return 360 * (f + 0.45 * r + 0.55 * (r - Math.sin(2 * Math.PI * r) / (2 * Math.PI))) / N;
  }

  /* ---------- DOM ---------- */
  function pintar(sec) {
    var D = FX.datos || {}, A = D.autor || {}, N = (D.semanas || []).length;
    sec.textContent = '';
    var esc = FX.crear('div', 'cierre__escena', sec);
    var marco = FX.crear('div', 'cierre__emblema', esc);
    var svg = montarEmblema(marco);

    var texto = FX.crear('div', 'cierre__texto', esc);
    var h = FX.crear('h2', 'cierre__estado t-dato', texto);
    h.id = 'cierre-titulo';
    sec.setAttribute('aria-labelledby', 'cierre-titulo');
    sec.removeAttribute('aria-label');
    var hA = FX.crear('span', 'cierre__estado-a', h); hA.textContent = 'Combinación completa';
    var hB = FX.crear('span', 'cierre__estado-b', h); hB.textContent = N ? N + ' semanas recorridas' : '';
    var msj = FX.pintar(FX.crear('p', 'cierre__mensaje', texto), D.cierre && D.cierre.mensaje);
    var firma = FX.crear('p', 'cierre__firma', texto);
    FX.pintar(firma, A.nombreCorto || A.nombre);
    var volver = FX.crear('a', 'cierre__volver t-dato', texto);
    volver.href = '#portada';
    volver.textContent = 'Volver al inicio';
    volver.addEventListener('click', function (e) { e.preventDefault(); FX.irA('#portada'); });

    return { esc: esc, marco: marco, svg: svg, texto: texto, estado: h, hA: hA, hB: hB, msj: msj, firma: firma, volver: volver };
  }

  function pintarPie() {
    var pie = document.querySelector('footer.pie');
    if (!pie) return;
    var A = (FX.datos && FX.datos.autor) || {};
    pie.textContent = '';
    var dl = FX.crear('dl', 'pie__creditos t-dato', pie);
    [['Autor', A.nombre], ['Código', A.codigo], ['Programa', A.programa && A.semestre ? A.programa + ' · ' + A.semestre : A.programa],
     ['Materia', A.materia], ['Periodo', A.periodo]].forEach(function (par) {
      var g = FX.crear('div', 'pie__dato', dl);
      FX.crear('dt', null, g).textContent = par[0];
      FX.pintar(FX.crear('dd', null, g), par[1]);
    });
    var proy = FX.crear('p', 'pie__proyecto t-dato', pie);
    proy.textContent = (FX.datos && FX.datos.proyecto) || '';
  }

  /* ---------- Movimiento ---------- */
  function estadoFinal(C, ctl) {
    ctl.setDial(dialDe(1) + 360);
    ctl.setFragmento(1);
    ctl.abrirOjo(1);
  }

  function animar(C, ctl, c) {
    var gsap = window.gsap;
    var pendiente = FX.esPendiente(C.msj.textContent);
    var est = { q: 0, f: 0, o: 0 };
    var p0 = 0.9, dial0 = 0, dial1 = 0;
    var N = Math.max(1, FX.estado.total || 1);
    var pulsado = false, formado = false;

    function aplicar() {
      // dial: de su ángulo real a una vuelta completa más, con un retén por semana
      var x = est.q * N, k = Math.floor(x), r = x - k;
      var reten = (k + 0.3 * r + 0.7 * (r - Math.sin(2 * Math.PI * r) / (2 * Math.PI))) / N;
      ctl.setDial(dial0 + (dial1 - dial0) * Math.min(1, reten));
      ctl.setFragmento(p0 + (1 - p0) * est.f);
      ctl.abrirOjo(est.o);
    }
    function medir() { p0 = Math.min(0.97, FX.estado.progreso || 0.9); dial0 = dialDe(p0); dial1 = dialDe(1) + 360; }
    medir();

    // Estado inicial de los textos (máscaras, nunca fade-up)
    gsap.set([C.hA, C.hB], { clipPath: 'inset(0% 100% 0% 0%)' });
    if (!pendiente) gsap.set(C.msj, { clipPath: 'inset(0% 0% 100% 0%)' });
    gsap.set(C.firma, { clipPath: 'inset(0% 100% 0% 0%)' });
    gsap.set(C.volver, { autoAlpha: 0 });

    var tl = gsap.timeline({ defaults: { ease: 'none' }, onUpdate: function () {
      var t = tl.progress();
      // el encaje: pulso de rubí claro una vez por pasada (y se rearma al volver atrás)
      if (t >= 0.46 && !pulsado) { pulsado = true; ctl.pulso(); C.esc.classList.add('cierre--encajado'); }
      else if (t < 0.4 && pulsado) { pulsado = false; C.esc.classList.remove('cierre--encajado'); }
      if (t > 0.9 && !formado) formar();
      else if (t < 0.4) formado = false;
    } });
    tl.to(est, { q: 1, duration: 0.42, ease: 'power1.inOut', onUpdate: aplicar }, 0)
      .to(est, { f: 1, duration: 0.42, ease: 'power3.in', onUpdate: aplicar }, 0.04)
      .to(C.hA, { clipPath: 'inset(-20% 0% -20% 0%)', duration: 0.1, ease: 'power2.out' }, 0.46)
      .to(C.hB, { clipPath: 'inset(-20% 0% -20% 0%)', duration: 0.1, ease: 'power2.out' }, 0.5)
      .to(est, { o: 1, duration: 0.24, ease: 'power2.inOut', onUpdate: aplicar }, 0.52)
      .to(C.firma, { clipPath: 'inset(-20% 0% -20% 0%)', duration: 0.14, ease: 'power3.out' }, 0.84)
      .to(C.volver, { autoAlpha: 1, duration: 0.06 }, 0.92)
      .to({}, { duration: 0.06 }, 0.94);
    if (!pendiente) tl.to(C.msj, { clipPath: 'inset(-10% 0% -10% 0%)', duration: 0.22, ease: 'power2.out' }, 0.62);

    function formar() {
      // Final: las partículas rehacen el emblema completo y ceden al SVG nítido
      if (formado) return; formado = true;
      var P = FX.particulas;
      if (P && typeof P.formarSVG === 'function') {
        try {
          var cedido = false;
          var ceder = function () { if (cedido) return; cedido = true; gsap.to(C.svg, { autoAlpha: 1, duration: 0.45, ease: 'power1.out' }); };
          gsap.to(C.svg, { autoAlpha: 0, duration: 0.25 });
          P.formarSVG(C.svg, { desde: 'disperso', duracion: 1.8, alTerminar: ceder });
          setTimeout(ceder, 3000);
          return;
        } catch (e) { console.error('[cierre] partículas', e); }
      }
      // Sin partículas: el emblema respira una vez (el todo, completo)
      gsap.fromTo(C.marco, { scale: 0.985 }, { scale: 1, duration: 1.2, ease: 'expo.out' });
    }

    var largo = c.escritorio ? '+=170%' : '+=120%';
    window.ScrollTrigger.create({
      trigger: C.esc.parentNode,
      start: 'top top',
      end: largo,
      pin: true,
      scrub: c.escritorio ? 0.8 : 0.5,
      animation: tl,
      onRefresh: function (st) { if (st.progress === 0) { medir(); aplicar(); } },
      onEnter: function () { medir(); aplicar(); if (ctl.vivo) ctl.vivo(true); }
    });
    aplicar();
  }

  FX.registrar('cierre', function () {
    pintarPie();
    var sec = document.getElementById('cierre');
    if (!sec) return;
    var C = pintar(sec);
    if (!C.svg) return;
    var ctl = null;
    if (FX.simbolo && typeof FX.simbolo.controlar === 'function') {
      try { ctl = FX.simbolo.controlar(C.svg, { prefijo: PRE }); } catch (e) { ctl = null; }
    }
    ctl = ctl || controladorPropio(C.svg);
    C.ctl = ctl;

    if (!window.gsap || !window.ScrollTrigger || !FX.mm || FX.estado.reducido) {
      estadoFinal(C, ctl); C.esc.classList.add('cierre--encajado');
      return;
    }
    FX.mm.add(FX.MQ, function (ctx) {
      var c = ctx.conditions;
      if (c.reducido) { estadoFinal(C, ctl); C.esc.classList.add('cierre--encajado'); return; }
      animar(C, ctl, c);
      return function () { if (ctl.vivo) ctl.vivo(false); };
    });
  }, 55);
})();
