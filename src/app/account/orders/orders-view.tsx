"use client";

import { useMemo, useState } from "react";
import { Inbox } from "lucide-react";
import type { Order } from "@/lib/types";
import { STATUS_STYLES, STATUS_LABELS, formatDate } from "@/lib/order-status";
import RevisionButton from "../revision-button";

const TABS = [
  { key: "all", label: "All" },
  { key: "processing", label: "Processing" },
  { key: "completed", label: "Completed" },
];

const PROCESSING = ["pending", "in_progress", "revision_requested"];
const COMPLETED = ["completed", "delivered"];

export default function OrdersView({ orders }: { orders: Order[] }) {
  const [tab, setTab] = useState("all");

  const filtered = useMemo(() => {
    if (tab === "processing") return orders.filter((o) => PROCESSING.includes(o.status));
    if (tab === "completed") return orders.filter((o) => COMPLETED.includes(o.status));
    return orders;
  }, [orders, tab]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text leading-[1.15]">Orders</h1>
        <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/55%)]">
          Track every job — from review to delivery.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {TABS.map((t) => {
          const count =
            t.key === "processing"
              ? orders.filter((o) => PROCESSING.includes(o.status)).length
              : t.key === "completed"
                ? orders.filter((o) => COMPLETED.includes(o.status)).length
                : orders.length;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                tab === t.key
                  ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] border-[rgb(var(--accent-500))]"
                  : "bg-[var(--bg-subtle)] border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb)/60%)] hover:border-[rgb(var(--accent-500)/50%)]"
              }`}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card rounded-3xl text-center py-16">
          <Inbox className="w-12 h-12 mx-auto text-[rgb(var(--fg-rgb)/25%)]" />
          <p className="mt-4 font-bold text-[rgb(var(--fg-rgb)/70%)]">No orders in this view</p>
          <p className="mt-1 text-sm text-[rgb(var(--fg-rgb)/50%)]">Orders that match this filter will appear here.</p>
        </div>
      ) : (
        <ul className="glass-card rounded-3xl p-5 space-y-3">
          {filtered.map((order) => (
            <li
              key={order.id}
              className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/5%)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-bold truncate">{order.title || order.service || "Order"}</p>
                  {order.order_reference && (
                    <p className="font-mono text-xs font-bold tracking-[0.08em] text-[rgb(var(--accent-text))] mt-0.5">
                      {order.order_reference}
                    </p>
                  )}
                  <p className="text-xs text-[rgb(var(--fg-rgb)/50%)] mt-0.5">
                    {formatDate(order.created_at)} · {order.image_count} image{order.image_count === 1 ? "" : "s"}
                    {order.credit_cost > 0 ? ` · ${order.credit_cost} credits` : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}
                >
                  {STATUS_LABELS[order.status] || order.status.replace("_", " ")}
                </span>
              </div>
              {order.description && (
                <p className="mt-2 text-xs text-[rgb(var(--fg-rgb)/60%)]">{order.description}</p>
              )}
              {order.status === "revision_requested" && order.revision_note && (
                <p className="mt-2 text-xs text-violet-500 border-l-2 border-violet-500/40 pl-3">
                  <span className="font-bold">Revision request:</span> {order.revision_note}
                </p>
              )}
              {(order.status === "completed" || order.status === "delivered") && (
                <div className="mt-3 flex justify-end">
                  <RevisionButton orderId={order.id} reference={order.order_reference || order.reference} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}