import Logo from "./Logo";

export default function AuthLayout({ image = "/images/journey.jpg", alt, eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-[1fr_0.9fr]">
      <div className="flex items-center justify-center px-5 py-12 sm:px-8 sm:py-16">
        <div className="w-full max-w-md">
          <Logo />
          <p className="eyebrow mt-8 flex text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {eyebrow}
          </p>
          <h1 className="mt-3 text-balance font-display text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-6 text-center text-sm text-ink-500">{footer}</div> : null}
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
        <img src={image} alt={alt || "Indian railway journey"} className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-white">
          <div className="mb-6 flex gap-6">
            <div>
              <p className="font-display text-2xl font-extrabold text-amber-300">22</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-300">Train services</p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-amber-300">40+</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-300">Stations</p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-amber-300">24/7</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-300">Support</p>
            </div>
          </div>
          <p className="max-w-sm font-display text-xl font-semibold leading-snug text-balance">
            "The journey is the reward — we just make the booking part effortless."
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-ink-400">RailSetu · Railway Management</p>
        </div>
      </div>
    </div>
  );
}
