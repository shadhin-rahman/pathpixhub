export default function ContactPage() {
  return (
    <>
      <section className="pt-40 pb-20 mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Contact</h2>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Get in Touch</h1>
            <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/60%)]">
              Request a free trial or get a custom quote. We will respond within 24 hours.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-32 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Name <span className="text-red-400">*</span></label>
                  <input type="text" name="name" id="name" required
                    className="w-full px-4 py-3 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-transparent text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm"
                    placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Email <span className="text-red-400">*</span></label>
                  <input type="email" name="email" id="email" required
                    className="w-full px-4 py-3 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-transparent text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm"
                    placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Service</label>
                <select name="subject" id="subject"
                  className="w-full px-4 py-3 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-[var(--bg-alt)] text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm">
                  <option value="" className="bg-[var(--bg-alt)]">Select a service</option>
                  <option className="bg-[var(--bg-alt)]">Clipping Path</option>
                  <option className="bg-[var(--bg-alt)]">Background Removal</option>
                  <option className="bg-[var(--bg-alt)]">Image Masking</option>
                  <option className="bg-[var(--bg-alt)]">Shadow Creation</option>
                  <option className="bg-[var(--bg-alt)]">Ghost Mannequin</option>
                  <option className="bg-[var(--bg-alt)]">Photo Retouching</option>
                  <option className="bg-[var(--bg-alt)]">General Inquiry</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[rgb(var(--fg-rgb)/70%)] mb-1.5">Message <span className="text-red-400">*</span></label>
                <textarea name="message" id="message" rows={5} required
                  className="w-full px-4 py-3 rounded-xl glass-card border-[rgb(var(--fg-rgb)/10%)] bg-transparent text-[rgb(var(--fg-rgb))] focus:border-[rgb(var(--accent-500)/50%)] outline-none transition-all text-sm resize-none"
                  placeholder="Tell us about your project..." />
              </div>
              <button type="submit"
                className="px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm">
                Send Message
              </button>
              <p className="text-xs text-[rgb(var(--fg-rgb)/30%)]">We will respond within 24 hours.</p>
            </form>

            <div className="space-y-6">
              <div className="glass-card rounded-[2rem] p-8 border-[rgb(var(--fg-rgb)/5%)]">
                <h2 className="text-lg font-bold text-[rgb(var(--fg-rgb))]">Contact Information</h2>
                <div className="mt-6 space-y-4">
                  {[
                    { icon: "📧", label: "Email", value: "info@pathpixhub.com" },
                    { icon: "📞", label: "Phone", value: "+880 1234-567890" },
                    { icon: "📍", label: "Location", value: "Dhaka, Bangladesh" },
                    { icon: "⏰", label: "Response", value: "Within 24 hours" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <p className="text-xs text-[rgb(var(--fg-rgb)/40%)]">{item.label}</p>
                        <p className="text-sm font-medium text-[rgb(var(--fg-rgb))]">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-[2rem] p-8 border-[rgb(var(--accent-500)/20%)] bg-[rgb(var(--accent-500)/5%)]">
                <h2 className="text-lg font-bold text-[rgb(var(--fg-rgb))]">Free Trial</h2>
                <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/60%)]">
                  Send us 3-5 images and we will edit them for free. No obligation.
                </p>
                <a href="mailto:info@pathpixhub.com"
                  className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm">
                  Request Free Trial
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
