import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarPlus, CheckCircle2, Clock3, Plus, RefreshCw, Trash2, TrainFront, TriangleAlert } from "lucide-react";
import PageHero from "../components/PageHero";
import StatusBadge from "../components/StatusBadge";
import { useToast } from "../context/ToastContext";
import { CLASS_META, STATION_LIST, TRAINS, getStation } from "../data/railway";
import { addDays, formatTime12, todayISO } from "../lib/dates";
import { KEYS, read, write } from "../lib/storage";

const STATUS_OPTIONS = ["On time", "Delayed", "Not running"];

function railDistance(fromCode, toCode) {
  const from = getStation(fromCode);
  const to = getStation(toCode);
  if (!from.lat || !to.lat) return 250;
  const radius = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((from.lat * Math.PI) / 180) * Math.cos((to.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1.28);
}

const DEFAULT_FORM = {
  number: "",
  name: "",
  from: "CAN",
  to: "MAJN",
  dep: "06:30",
  arr: "10:45",
  classes: ["SL", "3A"],
};

export default function Scheduling() {
  const toast = useToast();
  const [statuses, setStatuses] = useState(() => read(KEYS.statuses, {}));
  const [customTrains, setCustomTrains] = useState(() => read(KEYS.customTrains, []));
  const [form, setForm] = useState(DEFAULT_FORM);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return TRAINS;
    return TRAINS.filter((train) => `${train.number} ${train.name} ${train.tag}`.toLowerCase().includes(text));
  }, [query]);

  function updateStatus(number, status) {
    const next = { ...statuses, [number]: status };
    setStatuses(next);
    write(KEYS.statuses, next);
    toast.success(`Service ${number} marked ${status.toLowerCase()}.`);
  }

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function toggleClass(code) {
    setForm((current) => ({
      ...current,
      classes: current.classes.includes(code)
        ? current.classes.filter((item) => item !== code)
        : [...current.classes, code],
    }));
  }

  function addTrain(event) {
    event.preventDefault();
    if (!/^\d{4,5}$/.test(form.number.trim())) {
      setError("Train number must be 4–5 digits.");
      return;
    }
    if (form.name.trim().length < 4) {
      setError("Give the service a descriptive name.");
      return;
    }
    if (form.from === form.to) {
      setError("Origin and destination must be different.");
      return;
    }
    if (form.classes.length === 0) {
      setError("Select at least one travel class.");
      return;
    }
    if (TRAINS.some((train) => train.number === form.number.trim()) || customTrains.some((train) => train.number === form.number.trim())) {
      setError("That train number already exists in the network.");
      return;
    }

    const distance = railDistance(form.from, form.to);
    const crossesMidnight = form.arr <= form.dep;
    const record = {
      id: `CT-${Date.now().toString(36).toUpperCase()}`,
      number: form.number.trim(),
      name: form.name.trim(),
      tag: "Custom service",
      days: "daily",
      status: "On time",
      classes: form.classes,
      route: [
        { code: form.from, arr: null, dep: form.dep, day: 1, km: 0 },
        { code: form.to, arr: form.arr, dep: null, day: crossesMidnight ? 2 : 1, km: distance },
      ],
      createdAt: new Date().toISOString(),
    };
    const next = [record, ...customTrains];
    setCustomTrains(next);
    write(KEYS.customTrains, next);
    setForm(DEFAULT_FORM);
    toast.success(`Service ${record.number} added to the local schedule.`);
  }

  function removeTrain(id) {
    const next = customTrains.filter((train) => train.id !== id);
    setCustomTrains(next);
    write(KEYS.customTrains, next);
    toast.success("Custom service removed.");
  }

  const delayed = TRAINS.filter((train) => (statuses[train.number] || train.status) === "Delayed").length;

  return (
    <div>
      <PageHero
        eyebrow="Operations · scheduling"
        title="Run the network from one console."
        description="Update live service status, add custom timetables and keep an eye on what's delayed. Changes are stored in this browser so the board survives a refresh."
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2 text-xs font-semibold text-ink-600">
            <Clock3 className="h-4 w-4 text-amber-600" /> {formatTime12(new Date().toTimeString().slice(0, 5))} IST
          </span>
        }
      >
        <div className="mt-6 grid max-w-xl grid-cols-3 gap-3">
          <div className="rounded-xl border border-ink-100 bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">Services</p>
            <p className="mt-1 font-display text-2xl font-extrabold">{TRAINS.length}</p>
          </div>
          <div className="rounded-xl border border-ink-100 bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">Delayed</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-amber-600">{delayed}</p>
          </div>
          <div className="rounded-xl border border-ink-100 bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">Custom</p>
            <p className="mt-1 font-display text-2xl font-extrabold">{customTrains.length}</p>
          </div>
        </div>
      </PageHero>

      <section className="container-x py-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="card p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold">Service status board</h2>
                <p className="mt-1 text-xs text-ink-500">Tap a status to update the live board.</p>
              </div>
              <div className="relative">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Filter trains…"
                  className="field h-9 w-44 text-xs"
                />
              </div>
            </div>

            <div className="mt-4 divide-y divide-ink-100">
              {filtered.map((train) => {
                const current = statuses[train.number] || train.status;
                return (
                  <div key={train.number} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="w-12 shrink-0 font-mono text-[11px] font-bold text-ink-700">{train.number}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">{train.name}</p>
                      <p className="text-[10px] uppercase tracking-wide text-ink-400">
                        {train.tag} · {train.route[0].code} → {train.route.at(-1).code}
                      </p>
                    </div>
                    <StatusBadge status={current} className="hidden sm:inline-flex" />
                    <div className="flex gap-1">
                      {STATUS_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateStatus(train.number, option)}
                          className={`rounded-md border px-2 py-1 text-[10px] font-semibold transition ${
                            current === option
                              ? option === "Delayed"
                                ? "border-amber-300 bg-amber-100 text-amber-800"
                                : option === "Not running"
                                  ? "border-ink-300 bg-ink-100 text-ink-700"
                                  : "border-emerald-300 bg-emerald-50 text-emerald-700"
                              : "border-ink-100 bg-white text-ink-400 hover:border-ink-300 hover:text-ink-700"
                          }`}
                        >
                          {option === "On time" ? "On time" : option === "Delayed" ? "Delayed" : "Cancelled"}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {filtered.length === 0 ? (
              <p className="mt-4 text-center text-sm text-ink-500">No services match “{query}”.</p>
            ) : null}
          </div>

          <form onSubmit={addTrain} className="card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-100 text-amber-700">
                <CalendarPlus className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold">Add a service</h2>
                <p className="text-[11px] text-ink-500">Create a custom local timetable</p>
              </div>
            </div>

            {error ? (
              <p className="mt-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-medium text-rose-700">
                <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {error}
              </p>
            ) : null}

            <div className="mt-4 grid gap-3">
              <label className="block">
                <span className="field-label">Train number</span>
                <input
                  className="field mt-1.5"
                  inputMode="numeric"
                  value={form.number}
                  onChange={(event) => update("number", event.target.value.replace(/\D/g, "").slice(0, 5))}
                  placeholder="e.g. 06601"
                />
              </label>
              <label className="block">
                <span className="field-label">Service name</span>
                <input
                  className="field mt-1.5"
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  placeholder="Malabar Coast Special"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="field-label">Origin</span>
                  <select className="field mt-1.5" value={form.from} onChange={(event) => update("from", event.target.value)}>
                    {STATION_LIST.map((station) => (
                      <option key={station.code} value={station.code}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="field-label">Destination</span>
                  <select className="field mt-1.5" value={form.to} onChange={(event) => update("to", event.target.value)}>
                    {STATION_LIST.map((station) => (
                      <option key={station.code} value={station.code}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="field-label">Departure</span>
                  <input type="time" className="field mt-1.5" value={form.dep} onChange={(event) => update("dep", event.target.value)} />
                </label>
                <label className="block">
                  <span className="field-label">Arrival</span>
                  <input type="time" className="field mt-1.5" value={form.arr} onChange={(event) => update("arr", event.target.value)} />
                </label>
              </div>
              <div>
                <span className="field-label">Classes offered</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {Object.entries(CLASS_META).map(([code, meta]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => toggleClass(code)}
                      className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition ${
                        form.classes.includes(code)
                          ? "border-ink-950 bg-ink-950 text-white"
                          : "border-ink-200 bg-white text-ink-500 hover:border-ink-300"
                      }`}
                      title={meta.label}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-4 w-full py-2.5 text-xs">
              <Plus className="h-3.5 w-3.5" /> Add to schedule
            </button>
            <p className="mt-2 text-center text-[10px] text-ink-400">
              Distance estimated at {railDistance(form.from, form.to)} km · runs daily
            </p>
          </form>
        </div>

        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold">Custom services</h2>
              <p className="mt-1 text-xs text-ink-500">Locally added timetables for this demo.</p>
            </div>
            <Link to="/schedule" className="btn btn-outline px-3 py-2 text-xs">
              <TrainFront className="h-3.5 w-3.5" /> Open timetable
            </Link>
          </div>

          {customTrains.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-ink-200 bg-white p-8 text-center">
              <RefreshCw className="mx-auto h-7 w-7 text-ink-300" />
              <p className="mt-2 text-sm font-semibold text-ink-700">No custom services yet</p>
              <p className="text-xs text-ink-500">Add one with the form above — it will be saved in this browser.</p>
            </div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {customTrains.map((train) => (
                <div key={train.id} className="rounded-2xl border border-ink-100 bg-white p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-[10px] font-bold text-amber-700">#{train.number}</p>
                      <p className="mt-1 text-sm font-bold text-ink-900">{train.name}</p>
                      <p className="mt-0.5 text-[11px] text-ink-500">
                        {getStation(train.route[0].code).name} → {getStation(train.route.at(-1).code).name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTrain(train.id)}
                      className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100"
                      aria-label={`Delete ${train.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-dashed border-ink-100 pt-3 text-[11px] text-ink-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3 w-3" /> {formatTime12(train.route[0].dep)} → {formatTime12(train.route.at(-1).arr)}
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" /> Stored
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {train.classes.map((code) => (
                      <span key={code} className="rounded border border-ink-100 bg-ink-50 px-1.5 py-0.5 text-[9px] font-bold text-ink-500">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
