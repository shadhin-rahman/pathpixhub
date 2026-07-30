"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const TIERS = [
  {
    name: "Free",
    badge: "",
    badgeColor: "",
    monthlyPrice: 0,
    yearlyPrice: 0,
    perImage: "$1.45",
    desc: "Pay-as-you-go for occasional edits",
    turnaround: "24h",
    turnaroundLabel: "24-Hour Delivery",
    features: [
      { text: "Clipping Path & BG Removal", included: true },
      { text: "Standard Support Queue", included: true },
      { text: "24-Hour Delivery", included: true },
      { text: "Priority Support", included: false },
      { text: "Dedicated Manager", included: false },
    ],
    cta: "Start Free",
    ctaLink: "/free-trial",
    style: "",
  },
  {
    name: "Standard",
    badge: "Best Entry",
    badgeColor: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
    monthlyPrice: 7.9,
    yearlyPrice: 79,
    perImage: "Included",
    desc: "12h fast delivery for small sellers",
    turnaround: "12h",
    turnaroundLabel: "12-Hour Fast",
    turnaroundColor: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    features: [
      { text: "All Free Features", included: true },
      { text: "12-Hour Fast Delivery", included: true },
      { text: "5 Priority Tickets/mo", included: true },
      { text: "5% Path Credit Bonus", included: true },
      { text: "Unlimited Revisions", included: false },
    ],
    loyalty: "1 month free with annual",
    cta: "Get Started",
    ctaLink: "/contact",
    style: "border-orange-500/30",
  },
  {
    name: "Pro",
    badge: "Most Popular",
    badgeColor: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    monthlyPrice: 19.9,
    yearlyPrice: 199,
    perImage: "Included",
    desc: "Ultra fast 6h delivery for growing studios",
    turnaround: "6h",
    turnaroundLabel: "6-Hour Express",
    turnaroundColor: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    features: [
      { text: "All Standard Features", included: true },
      { text: "6-Hour Ultra Fast SLA", included: true },
      { text: "Unlimited Priority Tickets", included: true },
      { text: "Unlimited Revisions", included: true },
      { text: "15% Path Credit Bonus", included: true },
    ],
    loyalty: "2 months free with annual",
    cta: "Get Started",
    ctaLink: "/contact",
    style: "border-[rgb(var(--accent-500)/60%)] shadow-xl shadow-[rgb(var(--accent-500)/10%)] scale-[1.02]",
    featured: true,
  },
  {
    name: "Enterprise",
    badge: "VIP Enterprise",
    badgeColor: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    monthlyPrice: 499,
    yearlyPrice: 4999,
    perImage: "Custom",
    desc: "Full white-glove VIP management for large brands",
    turnaround: "45m",
    turnaroundLabel: "45-Min VIP",
    turnaroundColor: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    features: [
      { text: "All Pro Features", included: true },
      { text: "45-Min VIP Response SLA", included: true },
      { text: "Dedicated Account Manager", included: true },
      { text: "Dedicated Expert Team", included: true },
      { text: "Business Security SLA", included: true },
    ],
    loyalty: "3 months free + setup with annual",
    cta: "Contact Sales",
    ctaLink: "/contact",
    style: "",
  },
];

const PRO_SERVICES = [
  { icon: "🎓", name: "Product Training", price: "$195", desc: "2-hour interactive session with a Path specialist covering platform setup, tools & workflow optimization." },
  { icon: "📋", name: "Custom Specification", price: "$295", desc: "30-min consultation call. Receive one custom spec, quality check & success guide for your brand." },
  { icon: "🚀", name: "Priority Onboarding", price: "$1,295", desc: "A Path consultant evaluates your needs, onboards up to 5 categories & creates a custom workflow setup." },
  { icon: "🏆", name: "Enterprise Onboarding", price: "$4,995", desc: "Unlimited category onboarding, custom workflows, dedicated team & preferential SLA — full white-glove setup." },
];

const FAQ_ITEMS = [
  { q: "Can I switch plans anytime?", a: "Yes! Upgrade or downgrade anytime. Upgrades take effect immediately. Downgrades apply at next billing cycle." },
  { q: "What is Path Credit and how does it work?", a: "Path Credits are prepaid editing credits. Auto top-up earns bonus credits (5-25%) that never expire." },
  { q: "Is there a free trial?", a: "Yes! All paid plans include a 14-day free trial with 10 free images. No credit card needed for Standard." },
  { q: "How does the loyalty program work?", a: "6 consecutive months = 10% lifetime discount. Bonus credits on every top-up. Refer friends for free months!" },
  { q: "Can I cancel anytime?", a: "Yes, cancel anytime with no penalties. Access continues until billing period ends." },
  { q: "Can I pause my subscription?", a: "Of course! Pause manually or auto-pause after 1 inactive billing cycle. Monthly fee drops to $4/mo and all specs are saved. No reactivation fee!" },
  { q: "How much do I save with annual billing?", a: "Save 20% with annual! Standard $79/yr, Pro $199/yr, Enterprise $4,999/yr. Price locked 12 months." },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-20 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-400))] text-sm font-bold mb-6 border border-[rgb(var(--accent-500)/15%)]">
            Pricing Plans
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight gradient-text leading-[1.1]">
            Simple pricing,<br />pixel perfect edits
          </h1>
          <p className="mt-5 text-lg text-[rgb(var(--fg-rgb)/60%)] max-w-2xl mx-auto leading-relaxed">
            Choose a plan that fits your needs. Start free, upgrade as you grow. All plans include our expert editing team.
          </p>

          {/* Billing Toggle */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={`text-sm font-bold transition-colors ${!annual ? "text-[rgb(var(--fg-rgb))]" : "text-[rgb(var(--fg-rgb)/40%)]"}`}>Monthly</span>
            <button type="button" onClick={() => setAnnual(!annual)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${annual ? "bg-[rgb(var(--accent-500))]" : "bg-[rgb(var(--fg-rgb)/15%)]"}`}>
              <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${annual ? "left-[30px]" : "left-0.5"}`} />
            </button>
            <span className={`text-sm font-bold transition-colors ${annual ? "text-[rgb(var(--fg-rgb))]" : "text-[rgb(var(--fg-rgb)/40%)]"}`}>
              Annual <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-1">Save 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="pb-20 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {TIERS.map((tier, i) => (
              <motion.div key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`relative rounded-2xl border-2 p-6 flex flex-col ${tier.featured ? tier.style : "border-[rgb(var(--fg-rgb)/8%)]"} bg-[var(--bg)] transition-all hover:shadow-xl hover:-translate-y-1`}
              >
                {tier.badge && (
                  <span className={`self-start text-[11px] font-bold px-3 py-1 rounded-full mb-4 ${tier.badgeColor}`}>
                    {tier.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold text-[rgb(var(--fg-rgb))]">{tier.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[rgb(var(--fg-rgb))]">
                    {tier.monthlyPrice === 0 ? "$0" : annual ? `$${tier.yearlyPrice}` : `$${tier.monthlyPrice}`}
                  </span>
                  <span className="text-sm text-[rgb(var(--fg-rgb)/40%)] font-semibold">/mo</span>
                </div>
                {tier.monthlyPrice > 0 && (
                  <p className="text-xs text-[rgb(var(--fg-rgb)/35%)] mt-1">
                    + {tier.perImage} per image
                  </p>
                )}
                {tier.monthlyPrice === 0 && (
                  <p className="text-xs text-[rgb(var(--fg-rgb)/35%)] mt-1">
                    + {tier.perImage} per image
                  </p>
                )}
                <p className="mt-3 text-sm text-[rgb(var(--fg-rgb)/55%)] min-h-[40px]">{tier.desc}</p>
                <div className="h-px bg-[rgb(var(--fg-rgb)/8%)] my-4" />
                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm">
                      {f.included ? (
                        <svg className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg className="w-4 h-4 mt-0.5 text-[rgb(var(--fg-rgb)/20%)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      )}
                      <span className={f.included ? "text-[rgb(var(--fg-rgb)/70%)]" : "text-[rgb(var(--fg-rgb)/30%)]"}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
                {tier.loyalty && (
                  <p className="text-[11px] font-bold text-amber-400 mb-3">🎁 {tier.loyalty}</p>
                )}
                <div className={`rounded-xl text-center py-3 font-bold text-sm ${tier.turnaroundColor || "bg-[rgb(var(--fg-rgb)/5%)] text-[rgb(var(--fg-rgb)/50%)]"} border`}>
                  ⚡ {tier.turnaroundLabel}
                </div>
                <Link href={tier.ctaLink}
                  className={`mt-4 block text-center py-3 rounded-xl font-bold text-sm transition-all ${tier.featured ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] hover:bg-[rgb(var(--accent-400))]" : "border-2 border-[rgb(var(--fg-rgb)/15%)] text-[rgb(var(--fg-rgb)/70%)] hover:border-[rgb(var(--accent-500)/50%)] hover:text-[rgb(var(--accent-400))]"}`}>
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Services */}
      <section className="py-20 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-400))] text-sm font-bold mb-4 border border-[rgb(var(--accent-500)/15%)]">
              Professional Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
              One-time premium packages
            </h2>
            <p className="mt-4 text-[rgb(var(--fg-rgb)/55%)] max-w-xl mx-auto">
              Get your team onboarded, trained & optimized with specialized one-time services.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRO_SERVICES.map((svc, i) => (
              <motion.div key={svc.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border-2 border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-alt)] p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-[rgb(var(--accent-500)/10%)] flex items-center justify-center text-2xl mx-auto mb-4 border border-[rgb(var(--accent-500)/15%)]">
                  {svc.icon}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-3 inline-block">
                  One-Time
                </span>
                <h3 className="text-lg font-bold text-[rgb(var(--fg-rgb))] mb-2">{svc.name}</h3>
                <p className="text-2xl font-extrabold text-[rgb(var(--accent-400))] mb-1">{svc.price}</p>
                <p className="text-xs text-[rgb(var(--fg-rgb)/35%)] mb-4">one-time fee</p>
                <p className="text-sm text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">{svc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-400))] text-sm font-bold mb-4 border border-[rgb(var(--accent-500)/15%)]">
              Full Comparison
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
              Every feature, side by side
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[rgb(var(--fg-rgb)/10%)]">
                  <th className="text-left py-4 px-4 font-bold text-[rgb(var(--fg-rgb)/70%)]">Feature</th>
                  <th className="py-4 px-4 font-bold text-[rgb(var(--fg-rgb)/70%)]">Free</th>
                  <th className="py-4 px-4 font-bold text-orange-400">Standard</th>
                  <th className="py-4 px-4 font-bold text-[rgb(var(--accent-400))]">Pro</th>
                  <th className="py-4 px-4 font-bold text-purple-400">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan={5} className="py-3 px-4 font-bold text-[rgb(var(--fg-rgb)/50%)] text-xs uppercase tracking-wider bg-[rgb(var(--fg-rgb)/3%)]">Core Editing Services</td></tr>
                {["Clipping Path & BG Removal", "Color Correction & Retouching", "Ghost Mannequin", "Shadow Creation", "Layer Mask"].map(f => (
                  <tr key={f} className="border-b border-[rgb(var(--fg-rgb)/5%)]">
                    <td className="py-3 px-4 text-[rgb(var(--fg-rgb)/70%)]">{f}</td>
                    {[1,2,3,4].map(j => <td key={j} className="py-3 px-4 text-center text-emerald-400 font-bold">✓</td>)}
                  </tr>
                ))}
                <tr className="border-b border-[rgb(var(--fg-rgb)/5%)]">
                  <td className="py-3 px-4 text-[rgb(var(--fg-rgb)/70%)]">Color Changing</td>
                  <td className="py-3 px-4 text-center text-[rgb(var(--fg-rgb)/20%)]">✕</td>
                  <td className="py-3 px-4 text-center text-[rgb(var(--fg-rgb)/20%)]">✕</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">✓</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">✓</td>
                </tr>

                <tr><td colSpan={5} className="py-3 px-4 font-bold text-[rgb(var(--fg-rgb)/50%)] text-xs uppercase tracking-wider bg-[rgb(var(--fg-rgb)/3%)]">Delivery & SLA</td></tr>
                <tr className="border-b border-[rgb(var(--fg-rgb)/5%)]">
                  <td className="py-3 px-4 text-[rgb(var(--fg-rgb)/70%)]">Delivery Time</td>
                  <td className="py-3 px-4 text-center font-bold">24h</td>
                  <td className="py-3 px-4 text-center font-bold text-orange-400">12h</td>
                  <td className="py-3 px-4 text-center font-bold text-[rgb(var(--accent-400))]">6h</td>
                  <td className="py-3 px-4 text-center font-bold text-purple-400">45m</td>
                </tr>
                <tr className="border-b border-[rgb(var(--fg-rgb)/5%)]">
                  <td className="py-3 px-4 text-[rgb(var(--fg-rgb)/70%)]">Rush Option</td>
                  <td className="py-3 px-4 text-center text-[rgb(var(--fg-rgb)/20%)]">✕</td>
                  <td className="py-3 px-4 text-center text-[rgb(var(--fg-rgb)/20%)]">✕</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">✓ (3h)</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">✓ (1h)</td>
                </tr>

                <tr><td colSpan={5} className="py-3 px-4 font-bold text-[rgb(var(--fg-rgb)/50%)] text-xs uppercase tracking-wider bg-[rgb(var(--fg-rgb)/3%)]">Support & Service</td></tr>
                <tr className="border-b border-[rgb(var(--fg-rgb)/5%)]">
                  <td className="py-3 px-4 text-[rgb(var(--fg-rgb)/70%)]">Priority Support</td>
                  <td className="py-3 px-4 text-center text-[rgb(var(--fg-rgb)/20%)]">✕</td>
                  <td className="py-3 px-4 text-center">5/mo</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">Unlimited</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">Unlimited</td>
                </tr>
                <tr className="border-b border-[rgb(var(--fg-rgb)/5%)]">
                  <td className="py-3 px-4 text-[rgb(var(--fg-rgb)/70%)]">Unlimited Revisions</td>
                  <td className="py-3 px-4 text-center text-[rgb(var(--fg-rgb)/20%)]">✕</td>
                  <td className="py-3 px-4 text-center text-[rgb(var(--fg-rgb)/20%)]">✕</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">✓</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">✓</td>
                </tr>
                <tr className="border-b border-[rgb(var(--fg-rgb)/5%)]">
                  <td className="py-3 px-4 text-[rgb(var(--fg-rgb)/70%)]">Dedicated Account Manager</td>
                  <td className="py-3 px-4 text-center text-[rgb(var(--fg-rgb)/20%)]">✕</td>
                  <td className="py-3 px-4 text-center text-[rgb(var(--fg-rgb)/20%)]">✕</td>
                  <td className="py-3 px-4 text-center text-[rgb(var(--fg-rgb)/20%)]">✕</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">✓</td>
                </tr>
                <tr className="border-b border-[rgb(var(--fg-rgb)/5%)]">
                  <td className="py-3 px-4 text-[rgb(var(--fg-rgb)/70%)]">Dedicated Expert Team</td>
                  <td className="py-3 px-4 text-center text-[rgb(var(--fg-rgb)/20%)]">✕</td>
                  <td className="py-3 px-4 text-center text-[rgb(var(--fg-rgb)/20%)]">✕</td>
                  <td className="py-3 px-4 text-center text-[rgb(var(--fg-rgb)/20%)]">✕</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">✓</td>
                </tr>

                <tr><td colSpan={5} className="py-3 px-4 font-bold text-[rgb(var(--fg-rgb)/50%)] text-xs uppercase tracking-wider bg-[rgb(var(--fg-rgb)/3%)]">Billing & Value</td></tr>
                <tr className="border-b border-[rgb(var(--fg-rgb)/5%)]">
                  <td className="py-3 px-4 text-[rgb(var(--fg-rgb)/70%)]">Path Credit Bonus</td>
                  <td className="py-3 px-4 text-center text-[rgb(var(--fg-rgb)/20%)]">✕</td>
                  <td className="py-3 px-4 text-center">5%</td>
                  <td className="py-3 px-4 text-center">15%</td>
                  <td className="py-3 px-4 text-center">25%</td>
                </tr>
                <tr className="border-b border-[rgb(var(--fg-rgb)/5%)]">
                  <td className="py-3 px-4 text-[rgb(var(--fg-rgb)/70%)]">Pause Subscription</td>
                  <td className="py-3 px-4 text-center text-[rgb(var(--fg-rgb)/20%)]">✕</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">✓ ($4/mo)</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">✓ ($4/mo)</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">✓ ($4/mo)</td>
                </tr>
                <tr className="border-b border-[rgb(var(--fg-rgb)/5%)]">
                  <td className="py-3 px-4 text-[rgb(var(--fg-rgb)/70%)]">Business SLA Guarantee</td>
                  <td className="py-3 px-4 text-center text-[rgb(var(--fg-rgb)/20%)]">✕</td>
                  <td className="py-3 px-4 text-center text-[rgb(var(--fg-rgb)/20%)]">✕</td>
                  <td className="py-3 px-4 text-center text-[rgb(var(--fg-rgb)/20%)]">✕</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-400))] text-sm font-bold mb-4 border border-[rgb(var(--accent-500)/15%)]">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="rounded-xl border-2 border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-alt)] overflow-hidden">
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left">
                  <span className="font-bold text-sm text-[rgb(var(--fg-rgb)/80%)]">{item.q}</span>
                  <svg className={`w-4 h-4 text-[rgb(var(--fg-rgb)/30%)] shrink-0 ml-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    className="px-6 pb-4 text-sm text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">
                    {item.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[var(--bg-alt)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">Ready to grow your business?</h2>
          <p className="mt-4 text-[rgb(var(--fg-rgb)/55%)] max-w-xl mx-auto">
            Join thousands of satisfied customers. Start with a plan that fits — upgrade as you grow.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm shadow-lg shadow-[rgb(var(--accent-500)/25%)]">
              Find Your Plan
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link href="/free-trial"
              className="px-8 py-4 rounded-full glass-card text-[rgb(var(--fg-rgb))] font-bold border border-[rgb(var(--fg-rgb)/10%)] hover:border-[rgb(var(--accent-500)/50%)] transition-all text-sm">
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
