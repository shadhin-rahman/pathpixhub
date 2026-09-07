"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function CinematicShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const paddingX = useTransform(scrollYProgress, [0, 1], [24, 0]);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[var(--bg)]">
      <motion.div style={{ paddingLeft: paddingX, paddingRight: paddingX }}>
        <Link href="/services" className="block relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden group rounded-2xl">
          <Image
            src="/images/covers/photo-retouching-cover.jpg"
            alt="Photo Editing"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute top-8 left-8 z-10">
            <span className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-sm font-bold text-white/70">
              01
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16 z-10">
            <h3 className="text-4xl md:text-5xl lg:text-7xl font-black text-white/90 leading-[0.9] tracking-tight">
              PHOTO<br />EDITING
            </h3>
            <div className="mt-6 flex flex-wrap gap-3">
              {["Masking", "Retouching", "Clipping Path", "Color Match"].map((tag) => (
                <span key={tag} className="text-[10px] font-bold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent-500))]" />
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-white/60 uppercase tracking-wider group-hover:text-[rgb(var(--accent-text))] transition-colors">
              View Capabilities
              <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </div>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
