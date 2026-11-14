# Narrated video slides

`make_video.py` turns a Canva deck (exported as PDF) and its speaker notes into one MP4. An AI voice reads each
slide's notes while the slide is on screen. The MP4 also has captions (a subtitle track you can turn on) and one chapter
per slide.

- `day1.json`: the speaker notes for *Revised Case Management Training Day 1* (54 pages). Canva leaves notes
  out of a PDF export, so these notes were written from what each page says. They add no new facts. Edit a
  slide's `notes` and build again.
- `day2.json`: the speaker notes for *Revised Case Management Training Day 2* (44 pages), written the same way. Its
  Skill Building pages (11, 12, 20, 32, 43) have no notes, so they are left out of the video.
  `say` sets how the voice says a term (PIP → "P I P"). The captions keep the term as it is written.
- The voice is [Piper](https://github.com/rhasspy/piper) `en_US-lessac-high`. It is free and runs offline, so nothing is
  sent anywhere.

```bash
pip install piper-tts
curl -LO https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/high/en_US-lessac-high.onnx
curl -LO https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/high/en_US-lessac-high.onnx.json
```

```bash
python3 build/videoslide/make_video.py --deck "Revised Case Management Training Day 1.pdf" --notes build/videoslide/day1.json --voice en_US-lessac-high.onnx --out out/day1
python3 build/videoslide/make_video.py --deck "Revised Case Management Training Day 2.pdf" --notes build/videoslide/day2.json --voice en_US-lessac-high.onnx --out out/day2
```

Add `--web` for the copy the course site serves (1280×720, under 25 MB). Add `--only 16-18` to preview a few pages quickly, or `--rate 1.1` to speak 10% faster. The build also writes the
captions as `.srt`/`.vtt` and one `audio/slide-NN.wav` per slide (for adding narration to the deck in PowerPoint or
Canva instead). It needs `pdftoppm` (poppler) and `ffmpeg`.

## In the course

The deck and its video are embedded in the course from the same `dayN.json`:

- `lessons` names the deck pages that stand in for a lesson's drawn slides (`"d1m1-role": [1, 2, 3, …]`). Each page is
  one slide, and its `notes` are the slide's script in 🖥 Presenter view. A lesson that isn't listed keeps its own slides.
  A lesson's pages show on the day the course teaches that lesson (the treatment lessons are on Case Flow Day 2).
- `video` is the day's narrated video (`decks/dayN/dayN-narrated.mp4`, its captions, and the start time of each page in
  it). `video.skip` lists the pages left out of the video (the Skill Building pages: they are worked in the platform,
  where they stay as slides). make_video.py leaves them out and prints the new `video.starts`.
  The day card shows ▶ Video once a trainer unlocks it (Admin → 🔓 Open Lessons → 🎬 Unlock Videos), 🔒 Video until then.
- The page images are `decks/dayN/NN.webp` (1600×900). The video must stay under 25 MB to be served by the site.

After changing `lessons`, the notes, or the video, run:

```bash
node build/videoslide/deck-slides.cjs
```

It writes `js/cm-deck-slides.js` (generated: don't edit it by hand). `.github/scripts/day-video.cjs` checks all of it.

## In the trainer's own voice

`revoice.py` converts the narration to the sound of a recorded voice (Chatterbox voice conversion, offline), keeping
the narrator's American accent and pacing. Then the video is built on that audio:

```bash
python3 build/videoslide/revoice.py --build out/day1 --sample my-voice.wav
```

```bash
python3 build/videoslide/make_video.py --deck "Day 1.pdf" --notes build/videoslide/day1.json --voice en_US-lessac-high.onnx --out out/day1 --audio-from out/day1/audio-revoiced --web
```
