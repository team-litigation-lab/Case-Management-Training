#!/usr/bin/env python3
"""The narrated video in the trainer's own voice, keeping the narrator's accent and pacing.

make_video.py --voice voices the notes with the Piper narrator (American). This converts that narration to the
sound of another voice (Chatterbox voice conversion, offline): the words, accent and timing stay the narrator's, the
voice becomes the one in the sample.

    python3 build/videoslide/revoice.py --build out/day1 --sample my-voice.wav

--build is make_video.py's --out folder (its audio/slide-NN.wav, slides.json). Writes there:
  audio-revoiced/slide-NN.wav   (kept: a second run only converts the slides that are missing)
then make_video.py --audio-from <that folder> builds the video on that narration (each slide held for its length).
Needs `pip install chatterbox-tts` and ffmpeg. Without a GPU it converts about 1 s of audio in 3-4 s.
"""
import argparse, json, os, subprocess, sys, wave
from pathlib import Path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--build", required=True)
    ap.add_argument("--sample", required=True, help="10-30 s of the voice to sound like, clean, one speaker")
    a = ap.parse_args()
    os.environ.setdefault("TQDM_DISABLE", "1")
    import numpy as np, torch
    from chatterbox.vc import ChatterboxVC

    build = Path(a.build)
    # the slides in the video, in its order (make_video.py's slides.json: pages it skips have no part in it)
    order = build / "slides.json"
    src = [build / "audio" / f"slide-{x['page']:02}.wav" for x in json.loads(order.read_text())] if order.exists() else sorted((build / "audio").glob("slide-*.wav"))
    dst = build / "audio-revoiced"; dst.mkdir(exist_ok=True)
    if not src: sys.exit(f"no slide audio in {build / 'audio'}")
    model = None
    for f in src:
        o = dst / f.name
        if o.exists(): continue
        if model is None: model = ChatterboxVC.from_pretrained(device="cuda" if torch.cuda.is_available() else "cpu")
        with wave.open(str(f)) as w: want = w.getnframes() / w.getframerate()
        wav = model.generate(str(f), target_voice_path=a.sample).squeeze(0).numpy()
        n = round(want * model.sr)   # the slide's exact length: trim or pad the few milliseconds the model rounds by
        wav = np.pad(wav, (0, max(0, n - len(wav))))[:n]
        tmp = o.with_suffix(".part")
        with wave.open(str(tmp), "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(model.sr); w.writeframes((np.clip(wav, -1, 1) * 32767).astype("<i2").tobytes())
        tmp.rename(o)
        print(f"  {f.name}  {want:.1f}s", flush=True)
    print(f"Done: {len(src)} slides in {dst}. Now build the video from them:\n"
          f"  python3 build/videoslide/make_video.py ... --out {build} --audio-from {dst}")


if __name__ == "__main__":
    sys.exit(main())
