const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
     house :{
        type : mongoose.Schema.ObjectId,
        ref : 'House',
        required : [true, 'each property must be rented out']
     },
     user :{
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : [true, 'each property must have user renting it']
     },
     price : {
        type : Number,
        required : [true, 'property must have a price']
     },
     createdAt : {
        type : Date,
        default : Date.now()
     },
     paid : {
        type : Boolean,
        default : true
     }

});

bookingSchema.pre(/^find/, function (next){
    this.populate('user').populate({
        path :'house',
        select : 'name'
    });
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;