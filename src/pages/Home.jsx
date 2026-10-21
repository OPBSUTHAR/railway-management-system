import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Armchair,
  BadgeCheck,
  Clock3,
  LifeBuoy,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  TrainFront,
  Wallet,
  Zap,
} from "lucide-react";
import SearchBar from "../components/SearchBar";
import StatusBadge from "../components/StatusBadge";
import { POPULAR_ROUTES, STATIONS, STATION_LIST, TRAINS, getStation, searchTrains } from "../data/railway";
import { lowestFare } from "../lib/fares";
import { formatDuration, formatINR, formatTime12, todayISO } from "../lib/dates";

const FEATURES = [
  {
    icon: Search,
    title: "Search that understands routes",
    text: "Every intermediate stop is indexed, so you can board at Vadodara and alight at Kota — not just the terminals.",
  },
  {
    icon: Armchair,
    title: "Pick your exact seat",
    text: "A visual coach map shows window, aisle and middle seats with instant availability before you commit.",
  },
  {
    icon: TrainFront,
    title: "Live running status",
    text: "Follow a train along its route on a real map, with delay estimates recalculated as it moves.",
  },
  {
    icon: LifeBuoy,
    title: "Support that answers",
    text: "Raise a ticket in seconds and keep the whole conversation in one place, PNR attached.",
  },
];

const TRUST = [
  { icon: ShieldCheck, label: "Secure demo accounts" },
  { icon: Wallet, label: "Transparent fares" },
  { icon: BadgeCheck, label: "Instant e-tickets" },
  { icon: Clock3, label: "24×7 assistance" },
];

function LiveBoard() {
  const rows = [TRAINS[0], TRAINS[2], TRAINS[18]];
  return (
    <div className="relative hidden lg:block">
      <div className="absolute -inset-4 rounded-[28px] bg-amber-400/10 blur-2xl" />
      <div className="relative rounded-2xl border border-white/15 bg-white/[0.07] p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live network
          </p>
          <span className="text-[10px] uppercase tracking-widest text-ink-400">Demo feed</span>
        </div>
        <div className="mt-5 space-y-4">
          {rows.map((train) => {
            const origin = getStation(train.route[0].code);
            const destination = getStation(train.route.at(-1).code);
            return (
              <div key={train.number} className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{train.name}</p>
                  <p className="mt-0.5 text-[11px] text-ink-300">
                    {origin.code} → {destination.code} · dep {train.route[0].dep}
                  </p>
                </div>
                <StatusBadge status={train.status} />
              </div>
            );
          })}
        </div>
        <div className="mt-5 rounded-xl bg-ink-950/60 p-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-ink-400">Network pulse</p>
          <div className="mt-2 flex items-end justify-between">
            <p className="font-display text-2xl font-extrabold text-white">
              {TRAINS.length} <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">live services</span>
            </p>
            <div className="flex h-8 items-end gap-1">
              {[40, 62, 48, 74, 58, 88, 70, 96].map((height, index) => (
                <span key={index} className="w-1.5 rounded-sm bg-amber-400/80" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  function handleSearch(query) {
    const params = new URLSearchParams({ from: query.from, to: query.to, date: query.date });
    if (query.classCode && query.classCode !== "ANY") params.set("class", query.classCode);
    navigate(`/booking?${params.toString()}`);
  }

  return (
    <div>
      <section className="relative isolate overflow-hidden bg-ink-950 text-white">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-cover.jpg"
          aria-hidden="true"
        >
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-950/85 to-ink-900/40" />
        <div className="absolute inset-0 hero-mask opacity-60" />

        <div className="container-x relative pb-14 pt-14 sm:pb-20 sm:pt-20">
          <div className="grid gap-12 lg:grid-cols-[1.45fr_0.8fr] lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-200 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Namaste, welcome aboard
              </div>
              <h1 className="mt-5 text-balance font-display text-[40px] font-extrabold leading-[1.03] tracking-tight sm:text-6xl">
                The smarter way to <span className="text-amber-400">move across India.</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-200 sm:text-base">
                Search 22 curated services, book in under a minute, reserve your exact seat and follow the
                train live — all inside one calm, modern railway workspace.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a href="#search" className="btn btn-amber px-5 py-3">
                  Plan a journey <ArrowRight className="h-4 w-4" />
                </a>
                <Link to="/schedule" className="btn border border-white/20 bg-white/5 px-5 py-3 text-white hover:bg-white/10">
                  Browse timetables
                </Link>
              </div>
              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-6">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-400">Stations</dt>
                  <dd className="mt-1 font-display text-2xl font-extrabold">{STATION_LIST.length}+</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-400">Services</dt>
                  <dd className="mt-1 font-display text-2xl font-extrabold">{TRAINS.length}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-400">Classes</dt>
                  <dd className="mt-1 font-display text-2xl font-extrabold text-amber-300">6</dd>
                </div>
              </dl>
            </div>
            <LiveBoard />
          </div>

          <div id="search" className="mt-12 scroll-mt-24 sm:mt-16">
            <SearchBar onSubmit={handleSearch} className="shadow-[0_30px_80px_-30px_rgba(0,0,0,0.65)]" />
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-ink-300">
              {TRUST.map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-amber-400" /> {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Popular corridors
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Start with a favourite route</h2>
          </div>
          <Link to="/schedule" className="link-underline inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700">
            All timetables <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_ROUTES.map((route) => {
            const matches = searchTrains(route.from, route.to);
            const best = matches[0];
            const from = STATIONS[route.from];
            const to = STATIONS[route.to];
            return (
              <Link
                key={route.label}
                to={`/booking?from=${route.from}&to=${route.to}&date=${todayISO()}`}
                className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-600">{route.hint}</p>
                    <h3 className="mt-2 font-display text-xl font-bold text-ink-900">{route.label}</h3>
                    <p className="mt-1 text-xs text-ink-500">
                      {from.city} → {to.city} · {from.state}
                    </p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-ink-100 text-ink-400 transition group-hover:border-amber-300 group-hover:bg-amber-400 group-hover:text-ink-950">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-6 flex items-end justify-between border-t border-dashed border-ink-100 pt-4">
                  <div className="flex items-center gap-4 text-xs text-ink-500">
                    {best ? (
                      <>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5 text-ink-400" /> {formatDuration(best.duration)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-ink-400" /> {best.distance} km
                        </span>
                      </>
                    ) : (
                      <span>Multiple connections</span>
                    )}
                  </div>
                  <p className="text-right">
                    <span className="block text-[10px] uppercase tracking-wide text-ink-400">from</span>
                    <span className="font-display text-lg font-extrabold text-ink-900">
                      {best ? formatINR(lowestFare(best.train)) : "—"}
                    </span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-ink-100 bg-paper/70">
        <div className="container-x grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <img
                src="/images/journey.jpg"
                alt="Travellers watching the landscape from a train window"
                className="h-[340px] w-full object-cover sm:h-[420px]"
              />
            </div>
            <div className="absolute -bottom-5 left-5 right-5 rounded-2xl border border-ink-100 bg-white p-4 shadow-xl sm:left-8 sm:right-auto sm:w-72">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                  <BadgeCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink-900">39 stations · 22 services</p>
                  <p className="text-[11px] text-ink-500">in the RailSetu demo network</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="eyebrow text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Built for real travel days
            </p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Everything between “I need to go” and “I'm on board.”
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-500">
              No tab-hopping, no mystery fares. RailSetu keeps search, seat selection, payment and after-sales
              support in one continuous flow that works beautifully on a phone at the platform.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-ink-100 bg-white p-4">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-950 text-amber-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-ink-900">{title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="min-w-0 rounded-3xl border border-ink-100 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="eyebrow text-amber-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Leaving soon
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">Today's featured departures</h2>
              </div>
              <Link to="/schedule" className="btn btn-outline px-3 py-2 text-xs">
                Full timetable
              </Link>
            </div>
            <div className="mt-6 divide-y divide-ink-100">
              {TRAINS.slice(0, 5).map((train) => {
                const origin = getStation(train.route[0].code);
                const destination = getStation(train.route.at(-1).code);
                return (
                  <Link
                    key={train.number}
                    to={`/tracking?train=${train.number}`}
                    className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="w-14 shrink-0">
                      <p className="font-mono text-xs font-bold text-ink-900">{train.number}</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-wide text-ink-400">{train.tag}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900 group-hover:text-amber-700">
                        {origin.name} → {destination.name}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-ink-500">{train.name}</p>
                    </div>
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-bold text-ink-900">{formatTime12(train.route[0].dep)}</p>
                      <p className="text-[10px] uppercase tracking-wide text-ink-400">Departs</p>
                    </div>
                    <StatusBadge status={train.status} className="hidden md:inline-flex" />
                    <ArrowRight className="h-4 w-4 shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-amber-600" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <div className="rounded-3xl bg-ink-950 p-6 text-white sm:p-8">
              <Zap className="h-6 w-6 text-amber-400" />
              <p className="mt-4 font-display text-xl font-bold leading-snug">
                “Search, seat selection, payment and support should feel like one continuous flow — not five tabs.”
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-amber-400 font-display text-xs font-extrabold text-ink-950">
                  RS
                </span>
                <div>
                  <p className="text-sm font-semibold">The RailSetu brief</p>
                  <p className="text-[11px] text-ink-400">Product principle · demo build</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-ink-100 bg-white p-5">
                <TrainFront className="h-5 w-5 text-amber-600" />
                <p className="mt-3 font-display text-2xl font-extrabold text-ink-900">22</p>
                <p className="text-[11px] text-ink-500">services in the timetable</p>
              </div>
              <div className="rounded-2xl border border-ink-100 bg-white p-5">
                <Armchair className="h-5 w-5 text-amber-600" />
                <p className="mt-3 font-display text-2xl font-extrabold text-ink-900">6</p>
                <p className="text-[11px] text-ink-500">travel classes, SL to EC</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x pb-16 sm:pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-6 py-10 text-white sm:px-12 sm:py-14">
          <div className="absolute inset-0 grid-lines opacity-40" />
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300">Your seat is waiting</p>
              <h2 className="mt-2 text-balance font-display text-3xl font-extrabold sm:text-4xl">
                Plan the trip. We'll handle the rest.
              </h2>
              <p className="mt-3 text-sm text-ink-300">
                Create a free account to save passengers, keep e-tickets handy and manage reservations.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/signup" className="btn btn-amber px-5 py-3">
                Create account
              </Link>
              <Link to="/booking" className="btn border border-white/20 bg-white/5 px-5 py-3 text-white hover:bg-white/10">
                Book a ticket
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
