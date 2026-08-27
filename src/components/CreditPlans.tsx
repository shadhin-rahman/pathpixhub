"use client";

import { useState } from "react";
import Link from "next/link";
import { CREDIT_BUNDLES } from "./CreditSlider";
import CreditPurchaseModal from "./CreditPurchaseModal";

const PLANS = [
  {
    name: "Standard",
    tagline: "Pay As You Go",
    monthly: 50,
    annual: 480,
    cta: "Buy Credits",
    href: "/payment?plan=Standard&amount=50",
    kind: "payment" as const,
  },
  {
    name: "Pro",
    tagline: "Path Credits Subscription",
    monthly: 99,
    annual: 950,
    cta: "Subscribe",
    href: "",
    kind: "modal" as const,
  },
  {
    name: "Enterprise",
    tagline: "$499/month",
    monthly: 499,
    annual: 4790,
    cta: "Contact sales",
    href: "/enterprise",
    kind: "sales" as const,
  },
];

type CellValue = string | boolean;

const FEATURES: { label: string; values: CellValue[] }[] = [
  { label: "Next Morning Turnaround", values: [false, true, true] },
  { label: "Discount on credits", values: ["0%", "35%", "Custom"] },
  { label: "Image editing price", values: ["Variable", "Variable", "Flat"] },
  { label: "Dedicated Account Manager", values: [false, false, true] },
  { label: "Dedicated Editing Team", values: [false, true, true] },
  { label: "Monthly billing by invoice", values: [false, false, true] },
  { label: "Minimum order fee", values: ["$2.5", false, false] },
];

function Cell({ value }: { value: CellValue }) {
  if (value === true) {
    return (
      <td className="py-3.5 px-4 text-center">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      </td>
    );
  }
  if (value === false) {
    return (
      <td className="py-3.5 px-4 text-center text-[rgb(var(--fg-rgb)/20%)] font-bold">
        —
      </td>
    );
  }
  return (
    <td className="py-3.5 px-4 text-center font-bold text-[rgb(var(--fg-rgb)/80%)]">
      {value}
    </td>
  );
}

export default function CreditPlans() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [modalOpen, setModalOpen] = useState(false);

  const defaultBundle = CREDIT_BUNDLES.find((b) => b.popular) ?? CREDIT_BUNDLES[0];

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

        {/* Comparison table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-[rgb(var(--fg-rgb)/10%)]">
                <th className="text-left py-4 px-4 font-bold text-[rgb(var(--fg-rgb)/70%)]">Feature</th>
                {PLANS.map((plan) => (
                  <th key={plan.name} className="py-4 px-4 font-bold text-[rgb(var(--fg-rgb)/90%)]">
                    <div>{plan.name}</div>
                    <div className="text-sm font-bold text-[rgb(var(--accent-text))]">
                      {plan.tagline}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((row) => (
                <tr key={row.label} className="border-b border-[rgb(var(--fg-rgb)/5%)]">
                  <td className="py-3.5 px-4 text-[rgb(var(--fg-rgb)/70%)]">{row.label}</td>
                  {row.values.map((val, i) => (
                    <Cell key={i} value={val} />
                  ))}
                </tr>
              ))}
              {/* CTA row */}
              <tr>
                <td className="py-5 px-4" />
                {/* Standard: no button */}
                <td className="py-5 px-4 text-center" />
                {/* Pro: opens modal */}
                <td className="py-5 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="inline-block px-6 py-3 rounded-xl font-bold text-sm transition-all border-2 border-[rgb(var(--accent-500)/35%)] text-[rgb(var(--accent-text))] hover:border-[rgb(var(--accent-500))] hover:bg-[rgb(var(--accent-500)/10%)] cursor-pointer"
                  >
                    Subscribe
                  </button>
                </td>
                {/* Enterprise: contact sales */}
                <td className="py-5 px-4 text-center">
                  <Link
                    href="/enterprise"
                    className="inline-block px-6 py-3 rounded-xl font-bold text-sm transition-all border-2 border-[rgb(var(--accent-500)/35%)] text-[rgb(var(--accent-text))] hover:border-[rgb(var(--accent-500))] hover:bg-[rgb(var(--accent-500)/10%)]"
                  >
                    Contact sales
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
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

      {/* Credit purchase popup */}
      <CreditPurchaseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        bundle={defaultBundle}
      />
    </section>
  );
}
