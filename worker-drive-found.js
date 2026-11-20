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
     - THE COURSE DOCUMENTS FILED BY HAND (handFiled): any file in the linked folder that isn't the platform's own copy
       (nor an empty one, nor one under a kilobyte), identified first by its bytes (Drive's md5Checksum, the same as the course's own file of it:
       courseHashes, or as any version the course served before re-rendering it: worker-drive-versions.js, withVersions;
       the bytes decide over a code in the name, and copies of one file, in any folder, are one document);
       else by the course document's code in its name (RS01, RS-01, RS_01) or, failing that, its title
       ("New-Client-Intake-Sheet"), certain unless that document's own file was read and these bytes aren't it (then
       `by: "name"`, a reading like the one below), against CM_CF_DOCS in js/cm-case-flow-docs.js (read through ASSETS, as the
       written-work grader reads the course data; DRIVE_DOC in worker.js when that can't be read); and failing that, a
       name in the firm's convention by its Type and the firm folder it is in (applyFound, `by: "type"`: a reading, never
       certain, so it neither starts a day, nor has its name charged, nor counts in Day 1's filing, nor keeps a file
       from the written-work grader), the drive packets of the days reached first. Bytes that are no version of the
       course's files never hide a document from the listing (it is still read by its Type, and said), but a reading
       whose bytes were set against that document's own files and aren't one (`other`) earns nothing (credited): junk
       named the firm's way, a code over another file, a copy altered by a byte. The trainee is told to back up the course's own file. Copies are one document: the same bytes anywhere
       (the platform's own copies too), or, for a reading, the same size in one firm folder. All of it from the drive
       alone. Recorded as
       rec.handFiled [{docId, id, name, path, home, at, type, by, other}]: worker.js reads them beside the platform's copies, so a
       document filed by hand counts when it is in the right folder and credited (S.copyOf, a certain one before a
       reading), it starts a day only when known for certain and the course opens it on that day (dayStarted,
       startsDay), and its name is read by the
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
import { DOC_VERSIONS } from "./worker-drive-versions.js";   // every version the course has served of each document, by its bytes (generated)

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
/* {RS01: {folder, file, title, cms, day, packet}} from js/cm-case-flow-docs.js (one line per document, as that file is
   written; `file` is the document under documents/, the file the course serves and the platform copies to the drive;
   `packet`: the day whose drive packet (CF_PACKETS "d1m1-drive", "d2-drive" … "d5-drive") tells the trainee to back it up). */
export function parseCourseDocs(src) {
  const out = {}, re = /\{id:"(RS\d+)",\s*folder:"([a-z]+)",\s*file:"([^"]*)",\s*title:"((?:[^"\\]|\\.)*)",\s*cms:"([^"]*)",\s*day:(\d)/g;
  let m;
  while ((m = re.exec(String(src || "")))) out[m[1]] = { folder: m[2], file: m[3], title: m[4].replace(/\\(.)/g, "$1"), cms: m[5], day: Number(m[6]) };
  const pk = /"d(\d)(?:m\d+)?-drive"\s*:\s*\[([^\]]*)\]/g;
  while ((m = pk.exec(String(src || "")))) (m[2].match(/RS\d+/g) || []).forEach((id) => { const d = out[id]; if (d && !(d.packet <= Number(m[1]))) d.packet = Number(m[1]); });
  return out;
}
let DOCS = null;
export async function courseDocs(env, D) {
  if (DOCS && Object.keys(DOCS).length) return DOCS;
  const fallback = () => {
    // only the graded documents worker.js knows (Days 2–5), when the course's own list can't be read
    const day = {}; Object.entries(D.DRIVE_DAY_DOCS || {}).forEach(([n, ids]) => ids.forEach((d) => { day[d] = Number(n); }));
    return Object.fromEntries(Object.entries(D.DRIVE_DOC || {}).map(([id, [folder, title, cms]]) => [id, { folder, title, cms, day: day[id] || 0, packet: day[id] || 0 }]));
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
export const _resetDocs = () => { DOCS = null; HASHES = null; };

/* 🔎 What each course document's file IS: the MD5 of the file the course serves (documents/<file>), the checksum Google
   Drive keeps of every uploaded file (md5Checksum). A file on the drive with the same bytes is that document, whatever
   it is called: read from the drive alone, never from what the trainee filed in the CMS. {md5: [docId]}, worked out
   once per Worker instance (R2's own checksum when the document is there, else the file read through ASSETS and
   hashed). Whatever can't be read is left out: a file is then known by its name, as before, and the documents that
   couldn't be read are tried again (only those) after HASH_RETRY_MS: one failed read never leaves a document unknown
   by its bytes for the life of the Worker instance. */
let HASHES = null;
const HASH_RETRY_MS = 10 * 60 * 1000;   // documents whose files couldn't be read (assets unreachable) are tried again after this
const hexOf = (buf) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
export async function courseHashes(env, D, docs) {
  const fresh = HASHES && HASHES.docs === docs;
  if (fresh && (!HASHES.missing.length || Date.now() - HASHES.at < HASH_RETRY_MS)) return HASHES.by;
  const by = fresh ? Object.fromEntries(Object.entries(HASHES.by).map(([h, ids]) => [h, ids.slice()])) : {}, again = fresh ? new Set(HASHES.missing) : null, missing = [];
  const list = Object.entries(docs || {}).filter(([id, d]) => d && d.file && (!again || again.has(id)));
  let md5 = true;
  try { await crypto.subtle.digest("MD5", new Uint8Array(0)); } catch (e) { md5 = false; }
  const one = async ([docId, d]) => {
    let h = "";
    try {
      const r2 = env && env.DOCUMENTS && D && D.R2_DOCS ? await env.DOCUMENTS.head(`${D.R2_DOCS}/documents/${d.file}`) : null;
      if (r2 && r2.checksums && r2.checksums.md5) h = hexOf(r2.checksums.md5);
    } catch (e) { h = ""; }
    if (!h && md5 && env && env.ASSETS && typeof env.ASSETS.fetch === "function") {
      try {
        const r = await env.ASSETS.fetch(new Request("https://assets.local/documents/" + d.file.split("/").map(encodeURIComponent).join("/")));
        if (r.ok) h = hexOf(await crypto.subtle.digest("MD5", await r.arrayBuffer()));
      } catch (e) { h = ""; }
    }
    if (h) (by[h] = by[h] || []).push(docId); else missing.push(docId);
  };
  for (let i = 0; i < list.length; i += 8) await Promise.all(list.slice(i, i + 8).map(one));
  HASHES = { docs, by, missing, at: Date.now() };
  return by;
}
/* 🔎 …and every version the course has ever served of each document (worker-drive-versions.js, from the git history:
   build/case-flow/documents/versions.cjs). Documents are re-rendered (RS12 on 2026-11-18): a trainee who backed up the
   version the course served then has that document, by its bytes, as surely as one who backs up today's. Bytes that
   are no version of it are still not it. {md5: [docId]}, the course's files read now laid over the versions listed. */
let VERSIONS = null;   // (a test sets them: _versions)
export const _versions = (v) => { VERSIONS = v == null ? null : v; };
export function withVersions(hashes, versions = VERSIONS || DOC_VERSIONS) {
  const by = {};
  Object.entries(hashes || {}).forEach(([h, ids]) => { by[h] = ids.slice(); });
  Object.entries(versions || {}).forEach(([docId, hs]) => (hs || []).forEach((h) => { h = String(h).toLowerCase(); const ids = (by[h] = by[h] || []); if (!ids.includes(docId)) ids.push(docId); }));
  return by;
}

/* The course document a file name is: its code (RS01, RS-01, RS_01, rs 1), else its title; "" when it is none. */
const codeOf = (name) => { const m = /(?:^|[^A-Za-z0-9])RS[ _-]?0*(\d{1,3})(?![0-9])/i.exec(String(name || "")); return m ? "RS" + String(Number(m[1])).padStart(2, "0") : ""; };
export function docOfName(name, docs) {
  const s = String(name || ""), id = codeOf(s);
  if (id && docs[id]) return id;
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
  // 🔎 the course's own files are hashed whenever a file on the drive carries a checksum: its bytes decide which document
  // it is, before any code or title in its name
  const summed = Object.values(listing.files || {}).some((f) => f && f.md5 && !GOOGLE_NATIVE.test(String(f.mimeType || "")));
  // the days the trainee has reached (their course progress, never the CMS): which drive packets are already asked for
  let reached = [];
  try { reached = D.daysReached ? await D.daysReached(env, id) : []; } catch (e) { reached = []; }
  applyFound(rec, listing, docs, D, withVersions(summed ? await courseHashes(env, D, docs) : {}), { reached });
  return listing;
}
/* 📂 What a file's name says when it is named the firm's way: <Case ID>_<Last-First>_<Type>_<YYYY-MM-DD>[_label], one
   extension (or the ".pdf.pdf" a download adds again): {type, date, label}, or null for any other name. The Type is read
   loosely (case and the hyphens), so "medical-records" is "Medical-Records". A name the CMS gave is read by worker.js's
   own rules (D.nameAsFiled, D.labelShape): its counter on a second document of one Type and day (2026-11-16-2, or a _2
   after the date, before any label) is the CMS's and is read past. This is the drive's own evidence: the Backup Drive
   is graded from the linked folder alone, never from what the trainee filed in the CMS (a separate grader). */
export const looseType = (s) => String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]+/g, "");
export function conventionOf(name, D) {
  const s = String(name == null ? "" : name).trim();
  const lab = (D && D.labelShape) || ((x) => x === "DRAFT" || /^SUPERSEDED-\d{4}-\d{2}-\d{2}$/.test(x));
  const base = s.replace(/(\.[A-Za-z0-9]{2,5})+$/, ""), ext = s.slice(base.length).split(".").pop();
  const parts = base.split("_"), last = parts[parts.length - 1], label = parts.length > 4 && lab(last) ? last : "";
  const filed = D && D.nameAsFiled ? D.nameAsFiled(base + (ext ? "." + ext : ""), "") : null;   // (one extension: a ".pdf.pdf" is read as one)
  if (filed) return { type: looseType(filed.type), date: String(filed.date).slice(0, 10), label };
  if (parts.length < 4 || parts.length > 5 || !parts[0] || !parts[1] || !/^\d{4}-\d{2}-\d{2}$/.test(parts[3])) return null;
  return { type: looseType(parts[2]), date: parts[3], label };
}
export const typeOfName = (name, D) => (conventionOf(name, D) || {}).type || "";
const EMPTY_MD5 = "d41d8cd98f00b204e9800998ecf8427e";   // the checksum of a file with nothing in it
// (a file under a kilobyte holds no course document: the smallest the course serves is near 10 KB, so a few bytes
// named RS51.pdf, or the Complaint's title, are nothing uploaded, whatever their name says)
export const MIN_DOC_BYTES = 1024;
const emptyFile = (f) => String(f.size) === "0" || String(f.md5 || "").toLowerCase() === EMPTY_MD5
  || (f.size != null && f.size !== "" && Number(f.size) < MIN_DOC_BYTES);
/* A document known for certain (its bytes, or a code or title its bytes don't contradict): it starts a day, has its
   name charged and counts in Day 1's filing. "type" (the firm's name and folder only) and "name" (a code or title in
   the name over bytes that aren't that document's file) are readings of the drive: listed and placed, never more. */
export const knownFor = (h) => !!h && h.by !== "type" && h.by !== "name";
/* A document that earns its place on the drive (worker.js S.copyOf: placed, the labels, the final audit): one known for
   certain, or one read by its Type when its bytes couldn't be set against that document's own file (the course's
   files couldn't be read, or Drive gave no checksum). A reading over bytes that were compared and aren't the course's
   file nor any version of it the course served (`other`: junk named the firm's way, a code over another file, a copy
   altered by a byte) is listed and said, never credited: the trainee backs up the course's own file. (A copy kept from
   before the document was re-rendered is one of its versions: known by its bytes, worker-drive-versions.js.) */
export const credited = (h) => !!h && (knownFor(h) || (h.by === "type" && !h.other));
/* The day a course document opens on (CM_CF_DOCS `day`); 0 when it isn't known. A document the course opens before the
   day whose drive packet grades it (Day 1 teaches through treatment: RS12 opens on Day 1, graded on Day 2; RS16 opens
   on Day 2, graded on Day 3) never starts that later day: the trainee has it open a day early, and the day is graded
   once their progress reaches it (daysReached). */
export const opensOn = (docs, docId) => Number(((docs || {})[docId] || {}).day) || 0;
export const startsDay = (docs, docId, n) => { const o = opensOn(docs, docId); return !o || o >= n; };
export function applyFound(rec, listing, docs, D, hashes = {}, opts = {}) {
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
  const mine = new Set(), all = listing.files || {};
  (rec.saved || []).forEach((s) => { if (s && s.id) mine.add(s.id); ((s && s.was) || []).forEach((w) => mine.add(w)); });
  Object.values(rec.drills || {}).forEach((d) => { if (d && d.id) mine.add(d.id); });
  const homeOf = homeFinder(listing.folders || {}, rec);   // 📂 the firm's folder nearest above a file, at any depth
  const hand = [], claimed = new Set();
  // (an empty file, 0 bytes, is no document whatever it is called: nothing was uploaded)
  const files = Object.entries(all).sort(([a], [b]) => a.localeCompare(b))
    .filter(([fid, f]) => !mine.has(fid) && !GOOGLE_NATIVE.test(String(f.mimeType || "")) && !emptyFile(f));
  const md5Of = (f) => String(f.md5 || "").toLowerCase();
  // copies of one file are one document: the same bytes anywhere in the drive (Drive's md5Checksum), or, lacking a
  // checksum, the same size in one firm folder
  const sameBytes = {}, sameSize = {};
  // the documents whose own file was read (hashes): a code or title over other bytes is then a reading, not a certainty
  const read = new Set(); Object.values(hashes || {}).forEach((ids) => ids.forEach((d) => read.add(d)));
  const sizeKey = (f, where) => (f.size != null && f.size !== "" ? `${where}|${f.size}` : "");
  // a document the platform copied there itself, still on the drive, is accounted for: a file filed by hand isn't it,
  // and a hand-made copy of that copy (its bytes, or lacking a checksum its size in that folder) is that same document,
  // never the next one of its Type (a reading: never charged, never starts a day)
  (rec.saved || []).forEach((s) => {
    const f = s && s.id && s.docId && docs[s.docId] && all[s.id];
    if (!f) return;
    claimed.add(s.docId);
    const m = md5Of(f);
    if (m) { if (!sameBytes[m]) sameBytes[m] = { docId: s.docId, by: "type" }; }
    else { const k = sizeKey(f, homeOf(f.parent)); if (k && !sameSize[k]) sameSize[k] = s.docId; }
  });
  // `by`: how it is known. "code", "title" and "content" are certain; "type" (the firm's name and folder only) is a
  // reading of the drive, not a certainty: worker.js never starts a day on it, nor charges its name
  const add = (fid, f, docId, by) => {
    const d = docs[docId], home = D.DRIVE_HOMES[d.folder] || "", path = homeOf(f.parent);
    claimed.add(docId);
    const m = md5Of(f);
    if (m && !sameBytes[m]) sameBytes[m] = { docId, by };
    // (lacking a checksum, or known only by a reading, the same size in one firm folder is the same document: one file
    // altered by a byte and saved again under each code is one document, not each)
    if (!m || !knownFor({ by })) { const k = sizeKey(f, path); if (k && !sameSize[k]) sameSize[k] = docId; }
    // (`other`: these bytes were set against that document's own file and aren't it: a reading that is never credited)
    const other = by !== "content" && !!m && read.has(docId) && !(hashes[m] || []).includes(docId);
    hand.push(Object.assign({ docId, id: fid, name: clip(f.name, 200), path, home, at: f.created || at, type: D.fileType(CMS_LONG[d.cms] || d.cms), by }, other ? { other: true } : {}));
  };
  // 1. the same bytes as one of the course's own files (Drive's md5Checksum against the file the course serves): that
  //    document, whatever the name says (a code in the name never makes the Complaint's bytes the Answer), wherever it is.
  //    Seven copies of one file are that one document, seven times.
  const rest = [];
  files.forEach(([fid, f]) => {
    const ids = (md5Of(f) && hashes[md5Of(f)]) || [], named = docOfName(f.name, docs);
    const docId = ids.includes(named) ? named : ids.find((d) => docs[d] && !claimed.has(d)) || ids.find((d) => docs[d]);
    if (docId) add(fid, f, docId, docId === named ? (codeOf(f.name) === named ? "code" : "title") : "content"); else rest.push([fid, f]);
  });
  // 2. a document code (RS12) or its title in the name, when its bytes aren't the course's own: that document, wherever
  //    it is (a wrong folder is then said). A copy of a file already known (the same bytes) is that same document.
  //    Certain when that document's own file couldn't be read (or the file has no checksum); when it was read and these
  //    bytes aren't it (nor any version of it the course served), the name is a reading (`by: "name"`): a course file
  //    the trainee altered is still placed, but junk renamed RS51 never starts a day nor counts as certain filing.
  const rest2 = [];
  rest.forEach(([fid, f]) => {
    const m = md5Of(f), was = m && sameBytes[m];
    if (was && docOfName(f.name, docs)) return add(fid, f, was.docId, was.by);
    const docId = docOfName(f.name, docs);
    if (!docId) return rest2.push([fid, f]);
    if (m && read.has(docId)) { const k = sizeKey(f, homeOf(f.parent)); return add(fid, f, (k && sameSize[k]) || docId, "name"); }
    add(fid, f, docId, codeOf(f.name) === docId ? "code" : "title");
  });
  // 3. a name in the firm's convention (<Case ID>_<Last-First>_<Type>_<date>) carries no code or title: in the firm's folder
  //    a document of that Type belongs in, at any depth, it is one of that folder's documents of that Type not yet
  //    accounted for. First the documents the course tells the trainee to back up (its drive packets: Day 1's
  //    d1m1-drive and each later day's dN-drive) of the days the trainee has reached or started, earliest packet day
  //    first; then every other document by the day the course opens it, a packet of a day not yet reached counting
  //    from that day (so a Day 1 paper is never taken for a later day's). The one its label says when it has one
  //    (_SUPERSEDED-<date>: a version a newer one replaced; _DRAFT: a draft), one that carries no label when it has
  //    none. One document a file, and the files in the order they were made. In any other folder it isn't guessed at.
  //    Bytes that are no version of the course's files never hide a file from this reading (it is still listed as that
  //    document, and said), but bytes set against that document's own files that aren't one are `other` (add): listed,
  //    never credited. (A version from before a re-render was known by its bytes in 1.)
  const dayOf = {}; Object.entries(D.DRIVE_DAY_DOCS || {}).forEach(([n, ids]) => ids.forEach((d) => { dayOf[d] = Number(n); }));
  const opens = (d) => Number(docs[d].day) || dayOf[d] || 0;
  const packetOf = (d) => Number(docs[d].packet) || dayOf[d] || 0;
  const pIndex = (d) => { const ids = (D.DRIVE_DAY_DOCS || {})[packetOf(d)] || []; return ids.includes(d) ? ids.indexOf(d) : 99; };
  const started = (n) => (D.dayStarted ? D.dayStarted(n, Object.assign({}, rec, { handFiled: hand }), docs)
    : hand.concat(rec.saved || []).some((s) => ((D.DRIVE_DAY_DOCS || {})[n] || []).includes(s.docId) && knownFor(s) && startsDay(docs, s.docId, n)));
  const reach = Math.max(1, ...((opts && opts.reached) || []).map(Number).filter((n) => n > 0), ...[2, 3, 4, 5].filter((n) => (D.DRIVE_DAY_DOCS || {})[n] && started(n)));
  const rank = (d) => { const p = packetOf(d); return p && p <= reach ? [0, p, pIndex(d)] : [1, p ? Math.max(p, opens(d)) : opens(d), p ? 1 : 0]; };
  const order = Object.keys(docs).map((d) => [d, rank(d)])
    .sort(([a, x], [b, y]) => (x[0] - y[0]) || (x[1] - y[1]) || (x[2] - y[2]) || a.localeCompare(b)).map(([d]) => d);
  const typeOf = (d) => looseType(D.fileType(CMS_LONG[docs[d].cms] || docs[d].cms));
  const LABEL = D.LABEL_DOCS || {}, SUP = D.SUPERSEDED_BY || {};
  const labelOf = (d) => (LABEL[d] === "DRAFT" ? "DRAFT" : LABEL[d] === "SUPERSEDED" || SUP[d] ? "SUPERSEDED" : "");
  rest2.map(([fid, f]) => ({ fid, f, c: conventionOf(f.name, D), where: homeOf(f.parent) })).filter((x) => x.c && x.c.type && x.where)
    .sort((a, b) => String(a.f.created || "").localeCompare(String(b.f.created || "")) || a.c.date.localeCompare(b.c.date) || a.fid.localeCompare(b.fid))
    .forEach(({ fid, f, c, where }) => {
      const m = md5Of(f), k = sizeKey(f, where);
      if (m && sameBytes[m]) return add(fid, f, sameBytes[m].docId, "type");   // a copy of a file already accounted for, in any folder
      if (k && sameSize[k]) return add(fid, f, sameSize[k], "type");           // (the same size in this folder, as add() keeps it)
      const want = /^SUPERSEDED/.test(c.label) ? "SUPERSEDED" : c.label === "DRAFT" ? "DRAFT" : "";
      const cands = order.filter((d) => !claimed.has(d) && typeOf(d) === c.type && (D.DRIVE_HOMES[docs[d].folder] || "") === where);
      const docId = cands.find((d) => labelOf(d) === want) || cands[0];
      if (docId) add(fid, f, docId, "type");
    });
  rec.handFiled = hand.sort((a, b) => String(a.docId).localeCompare(String(b.docId)) || String(a.name).localeCompare(String(b.name))).slice(0, 200);
  // Day 1 from the drive, when the trainee never set the structure up on the platform
  if (F && rec.foundAt) {
    // (a document known by its Type and folder alone is a reading, not a certainty: it neither adds to Day 1's filing
    // nor has its name charged there, as on every later day)
    // (a CMS counter in its name, 2026-11-16-2 or _2 after the date, is read past: `counter`)
    const sure = rec.handFiled.filter(knownFor), names = {};
    sure.forEach((h) => { const c = D.nameCheck(h.name, { type: h.type, date: String(h.at || "").slice(0, 10), caseId: D.driveCaseId(rec), counter: true }); names[h.id] = { ok: c.ok, want: c.want, hint: D.nameHint(c) }; });
    const later = {}; Object.values(D.DRIVE_DAY_DOCS || {}).flat().forEach((d) => { later[d] = true; });
    rec.foundSetup = gradeFound(F, { standard, why: D.FOLDER_WHY, pass: D.DRIVE_PASS, docs, homes: D.DRIVE_HOMES, hand: sure, names, later });
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
  // (a document known only by its Type and the folder it is in is listed, but it is a reading, not a certainty: it never starts a day)
  // (a document known for certain that the course opens on an earlier day is on the drive, but it doesn't start this one)
  const early = (rec.saved || []).filter((s) => s && s.id).concat((rec.handFiled || []).filter(knownFor)).filter((h) => ids.includes(h.docId)).map((h) => h.docId).filter((d, i, a) => a.indexOf(d) === i);
  if (early.length) return `Day ${n} is graded once the trainee reaches it in the course: its documents on the drive (${early.join(", ")}) open on an earlier day, so backing them up early doesn't start it.`;
  const guessed = (rec.handFiled || []).filter((h) => h && !knownFor(h) && ids.includes(h.docId)).map((h) => h.docId).filter((d, i, a) => a.indexOf(d) === i);
  if (guessed.length) return `Day ${n} hasn't started on the drive: the only files of its documents (${ids.join(", ")}) there are known by their Type and folder alone, or by a name over bytes that aren't the course's file (read as ${guessed.join(", ")}), and those don't start a day. Back up the course's own file of one${n === 2 ? ", or lay the day's drill" : ""}.`;
  return `Day ${n} hasn't started on the drive: none of its documents (${ids.join(", ")}) is in the linked folder yet${n === 2 ? ", and its drill hasn't been laid" : ""}.`;
}
