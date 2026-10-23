/* Keeps John Doe v. Robert Smith current. The case is written in 2026 (collision Fri 02/06/2026, SOL Sun
   02/06/2028); this rolls every date on it forward so a trainee in 2029 or 2034 works a recent case, and keeps
   the law exact while doing it:
     · the shift is whole weeks, so every weekday, weekend roll-forward, business-day count, the 14-day gap and
       the holidays the deadlines dodge (Labor Day, Memorial Day) stay true;
     · the collision lands on the Friday from 01/31 to 02/06 of its new year, and only in a year where neither
       that year nor the next is a leap year, so the two-year SOL is still exactly DOL + 2 years. Those years are
       2026, 2029, 2030, 2033, 2034, 2037, …; between them the case keeps its last year.
   The case moves to a new year once that year's Day 1 work (through 02/11) is in the past. Each trainee keeps the
   year they started on (caseYear on their Case Flow record, set by js/cm-case-flow.js) until they finish, so dates
   never jump mid-course. A trainer can preview a year with ?caseYear=2029 (?caseYear=off ends the preview).
   Loaded after the Case Flow content and before js/cm-case-flow.js: it rewrites the dates in CM_CASE_FLOW,
   CM_CF_SLIDES, CM_CF_SIM, CM_CF_DOCS, CM_CF_SCRIPTS (the trainer scripts) and CM_CF_EXHIBITS (the exhibit audits) in place; case-doc.html does the same to the case documents.
   The CMS's Date of Loss leads: when the trainee's John Doe case in the CMS has another DOL (the CMS moves the SOL and
   every later date with it, case-dates.js there), the course moves its dates the same way, on top of the year: every
   date on or after the DOL moves by the same number of days, and dates of birth and earlier dates stay. The offset
   (dolOffset, days) is kept on the trainee's Case Flow record and on this device for the year it was taken in
   (js/cm-case-flow.js reads it from the CMS); case-doc.html is given it as &dol=. */
(function(){
  const BASE = 2026, DAY = 864e5;
  const utc = (y, m, d) => Date.UTC(y, m - 1, d);
  const BASE_DOL = utc(2026, 2, 6), BASE_DAY1_END = utc(2026, 2, 21);   // Day 1's last case event: the Final Warning Letter request (Client Communications)
  const leap = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

  /* the shift (days, a multiple of 7) that puts the case in year Y, or null when the SOL would not stay exact */
  function shiftFor(Y){
    if(!(Y >= BASE) || leap(Y) || leap(Y + 1)) return null;
    const days = Math.round((utc(Y, 2, 6) - BASE_DOL) / DAY);
    return days - (days % 7);              // back to the Friday on or before 02/06: weekdays and holidays hold
  }
  /* the newest year whose Day 1 work is already in the past on `when` */
  function freshYear(when){
    const t = when ? +when : Date.now();
    let best = BASE;
    for(let Y = BASE; Y <= new Date(t).getUTCFullYear() + 1; Y++){
      const s = shiftFor(Y);
      if(s != null && BASE_DAY1_END + s * DAY <= t) best = Y;
    }
    return best;
  }
  const validYear = y => { y = parseInt(y, 10); return shiftFor(y) != null ? y : null; };

  /* ---------- the year this page shows ---------- */
  let preview = null;
  try{
    const q = new URLSearchParams(location.search).get("caseYear");
    if(q != null){
      if(/^(off|)$/i.test(q)) sessionStorage.removeItem("lsh_case-year-preview");
      else if(validYear(q)) sessionStorage.setItem("lsh_case-year-preview", String(validYear(q)));
    }
    preview = validYear(sessionStorage.getItem("lsh_case-year-preview"));
  }catch(e){}
  const fresh = freshYear(new Date());
  let pinned = null;
  try{
    const p = JSON.parse(localStorage.getItem("lsh_case-year") || "null");
    pinned = validYear(p && p.year);
    if(!pinned){ const r = JSON.parse(localStorage.getItem("lsh_case-flow") || "null"); pinned = validYear(r && r.caseYear); }
  }catch(e){}
  const forced = validYear(window.CM_CASE_YEAR);   // case-doc.html: the year of the page that opened it
  const year = forced || preview || pinned || fresh;
  const S = shiftFor(year), K = year - BASE;
  /* the CMS Date of Loss offset (days) for this year: case-doc.html is told it (&dol=); elsewhere it's this device's,
     and only for the year it was taken in (a trainer's year preview shows the course's own dates) */
  const okDays = n => { n = parseInt(n, 10); return Number.isFinite(n) && Math.abs(n) <= 3650 ? n : 0; };
  let O = 0;
  try{
    if(forced) O = okDays(window.CM_CASE_DOL);
    else if(!preview){ const o = JSON.parse(localStorage.getItem("lsh_case-dol") || "null"); if(o && +o.year === year) O = okDays(o.days); }
  }catch(e){}
  const ROLLED_DOL = BASE_DOL + S * DAY;   // the collision in this year, before the CMS offset

  /* ---------- rewriting dates in text ---------- */
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const ABBR = {jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12};
  const monthNo = w => { const i = MONTHS.indexOf(w); return i >= 0 ? i + 1 : ABBR[w.replace(/\.$/, "").toLowerCase()] || 0; };
  const ORD_WORDS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth", "twentieth", "twenty-first", "twenty-second", "twenty-third", "twenty-fourth", "twenty-fifth", "twenty-sixth", "twenty-seventh", "twenty-eighth", "twenty-ninth", "thirtieth", "thirty-first"];
  const suffix = n => (n % 100 >= 11 && n % 100 <= 13) ? "th" : ({1: "st", 2: "nd", 3: "rd"}[n % 10] || "th");
  const pad = n => String(n).padStart(2, "0");
  const MON = "(January|February|March|April|May|June|July|August|September|October|November|December|Jan\\.?|Feb\\.?|Mar\\.?|Apr\\.?|Jun\\.?|Jul\\.?|Aug\\.?|Sept\\.?|Sep\\.?|Oct\\.?|Nov\\.?|Dec\\.?)";
  const YR = "((?:19|20)\\d\\d)";
  /* a date + S days, as [y, m, d]; leap-safe because S is applied to a real calendar date */
  function move(y, m, d, s){
    if(m === 2 && d === 29 && !leap(y)) d = 28;
    const t = new Date(utc(y, m, d) + (s == null ? S : s) * DAY);
    return [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()];
  }
  const sameAbbr = (orig, m) => {   // "Feb." → "Mar.", "Sept" → "Sep", keeps the writer's form
    if(MONTHS.includes(orig)) return MONTHS[m - 1];
    const a = MONTHS[m - 1].slice(0, m === 9 && /^sept/i.test(orig) ? 4 : 3);
    return a + (/\.$/.test(orig) ? "." : "");
  };

  // One pass, most specific forms first, so nothing is moved twice.
  const RE = new RegExp([
    // 1 "the 10th day of August, 2026" (also with the legal form's <u>&nbsp;…&nbsp;</u> blanks)
    `(\\d{1,2})(st|nd|rd|th)((?:&nbsp;|\\s)*(?:</u>)?(?:&nbsp;|\\s)*day of(?:&nbsp;|\\s)*(?:<u>)?(?:&nbsp;|\\s)*)${MON}((?:&nbsp;|\\s)*(?:</u>)?,?\\s+)${YR}\\b`,
    // 2 "Monday, July 20, 2026" / "Feb. 6, 2026" / "Dec 10 2026" / "February 18th, 2026"
    `\\b${MON}(\\s+)(\\d{1,2})(st|nd|rd|th)?(,?\\s+)${YR}\\b`,
    // 3 "February sixth"
    `\\b${MON}(\\s+)(${ORD_WORDS.slice().reverse().join("|")})\\b`,
    // 4 "February 18" (no year: the nearest full date in the text tells the year)
    `\\b${MON}(\\s+)(\\d{1,2})(st|nd|rd|th)?\\b(?![,.]?\\d|:\\d)`,
    // 5 "February 2026" / "April, 2026"
    `\\b${MON}(,?\\s+)${YR}\\b`,
    // 6 02/06/2026
    `(?<![\\d/])(\\d{1,2})/(\\d{1,2})/${YR}\\b`,
    // 7 2026-02-06 and 20261020 (a file stamp)
    `(?<!\\d)${YR}(-?)(0[1-9]|1[0-2])-?(0[1-9]|[12]\\d|3[01])(?!\\d)`,
    // 8 rev. 01/2026
    `(?<![\\d/])(0?[1-9]|1[0-2])/${YR}\\b`,
    // 9 02/18 (zero-padded, so pain scores like 2/10 and strength 5/5 stay as they are)
    `(?<![\\d/])(0[1-9]|1[0-2])/(0[1-9]|[12]\\d|3[01])(?![\\d/])`,
    // 10 the matter number LSH-2026-MVA-…, claim numbers like CS-26-20355
    `\\b(LSH-)${YR}(-)`,
    `\\b([A-Z]{2,4}-)(2[4-9])(-\\d{4,6})\\b`,
    // 11 a year on its own: "2021 visits", "2020 Ford Escape", "…, 2026."
    `(?<![\\w$/.,-])${YR}(?![\\w/-]|[.,]\\d|\\s*[×x]\\s*\\d)`,
  ].join("|"), "g");
  // the capture-group offset of each alternative, in order
  const G = []; { let n = 1; [6, 6, 3, 4, 3, 3, 4, 2, 2, 3, 3, 1].forEach(c => { G.push(n); n += c; }); }

  function yearsIn(s){   // the year of every full date in the text, by position (for dates written without one)
    const out = [], r = /(?<![\d/])\d{1,2}\/\d{1,2}\/((?:19|20)\d\d)\b|\b(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{1,2}(?:st|nd|rd|th)?,?\s+((?:19|20)\d\d)\b/g;
    let m; while((m = r.exec(s))) out.push([m.index, +(m[1] || m[2])]);
    return out;
  }
  function yearNear(list, at){
    let best = null, dist = Infinity;
    list.forEach(([i, y]) => { const d = Math.abs(i - at); if(d < dist){ dist = d; best = y; } });
    return best || BASE;
  }

  /* from (a UTC time): move only dates on or after it, by whole days (the CMS's DOL rule); a year on its own stays */
  function text(s, shift, from){
    if(typeof s !== "string" || !s) return s;
    const sh = shift == null ? S : shift;
    if(!sh) return s;
    const k = from == null ? Math.round(sh / 365.2425) : 0, years = yearsIn(s);
    const Y = y => String(+y + k);
    return s.replace(RE, function(){
      const a = arguments, at = a[a.length - 2], g = i => a[i];
      if(from != null){
        const kept = (y, m, d) => !(m >= 1 && m <= 12 && d >= 1 && d <= 31) || utc(y, m, d) < from;
        let b;
        const ORD = w => ORD_WORDS.indexOf(w.toLowerCase()) + 1;
        if(g(b = G[0]) !== undefined){ if(kept(+g(b + 5), monthNo(g(b + 3)), +g(b))) return a[0]; }
        else if(g(b = G[1]) !== undefined){ if(kept(+g(b + 5), monthNo(g(b)), +g(b + 2))) return a[0]; }
        else if(g(b = G[2]) !== undefined){ if(kept(yearNear(years, at), monthNo(g(b)), ORD(g(b + 2)))) return a[0]; }
        else if(g(b = G[3]) !== undefined){ if(kept(yearNear(years, at), monthNo(g(b)), +g(b + 2))) return a[0]; }
        else if(g(b = G[5]) !== undefined){ if(kept(+g(b + 2), +g(b), +g(b + 1))) return a[0]; }
        else if(g(b = G[6]) !== undefined){ if(kept(+g(b), +g(b + 2), +g(b + 3))) return a[0]; }
        else if(g(b = G[8]) !== undefined){ if(kept(yearNear(years, at), +g(b), +g(b + 1))) return a[0]; }
        else return a[0];                                  // a month and year, a year, a matter or claim number
      }
      let b;
      if(g(b = G[0]) !== undefined){ const [ny, nm, nd] = move(+g(b + 5), monthNo(g(b + 3)), +g(b), sh); return `${nd}${suffix(nd)}${g(b + 2)}${sameAbbr(g(b + 3), nm)}${g(b + 4)}${ny}`; }
      if(g(b = G[1]) !== undefined){ const [ny, nm, nd] = move(+g(b + 5), monthNo(g(b)), +g(b + 2), sh); return `${sameAbbr(g(b), nm)}${g(b + 1)}${nd}${g(b + 3) ? suffix(nd) : ""}${g(b + 4)}${ny}`; }
      if(g(b = G[2]) !== undefined){ const [, nm, nd] = move(yearNear(years, at), monthNo(g(b)), ORD_WORDS.indexOf(g(b + 2).toLowerCase()) + 1, sh); return `${sameAbbr(g(b), nm)}${g(b + 1)}${ORD_WORDS[nd - 1]}`; }
      if(g(b = G[3]) !== undefined){ const [, nm, nd] = move(yearNear(years, at), monthNo(g(b)), +g(b + 2), sh); return `${sameAbbr(g(b), nm)}${g(b + 1)}${nd}${g(b + 3) ? suffix(nd) : ""}`; }
      if(g(b = G[4]) !== undefined) return `${g(b)}${g(b + 1)}${Y(g(b + 2))}`;
      if(g(b = G[5]) !== undefined){ const [ny, nm, nd] = move(+g(b + 2), +g(b), +g(b + 1), sh); return `${g(b).length === 2 ? pad(nm) : nm}/${g(b + 1).length === 2 ? pad(nd) : nd}/${ny}`; }
      if(g(b = G[6]) !== undefined){ const [ny, nm, nd] = move(+g(b), +g(b + 2), +g(b + 3), sh); return `${ny}${g(b + 1)}${pad(nm)}${g(b + 1)}${pad(nd)}`; }
      if(g(b = G[7]) !== undefined) return `${g(b)}/${Y(g(b + 1))}`;
      if(g(b = G[8]) !== undefined){ const [, nm, nd] = move(yearNear(years, at), +g(b), +g(b + 1), sh); return `${pad(nm)}/${pad(nd)}`; }
      if(g(b = G[9]) !== undefined) return `${g(b)}${Y(g(b + 1))}${g(b + 2)}`;
      if(g(b = G[10]) !== undefined) return `${g(b)}${pad((+g(b + 1) + k) % 100)}${g(b + 2)}`;
      return Y(g(G[11]));
    });
  }

  /* rewrite every string in a structure, in place (ids, file paths and image names are left alone) */
  const KEEP = new Set(["id", "file", "folder", "image", "kind", "cms", "tool"]);
  function apply(o, shift, from, seen){
    if(!o || typeof o !== "object") return o;
    seen = seen || new Set(); if(seen.has(o)) return o; seen.add(o);
    for(const key of Object.keys(o)){
      const v = o[key];
      if(typeof v === "string"){ if(!KEEP.has(key)) o[key] = text(v, shift, from); }
      else if(v && typeof v === "object") apply(v, shift, from, seen);
    }
    return o;
  }
  /* the year's dates, then the CMS Date of Loss offset on top */
  const all = s => O ? text(text(s), O, ROLLED_DOL) : text(s);

  const api = {
    base: BASE, year, shift: S, years: K, fresh, preview: !!preview, pinnedYear: pinned,
    shiftFor, freshYear, validYear, text, apply, all,
    /* the CMS Date of Loss offset on this page (days), what a CMS DOL (MM/DD/YYYY) makes it, and keeping it */
    dolOffset: O,
    offsetFor(mdY){
      const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(mdY || "").trim());
      if(!m) return null;
      const n = Math.round((utc(+m[3], +m[1], +m[2]) - ROLLED_DOL) / DAY);
      return Math.abs(n) <= 3650 ? n : null;
    },
    setDolOffset(days, y){ try{ localStorage.setItem("lsh_case-dol", JSON.stringify({year: y || year, days: okDays(days), at: new Date().toISOString()})); }catch(e){} },
    /* the year a trainee's record should be on: theirs if set, else (a record with work from before this
       existed) the base year, else the newest */
    yearForRecord(r){
      if(r && validYear(r.caseYear)) return +r.caseYear;
      const worked = r && r.modules && Object.values(r.modules).some(m => m && ((m.answers || []).some(Boolean) || (m.kc || []).some(Boolean) || m.quiz || m.ai || m.savedAt));
      return worked || (r && (r.ticks || r.calls)) ? BASE : fresh;
    },
    pin(y){ try{ localStorage.setItem("lsh_case-year", JSON.stringify({year: y, at: new Date().toISOString()})); }catch(e){} },
    /* "the case as of …": the collision date on this page, for notes */
    dol(){ const [y, m, d] = move(2026, 2, 6, S + O); return `${pad(m)}/${pad(d)}/${y}`; },
  };
  window.CM_CASE_DATES = api;
  ["CM_CASE_FLOW", "CM_CF_SLIDES", "CM_CF_SIM", "CM_CF_DOCS", "CM_CF_SCRIPTS", "CM_CF_EXHIBITS"].forEach(k => {
    if(!window[k]) return;
    if(S) apply(window[k], S);
    if(O) apply(window[k], O, ROLLED_DOL);
  });
})();
