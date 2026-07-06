import Link from "next/link";
import { Mail } from "lucide-react";
import { services } from "@/data/services";

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-alt)] border-t border-[rgb(var(--fg-rgb)/8%)]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <span className="logo-text text-xl font-bold text-[rgb(var(--fg-rgb))]">PathPixHub</span>
          <p className="mt-4 text-sm text-[rgb(var(--fg-rgb)/50%)] leading-relaxed max-w-xs">
            Professional photo editing for e-commerce, fashion, and advertising — pixel-perfect
            results, fast turnaround.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://www.facebook.com/profile.php?id=61572912172334"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="PathPixHub on Facebook"
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-[rgb(var(--fg-rgb)/70%)] hover:text-[rgb(var(--accent-400))] hover:border-[rgb(var(--accent-500)/50%)] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.16 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.78 8.44-4.94 8.44-9.94Z"/></svg>
            </a>
            <a
              href="https://www.linkedin.com/company/pathpixhub/about/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="PathPixHub on LinkedIn"
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-[rgb(var(--fg-rgb)/70%)] hover:text-[rgb(var(--accent-400))] hover:border-[rgb(var(--accent-500)/50%)] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 5a2 2 0 1 1-4-.02 2 2 0 0 1 4 .02ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-3.96 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.68-2.91V8.48Z"/></svg>
            </a>
            <a
              href="mailto:info@pathpixhub.com"
              aria-label="Email PathPixHub"
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-[rgb(var(--fg-rgb)/70%)] hover:text-[rgb(var(--accent-400))] hover:border-[rgb(var(--accent-500)/50%)] transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-[rgb(var(--fg-rgb)/40%)]">Services</span>
          <ul className="mt-5 space-y-3">
            {services.map((s) => (
              <li key={s.id}>
                <Link href={`/services#${s.id}`} className="text-sm text-[rgb(var(--fg-rgb)/60%)] hover:text-[rgb(var(--accent-400))] transition-colors">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-[rgb(var(--fg-rgb)/40%)]">Company</span>
          <ul className="mt-5 space-y-3">
            {[
              { name: "About", href: "/about" },
              { name: "Portfolio", href: "/portfolio" },
              { name: "Pricing", href: "/pricing" },
              { name: "Contact", href: "/contact" },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-[rgb(var(--fg-rgb)/60%)] hover:text-[rgb(var(--accent-400))] transition-colors">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-[rgb(var(--fg-rgb)/40%)]">Get in Touch</span>
          <ul className="mt-5 space-y-3">
            <li>
              <a href="mailto:info@pathpixhub.com" className="text-sm text-[rgb(var(--fg-rgb)/60%)] hover:text-[rgb(var(--accent-400))] transition-colors">
                info@pathpixhub.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[rgb(var(--fg-rgb)/8%)]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[rgb(var(--fg-rgb)/40%)]">© {new Date().getFullYear()} PathPixHub. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="text-xs text-[rgb(var(--fg-rgb)/40%)] hover:text-[rgb(var(--accent-400))] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-xs text-[rgb(var(--fg-rgb)/40%)] hover:text-[rgb(var(--accent-400))] transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
