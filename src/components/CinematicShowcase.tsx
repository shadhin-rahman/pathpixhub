"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  { name: "Clipping Path", link: "/services/clipping-path" },
  { name: "Image Masking", link: "/services/image-masking" },
  { name: "Shadow Creation", link: "/services/shadow-creation" },
  { name: "Color Correction", link: "/services/color-change" },
  { name: "Ghost Mannequin", link: "/services/ghost-mannequin" },
  { name: "Background Removal", link: "/services/background-removal" },
  { name: "E-commerce Editing", link: "/services/ecommerce-editing" },
  { name: "Car Editing", link: "/services/car-editing" },
];

export default function CinematicShowcase() {
  const [isOpen, setIsOpen] = useState(false);

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
        {/* Single Photo Editing card - full width */}
        <div
          className="relative rounded-2xl overflow-hidden cursor-pointer group h-[400px] md:h-[500px]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Image
            src="/images/covers/photo-retouching-cover.jpg"
            alt="Photo Editing"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute top-6 left-6 z-10">
            <span className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-sm font-bold text-white/70">
              01
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white/90 leading-[0.9] tracking-tight">
              PHOTO EDITING
            </h3>
            <p className="mt-4 text-sm text-white/50 max-w-md">
              A combination of AI and highly skilled photo editors, offering the best image editing experience with the highest quality.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-wider">
              <span>Click to {isOpen ? "close" : "view services"}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ↓
              </motion.span>
            </div>
          </div>
        </div>

        {/* Expanded services grid */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                {services.map((service, idx) => (
                  <Link
                    key={service.name}
                    href={service.link}
                    className="group/card glass-card rounded-xl px-6 py-5 border-[rgb(var(--fg-rgb)/5%)] hover:border-[rgb(var(--accent-500)/30%)] transition-all"
                  >
                    <span className="text-xs font-bold text-[rgb(var(--accent-text)/40%)]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h4 className="mt-2 text-sm font-bold text-[rgb(var(--fg-rgb))] group-hover/card:text-[rgb(var(--accent-text))] transition-colors">
                      {service.name}
                    </h4>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
