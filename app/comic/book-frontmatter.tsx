"use client";

import { useState } from "react";
import Link from "next/link";
import { comicBook, comicChapters } from "./book-data";
import reader from "./comic.module.css";
import styles from "./book.module.css";

type Section = "cover" | "characters" | "contents" | "chapter";
const steps = [
  { id: "cover", label: "封面", href: "/comic" },
  { id: "characters", label: "主角介绍", href: "/comic/characters" },
  { id: "contents", label: "目录", href: "/comic/contents" },
];

export default function BookFrontmatter({ section, chapterId }: { section: Section; chapterId?: string }) {
  const [dark, setDark] = useState(false);
  const chapter = comicChapters.find((item) => item.id === chapterId);
  const title = section === "cover" ? comicBook.title : section === "characters" ? "先认识两位旅伴" : section === "contents" ? "目录" : chapter?.title;
  const characters = section === "chapter"
    ? comicBook.characters.filter((person) => chapter?.characterIds.includes(person.id))
    : comicBook.characters.filter((person) => comicBook.mainCharacterIds.includes(person.id));
  return (
    <main className={reader.reader} data-theme={dark ? "dark" : "light"}>
      <header className={reader.header}>
        <Link className={reader.brand} href="/" aria-label="PCMC Walk Through Bible Story 首页">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pcmc-logo.png" alt="" width={36} height={36} />
          <span>{comicBook.imprint}</span>
        </Link>
        <button className={reader.control} aria-pressed={dark} onClick={() => setDark(!dark)}>{dark ? "浅色" : "深色"}</button>
      </header>
      <nav className={styles.steps} aria-label="漫画书前置页">
        {steps.map((step, index) => <Link key={step.id} href={step.href} aria-current={section === step.id ? "page" : undefined}><small>0{index + 1}</small>{step.label}</Link>)}
      </nav>
      <div className={styles.body}>
        <div className={styles.heading}>
          <p className={reader.eyebrow}>{section === "chapter" ? "CHAPTER " + String(chapter?.number).padStart(2, "0") : "PCMC · BIBLE COMICS"}</p>
          <h1>{title}</h1>
          <p>{section === "cover" ? comicBook.subtitle : section === "characters" ? "两位现代学生，也是和你一起探索故事的朋友。" : section === "contents" ? "故事会一章一章更新。从这里，找到下一段旅程。" : chapter?.summary}</p>
        </div>

        {section === "cover" && (
          <div className={styles.coverLayout}>
            {comicBook.coverImage ? (
              <div className={styles.coverArt}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={comicBook.coverImage} alt="圣经漫画故事封面：小昆、小君与跨时代的圣经人物群像。" width={1024} height={1536} />
                <p>封面为跨时代人物群像，不代表他们在故事中同时相遇。</p>
              </div>
            ) : (
              <div className={styles.coverPending}>
                <span className={reader.badge}>封面插画待生成</span>
                <h2>先翻开，认识他们。</h2>
                <p>群像封面将以小昆、小君和圣经人物为主角。先前的角色设定图与第一集漫画已经可以阅读。</p>
              </div>
            )}
            <div className={styles.coverCopy}>
              <span className={reader.badge}>可爱漫画 · 圣经探索</span>
              <h2>从一个问题，<br />走进一个大故事。</h2>
              <p>小昆想问个明白，小君想看得仔细。两人一边探索、一边发问，走进他们原本只在书里读过的世界。</p>
              <Link className={styles.primary} href="/comic/characters">翻开人物介绍 →</Link>
              <Link className={styles.secondary} href="/comic/contents">直接查看目录</Link>
              <p className={styles.disclaimer}>两位主角与穿越框架为虚构；圣经事件依据经文展开。两人到福音书才在剧情中遇见耶稣。</p>
            </div>
          </div>
        )}

        {section === "characters" && (
          <>
            <div className={styles.characterArt}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={comicBook.characterSheet} alt="已确认的小昆、小君角色设定：正面、侧面、背面，以及开心、惊讶、害怕、思考的表情。" width={1536} height={1024} />
              <a href={comicBook.characterSheet} target="_blank" rel="noreferrer">放大查看角色设定 ↗</a>
            </div>
            <div className={styles.characterGrid}>{characters.map((person) => <section key={person.id} className={styles.characterCard}>
              <small>现代学生 · 虚构主角</small>
              <h2>{person.name}</h2><h3>{person.tagline}</h3>
              <blockquote>“{person.quote}”</blockquote>
              <p>{person.bio}</p><span>{person.appearance}</span>
            </section>)}</div>
            <p className={styles.disclaimer}>小君并不是什么都懂，小昆也不只是负责出糗。他们会害怕、会判断错，也会一起学习。</p>
            <div className={styles.actions}><Link className={reader.control} href="/comic">← 封面</Link><Link className={styles.primary} href="/comic/contents">认识了，去看看目录 →</Link></div>
          </>
        )}

        {section === "contents" && (
          <>
            <ol className={styles.chapterList}>
              {comicChapters.map((item) => <li key={item.id}>
                <Link href={"/comic/chapter/" + item.id}>
                  <span className={styles.chapterNumber}>{String(item.number).padStart(2, "0")}</span>
                  <span className={styles.chapterCopy}><small>{item.book} · {item.reference}</small><strong>{item.title}</strong><span>{item.summary}</span><span className={styles.chapterMeta}>{item.pages.length} 页 · {item.panelCount} 格 · {item.illustratedCount} 页已有画面</span></span>
                  <span className={styles.chapterArrow} aria-hidden="true">→</span>
                </Link>
              </li>)}
            </ol>
            <p className={styles.disclaimer}>当前第一章为预览初稿。新增章节会加入这里；每章新人物会在正文前介绍。</p>
            <div className={styles.actions}><Link className={reader.control} href="/comic/characters">← 主角介绍</Link><Link className={reader.control} href="/#library">返回 App 书架</Link></div>
          </>
        )}

        {section === "chapter" && chapter && (
          <>
            <div className={styles.chapterFacts}><span>{chapter.reference}</span><span>{chapter.pages.length} 页 / {chapter.panelCount} 格</span><span>{chapter.illustratedCount} 页已有画面 · 预览初稿</span></div>
            <section className={styles.castSection}>
              <h2>本章人物</h2>
              <div className={styles.castList}>{characters.map((person) => <article key={person.id}>
                <small>{chapter.newCharacterIds.includes(person.id) ? "新登场" : "一起探索的旅伴"}</small>
                <h3>{person.name}</h3><p>{chapter.newCharacterIds.includes(person.id) ? person.bio : person.tagline}</p>
                {person.reference && <p>{person.reference}</p>}
              </article>)}</div>
              <p className={styles.disclaimer}>{chapter.introduction}</p>
            </section>
            <details className={styles.breakdown}>
              <summary>这一章怎样展开？查看每页内容与格数</summary>
              <ol>{chapter.pages.map((page) => <li key={page.id}><Link href={"/comic/read?chapter=" + chapter.id + "&page=" + page.id}><span>第 {page.id} 页 · {page.title}</span><small>{page.panels.length} 格{!page.image ? " · 待绘制" : ""}</small></Link><p>{page.panels[0].shot}</p></li>)}</ol>
            </details>
            <p className={styles.disclaimer}>阅读提示：矩形框是经文旁白，圆角气泡是人物对白。每页下方有详细分镜，以及尚未写回图片的对白润色稿。</p>
            <div className={styles.actions}><Link className={reader.control} href="/comic/contents">← 总目录</Link><Link className={styles.primary} href={"/comic/read?chapter=" + chapter.id + "&page=1"}>进入第一幕 →</Link></div>
          </>
        )}
      </div>
    </main>
  );
}
