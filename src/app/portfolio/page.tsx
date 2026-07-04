import Image from "next/image";

const portfolioItems = [
  { title: "Clipping Path", img: "/images/before after.jpg", category: "Cutouts" },
  { title: "Ghost Mannequin", img: "/images/Ghost manipulation services.jpg", category: "Apparel" },
  { title: "Wrinkle Removal", img: "/images/Wrinkle remove.jpg", category: "Retouching" },
  { title: "Jewelry Retouching", img: "/images/467730158_122106679586616641_5666634243268131988_n.jpg", category: "Product" },
  { title: "Color Change", img: "/images/25RN718SOK_BEP-original.jpg", category: "Color" },
  { title: "Path & Shadow", img: "/images/Shoe-path-&-shadow-before-after.gif", category: "Shadow" },
  { title: "Background Removal", img: "/images/Remove-background-before-after.gif", category: "Background" },
  { title: "Dust Removal", img: "/images/before.jpg", category: "Retouching" },
  { title: "Shirt Edit", img: "/images/Shirt-before-after.gif", category: "Editing" },
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
            {portfolioItems.map((item, i) => (
              <div key={i} className="group glass-card rounded-[2rem] overflow-hidden border border-[rgb(var(--fg-rgb)/5%)] hover:bg-[rgb(var(--fg-rgb)/5%)] transition-all duration-500">
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-subtle)]">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
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
