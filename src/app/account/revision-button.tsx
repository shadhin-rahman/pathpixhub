"use client";

import { useState, useTransition } from "react";
import { X, Plus, XCircle, Link2, MessageSquareWarning, Loader2, CheckCircle2 } from "lucide-react";
import { requestRevision } from "./actions";

export default function RevisionButton({ orderId, reference }: { orderId: string; reference?: string }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [links, setLinks] = useState<string[]>([""]);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const close = () => {
    if (pending) return;
    setOpen(false);
    setNote("");
    setLinks([""]);
    setError(null);
    setSuccess(null);
  };

  const updateLink = (i: number, v: string) =>
    setLinks((prev) => prev.map((l, idx) => (idx === i ? v : l)));
  const addLink = () => setLinks((prev) => [...prev, ""]);
  const removeLink = (i: number) => {
    setLinks((prev) => (prev.length === 1 ? [""] : prev.filter((_, idx) => idx !== i)));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setSuccess(null);
          setOpen(true);
        }}
        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-[rgb(var(--accent-500)/35%)] text-[rgb(var(--accent-text))] hover:bg-[rgb(var(--accent-500)/10%)] transition-all cursor-pointer"
      >
        <MessageSquareWarning className="w-3.5 h-3.5" />
        Request Revision
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} aria-hidden />
          <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border border-[rgb(var(--fg-rgb)/10%)] bg-[var(--bg)] p-6 sm:p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold tracking-tight gradient-text leading-tight">
                  Request a revision
                </h3>
                {reference && (
                  <p className="font-mono text-xs font-bold tracking-[0.08em] text-[rgb(var(--accent-text))] mt-1">
                    {reference}
                  </p>
                )}
                <p className="text-sm text-[rgb(var(--fg-rgb)/55%)] mt-2">
                  Tell our editors in detail what needs to be corrected. Revisions are free.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="shrink-0 w-9 h-9 rounded-full glass-card flex items-center justify-center text-[rgb(var(--fg-rgb)/60%)] hover:text-[rgb(var(--fg-rgb))] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Note */}
            <label className="block text-xs font-bold uppercase tracking-wider text-[rgb(var(--fg-rgb)/45%)] mb-2">
              What correction do you need?
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={7}
              autoFocus
              placeholder="Describe the correction in detail… e.g. the background of image 3 should be pure white instead of off-white, and please remove the shadow under the bottle in image 5."
              className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] outline-none focus:border-[rgb(var(--accent-500)/60%)] transition-colors text-sm resize-y"
            />

            {/* Links */}
            <label className="block text-xs font-bold uppercase tracking-wider text-[rgb(var(--fg-rgb)/45%)] mt-5 mb-2">
              Reference links (optional)
            </label>
            {links.map((link, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <Link2 className="w-4 h-4 text-[rgb(var(--fg-rgb)/35%)] shrink-0" />
                <input
                  value={link}
                  onChange={(e) => updateLink(i, e.target.value)}
                  placeholder="https://… (Google Drive / Dropbox / WeTransfer)"
                  className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] outline-none focus:border-[rgb(var(--accent-500)/60%)] transition-colors text-sm"
                />
                {links.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLink(i)}
                    className="shrink-0 text-[rgb(var(--fg-rgb)/40%)] hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addLink}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[rgb(var(--accent-text))] hover:underline mt-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add another link
            </button>

            {/* Status */}
            {error && (
              <p className="mt-4 text-xs text-red-500 bg-red-500/5 border border-red-500/20 rounded-xl px-3 py-2">
                {error}
              </p>
            )}
            {success && (
              <p className="mt-4 text-xs text-emerald-500 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-3 py-2 inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {success}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={close}
                className="px-5 py-2.5 rounded-full text-sm font-bold border border-[rgb(var(--fg-rgb)/12%)] hover:bg-[rgb(var(--fg-rgb)/5%)] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    setError(null);
                    setSuccess(null);
                    const res = await requestRevision(orderId, note, links);
                    if (res.ok) {
                      setSuccess("Revision request sent — our team will get back to you shortly.");
                      setTimeout(close, 1600);
                    } else {
                      setError(res.error ?? "Could not send the request. Please try again.");
                    }
                  })
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] hover:opacity-90 transition-all disabled:opacity-60 cursor-pointer"
              >
                {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquareWarning className="w-4 h-4" />}
                {pending ? "Sending…" : "Send revision request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}