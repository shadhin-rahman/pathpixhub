"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const serviceCards = [
  {
    id: "photo-editing",
    title: "PHOTO EDITING",
    src: "/images/covers/photo-retouching-cover.jpg",
    desc: "A combination of AI and highly skilled photo editors, offering the best image editing experience with the highest quality.",
    tags: ["Masking", "Retouching", "Clipping Path", "Color Match"],
    link: "/services/photo-retouching",
  },
  {
    id: "clipping-path",
    title: "CLIPPING PATH",
    src: "/images/covers/clipping-path-cover.jpg",
    desc: "Precise hand-drawn clipping paths to isolate subjects from backgrounds with pixel-perfect accuracy.",
    tags: ["Background Removal", "Product Isolation", "E-commerce", "Packshot"],
    link: "/services/clipping-path",
  },
  {
    id: "image-masking",
    title: "IMAGE MASKING",
    src: "/images/covers/image-masking-cover.jpg",
    desc: "Advanced masking techniques for complex subjects like hair, fur, and transparent objects.",
    tags: ["Hair Masking", "Fur", "Transparency", "Complex Edges"],
    link: "/services/image-masking",
  },
];

export default function CinematicShowcase() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [clicked, setClicked] = useState<string | null>(null);

  return (
    <section className="py-24 lg:py-32 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-[rgb(var(--fg-rgb))] uppercase">Our Services</h2>
          <p className="text-sm text-[rgb(var(--fg-rgb)/50%)] max-w-xs leading-relaxed">We deliver world-class media solutions powered by a network of 250+ elite artists.</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-3 h-[450px] md:h-[500px]">
          {serviceCards.map((card, idx) => {
            const isHovered = hovered === card.id;
            const isClicked = clicked === card.id;
            const isExpanded = isHovered || isClicked;

            return (
              <motion.div
                key={card.id}
                layout
                onMouseEnter={() => setHovered(card.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setClicked(clicked === card.id ? null : card.id)}
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
                animate={{
                  flex: isExpanded ? 3 : 1,
                }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Image
                  src={card.src}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Number */}
                <div className="absolute top-5 left-5 z-10">
                  <span className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-xs font-bold text-white/70">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Title - always visible */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white/90 leading-[0.9] tracking-tight">
                    {card.title}
                  </h3>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-xs">
                          {card.desc}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {card.tags.map((tag) => (
                            <span key={tag} className="text-[10px] font-bold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent-500))]" />
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link href={card.link} className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider hover:text-[rgb(var(--accent-text))] transition-colors">
                          View Capabilities
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
