"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { comicChapters, type ComicChapter } from "./book-data";
import { getComicPageIndex } from "./navigation.mjs";
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
function currentPage(count = 12) {
  return getComicPageIndex(new URLSearchParams(window.location.search).get("page"), count);
}
function serverPage() { return 0; }
function navigate(index: number, count: number) {
  const next = Math.min(Math.max(index, 0), count - 1);
  if (next === currentPage(count)) return;
  const url = new URL(window.location.href);
  url.searchParams.set("page", String(next + 1));
  window.history.pushState(null, "", url);
  window.dispatchEvent(new Event(navigationEvent));
  window.scrollTo({ top: 0, behavior: "instant" });
}

function PageArtwork({ image, title, id }: { image: string; title: string; id: number }) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  return (
    <div className={styles.artwork} aria-busy={state === "loading"}>
      {state === "loading" && <p className={styles.imageMessage} role="status">正在载入第 {id} 页…</p>}
      {state === "error" && (
        <div className={styles.imageMessage} role="alert">
          <p>图片暂时无法加载，文字稿仍可在下方阅读。</p>
          <button className={styles.control} onClick={() => {
            setState("loading");
            setAttempt((value) => value + 1);
          }}>重新载入</button>
        </div>
      )}
      {/* Full-page artwork is intentional: never crop comic panels with object-fit: cover. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={attempt}
        src={attempt ? image + "?retry=" + attempt : image}
        alt={"漫画第 " + id + " 页：" + title + "。逐格台词见下方文字稿。"}
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

export default function ComicReader({ chapter = comicChapters[0] }: { chapter?: ComicChapter }) {
  const comicPages = chapter.pages;
  const pageIndex = useSyncExternalStore(subscribe, () => currentPage(comicPages.length), serverPage);
  const [dark, setDark] = useState(false);
  const page = comicPages[pageIndex];
  const revised = chapter.revisedDialogue.find((item) => item.id === page.id);
  const missingPages = comicPages.filter((item) => !item.image).map((item) => item.id).join("、");
  useEffect(() => {
    try {
      localStorage.setItem("pcmc-comic-progress", JSON.stringify({
        chapter: chapter.id,
        page: currentPage(comicPages.length) + 1,
      }));
    } catch { /* Storage is optional; URL navigation remains available. */ }
  }, [chapter.id, comicPages.length, pageIndex]);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target instanceof Element && event.target.closest("input, textarea, select, button, a, summary, [contenteditable]")) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        navigate(pageIndex + (event.key === "ArrowRight" ? 1 : -1), comicPages.length);
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [pageIndex, comicPages.length]);
  return (
    <main className={styles.reader} data-theme={dark ? "dark" : "light"}>
      <a className={styles.skip} href="#comic-page">跳到漫画内容</a>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="PCMC Walk Through Bible Story 首页">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pcmc-logo.png" alt="" width={36} height={36} />
          <span>PCMC Walk Through Bible Story</span>
        </Link>
        <div className={styles.headerActions}>
          <Link href="/comic/contents" className={styles.control}>总目录</Link>
          <button className={styles.control} aria-pressed={dark} onClick={() => setDark(!dark)}>
            {dark ? "浅色" : "深色"}
          </button>
        </div>
      </header>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>小昆 &amp; 小君 · EPISODE {String(chapter.number).padStart(2, "0")}</p>
        <h1>{chapter.title}</h1>
        <div className={styles.meta}><span className={styles.badge}>漫画初稿</span><span>中文版 · {chapter.illustratedCount} / {comicPages.length} 页已绘制</span><span>{chapter.reference}</span><Link href={"/comic/chapter/" + chapter.id}>本章人物与分镜提要 →</Link></div>
        <p className={styles.context}>小昆和小君的穿越是虚构框架，矩形旁白引用经文。{missingPages ? `本册尚未定稿，第 ${missingPages} 页暂以分镜文字呈现。` : "本册为漫画预览初稿。"}</p>
      </div>
      <nav className={styles.toolbar} aria-label="漫画翻页">
        <button className={styles.control} onClick={() => navigate(pageIndex - 1, comicPages.length)} disabled={pageIndex === 0}>← 上一页</button>
        <label className={styles.pagePicker}>
          <span className={styles.srOnly}>选择漫画页码</span>
          <select value={pageIndex} onChange={(event) => navigate(Number(event.target.value), comicPages.length)}>
            {comicPages.map((item, index) => (
              <option value={index} key={item.id}>第 {item.id} 页 · {item.title}{!item.image ? "（待绘制）" : ""}</option>
            ))}
          </select>
        </label>
        <button className={styles.control} onClick={() => navigate(pageIndex + 1, comicPages.length)} disabled={pageIndex === comicPages.length - 1}>下一页 →</button>
        <div className={styles.progress} role="progressbar" aria-label="漫画阅读进度" aria-valuemin={1} aria-valuemax={comicPages.length} aria-valuenow={page.id}><span style={{ width: (page.id / comicPages.length * 100) + "%" }} /></div>
      </nav>
      <div className={styles.workspace}>
        <aside className={styles.sidebar} aria-label="本集目录">
          <h2>本集目录</h2>
          <ol>
            {comicPages.map((item, index) => (
              <li key={item.id}>
                <a href={"/comic/read?chapter=" + chapter.id + "&page=" + item.id} aria-current={pageIndex === index ? "page" : undefined} onClick={(event) => {
                  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  event.preventDefault();
                  navigate(index, comicPages.length);
                }}><span>{String(item.id).padStart(2, "0")}</span><span>{item.title}{!item.image && <small>待绘制</small>}</span></a>
              </li>
            ))}
          </ol>
          <p>从左到右、从上到下阅读。<br />可用键盘 ← → 翻页。</p>
        </aside>
        <article id="comic-page" className={styles.content} aria-label={"第 " + page.id + " 页：" + page.title}>
          <div className={styles.pageHeading}>
            <h2 aria-live="polite">第 {page.id} 页 · {page.title}</h2>
            {page.image && <a href={page.image} target="_blank" rel="noreferrer">查看原图 ↗</a>}
          </div>
          {page.status === "revision" && (
            <details className={styles.reviewNote} key={"note-" + page.id}>
              <summary>{page.id === 7 || page.id === 12 ? "此页有待修正画面 · 查看说明" : "此页为初稿 · 查看待调整项"}</summary>
              <p>{page.note}</p>
            </details>
          )}
          {page.image ? <PageArtwork key={page.id} id={page.id} image={page.image} title={page.title} /> : (
            <section className={styles.missing}>
              <span className={styles.eyebrow}>PAGE {page.id} · 待绘制</span>
              <h3>这一页的画面还在等候</h3>
              <p>先读下面的 {page.panels.length} 格分镜，故事不会在这里断开。</p>
              <ol>{page.panels.map((panel, index) => <li key={index}><small>第 {index + 1} 格</small>{panel.text.filter((line) => line !== "无台词。").map((line) => <p key={line}>{line.replace("经文旁白：", "")}</p>)}<span>{panel.shot}</span></li>)}</ol>
            </section>
          )}
          <details className={styles.transcript} key={"transcript-" + page.id}>
            <summary>查看本页分镜与台词 · {page.panels.length} 格</summary>
            <ol>{page.panels.map((panel, index) => <li key={index}><h3>第 {index + 1} 格</h3><p className={styles.shot}>{panel.shot}</p>{panel.text.map((line) => <p key={line}>{line}</p>)}</li>)}</ol>
          </details>
          {revised && (
            <details className={styles.transcript} key={"revised-" + page.id}>
              <summary>对白润色稿 · 更自然的聊天版</summary>
              <p className={styles.shot}>以下是新版台词，尚未写入上方图片。经文旁白保持不变；原版文字可在上方分镜稿对照。</p>
              <ol>{revised.panels.map((panel, index) => <li key={index}><h3>第 {index + 1} 格</h3>{panel.text.map((line) => <p key={line}>{line}</p>)}</li>)}</ol>
            </details>
          )}
          <nav className={styles.bottomNav} aria-label="页末翻页">
            <button className={styles.control} onClick={() => navigate(pageIndex - 1, comicPages.length)} disabled={pageIndex === 0}>← 上一页</button>
            <span>{page.id} / {comicPages.length}</span>
            <button className={styles.control} onClick={() => navigate(pageIndex + 1, comicPages.length)} disabled={pageIndex === comicPages.length - 1}>下一页 →</button>
          </nav>
          {pageIndex === comicPages.length - 1 && <p className={styles.endNote}>这一章到这里结束。<Link href="/comic/contents">返回漫画总目录 →</Link></p>}
        </article>
      </div>
    </main>
  );
}
