"use client";

import { useEffect, useRef, useState } from "react";
import { detailedPages } from "./story-data";
import { PwaInstaller } from "./pwa-installer";

type Page = {
  section: string;
  titleZh: string;
  titleEn: string;
  zh: string;
  en: string;
  reference: string;
  scene: string;
  image?: string;
  isReflection?: boolean;
  questionsZh?: string[];
  questionsEn?: string[];
};
type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => unknown;
};

const legacyPages: Page[] = [
  {
    section: "起初 · In the Beginning",
    titleZh: "神创造天地",
    titleEn: "God Creates the World",
    zh: "起初，神创造天地。那时，地是空虚混沌，深渊上面一片黑暗；但神的灵运行在水面上。神说：“要有光。”光就出现了。神把光暗分开，称光为昼，称暗为夜。这个故事一开始就告诉我们：光、生命、秩序和美好，都从创造主神而来。",
    en: "In the beginning, God created the heavens and the earth. The earth was formless and empty, darkness covered the deep waters, and the Spirit of God moved over the waters. Then God said, “Let there be light,” and there was light. God separated the light from the darkness, calling the light day and the darkness night. From the very beginning, light, life, order, and goodness come from God our Creator.",
    reference: "创世记 Genesis 1:1–5",
    scene: "light",
    image: "/genesis-creation.png",
  },
  {
    section: "创造 · Creation",
    titleZh: "一个有秩序的世界",
    titleEn: "A World Made with Order",
    zh: "神创造天空、海洋和陆地；祂使地长出青草、菜蔬和结果子的树。祂又创造日、月和星辰，叫它们管理昼夜。第五天，神创造海里的鱼和空中的鸟；第六天，祂创造地上的牲畜、昆虫和野兽。神每一次创造以后，都看着是好的。",
    en: "God made the sky, the seas, and the dry land. He caused grass, plants, and fruit trees to grow. He made the sun, moon, and stars to mark day and night. On the fifth day, God made fish and birds; on the sixth day, He made animals that live on the earth. After each part of creation, God saw that it was good.",
    reference: "创世记 Genesis 1:6–25",
    scene: "garden",
    image: "/genesis-creation-order.png",
  },
  {
    section: "人的开始 · The Beginning of Humanity",
    titleZh: "神按自己的形象造人",
    titleEn: "Made in God’s Image",
    zh: "在创造的最后，神按着自己的形象造人，造男造女。祂赐福给他们，也把管理地上受造物的责任交给他们。人不是偶然出现的；每一个人都有神所赐的价值，也受托好好照顾神所创造的世界。神看着一切所造的都甚好。",
    en: "At the end of creation, God made people in His own image—male and female. He blessed them and gave them the responsibility to care for the living things on earth. People are not an accident. Every person has God-given worth and is entrusted to care well for God’s world. God saw everything He had made, and it was very good.",
    reference: "创世记 Genesis 1:26–31",
    scene: "people",
  },
  {
    section: "伊甸园 · The Garden",
    titleZh: "丰盛，也有界限",
    titleEn: "Abundance and a Boundary",
    zh: "神把亚当安置在伊甸园，使他修理、看守园子。园中有各样美好的树，果子可以作食物。神说：“园中各样树上的果子，你可以随意吃；只是分别善恶树上的果子，你不可吃。”神给人丰富的供应，也给人清楚的界限，邀请人相信祂的话是好的。",
    en: "God placed Adam in the garden of Eden to work it and take care of it. The garden was full of beautiful trees with good fruit to eat. God said, “You are free to eat from any tree in the garden; but you must not eat from the tree of the knowledge of good and evil.” God gave people abundance, and also a clear boundary, inviting them to trust that His words are good.",
    reference: "创世记 Genesis 2:8–17",
    scene: "tree",
  },
  {
    section: "人的选择 · A Human Choice",
    titleZh: "人选择不听从神",
    titleEn: "Choosing Not to Obey",
    zh: "蛇引诱夏娃，使她怀疑神的话。夏娃看见分别善恶树的果子好作食物、悦人眼目，又能使人有智慧，就摘下来吃了；她也给亚当，亚当也吃了。他们没有相信神的命令，反而选择自己决定什么是对、什么是错。",
    en: "The serpent tempted Eve and made her question God’s word. She saw that the fruit of the tree was good for food, pleasing to the eye, and desirable for gaining wisdom. So she ate it and gave some to Adam, and he ate it too. Instead of trusting God’s command, they chose to decide for themselves what was right and wrong.",
    reference: "创世记 Genesis 3:1–7",
    scene: "choice",
  },
  {
    section: "破裂 · Brokenness",
    titleZh: "罪带来羞耻与躲避",
    titleEn: "Sin Brings Shame and Hiding",
    zh: "亚当和夏娃吃了果子以后，发现自己赤身露体，就感到羞耻。当他们听见神的声音，就躲起来。神问亚当：“你在哪里？”他们害怕，也开始彼此推卸责任。罪使人躲避神，也让人与人之间的关系破裂。最后，他们离开了伊甸园。",
    en: "After Adam and Eve ate the fruit, they realized they were naked and felt ashamed. When they heard God, they hid. God called to Adam, “Where are you?” They were afraid and began to blame each other. Sin makes people hide from God and breaks relationships with one another. In the end, they left the garden of Eden.",
    reference: "创世记 Genesis 3:8–24",
    scene: "shadow",
  },
  {
    section: "罪的扩散 · Sin Spreads",
    titleZh: "该隐与亚伯",
    titleEn: "Cain and Abel",
    zh: "该隐和亚伯都向神献祭。该隐因神看中亚伯和他的供物，就大大地发怒。神提醒该隐，罪伏在门前，他应当制伏罪；但该隐没有听从。他把亚伯带到田间，并杀了自己的弟弟。嫉妒和愤怒若不被面对，可能会变成伤害别人的行动。",
    en: "Cain and Abel both brought offerings to God. Cain became very angry when God looked with favor on Abel and his offering. God warned Cain that sin was waiting at the door and that he should master it. But Cain did not listen. He took Abel to a field and killed his brother. Jealousy and anger, when left unchecked, can grow into actions that hurt others.",
    reference: "创世记 Genesis 4:1–16",
    scene: "field",
  },
  {
    section: "洪水之前 · Before the Flood",
    titleZh: "挪亚在神眼前蒙恩",
    titleEn: "Noah Finds Favor",
    zh: "人的罪恶越来越大，地上也充满强暴。神看见人败坏了行为，就决定审判这败坏的世界。但是，挪亚在耶和华眼前蒙恩。经文说，挪亚是个义人，并且与神同行。当世界越来越远离神时，挪亚选择相信神、跟随神。",
    en: "Human evil grew greater and the earth was full of violence. God saw that people had corrupted their ways, and He decided to judge the broken world. Yet Noah found favor in the eyes of the Lord. Scripture says that Noah was a righteous man who walked with God. While the world moved farther from God, Noah chose to trust and follow Him.",
    reference: "创世记 Genesis 6:5–13",
    scene: "rain",
  },
  {
    section: "方舟 · The Ark",
    titleZh: "神预备拯救的道路",
    titleEn: "God Prepares a Way of Rescue",
    zh: "神告诉挪亚，洪水将要临到地上；祂也吩咐挪亚造一只方舟，带着家人和各类活物进入方舟，好保全生命。挪亚没有看见洪水，却相信神所说的话。他照着神所吩咐的一切去做。神的审判是真实的；神的拯救也是真实的。",
    en: "God told Noah that a flood was coming, and commanded him to build an ark. Noah was to bring his family and living creatures into it so that life would be preserved. Noah had not seen the flood, but he trusted what God had said. He did everything God commanded. God’s judgment is real, and so is God’s rescue.",
    reference: "创世记 Genesis 6:14–22; 7:1–10",
    scene: "ark",
  },
  {
    section: "洪水 · The Flood",
    titleZh: "神记念挪亚",
    titleEn: "God Remembers Noah",
    zh: "洪水临到地上，水势浩大。方舟以外的生命都灭绝了；但方舟里的挪亚一家和活物得以保全。后来，经文说：“神记念挪亚。”神使风吹地，洪水渐渐退去。方舟停住，地也慢慢干了。在审判中，神没有忘记祂所拯救的人。",
    en: "The flood came upon the earth and the waters rose greatly. Life outside the ark perished, but Noah’s family and the animals in the ark were kept safe. Then Scripture says, “God remembered Noah.” God sent a wind over the earth, and the waters began to go down. The ark came to rest and the land slowly dried. In judgment, God did not forget those He rescued.",
    reference: "创世记 Genesis 7:11–24; 8:1–19",
    scene: "dove",
  },
  {
    section: "应许 · Promise",
    titleZh: "彩虹：神守约的记号",
    titleEn: "The Rainbow: A Sign of God’s Promise",
    zh: "挪亚出了方舟后，筑坛敬拜神。神与挪亚、他的后代和一切活物立约，答应不再用洪水毁灭全地。神把彩虹放在云中，作为这个约的记号。彩虹提醒我们：神是公义的，祂认真对待罪；神也是信实和怜悯的，祂守住自己的应许。",
    en: "After Noah left the ark, he built an altar and worshiped God. God made a covenant with Noah, his descendants, and every living creature. He promised never again to destroy the whole earth with a flood. God placed the rainbow in the clouds as the sign of this covenant. The rainbow reminds us that God is just and takes sin seriously; He is also faithful, merciful, and keeps His promises.",
    reference: "创世记 Genesis 8:20–22; 9:8–17",
    scene: "rainbow",
  },
];

const pages = detailedPages;

const sceneArt: Record<string, string> = {
  light: "✦",
  garden: "❋",
  people: "◐",
  tree: "♧",
  choice: "◒",
  shadow: "◑",
  field: "⌁",
  rain: "☂",
  ark: "⌒",
  dove: "⌁",
  rainbow: "◜",
  reflection: "✦",
};

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

export default function Home() {
  const [pageIndex, setPageIndex] = useState(0);
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [view, setView] = useState<"home" | "reader">("home");
  const [hasSavedPosition, setHasSavedPosition] = useState(false);
  const [hasHydratedProgress, setHasHydratedProgress] = useState(false);
  const [isLaunching, setIsLaunching] = useState(true);
  const [libraryVisible, setLibraryVisible] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<"home" | "library">("home");
  const [pageDirection, setPageDirection] = useState<"next" | "previous">(
    "next",
  );
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(
    null,
  );
  const libraryRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const savedValue = window.localStorage.getItem("pcmc-bible-story-page");
    const savedIndex = Number(savedValue);
    if (
      savedValue !== null &&
      Number.isInteger(savedIndex) &&
      savedIndex >= 0 &&
      savedIndex < pages.length
    ) {
      setPageIndex(savedIndex);
      setHasSavedPosition(true);
    }
    setHasHydratedProgress(true);
  }, []);
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hasSeenLaunch =
      window.localStorage.getItem("pcmc-launch-seen") === "true";
    if (reducedMotion || hasSeenLaunch) {
      setIsLaunching(false);
      return;
    }
    window.localStorage.setItem("pcmc-launch-seen", "true");
    const timer = window.setTimeout(() => setIsLaunching(false), 3000);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (hasHydratedProgress) {
      window.localStorage.setItem("pcmc-bible-story-page", String(pageIndex));
    }
  }, [hasHydratedProgress, pageIndex]);
  useEffect(() => {
    const library = libraryRef.current;
    if (!library || !("IntersectionObserver" in window)) {
      setLibraryVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLibraryVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "80px 0px", threshold: 0.08 },
    );
    observer.observe(library);
    return () => observer.disconnect();
  }, [view]);
  const page = pages[pageIndex];
  const runTransition = (update: () => void) => {
    const startViewTransition = (document as ViewTransitionDocument)
      .startViewTransition;
    if (startViewTransition) startViewTransition.call(document, update);
    else update();
  };
  const goToPage = (nextIndex: number) => {
    const clampedIndex = Math.min(Math.max(nextIndex, 0), pages.length - 1);
    if (clampedIndex === pageIndex) return;
    setHasSavedPosition(true);
    setPageDirection(clampedIndex > pageIndex ? "next" : "previous");
    runTransition(() => setPageIndex(clampedIndex));
    window.setTimeout(
      () => document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" }),
      60,
    );
  };
  const go = (direction: number) => {
    setHasSavedPosition(true);
    goToPage(pageIndex + direction);
  };
  const continueReading = () => {
    setHasSavedPosition(true);
    setMobileSettingsOpen(false);
    runTransition(() => setView("reader"));
    window.setTimeout(
      () => document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" }),
      60,
    );
  };
  const changeLanguage = (nextLanguage: "zh" | "en") =>
    runTransition(() => setLanguage(nextLanguage));
  const changeTheme = () =>
    runTransition(() => setTheme(theme === "light" ? "dark" : "light"));
  const showHome = () => {
    setMobileSettingsOpen(false);
    setMobileSection("home");
    runTransition(() => setView("home"));
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };
  const showLibrary = () => {
    setMobileSettingsOpen(false);
    setMobileSection("library");
    runTransition(() => setView("home"));
    window.setTimeout(
      () => document.querySelector("#library")?.scrollIntoView({ behavior: "smooth" }),
      80,
    );
  };
  useEffect(() => {
    if (!mobileSettingsOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileSettingsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileSettingsOpen]);
  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };
  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    const start = touchStart.current;
    const touch = event.changedTouches[0];
    touchStart.current = null;
    if (!start || !touch) return;
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (
      Date.now() - start.time > 700 ||
      Math.abs(deltaX) < 48 ||
      Math.abs(deltaX) <= Math.abs(deltaY) * 1.2
    )
      return;
    go(deltaX < 0 ? 1 : -1);
  };
  return (
    <main
      className={`theme-${theme} motion-${pageDirection} ${isLaunching ? "is-launching" : ""}`}
    >
      {isLaunching && (
        <div
          className="launch-screen"
          role="status"
          aria-label="PCMC Walk Through Bible Story"
        >
          <div className="launch-halo" aria-hidden="true" />
          <img
            className="launch-mark"
            src="/pcmc-logo.png"
            alt="PCMC church logo"
          />
          <p>PCMC</p>
          <h1>Walk Through Bible Story</h1>
          <span>THE GREAT STORY BEGINS</span>
        </div>
      )}
      <div className="grain" aria-hidden="true" />
      <header className="topbar app-reveal reveal-1">
        <button
          className="brand"
          onClick={showHome}
          aria-label="PCMC Walk Through Bible Story home"
        >
          <img className="brand-mark" src="/pcmc-logo.png" alt="" />
          <span className="brand-full">PCMC Walk Through Bible Story</span>
          <span className="brand-short">PCMC Bible Story</span>
        </button>
        <div className="header-right desktop-controls">
          <PwaInstaller language={language} />
          <button className="home-link" onClick={showHome}>
            {language === "zh" ? "首页" : "Home"}
          </button>
          <div
            className="language-switch"
            role="group"
            aria-label="Language selector"
          >
            <button
              className={language === "zh" ? "selected" : ""}
              onClick={() => changeLanguage("zh")}
            >
              中
            </button>
            <button
              className={language === "en" ? "selected" : ""}
              onClick={() => changeLanguage("en")}
            >
              EN
            </button>
          </div>
          <button
            className="theme-switch"
            onClick={changeTheme}
            aria-label="Toggle light or dark theme"
          >
            <span>{theme === "light" ? "☾" : "☀"}</span>
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
        <button
          className="mobile-settings-trigger"
          onClick={() => setMobileSettingsOpen(true)}
          aria-label={language === "zh" ? "打开阅读设置" : "Open reading settings"}
          aria-expanded={mobileSettingsOpen}
        >
          <span aria-hidden="true">•••</span>
        </button>
      </header>
      {view === "home" && hasSavedPosition && (
        <section
          className="continue-reading app-reveal reveal-2"
          aria-label={language === "zh" ? "继续阅读" : "Continue reading"}
        >
          <div className="continue-art" aria-hidden="true">
            <img src="/genesis-creation.png" alt="" />
          </div>
          <div className="continue-copy">
            <p>{language === "zh" ? "继续阅读" : "CONTINUE READING"}</p>
            <h2>
              {language === "zh"
                ? "创世记 · 起初的故事"
                : "Genesis · The Beginning"}
            </h2>
            <span>
              {language === "zh"
                ? "你已读到第 " +
                  (pageIndex + 1) +
                  " 页，共 " +
                  pages.length +
                  " 页"
                : "Page " + (pageIndex + 1) + " of " + pages.length}
            </span>
            <div className="progress-track">
              <i
                style={{
                  width: String(((pageIndex + 1) / pages.length) * 100) + "%",
                }}
              />
            </div>
          </div>
          <button className="continue-button" onClick={continueReading}>
            {hasSavedPosition
              ? language === "zh"
                ? "继续"
                : "Continue"
              : language === "zh"
                ? "开始阅读"
                : "Start reading"}{" "}
            <span>→</span>
          </button>
        </section>
      )}
      {view === "home" ? (
        <>
          <section className="hero app-reveal reveal-3" id="top">
            <p className="eyebrow">
              PCMC PRESENTS ·{" "}
              {language === "zh"
                ? "圣经故事电子书"
                : "A DIGITAL BIBLE STORYBOOK"}
            </p>
            <h1>
              <span className="hero-pcmc">PCMC</span>
              <span className="hero-title-main">Walk Through Bible</span>
              <span className="hero-title-sub">Story</span>
            </h1>
            <p className="hero-copy">
              {language === "zh" ? (
                <>
                  从《创世记》到《启示录》，一卷一卷走进圣经的大故事。
                  <br />
                  选择一本书，开始你的阅读旅程。
                </>
              ) : (
                <>
                  From Genesis to Revelation, walk through the great story of
                  the Bible—one book at a time.
                  <br />
                  Choose a book and begin your journey.
                </>
              )}
            </p>
            <a className="begin" href="#library" onClick={() => setMobileSection("library")}>
              {language === "zh" ? "探索六十六卷书" : "Explore all 66 books"}{" "}
              <span>↓</span>
            </a>
          </section>
          <section
            ref={libraryRef}
            className={`library app-reveal reveal-4 ${libraryVisible ? "is-visible" : ""}`}
            id="library"
          >
            <div className="library-head">
              <p className="eyebrow">
                {language === "zh" ? "圣经书架" : "THE BIBLE LIBRARY"}
              </p>
              <h2>
                {language === "zh"
                  ? "六十六卷书，一个大故事。"
                  : "Sixty-six books. One great story."}
              </h2>
            </div>
            <button className="featured-book" onClick={continueReading}>
              <span className="featured-book-art" aria-hidden="true">
                <img src="/genesis-creation.png" alt="" />
              </span>
              <span className="featured-book-copy">
                <small>{language === "zh" ? "现已开放 · 第一卷" : "AVAILABLE NOW · BOOK ONE"}</small>
                <strong>{language === "zh" ? "创世记：起初的故事" : "Genesis: The Beginning"}</strong>
                <span>
                  {language === "zh"
                    ? `4 个故事 · ${pages.length} 页 · 中英文阅读`
                    : `4 stories · ${pages.length} pages · Bilingual reading`}
                </span>
                <b>{language === "zh" ? "开始阅读" : "Read now"} →</b>
              </span>
            </button>
            <details className="complete-library">
              <summary>
                <span>
                  {language === "zh" ? "浏览完整圣经书架" : "Explore the complete Bible library"}
                  <small>{language === "zh" ? "旧约 39 卷 · 新约 27 卷" : "39 Old Testament · 27 New Testament"}</small>
                </span>
                <b aria-hidden="true">＋</b>
              </summary>
              <div className="testament">
                <span>{language === "zh" ? "旧约" : "OLD TESTAMENT"}</span>
                <span>39</span>
              </div>
              <div className="book-grid">
                {books.slice(0, 39).map(([zh, en], index) => (
                  <button
                    key={en}
                    className={`book-card ${index === 0 ? "available" : "coming"}`}
                    style={{ "--card-order": index % 5 } as React.CSSProperties}
                    onClick={() => index === 0 && continueReading()}
                    disabled={index !== 0}
                  >
                    <b>{language === "zh" ? zh : en}</b>
                    <small>
                      {index === 0
                        ? language === "zh" ? "开始阅读" : "Read now"
                        : language === "zh" ? "即将收录" : "Coming soon"}
                    </small>
                  </button>
                ))}
              </div>
              <div className="testament">
                <span>{language === "zh" ? "新约" : "NEW TESTAMENT"}</span>
                <span>27</span>
              </div>
              <div className="book-grid">
                {books.slice(39).map(([zh, en], index) => (
                  <button
                    key={en}
                    className="book-card coming"
                    style={{ "--card-order": index % 5 } as React.CSSProperties}
                    disabled
                  >
                    <b>{language === "zh" ? zh : en}</b>
                    <small>{language === "zh" ? "即将收录" : "Coming soon"}</small>
                  </button>
                ))}
              </div>
            </details>
          </section>
        </>
      ) : (
        <section
          className={`book-area app-surface ${page.image ? "cinematic-reader" : ""}`}
          id="book"
          aria-label="Bible story reader"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            className="back-to-library"
            onClick={showLibrary}
          >
            ← {language === "zh" ? "回到书架" : "Back to library"}
          </button>
          <div className="reader-label">
            <span>
              {language === "zh"
                ? `第 ${String(pageIndex + 1).padStart(2, "0")} 页`
                : `PAGE ${String(pageIndex + 1).padStart(2, "0")}`}
            </span>
            <span>
              {language === "zh"
                ? page.section.split(" · ")[0]
                : page.section.split(" · ")[1]}
            </span>
          </div>
          <article
            key={`${pageIndex}-${language}`}
            className={`page scene-${page.scene} ${page.image ? "has-cinematic-image" : ""}`}
            data-direction={pageDirection}
          >
            {page.image && (
              <>
                <img
                  src={page.image}
                  alt=""
                  className="story-image"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: 0,
                  }}
                />
                <div
                  className="story-overlay"
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                    background:
                      "linear-gradient(90deg, rgba(3,3,3,.86) 0%, rgba(3,3,3,.67) 36%, rgba(3,3,3,.14) 72%, rgba(3,3,3,.18) 100%)",
                  }}
                />
              </>
            )}
            {!page.image && (
              <div className="art" aria-hidden="true">
                <span>{sceneArt[page.scene]}</span>
              </div>
            )}
            <div className="page-content">
              <p className="chapter">
                {language === "zh"
                  ? page.section.split(" · ")[0]
                  : page.section.split(" · ")[1]}
              </p>
              <h2>{language === "zh" ? page.titleZh : page.titleEn}</h2>
              <div className="rule" />
              <p className={`story ${language}`}>
                {language === "zh" ? page.zh : page.en}
              </p>
              <p className="reference">{page.reference}</p>
            </div>
          </article>
          <nav className="navigation" aria-label="Page navigation">
            <button onClick={() => go(-1)} disabled={pageIndex === 0}>
              ← {language === "zh" ? "上一页" : "Previous"}
            </button>
            <div
              className="dots"
              aria-label={`Page ${pageIndex + 1} of ${pages.length}`}
            >
              {pages.map((_, index) => (
                <button
                  key={index}
                  className={index === pageIndex ? "active" : ""}
                  onClick={() => goToPage(index)}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              disabled={pageIndex === pages.length - 1}
            >
              {language === "zh" ? "下一页" : "Next"} →
            </button>
          </nav>
        </section>
      )}
      {mobileSettingsOpen && (
        <div className="mobile-settings-layer">
          <button
            className="mobile-settings-backdrop"
            onClick={() => setMobileSettingsOpen(false)}
            aria-label={language === "zh" ? "关闭设置" : "Close settings"}
          />
          <section className="mobile-settings-sheet" role="dialog" aria-modal="true" aria-label={language === "zh" ? "阅读设置" : "Reading settings"}>
            <div className="sheet-handle" aria-hidden="true" />
            <div className="sheet-heading">
              <div>
                <small>PCMC</small>
                <h2>{language === "zh" ? "阅读设置" : "Reading settings"}</h2>
              </div>
              <button onClick={() => setMobileSettingsOpen(false)} aria-label={language === "zh" ? "关闭" : "Close"}>×</button>
            </div>
            <div className="setting-row">
              <span>{language === "zh" ? "语言" : "Language"}</span>
              <div className="language-switch" role="group" aria-label="Language selector">
                <button className={language === "zh" ? "selected" : ""} onClick={() => changeLanguage("zh")}>中文</button>
                <button className={language === "en" ? "selected" : ""} onClick={() => changeLanguage("en")}>English</button>
              </div>
            </div>
            <button className="setting-row setting-action" onClick={changeTheme}>
              <span>{language === "zh" ? "外观" : "Appearance"}</span>
              <b>{theme === "light" ? (language === "zh" ? "深色模式" : "Dark mode") : (language === "zh" ? "浅色模式" : "Light mode")}</b>
            </button>
          </section>
        </div>
      )}
      {view === "home" && (
        <nav className="mobile-app-nav" aria-label={language === "zh" ? "应用导航" : "App navigation"}>
          <button className={mobileSection === "home" ? "active" : ""} onClick={showHome} aria-current={mobileSection === "home" ? "page" : undefined}>
            <span aria-hidden="true">⌂</span>{language === "zh" ? "首页" : "Home"}
          </button>
          <button className={mobileSection === "library" ? "active" : ""} onClick={showLibrary} aria-current={mobileSection === "library" ? "page" : undefined}>
            <span aria-hidden="true">▦</span>{language === "zh" ? "书架" : "Library"}
          </button>
          <button onClick={continueReading}>
            <span aria-hidden="true">◉</span>{language === "zh" ? "阅读" : "Read"}
          </button>
        </nav>
      )}
      <footer>
        <img className="footer-logo" src="/pcmc-logo.png" alt="" />
        PCMC · Walk Through Bible Story ·{" "}
        {language === "zh"
          ? "让圣经的大故事，一页一页走进心里。"
          : "Let the great story of the Bible enter one page at a time."}
      </footer>
    </main>
  );
}
