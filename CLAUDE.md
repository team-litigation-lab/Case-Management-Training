# Case Management Training: rules for every session

Several sessions work on this repository at once, and their pull requests are merged one after another. These rules
keep them from conflicting with each other. CI enforces the first one.

## No conflicts

1. **Never put a `?v=` version on a local script or stylesheet tag** (`<script src="/js/x.js">`, no `?v=3`).
   Every pull request used to bump the same version lines in `index.html`, so every pair of pull requests conflicted.
   The site's files are served `Cache-Control: max-age=0, must-revalidate` with an ETag, so a browser always gets the
   newest copy without one. `node .github/scripts/check-site.mjs` fails on a `?v=`.
2. **A new CI check is a new file in `.github/scripts/auto/`** (see its README). CI runs every `*.cjs` there by
   itself. Don't add a step to `.github/workflows/checks.yml`.
3. **A new feature is a new file in `js/`** that wraps the globals it needs. Keep edits to shared files
   (`index.html`, `worker.js`, `js/cm-case-flow.js`, `js/cm-updates.js`) as small as they can be.
4. **A new `<script>` tag goes where its name sorts** among the add-on scripts near the end of `index.html`
   (alphabetical within its block), not at the end of the list, so two new tags rarely land on the same line.
5. **Progress keys a feature saves are registered from its own file**: `registerPersonalKeys(["my-key"])`. Don't
   edit the `PERSONAL_KEYS` list in `index.html`.
6. **In a list that sits on one long line** (the Worker's `PUBLIC_READ`, `PROTECTED_TRAINEE_FIELDS`), add your item
   and nothing else on that line: no reordering, no reformatting.
7. **Before you push, merge `origin/main` into your branch** and run the checks. When both sides changed the same
   lines, keep both changes; never drop the other side's work to make the merge go through.

## Checks

- `node .github/scripts/check-site.mjs` (syntax, local files, no `?v=`).
- `node build/case-flow/build.cjs --quiet` must leave `git status` clean: the slides, trainer scripts, simulation and
  curriculum files are generated from the lesson data. Run `node build/case-flow/terms.cjs` first if you changed
  lesson text (defined terms are capitalized the firm's way).
- Browser checks need `node .github/scripts/server.mjs 8787` running and Playwright on `NODE_PATH`:
  `node .github/scripts/<check>.cjs http://localhost:8787/`. Every slide must fit one screen
  (`fit.cjs`, at 1366×768 and 1920×1080).

## The course

- Five Case Flow days on one file, *John Doe v. Robert Smith*. Each day is four hours: a refresher at 30% lessons and
  70% practical; the mediation and arbitration lessons are taught in full; Day 5's practical is the Full Application
  Practice (the trainee builds their companion case).
- Type on the slides is bold and at least 16px on a laptop; LSH navy `#1E2340` and orange `#DB8437`.
- Trainers run the room from 🖥 Presenter view (the speaker notes sit beside the slide). Admin is in sections:
  🏅 Scorecard (scores only), 🛡 Admin Master Control, 🔓 Open Lessons.
