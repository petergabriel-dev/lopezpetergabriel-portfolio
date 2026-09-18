import type { ContactLink } from "@/content/types";

import styles from "./ContactAction.module.css";

type ContactActionProps = {
  link: ContactLink;
};

export function ContactAction({ link }: ContactActionProps) {
  if (!link.href) {
    return <span className={styles.placeholder}>{link.label}</span>;
  }

  const isExternal = link.href.startsWith("https://");

  return (
    <a
      className={styles.action}
      href={link.href}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {link.label}
    </a>
  );
}
