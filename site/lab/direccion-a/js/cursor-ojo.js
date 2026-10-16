/* El cursor es un ojo (dos arcos marfil y un punto naranja) que se estira con la velocidad.
   Sobre el símbolo se cierra a un punto; sobre enlaces se abre; sobre el GIRO es una cerradura.
   Solo con (hover: hover) and (pointer: fine). API: window.CursorOjo.iniciar({ alMover }) → { destruir } */
(function () {
  "use strict";

  function iniciar(op) {
    op = op || {};
    var el = document.createElement("div");
    el.className = "cursor";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML =
      '<svg viewBox="0 0 28 28">' +
      '<g class="c-ojo" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">' +
      '<path d="M2 14 Q14 3 26 14"/><path d="M2 14 Q14 25 26 14"/></g>' +
      '<circle class="c-punto" cx="14" cy="14" r="3.2" fill="var(--fragmento)"/>' +
      '<g class="c-llave" fill="var(--fragmento)"><circle cx="14" cy="11" r="3.4"/><polygon points="12.2,13 15.8,13 17.6,21 10.4,21"/></g>' +
      "</svg>";
    document.body.appendChild(el);
    document.documentElement.classList.add("cursor-activo");

    var xTo = gsap.quickTo(el, "x", { duration: 0.25, ease: "power3" });
    var yTo = gsap.quickTo(el, "y", { duration: 0.25, ease: "power3" });
    var sTo = gsap.quickTo(el, "scaleX", { duration: 0.3, ease: "power3" });
    var px = 0, py = 0, visible = false, ultimo = performance.now();

    function mover(e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      var ahora = performance.now(), dt = Math.max(16, ahora - ultimo);
      var dx = e.clientX - px, dy = e.clientY - py;
      var vel = Math.hypot(dx, dy) / dt; // px por ms
      px = e.clientX; py = e.clientY; ultimo = ahora;
      xTo(px); yTo(py);
      // se estira con la velocidad (máx. 1,4); el ojo siempre queda horizontal
      sTo(gsap.utils.clamp(1, 1.4, 1 + vel * 0.18));
      var t = e.target, modo = "";
      // el ojo solo vive en la sala (portada y GIRO); en la lectura vuelve el cursor del sistema
      var enSala = t.closest && t.closest(".portada, .giro, .claqueta");
      if (!enSala) {
        if (visible) { gsap.to(el, { opacity: 0, duration: 0.15 }); visible = false; }
        if (op.alMover) op.alMover(px, py);
        return;
      }
      if (!visible) { gsap.set(el, { x: px, y: py }); gsap.to(el, { opacity: 1, duration: 0.25 }); visible = true; }
      if (t.closest) {
        if (t.closest("[data-cursor='giro']")) modo = "giro";
        else if (t.closest("a, button")) modo = "enlace";
        else if (op.sobreSimbolo && op.sobreSimbolo(px, py)) modo = "simbolo";
      }
      if (el.dataset.modo !== modo) el.dataset.modo = modo;
      if (op.alMover) op.alMover(px, py);
    }
    function reposo() { sTo(1); }
    var idle = setInterval(function () { if (performance.now() - ultimo > 120) reposo(); }, 120);
    function salir() { gsap.to(el, { opacity: 0, duration: 0.2 }); visible = false; }

    window.addEventListener("pointermove", mover, { passive: true });
    document.documentElement.addEventListener("pointerleave", salir);

    return {
      destruir: function () {
        clearInterval(idle);
        window.removeEventListener("pointermove", mover);
        document.documentElement.removeEventListener("pointerleave", salir);
        document.documentElement.classList.remove("cursor-activo");
        el.remove();
      }
    };
  }

  window.CursorOjo = { iniciar: iniciar };
})();
