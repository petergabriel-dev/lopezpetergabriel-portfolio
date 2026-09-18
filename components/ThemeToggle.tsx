"use client";

import { useEffect, useState } from "react";

import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";

const themeStorageKey = "portfolio-theme";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const isDark = theme === "dark";
  const visibleLabel = isDark ? "Use light theme" : "Use dark theme";
  const accessibleLabel = isDark
    ? "Dark theme enabled. Use light theme"
    : "Light theme enabled. Use dark theme";

  useEffect(() => {
    const timer = window.setTimeout(() => setTheme(currentTheme()), 0);

    return () => window.clearTimeout(timer);
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);

    try {
      window.localStorage.setItem(themeStorageKey, nextTheme);
    } catch {
      // Theme still applies for this page when storage is unavailable.
    }
  }

  return (
    <button
      aria-label={accessibleLabel}
      aria-pressed={isDark}
      className={styles.toggle}
      type="button"
      onClick={toggleTheme}
    >
      {visibleLabel}
    </button>
  );
}
