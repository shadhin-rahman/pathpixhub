// Payoneer payment configuration.
//
// When your Payoneer account is activated:
//   1. Set NEXT_PUBLIC_PAYONEER_PAYMENT_URL to your Payoneer
//      Payment Request / Checkout URL (or your store's hosted checkout link).
//   2. Set NEXT_PUBLIC_PAYONEER_ACTIVE=true.
// The payment page automatically switches from "email us for your link"
// to a live "Pay Now" flow.

export const PAYONEER_ACTIVE =
  (process.env.NEXT_PUBLIC_PAYONEER_ACTIVE ?? "").toLowerCase() === "true";

export const PAYONEER_PAYMENT_URL =
  process.env.NEXT_PUBLIC_PAYONEER_PAYMENT_URL || "";

// Fixed-price "PayMe" link — used by the Pro plan "Pay Now" button.
// Your personalized Payoneer URL where clients enter the amount themselves.
export const PAYONEER_PAYME_URL =
  process.env.NEXT_PUBLIC_PAYONEER_PAYME_URL || "";

// Optional WhatsApp for Enterprise "Contact Sales". Falls back to /contact.
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP || "";

export const WHATSAPP_LINK = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`
  : "";

export const PAYONEER_EMAIL =
  process.env.NEXT_PUBLIC_PAYONEER_EMAIL || "pathpixhub@gmail.com";

// Stripe Payment Link — for customers who prefer to pay by card directly.
// When you create a free Stripe Payment Link, set NEXT_PUBLIC_STRIPE_PAYMENT_LINK
// and NEXT_PUBLIC_STRIPE_ACTIVE=true. The payment page then shows a
// "Pay by Card" option alongside Payoneer.
export const STRIPE_ACTIVE =
  (process.env.NEXT_PUBLIC_STRIPE_ACTIVE ?? "").toLowerCase() === "true";

export const STRIPE_PAYMENT_LINK =
  process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || "";

export const CURRENCIES: { code: string; symbol: string; rate: number; label: string }[] = [
  { code: "USD", symbol: "$", rate: 1, label: "$ USD" },
  { code: "EUR", symbol: "€", rate: 0.92, label: "€ EUR" },
  { code: "GBP", symbol: "£", rate: 0.79, label: "£ GBP" },
  { code: "CAD", symbol: "C$", rate: 1.36, label: "C$ CAD" },
  { code: "AUD", symbol: "A$", rate: 1.52, label: "A$ AUD" },
  { code: "AED", symbol: "AED ", rate: 3.67, label: "AED (UAE)" },
  { code: "SAR", symbol: "SAR ", rate: 3.75, label: "SAR (KSA)" },
];
