"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCountryCode, isCountryBlocked, setBypassCode, isAdmin } from "@/lib/countryBlocker";

const VOLUME_DISCOUNT_THRESHOLD = 500;
const VOLUME_DISCOUNT_RATE = 0.1;

const COMPLEXITY_MULTIPLIERS: Record<number, number[]> = {
  2: [0.7, 1.0],
  3: [0.7, 1.0, 1.5],
  4: [0.5, 0.7, 1.0, 1.5],
  5: [0.5, 0.7, 1.0, 1.5, 2.0],
  6: [0.5, 0.7, 1.0, 1.5, 2.0, 3.0],
};

type TierDef = { id: string; label: string; multiplier: number };
type SubTypeDef = { id: string; label: string; basePrice: number; type: "complexity" | "tier" | "none"; complexityLevels?: number; tiers?: TierDef[] };
type ServiceDef = { id: string; label: string; basePrice?: number; type?: "complexity" | "tier" | "none" | "color-variant"; complexityLevels?: number; tiers?: TierDef[]; subTypes?: SubTypeDef[] };

const ALL_SERVICES: ServiceDef[] = [
  { id: "clipping-path", label: "Clipping path", basePrice: 0.39, type: "complexity", complexityLevels: 6 },
  { id: "multi-clipping-path", label: "Multi-clipping path", basePrice: 1.19, type: "complexity", complexityLevels: 4 },
  { id: "image-masking", label: "Image masking", basePrice: 1.19, type: "complexity", complexityLevels: 5 },
  { id: "background-removal", label: "Background removal", basePrice: 0.39, type: "none" },
  { id: "shadow", label: "Shadow", subTypes: [
    { id: "drop", label: "Drop shadow", basePrice: 0.25, type: "none" },
    { id: "existing", label: "Existing shadow", basePrice: 0.25, type: "none" },
    { id: "floating", label: "Floating shadow", basePrice: 0.28, type: "none" },
    { id: "natural", label: "Natural shadow", basePrice: 0.25, type: "complexity", complexityLevels: 3 },
    { id: "reflection", label: "Reflection shadow", basePrice: 0.30, type: "complexity", complexityLevels: 3 },
  ]},
  { id: "photo-retouching", label: "Photo retouching", subTypes: [
    { id: "dust-spot-scratch", label: "Dust, spot and scratch removal", basePrice: 0.69, type: "tier", tiers: [
      { id: "basic", label: "Basic retouching", multiplier: 0.8 },
      { id: "advance", label: "Advance retouching", multiplier: 1.2 },
    ]},
    { id: "wrinkle-clothing", label: "Wrinkle on clothing", basePrice: 0.79, type: "tier", tiers: [
      { id: "basic", label: "Basic retouching", multiplier: 1.0 },
      { id: "advance", label: "Advance retouching", multiplier: 1.4 },
    ]},
    { id: "beauty-airbrushing", label: "Beauty airbrushing", basePrice: 0.89, type: "tier", tiers: [
      { id: "basic", label: "Basic retouching", multiplier: 1.0 },
      { id: "advance", label: "Advance retouching", multiplier: 1.5 },
    ]},
    { id: "camera-reflection", label: "Camera reflection removal", basePrice: 0.99, type: "tier", tiers: [
      { id: "basic", label: "Basic retouching", multiplier: 1.0 },
      { id: "advance", label: "Advance retouching", multiplier: 1.4 },
    ]},
  ]},
  { id: "symmetrical-edit", label: "Symmetrical edit", basePrice: 0.79, type: "none" },
  { id: "ghost-mannequin", label: "Ghost mannequin", basePrice: 0.89, type: "complexity", complexityLevels: 2 },
  { id: "color-change", label: "Color change", basePrice: 0.99, type: "color-variant" },
  { id: "car-editing", label: "Car editing", basePrice: 2.99, type: "none" },
];

const TURNAROUND_OPTIONS = [
  { id: "6", label: "6-8 Hours", desc: "Flash Sale Rush", surcharge: 0.15, rush: true },
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
  complexity?: number;
  tier?: string;
  colorCodes?: string[];
};

type ServiceInfo = {
  def: ServiceDef;
  subType?: SubTypeDef;
  effectiveType: "complexity" | "tier" | "none" | "color-variant";
  effectiveBasePrice: number;
  effectiveComplexityLevels: number;
  effectiveTiers: TierDef[];
};

const getSelKey = (svcId: string, subTypeId?: string) => (subTypeId ? `${svcId}:${subTypeId}` : svcId);

const getService = (selKey: string): ServiceInfo | undefined => {
  for (const svc of ALL_SERVICES) {
    if (!svc.subTypes && svc.id === selKey) {
      const t = svc.type ?? "none";
      return {
        def: svc, effectiveType: t, effectiveBasePrice: svc.basePrice ?? 0,
        effectiveComplexityLevels: svc.complexityLevels ?? 6, effectiveTiers: svc.tiers ?? [],
      };
    }
    if (svc.subTypes) {
      for (const st of svc.subTypes) {
        if (`${svc.id}:${st.id}` === selKey) {
          return {
            def: svc, subType: st, effectiveType: st.type,
            effectiveBasePrice: st.basePrice, effectiveComplexityLevels: st.complexityLevels ?? 6,
            effectiveTiers: st.tiers ?? [],
          };
        }
      }
    }
  }
};

const getMultiplier = (info: ServiceInfo, sel: ServiceSelection): number => {
  if (info.effectiveType === "complexity") {
    const mults = COMPLEXITY_MULTIPLIERS[info.effectiveComplexityLevels] ?? COMPLEXITY_MULTIPLIERS[6];
    return mults[(sel.complexity ?? 1) - 1] ?? 1.0;
  }
  if (info.effectiveType === "tier") {
    const t = info.effectiveTiers.find(t => t.id === (sel.tier ?? "basic"));
    return t?.multiplier ?? 1.0;
  }
  return 1.0;
};

const getPricePerImage = (info: ServiceInfo, sel: ServiceSelection): number =>
  info.effectiveBasePrice * getMultiplier(info, sel);

const getDisplayLabel = (info: ServiceInfo, sel: ServiceSelection): string => {
  const base = info.subType?.label ?? info.def.label;
  if (info.effectiveType === "complexity") return `${base} (C${sel.complexity})`;
  if (info.effectiveType === "tier") {
    const t = info.effectiveTiers.find(t => t.id === sel.tier);
    return `${base} — ${t?.label ?? ""}`;
  }
  return base;
};

export default function ContactForm() {
  const [wantsQuote, setWantsQuote] = useState(true);
  const [selections, setSelections] = useState<Record<string, ServiceSelection>>({});
  const [expandedSvc, setExpandedSvc] = useState<string | null>(null);
  const [expandedSubType, setExpandedSubType] = useState<string | null>(null);
  const [totalImageCount, setTotalImageCount] = useState(1);
  const [turnaround, setTurnaround] = useState("24");
  const [fileOption, setFileOption] = useState("psd-original-multi");
  const [step, setStep] = useState(1);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [countryLoaded, setCountryLoaded] = useState(false);
  const [bypassInput, setBypassInput] = useState("");
  const [bypassError, setBypassError] = useState(false);
  const [commentsText, setCommentsText] = useState("");
  const [imageLinks, setImageLinks] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (wantsQuote) {
      data.set("quote_details", quoteSummary || "");
      data.set("turnaround", turnaroundOption?.label || "");
      data.set("file_format", selectedFileOpt?.label || "");
      data.set("image_links", imageLinks || "");
    }
    setSubmitStatus("sending");
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) setSubmitStatus("success");
      else {
        let msg = "Could not send your request.";
        try {
          const j = await res.json();
          if (j?.error) msg = j.error as string;
        } catch { /* ignore */ }
        setSubmitError(msg);
        setSubmitStatus("error");
      }
    } catch {
      setSubmitError("Network error while sending.");
      setSubmitStatus("error");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bypass = params.get("access");
    if (bypass) {
      setBypassCode(bypass);
      window.history.replaceState({}, "", window.location.pathname);
    }
    fetchCountryCode().then((code) => {
      setCountryCode(code);
      setCountryLoaded(true);
    });
  }, []);

  const blocked = countryLoaded && countryCode !== null && isCountryBlocked(countryCode) && !isAdmin();

  const hasSelection = (selKey: string): boolean => selKey in selections;

  const toggleExpand = (svcId: string) => {
    setExpandedSvc(expandedSvc === svcId ? null : svcId);
    setExpandedSubType(null);
  };

  const getDefaultSelection = (info: ServiceInfo): ServiceSelection => {
    if (info.effectiveType === "complexity") return { complexity: 1 };
    if (info.effectiveType === "tier") return { tier: "basic" };
    if (info.effectiveType === "color-variant") return { colorCodes: [""] };
    return {};
  };

  const handleSelect = (selKey: string) => {
    if (hasSelection(selKey)) { removeSelection(selKey); return; }
    const info = getService(selKey);
    if (!info) return;
    setSelections(prev => ({ ...prev, [selKey]: getDefaultSelection(info) }));
  };

  const handleSubTypeClick = (svcId: string, subTypeId: string) => {
    const selKey = getSelKey(svcId, subTypeId);
    if (hasSelection(selKey)) { removeSelection(selKey); return; }
    const info = getService(selKey);
    if (!info) return;
    setSelections(prev => ({ ...prev, [selKey]: getDefaultSelection(info) }));
    setExpandedSubType(subTypeId);
  };

  const selectComplexity = (selKey: string, level: number) => {
    setSelections(prev => {
      const existing = prev[selKey];
      if (existing?.complexity === level) {
        const n = { ...prev }; delete n[selKey]; return n;
      }
      return { ...prev, [selKey]: { ...existing ?? {}, complexity: level } };
    });
  };

  const selectTier = (selKey: string, tierId: string) => {
    setSelections(prev => ({ ...prev, [selKey]: { ...prev[selKey], tier: tierId } }));
  };

  const setColorCodes = (selKey: string, codes: string[]) => {
    setSelections(prev => {
      if (!prev[selKey]) return { ...prev, [selKey]: { colorCodes: codes } };
      return { ...prev, [selKey]: { ...prev[selKey], colorCodes: codes } };
    });
  };

  const addColorVariant = (selKey: string) => {
    setSelections(prev => {
      const existing = prev[selKey];
      if (!existing) return { ...prev, [selKey]: { colorCodes: [""] } };
      return { ...prev, [selKey]: { ...existing, colorCodes: [...(existing.colorCodes ?? []), ""] } };
    });
  };

  const removeColorVariant = (selKey: string, idx: number) => {
    setSelections(prev => {
      const existing = prev[selKey];
      if (!existing) return prev;
      const codes = existing.colorCodes?.filter((_, i) => i !== idx) ?? [];
      if (codes.length === 0) { const n = { ...prev }; delete n[selKey]; return n; }
      return { ...prev, [selKey]: { ...existing, colorCodes: codes } };
    });
  };

  const removeSelection = (selKey: string) => {
    setSelections(prev => { const n = { ...prev }; delete n[selKey]; return n; });
  };

  const turnaroundOption = TURNAROUND_OPTIONS.find(t => t.id === turnaround);
  const turnaroundSurcharge = turnaroundOption?.surcharge ?? 0;
  const selectedFileOpt = FILE_OPTIONS.find(f => f.id === fileOption);
  const imgCount = Math.max(1, totalImageCount);

  const { subtotal, discountApplies, discountAmount, turnaroundFee, total, orderedKeys } = useMemo(() => {
    let sub = 0;
    for (const [key, sel] of Object.entries(selections)) {
      const info = getService(key);
      if (!info) continue;
      sub += getPricePerImage(info, sel) * imgCount;
    }
    const applies = imgCount >= VOLUME_DISCOUNT_THRESHOLD;
    const discount = applies ? sub * VOLUME_DISCOUNT_RATE : 0;
    const base = sub - discount;
    const fee = base * turnaroundSurcharge;
    return {
      subtotal: sub, discountApplies: applies, discountAmount: discount,
      turnaroundFee: fee, total: base + fee, orderedKeys: Object.keys(selections),
    };
  }, [selections, imgCount, turnaroundSurcharge]);

  const quoteSummary = (() => {
    if (orderedKeys.length === 0) return "";
    const lines = orderedKeys.map((key) => {
      const info = getService(key);
      const sel = selections[key];
      if (!info || !sel) return "";
      const ppi = getPricePerImage(info, sel);
      return `- ${getDisplayLabel(info, sel)}: $${ppi.toFixed(2)}/img x ${imgCount}`;
    });
    lines.push(`Total images: ${imgCount}`);
    if (discountApplies) lines.push(`Volume discount: -$${discountAmount.toFixed(2)}`);
    if (turnaroundSurcharge !== 0) lines.push(`Turnaround (${TURNAROUND_OPTIONS.find(t => t.id === turnaround)?.label ?? ""}): $${turnaroundFee >= 0 ? "+" : ""}${turnaroundFee.toFixed(2)}`);
    lines.push(`File format: ${FILE_OPTIONS.find(f => f.id === fileOption)?.label ?? ""}`);
    if (commentsText) lines.push(`Comments: ${commentsText}`);
    if (imageLinks.trim()) lines.push(`Image links:\n${imageLinks.trim()}`);
    lines.push(`Estimated total: $${total.toFixed(2)}`);
    return lines.join("\n");
  })();

  const STEPS = [
    { id: 1, label: "Choose services" },
    { id: 2, label: "Details & preferences" },
    { id: 3, label: "Contact information" },
  ];

  const renderOptions = (selKey: string, info: ServiceInfo) => {
    const sel = selections[selKey];

    if (info.effectiveType === "color-variant") {
      const codes = sel?.colorCodes ?? [""];
      return (
        <div className="space-y-2">
          <p className="text-[12px] font-medium text-[rgb(var(--fg-rgb)/40%)]">
            For each color variant, provide a color code or approximate name. If you have swatch files or color reference images, simply note them here.
          </p>
          {codes.map((code, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[rgb(var(--fg-rgb)/40%)] shrink-0 w-24">Color Variant {idx + 1}</span>
              <input type="text" value={code}
                onChange={e => { const next = [...codes]; next[idx] = e.target.value; setColorCodes(selKey, next); }}
                placeholder="Color code or name (e.g. #FF5733, Royal Blue)"
                className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-xs text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)]" />
              {codes.length > 1 && (
                <button type="button" onClick={() => removeColorVariant(selKey, idx)}
                  className="w-6 h-6 rounded flex items-center justify-center text-[rgb(var(--fg-rgb)/30%)] hover:text-red-400 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addColorVariant(selKey)}
            className="text-[11px] font-bold text-[rgb(var(--accent-text))] hover:text-[rgb(var(--accent-text))] transition-colors">+ Add another variant</button>
        </div>
      );
    }

    if (info.effectiveType === "complexity") {
      const mults = COMPLEXITY_MULTIPLIERS[info.effectiveComplexityLevels] ?? COMPLEXITY_MULTIPLIERS[6];
      return (
        <div>
          <p className="text-[12px] font-medium text-[rgb(var(--fg-rgb)/40%)] mb-3">
            How complex are your images? Choose the average for this order.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(mults.length, 6)}, minmax(0, 1fr))` }} className="gap-2">
            {mults.map((mult, i) => {
              const level = i + 1;
              const price = info.effectiveBasePrice * mult;
              const isActive = sel?.complexity === level;
              return (
                <button key={level} type="button" onClick={() => selectComplexity(selKey, level)}
                  className={`rounded-xl py-3.5 px-2 text-center border transition-all ${
                    isActive ? "border-[rgb(var(--accent-500)/60%)] bg-[rgb(var(--accent-500)/10%)]" : "border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)] hover:border-[rgb(var(--fg-rgb)/15%)]"
                  }`}>
                  <p className={`text-sm font-semibold leading-tight ${isActive ? "text-[rgb(var(--accent-text))]" : "text-[rgb(var(--fg-rgb))]"}`}>Complexity {level}</p>
                  <p className="text-xs font-bold text-[rgb(var(--fg-rgb)/40%)] mt-1">${price.toFixed(2)}/img</p>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (info.effectiveType === "tier") {
      return (
        <div>
          <p className="text-[12px] font-medium text-[rgb(var(--fg-rgb)/40%)] mb-3">Select the type.</p>
          <div className="flex gap-2">
            {info.effectiveTiers.map(t => {
              const price = info.effectiveBasePrice * t.multiplier;
              const isActive = sel?.tier === t.id;
              return (
                <button key={t.id} type="button" onClick={() => selectTier(selKey, t.id)}
                  className={`flex-1 rounded-xl py-2.5 px-3 text-center border transition-all ${
                    isActive ? "border-[rgb(var(--accent-500)/60%)] bg-[rgb(var(--accent-500)/10%)]" : "border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)] hover:border-[rgb(var(--fg-rgb)/15%)]"
                  }`}>
                  <p className={`text-[11px] font-bold ${isActive ? "text-[rgb(var(--accent-text))]" : "text-[rgb(var(--fg-rgb))]"}`}>{t.label}</p>
                  <p className="text-[10px] font-bold text-[rgb(var(--fg-rgb)/40%)] mt-0.5">${price.toFixed(2)}/img</p>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  const getSummaryText = (selKey: string): string => {
    const info = getService(selKey);
    const sel = selections[selKey];
    if (!info || !sel) return "";
    const ppi = getPricePerImage(info, sel);
    if (info.effectiveType === "complexity") return `C${sel.complexity} — $${ppi.toFixed(2)}/img`;
    if (info.effectiveType === "tier") {
      const t = info.effectiveTiers.find(t => t.id === sel.tier);
      return `${t?.label ?? ""} — $${ppi.toFixed(2)}/img`;
    }
    if (info.effectiveType === "color-variant") {
      const count = sel.colorCodes?.filter(c => c.trim()).length ?? 0;
      return `${count} variant(s) — $${info.effectiveBasePrice.toFixed(2)}/img`;
    }
    return `$${info.effectiveBasePrice.toFixed(2)}/img`;
  };

  const handleBypassSubmit = () => {
    if (!bypassInput.trim()) return;
    setBypassCode(bypassInput.trim());
    if (isAdmin()) {
      setBypassError(false);
      setCountryCode(null);
      setCountryLoaded(false);
      fetchCountryCode().then((code) => { setCountryCode(code); setCountryLoaded(true); });
    } else {
      setBypassError(true);
    }
  };

  if (blocked) {
    return (
      <div className="relative max-w-lg mx-auto py-20 px-6">
        <div className="glass-card rounded-3xl p-10 border-[rgb(var(--fg-rgb)/10%)] text-center">
          <div className="w-16 h-16 rounded-full bg-[rgb(239_68_68_/_10%)] flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[rgb(239_68_68)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" /></svg>
          </div>
          <h3 className="text-2xl font-bold text-[rgb(var(--fg-rgb))] mb-3">Access Restricted</h3>
          <p className="text-sm text-[rgb(var(--fg-rgb)/55%)] leading-relaxed mb-6">
            We&apos;re sorry, but our services are currently unavailable in your region. If you believe this is a mistake or have been granted access, please enter your access code below.
          </p>
          <div className="flex gap-2 max-w-xs mx-auto">
            <input type="text" value={bypassInput} onChange={e => { setBypassInput(e.target.value); setBypassError(false); }}
              placeholder="Access code"
              className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)]" />
            <button type="button" onClick={handleBypassSubmit}
              className="px-5 py-3 rounded-xl bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-sm hover:bg-[rgb(var(--accent-400))] transition-all">Submit</button>
          </div>
          {bypassError && <p className="text-[11px] text-red-400 mt-2">Invalid access code.</p>}
          <p className="text-[11px] text-[rgb(var(--fg-rgb)/30%)] mt-4">Contact the site administrator if you need access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-text))] font-bold mb-6">Get in Touch</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text">Get your custom quote</h3>
          <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)] max-w-xl mx-auto">
            Tell us what you need, and we&apos;ll send your custom quote within 45 minutes.
          </p>
        </div>

        <form action="/api/send" method="POST" onSubmit={handleSubmit} className="relative">
        <div className={submitStatus === "success" ? "hidden" : "grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8"}>
          <div>
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
                <div className="flex items-center gap-3 mb-8">
                  {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <button type="button" onClick={() => { if (s.id <= step) setStep(s.id); }}
                        className={`flex items-center gap-2 transition-all ${step === s.id ? "text-[rgb(var(--fg-rgb))]" : step > s.id ? "text-[rgb(var(--accent-text))]" : "text-[rgb(var(--fg-rgb)/25%)]"}`}>
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all ${
                          step === s.id ? "border-[rgb(var(--accent-500))] bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]" :
                          step > s.id ? "border-[rgb(var(--accent-400))] bg-[rgb(var(--accent-400)/15%)] text-[rgb(var(--accent-text))]" :
                          "border-[rgb(var(--fg-rgb)/15%)] text-[rgb(var(--fg-rgb)/30%)]"
                        }`}>{s.id}</span>
                        <span className="text-[11px] font-bold hidden sm:inline">{s.label}</span>
                      </button>
                      {i < STEPS.length - 1 && <div className={`w-8 h-px ${step > s.id ? "bg-[rgb(var(--accent-400)/40%)]" : "bg-[rgb(var(--fg-rgb)/10%)]"}`} />}
                    </div>
                  ))}
                </div>

                {/* ===== STEP 1: SERVICES ===== */}
                {step === 1 && (
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-[rgb(var(--fg-rgb))] mb-4">What kind of edits do you need today?</p>
                    <p className="text-[12px] text-[rgb(var(--fg-rgb)/40%)] -mt-3 mb-5">You can add multiple services for each set of edits.</p>

                    {ALL_SERVICES.map(svc => {
                      const isExpanded = expandedSvc === svc.id;
                      const hasAnySelection = svc.subTypes
                        ? svc.subTypes.some(st => hasSelection(getSelKey(svc.id, st.id)))
                        : hasSelection(svc.id);

                      let summaryLine = "";
                      if (hasAnySelection && !isExpanded) {
                        if (svc.subTypes) {
                          const parts: string[] = [];
                          for (const st of svc.subTypes) {
                            const key = getSelKey(svc.id, st.id);
                            if (hasSelection(key)) parts.push(getSummaryText(key));
                          }
                          summaryLine = parts.join(", ");
                        } else {
                          summaryLine = getSummaryText(svc.id);
                        }
                      }

                      return (
                        <div key={svc.id}
                          className={`rounded-2xl border transition-all overflow-hidden ${hasAnySelection ? "border-[rgb(var(--accent-500)/40%)] bg-[rgb(var(--accent-500)/2%)]" : "border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)]"}`}>
                          <div className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none"
                            onClick={() => {
                              if (!svc.subTypes && svc.type === "none") handleSelect(svc.id);
                              else toggleExpand(svc.id);
                            }}>
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-[rgb(var(--fg-rgb))]">{svc.label}</p>
                              {summaryLine && <p className="text-[10px] text-[rgb(var(--accent-text))] mt-0.5 font-medium">{summaryLine}</p>}
                            </div>
                            {(!svc.subTypes && svc.type === "none") ? (
                              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${hasAnySelection ? "bg-[rgb(var(--accent-500))] border-[rgb(var(--accent-500))]" : "border-[rgb(var(--fg-rgb)/20%)]"}`}>
                                {hasAnySelection && <svg className="w-3 h-3 text-[rgb(var(--accent-contrast))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                              </div>
                            ) : (
                              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${isExpanded ? "border-[rgb(var(--accent-500)/40%)] bg-[rgb(var(--accent-500)/8%)]" : "border-[rgb(var(--fg-rgb)/15%)]"}`}>
                                <svg className={`w-3.5 h-3.5 text-[rgb(var(--fg-rgb)/40%)] transition-transform ${isExpanded ? "rotate-45" : ""}`}
                                  fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                              </div>
                            )}
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="px-5 pb-5 pt-0 space-y-4 border-t border-[rgb(var(--fg-rgb)/5%)]">
                                  {!svc.subTypes ? (
                                    renderOptions(svc.id, getService(svc.id)!)
                                  ) : (
                                    <>
                                      <p className="text-[12px] font-medium text-[rgb(var(--fg-rgb)/40%)]">
                                        {svc.id === "shadow" ? "Select the type of shadow you want." :
                                         svc.id === "photo-retouching" ? "Select one or more types of photo retouching." : "Select a service type."}
                                      </p>
                                      <div className="space-y-2">
                                        {svc.subTypes.map(st => {
                                          const key = getSelKey(svc.id, st.id);
                                          const isSelected = hasSelection(key);
                                          const isSubExpanded = expandedSubType === st.id;
                                          const info = getService(key) as ServiceInfo;
                                          const isAutoSelect = st.type === "none";
                                          return (
                                            <div key={st.id}
                                              className={`rounded-xl border transition-all ${isSelected ? "border-[rgb(var(--accent-500)/40%)] bg-[rgb(var(--accent-500)/3%)]" : "border-[rgb(var(--fg-rgb)/6%)]"}`}>
                                              <div className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
                                                onClick={() => {
                                                  if (isAutoSelect) handleSubTypeClick(svc.id, st.id);
                                                  else {
                                                    setExpandedSubType(isSubExpanded ? null : st.id);
                                                    if (isSelected && isSubExpanded) removeSelection(key);
                                                    else if (!isSelected) handleSubTypeClick(svc.id, st.id);
                                                  }
                                                }}>
                                                <div className="flex-1">
                                                  <p className="text-[13px] font-semibold text-[rgb(var(--fg-rgb))]">{st.label}</p>
                                                  {isSelected && <p className="text-[10px] text-[rgb(var(--accent-text))] mt-0.5">{getSummaryText(key)}</p>}
                                                </div>
                                                {isAutoSelect ? (
                                                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? "bg-[rgb(var(--accent-500))] border-[rgb(var(--accent-500))]" : "border-[rgb(var(--fg-rgb)/20%)]"}`}>
                                                    {isSelected && <svg className="w-3 h-3 text-[rgb(var(--accent-contrast))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                  </div>
                                                ) : (
                                                  <svg className={`w-4 h-4 text-[rgb(var(--fg-rgb)/30%)] transition-transform ${isSubExpanded ? "rotate-180" : ""}`}
                                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                )}
                                              </div>
                                              <AnimatePresence>
                                                {isSelected && isSubExpanded && !isAutoSelect && (
                                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                    <div className="px-4 pb-4 pt-0 space-y-3 border-t border-[rgb(var(--fg-rgb)/5%)]">
                                                      {renderOptions(key, info)}
                                                    </div>
                                                  </motion.div>
                                                )}
                                                {isSelected && isAutoSelect && (
                                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                    <div className="px-4 pb-4 pt-0 border-t border-[rgb(var(--fg-rgb)/5%)]" />
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

                {/* ===== STEP 2: DETAILS & PREFERENCES ===== */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Add comments</label>
                      <textarea value={commentsText} onChange={e => setCommentsText(e.target.value)}
                        rows={3} placeholder="Describe your images or any special instructions..."
                        className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)] resize-none" />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Total number of images</label>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setTotalImageCount(Math.max(1, totalImageCount - 10))}
                          className="w-10 h-10 rounded-xl bg-[rgb(var(--fg-rgb)/6%)] flex items-center justify-center text-sm font-bold text-[rgb(var(--fg-rgb)/60%)] hover:bg-[rgb(var(--fg-rgb)/12%)] transition-all">−</button>
                        <input type="number" min={1} max={100000} value={totalImageCount}
                          onChange={e => setTotalImageCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                          className="w-24 px-3 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-center text-[rgb(var(--fg-rgb))] font-bold outline-none focus:border-[rgb(var(--accent-500)/50%)]" />
                        <button type="button" onClick={() => setTotalImageCount(totalImageCount + 10)}
                          className="w-10 h-10 rounded-xl bg-[rgb(var(--fg-rgb)/6%)] flex items-center justify-center text-sm font-bold text-[rgb(var(--fg-rgb)/60%)] hover:bg-[rgb(var(--fg-rgb)/12%)] transition-all">+</button>
                        {totalImageCount >= VOLUME_DISCOUNT_THRESHOLD && (
                          <span className="text-[11px] font-bold text-[rgb(var(--accent-text))]">10% discount applied</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Preferred file format</label>
                      <div className="relative">
                        <select value={fileOption} onChange={e => setFileOption(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)] appearance-none cursor-pointer">
                          <optgroup label="PSD">{FILE_OPTIONS.filter(f => f.id.startsWith("psd-")).map(f => (<option key={f.id} value={f.id}>{f.label}</option>))}</optgroup>
                          <optgroup label="TIF">{FILE_OPTIONS.filter(f => f.id.startsWith("tif-")).map(f => (<option key={f.id} value={f.id}>{f.label}</option>))}</optgroup>
                          <optgroup label="JPG">{FILE_OPTIONS.filter(f => f.id.startsWith("jpg-")).map(f => (<option key={f.id} value={f.id}>{f.label}</option>))}</optgroup>
                          <optgroup label="PNG">{FILE_OPTIONS.filter(f => f.id.startsWith("png-")).map(f => (<option key={f.id} value={f.id}>{f.label}</option>))}</optgroup>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[rgb(var(--fg-rgb)/30%)]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Turnaround time</label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {TURNAROUND_OPTIONS.map(opt => (
                          <button key={opt.id} type="button" onClick={() => setTurnaround(opt.id)}
                            className={`rounded-xl p-3 border text-center transition-all relative ${turnaround === opt.id ? "border-[rgb(var(--accent-500)/50%)] bg-[rgb(var(--accent-500)/8%)]" : "border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--fg-rgb)/15%)]"}`}>
                            {opt.rush && <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-[8px] font-bold text-black uppercase">Rush</span>}
                            <p className="text-xs font-bold text-[rgb(var(--fg-rgb))]">{opt.label}</p>
                            <p className="text-[10px] text-[rgb(var(--fg-rgb)/40%)]">{opt.desc}</p>
                            <p className={`text-[10px] font-bold mt-0.5 ${opt.surcharge > 0 ? "text-amber-400" : opt.surcharge < 0 ? "text-[rgb(var(--accent-text))]" : "text-[rgb(var(--fg-rgb)/30%)]"}`}>
                              {opt.surcharge > 0 ? `+${opt.surcharge * 100}%` : opt.surcharge < 0 ? `${opt.surcharge * 100}%` : "Base price"}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Your image links (optional)</label>
                      <textarea value={imageLinks} onChange={e => setImageLinks(e.target.value)}
                        rows={3} placeholder="Paste your Dropbox, Google Drive, or WeTransfer links here...&#10;You can add multiple links, one per line."
                        className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)] resize-none" />
                      <p className="text-[11px] text-[rgb(var(--fg-rgb)/35%)] mt-1.5">Share your files via any preferred method. We&apos;ll access them after you confirm the quote.</p>
                    </div>

                    <div className="rounded-xl border border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)] p-4">
                      <p className="text-[11px] font-bold text-[rgb(var(--fg-rgb)/50%)] uppercase tracking-wider mb-2">How to share your files</p>
                      <p className="text-[12px] text-[rgb(var(--fg-rgb)/50%)] leading-relaxed">
                        After submitting, we&apos;ll send a quote via email. Once confirmed, you can share your files using Dropbox, Google Drive, or WeTransfer — and we&apos;ll send you a download link for the edited images.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(1)}
                        className="px-6 py-3 rounded-xl border border-[rgb(var(--fg-rgb)/15%)] text-sm font-bold text-[rgb(var(--fg-rgb)/60%)] hover:border-[rgb(var(--fg-rgb)/30%)] transition-all">← Back</button>
                      <button type="button" onClick={() => setStep(3)}
                        className="flex-1 py-3 rounded-xl bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-sm hover:bg-[rgb(var(--accent-400))] transition-all">CONTINUE →</button>
                    </div>
                  </div>
                )}

                {/* ===== STEP 3: CONTACT INFO ===== */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <input type="text" name="name" placeholder="Your name" required value={name} onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)]" />
                      <input type="email" name="email" placeholder="Email address" required value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)]" />
                      <textarea name="message" rows={3} placeholder="Anything else we should know? (optional)" value={message} onChange={e => setMessage(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)] resize-none" />
                    </div>
                    <input type="hidden" name="quote_details" value={quoteSummary} />
                    <input type="hidden" name="turnaround" value={turnaroundOption?.label} />
                    <input type="hidden" name="file_format" value={selectedFileOpt?.label} />
                    <input type="hidden" name="image_links" value={imageLinks} />
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(2)}
                        className="px-6 py-3 rounded-xl border border-[rgb(var(--fg-rgb)/15%)] text-sm font-bold text-[rgb(var(--fg-rgb)/60%)] hover:border-[rgb(var(--fg-rgb)/30%)] transition-all">← Back</button>
                      <button type="submit" disabled={submitStatus === "sending" || submitStatus === "success"}
                        className="flex-1 py-3.5 rounded-xl bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-sm hover:bg-[rgb(var(--accent-400))] hover:scale-[1.01] transition-all disabled:opacity-60 disabled:hover:scale-100">
                        {submitStatus === "sending" ? "Sending..." : "Submit Quote Request"}
                      </button>
                    </div>
                    <p className="text-[11px] text-[rgb(var(--fg-rgb)/35%)] text-center">We respond within 45 minutes.</p>
                  </div>
                )}
              </>
            ) : (
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
                <button type="submit" disabled={submitStatus === "sending" || submitStatus === "success"}
                  className={`w-full sm:w-auto px-10 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm disabled:opacity-60 disabled:hover:scale-100 ${submitStatus === "success" ? "hidden" : ""}`}>
                  {submitStatus === "sending" ? "Sending..." : "Send Message"}
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
                    <p className="text-[11px] text-[rgb(var(--fg-rgb)/35%)]">{imgCount} image{imgCount > 1 ? "s" : ""}</p>
                    <AnimatePresence>
                      {orderedKeys.map(key => {
                        const info = getService(key);
                        const sel = selections[key];
                        if (!info || !sel) return null;
                        const ppi = getPricePerImage(info, sel);
                        const lineTotal = ppi * imgCount;
                        const label = info.subType?.label ?? info.def.label;
                        return (
                          <motion.div key={key} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-sm text-[rgb(var(--fg-rgb)/70%)] truncate">{label}</p>
                                <p className="text-[10px] text-[rgb(var(--fg-rgb)/35%)]">{getSummaryText(key)}</p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="font-semibold text-sm text-[rgb(var(--fg-rgb))]">${lineTotal.toFixed(2)}</span>
                                <button type="button" onClick={() => removeSelection(key)}
                                  className="w-4 h-4 rounded flex items-center justify-center text-[rgb(var(--fg-rgb)/20%)] hover:text-red-400 transition-colors">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    <div className="pt-4 mt-4 border-t border-[rgb(var(--fg-rgb)/10%)] space-y-2">
                      <div className="flex justify-between text-sm text-[rgb(var(--fg-rgb)/50%)]"><span>Images</span><span>{imgCount}</span></div>
                      <div className="flex justify-between text-sm text-[rgb(var(--fg-rgb)/50%)]"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                      {discountApplies && <div className="flex justify-between text-sm text-[rgb(137_243_54)]"><span>Volume discount</span><span>−${discountAmount.toFixed(2)}</span></div>}
                      {turnaroundSurcharge !== 0 && (
                        <div className={`flex justify-between text-sm ${turnaroundSurcharge > 0 ? "text-amber-400" : "text-[rgb(var(--accent-text))]"}`}>
                          <span>{turnaroundOption?.label}</span><span>{turnaroundFee >= 0 ? "+" : ""}${turnaroundFee.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-[rgb(var(--fg-rgb)/10%)]">
                        <span className="font-bold text-[rgb(var(--fg-rgb))]">Estimated Total</span>
                        <motion.span key={total.toFixed(2)} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }}
                          className="text-2xl font-bold gradient-text">${total.toFixed(2)}</motion.span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card rounded-[2rem] p-8 border-[rgb(var(--fg-rgb)/10%)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[rgb(var(--accent-500)/12%)] flex items-center justify-center">
                    <svg className="w-4 h-4 text-[rgb(var(--accent-text))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  </div>
                  <h4 className="text-lg font-bold text-[rgb(var(--fg-rgb))]">Send a Message</h4>
                </div>
                <p className="mt-4 text-sm text-[rgb(var(--fg-rgb)/50%)]">We&apos;ll get back to you within 45 minutes.</p>
                <div className="mt-6 space-y-3">
                  <a href="https://wa.me/8801723735896" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl glass-card border border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(137_243_54_/_50%)] transition-all text-sm text-[rgb(var(--fg-rgb)/70%)] hover:text-[rgb(137_243_54)]">
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    Chat on WhatsApp
                  </a>
                  <a href="mailto:pathpixhub@gmail.com"
                    className="flex items-center gap-3 p-3 rounded-xl glass-card border border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--accent-500)/50%)] transition-all text-sm text-[rgb(var(--fg-rgb)/70%)] hover:text-[rgb(var(--accent-text))]">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Send us an Email
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {submitStatus === "success" && (
          <div className="glass-card rounded-[2rem] p-10 border-[rgb(var(--fg-rgb)/10%)] text-center">
            <div className="w-16 h-16 rounded-full bg-[rgb(137_243_54_/_12%)] flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[rgb(137_243_54)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-3xl font-bold tracking-tight text-[rgb(var(--fg-rgb))]">{wantsQuote ? "Request Received!" : "Message Sent!"}</h3>
            <p className="mt-4 text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">
              {wantsQuote ? (
                <>Thank you for trusting us! We&apos;ve received your images and will start on your edits right away. Once your work is done, we&apos;ll email you your <span className="font-bold text-[rgb(137_243_54)]">secure payment link</span> — pay only when you&apos;re happy with the results.</>
              ) : (
                <>Thank you for reaching out! We&apos;ll get back to you within <span className="font-bold text-[rgb(137_243_54)]">45 minutes</span>.</>
              )}
            </p>
            <button type="button" onClick={() => setSubmitStatus("idle")}
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full glass-card text-[rgb(var(--fg-rgb))] font-bold border border-[rgb(var(--fg-rgb)/10%)] hover:border-[rgb(var(--accent-500)/50%)] transition-all text-sm">
              Send Another Request
            </button>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="glass-card rounded-[2rem] p-8 border border-red-400/40 text-center">
            <p className="text-sm text-red-400 leading-relaxed">{submitError} Please try again, or email us directly at <a href="mailto:pathpixhub@gmail.com" className="underline">pathpixhub@gmail.com</a>.</p>
            <button type="button" onClick={() => { setSubmitStatus("idle"); setSubmitError(""); }}
              className="mt-6 px-6 py-3 rounded-full glass-card text-[rgb(var(--fg-rgb))] font-semibold border border-[rgb(var(--fg-rgb)/10%)] hover:border-[rgb(var(--accent-500)/50%)] transition-all text-sm">
              Try Again
            </button>
          </div>
        )}
        </form>
      </div>
    </div>
  );
}
