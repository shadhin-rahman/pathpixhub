"use client";
import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface Props {
  src?: string;
  alt?: string;
  children?: ReactNode;
  className?: string;
  speed?: number;
  scale?: [number, number];
  fill?: boolean;
  sizes?: string;
}

export default function ParallaxImage({
  src,
  alt,
  children,
  className = "",
  speed = 0.3,
  scale: scaleRange = [1, 1.15],
  fill = true,
  sizes,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * 120, speed * -120]);
  const s = useTransform(scrollYProgress, [0, 1], scaleRange);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, scale: s }} className="w-full h-full">
        {children || (src && alt ? (
          fill ? (
            <Image src={src} alt={alt} fill className="object-cover" sizes={sizes || "100vw"} />
          ) : (
            <Image src={src} alt={alt} width={800} height={600} className="w-full h-auto object-contain" />
          )
        ) : null)}
      </motion.div>
    </div>
  );
}
