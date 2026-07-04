import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <section className="pt-40 pb-20 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">About Us</h2>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Your Virtual Photo Editing Studio</h1>
            <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
              Our mission is to transform your images into works of art with precision, creativity, and
              unparalleled quality.
            </p>
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
                ].map((v, i) => (
                  <div key={i} className="glass-card rounded-xl p-5 border-[rgb(var(--fg-rgb)/5%)]">
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
                  { icon: "🎯", title: "Pixel-Perfect Precision", desc: "Latest tools and techniques for flawless images." },
                  { icon: "✏️", title: "Hand-Drawn Paths", desc: "Manual precision, not automated processes." },
                  { icon: "💰", title: "Affordable Pricing", desc: "High-quality editing for businesses of all sizes." },
                  { icon: "⏱️", title: "On-Time Delivery", desc: "Every project delivered on time, every time." },
                  { icon: "🆓", title: "Free Trial", desc: "Send 3-5 images. We'll edit them for free." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
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

      <section className="py-24 mesh-gradient text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text">Let's Work Together</h2>
          <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)]">Ready to take your images to the next level?</p>
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
