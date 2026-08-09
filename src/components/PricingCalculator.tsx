"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { services } from "@/data/services";

// Numeric starting price per image, matched to the "FROM $x.xx / IMAGE" values in priceMap.
const unitPrice: Record<string, number> = {
  "clipping-path": 0.39,
  "background-removal": 0.39,
  "shadow-creation": 0.25,
  "ghost-mannequin": 0.89,
  "image-masking": 1.19,
  "color-change": 0.99,
  "photo-retouching": 0.69,
  "multi-clipping-path": 1.19,
  "ecommerce-editing": 2.99,
  "car-editing": 2.99,
};

// Simple volume discount â€” set by the client. Adjust the threshold/rate here if it ever changes.
const VOLUME_DISCOUNT_THRESHOLD = 500;
const VOLUME_DISCOUNT_RATE = 0.1;

export default function PricingCalculator() {
  const [selected, setSelected] = useState<Record<string, number>>({});

  const toggleService = (id: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (id in next) {
        delete next[id];
      } else {
        next[id] = 50; // sensible default quantity
      }
      return next;
    });
  };

  const setQty = (id: string, qty: number) => {
    setSelected((prev) => ({ ...prev, [id]: Math.max(1, Math.min(20000, qty)) }));
  };

  const { totalImages, subtotal, discountApplies, total } = useMemo(() => {
    let images = 0;
    let sub = 0;
    for (const [id, qty] of Object.entries(selected) as [string, number][]) {
      images += qty;
      sub += (unitPrice[id] ?? 0) * qty;
    }
    const applies = images >= VOLUME_DISCOUNT_THRESHOLD;
    const finalTotal = applies ? sub * (1 - VOLUME_DISCOUNT_RATE) : sub;
    return { totalImages: images, subtotal: sub, discountApplies: applies, total: finalTotal };
  }, [selected]);

  const selectedIds = Object.keys(selected);

  return (
    <section id="calculator" className="relative py-20 lg:py-28 bg-[var(--bg)] overflow-hidden scroll-mt-24">
      <div className="premium-blur w-[500px] h-[500px] top-[-15%] left-[-10%]" />
      <div className="premium-blur w-[400px] h-[400px] bottom-[-15%] right-[-10%]" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-text))] font-bold mb-6">Instant Estimate</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text">Build Your Own Quote</h3>
          <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)] max-w-xl mx-auto">
            Select the services you need and roughly how many images, see an estimated cost right
            away, then send us the details below â€” no waiting on a reply to get a ballpark number.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
          {/* Service picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((s, i) => {
              const isActive = s.id in selected;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                  className={`rounded-2xl p-5 border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "glass-card border-[rgb(var(--accent-500)/60%)] bg-[rgb(var(--accent-500)/8%)] shadow-lg shadow-[rgb(var(--accent-500)/10%)]"
                      : "glass-card border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--fg-rgb)/20%)] hover:-translate-y-0.5"
                  }`}
                  onClick={() => toggleService(s.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-center overflow-hidden">
                      <Image
                        src={`/images/service-icons/${s.id}.png`}
                        alt=""
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-sm text-[rgb(var(--fg-rgb))] leading-tight">{s.title}</p>
                        <div
                          className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isActive
                              ? "bg-[rgb(var(--accent-500))] border-[rgb(var(--accent-500))]"
                              : "border-[rgb(var(--fg-rgb)/25%)]"
                          }`}
                        >
                          {isActive && (
                            <svg className="w-3.5 h-3.5 text-[rgb(var(--accent-contrast))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-[rgb(var(--fg-rgb)/50%)]">
                        from ${unitPrice[s.id]?.toFixed(2)} / image
                      </p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 14 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <label className="text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold">
                          Number of images
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={20000}
                          value={selected[s.id]}
                          onChange={(e) => setQty(s.id, parseInt(e.target.value, 10) || 1)}
                          className="mt-2 w-full px-3 py-2 rounded-lg bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/60%)]"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Summary panel */}
          <div className="lg:sticky lg:top-28 h-fit glass-card rounded-[2rem] p-8 border-[rgb(var(--fg-rgb)/10%)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[rgb(var(--accent-500)/12%)] flex items-center justify-center">
                <svg className="w-4 h-4 text-[rgb(var(--accent-text))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3v-6m-3 6v-9m-2 9h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-[rgb(var(--fg-rgb))]">Your Estimate</h4>
            </div>

            {selectedIds.length === 0 ? (
              <p className="mt-6 text-sm text-[rgb(var(--fg-rgb)/40%)]">
                Select one or more services on the left to see your estimate here.
              </p>
            ) : (
              <div className="mt-6 space-y-3">
                <AnimatePresence>
                  {selectedIds.map((id) => {
                    const s = services.find((x) => x.id === id)!;
                    const qty = selected[id];
                    const lineTotal = qty * (unitPrice[id] ?? 0);
                    return (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between text-sm overflow-hidden"
                      >
                        <span className="text-[rgb(var(--fg-rgb)/70%)]">{s.title} Ã— {qty}</span>
                        <span className="font-semibold text-[rgb(var(--fg-rgb))]">${lineTotal.toFixed(2)}</span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                <div className="pt-4 mt-4 border-t border-[rgb(var(--fg-rgb)/10%)] space-y-2">
                  <div className="flex items-center justify-between text-sm text-[rgb(var(--fg-rgb)/50%)]">
                    <span>Total images</span>
                    <span>{totalImages}</span>
                  </div>
                  {discountApplies && (
                    <div className="flex items-center justify-between text-sm text-[rgb(var(--accent-text))]">
                      <span>Volume discount ({VOLUME_DISCOUNT_THRESHOLD}+ images, {VOLUME_DISCOUNT_RATE * 100}%)</span>
                      <span>-${(subtotal * VOLUME_DISCOUNT_RATE).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-[rgb(var(--fg-rgb))]">Estimated Total</span>
                    <motion.span
                      key={total.toFixed(2)}
                      initial={{ opacity: 0.4, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-bold gradient-text"
                    >
                      ${total.toFixed(2)}
                    </motion.span>
                  </div>
                  {!discountApplies && totalImages > 0 && (
                    <p className="text-[11px] text-[rgb(var(--fg-rgb)/35%)]">
                      Tip: orders of {VOLUME_DISCOUNT_THRESHOLD}+ images get {VOLUME_DISCOUNT_RATE * 100}% off automatically.
                    </p>
                  )}
                </div>
              </div>
            )}

            <a
              href="#contact-form"
              className="mt-8 w-full inline-flex items-center justify-center px-6 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm"
            >
              Continue to Contact Form
            </a>
            <p className="mt-4 text-[11px] text-[rgb(var(--fg-rgb)/35%)] leading-relaxed">
              This is an estimate based on starting rates. Final pricing may vary based on image
              complexity â€” we&apos;ll confirm the exact price before any work begins.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
