const express = require ("express");
const rentalController = require("./../controllers/rentalController");
const authController = require('./../controllers/authController');
const router = express.Router();

router.get('/checkout-session/:houseId',
authController.protect,
rentalController.getCheckoutSession
)

module.exports = router;