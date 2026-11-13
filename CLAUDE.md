# Working in this repository

Several branches (and Claude sessions) work on this course at once. Keep out of each other's way:

- **Never write or bump a version on a script or stylesheet** (`<script src="/js/x.js?v=3">`). Write `<script src="/js/x.js">`. The Worker stamps every one with its content fingerprint as it serves the page (`worker.js` `stampAssets`), and `.github/scripts/check-site.mjs` fails a page with a hand-written `?v=`.
- **Bring `main` into your branch with `node .github/scripts/merge-main.mjs`**, not a bare `git merge`. It rebuilds the generated files instead of merging them, settles script-list and `?v=` conflicts, runs the node checks and commits; only real conflicts are left, listed. Then push.
- **Never edit a generated file by hand**: `js/cm-case-flow-slides.js`, `js/cm-case-flow-scripts.js`, `js/cm-case-flow-sim.js`, `js/cm-case-flow-exhibits.js`, `js/cm-companion-cases.js` and `curriculum/5-day-flow/*`. Edit the sources under `build/case-flow/` (or `js/cm-case-flow-data.js`) and run `node build/case-flow/build.cjs`.
- **A new check is a new file** in `.github/scripts/` with `// @check node — what it checks` (or `// @check browser — …`) near its top. Don't add steps to `.github/workflows/checks.yml`: `run-checks.mjs` finds every check that declares itself.
- **Add, don't append in the same spot**: put a new CSS rule, script tag or list entry next to the feature it belongs to rather than at the very end of a shared block, so two branches don't both add a line at the same place.
- **A new feature is a new file in `js/`** that wraps the globals it needs. Keep edits to the shared files (`index.html`, `worker.js`, `js/cm-case-flow.js`, `js/cm-updates.js`) as small as they can be, and put its `<script>` tag where its name sorts among the add-on scripts near the end of `index.html`.
- **Progress keys a feature saves are registered from its own file**: `registerPersonalKeys(["my-key"])`. Don't edit the `PERSONAL_KEYS` list in `index.html`.
- **In a list that sits on one long line** (the Worker's `PUBLIC_READ`, `PROTECTED_TRAINEE_FIELDS`), add your item and nothing else on that line: no reordering, no reformatting.
- **When both sides changed the same lines, keep both changes.** Never drop the other side's work to make a merge go through.
- **A browser check must pass in the open-source Chromium that CI runs**, which cannot play H.264/AAC video (an `.mp4`) or speak (no speech voices): check that the file is served, its captions and its controls, and playback only where `canPlayType` says the browser can. Run the whole suite before pushing, not only your own check.
- Before pushing: `node .github/scripts/run-checks.mjs node` (and `node .github/scripts/run-checks.mjs browser` if you changed what a page does).

## The course

- Five Case Flow days on one file, *John Doe v. Robert Smith*. Each day is four hours: a refresher at 30% lessons and 70% practical; the mediation and arbitration lessons are taught in full; Day 5's practical is the Full Application Practice (the trainee builds their companion case).
- Every slide fits one screen at 1366×768 and 1920×1080 (`fit.cjs`). Type on the slides is bold and at least 16px on a laptop; LSH navy `#1E2340` and orange `#DB8437`.
- Trainers run the room from 🖥 Presenter view (the speaker notes sit beside the slide). Admin is in sections: 🏅 Scorecard (scores only), 🛡 Admin Master Control, 🔓 Open Lessons.
