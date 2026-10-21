import { Check } from "lucide-react";

export default function Stepper({ steps, current }) {
  return (
    <ol className="flex flex-wrap items-center gap-2 sm:gap-3">
      {steps.map((step, index) => {
        const number = index + 1;
        const done = number < current;
        const active = number === current;
        return (
          <li key={step} className="flex items-center gap-2 sm:gap-3">
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-bold transition ${
                done
                  ? "border-emerald-200 bg-emerald-500 text-white"
                  : active
                    ? "border-ink-900 bg-ink-900 text-white"
                    : "border-ink-200 bg-white text-ink-400"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : number}
            </span>
            <span
              className={`text-xs font-semibold ${
                active ? "text-ink-900" : done ? "text-emerald-700" : "text-ink-400"
              } ${active ? "" : "hidden sm:inline"}`}
            >
              {step}
            </span>
            {index < steps.length - 1 ? (
              <span className={`hidden h-px w-6 sm:block ${done ? "bg-emerald-300" : "bg-ink-200"}`} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
