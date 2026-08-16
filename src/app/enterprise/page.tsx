"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const PERKS = [
  { icon: "👑", title: "Dedicated Account Manager", desc: "One point of contact for everything — onboarding, orders, billing." },
  { icon: "⚡", title: "45-Min VIP Response SLA", desc: "Priority response for every request. Your time matters." },
  { icon: "🛡️", title: "Custom Bulk Pricing", desc: "Volume rates for 1,000+ images/month with a dedicated expert team." },
  { icon: "🤝", title: "White-Glove Onboarding", desc: "We set up your workflows, specs and quality checks for you." },
];

export default function EnterprisePage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("_subject", "Enterprise Sales Inquiry — PathPixHub");
    setStatus("sending");
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setError("Could not send your message. Please try again or email us directly.");
        setStatus("error");
      }
    } catch {
      setError("Network error while sending. Please try again.");
      setStatus("error");
    }
  };

  return (
    <>
      <section className="pt-40 pb-24 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm font-bold mb-6 border border-purple-500/20">
              👑 Enterprise Solutions
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight gradient-text leading-[1.1]">
              Built for large brands &amp; agencies
            </h1>
            <p className="mt-5 text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
              Custom bulk editing, dedicated team and VIP support. Tell us what you need — we&apos;ll handle the rest.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: perks + contact options */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[rgb(var(--fg-rgb))] mb-8">
              What you get
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {PERKS.map((p, i) => (
                <motion.div key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border-2 border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-alt)] p-5 hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <span className="text-2xl">{p.icon}</span>
                  <h3 className="font-bold text-sm text-[rgb(var(--fg-rgb))] mt-3 mb-1">{p.title}</h3>
                  <p className="text-xs text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border-2 border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-alt)] p-6">
              <p className="text-sm font-bold text-[rgb(var(--fg-rgb))] mb-4">Prefer to talk right away?</p>
              <div className="flex flex-wrap gap-3">
                <a href="https://wa.me/8801723735896" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  WhatsApp Us
                </a>
                <a href="mailto:info@pathpixhub.com?subject=Enterprise%20Inquiry"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card border border-[rgb(var(--fg-rgb)/10%)] text-sm font-bold text-[rgb(var(--fg-rgb)/70%)] hover:border-[rgb(var(--accent-500)/50%)] hover:text-[rgb(var(--accent-text))] transition-all">
                  Email Us
                </a>
              </div>
            </div>
          </div>

          {/* Right: simple enterprise form */}
          <div className="rounded-3xl border-2 border-purple-500/30 bg-[var(--bg)] p-8 shadow-xl shadow-purple-500/5">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl">👑</span>
              <h2 className="text-xl font-bold text-[rgb(var(--fg-rgb))]">Talk to our Enterprise Team</h2>
            </div>

            {status === "success" ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[rgb(137_243_54_/_12%)] flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-[rgb(137_243_54)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-[rgb(var(--fg-rgb))]">Message Received!</h3>
                <p className="mt-3 text-[rgb(var(--fg-rgb)/55%)] leading-relaxed text-sm">
                  Thank you for reaching out. Our enterprise team will contact you within <span className="font-bold text-[rgb(137_243_54)]">2 hours</span> with a tailored plan &amp; pricing.
                </p>
                <button type="button" onClick={() => setStatus("idle")}
                  className="mt-8 px-6 py-3 rounded-full glass-card border border-[rgb(var(--fg-rgb)/10%)] text-sm font-bold text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/50%)] transition-all">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="ent-name" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Full Name *</label>
                    <input id="ent-name" name="name" type="text" required placeholder="John Smith"
                      className="w-full px-4 py-3 rounded-xl border-2 border-[rgb(var(--fg-rgb)/10%)] bg-[rgb(var(--fg-rgb)/3%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm" />
                  </div>
                  <div>
                    <label htmlFor="ent-email" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Work Email *</label>
                    <input id="ent-email" name="email" type="email" required placeholder="you@company.com"
                      className="w-full px-4 py-3 rounded-xl border-2 border-[rgb(var(--fg-rgb)/10%)] bg-[rgb(var(--fg-rgb)/3%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm" />
                  </div>
                </div>
                <div>
                  <label htmlFor="ent-company" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Company</label>
                  <input id="ent-company" name="company" type="text" placeholder="Your company name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[rgb(var(--fg-rgb)/10%)] bg-[rgb(var(--fg-rgb)/3%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm" />
                </div>
                <div>
                  <label htmlFor="ent-volume" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Monthly image volume</label>
                  <select id="ent-volume" name="services" defaultValue=""
                    className="w-full px-4 py-3 rounded-xl border-2 border-[rgb(var(--fg-rgb)/10%)] bg-[rgb(var(--fg-rgb)/3%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm">
                    <option value="" disabled>Select an estimate</option>
                    <option>Less than 100 images</option>
                    <option>100 – 500 images</option>
                    <option>500 – 1,000 images</option>
                    <option>1,000+ images</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ent-message" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Your requirements *</label>
                  <textarea id="ent-message" name="message" required rows={4}
                    placeholder="Tell us about your project — services needed, timelines, anything else that helps us prepare a tailored plan..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-[rgb(var(--fg-rgb)/10%)] bg-[rgb(var(--fg-rgb)/3%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm resize-none" />
                </div>
                {status === "error" && (
                  <p className="text-xs text-red-400 text-center bg-red-400/10 border border-red-400/30 rounded-xl px-4 py-3">{error}</p>
                )}
                <button type="submit" disabled={status === "sending"}
                  className="w-full px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm disabled:opacity-60">
                  {status === "sending" ? "Sending..." : "Send to Enterprise Team"}
                </button>
                <p className="text-xs text-[rgb(var(--fg-rgb)/35%)] text-center">Simple &amp; quick — no forms maze. We&apos;ll reply within 2 hours with a tailored plan.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--bg-alt)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">Not ready for Enterprise yet?</h2>
          <p className="mt-3 text-[rgb(var(--fg-rgb)/55%)]">Start small with our credit plans and upgrade as you grow.</p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/subscription"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm">
              Explore Credit Plans
            </Link>
            <Link href="/free-trial"
              className="px-8 py-4 rounded-full glass-card border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] font-bold hover:border-[rgb(var(--accent-500)/50%)] transition-all text-sm">
              Try Free Trial
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
