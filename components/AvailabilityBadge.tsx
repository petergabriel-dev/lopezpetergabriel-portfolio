import styles from "./AvailabilityBadge.module.css";

type AvailabilityBadgeProps = {
  label: string;
};

export function AvailabilityBadge({ label }: AvailabilityBadgeProps) {
  return (
    <span className={styles.badge}>
      <span className={styles.dot} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
