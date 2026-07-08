import Image from "next/image";
import Link from "next/link";
import { services } from "@/data/services";

export default function Home() {
  return (
    <>
      <section className="relative w-full aspect-video max-h-[85vh] overflow-hidden">
        <video
          className="hero-video absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
            preload="metadata"
          poster="/images/image-masking-1.jpg"
        >
          <source src="/videos/beauty.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[rgb(var(--accent-500)/12%)] mix-blend-overlay pointer-events-none" />
      </section>

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

      <section className="py-24 lg:py-32 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">From Our Studio</h2>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text">Every Product, Every Angle</h3>
              <p className="mt-6 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed max-w-lg">
                Bicycles, vehicles, apparel, or accessories — whatever you shoot, we edit it with the
                same pixel-perfect care. A rotating look at a few recent categories we work with.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["Clipping Path", "Background Removal", "Shadow Creation", "Photo Retouching", "Beauty Airbrushing", "Car Image Editing"].map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full glass-card text-xs font-semibold text-[rgb(var(--fg-rgb)/70%)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:col-span-3 relative rounded-3xl overflow-hidden glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[var(--bg-subtle)]"
  style={{ aspectRatio: "1600 / 700", maxHeight: "40rem" }}
>
  {[
    { src: "/images/hero-slider/bicycle.jpg", alt: "Product photo editing showcase - bicycle", delay: "0s" },
    { src: "/images/hero-slider/car-editing-1.jpg", alt: "Product photo editing showcase - car", delay: "-8s" },
    { src: "/images/hero-slider/ecommerce-product.jpg", alt: "Product photo editing showcase - ecommerce product", delay: "-16s" },
  ].map((slide) => (
    <div key={slide.src} className="absolute inset-0 flex items-center justify-center" style={{ animation: "hero-fade 24s ease-in-out infinite", animationDelay: slide.delay }}>
      <Image
        src={slide.src}
        alt={slide.alt}
        width={1600}
        height={900}
        className="w-full h-full object-contain"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  ))}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => {
              const cardColors = ["#ef4444","#a855f7","#ec4899","#eab308","#3b82f6","#10b981","#f97316","#14b8a6","#6366f1","#f43f5e"];
              const ci = ["clipping-path","background-removal","shadow-creation","ghost-mannequin","image-masking","color-change","photo-retouching","multi-clipping-path","ecommerce-editing","car-editing"].indexOf(service.id) % cardColors.length;
              return (
              <Link
                key={service.id}
                href={`/services#${service.id}`}
                className="group rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                style={{ backgroundColor: cardColors[ci] }}
              >
                <div className="flex items-center gap-4 p-4 md:p-5">
                  <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
                    <Image
                      src={`/images/service-cards/${service.id}.png`}
                      alt={service.title}
                      fill
                      className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-700"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm md:text-base text-white leading-tight">{service.title}</h3>
                    <p className="mt-0.5 text-xs text-white/70 line-clamp-2">{service.tagline}</p>
                  </div>
                </div>
              </Link>
            )})}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-3xl overflow-hidden glass-card">
                <Image src="/images/before.jpg" alt="Editing" width={400} height={400} className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden glass-card mt-8">
                <Image src="/images/25RN718SOK_BEP-original.jpg" alt="Editing" width={400} height={400} className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden glass-card -mt-8">
                <Image src="/images/Ghost manipulation services.jpg" alt="Editing" width={400} height={400} className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden glass-card">
                <Image src="/images/before after.jpg" alt="Editing" width={400} height={400} className="w-full h-full object-cover" />
              </div>
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
                {[
                  { num: "200+", label: "Projects" },
                  { num: "24hr", label: "Turnaround" },
                  { num: "100%", label: "Quality" },
                  { num: "50+", label: "Clients" },
                ].map((s) => (
                  <div key={s.label} className="glass-card rounded-xl p-5">
                    <span className="text-2xl font-bold text-[rgb(var(--accent-400))]">{s.num}</span>
                    <p className="mt-1 text-sm text-[rgb(var(--fg-rgb)/40%)]">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Our Approach</h2>
            <h3 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Strategy</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              "Hand-drawn clipping paths for flawless results",
              "Bringing focus to your image with expert cutouts",
              "Transforming images with precision and care",
              "Enhancing photos with professional background removal",
              "Flawless cutouts for high-impact photos",
              "Enhancing the visual appeal of every image",
              "Facilitating complex image manipulations",
              "Highlighting vehicle features and details",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 glass-card rounded-2xl px-5 py-4">
                <svg className="w-5 h-5 text-[rgb(var(--accent-400))] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-[rgb(var(--fg-rgb)/70%)]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">How It Works</h2>
            <h3 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Our Process</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div key={item.step} className="glass-card rounded-[2rem] p-8 flex gap-6">
                <span className="text-4xl font-bold text-[rgb(var(--accent-500)/30%)] shrink-0">{item.step}</span>
                <div>
                  <h3 className="text-lg font-bold text-[rgb(var(--fg-rgb))]">{item.title}</h3>
                  <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/40%)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto px-6">
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
                a: "Turnaround times vary by service and project volume, but we aim to deliver most standard jobs within 24-48 hours. Contact us for specific timelines.",
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

      <section className="py-24 lg:py-32 mesh-gradient text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Ready to Start?</h2>
          <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)] text-lg max-w-xl mx-auto">
            Send us 3-5 images and we will edit them for free — no obligation.
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
