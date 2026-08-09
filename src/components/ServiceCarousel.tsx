"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/data/services";
import { serviceImagePath } from "@/data/services";

const SOFT_COLORS = ["#fca5a5", "#d8b4fe", "#f9a8d4", "#fde68a", "#93c5fd", "#86efac", "#fdba74", "#5eead4", "#a5b4fc", "#fda4af"];

// Auto-scroll speed in pixels per animation frame (~60fps)
const AUTO_SCROLL_SPEED = 0.6;
// How long to stay paused after the user lets go, before auto-scroll resumes
const RESUME_DELAY_MS = 1800;

export default function ServiceCarousel({ services }: { services: Service[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);

  // Duplicate the list so the loop feels seamless
  const loopItems = [...services, ...services];

  const pause = useCallback(() => {
    pausedRef.current = true;
    clearTimeout(resumeTimerRef.current);
  }, []);

  const scheduleResume = useCallback(() => {
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_DELAY_MS);
  }, []);

  // Auto-scroll loop
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const tick = () => {
      if (!pausedRef.current && !draggingRef.current && el.scrollWidth > 0) {
        el.scrollLeft += AUTO_SCROLL_SPEED;
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) {
          el.scrollLeft -= half;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // Mouse drag-to-scroll (touch already gets free native swipe scrolling)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = trackRef.current;
    if (!el) return;
    draggingRef.current = true;
    pause();
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
    el.classList.add("cursor-grabbing");
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const el = trackRef.current;
    if (!el) return;
    const delta = e.clientX - dragStartXRef.current;
    el.scrollLeft = dragStartScrollRef.current - delta;
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    trackRef.current?.classList.remove("cursor-grabbing");
    scheduleResume();
  };

  return (
    <div
      ref={trackRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onTouchStart={pause}
      onTouchEnd={scheduleResume}
      className="flex gap-5 overflow-x-auto px-6 no-scrollbar cursor-grab select-none"
    >
      {loopItems.map((s, i) => {
        const ci = i % SOFT_COLORS.length;
        return (
          <div key={`${s.id}-${i}`} className="flex-shrink-0 w-64 md:w-80 group">
            <div
              className="rounded-2xl p-4 pb-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ backgroundColor: SOFT_COLORS[ci] }}
            >
              <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden bg-white/30">
                <Image
                  src={serviceImagePath(s.id, "before-after", "after")}
                  alt={s.title}
                  fill
                  draggable={false}
                  className="object-contain p-3 pointer-events-none group-hover:opacity-0 group-hover:scale-110 transition-all duration-700"
                  sizes="(max-width: 768px) 256px, 320px"
                />
                <Image
                  src={serviceImagePath(s.id, "before-after", "before")}
                  alt={`${s.title} before`}
                  fill
                  draggable={false}
                  className="object-contain p-3 absolute inset-0 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  sizes="(max-width: 768px) 256px, 320px"
                />
              </div>
              <Link
                href={`/services/${s.id}`}
                draggable={false}
                className="block mt-3 text-[rgb(var(--fg-rgb)/80%)] font-bold text-sm text-center leading-tight hover:text-[rgb(var(--accent-text))] transition-colors"
              >
                {s.title}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
