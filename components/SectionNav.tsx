"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

import { aboutContent } from "@/content/about";

import { IconAbout, IconExperience, IconMail, IconProjects, IconResume } from "./icons";
import styles from "./SectionNav.module.css";

const sections: readonly { href: string; label: string; Icon: ComponentType<{ className?: string }> }[] = [
  { href: "/", label: "About", Icon: IconAbout },
  { href: "/projects", label: "Projects", Icon: IconProjects },
  { href: "/experience", label: "Experience", Icon: IconExperience },
  { href: "/contact", label: "Contact", Icon: IconMail },
];

export function SectionNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Sections" className={styles.nav}>
      <Link href="/" className={styles.logo} aria-label={`${aboutContent.name} — About`}>
        {aboutContent.initials}
      </Link>
      {sections.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          className={styles.link}
          aria-current={pathname === href ? "page" : undefined}
        >
          <Icon className={styles.icon} />
          <span className={styles.label}>{label}</span>
        </Link>
      ))}
      <a href="/resume.pdf" download="Peter-Gabriel-Lopez-Resume.pdf" className={`${styles.link} ${styles.resume}`}>
        <IconResume className={styles.icon} />
        <span className={styles.label}>
          Download résumé <span className="visually-hidden">(PDF)</span>
        </span>
      </a>
    </nav>
  );
}
