"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Coins } from "lucide-react";
import CreditBundleSelector from "@/components/CreditBundleSelector";

const FAQS = [
  {
    q: "What is a PathPixHub credit worth?",
    a: "1 credit = $1 worth of image editing. When you place an order, you can pay with credits instead of reaching for your card — at a lower price per shot.",
  },
  {
    q: "Do credits ever expire?",
    a: "No. Your credits never expire, so you can stock up during a sale and use them whenever you need — even months later.",
  },
  {
    q: "How do I pay with my credits?",
    a: "We store your credit balance on your account. When you confirm an order, just choose \u201cPay with credits\u201d at checkout and the amount is deducted automatically.",
  },
  {
    q: "How can I check my credit balance?",
    a: "Email us at info@pathpixhub.com any time and we'll reply with your current balance and order history instantly.",
  },
  {
    q: "Can I get a bigger discount for regular bulk edits?",
    a: "Yes. Two ways: pick a larger credit pack for a lower per-image rate, or talk to our Enterprise team for a custom monthly volume deal with dedicated rates.",
  },
];

export default function CreditsPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-10 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 items-center gap-12">
            <div className="text-center lg:text-left max-w-2xl lg:max-w-none">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-sm font-bold mb-6 border border-[rgb(var(--accent-500)/15%)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                PathPixHub Credits
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight gradient-text leading-[1.1]">
                Save time &amp; money with credits
              </h1>
              <p className="mt-5 text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed max-w-2xl lg:mx-0 mx-auto">
                Regular customer or big batch coming up? Buy credits once and get the lowest price per edit — with bonus credits the more you buy.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4">
                <a href="#bundles"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm">
                  Buy credits
                </a>
                <a href="#faq"
                  className="px-8 py-4 rounded-full glass-card border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] font-bold hover:border-[rgb(var(--accent-500)/50%)] hover:text-[rgb(var(--accent-text))] transition-all text-sm">
                  How it works
                </a>
              </div>
            </div>
            <div className="relative hidden lg:block justify-self-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="relative rounded-3xl border-2 border-[rgb(var(--accent-500)/25%)] bg-[var(--bg-alt)] p-3 shadow-[0_30px_80px_rgb(var(--accent-500)/20%)]"
              >
                <Image
                  src="/images/credits-hero.jpg"
                  alt="Path credits illustration"
                  width={1376}
                  height={768}
                  className="w-[520px] h-auto rounded-2xl object-cover"
                />
                <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-[rgb(var(--accent-text))]">
                  <Coins className="w-4 h-4" />
                  Credits make every order faster
                </div>
              </motion.div>
            </div>
          </div>

          {/* Hero benefits */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: "⏱️", title: "Save time", desc: "Pay once, then fly through checkout on every future order without touching your card again." },
              { icon: "💰", title: "Save money", desc: "Credits give you the lowest price per edit. The more you buy, the more you save." },
              { icon: "🤝", title: "Bonus credits", desc: "Every bigger pack is topped up with free bonus credits — up to 8,000 free credits on top." },
            ].map((b, i) => (
              <motion.div key={b.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border-2 border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-alt)] p-6 flex items-start gap-4"
              >
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <h3 className="font-bold text-[rgb(var(--fg-rgb))]">{b.title}</h3>
                  <p className="mt-1 text-sm text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundles */}
      <section id="bundles" className="py-16 lg:py-20 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[rgb(var(--fg-rgb)/40%)]">Credit bundles</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight gradient-text">Buy more, get more</h2>
            <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)]">Pick a bigger pack and we&apos;ll top you up with bonus credits. <span className="font-bold text-[rgb(var(--fg-rgb))]">1 credit = $1</span> toward your orders.</p>
          </div>

          <CreditBundleSelector />

          <p className="mt-8 text-center text-xs text-[rgb(var(--fg-rgb)/45%)]">
            Prefer a monthly credit plan instead? See{" "}
            <Link href="/subscription" className="text-[rgb(var(--accent-text))] font-bold hover:underline">Standard / Pro / Enterprise plans</Link>.
          </p>
        </div>
      </section>

      {/* Quick Plan Comparison */}
      <section className="py-20 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-sm font-bold mb-4 border border-[rgb(var(--accent-500)/15%)]">
              Quick Plan Comparison
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
              Plans at a glance
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[rgb(var(--fg-rgb)/10%)]">
                  <th className="text-left py-4 px-4 font-bold text-[rgb(var(--fg-rgb)/70%)]">Feature</th>
                  <th className="py-4 px-4 font-bold text-[rgb(var(--fg-rgb)/90%)]">
                    <div>Standard</div>
                    <div className="text-sm font-bold text-[rgb(var(--accent-text))]">Pay As You Go</div>
                  </th>
                  <th className="py-4 px-4 font-bold text-[rgb(var(--fg-rgb)/90%)]">
                    <div>Pro</div>
                    <div className="text-sm font-bold text-[rgb(var(--accent-text))]">Path Credits Subscription</div>
                  </th>
                  <th className="py-4 px-4 font-bold text-[rgb(var(--fg-rgb)/90%)]">
                    <div>Enterprise</div>
                    <div className="text-sm font-bold text-[rgb(var(--accent-text))]">$499/month</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Next Morning Turnaround", values: [false, true, true] },
                  { label: "Discount on credits", values: ["0%", "35%", "Custom"] },
                  { label: "Image editing price", values: ["Variable", "Variable", "Flat"] },
                  { label: "Dedicated Account Manager", values: [false, false, true] },
                  { label: "Dedicated Editing Team", values: [false, true, true] },
                  { label: "Monthly billing by invoice", values: [false, false, true] },
                  { label: "Minimum order fee", values: ["$2.5", false, false] },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-[rgb(var(--fg-rgb)/5%)]">
                    <td className="py-3.5 px-4 text-[rgb(var(--fg-rgb)/70%)]">{row.label}</td>
                    {row.values.map((val, i) => {
                      if (val === true) {
                        return (
                          <td key={i} className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          </td>
                        );
                      }
                      if (val === false) {
                        return (
                          <td key={i} className="py-3.5 px-4 text-center text-[rgb(var(--fg-rgb)/20%)] font-bold">
                            —
                          </td>
                        );
                      }
                      return (
                        <td key={i} className="py-3.5 px-4 text-center font-bold text-[rgb(var(--fg-rgb)/80%)]">
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 lg:py-24 bg-[var(--bg-alt)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[rgb(var(--fg-rgb)/40%)]">How it works</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight gradient-text">Credits in 3 simple steps</h2>
          </div>
          <div className="rounded-3xl bg-[var(--bg)] p-8 md:p-12 space-y-10">
            {[
              { num: "1", color: "bg-rose-100 text-rose-500", title: "Buy a credit pack", desc: "Choose a pack below. Bigger packs include bonus free credits on top." },
              { num: "2", color: "bg-blue-100 text-blue-500", title: "Send us your images", desc: "Submit your order through our contact form — tell us the service, quantity and turnaround." },
              { num: "3", color: "bg-amber-100 text-amber-500", title: "We edit & deduct credits", desc: "We edit your images first, then deduct the credits from your balance. No card at every step." },
            ].map((step, i) => (
              <motion.div key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-5"
              >
                <span className={`shrink-0 w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-lg font-extrabold`}>
                  {step.num}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[rgb(var(--fg-rgb))]">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 lg:py-24 bg-[var(--bg-alt)]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[rgb(var(--fg-rgb)/40%)]">FAQ</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight gradient-text">Questions about credits?</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((f, i) => (
              <div key={i} className="rounded-2xl border-2 border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg)] overflow-hidden">
                <button type="button" onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                  <span className="font-bold text-sm text-[rgb(var(--fg-rgb))]">{f.q}</span>
                  <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                    className="shrink-0 w-7 h-7 rounded-full glass-card flex items-center justify-center text-[rgb(var(--fg-rgb))]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  </motion.span>
                </button>
                <motion.div initial={false}
                  animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">{f.a}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alternative CTA — Pay per order */}
      <section className="py-20 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-3xl border-2 border-dashed border-[rgb(var(--accent-500)/40%)] bg-[var(--bg-alt)] p-10 lg:p-14">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-sm font-bold mb-5 border border-[rgb(var(--accent-500)/20%)]">
                🤝 No prepayment
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
                Want to pay per order instead?
              </h2>
              <p className="mt-4 text-lg text-[rgb(var(--fg-rgb)/55%)] leading-relaxed max-w-2xl mx-auto">
                Work first, pay later. Choose your service and turnaround — we edit, then email you a secure payment link. No credits to buy, no commitment.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { icon: "🛠️", title: "We edit first", desc: "Send your images — our team starts right away. No card needed to begin." },
                { icon: "💳", title: "Pay per order", desc: "Pay only for what you order. No credit packs or monthly fees." },
                { icon: "📬", title: "Secure link after", desc: "Finished edits arrive with a secure payment link by email." },
              ].map((f, i) => (
                <motion.div key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg)] p-6 text-center"
                >
                  <span className="text-3xl">{f.icon}</span>
                  <h3 className="mt-3 font-bold text-[rgb(var(--fg-rgb))]">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm shadow-lg shadow-[rgb(var(--accent-500)/15%)]">
                Order My Edits
              </Link>
              <Link href="/enterprise"
                className="px-10 py-4 rounded-full glass-card border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] font-bold hover:border-purple-500/50 hover:text-purple-400 transition-all text-sm">
                Enterprise Bulk Deal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}