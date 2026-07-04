import Link from "next/link";

export default function PricingPage() {
  return (
    <>
      <section className="pt-40 pb-20 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Pricing</h2>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Simple Pricing</h1>
            <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/60%)]">Based on complexity. Contact us for a custom quote.</p>
          </div>
        </div>
      </section>

      <section className="pb-32 bg-[var(--bg-alt)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-[2rem] p-8 border-[rgb(var(--fg-rgb)/5%)]">
              <span className="text-xs font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold">Simple</span>
              <h3 className="mt-3 text-2xl font-bold text-[rgb(var(--fg-rgb))]">Easy Edits</h3>
              <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/40%)]">Basic clipping, simple background removal, standard shadows</p>
              <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--accent-400))] hover:text-[rgb(var(--accent-300))]">
                Get Quote <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
            <div className="glass-card rounded-[2rem] p-8 border-[rgb(var(--accent-500)/30%)] bg-[rgb(var(--accent-500)/5%)] relative">
              <span className="absolute -top-3 left-6 px-3 py-1 bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] text-xs font-bold rounded-full">Popular</span>
              <span className="text-xs font-mono tracking-[0.4em] text-amber-400 font-bold">Standard</span>
              <h3 className="mt-3 text-2xl font-bold text-[rgb(var(--fg-rgb))]">Medium Editing</h3>
              <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/40%)]">Masking, ghost mannequin, multi-path, retouching</p>
              <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--accent-400))] hover:text-[rgb(var(--accent-300))]">
                Get Quote <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
            <div className="glass-card rounded-[2rem] p-8 border-[rgb(var(--fg-rgb)/5%)]">
              <span className="text-xs font-mono tracking-[0.4em] text-red-400 font-bold">Complex</span>
              <h3 className="mt-3 text-2xl font-bold text-[rgb(var(--fg-rgb))]">Advanced Editing</h3>
              <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/40%)]">Complex masking, intricate multi-path, high-end retouching</p>
              <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--accent-400))] hover:text-[rgb(var(--accent-300))]">
                Get Quote <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>

          <div className="mt-12 glass-card rounded-[2rem] p-10 text-center border-[rgb(var(--accent-500)/10%)]">
            <h2 className="text-2xl font-bold text-[rgb(var(--fg-rgb))]">Need Volume Pricing?</h2>
            <p className="mt-3 text-[rgb(var(--fg-rgb)/60%)]">Contact us for bulk discounts or custom packages.</p>
            <Link href="/contact" className="mt-6 inline-block px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
