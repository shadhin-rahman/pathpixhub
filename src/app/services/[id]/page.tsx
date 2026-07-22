import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, priceMap } from "@/data/services";

export async function generateStaticParams() {
  return services.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const service = services.find((s) => s.id === id);
  if (!service) return {};
  return {
    title: `${service.title} | PathPixHub`,
    description: service.description,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = services.find((s) => s.id === id);
  if (!service) notFound();

  return (
    <>
      <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
        <Image
          src={`/images/service-showcase/${service.id}.png`}
          alt={service.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)/60%] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 pb-10 md:pb-16 lg:pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <span className="text-xs font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold">
              {service.title}
            </span>
            <h1 className="mt-3 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              {service.headline}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-[rgb(var(--accent-500)/30%)] bg-[rgb(var(--accent-500)/8%)] mb-6">
                <span className="text-xs font-mono tracking-[0.15em] font-bold text-[rgb(var(--accent-400))]">{priceMap[service.id]}</span>
              </div>
              {service.paragraphs.map((p, i) => (
                <p key={i} className="mt-4 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed first:mt-0">{p}</p>
              ))}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm"
                >
                  Get a Quote
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full glass-card text-[rgb(var(--fg-rgb))] font-semibold hover:border-[rgb(var(--accent-500)/50%)] transition-all text-sm"
                >
                  View Portfolio
                </Link>
              </div>
            </div>
            <div className="glass-card rounded-3xl p-6 md:p-8 border-[rgb(var(--fg-rgb)/5%)]">
              <h2 className="text-lg font-bold text-[rgb(var(--fg-rgb))] mb-6">Features & Capabilities</h2>
              <ul className="space-y-4">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-[rgb(var(--fg-rgb)/60%)]">
                    <svg className="w-5 h-5 text-[rgb(var(--accent-400))] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-10 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {service.whyChoose.map((w, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 border-[rgb(var(--fg-rgb)/5%)]">
                <h3 className="font-bold text-[rgb(var(--fg-rgb))]">{w.title}</h3>
                <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/50%)] leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 mesh-gradient text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text">Ready to Get Started?</h2>
          <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)] max-w-xl mx-auto">
            Try our {service.title} service free. Send us 2 images and we will edit them at no cost.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm"
          >
            Start Free Trial
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>
    </>
  );
}
