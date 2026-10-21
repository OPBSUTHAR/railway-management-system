import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  Headphones,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldAlert,
  Ticket,
} from "lucide-react";
import PageHero from "../components/PageHero";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { KEYS, read, write } from "../lib/storage";
import { formatDate } from "../lib/dates";

const CATEGORIES = ["Booking issue", "Refund status", "Seat reservation", "Train delay", "Lost item", "Something else"];

const FAQS = [
  {
    question: "Is RailSetu a real booking platform?",
    answer:
      "No. RailSetu is a full-stack demo project. Tickets, payments and PNRs are simulated and stored only in your browser. No real railway reservation is created and no money is charged.",
  },
  {
    question: "How do I cancel a ticket?",
    answer:
      "Open My tickets from your account menu, find the journey and choose Cancel ticket. In this demo the cancellation is instant and a refund reference is generated.",
  },
  {
    question: "Where can I find my PNR?",
    answer:
      "Every confirmed e-ticket shows a 10-digit PNR in its header and details grid. You can also search that PNR on the Track page to jump to the journey.",
  },
  {
    question: "Why does a train show 'Not running'?",
    answer:
      "The operations console lets you mark services delayed or cancelled. Those states are illustrative and can be switched back at any time from Manage schedules.",
  },
  {
    question: "Can I book for more than one passenger?",
    answer:
      "Yes — up to six passengers in a single booking. Each passenger gets an individual name, age and gender entry, and seats are assigned together.",
  },
  {
    question: "Do you store my password?",
    answer:
      "Only a SHA-256 hash is kept in localStorage; the plain password never leaves your browser. Because this is a demo, please don't reuse a real password.",
  },
];

export default function Support() {
  const { user } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    category: CATEGORIES[0],
    pnr: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const [tickets, setTickets] = useState(() =>
    user ? read(KEYS.support, []).filter((ticket) => ticket.username === user.username) : [],
  );

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function submit(event) {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email.";
    if (form.subject.trim().length < 4) next.subject = "Add a short subject.";
    if (form.message.trim().length < 12) next.message = "Please describe the issue in a little more detail.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const ticket = {
      id: `TKT-${Date.now().toString(36).toUpperCase()}`,
      username: user?.username || null,
      name: form.name.trim(),
      email: form.email.trim(),
      category: form.category,
      pnr: form.pnr.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      status: "Open",
      createdAt: new Date().toISOString(),
    };
    write(KEYS.support, [ticket, ...read(KEYS.support, [])]);
    setSubmitted(ticket);
    if (user) setTickets((current) => [ticket, ...current]);
    setForm({ ...form, subject: "", message: "", pnr: "" });
    toast.success(`Request ${ticket.id} received. Our team will reply by email.`);
  }

  return (
    <div>
      <PageHero
        eyebrow="Help centre"
        title="Real people, ready to help."
        description="Questions about a booking, a seat or a delay? Send us the details and keep every reply in one thread. Average first response in this demo: instantly acknowledged, replied within a day."
        actions={
          <a href="tel:139" className="btn btn-primary px-4 py-2.5">
            <Phone className="h-4 w-4" /> Call 139
          </a>
        }
      />

      <section className="bubble-section container-x py-10">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-100 text-amber-700">
                <MessageSquare className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold">Raise a support request</h2>
                <p className="text-[11px] text-ink-500">We reply to the email you provide.</p>
              </div>
            </div>

            {submitted ? (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                  <CheckCircle2 className="h-4 w-4" /> Request received · {submitted.id}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-emerald-800">
                  We've logged “{submitted.subject}” under {submitted.category}. A copy has been saved in this browser
                  {user ? " and appears under your requests below." : ". Sign in next time to keep a history."}
                </p>
                <button type="button" onClick={() => setSubmitted(null)} className="mt-3 text-xs font-semibold text-emerald-900 underline underline-offset-2">
                  Raise another request
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-5 grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="field-label">Your name</span>
                    <input
                      className={`field mt-1.5 ${errors.name ? "border-rose-300" : ""}`}
                      value={form.name}
                      onChange={(event) => update("name", event.target.value)}
                      placeholder="Full name"
                    />
                    {errors.name ? <span className="mt-1 block text-[11px] text-rose-600">{errors.name}</span> : null}
                  </label>
                  <label className="block">
                    <span className="field-label">Email</span>
                    <input
                      type="email"
                      className={`field mt-1.5 ${errors.email ? "border-rose-300" : ""}`}
                      value={form.email}
                      onChange={(event) => update("email", event.target.value)}
                      placeholder="you@example.com"
                    />
                    {errors.email ? <span className="mt-1 block text-[11px] text-rose-600">{errors.email}</span> : null}
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="field-label">Category</span>
                    <select className="field mt-1.5" value={form.category} onChange={(event) => update("category", event.target.value)}>
                      {CATEGORIES.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="field-label">PNR (optional)</span>
                    <input
                      className="field mt-1.5 font-mono"
                      value={form.pnr}
                      inputMode="numeric"
                      onChange={(event) => update("pnr", event.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit PNR"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="field-label">Subject</span>
                  <input
                    className={`field mt-1.5 ${errors.subject ? "border-rose-300" : ""}`}
                    value={form.subject}
                    onChange={(event) => update("subject", event.target.value)}
                    placeholder="Briefly, what's wrong?"
                  />
                  {errors.subject ? <span className="mt-1 block text-[11px] text-rose-600">{errors.subject}</span> : null}
                </label>

                <label className="block">
                  <span className="field-label">How can we help?</span>
                  <textarea
                    rows="5"
                    className={`field mt-1.5 resize-y ${errors.message ? "border-rose-300" : ""}`}
                    value={form.message}
                    onChange={(event) => update("message", event.target.value)}
                    placeholder="Include dates, train numbers and anything you've already tried."
                  />
                  {errors.message ? <span className="mt-1 block text-[11px] text-rose-600">{errors.message}</span> : null}
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <button type="submit" className="btn btn-primary px-5 py-2.5">
                    <Send className="h-4 w-4" /> Send request
                  </button>
                  <p className="text-[10px] text-ink-400">Demo form — no message leaves your browser.</p>
                </div>
              </form>
            )}
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
              <img src="/images/support.jpg" alt="Railway support desk" className="h-40 w-full object-cover" />
              <div className="p-5">
                <p className="font-display text-lg font-bold">Talk to us directly</p>
                <div className="mt-3 space-y-3 text-xs">
                  <a href="tel:139" className="flex items-start gap-3 rounded-lg border border-ink-100 p-3 transition hover:border-amber-300">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <span>
                      <span className="block font-semibold text-ink-900">139 · Rail Madad</span>
                      <span className="text-ink-500">24×7 passenger assistance</span>
                    </span>
                  </a>
                  <a href="mailto:help@railsetu.in" className="flex items-start gap-3 rounded-lg border border-ink-100 p-3 transition hover:border-amber-300">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <span>
                      <span className="block font-semibold text-ink-900">help@railsetu.in</span>
                      <span className="text-ink-500">Replies within one working day</span>
                    </span>
                  </a>
                  <div className="flex items-start gap-3 rounded-lg border border-ink-100 p-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <span>
                      <span className="block font-semibold text-ink-900">RailSetu operations desk</span>
                      <span className="text-ink-500">Platform 1, Central Station, Mumbai</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <p className="flex items-center gap-2 text-xs font-bold text-rose-900">
                <ShieldAlert className="h-4 w-4" /> In an emergency
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-rose-800">
                For security or medical emergencies on a train, call <span className="font-bold">182</span> (Railway
                Protection Force) or <span className="font-bold">112</span>. This demo form is not monitored.
              </p>
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-ink-100 bg-white p-4 text-[11px] leading-relaxed text-ink-500">
              <Headphones className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
              Support requests are stored locally so you can see how a ticketing workflow fits into the app. A production
              build would connect this form to a real helpdesk.
            </div>
          </div>
        </div>

        {user ? (
          <div className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-xl font-bold">Your requests</h2>
                <p className="mt-1 text-xs text-ink-500">Threads raised from this account in this browser.</p>
              </div>
              <span className="chip bg-white text-ink-500">{tickets.length} total</span>
            </div>
            {tickets.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-ink-200 bg-white p-8 text-center">
                <Ticket className="mx-auto h-7 w-7 text-ink-300" />
                <p className="mt-2 text-sm font-semibold text-ink-700">No support requests yet</p>
                <p className="text-xs text-ink-500">Anything you submit above will appear here.</p>
              </div>
            ) : (
              <div className="mt-4 grid gap-3">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="rounded-2xl border border-ink-100 bg-white p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-ink-900">{ticket.subject}</p>
                          <StatusBadge status={ticket.status} />
                        </div>
                        <p className="mt-1 text-[11px] text-ink-500">
                          {ticket.id} · {ticket.category} · {formatDate(ticket.createdAt, { weekday: undefined })}
                          {ticket.pnr ? ` · PNR ${ticket.pnr}` : ""}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] text-ink-400">
                        <Clock3 className="h-3 w-3" /> Acknowledged
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-ink-600">{ticket.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        <div className="mt-10">
          <h2 className="font-display text-xl font-bold">Frequently asked questions</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {FAQS.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-ink-100 bg-white p-4 open:border-amber-200">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-ink-900">
                  {item.question}
                  <ChevronDown className="h-4 w-4 shrink-0 text-ink-400 transition group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-xs leading-relaxed text-ink-500">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
