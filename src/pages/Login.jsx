import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2, LockKeyhole, User } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next");
  const target = next && next.startsWith("/") ? next : "/bookings";

  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await login(form);
      toast.success(`Welcome back, ${session.name.split(" ")[0]}!`);
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function useDemo() {
    setForm({ username: "demo", password: "demo1234" });
    setError("");
    toast.info("Demo credentials filled in. Press sign in.");
  }

  return (
    <AuthLayout
      image="/images/auth-login.webp"
      imageSrcSet="/images/auth-login-700.webp 700w, /images/auth-login-1000.webp 1000w, /images/auth-login.webp 1400w"
      alt="Nilgiri Mountain Railway train crossing a stone viaduct"
      eyebrow="Welcome back"
      title="Sign in and pick up where you left off"
      subtitle="Your tickets, seat reservations and support threads live in one tidy account."
      footer={
        <>
          New to RailSetu?{" "}
          <Link to={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-ink-900 underline decoration-amber-400 decoration-2 underline-offset-4">
            Create a free account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-3">
        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">
            {error}
          </div>
        ) : null}

        <label className="block">
          <span className="field-label">Username</span>
          <div className="relative mt-1.5">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              className="field pl-10"
              value={form.username}
              onChange={(event) => update("username", event.target.value)}
              placeholder="e.g. demo"
              autoComplete="username"
              required
            />
          </div>
        </label>

        <label className="block">
          <span className="field-label">Password</span>
          <div className="relative mt-1.5">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              className="field px-10"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) => update("password", event.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-ink-400 transition hover:text-ink-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        <button type="submit" className="btn btn-primary w-full py-3" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-4 rounded-xl border border-dashed border-ink-200 bg-ink-50/70 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-600">Just exploring?</p>
            <p className="mt-0.5 text-xs text-ink-500">
              Use the demo traveller account — <span className="font-mono">demo / demo1234</span>
            </p>
          </div>
          <button type="button" onClick={useDemo} className="btn btn-outline px-3 py-2 text-xs">
            Fill demo login
          </button>
        </div>
      </div>

      <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
        Demo site: accounts and bookings are stored only in this browser's local storage. Do not use real passwords.
      </p>
    </AuthLayout>
  );
}
