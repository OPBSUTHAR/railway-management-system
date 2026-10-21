import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Armchair,
  CalendarDays,
  CheckCircle2,
  Info,
  Lock,
  RefreshCw,
  Ticket,
  TrainFront,
  Users,
  X,
} from "lucide-react";
import PageHero from "../components/PageHero";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { CLASS_META, TRAINS, getStation, getTrain, routeDistance } from "../data/railway";
import { coachFor, fareFor, hashString, seatTypeFor } from "../lib/fares";
import { addDays, formatDate, formatINR, todayISO } from "../lib/dates";
import { getReservationsFor, KEYS, read, write } from "../lib/storage";
import { generateId } from "../lib/pnr";

const MAX_SEATS = 4;
const SEAT_COUNT = 48;
const PREFERENCES = ["No preference", "Window", "Aisle", "Middle", "Lower berth", "Upper berth"];

export default function Reservation() {
  const { user } = useAuth();
  const toast = useToast();
  const [trainNumber, setTrainNumber] = useState("12009");
  const [classCode, setClassCode] = useState("CC");
  const [date, setDate] = useState(addDays(todayISO(), 1));
  const [seats, setSeats] = useState([]);
  const [name, setName] = useState(user?.name || "");
  const [preference, setPreference] = useState("Window");
  const [reservations, setReservations] = useState(() => (user ? getReservationsFor(user.username) : []));

  const train = getTrain(trainNumber);
  const distance = routeDistance(train.route);
  const from = getStation(train.route[0].code);
  const to = getStation(train.route.at(-1).code);
  const coach = useMemo(() => coachFor(trainNumber, date, classCode, 1).coach, [trainNumber, date, classCode]);

  const occupancy = useMemo(() => {
    const map = {};
    for (let seat = 1; seat <= SEAT_COUNT; seat += 1) {
      map[seat] = hashString(`${trainNumber}:${date}:${classCode}:${seat}`) % 100 < 32;
    }
    return map;
  }, [trainNumber, date, classCode]);

  const farePerSeat = fareFor(distance, classCode);
  const total = farePerSeat * seats.length + (seats.length > 0 ? 20 : 0);

  function changeTrain(number) {
    const next = getTrain(number);
    setTrainNumber(number);
    setClassCode(next.classes[0]);
    setSeats([]);
  }

  function changeClass(code) {
    setClassCode(code);
    setSeats([]);
  }

  function toggleSeat(seat) {
    if (occupancy[seat]) return;
    setSeats((current) => {
      if (current.includes(seat)) return current.filter((value) => value !== seat);
      if (current.length >= MAX_SEATS) {
        toast.info(`You can reserve up to ${MAX_SEATS} seats at a time.`);
        return current;
      }
      return [...current, seat].sort((a, b) => a - b);
    });
  }

  function reserve() {
    if (!user) {
      toast.error("Please sign in to reserve seats.");
      return;
    }
    if (seats.length === 0) {
      toast.error("Pick at least one seat on the coach map.");
      return;
    }
    if (name.trim().length < 2) {
      toast.error("Enter the passenger name.");
      return;
    }
    const record = {
      id: generateId("RSV"),
      username: user.username,
      trainNumber: train.number,
      trainName: train.name,
      from: from.code,
      to: to.code,
      date,
      classCode,
      preference,
      coach,
      seats: seats.map((seat) => String(seat).padStart(2, "0")),
      name: name.trim(),
      fare: total,
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
    };
    write(KEYS.reservations, [record, ...read(KEYS.reservations, [])]);
    setReservations(getReservationsFor(user.username));
    setSeats([]);
    toast.success(`Seats reserved · ${coach} ${record.seats.join(", ")}`);
  }

  function cancelReservation(id) {
    const all = read(KEYS.reservations, []).map((item) =>
      item.id === id ? { ...item, status: "CANCELLED", cancelledAt: new Date().toISOString() } : item,
    );
    write(KEYS.reservations, all);
    setReservations(getReservationsFor(user.username));
    toast.success("Reservation cancelled and released.");
  }

  return (
    <div>
      <PageHero
        eyebrow="Seat reservations"
        title="Choose the exact seat you want."
        description="A live coach map for every class — pick a window, an aisle or a lower berth. Reserved seats are held instantly against your account."
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2 text-xs font-semibold text-ink-600">
            <Armchair className="h-4 w-4 text-amber-600" /> Up to {MAX_SEATS} seats per booking
          </span>
        }
      />

      <section className="container-x py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="card p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="block sm:col-span-2">
                <span className="field-label">Train</span>
                <select className="field mt-1.5" value={trainNumber} onChange={(event) => changeTrain(event.target.value)}>
                  {TRAINS.map((item) => (
                    <option key={item.number} value={item.number}>
                      {item.number} · {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="field-label">Travel date</span>
                <input
                  type="date"
                  className="field mt-1.5"
                  value={date}
                  min={todayISO()}
                  max={addDays(todayISO(), 90)}
                  onChange={(event) => {
                    setDate(event.target.value);
                    setSeats([]);
                  }}
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {train.classes.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => changeClass(code)}
                  className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
                    classCode === code
                      ? "border-ink-950 bg-ink-950 text-white"
                      : "border-ink-200 bg-white text-ink-600 hover:border-ink-300"
                  }`}
                >
                  <span className="block font-bold">{code}</span>
                  <span className={classCode === code ? "text-ink-300" : "text-ink-400"}>{CLASS_META[code]?.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-ink-100 bg-ink-50/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-500">
                <span className="inline-flex items-center gap-1.5">
                  <TrainFront className="h-3.5 w-3.5 text-amber-600" /> Coach {coach}
                </span>
                <span>{from.code} → {to.code}</span>
                <span>Engine this way ↑</span>
              </div>

              <div className="mx-auto mt-4 max-w-sm rounded-xl border border-ink-200 bg-white p-3 shadow-inner">
                <div className="space-y-2">
                  {Array.from({ length: SEAT_COUNT / 6 }, (_, row) => (
                    <div key={row} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                      <div className="grid grid-cols-3 gap-1.5">
                        {[0, 1, 2].map((column) => {
                          const seat = row * 6 + column + 1;
                          return (
                            <SeatButton
                              key={seat}
                              seat={seat}
                              occupied={occupancy[seat]}
                              selected={seats.includes(seat)}
                              type={seatTypeFor(classCode, seat)}
                              onClick={() => toggleSeat(seat)}
                            />
                          );
                        })}
                      </div>
                      <span className="w-5 text-center text-[9px] text-ink-300">{row + 1}</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[3, 4, 5].map((column) => {
                          const seat = row * 6 + column + 1;
                          return (
                            <SeatButton
                              key={seat}
                              seat={seat}
                              occupied={occupancy[seat]}
                              selected={seats.includes(seat)}
                              type={seatTypeFor(classCode, seat)}
                              onClick={() => toggleSeat(seat)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[10px] text-ink-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded border border-ink-200 bg-white" /> Available
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded border border-amber-500 bg-amber-400" /> Selected
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded border border-ink-200 bg-ink-100" /> Occupied
                </span>
              </div>
            </div>

            <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Seat availability is generated deterministically for this demo. {seats.length} of {MAX_SEATS} seats selected.
            </p>
          </div>

          <aside className="card sticky top-24 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-400">Reservation summary</p>
            <div className="mt-3 rounded-xl bg-ink-950 p-4 text-white">
              <p className="text-xs text-ink-300">{train.name}</p>
              <p className="mt-1 font-display text-lg font-bold">
                {from.code} → {to.code}
              </p>
              <p className="mt-1 text-[11px] text-ink-400">
                {formatDate(date)} · {classCode} · Coach {coach}
              </p>
            </div>

            <div className="mt-4 grid gap-3">
              <label className="block">
                <span className="field-label">Passenger name</span>
                <input
                  className="field mt-1.5"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Full name"
                />
              </label>
              <label className="block">
                <span className="field-label">Seat preference</span>
                <select className="field mt-1.5" value={preference} onChange={(event) => setPreference(event.target.value)}>
                  {PREFERENCES.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50 p-3">
              <div className="flex items-center justify-between text-xs text-ink-500">
                <span>Seats</span>
                <span className="font-semibold text-ink-900">{seats.length > 0 ? seats.map((seat) => String(seat).padStart(2, "0")).join(", ") : "None yet"}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-ink-500">
                <span>Fare per seat</span>
                <span className="font-semibold text-ink-900">{formatINR(farePerSeat)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-ink-500">
                <span>Reservation fee</span>
                <span className="font-semibold text-ink-900">{formatINR(seats.length > 0 ? 20 : 0)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-dashed border-ink-200 pt-3">
                <span className="text-sm font-bold text-ink-900">Total</span>
                <span className="font-display text-lg font-extrabold text-ink-900">{formatINR(total)}</span>
              </div>
            </div>

            {!user ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <p className="flex items-center gap-1.5 font-bold">
                  <Lock className="h-3.5 w-3.5" /> Sign in to hold seats
                </p>
                <div className="mt-2 flex gap-2">
                  <Link to="/login?next=/reservation" className="btn btn-primary px-3 py-1.5 text-[11px]">
                    Log in
                  </Link>
                  <Link to="/signup?next=/reservation" className="btn border border-amber-300 bg-white px-3 py-1.5 text-[11px] text-amber-900">
                    Sign up
                  </Link>
                </div>
              </div>
            ) : (
              <button type="button" onClick={reserve} className="btn btn-primary mt-4 w-full py-3" disabled={seats.length === 0}>
                <Ticket className="h-4 w-4" /> Reserve {seats.length || ""} seat{seats.length === 1 ? "" : "s"}
              </button>
            )}
            <button
              type="button"
              onClick={() => setSeats([])}
              className="btn btn-ghost mt-2 w-full text-xs"
              disabled={seats.length === 0}
            >
              <RefreshCw className="h-3.5 w-3.5" /> Clear selection
            </button>
          </aside>
        </div>

        <div className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold">My reservations</h2>
              <p className="mt-1 text-xs text-ink-500">Seats held against your account for upcoming journeys.</p>
            </div>
            {!user ? <span className="chip bg-white text-ink-500">Sign in to see your reservations</span> : null}
          </div>

          {user && reservations.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-ink-200 bg-white p-8 text-center">
              <Users className="mx-auto h-7 w-7 text-ink-300" />
              <p className="mt-2 text-sm font-semibold text-ink-700">No reservations yet</p>
              <p className="text-xs text-ink-500">Pick seats above and they'll appear here.</p>
            </div>
          ) : null}

          <div className="mt-4 grid gap-3">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className={`flex flex-wrap items-center gap-4 rounded-2xl border bg-white p-4 ${
                  reservation.status === "CANCELLED" ? "border-ink-100 opacity-70" : "border-ink-100"
                }`}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-950 font-mono text-[10px] font-bold text-amber-300">
                  {reservation.classCode}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink-900">{reservation.trainName}</p>
                  <p className="mt-0.5 text-[11px] text-ink-500">
                    <span className="font-mono text-ink-700">{reservation.id}</span> · {formatDate(reservation.date)} ·{" "}
                    {reservation.from} → {reservation.to} · Coach {reservation.coach} · Seats{" "}
                    {reservation.seats.join(", ")}
                  </p>
                </div>
                <StatusBadge status={reservation.status === "CANCELLED" ? "CANCELLED" : "CONFIRMED"} />
                {reservation.status !== "CANCELLED" ? (
                  <button
                    type="button"
                    onClick={() => cancelReservation(reservation.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    <X className="h-3 w-3" /> Cancel
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SeatButton({ seat, occupied, selected, type, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={occupied}
      title={`Seat ${seat} · ${type}${occupied ? " · occupied" : ""}`}
      className={`flex h-9 items-center justify-center rounded-md border text-[10px] font-bold transition ${
        occupied
          ? "cursor-not-allowed border-ink-100 bg-ink-100 text-ink-300"
          : selected
            ? "border-amber-500 bg-amber-400 text-ink-950 shadow-sm"
            : "border-ink-200 bg-white text-ink-600 hover:border-amber-400 hover:bg-amber-50"
      }`}
    >
      {occupied ? <X className="h-3 w-3" /> : String(seat).padStart(2, "0")}
    </button>
  );
}
