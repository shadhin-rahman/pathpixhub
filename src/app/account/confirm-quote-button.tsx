"use client";

import { useState, useTransition } from "react";
import { BadgeCheck, Loader2 } from "lucide-react";
import { confirmQuote } from "./actions";

export default function ConfirmQuoteButton({ orderId }: { orderId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-2">
      {error && (
        <p className="text-xs text-red-500 bg-red-500/5 border border-red-500/20 rounded-xl px-3 py-2">
          {error}
        </p>
      )}
      {success && (
        <p className="text-xs text-emerald-500 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-3 py-2">
          Confirmed! {success}
        </p>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const res = await confirmQuote(orderId);
            if (res.ok) setSuccess(`Order ${res.orderRef ?? ""} confirmed.`);
            else setError(res.error ?? "Could not confirm the order.");
          })
        }
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] hover:opacity-90 transition-all disabled:opacity-60 cursor-pointer"
      >
        {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BadgeCheck className="w-3.5 h-3.5" />}
        {pending ? "Confirming…" : "Confirm order"}
      </button>
    </div>
  );
}