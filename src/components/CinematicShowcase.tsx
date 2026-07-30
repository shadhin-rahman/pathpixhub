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
  return (
    <section className="py-20 lg:py-28 bg-[var(--bg)]">
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

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-10 md:space-y-16">
        {showcaseImages.map((item, idx) => {
          const service = services.find(s => s.id === item.id) || services[idx];
          const isEven = idx % 2 === 0;
          return (
            <CinematicCard key={item.id} item={item} service={service} index={idx} isEven={isEven} />
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
  isEven,
}: {
  item: { id: string; src: string };
  service: { id: string; title: string; tagline: string };
  index: number;
  isEven: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <Link href={`/services/${service.id}`}>
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden" style={{ aspectRatio: "16 / 7" }}>

          {/* Full background image */}
          <motion.div style={{ y }} className="absolute inset-0">
            <Image
              src={item.src}
              alt={service.title}
              fill
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority={index < 2}
            />
          </motion.div>

          {/* Gradient overlay - always visible on left side for text readability */}
          <div className={`absolute inset-0 bg-gradient-to-${isEven ? "r" : "l"} from-black/70 via-black/30 to-transparent`} />

          {/* Text content - positioned to side normally, slides over image on hover */}
          <div className={`absolute inset-0 flex items-end md:items-center p-6 md:p-10 lg:p-14`}>
            <motion.div
              initial={{ opacity: 0, x: isEven ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`max-w-md transition-transform duration-500 ease-out
                ${isEven
                  ? "md:group-hover:translate-x-[calc(100%-100%+2rem)]"
                  : "md:group-hover:-translate-x-[calc(100%-100%-2rem)]"
                }`}
            >
              <span className="text-[10px] md:text-xs font-bold text-[rgb(var(--accent-400))] uppercase tracking-[0.3em]">
                Service {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.05] tracking-tight">
                {service.title}
              </h3>
              <p className="mt-3 md:mt-4 text-sm md:text-base text-white/60 leading-relaxed">
                {service.tagline}
              </p>
              <div className="mt-5 md:mt-6 inline-flex items-center gap-2 text-sm font-bold text-[rgb(var(--accent-400))] group-hover:gap-3 transition-all duration-300">
                View Service
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Corner arrow indicator */}
          <div className={`absolute top-5 ${isEven ? "right-5 md:right-7" : "left-5 md:left-7"} md:top-7`}>
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm bg-white/5 group-hover:bg-[rgb(var(--accent-500))]/20 group-hover:border-[rgb(var(--accent-500))]/40 transition-all duration-500">
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
