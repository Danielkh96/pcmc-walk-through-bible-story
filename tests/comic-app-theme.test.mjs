import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("comic and story surfaces share the same light and dark palette", async () => {
  const [theme, reader, book, layout] = await Promise.all([
    read("../app/comic-theme.css"), read("../app/comic/comic.module.css"),
    read("../app/comic/book.module.css"), read("../app/layout.tsx"),
  ]);
  assert.match(layout, /import "\.\/comic-theme\.css"/);
  assert.match(theme, /\.theme-dark, \[data-theme="dark"\]/);
  for (const token of ["paper", "surface", "ink", "muted", "line", "accent"]) {
    assert.ok(reader.includes(`--comic-${token}: var(--toon-${token})`));
  }
  assert.match(book, /var\(--font-comic\)/);
  assert.doesNotMatch(book, /var\(--font-noto-serif-sc\)/);
  assert.match(theme, /prefers-reduced-motion: reduce/);
  assert.match(theme, /max-width: 720px/);
  assert.match(theme, /--toon-pop: #ffd17a/);
  assert.match(theme, /9px 10px 0 var\(--toon-card-depth\)/);
  assert.match(theme, /border: 3px solid var\(--toon-line\)/);
});

test("home exclusively links to comic reading and retains interface language and theme controls", async () => {
  const [page, manifest] = await Promise.all([read("../app/page.tsx"), read("../public/manifest.webmanifest")]);
  assert.match(page, /comic-app theme-/);
  assert.match(page, /className="hero-comic-cover" href="\/comic"/);
  assert.match(page, /开始看漫画/);
  assert.match(page, /Read the comic/);
  assert.doesNotMatch(page, /aria-label="Bible story reader"|detailedPages|genesis-creation/);
  assert.match(page, /setLanguage\("zh"\)/);
  assert.match(page, /setLanguage\("en"\)/);
  assert.match(page, /setTheme\(theme === "light"/);
  assert.equal(JSON.parse(manifest).theme_color, "#eaf7fb");
  assert.equal(JSON.parse(manifest).display, "standalone");
});

test("cross-page reading links do not depend on broken client-side RSC navigation", async () => {
  for (const path of ["../app/page.tsx", "../app/comic/book-frontmatter.tsx", "../app/comic/comic-reader.tsx"]) {
    const source = await read(path);
    assert.doesNotMatch(source, /from "next\/link"|<Link\b/);
    assert.match(source, /<a\b/);
    assert.match(source, /useAppearance\(\)/);
  }
});
