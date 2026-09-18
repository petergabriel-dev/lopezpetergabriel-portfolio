import { aboutContent } from "@/content/about";
import { EditorShell } from "@/components/EditorShell";
import styles from "./page.module.css";

export default function Home() {
  return (
    <EditorShell availabilityLabel={aboutContent.availability}>
      <section className={styles.panel} aria-labelledby="about-heading">
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{aboutContent.eyebrow}</p>
          <h1 id="about-heading" className={styles.headline}>
            {aboutContent.headline}
          </h1>
          {aboutContent.paragraphs.map((paragraph) => (
            <p className={styles.body} key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </EditorShell>
  );
}
