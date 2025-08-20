const Booking = require('../Model/Booking.js');
const Room = require('../Model/Rooms.js');
const {catchAsync} = require('../Utils/CatchAsync.js');
const AppError = require('../Utils/AppError.js');
const ApiFilters=require("../Utils/ApiFilter.js") 

exports.getAllBookings = catchAsync(async (req, res, next) => {
 const filter=new ApiFilters(Booking.find(),req.query).filter().sort().fields().pagination();
  const Bookings = await filter.query.populate('customerId').populate('roomId').populate('staffId');
  res.status(200).json({ message: 'Bookings fetched successfully', Bookings });
});

exports.BookingsById = catchAsync(async (req, res, next) => {
  const getBookingById = await Booking.findById(req.params.id).populate('customerId').populate('roomId').populate('staffId');
  if (!getBookingById) {
    return next(new AppError('Booking not found', 404));
  }
  res.status(200).json({ message: 'Booking fetched successfully',getBookingById});
});

exports.createBooking = catchAsync(async (req, res, next) => {
  const { roomId, checkInDate, checkOutDate} = req.body;

  if (!roomId ||!checkInDate||!checkOutDate) {
    return next(new AppError("Room ID, check-in, and check-out dates are required", 400));
  }

  const existingBooking=await Booking.findOne({
    roomId,
    status: { $in: ['booked', 'checked-in'] },
    checkOutDate:{$gte:checkInDate},
    checkInDate:{$lte:checkOutDate}
  });

  if(existingBooking){
    return next(new AppError("This room is already booked in the selected period",400));
  }

  const inDate = new Date(checkInDate);
  const outDate = new Date(checkOutDate);

  const timeDiff = outDate.getTime() - inDate.getTime();
  const numberOfNights = timeDiff / (1000 * 60 * 60 * 24);
   if (numberOfNights <= 0) {
    return next(new AppError('Check-out date must be after check-in date', 400));
  }
  const room = await Room.findById(roomId);
if (!room) {
  return next(new AppError('Room not found', 404));
}
  const totalPrice = numberOfNights * room.pricePerNight;

  const bookingData={
    roomId,
    checkInDate,
    checkOutDate,
    totalPrice,
  }

    if (req.user.role === 'customer') {
    bookingData.customerId = req.user._id;
  } else if (req.user.role === 'staff') {
      if (!req.body.customerId) {
    return next(new AppError('Customer ID is required when staff creates a booking.', 400));
  }
  bookingData.staffId = req.user._id;
  bookingData.customerId = req.body.customerId;
  }

 const booking = await Booking.create(bookingData);

  res.status(201).json({
    status: "success",
    data: booking,
  });
});

exports.updateBooking = catchAsync(async (req, res, next) => {
    const { roomId, checkInDate, checkOutDate, totalPrice,status } = req.body;
  const updatebooking = await Booking.findByIdAndUpdate(
    req.params.id,
    {
     roomId,
     checkInDate,
    checkOutDate,
    totalPrice,
    status
    },
    { new: true, runValidators: true }
  );

  if (!updatebooking) {
    return next(new AppError('Booking not found', 404)); 
  }

  res.status(200).json({ message: 'Booking updated successfully', updatebooking });
});

exports.deleteBooking = catchAsync(async (req, res, next) => {
  const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
  if (!deletedBooking) {
    return next(new AppError('Booking not found', 404));
  }
  res.status(200).json({ message: 'Booking deleted successfully' });
});
