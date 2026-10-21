// main.js

document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // 1. LOGIN FORM
  // -----------------------------
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get form data
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      // Example: Send to server (but server doesn't store it)
      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const result = await response.text();
        alert(result);
        // For example, server might respond with "Login successful!" or "Invalid credentials!"
      } catch (err) {
        console.error("Login error:", err);
      }
    });
  }

  // -----------------------------
  // 2. BOOKING FORM
  // -----------------------------
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const from = document.getElementById("from").value;
      const to = document.getElementById("to").value;
      const date = document.getElementById("date").value;

      try {
        const response = await fetch("/book", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ from, to, date }),
        });

        const result = await response.text();
        alert(result);
        // E.g., "Booking received!"
      } catch (err) {
        console.error("Booking error:", err);
      }
    });
  }

  // -----------------------------
  // 3. RESERVATION FORM
  // -----------------------------
  const reservationForm = document.getElementById("reservationForm");
  if (reservationForm) {
    reservationForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const train = document.getElementById("train").value;
      const seat = document.getElementById("seat").value;

      try {
        const response = await fetch("/reserve", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ train, seat }),
        });

        const result = await response.text();
        alert(result);
        // E.g., "Reservation received!"
      } catch (err) {
        console.error("Reservation error:", err);
      }
    });
  }

  // -----------------------------
  // 4. SUPPORT FORM
  // -----------------------------
  const supportForm = document.getElementById("supportForm");
  if (supportForm) {
    supportForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      try {
        const response = await fetch("/support", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, message }),
        });

        const result = await response.text();
        alert(result);
        // E.g., "Support request received!"
      } catch (err) {
        console.error("Support error:", err);
      }
    });
  }

  // -----------------------------
  // 5. TRACKING PAGE
  // -----------------------------
  // If you have any map-related JS or dynamic functionality, put it here.
  // By default, your tracking.html just has an <iframe> for the map, so no form to submit.
  // Example:
  const trackingPage = document.getElementById("trackingPage");
  if (trackingPage) {
    console.log("Tracking page loaded. No form submission here.");
    // You could add code to poll a server for train location, etc.
  }

  // -----------------------------
  // 6. SCHEDULING PAGE
  // -----------------------------
  // Currently, scheduling.html only displays a table, so no form to handle.
  const schedulingPage = document.getElementById("schedulingPage");
  if (schedulingPage) {
    console.log("Scheduling page loaded. No form submission here.");
  }

  // -----------------------------
  // 7. ABOUT US PAGE
  // -----------------------------
  // No form here either.
  const aboutUsPage = document.getElementById("aboutUsPage");
  if (aboutUsPage) {
    console.log("About Us page loaded. No form submission here.");
  }

  // -----------------------------
  // 8. TERMS & CONDITIONS PAGE
  // -----------------------------
  // No form here either.
  const termsPage = document.getElementById("termsPage");
  if (termsPage) {
    console.log("Terms and Conditions page loaded. No form submission here.");
  }
});

