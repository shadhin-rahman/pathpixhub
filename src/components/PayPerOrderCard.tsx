"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const FEATURES = [
  {
    icon: "🛠️",
    title: "We edit first",
    desc: "Send your images — our team starts working right away. No card needed to begin.",
  },
  {
    icon: "💳",
    title: "You pay per order",
    desc: "No credits to buy, no monthly commitment. Pay only for the edits you order.",
  },
  {
    icon: "📬",
    title: "Secure link after",
    desc: "We email you a secure payment link with your finished edits. Trust first, pay later.",
  },
];

export default function PayPerOrderCard({ compact = false }: { compact?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="relative rounded-3xl border-2 border-dashed border-[rgb(var(--accent-500)/45%)] p-8 flex flex-col bg-[var(--bg-alt)] transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[rgb(var(--accent-500)/10%)]"
    >
      <span className="self-start text-[11px] font-bold px-3 py-1 rounded-full mb-4 bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] border border-[rgb(var(--accent-500)/25%)]">
        No prepayment
      </span>
      <h3 className="text-2xl font-bold text-[rgb(var(--fg-rgb))]">Pay Per Order</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold text-[rgb(var(--accent-text))]">$0</span>
        <span className="text-sm text-[rgb(var(--fg-rgb)/40%)] font-semibold">upfront</span>
      </div>
      <p className="text-xs text-[rgb(var(--fg-rgb)/55%)] font-bold mt-1">Work first, pay later — order by order</p>

      <div className="rounded-xl text-center py-2.5 font-bold text-sm mt-5 bg-[rgb(var(--accent-500)/8%)] border border-[rgb(var(--accent-500)/25%)] text-[rgb(var(--accent-text))]">
        🤝 No credits to buy
      </div>

      <ul className="mt-6 space-y-4 flex-1">
        {FEATURES.map((f) => (
          <li key={f.title} className="flex items-start gap-3 text-sm">
            <span className="mt-0.5 text-lg shrink-0">{f.icon}</span>
            <span>
              <span className="font-bold text-[rgb(var(--fg-rgb))]">{f.title}: </span>
              <span className="text-[rgb(var(--fg-rgb)/60%)]">{f.desc}</span>
            </span>
          </li>
        ))}
      </ul>

      <Link
        href="/contact"
        className="mt-8 block text-center py-3.5 rounded-xl font-bold text-sm transition-all bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] shadow-lg shadow-[rgb(var(--accent-500)/15%)]"
      >
        Order My Edits →
      </Link>
      {!compact && (
        <p className="mt-3 text-center">
          <Link href="/credits" className="text-xs font-bold text-[rgb(var(--fg-rgb)/50%)] hover:text-[rgb(var(--accent-text))] hover:underline transition-all">
            or compare with prepaid credit packs
          </Link>
        </p>
      )}
    </motion.div>
  );
}
