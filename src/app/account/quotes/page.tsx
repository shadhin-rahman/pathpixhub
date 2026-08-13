import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Order } from "@/lib/types";
import { FileText, Inbox, Clock3 } from "lucide-react";
import { STATUS_STYLES, STATUS_LABELS, formatDate } from "@/lib/order-status";

export default async function QuotesPage() {
  if (!supabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(50);

  const quotes = (orders ?? []) as Order[];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text leading-[1.15]">Quotes</h1>
        <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/55%)]">
          Quotation requests our team is currently reviewing.
        </p>
      </div>

      {quotes.length === 0 ? (
        <div className="glass-card rounded-3xl text-center py-16">
          <Inbox className="w-12 h-12 mx-auto text-[rgb(var(--fg-rgb)/25%)]" />
          <p className="mt-4 font-bold text-[rgb(var(--fg-rgb)/70%)]">No quotes waiting for review</p>
          <p className="mt-1 text-sm text-[rgb(var(--fg-rgb)/50%)]">
            Once a quote is approved it moves to your orders.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm"
          >
            Request a quote
          </Link>
        </div>
      ) : (
        <ul className="glass-card rounded-3xl p-5 space-y-3">
          {quotes.map((q) => (
            <li
              key={q.id}
              className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/5%)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[rgb(var(--fg-rgb)/40%)] shrink-0" />
                    <p className="font-bold truncate">{q.title || q.service || "Quote"}</p>
                  </div>
                  {q.reference && (
                    <p className="font-mono text-xs font-bold tracking-[0.08em] text-[rgb(var(--accent-text))] mt-0.5">
                      {q.reference}
                    </p>
                  )}
                  <p className="text-xs text-[rgb(var(--fg-rgb)/50%)] mt-0.5">
                    {formatDate(q.created_at)} · {q.image_count} image{q.image_count === 1 ? "" : "s"}
                    {q.credit_cost > 0 ? ` · est. ${q.credit_cost} credits` : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${STATUS_STYLES[q.status]}`}
                >
                  <Clock3 className="w-3 h-3" />
                  {STATUS_LABELS[q.status] || "Under review"}
                </span>
              </div>
              {q.description && (
                <p className="mt-2 text-xs text-[rgb(var(--fg-rgb)/60%)]">{q.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}