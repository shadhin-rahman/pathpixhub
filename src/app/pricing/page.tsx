"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/data/services";

const priceMap: Record<string, string> = {
  "clipping-path": "FROM $0.39 / IMAGE",
  "background-removal": "FROM $0.39 / IMAGE",
  "shadow-creation": "FROM $0.25 / IMAGE",
  "ghost-mannequin": "FROM $0.89 / IMAGE",
  "image-masking": "FROM $1.19 / IMAGE",
  "color-change": "FROM $0.99 / IMAGE",
  "photo-retouching": "FROM $0.69 / IMAGE",
  "multi-clipping-path": "FROM $1.19 / IMAGE",
  "ecommerce-editing": "FROM $2.99 / IMAGE",
  "car-editing": "FROM $2.99 / IMAGE",
};

const slideItems = [...services, ...services, ...services];

export default function PricingPage() {
  return (
    <>
      <section className="pt-40 pb-20 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Pricing</h2>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text leading-[1.1]">
              See the starting cost<br />for photo editing rates
            </h1>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="glass-card rounded-2xl p-6 border-[rgb(var(--fg-rgb)/5%)] hover:border-[rgb(var(--accent-500)/20%)] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[rgb(var(--accent-500)/10%)] flex items-center justify-center text-lg group-hover:bg-[rgb(var(--accent-500)/20%)] transition-colors">
                    {s.icon}
                  </div>
                  <h3 className="font-bold text-sm text-[rgb(var(--fg-rgb))] leading-tight">{s.title}</h3>
                </div>
                <p className="text-xs font-mono tracking-[0.1em] text-[rgb(var(--accent-400))] font-bold">
                  {priceMap[s.id]}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link
              href="/contact"
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm"
            >
              Get a Custom Quote
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 overflow-hidden bg-[var(--bg)]">
        <div className="mb-10 px-6 max-w-7xl mx-auto">
          <span className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold">Our Services</span>
        </div>
        <motion.div
          animate={{ x: [0, -3440] }}
          transition={{ repeat: Infinity, duration: 50, ease: "linear", repeatType: "loop" }}
          className="flex gap-6 w-max"
        >
          {slideItems.map((s, i) => (
            <Link
              key={`${s.id}-${i}`}
              href={`/services#${s.id}`}
              className="flex-shrink-0 w-64 md:w-80 group"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass-card border-[rgb(var(--fg-rgb)/5%)]">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 256px, 320px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-white font-bold text-sm drop-shadow-md">{s.title}</span>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </section>

      <section className="pb-32 bg-[var(--bg-alt)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            animate={{ x: ["100%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear", repeatType: "loop" }}
            className="w-max"
          >
            <Link
              href="/contact"
              className="flex items-center gap-6 md:gap-10 px-8 md:px-12 py-5 md:py-6 rounded-2xl glass-card border border-[rgb(var(--accent-500)/20%)] bg-[rgb(var(--accent-500)/5%)] hover:bg-[rgb(var(--accent-500)/10%)] transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[rgb(var(--accent-500)/15%)] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h3 className="text-lg md:text-2xl font-bold tracking-tight gradient-text whitespace-nowrap">
                  Get your first two images edited, on us.
                </h3>
                <p className="text-sm text-[rgb(var(--fg-rgb)/60%)] mt-1 whitespace-nowrap">Get 2 free edits — no credit card required</p>
              </div>
              <svg className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}