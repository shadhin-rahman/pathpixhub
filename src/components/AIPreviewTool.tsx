"use client";

import { useRef, useState, useCallback } from "react";

interface AIPreviewToolProps {
  className?: string;
}

export default function AIPreviewTool({ className = "" }: AIPreviewToolProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalRef = useRef<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFilter, setProcessedFilter] = useState<string | null>(null);
  const [progress, setProgress] = useState("");

  const filters = [
    { id: "bgremove", label: "BG Remove", icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16", desc: "Remove Background", premium: true },
    { id: "enhance", label: "Enhance", icon: "M13 10V3L4 14h7v7l9-11h-7z", desc: "Brightness + Contrast" },
    { id: "retouch", label: "Smooth", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", desc: "Skin Smoothing" },
    { id: "shadow", label: "Shadow", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", desc: "Add Drop Shadow" },
  ];

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
      originalRef.current = ev.target?.result as string;
      setProcessedFilter(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const removeBackground = useCallback(async (imageSrc: string) => {
    const { removeBackground: removeBG } = await import("@imgly/background-removal");

    const response = await fetch(imageSrc);
    const blob = await response.blob();

    const resultBlob = await removeBG(blob, {
      progress: (key: string, current: number, total: number) => {
        if (key === "compute:inference") {
          const pct = Math.round((current / total) * 100);
          setProgress(`Processing... ${pct}%`);
        }
      },
    });

    return URL.createObjectURL(resultBlob);
  }, []);

  const applyFilter = useCallback(async (filterId: string) => {
    if (!preview || !canvasRef.current) return;
    setIsProcessing(true);
    setProcessedFilter(null);
    setProgress("Loading AI model...");

    try {
      if (filterId === "bgremove") {
        const resultUrl = await removeBackground(preview);

        const img = new window.Image();
        img.onload = () => {
          const canvas = canvasRef.current!;
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          setIsProcessing(false);
          setProcessedFilter(filterId);
          setProgress("");
        };
        img.src = resultUrl;
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new window.Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        switch (filterId) {
          case "enhance":
            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.min(255, data[i] * 1.15 + 8);
              data[i + 1] = Math.min(255, data[i + 1] * 1.15 + 8);
              data[i + 2] = Math.min(255, data[i + 2] * 1.15 + 8);
            }
            break;

          case "retouch":
            for (let i = 0; i < data.length; i += 4) {
              const brightness = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
              const warmth = brightness > 128 ? 1.02 : 0.98;
              data[i] = Math.min(255, data[i] * warmth + 3);
              data[i + 1] = Math.min(255, data[i + 1] * warmth + 2);
              data[i + 2] = Math.min(255, data[i + 2] * warmth + 5);
            }
            break;

          case "shadow": {
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext("2d")!;
            tempCtx.putImageData(imageData, 0, 0);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const shadowOffset = Math.max(8, Math.min(canvas.width, canvas.height) * 0.03);
            const shadowBlur = Math.max(15, Math.min(canvas.width, canvas.height) * 0.05);
            ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = shadowOffset;
            ctx.shadowOffsetY = shadowOffset;
            ctx.drawImage(tempCanvas, 0, 0);
            break;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        setIsProcessing(false);
        setProcessedFilter(filterId);
        setProgress("");
      };
      img.src = preview;
    } catch {
      setIsProcessing(false);
      setProgress("");
    }
  }, [preview, removeBackground]);

  const resetToOriginal = useCallback(() => {
    if (!canvasRef.current || !originalRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const img = new window.Image();
    img.onload = () => {
      canvasRef.current!.width = img.width;
      canvasRef.current!.height = img.height;
      ctx.drawImage(img, 0, 0);
      setProcessedFilter(null);
    };
    img.src = originalRef.current;
  }, []);

  return (
    <div className={className}>
      <canvas ref={canvasRef} className="hidden" />
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      {!preview ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-video rounded-2xl border-2 border-dashed border-[rgb(var(--fg-rgb)/15%)] hover:border-[rgb(var(--accent-500)/40%)] bg-[var(--bg-subtle)] flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-[rgb(var(--accent-500)/10%)] flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-[rgb(var(--fg-rgb))]">Upload Your Image</p>
            <p className="text-xs text-[rgb(var(--fg-rgb)/40%)] mt-1">AI-powered background removal &amp; enhancement</p>
          </div>
          <span className="px-4 py-2 rounded-full bg-[rgb(var(--accent-500))/10%] text-[rgb(var(--accent-400))] text-xs font-bold">Try Free Preview</span>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-[var(--bg-subtle)]">
            {isProcessing && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-12 h-12 border-3 border-[rgb(var(--accent-400))] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-bold text-white mt-3">AI Processing...</p>
                  <p className="text-xs text-white/60 mt-1">{progress || "Analyzing your image"}</p>
                </div>
              </div>
            )}
            <div className="relative">
              <canvas ref={(el) => {
                if (el && canvasRef.current) {
                  el.width = canvasRef.current.width;
                  el.height = canvasRef.current.height;
                  const ctx = el.getContext("2d");
                  if (ctx) ctx.drawImage(canvasRef.current, 0, 0);
                }
              }} className="w-full h-auto" />
              {processedFilter && (
                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-[rgb(var(--accent-500))]/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  {filters.find(f => f.id === processedFilter)?.label}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => applyFilter(f.id)}
                disabled={isProcessing}
                className={`rounded-xl py-3 px-2 text-center border transition-all relative ${
                  processedFilter === f.id
                    ? "border-[rgb(var(--accent-500)/50%)] bg-[rgb(var(--accent-500)/8%)]"
                    : "border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--fg-rgb)/15%)]"
                } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {f.premium && (
                  <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-[rgb(var(--accent-500))] text-[7px] font-bold text-white uppercase">AI</span>
                )}
                <div className="w-8 h-8 rounded-lg bg-[rgb(var(--accent-500)/10%)] flex items-center justify-center mx-auto">
                  <svg className="w-4 h-4 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                  </svg>
                </div>
                <p className="text-[11px] font-bold text-[rgb(var(--fg-rgb))] mt-2">{f.label}</p>
                <p className="text-[9px] text-[rgb(var(--fg-rgb)/40%)] mt-0.5">{f.desc}</p>
              </button>
            ))}
          </div>

          {processedFilter && (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={resetToOriginal}
                className="text-xs text-[rgb(var(--fg-rgb)/40%)] hover:text-[rgb(var(--fg-rgb)/60%)] transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Reset
              </button>
              <a
                href="/contact"
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-xs hover:bg-[rgb(var(--accent-400))] transition-all"
              >
                Get Professional Edit
                <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
          )}

          <p className="text-[10px] text-[rgb(var(--fg-rgb)/30%)] text-center">
            AI-powered preview. Our experts deliver pixel-perfect results.
          </p>

          <button
            type="button"
            onClick={() => { setPreview(null); setProcessedFilter(null); originalRef.current = null; }}
            className="w-full text-center text-xs text-[rgb(var(--fg-rgb)/40%)] hover:text-[rgb(var(--fg-rgb)/60%)] transition-colors"
          >
            Upload different image
          </button>
        </div>
      )}
    </div>
  );
}
