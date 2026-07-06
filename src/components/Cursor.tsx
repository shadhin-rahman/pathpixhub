"use client";
import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function Cursor() {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useSpring(0, { damping: 25, stiffness: 200 });
  const cursorY = useSpring(0, { damping: 25, stiffness: 200 });

  useEffect(() => {
    if (typeof window !== "undefined" && "ontouchstart" in window) return;
    const moveMouse = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest("a, button, [role='button']"));
    };
    window.addEventListener("mousemove", moveMouse, { passive: true });
    window.addEventListener("mouseover", handleHover, { passive: true });
    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mouseover", handleHover);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{ translateX: cursorX, translateY: cursorY }}
      animate={{
        scale: isHovering ? 2 : 1,
        backgroundColor: isHovering ? "rgb(var(--accent-500) / 30%)" : "rgb(var(--accent-500) / 15%)",
        border: isHovering ? "1px solid rgb(var(--accent-500) / 50%)" : "1px solid rgb(var(--accent-500) / 30%)",
      }}
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] hidden md:block backdrop-blur-[2px]"
    />
  );
}
