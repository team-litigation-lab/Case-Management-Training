// The picks that give a Knowledge Check score on a Case Flow day, for the checks that write a trainee's attempt. The Worker
// scores an attempt from its own picks (worker-identity.js kcScore, against worker-kc-key.js) as the page now sends them
// (index.html submitQuiz), so a check's attempt carries the picks of the score it means. Not a check itself.
// Usage: const { picksFor, withPicks, KC_KEY } = require('./kc-picks.cjs');
//   picksFor(11, 65)          → Day 11's picks with 13 of its 20 right (65%); a score 20 questions can't give throws
//   withPicks({11: {…}})      → a copy of a dayProgress whose attempts (history entries) carry the picks of their score
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '../../worker-kc-key.js'), 'utf8');
const KC_KEY = JSON.parse(src.slice(src.indexOf('export const KC_KEY = ') + 'export const KC_KEY = '.length).trim().replace(/;$/, ''));
function picksFor(day, score) {
    const k = KC_KEY[String(day)];
    if (!k) throw new Error(`kc-picks: no Knowledge Check key for day ${day}`);
    const n = k.a.length, right = Math.round((score / 100) * n);
    if (Math.round((right / n) * 100) !== score) throw new Error(`kc-picks: ${score}% is not a score ${n} questions give (day ${day})`);
    return k.a.map((a, i) => (i < right ? a : (a + 1) % 4));
}
function withPicks(dp) {
    const out = {};
    Object.entries(dp || {}).forEach(([d, p]) => {
        if (!p || typeof p !== 'object' || !Array.isArray(p.history) || !KC_KEY[String(d)]) { out[d] = p; return; }
        out[d] = Object.assign({}, p, { history: p.history.map((x) => (x && typeof x === 'object' && typeof x.score === 'number' && !x.answers ? Object.assign({}, x, { answers: picksFor(d, x.score) }) : x)) });
    });
    return out;
}
module.exports = { picksFor, withPicks, KC_KEY };
