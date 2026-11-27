/* 💊 THE TOP BAR AS PILLS (every page)
   Each top-bar button (📊 Dashboard, 📇 Case Profile, 🧪 Practice, 🧰 Tools ▾, 📚 Guides ▾, 🔓 Open Lessons, 👁 Switch View,
   🛡 Admin, 🎓 LSH Academy Index) sits in its own rounded pill: a soft glass fill and a thin light edge, so the bar reads
   as separate buttons. The page you are on keeps its gold pill; 👁 Switch View keeps its gold words. The drop-down
   menus' own rows are unchanged. Styles only. */
(function(){
"use strict";
if(typeof document === "undefined" || document.getElementById("cm-nav-pills")) return;
const P = "html body .topbar .nav";
const PILL = `${P} > button, ${P} > div > button:first-child`;
const css = `
${P}{gap:8px !important;align-items:center !important;}
${PILL}{border-radius:999px !important;padding:8px 16px !important;background:rgba(255,255,255,.08) !important;border:1px solid rgba(255,255,255,.22) !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.10) !important;transition:background .15s,border-color .15s;}
${P} > button:hover, ${P} > div > button:first-child:hover, ${P} > button:focus-visible, ${P} > div > button:first-child:focus-visible{background:rgba(255,255,255,.16) !important;border-color:rgba(255,255,255,.4) !important;}
${P} > button.active, ${P} > div > button:first-child.active{background:linear-gradient(180deg,#F6CD6A 0%,#E9A93A 100%) !important;color:#1E2340 !important;border-color:#F6CD6A !important;box-shadow:0 4px 12px -6px rgba(233,169,58,.8) !important;}
${P} > button.nav-viewswitch{border-color:rgba(246,205,106,.55) !important;}
`;
const add = () => { if(document.getElementById("cm-nav-pills")) return;
  const st = document.createElement("style"); st.id = "cm-nav-pills"; st.textContent = css; document.head.appendChild(st); };
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", add); else add();
})();
