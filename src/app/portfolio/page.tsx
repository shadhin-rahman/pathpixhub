"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerReveal, { StaggerItem } from "@/components/StaggerReveal";

const categories = ["All", "Cutouts", "Apparel", "Retouching", "Product", "Color", "Shadow", "Background", "Masking", "Clipping"];

const portfolioItems = [
  { title: "Clipping Path", img: "/images/service-showcase/clipping-path.png", category: "Cutouts" },
  { title: "Ghost Mannequin", img: "/images/service-showcase/ghost-mannequin.png", category: "Apparel" },
  { title: "Wrinkle Removal", img: "/images/service-showcase/photo-retouching.png", category: "Retouching" },
  { title: "Jewelry Editing", img: "/images/service-showcase/ecommerce-editing.png", category: "Product" },
  { title: "Color Change", img: "/images/service-showcase/color-change.png", category: "Color" },
  { title: "Shadow Creation", img: "/images/service-showcase/shadow-creation.png", category: "Shadow" },
  { title: "Background Removal", img: "/images/service-showcase/background-removal.png", category: "Background" },
  { title: "Image Masking", img: "/images/service-showcase/image-masking.png", category: "Masking" },
  { title: "Multi Clipping Path", img: "/images/service-showcase/multi-clipping-path.png", category: "Clipping" },
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? portfolioItems : portfolioItems.filter((i) => i.category === activeCategory);

  return (
    <>
      <ScrollReveal>
      <section className="pt-40 pb-20 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Our Work</h2>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Portfolio</h1>
            <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/60%)]">
              Before & after examples showcasing our precision across every service.
            </p>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <section className="py-10 bg-[var(--bg-alt)] sticky top-[72px] z-30 border-b border-[rgb(var(--fg-rgb)/5%)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]"
                    : "glass-card text-[rgb(var(--fg-rgb)/60%)] hover:text-[rgb(var(--accent-400))]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <ScrollReveal>
      <section className="pb-32 pt-10 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[rgb(var(--fg-rgb)/40%)] text-lg">No items in this category yet.</p>
            </div>
          ) : (
          <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item) => (
              <StaggerItem key={item.title}>
              <div className="group glass-card rounded-[2rem] overflow-hidden border border-[rgb(var(--fg-rgb)/5%)] hover:bg-[rgb(var(--fg-rgb)/5%)] transition-all duration-500">
                <div className="relative aspect-[4/3] overflow-hidden bg-white/20">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-contain p-5 group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-mono tracking-[0.15em] text-[rgb(var(--accent-400))] font-bold uppercase">{item.category}</span>
                  <h3 className="mt-1 text-base font-bold text-[rgb(var(--fg-rgb))]">{item.title}</h3>
                </div>
              </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
          )}
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="py-24 mesh-gradient text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text">Want Results Like These?</h2>
          <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)] max-w-xl mx-auto">
            Send us 2 images for a free trial and see the quality firsthand.
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
      </ScrollReveal>
    </>
  );
}