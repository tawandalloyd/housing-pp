const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

exports.getMyhouses = catchAsync( async(req,res,next) =>{
 const booking = await Booking.find({user : req.user.id})

 const houseId = booking.map( el => el.house);
 const houses = await Booking.find({ _id : {$in: houseId}})
    
 res.status(200).json({
    title : "Rented property",
    houses
 });
 next();
});
