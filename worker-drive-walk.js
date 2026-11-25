/* ============================================================
   📂 The whole Backup Drive, read folder by folder at any depth (worker.js driveList; worker-drive-found.js and
   worker-drive-work.js read the listing it gives)

   The Backup Drive is the firm's backup file, so its graders read every folder and file under the linked folder,
   however deep: a trainee's own subfolder (05 Insurance, Demands & Negotiation/Day 3/…) is read like any other.
   Before this, the structure grade stopped after 80 folders without a word, and the written-work grader read only
   the top folder and the firm's own folders, never a folder inside them.

   THE WALK (walkDrive). Breadth first from the linked folder, several parents to one Drive query
   (`'a' in parents or 'b' in parents …`, as many as fit in WALK_QUERY_CHARS), every page of each query. The first
   query also asks for the firm's folders the record knows (rec.folders), so a drive kept the firm's way is read in
   one query; a folder is only walked into once it is known to be inside the linked folder, so a stale folder id
   can never lead the walk out of it. Bounded by:
     - a visited set: a folder is read once, however many parents it has (and a loop of folders ends);
     - WALK_MAX_FOLDERS folders: past it a folder is known but not read, and said (`over`);
     - the run's Drive request budget (the run's makeBudget, or WALK_QUERIES queries when the call has none).
   A walk the budget cuts short keeps what it read and the folders still to read under cm:drivewalk:<id> and the
   next walk carries on from there (for WALK_KEEP_MS), so a drive larger than one run is read over several runs. The
   walk that finishes such a reading keeps what it read there too, until the structure grade has been written from it
   (walkSettled): a run that runs out of budget between the two never throws a finished reading away.
   `walk` on the listing says how it went: {complete, read, unread, over, reason: "" | "budget" | "ceiling",
   resumed, folders, files}. A partial read is never presented as a complete one: the graders keep the last full
   grade, or say what wasn't read.

   WHERE A FILE IS (homeFinder). Each file is attributed to its nearest ancestor that is one of the firm's folders:
   a file in a subfolder the trainee made inside 03 Medical Records is in 03 Medical Records; a file directly in the
   linked folder is in its top folder (""); a file under no firm folder is outside the firm's structure (null).
   ============================================================ */
export const WALK_MAX_FOLDERS = 2000;     // folders read in one walk, at most
export const WALK_QUERY_CHARS = 1800;     // the parents of one query, at most this long (Drive's q, inside a URL)
export const WALK_MAX_PARENTS = 40;       // …and at most this many
export const WALK_QUERIES = 30;           // queries a walk with no budget of its own may make
export const WALK_KEEP_MS = 3 * 86400 * 1000;   // a walk cut short is carried on for this long, then started again
export const WALK_KEY = (id) => `drivewalk:${id}`;   // cm:drivewalk:<id>, through kvOf
const FOLDER = "application/vnd.google-apps.folder";
const FIELDS = "nextPageToken,files(id,name,mimeType,parents,createdTime,modifiedTime,size,md5Checksum,description,owners(emailAddress))";

/* Which folders of `folders` ({id: {parent}}) are inside the linked folder `root`: {id: true | false}. */
function insideOf(folders, root) {
  const memo = { [root]: true };
  Object.keys(folders).forEach((fid) => {
    const chain = []; let x = fid, out = false;
    for (let n = 0; n <= WALK_MAX_FOLDERS + 2; n++) {
      if (x in memo) { out = memo[x]; break; }
      if (!x || !folders[x]) break;
      memo[x] = false;   // (a loop of folders ends here: none of it is inside)
      chain.push(x); x = folders[x].parent;
    }
    chain.forEach((c) => { memo[c] = out; });
  });
  return memo;
}

/* The whole linked folder: {files: {id: {name, parent, created, mimeType, modifiedTime, size, md5, description, owners}},
   folders: {id: {name, parent, created, mimeType}}, walk}. `W`: {drive, driveMessage, kv}; `opts.budget`: the run's. */
export async function walkDrive(env, W, id, rec, opts = {}) {
  const root = rec.rootId, now = new Date().toISOString();
  let left = Number(env && env.DRIVE_WALK_QUERIES) || WALK_QUERIES;
  // (with the run's budget, one request is always left over: the structure grade that reads this listing needs it)
  const room = opts.budget ? () => opts.budget.take(2) : () => left-- > 0;
  let saved = null;
  const raw = W.kv ? await W.kv.get(WALK_KEY(id)) : null;   // (a KV error is thrown: the platform's limit stops a run)
  try { saved = JSON.parse(raw || "null"); } catch (e) { saved = null; }
  // a reading finished over several runs whose grade wasn't written yet (the run ran out first): that one, once
  if (saved && saved.complete && saved.rootId === root && saved.walk && Date.now() - Date.parse(saved.at || "") < WALK_KEEP_MS)
    return { files: saved.files || {}, folders: saved.folders || {}, walk: Object.assign({}, saved.walk, { readNow: 0, kept: true }) };
  const resume = !!(saved && saved.rootId === root && Array.isArray(saved.queue) && saved.queue.length && Date.now() - Date.parse(saved.startedAt || "") < WALK_KEEP_MS);
  const folders = resume ? saved.folders || {} : {}, files = resume ? saved.files || {} : {};
  const visited = new Set([root]);
  let queue;
  // (carried on: the folders read and still to read; one met on a page of a query cut short is found again, below)
  if (resume) { queue = saved.queue.filter((f) => typeof f === "string"); [].concat(saved.visited || [], queue).forEach((f) => visited.add(f)); }
  else { queue = [root].concat(Object.values(rec.folders || {})).filter((f, i, a) => typeof f === "string" && f && a.indexOf(f) === i); queue.forEach((f) => visited.add(f)); }
  let read = resume ? Number(saved.read) || 0 : 0, readNow = 0, reason = "";
  const held = new Set();   // folders seen but not yet known to be inside the linked folder: walked into once they are
  const enqueue = () => {
    const inside = insideOf(folders, root);
    Object.keys(folders).forEach((f) => {
      if (visited.has(f) || !inside[f]) return;
      if (visited.size > WALK_MAX_FOLDERS) { held.add(f); return; }   // past the ceiling: known, not read
      held.delete(f); visited.add(f); queue.push(f);
    });
  };
  if (resume) enqueue();
  while (queue.length) {
    const batch = []; let len = 0;
    while (queue.length && batch.length < WALK_MAX_PARENTS && (!batch.length || len + queue[0].length + 18 <= WALK_QUERY_CHARS)) { const p = queue.shift(); batch.push(p); len += p.length + 18; }
    const q = encodeURIComponent(`(${batch.map((p) => `'${String(p).replace(/[\\']/g, "\\$&")}' in parents`).join(" or ")}) and trashed = false`);
    let token = "", done = false;
    for (;;) {
      if (!room()) break;
      const res = await W.drive(env, id, rec, "GET", `/files?q=${q}&pageSize=1000&includeItemsFromAllDrives=true&fields=${FIELDS}${token ? "&pageToken=" + encodeURIComponent(token) : ""}`);
      if (!res.ok) throw new Error(W.driveMessage(res));
      (res.data.files || []).forEach((f) => {
        if (!f || !f.id || f.id === root) return;
        const ps = f.parents || [], parent = ps.find((p) => batch.includes(p)) || ps[0] || batch[0];
        // (a folder or file in several folders is kept where it was first met: the nearest the linked folder, so a
        // folder that is also inside its own subfolder can't hide itself and what is under it)
        if (f.mimeType === FOLDER) { if (!folders[f.id]) folders[f.id] = { name: f.name, parent, created: f.createdTime || "", mimeType: FOLDER }; }
        else if (!files[f.id] || !batch.includes(files[f.id].parent)) files[f.id] = { name: f.name, parent, created: f.createdTime || "", mimeType: f.mimeType || "", modifiedTime: f.modifiedTime || "", size: f.size, md5: f.md5Checksum || "", description: f.description || "", owners: f.owners || [] };
      });
      if (!res.data.nextPageToken) { done = true; break; }
      token = res.data.nextPageToken;
    }
    if (!done) { queue.unshift(...batch); reason = "budget"; break; }   // the batch is read again next time, whole
    read += batch.length; readNow += batch.length;
    enqueue();
  }
  // only what is inside the linked folder (a stale folder id of the record's, read in the first query, is dropped)
  const inside = insideOf(folders, root), outFolders = {}, outFiles = {};
  Object.entries(folders).forEach(([f, x]) => { if (inside[f]) outFolders[f] = x; });
  Object.entries(files).forEach(([f, x]) => { if (inside[x.parent]) outFiles[f] = x; });
  if (root) outFolders[root] = outFolders[root] || { name: opts.rootName || rec.rootName || "", parent: "", created: "" };
  const unread = queue.length, over = held.size;
  if (!reason && over) reason = "ceiling";
  const walk = { complete: !unread && !over, read, readNow, unread, over, reason, resumed: resume, folders: Object.keys(outFolders).length - 1, files: Object.keys(outFiles).length, at: now };
  if (W.kv) {
    if (unread) await W.kv.put(WALK_KEY(id), JSON.stringify({ rootId: root, startedAt: resume ? saved.startedAt : now, at: now, read, queue, visited: [...visited].filter((f) => !held.has(f)), folders, files }));
    else if (resume) await W.kv.put(WALK_KEY(id), JSON.stringify({ rootId: root, complete: true, at: now, walk, files: outFiles, folders: outFolders }));
    else if (raw) await W.kv.delete(WALK_KEY(id));
  }
  return { files: outFiles, folders: outFolders, walk };
}

/* The structure grade has been written from a reading finished over several runs: it needn't be kept any longer. */
export async function walkSettled(kv, id, walk) {
  if (kv && walk && walk.complete && walk.resumed) await kv.delete(WALK_KEY(id));
}

/* (parentId) → the path of the firm's folder nearest above it (rec.folders: {path: id}), "" for the linked folder
   itself, null for a folder under none of the firm's. `.sub(parentId)`: the trainee's own folders between that
   firm's folder and the file ("Day 3/Drafts"), "" when there are none. */
export function homeFinder(folders, rec) {
  const root = rec.rootId, firm = {}, memo = {};
  Object.entries((rec && rec.folders) || {}).forEach(([p, fid]) => { if (fid && folders[fid] && firm[fid] === undefined) firm[fid] = p; });
  const climb = (fid) => {
    const names = []; let x = fid;
    for (let n = 0; n <= WALK_MAX_FOLDERS + 2; n++) {
      if (x === root) return { home: names.length ? null : "", names };
      if (firm[x] !== undefined) return { home: firm[x], names };
      if (!x || !folders[x]) return { home: null, names };
      names.unshift(folders[x].name); x = folders[x].parent;
    }
    return { home: null, names };
  };
  const homeOf = (fid) => { if (!(fid in memo)) memo[fid] = climb(fid); return memo[fid].home; };
  homeOf.sub = (fid) => { homeOf(fid); const c = memo[fid]; return c.home == null ? "" : c.names.join("/"); };
  return homeOf;
}

/* What the trainer is told of a walk that didn't read everything; "" when it did. */
export function walkNote(walk) {
  if (!walk || walk.complete) return "";
  const n = (walk.unread || 0) + (walk.over || 0), s = n === 1 ? "" : "s";
  return walk.reason === "ceiling"
    ? `📂 ${n} folder${s} of this drive weren't read: it holds more than ${WALK_MAX_FOLDERS.toLocaleString("en-US")} folders, the most one reading covers. What is in them isn't graded.`
    : `📂 ${n} folder${s} not read this run (the drive is larger than one run reads), continued next run. Read so far: ${walk.folders} folders, ${walk.files} files. The grades stay as they were until the whole drive has been read.`;
}
