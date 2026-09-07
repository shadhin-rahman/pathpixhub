"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { services, priceMap } from "@/data/services";

export default function ServicesPage() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      <section className="pt-40 pb-16 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-text))] font-bold mb-6">What We Offer</h2>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[rgb(var(--fg-rgb))]">Our Services</h1>
          <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed max-w-2xl">
            We deliver pixel-perfect image editing — powered by skilled artists delivering with obsessive precision.
          </p>
        </div>
      </section>

      <section className="pb-32 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-3 h-[550px] md:h-[600px]">
            {services.map((service, idx) => {
              const isHovered = hovered === service.id;

              return (
                <motion.div
                  key={service.id}
                  layout
                  onMouseEnter={() => setHovered(service.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group"
                  animate={{
                    flex: isHovered ? 3 : 1,
                  }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Link href={`/services/${service.id}`} className="block absolute inset-0">
                    <Image
                      src={`/images/covers/${service.id}-cover.jpg`}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-5 left-5 z-10">
                      <span className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-xs font-bold text-white/70">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white/90 leading-[0.9] tracking-tight uppercase">
                        {service.title}
                      </h3>

                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-xs">
                              {service.tagline}
                            </p>
                            <div className="mt-3">
                              <span className="text-[10px] font-bold text-[rgb(var(--accent-text))] uppercase tracking-wider">
                                {priceMap[service.id]}
                              </span>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-wider group-hover:text-[rgb(var(--accent-text))] transition-colors">
                              Learn More
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
        </div>
      </section>

      <section className="py-24 bg-[var(--bg)] text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[rgb(var(--fg-rgb))]">Free Trial Available</h2>
          <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)]">Send us 2 images. We&apos;ll edit them for free. Zero commitment.</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm"
            >
              Get a Quote
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link
              href="/free-trial"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass-card text-[rgb(var(--fg-rgb))] font-semibold border border-[rgb(var(--fg-rgb)/10%)] hover:border-[rgb(var(--accent-500)/50%)] hover:text-[rgb(var(--accent-text))] transition-all text-sm"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
