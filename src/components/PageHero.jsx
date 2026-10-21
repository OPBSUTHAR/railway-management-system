export default function PageHero({ eyebrow, title, description, actions, children }) {
  return (
    <section className="relative px-3 pt-4 sm:px-5">
      <div className="bubble-surface relative mx-auto w-full max-w-[78rem] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="container-x relative py-12 sm:py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl border-l-4 border-amber-400 pl-5 sm:pl-6">
              {eyebrow ? (
                <span className="eyebrow text-amber-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  {eyebrow}
                </span>
              ) : null}
              <h1 className="mt-3 text-balance text-4xl font-bold leading-[1.02] sm:text-[52px]">{title}</h1>
              {description ? (
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-600 sm:text-base">{description}</p>
              ) : null}
            </div>
            {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-ink-200 pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500">
            <span>RailSetu · Station operations</span>
            <span>PF 01 · Demo network</span>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
