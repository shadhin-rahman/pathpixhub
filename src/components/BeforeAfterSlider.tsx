"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";

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
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handleStart = useCallback((clientX: number) => {
    setIsDragging(true);
    updatePosition(clientX);
  }, [updatePosition]);

  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const handleTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
    };
    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleMove);
      window.addEventListener("touchend", handleEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, updatePosition]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl select-none cursor-ew-resize group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsDragging(false); }}
    >
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={afterSrc}
          alt={afterAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100vw" }}
          />
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 z-20"
          style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
        >
          <div className={`w-px bg-white transition-all duration-200 ${isDragging ? "opacity-100" : "opacity-60"}`} style={{ height: "100%" }} />

          {/* Handle */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
              isDragging ? "scale-110" : isHovered ? "scale-105" : "scale-100"
            }`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="relative">
              <div className={`w-12 h-12 rounded-full bg-white/95 backdrop-blur-md shadow-2xl flex items-center justify-center border border-white/50 transition-all ${isDragging ? "shadow-[0_0_20px_rgba(255,255,255,0.3)]" : ""}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gray-700">
                  <path d="M8 18L2 12L8 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 6L22 12L16 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {/* Pulse ring */}
              {!isDragging && !isHovered && (
                <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping" style={{ animationDuration: "2s" }} />
              )}
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 text-white text-[10px] font-bold tracking-[0.15em] uppercase backdrop-blur-md transition-all duration-300 ${isHovered || sliderPos > 20 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
          Before
        </div>
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[rgb(var(--accent-500))]/80 text-white text-[10px] font-bold tracking-[0.15em] uppercase backdrop-blur-md transition-all duration-300 ${isHovered || sliderPos < 80 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
          After
        </div>

        {/* Bottom instruction */}
        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/40 text-white/80 text-[10px] font-medium backdrop-blur-md transition-all duration-300 ${!isDragging && isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          Drag to compare
        </div>
      </div>
    </div>
  );
}
