"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface CinematicServiceProps {
  services: {
    id: string;
    title: string;
    tagline: string;
  }[];
}

const showcaseImages = [
  { id: "clipping-path", src: "/images/service-showcase/clipping-path-cover.jpg" },
  { id: "background-removal", src: "/images/service-showcase/background-removal-cover.jpg" },
  { id: "photo-retouching", src: "/images/service-showcase/photo-retouching-cover.jpg" },
  { id: "multi-clipping-path", src: "/images/service-showcase/multi-clipping-path-cover.jpg" },
  { id: "color-change", src: "/images/service-showcase/color-change-cover.jpg" },
  { id: "car-editing", src: "/images/service-showcase/car-editing-cover.jpg" },
  { id: "ghost-mannequin", src: "/images/service-showcase/ghost-mannequin-cover.jpg" },
  { id: "image-masking", src: "/images/service-showcase/image-masking-cover.jpg" },
  { id: "shadow-creation", src: "/images/service-showcase/shadow-creation-cover.jpg" },
  { id: "ecommerce-editing", src: "/images/service-showcase/ecommerce-editing-cover.jpg" },
];

export default function CinematicShowcase({ services }: CinematicServiceProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const CARD_COUNT = showcaseImages.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const trackX = useTransform(scrollYProgress, [0, 1], ["0%", `-${(CARD_COUNT - 1) * 75}%`]);

  return (
    <section ref={sectionRef} className="relative" style={{ height: `${CARD_COUNT * 70}vh` }}>
      <div className="sticky top-0 h-screen flex flex-col">
        {/* Header */}
        <div className="px-6 md:px-12 pt-10 md:pt-14 pb-4">
          <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-3">What We Offer</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight gradient-text">Our Services</h3>
        </div>

        {/* Frame */}
        <div className="flex-1 mx-4 md:mx-8 mb-8 rounded-2xl md:rounded-3xl overflow-hidden border border-[rgb(var(--fg-rgb)/8%)] bg-[rgb(var(--accent-500)/3%)] relative" style={{ perspective: "1200px" }}>
          {/* Horizontal track */}
          <motion.div style={{ x: trackX }} className="flex h-full">
            {showcaseImages.map((item, idx) => {
              const service = services.find(s => s.id === item.id) || services[idx];
              return (
                <ServiceSlide
                  key={item.id}
                  item={item}
                  service={service}
                  index={idx}
                  scrollProgress={scrollYProgress}
                  totalCards={CARD_COUNT}
                />
              );
            })}
          </motion.div>

          {/* Progress dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {Array.from({ length: CARD_COUNT }, (_, idx) => (
              <Dot key={idx} index={idx} scrollProgress={scrollProgress} totalCards={CARD_COUNT} />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-5 right-6 md:top-7 md:right-8 z-10">
            <Counter scrollProgress={scrollProgress} totalCards={CARD_COUNT} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceSlide({
  item,
  service,
  index,
  scrollProgress,
  totalCards,
}: {
  item: { id: string; src: string };
  service: { id: string; title: string; tagline: string };
  index: number;
  scrollProgress: MotionValue<number>;
  totalCards: number;
}) {
  const cardStart = index / totalCards;
  const cardCenter = (index + 0.5) / totalCards;
  const cardEnd = (index + 1) / totalCards;

  const cardScale = useTransform(scrollProgress, [cardStart, cardCenter, cardEnd], [0.85, 1, 0.85]);
  const cardRotateY = useTransform(scrollProgress, [cardStart, cardCenter, cardEnd], [index === 0 ? 0 : 8, 0, index === totalCards - 1 ? 0 : -8]);
  const cardOpacity = useTransform(scrollProgress, [cardStart - 0.05, cardStart + 0.02, cardEnd - 0.02, cardEnd + 0.05], [0.3, 1, 1, 0.3]);
  const textX = useTransform(scrollProgress, [cardStart, cardCenter, cardEnd], [40, 0, -40]);
  const textOpacity = useTransform(scrollProgress, [cardStart + 0.02, cardCenter - 0.05, cardCenter + 0.05, cardEnd - 0.02], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ scale: cardScale, rotateY: cardRotateY, opacity: cardOpacity, minWidth: "75vw" }}
      className="h-full px-3 md:px-5 flex items-center shrink-0"
    >
      <Link href={`/services/${service.id}`} className="block w-full h-[85%] relative rounded-xl md:rounded-2xl overflow-hidden group">
        <Image
          src={item.src}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
          sizes="75vw"
          priority={index < 2}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <motion.div style={{ x: textX, opacity: textOpacity }} className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <span className="text-[10px] md:text-xs font-bold text-[rgb(var(--accent-400))] uppercase tracking-[0.3em]">
            Service {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-2 text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.05] tracking-tight">
            {service.title}
          </h3>
          <p className="mt-2 md:mt-3 text-sm md:text-base text-white/60 leading-relaxed max-w-lg">
            {service.tagline}
          </p>
          <div className="mt-4 md:mt-5 inline-flex items-center gap-2 text-sm font-bold text-[rgb(var(--accent-400))] group-hover:gap-3 transition-all duration-300">
            View Service
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function Dot({
  index,
  scrollProgress,
  totalCards,
}: {
  index: number;
  scrollProgress: MotionValue<number>;
  totalCards: number;
}) {
  const start = index / totalCards;
  const end = (index + 1) / totalCards;
  const opacity = useTransform(scrollProgress, [start - 0.05, start, end - 0.05, end], [0.2, 1, 1, 0.2]);
  return <motion.div style={{ opacity }} className="w-2 h-2 rounded-full bg-[rgb(var(--accent-400))]" />;
}

function Counter({
  scrollProgress,
  totalCards,
}: {
  scrollProgress: MotionValue<number>;
  totalCards: number;
}) {
  return (
    <div className="relative w-16 h-8">
      {Array.from({ length: totalCards }, (_, i) => (
        <CounterItem key={i} index={i} scrollProgress={scrollProgress} totalCards={totalCards} />
      ))}
    </div>
  );
}

function CounterItem({
  index,
  scrollProgress,
  totalCards,
}: {
  index: number;
  scrollProgress: MotionValue<number>;
  totalCards: number;
}) {
  const start = index / totalCards;
  const end = (index + 1) / totalCards;
  const opacity = useTransform(scrollProgress, [start - 0.05, start, end - 0.05, end], [0, 1, 1, 0]);
  return (
    <motion.span
      style={{ opacity }}
      className="absolute inset-0 flex items-center justify-center text-sm font-mono font-bold text-white/70"
    >
      {String(index + 1).padStart(2, "0")} / {String(totalCards).padStart(2, "0")}
    </motion.span>
  );
}
