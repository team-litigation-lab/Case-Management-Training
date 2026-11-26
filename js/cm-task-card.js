/* 🧾 EVERY ACTIVITY'S YOUR TASK AS ONE CARD, AND A TWO-BUTTON BAR (the standard on every deck's activities)
   An activity's Your Task slide (js/cm-case-flow.js view "task", styled by js/cm-sb-task.js) was a navy 📂 Your Case
   strip, the numbered steps under it, and a bar of 🚀 Launch · 🧰 Tools ▾ · Submit →. Now:
   · one instruction card: 📂 Your Case at its head, said as fact ("Assuming claims are open…" reads "Claims are open…"),
     then ✅ What to do and the numbered steps, then the lesson it practices and where its tools are, as plain text;
   · the bar: 🚀 Launch LSH CaseWorX & Google Drive, and Submit →. Nothing else on the slide to press;
   · what the 🧰 Tools menu held (the 💡 Tip, the Case Manager's guide, 🧠 Think it through, 📞 the call, 📁 Source Files,
     the audit, the Notes & Action Plan, the Action Plan Editor, a trainer's ⚡ Inject…) is in 📖 Reference, at its top,
     under 🧰 This task's tools. The slide keeps it, hidden, with the classes the rest of the course reads
     (.cfx-tools-menu .cfx-tools-pop, .cfx-call, .cfx-of): js/cm-lesson-tips.js, js/cm-case-guides.js and
     js/cm-think-through.js still put their buttons beside its "Practices:" line, and 📖 Reference shows a copy.
   Wraps window.renderLessonCard (loaded before js/cm-vm-transcribe.js, which then works on this card) and cmCaseFlow.full. */
(function(){
"use strict";
if(typeof window === "undefined" || typeof document === "undefined" || typeof window.renderLessonCard !== "function") return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const __card = window.renderLessonCard;
window.renderLessonCard = function(l){
  const html = __card.apply(this, arguments);
  const b = l && l.cf && l.cf.block; if(!b || b.kind !== "activity" || String(html).indexOf("cfx-task-foot") < 0) return html;
  const t = document.createElement("template"); t.innerHTML = String(html);
  const task = t.content.querySelector(".cfx-task.cfx-task1"), foot = task && task.querySelector(":scope > .cfx-task-foot");
  const steps = task && task.querySelector(":scope > ol.cfx-steps"); if(!foot || !steps || task.querySelector(".cfx-brief")) return html;
  const yc = task.querySelector(":scope > .cfx-yc");
  // 📂 Your Case said as fact
  const yt = yc && yc.querySelector(".cfx-yc-t");
  if(yt) yt.innerHTML = yt.innerHTML.replace(/^(\s*)Assuming\s+(?:that\s+)?(<[^>]+>)?\s*([a-z])/i, (m, sp, tag, c) => sp + (tag || "") + c.toUpperCase());
  const card = document.createElement("div"); card.className = "cfx-brief";
  if(yc) card.appendChild(yc);
  card.insertAdjacentHTML("beforeend", `<div class="cfx-brief-k">✅ What to do</div>`);
  card.appendChild(steps);
  // the 🧰 Tools menu: off the bar, kept hidden on the slide for 📖 Reference
  const menu = foot.querySelector(":scope > .cfx-tools-menu"), pop = menu && menu.querySelector(".cfx-tools-pop");
  const of = pop && pop.querySelector(".cfx-of"), ofText = of ? of.textContent.trim() : "";
  card.insertAdjacentHTML("beforeend", `<p class="cfx-brief-of">${ofText ? `<span>${E(ofText)}</span>` : ""}<span class="cfx-brief-ref">💡 Tips, 📁 Source Files and this task's tools: <b>📖 Reference</b>, top right</span></p>`);
  if(menu){
    menu.remove();
    if(pop && pop.children.length){
      const stash = document.createElement("div"); stash.className = "cfx-tools-menu cfx-tools-stash"; stash.dataset.tools = b.id; stash.hidden = true;
      stash.appendChild(pop); task.appendChild(stash);
    }
  }
  foot.before(card);
  return t.innerHTML;
};

/* 📖 Reference on a Your Task slide: 🧰 This task's tools at its top (a copy of the slide's hidden menu) */
if(window.cmCaseFlow && typeof cmCaseFlow.full === "function"){
  const __full = cmCaseFlow.full;
  cmCaseFlow.full = function(){
    const r = __full.apply(this, arguments);
    try{
      const pop = document.querySelector("#lessonSlideWrap .cfx-tools-stash .cfx-tools-pop"), body = document.querySelector(".cfx-ref .cfx-ref-b");
      if(pop && body && !body.querySelector(".cfx-ref-tools")){
        const sec = document.createElement("section"); sec.className = "cfx-ref-tools";
        sec.innerHTML = `<h3>🧰 This task's tools</h3>`;
        const box = pop.cloneNode(true); box.classList.add("cfx-tools-menu"); box.querySelectorAll("[id]").forEach(n => n.removeAttribute("id"));
        sec.appendChild(box); body.prepend(sec);
      }
    }catch(e){}
    return r;
  };
}

const css = document.createElement("style"); css.id = "cm-task-card"; css.textContent = `
.cfx-task1 .cfx-brief{display:flex;flex-direction:column;gap:6px;background:#fff;border:2px solid #E3E6EF;border-radius:16px;padding:0 0 10px;overflow:hidden;text-align:left;}
.cfx-task1 .cfx-brief > .cfx-yc{border-radius:0 !important;margin:0 !important;}
.cfx-task1 .cfx-brief-k{margin:4px 18px 0;font:800 16px/1.2 var(--font-ui,'Inter',sans-serif);letter-spacing:.06em;text-transform:uppercase;color:#A4470F;}
.cfx-task1 .cfx-brief > ol.cfx-steps{margin:0 !important;padding:0 18px !important;gap:4px !important;}
.cfx-task1 .cfx-brief-of{display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px 16px;margin:2px 18px 0;padding-top:8px;border-top:1.5px dashed #E3E6EF;font:700 16px/1.3 var(--font-ui,'Inter',sans-serif);color:#4A5070;}
.cfx-task1 .cfx-brief-of > span:first-child:not(.cfx-brief-ref){font-weight:800;color:#A4470F;}
.cfx-task1 .cfx-brief-ref b{color:#1E2340;}
.cfx-task1 .cfx-task-foot{justify-content:space-between;}
@media (max-height:900px){ .cfx-task1 .cfx-brief{gap:2px;padding-bottom:6px;} .cfx-task1 .cfx-brief > .cfx-yc{padding-top:6px !important;padding-bottom:6px !important;} .cfx-task1 .cfx-brief-k{margin-top:2px;} .cfx-task1 .cfx-brief > ol.cfx-steps{gap:0 !important;} .cfx-task1 .cfx-brief-of{margin-top:0;padding-top:4px;} }
/* 🧰 This task's tools, in 📖 Reference: the menu's rows as they were, laid out in the panel */
.cfx-ref .cfx-ref-tools{margin:0 0 14px;padding:12px 14px;background:#F6F7FB;border:2px solid #E3E6EF;border-radius:14px;}
.cfx-ref .cfx-ref-tools h3{margin:0 0 8px;font:800 18px/1.3 var(--font-ui,'Inter',sans-serif);color:#1E2340;}
.cfx-ref .cfx-ref-tools .cfx-tools-pop{position:static !important;display:flex !important;flex-direction:column;gap:8px;width:auto !important;max-height:none !important;overflow:visible !important;box-shadow:none !important;border:0 !important;padding:0 !important;background:none !important;}
.cfx-ref .cfx-ref-tools .cfx-call{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:2px 12px;background:#262B45;border-radius:14px;padding:10px 14px;color:#fff;text-align:left;}
.cfx-ref .cfx-ref-tools .cfx-call span{font-size:16px !important;}
.cfx-ref .cfx-ref-tools .cfx-of-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px;background:#FFF6EC;}
.cfx-ref .cfx-ref-tools .cfx-of-row .cfx-of{font:800 16px/1.3 var(--font-ui,'Inter',sans-serif);color:#A4470F;}
.cfx-ref .cfx-ref-tools .cfx-tools-in{display:flex;flex-wrap:wrap;gap:8px;}
.cfx-ref .cfx-ref-tools .cfx-docs{position:static;background:#fff;border:2px solid #E3E6EF;border-radius:12px;padding:10px 14px;}
.cfx-ref .cfx-ref-tools .cfx-docs summary{cursor:pointer;font:800 17px/1.3 var(--font-ui,'Inter',sans-serif);color:#1E2340;}
.cfx-ref .cfx-ref-tools .cfx-docs-pop{position:static;width:auto;max-height:none;overflow:visible;box-shadow:none;border:0;padding:8px 0 0;}
`;
document.head.appendChild(css);
})();
