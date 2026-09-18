"use client";

import { useEffect, useState } from "react";

import styles from "./TypingHeadline.module.css";

type TypingHeadlineProps = {
  text: string;
};

function tokenMilliseconds() {
  const token = getComputedStyle(document.documentElement)
    .getPropertyValue("--motion-duration-typing")
    .trim();
  const value = Number.parseFloat(token);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return token.endsWith("s") && !token.endsWith("ms") ? value * 1000 : value;
}

export function TypingHeadline({ text }: TypingHeadlineProps) {
  const [visibleText, setVisibleText] = useState("");
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    if (reduceMotion) {
      const timer = window.setTimeout(() => {
        setIsReducedMotion(true);
        setVisibleText(text);
        setIsSettled(true);
      }, 0);

      return () => window.clearTimeout(timer);
    }

    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(interval);
        setIsSettled(true);
      }
    }, tokenMilliseconds());

    return () => window.clearInterval(interval);
  }, [text]);

  return (
    <h1 className={styles.headline} aria-label={text}>
      <span aria-hidden="true">{isReducedMotion || isSettled ? text : visibleText}</span>
      <span
        aria-hidden="true"
        className={isSettled && !isReducedMotion ? styles.cursorSettled : styles.cursor}
      />
    </h1>
  );
}
