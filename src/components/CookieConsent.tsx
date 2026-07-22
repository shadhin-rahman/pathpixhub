"use client";
import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("pph-cookie-consent");
    if (!consent) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("pph-cookie-consent", "accepted");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4">
      <div className="max-w-7xl mx-auto glass-card rounded-2xl px-6 py-4 border-[rgb(var(--fg-rgb)/10%)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs sm:text-sm text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
          We use cookies to enhance your experience. By using our site, you consent to our use of cookies.
        </p>
        <button
          onClick={accept}
          className="shrink-0 px-6 py-2.5 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-xs hover:bg-[rgb(var(--accent-400))] transition-all"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
