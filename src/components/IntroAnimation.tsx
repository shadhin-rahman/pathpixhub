"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function IntroAnimation() {
  const [phase, setPhase] = useState<"enter" | "exit" | "done">("enter");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("pph-intro-seen");

    if (reduce || seen) {
      queueMicrotask(() => setPhase("done"));
      return;
    }

    document.body.style.overflow = "hidden";
    const t1 = setTimeout(() => setPhase("exit"), 1500);
    const t2 = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
      sessionStorage.setItem("pph-intro-seen", "1");
    }, 2300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  const exiting = phase === "exit";

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-opacity duration-700 ${
        exiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 w-1/2 bg-[var(--bg)] transition-transform duration-[900ms] ease-[cubic-bezier(.76,0,.24,1)] ${
            exiting ? "-translate-x-full" : "translate-x-0"
          }`}
        />
        <div
          className={`absolute inset-y-0 right-0 w-1/2 bg-[var(--bg)] transition-transform duration-[900ms] ease-[cubic-bezier(.76,0,.24,1)] ${
            exiting ? "translate-x-full" : "translate-x-0"
          }`}
        />
      </div>

      <div
        className={`relative flex flex-col items-center gap-5 transition-all duration-500 ${
          exiting ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="relative w-14 h-14 rounded-full glass-card flex items-center justify-center overflow-hidden">
          <Image
            src="/images/logo-icon.png"
            alt="PathPixHub"
            width={36}
            height={36}
            className="w-8 h-8 md:w-9 md:h-9 object-contain [filter:var(--logo-filter)]"
            style={{ animation: "intro-pop 0.7s ease both" }}
          />
        </div>
        <div className="overflow-hidden">
          <p
            className="text-sm md:text-base font-bold tracking-wider text-[rgb(var(--fg-rgb)/80%)]"
            style={{ animation: "intro-rise 0.6s ease 0.25s both" }}
          >
            PathPixHub
          </p>
        </div>
        <div className="w-40 h-[2px] rounded-full bg-[rgb(var(--fg-rgb)/10%)] overflow-hidden">
          <div
            className="h-full bg-[rgb(var(--accent-500))]"
            style={{ animation: "intro-loader 1.4s ease forwards" }}
          />
        </div>
      </div>
    </div>
  );
}