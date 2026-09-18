import { EditorShell } from "@/components/EditorShell";
import { EditorTabBar, type EditorTab } from "@/components/EditorTabBar";
import { AboutPanel } from "@/components/panels/AboutPanel";
import { ContactPanel } from "@/components/panels/ContactPanel";
import { ExperiencePanel } from "@/components/panels/ExperiencePanel";
import { ProjectsPanel } from "@/components/panels/ProjectsPanel";
import { aboutContent } from "@/content/about";

const tabs: readonly EditorTab[] = [
  { id: "about", label: "about.md" },
  { id: "projects", label: "projects.tsx" },
  { id: "experience", label: "experience.json" },
  { id: "contact", label: "contact.md" },
];

export default function Home() {
  return (
    <EditorShell availabilityLabel={aboutContent.availability}>
      <EditorTabBar tabs={tabs}>
        <AboutPanel />
        <ProjectsPanel />
        <ExperiencePanel />
        <ContactPanel />
      </EditorTabBar>
    </EditorShell>
  );
}
