import { useMemo, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Loader2,
  Lock,
  MapPin,
  Minus,
  Plus,
  Printer,
  ShieldCheck,
  Ticket,
  TrainFront,
  Trash2,
  Users,
} from "lucide-react";
import PageHero from "../components/PageHero";
import SearchBar from "../components/SearchBar";
import StatusBadge from "../components/StatusBadge";
import Stepper from "../components/Stepper";
import TicketCard from "../components/TicketCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { CLASS_META, getStation, searchTrains } from "../data/railway";
import { availability, coachFor, fareFor, totalFare } from "../lib/fares";
import { KEYS, read, write } from "../lib/storage";
import { generateId, generatePNR } from "../lib/pnr";
import { formatDate, formatDuration, formatINR, formatTime12, runsOn, todayISO } from "../lib/dates";

const STEPS = ["Choose train", "Passengers", "Review & pay", "Ticket"];
const MAX_PASSENGERS = 6;

function emptyPassenger() {
  return { name: "", age: "", gender: "Male" };
}

function SummaryRow({ label, value, strong }) {
  return (
    <div className={`flex items-center justify-between gap-3 ${strong ? "text-base font-bold text-ink-900" : "text-sm text-ink-600"}`}>
      <span>{label}</span>
      <span className={strong ? "" : "font-semibold text-ink-800"}>{value}</span>
    </div>
  );
}

function TrainResult({ result, date, classFilter, onSelect }) {
  const { train, fromStop, toStop, departure, arrival, duration, distance, dayOffset } = result;
  const from = getStation(fromStop.code);
  const to = getStation(toStop.code);
  const operating = runsOn(train.days, date);
  const classes = train.classes.filter((code) => classFilter === "ANY" || code === classFilter);

  return (
    <article className={`card overflow-hidden transition ${operating ? "" : "opacity-80"}`}>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-100 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink-950 font-display text-[13px] font-extrabold text-amber-300">
            {train.number.slice(-2)}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-lg font-bold text-ink-900">{train.name}</h3>
              <span className="chip border-amber-200 bg-amber-50 text-amber-700">{train.tag}</span>
            </div>
            <p className="mt-1 text-xs text-ink-500">
              #{train.number} · Runs {runsOn(train.days, date) ? "today" : "on selected days"} · {formatDate(date, { weekday: undefined, year: undefined })}
            </p>
          </div>
        </div>
        <StatusBadge status={train.status} />
      </div>

      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center pt-1.5">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-ink-900 bg-white" />
              <span className="my-1 h-12 w-px border-l border-dashed border-ink-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <p className="font-display text-lg font-extrabold text-ink-900">{formatTime12(departure)}</p>
                  <p className="text-xs text-ink-500">
                    {from.name} <span className="font-mono text-[10px] text-ink-400">({from.code})</span>
                  </p>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">Departs</span>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-2">
                <div>
                  <p className="font-display text-lg font-extrabold text-ink-900">
                    {formatTime12(arrival)}
                    {dayOffset ? <span className="ml-1 text-xs font-bold text-amber-600">+{dayOffset}d</span> : null}
                  </p>
                  <p className="text-xs text-ink-500">
                    {to.name} <span className="font-mono text-[10px] text-ink-400">({to.code})</span>
                  </p>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">Arrives</span>
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-dashed border-ink-100 pt-3 text-[11px] text-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-amber-500" /> {formatDuration(duration)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-amber-500" /> {distance} km
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-amber-500" /> {runsOnLabel(train.days)}
            </span>
          </div>
        </div>

        <div className="lg:border-l lg:border-ink-100 lg:pl-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-400">Fares & availability</p>
          {!operating ? (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-800">
              This train does not run on {formatDate(date)}. Try another date or service.
            </div>
          ) : (
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {classes.map((code) => {
                const status = availability(train.number, date, code);
                const fare = fareFor(distance, code);
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => onSelect(result, code)}
                    className="group flex items-center justify-between gap-2 rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-left transition hover:border-amber-400 hover:bg-amber-50/50"
                  >
                    <div>
                      <p className="text-sm font-bold text-ink-900">
                        {code} <span className="font-normal text-ink-500">· {CLASS_META[code]?.label}</span>
                      </p>
                      <p className={`mt-0.5 text-[11px] font-semibold ${status.status === "WL" ? "text-amber-700" : "text-emerald-700"}`}>
                        {status.status === "WL" ? `Waitlist ${status.seats}` : `${status.seats} seats`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-sm font-extrabold text-ink-900">{formatINR(fare)}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400 opacity-0 transition group-hover:opacity-100">
                        Select
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function runsOnLabel(days) {
  if (days === "daily") return "Runs daily";
  if (!Array.isArray(days)) return "Runs daily";
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days.map((day) => names[day]).join(", ");
}

export default function Booking() {
  const { user } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const [params] = useSearchParams();
  const flowRef = useRef(null);

  const [search, setSearch] = useState(() => ({
    from: params.get("from") || "BCT",
    to: params.get("to") || "NDLS",
    date: params.get("date") || todayISO(),
    classCode: params.get("class") || "ANY",
  }));
  const [results, setResults] = useState(() => {
    const from = params.get("from");
    const to = params.get("to");
    return from && to && from !== to ? searchTrains(from, to) : null;
  });
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(1);
  const [passengers, setPassengers] = useState([emptyPassenger()]);
  const [contact, setContact] = useState({ email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [booking, setBooking] = useState(null);
  const [paying, setPaying] = useState(false);

  const fare = useMemo(() => {
    if (!selected) return null;
    return totalFare(selected.result.train, selected.result.distance, selected.classCode, passengers.length);
  }, [selected, passengers.length]);

  const waitlist = selected ? availability(selected.result.train.number, search.date, selected.classCode) : null;

  function runSearch(query) {
    const nextResults = searchTrains(query.from, query.to);
    setSearch(query);
    setResults(nextResults);
    setSelected(null);
    setBooking(null);
    setStep(1);
    setErrors({});
    if (nextResults.length === 0) toast.info("No direct trains on that route in this demo network.");
  }

  function goToStep(next) {
    setStep(next);
    window.setTimeout(() => flowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  }

  function selectTrain(result, classCode) {
    setSelected({ result, classCode });
    setStep(2);
    setErrors({});
    goToStep(2);
  }

  function updatePassenger(index, field, value) {
    setPassengers((current) => current.map((passenger, i) => (i === index ? { ...passenger, [field]: value } : passenger)));
    setErrors((current) => ({ ...current, [`${field}${index}`]: "" }));
  }

  function setPassengerCount(next) {
    const count = Math.max(1, Math.min(MAX_PASSENGERS, next));
    setPassengers((current) => {
      if (count <= current.length) return current.slice(0, count);
      return [...current, ...Array.from({ length: count - current.length }, emptyPassenger)];
    });
  }

  function removePassenger(index) {
    setPassengers((current) => (current.length > 1 ? current.filter((_, i) => i !== index) : current));
  }

  function validateDetails() {
    const next = {};
    passengers.forEach((passenger, index) => {
      if (passenger.name.trim().length < 2) next[`name${index}`] = "Enter the full name as on ID.";
      const age = Number(passenger.age);
      if (!age || age < 1 || age > 120) next[`age${index}`] = "Age must be 1–120.";
    });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) next.email = "Enter a valid email address.";
    if (!/^[6-9]\d{9}$/.test(contact.phone.trim())) next.phone = "Enter a valid 10-digit Indian mobile number.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function continueToReview() {
    if (!validateDetails()) {
      toast.error("Please fix the highlighted details.");
      return;
    }
    goToStep(3);
  }

  function payAndConfirm() {
    if (!selected || !user) return;
    setPaying(true);
    const { result, classCode } = selected;
    const isWaitlist = waitlist?.status === "WL";
    const seats = coachFor(result.train.number, search.date, classCode, passengers.length);
    const record = {
      id: generateId("BK"),
      pnr: generatePNR(),
      username: user.username,
      trainNumber: result.train.number,
      trainName: result.train.name,
      from: result.fromStop.code,
      to: result.toStop.code,
      date: search.date,
      classCode,
      passengers: passengers.map((passenger) => ({
        name: passenger.name.trim(),
        age: Number(passenger.age),
        gender: passenger.gender,
      })),
      fare: fare.total,
      coach: isWaitlist ? "WL" : seats.coach,
      seats: isWaitlist ? passengers.map(() => "—") : seats.seats,
      status: isWaitlist ? "WAITLISTED" : "CONFIRMED",
      contact: { email: contact.email.trim(), phone: contact.phone.trim() },
      createdAt: new Date().toISOString(),
    };

    window.setTimeout(() => {
      write(KEYS.bookings, [record, ...read(KEYS.bookings, [])]);
      setBooking(record);
      setPaying(false);
      setStep(4);
      toast.success(`Booking confirmed · PNR ${record.pnr}`);
      goToStep(4);
    }, 900);
  }

  function resetFlow() {
    setSelected(null);
    setBooking(null);
    setPassengers([emptyPassenger()]);
    setContact({ email: "", phone: "" });
    setErrors({});
    setStep(1);
    goToStep(1);
  }

  function startOver() {
    setSearch({ from: "BCT", to: "NDLS", date: todayISO(), classCode: "ANY" });
    setResults(null);
    setSelected(null);
    setBooking(null);
    setPassengers([emptyPassenger()]);
    setContact({ email: "", phone: "" });
    setErrors({});
    setStep(1);
  }

  const loginHref = `/login?next=${encodeURIComponent(`${location.pathname}${location.search}`)}`;
  const signupHref = `/signup?next=${encodeURIComponent(`${location.pathname}${location.search}`)}`;

  return (
    <div>
      <PageHero
        eyebrow="Book a ticket"
        title="Find your next train, then settle into a seat."
        description="Search every stop on the route, compare classes and confirm an instant e-ticket. Fares include GST and a transparent convenience fee."
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2 text-xs font-semibold text-ink-600">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Demo payments · no real charge
          </span>
        }
      />

      <section className="bubble-section container-x py-8 sm:py-10">
        <div ref={flowRef} className="scroll-mt-24">
          <SearchBar
            initial={search}
            onSubmit={runSearch}
            className="border-ink-100 shadow-[0_16px_40px_-24px_rgba(6,11,20,0.35)]"
          />
        </div>

        {selected ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-white px-5 py-4">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="chip bg-ink-950 text-white">
                {selected.result.train.number} · {selected.classCode}
              </span>
              <span className="font-semibold text-ink-800">
                {getStation(selected.result.fromStop.code).name} → {getStation(selected.result.toStop.code).name}
              </span>
              <span className="text-ink-500">{formatDate(search.date)}</span>
            </div>
            <button type="button" onClick={resetFlow} className="text-xs font-semibold text-amber-700 underline underline-offset-4">
              Change train
            </button>
          </div>
        ) : null}

        <div className="mt-6">
          <Stepper steps={STEPS} current={step} />
        </div>

        {results === null ? (
          <EmptySearch onPick={(from, to) => runSearch({ from, to, date: todayISO(), classCode: "ANY" })} />
        ) : null}

        {step === 1 && results !== null ? (
          <div className="mt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-bold tracking-tight">
                {results.length} {results.length === 1 ? "train" : "trains"} · {getStation(search.from).city} →{" "}
                {getStation(search.to).city}
              </h2>
              <p className="text-xs text-ink-500">
                {formatDate(search.date)} · {search.classCode === "ANY" ? "All classes" : search.classCode}
              </p>
            </div>

            {results.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-ink-200 bg-white p-8 text-center">
                <TrainFront className="mx-auto h-8 w-8 text-ink-300" />
                <h3 className="mt-3 font-display text-lg font-bold">No direct trains found</h3>
                <p className="mx-auto mt-1 max-w-md text-sm text-ink-500">
                  This demo network covers 22 services. Try Mumbai → Delhi, Chennai → Bengaluru or Mumbai → Pune.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid gap-4">
                {results.map((result) => (
                  <TrainResult
                    key={result.train.number}
                    result={result}
                    date={search.date}
                    classFilter={search.classCode}
                    onSelect={selectTrain}
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}

        {step >= 2 && selected ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="space-y-5">
              {step === 2 ? (
                <PassengerDetails
                  passengers={passengers}
                  errors={errors}
                  contact={contact}
                  setContact={setContact}
                  updatePassenger={updatePassenger}
                  setPassengerCount={setPassengerCount}
                  removePassenger={removePassenger}
                  onBack={() => setStep(1)}
                  onContinue={continueToReview}
                />
              ) : null}

              {step === 3 ? (
                <div className="card p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="eyebrow text-amber-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Final check
                      </p>
                      <h2 className="mt-2 text-xl font-bold">Review your booking</h2>
                    </div>
                    <button type="button" onClick={() => goToStep(2)} className="text-xs font-semibold text-ink-500 underline underline-offset-4">
                      Edit details
                    </button>
                  </div>

                  <div className="mt-5 rounded-xl border border-ink-100 bg-ink-50/60 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-display text-base font-bold text-ink-900">
                        {selected.result.train.name} <span className="text-ink-400">#{selected.result.train.number}</span>
                      </p>
                      <StatusBadge status={waitlist?.status === "WL" ? "WL" : "AVAILABLE"} dot={false} />
                    </div>
                    <p className="mt-1 text-xs text-ink-500">
                      {formatDate(search.date)} · {selected.classCode} · {getStation(selected.result.fromStop.code).name} →{" "}
                      {getStation(selected.result.toStop.code).name}
                    </p>
                    {waitlist?.status === "WL" ? (
                      <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-800">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        This class is on the waitlist (WL {waitlist.seats}). You can still book — the ticket will be marked waitlisted.
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-4 overflow-hidden rounded-xl border border-ink-100">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-ink-50 text-[10px] uppercase tracking-wide text-ink-400">
                        <tr>
                          <th className="px-4 py-2 font-semibold">Passenger</th>
                          <th className="px-4 py-2 font-semibold">Age</th>
                          <th className="px-4 py-2 font-semibold">Gender</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink-100">
                        {passengers.map((passenger, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2.5 font-medium text-ink-900">
                              {index + 1}. {passenger.name}
                            </td>
                            <td className="px-4 py-2.5 text-ink-600">{passenger.age}</td>
                            <td className="px-4 py-2.5 text-ink-600">{passenger.gender}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-ink-50 px-4 py-3 text-xs text-ink-500">
                    <span>
                      Contact: <span className="font-semibold text-ink-800">{contact.email}</span> ·{" "}
                      <span className="font-semibold text-ink-800">{contact.phone}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" /> {passengers.length} traveller{passengers.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  {!user ? (
                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <p className="flex items-center gap-2 text-sm font-bold text-amber-900">
                        <Lock className="h-4 w-4" /> Sign in to confirm this booking
                      </p>
                      <p className="mt-1 text-xs text-amber-800">
                        A RailSetu account keeps your ticket safe and lets you cancel or print it later.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link to={loginHref} className="btn btn-primary px-4 py-2 text-xs">
                          Log in
                        </Link>
                        <Link to={signupHref} className="btn border border-amber-300 bg-white px-4 py-2 text-xs text-amber-900">
                          Create account
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={payAndConfirm} className="btn btn-primary mt-5 w-full py-3" disabled={paying}>
                      {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                      {paying ? "Processing payment…" : `Pay ${formatINR(fare.total)} & confirm`}
                    </button>
                  )}
                  <button type="button" onClick={() => goToStep(2)} className="btn btn-ghost mt-2 w-full text-xs">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to passenger details
                  </button>
                </div>
              ) : null}

              {step === 4 && booking ? (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                    <p className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                      <CheckCircle2 className="h-5 w-5" /> You're booked! Your e-ticket is below.
                    </p>
                    <p className="mt-1 text-xs text-emerald-700">
                      {booking.status === "WAITLISTED"
                        ? "This ticket is waitlisted. We'll email you if a seat opens up."
                        : "Carry a valid photo ID matching the passenger name. Happy journey!"}
                    </p>
                  </div>
                  <TicketCard booking={booking}>
                    <button type="button" onClick={() => window.print()} className="btn btn-outline px-3 py-2 text-xs">
                      <Printer className="h-3.5 w-3.5" /> Print / save PDF
                    </button>
                    <Link to="/bookings" className="btn btn-primary px-3 py-2 text-xs">
                      <Ticket className="h-3.5 w-3.5" /> My tickets
                    </Link>
                    <button type="button" onClick={resetFlow} className="btn btn-ghost px-3 py-2 text-xs">
                      Book another journey
                    </button>
                  </TicketCard>
                </div>
              ) : null}
            </div>

            {step < 4 ? (
              <FareSummary selected={selected} fare={fare} search={search} passengers={passengers} step={step} />
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function EmptySearch({ onPick }) {
  const suggestions = [
    { from: "BCT", to: "NDLS", label: "Mumbai → Delhi" },
    { from: "MAS", to: "SBC", label: "Chennai → Bengaluru" },
    { from: "BCT", to: "PUNE", label: "Mumbai → Pune" },
  ];
  return (
    <div className="mt-8 grid gap-6 rounded-3xl border border-ink-100 bg-white p-6 sm:p-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
      <div>
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-100 text-amber-700">
          <TrainFront className="h-5 w-5" />
        </span>
        <h2 className="mt-4 font-display text-2xl font-bold tracking-tight">Where are you headed?</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-500">
          Pick a boarding station, a destination and a date above. We'll show every direct service, class by class,
          with live-style availability.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.label}
              type="button"
              onClick={() => onPick(suggestion.from, suggestion.to)}
              className="chip border-ink-200 bg-white transition hover:border-amber-400 hover:bg-amber-50"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl bg-ink-950 p-6 text-white">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">Booking, simplified</p>
        <ul className="mt-4 space-y-3 text-sm text-ink-200">
          {[
            "Every intermediate stop is searchable.",
            "Exact seat and coach assigned on payment.",
            "Instant PNR, printable e-ticket.",
            "Cancel from My tickets in one tap.",
          ].map((line) => (
            <li key={line} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" /> {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PassengerDetails({ passengers, errors, contact, setContact, updatePassenger, setPassengerCount, removePassenger, onBack, onContinue }) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Traveller details
          </p>
          <h2 className="mt-2 text-xl font-bold">Who's travelling?</h2>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-ink-200 px-2 py-1.5">
          <button
            type="button"
            onClick={() => setPassengerCount(passengers.length - 1)}
            disabled={passengers.length <= 1}
            className="grid h-6 w-6 place-items-center rounded-full bg-ink-100 text-ink-700 disabled:opacity-40"
            aria-label="Remove passenger"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="text-xs font-bold text-ink-900">{passengers.length}</span>
          <button
            type="button"
            onClick={() => setPassengerCount(passengers.length + 1)}
            disabled={passengers.length >= MAX_PASSENGERS}
            className="grid h-6 w-6 place-items-center rounded-full bg-ink-900 text-white disabled:opacity-40"
            aria-label="Add passenger"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {passengers.map((passenger, index) => (
          <div key={index} className="rounded-xl border border-ink-100 bg-ink-50/50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Passenger {index + 1}</p>
              {passengers.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removePassenger(index)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:underline"
                >
                  <Trash2 className="h-3 w-3" /> Remove
                </button>
              ) : null}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_90px_120px]">
              <label className="block">
                <span className="field-label">Full name</span>
                <input
                  className={`field mt-1.5 bg-white ${errors[`name${index}`] ? "border-rose-300" : ""}`}
                  value={passenger.name}
                  onChange={(event) => updatePassenger(index, "name", event.target.value)}
                  placeholder="As printed on ID"
                />
                {errors[`name${index}`] ? <span className="mt-1 block text-[11px] text-rose-600">{errors[`name${index}`]}</span> : null}
              </label>
              <label className="block">
                <span className="field-label">Age</span>
                <input
                  type="number"
                  min="1"
                  max="120"
                  className={`field mt-1.5 bg-white ${errors[`age${index}`] ? "border-rose-300" : ""}`}
                  value={passenger.age}
                  onChange={(event) => updatePassenger(index, "age", event.target.value)}
                  placeholder="e.g. 28"
                />
                {errors[`age${index}`] ? <span className="mt-1 block text-[11px] text-rose-600">{errors[`age${index}`]}</span> : null}
              </label>
              <label className="block">
                <span className="field-label">Gender</span>
                <select
                  className="field mt-1.5 bg-white"
                  value={passenger.gender}
                  onChange={(event) => updatePassenger(index, "gender", event.target.value)}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Email for e-ticket</span>
          <input
            type="email"
            className={`field mt-1.5 ${errors.email ? "border-rose-300" : ""}`}
            value={contact.email}
            onChange={(event) => setContact({ ...contact, email: event.target.value })}
            placeholder="you@example.com"
          />
          {errors.email ? <span className="mt-1 block text-[11px] text-rose-600">{errors.email}</span> : null}
        </label>
        <label className="block">
          <span className="field-label">Mobile number</span>
          <input
            type="tel"
            inputMode="numeric"
            className={`field mt-1.5 ${errors.phone ? "border-rose-300" : ""}`}
            value={contact.phone}
            onChange={(event) => setContact({ ...contact, phone: event.target.value.replace(/\D/g, "").slice(0, 10) })}
            placeholder="10-digit number"
          />
          {errors.phone ? <span className="mt-1 block text-[11px] text-rose-600">{errors.phone}</span> : null}
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button type="button" onClick={onContinue} className="btn btn-primary px-5 py-2.5">
          Continue <ArrowRight className="h-4 w-4" />
        </button>
        <button type="button" onClick={onBack} className="btn btn-ghost px-4 py-2.5 text-xs">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to trains
        </button>
        <p className="ml-auto text-[11px] text-ink-400">Max {MAX_PASSENGERS} passengers per booking</p>
      </div>
    </div>
  );
}

function FareSummary({ selected, fare, search, passengers, step }) {
  const { result, classCode } = selected;
  const from = getStation(result.fromStop.code);
  const to = getStation(result.toStop.code);
  return (
    <aside className="card sticky top-24 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-400">Fare summary</p>
      <div className="mt-3 rounded-xl bg-ink-950 p-4 text-white">
        <p className="text-xs text-ink-300">{result.train.name}</p>
        <p className="mt-1 font-display text-lg font-bold">
          {from.code} <ArrowRight className="inline h-3.5 w-3.5 text-amber-400" /> {to.code}
        </p>
        <p className="mt-1 text-[11px] text-ink-400">
          {formatDate(search.date)} · {classCode} · {formatTime12(result.departure)}
        </p>
      </div>
      <div className="mt-4 space-y-2.5">
        <SummaryRow
          label={`Base fare × ${passengers.length}`}
          value={formatINR(Math.round(fare.base))}
        />
        <SummaryRow label="Convenience fee" value={formatINR(fare.convenience)} />
        <SummaryRow label="GST (5%)" value={formatINR(fare.gst)} />
        <div className="border-t border-dashed border-ink-200 pt-3">
          <SummaryRow label="Total payable" value={formatINR(fare.total)} strong />
        </div>
      </div>
      <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-[11px] font-medium text-emerald-700">
        <IndianRupee className="mr-1 inline h-3 w-3" />
        Demo checkout — no card required, no money charged.
      </div>
      <ul className="mt-4 space-y-2 text-[11px] text-ink-500">
        <li className="flex gap-2">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> Free cancellation up to 4 hours before departure.
        </li>
        <li className="flex gap-2">
          <Ticket className="h-3.5 w-3.5 shrink-0 text-amber-600" /> Instant PNR and printable e-ticket.
        </li>
      </ul>
      {step === 2 ? <p className="mt-4 text-center text-[10px] text-ink-400">Complete passenger details to continue</p> : null}
    </aside>
  );
}
