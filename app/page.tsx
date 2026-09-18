import { EditorShell } from "@/components/EditorShell";
import { EditorTabBar, type EditorTab } from "@/components/EditorTabBar";
import { AboutPanel } from "@/components/panels/AboutPanel";
import { contactContent, contactLinks } from "@/content/contact";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
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
        <div>
          <p>projects.tsx</p>
          <h2>Selected builds</h2>
          {projects.map((project) => (
            <article key={project.title}>
              <h3>{project.title}</h3>
              <p>{project.copy}</p>
            </article>
          ))}
        </div>
        <div>
          <p>experience.json</p>
          <h2>Experience</h2>
          {experience.map((entry) => (
            <article key={entry.value}>
              <h3>{entry.value}</h3>
              <p>{entry.date}</p>
              {entry.description ? <p>{entry.description}</p> : null}
            </article>
          ))}
        </div>
        <div>
          <p>{contactContent.eyebrow}</p>
          <h2>{contactContent.heading}</h2>
          <p>{contactContent.body}</p>
          {contactLinks.map((link) =>
            link.href ? (
              <p key={link.label}>
                <a href={link.href}>{link.label}</a>
              </p>
            ) : (
              <p key={link.label}>{link.label}</p>
            ),
          )}
        </div>
      </EditorTabBar>
    </EditorShell>
  );
}
