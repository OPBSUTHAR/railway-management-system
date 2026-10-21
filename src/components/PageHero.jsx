export default function PageHero({ eyebrow, title, description, actions, children }) {
  return (
    <section className="relative overflow-hidden border-b border-white/60 bg-white/55 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
      <div className="container-x relative py-12 sm:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {eyebrow ? (
              <span className="eyebrow text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {eyebrow}
              </span>
            ) : null}
            <h1 className="mt-3 text-balance text-3xl font-bold leading-[1.08] sm:text-[44px]">{title}</h1>
            {description ? (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-500 sm:text-base">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
