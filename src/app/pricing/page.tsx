"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { services, priceMap } from "@/data/services";

const cardColors = [
  "#fca5a5",
  "#d8b4fe",
  "#f9a8d4",
  "#fde68a",
  "#93c5fd",
  "#86efac",
  "#fdba74",
  "#5eead4",
  "#a5b4fc",
  "#fda4af",
];

const slideItems = [...services, ...services, ...services];
const trialRepeats = Array.from({ length: 10 }, (_, i) => i);

export default function PricingPage() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const skipTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const skipAhead = () => {
    if (!sliderRef.current) return;
    clearTimeout(skipTimer.current);
    sliderRef.current.style.animationDuration = "6s";
    skipTimer.current = setTimeout(() => {
      if (sliderRef.current) {
        sliderRef.current.style.animationDuration = "50s";
      }
    }, 4000);
  };

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
                className="rounded-2xl p-5 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl"
                style={{ backgroundColor: cardColors[i % cardColors.length] }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-all duration-300">
                    <Image
                      src={`/images/service-icons/${s.id}.png`}
                      alt={s.title}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <Link
                    href={`/services#${s.id}`}
                    className="font-bold text-sm text-[rgb(var(--fg-rgb)/85%)] leading-tight hover:text-[rgb(var(--accent-500))] transition-colors"
                  >
                    {s.title}
                  </Link>
                </div>
                <p className="text-xs font-mono tracking-[0.1em] text-[rgb(var(--fg-rgb)/60%)] font-bold">
                  {priceMap[s.id]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 overflow-hidden bg-[var(--bg)] relative">
        <div className="flex gap-6 w-max marquee-slide" ref={sliderRef}>
          {slideItems.map((s, i) => {
            const ci = i % cardColors.length;
            return (
              <div key={`${s.id}-${i}`} className="flex-shrink-0 w-64 md:w-80 group">
                <div className="rounded-2xl p-4 pb-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ backgroundColor: cardColors[ci] }}
                >
                  <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden bg-white/10">
                    <Image
                      src={`/images/service-showcase/${s.id}.png`}
                      alt={s.title}
                      fill
                      className="object-contain p-3 group-hover:opacity-0 transition-opacity duration-500"
                      sizes="(max-width: 768px) 256px, 320px"
                    />
                    <Image
                      src={`/images/service-showcase/${s.id}-before.png`}
                      alt={`${s.title} before`}
                      fill
                      className="object-contain p-3 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      sizes="(max-width: 768px) 256px, 320px"
                    />
                  </div>
                  <Link
                    href={`/services#${s.id}`}
                    className="block mt-3 text-[rgb(var(--fg-rgb)/80%)] font-bold text-sm text-center leading-tight hover:text-[rgb(var(--accent-500))] transition-colors"
                  >
                    {s.title}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={skipAhead}
          aria-label="Skip ahead"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass-card bg-[var(--bg-alt)/80] backdrop-blur-md text-[rgb(var(--accent-400))] flex items-center justify-center hover:bg-[rgb(var(--accent-500))] hover:text-[rgb(var(--accent-contrast))] transition-all duration-300 shadow-lg border border-[rgb(var(--fg-rgb)/10%)]"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
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