"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronLeft } from "lucide-react";
import { services } from "@/data/services";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuView, setMenuView] = useState<"main" | "services">("main");
  const pathname = usePathname();

  const openMenu = () => { setIsOpen(true); setMenuView("main"); };
  const closeMenu = () => { setIsOpen(false); setMenuView("main"); };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 py-4 md:py-6">
      <div className="flex justify-between items-center">
        <Link
          href="/"
          className={isOpen ? "z-40" : "z-[60]"}
          onClick={(e) => { if (pathname === "/") { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
        >
          <Image
            src="/images/logo.png"
            alt="PathPixHub"
            width={140}
            height={140}
            className="h-14 md:h-16 lg:h-20 w-auto [filter:var(--logo-filter)] ml-4 md:ml-10"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-3 pr-4 md:pr-10">
          <ThemeToggle className="w-11 h-11 rounded-full glass-card text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/50%)] hover:text-[rgb(var(--accent-400))]" />
          <Link
            href="/contact"
            className="px-8 py-4 rounded-full bg-[#c7ea46] text-white font-black hover:bg-[rgb(var(--accent-500))] hover:text-[rgb(var(--accent-contrast))] transition-all duration-300 text-xs uppercase tracking-[0.4em] whitespace-nowrap"
          >
            Let's Talk
          </Link>
          <button
            onClick={() => { if (isOpen) closeMenu(); else openMenu(); }}
            className={`group flex items-center gap-4 px-8 py-4 rounded-full transition-all duration-500 z-[60] border ${
              isOpen
                ? "bg-[var(--bg)] text-[rgb(var(--fg-rgb))] border-[rgb(var(--fg-rgb)/20%)]"
                : "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] border-transparent hover:bg-[rgb(var(--accent-400))]"
            }`}
          >
            <span className="text-xs uppercase tracking-[0.4em] font-black">
              {isOpen ? "Close" : "Menu"}
            </span>
            <div className="relative w-5 h-5">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                className="absolute top-1/2 left-0 w-5 h-[2px] bg-current block"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
                className="absolute top-1/2 left-0 w-5 h-[2px] bg-current block"
              />
            </div>
          </button>
        </div>

        <div className="md:hidden flex items-center gap-1.5 pr-4">
          <ThemeToggle className="w-8 h-8 rounded-full glass-card text-[rgb(var(--fg-rgb))] hover:text-[rgb(var(--accent-400))]" />
          <Link
            href="/contact"
            className="px-3 py-2.5 rounded-full bg-[#c7ea46] text-white font-black hover:bg-[rgb(var(--accent-500))] hover:text-[rgb(var(--accent-contrast))] transition-all duration-300 text-[10px] uppercase tracking-[0.2em] whitespace-nowrap"
          >
            Let's Talk
          </Link>
          <button
            onClick={() => { if (isOpen) closeMenu(); else openMenu(); }}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="z-[60] p-3 rounded-2xl bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] border border-transparent"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[55]"
              onClick={closeMenu}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full md:w-[500px] bg-[var(--bg-alt)] border-l border-[rgb(var(--fg-rgb)/5%)] z-[56] p-8 md:p-12 flex flex-col justify-center overflow-y-auto"
            >
              <div className="mb-10 md:mb-12">
                <span className="text-[rgb(var(--accent-400))] text-xs uppercase tracking-[0.5em] font-bold">Navigation</span>
              </div>

              <AnimatePresence mode="wait">
                {menuView === "main" ? (
                  <motion.div
                    key="main"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-7 md:space-y-8"
                  >
                    <Link
                      href="/"
                      onClick={closeMenu}
                      className="block font-bold text-3xl md:text-5xl text-[rgb(var(--fg-rgb))] hover:text-[rgb(var(--accent-500))] transition-colors tracking-tighter"
                    >
                      Home
                    </Link>

                    <div>
                      <button
                        onClick={() => setMenuView("services")}
                        className="w-full flex items-center justify-between gap-4 font-bold text-3xl md:text-5xl text-[rgb(var(--fg-rgb))] hover:text-[rgb(var(--accent-500))] transition-colors tracking-tighter"
                      >
                        <span>Services</span>
                        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 rotate-180 text-[rgb(var(--fg-rgb)/40%)]" />
                      </button>
                    </div>

                    {[
                      { name: "Portfolio", href: "/portfolio" },
                      { name: "Pricing", href: "/pricing" },
                      { name: "About", href: "/about" },
                      { name: "Contact", href: "/contact" },
                    ].map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={closeMenu}
                        className="block font-bold text-3xl md:text-5xl text-[rgb(var(--fg-rgb))] hover:text-[rgb(var(--accent-500))] transition-colors tracking-tighter"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="services"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-7 md:space-y-8"
                  >
                    <button
                      onClick={() => setMenuView("main")}
                      className="flex items-center gap-2 text-[rgb(var(--accent-400))] hover:text-[rgb(var(--accent-300))] transition-colors group"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span className="text-xs uppercase tracking-[0.5em] font-bold">Back</span>
                    </button>

                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-[rgb(var(--fg-rgb)/60%)]">
                      <span className="text-[rgb(var(--accent-400))]">All Services</span>
                      <span className="text-[rgb(var(--fg-rgb)/30%)] ml-2 text-base font-normal">({services.length})</span>
                    </h3>

                    <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-2">
                      {services.map((s) => (
                        <Link
                          key={s.id}
                          href={`/services#${s.id}`}
                          onClick={closeMenu}
                          className="block text-base md:text-xl font-semibold text-[rgb(var(--fg-rgb)/60%)] hover:text-[rgb(var(--accent-400))] transition-colors py-1.5"
                        >
                          {s.title}
                        </Link>
                      ))}
                      <Link
                        href="/services"
                        onClick={closeMenu}
                        className="inline-flex items-center gap-1.5 pt-2 text-sm font-bold text-[rgb(var(--accent-400))] hover:text-[rgb(var(--accent-300))] transition-colors"
                      >
                        View all services
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-12 pt-8 border-t border-[rgb(var(--fg-rgb)/10%)] space-y-6 shrink-0">
                <span className="text-[rgb(var(--fg-rgb)/50%)] text-xs uppercase tracking-[0.5em] font-bold block">Get in touch</span>
                <a href="mailto:info@pathpixhub.com" className="text-[rgb(var(--fg-rgb))] hover:text-[rgb(var(--accent-500))] transition-colors block text-xl font-medium">
                  info@pathpixhub.com
                </a>
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.facebook.com/profile.php?id=61572912172334"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="PathPixHub on Facebook"
                    className="w-11 h-11 rounded-full glass-card flex items-center justify-center text-[rgb(var(--fg-rgb)/70%)] hover:text-[rgb(var(--accent-400))] transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.16 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.78 8.44-4.94 8.44-9.94Z"/></svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/pathpixhub/about/?viewAsMember=true"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="PathPixHub on LinkedIn"
                    className="w-11 h-11 rounded-full glass-card flex items-center justify-center text-[rgb(var(--fg-rgb)/70%)] hover:text-[rgb(var(--accent-400))] transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 5a2 2 0 1 1-4-.02 2 2 0 0 1 4 .02ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-3.96 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.68-2.91V8.48Z"/></svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
