import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Profile, Order } from "@/lib/types";
import PrintButton from "./print-button";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function InvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ user_id?: string; from?: string; to?: string }>;
}) {
  if (!supabaseConfigured()) redirect("/account");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single<{ role: string }>();

  if (!myProfile || myProfile.role !== "admin") redirect("/account");

  const params = await searchParams;
  const userId = params.user_id;
  if (!userId) redirect("/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single<Profile>();
  if (!profile) redirect("/admin");

  const from = params.from ? new Date(params.from) : new Date(0);
  const to = params.to ? new Date(params.to) : new Date(Date.now() + 86400000);

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", from.toISOString())
    .lt("created_at", to.toISOString())
    .order("created_at", { ascending: true });

  const allOrders = (orders ?? []) as Order[];
  const billable = allOrders.filter((o) => o.status !== "cancelled");
  const total = billable.reduce((s, o) => s + (o.credit_cost || 0), 0);

  const invoiceNo = `INV-${(profile.full_name || profile.email)
    .trim()
    .slice(0, 4)
    .toUpperCase()}${formatDate(from.toISOString()).replace(/ /g, "").slice(0, 2)}`;
  const periodLabel =
    from.getTime() === new Date(0).getTime()
      ? "All time"
      : `${formatDate(from.toISOString())} – ${formatDate(new Date(to.getTime() - 86400000).toISOString())}`;

  return (
    <main className="min-h-screen">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #invoice-print, #invoice-print * { visibility: visible !important; }
          #invoice-print {
            position: absolute !important;
            left: 0; top: 0; width: 100%;
          }
          .no-print { display: none !important; }
        }
        @page { margin: 1.5cm; }
      `}</style>

      <div className="no-print fixed top-6 right-6 z-50 flex items-center gap-2">
        <a
          href="/admin"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full glass-card border border-[rgb(var(--fg-rgb)/10%)] text-sm font-bold hover:border-[rgb(var(--accent-500)/60%)] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to admin
        </a>
        <PrintButton />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16" id="invoice-print">
        <div className="glass-card rounded-3xl p-8 sm:p-12">
          {/* Header */}
          <div className="flex items-start justify-between gap-6 mb-10">
            <div>
              <p className="text-2xl font-black gradient-text tracking-tight">PathPixHub</p>
              <p className="text-sm text-[rgb(var(--fg-rgb)/55%)] mt-1">
                Professional Photo Editing &amp; Clipping Path Services
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl">{invoiceNo}</p>
              <p className="text-sm text-[rgb(var(--fg-rgb)/55%)] mt-1">Invoice</p>
            </div>
          </div>

          {/* Billed customer */}
          <div className="bg-[rgb(var(--accent-500)/4%)] border border-[rgb(var(--accent-500)/15%)] rounded-2xl p-5 mb-8">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[rgb(var(--fg-rgb)/45%)] mb-2">
              Billed to
            </p>
            <p className="font-bold text-lg leading-snug">{profile.full_name || "—"}</p>
            <p className="text-sm text-[rgb(var(--fg-rgb)/60%)]">{profile.email}</p>
            <p className="text-sm text-[rgb(var(--fg-rgb)/60%)] mt-1">
              Period: <span className="font-bold">{periodLabel}</span>
            </p>
          </div>

          {/* Items */}
          {billable.length > 0 ? (
            <table className="w-full text-sm mb-6">
              <thead>
                <tr className="border-b border-[rgb(var(--fg-rgb)/15%)] text-left">
                  <th className="py-2 pr-3 font-bold text-[rgb(var(--fg-rgb)/55%)]">Date</th>
                  <th className="py-2 pr-3 font-bold text-[rgb(var(--fg-rgb)/55%)]">Reference / Service</th>
                  <th className="py-2 pr-3 font-bold text-[rgb(var(--fg-rgb)/55%)]">Images</th>
                  <th className="py-2 text-right font-bold text-[rgb(var(--fg-rgb)/55%)]">Credits</th>
                </tr>
              </thead>
              <tbody>
                {billable.map((o) => (
                  <tr key={o.id} className="border-b border-[rgb(var(--fg-rgb)/6%)]">
                    <td className="py-2.5 pr-3 whitespace-nowrap">{formatDate(o.created_at)}</td>
                    <td className="py-2.5 pr-3">
                      <p className="font-bold">{o.title || o.service || "Order"}</p>
                      {(o.order_reference || o.reference) && (
                        <p className="font-mono text-[10px] tracking-[0.08em] text-[rgb(var(--fg-rgb)/45%)]">
                          {o.order_reference || o.reference}
                        </p>
                      )}
                    </td>
                    <td className="py-2.5 pr-3">{o.image_count}</td>
                    <td className="py-2.5 text-right font-bold">{o.credit_cost || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-[rgb(var(--fg-rgb)/50%)] mb-6">No billable orders in this period.</p>
          )}

          {allOrders.some((o) => o.status === "cancelled") && (
            <p className="text-xs text-[rgb(var(--fg-rgb)/40%)] mb-4">
              {allOrders.filter((o) => o.status === "cancelled").length} cancelled order(s) excluded from billing.
            </p>
          )}

          {/* Total */}
          <div className="flex items-center justify-between border-t border-[rgb(var(--fg-rgb)/15%)] pt-5">
            <p className="font-bold text-lg">Total</p>
            <p className="font-black text-2xl text-[rgb(var(--accent-text))]">{total.toLocaleString()} credits</p>
          </div>

          <p className="text-xs text-[rgb(var(--fg-rgb)/40%)] mt-8 leading-relaxed">
            Thank you for your business. Please make payment within the agreed terms. For any questions about this
            invoice, contact us at pathpixhub@gmail.com.
          </p>
        </div>
      </div>
    </main>
  );
}