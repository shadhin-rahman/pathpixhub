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
    <section className="py-20 bg-[var(--bg)]">
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

      <div className="space-y-6 md:space-y-8 px-4 md:px-8">
        {showcaseImages.map((item, idx) => {
          const service = services.find(s => s.id === item.id) || services[idx];
          return <ServiceCard key={item.id} item={item} service={service} index={idx} />;
        })}
      </div>
    </section>
  );
}

function ServiceCard({
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

  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 1, 1, 0.4]);

  return (
    <div ref={ref} className="w-full rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[16/7]">
      <motion.div style={{ scale, opacity }} className="relative w-full h-full">
        <Link href={`/services/${service.id}`} className="block w-full h-full group">
          <motion.div style={{ y }} className="absolute inset-0">
            <Image
              src={item.src}
              alt={service.title}
              fill
              className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 90vw"
              priority={index < 2}
            />
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10 lg:p-14">
            <span className="text-[10px] md:text-xs font-bold text-[rgb(var(--accent-400))] uppercase tracking-[0.3em]">
              Service {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-1 md:mt-2 text-lg md:text-4xl lg:text-6xl font-bold text-white leading-tight md:leading-[0.95] tracking-tight">
              {service.title}
            </h3>
            <p className="mt-1 md:mt-4 text-xs md:text-base text-white/60 max-w-lg leading-snug md:leading-relaxed">
              {service.tagline}
            </p>
            <div className="mt-2 md:mt-6 inline-flex items-center gap-1 md:gap-2 text-xs md:text-sm font-bold text-[rgb(var(--accent-400))] group-hover:gap-3 transition-all duration-300">
              View Service
              <svg className="w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
