const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
  },

  type: {
    type: String,
    enum: ['single', 'double', 'suite', 'deluxe'],
    required: true,
  },

  pricePerNight: {
    type: Number,
    required: true,
  },

  capacity: {
    type: Number,
    required: true,
  },
Floor:{
    type: Number,
    required: true,
  }
});
const Rooms = mongoose.model("Rooms", roomSchema);
module.exports = Rooms;
