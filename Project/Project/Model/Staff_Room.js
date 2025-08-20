const mongoose = require('mongoose');

const staffRoomSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rooms',
    required: true
  }
});

const StaffRoom = mongoose.model("StaffRoom", staffRoomSchema);
module.exports = StaffRoom;
