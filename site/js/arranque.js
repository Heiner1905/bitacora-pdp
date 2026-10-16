/* arranque.js — último script: inicia FX cuando el DOM y las fuentes están listos
   (con tope de 2,5 s para no bloquear si una fuente falla). */
(function () {
  'use strict';
  var iniciado = false;
  function go() {
    if (iniciado || !window.FX) return;
    iniciado = true;
    window.FX.iniciar();
    document.documentElement.classList.remove('precarga');
  }
  var fuentes = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fuentes, new Promise(function (r) { setTimeout(r, 2500); })]).then(go, go);
})();
