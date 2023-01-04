const express = require('express');
const tourController = require('./../controllers/houseController');
const authController = require('./../controllers/authController');
const rentalController = require('./../controllers/rentalController');

const router = express.Router();

router
.route('/')
.get( authController.protect, tourController.getAllHouses)
.post(tourController.createHouse)

//.get(rentalController.createBookingCheckout, authController.protect, tourController.getAllHouses)

router
.route('/:id')
.get(tourController.getHouse)
.patch(tourController.updateHouse)
.delete(authController.protect,authController.restrictTo('admin'), tourController.deleteHouse)

module.exports = router;