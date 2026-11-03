import { LocalTimeCard } from "@/components/LocalTimeCard";
import { aboutContent } from "@/content/about";

// Placeholder until the Home screen task composes the full view.
export default function HomePage() {
  return (
    <>
      <h1>{aboutContent.titleLines.join(" ")}</h1>
      <div style={{ maxWidth: 360 }}>
        <LocalTimeCard detail="availability" />
      </div>
    </>
  );
}
