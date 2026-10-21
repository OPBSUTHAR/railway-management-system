import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AmbientBackground from "./components/AmbientBackground";
import { RequireAuth } from "./components/AppGuards";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Reservation from "./pages/Reservation";
import Tracking from "./pages/Tracking";
import Schedule from "./pages/Schedule";
import Scheduling from "./pages/Scheduling";
import Support from "./pages/Support";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

function Shell() {
  const location = useLocation();
  const [shown, setShown] = useState(location);
  const [phase, setPhase] = useState("in");
  const bare = shown.pathname === "/login" || shown.pathname === "/signup";

  useEffect(() => {
    if (phase !== "in") return undefined;
    const timer = window.setTimeout(() => setPhase("idle"), 520);
    return () => window.clearTimeout(timer);
  }, [phase, shown]);

  useEffect(() => {
    if (location.pathname === shown.pathname) {
      if (location.search !== shown.search || location.hash !== shown.hash) setShown(location);
      return undefined;
    }

    setPhase("out");
    const timer = window.setTimeout(() => {
      setShown(location);
      setPhase("in");
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 190);

    return () => window.clearTimeout(timer);
  }, [location, shown]);

  const pageClass = phase === "out" ? "page-exit" : phase === "in" ? "page-enter" : "";

  return (
    <>
      <AmbientBackground />
      <div className="site-glass relative z-10 flex min-h-screen flex-col">
        {bare ? null : <Navbar />}
        <main className={bare ? "flex-1" : "min-h-[60vh] flex-1"}>
          <div key={shown.pathname} className={pageClass}>
            <Routes location={shown}>
              <Route path="/" element={<Home />} />
              <Route path="/booking" element={<Booking />} />
              <Route
                path="/bookings"
                element={
                  <RequireAuth>
                    <MyBookings />
                  </RequireAuth>
                }
              />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route
                path="/scheduling"
                element={
                  <RequireAuth>
                    <Scheduling />
                  </RequireAuth>
                }
              />
              <Route path="/support" element={<Support />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
        {bare ? null : <Footer />}
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Shell />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
