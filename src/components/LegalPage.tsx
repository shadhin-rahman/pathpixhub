interface LegalSection {
  title: string;
  body?: string[];
  list?: string[];
  footer?: string;
}

interface LegalPageProps {
  effectiveDate: string;
  title: React.ReactNode;
  intro: string;
  contentsIntro?: string;
  sections: LegalSection[];
  version?: string;
  contactIntro?: string;
}

export default function LegalPage({
  effectiveDate,
  title,
  intro,
  contentsIntro,
  sections,
  version,
  contactIntro,
}: LegalPageProps) {
  return (
    <>
      <section className="relative pt-40 pb-24 overflow-hidden bg-[#081526]">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(900px 500px at 85% -10%, rgba(16, 185, 129, 0.10), transparent 60%), radial-gradient(700px 400px at 0% 110%, rgba(30, 64, 175, 0.25), transparent 60%)",
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--accent-500)/50%)] to-transparent" />
        <div className="relative max-w-5xl mx-4 md:mx-10 px-0">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold">Legal</span>
            <span className="text-xs uppercase font-mono tracking-[0.2em] text-white/40 font-bold">Effective {effectiveDate}</span>
          </div>
          <h1 className="logo-text text-6xl md:text-7xl lg:text-9xl font-extrabold tracking-tight text-white leading-[0.95] text-balance text-left">
            {title}
          </h1>
          <div className="mt-6 w-24 h-1 rounded-full bg-[rgb(var(--accent-500))]" />
          <p className="mt-8 text-lg text-white/60 leading-relaxed">
            {intro}
          </p>
        </div>
      </section>

      <section className="pb-32 bg-[var(--bg-alt)]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="glass-card rounded-3xl p-8 border-[rgb(var(--fg-rgb)/5%)] mb-14">
            <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-[rgb(var(--accent-400))] mb-6">Contents</h2>
            {contentsIntro && (
              <p className="text-sm text-[rgb(var(--fg-rgb)/50%)] leading-relaxed mb-6">{contentsIntro}</p>
            )}
            <ol className="space-y-3">
              {sections.map((s, i) => (
                <li key={s.title}>
                  <a
                    href={`#section-${i + 1}`}
                    className="group flex items-baseline gap-3 text-[rgb(var(--fg-rgb)/60%)] hover:text-[rgb(var(--accent-400))] transition-colors"
                  >
                    <span className="font-mono text-sm text-[rgb(var(--accent-400)/60%)] shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold group-hover:translate-x-1 transition-transform">
                      {s.title}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-12">
            {sections.map((s, i) => (
              <div key={s.title} id={`section-${i + 1}`} className="scroll-mt-32">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-mono text-sm text-[rgb(var(--accent-400))] shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-2xl font-bold text-[rgb(var(--fg-rgb))] tracking-tight">{s.title}</h2>
                </div>
                <div className="pl-9 space-y-4">
                  {s.body?.map((p, pi) => (
                    <p key={pi} className="text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">{p}</p>
                  ))}
                  {s.list && (
                    <ul className="space-y-2.5 text-[rgb(var(--fg-rgb)/60%)]">
                      {s.list.map((item, li) => (
                        <li key={li} className="flex items-start gap-3 leading-relaxed">
                          <svg className="w-5 h-5 text-[rgb(var(--accent-400))] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.footer && (
                    <p className="text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">{s.footer}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {version && (
            <div className="mt-16 pt-6 border-t border-[rgb(var(--fg-rgb)/10%)]">
              <p className="text-xs text-[rgb(var(--fg-rgb)/40%)] font-mono tracking-[0.2em] uppercase">
                Document Version — {version}
              </p>
            </div>
          )}

          <div className="glass-card rounded-3xl p-8 border-[rgb(var(--fg-rgb)/5%)] mt-12">
            <h2 className="text-lg font-bold text-[rgb(var(--fg-rgb))]">Need a clarification on any clause?</h2>
            <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
              {contactIntro ?? "Email our legal team and we will get back to you."}
            </p>
            <a
              href="mailto:info@pathpixhub.com"
              className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold text-sm hover:bg-[rgb(var(--accent-400))] transition-all"
            >
              Email Legal Team
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
