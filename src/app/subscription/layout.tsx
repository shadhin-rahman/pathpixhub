import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription Plans | PathPixHub",
  description: "Flexible subscription plans for professional photo editing. Start free, upgrade as you grow. Save 20% with annual billing.",
};

export default function SubscriptionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
