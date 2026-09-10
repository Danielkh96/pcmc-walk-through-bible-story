# Episode 04 publication — 2026-09-10

## Approved content

- 海里的生命，天空的飞鸟; Genesis 1:20–23, creation day five.
- User approved episode-04-storyboard-review-v1.md before generation and authorized GitHub/Vercel deployment.
- Ten pages, 46 panels: 4 / 4 / 5 / 5 / 5 / 5 / 4 / 5 / 4 / 5.
- Existing fictional companions observe from shore. Underwater panels are camera views, not underwater travel by the children. No new named cast, invented divine appearance, premature land animals or predation storyline.

## Assets and QA

- All ten images generated using the built-in image tool with approved character and previous-chapter references. No CLI fallback; first results selected after QA.
- public/comics/episode-04-v1/page-01.png through page-10.png: 1024 × 1536 PNGs.
- Exact prompts and originals: /Users/danieltan/Desktop/Walk Through Bible Story/output/comic/episode-04-v1/ (prompt-01.txt through prompt-10.txt). Agent QA notes retain original generation provenance.
- Main agent visually inspected all ten pages for complete page layouts, panel counts, dialogue and scripture, costume/bag consistency, animal anatomy and creation chronology.
- Read-only Apple Vision OCR matched 34 of 36 expected fragments. The two false negatives read 鸟 as 乌 on pages two and eight. Visual reinspection confirmed the interior dot in both 鸟 glyphs; page-eight enlarged evidence is retained locally. No text regeneration was necessary. OCR is a wording aid, not a guarantee of punctuation fidelity.
- Fish and bird species, coastal terrain, lighting, fictional observer dialogue and subtle observation traces are artistic design rather than specified biblical details. Minor hair, bag, shoe and framing variations remain; page-three first panel is approximately 30% rather than the proposed approximate 40%, with all five approved shots preserved.

## App integration

- Shared catalog adds chapter four; homepage and contents derive entries from the catalog. No redundant introductions for established companions.
- Chapter three's final right arrow leads to chapter four, with existing keyboard behavior and one reading dock preserved.
- Only publication metadata is imported by the reader, not production scripts or review notes.
- Cache v12 preserves chapter-isolated documents; unvisited pages/images are not promised offline.
- Prior chapters, user UI and WhatsApp promotional artwork remain unchanged. Promotional artwork remains excluded from Git.
- Release follows the existing GitHub main → Vercel connection, not a new hosting project.

## Validation

- All 23 tests passed, covering all four chapters, complete PNG assets, catalog links, chapter transitions, page bounds and separated offline document caches.
- Changed-file ESLint and production Vercel build passed before publication.
