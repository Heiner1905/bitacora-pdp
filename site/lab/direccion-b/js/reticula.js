/* Retícula: geometría de la lámina, hairlines fijas, nodos y secuenciador.
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
          S: S, cx: cx, cy: cy, cabezal: cabezal, hueco: S * 214 / 560 };

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
    var y0 = G.movil ? G.cabezal : G.barra;
    G.verticales = G.xs.map(function (x) {
      return el("line", { x1: x + 0.5, x2: x + 0.5, y1: y0, y2: G.H, "class": "vertical" }, grupo);
    });
    G.huecos = [c];

    // Cabezal móvil: sus propias hairlines (el fondo opaco tapa las de abajo)
    var cab = document.querySelector(".cabezal__lineas");
    cab.innerHTML = "";
    if (G.movil) {
      cab.setAttribute("viewBox", "0 0 " + G.W + " " + G.cabezal);
      var d2 = el("defs", {}, cab);
      var m2 = el("mask", { id: "hueco-cabezal", maskUnits: "userSpaceOnUse", x: 0, y: 0, width: G.W, height: G.cabezal }, d2);
      el("rect", { x: 0, y: 0, width: G.W, height: G.cabezal, fill: "#fff" }, m2);
      var c2 = el("circle", { cx: G.cx, cy: G.cy, r: G.hueco, fill: "#000" }, m2);
      var g2 = el("g", { mask: "url(#hueco-cabezal)" }, cab);
      G.xs.forEach(function (x) {
        el("line", { x1: x + 0.5, x2: x + 0.5, y1: G.barra, y2: G.cabezal, "class": "vertical" }, g2);
      });
      G.huecos.push(c2);
    }
  }

  /* Nodos de 6 px en los cruces de un hilo horizontal con las verticales */
  function nodosHilo(hilo, conPasos) {
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
    if (conPasos) {
      // marcas menores del secuenciador (3 por tramo de columna mayor)
      for (var i = 0; i < G.xs.length - 1; i++) {
        for (var j = 1; j < 4; j++) {
          var x = G.xs[i] + (G.xs[i + 1] - G.xs[i]) * j / 4;
          var n2 = document.createElement("span");
          n2.className = "nodo nodo--menor";
          n2.style.left = (x - izq + 0.5) + "px";
          hilo.appendChild(n2);
        }
      }
    }
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
      if (f.hasAttribute("data-secuencia")) {
        var s = document.createElement("span");
        s.className = "secuenciador";
        h.appendChild(s);
      }
      f.insertBefore(h, f.firstChild);
    });
  }

  function dibujarHilos() {
    hilosMovil();
    document.querySelectorAll(".hilo").forEach(function (h) {
      var pasos = !!h.querySelector(".secuenciador");
      nodosHilo(h, pasos);
    });
    nodosBarra();
  }

  /* ---------- Secuenciador: una luz que avanza una corchea por paso ---------- */
  var Sec = { paso: 0, timer: null, activo: false, visible: true, hilo: null, luz: null, nodo0: null, pasos: 16 };

  function prepararSecuenciador() {
    var luces = Array.prototype.slice.call(document.querySelectorAll(".secuenciador"));
    Sec.luz = null;
    luces.forEach(function (l) {
      if (l.offsetParent !== null && !Sec.luz) Sec.luz = l;
    });
    if (!Sec.luz) return;
    Sec.hilo = Sec.luz.parentNode;
    Sec.nodo0 = Sec.hilo.querySelector(".nodo:not(.nodo--menor)");
    Sec.pasos = (G.xs.length - 1) * 4;  // 16 en escritorio, 8 en móvil
    var izq = Sec.hilo.getBoundingClientRect().left;
    Sec.pos = [];
    for (var i = 0; i < Sec.pasos; i++) {
      var t = Math.floor(i / 4), f = (i % 4) / 4;
      Sec.pos.push(G.xs[t] + (G.xs[t + 1] - G.xs[t]) * f - izq + 0.5);
    }
    if (Sec.io) Sec.io.disconnect();
    if ("IntersectionObserver" in window) {
      Sec.io = new IntersectionObserver(function (e) {
        Sec.visible = e[0].isIntersecting;
        actualizarTimer();
      });
      Sec.io.observe(Sec.hilo);
    }
  }

  function tic() {
    if (!Sec.luz) return;
    var i = Sec.paso % Sec.pasos;
    Sec.luz.style.transform = "translate3d(" + Sec.pos[i] + "px,0,0)";
    if (Sec.nodo0) Sec.nodo0.classList.toggle("nodo--tiempo", i === 0);
    Sec.paso = i + 1;
  }

  function actualizarTimer() {
    var correr = Sec.activo && Sec.visible && !document.hidden;
    if (correr && !Sec.timer) {
      if (Sec.luz) Sec.luz.classList.add("activo");
      tic();
      Sec.timer = setInterval(tic, PASO * 1000);
    } else if (!correr && Sec.timer) {
      clearInterval(Sec.timer);
      Sec.timer = null;
    }
  }

  document.addEventListener("visibilitychange", actualizarTimer);

  window.Reticula = {
    PULSO: PULSO,
    PASO: PASO,
    get G() { return G; },
    medir: medir,
    dibujar: function () { dibujarFija(); dibujarHilos(); },
    dibujarHilos: dibujarHilos,
    secuenciador: {
      preparar: prepararSecuenciador,
      iniciar: function () { Sec.activo = true; actualizarTimer(); },
      detener: function () {
        Sec.activo = false; actualizarTimer();
        if (Sec.luz) Sec.luz.classList.remove("activo");
        if (Sec.nodo0) Sec.nodo0.classList.remove("nodo--tiempo");
      },
      // el encaje cae en el downbeat: el paso actual salta al 1
      resincronizar: function () {
        if (!Sec.timer) return;
        clearInterval(Sec.timer);
        Sec.paso = 0;
        tic();
        Sec.timer = setInterval(tic, PASO * 1000);
      }
    }
  };
})();
