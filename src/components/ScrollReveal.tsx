"use client";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  scale?: number;
  duration?: number;
  perspective?: boolean;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 70,
  scale = 0.92,
  duration = 0.9,
  perspective = true,
}: Props) {
  const getTransform = () => {
    const offset: Record<string, { x?: number; y?: number }> = {
      up: { y: distance },
      down: { y: -distance },
      left: { x: distance },
      right: { x: -distance },
      none: {},
    };
    return {
      ...offset[direction],
      scale,
      rotateX: direction === "up" ? 10 : direction === "down" ? -10 : 0,
      rotateY: direction === "left" ? 5 : direction === "right" ? -5 : 0,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getTransform() }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      style={perspective ? { perspective: "1000px" } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
