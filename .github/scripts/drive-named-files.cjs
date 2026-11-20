// @check node — A course document backed up under the firm's file name (<Case ID>_<Last-First>_<Type>_<date>: no document code or title in it) is recognised from the drive alone, by its Type and the firm's folder it sits in at any depth, never from the CMS; one file is one document, a code in the name still wins, and a convention name in the wrong folder isn't guessed at
// worker-drive-found.js applyFound / typeOfName. Before, a file was known only by a code (RS01) or its title in its name,
// so trainees who named their files the way the course teaches (…_Medical-Records_2026-11-16.pdf) had every day after
// Day 1 at 0% on the Backup Drive although the documents were in their folders. The owner: the Backup Drive is graded on
// the drive links, not on the CMS (a separate grader), so nothing here reads the trainee's CMS filing.
// Usage: node .github/scripts/drive-named-files.cjs
'use strict';
const path = require('path');
const { pathToFileURL } = require('url');

(async () => {
    const M = await import(pathToFileURL(path.join(__dirname, '../../worker-drive-found.js')).href);
    const fails = [], fail = (m) => fails.push(m);
    const HOMES = { medical: '01 Clients/Doe-John/03 Medical Records', bills: '01 Clients/Doe-John/04 Bills & Invoices', liens: '01 Clients/Doe-John/06 Liens & Settlement' };
    const docs = {
        RS12: { folder: 'medical', title: 'Riverton Urgent Care Visit Note', cms: 'Medical' },
        RS13: { folder: 'medical', title: 'Riverton Spine and Rehab Evaluation', cms: 'Medical' },
        RS15: { folder: 'medical', title: 'Lakeside Orthopedics Consult', cms: 'Medical' },
        RS16: { folder: 'medical', title: 'Cervical MRI Report', cms: 'Medical' },
        RS25: { folder: 'bills', title: 'Summit Imaging Invoice', cms: 'Invoices' },
        RS41: { folder: 'liens', title: 'Peach State Reduction Acceptance', cms: 'Others' },
        RS42: { folder: 'liens', title: 'Riverton Spine Payoff Letter', cms: 'Others' }
    };
    let kvRead = 0;
    const D = { DRIVE_HOMES: HOMES, FOLDER_STANDARD: [], CLIENT_FOLDER: '01 Clients/Doe-John', DRIVE_DAY_DOCS: { 2: ['RS12', 'RS13', 'RS15', 'RS25'], 3: ['RS16'], 4: ['RS41', 'RS42'] },
        fileType: (t) => String(t || '').trim().replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),   // worker.js fileType
        kvOf: () => ({ get: async () => { kvRead++; return null; } }) };

    if (M.typeOfName('LSH-2026-MVA-000098_Doe-John_Medical-Records_2026-11-16.pdf.pdf') !== 'medicalrecords') fail('the Type should be read from a convention name, ".pdf.pdf" too');
    if (M.typeOfName('visit note final.pdf') !== '') fail('a name outside the convention has no Type');
    if (M.typeOfName('A_B_Others_16-11-2026.pdf') !== '') fail('a date not written year first is not the convention');

    const FOLDERS = { fMed: { name: '03 Medical Records', parent: 'root' }, fBill: { name: '04 Bills & Invoices', parent: 'root' }, fLien: { name: '06 Liens & Settlement', parent: 'root' },
        fDay: { name: 'Day 2', parent: 'fMed' }, fDr: { name: 'Drafts', parent: 'fDay' }, fScr: { name: 'Scratch', parent: 'root' } };
    const rec = { builtAt: '2026-11-12', rootId: 'root', folders: { [HOMES.medical]: 'fMed', [HOMES.bills]: 'fBill', [HOMES.liens]: 'fLien' } };
    const N = (t, d) => `LSH-2026-MVA-000098_Doe-John_${t}_${d}.pdf`;
    const listing = { folders: FOLDERS, files: {
        a1: { name: N('Medical-Records', '2026-11-16'), parent: 'fMed', mimeType: 'application/pdf' },
        a2: { name: N('Medical-Records', '2026-11-16') + '.pdf', parent: 'fMed', mimeType: 'application/pdf' },
        a3: { name: N('medical-records', '2026-11-17'), parent: 'fDr', mimeType: 'application/pdf' },      // two folders down 03
        a4: { name: 'LSH-2026-MVA-000098_Doe-John_RS15-Lakeside-Consult_2026-11-12.pdf', parent: 'fBill', mimeType: 'application/pdf' },   // a code: RS15, in the wrong folder
        a5: { name: N('Invoices', '2026-11-16'), parent: 'fBill', mimeType: 'application/pdf' },
        a6: { name: N('Others', '2026-11-18'), parent: 'fMed', mimeType: 'application/pdf' },             // Others in 03: no Others belongs there
        a7: { name: N('Medical-Records', '2026-11-18'), parent: 'fScr', mimeType: 'application/pdf' },    // outside the firm's folders
        a8: { name: N('Others', '2026-11-19'), parent: 'fLien', mimeType: 'application/pdf' },
        a9: { name: 'notes', parent: 'fMed', mimeType: 'application/vnd.google-apps.document' }
    } };
    M.applyFound(rec, listing, docs, D);
    const got = Object.fromEntries((rec.handFiled || []).map((h) => [h.id, h.docId]));
    if (got.a4 !== 'RS15') fail(`a code in the name should still win, wherever it is: ${JSON.stringify(got)}`);
    const med = [got.a1, got.a2, got.a3].sort().join();
    if (med !== 'RS12,RS13,RS16') fail(`three Medical-Records files in 03 (one two folders down) should be three medical documents, never the one a code already took (RS15): ${med}`);
    if (got.a1 !== 'RS12' || got.a2 !== 'RS13') fail(`the earliest graded day's documents should be accounted for first, one file each: ${JSON.stringify(got)}`);
    if (got.a5 !== 'RS25') fail(`an Invoices file in 04 should be the invoice: ${JSON.stringify(got)}`);
    if (got.a6) fail(`a convention name in a folder no document of its Type belongs in should not be guessed at: ${got.a6}`);
    if (got.a7) fail(`a file outside the firm's folders should not be guessed at: ${got.a7}`);
    if (got.a8 !== 'RS41') fail(`an Others file in 06 should be the first lien document: ${JSON.stringify(got)}`);
    if (got.a9) fail('a Google Doc is written work, never a course document');
    const deep = (rec.handFiled || []).find((h) => h.id === 'a3');
    if (!deep || deep.path !== HOMES.medical || deep.home !== HOMES.medical) fail(`the file two folders down 03 should be read in 03, its home: ${JSON.stringify(deep)}`);
    const wrong = (rec.handFiled || []).find((h) => h.id === 'a4');
    if (!wrong || wrong.path !== HOMES.bills || wrong.home !== HOMES.medical) fail(`the coded file in 04 should be read in 04, its home 03 (the wrong-folder note): ${JSON.stringify(wrong)}`);

    // the platform's own copies are never the trainee's filing
    const rec2 = { builtAt: '2026-11-12', rootId: 'root', folders: rec.folders, saved: [{ id: 'p1', docId: 'RS12' }] };
    M.applyFound(rec2, { folders: FOLDERS, files: { p1: { name: N('Medical-Records', '2026-11-12'), parent: 'fMed', mimeType: 'application/pdf' } } }, docs, D);
    if ((rec2.handFiled || []).length) fail(`the platform's own copy should not be counted as filed by hand: ${JSON.stringify(rec2.handFiled)}`);

    // the drive alone: nothing reads the trainee's records (the CMS is a separate grader)
    const listed = { folders: FOLDERS, files: { z1: { name: N('Invoices', '2026-11-16'), parent: 'fBill', mimeType: 'application/pdf' } } };
    const rec3 = { builtAt: '2026-11-12', rootId: 'root', folders: rec.folders };
    await M.driveFind({}, Object.assign({}, D, { DRIVE_DOC: { RS25: ['bills', 'Summit Imaging Invoice', 'Invoices'] }, driveList: async () => listed }), 't1', rec3);
    if (kvRead) fail(`grading the drive read ${kvRead} stored record(s): the Backup Drive is graded from the drive alone`);
    if (((rec3.handFiled || [])[0] || {}).docId !== 'RS25') fail(`driveFind should recognise the convention-named invoice: ${JSON.stringify(rec3.handFiled)}`);

    if (fails.length) { console.log(`✗ Backup Drive files known by the firm's names (${fails.length}):\n  ` + fails.join('\n  ')); process.exit(1); }
    console.log('Backup Drive: a document backed up under the firm\'s name is known from the drive alone, by its Type and its firm folder at any depth, one file each; a code still wins, and a name in the wrong folder or outside the firm\'s folders isn\'t guessed at. Nothing reads the CMS.');
})().catch((e) => { console.log('✗ ' + ((e && e.stack) || e)); process.exit(1); });
