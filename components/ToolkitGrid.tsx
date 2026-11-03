import type { ComponentType } from "react";

import type { ToolkitArea } from "@/content/types";

import { IconChip, IconServer, IconVideo, IconWorkflow } from "./icons";
import styles from "./ToolkitGrid.module.css";

const ICONS: Record<ToolkitArea["area"], ComponentType<{ className?: string }>> = {
  Backend: IconServer,
  Automation: IconWorkflow,
  "AI agents": IconChip,
  Media: IconVideo,
};

export function ToolkitGrid({ areas, className }: { areas: readonly ToolkitArea[]; className?: string }) {
  if (areas.length === 0) return null;

  return (
    <section className={[styles.section, className].filter(Boolean).join(" ")} aria-labelledby="toolkit-title">
      <h2 id="toolkit-title" className={styles.heading}>
        Toolkit
      </h2>
      <ul className={styles.grid}>
        {areas.map(({ area, items, usedAt }) => {
          const Icon = ICONS[area];
          return (
            <li key={area} className={styles.card}>
              <h3 className={styles.area}>
                <Icon className={styles.icon} />
                {area}
              </h3>
              <ul className={styles.items}>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className={styles.usedAt}>{usedAt}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
