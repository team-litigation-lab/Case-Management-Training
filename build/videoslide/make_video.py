#!/usr/bin/env python3
"""Narrated video slides: a Canva deck PDF + speaker notes -> one MP4, the AI voice reading each slide's notes.

    python3 build/videoslide/make_video.py --deck Day1.pdf --notes build/videoslide/day1.json \
        --voice en_US-lessac-high.onnx --out out/day1

Needs: pdftoppm (poppler), ffmpeg, and Piper (`pip install piper-tts`, a free neural voice that runs offline).
Voices: https://huggingface.co/rhasspy/piper-voices (download the .onnx and its .onnx.json side by side).

In the trainer's own voice: --clone my-voice.wav (10-30 s of them speaking, clean) in place of --voice, with
Chatterbox (`pip install chatterbox-tts`, MIT, offline). Without a GPU it voices about 1 s of audio per 5 s.

Writes, in --out:
  <name>.mp4  1920x1080 H.264 + AAC, one chapter per slide, captions as a subtitle track (turn on CC)
  <name>.srt / <name>.vtt  the captions on their own (for an LMS or YouTube upload)
  audio/slide-NN.wav  each slide's narration, if you want to drop it into PowerPoint or Canva instead

The notes file (dayN.json) is the source: edit a slide's "notes" and run this again. "say" maps a term as it is
written (captions keep it) to how the voice should say it (PIP -> "P I P").
"""
import argparse, hashlib, json, os, re, subprocess, sys, wave
from pathlib import Path

SILENCE_BETWEEN = 0.35   # seconds between sentences
LEAD_IN = 0.8            # the slide shows before the voice starts
TAIL = 1.4               # and stays after it stops


def sentences(text):
    parts = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9"“])', text.strip())
    return [p.strip() for p in parts if p.strip()]


def spoken(text, say):
    for k in sorted(say, key=len, reverse=True):
        text = re.sub(r'(?<![\w/])' + re.escape(k) + r'(?![\w/])', say[k], text)
    return text


def ts(t, sep=","):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02}{sep}{ms:03}"


def caption_lines(sentence, limit=84):
    """Long sentences are captioned in pieces of ~limit chars, split at commas/colons where possible."""
    if len(sentence) <= limit:
        return [sentence]
    out, cur = [], ""
    for w in re.split(r'(?<=[,;:])\s+|\s+', sentence):
        if cur and len(cur) + 1 + len(w) > limit:
            out.append(cur); cur = w
        else:
            cur = (cur + " " + w).strip()
        if cur.endswith((",", ";", ":")) and len(cur) > limit * 0.55:
            out.append(cur); cur = ""
    if cur:
        out.append(cur)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--deck", required=True)
    ap.add_argument("--notes", required=True)
    ap.add_argument("--voice", help="a Piper voice (.onnx)")
    ap.add_argument("--clone", help="instead of --voice: a 10-30 s recording of the narrator; their voice is cloned "
                    "with Chatterbox (pip install chatterbox-tts; slow without a GPU)")
    ap.add_argument("--out", required=True)
    ap.add_argument("--name", default=None)
    ap.add_argument("--rate", type=float, default=1.0, help="speaking speed: 1.1 is 10%% faster")
    ap.add_argument("--only", default=None, help="e.g. 1-5: build just these pages (a quick preview)")
    ap.add_argument("--audio-from", default=None, help="a folder of slide-NN.wav (revoice.py's audio-revoiced): each slide plays "
                    "that narration instead, and is held for its length; the captions are timed from this voice's own run, scaled to fit")
    ap.add_argument("--web", action="store_true", help="also write <name>-web.mp4: 1280x720, small enough for the course site (< 25 MB)")
    a = ap.parse_args()

    if not (a.voice or a.clone):
        ap.error("give --voice or --clone")

    spec = json.load(open(a.notes, encoding="utf-8"))
    say = spec.get("say", {})
    slides = spec["slides"]
    if a.only:
        lo, _, hi = a.only.partition("-"); hi = hi or lo
        slides = [s for s in slides if int(lo) <= s["page"] <= int(hi)]
    # pages left out of the video ("video": {"skip": [...]}: the Skill Building pages, worked in the platform, not watched)
    skip = set((spec.get("video") or {}).get("skip") or [])
    slides = [s for s in slides if s["page"] not in skip]
    name = a.name or Path(a.notes).stem
    out = Path(a.out); (out / "audio").mkdir(parents=True, exist_ok=True); (out / "pages").mkdir(exist_ok=True)

    print("Rendering pages…", flush=True)
    first, last = slides[0]["page"], slides[-1]["page"]
    subprocess.run(["pdftoppm", "-f", str(first), "-l", str(last), "-scale-to-x", "1920", "-scale-to-y", "1080",
                    "-png", a.deck, str(out / "pages" / "p")], check=True)
    pngs = sorted((out / "pages").glob("p-*.png"))
    by_page = {int(re.search(r"-(\d+)\.png$", p.name).group(1)): p for p in pngs}

    if a.clone:
        os.environ.setdefault("TQDM_DISABLE", "1")
        import numpy as np, torch
        from chatterbox.tts import ChatterboxTTS
        torch.manual_seed(7)
        model = ChatterboxTTS.from_pretrained(device="cuda" if torch.cuda.is_available() else "cpu")
        model.prepare_conditionals(a.clone, exaggeration=0.5)
        rate = model.sr
        voice_id = "clone:" + hashlib.sha1(Path(a.clone).read_bytes()).hexdigest()

        def synth(text):
            wav = model.generate(text, cfg_weight=0.5, exaggeration=0.5).squeeze(0).numpy()
            return (np.clip(wav, -1, 1) * 32767).astype("<i2").tobytes()
    else:
        from piper import PiperVoice
        from piper.config import SynthesisConfig
        voice = PiperVoice.load(a.voice)
        rate = voice.config.sample_rate
        cfg = SynthesisConfig(length_scale=1.0 / a.rate)
        voice_id = "piper:" + Path(a.voice).name + f":{a.rate}"

        def synth(text):
            return b"".join(c.audio_int16_bytes for c in voice.synthesize(text, syn_config=cfg))
    gap = b"\x00\x00" * int(rate * SILENCE_BETWEEN)

    if a.audio_from:   # every slide plays its converted narration: the video runs at that audio's rate
        with wave.open(str(Path(a.audio_from) / f"slide-{slides[0]['page']:02}.wav")) as w: out_rate = w.getframerate()
    else: out_rate = rate
    all_pcm = bytearray(); cues = []; chapters = []; concat = []; t = 0.0
    for s in slides:
        n = s["page"]
        print(f"  slide {n:02}: {s['title']}", flush=True)
        # Each slide's audio is kept with its caption timings, so a rebuild after editing one slide's notes (or
        # after a long cloned-voice run is cut off) only voices the slides that changed.
        wav_path = out / "audio" / f"slide-{n:02}.wav"; cue_path = wav_path.with_suffix(".json")
        key = hashlib.sha1(json.dumps([voice_id, s["notes"], say]).encode()).hexdigest()
        cached = json.loads(cue_path.read_text()) if cue_path.exists() and wav_path.exists() else None
        if cached and cached.get("key") == key:
            with wave.open(str(wav_path)) as w:
                pcm = bytearray(w.readframes(w.getnframes()))
            slide_cues = cached["cues"]
        else:
            pcm = bytearray(b"\x00\x00" * int(rate * LEAD_IN)); slide_cues = []
            for sent in sentences(s["notes"]):
                start = len(pcm) / 2 / rate
                pcm += synth(spoken(sent, say))
                end = len(pcm) / 2 / rate
                pieces = caption_lines(sent)
                total = sum(len(p) for p in pieces); cur = start
                for p in pieces:
                    d = (end - start) * len(p) / total
                    slide_cues.append((cur, cur + d, p)); cur += d
                pcm += gap
            pcm += b"\x00\x00" * int(rate * TAIL)
            with wave.open(str(wav_path), "wb") as w:
                w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(bytes(pcm))
            cue_path.write_text(json.dumps({"key": key, "cues": slide_cues}))
        if a.audio_from:
            # the converted narration says the same words: its captions are this voice's, stretched to its length
            own = len(pcm) / 2 / rate
            with wave.open(str(Path(a.audio_from) / f"slide-{n:02}.wav")) as w:
                if w.getframerate() != out_rate: sys.exit(f"{a.audio_from}: slide-{n:02}.wav is not at {out_rate} Hz like the others")
                pcm = bytearray(w.readframes(w.getnframes()))
            k = (len(pcm) / 2 / out_rate) / own
            slide_cues = [(c0 * k, c1 * k, txt) for c0, c1, txt in slide_cues]
        cues += [(t + c0, t + c1, txt) for c0, c1, txt in slide_cues]
        dur = len(pcm) / 2 / out_rate
        chapters.append((t, t + dur, f"{n}. {s['title']}"))
        concat.append((by_page[n], t, t + dur))
        all_pcm += pcm; t += dur

    narration = out / "narration.wav"
    with wave.open(str(narration), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(out_rate); w.writeframes(bytes(all_pcm))

    srt = "".join(f"{i}\n{ts(a0)} --> {ts(b0)}\n{txt}\n\n" for i, (a0, b0, txt) in enumerate(cues, 1))
    (out / f"{name}.srt").write_text(srt, encoding="utf-8")
    vtt = "WEBVTT\n\n" + "".join(f"{ts(a0, '.')} --> {ts(b0, '.')}\n{txt}\n\n" for a0, b0, txt in cues)
    (out / f"{name}.vtt").write_text(vtt, encoding="utf-8")
    meta = f";FFMETADATA1\ntitle={spec.get('title', name)}\n" + "".join(
        f"\n[CHAPTER]\nTIMEBASE=1/1000\nSTART={int(c0*1000)}\nEND={int(c1*1000)}\ntitle={ct}\n" for c0, c1, ct in chapters)
    (out / "chapters.txt").write_text(meta, encoding="utf-8")
    # the pages in the video and where each starts: "video.starts" in the notes file, and revoice.py's slide order
    (out / "slides.json").write_text(json.dumps([{"page": s["page"], "start": round(c0, 1)} for s, (c0, _, _) in zip(slides, chapters)]))

    print(f"Encoding {t/60:.1f} min of video…", flush=True)
    # One looped input per slide, each held for a whole number of frames that ends where its narration ends
    # (cumulative rounding, so the pictures never drift from the voice, however many slides there are).
    fps = 10
    inputs = []
    for png, t0, t1 in concat:
        frames = round(t1 * fps) - round(t0 * fps)
        inputs += ["-loop", "1", "-framerate", str(fps), "-t", f"{frames / fps:.3f}", "-i", str(png)]
    k = len(concat)
    graph = "".join(f"[{i}:v]" for i in range(k)) + f"concat=n={k}:v=1:a=0,format=yuv420p[v]"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs,
                    "-i", str(narration), "-i", str(out / f"{name}.srt"), "-i", str(out / "chapters.txt"),
                    "-filter_complex", graph, "-map", "[v]", "-map", f"{k}:a", "-map", f"{k + 1}:s",
                    "-map_metadata", str(k + 2), "-map_chapters", str(k + 2),
                    "-c:v", "libx264", "-preset", "medium", "-tune", "stillimage", "-crf", "20", "-r", str(fps),
                    "-c:a", "aac", "-b:a", "128k", "-c:s", "mov_text", "-metadata:s:s:0", "language=eng",
                    "-movflags", "+faststart", str(out / f"{name}.mp4")], check=True)
    if a.web:
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(out / f"{name}.mp4"), "-map", "0:v", "-map", "0:a", "-map_chapters", "0",
                        "-vf", "scale=1280:720", "-c:v", "libx264", "-preset", "slow", "-crf", "30", "-tune", "stillimage", "-g", "300", "-r", "10",
                        "-c:a", "aac", "-b:a", "40k", "-ac", "1", "-movflags", "+faststart", str(out / f"{name}-web.mp4")], check=True)
    print(f"Done: {out / (name + '.mp4')}  ({t/60:.1f} min, {len(slides)} slides)")
    print("video.starts: " + json.dumps([round(c0, 1) for c0, _, _ in chapters]))


if __name__ == "__main__":
    sys.exit(main())
