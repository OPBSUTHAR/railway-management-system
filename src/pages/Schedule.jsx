import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, ChevronDown, Clock3, MapPin, Search, TrainFront } from "lucide-react";
import PageHero from "../components/PageHero";
import StatusBadge from "../components/StatusBadge";
import { LEGACY_SCHEDULES, TRAINS, getStation, routeDistance, toMinutes } from "../data/railway";
import { formatDuration, formatTime12, daysLabel, todayISO } from "../lib/dates";

const LEGACY = Object.entries(LEGACY_SCHEDULES).map(([number, value]) => ({
  number,
  name: value.name,
  route: value.route,
  tag: "Legacy timetable",
  days: "daily",
  status: "On time",
  classes: [],
}));

const ALL_TRAINS = [...TRAINS, ...LEGACY];

function durationOf(route) {
  if (!route || route.length < 2) return 0;
  const start = route[0];
  const end = route[route.length - 1];
  return (end.day - 1) * 1440 + toMinutes(end.arr || end.dep) - toMinutes(start.dep || start.arr);
}

export default function Schedule() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("ALL");
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return ALL_TRAINS.filter((train) => {
      if (tab === "BOOKABLE" && train.classes.length === 0) return false;
      if (tab === "LEGACY" && train.classes.length > 0) return false;
      if (!text) return true;
      const stationText = train.route
        .map((stop) => {
          const station = getStation(stop.code);
          return `${station.name} ${station.city} ${stop.code}`;
        })
        .join(" ");
      return `${train.number} ${train.name} ${train.tag} ${stationText}`.toLowerCase().includes(text);
    });
  }, [query, tab]);

  return (
    <div>
      <PageHero
        eyebrow="Timetables"
        title="The whole network, on one page."
        description="Every service in the RailSetu network plus the coastal timetable records carried over from the original project. Search by train number, name, city or station code."
        actions={
          <Link to="/tracking" className="btn btn-outline px-4 py-2.5 text-xs">
            <MapPin className="h-3.5 w-3.5" /> Track a running train
          </Link>
        }
      />

      <section className="container-x py-10">
        <div className="card p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try 12951, Rajdhani, Kannur, BCT…"
                className="field pl-10"
              />
            </div>
            <div className="flex gap-1 rounded-xl bg-ink-100 p-1">
              {[
                { id: "ALL", label: `All (${ALL_TRAINS.length})` },
                { id: "BOOKABLE", label: `Bookable (${TRAINS.length})` },
                { id: "LEGACY", label: `Legacy (${LEGACY.length})` },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    tab === item.id ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-3 text-[11px] text-ink-400">
            {filtered.length} service{filtered.length === 1 ? "" : "s"} · timings are indicative demo data
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          {filtered.map((train) => {
            const origin = getStation(train.route[0].code);
            const destination = getStation(train.route.at(-1).code);
            const duration = durationOf(train.route);
            const distance = routeDistance(train.route);
            const open = expanded === train.number;
            return (
              <article key={train.number} className={`card overflow-hidden transition ${open ? "border-amber-300" : ""}`}>
                <button
                  type="button"
                  onClick={() => setExpanded(open ? null : train.number)}
                  className="flex w-full flex-wrap items-center gap-4 p-4 text-left sm:p-5"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink-950 font-mono text-[10px] font-bold text-amber-300">
                    {train.number.slice(-2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-base font-bold text-ink-900">{train.name}</p>
                      <span className="chip border-ink-200 bg-ink-50 text-[10px] text-ink-500">{train.tag}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-ink-500">
                      #{train.number} · {origin.name} → {destination.name} · {daysLabel(train.days)}
                    </p>
                  </div>
                  <div className="hidden text-center sm:block">
                    <p className="text-sm font-bold text-ink-900">{formatTime12(train.route[0].dep || train.route[0].arr)}</p>
                    <p className="text-[10px] uppercase tracking-wide text-ink-400">{origin.code}</p>
                  </div>
                  <ArrowRight className="hidden h-3.5 w-3.5 text-ink-300 sm:block" />
                  <div className="hidden text-center sm:block">
                    <p className="text-sm font-bold text-ink-900">{formatTime12(train.route.at(-1).arr || train.route.at(-1).dep)}</p>
                    <p className="text-[10px] uppercase tracking-wide text-ink-400">{destination.code}</p>
                  </div>
                  <div className="hidden w-24 text-right md:block">
                    <p className="text-xs font-semibold text-ink-700">{formatDuration(duration)}</p>
                    <p className="text-[10px] text-ink-400">{distance} km</p>
                  </div>
                  <StatusBadge status={train.status} className="hidden lg:inline-flex" />
                  <ChevronDown className={`h-4 w-4 shrink-0 text-ink-400 transition ${open ? "rotate-180" : ""}`} />
                </button>

                {open ? (
                  <div className="border-t border-ink-100 bg-ink-50/50 p-4 sm:p-5">
                    <div className="grid gap-5 lg:grid-cols-[1fr_0.7fr]">
                      <ol>
                        {train.route.map((stop, index) => {
                          const station = getStation(stop.code);
                          return (
                            <li key={`${stop.code}-${index}`} className="relative flex gap-4 pb-4 last:pb-0">
                              {index < train.route.length - 1 ? (
                                <span className="absolute left-[5px] top-2.5 h-full w-px bg-ink-200" />
                              ) : null}
                              <span className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-ink-300 bg-white" />
                              <div className="flex flex-1 flex-wrap items-baseline justify-between gap-1">
                                <p className="text-xs font-semibold text-ink-800">
                                  {station.name} <span className="font-mono text-[9px] font-normal text-ink-400">{station.code}</span>
                                </p>
                                <p className="text-[11px] text-ink-500">
                                  {stop.arr && stop.arr !== "—" ? formatTime12(stop.arr) : "—"}
                                  <span className="text-ink-300"> / </span>
                                  {stop.dep && stop.dep !== "—" ? formatTime12(stop.dep) : "—"}
                                  <span className="ml-2 text-[9px] text-ink-400">{stop.km} km</span>
                                </p>
                              </div>
                            </li>
                          );
                        })}
                      </ol>

                      <div className="space-y-3">
                        <div className="rounded-xl border border-ink-100 bg-white p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">Service details</p>
                          <dl className="mt-2 space-y-2 text-xs">
                            <div className="flex justify-between gap-2">
                              <dt className="text-ink-500">Runs</dt>
                              <dd className="font-semibold text-ink-900">{daysLabel(train.days)}</dd>
                            </div>
                            <div className="flex justify-between gap-2">
                              <dt className="text-ink-500">Duration</dt>
                              <dd className="font-semibold text-ink-900">{formatDuration(duration)}</dd>
                            </div>
                            <div className="flex justify-between gap-2">
                              <dt className="text-ink-500">Distance</dt>
                              <dd className="font-semibold text-ink-900">{distance} km</dd>
                            </div>
                            <div className="flex justify-between gap-2">
                              <dt className="text-ink-500">Classes</dt>
                              <dd className="font-semibold text-ink-900">
                                {train.classes.length > 0 ? train.classes.join(" · ") : "Timetable only"}
                              </dd>
                            </div>
                          </dl>
                          {train.classes.length > 0 ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              <Link
                                to={`/booking?from=${train.route[0].code}&to=${train.route.at(-1).code}&date=${todayISO()}`}
                                className="btn btn-primary px-3 py-2 text-[11px]"
                              >
                                Book this route
                              </Link>
                              <Link to={`/tracking?train=${train.number}`} className="btn btn-outline px-3 py-2 text-[11px]">
                                Track live
                              </Link>
                            </div>
                          ) : (
                            <p className="mt-3 rounded-lg bg-amber-50 px-2.5 py-2 text-[10px] leading-relaxed text-amber-800">
                              Retained from the original timetable. This service is reference-only and not sold in the demo.
                            </p>
                          )}
                        </div>
                        <p className="flex items-center gap-1.5 px-1 text-[10px] text-ink-400">
                          <CalendarDays className="h-3 w-3" /> All timings shown in IST · demo data
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
            <TrainFront className="mx-auto h-8 w-8 text-ink-300" />
            <h2 className="mt-3 font-display text-lg font-bold">No matching train</h2>
            <p className="mt-1 text-sm text-ink-500">Try a train number, a city like “Kannur”, or a station code like “BCT”.</p>
            <button type="button" onClick={() => { setQuery(""); setTab("ALL"); }} className="btn btn-outline mt-4 px-4 py-2 text-xs">
              Clear filters
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
