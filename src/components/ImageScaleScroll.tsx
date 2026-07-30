"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ImageScaleScrollProps {
  children: ReactNode;
  className?: string;
  scaleFrom?: number;
  scaleTo?: number;
}

export default function ImageScaleScroll({
  children,
  className = "",
  scaleFrom = 0.85,
  scaleTo = 1,
}: ImageScaleScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [scaleFrom, scaleTo, scaleFrom]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6]);

  return (
    <motion.div ref={ref} style={{ scale, opacity }} className={`overflow-hidden ${className}`}>
      {children}
    </motion.div>
  );
}

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxSection({ children, className = "", speed = 0.15 }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * -200, speed * 200]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
}

export function RevealOnScroll({ children, className = "", direction = "up", delay = 0 }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.6"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const offset = useTransform(scrollYProgress, [0, 1], [60, 0]);

  const directionMap = {
    up: { y: offset },
    down: { y: useTransform(scrollYProgress, [0, 1], [-60, 0]) },
    left: { x: offset },
    right: { x: useTransform(scrollYProgress, [0, 1], [-60, 0]) },
  };

  return (
    <motion.div
      ref={ref}
      style={{ opacity, ...directionMap[direction] }}
      className={className}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
