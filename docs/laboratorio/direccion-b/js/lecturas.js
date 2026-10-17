/* Lecturas: la combinación marcada hasta ahora (una semana = un número)
   e inspección del dial (solo sobre el símbolo: qué semana hay bajo el puntero,
   cuánto le falta al fragmento, cuántos números lleva la cerradura). */
(function () {
  "use strict";

  function pad(n, w) { n = String(n); while (n.length < w) n = "0" + n; return n; }
  function todos(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  var ESTADOS = { "pendiente": "pendiente", "en-curso": "en curso", "completada": "completada" };

  var B = window.BITACORA;
  var N = B.semanas.length;
  var nActual = -1;

  /* ---------- Combinación ---------- */
  function construirComb() {
    todos("[data-comb]").forEach(function (c) {
      c.innerHTML = "";
      for (var i = 1; i <= N; i++) {
        var s = document.createElement("span");
        s.className = "comb__n";
        s.textContent = pad(i, 2);
        c.appendChild(s);
      }
    });
    todos('[data-lectura="total"]').forEach(function (e) { e.textContent = pad(N, 2); });
  }

  function fijarN(n, animado) {
    if (n === nActual) return;
    nActual = n;
    todos("[data-comb]").forEach(function (c) {
      Array.prototype.forEach.call(c.children, function (s, i) {
        var on = i < n;
        s.classList.toggle("marcado", on);
        if (animado && on && i === n - 1 && window.ScrambleTextPlugin) {
          gsap.fromTo(s, { scrambleText: { text: "--", chars: "0123456789" } }, { duration: Reticula.PASO * 2, scrambleText: { text: pad(i + 1, 2), chars: "0123456789", speed: 1 } });
        }
      });
    });
    todos('[data-lectura="n"]').forEach(function (e) { e.textContent = pad(n, 2); });
    todos(".comb").forEach(function (c) {
      c.setAttribute("aria-label", "Combinación: " + n + " de " + N + " semanas marcadas");
    });
  }

  /* ---------- Texto de inspección ---------- */
  function textoParte(p) {
    if (!p) return null;
    if (p.tipo === "numero") {
      var s = B.semanas[p.k - 1];
      return '<b>SEMANA_' + pad(p.k, 2) + '</b><span class="insp__t">' + s.titulo + '</span><i>' + (ESTADOS[s.estado] || s.estado) + '</i>';
    }
    var faltan = N - Math.max(0, nActual);
    if (p.tipo === "fragmento") {
      return '<b>Fragmento</b><span class="insp__t">' + (faltan === 0 ? "Encajado" : "Faltan " + faltan + (faltan === 1 ? " semana" : " semanas") + " para encajar") + '</span>';
    }
    if (p.tipo === "cerradura") {
      return '<b>Cerradura</b><span class="insp__t">' + Math.max(0, nActual) + " de " + N + " números marcados</span>";
    }
    return null;
  }

  function lecturaEn(x, y) {
    var D = Dial.estado;
    var r = D.fig.getBoundingClientRect();
    if (r.width < 120) return null;                 // acoplado en la barra
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var u = (x - cx) * 560 / r.width, v = (y - cy) * 560 / r.width;
    return { parte: Dial.parteEn(u, v), cx: cx, cy: cy, rad: r.width / 2, dx: x - cx, dy: y - cy, u: u, v: v };
  }

  /* La etiqueta va siempre por fuera del dial, en la dirección del puntero */
  function colocar(el, L) {
    var d = Math.sqrt(L.dx * L.dx + L.dy * L.dy) || 1;
    var ux = L.dx / d, uy = L.dy / d;
    var px = L.cx + ux * (L.rad * 1.02 + 14), py = L.cy + uy * (L.rad * 1.02 + 14);
    var w = el.offsetWidth, h = el.offsetHeight;
    var x = ux >= 0 ? px : px - w;
    // en escritorio la etiqueta no sale de las columnas del dial (no pisa el nombre)
    if (!Reticula.G.movil) x = Math.max(Reticula.G.xs[2] + 10, x);
    var y = py - h / 2;
    x = Math.min(Math.max(12, x), window.innerWidth - w - 12);
    y = Math.min(Math.max(64, y), window.innerHeight - h - 12);
    el.style.transform = "translate(" + Math.round(x) + "px," + Math.round(y) + "px)";
  }

  var M = {};
  function prepararInspeccion() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var dial = document.querySelector(".dial");
    M.el = document.querySelector(".inspeccion");
    document.documentElement.classList.add("con-inspeccion");
    M.ix = gsap.quickTo("#iris", "x", { duration: 0.3, ease: "power3" });
    M.iy = gsap.quickTo("#iris", "y", { duration: 0.3, ease: "power3" });
    var pendiente = false, ev = null;
    dial.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      ev = e;
      if (!pendiente) { pendiente = true; requestAnimationFrame(pintar); }
    });
    dial.addEventListener("pointerleave", function () {
      M.el.classList.remove("visible");
      M.ix(0); M.iy(0);
    });
    function pintar() {
      pendiente = false;
      var L = lecturaEn(ev.clientX, ev.clientY);
      var txt = L && textoParte(L.parte);
      if (!txt) { M.el.classList.remove("visible"); M.ix(0); M.iy(0); return; }
      if (txt !== M.ultimo) { M.el.innerHTML = txt; M.ultimo = txt; }
      M.el.classList.add("visible");
      colocar(M.el, L);
      // el iris, lente del mecanismo, mira hacia donde se inspecciona (máx. 7 unidades)
      var d = Math.sqrt(L.u * L.u + L.v * L.v) || 1;
      var k = Math.min(7, d * 0.05) / d;
      M.ix(L.u * k); M.iy(L.v * k);
    }
  }

  /* Táctil: un toque sobre el dial deja la lectura 2 s */
  function prepararToque() {
    var dial = document.querySelector(".dial");
    var el = document.querySelector(".inspeccion");
    var timer = null;
    dial.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse") return;
      var L = lecturaEn(e.clientX, e.clientY);
      var txt = L && textoParte(L.parte);
      if (!txt) return;
      el.innerHTML = txt;
      el.classList.add("visible");
      colocar(el, L);
      clearTimeout(timer);
      timer = setTimeout(function () { el.classList.remove("visible"); }, 2000);
    });
  }

  window.Lecturas = {
    pad: pad,
    construirComb: construirComb,
    fijarN: fijarN,
    get n() { return nActual; },
    prepararInspeccion: prepararInspeccion,
    prepararToque: prepararToque
  };
})();
