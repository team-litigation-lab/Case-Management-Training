# Checks that run by themselves

Every `*.cjs` file in this folder is run by CI (`.github/workflows/checks.yml`, the step "Every check in
.github/scripts/auto/"), in name order, as `node <file> http://localhost:8787/` with the test server
(`.github/scripts/server.mjs`) already running and Playwright on `NODE_PATH`.

**A new check goes here, as its own file. Don't add a step to `checks.yml`:** two pull requests that each add a step
at the same place conflict; two that each add a file here never do.

- Exit 0 and print what was checked when it passes; exit 1 with a numbered list of failures when it doesn't.
- A check that needs no browser just ignores the URL.
- `require('../sign-in.cjs')` signs a trainee in.
- Leave the shared server as you found it: end any ring, random task or other shared record your check starts.
