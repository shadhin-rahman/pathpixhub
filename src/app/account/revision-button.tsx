"use client";

import { useState } from "react";
import { MessageSquareWarning } from "lucide-react";
import { requestRevision } from "./actions";

export default function RevisionButton({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-[rgb(var(--accent-500)/35%)] text-[rgb(var(--accent-text))] hover:bg-[rgb(var(--accent-500)/10%)] transition-all cursor-pointer"
      >
        <MessageSquareWarning className="w-3.5 h-3.5" />
        Request Revision
      </button>
    );
  }

  return (
    <form action={requestRevision} className="flex flex-col items-end gap-2 border-t border-[rgb(var(--fg-rgb)/8%)] pt-3 mt-3">
      <input type="hidden" name="order_id" value={orderId} />
      <textarea
        name="note"
        rows={2}
        placeholder="What correction or revision do you need? (optional)"
        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] outline-none focus:border-[rgb(var(--accent-500)/60%)] transition-colors text-xs resize-none"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 rounded-full text-xs font-bold border border-[rgb(var(--fg-rgb)/12%)] hover:bg-[rgb(var(--fg-rgb)/5%)] transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-full text-xs font-bold bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] hover:opacity-90 transition-all cursor-pointer"
        >
          Send for revision
        </button>
      </div>
    </form>
  );
}