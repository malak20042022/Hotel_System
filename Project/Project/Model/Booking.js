const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rooms',
    required: true,
  },

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },

  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, 
  },

  checkInDate: {
    type: Date,
    required: true,
  },

  checkOutDate: {
    type: Date,
    required: true,
  },

  totalPrice: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ['booked', 'checked-in', 'checked-out', 'cancelled'],
    default: 'booked',
  }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
