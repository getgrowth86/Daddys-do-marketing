// Nimmt die Anmeldung vom Formular entgegen und leitet sie an ein Google Sheet weiter.
// Zieladresse (Apps Script Web-App URL) kommt aus der Umgebungsvariable SHEET_WEBHOOK_URL.
// KlickTipp wird in Schritt 2 ergaenzt.
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const data = {
    zeit: new Date().toISOString(),
    vorname: String(b.vorname || '').slice(0, 100),
    email: String(b.email || '').slice(0, 200),
    problem: String(b.wachstumsproblem || '').slice(0, 2000),
    variante: String(b.variant || ''),
    session: String(b.session || ''),
    utm_source: String(b.utm_source || ''),
    utm_medium: String(b.utm_medium || ''),
    utm_campaign: String(b.utm_campaign || ''),
    utm_content: String(b.utm_content || '')
  };
  if (!data.email.includes('@')) return res.status(400).json({ ok: false });
  const url = process.env.SHEET_WEBHOOK_URL;
  if (url) {
    try { await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); }
    catch (e) { console.error('sheet', e && e.message); return res.status(502).json({ ok: false }); }
  } else {
    console.error('SHEET_WEBHOOK_URL fehlt, Anmeldung nicht gespeichert');
  }
  return res.status(200).json({ ok: true });
};
