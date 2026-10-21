import { useState } from "react";
import { ArrowLeftRight, CalendarDays, ChevronDown, MapPin, Search } from "lucide-react";
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
    <form onSubmit={submit} className={`search-bubble rounded-2xl p-3 shadow-2xl sm:p-4 ${className}`}>
      <div className="grid gap-2 md:grid-cols-[minmax(0,1.35fr)_auto_minmax(0,1.35fr)_minmax(0,1fr)_auto] md:items-end md:gap-0">
        <label className="relative block min-w-0 px-3 py-2">
          <span className="field-label flex items-center gap-1">
            <MapPin className="h-3 w-3 text-amber-500" /> From
          </span>
          <div className="relative">
            <select
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="mt-1 w-full min-w-0 cursor-pointer appearance-none bg-transparent pr-7 font-display text-[15px] font-semibold tracking-wide text-ink-950 outline-none"
            >
              {STATION_LIST.map((station) => (
                <option key={station.code} value={station.code}>
                  {station.name} ({station.code})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
          </div>
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

        <label className="relative block min-w-0 border-t border-ink-100 px-3 py-2 md:border-l md:border-t-0">
          <span className="field-label flex items-center gap-1">
            <MapPin className="h-3 w-3 text-amber-500" /> To
          </span>
          <div className="relative">
            <select
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="mt-1 w-full min-w-0 cursor-pointer appearance-none bg-transparent pr-7 font-display text-[15px] font-semibold tracking-wide text-ink-950 outline-none"
            >
              {STATION_LIST.map((station) => (
                <option key={station.code} value={station.code}>
                  {station.name} ({station.code})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
          </div>
        </label>

        <label className="relative block min-w-0 border-t border-ink-100 px-3 py-2 md:border-l md:border-t-0">
          <span className="field-label flex items-center gap-1">
            <CalendarDays className="h-3 w-3 text-amber-500" /> Date
          </span>
          <input
            type="date"
            min={todayISO()}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="mt-1 w-full min-w-0 bg-transparent font-display text-[15px] font-semibold tracking-wide text-ink-950 outline-none"
          />
        </label>

        <div className="flex min-w-0 gap-2 border-t border-ink-100 px-1 pt-2 md:border-none md:pt-0">
          <label className="block min-w-0 flex-1 px-2 py-2">
            <span className="field-label">Class</span>
            <select
              value={classCode}
              onChange={(event) => setClassCode(event.target.value)}
              className="mt-1 w-full min-w-0 cursor-pointer bg-transparent text-sm font-semibold text-ink-950 outline-none"
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
            <span>Search</span>
          </button>
        </div>
      </div>
      {error ? <p className="px-3 pb-1 pt-2 text-xs font-medium text-rose-600">{error}</p> : null}
    </form>
  );
}
