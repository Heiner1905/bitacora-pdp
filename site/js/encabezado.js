/* ==========================================================================
   encabezado.js — constructor 4 (docs/DIRECCION.md §9)
   Encabezado fijo y discreto que aparece al dejar la portada:
   - #encabezado-marca: marca.svg INLINE (string, sin fetch: file://) enlazada a
     #portada. Su dial gira y su fragmento se acerca con FX.on('progreso')
     (translate(23,-7) → 0) y al final ENCAJA con un destello de rubí claro.
   - #combinacion: la pinta el constructor 2; aquí solo tiene su lugar.
   - #encabezado-acciones: botón «Índice» (abre js/indice.js vía FX.indice).
   API: FX.encabezado = { mostrar(bool), boton }
   ========================================================================== */
(function () {
  'use strict';
  if (!window.FX) return;


  /* marca.svg con ids/clases propios; los colores salen de tokens.css (clases en encabezado.css) */
  var MARCA =
    '<svg class="marca" viewBox="0 0 400 400" aria-hidden="true" focusable="false">' +
      '<g class="marca__dial" id="marca-dial">' +
        '<circle cx="200" cy="200" r="181" stroke-width="12" stroke-dasharray="1.8 93.49"/>' +
        '<circle class="marca__indice" cx="200" cy="18" r="9"/>' +
      '</g>' +
      '<g class="marca__trazo">' +
        '<path d="M340 200 A140 140 0 0 1 229.11 336.94" stroke-width="20"/>' +
        '<path d="M170.89 336.94 A140 140 0 1 1 314.68 119.7" stroke-width="20"/>' +
        '<path class="marca__parpados" d="M88 200 A146 146 0 0 1 312 200 A146 146 0 0 1 88 200 Z" stroke-width="10"/>' +
        '<circle class="marca__iris" cx="200" cy="200" r="44" stroke-width="8"/>' +
      '</g>' +
      '<g class="marca__cerradura"><circle cx="200" cy="194" r="9"/><polygon points="195.5,199 204.5,199 208,214 192,214"/></g>' +
      '<circle class="marca__pulso" id="marca-pulso" cx="200" cy="200" r="140" stroke-width="20"/>' +
      '<g id="marca-fragmento" transform="translate(23 -7)">' +
        '<path class="marca__fragmento" d="M314.68 119.7 A140 140 0 0 1 340 200" stroke-width="20"/>' +
      '</g>' +
    '</svg>';

  /* Glifo del botón: un anillo de N arcos (eco del índice), sin librerías de íconos */
  function glifoAnillo(n) {
    var r = 7, c = 9, gap = n > 1 ? Math.min(18, 120 / n) : 0, d = '';
    for (var i = 0; i < n; i++) {
      var a0 = (i * 360 / n + gap / 2 - 90) * Math.PI / 180;
      var a1 = ((i + 1) * 360 / n - gap / 2 - 90) * Math.PI / 180;
      d += 'M' + (c + r * Math.cos(a0)).toFixed(2) + ' ' + (c + r * Math.sin(a0)).toFixed(2) +
           ' A' + r + ' ' + r + ' 0 0 1 ' + (c + r * Math.cos(a1)).toFixed(2) + ' ' + (c + r * Math.sin(a1)).toFixed(2) + ' ';
    }
    return '<svg class="encabezado__glifo" viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="' + d + '"/></svg>';
  }

  FX.registrar('encabezado', function (FX) {
    var cab = FX.$('#encabezado');
    var hueco = FX.$('#encabezado-marca');
    var acciones = FX.$('#encabezado-acciones');
    if (!cab || !hueco || !acciones) return;
    var gsap = window.gsap;
    var autor = (FX.datos && FX.datos.autor) || {};
    var nombre = autor.nombreCorto || autor.nombre || '';

    /* ---------- Marca ---------- */
    var enlace = FX.crear('a', 'encabezado__enlace', hueco);
    enlace.href = '#portada';
    enlace.innerHTML = MARCA;
    var etiqueta = FX.crear('span', 'encabezado__nombre t-dato', enlace);
    FX.pintar(etiqueta, nombre || '[PENDIENTE: nombre]');
    enlace.setAttribute('aria-label', (nombre ? nombre + '. ' : '') + 'Volver a la portada');
    // la portada está pineada (su rect no sirve de destino): se vuelve al inicio real de la página
    enlace.addEventListener('click', function (e) {
      e.preventDefault();
      if (FX.lenis && !FX.estado.reducido) FX.lenis.scrollTo(0, { duration: 1.6 });
      else window.scrollTo(0, 0);
    });

    var frag = enlace.querySelector('#marca-fragmento');
    var dial = enlace.querySelector('#marca-dial');
    var pulso = enlace.querySelector('#marca-pulso');
    var encajado = false;

    function pintarHilo(p) {
      var q = Math.min(1, Math.max(0, p));
      if (q > 0.995) q = 1;                         // encaja limpio al final
      frag.setAttribute('transform', 'translate(' + (23 * (1 - q)).toFixed(2) + ' ' + (-7 * (1 - q)).toFixed(2) + ')');
      dial.setAttribute('transform', 'rotate(' + (q * 360).toFixed(1) + ' 200 200)');
      if (q === 1 && !encajado) {
        encajado = true;
        enlace.classList.add('is-encajada');
        if (gsap && !FX.estado.reducido) {
          gsap.fromTo(pulso, { opacity: 0.95, scale: 1 }, { opacity: 0, scale: 1.18, svgOrigin: '200 200', duration: 0.9, ease: 'expo.out', overwrite: true });
        }
      } else if (q < 0.98 && encajado) {
        encajado = false;
        enlace.classList.remove('is-encajada');
      }
    }
    FX.on('progreso', function (e) { pintarHilo(e.p); });
    pintarHilo(FX.estado.progreso || 0);

    /* ---------- Acción: Índice ---------- */
    var boton = FX.crear('button', 'encabezado__boton', acciones);
    boton.type = 'button';
    boton.id = 'encabezado-indice';
    boton.setAttribute('aria-haspopup', 'dialog');
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-controls', 'indice');
    boton.innerHTML = glifoAnillo(Math.max(1, FX.estado.total || 1)) + '<span class="encabezado__boton-texto">Índice</span>';
    boton.addEventListener('click', function () {
      if (FX.indice && FX.indice.abrir) FX.indice.abrir(boton);
    });

    /* ---------- Aparecer tras la portada ---------- */
    var visible = null;
    function mostrar(si) {
      si = !!si;
      if (si === visible) return;
      visible = si;
      cab.classList.toggle('is-visible', si);
    }
    // solo el foco de TECLADO (:focus-visible) mantiene el encabezado en la portada; el foco que deja un clic no
    function focoTeclado() { var f = document.activeElement; return !!(f && cab.contains(f) && f.matches && f.matches(':focus-visible')); }
    FX.on('semana', function (e) { mostrar(e.k >= 1 || focoTeclado()); });
    // teclado: si el foco entra en el encabezado aún oculto, se muestra (nunca hay foco invisible)
    cab.addEventListener('focusin', function () { if (focoTeclado()) mostrar(true); });
    cab.addEventListener('focusout', function () {
      setTimeout(function () { if (!focoTeclado() && FX.estado.semana < 1) mostrar(false); }, 0);
    });
    mostrar(FX.estado.semana >= 1);

    FX.encabezado = { mostrar: mostrar, boton: boton };
  }, 10);
})();
