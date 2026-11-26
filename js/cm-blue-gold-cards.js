/* ✨ THE DAY CARDS WEAR THE LSH FRAME
   The LSH Academy Index, LSH Elev8 and LSH Atlas cards share one frame: a thick rounded outline, navy along the top fading to
   gold at the bottom. The Case Flow day cards (and every other .module-card on the dashboard) now wear it too, in place of the
   light grey 6px frame js/lsh-card-frame.js gives them. Only the frame changes: the card's face stays the near-white it was,
   and its header, rows and buttons are untouched. Thinner on a phone. Doubled class names outrank cm-know-tools.js's face. */
(function(){
"use strict";
if(document.getElementById("cm-blue-gold-cards")) return;
const st = document.createElement("style"); st.id = "cm-blue-gold-cards";
st.textContent = `
html body .dash-main .module-card.module-card{border:6px solid transparent !important;
  background:linear-gradient(rgba(255,255,255,.96),rgba(255,255,255,.96)) padding-box,
    linear-gradient(180deg,#1E2340 0%,#2c3360 30%,#a8692f 78%,#DB8437 100%) border-box !important;}
html body .dash-main .module-card.module-card:hover{border-color:transparent !important;}
@media (max-width:560px){ html body .dash-main .module-card.module-card{border-width:4px !important;} }
`;
document.head.appendChild(st);
})();
