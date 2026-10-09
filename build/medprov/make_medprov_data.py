#!/usr/bin/env python3
"""Builds js/cm-medprov-data.js from the provider-and-lien-holder letter templates the trainers
sent, organized one folder per medical provider (build/medprov/source/<Provider>/…).

Usage:
  python3 build/medprov/make_medprov_data.py build/medprov/source

Each provider folder holds a "Lien BV v2…docx" (lien balance verification request) and/or a
"MedLOR with Unsworn COR…docx" (medical Letter of Representation + records request, with the
Unsworn Declaration of Custodian of Records attached). Both are read block by block, exactly as
Word has them, so the firm's wording — including each provider's own address block — is carried
over untouched. The only thing the tool treats specially is what the firm highlighted in yellow
(the letter's date, the "SENT VIA …" line, and the client's identifying details): each highlighted
run becomes a field the trainee fills in; everything else, including the Unsworn Declaration the
*provider's* custodian of records completes, stays fixed text exactly as the firm sent it.

The one HITECH Request example (Apache Health Center — no provider sent more than one) is not
parsed here: build/medprov/hitech.json is a hand-authored block list (see that file's own notes)
copied into the output verbatim, since the source .docx has no highlighting to key off of.

Re-run this whenever the trainers send new or additional provider letters; never hand-edit the output.
"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from drafting_docx import template

LIEN_GLOB = re.compile(r"^lien.*\.docx$", re.I)
MEDLOR_GLOB = re.compile(r"^medlor.*\.docx$", re.I)


def slug(name):
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return re.sub(r"-{2,}", "-", s)


def find_leaf_dirs(root):
    """A provider folder: holds .docx files directly and has no subfolders of its own.
       "Nevada Personal Injury Management/Dr. X" is a provider; the "Nevada Personal Injury
       Management" container above it, which has no .docx of its own, is not."""
    leaves = []
    for dirpath, dirnames, filenames in os.walk(root):
        docx = [f for f in filenames if f.lower().endswith(".docx")]
        subdirs = [d for d in dirnames if os.path.isdir(os.path.join(dirpath, d))]
        if docx and not subdirs:
            leaves.append((dirpath, docx))
    return sorted(leaves)


def display_name(root, dirpath):
    rel = os.path.relpath(dirpath, root)
    return " — ".join(rel.split(os.sep)) if rel != "." else os.path.basename(dirpath)


def provider(root, dirpath, files):
    name = display_name(root, dirpath)
    pid = slug(name)
    letters = {}
    for f in files:
        full = os.path.join(dirpath, f)
        if LIEN_GLOB.match(f):
            letters["lienbv"] = template(full, "lienbv", "Lien Balance Verification",
                                          "MED – " + name + " - Lien BV mm.dd.yyyy (VA's name)")["blocks"]
        elif MEDLOR_GLOB.match(f):
            letters["medlor"] = template(full, "medlor", "Medical LOR with Unsworn Declaration",
                                          "MED – " + name + " - MedLOR mm.dd.yyyy (VA's name)")["blocks"]
    return {"id": pid, "name": name, "letters": letters}


def main(source_dir, dest="js/cm-medprov-data.js"):
    leaves = find_leaf_dirs(source_dir)
    if not leaves: sys.exit("No provider folders with .docx files found under " + source_dir)
    providers = [provider(source_dir, d, files) for d, files in leaves]
    providers.sort(key=lambda p: p["name"])
    for p in providers:
        if not p["letters"]: sys.exit("No letters found for provider " + p["name"])
        for kind, blocks in p["letters"].items():
            if not any(r.get("f") for b in blocks if b["t"] == "p" for r in b["runs"]):
                sys.exit("No highlighted fields found in %s's %s: is it still highlighted in yellow?" % (p["name"], kind))
    hitech_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hitech.json")
    hitech = json.load(open(hitech_path, encoding="utf8"))
    head = open(__file__.replace("make_medprov_data.py", "header.txt"), encoding="utf8").read()
    js = (head + "window.CM_MEDPROV_PROVIDERS = " + json.dumps(providers, ensure_ascii=False, separators=(",", ":")) + ";\n"
          + "window.CM_MEDPROV_HITECH = " + json.dumps(hitech, ensure_ascii=False, separators=(",", ":")) + ";\n")
    open(dest, "w", encoding="utf8").write(js)
    n_fields = sum(1 for p in providers for blocks in p["letters"].values()
                   for b in blocks if b["t"] == "p" for r in b["runs"] if r.get("f"))
    print("%s: %d providers, %d fields" % (dest, len(providers), n_fields))


if __name__ == "__main__":
    if len(sys.argv) < 2: sys.exit(__doc__)
    main(*sys.argv[1:])
