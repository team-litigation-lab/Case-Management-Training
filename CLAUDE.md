# Working in this repository

Several branches (and Claude sessions) work on this course at once. Keep out of each other's way:

- **Never write or bump a version on a script or stylesheet** (`<script src="/js/x.js?v=3">`). Write `<script src="/js/x.js">`. The Worker stamps every one with its content fingerprint as it serves the page (`worker.js` `stampAssets`), and `.github/scripts/check-site.mjs` fails a page with a hand-written `?v=`.
- **Bring `main` into your branch with `node .github/scripts/merge-main.mjs`**, not a bare `git merge`. It rebuilds the generated files instead of merging them, settles script-list and `?v=` conflicts, runs the node checks and commits; only real conflicts are left, listed. Then push.
- **Never edit a generated file by hand**: `js/cm-case-flow-slides.js`, `js/cm-case-flow-scripts.js`, `js/cm-case-flow-sim.js`, `js/cm-case-flow-exhibits.js`, `js/cm-companion-cases.js` and `curriculum/5-day-flow/*`. Edit the sources under `build/case-flow/` (or `js/cm-case-flow-data.js`) and run `node build/case-flow/build.cjs`.
- **A new check is a new file** in `.github/scripts/` with `// @check node — what it checks` (or `// @check browser — …`) near its top. Don't add steps to `.github/workflows/checks.yml`: `run-checks.mjs` finds every check that declares itself.
- **Add, don't append in the same spot**: put a new CSS rule, script tag or list entry next to the feature it belongs to rather than at the very end of a shared block, so two branches don't both add a line at the same place.
- Before pushing: `node .github/scripts/run-checks.mjs node` (and `node .github/scripts/run-checks.mjs browser` if you changed what a page does).
