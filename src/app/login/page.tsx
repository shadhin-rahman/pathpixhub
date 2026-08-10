"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { Mail, ArrowRight, Loader2 } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const configured = supabaseConfigured();
  const next = searchParams.get("next") || "/account";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) return;
    setStatus("loading");
    setError("");

    const supabase = createClient();
    const origin = window.location.origin;
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-sm font-bold mb-6 border border-[rgb(var(--accent-500)/15%)]">
          <Mail className="w-4 h-4" />
          Client Account
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-text leading-[1.1]">
          Sign in to your account
        </h1>
        <p className="mt-4 text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
          No password needed — we&apos;ll email you a secure sign-in link.
        </p>
      </div>

      {!configured ? (
        <div className="glass-card rounded-3xl p-8 text-center">
          <p className="text-sm text-[rgb(var(--fg-rgb)/70%)]">
            The account system is not connected yet.
            <br />
            <span className="text-[rgb(var(--fg-rgb)/50%)]">
              Add <code className="px-1.5 py-0.5 rounded bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))]">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="px-1.5 py-0.5 rounded bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your env.
            </span>
          </p>
        </div>
      ) : status === "sent" ? (
        <div className="glass-card rounded-3xl p-8 text-center">
          <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-[rgb(var(--accent-500)/15%)] flex items-center justify-center">
            <Mail className="w-7 h-7 text-[rgb(var(--accent-text))]" />
          </div>
          <h2 className="text-xl font-bold">Check your inbox</h2>
          <p className="mt-3 text-sm text-[rgb(var(--fg-rgb)/60%)]">
            We sent a sign-in link to <span className="text-[rgb(var(--fg-rgb))] font-semibold">{email}</span>.
            Open it to continue to your dashboard.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-6 text-sm text-[rgb(var(--accent-text))] hover:underline"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2 text-[rgb(var(--fg-rgb)/80%)]">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] placeholder:text-[rgb(var(--fg-rgb)/35%)] outline-none focus:border-[rgb(var(--accent-500)/60%)] transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm disabled:opacity-60"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending link...
              </>
            ) : (
              <>
                Email me a sign-in link
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-xs text-center text-[rgb(var(--fg-rgb)/45%)]">
            New here? Requesting a link creates your client account automatically.
          </p>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-[rgb(var(--fg-rgb)/50%)]">
        Need help?{" "}
        <Link href="/contact" className="text-[rgb(var(--accent-text))] hover:underline">
          Contact us
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <section className="pt-40 pb-28 mesh-gradient min-h-screen flex items-start justify-center">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </section>
  );
}
