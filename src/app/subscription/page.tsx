"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CREDIT_BUNDLES } from "@/components/CreditSlider";
import CreditPurchaseModal from "@/components/CreditPurchaseModal";

const TIERS = [
  {
    name: "Free",
    badge: "",
    badgeColor: "",
    monthlyPrice: 0,
    yearlyPrice: 0,
    perImage: 1.45,
    priceLabel: "",
    desc: "Pay-as-you-go for occasional edits",
    turnaround: "24h",
    turnaroundLabel: "24-Hour Delivery",
    turnaroundColor: "",
    features: [
      { text: "Clipping Path & BG Removal", included: true },
      { text: "Standard Support Queue", included: true },
      { text: "24-Hour Delivery", included: true },
      { text: "Priority Support", included: false },
      { text: "Dedicated Manager", included: false },
    ],
    loyalty: "",
    cta: "Start Free",
    ctaLink: "/free-trial",
    style: "",
  },
  {
    name: "Standard",
    badge: "Best Entry",
    badgeColor: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
    monthlyPrice: 0,
    yearlyPrice: 0,
    perImage: 0,
    priceLabel: "Pay As You Go",
    desc: "12h fast delivery for growing sellers",
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
    cta: "Buy Credits",
    ctaLink: "",
    style: "border-orange-500/30",
  },
  {
    name: "Pro",
    badge: "Most Popular",
    badgeColor: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    monthlyPrice: 0,
    yearlyPrice: 0,
    perImage: 0,
    priceLabel: "Path Credits Subscription",
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
    cta: "Pay Now",
    ctaLink: "",
    style: "border-[rgb(var(--accent-500)/60%)] shadow-xl shadow-[rgb(var(--accent-500)/10%)] scale-[1.02]",
    featured: true,
  },
  {
    name: "Enterprise",
    badge: "VIP Enterprise",
    badgeColor: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    monthlyPrice: 499,
    yearlyPrice: 4790,
    perImage: 0,
    priceLabel: "$499/month",
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
    ctaLink: "",
    style: "",
  },
];

const CURRENCIES = [
  { code: "USD", symbol: "$", rate: 1, label: "$ USD" },
  { code: "CAD", symbol: "C$", rate: 1.36, label: "C$ CAD" },
  { code: "GBP", symbol: "£", rate: 0.79, label: "£ GBP" },
  { code: "EUR", symbol: "€", rate: 0.92, label: "€ EUR" },
];

const PRO_SERVICES = [
  { icon: "🎓", name: "Product Training", price: "$195", desc: "2-hour interactive session covering platform setup, tools & workflow optimization." },
  { icon: "📋", name: "Custom Specification", price: "$295", desc: "30-min consultation call. Receive one custom spec, quality check & success guide." },
  { icon: "🚀", name: "Priority Onboarding", price: "$1,295", desc: "We evaluate your needs, onboard up to 5 categories & create custom workflow setup." },
  { icon: "🏆", name: "Enterprise Onboarding", price: "$4,995", desc: "Unlimited category onboarding, custom workflows, dedicated team — full white-glove setup." },
];

const FAQ_ITEMS = [
  { q: "Can I switch plans anytime?", a: "Yes! Upgrade or downgrade anytime. Upgrades take effect immediately. Downgrades apply at next billing cycle." },
  { q: "What is Path Credit and how does it work?", a: "Path Credits are prepaid editing credits. Auto top-up earns bonus credits (5-25%) that never expire." },
  { q: "Is there a free trial?", a: "Yes! All paid plans include a 14-day free trial with 10 free images. No credit card needed for Standard." },
  { q: "How does the loyalty program work?", a: "6 consecutive months = 10% lifetime discount. Bonus credits on every top-up. Refer friends for free months!" },
  { q: "Can I cancel anytime?", a: "Yes, cancel anytime with no penalties. Access continues until billing period ends." },
  { q: "Can I pause my subscription?", a: "Of course! Pause manually or auto-pause after 1 inactive billing cycle. Monthly fee drops to $4/mo and all specs are saved. No reactivation fee!" },
  { q: "How much do I save with annual billing?", a: "Save 20% with annual! Standard $480/yr, Pro $950/yr, Enterprise $4,790/yr. Price locked 12 months." },
];

export default function SubscriptionPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currency, setCurrency] = useState(0);
  const [volume, setVolume] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [support, setSupport] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const defaultBundle = CREDIT_BUNDLES.find((b) => b.popular) ?? CREDIT_BUNDLES[0];

  const curr = CURRENCIES[currency];

  const formatPrice = (usd: number) => {
    const converted = usd * curr.rate;
    return `${curr.symbol}${converted.toFixed(converted >= 100 ? 0 : 2)}`;
  };

  const getRecommendedPlan = () => {
    let score = 0;
    if (volume >= 2) score += 2; else if (volume >= 1) score += 1;
    if (speed >= 2) score += 2; else if (speed >= 1) score += 1;
    if (support >= 1) score += support + 1;
    if (score >= 5) return 3;
    if (score >= 3) return 2;
    if (score >= 1) return 1;
    return 0;
  };

  const recommended = getRecommendedPlan();
  const recommendedNames = ["Free", "Standard", "Pro", "Enterprise"];
  const recommendedPrices = [0, 50, 99, 499];
  const recommendedDescs = [
    "24h standard delivery",
    "12h fast delivery, 5 priority tickets",
    "6h express, unlimited revisions & time account",
    "45min VIP SLA, dedicated team",
  ];

  const getTierHref = (tier: (typeof TIERS)[number]): string => {
    if (tier.name === "Standard") {
      return "/credits";
    }
    if (tier.name === "Enterprise") {
      return "/enterprise";
    }
    return tier.ctaLink;
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-20 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-sm font-bold mb-6 border border-[rgb(var(--accent-500)/15%)]">
            Subscription Plans
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight gradient-text leading-[1.1]">
            Simple pricing,<br />pixel perfect edits
          </h1>
          <p className="mt-5 text-lg text-[rgb(var(--fg-rgb)/60%)] max-w-2xl mx-auto leading-relaxed">
            Choose a plan that fits your needs. Start free, upgrade as you grow. All plans include our expert editing team.
          </p>
        </div>
      </section>

      {/* Billing Toggle + Currency */}
      <section className="pb-0 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-bold transition-colors ${!annual ? "text-[rgb(var(--fg-rgb))]" : "text-[rgb(var(--fg-rgb)/40%)]"}`}>Monthly</span>
            <button type="button" onClick={() => setAnnual(!annual)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${annual ? "bg-[rgb(var(--accent-500))]" : "bg-[rgb(var(--fg-rgb)/15%)]"}`}>
              <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${annual ? "left-[30px]" : "left-0.5"}`} />
            </button>
            <span className={`text-sm font-bold transition-colors ${annual ? "text-[rgb(var(--fg-rgb))]" : "text-[rgb(var(--fg-rgb)/40%)]"}`}>
              Annual <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] border border-[rgb(var(--accent-500)/20%)] ml-1">Save 20%</span>
            </span>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-xs text-[rgb(var(--fg-rgb)/40%)]">Currency:</span>
            {CURRENCIES.map((c, ci) => (
              <button key={ci} onClick={() => setCurrency(ci)}
                className={`text-xs px-2 py-1 rounded-lg font-bold transition-all ${currency === ci ? "bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] border border-[rgb(var(--accent-500)/20%)]" : "text-[rgb(var(--fg-rgb)/30%)] hover:text-[rgb(var(--fg-rgb)/50%)] border border-transparent"}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tier Cards */}
      <section className="pb-20 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {TIERS.map((tier, i) => {
              const savings = annual && tier.monthlyPrice > 0
                ? { total: tier.monthlyPrice * 12 - tier.yearlyPrice, perMonth: ((tier.monthlyPrice * 12 - tier.yearlyPrice) / 12) }
                : null;
              return (
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
                <div className="mt-3">
                  {tier.priceLabel ? (
                    <span className="text-lg font-extrabold text-[rgb(var(--fg-rgb))]">
                      {tier.priceLabel}
                    </span>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-[rgb(var(--fg-rgb))]">
                        {tier.monthlyPrice === 0 ? formatPrice(0) : annual ? formatPrice(tier.yearlyPrice) : formatPrice(tier.monthlyPrice)}
                      </span>
                      <span className="text-sm text-[rgb(var(--fg-rgb)/40%)] font-semibold">/{annual ? "yr" : "mo"}</span>
                    </div>
                  )}
                </div>
                {savings && (
                  <p className="text-xs text-[rgb(var(--accent-text))] font-bold mt-1">{formatPrice(savings.total)} savings ({formatPrice(savings.perMonth)}/mo)</p>
                )}
                <p className="text-xs text-[rgb(var(--fg-rgb)/35%)] mt-1">+ {tier.perImage > 0 ? `${formatPrice(tier.perImage)} per image` : "Included"}</p>
                <p className="mt-3 text-sm text-[rgb(var(--fg-rgb)/55%)] min-h-[40px]">{tier.desc}</p>
                <div className="h-px bg-[rgb(var(--fg-rgb)/8%)] my-4" />
                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm">
                      {f.included ? (
                        <svg className="w-4 h-4 mt-0.5 text-[rgb(var(--accent-text))] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
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
                {tier.name === "Enterprise" && (
                  <Link href="/enterprise"
                    className="mb-3 block text-center text-xs font-bold text-purple-400 hover:text-purple-300 hover:underline transition-all">
                    See what &amp; how it works →
                  </Link>
                )}
                <div className={`rounded-xl text-center py-3 font-bold text-sm ${tier.turnaroundColor || "bg-[rgb(var(--fg-rgb)/5%)] text-[rgb(var(--fg-rgb)/50%)]"} border`}>
                  ⚡ {tier.turnaroundLabel}
                </div>
                {tier.name === "Pro" ? (
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="mt-4 block w-full text-center py-3 rounded-xl font-bold text-sm transition-all bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] hover:bg-[rgb(var(--accent-400))] shadow-lg shadow-[rgb(var(--accent-500)/15%)] cursor-pointer"
                  >
                    {tier.cta}
                  </button>
                ) : (
                  <Link href={getTierHref(tier)}
                    target={getTierHref(tier).startsWith("http") ? "_blank" : undefined}
                    rel={getTierHref(tier).startsWith("http") ? "noopener noreferrer" : undefined}
                    className="mt-4 block text-center py-3 rounded-xl font-bold text-sm transition-all bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] hover:bg-[rgb(var(--accent-400))] shadow-lg shadow-[rgb(var(--accent-500)/15%)]">
                    {tier.cta}
                  </Link>
                )}
              </motion.div>
              );
            })}
          </div>

          {/* VIP Extra Care */}
          <div className="mt-8 rounded-2xl border-2 border-purple-500/30 bg-[var(--bg)] p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-lg">👑</span>
              <h3 className="text-lg font-bold text-purple-400">VIP Extra Care</h3>
            </div>
            <p className="text-sm text-[rgb(var(--fg-rgb)/55%)]">Dedicated Account Manager • 24/7 Priority Support • 1-Hour Emergency Response • Custom Workflow Setup • Personal Expert Team</p>
          </div>

          {/* Simple & secure payments */}
          <div className="mt-8 rounded-2xl border-2 border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg)] p-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-lg">💳</span>
              <h3 className="text-lg font-bold text-[rgb(var(--fg-rgb))]">Simple & secure payments</h3>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] border border-[rgb(var(--accent-500)/25%)]">Powered by Payoneer</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border-2 border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-alt)] p-4">
                <p className="font-bold text-sm text-[rgb(var(--fg-rgb))] mb-1">📧 Order via Email</p>
                <p className="text-xs text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">Submit your images through our form. We edit first, then email you a secure Payoneer payment link.</p>
              </div>
              <div className="rounded-xl border-2 border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-alt)] p-4">
                <p className="font-bold text-sm text-[rgb(var(--fg-rgb))] mb-1">💳 Pay Now (Card/PayPal)</p>
                <p className="text-xs text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">Fixed-price plans use a direct payment link — pay by card, PayPal, or bank transfer in your own currency.</p>
              </div>
              <div className="rounded-xl border-2 border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-alt)] p-4">
                <p className="font-bold text-sm text-[rgb(var(--fg-rgb))] mb-1">🤝 Custom / Enterprise</p>
                <p className="text-xs text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">Contact our sales team for a custom quote and dedicated invoicing — built around your workflow.</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-[rgb(var(--fg-rgb)/40%)]">
              🔒 You pay in your local currency — we receive payment in USD. Secured by Payoneer&apos;s global payment network. Visa • Mastercard • AMEX • PayPal • Bank transfer
            </p>

            {/* Pay Per Order CTA */}
            <div className="mt-8 rounded-2xl border-2 border-dashed border-[rgb(var(--accent-500)/40%)] bg-[rgb(var(--accent-500)/4%)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div>
                <p className="font-bold text-lg text-[rgb(var(--fg-rgb))]">Prefer to skip the prepaid plans?</p>
                <p className="text-sm text-[rgb(var(--fg-rgb)/55%)] mt-1">Pay Per Order — we edit first, you pay later. No credits, no monthly commitment.</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link href="/credits"
                  className="px-6 py-3 rounded-full glass-card border border-[rgb(var(--fg-rgb)/10%)] text-sm font-bold hover:border-[rgb(var(--accent-500)/50%)] hover:text-[rgb(var(--accent-text))] transition-all whitespace-nowrap">
                  See credit packs
                </Link>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] text-sm font-bold hover:bg-[rgb(var(--accent-400))] transition-all whitespace-nowrap">
                  Order My Edits →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Services */}
      <section className="py-20 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-sm font-bold mb-4 border border-[rgb(var(--accent-500)/15%)]">
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
                <p className="text-2xl font-extrabold text-[rgb(var(--accent-text))] mb-1">{svc.price}</p>
                <p className="text-xs text-[rgb(var(--fg-rgb)/35%)] mb-4">one-time fee</p>
                <p className="text-sm text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">{svc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan Calculator */}
      <section className="py-20 bg-[var(--bg-alt)]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-sm font-bold mb-4 border border-[rgb(var(--accent-500)/15%)]">
              Plan Calculator
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
              Find the right plan for your needs
            </h2>
            <p className="mt-4 text-[rgb(var(--fg-rgb)/55%)]">Select volume, speed and support level to see which plan fits you best</p>
          </div>
          <div className="rounded-2xl border-2 border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg)] p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-3 block">📸 Monthly Image Volume</label>
                <div className="space-y-2">
                  {["1-50 images", "51-250 images", "251-1000 images", "1000+ images"].map((o, oi) => (
                    <label key={oi} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${volume === oi ? "border-[rgb(var(--accent-500)/50%)] bg-[rgb(var(--accent-500)/5%)]" : "border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--accent-500)/30%)]"}`}>
                      <input type="radio" name="volume" checked={volume === oi} onChange={() => setVolume(oi)} className="accent-[rgb(var(--accent-500))]" />
                      <span className="text-sm text-[rgb(var(--fg-rgb)/70%)]">{o}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-3 block">⚡ Speed Requirement</label>
                <div className="space-y-2">
                  {["24 hours (Standard)", "12 hours (Fast)", "6 hours (Express)", "45 minutes (VIP)"].map((o, oi) => (
                    <label key={oi} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${speed === oi ? "border-[rgb(var(--accent-500)/50%)] bg-[rgb(var(--accent-500)/5%)]" : "border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--accent-500)/30%)]"}`}>
                      <input type="radio" name="speed" checked={speed === oi} onChange={() => setSpeed(oi)} className="accent-[rgb(var(--accent-500))]" />
                      <span className="text-sm text-[rgb(var(--fg-rgb)/70%)]">{o}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-3 block">🛡️ Support Level</label>
                <div className="space-y-2">
                  {["Standard Support", "Unlimited Revisions", "Dedicated Team"].map((o, oi) => (
                    <label key={oi} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${support === oi ? "border-[rgb(var(--accent-500)/50%)] bg-[rgb(var(--accent-500)/5%)]" : "border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--accent-500)/30%)]"}`}>
                      <input type="radio" name="support" checked={support === oi} onChange={() => setSupport(oi)} className="accent-[rgb(var(--accent-500))]" />
                      <span className="text-sm text-[rgb(var(--fg-rgb)/70%)]">{o}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 p-6 rounded-2xl bg-[rgb(var(--accent-500)/5%)] border border-[rgb(var(--accent-500)/15%)] text-center">
              <p className="text-xs text-[rgb(var(--fg-rgb)/40%)] uppercase tracking-wider font-bold mb-2">Suggested Plan</p>
              <p className="text-2xl font-extrabold gradient-text">{recommendedNames[recommended]} Plan</p>
              <p className="text-sm text-[rgb(var(--fg-rgb)/55%)] mt-1">{formatPrice(recommendedPrices[recommended])} /mo — {recommendedDescs[recommended]}</p>
              <p className="text-xs text-[rgb(var(--accent-text))] mt-2 font-bold">🎯 Best match for you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Growth Journey */}
      <section className="py-20 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-sm font-bold mb-4 border border-[rgb(var(--accent-500)/15%)]">
              Growth Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
              From small to big — your growth path
            </h2>
            <p className="mt-4 text-[rgb(var(--fg-rgb)/55%)]">Start with Free today, upgrade as you grow. We grow with you!</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            {[
              { icon: "🆓", name: "Free", price: "$0", desc: "Pay-as-you-go 24h delivery", color: "border-[rgb(var(--fg-rgb)/8%)]" },
              { icon: "🔥", name: "Standard", price: "$50/mo", desc: "12h fast delivery, 5 priority tickets", color: "border-orange-500/30" },
              { icon: "⭐", name: "Pro", price: "$99/mo", desc: "6h ultra fast + unlimited revisions", color: "border-[rgb(var(--accent-500)/50%)]" },
              { icon: "👑", name: "Enterprise", price: "$499/mo", desc: "45min VIP SLA + dedicated team", color: "border-purple-500/30" },
            ].map((step, si) => (
              <div key={si} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: si * 0.1 }}
                  className={`rounded-2xl border-2 ${step.color} bg-[var(--bg-alt)] p-5 text-center w-48`}
                >
                  <span className="text-2xl">{step.icon}</span>
                  <p className="font-bold text-sm text-[rgb(var(--fg-rgb))] mt-2">{step.name}</p>
                  <p className="text-lg font-extrabold gradient-text">{step.price}</p>
                  <p className="text-[11px] text-[rgb(var(--fg-rgb)/40%)] mt-1">{step.desc}</p>
                </motion.div>
                {si < 3 && (
                  <svg className="w-8 h-8 text-[rgb(var(--fg-rgb)/15%)] mx-2 shrink-0 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                )}
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-[rgb(var(--fg-rgb)/40%)]">
            💡 With each upgrade you get: faster delivery, more support, more features — as your business grows, our service grows with you
          </p>
        </div>
      </section>

      {/* Quick Plan Comparison */}
      <section className="py-20 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-sm font-bold mb-4 border border-[rgb(var(--accent-500)/15%)]">
              Quick Plan Comparison
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
              Plans at a glance
            </h2>
          </div>
          <div className="rounded-2xl border border-[rgb(var(--fg-rgb)/8%)]">
            {/* Black header bar */}
            <div className="flex items-center gap-0 rounded-t-2xl" style={{ backgroundColor: '#0a0a0a' }}>
              <div className="flex-1 py-5 px-6 font-bold text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Feature</div>
              <div className="flex-1 py-5 px-6 text-center">
                <div className="font-bold text-white">Standard</div>
                <div className="text-sm font-bold text-[rgb(var(--accent-text))]">Pay As You Go</div>
              </div>
              <div className="flex-1 py-5 px-6 text-center">
                <div className="font-bold text-white">Pro</div>
                <div className="text-sm font-bold text-[rgb(var(--accent-text))]">Path Credits Subscription</div>
              </div>
              <div className="flex-1 py-5 px-6 text-center">
                <div className="font-bold text-white">Enterprise</div>
                <div className="text-sm font-bold text-[rgb(var(--accent-text))]">$499/month</div>
              </div>
            </div>
            {/* White body */}
            <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white">
              <tbody>
                {[
                  { label: "Next Morning Turnaround", values: [false, true, true] },
                  { label: "Discount on credits", values: ["0%", "35%", "Custom"] },
                  { label: "Image editing price", values: ["Variable", "Variable", "Flat"] },
                  { label: "Dedicated Account Manager", values: [false, false, true] },
                  { label: "Dedicated Editing Team", values: [false, true, true] },
                  { label: "Monthly billing by invoice", values: [false, false, true] },
                  { label: "Minimum order fee", values: ["$2.5", false, false] },
                ].map((row, ri) => (
                  <tr key={row.label} className={`border-b border-black/5 ${ri % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}`}>
                    <td className="py-3.5 px-4 text-black/70 font-medium">{row.label}</td>
                    {row.values.map((val, i) => {
                      if (val === true) {
                        return (
                          <td key={i} className="py-3.5 px-4 text-center bg-[rgb(var(--accent-500))/15%]">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          </td>
                        );
                      }
                      if (val === false) {
                        return (
                          <td key={i} className="py-3.5 px-4 text-center text-black/20 font-bold">
                            —
                          </td>
                        );
                      }
                      return (
                        <td key={i} className="py-3.5 px-4 text-center font-bold text-black/80">
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
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-sm font-bold mb-4 border border-[rgb(var(--accent-500)/15%)]">
              Full Comparison
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
              Every feature, side by side
            </h2>
          </div>
          <div className="rounded-2xl border border-[rgb(var(--fg-rgb)/8%)]">
            {/* Black header bar */}
            <div className="flex items-center gap-0 rounded-t-2xl" style={{ backgroundColor: '#0a0a0a' }}>
              <div className="flex-[1.5] py-5 px-6 font-bold text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Feature</div>
              <div className="flex-1 py-5 px-6 text-center font-bold text-orange-400">Free</div>
              <div className="flex-1 py-5 px-6 text-center font-bold text-orange-400">Standard</div>
              <div className="flex-1 py-5 px-6 text-center font-bold text-[rgb(var(--accent-text))]">Pro</div>
              <div className="flex-1 py-5 px-6 text-center font-bold text-purple-400">Enterprise</div>
            </div>
            {/* White body */}
            <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white">
              <tbody>
                <tr><td colSpan={5} className="py-3 px-6 font-bold text-black/50 text-xs uppercase tracking-wider bg-black/[0.03]">Core Editing Services</td></tr>
                {["Clipping Path & BG Removal", "Color Correction & Retouching", "Ghost Mannequin", "Shadow Creation", "Layer Mask"].map((f, ri) => (
                  <tr key={f} className={`border-b border-black/5 ${ri % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}`}>
                    <td className="py-3 px-6 text-black/70 font-medium">{f}</td>
                    {[1,2,3,4].map(j => <td key={j} className="py-3 px-6 text-center text-[rgb(var(--accent-text))] font-bold">✓</td>)}
                  </tr>
                ))}
                <tr className="border-b border-black/5 bg-white">
                  <td className="py-3 px-6 text-black/70 font-medium">Color Changing</td>
                  <td className="py-3 px-6 text-center text-black/20">✕</td>
                  <td className="py-3 px-6 text-center text-black/20">✕</td>
                  <td className="py-3 px-6 text-center text-[rgb(var(--accent-text))] font-bold">✓</td>
                  <td className="py-3 px-6 text-center text-[rgb(var(--accent-text))] font-bold">✓</td>
                </tr>

                <tr><td colSpan={5} className="py-3 px-6 font-bold text-black/50 text-xs uppercase tracking-wider bg-black/[0.03]">Delivery & SLA</td></tr>
                <tr className="border-b border-black/5 bg-white">
                  <td className="py-3 px-6 text-black/70 font-medium">Delivery Time</td>
                  <td className="py-3 px-6 text-center font-bold">24h</td>
                  <td className="py-3 px-6 text-center font-bold text-orange-400">12h</td>
                  <td className="py-3 px-6 text-center font-bold text-[rgb(var(--accent-text))]">6h</td>
                  <td className="py-3 px-6 text-center font-bold text-purple-400">45m</td>
                </tr>
                <tr className="border-b border-black/5 bg-black/[0.02]">
                  <td className="py-3 px-6 text-black/70 font-medium">Rush Option</td>
                  <td className="py-3 px-6 text-center text-black/20">✕</td>
                  <td className="py-3 px-6 text-center text-black/20">✕</td>
                  <td className="py-3 px-6 text-center text-[rgb(var(--accent-text))] font-bold">✓ (3h)</td>
                  <td className="py-3 px-6 text-center text-[rgb(var(--accent-text))] font-bold">✓ (1h)</td>
                </tr>

                <tr><td colSpan={5} className="py-3 px-6 font-bold text-black/50 text-xs uppercase tracking-wider bg-black/[0.03]">Support & Service</td></tr>
                <tr className="border-b border-black/5 bg-white">
                  <td className="py-3 px-6 text-black/70 font-medium">Priority Support</td>
                  <td className="py-3 px-6 text-center text-black/20">✕</td>
                  <td className="py-3 px-6 text-center">5/mo</td>
                  <td className="py-3 px-6 text-center text-[rgb(var(--accent-text))] font-bold">Unlimited</td>
                  <td className="py-3 px-6 text-center text-[rgb(var(--accent-text))] font-bold">Unlimited</td>
                </tr>
                <tr className="border-b border-black/5 bg-black/[0.02]">
                  <td className="py-3 px-6 text-black/70 font-medium">Unlimited Revisions</td>
                  <td className="py-3 px-6 text-center text-black/20">✕</td>
                  <td className="py-3 px-6 text-center text-black/20">✕</td>
                  <td className="py-3 px-6 text-center text-[rgb(var(--accent-text))] font-bold">✓</td>
                  <td className="py-3 px-6 text-center text-[rgb(var(--accent-text))] font-bold">✓</td>
                </tr>
                <tr className="border-b border-black/5 bg-white">
                  <td className="py-3 px-6 text-black/70 font-medium">Dedicated Account Manager</td>
                  <td className="py-3 px-6 text-center text-black/20">✕</td>
                  <td className="py-3 px-6 text-center text-black/20">✕</td>
                  <td className="py-3 px-6 text-center text-black/20">✕</td>
                  <td className="py-3 px-6 text-center text-[rgb(var(--accent-text))] font-bold">✓</td>
                </tr>
                <tr className="border-b border-black/5 bg-black/[0.02]">
                  <td className="py-3 px-6 text-black/70 font-medium">Dedicated Expert Team</td>
                  <td className="py-3 px-6 text-center text-black/20">✕</td>
                  <td className="py-3 px-6 text-center text-black/20">✕</td>
                  <td className="py-3 px-6 text-center text-black/20">✕</td>
                  <td className="py-3 px-6 text-center text-[rgb(var(--accent-text))] font-bold">✓</td>
                </tr>

                <tr><td colSpan={5} className="py-3 px-6 font-bold text-black/50 text-xs uppercase tracking-wider bg-black/[0.03]">Billing & Value</td></tr>
                <tr className="border-b border-black/5 bg-white">
                  <td className="py-3 px-6 text-black/70 font-medium">Path Credit Bonus</td>
                  <td className="py-3 px-6 text-center text-black/20">✕</td>
                  <td className="py-3 px-6 text-center">5%</td>
                  <td className="py-3 px-6 text-center">15%</td>
                  <td className="py-3 px-6 text-center">25%</td>
                </tr>
                <tr className="border-b border-black/5 bg-black/[0.02]">
                  <td className="py-3 px-6 text-black/70 font-medium">Pause Subscription</td>
                  <td className="py-3 px-6 text-center text-black/20">✕</td>
                  <td className="py-3 px-6 text-center text-[rgb(var(--accent-text))] font-bold">✓ ($4/mo)</td>
                  <td className="py-3 px-6 text-center text-[rgb(var(--accent-text))] font-bold">✓ ($4/mo)</td>
                  <td className="py-3 px-6 text-center text-[rgb(var(--accent-text))] font-bold">✓ ($4/mo)</td>
                </tr>
                <tr className="border-b border-black/5 bg-white">
                  <td className="py-3 px-6 text-black/70 font-medium">Business SLA Guarantee</td>
                  <td className="py-3 px-6 text-center text-black/20">✕</td>
                  <td className="py-3 px-6 text-center text-black/20">✕</td>
                  <td className="py-3 px-6 text-center text-black/20">✕</td>
                  <td className="py-3 px-6 text-center text-[rgb(var(--accent-text))] font-bold">✓</td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </section>

      {/* Loyalty Rewards */}
      <section className="py-20 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-sm font-bold mb-4 border border-[rgb(var(--accent-500)/15%)]">
              Loyalty Rewards
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
              The longer you stay, the more you save
            </h2>
            <p className="mt-4 text-[rgb(var(--fg-rgb)/55%)]">We reward loyal clients. New value unlocks with every month you stay.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "💎", title: "Path Credit Bonus", desc: "Bonus credits on every auto top-up. Pro users get 15% extra — meaning free edits every month." },
              { icon: "🔥", title: "6-Month Loyalty Discount", desc: "Stay subscribed for 6 consecutive months = 10% lifetime discount. We value long-term partners." },
              { icon: "🤝", title: "Referral Program", desc: "Refer a friend — both get 1 month free. No limit — refer 12 people, get 12 months free." },
              { icon: "📦", title: "Annual Lock-In Benefit", desc: "Choose annual billing and lock today's price for 12 months. No price increases, no surprises." },
              { icon: "🛡️", title: "Grandfather Protection", desc: "Existing clients get 2-3 years of free benefits. Upgrade anytime, perks never expire." },
              { icon: "⏸️", title: "Pause Anytime", desc: "Pause manually or auto-pause. Paused fee is $4/mo, settings preserved. Reactivate free!" },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border-2 border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-alt)] p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <span className="text-3xl">{item.icon}</span>
                <h3 className="font-bold text-[rgb(var(--fg-rgb))] mt-3 mb-2">{item.title}</h3>
                <p className="text-sm text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[var(--bg-alt)]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-sm font-bold mb-4 border border-[rgb(var(--accent-500)/15%)]">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="rounded-xl border-2 border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg)] overflow-hidden">
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
      <section className="py-20 bg-[var(--bg)]">
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

      <CreditPurchaseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        bundle={defaultBundle}
      />
    </>
  );
}
