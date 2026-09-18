import { contactContent, contactLinks } from "@/content/contact";

import { AvailabilityBadge } from "../AvailabilityBadge";
import { ContactAction } from "../ContactAction";
import styles from "./ContactPanel.module.css";

export function ContactPanel() {
  return (
    <div className={styles.copy}>
      <p className={styles.eyebrow}>{contactContent.eyebrow}</p>
      <h2 className={styles.heading}>{contactContent.heading}</h2>
      <p className={styles.body}>{contactContent.body}</p>
      <div className={styles.stack}>
        {contactLinks.map((link) => (
          <ContactAction key={link.label} link={link} />
        ))}
        <AvailabilityBadge label={contactContent.availability} />
      </div>
    </div>
  );
}
