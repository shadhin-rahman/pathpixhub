"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

interface CinematicServiceProps {
  services: {
    id: string;
    title: string;
    tagline: string;
  }[];
}

export default function CinematicShowcase({ services }: CinematicServiceProps) {
  const showcaseImages = [
    { id: "clipping-path", src: "/images/hero-slider/bicycle.jpg" },
    { id: "background-removal", src: "/images/hero-slider/car-editing-1.jpg" },
    { id: "photo-retouching", src: "/images/hero-slider/ecommerce-product.jpg" },
    { id: "color-change", src: "/images/hero-slider/Beauty retouching.jpg" },
    { id: "car-editing", src: "/images/hero-slider/Skin Retouch.jpg" },
    { id: "ghost-mannequin", src: "/images/hero-slider/background.jpg" },
  ];

  return (
    <section className="py-16 lg:py-24 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">What We Offer</h2>
          <h3 className="text-5xl md:text-7xl font-bold tracking-tight gradient-text">Our Services</h3>
        </motion.div>
      </div>

      <div className="space-y-6 md:space-y-10 px-3 md:px-6">
        {showcaseImages.map((item, idx) => {
          const service = services.find(s => s.id === item.id) || services[idx];
          return (
            <CinematicCard key={item.id} item={item} service={service} index={idx} />
          );
        })}
      </div>
    </section>
  );
}

function CinematicCard({
  item,
  service,
  index,
}: {
  item: { id: string; src: string };
  service: { id: string; title: string; tagline: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 1, 1, 0.4]);
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className="group relative"
    >
      <Link href={`/services/${service.id}`}>
        <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl" style={{ height: "clamp(300px, 60vw, 700px)" }}>
          <motion.div style={{ y }} className="absolute inset-0">
            <Image
              src={item.src}
              alt={service.title}
              fill
              className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              sizes="100vw"
              priority={index < 2}
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className={`absolute bottom-0 ${isEven ? "left-0" : "right-0"} p-6 md:p-12 max-w-2xl`}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p className="text-[10px] md:text-xs font-bold text-[rgb(var(--accent-400))] uppercase tracking-[0.3em] mb-3">
                Service {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[0.95] tracking-tight">
                {service.title}
              </h3>
              <p className="mt-3 md:mt-4 text-sm md:text-base text-white/60 max-w-md leading-relaxed">
                {service.tagline}
              </p>
              <div className="mt-5 md:mt-6 inline-flex items-center gap-2 text-sm font-bold text-[rgb(var(--accent-400))] group-hover:gap-3 transition-all duration-300">
                Explore Service
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </motion.div>
          </div>

          <div className={isEven ? "absolute top-6 right-6 md:top-12 md:right-12" : "absolute top-6 left-6 md:top-12 md:left-12"}>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm bg-white/5 group-hover:bg-[rgb(var(--accent-500))]/20 group-hover:border-[rgb(var(--accent-500))]/40 transition-all duration-500">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white/60 group-hover:text-[rgb(var(--accent-400))] transition-colors duration-500 -rotate-45 group-hover:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
