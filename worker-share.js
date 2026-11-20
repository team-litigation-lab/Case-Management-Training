/* ============================================================
   🔗 Shared report links: the 🏆 Rankings & Progress Report (js/cm-rankings.js) as a public, read-only page for
   Management, who are not registered (worker.js imports this)

   share:<token>  {v, createdAt, updatedAt, by, expiresAt (null: no expiry), revoked, batch, snapshot}
     token: 128 random bits as 32 hex characters, made here (never by the page), so a link can't be guessed.
     snapshot: a frozen copy of exactly what the table shows, and nothing else: its title, batch and date and, per row,
     the rank, name, Overall, result, the four text cells (the trainer's edits included), the three attribute ratings and
     the progress. clean() keeps only those fields, as strings of a bounded length, whatever the page sent: no trainee
     id, record or score that the table doesn't print can be stored or served.

   POST /api/share/get {token}        no sign-in: the one link's snapshot, or 404 for an unknown, expired or revoked link.
                                      Answered no-store and noindex. One token per request; share: is never listed
                                      (worker.js /api/storage/list leaves it out and refuses the prefix).
   POST /api/share/save {snapshot, days, token?}   a trainer's only: a new link (days 7 / 30 / 90, or 0 for no
                                      expiry; 30 when not given), or, with the token of a live link, its snapshot
                                      frozen again (the same URL, the same expiry).
   POST /api/share/revoke {token}     a trainer's only: the link answers 404 from then on.
   POST /api/share/list {batch?}      a trainer's only: the links (no snapshots), newest first.
   A trainee's token can do none of these but get; worker.js /api/storage/set refuses share: keys to everyone, so a
   link is only ever written here, through clean().
   ============================================================ */
const TOKEN = /^[a-f0-9]{32}$/;
const DAYS = [7, 30, 90, 0];
const HEADERS = { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: HEADERS });
const str = (v, n) => String(v == null ? "" : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").slice(0, n);
const newToken = () => [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("");
const keyOf = (t) => `share:${t}`;

// the table's fields, and only those
function clean(s) {
  s = s && typeof s === "object" ? s : {};
  const rows = (Array.isArray(s.rows) ? s.rows : []).slice(0, 300).map((r) => {
    r = r && typeof r === "object" ? r : {};
    return {
      rank: str(r.rank, 8), name: str(r.name, 120), overall: str(r.overall, 12), result: str(r.result, 60),
      strength: str(r.strength, 2000), challenges: str(r.challenges, 2000),
      attrs: (Array.isArray(r.attrs) ? r.attrs : []).slice(0, 3).map((a) => ({ label: str(a && a.label, 80), stars: str(a && a.stars, 40) })),
      redflag: str(r.redflag, 1000), endorsement: str(r.endorsement, 1000), tier: str(r.tier, 16),
      progress: str(r.progress, 40), passed: str(r.passed, 40)
    };
  });
  return { title: str(s.title, 200), batch: str(s.batch, 60), date: str(s.date, 60), rows };
}
const live = (rec, now = Date.now()) => !!rec && !rec.revoked && (rec.expiresAt == null || Date.parse(rec.expiresAt) > now);
const read = async (kv, t) => { try { return JSON.parse((await kv.get(keyOf(t))) || "null"); } catch (e) { return null; } };

// no sign-in: one link
export async function shareGet(kv, request) {
  const b = await request.json().catch(() => ({}));
  const t = String((b && b.token) || "");
  if (!kv || !TOKEN.test(t)) return reply({ error: "Not found" }, 404);
  const rec = await read(kv, t);
  if (!live(rec)) return reply({ error: "Not found" }, 404);
  return reply({ snapshot: clean(rec.snapshot), createdAt: rec.createdAt, updatedAt: rec.updatedAt || rec.createdAt, expiresAt: rec.expiresAt });
}

// a trainer's: save, revoke, list
export async function shareAdmin(kv, tok, path, b, who, listAll) {
  if (!tok || tok.role !== "a") return reply({ error: "Only a trainer can share a report." }, 403);
  b = b && typeof b === "object" ? b : {};
  const now = new Date().toISOString();
  if (path === "/api/share/save") {
    const snapshot = clean(b.snapshot);
    if (!snapshot.rows.length) return reply({ error: "Nothing to share: the table has no rows." }, 400);
    if (b.token != null) {
      const t = String(b.token), rec = TOKEN.test(t) ? await read(kv, t) : null;
      if (!live(rec)) return reply({ error: "That link is expired, revoked or unknown." }, 404);
      Object.assign(rec, { snapshot, batch: snapshot.batch, updatedAt: now });
      await kv.put(keyOf(t), JSON.stringify(rec));
      return reply({ ok: true, token: t, expiresAt: rec.expiresAt });
    }
    const days = b.days == null ? 30 : Number(b.days);
    if (!DAYS.includes(days)) return reply({ error: "days must be 7, 30, 90 or 0 (no expiry)" }, 400);
    const t = newToken(), rec = { v: 1, createdAt: now, updatedAt: now, by: who, expiresAt: days ? new Date(Date.now() + days * 864e5).toISOString() : null, revoked: false, batch: snapshot.batch, snapshot };
    await kv.put(keyOf(t), JSON.stringify(rec));
    return reply({ ok: true, token: t, expiresAt: rec.expiresAt });
  }
  if (path === "/api/share/revoke") {
    const t = String(b.token || ""), rec = TOKEN.test(t) ? await read(kv, t) : null;
    if (!rec) return reply({ error: "Not found" }, 404);
    Object.assign(rec, { revoked: true, revokedAt: now, revokedBy: who });
    await kv.put(keyOf(t), JSON.stringify(rec));
    return reply({ ok: true });
  }
  if (path === "/api/share/list") {
    const keys = (await listAll("share:")).filter((k) => TOKEN.test(k.slice(6)));
    const out = [];
    for (const k of keys) {
      const rec = await read(kv, k.slice(6));
      if (!rec || (b.batch && rec.batch !== String(b.batch))) continue;
      out.push({ token: k.slice(6), batch: rec.batch, title: (rec.snapshot || {}).title || "", createdAt: rec.createdAt, updatedAt: rec.updatedAt || rec.createdAt, expiresAt: rec.expiresAt, revoked: !!rec.revoked, live: live(rec), by: rec.by || "" });
    }
    out.sort((x, y) => String(y.createdAt).localeCompare(String(x.createdAt)));
    return reply({ links: out });
  }
  return reply({ error: "Unknown endpoint" }, 404);
}
export const shareKey = (k) => /^share:/.test(String(k || ""));
