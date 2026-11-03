import type { Metadata } from "next";

import { contactPage } from "@/content/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email, phone, LinkedIn and GitHub for Peter Gabriel Lopez. No contact form.",
};

export default function ContactPage() {
  return <h1>{contactPage.titleLines.join(" ")}</h1>;
}
