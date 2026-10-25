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
  assert.match(html, /src="\/pcmc-logo\.png\?v=26"/);
  assert.match(html, /最近更新漫画/);
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
  assert.match(serviceWorker, /pcmc-bible-story-v35-babel-success-reflection/);
  assert.match(serviceWorker, /fetch\(event\.request\)[\s\S]*catch\(\(\) => caches\.match\(event\.request\)\)/);
  assert.match(layout, /Newsreader/);
  assert.match(layout, /Noto_Serif_SC/);
});

test("server-renders the comic reader as the only reading edition", async () => {
  const response = await render("/comic/read");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /\/comics\/creation-mystery-v4\/page-01\.png/);
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
    ["/comic", ["漫画目录", "/comic/chapter/creation"]],
    ["/comic/characters", ["认识故事里的伙伴", "现代学生", "等一下，我有个问题", "开始阅读"]],
    ["/comic/contents", ["目录", "创造天地", "/comic/chapter/creation"]],
    ["/comic/chapter/creation", ["认识故事里的伙伴", "小昆", "小君", "开始阅读"]],
    ["/comic/read?chapter=creation", ["漫画阅读", "/comics/creation-mystery-v4/page-01.png"]],
    ["/comic?page=7", ["选择漫画页码", "/comics/creation-mystery-v4/page-07.png"]],
    ["/comic/read?chapter=creation&page=10", ["/comics/creation-mystery-v4/page-10.png"]],
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

test("mystery creation retains all sixteen pages and links to Eden", async () => {
  const contents = await (await render("/comic/contents")).text();
  assert.match(contents, /创造天地/);
  assert.ok(contents.includes('href="/comic/chapter/creation"'));
  assert.doesNotMatch(contents, /episode-0[1-4]|天空、海洋与陆地|海里的生命，天空的飞鸟/);
  for (const page of [...Array.from({ length: 16 }, (_, i) => i + 1), 99]) {
    const response = await render(`/comic/read?chapter=creation&page=${page}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    const id = Math.min(page, 16);
    const asset = `/comics/creation-mystery-v4/page-${String(id).padStart(2, "0")}.png`;
    assert.ok(html.includes(asset));
    assert.doesNotMatch(html, /本页分镜|对白润色|正在绘制中/);
    assert.equal((html.match(/aria-label="漫画翻页"/g) ?? []).length, 1);
    assert.match(html, /aria-valuemax="16"/);
    if (id === 16) assert.match(html, /reindexedArtwork/);
    else assert.doesNotMatch(html, /reindexedArtwork/);
    if (page >= 16) {
      assert.match(html, /aria-label="下一章：伊甸园"/);
      assert.ok(html.includes('href="/comic/chapter/eden"'));
    }
  }
});

test("old chapter bookmarks redirect to the new edition without reusing old page positions", async () => {
  for (const id of ["episode-01", "episode-02", "episode-03", "episode-04"]) {
    for (const [path, destination] of [
      [`/comic/read?chapter=${id}&page=10`, "/comic/read?chapter=creation&page=1"],
      [`/comic/chapter/${id}`, "/comic/chapter/creation"],
    ]) {
      const response = await render(path);
      assert.equal(response.status, 307, path);
      assert.equal(response.headers.get("location"), destination);
    }
  }
});

test("Eden introduces its cast and renders all ten full pages without draft content", async () => {
  const contents = await (await render("/comic/contents")).text();
  assert.ok(contents.includes('href="/comic/chapter/eden"'));
  assert.match(contents, /伊甸园/);
  const firstCast = await (await render("/comic/chapter/creation")).text();
  assert.doesNotMatch(firstCast, /<h2>亚当<\/h2>|<h2>夏娃<\/h2>/);
  const edenCast = await (await render("/comic/chapter/eden")).text();
  assert.match(edenCast, /<h2>亚当<\/h2>/);
  assert.match(edenCast, /<h2>夏娃<\/h2>/);
  assert.ok(edenCast.includes("/comic/read?chapter=eden"));
  for (const page of [...Array.from({ length: 10 }, (_, i) => i + 1), 99]) {
    const response = await render(`/comic/read?chapter=eden&page=${page}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes(`/comics/eden-v1/page-${String(Math.min(page, 10)).padStart(2, "0")}.png`));
    assert.match(html, /aria-valuemax="10"/);
    assert.doesNotMatch(html, /reindexedArtwork|正在绘制中|本页分镜|对白润色|上画文字|待用户审核/);
    assert.equal((html.match(/aria-label="漫画翻页"/g) ?? []).length, 1);
    if (page >= 10) {
      assert.match(html, /aria-label="下一章：试探与选择"/);
      assert.ok(html.includes('href="/comic/chapter/temptation"'));
    }
  }
});

test("Temptation introduces the serpent without spoilers and renders all fourteen full pages", async () => {
  const contents = await (await render("/comic/contents")).text();
  assert.ok(contents.includes('href="/comic/chapter/temptation"'));
  assert.match(contents, /试探与选择/);
  const previousCast = await (await render("/comic/chapter/eden")).text();
  assert.doesNotMatch(previousCast, /<h2>蛇<\/h2>/);
  const cast = await (await render("/comic/chapter/temptation")).text();
  assert.match(cast, /<h2>蛇<\/h2>/);
  assert.doesNotMatch(cast, /<h2>夏娃<\/h2>/);
  assert.doesNotMatch(cast, /基路伯|园外的两兄弟/);
  assert.ok(cast.includes("/comic/read?chapter=temptation"));
  for (const page of [...Array.from({length:14}, (_,i) => i+1), 99]) {
    const response = await render(`/comic/read?chapter=temptation&page=${page}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes(`/comics/temptation-choice-v1/page-${String(Math.min(page,14)).padStart(2,"0")}.png`));
    assert.match(html, /aria-valuemax="14"/);
    assert.doesNotMatch(html, /reindexedArtwork|正在绘制中|本页分镜|对白润色|上画文字|待用户审核/);
    assert.equal((html.match(/aria-label="漫画翻页"/g) ?? []).length, 1);
    if (page >=14) {
      assert.match(html, /aria-label="下一章：园外的两兄弟"/);
      assert.ok(html.includes('href="/comic/chapter/brothers"'));
    }
  }
});

test("Brothers introduces its new cast at chapter four and renders every page without production notes", async () => {
  const contents = await (await render("/comic/contents")).text();
  assert.ok(contents.includes('href="/comic/chapter/brothers"'));
  assert.match(contents, /园外的两兄弟/);
  for (const id of ["creation", "eden", "temptation"]) {
    const earlier = await (await render("/comic/chapter/" + id)).text();
    assert.doesNotMatch(earlier, /<h2>该隐<\/h2>|<h2>亚伯<\/h2>/);
  }
  const cast = await (await render("/comic/chapter/brothers")).text();
  assert.match(cast, /<h2>该隐<\/h2>/);
  assert.match(cast, /<h2>亚伯<\/h2>/);
  assert.doesNotMatch(cast, /把亚伯杀了|记号是什么|供物器具|造型提案/);
  assert.ok(cast.includes("/comic/read?chapter=brothers"));
  for (const page of Array.from({ length: 12 }, (_, i) => i + 1)) {
    const response = await render(`/comic/read?chapter=brothers&page=${page}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes(`/comics/brothers-v1/page-${String(Math.min(page, 12)).padStart(2, "0")}.png`));
    assert.match(html, /aria-valuemax="12"/);
    assert.doesNotMatch(html, /reindexedArtwork|正在绘制中|本页分镜|对白润色|待用户审核|造型提案/);
    assert.equal((html.match(/aria-label="漫画翻页"/g) ?? []).length, 1);
    if (page === 12) {
      assert.match(html, /aria-label="进入讨论反思"/);
      assert.doesNotMatch(html, /aria-label="下一章：一代又一代"/);
    }
  }
});

test("Generations introduces its new cast and renders nine finished Chinese pages", async () => {
  const contents = await (await render("/comic/contents")).text();
  assert.ok(contents.includes('href="/comic/chapter/generations"'));
  assert.match(contents, /一代又一代/);
  const earlier = await (await render("/comic/chapter/brothers")).text();
  assert.doesNotMatch(earlier, /<h2>拉麦<\/h2>|<h2>塞特<\/h2>/);
  const cast = await (await render("/comic/chapter/generations")).text();
  assert.match(cast, /<h2>拉麦<\/h2>/);
  assert.match(cast, /<h2>雅八<\/h2>/);
  assert.match(cast, /<h2>塞特<\/h2>/);
  assert.ok(cast.includes("/comic/read?chapter=generations"));
  for (const page of [...Array.from({ length: 9 }, (_, i) => i + 1), 99]) {
    const response = await render(`/comic/read?chapter=generations&page=${page}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes(`/comics/generations-v1/page-${String(Math.min(page, 9)).padStart(2, "0")}.png`));
    assert.match(html, /aria-valuemax="9"/);
    assert.doesNotMatch(html, /reindexedArtwork|正在绘制中|本页分镜|对白润色|待用户审核|造型提案/);
    assert.equal((html.match(/aria-label="漫画翻页"/g) ?? []).length, 1);
    if (page >= 9) {
      assert.ok(html.includes('href="/comic/chapter/adam-to-noah"'));
      assert.match(html, /aria-label="下一章：从亚当到挪亚/);
    }
  }
});


test("Noah's Time exposes introductions and all ten complete pages", async () => {
  const contents=await (await render("/comic/contents")).text();
  assert.ok(contents.includes('href="/comic/chapter/noahs-time"'));
  const cast=await (await render("/comic/chapter/noahs-time")).text();
  assert.doesNotMatch(cast, /<h2>挪亚<\/h2>/);
  assert.match(cast, /<h2>挪亚的妻子<\/h2>/);
  for(let page=1;page<=10;page++){
    const response=await render("/comic/read?chapter=noahs-time&page="+page);
    assert.equal(response.status,200);
    const html=await response.text();
    assert.ok(html.includes("/comics/noahs-time-v1/page-"+String(page).padStart(2,"0")+".png"));
    assert.match(html,/aria-valuemax="10"/);
    assert.doesNotMatch(html,/reindexedArtwork|本页分镜|对白润色|正在绘制中/);
    if(page===10)assert.match(html,/这一章读完啦/);
  }
});

test("Chapter six renders ten pages and connects to chapter seven", async () => {
 const cast=await (await render("/comic/chapter/adam-to-noah")).text();
 assert.match(cast, /拉麦（挪亚之父）/);
 assert.doesNotMatch(cast, /<h2>挪亚的妻子<\/h2>/);
 for(let p=1;p<=10;p++){
  const response=await render("/comic/read?chapter=adam-to-noah&page="+p);
  assert.equal(response.status,200);
  const html=await response.text();
  assert.ok(html.includes("/comics/adam-to-noah-v1/page-"+String(p).padStart(2,"0")+".png"));
  assert.match(html,/aria-valuemax="10"/);
  if(p===10)assert.ok(html.includes('href="/comic/chapter/noahs-time"'));
 }
});

test("reflection follows the comic in chapters four and seven without changing artwork counts", async () => {
  for (const [id, count, title] of [
    ["brothers", 12, "我们是在服事神，还是也很需要别人看见我们？"],
    ["noahs-time", 10, "如果说出问题，会让我们在团契里变得不受欢迎呢？"],
  ]) {
    const finalArt = await (await render("/comic/read?chapter=" + id + "&page=" + count)).text();
    assert.match(finalArt, /aria-label="进入讨论反思"/);
    for (const page of [count + 1, 99]) {
      const response = await render("/comic/read?chapter=" + id + "&page=" + page);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.ok(html.includes(title));
      assert.doesNotMatch(html, /不点名、不影射真实的人|12–15 分钟|选一个最接近真实的反应|现在，一起试一试/);
      assert.match(html, /id="scenario-heading"/);
      assert.match(html, /反思问题/);
      assert.match(html, /本章经文/);
      assert.doesNotMatch(html, /延伸阅读|Further reading|哥林多前书 12:14–26|雅各书 2:1–9/);
      assert.match(html, /如果是你，你会怎么做？/);
      assert.match(html, /留意上下文/);
      assert.match(html, id === "brothers" ? /创世记 4:3–7/ : /创世记 5:21–24；6:9–22/);
      assert.doesNotMatch(html, /id="questions-heading"/);
      assert.doesNotMatch(html, /id="action-heading"|id="choices-heading"/);
      assert.doesNotMatch(html, /alt="漫画第|正在绘制中/);
      assert.match(html, new RegExp('aria-valuemax="' + count + '"'));
      if (id === "brothers") assert.match(html, /aria-label="下一章：一代又一代"/);
      else assert.match(html, /aria-label="下一章：进入方舟"/);
    }
  }
});

test("chapter eight renders all Chinese pages and follows chapter seven reflection", async () => {
  const contents = await (await render('/comic/contents')).text();
  assert.ok(contents.includes('/comic/read?chapter=enter-the-ark'));
  const reflection = await (await render('/comic/read?chapter=noahs-time&page=11')).text();
  assert.ok(reflection.includes('/comic/read?chapter=enter-the-ark'));
  for (let page=1; page<=10; page++) {
    const response=await render('/comic/read?chapter=enter-the-ark&page='+page);
    assert.equal(response.status,200);
    const html=await response.text();
    assert.ok(html.includes('/comics/enter-the-ark-v1/page-'+String(page).padStart(2,'0')+'.png'));
    assert.ok(!html.includes('本章目前提供中文版'));
    assert.ok(html.includes('切换至英文漫画'));
    assert.ok(html.includes('/comics/enter-the-ark-v1-en/'));
  }
});


test("chapter nine follows chapter eight and renders ten complete Chinese pages", async () => {
 const catalog=JSON.parse(await readFile(new URL('../app/comic/book-catalog.json',import.meta.url),'utf8'));
 const chapter=catalog.chapters.find(c=>c.id==='god-remembers-noah');
 assert.deepEqual(chapter.availableLanguages,['zh','en']);
 assert.deepEqual(chapter.newCharacterIds,[]);
 assert.equal(catalog.chapters.filter(c=>c.availableLanguages.includes('en')).length,14);
 const contents=await (await render('/comic/contents')).text();
 assert.ok(contents.includes('/comic/read?chapter=god-remembers-noah'));
 const previous=await (await render('/comic/read?chapter=enter-the-ark&page=10')).text();
 assert.ok(previous.includes('aria-label="下一章：神记念挪亚"'));
 for(let page=1;page<=10;page++){
  const response=await render('/comic/read?chapter=god-remembers-noah&page='+page);
  assert.equal(response.status,200);
  const html=await response.text();
  const path='/comics/god-remembers-noah-v1/page-'+String(page).padStart(2,'0')+'.png';
  assert.ok(html.includes(path));
  assert.ok(!html.includes('本章目前提供中文版'));
    assert.ok(html.includes('切换至英文漫画'));
  assert.ok(html.includes('/comics/god-remembers-noah-v1-en/'));
  const bytes=await readFile(new URL('../public'+path,import.meta.url));
  assert.equal(bytes.readUInt32BE(16),1024);assert.equal(bytes.readUInt32BE(20),1536);
  if(page===10)assert.ok(html.includes('aria-label="下一章：挪亚献祭"'));
 }
});

test("Noah's Offering follows the exit from the ark and renders all ten full pages", async () => {
  const previous = await (await render('/comic/read?chapter=god-remembers-noah&page=10')).text();
  assert.ok(previous.includes('aria-label="下一章：挪亚献祭"'));
  const contents = await (await render('/comic/contents')).text();
  assert.ok(contents.includes('/comic/read?chapter=noahs-offering'));
  for (let page = 1; page <= 10; page++) {
    const response = await render('/comic/read?chapter=noahs-offering&page=' + page);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes('/comics/noahs-offering-v1/page-' + String(page).padStart(2, '0') + '.png'));
    assert.ok(html.includes('/comics/noahs-offering-v1-en/'));
    assert.ok(html.includes('切换至英文漫画'));
    assert.match(html, /aria-valuemax="10"/);
    assert.doesNotMatch(html, /reindexedArtwork|本章目前提供中文版|本页分镜|对白润色|待用户审核/);
    if (page === 10) assert.ok(html.includes('aria-label="下一章：挪亚和他的儿子们"'));
  }
});

test("Noah and His Sons follows chapter ten and ends at eight complete bilingual pages", async () => {
  const previous = await (await render('/comic/read?chapter=noahs-offering&page=10')).text();
  assert.ok(previous.includes('aria-label="下一章：挪亚和他的儿子们"'));
  assert.ok(previous.includes('href="/comic/chapter/noah-and-his-sons"'));
  const contents = await (await render('/comic/contents')).text();
  assert.ok(contents.includes('/comic/chapter/noah-and-his-sons'));
  for (const page of [1,2,3,4,5,6,7,8,99]) {
    const response = await render('/comic/read?chapter=noah-and-his-sons&page=' + page);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes('/comics/noah-and-his-sons-v1/page-' + String(Math.min(page,8)).padStart(2,'0') + '.png'));
    assert.ok(html.includes('/comics/noah-and-his-sons-v1-en/'));
    assert.ok(html.includes('切换至英文漫画'));
    assert.match(html, /aria-valuemax="8"/);
    assert.doesNotMatch(html, /reindexedArtwork|本章目前提供中文版|本页分镜|对白润色|待用户审核/);
    assert.ok(!html.includes('/comics/noah-and-his-sons-v1/page-09.png'));
    if (page >= 8) assert.ok(html.includes('aria-label="下一章：洪水以后的列国"'));
  }
});

test("homepage features only the latest three chapters while contents keeps every chapter", async () => {
  const home = await (await render('/')).text();
  const library = home.match(/<section[^>]*id="library"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(library);
  assert.match(library, /<h2>最近更新漫画<\/h2>/);
  assert.ok(library.includes('这里展示最近更新的 3 章，全部故事请查看漫画目录。'));
  const cards = [...library.matchAll(/<a[^>]*class="comic-feature"[^>]*href="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(cards, [
    '/comic/chapter/from-shem-to-abram',
    '/comic/chapter/tower-of-babel',
    '/comic/chapter/nations-after-the-flood',
  ]);
  assert.ok(library.includes('查看全部章节'));
  assert.ok(home.includes('已更新 14 章'));
  const contents = await (await render('/comic/contents')).text();
  const catalog = JSON.parse(await readFile(new URL('../app/comic/book-catalog.json',import.meta.url),'utf8'));
  for (const chapter of catalog.chapters) assert.ok(contents.includes('chapter/' + chapter.id) || contents.includes('chapter=' + chapter.id));
});

test("chapter introductions contain only first-time cast and never repeat the companion sheet", async () => {
  const catalog = JSON.parse(await readFile(new URL('../app/comic/book-catalog.json',import.meta.url),'utf8'));
  const introduced = new Set();
  for (const chapter of catalog.chapters) {
    const ids = chapter.number === 1 ? [...catalog.mainCharacterIds,...chapter.newCharacterIds] : chapter.newCharacterIds;
    const response = await render('/comic/chapter/' + chapter.id);
    if (!ids.length) {
      assert.equal(response.status,307);
      assert.equal(response.headers.get('location'),'/comic/read?chapter=' + chapter.id + '&page=1');
      continue;
    }
    assert.equal(response.status,200);
    const html = await response.text();
    const names = [...html.matchAll(/<h2>([^<]+)<\/h2>/g)].map(match => match[1]);
    assert.deepEqual(names,ids.map(id => catalog.characters.find(person => person.id === id).name));
    assert.equal(html.includes('src="' + catalog.characterSheet + '"'),chapter.number === 1);
    for (const id of ids) {
      assert.ok(!introduced.has(id),'repeat introduction: ' + id);
      introduced.add(id);
    }
  }
  assert.equal(introduced.size,catalog.characters.length);
  assert.ok(catalog.chapters[4].newCharacterIds.includes('enosh'));
  assert.ok(!catalog.chapters[5].newCharacterIds.includes('enosh'));
  assert.deepEqual(catalog.chapters[10].newCharacterIds,['canaan']);
});

test("chapter twelve follows chapter eleven and renders every complete bilingual page", async () => {
  const previous = await (await render('/comic/read?chapter=noah-and-his-sons&page=8')).text();
  assert.ok(previous.includes('href="/comic/chapter/nations-after-the-flood"'));
  assert.ok(previous.includes('aria-label="下一章：洪水以后的列国"'));
  const contents = await (await render('/comic/contents')).text();
  assert.ok(contents.includes('/comic/chapter/nations-after-the-flood'));
  for (const page of [1,2,3,4,5,6,7,8,99]) {
    const response = await render('/comic/read?chapter=nations-after-the-flood&page=' + page);
    assert.equal(response.status,200);
    const html = await response.text();
    assert.ok(html.includes('/comics/nations-after-the-flood-v1/page-' + String(Math.min(page,8)).padStart(2,'0') + '.png'));
    assert.ok(html.includes('/comics/nations-after-the-flood-v1-en/'));
    assert.match(html,/aria-valuemax="8"/);
    assert.ok(html.includes('切换至英文漫画'));
    assert.doesNotMatch(html,/本章目前提供中文版|本页分镜|对白润色|待用户审核|新人物造型待审/);
    assert.ok(!html.includes('/comics/nations-after-the-flood-v1/page-09.png'));
    if (page >= 8) assert.ok(html.includes('href="/comic/chapter/tower-of-babel"'));
  }
});

test("Babel links from chapter twelve, introduces only its builders and renders all eight bilingual pages", async () => {
  const intro = await (await render('/comic/chapter/tower-of-babel')).text();
  assert.deepEqual([...intro.matchAll(/<h2>([^<]+)<\/h2>/g)].map(m=>m[1]), ['造城的人们']);
  assert.ok(intro.includes('11:1–4'));
  const previous = await (await render('/comic/read?chapter=nations-after-the-flood&page=8')).text();
  assert.ok(previous.includes('href="/comic/chapter/tower-of-babel"'));
  for (const page of [1,2,3,4,5,6,7,8]) {
    const response = await render('/comic/read?chapter=tower-of-babel&page=' + page);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes('/comics/tower-of-babel-v1/page-' + String(Math.min(page,8)).padStart(2,'0') + '.png'));
    assert.ok(html.includes('/comics/tower-of-babel-v1-en/'));
    assert.match(html, /aria-valuemax="8"/);
    assert.doesNotMatch(html, /本页分镜|待用户审核|Text item|BOY Xiao Kun/);
  }
});

test("chapter fourteen follows Babel, introduces only new family members and renders complete bilingual pages", async () => {
 const catalog=JSON.parse(await readFile(new URL('../app/comic/book-catalog.json',import.meta.url),'utf8'));
 const chapter=catalog.chapters.find(c=>c.id==='from-shem-to-abram');
 const intro=await(await render('/comic/chapter/'+chapter.id)).text();
 assert.deepEqual([...intro.matchAll(/<h2>([^<]+)<\/h2>/g)].map(m=>m[1]),chapter.newCharacterIds.map(id=>catalog.characters.find(p=>p.id===id).name));
 assert.equal(chapter.newCharacterIds.length,11);
 const nahors=chapter.newCharacterIds.filter(id=>id.startsWith('nahor-'));
 assert.equal(nahors.length,2);
 assert.ok(intro.includes('拿鹤（他拉的父亲）')&&intro.includes('拿鹤（他拉的儿子）'));
 const previous=await(await render('/comic/read?chapter=tower-of-babel&page=9')).text();
 assert.ok(previous.includes('href="/comic/chapter/from-shem-to-abram"'));
 for(const page of [1,2,3,4,5,6,7,8,99]){
  const response=await render('/comic/read?chapter=from-shem-to-abram&page='+page);assert.equal(response.status,200);
  const html=await response.text();
  assert.ok(html.includes('/comics/from-shem-to-abram-v1/page-'+String(Math.min(page,8)).padStart(2,'0')+'.png'));
  assert.ok(html.includes('/comics/from-shem-to-abram-v1-en/'));
  assert.match(html,/aria-valuemax="8"/);
  assert.doesNotMatch(html,/本页分镜|待用户审核|PANEL1|Terah planned/);
 }
});


test("Babel ends with one unscored discussion page before the next chapter", async () => {
  const lastArtwork = await (await render("/comic/read?chapter=tower-of-babel&page=8")).text();
  assert.match(lastArtwork, /aria-label="进入讨论反思"/);
  assert.ok(lastArtwork.includes("?chapter=tower-of-babel&amp;page=9"));
  assert.ok(!lastArtwork.includes('aria-label="下一章：从闪到亚伯兰"'));
  const content = JSON.parse(await readFile(new URL("../app/comic/success-reflection.json", import.meta.url), "utf8"));
  for (const page of [9, 99]) {
    const response = await render("/comic/read?chapter=tower-of-babel&page=" + page);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes(content.zh.title));
    assert.ok(html.includes(content.zh.duration));
    for (const question of content.zh.questions) {
      assert.ok(html.includes(question.question));
      for (const option of question.options) assert.ok(html.includes(option));
    }
    assert.ok(html.includes(content.zh.summary));
    assert.equal((html.match(/<fieldset\b/g) ?? []).length, 4);
    assert.equal((html.match(/type="radio"/g) ?? []).length, 16);
    assert.equal((html.match(/name="babel-reflection-q1"/g) ?? []).length, 5);
    assert.equal((html.match(/name="babel-reflection-q2"/g) ?? []).length, 3);
    assert.equal((html.match(/name="babel-reflection-q3"/g) ?? []).length, 4);
    assert.equal((html.match(/name="babel-reflection-q4"/g) ?? []).length, 4);
    assert.doesNotMatch(html, /type="submit"|<form\b|checked=""|role="timer"|alt="漫画第/);
    assert.match(html, /aria-valuemax="8"/);
    assert.ok(html.includes('aria-label="下一章：从闪到亚伯兰"'));
  }
});
