import reflections from "./reflections.json";
import type { Language } from "../use-language";
import styles from "./comic.module.css";

export function reflectionForChapter(chapterId: string) {
  return reflections[chapterId as keyof typeof reflections];
}

export default function ReflectionPage({ chapterId, language }: { chapterId: string; language: Language }) {
  const content = reflectionForChapter(chapterId)?.[language];
  if (!content) return null;
  const zh = language === "zh";
  return <section className={styles.reflection} aria-labelledby="reflection-title" lang={zh ? "zh-Hans" : "en"}>
    <header className={styles.reflectionHeading}>
      <h2 id="reflection-title">{zh ? "反思问题" : "Reflection Questions"}</h2>
      <div className={styles.reflectionReferences} aria-label={zh ? "参考经文" : "Scripture references"}>
        {content.references.map((reference) => <p key={reference.label}><span>{reference.label}</span>{reference.passage}</p>)}
      </div>
      <h3 className={styles.reflectionTopic}>{content.title}</h3>
    </header>
    <section className={styles.reflectionCard} aria-labelledby="scenario-heading">
      <h3 id="scenario-heading">{content.scenarioTitle}</h3>
      {content.scenario.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </section>
    <section className={styles.reflectionPrompt} aria-labelledby="reflection-question">
      <h3 id="reflection-question">{zh ? "如果是你，你会怎么做？" : "If it were you, what would you do?"}</h3>
      <p>{zh ? "先一起读以上经文，留意上下文，再分享：经文怎样帮助我们理解这个情境，并决定如何回应？" : "Read the passages together in context, then share: How does Scripture help us understand this situation and decide how to respond?"}</p>
    </section>
  </section>;
}
