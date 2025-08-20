const express = require('express');
const { getAllRooms, RoomsById, createRoom,updateRoom,deleteRoom } = require('../Controller/RoomsController');
const {protect, restrictTo}=require('../Controller/AuthController');

const router = express.Router();
router.use(protect);

router.get('/', getAllRooms);
router.get('/:id', RoomsById);
router.post('/',restrictTo("staff"), createRoom);
router.patch('/:id',restrictTo("staff") ,updateRoom);
router.delete('/:id', restrictTo("staff"),deleteRoom);

module.exports = router;
