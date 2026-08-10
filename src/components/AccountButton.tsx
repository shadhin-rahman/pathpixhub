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
        className={`rounded-full glass-card inline-flex items-center justify-center ${
          compact ? "w-9 h-9" : "w-11 h-11"
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
        aria-label="Sign in"
        className={`rounded-full glass-card inline-flex items-center justify-center ${
          compact ? "w-9 h-9" : "w-11 h-11"
        } text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/50%)] hover:text-[rgb(var(--accent-text))] transition-all`}
      >
        <User className="w-4 h-4" />
      </Link>
    );
  }

  const isAccountPage = pathname?.startsWith("/account") || pathname?.startsWith("/admin");
  if (isAccountPage) return null;

  return (
    <Link
      href="/account"
      aria-label="My account"
      className={`rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] inline-flex items-center justify-center hover:bg-[rgb(var(--accent-400))] transition-all ${
        compact ? "w-9 h-9" : "w-11 h-11"
      }`}
    >
      <User className="w-4 h-4" />
    </Link>
  );
}
