/** @param {string | null} value @param {number} count */
export function getComicPageIndex(value, count) {
  const page = Number(value);
  if (!value || !Number.isInteger(page)) return 0;
  return Math.min(Math.max(page - 1, 0), count - 1);
}

/** The four retired creation chapters now have one approved reading edition.
 * @param {string} id
 */
export function isRetiredCreationChapter(id) {
  return ["episode-01", "episode-02", "episode-03", "episode-04"].includes(id);
}

/** Show introductions for the opening chapter and newly encountered characters only.
 * @param {{ id: string, number: number, newCharacterIds: string[] }} chapter
 */
export function comicChapterEntry(chapter) {
  return chapter.number === 1 || chapter.newCharacterIds.length > 0
    ? "/comic/chapter/" + chapter.id
    : "/comic/read?chapter=" + chapter.id + "&page=1";
}
