/* ⭐ One Overall score, on every page that shows one.
   A trainee used to see three different overall scores: the 🏅 Scores row's Total (the 100-point model's Final), the card's
   Overall (the Final averaged with the Daily compliance) and the Batch Sheet's (the average of the days' deliverables), and
   the dashboard's 🏅 My Score Card a fourth (35% progress · 25% quizzes · 25% Skill Builders · 15% random tasks).
   Now there is one: the client's 100-point model's Final (js/cm-scorecard.js MODEL), computed by ONE function,
   cmScorecard.overall(ctx), which the card, 🏅 Scores, the Batch Sheet (js/cm-batch-sheet.js) and My Scores all call.
   The Final is the number Pass and the tier are read on, so the Overall and the Result can never disagree. The Daily
   compliance and the grading-systems average stay, labelled as sub-scores.
   This file puts the same number on the dashboard's 🏅 My Score Card (window.renderRankingCard, js/cm-updates.js), from
   the same records as the trainee's own 🏅 My Performance card (cmScorecard.myOverall). */
(function(){
"use strict";
if(typeof window === "undefined") return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
function myCard(){
  let o = null; try{ o = window.cmScorecard && cmScorecard.myOverall ? cmScorecard.myOverall() : null; }catch(e){ o = null; }
  const v = o && o.pct != null ? o.pct + "%" : "—";
  return `<div class="card stat rank-card" data-overall="${o && o.pct != null ? o.pct : ""}">
    <div class="num">${E(v)}</div>
    <div class="lbl">My Score Card</div>
    <div class="sub">${E(o && o.pct != null ? "Your Overall: the 100-point model's score, the same one on 🏅 My Performance" : "Your Overall shows once your first work is graded")}</div>
  </div>`;
}
const was = window.renderRankingCard;
window.renderRankingCard = function(){
  // (the old card still runs, for what it loads: the trainee's sent feedback)
  let old = ""; try{ old = typeof was === "function" ? was.apply(this, arguments) : ""; }catch(e){ old = ""; }
  return window.cmScorecard && cmScorecard.myOverall ? myCard() : old;
};
})();
