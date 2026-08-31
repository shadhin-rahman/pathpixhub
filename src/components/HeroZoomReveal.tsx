"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroZoomReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Image scales up continuously across the whole scroll range
  const scale = useTransform(scrollYProgress, [0, 1], [1, 2.3]);

  // Caption fades out as the user scrolls into the zoom
  const labelOpacity = useTransform(scrollYProgress, [0, 0.15, 0.35], [1, 1, 0]);

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <motion.div style={{ scale }} className="absolute inset-0">
          <Image
            src="/images/hero-zoom/ring-after.jpg"
            alt="Professionally edited product photo"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </motion.div>

        {/* Dark gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Caption */}
        <motion.div
          style={{ opacity: labelOpacity }}
          className="absolute bottom-12 left-0 right-0 text-center pointer-events-none"
        >
          <span className="text-xs uppercase font-mono tracking-[0.4em] text-white/50 font-bold">Edited by PathPixHub</span>
          <p className="mt-3 text-2xl md:text-4xl font-bold text-white tracking-tight">Precision, at every pixel</p>
        </motion.div>

        {/* Scroll hint at top */}
        <motion.div
          style={{ opacity: labelOpacity }}
          className="absolute top-10 left-0 right-0 text-center pointer-events-none"
        >
          <span className="text-[10px] uppercase font-mono tracking-[0.4em] text-white/40">Scroll to see the edit</span>
        </motion.div>
      </div>
    </section>
  );
}
