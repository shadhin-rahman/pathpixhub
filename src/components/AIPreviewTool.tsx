"use client";

import { useRef, useState, useCallback } from "react";

interface AIPreviewToolProps {
  className?: string;
}

export default function AIPreviewTool({ className = "" }: AIPreviewToolProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("enhance");

  const filters = [
    { id: "enhance", label: "Auto Enhance", icon: "✨" },
    { id: "bgremove", label: "Background", icon: "🖼️" },
    { id: "retouch", label: "Retouch", icon: "💄" },
    { id: "color", label: "Color Pop", icon: "🎨" },
  ];

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
      setProcessed(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const applyFilter = useCallback((filterId: string) => {
    if (!preview || !canvasRef.current) return;
    setIsProcessing(true);
    setActiveFilter(filterId);

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
            data[i] = Math.min(255, data[i] * 1.1 + 10);
            data[i + 1] = Math.min(255, data[i + 1] * 1.1 + 10);
            data[i + 2] = Math.min(255, data[i + 2] * 1.1 + 10);
          }
          break;
        case "retouch":
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.05 + 5);
            data[i + 1] = Math.min(255, data[i + 1] * 1.05 + 5);
            data[i + 2] = Math.min(255, data[i + 2] * 1.05 + 5);
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = data[i] * 0.85 + avg * 0.15;
            data[i + 1] = data[i + 1] * 0.85 + avg * 0.15;
            data[i + 2] = data[i + 2] * 0.85 + avg * 0.15;
          }
          break;
        case "color":
          for (let i = 0; i < data.length; i += 4) {
            const max = Math.max(data[i], data[i + 1], data[i + 2]);
            const min = Math.min(data[i], data[i + 1], data[i + 2]);
            const sat = max === 0 ? 0 : (max - min) / max;
            const boost = 1 + sat * 0.5;
            data[i] = Math.min(255, data[i] * boost);
            data[i + 1] = Math.min(255, data[i + 1] * boost);
            data[i + 2] = Math.min(255, data[i + 2] * boost);
          }
          break;
        case "bgremove":
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            const brightness = (r + g + b) / 3;
            const edge = Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b);
            if (brightness > 200 && edge < 60) {
              data[i + 3] = 0;
            }
          }
          break;
      }

      ctx.putImageData(imageData, 0, 0);
      setIsProcessing(false);
      setProcessed(true);
    };
    img.src = preview;
  }, [preview]);

  return (
    <div className={className}>
      <canvas ref={canvasRef} className="hidden" />

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
                  <p className="text-xs text-white/60 mt-1">Analyzing your image</p>
                </div>
              </div>
            )}
            {processed ? (
              <canvas
                ref={(el) => {
                  if (el && canvasRef.current) {
                    el.width = canvasRef.current.width;
                    el.height = canvasRef.current.height;
                    const ctx = el.getContext("2d");
                    if (ctx) ctx.drawImage(canvasRef.current, 0, 0);
                  }
                }}
                className="w-full h-auto"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Upload preview" className="w-full h-auto" />
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => applyFilter(f.id)}
                disabled={isProcessing}
                className={`rounded-xl py-3 px-2 text-center border transition-all ${
                  activeFilter === f.id
                    ? "border-[rgb(var(--accent-500)/50%)] bg-[rgb(var(--accent-500)/8%)]"
                    : "border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--fg-rgb)/15%)]"
                } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span className="text-lg">{f.icon}</span>
                <p className="text-[11px] font-bold text-[rgb(var(--fg-rgb))] mt-1">{f.label}</p>
              </button>
            ))}
          </div>

          {processed && (
            <div className="text-center">
              <p className="text-xs text-[rgb(var(--fg-rgb)/40%)] mb-3">
                This is a client-side preview. Our experts will deliver pixel-perfect results.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-sm hover:bg-[rgb(var(--accent-400))] transition-all"
              >
                Get Professional Edit
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
          )}

          <button
            type="button"
            onClick={() => { setPreview(null); setProcessed(false); setActiveFilter("enhance"); }}
            className="text-xs text-[rgb(var(--fg-rgb)/40%)] hover:text-[rgb(var(--fg-rgb)/60%)] transition-colors"
          >
            Upload different image
          </button>
        </div>
      )}
    </div>
  );
}
