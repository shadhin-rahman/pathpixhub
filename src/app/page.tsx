import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { services } from "@/data/services";
import Testimonials from "@/components/Testimonials";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerReveal, { StaggerItem } from "@/components/StaggerReveal";
import ParallaxImage from "@/components/ParallaxImage";
import ScrollIndicator from "@/components/ScrollIndicator";
import CountUp from "@/components/CountUp";

export default function Home() {
  return (
    <>
      <ScrollReveal direction="none" scale={1.05} duration={1.2}>
      <section className="relative w-full aspect-video max-h-[85vh] overflow-hidden">
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
        <div className="absolute bottom-6 left-6 z-10 flex flex-wrap gap-3">
          <span className="px-4 py-2 rounded-full glass-card text-xs font-bold text-[rgb(var(--accent-400))] tracking-wider uppercase border-[rgb(var(--accent-500)/30%)]">
            From $0.39 / Image
          </span>
          <span className="px-4 py-2 rounded-full glass-card text-xs font-bold text-[rgb(var(--accent-400))] tracking-wider uppercase border-[rgb(var(--accent-500)/30%)]">
            12hr Turnaround
          </span>
        </div>
        <ScrollIndicator />
      </section>
      </ScrollReveal>

      <section className="relative bg-[#1b2d41] overflow-hidden py-3 border-t border-b border-[#1b2d41]">
        <div className="flex gap-16 w-max marquee-trial items-center">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex items-center gap-16">
              <span className="flex items-center gap-2.5 text-xs md:text-sm font-semibold text-[#8e96a0] whitespace-nowrap tracking-wider uppercase">
                <span className="w-1 h-1 rounded-full bg-[#22c55e]" />
                24/7 Customer Support
              </span>
              <span className="flex items-center gap-2.5 text-xs md:text-sm font-semibold text-[#8e96a0] whitespace-nowrap tracking-wider uppercase">
                <span className="w-1 h-1 rounded-full bg-[#22c55e]" />
                12hr Fast Turnaround
              </span>
              <span className="flex items-center gap-2.5 text-xs md:text-sm font-semibold text-[#8e96a0] whitespace-nowrap tracking-wider uppercase">
                <span className="w-1 h-1 rounded-full bg-[#22c55e]" />
                From $0.39 / Image
              </span>
              <span className="flex items-center gap-2.5 text-xs md:text-sm font-semibold text-[#8e96a0] whitespace-nowrap tracking-wider uppercase">
                <span className="w-1 h-1 rounded-full bg-[#22c55e]" />
                100% Satisfaction
              </span>
              <span className="flex items-center gap-2.5 text-xs md:text-sm font-semibold text-[#8e96a0] whitespace-nowrap tracking-wider uppercase">
                <span className="w-1 h-1 rounded-full bg-[#22c55e]" />
                Free Trial Available
              </span>
            </div>
          ))}
        </div>
      </section>

      <ScrollReveal>
      <section className="relative overflow-hidden mesh-gradient">
        <div className="premium-blur w-[500px] h-[500px] top-[-20%] right-[-10%]" />
        <div className="relative w-full max-w-7xl mx-auto px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-[rgb(var(--accent-300))] text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-[rgb(var(--accent-400))] animate-pulse" />
              Professional Photo Editing Services
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] text-[rgb(var(--fg-rgb))]">
              Transform Your Photos
              <br />
              <span className="text-[rgb(var(--accent-400))]">with Precision</span>
            </h1>
            <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/70%)] leading-relaxed max-w-lg">
              From flawless clipping paths to high-end retouching — pixel-perfect results
              with fast turnaround for e-commerce, fashion, and advertising.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/contact"
                className="group px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm inline-flex items-center gap-2"
              >
                Start Free Trial
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link
                href="/services"
                className="px-8 py-4 rounded-full glass-card text-[rgb(var(--fg-rgb))] font-semibold hover:border-[rgb(var(--accent-500)/50%)] transition-all text-sm"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="py-16 lg:py-24 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-stretch gap-6">
            <div className="w-full lg:w-1/3 shrink-0 flex flex-col justify-center">
              <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">From Our Studio</h2>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text pb-2">Every Product, Every Angle</h3>
              <p className="mt-6 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed max-w-lg">
                Bicycles, vehicles, apparel, or accessories — whatever you shoot, we edit it with the
                same pixel-perfect care. A rotating look at a few recent categories we work with.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["Clipping Path", "Background Removal", "Shadow Creation", "Photo Retouching", "Beauty Airbrushing", "Car Image Editing"].map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full glass-card text-xs font-semibold text-[rgb(var(--fg-rgb)/70%)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-2/3 flex items-stretch">
              <div className="relative w-full rounded-3xl overflow-hidden glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[var(--bg-subtle)]"
                style={{ aspectRatio: "1600 / 700", maxHeight: "50rem", minHeight: "10rem" }}
              >
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
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      className="object-cover mobile-object-contain"
                      sizes="66vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">What We Offer</h2>
            <h3 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Our Services</h3>
          </div>
          <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => {
              const softColors = ["#fca5a5","#d8b4fe","#f9a8d4","#fde68a","#93c5fd","#86efac","#fdba74","#5eead4","#a5b4fc","#fda4af"];
              const ci = ["clipping-path","background-removal","shadow-creation","ghost-mannequin","image-masking","color-change","photo-retouching","multi-clipping-path","ecommerce-editing","car-editing"].indexOf(service.id) % softColors.length;
              return (
              <StaggerItem key={service.id}>
              <Link
                href={`/services/${service.id}`}
                className="group block rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                style={{ backgroundColor: softColors[ci] }}
              >
                <div className="flex items-center gap-4 p-4 md:p-5">
                  <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl overflow-hidden bg-white/30 flex items-center justify-center">
                    <Image
                      src={`/images/service-cards/${service.id}.png`}
                      alt={service.title}
                      fill
                      className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-700"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm md:text-base text-[rgb(var(--fg-rgb)/85%)] leading-tight">{service.title}</h3>
                    <p className="mt-0.5 text-xs text-[rgb(var(--fg-rgb)/55%)] line-clamp-2">{service.tagline}</p>
                  </div>
                </div>
              </Link>
              </StaggerItem>
            )})}
          </StaggerReveal>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="py-16 overflow-hidden bg-[var(--bg)] relative border-y border-[rgb(var(--fg-rgb)/8%)]">
        <h2 className="text-center text-2xl md:text-3xl font-bold tracking-tight gradient-text mb-10 px-6">Explore Our Expertise</h2>
        <div className="relative">
          <div className="flex gap-6 w-max marquee-slide">
            {[...Array(3)].flatMap(() => services).map((s, i) => {
              const softColors = ["#fca5a5","#d8b4fe","#f9a8d4","#fde68a","#93c5fd","#86efac","#fdba74","#5eead4","#a5b4fc","#fda4af"];
              const ci = i % softColors.length;
              return (
                <div key={`${s.id}-${i}`} className="flex-shrink-0 w-64 md:w-80 group">
                  <div className="rounded-2xl p-4 pb-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{ backgroundColor: softColors[ci] }}
                  >
                    <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden bg-white/30">
                      <Image
                        src={`/images/service-showcase/${s.id}.png`}
                        alt={s.title}
                        fill
                        className="object-contain p-3 group-hover:opacity-0 group-hover:scale-110 transition-all duration-700"
                        sizes="(max-width: 768px) 256px, 320px"
                      />
                      <Image
                        src={`/images/service-showcase/${s.id}-before.png`}
                        alt={`${s.title} before`}
                        fill
                        className="object-contain p-3 absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        sizes="(max-width: 768px) 256px, 320px"
                      />
                    </div>
                    <Link
                      href={`/services/${s.id}`}
                      className="block mt-3 text-[rgb(var(--fg-rgb)/80%)] font-bold text-sm text-center leading-tight hover:text-[rgb(var(--accent-500))] transition-colors"
                    >
                      {s.title}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="py-24 lg:py-32 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-4">
              <ParallaxImage src="/images/service-cards/clipping-path.png" alt="clipping path" speed={0.15} scale={[1, 1.1]} className="aspect-square rounded-3xl glass-card bg-white/20">
                <Image src="/images/service-cards/clipping-path.png" alt="clipping path" width={400} height={400} className="w-full h-full object-contain p-4" />
              </ParallaxImage>
              <ParallaxImage src="/images/service-cards/background-removal.png" alt="background removal" speed={-0.15} scale={[1, 1.1]} className="aspect-square rounded-3xl glass-card mt-8 bg-white/20">
                <Image src="/images/service-cards/background-removal.png" alt="background removal" width={400} height={400} className="w-full h-full object-contain p-4" />
              </ParallaxImage>
              <ParallaxImage src="/images/service-cards/color-change.png" alt="color change" speed={0.15} scale={[1, 1.1]} className="aspect-square rounded-3xl glass-card -mt-8 bg-white/20">
                <Image src="/images/service-cards/color-change.png" alt="color change" width={400} height={400} className="w-full h-full object-contain p-4" />
              </ParallaxImage>
              <ParallaxImage src="/images/service-cards/car-editing.png" alt="car editing" speed={-0.15} scale={[1, 1.1]} className="aspect-square rounded-3xl glass-card bg-white/20">
                <Image src="/images/service-cards/car-editing.png" alt="car editing" width={400} height={400} className="w-full h-full object-contain p-4" />
              </ParallaxImage>
            </div>
            <div>
              <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">About Us</h2>
              <h3 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Your Virtual Photo Editing Studio</h3>
              <p className="mt-6 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
                We provide expert image editing services for e-commerce brands, product photographers,
                Amazon sellers, and businesses worldwide. From clipping path and background removal
                to multi-clipping paths, color correction, and photo retouching — we handle every detail with care.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <CountUp end={200} suffix="+" label="Projects" />
                <CountUp end={12} suffix="hr" label="Turnaround" />
                <CountUp end={100} suffix="%" label="Satisfaction" />
                <CountUp end={50} suffix="+" label="Clients" />
              </div>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="py-24 lg:py-32 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Why Choose Us</h2>
            <h3 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Built for Speed & Quality</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "12hr Fast Turnaround", desc: "Most orders delivered within 12 hours. Urgent? Ask about our 6hr express service." },
              { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "From $0.39 / Image", desc: "Professional editing starting at just $0.39 per image. Volume discounts available." },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "100% Satisfaction", desc: "Pixel-perfect quality guaranteed. Free revisions until you're completely satisfied." },
              { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", title: "Dedicated Team", desc: "Skilled editors assigned to your project, ensuring consistency and quality every time." },
            ].map((item) => (
              <div key={item.title} className="glass-card rounded-2xl px-6 py-8 text-center border-[rgb(var(--fg-rgb)/5%)]">
                <div className="w-12 h-12 rounded-full bg-[rgb(var(--accent-500)/12%)] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[rgb(var(--accent-400))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
                </div>
                <h3 className="font-bold text-[rgb(var(--fg-rgb))]">{item.title}</h3>
                <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/50%)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="py-24 lg:py-32 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">How It Works</h2>
            <h3 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Our Process</h3>
          </div>
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.06}>
            {[
              { step: "01", title: "Client Consultation & Order Submission", desc: "We start by understanding your specific needs — background removal, shadow creation, or precise color adjustments — reviewing your instructions before any editing begins." },
              { step: "02", title: "Image Analysis & Project Assessment", desc: "Every image is different, so we assess the detail needed — intricate edges or multiple objects — to set a realistic timeline for delivery." },
              { step: "03", title: "Selecting the Right Tools", desc: "We rely on Adobe Photoshop's pen tool for precise clipping paths, plus the magic wand and masking techniques for complex backgrounds." },
              { step: "04", title: "Clipping Path Creation", desc: "Our editors manually outline each object for clean edges and perfect isolation, creating separate paths for multiple items when needed." },
              { step: "05", title: "Applying Additional Edits", desc: "Once clean paths are established, we apply shadow creation, color correction, or background changes as necessary." },
              { step: "06", title: "Quality Assurance & Revisions", desc: "Every edited image goes through a thorough quality check for consistency and precision, with adjustments made promptly." },
              { step: "07", title: "Delivery & Client Feedback", desc: "Finished images are delivered in your preferred format (PNG, JPEG, or PSD), and we welcome feedback for any final adjustments." },
              { step: "08", title: "Ongoing Support", desc: "We build lasting relationships, staying available for ongoing support on all your future editing projects." },
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

      <ScrollReveal>
      <section className="py-24 lg:py-32 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Get in Touch</h2>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text">Let&rsquo;s Start Your Project</h3>
              <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
                Send us your images and we&rsquo;ll provide a free quote within hours. Try our service
                with 2 free edits — no commitment, no credit card required.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { label: "Email", value: "info@pathpixhub.com", href: "mailto:info@pathpixhub.com" },
                  { label: "Turnaround", value: "From 12 hours" },
                  { label: "Pricing", value: "From $0.39 / image" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[rgb(var(--accent-400))]" />
                    <span className="text-sm text-[rgb(var(--fg-rgb)/50%)]">{item.label}:</span>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-semibold text-[rgb(var(--fg-rgb))] hover:text-[rgb(var(--accent-400))] transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-sm font-semibold text-[rgb(var(--fg-rgb))]">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-3xl p-8 border-[rgb(var(--fg-rgb)/5%)]">
              <form action="https://formspree.io/f/xanybqng" method="POST" className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-xs uppercase tracking-[0.15em] font-bold text-[rgb(var(--fg-rgb)/40%)] block mb-2">Your Name</label>
                  <input type="text" id="name" name="name" required className="w-full px-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/8%)] text-sm text-[rgb(var(--fg-rgb))] focus:outline-none focus:border-[rgb(var(--accent-500)/50%)] transition-colors placeholder:text-[rgb(var(--fg-rgb)/30%)]" placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="email" className="text-xs uppercase tracking-[0.15em] font-bold text-[rgb(var(--fg-rgb)/40%)] block mb-2">Email Address</label>
                  <input type="email" id="email" name="email" required className="w-full px-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/8%)] text-sm text-[rgb(var(--fg-rgb))] focus:outline-none focus:border-[rgb(var(--accent-500)/50%)] transition-colors placeholder:text-[rgb(var(--fg-rgb)/30%)]" placeholder="john@example.com" />
                </div>
                <div>
                  <label htmlFor="message" className="text-xs uppercase tracking-[0.15em] font-bold text-[rgb(var(--fg-rgb)/40%)] block mb-2">Message</label>
                  <textarea id="message" name="message" rows={4} required className="w-full px-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/8%)] text-sm text-[rgb(var(--fg-rgb))] focus:outline-none focus:border-[rgb(var(--accent-500)/50%)] transition-colors placeholder:text-[rgb(var(--fg-rgb)/30%)] resize-none" placeholder="Tell us about your project..." />
                </div>
                <p className="text-[10px] text-[rgb(var(--fg-rgb)/30%)]">By submitting, you agree to our <Link href="/privacy-policy" className="underline hover:text-[rgb(var(--accent-400))]">Privacy Policy</Link>.</p>
                <button type="submit" className="w-full px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <section className="py-24 lg:py-32 bg-[var(--bg-alt)]">
        <div className="max-w-4xl mx-auto px-6">
          <Script id="faq-schema" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                { "@type": "Question", name: "What types of images work best for clipping paths?", acceptedAnswer: { "@type": "Answer", text: "Clipping paths are ideal for images with clear, defined edges. They work well for product photos, e-commerce images, and any subjects that need isolation from the background." } },
                { "@type": "Question", name: "How does background removal help my business?", acceptedAnswer: { "@type": "Answer", text: "Removing the background can make your product images look cleaner and more professional, helping customers focus directly on the product and improving visual appeal in online stores." } },
                { "@type": "Question", name: "What is image masking, and when is it used?", acceptedAnswer: { "@type": "Answer", text: "Image masking is a technique for handling complex subjects with soft edges, like hair or fur. It's used when clipping paths alone aren't sufficient for high-detail areas." } },
                { "@type": "Question", name: "Can I request specific shadow styles for my photos?", acceptedAnswer: { "@type": "Answer", text: "Yes! We offer custom shadow options, including natural, drop, and reflection shadows, to suit your aesthetic needs." } },
                { "@type": "Question", name: "What does the ghost mannequin service involve?", acceptedAnswer: { "@type": "Answer", text: "Our ghost mannequin service provides a 3D effect for apparel images, giving a lifelike shape to clothes without using a model. It's ideal for fashion and e-commerce brands." } },
                { "@type": "Question", name: "Do you offer bulk editing services for large image volumes?", acceptedAnswer: { "@type": "Answer", text: "Yes, we offer scalable solutions for businesses with large image volumes. Contact us for custom pricing and service options for high-volume edits." } },
                { "@type": "Question", name: "What is the turnaround time for your services?", acceptedAnswer: { "@type": "Answer", text: "Our standard turnaround is 12 hours for most jobs. Need it faster? Ask about our 6-hour express service. Contact us for specific timelines." } },
              ],
            }),
          }} />
          <div className="text-center mb-16">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Good to Know</h2>
            <h3 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">FAQs</h3>
            <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)]">General requirements for our image editing services.</p>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "What types of images work best for clipping paths?",
                a: "Clipping paths are ideal for images with clear, defined edges. They work well for product photos, e-commerce images, and any subjects that need isolation from the background.",
              },
              {
                q: "How does background removal help my business?",
                a: "Removing the background can make your product images look cleaner and more professional, helping customers focus directly on the product and improving visual appeal in online stores.",
              },
              {
                q: "What is image masking, and when is it used?",
                a: "Image masking is a technique for handling complex subjects with soft edges, like hair or fur. It's used when clipping paths alone aren't sufficient for high-detail areas.",
              },
              {
                q: "Can I request specific shadow styles for my photos?",
                a: "Yes! We offer custom shadow options, including natural, drop, and reflection shadows, to suit your aesthetic needs.",
              },
              {
                q: "What does the ghost mannequin service involve?",
                a: "Our ghost mannequin service provides a 3D effect for apparel images, giving a lifelike shape to clothes without using a model. It's ideal for fashion and e-commerce brands.",
              },
              {
                q: "Do you offer bulk editing services for large image volumes?",
                a: "Yes, we offer scalable solutions for businesses with large image volumes. Contact us for custom pricing and service options for high-volume edits.",
              },
              {
                q: "What is the turnaround time for your services?",
                a: "Our standard turnaround is 12 hours for most jobs. Need it faster? Ask about our 6-hour express service. Contact us for specific timelines.",
              },
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
      </ScrollReveal>

      <section className="py-24 lg:py-32 mesh-gradient text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Ready to Start?</h2>
          <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)] text-lg max-w-xl mx-auto">
            Send us 2 images and we'll edit them for free — no obligation.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm"
          >
            Request Free Trial
          </Link>
        </div>
      </section>
    </>
  );
}
