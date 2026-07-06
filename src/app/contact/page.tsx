"use client";

import { useState } from "react";
import { services } from "@/data/services";

export default function ContactPage() {
  const [mode, setMode] = useState<"service" | "general">("service");

  return (
    <>
      <section className="pt-40 pb-20 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Contact</h2>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Let&apos;s Talk</h1>
            <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/60%)]">
              Whether you need a quote or just want to say hello — we are here.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-32 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-1 p-1 rounded-2xl glass-card border border-[rgb(var(--fg-rgb)/5%)] w-fit mx-auto mb-12">
              <button
                onClick={() => setMode("service")}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  mode === "service"
                    ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow-lg"
                    : "text-[rgb(var(--fg-rgb)/50%)] hover:text-[rgb(var(--fg-rgb))]"
                }`}
              >
                Request a Service
              </button>
              <button
                onClick={() => setMode("general")}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  mode === "general"
                    ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow-lg"
                    : "text-[rgb(var(--fg-rgb)/50%)] hover:text-[rgb(var(--fg-rgb))]"
                }`}
              >
                General Inquiry
              </button>
            </div>

            <form action="https://formspree.io/f/xovjbydw" method="POST" className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Name <span className="text-red-400">*</span></label>
                  <input type="text" name="name" id="name" required
                    className="w-full px-4 py-3 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[rgb(var(--fg-rgb)/3%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm"
                    placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Email <span className="text-red-400">*</span></label>
                  <input type="email" name="email" id="email" required
                    className="w-full px-4 py-3 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[rgb(var(--fg-rgb)/3%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm"
                    placeholder="you@example.com" />
                </div>
              </div>

              {mode === "service" && (
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Service <span className="text-red-400">*</span></label>
                  <select name="subject" id="subject" required
                    className="w-full px-4 py-3 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[var(--bg-alt)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm">
                    <option value="" className="bg-[var(--bg-alt)]">Select a service</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id} className="bg-[var(--bg-alt)]">{s.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Message <span className="text-red-400">*</span></label>
                <textarea name="message" id="message" rows={5} required
                  className="w-full px-4 py-3 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[rgb(var(--fg-rgb)/3%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm resize-none"
                  placeholder={mode === "service" ? "Tell us about your project..." : "How can we help you?"} />
              </div>

              <button type="submit"
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm">
                Send Message
              </button>
              <p className="text-xs text-[rgb(var(--fg-rgb)/30%)]">We will respond within 24 hours.</p>
            </form>

            <div className="mt-20 glass-card rounded-[2rem] p-10 lg:p-12 text-center border border-[rgb(var(--accent-500)/20%)] bg-[rgb(var(--accent-500)/3%)] relative overflow-hidden">
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-[rgb(var(--accent-500)/8%)] rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[rgb(var(--accent-500)/15%)] flex items-center justify-center mx-auto mb-6">
                  <svg className="w-7 h-7 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight gradient-text">Try Us For Free</h2>
                <p className="mt-3 text-[rgb(var(--fg-rgb)/60%)] max-w-md mx-auto">
                  Send us 3-5 images and we will edit them professionally — zero cost, no commitment.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <a href="mailto:info@pathpixhub.com?subject=Free%20Trial%20Request"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm shadow-lg shadow-[rgb(var(--accent-500)/30%)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Request Free Trial
                  </a>
                  <a href="mailto:info@pathpixhub.com"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass-card text-[rgb(var(--fg-rgb))] font-semibold hover:border-[rgb(var(--accent-500)/50%)] transition-all text-sm border border-[rgb(var(--fg-rgb)/10%)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Chat With Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}