import { AvailabilityBadge } from "./AvailabilityBadge";
import styles from "./StatusBar.module.css";

type StatusBarProps = {
  availabilityLabel: string;
};

export function StatusBar({ availabilityLabel }: StatusBarProps) {
  return (
    <footer className={styles.bar}>
      <span className={styles.branch}>
        <span aria-hidden="true">⎇</span> main
      </span>
      <span className={styles.availability}>
        <AvailabilityBadge label={availabilityLabel} />
      </span>
      <a
        className={styles.resume}
        href="/resume.pdf"
        download="resume.pdf"
        aria-label="Download resume PDF"
      >
        <span aria-hidden="true">⬇</span> resume.pdf
      </a>
    </footer>
  );
}
