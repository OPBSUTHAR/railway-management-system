import { Link } from "react-router-dom";
import { ArrowLeft, FileText, ShieldAlert } from "lucide-react";
import PageHero from "../components/PageHero";

const SECTIONS = [
  {
    id: "demo",
    title: "1. About this demo",
    body: [
      "RailSetu is an independent, non-commercial demonstration project. It is not affiliated with, endorsed by or connected to Indian Railways, IRCTC or any government body.",
      "No ticket purchased here is valid for travel. No payment is collected. All accounts, bookings, PNRs and support threads are stored only in the browser's local storage on the device you use.",
    ],
  },
  {
    id: "acceptance",
    title: "2. Acceptance of terms",
    body: [
      "By creating an account or using any part of RailSetu you agree to these terms. If you do not agree, please do not use the application.",
      "You must be at least 18 years old, or use the site under the supervision of a parent or guardian.",
    ],
  },
  {
    id: "accounts",
    title: "3. Accounts and credentials",
    body: [
      "You are responsible for the accuracy of the details you enter and for keeping your device secure. Passwords are hashed with SHA-256 before being stored in local storage.",
      "Because this is a demonstration, do not reuse a password from any other service. Clearing your browser data will permanently remove your RailSetu account and its bookings.",
    ],
  },
  {
    id: "bookings",
    title: "4. Bookings and fares",
    body: [
      "Fares are generated from a base fare plus a per-kilometre rate for each class, with a ₹30 convenience fee and 5% GST. They are illustrative and do not reflect actual railway tariffs.",
      "A booking is confirmed only in the browser session where it was created. It will not appear on another device, another browser or a private window.",
    ],
  },
  {
    id: "cancellations",
    title: "5. Cancellations and refunds",
    body: [
      "Tickets can be cancelled from My tickets. Cancellation immediately marks the ticket cancelled and, in the demo, shows a refund reference. No funds are transferred.",
      "Seat reservations can be cancelled from the Seat reservations page and the seats are released back to the local seat map.",
    ],
  },
  {
    id: "reservations",
    title: "6. Seat reservations",
    body: [
      "Seat availability on the coach map is generated deterministically from the train, date and class. It is not a real-time inventory feed.",
      "Up to four seats may be held per reservation. A reservation does not create a ticket; it records a seat preference in this demo.",
    ],
  },
  {
    id: "timetables",
    title: "7. Timetables, delays and tracking",
    body: [
      "Train timetables and running status are simulated. Positions are interpolated from scheduled times and do not represent the actual location of any train.",
      "Do not rely on RailSetu for real travel decisions. Always check official railway sources before travelling.",
    ],
  },
  {
    id: "privacy",
    title: "8. Privacy and data",
    body: [
      "RailSetu does not run a server, set advertising cookies or send your personal data anywhere. Everything you enter stays in this browser's local storage.",
      "You can erase all data by clearing site data for this domain in your browser settings.",
    ],
  },
  {
    id: "liability",
    title: "9. Limitation of liability",
    body: [
      "The application is provided “as is”, without warranties of any kind. To the fullest extent permitted by law, the project authors are not liable for any loss arising from use of the site or reliance on its content.",
    ],
  },
  {
    id: "conduct",
    title: "10. Acceptable use",
    body: [
      "Do not attempt to disrupt the application, upload malicious content, impersonate another person, or use the support form for unlawful or abusive messages.",
      "We may remove content or restrict access at our discretion.",
    ],
  },
  {
    id: "changes",
    title: "11. Changes to these terms",
    body: [
      "These terms may be updated as the project evolves. The revision date at the top of this page reflects the latest version. Continued use after a change constitutes acceptance.",
    ],
  },
];

export default function Terms() {
  return (
    <div>
      <PageHero
        eyebrow="Terms of service"
        title="The fine print, in plain language."
        description="RailSetu is a student-built demonstration of a railway booking experience. These terms explain what that means for your data, your bookings and your expectations."
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800">
            <ShieldAlert className="h-4 w-4" /> Not a real ticketing service
          </span>
        }
      />

      <section className="bubble-section container-x py-10">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:items-start">
          <aside className="card sticky top-24 hidden p-4 lg:block">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-400">
              <FileText className="h-3.5 w-3.5" /> On this page
            </p>
            <nav className="mt-3 space-y-1">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-md px-2 py-1.5 text-[11px] text-ink-500 transition hover:bg-ink-50 hover:text-ink-900"
                >
                  {section.title}
                </a>
              ))}
            </nav>
            <p className="mt-4 border-t border-dashed border-ink-200 pt-3 text-[10px] text-ink-400">Last updated: 21 October 2026</p>
          </aside>

          <div>
            <div className="overflow-hidden rounded-3xl">
              <img src="/images/terms.jpg" alt="Passengers on a station platform" className="h-48 w-full object-cover sm:h-64" />
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="flex items-start gap-2 text-sm font-bold leading-relaxed text-amber-900">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                Important: this is a demo application, not a railway operator.
              </p>
              <p className="mt-1.5 pl-6 text-xs leading-relaxed text-amber-800">
                Do not use RailSetu for real journeys, do not enter sensitive personal information and do not reuse an
                existing password. For genuine reservations, use IRCTC or an authorised railway counter.
              </p>
            </div>

            <div className="mt-6 space-y-8">
              {SECTIONS.map((section) => (
                <article key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="font-display text-xl font-bold text-ink-900">{section.title}</h2>
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="mt-2.5 text-sm leading-relaxed text-ink-500">
                      {paragraph}
                    </p>
                  ))}
                </article>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-ink-100 pt-6">
              <Link to="/" className="btn btn-outline px-4 py-2.5 text-xs">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to home
              </Link>
              <Link to="/support" className="btn btn-primary px-4 py-2.5 text-xs">
                Questions? Contact support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
