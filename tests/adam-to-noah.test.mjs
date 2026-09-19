import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { comicChapterEntry, savedComicPage } from "../app/comic/navigation.mjs";
const read = p => readFile(new URL('../'+p,import.meta.url));
test('Chapter six fills the gap with ten complete approved Chinese pages',async()=>{
 const catalog=JSON.parse(await read('app/comic/book-catalog.json'));
 const pages=JSON.parse(await read('app/comic/adam-to-noah-pages.json'));
 const chapters=catalog.chapters.filter(c=>c.availableLanguages.includes('zh'));
 assert.deepEqual(chapters.map(c=>c.number),[1,2,3,4,5,6,7]);
 assert.deepEqual(chapters.slice(4).map(c=>c.id),['generations','adam-to-noah','noahs-time']);
 const c=chapters[5];
 assert.equal(c.reference,'创世记 5:1–32');
 assert.equal(c.hidePrintedFolio,false);
 assert.deepEqual(c.availableLanguages,['zh']);
 assert.deepEqual(pages.map(p=>p.id),[1,2,3,4,5,6,7,8,9,10]);
 for(const p of pages){
  assert.equal(p.image,`/comics/adam-to-noah-v1/page-${String(p.id).padStart(2,'0')}.png`);
  assert.equal(p.imageEn,'');
  const data=await read('public'+p.image);
  assert.equal(data.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(data.readUInt32BE(16),1024);assert.equal(data.readUInt32BE(20),1536);
 }
 assert.equal(comicChapterEntry(c),'/comic/chapter/adam-to-noah');
 assert.equal(savedComicPage(JSON.stringify({chapter:c.id,edition:c.edition,page:8}),{...c,pages}),8);
 const ids=new Set(catalog.characters.map(p=>p.id));
 for(const chapter of chapters)for(const id of [...chapter.characterIds,...chapter.newCharacterIds])assert.ok(ids.has(id));
 for(const id of ['noah','shem','ham','japheth']){
  assert.ok(c.newCharacterIds.includes(id));assert.ok(!chapters[6].newCharacterIds.includes(id));
 }
 assert.ok(ids.has('lamech')&&ids.has('lamech-noah'));
 assert.equal(catalog.chapters.filter(c=>c.availableLanguages.includes('en')).length,5);
});
