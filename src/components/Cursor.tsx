"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useSpring } from "framer-motion";

export default function Cursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(true);
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });

  const ringX = useSpring(0, { damping: 20, stiffness: 120, mass: 0.8 });
  const ringY = useSpring(0, { damping: 20, stiffness: 120, mass: 0.8 });

  useEffect(() => {
    if (typeof window !== "undefined" && "ontouchstart" in window) return;
    setIsTouch(false);
    const moveMouse = (e: MouseEvent) => {
      setDotPos({ x: e.clientX, y: e.clientY });
      ringX.set(e.clientX - 18);
      ringY.set(e.clientY - 18);
    };
    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest("a, button, [role='button'], img, video, select, input"));
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
          scale: isHovering ? 1.8 : 1,
          backgroundColor: isHovering ? "rgb(var(--accent-500) / 20%)" : "transparent",
          borderColor: isHovering ? "rgb(var(--accent-500) / 70%)" : "rgb(var(--accent-500) / 40%)",
        }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 w-9 h-9 rounded-full pointer-events-none z-[9999] hidden md:block border border-[rgb(var(--accent-500)/40%)]"
      />
      <div
        className="fixed pointer-events-none z-[9999] hidden md:block w-[4px] h-[4px] rounded-full bg-[rgb(var(--accent-500))]"
        style={{
          left: dotPos.x - 2,
          top: dotPos.y - 2,
          transition: "none",
        }}
      />
    </>
  );
}
