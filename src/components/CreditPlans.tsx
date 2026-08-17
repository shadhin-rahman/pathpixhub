"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PAYONEER_PAYME_URL } from "@/lib/payment";
import PayPerOrderCard from "./PayPerOrderCard";

const PLANS = [
  {
    name: "Standard",
    tagline: "For growing stores that need reliable, fast edits at scale.",
    badge: null,
    monthly: 50,
    annual: 480,
    turnaround: "12-Hour Fast",
    includes: "What you get:",
    features: ["12-hour fast delivery", "5 priority tickets / month", "5% credit bonus", "Unlimited revisions"],
    cta: "Buy Credits",
    href: "/payment?plan=Standard&amount=50&desc=Standard%20credit%20plan",
    kind: "payment",
    featured: false,
  },
  {
    name: "Pro",
    tagline: "For busy brands that demand speed and priority at volume.",
    badge: "Most Popular",
    monthly: 99,
    annual: 950,
    turnaround: "6-Hour Express",
    includes: "Everything in Standard, plus:",
    features: ["6-hour ultra fast SLA", "Unlimited priority tickets", "15% credit bonus", "Unlimited revisions"],
    cta: "Pay Now",
    href: PAYONEER_PAYME_URL || "/payment?plan=Pro&amount=99&desc=Pro%20credit%20plan",
    kind: "external",
    featured: true,
  },
  {
    name: "Enterprise",
    tagline: "For high-volume studios that need a dedicated expert team.",
    badge: "VIP Enterprise",
    monthly: 499,
    annual: 4790,
    turnaround: "45-Min VIP",
    includes: "Everything in Pro, plus:",
    features: ["45-min VIP response SLA", "Dedicated account manager", "Dedicated expert team", "Business security SLA"],
    cta: "Contact Sales",
    href: "/enterprise",
    kind: "sales",
    featured: false,
  },
];

export default function CreditPlans() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  const fmt = (n: number) => {
    const v = Math.round(n * 100) / 100;
    return Number.isInteger(v) ? String(v) : String(v);
  };

  return (
    <section className="py-28 lg:py-36 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-sm font-bold mb-5 border border-[rgb(var(--accent-500)/15%)]">
            Credit Plans
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text leading-[1.1]">
            Save with our credit plans
          </h2>
          <p className="mt-4 text-lg text-[rgb(var(--fg-rgb)/60%)] max-w-2xl mx-auto">
            Buy credits once, use them gradually — or skip the pack and pay per order. We edit first, you pay later.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-full border border-[rgb(var(--fg-rgb)/10%)] bg-[var(--bg-subtle)] p-1">
            {(["monthly", "annual"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setBilling(mode)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  billing === mode
                    ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow"
                    : "text-[rgb(var(--fg-rgb)/55%)] hover:text-[rgb(var(--fg-rgb))]"
                }`}
              >
                Pay {mode}
                {mode === "annual" && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      billing === mode
                        ? "bg-[rgb(var(--accent-contrast)/18%)] text-[rgb(var(--accent-contrast))]"
                        : "bg-[rgb(var(--accent-500)/12%)] text-[rgb(var(--accent-text))]"
                    }`}
                  >
                    Save 20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PLANS.map((plan, i) => {
            const isAnnual = billing === "annual";
            const monthlyPrice = isAnnual ? plan.annual / 12 : plan.monthly;
            const isExternal = plan.href.startsWith("http");
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className={`relative rounded-3xl border-2 p-8 flex flex-col transition-all hover:-translate-y-1 ${
                  plan.featured
                    ? "border-[rgb(var(--accent-500)/60%)] bg-[var(--bg-alt)] shadow-xl shadow-[rgb(var(--accent-500)/12%)] md:scale-[1.03]"
                    : "border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-alt)] hover:border-[rgb(var(--accent-500)/30%)] hover:shadow-xl hover:shadow-[rgb(var(--accent-500)/8%)]"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3.5 left-6 px-3.5 py-1.5 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] text-[11px] font-bold shadow-lg shadow-[rgb(var(--accent-500)/30%)]">
                    {plan.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold text-[rgb(var(--fg-rgb))]">{plan.name}</h3>
                <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/50%)] leading-relaxed">{plan.tagline}</p>

                <div className="mt-7 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold tracking-tight text-[rgb(var(--fg-rgb))]">
                    ${fmt(monthlyPrice)}
                  </span>
                  <span className="text-sm font-semibold text-[rgb(var(--fg-rgb)/40%)]">/mo</span>
                </div>
                <p className="mt-2 text-xs text-[rgb(var(--fg-rgb)/45%)] font-bold">
                  {isAnnual ? `Billed $${plan.annual}/year — save 20%` : "Billed monthly"}
                </p>

                <div className="rounded-xl text-center py-2.5 font-bold text-sm mt-6 bg-[rgb(var(--accent-500)/8%)] border border-[rgb(var(--accent-500)/20%)] text-[rgb(var(--accent-text))]">
                  ⚡ {plan.turnaround}
                </div>

                <div className="mt-8 flex-1">
                  <p className="text-[11px] uppercase tracking-wider font-bold text-[rgb(var(--fg-rgb)/45%)]">{plan.includes}</p>
                  <ul className="mt-4 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-[rgb(var(--fg-rgb)/70%)]">
                        <span className="mt-0.5 w-4 h-4 rounded-full bg-[rgb(var(--accent-500)/15%)] text-[rgb(var(--accent-text))] flex items-center justify-center shrink-0">
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" /></svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.name === "Enterprise" && (
                  <Link
                    href="/enterprise"
                    className="mb-4 text-center block text-xs font-bold text-[rgb(var(--fg-rgb)/45%)] hover:text-[rgb(var(--accent-text))] hover:underline transition-all"
                  >
                    See how it works →
                  </Link>
                )}

                {plan.kind === "payment" ? (
                  <Link
                    href={`/payment?plan=${encodeURIComponent(plan.name + " credit plan")}&amount=${
                      isAnnual ? plan.annual : plan.monthly
                    }&desc=${encodeURIComponent(plan.name + " credit plan — " + (isAnnual ? "billed annually" : "billed monthly"))}`}
                    className={`mt-4 block text-center py-3.5 rounded-xl font-bold text-sm transition-all ${
                      plan.featured
                        ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] shadow-lg shadow-[rgb(var(--accent-500)/15%)]"
                        : "border-2 border-[rgb(var(--accent-500)/35%)] text-[rgb(var(--accent-text))] hover:border-[rgb(var(--accent-500))] hover:bg-[rgb(var(--accent-500)/10%)]"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                ) : plan.kind === "external" ? (
                  <Link
                    href={plan.href}
                    {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="mt-4 block text-center py-3.5 rounded-xl font-bold text-sm transition-all bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] shadow-lg shadow-[rgb(var(--accent-500)/15%)]"
                  >
                    {plan.cta}
                  </Link>
                ) : (
                  <Link
                    href="/enterprise"
                    className="mt-4 block text-center py-3.5 rounded-xl font-bold text-sm transition-all border-2 border-[rgb(var(--accent-500)/35%)] text-[rgb(var(--accent-text))] hover:border-[rgb(var(--accent-500))] hover:bg-[rgb(var(--accent-500)/10%)]"
                  >
                    {plan.cta}
                  </Link>
                )}
              </motion.div>
            );
          })}
          <PayPerOrderCard />
        </div>

        <p className="mt-12 text-center">
          <Link
            href="/subscription"
            className="inline-flex items-center gap-2 text-sm font-bold text-[rgb(var(--accent-text))] hover:underline"
          >
            View all plans, calculator & full comparison
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </p>
      </div>
    </section>
  );
}