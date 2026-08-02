"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from "framer-motion";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before editing",
  afterAlt = "After editing",
  className = "",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const autoplayRef = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);

  const sweep = useMotionValue(0);
  const sweepPercent = useTransform(sweep, (v) => `${v}%`);
  const clipPath = useTransform(sweep, (v) => `inset(0 ${100 - v}% 0 0 round 0 14px 14px 0)`);

  const stopAll = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    controlsRef.current?.stop();
  }, []);

  const sweepForward = useCallback(() => {
    controlsRef.current = animate(sweep, 85, {
      duration: 1.8,
      ease: "easeInOut",
      onComplete: () => {
        controlsRef.current = animate(sweep, 0, {
          duration: 1.6,
          ease: "easeInOut",
          delay: 0.6,
          onComplete: () => {
            timeoutRef.current = setTimeout(sweepForward, 1600);
          },
        });
      },
    });
  }, [sweep]);

  const startAutoplay = useCallback(() => {
    if (!autoplayRef.current) return;
    stopAll();
    sweep.set(0);
    sweepForward();
  }, [stopAll, sweep, sweepForward]);

  useEffect(() => {
    startAutoplay();
    return () => stopAll();
  }, [startAutoplay, stopAll]);

  const updatePosition = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percent = Math.max(2, Math.min(98, (x / rect.width) * 100));
      sweep.set(percent);
    },
    [sweep]
  );

  const handleStart = useCallback(
    (clientX: number) => {
      autoplayRef.current = false;
      stopAll();
      setIsDragging(true);
      setHasInteracted(true);
      updatePosition(clientX);
    },
    [stopAll, updatePosition]
  );

  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const handleTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
    };
    const handleEnd = () => {
      setIsDragging(false);
      timeoutRef.current = setTimeout(() => {
        autoplayRef.current = true;
        startAutoplay();
      }, 5000);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleMove);
      window.addEventListener("touchend", handleEnd);
      window.addEventListener("touchcancel", handleEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("touchcancel", handleEnd);
    };
  }, [isDragging, updatePosition, startAutoplay]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl select-none cursor-ew-resize group ${className}`}
    >
      <div className="relative w-full aspect-[4/3] bg-[var(--bg-subtle)] overflow-hidden">
        {/* After image (base layer) - shown by default */}
        <Image
          src={afterSrc}
          alt={afterAlt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Before image - revealed on the left by sweep or drag */}
        <motion.div className="absolute inset-0" style={{ clipPath }}>
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>

        {/* Modern handle */}
        <motion.div
          className="absolute z-30 top-1/2 cursor-grab active:cursor-grabbing"
          style={{ left: sweepPercent, x: "-50%", y: "-50%" }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <motion.div
            animate={isDragging ? { scale: 1.15 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-shadow duration-300 ${
              isDragging
                ? "bg-white shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
                : "bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.25)] group-hover:shadow-[0_4px_28px_rgba(0,0,0,0.35)]"
            }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-800">
              <path d="M8.5 7L4 11.5L8.5 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.5 16L20 11.5L15.5 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.4"/>
            </svg>
          </motion.div>
        </motion.div>

        {/* First-time hint */}
        <AnimatePresence>
          {!hasInteracted && !isDragging && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
            >
              <div className="px-4 py-2 rounded-full bg-black/45 backdrop-blur-md text-white/90 text-[11px] font-medium flex items-center gap-2 border border-white/10">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
                Drag to reveal Before
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
