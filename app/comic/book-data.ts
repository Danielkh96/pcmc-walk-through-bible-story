import catalog from "./book-catalog.json";
import episode01 from "./comic-data.json";
import dialogue01 from "./dialogue-v2.json";

export type ComicPageData = (typeof episode01)[number];
export type DialoguePage = (typeof dialogue01)[number];
const episodeData: Record<string, ComicPageData[]> = { "episode-01": episode01 };
const dialogueData: Record<string, DialoguePage[]> = { "episode-01": dialogue01 };

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
    revisedDialogue: dialogueData[chapter.dataKey] ?? [],
    panelCount: pages.reduce((count, page) => count + page.panels.length, 0),
    illustratedCount: pages.filter((page) => page.image).length,
  };
});
export type ComicChapter = (typeof comicChapters)[number];
