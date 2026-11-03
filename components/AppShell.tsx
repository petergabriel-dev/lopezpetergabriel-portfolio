import Image from "next/image";
import type { ReactNode } from "react";

import { aboutContent } from "@/content/about";
import { contactLinks } from "@/content/contact";

import { IconBranch, IconDownload, IconMail } from "./icons";
import { SectionNav } from "./SectionNav";
import styles from "./AppShell.module.css";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.page}>
      <a href="#content" className={styles.skip}>
        Skip to content
      </a>
      <div className={styles.frame}>
        <SectionNav />
        {/* Plain div: becomes display:contents on mobile so header and main join the frame grid. */}
        <div className={styles.column}>
          <header className={styles.header}>
            <span className={styles.mark} aria-hidden="true">
              {aboutContent.initials}
            </span>
            <div className={styles.brand}>
              <span className={styles.eyebrow}>Portfolio of</span>
              <p className={styles.name}>{aboutContent.name}</p>
            </div>
            <div className={styles.actions}>
              <a
                href="/resume.pdf"
                download="Peter-Gabriel-Lopez-Resume.pdf"
                className={styles.iconButton}
                aria-label="Download résumé (PDF)"
              >
                <IconDownload />
              </a>
              <a
                href={contactLinks.github.href}
                className={styles.iconButton}
                aria-label="GitHub profile"
                rel="noopener noreferrer"
              >
                <IconBranch />
              </a>
              <a href={contactLinks.email.href} className={styles.iconButton} aria-label="Email Peter">
                <IconMail />
              </a>
            </div>
            <Image
              src="/headshot.webp"
              alt={aboutContent.name}
              width={52}
              height={52}
              sizes="52px"
              className={styles.avatar}
            />
          </header>
          <main id="content" className={styles.main}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
