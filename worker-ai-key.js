/* ============================================================
   🔑 The AI gateway key, as the 🤖 AI check shows it (worker.js /api/ai-check, js/cm-ai-check.js)

   keyPrint(value) → {len, fp}: the key's length and the first 8 hex of the SHA-256 of the key this Worker sends (trimmed,
   as the Portal compares it), never the key itself. When the Portal answers 401 "Not allowed." the two values differ, and
   neither Cloudflare page shows a secret once it is saved: the trainer computes the same fingerprint, in their own browser,
   for the value they meant to save (js/cm-ai-check.js, nothing is sent), and so learns whether this Worker holds it.

   The refusal is remembered (refused / lastRefusal) so that, where this Worker also has GEMINI_API_KEY secrets of its own,
   grading carries on with them (worker.js callGemini) while the AI check still says the gateway refused the key.
   ============================================================ */
export async function keyPrint(value) {
  const k = String(value == null ? "" : value).trim();
  if (!k) return null;
  const h = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(k)));
  return { len: k.length, fp: [...h.slice(0, 4)].map((b) => b.toString(16).padStart(2, "0")).join("") };
}
// counted, not timed: two calls in one millisecond (a fast fake, or a busy Worker) must not see each other's refusal
let count = 0, last = null;
export const refused = (status) => { count++; last = { n: count, status }; };
export const refusalMark = () => count;
export const lastRefusal = (mark) => (last && last.n > mark ? last : null);
