"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useSpring } from "framer-motion";

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

function subscribeToFinePointer(onStoreChange: () => void) {
  const mql = window.matchMedia(FINE_POINTER_QUERY);
  mql.addEventListener("change", onStoreChange);
  return () => mql.removeEventListener("change", onStoreChange);
}

function getFinePointerSnapshot() {
  return window.matchMedia(FINE_POINTER_QUERY).matches;
}

export default function Cursor() {
  const enabled = useSyncExternalStore(
    subscribeToFinePointer,
    getFinePointerSnapshot,
    () => false
  );
  const [isHovering, setIsHovering] = useState(false);
  const [dotPos, setDotPos] = useState({ x: -100, y: -100 });

  const ringX = useSpring(0, { damping: 15, stiffness: 80, mass: 1.2 });
  const ringY = useSpring(0, { damping: 15, stiffness: 80, mass: 1.2 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor-active");

    const moveMouse = (e: MouseEvent) => {
      setDotPos({ x: e.clientX, y: e.clientY });
      ringX.set(e.clientX - 20);
      ringY.set(e.clientY - 20);
    };
    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest("a, button, [role='button'], img, video, select, input, label, textarea"));
    };

    window.addEventListener("mousemove", moveMouse, { passive: true });
    window.addEventListener("mouseover", handleHover, { passive: true });
    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mouseover", handleHover);
    };
  }, [enabled, ringX, ringY]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        style={{ translateX: ringX, translateY: ringY }}
        animate={{
          scale: isHovering ? 1.8 : 1,
          backgroundColor: isHovering ? "rgb(var(--accent-500) / 18%)" : "transparent",
          borderColor: isHovering ? "rgb(var(--accent-500) / 70%)" : "rgb(var(--accent-500) / 40%)",
        }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999] hidden md:block border-2 border-[rgb(var(--accent-500)/40%)]"
      />
      <div
        className="fixed pointer-events-none z-[9999] hidden md:block"
        style={{ left: dotPos.x - 4, top: dotPos.y - 4 }}
      >
        <div className="w-2 h-2 rounded-full bg-[rgb(var(--accent-500))] shadow-[0_0_8px_rgb(var(--accent-500)/60%)]" />
      </div>
    </>
  );
}