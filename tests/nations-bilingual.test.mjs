import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { comicChapterEntry, savedComicPage } from "../app/comic/navigation.mjs";

test("Nations After the Flood has two complete eight-page editions and seven new introductions", async () => {
  const catalog = JSON.parse(await readFile(new URL("../app/comic/book-catalog.json", import.meta.url), "utf8"));
  const chapter = catalog.chapters.find(c => c.id === "nations-after-the-flood");
  assert.equal(chapter.number, 12);
  assert.equal(chapter.reference, "创世记 10:1–32");
  assert.equal(chapter.referenceEn, "Genesis 10:1–32");
  assert.deepEqual(chapter.availableLanguages, ["zh", "en"]);
  assert.deepEqual(chapter.newCharacterIds, ["cush", "nimrod", "arpachshad", "shelah", "eber", "peleg", "joktan"]);
  assert.equal(comicChapterEntry(chapter), "/comic/chapter/nations-after-the-flood");
  const oldCast = new Set(catalog.chapters.slice(0, -1).flatMap(c => c.newCharacterIds));
  for (const id of chapter.newCharacterIds) {
    assert.ok(!oldCast.has(id), id + " must not repeat a previous introduction");
    const person = catalog.characters.find(c => c.id === id);
    for (const field of ["name", "nameEn", "bio", "bioEn", "reference", "referenceEn"]) assert.ok(person[field]);
  }
  const pages = JSON.parse(await readFile(new URL("../app/comic/nations-after-the-flood-pages.json", import.meta.url), "utf8"));
  assert.deepEqual(pages.map(p => p.id), [1,2,3,4,5,6,7,8]);
  for (const page of pages) {
    assert.ok(page.title && page.titleEn);
    assert.equal(page.image, `/comics/nations-after-the-flood-v1/page-${String(page.id).padStart(2, "0")}.png`);
    assert.equal(page.imageEn, `/comics/nations-after-the-flood-v1-en/page-${String(page.id).padStart(2, "0")}.png`);
    const [zh, en] = await Promise.all([page.image, page.imageEn].map(path => readFile(new URL("../public" + path, import.meta.url))));
    for (const bytes of [zh, en]) {
      assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
      assert.equal(bytes.readUInt32BE(16), 1024);
      assert.equal(bytes.readUInt32BE(20), 1536);
    }
    assert.notDeepEqual(zh, en);
  }
  assert.equal(chapter.hidePrintedFolio, false, "preserve every caption and the full page");
  assert.equal(savedComicPage(JSON.stringify({ chapter: chapter.id, edition: chapter.edition, page: 8 }), { ...chapter, pages }), 8);
});
