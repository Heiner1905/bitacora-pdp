/* Lecturas verdaderas: reloj de Bogotá, distancia del fragmento, lectura N/total
   y la mira de inspección (coordenadas en la lámina, polares sobre el dial). */
(function () {
  "use strict";

  function pad(n, w) { n = String(n); while (n.length < w) n = "0" + n; return n; }
  function coma(v, dec) { return v.toFixed(dec).replace(".", ","); }
  function fmtDist(v) { return pad(coma(Math.max(0, v), 1), 5); }   // 042,4 · 000,0

  function todos(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  /* ---------- Reloj (America/Bogota, 24 h) ---------- */
  var fmtHora;
  try {
    fmtHora = new Intl.DateTimeFormat("es-CO", {
      timeZone: "America/Bogota", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
    });
  } catch (e) { fmtHora = null; }

  function horaBogota() {
    var d = new Date();
    if (!fmtHora) return pad(d.getHours(), 2) + ":" + pad(d.getMinutes(), 2) + ":" + pad(d.getSeconds(), 2);
    var p = {};
    fmtHora.formatToParts(d).forEach(function (x) { p[x.type] = x.value; });
    return pad(p.hour, 2) + ":" + pad(p.minute, 2) + ":" + pad(p.second, 2);
  }
  var relojes = [];
  function tickReloj() {
    var h = horaBogota();
    relojes.forEach(function (r) { r.textContent = h; r.setAttribute("datetime", h); });
    setTimeout(tickReloj, 1000 - (Date.now() % 1000) + 5);
  }

  /* ---------- Distancia y lectura ---------- */
  var ultimaDist = "";
  function fijarDistancia(v) {
    var t = fmtDist(v);
    if (t === ultimaDist) return;
    ultimaDist = t;
    todos('[data-lectura="dist"]').forEach(function (e) { e.textContent = t; });
  }
  var nActual = -1;
  function fijarN(n, animado) {
    if (n === nActual) return;
    nActual = n;
    var t = pad(n, 2);
    todos('[data-lectura="n"]').forEach(function (e) {
      if (animado && window.gsap && window.ScrambleTextPlugin) {
        gsap.to(e, { duration: Reticula.PASO, scrambleText: { text: t, chars: "0123456789", speed: 1 }, overwrite: true });
      } else {
        e.textContent = t;
      }
    });
  }

  /* ---------- Mira de inspección ---------- */
  var M = { activa: false };

  function prepararMira(reducido) {
    var fino = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fino.matches) return;
    M.activa = true;
    document.documentElement.classList.add("con-mira");
    M.raiz = document.querySelector(".mira");
    M.h = M.raiz.querySelector(".mira__h");
    M.v = M.raiz.querySelector(".mira__v");
    M.p = M.raiz.querySelector(".mira__punto");
    M.l = M.raiz.querySelector(".mira__lectura");
    var dur = reducido ? 0.001 : 0.15;
    M.xh = gsap.quickTo(M.v, "x", { duration: dur, ease: "power3" });
    M.yh = gsap.quickTo(M.h, "y", { duration: dur, ease: "power3" });
    M.px = gsap.quickTo(M.p, "x", { duration: dur, ease: "power3" });
    M.py = gsap.quickTo(M.p, "y", { duration: dur, ease: "power3" });
    M.lx = gsap.quickTo(M.l, "x", { duration: dur, ease: "power3" });
    M.ly = gsap.quickTo(M.l, "y", { duration: dur, ease: "power3" });
    M.ix = gsap.quickTo("#iris, #pupila", "x", { duration: reducido ? 0.001 : 0.3, ease: "power3" });
    M.iy = gsap.quickTo("#iris, #pupila", "y", { duration: reducido ? 0.001 : 0.3, ease: "power3" });
    M.pendiente = false;

    window.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      M.mx = e.clientX; M.my = e.clientY; M.objetivo = e.target;
      if (!M.pendiente) { M.pendiente = true; requestAnimationFrame(pintarMira); }
    }, { passive: true });
    document.addEventListener("pointerleave", function () { gsap.to(M.raiz, { opacity: 0, duration: Reticula.PASO }); M.dentro = false; });
    document.documentElement.addEventListener("mouseleave", function () { gsap.to(M.raiz, { opacity: 0, duration: Reticula.PASO }); M.dentro = false; });
  }

  function lecturaDial(x, y) {
    var D = window.Dial && Dial.estado;
    if (!D || !D.fig) return null;
    var avance = D.avance;
    var r = D.fig.getBoundingClientRect();
    var est = document.querySelector(".sin-movimiento .dial-estatico");
    if (est) {                                    // copia estática de la semana 01
      var re = est.getBoundingClientRect();
      var cxe = re.left + re.width / 2, cye = re.top + re.height / 2;
      if (Math.hypot(x - cxe, y - cye) < re.width * 0.47) { r = re; avance = 1 / window.BITACORA.semanas.length; }
    }
    if (r.width < 120) return null;              // acoplado: no se inspecciona
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var dx = x - cx, dy = y - cy;
    var u = 560 / r.width;                        // unidades del viewBox por px
    var dist = Math.sqrt(dx * dx + dy * dy) * u;
    if (dist > 262) return null;
    var ang = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
    // ¿sobre el fragmento? (se descuenta su traslado actual)
    var t = 30 * (1 - avance);
    var fx = dx * u - t, fy = dy * u + t;
    var fr = Math.sqrt(fx * fx + fy * fy);
    var fa = (Math.atan2(fx, -fy) * 180 / Math.PI + 360) % 360;
    var sobreFrag = Math.abs(fr - 140) < 20 && fa > 17 && fa < 68;
    return { dx: dx * u, dy: dy * u, dist: dist, ang: ang, radio: dist / 140, sobreFrag: sobreFrag, u: u, avance: avance };
  }

  function pintarMira() {
    M.pendiente = false;
    var x = M.mx, y = M.my;
    if (!M.dentro) { M.dentro = true; gsap.to(M.raiz, { opacity: 1, duration: Reticula.PASO }); }

    // ¿sobre un control? la mira se reduce a un punto y vuelve el cursor nativo
    var ctrl = M.objetivo && M.objetivo.closest && M.objetivo.closest("a, button, [role=button]");
    M.raiz.classList.toggle("sobre-control", !!ctrl);

    // imán: nodos visibles a menos de 12 px
    var sx = x, sy = y, mejor = 12;
    var nodos = document.querySelectorAll(".nodo:not(.nodo--menor)");
    for (var i = 0; i < nodos.length; i++) {
      var r = nodos[i].getBoundingClientRect();
      if (!r.width) continue;
      var nx = r.left + r.width / 2, ny = r.top + r.height / 2;
      var d = Math.abs(nx - x) + Math.abs(ny - y);
      if (d < mejor) { mejor = d; sx = nx; sy = ny; }
    }
    var iman = mejor < 12;

    M.xh(sx); M.yh(sy); M.px(sx); M.py(sy);

    var L = lecturaDial(x, y);
    var txt, frag = false;
    if (L && L.sobreFrag) {
      txt = "Fragmento <b>·</b> distancia " + fmtDist(Dial.distancia(L.avance)) + "&#8201;PX";
      frag = true;
    } else if (L) {
      txt = "Ángulo " + pad(coma(L.ang, 1), 5) + "° <b>·</b> radio " + coma(L.radio, 2);
    } else {
      txt = "X " + pad(Math.round(sx), 4) + " <b>·</b> Y " + pad(Math.round(sy), 4) + (iman ? " <b>·</b> nodo" : "");
    }
    if (txt !== M.ultimo) { M.l.innerHTML = txt; M.ultimo = txt; }
    M.l.classList.toggle("es-fragmento", frag);

    // el ojo del símbolo se orienta hacia la mira (máx. 8 unidades)
    if (L && !frag) {
      var k = Math.min(8, L.dist * 0.06) / (L.dist || 1);
      M.ix(L.dx * k); M.iy(L.dy * k);
    } else {
      M.ix(0); M.iy(0);
    }

    var lw = M.l.offsetWidth, lh = M.l.offsetHeight;
    var ox = sx + 14, oy = sy + 14;
    if (ox + lw > window.innerWidth - 8) ox = sx - 14 - lw;
    if (oy + lh > window.innerHeight - 8) oy = sy - 14 - lh;
    M.lx(ox); M.ly(oy);
  }

  /* ---------- Táctil: un toque sobre el dial deja la lectura polar 2 s ---------- */
  function prepararToque() {
    var dial = document.querySelector(".dial");
    var caja = null, timer = null;
    dial.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse") return;
      var L = lecturaDial(e.clientX, e.clientY);
      if (!L) return;
      if (!caja) {
        caja = document.createElement("div");
        caja.className = "toque";
        caja.setAttribute("aria-hidden", "true");
        document.body.appendChild(caja);
      }
      caja.textContent = L.sobreFrag
        ? "Fragmento · distancia " + fmtDist(Dial.distancia(Dial.estado.avance)) + " PX"
        : "Ángulo " + pad(coma(L.ang, 1), 5) + "° · radio " + coma(L.radio, 2);
      caja.style.display = "block";
      var w = caja.offsetWidth;
      var x = Math.min(Math.max(12, e.clientX + 12), window.innerWidth - w - 12);
      caja.style.transform = "translate(" + x + "px," + (e.clientY + 14) + "px)";
      clearTimeout(timer);
      timer = setTimeout(function () { caja.style.display = "none"; }, 2000);
    });
  }

  window.Lecturas = {
    pad: pad,
    fmtDist: fmtDist,
    iniciarReloj: function () { relojes = todos('[data-lectura="reloj"]'); tickReloj(); },
    fijarDistancia: fijarDistancia,
    fijarN: fijarN,
    fijarTotal: function (N) { todos('[data-lectura="total"]').forEach(function (e) { e.textContent = pad(N, 2); }); },
    prepararMira: prepararMira,
    prepararToque: prepararToque
  };
})();
