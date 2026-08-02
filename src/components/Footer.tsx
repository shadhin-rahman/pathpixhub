"use client";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { services } from "@/data/services";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "start 0.25"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["18%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [0.35, 1]);

  return (
    <motion.footer
      ref={footerRef}
      style={{ y, opacity }}
      className="relative overflow-hidden bg-[#081526] text-white"
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 500px at 85% -10%, rgba(16, 185, 129, 0.10), transparent 60%), radial-gradient(700px 400px at 0% 110%, rgba(30, 64, 175, 0.25), transparent 60%)",
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--accent-500)/50%)] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <span className="logo-text text-2xl font-bold text-white">PathPixHub</span>
            <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-sm">
              Professional photo editing for e-commerce, fashion, and advertising — pixel-perfect
              results with 12hr turnaround. Trusted by studios worldwide.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-white/70">
                <Mail className="w-4 h-4 text-[rgb(var(--accent-400))]" />
                <a href="mailto:info@pathpixhub.com" className="hover:text-[rgb(var(--accent-400))] transition-colors">info@pathpixhub.com</a>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/70">
                <Phone className="w-4 h-4 text-[rgb(var(--accent-400))]" />
                <span>+880 0000 000 000</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/70">
                <MapPin className="w-4 h-4 text-[rgb(var(--accent-400))]" />
                <span>Uttara-1230, Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-white/40">Services</span>
            <ul className="mt-5 space-y-2.5">
              {services.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link href={`/services/${s.id}`} className="text-sm text-white/60 hover:text-[rgb(var(--accent-400))] transition-colors">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-white/40">&nbsp;</span>
            <ul className="mt-5 space-y-2.5">
              {services.slice(5, 10).map((s) => (
                <li key={s.id}>
                  <Link href={`/services/${s.id}`} className="text-sm text-white/60 hover:text-[rgb(var(--accent-400))] transition-colors">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-white/40">Company</span>
            <ul className="mt-5 space-y-2.5">
              {[
                { name: "About", href: "/about" },
                { name: "Portfolio", href: "/portfolio" },
                { name: "Pricing", href: "/pricing" },
                { name: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-[rgb(var(--accent-400))] transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-white/40">Policies</span>
            <ul className="mt-5 space-y-2.5">
              <li>
                <Link href="/privacy-policy" className="text-sm text-white/60 hover:text-[rgb(var(--accent-400))] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-sm text-white/60 hover:text-[rgb(var(--accent-400))] transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/subscription" className="text-sm text-white/60 hover:text-[rgb(var(--accent-400))] transition-colors">
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link href="/free-trial" className="text-sm text-white/60 hover:text-[rgb(var(--accent-400))] transition-colors">
                  Free Trial
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} PathPixHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=61572912172334"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-[rgb(var(--accent-500)/60%)] hover:bg-[rgb(var(--accent-500)/10%)] transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.16 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.78 8.44-4.94 8.44-9.94Z"/></svg>
            </a>
            <a
              href="https://www.linkedin.com/company/pathpixhub/about/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-[rgb(var(--accent-500)/60%)] hover:bg-[rgb(var(--accent-500)/10%)] transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 5a2 2 0 1 1-4-.02 2 2 0 0 1 4 .02ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-3.96 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.68-2.91V8.48Z"/></svg>
            </a>
            <a
              href="https://www.instagram.com/pathpixhub/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-[rgb(var(--accent-500)/60%)] hover:bg-[rgb(var(--accent-500)/10%)] transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.64.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.67-4.77 4.92-4.92 1.27-.06 1.64-.07 4.85-.07zm0-2.16c-3.26 0-3.67.01-4.95.07-4.1.19-5.95 2.04-6.14 6.14C.8 8.33.79 8.74.79 12s.01 3.67.07 4.95c.19 4.1 2.04 5.95 6.14 6.14 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.1-.19 5.95-2.04 6.14-6.14.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.19-4.1-2.04-5.95-6.14-6.14C15.67.01 15.26 0 12 0zM12 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zm0 10.16a4 4 0 110-8 4 4 0 010 8zm6.41-10.4a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/30">
            Every Pixel Matters
          </p>
          <div className="flex items-center gap-5 text-[10px] tracking-[0.15em] uppercase text-white/30">
            <Link href="/privacy-policy" className="hover:text-[rgb(var(--accent-400))] transition-colors">Privacy</Link>
            <Link href="/terms-and-conditions" className="hover:text-[rgb(var(--accent-400))] transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-[rgb(var(--accent-400))] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
