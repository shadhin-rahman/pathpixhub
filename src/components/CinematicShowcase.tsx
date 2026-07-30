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

const CARD_COUNT = showcaseImages.length;

export default function CinematicShowcase({ services }: CinematicServiceProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const trackX = useTransform(scrollYProgress, [0, 1], ["0%", `${-(CARD_COUNT - 1) * 85}%`]);
  const frameRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [2, 0, -2]);
  const frameRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-3, 0, 3]);

  return (
    <section ref={sectionRef} className="relative" style={{ height: `${CARD_COUNT * 80}vh` }}>
      <div className="sticky top-0 h-screen flex flex-col">
        <div className="px-6 md:px-12 pt-8 md:pt-10 pb-3">
          <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-2">What We Offer</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight gradient-text">Our Services</h3>
        </div>

        <motion.div
          className="flex-1 mx-4 md:mx-8 mb-6 rounded-2xl md:rounded-3xl overflow-hidden border border-[rgb(var(--fg-rgb)/8%)] bg-[rgb(var(--accent-500)/3%)] relative"
          style={{ perspective: 1200, rotateX: frameRotateX, rotateY: frameRotateY }}
        >
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
                />
              );
            })}
          </motion.div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {Array.from({ length: CARD_COUNT }, (_, idx) => (
              <Dot key={idx} index={idx} scrollProgress={scrollYProgress} />
            ))}
          </div>

          <div className="absolute top-4 right-5 md:top-5 md:right-6 z-10">
            <Counter scrollProgress={scrollYProgress} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceSlide({
  item,
  service,
  index,
  scrollProgress,
}: {
  item: { id: string; src: string };
  service: { id: string; title: string; tagline: string };
  index: number;
  scrollProgress: MotionValue<number>;
}) {
  const s = index / CARD_COUNT;
  const c = (index + 0.5) / CARD_COUNT;
  const e = (index + 1) / CARD_COUNT;

  const isEven = index % 2 === 0;

  const scale = useTransform(scrollProgress, [s, c, e], [0.7, 1, 0.7]);
  const rotateY = useTransform(scrollProgress, [s, c, e], [isEven ? 15 : -15, 0, isEven ? -15 : 15]);
  const rotateX = useTransform(scrollProgress, [s, c, e], [isEven ? 0 : 8, 0, isEven ? 0 : -8]);
  const zTrans = useTransform(scrollProgress, [s, c, e], [-250, 0, -250]);
  const opacity = useTransform(scrollProgress, [s, e], [0.2, 0.2]);

  const imgScale = useTransform(scrollProgress, [s, c, e], [1.15, 1, 1.15]);
  const titleY = useTransform(scrollProgress, [s, c, e], [isEven ? 50 : -50, 0, isEven ? -50 : 50]);
  const descY = useTransform(scrollProgress, [s, c, e], [isEven ? -40 : 40, 0, isEven ? 40 : -40]);
  const contentOpa = useTransform(scrollProgress, [s + 0.02, c, e - 0.02], [0, 1, 0]);

  const numberZ = useTransform(scrollProgress, [s, c, e], [80, 0, 80]);

  return (
    <motion.div
      style={{ scale, rotateY, rotateX, z: zTrans, opacity, minWidth: "85vw" }}
      className="h-full px-3 md:px-5 flex items-center shrink-0"
    >
      <Link
        href={`/services/${service.id}`}
        className="block w-full h-[85%] relative overflow-hidden group"
        style={{ borderRadius: "clamp(12px, 2vw, 16px)", perspective: 800 }}
      >
        {/* Floating number */}
        <motion.span
          style={{ z: numberZ }}
          className="absolute top-4 right-4 md:top-6 md:right-6 text-[80px] md:text-[120px] font-bold text-white/5 select-none pointer-events-none leading-none"
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>

        {/* Image */}
        <motion.div style={{ scale: imgScale }} className="absolute inset-0">
          <Image
            src={item.src}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
            sizes="85vw"
            priority={index < 2}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 lg:p-10">
          <motion.div style={{ y: titleY, opacity: contentOpa }}>
            <span className="text-[10px] md:text-xs font-bold text-[rgb(var(--accent-400))] uppercase tracking-[0.3em]">
              Service {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.05] tracking-tight">
              {service.title}
            </h3>
          </motion.div>
          <motion.div style={{ y: descY, opacity: contentOpa }}>
            <p className="mt-2 md:mt-3 text-sm md:text-base text-white/60 leading-relaxed max-w-md">
              {service.tagline}
            </p>
            <div className="mt-4 md:mt-5 inline-flex items-center gap-2 text-sm font-bold text-[rgb(var(--accent-400))] group-hover:gap-3 transition-all duration-300">
              View Service
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

function Dot({ index, scrollProgress }: { index: number; scrollProgress: MotionValue<number> }) {
  const s = index / CARD_COUNT;
  const e = (index + 1) / CARD_COUNT;
  const mid = (s + e) / 2;
  const opacity = useTransform(scrollProgress, [s, mid, e], [0.15, 1, 0.15]);
  const scale = useTransform(scrollProgress, [s, mid, e], [0.6, 1.3, 0.6]);
  return <motion.div style={{ opacity, scale }} className="w-2 h-2 rounded-full bg-[rgb(var(--accent-400))]" />;
}

function Counter({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  return (
    <div className="relative w-16 h-8">
      {Array.from({ length: CARD_COUNT }, (_, i) => (
        <CounterItem key={i} index={i} scrollProgress={scrollProgress} />
      ))}
    </div>
  );
}

function CounterItem({ index, scrollProgress }: { index: number; scrollProgress: MotionValue<number> }) {
  const s = index / CARD_COUNT;
  const e = (index + 1) / CARD_COUNT;
  const mid = (s + e) / 2;
  const opacity = useTransform(scrollProgress, [s, mid, e], [0, 1, 0]);
  const y = useTransform(scrollProgress, [s, mid, e], [10, 0, -10]);
  return (
    <motion.span
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center justify-center text-sm font-mono font-bold text-white/70"
    >
      {String(index + 1).padStart(2, "0")} / {String(CARD_COUNT).padStart(2, "0")}
    </motion.span>
  );
}
