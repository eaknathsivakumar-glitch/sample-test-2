const express = require('express');
const reviewFixture = require('./review-fixture');

const router = express.Router();

router.post('/review-fixture/orders', reviewFixture.createOrder);

module.exports = router;
