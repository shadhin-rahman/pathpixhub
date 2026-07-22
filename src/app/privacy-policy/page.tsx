export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="pt-40 pb-16 mesh-gradient">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Legal</h2>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Privacy Policy</h1>
          <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
            Protecting your privacy is our top priority. Here is how we collect, use, and safeguard your
            personal information when you interact with our website or use our services.
          </p>
        </div>
      </section>

      <section className="pb-32 bg-[var(--bg-alt)]">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-[rgb(var(--fg-rgb))]">Information We Collect</h2>
            <p className="mt-3 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">When you visit or use our services, we may collect:</p>
            <ul className="mt-3 space-y-2 text-sm text-[rgb(var(--fg-rgb)/60%)] list-disc list-inside">
              <li><strong className="text-[rgb(var(--fg-rgb))]">Personal Details:</strong> Name, email address, contact number, and other details provided through forms.</li>
              <li><strong className="text-[rgb(var(--fg-rgb))]">Project Information:</strong> Files, images, and project requirements submitted for editing.</li>
              <li><strong className="text-[rgb(var(--fg-rgb))]">Technical Data:</strong> IP address, browser type, and activity logs to improve website performance.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[rgb(var(--fg-rgb))]">How We Use Your Information</h2>
            <p className="mt-3 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">We use the information to:</p>
            <ul className="mt-3 space-y-2 text-sm text-[rgb(var(--fg-rgb)/60%)] list-disc list-inside">
              <li>Fulfill your requests for image editing and related services.</li>
              <li>Communicate about orders, offers, or updates.</li>
              <li>Enhance our website and services based on user feedback.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[rgb(var(--fg-rgb))]">Data Security</h2>
            <p className="mt-3 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
              Your data is securely stored and protected against unauthorized access. We do not share your files or
              personal information with third parties, except as required to deliver services or comply with legal
              obligations.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[rgb(var(--fg-rgb))]">Client Image Usage</h2>
            <ul className="mt-3 space-y-2 text-sm text-[rgb(var(--fg-rgb)/60%)] list-disc list-inside">
              <li><strong className="text-[rgb(var(--fg-rgb))]">Submitted Images:</strong> All images uploaded for paid services remain your property and will not be used elsewhere.</li>
              <li><strong className="text-[rgb(var(--fg-rgb))]">Free Trial Images:</strong> With permission, these may be featured in our portfolio unless otherwise specified by you.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[rgb(var(--fg-rgb))]">Cookies and Tracking</h2>
            <p className="mt-3 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
              We use cookies to enhance your browsing experience. Cookies help us analyze web traffic and personalize
              content. You can manage cookie preferences in your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[rgb(var(--fg-rgb))]">Third-Party Services</h2>
            <p className="mt-3 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
              Our contact form is powered by <strong className="text-[rgb(var(--fg-rgb))]">Formspree</strong>, a third-party service that processes and delivers your inquiries to us. Formspree has its own privacy policy and does not use your data for any purpose other than relaying messages.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[rgb(var(--fg-rgb))]">External Links</h2>
            <p className="mt-3 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
              Our website may contain links to third-party sites. We are not responsible for the privacy practices of
              these websites.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[rgb(var(--fg-rgb))]">Your Rights</h2>
            <p className="mt-3 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
              You can request to view, update, or delete your personal data by contacting us. We are committed to
              ensuring your data&apos;s accuracy and security.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[rgb(var(--fg-rgb))]">Updates to This Policy</h2>
            <p className="mt-3 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
              We may update this Privacy Policy periodically. Any changes will be reflected on this page, and your
              continued use of the site signifies your agreement to these updates.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border-[rgb(var(--fg-rgb)/5%)]">
            <h2 className="text-lg font-bold text-[rgb(var(--fg-rgb))]">Contact Us</h2>
            <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/60%)]">
              For questions about our Privacy Policy or how we handle your data, please email us at{" "}
              <a href="mailto:info@pathpixhub.com" className="text-[rgb(var(--accent-400))] hover:text-[rgb(var(--accent-300))]">
                info@pathpixhub.com
              </a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
