/* Partículas-glifo que ensamblan el símbolo HR (canvas 2D, sin librerías).
   Receta: docs/referencias/investigacion-3-particulas.md.
   - Muestreo por parte (Path2D sobre un canvas fuera de pantalla, sin getImageData por frame).
   - En vuelo cada partícula es un glifo diminuto de un atlas pre-renderizado; al llegar, un punto.
   - Profundidad falsa: nacen en la pupila-cerradura (punto de fuga) y viajan hacia la cámara.
   - Después del ensamblaje el RAF se detiene; se reactiva con el cursor o con un toque.
   API: window.Particulas.crear({ svg, canvas, movil }) → controlador. */
(function () {
  "use strict";

  var COLORES = {
    marfil: "#ECE5D3",
    iris: "#4F8EF7",
    naranja: "#F28C38",
    verde: "#3DBE8B"
  };
  var ORDEN_COLOR = ["marfil", "iris", "naranja", "verde"];
  var GLIFOS = ["0", "1", "/", "<", ">", "#", "·", "hex", "cua", "tri"];
  var TOPE = 3000;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  /* Atlas: una fila por color, una columna por glifo; más un sprite difuso por color. */
  function crearAtlas(dpr) {
    var celda = Math.round(14 * dpr);
    var c = document.createElement("canvas");
    c.width = celda * (GLIFOS.length + 1);
    c.height = celda * ORDEN_COLOR.length;
    var g = c.getContext("2d");
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = "500 " + Math.round(11 * dpr) + "px 'Martian Mono', ui-monospace, monospace";
    ORDEN_COLOR.forEach(function (nombre, fila) {
      var col = COLORES[nombre];
      g.fillStyle = col;
      g.strokeStyle = col;
      g.lineWidth = 1.2 * dpr;
      GLIFOS.forEach(function (gl, i) {
        var cx = i * celda + celda / 2, cy = fila * celda + celda / 2, r = celda * 0.28;
        if (gl === "hex") {
          g.beginPath();
          for (var k = 0; k < 6; k++) {
            var a = Math.PI / 3 * k;
            g[k ? "lineTo" : "moveTo"](cx + Math.cos(a) * r, cy + Math.sin(a) * r);
          }
          g.closePath(); g.stroke();
        } else if (gl === "cua") {
          g.fillRect(cx - r * 0.7, cy - r * 0.7, r * 1.4, r * 1.4);
        } else if (gl === "tri") {
          g.beginPath(); g.moveTo(cx - r, cy - r * 0.6); g.lineTo(cx + r, cy - r * 0.2); g.lineTo(cx - r * 0.1, cy + r); g.closePath(); g.fill();
        } else {
          g.fillText(gl, cx, cy + dpr * 0.5);
        }
      });
      // sprite difuso (desenfoque falso para las partículas lejanas, sin filter: blur)
      var sx = GLIFOS.length * celda + celda / 2, sy = fila * celda + celda / 2;
      var grad = g.createRadialGradient(sx, sy, 0, sx, sy, celda / 2);
      grad.addColorStop(0, hexA(col, 0.55));
      grad.addColorStop(0.45, hexA(col, 0.18));
      grad.addColorStop(1, hexA(col, 0));
      g.fillStyle = grad;
      g.fillRect(sx - celda / 2, sy - celda / 2, celda, celda);
    });
    return { canvas: c, celda: celda };
  }
  function hexA(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
  }

  /* Dibuja una parte del símbolo en un contexto con el mismo sistema de coordenadas del viewBox. */
  function dibujarParte(g, el, svg) {
    var tag = el.tagName.toLowerCase();
    if (tag === "g") {
      var tr = el.getAttribute("transform");
      g.save();
      if (tr) {
        var m = /translate\(\s*([-\d.]+)[ ,]+([-\d.]+)\s*\)/.exec(tr);
        if (m) g.translate(+m[1], +m[2]);
      }
      if (el.getAttribute("fill")) g.fillStyle = "#000";
      for (var i = 0; i < el.children.length; i++) dibujarParte(g, el.children[i], svg);
      g.restore();
      return;
    }
    var sw = parseFloat(el.getAttribute("stroke-width") || "0");
    var conTrazo = el.getAttribute("stroke") && el.getAttribute("stroke") !== "none";
    var conRelleno = el.getAttribute("fill") !== "none" && (tag !== "path" || !conTrazo);
    var p = new Path2D();
    if (tag === "path") p = new Path2D(el.getAttribute("d"));
    else if (tag === "circle") p.arc(+el.getAttribute("cx"), +el.getAttribute("cy"), +el.getAttribute("r"), 0, Math.PI * 2);
    else if (tag === "rect") p.rect(+el.getAttribute("x"), +el.getAttribute("y"), +el.getAttribute("width"), +el.getAttribute("height"));
    else if (tag === "polygon") {
      var pts = el.getAttribute("points").trim().split(/[\s,]+/).map(Number);
      for (var j = 0; j < pts.length; j += 2) p[j ? "lineTo" : "moveTo"](pts[j], pts[j + 1]);
      p.closePath();
    } else if (tag === "text") {
      // posiciones reales de cada letra (respeta la fuente cargada y el letter-spacing)
      var fs = parseFloat(el.getAttribute("font-size"));
      var cs = getComputedStyle(el);
      g.font = (cs.fontWeight || "500") + " " + fs + "px " + cs.fontFamily;
      g.textAlign = "left"; g.textBaseline = "alphabetic";
      var txt = el.textContent;
      for (var k = 0; k < txt.length; k++) {
        var pos = el.getStartPositionOfChar(k);
        g.fillText(txt[k], pos.x, pos.y);
      }
      return;
    }
    if (conTrazo && sw) {
      g.lineWidth = sw;
      g.lineCap = el.getAttribute("stroke-linecap") || "butt";
      g.stroke(p);
    }
    if (conRelleno && tag !== "path") g.fill(p);
  }

  function colorDeParte(id, el) {
    if (id === "iris") return 1;
    if (id === "pupila" || id === "fragmento") return 2;
    if (id === "bits") {
      var c = (el.getAttribute("stroke") !== "none" && el.getAttribute("stroke")) || el.getAttribute("fill") || "";
      c = c.toUpperCase();
      if (c === "#3DBE8B") return 3;
      if (c === "#4F8EF7") return 1;
      return 2;
    }
    return 0;
  }

  /* Partes con papel propio: 0 resto, 1 mirada (iris+pupila), 2 fragmento (flota) */
  function grupoDeParte(id) {
    if (id === "iris" || id === "pupila") return 1;
    if (id === "fragmento" || id === "bits") return 2;
    return 0;
  }

  function crear(op) {
    var svg = op.svg, canvas = op.canvas, movil = !!op.movil;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, movil ? 1.5 : 2);
    var atlas = crearAtlas(dpr);
    var paso = movil ? 3.3 : 2.9;

    var n = 0, tx, ty, x, y, vx, vy, z, delay, glifo, color, grupo, ox, oy, z0;
    var rangos = [];
    var rect = null, fuga = { x: 0, y: 0 }, escala = 1;
    var raf = 0, vivo = false, ensamblando = false, t0 = 0, finEnsamble = 0;
    var mirada = { x: 0, y: 0 }, flota = { y: 0 };
    var mouse = { x: -9999, y: -9999, sx: -9999, sy: -9999, dentro: false };
    var quieto = 0, ultimo = 0, alAcabar = null, pausado = false;
    var respirando = false, inicioRespiro = 0, nx, ny, rd;

    function muestrear() {
      rect = svg.getBoundingClientRect();
      escala = rect.width / 400;
      var w = Math.ceil(rect.width), h = Math.ceil(rect.height);
      var off = document.createElement("canvas");
      off.width = w; off.height = h;
      var g = off.getContext("2d", { willReadFrequently: true });
      var puntos = [];
      var partes = [
        ["anillo", svg.querySelector("#anillo")],
        ["ojo-sup", svg.querySelector("#ojo-sup")],
        ["ojo-inf", svg.querySelector("#ojo-inf")],
        ["iris", svg.querySelector("#iris")],
        ["pupila", svg.querySelector("#pupila")],
        ["hr", svg.querySelector("#hr")],
        ["fragmento", svg.querySelector("#fragmento > path")]
      ];
      svg.querySelectorAll("#bits > *").forEach(function (b) { partes.push(["bits", b]); });

      partes.forEach(function (par) {
        var id = par[0], el = par[1];
        if (!el) return;
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.clearRect(0, 0, w, h);
        g.setTransform(escala, 0, 0, escala, 0, 0);
        g.fillStyle = "#000"; g.strokeStyle = "#000";
        if (id === "fragmento" || id === "bits") g.translate(30, -30);
        dibujarParte(g, el, svg);
        var datos = g.getImageData(0, 0, w, h).data;
        var col = colorDeParte(id, el), gru = grupoDeParte(id);
        var p = (id === "bits" || id === "pupila") ? paso * 0.75 : paso;
        for (var yy = p / 2; yy < h; yy += p) {
          for (var xx = p / 2; xx < w; xx += p) {
            var jx = xx + (Math.random() - 0.5) * 1.6, jy = yy + (Math.random() - 0.5) * 1.6;
            var ix = clamp(Math.round(jx), 0, w - 1), iy = clamp(Math.round(jy), 0, h - 1);
            if (datos[(iy * w + ix) * 4 + 3] > 128) puntos.push([jx, jy, col, gru]);
          }
        }
      });
      // tope duro: submuestreo uniforme
      if (puntos.length > TOPE) {
        var r = TOPE / puntos.length;
        puntos = puntos.filter(function () { return Math.random() < r; });
      }
      puntos.sort(function (a, b) { return a[2] - b[2]; });
      return puntos;
    }

    function preparar() {
      var puntos = muestrear();
      n = puntos.length;
      tx = new Float32Array(n); ty = new Float32Array(n);
      x = new Float32Array(n); y = new Float32Array(n);
      vx = new Float32Array(n); vy = new Float32Array(n);
      z = new Float32Array(n); delay = new Float32Array(n);
      ox = new Float32Array(n); oy = new Float32Array(n); z0 = new Float32Array(n);
      glifo = new Uint8Array(n); color = new Uint8Array(n); grupo = new Uint8Array(n);
      // la onda nace en la pupila-cerradura
      fuga.x = 200 * escala; fuga.y = 200 * escala;
      var maxD = 0, i;
      for (i = 0; i < n; i++) {
        var d = Math.hypot(puntos[i][0] - fuga.x, puntos[i][1] - fuga.y);
        if (d > maxD) maxD = d;
      }
      rangos = [];
      var actual = -1;
      for (i = 0; i < n; i++) {
        var pt = puntos[i];
        tx[i] = pt[0]; ty[i] = pt[1]; color[i] = pt[2]; grupo[i] = pt[3];
        if (pt[2] !== actual) { rangos.push([pt[2], i]); actual = pt[2]; }
        var dist = Math.hypot(pt[0] - fuga.x, pt[1] - fuga.y);
        delay[i] = dist / maxD * 0.6 + Math.random() * 0.15;
        z[i] = Math.random();
        var ang = Math.random() * Math.PI * 2, rad = (0.4 + Math.random() * 1.1) * 520 * escala;
        ox[i] = Math.cos(ang) * rad; oy[i] = Math.sin(ang) * rad;
        z0[i] = 900 + Math.random() * 2200;
        glifo[i] = (grupo[i] === 2 && Math.random() < 0.5) ? 7 + (Math.random() * 3 | 0) : (Math.random() * 7 | 0);
        x[i] = tx[i]; y[i] = ty[i]; vx[i] = 0; vy[i] = 0;
      }
      for (i = 0; i < rangos.length; i++) rangos[i][2] = (i + 1 < rangos.length) ? rangos[i + 1][1] : n;
      nx = new Float32Array(n); ny = new Float32Array(n); rd = new Float32Array(n);
      for (i = 0; i < n; i++) {
        var ddx = tx[i] - fuga.x, ddy = ty[i] - fuga.y, l = Math.hypot(ddx, ddy) || 1;
        nx[i] = ddx / l; ny[i] = ddy / l; rd[i] = l;
      }
    }

    function dimensionar() {
      canvas.width = Math.round(innerWidth * dpr);
      canvas.height = Math.round(innerHeight * dpr);
    }

    function offset(i) {
      // desplazamientos vivos: la mirada mueve iris y pupila; el fragmento flota
      if (grupo[i] === 1) return [mirada.x * escala, mirada.y * escala];
      if (grupo[i] === 2) return [0, flota.y * escala];
      return [0, 0];
    }

    function cuadroEnsamble(ahora) {
      var T = (ahora - t0) / 1000;
      var celda = atlas.celda, F = 700;
      var r = svg.getBoundingClientRect();
      var bx = r.left, by = r.top, fx = bx + fuga.x, fy = by + fuga.y;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      var listos = 0, dur = 1.45;
      for (var i = 0; i < n; i++) {
        var t = (T - delay[i]) / dur;
        if (t <= 0) continue;
        if (t >= 1) { t = 1; listos++; }
        var e = easeOut(t);
        var o = offset(i);
        var wx = bx + tx[i] + o[0] + ox[i] * (1 - e) * (1 - e);
        var wy = by + ty[i] + o[1] + oy[i] * (1 - e) * (1 - e);
        var Z = z0[i] * (1 - e);
        var k = F / (F + Z);
        var sx = fx + (wx - fx) * k, sy = fy + (wy - fy) * k;
        x[i] = sx - bx; y[i] = sy - by;
        var alpha = (0.35 + z[i] * 0.65) * clamp(t * 4, 0, 1);
        if (e > 0.9) {
          // asentada: punto
          ctx.globalAlpha = lerp(alpha, 1, (e - 0.9) * 10);
          ctx.fillStyle = COLORES[ORDEN_COLOR[color[i]]];
          var s = movil ? 1.9 : 1.7;
          ctx.fillRect(sx - s / 2, sy - s / 2, s, s);
        } else {
          ctx.globalAlpha = alpha;
          var tam = (5 + z[i] * 6) * (0.35 + 0.65 * k);
          var col = z[i] < 0.3 ? GLIFOS.length : glifo[i];
          if (z[i] < 0.3) tam *= 1.8;
          ctx.drawImage(atlas.canvas, col * celda, color[i] * celda, celda, celda, sx - tam / 2, sy - tam / 2, tam, tam);
        }
      }
      ctx.globalAlpha = 1;
      if (listos >= n * 0.98 || T > 2.4) {
        ensamblando = false;
        for (var j = 0; j < n; j++) { x[j] = tx[j]; y[j] = ty[j]; }
        if (alAcabar) { var cb = alAcabar; alAcabar = null; cb(); }
      }
    }

    function cuadroFisica(ahora) {
      var r = svg.getBoundingClientRect();
      var bx = r.left, by = r.top;
      mouse.sx = lerp(mouse.sx, mouse.x, 0.18);
      mouse.sy = lerp(mouse.sy, mouse.y, 0.18);
      var mx = mouse.sx - bx, my = mouse.sy - by;
      var radio = movil ? 60 : 84, rad2 = radio * radio;
      var iman = 260 * Math.max(escala, 0.7), iman2 = iman * iman;
      var maxV = 0;
      // Respiración en reposo: una onda lenta que nace en la pupila (el símbolo está vivo)
      // y, cada pocos segundos, un pulso que recorre el símbolo y vuelve glifos lo que toca.
      var T = ahora / 1000;
      var fase = respirando ? T * 1.3 : 0;
      var amp = respirando ? 0.75 * escala : 0;
      var radioPulso = -1;
      if (respirando) {
        var tp = (T - inicioRespiro) % 7;
        if (T - inicioRespiro > 2.5 && tp < 1.6) radioPulso = tp * 230 * escala;
      }
      for (var i = 0; i < n; i++) {
        var o = offset(i);
        var gx = tx[i] + o[0], gy = ty[i] + o[1];
        if (respirando) {
          var r0 = rd[i], b = amp * Math.sin(fase - r0 * 0.022 / escala);
          if (radioPulso >= 0) {
            var dd = Math.abs(r0 - radioPulso);
            if (dd < 26 * escala) b += (1 - dd / (26 * escala)) * 3.4 * escala;
          }
          gx += nx[i] * b; gy += ny[i] * b;
        }
        var dx = x[i] - mx, dy = y[i] - my, d2 = dx * dx + dy * dy;
        if (!movil && d2 < iman2 && d2 > 0.01) {
          var d = Math.sqrt(d2);
          if (d < radio) {
            var f = (1 - d / radio); f = f * f * 6;
            vx[i] += dx / d * f; vy[i] += dy / d * f;
          } else {
            // imán suave: antes de tocarlo, el símbolo ya se inclina hacia el cursor
            var k2 = (1 - d / iman) * 2.2 * escala;
            gx -= dx / d * k2; gy -= dy / d * k2;
          }
        }
        vx[i] += (gx - x[i]) * 0.08;
        vy[i] += (gy - y[i]) * 0.08;
        vx[i] *= 0.82; vy[i] *= 0.82;
        x[i] += vx[i]; y[i] += vy[i];
        var v = Math.abs(vx[i]) + Math.abs(vy[i]);
        if (v > maxV) maxV = v;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      var s = movil ? 1.9 : 1.7;
      for (var q = 0; q < rangos.length; q++) {
        ctx.fillStyle = COLORES[ORDEN_COLOR[rangos[q][0]]];
        for (var p = rangos[q][1]; p < rangos[q][2]; p++) {
          var desplazada = Math.abs(vx[p]) + Math.abs(vy[p]);
          if (desplazada > 1.2) {
            // al moverse, la partícula vuelve a ser glifo (lo que se desprende se ve como dato)
            var tam = 7;
            ctx.drawImage(atlas.canvas, glifo[p] * atlas.celda, color[p] * atlas.celda, atlas.celda, atlas.celda, bx + x[p] - tam / 2, by + y[p] - tam / 2, tam, tam);
          } else {
            ctx.fillRect(bx + x[p] - s / 2, by + y[p] - s / 2, s, s);
          }
        }
      }
      // apagado: quieto y sin cursor encima durante 1,5 s (nunca mientras respira)
      if (!respirando && maxV < 0.06 && !mouse.dentro) {
        if (!quieto) quieto = ahora;
        if (ahora - quieto > 1500 && op.alReposar) { op.alReposar(); return false; }
      } else quieto = 0;
      return true;
    }

    function bucle(ahora) {
      raf = 0;
      if (pausado) return;
      if (ensamblando) cuadroEnsamble(ahora);
      else if (vivo) { if (!cuadroFisica(ahora)) { vivo = false; return; } }
      else return;
      raf = requestAnimationFrame(bucle);
    }
    function arrancar() { if (!raf && !pausado) raf = requestAnimationFrame(bucle); }

    dimensionar();
    preparar();

    var api = {
      cantidad: function () { return n; },
      ensamblar: function (cb) {
        alAcabar = cb; ensamblando = true; t0 = performance.now(); arrancar();
      },
      terminarYa: function () {
        if (ensamblando) {
          ensamblando = false;
          for (var j = 0; j < n; j++) { x[j] = tx[j]; y[j] = ty[j]; }
          if (alAcabar) { var cb = alAcabar; alAcabar = null; cb(); }
        }
      },
      ensamblando: function () { return ensamblando; },
      activar: function () { if (ensamblando) return; vivo = true; quieto = 0; arrancar(); },
      respirar: function (v) {
        respirando = !!v;
        if (v) { inicioRespiro = performance.now() / 1000; vivo = true; quieto = 0; arrancar(); }
      },
      detener: function () {
        vivo = false; ensamblando = false;
        if (raf) cancelAnimationFrame(raf); raf = 0;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      },
      puntero: function (px, py, dentro) { mouse.x = px; mouse.y = py; mouse.dentro = dentro; if (mouse.sx < -9000) { mouse.sx = px; mouse.sy = py; } },
      dispersar: function (px, py) {
        // toque en móvil: las partículas cercanas al dedo saltan y vuelven (~0,9 s)
        var r = svg.getBoundingClientRect(), mx = px - r.left, my = py - r.top, R = 60;
        for (var i = 0; i < n; i++) {
          var dx = x[i] - mx, dy = y[i] - my, d = Math.hypot(dx, dy);
          if (d < R && d > 0.01) { var f = (1 - d / R) * 16; vx[i] += dx / d * f; vy[i] += dy / d * f; }
        }
        vivo = true; quieto = 0; arrancar();
      },
      mirada: mirada,
      flota: flota,
      pausar: function (v) { pausado = v; if (!v && (vivo || ensamblando)) arrancar(); },
      rehacer: function () {
        dimensionar();
        var era = ensamblando;
        preparar();
        if (!era) for (var j = 0; j < n; j++) { x[j] = tx[j]; y[j] = ty[j]; }
      }
    };
    return api;
  }

  window.Particulas = { crear: crear };
})();
