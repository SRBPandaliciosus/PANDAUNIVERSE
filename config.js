/**
 * ============================================================
 *  PANDAUNIVERSE · CONFIG.JS
 *  Todas las variables configurables del sitio en un solo lugar.
 *  Modifica aquí sin tocar el resto del código.
 * ============================================================
 */

var CONFIG = {

  /* ── MARCA ─────────────────────────────────────────────── */
  siteName:        'PandaUniverse',
  siteDescription: 'Dos marcas, un espíritu. Recetas, chollos, finanzas y TikTok Shop con sello panda.',

  logoImg: {
    pandaliciosus: 'PANDALICIOSUS.JPG',   // imagen cabecera / marca recetas
    pandachollo:   'PANDACHOLLO.JPG',     // imagen cabecera / marca chollos
  },

  /* ── REDES SOCIALES ─────────────────────────────────────── */
  redes: {
    tiktok_pandaliciosus: 'https://www.tiktok.com/@pandaliciosus',
    tiktok_pandachollo:   'https://www.tiktok.com/@pandachollo',
    instagram:            'https://www.instagram.com/pandaliciosus',
    youtube_pandaliciosus:'https://www.youtube.com/@pandaliciosus',
    youtube_pandachollo:  'https://www.youtube.com/@pandachollo',
    pinterest:            '#',  // añade tu URL de Pinterest cuando la tengas
  },

  /* ── FORMULARIOS (Formspree) ────────────────────────────── */
  formspree: {
    newsletter: 'https://formspree.io/f/mvzvoyvy',  // suscripción newsletter
    contacto:   'https://formspree.io/f/mvzvoyvy',  // formulario de contacto
    // Crea endpoints separados en formspree.io si quieres distinguirlos
  },

  /* ── GOOGLE SHEETS (Referidos) ───────────────────────────── */
  googleSheet: {
    id: '1KD9z_lI3ZTIanqxEwZTuQizOj4WgObw19tebtAcCSBY',
    hojas: {
      bancos:  { nombre: 'Bancos',         columnas: ['nombre','codigo','descuento','caducidad','imagen','url','bases','logo'] },
      compras: { nombre: 'Compras',        columnas: ['nombre','codigo','descuento','caducidad','imagen','url','bases','logo'] },
      redes:   { nombre: 'RedesSociales',  columnas: ['nombre','codigo','descuento','caducidad','imagen','url','bases','tiktok','logo'] },
    },
  },

  /* ── TEXTOS PRINCIPALES (hero, newsletter…) ─────────────── */
  textos: {
    heroEyebrow:  'Recetas · Chollos · Finanzas · TikTok Shop',
    heroLinea1:   'El universo',
    heroLinea2:   'Panda',        // se renderiza en cursiva/sage
    heroLinea3:   'que te hace la vida',
    heroLinea4:   'más',
    heroLinea4em: 'Pandástica',   // se renderiza en cursiva/sage
    heroSub:      'Dos marcas, un espíritu. Recetas deliciosas, los mejores chollos y consejos para que tu dinero rinda más. Todo con sello 🐼',

    newsletterTitulo: 'Chollos y recetas',
    newsletterSubtitulo: 'directo a tu email',
    newsletterDesc: 'Sé el primero en recibir chollos, recetas exclusivas, nuevos códigos referido y consejos financieros.',
  },

  /* ── LEGAL ───────────────────────────────────────────────── */
  legal: {
    anioActual:    '2026',
    privacidadUrl: 'privacidad.html',
    avisoLegalUrl: 'aviso-legal.html',
  },

};
