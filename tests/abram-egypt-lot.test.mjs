import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { comicChapterEntry } from "../app/comic/navigation.mjs";
const read = path => readFile(new URL("../" + path, import.meta.url));

test("chapters 15–18 offer distinct final images in both languages and introduce Pharaoh once", async () => {
  const catalog = JSON.parse(await read("app/comic/book-catalog.json"));
  for (const language of ["zh", "en"]) {
    assert.equal(catalog.chapters.filter(c => c.availableLanguages.includes(language)).length, 18);
  }
  const egypt = catalog.chapters.find(c => c.id === "abram-in-egypt");
  const lot = catalog.chapters.find(c => c.id === "abram-and-lot-separate");
  assert.equal(egypt.referenceEn, "Genesis 12:10–20");
  assert.equal(lot.referenceEn, "Genesis 13:1–18");
  assert.deepEqual(egypt.newCharacterIds, ["pharaoh-abram-egypt"]);
  assert.deepEqual(lot.newCharacterIds, []);
  assert.equal(comicChapterEntry(egypt), "/comic/chapter/abram-in-egypt");
  assert.equal(comicChapterEntry(lot), "/comic/read?chapter=abram-and-lot-separate&page=1");
  const pharaoh = catalog.characters.find(c => c.id === "pharaoh-abram-egypt");
  assert.match(pharaoh.bio, /称号/);
  assert.match(pharaoh.bioEn, /does not give his name/);
  let total = 0;
  for (const [id, count, panels] of [["call-of-abram",8,36],["abram-in-egypt",8,36],["abram-and-lot-separate",10,44],["abram-rescues-lot",9,40]]) {
    const chapter = catalog.chapters.find(c => c.id === id);
    assert.equal(chapter.hidePrintedFolio, false);
    assert.deepEqual(chapter.availableLanguages, ["zh","en"]);
    const pages = JSON.parse(await read(`app/comic/${id}-pages.json`));
    assert.equal(pages.length, count);
    for (const suffix of ["", "-en"]) {
      const manifest = JSON.parse(await read(`docs/comic/${id}-v1${suffix}-assets.json`));
      assert.equal(manifest.pages.reduce((sum, p) => sum+p.panels, 0), panels);
      for (const page of pages) {
        const path = suffix ? page.imageEn : page.image;
        const asset = manifest.pages.find(p => p.page === page.id);
        assert.equal(path, asset.path);
        const image = await read("public"+path);
        assert.equal(image.readUInt32BE(16),1024);
        assert.equal(image.readUInt32BE(20),1536);
        assert.equal(createHash("sha256").update(image).digest("hex"),asset.sha256);
        if (suffix) assert.notEqual(createHash("sha256").update(image).digest("hex"), createHash("sha256").update(await read("public"+page.image)).digest("hex"));
        total++;
      }
    }
  }
  assert.equal(total,70);
});
