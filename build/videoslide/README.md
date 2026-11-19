# Narrated video slides

`make_video.py` turns a Canva deck (exported as PDF) and its speaker notes into one MP4. An AI voice reads each
slide's notes while the slide is on screen. The MP4 also has captions (a subtitle track you can turn on) and one chapter
per slide.

- `day1.json`: the speaker notes for *Revised Case Management Training Day 1* (50 pages, exported from Canva in two
  parts: join them with `pdfunite "Day 1_1.pdf" "Day 1_2.pdf" "Day 1.pdf"`).
  `day2.json`: the speaker notes for *Revised Case Management Training Day 2* (44 pages).
  `day3.json`, `day4.json`, `day5.json`: the notes for the Day 3 (20 pages), Day 4 (36) and Day 5 (42) decks, on Case Flow
  Days 3–5. They discuss each slide rather than read it, and tie it to *John Doe VS Robert Smith*
  (`curriculum/5-day-flow/case-file.md`): where a slide shows another example, the narrator says so and gives the file's facts.
  Canva leaves notes out of a PDF export, so these notes were written from what each page says. They add no new
  facts. Edit a slide's `notes` and build again.
- The Skill Building pages are not in the videos (the Day 1 deck no longer has them; Day 2 pages 11, 12, 20, 32, 43; Day 3 page 10;
  Day 4 pages 16, 17, 18, 31, 32; Day 5 page 38): the
  trainees work those in the room. A page with no entry in the notes file is left out of the video.
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

- `lessons` names the deck pages that ARE a lesson's slides (`"d1m1-role": [1, 2, 3, …]`), on every day's deck. Each
  page is one slide, and its `notes` are the slide's script in 🖥 Presenter view. Day N's deck is taught on Case Flow
  Day N (as its narrated video and the day's title), so its lessons are on that day; a Skill Activity on a later day
  may practise one (the demand Skill Building on Day 3 practises Day 2's BI Demand pages). Nothing of the Canva decks
  is left off: EVERY page in the notes, the title, Training Agenda and Thank You pages too, is one lesson's slide
  (the title and agenda open the day's first deck lesson, the Thank You page closes its last), and every picture in
  `decks/dayN/` is on a slide (`.github/scripts/day-decks.cjs`). A lesson that isn't listed keeps its own drawn
  slides, at most three (js/cm-case-flow.js `lean`); a listed lesson's own rules are a 💡 Tip on the activities that
  practise it (js/cm-lesson-tips.js). Pictures are `decks/dayN/NN.webp` (1600×900), named by page number; the title,
  agenda and Thank You pages of Days 2–5, missing from the exports, were taken from the narrated videos' frames.
- `video` is the day's narrated video (`decks/dayN/dayN-narrated.mp4`, its captions, and the start time of each page in
  it). The day card shows ▶ Video once a trainer unlocks it (Admin → 🔓 Open Lessons → 🎬 Unlock Videos), 🔒 Video until then.
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

The five day videos now on the site were recorded the other way, in one run: `--turbo` speaks each slide's notes
with Chatterbox Turbo in the voice of the sample itself (natural intonation, no Piper step and no `revoice.py`; about
2 s of compute per 1 s of speech on a CPU). Each slide's audio is kept in `out/dayN/audio`, keyed by its notes, so a
run after a narration change speaks only the slides that changed:

```bash
python3 build/videoslide/make_video.py --deck "Day 1.pdf" --notes build/videoslide/day1.json --turbo my-voice.wav --out out/day1 --name day1-narrated --web
```

Copy `out/day1/day1-narrated-web.mp4` to `decks/day1/day1-narrated.mp4` and `day1-narrated.vtt` beside it, put the
`start` of each slide in `out/day1/slides.json` into the notes file's `video.starts`, and run
`node build/videoslide/deck-slides.cjs`.
