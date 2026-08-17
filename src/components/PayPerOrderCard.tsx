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
      className="relative rounded-3xl border-2 border-[rgb(var(--fg-rgb)/8%)] p-8 flex flex-col bg-[var(--bg-alt)] transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[rgb(var(--accent-500)/8%)] hover:border-[rgb(var(--accent-500)/30%)]"
    >
      <span className="self-start text-[11px] font-bold px-3.5 py-1.5 rounded-full mb-4 bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] border border-[rgb(var(--accent-500)/25%)]">
        No prepayment
      </span>
      <h3 className="text-xl font-bold text-[rgb(var(--fg-rgb))]">Pay Per Order</h3>
      <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/50%)] leading-relaxed">
        No lock-in, no monthly commitment — order by order.
      </p>

      <div className="mt-7 flex items-baseline gap-1">
        <span className="text-5xl font-extrabold tracking-tight text-[rgb(var(--fg-rgb))]">$0</span>
        <span className="text-xl font-bold text-[rgb(var(--fg-rgb)/35%)]">upfront</span>
      </div>
      <p className="mt-2 text-xs text-[rgb(var(--accent-text))] font-bold">Work first, pay later — order by order</p>

      <div className="rounded-xl text-center py-2.5 font-bold text-sm mt-6 bg-[rgb(var(--accent-500)/8%)] border border-[rgb(var(--accent-500)/20%)] text-[rgb(var(--accent-text))]">
        🤝 No credits to buy
      </div>

      <ul className="mt-8 space-y-4 flex-1">
        {FEATURES.map((f) => (
          <li key={f.title} className="flex items-start gap-2.5 text-sm">
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
        className="mt-8 block text-center py-3.5 rounded-xl font-bold text-sm transition-all border-2 border-[rgb(var(--accent-500)/35%)] text-[rgb(var(--accent-text))] hover:border-[rgb(var(--accent-500))] hover:bg-[rgb(var(--accent-500)/10%)]"
      >
        Order My Edits →
      </Link>
      {!compact && (
        <p className="mt-4 text-center">
          <Link href="/credits" className="text-xs font-bold text-[rgb(var(--fg-rgb)/50%)] hover:text-[rgb(var(--accent-text))] hover:underline transition-all">
            or compare with prepaid credit packs
          </Link>
        </p>
      )}
    </motion.div>
  );
}