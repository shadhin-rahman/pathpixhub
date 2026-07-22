"use client";
import { motion } from "framer-motion";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-[var(--bg-alt)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Testimonials</h2>
          <h3 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">What Our Clients Say</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="glass-card rounded-2xl p-6 border-[rgb(var(--fg-rgb)/5%)]"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }, (_, j) => (
                  <svg key={j} className="w-4 h-4 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-4 pt-4 border-t border-[rgb(var(--fg-rgb)/8%)]">
                <p className="font-bold text-sm text-[rgb(var(--fg-rgb))]">{t.name}</p>
                <p className="text-xs text-[rgb(var(--fg-rgb)/40%)]">{t.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
