"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Coins, Minus, Plus } from "lucide-react";

export const CREDIT_BUNDLES = [
  { price: 50, paid: 50, free: 4, credits: 54, per: 0.93 },
  { price: 100, paid: 100, free: 13, credits: 113, per: 0.88 },
  { price: 250, paid: 250, free: 40, credits: 290, per: 0.86, popular: true },
  { price: 500, paid: 500, free: 100, credits: 600, per: 0.83 },
  { price: 1000, paid: 1000, free: 250, credits: 1250, per: 0.8 },
  { price: 2500, paid: 2500, free: 700, credits: 3200, per: 0.78 },
  { price: 5000, paid: 5000, free: 1550, credits: 6550, per: 0.76 },
  { price: 10000, paid: 10000, free: 3500, credits: 13500, per: 0.74 },
  { price: 20000, paid: 20000, free: 8000, credits: 28000, per: 0.71 },
];

export const savingPct = (per: number) => Math.round((1 - per) * 100);

export const bundleShortLabel = (price: number) =>
  price >= 1000 ? `$${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}K` : `$${price}`;

export default function CreditSlider({
  value,
  onChange,
  title = "How many credits per month?",
  subtitle,
}: {
  value: number;
  onChange: (price: number) => void;
  title?: string;
  subtitle?: string;
}) {
  const idx = Math.max(
    0,
    Math.min(CREDIT_BUNDLES.length - 1, CREDIT_BUNDLES.findIndex((b) => b.price === value)),
  );
  const bundle = CREDIT_BUNDLES[idx];
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const setFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const i = Math.round(frac * (CREDIT_BUNDLES.length - 1));
    onChange(CREDIT_BUNDLES[i].price);
  }, [onChange]);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => setFromClientX(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [dragging, setFromClientX]);

  const step = (dir: number) => {
    const i = Math.max(0, Math.min(CREDIT_BUNDLES.length - 1, idx + dir));
    onChange(CREDIT_BUNDLES[i].price);
  };

  const pct = (idx / (CREDIT_BUNDLES.length - 1)) * 100;

  return (
    <div className="min-w-0">
      {/* Value readout */}
      <div className="grid grid-cols-[1fr_auto] items-end gap-6">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold">
            <Coins className="w-3.5 h-3.5 text-[rgb(var(--accent-text))]" />
            {title}
          </p>
          <p className="mt-2 text-3xl sm:text-4xl font-black text-[rgb(var(--fg-rgb))] tracking-tight whitespace-nowrap">
            {bundle.credits.toLocaleString()}{" "}
            <span className="text-xl font-bold text-[rgb(var(--fg-rgb)/55%)]">credits</span>
          </p>
          {subtitle ? (
            <p className="mt-1 text-sm text-[rgb(var(--fg-rgb)/55%)]">{subtitle}</p>
          ) : (
            <p className="mt-1 text-sm text-[rgb(var(--fg-rgb)/55%)]">
              ${bundle.paid.toLocaleString()} paid +{" "}
              <span className="font-bold text-[rgb(var(--accent-text))]">{bundle.free.toLocaleString()} bonus</span> · $
              {bundle.per.toFixed(2)}/credit ·{" "}
              <span className="font-bold text-emerald-500">Save {savingPct(bundle.per)}%</span>
            </p>
          )}
        </div>
        <p className="text-3xl sm:text-4xl font-black text-[rgb(var(--accent-text))] tracking-tight whitespace-nowrap">
          ${bundle.price.toLocaleString()}
        </p>
      </div>

      {/* Track */}
      <div className="mt-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Decrease credits"
            onClick={() => step(-1)}
            className={`w-9 h-9 rounded-full border grid place-items-center shrink-0 transition-all cursor-pointer ${
              idx === 0
                ? "border-[rgb(var(--fg-rgb)/8%)] text-[rgb(var(--fg-rgb)/25%)] cursor-not-allowed"
                : "border-[rgb(var(--fg-rgb)/15%)] bg-[var(--bg-subtle)] text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/50%)] hover:text-[rgb(var(--accent-text))]"
            }`}
          >
            <Minus className="w-4 h-4" />
          </button>

          <div
            ref={trackRef}
            className="relative flex-1 h-9 flex items-center touch-none select-none cursor-pointer"
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              setFromClientX(e.clientX);
              setDragging(true);
            }}
          >
            <div className="absolute inset-x-0 h-2.5 rounded-full bg-[rgb(var(--fg-rgb)/10%)] border border-[rgb(var(--fg-rgb)/8%)]" />
            <div
              className="absolute h-2.5 rounded-full bg-gradient-to-r from-[rgb(var(--accent-500))] to-[rgb(var(--accent-400))] shadow-[0_0_18px_rgb(var(--accent-500)/45%)]"
              style={{ width: `${pct}%` }}
            />
            {CREDIT_BUNDLES.map((b, i) => {
              const pos = (i / (CREDIT_BUNDLES.length - 1)) * 100;
              return (
                <span
                  key={b.price}
                  className="absolute w-1 h-1 rounded-full bg-[rgb(var(--fg-rgb)/35%)]"
                  style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
                />
              );
            })}
            <div
              role="slider"
              aria-valuemin={CREDIT_BUNDLES[0].price}
              aria-valuemax={CREDIT_BUNDLES[CREDIT_BUNDLES.length - 1].price}
              aria-valuenow={bundle.price}
              aria-valuetext={`${bundle.credits.toLocaleString()} credits for $${bundle.price}`}
              aria-label="Credit bundle amount"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                  e.preventDefault();
                  step(-1);
                } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                  e.preventDefault();
                  step(1);
                }
              }}
              className={`absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[rgb(var(--accent-500))] border-[3px] border-[rgb(var(--accent-contrast))] shadow-lg shadow-[rgb(var(--accent-500)/50%)] cursor-grab active:cursor-grabbing outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-400))] transition-transform ${dragging ? "scale-110" : ""}`}
              style={{ left: `${pct}%`, transform: "translate(-50%, -50%)" }}
            />
          </div>

          <button
            type="button"
            aria-label="Increase credits"
            onClick={() => step(1)}
            className={`w-9 h-9 rounded-full border grid place-items-center shrink-0 transition-all cursor-pointer ${
              idx === CREDIT_BUNDLES.length - 1
                ? "border-[rgb(var(--fg-rgb)/8%)] text-[rgb(var(--fg-rgb)/25%)] cursor-not-allowed"
                : "border-[rgb(var(--fg-rgb)/15%)] bg-[var(--bg-subtle)] text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/50%)] hover:text-[rgb(var(--accent-text))]"
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Tick labels */}
        <div className="mt-2 flex justify-between">
          {CREDIT_BUNDLES.map((b, i) => (
            <button
              key={b.price}
              type="button"
              onClick={() => onChange(b.price)}
              className={`flex-1 text-center text-[10px] font-bold tracking-tight transition-colors cursor-pointer py-1 rounded-md ${
                idx === i ? "text-[rgb(var(--accent-text))]" : "text-[rgb(var(--fg-rgb)/35%)] hover:text-[rgb(var(--fg-rgb))]"
              }`}
            >
              {bundleShortLabel(b.price)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
