import type { ComponentType } from "react";

import type { Highlight, HighlightIcon } from "@/content/types";

import { IconDatabase, IconMonitorChart, IconVideo } from "./icons";
import styles from "./Highlights.module.css";

const ICONS: Record<HighlightIcon, ComponentType<{ className?: string }>> = {
  records: IconDatabase,
  training: IconMonitorChart,
  broadcast: IconVideo,
};

export function Highlights({ items, label }: { items: readonly Highlight[]; label: string }) {
  if (items.length === 0) return null;

  return (
    <ul className={styles.list} aria-label={label}>
      {items.map(({ icon, text }) => {
        const Icon = ICONS[icon];
        return (
          <li key={text} className={styles.item}>
            <Icon className={styles.icon} />
            <span>{text}</span>
          </li>
        );
      })}
    </ul>
  );
}
