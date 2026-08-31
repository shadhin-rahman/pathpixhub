"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

// 5 portraits shown side-by-side first, like a row of frames. The last one
// (index 4) then grows out of its slot in the row to fill the whole screen,
// and keeps zooming until it converges on the eye.
const FRAMES = [
  { src: "/images/gallery/gallery-1.jpg", alt: "Beauty retouching — portrait 1", objectPosition: "center 30%" },
  { src: "/images/gallery/gallery-2.jpg", alt: "Beauty retouching — portrait 2", objectPosition: "center 25%" },
  { src: "/images/gallery/gallery-3.jpg", alt: "Beauty retouching — portrait 3", objectPosition: "40% 25%" },
  { src: "/images/gallery/gallery-4.jpg", alt: "Beauty retouching — portrait 4", objectPosition: "center 15%" },
  { src: "/images/gallery/gallery-5.jpg", alt: "Beauty retouching — portrait 5", objectPosition: "center 20%" },
] as const;

// Where the visible iris sits in gallery-5.jpg, as a % of the image itself —
// used as the transform-origin once the image fills the screen, so the zoom
// converges on the eye instead of the image center.
const EYE_ORIGIN = "33% 18%";
const NEXT_PAGE = "/portfolio";

// Row geometry — 5 equal edge-to-edge columns with small gaps.
const COL_GAP = 1.25; // vw
const COL_WIDTH = (100 - COL_GAP * 4) / 5; // vw
const ROW_TOP = 14; // vh
const ROW_HEIGHT = 72; // vh
const lastSlotLeft = 4 * (COL_WIDTH + COL_GAP); // vw

export default function EyeZoomGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const hasNavigated = useRef(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Stage boundaries across the whole pinned scroll range
  const ROW_END = 0.15; // row sits still, fully visible
  const EXPAND_END = 0.45; // last image grows to fill the screen
  const HOLD_END = 0.55; // brief pause at full screen
  const ZOOM_END = 0.88; // deep zoom into the eye
  // 0.88 - 1: flash + navigate

  // Row (frames 1–4) and heading fade out during the expand stage
  const rowOpacity = useTransform(scrollYProgress, [ROW_END, EXPAND_END * 0.8], [1, 0]);
  const heading1Opacity = useTransform(scrollYProgress, [0, 0.04, ROW_END], [0, 1, 1]);
  const heading1FadeOut = useTransform(scrollYProgress, [ROW_END, EXPAND_END * 0.6], [1, 0]);
  const heading1Combined = useTransform([heading1Opacity, heading1FadeOut], (values: number[]) => values[0] * values[1]);

  // The last frame's "box" animates from its row slot to full screen
  const boxLeft = useTransform(scrollYProgress, [ROW_END, EXPAND_END], [lastSlotLeft, 0]);
  const boxWidth = useTransform(scrollYProgress, [ROW_END, EXPAND_END], [COL_WIDTH, 100]);
  const boxTop = useTransform(scrollYProgress, [ROW_END, EXPAND_END], [ROW_TOP, 0]);
  const boxHeight = useTransform(scrollYProgress, [ROW_END, EXPAND_END], [ROW_HEIGHT, 100]);
  const boxRadius = useTransform(scrollYProgress, [ROW_END, EXPAND_END], [12, 0]);

  const left = useTransform(boxLeft, (v) => `${v}vw`);
  const width = useTransform(boxWidth, (v) => `${v}vw`);
  const top = useTransform(boxTop, (v) => `${v}vh`);
  const height = useTransform(boxHeight, (v) => `${v}vh`);
  const radius = useTransform(boxRadius, (v) => `${v}px`);

  // Once full screen, keep zooming into the eye
  const eyeScale = useTransform(scrollYProgress, [HOLD_END, ZOOM_END], [1, 6.5]);

  // Second heading appears once full screen, then fades before the deep zoom
  const heading2Opacity = useTransform(
    scrollYProgress,
    [EXPAND_END, HOLD_END, ZOOM_END * 0.55, ZOOM_END * 0.7],
    [0, 1, 1, 0]
  );

  const vignetteOpacity = useTransform(scrollYProgress, [HOLD_END, ZOOM_END], [0, 0.85]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= 0.985 && !hasNavigated.current) {
      hasNavigated.current = true;
      setIsNavigating(true);
      setTimeout(() => router.push(NEXT_PAGE), 350);
    }
  });

  return (
    <section ref={ref} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Row of the first 4 portraits (static frames) */}
        <motion.div style={{ opacity: rowOpacity }} className="absolute inset-0">
          {FRAMES.slice(0, 4).map((frame, i) => (
            <div
              key={frame.src}
              className="absolute overflow-hidden rounded-xl"
              style={{
                left: `${i * (COL_WIDTH + COL_GAP)}vw`,
                width: `${COL_WIDTH}vw`,
                top: `${ROW_TOP}vh`,
                height: `${ROW_HEIGHT}vh`,
              }}
            >
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                className="object-cover"
                style={{ objectPosition: frame.objectPosition }}
                sizes="20vw"
                priority
              />
            </div>
          ))}
        </motion.div>

        {/* The 5th portrait — starts in its row slot, grows to full screen, then zooms into the eye */}
        <motion.div
          className="fixed overflow-hidden"
          style={{ left, width, top, height, borderRadius: radius }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ scale: eyeScale, transformOrigin: EYE_ORIGIN }}
          >
            <Image
              src={FRAMES[4].src}
              alt={FRAMES[4].alt}
              fill
              className="object-cover"
              style={{ objectPosition: FRAMES[4].objectPosition }}
              sizes="100vw"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Darken as we plunge into the eye */}
        <motion.div style={{ opacity: vignetteOpacity }} className="absolute inset-0 bg-black pointer-events-none" />

        {/* First heading — over the row */}
        <motion.div
          style={{ opacity: heading1Combined }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none px-6"
        >
          <p className="text-2xl md:text-4xl font-bold text-white text-center tracking-tight">
            Every photo <span className="text-white/50">tells a transformation</span>
          </p>
        </motion.div>

        {/* Second heading — once full screen */}
        <motion.div
          style={{ opacity: heading2Opacity }}
          className="absolute bottom-16 left-0 right-0 text-center pointer-events-none px-6"
        >
          <span className="text-[10px] uppercase font-mono tracking-[0.4em] text-white/50">Beauty Retouching</span>
          <p className="mt-3 text-2xl md:text-4xl font-bold text-white tracking-tight">Reveal the essence of the gaze</p>
        </motion.div>

        {/* Scroll hint at very start */}
        <motion.div
          style={{ opacity: heading1FadeOut }}
          className="absolute bottom-10 left-0 right-0 text-center pointer-events-none"
        >
          <span className="text-[10px] uppercase font-mono tracking-[0.4em] text-white/40">Scroll to look closer</span>
        </motion.div>

        {/* Flash to white right before navigating away */}
        <motion.div
          className="absolute inset-0 bg-white pointer-events-none"
          animate={{ opacity: isNavigating ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        />
      </div>
    </section>
  );
}
