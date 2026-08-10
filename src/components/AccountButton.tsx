"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { User, Loader2 } from "lucide-react";

export default function AccountButton({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const configured = supabaseConfigured();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) return;
    let mounted = true;
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
        setLoading(false);
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [configured]);

  if (loading) {
    return (
      <Link
        href="/login"
        aria-label="Account"
        className={`rounded-full glass-card inline-flex items-center justify-center gap-2 ${
          compact ? "px-3 py-2 text-xs" : "px-5 py-3 text-sm"
        } text-[rgb(var(--fg-rgb))]`}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
      </Link>
    );
  }

  if (!session) {
    return (
      <Link
        href="/login"
        className={`rounded-full inline-flex items-center justify-center gap-2 font-bold border transition-all ${
          compact ? "px-3.5 py-2 text-xs" : "px-5 py-3 text-sm"
        } glass-card text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/50%)] hover:text-[rgb(var(--accent-text))]`}
      >
        <User className="w-4 h-4" />
        Login
      </Link>
    );
  }

  const isAccountPage = pathname?.startsWith("/account") || pathname?.startsWith("/admin");
  if (isAccountPage) return null;

  const email = session.user.email ?? "";
  const fullName = session.user.user_metadata?.full_name as string | undefined;
  const displayName = (fullName && fullName.trim()) || email.split("@")[0] || "Account";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <Link
      href="/account"
      title={email}
      className={`rounded-full inline-flex items-center justify-center gap-2 font-bold transition-all bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] hover:bg-[rgb(var(--accent-400))] ${
        compact ? "px-3.5 py-2 text-xs" : "px-5 py-3 text-sm"
      }`}
    >
      <span
        className={`rounded-full bg-[rgb(var(--accent-contrast)/15%)] text-[rgb(var(--accent-contrast))] font-black flex items-center justify-center ${
          compact ? "w-5 h-5 text-[9px]" : "w-6 h-6 text-[11px]"
        }`}
      >
        {initials || <User className="w-3 h-3" />}
      </span>
      <span className="max-w-[10rem] truncate">{displayName}</span>
    </Link>
  );
}
