import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Profile, Order } from "@/lib/types";
import { FileText, Inbox, Clock3, BadgeCheck, Coins } from "lucide-react";
import { STATUS_STYLES, STATUS_LABELS, formatDate } from "@/lib/order-status";
import ConfirmQuoteButton from "../confirm-quote-button";

export default async function QuotesPage() {
  if (!supabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single<Profile>(),
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .eq("kind", "quote")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const p = profile as Profile | null;
  const quotes = (orders ?? []) as Order[];
  const awaiting = quotes.filter((q) => q.status === "pending");
  const ready = quotes.filter((q) => q.status === "quoted");
  const cancelled = quotes.filter((q) => q.status === "cancelled");
  const balance = p?.credits_balance ?? 0;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text leading-[1.15]">Quotes</h1>
          <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/55%)]">
            Review the price we&apos;ve quoted, then confirm to turn it into an order.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl glass-card text-sm">
          <Coins className="w-4 h-4 text-[rgb(var(--accent-text))]" />
          <span className="text-[rgb(var(--fg-rgb)/55%)]">Balance</span>
          <span className="font-bold text-[rgb(var(--accent-text))]">{balance.toLocaleString()}</span>
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className="glass-card rounded-3xl text-center py-16">
          <Inbox className="w-12 h-12 mx-auto text-[rgb(var(--fg-rgb)/25%)]" />
          <p className="mt-4 font-bold text-[rgb(var(--fg-rgb)/70%)]">No quotes yet</p>
          <p className="mt-1 text-sm text-[rgb(var(--fg-rgb)/50%)]">
            Submit a request and once we review it, your quotation will appear here.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm"
          >
            Request a quote
          </Link>
        </div>
      ) : (
        <>
          {awaiting.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Clock3 className="w-4 h-4 text-amber-500" />
                <h2 className="font-bold">Under review ({awaiting.length})</h2>
              </div>
              <ul className="glass-card rounded-3xl p-5 space-y-3">
                {awaiting.map((q) => (
                  <QuoteRow key={q.id} q={q} showConfirm={false} balance={balance} />
                ))}
              </ul>
            </div>
          )}

          {ready.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <BadgeCheck className="w-4 h-4 text-emerald-500" />
                <h2 className="font-bold">Ready to confirm ({ready.length})</h2>
              </div>
              <ul className="glass-card rounded-3xl p-5 space-y-3">
                {ready.map((q) => (
                  <QuoteRow key={q.id} q={q} showConfirm balance={balance} />
                ))}
              </ul>
            </div>
          )}

          {cancelled.length > 0 && (
            <p className="text-xs text-[rgb(var(--fg-rgb)/40%)]">
              {cancelled.length} cancelled quote{cancelled.length === 1 ? "" : "s"} excluded.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function QuoteRow({
  q,
  showConfirm,
  balance,
}: {
  q: Order;
  showConfirm: boolean;
  balance: number;
}) {
  const enough = balance >= (q.credit_cost || 0);
  return (
    <li
      className={`p-5 rounded-2xl bg-[var(--bg-subtle)] border ${
        showConfirm
          ? "border-[rgb(var(--accent-500)/25%)]"
          : "border-[rgb(var(--fg-rgb)/5%)]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[rgb(var(--fg-rgb)/40%)] shrink-0" />
            <p className="font-bold truncate">{q.title || q.service || "Quote"}</p>
          </div>
          {q.reference && (
            <p className="font-mono text-xs font-bold tracking-[0.08em] text-[rgb(var(--accent-text))] mt-0.5">
              {q.reference} · Quote
            </p>
          )}
          <p className="text-xs text-[rgb(var(--fg-rgb)/50%)] mt-0.5">
            {formatDate(q.created_at)} · {q.image_count} image{q.image_count === 1 ? "" : "s"}
          </p>
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
            STATUS_STYLES[showConfirm ? "quoted" : "pending"]
          }`}
        >
          {showConfirm ? <BadgeCheck className="w-3 h-3" /> : <Clock3 className="w-3 h-3" />}
          {showConfirm ? "Quoted" : STATUS_LABELS.pending}
        </span>
      </div>

      {q.description && (
        <p className="mt-2 text-xs text-[rgb(var(--fg-rgb)/60%)]">{q.description}</p>
      )}

      {showConfirm && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[rgb(var(--fg-rgb)/8%)] pt-4">
          <p className="text-sm">
            <span className="text-[rgb(var(--fg-rgb)/55%)]">Total price: </span>
            <span className="font-black text-[rgb(var(--accent-text))]">{q.credit_cost.toLocaleString()} credits</span>
            {!enough && (
              <span className="ml-2 text-xs text-amber-500 font-bold">
                (balance {balance.toLocaleString()} — {" "}
                <Link href="/credits" className="underline">
                  top up
                </Link>
                )
              </span>
            )}
          </p>
          <ConfirmQuoteButton orderId={q.id} />
        </div>
      )}

      {!showConfirm && (
        <p className="mt-3 text-[11px] text-[rgb(var(--fg-rgb)/40%)]">
          Our team reviews this request and will provide the final price shortly.
        </p>
      )}
    </li>
  );
}