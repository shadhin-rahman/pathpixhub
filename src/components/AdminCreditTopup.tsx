"use client";

import { useState } from "react";
import { Coins, ShieldCheck, UserRound, CheckCircle2 } from "lucide-react";
import { adjustCredits } from "@/app/admin/actions";
import type { Profile } from "@/lib/types";
import CreditSlider, { CREDIT_BUNDLES } from "./CreditSlider";

export default function AdminCreditTopup({ profiles }: { profiles: Profile[] }) {
  const customers = profiles.filter((p) => p.role !== "admin");
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState(250);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const customer = customers.find((c) => c.id === userId);
  const bundle = CREDIT_BUNDLES.find((b) => b.price === amount) ?? CREDIT_BUNDLES[0];

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userId || busy) return;
    setBusy(true);
    setDone(false);
    try {
      const fd = new FormData();
      fd.set("user_id", userId);
      fd.set("change", String(amount));
      fd.set("reason", reason || `Admin top-up — ${amount} credits pack`);
      await adjustCredits(fd);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch {
      // surface nothing; the table will refresh on revalidate
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 mb-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: pick a customer */}
        <div className="lg:w-[300px] shrink-0">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-4">
            <Coins className="w-3.5 h-3.5 text-[rgb(var(--accent-text))]" />
            Quick credit top-up
          </p>
          <h2 className="text-2xl font-bold tracking-tight">Add credits to a customer</h2>
          <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/55%)]">
            Pick a customer, drag the slider to choose a credit pack amount, then apply.
          </p>

          <div className="mt-6">
            <div className="relative">
              <UserRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--fg-rgb)/40%)] pointer-events-none" />
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl appearance-none bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] outline-none focus:border-[rgb(var(--accent-500)/60%)] transition-colors text-sm font-semibold cursor-pointer"
              >
                <option value="">Select a customer…</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name || c.email} — {c.credits_balance.toLocaleString()} credits
                  </option>
                ))}
              </select>
              <svg className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--fg-rgb)/30%)] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        {/* Right: slider */}
        <div className="flex-1 min-w-0">
          <CreditSlider
            value={amount}
            onChange={setAmount}
            title="How many credits to add?"
            subtitle={customer ? `Adding to ${customer.full_name || customer.email}.` : "Select a customer to see the target."}
          />

          <form onSubmit={submit} className="mt-6 pt-6 border-t border-[rgb(var(--fg-rgb)/8%)] flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="reason (optional)"
              className="flex-1 min-w-[180px] px-4 py-3 rounded-2xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] outline-none focus:border-[rgb(var(--accent-500)/60%)] transition-colors text-sm"
            />
            <button
              type="submit"
              disabled={!userId || busy}
              className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold transition-all ${
                !userId || busy
                  ? "bg-[rgb(var(--fg-rgb)/8%)] text-[rgb(var(--fg-rgb)/35%)] cursor-not-allowed"
                  : "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] shadow-lg shadow-[rgb(var(--accent-500)/25%)] cursor-pointer"
              }`}
            >
              {done ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Added {bundle.credits.toLocaleString()} credits
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4" />
                  {busy ? "Adding…" : `Add ${bundle.credits.toLocaleString()} credits`}
                </>
              )}
            </button>
            {customer && (
              <span className="text-xs text-[rgb(var(--fg-rgb)/50%)]">
                New balance ≈ {(customer.credits_balance + bundle.credits).toLocaleString()}
              </span>
            )}
          </form>
          <p className="mt-3 text-[11px] text-[rgb(var(--fg-rgb)/40%)] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin action — the transaction is recorded in the customer&apos;s credit history.
          </p>
        </div>
      </div>
    </div>
  );
}