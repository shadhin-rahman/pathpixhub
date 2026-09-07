"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { services } from "@/data/services";

const serviceTags: Record<string, string[]> = {
  "clipping-path": ["Background Removal", "Product Isolation", "E-commerce", "Packshot"],
  "background-removal": ["White Background", "Transparent PNG", "Bulk Processing", "Clean Edges"],
  "image-masking": ["Hair Masking", "Fur", "Transparency", "Complex Edges"],
  "shadow-creation": ["Drop Shadow", "Natural Shadow", "Reflection", "Custom Angle"],
  "ghost-mannequin": ["3D Effect", "Neck Joint", "Apparel", "Inner Lining"],
  "color-change": ["Brand Colors", "Pantone Match", "Multiple Variants", "Natural Tone"],
  "photo-retouching": ["Skin Smoothing", "Blemish Removal", "Color Grading", "Beauty Airbrush"],
  "multi-clipping-path": ["Per-Part Edit", "Color Variation", "Layer Separation", "Component Isolation"],
  "ecommerce-editing": ["Amazon Ready", "Platform Optimized", "Bulk Catalog", "Lifestyle Shot"],
  "car-editing": ["Background Replace", "Color Enhancement", "Reflection Cleanup", "Scratch Removal"],
};

export default function ServicesPage() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      <section className="h-screen bg-[var(--bg)]">
        <div className="flex h-full">
          {services.map((service, idx) => {
            const isHovered = hovered === service.id;

            return (
              <motion.div
                key={service.id}
                layout
                onMouseEnter={() => setHovered(service.id)}
                onMouseLeave={() => setHovered(null)}
                className="relative overflow-hidden cursor-pointer group"
                animate={{
                  flex: isHovered ? 4 : 1,
                }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Link href={`/services/${service.id}`} className="block absolute inset-0">
                  <Image
                    src={`/images/covers/${service.id}-cover.jpg`}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Number badge */}
                  <div className="absolute top-6 left-6 z-10">
                    <span className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-xs font-bold text-white/70">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Title - always visible */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white/90 leading-[0.9] tracking-tight uppercase">
                      {service.title.split(" ").map((word, wi) => (
                        <span key={wi} className="block">{word}</span>
                      ))}
                    </h3>

                    {/* Expanded content on hover */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-sm">
                            {service.tagline}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-3">
                            {(serviceTags[service.id] || []).map((tag) => (
                              <span key={tag} className="text-[10px] font-bold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent-500))]" />
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white/60 uppercase tracking-wider group-hover:text-[rgb(var(--accent-text))] transition-colors border-b border-white/20 pb-1">
                            View Capabilities
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
}
