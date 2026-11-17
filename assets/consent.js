/*
 * LaserProfit.eu – zgoda na cookies (Google Consent Mode v2, tryb podstawowy).
 *
 * - Domyślnie wszystkie zgody Google są "denied".
 * - Skrypt Google (gtag.js) NIE jest w ogóle ładowany, dopóki użytkownik nie kliknie "Akceptuję".
 *   Dzięki temu przed zgodą nie ma ciasteczek _ga / _gcl_au ani żądań do googletagmanager.com.
 * - Wybór jest zapamiętany w localStorage (klucz "lp_consent_v1"), zmiana: link "Ustawienia cookies"
 *   w stopce (dowolny element z atrybutem data-cookie-settings) albo window.lpCookieSettings().
 *
 * Użycie (w <head>, przed innymi skryptami):
 *   <script src="/assets/consent.js" data-ga="G-XXXX" data-aw="AW-XXXX"></script>
 * Strony bez Google Analytics dołączają skrypt bez atrybutów data-ga / data-aw.
 */
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }

(function () {
  'use strict';

  var KEY = 'lp_consent_v1';
  var DENIED = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' };
  var GRANTED = { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' };

  var me = document.currentScript;
  var ids = [];
  if (me) {
    if (me.getAttribute('data-ga')) ids.push(me.getAttribute('data-ga'));
    if (me.getAttribute('data-aw')) ids.push(me.getAttribute('data-aw'));
  }

  gtag('consent', 'default', DENIED);
  gtag('set', 'ads_data_redaction', true);

  var memoryChoice = null; // gdy localStorage jest niedostępny (tryb prywatny itp.)
  function readChoice() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) { var v = JSON.parse(raw); if (v && (v.c === 'granted' || v.c === 'denied')) return v.c; }
    } catch (e) {}
    return memoryChoice;
  }
  function saveChoice(c) {
    memoryChoice = c;
    try { localStorage.setItem(KEY, JSON.stringify({ c: c, t: new Date().toISOString() })); } catch (e) {}
    try { localStorage.removeItem('cookies'); } catch (e) {} // stary klucz z poprzedniego banera
  }

  var loaded = false;
  function loadGoogle() {
    if (loaded || !ids.length) return;
    loaded = true;
    gtag('js', new Date());
    for (var i = 0; i < ids.length; i++) gtag('config', ids[i]);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ids[0]);
    document.head.appendChild(s);
  }

  function deleteGoogleCookies() {
    var names = document.cookie.split(';').map(function (c) { return c.split('=')[0].trim(); });
    var host = location.hostname;
    var domains = ['', host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    names.forEach(function (n) {
      if (/^(_ga|_ga_.*|_gid|_gat.*|_gcl_.*|_gac_.*)$/.test(n)) {
        domains.forEach(function (d) {
          document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  function apply(c) {
    if (c === 'granted') {
      gtag('consent', 'update', GRANTED);
      loadGoogle();
    } else {
      gtag('consent', 'update', DENIED);
      deleteGoogleCookies();
    }
  }

  var initial = readChoice();
  if (initial === 'granted') apply('granted');

  /* ---------- baner ---------- */
  var T = {
    pl: {
      text: 'Używamy plików cookie Google Analytics i Google Ads do statystyk odwiedzin i mierzenia skuteczności reklam. Włączymy je tylko, jeśli się zgodzisz. Kalkulator działa tak samo bez nich. Zgodę możesz zmienić w każdej chwili w stopce („Ustawienia cookies”).',
      policy: 'Polityka prywatności', href: '/privacy/',
      yes: 'Akceptuję', no: 'Tylko niezbędne', settings: 'Ustawienia cookies', label: 'Zgoda na pliki cookie'
    },
    en: {
      text: 'We use Google Analytics and Google Ads cookies for visitor statistics and ad measurement. They are only switched on if you agree. The calculator works the same without them. You can change your choice at any time via “Cookie settings” in the footer.',
      policy: 'Privacy policy', href: '/privacy/#en',
      yes: 'Accept', no: 'Necessary only', settings: 'Cookie settings', label: 'Cookie consent'
    },
    de: {
      text: 'Wir verwenden Cookies von Google Analytics und Google Ads für Besucherstatistiken und Anzeigenmessung. Sie werden nur aktiviert, wenn Sie zustimmen. Der Rechner funktioniert auch ohne sie. Sie können Ihre Wahl jederzeit über „Cookie-Einstellungen“ in der Fußzeile ändern.',
      policy: 'Datenschutzerklärung', href: '/privacy/#de',
      yes: 'Akzeptieren', no: 'Nur notwendige', settings: 'Cookie-Einstellungen', label: 'Cookie-Einwilligung'
    }
  };
  function pathLang() {
    if (location.pathname.indexOf('/de/') === 0) return 'de';
    if (location.pathname.indexOf('/en/') === 0) return 'en';
    var l = (document.documentElement.getAttribute('lang') || 'pl').toLowerCase().slice(0, 2);
    return T[l] ? l : 'pl';
  }

  var css = '' +
    '#lpConsent{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;background:var(--card,#132237);color:var(--text,#e8f0fe);' +
    'border-top:2px solid var(--orange,#ff6b2b);box-shadow:0 -4px 20px rgba(0,0,0,.3);padding:14px 16px;font-family:var(--font,\'Poppins\',Arial,sans-serif)}' +
    '#lpConsent .lpc-in{max-width:1060px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:12px;justify-content:space-between}' +
    '#lpConsent p{margin:0;font-size:.78rem;line-height:1.5;color:var(--muted,#9fb0c8);flex:1 1 280px}' +
    '#lpConsent a{color:var(--orange,#ff6b2b);font-weight:700;text-decoration:none}' +
    '#lpConsent .lpc-b{display:flex;gap:8px;flex-wrap:wrap}' +
    '#lpConsent button{font:inherit;font-size:.8rem;font-weight:700;padding:9px 18px;border-radius:7px;cursor:pointer;min-width:130px}' +
    '#lpConsent .lpc-yes{background:var(--orange,#ff6b2b);color:#fff;border:1px solid var(--orange,#ff6b2b)}' +
    '#lpConsent .lpc-no{background:var(--card2,#1a2f47);color:var(--text,#e8f0fe);border:1px solid var(--border,#3a4f6a)}' +
    '#lpConsent button:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
    '.lpc-settings{background:none;border:none;padding:0;color:inherit;text-decoration:underline;cursor:pointer;font:inherit;font-size:.72rem}' +
    '.lpc-fallback{text-align:center;padding:14px 16px 18px;font-size:.72rem;opacity:.85}';

  function addStyle() {
    if (document.getElementById('lpConsentCss')) return;
    var st = document.createElement('style');
    st.id = 'lpConsentCss';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function hideBanner() {
    var b = document.getElementById('lpConsent');
    if (b) b.parentNode.removeChild(b);
  }

  function showBanner() {
    addStyle();
    hideBanner();
    var t = T[pathLang()];
    var b = document.createElement('div');
    b.id = 'lpConsent';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-live', 'polite');
    b.setAttribute('aria-label', t.label);
    b.innerHTML = '<div class="lpc-in"><p>🍪 ' + t.text + ' <a href="' + t.href + '">' + t.policy + '</a></p>' +
      '<div class="lpc-b"><button type="button" class="lpc-no">' + t.no + '</button>' +
      '<button type="button" class="lpc-yes">' + t.yes + '</button></div></div>';
    b.querySelector('.lpc-yes').onclick = function () { saveChoice('granted'); apply('granted'); hideBanner(); };
    b.querySelector('.lpc-no').onclick = function () { saveChoice('denied'); apply('denied'); hideBanner(); };
    document.body.appendChild(b);
  }

  window.lpCookieSettings = showBanner;

  function bindSettingsLinks() {
    addStyle();
    var links = document.querySelectorAll('[data-cookie-settings]');
    if (!links.length) {
      // strona bez stopki – dodaj mały link na końcu
      var d = document.createElement('div');
      d.className = 'lpc-fallback';
      d.innerHTML = '<button type="button" class="lpc-settings" data-cookie-settings>' + T[pathLang()].settings + '</button>' +
        ' · <a href="' + T[pathLang()].href + '" style="color:inherit">' + T[pathLang()].policy + '</a>';
      document.body.appendChild(d);
      links = d.querySelectorAll('[data-cookie-settings]');
    }
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (e) { e.preventDefault(); showBanner(); });
    }
  }

  function onReady() {
    bindSettingsLinks();
    if (readChoice() === null) showBanner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();
})();
