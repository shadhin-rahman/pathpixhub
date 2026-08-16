"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Coins, Sparkles, Users } from "lucide-react";

type PromoSlide = {
  icon: typeof Coins;
  tag: string;
  title: string;
  description: string;
  href: string;
  cta: string;
};

// Add, remove, or edit slides here — the carousel adapts automatically.
const PROMO_SLIDES: PromoSlide[] = [
  {
    icon: Coins,
    tag: "SAVE MORE",
    title: "Path credits",
    description: "Top up credits in bulk and pay less per image on every order.",
    href: "/credits",
    cta: "Buy credits",
  },
  {
    icon: Users,
    tag: "EARN FREE MONTHS",
    title: "Referral program",
    description: "Refer a friend — you both get a free month. No limit on referrals.",
    href: "/subscription",
    cta: "Learn more",
  },
  {
    icon: Sparkles,
    tag: "EXPLORE",
    title: "More services",
    description: "Ghost mannequin, color change, retouching, and more — all in one place.",
    href: "/services",
    cta: "See services",
  },
];

const AUTO_ADVANCE_MS = 5000;

export default function SidebarPromoCarousel() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (PROMO_SLIDES.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % PROMO_SLIDES.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goTo = (i: number) => {
    setIndex(i);
    // Restart the auto-advance timer so a manual click doesn't get
    // immediately overridden by the next scheduled tick.
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((cur) => (cur + 1) % PROMO_SLIDES.length);
    }, AUTO_ADVANCE_MS);
  };

  const slide = PROMO_SLIDES[index];
  const Icon = slide.icon;

  return (
    <div className="glass-card rounded-3xl p-4 overflow-hidden">
      <Link href={slide.href} className="block group">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[rgb(var(--accent-500)/12%)] flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-[rgb(var(--accent-text))]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-[rgb(var(--fg-rgb))] truncate">{slide.title}</p>
              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[rgb(var(--accent-500)/15%)] text-[rgb(var(--accent-text))] whitespace-nowrap">
                {slide.tag}
              </span>
            </div>
            <p className="mt-1 text-xs text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">{slide.description}</p>
            <span className="mt-2 inline-block text-xs font-bold text-[rgb(var(--accent-text))] group-hover:underline">
              {slide.cta} →
            </span>
          </div>
        </div>
      </Link>

      {PROMO_SLIDES.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {PROMO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show promo ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === index ? "w-5 bg-[rgb(var(--accent-500))]" : "w-1.5 bg-[rgb(var(--fg-rgb)/15%)] hover:bg-[rgb(var(--fg-rgb)/30%)]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
