"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface TextRevealProps {
  children: ReactNode;
  className?: string;
}

export default function TextReveal({ children, className = "" }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.35"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

  return (
    <motion.div ref={ref} style={{ opacity, y, scale }} className={className}>
      {children}
    </motion.div>
  );
}

interface WordRevealProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
}

export function WordReveal({ text, className = "", as: Tag = "h2", delay = 0 }: WordRevealProps) {
  const words = text.split(" ");

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <Word key={i} word={word} index={i} total={words.length} delay={delay} />
      ))}
    </Tag>
  );
}

function Word({ word, index, total, delay }: { word: string; index: number; total: number; delay: number }) {
  return (
    <motion.span
      className="inline-block mr-[0.25em]"
      initial={{ opacity: 0.1, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.5,
        delay: delay + index * 0.04,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {word}
    </motion.span>
  );
}

interface ParallaxTextProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxText({ children, className = "", speed = 0.3 }: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
