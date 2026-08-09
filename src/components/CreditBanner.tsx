"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CreditBanner() {
  return (
    <section className="py-20 bg-[var(--bg-alt)]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border-2 border-[rgb(var(--accent-500)/25%)] bg-gradient-to-br from-[rgb(var(--accent-500)/8%)] via-[var(--bg)] to-[rgb(var(--accent-500)/5%)] p-8 md:p-10"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">💳</span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] border border-[rgb(var(--accent-500)/25%)]">Credit Plans</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[rgb(var(--fg-rgb))]">
                Save with our credit plans
              </h3>
              <p className="mt-2 text-sm md:text-base text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
                Buy credits once, use them gradually. Priority delivery, bonus credits & dedicated support for regular work.
              </p>
            </div>
            <Link href="/subscription"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm shadow-lg shadow-[rgb(var(--accent-500)/25%)] shrink-0">
              Explore Credit Plans
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
