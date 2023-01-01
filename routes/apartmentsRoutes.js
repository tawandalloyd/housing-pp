const express = require('express');
const apartmentsController = require('./../controllers/apartmentsController')
const router = express.Router();

router
.route('/')
.get(apartmentsController.getAllApartments)
.post(apartmentsController.createApartment)

router
.route('/:id')
.get(apartmentsController.getApartment)
.patch(apartmentsController.updateApartment)
.delete(apartmentsController.deleteApartment)

module.exports = router;