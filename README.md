# RailSetu — Railway Management System

**RailSetu** is a complete railway booking and operations web app for Indian Railways-style travel. Search across every intermediate stop, compare classes and fares, book an instant e-ticket, reserve an exact seat on a coach map, follow a train live on a map, and manage the timetable from one calm interface.

This project was migrated from a static HTML/CSS/JS college project (`railway-system.7z`) into a modern, fully responsive React application. The original Express + MongoDB backend and static pages are preserved under [`legacy/`](legacy) for reference.

> **Live demo:** [railway-management-system-nine.vercel.app](https://railway-management-system-nine.vercel.app)  
> **Repository:** [github.com/OPBSUTHAR/railway-management-system](https://github.com/OPBSUTHAR/railway-management-system)

---

## Demo account

The deployed app runs in **demo mode** — no database or payment gateway is required.

| Username | Password |
| -------- | -------- |
| `demo`   | `demo1234` |

The account is seeded on first load with a sample ticket (PNR `4820193756`, Mumbai Rajdhani) and a seat reservation. You can also create a fresh account from the Sign up page.

> Payments are simulated. No real money is charged and no ticket is issued by Indian Railways or IRCTC. RailSetu is an independent demo project and is **not affiliated with Indian Railways**.

---

## Features

- **Journey search** — 22 curated services and 39+ stations, with every intermediate stop indexed. Filter by class (`SL`, `3A`, `2A`, `1A`, `CC`, `EC`) and date; results respect each train's running days.
- **End-to-end booking** — 4-step flow (choose train → passengers → review & pay → ticket) with live fare breakdown, GST, convenience fee, deterministic seat allocation, waitlist handling and printable e-tickets.
- **My tickets** — filter confirmed, waitlisted and cancelled bookings; cancel a ticket with confirmation; print any e-ticket.
- **Seat reservations** — interactive 48-seat coach map with window/aisle/middle seat types, up to four seats, and a reservation summary.
- **Live train tracking** — Leaflet + OpenStreetMap view of the route, simulated position based on the current time, delay estimate, distance covered, next halt and a stop-by-stop timeline. Track by train or by PNR.
- **Timetables** — search the full network by train number, name, city or station code, including five coastal services carried over from the original project. Expand any service to see every halt.
- **Operations console** — set a service to on time, delayed or cancelled; add and delete custom trains with generated routes. Great for showing how the timetable is managed.
- **Help centre** — validated support form with reference numbers, a personal request history and FAQs.
- **Authentication** — client-side accounts with SHA-256 password hashing, persistent sessions and protected routes.
- **Polish** — responsive layouts, dark hero, custom SVG logo, accessible forms, toast notifications, print styles and reduced-motion-friendly animation.

---

## Tech stack

| Layer | Choice |
| ----- | ------ |
| UI | React 19, React Router 7 |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Icons | lucide-react |
| Maps | Leaflet 1.9 + OpenStreetMap tiles |
| Data | Seeded static network + `localStorage` persistence |
| Hosting | Vercel (static SPA + rewrites) |

No runtime API is required. Fares, availability and seat maps are generated deterministically from the train, date and class, so the demo behaves consistently between visits.

### Data model (localStorage)

| Key | Contents |
| --- | -------- |
| `railsetu.users.v1` | Accounts with hashed passwords |
| `railsetu.session.v1` | Current signed-in user |
| `railsetu.bookings.v1` | Tickets, PNRs, passengers, seats |
| `railsetu.reservations.v1` | Seat reservations |
| `railsetu.support.v1` | Help centre requests |
| `railsetu.custom-trains.v1` | Trains added in the operations console |
| `railsetu.train-status.v1` | Status overrides per service |
| `railsetu.seeded.v1` | Demo seed marker |

Clearing site data resets the demo to its seeded state.

---

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # preview the production build
```

Requires Node.js **24.x** (Vite 7 also supports 20.19+). No environment variables are needed for the demo.

### Deploy to Vercel

```bash
vercel --prod
```

`vercel.json` configures the Vite build and rewrites every route to `index.html`, so client-side routes such as `/tracking` work on refresh.

---

## Project structure

```
railway-management-system/
├─ public/
│  ├─ images/          # hero, page imagery, logo and favicon
│  └─ media/           # compressed hero video
├─ src/
│  ├─ components/      # Navbar, Footer, SearchBar, TicketCard, Stepper, …
│  ├─ context/         # Auth + toast providers
│  ├─ data/railway.js  # stations, trains, routes, legacy timetables
│  ├─ lib/             # fares, dates, PNR, storage helpers
│  ├─ pages/           # Home, Booking, MyBookings, Reservation, Tracking, …
│  ├─ App.jsx          # routes and shell
│  └─ main.jsx         # entry point + demo seeding
├─ legacy/
│  ├─ backend/         # original Express + Mongoose API
│  └─ frontend/        # original static HTML/CSS/JS pages
├─ vercel.json
└─ vite.config.js
```

### Original backend (legacy)

`legacy/backend` is the untouched Express + Mongoose reference implementation with routes for login, signup, booking, reservation, support, trains and live tracking. It requires a MongoDB connection string and is **not** used by the deployed app. It remains in the repository so the original full-stack work can be reviewed and wired up later.

To run it:

```bash
cd legacy/backend
npm install
# set your MongoDB URI in database.js or via a local .env
npm start
```

---

## Notes and limitations

- This is a **demonstration application**, not a commercial ticketing service.
- Accounts, bookings and reservations live in the browser's `localStorage`; they are not shared between devices.
- Train names, numbers, timings and fares are indicative and based on public timetable data. They may not reflect current Indian Railways schedules.
- Live tracking is a simulation derived from the timetable and current clock time, not a real GPS feed.
- The original hero footage was compressed for the web; the full-resolution source is intentionally not committed.

## License

Released for educational and portfolio use. Third-party images and timetables remain the property of their respective owners.
