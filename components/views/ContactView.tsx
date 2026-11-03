import type { ComponentType } from "react";

import { ContactLine } from "@/components/ContactLine";
import { IconCode, IconDatabase, IconDownload, IconMail, IconWorkflow } from "@/components/icons";
import { LocalTimeCard } from "@/components/LocalTimeCard";
import { aboutContent } from "@/content/about";
import { contactLinks, contactPage, directLines, topics } from "@/content/contact";

import styles from "./ContactView.module.css";
import view from "./View.module.css";

const TOPIC_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Automation: IconWorkflow,
  Backend: IconDatabase,
  "AI agents": IconCode,
};

/**
 * Desktop: section (hero + CTAs, topics) beside aside (time card, direct lines).
 * Mobile: hero -> time card -> direct lines -> topics. Only non-focusable blocks (time card, topics) move.
 */
export function ContactView() {
  const [firstLine, secondLine] = contactPage.titleLines;

  return (
    <div className={`${view.row} ${styles.row}`}>
      <div className={styles.main}>
        <section className={styles.hero} aria-labelledby="contact-title">
          <span className={view.chip}>
            <span className={styles.dot} aria-hidden="true" />
            {aboutContent.availability.chip}
          </span>
          <h1 id="contact-title" className={view.title}>
            {firstLine} <br className={styles.titleBreak} />
            {secondLine}
          </h1>
          <p className={`${view.intro} ${styles.body}`}>{contactPage.body}</p>
          <div className={styles.ctas}>
            <a href={contactLinks.email.href} className={`${view.cta} ${view.ctaPrimary}`}>
              <IconMail size={18} />
              Email Peter
            </a>
            <a
              href="/resume.pdf"
              download="Peter-Gabriel-Lopez-Resume.pdf"
              className={`${view.cta} ${view.ctaSecondary}`}
              aria-label="Download résumé (PDF)"
            >
              <IconDownload size={18} />
              <span className={styles.ctaLong}>Download résumé</span>
              <span className={styles.ctaShort}>Résumé</span>
            </a>
          </div>
        </section>

        <section className={styles.topics} aria-labelledby="topics-title">
          <h2 id="topics-title" className={styles.topicsTitle}>
            {contactPage.topicsLabel}
          </h2>
          <ul className={styles.topicList}>
            {topics.map(({ title, text }) => {
              const Icon = TOPIC_ICONS[title] ?? IconWorkflow;
              return (
                <li key={title} className={styles.topic}>
                  <Icon className={styles.topicIcon} />
                  <span className={styles.topicText}>
                    <span className={styles.topicName}>{title}</span>
                    <span className={styles.topicBody}>{text}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <div className={styles.side}>
        <div className={styles.time}>
          <LocalTimeCard detail="languages" />
        </div>
        <section className={styles.lines} aria-labelledby="lines-title">
          <h2 id="lines-title" className={styles.linesTitle}>
            Direct lines
          </h2>
          <ul className={styles.lineList}>
            {directLines.map((link) => (
              <li key={link.kind} className={styles.lineItem}>
                <ContactLine link={link} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
