const express = require('express');
const tourController = require('./../controllers/houseController');
const authController = require('./../controllers/authController');
const router = express.Router();

router
.route('/')
.get(authController.protect, tourController.getAllHouses)
.post(tourController.createHouse)

router
.route('/:id')
.get(tourController.getHouse)
.patch(tourController.updateHouse)
.delete(authController.protect,authController.restrictTo('admin'), tourController.deleteHouse)

module.exports = router;