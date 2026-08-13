"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCountryCode, isCountryBlocked, setBypassCode, isAdmin } from "@/lib/countryBlocker";
import { isOrderRef } from "@/lib/orderRef";
import { createClient as createSupabaseClient, supabaseConfigured } from "@/lib/supabase/client";

const VOLUME_DISCOUNT_THRESHOLD = 500;
const VOLUME_DISCOUNT_RATE = 0.1;

type PriceTier = { id: string; label: string; price: number };
type SubTypeDef = { id: string; label: string; price: number; type: "tier" | "none"; tiers?: PriceTier[] };
type ServiceDef = { id: string; label: string; price?: number; type?: "tier" | "none" | "color-variant"; tiers?: PriceTier[]; subTypes?: SubTypeDef[] };

const cp = (entries: [string, number][]): PriceTier[] =>
  entries.map(([label, price]) => ({ id: `cat-${label}`, label: `Cat ${label}`, price }));

const CLIPPING_PATH_TIERS = cp([
  ["1", 0.39], ["1.5", 0.54], ["2", 0.69], ["2.5", 0.99], ["3", 1.29],
  ["3.5", 2.14], ["4", 2.99], ["4.5", 4.74], ["5", 6.49], ["5.5", 8.74], ["6", 10.99],
]);

const MULTI_CLIPPING_PATH_TIERS = cp([
  ["1", 1.19], ["2", 2.29], ["2.5", 4.39], ["3", 6.49], ["3.5", 8.74], ["4", 10.99],
]);

const IMAGE_MASKING_TIERS = cp([
  ["1", 1.19], ["2", 1.69], ["2.5", 2.04], ["3", 2.39], ["3.25", 3.04], ["3.5", 3.69],
  ["3.75", 4.34], ["4", 4.99], ["4.5", 6.99], ["5", 8.99],
]);

const NATURAL_SHADOW_TIERS = cp([["1", 0.69], ["2", 1.29], ["3", 2.99]]);
const REFLECTION_SHADOW_TIERS = cp([["1", 0.69], ["2", 1.29], ["3", 2.99]]);
const ADDITIONAL_COPY_PRICE = 0.20;

const ALL_SERVICES: ServiceDef[] = [
  { id: "path-creation", label: "Path creation", subTypes: [
    { id: "clipping-path", label: "Clipping path", price: 0.39, type: "tier", tiers: CLIPPING_PATH_TIERS },
    { id: "multi-clipping-path", label: "Multi-clipping path", price: 1.19, type: "tier", tiers: MULTI_CLIPPING_PATH_TIERS },
  ]},
  { id: "masking-bg-removal", label: "Image masking & background removal", subTypes: [
    { id: "image-masking", label: "Image masking", price: 1.19, type: "tier", tiers: IMAGE_MASKING_TIERS },
    { id: "background-removal", label: "Background removal", price: 0.39, type: "none" },
  ]},
  { id: "shadow", label: "Shadow", subTypes: [
    { id: "drop", label: "Drop shadow", price: 0.25, type: "none" },
    { id: "existing", label: "Existing shadow", price: 0.69, type: "none" },
    { id: "floating", label: "Floating shadow", price: 0.25, type: "none" },
    { id: "natural", label: "Natural shadow", price: 0.69, type: "tier", tiers: NATURAL_SHADOW_TIERS },
    { id: "reflection", label: "Reflection shadow", price: 0.69, type: "tier", tiers: REFLECTION_SHADOW_TIERS },
  ]},
  { id: "photo-retouching", label: "Photo retouching", subTypes: [
    { id: "dust-spot-scratch", label: "Dust, spot and scratch removal", price: 0.69, type: "tier", tiers: cp([["1", 0.69], ["1.5", 1.59], ["2", 2.49]]) },
    { id: "wrinkle-clothing", label: "Wrinkle on clothing", price: 0.99, type: "tier", tiers: cp([["1", 0.99], ["2", 1.79]]) },
    { id: "beauty-airbrushing", label: "Beauty airbrushing", price: 0.99, type: "tier", tiers: cp([["1", 0.99], ["2", 1.79]]) },
    { id: "camera-reflection", label: "Camera reflection removal", price: 0.79, type: "tier", tiers: cp([["1", 0.79], ["1.5", 1.89], ["2", 2.99]]) },
  ]},
  { id: "symmetrical-edit", label: "Symmetrical edit", price: 2.99, type: "none" },
  { id: "ghost-mannequin", label: "Ghost mannequin", price: 0.89, type: "tier", tiers: cp([["1", 0.89], ["2", 1.79]]) },
  { id: "color-change", label: "Color change", price: 0.99, type: "color-variant" },
  { id: "car-editing", label: "Car editing", price: 2.99, type: "none" },
];

const TURNAROUND_OPTIONS = [
  { id: "6", label: "6 Hours", desc: "Flash Sale Rush", surcharge: 0.5, rush: true },
  { id: "12", label: "12 Hours", desc: "Fast delivery", surcharge: 0.14 },
  { id: "24", label: "24 Hours", desc: "Standard", surcharge: 0 },
  { id: "48", label: "48 Hours", desc: "Relaxed", surcharge: -0.04 },
  { id: "96", label: "96 Hours+", desc: "Flexible", surcharge: -0.07 },
];

const FILE_FORMATS = [
  { id: "jpg", label: "JPG", backgrounds: ["original", "white"] },
  { id: "png", label: "PNG", backgrounds: ["transparent", "white"] },
  { id: "psd", label: "PSD", backgrounds: ["white", "transparent", "original", "mask"] },
  { id: "tif", label: "TIF", backgrounds: ["white", "transparent", "original", "mask"] },
] as const;

type FileFormatId = (typeof FILE_FORMATS)[number]["id"];
type FileBackground = "original" | "white" | "transparent" | "mask";
type LayerStructure = "single" | "multiple";

const BACKGROUND_LABELS: Record<FileBackground, string> = {
  original: "Original Background",
  white: "White Background",
  transparent: "Transparent Background",
  mask: "Layer Mask",
};

const FILE_FORMAT_LABELS: Record<FileFormatId, string> = {
  jpg: "JPG",
  png: "PNG",
  psd: "PSD",
  tif: "TIF",
};

const formatAllowsLayers = (fmt: FileFormatId): boolean => fmt === "psd" || fmt === "tif";

const FILE_FORMAT_OPTION_LIST: { fmt: FileFormatId; bg: FileBackground }[] = [
  { fmt: "psd", bg: "white" }, { fmt: "psd", bg: "transparent" }, { fmt: "psd", bg: "original" }, { fmt: "psd", bg: "mask" },
  { fmt: "tif", bg: "white" }, { fmt: "tif", bg: "transparent" }, { fmt: "tif", bg: "original" }, { fmt: "tif", bg: "mask" },
  { fmt: "jpg", bg: "original" }, { fmt: "jpg", bg: "white" },
  { fmt: "png", bg: "transparent" }, { fmt: "png", bg: "white" },
];

const buildFileFormatLabel = (fmt: FileFormatId | null, bg: FileBackground | null, layer: LayerStructure | null, resizeW: string, resizeH: string): string => {
  if (!fmt || !bg) return "Not selected";
  const base = `${FILE_FORMAT_LABELS[fmt]} — ${BACKGROUND_LABELS[bg]}`;
  const layerPart = layer ? `, ${layer === "multiple" ? "Multiple Layer" : "Single Layer"}` : "";
  const rw = parseInt(resizeW, 10), rh = parseInt(resizeH, 10);
  const resizePart = rw > 0 && rh > 0 ? `, Resize: ${rw}x${rh} px` : "";
  return `${base}${layerPart}${resizePart}`;
};

type ServiceSelection = {
  subTypeId?: string;
  tier?: string;
  colorCodes?: string[];
};

type ServiceInfo = {
  def: ServiceDef;
  subType?: SubTypeDef;
  effectiveType: "tier" | "none" | "color-variant";
  effectivePrice: number;
  effectiveTiers: PriceTier[];
};

const getSelKey = (svcId: string, subTypeId?: string) => (subTypeId ? `${svcId}:${subTypeId}` : svcId);

const getService = (selKey: string): ServiceInfo | undefined => {
  for (const svc of ALL_SERVICES) {
    if (!svc.subTypes && svc.id === selKey) {
      const t = svc.type ?? "none";
      return {
        def: svc, effectiveType: t, effectivePrice: svc.price ?? 0,
        effectiveTiers: svc.tiers ?? [],
      };
    }
    if (svc.subTypes) {
      for (const st of svc.subTypes) {
        if (`${svc.id}:${st.id}` === selKey) {
          return {
            def: svc, subType: st, effectiveType: st.type,
            effectivePrice: st.price, effectiveTiers: st.tiers ?? [],
          };
        }
      }
    }
  }
};

const getPricePerImage = (info: ServiceInfo, sel: ServiceSelection): number => {
  if (info.effectiveType === "tier") {
    const t = info.effectiveTiers.find(t => t.id === sel.tier);
    return t?.price ?? info.effectivePrice;
  }
  return info.effectivePrice;
};

const getDisplayLabel = (info: ServiceInfo, sel: ServiceSelection): string => {
  const base = info.subType?.label ?? info.def.label;
  if (info.effectiveType === "tier") {
    const t = info.effectiveTiers.find(t => t.id === sel.tier);
    return `${base} — ${t?.label ?? ""}`;
  }
  return base;
};

export default function ContactForm() {
  const [wantsQuote, setWantsQuote] = useState(true);
  const [selections, setSelections] = useState<Record<string, ServiceSelection>>({});
  const [hasExistingClippingPath, setHasExistingClippingPath] = useState(false);
  const [expandedSvc, setExpandedSvc] = useState<string | null>(null);
  const [expandedSubType, setExpandedSubType] = useState<string | null>(null);
  const [totalImageCount, setTotalImageCount] = useState(1);
  const [turnaround, setTurnaround] = useState("24");
  const [fileFormat, setFileFormat] = useState<FileFormatId | null>("psd");
  const [fileBackground, setFileBackground] = useState<FileBackground | null>("white");
  const [layerStructure, setLayerStructure] = useState<LayerStructure | null>("multiple");
  const [fileBoxOpen, setFileBoxOpen] = useState(false);
  const [wantResize, setWantResize] = useState<"yes" | "no">("no");
  const [resizeWidth, setResizeWidth] = useState("");
  const [resizeHeight, setResizeHeight] = useState("");
  const [wantAdditionalCopy, setWantAdditionalCopy] = useState(false);
  const [additionalCopyFormat, setAdditionalCopyFormat] = useState<FileFormatId | null>(null);
  const [additionalCopyBackground, setAdditionalCopyBackground] = useState<FileBackground | null>(null);
  const [additionalCopyLayer, setAdditionalCopyLayer] = useState<LayerStructure | null>(null);
  const [additionalCopyBoxOpen, setAdditionalCopyBoxOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [countryLoaded, setCountryLoaded] = useState(false);
  const [bypassInput, setBypassInput] = useState("");
  const [bypassError, setBypassError] = useState(false);
  const [commentsText, setCommentsText] = useState("");
  const [imageLinks, setImageLinks] = useState("");
  const [colorRefFiles, setColorRefFiles] = useState<File[]>([]);
  const [colorRefLinks, setColorRefLinks] = useState("");
  const [colorRefUploading, setColorRefUploading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const [lastOrderRef, setLastOrderRef] = useState("");
  const [paymentTiming, setPaymentTiming] = useState<"now" | "7" | "15" | "monthly">("now");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const orderRef = "";

    if (wantsQuote && paymentTiming === "now" && total > 0) {
      const params = new URLSearchParams({
        plan: "Custom Quote",
        amount: total.toFixed(2),
        desc: quoteSummary || "Photo editing quote",
        name: name || "",
        email: email || "",
        images: String(imgCount),
        payment_timing: "now",
        ref: orderRef,
      });
      setLastOrderRef(orderRef);
      window.location.href = `/payment?${params.toString()}`;
      return;
    }

    const data = new FormData(form);
    data.set("order_ref", orderRef);
    data.set("order_title", quoteSummary.split("\n")[0]?.replace(/^- /, "") || "Photo editing request");
    data.set("image_count", String(imgCount));
    data.set("estimated_total", total > 0 ? total.toFixed(2) : "");
    if (wantsQuote) {
      data.set("quote_details", quoteSummary || "");
      data.set("turnaround", turnaroundOption?.label || "");
      data.set("file_format", fileFormatLabel);
      data.set("image_links", imageLinks || "");
      data.set("payment_timing", paymentTiming);
    }
    if (colorRefFiles.length > 0) {
      for (const file of colorRefFiles) data.append("images", file);
    }
    if (colorRefLinks.trim()) {
      data.set("color_reference_links", colorRefLinks.trim());
    }
    setSubmitStatus("sending");
    if (colorRefFiles.length > 0 && supabaseConfigured()) {
      setColorRefUploading(true);
      try {
        const sb = createSupabaseClient();
        const folder = `supporting/${Date.now()}`;
        for (const file of colorRefFiles) {
          const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
          const path = `${folder}/${crypto.randomUUID()}.${ext}`;
          await sb.storage.from("client-uploads").upload(path, file, {
            contentType: file.type || "image/jpeg",
            cacheControl: "3600",
          });
        }
      } catch {
        // storage upload failed — files are still attached to the email
      }
      setColorRefUploading(false);
    }
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        try {
          const j = await res.json();
          if (j?.order_ref && isOrderRef(j.order_ref)) setLastOrderRef(j.order_ref);
          else setLastOrderRef(orderRef);
        } catch {
          setLastOrderRef(orderRef);
        }
        setSubmitStatus("success");
      }
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
    if (info.effectiveType === "tier") return { tier: info.effectiveTiers[0]?.id };
    if (info.effectiveType === "color-variant") return { colorCodes: [""] };
    return {};
  };

  const handleSelect = (selKey: string) => {
    if (hasSelection(selKey)) { removeSelection(selKey); return; }
    const info = getService(selKey);
    if (!info) return;
    setSelections(prev => ({ ...prev, [selKey]: getDefaultSelection(info) }));
    if (isPathOrMaskingKey(selKey)) setHasExistingClippingPath(false);
  };

  const handleSubTypeClick = (svcId: string, subTypeId: string) => {
    const selKey = getSelKey(svcId, subTypeId);
    if (hasSelection(selKey)) { removeSelection(selKey); return; }
    const info = getService(selKey);
    if (!info) return;
    setSelections(prev => ({ ...prev, [selKey]: getDefaultSelection(info) }));
    setExpandedSubType(subTypeId);
    if (isPathOrMaskingKey(selKey)) setHasExistingClippingPath(false);
  };

  const selectTier = (selKey: string, tierId: string) => {
    setSelections(prev => {
      const existing = prev[selKey];
      if (existing?.tier === tierId) {
        const n = { ...prev }; delete n[selKey]; return n;
      }
      return { ...prev, [selKey]: { ...existing ?? {}, tier: tierId } };
    });
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
  const fileFormatLabel = buildFileFormatLabel(fileFormat, fileBackground, layerStructure, resizeWidth, resizeHeight);
  const imgCount = Math.max(1, totalImageCount);

  const hasColorChange = hasSelection("color-change");
  const isPathOrMaskingKey = (key: string) =>
    key === "path-creation:clipping-path" ||
    key === "path-creation:multi-clipping-path" ||
    key === "masking-bg-removal:image-masking";
  const hasPathOrMaskingService = [
    "path-creation:clipping-path",
    "path-creation:multi-clipping-path",
    "masking-bg-removal:image-masking",
  ].some(k => hasSelection(k));
  const colorNeedsPathService = hasColorChange && !hasPathOrMaskingService && !hasExistingClippingPath;

  const { subtotal, discountApplies, discountAmount, turnaroundFee, total, orderedKeys } = useMemo(() => {
    let sub = 0;
    for (const [key, sel] of Object.entries(selections)) {
      const info = getService(key);
      if (!info) continue;
      sub += getPricePerImage(info, sel) * imgCount;
    }
    const additionalCopyCost = wantAdditionalCopy ? ADDITIONAL_COPY_PRICE * imgCount : 0;
    sub += additionalCopyCost;
    const applies = imgCount >= VOLUME_DISCOUNT_THRESHOLD;
    const discount = applies ? sub * VOLUME_DISCOUNT_RATE : 0;
    const base = sub - discount;
    const fee = base * turnaroundSurcharge;
    return {
      subtotal: sub, discountApplies: applies, discountAmount: discount,
      turnaroundFee: fee, total: base + fee, orderedKeys: Object.keys(selections),
    };
  }, [selections, imgCount, turnaroundSurcharge, wantAdditionalCopy]);

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
    lines.push(`File format: ${fileFormatLabel}`);
    if (wantAdditionalCopy) {
      lines.push(`Additional copy: $${ADDITIONAL_COPY_PRICE.toFixed(2)}/img (${additionalCopyFormat ? buildFileFormatLabel(additionalCopyFormat, additionalCopyBackground, additionalCopyLayer, "", "") : "format not chosen"})`);
    }
    if (hasExistingClippingPath) lines.push(`Existing clipping path: Yes (client supplies already-clipped images)`);
    if (colorRefFiles.length > 0) lines.push(`Color reference images: ${colorRefFiles.length} attached image(s)`);
    if (colorRefLinks.trim()) lines.push(`Color reference links: ${colorRefLinks.trim()}`);
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
        <div className="space-y-4">
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

          <div className="border-t border-[rgb(var(--fg-rgb)/8%)] pt-3">
            <p className="text-[11px] font-bold text-[rgb(var(--fg-rgb)/70%)] mb-2">Color reference images <span className="text-[rgb(var(--fg-rgb)/35%)] font-medium">(optional — helps us match your exact shades)</span></p>
            <div className="space-y-3">
              <div className="flex flex-row gap-3">
                <label
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
                    setColorRefFiles(prev => [...prev, ...files].slice(0, 10));
                  }}
                  className="flex-1 flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-[rgb(var(--fg-rgb)/15%)] bg-[var(--bg-subtle)] px-4 py-5 cursor-pointer hover:border-[rgb(var(--accent-500)/50%)] transition-all text-center">
                  <svg className="w-6 h-6 text-[rgb(var(--fg-rgb)/35%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-[11px] font-bold text-[rgb(var(--fg-rgb)/60%)] leading-tight">Drag & drop small reference<br />images (up to 5 MB each)</span>
                  <span className="text-[10px] text-[rgb(var(--fg-rgb)/35%)]">or click to browse</span>
                  <input type="file" accept="image/*" multiple className="hidden"
                    onChange={e => {
                      const files = Array.from(e.target.files ?? []).filter(f => f.type.startsWith("image/"));
                      setColorRefFiles(prev => [...prev, ...files].slice(0, 10));
                      e.target.value = "";
                    }} />
                </label>
                <div className="flex-1 flex flex-col">
                  <p className="text-[10px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/35%)] font-bold mb-1.5">Heavy example or folder link</p>
                  <textarea value={colorRefLinks} onChange={e => setColorRefLinks(e.target.value)} rows={4}
                    placeholder="Dropbox / Google Drive / WeTransfer link, or image URLs for large examples..."
                    className="w-full flex-1 px-3 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-xs text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)] resize-none" />
                </div>
              </div>

              {colorRefFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {colorRefFiles.map((file, idx) => (
                    <div key={idx} className="relative">
                      <img src={URL.createObjectURL(file)} alt={file.name}
                        className="w-14 h-14 rounded-lg object-cover border border-[rgb(var(--fg-rgb)/10%)]" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[rgb(var(--fg-rgb)/80%)] text-[rgb(var(--bg-base))] text-[11px] leading-5 text-center cursor-pointer"
                        onClick={() => setColorRefFiles(prev => prev.filter((_, i) => i !== idx))}>×</span>
                    </div>
                  ))}
                  <span className="self-center text-[10px] text-[rgb(var(--fg-rgb)/40%)]">{colorRefFiles.length}/10 files — {colorRefFiles.reduce((n, f) => n + f.size, 0) / (1024 * 1024) >= 25 ? "large total size" : `${(colorRefFiles.reduce((n, f) => n + f.size, 0) / (1024 * 1024)).toFixed(1)} MB`}, emailed to us on submit</span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-[rgb(var(--fg-rgb)/8%)] pt-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={hasExistingClippingPath} onChange={e => {
                const checked = e.target.checked;
                setHasExistingClippingPath(checked);
                if (checked && !hasSelection("color-change")) {
                  const colorChangeInfo = getService("color-change");
                  if (colorChangeInfo) setSelections(prev => ({ ...prev, "color-change": getDefaultSelection(colorChangeInfo) }));
                }
              }}
                className="w-4 h-4 mt-0.5 rounded accent-[rgb(var(--accent-600))]" />
              <span className="text-[11px] font-semibold text-[rgb(var(--fg-rgb)/80%)] leading-snug">My images already have a clipping path — so I don't need a clipping or masking service, just color change on my pre-cut images.</span>
            </label>
            {hasExistingClippingPath && (
              <p className="mt-2 rounded-lg bg-[rgb(var(--accent-500)/10%)] border border-[rgb(var(--accent-500)/30%)] px-3 py-2 text-[11px] font-semibold text-[rgb(var(--accent-text))]">
                Confirmed: your images already have a clipping path. Only color change will be billed — no clipping/masking service added.
              </p>
            )}
          </div>
        </div>
      );
    }

    if (info.effectiveType === "tier") {
      const tiers = info.effectiveTiers;
      return (
        <div>
          <p className="text-[12px] font-medium text-[rgb(var(--fg-rgb)/40%)] mb-3">
            Select the category for this order.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(tiers.length, 6)}, minmax(0, 1fr))` }} className="gap-2">
            {tiers.map(t => {
              const isActive = sel?.tier === t.id;
              return (
                <button key={t.id} type="button" onClick={() => selectTier(selKey, t.id)}
                  className={`rounded-xl py-3.5 px-2 text-center border transition-all ${
                    isActive ? "border-[rgb(var(--accent-600))] bg-[rgb(var(--accent-500))] shadow-lg shadow-[rgb(var(--accent-500)/25%)]" : "border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)] hover:border-[rgb(var(--accent-500)/50%)] hover:bg-[rgb(var(--accent-500)/5%)]"
                  }`}>
                  <p className={`text-sm font-semibold leading-tight ${isActive ? "text-[rgb(var(--accent-contrast))]" : "text-[rgb(var(--fg-rgb))]"}`}>{t.label}</p>
                  <p className={`text-xs font-bold mt-1 ${isActive ? "text-[rgb(var(--accent-contrast)/70%)]" : "text-[rgb(var(--fg-rgb)/40%)]"}`}>${t.price.toFixed(2)}/img</p>
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
    if (info.effectiveType === "tier") {
      const t = info.effectiveTiers.find(t => t.id === sel.tier);
      return `${t?.label ?? ""} — $${ppi.toFixed(2)}/img`;
    }
    if (info.effectiveType === "color-variant") {
      const count = sel.colorCodes?.filter(c => c.trim()).length ?? 0;
      return `${count} variant(s) — $${info.effectivePrice.toFixed(2)}/img`;
    }
    return `$${info.effectivePrice.toFixed(2)}/img`;
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
                              if (!svc.subTypes && svc.type === "none") {
                                handleSelect(svc.id);
                              } else if (!svc.subTypes && svc.type === "color-variant") {
                                if (hasSelection(svc.id)) {
                                  removeSelection(svc.id);
                                  setHasExistingClippingPath(false);
                                  setExpandedSvc(null);
                                } else {
                                  handleSelect(svc.id);
                                  setExpandedSvc(svc.id);
                                }
                              } else {
                                toggleExpand(svc.id);
                              }
                            }}>
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-[rgb(var(--fg-rgb))]">{svc.label}</p>
                              {summaryLine && <p className="text-[10px] text-[rgb(var(--accent-text))] mt-0.5 font-medium">{summaryLine}</p>}
                            </div>
                            {(!svc.subTypes && (svc.type === "none" || svc.type === "color-variant")) ? (
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
                                        {svc.id === "path-creation" ? "Select the type of path creation you need." :
                                         svc.id === "masking-bg-removal" ? "Select the type of image editing you need." :
                                         svc.id === "shadow" ? "Select the type of shadow you want." :
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
                      <>
                        {colorNeedsPathService && (
                          <div className="mt-5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3">
                            <p className="text-[12px] font-bold text-amber-400">Color change needs a base service</p>
                            <p className="text-[11px] text-[rgb(var(--fg-rgb)/60%)] mt-1">Select Clipping path, Multi-clipping path, or Image masking — or open the color change service and confirm your images already have a clipping path.</p>
                          </div>
                        )}
                        <button type="button" onClick={() => setStep(2)} disabled={colorNeedsPathService}
                          className={`w-full mt-5 py-3.5 rounded-xl font-bold text-sm transition-all ${colorNeedsPathService ? "bg-[rgb(var(--fg-rgb)/8%)] text-[rgb(var(--fg-rgb)/25%)] cursor-not-allowed" : "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] hover:bg-[rgb(var(--accent-400))]"}`}>
                          CONTINUE →
                        </button>
                      </>
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
                      <button type="button" onClick={() => setFileBoxOpen(!fileBoxOpen)}
                        className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-left transition-colors hover:border-[rgb(var(--accent-500)/40%)]">
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold shrink-0">File format</span>
                          <span className={`truncate font-semibold ${fileFormat ? "text-[rgb(var(--fg-rgb))]" : "text-[rgb(var(--fg-rgb)/30%)]"} ${fileFormat ? "" : "text-xs"}`}>
                            {fileFormat ? buildFileFormatLabel(fileFormat, fileBackground, layerStructure, resizeWidth, resizeHeight) : "Select a file format and background"}
                          </span>
                        </span>
                        <svg className={`w-4 h-4 text-[rgb(var(--fg-rgb)/30%)] transition-transform shrink-0 ${fileBoxOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </button>

                      {fileBoxOpen && (
                        <div className="mt-2 rounded-xl border border-[rgb(var(--fg-rgb)/10%)] bg-[var(--bg-subtle)] overflow-hidden">
                          <div className="p-2.5 border-b border-[rgb(var(--fg-rgb)/8%)]">
                            <p className="text-[10px] uppercase tracking-wider text-[rgb(var(--accent-text))] font-bold px-2 mb-1.5">PSD & TIF</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {FILE_FORMAT_OPTION_LIST.filter(o => o.fmt === "psd" || o.fmt === "tif").map(o => {
                                const isActive = fileFormat === o.fmt && fileBackground === o.bg;
                                return (
                                  <button key={`${o.fmt}-${o.bg}`} type="button"
                                    onClick={() => { setFileFormat(o.fmt); setFileBackground(o.bg); if (!formatAllowsLayers(o.fmt)) setLayerStructure("single"); }}
                                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold border transition-all ${
                                      isActive ? "border-[rgb(var(--accent-600))] bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]" : "border-[rgb(var(--fg-rgb)/8%)] bg-[rgb(var(--fg-rgb)/2%)] text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/40%)]"
                                    }`}>
                                    <span className={`w-3.5 h-3.5 rounded-full border-2 grid place-items-center shrink-0 ${isActive ? "border-[rgb(var(--accent-contrast))]" : "border-[rgb(var(--fg-rgb)/25%)]"}`}>
                                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent-contrast))]" />}
                                    </span>
                                    {FILE_FORMAT_LABELS[o.fmt]} — {BACKGROUND_LABELS[o.bg]}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          <div className="p-2.5">
                            <p className="text-[10px] uppercase tracking-wider text-[rgb(var(--accent-text))] font-bold px-2 mb-1.5">JPG & PNG</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {FILE_FORMAT_OPTION_LIST.filter(o => o.fmt === "jpg" || o.fmt === "png").map(o => {
                                const isActive = fileFormat === o.fmt && fileBackground === o.bg;
                                return (
                                  <button key={`${o.fmt}-${o.bg}`} type="button"
                                    onClick={() => { setFileFormat(o.fmt); setFileBackground(o.bg); if (!formatAllowsLayers(o.fmt)) setLayerStructure("single"); }}
                                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold border transition-all ${
                                      isActive ? "border-[rgb(var(--accent-600))] bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]" : "border-[rgb(var(--fg-rgb)/8%)] bg-[rgb(var(--fg-rgb)/2%)] text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/40%)]"
                                    }`}>
                                    <span className={`w-3.5 h-3.5 rounded-full border-2 grid place-items-center shrink-0 ${isActive ? "border-[rgb(var(--accent-contrast))]" : "border-[rgb(var(--fg-rgb)/25%)]"}`}>
                                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent-contrast))]" />}
                                    </span>
                                    {FILE_FORMAT_LABELS[o.fmt]} — {BACKGROUND_LABELS[o.bg]}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Layer structure</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button"
                          onClick={() => setLayerStructure("single")}
                          className={`rounded-xl py-3 text-center border font-bold text-sm transition-all ${layerStructure === "single" ? "border-[rgb(var(--accent-600))] bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow-lg shadow-[rgb(var(--accent-500)/25%)]" : "border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)] text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/50%)]"}`}>
                          Single layer
                        </button>
                        <button type="button"
                          onClick={() => fileFormat && formatAllowsLayers(fileFormat) && setLayerStructure("multiple")}
                          className={`rounded-xl py-3 text-center border font-bold text-sm transition-all ${layerStructure === "multiple" ? "border-[rgb(var(--accent-600))] bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow-lg shadow-[rgb(var(--accent-500)/25%)]" : fileFormat && formatAllowsLayers(fileFormat) ? "border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)] text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/50%)]" : "border-[rgb(var(--fg-rgb)/6%)] bg-[rgb(var(--fg-rgb)/2%)] text-[rgb(var(--fg-rgb)/25%)] cursor-not-allowed"}`}>
                          Multiple layer
                        </button>
                      </div>
                      {fileFormat && !formatAllowsLayers(fileFormat) && (
                        <p className="text-[11px] text-[rgb(var(--fg-rgb)/35%)] mt-1.5">{FILE_FORMAT_LABELS[fileFormat]} always uses a single layer.</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">Do you need resizing?</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => setWantResize("yes")}
                          className={`rounded-xl py-3 text-center border font-bold text-sm transition-all ${wantResize === "yes" ? "border-[rgb(var(--accent-600))] bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow-lg shadow-[rgb(var(--accent-500)/25%)]" : "border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)] text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/50%)]"}`}>Yes</button>
                        <button type="button" onClick={() => setWantResize("no")}
                          className={`rounded-xl py-3 text-center border font-bold text-sm transition-all ${wantResize === "no" ? "border-[rgb(var(--accent-600))] bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow-lg shadow-[rgb(var(--accent-500)/25%)]" : "border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)] text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/50%)]"}`}>No</button>
                      </div>
                      {wantResize === "yes" && (
                        <div className="mt-3 flex items-end gap-3">
                          <div className="flex-1">
                            <label className="block text-[10px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/35%)] font-bold mb-1">Width (px)</label>
                            <input type="number" min={1} value={resizeWidth} onChange={e => setResizeWidth(e.target.value)}
                              placeholder="e.g. 1920"
                              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)]" />
                          </div>
                          <span className="text-[rgb(var(--fg-rgb)/30%)] pb-3.5">×</span>
                          <div className="flex-1">
                            <label className="block text-[10px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/35%)] font-bold mb-1">Height (px)</label>
                            <input type="number" min={1} value={resizeHeight} onChange={e => setResizeHeight(e.target.value)}
                              placeholder="e.g. 1080"
                              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)]" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <button type="button" onClick={() => { setWantAdditionalCopy(!wantAdditionalCopy); if (wantAdditionalCopy) { setAdditionalCopyFormat(null); setAdditionalCopyBackground(null); setAdditionalCopyLayer(null); } }}
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${wantAdditionalCopy ? "bg-[rgb(var(--accent-500))] border-[rgb(var(--accent-500))]" : "border-[rgb(var(--fg-rgb)/20%)] hover:border-[rgb(var(--accent-500)/50%)]"}`}>
                          {wantAdditionalCopy && <svg className="w-3 h-3 text-[rgb(var(--accent-contrast))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </button>
                        <label className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold cursor-pointer">Additional copy</label>
                        <span className="text-[10px] text-[rgb(var(--fg-rgb)/35%)]">(${ADDITIONAL_COPY_PRICE.toFixed(2)}/img) — optional</span>
                      </div>
                      {wantAdditionalCopy && (
                        <div className="mt-3">
                          <button type="button" onClick={() => setAdditionalCopyBoxOpen(!additionalCopyBoxOpen)}
                            className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-left transition-colors hover:border-[rgb(var(--accent-500)/40%)]">
                            <span className="flex items-center gap-2 min-w-0">
                              <span className="text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold shrink-0">Additional copy format</span>
                              <span className={`truncate font-semibold ${additionalCopyFormat ? "text-[rgb(var(--fg-rgb))]" : "text-[rgb(var(--fg-rgb)/30%)] text-xs"}`}>
                                {additionalCopyFormat ? buildFileFormatLabel(additionalCopyFormat, additionalCopyBackground, additionalCopyLayer, "", "") : "Select file format and background"}
                              </span>
                            </span>
                            <svg className={`w-4 h-4 text-[rgb(var(--fg-rgb)/30%)] transition-transform shrink-0 ${additionalCopyBoxOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </button>

                          {additionalCopyBoxOpen && (
                            <div className="mt-2 rounded-xl border border-[rgb(var(--fg-rgb)/10%)] bg-[var(--bg-subtle)] overflow-hidden">
                              <div className="p-2.5 border-b border-[rgb(var(--fg-rgb)/8%)]">
                                <p className="text-[10px] uppercase tracking-wider text-[rgb(var(--accent-text))] font-bold px-2 mb-1.5">PSD & TIF</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                  {FILE_FORMAT_OPTION_LIST.filter(o => o.fmt === "psd" || o.fmt === "tif").map(o => {
                                    const isActive = additionalCopyFormat === o.fmt && additionalCopyBackground === o.bg;
                                    return (
                                      <button key={`${o.fmt}-${o.bg}`} type="button"
                                        onClick={() => { setAdditionalCopyFormat(o.fmt); setAdditionalCopyBackground(o.bg); if (!formatAllowsLayers(o.fmt)) setAdditionalCopyLayer("single"); }}
                                        className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold border transition-all ${
                                          isActive ? "border-[rgb(var(--accent-600))] bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]" : "border-[rgb(var(--fg-rgb)/8%)] bg-[rgb(var(--fg-rgb)/2%)] text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/40%)]"
                                        }`}>
                                        <span className={`w-3.5 h-3.5 rounded-full border-2 grid place-items-center shrink-0 ${isActive ? "border-[rgb(var(--accent-contrast))]" : "border-[rgb(var(--fg-rgb)/25%)]"}`}>
                                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent-contrast))]" />}
                                        </span>
                                        {FILE_FORMAT_LABELS[o.fmt]} — {BACKGROUND_LABELS[o.bg]}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="p-2.5 border-b border-[rgb(var(--fg-rgb)/8%)]">
                                <p className="text-[10px] uppercase tracking-wider text-[rgb(var(--accent-text))] font-bold px-2 mb-1.5">JPG & PNG</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                  {FILE_FORMAT_OPTION_LIST.filter(o => o.fmt === "jpg" || o.fmt === "png").map(o => {
                                    const isActive = additionalCopyFormat === o.fmt && additionalCopyBackground === o.bg;
                                    return (
                                      <button key={`${o.fmt}-${o.bg}`} type="button"
                                        onClick={() => { setAdditionalCopyFormat(o.fmt); setAdditionalCopyBackground(o.bg); if (!formatAllowsLayers(o.fmt)) setAdditionalCopyLayer("single"); }}
                                        className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold border transition-all ${
                                          isActive ? "border-[rgb(var(--accent-600))] bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]" : "border-[rgb(var(--fg-rgb)/8%)] bg-[rgb(var(--fg-rgb)/2%)] text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/40%)]"
                                        }`}>
                                        <span className={`w-3.5 h-3.5 rounded-full border-2 grid place-items-center shrink-0 ${isActive ? "border-[rgb(var(--accent-contrast))]" : "border-[rgb(var(--fg-rgb)/25%)]"}`}>
                                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent-contrast))]" />}
                                        </span>
                                        {FILE_FORMAT_LABELS[o.fmt]} — {BACKGROUND_LABELS[o.bg]}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="p-3">
                                <p className="text-[10px] uppercase tracking-wider text-[rgb(var(--accent-text))] font-bold mb-2">Layer structure</p>
                                <div className="grid grid-cols-2 gap-2">
                                  <button type="button" onClick={() => setAdditionalCopyLayer("single")}
                                    className={`rounded-lg py-2.5 text-center border font-bold text-xs transition-all ${additionalCopyLayer === "single" ? "border-[rgb(var(--accent-600))] bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]" : "border-[rgb(var(--fg-rgb)/8%)] bg-[rgb(var(--fg-rgb)/2%)] text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/40%)]"}`}>
                                    Single layer
                                  </button>
                                  <button type="button"
                                    onClick={() => additionalCopyFormat && formatAllowsLayers(additionalCopyFormat) && setAdditionalCopyLayer("multiple")}
                                    className={`rounded-lg py-2.5 text-center border font-bold text-xs transition-all ${additionalCopyLayer === "multiple" ? "border-[rgb(var(--accent-600))] bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]" : additionalCopyFormat && formatAllowsLayers(additionalCopyFormat) ? "border-[rgb(var(--fg-rgb)/8%)] bg-[rgb(var(--fg-rgb)/2%)] text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/40%)]" : "border-[rgb(var(--fg-rgb)/6%)] bg-[rgb(var(--fg-rgb)/2%)] text-[rgb(var(--fg-rgb)/25%)] cursor-not-allowed"}`}>
                                    Multiple layer
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
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
                      <button type="button" onClick={() => setStep(3)} disabled={colorNeedsPathService}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${colorNeedsPathService ? "bg-[rgb(var(--fg-rgb)/8%)] text-[rgb(var(--fg-rgb)/25%)] cursor-not-allowed" : "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] hover:bg-[rgb(var(--accent-400))]"}`}>CONTINUE →</button>
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
                    <input type="hidden" name="file_format" value={fileFormatLabel} />
                    <input type="hidden" name="additional_copy" value={wantAdditionalCopy ? `Yes${additionalCopyFormat ? ` (${buildFileFormatLabel(additionalCopyFormat, additionalCopyBackground, additionalCopyLayer, "", "")})` : ""}` : "No"} />
                    <input type="hidden" name="existing_clipping" value={hasExistingClippingPath ? "Yes - images already have a clipping path" : "No"} />
                    <input type="hidden" name="image_links" value={imageLinks} />

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-2">When would you like to pay?</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {([
                          { id: "now", label: "Pay Now", desc: "Checkout immediately" },
                          { id: "7", label: "In 7 Days", desc: "We email the link later" },
                          { id: "15", label: "In 15 Days", desc: "We email the link later" },
                          { id: "monthly", label: "Monthly", desc: "Split into monthly" },
                        ] as const).map(opt => (
                          <button key={opt.id} type="button" onClick={() => setPaymentTiming(opt.id)}
                            className={`rounded-xl p-3 border text-center transition-all relative ${paymentTiming === opt.id ? "border-[rgb(var(--accent-500)/50%)] bg-[rgb(var(--accent-500)/8%)]" : "border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--fg-rgb)/15%)]"}`}>
                            {opt.id === "now" && <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-[rgb(var(--accent-500))] text-[9px] font-bold text-[rgb(var(--accent-contrast))]">Popular</span>}
                            <p className="text-xs font-bold text-[rgb(var(--fg-rgb))]">{opt.label}</p>
                            <p className="text-[10px] text-[rgb(var(--fg-rgb)/40%)] mt-0.5">{opt.desc}</p>
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-[rgb(var(--fg-rgb)/35%)] mt-2">
                        {paymentTiming === "now"
                          ? "You'll be taken to secure checkout right after submitting."
                          : "Your quote is saved — we'll email your secure payment link on your chosen schedule. You can still pay now anytime."}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(2)}
                        className="px-6 py-3 rounded-xl border border-[rgb(var(--fg-rgb)/15%)] text-sm font-bold text-[rgb(var(--fg-rgb)/60%)] hover:border-[rgb(var(--fg-rgb)/30%)] transition-all">← Back</button>
                      <button type="submit" disabled={submitStatus === "sending" || submitStatus === "success" || colorNeedsPathService}
                        className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all disabled:hover:scale-100 ${colorNeedsPathService ? "bg-[rgb(var(--fg-rgb)/8%)] text-[rgb(var(--fg-rgb)/25%)] cursor-not-allowed" : "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] hover:bg-[rgb(var(--accent-400))] hover:scale-[1.01] disabled:opacity-60"}`}>
                        {submitStatus === "sending" || colorRefUploading ? (colorRefUploading ? "Uploading reference images..." : "Sending...") : "Submit Quote Request"}
                      </button>
                    </div>
                    {colorNeedsPathService && (
                      <p className="text-[11px] font-bold text-amber-400 text-center">Go back and add Clipping path, Multi-clipping path, or Image masking — it is required for color change.</p>
                    )}
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
              <>
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

              <div className="glass-card rounded-[2rem] p-8 border-[rgb(var(--fg-rgb)/10%)] mt-6">
                <h4 className="text-lg font-bold text-[rgb(var(--fg-rgb))]">Turnaround time</h4>
                <p className="mt-1 text-[11px] text-[rgb(var(--fg-rgb)/35%)]">Choose how fast you need your delivery. Faster turnaround affects the price.</p>
                <div className="mt-5 space-y-2">
                  {TURNAROUND_OPTIONS.map(opt => {
                    const isActive = turnaround === opt.id;
                    const pct = Math.round(opt.surcharge * 100);
                    return (
                      <button key={opt.id} type="button" onClick={() => setTurnaround(opt.id)}
                        className={`w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 border text-left transition-all relative ${
                          isActive ? "border-[rgb(var(--accent-600))] bg-[rgb(var(--accent-500))] shadow-lg shadow-[rgb(var(--accent-500)/25%)]" : "border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-subtle)] hover:border-[rgb(var(--accent-500)/50%)]"
                        }`}>
                        {opt.rush && <span className="absolute -top-2 right-3 px-1.5 py-0.5 rounded-full bg-amber-500 text-[8px] font-bold text-black uppercase">Rush</span>}
                        <div className="min-w-0">
                          <p className={`text-sm font-bold ${isActive ? "text-[rgb(var(--accent-contrast))]" : "text-[rgb(var(--fg-rgb))]"}`}>{opt.label}</p>
                          <p className={`text-[10px] ${isActive ? "text-[rgb(var(--accent-contrast)/70%)]" : "text-[rgb(var(--fg-rgb)/40%)]"}`}>{opt.desc}</p>
                        </div>
                        <p className={`shrink-0 text-xs font-bold ${isActive ? "text-[rgb(var(--accent-contrast))]" : pct > 0 ? "text-amber-400" : pct < 0 ? "text-[rgb(var(--accent-text))]" : "text-[rgb(var(--fg-rgb)/30%)]"}`}>
                          {pct > 0 ? `+${pct}%` : pct < 0 ? `${pct}%` : "Base price"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
              </>
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
            {lastOrderRef && (
              <div className="mt-5 inline-flex flex-col items-center gap-1 px-5 py-3 rounded-2xl border border-[rgb(137_243_54_/_25%)] bg-[rgb(137_243_54_/_6%)]">
                <span className="text-xs uppercase tracking-wider text-[rgb(var(--fg-rgb)/45%)]">Your order reference</span>
                <span className="font-mono text-xl font-bold tracking-[0.08em] text-[rgb(137_243_54)]">{lastOrderRef}</span>
                <span className="text-xs text-[rgb(var(--fg-rgb)/45%)]">Keep this number — mention it in any email for fast support.</span>
              </div>
            )}
            {wantsQuote && paymentTiming === "now" ? (
              <>
                <p className="mt-4 text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">
                  Thank you! Your quote is saved and your payment is ready. Complete secure checkout below to lock in your order.
                </p>
                <a href={`/payment?plan=${encodeURIComponent("Custom Quote")}&amount=${total.toFixed(2)}&desc=${encodeURIComponent("Photo editing quote — see details in your email")}`}
                  className="mt-6 inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm shadow-lg shadow-[rgb(var(--accent-500)/25%)]">
                  Proceed to Secure Payment — ${total.toFixed(2)}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
                <p className="mt-4 text-xs text-[rgb(var(--fg-rgb)/40%)]">Your request was also emailed to us — we&apos;ll start after payment.</p>
              </>
            ) : wantsQuote ? (
              <>
                <p className="mt-4 text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">
                  Thank you for trusting us! We&apos;ve received your quote request and will email your{" "}
                  <span className="font-bold text-[rgb(137_243_54)]">
                    {paymentTiming === "7" ? "secure payment link within 7 days" : paymentTiming === "15" ? "secure payment link within 15 days" : "monthly payment plan"}
                  </span>
                  . Pay when it suits you — your work starts once payment is confirmed.
                </p>
                <p className="mt-3 text-xs text-[rgb(var(--fg-rgb)/40%)]">Need to pay now after all? Just email us — we&apos;ll send the link right away.</p>
              </>
            ) : (
              <p className="mt-4 text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">Thank you for reaching out! We&apos;ll get back to you within <span className="font-bold text-[rgb(137_243_54)]">45 minutes</span>.</p>
            )}
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
