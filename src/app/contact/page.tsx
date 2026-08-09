"use client";

import Image from "next/image";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <>
      <section className="pt-40 pb-20 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-xl">
              <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-text))] font-bold">Contact</h2>
              <h1 className="mt-6 text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] gradient-text">
                Let&apos;s
                <br />
                Talk.
              </h1>
              <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
                We turn bold ideas into unforgettable visuals. Start the conversation.
              </p>
            </div>
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[32rem] rounded-3xl overflow-hidden">
              <Image
                src="/images/about/client-consultation.jpg"
                alt="Client consultation"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <ContactForm />
        </div>
      </section>
    </>
  );
}