"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { services } from "@/data/services";

export default function ServicesPage() {
  return (
    <>
      <section className="pt-40 pb-12 bg-[var(--bg)]">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <Link
                  href={`/services/${service.id}`}
                  className="block relative aspect-[4/3] rounded-2xl overflow-hidden"
                >
                  <Image
                    src={`/images/covers/${service.id}-cover.jpg`}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4 z-10">
                    <span className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-xs font-bold text-white/70">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <h3 className="text-xl md:text-2xl font-black text-white leading-[0.95] tracking-tight uppercase">
                      {service.title.split(" ").map((word, wi) => (
                        <span key={wi} className="block">{word}</span>
                      ))}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-white/50 group-hover:text-[rgb(var(--accent-text))] transition-colors">
                      Learn More
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
