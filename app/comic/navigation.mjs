/** @param {string | null} value @param {number} count */
export function getComicPageIndex(value, count) {
  const page = Number(value);
  if (!value || !Number.isInteger(page)) return 0;
  return Math.min(Math.max(page - 1, 0), count - 1);
}
