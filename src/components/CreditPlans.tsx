"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PAYONEER_PAYME_URL } from "@/lib/payment";

const PLANS = [
  {
    name: "Standard",
    badge: "Best Entry",
    badgeColor: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
    monthly: 7.9,
    annual: 79,
    turnaround: "12-Hour Fast",
    turnaroundColor: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    features: ["12-hour fast delivery", "5 priority tickets / month", "5% credit bonus", "Unlimited revisions"],
    cta: "Buy Credits",
    href: "/payment?plan=Standard&amount=7.9&desc=Standard%20credit%20plan",
    featured: false,
    accent: "text-orange-400",
  },
  {
    name: "Pro",
    badge: "Most Popular",
    badgeColor: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    monthly: 19.9,
    annual: 199,
    turnaround: "6-Hour Express",
    turnaroundColor: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    features: ["6-hour ultra fast SLA", "Unlimited priority tickets", "15% credit bonus", "Unlimited revisions"],
    cta: "Pay Now",
    href: PAYONEER_PAYME_URL || "/payment?plan=Pro&amount=19.9&desc=Pro%20credit%20plan",
    featured: true,
    accent: "text-blue-400",
  },
  {
    name: "Enterprise",
    badge: "VIP Enterprise",
    badgeColor: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    monthly: 499,
    annual: 4999,
    turnaround: "45-Min VIP",
    turnaroundColor: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    features: ["45-min VIP response SLA", "Dedicated account manager", "Dedicated expert team", "Business security SLA"],
    cta: "Contact Sales",
    href: "/contact",
    featured: false,
    accent: "text-purple-400",
  },
];

export default function CreditPlans() {
  return (
    <section className="py-28 lg:py-36 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] text-sm font-bold mb-5 border border-[rgb(var(--accent-500)/15%)]">
            Credit Plans
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text leading-[1.1]">
            Save with our credit plans
          </h2>
          <p className="mt-4 text-lg text-[rgb(var(--fg-rgb)/60%)] max-w-2xl mx-auto">
            Buy credits once, use them gradually. Priority delivery, bonus credits and dedicated support — as your business grows, we grow with you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className={`relative rounded-3xl border-2 p-8 flex flex-col bg-[var(--bg-alt)] transition-all hover:-translate-y-1 hover:shadow-xl ${plan.featured ? "border-[rgb(var(--accent-500)/60%)] shadow-xl shadow-[rgb(var(--accent-500)/10%)] md:scale-[1.03]" : "border-[rgb(var(--fg-rgb)/8%)]"}`}
            >
              {plan.badge && (
                <span className={`self-start text-[11px] font-bold px-3 py-1 rounded-full mb-4 ${plan.badgeColor}`}>
                  {plan.badge}
                </span>
              )}
              <h3 className="text-2xl font-bold text-[rgb(var(--fg-rgb))]">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[rgb(var(--fg-rgb))]">${plan.monthly}</span>
                <span className="text-sm text-[rgb(var(--fg-rgb)/40%)] font-semibold">/month</span>
              </div>
              <p className="text-xs text-[rgb(var(--accent-text))] font-bold mt-1">or ${plan.annual}/year — save 20%</p>
              <div className={`rounded-xl text-center py-2.5 font-bold text-sm mt-5 ${plan.turnaroundColor} border`}>
                ⚡ {plan.turnaround}
              </div>
              <ul className="mt-6 space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[rgb(var(--fg-rgb)/70%)]">
                    <svg className="w-4 h-4 mt-0.5 text-[rgb(var(--accent-text))] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href}
                target={plan.href.startsWith("http") ? "_blank" : undefined}
                rel={plan.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`mt-8 block text-center py-3.5 rounded-xl font-bold text-sm transition-all ${plan.featured ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] hover:bg-[rgb(var(--accent-400))]" : "border-2 border-[rgb(var(--fg-rgb)/15%)] text-[rgb(var(--fg-rgb)/70%)] hover:border-[rgb(var(--accent-500)/50%)] hover:text-[rgb(var(--accent-text))]"}`}>
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center">
          <Link href="/subscription"
            className="inline-flex items-center gap-2 text-sm font-bold text-[rgb(var(--accent-text))] hover:underline">
            View all plans, calculator & full comparison
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </p>
      </div>
    </section>
  );
}
