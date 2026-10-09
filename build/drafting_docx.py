"""Shared .docx block/highlight parser for the Drafting Tools generators (build/lor/, build/medprov/).

Reads a Word letter template block by block, exactly as Word has it, so the firm's wording carries
over untouched. The only thing a drafting tool treats specially is what the firm highlighted in
yellow: each highlighted run becomes a field the trainee fills in. Three of them are not ordinary
fields (see k= below):
  - the letter's date (the first paragraph) is auto-generated — the current date, the date drafted
  - a "SENT VIA ..." line is typed by hand rather than offered as a placeholder
  - a highlighted run longer than a line becomes a textarea
Everything else is the firm's own text and is never changed here.
"""
import zipfile
import xml.etree.ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
LONG_FIELD = 120          # a highlighted run longer than this is a textarea, not a one-line field


def body_of(path):
    with zipfile.ZipFile(path) as z:
        return ET.fromstring(z.read("word/document.xml")).find(W + "body")


def runs_of(p):
    """Every run of a paragraph, in document order — including runs Word wrapped in <w:sdt>."""
    out = []
    for r in p.iter(W + "r"):
        rPr = r.find(W + "rPr")
        hl = bold = False
        if rPr is not None:
            h = rPr.find(W + "highlight")
            hl = h is not None and (h.get(W + "val") or "none") != "none"
            bold = rPr.find(W + "b") is not None
        txt = ""
        for node in r:
            tag = node.tag.replace(W, "")
            if tag == "t": txt += node.text or ""
            elif tag == "tab": txt += "\t"
            elif tag == "br": txt += "\n"
            elif tag == "sym": txt += "☐"        # a Wingdings box → ☐
        if txt: out.append({"hl": hl, "b": bold, "x": txt})
    # Word splits a line into many runs as it is edited: join the neighbours that look the same,
    # so one highlighted phrase is one field rather than five.
    merged = []
    for r in out:
        if merged and merged[-1]["hl"] == r["hl"] and merged[-1]["b"] == r["b"]: merged[-1]["x"] += r["x"]
        else: merged.append(dict(r))
    return merged


def template(path, tid, title, naming, manual_prefix="SENT VIA"):
    """Parse one .docx into {id, title, naming, blocks}. A highlighted run becomes a field;
    everything else stays the firm's own fixed wording."""
    blocks, n = [], 0
    for i, child in enumerate(body_of(path)):
        tag = child.tag.replace(W, "")
        if tag == "tbl":
            blocks.append({"t": "tbl", "rows": [
                [" ".join("".join(x["x"] for x in runs_of(p)) for p in tc.iter(W + "p")).strip()
                 for tc in tr.findall(W + "tc")] for tr in child.findall(W + "tr")]})
            continue
        if tag != "p": continue
        runs = []
        for r in runs_of(child):
            if not r["hl"]:
                runs.append({"x": r["x"], "b": True} if r["b"] else {"x": r["x"]})
                continue
            n += 1
            if i == 0: k = "date"
            elif r["x"].strip().upper().startswith(manual_prefix): k = "manual"
            elif len(r["x"]) > LONG_FIELD: k = "long"
            else: k = "field"
            runs.append({"f": "f%d" % n, "ph": r["x"], "k": k})
        blk = {"t": "p", "runs": runs}
        pPr = child.find(W + "pPr")
        if pPr is not None:
            if pPr.find(W + "numPr") is not None: blk["n"] = 1
            jc = pPr.find(W + "jc")
            if jc is not None and jc.get(W + "val") == "center": blk["c"] = 1
        blocks.append(blk)
    return {"id": tid, "title": title, "naming": naming, "blocks": blocks}
