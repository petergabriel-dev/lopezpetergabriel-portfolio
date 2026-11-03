import { aboutContent } from "@/content/about";

export default function HomePage() {
  return <h1>{aboutContent.titleLines.join(" ")}</h1>;
}
