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

const cardColors = [
  "#ef4444",
  "#a855f7",
  "#ec4899",
  "#eab308",
  "#3b82f6",
  "#10b981",
  "#f97316",
  "#14b8a6",
  "#6366f1",
  "#f43f5e",
];

const slideItems = [...services, ...services, ...services];
const trialRepeats = Array.from({ length: 10 }, (_, i) => i);

export default function PricingPage() {
  return (
    <>
      <section className="pt-40 pb-20 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[rgb(var(--fg-rgb))] leading-[1.1]">
                Stress less with simple pricing<br />and pixel perfect photo edits
              </h1>
              <p className="mt-5 text-base md:text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
                Curious about how much your edits will cost? Get an instant quote to see your total right away, or keep reading to learn more about how PathPixHub photo editing rates work.
              </p>
              <div className="mt-8">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm shadow-lg shadow-[rgb(var(--accent-500)/25%)]"
                >
                  Get a quote
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[26rem] rounded-3xl overflow-hidden glass-card border-[rgb(var(--fg-rgb)/10%)]">
              <Image
                src="/images/price-page.png"
                alt="Price page"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
            See the starting cost<br />for photo editing rates
          </h2>
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
        <div className="flex gap-6 w-max marquee-slide">
          {slideItems.map((s, i) => {
            const ci = i % cardColors.length;
            return (
              <div key={`${s.id}-${i}`} className="flex-shrink-0 w-64 md:w-80 group">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <div className="absolute inset-0" style={{ backgroundColor: cardColors[ci], opacity: 0.2 }} />
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 256px, 320px"
                  />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${cardColors[ci]}33, transparent 50%)` }} />
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
            );
          })}
        </div>
      </section>

      <section className="py-20 bg-[var(--bg-alt)] overflow-hidden">
        <div className="flex gap-10 w-max items-center marquee-trial">
          {trialRepeats.map((i) => (
            <div key={i} className="flex items-center gap-10">
              <span className="text-xl md:text-2xl font-bold tracking-tight text-[rgb(var(--fg-rgb))] whitespace-nowrap">
                Get your first two images edited, on us.
              </span>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-sm whitespace-nowrap hover:bg-[rgb(var(--accent-500))] hover:scale-105 transition-all shrink-0 shadow-lg shadow-[rgb(var(--accent-500)/25%)]"
              >
                Get 2 free edits
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}