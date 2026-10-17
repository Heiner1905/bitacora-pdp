/* Principal: pinta los datos, monta Lenis + GSAP y coreografía
   carga de la portada → el dial de combinación gira con retenes (cada número
   que pasa por la ranura cierra una celda de la portada) → clic de la cerradura:
   luz por todo el anillo, el iris se dilata y se cierra, el cilindro cede,
   el fragmento avanza y la lectura 01 se abre → el dial se acopla a la barra. */
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
  Lecturas.construirComb();
  Lecturas.fijarN(0);
  prepararBotones();

  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, CustomEase);
    CustomEase.create("reten", "M0,0 C0.3,0 0.25,1.12 0.62,1.02 0.75,0.99 0.88,1 1,1");
  }

  if (!conMovimiento) modoQuieto(); else modoVivo();

  /* ======================================================================
     Sin movimiento: estado final, sin pin, sin Lenis, sin inspección
     ====================================================================== */
  function modoQuieto() {
    root.classList.add("sin-movimiento");
    root.classList.remove("js-cargando");
    Dial.copiaEstatica($(".dial-estatico"), 1, rotular);
    if (window.gsap) {
      Giro.iniciar(S1.giro, false);
    } else {
      pintarTexto($("[data-giro-frase]"), S1.giro);
      $("[data-giro]").classList.add("inundado");
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) {
        var dentro = e[0].isIntersecting || e[0].boundingClientRect.top < 0;
        Lecturas.fijarN(dentro ? 1 : 0, false);
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
    var S = 360 / N;
    var PASOS = N + 1;                       // una vuelta completa más un número
    var R0 = Dial.R(0);

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    var lenis = null;
    if (window.Lenis) {
      lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    ScrollTrigger.config({ ignoreMobileResize: true });

    Lecturas.prepararInspeccion();
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
    var celdasNumero = $$(".celda--numero");
    var celdaEtiqueta = $(".celda--etiqueta");
    var celdaTitulo = $(".celda--titulo");
    var celdaReflexion = $(".celda--reflexion");
    var tiras = $$("[data-tira]");
    var cifras = $$(".numero__cifra");
    var ojo = ["#ojo-sup", "#ojo-inf", "#iris", "#hr"];

    /* ---------------- La tira: la combinación marcándose ---------------- */
    tiras.forEach(function (t) {
      var h = '<p class="rotulo">Combinación</p><div class="tira__ns" style="grid-template-columns:repeat(' + N + ',minmax(0,1fr))">';
      for (var i = 1; i <= N; i++) {
        h += '<span class="tira__slot"><span class="tira__n' + (i === 1 ? " activa" : "") + '">––</span><span class="tira__barra"><i></i></span></span>';
      }
      h += '</div><div class="tira__pie"><p class="lectura tira__estado">Marcando la semana 01</p>' +
        '<p class="lectura"><span class="lectura__rotulo">Retén</span> <span class="tira__reten">00</span> de ' + pad2(PASOS) + '</p></div>';
      t.innerHTML = h;
    });
    var tiraN1 = $$(".tira__slot:first-child .tira__n");
    var tiraBarra = $$(".tira__slot:first-child .tira__barra i");
    var tiraReten = $$(".tira__reten");
    var tiraEstado = $$(".tira__estado");
    function tiraMarcada(on) {
      tiraN1.forEach(function (e) { e.textContent = on ? "01" : "––"; e.classList.toggle("marcada", on); });
      tiraEstado.forEach(function (e) { e.textContent = on ? "Semana 01 marcada" : "Marcando la semana 01"; });
    }

    // la lectura 01 está cerrada hasta que la cerradura hace clic
    celdasNumero.concat([celdaEtiqueta, celdaTitulo, celdaReflexion], tiras).forEach(function (c) { gsap.set(c, { clipPath: clips(c).abajo }); });
    gsap.set(D.iris, { svgOrigin: "200 196" });
    gsap.set(D.pupila, { svgOrigin: "200 200", rotation: 0 });

    /* ---------------- Carga de la portada (≈ 2,9 s, a 124 BPM) ---------------- */
    var esMovil = Reticula.G.movil;
    var anilloLong = D.anillo.getTotalLength();
    var intro = gsap.timeline({ paused: true, onComplete: alTerminarIntro });

    intro.fromTo(".lecturas__celda", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: PASO, ease: "steps(4)", stagger: PASO / 2 }, 0);
    intro.from($$(".portada .hilo"), { scaleX: 0, duration: PULSO, ease: "power2.out", stagger: PASO / 2 }, PASO / 2);

    // el nombre se descubre celda por celda (bombo en 1, 3, 5, 7)
    celdasNombre.forEach(function (c, i) {
      intro.fromTo(c, { clipPath: clips(c).abajo }, { clipPath: clips(c).abierta, duration: PASO, ease: "power2.out" }, PULSO + i * PULSO);
    });

    // la perilla aparece: banda torneada, estrías en barrido, marcas y números
    intro.from(".dial .bisel__banda, .dial .bisel__torno, .dial .bisel__canto, .dial .bisel__brillo", { opacity: 0, duration: PASO, ease: "steps(2)" }, PULSO);
    intro.from(".dial .bisel__estria", { opacity: 0, duration: 0.01, stagger: 0.005, ease: "none" }, PULSO + PASO);
    intro.fromTo(D.anillo, { strokeDasharray: anilloLong, strokeDashoffset: anilloLong }, { strokeDashoffset: 0, duration: 1.21, ease: "steps(36)" }, PULSO + PASO);
    intro.from(".dial .bisel__mayor, .dial .bisel__tick", { opacity: 0, duration: PASO, ease: "steps(2)", stagger: 0.01 }, 1.1);
    intro.from(D.partes.etqs, { opacity: 0, duration: PASO, ease: "steps(2)", stagger: PASO / 4 }, 1.3);
    ["#ojo-sup", "#ojo-inf", "#iris", "#pupila", "#hr"].forEach(function (s, i) {
      intro.from(s, { opacity: 0, duration: PASO, ease: "steps(2)" }, 1.452 + i * PASO * 0.5);
    });
    intro.from(".dial .bisel__ventana", { opacity: 0, duration: PASO, ease: "steps(2)" }, 1.936);
    intro.from(D.frag, { opacity: 0, duration: PASO, ease: "steps(2)" }, 1.936);
    intro.fromTo(D.partes.indice, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: PASO, ease: "back.out(3)" }, 1.936);

    var filas = esMovil
      ? [[celdaProp], [celdasFicha[0], celdasFicha[1]], [celdasFicha[2], celdasFicha[3]], celdasLectMovil]
      : [[celdaProp, celdasFicha[0], celdasFicha[1]], [celdasFicha[2], celdasFicha[3]]];
    filas.forEach(function (f, i) {
      intro.fromTo(f, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: PASO * 2, ease: "power2.inOut" }, 1.936 + i * PASO);
    });

    function saltar() {
      if (intro.progress() < 1) intro.progress(1);
      ["wheel", "touchstart", "keydown"].forEach(function (ev) { window.removeEventListener(ev, saltar); });
    }
    ["wheel", "touchstart", "keydown"].forEach(function (ev) { window.addEventListener(ev, saltar, { passive: true }); });

    root.classList.remove("js-cargando");
    intro.progress(0).pause();
    var fuentes = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.race([fuentes, new Promise(function (r) { setTimeout(r, 1200); })]).then(function () {
      requestAnimationFrame(function () { intro.play(0); });
    });

    /* ---------------- El giro con retenes ---------------- */
    // la perilla se detiene en cada número y salta al siguiente (como una combinación)
    function reten(x) {
      var i = Math.floor(x), f = x - i;
      if (f <= 0.3) return i;
      if (f >= 0.7) return i + 1;
      var t = (f - 0.3) / 0.4;
      return i + t * t * (3 - 2 * t);
    }
    var ultimoNumero = -1;
    function girar(u) {
      var x = reten(u * PASOS);
      Dial.fijarGiro(R0 + S * x);
      var n = Math.floor(x + 0.5);
      tiraBarra.forEach(function (b) { b.style.transform = "scaleX(" + u.toFixed(4) + ")"; });
      if (n !== ultimoNumero) {
        if (ultimoNumero >= 0 && n < PASOS) tic();
        ultimoNumero = n;
        tiraReten.forEach(function (e) { e.textContent = pad2(n); });
      }
    }
    // cada número que pasa por la ranura: un golpe seco de la perilla y del índice
    function tic() {
      gsap.fromTo(D.reten, { rotation: 1.8, svgOrigin: "280 280" }, { rotation: 0, svgOrigin: "280 280", duration: 0.2, ease: "power3.out", overwrite: true });
      gsap.fromTo(D.partes.indice, { scale: 1.35 }, { scale: 1, transformOrigin: "50% 50%", duration: PASO, ease: "power2.out", overwrite: true });
    }

    /* ---------------- El clic de la cerradura ---------------- */
    // abrir: lo que la cerradura destapa; cerrar: lo que se recoge para dejarle sitio
    var conjunto = { abrir: [], cerrar: [] };
    var encajado = false, tlEnc = null;
    var frag = { a: 0 };
    function encaje(on) {
      if (on === encajado) return;
      encajado = on;
      if (tlEnc) tlEnc.kill();
      gsap.set(cifras, { clearProps: "color" });
      var L = D.largoAnillo;
      tlEnc = gsap.timeline();
      if (on) {
        Dial.marcarActiva(1);
        tiraMarcada(true);
        // el retén: la perilla se pasa y vuelve
        tlEnc.fromTo(D.reten, { rotation: 5, svgOrigin: "280 280" }, { rotation: 0, svgOrigin: "280 280", duration: 0.5, ease: "back.out(3.4)" }, 0);
        tlEnc.fromTo(D.partes.indice, { scale: 1 }, { scale: 1.8, transformOrigin: "50% 50%", duration: PASO / 2, ease: "power2.out", yoyo: true, repeat: 1 }, 0);
        tlEnc.fromTo(D.partes.ventanaLuz, { opacity: 0.95 }, { opacity: 0, duration: PULSO * 1.5, ease: "power2.in" }, 0);
        // la luz rasante da una vuelta entera a la perilla
        tlEnc.fromTo(D.partes.sectores, { rotation: 0, svgOrigin: "280 280" }, { rotation: 360, svgOrigin: "280 280", duration: PULSO * 1.5, ease: "power2.inOut" }, 0.02);
        // y otra luz recorre el anillo del símbolo y se va
        tlEnc.fromTo(D.luzAnillo, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: PULSO, ease: "power2.inOut" }, 0.04);
        tlEnc.to(D.luzAnillo, { strokeDashoffset: -L, duration: PULSO, ease: "power2.in" }, 0.04 + PULSO);
        // el iris, lente del mecanismo, se dilata y se cierra
        tlEnc.to(D.iris, { scale: 1.5, duration: 0.14, ease: "power2.out" }, 0);
        tlEnc.to(D.iris, { scale: 0.68, duration: 0.22, ease: "power2.inOut" }, 0.14);
        tlEnc.to(D.iris, { scale: 1, duration: 0.36, ease: "reten" }, 0.36);
        // el cilindro de la cerradura cede: gira un cuarto y se asienta en su avance
        tlEnc.to(D.pupila, { rotation: 90, duration: PASO, ease: "power3.out" }, PASO / 2);
        tlEnc.to(D.pupila, { rotation: 90 / N, duration: PULSO, ease: "reten" }, PASO * 1.6);
        // el fragmento avanza un tramo claro hacia la ranura
        tlEnc.to(frag, { a: 1 / N, duration: PULSO * 1.4, ease: "reten", onUpdate: function () { Dial.fijarAvance(frag.a); } }, PASO);
        tlEnc.call(function () { Lecturas.fijarN(1, true); }, null, PASO);
        // se recoge lo que había y se abre la lectura 01, al compás
        conjunto.cerrar.forEach(function (c, i) {
          tlEnc.to(c, { clipPath: clips(c).arriba, duration: PASO * 1.5, ease: "power2.in" }, PASO + i * PASO / 4);
        });
        conjunto.abrir.forEach(function (c, i) {
          var k = clips(c);
          tlEnc.fromTo(c, { clipPath: k.abajo }, { clipPath: k.abierta, duration: PASO * 2, ease: "power2.out" }, PASO * 2.5 + i * PASO / 2);
        });
        // destello seco del número (sin tonos intermedios)
        tlEnc.set(cifras, { color: "#F28C38" }, PASO * 2.5);
        tlEnc.set(cifras, { clearProps: "color" }, PASO * 2.5 + PULSO * 1.5);
      } else {
        Dial.marcarActiva(0);
        Lecturas.fijarN(0, false);
        tiraMarcada(false);
        tlEnc.to(frag, { a: 0, duration: PASO * 2, ease: "power2.out", onUpdate: function () { Dial.fijarAvance(frag.a); } }, 0);
        tlEnc.to(D.pupila, { rotation: 0, duration: PASO * 2, ease: "power2.out" }, 0);
        tlEnc.to(D.iris, { scale: 1, duration: PASO }, 0);
        tlEnc.set(D.luzAnillo, { strokeDashoffset: L }, 0);
        tlEnc.set(D.partes.sectores, { rotation: 0, svgOrigin: "280 280" }, 0);
        conjunto.abrir.slice().reverse().forEach(function (c, i) {
          tlEnc.to(c, { clipPath: clips(c).abajo, duration: PASO, ease: "power2.in" }, i * PASO / 4);
        });
        conjunto.cerrar.forEach(function (c, i) {
          tlEnc.to(c, { clipPath: clips(c).abierta, duration: PASO * 1.5, ease: "power2.out" }, PASO + i * PASO / 4);
        });
      }
    }

    /* ---------------- Pose del dial: en su sitio ↔ acoplado en la barra ----------------
       Interpolación lineal atada al scroll: mientras el sitio reservado del dial sale
       por arriba, el dial se encoge hacia la ranura de la barra sin salir de ese sitio.
       Su borde inferior siempre queda por encima del contenido. */
    var fase = { a: 0, b: 0, c: 0 };
    function destinoAcople() {
      var G = Reticula.G;
      var r = $(G.movil ? ".ranura--movil" : ".ranura--escritorio").getBoundingClientRect();
      return { x: r.left + r.width / 2 - G.cx, y: r.top + r.height / 2 - G.cy, s: 40 / (G.S * 600 / 560) };
    }
    var setDial = gsap.quickSetter(".dial", "css");
    var ultimaPose = "";
    function pose() {
      var d = destinoAcople();
      var t = fase.c > 0 ? fase.c : (fase.b > 0 ? 1 - fase.b : fase.a);
      var x = d.x * t, y = d.y * t, s = 1 + (d.s - 1) * t;
      var clave = x.toFixed(1) + "|" + y.toFixed(1) + "|" + s.toFixed(4);
      if (clave === ultimaPose) return;
      ultimaPose = clave;
      setDial({ x: x, y: y, scale: s });
      var vis = Math.max(0, Math.min(1, 1 - t * 1.8));
      gsap.set([D.partes.gEtqs, D.partes.gTicks, D.partes.gEstrias].concat(D.partes.brillos, ojo), { opacity: vis });
    }
    function fijarFase(k) { return function (st) { fase[k] = st.progress; pose(); }; }

    /* ---------------- Transición: se monta al terminar la carga ---------------- */
    var mm = null;
    function alTerminarIntro() {
      gsap.set(celdasNombre.concat([celdaProp], celdasFicha, celdasLectMovil), { clearProps: "clipPath" });
      if (mm) return;
      mm = gsap.matchMedia();

      mm.add("(min-width: 900px)", function () {
        root.classList.add("con-escena");
        conjunto.cerrar = celdasNombre.concat(tiras);
        conjunto.abrir = celdasNumero.concat([celdaTitulo, celdaEtiqueta, celdaReflexion]);
        var G = 8.6;                                  // el giro ocupa 8,6 de 10
        var giro = { u: 0 };
        var tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "escena", trigger: ".escena", start: "top top", end: "+=120%",
            pin: true, scrub: true, anticipatePin: 1,
            onUpdate: function (st) { encaje(st.progress >= 0.86); }
          }
        });
        tl.fromTo(giro, { u: 0 }, { u: 1, duration: G, onUpdate: function () { girar(giro.u); } }, 0);
        // la fila de abajo cede su sitio a la combinación que se va marcando
        var paso = G / PASOS, dur = paso * 0.5;
        [celdaProp].concat(celdasFicha).forEach(function (c, i) {
          tl.fromTo(c, { clipPath: clips(c).abierta }, { clipPath: clips(c).arriba, duration: dur, ease: "power2.inOut" }, paso * (0.15 + i * 0.22));
        });
        tl.fromTo(".hilo--ficha", { scaleX: 1 }, { scaleX: 0, transformOrigin: "100% 50%", duration: dur, ease: "power2.inOut" }, paso * 0.6);
        tl.fromTo(tiras[0], { clipPath: clips(tiras[0]).abajo }, { clipPath: clips(tiras[0]).abierta, duration: dur * 1.4, ease: "power2.out", immediateRender: false }, paso * 1.0);
        tl.to({}, { duration: 10 - G }, G);
        var pinST = tl.scrollTrigger;

        // tras el clic, el dial se acopla mientras la lámina sube
        ScrollTrigger.create({
          start: function () { return pinST.end; },
          end: function () { return pinST.end + Reticula.G.yF - Reticula.G.barra; },
          onUpdate: fijarFase("c"), onRefresh: fijarFase("c")
        });
        Giro.observar(".escena");

        return function () {
          root.classList.remove("con-escena");
          encaje(false); girar(0);
          fase.c = 0; pose();
        };
      });

      mm.add("(max-width: 899px)", function () {
        conjunto.cerrar = tiras;
        conjunto.abrir = celdasNumero.concat([celdaEtiqueta, celdaReflexion]);
        var giro = { u: 0 };
        var recorrido = function () { return Reticula.G.cabezal - Reticula.G.barra; };
        // 1 · al bajar, el dial se encoge dentro de su sitio hacia la barra (no tapa la portada)
        ScrollTrigger.create({ start: 0, end: recorrido, onUpdate: fijarFase("a"), onRefresh: fijarFase("a") });
        // 2 · la cabecera de la semana se fija; el dial baja de la barra a su ranura y gira
        var tlM = gsap.timeline();
        tlM.fromTo(giro, { u: 0 }, { u: 1, duration: 0.71, ease: "none", onUpdate: function () { girar(giro.u); } }, 0.15);
        tlM.fromTo([tiras[1], celdaTitulo], { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.08, ease: "power2.out", immediateRender: false }, 0.1);
        tlM.to({}, { duration: 0.14 }, 0.86);
        var pin = ScrollTrigger.create({
          id: "escena", trigger: ".semana__cabecera", start: function () { return "top " + Reticula.G.barra + "px"; }, end: "+=110%",
          pin: true, scrub: true, animation: tlM,
          onUpdate: function (st) { encaje(st.progress >= 0.86); }
        });
        ScrollTrigger.create({
          start: function () { return pin.start; }, end: function () { return pin.start + (pin.end - pin.start) * 0.15; },
          onUpdate: fijarFase("b"), onRefresh: fijarFase("b")
        });
        // 3 · se acopla de nuevo para leer
        ScrollTrigger.create({
          start: function () { return pin.end; }, end: function () { return pin.end + recorrido(); },
          onUpdate: fijarFase("c"), onRefresh: fijarFase("c")
        });
        Giro.observar(null);

        return function () { encaje(false); girar(0); fase.a = fase.b = fase.c = 0; pose(); };
      });

      ScrollTrigger.refresh();
    }

    /* Foco con teclado: si el elemento queda fuera de la vista (p. ej. dentro de la
       escena fijada), se lleva a la vista. */
    document.addEventListener("focusin", function (e) {
      var el = e.target;
      if (!el || !el.getBoundingClientRect || el === document.body) return;
      var r = el.getBoundingClientRect();
      if (r.top >= 64 && r.bottom <= window.innerHeight - 16) return;
      var st = ScrollTrigger.getById("escena");
      var escena = $(".escena");
      var destino;
      if (st && !Reticula.G.movil && escena.contains(el)) {
        var off = r.top - escena.getBoundingClientRect().top;
        destino = off < window.innerHeight * 0.7 ? st.start : st.end + off - window.innerHeight * 0.35;
      } else {
        destino = window.scrollY + r.top - window.innerHeight * 0.35;
      }
      destino = Math.max(0, destino);
      if (lenis) lenis.scrollTo(destino, { immediate: true }); else window.scrollTo(0, destino);
    });

    /* Saltar a la semana: al final del giro */
    $(".saltar").addEventListener("click", function (e) {
      var st = ScrollTrigger.getById("escena");
      if (!st) return;
      e.preventDefault();
      saltar();
      if (lenis) lenis.scrollTo(st.end + 2, { immediate: true }); else window.scrollTo(0, st.end + 2);
      $("#semana-01").focus({ preventScroll: true });
    });

    var t, anchoPrevio = root.clientWidth;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        if (root.clientWidth === anchoPrevio && Reticula.G.movil) return; // barra del navegador móvil
        anchoPrevio = root.clientWidth;
        Reticula.medir();
        Reticula.dibujar();
        ultimaPose = "";
        ScrollTrigger.refresh();
      }, 180);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
})();
