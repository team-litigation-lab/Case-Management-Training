/* 🏅 THE SCORECARD, TIDY: EACH FACT ONCE, SECTIONS IN NAVY, COLUMNS ALIGNED (Admin → 🏅 Scorecard → 🏅 Scorecards)
   The owner: easy for the trainer to find, backtrack and double-check; no overlapping parts and no data said twice.
   · 🏅 Scores: one number per cell. A day's cell shows its score only (the small table of slides, KC, activities, docs and
     Drive under it said again what the trainee's card says); hovering it still lists everything done that day.
     The day and kind-of-work columns are one width and centred, so the numbers line up down the table.
   · the trainee's card holds the day's detail once, at the bottom of the page: 📅 Day scores, a row a day, now with that
     day's 📚 Slides first (the one fact only the table had). Compliance loses its 📚 Lesson decks row, the same slides again.
   · one batch picked: the Batch column goes (the hero names the batch), and the sheet's column letters close up (A, B, C…).
   · every section opens on the same navy band: 🏅 Scores and 🔎 Grades in detail as Compliance and 💬 Feedback already do.
   A light pass over the page after each draw, and styles; the grading, the ⬇ Download and the data are unchanged. */
(function(){
"use strict";
if(typeof document === "undefined" || window.cmScorecardTidy) return;
const norm = s => String(s || "").replace(/\s+/g, " ").trim();

function tidy(){
  const scr = document.querySelector(".scx-page"); if(!scr) return;
  const sec = scr.querySelector("#scx-scores"), table = sec && sec.querySelector("table");
  // one batch picked: no Batch column, and the letters row closes up
  if(table && !table.dataset.tidy){
    table.dataset.tidy = "1";
    const pick = scr.querySelector(".scx-bpick select"), one = !!(pick && pick.value);
    const heads = [...table.querySelectorAll("thead tr")], names = heads[heads.length - 1];
    const bi = names ? [...names.cells].findIndex(c => norm(c.textContent) === "Batch") : -1;
    if(one && bi >= 0){
      [...table.rows].forEach(r => { const c = r.cells[bi]; if(c) c.style.display = "none"; });
      if(heads.length > 1){ let k = 0; [...heads[0].cells].forEach(c => { if(c.style.display === "none") return; const t = norm(c.textContent); if(/^[A-Z]{1,2}$/.test(t)) c.textContent = col(k++); }); }
    }
  }
  if(table && !table.dataset.tidyNotes){
    table.dataset.tidyNotes = "1";
    // a long note in a number column (a failed grading's reason): small, so one cell never makes its row tall
    table.querySelectorAll("tbody td.gs-num").forEach(c => { const t = norm(c.textContent); if(t.length > 18 && !/^\d+%$/.test(t)) c.classList.add("sct-note"); });
    // the key under the table: a day's slides and work are in the trainee's card now
    const foot = [...sec.querySelectorAll("p, div")].find(n => /^What each column measures/.test(norm(n.textContent)) && !n.querySelector("table"));
    if(foot) foot.innerHTML = foot.innerHTML.replace(/the day's score \(100-point model\) · its slides · its work/, "the day's score (100-point model); its slides and work are in the trainee's card, 📅 Day scores");
  }
  // the card: each day's slides into its 📅 Day scores row; Compliance without the Lesson decks row
  const card = scr.querySelector(".bs-pts .bs-pt"), days = card && card.querySelector(".bs-pt-s-days");
  if(days && !days.dataset.tidy && table){
    days.dataset.tidy = "1";
    const who = norm((card.querySelector(".bs-pt-name") || {}).textContent);
    const row = [...table.tBodies[0].rows].find(r => norm(r.cells[0] && r.cells[0].textContent).startsWith(who));
    const dayCells = row ? [...row.cells].filter(c => c.classList.contains("bs-dc")) : [];
    [...days.rows].forEach(r => {
      const m = /^Day (\d)\b/.exec(norm(r.cells[0] && r.cells[0].textContent)); if(!m || !r.cells[2]) return;
      const cell = dayCells[Number(m[1]) - 1]; if(!cell) return;
      const sl = [...cell.querySelectorAll(".bs-dc-r")].find(x => /^Slides$/.test(norm((x.querySelector(".bs-dc-l") || {}).textContent)));
      const v = sl ? norm((sl.querySelector(".bs-dc-v") || {}).textContent) : "";
      if(!v) return;
      // at the head of the day's summary line (the cell's first line, before its ▸ What makes up this score)
      const first = r.cells[2].firstChild, host = first && first.nodeType === 1 && !/^(DETAILS|TABLE)$/.test(first.tagName) ? first : r.cells[2];
      host.insertAdjacentHTML("afterbegin", `<span class="sct-slides">📚 Slides ${v.replace(/[<>&]/g, "")}</span> · `);
    });
  }
  scr.querySelectorAll(".ccm-t tr:not([data-tidy])").forEach(r => { r.dataset.tidy = "1"; if(/^📚\s*Lesson decks/.test(norm(r.cells[0] && r.cells[0].textContent))) r.remove(); });
}
const col = k => (k >= 26 ? String.fromCharCode(64 + Math.floor(k / 26)) : "") + String.fromCharCode(65 + (k % 26));

let queued = false;
new MutationObserver(() => { if(queued) return; queued = true; Promise.resolve().then(() => { queued = false; try{ tidy(); }catch(e){} }); })
  .observe(document.documentElement, {childList: true, subtree: true});
window.cmScorecardTidy = {tidy};

const S = ".scx-page";
const css = document.createElement("style"); css.id = "cm-scorecard-tidy"; css.textContent = `
/* 🏅 Scores: one number per day cell, the numeric columns one width and centred */
${S} #scx-scores td.bs-dc .bs-dc-t{display:none !important;}
${S} #scx-scores td.gs-num{text-align:center !important;vertical-align:middle !important;}
${S} #scx-scores td.bs-dc > b{display:block;text-align:center;font-size:17px;}
${S} #scx-scores th{text-align:center !important;vertical-align:middle !important;}
${S} #scx-scores td.bs-dc{min-width:96px;width:96px;}
${S} #scx-scores td.gs-num:not(.bs-dc){min-width:112px;}
${S} #scx-scores td.sct-note{font-size:14px !important;line-height:1.25 !important;font-weight:700 !important;}
${S} #scx-scores td.gs-name{vertical-align:middle !important;}
/* every section on the same navy band */
${S} #scx-scores > h3, ${S} .bs-sec > h3.bs-h{display:flex;align-items:baseline;gap:10px;margin:0 0 8px !important;padding:10px 16px !important;background:#1E2340 !important;color:#fff !important;border-radius:12px 12px 0 0;}
${S} #scx-scores > h3 span, ${S} .bs-sec > h3.bs-h span{color:#C9CFE0 !important;}
/* the card's 📅 Day scores: the slides first, then the rest, aligned */
${S} .bs-pt-s-days td.bs-pt-v{text-align:center !important;vertical-align:middle !important;width:84px;}
${S} .bs-pt-s-days td.bs-pt-m{vertical-align:middle !important;}
${S} .bs-pt-s-days .sct-slides{font-weight:800;color:#1E2340;white-space:nowrap;}
`;
document.head.appendChild(css);
})();
