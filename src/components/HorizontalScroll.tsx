"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

export default function HorizontalScroll({ children, className = "" }: HorizontalScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <motion.div ref={ref} style={{ x }} className={className}>
      {children}
    </motion.div>
  );
}

interface ScrollProgressBarProps {
  className?: string;
}

export function ScrollProgressBar({ className = "" }: ScrollProgressBarProps) {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[rgb(var(--accent-500))] via-[rgb(var(--accent-400))] to-[rgb(var(--accent-300))] origin-left z-[9999] ${className}`}
      style={{ scaleX: scrollYProgress }}
    />
  );
}

interface FadeInStaggerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function FadeInStagger({ children, className = "", staggerDelay = 0.08 }: FadeInStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15%" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export const fadeInChild = {
  hidden: { opacity: 0, y: 50, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};
