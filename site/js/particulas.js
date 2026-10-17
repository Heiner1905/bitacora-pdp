/* ==========================================================================
   particulas.js — la capa global de partículas (constructor 1 · DIRECCION §10)
   Un único canvas fijo (#particulas, aria-hidden). Solo corre mientras hay una
   formación activa (gsap.ticker); después se apaga y se borra.

   USO (lo usan la portada, el constructor 2 y el constructor 3):

     // Forma un texto sobre la caja de un elemento (con su fuente real) y cede al texto.
     // Por defecto dura 0,6 s y la cifra se lee desde el primer tercio del vuelo.
     FX.particulas.formarTexto('03', elNumero, { desde: 'marca', alTerminar: fn });

     // Forma un SVG (muestrea cada parte con su color computado) y cede al vector:
     FX.particulas.formarSVG(svgEl, { desde: 'pupila', duracion: 1.8, alTerminar: fn });
     // …o lo forma ANTES de que aparezca el vector y el llamador decide cuándo mostrarlo:
     FX.particulas.formarSVG(svgEl, { ceder: false, alTerminar: function () { … luego: FX.particulas.ceder(fn) } });

     // Suelta lo que haya en pantalla (explota hacia fuera y se apaga):
     FX.particulas.dispersar({ duracion: 0.9 });

   opciones comunes:
     desde       'pupila' (punto de fuga en el centro del destino; en un emblema, su pupila 200,200)
                 | 'disperso' (nacen alrededor del destino; en un texto, cerca para que se lea pronto)
                 | 'marca' (nacen en el fragmento de la marca del encabezado, #encabezado-marca, y llegan
                   en curva: el fragmento deja un rastro; si la marca no está en pantalla, como 'disperso')
                 | { x, y } (punto de fuga en px de pantalla)
     duracion    s del vuelo (texto 0,6 · SVG 1,6 por defecto)
     sostener    s que quedan en su sitio (con repulsión al cursor) antes de ceder (texto 0,12 · SVG 0,25)
     ceder       false = al formarse quedan quietas y el destino sigue oculto hasta FX.particulas.ceder(fn);
                 alTerminar se llama en cuanto quedan formadas
     alTerminar  fn() cuando el destino real ya es visible y el canvas se apagó (o, con ceder:false, al formarse)
     ocultarDestino  false = no ocultar el destino durante el vuelo (por defecto se oculta con opacity 0)

   Extras:
     FX.particulas.ceder(fn)      muestra el destino de la formación activa y apaga las partículas
     FX.particulas.halo(svgEl, { x, y, cantidad, toque })  fragmentos que se desprenden del borde del emblema
                 (dial, anillo, fragmento) cerca del punto y orbitan ~1 s; el vector no se toca y sigue vivo
     FX.particulas.despertar(svgEl, …)  (antiguo) el vector entero se vuelve partículas; la portada ya no lo usa
     FX.particulas.soporta('marca'|'ceder'|'halo')  true si la opción existe (FX.particulas.desdes = orígenes)
     FX.particulas.detener()      corta todo ya (el destino queda visible)
     FX.particulas.activa()       true si hay una formación en curso
     FX.particulas.disponible()   false con reduced-motion o sin canvas: entonces formarX muestran el destino y llaman alTerminar

   Detalles:
   - Durante el vuelo, fragmentos geométricos del propio emblema (hexágono, píxel, triángulo, como
     sus bits; atlas pre-renderizado por color), puntos cuadrados al llegar. Repulsión suave al cursor (radio ~80 px).
   - Presupuesto: ≤ 2 500 partículas en escritorio, ≤ 900 en móvil; DPR ≤ 2 (≤ 1,5 en móvil).
   - Un SVG se muestrea una sola vez (en caché, en unidades de cada grupo animable) y cada cuadro
     las partículas siguen la transformación viva de su grupo (dial, iris, pupila, ojo, fragmento):
     el emblema en partículas sigue mirando, parpadeando y girando.
   ========================================================================== */
(function () {
  'use strict';
  var FX = window.FX;
  if (!FX) return;

  // Fragmentos geométricos del propio emblema (como sus bits): hexágono, píxel, triángulo y punto. Nada de 0/1 ni signos.
  var GLIFOS = ['hex', 'cua', 'tri', 'pix'];
  var NG = GLIFOS.length;
  var DINAMICOS = ['dial', 'fragmento', 'iris', 'pupila', 'ojo'];

  var canvas = null, ctx = null, dpr = 1, W = 0, H = 0, movil = false, tope = 2500;
  var listo = false, roto = false;
  var atlas = { canvas: null, celda: 0, colores: [] };
  var cacheSVG = typeof WeakMap === 'function' ? new WeakMap() : null;
  var cacheTexto = {};
  var F = null;              // formación activa
  var corriendo = false;
  var puntero = { x: -9999, y: -9999, sx: -9999, sy: -9999, t: 0 };

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function reducido() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  /* ---------------- Canvas ---------------- */
  function iniciarCanvas() {
    if (listo || roto) return listo;
    canvas = document.getElementById('particulas');
    try { ctx = canvas && canvas.getContext('2d'); } catch (e) { ctx = null; }
    if (!ctx) { roto = true; return false; }
    dimensionar();
    window.addEventListener('resize', dimensionar);
    window.addEventListener('pointermove', function (e) { puntero.x = e.clientX; puntero.y = e.clientY; puntero.t = performance.now(); }, { passive: true });
    document.addEventListener('pointerleave', function () { puntero.x = puntero.y = -9999; });
    document.addEventListener('visibilitychange', function () { if (!document.hidden && F) arrancar(); });
    listo = true;
    return true;
  }
  function dimensionar() {
    if (!canvas) return;
    movil = window.matchMedia('(max-width: 899px)').matches || !window.matchMedia('(pointer: fine)').matches;
    tope = movil ? 900 : 2500;
    var nd = Math.min(window.devicePixelRatio || 1, movil ? 1.5 : 2);
    W = document.documentElement.clientWidth || window.innerWidth;
    H = window.innerHeight;
    if (nd !== dpr || !atlas.canvas) { dpr = nd; reconstruirAtlas(); }
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  }

  /* ---------------- Atlas de glifos (una fila por color) ---------------- */
  function indiceColor(c) {
    var i = atlas.colores.indexOf(c);
    if (i >= 0) return i;
    atlas.colores.push(c);
    reconstruirAtlas();
    return atlas.colores.length - 1;
  }
  function reconstruirAtlas() {
    var celda = Math.round(14 * dpr);
    var c = atlas.canvas || document.createElement('canvas');
    c.width = celda * (NG + 1);
    c.height = celda * Math.max(1, atlas.colores.length);
    var g = c.getContext('2d');
    g.clearRect(0, 0, c.width, c.height);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '500 ' + Math.round(11 * dpr) + "px 'Martian Mono', ui-monospace, monospace";
    atlas.colores.forEach(function (col, fila) {
      g.fillStyle = col; g.strokeStyle = col; g.lineWidth = 1.2 * dpr;
      GLIFOS.forEach(function (gl, i) {
        var cx = i * celda + celda / 2, cy = fila * celda + celda / 2, r = celda * 0.28;
        if (gl === 'hex') {
          g.beginPath();
          for (var k = 0; k < 6; k++) { var a = Math.PI / 3 * k; g[k ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
          g.closePath(); g.stroke();
        } else if (gl === 'cua') g.fillRect(cx - r * 0.7, cy - r * 0.7, r * 1.4, r * 1.4);
        else if (gl === 'tri') { g.beginPath(); g.moveTo(cx - r, cy - r * 0.6); g.lineTo(cx + r, cy - r * 0.2); g.lineTo(cx - r * 0.1, cy + r); g.closePath(); g.fill(); }
        else g.fillRect(cx - r * 0.38, cy - r * 0.38, r * 0.76, r * 0.76);
      });
      // sprite difuso (desenfoque falso para las partículas "lejanas", sin filter: blur)
      var sx = NG * celda + celda / 2, sy = fila * celda + celda / 2;
      var grad = g.createRadialGradient(sx, sy, 0, sx, sy, celda / 2);
      grad.addColorStop(0, conAlfa(col, 0.55)); grad.addColorStop(0.45, conAlfa(col, 0.18)); grad.addColorStop(1, conAlfa(col, 0));
      g.fillStyle = grad; g.fillRect(sx - celda / 2, sy - celda / 2, celda, celda);
    });
    atlas.canvas = c; atlas.celda = celda;
  }
  function rgb(c) {
    var m = /rgba?\(([^)]+)\)/.exec(c || '');
    if (m) { var p = m[1].split(/[\s,\/]+/).map(parseFloat); return p; }
    if (c && c[0] === '#') { var n = parseInt(c.slice(1).length === 3 ? c.slice(1).replace(/./g, '$&$&') : c.slice(1, 7), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255, 1]; }
    return null;
  }
  function conAlfa(c, a) { var p = rgb(c) || [220, 225, 230]; return 'rgba(' + p[0] + ',' + p[1] + ',' + p[2] + ',' + a + ')'; }
  function normal(c) { var p = rgb(c); return p ? 'rgb(' + Math.round(p[0]) + ',' + Math.round(p[1]) + ',' + Math.round(p[2]) + ')' : null; }
  function alfaDe(c) { var p = rgb(c); return p && p.length > 3 && !isNaN(p[3]) ? p[3] : 1; }

  /* ---------------- Muestreo ---------------- */
  function colorFondo() { return normal(getComputedStyle(document.body).backgroundColor) || 'rgb(10,11,14)'; }

  // Recorta un conjunto de puntos {u,v,c,a,g,parte} al presupuesto: lo pequeño se queda completo.
  function recortar(partes, max) {
    var total = 0, chicas = 0;
    partes.forEach(function (p) { total += p.pts.length; if (p.pts.length <= 260) chicas += p.pts.length; });
    var r = total <= max ? 1 : Math.max(0.02, (max - Math.min(chicas, max * 0.35)) / Math.max(1, total - chicas));
    var out = [];
    partes.forEach(function (p) {
      var keep = p.pts.length <= 260 ? Math.min(1, max * 0.35 / Math.max(1, chicas)) : r;
      p.pts.forEach(function (pt) { if (keep >= 1 || Math.random() < keep) out.push(pt); });
    });
    return out;
  }

  function trazoDe(leaf) {
    var tag = leaf.tagName.toLowerCase(), p = new Path2D();
    if (tag === 'path') p = new Path2D(leaf.getAttribute('d'));
    else if (tag === 'circle') p.arc(+leaf.getAttribute('cx'), +leaf.getAttribute('cy'), +(leaf.getAttribute('r') || 0), 0, Math.PI * 2);
    else if (tag === 'ellipse') p.ellipse(+leaf.getAttribute('cx'), +leaf.getAttribute('cy'), +leaf.getAttribute('rx'), +leaf.getAttribute('ry'), 0, 0, Math.PI * 2);
    else if (tag === 'rect') p.rect(+leaf.getAttribute('x') || 0, +leaf.getAttribute('y') || 0, +leaf.getAttribute('width'), +leaf.getAttribute('height'));
    else if (tag === 'line') { p.moveTo(+leaf.getAttribute('x1'), +leaf.getAttribute('y1')); p.lineTo(+leaf.getAttribute('x2'), +leaf.getAttribute('y2')); }
    else if (tag === 'polygon' || tag === 'polyline') {
      var pts = (leaf.getAttribute('points') || '').trim().split(/[\s,]+/).map(Number);
      for (var j = 0; j + 1 < pts.length; j += 2) p[j ? 'lineTo' : 'moveTo'](pts[j], pts[j + 1]);
      if (tag === 'polygon') p.closePath();
    } else return null;
    return p;
  }

  function prefijoDe(svg) {
    var d = svg.querySelector('[id$="dial"]');
    return d ? d.id.slice(0, -4) : 'simbolo-';
  }

  function muestrearSVG(svg) {
    if (cacheSVG && cacheSVG.has(svg)) return cacheSVG.get(svg);
    var pre = prefijoDe(svg), fondo = colorFondo();
    var grupos = [null];   // 0 = raíz (unidades del viewBox)
    DINAMICOS.forEach(function (n) { grupos.push(svg.querySelector('#' + pre + n)); });
    var vbw = (svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width) || 400;
    var esc = (svg.clientWidth || svg.getBoundingClientRect().width || vbw) / vbw;
    var raiz = new DOMMatrix([esc, 0, 0, esc, 0, 0]);
    var R = 2, paso = 1.15;   // resolución del muestreo (px por unidad) y paso en unidades
    var off = document.createElement('canvas');
    var g = off.getContext('2d', { willReadFrequently: true });
    var partes = [];

    var hojas = svg.querySelectorAll('path, circle, ellipse, rect, line, polygon, polyline');
    Array.prototype.forEach.call(hojas, function (leaf) {
      if (leaf.closest('defs, clipPath, mask, title')) return;
      if (leaf.id === pre + 'pupila-fondo' || leaf.id === pre + 'pulso') return;
      var cs = getComputedStyle(leaf);
      var op = 1;
      for (var n = leaf; n && n !== svg; n = n.parentNode) op *= parseFloat(getComputedStyle(n).opacity);
      var conTrazo = cs.stroke && cs.stroke !== 'none' && parseFloat(cs.strokeWidth) > 0;
      var conRelleno = cs.fill && cs.fill !== 'none' && alfaDe(cs.fill) > 0;
      var color = normal(conTrazo ? cs.stroke : cs.fill);
      if (!color || color === fondo) return;
      op *= alfaDe(conTrazo ? cs.stroke : cs.fill) * parseFloat(conTrazo ? cs.strokeOpacity : cs.fillOpacity || 1);
      if (op < 0.06) return;
      var p = trazoDe(leaf);
      if (!p) return;
      // grupo animable más cercano
      var gi = 0;
      for (var a = leaf; a && a !== svg && !gi; a = a.parentNode) { var k = grupos.indexOf(a); if (k > 0) gi = k; }
      var Mg = gi ? grupos[gi].getCTM() : raiz, Ml = leaf.getCTM();
      if (!Mg || !Ml) return;
      var M = DOMMatrix.fromMatrix(Mg).inverse().multiply(DOMMatrix.fromMatrix(Ml));
      // caja en el espacio del grupo
      var bb; try { bb = leaf.getBBox(); } catch (e) { return; }
      var sw = conTrazo ? parseFloat(cs.strokeWidth) : 0;
      var esq = [[bb.x - sw, bb.y - sw], [bb.x + bb.width + sw, bb.y - sw], [bb.x - sw, bb.y + bb.height + sw], [bb.x + bb.width + sw, bb.y + bb.height + sw]].map(function (q) { return M.transformPoint(new DOMPoint(q[0], q[1])); });
      var x0 = Math.floor(Math.min.apply(null, esq.map(function (q) { return q.x; }))) - 1;
      var y0 = Math.floor(Math.min.apply(null, esq.map(function (q) { return q.y; }))) - 1;
      var x1 = Math.ceil(Math.max.apply(null, esq.map(function (q) { return q.x; }))) + 1;
      var y1 = Math.ceil(Math.max.apply(null, esq.map(function (q) { return q.y; }))) + 1;
      var w = Math.max(1, Math.round((x1 - x0) * R)), h = Math.max(1, Math.round((y1 - y0) * R));
      if (w * h > 4e6) return;
      off.width = w; off.height = h;
      g.setTransform(R * M.a, R * M.b, R * M.c, R * M.d, R * (M.e - x0), R * (M.f - y0));
      g.fillStyle = '#000'; g.strokeStyle = '#000';
      if (conTrazo) {
        g.lineWidth = sw;
        g.lineCap = cs.strokeLinecap || 'butt';
        g.lineJoin = cs.strokeLinejoin || 'miter';
        var dash = (cs.strokeDasharray && cs.strokeDasharray !== 'none') ? cs.strokeDasharray.split(/[\s,]+/).map(parseFloat).filter(function (v) { return !isNaN(v); }) : [];
        g.setLineDash(dash);
        g.stroke(p);
      }
      if (conRelleno && !(conTrazo && leaf.tagName.toLowerCase() === 'path')) { g.setLineDash([]); g.fill(p); }
      var datos = g.getImageData(0, 0, w, h).data;
      var pts = [], pasoPx = paso * R, ci = color, alfa = Math.min(1, op);
      var fino = sw > 0 && sw < 3 ? 0.8 : 1;   // los trazos finos se muestrean un poco más denso
      for (var yy = pasoPx * fino / 2; yy < h; yy += pasoPx * fino) {
        for (var xx = pasoPx * fino / 2; xx < w; xx += pasoPx * fino) {
          var jx = xx + (Math.random() - 0.5) * R * 0.8, jy = yy + (Math.random() - 0.5) * R * 0.8;
          var ix = clamp(Math.round(jx), 0, w - 1), iy = clamp(Math.round(jy), 0, h - 1);
          if (datos[(iy * w + ix) * 4 + 3] > 110) pts.push([x0 + jx / R, y0 + jy / R, ci, alfa, gi]);
        }
      }
      if (pts.length) partes.push({ pts: pts });
    });
    var m = { grupos: grupos, raizEsc: vbw, puntos: partes };
    if (cacheSVG) cacheSVG.set(svg, m);
    return m;
  }

  function muestrearTexto(texto, el) {
    var r = el.getBoundingClientRect();
    var w = Math.max(1, Math.ceil(r.width)), h = Math.max(1, Math.ceil(r.height));
    var cs = getComputedStyle(el);
    var clave = texto + '|' + w + 'x' + h + '|' + cs.font;
    if (cacheTexto[clave]) return cacheTexto[clave];
    // se muestrea a resolución reducida (la cifra es grande): menos getImageData en el cuadro de llegada
    var q = movil ? 0.4 : 0.6;
    var off = document.createElement('canvas'); off.width = Math.max(1, Math.ceil(w * q)); off.height = Math.max(1, Math.ceil(h * q));
    var g = off.getContext('2d', { willReadFrequently: true });
    g.scale(q, q);
    g.fillStyle = '#000'; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    var color = null;
    var propio = (el.textContent || '').replace(/\s+/g, '') === String(texto).replace(/\s+/g, '');
    if (propio) {
      // posiciones reales de cada carácter (respeta fuente, tracking y saltos de línea)
      var tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), nodo, rango = document.createRange();
      while ((nodo = tw.nextNode())) {
        var pcs = getComputedStyle(nodo.parentNode);
        if (!color && pcs.color && alfaDe(pcs.color) > 0.05) color = normal(pcs.color);
        g.font = pcs.fontStyle + ' ' + pcs.fontWeight + ' ' + pcs.fontSize + ' ' + pcs.fontFamily;
        var asc = null;
        for (var i = 0; i < nodo.length; i++) {
          var ch = nodo.data[i];
          if (/\s/.test(ch)) continue;
          rango.setStart(nodo, i); rango.setEnd(nodo, i + 1);
          var cr = rango.getBoundingClientRect();
          if (!cr.width) continue;
          var mt = g.measureText(ch);
          asc = mt.fontBoundingBoxAscent != null ? mt.fontBoundingBoxAscent : cr.height * 0.8;
          g.fillText(ch, cr.left - r.left, cr.top - r.top + asc);
        }
      }
    } else {
      color = normal(cs.color);
      var fs = parseFloat(cs.fontSize) || h * 0.8;
      g.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + fs + 'px ' + cs.fontFamily;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(texto, w / 2, h / 2);
    }
    if (!color || alfaDe(cs.color) < 0.05) color = normal(getComputedStyle(document.documentElement).getPropertyValue('--escarcha').trim()) || 'rgb(244,246,248)';
    var ow = off.width, oh = off.height;
    var datos = g.getImageData(0, 0, ow, oh).data;
    var max = movil ? 560 : tope, pts, paso = 1.2;
    do {
      pts = [];
      for (var y = paso / 2; y < oh; y += paso) for (var x = paso / 2; x < ow; x += paso) {
        var jx = x + (Math.random() - 0.5) * paso * 0.5, jy = y + (Math.random() - 0.5) * paso * 0.5;
        var ix = clamp(Math.round(jx), 0, ow - 1), iy = clamp(Math.round(jy), 0, oh - 1);
        if (datos[(iy * ow + ix) * 4 + 3] > 120) pts.push([jx / q, jy / q, color, 1, 0]);
      }
      paso *= 1.18;
    } while (pts.length > max && paso < 40);
    var m = { grupos: [null], puntos: [{ pts: pts }], texto: true };
    cacheTexto[clave] = m;
    return m;
  }

  /* ---------------- Formación ---------------- */
  function crearFormacion(m, destino, op) {
    var pts = recortar(m.puntos, tope);
    // ordenar por color para cambiar fillStyle lo mínimo
    pts.forEach(function (p) { p[5] = indiceColor(p[2]); });
    pts.sort(function (a, b) { return a[5] - b[5] || a[3] - b[3]; });
    var n = pts.length;
    var f = {
      n: n, m: m, destino: destino, op: op || {},
      u: new Float32Array(n), v: new Float32Array(n), a0: new Float32Array(n),
      x: new Float32Array(n), y: new Float32Array(n), vx: new Float32Array(n), vy: new Float32Array(n),
      tx: new Float32Array(n), ty: new Float32Array(n),
      sx0: new Float32Array(n), sy0: new Float32Array(n), z: new Float32Array(n), z0: new Float32Array(n), delay: new Float32Array(n),
      glifo: new Uint8Array(n), col: new Uint8Array(n), gr: new Uint8Array(n),
      modo: 'vuelo', t0: performance.now(), alfa: 1, fin: 0, quieto: 0, mats: []
    };
    for (var i = 0; i < n; i++) {
      var p = pts[i];
      f.u[i] = p[0]; f.v[i] = p[1]; f.a0[i] = p[3]; f.gr[i] = p[4]; f.col[i] = p[5];
      f.z[i] = Math.random();
      f.glifo[i] = Math.random() * NG | 0;
    }
    return f;
  }

  // Matrices vivas de cada grupo → posición de destino en pantalla
  function objetivos(f) {
    var r = f.destino.getBoundingClientRect();
    f.bx = r.left; f.by = r.top; f.bw = r.width; f.bh = r.height;
    var gs = f.m.grupos, mats = f.mats;
    if (f.m.texto) {
      var sx = f.caja ? r.width / f.caja[0] : 1, sy = f.caja ? r.height / f.caja[1] : 1;
      mats[0] = [sx, 0, 0, sy, r.left, r.top];
    } else {
      var esc = (f.destino.clientWidth || r.width) / f.m.raizEsc;
      // si el SVG está escalado por CSS (cámara), se corrige con la razón caja/cliente
      var k = f.destino.clientWidth ? r.width / f.destino.clientWidth : 1;
      for (var g = 0; g < gs.length; g++) {
        var M = g ? (gs[g] && gs[g].getCTM()) : { a: esc, b: 0, c: 0, d: esc, e: 0, f: 0 };
        if (!M) M = { a: esc, b: 0, c: 0, d: esc, e: 0, f: 0 };
        mats[g] = [M.a * k, M.b * k, M.c * k, M.d * k, r.left + M.e * k, r.top + M.f * k];
      }
    }
    for (var i = 0; i < f.n; i++) {
      var m = mats[f.gr[i]], u = f.u[i], v = f.v[i];
      f.tx[i] = m[0] * u + m[2] * v + m[4];
      f.ty[i] = m[1] * u + m[3] * v + m[5];
    }
  }

  // Fragmento de la marca del encabezado (de ahí sale el rastro con desde: 'marca')
  function origenMarca() {
    var cont = document.getElementById('encabezado-marca');
    if (!cont) return null;
    var el = cont.querySelector('[id$="fragmento"], .marca__fragmento, [class*="fragmento"]') || cont.querySelector('svg');
    if (!el) return null;
    var r = el.getBoundingClientRect();
    if (!r.width || r.bottom < 0 || r.top > H) return null;
    var cs = getComputedStyle(cont.closest('#encabezado') || cont);
    if (cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) { /* aun oculto, el origen sigue siendo su sitio */ }
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function puntoFuga(f) {
    var d = f.op.desde, r = f.destino.getBoundingClientRect();
    if (d && typeof d === 'object') return { x: d.x, y: d.y };
    if (d === 'disperso' || d === 'marca') return null;
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function prepararVuelo(f) {
    objetivos(f);
    var fuga = puntoFuga(f), maxD = 1, i;
    f.fuga = fuga;
    f.marca = f.op.desde === 'marca' ? origenMarca() : null;
    // un texto se lee pronto: por defecto 0,6 s en total (casi todo el vuelo es forma reconocible)
    var dur = f.op.duracion || (f.m.texto ? 0.6 : 1.6);
    f.rapido = !!f.m.texto;
    f.durP = dur * (f.rapido ? 0.78 : 0.62); f.esparcir = dur - f.durP;
    for (i = 0; i < f.n; i++) {
      if (fuga) {
        var dd = Math.hypot(f.tx[i] - fuga.x, f.ty[i] - fuga.y); if (dd > maxD) maxD = dd;
      }
    }
    for (i = 0; i < f.n; i++) {
      if (fuga) {
        var dist = Math.hypot(f.tx[i] - fuga.x, f.ty[i] - fuga.y);
        f.delay[i] = dist / maxD * f.esparcir * 0.8 + Math.random() * f.esparcir * 0.2;
        var ang = Math.random() * Math.PI * 2, rad = (0.4 + Math.random() * 1.1) * Math.max(f.bw, 120) * 0.8;
        f.sx0[i] = Math.cos(ang) * rad; f.sy0[i] = Math.sin(ang) * rad;
        f.z0[i] = 900 + Math.random() * 2200;
      } else if (f.marca) {
        // rastro: todas nacen en el fragmento de la marca y llegan en una curva suave
        f.delay[i] = Math.random() * f.esparcir;
        f.sx0[i] = f.marca.x + (Math.random() - 0.5) * 10; f.sy0[i] = f.marca.y + (Math.random() - 0.5) * 6;
        f.z0[i] = (Math.random() - 0.5) * 0.5;   // desvío perpendicular de la curva (fracción de la distancia)
      } else {
        f.delay[i] = Math.random() * f.esparcir;
        if (f.rapido) {
          // cerca de su destino: la forma se reconoce desde el primer tercio del vuelo
          var a2 = Math.random() * Math.PI * 2, r2 = (0.15 + Math.random() * 0.6) * Math.max(f.bw, f.bh, 120);
          f.sx0[i] = f.tx[i] + Math.cos(a2) * r2; f.sy0[i] = f.ty[i] + Math.sin(a2) * r2;
        } else { f.sx0[i] = Math.random() * W; f.sy0[i] = Math.random() * H; }
        f.z0[i] = 0;
      }
      f.x[i] = f.tx[i]; f.y[i] = f.ty[i]; f.vx[i] = 0; f.vy[i] = 0;
    }
  }

  function ocultarDestino(f) {
    if (f.op.ocultarDestino === false || f.oculto) return;
    var gsap = window.gsap;
    f.opacidadPrevia = gsap ? gsap.getProperty(f.destino, 'opacity') : 1;
    if (!(f.opacidadPrevia > 0.05)) f.opacidadPrevia = 1;
    if (gsap) gsap.set(f.destino, { opacity: 0 }); else f.destino.style.opacity = 0;
    f.oculto = true;
  }
  function mostrarDestino(f, dur) {
    if (!f.oculto) return;
    f.oculto = false;
    if (window.gsap) window.gsap.to(f.destino, { opacity: f.opacidadPrevia || 1, duration: dur == null ? 0.45 : dur, ease: 'power1.out', overwrite: 'auto' });
    else f.destino.style.opacity = f.opacidadPrevia || 1;
  }

  function terminar(f, inmediato) {
    if (F === f) F = null;
    mostrarDestino(f, inmediato ? 0 : 0.45);
    limpiar();
    var cb = f.op.alTerminar; f.op.alTerminar = null;
    if (cb) { try { cb(); } catch (e) { console.error('[particulas] alTerminar', e); } }
  }
  function ceder(f) {
    if (f.modo === 'cede') return;
    f.modo = 'cede'; f.tCede = performance.now();
    mostrarDestino(f, 0.45);
  }
  function limpiar() { if (ctx) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); } }

  /* ---------------- Bucle ---------------- */
  function arrancar() {
    if (corriendo || !window.gsap) return;
    corriendo = true;
    window.gsap.ticker.add(cuadro);
  }
  function parar() {
    if (!corriendo) return;
    corriendo = false;
    window.gsap.ticker.remove(cuadro);
  }

  var tAnterior = 0;
  function cuadro() {
    var f = F, conHalo = hal && hal.n > 0;
    if ((!f && !conHalo) || document.hidden) { parar(); if (!f && !conHalo) limpiar(); return; }
    var ahora = performance.now();
    var fr = tAnterior ? clamp((ahora - tAnterior) / 16.667, 0.25, 3) : 1;
    tAnterior = ahora;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    var celda = atlas.celda, s = 2.1;
    if (f) {
      objetivos(f);
      if (f.modo === 'vuelo') vuelo(f, ahora, celda, s);
      else if (f.modo === 'dispersa') dispersa(f, ahora, celda);
      else fisica(f, ahora, celda, s);
    }
    if (conHalo) dibujarHalo(fr, celda);
    ctx.globalAlpha = 1;
  }

  /* ---------------- Halo: fragmentos que se desprenden del borde y orbitan ----------------
     El emblema sigue siendo vector y sigue vivo; esto solo ocurre alrededor de su borde. */
  var hal = null;
  function asegurarHalo() {
    if (hal) return hal;
    var n = movil ? 160 : 380;
    hal = { max: n, n: 0, el: null, ang: new Float32Array(n), rad: new Float32Array(n), dang: new Float32Array(n), drad: new Float32Array(n),
      vida: new Float32Array(n), dura: new Float32Array(n), tam: new Float32Array(n), a0: new Float32Array(n), col: new Uint8Array(n), gl: new Uint8Array(n) };
    return hal;
  }
  function bordeDe(svg) {
    var m = muestrearSVG(svg);
    if (m.borde) return m.borde;
    var A = [], R = [], C = [], AL = [];
    m.puntos.forEach(function (parte) {
      parte.pts.forEach(function (p) {
        var du = p[0] - 200, dv = p[1] - 200, r = Math.hypot(du, dv);
        var gi = p[4], nombre = gi ? DINAMICOS[gi - 1] : '';
        if (nombre === 'dial' || nombre === 'fragmento' || (!gi && r > 128 && r < 166)) {
          A.push(Math.atan2(dv, du)); R.push(r); C.push(indiceColor(p[2])); AL.push(Math.max(0.55, p[3]));
        }
      });
    });
    m.borde = { a: A, r: R, c: C, al: AL };
    return m.borde;
  }
  function emitirHalo(svg, angulo, cantidad, ventana, giro) {
    var h = asegurarHalo(), b = bordeDe(svg);
    if (!b.a.length) return;
    h.el = svg;
    for (var k = 0; k < cantidad; k++) {
      var idx = -1;
      for (var t = 0; t < 14; t++) {
        var c = Math.random() * b.a.length | 0, d = Math.atan2(Math.sin(b.a[c] - angulo), Math.cos(b.a[c] - angulo));
        if (Math.abs(d) < ventana) { idx = c; break; }
      }
      if (idx < 0) continue;
      var i = h.n < h.max ? h.n++ : (Math.random() * h.max | 0);
      var sg = giro || (Math.random() < 0.5 ? -1 : 1);
      h.ang[i] = b.a[idx]; h.rad[i] = b.r[idx];
      h.dang[i] = sg * (0.003 + Math.random() * 0.009);
      h.drad[i] = 0.12 + Math.random() * 0.5;
      h.vida[i] = 0; h.dura[i] = 0.6 + Math.random() * 0.6;
      h.tam[i] = 5 + Math.random() * 5; h.a0[i] = b.al[idx];
      h.col[i] = b.c[idx]; h.gl[i] = Math.random() * NG | 0;
    }
    arrancar();
  }
  function dibujarHalo(fr, celda) {
    var h = hal, r = h.el && h.el.getBoundingClientRect();
    if (!r || !r.width) { h.n = 0; return; }
    var esc = r.width / 400, cx = r.left + r.width / 2, cy = r.top + r.height / 2, dt = fr / 60;
    for (var i = 0; i < h.n; i++) {
      h.vida[i] += dt;
      var t = h.vida[i] / h.dura[i];
      if (t >= 1) {
        // compactar: la última viva ocupa este lugar
        var j = --h.n;
        h.ang[i] = h.ang[j]; h.rad[i] = h.rad[j]; h.dang[i] = h.dang[j]; h.drad[i] = h.drad[j]; h.vida[i] = h.vida[j];
        h.dura[i] = h.dura[j]; h.tam[i] = h.tam[j]; h.a0[i] = h.a0[j]; h.col[i] = h.col[j]; h.gl[i] = h.gl[j];
        i--; continue;
      }
      h.ang[i] += h.dang[i] * fr; h.rad[i] += h.drad[i] * fr; h.drad[i] *= Math.pow(0.985, fr);
      var x = cx + Math.cos(h.ang[i]) * h.rad[i] * esc, y = cy + Math.sin(h.ang[i]) * h.rad[i] * esc;
      var tam = h.tam[i] * (1 - t * 0.5);
      ctx.globalAlpha = h.a0[i] * Math.pow(1 - t, 1.4);
      ctx.drawImage(atlas.canvas, h.gl[i] * celda, h.col[i] * celda, celda, celda, x - tam / 2, y - tam / 2, tam, tam);
    }
  }

  function vuelo(f, ahora, celda, s) {
    var T = (ahora - f.t0) / 1000, listos = 0, PF = 700, fuga = f.fuga, colAct = -1;
    for (var i = 0; i < f.n; i++) {
      var t = (T - f.delay[i]) / f.durP;
      if (t <= 0) continue;
      if (t >= 1) { t = 1; listos++; }
      var e = f.rapido ? 1 - Math.pow(1 - t, 4) : easeOut(t), sx, sy, k = 1;
      if (f.marca) {
        var mxp = (f.sx0[i] + f.tx[i]) / 2, myp = (f.sy0[i] + f.ty[i]) / 2;
        var ddx = f.tx[i] - f.sx0[i], ddy = f.ty[i] - f.sy0[i];
        var cxp = mxp - ddy * f.z0[i], cyp = myp + ddx * f.z0[i], u1 = 1 - e;
        sx = u1 * u1 * f.sx0[i] + 2 * u1 * e * cxp + e * e * f.tx[i];
        sy = u1 * u1 * f.sy0[i] + 2 * u1 * e * cyp + e * e * f.ty[i];
      } else if (fuga) {
        var wx = f.tx[i] + f.sx0[i] * (1 - e) * (1 - e), wy = f.ty[i] + f.sy0[i] * (1 - e) * (1 - e);
        k = PF / (PF + f.z0[i] * (1 - e));
        sx = fuga.x + (wx - fuga.x) * k; sy = fuga.y + (wy - fuga.y) * k;
      } else {
        sx = f.sx0[i] + (f.tx[i] - f.sx0[i]) * e; sy = f.sy0[i] + (f.ty[i] - f.sy0[i]) * e;
      }
      f.x[i] = sx; f.y[i] = sy;
      var alfa = (0.35 + f.z[i] * 0.65) * clamp(t * 4, 0, 1) * f.a0[i];
      if (f.rapido && e > 0.55) {
        // el texto se asienta en puntos muy pronto: se lee como cifra, no como estática
        ctx.globalAlpha = Math.min(1, alfa + (f.a0[i] - alfa) * (e - 0.55) * 2.2);
        if (f.col[i] !== colAct) { colAct = f.col[i]; ctx.fillStyle = atlas.colores[colAct]; }
        ctx.fillRect(sx - s / 2, sy - s / 2, s, s);
      } else if (e > 0.9) {
        ctx.globalAlpha = alfa + (f.a0[i] - alfa) * (e - 0.9) * 10;
        if (f.col[i] !== colAct) { colAct = f.col[i]; ctx.fillStyle = atlas.colores[colAct]; }
        ctx.fillRect(sx - s / 2, sy - s / 2, s, s);
      } else {
        ctx.globalAlpha = alfa;
        var tam = (5 + f.z[i] * 6) * (0.35 + 0.65 * k), cg = f.glifo[i];
        if (fuga && f.z[i] < 0.3) { cg = NG; tam *= 1.8; }
        if (f.rapido) tam *= 0.7;
        ctx.drawImage(atlas.canvas, cg * celda, f.col[i] * celda, celda, celda, sx - tam / 2, sy - tam / 2, tam, tam);
      }
    }
    var durT = f.durP + f.esparcir;
    if (listos >= f.n * 0.985 || T > durT + (f.rapido ? 0.2 : 0.8)) {
      for (var j = 0; j < f.n; j++) { f.x[j] = f.tx[j]; f.y[j] = f.ty[j]; f.vx[j] = 0; f.vy[j] = 0; }
      f.modo = 'asentada'; f.tAsentada = ahora;
    }
  }

  function fisica(f, ahora, celda, s) {
    puntero.sx += (puntero.x - puntero.sx) * 0.25; puntero.sy += (puntero.y - puntero.sy) * 0.25;
    if (puntero.x < -9000) { puntero.sx = puntero.sy = -9999; }
    var radio = movil ? 60 : 80, maxV = 0, mx = puntero.sx, my = puntero.sy;
    var fade = 1;
    if (f.modo === 'cede') { fade = 1 - (ahora - f.tCede) / 450; if (fade <= 0) { terminar(f); return; } }
    if (f.modo === 'aparece') { fade = clamp((ahora - f.t0) / 220, 0, 1); if (fade >= 1) f.modo = 'viva'; }
    var desp = 0;
    for (var i = 0; i < f.n; i++) {
      var dx = f.x[i] - mx, dy = f.y[i] - my, d2 = dx * dx + dy * dy;
      if (d2 < radio * radio && d2 > 0.01) {
        var d = Math.sqrt(d2), fu = (1 - d / radio); fu = fu * fu * 5;
        f.vx[i] += dx / d * fu; f.vy[i] += dy / d * fu;
      }
      f.vx[i] += (f.tx[i] - f.x[i]) * 0.08; f.vy[i] += (f.ty[i] - f.y[i]) * 0.08;
      f.vx[i] *= 0.82; f.vy[i] *= 0.82;
      f.x[i] += f.vx[i]; f.y[i] += f.vy[i];
      var v = Math.abs(f.vx[i]) + Math.abs(f.vy[i]);
      if (v > maxV) maxV = v;
    }
    // dibujo agrupado por color; lo que se desprende vuelve a ser glifo (se ve como dato)
    var col = -1, a = -1;
    for (var q = 0; q < f.n; q++) {
      var na = f.a0[q] * fade;
      if (f.col[q] !== col) { col = f.col[q]; ctx.fillStyle = atlas.colores[col]; }
      if (na !== a) { a = na; ctx.globalAlpha = a; }
      var vel = Math.abs(f.vx[q]) + Math.abs(f.vy[q]);
      if (vel > 1.2) {
        desp++;
        ctx.drawImage(atlas.canvas, f.glifo[q] * celda, col * celda, celda, celda, f.x[q] - 3.5, f.y[q] - 3.5, 7, 7);
      } else ctx.fillRect(f.x[q] - s / 2, f.y[q] - s / 2, s, s);
    }
    if (f.modo === 'cede') return;
    // ¿ceder?
    var cerca = mx > f.bx - 30 && mx < f.bx + f.bw + 30 && my > f.by - 30 && my < f.by + f.bh + 30;
    if (f.modo === 'asentada') {
      if (f.op.ceder === false) {
        // formada y quieta: el llamador decide cuándo aparece el vector (FX.particulas.ceder())
        if (!f.avisada) { f.avisada = true; var cb = f.op.alTerminar; f.op.alTerminar = null; if (cb) { try { cb(); } catch (e) { console.error('[particulas] alTerminar', e); } } }
        return;
      }
      if (ahora - f.tAsentada > (f.op.sostener == null ? (f.rapido ? 120 : 250) : f.op.sostener * 1000) && maxV < 0.5) ceder(f);
      return;
    }
    // viva (despertar): cede al quedar quieta y sin cursor encima
    if (maxV < 0.06 && (!cerca || movil)) {
      if (!f.quieto) f.quieto = ahora;
      if (ahora - f.quieto > (movil ? 700 : 1200)) ceder(f);
    } else f.quieto = 0;
  }

  function dispersa(f, ahora) {
    var T = (ahora - f.tDisp) / 1000, dur = f.durDisp, k = clamp(1 - T / dur, 0, 1);
    if (k <= 0) { terminar(f); return; }
    var celda = atlas.celda, col = -1;
    for (var i = 0; i < f.n; i++) {
      f.vx[i] *= 0.96; f.vy[i] *= 0.96; f.vy[i] += 0.04;
      f.x[i] += f.vx[i]; f.y[i] += f.vy[i];
      if (f.col[i] !== col) col = f.col[i];
      ctx.globalAlpha = f.a0[i] * k * k;
      ctx.drawImage(atlas.canvas, f.glifo[i] * celda, col * celda, celda, celda, f.x[i] - 3.5, f.y[i] - 3.5, 7, 7);
    }
  }

  /* ---------------- API ---------------- */
  function disponible() { return !reducido() && !!window.gsap && iniciarCanvas(); }

  function sinCanvas(destino, op) {
    if (destino && destino.style && op && op.ocultarDestino !== false) { destino.style.opacity = ''; }
    if (op && op.alTerminar) setTimeout(op.alTerminar, 0);
  }

  function lanzar(m, destino, op, modo) {
    if (F) terminar(F, true);
    var f = crearFormacion(m, destino, op);
    if (!f.n) { sinCanvas(destino, op); return null; }
    F = f;
    if (modo === 'vuelo') { prepararVuelo(f); }
    else {
      objetivos(f);
      for (var i = 0; i < f.n; i++) { f.x[i] = f.tx[i]; f.y[i] = f.ty[i]; }
      f.modo = modo; f.t0 = performance.now();
    }
    ocultarDestino(f);
    arrancar();
    return f;
  }

  var DESDES = ['pupila', 'disperso', 'marca', 'punto'];
  var API = {
    disponible: disponible,
    desdes: DESDES,
    // capacidades: soporta('marca') · soporta('ceder') · soporta('halo')
    soporta: function (q) { return DESDES.indexOf(q) > -1 || q === 'ceder' || q === 'halo'; },
    activa: function () { return !!F; },

    formarSVG: function (svg, op) {
      op = op || {};
      if (!svg || !disponible()) { sinCanvas(svg, op); return; }
      try {
        lanzar(muestrearSVG(svg), svg, op, 'vuelo');
      } catch (e) { console.error('[particulas] formarSVG', e); sinCanvas(svg, op); }
    },

    formarTexto: function (texto, el, op) {
      op = op || {};
      if (!el || !disponible()) { sinCanvas(el, op); return; }
      try {
        var m = muestrearTexto(texto == null ? el.textContent : String(texto), el);
        var f = lanzar(m, el, op, 'vuelo');
        if (f) { var r = el.getBoundingClientRect(); f.caja = [r.width || 1, r.height || 1]; }
      } catch (e) { console.error('[particulas] formarTexto', e); sinCanvas(el, op); }
    },

    despertar: function (svg, op) {
      op = op || {};
      if (!svg || !disponible()) return false;
      if (F && F.destino === svg) {
        if (F.modo === 'cede') { F.modo = 'viva'; F.quieto = 0; ocultarDestino(F); }
        if (F.modo === 'viva' || F.modo === 'aparece') { F.quieto = 0; if (op.toque) impulso(F, op.x, op.y); }
        arrancar();
        return true;
      }
      if (F && F.modo === 'vuelo') return false;
      try {
        var f = lanzar(muestrearSVG(svg), svg, { ocultarDestino: true, alTerminar: op.alTerminar }, 'aparece');
        if (f && op.toque) impulso(f, op.x, op.y);
        if (window.gsap) { window.gsap.killTweensOf(svg, 'opacity'); window.gsap.set(svg, { opacity: 0 }); }
        return !!f;
      } catch (e) { console.error('[particulas] despertar', e); return false; }
    },

    dispersar: function (op) {
      op = op || {};
      var f = F;
      if (!f) {
        var el = op.svg || op.el;
        if (!el || !disponible()) { if (op.alTerminar) setTimeout(op.alTerminar, 0); return; }
        try { f = lanzar(op.svg ? muestrearSVG(op.svg) : muestrearTexto(op.texto || el.textContent, el), el, { ocultarDestino: op.ocultarDestino !== false }, 'viva'); }
        catch (e) { if (op.alTerminar) setTimeout(op.alTerminar, 0); return; }
        if (!f) return;
      }
      var c = op.desde && typeof op.desde === 'object' ? op.desde : { x: (f.bx || W / 2) + (f.bw || 0) / 2, y: (f.by || H / 2) + (f.bh || 0) / 2 };
      for (var i = 0; i < f.n; i++) {
        var dx = f.x[i] - c.x, dy = f.y[i] - c.y, d = Math.hypot(dx, dy) || 1, v = 4 + Math.random() * 10;
        f.vx[i] = dx / d * v + (Math.random() - 0.5) * 2; f.vy[i] = dy / d * v + (Math.random() - 0.5) * 2;
      }
      f.modo = 'dispersa'; f.tDisp = performance.now(); f.durDisp = op.duracion || 0.9;
      f.op.alTerminar = op.alTerminar || null;
      // el destino: mostrarDestino → aparece ya; dejarOculto → no se restaura; por defecto vuelve al terminar
      if (op.mostrarDestino) mostrarDestino(f, 0.45);
      else if (op.dejarOculto) f.oculto = false;
      arrancar();
    },

    detener: function () { if (F) terminar(F, true); if (hal) hal.n = 0; parar(); limpiar(); },

    // Con formarSVG/formarTexto({ ceder: false }): muestra el destino real y apaga las partículas (fundido 0,45 s)
    ceder: function (alTerminar) {
      if (!F) { if (alTerminar) setTimeout(alTerminar, 0); return; }
      F.op.alTerminar = alTerminar || null;
      if (F.modo === 'vuelo') { for (var j = 0; j < F.n; j++) { F.x[j] = F.tx[j]; F.y[j] = F.ty[j]; } }
      ceder(F); arrancar();
    },

    // Fragmentos que se desprenden del borde del emblema cerca del puntero y orbitan (el vector sigue vivo)
    halo: function (svg, op) {
      op = op || {};
      if (!svg || !disponible() || (F && F.destino === svg)) return false;
      var r = svg.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var ang = op.x == null ? Math.random() * Math.PI * 2 : Math.atan2(op.y - cy, op.x - cx);
      try { emitirHalo(svg, ang, op.cantidad || 3, op.ventana || (op.toque ? 0.9 : 0.42), op.giro || 0); } catch (e) { console.error('[particulas] halo', e); return false; }
      return true;
    },

    // Para precalentar el muestreo (p. ej. tras cargar las fuentes): no dibuja nada
    precalentar: function (svg) { try { if (svg && disponible()) muestrearSVG(svg); } catch (e) { /* nada */ } }
  };

  function impulso(f, px, py) {
    if (px == null) return;
    var R = 64;
    for (var i = 0; i < f.n; i++) {
      var dx = f.x[i] - px, dy = f.y[i] - py, d = Math.hypot(dx, dy);
      if (d < R && d > 0.01) { var fu = (1 - d / R) * 16; f.vx[i] += dx / d * fu; f.vy[i] += dy / d * fu; }
    }
    f.quieto = 0;
  }

  FX.particulas = API;

  FX.registrar('particulas', function (FX) {
    if (FX.estado.reducido) return;
    iniciarCanvas();
    FX.on('redimension', function () { dimensionar(); cacheTexto = {}; });
  }, 80);
})();
