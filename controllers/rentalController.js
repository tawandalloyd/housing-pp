const Stripe = require('stripe');
const stripe = Stripe('sk_test_51MLY5NJ5qLHcLqY9eE9apuUyIsl0tFWzEf66KTeHKcYwdqWz6JE3ajntTZn416sOc3xth28gEwP59BapO4wTGsdv00UCqyDFJb');
const House = require('../models/houseModel'); 
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

exports.getCheckoutSession = catchAsync( async (req, res, next) =>{
    //get the house by id
    const house = await House.findById(req.params.houseId);

    //create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: "payment",
      success_url: `${req.protocol}://${req.get('host')}/`,
      cancel_url: `${req.protocol}://${req.get('host')}/house`,
      customer_email: req.user.email,
      client_reference_id : req.params.houseId,
      line_items: [
        {
            price_data:{
                currency:'usd',
                product_data:{
                    name : `${house.name} House`,
                },            
                //description: house.rooms_Available,
                unit_amount:house.rental_Price*100,
                         
            },
            quantity:1
        }
      ]
    })

    //session response
    res.status(200).json({
        status :"success",
        session
    })

});