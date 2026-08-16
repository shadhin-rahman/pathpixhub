"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

interface Props {
  end: number;
  suffix?: string;
  label: string;
  decimals?: number;
}

export default function CountUp({ end, suffix = "", label, decimals = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, end, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (val) => setCount(val.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [isInView, end, decimals]);

  return (
    <div ref={ref} className="glass-card rounded-xl p-5">
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-bold text-[rgb(var(--accent-text))]"
      >
        {count}{suffix}
      </motion.span>
      <p className="mt-1 text-sm text-[rgb(var(--fg-rgb)/40%)]">{label}</p>
    </div>
  );
}
