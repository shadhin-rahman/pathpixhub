import Image from "next/image";
import Link from "next/link";
import { services } from "@/data/services";

export default function Home() {
  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden mesh-gradient">
        <div className="premium-blur w-[600px] h-[600px] top-[-10%] right-[-10%]" />
        <div className="premium-blur w-[400px] h-[400px] bottom-[-10%] left-[-10%]" />
        <div className="relative w-full max-w-7xl mx-auto px-6 py-32 lg:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-[rgb(var(--accent-300))] text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-[rgb(var(--accent-400))] animate-pulse" />
                Professional Photo Editing Services
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95]">
                <span className="gradient-text">Transform Your</span>
                <br />
                <span className="text-[rgb(var(--accent-400))]">Photos</span>
                <br />
                <span className="gradient-text">with Precision</span>
              </h1>
              <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed max-w-lg">
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
            <div className="relative lg:h-[30rem] grid grid-cols-2 gap-4">
              <div className="relative row-span-2 rounded-3xl overflow-hidden glass-card border-[rgb(var(--fg-rgb)/10%)]">
                <Image
                  src="/images/bicycle.jpg"
                  alt="Product photo editing showcase - bicycle"
                  fill
                  sizes="(max-width: 1024px) 50vw, 30vw"
                  className="object-cover ken-burns"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[rgb(var(--fg-rgb))] bg-[rgb(var(--accent-600)/90%)] px-3 py-1.5 rounded-full backdrop-blur">
                    Before & After
                  </span>
                </div>
              </div>
              <div className="relative rounded-3xl overflow-hidden glass-card border-[rgb(var(--fg-rgb)/10%)]">
                <Image
                  src="/images/25RN718SOK_BEP-original.jpg"
                  alt="Product photo editing showcase"
                  fill
                  sizes="(max-width: 1024px) 50vw, 22vw"
                  className="object-cover ken-burns ken-burns-delay"
                />
              </div>
              <div className="relative rounded-3xl overflow-hidden glass-card border-[rgb(var(--fg-rgb)/10%)]">
                <Image
                  src="/images/Ghost manipulation services.jpg"
                  alt="Product photo editing showcase"
                  fill
                  sizes="(max-width: 1024px) 50vw, 22vw"
                  className="object-cover ken-burns"
                />
              </div>
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
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
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
