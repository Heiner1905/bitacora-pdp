/* ==========================================================================
   semana.js — pinta las semanas en #semanas (constructor 2)
   DOM por semana k (docs/DIRECCION.md §7):
     <div class="transicion" data-desde="k-1" data-hacia="k" aria-hidden="true"></div>  (k > 1, lo anima transiciones.js)
     <section class="semana" id="semana-0k" data-semana="k" data-estado="…" data-plano="…" aria-labelledby="semana-0k-titulo">
       <header class="semana__cabecera">   número-plano + ficha (semana · fecha si existe · estado) + h2
       <div class="semana__reflexion">
       <div class="semana__bloques">       un .bloque[data-viz] por bloque
       <div class="semana__cierre" data-semana="k"></div>   (lo pinta cierre-semana.js)
     </section>
   Composición: cada semana tiene su plano (data-plano: centro | izquierda | derecha | completo).
   La semana 01 usa «centro»: la portada la muestra por la cerradura (alinea su mirilla
   con .semana__cabecera de #semana-01: .semana__numero y .semana__ficha).
   ========================================================================== */
(function () {
  'use strict';
  var FX = window.FX;
  if (!FX) return;

  var ESTADOS = { 'completada': 'Completada', 'en-curso': 'En curso', 'pendiente': 'Pendiente' };
  // Cinco escenas que rotan: el número sangra a la izquierda, queda detrás del título (en trazo),
  // sangra a la derecha, lo corta el borde superior del cuadro, o entra completo junto a los créditos.
  var PLANOS = ['izquierda', 'detras', 'derecha', 'cortado', 'completo'];

  var RETICULAS = ['pareja', 'sangre', 'ancha'];
  function plano(k) { return k === 1 ? 'centro' : PLANOS[(k - 2) % PLANOS.length]; }

  function pintarSemana(s, i, contenedor, demo) {
    var k = s.numero || i + 1;
    var kk = FX.dos(k);
    var id = 'semana-' + kk;
    var estado = ESTADOS[s.estado] ? s.estado : 'pendiente';

    if (k > 1) {
      var tr = FX.crear('div', 'transicion', contenedor);
      tr.setAttribute('data-desde', k - 1);
      tr.setAttribute('data-hacia', k);
      tr.setAttribute('aria-hidden', 'true');
    }

    var sec = FX.crear('section', 'semana', contenedor);
    sec.id = id;
    sec.setAttribute('data-semana', k);
    sec.setAttribute('data-estado', estado);
    sec.setAttribute('data-plano', plano(k));
    sec.setAttribute('data-reticula', RETICULAS[(k - 1) % RETICULAS.length]);
    sec.setAttribute('aria-labelledby', id + '-titulo');

    /* ---- Cabecera: el plano ---- */
    var cab = FX.crear('header', 'semana__cabecera', sec);
    var num = FX.crear('p', 'semana__numero', cab);
    num.textContent = kk;
    num.setAttribute('aria-hidden', 'true');

    var rot = FX.crear('div', 'semana__rotulo', cab);
    var ficha = FX.crear('dl', 'semana__ficha', rot);
    function dato(etq, clase) {
      var g = FX.crear('div', 'ficha__dato ' + (clase || ''), ficha);
      var dt = FX.crear('dt', 'sr-only', g); dt.textContent = etq;
      return FX.crear('dd', null, g);
    }
    var ddSemana = dato('Semana', 'ficha__semana');
    ddSemana.textContent = 'Semana ' + kk;
    // Sin fecha (vacía, ausente o [PENDIENTE]) no se pinta nada: ni hueco ni separador
    if (s.fecha != null && String(s.fecha).trim() !== '' && !FX.esPendiente(s.fecha)) FX.pintar(dato('Fecha', 'ficha__fecha'), s.fecha);
    var ddEstado = dato('Estado', 'ficha__estado');
    var marca = FX.crear('span', 'estado__marca', ddEstado); marca.setAttribute('aria-hidden', 'true');
    FX.crear('span', 'estado__texto', ddEstado).textContent = ESTADOS[estado];

    var h2 = FX.crear('h2', 'semana__titulo', rot);
    h2.id = id + '-titulo';
    FX.pintar(h2, s.titulo);

    /* ---- Reflexión (texto de lectura) ---- */
    var refl = FX.crear('div', 'semana__reflexion', sec);
    if (FX.esPendiente(s.reflexion) || !s.reflexion) refl.classList.add('semana__reflexion--vacia');
    var reflViz = FX.viz ? FX.viz.pintar('texto', refl, { texto: s.reflexion }) : FX.pintar(FX.crear('p', 't-lectura', refl), s.reflexion);
    void reflViz;

    /* ---- Bloques ---- */
    var bloques = FX.crear('div', 'semana__bloques', sec);
    (s.bloques || []).forEach(function (b, j) {
      var art = FX.crear('article', 'bloque', bloques);
      var tipo = b.viz || 'texto';
      art.setAttribute('data-viz', tipo);
      art.setAttribute('data-orden', j + 1);
      art.style.setProperty('--orden', j);
      var hid = id + '-bloque-' + (j + 1);
      art.setAttribute('aria-labelledby', hid);
      var cabB = FX.crear('header', 'bloque__cabecera', art);
      var h3 = FX.crear('h3', 'bloque__titulo', cabB);
      h3.id = hid;
      FX.pintar(h3, b.titulo);
      var datos = b.datos || {};
      if (demo && FX.viz) {
        var m = FX.viz.muestra(tipo, datos);
        if (m) {
          datos = m;
          art.classList.add('bloque--muestra');
          FX.crear('p', 'bloque__muestra', cabB).textContent = 'Muestra · datos de prueba, no son de la bitácora';
        }
      }
      var cuerpo = FX.crear('div', 'bloque__viz', art);
      if (FX.viz) FX.viz.pintar(tipo, cuerpo, datos);
      else FX.pintar(FX.crear('p', 't-lectura', cuerpo), datos.texto);
    });

    /* ---- Cierre de la semana (cierre-semana.js) ---- */
    var cierre = FX.crear('div', 'semana__cierre', sec);
    cierre.setAttribute('data-semana', k);

    return sec;
  }

  /* ¿particulas.js acepta { desde: 'marca' }? (lo publica el constructor 1) */
  function soportaMarca(P) {
    try {
      if (typeof P.soporta === 'function') return !!P.soporta('marca');
      var lista = P.desdes || P.origenes;
      return !!(lista && (Array.isArray(lista) ? lista.indexOf('marca') > -1 : lista.marca));
    } catch (e) { return false; }
  }

  /* ---------- Entradas de la cabecera (k ≥ 2) ---------- */
  function animarCabeceras() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap || !ST || !FX.mm) return;

    FX.mm.add(FX.MQ, function (ctx) {
      var c = ctx.conditions;
      if (c.reducido) return;

      FX.$$('.semana').forEach(function (sec) {
        var k = parseInt(sec.getAttribute('data-semana'), 10);
        var num = FX.$('.semana__numero', sec);
        var cab = FX.$('.semana__cabecera', sec);
        var h2 = FX.$('.semana__titulo', sec);
        var ficha = FX.$$('.ficha__dato', sec);

        // .semana__numero no recibe transformaciones permanentes: transiciones.js lo une con Flip.
        if (k === 1) return; // la semana 01 la forma la entrada por la pupila: se ve completa de inmediato

        var split = null;
        var tituloAnimado = !!window.SplitText && !h2.classList.contains('pendiente');
        if (tituloAnimado) gsap.set(h2, { autoAlpha: 0 });
        // Si la transición forma el número de esta semana, aquí no se toca (ni partículas ni máscara)
        // semana.js se inicia antes que transiciones.js: la consulta se repite al entrar
        function manejaTransicion() { var T = FX.transiciones; return !!(T && typeof T.maneja === 'function' && T.maneja(k)); }
        var porTransicion = manejaTransicion();
        if (!porTransicion) gsap.set(num, { autoAlpha: 0 });
        gsap.set(ficha, { clipPath: 'inset(-20% 100% -20% 0%)' });

        var hecho = false;
        function mostrarNumeroConMascara(retraso) {
          gsap.fromTo(num, { autoAlpha: 1, clipPath: 'inset(100% 0% -25% 0%)', scale: 1.06 },
            { clipPath: 'inset(-25% 0% -25% 0%)', scale: 1, duration: 1.3, ease: 'expo.out', delay: retraso || 0,
              onComplete: function () { gsap.set(num, { clearProps: 'clipPath,scale' }); } });
        }
        function entrar() {
          if (hecho) return; hecho = true;
          if (!porTransicion && manejaTransicion()) { porTransicion = true; gsap.set(num, { autoAlpha: 1 }); }
          var P = FX.particulas;
          var usado = porTransicion;
          // Las partículas salen del fragmento de la marca del encabezado (el fragmento deja un rastro).
          // Solo si particulas.js ya ofrece la opción { desde: 'marca' }; si no, el número entra con máscara.
          var conMarca = P && typeof P.formarTexto === 'function' && soportaMarca(P);
          if (!porTransicion && conMarca) {
            try {
              var cedido = false;
              var ceder = function () { if (cedido) return; cedido = true; gsap.to(num, { autoAlpha: 1, duration: 0.35, ease: 'power1.out' }); };
              P.formarTexto(FX.dos(k), num, { desde: 'marca', alTerminar: ceder });
              setTimeout(ceder, 3200); // seguro: si las partículas no ceden, el número aparece igual
              usado = true;
            } catch (e) { console.error('[semana] partículas', e); usado = false; }
          }
          if (!usado) mostrarNumeroConMascara(0);

          var tl = gsap.timeline({ delay: usado ? 0.25 : 0.35 });
          tl.to(ficha, { clipPath: 'inset(-20% 0% -20% 0%)', duration: 0.9, ease: 'expo.out', stagger: 0.12, clearProps: 'clipPath' }, 0.1);
          if (tituloAnimado) {
            split = window.SplitText.create(h2, { type: 'words', mask: 'words' });
            gsap.set(split.words, { yPercent: 110 });
            gsap.set(h2, { autoAlpha: 1 });
          }
          if (split) tl.to(split.words, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06,
            onComplete: function () { split.revert(); split = null; } }, 0.25);
        }
        // Entrega de la transición: el número de la transición todavía se desvanece durante el
        // scrub (≈0,5 s); el real aparece cuando aquel ya se fue, para que nunca haya dos.
        FX.on('transicion:entrega', function (e) {
          if (!e || e.k !== k) return;
          gsap.fromTo(num, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: c.movil ? 0.3 : 0.5, ease: 'power1.out', overwrite: 'auto', clearProps: 'opacity' });
        });
        var st = ST.create({ trigger: cab, start: 'top 62%', once: true, onEnter: entrar });
        if (st.progress > 0) entrar();
      });
    });
  }

  FX.registrar('semana', function () {
    var cont = document.getElementById('semanas');
    if (!cont) return;
    var semanas = (FX.datos && FX.datos.semanas) || [];
    var demo = !!(FX.viz && FX.viz.demo);
    cont.textContent = '';
    if (demo) cont.classList.add('semanas--demo');
    semanas.forEach(function (s, i) { pintarSemana(s, i, cont, demo); });
    // Las entradas se crean al final (tras los pines de la portada y las transiciones)
    FX.on('listo', animarCabeceras);
  }, 20);
})();
