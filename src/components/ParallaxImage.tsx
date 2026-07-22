"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  scale?: [number, number];
  fill?: boolean;
  sizes?: string;
}

export default function ParallaxImage({
  src,
  alt,
  className = "",
  speed = 0.2,
  scale: scaleRange = [1, 1.1],
  fill = true,
  sizes,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);
  const s = useTransform(scrollYProgress, [0, 1], scaleRange);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, scale: s }} className="w-full h-full">
        {fill ? (
          <Image src={src} alt={alt} fill className="object-cover" sizes={sizes || "100vw"} />
        ) : (
          <Image src={src} alt={alt} width={800} height={600} className="w-full h-auto object-contain" />
        )}
      </motion.div>
    </div>
  );
}
