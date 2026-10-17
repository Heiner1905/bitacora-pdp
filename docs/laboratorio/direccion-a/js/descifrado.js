/* Descifrado por estados tipográficos (patrón 2xA, investigacion-3-particulas.md §3).
   El glifo correcto está siempre en su sitio: solo cambia su tratamiento (invertido, naranja,
   borde azul, contorno, apagado) en un frente que barre de izquierda a derecha.
   Sin reflow: solo se cambia className. Nunca se aplica a un [PENDIENTE] ni a la reflexión.
   API: window.Descifrado.revelar(el, { duracion: 1.2, fps: 24 }) */
(function () {
  "use strict";
  var ESTADOS = ["e1", "e2", "e3", "e4", "e5"];

  function partir(el) {
    if (el._chars) return el._chars;
    var texto = el.textContent;
    el.setAttribute("aria-label", texto);
    el.textContent = "";
    var chars = [];
    // palabras en nowrap para que el corte de línea no cambie
    texto.split(/(\s+)/).forEach(function (trozo) {
      if (!trozo) return;
      if (/^\s+$/.test(trozo)) { el.appendChild(document.createTextNode(trozo)); return; }
      var w = document.createElement("span");
      w.style.whiteSpace = "nowrap";
      w.setAttribute("aria-hidden", "true");
      for (var i = 0; i < trozo.length; i++) {
        var s = document.createElement("span");
        s.className = "ch";
        s.textContent = trozo[i];
        w.appendChild(s);
        chars.push(s);
      }
      el.appendChild(w);
    });
    el._chars = chars;
    return chars;
  }

  function revelar(el, op) {
    op = op || {};
    if (!el || el.classList.contains("pendiente")) return;
    var chars = partir(el);
    var dur = (op.duracion || 1.2) * 1000, fps = op.fps || 24, n = chars.length;
    var t0 = performance.now();
    if (el._intervalo) clearInterval(el._intervalo);
    chars.forEach(function (c) { c.className = "ch " + ESTADOS[(Math.random() * ESTADOS.length) | 0]; });
    el._intervalo = setInterval(function () {
      var p = (performance.now() - t0) / dur;
      var listos = 0;
      for (var i = 0; i < n; i++) {
        var inicio = (i / Math.max(1, n - 1)) * 0.62; // el frente barre de izquierda a derecha
        var local = (p - inicio) / 0.38;
        if (local >= 1) { chars[i].className = "ch"; listos++; }
        else if (local > 0) chars[i].className = "ch " + ESTADOS[(Math.random() * ESTADOS.length) | 0];
      }
      if (listos >= n) { clearInterval(el._intervalo); el._intervalo = 0; if (op.alTerminar) op.alTerminar(); }
    }, 1000 / fps);
  }

  window.Descifrado = { revelar: revelar, partir: partir };
})();
