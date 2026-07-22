"use client";
import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function Cursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  const ringX = useSpring(0, { damping: 25, stiffness: 150, mass: 0.6 });
  const ringY = useSpring(0, { damping: 25, stiffness: 150, mass: 0.6 });

  useEffect(() => {
    if (typeof window !== "undefined" && "ontouchstart" in window) return;
    setIsTouch(false);
    const moveMouse = (e: MouseEvent) => {
      ringX.set(e.clientX - 18);
      ringY.set(e.clientY - 18);
    };
    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest("a, button, [role='button'], img, video"));
    };
    window.addEventListener("mousemove", moveMouse, { passive: true });
    window.addEventListener("mouseover", handleHover, { passive: true });
    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mouseover", handleHover);
    };
  }, [ringX, ringY]);

  if (isTouch) return null;

  return (
    <>
      <motion.div
        style={{ translateX: ringX, translateY: ringY }}
        animate={{
          scale: isHovering ? 1.6 : 1,
          backgroundColor: isHovering ? "rgb(var(--accent-500) / 20%)" : "transparent",
          borderColor: isHovering ? "rgb(var(--accent-500) / 60%)" : "rgb(var(--accent-500) / 40%)",
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 w-9 h-9 rounded-full pointer-events-none z-[9999] hidden md:block border border-[rgb(var(--accent-500)/40%)]"
      />
      <motion.div
        animate={{
          scale: isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? "rgb(var(--accent-500) / 80%)" : "rgb(var(--accent-500))",
        }}
        transition={{ duration: 0.3 }}
        className="fixed pointer-events-none z-[9999] hidden md:block w-[3px] h-[3px] rounded-full bg-[rgb(var(--accent-500))]"
        style={{
          translateX: ringX,
          translateY: ringY,
          marginLeft: "16.5px",
          marginTop: "16.5px",
        }}
      />
    </>
  );
}
