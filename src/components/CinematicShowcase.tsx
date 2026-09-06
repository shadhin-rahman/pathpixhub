"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface CinematicServiceProps {
  services: {
    id: string;
    title: string;
    tagline: string;
  }[];
}

const showcaseImages = [
  { id: "clipping-path", src: "/images/covers/clipping-path-cover.jpg" },
  { id: "background-removal", src: "/images/covers/background-removal-cover.jpg" },
  { id: "photo-retouching", src: "/images/covers/photo-retouching-cover.jpg" },
  { id: "multi-clipping-path", src: "/images/covers/multi-clipping-path-cover.jpg" },
  { id: "color-change", src: "/images/covers/color-change-cover.jpg" },
  { id: "car-editing", src: "/images/covers/car-editing-cover.jpg" },
  { id: "ghost-mannequin", src: "/images/covers/ghost-mannequin-cover.jpg" },
  { id: "image-masking", src: "/images/covers/image-masking-cover.jpg" },
  { id: "shadow-creation", src: "/images/covers/shadow-creation-cover.jpg" },
  { id: "ecommerce-editing", src: "/images/covers/ecommerce-editing-cover.jpg" },
];

const leftItems = showcaseImages.slice(0, 5);
const rightItems = showcaseImages.slice(5);

function MarqueeColumn({ items, direction }: { items: typeof showcaseImages; direction: "up" | "down" }) {
  const duplicated = [...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden h-[500px] md:h-[600px]">
      <motion.div
        className="flex flex-col gap-4"
        animate={{ y: direction === "up" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {duplicated.map((item, i) => (
          <div key={`${item.id}-${i}`} className="shrink-0 w-[140px] md:w-[180px] aspect-square rounded-2xl overflow-hidden">
            <Image src={item.src} alt="" width={180} height={180} className="w-full h-full object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function CinematicShowcase(_props: CinematicServiceProps) {
  return (
    <section className="py-24 lg:py-32 bg-[var(--bg-alt)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-6 md:gap-12">
          {/* Left column - scrolls up */}
          <div className="hidden lg:block shrink-0">
            <MarqueeColumn items={leftItems} direction="up" />
          </div>

          {/* Center text */}
          <div className="flex-1 text-center py-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-text))] font-bold mb-6">What We Offer</h2>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[rgb(var(--fg-rgb))] leading-[1.1] max-w-lg mx-auto">
                We&apos;re your virtual photo editing and design studio
              </h3>
              <p className="mt-6 text-base md:text-lg text-[rgb(var(--fg-rgb)/50%)] leading-relaxed max-w-md mx-auto">
                Professional photo editing services for ecommerce, product, sports, headshot, and portrait photography are available 24/7.
              </p>
              <div className="mt-8 inline-block px-6 py-3 rounded-full border border-[rgb(var(--fg-rgb)/10%)]">
                <span className="text-sm font-bold text-[rgb(var(--fg-rgb)/70%)]">Starting at <span className="text-[rgb(var(--accent-text))]">$0.25</span> per image</span>
              </div>
            </motion.div>
          </div>

          {/* Right column - scrolls down */}
          <div className="hidden lg:block shrink-0">
            <MarqueeColumn items={rightItems} direction="down" />
          </div>
        </div>
      </div>
    </section>
  );
}
