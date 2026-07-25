"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
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

const VOLUME_DISCOUNT_THRESHOLD = 500;
const VOLUME_DISCOUNT_RATE = 0.1;

export default function ContactForm() {
  const [wantsQuote, setWantsQuote] = useState(false);
  const [selected, setSelected] = useState<Record<string, number>>({});

  const toggleService = (id: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (id in next) {
        delete next[id];
      } else {
        next[id] = 50;
      }
      return next;
    });
  };

  const setQty = (id: string, qty: number) => {
    setSelected((prev) => ({ ...prev, [id]: Math.max(1, Math.min(20000, qty)) }));
  };

  const { totalImages, subtotal, discountApplies, total, selectedIds } = useMemo(() => {
    let images = 0;
    let sub = 0;
    for (const [id, qty] of Object.entries(selected) as [string, number][]) {
      images += qty;
      sub += (unitPrice[id] ?? 0) * qty;
    }
    const applies = images >= VOLUME_DISCOUNT_THRESHOLD;
    const finalTotal = applies ? sub * (1 - VOLUME_DISCOUNT_RATE) : sub;
    return { totalImages: images, subtotal: sub, discountApplies: applies, total: finalTotal, selectedIds: Object.keys(selected) };
  }, [selected]);

  // Human-readable summary sent along with the form, so the team sees the requested
  // quote in the same email as everything else — no second form, no second step.
  const quoteSummary = useMemo(() => {
    if (!wantsQuote || selectedIds.length === 0) return "";
    const lines = selectedIds.map((id) => {
      const s = services.find((x) => x.id === id);
      const qty = selected[id];
      const lineTotal = qty * (unitPrice[id] ?? 0);
      return `- ${s?.title}: ${qty} images ($${lineTotal.toFixed(2)})`;
    });
    lines.push(`Total images: ${totalImages}`);
    if (discountApplies) {
      lines.push(`Volume discount (${VOLUME_DISCOUNT_THRESHOLD}+ images, ${VOLUME_DISCOUNT_RATE * 100}%): -$${(subtotal * VOLUME_DISCOUNT_RATE).toFixed(2)}`);
    }
    lines.push(`Estimated total: $${total.toFixed(2)}`);
    return lines.join("\n");
  }, [wantsQuote, selectedIds, selected, totalImages, discountApplies, subtotal, total]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[rgb(var(--accent-500)/12%)] flex items-center justify-center">
          <svg className="w-6 h-6 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="mt-5 text-2xl md:text-3xl font-bold tracking-tight text-[rgb(var(--fg-rgb))]">One form, however you&apos;d like to reach us</h3>
        <p className="mt-3 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
          Know exactly which services and how many images you need? Build a quick estimate below. Not sure yet?
          Skip that and just tell us what&apos;s on your mind — either way, it comes straight to our team in one message.
        </p>
      </div>

      <form action="https://formspree.io/f/xovjbydw" method="POST" className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Name <span className="text-red-400">*</span></label>
            <input type="text" name="name" id="name" required
              className="w-full px-4 py-3 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[rgb(var(--fg-rgb)/3%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm"
              placeholder="Your name" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Email <span className="text-red-400">*</span></label>
            <input type="email" name="email" id="email" required
              className="w-full px-4 py-3 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[rgb(var(--fg-rgb)/3%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm"
              placeholder="you@example.com" />
          </div>
        </div>

        {/* Optional inline toggle — stays in the same form, no navigation */}
        <div className="flex items-center gap-1 p-1 rounded-2xl glass-card border border-[rgb(var(--fg-rgb)/5%)] w-fit">
          <button
            type="button"
            onClick={() => setWantsQuote(false)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
              !wantsQuote
                ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow-lg"
                : "text-[rgb(var(--fg-rgb)/50%)] hover:text-[rgb(var(--fg-rgb))]"
            }`}
          >
            Just have a question
          </button>
          <button
            type="button"
            onClick={() => setWantsQuote(true)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
              wantsQuote
                ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow-lg"
                : "text-[rgb(var(--fg-rgb)/50%)] hover:text-[rgb(var(--fg-rgb))]"
            }`}
          >
            I know what I need — build a quote
          </button>
        </div>

        {wantsQuote && (
          <div className="rounded-2xl glass-card border-[rgb(var(--fg-rgb)/8%)] p-5">
            <p className="text-xs text-[rgb(var(--fg-rgb)/50%)] mb-4">
              Select the services you need and roughly how many images. This gets included with your message below.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((s) => {
                const isActive = s.id in selected;
                return (
                  <div
                    key={s.id}
                    onClick={() => toggleService(s.id)}
                    className={`rounded-xl p-3.5 border transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "border-[rgb(var(--accent-500)/60%)] bg-[rgb(var(--accent-500)/8%)]"
                        : "border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--fg-rgb)/20%)]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-[var(--bg-subtle)] flex items-center justify-center overflow-hidden">
                        <Image src={`/images/service-icons/${s.id}.png`} alt="" width={20} height={20} className="object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-xs text-[rgb(var(--fg-rgb))] leading-tight truncate">{s.title}</p>
                          <div className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center ${isActive ? "bg-[rgb(var(--accent-500))] border-[rgb(var(--accent-500))]" : "border-[rgb(var(--fg-rgb)/25%)]"}`}>
                            {isActive && (
                              <svg className="w-3 h-3 text-[rgb(var(--accent-contrast))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            )}
                          </div>
                        </div>
                        <p className="text-[10px] text-[rgb(var(--fg-rgb)/45%)]">from ${unitPrice[s.id]?.toFixed(2)}/image</p>
                      </div>
                    </div>
                    {isActive && (
                      <div className="mt-2.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="number"
                          min={1}
                          max={20000}
                          value={selected[s.id]}
                          onChange={(e) => setQty(s.id, parseInt(e.target.value, 10) || 1)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-xs text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/60%)]"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedIds.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[rgb(var(--fg-rgb)/10%)] flex items-center justify-between">
                <span className="text-xs text-[rgb(var(--fg-rgb)/50%)]">{totalImages} images selected</span>
                <span className="text-lg font-bold gradient-text">${total.toFixed(2)}</span>
              </div>
            )}

            {/* Included automatically in the same message the team receives */}
            <input type="hidden" name="quote_details" value={quoteSummary} />
          </div>
        )}

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">
            Message {!wantsQuote && <span className="text-red-400">*</span>}
            {wantsQuote && <span className="text-[rgb(var(--fg-rgb)/40%)] font-normal"> (optional)</span>}
          </label>
          <textarea name="message" id="message" rows={5} required={!wantsQuote}
            className="w-full px-4 py-3 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[rgb(var(--fg-rgb)/3%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm resize-none"
            placeholder={wantsQuote ? "Anything else we should know? (optional)" : "Tell us a bit about your images or project — we'll take it from there."} />
        </div>

        <button type="submit"
          className="w-full sm:w-auto px-10 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm">
          Send Message
        </button>
        <p className="text-xs text-[rgb(var(--fg-rgb)/30%)]">We will respond within 24 hours.</p>
      </form>
    </div>
  );
}
