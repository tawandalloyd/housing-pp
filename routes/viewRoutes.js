const viewController = require('./../controllers/viewsController');
const express = require('express');

const router = express.Router();

router
.route('/')
.get(viewController.getMyhouses);

module.exports = router;
