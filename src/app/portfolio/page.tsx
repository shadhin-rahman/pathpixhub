import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Portfolio | PathPixHub",
  description: "Before & after examples of our professional photo editing work — clipping path, background removal, retouching, ghost mannequin, and more.",
};

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
  return (
    <>
      <section className="pt-40 pb-20 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Our Work</h2>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Portfolio</h1>
            <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/60%)]">Before & after examples of our editing work.</p>
          </div>
        </div>
      </section>

      <section className="pb-32 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolioItems.map((item) => (
              <div key={item.title} className="group glass-card rounded-[2rem] overflow-hidden border border-[rgb(var(--fg-rgb)/5%)] hover:bg-[rgb(var(--fg-rgb)/5%)] transition-all duration-500">
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
                  <span className="text-xs font-mono tracking-[0.2em] text-[rgb(var(--accent-400))] font-bold">{item.category}</span>
                  <h3 className="mt-1 text-base font-bold text-[rgb(var(--fg-rgb))]">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
