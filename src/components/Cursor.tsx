"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useSpring } from "framer-motion";

type CursorState = "default" | "hover" | "zoom" | "drag";

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
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
  const [state, setState] = useState<CursorState>("default");
  const [dotPos, setDotPos] = useState({ x: -100, y: -100 });

  const ringX = useSpring(0, { damping: 15, stiffness: 80, mass: 1.2 });
  const ringY = useSpring(0, { damping: 15, stiffness: 80, mass: 1.2 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor-active");

    const moveMouse = (e: MouseEvent) => {
      setDotPos({ x: e.clientX, y: e.clientY });
      ringX.set(e.clientX - 40);
      ringY.set(e.clientY - 40);
    };
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorEl = target.closest("[data-cursor]");
      if (cursorEl) {
        const mode = cursorEl.getAttribute("data-cursor");
        if (mode === "zoom") setState("zoom");
        else if (mode === "drag") setState("drag");
        else setState("hover");
        return;
      }
      if (target.closest("a, button, [role='button'], select, input, label, textarea, [contenteditable='true']")) {
        setState("hover");
        return;
      }
      setState("default");
    };

    window.addEventListener("mousemove", moveMouse, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });
    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mouseover", handleOver);
    };
  }, [enabled, ringX, ringY]);

  if (!enabled) return null;

  const filled = state === "zoom" || state === "drag";
  const ringScale = state === "default" ? 1 : state === "hover" ? 1.35 : 1.9;

  return (
    <>
      <motion.div
        style={{ translateX: ringX, translateY: ringY }}
        className="fixed top-0 left-0 w-20 h-20 pointer-events-none z-[9999] hidden md:block"
      >
        <motion.div
          animate={{
            scale: ringScale,
            backgroundColor: filled
              ? "rgb(var(--accent-500))"
              : "rgb(var(--accent-500) / 12%)",
            borderColor: filled
              ? "rgb(var(--accent-500))"
              : "rgb(var(--accent-500) / 40%)",
          }}
          transition={{ duration: 0.35, ease: EASE }}
          className="absolute inset-0 m-auto w-11 h-11 rounded-full border-2"
        />
        <motion.div
          animate={{ opacity: filled ? 1 : 0, scale: filled ? 1 : 0.5 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {state === "drag" ? (
            <div className="flex items-center gap-1 text-[rgb(var(--accent-contrast))]">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-[11px] font-bold tracking-widest uppercase leading-none">Drag</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ) : (
            <div className="flex flex-col items-center text-[rgb(var(--accent-contrast))]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
              <span className="mt-0.5 text-[11px] font-bold tracking-widest uppercase leading-none">View</span>
            </div>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
        style={{ left: dotPos.x, top: dotPos.y, x: -4, y: -4 }}
        animate={{ scale: filled ? 0 : 1, opacity: filled ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-2 h-2 rounded-full bg-[rgb(var(--accent-500))] shadow-[0_0_8px_rgb(var(--accent-500)/60%)]" />
      </motion.div>
    </>
  );
}