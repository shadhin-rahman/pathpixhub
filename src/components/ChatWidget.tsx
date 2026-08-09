"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    Tawk_API?: {
      maximize?: () => void;
    };
  }
}

const TAWKTO_PROPERTY_ID = "YOUR_TAWKTO_PROPERTY_ID";
const TAWKTO_WIDGET_ID = "YOUR_TAWKTO_WIDGET_ID";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (TAWKTO_PROPERTY_ID.includes("YOUR_")) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWKTO_PROPERTY_ID}/${TAWKTO_WIDGET_ID}`;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);
  }, []);

  const openChat = () => {
    if (window.Tawk_API?.maximize) {
      window.Tawk_API.maximize();
    }
    setIsOpen(false);
  };

  const isConfigured = !TAWKTO_PROPERTY_ID.includes("YOUR_");

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow-2xl hover:bg-[rgb(var(--accent-400))] transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95"
        aria-label="Chat with us"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-24 left-6 z-50 w-72"
          >
            <div className="glass-card rounded-2xl p-4 border-[rgb(var(--fg-rgb)/10%)] shadow-2xl">
              <p className="text-sm font-bold text-[rgb(var(--fg-rgb))] mb-3">
                {isConfigured ? "Chat with us" : "Get in touch"}
              </p>

              {isConfigured ? (
                <button
                  onClick={openChat}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[rgb(var(--accent-500)/10%)] hover:bg-[rgb(var(--accent-500)/20%)] border border-[rgb(var(--accent-500)/20%)] transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-[rgb(var(--accent-500))] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-[rgb(var(--accent-contrast))]" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-[rgb(var(--fg-rgb))]">Live Chat</p>
                    <p className="text-xs text-[rgb(var(--fg-rgb)/50%)]">Reply within minutes</p>
                  </div>
                </button>
              ) : (
                <p className="text-xs text-[rgb(var(--fg-rgb)/50%)] leading-relaxed">
                  Live chat coming soon. Please{" "}
                  <a href="mailto:pathpixhub@gmail.com" className="text-[rgb(var(--accent-text))] underline">
                    email us
                  </a>{" "}
                  or use the contact form.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
