import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Cursor from "@/components/Cursor";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "PathPixHub | Professional Photo Editing & Clipping Path Services",
  description:
    "Expert photo editing services including clipping path, background removal, image masking, ghost mannequin, retouching, and more. Fast turnaround, global delivery, pixel-perfect quality.",
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
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${jakarta.className} bg-[var(--bg)] text-[rgb(var(--fg-rgb))] antialiased`} suppressHydrationWarning>
        <div className="grain" />
        <Cursor />
        <Header />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
