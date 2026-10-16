/* Dial: bisel graduado alrededor del símbolo HR.
   N segmentos = semanas.length. El hueco del anillo va de 20° a 65° (centro 42,5°):
   ahí está el índice, y la semana que se lee es la que llena el hueco.
   R(k) = 42,5° + (k − 1)·360/N ; R(0) = 42,5° − 360/N. */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var C = 280;                         // centro del bisel (viewBox 560)
  var HUECO = 42.5;                    // centro del hueco, horario desde las 12
  var DIST0 = Math.sqrt(30 * 30 + 30 * 30); // 42,43 unidades del viewBox

  function polar(r, a) {
    var t = a * Math.PI / 180;
    return [C + r * Math.sin(t), C - r * Math.cos(t)];
  }
  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function f2(n) { return Math.round(n * 100) / 100; }
  function arco(r, a0, a1) {
    var p0 = polar(r, a0), p1 = polar(r, a1);
    var grande = (a1 - a0) > 180 ? 1 : 0;
    return "M " + f2(p0[0]) + " " + f2(p0[1]) + " A " + r + " " + r + " 0 " + grande + " 1 " + f2(p1[0]) + " " + f2(p1[1]);
  }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  /* Construye el bisel dentro de un <svg class="bisel"> */
  function construirBisel(svg, N, rotular, escala) {
    var giro = svg.querySelector(".bisel__giro");
    var fijo = svg.querySelector(".bisel__fijo");
    giro.innerHTML = ""; fijo.innerHTML = "";
    var s = 360 / N;
    var partes = { giro: giro, ticks: [], segs: [], etqs: [], limites: [] };

    el("circle", { cx: C, cy: C, r: 196, "class": "bisel__base" }, giro);
    var gT = el("g", { "class": "bisel__ticks" }, giro);
    var gE = el("g", { "class": "bisel__etqs" }, giro);
    partes.gTicks = gT; partes.gEtqs = gE;

    var limites = [];
    for (var k = 0; k < N; k++) limites.push(((-(k) * s - s / 2) % 360 + 360) % 360);
    for (var a = 0; a < 360; a += 3) {
      var cerca = limites.some(function (b) { return Math.abs(b - a) < 0.75 || Math.abs(b - a) > 359.25; });
      if (cerca) continue;
      var p0 = polar(200, a), p1 = polar(206, a);
      partes.ticks.push(el("line", { x1: f2(p0[0]), y1: f2(p0[1]), x2: f2(p1[0]), y2: f2(p1[1]), "class": "bisel__tick" }, gT));
    }
    limites.forEach(function (b) {
      var p0 = polar(200, b), p1 = polar(214, b);
      partes.limites.push(el("line", { x1: f2(p0[0]), y1: f2(p0[1]), x2: f2(p1[0]), y2: f2(p1[1]), "class": "bisel__limite" }, giro));
    });

    for (var i = 1; i <= N; i++) {
      var centro = -(i - 1) * s;
      var seg = el("path", { d: arco(190, centro - s / 2 + 1, centro + s / 2 - 1), "class": "bisel__seg", "data-k": i }, giro);
      partes.segs.push(seg);
      var rotulada = rotular ? rotular(i) : true;
      var pe = polar(250, centro);
      var t = el("text", { x: f2(pe[0]), y: f2(pe[1]), "class": "bisel__etq", "data-k": i, "font-size": f2(Math.max(13, 12 / (escala || 1))) }, gE);
      t.textContent = pad2(i);
      if (!rotulada) t.setAttribute("visibility", "hidden");
      t._x = f2(pe[0]); t._y = f2(pe[1]);
      partes.etqs.push(t);
    }

    // Índice fijo (no gira): punta en r 220, base en r 232, a 42,5°
    var tip = polar(220, HUECO);
    var b1 = polar(232, HUECO - 5 / 232 * 180 / Math.PI);
    var b2 = polar(232, HUECO + 5 / 232 * 180 / Math.PI);
    partes.indice = el("polygon", {
      points: [tip, b1, b2].map(function (p) { return f2(p[0]) + "," + f2(p[1]); }).join(" "),
      "class": "bisel__indice"
    }, fijo);
    return partes;
  }

  function R(k, N) { return HUECO + (k - 1) * 360 / N; }

  function aplicarGiro(partes, rot) {
    partes.giro.setAttribute("transform", "rotate(" + rot.toFixed(3) + " " + C + " " + C + ")");
    var inv = (-rot).toFixed(3);
    for (var i = 0; i < partes.etqs.length; i++) {
      var t = partes.etqs[i];
      t.setAttribute("transform", "rotate(" + inv + " " + t._x + " " + t._y + ")");
    }
  }

  function aplicarFragmento(frag, avance) {
    var d = 30 * (1 - avance);
    frag.setAttribute("transform", "translate(" + d.toFixed(3) + "," + (-d).toFixed(3) + ")");
  }

  function marcarActiva(partes, k) {
    partes.segs.forEach(function (s, i) { s.classList.toggle("activo", i + 1 === k); });
    partes.etqs.forEach(function (t, i) {
      var on = i + 1 === k;
      t.classList.toggle("activo", on);
      if (on) t.removeAttribute("visibility");
    });
  }

  /* ---------- Dial principal ---------- */
  var D = { N: 1, rot: 0, avance: 0 };

  function iniciar(N, rotular) {
    D.N = N;
    D.fig = document.querySelector(".dial");
    D.svg = D.fig.querySelector(".bisel");
    D.reten = D.svg.querySelector(".bisel__reten");
    D.partes = construirBisel(D.svg, N, rotular, Reticula.G.S / 560);
    D.frag = document.getElementById("fragmento");
    D.anillo = document.getElementById("anillo");
    D.iris = document.getElementById("iris");
    D.pupila = document.getElementById("pupila");
    fijarGiro(R(0, N));
    fijarAvance(0);
    return D;
  }

  function fijarGiro(rot) { D.rot = rot; aplicarGiro(D.partes, rot); }
  function fijarAvance(a) { D.avance = a; aplicarFragmento(D.frag, a); }

  /* Copia estática (para reduced-motion: la semana k con su dial propio) */
  function copiaEstatica(contenedor, k, rotular) {
    contenedor.innerHTML = "";
    var b = D.svg.cloneNode(false);
    b.innerHTML = '<g class="bisel__reten"><g class="bisel__giro"></g></g><g class="bisel__fijo"></g>';
    contenedor.appendChild(b);
    var p = construirBisel(b, D.N, rotular, Reticula.G.S / 560);
    aplicarGiro(p, R(k, D.N));
    marcarActiva(p, k);
    var sim = document.querySelector(".dial .simbolo").cloneNode(true);
    sim.querySelectorAll("[id]").forEach(function (n) { n.removeAttribute("id"); });
    var frag = sim.querySelector("g[transform]");
    aplicarFragmento(frag, k / D.N);
    contenedor.appendChild(sim);
  }

  window.Dial = {
    C: C,
    HUECO: HUECO,
    DIST0: DIST0,
    R: function (k) { return R(k, D.N); },
    get estado() { return D; },
    iniciar: iniciar,
    fijarGiro: fijarGiro,
    fijarAvance: fijarAvance,
    marcarActiva: function (k) { marcarActiva(D.partes, k); },
    copiaEstatica: copiaEstatica,
    distancia: function (avance) { return DIST0 * (1 - avance); }
  };
})();
