/* Retícula: geometría de la lámina, hairlines fijas y nodos en los cruces.
   Todo se mide desde el ancho real de la ventana; nada se mueve después de dibujado. */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
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

  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  /* Hairlines verticales fijas con un hueco circular alrededor del dial */
  function dibujarFija() {
    var svg = document.querySelector(".reticula");
    svg.innerHTML = "";
    svg.setAttribute("viewBox", "0 0 " + G.W + " " + G.H);
    var defs = el("defs", {}, svg);
    var mask = el("mask", { id: "hueco-dial", maskUnits: "userSpaceOnUse", x: 0, y: 0, width: G.W, height: G.H }, defs);
    el("rect", { x: 0, y: 0, width: G.W, height: G.H, fill: "#fff" }, mask);
    var c = el("circle", { cx: G.cx, cy: G.cy, r: G.hueco, fill: "#000", "class": "hueco" }, mask);
    var grupo = el("g", { mask: "url(#hueco-dial)" }, svg);
    var y0 = G.barra;
    G.verticales = G.xs.map(function (x) {
      return el("line", { x1: x + 0.5, x2: x + 0.5, y1: y0, y2: G.H, "class": "vertical" }, grupo);
    });
    G.huecos = [c];

  }

  /* Nodos de 6 px en los cruces de un hilo horizontal con las verticales */
  function nodosHilo(hilo) {
    hilo.querySelectorAll(".nodo").forEach(function (n) { n.remove(); });
    var prev = hilo.style.transform;
    hilo.style.transform = "none";
    var r = hilo.getBoundingClientRect();
    hilo.style.transform = prev;
    if (!r.width) return;
    var izq = r.left;
    var nodos = [];
    G.xs.forEach(function (x) {
      if (x >= izq - 2 && x <= r.right + 2) {
        var n = document.createElement("span");
        n.className = "nodo";
        n.style.left = (x - izq + 0.5) + "px";
        hilo.appendChild(n);
        nodos.push(n);
      }
    });
    return nodos;
  }

  function nodosBarra() {
    var cont = document.querySelector(".lecturas__nodos");
    cont.innerHTML = "";
    G.xs.forEach(function (x) {
      var n = document.createElement("span");
      n.className = "nodo";
      n.style.left = (x + 0.5) + "px";
      cont.appendChild(n);
    });
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
    document.querySelectorAll(".hilo").forEach(function (h) {
      nodosHilo(h);
    });
    nodosBarra();
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
