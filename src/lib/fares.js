import { CLASS_META } from "../data/railway";

export function hashString(value) {
  let hash = 2166136261;
  const text = String(value);
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function fareFor(km, classCode) {
  const meta = CLASS_META[classCode];
  if (!meta) return 0;
  const raw = meta.base + meta.rate * km;
  return Math.max(meta.base, Math.round(raw / 5) * 5);
}

export function lowestFare(train) {
  const distance = train.route[train.route.length - 1].km - train.route[0].km;
  return Math.min(...train.classes.map((code) => fareFor(distance, code)));
}

export function totalFare(train, distance, classCode, passengerCount = 1) {
  const base = fareFor(distance, classCode) * passengerCount;
  const convenience = passengerCount > 0 ? 30 : 0;
  const gst = Math.round(base * 0.05);
  return { base, convenience, gst, total: base + convenience + gst };
}

export function availability(trainNumber, date, classCode) {
  const seed = hashString(`${trainNumber}:${date}:${classCode}`);
  const waitlisted = seed % 13 === 0;
  if (waitlisted) {
    return { status: "WL", seats: (seed % 19) + 1 };
  }
  return { status: "AVAILABLE", seats: 4 + (seed % 68) };
}

const COACH_PREFIX = { SL: "S", "3A": "B", "2A": "A", "1A": "H", CC: "C", EC: "E" };

export function coachFor(trainNumber, date, classCode, passengerCount) {
  const seed = hashString(`${trainNumber}-${date}-${classCode}`);
  const coach = `${COACH_PREFIX[classCode] || "C"}${(seed % 5) + 1}`;
  const seats = new Set();
  let cursor = (seed % 60) + 1;
  while (seats.size < passengerCount) {
    seats.add(cursor);
    cursor += 3;
    if (cursor > 72) cursor = 1;
  }
  return { coach, seats: [...seats].map((seat) => String(seat).padStart(2, "0")) };
}

export function seatTypeFor(classCode, seatNumber) {
  const chair = classCode === "CC" || classCode === "EC";
  if (chair) {
    return ["Window", "Middle", "Aisle", "Aisle", "Middle", "Window"][(seatNumber - 1) % 6];
  }
  return ["Lower", "Middle", "Upper", "Side Lower", "Side Upper", "Lower", "Middle", "Upper"][
    (seatNumber - 1) % 8
  ];
}
