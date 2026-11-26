/* 📖 IN PLAIN ENGLISH AS A BUTTON, AND THE UPL LINE UNDER THE CM RED FLAG (every Case Flow deck)
   · 📖 In plain English: a lesson slide drew its plain-English terms as a bar across the sheet (js/cm-case-flow.js
     plainBox, a <details>). It is now a button on the slide's band, beside 📖 Reference: "📖 In plain English" opens
     the terms and their meanings in a pop-up over the slide (✕, Esc or a click outside closes it). The bar itself is
     hidden, so the sheet keeps its room. In the audience's view (no 📖 Reference on the band) the bar stays as it was.
   · ⚖ UPL Line: on a slide that draws a CM Red Flag, the UPL line is its last row (under You see · It costs · You do),
     as the flag's explanation, instead of a bar of its own. A slide without a drawn Red Flag keeps the UPL bar.
   Styles and a light pass over each drawn slide; the copy and js/cm-case-flow.js are unchanged. */
(function(){
"use strict";
if(typeof document === "undefined" || window.cmPlainPop) return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);

function fix(card){
  const ref = card.querySelector(".cfx-ref-open");
  // 📖 In plain English: the bar becomes a button beside 📖 Reference
  const plain = card.querySelector("details.cfx-plain:not([data-pp])");
  if(plain && ref){
    plain.setAttribute("data-pp", "1"); plain.hidden = true; plain.style.setProperty("display", "none", "important"); plain.removeAttribute("open");
    if(!card.querySelector(".cfx-plain-open")){
      const terms = [...plain.querySelectorAll("dt")].map(dt => dt.textContent.trim());
      const b = document.createElement("button");
      b.type = "button"; b.className = "cfx-plain-open";
      b.title = "What these words mean: " + terms.join(", ");
      b.textContent = "📖 In plain English";
      b.addEventListener("click", ev => { ev.stopPropagation(); open(plain); });
      ref.insertAdjacentElement("beforebegin", b);
    }
  }
  // ⚖ UPL Line: the CM Red Flag's last row, where the slide draws one
  const rf = card.querySelector(".cfx-rf dl"), upl = card.querySelector(".cfx-upl:not([data-pp])");
  if(rf && upl){
    upl.setAttribute("data-pp", "1");
    const t = upl.querySelector("span");
    const row = document.createElement("div");
    row.className = "cfx-rf-r cfx-rf-upl";
    row.innerHTML = `<dt>⚖ UPL Line</dt><dd>${t ? t.innerHTML : ""}</dd>`;
    rf.appendChild(row); upl.hidden = true; upl.style.setProperty("display", "none", "important");
  }
}
function scan(){ document.querySelectorAll(".cfx.cfx-deck").forEach(fix); }
let queued = false;
new MutationObserver(() => { if(queued) return; queued = true; Promise.resolve().then(() => { queued = false; scan(); }); })
  .observe(document.documentElement, {childList: true, subtree: true});

/* the pop-up */
function open(plain){
  close();
  const rows = [...plain.querySelectorAll("dl > div")].map(d => {
    const dt = d.querySelector("dt"), dd = d.querySelector("dd");
    return `<div class="cpp-row"><dt>${E(dt ? dt.textContent : "")}</dt><dd>${E(dd ? dd.textContent : "")}</dd></div>`;
  }).join("");
  const o = document.createElement("div");
  o.id = "cpp-ov"; o.className = "overlay cpp-ov"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", "In plain English");
  o.innerHTML = `<div class="cpp-box"><div class="cpp-head"><h3>📖 In plain English</h3><button type="button" class="cpp-x" aria-label="Close">✕</button></div><dl class="cpp-list">${rows}</dl></div>`;
  o.addEventListener("mousedown", ev => { if(ev.target === o) close(); });
  o.querySelector(".cpp-x").addEventListener("click", close);
  document.body.appendChild(o);
  document.addEventListener("keydown", onKey, true);
  o.querySelector(".cpp-x").focus();
}
function close(){ const o = document.getElementById("cpp-ov"); if(o) o.remove(); document.removeEventListener("keydown", onKey, true); }
function onKey(ev){ if(ev.key === "Escape"){ ev.stopPropagation(); ev.preventDefault(); close(); } }
window.cmPlainPop = {open, close, scan};

const css = document.createElement("style"); css.id = "cm-plain-pop";
css.textContent = `
.cfx-plain-open{flex:0 0 auto;font:800 16px/1 'Inter',sans-serif;padding:0 14px;margin-right:8px;border-radius:12px;border:2px solid #DB8437;background:#fff;color:#1E2340;cursor:pointer;white-space:nowrap;align-self:stretch;}
.cfx-plain-open:hover,.cfx-plain-open:focus-visible{background:#DB8437;color:#fff;outline:none;}
.cfx-ribbon-ref .cfx-plain-open + .cfx-ref-open{margin-left:0;}
.cpp-ov{position:fixed;inset:0;z-index:4100;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(15,19,38,.6);}
.cpp-box{width:min(760px,100%);max-height:100%;overflow:auto;background:#fff;border-radius:16px;border-top:5px solid #DB8437;box-shadow:0 18px 48px rgba(0,0,0,.4);}
.cpp-head{display:flex;align-items:center;gap:12px;padding:16px 20px 10px;border-bottom:1px solid #DFE3EC;}
.cpp-head h3{flex:1;margin:0;font:800 22px/1.2 'Poppins','Inter',sans-serif;color:#1E2340;}
.cpp-x{width:40px;height:40px;border-radius:50%;border:2px solid #1E2340;background:#fff;color:#1E2340;font:800 18px/1 'Inter',sans-serif;cursor:pointer;}
.cpp-x:hover,.cpp-x:focus-visible{background:#DB8437;border-color:#DB8437;color:#fff;outline:none;}
.cpp-list{margin:0;padding:8px 20px 18px;}
.cpp-row{padding:12px 0;border-bottom:1px solid #EEF0F5;}
.cpp-row:last-child{border-bottom:0;}
.cpp-row dt{font:800 18px/1.3 'Inter',sans-serif;color:#A4470F;margin:0 0 4px;}
.cpp-row dd{margin:0;font:700 17px/1.5 'Inter',sans-serif;color:#1E2340;}
.cfx .cfx-rf .cfx-rf-upl{border-top:1px dashed rgba(164,71,15,.35);padding-top:6px;margin-top:2px;}
.cfx .cfx-rf .cfx-rf-upl dt{white-space:nowrap;}
`;
document.head.appendChild(css);
})();
