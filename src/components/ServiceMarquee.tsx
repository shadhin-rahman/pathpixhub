"use client";

import Image from "next/image";

const galleryItems = [
  { id: "gallery-1", src: "/images/gallery/gallery-1.jpg" },
  { id: "gallery-2", src: "/images/gallery/gallery-2.jpg" },
  { id: "gallery-3", src: "/images/gallery/gallery-3.jpg" },
  { id: "gallery-4", src: "/images/gallery/gallery-4.jpg" },
  { id: "gallery-5", src: "/images/gallery/gallery-5.jpg" },
  { id: "gallery-6", src: "/images/gallery/gallery-6.jpg" },
  { id: "gallery-7", src: "/images/gallery/gallery-7.jpg" },
  { id: "gallery-8", src: "/images/gallery/gallery-8.jpg" },
  { id: "gallery-9", src: "/images/gallery/gallery-9.jpg" },
  { id: "gallery-10", src: "/images/gallery/gallery-10.jpg" },
  { id: "gallery-11", src: "/images/gallery/gallery-11.jpg" },
  { id: "gallery-12", src: "/images/gallery/gallery-12.jpg" },
];

const marqueeItems = [...galleryItems, ...galleryItems];

function GalleryCard({ item }: { item: (typeof galleryItems)[number] }) {
  return (
    <div className="shrink-0 w-[260px] md:w-[340px]">
      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[var(--bg-alt)] shadow-lg">
        <Image
          src={item.src}
          alt=""
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 260px, 340px"
        />
      </div>
    </div>
  );
}

export default function ServiceMarquee() {
  return (
    <section className="py-16 md:py-20 overflow-hidden bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-text))] font-bold mb-4">
          What We Offer
        </h2>
        <h3 className="text-3xl md:text-5xl font-bold tracking-tight gradient-text">
          A gallery of our craft
        </h3>
      </div>

      <div className="relative">
        <div className="flex gap-5 md:gap-8 w-max marquee-trial">
          {marqueeItems.map((item, i) => (
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
