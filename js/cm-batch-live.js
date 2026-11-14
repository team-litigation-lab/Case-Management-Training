/* 🏷 A TRAINEE'S BATCH ID, LIVE FROM THEIR RECORD
   The Batch ID a trainee's page shows (My Performance, the batch's open days and videos) was read once, at sign-in, and
   kept on the device ("trainee-batch"). A Batch ID corrected later on the record (by the LSH Training Portal's sign-in,
   worker.js, or by a trainer) didn't reach a page that was already open, or a device that had it saved.
   Every time the page reads the trainee's own record (each sync, and the once-a-minute check: applyAdminUnlocks gets the
   record each time) the record's Batch ID is taken, so the corrected one shows within about a minute. */
(function(){
"use strict";
if(typeof applyAdminUnlocks !== "function" || typeof state === "undefined") return;
function adopt(rec){
  if(!rec || !state.traineeId || (state.isAdmin && !state.adminPreview) || (rec.id && rec.id !== state.traineeId)) return;
  const b = String(rec.batch || "").trim();
  const ok = typeof cleanBatch === "function" ? cleanBatch(b) : b;
  if(!ok || b === state.traineeBatch) return;
  state.traineeBatch = b;
  try{ if(typeof storeSet === "function") storeSet("trainee-batch", b); }catch(e){}
}
const __apply = applyAdminUnlocks;
const wrapped = async function(rec){ adopt(rec); return __apply.apply(this, arguments); };
window.applyAdminUnlocks = wrapped;
try{ applyAdminUnlocks = wrapped; }catch(e){}
window.cmBatchLive = {adopt};
})();
