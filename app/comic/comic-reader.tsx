"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation avoids the verified Vinext RSC prefetch crash in production. */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { comicChapters, type ComicChapter } from "./book-data";
import { comicChapterEntry, getComicPageIndex } from "./navigation.mjs";
import { useAppearance } from "../use-appearance";
import styles from "./comic.module.css";

const navigationEvent = "pcmc-comic-navigation";
function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(navigationEvent, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(navigationEvent, callback);
  };
}
function currentPage(count: number) {
  return getComicPageIndex(new URLSearchParams(window.location.search).get("page"), count);
}
function navigate(index: number, count: number) {
  const next = Math.min(Math.max(index, 0), count - 1);
  if (next === currentPage(count)) return;
  const url = new URL(window.location.href);
  url.searchParams.set("page", String(next + 1));
  window.history.pushState(null, "", url);
  window.dispatchEvent(new Event(navigationEvent));
  window.scrollTo({ top: 0, behavior: "instant" });
}

function PageArtwork({ image, title, id, hidePrintedFolio }: { image: string; title: string; id: number; hidePrintedFolio: boolean }) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const element = imageRef.current;
    let cancelled = false;
    // Cached/SSR images can finish before React attaches its load handler.
    if (element?.complete) {
      element.decode().then(
        () => { if (!cancelled) setState("ready"); },
        () => { if (!cancelled) setState("error"); },
      );
    }
    return () => { cancelled = true; };
  }, [image, attempt]);
  return (
    <div className={styles.artwork + (hidePrintedFolio ? " " + styles.reindexedArtwork : "")} aria-busy={state === "loading"}>
      {state === "loading" && <p className={styles.imageMessage} role="status">正在载入第 {id} 页…</p>}
      {state === "error" && (
        <div className={styles.imageMessage} role="alert">
          <p>图片暂时无法加载，请重试。</p>
          <button className={styles.control} onClick={() => {
            setState("loading");
            setAttempt((value) => value + 1);
          }}>重新载入</button>
        </div>
      )}
      {/* Preserve all panels. The approved condensed edition masks only the obsolete bottom folio. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        key={attempt}
        src={attempt ? image + "?retry=" + attempt : image}
        alt={"漫画第 " + id + " 页：" + title}
        width={1024}
        height={1536}
        fetchPriority="high"
        decoding="async"
        onLoad={() => setState("ready")}
        onError={() => setState("error")}
        style={{ visibility: state === "error" ? "hidden" : "visible" }}
      />
    </div>
  );
}

export default function ComicReader({ chapter = comicChapters[0], initialPage }: { chapter?: ComicChapter; initialPage?: string }) {
  const comicPages = chapter.pages;
  const nextChapter = comicChapters[comicChapters.findIndex((item) => item.id === chapter.id) + 1];
  const pageIndex = useSyncExternalStore(subscribe, () => currentPage(comicPages.length), () => getComicPageIndex(initialPage ?? null, comicPages.length));
  const [theme, setTheme] = useAppearance();
  const dark = theme === "dark";
  const setDark = (value: boolean) => setTheme(value ? "dark" : "light");
  const page = comicPages[pageIndex];
  useEffect(() => {
    try {
      localStorage.setItem("pcmc-comic-progress", JSON.stringify({
        chapter: chapter.id,
        edition: chapter.edition,
        page: currentPage(comicPages.length) + 1,
      }));
    } catch { /* Storage is optional; URL navigation remains available. */ }
  }, [chapter.id, chapter.edition, comicPages.length, pageIndex]);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target instanceof Element && event.target.closest("input, textarea, select, button, a, summary, [contenteditable]")) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        if (event.key === "ArrowRight" && pageIndex === comicPages.length - 1 && nextChapter) {
          window.location.assign(comicChapterEntry(nextChapter));
        } else {
          navigate(pageIndex + (event.key === "ArrowRight" ? 1 : -1), comicPages.length);
        }
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [pageIndex, comicPages.length, nextChapter]);
  return (
    <main className={styles.reader} data-theme={dark ? "dark" : "light"}>
      <a className={styles.skip} href="#comic-page">跳到漫画内容</a>
      <header className={styles.header}>
        <a className={styles.brand} href="/" aria-label="PCMC Walk Through Bible Story 首页">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pcmc-logo.png" alt="" width={36} height={36} />
          <span>PCMC Walk Through Bible Story</span>
        </a>
        <div className={styles.headerActions}>
          <a href="/comic/contents" className={styles.control}>总目录</a>
          <button className={styles.control} aria-pressed={dark} onClick={() => setDark(!dark)}>
            {dark ? "浅色" : "深色"}
          </button>
        </div>
      </header>
      <h1 className={styles.srOnly}>漫画阅读</h1>
      <div className={styles.workspace}>
        <article id="comic-page" className={styles.content} aria-label={"漫画第 " + page.id + " 页"}>
          {page.image ? <PageArtwork key={chapter.id + ":" + page.id} id={page.id} image={page.image} title={page.title} hidePrintedFolio={chapter.hidePrintedFolio} /> : (
            <section className={styles.missing}>
              <p className={styles.eyebrow}>第 {page.id} 页</p>
              <h2>这一页正在绘制中</h2>
              <p>画面完成后会更新到这里。你可以先翻到下一页。</p>
            </section>
          )}
          {pageIndex === comicPages.length - 1 && <p className={styles.endNote}>{nextChapter ? "下一章：" + nextChapter.title + " · 点击右箭头继续" : "这一章读完啦！"}</p>}
        </article>
      </div>
      <nav className={styles.readingDock} aria-label="漫画翻页">
        <button className={styles.control} onClick={() => navigate(pageIndex - 1, comicPages.length)} disabled={pageIndex === 0} aria-label="上一页">←</button>
        <label className={styles.pagePicker}>
          <span className={styles.srOnly}>选择漫画页码</span>
          <select value={pageIndex} onChange={(event) => navigate(Number(event.target.value), comicPages.length)}>
            {comicPages.map((item, index) => <option value={index} key={item.id}>第 {item.id} / {comicPages.length} 页{!item.image ? " · 待更新" : ""}</option>)}
          </select>
        </label>
        {pageIndex === comicPages.length - 1 && nextChapter ? (
          <a className={styles.control} href={comicChapterEntry(nextChapter)} aria-label={"下一章：" + nextChapter.title} title={"下一章：" + nextChapter.title}>→</a>
        ) : (
          <button className={styles.control} onClick={() => navigate(pageIndex + 1, comicPages.length)} disabled={pageIndex === comicPages.length - 1} aria-label="下一页">→</button>
        )}
        <div className={styles.progress} role="progressbar" aria-label="漫画阅读进度" aria-valuemin={1} aria-valuemax={comicPages.length} aria-valuenow={page.id}><span style={{ width: (page.id / comicPages.length * 100) + "%" }} /></div>
      </nav>
    </main>
  );
}
