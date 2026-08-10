"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PAYONEER_ACTIVE, PAYONEER_PAYMENT_URL, PAYONEER_EMAIL, CURRENCIES, STRIPE_ACTIVE, STRIPE_PAYMENT_LINK } from "@/lib/payment";

const CARD_BRANDS = ["VISA", "Mastercard", "AMEX", "Discover", "PayPal", "UnionPay"];

const TRUST_POINTS = [
  "256-bit SSL encrypted checkout",
  "We never store your card details",
  "Instant payment confirmation",
  "Money-back guarantee on quality",
];

const STEPS = [
  { icon: "🧾", title: "1. Review your order", desc: "Check your service, quantity and total before paying." },
  { icon: "🔒", title: "2. Pay securely", desc: "You'll be redirected to Payoneer's secure global checkout." },
  { icon: "🚀", title: "3. We start editing", desc: "As soon as payment is confirmed, our team begins your order." },
];

export default function PaymentPage() {
  const [loaded, setLoaded] = useState(false);
  const [plan, setPlan] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState("");
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState(0);
  const [hasAmount, setHasAmount] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentTiming, setPaymentTiming] = useState("");
  const [orderRef, setOrderRef] = useState("");

  useEffect(() => {
    function onDocClick(e: MouseEvent | TouchEvent) {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("touchstart", onDocClick);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
    };
  }, []);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setPlan(p.get("plan") || "");
    setDesc(p.get("desc") || "");
    setImages(p.get("images") || "");
    setName(p.get("name") || "");
    setEmail(p.get("email") || "");
    setPaymentTiming(p.get("payment_timing") || "");
    setOrderRef(p.get("ref") || "");
    const amt = parseFloat(p.get("amount") || "");
    if (!Number.isNaN(amt) && amt > 0) {
      setAmount(amt);
      setHasAmount(true);
    }
    const cur = CURRENCIES.findIndex((c) => c.code === (p.get("currency") || "").toUpperCase());
    if (cur >= 0) setCurrency(cur);
    setLoaded(true);
  }, []);

  const curr = CURRENCIES[currency];
  const converted = hasAmount ? amount * curr.rate : 0;

  const formatMoney = (n: number) => {
    const symbol = curr.symbol === "AED " || curr.symbol === "SAR " ? "" : curr.symbol;
    return `${symbol}${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const payNowHref = PAYONEER_ACTIVE && PAYONEER_PAYMENT_URL
    ? PAYONEER_PAYMENT_URL
    : null;

  const stripeHref = STRIPE_ACTIVE && STRIPE_PAYMENT_LINK
    ? STRIPE_PAYMENT_LINK
    : null;

  // Custom-quote ("Pay Now") orders must be submitted to us only when the
  // customer actually starts payment — no dodging the checkout.
  const [submitting, setSubmitting] = useState(false);

  const submitOrderThen = async (href: string) => {
    setSubmitting(true);
    try {
      if (paymentTiming === "now" && (name || email)) {
        const fd = new FormData();
        fd.set("_subject", "Pay Now Order — Payment Initiated (PathPixHub)");
        if (name) fd.set("name", name);
        if (email) fd.set("email", email);
        fd.set("plan", plan || "Custom Quote");
        if (desc) fd.set("quote_details", desc);
        if (images) fd.set("image_links", images);
        if (hasAmount) fd.set("amount", amount.toFixed(2));
        fd.set("payment_timing", "now");
        if (orderRef) fd.set("order_ref", orderRef);
        if (plan) fd.set("order_title", plan);
        await fetch("/api/send", { method: "POST", body: fd, headers: { Accept: "application/json" } });
      }
    } catch { /* payment should proceed regardless */ }
    setSubmitting(false);
    window.open(href, "_blank", "noopener noreferrer");
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="pt-36 pb-16 mesh-gradient">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="w-9 h-9 rounded-full bg-[rgb(var(--accent-500)/12%)] flex items-center justify-center border border-[rgb(var(--accent-500)/20%)]">
              <svg className="w-5 h-5 text-[rgb(var(--accent-text))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </span>
            <span className="text-sm font-bold text-[rgb(var(--accent-text))] uppercase tracking-wider">Secure Checkout</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-text text-center leading-[1.1]">
            Complete your payment
          </h1>
          <p className="mt-4 text-lg text-[rgb(var(--fg-rgb)/60%)] text-center max-w-2xl mx-auto leading-relaxed">
            Pay in your local currency — we receive your payment in USD. Global payments powered by Payoneer.
          </p>
        </div>
      </section>

      {!loaded && (
        <section className="pb-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="h-80 rounded-3xl border-2 border-[rgb(var(--fg-rgb)/8%)] animate-pulse bg-[rgb(var(--fg-rgb)/3%)]" />
          </div>
        </section>
      )}

      {loaded && (
        <section className="pb-24">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 items-start">

            {/* Order Summary */}
            <div className="rounded-3xl border-2 border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg)] p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xl">🧾</span>
                <h2 className="text-xl font-bold text-[rgb(var(--fg-rgb))]">Order Summary</h2>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-[rgb(var(--fg-rgb)/50%)]">Service</span>
                  <span className="font-bold text-[rgb(var(--fg-rgb)/80%)] text-right">{plan || (desc ? "Custom Editing Quote" : "Photo Editing Service")}</span>
                </div>
                {desc && (
                  <div className="flex justify-between gap-4">
                    <span className="text-[rgb(var(--fg-rgb)/50%)]">Details</span>
                    <span className="font-bold text-[rgb(var(--fg-rgb)/80%)] text-right max-w-[60%]">{desc}</span>
                  </div>
                )}
                {images && (
                  <div className="flex justify-between gap-4">
                    <span className="text-[rgb(var(--fg-rgb)/50%)]">Images</span>
                    <span className="font-bold text-[rgb(var(--fg-rgb)/80%)]">{images}</span>
                  </div>
                )}
                <div className="h-px bg-[rgb(var(--fg-rgb)/8%)]" />
                <div className="flex justify-between gap-4">
                  <span className="text-[rgb(var(--fg-rgb)/50%)]">Amount ({curr.code})</span>
                  <span className="font-extrabold text-[rgb(var(--fg-rgb))]">
                    {hasAmount ? formatMoney(converted) : "—"}
                  </span>
                </div>
                {hasAmount && (
                  <div className="flex justify-between gap-4">
                    <span className="text-[rgb(var(--fg-rgb)/50%)]">You pay ≈</span>
                    <span className="font-bold text-[rgb(var(--accent-text))]">{formatMoney(converted)} {curr.code}</span>
                  </div>
                )}
                {hasAmount && (
                  <p className="text-xs text-[rgb(var(--fg-rgb)/40%)]">
                    * Exchange rate shown is approximate. Final amount is set by Payoneer at checkout using live rates — you pay in {curr.code}, we receive the USD equivalent.
                  </p>
                )}
              </div>

              {/* Currency selector */}
              <div className="mt-8">
                <p className="text-xs uppercase tracking-wider text-[rgb(var(--fg-rgb)/40%)] font-bold mb-3">
                  Choose your payment currency
                </p>
                <div className="relative" ref={currencyRef}>
                  <button type="button" onClick={() => setCurrencyOpen(!currencyOpen)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border-2 border-[rgb(var(--fg-rgb)/12%)] bg-[var(--bg-alt)] text-sm font-bold text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/50%)] transition-all">
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[rgb(var(--accent-text))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0 2c2.21 0 4 1.79 4 4v5c0 .55-.45 1-1 1s-1-.45-1-1v-5c0-1.1-.9-2-2-2s-2 .9-2 2v5c0 .55-.45 1-1 1s-1-.45-1-1v-5c0-2.21 1.79-4 4-4z" /></svg>
                      {curr.label}
                    </span>
                    <svg className={`w-4 h-4 text-[rgb(var(--fg-rgb)/40%)] transition-transform ${currencyOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {currencyOpen && (
                    <div className="absolute z-20 mt-2 w-full rounded-xl border-2 border-[rgb(var(--fg-rgb)/12%)] bg-[var(--bg)] shadow-2xl overflow-hidden">
                      {CURRENCIES.map((c, i) => (
                        <button key={c.code} type="button" onClick={() => { setCurrency(i); setCurrencyOpen(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-colors ${currency === i ? "text-[rgb(var(--accent-text))] bg-[rgb(var(--accent-500)/8%)]" : "text-[rgb(var(--fg-rgb)/60%)] hover:bg-[rgb(var(--fg-rgb)/4%)]"}`}>
                          {c.label}
                          {currency === i && (
                            <svg className="w-4 h-4 text-[rgb(var(--accent-text))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-3xl border-2 border-[rgb(var(--accent-500)/25%)] bg-[var(--bg)] p-8 shadow-xl shadow-[rgb(var(--accent-500)/8%)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[rgb(var(--fg-rgb))]">Payment Method</h2>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))] border border-[rgb(var(--accent-500)/25%)]">Recommended</span>
              </div>

              {/* Payoneer card */}
              <div className="rounded-2xl border-2 border-[rgb(var(--accent-500)/30%)] bg-[rgb(var(--accent-500)/4%)] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff7200] to-[#ff9d00] flex items-center justify-center text-white text-sm font-extrabold">P</span>
                    <span className="text-lg font-extrabold text-[rgb(var(--fg-rgb))] tracking-tight">Payoneer</span>
                  </div>
                  <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded-full bg-[rgb(var(--fg-rgb)/6%)] text-[rgb(var(--fg-rgb)/50%)] border border-[rgb(var(--fg-rgb)/10%)]">Secure Checkout</span>
                </div>
                <p className="mt-3 text-xs text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">
                  Pay by credit/debit card, PayPal, or bank transfer — whatever is easiest for you. Your payment is protected by Payoneer&apos;s trusted global payment network.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {CARD_BRANDS.map((b) => (
                    <span key={b} className="text-[10px] font-bold px-2.5 py-1.5 rounded-md bg-[var(--bg-alt)] text-[rgb(var(--fg-rgb)/55%)] border border-[rgb(var(--fg-rgb)/10%)]">{b}</span>
                  ))}
                </div>
              </div>

              {/* Stripe card */}
              {stripeHref && (
                <div className="mt-4 rounded-2xl border-2 border-[rgb(var(--fg-rgb)/12%)] bg-[rgb(var(--fg-rgb)/3%)] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#635bff] to-[#7a73ff] flex items-center justify-center text-white text-sm font-extrabold">S</span>
                      <span className="text-lg font-extrabold text-[rgb(var(--fg-rgb))] tracking-tight">Pay by Card</span>
                    </div>
                    <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded-full bg-[rgb(var(--fg-rgb)/6%)] text-[rgb(var(--fg-rgb)/50%)] border border-[rgb(var(--fg-rgb)/10%)]">Powered by Stripe</span>
                  </div>
                  <p className="mt-3 text-xs text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">
                    Prefer to pay right here? Enter your card details securely on Stripe&apos;s checkout — no account needed.
                  </p>
                  <a href={stripeHref} target="_blank" rel="noopener noreferrer" onClick={(e) => { if (paymentTiming === "now") { e.preventDefault(); submitOrderThen(stripeHref); } }}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#635bff]/50 text-[#8a85ff] font-bold hover:bg-[#635bff]/10 hover:border-[#635bff] transition-all text-sm">
                    Pay by Card
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" /></svg>
                  </a>
                </div>
              )}

              {/* Pay Now */}
              <div className="mt-6">
                {payNowHref ? (
                  <a href={payNowHref} target="_blank" rel="noopener noreferrer" onClick={(e) => { if (paymentTiming === "now") { e.preventDefault(); submitOrderThen(payNowHref); } }}
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm shadow-lg shadow-[rgb(var(--accent-500)/25%)]">
                    {submitting ? "Saving your order..." : `Pay Now — ${hasAmount ? `${formatMoney(converted)} ${curr.code}` : "Secure Payment"}`}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </a>
                ) : (
                  <a href={`mailto:${PAYONEER_EMAIL}?subject=${encodeURIComponent(plan ? `Payment for ${plan} plan` : "Payment for my order")}&body=${encodeURIComponent(hasAmount ? `I'd like to complete payment for my order (${formatMoney(converted)} ${curr.code}). Please send me the secure payment link.` : "I'd like to complete payment for my order. Please send me the secure payment link.")}`}
                    onClick={() => { if (paymentTiming === "now") submitOrderThen(`mailto:${PAYONEER_EMAIL}?subject=${encodeURIComponent(plan ? `Payment for ${plan} plan` : "Payment for my order")}&body=${encodeURIComponent(hasAmount ? `I'd like to complete payment for my order (${formatMoney(converted)} ${curr.code}). Please send me the secure payment link.` : "I'd like to complete payment for my order. Please send me the secure payment link.")}`); }}
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm shadow-lg shadow-[rgb(var(--accent-500)/25%)]">
                    Request Secure Payment Link
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </a>
                )}
                <p className="mt-3 text-center text-xs text-[rgb(var(--fg-rgb)/40%)]">
                  {payNowHref
                    ? "You'll be redirected to Payoneer's secure checkout. Never share your card details by email."
                    : `Your secure payment link will be sent to your email. Or email us at ${PAYONEER_EMAIL}.`}
                </p>
              </div>

              {/* Trust points */}
              <ul className="mt-6 space-y-2">
                {TRUST_POINTS.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-xs text-[rgb(var(--fg-rgb)/55%)]">
                    <svg className="w-4 h-4 mt-0.5 text-[rgb(var(--accent-text))] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* What happens next */}
          <div className="max-w-6xl mx-auto px-6 mt-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">What happens next?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((s, i) => (
                <motion.div key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border-2 border-[rgb(var(--fg-rgb)/8%)] bg-[var(--bg-alt)] p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                  <span className="text-3xl">{s.icon}</span>
                  <h3 className="font-bold text-[rgb(var(--fg-rgb))] mt-3 mb-1">{s.title}</h3>
                  <p className="text-sm text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass-card text-[rgb(var(--fg-rgb))] font-bold border border-[rgb(var(--fg-rgb)/10%)] hover:border-[rgb(var(--accent-500)/50%)] transition-all text-sm">
                Need help? Contact our team
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
