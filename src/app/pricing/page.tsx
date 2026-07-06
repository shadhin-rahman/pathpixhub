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

const cardBgColors = [
  "rgba(239, 68, 68, 0.18)",
  "rgba(168, 85, 247, 0.18)",
  "rgba(236, 72, 153, 0.18)",
  "rgba(234, 179, 8, 0.18)",
  "rgba(59, 130, 246, 0.18)",
  "rgba(16, 185, 129, 0.18)",
  "rgba(249, 115, 22, 0.18)",
  "rgba(20, 184, 166, 0.18)",
  "rgba(99, 102, 241, 0.18)",
  "rgba(244, 63, 94, 0.18)",
];

const cardBorderColors = [
  "rgba(239, 68, 68, 0.35)",
  "rgba(168, 85, 247, 0.35)",
  "rgba(236, 72, 153, 0.35)",
  "rgba(234, 179, 8, 0.35)",
  "rgba(59, 130, 246, 0.35)",
  "rgba(16, 185, 129, 0.35)",
  "rgba(249, 115, 22, 0.35)",
  "rgba(20, 184, 166, 0.35)",
  "rgba(99, 102, 241, 0.35)",
  "rgba(244, 63, 94, 0.35)",
];

const slideItems = [...services, ...services, ...services];
const trialRepeats = Array.from({ length: 10 }, (_, i) => i);

export default function PricingPage() {
  return (
    <>
      <section className="pt-40 pb-20 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text leading-[1.1] text-center">
            See the starting cost<br />for photo editing rates
          </h1>
        </div>
      </section>

      <section className="pt-16 pb-10 bg-[var(--bg-alt)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[rgb(var(--fg-rgb))]">
            Stress less with simple pricing<br />and pixel perfect photo edits
          </h2>
          <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
            Curious about how much your edits will cost? Get an instant quote to see your total right away, or keep reading to learn more about how PathPixHub photo editing rates work.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-medium">
            <span className="px-5 py-3 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))]">Upload images</span>
            <svg className="w-5 h-5 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            <span className="px-5 py-3 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))]">Select services</span>
            <svg className="w-5 h-5 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            <span className="px-5 py-3 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))]">Select turnaround</span>
            <svg className="w-5 h-5 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            <span className="px-6 py-3 rounded-xl bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold">$</span>
          </div>
          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm shadow-lg shadow-[rgb(var(--accent-500)/25%)]"
            >
              Get an instant quote
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-20 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="glass-card rounded-2xl p-6 border-[rgb(var(--fg-rgb)/5%)] hover:border-[rgb(var(--accent-500)/30%)] hover:shadow-lg hover:shadow-[rgb(var(--accent-500)/10%)] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[rgb(var(--accent-500)/10%)] flex items-center justify-center text-lg group-hover:bg-[rgb(var(--accent-500)/20%)] group-hover:scale-110 transition-all duration-300">
                    {s.icon}
                  </div>
                  <Link
                    href={`/services#${s.id}`}
                    className="font-bold text-sm text-[rgb(var(--fg-rgb))] leading-tight hover:text-[rgb(var(--accent-400))] transition-colors"
                  >
                    {s.title}
                  </Link>
                </div>
                <p className="text-xs font-mono tracking-[0.1em] text-[rgb(var(--accent-400))] font-bold">
                  {priceMap[s.id]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 overflow-hidden bg-[var(--bg)]">
        <motion.div
          animate={{ x: [0, -3440] }}
          transition={{ repeat: Infinity, duration: 50, ease: "linear", repeatType: "loop" }}
          className="flex gap-6 w-max"
        >
          {slideItems.map((s, i) => {
            const ci = i % cardBgColors.length;
            return (
              <div
                key={`${s.id}-${i}`}
                className="flex-shrink-0"
              >
                <div
                  className="rounded-2xl p-3"
                  style={{ backgroundColor: cardBgColors[ci], border: `1px solid ${cardBorderColors[ci]}` }}
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 256px, 320px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <Link
                        href={`/services#${s.id}`}
                        className="text-white font-bold text-sm drop-shadow-md hover:underline underline-offset-2"
                      >
                        {s.title}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </section>

      <section className="py-20 bg-[var(--bg-alt)] overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear", repeatType: "loop" }}
          className="flex gap-10 w-max items-center"
        >
          {trialRepeats.map((i) => (
            <div key={i} className="flex items-center gap-10">
              <span className="text-xl md:text-2xl font-bold tracking-tight text-[rgb(var(--fg-rgb))] whitespace-nowrap">
                Get your first two images edited, on us.
              </span>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-sm whitespace-nowrap hover:bg-[rgb(var(--accent-400))] hover:scale-105 transition-all shrink-0 shadow-lg shadow-[rgb(var(--accent-500)/25%)]"
              >
                Get 2 free edits
              </Link>
            </div>
          ))}
        </motion.div>
      </section>
    </>
  );
}