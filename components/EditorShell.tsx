import type { ReactNode } from "react";

import { ThemeToggle } from "./ThemeToggle";
import { StatusBar } from "./StatusBar";
import styles from "./EditorShell.module.css";

type EditorShellProps = {
  children: ReactNode;
  availabilityLabel: string;
};

export function EditorShell({ children, availabilityLabel }: EditorShellProps) {
  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <ThemeToggle />
      </header>
      <div className={styles.content}>{children}</div>
      <StatusBar availabilityLabel={availabilityLabel} />
    </main>
  );
}
