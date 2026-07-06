"use client";

import { useState } from "react";
import Image from "next/image";
import { services } from "@/data/services";

export default function ContactPage() {
  const [mode, setMode] = useState<"service" | "general">("service");

  return (
    <>
      <section className="pt-40 pb-20 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-xl">
              <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold">Contact</h2>
              <h1 className="mt-6 text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] gradient-text">
                Let&apos;s
                <br />
                Talk.
              </h1>
              <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
                We turn bold ideas into unforgettable visuals. Start the conversation.
              </p>
            </div>
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[28rem] rounded-3xl overflow-hidden glass-card border-[rgb(var(--fg-rgb)/10%)]">
              <Image
                src="/images/image-masking-1.jpg"
                alt="Photo editing showcase"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
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


          </div>
        </div>
      </section>
    </>
  );
}