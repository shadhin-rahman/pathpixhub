import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Profile, CreditTransaction } from "@/lib/types";
import { Coins, History, ArrowDownToLine, ArrowUpFromLine, Receipt } from "lucide-react";
import { formatDate } from "@/lib/order-status";

export default async function BillingPage() {
  if (!supabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: transactions }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single<Profile>(),
    supabase
      .from("credit_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const p = profile as Profile | null;
  const txs = (transactions ?? []) as CreditTransaction[];
  const added = txs.filter((t) => t.change > 0).reduce((s, t) => s + t.change, 0);
  const spent = txs.filter((t) => t.change < 0).reduce((s, t) => s + Math.abs(t.change), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text leading-[1.15]">Billing</h1>
        <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/55%)]">
          Your credit balance and payment history.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-3xl p-6">
          <Coins className="w-5 h-5 text-[rgb(var(--accent-text))]" />
          <p className="mt-4 text-3xl font-black text-[rgb(var(--accent-text))]">
            {(p?.credits_balance ?? 0).toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-[rgb(var(--fg-rgb)/50%)]">current balance</p>
          <Link
            href="/credits"
            className="mt-4 inline-flex text-[11px] font-bold text-[rgb(var(--accent-text))] hover:underline"
          >
            Buy more credits →
          </Link>
        </div>
        <div className="glass-card rounded-3xl p-6">
          <ArrowDownToLine className="w-5 h-5 text-emerald-500" />
          <p className="mt-4 text-3xl font-black">{added.toLocaleString()}</p>
          <p className="mt-1 text-xs text-[rgb(var(--fg-rgb)/50%)]">credits added</p>
        </div>
        <div className="glass-card rounded-3xl p-6">
          <ArrowUpFromLine className="w-5 h-5 text-red-500" />
          <p className="mt-4 text-3xl font-black">{spent.toLocaleString()}</p>
          <p className="mt-1 text-xs text-[rgb(var(--fg-rgb)/50%)]">credits used</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-5">
          <History className="w-5 h-5 text-[rgb(var(--accent-text))]" />
          <h2 className="text-xl font-bold">Credit activity</h2>
        </div>
        {txs.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 mx-auto text-[rgb(var(--fg-rgb)/25%)]" />
            <p className="mt-4 font-bold text-[rgb(var(--fg-rgb)/70%)]">No transactions yet</p>
            <p className="mt-1 text-sm text-[rgb(var(--fg-rgb)/50%)]">
              Your payment history will appear here. Invoices are also sent by email.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {txs.map((tx) => (
              <li
                key={tx.id}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/5%)]"
              >
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">{tx.reason || "Adjustment"}</p>
                  <p className="text-xs text-[rgb(var(--fg-rgb)/50%)] mt-0.5">{formatDate(tx.created_at)}</p>
                </div>
                <span className={`shrink-0 font-black text-sm ${tx.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {tx.change >= 0 ? "+" : ""}
                  {tx.change.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}