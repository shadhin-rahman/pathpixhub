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
import ServiceCarousel from "@/components/ServiceCarousel";
import TextReveal from "@/components/TextReveal";
import ImageScaleScroll from "@/components/ImageScaleScroll";
import MagneticButton from "@/components/MagneticButton";
import { ScrollProgressBar } from "@/components/HorizontalScroll";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroY = useTransform(heroScroll, [0, 1], [0, 100]);

  const showcaseImages = [
    { src: "/images/hero-slider/bicycle.jpg", title: "Bicycle", category: "Product" },
    { src: "/images/hero-slider/car-editing-1.jpg", title: "Automotive", category: "Vehicle" },
    { src: "/images/hero-slider/ecommerce-product.jpg", title: "E-Commerce", category: "Product" },
    { src: "/images/hero-slider/Beauty retouching.jpg", title: "Beauty", category: "Retouching" },
    { src: "/images/hero-slider/background.jpg", title: "Lifestyle", category: "Background" },
    { src: "/images/hero-slider/Skin Retouch.jpg", title: "Fashion", category: "Retouching" },
  ];

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
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity: heroOpacity, y: heroY }}>
          <div className="text-center px-6 max-w-5xl">
            <motion.div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-xs font-bold text-[rgb(var(--accent-300))] tracking-[0.2em] uppercase mb-8 border-[rgb(var(--accent-500)/30%)]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
              <span className="w-2 h-2 rounded-full bg-[rgb(var(--accent-400))] animate-pulse" />
              Professional Photo Editing
            </motion.div>
            <motion.h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-white" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}>
              Pixel Perfect<br /><span className="text-[rgb(var(--accent-400))]">Results</span>
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
          <span className="px-4 py-2 rounded-full glass-card text-xs font-bold text-[rgb(var(--accent-400))] tracking-wider uppercase border-[rgb(var(--accent-500)/30%)]">From $0.39 / Image</span>
          <span className="px-4 py-2 rounded-full glass-card text-xs font-bold text-[rgb(var(--accent-400))] tracking-wider uppercase border-[rgb(var(--accent-500)/30%)]">12hr Turnaround</span>
        </div>
        <ScrollIndicator />
      </motion.section>

      <section className="relative bg-[#1b2d41] overflow-hidden py-3 border-t border-b border-[#1b2d41]">
        <div className="flex gap-16 w-max marquee-trial items-center">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex items-center gap-16">
              {["24/7 Customer Support", "12hr Fast Turnaround", "From $0.39 / Image", "100% Satisfaction", "Free Trial Available"].map((text) => (
                <span key={text} className="flex items-center gap-2.5 text-xs md:text-sm font-semibold text-[#8e96a0] whitespace-nowrap tracking-wider uppercase">
                  <span className="w-1 h-1 rounded-full bg-[#22c55e]" />
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-[rgb(var(--accent-300))] text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-[rgb(var(--accent-400))] animate-pulse" />
                Professional Photo Editing Services
              </div>
            </TextReveal>
            <TextReveal>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] text-[rgb(var(--fg-rgb))]">
                Transform Your Photos<br /><span className="text-[rgb(var(--accent-400))]">with Precision</span>
              </h1>
            </TextReveal>
            <TextReveal>
              <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/70%)] leading-relaxed max-w-lg">
                From flawless clipping paths to high-end retouching — pixel-perfect results with fast turnaround for e-commerce, fashion, and advertising.
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

      {/* ===== CINEMATIC SERVICES SHOWCASE ===== */}
      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <TextReveal>
            <div className="mb-16">
              <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">What We Offer</h2>
              <h3 className="text-5xl md:text-7xl font-bold tracking-tight gradient-text">Our Services</h3>
            </div>
          </TextReveal>
        </div>

        <div className="space-y-4">
          {services.map((service, idx) => (
            <CinematicServiceCard key={service.id} service={service} index={idx} />
          ))}
        </div>
      </section>

      <ScrollReveal>
      <section className="py-16 overflow-hidden bg-[var(--bg)] relative border-y border-[rgb(var(--fg-rgb)/8%)]">
        <h2 className="text-center text-2xl md:text-3xl font-bold tracking-tight gradient-text mb-10 px-6">Explore Our Expertise</h2>
        <ServiceCarousel services={services} />
      </section>
      </ScrollReveal>

      {/* ===== FULL-PAGE IMAGE SHOWCASE ===== */}
      <section className="py-20 lg:py-28 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <TextReveal>
            <div className="mb-12">
              <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Studio Work</h2>
              <h3 className="text-4xl md:text-6xl font-bold tracking-tight gradient-text">Every Product, Every Angle</h3>
            </div>
          </TextReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {showcaseImages.map((img, i) => (
              <ImageScaleScroll key={img.src} scaleFrom={0.9} scaleTo={1}>
                <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer">
                  <Image src={img.src} alt={img.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-[10px] font-bold text-[rgb(var(--accent-400))] uppercase tracking-[0.2em]">{img.category}</p>
                    <p className="text-lg font-bold text-white mt-1">{img.title}</p>
                  </div>
                </div>
              </ImageScaleScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 lg:py-36 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <TextReveal>
            <div className="text-center mb-16">
              <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">See the Difference</h2>
              <h3 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Before &amp; After</h3>
              <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)] max-w-xl mx-auto">Drag the slider to see our editing quality in action</p>
            </div>
          </TextReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { before: "/images/service-showcase/clipping-path-before.png", after: "/images/service-showcase/clipping-path.png", label: "Clipping Path" },
              { before: "/images/service-showcase/background-removal-before.png", after: "/images/service-showcase/background-removal.png", label: "Background Removal" },
              { before: "/images/service-showcase/photo-retouching-before.png", after: "/images/service-showcase/photo-retouching.png", label: "Photo Retouching" },
              { before: "/images/service-showcase/car-editing-before.png", after: "/images/service-showcase/car-editing.png", label: "Car Editing" },
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
              {[
                { src: "/images/service-cards/clipping-path.png", speed: 0.15, mt: "" },
                { src: "/images/service-cards/background-removal.png", speed: -0.15, mt: "mt-8" },
                { src: "/images/service-cards/color-change.png", speed: 0.15, mt: "-mt-8" },
                { src: "/images/service-cards/car-editing.png", speed: -0.15, mt: "" },
              ].map((item) => (
                <ImageScaleScroll key={item.src} scaleFrom={0.85} scaleTo={1}>
                  <ParallaxImage src={item.src} alt="service" speed={item.speed} scale={[1, 1.1]} className={`aspect-square rounded-3xl glass-card ${item.mt} bg-white/20`}>
                    <Image src={item.src} alt="service" width={400} height={400} className="w-full h-full object-contain p-4" />
                  </ParallaxImage>
                </ImageScaleScroll>
              ))}
            </div>
            <div>
              <TextReveal><h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">About Us</h2></TextReveal>
              <TextReveal><h3 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Your Virtual Photo Editing Studio</h3></TextReveal>
              <TextReveal>
                <p className="mt-6 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
                  We provide expert image editing services for e-commerce brands, product photographers, Amazon sellers, and businesses worldwide.
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
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Why Choose Us</h2>
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
                    <svg className="w-6 h-6 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
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
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">How It Works</h2>
            <h3 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Our Process</h3>
          </div></TextReveal>
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.06}>
            {[
              { step: "01", title: "Client Consultation & Order Submission", desc: "We start by understanding your specific needs — background removal, shadow creation, or precise color adjustments." },
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
                  <span className="text-4xl font-bold text-[rgb(var(--accent-500)/30%)] shrink-0">{item.step}</span>
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
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Good to Know</h2>
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
                  <span className="faq-icon shrink-0 text-2xl leading-none text-[rgb(var(--accent-400))] transition-transform duration-300">+</span>
                </summary>
                <p className="mt-4 text-sm text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 lg:py-36 mesh-gradient text-center">
        <div className="max-w-7xl mx-auto px-6">
          <TextReveal><h2 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Ready to Start?</h2></TextReveal>
          <TextReveal><p className="mt-4 text-[rgb(var(--fg-rgb)/60%)] text-lg max-w-xl mx-auto">Send us 2 images and we&apos;ll edit them for free — no obligation.</p></TextReveal>
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

function CinematicServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const softColors = ["#fca5a5", "#d8b4fe", "#f9a8d4", "#fde68a", "#93c5fd", "#86efac", "#fdba74", "#5eead4", "#a5b4fc", "#fda4af"];
  const colorIndex = ["clipping-path", "background-removal", "shadow-creation", "ghost-mannequin", "image-masking", "color-change", "photo-retouching", "multi-clipping-path", "ecommerce-editing", "car-editing"].indexOf(service.id) % softColors.length;
  const isEven = index % 2 === 0;

  return (
    <motion.div ref={ref} style={{ y }}>
      <Link href={`/services/${service.id}`} className="group block mx-3 md:mx-6 rounded-3xl overflow-hidden relative" style={{ backgroundColor: softColors[colorIndex] }}>
        <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-stretch min-h-[280px] md:min-h-[360px]`}>
          <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 relative overflow-hidden">
            <motion.div
              className="relative w-40 h-40 md:w-56 md:h-56"
              whileHover={{ scale: 1.05, rotate: isEven ? 2 : -2 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={`/images/service-cards/${service.id}.png`}
                alt={service.title}
                fill
                className="object-contain drop-shadow-2xl"
                sizes="224px"
              />
            </motion.div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12">
            <p className="text-[10px] font-bold text-[rgb(var(--fg-rgb)/40%)] uppercase tracking-[0.3em] mb-3">
              Service {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="text-2xl md:text-4xl font-bold text-[rgb(var(--fg-rgb)/90%)] leading-tight group-hover:text-[rgb(var(--fg-rgb))] transition-colors">
              {service.title}
            </h3>
            <p className="mt-3 text-sm text-[rgb(var(--fg-rgb)/55%)] leading-relaxed max-w-md">
              {service.tagline}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[rgb(var(--accent-500))] group-hover:gap-3 transition-all">
              Explore Service
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
