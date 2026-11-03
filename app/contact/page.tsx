import type { Metadata } from "next";

import { LocalTimeCard } from "@/components/LocalTimeCard";
import { contactPage } from "@/content/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email, phone, LinkedIn and GitHub for Peter Gabriel Lopez. No contact form.",
};

export default function ContactPage() {
  // Placeholder until the Contact screen task composes the full view.
  return (
    <>
      <h1>{contactPage.titleLines.join(" ")}</h1>
      <div style={{ maxWidth: 360 }}>
        <LocalTimeCard detail="languages" />
      </div>
    </>
  );
}
