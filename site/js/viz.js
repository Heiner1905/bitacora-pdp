/* ==========================================================================
   viz.js — librería de visualizaciones de los bloques (constructor 2)
   API:  var v = FX.viz.pintar(tipo, contenedor, datos[, opciones]);
         v.entrar();        // anima hasta el estado final (lo llama el ScrollTrigger)
         v.estadoFinal();   // salta al estado final (reduced-motion, impresión)
   opciones: { manual: true } → no crea ScrollTrigger (quien llama decide cuándo entrar)

   Reglas:
   - El DOM se construye ya en su ESTADO FINAL (CSS). Con movimiento, preparar()
     pone el estado inicial en estilos en línea y entrar() anima hasta el final;
     estadoFinal() mata los tweens y limpia esos estilos (el CSS vuelve a mandar).
   - Un valor null o "[PENDIENTE…]" nunca se anima ni se escribe: se pinta con
     FX.pintar y su estructura se dibuja vacía en acero punteado.
   - Modo de prueba: ?demo-viz en la URL → FX.viz.muestra(tipo) da datos de
     MUESTRA (los usa semana.js y los rotula). Nunca en el modo normal.
   ========================================================================== */
(function () {
  'use strict';
  var FX = window.FX;
  if (!FX) return;

  var NS = 'http://www.w3.org/2000/svg';
  var instancias = [];
  var listo = false;
  var pendientesDeListo = [];

  FX.on('listo', function () {
    listo = true;
    pendientesDeListo.splice(0).forEach(function (fn) { fn(); });
  });
  function cuandoListo(fn) { if (listo || document.documentElement.classList.contains('fx-listo')) fn(); else pendientesDeListo.push(fn); }

  /* ---------- utilidades ---------- */
  function vacio(v) { return v == null || v === '' || FX.esPendiente(v); }
  function el(tag, clase, padre, texto) {
    var e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto != null) e.textContent = texto;
    if (padre) padre.appendChild(e);
    return e;
  }
  function svg(tag, attrs, padre) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (padre) padre.appendChild(e);
    return e;
  }
  function pintar(tag, clase, padre, valor) { return FX.pintar(el(tag, clase, padre), valor); }
  function hayMovimiento() { return !!window.gsap && !FX.estado.reducido; }
  function finoYMovimiento() { return hayMovimiento() && FX.estado.punteroFino; }
  // Formato es-CO: miles con espacio fino no separable, decimales con coma
  function formato(v, dec) {
    var partes = Math.abs(v).toFixed(dec || 0).split('.');
    return (v < 0 ? '−' : '') + partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (dec ? ',' + partes[1] : '');
  }
  function decimales(v) { var s = String(v); return s.indexOf('.') > -1 ? Math.min(2, s.split('.')[1].length) : 0; }
  function limpiar(nodos) {
    var g = window.gsap;
    if (!g || !nodos || !nodos.length) return;
    g.killTweensOf(nodos);
    g.set(nodos, { clearProps: 'transform,opacity,visibility,clipPath,backgroundSize,strokeDasharray,strokeDashoffset,scale' });
  }
  function arr(x) { return Array.isArray(x) ? x : []; }
  // gsap.set sin avisos cuando la lista está vacía
  function poner(n, v) { if (n && (!('length' in n) || n.length)) gsap.set(n, v); }

  /* ======================================================================
     Fábricas: cada una construye el DOM final y devuelve
     { animables: [nodos con estilos en línea], preparar(), entrar(), final() }
     ====================================================================== */
  var T = {};

  /* ---------- texto: párrafos de lectura (separados por línea en blanco), se revelan por líneas con máscara ---------- */
  T.texto = function (c, d) {
    var real = !vacio(d.texto);
    var trozos = real ? String(d.texto).split(/\n\s*\n/).map(function (t) { return t.trim(); }).filter(Boolean) : [d.texto];
    var ps = trozos.map(function (t) { return pintar('p', 'viz-texto t-lectura', c, t); });
    var split = null;
    return {
      animables: real ? ps : [],
      // se oculta y se divide en líneas al ENTRAR (las fuentes ya cargaron y el ancho es el real)
      preparar: function () { if (real) gsap.set(ps, { autoAlpha: 0 }); },
      entrar: function () {
        if (!real) return;
        if (!window.SplitText) { gsap.to(ps, { autoAlpha: 1, duration: 0.6 }); return; }
        split = window.SplitText.create(ps, { type: 'lines', mask: 'lines', linesClass: 'viz-linea' });
        gsap.set(split.lines, { yPercent: 105 });
        gsap.set(ps, { autoAlpha: 1 });
        gsap.to(split.lines, { yPercent: 0, duration: 1.05, ease: 'expo.out', stagger: 0.075,
          onComplete: function () { if (split) { split.revert(); split = null; } } });
      },
      final: function () { if (split) { gsap.killTweensOf(split.lines); split.revert(); split = null; } }
    };
  };

  /* ---------- tachado: el «antes» se tacha y el «después» lo reemplaza ---------- */
  T.tachado = function (c, d) {
    var ol = el('ol', 'tachado', c);
    var lineas = [], despues = [];
    arr(d.pares).forEach(function (par) {
      var li = el('li', 'tachado__par', ol);
      var real = !vacio(par.antes) && !vacio(par.despues);
      li.classList.toggle('tachado__par--vacio', !real);
      var a = el('p', 'tachado__antes', li);
      el('span', 'sr-only', a, 'Antes: ');
      var linea = pintar('span', 'tachado__texto', a, par.antes);
      if (!vacio(par.antes)) { linea.classList.add('tachado__tachar'); if (real) lineas.push(linea); }
      el('span', 'tachado__guia', li).setAttribute('aria-hidden', 'true');
      var b = el('p', 'tachado__despues', li);
      el('span', 'sr-only', b, 'Ahora: ');
      var dd = pintar('span', 'tachado__nuevo', b, par.despues);
      if (real) despues.push(dd);
    });
    var animables = lineas.concat(despues);
    var tl;
    return {
      animables: animables,
      preparar: function () {
        poner(lineas, { backgroundSize: '0% var(--grosor-tachado)' });
        poner(despues, { clipPath: 'inset(-10% 100% -20% 0%)' });
      },
      entrar: function () {
        tl = gsap.timeline();
        lineas.forEach(function (l, i) {
          tl.to(l, { backgroundSize: '100% var(--grosor-tachado)', duration: 0.9, ease: 'power2.inOut' }, i * 0.35)
            .to(despues[i], { clipPath: 'inset(-10% 0% -20% 0%)', duration: 1.1, ease: 'expo.out' }, i * 0.35 + 0.55);
        });
      },
      final: function () { if (tl) tl.kill(); }
    };
  };

  /* ---------- checklist: chulos que se dibujan (contorno → marca) ---------- */
  T.checklist = function (c, d) {
    var ul = el('ul', 'checklist', c);
    var filas = [];
    arr(d.items).forEach(function (txt) {
      var li = el('li', 'check', ul);
      var real = !vacio(txt);
      li.classList.toggle('check--vacio', !real);
      var s = svg('svg', { viewBox: '0 0 44 44', 'aria-hidden': 'true', focusable: 'false', 'class': 'check__marca' }, li);
      var circ = svg('circle', { cx: 22, cy: 22, r: 19, 'class': real ? 'check__aro viz-trazo' : 'check__aro' }, s);
      var marca = real ? svg('path', { d: 'M13 23 L20 30 L32 15', 'class': 'check__chulo viz-trazo' }, s) : null;
      var t = pintar('span', 'check__texto', li, txt);
      if (real) filas.push({ circ: circ, marca: marca, t: t });
    });
    var tl;
    var anim = [];
    filas.forEach(function (f) { anim.push(f.circ, f.marca, f.t); });
    return {
      animables: anim,
      preparar: function () {
        filas.forEach(function (f) {
          gsap.set([f.circ, f.marca], { drawSVG: '0%' });
          gsap.set(f.t, { clipPath: 'inset(-20% 100% -20% 0%)' });
        });
      },
      entrar: function () {
        tl = gsap.timeline();
        filas.forEach(function (f, i) {
          var t0 = i * 0.28;
          tl.to(f.circ, { drawSVG: '100%', duration: 0.8, ease: 'power2.inOut' }, t0)
            .to(f.marca, { drawSVG: '100%', duration: 0.45, ease: 'power3.out' }, t0 + 0.55)
            .to(f.t, { clipPath: 'inset(-20% 0% -20% 0%)', duration: 0.9, ease: 'expo.out' }, t0 + 0.3);
        });
      },
      final: function () { if (tl) tl.kill(); }
    };
  };

  /* ---------- imagen: evidencia real o marco vacío pendiente ---------- */
  T.imagen = function (c, d) {
    var fig = el('figure', 'imagen', c);
    var real = !vacio(d.src);
    var marco = el('div', 'imagen__marco', fig);
    var img = null;
    if (real) {
      img = el('img', 'imagen__img', marco);
      img.src = d.src; img.alt = vacio(d.alt) ? '' : d.alt; img.loading = 'lazy'; img.decoding = 'async';
      img.addEventListener('load', function () { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); }, { once: true });
      if (!vacio(d.alt)) el('figcaption', 'imagen__pie', fig, d.alt);
    } else {
      fig.classList.add('imagen--vacia');
      marco.setAttribute('aria-hidden', 'true');
      ['tl', 'tr', 'bl', 'br'].forEach(function (k) { el('i', 'imagen__esquina imagen__esquina--' + k, marco); });
      el('i', 'imagen__mira', marco);
      pintar('figcaption', 'imagen__pie', fig, vacio(d.alt) ? '[PENDIENTE: imagen]' : d.alt);
      if (!FX.esPendiente(d.alt) && !vacio(d.alt)) fig.querySelector('.imagen__pie').insertAdjacentText('afterbegin', '[PENDIENTE: imagen] ');
    }
    var tl;
    return {
      animables: real ? [marco, img] : [],
      preparar: function () {
        if (!real) return;
        gsap.set(marco, { clipPath: 'inset(0% 0% 100% 0%)' });
        gsap.set(img, { scale: 1.18 });
      },
      entrar: function () {
        if (!real) return;
        tl = gsap.timeline()
          .to(marco, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut' })
          .to(img, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0.2);
      },
      final: function () { if (tl) tl.kill(); if (img) img.loading = 'eager'; }
    };
  };

  /* ---------- escalera: columnas que suben en escalera ---------- */
  T.escalera = function (c, d) {
    var wrap = el('div', 'escalera', c);
    var items = arr(d.items);
    var valores = items.map(function (it) { return typeof it.valor === 'number' ? it.valor : null; });
    // La escala es datos.maximo si viene (p. ej. «Nivel de 1 a 4»); si no, el mayor valor
    var max = typeof d.maximo === 'number' && d.maximo > 0 ? d.maximo : Math.max.apply(null, valores.filter(function (v) { return v != null; }).concat([0]));
    pintar('p', 'escalera__unidad', wrap, d.unidad);
    var ol = el('ol', 'escalera__cols', wrap);
    wrap.style.setProperty('--n', Math.max(1, items.length));
    // Muchas columnas (> 6) no caben con sus etiquetas: se pintan como filas (etiqueta | pista),
    // y si hay escala fija (datos.maximo ≤ 10) la pista se divide en sus niveles.
    var filas = items.length > 6;
    var escala = typeof d.maximo === 'number' && d.maximo > 0 && d.maximo <= 10 && d.maximo % 1 === 0 ? d.maximo : 0;
    wrap.classList.toggle('escalera--filas', filas);
    if (escala) { wrap.classList.add('escalera--escala'); wrap.style.setProperty('--max', escala); }
    var barras = [], cifras = [];
    items.forEach(function (it, i) {
      var li = el('li', 'col', ol);
      var v = valores[i];
      var real = v != null && max > 0;
      li.classList.toggle('col--vacia', !real);
      li.classList.toggle('col--tope', real && v === max);
      li.style.setProperty('--h', real ? Math.max(0.08, v / max).toFixed(4) : 1);
      var pista = el('div', 'col__pista', li);
      pista.setAttribute('aria-hidden', 'true');
      var barra = el('div', 'col__barra', pista);
      var cifra = el('span', 'col__valor', barra);
      if (real) { cifra.textContent = formato(v, decimales(v)); barras.push(barra); cifras.push({ el: cifra, v: v }); }
      var et = pintar('p', 'col__etiqueta', li, it.etiqueta);
      var sr = el('span', 'sr-only', null, real ? ': ' + formato(v, decimales(v)) : ': sin valor todavía');
      et.appendChild(sr);
      if (it.nota !== '') pintar('p', 'col__nota', li, it.nota);
    });
    if (filas && escala) {
      var reg = el('div', 'escalera__escala', wrap);
      reg.setAttribute('aria-hidden', 'true');
      for (var e = 1; e <= escala; e++) el('span', null, reg, String(e));
    }
    var tl;
    var vertical = function () { return filas || window.matchMedia('(max-width: 599px)').matches; };
    return {
      animables: barras,
      preparar: function () {
        poner(barras, { clipPath: vertical() ? 'inset(0% 100% 0% 0%)' : 'inset(100% 0% 0% 0%)' });
      },
      entrar: function () {
        tl = gsap.timeline();
        barras.forEach(function (b, i) {
          tl.to(b, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.out' }, i * 0.18);
          var o = { v: 0 }, cf = cifras[i], dec = decimales(cf.v);
          tl.to(o, { v: cf.v, duration: 1.2, ease: 'expo.out', onUpdate: function () { cf.el.textContent = formato(o.v, dec); } }, i * 0.18);
        });
      },
      final: function () {
        if (tl) tl.kill();
        cifras.forEach(function (cf) { cf.el.textContent = formato(cf.v, decimales(cf.v)); });
      }
    };
  };

  /* ---------- tarjetas: inclinación 3D al cursor y brillo que sigue el puntero ---------- */
  T.tarjetas = function (c, d) {
    var ul = el('ul', 'tarjetas', c);
    ul.setAttribute('data-tono', d.tono === 'mejora' ? 'mejora' : 'fortaleza');
    var items = arr(d.items);
    ul.style.setProperty('--n', items.length);
    ul.setAttribute('data-n', items.length);
    var tarjetas = [];
    items.forEach(function (it, i) {
      var li = el('li', 'tarjeta', ul);
      var real = !vacio(it.nombre) || !vacio(it.texto);
      li.classList.toggle('tarjeta--vacia', vacio(it.nombre) && vacio(it.texto));
      el('span', 'tarjeta__brillo', li).setAttribute('aria-hidden', 'true');
      var cara = el('div', 'tarjeta__cara', li);
      pintar('h4', 'tarjeta__nombre', cara, it.nombre);
      pintar('p', 'tarjeta__texto', cara, it.texto);
      tarjetas.push(li);
      void real;
    });
    // Inclinación (solo puntero fino y con movimiento)
    if (finoYMovimiento()) {
      tarjetas.forEach(function (card) {
        var rx, ry, rect = null;
        card.addEventListener('pointerenter', function () {
          rect = card.getBoundingClientRect();
          gsap.set(card, { transformPerspective: 900 });
          if (!rx) {
            rx = gsap.quickTo(card, 'rotationX', { duration: 0.45, ease: 'power3' });
            ry = gsap.quickTo(card, 'rotationY', { duration: 0.45, ease: 'power3' });
          }
          card.classList.add('tarjeta--viva');
        });
        card.addEventListener('pointermove', function (e) {
          if (!rect || card.dataset.entrando) return;
          var x = (e.clientX - rect.left) / rect.width, y = (e.clientY - rect.top) / rect.height;
          rx((0.5 - y) * 14); ry((x - 0.5) * 14);
          card.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
          card.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
        });
        card.addEventListener('pointerleave', function () { if (rx) { rx(0); ry(0); } card.classList.remove('tarjeta--viva'); rect = null; });
      });
    }
    var tl;
    return {
      animables: tarjetas,
      preparar: function () {
        poner(tarjetas, { transformPerspective: 900, transformOrigin: '50% 0%', rotationX: -62, autoAlpha: 0, y: 40 });
        tarjetas.forEach(function (t) { t.dataset.entrando = '1'; });
      },
      entrar: function () {
        tl = gsap.to(tarjetas, { rotationX: 0, y: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out', stagger: 0.11,
          onComplete: function () { tarjetas.forEach(function (t) { delete t.dataset.entrando; }); gsap.set(tarjetas, { clearProps: 'opacity,visibility,y' }); } });
      },
      final: function () { if (tl) tl.kill(); tarjetas.forEach(function (t) { delete t.dataset.entrando; }); }
    };
  };

  /* ---------- anillos: D/I/S/C concéntricos que se llenan ---------- */
  T.anillos = function (c, d) {
    var wrap = el('div', 'anillos', c);
    var dims = arr(d.dimensiones);
    var maximo = typeof d.maximo === 'number' && d.maximo > 0 ? d.maximo : null;
    var valores = dims.map(function (x) { return typeof x.valor === 'number' && maximo ? x.valor : null; });
    var mayor = Math.max.apply(null, valores.filter(function (v) { return v != null; }).concat([-Infinity]));
    var s = svg('svg', { viewBox: '0 0 240 240', 'class': 'anillos__svg', 'aria-hidden': 'true', focusable: 'false' }, wrap);
    var arcos = [], cifras = [];
    var R0 = 104, PASO = 19;
    dims.forEach(function (dim, i) {
      var r = R0 - i * PASO, v = valores[i];
      var real = v != null;
      svg('circle', { cx: 120, cy: 120, r: r, 'class': real ? 'anillo__pista' : 'anillo__pista anillo__pista--vacia' }, s);
      if (real) {
        var p = Math.max(0, Math.min(1, v / maximo));
        var largo = 2 * Math.PI * r;
        var a = svg('circle', { cx: 120, cy: 120, r: r, transform: 'rotate(-90 120 120)',
          'class': 'anillo__valor' + (v === mayor ? ' anillo__valor--mayor' : ''),
          'stroke-dasharray': (largo * p).toFixed(2) + ' ' + largo.toFixed(2) }, s);
        arcos.push({ el: a, p: p });
      }
      // letra sobre el inicio de cada anillo
      var t = svg('text', { x: 113, y: 120 - r + 3.5, 'text-anchor': 'end', 'class': 'anillo__letra' }, s);
      t.textContent = dim.letra || '';
    });
    var dl = el('dl', 'anillos__leyenda', wrap);
    dims.forEach(function (dim, i) {
      var fila = el('div', 'anillos__fila' + (valores[i] != null && valores[i] === mayor ? ' anillos__fila--mayor' : ''), dl);
      var dt = el('dt', 'anillos__dim', fila);
      el('span', 'anillos__letra', dt, dim.letra || '');
      pintar('span', 'anillos__nombre', dt, dim.nombre);
      var dd = el('dd', 'anillos__valor', fila);
      if (valores[i] != null) {
        var n = el('span', 'anillos__cifra', dd, formato(valores[i], decimales(valores[i])));
        el('span', 'anillos__max', dd, ' / ' + formato(maximo, 0));
        cifras.push({ el: n, v: valores[i] });
      } else {
        FX.pintar(dd, valores[i] == null && dim.valor != null && !maximo ? dim.valor : null);
      }
    });
    var tl;
    return {
      animables: arcos.map(function (a) { return a.el; }),
      preparar: function () { arcos.forEach(function (a) { gsap.set(a.el, { drawSVG: '0%' }); }); },
      entrar: function () {
        tl = gsap.timeline();
        arcos.forEach(function (a, i) {
          tl.to(a.el, { drawSVG: '0% ' + (a.p * 100).toFixed(2) + '%', duration: 1.8, ease: 'expo.out' }, i * 0.18);
        });
        cifras.forEach(function (cf, i) {
          var o = { v: 0 }, dec = decimales(cf.v);
          tl.to(o, { v: cf.v, duration: 1.8, ease: 'expo.out', onUpdate: function () { cf.el.textContent = formato(o.v, dec); } }, i * 0.18);
        });
      },
      final: function () {
        if (tl) tl.kill();
        cifras.forEach(function (cf) { cf.el.textContent = formato(cf.v, decimales(cf.v)); });
      }
    };
  };

  /* ---------- waffle: rejilla 10×10 que se llena en barrido ---------- */
  T.waffle = function (c, d) {
    var wrap = el('div', 'waffle', c);
    var total = typeof d.total === 'number' && d.total > 0 ? d.total : null;
    var valor = typeof d.valor === 'number' && total ? d.valor : null;
    var real = valor != null;
    wrap.classList.toggle('waffle--vacio', !real);
    var celdas = total && total <= 100 ? total : 100;
    var llenas = real ? Math.round(Math.max(0, Math.min(1, valor / total)) * celdas) : 0;
    var rej = el('div', 'waffle__rejilla', wrap);
    rej.setAttribute('role', 'img');
    rej.setAttribute('aria-label', real ? formato(valor, decimales(valor)) + ' de ' + formato(total, 0) : 'Rejilla vacía: valor pendiente');
    var on = [];
    for (var i = 0; i < celdas; i++) {
      var cel = el('span', 'celda' + (i < llenas ? ' celda--on' : ''), rej);
      if (i < llenas) on.push(cel);
    }
    var lado = el('div', 'waffle__lado', wrap);
    var cifra = el('p', 'waffle__cifra', lado);
    var num = null;
    if (real) {
      num = el('span', 'waffle__num', cifra, formato(valor, decimales(valor)));
      el('span', 'waffle__de t-dato', cifra, 'de ' + formato(total, 0));
    } else FX.pintar(cifra, null);
    pintar('p', 'waffle__etiqueta', lado, d.etiqueta);
    pintar('p', 'waffle__texto', lado, d.texto);
    var tl;
    return {
      animables: on,
      preparar: function () { if (real) poner(on, { scale: 0 }); },
      entrar: function () {
        if (!real) return;
        var o = { v: 0 }, dec = decimales(valor);
        tl = gsap.timeline()
          .to(on, { scale: 1, duration: 0.5, ease: 'back.out(2)', stagger: { amount: Math.min(1.6, on.length * 0.025), grid: [Math.ceil(celdas / 10), 10], from: 'start', axis: 'x' } })
          .to(o, { v: valor, duration: 1.5, ease: 'expo.out', onUpdate: function () { num.textContent = formato(o.v, dec); } }, 0);
      },
      final: function () { if (tl) tl.kill(); if (num) num.textContent = formato(valor, decimales(valor)); }
    };
  };

  /* ---------- flujo: nodos S→T→A→R con pulsos que viajan ---------- */
  T.flujo = function (c, d) {
    var ol = el('ol', 'flujo', c);
    var pasos = arr(d.pasos);
    ol.style.setProperty('--n', Math.max(1, pasos.length));
    var nodos = [], conectores = [], viajeros = [];
    pasos.forEach(function (p, i) {
      var li = el('li', 'paso', ol);
      var real = !vacio(p.texto);
      li.classList.toggle('paso--vacio', !real);
      var nodo = el('div', 'paso__nodo', li);
      nodo.setAttribute('aria-hidden', 'true');
      el('span', 'paso__letra', nodo, p.letra || '');
      nodos.push(nodo);
      if (i < pasos.length - 1) {
        var siguienteReal = !vacio((pasos[i + 1] || {}).texto);
        var con = el('span', 'paso__conector' + (real && siguienteReal ? '' : ' paso__conector--vacio'), li);
        con.setAttribute('aria-hidden', 'true');
        conectores.push(con);
        if (real && siguienteReal) {
          for (var k = 0; k < 3; k++) { var v = el('i', 'paso__viajero', con); el('b', null, v); viajeros.push({ el: v, k: k }); }
        }
      }
      var txt = el('div', 'paso__cuerpo', li);
      var nombre = pintar('p', 'paso__nombre t-dato', txt, p.nombre);
      if (p.letra && !vacio(p.nombre)) nombre.setAttribute('aria-label', p.nombre + ' (' + p.letra + ')');
      pintar('p', 'paso__texto', txt, p.texto);
    });
    var tl, bucle = null, st = null;
    function iniciarBucle() {
      if (!viajeros.length || !hayMovimiento() || bucle) return;
      var vert = window.matchMedia('(max-width: 599px)').matches;
      bucle = gsap.timeline({ repeat: -1 });
      viajeros.forEach(function (v) {
        var prop = vert ? 'yPercent' : 'xPercent';
        var a = {}, b = {}; a[prop] = 0; b[prop] = 100;
        bucle.fromTo(v.el, Object.assign({ opacity: 0 }, a), Object.assign({ duration: 1.8, ease: 'none' }, b), v.k * 0.6)
             .to(v.el, { opacity: 1, duration: 0.27, ease: 'none' }, v.k * 0.6)
             .to(v.el, { opacity: 0, duration: 0.27, ease: 'none' }, v.k * 0.6 + 1.53);
      });
      // pausado fuera de la vista
      if (window.ScrollTrigger) {
        st = window.ScrollTrigger.create({ trigger: ol, start: 'top bottom', end: 'bottom top',
          onToggle: function (s) { if (bucle) s.isActive ? bucle.resume() : bucle.pause(); } });
        if (!st.isActive) bucle.pause();
      }
    }
    return {
      animables: nodos.concat(conectores),
      preparar: function () {
        poner(nodos, { scale: 0.4, autoAlpha: 0 });
        poner(conectores, { scaleX: 0, scaleY: 0 });
      },
      entrar: function () {
        var vert = window.matchMedia('(max-width: 599px)').matches;
        poner(conectores, vert ? { scaleX: 1 } : { scaleY: 1 });
        tl = gsap.timeline({ onComplete: iniciarBucle });
        nodos.forEach(function (n, i) {
          tl.to(n, { scale: 1, autoAlpha: 1, duration: 0.7, ease: 'back.out(1.8)' }, i * 0.42);
          if (conectores[i]) tl.to(conectores[i], vert ? { scaleY: 1, duration: 0.5, ease: 'power2.inOut' } : { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, i * 0.42 + 0.22);
        });
      },
      final: function () {
        if (tl) tl.kill();
        if (bucle) { bucle.kill(); bucle = null; }
        if (st) { st.kill(); st = null; }
        poner(viajeros.map(function (v) { return v.el; }), { clearProps: 'all' });
        if (!FX.estado.reducido && !window.matchMedia('print').matches && c.dataset.vizListo) iniciarBucle();
      }
    };
  };

  /* ---------- maquina: escritura tipo máquina con cursor ---------- */
  T.maquina = function (c, d) {
    var wrap = el('div', 'maquina', c);
    var real = !vacio(d.texto);
    if (!real) { pintar('p', 'maquina__linea', wrap, d.texto); return { animables: [], preparar: function () {}, entrar: function () {}, final: function () {} }; }
    var texto = String(d.texto);
    el('p', 'sr-only', wrap, texto);
    var linea = el('p', 'maquina__linea', wrap);
    linea.setAttribute('aria-hidden', 'true');
    var escrito = el('span', 'maquina__escrito', linea, texto);
    var cursor = el('span', 'maquina__cursor', linea);
    var fantasma = el('span', 'maquina__fantasma', linea, '');
    var tw;
    function escribir(n) { escrito.textContent = texto.slice(0, n); fantasma.textContent = texto.slice(n); }
    return {
      animables: [cursor],
      preparar: function () { escribir(0); wrap.classList.add('maquina--espera'); },
      entrar: function () {
        wrap.classList.remove('maquina--espera');
        wrap.classList.add('maquina--escribiendo');
        var o = { n: 0 }, ultimo = -1;
        var dur = Math.max(0.8, Math.min(5, texto.length * 0.032));
        tw = gsap.to(o, { n: texto.length, duration: dur, ease: 'none',
          onUpdate: function () { var n = Math.round(o.n); if (n !== ultimo) { ultimo = n; escribir(n); } },
          onComplete: function () { wrap.classList.remove('maquina--escribiendo'); wrap.classList.add('maquina--hecha'); } });
      },
      final: function () {
        if (tw) tw.kill();
        escribir(texto.length);
        wrap.classList.remove('maquina--espera', 'maquina--escribiendo');
        wrap.classList.add('maquina--hecha');
      }
    };
  };

  /* ---------- contador: cifras que cuentan hasta su valor ---------- */
  T.contador = function (c, d) {
    var ul = el('ul', 'contador', c);
    var cifras = [];
    arr(d.items).forEach(function (it) {
      var li = el('li', 'cifra', ul);
      var real = typeof it.valor === 'number';
      li.classList.toggle('cifra--vacia', !real);
      var v = el('p', 'cifra__valor', li);
      if (real) {
        var dec = decimales(it.valor);
        var n = el('span', 'cifra__num', v, formato(it.valor, dec));
        n.setAttribute('aria-hidden', 'true');
        el('span', 'sr-only', v, formato(it.valor, dec));
        n.style.minWidth = formato(it.valor, dec).length + 'ch';
        cifras.push({ el: n, v: it.valor, dec: dec });
      } else {
        el('span', 'cifra__hueco', v).setAttribute('aria-hidden', 'true');
        FX.pintar(el('span', 'cifra__pendiente', v), FX.esPendiente(it.valor) ? it.valor : null);
      }
      pintar('p', 'cifra__etiqueta', li, it.etiqueta);
    });
    var tl;
    return {
      animables: [],
      preparar: function () { cifras.forEach(function (cf) { cf.el.textContent = formato(0, cf.dec); }); },
      entrar: function () {
        tl = gsap.timeline();
        cifras.forEach(function (cf, i) {
          var o = { v: 0 };
          tl.to(o, { v: cf.v, duration: 2, ease: 'expo.out', onUpdate: function () { cf.el.textContent = formato(o.v, cf.dec); } }, i * 0.2);
        });
      },
      final: function () { if (tl) tl.kill(); cifras.forEach(function (cf) { cf.el.textContent = formato(cf.v, cf.dec); }); }
    };
  };

  /* ======================================================================
     API pública
     ====================================================================== */
  function pintarViz(tipo, contenedor, datos, opciones) {
    opciones = opciones || {};
    var fab = T[tipo] || T.texto;
    contenedor.classList.add('viz', 'viz--' + (T[tipo] ? tipo : 'texto'));
    contenedor.setAttribute('data-viz', tipo);
    var inst;
    try { inst = fab(contenedor, datos || {}); }
    catch (e) { console.error('[viz] no se pudo pintar «' + tipo + '»', e); return { entrar: function () {}, estadoFinal: function () {} }; }

    var hecho = false;
    var api = {
      tipo: tipo,
      entrar: function () {
        if (hecho) return; hecho = true;
        contenedor.dataset.vizListo = '1';
        if (!hayMovimiento()) { api.estadoFinal(); return; }
        try { inst.entrar(); } catch (e) { console.error(e); api.estadoFinal(); }
      },
      estadoFinal: function () {
        hecho = true;
        contenedor.dataset.vizListo = '1';
        try { inst.final(); } catch (e) { console.error(e); }
        limpiar(inst.animables.filter(Boolean));
      }
    };
    instancias.push(api);

    if (hayMovimiento()) {
      try { inst.preparar(); } catch (e) { console.error(e); }
      if (!opciones.manual) {
        cuandoListo(function () {
          if (hecho) return;
          if (!window.ScrollTrigger) { api.entrar(); return; }
          var st = window.ScrollTrigger.create({ trigger: contenedor, start: 'top 82%', once: true, onEnter: api.entrar });
          // Si ya quedó atrás (ancla, recarga a mitad de página), que se vea entrando ya
          if (st && st.progress > 0) api.entrar();
        });
      }
    } else {
      api.estadoFinal();
    }
    return api;
  }

  /* Datos de MUESTRA (solo con ?demo-viz). Rotulados: no son de Heiner. */
  var MUESTRA = {
    texto: { texto: 'Texto de muestra para revisar la lectura: este párrafo existe solo para ver cómo se revela un bloque de texto real por líneas, con su máscara, cuando entra en pantalla. No es contenido de la bitácora.' },
    tachado: { pares: [
      { antes: 'Muestra: así se ve el antes que se tacha', despues: 'Muestra: así se ve el después que lo reemplaza' },
      { antes: 'Segunda frase de muestra (antes)', despues: 'Segunda frase de muestra (después)' }
    ] },
    checklist: { items: ['Ítem de muestra número uno', 'Ítem de muestra con un texto un poco más largo para ver el salto de línea', 'Ítem de muestra número tres'] },
    imagen: { src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><rect width="800" height="500" fill="#1B1E25"/><g stroke="#5D6672" stroke-width="1">' + (function () { var s = ''; for (var x = 0; x <= 800; x += 40) s += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="500"/>'; for (var y = 0; y <= 500; y += 40) s += '<line x1="0" y1="' + y + '" x2="800" y2="' + y + '"/>'; return s; })() + '</g><text x="400" y="262" fill="#DCE1E6" font-family="monospace" font-size="28" text-anchor="middle" letter-spacing="6">IMAGEN DE MUESTRA</text></svg>'), alt: 'Imagen de muestra (rejilla gris con el rótulo «imagen de muestra»)' },
    escalera: { unidad: 'Unidad de muestra', items: [
      { etiqueta: 'Muestra A', valor: 2, nota: 'Nota de muestra' },
      { etiqueta: 'Muestra B', valor: 4, nota: 'Nota de muestra' },
      { etiqueta: 'Muestra C', valor: 6, nota: 'Nota de muestra' },
      { etiqueta: 'Muestra D', valor: 9, nota: 'Nota de muestra' }
    ] },
    tarjetas: { tono: 'fortaleza', items: [
      { nombre: 'Muestra uno', texto: 'Texto de muestra de la tarjeta, para ver la inclinación y el brillo.' },
      { nombre: 'Muestra dos', texto: 'Texto de muestra de la tarjeta.' },
      { nombre: 'Muestra tres', texto: 'Texto de muestra de la tarjeta con algo más de largo para ver cómo crece.' },
      { nombre: 'Muestra cuatro', texto: 'Texto de muestra de la tarjeta.' },
      { nombre: 'Muestra cinco', texto: 'Texto de muestra de la tarjeta.' }
    ] },
    anillos: { maximo: 100, dimensiones: [
      { letra: 'D', nombre: 'Dominancia', valor: 40 }, { letra: 'I', nombre: 'Influencia', valor: 70 },
      { letra: 'S', nombre: 'Estabilidad', valor: 25 }, { letra: 'C', nombre: 'Cumplimiento', valor: 55 }
    ] },
    waffle: { total: 100, valor: 37, etiqueta: 'Etiqueta de muestra', texto: 'Texto de muestra que explica la proporción.' },
    flujo: { pasos: [
      { letra: 'S', nombre: 'Situación', texto: 'Texto de muestra de la situación.' },
      { letra: 'T', nombre: 'Tarea', texto: 'Texto de muestra de la tarea.' },
      { letra: 'A', nombre: 'Acción', texto: 'Texto de muestra de la acción.' },
      { letra: 'R', nombre: 'Resultado', texto: 'Texto de muestra del resultado.' }
    ] },
    maquina: { texto: 'Frase de muestra que se escribe sola, letra por letra, para revisar la máquina de escribir.' },
    contador: { items: [{ valor: 12, etiqueta: 'Cifra de muestra' }, { valor: 1450, etiqueta: 'Otra cifra de muestra' }] }
  };

  var demo = /[?&]demo-viz\b/.test(location.search);

  FX.viz = {
    pintar: pintarViz,
    tipos: Object.keys(T),
    demo: demo,
    muestra: function (tipo, original) {
      var m = MUESTRA[tipo] ? JSON.parse(JSON.stringify(MUESTRA[tipo])) : null;
      if (m && tipo === 'tarjetas' && original && original.tono) m.tono = original.tono;
      if (m && tipo === 'tarjetas' && original && original.items) m.items = m.items.slice(0, original.items.length || 5);
      return m;
    },
    todas: instancias,
    formato: formato
  };

  // Impresión: todo a su estado final
  window.addEventListener('beforeprint', function () { instancias.forEach(function (v) { v.estadoFinal(); }); });

  FX.registrar('viz', function () {
    if (window.ScrollTrigger) cuandoListo(function () { window.ScrollTrigger.refresh(); });
  }, 40);
})();
