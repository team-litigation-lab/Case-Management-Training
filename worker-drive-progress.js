/* 📂 The Backup Drive's grades, kept on the trainee's progress where the 🏅 Scorecard and the 📋 Batch Sheet read them
   (progress:<id>.data["drive-grades"] and ["drive-setup"]).

   Each day's Backup File Maintenance is graded by the Worker (the nightly run, worker-drive-work.js gradeStructure, and
   🔁 Grade now) into the trainee's drive record. The progress copy was only written by the trainee's own page
   (js/cm-drive.js grade → storeSet), so a trainee who didn't open their Backup Drive after a grade showed nothing — the
   Scorecard's 📂 Backup Drive column stayed empty. driveToProgress writes the same record from the Worker, in the page's
   own form (js/cm-drive.js dayRecord), with a trainer's override applied (withDayOverrides).

   A trainee's page saves its whole progress record from a copy it read before: keepNewerDriveGrades keeps, day by day, the
   newer of the stored grade and the page's, so that save doesn't put an older grade back. */
const NAMES_ROW = "File names";
function dayRecord(g) {
  g = g || {};
  const rows = Array.isArray(g.rows) ? g.rows : [], nm = rows.find((r) => r && r.label === NAMES_ROW), sent = g.names && typeof g.names === "object" ? g.names : null;
  const names = sent ? { got: Number(sent.got) || 0, max: Number(sent.max) || 0, wrong: Number(sent.wrong) || 0 }
    : nm ? { got: Number(nm.got) || 0, max: Number(nm.max) || 0, wrong: 0 } : null;
  const notes = [].concat(...rows.filter((r) => r && r.label === NAMES_ROW).concat(rows.filter((r) => !r || r.label !== NAMES_ROW)).map((r) => (r && r.notes) || []));
  const issues = (Array.isArray(g.issues) ? g.issues : notes).slice(0, 4).map((t) => String(t).slice(0, 300));
  const dims = g.dims && typeof g.dims === "object" ? g.dims : null;
  return Object.assign({ score: g.score, passed: g.passed, at: g.at || null, issues }, names ? { names } : {}, dims ? { dims } : {},
    g.override ? { override: { score: g.override.score, comment: String(g.override.comment || "").slice(0, 300), by: g.override.by || "trainer" } } : {});
}
const later = (a, b) => String((a && a.at) || "") > String((b && b.at) || "");

// the drive record's grades (and the Day 1 setup), onto the trainee's progress; nothing written when nothing changed
export async function driveToProgress(kv, id, rec, withDayOverrides, pass) {
  if (!kv || !id || !rec) return false;
  const ov = withDayOverrides(rec, rec.grades || {}, rec.setup || null, pass);
  const grades = Object.fromEntries(Object.entries(ov.grades || {}).filter(([, g]) => g && typeof g.score === "number").map(([n, g]) => [n, dayRecord(g)]));
  const s = ov.setup && typeof ov.setup.score === "number" ? ov.setup : null;
  if (!Object.keys(grades).length && !s) return false;
  const key = `progress:${id}`, p = JSON.parse((await kv.get(key)) || "null");
  if (!p || typeof p !== "object") return false;   // (no progress yet: the trainee hasn't started — nothing to show it on)
  const data = Object.assign({}, p.data || {}), was = JSON.stringify([data["drive-grades"] || null, data["drive-setup"] || null]);
  const dg = Object.assign({}, data["drive-grades"] || {});
  Object.entries(grades).forEach(([n, g]) => { if (!dg[n] || !later(dg[n], g) || g.override) dg[n] = g; });
  data["drive-grades"] = dg;
  if (s) { const prev = data["drive-setup"] || {};
    data["drive-setup"] = Object.assign({}, prev, { score: s.score, ok: !!s.ok, attempts: s.attempts || prev.attempts || 1, at: s.at || prev.at || null, firstAt: prev.firstAt || prev.at || s.at || null },
      s.override ? { override: { score: s.override.score, by: s.override.by || "trainer" } } : {}); }
  if (JSON.stringify([data["drive-grades"], data["drive-setup"] || null]) === was) return false;
  await kv.put(key, JSON.stringify(Object.assign({}, p, { data, serverAt: new Date().toISOString() })));
  return true;
}

// a page's save: day by day, the newer of the stored grade and the page's (the page may hold one from before the Worker's)
export function keepNewerDriveGrades(existing, incoming) {
  const a = existing && existing.data && existing.data["drive-grades"], b = incoming && incoming.data && incoming.data["drive-grades"];
  if (!a || typeof a !== "object" || !incoming || typeof incoming !== "object" || !incoming.data) return incoming;
  const out = Object.assign({}, b || {});
  Object.entries(a).forEach(([n, g]) => { if (g && (!out[n] || later(g, out[n]))) out[n] = g; });
  return Object.assign({}, incoming, { data: Object.assign({}, incoming.data, { "drive-grades": out }) });
}
