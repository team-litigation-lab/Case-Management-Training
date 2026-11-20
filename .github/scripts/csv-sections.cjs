// A helper for the browser checks (not a check itself): reads the 🏅 Scorecard's ⬇ Download as a person opens it.
// The file is one table after another: a line with the table's title, its header row, its rows, a blank line
// (js/cm-batch-sheet.js download), a table in groups of columns with a row of group names above its header.
// parse(text) → [{title, groups?, head, rows}] in the file's order; ⬇ Scores only has one table
// and no title line. grab(page, expr) presses the download (expr runs in the page) and returns the file's text.
function rowsOf(text) {
    const out = []; let row = [], cell = '', q = false, i = 0;
    text = String(text || '').replace(/^﻿/, '');
    for (; i < text.length; i++) {
        const ch = text[i];
        if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; continue; }
        if (ch === '"') { q = true; continue; }
        if (ch === ',') { row.push(cell); cell = ''; continue; }
        if (ch === '\r') continue;
        if (ch === '\n') { row.push(cell); out.push(row); row = []; cell = ''; continue; }
        cell += ch;
    }
    if (cell || row.length) { row.push(cell); out.push(row); }
    return out;
}
function parse(text) {
    const rs = rowsOf(text), out = []; let cur = null;
    const blank = r => r.length === 1 && r[0] === '';
    for (let i = 0; i < rs.length; i++) {
        const r = rs[i];
        if (blank(r)) { cur = null; continue; }
        if (!cur) {
            // a title line is a single cell followed by a header row; otherwise this row is the header (Scores only)
            if (r.length === 1 && rs[i + 1] && !blank(rs[i + 1])) { cur = { title: r[0], head: rs[i + 1], rows: [] }; i++; }
            else cur = { title: '', head: r, rows: [] };
            // a table in groups of columns has the group names above its headers (their first cell is the Trainee column's, blank)
            if (cur.head[0] === '' && rs[i + 1] && !blank(rs[i + 1])) { cur.groups = cur.head; cur.head = rs[i + 1]; i++; }
            out.push(cur); continue;
        }
        cur.rows.push(r);
    }
    return out;
}
async function grab(page, expr) {
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 15000 }).catch(() => null), page.evaluate(expr)]);
    if (!dl) return null;
    return require('fs').readFileSync(await dl.path(), 'utf8');
}
// a cell of a table by its header and the row whose first cell holds name
function cellOf(t, head, name) {
    if (!t) return { err: 'no such table' };
    const i = t.head.indexOf(head); if (i < 0) return { err: `no "${head}" column: ${JSON.stringify(t.head)}` };
    const r = t.rows.find(x => String(x[0] || '').includes(name)); if (!r) return { err: `no row for ${name}` };
    return { v: r[i] };
}
module.exports = { parse, grab, cellOf, rowsOf };
