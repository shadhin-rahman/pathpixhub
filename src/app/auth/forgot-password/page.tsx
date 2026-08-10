"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle2, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("loading");

    const origin = window.location.origin;
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${origin}/auth/callback?next=/auth/reset-password` }
    );

    setStatus("idle");
    if (resetError) {
      setError(resetError.message);
      setStatus("error");
      return;
    }
    setSent(true);
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
            <KeyRound className="w-4 h-4" />
            Reset password
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-text leading-[1.1]">
            Forgot your password?
          </h1>
          <p className="mt-4 text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
            Enter your account email and we&apos;ll send you a secure link to set a new password.
          </p>
        </div>

        {sent ? (
          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-start gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-4 text-sm text-emerald-500">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span>
                If an account exists for <strong>{email}</strong>, a password reset link has been sent. Check your inbox (and spam folder).
              </span>
            </div>
            <p className="mt-6 text-sm text-[rgb(var(--fg-rgb)/50%)]">
              <Link href="/login" className="text-[rgb(var(--accent-text))] hover:underline">
                Back to sign in
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2 text-[rgb(var(--fg-rgb)/80%)]">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--fg-rgb)/35%)]" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
                  Sending...
                </>
              ) : (
                <>
                  Send reset link
                  <KeyRound className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
