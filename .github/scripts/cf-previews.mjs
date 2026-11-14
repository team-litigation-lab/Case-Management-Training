// Cloudflare Worker Previews for case-management-training: list them, and delete the ones no open pull request needs.
// Every branch's Preview keeps its own copies of the Worker's Durable Objects (wrangler.json previews.durable_objects),
// and the account allows 500 Durable Object namespaces: once old Previews fill that, every new Preview fails to deploy
// ("This account has reached its limit of 500 Durable Object namespaces", code 10067).
// Run by .github/workflows/cf-previews.yml (not a check: it has no @check line).
//   node .github/scripts/cf-previews.mjs            list them, and what would be deleted (deletes nothing)
//   node .github/scripts/cf-previews.mjs --delete   delete every Preview whose branch has no open pull request
// Needs CLOUDFLARE_API_TOKEN (Workers Scripts: Edit) and CLOUDFLARE_ACCOUNT_ID; GITHUB_TOKEN and GITHUB_REPOSITORY
// to read the open pull requests.
import { spawnSync } from 'node:child_process';
const ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID, TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const WORKER = process.env.WORKER_NAME || 'case-management-training';
const DELETE = process.argv.includes('--delete');
if (!ACCOUNT || !TOKEN) { console.log('::notice::CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID is not set: nothing to do.'); process.exit(0); }
const CF = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/workers/workers/${WORKER}/previews`;
const cf = async (url, init = {}) => {
  const r = await fetch(url, { ...init, headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', ...(init.headers || {}) } });
  const body = await r.json().catch(() => ({}));
  if (!r.ok || body.success === false) throw new Error(`${init.method || 'GET'} ${url.replace(ACCOUNT, '<account>')}: HTTP ${r.status} ${JSON.stringify(body.errors || body).slice(0, 400)}`);
  return body;
};
// a branch's Preview name, as Workers Builds makes it from the branch (claude/p-dashboard → claude-p-dashboard)
const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

async function openBranches() {
  const repo = process.env.GITHUB_REPOSITORY, gh = process.env.GITHUB_TOKEN; if (!repo || !gh) throw new Error('GITHUB_REPOSITORY / GITHUB_TOKEN not set: cannot tell which Previews are still needed');
  const out = new Set();
  for (let page = 1; ; page++) {
    const r = await fetch(`https://api.github.com/repos/${repo}/pulls?state=open&per_page=100&page=${page}`, { headers: { Authorization: `Bearer ${gh}`, Accept: 'application/vnd.github+json' } });
    if (!r.ok) throw new Error(`GitHub: HTTP ${r.status}`);
    const prs = await r.json(); prs.forEach(p => { out.add(p.head.ref); out.add(slug(p.head.ref)); });
    if (prs.length < 100) return out;
  }
}
async function allPreviews() {
  const out = [];
  for (let page = 1; page < 100; page++) {
    const b = await cf(`${CF}?page=${page}&per_page=100`);
    const xs = Array.isArray(b.result) ? b.result : (b.result && (b.result.previews || b.result.items)) || [];
    out.push(...xs);
    const info = b.result_info || {};
    if (!xs.length || (info.total_pages ? page >= info.total_pages : xs.length < 100)) break;
  }
  return out;
}

const keep = await openBranches();
keep.add('main');
const previews = await allPreviews();
const nameOf = p => p.name || p.preview_name || p.branch || p.slug || '';
if (previews.length) console.log('first Preview as the API returns it:', JSON.stringify(previews[0]).slice(0, 300));
const gone = previews.filter(p => { const n = nameOf(p); return n && !keep.has(n) && !keep.has(slug(n)); });
console.log(`${previews.length} Previews; ${previews.length - gone.length} kept (an open pull request's branch, or main); ${gone.length} ${DELETE ? 'to delete' : 'would be deleted (dry run)'}.`);
if (previews.some(p => !nameOf(p))) console.log(`::warning::${previews.filter(p => !nameOf(p)).length} Previews have no name in the API's answer: kept.`);
let done = 0, failed = 0;
for (const p of gone) {
  if (!DELETE) { console.log('  would delete', nameOf(p)); continue; }
  // wrangler's own documented command (it reads wrangler.json for the Worker), one Preview at a time
  const r = spawnSync('npx', ['-y', 'wrangler@4', 'preview', 'delete', '--name', nameOf(p), '--skip-confirmation'], { encoding: 'utf8' });
  if (r.status === 0) { done++; console.log('  deleted', nameOf(p)); }
  else { failed++; console.log(`::warning::could not delete ${nameOf(p)}: ${String(r.stderr || r.stdout).trim().split('\n').slice(-3).join(' ')}`); }
}
if (DELETE) console.log(`Deleted ${done} Previews${failed ? `, ${failed} failed` : ''}.`);
if (failed) process.exit(1);
