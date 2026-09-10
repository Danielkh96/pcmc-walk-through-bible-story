import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost" + path, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the PCMC Bible Story app", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>PCMC \| Walk Through Bible Story<\/title>/i);
  assert.match(html, /PCMC Walk Through Bible Story/);
  assert.match(html, /class="launch-screen"/);
  assert.match(html, /src="\/pcmc-logo\.png"/);
  assert.match(html, /下一段冒险，从这里开始。/);
  assert.match(html, /class="comic-feature"/);
  assert.match(html, /浏览六十六卷书/);
  assert.doesNotMatch(html, /Bible story reader|featured-book|genesis-creation\.png|4 个故事/);
  assert.match(html, /class="mobile-app-nav"/);
  assert.match(html, /创世记/);
});

test("retains launch, appearance, PWA updates and reduced-motion support without the retired reader", async () => {
  const [page, css, serviceWorker, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../public/sw.js", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /pcmc-launch-seen/);
  assert.match(page, /sessionStorage\.getItem\("pcmc-launch-seen"\)/);
  assert.match(page, /hasSeenLaunch \? 0 : 3000/);
  const frontmatter = await readFile(new URL("../app/comic/book-frontmatter.tsx", import.meta.url), "utf8");
  assert.match(frontmatter, /pcmc-comic-progress/);
  assert.doesNotMatch(page, /story-data|legacyPages|setView|pcmc-bible-story-page/);

  assert.match(css, /@keyframes cameraSettle/);
  assert.match(css, /@keyframes textLayerIn/);
  assert.match(css, /\.launch-screen/);
  assert.match(css, /::view-transition-old\(root\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /touch-action:\s*pan-y/);
  assert.match(css, /\.mobile-settings-sheet/);
  assert.match(css, /\.featured-book/);
  assert.match(serviceWorker, /pcmc-bible-story-v8-reader-flow/);
  assert.match(serviceWorker, /fetch\(event\.request\)[\s\S]*catch\(\(\) => caches\.match\(event\.request\)\)/);
  assert.match(layout, /Newsreader/);
  assert.match(layout, /Noto_Serif_SC/);
});

test("server-renders the comic reader as the only reading edition", async () => {
  const response = await render("/comic/read");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /\/comics\/episode-01-v1\/page-01\.png/);
  assert.match(html, /选择漫画页码/);
  assert.doesNotMatch(html, /本页分镜|对白润色|漫画初稿|文字稿仍|本章人物与分镜/);
  assert.doesNotMatch(html, /<h1[^>]*>故事开始以前/);
  assert.equal((html.match(/aria-label="漫画翻页"/g) ?? []).length, 1);
  assert.doesNotMatch(html, /aria-label="页末翻页"|aria-label="本集目录"/);
  const home = await render();
  assert.ok((await home.text()).includes('href="/comic/contents"'));
});

test("comic journey goes from contents to growing cast to artwork without production notes", async () => {
  const cases = [
    ["/comic", ["漫画目录", "/comic/chapter/episode-01"]],
    ["/comic/characters", ["认识故事里的伙伴", "现代学生", "等一下，我有个问题", "开始阅读"]],
    ["/comic/contents", ["目录", "故事开始以前", "/comic/chapter/episode-01"]],
    ["/comic/chapter/episode-01", ["认识故事里的伙伴", "小昆", "小君", "开始阅读"]],
    ["/comic/read?chapter=episode-01", ["漫画阅读", "/comics/episode-01-v1/page-01.png"]],
    ["/comic?page=7", ["选择漫画页码", "/comics/episode-01-v1/page-07.png"]],
    ["/comic/read?chapter=episode-01&page=10", ["这一页正在绘制中"]],
  ];
  for (const [path, expected] of cases) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    for (const text of expected) assert.ok(html.includes(text), path + " is missing " + text);
    assert.doesNotMatch(html, /本页分镜|对白润色|查看每页内容与格数|尚未写入上方图片/);
  }
});

test("unknown comic chapters do not masquerade as the first chapter", async () => {
  for (const path of ["/comic/chapter/nonexistent", "/comic/read?chapter=nonexistent"]) {
    assert.equal((await render(path)).status, 404);
  }
});
