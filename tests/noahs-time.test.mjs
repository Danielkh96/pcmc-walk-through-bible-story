import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { savedComicPage, comicChapterEntry } from "../app/comic/navigation.mjs";
const read = p => readFile(new URL("../" + p, import.meta.url), "utf8");
test("Noah's Time has ten complete full-frame Chinese and English pages", async () => {
 const catalog=JSON.parse(await read("app/comic/book-catalog.json"));
 const chapter=catalog.chapters.find(c=>c.id==="noahs-time");
 const pages=JSON.parse(await read("app/comic/noahs-time-pages.json"));
 assert.equal(chapter.number,7);assert.equal(chapter.reference,"创世记 6:1–22");
 assert.equal(chapter.edition,"noahs-time-v1");assert.equal(chapter.hidePrintedFolio,false);
 assert.deepEqual(chapter.availableLanguages,["zh","en"]);
 assert.deepEqual(pages.map(p=>p.id),Array.from({length:10},(_,i)=>i+1));
 for (const page of pages) {
   assert.equal(page.image,"/comics/noahs-time-v1/page-"+String(page.id).padStart(2,"0")+".png");
   assert.equal(page.imageEn,page.image.replace("noahs-time-v1/","noahs-time-v1-en/"));
   const english=await readFile(new URL("../public"+page.imageEn,import.meta.url));
   assert.equal(english.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
   assert.equal(english.readUInt32BE(16),1024);assert.equal(english.readUInt32BE(20),1536);
   const bytes=await readFile(new URL("../public"+page.image,import.meta.url));
   assert.notDeepEqual(english,bytes);
   assert.equal(bytes.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
   assert.equal(bytes.readUInt32BE(16),1024);assert.equal(bytes.readUInt32BE(20),1536);
 }
 assert.equal(comicChapterEntry(chapter),"/comic/chapter/noahs-time");
 assert.equal(savedComicPage(JSON.stringify({chapter:chapter.id,edition:chapter.edition,page:10}),{...chapter,pages}),10);
 assert.equal(savedComicPage(JSON.stringify({chapter:chapter.id,edition:"old",page:10}),{...chapter,pages}),1);
});
test("English preference cannot select empty new-chapter art; PWA cache advances",async()=>{
 const reader=await read("app/comic/comic-reader.tsx");
 assert.match(reader,/chapter.availableLanguages.includes\(preferredLanguage\)/);
 assert.match(reader,/disabled=\{!chapter.availableLanguages.includes/);
 assert.match(await read("public/sw.js"),/v24-noahs-time-bilingual/);
});
