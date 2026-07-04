"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { services } from "@/data/services";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) setServicesOpen(false);
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="z-[60]">
          <Image
            src="/images/logo.png"
            alt="PathPixHub"
            width={140}
            height={140}
            className="h-16 lg:h-20 w-auto [filter:var(--logo-filter)]"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle className="w-11 h-11 rounded-full glass-card text-[rgb(var(--fg-rgb))] hover:border-[rgb(var(--accent-500)/50%)] hover:text-[rgb(var(--accent-400))]" />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`group flex items-center gap-4 px-8 py-4 rounded-full transition-all duration-500 z-[60] border ${
              isOpen
                ? "bg-white text-black border-white"
                : "bg-black/20 backdrop-blur-md text-white border-white/10 hover:border-[rgb(var(--accent-500)/50%)] hover:bg-[rgb(var(--accent-500)/5%)]"
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

        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle className="w-12 h-12 rounded-2xl glass-card text-[rgb(var(--fg-rgb))]" />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="z-[60] p-4 glass-card rounded-2xl text-[rgb(var(--fg-rgb))] border border-[rgb(var(--fg-rgb)/10%)]"
          >
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
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
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full md:w-[500px] bg-[var(--bg-alt)] border-l border-[rgb(var(--fg-rgb)/5%)] z-[56] p-12 flex flex-col justify-center overflow-y-auto"
            >
              <div className="space-y-8">
                <span className="text-[rgb(var(--accent-400))] text-xs uppercase tracking-[0.5em] font-bold block mb-6">Navigation</span>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="block font-bold text-4xl md:text-5xl text-[rgb(var(--fg-rgb))] hover:text-[rgb(var(--accent-500))] transition-colors tracking-tighter"
                  >
                    Home
                  </Link>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    aria-expanded={servicesOpen}
                    className="w-full flex items-center justify-between gap-4 font-bold text-4xl md:text-5xl text-[rgb(var(--fg-rgb))] hover:text-[rgb(var(--accent-500))] transition-colors tracking-tighter"
                  >
                    Services
                    <motion.span animate={{ rotate: servicesOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown className="w-7 h-7 md:w-8 md:h-8" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {servicesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-5 pl-6 border-l border-[rgb(var(--fg-rgb)/10%)] ml-2 space-y-4">
                          {services.map((s) => (
                            <Link
                              key={s.id}
                              href={`/services#${s.id}`}
                              onClick={() => setIsOpen(false)}
                              className="block text-lg md:text-xl font-semibold text-[rgb(var(--fg-rgb)/60%)] hover:text-[rgb(var(--accent-400))] transition-colors"
                            >
                              {s.title}
                            </Link>
                          ))}
                          <Link
                            href="/services"
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1.5 pt-2 text-sm font-bold text-[rgb(var(--accent-400))] hover:text-[rgb(var(--accent-300))] transition-colors"
                          >
                            View all services
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {[
                  { name: "Portfolio", href: "/portfolio" },
                  { name: "Pricing", href: "/pricing" },
                  { name: "About", href: "/about" },
                  { name: "Contact", href: "/contact" },
                ].map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + 0.05 * i }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block font-bold text-4xl md:text-5xl text-[rgb(var(--fg-rgb))] hover:text-[rgb(var(--accent-500))] transition-colors tracking-tighter"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-20 pt-10 border-t border-[rgb(var(--fg-rgb)/10%)] space-y-8">
                <span className="text-[rgb(var(--fg-rgb)/50%)] text-xs uppercase tracking-[0.5em] font-bold block">Get in touch</span>
                <a href="mailto:info@pathpixhub.com" className="text-[rgb(var(--fg-rgb))] hover:text-[rgb(var(--accent-500))] transition-colors block text-xl font-medium">
                  info@pathpixhub.com
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
