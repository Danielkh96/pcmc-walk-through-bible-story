import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { comicChapterEntry, savedComicPage } from "../app/comic/navigation.mjs";
const read = path => readFile(new URL("../" + path, import.meta.url));

test("Abram's call publishes eight approved images in each language without reintroducing the cast", async () => {
  const catalog = JSON.parse(await read("app/comic/book-catalog.json"));
  const chapter = catalog.chapters.find(item => item.id === "call-of-abram");
  const pages = JSON.parse(await read("app/comic/call-of-abram-pages.json"));
  const assets = JSON.parse(await read("docs/comic/call-of-abram-v1-assets.json"));
  assert.equal(chapter.number, 15);
  assert.equal(chapter.reference, "创世记 12:1–9");
  assert.equal(chapter.hidePrintedFolio, false);
  assert.deepEqual(chapter.availableLanguages, ["zh", "en"]);
  assert.deepEqual(chapter.newCharacterIds, []);
  assert.deepEqual(chapter.characterIds, ["xiao-kun", "xiao-jun", "abram", "sarai", "lot"]);
  assert.equal(catalog.chapters.filter(item => item.availableLanguages.includes("en")).length, 18);
  assert.deepEqual(pages.map(item => item.id), [1,2,3,4,5,6,7,8]);
  assert.equal(assets.pages.reduce((sum, item) => sum + item.panels, 0), 36);
  for (const page of pages) {
    assert.equal(page.imageEn, `/comics/call-of-abram-v1-en/page-${String(page.id).padStart(2,"0")}.png`);
    const asset = assets.pages.find(item => item.page === page.id);
    assert.equal(page.image, asset.path);
    const image = await read("public" + page.image);
    assert.equal(image.subarray(0,8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(image.readUInt32BE(16), 1024);
    assert.equal(image.readUInt32BE(20), 1536);
    assert.equal(createHash("sha256").update(image).digest("hex"), asset.sha256);
  }
  assert.equal(comicChapterEntry(chapter), "/comic/read?chapter=call-of-abram&page=1");
  assert.equal(savedComicPage(JSON.stringify({chapter: chapter.id, edition: chapter.edition, page:8}), {...chapter,pages}), 8);
  assert.equal(savedComicPage(JSON.stringify({chapter: chapter.id, edition:"old", page:8}), {...chapter,pages}), 1);
});
