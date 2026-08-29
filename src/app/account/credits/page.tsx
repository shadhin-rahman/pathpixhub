"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Coins, Zap, Star, ArrowRight } from "lucide-react";
import CreditSlider, { CREDIT_BUNDLES, savingPct } from "@/components/CreditSlider";

const FAQS = [
  { q: "What is a PathPixHub credit worth?", a: "1 credit = $1 worth of image editing. When you place an order, you can pay with credits instead of reaching for your card — at a lower price per shot." },
  { q: "Do credits ever expire?", a: "No. Your credits never expire, so you can stock up during a sale and use them whenever you need — even months later." },
  { q: "How do I pay with my credits?", a: "We store your credit balance on your account. When you confirm an order, just choose \u201cPay with credits\u201d at checkout and the amount is deducted automatically." },
  { q: "Can I get a bigger discount for regular bulk edits?", a: "Yes. Two ways: pick a larger credit pack for a lower per-image rate, or talk to our Enterprise team for a custom monthly volume deal with dedicated rates." },
];

export default function AccountCreditsPage() {
  const [selected, setSelected] = useState(250);
  const [subscribe, setSubscribe] = useState(false);
  const [frequency, setFrequency] = useState<"weekly" | "monthly" | "quarterly">("monthly");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const bundle = CREDIT_BUNDLES.find((b) => b.price === selected) ?? CREDIT_BUNDLES[0];

  const payHref = subscribe
    ? `/payment?plan=${encodeURIComponent("Credit Subscription")}&amount=${bundle.price}&frequency=${frequency}`
    : `/payment?plan=${encodeURIComponent("Credit Pack")}&amount=${bundle.price}&desc=${encodeURIComponent(
        `${bundle.credits.toLocaleString()} credits ($${bundle.paid.toLocaleString()} paid + ${bundle.free.toLocaleString()} bonus)`,
      )}`;

  const freqLabel = { weekly: "Weekly", monthly: "Monthly", quarterly: "Every 3 months" };

  return (
    <div className="max-w-[1400px]">
      <div className="mb-10">
        <h1 className="flex items-center gap-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight gradient-text leading-[1.15]">
          <Star className="w-9 h-9 text-[rgb(var(--accent-text))]" />
          Path credits
        </h1>
        <p className="mt-3 text-base text-[rgb(var(--fg-rgb)/55%)]">
          Buy credits or subscribe for ongoing editing.
        </p>
      </div>

      {/* Row 1: Credit bundles + Recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 mb-8">
        {/* Credit bundles */}
        <div className="glass-card rounded-3xl p-8 sm:p-10">
          <h2 className="text-2xl font-bold mb-2">Path credit bundles</h2>
          <p className="text-base text-[rgb(var(--fg-rgb)/55%)] mb-8">How much do you want to spend?</p>

          <CreditSlider
            value={selected}
            onChange={setSelected}
            title="How much do you want to add?"
            subtitle={`${bundle.credits.toLocaleString()} credits added to your balance instantly on payment.`}
          />

          {/* Buy once / Subscribe toggle */}
          <div className="mt-8 pt-8 border-t border-[rgb(var(--fg-rgb)/8%)]">
            <div className="flex items-center gap-4 mb-5">
              <span className={`text-base font-bold ${!subscribe ? "text-[rgb(var(--fg-rgb))]" : "text-[rgb(var(--fg-rgb)/45%)]"}`}>
                Buy once
              </span>
              <button
                type="button"
                onClick={() => setSubscribe(!subscribe)}
                className={`relative w-14 h-8 rounded-full transition-colors cursor-pointer ${subscribe ? "bg-[rgb(var(--accent-500))]" : "bg-[rgb(var(--fg-rgb)/20%)]"}`}
              >
                <span className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${subscribe ? "translate-x-6" : ""}`} />
              </button>
              <span className={`text-base font-bold ${subscribe ? "text-[rgb(var(--fg-rgb))]" : "text-[rgb(var(--fg-rgb)/45%)]"}`}>
                Subscribe & save
              </span>
            </div>

            {subscribe && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden"
              >
                <p className="text-sm text-[rgb(var(--fg-rgb)/55%)] mb-3">Choose billing frequency</p>
                <div className="flex gap-3">
                  {(["weekly", "monthly", "quarterly"] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFrequency(f)}
                      className={`px-6 py-3 rounded-xl text-base font-bold border transition-all cursor-pointer ${
                        frequency === f
                          ? "border-[rgb(var(--accent-500)/40%)] bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))]"
                          : "border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb)/55%)] hover:border-[rgb(var(--fg-rgb)/25%)]"
                      }`}
                    >
                      {freqLabel[f]}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Buy button */}
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-full bg-[rgb(var(--fg-rgb)/6%)] border border-[rgb(var(--fg-rgb)/10%)] text-sm font-bold text-[rgb(var(--fg-rgb)/65%)]">
                ${bundle.per.toFixed(2)}/credit
              </span>
              <span className="text-sm font-bold text-emerald-500">Save {savingPct(bundle.per)}%</span>
              {bundle.popular && (
                <span className="px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/12%)] border border-[rgb(var(--accent-500)/25%)] text-sm font-bold text-[rgb(var(--accent-text))]">
                  Popular
                </span>
              )}
            </div>
            <Link
              href={payHref}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-base shadow-lg shadow-[rgb(var(--accent-500)/25%)]"
            >
              <Zap className="w-5 h-5" />
              {subscribe ? `Subscribe $${bundle.price.toLocaleString()}` : `Buy $${bundle.price.toLocaleString()} pack`}
            </Link>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-5">Recent transactions</h3>
          <div className="text-center py-10">
            <Coins className="w-12 h-12 mx-auto text-[rgb(var(--fg-rgb)/20%)]" />
            <p className="mt-4 text-base text-[rgb(var(--fg-rgb)/50%)]">No transactions yet</p>
          </div>
        </div>
      </div>

      {/* Row 2: Compare plans + FAQs */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* Compare plans */}
        <div className="glass-card rounded-3xl p-8 sm:p-10">
          <h2 className="text-2xl font-bold mb-2">Compare plans</h2>
          <p className="text-base text-[rgb(var(--fg-rgb)/55%)] mb-8">See what&apos;s included in each Path plan.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b-2 border-[rgb(var(--fg-rgb)/10%)]">
                  <th className="text-left py-5 px-5 font-bold text-[rgb(var(--fg-rgb)/70%)]"></th>
                  <th className="py-5 px-5 font-bold text-[rgb(var(--fg-rgb)/90%)]">
                    <div className="text-xs text-emerald-500 font-bold mb-1">ACTIVE PLAN</div>
                    <div>Standard</div>
                    <div className="text-sm font-bold text-[rgb(var(--accent-text))]">Pay As You Go</div>
                  </th>
                  <th className="py-5 px-5 font-bold text-[rgb(var(--fg-rgb)/90%)]">
                    <div>Pro</div>
                    <div className="text-sm font-bold text-[rgb(var(--accent-text))]">Path Credits Subscription</div>
                  </th>
                  <th className="py-5 px-5 font-bold text-[rgb(var(--fg-rgb)/90%)]">
                    <div>Enterprise</div>
                    <div className="text-sm font-bold text-[rgb(var(--accent-text))]">$499/month</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Next Morning Turnaround", values: [false, true, true] },
                  { label: "Discount on credits", values: ["0%", "35%", "Custom"] },
                  { label: "Image editing price", values: ["Variable", "Variable", "Flat"] },
                  { label: "Dedicated Account Manager", values: [false, false, true] },
                  { label: "Dedicated Editing Team", values: [false, true, true] },
                  { label: "Monthly billing by invoice", values: [false, false, true] },
                  { label: "Minimum order fee", values: ["$2.5", false, false] },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-[rgb(var(--fg-rgb)/5%)]">
                    <td className="py-4 px-5 text-[rgb(var(--fg-rgb)/70%)]">{row.label}</td>
                    {row.values.map((val, i) => {
                      if (val === true) {
                        return (
                          <td key={i} className="py-4 px-5 text-center">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          </td>
                        );
                      }
                      if (val === false) {
                        return <td key={i} className="py-4 px-5 text-center text-[rgb(var(--fg-rgb)/20%)] font-bold">—</td>;
                      }
                      return <td key={i} className="py-4 px-5 text-center font-bold text-[rgb(var(--fg-rgb)/80%)]">{val}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-5">FAQs</h3>
          <div className="space-y-4">
            {FAQS.map((f, i) => (
              <div key={i} className="rounded-xl border border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="font-bold text-sm text-[rgb(var(--fg-rgb))]">{f.q}</span>
                  <motion.span
                    animate={{ rotate: faqOpen === i ? 45 : 0 }}
                    className="shrink-0 w-8 h-8 rounded-full bg-[rgb(var(--fg-rgb)/6%)] flex items-center justify-center text-[rgb(var(--fg-rgb))]"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: faqOpen === i ? "auto" : 0, opacity: faqOpen === i ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">{f.a}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View all packs link */}
      <div className="mt-8">
        <Link
          href="/credits"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card hover:border-[rgb(var(--accent-500)/30%)] transition-all group text-sm font-bold"
        >
          <Coins className="w-4 h-4 text-[rgb(var(--accent-text))]" />
          View all credit packs
          <ArrowRight className="w-4 h-4 text-[rgb(var(--fg-rgb)/40%)] group-hover:text-[rgb(var(--accent-text))] transition-colors" />
        </Link>
      </div>
    </div>
  );
}
