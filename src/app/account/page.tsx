import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Profile, Order } from "@/lib/types";
import { Coins, ImageIcon, Package, Clock3, Plus, ArrowRight, Inbox } from "lucide-react";
import { STATUS_STYLES, STATUS_LABELS, formatDate } from "@/lib/order-status";
import RevisionButton from "./revision-button";

export default async function AccountPage() {
  if (!supabaseConfigured()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  try {
    await supabase.rpc("promote_founder");
  } catch { /* founder already promoted or not founder */ }

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
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const p = profile as Profile | null;
  const list = (orders ?? []) as Order[];
  const imagesEdited = list.reduce((s, o) => s + (o.image_count || 0), 0);
  const inProgress = list.filter((o) =>
    ["pending", "in_progress", "revision_requested"].includes(o.status),
  ).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text leading-[1.15]">
          Hi, {p?.full_name || user.email?.split("@")[0] || "there"}
        </h1>
        <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/55%)]">
          Here&apos;s what&apos;s happening with your edits.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <Coins className="w-5 h-5 text-[rgb(var(--accent-text))]" />
            <Link href="/credits" className="text-[11px] font-bold text-[rgb(var(--accent-text))] hover:underline">
              Top up
            </Link>
          </div>
          <p className="mt-4 text-3xl font-black text-[rgb(var(--accent-text))]">
            {(p?.credits_balance ?? 0).toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-[rgb(var(--fg-rgb)/50%)]">credit balance</p>
        </div>
        <div className="glass-card rounded-3xl p-6">
          <ImageIcon className="w-5 h-5 text-[rgb(var(--accent-text))]" />
          <p className="mt-4 text-3xl font-black">{imagesEdited.toLocaleString()}</p>
          <p className="mt-1 text-xs text-[rgb(var(--fg-rgb)/50%)]">images edited</p>
        </div>
        <div className="glass-card rounded-3xl p-6">
          <Package className="w-5 h-5 text-[rgb(var(--accent-text))]" />
          <p className="mt-4 text-3xl font-black">{list.length}</p>
          <p className="mt-1 text-xs text-[rgb(var(--fg-rgb)/50%)]">total orders</p>
        </div>
        <div className="glass-card rounded-3xl p-6">
          <Clock3 className="w-5 h-5 text-[rgb(var(--accent-text))]" />
          <p className="mt-4 text-3xl font-black">{inProgress}</p>
          <p className="mt-1 text-xs text-[rgb(var(--fg-rgb)/50%)]">in progress</p>
        </div>
      </div>

      {/* Recent orders */}
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[rgb(var(--accent-text))]" />
            <h2 className="text-xl font-bold">Recent orders</h2>
          </div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[rgb(var(--accent-text))] hover:underline"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {list.length === 0 ? (
          <div className="text-center py-12">
            <Inbox className="w-12 h-12 mx-auto text-[rgb(var(--fg-rgb)/25%)]" />
            <p className="mt-4 font-bold text-[rgb(var(--fg-rgb)/70%)]">No orders yet</p>
            <p className="mt-1 text-sm text-[rgb(var(--fg-rgb)/50%)]">
              Ready to start? Send us your first batch of images.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm"
            >
              <Plus className="w-4 h-4" />
              New order
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {list.map((order) => (
              <li
                key={order.id}
                className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/5%)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-bold truncate">{order.title || order.service || "Order"}</p>
                    {order.reference && (
                      <p className="font-mono text-xs font-bold tracking-[0.08em] text-[rgb(var(--accent-text))] mt-0.5">
                        {order.reference}
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
                {order.status === "revision_requested" && order.revision_note && (
                  <p className="mt-2.5 text-xs text-violet-500 border-l-2 border-violet-500/40 pl-3">
                    <span className="font-bold">Revision request:</span> {order.revision_note}
                  </p>
                )}
                {(order.status === "completed" || order.status === "delivered") && (
                  <div className="mt-3 flex justify-end">
                    <RevisionButton orderId={order.id} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}