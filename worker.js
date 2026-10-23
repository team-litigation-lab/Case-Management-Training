/**
 * LSH Case Management Training — Cloudflare Worker (secured)
 *
 * Same engine as the EA/PA portal worker. All storage lives in the shared
 * LSH_KV namespace under a "cm:" key prefix, so the CM and EA/PA portals can
 * use one KV namespace without their trainee/progress records colliding.
 *
 * Secrets (set once with `wrangler secret put <NAME>`):
 *   GEMINI_API_KEY     — the reviewer behind every AI feature (Google Gemini). Required. More keys (GEMINI_API_KEY1,
 *                        GEMINI_API_KEY14, GEMINI_API_KEY15, GEMINI_API_KEY16 …) join the pool: they take turns, and a key that
 *                        runs out of quota or credits rests while the next one answers.
 *   GEMINI_MODEL       — optional, default "gemini-3.8-flash" (falls back to gemini-3.5-flash-lite)

 *   MASTER_ADMIN_PASSWORD — admin sign-in (the LSH Training Portal's master admin password: one password on every platform). Setting this switches the portal
 *                        into SECURE MODE: every storage and AI request must carry
 *                        a signed session token.
 *   SESSION_SECRET     — optional; signs session tokens (defaults to MASTER_ADMIN_PASSWORD)
 *
 * Without MASTER_ADMIN_PASSWORD the Worker runs in the old open mode so nothing breaks
 * before you've configured it (the Admin screen shows a warning).
 */
/* ---------- KV with the "cm:" namespace prefix ---------- */
const KV_PREFIX = "cm:";
function kvOf(env) {
  const raw = env.LSH_KV;
  if (!raw) return null;
  return {
    get: (k) => raw.get(KV_PREFIX + k),
    put: (k, v, o) => raw.put(KV_PREFIX + k, v, o),
    delete: (k) => raw.delete(KV_PREFIX + k),
    list: async (opts = {}) => {
      const r = await raw.list(Object.assign({}, opts, { prefix: KV_PREFIX + (opts.prefix || "") }));
      return Object.assign({}, r, { keys: r.keys.map((x) => Object.assign({}, x, { name: x.name.slice(KV_PREFIX.length) })) });
    }
  };
}

const JSON_HEADERS = { "Content-Type": "application/json", "Cache-Control": "no-store" };
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: JSON_HEADERS });
const enc = new TextEncoder();

/* ---------- tokens: "<role>.<subject>.<expiry>.<hmac>" ---------- */
async function hmac(secret, msg) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
// The admin password: MASTER_ADMIN_PASSWORD, the LSH Training Portal's master admin password (one password signs an admin in on the Portal and on every platform).
function adminPass(env) { return env.MASTER_ADMIN_PASSWORD || ""; }
// The admin password is compared as a person types it. Both the stored and the typed password are read without spaces or line
// breaks around them, quotes pasted around the whole password, invisible characters (zero-width spaces, soft hyphens) or curly
// quotes and long dashes: a secret pasted into Cloudflare with any of these signs in from a saved (autofilled) password but could
// never be typed.
const PASS_INVISIBLE = /[\u00AD\u180E\u200B-\u200F\u2028-\u202F\u205F-\u206F\uFEFF]/g;
const PASS_CURLY = /[\u2018\u2019\u201A\u201B\u2032\u201C\u201D\u201E\u201F\u2033\u2010-\u2015\u2212]/;
function cleanPass(v) {
  return String(v || "").normalize("NFKC").replace(PASS_INVISIBLE, "")
    .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'").replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"').replace(/[\u2010-\u2015\u2212]/g, "-").trim();
}
const PASS_QUOTED = /^(["'`])([\s\S]*)\1$/;
function normPass(v) { const t = cleanPass(v), q = t.match(PASS_QUOTED); return q ? q[2].trim() : t; }
// What /version says about the stored password (never the password itself).
function adminPassStatus(env) {
  const raw = String(env.MASTER_ADMIN_PASSWORD || "");
  if (!raw) return "not set (open mode)";
  if (!normPass(raw)) return "MASTER_ADMIN_PASSWORD is set but holds no password, only quotes, spaces or invisible characters: not accepted";
  const ignored = [];
  if (raw !== raw.trim()) ignored.push("spaces or a line break around it");
  if (new RegExp(PASS_INVISIBLE.source).test(raw)) ignored.push("invisible characters");
  if (PASS_CURLY.test(raw)) ignored.push("curly quotes or long dashes");
  if (PASS_QUOTED.test(cleanPass(raw))) ignored.push("quotes around it");
  const odd = /[^\x20-\x7E]/.test(normPass(raw)) ? "; it has a character that isn't on a standard keyboard (an accented or look-alike letter): it must be typed exactly" : "";
  return "MASTER_ADMIN_PASSWORD" + (ignored.length ? ` (had ${ignored.join(", ")}: ignored)` : "") + odd;
}
function secretOf(env) { return env.SESSION_SECRET || adminPass(env); }
async function makeToken(env, role, subject, hours) {
  const exp = Date.now() + hours * 3600 * 1000;
  const body = `${role}.${encodeURIComponent(subject)}.${exp}`;
  return `${body}.${await hmac(secretOf(env), body)}`;
}
async function readToken(env, request) {
  const h = request.headers.get("Authorization") || "";
  const t = h.startsWith("Bearer ") ? h.slice(7) : "";
  const parts = t.split(".");
  if (parts.length !== 4) return null;
  const [role, subj, exp, sig] = parts;
  if (Date.now() > Number(exp)) return null;
  const good = await hmac(secretOf(env), `${role}.${subj}.${exp}`);
  if (!safeEqual(good, sig)) return null;
  return { role, id: decodeURIComponent(subj) };
}
function safeEqual(a, b) {
  a = String(a); b = String(b);
  if (a.length !== b.length) return false;
  let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/* ---------- Main Portal sign-in: the LSH Training Portal signs a trainee in, this site trusts its ticket ----------
   ticket = "<base64url JSON {first, last, b, exp}>.<HMAC-SHA256 of that text, keyed with PORTAL_SSO_SECRET>"
   (an administrator's ticket is {r: "a", exp}: they were signed in on the Portal with the master admin password).
   exp is epoch milliseconds; a ticket is good for a few minutes, so a copied link is no use later. */
const PORTAL_TICKET_MAX_MS = 10 * 60 * 1000;
// The Portal secret, without any space or line break pasted around it (the Portal does the same).
function portalSecret(env) { return String(env.PORTAL_SSO_SECRET || "").trim(); }
/* Single sign-on: the LSH Training Portal is the only way a trainee gets in, on every LSH platform. The same
   rule as the CMS (portalOnly in its functions/_portal.js): on as soon as this program has an admin password,
   whether or not the Portal secret is set yet. A name + batch typed at /api/auth/trainee is refused — the
   sign-in screen hasn't offered that form since js/portal-gate.js took it over — and only a trainee already
   signed in on this device can renew their session that way.
   PORTAL_SSO_SECRET (the same value as the Portal's) is what lets a Portal ticket be checked, so until it is
   set here no trainee can be signed in at all: /api/auth/portal says so plainly (portal-secret-missing) and
   /api/auth/status reports portalSecret false, which the sign-in screen shows an administrator.
   PORTAL_ONLY=off is the way back to the old name + batch sign-in; leave it unset in production. */
function portalOnly(env) { return !!(adminPass(env) && String(env.PORTAL_ONLY || "").trim().toLowerCase() !== "off"); }
// why (optional) gets why a ticket was refused: "format", "signature" (the Portal and this program don't share the same secret) or "expired".
// An administrator's Portal ticket signs in once: its signature is remembered for 10 minutes (longer than the ticket
// lives), and a second use is refused.
async function useTicketOnce(kv, ticket) {
  if (!kv) return true;
  const key = "sso-used:" + String(ticket || "").split(".").pop().slice(0, 43);
  if (await kv.get(key)) return false;
  await kv.put(key, "1", { expirationTtl: 600 });
  return true;
}
async function readPortalTicket(env, ticket, why = {}) {
  if (!portalSecret(env)) { why.r = "format"; return null; }
  const parts = String(ticket || "").split(".");
  if (parts.length !== 2) { why.r = "format"; return null; }
  const good = await hmac("portal-sso:" + portalSecret(env), parts[0]);
  if (!safeEqual(good, parts[1])) { why.r = "signature"; return null; }
  let t; try { t = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)))); } catch (e) { why.r = "format"; return null; }
  const exp = Number(t && t.exp);
  if (!exp || Date.now() > exp || exp - Date.now() > PORTAL_TICKET_MAX_MS) { why.r = "expired"; return null; }
  if (t.r === "s") return { system: true };   // the Portal's own server-side tools (sign-in check, registration import): never given to a person
  if (t.r === "a") return { admin: true, name: String(t.n || "").trim().slice(0, 60) };   // an administrator signed in on the Portal (their own admin account)
  const first = String(t.first || "").trim(), last = String(t.last || "").trim(), batch = String(t.b || "").trim();
  if (!first || !last || !batch) return null;
  return { name: `${first} ${last}`, first, last, batch };
}
// Like readToken, but an expired token still counts for a while (same signature, same trainee), so a trainee
// midway through the course whose 30 days run out isn't sent back to the portal in the middle of a lesson.
const TOKEN_GRACE_MS = 60 * 24 * 3600 * 1000;
async function readTraineeTokenGrace(env, request) {
  const h = request.headers.get("Authorization") || "";
  const parts = (h.startsWith("Bearer ") ? h.slice(7) : "").split(".");
  if (parts.length !== 4 || parts[0] !== "t") return null;
  const [role, subj, exp, sig] = parts;
  if (Date.now() > Number(exp) + TOKEN_GRACE_MS) return null;
  if (!safeEqual(await hmac(secretOf(env), `${role}.${subj}.${exp}`), sig)) return null;
  return { role, id: decodeURIComponent(subj) };
}

/* ---------- trainee IDs (must match the portal's generateTraineeId) ---------- */
function slugPart(t) {
  return String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
/* A Batch ID is B + the date the batch started, as MMDDYY: B100926 for 9 October 2026. The same rule on every
   LSH platform (canonicalBatch in the CMS's functions/_utils.js). Whatever is typed — any capitals, spaces or
   dashes, the B left off, a four-digit year, or the older long forms B09102026 and B09102026-LSHTRAINEE-001 —
   reads as that one form, so B100926, "b 10-09-26" and B10092026 are the same batch. A Batch ID given out
   before as B + DDMMYY reads the same as before. "" when it isn't a real date. */
const batchRealDay = (mm, dd, yy) => { const d = new Date(Date.UTC(2000 + yy, mm - 1, dd)); return mm >= 1 && mm <= 12 && dd >= 1 && d.getUTCMonth() === mm - 1; };
function canonicalBatch(raw) {
  const v = String(raw || "").toUpperCase().replace(/[\s\-]/g, "");
  const m = /^B?(\d{2})(\d{2})(\d{4}|\d{2})(?:LSH[A-Z]*\d+)?$/.exec(v);
  if (!m) return "";
  const yy = m[3].slice(-2);
  if (!batchRealDay(+m[1], +m[2], +yy) && !batchRealDay(+m[2], +m[1], +yy)) return "";
  return `B${m[1]}${m[2]}${yy}`;
}
// The same Batch ID whatever its form. An older code that isn't a date (B1, a guest account's) compares as
// typed, so a trainee registered under one still matches their own records.
const batchKey = (s) => slugPart(canonicalBatch(s) || s);
// A trainee's record id. newId uses the Batch ID in its one form, so the same batch typed differently is the
// same record; rawId is the id a record made before this rule got from the batch exactly as it was typed, and
// legacyId the older name-only id. traineeSession tries all three, so nobody's records are left behind.
function candidateIds(name, batch) {
  let slug = slugPart(name).slice(0, 40);
  if (!slug) { let h = 0; for (const c of String(name || "")) h = (h * 31 + c.codePointAt(0)) >>> 0; slug = "trainee-" + h.toString(36); }
  const b = slugPart(canonicalBatch(batch) || batch).slice(0, 20), raw = slugPart(batch).slice(0, 20);
  return { newId: b ? `${slug}--${b}` : slug, rawId: raw ? `${slug}--${raw}` : slug, legacyId: slugPart(name).slice(0, 40) || "trainee" };
}

/* ---------- what a trainee may touch ---------- */
// Daily Activities: activities:dayN and their attachments (actfile:*) are published by admins for everyone;
// settings:feedback-style is the facilitator voice the portal's AI feedback is written in.
const PUBLIC_READ = [/^blueprint:meta$/, /^settings:(feedback|certificate|tools|feedback-style)$/, /^activities:day\d+$/, /^actfile:[a-z0-9]{1,40}$/, /^surprise-task-day\d+$/, /^extralessons:day\d+$/, /^lessonx:day\d+$/, /^extraquiz:day\d+$/, /^handouts:links$/];
const OWN = (id) => [`trainee:${id}`, `progress:${id}`, `feedback:${id}`, `focus:${id}`, `actsub:${id}`];
const PROTECTED_TRAINEE_FIELDS = ["approved", "rejected", "archived", "labAttemptsResetAt", "certTrainer", "aiReview", "flaggedInvalidInput", "assignedRoleplay", "registeredAt", "unlockedDays", "unlockedDaysAt"];

// callsim:<id>: the trainee's graded calls from the Call Simulator (☎ LSH Ring Channel), kept by the Training Portal (its /api/call-results).
// labreview:<id>: the trainer's reviews of the trainee's Practice Lab (score, rating, comment per activity; js/cm-lab.js),
// written by admins only. simresults:<id>: the trainee's LSH Training Portal simulator results, written by the Portal
// ({traineeId, updatedAt, results, best:{<simulator>:{score, count, at}}}). The trainee reads all three, but never
// writes them (traineeWrite refuses keys it doesn't know).
function canRead(tok, key) {
  if (tok.role === "a") return true;
  return OWN(tok.id).includes(key) || key === `callsim:${tok.id}` || key === `labreview:${tok.id}` || key === `simresults:${tok.id}` || key.startsWith(`actup:${tok.id}:`) || PUBLIC_READ.some((re) => re.test(key));
}
// What a trainee reads of their own records leaves out what is for trainers only: the private trainer note on each day's
// feedback (the trainer's Feedback panel calls it "Private trainer note (not shown to trainee)").
function forTrainee(tok, key, raw) {
  if (tok.role === "a" || raw == null || !key.startsWith("feedback:")) return raw;
  try {
    const v = JSON.parse(raw);
    Object.values((v && v.days) || {}).forEach((d) => { if (d && typeof d === "object") delete d.trainerNote; });
    return JSON.stringify(v);
  } catch (e) { return raw; }
}
async function traineeWrite(env, tok, key, value) {
  const kv = kvOf(env);
  const id = tok.id;
  let incoming; try { incoming = JSON.parse(value); } catch (e) { return "Invalid JSON"; }
  const existingRaw = await kv.get(key);
  let existing = null; try { existing = existingRaw ? JSON.parse(existingRaw) : null; } catch (e) { /* a damaged record is replaced */ }
  if (key === `trainee:${id}`) {
    // Trainees keep their own record current, but can never change approval, attempts resets, etc.
    const merged = Object.assign({}, incoming);
    PROTECTED_TRAINEE_FIELDS.forEach((f) => { if (existing && f in existing) merged[f] = existing[f]; else delete merged[f]; });
    if (!existing) { merged.approved = false; merged.registeredAt = new Date().toISOString(); }
    merged.id = id;
    await kv.put(key, JSON.stringify(merged)); return null;
  }
  if (key === `progress:${id}`) {
    if (String(value).length > 2000000) return "Too large";
    await kv.put(key, value); return null;
  }
  if (key === `feedback:${id}`) {
    // Trainees (auto-review) may add days and mark reviews read — never rewrite a trainer's review.
    const out = existing && existing.days ? JSON.parse(JSON.stringify(existing)) : { days: {} };
    const inDays = (incoming && incoming.days) || {};
    for (const [d, v] of Object.entries(inDays)) {
      const cur = out.days[d];
      const trainerOwned = cur && (cur.editedByTrainer || (cur.status === "sent" && !cur.auto));
      if (trainerOwned) { if (v && v.readAt && !cur.readAt) cur.readAt = v.readAt; continue; }
      if (v && typeof v === "object") {
        delete v.editedByTrainer;
        v.auto = true;   // what a trainee writes is the auto-review, so it can never pass for a trainer's sent review
        if (cur && cur.trainerNote) v.trainerNote = cur.trainerNote;   // the trainee never sees it (forTrainee), so never drops or rewrites it
        out.days[d] = v;
      }
    }
    await kv.put(key, JSON.stringify(out)); return null;
  }
  if (key === `focus:${id}`) {
    // Trainees may only mark trainer focus items as seen/done.
    const out = existing && Array.isArray(existing.items) ? existing : { items: [] };
    const byId = Object.fromEntries(((incoming && incoming.items) || []).map((x) => [x.id, x]));
    out.items.forEach((x) => { const u = byId[x.id]; if (u) { x.seenAt = u.seenAt || x.seenAt || null; x.doneAt = u.doneAt || null; } });
    await kv.put(key, JSON.stringify(out)); return null;
  }
  if (key === `actsub:${id}`) {
    // Daily Activities submissions: a trainee writes their own answers and marks feedback read;
    // the trainer's feedback is never theirs to change. A new submission retires the old feedback.
    const out = existing && existing.items ? existing : { items: {} };
    for (const [aid, v] of Object.entries((incoming && incoming.items) || {})) {
      if (!/^[a-z0-9]{1,40}$/.test(aid) || !v || typeof v !== "object") continue;
      const cur = out.items[aid] || {};
      const next = Object.assign({}, cur);
      if (typeof v.answer === "string") next.answer = v.answer.slice(0, 20000);
      if ("file" in v) next.file = v.file && typeof v.file === "object" ? { name: String(v.file.name || "").slice(0, 200), type: String(v.file.type || "").slice(0, 100), size: Number(v.file.size) || 0 } : null;
      if (v.submittedAt && v.submittedAt !== cur.submittedAt) {
        next.submittedAt = String(v.submittedAt).slice(0, 40);
        next.attempts = (cur.attempts || 0) + 1;
        if (cur.feedback && cur.feedback.status === "sent") next.prevFeedback = cur.feedback;
        delete next.feedback; delete next.readAt;
      }
      if (v.readAt && cur.feedback && cur.feedback.status === "sent" && !cur.readAt) next.readAt = String(v.readAt).slice(0, 40);
      out.items[aid] = next;
    }
    const outStr = JSON.stringify(out);
    if (outStr.length > 1000000) return "Too large";
    await kv.put(key, outStr); return null;
  }
  if (key.startsWith(`actup:${id}:`) && /^actup:.+:[a-z0-9]{1,40}$/.test(key)) {
    // A file a trainee attached to an activity answer (a data URL, about 4 MB at most).
    if (String(value).length > 6000000) return "File too large";
    await kv.put(key, value); return null;
  }
  if (/^tfeedback:[a-z0-9]+$/.test(key)) {
    if (existing) return "Already submitted";
    if (String(value).length > 20000) return "Too large";
    await kv.put(key, value); return null;
  }
  if (/^cert:LSH-CM-\d{4}-[A-Z0-9]{6}$/.test(key)) {
    // A trainee records their own certificate once, and only as an approved trainee: the name, batch and issuer
    // come from the server's own record, never from the request, and an issued certificate is never rewritten.
    if ((incoming && incoming.traineeId) !== id || existing) return "Not allowed";
    let who = null; try { who = JSON.parse((await kv.get(`trainee:${id}`)) || "null"); } catch (e) { /* no record */ }
    if (!who || who.approved !== true || who.archived) return "Not allowed";
    const rec = Object.assign({}, incoming, { traineeId: id, name: who.name || incoming.name || "", batch: who.batch || "", issuedBy: "self", issuedAt: new Date().toISOString() });
    await kv.put(key, JSON.stringify(rec)); return null;
  }
  return "Not allowed";
}

/* ---------- Google Gemini (free tier) ----------
   Gemini is the only reviewer. The portal sends a simple
   {messages, system, max_tokens} request; this translates it to Gemini's
   generateContent and the reply back. Model: GEMINI_MODEL (default gemini-3.8-flash),
   falling back to gemini-3.5-flash-lite / gemini-3.5-flash if busy or unavailable. */
/* Gemini refuses some regions ("User location is not supported for the API use"). The Worker is placed in
   the US (wrangler.json), but placement is best-effort: a request can still run near the trainee. A refused
   call is sent again from GeminiRelay, a Durable Object pinned to western North America, and that Worker
   instance keeps using the relay from then on. */
let geminiViaRelay = false;
async function geminiFetch(env, url, init) {
  const viaRelay = () => {
    const ns = env.GEMINI_RELAY, id = ns.idFromName("gemini-relay-" + Math.floor(Math.random() * 4));
    return ns.get(id, { locationHint: "wnam" }).fetch("https://relay/", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, headers: init.headers, body: init.body })
    });
  };
  if (geminiViaRelay && env.GEMINI_RELAY) return viaRelay();
  const r = await fetch(url, init);
  if (r.status !== 400 || !env.GEMINI_RELAY) return r;
  const text = await r.text();
  if (!/location is not supported/i.test(text)) return new Response(text, { status: r.status, headers: { "Content-Type": "application/json" } });
  geminiViaRelay = true;
  return viaRelay();
}
export class GeminiRelay {
  constructor(state, env) {}
  async fetch(request) {
    const { url, headers, body } = await request.json();
    if (!/^https:\/\/generativelanguage\.googleapis\.com\//.test(String(url))) return new Response("Not allowed", { status: 403 });
    const r = await fetch(url, { method: "POST", headers, body });
    return new Response(await r.text(), { status: r.status, headers: { "Content-Type": "application/json" } });
  }
}

// The shared AI gateway (the Main Portal's /api/ai-gateway): when AI_GATEWAY_SECRET is set on this Worker, every AI call goes there
// and draws from the Portal's one master key pool and one shared budget (module "cms") with the other programs, the CMS and the
// Portal's simulators. Without the secret this Worker still uses its own GEMINI_API_KEY pool, as before.
const gatewayOn = (env) => !!String((env && env.AI_GATEWAY_SECRET) || "").trim();
async function viaGateway(env, req, user) {
  const toText = (c) => typeof c === "string" ? c : (Array.isArray(c) ? c.map((p) => p && p.text ? p.text : "").join("\n") : "");
  const messages = (req.messages || []).map((m) => ({ role: m.role === "assistant" ? "model" : "user", text: toText(m.content) }));
  let r, data = null;
  try {
    r = await fetch(String(env.PORTAL_URL || "https://cm-training-activity.pages.dev").replace(/\/+$/, "") + "/api/ai-gateway", {
      method: "POST", headers: { "Content-Type": "application/json", "X-Gateway-Key": String(env.AI_GATEWAY_SECRET).trim() },
      body: JSON.stringify({ module: "cms", fast: isChat(req), user: String(user || "worker").slice(0, 80), system: toText(req.system), messages, maxTokens: Math.min(Math.max(Number(req.max_tokens) || 1024, 128), 4096) })
    });
    data = await r.json().catch(() => null);
  } catch (e) { return json({ error: { message: "The shared AI gateway is unreachable: " + (e && e.message || e) } }, 502); }
  if (data && data.success) return json({ content: [{ type: "text", text: data.text }], model: data.model, stop_reason: "end_turn", provider: "gemini-gateway" });
  const status = r.status === 429 ? 429 : (r.status === 401 || r.status === 403 || r.status === 501) ? 502 : (r.status || 502);
  return json({ error: { message: (status === 429 ? "rate limit (shared AI budget): " : "Portal AI gateway: ") + ((data && data.error) || "AI gateway error " + r.status) } }, status);   // named, so the page can say where the keys live
}

/* The key pool: every GEMINI_API_KEY secret on this Worker is used, GEMINI_API_KEY and any numbered one (GEMINI_API_KEY1 …
   GEMINI_API_KEY14, GEMINI_API_KEY15, GEMINI_API_KEY16 …). They take turns: each request starts on the next key. A key that hits its
   limit rests (a minute for a per-minute limit, an hour for a daily one or when it is out of credits or has billing off, 10 minutes
   if Google rejects it) and the request moves on to the next key. Same rules as the CMS (functions/_ai.js) and the Training Portal's
   AI gateway (functions/_ai-gateway.js). The rests live in this Worker instance's memory. */
const geminiKeyNames = (env) => Object.keys(env || {}).filter((n) => /^GEMINI_API_KEY\d*$/.test(n) && String(env[n] || "").trim())
  .sort((a, b) => (Number(a.slice(14)) || 0) - (Number(b.slice(14)) || 0));
const geminiRest = new Map();   // key name -> resting until (ms)
let geminiTurn = 0;
function geminiKeyOrder(env) {
  const names = geminiKeyNames(env); if (!names.length) return [];
  const start = geminiTurn++ % names.length, now = Date.now();
  const turn = names.slice(start).concat(names.slice(0, start));
  const awake = turn.filter((n) => !(geminiRest.get(n) > now));
  return awake.length ? awake : turn;   // all resting: try them anyway, the soonest may be back
}
function restGeminiKey(name, status, msg) {
  const m = String(msg || "");
  let ms = 0;
  if (status === 429) ms = /per.?day|daily|PerDay/i.test(m) ? 3600e3 : 60e3;
  if (/credit|billing|quota exceeded for quota metric.*day|prepay/i.test(m)) ms = 3600e3;
  if ((status === 400 || status === 403) && /API key|permission|denied/i.test(m)) ms = 600e3;
  if (status === 401) ms = 600e3;   // Google refused the key itself (UNAUTHENTICATED: revoked, wrong kind of key): rest it, the next key takes over
  if (ms) geminiRest.set(name, Date.now() + ms);
  return !!ms;
}

// A live call's next line ("chat"): the quick model first, with as little thinking as the model allows and a short answer,
// so the caller answers in about a second instead of several. Reviews, grading and the rest keep the fuller settings.
const noThinking = new Set();   // models that refused a thinking setting: not sent to them again (no second request every turn)
const isChat = (req) => /^(chat|call)$/i.test(String((req && req.feature) || ""));
async function callGemini(env, rawBody, user) {
  let req; try { req = JSON.parse(rawBody); } catch (e) { return json({ error: "Invalid request" }, 400); }
  if (gatewayOn(env)) return await viaGateway(env, req, user);
  const toText = (c) => typeof c === "string" ? c : (Array.isArray(c) ? c.map((p) => p && p.text ? p.text : "").join("\n") : "");
  const contents = (req.messages || []).map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: toText(m.content) }] }));
  const payload = {
    contents,
    // extra headroom: newer Gemini models may spend part of the budget "thinking" before answering
    generationConfig: { maxOutputTokens: isChat(req) ? 1024 : Math.min(Math.max((Number(req.max_tokens) || 1024) * 2, 2048), 16384), temperature: 0.7 }
  };
  if (req.system) payload.systemInstruction = { parts: [{ text: toText(req.system) }] };
  // Google limits the 2.5 models to accounts that already used them; new projects use 3.8 Flash / 3.5 Flash-Lite.
  const models = (isChat(req) ? ["gemini-3.5-flash-lite", env.GEMINI_MODEL || "gemini-3.8-flash", "gemini-3.5-flash"]
    : [env.GEMINI_MODEL || "gemini-3.8-flash", "gemini-3.5-flash-lite", "gemini-3.5-flash"]).filter((v, i, a) => a.indexOf(v) === i);
  const keys = geminiKeyOrder(env);
  if (!keys.length) return json({ error: "No AI key is configured on this Worker. Add GEMINI_API_KEY (or GEMINI_API_KEY1, GEMINI_API_KEY2, …) as a Secret in Cloudflare." }, 500);
  let last = null;
  for (const keyName of keys) {
  let nextKey = false;
  for (const model of models) {
    const p = JSON.parse(JSON.stringify(payload));
    if (noThinking.has(model)) delete p.generationConfig.thinkingConfig;
    else if (/2\.5-flash/.test(model)) p.generationConfig.thinkingConfig = { thinkingBudget: 0 };   // 2.5: thinking off
    else p.generationConfig.thinkingConfig = { thinkingLevel: isChat(req) ? "minimal" : "low" };   // 3.x: think briefly → much faster replies (a call's line: barely)
    const send = (body) => geminiFetch(env, `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": String(env[keyName]).trim() },
      body: JSON.stringify(body)
    });
    let r = await send(p);
    let data = await r.json().catch(() => ({}));
    if (r.status === 400 && /thinking/i.test((data.error && data.error.message) || "")) {   // model doesn't accept that setting → send without it
      noThinking.add(model); delete p.generationConfig.thinkingConfig; r = await send(p); data = await r.json().catch(() => ({}));
    }
    if (r.ok) {
      const cand = (data.candidates || [])[0] || {};
      const text = ((cand.content && cand.content.parts) || []).filter((x) => !x.thought).map((x) => x.text || "").join("");
      if (!text) { last = { status: 502, msg: `Gemini returned no text (${cand.finishReason || "blocked"})` }; continue; }
      return json({ content: [{ type: "text", text }], model, stop_reason: cand.finishReason === "MAX_TOKENS" ? "max_tokens" : "end_turn", provider: "gemini" });
    }
    const msg = (data.error && data.error.message) || `Gemini error ${r.status}`;
    last = { status: r.status, msg };
    if (restGeminiKey(keyName, r.status, msg)) { nextKey = true; break; }   // limit, credits or a rejected key: the next key takes over
    if (r.status === 400 && /API key/i.test(msg)) { nextKey = true; break; }
    if (![404, 429, 500, 503].includes(r.status)) break;
  }
  if (!nextKey) break;   // not a key problem: another key would get the same answer
  }
  // 502, never 401 or 403: Google refusing an AI key is not the trainee's sign-in. A 401 from this Worker always means
  // "Sign-in required" (readToken), so the page only ever tells someone their session ran out when it really did.
  const keyProblem = last.status === 401 || last.status === 403 || (last.status === 400 && /API key/i.test(last.msg));
  const status = keyProblem ? 502 : last.status;
  return json({ error: { message: (keyProblem ? "the AI key was refused (Gemini): " : status === 429 ? "rate limit (Gemini free tier): " : "") + last.msg } }, status);
}

async function listAll(env, prefix) {
  const kv = kvOf(env);
  const keys = []; let cursor;
  do { const r = await kv.list({ prefix, cursor }); r.keys.forEach((k) => keys.push(k.name)); cursor = r.list_complete ? null : r.cursor; } while (cursor);
  return keys;
}

/* ============================================================
   📂 The trainee's Backup Drive (js/cm-drive.js, /api/drive)

   A firm keeps a backup drive of every case document, in one folder structure everybody knows by heart: a
   Case Manager covering someone else's file still finds the executed retainer, the demand package and the
   lien correspondence where they always are. A trainee practises that here on their own Google Drive:
   they connect it once, lay the firm's structure out on Day 1 — graded, folder by folder — and every
   document they file in the CMS is kept in its folder on the drive as well.

   THE STRUCTURE IS THE CASE FILE THIS COURSE ALREADY TEACHES. `CM_CF_DOC_FOLDERS` in
   js/cm-case-flow-docs.js is the file the course works from, intake through litigation; FOLDER_STANDARD
   below is that same file as folders, numbered in the order the case runs, because on a backup drive the
   numbering is what teaches the lifecycle. DRIVE_HOMES maps each of those folder ids to its folder on the
   drive, so a document the course already knows the folder of needs no second decision: file it in the
   CMS and the copy lands in the right place.

   The standard lives here and nowhere else: the page draws from it, the Day 1 setup is graded against it,
   and the folder check reads from it. Paths are "/"-separated and in order; a trainee's layout is right
   when it is the same list, in the same order, spelled the same way.

   Google: only drive.file, so this can see and change the folders and files it made and nothing else in
   the trainee's Drive. Tokens are sealed with a key derived from SESSION_SECRET and kept in
   drive:<trainee id>. Needs GOOGLE_CLIENT_ID (a plain variable) and GOOGLE_CLIENT_SECRET (a secret) on
   this Worker, with the Google Drive API turned on in that Google Cloud project and this site among the
   OAuth client's authorized JavaScript origins; until both are set, /api/drive says so and the page says
   the Backup Drive isn't switched on yet. Nothing else is blocked either way.
   ============================================================ */
const DRIVE_ROOT = "LSH Case Backups";
const DRIVE_SCOPES = "openid email https://www.googleapis.com/auth/drive.file";
const FOLDER_MIME = "application/vnd.google-apps.folder";
const DRIVE_API = "https://www.googleapis.com/drive/v3";
const DRIVE_UPLOAD = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink";
const DRIVE_MAX_BYTES = 4 * 1024 * 1024;

/* The firm's structure, in the order it is read. The client folder is the case this course runs (John
   Doe), named last name first so a drive of clients sorts by surname. */
const CLIENT_FOLDER = "01 Clients/Doe-John";
const FOLDER_STANDARD = [
  "01 Clients",
  CLIENT_FOLDER,
  `${CLIENT_FOLDER}/01 Intake & Retainer`,
  `${CLIENT_FOLDER}/02 Police, Witness & Video`,
  `${CLIENT_FOLDER}/03 Medical Records`,
  `${CLIENT_FOLDER}/04 Bills & Invoices`,
  `${CLIENT_FOLDER}/05 Insurance, Demands & Negotiation`,
  `${CLIENT_FOLDER}/06 Liens & Reimbursement`,
  `${CLIENT_FOLDER}/07 Wages & Costs`,
  `${CLIENT_FOLDER}/08 Property Damage`,
  `${CLIENT_FOLDER}/09 Litigation & ADR`,
  "02 Firm Administration",
  "02 Firm Administration/01 Policies & SOPs",
  "02 Firm Administration/02 Compliance & CLE",
  "03 Templates",
  "04 Closed Files",
];
/* Why each folder is there, so a setup that misses one is told the rule and not just the answer. */
const FOLDER_WHY = {
  "01 Clients": "Client work comes first and is numbered first: a drive is read top to bottom under pressure.",
  [CLIENT_FOLDER]: "A client folder is named last name first, so the clients sort by surname.",
  [`${CLIENT_FOLDER}/01 Intake & Retainer`]: "The intake sheet, the signed retainer and the authorizations — what proves the firm represents him.",
  [`${CLIENT_FOLDER}/02 Police, Witness & Video`]: "The crash itself: the report, the witnesses and anything recorded.",
  [`${CLIENT_FOLDER}/03 Medical Records`]: "The records, kept apart from the bills, because liability reads the records and damages read the bills.",
  [`${CLIENT_FOLDER}/04 Bills & Invoices`]: "The billed amounts, which the demand adds up and an adjuster checks line by line.",
  [`${CLIENT_FOLDER}/05 Insurance, Demands & Negotiation`]: "Coverage, the demand package and every offer and counter, in order.",
  [`${CLIENT_FOLDER}/06 Liens & Reimbursement`]: "Health plan, provider and statutory liens: what has to come off the top before he is paid.",
  [`${CLIENT_FOLDER}/07 Wages & Costs`]: "Lost wages and the firm's costs — the other half of the net sheet.",
  [`${CLIENT_FOLDER}/08 Property Damage`]: "The vehicle claim, which settles on its own track and must never be mixed into the injury file.",
  [`${CLIENT_FOLDER}/09 Litigation & ADR`]: "Filings, discovery, orders and mediation, where counsel looks for them in a hurry.",
  "02 Firm Administration": "The firm's own paperwork never sits inside a client's folder.",
  "02 Firm Administration/01 Policies & SOPs": "The procedures the desk runs on.",
  "02 Firm Administration/02 Compliance & CLE": "Compliance records and anything an auditor asks for.",
  "03 Templates": "Blank templates, so nobody edits a client's copy by mistake.",
  "04 Closed Files": "Disbursed and closed matters, moved out of the live folders but never deleted.",
};
/* Each of the course's own document folders (CM_CF_DOC_FOLDERS), and its folder on the backup drive. A
   document the course files already declares which of these it belongs to, so the copy needs no guess. */
const DRIVE_HOMES = {
  intake: `${CLIENT_FOLDER}/01 Intake & Retainer`,
  police: `${CLIENT_FOLDER}/02 Police, Witness & Video`,
  medical: `${CLIENT_FOLDER}/03 Medical Records`,
  bills: `${CLIENT_FOLDER}/04 Bills & Invoices`,
  insurance: `${CLIENT_FOLDER}/05 Insurance, Demands & Negotiation`,
  liens: `${CLIENT_FOLDER}/06 Liens & Reimbursement`,
  settlement: `${CLIENT_FOLDER}/07 Wages & Costs`,
  property: `${CLIENT_FOLDER}/08 Property Damage`,
  litigation: `${CLIENT_FOLDER}/09 Litigation & ADR`,
};

const b64url = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
function unb64url(str) {
  str = String(str || "").replace(/-/g, "+").replace(/_/g, "/"); while (str.length % 4) str += "=";
  const bin = atob(str), out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
async function driveSealKey(env) {
  const s = env.SESSION_SECRET || adminPass(env);
  if (!s) throw new Error("SESSION_SECRET is not configured, so Google tokens can't be stored safely.");
  const raw = await crypto.subtle.digest("SHA-256", enc.encode("lsh-cm-drive-token|" + s));
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}
async function seal(env, text) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await driveSealKey(env), enc.encode(String(text)));
  return `${b64url(iv)}.${b64url(new Uint8Array(ct))}`;
}
async function unseal(env, sealed) {
  const [iv, ct] = String(sealed || "").split(".");
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64url(iv) }, await driveSealKey(env), unb64url(ct));
  return new TextDecoder().decode(pt);
}

const driveConfigured = (env) => !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
const driveKey = (id) => `drive:${id}`;
async function driveRead(env, id) { return JSON.parse((await env.LSH_KV.get(driveKey(id))) || "null"); }
async function driveWrite(env, id, rec) { await env.LSH_KV.put(driveKey(id), JSON.stringify(rec)); return rec; }

async function googleToken(params) {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params).toString(),
  });
  return { ok: r.ok, data: await r.json().catch(() => ({})) };
}
/* A live access token for this trainee, refreshed and saved when it is about to run out. */
async function driveAccess(env, id, rec, force = false) {
  if (!force && rec.access && Number(rec.exp) > Date.now() + 60000) return unseal(env, rec.access);
  const { ok, data } = await googleToken({
    client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET,
    refresh_token: await unseal(env, rec.refresh), grant_type: "refresh_token",
  });
  if (!ok) {
    if (data.error === "invalid_grant") { await env.LSH_KV.delete(driveKey(id)); const e = new Error("The Google Drive connection has expired or was taken back. Connect the Backup Drive again."); e.code = "DRIVE_RECONNECT"; throw e; }
    throw new Error(`Google refused to refresh access: ${data.error_description || data.error || "unknown error"}`);
  }
  rec.access = await seal(env, data.access_token);
  rec.exp = Date.now() + (Number(data.expires_in) || 3600) * 1000;
  await driveWrite(env, id, rec);
  return data.access_token;
}
/* One Drive call, tried again once with a fresh token if Google says this one is stale. */
async function drive(env, id, rec, method, url, body) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const token = await driveAccess(env, id, rec, attempt > 0);
    const headers = { Authorization: `Bearer ${token}` };
    let payload;
    if (body && body.raw !== undefined) { headers["Content-Type"] = body.type; payload = body.raw; }
    else if (body) { headers["Content-Type"] = "application/json"; payload = JSON.stringify(body); }
    const r = await fetch(url.startsWith("https://") ? url : DRIVE_API + url, { method, headers, body: payload });
    if (r.status === 401 && attempt === 0) continue;
    return { ok: r.ok, status: r.status, data: r.status === 204 ? {} : await r.json().catch(() => ({})) };
  }
}
const driveMessage = (res) => (res && res.data && res.data.error && res.data.error.message) || `Google Drive error ${res ? res.status : ""}`.trim();

async function folderLives(env, id, rec, fid) {
  if (!fid) return false;
  const res = await drive(env, id, rec, "GET", `/files/${encodeURIComponent(fid)}?fields=id,trashed`);
  return !!(res.ok && !res.data.trashed);
}
async function makeFolder(env, id, rec, name, parent) {
  const res = await drive(env, id, rec, "POST", "/files?fields=id", { name, mimeType: FOLDER_MIME, parents: parent ? [parent] : undefined });
  if (!res.ok || !res.data.id) throw new Error(driveMessage(res));
  return res.data.id;
}
/* The whole structure, made (or made again) in the trainee's Drive. Only what is missing is created, so
   running it twice costs nothing and a folder deleted in Drive comes back where it was. */
async function driveBuild(env, id, rec) {
  rec.folders = rec.folders || {};
  const made = [], restored = [];
  if (!(await folderLives(env, id, rec, rec.rootId))) {
    rec.rootId = await makeFolder(env, id, rec, DRIVE_ROOT);
    rec.folders = {};                                  // a new root means every folder under it is new
    made.push(DRIVE_ROOT);
  }
  for (const path of FOLDER_STANDARD) {
    const had = rec.folders[path];
    if (had && (await folderLives(env, id, rec, had))) continue;
    const cut = path.lastIndexOf("/");
    const parent = cut < 0 ? rec.rootId : rec.folders[path.slice(0, cut)];
    rec.folders[path] = await makeFolder(env, id, rec, path.slice(cut + 1), parent || rec.rootId);
    (had ? restored : made).push(path);
  }
  rec.builtAt = new Date().toISOString();
  await driveWrite(env, id, rec);
  return { made, restored };
}
/* Which of the structure's folders are no longer in the trainee's Drive. Keeping the drive is part of the
   job, so a folder someone deleted is reported rather than quietly made again. */
async function driveVerify(env, id, rec) {
  const missing = [];
  if (!(await folderLives(env, id, rec, rec.rootId))) {
    // The whole drive is gone (the root folder was deleted), so every folder is missing. Recorded like
    // any other check: without this the dashboard card would read "in order" for a drive that isn't there.
    rec.checkedAt = new Date().toISOString();
    rec.lastMissing = FOLDER_STANDARD.slice();
    await driveWrite(env, id, rec);
    return { missing: [DRIVE_ROOT].concat(FOLDER_STANDARD), rootGone: true };
  }
  for (const path of FOLDER_STANDARD) if (!(await folderLives(env, id, rec, rec.folders && rec.folders[path]))) missing.push(path);
  rec.checkedAt = new Date().toISOString();
  rec.lastMissing = missing;
  await driveWrite(env, id, rec);
  return { missing, rootGone: false };
}

/* Day 1 setup, graded: the layout the trainee typed against the firm's standard, in order. */
function gradeLayout(layout) {
  const want = FOLDER_STANDARD;
  const got = (Array.isArray(layout) ? layout : []).map((s) => String(s || "").replace(/^\/+|\/+$/g, "").replace(/\s+/g, " ").trim()).filter(Boolean);
  const problems = [], norm = (s) => s.toLowerCase();
  want.forEach((w) => {
    if (got.some((g) => g === w)) return;
    const near = got.find((g) => norm(g) === norm(w));
    if (near) problems.push(`"${near}" is spelled differently from the firm's "${w}" — a drive everybody shares is spelled one way. ${FOLDER_WHY[w] || ""}`.trim());
    else problems.push(`"${w}" is missing. ${FOLDER_WHY[w] || ""}`.trim());
  });
  got.forEach((g) => { if (!want.includes(g)) problems.push(`"${g}" isn't part of the firm's structure. A folder somebody invented is a folder nobody else looks in.`); });
  if (!problems.length) {
    const order = got.filter((g) => want.includes(g));
    for (let i = 0; i < order.length; i++) if (order[i] !== want[i]) { problems.push(`The folders are right but out of order: "${want[i]}" comes before "${order[i]}". The numbers follow the case from intake to close, which is how every drive in the firm reads.`); break; }
  }
  const score = Math.max(0, Math.round(((want.length - Math.min(problems.length, want.length)) / want.length) * 100));
  return { ok: !problems.length, problems, score, standard: want };
}

/* What the page is told about a trainee's Backup Drive. Never a token, sealed or not. */
function driveStatus(env, rec) {
  const configured = driveConfigured(env);
  return {
    configured,
    clientId: configured ? env.GOOGLE_CLIENT_ID : "",
    scopes: DRIVE_SCOPES,
    standard: FOLDER_STANDARD,
    why: FOLDER_WHY,
    homes: DRIVE_HOMES,
    root: DRIVE_ROOT,
    connected: !!(rec && rec.refresh),
    email: (rec && rec.email) || "",
    rootUrl: rec && rec.rootId ? `https://drive.google.com/drive/folders/${encodeURIComponent(rec.rootId)}` : "",
    built: !!(rec && rec.builtAt),
    builtAt: (rec && rec.builtAt) || null,
    checkedAt: (rec && rec.checkedAt) || null,
    lastMissing: (rec && rec.lastMissing) || [],
    setup: (rec && rec.setup) || null,
    saved: (rec && rec.saved) || [],
  };
}

/* ---------- 🕘 automatic Time In (js/checkin.js; read by the Training Portal /attendance.html) ----------
   A trainee's course calls /api/checkin on their first visit each day (Eastern time). The first call records
   checkin:<YYYY-MM-DD>:<id> = {timeIn, at, name, batch, training}, with the same in its KV metadata
   ({t, at, n, b, tr}) so the LSH Training Portal reads a whole day from one key list; kept 40 days. Each
   trainee has their own key, so a room signing in at once never overwrites one another. The attendance
   tab shows it until a trainer sets a Time In, and the Google Sheet gets it through the portal. */
function etNow(d) {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(d);
  const g = (t) => (p.find((x) => x.type === t) || {}).value;
  return { date: `${g("year")}-${g("month")}-${g("day")}`, time: `${g("hour")}:${g("minute")}` };
}
async function checkIn(kv, id, training) {
  const now = new Date(), et = etNow(now), key = `checkin:${et.date}:${id}`;
  const had = JSON.parse((await kv.get(key)) || "null");
  if (had) return { ok: true, date: et.date, timeIn: had.timeIn, already: true };
  const rec = JSON.parse((await kv.get(`trainee:${id}`)) || "null");
  if (!rec || rec.approved !== true || rec.archived) return { ok: false, error: "Not an approved trainee" };
  const v = { timeIn: et.time, at: now.toISOString(), name: String(rec.name || id).slice(0, 80), batch: String(rec.batch || "").slice(0, 24), training: String(training || "").slice(0, 160) };
  await kv.put(key, JSON.stringify(v), { expirationTtl: 40 * 86400, metadata: { t: v.timeIn, at: v.at, n: v.name, b: v.batch, tr: v.training } });
  return { ok: true, date: et.date, timeIn: v.timeIn };
}

/* ---------- documents in R2 ---------- */
// The document-heavy folders (decks/, documents/) are served from R2: the DOCUMENTS binding,
// bucket lshtraining, under courses/cm/ (uploaded by .github/workflows/r2-docs.yml on every push to main).
// wrangler.json's assets.run_worker_first sends these paths through the Worker. A file that isn't in R2
// (not uploaded yet, or no DOCUMENTS binding) still comes from the Worker's static assets, as before.
const R2_DOCS = "courses/cm";
const R2_DOC_DIRS = ["/decks/", "/documents/"];
async function docFromR2(env, request, path) {
  if (!env.DOCUMENTS || (request.method !== "GET" && request.method !== "HEAD") || !R2_DOC_DIRS.some((d) => path.startsWith(d))) return null;
  try {
    const obj = await env.DOCUMENTS.get(R2_DOCS + decodeURIComponent(path), { onlyIf: request.headers, range: request.headers });
    if (!obj) return null;
    const h = new Headers();
    obj.writeHttpMetadata(h);
    h.set("ETag", obj.httpEtag);
    h.set("Accept-Ranges", "bytes");
    // The browser may keep a copy but re-checks it (a cheap 304), so an updated document shows at once.
    h.set("Cache-Control", "no-cache");
    if (!("body" in obj)) return new Response(null, { status: 304, headers: h });
    let status = 200;
    if (obj.range && request.headers.has("Range")) {
      const r = obj.range;
      const start = r.suffix !== undefined ? Math.max(0, obj.size - r.suffix) : r.offset || 0;
      const len = r.suffix !== undefined ? obj.size - start : r.length !== undefined ? r.length : obj.size - start;
      h.set("Content-Range", `bytes ${start}-${start + len - 1}/${obj.size}`);
      h.set("Content-Length", String(len));
      status = 206;
    } else h.set("Content-Length", String(obj.size));
    return new Response(request.method === "HEAD" ? null : obj.body, { status, headers: h });
  } catch (e) {
    return null; // R2 unavailable or a bad path: fall back to the static assets
  }
}

export default {
  async fetch(request, env) {
    const kv = kvOf(env);
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      const secure = !!adminPass(env);
      if (path === "/blueprint.pdf") {
        // The Platform Blueprint PDF, rebuilt automatically by the portal after each update (trainee-safe content).
        const raw = kv ? await kv.get("blueprint:pdf") : null;
        if (!raw) return new Response("The Platform Blueprint hasn't been generated yet — an admin opening the portal builds it automatically within a minute.", { status: 404, headers: { "Content-Type": "text/plain" } });
        const { b64, build } = JSON.parse(raw);
        const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
        return new Response(bin, { headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="LSH_CM_Platform_Blueprint_${build}.pdf"`, "Cache-Control": "no-cache" } });
      }
      if (path === "/version" || path === "/api/version") {
        // Diagnostic: shows which portal build is actually deployed.
        const page = await env.ASSETS.fetch(new Request(new URL("/", request.url)));
        const html = await page.text();
        const m = html.match(/APP_BUILD = "([^"]+)"/);
        // Changes on every Cloudflare deploy; open pages use it to pick up a new version.
        const deployment = (env.CF_VERSION_METADATA && env.CF_VERSION_METADATA.id) || "unknown";
        return new Response(`Portal build deployed: ${m ? m[1] : "unknown (old index.html — no build tag)"}\nDeployment: ${deployment}\nWorker: secure-mode worker.js\nSecure mode: ${adminPass(env) ? "ON" : "OFF"}\nAdmin password: ${adminPassStatus(env)}\nAI provider: ${geminiKeyNames(env).length ? "Google Gemini" : (gatewayOn(env) ? "Google Gemini via the Portal's AI gateway" : "none — add GEMINI_API_KEY")}\n`, { headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" } });
      }
      if (!path.startsWith("/api/")) {
        const res = (await docFromR2(env, request, path)) || (await env.ASSETS.fetch(request));
        const type = res.headers.get("Content-Type") || "";
        if (!type.includes("text/html")) return res;
        // Never let browsers or the edge keep an old copy of the portal page.
        const h = new Headers(res.headers);
        h.set("Cache-Control", "no-cache, no-store, must-revalidate");
        return new Response(res.body, { status: res.status, headers: h });
      }
      if (request.method !== "POST") return json({ error: "POST only" }, 405);
      if (!kv && path.startsWith("/api/storage")) return json({ error: "LSH_KV namespace is not bound on this Worker." }, 500);

      /* ---------- auth ---------- */
      if (path === "/api/auth/status") return json({ secure, portalOnly: portalOnly(env), portalSecret: !!portalSecret(env) });
      if (path === "/api/auth/admin") {
        if (!secure) return json({ error: "not-configured" }, 501);
        const { passphrase } = await request.json().catch(() => ({}));
        await new Promise((r) => setTimeout(r, 400)); // slow down guessing
        const given = normPass(passphrase), want = normPass(adminPass(env));
        if (!given || !want || !safeEqual(given, want)) return json({ error: "Incorrect password" }, 401);
        return json({ token: await makeToken(env, "a", "admin", 12) });
      }
      // The trainee's session for a name + batch: their record id (new or legacy form) and token.
      const traineeSession = async (name, batch, id) => {
        const { newId, rawId, legacyId } = candidateIds(name, batch);
        let chosen = newId, existing = await kv.get(`trainee:${newId}`);
        // a record made before Batch IDs were read in one form: keyed by the batch exactly as it was typed
        if (!existing && rawId !== newId) {
          const raw = await kv.get(`trainee:${rawId}`);
          if (raw) { chosen = rawId; existing = raw; }
        }
        if (!existing) {
          const legacy = await kv.get(`trainee:${legacyId}`);
          const lrec = legacy ? JSON.parse(legacy) : null;
          if (lrec && (!lrec.batch || batchKey(lrec.batch) === batchKey(batch))) { chosen = legacyId; existing = legacy; }
        }
        if (id && id !== chosen && id !== newId && id !== rawId && id !== legacyId) return json({ error: "Name/batch don't match this session" }, 403);
        if (id && id !== chosen && (id === newId || id === rawId || id === legacyId)) { chosen = id; existing = await kv.get(`trainee:${id}`); }
        return json({ id: chosen, token: await makeToken(env, "t", chosen, 24 * 30), existing: existing ? JSON.parse(existing) : null, batch: canonicalBatch(batch) || String(batch || "").trim() });
      };
      if (path === "/api/auth/trainee") {
        if (!secure) return json({ error: "not-configured" }, 501);
        const { name, batch, id } = await request.json().catch(() => ({}));
        if (!name || !batch) return json({ error: "Name and batch are required" }, 400);
        const { newId, rawId, legacyId } = candidateIds(name, batch);
        let own = null;
        if (portalOnly(env)) {
          // Trainees come in through the LSH Training Portal (/api/auth/portal). A name + batch typed here is
          // accepted only to renew the session of a trainee who is already signed in on this device.
          own = await readTraineeTokenGrace(env, request);
          if (!own || (own.id !== newId && own.id !== rawId && own.id !== legacyId)) return json({ error: "portal-required" }, 403);
        }
        // A new registration has to give the Batch ID in its one form: B + the date the batch started (MMDDYY).
        // Someone whose records are already here keeps signing in with the Batch ID they registered under.
        if (!canonicalBatch(batch)) {
          const known = (await Promise.all([newId, rawId, legacyId].map(k => kv.get(`trainee:${k}`)))).some(Boolean);
          if (!known) return json({ error: "batch-format" }, 400);
        }
        // Under single sign-on the renewal is for the record the trainee is already signed in to, never a
        // same-named trainee's: the id in the body is ignored.
        return traineeSession(name, batch, portalOnly(env) ? own.id : id);
      }
      if (path === "/api/auth/portal") {
        // The Main Portal's sign-in: a signed ticket carries who the trainee is (their name and batch as registered there).
        if (!portalOnly(env)) return json({ error: "not-configured" }, 501);
        // Single sign-on is on, but this Worker has no PORTAL_SSO_SECRET, so no ticket can be checked and nobody
        // can be signed in. Say which setting is missing rather than letting it read as an expired link.
        if (!portalSecret(env)) return json({ error: "This program isn't connected to the LSH Training Portal yet. Please tell your administrator: PORTAL_SSO_SECRET needs to be set on this program's Worker, to the same value as the Portal's.", code: "portal-secret-missing" }, 503);
        const { ticket } = await request.json().catch(() => ({}));
        const why = {};
        const who = await readPortalTicket(env, ticket, why);
        if (!who) return json({ error: why.r === "signature"
          ? "The LSH Training Portal couldn't be verified (code: bad-signature). Please tell your administrator: the Portal and this program need the same sign-in secret."
          : "This sign-in link has expired. Open the program again from the LSH Training Portal.", code: why.r || "format" }, 401);
        if (who.system) return json({ admin: true, token: await makeToken(env, "a", "admin", 12) });
        if (who.admin) {
          // Single sign-on for trainers too: an administrator signed in on the Main Portal opens every program as a
          // trainer, with no second password here. Their ticket works once, so a copy of the link (browser history,
          // a forwarded URL) can't sign anyone in again inside its 5 minutes.
          if (!(await useTicketOnce(kv, ticket))) return json({ error: "This sign-in link was already used. Open the program again from the LSH Training Portal.", code: "used" }, 401);
          return json({ admin: true, name: who.name, token: await makeToken(env, "a", "admin", 12) });
        }
        const res = await traineeSession(who.name, who.batch, "");
        const out = await res.json();
        // The Portal's approval is the only trainee approval: a trainee it signs in is approved here too
        // (unless an admin here rejected them), so this program never shows "Registration Pending Approval".
        const cur = out.existing;
        if (!cur || (cur.approved !== true && !cur.rejected)) {
          const rec = Object.assign({}, cur || { id: out.id, name: who.name, firstName: who.first, lastName: who.last, batch: who.batch, registeredAt: new Date().toISOString() }, { approved: true });
          await kv.put(`trainee:${out.id}`, JSON.stringify(rec));
          out.existing = rec;
        }
        return json(Object.assign(out, { name: who.name, first: who.first, last: who.last, batch: who.batch }));
      }

      const tok = secure ? await readToken(env, request) : { role: "a", id: "open-mode" };
      if (!tok) return json({ error: "Sign-in required" }, 401);

      /* ---------- a session that is still in use is renewed before it runs out ----------
         The page asks for a fresh token in the last hours of a valid one (an admin's lasts 12 hours, a trainee's
         30 days), so a trainer's tab left open through a long day never drops a live call with "Sign-in
         required". An expired token is never renewed: that still takes a sign-in. */
      if (path === "/api/auth/refresh") {
        if (!secure) return json({ token: "" });
        return json({ token: await makeToken(env, tok.role, tok.id, tok.role === "a" ? 12 : 24 * 30) });
      }

      /* ---------- training tools open signed in (js/lsh-tool-links.js) ----------
         A fresh Portal-style ticket for the trainee signed in here, so the CMS (which takes the Portal's
         ticket, signed with the same PORTAL_SSO_SECRET) opens without its log-in page: a trainee as themselves, a
         trainer as a trainer. Good for 5 minutes. */
      if (path === "/api/auth/tool-ticket") {
        if (!portalSecret(env)) return json({ error: "not-available" }, 501);
        const sign = async (t) => { const payload = btoa(String.fromCharCode(...enc.encode(JSON.stringify(t)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
          return `${payload}.${await hmac("portal-sso:" + portalSecret(env), payload)}`; };
        // A trainer signed in here (the admin password, or the Portal's admin sign-in) opens the CMS as a trainer, the
        // same {r: "a"} ticket the Portal gives its administrators: the CMS takes it once (its useTicketOnce), so a
        // fresh one is made for every tool opened. Single sign-on on every platform, for trainers as for trainees.
        if (tok.role === "a") return json({ ticket: await sign({ r: "a", n: "", exp: Date.now() + 5 * 60 * 1000 }), admin: true });
        if (tok.role !== "t") return json({ error: "not-available" }, 403);
        const rec = JSON.parse((await kv.get(`trainee:${tok.id}`)) || "null");
        if (!rec || rec.approved !== true || rec.archived) return json({ error: "not-approved" }, 403);
        const words = String(rec.name || "").trim().split(/\s+/).filter(Boolean);
        const first = String(rec.firstName || words[0] || "").trim(), last = String(rec.lastName || words.slice(1).join(" ") || "").trim();
        if (!first || !last) return json({ error: "no-name" }, 400);
        return json({ ticket: await sign({ first, last, b: String(rec.batch || ""), exp: Date.now() + 5 * 60 * 1000 }) });
      }

      /* ---------- 🕘 automatic Time In: a trainee's first visit today (see checkIn) ---------- */
      /* ---------- 📂 the trainee's Backup Drive (js/cm-drive.js) ----------
         Their own Google Drive, the firm's folder structure laid out on Day 1 and graded, and a copy of
         every document they file in the CMS. A trainee only ever reaches their own drive; an admin reads
         a trainee's status to grade it, and can read nothing else of their Google account. */
      if (path === "/api/drive") {
        const b = await request.json().catch(() => ({}));
        const action = String(b.action || "status");
        const mine = tok.role === "t" ? tok.id : "";
        const who = mine || (tok.role === "a" && typeof b.traineeId === "string" ? b.traineeId.slice(0, 120) : "");
        // An open-mode Worker (no admin password) has no trainee tokens at all, so everyone reads as an
        // admin here and nobody has a drive. The page reads the code and simply shows nothing.
        if (!who) return json({ error: "Sign in as a trainee to use the Backup Drive.", code: "DRIVE_NOT_A_TRAINEE" }, 403);
        if (!mine && action !== "status") return json({ error: "A trainer can read a trainee's Backup Drive, not change it." }, 403);
        if (!driveConfigured(env)) return json({ drive: driveStatus(env, null) });
        let rec = await driveRead(env, who);
        try {
          if (action === "status") {
            return json({ drive: driveStatus(env, rec) });
          }
          if (action === "connect") {
            const code = String(b.code || "");
            if (!code) return json({ error: "Google sign-in didn't finish." }, 400);
            const { ok, data } = await googleToken({
              code, client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET,
              redirect_uri: "postmessage", grant_type: "authorization_code",
            });
            if (!ok) return json({ error: `Google sign-in failed: ${data.error_description || data.error || "unknown error"}` }, 400);
            let email = "";
            try { email = JSON.parse(new TextDecoder().decode(unb64url(String(data.id_token || "").split(".")[1] || ""))).email || ""; } catch (e) { /* no id token */ }
            // Google sends a refresh token only the first time an account says yes; keep the one we hold otherwise.
            const refresh = data.refresh_token ? await seal(env, data.refresh_token) : (rec && rec.refresh);
            if (!refresh) return json({ error: "Google didn't send long-term access. Remove this site under your Google account's third-party access and connect again." }, 400);
            rec = Object.assign({}, rec, {
              email, refresh, access: data.access_token ? await seal(env, data.access_token) : null,
              exp: Date.now() + (Number(data.expires_in) || 3600) * 1000,
              connectedAt: (rec && rec.connectedAt) || new Date().toISOString(),
            });
            await driveWrite(env, who, rec);
            return json({ drive: driveStatus(env, rec) });
          }
          if (action === "disconnect") {
            if (rec && rec.refresh) {
              // best effort: give the access back. The copies already in their Drive stay there.
              try { await fetch("https://oauth2.googleapis.com/revoke", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ token: await unseal(env, rec.refresh) }).toString() }); } catch (e) { /* best effort */ }
            }
            // The Day 1 setup and its grade are the trainee's record and are kept: only the Google link goes.
            const kept = rec ? { setup: rec.setup, saved: rec.saved } : {};
            rec = Object.keys(kept).length ? kept : null;
            if (rec) await driveWrite(env, who, rec); else await env.LSH_KV.delete(driveKey(who));
            return json({ drive: driveStatus(env, rec) });
          }
          if (!rec || !rec.refresh) return json({ error: "No Backup Drive is connected yet.", code: "DRIVE_NOT_CONNECTED" }, 400);

          if (action === "setup") {
            // Day 1: the structure the trainee laid out, graded against the firm's standard, then made in their Drive.
            const grade = gradeLayout(b.layout);
            const before = (rec.setup && rec.setup.attempts) || 0;
            rec.setup = { attempts: before + 1, at: new Date().toISOString(), score: grade.score, ok: grade.ok, problems: grade.problems };
            await driveWrite(env, who, rec);
            if (!grade.ok) return json({ graded: grade, drive: driveStatus(env, rec) });
            const built = await driveBuild(env, who, rec);
            return json({ graded: grade, built, drive: driveStatus(env, rec) });
          }
          if (action === "check") {
            const out = await driveVerify(env, who, rec);
            return json({ verified: out, drive: driveStatus(env, rec) });
          }
          if (action === "rebuild") {
            const built = await driveBuild(env, who, rec);
            return json({ built, drive: driveStatus(env, rec) });
          }
          if (action === "put") {
            // A document filed in the CMS, kept in its folder on the backup drive too. The course's own
            // folder id (CM_CF_DOC_FOLDERS) decides where, so the copy follows the file it belongs to.
            const folder = DRIVE_HOMES[String(b.docFolder || "")] || String(b.folder || "");
            if (!FOLDER_STANDARD.includes(folder)) return json({ error: `"${b.docFolder || b.folder}" has no folder in the firm's structure.` }, 400);
            if (!rec.folders || !rec.folders[folder]) return json({ error: "That folder isn't in your Drive yet. Run the Day 1 setup first." }, 400);
            const name = String(b.name || "").slice(0, 200);
            if (!name || /[^A-Za-z0-9._-]/.test(name)) return json({ error: "The file name may hold only letters, digits and - _ ." }, 400);
            let bytes;
            try { bytes = unb64url(b.b64); } catch (e) { return json({ error: "The document didn't arrive. Try again." }, 400); }
            if (!bytes.length || bytes.length > DRIVE_MAX_BYTES) return json({ error: "The document is empty or larger than 4 MB." }, 400);
            if (!(await folderLives(env, who, rec, rec.folders[folder]))) await driveBuild(env, who, rec);
            const boundary = "lsh" + crypto.randomUUID().replace(/-/g, "");
            const meta = JSON.stringify({ name, parents: [rec.folders[folder]], description: "Filed from the LSH Case Management training platform." });
            const head = enc.encode(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n--${boundary}\r\nContent-Type: ${String(b.mime || "application/pdf").slice(0, 100)}\r\n\r\n`);
            const tail = enc.encode(`\r\n--${boundary}--`);
            const raw = new Uint8Array(head.length + bytes.length + tail.length);
            raw.set(head, 0); raw.set(bytes, head.length); raw.set(tail, head.length + bytes.length);
            const res = await drive(env, who, rec, "POST", DRIVE_UPLOAD, { raw, type: `multipart/related; boundary=${boundary}` });
            if (!res.ok || !res.data.id) return json({ error: driveMessage(res) }, 502);
            rec.saved = (rec.saved || []).filter((s) => s.name !== name).concat([{ name, folder, at: new Date().toISOString(), id: res.data.id }]).slice(-200);
            await driveWrite(env, who, rec);
            return json({ saved: { name, folder, url: res.data.webViewLink || "" }, drive: driveStatus(env, rec) });
          }
          return json({ error: "Unknown Backup Drive action." }, 400);
        } catch (e) {
          return json({ error: (e && e.message) || "The Backup Drive request failed.", code: (e && e.code) || "DRIVE_ERROR" }, 502);
        }
      }

      if (path === "/api/checkin") {
        const b = await request.json().catch(() => ({}));
        const id = tok.role === "t" ? tok.id : (!secure && typeof b.id === "string" ? b.id.slice(0, 100) : "");
        if (!id) return json({ ok: false, error: "Trainees only" }, 403);
        return json(await checkIn(kvOf(env), id, b.training));
      }

      /* ---------- AI proxy (signed-in users only, so strangers can't spend your credits) ---------- */
      // (the path keeps its old name so pages already open in browsers keep working)
      if (path === "/api/claude" || path === "/api/ai") {
        if (!geminiKeyNames(env).length && !gatewayOn(env)) return json({ error: "No AI key is configured on this Worker. Add GEMINI_API_KEY as a Secret in Cloudflare." }, 500);
        return await callGemini(env, await request.text(), tok && tok.id);
      }

      /* ---------- the trainee's own score (no cohort: a trainee sees only their own Score Card) ---------- */
      if (path === "/api/ranking") {
        const me = tok.role === "t" ? JSON.parse((await kv.get(`trainee:${tok.id}`)) || "null") : null;
        const batch = me ? slugPart(me.batch) : "";
        const out = [];
        // A trainee only ever gets their own row, so only their record is read (not one read per trainee).
        for (const k of tok.role === "t" ? [`trainee:${tok.id}`] : await listAll(env, "trainee:")) {
          const r = JSON.parse((await kv.get(k)) || "null");
          if (!r || r.approved !== true || r.archived) continue;
          if (batch && slugPart(r.batch) !== batch) continue;
          if (tok.role === "t" && r.id !== tok.id) continue;   // never another trainee's name or scores
          const parts = String(r.name || "Trainee").trim().split(/\s+/);
          const short = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];
          const dp = {}; Object.entries(r.dayProgress || {}).forEach(([d, v]) => { if (v) dp[d] = { done: !!v.done, score: v.score, surpriseTaskScore: v.surpriseTaskScore }; });
          const pp = {}; Object.entries(r.practiceProgress || {}).forEach(([t, v]) => { if (v) pp[t] = { runs: v.runs || 0, bestScore: v.bestScore }; });
          out.push({ me: r.id === tok.id, id: r.id === tok.id ? tok.id : "", name: short, batch: r.batch || "", approved: true, dayProgress: dp, practiceProgress: pp });
        }
        return json({ batch: me ? me.batch : "", trainees: out });
      }

      /* ---------- storage ---------- */
      const body = await request.json().catch(() => ({}));
      const key = String(body.key || "");
      if (path === "/api/storage/get") {
        if (!key) return json({ error: "Missing key" }, 400);
        if (!canRead(tok, key)) return json({ error: "Not allowed" }, 403);
        return json({ value: forTrainee(tok, key, await kv.get(key)) });
      }
      if (path === "/api/storage/get-many") {
        // Several records in one request (the admin ledger, attendance, a trainee's tasks for every
        // day): every Worker request counts toward Cloudflare's request allowance for the whole
        // account, so lists aren't fetched one request per record. The same rule as /get for each
        // key (and the same "cm:" prefix); a key this user may not read is left out.
        const keys = Array.isArray(body.keys) ? body.keys.map((k) => String(k || "")) : [];
        if (!keys.length || keys.length > 100) return json({ error: "Send 1 to 100 keys" }, 400);
        const values = {};
        await Promise.all(keys.map(async (k) => { if (k && canRead(tok, k)) values[k] = forTrainee(tok, k, await kv.get(k)); }));
        return json({ values });
      }
      if (path === "/api/storage/set") {
        if (!key) return json({ error: "Missing key" }, 400);
        if (tok.role === "a") { await kv.put(key, body.value); return json({ ok: true }); }
        const err = await traineeWrite(env, tok, key, body.value);
        return err ? json({ error: err }, 403) : json({ ok: true });
      }
      if (path === "/api/storage/list") {
        if (tok.role !== "a") return json({ keys: [] });
        return json({ keys: await listAll(env, body.prefix || "") });
      }
      if (path === "/api/storage/delete") {
        if (tok.role !== "a") return json({ error: "Not allowed" }, 403);
        await kv.delete(key); return json({ ok: true });
      }
      return json({ error: "Unknown endpoint" }, 404);
    } catch (e) {
      console.error(e);   // the stack goes to the Worker's logs, not to the browser
      return json({ error: "Unhandled Worker exception." }, 500);   // the detail is in the Worker's logs
    }
  }
};
