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
  distance = 50,
  scale = 0.95,
  duration = 0.8,
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
    return { ...offset[direction], scale, rotateX: direction === "up" ? 8 : 0 };
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getTransform() }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      style={perspective ? { perspective: "1200px" } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
