/* GIRO como calibración: la celda se inunda de luz y la frase pasa de comprimida
   (wdth 62) a su ancho normal (wdth 100) letra a letra, en 4 pulsos.
   Un [PENDIENTE] nunca se calibra: se ve tal cual es. */
(function () {
  "use strict";

  var MUESTRA = "Frase de muestra para ver cómo se calibra el giro";

  var G = {};

  function esPendiente(v) { return typeof v === "string" && v.indexOf("[PENDIENTE") === 0; }

  function pintar(frase) {
    var p = G.frase;
    p.innerHTML = "";
    p.classList.remove("pendiente");
    p.removeAttribute("data-pendiente");
    if (esPendiente(frase)) {
      p.textContent = frase;
      p.classList.add("pendiente");
      p.setAttribute("data-pendiente", "true");
      G.letras = [];
      return;
    }
    var sr = document.createElement("span");
    sr.className = "solo-lector";
    sr.textContent = frase;
    p.appendChild(sr);
    var vis = document.createElement("span");
    vis.setAttribute("aria-hidden", "true");
    frase.split(" ").forEach(function (w, i, arr) {
      var pal = document.createElement("span");
      pal.className = "palabra";
      Array.prototype.forEach.call(w, function (ch) {
        var l = document.createElement("span");
        l.className = "letra";
        l.textContent = ch;
        pal.appendChild(l);
      });
      vis.appendChild(pal);
      if (i < arr.length - 1) vis.appendChild(document.createTextNode(" "));
    });
    p.appendChild(vis);
    G.letras = Array.prototype.slice.call(p.querySelectorAll(".letra"));
  }

  function inundar(animado) {
    G.raiz.classList.add("inundado");
    if (!animado) { gsap.set(G.luz, { scaleY: 1 }); return null; }
    return gsap.fromTo(G.luz, { scaleY: 0 }, { scaleY: 1, duration: Reticula.PASO, ease: "power2.out" });
  }

  function calibrar(animado) {
    if (!G.letras.length) return null;
    if (!animado) { gsap.set(G.letras, { "--w": 100 }); return null; }
    gsap.set(G.letras, { "--w": 62 });
    return gsap.to(G.letras, {
      "--w": 100,
      duration: Reticula.PULSO,
      ease: "reten",
      stagger: { amount: Reticula.PULSO, from: "start" }
    });
  }

  function revelar(animado) {
    var tl = gsap.timeline();
    var a = inundar(animado);
    if (a) tl.add(a);
    var b = calibrar(animado);
    if (b) tl.add(b, ">");
    return tl;
  }

  function iniciar(frase, animado) {
    G.raiz = document.querySelector("[data-giro]");
    G.frase = G.raiz.querySelector("[data-giro-frase]");
    G.luz = G.raiz.querySelector(".giro__luz");
    G.muestraNota = G.raiz.querySelector("[data-giro-muestra]");
    G.boton = G.raiz.querySelector("[data-probar-giro]");
    G.real = frase;
    G.animado = animado;
    pintar(frase);
    if (G.letras.length && animado) gsap.set(G.letras, { "--w": 62 });

    if (!animado) revelar(false);

    G.boton.addEventListener("click", function () {
      var on = G.boton.getAttribute("aria-pressed") !== "true";
      G.boton.setAttribute("aria-pressed", on ? "true" : "false");
      G.boton.textContent = on ? "Volver a la frase real" : "Probar calibración";
      pintar(on ? MUESTRA : G.real);
      G.muestraNota.hidden = !on;
      revelar(G.animado);
    });
  }

  /* Se llama dentro de gsap.matchMedia, después de crear el pin */
  function observar(pinnedContainer) {
    if (G.revelado) return;
    ScrollTrigger.create({
      trigger: G.raiz.querySelector(".giro__celda"),
      pinnedContainer: pinnedContainer || undefined,
      start: "top 72%",
      once: true,
      onEnter: function () { G.revelado = true; revelar(true); }
    });
  }

  window.Giro = { iniciar: iniciar, observar: observar };
})();
