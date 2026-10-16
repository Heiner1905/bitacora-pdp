/* ==========================================================================
   core.js — núcleo compartido de FRAGMENTO.EXE
   - Registra los plugins de GSAP y crea Lenis (scroll suave) sincronizado con ScrollTrigger.
   - Expone window.FX: estado, bus de eventos, registro de módulos y utilidades.
   - Calcula el HILO: progreso global (0–1) y semana actual k de N. Todos los
     módulos que muestran avance (emblema, tira de la combinación, índice,
     marca del encabezado, cierre) escuchan FX.on('progreso') y FX.on('semana').

   Orden de carga (scripts clásicos con defer, ver index.html):
   data/semanas.js → GSAP + plugins → Lenis → core.js → módulos → arranque.js
   Cada módulo se registra con FX.registrar(nombre, fn, orden) y NO se inicia solo:
   arranque.js llama FX.iniciar() cuando el DOM y las fuentes están listos.
   ========================================================================== */
(function () {
  'use strict';

  var raiz = document.documentElement;
  var mqReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqFino = window.matchMedia('(hover: hover) and (pointer: fine)');
  var mqMovil = window.matchMedia('(max-width: 899px)');

  var oyentes = {};
  var modulos = [];

  var FX = {
    datos: window.BITACORA || { autor: {}, semanas: [] },

    /* Estado vivo (solo lectura para los módulos; core lo actualiza) */
    estado: {
      reducido: mqReducido.matches,   // prefers-reduced-motion
      punteroFino: mqFino.matches,    // mouse/trackpad (cursor, hover)
      movil: mqMovil.matches,         // < 900px
      progreso: 0,                    // 0–1 de toda la página
      semana: 0,                      // 0 = portada; 1..N = semana actual
      total: 0                        // N = BITACORA.semanas.length
    },

    lenis: null,

    /* ---------- Bus de eventos ----------
       Eventos estándar:
       'progreso'  {p}                    cada frame de scroll (0–1, toda la página)
       'semana'    {k, total, anterior}   cuando cambia la semana actual (0 = portada)
       'listo'     {}                     tras iniciar todos los módulos
       'redimension' {}                   tras ScrollTrigger.refresh */
    on: function (ev, fn) { (oyentes[ev] = oyentes[ev] || []).push(fn); return function () { FX.off(ev, fn); }; },
    off: function (ev, fn) { oyentes[ev] = (oyentes[ev] || []).filter(function (f) { return f !== fn; }); },
    emitir: function (ev, d) { (oyentes[ev] || []).slice().forEach(function (fn) { try { fn(d || {}); } catch (e) { console.error('[FX:' + ev + ']', e); } }); },

    /* ---------- Registro de módulos ----------
       orden: menor se inicia antes. Convención:
       10 encabezado · 20 semanas (render del DOM) · 30 símbolo/portada · 40 viz · 50 transiciones/cierres · 60 índice · 70 cursor · 80 partículas */
    registrar: function (nombre, fn, orden) { modulos.push({ nombre: nombre, fn: fn, orden: orden == null ? 50 : orden }); },

    /* El "01" de la semana actual: un módulo (p. ej. la portada al terminar la
       entrada por la pupila) puede fijar la semana a mano para que el contador
       cambie en el cuadro exacto. FX.fijarSemana(null) devuelve el control al cálculo automático. */
    fijarSemana: function (k) { forzada = k; actualizarSemana(); },

    /* ---------- Utilidades ---------- */
    esPendiente: function (v) { return typeof v === 'string' && v.indexOf('[PENDIENTE') === 0; },

    /* Pinta un valor en un elemento. Si es [PENDIENTE…] lo marca (.pendiente) y nunca se anima. */
    pintar: function (el, valor) {
      if (!el) return el;
      var v = valor == null ? '[PENDIENTE]' : String(valor);
      el.textContent = v;
      if (FX.esPendiente(v)) { el.classList.add('pendiente'); el.setAttribute('data-pendiente', 'true'); }
      else { el.classList.remove('pendiente'); el.removeAttribute('data-pendiente'); }
      return el;
    },

    dos: function (n) { return (n < 10 ? '0' : '') + n; },           // 1 → "01"
    $: function (sel, ctx) { return (ctx || document).querySelector(sel); },
    $$: function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); },
    crear: function (tag, clase, padre) { var el = document.createElement(tag); if (clase) el.className = clase; if (padre) padre.appendChild(el); return el; },

    /* gsap.matchMedia compartido con las 3 condiciones del proyecto:
       FX.mm.add(FX.MQ, function (ctx) { var c = ctx.conditions; if (c.reducido) …; if (c.escritorio) …; if (c.movil) … }) */
    MQ: {
      escritorio: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
      movil: '(max-width: 899px) and (prefers-reduced-motion: no-preference)',
      reducido: '(prefers-reduced-motion: reduce)'
    },
    mm: null,

    /* Scroll programático (anclas del índice, saltar, etc.) */
    irA: function (destino, opciones) {
      var el = typeof destino === 'string' ? document.querySelector(destino) : destino;
      if (!el) return;
      if (FX.lenis && !FX.estado.reducido) FX.lenis.scrollTo(el, Object.assign({ offset: 0, duration: 1.6 }, opciones || {}));
      else el.scrollIntoView({ behavior: 'auto', block: 'start' });
    },

    iniciar: iniciar
  };

  var forzada = null;

  function semanaCalculada() {
    // k = la última semana cuya sección cruzó el 50 % del viewport (0 si ninguna)
    var mitad = window.innerHeight * 0.5, k = 0;
    FX.$$('[data-semana]').forEach(function (s) {
      if (s.getBoundingClientRect().top <= mitad) k = Math.max(k, parseInt(s.getAttribute('data-semana'), 10) || 0);
    });
    return k;
  }

  function actualizarSemana() {
    var k = forzada != null ? forzada : semanaCalculada();
    if (k !== FX.estado.semana) {
      var anterior = FX.estado.semana;
      FX.estado.semana = k;
      raiz.setAttribute('data-semana-actual', k);
      FX.emitir('semana', { k: k, total: FX.estado.total, anterior: anterior });
    }
  }

  function alScroll() {
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var p = Math.min(1, Math.max(0, (window.scrollY || window.pageYOffset) / max));
    FX.estado.progreso = p;
    FX.emitir('progreso', { p: p });
    actualizarSemana();
  }

  function iniciar() {
    var gsap = window.gsap;
    FX.estado.total = (FX.datos.semanas || []).length;
    raiz.style.setProperty('--total-semanas', FX.estado.total);

    if (gsap) {
      ['ScrollTrigger', 'SplitText', 'CustomEase', 'DrawSVGPlugin', 'ScrambleTextPlugin', 'Flip'].forEach(function (n) {
        if (window[n]) gsap.registerPlugin(window[n]);
      });
      FX.mm = gsap.matchMedia();
    }

    // Lenis solo con movimiento (con reduced-motion el scroll es nativo)
    if (!FX.estado.reducido && window.Lenis && gsap && window.ScrollTrigger) {
      FX.lenis = new window.Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.4 });
      FX.lenis.on('scroll', window.ScrollTrigger.update);
      gsap.ticker.add(function (t) { FX.lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    modulos.sort(function (a, b) { return a.orden - b.orden; }).forEach(function (m) {
      try { m.fn(FX); } catch (e) { console.error('[FX] Falló el módulo «' + m.nombre + '»', e); }
    });

    window.addEventListener('scroll', alScroll, { passive: true });
    if (FX.lenis) FX.lenis.on('scroll', alScroll);

    if (window.ScrollTrigger) {
      window.ScrollTrigger.addEventListener('refresh', function () { FX.emitir('redimension'); alScroll(); });
      window.ScrollTrigger.refresh();
    }
    alScroll();
    raiz.classList.add('fx-listo');
    FX.emitir('listo');
  }

  function vigilar(mq, clave) {
    var f = function () { FX.estado[clave] = mq.matches; };
    if (mq.addEventListener) mq.addEventListener('change', f); else if (mq.addListener) mq.addListener(f);
  }
  vigilar(mqReducido, 'reducido');
  vigilar(mqFino, 'punteroFino');
  vigilar(mqMovil, 'movil');

  if (mqReducido.matches) raiz.classList.add('reducido');
  window.FX = FX;
})();
