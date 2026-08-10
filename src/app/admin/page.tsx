import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { adjustCredits, updateOrderStatus } from "./actions";
import { ShieldCheck, Users, Package, History, LogOut } from "lucide-react";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  delivered: "bg-[rgb(var(--accent-500)/15%)] text-[rgb(var(--accent-text))] border-[rgb(var(--accent-500)/25%)]",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const ORDER_STATUSES = ["pending", "in_progress", "completed", "delivered", "cancelled"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminPage() {
  if (!supabaseConfigured()) {
    redirect("/account");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  if (!myProfile || myProfile.role !== "admin") {
    redirect("/account");
  }

  const [{ data: profiles }, { data: orders }, { data: transactions }] =
    await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("credit_transactions").select("*").order("created_at", { ascending: false }).limit(30),
    ]);

  return (
    <section className="pt-40 pb-28 mesh-gradient min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-sm font-bold mb-4 border border-[rgb(var(--accent-500)/15%)]">
              <ShieldCheck className="w-4 h-4" />
              Admin Panel
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-text leading-[1.1]">
              Manage clients &amp; credits
            </h1>
          </div>
          <Link
            href="/auth/signout"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card border border-[rgb(var(--fg-rgb)/10%)] text-sm font-bold hover:border-red-500/50 hover:text-red-400 transition-all self-start"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Link>
        </div>

        {/* Customers */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-[rgb(var(--accent-text))]" />
            <h2 className="text-xl font-bold">Customers ({profiles?.length ?? 0})</h2>
          </div>
          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgb(var(--fg-rgb)/10%)] text-left">
                    <th className="px-6 py-4 font-bold text-[rgb(var(--fg-rgb)/55%)]">Customer</th>
                    <th className="px-6 py-4 font-bold text-[rgb(var(--fg-rgb)/55%)]">Role</th>
                    <th className="px-6 py-4 font-bold text-[rgb(var(--fg-rgb)/55%)]">Credits</th>
                    <th className="px-6 py-4 font-bold text-[rgb(var(--fg-rgb)/55%)]">Joined</th>
                    <th className="px-6 py-4 font-bold text-[rgb(var(--fg-rgb)/55%)]">Adjust credits</th>
                  </tr>
                </thead>
                <tbody>
                  {(profiles ?? []).map((profile) => (
                    <tr key={profile.id} className="border-b border-[rgb(var(--fg-rgb)/5%)] last:border-0">
                      <td className="px-6 py-4">
                        <p className="font-bold">{profile.full_name || "—"}</p>
                        <p className="text-xs text-[rgb(var(--fg-rgb)/50%)]">{profile.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${
                            profile.role === "admin"
                              ? "bg-[rgb(var(--accent-500)/15%)] text-[rgb(var(--accent-text))] border-[rgb(var(--accent-500)/25%)]"
                              : "bg-[rgb(var(--fg-rgb)/5%)] text-[rgb(var(--fg-rgb)/60%)] border-[rgb(var(--fg-rgb)/10%)]"
                          }`}
                        >
                          {profile.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-[rgb(var(--accent-text))]">
                        {profile.credits_balance.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-[rgb(var(--fg-rgb)/55%)]">{formatDate(profile.created_at)}</td>
                      <td className="px-6 py-4">
                        <form action={adjustCredits} className="flex items-center gap-2">
                          <input type="hidden" name="user_id" value={profile.id} />
                          <input
                            type="number"
                            name="change"
                            required
                            placeholder="± credits"
                            className="w-24 px-3 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] outline-none focus:border-[rgb(var(--accent-500)/60%)] transition-colors"
                          />
                          <input
                            type="text"
                            name="reason"
                            placeholder="reason (optional)"
                            className="flex-1 min-w-[120px] px-3 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] outline-none focus:border-[rgb(var(--accent-500)/60%)] transition-colors"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-xs hover:bg-[rgb(var(--accent-400))] transition-all shrink-0"
                          >
                            Apply
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-[rgb(var(--accent-text))]" />
            <h2 className="text-xl font-bold">Orders ({orders?.length ?? 0})</h2>
          </div>
          {orders && orders.length > 0 ? (
            <div className="glass-card rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[rgb(var(--fg-rgb)/10%)] text-left">
                      <th className="px-6 py-4 font-bold text-[rgb(var(--fg-rgb)/55%)]">Order</th>
                      <th className="px-6 py-4 font-bold text-[rgb(var(--fg-rgb)/55%)]">Images</th>
                      <th className="px-6 py-4 font-bold text-[rgb(var(--fg-rgb)/55%)]">Credits</th>
                      <th className="px-6 py-4 font-bold text-[rgb(var(--fg-rgb)/55%)]">Status</th>
                      <th className="px-6 py-4 font-bold text-[rgb(var(--fg-rgb)/55%)]">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-[rgb(var(--fg-rgb)/5%)] last:border-0">
                        <td className="px-6 py-4">
                          <p className="font-bold">{order.title || order.service || "Order"}</p>
                          <p className="text-xs text-[rgb(var(--fg-rgb)/50%)] max-w-[220px] truncate">{order.description}</p>
                        </td>
                        <td className="px-6 py-4">{order.image_count}</td>
                        <td className="px-6 py-4 font-bold">{order.credit_cost}</td>
                        <td className="px-6 py-4">
                          <form action={updateOrderStatus} className="flex items-center gap-2">
                            <input type="hidden" name="order_id" value={order.id} />
                            <select
                              name="status"
                              defaultValue={order.status}
                              onChange={(e) => e.target.form?.requestSubmit()}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold border capitalize cursor-pointer outline-none ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}
                            >
                              {ORDER_STATUSES.map((s) => (
                                <option key={s} value={s} className="bg-[var(--bg-subtle)] text-[rgb(var(--fg-rgb))]">
                                  {s.replace("_", " ")}
                                </option>
                              ))}
                            </select>
                          </form>
                        </td>
                        <td className="px-6 py-4 text-[rgb(var(--fg-rgb)/55%)]">{formatDate(order.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[rgb(var(--fg-rgb)/50%)]">No orders yet.</p>
          )}
        </div>

        {/* Recent credit activity */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-[rgb(var(--accent-text))]" />
            <h2 className="text-xl font-bold">Recent credit activity</h2>
          </div>
          {transactions && transactions.length > 0 ? (
            <ul className="glass-card rounded-3xl p-6 space-y-3">
              {transactions.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="font-bold truncate">{tx.reason || "Adjustment"}</p>
                    <p className="text-xs text-[rgb(var(--fg-rgb)/45%)]">{formatDate(tx.created_at)}</p>
                  </div>
                  <span className={`shrink-0 font-black ${tx.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
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
    </section>
  );
}
