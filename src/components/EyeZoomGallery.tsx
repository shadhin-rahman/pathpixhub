"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

// 5 portraits. The last one is where the camera "pushes in" to the eye
// before the page navigates away, so it also carries an eyeOrigin (the
// percentage position of the visible iris, used as the zoom's transform
// origin).
const FRAMES = [
  { src: "/images/gallery/gallery-1.jpg", alt: "Beauty retouching — portrait 1", objectPosition: "center 25%" },
  { src: "/images/gallery/gallery-2.jpg", alt: "Beauty retouching — portrait 2", objectPosition: "center 20%" },
  { src: "/images/gallery/gallery-3.jpg", alt: "Beauty retouching — portrait 3", objectPosition: "30% 20%" },
  { src: "/images/gallery/gallery-4.jpg", alt: "Beauty retouching — portrait 4", objectPosition: "center 12%" },
  { src: "/images/gallery/gallery-5.jpg", alt: "Beauty retouching — portrait 5", objectPosition: "center 20%" },
] as const;

const EYE_ORIGIN = "42% 24%"; // where the iris sits in gallery-5.jpg
const NEXT_PAGE = "/portfolio";
const SEGMENTS = FRAMES.length; // 1/5th of scroll per portrait; the 5th segment is the eye-zoom

export default function EyeZoomGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const hasNavigated = useRef(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const zoomStart = 4 / SEGMENTS; // start of the final (5th) segment

  // Crossfade opacity for each of the 5 portraits. Hooks are called
  // unconditionally, one per frame, in a fixed order every render.
  const o0 = useTransform(scrollYProgress, [0, 1 / SEGMENTS - 0.02, 1 / SEGMENTS], [1, 1, 0]);
  const o1 = useTransform(scrollYProgress, [1 / SEGMENTS - 0.06, 1 / SEGMENTS, 2 / SEGMENTS - 0.02, 2 / SEGMENTS], [0, 1, 1, 0]);
  const o2 = useTransform(scrollYProgress, [2 / SEGMENTS - 0.06, 2 / SEGMENTS, 3 / SEGMENTS - 0.02, 3 / SEGMENTS], [0, 1, 1, 0]);
  const o3 = useTransform(scrollYProgress, [3 / SEGMENTS - 0.06, 3 / SEGMENTS, 4 / SEGMENTS - 0.02, 4 / SEGMENTS], [0, 1, 1, 0]);
  const o4 = useTransform(scrollYProgress, [4 / SEGMENTS - 0.06, 4 / SEGMENTS], [0, 1]);
  const opacities = [o0, o1, o2, o3, o4];

  // The final portrait scales up dramatically, converging on the eye
  const eyeScale = useTransform(scrollYProgress, [zoomStart, 1], [1, 7]);
  const vignetteOpacity = useTransform(scrollYProgress, [zoomStart, 1], [0, 0.9]);

  // UI chrome (heading + progress dots) fades out once the zoom begins
  const chromeOpacity = useTransform(
    scrollYProgress,
    [0, 0.04, zoomStart - 0.04, zoomStart],
    [1, 1, 1, 0]
  );

  const dot0 = useTransform(scrollYProgress, [0, 1 / SEGMENTS], [0, 1]);
  const dot1 = useTransform(scrollYProgress, [1 / SEGMENTS, 2 / SEGMENTS], [0, 1]);
  const dot2 = useTransform(scrollYProgress, [2 / SEGMENTS, 3 / SEGMENTS], [0, 1]);
  const dot3 = useTransform(scrollYProgress, [3 / SEGMENTS, 4 / SEGMENTS], [0, 1]);
  const dot4 = useTransform(scrollYProgress, [4 / SEGMENTS, 1], [0, 1]);
  const dots = [dot0, dot1, dot2, dot3, dot4];

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= 0.985 && !hasNavigated.current) {
      hasNavigated.current = true;
      setIsNavigating(true);
      setTimeout(() => router.push(NEXT_PAGE), 350);
    }
  });

  return (
    <section ref={ref} className="relative h-[600vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {FRAMES.map((frame, i) => {
          const isLast = i === FRAMES.length - 1;
          return (
            <motion.div
              key={frame.src}
              style={{
                opacity: opacities[i],
                scale: isLast ? eyeScale : 1,
                transformOrigin: isLast ? EYE_ORIGIN : "center center",
              }}
              className="absolute inset-0"
            >
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                className="object-cover"
                style={{ objectPosition: frame.objectPosition }}
                sizes="100vw"
                priority={i === 0}
              />
            </motion.div>
          );
        })}

        {/* Darken as we plunge into the eye */}
        <motion.div style={{ opacity: vignetteOpacity }} className="absolute inset-0 bg-black pointer-events-none" />

        {/* Heading */}
        <motion.div style={{ opacity: chromeOpacity }} className="absolute top-10 left-0 right-0 text-center pointer-events-none px-6">
          <span className="text-[10px] uppercase font-mono tracking-[0.4em] text-white/50">Beauty Retouching</span>
          <p className="mt-2 text-sm text-white/40">Scroll to look closer</p>
        </motion.div>

        {/* Progress dots */}
        <motion.div style={{ opacity: chromeOpacity }} className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-2 pointer-events-none">
          {dots.map((d, i) => (
            <span key={i} className="h-1 w-6 rounded-full bg-white/25 overflow-hidden">
              <motion.span className="block h-full bg-white" style={{ scaleX: d, transformOrigin: "left" }} />
            </span>
          ))}
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
