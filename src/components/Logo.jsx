import { Link } from "react-router-dom";

export function LogoMark({ className = "" }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="RailSetu logo">
      <rect width="40" height="40" rx="12" fill="#0b1220" />
      <path d="M13.5 8.5v23M26.5 8.5v23" stroke="#fbbf24" strokeWidth="2.6" strokeLinecap="round" />
      <path
        d="M10.5 14.5h19M10.5 20h19M10.5 25.5h19"
        stroke="#fbbf24"
        strokeOpacity="0.55"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Logo({ dark = false, compact = false, className = "" }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-3 ${className}`}>
      <LogoMark className="h-10 w-10 shrink-0 transition-transform duration-300 group-hover:-rotate-6" />
      <span className="leading-none">
        <span
          className={`block font-display text-[19px] font-bold tracking-tight ${
            dark ? "text-white" : "text-ink-950"
          }`}
        >
          RailSetu
        </span>
        {!compact ? (
          <span
            className={`mt-1.5 hidden text-[9px] font-semibold uppercase tracking-[0.2em] min-[360px]:block ${
              dark ? "text-white/40" : "text-ink-400"
            }`}
          >
            Railway Management
          </span>
        ) : null}
      </span>
    </Link>
  );
}
