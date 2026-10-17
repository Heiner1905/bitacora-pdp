/* ==========================================================================
   portada.js — portada y entrada por la pupila-cerradura (constructor 1 · DIRECCION §6)
   1) Pinta los textos desde window.BITACORA (nombre, propósito, créditos).
   2) Entrada al cargar (≈ 2,4 s): las partículas salen de la pupila y ensamblan el
      emblema, ceden al vector nítido; el nombre se revela con máscara por líneas.
      En reposo el emblema es vector vivo (iris, parpadeo); las partículas vuelven
      solo al acercar el cursor (o al tocar el emblema en táctil).
   3) Entrada por la pupila (pin + scrub, 150 svh escritorio / 110 svh móvil):
      telón (el nombre se abre), la sala se oscurece y el ojo se abre un poco;
      la cámara viaja hacia la cerradura y su hueco se vuelve una ventana que crece
      hasta cubrir la pantalla. Por el hueco se ve DESDE EL PRIMER INSTANTE el plano
      de la semana 01 (.portada__mirilla: copia de .semana__cabecera de la semana 01,
      con el «01» y «Semana 01» centrados en la pupila) que al cubrir la pantalla
      coincide con la cabecera real. Contador: FX.fijarSemana(1) en el cuadro en que
      el hueco cubre la pantalla, (0) al volver, (null) al terminar el pin.
   4) reduced-motion: portada estática completa y la semana 01 debajo, sin pin.

   Geometría (unidades del viewBox del emblema, 400×400):
   la cerradura = círculo (200,195) r 6,5 + trapecio hasta y = 211. La cámara
   escala el emblema alrededor del centro de ese círculo (el «ancla»).
   ========================================================================== */
(function () {
  'use strict';
  var FX = window.FX;
  if (!FX) return;

  var TEXTO = {
    pistaFino: 'Acércate: está hecho de fragmentos. La pupila es una cerradura.',
    pistaTactil: 'Toca la pupila: es una cerradura.',
    bajar: 'Desliza para entrar',
    bajarQuieto: 'Bajar a la semana 01',
    sufijo: ', bitácora de '
  };

  /* Tramos del recorrido del pin (0–1) */
  var P_TELON = 0.22;   // telón + el emblema va al centro + el ojo se abre un poco
  var P_CUBRE = 0.9;    // el hueco cubre la pantalla → semana 01
  var ABRIR = 0.35;     // cuánto se abre el ojo en el telón
  var SI = 1 + 0.12 * ABRIR;   // escala del iris con el ojo así de abierto (ver simbolo.js · abrirOjo)
  // Contorno del hueco relativo al centro del círculo (200,195): tangencias calculadas sobre el trapecio
  var HUECO = { r: 6.5, t: [3.692, 5.349], b: [6, 16] };

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function inOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function r2(v) { return Math.round(v * 100) / 100; }

  FX.registrar('portada', function (FX) {
    var portada = document.getElementById('portada');
    if (!portada) return;
    var $ = function (s) { return portada.querySelector(s); };
    var gsap = window.gsap, ST = window.ScrollTrigger;

    var svg = document.getElementById('emblema');
    var camara = $('.portada__camara');
    var escena = $('.portada__escena');
    var lineas = FX.$$('.portada__linea', portada);
    var txts = FX.$$('.portada__txt', portada);
    var proposito = $('.portada__proposito');
    var creditos = $('.portada__creditos');
    var dds = FX.$$('.portada__creditos dd', portada);
    var bajar = $('.portada__bajar');
    var bajarTxt = $('.portada__bajar-txt');
    var bajarLleno = $('.portada__bajar-lleno');
    var pista = $('.portada__pista');
    var recorrido = document.querySelector('.portada__recorrido');
    var mirilla = document.querySelector('.portada__mirilla');
    var borde = document.querySelector('.portada__borde');
    var bordeTrazo = borde && borde.querySelector('path');

    /* ---------- 1 · Textos ---------- */
    (function pintarTextos() {
      var B = FX.datos || {}, a = B.autor || {};
      var corto = (a.nombreCorto || a.nombre || '').trim().split(/\s+/);
      function campo(n, v) { FX.$$('[data-campo="' + n + '"]', portada).forEach(function (el) { FX.pintar(el, v); }); }
      campo('nombre-1', corto[0]);
      campo('nombre-2', corto.slice(1).join(' ') || null);
      var suf = $('[data-campo="nombre-sufijo"]');
      if (suf) suf.textContent = a.materia ? TEXTO.sufijo + a.materia : '';
      campo('proposito', B.proposito);
      campo('autor', a.nombre);
      campo('codigo', a.codigo);
      campo('programa', a.programa);
      campo('semestre', a.semestre);
      campo('materia', a.materia);
      campo('periodo', a.periodo);
    })();

    if (bajar) bajar.addEventListener('click', function (e) { e.preventDefault(); FX.irA('#semana-01'); });

    var ctl = FX.simbolo && FX.simbolo.portada;
    var P = FX.particulas;

    if (!gsap || !FX.mm) { document.documentElement.classList.remove('precarga'); return; }

    var entradaHecha = false;
    var cargaArriba = (window.scrollY || 0) < 8 && !location.hash;

    FX.mm.add(FX.MQ, function (c) {
      var k = c.conditions;
      if (k.reducido) return modoQuieto();
      return modoMovimiento(!!k.escritorio);
    });

    /* =========================================================
       reduced-motion: todo visible y estático
       ========================================================= */
    function modoQuieto() {
      entradaHecha = true;
      if (ctl) ctl.vivo(false);
      if (recorrido) recorrido.style.height = '0px';
      if (bajarTxt) bajarTxt.textContent = TEXTO.bajarQuieto;
      if (pista) pista.textContent = '';
      return function () { if (bajarTxt) bajarTxt.textContent = TEXTO.bajar; };
    }

    /* =========================================================
       Movimiento (escritorio y móvil)
       ========================================================= */
    function modoMovimiento(desk) {
      var limpiezas = [];
      var punteroFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      var E = ctl ? { dial: ctl.el('dial'), orbita: ctl.el('orbita'), todo: ctl.el('todo'), fragmento: ctl.el('fragmento'), pliegue: ctl.el('pliegue'), horizonte: svg.querySelector('#simbolo-horizonte') } : {};
      var exteriores = [E.dial, E.orbita, E.todo, E.fragmento, E.horizonte].filter(Boolean);
      if (bajarTxt) bajarTxt.textContent = TEXTO.bajar;

      /* ---------- Pista de interacción ---------- */
      var pistaUsada = false;
      function mostrarPista() {
        if (!pista || pistaUsada) return;
        pista.textContent = punteroFino ? TEXTO.pistaFino : TEXTO.pistaTactil;
        gsap.fromTo(pista, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, delay: 0.3, ease: 'power1.out' });
      }
      function usarPista() {
        if (!pista || pistaUsada) return;
        pistaUsada = true;
        gsap.to(pista, { autoAlpha: 0, duration: 0.6, delay: 1.4 });
      }

      /* ---------- 2 · Entrada al cargar ---------- */
      function alEnsamblar() {
        entradaHecha = true;
        if (ctl && progreso() < 0.002) ctl.vivo(true);
        mostrarPista();
      }
      if (!entradaHecha && cargaArriba) {
        gsap.set(txts, { y: 0, yPercent: 108 });
        gsap.set([proposito].concat(dds), { clipPath: 'inset(-10% 100% -10% 0%)' });
        gsap.set(creditos, { '--linea': 0 });
        gsap.set(bajar, { autoAlpha: 0 });
        var tlE = gsap.timeline({ delay: 0.15 });
        if (P && P.disponible()) {
          gsap.set(svg, { opacity: 0 });
          tlE.add(function () { P.formarSVG(svg, { desde: 'pupila', duracion: 1.7, sostener: 0.15, alTerminar: alEnsamblar }); }, 0);
        } else {
          tlE.fromTo(svg, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power1.out', onComplete: alEnsamblar }, 0.2);
        }
        tlE.to(txts, { yPercent: 0, duration: 1.35, ease: 'expo.out', stagger: 0.12 }, 0.45)
          .to(creditos, { '--linea': 1, duration: 1.1, ease: 'expo.inOut' }, 1.15)
          .to([proposito].concat(dds), { clipPath: 'inset(-10% 0% -10% 0%)', duration: 1.1, ease: 'expo.inOut', stagger: 0.07 }, 1.25)
          .to(bajar, { autoAlpha: 1, duration: 0.6, ease: 'power1.out' }, 2.1);
      } else if (!entradaHecha) {
        gsap.set(svg, { opacity: 1 });
        alEnsamblar();
      } else if (ctl && progreso() < 0.002) ctl.vivo(true);

      /* ---------- Partículas al acercar el cursor / tocar ---------- */
      function enReposo() { return entradaHecha && progreso() < 0.002 && (window.scrollY || 0) < 4; }
      function sobreEmblema(x, y, margen) {
        var r = svg.getBoundingClientRect();
        var dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height / 2);
        return Math.hypot(dx, dy) < r.width * (margen || 0.47);
      }
      if (P) {
        if (punteroFino) {
          var alMover = function (e) {
            if (!enReposo()) return;
            if (sobreEmblema(e.clientX, e.clientY)) { if (P.despertar(svg, {})) usarPista(); }
          };
          window.addEventListener('pointermove', alMover, { passive: true });
          limpiezas.push(function () { window.removeEventListener('pointermove', alMover); });
        } else {
          var alTocar = function (e) {
            if (!enReposo() || e.target.closest('.portada__cerradura')) return;
            if (sobreEmblema(e.clientX, e.clientY, 0.5)) { P.despertar(svg, { toque: true, x: e.clientX, y: e.clientY }); usarPista(); }
          };
          escena.addEventListener('pointerdown', alTocar, { passive: true });
          limpiezas.push(function () { escena.removeEventListener('pointerdown', alTocar); });
        }
      }
      var botonCerr = document.getElementById('emblema-cerradura');
      var alCerradura = function () { usarPista(); };
      if (botonCerr) { botonCerr.addEventListener('click', alCerradura); limpiezas.push(function () { botonCerr.removeEventListener('click', alCerradura); }); }

      /* ---------- 3 · Entrada por la pupila ---------- */
      if (!ST) return function () { limpiezas.forEach(function (f) { f(); }); };

      var factor = desk ? 1.5 : 1.1;
      var G = {};
      var st = null;
      function progreso() { return st ? st.progress : 0; }
      function pinLen() { return window.innerHeight * factor; }
      function inicio() { return Math.max(0, portada.offsetTop + portada.offsetHeight - window.innerHeight); }

      function ajustarRecorrido() {
        // la semana 01 llega arriba justo cuando termina el pin
        var Hp = portada.offsetHeight, vh = window.innerHeight;
        var ini = Math.max(0, Hp - vh);
        recorrido.style.height = Math.max(0, Math.round(ini + pinLen() - Hp)) + 'px';
      }
      ajustarRecorrido();
      ST.addEventListener('refreshInit', ajustarRecorrido);
      limpiezas.push(function () { ST.removeEventListener('refreshInit', ajustarRecorrido); recorrido.style.height = '0px'; });

      function medir() {
        var vw = document.documentElement.clientWidth, vh = window.innerHeight;
        var t = camara.style.transform;
        camara.style.transform = 'none';
        var rs = svg.getBoundingClientRect(), rp = portada.getBoundingClientRect(), rc = camara.getBoundingClientRect();
        camara.style.transform = t;
        var b = (svg.clientWidth || rs.width) / 400;
        var ax = 200, ay = 200 + SI * (195 - 200);   // ancla: centro del círculo de la cerradura, con el iris algo crecido
        var topPin = Math.min(0, vh - portada.offsetHeight);
        G = {
          vw: vw, vh: vh, b: b,
          P0: { x: rs.left + ax * b, y: topPin + (rs.top - rp.top) + ay * b },
          origen: (rs.left - rc.left + ax * b) + 'px ' + (rs.top - rc.top + ay * b) + 'px',
          diag: Math.hypot(vw / 2, vh / 2)
        };
        G.ZA = desk ? 1.3 : 1.18;
        G.KA = b * G.ZA * SI;                  // px por unidad del hueco al empezar el zoom
        G.Kc = G.diag / HUECO.r * 1.04;        // el círculo del hueco cubre la pantalla
        G.Kh = G.diag / 16;                    // la pupila (noche) ya cubre la pantalla: se oculta el vector
        camara.style.transformOrigin = G.origen;
        mir.sucia = true;
      }

      /* ---- La mirilla: el plano de la semana 01 ---- */
      var mir = { lienzo: null, F: null, numCopia: null, numReal: null, sucia: true, dentro: false };
      function construirMirilla() {
        mir.sucia = false;
        mirilla.textContent = '';
        var lienzo = FX.crear('div', 'portada__mirilla-lienzo');
        var sec = document.querySelector('section[data-semana="1"]');
        var cab = sec && sec.querySelector('.semana__cabecera');
        var foco = [];
        mir.numReal = null; mir.numCopia = null;
        if (cab) {
          // copia fiel de la cabecera real (sin ids, sin estados de animación), en la misma retícula
          var env = document.createElement('div');
          env.className = sec.className + ' portada__mirilla-semana';
          ['data-plano', 'data-estado'].forEach(function (a) { if (sec.hasAttribute(a)) env.setAttribute(a, sec.getAttribute(a)); });
          var rs = sec.getBoundingClientRect();
          env.style.cssText = 'position:absolute;left:' + rs.left + 'px;top:0;width:' + sec.offsetWidth + 'px;margin:0;';
          var copia = cab.cloneNode(true);
          copia.querySelectorAll('[id]').forEach(function (n) { n.removeAttribute('id'); });
          [copia].concat(Array.prototype.slice.call(copia.querySelectorAll('[style]'))).forEach(function (n) {
            ['opacity', 'visibility', 'transform', 'clip-path', 'translate', 'scale'].forEach(function (p) { n.style.removeProperty(p); });
          });
          env.appendChild(copia);
          lienzo.appendChild(env);
          mir.numReal = cab.querySelector('.semana__numero');
          mir.numCopia = copia.querySelector('.semana__numero');
          foco = [mir.numCopia, copia.querySelector('.ficha__semana') || copia.querySelector('.semana__ficha')];
        } else {
          // sin la cabecera del constructor 2: una composición propia, centrada en la pantalla
          var propia = FX.crear('div', 'portada__mirilla-propia', lienzo);
          var n = FX.crear('p', 'portada__mirilla-num', propia); n.textContent = FX.dos(1);
          var e = FX.crear('p', 'portada__mirilla-etiqueta', propia); e.textContent = 'Semana ' + FX.dos(1);
          foco = [n, e];
        }
        mirilla.appendChild(lienzo);
        lienzo.style.transform = 'none';
        var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        foco.filter(Boolean).forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (!r.width) return;
          x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom);
        });
        if (!isFinite(x0)) { x0 = G.vw * 0.3; x1 = G.vw * 0.7; y0 = G.vh * 0.3; y1 = G.vh * 0.7; }
        mir.F = { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
        lienzo.style.transformOrigin = r2(mir.F.x) + 'px ' + r2(mir.F.y) + 'px';
        // el plano entero cabe en el círculo de la cerradura al empezar el zoom
        mir.m0 = clamp(HUECO.r * 2 * G.KA * 0.92 / Math.max(mir.F.w, mir.F.h * 1.1, 1), 0.005, 0.9);
        mir.alfa = Math.log(1 / mir.m0) / Math.log(G.Kc / G.KA);
        mir.lienzo = lienzo;
        mirilla.removeChild(lienzo);
      }
      function ponerMirilla(si) {
        if (si === mir.dentro) return;
        mir.dentro = si;
        if (si) { if (mir.sucia || !mir.lienzo) construirMirilla(); mirilla.appendChild(mir.lienzo); mirilla.style.visibility = 'visible'; }
        else { if (mir.lienzo && mir.lienzo.parentNode) mirilla.removeChild(mir.lienzo); mirilla.style.visibility = 'hidden'; mirilla.style.clipPath = ''; }
      }

      function trazoHueco(cx, cy, k) {
        var t = HUECO.t, b = HUECO.b, r = HUECO.r * k;
        return 'M' + r2(cx + t[0] * k) + ' ' + r2(cy + t[1] * k) +
          'L' + r2(cx + b[0] * k) + ' ' + r2(cy + b[1] * k) +
          'L' + r2(cx - b[0] * k) + ' ' + r2(cy + b[1] * k) +
          'L' + r2(cx - t[0] * k) + ' ' + r2(cy + t[1] * k) +
          'A' + r2(r) + ' ' + r2(r) + ' 0 1 1 ' + r2(cx + t[0] * k) + ' ' + r2(cy + t[1] * k) + 'Z';
      }

      /* ---- El telón: un timeline en pausa que el scroll recorre ---- */
      var telon = gsap.timeline({ paused: true, defaults: { ease: 'power2.in' } });
      if (lineas[0]) telon.fromTo(lineas[0], { x: 0, autoAlpha: 1 }, { x: function () { return -window.innerWidth * (desk ? 0.2 : 0.35); }, autoAlpha: 0, duration: 1 }, 0);
      if (lineas[1]) telon.fromTo(lineas[1], { x: 0, autoAlpha: 1 }, { x: function () { return window.innerWidth * (desk ? 0.2 : 0.35); }, autoAlpha: 0, duration: 1 }, 0);
      telon.fromTo([proposito, creditos, bajar, pista].filter(Boolean), { y: 0, opacity: 1 }, { y: 18, opacity: 0, duration: 0.7, stagger: 0.08 }, 0);
      limpiezas.push(function () { telon.progress(0).kill(); });

      var forzado = 'libre';
      function forzar(k) { if (k === forzado) return; forzado = k; FX.fijarSemana(k === 'libre' ? null : k); }
      var quieto = true;

      function render(p) {
        if (!G.b) medir();
        var a = clamp(p / P_TELON, 0, 1), e = inOut(a);
        telon.progress(a);
        if (bajarLleno) bajarLleno.style.transform = 'scaleX(' + r2(clamp(p / P_CUBRE, 0, 1)) + ')';

        // el emblema deja de estar "en reposo" en cuanto empieza el recorrido
        if (p > 0.002) {
          if (quieto) {
            quieto = false;
            if (ctl) { ctl.vivo(false); ctl.cerradura(false); }
            if (P) P.detener();
          }
        } else if (!quieto) {
          quieto = true;
          if (ctl && entradaHecha) ctl.vivo(true);
        }
        if (ctl) ctl.abrirOjo(ABRIR * e);
        var dim = String(r2(1 - 0.8 * e));
        exteriores.forEach(function (el) { el.style.opacity = p > 0.002 ? dim : ''; });

        // cámara: el ancla va al centro de la pantalla y luego se acerca
        var cx = lerp(G.P0.x, G.vw / 2, e), cy = lerp(G.P0.y, G.vh / 2, e);
        var bp = clamp((p - P_TELON) / (P_CUBRE - P_TELON), 0, 1);
        var Kp = p <= P_TELON ? G.b * SI * lerp(1, G.ZA, e) : G.KA * Math.pow(G.Kc / G.KA, Math.pow(bp, 1.7));
        var Z = Kp / (G.b * SI);
        var emblemaVisible = Kp < G.Kh;
        // con la pupila cubriendo la pantalla el vector se oculta y su escala ya no crece (acotada en Kh)
        if (emblemaVisible || !camara.style.transform) camara.style.transform = p > 0.002 ? 'translate(' + r2(cx - G.P0.x) + 'px,' + r2(cy - G.P0.y) + 'px) scale(' + (Math.round(Math.min(Z, G.Kh / (G.b * SI)) * 1000) / 1000) + ')' : '';
        camara.style.visibility = emblemaVisible ? '' : 'hidden';

        // la mirilla: visible desde el primer instante del zoom hasta el corte
        var activo = st && st.isActive;
        if (p >= P_TELON && p < 1 && activo !== false) {
          ponerMirilla(true);
          var m = clamp(mir.m0 * Math.pow(Kp / G.KA, mir.alfa), mir.m0, 1);
          var w = (m - mir.m0) / (1 - mir.m0);
          var fx = lerp(cx, mir.F.x, w), fy = lerp(cy, mir.F.y, w);
          mir.lienzo.style.transform = m >= 0.9999 ? 'none' : 'translate(' + r2(fx - mir.F.x) + 'px,' + r2(fy - mir.F.y) + 'px) scale(' + (Math.round(m * 10000) / 10000) + ')';
          if (mir.numReal && mir.numCopia) mir.numCopia.style.transform = mir.numReal.style.transform;
          var cubre = p >= P_CUBRE;
          var d = trazoHueco(cx, cy, Kp);
          mirilla.style.clipPath = cubre ? 'none' : 'path("' + d + '")';
          if (bordeTrazo) {
            if (cubre) borde.style.visibility = 'hidden';
            else { bordeTrazo.setAttribute('d', d); borde.style.visibility = 'visible'; }
          }
        } else {
          ponerMirilla(false);
          if (borde) borde.style.visibility = 'hidden';
        }
        if (activo) forzar(p >= P_CUBRE ? 1 : 0);
        // tras el corte la portada queda (por el pin sin espaciado) encima de la semana: se apaga
        portada.style.visibility = (p >= 0.9999 && !activo) ? 'hidden' : '';
      }

      st = ST.create({
        trigger: portada,
        start: inicio,
        end: function () { return inicio() + pinLen(); },
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: function (self) { medir(); render(self.progress); },
        onUpdate: function (self) { render(self.progress); },
        onToggle: function (self) {
          if (!self.isActive) { forzar('libre'); render(self.progress); ponerMirilla(false); if (borde) borde.style.visibility = 'hidden'; }
          else render(self.progress);
        }
      });
      var alRedim = function () { mir.sucia = true; };
      FX.on('redimension', alRedim);
      limpiezas.push(function () { FX.off('redimension', alRedim); });
      limpiezas.push(function () {
        ponerMirilla(false); forzar('libre');
        camara.style.transform = ''; camara.style.visibility = ''; portada.style.visibility = '';
        exteriores.forEach(function (el) { el.style.opacity = ''; });
        if (ctl) ctl.abrirOjo(0);
      });
      medir();
      render(st.progress);

      return function () { limpiezas.forEach(function (f) { try { f(); } catch (e) { /* nada */ } }); };
    }
  }, 31);
})();
