"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { services } from "@/data/services";
import Testimonials from "@/components/Testimonials";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerReveal, { StaggerItem } from "@/components/StaggerReveal";
import ParallaxImage from "@/components/ParallaxImage";
import ScrollIndicator from "@/components/ScrollIndicator";
import CountUp from "@/components/CountUp";
import TextReveal from "@/components/TextReveal";
import ImageScaleScroll from "@/components/ImageScaleScroll";
import MagneticButton from "@/components/MagneticButton";
import { ScrollProgressBar } from "@/components/HorizontalScroll";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import CinematicShowcase from "@/components/CinematicShowcase";
import BeforeAfterHover from "@/components/BeforeAfterHover";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroY = useTransform(heroScroll, [0, 1], [0, 100]);

  return (
    <>
      <ScrollProgressBar />

      <motion.section
        ref={heroRef}
        className="relative w-full aspect-video max-h-[85vh] overflow-hidden"
        style={{ scale: heroScale }}
      >
        <video
          className="hero-video absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/videos/beauty.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity: heroOpacity, y: heroY }}>
          <div className="text-center px-6 max-w-5xl">
            <motion.div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-xs font-bold text-[rgb(var(--accent-300))] tracking-[0.2em] uppercase mb-8 border-[rgb(var(--accent-500)/30%)]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
              <span className="w-2 h-2 rounded-full bg-[rgb(var(--accent-400))] animate-pulse" />
              Professional Photo Editing
            </motion.div>
            <motion.h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-white" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}>
              Pixel Perfect<br /><span className="text-[rgb(var(--accent-500))]">Results</span>
            </motion.h1>
            <motion.p className="mt-6 text-lg sm:text-xl text-white/70 max-w-lg mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}>
              Expert photo editing for e-commerce, fashion &amp; advertising.
            </motion.p>
            <motion.div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }}>
              <MagneticButton strength={0.15}>
                <Link href="/free-trial" className="group px-10 py-5 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm inline-flex items-center gap-3">
                  Start Free Trial
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.15}>
                <Link href="/services" className="px-10 py-5 rounded-full glass-card text-white font-semibold hover:border-[rgb(var(--accent-500)/50%)] transition-all text-sm">
                  View Services
                </Link>
              </MagneticButton>
            </motion.div>
          </div>
        </motion.div>
        <div className="absolute bottom-6 left-6 z-10 flex flex-wrap gap-3">
          <span className="px-4 py-2 rounded-full glass-card text-xs font-bold text-[rgb(var(--accent-500))] tracking-wider uppercase border-[rgb(var(--accent-500)/30%)]">From $0.39 / Image</span>
          <span className="px-4 py-2 rounded-full glass-card text-xs font-bold text-[rgb(var(--accent-text))] tracking-wider uppercase border-[rgb(var(--accent-500)/30%)]">12hr Turnaround</span>
        </div>
        <ScrollIndicator />
      </motion.section>

      <section className="relative bg-[#1b2d41] overflow-hidden py-3 border-t border-b border-[#1b2d41]">
        <div className="flex gap-16 w-max marquee-trial items-center">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex items-center gap-16">
              {["24/7 Customer Support", "12hr Fast Turnaround", "From $0.39 / Image", "100% Satisfaction", "Free Trial Available"].map((text) => (
                <span key={text} className="flex items-center gap-2.5 text-xs md:text-sm font-semibold text-[#8e96a0] whitespace-nowrap tracking-wider uppercase">
                  <span className="w-1 h-1 rounded-full bg-[#89F336]" />
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden mesh-gradient">
        <div className="premium-blur w-[500px] h-[500px] top-[-20%] right-[-10%]" />
        <div className="relative w-full max-w-7xl mx-auto px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <TextReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-[rgb(var(--accent-text))] text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-[rgb(var(--accent-400))] animate-pulse" />
                Professional Photo Editing Services
              </div>
            </TextReveal>
            <TextReveal>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] text-[rgb(var(--fg-rgb))]">
                Transform Your Photos<br /><span className="text-[rgb(var(--accent-text))]">with Precision</span>
              </h1>
            </TextReveal>
            <TextReveal>
              <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/70%)] leading-relaxed max-w-lg">
                From flawless clipping paths to high-end retouching â€” pixel-perfect results with fast turnaround for e-commerce, fashion, and advertising.
              </p>
            </TextReveal>
            <TextReveal>
              <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                <MagneticButton strength={0.12}>
                  <Link href="/free-trial" className="group px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm inline-flex items-center gap-2">
                    Start Free Trial
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </MagneticButton>
                <MagneticButton strength={0.12}>
                  <Link href="/services" className="px-8 py-4 rounded-full glass-card text-[rgb(var(--fg-rgb))] font-semibold hover:border-[rgb(var(--accent-500)/50%)] transition-all text-sm">View Services</Link>
                </MagneticButton>
              </div>
            </TextReveal>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-stretch gap-6">
            <div className="w-full lg:w-1/3 shrink-0 flex flex-col justify-center">
              <TextReveal><h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-text))] font-bold mb-6">From Our Studio</h2></TextReveal>
              <TextReveal><h3 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text pb-2">Every Product, Every Angle</h3></TextReveal>
              <TextReveal>
                <p className="mt-6 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed max-w-lg">
                  Bicycles, vehicles, apparel, or accessories â€” whatever you shoot, we edit it with the same pixel-perfect care.
                </p>
              </TextReveal>
              <TextReveal>
                <div className="mt-6 flex flex-wrap gap-3">
                  {["Clipping Path", "Background Removal", "Shadow Creation", "Photo Retouching", "Beauty Airbrushing", "Car Image Editing"].map((tag) => (
                    <span key={tag} className="px-4 py-2 rounded-full glass-card text-xs font-semibold text-[rgb(var(--fg-rgb)/70%)]">{tag}</span>
                  ))}
                </div>
              </TextReveal>
            </div>
            <div className="w-full lg:w-2/3 flex items-stretch">
              <ImageScaleScroll scaleFrom={0.9} scaleTo={1} className="w-full rounded-3xl">
                <div className="relative w-full rounded-3xl overflow-hidden glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[var(--bg-subtle)]" style={{ aspectRatio: "1600 / 700", maxHeight: "50rem", minHeight: "10rem" }}>
                  {[
                    { src: "/images/hero-slider/bicycle.jpg", alt: "bicycle photo editing", delay: "0s" },
                    { src: "/images/hero-slider/car-editing-1.jpg", alt: "car photo editing", delay: "-8s" },
                    { src: "/images/hero-slider/ecommerce-product.jpg", alt: "ecommerce product photo editing", delay: "-16s" },
                    { src: "/images/hero-slider/background.jpg", alt: "background removal", delay: "-24s" },
                    { src: "/images/hero-slider/Beauty retouching.jpg", alt: "beauty retouching", delay: "-32s" },
                    { src: "/images/hero-slider/Blank poster.jpg", alt: "blank poster", delay: "-40s" },
                    { src: "/images/hero-slider/Skin Retouch.jpg", alt: "skin retouch", delay: "-48s" },
                  ].map((slide) => (
                    <div key={slide.src} className="absolute inset-0 flex items-center justify-center" style={{ animation: "hero-fade-7 56s ease-in-out infinite", animationDelay: slide.delay }}>
                      <Image src={slide.src} alt={slide.alt} fill className="object-cover mobile-object-contain" sizes="66vw" />
                    </div>
                  ))}
                </div>
              </ImageScaleScroll>
            </div>
          </div>
        </div>
      </section>

      <CinematicShowcase services={services} />

      <section className="py-28 lg:py-36 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <TextReveal><div className="text-center mb-16">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-text))] font-bold mb-6">See the Difference</h2>
            <h3 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Before &amp; After</h3>
            <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)] max-w-xl mx-auto">Drag the slider to see our editing quality in action</p>
          </div></TextReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { before: "/images/before-after/clipping-path-before.jpg", after: "/images/before-after/clipping-path-after.jpg", label: "Clipping Path" },
              { before: "/images/before-after/background-removal-before.jpg", after: "/images/before-after/background-removal-after.jpg", label: "Background Removal" },
              { before: "/images/before-after/photo-retouching-before.jpg", after: "/images/before-after/photo-retouching-after.jpg", label: "Photo Retouching" },
              { before: "/images/before-after/multi-clipping-path-before.jpg", after: "/images/before-after/multi-clipping-path-after.jpg", label: "Multi Clipping Path" },
              { before: "/images/before-after/color-change-before.jpg", after: "/images/before-after/color-change-after.jpg", label: "Color Change" },
              { before: "/images/before-after/car-editing-before.jpg", after: "/images/before-after/car-editing-after.jpg", label: "Car Editing" },
              { before: "/images/before-after/ghost-mannequin-before.jpg", after: "/images/before-after/ghost-mannequin-after.jpg", label: "Ghost Mannequin" },
              { before: "/images/before-after/image-masking-before.jpg", after: "/images/before-after/image-masking-after.png", label: "Image Masking" },
              { before: "/images/before-after/shadow-creation-before.jpg", after: "/images/before-after/shadow-creation-after.jpg", label: "Shadow Creation" },
              { before: "/images/before-after/ecommerce-editing-before.jpg", after: "/images/before-after/ecommerce-editing-after.jpg", label: "E-commerce Editing" },
            ].map((item) => (
              <TextReveal key={item.label}>
                <BeforeAfterSlider beforeSrc={item.before} afterSrc={item.after} beforeAlt={`Before ${item.label}`} afterAlt={`After ${item.label}`} />
                <p className="text-center mt-4 text-sm font-semibold text-[rgb(var(--fg-rgb)/60%)]">{item.label}</p>
              </TextReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 lg:py-36 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-3xl glass-card bg-white/20 overflow-hidden group">
                <BeforeAfterHover before="/images/service-cards/car-editing-before.jpg" after="/images/service-cards/car-editing-after.png" alt="car editing" />
              </div>
              <div className="aspect-square rounded-3xl glass-card mt-8 bg-white/20 overflow-hidden group">
                <BeforeAfterHover before="/images/service-cards/ecommerce-editing-before.jpg" after="/images/service-cards/ecommerce-editing-after.jpg" alt="ecommerce editing" />
              </div>
              <div className="aspect-square rounded-3xl glass-card -mt-8 bg-white/20 overflow-hidden group">
                <BeforeAfterHover before="/images/service-cards/Jewellery%20Retouching-before.jpg" after="/images/service-cards/Jewellery%20Retouching-after.jpg" alt="jewellery retouching" />
              </div>
              <div className="aspect-square rounded-3xl glass-card bg-white/20 overflow-hidden group">
                <BeforeAfterHover before="/images/service-cards/Camera%20reflection%20removal-before.jpg" after="/images/service-cards/Camera%20reflection%20removal-after.jpg" alt="camera reflection removal" />
              </div>
            </div>
            <div>
              <TextReveal><h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-text))] font-bold mb-6">About Us</h2></TextReveal>
              <TextReveal><h3 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Your Virtual Photo Editing Studio</h3></TextReveal>
              <TextReveal>
                <p className="mt-6 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
                  We provide expert image editing services for e-commerce brands, product photographers, Amazon sellers, and businesses worldwide. From clipping path and background removal to multi-clipping paths, color correction, and photo retouching â€” we handle every detail with care.
                </p>
              </TextReveal>
              <TextReveal>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <CountUp end={200} suffix="+" label="Projects" />
                  <CountUp end={12} suffix="hr" label="Turnaround" />
                  <CountUp end={100} suffix="%" label="Satisfaction" />
                  <CountUp end={50} suffix="+" label="Clients" />
                </div>
              </TextReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 lg:py-36 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <TextReveal><div className="text-center mb-16">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-text))] font-bold mb-6">Why Choose Us</h2>
            <h3 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Built for Speed &amp; Quality</h3>
          </div></TextReveal>
          <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "12hr Fast Turnaround", desc: "Most orders delivered within 12 hours. Urgent? Ask about our 6hr express service." },
              { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "From $0.39 / Image", desc: "Professional editing starting at just $0.39 per image. Volume discounts available." },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "100% Satisfaction", desc: "Pixel-perfect quality guaranteed. Free revisions until you're completely satisfied." },
              { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", title: "Dedicated Team", desc: "Skilled editors assigned to your project, ensuring consistency and quality every time." },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <div className="glass-card rounded-2xl px-6 py-8 text-center border-[rgb(var(--fg-rgb)/5%)]">
                  <div className="w-12 h-12 rounded-full bg-[rgb(var(--accent-500)/12%)] flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-[rgb(var(--accent-text))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
                  </div>
                  <h3 className="font-bold text-[rgb(var(--fg-rgb))]">{item.title}</h3>
                  <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/50%)] leading-relaxed">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <section className="py-28 lg:py-36 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <TextReveal><div className="text-center mb-20">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-text))] font-bold mb-6">How It Works</h2>
            <h3 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Our Process</h3>
          </div></TextReveal>
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.06}>
            {[
              { step: "01", title: "Client Consultation & Order Submission", desc: "We start by understanding your specific needs â€” background removal, shadow creation, or precise color adjustments." },
              { step: "02", title: "Image Analysis & Project Assessment", desc: "Every image is different, so we assess the detail needed to set a realistic timeline for delivery." },
              { step: "03", title: "Selecting the Right Tools", desc: "We rely on Adobe Photoshop's pen tool for precise clipping paths, plus masking techniques for complex backgrounds." },
              { step: "04", title: "Clipping Path Creation", desc: "Our editors manually outline each object for clean edges and perfect isolation." },
              { step: "05", title: "Applying Additional Edits", desc: "Once clean paths are established, we apply shadow creation, color correction, or background changes." },
              { step: "06", title: "Quality Assurance & Revisions", desc: "Every edited image goes through a thorough quality check for consistency and precision." },
              { step: "07", title: "Delivery & Client Feedback", desc: "Finished images are delivered in your preferred format, and we welcome feedback for any final adjustments." },
              { step: "08", title: "Ongoing Support", desc: "We build lasting relationships, staying available for ongoing support on all your future projects." },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <div className="glass-card rounded-[2rem] p-8 flex gap-6">
                  <span className="text-4xl font-bold text-[rgb(var(--accent-text)/30%)] shrink-0">{item.step}</span>
                  <div>
                    <h3 className="text-lg font-bold text-[rgb(var(--fg-rgb))]">{item.title}</h3>
                    <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/40%)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <Testimonials />

      <section className="py-28 lg:py-36 bg-[var(--bg-alt)]">
        <div className="max-w-4xl mx-auto px-6">
          <TextReveal><div className="text-center mb-16">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-text))] font-bold mb-6">Good to Know</h2>
            <h3 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">FAQs</h3>
          </div></TextReveal>
          <div className="space-y-4">
            {[
              { q: "What types of images work best for clipping paths?", a: "Clipping paths are ideal for images with clear, defined edges. They work well for product photos, e-commerce images, and any subjects that need isolation from the background." },
              { q: "How does background removal help my business?", a: "Removing the background can make your product images look cleaner and more professional, helping customers focus directly on the product." },
              { q: "What is image masking, and when is it used?", a: "Image masking is a technique for handling complex subjects with soft edges, like hair or fur." },
              { q: "Can I request specific shadow styles for my photos?", a: "Yes! We offer custom shadow options, including natural, drop, and reflection shadows." },
              { q: "What does the ghost mannequin service involve?", a: "Our ghost mannequin service provides a 3D effect for apparel images, giving a lifelike shape to clothes without using a model." },
              { q: "Do you offer bulk editing services?", a: "Yes, we offer scalable solutions for businesses with large image volumes. Contact us for custom pricing." },
              { q: "What is the turnaround time?", a: "Our standard turnaround is 12 hours. Need it faster? Ask about our 6-hour express service." },
            ].map((item) => (
              <details key={item.q} className="faq-item glass-card rounded-2xl px-6 py-5 border-[rgb(var(--fg-rgb)/5%)]">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-[rgb(var(--fg-rgb))]">{item.q}</span>
                  <span className="faq-icon shrink-0 text-2xl leading-none text-[rgb(var(--accent-text))] transition-transform duration-300">+</span>
                </summary>
                <p className="mt-4 text-sm text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 lg:py-36 brand-cta text-center">
        <div className="max-w-7xl mx-auto px-6">
          <TextReveal><h2 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Ready to Start?</h2></TextReveal>
          <TextReveal><p className="mt-4 text-lg max-w-xl mx-auto">Send us 2 images and we&apos;ll edit them for free â€” no obligation.</p></TextReveal>
          <TextReveal>
            <MagneticButton strength={0.15}>
              <Link href="/free-trial" className="mt-8 inline-flex items-center px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm">Request Free Trial</Link>
            </MagneticButton>
          </TextReveal>
        </div>
      </section>
    </>
  );
}
