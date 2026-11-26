/* ============================================================
   🎓 The name a certificate record (cert:LSH-CM-…) is issued in: the one the certificate itself shows
   The page prints the registered full name (fullName, from the Portal's sign-in: js/cm-full-name.js certName), else the first
   and last name, in the order the trainers chose (settings:certificate.nameFormat: "lastFirst", the default, or
   "firstLast"), else the name the trainee confirmed (certName), else the record's name. A trainer's issue stores what the
   page built (index.html downloadCertificatePdf); a trainee's own issue is stored by the Worker from the record, never the
   request (worker.js traineeWrite), so it is worked out here the same way, and both records say what the PDF says.
   ============================================================ */
const clean = (s) => String(s == null ? "" : s).replace(/\s+/g, " ").trim();
const edge = (c) => c === undefined || /[\s,]/.test(c);
// (the same as js/cm-full-name.js certName: "John A. Doe Jr." → "Doe, John A. Jr."; a full name the last name isn't a word of is shown as registered)
export function certName(full, first, last, fmt) {
  full = clean(full); last = clean(last);
  if (!full) return "";
  if (fmt === "firstLast" || !last) return full;
  const i = full.toLowerCase().lastIndexOf(last.toLowerCase());
  if (i <= 0 || !edge(full[i - 1]) || !edge(full[i + last.length])) return full;
  const before = clean(full.slice(0, i)).replace(/,$/, ""), after = clean(full.slice(i + last.length)).replace(/^,\s*/, "");
  return before ? `${full.slice(i, i + last.length)}, ${before}${after ? " " + after : ""}` : full;
}
// rec: trainee:<id>; settings: settings:certificate (or null)
export function certNameOf(rec, settings) {
  const fmt = (settings && settings.nameFormat) || "lastFirst";
  const first = clean(rec && rec.firstName), last = clean(rec && rec.lastName);
  const full = certName(rec && rec.fullName, first, last, fmt);
  if (full) return full;
  if (last) return fmt === "firstLast" ? `${first} ${last}`.trim() : `${last}, ${first}`;
  return clean(rec && (rec.certName || rec.name));
}
