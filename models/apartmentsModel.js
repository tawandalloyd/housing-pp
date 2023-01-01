const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
    name :{
        type : String,
        required :[true,'the name of the place'],
        unique : true
    },
    address : {
        type : String,
        required : [true, ' house  must have address'],
        unique : true
    },
    rental_Price :{
         type : Number,
         required :[true, 'house must have a price']
    },
    rooms_Available : {
        type : Number,
        required :[true,'users must know the rooms available']
    },
    ratingsAverage :{
        type : Number,
        default : 4.5
    },
    ratingsQuantity : {
        type : Number,
        default :0
    }

})

const Apartment = mongoose.model('Apartment',apartmentSchema);
module.exports = Apartment;