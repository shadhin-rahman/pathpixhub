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
    <div>
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight gradient-text leading-[1.15]">
          <Star className="w-9 h-9 text-[rgb(var(--accent-text))]" />
          Path credits
        </h1>
        <p className="mt-3 text-base text-[rgb(var(--fg-rgb)/55%)]">
          Buy credits or subscribe for ongoing editing.
        </p>
      </div>

      {/* Row 1: Credit bundles + Recent transactions */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 mb-6">
        {/* Credit bundles — main */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 min-w-0">
          <h2 className="text-xl font-bold mb-1">Path credit bundles</h2>
          <p className="text-sm text-[rgb(var(--fg-rgb)/55%)] mb-6">How much do you want to spend?</p>

          <CreditSlider
            value={selected}
            onChange={setSelected}
            title="How much do you want to add?"
            subtitle={`${bundle.credits.toLocaleString()} credits added to your balance instantly on payment.`}
          />

          {/* Buy once / Subscribe toggle */}
          <div className="mt-6 pt-6 border-t border-[rgb(var(--fg-rgb)/8%)]">
            <div className="flex items-center gap-4 mb-4">
              <span className={`text-sm font-bold ${!subscribe ? "text-[rgb(var(--fg-rgb))]" : "text-[rgb(var(--fg-rgb)/45%)]"}`}>
                Buy once
              </span>
              <button
                type="button"
                onClick={() => setSubscribe(!subscribe)}
                className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${subscribe ? "bg-[rgb(var(--accent-500))]" : "bg-[rgb(var(--fg-rgb)/20%)]"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${subscribe ? "translate-x-5" : ""}`} />
              </button>
              <span className={`text-sm font-bold ${subscribe ? "text-[rgb(var(--fg-rgb))]" : "text-[rgb(var(--fg-rgb)/45%)]"}`}>
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
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
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
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1.5 rounded-full bg-[rgb(var(--fg-rgb)/6%)] border border-[rgb(var(--fg-rgb)/10%)] text-xs font-bold text-[rgb(var(--fg-rgb)/65%)]">
                ${bundle.per.toFixed(2)}/credit
              </span>
              <span className="text-xs font-bold text-emerald-500">Save {savingPct(bundle.per)}%</span>
              {bundle.popular && (
                <span className="px-3 py-1.5 rounded-full bg-[rgb(var(--accent-500)/12%)] border border-[rgb(var(--accent-500)/25%)] text-xs font-bold text-[rgb(var(--accent-text))]">
                  Popular
                </span>
              )}
            </div>
            <Link
              href={payHref}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm shadow-lg shadow-[rgb(var(--accent-500)/25%)]"
            >
              <Zap className="w-4 h-4" />
              {subscribe ? `Subscribe $${bundle.price.toLocaleString()}` : `Buy $${bundle.price.toLocaleString()} pack`}
            </Link>
          </div>
        </div>

        {/* Recent transactions — sidebar */}
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-base font-bold mb-4">Recent transactions</h3>
          <div className="text-center py-8">
            <Coins className="w-10 h-10 mx-auto text-[rgb(var(--fg-rgb)/20%)]" />
            <p className="mt-3 text-sm text-[rgb(var(--fg-rgb)/50%)]">No transactions yet</p>
          </div>
        </div>
      </div>

      {/* Row 2: Compare plans + FAQs */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Compare plans — main */}
        <div className="rounded-3xl min-w-0 border border-black/5 overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-1">Compare plans</h2>
            <p className="text-sm text-black/50 mb-6">See what&apos;s included in each Path plan.</p>
          </div>
          {/* Black header bar */}
          <div className="flex items-center gap-0" style={{ backgroundColor: '#0a0a0a' }}>
            <div className="flex-1 py-4 px-4 font-bold text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}></div>
            <div className="flex-1 py-4 px-4 text-center">
              <div className="text-[10px] text-[rgb(var(--accent-text))] font-bold mb-1">ACTIVE PLAN</div>
              <div className="font-bold text-white text-sm">Standard</div>
              <div className="text-xs font-bold text-[rgb(var(--accent-text))]">Pay As You Go</div>
            </div>
            <div className="flex-1 py-4 px-4 text-center">
              <div className="font-bold text-white text-sm">Pro</div>
              <div className="text-xs font-bold text-[rgb(var(--accent-text))]">Path Credits Subscription</div>
            </div>
            <div className="flex-1 py-4 px-4 text-center">
              <div className="font-bold text-white text-sm">Enterprise</div>
              <div className="text-xs font-bold text-[rgb(var(--accent-text))]">$499/month</div>
            </div>
          </div>
          {/* White body */}
          <table className="w-full text-sm bg-white">
            <tbody>
              {[
                { label: "Next Morning Turnaround", values: [false, true, true] },
                { label: "Discount on credits", values: ["0%", "35%", "Custom"] },
                { label: "Image editing price", values: ["Variable", "Variable", "Flat"] },
                { label: "Dedicated Account Manager", values: [false, false, true] },
                { label: "Dedicated Editing Team", values: [false, true, true] },
                { label: "Monthly billing by invoice", values: [false, false, true] },
                { label: "Minimum order fee", values: ["$2.5", false, false] },
              ].map((row, ri) => (
                <tr key={row.label} className={`border-b border-black/5 ${ri % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}`}>
                  <td className="py-3.5 px-4 text-black/70 font-medium">{row.label}</td>
                  {row.values.map((val, i) => {
                    if (val === true) {
                      return (
                        <td key={i} className="py-3.5 px-4 text-center bg-[rgb(var(--accent-500))/15%]">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        </td>
                      );
                    }
                    if (val === false) {
                      return <td key={i} className="py-3.5 px-4 text-center text-black/20 font-bold">—</td>;
                    }
                    return <td key={i} className="py-3.5 px-4 text-center font-bold text-black/80">{val}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQs — sidebar */}
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-base font-bold mb-4">FAQs</h3>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="rounded-xl border border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
                >
                  <span className="font-bold text-xs text-[rgb(var(--fg-rgb))]">{f.q}</span>
                  <motion.span
                    animate={{ rotate: faqOpen === i ? 45 : 0 }}
                    className="shrink-0 w-7 h-7 rounded-full bg-[rgb(var(--fg-rgb)/6%)] flex items-center justify-center text-[rgb(var(--fg-rgb))]"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <p className="px-4 pb-3.5 text-xs text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">{f.a}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View all packs link */}
      <div className="mt-6">
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
