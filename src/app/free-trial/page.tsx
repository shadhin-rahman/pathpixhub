"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/data/services";
import ScrollReveal from "@/components/ScrollReveal";

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia",
  "Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium",
  "Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria",
  "Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile",
  "China","Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic",
  "Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador",
  "Equatorial Guinea","Eritrea","Estonia","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia",
  "Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras",
  "Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Ivory Coast","Jamaica",
  "Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon",
  "Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia",
  "Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova",
  "Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands",
  "New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan",
  "Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar",
  "Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines",
  "Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone",
  "Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan",
  "Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania",
  "Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda",
  "Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu",
  "Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe",
];

export default function FreeTrialPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const imageFiles = Array.from(newFiles).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...imageFiles].slice(0, 2));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <ScrollReveal>
      <section className="pt-40 pb-20 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Free Trial</h2>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Get 2 Free Edits</h1>
            <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
              Upload up to 2 images and we&apos;ll edit them for free — no obligation, no credit card required.
              See our quality before you commit.
            </p>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <section className="pb-32 bg-[var(--bg-alt)]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="glass-card rounded-3xl p-8 md:p-10 border-[rgb(var(--fg-rgb)/5%)]">
            <form action="https://formspree.io/f/xovjbydw" method="POST" encType="multipart/form-data" className="space-y-6">
              <input type="hidden" name="_subject" value="Free Trial Request" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                  <label htmlFor="ft-service" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Service Needed</label>
                  <select name="service" id="ft-service"
                    className="w-full px-4 py-3.5 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[var(--bg-alt)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm appearance-none"
                    defaultValue="">
                    <option value="" className="bg-[var(--bg-alt)]">Select a service (optional)</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.title} className="bg-[var(--bg-alt)]">{s.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Upload Images <span className="text-red-400">*</span> <span className="text-[rgb(var(--fg-rgb)/40%)] font-normal">(max 2)</span></label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 ${dragOver ? "border-[rgb(var(--accent-500))] bg-[rgb(var(--accent-500)/5%)]" : "border-[rgb(var(--fg-rgb)/15%)] hover:border-[rgb(var(--accent-500)/40%)] hover:bg-[rgb(var(--accent-500)/3%)]"}`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                  <svg className="w-10 h-10 mx-auto text-[rgb(var(--fg-rgb)/25%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <textarea name="message" id="ft-message" rows={4}
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
      </section>

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
