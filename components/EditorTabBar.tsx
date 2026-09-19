"use client";

import { Children, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import styles from "./EditorTabBar.module.css";

export type EditorTab = {
  id: string;
  label: string;
};

type EditorTabBarProps = {
  tabs: readonly EditorTab[];
  children: ReactNode;
};

export function EditorTabBar({ tabs, children }: EditorTabBarProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRefs = useRef<Array<HTMLElement | null>>([]);
  const panels = Children.toArray(children);
  const activeTab = tabs[activeIndex] ?? tabs[0];

  useEffect(() => {
    const activePanel = panelRefs.current[activeIndex];

    if (activePanel) {
      activePanel.scrollTop = 0;
    }
  }, [activeIndex]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!tabs.length || (event.key !== "ArrowRight" && event.key !== "ArrowLeft")) {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + tabs.length) % tabs.length;
    setActiveIndex(nextIndex);

    const nextTab = tabRefs.current[nextIndex];
    nextTab?.focus();
    nextTab?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }

  return (
    <div className={styles.root}>
      <div className={styles.tabList} role="tablist" aria-label="Portfolio files">
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab?.id;

          return (
            <button
              className={styles.tab}
              id={`${tab.id}-tab`}
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              role="tab"
              type="button"
              aria-controls={`${tab.id}-panel`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab?.id;

        return (
          <section
            aria-labelledby={`${tab.id}-tab`}
            className={styles.panel}
            hidden={!isActive}
            id={`${tab.id}-panel`}
            key={tab.id}
            ref={(element) => {
              panelRefs.current[index] = element;
            }}
            role="tabpanel"
            tabIndex={0}
          >
            {panels[index] ?? null}
          </section>
        );
      })}
    </div>
  );
}
