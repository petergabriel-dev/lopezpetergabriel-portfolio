import type { ReactNode } from "react";

import { StatusBar } from "./StatusBar";
import styles from "./EditorShell.module.css";

type EditorShellProps = {
  children: ReactNode;
  availabilityLabel: string;
};

export function EditorShell({ children, availabilityLabel }: EditorShellProps) {
  return (
    <main className={styles.shell}>
      <div className={styles.content}>{children}</div>
      <StatusBar availabilityLabel={availabilityLabel} />
    </main>
  );
}
