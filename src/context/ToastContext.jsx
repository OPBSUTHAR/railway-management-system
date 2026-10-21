import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

const ToastContext = createContext(null);

const TONE = {
  success: {
    icon: CheckCircle2,
    ring: "border-emerald-200 bg-emerald-50 text-emerald-900",
    iconClass: "text-emerald-600",
  },
  error: {
    icon: XCircle,
    ring: "border-rose-200 bg-rose-50 text-rose-900",
    iconClass: "text-rose-600",
  },
  info: {
    icon: Info,
    ring: "border-sky-200 bg-sky-50 text-sky-900",
    iconClass: "text-sky-600",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (message, tone = "success") => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToasts((current) => [...current.slice(-3), { id, message, tone }]);
      const timer = setTimeout(() => dismiss(id), 4200);
      timers.current.set(id, timer);
      return id;
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({
      push,
      dismiss,
      success: (message) => push(message, "success"),
      error: (message) => push(message, "error"),
      info: (message) => push(message, "info"),
    }),
    [push, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6">
        {toasts.map((toast) => {
          const tone = TONE[toast.tone] || TONE.info;
          const Icon = tone.icon;
          return (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-float animate-fade-up ${tone.ring}`}
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone.iconClass}`} aria-hidden />
              <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="rounded-full p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
