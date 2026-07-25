"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { services } from "@/data/services";

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

const SERVICE_COLORS = [
  "#fca5a5", "#d8b4fe", "#f9a8d4", "#fde68a", "#93c5fd",
  "#86efac", "#fdba74", "#5eead4", "#a5b4fc", "#fda4af",
];

const QUICK_QTYS = [10, 50, 100, 250, 500, 1000];
const VOLUME_DISCOUNT_THRESHOLD = 500;
const VOLUME_DISCOUNT_RATE = 0.1;

const TURNAROUND_OPTIONS = [
  { id: "12", label: "12 Hours", desc: "Fast delivery", icon: "⚡" },
  { id: "24", label: "24 Hours", desc: "Standard", icon: "🕐" },
  { id: "48", label: "48 Hours", desc: "Relaxed", icon: "📅" },
  { id: "96", label: "96 Hours+", desc: "Flexible / Custom", icon: "📋" },
];

export default function ContactForm() {
  const [wantsQuote, setWantsQuote] = useState(true);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [turnaround, setTurnaround] = useState("12");

  const toggleService = (id: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (id in next) { delete next[id]; } else { next[id] = 50; }
      return next;
    });
  };

  const setQty = (id: string, qty: number) => {
    setSelected((prev) => ({ ...prev, [id]: Math.max(1, Math.min(20000, qty)) }));
  };

  const { totalImages, subtotal, discountApplies, discountAmount, total, selectedIds } = useMemo(() => {
    let images = 0;
    let sub = 0;
    for (const [id, qty] of Object.entries(selected) as [string, number][]) {
      images += qty;
      sub += (unitPrice[id] ?? 0) * qty;
    }
    const applies = images >= VOLUME_DISCOUNT_THRESHOLD;
    const discount = applies ? sub * VOLUME_DISCOUNT_RATE : 0;
    return { totalImages: images, subtotal: sub, discountApplies: applies, discountAmount: discount, total: sub - discount, selectedIds: Object.keys(selected) };
  }, [selected]);

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
      lines.push(`Volume discount (${VOLUME_DISCOUNT_THRESHOLD}+ images, ${VOLUME_DISCOUNT_RATE * 100}%): -$${discountAmount.toFixed(2)}`);
    }
    lines.push(`Estimated total: $${total.toFixed(2)}`);
    return lines.join("\n");
  }, [wantsQuote, selectedIds, selected, totalImages, discountApplies, discountAmount, total]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[rgb(var(--fg-rgb))]">Get in Touch</h3>
        <p className="mt-3 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
          Select your services and quantity below for an instant estimate — or skip and just send us a message.
        </p>
      </div>

      <form action="https://formspree.io/f/xovjbydw" method="POST" className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Name <span className="text-red-400">*</span></label>
            <input type="text" name="name" id="name" required
              className="w-full px-4 py-3.5 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[rgb(var(--fg-rgb)/3%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm"
              placeholder="Your name" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Email <span className="text-red-400">*</span></label>
            <input type="email" name="email" id="email" required
              className="w-full px-4 py-3.5 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[rgb(var(--fg-rgb)/3%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm"
              placeholder="you@example.com" />
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-2xl glass-card border border-[rgb(var(--fg-rgb)/5%)] w-fit">
          <button type="button" onClick={() => setWantsQuote(true)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${wantsQuote ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow-lg" : "text-[rgb(var(--fg-rgb)/50%)] hover:text-[rgb(var(--fg-rgb))]"}`}>
            Build a Quote
          </button>
          <button type="button" onClick={() => setWantsQuote(false)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${!wantsQuote ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow-lg" : "text-[rgb(var(--fg-rgb)/50%)] hover:text-[rgb(var(--fg-rgb))]"}`}>
            Just have a question
          </button>
        </div>

        {wantsQuote && (
          <div className="rounded-2xl glass-card border-[rgb(var(--fg-rgb)/8%)] p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-semibold text-[rgb(var(--fg-rgb)/80%)]">Select services & quantity</p>
              <span className="text-[10px] font-mono tracking-wider text-[rgb(var(--accent-400))] uppercase">Step 1 of 2</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((s, i) => {
                const isActive = s.id in selected;
                const color = SERVICE_COLORS[i % SERVICE_COLORS.length];
                return (
                  <div key={s.id} onClick={() => toggleService(s.id)}
                    className={`rounded-2xl p-4 border-2 transition-all duration-300 cursor-pointer ${isActive ? "border-[rgb(var(--accent-500)/70%)] shadow-lg shadow-[rgb(var(--accent-500)/10%)]" : "border-[rgb(var(--fg-rgb)/6%)] hover:border-[rgb(var(--fg-rgb)/15%)] hover:shadow-md"}`}
                    style={{ backgroundColor: isActive ? `${color}15` : `${color}08` }}>
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${color}25` }}>
                        <Image src={`/images/service-icons/${s.id}.png`} alt="" width={28} height={28} className="object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-sm text-[rgb(var(--fg-rgb))] leading-tight truncate">{s.title}</p>
                          <div className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${isActive ? "bg-[rgb(var(--accent-500))] border-[rgb(var(--accent-500))] scale-110" : "border-[rgb(var(--fg-rgb)/20%)]"}`}>
                            {isActive && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-[rgb(var(--fg-rgb)/45%)] mt-0.5">from ${unitPrice[s.id]?.toFixed(2)}/image</p>
                      </div>
                    </div>

                    {isActive && (
                      <div className="mt-3 pt-3 border-t border-[rgb(var(--fg-rgb)/8%)]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-[rgb(var(--fg-rgb)/50%)]">Quantity:</span>
                          <div className="flex items-center gap-1.5">
                            {QUICK_QTYS.map((q) => (
                              <button key={q} type="button" onClick={() => setQty(s.id, q)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all duration-200 ${selected[s.id] === q ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]" : "bg-[rgb(var(--fg-rgb)/5%)] text-[rgb(var(--fg-rgb)/50%)] hover:bg-[rgb(var(--fg-rgb)/10%)] hover:text-[rgb(var(--fg-rgb)/70%)]"}`}>
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => setQty(s.id, (selected[s.id] || 50) - 10)}
                            className="w-8 h-8 rounded-lg bg-[rgb(var(--fg-rgb)/5%)] text-[rgb(var(--fg-rgb)/60%)] hover:bg-[rgb(var(--fg-rgb)/10%)] flex items-center justify-center font-bold text-sm transition-colors">−</button>
                          <input type="number" min={1} max={20000} value={selected[s.id]}
                            onChange={(e) => setQty(s.id, parseInt(e.target.value, 10) || 1)}
                            className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-center text-[rgb(var(--fg-rgb))] font-bold outline-none focus:border-[rgb(var(--accent-500)/60%)]" />
                          <button type="button" onClick={() => setQty(s.id, (selected[s.id] || 50) + 10)}
                            className="w-8 h-8 rounded-lg bg-[rgb(var(--fg-rgb)/5%)] text-[rgb(var(--fg-rgb)/60%)] hover:bg-[rgb(var(--fg-rgb)/10%)] flex items-center justify-center font-bold text-sm transition-colors">+</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedIds.length > 0 && (
              <div className="mt-5 pt-5 border-t border-[rgb(var(--fg-rgb)/10%)] space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[rgb(var(--fg-rgb)/60%)]">{totalImages} images selected</span>
                  <span className="font-bold text-[rgb(var(--fg-rgb))]">${subtotal.toFixed(2)}</span>
                </div>
                {discountApplies && (
                  <div className="flex items-center justify-between text-sm bg-[rgb(34_197_94_/_8%)] rounded-xl px-4 py-2.5 border border-[rgb(34_197_94_/_20%)]">
                    <span className="flex items-center gap-2 text-[rgb(34_197_94)]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>
                      10% volume discount (500+ images)
                    </span>
                    <span className="font-bold text-[rgb(34_197_94)]">−${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {!discountApplies && totalImages > 0 && totalImages < VOLUME_DISCOUNT_THRESHOLD && (
                  <div className="flex items-center gap-2 text-xs text-[rgb(var(--fg-rgb)/40%)] bg-[rgb(var(--fg-rgb)/3%)] rounded-xl px-4 py-2.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Add {VOLUME_DISCOUNT_THRESHOLD - totalImages} more images for 10% volume discount
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[rgb(var(--fg-rgb)/80%)]">Estimated Total</span>
                  <span className="text-2xl font-bold gradient-text">${total.toFixed(2)}</span>
                </div>
              </div>
            )}

            <input type="hidden" name="quote_details" value={quoteSummary} />
          </div>
        )}

        {/* Turnaround Time */}
        {wantsQuote && (
          <div>
            <label className="block text-sm font-bold text-[rgb(var(--fg-rgb)/80%)] mb-3">Preferred Turnaround</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TURNAROUND_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTurnaround(opt.id)}
                  className={`relative rounded-2xl p-4 border-2 text-center transition-all duration-300 ${turnaround === opt.id ? "border-[rgb(var(--accent-500))] bg-[rgb(var(--accent-500)/8%)] shadow-lg shadow-[rgb(var(--accent-500)/10%)]" : "border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--fg-rgb)/20%)] hover:shadow-md"}`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <p className="mt-1.5 font-bold text-sm text-[rgb(var(--fg-rgb))]">{opt.label}</p>
                  <p className="text-xs text-[rgb(var(--fg-rgb)/45%)] mt-0.5">{opt.desc}</p>
                  {turnaround === opt.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[rgb(var(--accent-500))] flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
            <input type="hidden" name="turnaround" value={turnaround === "96" ? "96+ hours (custom)" : `${turnaround} hours`} />
          </div>
        )}

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">
            Message {!wantsQuote && <span className="text-red-400">*</span>}
            {wantsQuote && <span className="text-[rgb(var(--fg-rgb)/40%)] font-normal"> (optional)</span>}
          </label>
          <textarea name="message" id="message" rows={5} required={!wantsQuote}
            className="w-full px-4 py-3.5 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[rgb(var(--fg-rgb)/3%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm resize-none"
            placeholder={wantsQuote ? "Anything else we should know?" : "Tell us about your images or project..."} />
        </div>

        <button type="submit"
          className="w-full sm:w-auto px-10 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm">
          Send Message
        </button>
        <p className="text-xs text-[rgb(var(--fg-rgb)/30%)]">We respond within 12 hours.</p>
      </form>
    </div>
  );
}
