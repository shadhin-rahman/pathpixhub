"use client";

import { useRef, useState, useCallback } from "react";

interface AIPreviewToolProps {
  className?: string;
}

export default function AIPreviewTool({ className = "" }: AIPreviewToolProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFilter, setProcessedFilter] = useState<string | null>(null);

  const filters = [
    { id: "enhance", label: "Auto Enhance", icon: "M13 10V3L4 14h7v7l9-11h-7z", desc: "Brightness + Contrast" },
    { id: "sharpen", label: "Sharpen", icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z", desc: "Edge Enhancement" },
    { id: "retouch", label: "Smooth", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", desc: "Skin Smoothing" },
    { id: "color", label: "Vibrant", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01", desc: "Color Boost" },
  ];

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
      setProcessedFilter(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const storeOriginal = useCallback(() => {
    if (!preview || !originalCanvasRef.current) return;
    const canvas = originalCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = preview;
  }, [preview]);

  const applyFilter = useCallback((filterId: string) => {
    if (!preview) return;
    setIsProcessing(true);

    if (!originalCanvasRef.current || !originalCanvasRef.current.getContext("2d")) {
      storeOriginal();
    }

    setTimeout(() => {
      const canvas = canvasRef.current;
      const origCanvas = originalCanvasRef.current;
      if (!canvas || !origCanvas) return;

      const ctx = canvas.getContext("2d");
      const origCtx = origCanvas.getContext("2d");
      if (!ctx || !origCtx) return;

      const img = new window.Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        origCanvas.width = img.width;
        origCanvas.height = img.height;
        origCtx.drawImage(img, 0, 0);
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

          case "sharpen": {
            const w = canvas.width;
            const copy = new Uint8ClampedArray(data);
            const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
            for (let y = 1; y < canvas.height - 1; y++) {
              for (let x = 1; x < w - 1; x++) {
                for (let c = 0; c < 3; c++) {
                  let val = 0;
                  for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                      const idx = ((y + ky) * w + (x + kx)) * 4 + c;
                      val += copy[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
                    }
                  }
                  data[(y * w + x) * 4 + c] = Math.min(255, Math.max(0, val));
                }
              }
            }
            break;
          }

          case "retouch":
            for (let i = 0; i < data.length; i += 4) {
              const brightness = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
              const warmth = brightness > 128 ? 1.02 : 0.98;
              data[i] = Math.min(255, data[i] * warmth + 3);
              data[i + 1] = Math.min(255, data[i + 1] * warmth + 2);
              data[i + 2] = Math.min(255, data[i + 2] * warmth + 5);
            }
            break;

          case "color":
            for (let i = 0; i < data.length; i += 4) {
              const max = Math.max(data[i], data[i + 1], data[i + 2]);
              const min = Math.min(data[i], data[i + 1], data[i + 2]);
              const sat = max === 0 ? 0 : (max - min) / max;
              const boost = 1 + sat * 0.6;
              data[i] = Math.min(255, data[i] * boost + 5);
              data[i + 1] = Math.min(255, data[i + 1] * boost + 5);
              data[i + 2] = Math.min(255, data[i + 2] * boost + 5);
            }
            break;
        }

        ctx.putImageData(imageData, 0, 0);
        setIsProcessing(false);
        setProcessedFilter(filterId);
      };
      img.src = preview;
    }, 600);
  }, [preview, storeOriginal]);

  const resetToOriginal = useCallback(() => {
    if (!canvasRef.current || !originalCanvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const origCtx = originalCanvasRef.current.getContext("2d");
    if (!ctx || !origCtx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(originalCanvasRef.current, 0, 0);
    setProcessedFilter(null);
  }, []);

  return (
    <div className={className}>
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={originalCanvasRef} className="hidden" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

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
            <p className="text-xs text-[rgb(var(--fg-rgb)/40%)] mt-1">See AI preview in 10 seconds</p>
          </div>
          <span className="px-4 py-2 rounded-full bg-[rgb(var(--accent-500))/10%] text-[rgb(var(--accent-400))] text-xs font-bold">
            Try Free Preview
          </span>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-[var(--bg-subtle)]">
            {isProcessing && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-12 h-12 border-3 border-[rgb(var(--accent-400))] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-bold text-white mt-3">AI Processing...</p>
                  <p className="text-xs text-white/60 mt-1">Enhancing your image</p>
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
                className={`rounded-xl py-3 px-2 text-center border transition-all ${
                  processedFilter === f.id
                    ? "border-[rgb(var(--accent-500)/50%)] bg-[rgb(var(--accent-500)/8%)]"
                    : "border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--fg-rgb)/15%)]"
                } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
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
            Client-side preview only. Our experts deliver pixel-perfect results.
          </p>

          <button
            type="button"
            onClick={() => { setPreview(null); setProcessedFilter(null); }}
            className="w-full text-center text-xs text-[rgb(var(--fg-rgb)/40%)] hover:text-[rgb(var(--fg-rgb)/60%)] transition-colors"
          >
            Upload different image
          </button>
        </div>
      )}
    </div>
  );
}
