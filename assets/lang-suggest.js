/*
 * LaserProfit.eu – pasek z propozycją wersji językowej (PL / EN / DE).
 * Zastępuje automatyczne przekierowanie: nikt (także Googlebot) nie jest przenoszony bez kliknięcia.
 * Zamknięcie paska zapamiętuje localStorage "lp_lang_bar".
 */
(function () {
  'use strict';
  var KEY = 'lp_lang_bar';
  var path = location.pathname;
  var page = path.indexOf('/en/') === 0 ? 'en' : (path.indexOf('/de/') === 0 ? 'de' : 'pl');
  var nav = (navigator.language || 'pl').toLowerCase().slice(0, 2);
  if (nav !== 'pl' && nav !== 'en' && nav !== 'de') nav = 'en';
  if (nav === page) return;
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}

  var T = {
    pl: { text: '🌍 Ten kalkulator jest też dostępny po polsku.', go: 'Przejdź do wersji polskiej →', url: '/', close: 'Zamknij' },
    en: { text: '🌍 This calculator is also available in English.', go: 'Switch to English →', url: '/en/', close: 'Close' },
    de: { text: '🌍 Diesen Rechner gibt es auch auf Deutsch.', go: 'Zur deutschen Version →', url: '/de/', close: 'Schließen' }
  }[nav];

  function show() {
    var bar = document.createElement('div');
    bar.id = 'lpLangBar';
    bar.setAttribute('lang', nav);
    bar.style.cssText = 'position:relative;z-index:300;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 14px;' +
      'padding:8px 44px 8px 16px;background:var(--card,#132237);border-bottom:1px solid var(--orange,#ff6b2b);' +
      'font-family:var(--font,Arial,sans-serif);font-size:.78rem;color:var(--text,#e8f0fe)';
    bar.innerHTML = '<span>' + T.text + '</span>' +
      '<a href="' + T.url + '" style="color:var(--orange,#ff6b2b);font-weight:700;text-decoration:none">' + T.go + '</a>' +
      '<button type="button" aria-label="' + T.close + '" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);' +
      'background:none;border:none;color:var(--muted,#7a91b0);font-size:1.1rem;cursor:pointer;line-height:1">✕</button>';
    bar.querySelector('button').onclick = function () {
      try { localStorage.setItem(KEY, '1'); } catch (e) {}
      bar.parentNode.removeChild(bar);
    };
    document.body.insertBefore(bar, document.body.firstChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show);
  else show();
})();
