import Image from "next/image";
import Link from "next/link";
import { services } from "@/data/services";

export default function Home() {
  return (
    <>
      <section className="relative h-screen min-h-[640px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/image-masking-1.jpg"
          >
            <source src="/videos/masking-before-after-demo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[var(--bg)]/70" />
          <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/85 to-transparent" />
        </div>

        <div className="absolute bottom-8 right-6 lg:right-10 hidden sm:block">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[rgb(var(--fg-rgb))] bg-[rgb(var(--accent-600)/85%)] px-4 py-2 rounded-full backdrop-blur">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Real Masking Process — Before &amp; After
          </span>
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-6 pb-20 lg:pb-28 pt-40">
          <div className="max-w-2xl">
            <div className="hero-rise inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-[rgb(var(--accent-300))] text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-[rgb(var(--accent-400))] animate-pulse" />
              Professional Photo Editing Services
            </div>
            <h1 className="hero-rise [animation-delay:120ms] text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] text-[rgb(var(--fg-rgb))] [text-shadow:0_2px_24px_rgba(0,0,0,0.55)]">
              Transform Your Photos
              <br />
              <span className="text-[rgb(var(--accent-400))]">with Precision</span>
            </h1>
            <p className="hero-rise [animation-delay:240ms] mt-6 text-lg text-[rgb(var(--fg-rgb)/80%)] leading-relaxed max-w-lg [text-shadow:0_1px_16px_rgba(0,0,0,0.6)]">
              From flawless clipping paths to high-end retouching — pixel-perfect results
              with fast turnaround for e-commerce, fashion, and advertising.
            </p>
            <div className="hero-rise [animation-delay:360ms] mt-10 flex flex-col sm:flex-row items-center gap-4">
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

      <section className="py-24 lg:py-32 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">From Our Studio</h2>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text">Every Product, Every Angle</h3>
              <p className="mt-6 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed max-w-lg">
                Bicycles, vehicles, apparel, or accessories — whatever you shoot, we edit it with the
                same pixel-perfect care. A rotating look at a few recent categories we work with.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["Product Renders", "Automotive", "Color Accuracy", "Ghost Mannequin"].map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full glass-card text-xs font-semibold text-[rgb(var(--fg-rgb)/70%)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[26rem] rounded-3xl overflow-hidden glass-card border-[rgb(var(--fg-rgb)/10%)]">
              {[
                { src: "/images/bicycle.jpg", alt: "Product photo editing showcase - bicycle rendered in studio light", delay: "0s" },
                { src: "/images/car-editing-1.jpg", alt: "Product photo editing showcase - red sports car", delay: "-5s" },
              ].map((slide) => (
                <div key={slide.src} className="absolute inset-0 hero-slide" style={{ animationDelay: slide.delay }}>
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">What We Offer</h2>
            <h3 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Our Services</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <Link
                key={service.id}
                href={`/services#${service.id}`}
                className="group glass-card rounded-[2rem] overflow-hidden border border-[rgb(var(--fg-rgb)/5%)] hover:bg-[rgb(var(--fg-rgb)/5%)] transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden bg-[var(--bg-subtle)]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-700 opacity-90"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[rgb(var(--fg-rgb))] group-hover:text-[rgb(var(--accent-400))] transition-colors">{service.title}</h3>
                  <p className="mt-1.5 text-sm text-[rgb(var(--fg-rgb)/40%)]">{service.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-3xl overflow-hidden glass-card bg-[var(--bg-subtle)]">
                <Image src="/images/before.jpg" alt="Editing" width={400} height={400} className="w-full h-full object-contain p-2" />
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden glass-card mt-8 bg-[var(--bg-subtle)]">
                <Image src="/images/25RN718SOK_BEP-original.jpg" alt="Editing" width={400} height={400} className="w-full h-full object-contain p-2" />
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden glass-card -mt-8 bg-[var(--bg-subtle)]">
                <Image src="/images/ghost-manipulation-services.jpg" alt="Editing" width={400} height={400} className="w-full h-full object-contain p-2" />
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden glass-card bg-[var(--bg-subtle)]">
                <Image src="/images/before-after.jpg" alt="Editing" width={400} height={400} className="w-full h-full object-contain p-2" />
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
                ].map((s, i) => (
                  <div key={i} className="glass-card rounded-xl p-5">
                    <span className="text-2xl font-bold text-[rgb(var(--accent-400))]">{s.num}</span>
                    <p className="mt-1 text-sm text-[rgb(var(--fg-rgb)/40%)]">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">How It Works</h2>
            <h3 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Our Process</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Submit", desc: "Upload your images with guidelines." },
              { step: "02", title: "Analyze", desc: "We assess details and set timeline." },
              { step: "03", title: "Edit", desc: "Our editors manually perfect each image." },
              { step: "04", title: "Deliver", desc: "Receive polished images. Revisions included." },
            ].map((item, i) => (
              <div key={i} className="glass-card rounded-[2rem] p-8 text-center">
                <span className="text-5xl font-bold text-[rgb(var(--accent-500)/30%)] block mb-4">{item.step}</span>
                <h3 className="text-lg font-bold text-[rgb(var(--fg-rgb))]">{item.title}</h3>
                <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/40%)]">{item.desc}</p>
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
            ].map((item, i) => (
              <details key={i} className="faq-item glass-card rounded-2xl px-6 py-5 border-[rgb(var(--fg-rgb)/5%)]">
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
