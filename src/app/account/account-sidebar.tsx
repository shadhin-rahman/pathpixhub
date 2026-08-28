"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarPromoCarousel from "./sidebar-promo-carousel";
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  FileText,
  Coins,
  Receipt,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";

const NAV = [
  { href: "/contact", label: "New order", icon: PlusCircle, highlighted: true },
  { href: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/quotes", label: "Quotes", icon: FileText },
  { href: "/account/credits", label: "Path credits", icon: Coins },
  { href: "/account/billing", label: "Billing", icon: Receipt },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

function NavItems({ role, pathname }: { role: string; pathname: string }) {
  return (
    <>
      {NAV.map((n) => {
        const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
        const Icon = n.icon;
        if (n.highlighted) {
          return (
            <Link
              key={n.href}
              href={n.href}
              className="inline-flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all whitespace-nowrap bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] hover:bg-[rgb(var(--accent-400))] shadow-lg shadow-[rgb(var(--accent-500)/20%)]"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {n.label}
            </Link>
          );
        }
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`inline-flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all whitespace-nowrap ${
              active
                ? "bg-[rgb(var(--accent-500)/12%)] text-[rgb(var(--accent-text))] border border-[rgb(var(--accent-500)/20%)]"
                : "text-[rgb(var(--fg-rgb)/60%)] hover:text-[rgb(var(--fg-rgb))] hover:bg-[rgb(var(--fg-rgb)/4%)] border border-transparent"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {n.label}
          </Link>
        );
      })}
      {role === "admin" && (
        <Link
          href="/admin"
          className="inline-flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all whitespace-nowrap text-[rgb(var(--fg-rgb)/60%)] hover:text-[rgb(var(--accent-text))] hover:bg-[rgb(var(--accent-500)/8%)] border border-transparent"
        >
          <ShieldCheck className="w-4 h-4 shrink-0" />
          Admin panel
        </Link>
      )}
    </>
  );
}

export default function AccountSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-8 flex flex-col gap-4">
          <div className="flex flex-col gap-1 glass-card rounded-3xl p-4">
            <NavItems role={role} pathname={pathname} />
            <form action="/auth/signout" method="post" className="mt-2 border-t border-[rgb(var(--fg-rgb)/10%)] pt-3">
              <button
                type="submit"
                className="w-full inline-flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all text-[rgb(var(--fg-rgb)/60%)] hover:text-red-400 hover:bg-red-500/5 cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Sign out
              </button>
            </form>
          </div>
          <SidebarPromoCarousel />
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="lg:hidden flex flex-col gap-4">
        <nav className="flex items-center gap-2 overflow-x-auto pb-2 -mx-6 px-6">
          <NavItems role={role} pathname={pathname} />
          <form action="/auth/signout" method="post" className="shrink-0">
            <button
              type="submit"
              className="inline-flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all text-[rgb(var(--fg-rgb)/60%)] hover:text-red-400 hover:bg-red-500/5 whitespace-nowrap cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign out
            </button>
          </form>
        </nav>
        <SidebarPromoCarousel />
      </div>
    </>
  );
}