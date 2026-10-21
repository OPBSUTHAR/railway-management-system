const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/railway_management';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define schemas and models

// User Schema for login/signup
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
  from: String,
  to: String,
  date: Date,
  createdAt: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

// Reservation Schema
const reservationSchema = new mongoose.Schema({
  train: String,
  seat: String,
  createdAt: { type: Date, default: Date.now }
});
const Reservation = mongoose.model('Reservation', reservationSchema);

// Support Schema
const supportSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const Support = mongoose.model('Support', supportSchema);

// Train Schedule Schema
const trainSchema = new mongoose.Schema({
  train: { type: String, required: true },
  departure: { type: String, required: true },
  arrival: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Train = mongoose.model('Train', trainSchema);

module.exports = { User, Booking, Reservation, Support, Train }; // Export models only
