#!/usr/bin/env python3
"""The narrated video in the trainer's own voice, keeping the narrator's accent and pacing.

make_video.py --voice voices the notes with the Piper narrator (American). This converts that narration to the
sound of another voice (Chatterbox voice conversion, offline): the words, accent and timing stay the narrator's, the
voice becomes the one in the sample. Each slide keeps its exact length, so the captions and chapters still fit.

    python3 build/videoslide/revoice.py --build out/day1 --sample my-voice.wav --name day1

--build is make_video.py's --out folder (its audio/slide-NN.wav, <name>.mp4). Writes there:
  audio-revoiced/slide-NN.wav   (kept: a second run only converts the slides that are missing)
  <name>-revoiced.mp4           the same video, chapters and captions, with the converted narration
Needs `pip install chatterbox-tts` and ffmpeg. Without a GPU it converts about 1 s of audio in 3-4 s.
"""
import argparse, os, subprocess, sys, wave
from pathlib import Path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--build", required=True)
    ap.add_argument("--sample", required=True, help="10-30 s of the voice to sound like, clean, one speaker")
    ap.add_argument("--name", required=True, help="the video's name in --build, without .mp4")
    a = ap.parse_args()
    os.environ.setdefault("TQDM_DISABLE", "1")
    import numpy as np, torch
    from chatterbox.vc import ChatterboxVC

    build = Path(a.build); src = sorted((build / "audio").glob("slide-*.wav")); dst = build / "audio-revoiced"; dst.mkdir(exist_ok=True)
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
    lst = build / "revoiced.txt"; lst.write_text("".join(f"file '{(dst / f.name).resolve()}'\n" for f in src))
    out = build / f"{a.name}-revoiced.mp4"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(build / f"{a.name}.mp4"), "-f", "concat", "-safe", "0", "-i", str(lst),
                    "-map", "0:v", "-map", "1:a", "-map", "0:s?", "-map_chapters", "0", "-map_metadata", "0",
                    "-c:v", "copy", "-c:s", "copy", "-af", "loudnorm=I=-18:TP=-1.5", "-ar", "24000", "-c:a", "aac", "-b:a", "128k",
                    "-movflags", "+faststart", str(out)], check=True)
    print(f"Done: {out}")


if __name__ == "__main__":
    sys.exit(main())
