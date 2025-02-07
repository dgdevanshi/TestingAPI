const express = require('express');
const TravelBooking = require('../models/TravelBooking');
const router = express.Router();
require('dotenv').config();

/**
 * GET /bookings
 * Retrieves all travel bookings.
 */

const authenticateGet = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const apiKey = process.env.SECRET_KEY; // Ensure no spaces

  console.log("Received Authorization Header:", authHeader);
  console.log("Loaded API Key from .env:", apiKey);

  if (!authHeader || authHeader.trim() !== `Bearer ${apiKey}`) {
    return res.status(403).json({ success: false, message: 'Unauthorized: Invalid API key' });
  }

  next();
};

router.get('/', authenticateGet, async (req, res) => {
  try {
    const bookings = await TravelBooking.find();
    res.json({ success: true, data: bookings, lenght: bookings.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
  }
});

/**
 * POST /bookings
 * Adds a new travel booking.
 */
router.post('/', async (req, res) => {
  const { user, travelDates, itinerary, destination, notes } = req.body;

  // Validation
  if (!user || !user.name || !user.email || !user.phone) {
    return res.status(400).json({ success: false, message: 'User details (name, email, phone) are required.' });
  }
  if (!travelDates || !travelDates.start || !travelDates.end) {
    return res.status(400).json({ success: false, message: 'Travel dates (start and end) are required.' });
  }
  if (!itinerary || !Array.isArray(itinerary) || itinerary.length === 0) {
    return res.status(400).json({ success: false, message: 'Itinerary must be a non-empty array.' });
  }
  if (!destination) {
    return res.status(400).json({ success: false, message: 'Destination is required.' });
  }

  try {
    const newBooking = new TravelBooking({
      user,
      travelDates,
      itinerary,
      destination,
      notes: notes || '',
    });

    const savedBooking = await newBooking.save();
    res.status(201).json({ success: true, data: savedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving booking', error: error.message });
  }
});

/**
 * PUT /bookings/:id
 * Updates an entire booking by ID.
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedBooking = await TravelBooking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    res.json({ success: true, data: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating booking', error: error.message });
  }
});

/**
 * PATCH /bookings/:id
 * Partially updates a booking by ID.
 */
router.patch('/:id', async (req, res) => {
  try {
    const updatedBooking = await TravelBooking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    res.json({ success: true, data: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error partially updating booking', error: error.message });
  }
});

/**
 * DELETE /bookings/:id
 * Deletes a booking by ID.
 */

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const apiKey = process.env.SECRET_KEY; // Load API key from .env

  if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
    return res.status(403).json({ success: false, message: 'Unauthorized: Invalid API key' });
  }
  
  next();
};


router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deletedBooking = await TravelBooking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    res.json({ success: true, message: 'Booking deleted successfully.', data: deletedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting booking', error: error.message });
  }
});

// Pass auth in header
// USE env variable to pass secret

module.exports = router;
