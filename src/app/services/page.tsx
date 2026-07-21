import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services, priceMap } from "@/data/services";

export const metadata: Metadata = {
  title: "Services | PathPixHub",
  description: "Explore our 10 professional photo editing services — clipping path, background removal, image masking, ghost mannequin, retouching, and more.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="pt-40 pb-20 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">What We Do</h2>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Our Services</h1>
            <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
              We deliver pixel-perfect image editing — powered by skilled artists delivering with obsessive precision.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-32 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          {services.map((service, index) => (
            <div key={service.id} id={service.id} className="scroll-mt-32">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <span className="text-xs font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-[rgb(var(--fg-rgb))]">{service.title}</h2>
                <p className="mt-3 text-base font-semibold text-[rgb(var(--accent-400))]">{service.headline}</p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-[rgb(var(--accent-500)/30%)] bg-[rgb(var(--accent-500)/8%)]">
                  <span className="text-xs font-mono tracking-[0.15em] font-bold text-[rgb(var(--accent-400))]">{priceMap[service.id]}</span>
                </div>
                <div className="mt-4 space-y-4">
                  {service.paragraphs.map((p, i) => (
                    <p key={i} className="text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">{p}</p>
                  ))}
                </div>
                <ul className="mt-6 space-y-3">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-[rgb(var(--fg-rgb)/50%)]">
                      <svg className="w-4 h-4 text-[rgb(var(--accent-400))] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--accent-400))] hover:text-[rgb(var(--accent-300))] transition-colors"
                >
                  Get a Quote
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
              <div className={`relative w-full h-64 md:h-80 lg:h-[28rem] rounded-3xl overflow-hidden glass-card border-[rgb(var(--fg-rgb)/5%)] bg-white/20 group ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <Image
                  src={`/images/service-showcase/${service.id}.png`}
                  alt={service.title}
                  fill
                  className="object-contain p-4 group-hover:opacity-0 transition-opacity duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <Image
                  src={`/images/service-showcase/${service.id}-before.png`}
                  alt={`${service.title} before`}
                  fill
                  className="object-contain p-4 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              </div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {service.whyChoose.map((w, i) => (
                  <div key={i} className="glass-card rounded-2xl p-5 border-[rgb(var(--fg-rgb)/5%)]">
                    <h4 className="font-bold text-sm text-[rgb(var(--fg-rgb))]">{w.title}</h4>
                    <p className="mt-1.5 text-sm text-[rgb(var(--fg-rgb)/50%)] leading-relaxed">{w.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 mesh-gradient text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text">Free Trial Available</h2>
          <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)]">Send us 3-5 images. We will edit them for free. Zero commitment.</p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm"
          >
            Start Free Trial
          </Link>
        </div>
      </section>
    </>
  );
}
