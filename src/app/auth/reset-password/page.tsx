"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Lock, ArrowLeft, Loader2, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setStatus("loading");
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setStatus("idle");

    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
  }

  return (
    <section className="pt-40 pb-28 mesh-gradient min-h-screen flex items-start justify-center">
      <div className="max-w-md mx-auto px-6 w-full">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-bold text-[rgb(var(--accent-text))] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>

        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-sm font-bold mb-6 border border-[rgb(var(--accent-500)/15%)]">
            <ShieldCheck className="w-4 h-4" />
            Choose a new password
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-text leading-[1.1]">
            Set your new password
          </h1>
          <p className="mt-4 text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
            Your reset link is valid. Pick a strong password to continue.
          </p>
        </div>

        {done ? (
          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-start gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-4 text-sm text-emerald-500">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span>Your password has been updated. You can now sign in with your new password.</span>
            </div>
            <Link
              href="/login"
              className="mt-6 inline-flex w-full items-center justify-center px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm"
            >
              Sign in now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2 text-[rgb(var(--fg-rgb)/80%)]">
                New password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--fg-rgb)/35%)]" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-11 pr-5 py-4 rounded-2xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] placeholder:text-[rgb(var(--fg-rgb)/35%)] outline-none focus:border-[rgb(var(--accent-500)/60%)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-semibold mb-2 text-[rgb(var(--fg-rgb)/80%)]">
                Confirm new password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--fg-rgb)/35%)]" />
                <input
                  id="confirm"
                  type="password"
                  required
                  autoComplete="new-password"
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full pl-11 pr-5 py-4 rounded-2xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] placeholder:text-[rgb(var(--fg-rgb)/35%)] outline-none focus:border-[rgb(var(--accent-500)/60%)] transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 px-5 py-4 text-sm text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm disabled:opacity-60"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  Update password
                  <Lock className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
