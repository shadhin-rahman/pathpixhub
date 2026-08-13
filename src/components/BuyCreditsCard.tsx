"use client";

import { useState } from "react";
import Link from "next/link";
import { Coins, Zap } from "lucide-react";
import CreditSlider, { CREDIT_BUNDLES, savingPct } from "./CreditSlider";

export default function BuyCreditsCard({ balance }: { balance: number }) {
  const [selected, setSelected] = useState(250);
  const bundle = CREDIT_BUNDLES.find((b) => b.price === selected) ?? CREDIT_BUNDLES[0];

  const payHref = `/payment?plan=${encodeURIComponent("Credit Pack")}&amount=${bundle.price}&desc=${encodeURIComponent(
    `${bundle.credits.toLocaleString()} credits ($${bundle.paid.toLocaleString()} paid + ${bundle.free.toLocaleString()} bonus)`,
  )}`;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Coins className="w-5 h-5 text-[rgb(var(--accent-text))]" />
            Top up your credit balance
          </h2>
          <p className="mt-1 text-sm text-[rgb(var(--fg-rgb)/55%)]">
            Current balance <span className="font-bold text-[rgb(var(--accent-text))]">{balance.toLocaleString()}</span>{" "}
            credits — drag the slider to pick a pack.
          </p>
        </div>
        <Link
          href="/credits"
          className="shrink-0 text-sm font-bold text-[rgb(var(--accent-text))] hover:underline"
        >
          View all packs →
        </Link>
      </div>

      <CreditSlider
        value={selected}
        onChange={setSelected}
        title="How much do you want to add?"
        subtitle={`${bundle.credits.toLocaleString()} credits added to your balance instantly on payment.`}
      />

      <div className="mt-6 pt-6 border-t border-[rgb(var(--fg-rgb)/8%)] flex flex-col sm:flex-row items-center justify-between gap-4">
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
          Buy ${bundle.price.toLocaleString()} pack
        </Link>
      </div>
    </div>
  );
}