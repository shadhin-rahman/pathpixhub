"use client";
import { useSyncExternalStore } from "react";

function subscribeToConsent(onStoreChange: () => void) {
  window.addEventListener("pph-consent-change", onStoreChange);
  return () => window.removeEventListener("pph-consent-change", onStoreChange);
}

function getConsentSnapshot() {
  return typeof localStorage !== "undefined" && localStorage.getItem("pph-cookie-consent") != null;
}

export default function CookieConsent() {
  const accepted = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, () => false);

  if (accepted) return null;

  const accept = () => {
    localStorage.setItem("pph-cookie-consent", "accepted");
    window.dispatchEvent(new Event("pph-consent-change"));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4">
      <div className="max-w-7xl mx-auto glass-card rounded-2xl px-6 py-4 border-[rgb(var(--fg-rgb)/10%)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs sm:text-sm text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
          We use cookies to enhance your experience. By using our site, you consent to our use of cookies.{" "}
          <a href="/cookie-policy" className="text-[rgb(var(--accent-text))] hover:text-[rgb(var(--accent-text))] underline underline-offset-2">
            Learn more
          </a>
        </p>
        <button
          onClick={accept}
          className="w-full sm:w-auto shrink-0 px-6 py-3 sm:py-2.5 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-xs hover:bg-[rgb(var(--accent-400))] transition-all"
        >
          Accept
        </button>
      </div>
    </div>
  );
}