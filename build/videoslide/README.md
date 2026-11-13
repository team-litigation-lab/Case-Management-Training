# Narrated video slides

`make_video.py` turns a Canva deck (exported as PDF) and its speaker notes into one MP4. An AI voice reads each
slide's notes while the slide is on screen. The MP4 also has captions (a subtitle track you can turn on) and one chapter
per slide.

- `day1.json`: the speaker notes for *Revised Case Management Training Day 1* (54 pages). Canva leaves notes
  out of a PDF export, so these notes were written from what each page says. They add no new facts. Edit a
  slide's `notes` and build again.
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
```

Add `--only 16-18` to preview a few pages quickly, or `--rate 1.1` to speak 10% faster. The build also writes the
captions as `.srt`/`.vtt` and one `audio/slide-NN.wav` per slide (for adding narration to the deck in PowerPoint or
Canva instead). It needs `pdftoppm` (poppler) and `ffmpeg`.
