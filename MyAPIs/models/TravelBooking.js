const mongoose = require('mongoose');

// Define the Itinerary schema
const ItinerarySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
});

// Define the Travel Booking schema
const TravelBookingSchema = new mongoose.Schema({
  user: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
    },
    phone: {
      type: String,
      required: true,
      match: /^[+]?[(]?[0-9]{1,4}[)]?[-\\s./0-9]*$/, // Phone number validation
    },
  },
  travelDates: {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
  },
  itinerary: {
    type: [ItinerarySchema], // Array of ItinerarySchema
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: '', // Optional field with a default value
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create the model
const TravelBooking = mongoose.model('TravelBooking', TravelBookingSchema);

module.exports = TravelBooking;
