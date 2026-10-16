/* Dial de combinación (caja fuerte) alrededor del símbolo HR.
   N números = semanas.length. La ranura es el hueco del anillo (20°–65°, centro 42,5°):
   la semana que se lee es la que cae en la ranura. La pupila es la cerradura.
   R(k) = 42,5° + (k − 1)·360/N ; R(0) = 42,5° − 360/N.
   El fragmento flota lejos y avanza una distancia fija por semana hasta encajar. */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var C = 280;                         // centro del bisel (viewBox 560)
  var HUECO = 42.5;                    // ranura, horario desde las 12
  var D0 = 220;                        // recorrido total del fragmento (unidades del viewBox)
  var DIAG = Math.SQRT1_2;

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
    return "M " + f2(p0[0]) + " " + f2(p0[1]) + " A " + r + " " + r + " 0 " + ((a1 - a0) > 180 ? 1 : 0) + " 1 " + f2(p1[0]) + " " + f2(p1[1]);
  }
  function sector(r0, r1, a0, a1) {
    var p0 = polar(r1, a0), p1 = polar(r1, a1), p2 = polar(r0, a1), p3 = polar(r0, a0);
    return "M " + f2(p0[0]) + " " + f2(p0[1]) + " A " + r1 + " " + r1 + " 0 0 1 " + f2(p1[0]) + " " + f2(p1[1]) +
      " L " + f2(p2[0]) + " " + f2(p2[1]) + " A " + r0 + " " + r0 + " 0 0 0 " + f2(p3[0]) + " " + f2(p3[1]) + " Z";
  }
  function linea(r0, r1, a, cls, parent) {
    var p0 = polar(r0, a), p1 = polar(r1, a);
    return el("line", { x1: f2(p0[0]), y1: f2(p0[1]), x2: f2(p1[0]), y2: f2(p1[1]), "class": cls }, parent);
  }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  var uid = 0;

  /* Construye el dial dentro de un <svg class="bisel">.
     Capas (de atrás hacia adelante): fondo que gira (banda torneada y estrías) ·
     luz rasante fija (copia de la banda y las estrías recortada a un sector) ·
     frente que gira (marcas, números) · ventana e índice fijos. */
  function construirBisel(svg, N, rotular, escala) {
    var reten = svg.querySelector(".bisel__reten");
    var fijo = svg.querySelector(".bisel__fijo");
    reten.innerHTML = '<g class="bisel__giro"></g>';
    fijo.innerHTML = "";
    var fondo = reten.querySelector(".bisel__giro");
    var s = 360 / N;
    var id = "luz-" + (++uid);
    var partes = { giros: [], segs: [], etqs: [], s: s, sectores: [] };

    // fondo: la perilla de metal mate, torneada, con estrías en el canto
    el("circle", { cx: C, cy: C, r: 229, "class": "bisel__banda" }, fondo);
    for (var r = 201; r < 260; r += 3.5) el("circle", { cx: C, cy: C, r: r, "class": "bisel__torno" }, fondo);
    var gEst = el("g", { "class": "bisel__estrias" }, fondo);
    for (var a = 0; a < 360; a += 2.5) linea(264, 273, a, "bisel__estria", gEst);
    partes.giros.push(fondo);

    // luz rasante: dos escalones de tono, fijos respecto a la pantalla
    var defs = el("defs", {}, reten);
    var zonas = [["exterior", -112, 2], ["interior", -82, -28]];
    zonas.forEach(function (z) {
      var cp = el("clipPath", { id: id + "-" + z[0] }, defs);
      partes.sectores.push(el("path", { d: sector(150, 300, z[1], z[2]) }, cp));
      var g = el("g", { "clip-path": "url(#" + id + "-" + z[0] + ")", "class": "bisel__brillo bisel__brillo--" + z[0] }, reten);
      var gi = el("g", {}, g);
      el("circle", { cx: C, cy: C, r: 229, "class": "bisel__banda-luz" }, gi);
      for (var a2 = 0; a2 < 360; a2 += 2.5) linea(264, 273, a2, "bisel__estria-luz", gi);
      partes.giros.push(gi);
    });

    // frente: cantos, marcas, segmentos y números (giran con la perilla)
    var frente = el("g", { "class": "bisel__frente" }, reten);
    partes.giros.push(frente);
    el("circle", { cx: C, cy: C, r: 196, "class": "bisel__canto" }, frente);
    el("circle", { cx: C, cy: C, r: 262, "class": "bisel__canto bisel__canto--ext" }, frente);
    var gT = el("g", { "class": "bisel__ticks" }, frente);
    var gE = el("g", { "class": "bisel__etqs" }, frente);
    partes.gTicks = gT; partes.gEtqs = gE; partes.gEstrias = gEst;
    partes.brillos = Array.prototype.slice.call(reten.querySelectorAll(".bisel__brillo"));
    var tam = f2(Math.max(22, 13 / (escala || 1)));

    for (var i = 1; i <= N; i++) {
      var c = -(i - 1) * s;
      linea(198, 214, c, "bisel__mayor", gT);
      for (var j = 1; j < 5; j++) linea(198, 205, c + j * s / 5, "bisel__tick", gT);
      partes.segs.push(el("path", { d: arco(190, c - s / 2 + 1.5, c + s / 2 - 1.5), "class": "bisel__seg", "data-k": i }, frente));
      var pe = polar(238, c);
      var t = el("text", {
        x: f2(pe[0]), y: f2(pe[1]), "class": "bisel__etq", "data-k": i, "font-size": tam,
        transform: "rotate(" + f2(c) + " " + f2(pe[0]) + " " + f2(pe[1]) + ")"
      }, gE);
      t.textContent = pad2(i);
      if (rotular && !rotular(i)) t.setAttribute("visibility", "hidden");
      partes.etqs.push(t);
    }

    // la ventana fija de la ranura (no gira) y el índice
    partes.ventanaLuz = el("path", { d: sector(196, 262, HUECO - s / 2, HUECO + s / 2), "class": "bisel__ventana-luz" }, fijo);
    linea(192, 268, HUECO - s / 2, "bisel__ventana", fijo);
    linea(192, 268, HUECO + s / 2, "bisel__ventana", fijo);
    var tip = polar(276, HUECO);
    var b1 = polar(292, HUECO - 7 / 292 * 180 / Math.PI);
    var b2 = polar(292, HUECO + 7 / 292 * 180 / Math.PI);
    partes.indice = el("polygon", {
      points: [tip, b1, b2].map(function (p) { return f2(p[0]) + "," + f2(p[1]); }).join(" "),
      "class": "bisel__indice"
    }, fijo);
    return partes;
  }

  function R(k, N) { return HUECO + (k - 1) * 360 / N; }

  function aplicarGiro(partes, rot) {
    var t = "rotate(" + rot.toFixed(3) + " " + C + " " + C + ")";
    for (var i = 0; i < partes.giros.length; i++) partes.giros[i].setAttribute("transform", t);
  }

  function aplicarFragmento(frag, avance) {
    var d = D0 * (1 - avance) * DIAG;
    frag.setAttribute("transform", "translate(" + d.toFixed(2) + "," + (-d).toFixed(2) + ")");
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
    // capa de luz que recorre el anillo en el encaje (no altera el símbolo)
    if (!D.luzAnillo) {
      D.luzAnillo = D.anillo.cloneNode(false);
      D.luzAnillo.removeAttribute("id");
      D.luzAnillo.setAttribute("class", "anillo-luz");
      D.luzAnillo.setAttribute("stroke", "var(--luz)");
      D.anillo.parentNode.insertBefore(D.luzAnillo, D.anillo.nextSibling);
      var L = D.anillo.getTotalLength();
      D.luzAnillo.style.strokeDasharray = L + " " + L;
      D.luzAnillo.style.strokeDashoffset = L;
      D.largoAnillo = L;
    }
    fijarGiro(R(0, N));
    fijarAvance(0);
    return D;
  }

  function fijarGiro(rot) { D.rot = rot; aplicarGiro(D.partes, rot); }
  function fijarAvance(a) { D.avance = a; aplicarFragmento(D.frag, a); }

  /* Copia estática (reduced-motion: la semana k con su propio dial) */
  function copiaEstatica(contenedor, k, rotular) {
    contenedor.innerHTML = "";
    var b = D.svg.cloneNode(false);
    b.innerHTML = '<g class="bisel__reten"></g><g class="bisel__fijo"></g>';
    contenedor.appendChild(b);
    var p = construirBisel(b, D.N, rotular, Reticula.G.S / 560);
    aplicarGiro(p, R(k, D.N));
    marcarActiva(p, k);
    var sim = document.querySelector(".dial .simbolo").cloneNode(true);
    var luz = sim.querySelector(".anillo-luz");
    if (luz) luz.remove();
    var frag = sim.querySelector("#fragmento");
    var pup = sim.querySelector("#pupila");
    sim.querySelectorAll("[id]").forEach(function (n) { n.removeAttribute("id"); });
    sim.querySelectorAll("circle, g").forEach(function (n) { n.removeAttribute("style"); n.removeAttribute("data-svg-origin"); });
    aplicarFragmento(frag, k / D.N);
    pup.setAttribute("transform", "rotate(" + (90 * k / D.N) + " 200 200)");
    contenedor.appendChild(sim);
  }

  /* ¿Qué parte del dial hay bajo un punto? (coordenadas del viewBox respecto al centro) */
  function parteEn(u, v) {
    var r = Math.sqrt(u * u + v * v);
    var ang = (Math.atan2(u, -v) * 180 / Math.PI + 360) % 360;
    var dF = D0 * (1 - D.avance) * DIAG;
    var fu = u - dF, fv = v + dF;
    var fr = Math.sqrt(fu * fu + fv * fv);
    var fa = (Math.atan2(fu, -fv) * 180 / Math.PI + 360) % 360;
    if (Math.abs(fr - 140) < 22 && fa > 15 && fa < 70) return { tipo: "fragmento" };
    if (Math.sqrt(u * u + (v + 4) * (v + 4)) < 34) return { tipo: "cerradura" };
    if (r >= 186 && r <= 280) {
      var s = 360 / D.N;
      var local = ((ang - D.rot) % 360 + 360) % 360;      // ángulo en el bisel sin girar
      var k = ((Math.round(-local / s) % D.N) + D.N) % D.N + 1;
      return { tipo: "numero", k: k };
    }
    return null;
  }

  window.Dial = {
    C: C,
    HUECO: HUECO,
    D0: D0,
    R: function (k) { return R(k, D.N); },
    get estado() { return D; },
    iniciar: iniciar,
    fijarGiro: fijarGiro,
    fijarAvance: fijarAvance,
    marcarActiva: function (k) { marcarActiva(D.partes, k); },
    copiaEstatica: copiaEstatica,
    parteEn: parteEn
  };
})();
