import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | PathPixHub",
  description: "Your virtual photo editing studio. Learn about our mission, vision, and core values — pixel-perfect precision with fast turnaround.",
};

export default function AboutPage() {
  return (
    <>
      <section className="pt-40 pb-20 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-3xl">
              <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">About Us</h2>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Your Virtual Photo Editing Studio</h1>
              <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
                Our mission is to transform your images into works of art with precision, creativity, and
                unparalleled quality.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { src: "/images/service-cards/clipping-path.png", alt: "clipping path" },
                { src: "/images/service-cards/background-removal.png", alt: "background removal" },
                { src: "/images/service-cards/color-change.png", alt: "color change" },
                { src: "/images/service-cards/car-editing.png", alt: "car editing" },
              ].map((img) => (
                <div key={img.src} className="relative aspect-square rounded-2xl overflow-hidden glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[var(--bg-subtle)]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-contain p-3"
                    sizes="(max-width: 1024px) 50vw, 20vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-bold text-[rgb(var(--fg-rgb))]">Our Mission</h2>
              <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
                Whether you are an e-commerce business, a photographer, or a marketer, we are here to offer
                you photo editing solutions that not only meet but exceed your expectations.
              </p>
              <h2 className="mt-10 text-2xl font-bold text-[rgb(var(--fg-rgb))]">Our Vision</h2>
              <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
                We envision becoming a trusted global partner for businesses in need of high-quality, affordable
                photo editing services.
              </p>
              <h2 className="mt-10 text-2xl font-bold text-[rgb(var(--fg-rgb))]">Core Values</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Quality", desc: "Never compromised. Every image meets the highest standards." },
                  { title: "Satisfaction", desc: "Our clients are at the heart of everything we do." },
                  { title: "Dedication", desc: "Every project is an opportunity to show our commitment." },
                  { title: "Excellence", desc: "We don't settle for good enough — always striving for more." },
                ].map((v) => (
                  <div key={v.title} className="glass-card rounded-xl p-5 border-[rgb(var(--fg-rgb)/5%)]">
                    <h3 className="font-bold text-[rgb(var(--fg-rgb))] text-sm">{v.title}</h3>
                    <p className="mt-1.5 text-sm text-[rgb(var(--fg-rgb)/40%)]">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-[2rem] p-8 lg:p-10 border-[rgb(var(--fg-rgb)/5%)]">
              <h2 className="text-2xl font-bold text-[rgb(var(--fg-rgb))]">Why Choose Us</h2>
              <div className="mt-8 space-y-6">
                {[
                  { icon: "Target", title: "Pixel-Perfect Precision", desc: "Latest tools and techniques for flawless images." },
                  { icon: "Pen", title: "Hand-Drawn Paths", desc: "Manual precision, not automated processes." },
                  { icon: "Wallet", title: "Affordable Pricing", desc: "High-quality editing for businesses of all sizes." },
                  { icon: "Clock", title: "On-Time Delivery", desc: "Every project delivered on time, every time." },
                  { icon: "Gift", title: "Free Trial", desc: "Send 3-5 images. We'll edit them for free." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="text-xl shrink-0 mt-0.5 text-[rgb(var(--accent-400))]">{item.icon === "Target" ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> : item.icon === "Pen" ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> : item.icon === "Wallet" ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> : item.icon === "Clock" ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>}</span>
                    <div>
                      <h3 className="font-bold text-[rgb(var(--fg-rgb))] text-sm">{item.title}</h3>
                      <p className="mt-0.5 text-sm text-[rgb(var(--fg-rgb)/40%)]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[var(--bg-alt)]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6 text-center">Who We Are</h2>
          <p className="text-[rgb(var(--fg-rgb)/60%)] leading-relaxed text-center max-w-3xl mx-auto">
            PathPixHub was founded by a team of visionaries, each with years of specialized experience in different
            areas of the photo editing industry, who came together with one common purpose: to provide exceptional
            photo editing services accessible to businesses of all sizes. From humble beginnings, we&apos;ve grown into
            a company that prides itself on creativity, dedication, and a relentless commitment to quality.
          </p>
          <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed text-center max-w-3xl mx-auto">
            Our founders, each an expert in their field, bring together a diverse set of skills that make PathPixHub
            more than just a photo editing company — we are a trusted partner in the digital world, ensuring that
            every image we work on is perfected to the highest standard.
          </p>
        </div>
      </section>

      <section className="py-24 mesh-gradient">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6 text-center">Our Approach</h2>
          <p className="text-[rgb(var(--fg-rgb)/60%)] leading-relaxed text-center max-w-3xl mx-auto">
            We take a personalized approach to every project. Each business has its unique needs, and one-size-fits-all
            solutions rarely work — that&apos;s why we take the time to communicate with our clients, understand their
            objectives, and tailor our services to meet their specific needs. We are more than just a service
            provider; we are a trusted partner in your visual content strategy.
          </p>
        </div>
      </section>

      <section className="py-24 bg-[var(--bg)] text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Let&apos;s Work Together</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text">Ready to Get in Touch?</h3>
          <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)] max-w-xl mx-auto">
            Explore our services, request a quote, or contact us today to learn how we can help you achieve your
            photo editing goals.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </>
  );
}
