import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Signup() {
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next");
  const target = next && next.startsWith("/") ? next : "/bookings";

  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("Please accept the terms to create an account.");
      return;
    }
    setLoading(true);
    try {
      const session = await signup(form);
      toast.success(`Account created — welcome aboard, ${session.name.split(" ")[0]}!`);
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      image="/images/auth-signup.webp"
      imageSrcSet="/images/auth-signup-700.webp 700w, /images/auth-signup-1000.webp 1000w, /images/auth-signup.webp 1400w"
      alt="Train crossing the Pamban bridge over the sea"
      eyebrow="Join RailSetu"
      title="Create your travel account in seconds"
      subtitle="Book tickets, reserve seats and track trains — no paperwork, no queues."
      footer={
        <>
          Already have an account?{" "}
          <Link to={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-ink-900 underline decoration-amber-400 decoration-2 underline-offset-4">
            Sign in instead
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

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">Full name</span>
            <input
              className="field mt-1.5"
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Ananya Sharma"
              autoComplete="name"
              required
            />
          </label>
          <label className="block">
            <span className="field-label">Username</span>
            <input
              className="field mt-1.5"
              value={form.username}
              onChange={(event) => update("username", event.target.value)}
              placeholder="ananya_s"
              autoComplete="username"
              required
            />
          </label>
        </div>

        <label className="block">
          <span className="field-label">Email address</span>
          <input
            type="email"
            className="field mt-1.5"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">Password</span>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                className="field pr-10"
                value={form.password}
                onChange={(event) => update("password", event.target.value)}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
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
          <label className="block">
            <span className="field-label">Confirm password</span>
            <input
              type={showPassword ? "text" : "password"}
              className="field mt-1.5"
              value={form.confirm}
              onChange={(event) => update("confirm", event.target.value)}
              placeholder="Repeat password"
              autoComplete="new-password"
              required
            />
          </label>
        </div>

        <label className="flex items-start gap-2.5 text-xs leading-relaxed text-ink-500">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-ink-300 text-amber-500 accent-amber-500"
          />
          <span>
            I agree to the{" "}
            <Link to="/terms" className="font-semibold text-ink-800 underline underline-offset-2">
              terms of service
            </Link>{" "}
            and understand this is a demo application.
          </span>
        </label>

        <button type="submit" className="btn btn-primary w-full py-3" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
        Demo site: sign-up data is saved in your browser only. Never enter a password you use elsewhere.
      </p>
    </AuthLayout>
  );
}
