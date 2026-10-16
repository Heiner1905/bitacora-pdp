/* ==========================================================================
   cierre-semana.js — la lección clave al final de cada semana (constructor 3 · §8)
   Pinta en cada .semana__cierre[data-semana=k] la ficha «Lección clave · Semana 0k»
   y BITACORA.semanas[k].leccion. [PENDIENTE] se ve tal cual (FX.pintar), sin efecto.

   El efecto de revelado se elige entre las 3 alternativas de site/lab/cierre-semana/
   (decisión del crítico pendiente). Mientras tanto se pinta el estado final estático,
   que es también el de reduced-motion e impresión.
   ========================================================================== */
(function () {
  'use strict';
  var FX = window.FX;
  if (!FX) return;

  function pintar(cont, s, k) {
    cont.textContent = '';
    var id = 'semana-' + FX.dos(k) + '-leccion';
    var raiz = FX.crear('aside', 'cs', cont);
    raiz.setAttribute('aria-labelledby', id);
    raiz.setAttribute('data-cursor', 'abrir');
    var ficha = FX.crear('p', 'cs__ficha t-dato', raiz);
    ficha.id = id;
    FX.crear('span', null, ficha).textContent = 'Lección clave';
    FX.crear('b', null, ficha).textContent = 'Semana ' + FX.dos(k);
    var cuerpo = FX.crear('div', 'cs__cuerpo', raiz);
    var texto = FX.pintar(FX.crear('p', 'cs__texto', cuerpo), s.leccion);
    if (FX.esPendiente(s.leccion) || s.leccion == null) raiz.classList.add('cs--pendiente');
    return { raiz: raiz, ficha: ficha, cuerpo: cuerpo, texto: texto };
  }

  FX.registrar('cierre-semana', function () {
    var semanas = (FX.datos && FX.datos.semanas) || [];
    FX.$$('.semana__cierre').forEach(function (cont) {
      var sec = cont.closest('[data-semana]');
      var k = parseInt(cont.getAttribute('data-semana') || (sec && sec.getAttribute('data-semana')), 10);
      var s = semanas.filter(function (x, i) { return (x.numero || i + 1) === k; })[0];
      if (!s) return;
      pintar(cont, s, k);
    });
  }, 50);
})();
