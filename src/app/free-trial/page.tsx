"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/data/services";
import ScrollReveal from "@/components/ScrollReveal";

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

export default function FreeTrialPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [usageType, setUsageType] = useState<"commercial" | "personal" | "">("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-0 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/about/lifestyle-1.jpg" alt="" fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[var(--bg)]" />
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
            <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-lg">
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
              { step: "03", title: "Get Results", desc: "Receive your professionally edited images within 12 hours.", icon: "M5 13l4 4L19 7" },
            ].map((item) => (
              <div key={item.step} className="glass-card rounded-2xl p-6 border-[rgb(var(--fg-rgb)/5%)] text-center">
                <div className="w-12 h-12 rounded-full bg-[rgb(var(--accent-500)/12%)] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
                </div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-[rgb(var(--accent-400))] font-bold uppercase">Step {item.step}</span>
                <h3 className="mt-2 font-bold text-[rgb(var(--fg-rgb))]">{item.title}</h3>
                <p className="mt-1.5 text-sm text-[rgb(var(--fg-rgb)/50%)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Left: Images */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl overflow-hidden aspect-[4/5] relative">
                <Image src="/images/about/precision-craft.jpg" alt="Photo editing" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white font-bold text-lg">Pixel-Perfect Edits</p>
                  <p className="text-white/60 text-sm mt-1">Every image hand-edited by our expert team.</p>
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
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <div className="glass-card rounded-3xl p-8 md:p-10 border-[rgb(var(--fg-rgb)/5%)]">
                <form action="https://formspree.io/f/xovjbydw" method="POST" encType="multipart/form-data" className="space-y-6">
                  <input type="hidden" name="_subject" value="Free Trial Request" />
                  <input type="hidden" name="selected_services" value={selectedServices.join(", ")} />

                  {/* Usage Type - PROMINENT */}
                  <div>
                    <label className="block text-sm font-bold text-[rgb(var(--fg-rgb)/80%)] mb-3">Image Purpose <span className="text-red-400">*</span></label>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setUsageType("commercial")}
                        className={`relative rounded-2xl p-5 border-2 text-left transition-all duration-300 ${usageType === "commercial" ? "border-[rgb(var(--accent-500))] bg-[rgb(var(--accent-500)/8%)] shadow-lg shadow-[rgb(var(--accent-500)/10%)]" : "border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--fg-rgb)/20%)]"}`}>
                        <div className="w-10 h-10 rounded-xl bg-[rgb(34_197_94_/_15%)] flex items-center justify-center mb-3">
                          <svg className="w-5 h-5 text-[rgb(34_197_94)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <p className="font-bold text-sm text-[rgb(var(--fg-rgb))]">Commercial Use</p>
                        <p className="text-xs text-[rgb(var(--fg-rgb)/50%)] mt-1">Product, e-commerce, advertising — eligible for free trial</p>
                        {usageType === "commercial" && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[rgb(var(--accent-500))] flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </div>
                        )}
                      </button>
                      <button type="button" onClick={() => setUsageType("personal")}
                        className={`relative rounded-2xl p-5 border-2 text-left transition-all duration-300 ${usageType === "personal" ? "border-[rgb(var(--accent-500))] bg-[rgb(var(--accent-500)/8%)] shadow-lg shadow-[rgb(var(--accent-500)/10%)]" : "border-[rgb(var(--fg-rgb)/8%)] hover:border-[rgb(var(--fg-rgb)/20%)]"}`}>
                        <div className="w-10 h-10 rounded-xl bg-[rgb(239_68_68_/_15%)] flex items-center justify-center mb-3">
                          <svg className="w-5 h-5 text-[rgb(239_68_68)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <p className="font-bold text-sm text-[rgb(var(--fg-rgb))]">Personal Use</p>
                        <p className="text-xs text-[rgb(var(--fg-rgb)/50%)] mt-1">Personal or non-commercial images</p>
                        {usageType === "personal" && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[rgb(var(--accent-500))] flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </div>
                        )}
                      </button>
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

                  <button type="submit"
                    className="w-full px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] hover:scale-[1.02] transition-all text-sm">
                    Submit Free Trial
                  </button>
                  <p className="text-xs text-[rgb(var(--fg-rgb)/30%)] text-center">We&apos;ll edit your images and respond within 12 hours.</p>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

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
    </>
  );
}
