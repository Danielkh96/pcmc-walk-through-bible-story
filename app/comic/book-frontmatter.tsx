"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation avoids the verified Vinext RSC prefetch crash in production. */

import { useSyncExternalStore } from "react";
import { useAppearance } from "../use-appearance";
import { comicBook, comicChapters, charactersThroughChapter } from "./book-data";
import { comicChapterEntry, savedComicPage } from "./navigation.mjs";
import reader from "./comic.module.css";
import styles from "./book.module.css";

function subscribeProgress(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}
function savedProgress() {
  try { return localStorage.getItem("pcmc-comic-progress") || ""; } catch { return ""; }
}
function noProgress() { return ""; }

export default function BookFrontmatter({ section, chapterId }: { section: "contents" | "characters"; chapterId?: string }) {
  const [theme, setTheme] = useAppearance();
  const chapter = comicChapters.find((item) => item.id === chapterId) ?? comicChapters[0];
  const characters = charactersThroughChapter(chapter);
  const progress = useSyncExternalStore(subscribeProgress, savedProgress, noProgress);
  const page = savedComicPage(progress, chapter);
  return (
    <main className={reader.reader} data-theme={theme}>
      <header className={reader.header}>
        <a className={reader.brand} href="/" aria-label="PCMC Walk Through Bible Story 首页">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pcmc-logo.png" alt="" width={36} height={36} />
          <span>{comicBook.imprint}</span>
        </a>
        <button className={reader.control} aria-pressed={theme === "dark"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? "浅色" : "深色"}</button>
      </header>
      <div className={styles.body}>
        <div className={styles.heading}>
          <p className={reader.eyebrow}>{section === "contents" ? "圣经漫画故事" : `第 ${chapter.number} 章 · ${chapter.book}`}</p>
          <h1>{section === "contents" ? "漫画目录" : "认识故事里的伙伴"}</h1>
          <p>{section === "contents" ? "选一章，开始这段冒险。" : "先认识他们，再一起走进故事。"}</p>
        </div>
        {section === "contents" ? (
          <ol className={styles.chapterList}>
            {comicChapters.map((item) => <li key={item.id}>
              <a href={comicChapterEntry(item)}>
                <span className={styles.chapterNumber}>{String(item.number).padStart(2, "0")}</span>
                <span className={styles.chapterCopy}><small>{item.reference}</small><strong>{item.title}</strong><span>{item.summary}</span></span>
                <span className={styles.chapterArrow} aria-hidden="true">→</span>
              </a>
            </li>)}
          </ol>
        ) : (
          <>
            <div className={styles.characterArt}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={comicBook.characterSheet} alt="小昆穿橙色上衣，小君穿湖绿色上衣，两位一起探索圣经故事的伙伴。" width={1536} height={1024} />
            </div>
            <div className={styles.characterGrid}>{characters.map((person) => <section key={person.id} className={styles.characterCard}>
              <small>{chapter.newCharacterIds.includes(person.id) ? "新登场 · " : ""}{person.kind === "fictional" ? "现代学生 · 故事中的虚构旅伴" : "圣经人物"}</small>
              <h2>{person.name}</h2><h3>{person.tagline}</h3>
              {person.quote && <blockquote>“{person.quote}”</blockquote>}
              <p>{person.bio}</p>
              {person.reference && <span>{person.reference}</span>}
            </section>)}</div>
            <p className={styles.disclaimer}>小昆和小君的穿越是虚构故事；圣经事件依据经文展开。</p>
            <div className={styles.actions}>
              <a className={styles.backLink} href="/comic/contents">← 目录</a>
              <a className={styles.primary} href={"/comic/read?chapter=" + chapter.id + "&page=" + page}>{page > 1 ? `继续阅读 · 第 ${page} 页` : "开始阅读"} →</a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
