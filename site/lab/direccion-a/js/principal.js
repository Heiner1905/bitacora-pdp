/* FRAGMENTO.EXE · Dirección A · principal
   1) Pinta los textos desde window.BITACORA (nada de contenido en el HTML).
   2) Monta el movimiento con gsap.matchMedia(): escritorio, móvil y reduced-motion.
      - Entrada: claqueta descifrada → partículas que arman el símbolo → nombre que se proyecta.
      - Pin con scrub: telón, el ojo despierta, la cámara entra por la cerradura, corte, escena 01.
      - GIRO: corte a negro y descifrado por estados (solo si la frase no es [PENDIENTE]).
   3) Reduced motion: estado final, sin pin, sin Lenis, sin canvas ni cursor. */
(function () {
  "use strict";

  var B = window.BITACORA;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var pad = function (k) { return String(k).padStart(2, "0"); };
  var N = B.semanas.length;
  var DEMO_GIRO = /[?&]demo-giro\b/.test(location.search);

  /* ---------- Contenido ---------- */
  function esPendiente(v) { return typeof v === "string" && v.indexOf("[PENDIENTE") === 0; }
  function pintarTexto(el, valor) {
    if (!el) return;
    el.textContent = valor;
    if (esPendiente(valor)) { el.classList.add("pendiente"); el.setAttribute("data-pendiente", "true"); }
    else { el.classList.remove("pendiente"); el.removeAttribute("data-pendiente"); }
  }
  function campo(nombre, valor) { $$('[data-campo="' + nombre + '"]').forEach(function (el) { pintarTexto(el, valor); }); }
  function crear(tag, clase, texto) {
    var el = document.createElement(tag);
    if (clase) el.className = clase;
    if (texto != null) pintarTexto(el, texto);
    return el;
  }
  var ESTADOS = { "pendiente": "Pendiente", "en-curso": "En curso", "completada": "Completada" };

  function pintarPortada() {
    var a = B.autor;
    var partes = a.nombreCorto.split(" ");
    campo("proyecto", B.proyecto);
    campo("ficha", "Bitácora · " + a.materiaCorta + " · " + a.periodo);
    campo("nombre-1", partes[0]);
    campo("nombre-2", partes.slice(1).join(" "));
    campo("h1-sufijo", ", bitácora de " + a.materia);
    campo("proposito", B.proposito);
    campo("nombre", a.nombre);
    campo("codigo", a.codigo);
    campo("programa", a.programa);
    campo("semestre", a.semestre);
    campo("materia", a.materia);
    campo("periodo", a.periodo);
    campo("pie", B.proyecto + " · prototipo de la dirección A · " + a.nombreCorto + " · " + a.periodo);
    $(".claqueta__n").textContent = pad(N);
  }

  function pintarSemana(s) {
    var k = pad(s.numero);
    var sec = crear("section", "semana");
    sec.id = s.id;
    sec.setAttribute("aria-labelledby", "s" + k + "-titulo");
    sec.tabIndex = -1;

    var cab = crear("div", "semana__cabecera");
    var luz = crear("div", "semana__luz");
    luz.setAttribute("aria-hidden", "true");
    cab.appendChild(luz);
    var num = crear("p", "semana__numero", k);
    num.setAttribute("aria-hidden", "true");
    var txt = crear("div", "semana__texto");
    var clave = crear("p", "semana__clave", "SEMANA_" + k);
    var h2 = crear("h2", "semana__titulo", s.titulo);
    h2.id = "s" + k + "-titulo";
    var dl = crear("dl", "semana__datos");
    [["Fecha", s.fecha], ["Estado", ESTADOS[s.estado] || s.estado]].forEach(function (par) {
      var d = crear("div");
      d.appendChild(crear("dt", null, par[0]));
      d.appendChild(crear("dd", null, par[1]));
      dl.appendChild(d);
    });
    var refl = crear("p", "semana__reflexion", s.reflexion);
    txt.append(clave, h2, dl, refl);
    cab.append(num, txt);

    var cuerpo = crear("div", "semana__cuerpo");
    (s.bloques || []).forEach(function (b) {
      var art = crear("article", "bloque bloque--" + b.tipo);
      art.appendChild(crear("h3", "bloque__titulo", b.titulo));
      if (b.tipo === "lista") {
        var ul = crear("ul", "bloque__lista");
        (b.items || []).forEach(function (it) {
          var li = crear("li");
          li.appendChild(crear("span", null, it));
          ul.appendChild(li);
        });
        art.appendChild(ul);
      } else {
        var p = crear("p", "bloque__texto");
        p.appendChild(crear("span", null, b.texto));
        art.appendChild(p);
      }
      cuerpo.appendChild(art);
    });

    var giro = crear("section", "giro");
    giro.id = "giro-" + k;
    giro.setAttribute("aria-labelledby", "giro-" + k + "-rotulo");
    giro.setAttribute("data-cursor", "giro");
    var marco = crear("div", "giro__marco");
    var rot = crear("h3", "giro__rotulo", "Giro");
    rot.id = "giro-" + k + "-rotulo";
    var frase = DEMO_GIRO ? "Frase de muestra: aquí irá el giro de la semana, escrito por Heiner." : s.giro;
    var fr = crear("p", "giro__frase", frase);
    marco.append(rot, fr);
    if (DEMO_GIRO) {
      marco.appendChild(crear("p", "giro__muestra dato", "Muestra del efecto · no es contenido de la bitácora"));
    }
    var nota = crear("p", "giro__nota");
    var enlace = crear("a", null, DEMO_GIRO ? "Volver a la versión con el pendiente" : "Ver el descifrado con una frase de muestra");
    enlace.href = DEMO_GIRO ? location.pathname + "#giro-" + k : "?demo-giro#giro-" + k;
    nota.appendChild(enlace);
    marco.appendChild(nota);
    giro.appendChild(marco);

    sec.append(cab, cuerpo, giro);
    return sec;
  }

  pintarPortada();
  // Alcance del prototipo: solo la semana 01 (el contador y el avance usan N real)
  $("[data-semanas]").appendChild(pintarSemana(B.semanas[0]));

  /* ---------- Grano: una baldosa de ruido generada una sola vez ---------- */
  (function grano() {
    try {
      var c = document.createElement("canvas"); c.width = c.height = 200;
      var g = c.getContext("2d"), img = g.createImageData(200, 200), d = img.data;
      for (var i = 0; i < d.length; i += 4) {
        var v = Math.random() * 255 | 0;
        d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = Math.random() * 40 | 0;
      }
      g.putImageData(img, 0, 0);
      $(".grano").style.backgroundImage = "url(" + c.toDataURL("image/png") + ")";
    } catch (e) { /* sin grano: no pasa nada */ }
  })();

  /* Sin GSAP (CDN caído): todo queda visible y estático */
  if (!window.gsap || !window.ScrollTrigger) {
    document.documentElement.classList.remove("precarga");
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase);
  CustomEase.create("proyector", "M0,0 C0.62,0 0.12,1 1,1");
  ScrollTrigger.config({ ignoreMobileResize: true });
  if ("scrollRestoration" in history && !location.hash) history.scrollRestoration = "manual";

  var esperaFuentes = Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise(function (r) { setTimeout(r, 2500); })
  ]);

  esperaFuentes.then(function () {
    if (!location.hash) window.scrollTo(0, 0);
    montar();
  });

  /* ---------- Estado compartido ---------- */
  var portada = $("#portada");
  var simbolo = $(".simbolo");
  var mover = $(".simbolo__mover");
  var zoom = $(".simbolo__zoom");
  var svg = $(".simbolo__svg");
  var canvas = $(".particulas");
  var claqueta = $(".claqueta");
  var semana = $("#semana-01");
  var cabecera = $(".semana__cabecera", semana);
  var giro = $(".giro", semana);
  var particulas = null;
  var entradaHecha = false;
  var lenis = null;

  function fijarEscena(k, inmediato) {
    var el = $(".claqueta__k");
    var txt = pad(k);
    claqueta.classList.toggle("es-solida", k > 0);
    if (el.textContent === txt) return;
    if (inmediato || !window.ScrambleTextPlugin) el.textContent = txt;
    else gsap.to(el, { duration: 0.5, scrambleText: { text: txt, chars: "0123456789", speed: 0.8 } });
    var r = 1 - k / N;
    gsap.to("#mini-fragmento", { x: 30 * r, y: -30 * r, duration: inmediato ? 0 : 0.9, ease: "power3.out" });
  }

  /* Navegación por anclas: con Lenis cuando existe; el foco va al destino */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    var destino = id ? document.getElementById(id) : null;
    if (!destino) return;
    e.preventDefault();
    var enfocar = function () {
      if (!destino.hasAttribute("tabindex")) destino.setAttribute("tabindex", "-1");
      destino.focus({ preventScroll: true });
    };
    if (lenis) lenis.scrollTo(destino, { duration: 1.8, onComplete: enfocar });
    else { destino.scrollIntoView(); enfocar(); }
    history.replaceState(null, "", "#" + id);
  });

  function montar() {
    document.documentElement.classList.remove("precarga");
    var mm = gsap.matchMedia();
    mm.add({
      desk: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
      mob: "(max-width: 899px) and (prefers-reduced-motion: no-preference)",
      rm: "(prefers-reduced-motion: reduce)"
    }, function (ctx) {
      var c = ctx.conditions;
      if (c.rm) return modoQuieto();
      return modoMovimiento(c.desk);
    });
    document.documentElement.classList.remove("precarga");
  }

  /* =========================================================
     Reduced motion: estado final, sin movimiento
     ========================================================= */
  function modoQuieto() {
    gsap.from(svg, { opacity: 0, duration: 0.2 });
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) fijarEscena(en.target === portada ? 0 : 1, true);
      });
    }, { threshold: 0.5 });
    io.observe(portada);
    io.observe(cabecera);
    var texto = $(".bajar__texto");
    var antes = texto.textContent;
    texto.textContent = "Bajar a la semana 01";
    return function () { io.disconnect(); texto.textContent = antes; };
  }

  /* =========================================================
     Movimiento (escritorio y móvil)
     ========================================================= */
  function modoMovimiento(desk) {
    var punteroFino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var limpiezas = [];

    /* --- Lenis: un dolly de cámara pesado; en táctil manda el pulgar --- */
    if (window.Lenis) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true, syncTouch: false });
      lenis.on("scroll", ScrollTrigger.update);
      var tick = function (t) { lenis.raf(t * 1000); };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      limpiezas.push(function () { gsap.ticker.remove(tick); lenis.destroy(); lenis = null; gsap.ticker.lagSmoothing(500, 33); });
    }

    var iris = svg.querySelector("#iris"), pupila = svg.querySelector("#pupila");
    var frag = svg.querySelector("#fragmento"), flota = svg.querySelector(".flota");
    var lids = svg.querySelectorAll("#ojo-sup, #ojo-inf");
    var marco = svg.querySelector(".marco"), borde = svg.querySelector(".borde");
    var fondo = $(".portada__fondo");
    var nombreA = $(".nombre__linea--a"), nombreB = $(".nombre__linea--b");

    /* --- Partículas (una sola instancia; se recalcula al cambiar de tamaño) --- */
    if (!particulas && window.Particulas) {
      try { particulas = Particulas.crear({ svg: svg, canvas: canvas, movil: !desk, alReposar: reposarParticulas }); }
      catch (e) { particulas = null; }
    } else if (particulas) particulas.rehacer();
    var canvasActivo = false;
    function mostrarParticulas() {
      if (!particulas || canvasActivo || window.scrollY > 4) return;
      canvasActivo = true;
      gsap.to(canvas, { autoAlpha: 1, duration: 0.25, overwrite: true });
      gsap.to(svg, { opacity: 0, duration: 0.25, overwrite: true });
      particulas.activar();
    }
    function reposarParticulas() {
      canvasActivo = false;
      gsap.to(svg, { opacity: 1, duration: 0.4, overwrite: true });
      gsap.to(canvas, { autoAlpha: 0, duration: 0.4, overwrite: true, onComplete: function () { if (!canvasActivo) particulas.detener(); } });
    }
    function apagarParticulas() {
      if (!particulas) return;
      if (particulas.ensamblando()) particulas.terminarYa();
      if (canvasActivo || gsap.getProperty(canvas, "opacity") > 0) {
        canvasActivo = false;
        particulas.detener();
        gsap.set(canvas, { autoAlpha: 0, overwrite: true });
        gsap.set(svg, { opacity: 1, overwrite: true });
      }
    }
    // pausa fuera de vista y con la pestaña oculta
    var onVis = function () { if (particulas) particulas.pausar(document.hidden); };
    document.addEventListener("visibilitychange", onVis);
    limpiezas.push(function () { document.removeEventListener("visibilitychange", onVis); });

    /* --- La mirada: iris y pupila siguen al cursor (máx. 10 unidades del viewBox) --- */
    var mirarX = gsap.quickTo([iris, pupila], "x", { duration: 0.5, ease: "power3" });
    var mirarY = gsap.quickTo([iris, pupila], "y", { duration: 0.5, ease: "power3" });
    var pm = particulas ? particulas.mirada : { x: 0, y: 0 };
    var pmX = gsap.quickTo(pm, "x", { duration: 0.5, ease: "power3" });
    var pmY = gsap.quickTo(pm, "y", { duration: 0.5, ease: "power3" });
    var mirando = true;
    function mirar(px, py) {
      if (!mirando) return;
      var r = svg.getBoundingClientRect();
      var cx = r.left + r.width * 0.5, cy = r.top + r.height * 0.49;
      var dx = px - cx, dy = py - cy, d = Math.hypot(dx, dy) || 1;
      var f = Math.min(1, d / (r.width * 0.9)) * 10;
      var mx = dx / d * f, my = dy / d * f * 0.7;
      mirarX(mx); mirarY(my); pmX(mx); pmY(my);
    }
    function soltarMirada() { mirarX(0); mirarY(0); pmX(0); pmY(0); }

    function sobreSimbolo(px, py) {
      if (window.scrollY > 4) return false;
      var r = svg.getBoundingClientRect(), m = 24;
      return px > r.left - m && px < r.right + m && py > r.top - m && py < r.bottom + m;
    }

    if (punteroFino && window.CursorOjo) {
      var cursor = CursorOjo.iniciar({
        sobreSimbolo: sobreSimbolo,
        alMover: function (px, py) {
          mirar(px, py);
          if (!particulas) return;
          var dentro = sobreSimbolo(px, py);
          particulas.puntero(px, py, dentro);
          if (dentro && entradaHecha && !particulas.ensamblando()) mostrarParticulas();
        }
      });
      limpiezas.push(cursor.destruir);
    } else {
      // táctil: un toque sobre el símbolo dispersa las partículas cercanas al dedo
      var toque = function (e) {
        if (!particulas || !entradaHecha || particulas.ensamblando()) return;
        if (!sobreSimbolo(e.clientX, e.clientY)) return;
        mostrarParticulas();
        particulas.dispersar(e.clientX, e.clientY);
      };
      simbolo.addEventListener("pointerdown", toque, { passive: true });
      limpiezas.push(function () { simbolo.removeEventListener("pointerdown", toque); });
    }

    /* --- El fragmento flota fuera del anillo (±1,5 unidades, 4 s) --- */
    var pf = particulas ? particulas.flota : { y: 0 };
    var flotar = gsap.fromTo(flota, { y: -1.5 }, { y: 1.5, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1 });
    var flotarP = gsap.fromTo(pf, { y: -1.5 }, { y: 1.5, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1 });

    /* =========================================================
       Transición portada → SEMANA_01 (pin + scrub 1:1)
       ========================================================= */
    var factorPin = desk ? 1.5 : 1.1;
    function vh() { return window.innerHeight; }
    function pinLen() { return vh() * factorPin; }
    function inicioPin() { return Math.max(0, portada.offsetHeight - vh()); }
    function margenSemana() {
      // el top de la semana llega a 0 justo cuando termina el pin
      semana.style.marginTop = Math.max(0, inicioPin() + pinLen() - portada.offsetHeight) + "px";
    }
    margenSemana();
    ScrollTrigger.addEventListener("refreshInit", margenSemana);
    limpiezas.push(function () { ScrollTrigger.removeEventListener("refreshInit", margenSemana); semana.style.marginTop = ""; });

    function geo() {
      var w = simbolo.offsetWidth;
      var topPin = Math.min(0, vh() - portada.offsetHeight);
      var cx = simbolo.offsetLeft + w / 2, cy = simbolo.offsetTop + w / 2 + topPin;
      var esc = 1.35;
      var base = w / 400;
      // el centro del círculo de la cerradura (200,190) queda en el centro de la pantalla
      var dx = window.innerWidth / 2 - cx;
      var dy = vh() / 2 - cy + 0.025 * w * esc;
      // escala para que el hueco circular (r = 8) cubra toda la pantalla
      var S = Math.hypot(window.innerWidth / 2, vh() / 2) / 8 * 1.1;
      return { dx: dx, dy: dy, esc: esc, base: base, zoom: S / (base * esc) };
    }
    var G = geo();

    var revelada = false;
    var tituloSplit = null;
    var clave = $(".semana__clave", semana);
    var titulo = $(".semana__titulo", semana);
    var numero = $(".semana__numero", semana);
    var claveTexto = clave.textContent;
    // estados previos de la cabecera (se resuelven al llegar; la reflexión nunca se anima)
    tituloSplit = SplitText.create(titulo, { type: "lines", mask: "lines", linesClass: "linea" });
    gsap.set(tituloSplit.lines, { yPercent: 105 });
    gsap.set(clave, { autoAlpha: 0 });
    limpiezas.push(function () { if (tituloSplit) tituloSplit.revert(); clave.textContent = claveTexto; });

    function revelarSemana() {
      if (revelada) return;
      revelada = true;
      var tl = gsap.timeline();
      tl.set(clave, { autoAlpha: 1, textContent: "_________" })
        .to(clave, { duration: 0.8, scrambleText: { text: claveTexto, chars: "01<>/#_", speed: 0.6, revealDelay: 0.15 } }, 0)
        .to(tituloSplit.lines, { yPercent: 0, duration: 1.1, stagger: 0.09, ease: "expo.out" }, 0.15)
;
    }

    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: portada,
        start: function () { return inicioPin(); },
        end: function () { return inicioPin() + pinLen(); },
        pin: true,
        pinSpacing: false,
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: function () { G = geo(); },
        onUpdate: function (self) {
          var p = self.progress;
          gsap.set(".bajar__lleno", { scaleX: Math.min(1, p / 0.2) });
          if (p > 0.002) {
            if (mirando) { mirando = false; soltarMirada(); apagarParticulas(); }
          } else if (!mirando) { mirando = true; }
          // el borde de la cerradura mide 2 px en pantalla a cualquier escala
          var s = G.base * gsap.getProperty(mover, "scale") * gsap.getProperty(zoom, "scale");
          borde.setAttribute("stroke-width", (2 / s).toFixed(4));
        },
        onLeave: function () { revelarSemana(); fijarEscena(1); },
        onEnterBack: function () { fijarEscena(0); }
      }
    });

    var vw = function (n) { return function () { return window.innerWidth * n / 100; }; };
    var vhf = function (n) { return function () { return vh() * n / 100; }; };

    // 0 → 2 · Telón: el nombre se abre como cortinas; el resto se retira
    if (desk) {
      tl.fromTo(nombreA, { x: 0, autoAlpha: 1 }, { x: vw(-18), autoAlpha: 0, duration: 2, ease: "power2.in" }, 0)
        .fromTo(nombreB, { x: 0, autoAlpha: 1 }, { x: vw(18), autoAlpha: 0, duration: 2, ease: "power2.in" }, 0);
    } else {
      tl.fromTo(nombreA, { y: 0, autoAlpha: 1 }, { y: vhf(-12), autoAlpha: 0, duration: 2, ease: "power2.in" }, 0)
        .fromTo(nombreB, { y: 0, autoAlpha: 1 }, { y: vhf(12), autoAlpha: 0, duration: 2, ease: "power2.in" }, 0);
    }
    tl.fromTo(".portada__luz", { opacity: 1 }, { opacity: 0, duration: 2.5, ease: "power2.inOut" }, 1.5)
      .fromTo(".semana__luz", { opacity: 1 }, { opacity: 0, duration: 0.01 }, 8.7);
    tl.fromTo([".portada__proposito", ".creditos", ".claqueta__centro", ".portada__bajar"], { y: 0, autoAlpha: 1 }, { y: 16, autoAlpha: 0, duration: 1.4, stagger: 0.15, ease: "power2.in" }, 0)
      .fromTo(".grano", { opacity: 0.05 }, { opacity: 0.08, duration: 2 }, 0);

    // 1,5 → 4 · El ojo despierta: el símbolo va al centro, los párpados se abren, el fragmento sale de cuadro
    tl.fromTo(mover, { x: 0, y: 0, scale: 1 }, { x: function () { return G.dx; }, y: function () { return G.dy; }, scale: function () { return G.esc; }, duration: 2.5, ease: "power3.inOut" }, 1.5)
      .fromTo(lids, { scaleY: 1, svgOrigin: "200 196" }, { scaleY: 1.18, svgOrigin: "200 196", duration: 2.5, ease: "power3.inOut" }, 1.5)
      .fromTo(frag, { x: 30, y: -30, autoAlpha: 1 }, { x: 90, y: -90, autoAlpha: 0, duration: 2.5, ease: "power3.inOut" }, 1.5);

    // 4 → 8,5 · Entrar por la cerradura: la sala la pone el marco; la semana espera detrás
    tl.fromTo(fondo, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01 }, 4)
      .fromTo([marco, borde], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 4)
      .fromTo(zoom, { scale: 1 }, { scale: function () { return G.zoom; }, duration: 4.5, ease: "power3.in", force3D: false }, 4)
      .fromTo(pupila, { opacity: 1 }, { opacity: 0, duration: 0.3 }, 4.3);
    if (desk) tl.fromTo(cabecera, { scale: 1.12 }, { scale: 1, duration: 4.5, ease: "power2.out" }, 4);

    // contra-traslación: la cabecera queda quieta detrás de la portada durante todo el pin
    tl.fromTo(cabecera, { y: function () { return -pinLen(); } }, { y: 0, duration: 10, ease: "none" }, 0);

    // 8,5 → 9 · Corte
    tl.fromTo(".corte", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 8.5)
      .fromTo(".corte", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3, immediateRender: false }, 8.7)
      .fromTo(simbolo, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01 }, 8.7)
      .to({}, { duration: 1 }, 9);

    limpiezas.push(function () { flotar.kill(); flotarP.kill(); });

    /* =========================================================
       Entrada (una vez por carga)
       ========================================================= */
    var marca = $(".claqueta__marca");
    if (!entradaHecha) {
      var tlE = gsap.timeline({ delay: 0.1, onComplete: function () { entradaHecha = true; } });
      gsap.set([".portada__proposito", ".creditos dd", ".bajar__texto"], { opacity: 0 });
      gsap.set(".creditos", { "--linea": 0 });
      gsap.set(".nombre__txt", { yPercent: 108 });
      gsap.set(".bajar__barra", { opacity: 0 });
      tlE.fromTo(claqueta, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none" }, 0)
        .to(marca, { duration: 0.8, scrambleText: { text: B.proyecto, chars: "01<>/#_", speed: 0.6, revealDelay: 0.15 } }, 0.05);

      if (particulas) {
        gsap.set(svg, { opacity: 0 });
        gsap.set(canvas, { autoAlpha: 1 });
        tlE.add(function () {
          particulas.ensamblar(function () {
            // crossfade de 400 ms al SVG nítido y el RAF se detiene
            gsap.to(svg, { opacity: 1, duration: 0.4 });
            gsap.to(canvas, { autoAlpha: 0, duration: 0.4, onComplete: function () { if (!canvasActivo) particulas.detener(); } });
            if (!desk) barrido();
          });
        }, 0.4);
      } else {
        tlE.from(svg, { opacity: 0, duration: 1.2, ease: "proyector" }, 0.4);
      }
      tlE.to(".nombre__txt", { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.12 }, 0.7)
        .to(".creditos", { "--linea": 1, duration: 1.1, ease: "proyector" }, 1.5)
        .to([".portada__proposito", ".creditos dd"], { opacity: 1, duration: 0.8, ease: "none", stagger: 0.06 }, 1.7)
        .to([".bajar__texto", ".bajar__barra"], { opacity: 1, duration: 0.6, ease: "none" }, 2.3);
    }
    // móvil: el iris hace un barrido lento para que se entienda que observa
    function barrido() {
      [[iris, pupila], pm].forEach(function (t) {
        gsap.timeline()
          .to(t, { x: -9, duration: 0.5, ease: "sine.inOut" })
          .to(t, { x: 9, duration: 0.7, ease: "sine.inOut" })
          .to(t, { x: 0, duration: 0.4, ease: "sine.inOut" });
      });
    }

    /* =========================================================
       GIRO: corte a negro y descifrado (disparo único)
       ========================================================= */
    var giroMarco = $(".giro__marco", giro);
    var giroRot = $(".giro__rotulo", giro);
    var giroFrase = $(".giro__frase", giro);
    var giroHecho = false;
    gsap.set(giroMarco, { autoAlpha: 0 });
    document.documentElement.classList.add("js-mov");
    limpiezas.push(function () { document.documentElement.classList.remove("js-mov"); });
    function deshacerGiro() {
      giro.classList.remove("es-corte");
      gsap.set(giroMarco, { autoAlpha: 0 });
    }
    function cortarGiro() {
      giro.classList.add("es-corte");
      if (giroHecho) { gsap.set(giroMarco, { autoAlpha: 1 }); return; }
      giroHecho = true;
      // un instante de negro puro (corte de montaje) y aparece la frase
      gsap.delayedCall(0.18, function () {
        gsap.set(giroMarco, { autoAlpha: 1 });
        Descifrado.revelar(giroRot, { duracion: 0.9 });
        if (!giroFrase.classList.contains("pendiente")) Descifrado.revelar(giroFrase, { duracion: 1.3 });
      });
    }
    ScrollTrigger.create({
      trigger: giro,
      start: "top top",
      end: "+=60%",
      pin: true,
      onEnter: cortarGiro,
      onLeaveBack: deshacerGiro
    });
    limpiezas.push(function () { giro.classList.remove("es-corte"); });

    // Si la página abre más abajo (ancla o recarga), los estados quedan resueltos
    ScrollTrigger.refresh();
    var st = tl.scrollTrigger;
    if (st && st.scroll() >= st.end - 1) { revelarSemana(); fijarEscena(1, true); entradaHecha = true; apagarParticulas(); }
    if (location.hash) {
      var dest = document.getElementById(location.hash.slice(1));
      if (dest && lenis) lenis.scrollTo(dest, { immediate: true, force: true });
    }

    return function () { limpiezas.forEach(function (f) { f(); }); };
  }
})();
