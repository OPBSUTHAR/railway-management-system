import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck2, IndianRupee, Plus, Printer, Ticket, TicketX, TrainFront } from "lucide-react";
import PageHero from "../components/PageHero";
import StatusBadge from "../components/StatusBadge";
import TicketCard from "../components/TicketCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getBookingsFor, KEYS, read, write } from "../lib/storage";
import { formatINR, todayISO } from "../lib/dates";

const TABS = [
  { id: "ALL", label: "All tickets" },
  { id: "CONFIRMED", label: "Confirmed" },
  { id: "WAITLISTED", label: "Waitlisted" },
  { id: "CANCELLED", label: "Cancelled" },
];

export default function MyBookings() {
  const { user } = useAuth();
  const toast = useToast();
  const [bookings, setBookings] = useState(() => getBookingsFor(user.username));
  const [tab, setTab] = useState("ALL");
  const [cancelTarget, setCancelTarget] = useState(null);

  const filtered = useMemo(
    () => (tab === "ALL" ? bookings : bookings.filter((booking) => booking.status === tab)),
    [bookings, tab],
  );

  const stats = useMemo(() => {
    const upcoming = bookings.filter((booking) => booking.status !== "CANCELLED" && booking.date >= todayISO());
    const spend = bookings.filter((booking) => booking.status !== "CANCELLED").reduce((sum, booking) => sum + booking.fare, 0);
    return { total: bookings.length, upcoming: upcoming.length, spend };
  }, [bookings]);

  function cancelBooking() {
    if (!cancelTarget) return;
    const all = read(KEYS.bookings, []).map((booking) =>
      booking.id === cancelTarget.id ? { ...booking, status: "CANCELLED", cancelledAt: new Date().toISOString() } : booking,
    );
    write(KEYS.bookings, all);
    setBookings(getBookingsFor(user.username));
    toast.success(`PNR ${cancelTarget.pnr} cancelled. Refund reference generated.`);
    setCancelTarget(null);
  }

  return (
    <div>
      <PageHero
        eyebrow="My tickets"
        title="Every journey, neatly filed."
        description="Print e-tickets, check coach and seat details, or cancel a trip. Cancellations in this demo update instantly and generate a refund reference."
        actions={
          <Link to="/booking" className="btn btn-primary px-5 py-2.5">
            <Plus className="h-4 w-4" /> Book a new ticket
          </Link>
        }
      >
        <div className="mt-8 grid gap-3 sm:grid-cols-3 sm:max-w-2xl">
          <div className="rounded-xl border border-ink-100 bg-white p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-400">
              <Ticket className="h-3.5 w-3.5" /> Total tickets
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-ink-100 bg-white p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-400">
              <CalendarCheck2 className="h-3.5 w-3.5" /> Upcoming
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold">{stats.upcoming}</p>
          </div>
          <div className="rounded-xl border border-ink-100 bg-white p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-400">
              <IndianRupee className="h-3.5 w-3.5" /> Active spend
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold">{formatINR(stats.spend)}</p>
          </div>
        </div>
      </PageHero>

      <section className="bubble-section container-x py-10">
        <div className="flex flex-wrap gap-2">
          {TABS.map((item) => {
            const count = item.id === "ALL" ? bookings.length : bookings.filter((booking) => booking.status === item.id).length;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-md border px-4 py-2 text-xs font-semibold transition ${
                  tab === item.id
                    ? "border-ink-950 bg-ink-950 text-white"
                    : "border-ink-200 bg-white text-ink-600 hover:border-ink-300"
                }`}
              >
                {item.label} <span className={tab === item.id ? "text-amber-300" : "text-ink-400"}>({count})</span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-ink-50 text-ink-400">
              <TicketX className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-display text-xl font-bold">
              {bookings.length === 0 ? "No tickets yet" : "Nothing in this tab"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
              {bookings.length === 0
                ? "Your first e-ticket is a search away. Try the demo route Mumbai → Delhi for a quick look."
                : "Switch tabs to see your other tickets."}
            </p>
            {bookings.length === 0 ? (
              <Link to="/booking?from=BCT&to=NDLS" className="btn btn-primary mt-5 px-5 py-2.5">
                <TrainFront className="h-4 w-4" /> Find a train
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="mt-6 grid gap-5">
            {filtered.map((booking) => (
              <TicketCard key={booking.id} booking={booking}>
                <StatusBadge
                  status={booking.status === "CANCELLED" ? "Refund processing" : booking.status === "WAITLISTED" ? "Waitlisted" : "Confirmed"}
                  tone={booking.status === "CANCELLED" ? "ink" : booking.status === "WAITLISTED" ? "amber" : "emerald"}
                  className="mr-auto"
                />
                <button type="button" onClick={() => window.print()} className="btn btn-outline px-3 py-2 text-xs">
                  <Printer className="h-3.5 w-3.5" /> Print
                </button>
                {booking.status !== "CANCELLED" ? (
                  <button
                    type="button"
                    onClick={() => setCancelTarget(booking)}
                    className="btn border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 hover:bg-rose-100"
                  >
                    Cancel ticket
                  </button>
                ) : (
                  <Link
                    to={`/booking?from=${booking.from}&to=${booking.to}`}
                    className="btn btn-ghost px-3 py-2 text-xs"
                  >
                    Book again
                  </Link>
                )}
              </TicketCard>
            ))}
          </div>
        )}
      </section>

      {cancelTarget ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-ink-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-rose-50 text-rose-600">
              <TicketX className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-xl font-bold">Cancel PNR {cancelTarget.pnr}?</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              This releases your seat on <span className="font-semibold text-ink-800">{cancelTarget.trainName}</span>. In the
              demo, the fare of {formatINR(cancelTarget.fare)} is shown as refunded to the original payment method.
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={() => setCancelTarget(null)} className="btn btn-outline px-4 py-2 text-xs">
                Keep ticket
              </button>
              <button type="button" onClick={cancelBooking} className="btn bg-rose-600 px-4 py-2 text-xs text-white hover:bg-rose-700">
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
