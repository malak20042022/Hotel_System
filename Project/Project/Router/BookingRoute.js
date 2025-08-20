const express = require('express');
const { getAllBookings, BookingsById, createBooking, updateBooking, deleteBooking } = require('../Controller/BookingController');
const { protect } = require('../Controller/AuthController');

const router = express.Router();

router.use(protect);


router.get('/',getAllBookings);
router.get('/:id',BookingsById);
router.post('/',createBooking);
router.patch('/:id',updateBooking);
router.delete('/:id',deleteBooking);

module.exports = router;