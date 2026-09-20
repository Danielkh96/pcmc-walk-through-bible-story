"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation avoids the verified Vinext RSC prefetch crash in production. */

import { useSyncExternalStore } from "react";
import { useAppearance } from "../use-appearance";
import { useLanguage } from "../use-language";
import { comicBook, comicChapters, comicChaptersForLanguage, charactersThroughChapter } from "./book-data";
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
  const [language, setLanguage] = useLanguage();
  const zh = language === "zh";
  const availableChapters = comicChaptersForLanguage(language);
  const chapter = comicChapters.find((item) => item.id === chapterId) ?? comicChapters[0];
  const characters = charactersThroughChapter(chapter);
  const progress = useSyncExternalStore(subscribeProgress, savedProgress, noProgress);
  const page = savedComicPage(progress, chapter);
  return (
    <main className={reader.reader} data-theme={theme}>
      <header className={reader.header}>
        <a className={reader.brand} href="/" aria-label={zh ? "PCMC Walk Through Bible Story 首页" : "PCMC Walk Through Bible Story home"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pcmc-logo.png?v=26" alt="" width={36} height={36} />
          <span>{comicBook.imprint}</span>
        </a>
        <div className={reader.headerActions}>
          <button className={reader.control} onClick={() => setLanguage(zh ? "en" : "zh")} aria-label={zh ? "切换至英文漫画" : "Switch to Chinese comic"}>{zh ? "EN" : "中文"}</button>
          <button className={reader.control} aria-pressed={theme === "dark"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? (zh ? "浅色" : "Light") : (zh ? "深色" : "Dark")}</button>
        </div>
      </header>
      <div className={styles.body}>
        <div className={styles.heading}>
          <p className={reader.eyebrow}>{section === "contents" ? (zh ? comicBook.title : comicBook.titleEn) : (zh ? `第 ${chapter.number} 章 · ${chapter.book}` : `Chapter ${chapter.number} · ${chapter.bookEn}`)}</p>
          <h1>{section === "contents" ? (zh ? "漫画目录" : "Comic contents") : (zh ? "认识故事里的伙伴" : "Meet the characters")}</h1>
          <p>{section === "contents" ? (zh ? "选一章，开始这段冒险。" : "Choose a chapter and begin the adventure.") : (zh ? "先认识他们，再一起走进故事。" : "Meet them first, then step into the story together.")}</p>
        </div>
        {section === "contents" ? (
          <ol className={styles.chapterList}>
            {availableChapters.map((item) => <li key={item.id}>
              <a href={comicChapterEntry(item)}>
                <span className={styles.chapterNumber}>{String(item.number).padStart(2, "0")}</span>
                <span className={styles.chapterCopy}><small>{zh ? item.reference : item.referenceEn}</small><strong>{zh ? item.title : item.titleEn}</strong><span>{zh ? item.summary : item.summaryEn}</span></span>
                <span className={styles.chapterArrow} aria-hidden="true">→</span>
              </a>
            </li>)}
          </ol>
        ) : (
          <>
            <div className={styles.characterArt}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={comicBook.characterSheet} alt={zh ? "小昆穿橙色上衣，小君穿湖绿色上衣，两位一起探索圣经故事的伙伴。" : "Xiao Kun in orange and Xiao Jun in teal, two friends exploring Bible stories together."} width={1536} height={1024} />
            </div>
            <div className={styles.characterGrid}>{characters.map((person) => <section key={person.id} className={styles.characterCard}>
              <small>{chapter.newCharacterIds.includes(person.id) ? (zh ? "新登场 · " : "New · ") : ""}{person.kind === "fictional" ? (zh ? "现代学生 · 故事中的虚构旅伴" : "Modern students · fictional companions") : (zh ? "圣经人物" : "Biblical character")}</small>
              <h2>{zh ? person.name : person.nameEn}</h2><h3>{zh ? person.tagline : person.taglineEn}</h3>
              {(zh ? person.quote : person.quoteEn) && <blockquote>“{zh ? person.quote : person.quoteEn}”</blockquote>}
              <p>{zh ? person.bio : person.bioEn}</p>
              {(zh ? person.reference : person.referenceEn) && <span>{zh ? person.reference : person.referenceEn}</span>}
            </section>)}</div>
            <p className={styles.disclaimer}>{zh ? "小昆和小君的穿越是虚构故事；圣经事件依据经文展开。" : "Xiao Kun and Xiao Jun’s journey is fictional; the biblical events follow Scripture."}</p>
            <div className={styles.actions}>
              <a className={styles.backLink} href="/comic/contents">← {zh ? "目录" : "Contents"}</a>
              <a className={styles.primary} href={"/comic/read?chapter=" + chapter.id + "&page=" + page}>{page > 1 ? (zh ? `继续阅读 · 第 ${page} 页` : `Continue · Page ${page}`) : (zh ? "开始阅读" : "Start reading")} →</a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
