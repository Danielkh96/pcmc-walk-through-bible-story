import catalog from "./book-catalog.json";
import episode01 from "./reader-pages.json";

export type ComicPageData = (typeof episode01)[number];
const episodeData: Record<string, ComicPageData[]> = { "episode-01": episode01 };

export const comicBook = catalog;
export const comicChapters = catalog.chapters.map((chapter) => {
  const pages = episodeData[chapter.dataKey];
  if (!pages?.length) throw new Error("Missing comic data: " + chapter.dataKey);
  for (const id of [...chapter.characterIds, ...chapter.newCharacterIds]) {
    if (!catalog.characters.some((character) => character.id === id)) {
      throw new Error("Missing character introduction: " + id);
    }
  }
  return {
    ...chapter,
    newCharacterIds: chapter.newCharacterIds as string[],
    pages,
    illustratedCount: pages.filter((page) => page.image).length,
  };
});
export type ComicChapter = (typeof comicChapters)[number];

// Introduce only people encountered by this chapter, without future spoilers.
export function charactersThroughChapter(chapter: ComicChapter) {
  const ids = new Set(comicChapters
    .filter((item) => item.number <= chapter.number)
    .flatMap((item) => item.characterIds));
  return comicBook.characters.filter((person) => ids.has(person.id));
}
