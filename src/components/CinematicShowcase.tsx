"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface CinematicServiceProps {
  services: {
    id: string;
    title: string;
    tagline: string;
  }[];
}

const showcaseImages = [
  { id: "clipping-path", src: "/images/covers/clipping-path-cover.jpg" },
  { id: "background-removal", src: "/images/covers/background-removal-cover.jpg" },
  { id: "photo-retouching", src: "/images/covers/photo-retouching-cover.jpg" },
  { id: "multi-clipping-path", src: "/images/covers/multi-clipping-path-cover.jpg" },
  { id: "color-change", src: "/images/covers/color-change-cover.jpg" },
  { id: "car-editing", src: "/images/covers/car-editing-cover.jpg" },
  { id: "ghost-mannequin", src: "/images/covers/ghost-mannequin-cover.jpg" },
  { id: "image-masking", src: "/images/covers/image-masking-cover.jpg" },
  { id: "shadow-creation", src: "/images/covers/shadow-creation-cover.jpg" },
  { id: "ecommerce-editing", src: "/images/covers/ecommerce-editing-cover.jpg" },
];

export default function CinematicShowcase({ services }: CinematicServiceProps) {
  return (
    <section className="py-24 lg:py-32 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-text))] font-bold mb-6">What We Offer</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight gradient-text">Our Services</h3>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {showcaseImages.map((item, idx) => {
            const service = services.find(s => s.id === item.id) || services[idx];
            return (
              <Link key={item.id} href={`/services/${service.id}`} className="group block">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[var(--bg-subtle)]"
                >
                  <Image
                    src={item.src}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h4 className="text-sm font-bold text-white/50 uppercase tracking-wider">{String(idx + 1).padStart(2, "0")}</h4>
                    <h3 className="text-lg font-bold text-white leading-tight mt-1">{service.title}</h3>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[rgb(var(--accent-text))] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View Service
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
