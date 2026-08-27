"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Zap } from "lucide-react";
import { savingPct } from "./CreditSlider";

type Bundle = {
  price: number;
  paid: number;
  free: number;
  credits: number;
  per: number;
};

const FREQUENCIES = [
  { id: "weekly" as const, label: "Weekly" },
  { id: "monthly" as const, label: "Monthly" },
  { id: "quarterly" as const, label: "3 Months" },
  { id: "yearly" as const, label: "Yearly", badge: "2 months free" },
];

const FREQUENCY_FOOTER: Record<string, string> = {
  weekly: "Billed every week",
  monthly: "Billed monthly",
  quarterly: "Billed every 3 months",
  yearly: "Billed yearly",
};

export default function CreditPurchaseModal({
  open,
  onClose,
  bundle,
}: {
  open: boolean;
  onClose: () => void;
  bundle: Bundle;
}) {
  const [mode, setMode] = useState<"once" | "subscribe">("once");
  const [frequency, setFrequency] = useState<"weekly" | "monthly" | "quarterly" | "yearly">("monthly");

  const payHref = `/payment?plan=${encodeURIComponent("Credit Pack")}&amount=${bundle.price}&desc=${encodeURIComponent(
    `${bundle.credits.toLocaleString()} credits ($${bundle.paid.toLocaleString()} paid + ${bundle.free.toLocaleString()} bonus)`,
  )}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl glass-card border border-[rgb(var(--fg-rgb)/10%)] p-6 sm:p-8"
          >
            <div className="flex items-center justify-between mb-5">
              <p className="font-bold text-[rgb(var(--fg-rgb))]">Buy credits</p>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[rgb(var(--fg-rgb)/40%)] hover:text-[rgb(var(--fg-rgb))] hover:bg-[rgb(var(--fg-rgb)/5%)] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Selected pack summary */}
            <div className="rounded-2xl border-2 border-[rgb(var(--accent-500)/25%)] bg-[rgb(var(--accent-500)/4%)] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-3xl font-black text-[rgb(var(--fg-rgb))] tracking-tight">
                    ${bundle.price.toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[rgb(var(--fg-rgb)/75%)]">
                    {bundle.credits.toLocaleString()} credits
                  </p>
                </div>
                <div className="text-right text-xs text-[rgb(var(--fg-rgb)/55%)]">
                  <p>
                    <span className="font-bold text-[rgb(var(--fg-rgb)/75%)]">${bundle.paid.toLocaleString()} paid</span> +{" "}
                    <span className="font-bold text-[rgb(var(--accent-text))]">{bundle.free.toLocaleString()} free</span>
                  </p>
                  <p className="mt-1.5">
                    ${bundle.per.toFixed(2)} / credit ·{" "}
                    <span className="font-bold text-emerald-500">Save {savingPct(bundle.per)}%</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Buy once / Subscribe */}
            <div className="mt-5 flex justify-center">
              <div className="inline-flex rounded-full border border-[rgb(var(--fg-rgb)/10%)] bg-[var(--bg-subtle)] p-1">
                <button
                  type="button"
                  onClick={() => setMode("once")}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                    mode === "once"
                      ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow"
                      : "text-[rgb(var(--fg-rgb)/60%)] hover:text-[rgb(var(--fg-rgb))]"
                  }`}
                >
                  Buy once
                </button>
                <button
                  type="button"
                  onClick={() => setMode("subscribe")}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                    mode === "subscribe"
                      ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow"
                      : "text-[rgb(var(--fg-rgb)/60%)] hover:text-[rgb(var(--fg-rgb))]"
                  }`}
                >
                  Subscribe &amp; save
                </button>
              </div>
            </div>

            {mode === "subscribe" && (
              <div className="mt-4">
                <p className="text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-3 text-center">
                  Choose billing frequency
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FREQUENCIES.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFrequency(f.id)}
                      className={`relative rounded-xl px-3 py-3 text-sm font-bold transition-all cursor-pointer ${
                        frequency === f.id
                          ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow-lg shadow-[rgb(var(--accent-500)/25%)] border border-[rgb(var(--accent-600))]"
                          : "border border-[rgb(var(--fg-rgb)/10%)] bg-[var(--bg-subtle)] text-[rgb(var(--fg-rgb)/65%)] hover:border-[rgb(var(--accent-500)/40%)] hover:text-[rgb(var(--fg-rgb))]"
                      }`}
                    >
                      {f.label}
                      {f.badge && (
                        <span className={`block mt-1 text-[10px] font-bold ${frequency === f.id ? "text-[rgb(var(--accent-contrast)/75%)]" : "text-emerald-500"}`}>
                          {f.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-[rgb(var(--fg-rgb)/50%)] text-center">
                  Weekly, monthly, 3-month or yearly credit plans come with Standard / Pro / Enterprise tiers — including bonus credits every billing cycle.
                </p>
              </div>
            )}

            <div className="mt-6">
              {mode === "once" ? (
                <Link
                  href={payHref}
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm shadow-lg shadow-[rgb(var(--accent-500)/25%)]"
                >
                  <Zap className="w-4 h-4" />
                  Buy ${bundle.price.toLocaleString()} pack
                </Link>
              ) : (
                <Link
                  href="/subscription"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm shadow-lg shadow-[rgb(var(--accent-500)/25%)]"
                >
                  <BadgeCheck className="w-4 h-4" />
                  View subscription plans
                </Link>
              )}
            </div>
            <p className="mt-4 text-center text-[11px] text-[rgb(var(--fg-rgb)/45%)]">
              {mode === "once"
                ? "One-time purchase — credits added to your balance instantly."
                : `${FREQUENCY_FOOTER[frequency]} — cancel anytime.`}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
