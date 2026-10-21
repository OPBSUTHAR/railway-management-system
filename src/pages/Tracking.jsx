import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ArrowRight,
  Clock3,
  Gauge,
  LocateFixed,
  MapPin,
  RefreshCw,
  Search,
  Ticket,
  TrainFront,
  TriangleAlert,
} from "lucide-react";
import PageHero from "../components/PageHero";
import StatusBadge from "../components/StatusBadge";
import { useToast } from "../context/ToastContext";
import { TRAINS, getSchedule, getStation, getTrain, toMinutes } from "../data/railway";
import { formatDuration, formatTime12, nowTimeLabel } from "../lib/dates";
import { hashString } from "../lib/fares";
import { findBookingByPNR } from "../lib/storage";

function computeJourney(train) {
  if (!train) return null;
  const route = train.route;
  const departure = route[0].dep || route[0].arr || "00:00";
  const arrival = route.at(-1).arr || route.at(-1).dep || "00:00";
  const depMinutes = toMinutes(departure);
  const arrivalMinutes = (route.at(-1).day - 1) * 1440 + toMinutes(arrival);
  const totalMinutes = Math.max(1, arrivalMinutes - depMinutes);
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const elapsed = nowMinutes - depMinutes;
  const rawFraction = elapsed / totalMinutes;
  const fraction = Math.max(0, Math.min(1, rawFraction));
  const departed = rawFraction >= 0;
  const reached = rawFraction >= 1;

  const distance = route.at(-1).km - route[0].km;
  const targetKm = route[0].km + distance * fraction;

  let segmentIndex = 0;
  for (let index = 0; index < route.length - 1; index += 1) {
    if (targetKm >= route[index].km && targetKm <= route[index + 1].km) {
      segmentIndex = index;
      break;
    }
    if (targetKm > route[index + 1].km) segmentIndex = index;
  }
  const start = route[segmentIndex];
  const end = route[Math.min(segmentIndex + 1, route.length - 1)];
  const startStation = getStation(start.code);
  const endStation = getStation(end.code);
  const span = end.km - start.km;
  const segmentFraction = span > 0 ? Math.min(1, Math.max(0, (targetKm - start.km) / span)) : 0;
  const lat = (startStation.lat ?? 20.59) + ((endStation.lat ?? 20.59) - (startStation.lat ?? 20.59)) * segmentFraction;
  const lng = (startStation.lng ?? 78.96) + ((endStation.lng ?? 78.96) - (startStation.lng ?? 78.96)) * segmentFraction;

  const delay =
    train.status === "Delayed" ? 18 + (hashString(train.number) % 12) : hashString(`${train.number}-${now.getDate()}`) % 4;
  const speed = reached || !departed ? 0 : 64 + (hashString(`${train.number}-speed`) % 34);
  const nextStop = reached ? null : route[Math.min(segmentIndex + 1, route.length - 1)];

  const locationLabel = reached
    ? `Arrived at ${endStation.name}`
    : !departed
      ? `Yet to depart from ${startStation.name}`
      : `Between ${startStation.name} and ${endStation.name}`;

  return {
    route,
    departure,
    arrival,
    fraction,
    percent: Math.round(fraction * 100),
    departed,
    reached,
    delay,
    speed,
    segmentIndex,
    nextStop,
    lat,
    lng,
    locationLabel,
    distanceCovered: Math.round(distance * fraction),
    distanceTotal: distance,
    targetKm,
    scheduledArrival: arrival,
    elapsedMinutes: Math.max(0, elapsed),
    remainingMinutes: Math.max(0, totalMinutes - elapsed),
  };
}

export default function Tracking() {
  const toast = useToast();
  const [params] = useSearchParams();
  const [trainNumber, setTrainNumber] = useState(() => (getTrain(params.get("train")) ? params.get("train") : "12951"));
  const [tick, setTick] = useState(0);
  const [mode, setMode] = useState("live");
  const [pnrInput, setPnrInput] = useState("");
  const [foundBooking, setFoundBooking] = useState(null);
  const [pnrError, setPnrError] = useState("");

  const train = getTrain(trainNumber);
  const schedule = getSchedule(trainNumber);
  const journey = useMemo(() => computeJourney(train), [train, tick]);
  const origin = schedule ? getStation(schedule.route[0].code) : null;
  const destination = schedule ? getStation(schedule.route.at(-1).code) : null;

  function refresh() {
    setTick((value) => value + 1);
    toast.info(`Live feed refreshed at ${nowTimeLabel()}.`);
  }

  function lookupPnr(event) {
    event.preventDefault();
    const booking = findBookingByPNR(pnrInput);
    if (!booking) {
      setPnrError("No booking found for that PNR in this browser. Try the demo PNR 4820193756.");
      setFoundBooking(null);
      return;
    }
    const bookedTrain = getTrain(booking.trainNumber);
    if (!bookedTrain) {
      setPnrError("That booking's train is not part of the live network.");
      return;
    }
    setPnrError("");
    setFoundBooking(booking);
    setTrainNumber(booking.trainNumber);
    toast.success(`PNR ${booking.pnr} located on ${bookedTrain.name}.`);
  }

  return (
    <div>
      <PageHero
        eyebrow="Live train tracking"
        title="Watch your train move, stop by stop."
        description="A simulated live feed places each service on its actual route, with delay estimates, distance covered and the next halt. Enter a PNR to track a booked journey."
        actions={
          <button type="button" onClick={refresh} className="btn btn-outline px-4 py-2.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh live feed
          </button>
        }
      />

      <section className="container-x py-10">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <div className="card overflow-hidden">
            <div className="relative">
              <RouteMap train={train} journey={journey} />
              <div className="pointer-events-none absolute left-4 top-4 z-[400] rounded-xl border border-white/60 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-500">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Live · {nowTimeLabel()}
                </p>
                <p className="mt-1 font-display text-sm font-bold text-ink-900">
                  {train.number} · {train.name}
                </p>
              </div>
              <div className="pointer-events-none absolute bottom-4 left-4 z-[400] rounded-lg bg-ink-950/85 px-3 py-2 text-[10px] text-white backdrop-blur">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> Current position
                </span>
                <span className="ml-3 inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white" /> Scheduled halt
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 px-4 py-3 text-[11px] text-ink-500">
              <span>
                {origin?.name} → {destination?.name} · {journey?.distanceTotal} km
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-amber-600" /> Map data © OpenStreetMap contributors
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-5">
              <div className="flex gap-1 rounded-xl bg-ink-100 p-1">
                <button
                  type="button"
                  onClick={() => setMode("live")}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    mode === "live" ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"
                  }`}
                >
                  <TrainFront className="mr-1.5 inline h-3.5 w-3.5" /> Live train
                </button>
                <button
                  type="button"
                  onClick={() => setMode("pnr")}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    mode === "pnr" ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"
                  }`}
                >
                  <Ticket className="mr-1.5 inline h-3.5 w-3.5" /> By PNR
                </button>
              </div>

              {mode === "live" ? (
                <label className="mt-4 block">
                  <span className="field-label">Choose a service</span>
                  <select
                    value={trainNumber}
                    onChange={(event) => {
                      setTrainNumber(event.target.value);
                      setFoundBooking(null);
                    }}
                    className="field mt-1.5"
                  >
                    {TRAINS.map((item) => (
                      <option key={item.number} value={item.number}>
                        {item.number} · {item.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <div className="mt-4">
                  <form onSubmit={lookupPnr} className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                      <input
                        value={pnrInput}
                        onChange={(event) => {
                          setPnrInput(event.target.value.replace(/\D/g, "").slice(0, 10));
                          setPnrError("");
                        }}
                        placeholder="10-digit PNR"
                        inputMode="numeric"
                        className="field pl-9 font-mono tracking-wider"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary px-4 py-2.5 text-xs">
                      Track
                    </button>
                  </form>
                  {pnrError ? <p className="mt-2 text-[11px] font-medium text-rose-600">{pnrError}</p> : null}
                  {foundBooking ? (
                    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-sm font-bold text-emerald-900">{foundBooking.pnr}</p>
                        <StatusBadge status={foundBooking.status} />
                      </div>
                      <p className="mt-1 text-[11px] text-emerald-800">
                        {foundBooking.trainName} · {foundBooking.from} → {foundBooking.to} · Coach {foundBooking.coach} /{" "}
                        {foundBooking.seats.join(", ")}
                      </p>
                      <Link to="/bookings" className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-900 underline underline-offset-2">
                        Open e-ticket <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  ) : (
                    <p className="mt-2 text-[11px] text-ink-400">Tip: the seeded demo ticket uses PNR 4820193756.</p>
                  )}
                </div>
              )}

              <div className="mt-5 rounded-xl bg-ink-950 p-4 text-white">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                      {journey?.reached ? "Journey complete" : journey?.departed ? "Currently running" : "Scheduled"}
                    </p>
                    <p className="mt-1 font-display text-lg font-bold leading-tight">{journey?.locationLabel}</p>
                  </div>
                  <StatusBadge status={journey?.delay > 10 ? "Delayed" : "On time"} />
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-ink-400">
                    <span>{origin?.code}</span>
                    <span>{journey?.percent}% complete</span>
                    <span>{destination?.code}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${journey?.percent || 0}%` }} />
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-xs">
                  <div>
                    <dt className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-ink-400">
                      <Gauge className="h-3 w-3" /> Speed
                    </dt>
                    <dd className="mt-0.5 font-semibold">{journey?.speed} km/h</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-ink-400">
                      <Clock3 className="h-3 w-3" /> Delay
                    </dt>
                    <dd className={`mt-0.5 font-semibold ${journey?.delay > 10 ? "text-amber-300" : "text-emerald-300"}`}>
                      {journey?.delay > 0 ? `${journey.delay} min late` : "Right on time"}
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-ink-400">
                      <MapPin className="h-3 w-3" /> Covered
                    </dt>
                    <dd className="mt-0.5 font-semibold">
                      {journey?.distanceCovered} / {journey?.distanceTotal} km
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-ink-400">
                      <LocateFixed className="h-3 w-3" /> Next halt
                    </dt>
                    <dd className="mt-0.5 truncate font-semibold">
                      {journey?.nextStop ? getStation(journey.nextStop.code).name : "Destination"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-ink-500">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" /> Scheduled arrival {formatTime12(journey?.scheduledArrival)}
                </span>
                <button type="button" onClick={refresh} className="font-semibold text-amber-700 hover:underline">
                  Refresh
                </button>
              </div>
            </div>

            {journey?.delay > 10 ? (
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-800">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                Running {journey.delay} minutes behind schedule. Expected arrival{" "}
                {formatDelayedTime(journey.scheduledArrival, journey.delay)}. Platform changes will appear here.
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <div className="card p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-xl font-bold">Route timeline</h2>
              <span className="text-[11px] text-ink-500">
                {schedule?.route.length} halts · {formatDuration((schedule ? schedule.route.length : 0) > 1 ? (schedule.route.at(-1).day - 1) * 1440 + toMinutes(schedule.route.at(-1).arr) - toMinutes(schedule.route[0].dep) : 0)}
              </span>
            </div>
            <ol className="mt-5">
              {schedule?.route.map((stop, index) => {
                const station = getStation(stop.code);
                const passed = journey && stop.km <= journey.targetKm;
                const isNext = journey?.nextStop?.code === stop.code;
                const isCurrent = journey && index === journey.segmentIndex && !journey.reached;
                return (
                  <li key={`${stop.code}-${index}`} className="relative flex gap-4 pb-5 last:pb-0">
                    {index < schedule.route.length - 1 ? (
                      <span className={`absolute left-[7px] top-3 h-full w-px ${passed ? "bg-amber-400" : "bg-ink-200"}`} />
                    ) : null}
                    <span
                      className={`relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                        isCurrent
                          ? "border-amber-500 bg-amber-400 ring-4 ring-amber-100"
                          : passed
                            ? "border-amber-500 bg-amber-400"
                            : "border-ink-300 bg-white"
                      }`}
                    />
                    <div className="flex flex-1 flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <p className={`text-sm font-semibold ${isNext ? "text-amber-700" : "text-ink-900"}`}>
                          {station.name} <span className="font-mono text-[10px] font-normal text-ink-400">{station.code}</span>
                          {isCurrent ? <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">Train here</span> : null}
                          {isNext ? <span className="ml-2 rounded-full bg-ink-900 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-300">Next</span> : null}
                        </p>
                        <p className="mt-0.5 text-[11px] text-ink-500">
                          {stop.km} km from origin {stop.day > 1 ? `· day ${stop.day}` : ""}
                        </p>
                      </div>
                      <div className="text-right text-[11px]">
                        <p className="font-semibold text-ink-800">
                          {stop.arr ? formatTime12(stop.arr) : "—"}
                          {stop.dep ? <span className="text-ink-400"> / {formatTime12(stop.dep)}</span> : null}
                        </p>
                        <p className="text-ink-400">arr / dep</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-ink-950 p-5 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">Live network notes</p>
              <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-ink-300">
                <li>Positions are interpolated from the published timetable and refreshed when you tap refresh.</li>
                <li>Delay figures are simulated deterministically so every visit tells a consistent story.</li>
                <li>For a real deployment, plug an IRCTC or NTES feed into the same map component.</li>
              </ul>
            </div>
            <div className="card p-5">
              <h3 className="text-sm font-bold text-ink-900">Quick links</h3>
              <div className="mt-3 grid gap-2">
                <Link to="/schedule" className="flex items-center justify-between rounded-lg border border-ink-100 px-3 py-2 text-xs font-medium text-ink-600 hover:border-amber-300">
                  Full timetable <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link to="/booking" className="flex items-center justify-between rounded-lg border border-ink-100 px-3 py-2 text-xs font-medium text-ink-600 hover:border-amber-300">
                  Book this journey <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link to="/support" className="flex items-center justify-between rounded-lg border border-ink-100 px-3 py-2 text-xs font-medium text-ink-600 hover:border-amber-300">
                  Report a delay <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function formatDelayedTime(time, delay) {
  if (!time) return "—";
  const total = (toMinutes(time) + delay) % 1440;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return formatTime12(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
}

function RouteMap({ train, journey }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !train || !journey) return;
    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 12,
      minZoom: 3,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const coords = train.route.map((stop) => {
      const station = getStation(stop.code);
      return [station.lat ?? 20.59, station.lng ?? 78.96];
    });

    L.polyline(coords, { color: "#c7d0dd", weight: 3, dashArray: "6 8" }).addTo(map);

    if (journey.fraction > 0) {
      const traveled = coords.slice(0, journey.segmentIndex + 1).concat([[journey.lat, journey.lng]]);
      L.polyline(traveled, { color: "#f59e0b", weight: 5, lineCap: "round" }).addTo(map);
    }

    train.route.forEach((stop, index) => {
      const station = getStation(stop.code);
      L.circleMarker([station.lat ?? 20.59, station.lng ?? 78.96], {
        radius: 5,
        color: "#0b1220",
        weight: 2,
        fillColor: index <= journey.segmentIndex ? "#f59e0b" : "#ffffff",
        fillOpacity: 1,
      })
        .addTo(map)
        .bindTooltip(`${station.name} · ${stop.arr || stop.dep || ""}`, { direction: "top" });
    });

    const icon = L.divIcon({
      className: "train-marker",
      html: '<span style="font-size:17px;line-height:1">🚆</span>',
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });

    L.marker([journey.lat, journey.lng], { icon })
      .addTo(map)
      .bindPopup(`<strong>${train.name}</strong><br/>${journey.locationLabel}<br/>${journey.speed} km/h`);

    map.fitBounds(L.latLngBounds(coords), { padding: [36, 36] });
    window.setTimeout(() => map.invalidateSize(), 120);

    return () => {
      map.remove();
    };
  }, [train, journey.lat, journey.lng, journey.segmentIndex, journey.fraction]);

  return <div ref={containerRef} className="z-0 h-[380px] w-full bg-ink-100 sm:h-[440px]" aria-label="Live train route map" />;
}
