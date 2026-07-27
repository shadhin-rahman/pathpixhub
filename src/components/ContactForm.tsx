"use client";

import { useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VOLUME_DISCOUNT_THRESHOLD = 500;
const VOLUME_DISCOUNT_RATE = 0.1;

const COMPLEXITY_LEVELS = [
  { level: 1, multiplier: 0.5 },
  { level: 2, multiplier: 0.7 },
  { level: 3, multiplier: 1.0 },
  { level: 4, multiplier: 1.5 },
  { level: 5, multiplier: 2.0 },
  { level: 6, multiplier: 3.0 },
];

type SubTypeDef = { id: string; label: string; basePrice: number };
type ServiceDef = {
  id: string; label: string;
  basePrice?: number;
  subTypes?: SubTypeDef[];
};

const ALL_SERVICES: ServiceDef[] = [
  { id: "clipping-path", label: "Clipping path", basePrice: 0.39 },
  { id: "multi-clipping-path", label: "Multi-clipping path", basePrice: 1.19 },
  { id: "image-masking", label: "Image masking", basePrice: 1.19 },
  { id: "background-removal", label: "Background removal", basePrice: 0.39 },
  { id: "shadow", label: "Shadow", subTypes: [
    { id: "natural", label: "Natural shadow", basePrice: 0.25 },
    { id: "reflection", label: "Reflection shadow", basePrice: 0.30 },
    { id: "existing", label: "Existing shadow", basePrice: 0.25 },
    { id: "drop", label: "Drop shadow", basePrice: 0.25 },
    { id: "floating", label: "Floating shadow", basePrice: 0.28 },
  ]},
  { id: "photo-retouching", label: "Photo retouching", subTypes: [
    { id: "dust-spot-scratch", label: "Dust, spot and scratch removal", basePrice: 0.69 },
    { id: "beauty-airbrushing", label: "Beauty airbrushing", basePrice: 0.89 },
    { id: "camera-reflection", label: "Camera reflection removal", basePrice: 0.99 },
    { id: "wrinkle-clothing", label: "Wrinkle on clothing", basePrice: 0.79 },
  ]},
  { id: "symmetrical-edit", label: "Symmetrical edit", basePrice: 0.79 },
  { id: "ghost-mannequin", label: "Ghost mannequin", basePrice: 0.89 },
  { id: "color-change", label: "Color change", basePrice: 0.99 },
  { id: "vector-conversion", label: "Vector conversion", subTypes: [
    { id: "logo", label: "Logo", basePrice: 1.50 },
    { id: "artwork", label: "Artwork", basePrice: 2.50 },
  ]},
  { id: "car-editing", label: "Car editing", basePrice: 2.99 },
];

const TURNAROUND_OPTIONS = [
  { id: "12", label: "12 Hours", desc: "Fast delivery", surcharge: 0.02 },
  { id: "24", label: "24 Hours", desc: "Standard", surcharge: 0 },
  { id: "48", label: "48 Hours", desc: "Relaxed", surcharge: -0.01 },
  { id: "96", label: "96 Hours+", desc: "Flexible", surcharge: -0.02 },
];

const FILE_OPTIONS = [
  { id: "psd-original-multi", label: "PSD — Original Background, Multiple Layer" },
  { id: "psd-original-single", label: "PSD — Original Background, Single Layer" },
  { id: "psd-white-multi", label: "PSD — White Background, Multiple Layer" },
  { id: "psd-white-single", label: "PSD — White Background, Single Layer" },
  { id: "psd-transparent-multi", label: "PSD — Transparent Background, Multiple Layer" },
  { id: "psd-transparent-single", label: "PSD — Transparent Background, Single Layer" },
  { id: "psd-mask-multi", label: "PSD — Layer Mask, Multiple Layer" },
  { id: "psd-mask-single", label: "PSD — Layer Mask, Single Layer" },
  { id: "tif-original-multi", label: "TIF — Original Background, Multiple Layer" },
  { id: "tif-original-single", label: "TIF — Original Background, Single Layer" },
  { id: "tif-white-multi", label: "TIF — White Background, Multiple Layer" },
  { id: "tif-white-single", label: "TIF — White Background, Single Layer" },
  { id: "tif-transparent-multi", label: "TIF — Transparent Background, Multiple Layer" },
  { id: "tif-transparent-single", label: "TIF — Transparent Background, Single Layer" },
  { id: "tif-mask-multi", label: "TIF — Layer Mask, Multiple Layer" },
  { id: "tif-mask-single", label: "TIF — Layer Mask, Single Layer" },
  { id: "jpg-white-single", label: "JPG — White Background, Single Layer" },
  { id: "jpg-original-single", label: "JPG — Original Background, Single Layer" },
  { id: "png-white-single", label: "PNG — White Background, Single Layer" },
  { id: "png-transparent-single", label: "PNG — Transparent Background, Single Layer" },
];

type ServiceSelection = {
  subTypeId?: string;
  complexity: number;
  quantity: number;
  colorCode?: string;
};

export default function ContactForm() {
  const [wantsQuote, setWantsQuote] = useState(true);
  const [selections, setSelections] = useState<Record<string, ServiceSelection>>({});
  const [expandedSvc, setExpandedSvc] = useState<string | null>(null);
  const [expandedSubType, setExpandedSubType] = useState<string | null>(null);
  const [turnaround, setTurnaround] = useState("24");
  const [fileOption, setFileOption] = useState("psd-original-multi");
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [imageComments, setImageComments] = useState<Record<number, string>>({});
  const [commentsText, setCommentsText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getSelKey = (svcId: string, subTypeId?: string) => subTypeId ? `${svcId}:${subTypeId}` : svcId;

  const getService = (selKey: string): { def: ServiceDef; subType?: SubTypeDef } | undefined => {
    for (const svc of ALL_SERVICES) {
      if (!svc.subTypes && svc.id === selKey) return { def: svc };
      if (svc.subTypes) {
        for (const st of svc.subTypes) {
          if (`${svc.id}:${st.id}` === selKey) return { def: svc, subType: st };
        }
      }
    }
  };

  const getBasePrice = (selKey: string): number => {
    const info = getService(selKey);
    if (!info) return 0;
    return info.subType?.basePrice ?? info.def.basePrice ?? 0;
  };

  const getMultiplier = (complexity: number): number => {
    return COMPLEXITY_LEVELS.find(c => c.level === complexity)?.multiplier ?? 1.0;
  };

  const getPricePerImage = (selKey: string, complexity: number): number => {
    return getBasePrice(selKey) * getMultiplier(complexity);
  };

  const hasSelection = (selKey: string): boolean => selKey in selections;

  const toggleExpand = (svcId: string) => {
    setExpandedSvc(expandedSvc === svcId ? null : svcId);
    setExpandedSubType(null);
  };

  const handleSubTypeClick = (svcId: string, subTypeKey: string) => {
    const selKey = getSelKey(svcId, subTypeKey);
    if (hasSelection(selKey)) {
      const prev = { ...selections };
      delete prev[selKey];
      setSelections(prev);
    } else {
      setSelections(prev => ({ ...prev, [selKey]: { complexity: 3, quantity: 50 } }));
    }
  };

  const selectComplexity = (selKey: string, level: number) => {
    setSelections(prev => {
      const existing = prev[selKey];
      if (existing && existing.complexity === level && existing.subTypeId === undefined) {
        const n = { ...prev };
        delete n[selKey];
        return n;
      }
      return { ...prev, [selKey]: { ...existing ?? { quantity: 50 }, complexity: level } };
    });
  };

  const setQty = (selKey: string, qty: number) => {
    setSelections(prev => ({
      ...prev,
      [selKey]: { ...prev[selKey], quantity: Math.max(1, Math.min(20000, qty || 1)) },
    }));
  };

  const setColorCode = (selKey: string, code: string) => {
    setSelections(prev => ({ ...prev, [selKey]: { ...prev[selKey], colorCode: code } }));
  };

  const removeSelection = (selKey: string) => {
    setSelections(prev => {
      const n = { ...prev };
      delete n[selKey];
      return n;
    });
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
  const selectedFileOpt = FILE_OPTIONS.find(f => f.id === fileOption);

  const { totalImages, subtotal, discountApplies, discountAmount, turnaroundFee, total, orderedKeys } = useMemo(() => {
    let images = 0; let sub = 0;
    for (const [key, sel] of Object.entries(selections)) {
      const ppi = getPricePerImage(key, sel.complexity);
      images += sel.quantity;
      sub += ppi * sel.quantity;
    }
    const applies = images >= VOLUME_DISCOUNT_THRESHOLD;
    const discount = applies ? sub * VOLUME_DISCOUNT_RATE : 0;
    const base = sub - discount;
    const fee = base * turnaroundSurcharge;
    const keys = Object.keys(selections);
    return {
      totalImages: images, subtotal: sub, discountApplies: applies,
      discountAmount: discount, turnaroundFee: fee, total: base + fee,
      orderedKeys: keys,
    };
  }, [selections, turnaroundSurcharge]);

  const quoteSummary = useMemo(() => {
    if (orderedKeys.length === 0) return "";
    const lines = orderedKeys.map((key) => {
      const info = getService(key);
      const sel = selections[key];
      const ppi = getPricePerImage(key, sel.complexity);
      const lineTotal = ppi * sel.quantity;
      const label = info?.subType?.label ?? info?.def.label ?? key;
      return `- ${label} [Complexity ${sel.complexity}]: ${sel.quantity} images ($${lineTotal.toFixed(2)})`;
    });
    lines.push(`Total images: ${totalImages}`);
    if (discountApplies) lines.push(`Volume discount: -$${discountAmount.toFixed(2)}`);
    if (turnaroundSurcharge !== 0) lines.push(`Turnaround (${turnaroundOption?.label}): $${turnaroundFee >= 0 ? "+" : ""}${turnaroundFee.toFixed(2)}`);
    lines.push(`File format: ${selectedFileOpt?.label}`);
    if (commentsText) lines.push(`Comments: ${commentsText}`);
    if (uploadedFiles.length > 0) lines.push(`Uploaded files: ${uploadedFiles.length}`);
    lines.push(`Estimated total: $${total.toFixed(2)}`);
    return lines.join("\n");
  }, [orderedKeys, selections, totalImages, discountApplies, discountAmount, turnaroundFee, turnaroundSurcharge, turnaroundOption, total, fileOption, commentsText, uploadedFiles.length]);

  const STEPS = [
    { id: 1, label: "Choose services" },
    { id: 2, label: "Add comments" },
    { id: 3, label: "Upload images" },
    { id: 4, label: "Contact information" },
  ];

  const complexityGrid = (selKey: string, basePx: number) => (
    <div>
      <p className="text-[12px] font-medium text-[rgb(var(--fg-rgb)/40%)] mb-3">
        How complex are your images? If your images have different levels of complexity, choose the average for this order.
      </p>
      <div className="grid grid-cols-6 gap-1.5">
        {COMPLEXITY_LEVELS.map(cl => {
          const price = basePx * cl.multiplier;
          const sel = selections[selKey];
          const isActive = sel?.complexity === cl.level;
          return (
            <button key={cl.level} type="button" onClick={() => selectComplexity(selKey, cl.level)}
              className={`rounded-xl py-2.5 px-1 text-center border transition-all ${
                isActive
                  ? "border-[rgb(var(--accent-500)/60%)] bg-[rgb(var(--accent-500)/10%)]"
                  : "border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)] hover:border-[rgb(var(--fg-rgb)/15%)]"
              }`}>
              <p className={`text-[10px] font-bold leading-tight ${isActive ? "text-[rgb(var(--accent-400))]" : "text-[rgb(var(--fg-rgb))]"}`}>
                Complexity {cl.level}
              </p>
              <p className="text-[11px] font-bold text-[rgb(var(--fg-rgb)/40%)] mt-0.5">
                ${price.toFixed(2)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );

  const quantityRow = (selKey: string) => {
    const sel = selections[selKey];
    if (!sel) return null;
    const ppi = getPricePerImage(selKey, sel.complexity);
    return (
      <div className="flex items-center gap-3 pt-2">
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setQty(selKey, sel.quantity - 10)}
            className="w-7 h-7 rounded-lg bg-[rgb(var(--fg-rgb)/6%)] flex items-center justify-center text-xs font-bold text-[rgb(var(--fg-rgb)/60%)] hover:bg-[rgb(var(--fg-rgb)/12%)] transition-all">−</button>
          <input type="number" min={1} max={20000} value={sel.quantity}
            onChange={e => setQty(selKey, parseInt(e.target.value, 10) || 1)}
            className="w-16 px-1 py-1 rounded-lg bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-xs text-center text-[rgb(var(--fg-rgb))] font-bold outline-none focus:border-[rgb(var(--accent-500)/50%)]" />
          <button type="button" onClick={() => setQty(selKey, sel.quantity + 10)}
            className="w-7 h-7 rounded-lg bg-[rgb(var(--fg-rgb)/6%)] flex items-center justify-center text-xs font-bold text-[rgb(var(--fg-rgb)/60%)] hover:bg-[rgb(var(--fg-rgb)/12%)] transition-all">+</button>
        </div>
        <span className="text-[11px] text-[rgb(var(--fg-rgb)/35%)]">${ppi.toFixed(2)}/img</span>
        <span className="text-xs font-bold text-[rgb(var(--fg-rgb))] ml-auto">${(ppi * sel.quantity).toFixed(2)}</span>
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="premium-blur w-[500px] h-[500px] top-[-15%] left-[-10%]" />
      <div className="premium-blur w-[400px] h-[400px] bottom-[-15%] right-[-10%]" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Get in Touch</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text">Get your custom quote</h3>
          <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)] max-w-xl mx-auto">
            Tell us what you need, and we&apos;ll send your custom quote within 45 minutes.
          </p>
        </div>

        <form action="https://formspree.io/f/xovjbydw" method="POST" encType="multipart/form-data">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
          {/* Left */}
          <div>
            {/* Quote / Question toggle */}
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
                <div className="flex items-center gap-3 mb-8">
                  {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <button type="button" onClick={() => { if (s.id <= step) setStep(s.id); }}
                        className={`flex items-center gap-2 transition-all ${
                          step === s.id ? "text-[rgb(var(--fg-rgb))]" :
                          step > s.id ? "text-[rgb(var(--accent-400))]" :
                          "text-[rgb(var(--fg-rgb)/25%)]"
                        }`}>
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all ${
                          step === s.id ? "border-[rgb(var(--accent-500))] bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]" :
                          step > s.id ? "border-[rgb(var(--accent-400))] bg-[rgb(var(--accent-400)/15%)] text-[rgb(var(--accent-400))]" :
                          "border-[rgb(var(--fg-rgb)/15%)] text-[rgb(var(--fg-rgb)/30%)]"
                        }`}>{s.id}</span>
                        <span className="text-[11px] font-bold hidden sm:inline">{s.label}</span>
                      </button>
                      {i < STEPS.length - 1 && (
                        <div className={`w-8 h-px ${step > s.id ? "bg-[rgb(var(--accent-400)/40%)]" : "bg-[rgb(var(--fg-rgb)/10%)]"}`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* ===== STEP 1: SERVICES ===== */}
                {step === 1 && (
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-[rgb(var(--fg-rgb))] mb-4">What kind of edits do you need today?</p>
                    <p className="text-[12px] text-[rgb(var(--fg-rgb)/40%)] -mt-3 mb-5">
                      You can add multiple services for each set of edits. If you have images that require different edits, please request a separate quote for each set.
                    </p>

                    {ALL_SERVICES.map(svc => {
                      const isExpanded = expandedSvc === svc.id;
                      // For simple services, check if svc.id is a key
                      // For complex services, check if any subType key exists
                      const hasAnySelection = svc.subTypes
                        ? svc.subTypes.some(st => hasSelection(getSelKey(svc.id, st.id)))
                        : hasSelection(svc.id);

                      // If expanded, figure out which sub-types are selected
                      const activeSubType = svc.subTypes ? expandedSubType : null;

                      // Determine summary line if selected & collapsed
                      let summaryLine = "";
                      if (hasAnySelection && !isExpanded) {
                        if (svc.subTypes) {
                          const parts: string[] = [];
                          for (const st of svc.subTypes) {
                            const key = getSelKey(svc.id, st.id);
                            const sel = selections[key];
                            if (sel) parts.push(`${st.label} (C${sel.complexity}, ×${sel.quantity})`);
                          }
                          summaryLine = parts.join(", ");
                        } else {
                          const sel = selections[svc.id];
                          if (sel) summaryLine = `Complexity ${sel.complexity}, ×${sel.quantity}`;
                        }
                      }

                      return (
                        <div key={svc.id}
                          className={`rounded-2xl border transition-all overflow-hidden ${
                            hasAnySelection
                              ? "border-[rgb(var(--accent-500)/40%)] bg-[rgb(var(--accent-500)/2%)]"
                              : "border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)]"
                          }`}>
                          {/* Card Header */}
                          <div className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none"
                            onClick={() => toggleExpand(svc.id)}>
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-[rgb(var(--fg-rgb))]">{svc.label}</p>
                              {summaryLine && (
                                <p className="text-[10px] text-[rgb(var(--accent-400))] mt-0.5 font-medium">{summaryLine}</p>
                              )}
                            </div>
                            <div className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                              isExpanded
                                ? "border-[rgb(var(--accent-500)/40%)] bg-[rgb(var(--accent-500)/8%)]"
                                : "border-[rgb(var(--fg-rgb)/15%)]"
                            }`}>
                              <svg className={`w-3.5 h-3.5 text-[rgb(var(--fg-rgb)/40%)] transition-transform ${isExpanded ? "rotate-45" : ""}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden">
                                <div className="px-5 pb-5 pt-0 space-y-4 border-t border-[rgb(var(--fg-rgb)/5%)]">

                                  {!svc.subTypes ? (
                                    /* Simple service: complexity + quantity */
                                    <>
                                      {complexityGrid(svc.id, svc.basePrice ?? 0)}
                                      {selections[svc.id] && quantityRow(svc.id)}
                                      {svc.id === "color-change" && selections[svc.id] && (
                                        <input type="text"
                                          placeholder="Color code or name (e.g. #FF5733, Royal Blue)"
                                          value={selections[svc.id].colorCode ?? ""}
                                          onChange={e => setColorCode(svc.id, e.target.value)}
                                          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-xs text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)]" />
                                      )}
                                    </>
                                  ) : (
                                    /* Complex service: sub-type list */
                                    <>
                                      <p className="text-[12px] font-medium text-[rgb(var(--fg-rgb)/40%)]">
                                        {svc.id === "shadow" ? "Select the type of shadow you want." :
                                         svc.id === "photo-retouching" ? "Select one or more types of photo retouching." :
                                         svc.id === "vector-conversion" ? "Select the type of image you need vector conversion for." :
                                         "Select a service type."}
                                      </p>
                                      <div className="space-y-2">
                                        {svc.subTypes.map(st => {
                                          const key = getSelKey(svc.id, st.id);
                                          const isSelected = hasSelection(key);
                                          const sel = selections[key];
                                          const isSubExpanded = expandedSubType === st.id;
                                          return (
                                            <div key={st.id}
                                              className={`rounded-xl border transition-all ${
                                                isSelected
                                                  ? "border-[rgb(var(--accent-500)/40%)] bg-[rgb(var(--accent-500)/3%)]"
                                                  : "border-[rgb(var(--fg-rgb)/6%)]"
                                              }`}>
                                              <div className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
                                                onClick={() => {
                                                  handleSubTypeClick(svc.id, st.id);
                                                  setExpandedSubType(isSelected && isSubExpanded ? null : st.id);
                                                }}>
                                                <div className="flex-1">
                                                  <p className="text-[13px] font-semibold text-[rgb(var(--fg-rgb))]">{st.label}</p>
                                                </div>
                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                                  isSelected
                                                    ? "bg-[rgb(var(--accent-500))] border-[rgb(var(--accent-500))]"
                                                    : "border-[rgb(var(--fg-rgb)/20%)]"
                                                }`}>
                                                  {isSelected && (
                                                    <svg className="w-3 h-3 text-[rgb(var(--accent-contrast))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                  )}
                                                </div>
                                              </div>
                                              <AnimatePresence>
                                                {isSelected && isSubExpanded && (
                                                  <motion.div initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden">
                                                    <div className="px-4 pb-4 pt-0 space-y-3 border-t border-[rgb(var(--fg-rgb)/5%)]">
                                                      {complexityGrid(key, st.basePrice)}
                                                      {quantityRow(key)}
                                                    </div>
                                                  </motion.div>
                                                )}
                                              </AnimatePresence>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}

                    {orderedKeys.length > 0 && (
                      <button type="button" onClick={() => setStep(2)}
                        className="w-full mt-5 py-3.5 rounded-xl bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-sm hover:bg-[rgb(var(--accent-400))] transition-all">
                        CONTINUE →
                      </button>
                    )}
                  </div>
                )}

                {/* ===== STEP 2: COMMENTS & PREFERENCES ===== */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Add comments</label>
                      <textarea value={commentsText} onChange={e => setCommentsText(e.target.value)}
                        rows={3} placeholder="Describe your images or any special instructions..."
                        className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)] resize-none" />
                    </div>

                    {/* File Format */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Preferred file format</label>
                      <div className="relative">
                        <select value={fileOption} onChange={e => setFileOption(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)] appearance-none cursor-pointer">
                          <optgroup label="PSD">
                            {FILE_OPTIONS.filter(f => f.id.startsWith("psd-")).map(f => (
                              <option key={f.id} value={f.id}>{f.label}</option>
                            ))}
                          </optgroup>
                          <optgroup label="TIF">
                            {FILE_OPTIONS.filter(f => f.id.startsWith("tif-")).map(f => (
                              <option key={f.id} value={f.id}>{f.label}</option>
                            ))}
                          </optgroup>
                          <optgroup label="JPG">
                            {FILE_OPTIONS.filter(f => f.id.startsWith("jpg-")).map(f => (
                              <option key={f.id} value={f.id}>{f.label}</option>
                            ))}
                          </optgroup>
                          <optgroup label="PNG">
                            {FILE_OPTIONS.filter(f => f.id.startsWith("png-")).map(f => (
                              <option key={f.id} value={f.id}>{f.label}</option>
                            ))}
                          </optgroup>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[rgb(var(--fg-rgb)/30%)]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Turnaround */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Turnaround time</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {TURNAROUND_OPTIONS.map(opt => (
                          <button key={opt.id} type="button" onClick={() => setTurnaround(opt.id)}
                            className={`rounded-xl p-3 border text-center transition-all ${
                              turnaround === opt.id
                                ? "border-[rgb(var(--accent-500)/50%)] bg-[rgb(var(--accent-500)/8%)]"
                                : "border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--fg-rgb)/15%)]"
                            }`}>
                            <p className="text-xs font-bold text-[rgb(var(--fg-rgb))]">{opt.label}</p>
                            <p className="text-[10px] text-[rgb(var(--fg-rgb)/40%)]">{opt.desc}</p>
                            <p className={`text-[10px] font-bold mt-0.5 ${opt.surcharge > 0 ? "text-amber-400" : opt.surcharge < 0 ? "text-emerald-400" : "text-[rgb(var(--fg-rgb)/30%)]"}`}>
                              {opt.surcharge > 0 ? `+${opt.surcharge * 100}%` : opt.surcharge < 0 ? `${opt.surcharge * 100}%` : "Base price"}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(1)}
                        className="px-6 py-3 rounded-xl border border-[rgb(var(--fg-rgb)/15%)] text-sm font-bold text-[rgb(var(--fg-rgb)/60%)] hover:border-[rgb(var(--fg-rgb)/30%)] transition-all">← Back</button>
                      <button type="button" onClick={() => setStep(3)}
                        className="flex-1 py-3 rounded-xl bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-sm hover:bg-[rgb(var(--accent-400))] transition-all">
                        CONTINUE →
                      </button>
                    </div>
                  </div>
                )}

                {/* ===== STEP 3: UPLOAD ===== */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[rgb(var(--fg-rgb)/15%)] rounded-2xl p-10 text-center cursor-pointer hover:border-[rgb(var(--accent-500)/40%)] transition-all">
                      <div className="w-12 h-12 rounded-xl bg-[rgb(var(--accent-500)/10%)] flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-[rgb(var(--fg-rgb))]">Drop images here or click to upload</p>
                      <p className="text-xs text-[rgb(var(--fg-rgb)/40%)] mt-1">JPG, PNG, PSD, TIFF — Max 50MB each</p>
                    </div>
                    <input ref={fileInputRef} type="file" multiple accept="image/*,.psd,.tiff,.tif" className="hidden" onChange={handleFileUpload} />

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-[rgb(var(--fg-rgb)/50%)]">{uploadedFiles.length} file(s) uploaded</p>
                        {uploadedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)]">
                            <div className="shrink-0 w-8 h-8 rounded-lg bg-[rgb(var(--accent-500)/10%)] flex items-center justify-center">
                              <svg className="w-4 h-4 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[rgb(var(--fg-rgb))] truncate">{file.name}</p>
                              <input type="text" placeholder="Add a comment for this image..."
                                value={imageComments[idx] ?? ""}
                                onChange={e => setImageComments(prev => ({ ...prev, [idx]: e.target.value }))}
                                className="w-full mt-1.5 px-2 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[11px] text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)]" />
                            </div>
                            <button type="button" onClick={() => removeFile(idx)}
                              className="shrink-0 w-6 h-6 rounded flex items-center justify-center text-[rgb(var(--fg-rgb)/30%)] hover:text-red-400 hover:bg-red-400/10 transition-all">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(2)}
                        className="px-6 py-3 rounded-xl border border-[rgb(var(--fg-rgb)/15%)] text-sm font-bold text-[rgb(var(--fg-rgb)/60%)] hover:border-[rgb(var(--fg-rgb)/30%)] transition-all">← Back</button>
                      <button type="button" onClick={() => setStep(4)}
                        className="flex-1 py-3 rounded-xl bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-sm hover:bg-[rgb(var(--accent-400))] transition-all">
                        CONTINUE →
                      </button>
                    </div>
                  </div>
                )}

                {/* ===== STEP 4: CONTACT INFO + REVIEW ===== */}
                {step === 4 && (
                  <div className="space-y-5">
                    {/* Contact fields */}
                    <div className="space-y-3">
                      <input type="text" name="name" placeholder="Your name" required value={name} onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)]" />
                      <input type="email" name="email" placeholder="Email address" required value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)]" />
                      <textarea name="message" rows={3} placeholder="Anything else we should know? (optional)" value={message} onChange={e => setMessage(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)] resize-none" />
                    </div>

                    {/* Hidden fields for Formspree */}
                    <input type="hidden" name="quote_details" value={quoteSummary} />
                    <input type="hidden" name="turnaround" value={turnaroundOption?.label} />
                    <input type="hidden" name="file_format" value={selectedFileOpt?.label} />

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(3)}
                        className="px-6 py-3 rounded-xl border border-[rgb(var(--fg-rgb)/15%)] text-sm font-bold text-[rgb(var(--fg-rgb)/60%)] hover:border-[rgb(var(--fg-rgb)/30%)] transition-all">← Back</button>
                      <button type="submit"
                        className="flex-1 py-3.5 rounded-xl bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-sm hover:bg-[rgb(var(--accent-400))] hover:scale-[1.01] transition-all">
                        Submit Quote Request
                      </button>
                    </div>
                    <p className="text-[11px] text-[rgb(var(--fg-rgb)/35%)] text-center">We respond within 45 minutes.</p>
                  </div>
                )}
              </>
            ) : (
              /* Just a question mode */
              <div className="space-y-5">
                <p className="text-sm font-bold text-[rgb(var(--fg-rgb))] mb-4">Send us a message</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Name <span className="text-red-400">*</span></label>
                    <input type="text" name="name" id="name" required
                      className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/60%)] outline-none transition-all text-sm" placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Email <span className="text-red-400">*</span></label>
                    <input type="email" name="email" id="email" required
                      className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/60%)] outline-none transition-all text-sm" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="message-q" className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Message <span className="text-red-400">*</span></label>
                  <textarea name="message" id="message-q" rows={5} required
                    className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/60%)] outline-none transition-all text-sm resize-none" placeholder="Tell us about your images or project..." />
                </div>
                <button type="submit"
                  className="w-full sm:w-auto px-10 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm">
                  Send Message
                </button>
                <p className="text-[11px] text-[rgb(var(--fg-rgb)/35%)]">We respond within 45 minutes.</p>
              </div>
            )}
          </div>

          {/* ===== RIGHT: Summary Panel ===== */}
          <div className="lg:sticky lg:top-28 h-fit">
            {wantsQuote ? (
              <div className="glass-card rounded-[2rem] p-8 border-[rgb(var(--fg-rgb)/10%)]">
                <h4 className="text-lg font-bold text-[rgb(var(--fg-rgb))]">Your Estimate</h4>
                {orderedKeys.length === 0 ? (
                  <p className="mt-6 text-sm text-[rgb(var(--fg-rgb)/40%)]">Select services to see your estimate.</p>
                ) : (
                  <div className="mt-6 space-y-3">
                    <AnimatePresence>
                      {orderedKeys.map(key => {
                        const info = getService(key);
                        const sel = selections[key];
                        if (!info || !sel) return null;
                        const ppi = getPricePerImage(key, sel.complexity);
                        const lineTotal = ppi * sel.quantity;
                        const label = info.subType?.label ?? info.def.label;
                        return (
                          <motion.div key={key} initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-sm text-[rgb(var(--fg-rgb)/70%)] truncate">{label}</p>
                                <p className="text-[10px] text-[rgb(var(--fg-rgb)/35%)]">C{sel.complexity}, ×{sel.quantity}</p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="font-semibold text-sm text-[rgb(var(--fg-rgb))]">${lineTotal.toFixed(2)}</span>
                                <button type="button" onClick={() => removeSelection(key)}
                                  className="w-4 h-4 rounded flex items-center justify-center text-[rgb(var(--fg-rgb)/20%)] hover:text-red-400 transition-colors">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    <div className="pt-4 mt-4 border-t border-[rgb(var(--fg-rgb)/10%)] space-y-2">
                      <div className="flex justify-between text-sm text-[rgb(var(--fg-rgb)/50%)]">
                        <span>Total images</span>
                        <span>{totalImages}</span>
                      </div>
                      <div className="flex justify-between text-sm text-[rgb(var(--fg-rgb)/50%)]">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      {discountApplies && (
                        <div className="flex justify-between text-sm text-[rgb(34_197_94)]">
                          <span>Volume discount</span>
                          <span>−${discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      {turnaroundSurcharge !== 0 && (
                        <div className={`flex justify-between text-sm ${turnaroundSurcharge > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                          <span>{turnaroundOption?.label}</span>
                          <span>{turnaroundFee >= 0 ? "+" : ""}${turnaroundFee.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-[rgb(var(--fg-rgb)/10%)]">
                        <span className="font-bold text-[rgb(var(--fg-rgb))]">Estimated Total</span>
                        <motion.span key={total.toFixed(2)}
                          initial={{ opacity: 0.4, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-2xl font-bold gradient-text">
                          ${total.toFixed(2)}
                        </motion.span>
                      </div>
                    </div>
                  </div>
                )}
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
                <p className="mt-4 text-sm text-[rgb(var(--fg-rgb)/50%)]">We&apos;ll get back to you within 45 minutes.</p>
                <div className="mt-6 space-y-3">
                  <a href="https://wa.me/8801723735896" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl glass-card border border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(34_197_94_/_50%)] transition-all text-sm text-[rgb(var(--fg-rgb)/70%)] hover:text-[rgb(34_197_94)]">
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                  <a href="mailto:info@pathpixhub.com"
                    className="flex items-center gap-3 p-3 rounded-xl glass-card border border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--accent-500)/50%)] transition-all text-sm text-[rgb(var(--fg-rgb)/70%)] hover:text-[rgb(var(--accent-400))]">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
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
