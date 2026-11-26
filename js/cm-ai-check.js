/* ============================================================
   🤖 AI CHECK: Admin → ⚙ Settings, one click to see whether AI grading works on this site

   Every AI grading (the Skill Activities' AI Grader, the takeaways, the random tasks, the calls) goes to the AI this Worker is
   set up with: Claude first when it has ANTHROPIC_API_KEY (worker-claude.js), then the Main Portal's AI gateway
   (AI_GATEWAY_SECRET), then this Worker's own Gemini keys. The check says which one answered, and when Claude failed. When that is refused, every
   AI-graded column of the 🏅 Scorecard stays blank, and the Portal's 📊 AI usage shows no CMS calls at
   all (the gateway counts nothing it refuses). 🤖 Run the AI check sends one small grading the way a trainee's is sent
   (/api/ai-check in worker.js, trainers only) and says plainly what came back: it works (how long it took, which model), or
   why it doesn't and what to set where.
   window.cmAiCheck: {run, state}.
   ============================================================ */
(function(){
"use strict";
if(typeof window === "undefined" || typeof document === "undefined" || typeof renderTraineesAndBatches !== "function") return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const S = {busy: false, res: null, day: null, loaded: false, readAt: 0, reading: false, readErr: ""};
const STALE = 150 * 60000;   // 2 hours and a half: past it, the automatic check has missed a run

// what to do about it, in the trainer's words
function fix(r){
  const m = String(r.error || "");
  if(/refused this site's key|not allowed/i.test(m)) return `<p class="aic-p"><b>To fix it:</b> in Cloudflare, give this site's Worker (<b>case-management-training</b> → Settings → Variables and Secrets) the secret <b>AI_GATEWAY_SECRET</b> with the same value as <b>AI_GATEWAY_SECRET</b> on the Portal (<b>cm-training-activity</b>), then run the check again.</p>`;
  if(/no AI_GATEWAY_SECRET/i.test(m)) return `<p class="aic-p"><b>To fix it:</b> set <b>AI_GATEWAY_SECRET</b> on the Portal (<b>cm-training-activity</b>) and the same value on this site's Worker.</p>`;
  if(/budget|rate limit|busy/i.test(m)) return `<p class="aic-p">The shared AI budget is busy or used up for now: the Portal's 📊 AI usage shows it, and it resets every day.</p>`;
  if(r.via === "none") return `<p class="aic-p"><b>To fix it:</b> give this site's Worker (<b>case-management-training</b>) the secret <b>AI_GATEWAY_SECRET</b>, with the Portal's value.</p>`;
  if(r.status === 403 || /only a trainer/i.test(m)) return `<p class="aic-p">Sign in to 🛡 Admin again, then run the check.</p>`;
  return `<p class="aic-p">Try again in a minute; if it says the same, the AI service itself is down.</p>`;
}
// 🤖 the route that answered: Claude (ANTHROPIC_API_KEY, worker-claude.js), the Portal's gateway or this site's Gemini keys
function works(r){
  const s = ((r.ms || 0) / 1000).toFixed(1);
  if(r.via === "anthropic") return `✅ AI grading works: Claude${r.model ? ` (${r.model})` : ""} answered in ${s} s.`;
  const where = r.via === "gemini" ? "this site's own Gemini keys" : `the Main Portal's AI gateway${r.host ? ` (${r.host})` : ""}`;
  return `✅ AI grading works: ${where} answered in ${s} s${r.model ? ` (${r.model})` : ""}.`;
}
// Claude is set up but didn't answer: what answered instead is said above, and why Claude didn't here
const claudeNote = r => r && r.claude && r.via !== "anthropic" ? `⚠ Claude${r.claude.model ? ` (${r.claude.model})` : ""} didn't answer: ${r.claude.reason || "no answer"}${r.ok ? ", so the next route graded instead" : ""}.` : "";
// one line for ⚡ Run now (js/cm-run-now.js), the same words as the card
function summary(r){
  const n = claudeNote(r);
  return (r && r.ok ? works(r) : `❌ AI grading doesn't work right now: ${(r && r.error) || "no answer"}`) + (n ? " " + n : "");
}
// when the result shown was taken, and by whom: the Worker runs the check by itself every 2 hours (worker.js scheduled)
const when = at => { try{ const d = new Date(at), today = d.toDateString() === new Date().toDateString();
  return d.toLocaleString(undefined, today ? {hour: "numeric", minute: "2-digit"} : {weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit"}) + (today ? " today" : ""); }catch(e){ return ""; } };
function stamp(r){
  if(!r || !r.at) return "";
  const runs = (S.day && S.day.day === String(r.at).slice(0, 10) ? S.day.runs : []) || [], bad = runs.filter(x => !x.ok).length;
  const old = Date.now() - Date.parse(r.at) > STALE ? `<p class="aic-p aic-bad">⚠ The automatic check hasn't run since then: run it now, and if it keeps not running, the Worker's cron needs checking.</p>` : "";
  return old + `<p class="aic-p aic-dim">Checked ${E(when(r.at))} · ${r.by === "trainer" ? "run by a trainer" : "automatically"} · it runs by itself every 2 hours${runs.length ? ` · today: ${runs.length} check${runs.length === 1 ? "" : "s"}${bad ? `, ${bad} failed` : ", all fine"}` : ""}.</p>`;
}
function card(){
  if(!S.busy && !S.reading && (!S.loaded || Date.now() - S.readAt > 10 * 60000)) setTimeout(latest, 0);   // read again every 10 minutes the page stays open
  const r = S.res, note = claudeNote(r);
  const line = S.busy ? `<p class="aic-p aic-dim">⏳ Sending one small grading…</p>`
    : !r ? `<p class="aic-p ${S.readErr ? "aic-bad" : "aic-dim"}">${S.readErr ? `Couldn't read the latest check (${E(S.readErr)}): run it now.` : S.loaded ? "No check has run yet: the first automatic one runs within 2 hours, or run it now." : "Reading the latest check…"}</p>`
    : (r.ok ? `<p class="aic-p aic-ok">${E(works(r))}</p>`
    : `<p class="aic-p aic-bad">❌ AI grading doesn't work right now: ${E(r.error || "no answer")}</p>${fix(r)}`) + (note ? `<p class="aic-p aic-bad">${E(note)}</p>` : "") + stamp(r);
  const key = r && r.key ? `<div class="aic-key"><p class="aic-p">🔑 The key this site sends${r.host ? ` to <b>${E(r.host)}</b>` : ""}: fingerprint <code>${E(r.key.fp)}</code> · ${E(r.key.len)} characters <span class="aic-dim">(a fingerprint, never the key)</span></p>
    <p class="aic-p aic-dim">Paste the value you meant to save to check it here. It stays in this browser: only its fingerprint is worked out, nothing is sent.</p>
    <div class="aic-row"><input type="password" id="aicTry" class="aic-in" autocomplete="off" placeholder="The AI_GATEWAY_SECRET value you saved" oninput="cmAiCheck.compare(this.value)"><span id="aicSay" class="aic-p" role="status"></span></div></div>` : "";
  return `<div class="card aic-card" id="aiCheck"><h3 class="aic-h">🤖 AI check</h3>
    <p class="aic-p">Every AI grading (Skill Activities, takeaways, random tasks, calls) depends on it. It checks itself every 2 hours and the latest result is below: run it yourself only when something isn't being graded.</p>
    <div class="aic-row"><button type="button" class="btn btn-navy btn-sm" onclick="cmAiCheck.run()" ${S.busy ? "disabled" : ""}>🤖 Run it now</button></div>${line}${key}</div>`;
}
function paint(){ const el = document.getElementById("aiCheck"); if(el) el.outerHTML = card(); }
async function run(){
  if(S.busy || typeof authFetch !== "function") return S.res;
  S.busy = true; S.res = null; paint();
  try{
    const res = await authFetch("/api/ai-check", {});
    const b = await res.json().catch(() => ({}));
    S.res = res.ok ? b : {ok: false, status: res.status, error: b.error || `No answer (${res.status}).`};
    if(res.ok && b.day) S.day = b.day;
    S.loaded = true;
  }catch(e){ S.res = {ok: false, error: "This site couldn't be reached: " + ((e && e.message) || e)}; }
  S.busy = false; paint();
  return S.res;
}

// the latest result the Worker kept (its own 2-hourly check, or a trainer's), read once per page: nothing is run
// (a newer result replaces the one shown; one read at a time; a failed read says so and is tried again on the next redraw)
async function latest(){
  if(S.reading || typeof authFetch !== "function") return S.res;
  S.reading = true;
  try{
    const res = await authFetch("/api/ai-check", {latest: true});
    if(!res.ok) throw new Error(`status ${res.status}`);
    const b = await res.json().catch(() => ({}));
    if(b.last && (!S.res || !S.res.at || String(b.last.at) > String(S.res.at))){ S.res = b.last; S.day = b.day || S.day; }
    else if(b.day && (!S.day || ((b.day.runs || []).length >= ((S.day.runs || []).length)))) S.day = b.day;
    S.loaded = true; S.readAt = Date.now(); S.readErr = "";
  }catch(e){ S.readErr = (e && e.message) || "no answer"; S.loaded = true; S.readAt = Date.now() - 9 * 60000; }   // (retried in a minute)
  S.reading = false;
  paint();
  return S.res;
}
const __r = renderTraineesAndBatches;
renderTraineesAndBatches = function(){ return card() + __r.apply(this, arguments); };
if(!document.getElementById("aicStyle")){
  const st = document.createElement("style"); st.id = "aicStyle";
  st.textContent = `.aic-card{padding:16px 18px;margin:0 0 16px;}.aic-h{margin:0 0 6px;color:var(--navy,#1E2340);font-size:18px;font-weight:800;}
    .aic-p{margin:6px 0;font-size:16px;font-weight:600;line-height:1.4;}.aic-dim{opacity:.75;}.aic-ok{color:#1d7a46;}.aic-bad{color:#b42318;}.aic-row{margin:8px 0;display:flex;gap:10px;align-items:center;flex-wrap:wrap;}.aic-key{border-top:1px solid #e5e7eb;margin-top:10px;padding-top:6px;}.aic-in{min-width:280px;padding:8px 10px;font-size:16px;font-weight:600;border:1px solid #cbd5e1;border-radius:8px;}.aic-key code{font-size:17px;font-weight:800;}`;
  document.head.appendChild(st);
}
// 🔑 the fingerprint of a value typed here, worked out as worker-ai-key.js does (trimmed, SHA-256, its first 8 hex), in this
// browser only: does this site's Worker hold the value the trainer meant to save?
async function print(v){
  const k = String(v == null ? "" : v).trim(); if(!k || !(window.crypto && crypto.subtle)) return null;
  const h = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(k)));
  return {len: k.length, fp: [...h.slice(0, 4)].map(b => b.toString(16).padStart(2, "0")).join("")};
}
async function compare(v){
  const say = document.getElementById("aicSay"), mine = S.res && S.res.key, p = await print(v);
  if(!say) return p;
  if(!p || !mine){ say.textContent = ""; say.className = "aic-p"; return p; }
  const same = p.fp === mine.fp && p.len === mine.len;
  say.className = "aic-p " + (same ? "aic-ok" : "aic-bad");
  say.textContent = same ? `✅ ${p.fp}: this site's Worker holds that value. If the Portal still refuses it, the Portal (cm-training-activity, Production, after a new deployment) holds a different one.`
    : `❌ ${p.fp} · ${p.len} characters: not the value this site's Worker holds (${mine.fp} · ${mine.len}). Save it on the Worker (case-management-training → Settings → Variables and Secrets).`;
  return p;
}
window.cmAiCheck = {run, latest, compare, print, summary, state: S};
})();
