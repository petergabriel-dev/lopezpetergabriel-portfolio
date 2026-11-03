"use client";

import { useSyncExternalStore } from "react";

import { aboutContent } from "@/content/about";
import { location } from "@/content/contact";

import { IconBriefcase, IconGlobe, IconPin } from "./icons";
import styles from "./LocalTimeCard.module.css";

const REFRESH_MS = 15_000;
const MINUTE_MS = 60_000;

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: location.timeZone,
});
const weekdayFormat = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: location.timeZone });

function subscribe(onTick: () => void) {
  const id = setInterval(onTick, REFRESH_MS);
  return () => clearInterval(id);
}

// Minute resolution keeps the snapshot stable between renders; the 15 s poll catches the next minute.
const getSnapshot = () => Math.floor(Date.now() / MINUTE_MS) * MINUTE_MS;
// Server render and hydration show a stable placeholder, so there is no hydration mismatch.
const getServerSnapshot = () => null;

export function LocalTimeCard({ detail }: { detail: "availability" | "languages" }) {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const date = now === null ? null : new Date(now);

  return (
    <section className={styles.card}>
      <p className={styles.place}>
        <IconPin className={styles.placeIcon} />
        {location.city}
      </p>
      <p className={styles.clock}>
        <time className={styles.time} dateTime={date ? date.toISOString() : undefined}>
          {date ? timeFormat.format(date) : "--:--"}
        </time>
        <span className={styles.offset}>{location.utcOffset}</span>
      </p>
      <p className={styles.caption}>{date ? `${weekdayFormat.format(date)} · ` : ""}Peter&apos;s local time</p>
      {detail === "availability" ? (
        <ul className={styles.detail}>
          <li className={styles.detailItem}>
            <span className={styles.dot} aria-hidden="true" />
            {aboutContent.availability.parts[0]}
          </li>
          <li className={styles.detailItem}>
            <IconBriefcase className={styles.detailIcon} />
            {aboutContent.availability.parts[1]}
          </li>
          <li className={styles.detailItem}>
            <IconGlobe className={styles.detailIcon} />
            {aboutContent.availability.parts[2]}
          </li>
        </ul>
      ) : (
        <p className={`${styles.detail} ${styles.detailItem}`}>
          <IconGlobe className={styles.detailIcon} />
          {location.languages.join(" · ")}
        </p>
      )}
    </section>
  );
}
