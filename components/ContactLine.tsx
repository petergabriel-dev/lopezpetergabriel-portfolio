import type { ContactLink } from "@/content/types";

import { IconArrowUpRight, IconPhone } from "./icons";
import styles from "./ContactLine.module.css";

/**
 * Direct-line link card. The accessible name is the visible label and value ("Email lopez…@gmail.com"),
 * so it always contains the visible text (WCAG 2.5.3).
 */
export function ContactLine({ link }: { link: ContactLink }) {
  const external = link.href.startsWith("https://");
  // Prefer breaking a long email before "@" rather than mid-word.
  const [local, domain] = link.kind === "email" ? link.value.split("@") : [link.value, undefined];

  return (
    <a href={link.href} className={styles.line} rel={external ? "noopener noreferrer" : undefined}>
      <span className={styles.text}>
        <span className={styles.label}>{link.label}</span>{" "}
        <span className={styles.value}>
          {domain === undefined ? (
            local
          ) : (
            <>
              {local}
              <wbr />@{domain}
            </>
          )}
        </span>
      </span>
      <span className={styles.ring} aria-hidden="true">
        {link.kind === "phone" ? <IconPhone size={16} /> : <IconArrowUpRight size={16} />}
      </span>
    </a>
  );
}
