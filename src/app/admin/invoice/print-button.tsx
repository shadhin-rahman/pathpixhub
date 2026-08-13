"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] text-sm font-bold hover:opacity-90 transition-all cursor-pointer"
    >
      Print / Save as PDF
    </button>
  );
}