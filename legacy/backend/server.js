const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // Added for password hashing
const { User, Booking, Reservation, Support, Train } = require("./database"); // Import models

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "http://localhost:3000", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../public(frontend)")));

// Serve index.html at the root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public(frontend)", "index.html"));
});

// ----------------------
// User Authentication
// ----------------------

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found. Please register!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Incorrect password!" });

    res.json({ message: "Login successful!" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Signup Route
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "User already exists. Please log in." });

    const hashedPassword = await bcrypt.hash(password, 10); // Secure password storage
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.json({ message: "Registration successful! Please log in." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------
// Booking & Reservation
// ----------------------

// Book a Train
app.post("/book", async (req, res) => {
  try {
    const { from, to, date } = req.body;
    if (!from || !to || !date) return res.status(400).json({ error: "All fields are required!" });

    const newBooking = new Booking({ from, to, date });
    await newBooking.save();

    res.json({ message: "Booking successful!" });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Error processing booking" });
  }
});

// Reserve a Seat
app.post("/reserve", async (req, res) => {
  try {
    const { train, seat } = req.body;
    if (!train || !seat) return res.status(400).json({ error: "All fields are required!" });

    const newReservation = new Reservation({ train, seat });
    await newReservation.save();

    res.json({ message: "Reservation successful!" });
  } catch (err) {
    console.error("Reservation error:", err);
    res.status(500).json({ error: "Error processing reservation" });
  }
});

// ----------------------
// Support Requests
// ----------------------
app.post("/support", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: "All fields are required!" });

    const newSupport = new Support({ name, email, message });
    await newSupport.save();

    res.json({ message: "Support request received!" });
  } catch (err) {
    console.error("Support request error:", err);
    res.status(500).json({ error: "Error processing support request" });
  }
});

// ----------------------
// Train Schedule Management
// ----------------------

// Add Train Schedule
app.post("/add-train", async (req, res) => {
  try {
    const { train, departure, arrival, status } = req.body;
    if (!train || !departure || !arrival || !status) return res.status(400).json({ error: "All fields are required!" });

    const newTrain = new Train({ train, departure, arrival, status });
    await newTrain.save();

    res.status(201).json({ message: "Train schedule added successfully!" });
  } catch (error) {
    console.error("Train addition error:", error);
    res.status(500).json({ error: "Error adding train schedule" });
  }
});

// Fetch All Train Schedules
app.get("/trains", async (req, res) => {
  try {
    const trains = await Train.find();
    res.status(200).json(trains);
  } catch (error) {
    console.error("Train fetch error:", error);
    res.status(500).json({ error: "Error fetching train schedules" });
  }
});

// ----------------------
// Start the Server
// ----------------------
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
