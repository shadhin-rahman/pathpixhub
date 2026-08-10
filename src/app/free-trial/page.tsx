"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { services } from "@/data/services";
import ScrollReveal from "@/components/ScrollReveal";
import AIPreviewTool from "@/components/AIPreviewTool";
import CreditBanner from "@/components/CreditBanner";
import { fetchCountryCode, isCountryBlocked, setBypassCode, isAdmin } from "@/lib/countryBlocker";

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia",
  "Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium",
  "Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria",
  "Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Chile","China","Colombia","Costa Rica",
  "Croatia","Cuba","Cyprus","Czech Republic","Denmark","Dominican Republic","Ecuador","Egypt",
  "El Salvador","Estonia","Ethiopia","Fiji","Finland","France","Georgia","Germany","Ghana","Greece",
  "Guatemala","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy",
  "Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kuwait","Latvia","Lebanon","Lithuania","Luxembourg",
  "Madagascar","Malaysia","Maldives","Mali","Malta","Mauritius","Mexico","Mongolia","Morocco","Mozambique",
  "Myanmar","Namibia","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Macedonia",
  "Norway","Oman","Pakistan","Palestine","Panama","Paraguay","Peru","Philippines","Poland","Portugal","Qatar",
  "Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia","Singapore","Slovakia","Slovenia",
  "Somalia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Sweden","Switzerland","Syria",
  "Taiwan","Tanzania","Thailand","Tunisia","Turkey","Uganda","Ukraine","United Arab Emirates",
  "United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe",
];

const SERVICE_COLORS = [
  "#fca5a5", "#d8b4fe", "#f9a8d4", "#fde68a", "#93c5fd",
  "#86efac", "#fdba74", "#5eead4", "#a5b4fc", "#fda4af",
];

const STORAGE_KEY = "pathpixhub_free_trial_used";
const STORAGE_EXPIRY_KEY = "pathpixhub_free_trial_expiry";

const FOUNDER_EMAILS = ["pathpixhub@gmail.com"];

function isFounderEmail(email: string): boolean {
  return FOUNDER_EMAILS.includes(email.toLowerCase().trim());
}

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
};

function markFreeTrialUsed(email: string) {
  if (isFounderEmail(email)) return;
  localStorage.setItem(STORAGE_KEY, email.toLowerCase().trim());
  localStorage.setItem(STORAGE_EXPIRY_KEY, (Date.now() + 30 * 24 * 60 * 60 * 1000).toString());
}

function isEmailUsed(email: string): boolean {
  const used = localStorage.getItem(STORAGE_KEY);
  if (!used) return false;
  if (isFounderEmail(email)) return false;
  const expiry = localStorage.getItem(STORAGE_EXPIRY_KEY);
  if (expiry && Date.now() > parseInt(expiry, 10)) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_EXPIRY_KEY);
    return false;
  }
  return used.toLowerCase().trim() === email.toLowerCase().trim();
}

export default function FreeTrialPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [usageType, setUsageType] = useState<"commercial" | "personal" | "">("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [countryLoaded, setCountryLoaded] = useState(false);
  const [bypassInput, setBypassInput] = useState("");
  const [bypassError, setBypassError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const [reusedNotice, setReusedNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bypass = params.get("access");
    if (bypass) {
      setBypassCode(bypass);
      window.history.replaceState({}, "", window.location.pathname);
    }
    fetchCountryCode().then((code) => {
      setCountryCode(code);
      setCountryLoaded(true);
    });
  }, []);

  const blocked = countryLoaded && countryCode !== null && isCountryBlocked(countryCode) && !isAdmin();

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const imageFiles = Array.from(newFiles).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...imageFiles].slice(0, 2));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const goNext = () => {
    if (!usageType) return;
    setDirection(1);
    setStep(2);
  };

  const goBack = () => {
    setDirection(-1);
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    const data = new FormData(form);
    if (emailInput && isEmailUsed(emailInput)) {
      setReusedNotice(true);
      setSubmitStatus("idle");
      return;
    }
    setReusedNotice(false);
    setSubmitStatus("sending");
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        if (emailInput) markFreeTrialUsed(emailInput);
        setSubmitted(true);
      } else {
        let msg = "Could not send your request.";
        try {
          const j = await res.json();
          if (j?.error) msg = j.error as string;
        } catch { /* ignore */ }
        setSubmitError(msg);
        setSubmitStatus("error");
      }
    } catch {
      setSubmitError("Network error while sending.");
      setSubmitStatus("error");
    }
  };

  const handleBypassSubmit = () => {
    if (!bypassInput.trim()) return;
    setBypassCode(bypassInput.trim());
    if (isAdmin()) {
      setBypassError(false);
      setCountryCode(null);
      setCountryLoaded(false);
      fetchCountryCode().then((code) => { setCountryCode(code); setCountryLoaded(true); });
    } else {
      setBypassError(true);
    }
  };

  if (blocked) {
    return (
      <section className="pt-40 pb-32 bg-[var(--bg)]">
        <div className="max-w-lg mx-auto px-6">
          <div className="glass-card rounded-3xl p-10 border-[rgb(var(--fg-rgb)/10%)] text-center">
            <div className="w-16 h-16 rounded-full bg-[rgb(239_68_68_/_10%)] flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[rgb(239_68_68)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" /></svg>
            </div>
            <h1 className="text-3xl font-bold text-[rgb(var(--fg-rgb))] mb-3">Access Restricted</h1>
            <p className="text-sm text-[rgb(var(--fg-rgb)/55%)] leading-relaxed mb-6">
              We&apos;re sorry, but the free trial is currently unavailable in your region. If you believe this is a mistake or have been granted access, please enter your access code below.
            </p>
            <div className="flex gap-2 max-w-xs mx-auto">
              <input type="text" value={bypassInput} onChange={e => { setBypassInput(e.target.value); setBypassError(false); }}
                placeholder="Access code"
                className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm text-[rgb(var(--fg-rgb))] outline-none focus:border-[rgb(var(--accent-500)/50%)]" />
              <button type="button" onClick={handleBypassSubmit}
                className="px-5 py-3 rounded-xl bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-sm hover:bg-[rgb(var(--accent-400))] transition-all">Submit</button>
            </div>
            {bypassError && <p className="text-[11px] text-red-400 mt-2">Invalid access code.</p>}
            <p className="text-[11px] text-[rgb(var(--fg-rgb)/30%)] mt-4">Contact the site administrator if you need access.</p>
          </div>
        </div>
      </section>
    );
  }

  // Submitted screen
  if (submitted) {
    return (
      <section className="pt-40 pb-32 bg-[var(--bg)]">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="glass-card rounded-3xl p-10 border-[rgb(var(--fg-rgb)/5%)]">
            <div className="w-16 h-16 rounded-full bg-[rgb(137_243_54_/_10%)] flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[rgb(137_243_54)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[rgb(var(--fg-rgb))]">Free Trial Submitted!</h1>
            <p className="mt-4 text-[rgb(var(--fg-rgb)/55%)] leading-relaxed">
              Thank you! We&apos;ll review your images and get back to you within <span className="font-bold text-[rgb(137_243_54)]">6-8 hours</span>.
              Your edited images will be delivered within 24 hours.
            </p>
            <Link href="/"
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-0 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/about/lifestyle-1.jpg" alt="" fill className="object-cover object-center saturate-[1.1] brightness-105" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-[var(--bg)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--accent-500)/20%)] text-[rgb(var(--accent-300))] text-sm font-bold mb-6 backdrop-blur-sm border border-[rgb(var(--accent-500)/20%)]">
              <span className="w-2 h-2 rounded-full bg-[rgb(var(--accent-400))] animate-pulse" />
              Free Trial
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.95]">
              Get 2 Free Edits
            </h1>
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-lg">
              Upload up to 2 images and we&apos;ll edit them for free — no obligation, no credit card required.
              See our quality before you commit.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-[var(--bg-alt)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Upload Images", desc: "Select up to 2 product images for your free trial edit.", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
              { step: "02", title: "We Edit", desc: "Our expert editors manually retouch your images with precision.", icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" },
              { step: "03", title: "Get Results", desc: "Receive your professionally edited images within 24 hours.", icon: "M5 13l4 4L19 7" },
            ].map((item) => (
              <div key={item.step} className="glass-card rounded-2xl p-6 border-[rgb(var(--fg-rgb)/5%)] text-center">
                <div className="w-12 h-12 rounded-full bg-[rgb(var(--accent-500)/12%)] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[rgb(var(--accent-text))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
                </div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-[rgb(var(--accent-text))] font-bold uppercase">Step {item.step}</span>
                <h3 className="mt-2 font-bold text-[rgb(var(--fg-rgb))]">{item.title}</h3>
                <p className="mt-1.5 text-sm text-[rgb(var(--fg-rgb)/50%)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wizard */}
      <section className="py-20 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${step === 1 ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]" : "bg-[rgb(var(--accent-500)/15%)] text-[rgb(var(--accent-text))]"}`}>
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>
              Choose Type
            </div>
            <div className={`w-12 h-0.5 rounded-full transition-all duration-300 ${step === 2 ? "bg-[rgb(var(--accent-500))]" : "bg-[rgb(var(--fg-rgb)/10%)]"}`} />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${step === 2 ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]" : "bg-[rgb(var(--fg-rgb)/5%)] text-[rgb(var(--fg-rgb)/30%)]"}`}>
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span>
              Details & Upload
            </div>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            {/* STEP 1: Usage Type Selection */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="max-w-2xl mx-auto text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[rgb(var(--fg-rgb))]">
                    Do you need the edits for personal or business use?
                  </h2>
                  <p className="mt-4 text-[rgb(var(--fg-rgb)/50%)] text-lg">
                    Select one to continue — both are eligible for free trial.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  {/* Commercial */}
                  <button
                    type="button"
                    onClick={() => setUsageType("commercial")}
                    className={`group relative rounded-3xl overflow-hidden border-[3px] text-left transition-all duration-500 ${usageType === "commercial" ? "border-[rgb(var(--accent-500))] shadow-2xl shadow-[rgb(var(--accent-500)/20%)] scale-[1.02]" : "border-[rgb(var(--fg-rgb)/10%)] hover:border-[rgb(var(--accent-500)/40%)] hover:shadow-lg"}`}
                  >
                    <div className="aspect-[4/3] relative overflow-hidden bg-[rgb(var(--fg-rgb)/3%)]">
                      <Image
                        src="/images/usage-commercial.png"
                        alt="Commercial use"
                        fill
                        className={`object-contain p-3 transition-transform duration-700 ${usageType === "commercial" ? "scale-110" : "group-hover:scale-105"}`}
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      {usageType === "commercial" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[rgb(var(--accent-500))] flex items-center justify-center shadow-lg"
                        >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </motion.div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-white font-bold text-xl">Commercial Use</p>
                        <p className="text-white/70 text-sm mt-1">Product, e-commerce, advertising</p>
                      </div>
                    </div>
                  </button>

                  {/* Personal */}
                  <button
                    type="button"
                    onClick={() => setUsageType("personal")}
                    className={`group relative rounded-3xl overflow-hidden border-[3px] text-left transition-all duration-500 ${usageType === "personal" ? "border-[rgb(var(--accent-500))] shadow-2xl shadow-[rgb(var(--accent-500)/20%)] scale-[1.02]" : "border-[rgb(var(--fg-rgb)/10%)] hover:border-[rgb(var(--accent-500)/40%)] hover:shadow-lg"}`}
                  >
                    <div className="aspect-[4/3] relative overflow-hidden bg-[rgb(var(--fg-rgb)/3%)]">
                      <Image
                        src="/images/usage-personal.png"
                        alt="Personal use"
                        fill
                        className={`object-contain p-3 transition-transform duration-700 ${usageType === "personal" ? "scale-110" : "group-hover:scale-105"}`}
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      {usageType === "personal" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[rgb(var(--accent-500))] flex items-center justify-center shadow-lg"
                        >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </motion.div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-white font-bold text-xl">Personal Use</p>
                        <p className="text-white/70 text-sm mt-1">Personal or non-commercial images</p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Next Button */}
                <div className="text-center mt-10">
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!usageType}
                    className={`inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-sm transition-all duration-300 ${usageType ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] shadow-lg shadow-[rgb(var(--accent-500)/20%)]" : "bg-[rgb(var(--fg-rgb)/8%)] text-[rgb(var(--fg-rgb)/25%)] cursor-not-allowed"}`}
                  >
                    Next Step
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Services, Turnaround, Contact, Upload */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                  {/* Left: Images - reduced shadows */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-3xl overflow-hidden aspect-[4/5] relative">
                      <Image src="/images/about/precision-craft.jpg" alt="Photo editing" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
                        <p className="text-white font-bold text-lg">Pixel-Perfect Edits</p>
                        <p className="text-white/70 text-sm mt-1">Every image hand-edited by our expert team.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl overflow-hidden aspect-square relative">
                        <Image src="/images/about/lifestyle-2.jpg" alt="Editing process" fill className="object-cover" sizes="20vw" />
                      </div>
                      <div className="rounded-2xl overflow-hidden aspect-square relative">
                        <Image src="/images/about/client-consultation.jpg" alt="Client work" fill className="object-cover" sizes="20vw" />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center gap-2 text-sm text-[rgb(var(--fg-rgb)/50%)] hover:text-[rgb(var(--accent-text))] transition-colors font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
                      Back to type selection
                    </button>
                  </div>

                  {/* Right: Form */}
                  <div className="lg:col-span-3">
                    <div className="glass-card rounded-3xl p-8 md:p-10 border-[rgb(var(--fg-rgb)/5%)]">
                      <form action="/api/send" method="POST" encType="multipart/form-data" onSubmit={handleSubmit} className="space-y-6">
                        <input type="hidden" name="_subject" value="Free Trial Request" />
                        <input type="hidden" name="selected_services" value={selectedServices.join(", ")} />
                        <input type="hidden" name="image_purpose" value={usageType} />
                        <input type="hidden" name="turnaround" value="24 hours" />

                        {/* Turnaround Notice */}
                        <div className="rounded-2xl border-2 border-[rgb(137_243_54_/_30%)] bg-[rgb(137_243_54_/_6%)] p-5">
                          <div className="flex items-start gap-3">
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-[rgb(137_243_54_/_15%)] flex items-center justify-center mt-0.5">
                              <svg className="w-5 h-5 text-[rgb(137_243_54)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                              <p className="font-bold text-sm text-[rgb(var(--fg-rgb))]">24-Hour Turnaround</p>
                              <p className="text-sm text-[rgb(var(--fg-rgb)/55%)] mt-1">We&apos;ll respond within <span className="font-bold text-[rgb(137_243_54)]">6-8 hours</span> and deliver your edited images within 24 hours.</p>
                            </div>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="ft-name" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Name <span className="text-red-400">*</span></label>
                            <input type="text" name="name" id="ft-name" required
                              className="w-full px-4 py-3.5 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[rgb(var(--fg-rgb)/3%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm"
                              placeholder="Your name" />
                          </div>
                          <div>
                            <label htmlFor="ft-email" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Email <span className="text-red-400">*</span></label>
                            <input type="email" name="email" id="ft-email" required
                              className="w-full px-4 py-3.5 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[rgb(var(--fg-rgb)/3%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm"
                              placeholder="you@example.com" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="ft-country" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Country <span className="text-red-400">*</span></label>
                            <select name="country" id="ft-country" required
                              className="w-full px-4 py-3.5 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[var(--bg-alt)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm appearance-none"
                              defaultValue="">
                              <option value="" disabled>Select your country</option>
                              {COUNTRIES.map((c) => (
                                <option key={c} value={c} className="bg-[var(--bg-alt)]">{c}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="ft-company" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Company <span className="text-[rgb(var(--fg-rgb)/40%)] font-normal">(optional)</span></label>
                            <input type="text" name="company" id="ft-company"
                              className="w-full px-4 py-3.5 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[rgb(var(--fg-rgb)/3%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm"
                              placeholder="Company name" />
                          </div>
                        </div>

                        {/* Multi-Select Services */}
                        <div>
                          <label className="block text-sm font-bold text-[rgb(var(--fg-rgb)/80%)] mb-3">Services Needed <span className="text-red-400">*</span> <span className="text-[rgb(var(--fg-rgb)/40%)] font-normal">(select all that apply)</span></label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {services.map((s, i) => {
                              const isSelected = selectedServices.includes(s.id);
                              const color = SERVICE_COLORS[i % SERVICE_COLORS.length];
                              return (
                                <button key={s.id} type="button" onClick={() => toggleService(s.id)}
                                  className={`flex items-center gap-3 rounded-xl p-3.5 border-2 text-left transition-all duration-300 ${isSelected ? "border-[rgb(var(--accent-500)/60%)] shadow-md" : "border-[rgb(var(--fg-rgb)/6%)] hover:border-[rgb(var(--fg-rgb)/15%)]"}`}
                                  style={{ backgroundColor: isSelected ? `${color}12` : "transparent" }}>
                                  <div className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? "bg-[rgb(var(--accent-500))] border-[rgb(var(--accent-500))]" : "border-[rgb(var(--fg-rgb)/20%)]"}`}>
                                    {isSelected && (
                                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}25` }}>
                                      <Image src={`/images/service-icons/${s.id}.png`} alt="" width={20} height={20} className="object-contain" />
                                    </div>
                                    <span className="text-sm font-semibold text-[rgb(var(--fg-rgb)/80%)] truncate">{s.title}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          <input type="hidden" name="services" value={selectedServices.join(", ")} />
                        </div>

                        {/* Upload */}
                        <div>
                          <label className="block text-sm font-bold text-[rgb(var(--fg-rgb)/80%)] mb-3">Upload Images <span className="text-red-400">*</span> <span className="text-[rgb(var(--fg-rgb)/40%)] font-normal">(max 2)</span></label>
                          <div
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 ${dragOver ? "border-[rgb(var(--accent-500))] bg-[rgb(var(--accent-500)/5%)]" : "border-[rgb(var(--fg-rgb)/15%)] hover:border-[rgb(var(--accent-500)/40%)] hover:bg-[rgb(var(--accent-500)/3%)]"}`}
                          >
                            <input ref={fileInputRef} type="file" name="images" accept="image/*" multiple className="hidden"
                              onChange={(e) => handleFiles(e.target.files)} />
                            <svg className="w-12 h-12 mx-auto text-[rgb(var(--fg-rgb)/20%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="mt-3 text-sm text-[rgb(var(--fg-rgb)/50%)]">
                              {files.length === 0 ? "Drag & drop images here or click to browse" : `${files.length}/2 images selected`}
                            </p>
                            <p className="mt-1 text-xs text-[rgb(var(--fg-rgb)/30%)]">PNG, JPG, WEBP up to 10MB each</p>
                          </div>

                          {files.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 gap-3">
                              {files.map((file, i) => (
                                <div key={i} className="relative group rounded-xl overflow-hidden border border-[rgb(var(--fg-rgb)/10%)] bg-[rgb(var(--fg-rgb)/3%)]">
                                  <div className="aspect-square relative">
                                    <Image src={URL.createObjectURL(file)} alt={`Upload ${i + 1}`} fill className="object-cover" />
                                  </div>
                                  <button type="button" onClick={() => removeFile(i)}
                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                                    ×
                                  </button>
                                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-1.5">
                                    <p className="text-[10px] text-white/80 truncate">{file.name}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <label htmlFor="ft-message" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Additional Notes <span className="text-[rgb(var(--fg-rgb)/40%)] font-normal">(optional)</span></label>
                          <textarea name="message" id="ft-message" rows={3}
                            className="w-full px-4 py-3.5 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[rgb(var(--fg-rgb)/3%)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm resize-none"
                            placeholder="Any special instructions for your edits..." />
                        </div>

                        <button type="submit" disabled={submitStatus === "sending"}
                          className="w-full px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm disabled:opacity-60 disabled:hover:scale-100">
                          {submitStatus === "sending" ? "Sending..." : "Submit Free Trial"}
                        </button>
                        {reusedNotice && (
                          <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3.5 flex items-start gap-3">
                            <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <div>
                              <p className="text-sm font-bold text-amber-400">Already Claimed</p>
                              <p className="text-xs text-[rgb(var(--fg-rgb)/60%)] mt-1 leading-relaxed">
                                You&apos;ve already used your free trial with this email. Each customer is eligible for one free trial only — you can still explore our <a href="/pricing" className="text-amber-400 underline">pricing</a> or <a href="/contact" className="text-amber-400 underline">contact us</a> for your project.
                              </p>
                            </div>
                          </div>
                        )}
                        {submitStatus === "error" && (
                          <p className="text-xs text-red-400 text-center bg-red-400/10 border border-red-400/30 rounded-xl px-4 py-3">
                            {submitError} Please try again or email us at <a href="mailto:pathpixhub@gmail.com" className="underline">pathpixhub@gmail.com</a>.
                          </p>
                        )}
                        <p className="text-xs text-[rgb(var(--fg-rgb)/30%)] text-center">We&apos;ll edit your images and respond within 6-8 hours.</p>
                      </form>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* AI Preview Tool */}
      <ScrollReveal>
      <section className="py-20 bg-[var(--bg-alt)]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-text))] font-bold mb-4">Instant Preview</h2>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">Try AI Preview Tool</h3>
            <p className="mt-3 text-[rgb(var(--fg-rgb)/60%)] max-w-lg mx-auto">
              Upload an image and see a 10-second AI preview. Our experts deliver pixel-perfect results beyond any filter.
            </p>
          </div>
          <AIPreviewTool className="max-w-2xl mx-auto" />
        </div>
      </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
      <section className="py-20 mesh-gradient text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">Need More Than 2 Images?</h2>
          <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)] max-w-xl mx-auto">
            Get an instant quote for your full project — starting at $0.39 per image with 12hr turnaround.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm">
              View Pricing
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link href="/contact"
              className="px-8 py-4 rounded-full glass-card text-[rgb(var(--fg-rgb))] font-semibold hover:border-[rgb(var(--accent-500)/50%)] transition-all text-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <CreditBanner />
    </>
  );
}
