/* ============================================================
   🤖 Claude answers first (worker.js callGemini: /api/claude, /api/ai and the 🤖 AI check)

   When the Worker has the secret ANTHROPIC_API_KEY, every AI request the page sends (a grading, a trainer tool's review, a live
   call's line…) goes to Claude through the official Anthropic SDK, and the page gets back the shape it already reads:
   {content: [{type: "text", text}], model, stop_reason, provider: "anthropic"}.

   viaClaude(env, req, user, alone) → that Response, or null: Claude isn't set up, or didn't answer, and the next route takes over
   (the Portal's AI gateway, then this Worker's own GEMINI_API_KEY pool, unchanged). It never retries Claude itself: one request
   per grading (the SDK's own retries are off, maxRetries 0), so a busy or failing Claude costs one call and the grading carries on
   elsewhere. `alone`: nothing else is set up, so a failure is returned (429 or 502) instead of null.

   Model: ANTHROPIC_MODEL, or claude-opus-5-5. Opus 5.5 always thinks: no `thinking` setting is sent (disabled and budget_tokens
   are refused), nor temperature/top_p; depth is output_config.effort: "low" for a live call's line (feature chat or call: a
   phone simulation, latency matters) and "medium" for gradings and reviews. Thinking counts against max_tokens, so the page's
   small max_tokens isn't passed through: 4,000 for a call's line, 16,000 for the rest. No 40,000-character trimming (that is the
   gateway's limit; Claude reads 1M tokens). Server-side fallbacks ("default", beta server-side-fallback-2026-07-01) re-run a
   safety decline on Anthropic's recommended model; a decline that still comes back (stop_reason "refusal") is a failure here,
   and the next route answers.

   claudeOn(env), claudeMark() / claudeFailure(mark): whether Claude is set up, and why it last failed (for the 🤖 AI check,
   which says when Claude failed and something else answered). Nothing here ever returns or logs the key.
   ============================================================ */
// The SDK (package.json, @anthropic-ai/sdk) is loaded the first time Claude is asked. Wrangler bundles it all the same; until
// then worker.js loads without it, so a checkout without node_modules (another feature's checks, a branch merging main) still runs.
let sdk = null;
const loadSdk = () => sdk || (sdk = import("@anthropic-ai/sdk").then((m) => m.default, (e) => { sdk = null; throw e; }));

export const CLAUDE_DEFAULT_MODEL = "claude-opus-5-5";
const FALLBACK_BETA = "server-side-fallback-2026-07-01";
const keyOf = (env) => String((env && env.ANTHROPIC_API_KEY) || "").trim();
export const claudeOn = (env) => !!keyOf(env);
export const claudeModel = (env) => String((env && env.ANTHROPIC_MODEL) || "").trim() || CLAUDE_DEFAULT_MODEL;
const isLine = (req) => /^(chat|call)$/i.test(String((req && req.feature) || ""));

// counted, not timed, as worker-ai-key.js's refusals are
let count = 0, last = null;
const failed = (status, reason) => { count++; last = { n: count, status, reason: String(reason || "").slice(0, 300) }; return null; };
export const claudeMark = () => count;
export const claudeFailure = (mark) => (last && last.n > mark ? { status: last.status, reason: last.reason } : null);

// one client per key (a Worker instance keeps it between requests); fetch is the global one at call time (the node check stubs it)
let client = null, clientKey = "";
function clientFor(Anthropic, env) {
  const k = keyOf(env);
  if (!client || clientKey !== k) { client = new Anthropic({ apiKey: k, maxRetries: 0, fetch: (url, init) => fetch(url, init) }); clientKey = k; }
  return client;
}

const toText = (c) => typeof c === "string" ? c : (Array.isArray(c) ? c.map((p) => p && p.text ? p.text : "").join("\n") : "");
// the page's messages as Claude takes them: text only, alternating, starting with the trainee (user) and never ending on an
// assistant turn (Opus 5.5 refuses a prefill)
function messagesOf(req) {
  const out = [];
  for (const m of (req.messages || [])) {
    if (!m || typeof m !== "object") continue;
    const role = m.role === "assistant" ? "assistant" : "user", text = toText(m.content);
    if (!text.trim()) continue;
    const prev = out[out.length - 1];
    if (prev && prev.role === role) prev.content += "\n\n" + text; else out.push({ role, content: text });
  }
  while (out.length && out[0].role !== "user") out.shift();
  while (out.length && out[out.length - 1].role !== "user") out.pop();
  return out;
}

// the request each feature sends (exported for the node check)
export function claudeParams(env, req) {
  const line = isLine(req), system = toText(req.system);
  const p = {
    model: claudeModel(env),
    max_tokens: line ? 4000 : 16000,
    output_config: { effort: line ? "low" : "medium" },
    betas: [FALLBACK_BETA],
    fallbacks: "default",
    messages: messagesOf(req)
  };
  if (system.trim()) p.system = system;
  return p;
}
// how long one try may take: under the page's own wait (index.html callAITextOnce: 15 s for a call's line, at least 60 s for a
// grading), so that when Claude is slow the next route still answers before the page gives up
const timeoutFor = (req) => isLine(req) ? 9000 : Math.max(45000, Math.min((Number(req.max_tokens) || 600) * 40, 600000) - 15000);

export async function viaClaude(env, req, user, alone) {
  if (!claudeOn(env)) return null;
  const say = (status, reason) => { failed(status, reason); return alone ? json({ error: { message: `Claude didn't answer: ${reason}` } }, status === 429 ? 429 : 502) : null; };
  const params = claudeParams(env, req);
  if (!params.messages.length) return say(400, "the request had no message");
  let Anthropic, msg;
  try { Anthropic = await loadSdk(); }
  catch (e) { console.error("The Anthropic SDK could not be loaded (run npm ci):", e && e.message || e); return say(500, "the Anthropic SDK isn't installed on this Worker"); }
  try {
    msg = await clientFor(Anthropic, env).beta.messages.create(params, { timeout: timeoutFor(req) });
  } catch (e) {
    // most specific first (shared/error-codes.md); every one falls back, so a grading never stops
    if (e instanceof Anthropic.BadRequestError) {
      // a 400 is our own request's fault: a bug to fix, logged loudly
      console.error("Claude refused the request as malformed (400), a bug in worker-claude.js:", e.message);
      return say(400, "bad request (400): " + e.message);
    }
    if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) {
      console.error(`Claude refused ANTHROPIC_API_KEY (${e.status}):`, e.message);
      return say(e.status, `the key was refused (${e.status})`);
    }
    if (e instanceof Anthropic.NotFoundError) { console.error("Claude: model not found:", params.model, e.message); return say(404, `model ${params.model} not found (404)`); }
    if (e instanceof Anthropic.RateLimitError) { console.warn("Claude rate limit (429):", e.message); return say(429, "rate limit (429)"); }
    if (e instanceof Anthropic.APIConnectionError) { console.warn("Claude unreachable:", e.message); return say(502, e instanceof Anthropic.APIConnectionTimeoutError ? "timed out" : "unreachable: " + e.message); }
    if (e instanceof Anthropic.APIError) { console.warn(`Claude error ${e.status}:`, e.message); return say(e.status || 502, (e.status === 529 ? "overloaded (529)" : `error ${e.status}`) + ": " + e.message); }
    console.error("Claude call failed:", e && e.stack || e);
    return say(502, String(e && e.message || e));
  }
  if (msg.stop_reason === "refusal") {
    const cat = msg.stop_details && msg.stop_details.category;
    console.warn(`Claude declined (refusal${cat ? ", " + cat : ""}); the next route answers`);
    return say(422, `declined the request (refusal${cat ? ": " + cat : ""})`);
  }
  // the text blocks only: thinking, fallback and any other block are skipped
  const text = (msg.content || []).filter((b) => b && b.type === "text").map((b) => b.text || "").join("");
  if (!text.trim()) return say(502, `no text came back (${msg.stop_reason || "empty"})`);
  return json({ content: [{ type: "text", text }], model: msg.model || params.model, stop_reason: msg.stop_reason === "max_tokens" ? "max_tokens" : "end_turn", provider: "anthropic" });
}

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });   // as worker.js json
