import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  Menu,
  Ticket,
  Armchair,
  CalendarCog,
  LifeBuoy,
  X,
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const PRIMARY_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/booking", label: "Book" },
  { to: "/reservation", label: "Reserve" },
  { to: "/tracking", label: "Track" },
  { to: "/schedule", label: "Timetables" },
  { to: "/support", label: "Support" },
];

const MENU_LINKS = [
  { to: "/bookings", label: "My tickets", icon: Ticket },
  { to: "/reservation", label: "Seat reservations", icon: Armchair },
  { to: "/scheduling", label: "Manage schedules", icon: CalendarCog },
  { to: "/support", label: "Help centre", icon: LifeBuoy },
];

function navClass({ isActive }) {
  return `relative rounded-full px-3.5 py-2 text-sm font-medium transition ${
    isActive ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
  }`;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { push } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setMobileOpen(false);
    push("You have been logged out.", "info");
    navigate("/");
  };

  return (
    <header className="navbar-glass sticky top-0 z-50 border-b border-white/15 text-white">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo dark />

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {PRIMARY_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1.5 pl-1.5 pr-3 text-sm font-medium transition hover:border-white/30 hover:bg-white/10"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-amber-400 text-xs font-bold text-ink-950">
                  {user.username.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden max-w-24 truncate sm:block">{user.username}</span>
                <ChevronDown className={`h-4 w-4 text-white/50 transition ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              {menuOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-white/70 bg-white/70 p-2 text-ink-900 shadow-float backdrop-blur-2xl"
                >
                  <div className="border-b border-ink-100 px-3 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">Signed in as</p>
                    <p className="truncate text-sm font-semibold">{user.username}</p>
                  </div>
                  <div className="py-1">
                    {MENU_LINKS.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        role="menuitem"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-50 hover:text-ink-950"
                      >
                        <item.icon className="h-4 w-4 text-ink-400" />
                        {item.label}
                      </Link>
                    ))}
                    <Link
                      to="/about"
                      role="menuitem"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-50 hover:text-ink-950"
                    >
                      <span className="h-4 w-4 text-center text-[11px] font-bold text-ink-400">i</span>
                      About RailSetu
                    </Link>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-full px-3.5 py-2 text-sm font-medium text-white/70 transition hover:text-white sm:block"
              >
                Log in
              </Link>
              <Link to="/signup" className="btn-amber !px-4 !py-2 text-sm">
                Sign up
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 transition hover:bg-white/10 lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/15 bg-ink-950/75 backdrop-blur-2xl lg:hidden">
          <div className="container-x grid gap-1 py-4">
            {PRIMARY_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-3 text-base font-medium transition ${
                    isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <NavLink to="/about" className="rounded-xl px-3 py-2 text-sm text-white/60 hover:bg-white/5">
                About us
              </NavLink>
              <NavLink to="/terms" className="rounded-xl px-3 py-2 text-sm text-white/60 hover:bg-white/5">
                Terms & privacy
              </NavLink>
            </div>
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-sm font-medium text-rose-300 hover:bg-white/5"
              >
                <LogOut className="h-4 w-4" /> Log out ({user.username})
              </button>
            ) : (
              <Link
                to="/login"
                className="mt-2 rounded-xl border border-white/15 px-3 py-3 text-center text-sm font-semibold text-white hover:bg-white/5"
              >
                Log in to your account
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
