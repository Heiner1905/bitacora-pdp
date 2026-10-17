/* Retícula: geometría de la lámina (columnas mayores, filas, sitio del dial)
   medida desde el ancho real de la ventana, e hilos horizontales de las filas en móvil. */
(function () {
  "use strict";

  var PULSO = 60 / 124;          // 0,4839 s · 124 BPM
  var PASO = PULSO / 2;          // 0,242 s · corchea

  var G = {};                    // geometría vigente
  var root = document.documentElement;

  function medir() {
    var W = root.clientWidth;
    var H = window.innerHeight;
    var movil = W < 900;
    var m = movil ? 16 : 32;
    var g = movil ? 12 : 20;
    var cols = movil ? 4 : 12;
    var mayores = movil ? 2 : 4;
    var col = (W - 2 * m - (cols - 1) * g) / cols;
    var por = cols / mayores;
    var xs = [m];
    for (var k = 1; k < mayores; k++) {
      xs.push(m + por * k * col + (por * k - 1) * g + g / 2);
    }
    xs.push(W - m);
    xs = xs.map(function (x) { return Math.round(x); });

    var barra = movil ? 48 : 56;
    var filaInf = Math.round(Math.min(260, Math.max(220, H * 0.29)));
    var yF = H - filaInf;
    var S, cx, cy, cabezal = 0;
    if (!movil) {
      S = Math.floor(Math.min(560, (yF - barra) * 0.98, 2 * (xs[4] - xs[3]) * 0.95));
      cx = xs[3];
      cy = Math.round(barra + (yF - barra) / 2);
    } else {
      S = Math.floor(Math.min(W - 2 * m, 440, H * 0.46));
      cx = xs[1];
      cy = Math.round(barra + 8 + S / 2);
      cabezal = Math.round(barra + S + 16);
    }
    G = { W: W, H: H, movil: movil, m: m, xs: xs, barra: barra, filaInf: filaInf, yF: yF,
          S: S, cx: cx, cy: cy, cabezal: cabezal, hueco: S * 280 / 560 };

    var s = root.style;
    s.setProperty("--m", m + "px");
    s.setProperty("--barra", barra + "px");
    s.setProperty("--fila-inf", filaInf + "px");
    xs.forEach(function (x, i) { s.setProperty("--x" + i, x + "px"); });
    for (var i = 1; i < xs.length; i++) s.setProperty("--c" + i, (xs[i] - xs[i - 1]) + "px");
    s.setProperty("--dial-s", S + "px");
    s.setProperty("--dial-cx", cx + "px");
    s.setProperty("--dial-cy", cy + "px");
    s.setProperty("--cabezal", cabezal + "px");
    return G;
  }

  // sin retícula a pantalla completa: las líneas viven en los bordes de las celdas
  function dibujarFija() {
    G.verticales = [];
    G.huecos = [];
  }

  /* Hilos en flujo para móvil: uno arriba de cada [data-fila] */
  function hilosMovil() {
    document.querySelectorAll(".hilo--movil").forEach(function (h) { h.remove(); });
    if (!G.movil) return;
    document.querySelectorAll("[data-fila]").forEach(function (f) {
      var h = document.createElement("span");
      h.className = "hilo hilo--movil";
      h.setAttribute("aria-hidden", "true");
      f.insertBefore(h, f.firstChild);
    });
  }

  function dibujarHilos() {
    hilosMovil();
  }

  window.Reticula = {
    PULSO: PULSO,
    PASO: PASO,
    get G() { return G; },
    medir: medir,
    dibujar: function () { dibujarFija(); dibujarHilos(); },
    dibujarHilos: dibujarHilos
  };
})();
