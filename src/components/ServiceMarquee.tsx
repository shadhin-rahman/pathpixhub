"use client";

import Image from "next/image";

const galleryItems = [
  { id: "gallery-1", src: "/images/gallery/gallery-1.jpg" },
  { id: "gallery-2", src: "/images/gallery/gallery-2.jpg" },
  { id: "gallery-3", src: "/images/gallery/gallery-3.jpg" },
  { id: "gallery-4", src: "/images/gallery/gallery-4.jpg" },
];

function GalleryCard({ item }: { item: (typeof galleryItems)[number] }) {
  return (
    <div className="shrink-0 w-[220px] md:w-[280px]">
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--bg-alt)]">
        <Image
          src={item.src}
          alt=""
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 220px, 280px"
        />
      </div>
    </div>
  );
}

export default function ServiceMarquee() {
  return (
    <section className="py-20 md:py-28 overflow-hidden bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-text))] font-bold mb-4">
          What We Offer
        </h2>
        <h3 className="text-3xl md:text-5xl font-bold tracking-tight gradient-text">
          A gallery of our craft
        </h3>
      </div>

      <div className="relative">
        <div className="flex gap-5 md:gap-8 w-max marquee-trial">
          {[...galleryItems, ...galleryItems].map((item, i) => (
            <GalleryCard key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[var(--bg)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[var(--bg)] to-transparent" />
      </div>
    </section>
  );
}
