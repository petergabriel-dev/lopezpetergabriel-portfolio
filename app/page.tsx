import { ContributionGrid } from "@/components/ContributionGrid";
import { LocalTimeCard } from "@/components/LocalTimeCard";
import { aboutContent } from "@/content/about";
import { githubSnapshot } from "@/content/github";

// Placeholder until the Home screen task composes the full view (ISR loader, one grid per breakpoint).
export default function HomePage() {
  const { weeks, total } = githubSnapshot.contributions;

  return (
    <>
      <h1>{aboutContent.titleLines.join(" ")}</h1>
      <div style={{ maxWidth: 360 }}>
        <LocalTimeCard detail="availability" />
      </div>
      <div style={{ display: "grid", gap: 40, marginTop: 32 }}>
        <ContributionGrid weeks={weeks} total={total} variant="year" />
        <ContributionGrid weeks={weeks} total={total} variant="recent" />
      </div>
    </>
  );
}
