"use client";

import { Fragment, useMemo, useState } from "react";
import {
  ShieldCheck,
  Users,
  Package,
  History,
  LogOut,
  ChevronDown,
  ChevronRight,
  Search,
  FileText,
} from "lucide-react";
import { adjustCredits, updateOrderStatus } from "./actions";
import type { Profile, Order, CreditTransaction } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  revision_requested: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  delivered: "bg-[rgb(var(--accent-500)/15%)] text-[rgb(var(--accent-text))] border-[rgb(var(--accent-500)/25%)]",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Under Review",
  in_progress: "In Progress",
  revision_requested: "Revision",
  completed: "Completed",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const ORDER_STATUSES = ["pending", "in_progress", "revision_requested", "completed", "delivered", "cancelled"];

const RANGES = [
  { value: 0, label: "All" },
  { value: 1, label: "Today" },
  { value: 7, label: "7 days" },
  { value: 15, label: "15 days" },
  { value: 30, label: "30 days" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function rangeStartIso(days: number): string | null {
  if (days <= 0) return null;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (days > 1) d.setDate(d.getDate() - (days - 1));
  return d.toISOString();
}

function todayEndIso() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export default function AdminPanel({
  profiles,
  orders,
  transactions,
}: {
  profiles: Profile[];
  orders: Order[];
  transactions: CreditTransaction[];
}) {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [rangeDays, setRangeDays] = useState(0);

  const q = query.trim().toLowerCase();
  const cutoffMs = useMemo(() => {
    if (rangeDays <= 0) return 0;
    const iso = rangeStartIso(rangeDays);
    return iso ? new Date(iso).getTime() : 0;
  }, [rangeDays]);

  const visibleProfiles = useMemo(
    () =>
      profiles.filter(
        (p) =>
          !q ||
          (p.full_name || "").toLowerCase().includes(q) ||
          (p.email || "").toLowerCase().includes(q),
      ),
    [profiles, q],
  );

  const customerMask = useMemo(() => new Set(visibleProfiles.map((p) => p.id)), [visibleProfiles]);

  const inRangeOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          customerMask.has(o.user_id) &&
          (cutoffMs === 0 || new Date(o.created_at).getTime() >= cutoffMs),
      ),
    [orders, customerMask, cutoffMs],
  );

  const billTotal = useMemo(
    () => inRangeOrders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.credit_cost, 0),
    [inRangeOrders],
  );

  return (
    <>
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
        <form action="/auth/signout" method="post" className="inline-flex self-start">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card border border-[rgb(var(--fg-rgb)/10%)] text-sm font-bold hover:border-red-500/50 hover:text-red-400 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </form>
      </div>

      {/* Filters for billing */}
      <div className="glass-card rounded-3xl p-4 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--fg-rgb)/40%)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customer name or email..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] outline-none focus:border-[rgb(var(--accent-500)/60%)] transition-colors text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {RANGES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRangeDays(r.value)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  rangeDays === r.value
                    ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] border-[rgb(var(--accent-500))]"
                    : "bg-[var(--bg-subtle)] border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb)/60%)] hover:border-[rgb(var(--accent-500)/50%)]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-sm text-[rgb(var(--fg-rgb)/60%)]">
          Showing{" "}
          <span className="font-bold text-[rgb(var(--accent-text))]">{visibleProfiles.length}</span> of{" "}
          {profiles.length} customers · <span className="font-bold">{inRangeOrders.length}</span> orders · Bill
          total (non‑cancelled): <span className="font-black text-[rgb(var(--accent-text))]">{billTotal.toLocaleString()}</span> credits
        </p>
      </div>

      {/* Customers */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-[rgb(var(--accent-text))]" />
          <h2 className="text-xl font-bold">Customers ({visibleProfiles.length})</h2>
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
                  <th className="px-6 py-4 font-bold text-[rgb(var(--fg-rgb)/55%)]">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {visibleProfiles.map((profile) => {
                  const expanded = expandedUser === profile.id;
                  const customerOrders = inRangeOrders.filter((o) => o.user_id === profile.id);
                  const fromIso =
                    rangeDays > 0
                      ? rangeStartIso(rangeDays)!
                      : customerOrders.length
                        ? customerOrders.map((o) => o.created_at).sort()[0]
                        : new Date(Date.now() - 365 * 86400000).toISOString();
                  const invoiceUrl = `/admin/invoice?user_id=${encodeURIComponent(profile.id)}&from=${encodeURIComponent(
                    fromIso,
                  )}&to=${encodeURIComponent(todayEndIso())}`;
                  return (
                    <Fragment key={profile.id}>
                      <tr className="border-b border-[rgb(var(--fg-rgb)/5%)] last:border-0">
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => setExpandedUser(expanded ? null : profile.id)}
                            className="inline-flex items-center gap-2 text-left"
                          >
                            <span className="text-[rgb(var(--fg-rgb)/40%)] shrink-0">
                              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </span>
                            <span>
                              <span className="block font-bold">{profile.full_name || "—"}</span>
                              <span className="block text-xs text-[rgb(var(--fg-rgb)/50%)]">{profile.email}</span>
                            </span>
                          </button>
                          {customerOrders.length > 0 && (
                            <p className="mt-1 text-[10px] font-bold text-[rgb(var(--accent-text))]">
                              {customerOrders.length} order{customerOrders.length === 1 ? "" : "s"} in range — click to view
                            </p>
                          )}
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
                        <td className="px-6 py-4">
                          <a
                            href={invoiceUrl}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[rgb(var(--accent-500)/30%)] text-[rgb(var(--accent-text))] text-xs font-bold hover:bg-[rgb(var(--accent-500)/10%)] transition-all whitespace-nowrap"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Invoice
                          </a>
                        </td>
                      </tr>
                      {expanded && (
                        <tr className="border-b border-[rgb(var(--fg-rgb)/5%)]">
                          <td colSpan={6} className="px-6 py-4 bg-[rgb(var(--accent-500)/2%)]">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-[rgb(var(--fg-rgb)/45%)] mb-3">
                              Orders from {profile.full_name || profile.email}{" "}
                              <span className="text-[rgb(var(--accent-text))]">({customerOrders.length})</span>
                            </p>
                            {customerOrders.length === 0 ? (
                              <p className="text-sm text-[rgb(var(--fg-rgb)/50%)]">
                                No orders in this period.
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {customerOrders.map((order) => (
                                  <div
                                    key={order.id}
                                    className="rounded-xl border border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)] px-4 py-3"
                                  >
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                      <p className="font-bold text-sm">{order.title || order.service || "Order"}</p>
                                      {order.reference && (
                                        <span className="font-mono text-xs font-bold tracking-[0.08em] text-[rgb(var(--accent-text))]">
                                          {order.reference}
                                        </span>
                                      )}
                                      <span
                                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}
                                      >
                                        {STATUS_LABELS[order.status] || order.status}
                                      </span>
                                      <span className="ml-auto text-xs text-[rgb(var(--fg-rgb)/50%)]">
                                        {formatDate(order.created_at)} · {order.credit_cost} credits
                                      </span>
                                    </div>
                                    {order.description && (
                                      <p className="mt-1.5 text-xs text-[rgb(var(--fg-rgb)/60%)]">{order.description}</p>
                                    )}
                                    {order.status === "revision_requested" && order.revision_note && (
                                      <p className="mt-1.5 text-xs text-violet-500 border-l-2 border-violet-500/40 pl-2">
                                        <span className="font-bold">Revision:</span> {order.revision_note}
                                      </p>
                                    )}
                                    <p className="mt-1 text-[11px] text-[rgb(var(--fg-rgb)/40%)]">
                                      Images: {order.image_count}
                                      {order.service ? ` · ${order.service}` : ""}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-5 h-5 text-[rgb(var(--accent-text))]" />
          <h2 className="text-xl font-bold">Orders ({inRangeOrders.length})</h2>
        </div>
        {inRangeOrders.length > 0 ? (
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
                  {inRangeOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[rgb(var(--fg-rgb)/5%)] last:border-0">
                      <td className="px-6 py-4">
                        <p className="font-bold">{order.title || order.service || "Order"}</p>
                        {order.reference && (
                          <p className="font-mono text-xs font-bold tracking-[0.08em] text-[rgb(var(--accent-text))] mt-0.5">
                            {order.reference}
                          </p>
                        )}
                        <p className="text-xs text-[rgb(var(--fg-rgb)/50%)] max-w-[220px] truncate">{order.description}</p>
                        {order.status === "revision_requested" && order.revision_note && (
                          <p className="text-xs text-violet-500 max-w-[220px] truncate mt-0.5">
                            <span className="font-bold">Rev:</span> {order.revision_note}
                          </p>
                        )}
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
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer outline-none ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}
                          >
                            {ORDER_STATUSES.map((s) => (
                              <option key={s} value={s} className="bg-[var(--bg-subtle)] text-[rgb(var(--fg-rgb))]">
                                {STATUS_LABELS[s] || s.replace("_", " ")}
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
          <p className="text-sm text-[rgb(var(--fg-rgb)/50%)]">No orders in this period.</p>
        )}
      </div>

      {/* Recent credit activity */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <History className="w-5 h-5 text-[rgb(var(--accent-text))]" />
          <h2 className="text-xl font-bold">Recent credit activity</h2>
        </div>
        {transactions.length > 0 ? (
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
    </>
  );
}