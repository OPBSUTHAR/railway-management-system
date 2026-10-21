import { fareFor, coachFor } from "./fares";
import { addDays, todayISO } from "./dates";
import { getTrain } from "../data/railway";

export const KEYS = {
  users: "railsetu.users.v1",
  session: "railsetu.session.v1",
  bookings: "railsetu.bookings.v1",
  reservations: "railsetu.reservations.v1",
  support: "railsetu.support.v1",
  customTrains: "railsetu.custom-trains.v1",
  statuses: "railsetu.train-status.v1",
  seeded: "railsetu.seeded.v1",
};

export function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function update(key, updater, fallback = []) {
  const current = read(key, fallback);
  const next = updater(current);
  write(key, next);
  return next;
}

const DEMO_HASH = "7b11eed5c273f2597834a2106bd4f354d4526e5a1245669e0771634f5d0ca17b";

export function seedDemoData() {
  if (typeof window === "undefined") return;
  if (read(KEYS.seeded, null)) return;

  const users = read(KEYS.users, []);
  if (!users.some((user) => user.username === "demo")) {
    users.push({
      username: "demo",
      name: "Demo Traveller",
      passwordHash: DEMO_HASH,
      createdAt: new Date().toISOString(),
    });
    write(KEYS.users, users);
  }

  const bookings = read(KEYS.bookings, []);
  if (!bookings.some((booking) => booking.pnr === "4820193756")) {
    const train = getTrain("12951");
    const travelDate = addDays(todayISO(), 3);
    const seats = coachFor(train.number, travelDate, "3A", 1);
    bookings.push({
      id: "BK-DEMO-4820",
      pnr: "4820193756",
      username: "demo",
      trainNumber: train.number,
      trainName: train.name,
      from: "BCT",
      to: "NDLS",
      date: travelDate,
      classCode: "3A",
      passengers: [{ name: "Demo Traveller", age: 31, gender: "Male" }],
      fare: fareFor(1384, "3A") + 30,
      coach: seats.coach,
      seats: seats.seats,
      status: "CONFIRMED",
      contact: { email: "demo@railsetu.in", phone: "9876543210" },
      createdAt: new Date().toISOString(),
    });
    write(KEYS.bookings, bookings);
  }

  const reservations = read(KEYS.reservations, []);
  if (!reservations.some((reservation) => reservation.id === "RSV-DEMO-1209")) {
    reservations.push({
      id: "RSV-DEMO-1209",
      username: "demo",
      trainNumber: "12009",
      trainName: "Mumbai Pune Shatabdi Express",
      from: "BCT",
      to: "PUNE",
      date: addDays(todayISO(), 1),
      classCode: "CC",
      preference: "Window",
      coach: "C2",
      seats: ["14"],
      name: "Demo Traveller",
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
    });
    write(KEYS.reservations, reservations);
  }

  write(KEYS.seeded, { version: 1, seededAt: new Date().toISOString() });
}

export function getBookingsFor(username) {
  return read(KEYS.bookings, [])
    .filter((booking) => booking.username === username)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getReservationsFor(username) {
  return read(KEYS.reservations, [])
    .filter((reservation) => reservation.username === username)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function findBookingByPNR(pnr) {
  return read(KEYS.bookings, []).find((booking) => booking.pnr === String(pnr).trim()) || null;
}
