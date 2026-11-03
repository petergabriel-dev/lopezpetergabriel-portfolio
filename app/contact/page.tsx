import type { Metadata } from "next";

import { ContactView } from "@/components/views/ContactView";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email, phone, LinkedIn and GitHub for Peter Gabriel Lopez. No contact form.",
};

export default function ContactPage() {
  return <ContactView />;
}
