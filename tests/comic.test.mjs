import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";
import { comicChapterEntry, getComicPageIndex } from "../app/comic/navigation.mjs";

const pages = JSON.parse(await readFile(new URL("../app/comic/comic-data.json", import.meta.url), "utf8"));
const catalog = JSON.parse(await readFile(new URL("../app/comic/book-catalog.json", import.meta.url), "utf8"));
const revised = JSON.parse(await readFile(new URL("../app/comic/dialogue-v2.json", import.meta.url), "utf8"));

test("published reader uses all twelve refreshed illustrations without production scripts", async () => {
  const publicPages = JSON.parse(await readFile(new URL("../app/comic/reader-pages.json", import.meta.url), "utf8"));
  assert.deepEqual(publicPages.map(({ id, title }) => ({ id, title })), pages.map(({ id, title }) => ({ id, title })));
  for (const page of publicPages) {
    assert.deepEqual(Object.keys(page), ["id", "title", "image"]);
    assert.equal(page.image, `/comics/episode-01-v2/page-${String(page.id).padStart(2, "0")}.png`);
    const bytes = await readFile(new URL("../public" + page.image, import.meta.url));
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(bytes.readUInt32BE(16), 1024);
    assert.equal(bytes.readUInt32BE(20), 1536);
  }
  const source = await readFile(new URL("../app/comic/book-data.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /import.*(?:comic-data|dialogue-v2)/);
  assert.match(source, /item\.number <= chapter\.number/);
  assert.match(source, /flatMap\(\(item\) => item\.characterIds\)/);
  assert.match(source, /comicBook\.characters\.filter/);
});

test("book catalog declares character introductions before any new chapter cast", () => {
  assert.equal(catalog.title, "圣经漫画故事");
  assert.deepEqual(catalog.characters.filter((c) => catalog.mainCharacterIds.includes(c.id)).map((c) => c.name), ["小昆", "小君"]);
  const seen = new Set(catalog.mainCharacterIds);
  for (const chapter of catalog.chapters) {
    for (const id of chapter.characterIds) {
      const character = catalog.characters.find((c) => c.id === id);
      assert.ok(character?.bio, id + " needs an introduction");
      if (!seen.has(id)) assert.ok(chapter.newCharacterIds.includes(id), id + " must be introduced");
      if (character.kind === "biblical") assert.ok(character.reference, id + " needs a Scripture source");
    }
    for (const id of chapter.newCharacterIds) {
      assert.ok(chapter.characterIds.includes(id), "new cast must appear in chapter");
      assert.ok(!seen.has(id), "do not reintroduce established characters");
      seen.add(id);
    }
  }
});

test("dialogue revision retains every panel, Scripture caption and original illustration transcript", () => {
  assert.equal(revised.length, pages.length);
  let changed = 0;
  for (const [index, page] of pages.entries()) {
    const next = revised[index];
    assert.equal(next.id, page.id);
    assert.equal(next.panels.length, page.panels.length);
    for (const [panelIndex, panel] of page.panels.entries()) {
      const text = next.panels[panelIndex].text;
      assert.equal(next.panels[panelIndex].shot, panel.shot);
      for (const line of panel.text.filter((line) => line.startsWith("经文旁白：") || line === "小昆：起初，神创造天地。")) {
        assert.ok(text.includes(line), "Scripture must not be rewritten");
      }
      if (JSON.stringify(text) !== JSON.stringify(panel.text)) changed++;
    }
  }
  assert.equal(changed, 43);
  assert.equal(pages[11].panels[1].text[0], "小昆：可以让我停下来，看这么久。");
  assert.equal(revised[11].panels[1].text[0], "小昆：真的看到，感觉完全不一样耶。");
});

test("cover and approved character sheet are real local PNG assets", async () => {
  for (const path of [catalog.coverImage, catalog.characterSheet]) {
    assert.ok(path?.startsWith("/comics/book-v1/"));
    const bytes = await readFile(new URL("../public" + path, import.meta.url));
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  }
});

test("original production archive preserves 12 page positions, 64 panels and previous notes", () => {
  assert.equal(pages.length, 12);
  assert.deepEqual(pages.map((p) => p.id), Array.from({ length: 12 }, (_, i) => i + 1));
  assert.equal(pages.reduce((n, p) => n + p.panels.length, 0), 64);
  assert.equal(pages.filter((p) => p.image).length, 11);
  assert.equal(pages[9].image, null);
  assert.equal(pages[9].status, "missing");
  assert.equal(pages[9].panels.length, 5);
  assert.match(pages[1].image, /page-02-v2\.png$/);
  for (const p of [pages[6], pages[11]]) assert.equal(p.status, "revision");
});

test("every illustrated page has its own valid full-resolution PNG in public assets", async () => {
  const images = pages.filter((p) => p.image).map((p) => p.image);
  assert.equal(new Set(images).size, 11);
  for (const image of images) {
    assert.match(image, /^\/comics\/episode-01-v1\/page-\d{2}(-v2)?\.png$/);
    const bytes = await readFile(new URL("../public" + image, import.meta.url));
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(bytes.readUInt32BE(16), 1024);
    assert.equal(bytes.readUInt32BE(20), 1536);
  }
});

test("comic query navigation clamps bounds and rejects invalid page numbers", () => {
  for (const value of [null, "", "hello", "2.5", "Infinity"]) assert.equal(getComicPageIndex(value, 12), 0);
  assert.equal(getComicPageIndex("-4", 12), 0);
  assert.equal(getComicPageIndex("1", 12), 0);
  assert.equal(getComicPageIndex("10", 12), 9);
  assert.equal(getComicPageIndex("12", 12), 11);
  assert.equal(getComicPageIndex("99", 12), 11);
});

test("chapter entry introduces new cast without repeating introductions for established companions", () => {
  assert.equal(comicChapterEntry({ id: "episode-01", number: 1, newCharacterIds: [] }), "/comic/chapter/episode-01");
  assert.equal(comicChapterEntry({ id: "episode-02", number: 2, newCharacterIds: [] }), "/comic/read?chapter=episode-02&page=1");
  assert.equal(comicChapterEntry({ id: "later", number: 3, newCharacterIds: ["new-person"] }), "/comic/chapter/later");
});

test("second chapter preserves all approved page positions and has twelve distinct full-page assets", async () => {
  const published = JSON.parse(await readFile(new URL("../app/comic/episode-02-pages.json", import.meta.url), "utf8"));
  const storyboard = await readFile(new URL("../docs/comic/episode-02-storyboard-review-v1.md", import.meta.url), "utf8");
  const panels = [...storyboard.matchAll(/^## 第 (\d+) 页[^\n]*（(\d+) 格）/gm)];
  assert.equal(panels.length, 12);
  assert.equal(panels.reduce((n, p) => n + Number(p[2]), 0), 58);
  assert.equal(published.length, 12);
  assert.equal(new Set(published.map((p) => p.image)).size, 12);
  for (const [index, page] of published.entries()) {
    assert.equal(page.id, index + 1);
    assert.deepEqual(Object.keys(page), ["id", "title", "image"]);
    assert.equal(page.image, `/comics/episode-02-v1/page-${String(page.id).padStart(2, "0")}.png`);
    const bytes = await readFile(new URL("../public" + page.image, import.meta.url));
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(bytes.readUInt32BE(16), 1024);
    assert.equal(bytes.readUInt32BE(20), 1536);
  }
  const chapter = catalog.chapters.find((item) => item.id === "episode-02");
  assert.equal(chapter?.reference, "创世记 1:6–13");
  assert.deepEqual(chapter?.newCharacterIds, []);
});

test("service worker caches comic navigation separately from the homepage", async () => {
  const script = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");
  const handlers = {};
  const saved = new Map([["/", new Response("home")], ["/comic", new Response("comic")]]);
  let offline = false;
  runInNewContext(script, {
    self: { location: { origin: "https://example.test" }, addEventListener: (name, fn) => { handlers[name] = fn; } },
    URL, Response,
    fetch: async (request) => { if (offline) throw new Error("offline"); return new Response(request.url.includes("episode-02") ? "chapter two" : "updated comic"); },
    caches: {
      open: async () => ({ put: async (key, response) => { saved.set(key, response); } }),
      match: async (key) => saved.get(key)?.clone(),
    },
  });
  let response;
  const work = [];
  const navigate = async (path) => {
    handlers.fetch({
      request: { method: "GET", mode: "navigate", url: "https://example.test" + path },
      respondWith: (promise) => { response = promise; },
      waitUntil: (promise) => { work.push(promise); },
    });
    const result = await response;
    await Promise.all(work);
    return result;
  };
  assert.equal(await (await navigate("/comic?page=12")).text(), "updated comic");
  assert.equal(await saved.get("/").clone().text(), "home");
  assert.equal(await (await navigate("/comic/read?chapter=episode-01&page=12")).text(), "updated comic");
  assert.equal(await (await navigate("/comic/read?chapter=episode-02&page=1")).text(), "chapter two");
  offline = true;
  assert.equal(await (await navigate("/comic/read?chapter=episode-01&page=3")).text(), "updated comic");
  assert.equal(await (await navigate("/comic/read?chapter=episode-02&page=6")).text(), "chapter two");
  assert.equal((await navigate("/comic/read?chapter=unvisited")).status, 503);
  assert.equal(await (await navigate("/comic?page=10")).text(), "updated comic");
  assert.equal(await (await navigate("/")).text(), "home");
  assert.equal((await navigate("/unvisited")).status, 503);
});
