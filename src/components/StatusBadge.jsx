const TONES = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  sky: "border-sky-200 bg-sky-50 text-sky-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
  ink: "border-ink-200 bg-ink-50 text-ink-600",
};

const STATUS_TONE = {
  CONFIRMED: "emerald",
  CANCELLED: "rose",
  AVAILABLE: "emerald",
  WL: "amber",
  WAITLISTED: "amber",
  "On time": "emerald",
  Delayed: "amber",
  "Delayed by 20 min": "amber",
  Open: "sky",
  Resolved: "emerald",
  "In progress": "violet",
  Active: "emerald",
  "Not running": "ink",
};

export default function StatusBadge({ status, tone, dot = true, className = "" }) {
  const resolved = TONES[tone || STATUS_TONE[status] || "ink"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${resolved} ${className}`}
    >
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {status}
    </span>
  );
}
