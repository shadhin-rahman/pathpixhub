"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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

const VOLUME_DISCOUNT_THRESHOLD = 500;
const VOLUME_DISCOUNT_RATE = 0.1;

const COMPLEXITY_OPTIONS = [
  { id: "easy", label: "Easy", desc: "Simple, clean background", multiplier: 0.7, color: "rgb(34 197 94)" },
  { id: "medium", label: "Medium", desc: "Some detail work", multiplier: 1.0, color: "rgb(234 179 8)" },
  { id: "complex", label: "Complex", desc: "Fine detail, hair, glass", multiplier: 1.5, color: "rgb(239 68 68)" },
];

const TURNAROUND_OPTIONS = [
  { id: "12", label: "12 Hours", desc: "Fast delivery", icon: "⚡", surcharge: 0.02 },
  { id: "24", label: "24 Hours", desc: "Standard", icon: "🕐", surcharge: 0 },
  { id: "48", label: "48 Hours", desc: "Relaxed", icon: "📅", surcharge: -0.01 },
  { id: "96", label: "96 Hours+", desc: "Flexible / Custom", icon: "📋", surcharge: -0.02 },
];

export default function ContactForm() {
  const [wantsQuote, setWantsQuote] = useState(true);
  const [selected, setSelected] = useState<Record<string, { qty: number; complexity: string }>>({});
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [turnaround, setTurnaround] = useState("24");

  const toggleService = (id: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (id in next) {
        delete next[id];
        setExpandedService((prev) => (prev === id ? null : prev));
      } else {
        next[id] = { qty: 50, complexity: "medium" };
        setExpandedService(id);
      }
      return next;
    });
  };

  const setQty = (id: string, qty: number) => {
    setSelected((prev) => ({
      ...prev,
      [id]: { ...prev[id], qty: Math.max(1, Math.min(20000, qty)) },
    }));
  };

  const setComplexity = (id: string, complexity: string) => {
    setSelected((prev) => ({
      ...prev,
      [id]: { ...prev[id], complexity },
    }));
  };

  const turnaroundOption = TURNAROUND_OPTIONS.find((t) => t.id === turnaround);
  const turnaroundSurcharge = turnaroundOption?.surcharge ?? 0;

  const { totalImages, subtotal, discountApplies, discountAmount, turnaroundFee, total, selectedIds } = useMemo(() => {
    let images = 0;
    let sub = 0;
    for (const [id, entry] of Object.entries(selected)) {
      const qty = entry.qty;
      const complexity = COMPLEXITY_OPTIONS.find((c) => c.id === entry.complexity);
      const multiplier = complexity?.multiplier ?? 1.0;
      images += qty;
      sub += (unitPrice[id] ?? 0) * multiplier * qty;
    }
    const applies = images >= VOLUME_DISCOUNT_THRESHOLD;
    const discount = applies ? sub * VOLUME_DISCOUNT_RATE : 0;
    const baseAfterDiscount = sub - discount;
    const fee = baseAfterDiscount * turnaroundSurcharge;
    return { totalImages: images, subtotal: sub, discountApplies: applies, discountAmount: discount, turnaroundFee: fee, total: baseAfterDiscount + fee, selectedIds: Object.keys(selected) };
  }, [selected, turnaroundSurcharge]);

  const quoteSummary = useMemo(() => {
    if (!wantsQuote || selectedIds.length === 0) return "";
    const lines = selectedIds.map((id) => {
      const s = services.find((x) => x.id === id);
      const entry = selected[id];
      const qty = entry.qty;
      const complexity = COMPLEXITY_OPTIONS.find((c) => c.id === entry.complexity);
      const multiplier = complexity?.multiplier ?? 1.0;
      const lineTotal = qty * (unitPrice[id] ?? 0) * multiplier;
      return `- ${s?.title} [${complexity?.label}]: ${qty} images ($${lineTotal.toFixed(2)})`;
    });
    lines.push(`Total images: ${totalImages}`);
    if (discountApplies) {
      lines.push(`Volume discount (${VOLUME_DISCOUNT_THRESHOLD}+ images, ${VOLUME_DISCOUNT_RATE * 100}%): -$${discountAmount.toFixed(2)}`);
    }
    if (turnaroundSurcharge !== 0) {
      const pct = turnaroundSurcharge > 0 ? `+${turnaroundSurcharge * 100}%` : `${turnaroundSurcharge * 100}%`;
      lines.push(`Turnaround (${turnaroundOption?.label}): ${pct} ($${turnaroundFee >= 0 ? "+" : ""}$${turnaroundFee.toFixed(2)})`);
    }
    lines.push(`Estimated total: $${total.toFixed(2)}`);
    return lines.join("\n");
  }, [wantsQuote, selectedIds, selected, totalImages, discountApplies, discountAmount, turnaroundFee, turnaroundSurcharge, turnaroundOption, total]);

  return (
    <div className="relative">
      <div className="premium-blur w-[500px] h-[500px] top-[-15%] left-[-10%]" />
      <div className="premium-blur w-[400px] h-[400px] bottom-[-15%] right-[-10%]" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Get in Touch</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text">How Can We Help?</h3>
          <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)] max-w-xl mx-auto">
            Build a quote with services and quantity — or skip and just send us a message directly.
          </p>
        </div>

        <form action="https://formspree.io/f/xovjbydw" method="POST" encType="multipart/form-data">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
          {/* Left: Services or Message */}
          <div>
            {/* Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-2xl glass-card border border-[rgb(var(--fg-rgb)/5%)] w-fit mb-6">
              <button type="button" onClick={() => setWantsQuote(true)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${wantsQuote ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow-lg" : "text-[rgb(var(--fg-rgb)/50%)] hover:text-[rgb(var(--fg-rgb))]"}`}>
                Build a Quote
              </button>
              <button type="button" onClick={() => setWantsQuote(false)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${!wantsQuote ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow-lg" : "text-[rgb(var(--fg-rgb)/50%)] hover:text-[rgb(var(--fg-rgb))]"}`}>
                Just have a question
              </button>
            </div>

            {wantsQuote ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((s, i) => {
                  const isActive = s.id in selected;
                  const isExpanded = expandedService === s.id && isActive;
                  const entry = selected[s.id];
                  const complexity = COMPLEXITY_OPTIONS.find((c) => c.id === (entry?.complexity ?? "medium"));
                  const multiplier = complexity?.multiplier ?? 1.0;
                  const pricePerImage = (unitPrice[s.id] ?? 0) * multiplier;
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
                          <Image src={`/images/service-icons/${s.id}.png`} alt="" width={24} height={24} className="object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-bold text-sm text-[rgb(var(--fg-rgb))] leading-tight">{s.title}</p>
                            <div className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                              isActive
                                ? "bg-[rgb(var(--accent-500))] border-[rgb(var(--accent-500))]"
                                : "border-[rgb(var(--fg-rgb)/25%)]"
                            }`}>
                              {isActive ? (
                                <svg className="w-3 h-3 text-[rgb(var(--accent-contrast))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-3 h-3 text-[rgb(var(--fg-rgb)/30%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                              )}
                            </div>
                          </div>
                          <p className="mt-1 text-xs text-[rgb(var(--fg-rgb)/50%)]">from ${unitPrice[s.id]?.toFixed(2)} / image</p>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && entry && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: "auto", opacity: 1, marginTop: 14 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Complexity selector */}
                            <label className="text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold">Image Complexity</label>
                            <div className="grid grid-cols-3 gap-1.5 mt-2">
                              {COMPLEXITY_OPTIONS.map((c) => (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => setComplexity(s.id, c.id)}
                                  className={`rounded-lg px-2 py-2 text-center border transition-all duration-200 ${
                                    entry.complexity === c.id
                                      ? "border-current shadow-sm"
                                      : "border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--fg-rgb)/20%)]"
                                  }`}
                                  style={entry.complexity === c.id ? { color: c.color, backgroundColor: `${c.color}12`, borderColor: `${c.color}60` } : {}}
                                >
                                  <span className="text-[11px] font-bold block" style={entry.complexity === c.id ? { color: c.color } : { color: "rgb(var(--fg-rgb))" }}>{c.label}</span>
                                  <span className="text-[10px] block mt-0.5" style={entry.complexity === c.id ? { color: c.color } : { color: "rgb(var(--fg-rgb)/40%)" }}>{c.desc}</span>
                                </button>
                              ))}
                            </div>

                            {/* Price per image indicator */}
                            <div className="mt-3 flex items-center justify-between text-xs">
                              <span className="text-[rgb(var(--fg-rgb)/40%)]">Price per image</span>
                              <span className="font-bold" style={{ color: complexity?.color }}>${pricePerImage.toFixed(2)}</span>
                            </div>

                            {/* Quantity */}
                            <label className="text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mt-3 block">Number of images</label>
                            <div className="flex items-center gap-2 mt-2">
                              <button type="button" onClick={() => setQty(s.id, (entry.qty) - 10)}
                                className="w-8 h-8 rounded-lg bg-[rgb(var(--fg-rgb)/5%)] text-[rgb(var(--fg-rgb)/60%)] hover:bg-[rgb(var(--fg-rgb)/10%)] flex items-center justify-center font-bold text-sm transition-colors">−</button>
                              <input type="number" min={1} max={20000} value={entry.qty}
                                onChange={(e) => setQty(s.id, parseInt(e.target.value, 10) || 1)}
                                className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-center text-[rgb(var(--fg-rgb))] font-bold outline-none focus:border-[rgb(var(--accent-500)/60%)]" />
                              <button type="button" onClick={() => setQty(s.id, (entry.qty) + 10)}
                                className="w-8 h-8 rounded-lg bg-[rgb(var(--fg-rgb)/5%)] text-[rgb(var(--fg-rgb)/60%)] hover:bg-[rgb(var(--fg-rgb)/10%)] flex items-center justify-center font-bold text-sm transition-colors">+</button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Name <span className="text-red-400">*</span></label>
                    <input type="text" name="name" id="name" required
                      className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/60%)] outline-none transition-all text-sm"
                      placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Email <span className="text-red-400">*</span></label>
                    <input type="email" name="email" id="email" required
                      className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/60%)] outline-none transition-all text-sm"
                      placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="message-q" className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Message <span className="text-red-400">*</span></label>
                  <textarea name="message" id="message-q" rows={5} required
                    className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/60%)] outline-none transition-all text-sm resize-none"
                    placeholder="Tell us about your images or project..." />
                </div>
              </div>
            )}
          </div>

          {/* Right: Summary / Contact */}
          <div className="lg:sticky lg:top-28 h-fit">
            {wantsQuote ? (
              <div className="glass-card rounded-[2rem] p-8 border-[rgb(var(--fg-rgb)/10%)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[rgb(var(--accent-500)/12%)] flex items-center justify-center">
                    <svg className="w-4 h-4 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        const entry = selected[id];
                        const qty = entry.qty;
                        const complexity = COMPLEXITY_OPTIONS.find((c) => c.id === entry.complexity);
                        const multiplier = complexity?.multiplier ?? 1.0;
                        const lineTotal = qty * (unitPrice[id] ?? 0) * multiplier;
                        return (
                          <motion.div
                            key={id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[rgb(var(--fg-rgb)/70%)]">{s.title} × {qty}</span>
                              <span className="font-semibold text-[rgb(var(--fg-rgb))]">${lineTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ color: complexity?.color, backgroundColor: `${complexity?.color}15` }}>{complexity?.label}</span>
                              <span className="text-[10px] text-[rgb(var(--fg-rgb)/35%)]">${(unitPrice[id] ?? 0) * multiplier}/img</span>
                            </div>
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
                        <div className="flex items-center justify-between text-sm text-[rgb(34_197_94)]">
                          <span>Volume discount ({VOLUME_DISCOUNT_THRESHOLD}+ images, {VOLUME_DISCOUNT_RATE * 100}%)</span>
                          <span>−${discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      {!discountApplies && totalImages > 0 && totalImages < VOLUME_DISCOUNT_THRESHOLD && (
                        <p className="text-[11px] text-[rgb(var(--fg-rgb)/35%)]">
                          Tip: orders of {VOLUME_DISCOUNT_THRESHOLD}+ images get {VOLUME_DISCOUNT_RATE * 100}% off automatically.
                        </p>
                      )}
                      {turnaroundSurcharge !== 0 && (
                        <div className={`flex items-center justify-between text-sm ${turnaroundSurcharge > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                          <span>{turnaroundOption?.label} turnaround ({turnaroundSurcharge > 0 ? "+" : ""}{turnaroundSurcharge * 100}%)</span>
                          <span>{turnaroundFee >= 0 ? "+" : ""}${turnaroundFee.toFixed(2)}</span>
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
                    </div>
                  </div>
                )}

                <input type="hidden" name="quote_details" value={quoteSummary} />
                <input type="hidden" name="complexity_levels" value={selectedIds.map((id) => {
                  const s = services.find((x) => x.id === id);
                  const entry = selected[id];
                  const c = COMPLEXITY_OPTIONS.find((x) => x.id === entry?.complexity);
                  return `${s?.title}: ${c?.label}`;
                }).join(", ")} />
                <input type="hidden" name="turnaround" value={turnaround === "96" ? "96+ hours (custom)" : `${turnaround} hours`} />
              </div>
            ) : (
              <div className="glass-card rounded-[2rem] p-8 border-[rgb(var(--fg-rgb)/10%)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[rgb(var(--accent-500)/12%)] flex items-center justify-center">
                    <svg className="w-4 h-4 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-[rgb(var(--fg-rgb))]">Send a Message</h4>
                </div>
                <p className="mt-4 text-sm text-[rgb(var(--fg-rgb)/50%)]">
                  Fill in your details on the left and send us a message — we&apos;ll get back to you within 2 hours.
                </p>
                <div className="mt-6 space-y-3">
                  <a href="https://wa.me/8801723735896" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl glass-card border border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(34_197_94_/_50%)] transition-all text-sm text-[rgb(var(--fg-rgb)/70%)] hover:text-[rgb(34_197_94)]">
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    Chat on WhatsApp
                  </a>
                  <a href="mailto:info@pathpixhub.com"
                    className="flex items-center gap-3 p-3 rounded-xl glass-card border border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--accent-500)/50%)] transition-all text-sm text-[rgb(var(--fg-rgb)/70%)] hover:text-[rgb(var(--accent-400))]">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Send us an Email
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Turnaround - only for Build a Quote */}
        {wantsQuote && (
          <div className="mt-8">
            <label className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-3">Preferred Turnaround</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TURNAROUND_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTurnaround(opt.id)}
                  className={`relative rounded-2xl p-4 border transition-all duration-300 ${
                    turnaround === opt.id
                      ? "glass-card border-[rgb(var(--accent-500)/60%)] bg-[rgb(var(--accent-500)/8%)] shadow-lg shadow-[rgb(var(--accent-500)/10%)]"
                      : "glass-card border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--fg-rgb)/20%)] hover:-translate-y-0.5"
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <p className="mt-1.5 font-bold text-sm text-[rgb(var(--fg-rgb))]">{opt.label}</p>
                  <p className="text-xs text-[rgb(var(--fg-rgb)/45%)] mt-0.5">{opt.desc}</p>
                  <p className={`text-[11px] font-bold mt-1 ${
                    opt.surcharge > 0 ? "text-amber-400" : opt.surcharge < 0 ? "text-emerald-400" : "text-[rgb(var(--fg-rgb)/40%)]"
                  }`}>
                    {opt.surcharge > 0 ? `+${opt.surcharge * 100}%` : opt.surcharge < 0 ? `${opt.surcharge * 100}%` : "Base price"}
                  </p>
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
          </div>
        )}

        {/* Submit */}
        <div className="mt-8">
          <input type="hidden" name="_subject" value={wantsQuote ? "Quote Request" : "Question"} />
          <input type="hidden" name="turnaround" value={wantsQuote ? (turnaround === "96" ? "96+ hours (custom)" : `${turnaround} hours`) : ""} />
          <button type="submit"
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm">
            {wantsQuote ? "Send Quote Request" : "Send Message"}
          </button>
          <p className="mt-3 text-[11px] text-[rgb(var(--fg-rgb)/35%)]">We respond within 2 hours.</p>
        </div>
        </form>
      </div>
    </div>
  );
}
