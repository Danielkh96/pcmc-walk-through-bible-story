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

/** Resume only within the same edition, so an inserted opening is not skipped.
 * @param {string} progress
 * @param {{ id: string, edition: string, pages: unknown[] }} chapter
 */
export function savedComicPage(progress, chapter) {
  try {
    const saved = JSON.parse(progress);
    if (saved?.chapter === chapter.id && saved.edition === chapter.edition
      && Number.isInteger(saved.page) && saved.page >= 1 && saved.page <= chapter.pages.length) return saved.page;
  } catch { /* Missing or invalid local progress starts at the beginning. */ }
  return 1;
}

/** Show introductions for the opening chapter and newly encountered characters only.
 * @param {{ id: string, number: number, newCharacterIds: string[] }} chapter
 */
export function comicChapterEntry(chapter) {
  return chapter.number === 1 || chapter.newCharacterIds.length > 0
    ? "/comic/chapter/" + chapter.id
    : "/comic/read?chapter=" + chapter.id + "&page=1";
}
