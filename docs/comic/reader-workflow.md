# Student reading flow

Home → Contents → Chapter characters → Comic reader.

- Keep the colorful illustrated UI, outlines and raised shadows.
- The homepage Start button and cover open /comic/contents.
- /comic is a contents alias; old /comic?page=N links still open that page.
- /comic/chapter/:id introduces characters encountered through the selected chapter, using book-catalog.json. Register new characters with their biographies and Scripture sources, chapter characterIds and newCharacterIds. Do not introduce future characters early.
- The introduction's single reading CTA resumes the saved page for that chapter when available.
- The reader displays artwork and one persistent page control. It must not display production scripts, shot descriptions, dialogue drafts or review notes.
- comic-data.json remains the original production storyboard. dialogue-v2.json remains the proposed dialogue revision. These are production inputs, not student-facing reading content.
- reader-pages.json contains only id, title and image for publication. The current publication uses episode-01-v2, generated with dialogue-v2.json. The original episode-01-v1 art and original production storyboard are retained for comparison, not shown to readers.
- All twelve refreshed pages, including page ten, are present in the published edition. Keep a reader-friendly missing-artwork fallback for any future unillustrated pages; never substitute production scripts.
