import catalog from "./book-catalog.json";
import creation from "./creation-pages.json";
import eden from "./eden-pages.json";
import temptation from "./temptation-pages.json";
import brothers from "./brothers-pages.json";
import generations from "./generations-pages.json";
import adamToNoah from "./adam-to-noah-pages.json";
import noahsTime from "./noahs-time-pages.json";

import enterTheArk from "./enter-the-ark-pages.json";

import godRemembersNoah from "./god-remembers-noah-pages.json";

import noahsOffering from "./noahs-offering-pages.json";

import noahAndHisSons from "./noah-and-his-sons-pages.json";

import nationsAfterTheFlood from "./nations-after-the-flood-pages.json";

export type ComicPageData = Omit<(typeof creation)[number], "titleEn" | "imageEn"> & { titleEn?: string; imageEn?: string };
const episodeData: Record<string, ComicPageData[]> = {
  creation,
  eden,
  temptation,
  brothers,
  generations,
  adamToNoah,
  noahsTime,
  enterTheArk,
  godRemembersNoah,
  noahsOffering,
  noahAndHisSons,
  nationsAfterTheFlood,
};

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

export function comicChaptersForLanguage(language: "zh" | "en") {
  return comicChapters.filter((chapter) => chapter.availableLanguages.includes(language));
}

// Each chapter introduces its new cast once; the opening introduces the companions.
export function charactersIntroducedInChapter(chapter: ComicChapter) {
  const ids = chapter.number === 1
    ? [...comicBook.mainCharacterIds, ...chapter.newCharacterIds]
    : chapter.newCharacterIds;
  return ids.map((id) => {
    const person = comicBook.characters.find((item) => item.id === id);
    if (!person) throw new Error("Missing character introduction: " + id);
    return person;
  });
}
