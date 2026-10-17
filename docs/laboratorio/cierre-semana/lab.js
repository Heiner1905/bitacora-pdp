/* Laboratorio · cierre de semana — mini FX (mismo contrato que js/core.js) y datos de prueba.
   La lección de la semana 3 es una MUESTRA rotulada (no es contenido de Heiner);
   la de la semana 4 es el caso real de hoy: [PENDIENTE]. */
(function () {
  'use strict';
  var mqR = matchMedia('(prefers-reduced-motion: reduce)');
  var FX = {
    estado: { reducido: mqR.matches, punteroFino: matchMedia('(hover: hover) and (pointer: fine)').matches, movil: matchMedia('(max-width: 899px)').matches },
    esPendiente: function (v) { return typeof v === 'string' && v.indexOf('[PENDIENTE') === 0; },
    pintar: function (el, valor) {
      var v = valor == null ? '[PENDIENTE]' : String(valor);
      el.textContent = v;
      if (FX.esPendiente(v)) { el.classList.add('pendiente'); el.setAttribute('data-pendiente', 'true'); }
      return el;
    },
    dos: function (n) { return (n < 10 ? '0' : '') + n; },
    $: function (s, c) { return (c || document).querySelector(s); },
    $$: function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); },
    crear: function (tag, clase, padre) { var el = document.createElement(tag); if (clase) el.className = clase; if (padre) padre.appendChild(el); return el; }
  };
  var LECCIONES = {
    3: 'Texto de muestra: aquí irá la lección clave de la semana, escrita por Heiner en una o dos frases, para ver cómo se revela.',
    4: '[PENDIENTE: la lección clave de la semana]'
  };
  window.LAB = { FX: FX, LECCIONES: LECCIONES };
  window.addEventListener('DOMContentLoaded', function () {
    if (window.gsap) ['ScrollTrigger', 'CustomEase', 'SplitText'].forEach(function (n) { if (window[n]) gsap.registerPlugin(window[n]); });
    FX.$$('.semana__cierre').forEach(function (c) {
      var k = parseInt(c.getAttribute('data-semana'), 10);
      if (window.CierreAlt) window.CierreAlt(c, { numero: k, leccion: LECCIONES[k] }, FX);
      var m = c.getAttribute('data-muestra');
      if (m) { var r = FX.crear('span', 'lab-rotulo lab-rotulo--muestra'); r.textContent = m; c.insertBefore(r, c.firstChild); }
    });
  });
})();
