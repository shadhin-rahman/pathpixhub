import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services, priceMap } from "@/data/services";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Services | PathPixHub",
  description: "Explore our 10 professional photo editing services — clipping path, background removal, image masking, ghost mannequin, retouching, and more.",
};

export default function ServicesPage() {
  return (
    <>
      <ScrollReveal>
      <section className="pt-40 pb-20 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">What We Offer</h2>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Our Services</h1>
          <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed max-w-2xl">
            We deliver pixel-perfect image editing — powered by skilled artists delivering with obsessive precision.
          </p>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="pb-32 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => {
              const colors = ["#fca5a5","#d8b4fe","#f9a8d4","#fde68a","#93c5fd","#86efac","#fdba74","#5eead4","#a5b4fc","#fda4af"];
              return (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="group rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                  style={{ backgroundColor: colors[i % colors.length] }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-white/20">
                    <Image
                      src={`/images/service-showcase/${service.id}.png`}
                      alt={service.title}
                      fill
                      className="object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-bold text-lg text-[rgb(var(--fg-rgb)/85%)]">{service.title}</h3>
                      <span className="shrink-0 text-[10px] font-mono tracking-[0.1em] font-bold px-3 py-1.5 rounded-full bg-white/20 text-[rgb(var(--fg-rgb)/70%)]">
                        {priceMap[service.id]}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-[rgb(var(--fg-rgb)/55%)] line-clamp-2">{service.tagline}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[rgb(var(--fg-rgb)/60%)] group-hover:text-[rgb(var(--accent-500))] transition-colors">
                      Learn More
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="py-24 mesh-gradient text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text">Free Trial Available</h2>
          <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)]">Send us 2 images. We'll edit them for free. Zero commitment.</p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm"
          >
            Start Free Trial
          </Link>
        </div>
      </section>
      </ScrollReveal>
    </>
  );
}
