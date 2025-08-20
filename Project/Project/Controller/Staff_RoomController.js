const StaffRoom = require('../Model/Staff_Room.js');
const { catchAsync } = require('../Utils/CatchAsync.js');
const AppError = require('../Utils/AppError.js');

exports.CreateStaffToRoom = catchAsync(async (req, res, next) => {
  const { staffId, roomId } = req.body;

  if (!staffId || !roomId) {
    return next(new AppError('Staff ID and Room ID are required', 400));
  }

  const existing = await StaffRoom.findOne({ staffId, roomId });
  if (existing) {
    return next(new AppError('This staff member is already assigned to this room', 400));
  }

  const newAssignment = await StaffRoom.create({ staffId, roomId });
  res.status(201).json({
    message: 'Staff assigned to room successfully',
    data: newAssignment,
  });
});

exports.getRoomsByStaff = catchAsync(async (req, res, next) => {
  const { staffId } = req.params;

  if (!staffId) {
    return next(new AppError('Staff ID is required', 400));
  }

  const assignments = await StaffRoom.find({ staffId }).populate('roomId');

  if (!assignments || assignments.length === 0) {
    return next(new AppError('No rooms found for this staff member', 404));
  }

  res.status(200).json({
    message: 'Rooms retrieved successfully',
    data: assignments
  });
});

exports.getStaffByRoom = catchAsync(async (req, res, next) => {
  const { roomId } = req.params;

  if (!roomId) {
    return next(new AppError('Room ID is required', 400));
  }

  const assignments = await StaffRoom.find({ roomId }).populate('staffId');

  if (!assignments || assignments.length === 0) {
    return next(new AppError('No staff found for this room', 404));
  }

  res.status(200).json({
    message: 'Staff retrieved successfully',
    data: assignments
  });
});

exports.UpdateStaffToRoom = catchAsync(async (req, res, next) => {
  const updated = await StaffRoom.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updated) {
    return next(new AppError('Assignment not found', 404));
  }

  res.status(200).json({
    message: 'Assignment updated successfully',
    data: updated
  });
});

exports.removeAssignment = catchAsync(async (req, res, next) => {

  const assignment = await StaffRoom.findOneAndDelete(req.params.id);

  if (!assignment) {    
    return next(new AppError('Assignment not found', 404));
  }

  res.status(200).json({
    message: 'Assignment removed successfully'
  });
});

