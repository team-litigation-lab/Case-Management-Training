#!/usr/bin/env python3
"""The first-page thumbnails of the John Doe v. Robert Smith case documents: documents/<file>.pdf (from render.cjs) ->
decks/cf-docs/RSNN.webp, 600 x 776 (US Letter at 600 px wide), the image a Skill Activity's Your Case slide shows
for each document it works from.
  python3 build/case-flow/documents/thumbs.py            make every thumbnail that is missing
  python3 build/case-flow/documents/thumbs.py RS61 RS62  make (or remake) only these
Needs pdftoppm (poppler) and Pillow with WebP. Run it after render.cjs, locally; CI only checks every document has one
(.github/scripts/check-data.mjs). Page 1 is rendered at twice the size and scaled down, which keeps the text crisp."""
import json, os, subprocess, sys, tempfile
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
OUT, W, H = os.path.join(ROOT, "decks/cf-docs"), 600, 776

def manifest():
    js = 'global.window={};require("./js/cm-case-flow-docs.js");console.log(JSON.stringify(window.CM_CF_DOCS.map(d=>[d.id,d.file])))'
    return json.loads(subprocess.run(["node", "-e", js], cwd=ROOT, check=True, capture_output=True, text=True).stdout)

def thumb(pdf, out):
    with tempfile.TemporaryDirectory() as d:
        subprocess.run(["pdftoppm", "-f", "1", "-l", "1", "-png", "-scale-to-x", str(W * 2), "-scale-to-y", str(H * 2),
                        pdf, os.path.join(d, "p")], check=True)
        png = next(f for f in os.listdir(d) if f.endswith(".png"))
        Image.open(os.path.join(d, png)).convert("RGB").resize((W, H), Image.LANCZOS).save(out, "WEBP", quality=80, method=6)

want = sys.argv[1:]
made = 0
for doc_id, f in manifest():
    out = os.path.join(OUT, doc_id + ".webp")
    if want and doc_id not in want: continue
    if not want and os.path.exists(out): continue
    pdf = os.path.join(ROOT, "documents", f[:-5] + ".pdf" if f.endswith(".docx") else f)
    if not os.path.exists(pdf): print(f"{doc_id}: no PDF ({os.path.relpath(pdf, ROOT)}); run render.cjs first"); continue
    thumb(pdf, out); made += 1
    print(f"{doc_id}: decks/cf-docs/{doc_id}.webp")
print(f"{made} thumbnail(s) made.")
