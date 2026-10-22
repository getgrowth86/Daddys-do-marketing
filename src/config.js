/* Zentrale Einstellungen. Hier alles anpassen. */
window.CONFIG = {
  weekday: 4, hour: 10, minute: 0, seats: 100,
  bonus: '', podcastUrl: '', tuev: { image: '', caption: 'Nick Geringer ist Business Development Professional mit TÜV Rheinland geprüfter Qualifikation.' }, nickBio: '', results: [],
  /* A/B/C Headline Test. Mission Control (/mission-control) ueberschreibt Aufteilung und Texte nach dem ersten Speichern. *Wort* = gold unterstrichen */
  ab: {
    weights: { A: 34, B: 33, C: 33 },
    headlines: {
      A: 'Du spürst, dass da *mehr* geht. Wir sagen dir, wo.',
      B: 'Dein Umsatz stagniert? Wir finden *live* den einen Hebel, der dein Wachstum bremst.',
      C: 'Deine Ads bringen Leads, aber keine Kunden? Wir zerlegen *live*, woran es liegt.'
    }
  }
};

/* Meta Pixel und Quellen-Tracking (Datei /tracking.js) */
(function () {
  var s = document.createElement('script');
  s.src = '/tracking.js';
  s.async = true;
  document.head.appendChild(s);
})();

/* TÜV Siegel: wird aus 21 kleinen Teilen /tuev/0..20.bin zusammengesetzt, damit die Seite nicht blockiert. */
(function () {
  function show() {
    var box = document.getElementById('tuev');
    if (!box) return;
    var n = 21, parts = [], i;
    for (i = 0; i < n; i++) parts.push(fetch('/tuev/' + i + '.bin').then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); }));
    Promise.all(parts).then(function (b) {
      var url = URL.createObjectURL(new Blob(b, { type: 'image/png' }));
      var img = box.querySelector('img'), p = box.querySelector('p');
      img.src = url;
      img.width = 340;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      p.textContent = window.CONFIG.tuev.caption;
      box.classList.remove('hide');
    }).catch(function () {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show); else show();
})();
