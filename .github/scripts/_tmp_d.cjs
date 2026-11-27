const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1366, height: 768 } });
  await page.goto('http://localhost:8799/', { waitUntil: 'load' }); await page.waitForTimeout(800);
  await signIn(page, 'Rory', 'Labxabcdef', 'B100926');
  console.log(await page.evaluate(async () => { const d = DAYS[0]; state.slideProgress = {[d.id]: 1}; goto('day', d.id); state.dayViewMode='slides'; state.maxSlideReached=9999; state.lessonSlide = 69; render();
    cmTaskLab.start(); await new Promise(r => setTimeout(r, 50));
    const btn = [...document.querySelectorAll('.ctl-page #lessonSlideWrap button')].find(b => /Open the Action Plan Editor/.test(b.textContent));
    const oc = btn.getAttribute('onclick'); btn.click(); await new Promise(r => setTimeout(r, 80));
    return [oc, state.view, JSON.stringify(state.cfReturn), String(cmCaseFlow.tool).slice(0, 120), (document.getElementById('cf-return')||{}).textContent, (document.getElementById('cf-return')||{}).hidden]; }));
  await b.close();
})();
