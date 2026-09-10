"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { comicChapters } from "./comic/book-data";
import { PwaInstaller } from "./pwa-installer";

const books = [
  ["创世记", "Genesis"],
  ["出埃及记", "Exodus"],
  ["利未记", "Leviticus"],
  ["民数记", "Numbers"],
  ["申命记", "Deuteronomy"],
  ["约书亚记", "Joshua"],
  ["士师记", "Judges"],
  ["路得记", "Ruth"],
  ["撒母耳记上", "1 Samuel"],
  ["撒母耳记下", "2 Samuel"],
  ["列王纪上", "1 Kings"],
  ["列王纪下", "2 Kings"],
  ["历代志上", "1 Chronicles"],
  ["历代志下", "2 Chronicles"],
  ["以斯拉记", "Ezra"],
  ["尼希米记", "Nehemiah"],
  ["以斯帖记", "Esther"],
  ["约伯记", "Job"],
  ["诗篇", "Psalms"],
  ["箴言", "Proverbs"],
  ["传道书", "Ecclesiastes"],
  ["雅歌", "Song of Songs"],
  ["以赛亚书", "Isaiah"],
  ["耶利米书", "Jeremiah"],
  ["耶利米哀歌", "Lamentations"],
  ["以西结书", "Ezekiel"],
  ["但以理书", "Daniel"],
  ["何西阿书", "Hosea"],
  ["约珥书", "Joel"],
  ["阿摩司书", "Amos"],
  ["俄巴底亚书", "Obadiah"],
  ["约拿书", "Jonah"],
  ["弥迦书", "Micah"],
  ["那鸿书", "Nahum"],
  ["哈巴谷书", "Habakkuk"],
  ["西番雅书", "Zephaniah"],
  ["哈该书", "Haggai"],
  ["撒迦利亚书", "Zechariah"],
  ["玛拉基书", "Malachi"],
  ["马太福音", "Matthew"],
  ["马可福音", "Mark"],
  ["路加福音", "Luke"],
  ["约翰福音", "John"],
  ["使徒行传", "Acts"],
  ["罗马书", "Romans"],
  ["哥林多前书", "1 Corinthians"],
  ["哥林多后书", "2 Corinthians"],
  ["加拉太书", "Galatians"],
  ["以弗所书", "Ephesians"],
  ["腓立比书", "Philippians"],
  ["歌罗西书", "Colossians"],
  ["帖撒罗尼迦前书", "1 Thessalonians"],
  ["帖撒罗尼迦后书", "2 Thessalonians"],
  ["提摩太前书", "1 Timothy"],
  ["提摩太后书", "2 Timothy"],
  ["提多书", "Titus"],
  ["腓利门书", "Philemon"],
  ["希伯来书", "Hebrews"],
  ["雅各书", "James"],
  ["彼得前书", "1 Peter"],
  ["彼得后书", "2 Peter"],
  ["约翰一书", "1 John"],
  ["约翰二书", "2 John"],
  ["约翰三书", "3 John"],
  ["犹大书", "Jude"],
  ["启示录", "Revelation"],
];


const progressKey = "pcmc-comic-progress";
function subscribeProgress(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}
function savedProgress() {
  try { return localStorage.getItem(progressKey) || ""; } catch { return ""; }
}
function noProgress() { return ""; }

export default function Home() {
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isLaunching, setIsLaunching] = useState(true);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const progress = useSyncExternalStore(subscribeProgress, savedProgress, noProgress);
  let resume: { chapter: string; page: number } | null = null;
  try {
    const stored = JSON.parse(progress);
    const chapter = comicChapters.find((item) => item.id === stored.chapter);
    if (chapter && Number.isInteger(stored.page) && stored.page >= 1 && stored.page <= chapter.pages.length) resume = stored;
  } catch { /* A missing or old prose bookmark must not open retired content. */ }
  const resumeChapter = comicChapters.find((item) => item.id === resume?.chapter);
  const readHref = resume ? "/comic/read?chapter=" + resume.chapter + "&page=" + resume.page : "/comic";
  const zh = language === "zh";

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hasSeenLaunch = false;
    try {
      hasSeenLaunch = window.sessionStorage.getItem("pcmc-launch-seen") === "true";
      window.sessionStorage.setItem("pcmc-launch-seen", "true");
    } catch { /* Reading still works when storage is unavailable. */ }
    const timer = window.setTimeout(() => setIsLaunching(false), reducedMotion || hasSeenLaunch ? 0 : 3000);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!mobileSettingsOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMobileSettingsOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [mobileSettingsOpen]);

  return (
    <main className={`comic-app theme-${theme} ${isLaunching ? "is-launching" : ""}`}>
      {isLaunching && <div className="launch-screen" role="status" aria-label="PCMC Walk Through Bible Story">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="launch-mark" src="/pcmc-logo.png" alt="PCMC church logo" />
        <p>PCMC</p><h1>Walk Through Bible Story</h1>
        <span>{zh ? "一起翻开新的冒险！" : "A new adventure awaits!"}</span>
      </div>}
      <header className="topbar app-reveal reveal-1">
        <Link className="brand" href="/" aria-label="PCMC Walk Through Bible Story home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-mark" src="/pcmc-logo.png" alt="" />
          <span className="brand-full">PCMC Walk Through Bible Story</span>
          <span className="brand-short">PCMC Bible Story</span>
        </Link>
        <div className="header-right desktop-controls">
          <PwaInstaller language={language} />
          <Link className="home-link" href="/comic/contents">{zh ? "漫画目录" : "Contents"}</Link>
          <div className="language-switch" role="group" aria-label="Interface language">
            <button className={zh ? "selected" : ""} onClick={() => setLanguage("zh")}>中</button>
            <button className={!zh ? "selected" : ""} onClick={() => setLanguage("en")}>EN</button>
          </div>
          <button className="theme-switch" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle light or dark theme">
            <span>{theme === "light" ? "☾" : "☀"}</span>{theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
        <button className="mobile-settings-trigger" onClick={() => setMobileSettingsOpen(true)} aria-label={zh ? "打开阅读设置" : "Open reading settings"} aria-expanded={mobileSettingsOpen}>•••</button>
      </header>

      {resume && resumeChapter && <section className="continue-reading app-reveal reveal-2" aria-label={zh ? "继续看漫画" : "Continue the comic"}>
        <div className="continue-art" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/comics/book-v1/cover-v1.png" alt="" />
        </div>
        <div className="continue-copy"><p>{zh ? "上次看到这里" : "YOUR BOOKMARK"}</p>
          <h2>{resumeChapter.title}</h2><span>{zh ? `第 ${resume.page} 页，共 ${resumeChapter.pages.length} 页` : `Page ${resume.page} of ${resumeChapter.pages.length}`}</span>
          <div className="progress-track"><i style={{width: resume.page / resumeChapter.pages.length * 100 + "%"}} /></div>
        </div>
        <Link className="continue-button" href={readHref}>{zh ? "继续看漫画" : "Continue"} →</Link>
      </section>}

      <section className="hero app-reveal reveal-3" id="top">
        <div className="hero-intro">
          <p className="eyebrow">PCMC · {zh ? "小昆 & 小君的圣经探索" : "EXPLORE WITH XIAO KUN & XIAO JUN"}</p>
          <h1><span className="hero-title-main">{zh ? "翻开漫画，" : "Turn a page."}</span><span className="hero-title-sub">{zh ? "一起走进圣经！" : "Step into the story!"}</span></h1>
          <p className="hero-copy">{zh ? "跟着小昆和小君，一边看、一边问，发现圣经里的大故事。" : "Join Xiao Kun and Xiao Jun. Look closer, ask questions, and discover the great story of the Bible."}<br />{zh ? "先从《创世记》的第一声「要有光」开始吧。" : "Start in Genesis, with “Let there be light.”"}</p>
          <Link className="begin" href="/comic">{zh ? "开始看漫画" : "Read the comic"} <span>→</span></Link>
          <a className="comic-preview-link" href="#library">{zh ? "逛逛漫画书架" : "Explore the comic shelf"} ↓</a>
          <p className="hero-edition">{zh ? "第一集 · 故事开始以前 · 中文漫画预览" : "Episode 01 · Before the story begins · Chinese comic preview"}</p>
        </div>
        <Link className="hero-comic-cover" href="/comic" aria-label={zh ? "打开圣经漫画故事封面" : "Open the Bible comic cover"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/comics/book-v1/cover-v1.png" alt={zh ? "小昆、小君与圣经人物的漫画封面" : "Comic cover with Xiao Kun, Xiao Jun and Bible characters"} width={1024} height={1536} fetchPriority="high" />
        </Link>
      </section>

      <section className="library app-reveal reveal-4 is-visible" id="library">
        <div className="library-head"><p className="eyebrow">{zh ? "漫画书架" : "THE COMIC SHELF"}</p>
          <h2>{zh ? "下一段冒险，从这里开始。" : "Your next adventure starts here."}</h2>
        </div>
        {comicChapters.map((chapter) => <Link key={chapter.id} className="comic-feature" href={"/comic/chapter/" + chapter.id}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/comics/book-v1/cover-v1.png" alt="" loading="lazy" width={1024} height={1536} />
          <span><small>{zh ? `第 ${chapter.number} 集 · ${chapter.book} · 中文漫画初稿` : `Episode ${chapter.number} · Chinese comic draft`}</small>
            <strong>{chapter.title}</strong>
            <span>{zh ? `${chapter.illustratedCount} / ${chapter.pages.length} 页已绘制 · ${chapter.reference}` : `${chapter.illustratedCount} of ${chapter.pages.length} pages illustrated · ${chapter.reference}`}</span>
            <b>{zh ? "进入这一集" : "Open episode"} →</b>
          </span>
        </Link>)}
        <details className="complete-library">
          <summary><span>{zh ? "浏览六十六卷书" : "Explore all 66 books"}<small>{zh ? "漫画章节会陆续添加 · 旧约 39 卷 · 新约 27 卷" : "Comic chapters added over time · 39 Old Testament · 27 New Testament"}</small></span><b aria-hidden="true">＋</b></summary>
          {[{name: zh ? "旧约" : "OLD TESTAMENT", list: books.slice(0,39)}, {name: zh ? "新约" : "NEW TESTAMENT", list: books.slice(39)}].map((group) => <div key={group.name}>
            <div className="testament"><span>{group.name}</span><span>{group.list.length}</span></div>
            <div className="book-grid">{group.list.map(([nameZh,nameEn]) => nameZh === "创世记"
              ? <Link key={nameEn} className="book-card available" href="/comic/contents"><b>{zh ? nameZh : nameEn}</b><small>{zh ? "看漫画" : "Read comic"}</small></Link>
              : <button key={nameEn} className="book-card coming" disabled><b>{zh ? nameZh : nameEn}</b><small>{zh ? "漫画筹备中" : "Comics coming later"}</small></button>
            )}</div>
          </div>)}
        </details>
      </section>

      {mobileSettingsOpen && <div className="mobile-settings-layer">
        <button className="mobile-settings-backdrop" onClick={() => setMobileSettingsOpen(false)} aria-label={zh ? "关闭设置" : "Close settings"} />
        <section className="mobile-settings-sheet" role="dialog" aria-modal="true" aria-label={zh ? "阅读设置" : "Reading settings"}>
          <div className="sheet-handle" aria-hidden="true" />
          <div className="sheet-heading"><div><small>PCMC</small><h2>{zh ? "阅读设置" : "Reading settings"}</h2></div><button onClick={() => setMobileSettingsOpen(false)} aria-label={zh ? "关闭" : "Close"}>×</button></div>
          <div className="setting-row"><span>{zh ? "界面语言" : "Interface language"}</span><div className="language-switch" role="group" aria-label="Interface language">
            <button className={zh ? "selected" : ""} onClick={() => setLanguage("zh")}>中文</button><button className={!zh ? "selected" : ""} onClick={() => setLanguage("en")}>English</button>
          </div></div>
          <p>{zh ? "漫画目前为中文版。" : "Comic pages are currently in Chinese."}</p>
          <button className="setting-row setting-action" onClick={() => setTheme(theme === "light" ? "dark" : "light")}><span>{zh ? "外观" : "Appearance"}</span><b>{theme === "light" ? "☾ Dark" : "☀ Light"}</b></button>
          <PwaInstaller language={language} />
        </section>
      </div>}
      <nav className="mobile-app-nav" aria-label={zh ? "应用导航" : "App navigation"}>
        <Link className="active" href="/" aria-current="page"><span aria-hidden="true">⌂</span>{zh ? "首页" : "Home"}</Link>
        <Link href="/comic/contents"><span aria-hidden="true">▦</span>{zh ? "漫画目录" : "Contents"}</Link>
        <Link href={readHref}><span aria-hidden="true">◉</span>{zh ? "看漫画" : "Read"}</Link>
      </nav>
      <footer>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="footer-logo" src="/pcmc-logo.png" alt="" />
        PCMC · Walk Through Bible Story · {zh ? "跟着小昆和小君，一起读漫画、认识圣经。" : "Explore the Bible in comics with Xiao Kun and Xiao Jun."}
      </footer>
    </main>
  );
}
