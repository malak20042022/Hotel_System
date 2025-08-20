const express= require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config({path: './.env'}); 
const App = express();

App.use(express.json());
App.use(morgan('dev'));

const UserRouting = require('./Router/UserRoute');
const BookingRouting = require('./Router/BookingRoute');
const InvoiceRouting = require('./Router/InvoiceRoute');
const ReviewRouting = require('./Router/ReviewRoute');
const RoomsRouting = require('./Router/RoomsRoute');
const StaffRoomRouting = require('./Router/Staff_RoomRoute');
const authRouting=require('./Router/AuthRoute');



App.use('/api/User',UserRouting);
App.use('/api/Booking', BookingRouting);
App.use('/api/Invoice', InvoiceRouting);
App.use('/api/Review', ReviewRouting);
App.use('/api/Rooms', RoomsRouting);
App.use('/api/StaffRoom', StaffRoomRouting);
App.use("/api/auth",authRouting)


App.use((err,req,res,next)=>{
    err.statusCode = err.statusCode || 5000;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
        status: err.status,
        error: err.message,
    });
});

module.exports = App;


