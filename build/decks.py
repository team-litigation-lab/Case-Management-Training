#!/usr/bin/env python3
"""Builds the lesson slides from the Case Management Training decks: each deck page becomes one slide.

    pip install pymupdf pillow
    python3 build/decks.py "<Day 1 PDF>" "<Day 2 PDF>" "<Day 3 PDF>" "<Day 4 PDF>" "<Day 5 PDF>"

The PDFs are the "Revised Case Management Training Day N" decks exported from Canva (Share → Download → PDF):
the PDF carries the decks' own fonts, so nothing reflows. Each page is written to decks/dayN/NN.webp (1920px
wide), and js/cm-decks-data.js gets each day's topics (the page runs below, following the decks' own
sections) and each page's title and words (the slide list, Presenter view, search, Listen and the alt text).
js/cm-decks.js turns them into the lesson slides. Change a topic's pages or title here, then run this again.
"""
import io, json, os, re, sys
import pymupdf
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WIDTH = 1920

# Each day: the opening pages (title and agenda), the topics (title, section, pages) and the closing page.
DECKS = {
    1: {"open": [1, 2], "close": [54], "topics": [
        ("What Case Management Is: the General Process & Key Duties", "Case Management Fundamentals", range(3, 6)),
        ("Understanding Case Phases", "Case Management Fundamentals", [6]),
        ("The Intake Phase", "Case Phase: Intake", [7, 8]),
        ("Intake and Initial Client Contact", "Case Phase: Intake", [9]),
        ("Case Acceptance Determination", "Case Phase: Intake", [10]),
        ("Common Intake Bottlenecks", "Case Phase: Intake", range(11, 17)),
        ("Tools for Case Planning: the PI Case Lifecycle", "Case Phase: Intake", [17]),
        ("Intake Bottlenecks: Communication Gaps", "Case Phase: Intake", [18]),
        ("Skill Building: the Intake Decision Challenge", "Case Phase: Intake", [19, 20]),
        ("Coverage Determination and Liability", "Case Phase: Claim Set Up", range(21, 25)),
        ("Case Planning Framework", "Case Phase: Claim Set Up", range(25, 29)),
        ("The Treatment Phase", "Case Phase: Treatment", range(29, 34)),
        ("Treatment Protocols and Red Flags", "Case Phase: Treatment", [34, 35]),
        ("Case Planning: Assessment, SMART Goals and Care Coordination", "Case Phase: Treatment", range(36, 39)),
        ("The Standard Treatment Map", "Case Phase: Treatment", range(39, 44)),
        ("Red Flags: the A-C-T Protocol and Course Correction", "Case Phase: Treatment", range(44, 48)),
        ("Treatment Gaps", "Case Phase: Treatment", [48, 49]),
        ("Common Treatment Bottlenecks and Challenges", "Case Phase: Treatment", [50, 51]),
        ("Skill Building: John Doe v. Apex Delivery Services", "Case Phase: Treatment", [52]),
        ("Skill Building: Handling Client Treatment", "Case Phase: Treatment", [53]),
    ]},
    2: {"open": [1, 2], "close": [44], "topics": [
        ("Pre-Demand Auditing: Core Objectives and the Auditing Checklist", "Pre-Demand Case Auditing", [3, 4]),
        ("The Master Audit Checklist", "Pre-Demand Case Auditing", range(5, 9)),
        ('The "Defense-Eye" Audit: Red Flag Detection', "Pre-Demand Case Auditing", [9]),
        ("Final Package Readiness", "Pre-Demand Case Auditing", [10]),
        ("Skill Building: Pre-Demand Case Audit", "Pre-Demand Case Auditing", [11, 12]),
        ("The Demand: Legal and Procedural Foundation", "Case Phase: Demand", [13]),
        ("The Policy Limit Mindset", "Case Phase: Demand", [14]),
        ("Case Manager Strategies and Demand Package Best Practice", "Case Phase: Demand", [15]),
        ("The Demand Packet Checklist and Quality Control", "Case Phase: Demand", [16, 17]),
        ('Negotiating the "First Call" and Best Practices', "Case Phase: Demand", [18, 19]),
        ("Skill Building: Real-Time Demand Audit", "Case Phase: Demand", [20]),
        ('Settlement Negotiations: the "Pitch"', "Settlement Negotiations", [21]),
        ("The Valuation Baseline", "Settlement Negotiations", range(22, 27)),
        ("Negotiations Initiated", "Settlement Negotiations", [27, 28]),
        ('Common Adjuster "Stall Tactics"', "Settlement Negotiations", [29]),
        ('Closing the Deal and the "Never" Rule', "Settlement Negotiations", [30, 31]),
        ("Skill Building: Settlement Negotiations", "Settlement Negotiations", [32]),
        ('BI Settlement: the UM/UIM "Safety Check" and Foundation', "Case Phase: BI Settlement", [33, 34]),
        ("BI Settlement: the Execution", "Case Phase: BI Settlement", range(35, 41)),
        ("Finalized Settlement", "Case Phase: BI Settlement", [41, 42]),
        ("Skill Building: BI Settlement", "Case Phase: BI Settlement", [43]),
    ]},
    3: {"open": [1, 2], "close": [41], "topics": [
        ("UM Demand: Why This Phase Matters and the Strategy", "Case Phase: UM Demand", [3, 4]),
        ("BI Exhaustion and Consent", "Case Phase: UM Demand", [5]),
        ("The UM Demand Package", "Case Phase: UM Demand", range(6, 9)),
        ("The UM Settlement: Negotiation and Settlement", "Case Phase: UM Settlement", range(9, 12)),
        ("UM Settlement Challenges", "Case Phase: UM Settlement", [12]),
        ("The Final Payout Process", "Case Phase: UM Settlement", [13]),
        ("Documents That Matter", "Case Phase: UM Settlement", range(14, 19)),
        ("Skill Building: UM Settlement", "Case Phase: UM Settlement", [19]),
        ("Common Types of Liens", "Case Phase: Lien Negotiations/Reduction", [20]),
        ("Key Legal Doctrines for Reduction and Quantum Meruit", "Case Phase: Lien Negotiations/Reduction", [21, 22]),
        ("Increasing the Client's Net and Auditing the Billing", "Case Phase: Lien Negotiations/Reduction", [23, 24]),
        ("The Net Sheet", "Case Phase: Lien Negotiations/Reduction", range(25, 30)),
        ('Skill Building: the "Doe v. Apex" Final Net Challenge', "Case Phase: Lien Negotiations/Reduction", [30]),
        ("Disbursement: Core Objectives and the Workflow", "Case Phase: Disbursement", [31, 32]),
        ("Documentation Checklist and Common Challenges", "Case Phase: Disbursement", [33, 34]),
        ("The Final Case Reconciliation Checklist", "Case Phase: Disbursement", range(35, 40)),
        ("Skill Building: Closing a Case", "Case Phase: Disbursement", [40]),
    ]},
    4: {"open": [1, 2], "close": [36], "topics": [
        ("Mediators and Arbitrators: Expertise, Selection and Decision-Making Power", "Introduction", range(3, 6)),
        ("Mediation Logistics and Scheduling", "Case Phase: Mediation", [6]),
        ("Preparing Mediation Binders", "Case Phase: Mediation", [7, 8]),
        ("What Goes Into a Mediation Binder", "Case Phase: Mediation", range(9, 15)),
        ("Quality Assurance and the Logistics Auditor", "Case Phase: Mediation", [15]),
        ("Skill Building: Mediation", "Case Phase: Mediation", range(16, 19)),
        ("The Anatomy of a PI Arbitration and the Operational Mindset", "Case Phase: Arbitration", [19, 20]),
        ("Operational Tracks", "Case Phase: Arbitration", [21, 22]),
        ("What You Can and Cannot Do at Hearings", "Case Phase: Arbitration", [23, 24]),
        ("Arbitration Binders and Documents That Matter", "Case Phase: Arbitration", range(25, 31)),
        ("Skill Building: Arbitration", "Case Phase: Arbitration", [31, 32]),
        ("Common Bottlenecks in Mediation and Arbitration", "Common Bottlenecks", range(33, 36)),
    ]},
    5: {"open": [1, 2], "close": [42], "topics": [
        ("The Case Manager's Tactical Role in Litigation", "Case Phase: Litigation", [3]),
        ("Phase-by-Phase Core Responsibilities", "Case Phase: Litigation", range(4, 8)),
        ("The Litigation Mindset: Critical Traps to Avoid", "Case Phase: Litigation", [8]),
        ("The Pre-Deposition Audit", "Case Phase: Litigation", [9]),
        ('Managing the "Discovery Intake Meeting"', "Case Phase: Litigation", range(10, 13)),
        ("Handling the Silent Traps: Mock Drills", "Case Phase: Litigation", [13, 14]),
        ("Preparing Your Client for a Deposition", "Case Phase: Litigation", range(15, 22)),
        ("The Litigation Toolkit: Core Documents and Critical Processes", "Case Phase: Litigation", range(22, 31)),
        ("The Advanced Litigation Workflow and Document Deep-Dive", "Case Phase: Litigation", range(31, 38)),
        ("Skill Building: the Ultimate Case Management Challenge", "Case Phase: Litigation", [38]),
        ("Property Damage and How It Affects a Case in Litigation", "Property Damage", range(39, 42)),
    ]},
}


def clean(t):
    return re.sub(r"\s+", " ", t.replace("​", "")).strip()


def page_info(p):
    """The page's title (its largest text below the section label, or the label itself) and its words."""
    lines = []
    for b in p.get_text("dict")["blocks"]:
        for l in b.get("lines", []):
            t = clean(" ".join(s["text"] for s in l["spans"]))
            if t:
                lines.append((round(max(s["size"] for s in l["spans"]), 1), t, l["bbox"][1]))
    sizes = sorted({s for s, _, _ in lines}, reverse=True)
    label = next((t for s, t, _ in lines if sizes and s == sizes[0]), "")
    sub = []
    for s, t, _ in sorted(lines, key=lambda x: x[2]):
        if len(sizes) > 1 and s == sizes[1] and t not in sub:
            sub.append(t)
    title = clean(" ".join(sub[:2])) if sub and len(" ".join(sub[:2])) < 90 else label
    # the decks draw each heading two or three times over (outline effects): say it once
    words = clean(p.get_text())
    for _ in range(3):   # a phrase repeated back to back (up to 10 words) is said once
        words = re.sub(r"\b((?:\S+ ){0,9}\S+)(?: \1\b)+", r"\1", words)
    return title.strip(" /"), label, words[:1600]


def main(pdfs):
    if len(pdfs) != 5:
        sys.exit(__doc__)
    data = {}
    for day, path in enumerate(pdfs, 1):
        doc = pymupdf.open(path)
        cfg = DECKS[day]
        used = set(cfg["open"]) | set(cfg["close"]) | {n for _, _, r in cfg["topics"] for n in r}
        missing = sorted(set(range(1, doc.page_count + 1)) - used)
        if missing:
            sys.exit(f"Day {day}: pages {missing} are in no topic")
        out = os.path.join(ROOT, "decks", f"day{day}")
        os.makedirs(out, exist_ok=True)
        pages = {}
        for n in range(1, doc.page_count + 1):
            p = doc[n - 1]
            pix = p.get_pixmap(matrix=pymupdf.Matrix(WIDTH / p.rect.width, WIDTH / p.rect.width))
            img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
            img.save(os.path.join(out, f"{n:02d}.webp"), "WEBP", quality=80, method=6)
            title, label, words = page_info(p)
            pages[n] = {"t": title, "s": label, "w": words}
        data[day] = {
            "pages": pages, "open": cfg["open"], "close": cfg["close"],
            "topics": [{"h": h, "section": s, "pages": list(r)} for h, s, r in cfg["topics"]],
            "w": WIDTH, "h": round(WIDTH * doc[0].rect.height / doc[0].rect.width),
        }
        print(f"Day {day}: {doc.page_count} pages, {len(cfg['topics'])} topics")
    js = ("/* Built by build/decks.py from the Case Management Training decks: each day's topics (pages of its deck)\n"
          "   and each page's title and words. Don't edit by hand: change build/decks.py and run it again. */\n"
          "window.CM_DECKS = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
    with open(os.path.join(ROOT, "js", "cm-decks-data.js"), "w") as f:
        f.write(js)


if __name__ == "__main__":
    main(sys.argv[1:])
