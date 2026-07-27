"use client";

import Image from "next/image";
import PricingCalculator from "@/components/PricingCalculator";

export default function ContactPage() {
  return (
    <>
      <section className="pt-40 pb-20 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-xl">
              <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold">Contact</h2>
              <h1 className="mt-6 text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] gradient-text">
                Let&apos;s
                <br />
                Talk.
              </h1>
              <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
                We turn bold ideas into unforgettable visuals. Start the conversation.
              </p>
            </div>
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[28rem] rounded-3xl overflow-hidden glass-card border-[rgb(var(--fg-rgb)/10%)]">
              <Image
                src="/images/image-masking-1.jpg"
                alt="Photo editing showcase"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <PricingCalculator />

      <section className="pb-32 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text mb-4">Prefer to Talk Directly?</h2>
            <p className="text-[rgb(var(--fg-rgb)/50%)] mb-10">Choose how you&apos;d like to reach us — we respond within 2 hours.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/8801723735896"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[rgb(34_197_94)] text-white font-bold hover:bg-[rgb(22_163_74)] hover:scale-[1.02] transition-all text-sm shadow-lg shadow-[rgb(34_197_94)/25%]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Chat on WhatsApp
              </a>
              <a
                href="mailto:info@pathpixhub.com"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full glass-card border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] font-bold hover:border-[rgb(var(--accent-500)/50%)] hover:text-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Send us an Email
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}