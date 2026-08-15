"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Sparkles, Coins, Zap } from "lucide-react";
import CreditSlider, { CREDIT_BUNDLES, savingPct } from "./CreditSlider";

export default function CreditBundleSelector() {
  const [selected, setSelected] = useState(CREDIT_BUNDLES.find((b) => b.popular)?.price ?? 250);
  const [mode, setMode] = useState<"once" | "subscribe">("once");
  const [frequency, setFrequency] = useState<"weekly" | "monthly" | "quarterly" | "yearly">("monthly");
  const [view, setView] = useState<"packs" | "buy">("packs");
  const [modalOpen, setModalOpen] = useState(false);

  const FREQUENCIES: { id: "weekly" | "monthly" | "quarterly" | "yearly"; label: string; badge?: string }[] = [
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
    { id: "quarterly", label: "3 Months" },
    { id: "yearly", label: "Yearly", badge: "2 months free" },
  ];

  const FREQUENCY_FOOTER: Record<typeof frequency, string> = {
    weekly: "Billed every week",
    monthly: "Billed monthly",
    quarterly: "Billed every 3 months",
    yearly: "Billed yearly",
  };

  const bundle = CREDIT_BUNDLES.find((b) => b.price === selected) ?? CREDIT_BUNDLES[0];

  const payHref = `/payment?plan=${encodeURIComponent("Credit Pack")}&amount=${bundle.price}&desc=${encodeURIComponent(
    `${bundle.credits.toLocaleString()} credits ($${bundle.paid.toLocaleString()} paid + ${bundle.free.toLocaleString()} bonus)`,
  )}`;

  return (
    <div className="rounded-3xl border-2 border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg)] p-6 sm:p-10">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-xs font-bold border border-[rgb(var(--accent-500)/15%)]">
          <Coins className="w-3.5 h-3.5" />
          Path credit bundles
        </span>
        <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-[rgb(var(--fg-rgb))]">
          How much do you want to spend?
        </h2>
        <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/55%)]">
          Pick an amount below — bigger bundles include bonus credits for a lower price per credit.
        </p>
      </div>

      {/* Toggle: packs / buy */}
      <div className="mt-8 flex justify-center">
        <div className="inline-flex rounded-full border border-[rgb(var(--fg-rgb)/10%)] bg-[var(--bg-subtle)] p-1">
          <button
            type="button"
            onClick={() => setView("packs")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              view === "packs"
                ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow"
                : "text-[rgb(var(--fg-rgb)/60%)] hover:text-[rgb(var(--fg-rgb))]"
            }`}
          >
            Credit packs
          </button>
          <button
            type="button"
            onClick={() => setView("buy")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              view === "buy"
                ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow"
                : "text-[rgb(var(--fg-rgb)/60%)] hover:text-[rgb(var(--fg-rgb))]"
            }`}
          >
            <Zap className="w-3 h-3" />
            Buy credits
          </button>
        </div>
      </div>

      {view === "packs" ? (
        <>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CREDIT_BUNDLES.map((b) => {
              const active = selected === b.price;
              const save = savingPct(b.per);
              return (
                <button
                  key={b.price}
                  type="button"
                  onClick={() => setSelected(b.price)}
                  className={`relative rounded-2xl border-2 px-6 py-8 sm:px-8 sm:py-10 text-center transition-all cursor-pointer ${
                    active
                      ? "border-[rgb(var(--accent-600))] bg-[rgb(var(--accent-500))] shadow-lg shadow-[rgb(var(--accent-500)/30%)]"
                      : "border-[rgb(var(--fg-rgb)/10%)] bg-[var(--bg-subtle)] hover:border-[rgb(var(--accent-500)/40%)] hover:-translate-y-0.5"
                  }`}
                >
                  {b.popular && (
                    <span className={`absolute -top-2.5 right-5 text-[10px] font-bold px-2.5 py-1 rounded-full ${active ? "bg-[rgb(var(--accent-contrast))] text-[rgb(var(--accent-500))]" : "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]"}`}>
                      Popular
                    </span>
                  )}

                  <span className={`mx-auto w-12 h-12 rounded-2xl grid place-items-center border ${active ? "bg-[rgb(var(--accent-contrast)/15%)] border-[rgb(var(--accent-contrast)/25%)] text-[rgb(var(--accent-contrast))]" : "bg-[rgb(var(--accent-500)/10%)] border-[rgb(var(--accent-500)/20%)] text-[rgb(var(--accent-text))]"}`}>
                    <Coins className="w-6 h-6" />
                  </span>

                  <div className={`mt-4 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 ${active ? "text-[rgb(var(--accent-contrast))]" : "text-[rgb(var(--fg-rgb))]"}`}>
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      ${b.price.toLocaleString()}
                    </span>
                    <span className={`text-2xl sm:text-3xl font-bold ${active ? "text-[rgb(var(--accent-contrast)/70%)]" : "text-[rgb(var(--fg-rgb)/35%)]"}`}>→</span>
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {b.credits.toLocaleString()}
                    </span>
                    <span className={`text-sm font-bold uppercase tracking-wide ${active ? "text-[rgb(var(--accent-contrast)/70%)]" : "text-[rgb(var(--fg-rgb)/45%)]"}`}>
                      credits
                    </span>
                  </div>

                  <span className={`mt-5 inline-flex flex-wrap items-center justify-center gap-x-2 rounded-xl border px-4 py-2.5 text-sm font-semibold ${
                    active
                      ? "border-[rgb(var(--accent-contrast)/25%)] bg-[rgb(var(--accent-contrast)/10%)] text-[rgb(var(--accent-contrast))]"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  }`}>
                    <span className="font-bold">{b.paid.toLocaleString()} paid</span>
                    <span className="opacity-70">+</span>
                    <span className="font-bold">{b.free.toLocaleString()} free</span>
                    <span className="opacity-50">·</span>
                    <span>${b.per.toFixed(2)} / credit</span>
                  </span>

                  <p className={`mt-4 inline-flex items-center gap-1.5 text-xs font-bold ${active ? "text-[rgb(var(--accent-contrast)/85%)]" : "text-emerald-500"}`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    Save {save}% on this pack
                  </p>
                </button>
              );
            })}
          </div>

          {/* Buy credits button → opens popup */}
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-12 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm shadow-lg shadow-[rgb(var(--accent-500)/25%)] cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              Buy ${bundle.price.toLocaleString()} pack
            </button>
          </div>
        </>
      ) : (
        <div className="mt-8 rounded-2xl border-2 border-[rgb(var(--accent-500)/20%)] bg-[rgb(var(--accent-500)/4%)] p-5 sm:p-6">
          <CreditSlider
            value={selected}
            onChange={setSelected}
            subtitle={`${bundle.credits.toLocaleString()} credits for $${bundle.price.toLocaleString()} — paid on purchase.`}
          />
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm shadow-lg shadow-[rgb(var(--accent-500)/25%)] cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              Buy ${bundle.price.toLocaleString()} pack
            </button>
          </div>
          <button
            type="button"
            onClick={() => setView("packs")}
            className="mt-4 block mx-auto text-xs font-bold text-[rgb(var(--accent-text))] hover:underline cursor-pointer"
          >
            ← Back to credit packs
          </button>
        </div>
      )}

      {/* Payment popup */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
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
                  onClick={() => setModalOpen(false)}
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
                    onClick={() => setModalOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm shadow-lg shadow-[rgb(var(--accent-500)/25%)]"
                  >
                    <Zap className="w-4 h-4" />
                    Buy ${bundle.price.toLocaleString()} pack
                  </Link>
                ) : (
                  <Link
                    href="/subscription"
                    onClick={() => setModalOpen(false)}
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
    </div>
  );
}
