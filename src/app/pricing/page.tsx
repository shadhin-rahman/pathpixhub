"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { services, priceMap } from "@/data/services";

const cardColors = [
  "#fca5a5",
  "#d8b4fe",
  "#f9a8d4",
  "#fde68a",
  "#93c5fd",
  "#86efac",
  "#fdba74",
  "#5eead4",
  "#a5b4fc",
  "#fda4af",
];

const slideItems = [...services, ...services, ...services];
const trialRepeats = Array.from({ length: 10 }, (_, i) => i);

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
  const [activeTab, setActiveTab] = useState<"per-image" | "subscription">("per-image");
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const skipTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const skipAhead = () => {
    if (!sliderRef.current) return;
    clearTimeout(skipTimer.current);
    sliderRef.current.style.animationDuration = "6s";
    skipTimer.current = setTimeout(() => {
      if (sliderRef.current) {
        sliderRef.current.style.animationDuration = "50s";
      }
    }, 4000);
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-20 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[rgb(var(--fg-rgb))] leading-[1.1]">
                Stress less with simple pricing<br />and pixel perfect photo edits
              </h1>
              <p className="mt-5 text-base md:text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
                Curious about how much your edits will cost? Get an instant quote to see your total right away, or keep reading to learn more about how PathPixHub photo editing rates work.
              </p>
              <div className="mt-8 flex flex-col gap-4">
                <Link
                  href="/contact#calculator"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm shadow-lg shadow-[rgb(var(--accent-500)/25%)] w-fit"
                >
                  Get an instant estimate
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="https://wa.me/8801723735896"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-[rgb(var(--fg-rgb)/10%)] text-sm font-semibold text-[rgb(var(--fg-rgb)/70%)] hover:border-[rgb(34_197_94_/_50%)] hover:text-[rgb(34_197_94)] hover:shadow-md transition-all duration-300"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    Chat on WhatsApp
                  </Link>
                  <Link
                    href="mailto:info@pathpixhub.com"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-[rgb(var(--fg-rgb)/10%)] text-sm font-semibold text-[rgb(var(--fg-rgb)/70%)] hover:border-[rgb(var(--accent-500)/50%)] hover:text-[rgb(var(--accent-400))] hover:shadow-md transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Email Us
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-[rgb(var(--fg-rgb)/10%)] text-sm font-semibold text-[rgb(var(--fg-rgb)/70%)] hover:border-[rgb(var(--accent-500)/50%)] hover:text-[rgb(var(--accent-400))] hover:shadow-md transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Contact Form
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[26rem] rounded-3xl overflow-hidden glass-card border-[rgb(var(--fg-rgb)/10%)]">
              <Image
                src="/images/price-page.png"
                alt="Price page"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tab Switcher */}
      <section className="bg-[var(--bg-alt)] pt-8 pb-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center">
            <div className="inline-flex rounded-2xl bg-[var(--bg)] border-2 border-[rgb(var(--fg-rgb)/8%)] p-1.5">
              <button
                onClick={() => setActiveTab("per-image")}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === "per-image"
                    ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow-lg shadow-[rgb(var(--accent-500)/25%)]"
                    : "text-[rgb(var(--fg-rgb)/50%)] hover:text-[rgb(var(--fg-rgb)/80%)]"
                }`}
              >
                Pay Per Image
              </button>
              <button
                onClick={() => setActiveTab("subscription")}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative ${
                  activeTab === "subscription"
                    ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] shadow-lg shadow-[rgb(var(--accent-500)/25%)]"
                    : "text-[rgb(var(--fg-rgb)/50%)] hover:text-[rgb(var(--fg-rgb)/80%)]"
                }`}
              >
                Subscription Plans
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  NEW
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {activeTab === "per-image" ? (
          <motion.div
            key="per-image"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Price Cards Grid */}
            <section className="pt-16 pb-20 bg-[var(--bg-alt)]">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {services.map((s, i) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      className="rounded-2xl p-5 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl"
                      style={{ backgroundColor: cardColors[i % cardColors.length] }}
                    >
                      <div className="flex flex-col items-center text-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-all duration-300">
                          <Image
                            src={`/images/service-icons/${s.id}.png`}
                            alt={s.title}
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                        </div>
                        <Link
                          href={`/services/${s.id}`}
                          className="font-bold text-sm text-[rgb(var(--fg-rgb)/85%)] leading-tight hover:text-[rgb(var(--accent-500))] transition-colors"
                        >
                          {s.title}
                        </Link>
                      </div>
                      <p className="text-xs font-mono tracking-[0.1em] text-[rgb(var(--fg-rgb)/60%)] font-bold text-center">
                        {priceMap[s.id]}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Marquee Slider */}
            <section className="py-20 overflow-hidden bg-[var(--bg)] relative">
              <div className="flex gap-6 w-max marquee-slide" ref={sliderRef}>
                {slideItems.map((s, i) => {
                  const ci = i % cardColors.length;
                  return (
                    <div key={`${s.id}-${i}`} className="flex-shrink-0 w-64 md:w-80 group">
                      <div className="rounded-2xl p-4 pb-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        style={{ backgroundColor: cardColors[ci] }}
                      >
                        <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden bg-white/10">
                          <Image
                            src={`/images/service-showcase/${s.id}.png`}
                            alt={s.title}
                            fill
                            className="object-contain p-3 group-hover:opacity-0 transition-opacity duration-500"
                            sizes="(max-width: 768px) 256px, 320px"
                          />
                          <Image
                            src={`/images/service-showcase/${s.id}-before.png`}
                            alt={`${s.title} before`}
                            fill
                            className="object-contain p-3 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            sizes="(max-width: 768px) 256px, 320px"
                          />
                        </div>
                        <Link
                          href={`/services/${s.id}`}
                          className="block mt-3 text-[rgb(var(--fg-rgb)/80%)] font-bold text-sm text-center leading-tight hover:text-[rgb(var(--accent-500))] transition-colors"
                        >
                          {s.title}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={skipAhead}
                aria-label="Skip ahead"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass-card bg-[var(--bg-alt)/80] backdrop-blur-md text-[rgb(var(--accent-400))] flex items-center justify-center hover:bg-[rgb(var(--accent-500))] hover:text-[rgb(var(--accent-contrast))] transition-all duration-300 shadow-lg border border-[rgb(var(--fg-rgb)/10%)]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </section>

            {/* Free Trial Marquee */}
            <section className="py-20 bg-[var(--bg-alt)] overflow-hidden">
              <div className="flex gap-10 w-max items-center marquee-trial">
                {trialRepeats.map((i) => (
                  <div key={i} className="flex items-center gap-10">
                    <span className="text-xl md:text-2xl font-bold tracking-tight text-[rgb(var(--fg-rgb))] whitespace-nowrap">
                      Get your first two images edited, on us.
                    </span>
                    <Link
                      href="/free-trial"
                      className="px-6 py-3 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-sm whitespace-nowrap hover:bg-[rgb(var(--accent-500))] hover:scale-105 transition-all shrink-0 shadow-lg shadow-[rgb(var(--accent-500)/25%)]"
                    >
                      Get 2 free edits
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="subscription"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Subscription: Billing Toggle */}
            <section className="pt-12 pb-0 bg-[var(--bg-alt)]">
              <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
                  Monthly or Annual billing
                </h2>
                <p className="mt-3 text-[rgb(var(--fg-rgb)/55%)]">Save 20% with annual billing</p>
                <div className="mt-6 flex items-center justify-center gap-4">
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

            {/* Subscription: Tier Cards */}
            <section className="pb-20 bg-[var(--bg-alt)]">
              <div className="max-w-7xl mx-auto px-6 pt-8">
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
                      <p className="text-xs text-[rgb(var(--fg-rgb)/35%)] mt-1">+ {tier.perImage} per image</p>
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

            {/* Subscription: Professional Services */}
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

            {/* Subscription: Feature Comparison */}
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

            {/* Subscription: FAQ */}
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

            {/* Subscription: CTA */}
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
