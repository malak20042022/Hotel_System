const Room=require('../Model/Rooms.js');
const AppError = require('../Utils/AppError.js');
const { catchAsync } = require('../Utils/CatchAsync.js');
const ApiFilters=require("../Utils/ApiFilter.js");
const Rooms = require('../Model/Rooms.js');

const saveData=async(Data)=>{
    await fs.writeFile(filepath,JSON.stringify(Data,null,2));
};

exports.getAllRooms=catchAsync(async(req,res,next)=>{
     const filter=new ApiFilters(Rooms.find(),req.query).filter().sort().fields().pagination();
    const rooms=await filter.query;
    res.status(200).json({message:'rooms fetched successfully', rooms});
});

exports.RoomsById=catchAsync(async(req,res,next)=>{
    const getRoomById=await Room.findById(req.params.id);
    if(!getRoomById){
        return next(new AppError('Room not found', 404));
    }
    res.status(200).json({message:'room fetched successfully', getRoomById});
});

exports.createRoom=catchAsync(async(req,res,next)=>{
    const { roomNumber, type, pricePerNight, capacity,Floor} = req.body;
    const bookingData={
    roomNumber,
    type,
    pricePerNight,
    capacity,
    Floor
  }
    const newRoom=await Room.create(req.body);
    if(!newRoom){
        return next(new AppError('Room creation failed', 400));
    }
    res.status(201).json({message:'room created successfully',length:Room.length, newRoom});
});

exports.updateRoom=catchAsync(async(req,res,next)=>{
    const updateRoom= await Room.findByIdAndUpdate(
        {_id: req.params.id},
        req.body,
        {new: true, runValidators: true}
    );
    if(!updateRoom){
        return next(new AppError('Room not found', 404));
    }
    res.status(200).json({message:'Room updated successfully', updateRoom});
});

exports.deleteRoom=catchAsync(async(req,res,next)=>{
    const deletedRoom=await Room.findByIdAndDelete(req.params.id);
    if(!deletedRoom){
        return next(new AppError('Room not found', 404));
    }
    res.status(200).json({message:'Room deleted successfully'});
});
