import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | PathPixHub",
  description: "Get in touch with PathPixHub. Request a free trial or custom quote — we'll respond within 24 hours.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}