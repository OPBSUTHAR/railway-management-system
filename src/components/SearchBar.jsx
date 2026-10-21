import { useState } from "react";
import { ArrowLeftRight, CalendarDays, MapPin, Search } from "lucide-react";
import { STATION_LIST, CLASS_META } from "../data/railway";
import { todayISO } from "../lib/dates";

export default function SearchBar({ initial, onSubmit, className = "" }) {
  const [from, setFrom] = useState(initial?.from || "BCT");
  const [to, setTo] = useState(initial?.to || "NDLS");
  const [date, setDate] = useState(initial?.date || todayISO());
  const [classCode, setClassCode] = useState(initial?.classCode || "ANY");
  const [error, setError] = useState("");

  function swap() {
    setFrom(to);
    setTo(from);
  }

  function submit(event) {
    event.preventDefault();
    if (!from || !to) {
      setError("Choose both boarding and destination stations.");
      return;
    }
    if (from === to) {
      setError("Boarding and destination cannot be the same.");
      return;
    }
    setError("");
    onSubmit?.({ from, to, date, classCode });
  }

  return (
    <form onSubmit={submit} className={`rounded-2xl border border-white/60 bg-white p-3 shadow-2xl sm:p-4 ${className}`}>
      <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto_1.1fr_auto] md:items-end">
        <label className="relative block px-3 py-2">
          <span className="field-label flex items-center gap-1">
            <MapPin className="h-3 w-3 text-amber-500" /> From
          </span>
          <select
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="mt-1 w-full cursor-pointer appearance-none bg-transparent pr-2 font-display text-sm font-bold text-ink-900 outline-none"
          >
            {STATION_LIST.map((station) => (
              <option key={station.code} value={station.code}>
                {station.name} ({station.code})
              </option>
            ))}
          </select>
        </label>

        <div className="relative hidden items-center justify-center md:flex">
          <button
            type="button"
            onClick={swap}
            aria-label="Swap stations"
            className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 bg-white text-ink-500 transition hover:border-amber-400 hover:text-amber-600"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        </div>

        <label className="relative block border-t border-ink-100 px-3 py-2 md:border-l md:border-t-0">
          <span className="field-label flex items-center gap-1">
            <MapPin className="h-3 w-3 text-amber-500" /> To
          </span>
          <select
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="mt-1 w-full cursor-pointer appearance-none bg-transparent pr-2 font-display text-sm font-bold text-ink-900 outline-none"
          >
            {STATION_LIST.map((station) => (
              <option key={station.code} value={station.code}>
                {station.name} ({station.code})
              </option>
            ))}
          </select>
        </label>

        <label className="relative block border-t border-ink-100 px-3 py-2 md:border-l md:border-t-0">
          <span className="field-label flex items-center gap-1">
            <CalendarDays className="h-3 w-3 text-amber-500" /> Date
          </span>
          <input
            type="date"
            min={todayISO()}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="mt-1 w-full bg-transparent font-display text-sm font-bold text-ink-900 outline-none"
          />
        </label>

        <div className="flex gap-2 border-t border-ink-100 px-1 pt-2 md:border-none md:pt-0">
          <label className="block flex-1 px-2 py-2">
            <span className="field-label">Class</span>
            <select
              value={classCode}
              onChange={(event) => setClassCode(event.target.value)}
              className="mt-1 w-full cursor-pointer bg-transparent text-sm font-bold text-ink-900 outline-none"
            >
              <option value="ANY">Any class</option>
              {Object.entries(CLASS_META).map(([code, meta]) => (
                <option key={code} value={code}>
                  {code} · {meta.label}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn btn-amber shrink-0 self-center px-4 py-3 sm:px-5">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>
      {error ? <p className="px-3 pb-1 pt-2 text-xs font-medium text-rose-600">{error}</p> : null}
    </form>
  );
}
