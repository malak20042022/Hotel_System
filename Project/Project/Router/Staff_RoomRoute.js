const express = require('express');
const { getRoomsByStaff, getStaffByRoom, removeAssignment, CreateStaffToRoom, UpdateStaffToRoom } = require('../Controller/Staff_RoomController');
const router = express.Router();
const { protect, restrictTo} = require('../Controller/AuthController')

router.use(protect);

router.post('/',restrictTo("staff") ,CreateStaffToRoom);
router.get('/staff/:staffId',restrictTo("staff") , getRoomsByStaff);
router.get('/room/:roomId',restrictTo("staff") , getStaffByRoom);
router.patch('/:id', restrictTo("staff") ,UpdateStaffToRoom);
router.delete('/:id',restrictTo("staff"), removeAssignment);

module.exports = router;
