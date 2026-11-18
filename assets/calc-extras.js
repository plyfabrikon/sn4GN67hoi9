/*
 * LaserProfit.eu – dodatki do kalkulatora (wspólne dla PL / EN / DE):
 *  1) podgląd ułożenia elementów na arkuszu (SVG, z automatycznym obrotem o 90°),
 *  2) tryb „przedmiot klienta” – grawer na rzeczy dostarczonej przez klienta (bez kosztu materiału).
 * Strona woła: LPX.layout(), LPX.renderPreview(), LPX.client(), LPX.reportRows(), LPX.txtBlock().
 */
(function () {
  'use strict';

  var I18N = {
    pl: { ci_toggle: '🎁 Grawer na przedmiocie klienta', ci_toggle_sub: 'klient dostarcza przedmiot (kubek, deska, etui…) – koszt materiału nie jest liczony',
          ci_qty: 'Liczba przedmiotów', ci_setup: 'Ustawienie i pozycjonowanie (min / szt.)', ci_risk: 'Dopłata za ryzyko uszkodzenia (%)',
          ci_hint: 'ℹ️ „Czas lasera” wpisz łącznie dla wszystkich przedmiotów.', ci_item: 'Przedmiot klienta', ci_setup_row: 'Ustawienie i pozycjonowanie',
          ci_risk_row: 'Dopłata za ryzyko uszkodzenia', per_item: 'Cena za 1 szt. (brutto, bez wysyłki)', pcs: 'szt.',
          pv_title: 'Podgląd ułożenia na arkuszu', pv_rot: 'elementy obrócone o 90° – mieści się więcej', pv_sheets: 'Potrzebne arkusze: {n}',
          pv_legend: 'Pomarańczowe – Twoje sztuki ({a} na tym arkuszu) · przerywane – wolne miejsca · reszta – odpad' },
    en: { ci_toggle: '🎁 Engraving on the customer’s item', ci_toggle_sub: 'the customer supplies the item (mug, board, case…) – no material cost',
          ci_qty: 'Number of items', ci_setup: 'Setup & positioning (min / item)', ci_risk: 'Damage risk surcharge (%)',
          ci_hint: 'ℹ️ Enter “Laser time” as the total for all items.', ci_item: 'Customer’s item', ci_setup_row: 'Setup & positioning',
          ci_risk_row: 'Damage risk surcharge', per_item: 'Price per item (gross, excl. shipping)', pcs: 'pcs.',
          pv_title: 'Sheet layout preview', pv_rot: 'parts rotated 90° – more fit', pv_sheets: 'Sheets needed: {n}',
          pv_legend: 'Orange – your parts ({a} on this sheet) · dashed – free slots · rest – waste' },
    de: { ci_toggle: '🎁 Gravur auf Kundenartikel', ci_toggle_sub: 'der Kunde liefert den Artikel (Tasse, Brett, Hülle…) – keine Materialkosten',
          ci_qty: 'Anzahl Artikel', ci_setup: 'Einrichten & Positionieren (Min. / Stk.)', ci_risk: 'Aufschlag Beschädigungsrisiko (%)',
          ci_hint: 'ℹ️ „Laserzeit“ als Gesamtzeit für alle Artikel eingeben.', ci_item: 'Kundenartikel', ci_setup_row: 'Einrichten & Positionieren',
          ci_risk_row: 'Aufschlag Beschädigungsrisiko', per_item: 'Preis pro Stück (brutto, ohne Versand)', pcs: 'Stk.',
          pv_title: 'Vorschau der Anordnung auf der Platte', pv_rot: 'Teile um 90° gedreht – es passen mehr', pv_sheets: 'Benötigte Platten: {n}',
          pv_legend: 'Orange – Ihre Teile ({a} auf dieser Platte) · gestrichelt – freie Plätze · Rest – Verschnitt' },
    fr: { ci_toggle: '🎁 Gravure sur l’objet du client', ci_toggle_sub: 'le client fournit l’objet (mug, planche, étui…) – pas de coût matériau',
          ci_qty: 'Nombre d’objets', ci_setup: 'Mise en place et positionnement (min / pièce)', ci_risk: 'Supplément risque de dommage (%)',
          ci_hint: 'ℹ️ Indiquez le « Temps laser » total pour tous les objets.', ci_item: 'Objet du client', ci_setup_row: 'Mise en place et positionnement',
          ci_risk_row: 'Supplément risque de dommage', per_item: 'Prix par pièce (TTC, hors livraison)', pcs: 'pcs',
          pv_title: 'Aperçu de l’imbrication sur la plaque', pv_rot: 'pièces tournées de 90° – plus de place', pv_sheets: 'Plaques nécessaires : {n}',
          pv_legend: 'Orange – vos pièces ({a} sur cette plaque) · pointillés – places libres · reste – chute' },
    it: { ci_toggle: '🎁 Incisione su oggetto del cliente', ci_toggle_sub: 'il cliente fornisce l’oggetto (tazza, tagliere, cover…) – nessun costo materiale',
          ci_qty: 'Numero di oggetti', ci_setup: 'Preparazione e posizionamento (min / pz)', ci_risk: 'Sovrapprezzo rischio danni (%)',
          ci_hint: 'ℹ️ Inserisci il «Tempo laser» totale per tutti gli oggetti.', ci_item: 'Oggetto del cliente', ci_setup_row: 'Preparazione e posizionamento',
          ci_risk_row: 'Sovrapprezzo rischio danni', per_item: 'Prezzo per pezzo (lordo, senza spedizione)', pcs: 'pz',
          pv_title: 'Anteprima disposizione sulla lastra', pv_rot: 'pezzi ruotati di 90° – ne entrano di più', pv_sheets: 'Lastre necessarie: {n}',
          pv_legend: 'Arancione – i tuoi pezzi ({a} su questa lastra) · tratteggio – posti liberi · resto – sfrido' },
    es: { ci_toggle: '🎁 Grabado en el objeto del cliente', ci_toggle_sub: 'el cliente trae el objeto (taza, tabla, funda…) – sin coste de material',
          ci_qty: 'Número de objetos', ci_setup: 'Preparación y posicionamiento (min / ud.)', ci_risk: 'Recargo por riesgo de daño (%)',
          ci_hint: 'ℹ️ Indica el «Tiempo láser» total para todos los objetos.', ci_item: 'Objeto del cliente', ci_setup_row: 'Preparación y posicionamiento',
          ci_risk_row: 'Recargo por riesgo de daño', per_item: 'Precio por unidad (bruto, sin envío)', pcs: 'ud.',
          pv_title: 'Vista previa de la distribución en la lámina', pv_rot: 'piezas giradas 90° – caben más', pv_sheets: 'Láminas necesarias: {n}',
          pv_legend: 'Naranja – tus piezas ({a} en esta lámina) · discontinuo – huecos libres · resto – desperdicio' },
    nl: { ci_toggle: '🎁 Graveren op voorwerp van de klant', ci_toggle_sub: 'de klant levert het voorwerp (mok, plank, hoesje…) – geen materiaalkosten',
          ci_qty: 'Aantal voorwerpen', ci_setup: 'Instellen en positioneren (min / st.)', ci_risk: 'Toeslag beschadigingsrisico (%)',
          ci_hint: 'ℹ️ Vul de „Lasertijd” in als totaal voor alle voorwerpen.', ci_item: 'Voorwerp van de klant', ci_setup_row: 'Instellen en positioneren',
          ci_risk_row: 'Toeslag beschadigingsrisico', per_item: 'Prijs per stuk (bruto, excl. verzending)', pcs: 'st.',
          pv_title: 'Voorbeeld indeling op de plaat', pv_rot: 'onderdelen 90° gedraaid – er past meer op', pv_sheets: 'Benodigde platen: {n}',
          pv_legend: 'Oranje – jouw onderdelen ({a} op deze plaat) · gestippeld – vrije plekken · rest – afval' },
    cs: { ci_toggle: '🎁 Gravírování na předmět zákazníka', ci_toggle_sub: 'zákazník dodá předmět (hrnek, prkénko, pouzdro…) – bez nákladů na materiál',
          ci_qty: 'Počet předmětů', ci_setup: 'Nastavení a polohování (min / ks)', ci_risk: 'Příplatek za riziko poškození (%)',
          ci_hint: 'ℹ️ „Čas laseru“ zadejte celkem pro všechny předměty.', ci_item: 'Předmět zákazníka', ci_setup_row: 'Nastavení a polohování',
          ci_risk_row: 'Příplatek za riziko poškození', per_item: 'Cena za 1 ks (s DPH, bez dopravy)', pcs: 'ks',
          pv_title: 'Náhled rozmístění na desce', pv_rot: 'díly otočené o 90° – vejde se více', pv_sheets: 'Potřebné desky: {n}',
          pv_legend: 'Oranžová – vaše díly ({a} na této desce) · čárkovaně – volná místa · zbytek – odpad' },
    uk: { ci_toggle: '🎁 Гравіювання на виробі клієнта', ci_toggle_sub: 'клієнт надає виріб (чашку, дошку, чохол…) – без вартості матеріалу',
          ci_qty: 'Кількість виробів', ci_setup: 'Налаштування і позиціонування (хв / шт.)', ci_risk: 'Надбавка за ризик пошкодження (%)',
          ci_hint: 'ℹ️ «Час лазера» вкажіть загалом для всіх виробів.', ci_item: 'Виріб клієнта', ci_setup_row: 'Налаштування і позиціонування',
          ci_risk_row: 'Надбавка за ризик пошкодження', per_item: 'Ціна за 1 шт. (брутто, без доставки)', pcs: 'шт.',
          pv_title: 'Попередній перегляд розкладки на аркуші', pv_rot: 'деталі повернуто на 90° – вміщується більше', pv_sheets: 'Потрібно аркушів: {n}',
          pv_legend: 'Помаранчеві – ваші деталі ({a} на цьому аркуші) · пунктир – вільні місця · решта – відходи' },
    no: { ci_toggle: '🎁 Gravering på kundens gjenstand', ci_toggle_sub: 'kunden leverer gjenstanden (krus, fjøl, deksel…) – ingen materialkostnad',
          ci_qty: 'Antall gjenstander', ci_setup: 'Oppsett og posisjonering (min / stk.)', ci_risk: 'Tillegg for skaderisiko (%)',
          ci_hint: 'ℹ️ Oppgi «Lasertid» totalt for alle gjenstander.', ci_item: 'Kundens gjenstand', ci_setup_row: 'Oppsett og posisjonering',
          ci_risk_row: 'Tillegg for skaderisiko', per_item: 'Pris per stk. (brutto, uten frakt)', pcs: 'stk.',
          pv_title: 'Forhåndsvisning av plassering på platen', pv_rot: 'deler rotert 90° – flere får plass', pv_sheets: 'Plater som trengs: {n}',
          pv_legend: 'Oransje – dine deler ({a} på denne platen) · stiplet – ledige plasser · resten – svinn' },
    sv: { ci_toggle: '🎁 Gravyr på kundens föremål', ci_toggle_sub: 'kunden levererar föremålet (mugg, bricka, skal…) – ingen materialkostnad',
          ci_qty: 'Antal föremål', ci_setup: 'Inställning och positionering (min / st.)', ci_risk: 'Tillägg för skaderisk (%)',
          ci_hint: 'ℹ️ Ange ”Lasertid” totalt för alla föremål.', ci_item: 'Kundens föremål', ci_setup_row: 'Inställning och positionering',
          ci_risk_row: 'Tillägg för skaderisk', per_item: 'Pris per st. (brutto, exkl. frakt)', pcs: 'st.',
          pv_title: 'Förhandsvisning av placering på skivan', pv_rot: 'delar roterade 90° – fler får plats', pv_sheets: 'Skivor som behövs: {n}',
          pv_legend: 'Orange – dina delar ({a} på denna skiva) · streckat – lediga platser · resten – spill' },
    da: { ci_toggle: '🎁 Gravering på kundens genstand', ci_toggle_sub: 'kunden leverer genstanden (krus, bræt, cover…) – ingen materialeomkostning',
          ci_qty: 'Antal genstande', ci_setup: 'Opsætning og positionering (min / stk.)', ci_risk: 'Tillæg for risiko for skade (%)',
          ci_hint: 'ℹ️ Angiv «Lasertid» samlet for alle genstande.', ci_item: 'Kundens genstand', ci_setup_row: 'Opsætning og positionering',
          ci_risk_row: 'Tillæg for risiko for skade', per_item: 'Pris pr. stk. (brutto, ekskl. fragt)', pcs: 'stk.',
          pv_title: 'Forhåndsvisning af placering på pladen', pv_rot: 'dele drejet 90° – flere kan være der', pv_sheets: 'Plader der skal bruges: {n}',
          pv_legend: 'Orange – dine dele ({a} på denne plade) · stiplet – ledige pladser · resten – spild' },
    hu: { ci_toggle: '🎁 Gravírozás az ügyfél tárgyára', ci_toggle_sub: 'az ügyfél hozza a tárgyat (bögre, deszka, tok…) – anyagköltség nélkül',
          ci_qty: 'Tárgyak száma', ci_setup: 'Beállítás és pozicionálás (perc / db)', ci_risk: 'Sérülési kockázati felár (%)',
          ci_hint: 'ℹ️ A „Lézeridő” mezőbe az összes tárgy teljes idejét írd.', ci_item: 'Ügyfél tárgya', ci_setup_row: 'Beállítás és pozicionálás',
          ci_risk_row: 'Sérülési kockázati felár', per_item: 'Ár / db (bruttó, szállítás nélkül)', pcs: 'db',
          pv_title: 'Elrendezés előnézete a lemezen', pv_rot: 'alkatrészek 90°-kal elforgatva – több fér el', pv_sheets: 'Szükséges lemezek: {n}',
          pv_legend: 'Narancs – a te darabjaid ({a} ezen a lemezen) · szaggatott – szabad helyek · többi – hulladék' },
    ro: { ci_toggle: '🎁 Gravură pe obiectul clientului', ci_toggle_sub: 'clientul aduce obiectul (cană, tocător, husă…) – fără cost de material',
          ci_qty: 'Număr de obiecte', ci_setup: 'Pregătire și poziționare (min / buc.)', ci_risk: 'Suprataxă risc de deteriorare (%)',
          ci_hint: 'ℹ️ Introdu „Timpul laser” total pentru toate obiectele.', ci_item: 'Obiectul clientului', ci_setup_row: 'Pregătire și poziționare',
          ci_risk_row: 'Suprataxă risc de deteriorare', per_item: 'Preț per bucată (brut, fără livrare)', pcs: 'buc.',
          pv_title: 'Previzualizare așezare pe placă', pv_rot: 'piese rotite cu 90° – încap mai multe', pv_sheets: 'Plăci necesare: {n}',
          pv_legend: 'Portocaliu – piesele tale ({a} pe această placă) · punctat – locuri libere · rest – deșeu' }
  };

  function lang() {
    var p = location.pathname;
    if (p.indexOf('/en/') === 0 || p === '/en') return 'en';
    if (p.indexOf('/de/') === 0 || p === '/de') return 'de';
    try { if (typeof activeLang !== 'undefined' && I18N[activeLang]) return activeLang; } catch (e) {} // eslint-disable-line no-undef
    return 'pl';
  }
  function t(k) { var L = I18N[lang()] || I18N.en; return L[k] || I18N.en[k] || k; }
  function $(id) { return document.getElementById(id); }
  function num(id, def) { var el = $(id); var v = el ? parseFloat(el.value) : NaN; return isNaN(v) ? def : v; }

  /* ---------- 1. Ułożenie na arkuszu ---------- */
  function layout(sW, sH, cW, cH) {
    var a = { cols: Math.floor(sW / cW), rows: Math.floor(sH / cH), w: cW, h: cH, rotated: false };
    var b = { cols: Math.floor(sW / cH), rows: Math.floor(sH / cW), w: cH, h: cW, rotated: true };
    a.max = a.cols * a.rows; b.max = b.cols * b.rows;
    return (b.max > a.max && cW !== cH) ? b : a;
  }

  function previewHTML(sW, sH, cW, cH, qty) {
    if (!(sW > 0 && sH > 0 && cW > 0 && cH > 0)) return '';
    var lo = layout(sW, sH, cW, cH);
    if (!lo.max) return '';
    var n = Math.min(qty, lo.max);
    var sheets = Math.ceil(qty / lo.max);
    var sw = Math.max(sW, sH) / 300;          // grubość linii w mm arkusza
    var pid = 'lpxCell' + Math.random().toString(36).slice(2, 7);
    var full = Math.floor(n / lo.cols), rem = n % lo.cols;
    var usedW = lo.cols * lo.w, usedH = lo.rows * lo.h;
    var svg = '<svg viewBox="' + (-sw) + ' ' + (-sw) + ' ' + (sW + 2 * sw) + ' ' + (sH + 2 * sw) + '" preserveAspectRatio="xMidYMid meet" ' +
      'style="width:100%;max-height:260px;display:block;margin:0 auto" role="img" aria-label="' + t('pv_title') + '">' +
      '<defs><pattern id="' + pid + '" width="' + lo.w + '" height="' + lo.h + '" patternUnits="userSpaceOnUse">' +
      '<rect x="0" y="0" width="' + lo.w + '" height="' + lo.h + '" style="fill:none;stroke:var(--muted,#7a91b0);stroke-width:' + sw +
      ';stroke-dasharray:' + (sw * 3) + ' ' + (sw * 2) + '"/></pattern></defs>' +
      '<rect x="0" y="0" width="' + sW + '" height="' + sH + '" rx="' + sw * 2 + '" style="fill:#c8a27a;fill-opacity:.28;stroke:#c8a27a;stroke-width:' + sw * 1.5 + '"/>';
    if (full > 0) svg += '<rect x="0" y="0" width="' + usedW + '" height="' + full * lo.h + '" style="fill:var(--orange,#ff6b2b);fill-opacity:.75"/>';
    if (rem > 0) svg += '<rect x="0" y="' + full * lo.h + '" width="' + rem * lo.w + '" height="' + lo.h + '" style="fill:var(--orange,#ff6b2b);fill-opacity:.75"/>';
    svg += '<rect x="0" y="0" width="' + usedW + '" height="' + usedH + '" style="fill:url(#' + pid + ')"/>';
    svg += '</svg>';
    var info = [sW + ' × ' + sH + ' mm', lo.cols + ' × ' + lo.rows + ' = ' + lo.max + ' ' + t('pcs')];
    if (lo.rotated) info.push('↻ ' + t('pv_rot'));
    if (sheets > 1) info.push('<b style="color:var(--orange,#ff6b2b)">' + t('pv_sheets').replace('{n}', sheets) + '</b>');
    return '<div class="lpx-preview" style="margin-top:12px;padding:12px;border:1px solid var(--border,#1e3352);border-radius:10px;background:var(--input-bg,rgba(0,0,0,.15))">' +
      '<div style="font-size:.7rem;font-weight:700;color:var(--orange,#ff6b2b);margin-bottom:8px;text-transform:uppercase;letter-spacing:.8px">📐 ' + t('pv_title') + '</div>' +
      svg +
      '<div style="font-size:.68rem;color:var(--muted,#7a91b0);margin-top:8px;line-height:1.6;text-align:center">' + info.join(' · ') + '<br>' +
      t('pv_legend').replace('{a}', n) + '</div></div>';
  }

  function renderPreview(sW, sH, cW, cH, qty) {
    var box = $('matResult');
    if (!box) return;
    var old = box.querySelector('.lpx-preview');
    if (old) old.parentNode.removeChild(old);
    if (cW > sW && cH > sH) return;
    var html = previewHTML(sW, sH, cW, cH, qty);
    if (html) box.insertAdjacentHTML('beforeend', html);
    relabel();
  }

  /* ---------- 2. Przedmiot klienta ---------- */
  function buildClientUI() {
    if ($('lpxClient')) return;
    var matBox = document.querySelector('.mat-box');
    if (!matBox) return;
    var wrap = document.createElement('div');
    wrap.id = 'lpxClient';
    wrap.style.cssText = 'margin-top:14px;padding:12px 14px;border:1px dashed var(--orange,#ff6b2b);border-radius:10px;background:rgba(255,107,43,.05)';
    wrap.innerHTML =
      '<label class="check-label" style="margin:0;align-items:flex-start"><input type="checkbox" id="clientItem">' +
      '<span><b data-lpx="ci_toggle"></b><br><span style="font-size:.66rem;color:var(--muted,#7a91b0)" data-lpx="ci_toggle_sub"></span></span></label>' +
      '<div id="lpxClientPanel" style="display:none;margin-top:12px">' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px">' +
      '<div class="field"><label data-lpx="ci_qty"></label><input type="number" id="clientQty" value="1" min="1" max="9999" class="calc-input"></div>' +
      '<div class="field"><label data-lpx="ci_setup"></label><input type="number" id="clientSetup" value="3" min="0" max="999" step="0.5" class="calc-input"></div>' +
      '<div class="field"><label data-lpx="ci_risk"></label><input type="number" id="clientRisk" value="10" min="0" max="100" step="1" class="calc-input"></div>' +
      '</div><p class="hint" style="margin-top:8px" data-lpx="ci_hint"></p></div>';
    matBox.parentNode.insertBefore(wrap, matBox);
    $('clientItem').addEventListener('change', applyClientMode);
    relabel();
  }

  function applyClientMode() {
    var on = !!($('clientItem') && $('clientItem').checked);
    var panel = $('lpxClientPanel');
    if (panel) panel.style.display = on ? 'block' : 'none';
    var matBox = document.querySelector('.mat-box');
    if (matBox) matBox.style.display = on ? 'none' : '';
    var raw = $('rawMaterial');
    if (raw && raw.closest('.field')) raw.closest('.field').style.display = on ? 'none' : '';
  }

  function relabel() {
    var els = document.querySelectorAll('[data-lpx]');
    for (var i = 0; i < els.length; i++) els[i].textContent = t(els[i].getAttribute('data-lpx'));
  }

  function client() {
    var on = !!($('clientItem') && $('clientItem').checked);
    return {
      on: on,
      qty: Math.max(1, Math.min(9999, Math.round(num('clientQty', 1)))),
      setupMin: Math.max(0, Math.min(999, num('clientSetup', 0))),
      risk: Math.max(0, Math.min(100, num('clientRisk', 0)))
    };
  }

  function money(v, sym) { return v.toFixed(2) + ' ' + sym; }
  function row(label, val, cls) {
    return '<div class="rpt-row ' + (cls || '') + '"><span class="rl">' + label + '</span><span class="rv">' + val + '</span></div>';
  }

  // wiersze do raportu na stronie (i do PDF – kopiowany jest ten sam HTML)
  function reportRows(c, sym) {
    if (!c || !c.ci || !c.ci.on) return '';
    var h = row(t('ci_item'), c.ci.qty + ' ' + t('pcs'));
    if (c.setup > 0) h += row(t('ci_setup_row') + ' (' + c.ci.setupMin + ' min × ' + c.ci.qty + ')', money(c.setup, sym));
    if (c.riskAmt > 0) h += row(t('ci_risk_row') + ' (' + c.ci.risk + '%)', money(c.riskAmt, sym));
    return h + '<div class="rpt-row sep"></div>';
  }
  function perItemRow(c, sym) {
    if (!c || !c.ci || !c.ci.on || c.ci.qty < 2) return '';
    return row(t('per_item'), money((c.brutto - c.ship) / c.ci.qty, sym), 'tot');
  }
  function txtBlock(c) {
    if (!c || !c.ci || !c.ci.on) return '';
    var s = t('ci_item') + ': ' + c.ci.qty + ' ' + t('pcs') + '\n';
    if (c.setup > 0) s += t('ci_setup_row') + ': ' + money(c.setup, c.sym) + '\n';
    if (c.riskAmt > 0) s += t('ci_risk_row') + ' (' + c.ci.risk + '%): ' + money(c.riskAmt, c.sym) + '\n';
    if (c.ci.qty > 1) s += t('per_item') + ': ' + money((c.brutto - c.ship) / c.ci.qty, c.sym) + '\n';
    return s;
  }

  window.LPX = { t: t, layout: layout, renderPreview: renderPreview, client: client, relabel: relabel,
                 reportRows: reportRows, perItemRow: perItemRow, txtBlock: txtBlock };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildClientUI);
  else buildClientUI();
})();
