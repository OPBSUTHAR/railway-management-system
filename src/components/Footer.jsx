import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Logo from "./Logo";

const COLUMNS = [
  {
    title: "Travel",
    links: [
      { to: "/booking", label: "Book a ticket" },
      { to: "/reservation", label: "Reserve a seat" },
      { to: "/tracking", label: "Live train tracking" },
      { to: "/bookings", label: "My tickets" },
    ],
  },
  {
    title: "Explore",
    links: [
      { to: "/schedule", label: "Train timetables" },
      { to: "/scheduling", label: "Schedule management" },
      { to: "/about", label: "About RailSetu" },
      { to: "/support", label: "Help centre" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/terms", label: "Terms & conditions" },
      { to: "/terms#privacy", label: "Privacy policy" },
      { to: "/terms#ticketing", label: "Refund policy" },
      { to: "/terms#conduct", label: "Code of conduct" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer-glass mt-auto border-t border-white/15 text-white">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo dark />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/50">
            A complete railway management experience — discover trains, book journeys, reserve seats and
            follow every mile in real time.
          </p>
          <div className="mt-6 space-y-2.5 text-sm text-white/60">
            <p className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-amber-400" /> hello@railsetu.in
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-amber-400" /> 139 · 24×7 passenger helpline
            </p>
            <p className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-amber-400" /> Rail Bhavan, New Delhi 110001
            </p>
          </div>
          <div className="mt-6 flex gap-2">
            {[
              { icon: Twitter, label: "Twitter" },
              { icon: Instagram, label: "Instagram" },
              { icon: Facebook, label: "Facebook" },
            ].map((social) => (
              <a
                key={social.label}
                href="https://www.irctc.co.in"
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/60 transition hover:border-amber-400 hover:text-amber-400"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
              {column.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/65 transition hover:text-amber-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RailSetu Railway Management System. All rights reserved.</p>
          <p className="max-w-xl sm:text-right">
            An independent academic demo built with React. Not affiliated with Indian Railways or IRCTC.
          </p>
        </div>
      </div>
    </footer>
  );
}
