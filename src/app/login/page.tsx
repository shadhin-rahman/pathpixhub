"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, User as UserIcon } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const configured = supabaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!configured) {
      setError(
        "The account system is not connected yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your env."
      );
      setStatus("error");
      return;
    }

    setStatus("loading");
    const supabase = createClient();

    if (mode === "signin") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        setError(signInError.message);
        setStatus("error");
        return;
      }
      router.push("/account");
      router.refresh();
    } else {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: fullName.trim() } },
      });
      if (signUpError) {
        setError(signUpError.message);
        setStatus("error");
        return;
      }
      if (data.session) {
        router.push("/account");
        router.refresh();
      } else {
        setInfo(
          "Account created! Check your inbox for a confirmation email, then sign in."
        );
        setMode("signin");
        setStatus("idle");
      }
    }
  }

  return (
    <section className="pt-40 pb-28 mesh-gradient min-h-screen flex items-start justify-center">
      <div className="max-w-md mx-auto px-6 w-full">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-sm font-bold mb-6 border border-[rgb(var(--accent-500)/15%)]">
            <UserIcon className="w-4 h-4" />
            Client Account
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-text leading-[1.1]">
            {mode === "signin" ? "Sign in" : "Create your account"}
          </h1>
          <p className="mt-4 text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
            {mode === "signin"
              ? "Enter your email and password to access your dashboard."
              : "Set up an account to track orders, credits and delivery."}
          </p>
        </div>

        {!configured && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-5 py-4 text-sm text-amber-500">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>
              The account system is not connected yet. Add{" "}
              <code className="px-1.5 py-0.5 rounded bg-amber-500/10">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="px-1.5 py-0.5 rounded bg-amber-500/10">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your env to enable login.
            </p>
          </div>
        )}

        <div className="glass-card rounded-3xl p-8">
          {/* Mode toggle */}
          <div className="grid grid-cols-2 gap-1 rounded-full bg-[var(--bg-subtle)] p-1 mb-7">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(""); setInfo(""); }}
                className={`py-2.5 rounded-full text-sm font-bold transition-all ${
                  mode === m
                    ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]"
                    : "text-[rgb(var(--fg-rgb)/50%)] hover:text-[rgb(var(--fg-rgb))]"
                }`}
              >
                {m === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          {info && (
            <div className="mb-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-4 text-sm text-emerald-500">
              {info}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div>
                <label htmlFor="full_name" className="block text-sm font-semibold mb-2 text-[rgb(var(--fg-rgb)/80%)]">
                  Full name
                </label>
                <input
                  id="full_name"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] placeholder:text-[rgb(var(--fg-rgb)/35%)] outline-none focus:border-[rgb(var(--accent-500)/60%)] transition-colors"
                />
              </div>
            )}

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

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2 text-[rgb(var(--fg-rgb)/80%)]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--fg-rgb)/35%)]" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-5 py-4 rounded-2xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] placeholder:text-[rgb(var(--fg-rgb)/35%)] outline-none focus:border-[rgb(var(--accent-500)/60%)] transition-colors"
                />
              </div>
              {mode === "signup" && (
                <p className="mt-1.5 text-xs text-[rgb(var(--fg-rgb)/45%)]">At least 6 characters.</p>
              )}
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
                  Please wait...
                </>
              ) : (
                <>
                  {mode === "signin" ? "Sign in" : "Create account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-[rgb(var(--fg-rgb)/50%)]">
          Need help?{" "}
          <Link href="/contact" className="text-[rgb(var(--accent-text))] hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </section>
  );
}
