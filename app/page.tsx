import { HomeView } from "@/components/views/HomeView";
import { projects } from "@/content/projects";
import { getGithubSnapshot } from "@/lib/github";

// Daily ISR: the contribution grid refreshes server-side (ADR-0005).
export const revalidate = 86400;

export default async function HomePage() {
  const snapshot = await getGithubSnapshot();
  return (
    <HomeView
      snapshot={snapshot}
      featured={projects.filter((project) => project.featured)}
      projectCount={projects.length}
    />
  );
}
