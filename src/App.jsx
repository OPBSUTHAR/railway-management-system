import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop, { RequireAuth } from "./components/AppGuards";
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
  const { pathname } = useLocation();
  const bare = pathname === "/login" || pathname === "/signup";

  return (
    <>
      <ScrollToTop />
      {bare ? null : <Navbar />}
      <main className={bare ? "" : "min-h-[60vh]"}>
        <Routes>
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
      </main>
      {bare ? null : <Footer />}
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
