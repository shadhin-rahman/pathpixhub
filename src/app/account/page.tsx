import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { CreditCard, Package, History, LogOut, Settings } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  delivered: "bg-[rgb(var(--accent-500)/15%)] text-[rgb(var(--accent-text))] border-[rgb(var(--accent-500)/25%)]",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AccountPage() {
  if (!supabaseConfigured()) {
    return (
      <section className="pt-40 pb-28 mesh-gradient min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          <div className="glass-card rounded-3xl p-10 text-center">
            <h1 className="text-3xl font-bold gradient-text">Client Account</h1>
            <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)]">
              The account system is not connected yet. Add your Supabase keys to{" "}
              <code className="px-1.5 py-0.5 rounded bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))]">.env.local</code>{" "}
              and apply the SQL in{" "}
              <code className="px-1.5 py-0.5 rounded bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))]">supabase/migrations/0001_initial.sql</code>.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile }, { data: orders }, { data: transactions }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single<Profile>(),
      supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("credit_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  const p = profile as Profile | null;

  return (
    <section className="pt-40 pb-28 mesh-gradient min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-sm font-bold mb-4 border border-[rgb(var(--accent-500)/15%)]">
              <CreditCard className="w-4 h-4" />
              Client Dashboard
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-text leading-[1.1]">
              Hi, {p?.full_name || user.email?.split("@")[0] || "there"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {p?.role === "admin" && (
              <Link
                href="/admin"
                className="px-6 py-3 rounded-full glass-card border border-[rgb(var(--fg-rgb)/10%)] text-sm font-bold hover:border-[rgb(var(--accent-500)/50%)] transition-all"
              >
                Admin Panel
              </Link>
            )}
            <Link
              href="/auth/signout"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card border border-[rgb(var(--fg-rgb)/10%)] text-sm font-bold hover:border-red-500/50 hover:text-red-400 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </Link>
          </div>
        </div>

        {/* Balance + quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="glass-card rounded-3xl p-7">
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-[rgb(var(--fg-rgb)/45%)]">Credit balance</p>
            <p className="mt-3 text-4xl font-black text-[rgb(var(--accent-text))]">
              {(p?.credits_balance ?? 0).toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-[rgb(var(--fg-rgb)/50%)]">credits available</p>
            <Link
              href="/credits"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[rgb(var(--accent-text))] hover:underline"
            >
              Buy more credits →
            </Link>
          </div>
          <div className="glass-card rounded-3xl p-7">
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-[rgb(var(--fg-rgb)/45%)]">Total orders</p>
            <p className="mt-3 text-4xl font-black">{(orders ?? []).length}</p>
            <p className="mt-1 text-sm text-[rgb(var(--fg-rgb)/50%)]">all time</p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[rgb(var(--accent-text))] hover:underline"
            >
              Place an order →
            </Link>
          </div>
          <div className="glass-card rounded-3xl p-7">
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-[rgb(var(--fg-rgb)/45%)]">Member since</p>
            <p className="mt-3 text-2xl font-black leading-tight">
              {p?.created_at ? formatDate(p.created_at) : "—"}
            </p>
            <p className="mt-1 text-sm text-[rgb(var(--fg-rgb)/50%)]">{user.email}</p>
            <Link
              href="/account/settings"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[rgb(var(--accent-text))] hover:underline"
            >
              <Settings className="w-3.5 h-3.5" />
              Profile settings
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Orders */}
          <div className="glass-card rounded-3xl p-7">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-[rgb(var(--accent-text))]" />
              <h2 className="text-xl font-bold">Order history</h2>
            </div>
            {orders && orders.length > 0 ? (
              <ul className="space-y-4">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/5%)]"
                  >
                    <div className="min-w-0">
                      <p className="font-bold truncate">{order.title || order.service || "Order"}</p>
                      <p className="text-xs text-[rgb(var(--fg-rgb)/50%)] mt-0.5">
                        {formatDate(order.created_at)} · {order.image_count} image{order.image_count === 1 ? "" : "s"}
                        {order.credit_cost > 0 ? ` · ${order.credit_cost} credits` : ""}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border capitalize ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[rgb(var(--fg-rgb)/50%)]">No orders yet.</p>
            )}
          </div>

          {/* Transactions */}
          <div className="glass-card rounded-3xl p-7">
            <div className="flex items-center gap-2 mb-6">
              <History className="w-5 h-5 text-[rgb(var(--accent-text))]" />
              <h2 className="text-xl font-bold">Credit activity</h2>
            </div>
            {transactions && transactions.length > 0 ? (
              <ul className="space-y-4">
                {transactions.map((tx) => (
                  <li
                    key={tx.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/5%)]"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{tx.reason || "Adjustment"}</p>
                      <p className="text-xs text-[rgb(var(--fg-rgb)/50%)] mt-0.5">{formatDate(tx.created_at)}</p>
                    </div>
                    <span
                      className={`shrink-0 font-black text-sm ${tx.change >= 0 ? "text-emerald-500" : "text-red-500"}`}
                    >
                      {tx.change >= 0 ? "+" : ""}
                      {tx.change.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[rgb(var(--fg-rgb)/50%)]">No credit activity yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
