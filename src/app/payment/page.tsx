"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PAYONEER_ACTIVE, PAYONEER_PAYMENT_URL, PAYONEER_EMAIL, CURRENCIES, STRIPE_ACTIVE, STRIPE_PAYMENT_LINK } from "@/lib/payment";

const CARD_BRANDS = ["VISA", "Mastercard", "AMEX", "Discover", "PayPal", "UnionPay"];

const INK = "#0b1624";
const BLUE = "rgb(59 130 246)";

const TRUST_POINTS = [
  "256-bit SSL encrypted checkout",
  "We never store your card details",
  "Instant payment confirmation",
  "Money-back guarantee on quality",
];

const STEPS = [
  { icon: "🧾", title: "Review your order", desc: "Check your service, quantity and total before paying." },
  { icon: "🔒", title: "Pay securely", desc: "You'll be redirected to Payoneer's secure global checkout." },
  { icon: "🚀", title: "We start editing", desc: "As soon as payment is confirmed, our team begins your order." },
];

const NAVY_MUTED = "#9db0c4";
const NAVY_MUTED_2 = "#c6d3e0";
const INK_MUTED = "rgba(11, 22, 36, 0.55)";
const INK_FAINT = "rgba(11, 22, 36, 0.4)";

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
    const t = setTimeout(() => {
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
    }, 0);
    return () => clearTimeout(t);
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
    <div className="min-h-screen">
      {!loaded && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="h-80 rounded-3xl border-2 border-[rgb(var(--fg-rgb)/8%)] animate-pulse bg-[rgb(var(--fg-rgb)/3%)]" />
          </div>
        </section>
      )}

      {loaded && (
        <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[85vh]">
          {/* LEFT: brand navy */}
          <div
            className="relative flex items-center justify-center px-6 py-16 sm:px-12 lg:px-14 lg:py-20 overflow-hidden"
            style={{
              background:
                "radial-gradient(750px 420px at 92% -12%, rgb(59 130 246 / 0.14), transparent 60%), radial-gradient(650px 420px at -8% 112%, rgb(96 165 250 / 0.12), transparent 60%), #081526",
            }}
          >
            <div className="relative w-full max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-7" style={{ background: "rgb(59 130 246 / 0.12)", borderColor: "rgb(59 130 246 / 0.3)" }}>
                <svg className="w-4 h-4" fill="none" stroke={BLUE} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: BLUE }}>Secure Checkout</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.08] text-white">
                Complete your payment
              </h1>
              <p className="mt-5 text-lg leading-relaxed" style={{ color: NAVY_MUTED }}>
                Pay in your local currency — we receive your payment in USD. Global payments powered by Payoneer &amp; Stripe.
              </p>

              <div className="mt-10 space-y-5">
                {STEPS.map((s, i) => (
                  <motion.div key={s.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-4">
                    <span className="w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center text-lg" style={{ background: "rgb(59 130 246 / 0.12)", borderColor: "rgb(59 130 246 / 0.25)" }}>
                      {s.icon}
                    </span>
                    <div>
                      <h3 className="font-bold text-white">{s.title}</h3>
                      <p className="text-sm leading-relaxed mt-0.5" style={{ color: NAVY_MUTED }}>{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <ul className="mt-10 space-y-2.5">
                {TRUST_POINTS.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm" style={{ color: NAVY_MUTED_2 }}>
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke={BLUE} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    {t}
                  </li>
                ))}
              </ul>

              <Link href="/contact"
                className="mt-10 inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.16)", color: "#ffffff" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgb(59 130 246 / 0.6)"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}>
                Need help? Contact our team
              </Link>
            </div>
          </div>

          {/* RIGHT: white checkout */}
          <div className="flex items-center justify-center bg-white px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
            <div className="w-full max-w-xl space-y-6">
              {/* Order Summary */}
              <div className="rounded-3xl border-2 p-8 sm:p-9 bg-white shadow-2xl" style={{ borderColor: "rgba(11, 22, 36, 0.1)", boxShadow: "0 30px 60px -25px rgba(8, 21, 38, 0.25)" }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "rgb(59 130 246 / 0.16)", border: "1px solid rgb(59 130 246 / 0.45)" }}>🧾</span>
                  <h2 className="text-xl font-bold" style={{ color: INK }}>Order Summary</h2>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <span style={{ color: INK_MUTED }}>Service</span>
                    <span className="font-bold text-right" style={{ color: INK }}>{plan || (desc ? "Custom Editing Quote" : "Photo Editing Service")}</span>
                  </div>
                  {desc && (
                    <div className="flex justify-between gap-4">
                      <span style={{ color: INK_MUTED }}>Details</span>
                      <span className="font-bold text-right max-w-[60%]" style={{ color: INK }}>{desc}</span>
                    </div>
                  )}
                  {images && (
                    <div className="flex justify-between gap-4">
                      <span style={{ color: INK_MUTED }}>Images</span>
                      <span className="font-bold" style={{ color: INK }}>{images}</span>
                    </div>
                  )}
                  <div className="h-px" style={{ background: "rgba(11, 22, 36, 0.08)" }} />
                  <div className="flex justify-between gap-4">
                    <span style={{ color: INK_MUTED }}>Amount ({curr.code})</span>
                    <span className="font-extrabold" style={{ color: INK }}>
                      {hasAmount ? formatMoney(converted) : "—"}
                    </span>
                  </div>
                  {hasAmount && (
                    <div className="flex justify-between gap-4">
                      <span style={{ color: INK_MUTED }}>You pay ≈</span>
                      <span className="font-bold" style={{ color: BLUE }}>{formatMoney(converted)} {curr.code}</span>
                    </div>
                  )}
                  {hasAmount && (
                    <p className="text-xs" style={{ color: INK_FAINT }}>
                      * Exchange rate shown is approximate. Final amount is set by Payoneer at checkout using live rates — you pay in {curr.code}, we receive the USD equivalent.
                    </p>
                  )}
                </div>

                {/* Currency selector */}
                <div className="mt-8">
                  <p className="text-xs uppercase tracking-wider font-bold mb-3" style={{ color: INK_FAINT }}>
                    Choose your payment currency
                  </p>
                  <div className="relative" ref={currencyRef}>
                    <button type="button" onClick={() => setCurrencyOpen(!currencyOpen)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border-2 text-sm font-bold transition-all"
                      style={{ borderColor: currencyOpen ? "rgb(59 130 246 / 0.6)" : "rgba(11, 22, 36, 0.14)", background: "#ffffff", color: INK }}>
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke={BLUE} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0 2c2.21 0 4 1.79 4 4v5c0 .55-.45 1-1 1s-1-.45-1-1v-5c0-1.1-.9-2-2-2s-2 .9-2 2v5c0 .55-.45 1-1 1s-1-.45-1-1v-5c0-2.21 1.79-4 4-4z" /></svg>
                        {curr.label}
                      </span>
                      <svg className={`w-4 h-4 transition-transform ${currencyOpen ? "rotate-180" : ""}`} fill="none" stroke={INK_FAINT} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {currencyOpen && (
                      <div className="absolute z-20 mt-2 w-full rounded-xl border-2 bg-white shadow-2xl overflow-hidden" style={{ borderColor: "rgba(11, 22, 36, 0.12)" }}>
                        {CURRENCIES.map((c, i) => (
                          <button key={c.code} type="button" onClick={() => { setCurrency(i); setCurrencyOpen(false); }}
                            className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-colors"
                            style={{ color: currency === i ? "#1d4ed8" : INK_MUTED, background: currency === i ? "rgb(59 130 246 / 0.12)" : "#ffffff" }}>
                            {c.label}
                            {currency === i && (
                              <svg className="w-4 h-4" fill="none" stroke="#1d4ed8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-3xl border-2 p-8 sm:p-9 bg-white" style={{ borderColor: "rgb(59 130 246 / 0.45)", background: "linear-gradient(160deg, rgb(59 130 246 / 0.14) 0%, rgb(59 130 246 / 0.04) 55%, #ffffff 100%)" }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold" style={{ color: INK }}>Payment Method</h2>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border" style={{ background: "rgb(59 130 246 / 0.18)", color: "#1d4ed8", borderColor: "rgb(59 130 246 / 0.45)" }}>Recommended</span>
                </div>

                {/* Payoneer card */}
                <div className="rounded-2xl border-2 p-5 bg-white" style={{ borderColor: "rgba(11, 22, 36, 0.1)" }}>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff7200] to-[#ff9d00] flex items-center justify-center text-white text-sm font-extrabold">P</span>
                      <span className="text-lg font-extrabold tracking-tight" style={{ color: INK }}>Payoneer</span>
                    </div>
                    <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded-full border" style={{ background: "rgba(11, 22, 36, 0.05)", color: INK_MUTED, borderColor: "rgba(11, 22, 36, 0.1)" }}>Secure Checkout</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed" style={{ color: INK_MUTED }}>
                    Pay by credit/debit card, PayPal, or bank transfer — whatever is easiest for you. Your payment is protected by Payoneer&apos;s trusted global payment network.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {CARD_BRANDS.map((b) => (
                      <span key={b} className="text-[10px] font-bold px-2.5 py-1.5 rounded-md border" style={{ background: "rgba(11, 22, 36, 0.04)", color: INK_MUTED, borderColor: "rgba(11, 22, 36, 0.1)" }}>{b}</span>
                    ))}
                  </div>
                </div>

                {/* Stripe card */}
                {stripeHref && (
                  <div className="mt-4 rounded-2xl border-2 p-5 bg-white" style={{ borderColor: "rgba(11, 22, 36, 0.1)" }}>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#635bff] to-[#7a73ff] flex items-center justify-center text-white text-sm font-extrabold">S</span>
                        <span className="text-lg font-extrabold tracking-tight" style={{ color: INK }}>Pay by Card</span>
                      </div>
                      <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded-full border" style={{ background: "rgba(11, 22, 36, 0.05)", color: INK_MUTED, borderColor: "rgba(11, 22, 36, 0.1)" }}>Powered by Stripe</span>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed" style={{ color: INK_MUTED }}>
                      Prefer to pay right here? Enter your card details securely on Stripe&apos;s checkout — no account needed.
                    </p>
                    <a href={stripeHref} target="_blank" rel="noopener noreferrer" onClick={(e) => { if (paymentTiming === "now") { e.preventDefault(); submitOrderThen(stripeHref); } }}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border-2 text-[#8a85ff] font-bold transition-all text-sm"
                      style={{ borderColor: "rgba(99, 91, 255, 0.5)", background: "transparent" }}>
                      Pay by Card
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" /></svg>
                    </a>
                  </div>
                )}

                {/* Pay Now */}
                <div className="mt-6">
                  {payNowHref ? (
                    <a href={payNowHref} target="_blank" rel="noopener noreferrer" onClick={(e) => { if (paymentTiming === "now") { e.preventDefault(); submitOrderThen(payNowHref); } }}
                      className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold transition-all text-sm shadow-lg"
                      style={{ boxShadow: "0 20px 45px -20px rgb(59 130 246 / 0.65)" }}>
                      {submitting ? "Saving your order..." : `Pay Now — ${hasAmount ? `${formatMoney(converted)} ${curr.code}` : "Secure Payment"}`}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </a>
                  ) : (
                    <a href={`mailto:${PAYONEER_EMAIL}?subject=${encodeURIComponent(plan ? `Payment for ${plan} plan` : "Payment for my order")}&body=${encodeURIComponent(hasAmount ? `I'd like to complete payment for my order (${formatMoney(converted)} ${curr.code}). Please send me the secure payment link.` : "I'd like to complete payment for my order. Please send me the secure payment link.")}`}
                      onClick={() => { if (paymentTiming === "now") submitOrderThen(`mailto:${PAYONEER_EMAIL}?subject=${encodeURIComponent(plan ? `Payment for ${plan} plan` : "Payment for my order")}&body=${encodeURIComponent(hasAmount ? `I'd like to complete payment for my order (${formatMoney(converted)} ${curr.code}). Please send me the secure payment link.` : "I'd like to complete payment for my order. Please send me the secure payment link.")}`); }}
                      className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold transition-all text-sm shadow-lg"
                      style={{ boxShadow: "0 20px 45px -20px rgb(59 130 246 / 0.65)" }}>
                      Request Secure Payment Link
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </a>
                  )}
                  <p className="mt-3 text-center text-xs" style={{ color: INK_FAINT }}>
                    {payNowHref
                      ? "You'll be redirected to Payoneer's secure checkout. Never share your card details by email."
                      : `Your secure payment link will be sent to your email. Or email us at ${PAYONEER_EMAIL}.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
