"use client";

import { useMemo, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const VOLUME_DISCOUNT_THRESHOLD = 500;
const VOLUME_DISCOUNT_RATE = 0.1;

type SubOption = { id: string; label: string; multiplier: number };
type SubService = { id: string; label: string; price: number; options?: SubOption[] };
type ServiceCategory = { id: string; label: string; subs: SubService[] };

const SERVICE_TREE: ServiceCategory[] = [
  {
    id: "path-creation", label: "Path Creation",
    subs: [
      { id: "clipping-path", label: "Clipping Path", price: 0.39, options: [
        { id: "easy", label: "Easy", multiplier: 0.7 },
        { id: "medium", label: "Medium", multiplier: 1.0 },
        { id: "complex", label: "Complex", multiplier: 1.5 },
      ]},
      { id: "multi-clipping-path", label: "Multi-clipping Path", price: 1.19, options: [
        { id: "easy", label: "Easy", multiplier: 0.7 },
        { id: "medium", label: "Medium", multiplier: 1.0 },
        { id: "complex", label: "Complex", multiplier: 1.5 },
      ]},
    ],
  },
  {
    id: "image-masking-group", label: "Image Masking",
    subs: [
      { id: "image-masking", label: "Image Masking", price: 1.19, options: [
        { id: "easy", label: "Easy", multiplier: 0.7 },
        { id: "medium", label: "Medium", multiplier: 1.0 },
        { id: "complex", label: "Complex", multiplier: 1.5 },
      ]},
    ],
  },
  {
    id: "bg-removal-group", label: "Background Removal",
    subs: [{ id: "background-removal", label: "Background Removal", price: 0.39 }],
  },
  {
    id: "shadow-group", label: "Shadow",
    subs: [
      { id: "shadow-drop", label: "Drop Shadow", price: 0.25 },
      { id: "shadow-existing", label: "Existing Shadow", price: 0.25 },
      { id: "shadow-floating", label: "Floating Shadow", price: 0.28 },
      { id: "shadow-natural", label: "Natural Shadow", price: 0.25 },
      { id: "shadow-reflection", label: "Reflection Shadow", price: 0.30 },
    ],
  },
  {
    id: "retouching-group", label: "Photo Retouching",
    subs: [
      { id: "retouch-dust", label: "Dust, Spot & Scratch Removal", price: 0.69, options: [
        { id: "basic", label: "Basic", multiplier: 0.8 },
        { id: "advance", label: "Advance", multiplier: 1.2 },
      ]},
      { id: "retouch-wrinkle", label: "Wrinkle on Clothing", price: 0.79, options: [
        { id: "basic", label: "Basic", multiplier: 1.0 },
        { id: "advance", label: "Advance", multiplier: 1.4 },
      ]},
      { id: "retouch-beauty", label: "Beauty Airbrushing", price: 0.89, options: [
        { id: "basic", label: "Basic", multiplier: 1.0 },
        { id: "advance", label: "Advance", multiplier: 1.5 },
      ]},
      { id: "retouch-camera", label: "Camera Reflection Removal", price: 0.99, options: [
        { id: "basic", label: "Basic", multiplier: 1.0 },
        { id: "advance", label: "Advance", multiplier: 1.4 },
      ]},
      { id: "retouch-symmetrical", label: "Symmetrical Edit", price: 0.79 },
      { id: "ghost-mannequin", label: "Ghost Mannequin", price: 0.89, options: [
        { id: "basic", label: "Basic", multiplier: 1.0 },
        { id: "advance", label: "Advance", multiplier: 1.4 },
      ]},
    ],
  },
  {
    id: "color-group", label: "Color Change",
    subs: [{ id: "color-change", label: "Color Change", price: 0.99 }],
  },
  {
    id: "car-group", label: "Car Editing",
    subs: [
      { id: "car-editing", label: "Car Editing", price: 2.99, options: [
        { id: "basic", label: "Basic", multiplier: 1.0 },
        { id: "advance", label: "Advance", multiplier: 1.5 },
      ]},
    ],
  },
];

const TURNAROUND_OPTIONS = [
  { id: "12", label: "12 Hours", desc: "Fast delivery", icon: "⚡", surcharge: 0.02 },
  { id: "24", label: "24 Hours", desc: "Standard", icon: "🕐", surcharge: 0 },
  { id: "48", label: "48 Hours", desc: "Relaxed", icon: "📅", surcharge: -0.01 },
  { id: "96", label: "96 Hours+", desc: "Flexible", icon: "📋", surcharge: -0.02 },
];

const FILE_FORMATS = [
  { id: "jpg", label: "JPG", desc: "Single layer, no transparency", layers: false, transparent: false },
  { id: "png", label: "PNG", desc: "Single layer, supports transparency", layers: false, transparent: true },
  { id: "psd", label: "PSD", desc: "Multiple layers, full editability", layers: true, transparent: true },
];

const BACKGROUNDS = [
  { id: "original", label: "Original", desc: "Keep as-is" },
  { id: "white", label: "White", desc: "Clean white background" },
  { id: "transparent", label: "Transparent", desc: "Remove background (PNG/PSD only)" },
];

type SelectedEntry = { qty: number; option: string; colorCode?: string };

export default function ContactForm() {
  const [wantsQuote, setWantsQuote] = useState(true);
  const [selected, setSelected] = useState<Record<string, SelectedEntry>>({});
  const [turnaround, setTurnaround] = useState("24");
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [imageComments, setImageComments] = useState<Record<number, string>>({});
  const [fileFormat, setFileFormat] = useState("psd");
  const [background, setBackground] = useState("original");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSub = (subId: string) => {
    setSelected((prev) => {
      if (subId in prev) {
        const next = { ...prev };
        delete next[subId];
        return next;
      }
      const cat = SERVICE_TREE.find(c => c.subs.some(s => s.id === subId));
      const sub = cat?.subs.find(s => s.id === subId);
      const defaultOpt = sub?.options?.[0]?.id ?? "";
      return { ...prev, [subId]: { qty: 50, option: defaultOpt } };
    });
  };

  const handleCategoryClick = (cat: ServiceCategory) => {
    if (cat.subs.length === 1) {
      toggleSub(cat.subs[0].id);
    } else {
      setExpandedCat(expandedCat === cat.id ? null : cat.id);
    }
  };

  const toggleCat = (cat: ServiceCategory) => {
    if (cat.subs.length === 1) { toggleSub(cat.subs[0].id); return; }
    const allSelected = cat.subs.every(s => s.id in selected);
    if (allSelected) {
      setSelected(prev => { const n = { ...prev }; cat.subs.forEach(s => delete n[s.id]); return n; });
    } else {
      setSelected(prev => {
        const n = { ...prev };
        cat.subs.forEach(s => { if (!(s.id in n)) n[s.id] = { qty: 50, option: s.options?.[0]?.id ?? "" }; });
        return n;
      });
    }
  };

  const setOption = (subId: string, option: string) => {
    setSelected(prev => ({ ...prev, [subId]: { ...prev[subId], option } }));
  };
  const setQty = (subId: string, qty: number) => {
    setSelected(prev => ({ ...prev, [subId]: { ...prev[subId], qty: Math.max(1, Math.min(20000, qty)) } }));
  };
  const setColorCode = (subId: string, colorCode: string) => {
    setSelected(prev => ({ ...prev, [subId]: { ...prev[subId], colorCode } }));
  };

  const findSub = (subId: string): SubService | undefined => {
    for (const cat of SERVICE_TREE) { const s = cat.subs.find(x => x.id === subId); if (s) return s; }
    return undefined;
  };
  const getMultiplier = (subId: string, optionId: string): number => {
    return findSub(subId)?.options?.find(o => o.id === optionId)?.multiplier ?? 1.0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };
  const removeFile = (idx: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
    setImageComments(prev => { const n = { ...prev }; delete n[idx]; return n; });
  };

  const turnaroundOption = TURNAROUND_OPTIONS.find(t => t.id === turnaround);
  const turnaroundSurcharge = turnaroundOption?.surcharge ?? 0;
  const selectedFormat = FILE_FORMATS.find(f => f.id === fileFormat);
  const transparentNotAllowed = fileFormat === "jpg" && background === "transparent";

  const { totalImages, subtotal, discountApplies, discountAmount, turnaroundFee, total, selectedIds } = useMemo(() => {
    let images = 0; let sub = 0;
    for (const [id, entry] of Object.entries(selected)) {
      const s = findSub(id); const mult = getMultiplier(id, entry.option);
      images += entry.qty; sub += (s?.price ?? 0) * mult * entry.qty;
    }
    const applies = images >= VOLUME_DISCOUNT_THRESHOLD;
    const discount = applies ? sub * VOLUME_DISCOUNT_RATE : 0;
    const base = sub - discount; const fee = base * turnaroundSurcharge;
    return { totalImages: images, subtotal: sub, discountApplies: applies, discountAmount: discount, turnaroundFee: fee, total: base + fee, selectedIds: Object.keys(selected) };
  }, [selected, turnaroundSurcharge]);

  const quoteSummary = useMemo(() => {
    if (!wantsQuote || selectedIds.length === 0) return "";
    const lines = selectedIds.map((id) => {
      const s = findSub(id); const entry = selected[id]; const mult = getMultiplier(id, entry.option);
      const lineTotal = entry.qty * (s?.price ?? 0) * mult;
      const optLabel = s?.options?.find(o => o.id === entry.option)?.label ?? "";
      return `- ${s?.label ?? id}${optLabel ? ` [${optLabel}]` : ""}: ${entry.qty} images ($${lineTotal.toFixed(2)})`;
    });
    lines.push(`Total images: ${totalImages}`);
    if (discountApplies) lines.push(`Volume discount: -$${discountAmount.toFixed(2)}`);
    if (turnaroundSurcharge !== 0) lines.push(`Turnaround (${turnaroundOption?.label}): $${turnaroundFee >= 0 ? "+" : ""}${turnaroundFee.toFixed(2)}`);
    lines.push(`File format: ${selectedFormat?.label}`);
    lines.push(`Background: ${background}`);
    if (uploadedFiles.length > 0) lines.push(`Uploaded files: ${uploadedFiles.length}`);
    lines.push(`Estimated total: $${total.toFixed(2)}`);
    return lines.join("\n");
  }, [wantsQuote, selectedIds, selected, totalImages, discountApplies, discountAmount, turnaroundFee, turnaroundSurcharge, turnaroundOption, total, fileFormat, background, uploadedFiles.length]);

  const isCatSelected = (cat: ServiceCategory) => cat.subs.some(s => s.id in selected);
  const isCatFullySelected = (cat: ServiceCategory) => cat.subs.every(s => s.id in selected);

  const STEPS = [
    { id: 1, label: "Services", icon: "📋" },
    { id: 2, label: "Upload", icon: "📁" },
    { id: 3, label: "Preferences", icon: "⚙️" },
    { id: 4, label: "Review", icon: "✅" },
  ];

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
          {/* Left */}
          <div>
            {/* Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-2xl glass-card border border-[rgb(var(--fg-rgb)/5%)] w-fit mb-6">
              <button type="button" onClick={() => { setWantsQuote(true); setStep(1); }}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${wantsQuote ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow-lg" : "text-[rgb(var(--fg-rgb)/50%)] hover:text-[rgb(var(--fg-rgb))]"}`}>
                Build a Quote
              </button>
              <button type="button" onClick={() => setWantsQuote(false)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${!wantsQuote ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow-lg" : "text-[rgb(var(--fg-rgb)/50%)] hover:text-[rgb(var(--fg-rgb))]"}`}>
                Just have a question
              </button>
            </div>

            {wantsQuote ? (
              <>
                {/* Step Indicator */}
                <div className="flex items-center gap-2 mb-6">
                  {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-2">
                      <button type="button" onClick={() => { if (s.id <= step) setStep(s.id); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          step === s.id
                            ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]"
                            : step > s.id
                            ? "bg-[rgb(var(--accent-500)/15%)] text-[rgb(var(--accent-400))]"
                            : "bg-[rgb(var(--fg-rgb)/5%)] text-[rgb(var(--fg-rgb)/30%)]"
                        }`}>
                        <span>{s.icon}</span>
                        <span className="hidden sm:inline">{s.label}</span>
                      </button>
                      {i < STEPS.length - 1 && <div className={`w-6 h-px ${step > s.id ? "bg-[rgb(var(--accent-500)/40%)]" : "bg-[rgb(var(--fg-rgb)/10%)]"}`} />}
                    </div>
                  ))}
                </div>

                {/* Step 1: Services */}
                {step === 1 && (
                  <div className="space-y-2">
                    {SERVICE_TREE.map((cat) => {
                      const catSelected = isCatSelected(cat);
                      const isExpanded = expandedCat === cat.id;
                      return (
                        <div key={cat.id} className={`rounded-xl border transition-all duration-200 ${
                          catSelected ? "border-[rgb(var(--accent-500)/40%)] bg-[rgb(var(--accent-500)/3%)]" : "border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)]"
                        }`}>
                          <div className="flex items-center gap-3 p-4 cursor-pointer select-none" onClick={() => handleCategoryClick(cat)}>
                            <div className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                              catSelected ? "bg-[rgb(var(--accent-500))] border-[rgb(var(--accent-500))]" : "border-[rgb(var(--fg-rgb)/20%)]"
                            }`} onClick={(e) => { e.stopPropagation(); toggleCat(cat); }}>
                              {catSelected && <svg className="w-3 h-3 text-[rgb(var(--accent-contrast))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <div className="flex-1"><p className="font-semibold text-sm text-[rgb(var(--fg-rgb))]">{cat.label}</p></div>
                            {cat.subs.length > 1 && (
                              <svg className={`w-4 h-4 text-[rgb(var(--fg-rgb)/30%)] transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            )}
                          </div>
                          <AnimatePresence>
                            {isExpanded && cat.subs.length > 1 && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="px-4 pb-4 pt-0 space-y-2 border-t border-[rgb(var(--fg-rgb)/5%)]">
                                  {cat.subs.map((sub) => {
                                    const isSubSelected = sub.id in selected;
                                    const entry = selected[sub.id];
                                    const mult = getMultiplier(sub.id, entry?.option ?? "");
                                    const pricePerImage = sub.price * mult;
                                    return (
                                      <div key={sub.id} className={`rounded-lg border transition-all ${
                                        isSubSelected ? "border-[rgb(var(--accent-500)/40%)] bg-[rgb(var(--accent-500)/5%)]" : "border-[rgb(var(--fg-rgb)/6%)]"
                                      }`}>
                                        <div className="flex items-center gap-3 p-3 cursor-pointer select-none" onClick={() => toggleSub(sub.id)}>
                                          <div className={`shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                                            isSubSelected ? "bg-[rgb(var(--accent-500))] border-[rgb(var(--accent-500))]" : "border-[rgb(var(--fg-rgb)/20%)]"
                                          }`}>
                                            {isSubSelected && <svg className="w-2.5 h-2.5 text-[rgb(var(--accent-contrast))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                          </div>
                                          <div className="flex-1"><p className="text-sm text-[rgb(var(--fg-rgb))]">{sub.label}</p></div>
                                          <span className="text-xs text-[rgb(var(--fg-rgb)/40%)]">${sub.price.toFixed(2)}/img</span>
                                          {isSubSelected && entry && <span className="text-xs font-bold text-[rgb(var(--accent-400))]">${(pricePerImage * entry.qty).toFixed(2)}</span>}
                                        </div>
                                        <AnimatePresence>
                                          {isSubSelected && entry && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                              <div className="px-3 pb-3 pt-0 space-y-2.5" onClick={e => e.stopPropagation()}>
                                                {sub.options && sub.options.length > 0 && (
                                                  <div className="flex gap-1.5 flex-wrap">
                                                    {sub.options.map(opt => (
                                                      <button key={opt.id} type="button" onClick={() => setOption(sub.id, opt.id)}
                                                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                                                          entry.option === opt.id ? "border-[rgb(var(--accent-500)/50%)] bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-400))]" : "border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb)/50%)]"
                                                        }`}>{opt.label}</button>
                                                    ))}
                                                  </div>
                                                )}
                                                {sub.id === "color-change" && (
                                                  <input type="text" placeholder="Color code or name (e.g. #FF5733, Royal Blue)" value={entry.colorCode ?? ""}
                                                    onChange={e => setColorCode(sub.id, e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-xs text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)]" />
                                                )}
                                                <div className="flex items-center gap-2">
                                                  <div className="flex items-center gap-1">
                                                    <button type="button" onClick={() => setQty(sub.id, entry.qty - 10)} className="w-6 h-6 rounded bg-[rgb(var(--fg-rgb)/5%)] flex items-center justify-center text-[10px] font-bold">−</button>
                                                    <input type="number" min={1} max={20000} value={entry.qty} onChange={e => setQty(sub.id, parseInt(e.target.value, 10) || 1)}
                                                      className="w-14 px-1.5 py-1 rounded bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[11px] text-center text-[rgb(var(--fg-rgb))] font-bold outline-none" />
                                                    <button type="button" onClick={() => setQty(sub.id, entry.qty + 10)} className="w-6 h-6 rounded bg-[rgb(var(--fg-rgb)/5%)] flex items-center justify-center text-[10px] font-bold">+</button>
                                                  </div>
                                                  <span className="text-[10px] text-[rgb(var(--fg-rgb)/35%)] ml-auto">${pricePerImage.toFixed(2)}/img</span>
                                                </div>
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                    {selectedIds.length > 0 && (
                      <button type="button" onClick={() => setStep(2)}
                        className="w-full mt-4 py-3 rounded-xl bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-sm hover:bg-[rgb(var(--accent-400))] transition-all">
                        Continue to Upload →
                      </button>
                    )}
                  </div>
                )}

                {/* Step 2: Image Upload */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[rgb(var(--fg-rgb)/15%)] rounded-2xl p-8 text-center cursor-pointer hover:border-[rgb(var(--accent-500)/40%)] transition-all">
                      <div className="w-12 h-12 rounded-full bg-[rgb(var(--accent-500)/10%)] flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <p className="text-sm font-bold text-[rgb(var(--fg-rgb))]">Drop images here or click to upload</p>
                      <p className="text-xs text-[rgb(var(--fg-rgb)/40%)] mt-1">JPG, PNG, PSD, TIFF — up to 50MB each</p>
                    </div>
                    <input ref={fileInputRef} type="file" multiple accept="image/*,.psd,.tiff,.tif" className="hidden" onChange={handleFileUpload} />

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-[rgb(var(--fg-rgb)/50%)]">{uploadedFiles.length} file(s) uploaded</p>
                        {uploadedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)]">
                            <div className="shrink-0 w-8 h-8 rounded-lg bg-[rgb(var(--accent-500)/10%)] flex items-center justify-center">
                              <svg className="w-4 h-4 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[rgb(var(--fg-rgb))] truncate">{file.name}</p>
                              <input type="text" placeholder="Comment: e.g. Remove background, fix color..."
                                value={imageComments[idx] ?? ""}
                                onChange={e => setImageComments(prev => ({ ...prev, [idx]: e.target.value }))}
                                className="w-full mt-1.5 px-2 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[11px] text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)]" />
                            </div>
                            <button type="button" onClick={() => removeFile(idx)} className="shrink-0 text-[rgb(var(--fg-rgb)/30%)] hover:text-red-400 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3 mt-4">
                      <button type="button" onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border border-[rgb(var(--fg-rgb)/15%)] text-sm font-bold text-[rgb(var(--fg-rgb)/60%)] hover:border-[rgb(var(--fg-rgb)/30%)] transition-all">← Back</button>
                      <button type="button" onClick={() => setStep(3)}
                        className="flex-1 py-3 rounded-xl bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-sm hover:bg-[rgb(var(--accent-400))] transition-all">
                        Continue to Preferences →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Preferences */}
                {step === 3 && (
                  <div className="space-y-6">
                    {/* File Format */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">File Format</label>
                      <div className="grid grid-cols-3 gap-2">
                        {FILE_FORMATS.map(f => (
                          <button key={f.id} type="button" onClick={() => setFileFormat(f.id)}
                            className={`rounded-xl p-3 border text-left transition-all ${
                              fileFormat === f.id ? "border-[rgb(var(--accent-500)/50%)] bg-[rgb(var(--accent-500)/8%)]" : "border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--fg-rgb)/15%)]"
                            }`}>
                            <p className="text-sm font-bold text-[rgb(var(--fg-rgb))]">{f.label}</p>
                            <p className="text-[10px] text-[rgb(var(--fg-rgb)/40%)] mt-0.5">{f.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Background */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Background</label>
                      <div className="grid grid-cols-3 gap-2">
                        {BACKGROUNDS.map(b => {
                          const disabled = b.id === "transparent" && !selectedFormat?.transparent;
                          return (
                            <button key={b.id} type="button" onClick={() => !disabled && setBackground(b.id)}
                              className={`rounded-xl p-3 border text-left transition-all ${
                                disabled ? "opacity-40 cursor-not-allowed border-[rgb(var(--fg-rgb)/5%)]" :
                                background === b.id ? "border-[rgb(var(--accent-500)/50%)] bg-[rgb(var(--accent-500)/8%)]" : "border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--fg-rgb)/15%)]"
                              }`}>
                              <p className="text-sm font-bold text-[rgb(var(--fg-rgb))]">{b.label}</p>
                              <p className="text-[10px] text-[rgb(var(--fg-rgb)/40%)] mt-0.5">{b.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                      {transparentNotAllowed && (
                        <p className="text-[11px] text-amber-400 mt-2">⚠ JPG does not support transparent background. Choose PNG or PSD.</p>
                      )}
                    </div>

                    {/* Turnaround */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Turnaround</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {TURNAROUND_OPTIONS.map(opt => (
                          <button key={opt.id} type="button" onClick={() => setTurnaround(opt.id)}
                            className={`rounded-xl p-3 border text-center transition-all ${
                              turnaround === opt.id ? "border-[rgb(var(--accent-500)/50%)] bg-[rgb(var(--accent-500)/8%)]" : "border-[rgb(var(--fg-rgb)/8%)]"
                            }`}>
                            <span className="text-lg">{opt.icon}</span>
                            <p className="text-xs font-bold text-[rgb(var(--fg-rgb))] mt-1">{opt.label}</p>
                            <p className={`text-[10px] font-bold mt-0.5 ${opt.surcharge > 0 ? "text-amber-400" : opt.surcharge < 0 ? "text-emerald-400" : "text-[rgb(var(--fg-rgb)/40%)]"}`}>
                              {opt.surcharge > 0 ? `+${opt.surcharge * 100}%` : opt.surcharge < 0 ? `${opt.surcharge * 100}%` : "Base"}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button type="button" onClick={() => setStep(2)} className="px-6 py-3 rounded-xl border border-[rgb(var(--fg-rgb)/15%)] text-sm font-bold text-[rgb(var(--fg-rgb)/60%)]">← Back</button>
                      <button type="button" onClick={() => setStep(4)}
                        className="flex-1 py-3 rounded-xl bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-sm hover:bg-[rgb(var(--accent-400))] transition-all">
                        Review Quote →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {step === 4 && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)] p-4 space-y-3">
                      <p className="text-xs font-bold text-[rgb(var(--fg-rgb)/50%)] uppercase tracking-wider">Selected Services</p>
                      {selectedIds.map(id => {
                        const s = findSub(id); const entry = selected[id]; const mult = getMultiplier(id, entry.option);
                        const lineTotal = entry.qty * (s?.price ?? 0) * mult;
                        const optLabel = s?.options?.find(o => o.id === entry.option)?.label ?? "";
                        return (
                          <div key={id} className="flex justify-between text-sm">
                            <span className="text-[rgb(var(--fg-rgb)/70%)]">{s?.label}{optLabel ? ` [${optLabel}]` : ""} × {entry.qty}</span>
                            <span className="font-semibold text-[rgb(var(--fg-rgb))]">${lineTotal.toFixed(2)}</span>
                          </div>
                        );
                      })}
                      <div className="border-t border-[rgb(var(--fg-rgb)/8%)] pt-2 flex justify-between text-sm">
                        <span className="text-[rgb(var(--fg-rgb)/50%)]">Files uploaded</span>
                        <span>{uploadedFiles.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[rgb(var(--fg-rgb)/50%)]">Format</span>
                        <span>{selectedFormat?.label}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[rgb(var(--fg-rgb)/50%)]">Background</span>
                        <span>{BACKGROUNDS.find(b => b.id === background)?.label}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[rgb(var(--fg-rgb)/50%)]">Turnaround</span>
                        <span>{turnaroundOption?.label}</span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3">
                      <input type="text" name="name" placeholder="Your name" required value={name} onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)]" />
                      <input type="email" name="email" placeholder="Email address" required value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)]" />
                      <textarea name="message" rows={3} placeholder="Additional notes (optional)" value={message} onChange={e => setMessage(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)] resize-none" />
                    </div>

                    <input type="hidden" name="quote_details" value={quoteSummary} />
                    <input type="hidden" name="turnaround" value={turnaroundOption?.label} />
                    <input type="hidden" name="file_format" value={selectedFormat?.label} />
                    <input type="hidden" name="background" value={BACKGROUNDS.find(b => b.id === background)?.label} />

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(3)} className="px-6 py-3 rounded-xl border border-[rgb(var(--fg-rgb)/15%)] text-sm font-bold text-[rgb(var(--fg-rgb)/60%)]">← Back</button>
                      <button type="submit"
                        className="flex-1 py-3 rounded-xl bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-sm hover:bg-[rgb(var(--accent-400))] hover:scale-[1.01] transition-all">
                        Submit Quote Request
                      </button>
                    </div>
                    <p className="text-[11px] text-[rgb(var(--fg-rgb)/35%)] text-center">We respond within 2 hours.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Name <span className="text-red-400">*</span></label>
                    <input type="text" name="name" id="name" required className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/60%)] outline-none transition-all text-sm" placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Email <span className="text-red-400">*</span></label>
                    <input type="email" name="email" id="email" required className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/60%)] outline-none transition-all text-sm" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="message-q" className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Message <span className="text-red-400">*</span></label>
                  <textarea name="message" id="message-q" rows={5} required className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/60%)] outline-none transition-all text-sm resize-none" placeholder="Tell us about your images or project..." />
                </div>
                <button type="submit" className="w-full sm:w-auto px-10 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm">Send Message</button>
                <p className="mt-3 text-[11px] text-[rgb(var(--fg-rgb)/35%)]">We respond within 2 hours.</p>
              </div>
            )}
          </div>

          {/* Right: Summary */}
          <div className="lg:sticky lg:top-28 h-fit">
            {wantsQuote ? (
              <div className="glass-card rounded-[2rem] p-8 border-[rgb(var(--fg-rgb)/10%)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[rgb(var(--accent-500)/12%)] flex items-center justify-center">
                    <svg className="w-4 h-4 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3v-6m-3 6v-9m-2 9h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <h4 className="text-lg font-bold text-[rgb(var(--fg-rgb))]">Your Estimate</h4>
                </div>
                {selectedIds.length === 0 ? (
                  <p className="mt-6 text-sm text-[rgb(var(--fg-rgb)/40%)]">Select services to see your estimate.</p>
                ) : (
                  <div className="mt-6 space-y-3">
                    <AnimatePresence>
                      {selectedIds.map(id => {
                        const s = findSub(id)!; const entry = selected[id]; const mult = getMultiplier(id, entry.option);
                        const lineTotal = entry.qty * (s?.price ?? 0) * mult;
                        const optLabel = s?.options?.find(o => o.id === entry.option)?.label ?? "";
                        return (
                          <motion.div key={id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[rgb(var(--fg-rgb)/70%)]">{s.label} × {entry.qty}</span>
                              <span className="font-semibold text-[rgb(var(--fg-rgb))]">${lineTotal.toFixed(2)}</span>
                            </div>
                            {optLabel && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-400))] font-bold">{optLabel}</span>}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    <div className="pt-4 mt-4 border-t border-[rgb(var(--fg-rgb)/10%)] space-y-2">
                      <div className="flex justify-between text-sm text-[rgb(var(--fg-rgb)/50%)]"><span>Total images</span><span>{totalImages}</span></div>
                      {discountApplies && <div className="flex justify-between text-sm text-[rgb(34_197_94)]"><span>Volume discount</span><span>−${discountAmount.toFixed(2)}</span></div>}
                      {turnaroundSurcharge !== 0 && (
                        <div className={`flex justify-between text-sm ${turnaroundSurcharge > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                          <span>{turnaroundOption?.label}</span><span>{turnaroundFee >= 0 ? "+" : ""}${turnaroundFee.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-bold text-[rgb(var(--fg-rgb))]">Estimated Total</span>
                        <motion.span key={total.toFixed(2)} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold gradient-text">${total.toFixed(2)}</motion.span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card rounded-[2rem] p-8 border-[rgb(var(--fg-rgb)/10%)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[rgb(var(--accent-500)/12%)] flex items-center justify-center">
                    <svg className="w-4 h-4 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  </div>
                  <h4 className="text-lg font-bold text-[rgb(var(--fg-rgb))]">Send a Message</h4>
                </div>
                <p className="mt-4 text-sm text-[rgb(var(--fg-rgb)/50%)]">We&apos;ll get back to you within 2 hours.</p>
                <div className="mt-6 space-y-3">
                  <a href="https://wa.me/8801723735896" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl glass-card border border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(34_197_94_/_50%)] transition-all text-sm text-[rgb(var(--fg-rgb)/70%)] hover:text-[rgb(34_197_94)]">
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    Chat on WhatsApp
                  </a>
                  <a href="mailto:info@pathpixhub.com" className="flex items-center gap-3 p-3 rounded-xl glass-card border border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--accent-500)/50%)] transition-all text-sm text-[rgb(var(--fg-rgb)/70%)] hover:text-[rgb(var(--accent-400))]">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Send us an Email
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        </form>
      </div>
    </div>
  );
}
