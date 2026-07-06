import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center mesh-gradient">
      <div className="text-center max-w-md mx-auto px-6">
        <span className="text-8xl font-bold text-[rgb(var(--accent-500)/20%)]">404</span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight gradient-text">Page Not Found</h1>
        <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)]">This page has moved or doesn&apos;t exist.</p>
        <Link href="/" className="mt-8 inline-flex items-center px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm">
          Back to Home
        </Link>
      </div>
    </section>
  );
}