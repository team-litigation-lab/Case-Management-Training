// @check node — A course document saved to the Backup Drive under the name the trainee filed it under in the CMS (the firm's way: <Case ID>_<Last-First>_<Type>_<date>, no document code or title in it) is recognised as that document, and two filed under one name are told apart; a file the trainee never filed stays unrecognised
// worker-drive-found.js applyFound / filedNames. Before, a file was known only by a code (RS01) or its title in its name,
// so trainees who named their files the way the course teaches (…_Police-Report_2026-11-16.pdf) had every day after Day 1
// at 0% on the Backup Drive although the documents were in their folders.
// Usage: node .github/scripts/drive-filed-names.cjs
'use strict';
const path = require('path');
const { pathToFileURL } = require('url');

(async () => {
    const M = await import(pathToFileURL(path.join(__dirname, '../../worker-drive-found.js')).href);
    const fails = [], fail = (m) => fails.push(m);
    const HOMES = { police: '01 Clients/Doe-John/02 Police, Witness & Video', ins: '01 Clients/Doe-John/05 Insurance, Demands & Negotiation' };
    const docs = {
        RS05: { folder: 'police', title: 'Riverton County Crash Report', cms: 'Police' },
        RS20: { folder: 'ins', title: 'Keystone Acknowledgment Letter', cms: 'Others' },
        RS21: { folder: 'ins', title: 'Harbor Point Coverage Letter', cms: 'Others' },
        RS30: { folder: 'ins', title: 'Cardinal State Claim Letter', cms: 'Others' }
    };
    const D = { DRIVE_HOMES: HOMES, FOLDER_STANDARD: [], CLIENT_FOLDER: '01 Clients/Doe-John', fileType: (t) => String(t).replace(/\s+/g, '-'),
        kvOf: () => ({ get: async (k) => k === 'progress:t1' ? JSON.stringify({ data: { 'doc-filing': {
            RS05: { filed: true, name: 'LSH-2026-MVA-000098_doe-john_Police-Report_2026-11-16.pdf' },
            RS20: { filed: true, name: 'LSH-2026-MVA-000098_doe-john_Others_2026-11-16.pdf' },
            RS21: { filed: true, name: 'LSH-2026-MVA-000098_doe-john_Others_2026-11-16.pdf' },
            RS30: { filed: false, name: 'LSH-2026-MVA-000098_doe-john_Others_2026-11-17.pdf' } } } }) : null }) };

    const byName = await M.filedNames({}, D, 't1');
    if ((byName[M.looseFile('LSH-2026-MVA-000098_doe-john_Others_2026-11-16.pdf.pdf')] || []).join() !== 'RS20,RS21') fail(`the filing record's names should be read loosely, ".pdf.pdf" too: ${JSON.stringify(byName)}`);
    if (Object.values(byName).flat().includes('RS30')) fail('a document never filed in the CMS should not be matched by its name');

    const rec = { builtAt: '2026-11-12', rootId: 'root', folders: { [HOMES.police]: 'fPol', [HOMES.ins]: 'fIns' } };
    const listing = { files: {
        a1: { name: 'LSH-2026-MVA-000098_doe-john_Police-Report_2026-11-16.pdf.pdf', parent: 'fPol', mimeType: 'application/pdf' },
        a2: { name: 'LSH-2026-MVA-000098_doe-john_Others_2026-11-16.pdf.pdf', parent: 'fIns', mimeType: 'application/pdf' },
        a3: { name: 'LSH-2026-MVA-000098_doe-john_Others_2026-11-16.pdf', parent: 'fIns', mimeType: 'application/pdf' },
        a4: { name: 'LSH-2026-MVA-000098_doe-john_Others_2026-11-17.pdf', parent: 'fIns', mimeType: 'application/pdf' },
        a5: { name: 'notes', parent: 'fIns', mimeType: 'application/vnd.google-apps.document' }
    } };
    M.applyFound(rec, listing, docs, D, byName);
    const got = Object.fromEntries((rec.handFiled || []).map((h) => [h.id, h.docId]));
    if (got.a1 !== 'RS05') fail(`the Police Report saved under its filed name should be RS05: ${JSON.stringify(got)}`);
    if ([got.a2, got.a3].sort().join() !== 'RS20,RS21') fail(`two documents filed under one name should be one file each: ${JSON.stringify(got)}`);
    if (got.a4) fail(`a file under a name never filed in the CMS should stay unrecognised: ${JSON.stringify(got)}`);
    if (got.a5) fail('a Google Doc is written work, never a course document');
    const police = (rec.handFiled || []).find((h) => h.id === 'a1');
    if (!police || police.path !== HOMES.police || police.home !== HOMES.police) fail(`it should be read in its folder, which is its home: ${JSON.stringify(police)}`);

    // a code in the name still wins (RS01 named files, as before)
    const rec2 = { builtAt: '2026-11-12', rootId: 'root', folders: { [HOMES.police]: 'fPol' } };
    M.applyFound(rec2, { files: { b1: { name: 'LSH-2026-MVA-000098_Doe-John_RS05-Crash-Report_2026-11-12.pdf', parent: 'fPol', mimeType: 'application/pdf' } } }, docs, D, {});
    if (((rec2.handFiled || [])[0] || {}).docId !== 'RS05') fail('a file with its document code in its name should still be that document');

    if (fails.length) { console.log(`✗ Backup Drive files known by their filed names (${fails.length}):\n  ` + fails.join('\n  ')); process.exit(1); }
    console.log('Backup Drive: a course document saved under the name it was filed under in the CMS is that document (".pdf.pdf" too), two under one name are one each, a name never filed stays unknown, and a code in the name still wins.');
})().catch((e) => { console.log('✗ ' + ((e && e.stack) || e)); process.exit(1); });
