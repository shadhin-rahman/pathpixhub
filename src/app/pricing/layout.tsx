import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | PathPixHub",
  description: "Simple, transparent pricing for professional photo editing services. Free trial available — send 2 images and we'll edit them at no cost.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}