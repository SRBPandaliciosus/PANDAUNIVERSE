/**
 * ============================================================
 *  PANDAUNIVERSE · MAIN.JS
 *  JavaScript compartido por todas las páginas.
 *  Requiere: config.js cargado antes que este fichero.
 *
 *  Contenido:
 *    1. Hamburger (menú móvil)
 *    2. Newsletter (suscripción con Formspree)
 *    3. Contacto (formulario con Formspree)
 *    4. Utilidades compartidas
 * ============================================================
 */


/* ── 1. HAMBURGER ────────────────────────────────────────── */
function toggleMenu() {
  var menu   = document.getElementById('mobileMenu');
  var btn    = document.getElementById('hamburgerBtn');
  if (!menu || !btn) return;

  var isOpen = menu.classList.toggle('open');
  var spans  = btn.querySelectorAll('span');

  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '1';
    spans[2].style.transform = '';
  }
}

/* Cierra el menú al hacer clic fuera de él */
document.addEventListener('click', function (e) {
  var menu = document.getElementById('mobileMenu');
  var btn  = document.getElementById('hamburgerBtn');
  if (!menu || !btn) return;
  if (!menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove('open');
    var spans = btn.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '1';
    spans[2].style.transform = '';
  }
});


/* ── 2. NEWSLETTER ───────────────────────────────────────── */
(function () {
  var form    = document.getElementById('nlForm');
  if (!form) return;

  var btn     = document.getElementById('nlBtn');
  var consent = document.getElementById('nlConsent');
  var label   = document.getElementById('nlConsentLabel');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    /* Validar consentimiento LOPD */
    if (consent && !consent.checked) {
      if (label) label.classList.add('consent-error');
      return;
    }

    btn.disabled    = true;
    btn.textContent = 'Enviando...';

    fetch(CONFIG.formspree.newsletter, {
      method:  'POST',
      body:    new FormData(form),
      headers: { 'Accept': 'application/json' },
    })
      .then(function (res) {
        if (res.ok) {
          form.innerHTML =
            '<p style="color:var(--sage);font-weight:600;font-size:0.9rem;padding:1rem 0">' +
            '✓ ¡Ya eres de la familia panda! Revisa tu bandeja 🐼</p>';
          if (label) label.style.display = 'none';
        } else {
          throw new Error('server-error');
        }
      })
      .catch(function () {
        btn.disabled    = false;
        btn.textContent = '¡Apúntame! 🐼';
        alert('Hubo un problema al enviar. Inténtalo de nuevo en un momento.');
      });
  });
})();


/* ── 3. FORMULARIO DE CONTACTO ───────────────────────────── */
(function () {
  var form    = document.getElementById('contactForm');
  if (!form) return;

  var btn     = document.getElementById('submitBtn');
  var box     = document.getElementById('successBox');
  var consent = document.getElementById('contactConsent');

  /* Contador de caracteres del textarea */
  var textarea  = document.getElementById('mensaje');
  var charCount = document.getElementById('charCount');
  if (textarea && charCount) {
    textarea.addEventListener('input', function () {
      charCount.textContent = textarea.value.length;
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    /* Validar consentimiento LOPD */
    if (consent && !consent.checked) {
      consent.parentElement.classList.add('consent-error');
      return;
    }

    btn.disabled    = true;
    btn.textContent = 'Enviando...';

    fetch(CONFIG.formspree.contacto, {
      method:  'POST',
      body:    new FormData(form),
      headers: { 'Accept': 'application/json' },
    })
      .then(function (res) {
        if (res.ok) {
          form.style.display = 'none';
          if (box) box.style.display = 'block';
        } else {
          throw new Error('server-error');
        }
      })
      .catch(function () {
        btn.disabled    = false;
        btn.textContent = 'Enviar mensaje 🐼';
        alert('Hubo un problema al enviar. Inténtalo de nuevo en un momento.');
      });
  });
})();


/* ── 4. UTILIDADES ───────────────────────────────────────── */

/**
 * Copia texto al portapapeles.
 * @param {HTMLElement} btn - botón que dispara la copia
 * @param {string}      text - texto a copiar
 */
function copyCode(btn, text) {
  var original = btn.textContent;

  function onCopied() {
    btn.textContent   = '✓';
    btn.style.color   = '#7a9e7e';
    setTimeout(function () {
      btn.textContent = original;
      btn.style.color = '';
    }, 2000);
  }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(onCopied);
  } else {
    /* Fallback para navegadores sin clipboard API */
    var ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    onCopied();
  }
}

/**
 * Cambia la pestaña activa en páginas con tab-bar.
 * @param {string}      panelId - ID del panel a mostrar
 * @param {HTMLElement} clickedBtn - botón que se ha pulsado
 */
function switchTab(panelId, clickedBtn) {
  document.querySelectorAll('.tab-btn').forEach(function (b) {
    b.classList.remove('active');
  });
  document.querySelectorAll('.tab-panel').forEach(function (p) {
    p.classList.remove('active');
  });
  clickedBtn.classList.add('active');
  var panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
}
