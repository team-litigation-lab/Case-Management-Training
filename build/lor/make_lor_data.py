#!/usr/bin/env python3
"""Builds js/cm-lor-data.js from the three files the trainers sent for the LOR Drafting tool
(the same three files used for Foundational-Training's LOR Drafting Activity: build/lor/source/).

Usage:
  python3 build/lor/make_lor_data.py build/lor/source/Case_Notes_For_Drafting_Activity_SA_Demo.docx \
      build/lor/source/1P_LOR.docx build/lor/source/3P_LOR_with_Affidavit.docx

The two letter templates are read block by block, exactly as Word has them, so the firm's wording is
carried over untouched. The only thing the tool treats specially is what the firm highlighted in
yellow: each highlighted run becomes a field the trainee fills in. Three of them are not ordinary
fields (see k= below), per the trainers' instructions (LOR DRAFTING ACTIVITIES):
  - the letter's date is auto-generated (the current date, the date the letter is drafted)
  - the "SENT VIA FACSIMILE ..." line is typed by hand rather than offered as a placeholder
  - a highlighted run longer than a line becomes a textarea
Everything else in the templates is the firm's own text and is never changed here.

Re-run this whenever the trainers send new templates or new case notes; never hand-edit the output.
"""
import json, sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from drafting_docx import template
import re
import xml.etree.ElementTree as ET
from drafting_docx import W, body_of


def cases(path):
    """The case notes: one case per "For 1P LOR Drafting" heading, with the 3P set that follows it."""
    out, cur, side = [], None, None
    for p in body_of(path).iter(W + "p"):
        line = re.sub(r"\s+", " ", "".join(t.text or "" for t in p.iter(W + "t"))).strip()
        m = re.match(r"^For (1P|3P) LOR Drafting$", line)
        if m:
            side = m.group(1)
            if side == "1P": cur = {"p1": {}, "p3": {}}; out.append(cur)
            continue
        if line.startswith("•") and cur and side and ":" in line:
            k, v = line[1:].split(":", 1)
            cur["p1" if side == "1P" else "p3"][k.strip()] = v.strip().rstrip(".")
    return out


def main(notes, p1, p3, dest="js/cm-lor-data.js"):
    cs = cases(notes)
    ts = [template(p1, "lor1p", "Activity 1: Letter of Representation / LOR Drafting for 1P",
                   "INS – 1P Insurance Provider - LOR mm.dd.yyyy (VA's name)"),
          template(p3, "lor3p", "Activity 2: Letter of Representation (LOR) Drafting for 3P",
                   "INS – 3P Insurance Provider - LOR with Affidavit mm.dd.yyyy (VA's name)")]
    if not cs: sys.exit("No cases found in " + notes)
    for t in ts:
        if not any(r.get("f") for b in t["blocks"] if b["t"] == "p" for r in b["runs"]):
            sys.exit("No highlighted fields found in " + t["id"] + ": is the template still highlighted in yellow?")
    head = open(__file__.replace("make_lor_data.py", "header.txt"), encoding="utf8").read()
    js = (head + "window.CM_LOR_CASES = " + json.dumps(cs, ensure_ascii=False, separators=(",", ":")) + ";\n"
          + "window.CM_LOR_TEMPLATES = " + json.dumps(ts, ensure_ascii=False, separators=(",", ":")) + ";\n")
    open(dest, "w", encoding="utf8").write(js)
    print("%s: %d cases, %d fields" % (dest, len(cs),
          sum(1 for t in ts for b in t["blocks"] if b["t"] == "p" for r in b["runs"] if r.get("f"))))


if __name__ == "__main__":
    if len(sys.argv) < 4: sys.exit(__doc__)
    main(*sys.argv[1:])
