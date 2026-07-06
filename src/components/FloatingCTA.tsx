"use client";
import Link from "next/link";

export default function FloatingCTA() {
  return (
    <Link
      href="/contact"
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold shadow-xl shadow-[rgb(var(--accent-500)/40%)] hover:bg-[rgb(var(--accent-400))] hover:scale-105 transition-all duration-300 text-sm"
    >
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      Free Trial
    </Link>
  );
}