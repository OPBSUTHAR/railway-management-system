import { ArrowRight, Armchair, CalendarDays, IndianRupee, Users } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { getSchedule, getStation, getTrain } from "../data/railway";
import { formatDate, formatINR, formatTime12 } from "../lib/dates";
import { hashString } from "../lib/fares";

function useJourney(booking) {
  const stops = getSchedule(booking.trainNumber)?.route || [];
  const from = stops.find((stop) => stop.code === booking.from);
  const to = stops.find((stop) => stop.code === booking.to);
  return {
    departure: from?.dep || from?.arr || "—",
    arrival: to?.arr || to?.dep || "—",
  };
}

function FakeQr({ value }) {
  const cells = Array.from({ length: 81 }, (_, index) => hashString(`${value}-${index}`) % 100 < 46);
  return (
    <div className="grid h-20 w-20 shrink-0 grid-cols-9 gap-[2px] rounded-lg bg-white p-1.5">
      {cells.map((filled, index) => (
        <span key={index} className={filled ? "bg-ink-900" : "bg-white"} />
      ))}
    </div>
  );
}

export default function TicketCard({ booking, children }) {
  const train = getTrain(booking.trainNumber);
  const from = getStation(booking.from);
  const to = getStation(booking.to);
  const { departure, arrival } = useJourney(booking);
  const cancelled = booking.status === "CANCELLED";

  return (
    <article className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-[0_18px_50px_-30px_rgba(6,11,20,0.5)]">
      <div className="flex flex-wrap items-start justify-between gap-4 bg-ink-950 p-5 text-white sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-14 shrink-0 place-items-center rounded-md bg-amber-400 font-mono text-[10px] font-bold tracking-tight text-ink-950">
            {train ? train.number : "RS"}
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">
              E-ticket · Indian Railways
            </p>
            <h3 className="font-display text-lg font-bold leading-tight">{train?.name || "RailSetu Express"}</h3>
            <p className="mt-0.5 text-xs text-ink-300">
              {train?.tag || "Express"} · {booking.classCode}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={booking.status} dot={false} />
          <FakeQr value={booking.pnr} />
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-2xl font-extrabold tracking-tight">{booking.from}</p>
            <p className="text-xs text-ink-500">{from?.name || booking.from}</p>
            <p className="mt-1 text-sm font-semibold text-ink-800">{formatTime12(departure)}</p>
          </div>
          <div className="flex flex-1 flex-col items-center px-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-400">
              {formatDate(booking.date)}
            </span>
            <span className="my-2 flex w-full items-center gap-1 text-amber-500">
              <span className="h-px flex-1 border-t border-dashed border-ink-200" />
              <ArrowRight className="h-3.5 w-3.5" />
              <span className="h-px flex-1 border-t border-dashed border-ink-200" />
            </span>
            <span className="text-[10px] font-semibold text-ink-400">{booking.classCode} class</span>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl font-extrabold tracking-tight">{booking.to}</p>
            <p className="text-xs text-ink-500">{to?.name || booking.to}</p>
            <p className="mt-1 text-sm font-semibold text-ink-800">{formatTime12(arrival)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-xl bg-ink-50 p-4 text-sm sm:grid-cols-4">
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-400">
              <CalendarDays className="h-3.5 w-3.5" /> PNR
            </p>
            <p className="mt-1 font-mono text-sm font-bold tracking-wider text-ink-900">{booking.pnr}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-400">
              <Armchair className="h-3.5 w-3.5" /> Seats
            </p>
            <p className="mt-1 font-semibold text-ink-900">
              {booking.coach} / {booking.seats.join(", ")}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-400">
              <Users className="h-3.5 w-3.5" /> Passengers
            </p>
            <p className="mt-1 font-semibold text-ink-900">{booking.passengers.length}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-400">
              <IndianRupee className="h-3.5 w-3.5" /> Fare paid
            </p>
            <p className="mt-1 font-semibold text-ink-900">{formatINR(booking.fare)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {booking.passengers.map((passenger, index) => (
            <span key={index} className="chip bg-white">
              {passenger.name} · {passenger.age}y
              {cancelled ? "" : ` · ${booking.seats[index]}`}
            </span>
          ))}
        </div>

        {children ? <div className="flex flex-wrap items-center gap-2 border-t border-dashed border-ink-200 pt-4">{children}</div> : null}
      </div>
    </article>
  );
}
