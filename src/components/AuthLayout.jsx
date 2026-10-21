import Logo from "./Logo";

export default function AuthLayout({ image = "/images/journey.jpg", imageSrcSet, alt, eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="auth-shell grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
      <div className="auth-form-panel flex items-start justify-center px-4 py-6 sm:px-8 lg:py-3">
        <div className="bubble-surface my-auto w-full max-w-md px-6 py-6 sm:px-8 lg:py-5">
          <Logo />
          <p className="eyebrow mt-5 flex text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {eyebrow}
          </p>
          <h1 className="mt-2 text-balance font-display text-3xl font-extrabold leading-tight sm:text-[2rem]">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">{subtitle}</p>
          <div className="mt-5">{children}</div>
          {footer ? <div className="mt-4 text-center text-sm text-ink-500">{footer}</div> : null}
        </div>
      </div>

      <div className="auth-visual relative hidden overflow-hidden bg-ink-950 lg:block">
        <img
          src={image}
          srcSet={imageSrcSet}
          sizes="(min-width: 1024px) 48vw, 100vw"
          alt={alt || "Indian railway journey"}
          width="1400"
          height="1867"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-ink-950/5" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/30 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8 text-white xl:p-10">
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
