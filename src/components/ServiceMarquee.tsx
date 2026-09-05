"use client";

import Image from "next/image";
import Link from "next/link";

const galleryItems = [
  { id: "clipping-path", title: "Clipping Path", src: "/images/covers/clipping-path-cover.jpg", tag: "Popular" },
  { id: "background-removal", title: "Background Removal", src: "/images/covers/background-removal-cover.jpg", tag: "Popular" },
  { id: "photo-retouching", title: "Photo Retouching", src: "/images/covers/photo-retouching-cover.jpg", tag: "New" },
  { id: "multi-clipping-path", title: "Multi Clipping Path", src: "/images/covers/multi-clipping-path-cover.jpg", tag: "Popular" },
  { id: "color-change", title: "Color Change", src: "/images/covers/color-change-cover.jpg", tag: "New" },
  { id: "car-editing", title: "Car Editing", src: "/images/covers/car-editing-cover.jpg", tag: "Popular" },
  { id: "ghost-mannequin", title: "Ghost Mannequin", src: "/images/covers/ghost-mannequin-cover.jpg", tag: "New" },
  { id: "image-masking", title: "Image Masking", src: "/images/covers/image-masking-cover.jpg", tag: "Popular" },
  { id: "shadow-creation", title: "Shadow Creation", src: "/images/covers/shadow-creation-cover.jpg", tag: "New" },
  { id: "ecommerce-editing", title: "Ecommerce Editing", src: "/images/covers/ecommerce-editing-cover.jpg", tag: "Popular" },
];

function GalleryCard({ item }: { item: (typeof galleryItems)[number] }) {
  return (
    <Link
      href={`/services/${item.id}`}
      className="group relative shrink-0 w-[220px] md:w-[280px] flex flex-col gap-3"
    >
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--bg-alt)]">
        <span className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wider bg-white text-[#141311] px-2.5 py-1 rounded-md">
          {item.tag}
        </span>
        <Image
          src={item.src}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 220px, 280px"
        />
      </div>
      <p className="text-xs md:text-sm font-bold uppercase tracking-wide text-[rgb(var(--fg-rgb)/70%)]">
        {item.title}
      </p>
    </Link>
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
