# Episode 03 publication — 2026-09-10

## Approved content

- 日月星辰; Genesis 1:14–19, creation day four.
- Approved storyboard: episode-03-storyboard-review-v1.md.
- Ten pages, 46 panels: 5 / 5 / 3 / 5 / 4 / 5 / 5 / 5 / 4 / 5.
- No new characters. The existing fictional observers retain their approved costumes and identities.
- Scripture is presented in rectangular captions, fictional conversation in speech bubbles. Day/night comparisons illustrate the created lights' functions, not additional days. Only page nine formally concludes day four.
- No animals or human-shaped representation of God. The page-ten reference to birds is dialogue only, anticipating the next chapter.

## Assets and integration

- app/comic/episode-03-pages.json contains only publication metadata, not production scripts.
- Target artwork: public/comics/episode-03-v1/page-01.png through page-10.png.
- Built-in image generation with approved character and previous-chapter style references; no CLI generation fallback.
- Exact prompts and originals are retained locally under /Users/danieltan/Desktop/Walk Through Bible Story/output/comic/episode-03-v1/.
- Existing GitHub main → Vercel deployment is preserved. WhatsApp promotional artwork remains excluded from Git.

## Artwork QA

- Main agent visually inspected all ten selected full pages: panel totals, captions and dialogue, character identity, costumes, bubble speakers, day-four chronology, and no premature animal life.
- Pages six and seven received targeted coastal settlement/light cleanup; prompts are prompt-06-cleanup.txt and prompt-07-cleanup.txt. Their final local files are page-06.png and page-07.png.
- Page eight uses local page-08-v2.png (coastal-light cleanup), copied to the app's stable page-08.png path. Original variants remain outside the app.
- Read-only Apple Vision OCR matched 40 of 42 approved text fragments. Visual inspection confirmed both OCR false negatives: page-five “月亮也看到了！” and page-six “一、二、三……”. All 42 wording fragments are visibly present. OCR is not a guarantee of identical punctuation.
- Art uses fictional observers and illustrative terrain, not a claim that Genesis specifies their appearance or the landscape. Natural highlights and small decorative costume/light-trace variations may remain.

## App integration and release validation

- The complete ten-page chapter is registered in the shared catalog. Contents and homepage use the same catalog.
- Chapter two's final right arrow leads to chapter three without repeating character introductions; existing single-dock and keyboard navigation remain unchanged.
- Cache v11 preserves chapter-isolated navigation and prompts installed apps to refresh their shell. Offline availability remains limited to cached pages/assets.
- Release checks cover complete PNG assets, contents navigation, chapter-two-to-three transition, ten-page bounds, one reading dock, and isolated chapter caching. Existing chapters and promotional artwork remain unchanged.
- All 21 tests passed. Changed-file lint and the production Vercel build also passed before publication.
