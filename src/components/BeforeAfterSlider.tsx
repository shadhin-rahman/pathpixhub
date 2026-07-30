"use client";

import { useRef, useState, useCallback } from "react";
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

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) updatePosition(e.clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl select-none cursor-ew-resize ${className}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
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
          />
        </div>

        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-10"
          style={{ left: `${sliderPos}%` }}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700">
              <path d="M8 18L2 12L8 6M16 6L22 12L16 18" />
            </svg>
          </div>
        </div>

        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
          Before
        </div>
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[rgb(var(--accent-500))]/80 text-white text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
          After
        </div>
      </div>
    </div>
  );
}
