"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EMAIL = "pathpixhub@gmail.com";

const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;

export default function EmailModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl glass-card border border-[rgb(var(--fg-rgb)/10%)] p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <p className="font-bold text-[rgb(var(--fg-rgb))]">Email us</p>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[rgb(var(--fg-rgb)/40%)] hover:text-[rgb(var(--fg-rgb))] hover:bg-[rgb(var(--fg-rgb)/5%)] transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[rgb(var(--fg-rgb)/5%)] mb-5">
              <svg className="w-5 h-5 text-[rgb(var(--accent-400))] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span className="text-sm font-semibold text-[rgb(var(--fg-rgb))] truncate">{EMAIL}</span>
            </div>

            <div className="space-y-2.5">
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-2xl bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-sm hover:bg-[rgb(var(--accent-400))] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Open Email App
              </a>
              <a
                href={GMAIL_COMPOSE}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-2xl glass-card border border-[rgb(var(--fg-rgb)/10%)] font-bold text-sm text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/50%)] transition-colors"
              >
                <svg className="w-4 h-4 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Continue with Gmail
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-2xl border border-[rgb(var(--fg-rgb)/10%)] font-bold text-sm text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/50%)] transition-colors"
              >
                <svg className="w-4 h-4 text-[rgb(var(--fg-rgb)/50%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                {copied ? "Copied!" : "Copy Email"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}