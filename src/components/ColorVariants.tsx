"use client";
import Image from "next/image";

const colorVariants = [
  { src: "/images/before-after/color-change-1.jpg", label: "Color 1" },
  { src: "/images/before-after/color-change-2.jpg", label: "Color 2" },
  { src: "/images/before-after/color-change-3.jpg", label: "Color 3" },
  { src: "/images/before-after/color-change-4.jpg", label: "Color 4" },
  { src: "/images/before-after/color-change-5.jpg", label: "Color 5" },
];

export default function ColorVariants() {
  return (
    <div className="rounded-2xl overflow-hidden select-none">
      <div className="relative w-full aspect-[4/3] bg-[var(--bg-subtle)] overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-5 gap-1 p-1">
          {colorVariants.map((v, i) => (
            <div
              key={v.src}
              className={`relative overflow-hidden rounded-xl ${i === colorVariants.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <Image
                src={v.src}
                alt={`Color change ${v.label}`}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 640px) 50vw, 20vw"
              />
            </div>
          ))}
        </div>
      </div>
      <p className="text-center mt-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-[rgb(var(--fg-rgb)/50%)]">
        5 color variations
      </p>
    </div>
  );
}
