import content from "./success-reflection.json";
import type { Language } from "../use-language";
import styles from "./comic.module.css";

export default function SuccessReflection({ language }: { language: Language }) {
  const copy = content[language];
  return <section className={styles.successReflection} aria-labelledby="success-reflection-title" lang={language === "zh" ? "zh-Hans" : "en"}>
    <header className={styles.successHeading}>
      <p className={styles.successDuration}>{copy.duration}</p>
      <h2 id="success-reflection-title">{copy.title}</h2>
      <p className={styles.successIntro}>{copy.intro}</p>
    </header>
    <div className={styles.successQuestions}>
      {copy.questions.map((question, questionIndex) => <fieldset className={styles.successQuestion} key={question.id}>
        <legend><span className={styles.successNumber} aria-hidden="true">Q{questionIndex + 1}</span>{question.question}</legend>
        <div className={styles.successOptions}>
          {question.options.map((option, optionIndex) => <label className={styles.successOption} key={optionIndex}>
            <input type="radio" name={`babel-reflection-${question.id}`} value={String(optionIndex)} />
            <span className={styles.successLetter} aria-hidden="true">{String.fromCharCode(65 + optionIndex)}.</span>
            <span>{option}</span>
          </label>)}
        </div>
      </fieldset>)}
    </div>
    <section className={styles.successSummary} aria-labelledby="success-summary-title">
      <h3 id="success-summary-title">{copy.summaryTitle}</h3>
      <p>{copy.summary}</p>
    </section>
  </section>;
}
