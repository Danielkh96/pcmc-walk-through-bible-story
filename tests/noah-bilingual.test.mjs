import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { comicChapterEntry, savedComicPage } from "../app/comic/navigation.mjs";

test("Noah chapters have distinct complete editions in both languages without gaps", async () => {
  const catalog = JSON.parse(await readFile(new URL("../app/comic/book-catalog.json", import.meta.url), "utf8"));
  for (const language of ["zh", "en"]) {
    assert.deepEqual(catalog.chapters.filter(c => c.availableLanguages.includes(language)).map(c => c.number), Array.from({ length: 12 }, (_, i) => i + 1));
  }
  for (const [id, count] of [["enter-the-ark", 10], ["god-remembers-noah", 10], ["noahs-offering", 10], ["noah-and-his-sons", 8]]) {
    const chapter = catalog.chapters.find(c => c.id === id);
    const pages = JSON.parse(await readFile(new URL(`../app/comic/${id}-pages.json`, import.meta.url), "utf8"));
    assert.equal(chapter.hidePrintedFolio, false, "do not crop localized panels or captions");
    assert.equal(comicChapterEntry(chapter), id === "noah-and-his-sons" ? `/comic/chapter/${id}` : `/comic/read?chapter=${id}&page=1`);
    assert.deepEqual(chapter.newCharacterIds, id === "noah-and-his-sons" ? ["canaan"] : []);
    assert.deepEqual(pages.map(p => p.id), Array.from({ length: count }, (_, i) => i + 1));
    for (const page of pages) {
      assert.ok(page.titleEn);
      assert.equal(page.imageEn, `/comics/${chapter.edition}-en/page-${String(page.id).padStart(2, "0")}.png`);
      const [zh, en] = await Promise.all([page.image, page.imageEn].map(path => readFile(new URL("../public" + path, import.meta.url))));
      for (const bytes of [zh, en]) {
        assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
        assert.equal(bytes.readUInt32BE(16), 1024);
        assert.equal(bytes.readUInt32BE(20), 1536);
      }
      assert.notDeepEqual(en, zh, "English readers must receive a localized image");
    }
    assert.equal(savedComicPage(JSON.stringify({ chapter: id, edition: chapter.edition, page: count }), { ...chapter, pages }), count);
  }
  assert.equal(catalog.chapters.find(c => c.id === "noah-and-his-sons").referenceEn, "Genesis 9:18–29");
});
