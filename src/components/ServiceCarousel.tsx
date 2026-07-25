"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/data/services";

const SOFT_COLORS = ["#fca5a5", "#d8b4fe", "#f9a8d4", "#fde68a", "#93c5fd", "#86efac", "#fdba74", "#5eead4", "#a5b4fc", "#fda4af"];

export default function ServiceCarousel({ services }: { services: Service[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 8);
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);

    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 20 : 1;
    setActiveIndex(Math.round(el.scrollLeft / cardWidth));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByCards = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 20 : 300;
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  };

  const scrollToIndex = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 20 : 300;
    el.scrollTo({ left: index * cardWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 px-6 no-scrollbar"
      >
        {services.map((s, i) => {
          const ci = i % SOFT_COLORS.length;
          return (
            <div key={s.id} className="flex-shrink-0 w-64 md:w-80 snap-start group">
              <div
                className="rounded-2xl p-4 pb-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ backgroundColor: SOFT_COLORS[ci] }}
              >
                <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden bg-white/30">
                  <Image
                    src={`/images/service-showcase/${s.id}.png`}
                    alt={s.title}
                    fill
                    className="object-contain p-3 group-hover:opacity-0 group-hover:scale-110 transition-all duration-700"
                    sizes="(max-width: 768px) 256px, 320px"
                  />
                  <Image
                    src={`/images/service-showcase/${s.id}-before.png`}
                    alt={`${s.title} before`}
                    fill
                    className="object-contain p-3 absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    sizes="(max-width: 768px) 256px, 320px"
                  />
                </div>
                <Link
                  href={`/services/${s.id}`}
                  className="block mt-3 text-[rgb(var(--fg-rgb)/80%)] font-bold text-sm text-center leading-tight hover:text-[rgb(var(--accent-500))] transition-colors"
                >
                  {s.title}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev / Next arrows */}
      <button
        aria-label="Previous"
        onClick={() => scrollByCards(-1)}
        disabled={!canScrollPrev}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full glass-card text-[rgb(var(--fg-rgb))] disabled:opacity-0 transition-opacity"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        aria-label="Next"
        onClick={() => scrollByCards(1)}
        disabled={!canScrollNext}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full glass-card text-[rgb(var(--fg-rgb))] disabled:opacity-0 transition-opacity"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {services.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Go to ${s.title}`}
            onClick={() => scrollToIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? "w-6 bg-[rgb(var(--accent-500))]" : "w-1.5 bg-[rgb(var(--fg-rgb)/20%)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
