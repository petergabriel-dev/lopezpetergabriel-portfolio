import styles from "./TagChip.module.css";

type TagChipProps = {
  label: string;
};

export function TagChip({ label }: TagChipProps) {
  return <li className={styles.tag}>{label}</li>;
}
