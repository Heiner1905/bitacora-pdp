/* Principal: pinta los datos, monta Lenis + GSAP y coreografía
   carga de la portada → transición (cierre de celdas, giro del dial, clic de encaje,
   apertura de la lectura 01) → acople del dial a la barra. */
(function () {
  "use strict";

  var B = window.BITACORA;
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var N = B.semanas.length;
  var S1 = B.semanas[0];
  var PREF = "fragmento-b-movimiento";

  /* ---------- Contenido desde los datos ---------- */
  function esPendiente(v) { return typeof v === "string" && v.indexOf("[PENDIENTE") === 0; }
  function pintarTexto(el, valor) {
    el.textContent = valor;
    if (esPendiente(valor)) {
      el.classList.add("pendiente");
      el.setAttribute("data-pendiente", "true");
    }
  }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  var ESTADOS = { "pendiente": "Pendiente", "en-curso": "En curso", "completada": "Completada" };

  function valorCampo(clave) {
    var sig = B.semanas[1];
    var mapa = {
      "semana.numero2": pad2(S1.numero),
      "semana.etiqueta": "SEMANA_" + pad2(S1.numero),
      "semana.estadoTexto": ESTADOS[S1.estado] || S1.estado,
      "semana.fecha": S1.fecha,
      "semana.titulo": S1.titulo,
      "semana.reflexion": S1.reflexion,
      "siguiente.etiqueta": sig ? "SEMANA_" + pad2(sig.numero) : "",
      "siguiente.titulo": sig ? sig.titulo : ""
    };
    if (clave in mapa) return mapa[clave];
    return clave.split(".").reduce(function (o, k) { return o ? o[k] : undefined; }, B);
  }

  function pintarDatos() {
    $$("[data-campo]").forEach(function (el) {
      var v = valorCampo(el.getAttribute("data-campo"));
      if (v !== undefined) pintarTexto(el, v);
    });
    var palabras = B.autor.nombreCorto.toLocaleUpperCase("es-CO").split(" ");
    $$("[data-palabra]").forEach(function (el) { el.textContent = palabras[+el.getAttribute("data-palabra")] || ""; });
    $$("[data-estado]").forEach(function (el) { el.setAttribute("data-estado", S1.estado); });
    if (!B.semanas[1]) $(".siguiente").hidden = true;

    var cont = $("[data-bloques]");
    (S1.bloques || []).forEach(function (b) {
      var bl = document.createElement("div");
      bl.className = "bloque";
      bl.innerHTML = '<span class="hilo" data-hilo="mayores" aria-hidden="true"></span>';
      var h = document.createElement("h3");
      h.className = "bloque__titulo";
      h.textContent = b.titulo;
      bl.appendChild(h);
      var c = document.createElement("div");
      c.className = "bloque__contenido";
      if (b.tipo === "lista") {
        var ul = document.createElement("ul");
        (b.items || []).forEach(function (it) {
          var li = document.createElement("li");
          var sp = document.createElement("span");
          pintarTexto(sp, it);
          li.appendChild(sp);
          ul.appendChild(li);
        });
        c.appendChild(ul);
      } else {
        var p = document.createElement("p");
        pintarTexto(p, b.texto || "");
        c.appendChild(p);
      }
      bl.appendChild(c);
      cont.appendChild(bl);
    });
  }

  /* ---------- Movimiento: preferencia del sistema o el botón MOVIMIENTO ---------- */
  function leerPref() { try { return localStorage.getItem(PREF); } catch (e) { return null; } }
  function guardarPref(v) { try { localStorage.setItem(PREF, v); } catch (e) { /* sin almacenamiento */ } }

  var reducidoSO = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pref = leerPref();
  var conMovimiento = pref ? pref === "si" : !reducidoSO;
  if (!window.gsap || !window.ScrollTrigger) conMovimiento = false;

  function prepararBotones() {
    $$("[data-movimiento]").forEach(function (b) {
      b.setAttribute("aria-pressed", conMovimiento ? "true" : "false");
      b.querySelector(".movimiento__estado").textContent = conMovimiento ? "[SÍ]" : "[NO]";
      b.addEventListener("click", function () {
        guardarPref(conMovimiento ? "no" : "si");
        location.reload();
      });
    });
  }

  function rotular(k) { return !(N > 12 && Reticula.G.movil) || k % 2 === 1; }

  /* ---------- Arranque común ---------- */
  pintarDatos();
  Reticula.medir();
  Reticula.dibujar();
  Dial.iniciar(N, rotular);
  Lecturas.fijarTotal(N);
  Lecturas.fijarN(0);
  Lecturas.fijarDistancia(Dial.distancia(0));
  $$('[data-lectura="ang"]').forEach(function (e) { e.textContent = Lecturas.pad(Dial.R(0).toFixed(1).replace(".", ","), 5); });
  $$('[data-lectura="meta"]').forEach(function (e) { e.textContent = Lecturas.pad(Dial.R(1).toFixed(1).replace(".", ","), 5) + "°"; });
  Lecturas.iniciarReloj();
  prepararBotones();

  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, CustomEase);
    CustomEase.create("reten", "M0,0 C0.3,0 0.25,1.12 0.62,1.02 0.75,0.99 0.88,1 1,1");
  }

  if (!conMovimiento) modoQuieto(); else modoVivo();

  /* ======================================================================
     Sin movimiento: estado final, sin pin, sin Lenis, sin secuenciador
     ====================================================================== */
  function modoQuieto() {
    root.classList.add("sin-movimiento");
    root.classList.remove("js-cargando");
    Dial.copiaEstatica($(".dial-estatico"), 1, rotular);
    if (window.gsap) {
      Lecturas.prepararMira(true);
      Giro.iniciar(S1.giro, false);
    } else {
      var f = $("[data-giro-frase]");
      pintarTexto(f, S1.giro);
      $("[data-giro]").classList.add("inundado");
    }
    Lecturas.prepararToque();
    // Las lecturas de la barra cambian al instante al entrar a la semana
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) {
        var dentro = e[0].isIntersecting || e[0].boundingClientRect.top < 0;
        Lecturas.fijarN(dentro ? 1 : 0, false);
        Lecturas.fijarDistancia(Dial.distancia(dentro ? 1 / N : 0));
      }, { rootMargin: "0px 0px -50% 0px" }).observe($("#semana-01"));
    }
    var t;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        Reticula.medir(); Reticula.dibujar();
        Dial.copiaEstatica($(".dial-estatico"), 1, rotular);
      }, 150);
    });
  }

  /* ======================================================================
     Con movimiento
     ====================================================================== */
  function modoVivo() {
    var PULSO = Reticula.PULSO, PASO = Reticula.PASO;
    var D = Dial.estado;

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    /* Lenis + ScrollTrigger */
    var lenis = null;
    if (window.Lenis) {
      lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    Lecturas.prepararMira(false);
    Lecturas.prepararToque();
    Giro.iniciar(S1.giro, true);

    /* Valores de clip por tipo de celda */
    function clips(c) {
      if (c.classList.contains("celda--nombre")) return { abierta: "inset(-40% 0% -20% 0%)", arriba: "inset(-40% 0% 140% 0%)", abajo: "inset(120% 0% -20% 0%)" };
      if (c.classList.contains("celda--numero")) return { abierta: "inset(-10% 0% -10% 0%)", arriba: "inset(-10% 0% 110% 0%)", abajo: "inset(110% 0% -10% 0%)" };
      return { abierta: "inset(0% 0% 0% 0%)", arriba: "inset(0% 0% 100% 0%)", abajo: "inset(100% 0% 0% 0%)" };
    }
    var celdasNombre = $$(".celda--nombre");
    var celdaProp = $(".celda--proposito");
    var celdasFicha = $$(".celda--ficha");
    var celdasLectMovil = $$(".lecturas-movil .celda");
    var celdasSemana = [].concat($$(".celda--numero"), $$(".semana__datos .celda"), [$(".celda--reflexion")]);

    /* ---------------- Carga de la portada (≈ 2,9 s) ---------------- */
    var esMovil = Reticula.G.movil;
    if (!esMovil) celdasSemana.forEach(function (c) { gsap.set(c, { clipPath: clips(c).abajo }); });

    var anilloLong = D.anillo.getTotalLength();
    var intro = gsap.timeline({ paused: true, onComplete: alTerminarIntro });
    var G0 = Reticula.G;

    // 1 · la retícula se traza
    intro.from(G0.verticales, { scaleY: 0, transformOrigin: "50% 0%", duration: PULSO, ease: "power2.out", stagger: PASO / 2 }, 0);
    intro.fromTo(".lecturas__celda", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: PASO, ease: "steps(4)", stagger: PASO / 2 }, 0);
    var hilosPortada = $$(".portada .hilo, .portada [data-fila] > .hilo");
    intro.from(hilosPortada, { scaleX: 0, duration: PULSO, ease: "power2.out", stagger: PASO / 2 }, PASO / 2);
    intro.from(".lecturas__nodos .nodo, .portada .nodo:not(.nodo--menor)", { scale: 0, duration: PASO, ease: "steps(2)", stagger: PASO / 4 }, PASO);
    intro.from(".portada .nodo--menor", { opacity: 0, duration: PASO, ease: "steps(1)", stagger: PASO / 8 }, PULSO);

    // 2 · el nombre se descubre celda por celda, a tempo (bombo en 1, 3, 5, 7)
    var orden = [0, 1, 2, 3];
    orden.forEach(function (idx, i) {
      var c = celdasNombre[idx];
      intro.fromTo(c, { clipPath: clips(c).abajo }, { clipPath: clips(c).abierta, duration: PASO, ease: "power2.out" }, PULSO + i * PULSO);
    });

    // 3 · el anillo se traza como plóter (saltos de 10°) y los ticks se encienden en barrido
    intro.fromTo(D.anillo, { strokeDasharray: anilloLong, strokeDashoffset: anilloLong }, { strokeDashoffset: 0, duration: 1.21, ease: "steps(36)" }, PULSO + PASO);
    intro.from(D.partes.ticks, { opacity: 0, duration: 0.01, stagger: 0.006, ease: "none" }, PULSO + PASO);
    intro.from([].concat(D.partes.limites, D.partes.segs), { opacity: 0, duration: PASO, ease: "steps(2)", stagger: PASO / 4 }, 1.2);
    intro.from(D.partes.etqs, { opacity: 0, duration: PASO, ease: "steps(2)", stagger: PASO / 4 }, 1.45);

    // 4 · ojo, iris, pupila, HR: un paso cada uno
    ["#ojo-sup", "#ojo-inf", "#iris", "#pupila", "#hr"].forEach(function (s, i) {
      intro.from(s, { opacity: 0, duration: PASO, ease: "steps(2)" }, 1.452 + i * PASO * 0.5);
    });
    intro.from(D.frag, { opacity: 0, duration: PASO, ease: "steps(2)" }, 1.936);
    intro.fromTo(D.partes.indice, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: PASO, ease: "back.out(3)" }, 1.936);

    // 5 · propósito y ficha se abren por filas
    var filas = esMovil
      ? [[celdaProp], [celdasFicha[0], celdasFicha[1]], [celdasFicha[2], celdasFicha[3]], celdasLectMovil]
      : [[celdaProp, celdasFicha[0], celdasFicha[1]], [celdasFicha[2], celdasFicha[3]]];
    filas.forEach(function (f, i) {
      intro.fromTo(f, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: PASO * 2, ease: "power2.inOut" }, 1.936 + i * PASO);
    });

    // 6 · arranca el secuenciador
    intro.call(function () { Reticula.secuenciador.preparar(); Reticula.secuenciador.iniciar(); }, null, 2.42);

    // saltar la carga con cualquier scroll o tecla
    function saltar() {
      if (intro.progress() < 1) intro.progress(1);
      ["wheel", "touchstart", "keydown"].forEach(function (ev) { window.removeEventListener(ev, saltar); });
    }
    ["wheel", "touchstart", "keydown"].forEach(function (ev) { window.addEventListener(ev, saltar, { passive: true }); });

    root.classList.remove("js-cargando");
    var arrancar = function () { intro.play(0); };
    var fuentes = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.race([fuentes, new Promise(function (r) { setTimeout(r, 1200); })]).then(function () {
      requestAnimationFrame(arrancar);
    });
    // mientras tanto, la escena queda en el estado inicial de la carga
    intro.progress(0).pause();

    /* ---------------- Encaje (clic mecánico) ---------------- */
    var encajado = false;
    function encaje(on) {
      if (on === encajado) return;
      encajado = on;
      if (on) {
        Dial.marcarActiva(1);
        Lecturas.fijarN(1, true);
        gsap.fromTo(D.reten, { rotation: 0.8, svgOrigin: "280 280" }, { rotation: 0, svgOrigin: "280 280", duration: 0.3, ease: "back.out(4)", overwrite: true });
        gsap.fromTo(D.partes.indice, { scale: 1 }, { scale: 1.45, transformOrigin: "50% 50%", duration: PASO / 2, ease: "power2.out", yoyo: true, repeat: 1, overwrite: true });
        gsap.fromTo(D.pupila, { opacity: 1 }, { keyframes: { opacity: [1, 0.45, 1, 0.45, 1] }, duration: PASO * 2, ease: "none", overwrite: true });
        Reticula.secuenciador.resincronizar();
      } else {
        Dial.marcarActiva(0);
        Lecturas.fijarN(0, false);
      }
    }

    var angEls = $$('[data-lectura="ang"]'), ultimoAng = "";
    function aplicarGiro(r, a) {
      var t = Lecturas.pad((((r % 360) + 360) % 360).toFixed(1).replace(".", ","), 5);
      if (t !== ultimoAng) { ultimoAng = t; angEls.forEach(function (e) { e.textContent = t; }); }
      Dial.fijarGiro(r);
      Dial.fijarAvance(a);
      Lecturas.fijarDistancia(Dial.distancia(a));
    }

    /* ---------------- Acople del dial a la barra ---------------- */
    function destinoAcople() {
      var G = Reticula.G;
      var r = $(".ranura").getBoundingClientRect();
      var s = 36 / (G.S * 440 / 560);
      return { x: r.left + r.width / 2 - G.cx, y: r.top + r.height / 2 - G.cy, s: s };
    }
    function tlAcople(tl) {
      tl.to(".dial", {
        x: function () { return destinoAcople().x; },
        y: function () { return destinoAcople().y; },
        scale: function () { return destinoAcople().s; },
        ease: "none", duration: 1
      }, 0);
      tl.to([D.partes.gEtqs, D.partes.gTicks, "#ojo-sup", "#ojo-inf", "#iris", "#pupila", "#hr"], { opacity: 0, ease: "none", duration: 0.5 }, 0);
      tl.to(Reticula.G.huecos, { attr: { r: 0 }, ease: "none", duration: 0.6 }, 0);
      return tl;
    }

    /* ---------------- Transición: se monta al terminar la carga ---------------- */
    var mm = null;
    function alTerminarIntro() {
      gsap.set(celdasNombre.concat([celdaProp], celdasFicha, celdasLectMovil), { clearProps: "clipPath" });
      if (mm) return;
      mm = gsap.matchMedia();

      mm.add("(min-width: 900px)", function () {
        root.classList.add("con-escena");
        var p = { r: Dial.R(0), a: 0 };
        var cerrar = celdasNombre.concat([celdaProp], celdasFicha);
        var tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "escena",
            trigger: ".escena",
            start: "top top",
            end: "+=160%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
            onUpdate: function (st) { encaje(st.progress >= 0.6); }
          }
        });
        cerrar.forEach(function (c, i) {
          var k = clips(c);
          tl.fromTo(c, { clipPath: k.abierta }, { clipPath: k.arriba, duration: 0.6, ease: "power2.inOut" }, i * 0.3);
        });
        var tr = $(".transito");
        tl.fromTo(tr, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power2.inOut" }, 2.1);
        tl.to(tr, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.6, ease: "power2.inOut" }, 6.3);
        tl.fromTo(".hilo--ficha", { scaleX: 1 }, { scaleX: 0, transformOrigin: "100% 50%", duration: 0.6, ease: "power2.inOut" }, 2.4);
        tl.fromTo(p, { r: Dial.R(0), a: 0 }, {
          r: Dial.R(1), a: 1 / N, duration: 4,
          onUpdate: function () { aplicarGiro(p.r, p.a); }
        }, 2);
        celdasSemana.forEach(function (c, i) {
          var k = clips(c);
          tl.fromTo(c, { clipPath: k.abajo }, { clipPath: k.abierta, duration: 0.6, ease: "power2.inOut" }, 6.5 + i * 0.3);
        });
        tl.to({}, { duration: 0.5 }, 9.5);

        var acople = tlAcople(gsap.timeline({
          scrollTrigger: { trigger: ".semana__cuerpo", pinnedContainer: ".escena", start: "top bottom", end: "top 35%", scrub: true, invalidateOnRefresh: true }
        }));
        Giro.observar(".escena");

        return function () {
          root.classList.remove("con-escena");
          encaje(false);
          aplicarGiro(Dial.R(0), 0);
        };
      });

      mm.add("(max-width: 899px)", function () {
        var cab = function () { return Reticula.G.cabezal; };
        var p = { r: Dial.R(0), a: 0 };

        // las filas de la portada se recogen hacia el cabezal
        var filasM = [[celdasNombre[0], celdasNombre[1]], [celdasNombre[2], celdasNombre[3]], [celdaProp],
                      [celdasFicha[0], celdasFicha[1]], [celdasFicha[2], celdasFicha[3]], celdasLectMovil];
        filasM.forEach(function (f) {
          var k = clips(f[0]);
          gsap.fromTo(f, { clipPath: k.abierta }, {
            clipPath: k.arriba, ease: "power2.in",
            scrollTrigger: { trigger: f[0], start: function () { return "top top+=" + cab(); }, end: function () { return "bottom top+=" + cab(); }, scrub: true, invalidateOnRefresh: true }
          });
        });

        // el dial gira mientras la lectura 01 entra; encaja al llegar
        gsap.fromTo(p, { r: Dial.R(0), a: 0 }, {
          r: Dial.R(1), a: 1 / N, ease: "none",
          onUpdate: function () { aplicarGiro(p.r, p.a); },
          scrollTrigger: {
            trigger: ".semana__cabecera", start: "top bottom", end: "top 62%", scrub: true,
            onUpdate: function (st) { encaje(st.progress >= 0.98); }
          }
        });

        // las celdas de la semana 01 se abren desde abajo
        celdasSemana.forEach(function (c) {
          if (!c.offsetParent) return;
          var k = clips(c);
          gsap.fromTo(c, { clipPath: k.abajo }, {
            clipPath: k.abierta, ease: "power2.out",
            scrollTrigger: { trigger: c, start: "top bottom", end: "top 78%", scrub: true }
          });
        });

        // acople: el cabezal se recoge a la barra y el dial va a su ranura
        var acople = tlAcople(gsap.timeline({
          scrollTrigger: { trigger: ".semana__cabecera", start: "top 50%", end: "top 8%", scrub: true, invalidateOnRefresh: true }
        }));
        acople.to(".cabezal__fondo", { scaleY: function () { return Reticula.G.barra / Reticula.G.cabezal; }, ease: "none", duration: 1 }, 0);
        acople.to(".cabezal__lineas", { opacity: 0, ease: "none", duration: 0.4 }, 0);
        Giro.observar(null);

        return function () { encaje(false); aplicarGiro(Dial.R(0), 0); };
      });

      ScrollTrigger.refresh();
    }

    /* Saltar a la semana: al final del pin, no al principio de la escena */
    $(".saltar").addEventListener("click", function (e) {
      var st = ScrollTrigger.getById("escena");
      if (!st) return;
      e.preventDefault();
      saltar();
      if (lenis) lenis.scrollTo(st.end + 2, { immediate: true }); else window.scrollTo(0, st.end + 2);
      $("#semana-01").focus({ preventScroll: true });
    });

    /* Redimensionar: se vuelve a medir la retícula */
    var t, anchoPrevio = root.clientWidth;
    ScrollTrigger.config({ ignoreMobileResize: true });
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        if (root.clientWidth === anchoPrevio && Reticula.G.movil) return; // barra del navegador móvil
        anchoPrevio = root.clientWidth;
        Reticula.medir();
        Reticula.dibujar();
        Reticula.secuenciador.preparar();
        ScrollTrigger.refresh();
      }, 180);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
})();
