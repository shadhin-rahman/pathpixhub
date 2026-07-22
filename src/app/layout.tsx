import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Cursor from "@/components/Cursor";
import IntroAnimation from "@/components/IntroAnimation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import CookieConsent from "@/components/CookieConsent";
import WhatsAppChat from "@/components/WhatsAppChat";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "PathPixHub | Professional Photo Editing & Clipping Path Services",
  description:
    "Expert photo editing services including clipping path, background removal, image masking, ghost mannequin, retouching, and more. Fast turnaround, global delivery, pixel-perfect quality.",
  icons: { icon: "/images/logo.png" },
};

export const viewport = {
  themeColor: "#faf9f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
  <head>
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.removeAttribute('data-theme');else document.documentElement.setAttribute('data-theme','light');}catch(e){}})();`,
      }}
    />
  </head>
      <body className={`${jakarta.className} bg-[var(--bg)] text-[rgb(var(--fg-rgb))] antialiased`} suppressHydrationWarning>
        <div className="grain" />
        <IntroAnimation />
        <Cursor />
        <Header />
        <a href="#main-content" className="fixed -top-full left-4 z-[9999] px-4 py-2 bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] text-sm font-bold rounded-b-lg focus:top-0 transition-all duration-300 outline-none">
          Skip to main content
        </a>
        <main id="main-content" className="min-h-screen">{children}</main>
        <Footer />
        <ScrollToTop />
        <WhatsAppChat />
        <CookieConsent />
      </body>
    </html>
  );
}
