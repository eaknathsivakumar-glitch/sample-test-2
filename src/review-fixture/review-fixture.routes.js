const express = require('express');
const reviewFixtureController = require('./review-fixture.controller');

const router = express.Router();

router.post('/orders', reviewFixtureController.createOrder.bind(reviewFixtureController));

module.exports = router;
