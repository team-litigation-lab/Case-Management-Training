/* ============================================================
   🔎 A Backup Drive the platform didn't build: the structure and the filing found in the Drive itself
   (worker.js and worker-drive-work.js import this)

   The structure grade (worker.js driveGrade / gradeDay) and the written-work grader (worker-drive-work.js) knew only
   the folders the platform recorded on the drive record when it built them (rec.folders, rec.builtAt: Day 1's
   "Check and build it in my Drive") and only the documents it copied there itself (rec.saved, from "put"). A trainee
   who made the firm's folders by hand in Google Drive and uploaded the case documents into them by hand, or whose
   folder a trainer linked for them (🔗 Trainee Drives), had neither, so nothing was listed and nothing was graded:
   "Graded 0 files", every day "—", "No written work matched".

   This reads the linked folder's tree (the one listing the grade already takes, driveList) and finds in it:
     - THE FIRM'S FOLDERS (findFolders): each folder of FOLDER_STANDARD under its parent, by its name read tolerantly
       (looseFolder: case, spaces, hyphens, commas and "&" / "and" don't decide it; "Doe -John", "Doe, John" and
       "doe-john" are Doe-John; "01 intake & Retainer" is 01 Intake & Retainer; a folder with its number missing or
       different, and the client turned round (John Doe), are found too). The client folder is looked for under
       01 Clients first, then anywhere in the linked folder (a misplaced one is found, and said). What was found is
       recorded on the drive record as found (rec.folders, rec.foundAt, rec.found: the names as they are, how each
       was found, what is missing and why), and only when the platform never built the drive: a platform build's
       record is never overwritten.
     - THE COURSE DOCUMENTS FILED BY HAND (handFiled): any file in the linked folder that isn't the platform's own copy,
       identified by the course document's code in its name (RS01, RS-01, RS_01) or, failing that, its title
       ("New-Client-Intake-Sheet"), against CM_CF_DOCS in js/cm-case-flow-docs.js (read through ASSETS, as the
       written-work grader reads the course data; DRIVE_DOC in worker.js when that can't be read). Recorded as
       rec.handFiled [{docId, id, name, path, home, at, type}]: worker.js reads them beside the platform's copies, so a
       document filed by hand counts when it is in the right folder (S.copyOf, dayStarted), and its name is read by the
       firm's naming check like any other (a ".pdf.pdf", a Type that is a document title, a date) and charged on its
       day as the trainee's own filing. A Google Doc, Sheet or Slides is never a course document: that is written work.
     - DAY 1 FROM THE DRIVE (gradeFound → rec.foundSetup): a structure made by hand, graded against FOLDER_STANDARD:
       each folder present and nested where it belongs (a folder found under its name read loosely is there; its
       spelling is said, with the firm's exact name, and costs a little, never the folder), and Day 1's course
       documents filed in their folders. Read wherever Day 1 is read when the trainee never submitted the setup on the
       platform (setupOf): their typed and built setup, when there is one, stands.
   Whatever can't be graded says why (rec.found.why), so a trainer never reads a bare "—".
   📂 The listing is the whole linked folder at any depth (worker-drive-walk.js). A walk the run's budget cut short
   (rec.walk.reason "budget") finds nothing from it: what was found last stands until the whole drive is read.
   ============================================================ */
import { homeFinder, walkNote } from "./worker-drive-walk.js";

/* A folder's name with case, spaces, punctuation and "&" / "and" taken out: "Doe -John", "Doe, John" and "doe-john" read the same. */
export const looseFolder = (s) => String(s == null ? "" : s).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "");
/* …and without its number in front ("Intake & Retainer" for "01 Intake & Retainer", "1. Intake" for "01 Intake"). */
const unnumbered = (s) => looseFolder(String(s == null ? "" : s).replace(/^\s*\d+\s*[-._)]?\s*/, ""));
const leaf = (p) => String(p || "").split("/").pop();
const parentOf = (p) => { const cut = String(p).lastIndexOf("/"); return cut < 0 ? "" : p.slice(0, cut); };
const turned = (s) => String(s).split("-").reverse().join("-");   // Doe-John → John-Doe
const clip = (s, n = 200) => { s = String(s == null ? "" : s); return s.length > n ? s.slice(0, n - 1) + "…" : s; };
/* The CMS's long category names (js/cm-doc-filing.js LONG): a file name's Type is the long one, words joined by a hyphen. */
const CMS_LONG = { Medical: "Medical Records", Police: "Police Report", PD: "Property Damage", Litigation: "Litigation Documents", Intake: "Intake Documents" };
const GOOGLE_NATIVE = /^application\/vnd\.google-apps\./;

/* How well a folder's name is the firm's: 3 exact, 2 the same read loosely, 1 its number missing or different (or the
   client turned round), 0 not this folder. */
export function nameRank(got, want) {
  if (got === want) return 3;
  if (looseFolder(got) === looseFolder(want)) return 2;
  const u = unnumbered(want);
  if (u && unnumbered(got) === u) return 1;
  if (want.includes("-") && !/^\d/.test(want) && looseFolder(got) === looseFolder(turned(want))) return 1;
  return 0;
}

/* The firm's folders in a listing ({folders: {id: {name, parent}}}) under the linked folder `rootId`.
   Returns {folders: {path: id}, names: {path: name as it is}, rank: {path: 0-3}, misplaced: {path: where it is}, missing: [path]}. */
export function findFolders(listing, rootId, standard, clientPath) {
  const all = listing.folders || {}, kids = {};
  Object.entries(all).forEach(([id, f]) => { if (id !== rootId) (kids[f.parent] = kids[f.parent] || []).push(id); });
  const best = (ids, want, taken) => {
    let pick = null, r = 0;
    (ids || []).forEach((id) => { if (taken.has(id)) return; const k = nameRank(all[id].name, want); if (k > r || (k === r && k && all[id].name < all[pick].name)) { pick = id; r = k; } });
    return pick ? { id: pick, rank: r } : null;
  };
  const out = { folders: {}, names: {}, rank: {}, misplaced: {}, missing: [] }, taken = new Set([rootId]);
  const pathOfId = (id) => { const names = []; let x = id, n = 0; while (x && x !== rootId && all[x] && n++ < 20) { names.unshift(all[x].name); x = all[x].parent; } return names.join("/"); };
  for (const path of standard) {
    const up = parentOf(path), parent = up ? out.folders[up] : rootId;
    let hit = parent ? best(kids[parent], leaf(path), taken) : null;
    if (!hit && path === clientPath) {
      // the client folder wherever it is in the linked folder: straight in it, or deeper (a misplaced one is still found)
      hit = best(kids[rootId], leaf(path), taken);
      if (!hit) hit = best(Object.keys(all).filter((id) => id !== rootId), leaf(path), taken);
      if (hit) out.misplaced[path] = pathOfId(all[hit.id].parent) || "the top folder";
    }
    if (!hit) { out.missing.push(path); continue; }
    taken.add(hit.id);
    out.folders[path] = hit.id; out.names[path] = all[hit.id].name; out.rank[path] = hit.rank;
  }
  return out;
}

/* ---------- the course's documents (CM_CF_DOCS), read once per Worker instance ---------- */
/* {RS01: {folder, title, cms, day}} from js/cm-case-flow-docs.js (one line per document, as that file is written). */
export function parseCourseDocs(src) {
  const out = {}, re = /\{id:"(RS\d+)",\s*folder:"([a-z]+)",\s*file:"[^"]*",\s*title:"((?:[^"\\]|\\.)*)",\s*cms:"([^"]*)",\s*day:(\d)/g;
  let m;
  while ((m = re.exec(String(src || "")))) out[m[1]] = { folder: m[2], title: m[3].replace(/\\(.)/g, "$1"), cms: m[4], day: Number(m[5]) };
  return out;
}
let DOCS = null;
export async function courseDocs(env, D) {
  if (DOCS && Object.keys(DOCS).length) return DOCS;
  const fallback = () => {
    // only the graded documents worker.js knows (Days 2–5), when the course's own list can't be read
    const day = {}; Object.entries(D.DRIVE_DAY_DOCS || {}).forEach(([n, ids]) => ids.forEach((d) => { day[d] = Number(n); }));
    return Object.fromEntries(Object.entries(D.DRIVE_DOC || {}).map(([id, [folder, title, cms]]) => [id, { folder, title, cms, day: day[id] || 0 }]));
  };
  try {
    if (!env || !env.ASSETS || typeof env.ASSETS.fetch !== "function") return fallback();
    const r = await env.ASSETS.fetch(new Request("https://assets.local/js/cm-case-flow-docs.js"));
    if (!r.ok) return fallback();
    const got = parseCourseDocs(await r.text());
    if (!Object.keys(got).length) return fallback();
    DOCS = got;
    return DOCS;
  } catch (e) { return fallback(); }
}
export const _resetDocs = () => { DOCS = null; };

/* The course document a file name is: its code (RS01, RS-01, RS_01, rs 1), else its title; "" when it is none. */
export function docOfName(name, docs) {
  const s = String(name || "");
  const m = /(?:^|[^A-Za-z0-9])RS[ _-]?0*(\d{1,3})(?![0-9])/i.exec(s);
  if (m) { const id = "RS" + String(Number(m[1])).padStart(2, "0"); if (docs[id]) return id; }
  const loose = looseFolder(s.replace(/\.[A-Za-z0-9]{1,5}$/, ""));
  let pick = "", len = 0;
  Object.entries(docs).forEach(([id, d]) => { const t = looseFolder(d.title); if (t.length >= 12 && t.length > len && loose.includes(t)) { pick = id; len = t.length; } });
  return pick;
}

/* ---------- Day 1, graded from the folders found ---------- */
/* {score, ok, problems, at, from: "drive", found, of, filing:[…]}. A folder present and nested where it belongs is the
   folder (its spelling, when it isn't the firm's, is said and costs a little); a misplaced one is half; a missing one
   none. Day 1's course documents on the drive weigh a fifth, when there are any: each in its folder. */
export function gradeFound(F, ctx) {
  const { standard, why = {}, pass = 70, docs = {}, homes = {}, hand = [], names = {}, later = {} } = ctx;
  const problems = [], spelled = [], gone = standard.filter((p) => F.names[p] == null);
  let pts = 0;
  // a few folders missing are said one by one, with why each is there; many, in one line (so the rest is still read)
  if (gone.length > 3) problems.push(`${gone.length} of the firm's ${standard.length} folders aren't in the drive: ${gone.map(leaf).join(", ")}. Every folder of the standard is made on Day 1, before a document goes in it, numbered and nested as the firm's.`);
  standard.forEach((p) => {
    const got = F.names[p], want = leaf(p), up = parentOf(p);
    if (got == null) { if (gone.length <= 3) problems.push(`"${want}" is missing${up ? ` from ${leaf(up)}` : ""}. ${why[p] || ""}`.trim()); return; }
    if (F.misplaced[p]) { pts += 0.5; problems.push(`"${got}" is in ${F.misplaced[p]}; the firm keeps it in ${up ? leaf(up) : "the top folder"}. ${why[p] || ""}`.trim()); }
    else pts += F.rank[p] === 3 ? 1 : 0.85;
    if (F.rank[p] < 3) spelled.push(p);
  });
  spelled.forEach((p) => { const got = F.names[p], want = leaf(p);
    problems.push(F.rank[p] === 2 ? `"${got}" is the firm's "${want}": the spaces, the hyphen and the capitals count, because a drive everybody shares is spelled one way.`
      : `"${got}" is read as the firm's "${want}"${/^\d/.test(want) ? ": the number in front is part of the name, it is what keeps the case in order" : ": the client folder is last name first, so a drive of clients sorts by surname"}.`); });
  // Day 1's documents: those that open on Day 1, but not one a later day's backup drill files (DRIVE_DAY_DOCS: Day 1 now
  // teaches through treatment, so a few of Day 2's drive documents open on Day 1 and are still graded on Day 2)
  const filing = hand.filter((h) => docs[h.docId] && docs[h.docId].day === 1 && !later[h.docId]).map((h) => {
    const ok = h.path === h.home, n = names[h.id] || null;
    return { docId: h.docId, title: (docs[h.docId] || {}).title || h.docId, name: h.name, folder: h.path == null ? "outside the firm's folders" : F.names[h.path] || leaf(h.path) || "the top folder",
      home: leaf(h.home), ok, nameOk: !n || n.ok, nameWant: n && !n.ok ? n.want : "", hint: n && !n.ok ? n.hint : "" };
  });
  filing.forEach((f) => { if (!f.ok) problems.push(`${f.title} ("${clip(f.name, 80)}") is in ${f.folder}; it belongs in ${f.home}.`); });
  filing.forEach((f) => { if (!f.nameOk) problems.push(`🏷 "${clip(f.name, 80)}" ${f.nameWant ? `should be named "${clip(f.nameWant, 80)}"` : "isn't named the firm's way"}${f.hint ? `: ${f.hint}` : "."}`); });
  const struct = pts / standard.length, filed = filing.length ? filing.filter((f) => f.ok).length / filing.length : null;
  const score = Math.round(100 * (filed == null ? struct : 0.8 * struct + 0.2 * filed));
  return { score, ok: score >= pass, problems: problems.slice(0, 30).map((x) => clip(x, 600)), at: new Date().toISOString(), from: "drive",
    found: standard.length - F.missing.length, of: standard.length, filing: filing.slice(0, 40) };
}

/* ---------- the drive record, from the drive ---------- */
/* One listing of the linked folder (D.driveList), and from it: the firm's folders when the platform never built them,
   the course documents filed by hand, and Day 1 from the drive. Changes `rec` in place (the caller writes it) and
   returns the listing, so the snapshot the grade takes next reads the same one (driveSnapshot's `listed`). */
const LISTED = new WeakMap();
export const listedOf = (rec) => (rec && LISTED.get(rec)) || null;
export async function driveFind(env, D, id, rec, opts) {
  const listing = await D.driveList(env, id, rec, opts);
  LISTED.set(rec, listing);
  // 📂 how much of the drive was read; a reading cut short is carried on next run, and finds nothing until it ends
  rec.walk = listing.walk ? Object.assign({}, listing.walk) : undefined;
  if (listing.walk && listing.walk.reason === "budget") return listing;
  const docs = await courseDocs(env, D);
  applyFound(rec, listing, docs, D, await filedNames(env, D, id));
  return listing;
}
/* 📤 The names the trainee filed each course document under in the CMS (their "doc-filing" record, js/cm-doc-filing.js:
   {<docId>: {filed, name}}), read loosely (case, and the ".pdf" a download adds again: "….pdf.pdf"). A file named the
   firm's way (<Case ID>_<Last-First>_<Type>_<date>) carries no document code or title, so this is how one saved to the
   drive under the name it was filed under is known: name → the documents filed under it. */
export const looseFile = (s) => String(s == null ? "" : s).trim().toLowerCase().replace(/(\.[a-z0-9]{2,5})+$/, "");
export async function filedNames(env, D, id) {
  const out = {};
  try {
    const p = JSON.parse((await D.kvOf(env).get(`progress:${id}`)) || "null");
    Object.entries((p && p.data && p.data["doc-filing"]) || {}).forEach(([docId, r]) => {
      if (!r || !r.filed || !r.name) return;
      const k = looseFile(r.name); (out[k] = out[k] || []).push(docId);
    });
  } catch (e) {}
  return out;
}
export function applyFound(rec, listing, docs, D, byName = {}) {
  const standard = D.FOLDER_STANDARD, client = D.CLIENT_FOLDER, at = new Date().toISOString();
  const F = rec.builtAt ? null : findFolders(listing, rec.rootId, standard, client);
  if (F) {
    const got = Object.keys(F.folders).length;
    rec.folders = F.folders;
    const why = !got ? `None of the firm's folders was found in the linked folder "${rec.rootName || "LSH Case Backups"}": expected ${standard[0]}, with ${leaf(client)} in it.`
      : !F.folders[client] ? `The client folder wasn't found: expected ${leaf(client)} (under ${standard[0]}).` : "";
    rec.found = { at, folders: got, of: standard.length, missing: F.missing.slice(0, standard.length), why,
      names: Object.fromEntries(Object.entries(F.names).filter(([p, n]) => n !== leaf(p))), misplaced: F.misplaced };
    if (got) rec.foundAt = rec.foundAt || at; else delete rec.foundAt;
  }
  // the course documents filed by hand: anywhere in the linked folder, but never one of the platform's own copies
  const mine = new Set();
  (rec.saved || []).forEach((s) => { if (s && s.id) mine.add(s.id); ((s && s.was) || []).forEach((w) => mine.add(w)); });
  Object.values(rec.drills || {}).forEach((d) => { if (d && d.id) mine.add(d.id); });
  const homeOf = homeFinder(listing.folders || {}, rec);   // 📂 the firm's folder nearest above a file, at any depth
  const hand = [], claimed = new Set();
  // a file named as the trainee filed a document in the CMS is that document; two filed under one name are told apart by
  // the firm's folder each sits in (at any depth), then taken in turn (two files of that name: one each)
  const byFiled = (f) => {
    const ids = (byName[looseFile(f.name)] || []).filter((d) => docs[d] && !claimed.has(d));
    if (!ids.length) return "";
    const at = homeOf(f.parent);
    const pick = ids.find((d) => (D.DRIVE_HOMES[docs[d].folder] || "") === at) || ids[0];
    claimed.add(pick);
    return pick;
  };
  Object.entries(listing.files || {}).sort(([a], [b]) => a.localeCompare(b)).forEach(([fid, f]) => {
    if (mine.has(fid) || GOOGLE_NATIVE.test(String(f.mimeType || ""))) return;
    const docId = docOfName(f.name, docs) || byFiled(f);
    if (!docId) return;
    const d = docs[docId], home = D.DRIVE_HOMES[d.folder] || "";
    hand.push({ docId, id: fid, name: clip(f.name, 200), path: homeOf(f.parent), home, at: f.created || at, type: D.fileType(CMS_LONG[d.cms] || d.cms) });
  });
  rec.handFiled = hand.sort((a, b) => String(a.docId).localeCompare(String(b.docId)) || String(a.name).localeCompare(String(b.name))).slice(0, 200);
  // Day 1 from the drive, when the trainee never set the structure up on the platform
  if (F && rec.foundAt) {
    const names = {};
    rec.handFiled.forEach((h) => { const c = D.nameCheck(h.name, { type: h.type, date: String(h.at || "").slice(0, 10), caseId: D.driveCaseId(rec) }); names[h.id] = { ok: c.ok, want: c.want, hint: D.nameHint(c) }; });
    const later = {}; Object.values(D.DRIVE_DAY_DOCS || {}).flat().forEach((d) => { later[d] = true; });
    rec.foundSetup = gradeFound(F, { standard, why: D.FOLDER_WHY, pass: D.DRIVE_PASS, docs, homes: D.DRIVE_HOMES, hand: rec.handFiled, names, later });
  } else if (F) delete rec.foundSetup;
  return rec;
}
/* Day 1 as it is read: the setup the trainee typed and built on the platform, else the one found in the drive. */
export const setupOf = (rec) => (rec && (rec.setup || rec.foundSetup)) || null;
/* What the record holds of the drive found, laid onto a fresher read of it (the nightly and Grade now merge so). */
export function keepFound(fresh, rec) {
  if (!fresh || !rec) return fresh;
  if (!fresh.builtAt && !rec.builtAt) { fresh.folders = rec.folders; ["found", "foundAt", "foundSetup"].forEach((k) => { if (rec[k] === undefined) delete fresh[k]; else fresh[k] = rec[k]; }); }
  if (rec.handFiled !== undefined) fresh.handFiled = rec.handFiled;
  if (rec.walk !== undefined) fresh.walk = rec.walk;   // 📂 how much of the drive the last reading covered
  return fresh;
}
/* Why a day has no grade, said to a trainer (never a bare "—"). */
export function whyUngraded(n, rec, dayDocs) {
  if (!rec || !rec.rootId) return "No Backup Drive folder is linked.";
  if (rec.walk && rec.walk.reason === "budget") return walkNote(rec.walk);
  if (!rec.builtAt && !rec.foundAt) return (rec.found && rec.found.why) || "The drive hasn't been read yet: press 🏅 Grade now.";
  if (n === 1) return "The firm's folders haven't been graded yet: press 🏅 Grade now.";
  if (!rec.gradedAt) return "Not graded yet: press 🏅 Grade now.";
  const ids = (dayDocs || {})[n] || [];
  return `Day ${n} hasn't started on the drive: none of its documents (${ids.join(", ")}) is in the linked folder yet${n === 2 ? ", and its drill hasn't been laid" : ""}.`;
}
