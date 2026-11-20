/* ============================================================
   🤖 AI CHECK: Admin → ⚙ Settings, one click to see whether AI grading works on this site

   Every AI grading (the Skill Activities' AI Grader, the takeaways, the random tasks, the calls) goes to the AI this Worker is
   set up with: the Main Portal's AI gateway (AI_GATEWAY_SECRET) or this Worker's own Gemini keys. When that is refused, every
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
const S = {busy: false, res: null};

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
function card(){
  const r = S.res, where = r && r.via === "gemini" ? "this site's own Gemini keys" : `the Main Portal's AI gateway${r && r.host ? ` (${E(r.host)})` : ""}`;
  const line = S.busy ? `<p class="aic-p aic-dim">⏳ Sending one small grading…</p>`
    : !r ? `<p class="aic-p aic-dim">Not run yet. It sends one small grading, the way a trainee's Skill Activity is sent.</p>`
    : r.ok ? `<p class="aic-p aic-ok">✅ AI grading works: ${where} answered in ${((r.ms || 0) / 1000).toFixed(1)} s${r.model ? ` (${E(r.model)})` : ""}.</p>`
    : `<p class="aic-p aic-bad">❌ AI grading doesn't work right now: ${E(r.error || "no answer")}</p>${fix(r)}`;
  return `<div class="card aic-card" id="aiCheck"><h3 class="aic-h">🤖 AI check</h3>
    <p class="aic-p">Every AI grading (Skill Activities, takeaways, random tasks, calls) depends on it. When AI-graded scores stay blank on the 🏅 Scorecard, run it (or from ⚡ Run now on the Admin header).</p>
    <div class="aic-row"><button type="button" class="btn btn-navy btn-sm" onclick="cmAiCheck.run()" ${S.busy ? "disabled" : ""}>🤖 Run the AI check</button></div>${line}</div>`;
}
function paint(){ const el = document.getElementById("aiCheck"); if(el) el.outerHTML = card(); }
async function run(){
  if(S.busy || typeof authFetch !== "function") return S.res;
  S.busy = true; S.res = null; paint();
  try{
    const res = await authFetch("/api/ai-check", {});
    const b = await res.json().catch(() => ({}));
    S.res = res.ok ? b : {ok: false, status: res.status, error: b.error || `No answer (${res.status}).`};
  }catch(e){ S.res = {ok: false, error: "This site couldn't be reached: " + ((e && e.message) || e)}; }
  S.busy = false; paint();
  return S.res;
}

const __r = renderTraineesAndBatches;
renderTraineesAndBatches = function(){ return card() + __r.apply(this, arguments); };
if(!document.getElementById("aicStyle")){
  const st = document.createElement("style"); st.id = "aicStyle";
  st.textContent = `.aic-card{padding:16px 18px;margin:0 0 16px;}.aic-h{margin:0 0 6px;color:var(--navy,#1E2340);font-size:18px;font-weight:800;}
    .aic-p{margin:6px 0;font-size:16px;font-weight:600;line-height:1.4;}.aic-dim{opacity:.75;}.aic-ok{color:#1d7a46;}.aic-bad{color:#b42318;}.aic-row{margin:8px 0;}`;
  document.head.appendChild(st);
}
window.cmAiCheck = {run, state: S};
})();
