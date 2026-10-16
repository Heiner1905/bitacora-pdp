/* ==========================================================================
   indice.js — constructor 4 (docs/DIRECCION.md §9)
   El índice es un ANILLO DE N ARCOS (N = BITACORA.semanas.length), como el
   dial del emblema: cada arco es una semana con su estado (completada hielo
   lleno · en curso rubí · pendiente acero punteado) y la semana donde está el
   lector se marca con el índice del dial (el punto escarcha que gira).
   - Diálogo accesible: role="dialog", aria-modal, foco atrapado, Esc cierra y
     devuelve el foco al botón que lo abrió; el resto de la página queda inert.
   - Teclado: la lista ordenada de enlaces es la interfaz real (lectores de
     pantalla + flechas ↑↓←→, Inicio, Fin); el anillo la refleja arco a arco.
   - Ratón: hover sobre un arco lo ilumina y muestra número y título; clic navega.
   - Entrada: el velo se abre desde el botón, el anillo se DIBUJA en el sentido
     del reloj (máscara + DrawSVG) y el índice del dial gira hasta la semana.
     Con reduced-motion: aparece y desaparece sin movimiento.
   API: FX.indice = { abrir(origen), cerrar(), abierto() }
   ========================================================================== */
(function () {
  'use strict';
  if (!window.FX) return;

  var NS = 'http://www.w3.org/2000/svg';
  var C = 200, R = 150;              // centro y radio de los arcos (viewBox -14 -14 428 428)
  var ESTADOS = { completada: 'Completada', 'en-curso': 'En curso', pendiente: 'Pendiente' };

  function pt(a, r) {                // a en grados, sentido del reloj desde las 12
    var t = a * Math.PI / 180;
    return [(C + r * Math.sin(t)).toFixed(2), (C - r * Math.cos(t)).toFixed(2)];
  }
  function arco(a0, a1, r) {
    var p0 = pt(a0, r), p1 = pt(a1, r);
    return 'M' + p0[0] + ' ' + p0[1] + ' A' + r + ' ' + r + ' 0 ' + (a1 - a0 > 180 ? 1 : 0) + ' 1 ' + p1[0] + ' ' + p1[1];
  }
  function svg(tag, attrs, padre) {
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    if (padre) padre.appendChild(el);
    return el;
  }

  FX.registrar('indice', function (FX) {
    var raiz = FX.$('#indice');
    if (!raiz) return;
    var gsap = window.gsap;
    var semanas = (FX.datos && FX.datos.semanas) || [];
    var N = semanas.length;
    var html = document.documentElement;
    var hueco = N > 1 ? Math.min(6, 120 / N) : 0;
    var paso = N ? 360 / N : 360;

    function estadoDe(s) { return ESTADOS[s.estado] ? s.estado : 'pendiente'; }
    function centroDe(k) { return (k - 0.5) * paso; }           // ángulo central del arco k (1..N)

    /* ---------- DOM ---------- */
    raiz.setAttribute('role', 'dialog');
    raiz.setAttribute('aria-modal', 'true');
    raiz.setAttribute('aria-labelledby', 'indice-titulo');
    raiz.setAttribute('data-solo-js', '');
    raiz.innerHTML = '';

    var velo = FX.crear('div', 'indice__velo', raiz);
    velo.setAttribute('aria-hidden', 'true');
    var marco = FX.crear('div', 'indice__marco', raiz);

    var cerrarBtn = FX.crear('button', 'indice__cerrar', marco);
    cerrarBtn.type = 'button';
    cerrarBtn.innerHTML = '<span>Cerrar</span><kbd aria-hidden="true">Esc</kbd>';
    cerrarBtn.setAttribute('aria-label', 'Cerrar el índice');

    /* Anillo */
    var anilloCaja = FX.crear('div', 'indice__anillo', marco);
    var s = svg('svg', { viewBox: '-14 -14 428 428', class: 'indice__svg', 'aria-hidden': 'true', focusable: 'false' }, anilloCaja);
    var defs = svg('defs', {}, s);
    var mask = svg('mask', { id: 'indice-mascara', maskUnits: 'userSpaceOnUse', x: -14, y: -14, width: 428, height: 428 }, defs);
    var trazoMascara = svg('circle', { cx: C, cy: C, r: R, fill: 'none', stroke: '#fff', 'stroke-width': 72, transform: 'rotate(-90 200 200)' }, mask);

    // Dial: corona fina continua + graduación mayor en cada frontera de semana
    var dial = svg('g', { class: 'indice__dial' }, s);
    svg('circle', { cx: C, cy: C, r: 186, class: 'indice__dial-fino', 'stroke-dasharray': '0.9 11.35' }, dial);
    for (var b = 0; b < N; b++) {
      var q0 = pt(b * paso, 180), q1 = pt(b * paso, 194);
      svg('line', { x1: q0[0], y1: q0[1], x2: q1[0], y2: q1[1], class: 'indice__dial-mayor' }, dial);
    }

    var arcosG = svg('g', { class: 'indice__arcos', mask: 'url(#indice-mascara)' }, s);
    var foco = svg('path', { class: 'indice__foco', d: '' }, s);           // arco fino rubí claro sobre el activo
    var aguja = svg('g', { class: 'indice__aguja' }, s);
    svg('line', { x1: C, y1: 2, x2: C, y2: 16, class: 'indice__aguja-linea' }, aguja);
    svg('circle', { cx: C, cy: -6, r: 5, class: 'indice__aguja-punto' }, aguja);

    var arcos = [], hits = [];
    semanas.forEach(function (sem, i) {
      var a0 = i * paso + hueco / 2, a1 = (i + 1) * paso - hueco / 2;
      var d = arco(a0, a1, R);
      var g = svg('g', { class: 'indice__arco', 'data-k': i + 1, 'data-estado': estadoDe(sem) }, arcosG);
      svg('path', { d: d, class: 'indice__arco-trazo' }, g);
      var h = svg('path', { d: d, class: 'indice__arco-hit', 'data-k': i + 1 }, s);
      arcos.push(g); hits.push(h);
    });

    // Lectura central (texto real del DOM sobre el SVG; decorativa: la lista es la fuente accesible)
    var lectura = FX.crear('div', 'indice__lectura', anilloCaja);
    lectura.setAttribute('aria-hidden', 'true');
    var lNumCaja = FX.crear('span', 'indice__lectura-numcaja', lectura);
    var lNum = FX.crear('span', 'indice__lectura-num', lNumCaja);
    var lEstado = FX.crear('span', 'indice__lectura-estado t-dato', lectura);
    var lTitulo = FX.crear('span', 'indice__lectura-titulo', lectura);

    /* Panel con la lista */
    var panel = FX.crear('div', 'indice__panel', marco);
    var h2 = FX.crear('h2', 'indice__titulo', panel);
    h2.id = 'indice-titulo';
    h2.textContent = 'Índice';
    var resumen = FX.crear('p', 'indice__resumen t-dato', panel);
    var lista = FX.crear('ol', 'indice__lista', panel);
    var enlaces = semanas.map(function (sem, i) {
      var k = i + 1, li = FX.crear('li', 'indice__item', lista);
      var a = FX.crear('a', 'indice__enlace', li);
      a.href = '#semana-' + FX.dos(k);
      a.setAttribute('data-k', k);
      a.setAttribute('data-estado', estadoDe(sem));
      var num = FX.crear('span', 'indice__num t-dato', a);
      num.textContent = FX.dos(k);
      num.setAttribute('aria-hidden', 'true');
      FX.crear('span', 'sr-only', a).textContent = 'Semana ' + FX.dos(k) + ': ';
      FX.pintar(FX.crear('span', 'indice__tit', a), sem.titulo);
      FX.crear('span', 'sr-only', a).textContent = '. Estado: ' + ESTADOS[estadoDe(sem)].toLowerCase() + '.';
      FX.crear('span', 'indice__marca-estado', a).setAttribute('aria-hidden', 'true');
      return a;
    });

    /* ---------- Estado visual ---------- */
    var actual = FX.estado.semana || 0;
    var activo = null;

    function pintarLectura(k) {
      if (k >= 1 && k <= N) {
        var sem = semanas[k - 1];
        lNum.textContent = FX.dos(k);
        lEstado.textContent = ESTADOS[estadoDe(sem)] + (k === actual ? ' · aquí estás' : '');
        lEstado.setAttribute('data-estado', estadoDe(sem));
        FX.pintar(lTitulo, sem.titulo);
      } else {
        lNum.textContent = FX.dos(N);
        lEstado.textContent = 'Semanas';
        lEstado.removeAttribute('data-estado');
        lTitulo.classList.remove('pendiente');
        lTitulo.textContent = 'Elige una semana para ir a ella';
      }
    }

    function resaltar(k) {
      if (k === activo) return;
      activo = k;
      arcos.forEach(function (g, i) { g.classList.toggle('is-activo', i + 1 === k); });
      enlaces.forEach(function (a, i) { a.classList.toggle('is-activo', i + 1 === k); });
      if (k >= 1 && k <= N) {
        foco.setAttribute('d', arco((k - 1) * paso + hueco / 2, k * paso - hueco / 2, 170));
        foco.classList.add('is-visible');
      } else foco.classList.remove('is-visible');
      pintarLectura(k);
    }
    function reposo() { resaltar(actual >= 1 ? actual : 0); }

    function anguloAguja() { return actual >= 1 ? centroDe(actual) : 0; }
    function marcarActual() {
      enlaces.forEach(function (a, i) {
        if (i + 1 === actual) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
      arcos.forEach(function (g, i) { g.classList.toggle('is-actual', i + 1 === actual); });
      resumen.textContent = actual >= 1
        ? 'Vas en la semana ' + FX.dos(actual) + ' de ' + FX.dos(N)
        : FX.dos(N) + ' semanas · estás en la portada';
    }
    marcarActual();
    reposo();
    if (gsap) gsap.set(aguja, { rotation: anguloAguja(), svgOrigin: C + ' ' + C });

    FX.on('semana', function (e) {
      actual = e.k || 0;
      marcarActual();
      if (abiertoFlag) {
        if (gsap && !FX.estado.reducido) gsap.to(aguja, { rotation: anguloAguja(), svgOrigin: C + ' ' + C, duration: 0.8, ease: 'back.out(1.6)', overwrite: true });
        else if (gsap) gsap.set(aguja, { rotation: anguloAguja(), svgOrigin: C + ' ' + C });
      }
    });

    /* ---------- Interacción ---------- */
    hits.forEach(function (h) {
      var k = +h.getAttribute('data-k');
      h.addEventListener('pointerenter', function () { resaltar(k); });
      h.addEventListener('pointerleave', function () {
        var f = document.activeElement;
        if (f && f.classList && f.classList.contains('indice__enlace')) resaltar(+f.getAttribute('data-k')); else reposo();
      });
      h.addEventListener('click', function () { ir(k); });
    });
    enlaces.forEach(function (a) {
      var k = +a.getAttribute('data-k');
      a.addEventListener('focus', function () { resaltar(k); });
      a.addEventListener('pointerenter', function () { resaltar(k); });
      a.addEventListener('click', function (e) { e.preventDefault(); ir(k); });
    });
    lista.addEventListener('pointerleave', function () { if (!lista.contains(document.activeElement)) reposo(); });
    cerrarBtn.addEventListener('click', function () { cerrar(); });

    raiz.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
      if (e.key === 'Tab') {
        var focos = [cerrarBtn].concat(enlaces);
        var i = focos.indexOf(document.activeElement);
        if (e.shiftKey && (i <= 0)) { e.preventDefault(); focos[focos.length - 1].focus(); }
        else if (!e.shiftKey && (i === focos.length - 1 || i === -1)) { e.preventDefault(); focos[0].focus(); }
        return;
      }
      var j = enlaces.indexOf(document.activeElement);
      var mov = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (mov && N) {
        e.preventDefault();
        var n = j < 0 ? (mov > 0 ? 0 : N - 1) : (j + mov + N) % N;
        enlaces[n].focus();
      } else if ((e.key === 'Home' || e.key === 'End') && N) {
        e.preventDefault();
        enlaces[e.key === 'Home' ? 0 : N - 1].focus();
      }
    });

    /* ---------- Abrir / cerrar ---------- */
    var abiertoFlag = false, origen = null, tl = null;
    var fuera = ['#contenido', '.pie', '#encabezado', '.saltar'];

    function bloquear(si) {
      fuera.forEach(function (sel) { var el = FX.$(sel); if (el) { if (si) el.setAttribute('inert', ''); else el.removeAttribute('inert'); } });
      html.classList.toggle('indice-abierto', si);
      if (FX.lenis) { if (si) FX.lenis.stop(); else FX.lenis.start(); }
      var b = FX.encabezado && FX.encabezado.boton;
      if (b) b.setAttribute('aria-expanded', si ? 'true' : 'false');
    }

    function puntoOrigen() {
      var el = origen && origen.getBoundingClientRect ? origen : null;
      if (!el) return { x: innerWidth - 60, y: 32 };
      var r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    function construirEntrada() {
      var o = puntoOrigen();
      var radio = Math.hypot(Math.max(o.x, innerWidth - o.x), Math.max(o.y, innerHeight - o.y)) + 20;
      var items = FX.$$('.indice__item', lista);
      var t = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
      t.fromTo(velo, { clipPath: 'circle(0px at ' + o.x + 'px ' + o.y + 'px)' },
                     { clipPath: 'circle(' + radio + 'px at ' + o.x + 'px ' + o.y + 'px)', duration: 0.75, ease: 'expo.inOut' }, 0)
       .fromTo(trazoMascara, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 1.15, ease: 'power3.inOut' }, 0.3)
       .fromTo(dial, { rotation: -40, svgOrigin: C + ' ' + C, opacity: 0 }, { rotation: 0, svgOrigin: C + ' ' + C, opacity: 1, duration: 1.3 }, 0.3)
       .fromTo(aguja, { rotation: anguloAguja() - 120, svgOrigin: C + ' ' + C, opacity: 0 },
                      { rotation: anguloAguja(), svgOrigin: C + ' ' + C, opacity: 1, duration: 1.1, ease: 'back.out(1.4)' }, 0.75)
       .fromTo(lNum, { yPercent: 105 }, { yPercent: 0, duration: 0.9 }, 0.7)
       .fromTo([lEstado, lTitulo], { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, 0.95)
       .fromTo([h2, resumen], { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.06 }, 0.45)
       .fromTo(items, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.7, stagger: 0.035, ease: 'power3.out' }, 0.55)
       .fromTo(cerrarBtn, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.6);
      return t;
    }

    function abrir(desde) {
      if (abiertoFlag || !N) return;
      abiertoFlag = true;
      origen = desde || (FX.encabezado && FX.encabezado.boton) || document.activeElement;
      raiz.hidden = false;
      bloquear(true);
      activo = null; reposo();
      var destino = enlaces[(actual >= 1 ? actual : 1) - 1];
      if (gsap && !FX.estado.reducido) {
        if (tl) tl.kill();
        tl = construirEntrada();
        tl.timeScale(1).play(0);
      } else if (gsap) {
        gsap.set(aguja, { rotation: anguloAguja(), svgOrigin: C + ' ' + C, opacity: 1 });
      }
      destino.focus({ preventScroll: true });
    }

    function terminarCierre(despues) {
      raiz.hidden = true;
      bloquear(false);
      if (origen && origen.focus && document.contains(origen)) origen.focus({ preventScroll: true });
      if (despues) despues();
    }

    function cerrar(despues) {
      if (!abiertoFlag) return;
      abiertoFlag = false;
      if (tl && gsap && !FX.estado.reducido) {
        tl.eventCallback('onReverseComplete', function () { tl.eventCallback('onReverseComplete', null); terminarCierre(despues); });
        tl.timeScale(2.4).reverse();
      } else terminarCierre(despues);
    }

    function ir(k) {
      var sel = '#semana-' + FX.dos(k);
      if (!abiertoFlag) { FX.irA(sel); return; }
      cerrar(function () {
        FX.irA(sel);
        // el foco acompaña al lector: pasa a la cabecera de la semana (sin volver a desplazar)
        var dest = FX.$(sel);
        if (dest) {
          if (!dest.hasAttribute('tabindex')) dest.setAttribute('tabindex', '-1');
          dest.focus({ preventScroll: true });
        }
      });
    }

    FX.indice = { abrir: abrir, cerrar: cerrar, abierto: function () { return abiertoFlag; } };
  }, 60);
})();
