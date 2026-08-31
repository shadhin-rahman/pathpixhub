"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { services, priceMap, serviceImagePath } from "@/data/services";
import CreditBanner from "@/components/CreditBanner";

const slideItems = [...services, ...services, ...services];
const trialRepeats = Array.from({ length: 10 }, (_, i) => i);

function ShowcaseCard({ src, beforeSrc, alt, id }: { src: string; beforeSrc: string; alt: string; id: string }) {
  return (
    <Link
      href={`/services/${id}`}
      className="block rounded-2xl p-4 pb-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group border border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)]"
    >
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[rgb(var(--fg-rgb)/5%)]">
        {/* After image - shown by default */}
        <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 320px, 384px"
          />
        </div>

        {/* Before image - fades in on hover */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <Image
            src={beforeSrc}
            alt={`${alt} before`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 320px, 384px"
          />
        </div>
      </div>
      <p className="mt-3 text-center font-bold text-sm text-[rgb(var(--fg-rgb)/85%)] leading-tight">
        {alt}
      </p>
    </Link>
  );
}

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
              <div className="mt-8 flex flex-col gap-4">
                <Link
                  href="/contact#calculator"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm shadow-lg shadow-[rgb(var(--accent-500)/25%)] w-fit"
                >
                  Get an instant estimate
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="https://wa.me/8801723735896"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-[rgb(var(--fg-rgb)/10%)] text-sm font-semibold text-[rgb(var(--fg-rgb)/70%)] hover:border-[rgb(137_243_54_/_50%)] hover:text-[rgb(137_243_54)] hover:shadow-md transition-all duration-300"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    Chat on WhatsApp
                  </Link>
                  <Link
                    href="mailto:info@pathpixhub.com"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-[rgb(var(--fg-rgb)/10%)] text-sm font-semibold text-[rgb(var(--fg-rgb)/70%)] hover:border-[rgb(var(--accent-500)/50%)] hover:text-[rgb(var(--accent-text))] hover:shadow-md transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Email Us
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-[rgb(var(--fg-rgb)/10%)] text-sm font-semibold text-[rgb(var(--fg-rgb)/70%)] hover:border-[rgb(var(--accent-500)/50%)] hover:text-[rgb(var(--accent-text))] hover:shadow-md transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Contact Form
                  </Link>
                </div>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {services.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="rounded-2xl p-5 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl border border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)]"
              >
                <div className="flex flex-col items-center text-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-all duration-300">
                    <Image
                      src={`/images/service-icons/${s.id}.png`}
                      alt={s.title}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <Link
                    href={`/services/${s.id}`}
                    className="font-bold text-sm text-[rgb(var(--fg-rgb)/85%)] leading-tight hover:text-[rgb(var(--accent-text))] transition-colors"
                  >
                    {s.title}
                  </Link>
                </div>
                <p className="text-xs font-mono tracking-[0.1em] text-[rgb(var(--fg-rgb)/60%)] font-bold text-center">
                  {priceMap[s.id]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CreditBanner />

      {/* Quick Plan Comparison */}
      <section className="py-20 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-sm font-bold mb-4 border border-[rgb(var(--accent-500)/15%)]">
              Quick Plan Comparison
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
              Plans at a glance
            </h2>
          </div>
          <div className="rounded-2xl border border-[rgb(var(--fg-rgb)/8%)]">
            {/* Header bar - adapts to dark/light mode */}
            <div className="flex items-center gap-0 rounded-t-2xl" style={{ backgroundColor: 'rgb(var(--fg-rgb))', color: 'var(--bg)' }}>
              <div className="flex-1 py-5 px-6 font-bold text-sm" style={{ opacity: 0.5 }}>Feature</div>
              <div className="flex-1 py-5 px-6 text-center">
                <div className="font-bold">Standard</div>
                <div className="text-sm font-bold text-[rgb(var(--accent-text))]">Pay As You Go</div>
              </div>
              <div className="flex-1 py-5 px-6 text-center">
                <div className="font-bold">Pro</div>
                <div className="text-sm font-bold text-[rgb(var(--accent-text))]">Path Credits Subscription</div>
              </div>
              <div className="flex-1 py-5 px-6 text-center">
                <div className="font-bold">Enterprise</div>
                <div className="text-sm font-bold text-[rgb(var(--accent-text))]">$499/month</div>
              </div>
            </div>
            {/* White body */}
            <div className="overflow-x-auto">
            <table className="w-full text-sm bg-[var(--bg)]">
              <tbody>
                {[
                  { label: "Next Morning Turnaround", values: [false, true, true] },
                  { label: "Discount on credits", values: ["0%", "35%", "Custom"] },
                  { label: "Image editing price", values: ["Variable", "Variable", "Flat"] },
                  { label: "Dedicated Account Manager", values: [false, false, true] },
                  { label: "Dedicated Editing Team", values: [false, true, true] },
                  { label: "Monthly billing by invoice", values: [false, false, true] },
                  { label: "Minimum order fee", values: ["$2.5", false, false] },
                ].map((row, ri) => (
                  <tr key={row.label} className={`border-b border-[rgb(var(--fg-rgb)/5%)] ${ri % 2 === 0 ? "bg-[var(--bg)]" : "bg-[rgb(var(--fg-rgb)/2%)]"}`}>
                    <td className="py-3.5 px-4 text-[rgb(var(--fg-rgb)/70%)] font-medium">{row.label}</td>
                    {row.values.map((val, i) => {
                      if (val === true) {
                        return (
                          <td key={i} className="py-3.5 px-4 text-center bg-[rgb(var(--accent-500))/15%]">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          </td>
                        );
                      }
                      if (val === false) {
                        return (
                          <td key={i} className="py-3.5 px-4 text-center text-[rgb(var(--fg-rgb)/20%)] font-bold">
                            —
                          </td>
                        );
                      }
                      return (
                        <td key={i} className="py-3.5 px-4 text-center font-bold text-[rgb(var(--fg-rgb)/80%)]">
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {/* CTA row */}
                <tr>
                  <td className="py-5 px-4" />
                  <td className="py-5 px-4 text-center" />
                  <td className="py-5 px-4 text-center">
                    <Link href="/subscription" className="inline-block px-6 py-3 rounded-xl font-bold text-sm transition-all bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] shadow-lg shadow-[rgb(var(--accent-500)/15%)]">
                      Subscribe
                    </Link>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <Link href="/enterprise" className="inline-block px-6 py-3 rounded-xl font-bold text-sm transition-all bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] shadow-lg shadow-[rgb(var(--accent-500)/15%)]">
                      Contact sales
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 overflow-hidden bg-[var(--bg)] relative">
        <div className="flex gap-8 w-max items-stretch marquee-slide" ref={sliderRef}>
          {slideItems.map((s, i) => (
              <div key={`${s.id}-${i}`} className="flex-shrink-0 w-[18rem] md:w-96 group">
                <ShowcaseCard
                  src={serviceImagePath(s.id, "pricing", "after")}
                  beforeSrc={serviceImagePath(s.id, "pricing", "before")}
                  alt={s.title}
                  id={s.id}
                />
              </div>
          ))}
        </div>

        <button
          onClick={skipAhead}
          aria-label="Skip ahead"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass-card bg-[var(--bg-alt)/80] backdrop-blur-md text-[rgb(var(--accent-text))] flex items-center justify-center hover:bg-[rgb(var(--accent-500))] hover:text-[rgb(var(--accent-contrast))] transition-all duration-300 shadow-lg border border-[rgb(var(--fg-rgb)/10%)]"
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
                href="/free-trial"
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