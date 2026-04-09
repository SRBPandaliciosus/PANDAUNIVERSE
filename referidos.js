/**
 * ============================================================
 *  PANDAUNIVERSE · REFERIDOS.JS
 *  Carga y renderiza los códigos referido desde Google Sheets.
 *  Requiere: config.js y main.js cargados antes.
 *
 *  Contenido:
 *    1. Carga de hojas CSV desde Google Sheets
 *    2. Parser CSV
 *    3. Constructor de tarjetas referido
 *    4. Cambio de pestañas (extiende switchTab de main.js)
 *    5. HTML de estados: vacío, error, skeleton
 * ============================================================
 */


/* ── Caché para no recargar hojas ya descargadas ─────────── */
var _sheetsLoaded = {};


/* ── 1. CARGA DE HOJA ────────────────────────────────────── */

/**
 * Construye la URL pública CSV de una hoja del Google Sheet.
 * La hoja debe estar publicada en: Archivo → Compartir → Publicar en la web → CSV
 */
function _csvUrl(sheetName) {
  return (
    'https://docs.google.com/spreadsheets/d/' +
    CONFIG.googleSheet.id +
    '/gviz/tq?tqx=out:csv&sheet=' +
    encodeURIComponent(sheetName)
  );
}

/**
 * Carga una hoja y renderiza las tarjetas en su grid.
 * @param {string} key - 'bancos' | 'compras' | 'redes'
 */
function loadSheet(key) {
  if (_sheetsLoaded[key]) return;

  var cfg  = CONFIG.googleSheet.hojas[key];
  var grid = document.getElementById('grid-' + key);
  if (!grid || !cfg) return;

  /* Mostrar skeleton mientras carga */
  grid.innerHTML = _skeletonHTML();

  fetch(_csvUrl(cfg.nombre))
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    })
    .then(function (text) {
      var rows = _parseCSV(text);

      /* La primera fila son cabeceras → ignorar */
      if (rows.length <= 1) {
        grid.innerHTML = _emptyHTML();
        _sheetsLoaded[key] = true;
        return;
      }

      grid.innerHTML = '';
      var count = 0;

      rows.slice(1).forEach(function (row) {
        if (!row[0] || row[0].trim() === '') return; /* fila vacía */
        grid.appendChild(_buildCard(row, key, cfg));
        count++;
      });

      if (count === 0) grid.innerHTML = _emptyHTML();
      _sheetsLoaded[key] = true;
    })
    .catch(function (err) {
      grid.innerHTML = _errorHTML(err.message);
    });
}


/* ── 2. PARSER CSV ───────────────────────────────────────── */

/**
 * Convierte texto CSV (con posibles comillas y saltos de línea)
 * en un array bidimensional de strings.
 */
function _parseCSV(text) {
  var rows = [], row = [], cell = '', inQ = false;

  for (var i = 0; i < text.length; i++) {
    var ch = text[i];

    if (ch === '"') {
      if (inQ && text[i + 1] === '"') { cell += '"'; i++; }
      else { inQ = !inQ; }
    } else if (ch === ',' && !inQ) {
      row.push(cell.trim());
      cell = '';
    } else if ((ch === '\n' || ch === '\r') && !inQ) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell.trim());
      rows.push(row);
      row = []; cell = '';
    } else {
      cell += ch;
    }
  }

  /* Última fila si no termina en salto */
  if (cell || row.length) { row.push(cell.trim()); rows.push(row); }

  return rows;
}


/* ── 3. CONSTRUCTOR DE TARJETAS ──────────────────────────── */

/**
 * Construye el elemento DOM de una tarjeta referido.
 * @param {string[]} row  - fila del CSV
 * @param {string}   key  - 'bancos' | 'compras' | 'redes'
 * @param {object}   cfg  - entrada de CONFIG.googleSheet.hojas[key]
 */
function _buildCard(row, key, cfg) {
  /* Helper para obtener valor de una columna por nombre */
  function get(colName) {
    var idx = cfg.columnas.indexOf(colName);
    return (idx >= 0 && row[idx]) ? row[idx].trim() : '';
  }

  /* Extraer valores de columnas */
  var nombre    = get('nombre');
  var codigo    = get('codigo');
  var descuento = get('descuento');
  var caducidad = get('caducidad');
  var imagen    = get('imagen');    /* nombre de fichero local, ej: revolut.jpg */
  var logo      = get('logo');     /* nombre de fichero local fallback */
  var url       = get('url');
  var bases     = get('bases');    /* nombre de fichero local, ej: bases_revolut.pdf */
  var tiktok    = get('tiktok');   /* solo hoja RedesSociales */

  /* ── Caducidad ── */
  var expired = false, daysLeft = null;
  if (caducidad && caducidad !== '-') {
    var parts   = caducidad.split('/');
    var expDate = parts.length === 3
      ? new Date(parts[2], parts[1] - 1, parts[0])
      : new Date(caducidad);
    if (!isNaN(expDate)) {
      var diff = expDate - new Date();
      expired  = diff < 0;
      daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
  }

  /* ── Badge de caducidad ── */
  var badge = '';
  if (expired) {
    badge = '<span class="ref-badge badge-exp">Caducado</span>';
  } else if (daysLeft !== null && daysLeft <= 7) {
    badge = '<span class="ref-badge badge-new">Caduca en ' + daysLeft + 'd</span>';
  }

  /* ── Imagen / logo ── */
  var imgSrc  = (imagen && imagen !== '-') ? imagen : (logo && logo !== '-' ? logo : '');
  var imgHtml = imgSrc
    ? '<img src="' + imgSrc + '" alt="' + nombre + '" ' +
      'onerror="this.style.display=\'none\';this.parentNode.innerHTML=\'🏷️\'">'
    : '🏷️';

  /* ── Código copiable ── */
  var codigoHtml = '';
  if (codigo && codigo !== '-') {
    codigoHtml =
      '<div class="copy-row">' +
        '<span class="code-text">' + codigo + '</span>' +
        '<button class="copy-btn" onclick="copyCode(this,\'' + codigo + '\')">Copiar</button>' +
      '</div>';
  } else if (!url || url === '-') {
    codigoHtml = '<p class="no-code">Sin código — usar enlace directo</p>';
  }

  /* ── Otros elementos ── */
  var beneficioHtml = (descuento && descuento !== '-')
    ? '<div class="ref-discount">🎁 ' + descuento + '</div>' : '';

  var cadHtml = (caducidad && caducidad !== '-')
    ? '<div class="ref-caducidad">⏱ Válido hasta: ' + caducidad + '</div>' : '';

  /* bases → abre fichero local al hacer clic */
  var basesHtml = (bases && bases !== '-')
    ? '<a href="' + bases + '" target="_blank" rel="noopener" class="bases-link">' +
      '📄 Ver bases y condiciones</a>'
    : '';

  /* tiktok → enlace solo en RedesSociales */
  var tiktokHtml = (tiktok && tiktok !== '-')
    ? '<a href="' + tiktok + '" target="_blank" rel="noopener" ' +
      'class="ref-link-btn" style="background:#2c2c2a">Ver en TikTok →</a>'
    : '';

  var urlHtml = (url && url !== '-')
    ? '<a href="' + url + '" target="_blank" rel="noopener" class="ref-link-btn">' +
      'Conseguir ahora →</a>'
    : '';

  var typeLabel = key === 'bancos' ? 'Banco / Finanzas'
    : key === 'compras' ? 'Tienda / App'
    : 'Red Social';

  /* ── Montar tarjeta ── */
  var div = document.createElement('div');
  div.className = 'ref-card' + (expired ? ' ref-expired' : '');
  div.innerHTML =
    badge +
    '<div class="ref-header">' +
      '<div class="ref-logo-wrap">' + imgHtml + '</div>' +
      '<div>' +
        '<div class="ref-name">' + nombre + '</div>' +
        '<div class="ref-type">' + typeLabel + '</div>' +
      '</div>' +
    '</div>' +
    beneficioHtml +
    cadHtml +
    codigoHtml +
    basesHtml +
    tiktokHtml +
    urlHtml;

  return div;
}


/* ── 4. CAMBIO DE PESTAÑAS (referidos) ───────────────────── */

/**
 * Cambia la pestaña activa y carga la hoja si aún no se ha descargado.
 * Sobreescribe el switchTab genérico de main.js para este contexto.
 */
function switchTabReferidos(key, btn) {
  switchTab('panel-' + key, btn);
  loadSheet(key);
}


/* ── 5. HTML DE ESTADOS ──────────────────────────────────── */

function _skeletonHTML() {
  return (
    '<div style="display:contents">' +
      '<div class="skel"></div>' +
      '<div class="skel"></div>' +
      '<div class="skel"></div>' +
    '</div>'
  );
}

function _emptyHTML() {
  return (
    '<div class="empty-box" style="grid-column:1/-1">' +
      '<div class="emoji">🐼</div>' +
      '<p>Aún no hay entradas en esta sección. ¡Pronto habrá chollos!</p>' +
    '</div>'
  );
}

function _errorHTML(msg) {
  return (
    '<div class="error-box" style="grid-column:1/-1">' +
      '<h3>No se pudieron cargar los datos</h3>' +
      '<p>Asegúrate de que el Google Sheet está publicado como CSV:<br>' +
      '<strong>Archivo → Compartir → Publicar en la web → selecciona la hoja → CSV</strong></p>' +
      '<p style="margin-top:0.5rem;font-size:0.78rem;color:var(--light)">' + msg + '</p>' +
    '</div>'
  );
}


/* ── Inicialización: carga la pestaña por defecto ────────── */
document.addEventListener('DOMContentLoaded', function () {
  loadSheet('bancos');
});
