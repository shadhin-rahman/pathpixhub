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

  // "Before" image fades out in the middle of the scroll
  const beforeOpacity = useTransform(scrollYProgress, [0.35, 0.55], [1, 0]);
  // "After" image fades in right after
  const afterOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);

  // Caption labels
  const beforeLabelOpacity = useTransform(scrollYProgress, [0, 0.15, 0.35], [1, 1, 0]);
  const afterLabelOpacity = useTransform(scrollYProgress, [0.65, 0.8, 1], [0, 1, 1]);

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <motion.div style={{ scale }} className="absolute inset-0">
          <motion.div style={{ opacity: beforeOpacity }} className="absolute inset-0">
            <Image
              src="/images/hero-zoom/ring-before.jpg"
              alt="Unedited product photo"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </motion.div>
          <motion.div style={{ opacity: afterOpacity }} className="absolute inset-0">
            <Image
              src="/images/hero-zoom/ring-after.jpg"
              alt="Professionally edited product photo"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </motion.div>

        {/* Dark gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Labels */}
        <motion.div
          style={{ opacity: beforeLabelOpacity }}
          className="absolute bottom-12 left-0 right-0 text-center pointer-events-none"
        >
          <span className="text-xs uppercase font-mono tracking-[0.4em] text-white/50 font-bold">Before</span>
          <p className="mt-3 text-2xl md:text-4xl font-bold text-white tracking-tight">Straight off the camera</p>
        </motion.div>
        <motion.div
          style={{ opacity: afterLabelOpacity }}
          className="absolute bottom-12 left-0 right-0 text-center pointer-events-none"
        >
          <span className="text-xs uppercase font-mono tracking-[0.4em] text-white/50 font-bold">After</span>
          <p className="mt-3 text-2xl md:text-4xl font-bold text-white tracking-tight">Edited by PathPixHub</p>
        </motion.div>

        {/* Scroll hint at top */}
        <motion.div
          style={{ opacity: beforeLabelOpacity }}
          className="absolute top-10 left-0 right-0 text-center pointer-events-none"
        >
          <span className="text-[10px] uppercase font-mono tracking-[0.4em] text-white/40">Scroll to see the edit</span>
        </motion.div>
      </div>
    </section>
  );
}
