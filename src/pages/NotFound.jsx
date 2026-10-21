import { Link } from "react-router-dom";
import { ArrowRight, Home, MapPin, TrainFront } from "lucide-react";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <div className="relative">
        <p className="font-display text-[110px] font-extrabold leading-none tracking-tighter text-ink-100 sm:text-[160px]">404</p>
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-ink-950 text-amber-300 shadow-xl">
            <TrainFront className="h-7 w-7" />
          </span>
        </span>
      </div>
      <p className="eyebrow mt-6 text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Wrong platform
      </p>
      <h1 className="mt-3 text-balance font-display text-3xl font-extrabold sm:text-4xl">
        This route isn't on our timetable.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-500">
        The page you're looking for may have moved, or the link was mistyped. Let's get you back to a platform we serve.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn btn-primary px-5 py-2.5">
          <Home className="h-4 w-4" /> Back home
        </Link>
        <Link to="/schedule" className="btn btn-outline px-5 py-2.5">
          <MapPin className="h-4 w-4" /> View timetable
        </Link>
      </div>
      <Link to="/booking" className="link-underline mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700">
        Or just book a journey <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
