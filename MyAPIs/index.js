require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bookingsRoutes = require('./routes/bookingsRoutes'); // New routes file
const app = express();

const PORT = process.env.PORT || 3000; // Use Railway-provided PORT if available
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelAgency';

// Middleware to enforce JSON
const enforceJson = (req, res, next) => {
  if (req.method !== "GET" && !req.headers["content-type"]) {
    return res.status(400).json({ success: false, message: "Missing Content-Type. Please use application/json." });
  }
  next();
};

// Middleware to parse JSON bodies
app.use(express.json());
app.use(enforceJson);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Use the bookings routes
app.use('/bookings', bookingsRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
