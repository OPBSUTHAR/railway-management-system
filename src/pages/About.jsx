import { Link } from "react-router-dom";
import { ArrowRight, Code2, Compass, Gauge, HeartHandshake, Layers, Map, ShieldCheck, TrainFront } from "lucide-react";
import PageHero from "../components/PageHero";

const VALUES = [
  {
    icon: Compass,
    title: "Clarity over clutter",
    text: "Every screen answers one question — where, when, how much — before it asks you for anything.",
  },
  {
    icon: ShieldCheck,
    title: "Trust in the details",
    text: "Transparent fare breakdowns, visible seat numbers and honest availability labels, even in a demo.",
  },
  {
    icon: HeartHandshake,
    title: "Support that stays",
    text: "A ticket is a promise. Help, refunds and changes live in the same account as the journey.",
  },
];

const TIMELINE = [
  { year: "1853", title: "The first passenger line", text: "Bori Bunder to Thane — 34 km that began the subcontinent's railway age." },
  { year: "1951", title: "One national network", text: "India's railways were reorganised into zones, linking every major region." },
  { year: "1985", title: "Reservation goes digital", text: "Computerised counters replaced handwritten charts and long queues." },
  { year: "Today", title: "RailSetu, rebuilt", text: "A modern React front end over the original college DBMS project, designed for the phone in your pocket." },
];

const STACK = [
  { label: "React 19 + Vite", detail: "Component-driven front end with fast builds" },
  { label: "Tailwind CSS v4", detail: "Utility-first design system and tokens" },
  { label: "Leaflet + OpenStreetMap", detail: "Route maps without a paid map key" },
  { label: "localStorage data layer", detail: "Accounts, bookings, seats and support threads" },
  { label: "Express + MongoDB legacy", detail: "The original API preserved in /legacy for reference" },
];

export default function About() {
  return (
    <div>
      <PageHero
        eyebrow="About RailSetu"
        title="A railway project, rebuilt for the way people actually travel."
        description="RailSetu began life as a database-management assignment. It is now a complete, responsive booking experience — a demonstration of how clear design can make a complex network feel simple."
        actions={
          <Link to="/booking" className="btn btn-primary px-5 py-2.5">
            Try the booking flow <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <section className="bubble-section container-x py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <img
                src="/images/tours.jpg"
                alt="A train winding through an Indian landscape"
                className="h-[320px] w-full object-cover sm:h-[420px]"
              />
            </div>
            <div className="absolute -bottom-6 right-4 rounded-2xl bg-ink-950 p-5 text-white shadow-2xl sm:right-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">The idea</p>
              <p className="mt-1 max-w-[13rem] font-display text-lg font-bold leading-snug">
                One calm workspace for the whole journey.
              </p>
            </div>
          </div>
          <div>
            <p className="eyebrow text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Our story
            </p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Built by a traveller who was tired of five tabs.
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-500">
              <p>
                The original project shipped a working Express and MongoDB API behind a set of static HTML pages. It
                could create a booking, but it couldn't tell you where the train was, which seat you'd get, or what to do
                when plans changed.
              </p>
              <p>
                So the whole experience was rebuilt around the actual journey: search every halt, compare classes with
                real fare maths, choose a seat on a coach map, carry a printable e-ticket and track the service on a map.
              </p>
              <p>
                RailSetu is still a demonstration project. There is no connection to Indian Railways or IRCTC, and every
                account lives only in your browser. But the flows are real, and the design is production-minded.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="chip border-ink-200 bg-white text-ink-600">React demo</span>
              <span className="chip border-ink-200 bg-white text-ink-600">No real payments</span>
              <span className="chip border-ink-200 bg-white text-ink-600">Open source</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bubble-section bg-paper/70">
        <div className="container-x py-14 sm:py-16">
          <div className="max-w-2xl">
            <p className="eyebrow text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> What we optimise for
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Three things, done properly.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-ink-100 bg-white p-5">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink-950 text-amber-300">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bubble-section container-x py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> A short history
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">170 years of rail, four turning points.</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              The network that moves more than a crore people a day didn't get here overnight. These are the moments
              that shaped the system RailSetu is modelled on.
            </p>
            <div className="mt-6 rounded-2xl bg-ink-950 p-5 text-white">
              <Gauge className="h-5 w-5 text-amber-400" />
              <p className="mt-2 font-display text-2xl font-extrabold">68,000+ km</p>
              <p className="text-xs text-ink-400">of track across the Indian network</p>
              <div className="mt-4 flex items-center gap-4 border-t border-white/10 pt-4 text-xs text-ink-300">
                <span className="inline-flex items-center gap-1.5">
                  <Map className="h-3.5 w-3.5 text-amber-400" /> 7,300 stations
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <TrainFront className="h-3.5 w-3.5 text-amber-400" /> 13,000 trains
                </span>
              </div>
            </div>
          </div>
          <ol className="relative border-l border-ink-200 pl-6">
            {TIMELINE.map((item, index) => (
              <li key={item.year} className={index < TIMELINE.length - 1 ? "pb-8" : ""}>
                <span className="absolute -left-[7px] mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-amber-500 bg-white" />
                <p className="font-mono text-xs font-bold text-amber-700">{item.year}</p>
                <h3 className="mt-1 font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-500">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bubble-section container-x pb-16">
        <div className="grid gap-6 rounded-3xl border border-ink-100 bg-white p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-950 text-amber-300">
              <Code2 className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold">Under the bonnet</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              A front-end-only build keeps the live demo free to host on Vercel. The original Express API and static pages
              remain in the repository for anyone who wants to wire this up to MongoDB later.
            </p>
            <Link to="/terms" className="link-underline mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-800">
              Read the demo terms <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-2">
            {STACK.map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-lg border border-ink-100 px-3 py-2.5">
                <Layers className="h-4 w-4 shrink-0 text-amber-600" />
                <div>
                  <p className="text-xs font-bold text-ink-900">{item.label}</p>
                  <p className="text-[11px] text-ink-500">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
