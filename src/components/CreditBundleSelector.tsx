"use client";

import { useState } from "react";
import Link from "next/link";
import { BadgeCheck, Sparkles, Coins, Zap } from "lucide-react";
import CreditSlider, { CREDIT_BUNDLES, savingPct } from "./CreditSlider";

export default function CreditBundleSelector() {
  const [selected, setSelected] = useState(CREDIT_BUNDLES.find((b) => b.popular)?.price ?? 250);
  const [mode, setMode] = useState<"once" | "subscribe">("once");
  const [frequency, setFrequency] = useState<"monthly" | "yearly">("monthly");
  const [view, setView] = useState<"packs" | "buy">("packs");

  const bundle = CREDIT_BUNDLES.find((b) => b.price === selected) ?? CREDIT_BUNDLES[0];

  const payHref = `/payment?plan=${encodeURIComponent("Credit Pack")}&amount=${bundle.price}&desc=${encodeURIComponent(
    `${bundle.credits.toLocaleString()} credits ($${bundle.paid.toLocaleString()} paid + ${bundle.free.toLocaleString()} bonus)`,
  )}`;

  return (
    <div className="rounded-3xl border-2 border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg)] p-6 sm:p-10">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
        {/* Left: selector */}
        <div className="flex-1 min-w-0">
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

          {/* Amount selector */}
          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <p className="text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold">
                Select Path credit bundle amount
              </p>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {CREDIT_BUNDLES.map((b) => {
                  const active = selected === b.price;
                  const save = savingPct(b.per);
                  return (
                    <button
                      key={b.price}
                      type="button"
                      onClick={() => setSelected(b.price)}
                      className={`relative rounded-2xl border-2 px-4 py-4 text-left transition-all cursor-pointer ${
                        active
                          ? "border-[rgb(var(--accent-500))] bg-[rgb(var(--accent-500)/10%)] shadow-lg shadow-[rgb(var(--accent-500)/15%)]"
                          : "border-[rgb(var(--fg-rgb)/10%)] bg-[var(--bg-subtle)] hover:border-[rgb(var(--accent-500)/40%)]"
                      }`}
                    >
                      {b.popular && (
                        <span className="absolute -top-2.5 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]">
                          Popular
                        </span>
                      )}
                      <span className={`text-lg font-extrabold ${active ? "text-[rgb(var(--accent-text))]" : "text-[rgb(var(--fg-rgb))]"}`}>
                        ${b.price.toLocaleString()}
                      </span>
                      <span className="block mt-1 text-[11px] font-semibold text-[rgb(var(--fg-rgb)/55%)]">
                        {b.credits.toLocaleString()} credits
                      </span>
                      <span className="block mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                        <Sparkles className="w-3 h-3" />
                        Save {save}%
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-[rgb(var(--accent-500)/20%)] bg-[rgb(var(--accent-500)/4%)] p-5 sm:p-6">
                <CreditSlider
                  value={selected}
                  onChange={setSelected}
                  subtitle={`${bundle.credits.toLocaleString()} credits for $${bundle.price.toLocaleString()} — paid on purchase.`}
                />
                <button
                  type="button"
                  onClick={() => setView("packs")}
                  className="mt-4 text-xs font-bold text-[rgb(var(--accent-text))] hover:underline"
                >
                  ← Back to credit packs
                </button>
              </div>
            )}
          </div>

          {/* Buy once / Subscribe */}
          <div className="mt-8">
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

            {mode === "subscribe" && (
              <div className="mt-4">
                <p className="text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-3">
                  Choose billing frequency
                </p>
                <div className="inline-flex rounded-full border border-[rgb(var(--fg-rgb)/10%)] bg-[var(--bg-subtle)] p-1">
                  <button
                    type="button"
                    onClick={() => setFrequency("monthly")}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                      frequency === "monthly"
                        ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow"
                        : "text-[rgb(var(--fg-rgb)/60%)] hover:text-[rgb(var(--fg-rgb))]"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency("yearly")}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                      frequency === "yearly"
                        ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow"
                        : "text-[rgb(var(--fg-rgb)/60%)] hover:text-[rgb(var(--fg-rgb))]"
                    }`}
                  >
                    Yearly
                    <span className="ml-1.5 text-[10px] font-bold text-emerald-500">2 months free</span>
                  </button>
                </div>
                <p className="mt-3 text-xs text-[rgb(var(--fg-rgb)/50%)]">
                  Monthly credit plans come with Standard / Pro / Enterprise tiers — including bonus credits every billing cycle.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: summary */}
        <div className="lg:w-[360px] shrink-0">
          <div className="rounded-3xl border-2 border-[rgb(var(--accent-500)/25%)] bg-[rgb(var(--accent-500)/4%)] p-6 sm:p-8 sticky lg:top-28">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-[rgb(var(--fg-rgb))] tracking-tight">
                ${bundle.price.toLocaleString()}
              </span>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-[rgb(var(--accent-text))]" />
                <span className="font-black text-lg text-[rgb(var(--fg-rgb))]">
                  {bundle.credits.toLocaleString()} credits
                </span>
              </div>
              <p className="text-[rgb(var(--fg-rgb)/55%)]">
                <span className="font-bold text-[rgb(var(--fg-rgb)/75%)]">${bundle.paid.toLocaleString()} paid</span> +{" "}
                <span className="font-bold text-[rgb(var(--accent-text))]">{bundle.free.toLocaleString()} free</span>
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-[rgb(var(--fg-rgb)/6%)] border border-[rgb(var(--fg-rgb)/10%)] font-bold text-[rgb(var(--fg-rgb)/65%)]">
                  ${bundle.per.toFixed(2)} / credit
                </span>
                <span className="font-bold text-emerald-500">Save {savingPct(bundle.per)}%</span>
              </div>
            </div>

            <div className="mt-7">
              {mode === "once" ? (
                <Link
                  href={payHref}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm shadow-lg shadow-[rgb(var(--accent-500)/25%)]"
                >
                  <Zap className="w-4 h-4" />
                  Buy ${bundle.price.toLocaleString()} pack
                </Link>
              ) : (
                <Link
                  href="/subscription"
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
                : `${frequency === "monthly" ? "Billed monthly" : "Billed yearly"} — cancel anytime.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}